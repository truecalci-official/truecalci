/**
 * Omnichannel Calculator Web Suite Application Coordinator
 * Responsive Off-Canvas Drawer, URL Hash State Persistence,
 * Smooth Viewport Centering & Motion Transitions, Theme Manager, Web Audio Synthesizer
 */

import { ViewIndianFinance } from "./views/view-indian-finance.js";
import { ViewGlobalFinance } from "./views/view-global-finance.js";
import { ViewContractorMatrix } from "./views/view-contractor-matrix.js";
import { ViewCasio } from "./views/view-casio.js";
import { ViewBasic } from "./views/view-basic.js";
import { ViewProgrammer } from "./views/view-programmer.js";
import { ViewAdminPortal } from "./views/view-admin-portal.js";
import { ViewDeveloperPortal } from "./views/view-developer-portal.js";
import { ViewEnterpriseHome } from "./views/view-enterprise-home.js";
import { ViewPricing } from "./views/view-pricing.js";
import { CALCULATOR_DEFINITIONS } from "./data/definitions.js";
import { analytics } from "./analytics.js";
import { ContractorMatrixEngine } from "./engines/contractor-matrix.js";

window.ContractorMatrixEngine = ContractorMatrixEngine;

class CalculatorApp {
  constructor() {
    this.validTools = [
      "home", "contractor_matrix", "mortgage", "vat", "tip", "compound",
      "tax", "gst", "sip", "fd", "gold", 
      "ppf", "ssy", "home_loan", "land", 
      "calci_991", "basic", "programmer",
      "developer", "admin", "api", "pricing", "docs"
    ];

    // Read initial tool from Subdomain, body initialView, or URL hash
    const hostname = window.location.hostname.toLowerCase();
    const initialView = document.body.dataset.initialView || "";
    const initialHash = window.location.hash.replace("#", "").trim();

    if (hostname.startsWith("admin.") || initialHash === "admin" || initialView === "admin") {
      this.currentTool = "admin";
    } else if (hostname.startsWith("developer.") || hostname.startsWith("api.") || initialHash === "developer" || initialHash === "api" || initialView === "developer") {
      this.currentTool = "developer";
    } else {
      this.currentTool = this.validTools.includes(initialHash) ? initialHash : "home";
    }

    this.currentAdminView = null;

    this.audioEnabled = true;
    this.audioCtx = null;
    this.currentRegion = localStorage.getItem("calc_region") || "global";

    analytics.init();
    this.initElements();
    this.initTheme();
    this.initAudio();
    this.bindEvents();
    this.loadTool(this.currentTool, false);
  }

  initElements() {
    this.workspaceEl = document.getElementById("calculator-workspace");
    this.themeToggleBtn = document.getElementById("theme-toggle-btn");
    this.soundToggleBtn = document.getElementById("sound-toggle-btn");
    this.infoBtn = document.getElementById("info-btn");
    this.drawerOverlay = document.getElementById("knowledge-drawer-overlay");
    this.drawerCloseBtn = document.getElementById("drawer-close-btn");
    this.drawerContent = document.getElementById("drawer-content");
    this.drawerTitle = document.getElementById("drawer-title");

    // Header Center Global Search
    this.globalSearchInput = document.getElementById("global-search-input");
    this.headerSearchDropdown = document.getElementById("header-search-dropdown");

    // Mobile Drawer Elements
    this.mobileMenuBtn = document.getElementById("mobile-menu-btn");
    this.sidebarNav = document.getElementById("app-sidebar-nav");
    this.sidebarBackdrop = document.getElementById("sidebar-backdrop");
    this.sidebarCloseBtn = document.getElementById("sidebar-close-btn");
    this.initSearchIndex();
    this.initRegion();
    this.initAuth();
    this.initCompanionDock();
  }

