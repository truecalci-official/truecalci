/**
 * TrueCalci Global Finance Views
 * High-performance, responsive UI for:
 * 1. US & Global Mortgage (PITI & PMI)
 * 2. European & International VAT / Sales Tax
 * 3. Tip & Restaurant Bill Splitter
 * 4. Compound Interest & 401(k) Simulator
 */

import { GlobalFinanceEngine } from "../engines/global-finance.js";

export class ViewGlobalFinance {
  constructor(containerEl, openKnowledgeCallback) {
    this.containerEl = containerEl;
    this.openKnowledgeCallback = openKnowledgeCallback;
    this.currentTool = "mortgage"; // 'mortgage' | 'vat' | 'tip' | 'compound'

    // Regional settings
    this.region = localStorage.getItem("calc_region") || "global"; // 'global' | 'europe' | 'india'
    this.currencySymbol = this.region === "europe" ? "€" : (this.region === "india" ? "₹" : "$");
    this.locale = this.region === "europe" ? "de-DE" : (this.region === "india" ? "en-IN" : "en-US");
  }

  setTool(tool) {
    this.currentTool = tool;
    this.render();
  }

  setRegion(region) {
    this.region = region;
    this.currencySymbol = region === "europe" ? "€" : (region === "india" ? "₹" : "$");
    this.locale = region === "europe" ? "de-DE" : (region === "india" ? "en-IN" : "en-US");
    this.render();
  }

  format(val, decimals = 0) {
    return GlobalFinanceEngine.formatNumber(val, { locale: this.locale, decimals });
  }

  render() {
    if (!this.containerEl) return;

    if (this.currentTool === "mortgage") {
      this.renderMortgage();
    } else if (this.currentTool === "vat") {
      this.renderVAT();
    } else if (this.currentTool === "tip") {
      this.renderTip();
    } else if (this.currentTool === "compound") {
      this.renderCompound();
    }
  }

