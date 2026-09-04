# TrueCalci Authentication Integration Guide: GitHub & Google OAuth 2.0

This guide provides the complete, step-by-step instructions for configuring and deploying production OAuth 2.0 authentication for **GitHub** and **Google** on TrueCalci.

---

## Architecture Overview

```
User Clicks "Continue with GitHub / Google"
   │
   ▼
[Client] Initiates OAuth 2.0 Authorization Code Flow
   │
   ▼
[Provider] User approves permissions on GitHub / Google consent screen
   │
   ▼
[Callback] Provider redirects back to TrueCalci:
   • GitHub: /api/auth/callback/github?code=...
   • Google: /api/auth/callback/google?code=...
   │
   ▼
[Backend] TrueCalci Edge Worker / Server exchanges code for Access Token:
   • Fetches verified user identity (name, email, avatar, user ID)
   • Generates cryptographic session JWT token
   • Provisions active API Key (tc_live_starter_...) mapped to rate limiter
   │
   ▼
[Client] Session saved in localStorage (tc_dev_auth, tc_dev_user), UI unlocks developer portal
```

---

## 1. GitHub OAuth 2.0 App Setup

### Step 1.1: Register a New GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. In the left sidebar, select **OAuth Apps** and click **New OAuth App** (or [click here](https://github.com/settings/applications/new)).
3. Fill in the application details:
   - **Application name**: `TrueCalci Developer Cloud`
   - **Homepage URL**: `https://truecalci.com` (or `http://localhost:4000` for local testing)
   - **Application description**: `Deterministic Computational Engine & AI Agent Tool API`
   - **Authorization callback URL**: 
     - Production: `https://truecalci.com/api/auth/callback/github`
     - Development: `http://localhost:4000/api/auth/callback/github`
4. Click **Register application**.

### Step 1.2: Retrieve Credentials
1. Copy your **Client ID** (e.g., `Iv23...`).
2. Under **Client secrets**, click **Generate a new client secret**.
3. Copy the generated **Client Secret** immediately (it will only be shown once).

---

## 2. Google OAuth 2.0 Setup

### Step 2.1: Configure OAuth Consent Screen
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create your project: **TrueCalci-Platform**.
3. In the navigation menu, go to **APIs & Services** → **OAuth consent screen**.
4. Select **External** and click **Create**.
5. Fill in the required fields:
   - **App name**: `TrueCalci`
   - **User support email**: Your developer email
   - **Developer contact information**: Your developer email
6. In the **Scopes** step, click **Add or Remove Scopes** and select:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
7. Save and continue.

### Step 2.2: Create OAuth 2.0 Web Client ID
1. In the navigation menu, go to **APIs & Services** → **Credentials**.
2. Click **+ Create Credentials** at the top, and select **OAuth client ID**.
3. Configure the credential:
   - **Application type**: **Web application**
   - **Name**: `TrueCalci Web Client`
   - **Authorized JavaScript origins**:
     - `https://truecalci.com`
     - `http://localhost:4000`
   - **Authorized redirect URIs**:
     - `https://truecalci.com/api/auth/callback/google`
     - `http://localhost:4000/api/auth/callback/google`
4. Click **Create**.
5. Copy both the **Client ID** and **Client Secret**.

---

## 3. Where & How to Run: Environment & Secrets Setup

### Which Terminal Should You Use? (PowerShell vs. WSL)
You should run these commands in **Standard Windows PowerShell** (or CMD) directly inside your project folder (`c:\Calculator`).
- **You do NOT need WSL**: Node.js, `npm`, and `npx` are already running natively on your Windows environment.
- Simply open your Windows terminal or the Antigravity integrated terminal and ensure your current directory is `c:\Calculator`.

---

### Local Testing vs. Online Cloudflare Architecture

TrueCalci uses a modern **dual architecture**:

