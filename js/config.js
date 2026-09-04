/**
 * TrueCalci - Central Application & SEO Configuration
 * Update these values when deploying to your custom domain or attaching your Google services.
 */

export const SITE_CONFIG = {
  appName: "TrueCalci",
  tagline: "The Deterministic Compute Engine for AI Agents & Enterprise Teams",
  
  // Replace with your live production domain once purchased (e.g., https://truecalci.com)
  productionDomain: "https://truecalci.com",
  
  // Google Analytics 4 (GA4) Measurement ID (format: G-XXXXXXXXXX)
  // Get this free from https://analytics.google.com using your personal Gmail
  gaMeasurementId: "",
  
  // Google Search Console (GSC) Verification Token
  gscVerificationToken: "",
  
  // Developer & Environment Flags
  isLocalhost: typeof window !== "undefined" && (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "file:"
  ),
  
  // Set to true to print analytics debug events in browser console
  debugAnalytics: true
};
