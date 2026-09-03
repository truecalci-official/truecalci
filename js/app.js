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
import { CALCULATOR_DEFINITIONS } from "./data/definitions.js";
import { analytics } from "./analytics.js";
import { ContractorMatrixEngine } from "./engines/contractor-matrix.js";

window.ContractorMatrixEngine = ContractorMatrixEngine;

class CalculatorApp {
  constructor() {
    this.validTools = [
      "contractor_matrix", "mortgage", "vat", "tip", "compound",
      "tax", "gst", "sip", "fd", "gold", 
      "ppf", "ssy", "home_loan", "land", 
      "calci_991", "basic", "programmer",
      "developer", "admin", "api", "pricing"
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
      this.currentTool = this.validTools.includes(initialHash) ? initialHash : "contractor_matrix";
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
    this.initCompanionDock();
  }

  initRegion() {
    const savedRegion = localStorage.getItem("calc_region") || "global";
    this.setRegion(savedRegion, false);

    document.querySelectorAll(".region-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setRegion(btn.dataset.region, true);
      });
    });
  }

  setRegion(region, reload = true) {
    this.currentRegion = region;
    localStorage.setItem("calc_region", region);

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
      { key: "ppf", title: "Public Provident Fund (PPF 7.1%)", category: "Govt Schemes", keywords: "ppf small savings 7.1% eee tax free interest" },
      { key: "ssy", title: "Sukanya Samriddhi Yojana (SSY 8.2%)", category: "Govt Schemes", keywords: "ssy girl child welfare 8.2% post office" },
      { key: "home_loan", title: "Home Loan EMI & Prepayment", category: "Loans", keywords: "home loan emi reducing balance amortization prepayment interest" },
      { key: "land", title: "Indian Land Units (Gaj / Bigha)", category: "Property", keywords: "land area gaj bigha guntha cent acre square feet" },
      { key: "calci_991", title: "Scientific Calci 991 (V.P.A.M.)", category: "Engineering", keywords: "calci 991 scientific integral derivative simpson quadratic eqn solve gate" },
      { key: "basic", title: "Desktop Arithmetic Calculator", category: "Utilities", keywords: "basic arithmetic commercial memory percentage square root" },
      { key: "programmer", title: "Programmer (64-Bit) & Bitboard", category: "Utilities", keywords: "programmer hex dec oct bin 64-bit bitwise bitboard" },
      { url: "engineering-formulas.html", title: "Engineering & Architecture Formulas Portal", category: "Formulas", keywords: "formulas simpson taylor bernoulli euler bending moment far gate" },
      { url: "terms.html", title: "Terms of Service & Regulatory Disclaimers", category: "Legal", keywords: "terms conditions sebi disclaimer compliance legality" }
    ];
  }

  initTheme() {
    const savedTheme = localStorage.getItem("calc_theme") || "dark";
    this.setTheme(savedTheme, false);

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

    if (this.themeToggleBtn) {
      this.updateThemeIcon(theme);
    }

    if (track) {
      analytics.trackThemeChange(theme);
    }
  }

  updateThemeIcon(theme) {
    if (this.themeToggleBtn) {
      this.themeToggleBtn.innerHTML = theme === "light" 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
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
      const hashTool = window.location.hash.replace("#", "").trim();
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

    // Update URL hash without breaking history for refresh persistence
    if (updateHash && window.location.hash !== '#' + toolKey) {
      history.replaceState(null, '', '#' + toolKey);
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

    if (toolKey === "admin") {
      this.workspaceEl.innerHTML = `<div id="tool-view-mount"></div>`;
      const mountEl = document.getElementById("tool-view-mount");
      this.currentAdminView = new ViewAdminPortal(mountEl);
      this.currentAdminView.render();
      return;
    }

    if (toolKey === "developer" || toolKey === "api" || toolKey === "pricing") {
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
}

// Bootstrap on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  window.calculatorApp = new CalculatorApp();
});
