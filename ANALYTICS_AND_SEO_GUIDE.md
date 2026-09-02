# Google Analytics 4 & Google Search Console Setup Guide
## OmniCalc India Production Foundation

---

## 1. Quick Answer: Do You Need a Registered Company?

> **NO, absolutely NOT.**
> 
> You **do not** need a registered company (Pvt Ltd, LLP, Partnership, OPC, or Proprietorship), nor do you need a GST number, trade license, or business registration to use:
> - **Google Search Console (GSC)** — 100% free with any personal Gmail account.
> - **Google Analytics 4 (GA4)** — 100% free with any personal Gmail account.
> - **Google AdSense (Monetization)** — Google offers **"Individual" accounts** where you can sign up as an independent web creator using just your personal PAN card and personal bank account in India.

All Google requires is proof that **you own or control the website** (via a DNS record or an HTML verification meta tag).

---

## 2. Setting Up Google Search Console (GSC)

Google Search Console tells Google to crawl your calculator suite, tracks search keyword rankings, impressions, and alerts you to any indexing issues.

### Step 1: Open Search Console
1. Go to [https://search.google.com/search-console](https://search.google.com/search-console).
2. Sign in with your standard **Gmail account**.
3. Click **"Add Property"** in the top-left dropdown.

### Step 2: Choose Verification Method
You will see two options:
- **Domain** (Recommended if you own the custom domain, e.g., `omnicalc.in`):
  - Enter your domain name (e.g. `omnicalc.in`).
  - Google gives you a **DNS TXT record** (e.g., `google-site-verification=abc123xyz...`).
  - Add this TXT record in your DNS manager (Cloudflare, Namecheap, GoDaddy, Hostinger, etc.).
- **URL Prefix** (Simplest HTML method, e.g., `https://omnicalc.in` or GitHub Pages/Vercel URL):
  - Enter your full URL.
  - Choose **"HTML tag"** as the verification method.
  - Google gives you a meta tag like:
    ```html
    <meta name="google-site-verification" content="ABC_XYZ_1234567890" />
    ```
  - Copy the token value inside `content="..."`.

### Step 3: Add Your Verification Token to OmniCalc
Open [js/config.js](file:///c:/Calculator/js/config.js) and paste the token:
```javascript
gscVerificationToken: "ABC_XYZ_1234567890",
```
And replace the placeholder in `<head>` of:
- [index.html](file:///c:/Calculator/index.html)
- [engineering-formulas.html](file:///c:/Calculator/engineering-formulas.html)
- [terms.html](file:///c:/Calculator/terms.html)
- [privacy.html](file:///c:/Calculator/privacy.html)

### Step 4: Submit Your Sitemap
Once verified:
1. In the Search Console sidebar, click **"Sitemaps"**.
2. Under "Add a new sitemap", type: `sitemap.xml`
3. Click **Submit**. Google will now crawl all your calculators, formulas, and legal pages!

---

## 3. Setting Up Google Analytics 4 (GA4)

Google Analytics 4 shows you real-time visitors, which calculators are most popular (Tax vs. SIP vs. 991 Calci), countries, cities, and session lengths.

### Step 1: Create a Free GA4 Property
1. Go to [https://analytics.google.com](https://analytics.google.com).
2. Click **"Start measuring"** (or click the Admin gear icon ⚙️ at bottom left).
3. **Account Name**: Enter any label (e.g., `OmniCalc` or your personal name).
4. **Property Details**:
   - Property Name: `OmniCalc India`
   - Reporting time zone: `India (GMT+05:30)`
   - Currency: `Indian Rupee (INR ₹)`
5. **Business Details**:
   - Industry: *Finance* or *Education* or *Science*
   - Business size: *Small / 1-10 employees*
6. Click **Create** and accept standard terms.

### Step 2: Create a Web Data Stream & Get Measurement ID
1. Choose platform: **Web**.
2. Enter your Website URL (e.g., `https://omnicalc.in`) and Stream name (e.g., `OmniCalc Web`).
3. Click **Create stream**.
4. You will see your **Measurement ID**:
   ```
   G-XXXXXXXXXX
   ```
   (Starts with `G-` followed by letters and numbers).

### Step 3: Connect It to OmniCalc
Open [js/config.js](file:///c:/Calculator/js/config.js):
```javascript
export const SITE_CONFIG = {
  // 1. Put your real domain:
  productionDomain: "https://omnicalc.in",

  // 2. Put your GA4 Measurement ID:
  gaMeasurementId: "G-XXXXXXXXXX", // <-- Paste your ID here
  ...
};
```
That's it! The modular `js/analytics.js` engine handles everything automatically.

---

## 4. Built-in Event Tracking

OmniCalc comes pre-wired with custom event tracking out of the box:

| GA4 Event Name | Description | Parameters Tracked |
| :--- | :--- | :--- |
| `calculator_view` | Triggered when user selects any calculator | `calculator_id`, `calculator_name`, `page_path` |
| `page_view` | Virtual page view for single-page app (#hash routing) | `page_path`, `page_title`, `page_location` |
| `search` | Triggered when user searches the omnibar | `search_term`, `results_found` |
| `theme_toggle` | Tracks user preference (Light vs Dark mode) | `theme_selected` (`light` / `dark`) |
| `file_export` | Triggered when exporting CSV / PDF schedules | `calculator_id`, `export_format` |

### Testing in Local Development:
When running on `localhost` or opening files locally:
1. Open your browser Developer Tools (`F12` or `Ctrl+Shift+I`) and go to the **Console** tab.
2. Switch between calculators (e.g. click "SIP" or "991 Calci") or toggle the theme.
3. You will see real-time debug logs:
   ```
   [OmniCalc Analytics Local Preview] event -> calculator_view: {calculator_id: "sip", ...}
   [OmniCalc Analytics Local Preview] event -> theme_toggle: {theme_selected: "dark"}
   ```
This allows you to verify all tracking without sending test/garbage data to your production Google Analytics account.

---

## 5. Summary Checklist Before Public Launch

- [x] **Privacy Policy Created**: [privacy.html](file:///c:/Calculator/privacy.html) (Mandatory for GA4 and AdSense compliance).
- [x] **Terms of Service**: [terms.html](file:///c:/Calculator/terms.html) (SEBI & Income Tax disclosures).
- [x] **GSC Meta Verification Tag**: Inserted across all HTML pages.
- [x] **GA4 Analytics Modular Engine**: [js/analytics.js](file:///c:/Calculator/js/analytics.js) integrated into `app.js`.
- [x] **Sitemap**: [sitemap.xml](file:///c:/Calculator/sitemap.xml) updated with all pages and priority weights.
- [x] **Robots.txt**: [robots.txt](file:///c:/Calculator/robots.txt) allowing search crawlers and AI bots.
- [ ] **Your Action**: Paste your `gaMeasurementId` (`G-...`) and `gscVerificationToken` into `js/config.js` when ready.
