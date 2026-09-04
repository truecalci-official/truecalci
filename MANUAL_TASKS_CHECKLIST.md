# TrueCalci: Master Manual Tasks Checklist (For Platform Owner)

> **Owner's Action Dashboard**: This checklist covers the manual credentials, dashboard configurations, and settings required for **TrueCalci**. Complete these at your convenience while system development proceeds under the strict *no-code / plan-first* directive.

---

## 1. Quick Task Matrix

| Dimension | Task Description | Target Environment | Owner Action Required | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Security** | Change default Master Admin PIN (`admin2026`) | Local & Edge Worker | Update PIN in source or Cloudflare Access | 🟡 Pending Owner PIN |
| **Monetization** | Dodo Payments API Keys & Webhooks | Dodo Merchant Portal | Retrieve `pk_live`, `sk_live`, `whsec` | 🟡 Ready for Keys |
| **Cloudflare $5 Paid** | KV Namespace & Cron Triggers | Cloudflare Dashboard | Create KV `TRUECALCI_KV` & verify cron schedule | 🟡 Awaiting Deployment |
| **Cloudflare Security** | Edge Rate Limiting & Zero Trust | Cloudflare Zero Trust | Protect `/admin` route via email OTP | 🟡 Recommended |
| **Agent Clients** | Connect Claude Desktop & Cursor IDE | Local Machine | Paste JSON config to enable 19 MCP tools | 🟢 Documented Below |
| **Legal Compliance** | Universal Non-Affiliation & CA/CPA Disclaimers | All Views & APIs | Zero trademark names; pure mathematical disclaimers | 🟢 Ready in Spec |

---

## Task 1: Admin Telemetry Portal Access & Master PIN

### Current Credentials
To view the live telemetry dashboard locally or in staging:
- **URL**: `https://truecalci.com/#admin` (or `http://localhost:3000/#admin`)
- **Default PIN**: `admin2026`

### How to Customize Your Private PIN
1. Open [`js/views/view-admin-portal.js`](file:///c:/Calculator/js/views/view-admin-portal.js#L130).
2. On line 130, replace `"admin2026"` with your private master passphrase:
```javascript
// c:\Calculator\js\views\view-admin-portal.js (Line 130)
if (pin === "YOUR_CUSTOM_SECRET_PIN") {
  this.isAuthenticated = true;
  this.renderDashboard();
}
```

> **Enterprise Tip (Cloudflare Zero Trust)**:
> In production, you do not need to rely on a static client PIN. Under your Cloudflare account, you can activate a free **Cloudflare Access** rule on `truecalci.com/#admin` that requires a 1-time PIN sent to your personal email or Google Workspace login.

---

## Task 2: Dodo Payments (Merchant of Record) Setup

TrueCalci uses **Dodo Payments** as its Merchant of Record (handling global VAT, GST, US State Sales Tax, and currency conversion automatically).

### Step-by-Step Setup:
1. **Sign in to Dodo Dashboard**:
   - Access [app.dodopayments.com](https://app.dodopayments.com).
2. **Retrieve API Keys**:
   - Navigate to **Developer Settings** → **API Keys**.
   - Copy **Publishable Key**: `pk_live_...` (or `pk_test_...` for sandbox).
   - Copy **Secret Key**: `sk_live_...`
   - Copy **Webhook Secret**: `whsec_...`
3. **Verify Products in Dodo Catalog**:
   - **Developer Starter**: `$5/month` (or `$48/year`) — 30,000 monthly request pool.
   - **Pro Agency**: `$15/month` (or `$144/year`) — 180,000 monthly request pool.
   - **Enterprise PAYG**: `$15 base` + `$1.00 per 1,000 requests` metered billing.
4. **Register Webhook Endpoint**:
   - URL: `https://truecalci.com/api/v1/webhooks/dodo`
   - Subscribed Events:
     - `payment.succeeded`
     - `subscription.created`
     - `subscription.active`
     - `subscription.cancelled`
     - `subscription.failed`

---

## Task 3: Cloudflare $5/mo Paid Tier Capabilities & Configuration

Your Cloudflare Workers Paid subscription ($5/mo) provides enterprise infrastructure that TrueCalci will leverage:

### 1. Cloudflare Workers KV (0ms Edge Caching)
- Used to store live FX exchange rates, AI token pricing matrices, and cached heavy computations.
- **Action**: In Cloudflare Dashboard → **Workers & Pages** → **KV**:
  - Create namespace: `TRUECALCI_KV`
  - In `wrangler.toml`, bind it:
    ```toml
    [[kv_namespaces]]
    binding = "TRUECALCI_KV"
    id = "<YOUR_KV_NAMESPACE_ID>"
    ```

### 2. Automated Cron Triggers (Live Rates Synchronization)
- Enables autonomous background jobs that query live market FX rates and LLM provider token pricing every hour, writing them to edge KV so user calculations are 100% up-to-date with zero latency.
- **Action**: Add to `wrangler.toml`:
  ```toml
  [triggers]
  crons = ["0 * * * *"] # Every hour at minute 0
  ```
- The worker's `scheduled(event, env, ctx)` handler fetches:
  - Central bank mid-market currency exchange rates.
  - Multi-model LLM pricing (Claude, OpenAI, DeepSeek, Gemini).

### 3. Edge Rate Limiting (DDoS & Scraper Defense)
- Protects free endpoints against scraping while granting unmetered throughput to authenticated API key holders.
- **Action**: In Cloudflare Dashboard → **Security** → **WAF** → **Rate Limiting Rules**:
  - Rule: If `URI path starts with "/api/v1/"` AND `Header "Authorization" is missing`:
  - Limit: `60 requests per 1 minute per IP`
  - Action: `Block with 429 JSON response`

### 4. Cloudflare Web Analytics (GDPR-Compliant, No Cookies)
- Provides real-time visitor geography and page telemetry without annoying cookie consent banners.
- **Action**: In Cloudflare Dashboard → **Web Analytics** → copy the JS beacon token and add to `index.html`.

---

## Task 5: Legal Disclaimers & Brand Name Sanitization

> **Bulletproof Legal Protection Guidelines**:
> 1. **Zero Corporate Brand Names**: Remove all mentions of third-party trademarks (e.g. Casio, Texas Instruments, PayPal, Wise, Stripe). Replace them with generic technical standards (e.g. *Scientific V.P.A.M. 991-matrix computational standard*, *Commercial Cross-Border Banking Rails*).
> 2. **Universal Non-Affiliation Clause**:
>    > *"TrueCalci is an independent computational verification engine. TrueCalci is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any hardware manufacturer, financial institution, government agency, or corporate entity."*
> 3. **CA / CPA / Legal Professional Disclaimer**:
>    > *"NO PROFESSIONAL ADVICE: All calculations, outputs, tax matrices, and financial models are deterministic mathematical simulations provided solely for educational and verification purposes. TrueCalci does NOT provide certified legal, certified accounting (CA/CPA), or investment advisory services. Always consult a licensed legal or tax professional before executing filings or transactions."*
