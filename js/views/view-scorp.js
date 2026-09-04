/**
 * RemoteParity - View 2: S-Corp vs. LLC Tax Optimizer & Reasonable Salary Calculator
 */

import { SCorpEngine } from "../engines/scorp-engine.js";

export class ViewSCorp {
  constructor(mountEl) {
    this.mountEl = mountEl;
    this.state = {
      netProfit: 150000,
      salaryPercent: 55,
      payrollAnnualFee: 600,
      cpaAnnualFee: 1500,
      stateAnnualFee: 200
    };
  }

  render() {
    this.mountEl.innerHTML = `
      <div class="rp-view-container">
        <!-- View Header -->
        <div class="rp-view-header">
          <h2 class="rp-view-title">S-Corp vs. LLC Tax Optimization Calculator</h2>
          <p class="rp-view-sub">Determine if electing S-Corporation tax status (IRS Form 1120-S) saves you money. Calculates FICA savings on distributions minus annual payroll & CPA filing costs.</p>
        </div>

        <!-- Presets -->
        <div class="rp-presets">
          <span class="rp-preset-title">Profit Tiers:</span>
          <button class="rp-preset-btn" id="sc-preset-80k" type="button">$80,000 Profit (Threshold)</button>
          <button class="rp-preset-btn" id="sc-preset-150k" type="button">$150,000 Profit (Typical Dev)</button>
          <button class="rp-preset-btn" id="sc-preset-250k" type="button">$250,000 Profit (High Earner)</button>
        </div>

        <!-- Hero Savings Banner -->
        <div class="rp-hero-verdict win-scorp" id="sc-hero-banner">
          <div class="rp-hero-pill pill-sky" id="sc-hero-pill">Evaluating S-Corp Savings...</div>
          <h3 class="rp-hero-headline" id="sc-hero-headline">Loading optimization...</h3>
          <p class="rp-hero-sub" id="sc-hero-sub">Calculating FICA tax shield on distributions vs corporate compliance costs...</p>

          <div class="rp-hero-metrics">
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Net In-Pocket Annual Savings</span>
              <span class="rp-hero-stat-val emerald" id="sc-stat-net-savings">$0 / yr</span>
              <span class="rp-hero-stat-hint">After all CPA & payroll fees</span>
            </div>
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Monthly Cash Advantage</span>
              <span class="rp-hero-stat-val sky" id="sc-stat-monthly-savings">$0 / mo</span>
              <span class="rp-hero-stat-hint">Extra take-home cash</span>
            </div>
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">S-Corp Breakeven Profit</span>
              <span class="rp-hero-stat-val" id="sc-stat-breakeven">$0</span>
              <span class="rp-hero-stat-hint">Minimum profit to justify S-Corp</span>
            </div>
            <div class="rp-hero-stat-item" style="justify-content: flex-end;">
              <button class="rp-btn-action" id="sc-btn-copy-summary" type="button" aria-label="Copy S-Corp Summary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>Copy Summary</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 2-Column Inputs & Allocation -->
        <div class="rp-grid-2">
          
          <!-- Column 1: Financial Inputs -->
          <div class="rp-card">
            <div class="rp-card-header">
              <div class="rp-card-title-group">
                <span class="rp-card-icon">💼</span>
                <div>
                  <h3 class="rp-card-title">Business Profit & Salary Split</h3>
                  <span class="rp-hint">Adjust net earnings and reasonable compensation</span>
                </div>
              </div>
              <span class="rp-card-badge">Inputs</span>
            </div>

            <!-- Net Business Profit -->
            <div class="rp-form-group">
              <div class="rp-label-row">
                <label class="rp-label" for="sc-profit-num">Annual Net Business Profit</label>
                <span class="rp-hint" id="sc-profit-display">$150,000</span>
              </div>
              <div class="rp-input-wrapper">
                <span class="rp-input-prefix">$</span>
                <input class="rp-input" id="sc-profit-num" type="number" step="5000" min="20000" max="800000" value="${this.state.netProfit}" aria-label="Annual Net Business Profit" />
              </div>
              <input class="rp-slider" id="sc-profit-slider" type="range" min="30000" max="500000" step="5000" value="${this.state.netProfit}" aria-label="Annual Net Business Profit Slider" />
            </div>

            <!-- Reasonable Salary Percentage -->
            <div class="rp-form-group">
              <div class="rp-label-row">
                <label class="rp-label" for="sc-salary-ratio-num">Reasonable W-2 Salary Ratio (%)</label>
                <span class="rp-hint" id="sc-salary-ratio-display">55% ($82,500)</span>
              </div>
              <input class="rp-slider" id="sc-salary-ratio-slider" type="range" min="30" max="85" step="1" value="${this.state.salaryPercent}" aria-label="Reasonable W-2 Salary Percentage Slider" />
              <span class="rp-hint">IRS guidelines require "reasonable compensation" for services performed before taking distributions.</span>
            </div>

            <!-- Administrative Overhead Fees -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="rp-form-group">
                <label class="rp-label" for="sc-payroll-fee">Payroll Software ($/yr)</label>
                <input class="rp-input no-prefix" id="sc-payroll-fee" type="number" step="50" min="0" max="3000" value="${this.state.payrollAnnualFee}" aria-label="Annual Payroll Software Fee" />
              </div>
              <div class="rp-form-group">
                <label class="rp-label" for="sc-cpa-fee">CPA 1120-S Filing ($/yr)</label>
                <input class="rp-input no-prefix" id="sc-cpa-fee" type="number" step="100" min="0" max="5000" value="${this.state.cpaAnnualFee}" aria-label="Annual CPA Corporate Filing Fee" />
              </div>
            </div>

            <div class="rp-form-group">
              <label class="rp-label" for="sc-state-fee">State Franchise & LLC Fee ($/yr)</label>
              <input class="rp-input no-prefix" id="sc-state-fee" type="number" step="50" min="0" max="2500" value="${this.state.stateAnnualFee}" aria-label="State Annual Franchise and Registration Fee" />
            </div>

          </div>

          <!-- Column 2: Tax Breakdown Comparison -->
          <div class="rp-card">
            <div class="rp-card-header">
              <div class="rp-card-title-group">
                <span class="rp-card-icon">📊</span>
                <div>
                  <h3 class="rp-card-title">Tax Mechanism Comparison</h3>
                  <span class="rp-hint">Sole Prop / LLC vs. S-Corporation Form 1120-S</span>
                </div>
              </div>
              <span class="rp-card-badge" style="background: var(--accent-apple-blue-bg); color: var(--accent-apple-blue); border-color: rgba(0, 113, 227, 0.25);">Analysis</span>
            </div>

            <div class="rp-highlight-box">
              <span class="rp-highlight-label">Gross FICA Tax Shield</span>
              <span class="rp-highlight-val sky" id="sc-stat-gross-savings">$0 / yr</span>
              <span class="rp-highlight-sub" id="sc-stat-distribution-exempt">$0 in K-1 distributions exempt from 15.3% SECA</span>
            </div>

            <!-- Detailed Breakdown Rows -->
            <div class="rp-rows">
              <div class="rp-row">
                <span>Standard LLC SECA Tax (15.3% on 92.35% profit)</span>
                <span class="rp-row-val rp-neg" id="sc-row-llc-tax">$0</span>
              </div>
              <div class="rp-row">
                <span>S-Corp W-2 Salary (<span id="sc-row-sal-amt">$0</span>)</span>
                <span class="rp-row-val" id="sc-row-sal-fica">-$0 FICA</span>
              </div>
              <div class="rp-row">
                <span>S-Corp Shareholder Distribution (<span id="sc-row-dist-amt">$0</span>)</span>
                <span class="rp-row-val rp-pos">$0 SECA (Exempt!)</span>
              </div>
              <div class="rp-row">
                <span>Total Annual S-Corp Compliance Overhead</span>
                <span class="rp-row-val rp-neg" id="sc-row-overhead">-$0</span>
              </div>
              <div class="rp-row total-row">
                <span>Net Bottom-Line Cash Savings</span>
                <span class="rp-row-val emerald" id="sc-row-net-savings">+$0 / yr</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;

    this.bindEvents();
    this.recalculate();
  }

  bindEvents() {
    const profitNum = document.getElementById("sc-profit-num");
    const profitSlider = document.getElementById("sc-profit-slider");
    if (profitNum && profitSlider) {
      profitNum.addEventListener("input", () => {
        this.state.netProfit = Number(profitNum.value);
        profitSlider.value = profitNum.value;
        this.recalculate();
      });
      profitSlider.addEventListener("input", () => {
        this.state.netProfit = Number(profitSlider.value);
        profitNum.value = profitSlider.value;
        this.recalculate();
      });
    }

    const ratioSlider = document.getElementById("sc-salary-ratio-slider");
    if (ratioSlider) {
      ratioSlider.addEventListener("input", () => {
        this.state.salaryPercent = Number(ratioSlider.value);
        this.recalculate();
      });
    }

    const bindFee = (id, key) => {
      document.getElementById(id)?.addEventListener("input", (e) => {
        this.state[key] = Number(e.target.value);
        this.recalculate();
      });
    };

    bindFee("sc-payroll-fee", "payrollAnnualFee");
    bindFee("sc-cpa-fee", "cpaAnnualFee");
    bindFee("sc-state-fee", "stateAnnualFee");

    // Presets
    document.getElementById("sc-preset-80k")?.addEventListener("click", () => {
      this.setPreset(80000, 60);
    });
    document.getElementById("sc-preset-150k")?.addEventListener("click", () => {
      this.setPreset(150000, 55);
    });
    document.getElementById("sc-preset-250k")?.addEventListener("click", () => {
      this.setPreset(250000, 48);
    });

    // Copy Summary
    document.getElementById("sc-btn-copy-summary")?.addEventListener("click", () => {
      this.copySummary();
    });
  }

  setPreset(profit, ratio) {
    this.state.netProfit = profit;
    this.state.salaryPercent = ratio;

    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = v;
    };

    setVal("sc-profit-num", profit);
    setVal("sc-profit-slider", profit);
    setVal("sc-salary-ratio-slider", ratio);

    this.recalculate();
  }

  recalculate() {
    const result = SCorpEngine.calculate({
      netProfit: this.state.netProfit,
      salaryPercent: this.state.salaryPercent,
      payrollAnnualFee: this.state.payrollAnnualFee,
      cpaAnnualFee: this.state.cpaAnnualFee,
      stateAnnualFee: this.state.stateAnnualFee
    });

    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setText("sc-profit-display", `$${this.state.netProfit.toLocaleString()}`);
    setText("sc-salary-ratio-display", `${this.state.salaryPercent}% ($${result.scorp.reasonableSalary.toLocaleString()})`);

    // Hero Banner
    const banner = document.getElementById("sc-hero-banner");
    const pill = document.getElementById("sc-hero-pill");
    if (banner && pill) {
      pill.textContent = result.savings.badge;
      if (result.savings.netAnnualSavings <= 0) {
        banner.className = "rp-hero-verdict";
        pill.className = "rp-hero-pill";
      } else {
        banner.className = "rp-hero-verdict win-scorp";
        pill.className = "rp-hero-pill pill-sky";
      }
    }

    setText("sc-hero-headline", result.savings.netAnnualSavings > 0
      ? `🎉 S-Corp election saves +$${result.savings.netAnnualSavings.toLocaleString()}/year in net take-home cash!`
      : `At $${this.state.netProfit.toLocaleString()} profit, standard LLC is more cost-effective.`
    );
    setText("sc-hero-sub", result.savings.verdict);

    setText("sc-stat-net-savings", `${result.savings.netAnnualSavings >= 0 ? "+$" : "-$"}${Math.abs(result.savings.netAnnualSavings).toLocaleString()} / yr`);
    setText("sc-stat-monthly-savings", `${result.savings.netMonthlySavings >= 0 ? "+$" : "-$"}${Math.abs(result.savings.netMonthlySavings).toLocaleString()} / mo`);
    setText("sc-stat-breakeven", `$${result.savings.breakevenProfitThreshold.toLocaleString()}/yr`);

    setText("sc-stat-gross-savings", `+$${result.savings.grossFicaSavings.toLocaleString()} / yr`);
    setText("sc-stat-distribution-exempt", `$${result.scorp.k1Distribution.toLocaleString()} in K-1 distributions exempt from 15.3% SECA`);

    setText("sc-row-llc-tax", `-$${result.llc.totalSecaTax.toLocaleString()}`);
    setText("sc-row-sal-amt", `$${result.scorp.reasonableSalary.toLocaleString()}`);
    setText("sc-row-sal-fica", `-$${result.scorp.totalFicaTax.toLocaleString()} FICA`);
    setText("sc-row-dist-amt", `$${result.scorp.k1Distribution.toLocaleString()}`);
    setText("sc-row-overhead", `-$${result.savings.totalOverhead.toLocaleString()}`);
    setText("sc-row-net-savings", `${result.savings.netAnnualSavings >= 0 ? "+$" : "-$"}${Math.abs(result.savings.netAnnualSavings).toLocaleString()} / yr`);

    this.lastResult = result;
  }

  copySummary() {
    if (!this.lastResult) return;
    const res = this.lastResult;
    const text = `💼 RemoteParity S-Corp Analysis:
• Net Business Profit: $${res.netProfit.toLocaleString()}
• Reasonable W-2 Salary: $${res.scorp.reasonableSalary.toLocaleString()} (${res.scorp.salaryRatioPercent}%)
• S-Corp K-1 Distribution: $${res.scorp.k1Distribution.toLocaleString()} (Exempt from SECA)
• Gross FICA Tax Savings: $${res.savings.grossFicaSavings.toLocaleString()}/yr
• Compliance Overhead (Payroll + CPA): $${res.savings.totalOverhead.toLocaleString()}/yr
• NET IN-POCKET CASH SAVINGS: +$${res.savings.netAnnualSavings.toLocaleString()}/yr (+$${res.savings.netMonthlySavings.toLocaleString()}/mo)
• Status: ${res.savings.badge}
Calculated via RemoteParity (https://remoteparity.com) • @KNVK`;

    navigator.clipboard?.writeText(text).then(() => {
      const btn = document.getElementById("sc-btn-copy-summary");
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = `<span>Copied to Clipboard!</span>`;
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      }
    });
  }
}
