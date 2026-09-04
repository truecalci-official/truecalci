# TrueCalci Search Engine & Growth Integration Playbook

> **Complete step-by-step operational manual for Google Search Console, Bing IndexNow, Analytics, and Search Engine Indexing for `truecalci.com` and `truecalci.in`.**

---

## 1. Updated Sitemap URLs (Copy-Paste Ready)

When adding sitemaps to Google Search Console, Bing Webmaster Tools, or AI search indexes:

| Scope | Full URL | Search Console Input Value |
| :--- | :--- | :--- |
| **Primary Global Domain** | `https://truecalci.com/sitemap.xml` | `sitemap.xml` |
| **Indian Regional Domain** | `https://truecalci.in/sitemap.xml` | `sitemap.xml` |
| **Direct Browser Check** | [https://truecalci.com/sitemap.xml](https://truecalci.com/sitemap.xml) | *(Opens clean XML index)* |

---

## 2. Google Search Console (GSC) Setup Guide

### Step 1: Add Your Property
1. Navigate to: **[https://search.google.com/search-console](https://search.google.com/search-console)**.
2. In the top-left dropdown, click **Add property**.
3. You will see two options:
   * **Domain** (Recommended): Enter `truecalci.com`.
   * **URL prefix**: Enter `https://truecalci.com`.

### Step 2: Verify Domain Ownership (1-Click Cloudflare DNS)
* If you selected **Domain**:
  1. Google will display a `TXT` verification string (e.g. `google-site-verification=abc123xyz...`).
  2. Go to **Cloudflare Dashboard** $\to$ **`truecalci.com`** $\to$ **DNS** $\to$ **Records**.
  3. Click **Add record**:
     - **Type**: `TXT`
     - **Name**: `@` (or `truecalci.com`)
     - **Content**: *(Paste the google-site-verification string)*
  4. Return to Google Search Console and click **Verify**. (Verification is instant).
* If you selected **URL Prefix**:
  1. Choose **HTML tag** verification.
  2. It gives you `<meta name="google-site-verification" content="...">`.
  3. Send me the token, and I will place it in `index.html` (or you can verify via the Cloudflare DNS method above).

### Step 3: Submit Your Sitemap
1. In the left navigation menu of Search Console, click **Sitemaps** (under *Indexing*).
2. Under **Add a new sitemap**, type:
   ```
   sitemap.xml
   ```
3. Click **Submit**.
4. The status will immediately turn green: **"Success"**.
5. Repeat for `truecalci.in` by adding `truecalci.in` as a separate property.

### Step 4: Request Instant Priority Indexing (Trigger Googlebot Immediately)
1. At the very top of Google Search Console, you will see a search bar: **"Inspect any URL in 'https://truecalci.com'"**.
2. Type: `https://truecalci.com/` and press **Enter**.
3. Search Console will retrieve the live URL data.
4. Click the button: **`Request Indexing`**.
5. Repeat for:
   - `https://truecalci.com/engineering-formulas.html`
   - `https://truecalci.com/terms.html`
   - `https://truecalci.com/privacy.html`
*This bypasses standard crawl queues and commands Googlebot to fetch and index your pages within 12 to 24 hours.*

---

## 3. Additional Essential Integrations for TrueCalci

### 3.1 Cloudflare Crawler Hints (Instant Indexing via IndexNow)
Cloudflare has a native feature that pushes every update on `truecalci.com` directly to **Microsoft Bing, Yahoo, Seznam, and DuckDuckGo** within 60 seconds!
1. In Cloudflare Dashboard $\to$ click **`truecalci.com`**.
2. Go to **Speed** (or **Caching**) $\to$ **Crawler Hints**.
3. Switch the toggle to **ON**.
4. *Result: Every time you deploy new code, Cloudflare automatically sends an IndexNow ping to search engines.*

### 3.2 Bing Webmaster Tools (Powering ChatGPT Search & Copilot)
ChatGPT Search and Microsoft Copilot use the Bing search index to ground their answers!
1. Go to **[https://www.bing.com/webmasters](https://www.bing.com/webmasters)**.
2. Click **Sign In** $\to$ choose **Import from Google Search Console**.
3. It imports your verified `truecalci.com` property and sitemap in 1 click!

### 3.3 Google Analytics 4 (GA4) Tracking
To track live visitors, calculator conversions, and geographic traffic:
1. Create a GA4 property at **[analytics.google.com](https://analytics.google.com)**.
2. Copy your **Measurement ID** (e.g. `G-XXXXXXXXXX`).
3. Open [`js/config.js`](file:///c:/Calculator/js/config.js) and paste it into `gaMeasurementId: 'G-XXXXXXXXXX'`.
4. The analytics engine is already wired in [`js/analytics.js`](file:///c:/Calculator/js/analytics.js) and will immediately start recording calculator views, exports, and theme changes.

### 3.4 Google AdSense / Display Monetization
Once Google Search Console indexes 10–15 pages of TrueCalci and organic traffic starts:
1. Apply at **[google.com/adsense](https://www.google.com/adsense)**.
2. The site already contains SEBI regulatory disclaimers, complete privacy policy with cookie disclosures, and terms of service—all mandatory prerequisites for 100% AdSense approval.
3. Ad containers and layouts are already engineered in [`css/ad-layout.css`](file:///c:/Calculator/css/ad-layout.css).