  // ---------------------------------------------------------------------------
  // 1. US & Global Mortgage (PITI & PMI)
  // ---------------------------------------------------------------------------
  renderMortgage() {
    this.containerEl.innerHTML = `
      <div class="fin-layout">
        <!-- Input Panel -->
        <div class="fin-card">
          <div class="fin-card-header">
            <h3 class="fin-card-title">Mortgage Parameters (PITI)</h3>
            <span class="fin-badge">US & International</span>
          </div>

          <div class="fin-form-group">
            <label class="fin-label" for="mg-price">
              <span>Home Purchase Price</span>
              <span class="fin-input-badge">${this.currencySymbol}</span>
            </label>
            <input type="number" id="mg-price" class="fin-input" value="450000" step="5000" min="10000" aria-label="Home Purchase Price">
            <input type="range" id="mg-price-range" class="fin-slider" value="450000" min="50000" max="2000000" step="10000" aria-label="Home Purchase Price Slider">
          </div>

          <div class="fin-grid-2">
            <div class="fin-form-group">
              <label class="fin-label" for="mg-down-range">
                <span>Down Payment (%)</span>
                <span id="mg-down-val" class="fin-val-highlight">20%</span>
              </label>
              <input type="range" id="mg-down-range" class="fin-slider" value="20" min="0" max="50" step="1" aria-label="Down Payment Percentage Slider">
            </div>
            <div class="fin-form-group">
              <label class="fin-label" for="mg-rate">
                <span>Interest Rate (%)</span>
                <span id="mg-rate-val" class="fin-val-highlight">6.75%</span>
              </label>
              <input type="number" id="mg-rate" class="fin-input" value="6.75" step="0.05" min="0.5" max="20" aria-label="Interest Rate Percentage">
            </div>
          </div>

          <div class="fin-grid-2">
            <div class="fin-form-group">
              <label class="fin-label" for="mg-term">Loan Term</label>
              <select id="mg-term" class="fin-select" aria-label="Loan Term Duration">
                <option value="30" selected>30 Years (Fixed)</option>
                <option value="20">20 Years (Fixed)</option>
                <option value="15">15 Years (Fixed)</option>
                <option value="10">10 Years (Fixed)</option>
              </select>
            </div>
            <div class="fin-form-group">
              <label class="fin-label" for="mg-tax-rate">Property Tax Rate (%)</label>
              <input type="number" id="mg-tax-rate" class="fin-input" value="1.20" step="0.05" min="0" aria-label="Annual Property Tax Rate Percentage">
            </div>
          </div>

          <div class="fin-grid-2">
            <div class="fin-form-group">
              <label class="fin-label" for="mg-insurance">Homeowners Insurance (${this.currencySymbol}/yr)</label>
              <input type="number" id="mg-insurance" class="fin-input" value="1400" step="50" min="0" aria-label="Annual Homeowners Insurance Premium">
            </div>
            <div class="fin-form-group">
              <label class="fin-label" for="mg-pmi">PMI Rate (% if &lt; 20% down)</label>
              <input type="number" id="mg-pmi" class="fin-input" value="0.75" step="0.05" min="0" aria-label="Annual Private Mortgage Insurance Rate Percentage">
            </div>
          </div>
        </div>

        <!-- Output Panel -->
        <div class="fin-card">
          <div class="fin-card-header">
            <h3 class="fin-card-title">Estimated Monthly Payment (PITI)</h3>
            <span class="fin-badge fin-badge-green">Live Breakdown</span>
          </div>

          <div class="fin-highlight-metric">
            <span class="fin-metric-label">Total Monthly PITI Payment</span>
            <span class="fin-metric-val" id="mg-total-monthly">${this.currencySymbol}0</span>
            <span class="fin-metric-sub" id="mg-pmi-alert">Includes Principal, Interest, Tax & Insurance</span>
          </div>

          <div class="fin-metrics-grid">
            <div class="fin-metric-item">
              <span class="fin-metric-label">Principal & Interest (P&I)</span>
              <span class="fin-metric-num" id="mg-m-pi">${this.currencySymbol}0</span>
            </div>
            <div class="fin-metric-item">
              <span class="fin-metric-label">Monthly Property Tax</span>
              <span class="fin-metric-num" id="mg-m-tax">${this.currencySymbol}0</span>
            </div>
            <div class="fin-metric-item">
              <span class="fin-metric-label">Monthly Homeowners Insurance</span>
              <span class="fin-metric-num" id="mg-m-ins">${this.currencySymbol}0</span>
            </div>
            <div class="fin-metric-item">
              <span class="fin-metric-label">Monthly PMI</span>
              <span class="fin-metric-num" id="mg-m-pmi">${this.currencySymbol}0</span>
            </div>
          </div>

          <div class="fin-summary-box">
            <div class="fin-summary-row">
              <span>Loan Principal Amount:</span>
              <strong id="mg-loan-amount">${this.currencySymbol}0</strong>
            </div>
            <div class="fin-summary-row">
              <span>Total Lifetime Interest:</span>
              <strong id="mg-total-interest" style="color:var(--danger,#ef4444);">${this.currencySymbol}0</strong>
            </div>
            <div class="fin-summary-row">
              <span>Total Cost of Loan (PITI + Down):</span>
              <strong id="mg-total-cost">${this.currencySymbol}0</strong>
            </div>
          </div>
        </div>
      </div>
    `;

    const update = () => {
      const price = parseFloat(document.getElementById("mg-price").value) || 0;
      const downPct = parseFloat(document.getElementById("mg-down-range").value) || 0;
      const rate = parseFloat(document.getElementById("mg-rate").value) || 0;
      const term = parseInt(document.getElementById("mg-term").value) || 30;
      const taxRate = parseFloat(document.getElementById("mg-tax-rate").value) || 0;
      const ins = parseFloat(document.getElementById("mg-insurance").value) || 0;
      const pmiRate = parseFloat(document.getElementById("mg-pmi").value) || 0;

      document.getElementById("mg-down-val").textContent = `${downPct}% (${this.currencySymbol}${this.format(price * (downPct / 100))})`;

      const res = GlobalFinanceEngine.calculateMortgagePITI({
        homePrice: price,
        downPaymentPercent: downPct,
        interestRate: rate,
        tenureYears: term,
        propertyTaxRatePercent: taxRate,
        annualHomeInsurance: ins,
        annualPmiPercent: pmiRate
      });

      document.getElementById("mg-total-monthly").textContent = `${this.currencySymbol}${this.format(res.monthlyTotalPITI)}`;
      document.getElementById("mg-m-pi").textContent = `${this.currencySymbol}${this.format(res.monthlyPI)}`;
      document.getElementById("mg-m-tax").textContent = `${this.currencySymbol}${this.format(res.monthlyPropertyTax)}`;
      document.getElementById("mg-m-ins").textContent = `${this.currencySymbol}${this.format(res.monthlyHomeInsurance)}`;
      document.getElementById("mg-m-pmi").textContent = `${this.currencySymbol}${this.format(res.monthlyPmi)}`;

      document.getElementById("mg-loan-amount").textContent = `${this.currencySymbol}${this.format(res.principal)}`;
      document.getElementById("mg-total-interest").textContent = `${this.currencySymbol}${this.format(res.totalInterest)}`;
      document.getElementById("mg-total-cost").textContent = `${this.currencySymbol}${this.format(res.totalCostOfLoan)}`;

      const pmiAlert = document.getElementById("mg-pmi-alert");
      if (res.isPmiRequired) {
        pmiAlert.innerHTML = `<span style="color:var(--warning,#f59e0b);">⚠️ Down payment &lt; 20%: Monthly PMI of ${this.currencySymbol}${this.format(res.monthlyPmi)} included</span>`;
      } else {
        pmiAlert.textContent = `✅ 20%+ Down Payment: No Private Mortgage Insurance (PMI) required!`;
      }
    };

    // Bind events
    document.getElementById("mg-price").addEventListener("input", (e) => {
      document.getElementById("mg-price-range").value = e.target.value;
      update();
    });
    document.getElementById("mg-price-range").addEventListener("input", (e) => {
      document.getElementById("mg-price").value = e.target.value;
      update();
    });
    document.getElementById("mg-down-range").addEventListener("input", update);
    document.getElementById("mg-rate").addEventListener("input", update);
    document.getElementById("mg-term").addEventListener("change", update);
    document.getElementById("mg-tax-rate").addEventListener("input", update);
    document.getElementById("mg-insurance").addEventListener("input", update);
    document.getElementById("mg-pmi").addEventListener("input", update);

    update();
  }

