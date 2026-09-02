/**
 * OmniCalc India - Google Analytics 4 (GA4) Modular Integration
 * Works seamlessly with Google Analytics without requiring any third-party libraries.
 * In local development, it logs events to the console without sending mock data to Google.
 */

import { SITE_CONFIG } from "./config.js";

class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.measurementId = SITE_CONFIG.gaMeasurementId;
    this.isLocal = SITE_CONFIG.isLocalhost;
    this.debug = SITE_CONFIG.debugAnalytics;
  }

  /**
   * Initializes Google Analytics (gtag.js)
   * Loads the remote Google script only if a valid Measurement ID (e.g. G-XXXXXXX) is supplied
   * and we are not in mock placeholder mode.
   */
  init() {
    if (this.initialized) return;

    const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
    const win = typeof window !== "undefined" ? window : globalThis;

    // Check if user has overridden ID in localStorage (useful for quick testing)
    const localOverride = typeof localStorage !== "undefined" ? localStorage.getItem("ga_measurement_id") : null;
    if (localOverride) {
      this.measurementId = localOverride;
    }

    const hasValidId = this.measurementId && 
                       this.measurementId.startsWith("G-") && 
                       this.measurementId !== "G-XXXXXXXXXX";

    if (hasValidId && !this.isLocal && isBrowser) {
      // Inject Google Tag (gtag.js)
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      win.dataLayer = win.dataLayer || [];
      function gtag() { win.dataLayer.push(arguments); }
      win.gtag = gtag;

      gtag("js", new Date());
      gtag("config", this.measurementId, {
        send_page_view: false // We trigger page views manually for SPA hash changes
      });

      if (this.debug) {
        console.log(`[OmniCalc Analytics] Connected to GA4 Property: ${this.measurementId}`);
      }
    } else {
      // Development / Mock mode
      win.dataLayer = win.dataLayer || [];
      win.gtag = (command, action, params) => {
        if (this.debug) {
          console.log(`[OmniCalc Analytics Local Preview] ${command} -> ${action}:`, params);
        }
      };
      if (this.debug && isBrowser) {
        console.log(`[OmniCalc Analytics] Running in local/mock mode. Set a valid GA4 ID in js/config.js to activate live tracking.`);
      }
    }

    this.initialized = true;
    if (isBrowser) {
      this.trackPageView(window.location.pathname + window.location.hash, document.title);
    }
  }

  /**
   * Track a generic custom event in GA4
   */
  trackEvent(eventName, params = {}) {
    if (!this.initialized) this.init();
    const win = typeof window !== "undefined" ? window : globalThis;
    if (typeof win.gtag === "function") {
      win.gtag("event", eventName, {
        app_name: SITE_CONFIG.appName,
        timestamp: new Date().toISOString(),
        ...params
      });
    }
  }

  /**
   * Track virtual page views (especially useful for hash navigation: #tax, #sip, #gold)
   */
  trackPageView(pagePath, pageTitle) {
    const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
    this.trackEvent("page_view", {
      page_path: pagePath,
      page_title: pageTitle || (isBrowser ? document.title : "OmniCalc"),
      page_location: isBrowser ? window.location.href : "http://localhost:4000/"
    });
  }

  /**
   * Track when a user switches to a specific calculator
   */
  trackCalculatorView(toolId, toolTitle) {
    this.trackEvent("calculator_view", {
      calculator_id: toolId,
      calculator_name: toolTitle || toolId,
      page_path: `/#${toolId}`
    });
  }

  /**
   * Track calculation executions (e.g. Tax computed, EMI calculated, Gold bill generated)
   */
  trackCalculation(toolId, details = {}) {
    this.trackEvent("calculation_performed", {
      calculator_id: toolId,
      ...details
    });
  }

  /**
   * Track file exports (e.g., CSV amortization schedules, SIP yearly breakdown)
   */
  trackExport(toolId, format = "csv") {
    this.trackEvent("file_export", {
      calculator_id: toolId,
      export_format: format
    });
  }

  /**
   * Track search interactions in the global omnibar
   */
  trackSearch(query, resultCount) {
    this.trackEvent("search", {
      search_term: query,
      results_found: resultCount
    });
  }

  /**
   * Track theme toggle
   */
  trackThemeChange(theme) {
    this.trackEvent("theme_toggle", {
      theme_selected: theme
    });
  }
}

export const analytics = new AnalyticsService();