| Mode | Where it Runs | Domain / URL | Port | How Secrets Are Handled |
| :--- | :--- | :--- | :--- | :--- |
| **Local Development** | Your laptop (`server.mjs`) | `http://localhost:4000` | **4000** | Stored in local `.env` file |
| **Online Production** | Cloudflare Edge (`_worker.js`) | `https://truecalci.com` | **No Port (Global Edge)** | Encrypted in Cloudflare Secrets |

---

### 3.1 For Local Testing on Your Computer (`PORT 4000`)
When running locally with `node server.mjs`, you test OAuth on your own machine.

1. In PowerShell at `c:\Calculator`, create a `.env` file:
```env
PORT=4000

# GitHub OAuth Credentials
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Local Origin for Redirection
OAUTH_REDIRECT_ORIGIN="http://localhost:4000"
```

2. Start the local server:
```powershell
node server.mjs
```
3. Open `http://localhost:4000` in your browser. When testing locally, GitHub will redirect back to `http://localhost:4000/api/auth/callback/github`.

---

### 3.2 For Online Production on Cloudflare (`truecalci.com`)
In production, your site is deployed to Cloudflare Pages & Workers. There is **no port 4000** online because Cloudflare distributes your app across 300+ global edge data centers.

Because you never commit secrets to Git/GitHub, you inject your secrets directly into Cloudflare's encrypted key-value store.

Run these 4 commands in **Windows PowerShell** inside `c:\Calculator`:

```powershell
# 1. Set GitHub Client ID
npx wrangler secret put GITHUB_CLIENT_ID

# 2. Set GitHub Secret
npx wrangler secret put GITHUB_CLIENT_SECRET

# 3. Set Google Client ID
npx wrangler secret put GOOGLE_CLIENT_ID

# 4. Set Google Secret
npx wrangler secret put GOOGLE_CLIENT_SECRET
```
*(When prompted, simply paste the secret value and press Enter).*

#### Alternative: Cloudflare Web Dashboard (No Terminal Required)
If you prefer not to use the terminal for production secrets:
1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com/).
2. Go to **Workers & Pages** → select your **truecalci** project.
3. Click **Settings** → **Variables and Secrets**.
4. Click **Add Secret** and paste:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
5. Click **Save and Deploy**. Cloudflare automatically makes them available to `_worker.js` in production!

---

## 4. Backend Token Exchange Implementation

The backend handlers are pre-built in [`server.mjs`](file:///c:/Calculator/server.mjs) and [`_worker.js`](file:///c:/Calculator/_worker.js):

### GitHub Exchange Endpoint:
```javascript
// POST /api/auth/callback/github
const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
  method: "POST",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    client_id: env.GITHUB_CLIENT_ID,
    client_secret: env.GITHUB_CLIENT_SECRET,
    code: authCode
  })
});
const { access_token } = await tokenRes.json();

// Fetch Profile
const userRes = await fetch("https://api.github.com/user", {
  headers: { "Authorization": `Bearer ${access_token}`, "User-Agent": "TrueCalci" }
});
const profile = await userRes.json();
```

### Google Exchange Endpoint:
```javascript
// POST /api/auth/callback/google
const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    code: authCode,
    grant_type: "authorization_code",
    redirect_uri: `${origin}/api/auth/callback/google`
  })
});
const { access_token } = await tokenRes.json();

// Fetch Profile
const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  headers: { "Authorization": `Bearer ${access_token}` }
});
const profile = await userRes.json();
```

---

## 5. Client-Side Integration in TrueCalci

1. **Header Trigger**: Clicking **"Sign In Free"** in the top navbar opens the Auth Modal.
2. **Tabbed Modes**:
   - **Sign In Tab**: Fast login for returning developers.
   - **Create Free Account Tab**: Instant zero-friction onboarding with key generation.
3. **Session Persistence**:
   - `localStorage.setItem("tc_dev_auth", "true")`
   - `localStorage.setItem("tc_dev_user", JSON.stringify(user))`
4. **Instant Upgrade**: Once authenticated, clicking any tier button on `#pricing` seamlessly opens the Dodo Payments Merchant of Record checkout pre-filled with the developer's name and email.