  // ---------------------------------------------------------------------------
  // 2. European & International VAT / Sales Tax
  // ---------------------------------------------------------------------------
  renderVAT() {
    const presets = GlobalFinanceEngine.getVATPresets();
    const presetHtml = presets.map(p => `
      <button class="pill-btn vat-preset-btn" data-rate="${p.standard}" data-name="${p.country}">
        <span>${p.flag}</span>
        <span>${p.country} (${p.standard}%)</span>
      </button>
    `).join("");

    this.containerEl.innerHTML = `
      <div class="fin-layout">
        <div class="fin-card">
          <div class="fin-card-header">
            <h3 class="fin-card-title">VAT / Sales Tax Calculator</h3>
            <span class="fin-badge">Europe & Global</span>
          </div>

          <!-- Mode Toggle -->
          <div class="pill-segmented-bar" style="margin-bottom:1.25rem;">
            <button class="pill-segment-btn active" id="vat-mode-add">Add VAT (Net → Gross)</button>
            <button class="pill-segment-btn" id="vat-mode-remove">Remove VAT (Gross → Net)</button>
          </div>

          <!-- Country Presets -->
          <div class="fin-form-group">
            <label class="fin-label">Quick Country Presets</label>
            <div class="filter-pills-bar" style="margin-bottom:0.75rem;">
              ${presetHtml}
            </div>
          </div>

          <div class="fin-form-group">
            <label class="fin-label" for="vat-amount">
              <span id="vat-amount-label">Net Amount (Pre-Tax)</span>
              <span class="fin-input-badge">${this.currencySymbol}</span>
            </label>
            <input type="number" id="vat-amount" class="fin-input" value="1000" step="10" min="0" aria-label="Taxable Amount">
          </div>

          <div class="fin-form-group">
            <label class="fin-label" for="vat-rate">
              <span>VAT / Tax Rate (%)</span>
              <span id="vat-rate-display" class="fin-val-highlight">20%</span>
            </label>
            <input type="number" id="vat-rate" class="fin-input" value="20" step="0.5" min="0" max="100" aria-label="VAT Tax Rate Percentage">
          </div>
        </div>

        <div class="fin-card">
          <div class="fin-card-header">
            <h3 class="fin-card-title">Tax Computation Summary</h3>
            <span class="fin-badge fin-badge-green">Instant Result</span>
          </div>

          <div class="fin-highlight-metric">
            <span class="fin-metric-label" id="vat-headline-label">Total Gross Amount (Incl. Tax)</span>
            <span class="fin-metric-val" id="vat-headline-val">${this.currencySymbol}1,200.00</span>
          </div>

          <div class="fin-metrics-grid">
            <div class="fin-metric-item">
              <span class="fin-metric-label">Net Amount (Excl. Tax)</span>
              <span class="fin-metric-num" id="vat-res-net">${this.currencySymbol}1,000.00</span>
            </div>
            <div class="fin-metric-item">
              <span class="fin-metric-label">VAT / Tax Amount</span>
              <span class="fin-metric-num" id="vat-res-tax" style="color:var(--accent-primary);">${this.currencySymbol}200.00</span>
            </div>
            <div class="fin-metric-item">
              <span class="fin-metric-label">Effective Tax Rate</span>
              <span class="fin-metric-num" id="vat-res-rate">20.0%</span>
            </div>
            <div class="fin-metric-item">
              <span class="fin-metric-label">Gross Total</span>
              <span class="fin-metric-num" id="vat-res-gross">${this.currencySymbol}1,200.00</span>
            </div>
          </div>

          <div class="fin-summary-box" id="vat-formula-explainer">
            Formula: Net Amount + 20% VAT = Gross Total
          </div>
        </div>
      </div>
    `;

    let currentMode = "add";

    const update = () => {
      const amount = parseFloat(document.getElementById("vat-amount").value) || 0;
      const rate = parseFloat(document.getElementById("vat-rate").value) || 0;

      const res = GlobalFinanceEngine.calculateVAT({ amount, vatRatePercent: rate, mode: currentMode });

      document.getElementById("vat-res-net").textContent = `${this.currencySymbol}${this.format(res.netAmount, 2)}`;
      document.getElementById("vat-res-tax").textContent = `${this.currencySymbol}${this.format(res.vatAmount, 2)}`;
      document.getElementById("vat-res-gross").textContent = `${this.currencySymbol}${this.format(res.grossAmount, 2)}`;
      document.getElementById("vat-res-rate").textContent = `${rate}%`;

      if (currentMode === "add") {
        document.getElementById("vat-amount-label").textContent = "Net Amount (Pre-Tax Base)";
        document.getElementById("vat-headline-label").textContent = "Total Gross Amount (Including VAT)";
        document.getElementById("vat-headline-val").textContent = `${this.currencySymbol}${this.format(res.grossAmount, 2)}`;
        document.getElementById("vat-formula-explainer").textContent = `Formula: ${this.currencySymbol}${this.format(res.netAmount, 2)} + ${rate}% VAT (${this.currencySymbol}${this.format(res.vatAmount, 2)}) = ${this.currencySymbol}${this.format(res.grossAmount, 2)}`;
      } else {
        document.getElementById("vat-amount-label").textContent = "Gross Amount (Invoice Total with VAT)";
        document.getElementById("vat-headline-label").textContent = "Original Net Amount (Pre-Tax Base)";
        document.getElementById("vat-headline-val").textContent = `${this.currencySymbol}${this.format(res.netAmount, 2)}`;
        document.getElementById("vat-formula-explainer").textContent = `Formula: ${this.currencySymbol}${this.format(res.grossAmount, 2)} / (1 + ${rate/100}) = Net ${this.currencySymbol}${this.format(res.netAmount, 2)} (Extracted Tax: ${this.currencySymbol}${this.format(res.vatAmount, 2)})`;
      }
    };

    document.getElementById("vat-mode-add").addEventListener("click", () => {
      currentMode = "add";
      document.getElementById("vat-mode-add").classList.add("active");
      document.getElementById("vat-mode-remove").classList.remove("active");
      update();
    });

    document.getElementById("vat-mode-remove").addEventListener("click", () => {
      currentMode = "remove";
      document.getElementById("vat-mode-remove").classList.add("active");
      document.getElementById("vat-mode-add").classList.remove("active");
      update();
    });

    document.querySelectorAll(".vat-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.getElementById("vat-rate").value = btn.dataset.rate;
        document.getElementById("vat-rate-display").textContent = `${btn.dataset.rate}% (${btn.dataset.name})`;
        update();
      });
    });

    document.getElementById("vat-amount").addEventListener("input", update);
    document.getElementById("vat-rate").addEventListener("input", () => {
      document.getElementById("vat-rate-display").textContent = `${document.getElementById("vat-rate").value}%`;
      update();
    });

    update();
  }

  // ---------------------------------------------------------------------------
  // 3. Tip & Restaurant Bill Splitter
  // ---------------------------------------------------------------------------
  renderTip() {
    this.containerEl.innerHTML = `
      <div class="fin-layout">
        <div class="fin-card">
          <div class="fin-card-header">
            <h3 class="fin-card-title">Tip & Bill Splitter</h3>
            <span class="fin-badge">Everyday Utility</span>
          </div>

          <div class="fin-form-group">
            <label class="fin-label" for="tip-bill">
              <span>Bill Amount (Subtotal)</span>
              <span class="fin-input-badge">${this.currencySymbol}</span>
            </label>
            <input type="number" id="tip-bill" class="fin-input" value="85.00" step="1" min="0" aria-label="Bill Subtotal Amount">
          </div>

          <div class="fin-form-group">
            <label class="fin-label" for="tip-custom-pct">Select Tip Percentage</label>
            <div class="filter-pills-bar" style="margin-bottom:0.75rem;">
              <button class="pill-btn tip-pct-btn" data-pct="15" aria-label="15 Percent Tip">15% (Fair)</button>
              <button class="pill-btn tip-pct-btn active" data-pct="18" aria-label="18 Percent Tip">18% (Standard)</button>
              <button class="pill-btn tip-pct-btn" data-pct="20" aria-label="20 Percent Tip">20% (Good)</button>
              <button class="pill-btn tip-pct-btn" data-pct="25" aria-label="25 Percent Tip">25% (Great)</button>
            </div>
            <input type="number" id="tip-custom-pct" class="fin-input" value="18" min="0" max="100" placeholder="Custom Tip %" aria-label="Custom Tip Percentage">
          </div>

          <div class="fin-form-group">
            <label class="fin-label" for="tip-guests-range">
              <span>Split Between (Number of Diners)</span>
              <span id="tip-guests-val" class="fin-val-highlight">2 People</span>
            </label>
            <input type="range" id="tip-guests-range" class="fin-slider" value="2" min="1" max="20" step="1" aria-label="Number of Diners Slider">
          </div>
        </div>

        <div class="fin-card">
          <div class="fin-card-header">
            <h3 class="fin-card-title">Payment Breakdown</h3>
            <span class="fin-badge fin-badge-green">Per Person</span>
          </div>

          <div class="fin-highlight-metric">
            <span class="fin-metric-label">Total Per Person</span>
            <span class="fin-metric-val" id="tip-per-person-total">${this.currencySymbol}0.00</span>
            <span class="fin-metric-sub" id="tip-per-person-sub">Includes food share + tip</span>
          </div>

          <div class="fin-metrics-grid">
            <div class="fin-metric-item">
              <span class="fin-metric-label">Bill Share / Person</span>
              <span class="fin-metric-num" id="tip-m-bill-share">${this.currencySymbol}0.00</span>
            </div>
            <div class="fin-metric-item">
              <span class="fin-metric-label">Tip Share / Person</span>
              <span class="fin-metric-num" id="tip-m-tip-share" style="color:var(--accent-primary);">${this.currencySymbol}0.00</span>
            </div>
            <div class="fin-metric-item">
              <span class="fin-metric-label">Total Tip Amount</span>
              <span class="fin-metric-num" id="tip-m-total-tip">${this.currencySymbol}0.00</span>
            </div>
            <div class="fin-metric-item">
              <span class="fin-metric-label">Total Bill with Tip</span>
              <span class="fin-metric-num" id="tip-m-grand-total">${this.currencySymbol}0.00</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const update = () => {
      const bill = parseFloat(document.getElementById("tip-bill").value) || 0;
      const pct = parseFloat(document.getElementById("tip-custom-pct").value) || 0;
      const guests = parseInt(document.getElementById("tip-guests-range").value) || 1;

      document.getElementById("tip-guests-val").textContent = `${guests} ${guests === 1 ? 'Person' : 'People'}`;

      const res = GlobalFinanceEngine.calculateTip({ billAmount: bill, tipPercent: pct, numberOfGuests: guests });

      document.getElementById("tip-per-person-total").textContent = `${this.currencySymbol}${this.format(res.totalPerPerson, 2)}`;
      document.getElementById("tip-m-bill-share").textContent = `${this.currencySymbol}${this.format(res.billPerPerson, 2)}`;
      document.getElementById("tip-m-tip-share").textContent = `${this.currencySymbol}${this.format(res.tipPerPerson, 2)}`;
      document.getElementById("tip-m-total-tip").textContent = `${this.currencySymbol}${this.format(res.tipAmount, 2)}`;
      document.getElementById("tip-m-grand-total").textContent = `${this.currencySymbol}${this.format(res.totalWithTip, 2)}`;
    };

    document.querySelectorAll(".tip-pct-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tip-pct-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("tip-custom-pct").value = btn.dataset.pct;
        update();
      });
    });

    document.getElementById("tip-bill").addEventListener("input", update);
    document.getElementById("tip-custom-pct").addEventListener("input", () => {
      document.querySelectorAll(".tip-pct-btn").forEach(b => b.classList.remove("active"));
      update();
    });
    document.getElementById("tip-guests-range").addEventListener("input", update);

    update();
  }

  // ---------------------------------------------------------------------------
  // 4. Compound Interest & Wealth Simulator (401k / ISA / Global)
  // ---------------------------------------------------------------------------
  renderCompound() {
    this.containerEl.innerHTML = `
      <div class="fin-layout">
        <div class="fin-card">
          <div class="fin-card-header">
            <h3 class="fin-card-title">Investment & Savings Growth</h3>
            <span class="fin-badge">Global Wealth Builder</span>
          </div>

          <div class="fin-form-group">
            <label class="fin-label" for="cp-principal">
              <span>Initial Principal Investment</span>
              <span class="fin-input-badge">${this.currencySymbol}</span>
            </label>
            <input type="number" id="cp-principal" class="fin-input" value="10000" step="500" min="0" aria-label="Initial Principal Amount">
          </div>

          <div class="fin-form-group">
            <label class="fin-label" for="cp-monthly">
              <span>Monthly Recurring Contribution</span>
              <span class="fin-input-badge">${this.currencySymbol}</span>
            </label>
            <input type="number" id="cp-monthly" class="fin-input" value="500" step="50" min="0" aria-label="Monthly Recurring Contribution Amount">
          </div>

          <div class="fin-grid-2">
            <div class="fin-form-group">
              <label class="fin-label" for="cp-rate">
                <span>Annual Return (%)</span>
                <span id="cp-rate-val" class="fin-val-highlight">8.0%</span>
              </label>
              <input type="number" id="cp-rate" class="fin-input" value="8.0" step="0.5" min="0.1" max="30" aria-label="Expected Annual Return Rate Percentage">
            </div>
            <div class="fin-form-group">
              <label class="fin-label" for="cp-years">
                <span>Investment Horizon</span>
                <span id="cp-years-val" class="fin-val-highlight">15 Years</span>
              </label>
              <input type="range" id="cp-years" class="fin-slider" value="15" min="1" max="40" step="1" aria-label="Investment Horizon Years Slider">
            </div>
          </div>
        </div>

        <div class="fin-card">
          <div class="fin-card-header">
            <h3 class="fin-card-title">Projected Wealth Corpus</h3>
            <span class="fin-badge fin-badge-green">Compounded Value</span>
          </div>

          <div class="fin-highlight-metric">
            <span class="fin-metric-label">Estimated Future Value</span>
            <span class="fin-metric-val" id="cp-future-val">${this.currencySymbol}0</span>
          </div>

          <div class="fin-metrics-grid">
            <div class="fin-metric-item">
              <span class="fin-metric-label">Total Principal Deposited</span>
              <span class="fin-metric-num" id="cp-total-deposits">${this.currencySymbol}0</span>
            </div>
            <div class="fin-metric-item">
              <span class="fin-metric-label">Compound Interest Gain</span>
              <span class="fin-metric-num" id="cp-total-gains" style="color:var(--accent-primary);">${this.currencySymbol}0</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const update = () => {
      const principal = parseFloat(document.getElementById("cp-principal").value) || 0;
      const monthly = parseFloat(document.getElementById("cp-monthly").value) || 0;
      const rate = parseFloat(document.getElementById("cp-rate").value) || 0;
      const years = parseInt(document.getElementById("cp-years").value) || 1;

      document.getElementById("cp-rate-val").textContent = `${rate}%`;
      document.getElementById("cp-years-val").textContent = `${years} Years`;

      const res = GlobalFinanceEngine.calculateCompoundWealth({
        principal,
        monthlyDeposit: monthly,
        annualRatePercent: rate,
        tenureYears: years
      });

      document.getElementById("cp-future-val").textContent = `${this.currencySymbol}${this.format(res.futureValue)}`;
      document.getElementById("cp-total-deposits").textContent = `${this.currencySymbol}${this.format(res.totalDeposited)}`;
      document.getElementById("cp-total-gains").textContent = `${this.currencySymbol}${this.format(res.totalInterest)}`;
    };

    document.getElementById("cp-principal").addEventListener("input", update);
    document.getElementById("cp-monthly").addEventListener("input", update);
    document.getElementById("cp-rate").addEventListener("input", update);
    document.getElementById("cp-years").addEventListener("input", update);

    update();
  }
}