  initRegion() {
    const savedRegion = localStorage.getItem("calc_region") || "global";
    this.setRegion(savedRegion, false);

    // Single-layer currency dropdown toggle
    const dropdownBtn = document.getElementById("currency-dropdown-btn");
    const dropdownMenu = document.getElementById("currency-dropdown-menu");
    const chevronIcon = dropdownBtn?.querySelector(".currency-chevron-icon");

    dropdownBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = dropdownMenu?.style.display === "block";
      if (dropdownMenu) dropdownMenu.style.display = isVisible ? "none" : "block";
      dropdownBtn.setAttribute("aria-expanded", String(!isVisible));
      if (chevronIcon) chevronIcon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
    });

    document.querySelectorAll(".currency-menu-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const nextRegion = item.dataset.region;
        this.setRegion(nextRegion, true);
        if (dropdownMenu) dropdownMenu.style.display = "none";
        if (dropdownBtn) dropdownBtn.setAttribute("aria-expanded", "false");
        if (chevronIcon) chevronIcon.style.transform = "rotate(0deg)";
      });
    });

    document.addEventListener("click", () => {
      if (dropdownMenu) dropdownMenu.style.display = "none";
      if (dropdownBtn) dropdownBtn.setAttribute("aria-expanded", "false");
      if (chevronIcon) chevronIcon.style.transform = "rotate(0deg)";
    });

    // Compatibility with legacy toggle buttons
    const currencyToggleBtn = document.getElementById("currency-toggle-btn");
    currencyToggleBtn?.addEventListener("click", () => {
      const nextRegion = this.currentRegion === "india" ? "global" : "india";
      this.setRegion(nextRegion, true);
    });

    document.querySelectorAll(".region-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setRegion(btn.dataset.region, true);
      });
    });
  }

  setRegion(region, reload = true) {
    this.currentRegion = region;
    localStorage.setItem("calc_region", region);

    const currencyLabel = document.getElementById("currency-label-text");
    if (currencyLabel) {
      currencyLabel.textContent = region === "india" ? "INR (₹)" : "USD ($)";
    }

    // Update menu checkmarks
    document.querySelectorAll(".curr-check").forEach(chk => {
      chk.style.display = chk.dataset.for === region ? "inline" : "none";
    });

    document.querySelectorAll(".currency-menu-item").forEach(item => {
      const isMatch = item.dataset.region === region;
      item.classList.toggle("active", isMatch);
      item.style.fontWeight = isMatch ? "600" : "500";
      item.style.color = isMatch ? "var(--text-primary)" : "var(--text-secondary)";
    });

    document.querySelectorAll(".region-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.region === region);
    });

    analytics.trackEvent("region_selected", { region });

    if (reload) {
      this.loadTool(this.currentTool, false);
    }
  }

  initSearchIndex() {
    this.searchIndex = [
      { key: "home", title: "TrueCalci Enterprise Homepage & Overview", category: "Platform", keywords: "home overview platform enterprise mcp compute" },
      { key: "contractor_matrix", title: "Remote Contractor Take-Home Matrix (1099 vs W-2)", category: "Global Freelance & Tech", keywords: "1099 w2 contractor remote employee take home taxes self employment seca qbi freelance rate breakeven fx drag wise deel pass through" },
      { key: "mortgage", title: "US Mortgage Calculator (PITI & PMI)", category: "Global Real Estate", keywords: "mortgage piti pmi loan down payment 30 year 15 year fixed property tax home insurance usa" },
      { key: "vat", title: "VAT & Sales Tax Calculator (EU / UK / US)", category: "Global Tax", keywords: "vat value added tax sales tax hmrc mwst tva iva uk germany france spain gross net remove add" },
      { key: "tip", title: "Tip & Restaurant Bill Splitter", category: "Global Utilities", keywords: "tip bill split restaurant gratuity dinner diners per person share" },
      { key: "compound", title: "Compound Wealth & 401(k) Simulator", category: "Global Wealth", keywords: "compound interest wealth 401k roth ira sparplan etf savings future value" },
      { key: "tax", title: "Income Tax (Budget 2025-26)", category: "Tax", keywords: "tax 87a rebate new regime old regime salary ctc slabs deduction 75000" },
      { key: "gst", title: "GST Calculator (CGST + SGST)", category: "Tax", keywords: "gst cgst sgst 18% 12% 5% 28% invoice tax" },
      { key: "sip", title: "SIP & Step-Up Calculator", category: "Wealth", keywords: "sip mutual fund compounding annuity investment wealth return" },
      { key: "fd", title: "Fixed Deposit (FD)", category: "Wealth", keywords: "fd deposit quarterly compounding interest bank" },
      { key: "gold", title: "Gold & Jewellery (3% GST)", category: "Wealth", keywords: "gold 22k 24k hallmark 916 jewellery making charge" },
      { key: "ppf", title: "Public Provident Fund (PPF)", category: "Wealth", keywords: "ppf scheme post office interest 7.1 tax free" },
      { key: "ssy", title: "Sukanya Samriddhi Yojana (SSY)", category: "Wealth", keywords: "ssy girl child scheme 8.2 post office" },
      { key: "home_loan", title: "Home Loan EMI & Amortization", category: "Loans", keywords: "home loan emi amortization schedule principal interest payment" },
      { key: "land", title: "Land Area Converter (Gaj, Guntha, Acre)", category: "Real Estate", keywords: "land area gaj guntha sqft bigha acre hectare cent ground" },
      { key: "calci_991", title: "Engineering Calci 991 (fx-991ES Plus)", category: "Engineering", keywords: "casio 991 scientific solve integral derivative matrix complex stats polynomial equation engineering" },
      { key: "basic", title: "Basic Pocket Calculator", category: "Daily Math", keywords: "basic pocket calculator arithmetic simple math percentage square root" },
      { key: "programmer", title: "Programmer Hex / Bin / Bitwise", category: "Development", keywords: "programmer hex bin oct dec bitwise and or xor not bit shift nibble" },
      { key: "developer", title: "TrueCalci Developer Hub & Open AI Agent API", category: "Development", keywords: "developer api mcp tools cursor claude agent json endpoints token keys" },
      { key: "admin", title: "Admin Portal & Edge Telemetry", category: "Management", keywords: "admin portal dashboard telemetry economics latency requests cloudflare edge" },
      { key: "pricing", title: "Deterministic Compute Plans & Pricing", category: "Platform", keywords: "pricing plans subscriptions dodo payments dodo mor compute credits" },
      { key: "pipe_flow", title: "Pipe Flow & Pressure Drop (Darcy-Weisbach)", category: "Engineering Physics", url: "engineering-formulas.html#pipe-flow", keywords: "fluid dynamics pipe flow reynolds number darcy weisbach head loss friction factor pressure drop" },
      { key: "rlc_circuit", title: "Resonant RLC Circuit & AC Impedance", category: "Engineering Physics", url: "engineering-formulas.html#rlc-circuit", keywords: "rlc circuit resonance frequency q factor bandwidth impedance reactance inductive capacitive" },
      { key: "rocket_deltav", title: "Rocket Orbital Delta-v (Tsiolkovsky Equation)", category: "Aerospace", url: "engineering-formulas.html#rocket-deltav", keywords: "rocket delta v tsiolkovsky orbital mechanics specific impulse isp mass ratio propellant" }
    ];
  }

  initTheme() {
    const savedTheme = localStorage.getItem("calc_theme") || "light";
    this.setTheme(savedTheme, false);

    const themeIconBtn = document.getElementById("theme-toggle-icon-btn");
    themeIconBtn?.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      this.setTheme(next, true);
    });

    document.querySelectorAll(".palette-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setTheme(btn.dataset.theme, true);
      });
    });
  }

  setTheme(theme, track = true) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("calc_theme", theme);

    document.querySelectorAll(".palette-pill-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.theme === theme);
    });

    this.updateThemeIcon(theme);

    if (track) {
      analytics.trackThemeChange(theme);
    }
  }

  updateThemeIcon(theme) {
    const sunIcon = document.querySelector(".theme-icon-sun");
    const moonIcon = document.querySelector(".theme-icon-moon");
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === "dark" ? "none" : "block";
      moonIcon.style.display = theme === "dark" ? "block" : "none";
    }
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    let next = "dark";
    if (current === "dark" || current === "obsidian") next = "cyber";
    else if (current === "cyber") next = "light";
    else next = "dark";
    this.setTheme(next, true);
  }

  initCompanionDock() {
    const grid = document.querySelector(".app-layout-grid");
    const toggleBtn = document.getElementById("dock-toggle-btn");
    const railExpandBtn = document.getElementById("dock-rail-expand-btn");
    const scratchpad = document.getElementById("companion-scratchpad");

    // Restore collapsed preference
    const isCollapsed = localStorage.getItem("calc_dock_collapsed") === "true";
    if (isCollapsed && grid) {
      grid.classList.add("dock-collapsed");
    }

    const toggleCollapse = () => {
      if (grid) {
        grid.classList.toggle("dock-collapsed");
        const collapsed = grid.classList.contains("dock-collapsed");
        localStorage.setItem("calc_dock_collapsed", collapsed);
      }
    };

    if (toggleBtn) toggleBtn.addEventListener("click", toggleCollapse);
    if (railExpandBtn) railExpandBtn.addEventListener("click", toggleCollapse);

    // Tab switching in Companion Dock
    document.querySelectorAll(".dock-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll(".dock-tab-btn").forEach(b => b.classList.toggle("active", b === btn));
        document.querySelectorAll(".dock-pane").forEach(p => p.classList.remove("active"));
        const targetPane = document.getElementById(`dock-pane-${tab}`);
        if (targetPane) targetPane.classList.add("active");
      });
    });

    // Scratchpad persistence
    if (scratchpad) {
      scratchpad.value = localStorage.getItem("calc_scratchpad") || "";
      scratchpad.addEventListener("input", (e) => {
        localStorage.setItem("calc_scratchpad", e.target.value);
      });
    }

    // Global helper to push into calculation tape
    window.recordCalculationTape = (toolName, mainMetric, subMetric = "") => {
      const tapeList = document.getElementById("tape-list");
      if (!tapeList) return;
      const emptyMsg = tapeList.querySelector(".history-empty-msg");
      if (emptyMsg) emptyMsg.remove();

      const item = document.createElement("div");
      item.className = "history-item";
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      item.innerHTML = `
        <div class="history-item-top">
          <span>${toolName}</span>
          <span style="font-size:0.68rem; color:var(--text-muted); font-weight:normal;">${time}</span>
        </div>
        <div class="history-item-val">${mainMetric}</div>
        ${subMetric ? `<div style="font-size:0.7rem; color:var(--text-muted);">${subMetric}</div>` : ''}
      `;
      tapeList.insertBefore(item, tapeList.firstChild);

      // Keep maximum 15 items in tape
      while (tapeList.children.length > 15) {
        tapeList.removeChild(tapeList.lastChild);
      }
    };
  }

  initAudio() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (e) {
      this.audioEnabled = false;
    }
  }

  playKeyClick() {
    if (!this.audioEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.025);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  openMobileDrawer() {
    this.sidebarNav?.classList.add("drawer-open");
    this.sidebarBackdrop?.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeMobileDrawer() {
    this.sidebarNav?.classList.remove("drawer-open");
    this.sidebarBackdrop?.classList.remove("active");
    document.body.style.overflow = "";
  }

  bindEvents() {
    // Mobile Drawer Open / Close
    this.mobileMenuBtn?.addEventListener("click", () => this.openMobileDrawer());
    this.sidebarCloseBtn?.addEventListener("click", () => this.closeMobileDrawer());
    this.sidebarBackdrop?.addEventListener("click", () => this.closeMobileDrawer());

    // Sidebar Navigation Links
    document.querySelectorAll(".sidebar-link").forEach(link => {
      link.addEventListener("click", () => {
        const tool = link.dataset.tool;
        if (tool) {
          this.loadTool(tool, true);
        }
      });
    });

    // Live Ticker Clickable Items (e.g. Gold -> Gold Calculator)
    document.querySelectorAll(".ticker-clickable").forEach(item => {
      item.addEventListener("click", () => {
        const tool = item.dataset.tool;
        if (tool) {
          this.loadTool(tool, true);
        }
      });
    });

    // Browser Back / Forward Hash Change Listener
    window.addEventListener("hashchange", () => {
      const hashTool = window.location.hash.replace("#", "").trim() || "home";
      if (this.validTools.includes(hashTool) && hashTool !== this.currentTool) {
        this.loadTool(hashTool, false);
      }
    });

    // Global Omnibar Search Input & Dropdown
    this.globalSearchInput?.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        this.headerSearchDropdown?.classList.remove("active");
        return;
      }

      const results = this.searchIndex.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) || 
        item.keywords.toLowerCase().includes(q)
      );

      analytics.trackSearch(q, results.length);

      if (results.length === 0) {
        this.headerSearchDropdown.innerHTML = `<div style="padding:0.75rem 1rem; color:var(--text-muted); font-size:0.8rem;">No matching calculators found.</div>`;
      } else {
        this.headerSearchDropdown.innerHTML = results.slice(0, 6).map(item => `
          <div class="search-dropdown-item" data-key="${item.key || ''}" data-url="${item.url || ''}">
            <span class="search-dropdown-item-title">
              <span>${item.title}</span>
            </span>
            <span class="search-dropdown-item-cat">${item.category}</span>
          </div>
        `).join("");
      }

      this.headerSearchDropdown?.classList.add("active");
    });

    // Handle Search Dropdown Item Click
    this.headerSearchDropdown?.addEventListener("click", (e) => {
      const item = e.target.closest(".search-dropdown-item");
      if (!item) return;

      const key = item.dataset.key;
      const url = item.dataset.url;

      this.headerSearchDropdown?.classList.remove("active");
      if (this.globalSearchInput) this.globalSearchInput.value = "";

      if (url) {
        window.location.href = url;
      } else if (key) {
        this.loadTool(key, true);
      }
    });

    // Close search dropdown on click outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".header-search-container")) {
        this.headerSearchDropdown?.classList.remove("active");
      }
    });

    // Press '/' to focus global search
    window.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== this.globalSearchInput && !['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) {
        e.preventDefault();
        this.globalSearchInput?.focus();
      }
      if (e.key === "Escape") {
        this.headerSearchDropdown?.classList.remove("active");
      }
    });

    // Theme Toggle
    this.themeToggleBtn?.addEventListener("click", () => this.toggleTheme());

    // Sound Toggle
    this.soundToggleBtn?.addEventListener("click", () => {
      this.audioEnabled = !this.audioEnabled;
      this.soundToggleBtn.style.opacity = this.audioEnabled ? "1" : "0.5";
    });

    // Knowledge Drawer Open / Close
    this.infoBtn?.addEventListener("click", () => this.openKnowledgeDrawer());
    this.drawerCloseBtn?.addEventListener("click", () => this.closeKnowledgeDrawer());
    this.drawerOverlay?.addEventListener("click", (e) => {
      if (e.target === this.drawerOverlay) this.closeKnowledgeDrawer();
    });
  }

  loadTool(toolKey, updateHash = true) {
    if (!this.workspaceEl) return;
    this.currentTool = toolKey;

    // Scroll window to top smoothly/instantly on every tool load
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Update URL hash with history entry so browser Back/Forward operates seamlessly
    if (updateHash && window.location.hash !== '#' + toolKey) {
      window.location.hash = '#' + toolKey;
    }

    // Auto-close mobile drawer upon tool selection
    this.closeMobileDrawer();

    // Keep sidebar active state synchronized
    document.querySelectorAll(".sidebar-link").forEach(l => {
      l.classList.toggle("active", l.dataset.tool === toolKey);
    });

    this.workspaceEl.innerHTML = "";

    const titles = {
      contractor_matrix: { title: "Remote Contractor Take-Home Matrix (1099 vs. W-2)", subtitle: "Tax Parity, 15.3% SECA, 20% Section 199A QBI & Breakeven Simulator" },
      mortgage: { title: "US Mortgage Calculator (PITI & PMI)", subtitle: "Principal, Interest, Property Taxes, Home Insurance & PMI Amortization" },
      vat: { title: "VAT & Sales Tax Calculator", subtitle: "Instant Add Tax (Net → Gross) and Remove Tax (Gross → Net) with UK/EU/US presets" },
      tip: { title: "Tip & Restaurant Bill Splitter", subtitle: "Per-guest dining share, customizable tip percentages and bill splitting" },
      compound: { title: "Compound Wealth & 401(k) Simulator", subtitle: "Long-term exponential compounding for retirement, 401(k), ISA, and ETF savings" },
      tax: { title: "Income Tax Calculator", subtitle: "Union Budget 2025-26 & 2026-27 Slabs (Zero net tax up to ₹12.75 Lakhs)" },
      sip: { title: "SIP & Step-Up Calculator", subtitle: "Monthly Mutual Fund compounding, annual step-up growth & schedule" },
      home_loan: { title: "Home Loan EMI & Prepayment", subtitle: "Reducing balance EMI, month/year amortization schedule & interest savings" },
      gold: { title: "Indian Gold & Jewellery Billing", subtitle: "24K/22K (916)/18K purity, making charges, hallmark fee & 3% GST" },
      ppf: { title: "Public Provident Fund (PPF)", subtitle: "15-Year statutory EEE scheme at 7.1% p.a. with 5th-of-month deposit rule" },
      ssy: { title: "Sukanya Samriddhi Yojana (SSY)", subtitle: "Government girl child welfare scheme at 8.2% p.a. (21-year maturity)" },
      fd: { title: "Fixed Deposit (FD) Calculator", subtitle: "Quarterly compounding interest according to Indian banking standards" },
      gst: { title: "GST Calculator (India)", subtitle: "5%, 12%, 18%, 28% tax slabs with 50-50 CGST and SGST breakdown" },
      land: { title: "Indian Land Unit Converter", subtitle: "Conversion between Gaj (Sq Yard), Guntha, Bigha, Cent, Katha, and Acre" },
      calci_991: { title: "Engineering Calci 991 (V.P.A.M.)", subtitle: "Standard non-programmable Indian college examination scientific calculator" },
      basic: { title: "Desktop Arithmetic Calculator", subtitle: "Commercial office calculator with M+/M-/MR/MC, % and square root" },
      programmer: { title: "Programmer (64-Bit) & Bitboard", subtitle: "64-bit Hex, Dec, Oct, Bin conversions and interactive clickable bitboard" }
    };

    const info = titles[toolKey] || { title: "Calculator", subtitle: "High-precision calculations" };

    // Track tool view in Google Analytics
    analytics.trackCalculatorView(toolKey, info.title);

    // Workspace Header
    const headerHtml = `
      <div class="workspace-header">
        <div class="workspace-title-wrap">
          <h2 class="workspace-title">${info.title}</h2>
          <span class="workspace-subtitle">${info.subtitle}</span>
        </div>
        <button class="export-btn" id="workspace-info-btn" title="View Formulas & Guide">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
          <span>Formulas & Guide</span>
        </button>
      </div>
      <div id="tool-view-mount"></div>
    `;

    if (this.currentAdminView) {
      this.currentAdminView.destroy();
      this.currentAdminView = null;
    }

    document.body.dataset.view = toolKey;

    if (toolKey === "home") {
      this.workspaceEl.innerHTML = `<div id="tool-view-mount"></div>`;
      const mountEl = document.getElementById("tool-view-mount");
      new ViewEnterpriseHome(mountEl, (nextTool) => this.loadTool(nextTool, true)).render();
      return;
    }

    if (toolKey === "admin") {
      this.workspaceEl.innerHTML = `<div id="tool-view-mount"></div>`;
      const mountEl = document.getElementById("tool-view-mount");
      this.currentAdminView = new ViewAdminPortal(mountEl);
      this.currentAdminView.render();
      return;
    }

    if (toolKey === "pricing") {
      this.workspaceEl.innerHTML = `<div id="tool-view-mount"></div>`;
      const mountEl = document.getElementById("tool-view-mount");
      new ViewPricing(mountEl, (nextTool) => this.loadTool(nextTool, true)).render();
      return;
    }

    if (toolKey === "developer" || toolKey === "api" || toolKey === "docs") {
      this.workspaceEl.innerHTML = `<div id="tool-view-mount"></div>`;
      const mountEl = document.getElementById("tool-view-mount");
      new ViewDeveloperPortal(mountEl).render();
      return;
    }

    this.workspaceEl.innerHTML = headerHtml;

    document.getElementById("workspace-info-btn")?.addEventListener("click", () => {
      this.openKnowledgeDrawer();
    });

    const mountEl = document.getElementById("tool-view-mount");

    const globalTools = ["mortgage", "vat", "tip", "compound"];
    const financialTools = ["sip", "tax", "home_loan", "gold", "ppf", "ssy", "fd", "gst", "land"];

    if (toolKey === "contractor_matrix") {
      const cmView = new ViewContractorMatrix(mountEl, () => this.openKnowledgeDrawer());
      cmView.setRegion(this.currentRegion);
    } else if (globalTools.includes(toolKey)) {
      const gView = new ViewGlobalFinance(mountEl, () => this.openKnowledgeDrawer());
      gView.setRegion(this.currentRegion);
      gView.setTool(toolKey);
    } else if (financialTools.includes(toolKey)) {
      const finView = new ViewIndianFinance(mountEl, () => this.openKnowledgeDrawer());
      finView.currentSubtab = toolKey;
      finView.render();
    } else if (toolKey === "calci_991") {
      new ViewCasio(mountEl, () => this.playKeyClick()).render();
    } else if (toolKey === "basic") {
      new ViewBasic(mountEl, () => this.playKeyClick()).render();
    } else if (toolKey === "programmer") {
      new ViewProgrammer(mountEl, () => this.playKeyClick()).render();
    }

    // Smoothly scroll to the top of the workspace on mobile devices
    if (window.innerWidth <= 900) {
      this.workspaceEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openKnowledgeDrawer() {
    if (!this.drawerOverlay) return;

    let defKey = this.currentTool;
    if (defKey === "tax") defKey = "income_tax";
    else if (defKey === "calci_991") defKey = "casio_calci";
    else if (defKey === "land") defKey = "land_units";

    const def = CALCULATOR_DEFINITIONS[defKey] || CALCULATOR_DEFINITIONS.income_tax;

    this.drawerTitle.textContent = def.title;
    this.drawerContent.innerHTML = `
      <div class="info-section">
        <span class="info-section-title">Overview</span>
        <p class="info-text">${def.overview}</p>
      </div>

      ${def.disclaimer ? `
        <div class="info-section" style="background:var(--bg-subtle); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
          <span class="info-section-title" style="color:var(--amber-primary);">Regulatory Note</span>
          <p class="info-text" style="font-size:0.78rem;">${def.disclaimer}</p>
        </div>
      ` : ''}

      ${def.formulas ? `
        <div class="info-section">
          <span class="info-section-title">Formulas & Mathematical Logic</span>
          ${def.formulas.map(f => `
            <div class="formula-card">
              <span class="formula-name">${f.name}</span>
              <code>${f.formula}</code>
            </div>
          `).join("")}
        </div>
      ` : ''}

      ${def.workedExample ? `
        <div class="info-section">
          <span class="info-section-title">Worked Example</span>
          <p class="info-text">${def.workedExample}</p>
        </div>
      ` : ''}
    `;

    this.drawerOverlay.classList.add("open");
  }

  closeKnowledgeDrawer() {
    this.drawerOverlay?.classList.remove("open");
  }

  initAuth() {
    window.openAuthModal = () => this.openAuthModal();

    this.updateAuthHeaderButton();

    const authBtn = document.getElementById("header-auth-trigger-btn");
    authBtn?.addEventListener("click", () => {
      const isAuthed = localStorage.getItem("tc_dev_auth") === "true";
      if (isAuthed) {
        this.openAccountMenu();
      } else {
        this.openAuthModal();
      }
    });
  }

  updateAuthHeaderButton() {
    const isAuthed = localStorage.getItem("tc_dev_auth") === "true";
    const user = JSON.parse(localStorage.getItem("tc_dev_user") || 'null');
    const authBtn = document.getElementById("header-auth-trigger-btn");
    const authText = document.getElementById("header-auth-btn-text");

    if (authBtn && authText) {
      if (isAuthed && user) {
        authText.textContent = user.name || "Developer";
        authBtn.style.background = "var(--bg-surface)";
        authBtn.style.color = "var(--text-primary)";
        authBtn.style.border = "1px solid var(--border-color)";
      } else {
        authText.textContent = "Sign In Free";
        authBtn.style.background = "#18181b";
        authBtn.style.color = "#ffffff";
        authBtn.style.border = "1px solid #18181b";
      }
    }
  }

  openAuthModal(initialTab = "signin") {
    let modal = document.getElementById("auth-login-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "auth-login-modal";
      document.body.appendChild(modal);
    }

    modal.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.68);
      backdrop-filter: blur(10px);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    `;

    const renderModalContent = (tab) => {
      const isSignUp = tab === "signup";
      modal.innerHTML = `
        <div class="glass-card" style="width: 100%; max-width: 440px; padding: 32px 28px; border-radius: 16px; background: var(--bg-surface); position: relative; box-shadow: 0 24px 48px rgba(0,0,0,0.4); border: 1px solid var(--border-color); text-align: center;">
          
          <button id="auth-modal-close" type="button" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <!-- Brand Monogram -->
          <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #2563eb, #1d4ed8); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: #ffffff; font-weight: 800; font-size: 1.25rem; box-shadow: 0 6px 16px rgba(37,99,235,0.35); letter-spacing: -0.02em;">
            TC
          </div>

          <!-- Tab Switcher: Sign In vs Sign Up -->
          <div style="display: flex; background: var(--bg-app); padding: 4px; border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 20px;">
            <button id="tab-auth-signin" type="button" style="flex: 1; padding: 8px 12px; font-size: 0.82rem; font-weight: 700; border-radius: 7px; border: none; cursor: pointer; background: ${!isSignUp ? 'var(--bg-surface)' : 'transparent'}; color: ${!isSignUp ? 'var(--text-primary)' : 'var(--text-muted)'}; box-shadow: ${!isSignUp ? '0 2px 6px rgba(0,0,0,0.15)' : 'none'}; transition: all 0.2s ease;">
              Sign In
            </button>
            <button id="tab-auth-signup" type="button" style="flex: 1; padding: 8px 12px; font-size: 0.82rem; font-weight: 700; border-radius: 7px; border: none; cursor: pointer; background: ${isSignUp ? 'var(--bg-surface)' : 'transparent'}; color: ${isSignUp ? 'var(--text-primary)' : 'var(--text-muted)'}; box-shadow: ${isSignUp ? '0 2px 6px rgba(0,0,0,0.15)' : 'none'}; transition: all 0.2s ease;">
              Create Free Account
            </button>
          </div>

          <h3 style="margin: 0 0 6px 0; font-size: 1.35rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
            ${isSignUp ? 'Start Building Free with TrueCalci' : 'Welcome back to TrueCalci'}
          </h3>
          <p style="margin: 0 0 22px 0; font-size: 0.83rem; color: var(--text-secondary); line-height: 1.5;">
            ${isSignUp 
              ? 'Sign up to provision your instant free API key, test 16+ deterministic math engines, and connect AI agents.' 
              : 'Sign in to access your developer portal, inspect rate limits, and manage Dodo Payments subscriptions.'}
          </p>

          <!-- Primary OAuth Providers: GitHub & Google -->
          <div style="display: flex; flex-direction: column; gap: 11px; margin-bottom: 18px;">
            <button id="auth-login-github" type="button" style="width: 100%; padding: 11px 16px; font-size: 0.86rem; font-weight: 600; border-radius: 8px; background: #24292e; color: #ffffff; border: 1px solid #1b1f23; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: transform 0.1s ease;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              <span>${isSignUp ? 'Sign up with GitHub' : 'Continue with GitHub'}</span>
            </button>

            <button id="auth-login-google" type="button" style="width: 100%; padding: 11px 16px; font-size: 0.86rem; font-weight: 600; border-radius: 8px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: transform 0.1s ease;">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.28 21.43 7.35 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.57H1.25C.45 8.16 0 9.98 0 12c0 2.02.45 3.84 1.25 5.43l4.03-3.11z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.28 2.57 1.25 6.57l4.03 3.11c.95-2.83 3.6-4.93 6.72-4.93z"/></svg>
              <span>${isSignUp ? 'Sign up with Google' : 'Continue with Google'}</span>
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
            <div style="flex: 1; height: 1px; background: var(--border-color);"></div>
            <span style="font-size: 0.74rem; color: var(--text-muted); text-transform: uppercase;">or email magic link</span>
            <div style="flex: 1; height: 1px; background: var(--border-color);"></div>
          </div>

          <form id="auth-email-form" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
            <input type="email" id="auth-email-input" required placeholder="developer@example.com" value="developer@example.com" style="width: 100%; padding: 11px 14px; font-size: 0.86rem; border-radius: 8px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
            <button type="submit" style="width: 100%; padding: 11px; font-size: 0.86rem; font-weight: 700; border-radius: 8px; background: var(--accent-primary); color: #ffffff; border: none; cursor: pointer;">
              ${isSignUp ? 'Create Free Account' : 'Send Magic Sign-In Link'}
            </button>
          </form>

          <p style="margin: 0; font-size: 0.73rem; color: var(--text-muted); line-height: 1.4;">
            Protected by Cloudflare Edge OAuth 2.0. By continuing, you agree to TrueCalci's <a href="terms.html" style="color: var(--accent-primary); text-decoration: underline;">Terms</a> & <a href="privacy.html" style="color: var(--accent-primary); text-decoration: underline;">Privacy</a>.
          </p>
        </div>
      `;

      modal.style.display = "flex";

      // Attach tab events
      modal.querySelector("#tab-auth-signin")?.addEventListener("click", () => renderModalContent("signin"));
      modal.querySelector("#tab-auth-signup")?.addEventListener("click", () => renderModalContent("signup"));

      // Close modal events
      const closeModal = () => { modal.style.display = "none"; };
      modal.querySelector("#auth-modal-close")?.addEventListener("click", closeModal);
      modal.onclick = (e) => { if (e.target === modal) closeModal(); };

      // OAuth & Email Handlers
      const handleLogin = (provider, name, handle) => {
        const existingUser = JSON.parse(localStorage.getItem("tc_dev_user") || '{}');
        const user = {
          name: name || "Alex Chen",
          handle: handle || "alexchen.dev",
          provider,
          tier: existingUser.tier || "Developer Starter",
          tierId: existingUser.tierId || "starter",
          dodoCustomerId: existingUser.dodoCustomerId || `cus_dodo_${Date.now()}`,
          quotaLimit: existingUser.quotaLimit || 2500
        };
        localStorage.setItem("tc_dev_user", JSON.stringify(user));
        localStorage.setItem("tc_dev_auth", "true");
        this.updateAuthHeaderButton();
        closeModal();
        this.loadTool("developer", true);
      };

      modal.querySelector("#auth-login-github")?.addEventListener("click", () => {
        window.location.href = "/api/auth/github";
      });

      modal.querySelector("#auth-login-google")?.addEventListener("click", () => {
        window.location.href = "/api/auth/google";
      });

      modal.querySelector("#auth-email-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = modal.querySelector("#auth-email-input")?.value || "alex@agency.io";
        handleLogin("email", email.split("@")[0], email);
      });
    };

    renderModalContent(initialTab);
  }

  openAccountMenu() {
    const user = JSON.parse(localStorage.getItem("tc_dev_user") || '{}');
    const existingMenu = document.getElementById("header-account-popup");
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    const popup = document.createElement("div");
    popup.id = "header-account-popup";
    popup.style.cssText = `
      position: fixed;
      top: 60px;
      right: 24px;
      width: 240px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: var(--shadow-lg);
      z-index: 10002;
      padding: 12px;
    `;

    popup.innerHTML = `
      <div style="padding-bottom: 10px; border-bottom: 1px solid var(--border-color); margin-bottom: 8px;">
        <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">${user.name || 'Developer'}</div>
        <div style="font-size: 0.74rem; color: var(--text-muted);">${user.handle || 'alex.dev'}</div>
        <div style="margin-top: 6px; font-size: 0.72rem; padding: 2px 8px; border-radius: 10px; background: rgba(37,99,235,0.1); color: var(--accent-primary); font-weight: 600; display: inline-block;">
          ${user.tier || 'Developer Starter'}
        </div>
      </div>
      <button id="account-go-dev" type="button" style="width: 100%; text-align: left; padding: 8px; font-size: 0.82rem; font-weight: 500; color: var(--text-primary); background: transparent; border: none; border-radius: 6px; cursor: pointer;">
        Developer Portal & Keys →
      </button>
      <button id="account-go-pricing" type="button" style="width: 100%; text-align: left; padding: 8px; font-size: 0.82rem; font-weight: 500; color: var(--text-primary); background: transparent; border: none; border-radius: 6px; cursor: pointer;">
        Manage Dodo Subscription →
      </button>
      <div style="height: 1px; background: var(--border-color); margin: 6px 0;"></div>
      <button id="account-logout" type="button" style="width: 100%; text-align: left; padding: 8px; font-size: 0.82rem; font-weight: 600; color: #ef4444; background: transparent; border: none; border-radius: 6px; cursor: pointer;">
        Sign Out
      </button>
    `;

    document.body.appendChild(popup);

    const closePopup = () => popup.remove();
    setTimeout(() => {
      document.addEventListener("click", closePopup, { once: true });
    }, 50);

    popup.querySelector("#account-go-dev")?.addEventListener("click", () => {
      closePopup();
      this.loadTool("developer", true);
    });

    popup.querySelector("#account-go-pricing")?.addEventListener("click", () => {
      closePopup();
      this.loadTool("pricing", true);
    });

    popup.querySelector("#account-logout")?.addEventListener("click", () => {
      localStorage.removeItem("tc_dev_auth");
      localStorage.removeItem("tc_dev_user");
      this.updateAuthHeaderButton();
      closePopup();
      this.loadTool("home", true);
    });
  }
}

// Bootstrap on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  window.calculatorApp = new CalculatorApp();
});
