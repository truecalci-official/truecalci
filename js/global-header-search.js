/**
 * TrueCalci Global Omnibar Header Search
 * Zero-dependency universal search controller across all pages.
 * Supports hotkey '/', keyboard navigation, and instant routing.
 */
(function() {
  const SEARCH_ITEMS = [
    // 24 Production Deterministic Engines
    { title: "1099 vs W-2 Parity & S-Corp Optimizer", code: "CTR-18", category: "Remote & Contractor", url: "/workstation.html#ctr-18" },
    { title: "S-Corp Reasonable Salary Optimizer", code: "SCP-19", category: "Remote & Contractor", url: "/workstation.html#scp-19" },
    { title: "Solo 401(k) Maximizer", code: "SLO-20", category: "Remote & Contractor", url: "/workstation.html#slo-20" },
    { title: "Cross-Border FX Rail Drag", code: "FXR-21", category: "Remote & Contractor", url: "/workstation.html#fxr-21" },
    { title: "Billable Hourly Floor Solver", code: "BHF-22", category: "Remote & Contractor", url: "/workstation.html#bhf-22" },
    { title: "AI Token Arbitrage & Cache Solver", code: "AIT-20", category: "AI & Cloud FinOps", url: "/workstation.html#ait-20" },
    { title: "Startup Runway & Option Pool Shuffle", code: "SRD-21", category: "AI & Cloud FinOps", url: "/workstation.html#srd-21" },
    { title: "B2B Cross-Border Withholding & PE Risk", code: "B2B-22", category: "AI & Cloud FinOps", url: "/workstation.html#b2b-22" },
    { title: "IRS Form 2555 FEIE Nomad Tracker", code: "FEI-23", category: "AI & Cloud FinOps", url: "/workstation.html#fei-23" },
    { title: "Cloud Egress & Interconnect FinOps", code: "CEF-24", category: "AI & Cloud FinOps", url: "/workstation.html#cef-24" },
    { title: "US Mortgage PITI & Automated PMI", code: "MTG-01", category: "Global Real Estate", url: "/workstation.html#mtg-01" },
    { title: "European & Global VAT / Sales Tax", code: "VAT-02", category: "Global Real Estate", url: "/workstation.html#vat-02" },
    { title: "Dining Bill & Itemized Tip Splitter", code: "TIP-03", category: "Global Real Estate", url: "/workstation.html#tip-03" },
    { title: "Compound Wealth & Fire Simulator", code: "CMP-04", category: "Global Real Estate", url: "/workstation.html#cmp-04" },
    { title: "Indian Income Tax New vs Old Regime", code: "ITX-05", category: "India Statutory", url: "/workstation.html#itx-05" },
    { title: "Mutual Fund SIP & Step-Up Wealth", code: "SIP-06", category: "India Statutory", url: "/workstation.html#sip-06" },
    { title: "PPF 15-Year Statutory Maturity", code: "PPF-07", category: "India Statutory", url: "/workstation.html#ppf-07" },
    { title: "NPS Tier 1 Additional 80CCD(1B)", code: "NPS-08", category: "India Statutory", url: "/workstation.html#nps-08" },
    { title: "Home Loan EMI with Prepayment Schedule", code: "EMI-09", category: "India Statutory", url: "/workstation.html#emi-09" },
    { title: "Gratuity Payment Act 1972 Solver", code: "GRT-10", category: "India Statutory", url: "/workstation.html#grt-10" },
    { title: "Engineering Scientific Calci 991 Standard", code: "SCI-11", category: "Engineering Mathematics", url: "/engineering-formulas.html" },
    { title: "Black-Scholes European Options & Greeks", code: "BSM-15", category: "Engineering Mathematics", url: "/workstation.html#bsm-15" },
    { title: "Euler-Bernoulli Beam Deflection & Stress", code: "BEAM-16", category: "Engineering Mathematics", url: "/workstation.html#beam-16" },
    { title: "2D Ballistic Projectile Kinematics", code: "BAL-17", category: "Engineering Mathematics", url: "/workstation.html#bal-17" },
    // Pages & Resources
    { title: "Workstation Studio — 24 Engines", code: "APP", category: "Product", url: "/workstation.html" },
    { title: "Engineering Mathematics & Formulas Handbook", code: "DOCS", category: "Resources", url: "/engineering-formulas.html" },
    { title: "Official Documentation & API Specs", code: "API", category: "Resources", url: "/docs.html" },
    { title: "Pricing & Compute Plans (USD / INR)", code: "BILL", category: "Pricing", url: "/pricing.html" },
    { title: "Terms of Service & Regulatory Compliance", code: "LEGAL", category: "Resources", url: "/terms.html" },
    { title: "Privacy Policy & Zero Data Retention Trust Center", code: "TRUST", category: "Resources", url: "/privacy.html" }
  ];

  function initGlobalSearch() {
    const searchInputs = document.querySelectorAll('.header-search-input');
    
    // Global hotkey '/'
    document.addEventListener('keydown', function(e) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        const primaryInput = document.querySelector('.header-search-input');
        if (primaryInput) {
          primaryInput.focus();
          primaryInput.select();
        }
      }
    });

    searchInputs.forEach(input => {
      const container = input.closest('.header-search-box') || input.parentElement;
      let dropdown = container.querySelector('.header-search-dropdown');
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'header-search-dropdown';
        container.appendChild(dropdown);
      }

      let selectedIndex = -1;

      input.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        if (!query) {
          dropdown.classList.remove('active');
          dropdown.innerHTML = '';
          selectedIndex = -1;
          return;
        }

        const matches = SEARCH_ITEMS.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.code.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        ).slice(0, 8);

        if (matches.length === 0) {
          dropdown.innerHTML = '<div style="padding: 12px; font-size: 0.8rem; color: var(--text-muted); text-align: center;">No matching calculators or documentation found.</div>';
          dropdown.classList.add('active');
          return;
        }

        selectedIndex = -1;
        dropdown.innerHTML = matches.map((m, idx) => `
          <a href="${m.url}" class="search-dropdown-item" data-index="${idx}">
            <div class="search-dropdown-item-title">
              <span style="font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; background: rgba(0, 102, 255, 0.1); color: #0066ff; font-weight: 700; font-family: var(--font-mono);">${m.code}</span>
              <span>${m.title}</span>
            </div>
            <span class="search-dropdown-item-cat">${m.category}</span>
          </a>
        `).join('');

        dropdown.classList.add('active');
      });

      input.addEventListener('keydown', function(e) {
        const items = dropdown.querySelectorAll('.search-dropdown-item');
        if (!items.length || !dropdown.classList.contains('active')) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % items.length;
          updateHighlight(items, selectedIndex);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedIndex = (selectedIndex - 1 + items.length) % items.length;
          updateHighlight(items, selectedIndex);
        } else if (e.key === 'Enter') {
          if (selectedIndex >= 0 && items[selectedIndex]) {
            e.preventDefault();
            items[selectedIndex].click();
          }
        } else if (e.key === 'Escape') {
          dropdown.classList.remove('active');
        }
      });

      document.addEventListener('click', function(e) {
        if (!container.contains(e.target)) {
          dropdown.classList.remove('active');
        }
      });
    });

    function updateHighlight(items, index) {
      items.forEach((it, i) => {
        if (i === index) {
          it.style.backgroundColor = 'var(--bg-subtle)';
          it.scrollIntoView({ block: 'nearest' });
        } else {
          it.style.backgroundColor = '';
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalSearch);
  } else {
    initGlobalSearch();
  }
})();
