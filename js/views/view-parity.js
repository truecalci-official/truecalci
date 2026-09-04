/**
 * RemoteParity - View 1: 1099 vs W-2 Parity & Breakeven Solver
 */

import { ParityEngine } from "../engines/parity-engine.js";

export class ViewParity {
  constructor(mountEl) {
    this.mountEl = mountEl;
    this.state = {
      salary: 130000,
      filingStatus: "single",
      stateTaxRatePercent: 5.0,
      healthSubsidyAnnual: 7200,
      match401kPercent: 4.0,
      ptoDays: 25,
      hourlyRate: 85,
      hoursPerWeek: 40,
      weeksPerYear: 48,
      annualExpenses: 6000,
      eligibleQBI: true,
      selfFundedHealthAnnual: 7200
    };
  }

  render() {
    this.mountEl.innerHTML = `
      <div class="rp-view-container">
        <!-- View Title -->
        <div class="rp-view-header">
          <h2 class="rp-view-title">1099 vs. W-2 Parity & Breakeven Solver</h2>
          <p class="rp-view-sub">Compare actual take-home spendable cash under 2024/2025 IRS tax law. Solves the exact 1099 hourly rate needed to match employee corporate benefits.</p>
        </div>

        <!-- Presets -->
        <div class="rp-presets">
          <span class="rp-preset-title">Presets:</span>
          <button class="rp-preset-btn" id="p-preset-junior" type="button">Junior Dev ($90k vs $60/hr)</button>
          <button class="rp-preset-btn" id="p-preset-senior" type="button">Senior SWE ($140k vs $95/hr)</button>
          <button class="rp-preset-btn" id="p-preset-lead" type="button">Principal Lead ($200k vs $145/hr)</button>
        </div>

        <!-- Hero Verdict Banner -->
        <div class="rp-hero-verdict" id="p-hero-banner">
          <div class="rp-hero-pill" id="p-hero-pill">Evaluating Parity...</div>
          <h3 class="rp-hero-headline" id="p-hero-headline">Loading comparison...</h3>
          <p class="rp-hero-sub" id="p-hero-sub">Calculating progressive IRS brackets, Section 199A QBI, and SECA tax...</p>

          <div class="rp-hero-metrics">
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Spendable Cash Breakeven</span>
              <span class="rp-hero-stat-val emerald" id="p-stat-cash-breakeven">$0.00/hr</span>
              <span class="rp-hero-stat-hint">Matches net cash in checking account</span>
            </div>
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Total Comp Breakeven</span>
              <span class="rp-hero-stat-val sky" id="p-stat-comp-breakeven">$0.00/hr</span>
              <span class="rp-hero-stat-hint">Matches cash + health + 401(k) match</span>
            </div>
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Rule of Thumb (1.35x)</span>
              <span class="rp-hero-stat-val" id="p-stat-rule-thumb">$0.00/hr</span>
              <span class="rp-hero-stat-hint">Standard contractor multiplier</span>
            </div>
            <div class="rp-hero-stat-item" style="justify-content: flex-end;">
              <button class="rp-btn-action" id="p-btn-copy-summary" type="button" aria-label="Copy Parity Summary to Clipboard">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>Copy Summary</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 2-Column Comparison Layout -->
        <div class="rp-grid-2">
          
          <!-- Column 1: W-2 Salaried Offer -->
          <div class="rp-card">
            <div class="rp-card-header">
              <div class="rp-card-title-group">
                <span class="rp-card-icon">🏢</span>
                <div>
                  <h3 class="rp-card-title">W-2 Salaried Employment</h3>
                  <span class="rp-hint">Full-time corporate employee with standard benefits</span>
                </div>
              </div>
              <span class="rp-card-badge">Employee</span>
            </div>

            <!-- Base Salary -->
            <div class="rp-form-group">
              <div class="rp-label-row">
                <label class="rp-label" for="p-w2-salary-num">Annual Base Salary</label>
                <span class="rp-hint" id="p-w2-salary-display">$130,000</span>
              </div>
              <div class="rp-input-wrapper">
                <span class="rp-input-prefix">$</span>
                <input class="rp-input" id="p-w2-salary-num" type="number" step="1000" min="20000" max="800000" value="${this.state.salary}" aria-label="W-2 Annual Base Salary Amount" />
              </div>
              <input class="rp-slider" id="p-w2-salary-slider" type="range" min="30000" max="400000" step="2500" value="${this.state.salary}" aria-label="W-2 Annual Base Salary Slider" />
            </div>

            <!-- Filing Status & State Tax -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="rp-form-group">
                <label class="rp-label" for="p-w2-filing">Tax Filing Status</label>
                <select class="rp-select" id="p-w2-filing" aria-label="W-2 Tax Filing Status">
                  <option value="single" ${this.state.filingStatus === "single" ? "selected" : ""}>Single Filer</option>
                  <option value="mfj" ${this.state.filingStatus === "mfj" ? "selected" : ""}>Married Jointly</option>
                </select>
              </div>
              <div class="rp-form-group">
                <label class="rp-label" for="p-w2-state">State Tax Rate (%)</label>
                <select class="rp-select" id="p-w2-state" aria-label="W-2 State Tax Profile">
                  <option value="0">0% (TX, WA, FL, NV)</option>
                  <option value="3.07">3.07% (Pennsylvania)</option>
                  <option value="5.0" selected>5.0% (Average US)</option>
                  <option value="9.3">9.3% (California)</option>
                  <option value="10.9">10.9% (New York)</option>
                </select>
              </div>
            </div>

            <!-- Health Subsidy & 401(k) Match -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="rp-form-group">
                <label class="rp-label" for="p-w2-health">Health Subsidy ($/yr)</label>
                <input class="rp-input no-prefix" id="p-w2-health" type="number" step="500" min="0" max="30000" value="${this.state.healthSubsidyAnnual}" aria-label="W-2 Employer Health Insurance Subsidy" />
              </div>
              <div class="rp-form-group">
                <label class="rp-label" for="p-w2-401k">401(k) Match (%)</label>
                <input class="rp-input no-prefix" id="p-w2-401k" type="number" step="0.5" min="0" max="15" value="${this.state.match401kPercent}" aria-label="W-2 Employer 401(k) Match Percentage" />
              </div>
            </div>

            <!-- Net Cash Highlight -->
            <div class="rp-highlight-box">
              <span class="rp-highlight-label">W-2 Net Spendable Cash</span>
              <span class="rp-highlight-val" id="p-w2-net-monthly">$0 / mo</span>
              <span class="rp-highlight-sub" id="p-w2-net-annual">$0 / year in checking account</span>
            </div>

            <!-- Itemized Breakdown -->
            <div class="rp-rows">
              <div class="rp-row">
                <span>Employee FICA (7.65% Social Security & Medicare)</span>
                <span class="rp-row-val rp-neg" id="p-w2-row-fica">-$0</span>
              </div>
              <div class="rp-row">
                <span>Federal Progressive Income Tax</span>
                <span class="rp-row-val rp-neg" id="p-w2-row-fed">-$0</span>
              </div>
              <div class="rp-row">
                <span>State Income Tax</span>
                <span class="rp-row-val rp-neg" id="p-w2-row-state">-$0</span>
              </div>
              <div class="rp-row">
                <span>Corporate Benefits Value (Health + 401k + PTO)</span>
                <span class="rp-row-val rp-pos" id="p-w2-row-benefits">+$0</span>
              </div>
              <div class="rp-row total-row">
                <span>Total Compensation Value</span>
                <span class="rp-row-val" id="p-w2-row-total-comp">$0</span>
              </div>
            </div>
          </div>

          <!-- Column 2: 1099 Independent Contractor Offer -->
          <div class="rp-card">
            <div class="rp-card-header">
              <div class="rp-card-title-group">
                <span class="rp-card-icon">⚡</span>
                <div>
                  <h3 class="rp-card-title">1099 Independent Contractor</h3>
                  <span class="rp-hint">Self-employed, sole proprietor, or single-member LLC</span>
                </div>
              </div>
              <span class="rp-card-badge" style="background: var(--accent-emerald-bg); color: var(--accent-emerald); border-color: rgba(5, 150, 105, 0.25);">Contractor</span>
            </div>

            <!-- Hourly Rate -->
            <div class="rp-form-group">
              <div class="rp-label-row">
                <label class="rp-label" for="p-c-rate-num">Hourly Billing Rate</label>
                <span class="rp-hint" id="p-c-rate-display">$85/hr</span>
              </div>
              <div class="rp-input-wrapper">
                <span class="rp-input-prefix">$</span>
                <input class="rp-input" id="p-c-rate-num" type="number" step="1" min="15" max="600" value="${this.state.hourlyRate}" aria-label="1099 Hourly Billing Rate Amount" />
              </div>
              <input class="rp-slider" id="p-c-rate-slider" type="range" min="25" max="250" step="1" value="${this.state.hourlyRate}" aria-label="1099 Hourly Billing Rate Slider" />
            </div>

            <!-- Billable Schedule -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="rp-form-group">
                <label class="rp-label" for="p-c-hours">Billable Hrs / Week</label>
                <input class="rp-input no-prefix" id="p-c-hours" type="number" step="1" min="10" max="60" value="${this.state.hoursPerWeek}" aria-label="1099 Billable Hours Per Week" />
              </div>
              <div class="rp-form-group">
                <label class="rp-label" for="p-c-weeks">Working Wks / Year</label>
                <input class="rp-input no-prefix" id="p-c-weeks" type="number" step="1" min="20" max="52" value="${this.state.weeksPerYear}" aria-label="1099 Working Weeks Per Year" />
              </div>
            </div>

            <!-- Expenses & Health -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="rp-form-group">
                <label class="rp-label" for="p-c-expenses">Business Expenses ($/yr)</label>
                <input class="rp-input no-prefix" id="p-c-expenses" type="number" step="500" min="0" max="60000" value="${this.state.annualExpenses}" aria-label="1099 Deductible Business Expenses" />
              </div>
              <div class="rp-form-group">
                <label class="rp-label" for="p-c-health">Self-Funded Health ($/yr)</label>
                <input class="rp-input no-prefix" id="p-c-health" type="number" step="500" min="0" max="30000" value="${this.state.selfFundedHealthAnnual}" aria-label="1099 Self-Funded Health Insurance Premium" />
              </div>
            </div>

            <!-- Net Cash Highlight -->
            <div class="rp-highlight-box">
              <span class="rp-highlight-label">1099 Net Spendable Cash</span>
              <span class="rp-highlight-val emerald" id="p-c-net-monthly">$0 / mo</span>
              <span class="rp-highlight-sub" id="p-c-net-annual">$0 / year in checking account</span>
            </div>

            <!-- Itemized Breakdown -->
            <div class="rp-rows">
              <div class="rp-row">
                <span>Gross Billing (<span id="p-c-total-hrs">1,920</span> billable hours)</span>
                <span class="rp-row-val rp-pos" id="p-c-row-gross">$0</span>
              </div>
              <div class="rp-row">
                <span>Self-Employment Tax (15.3% SECA on 92.35% net profit)</span>
                <span class="rp-row-val rp-neg" id="p-c-row-seca">-$0</span>
              </div>
              <div class="rp-row">
                <span>Section 199A QBI 20% Pass-Through Deduction</span>
                <span class="rp-row-val rp-pos" id="p-c-row-qbi">-$0 (Tax Shield)</span>
              </div>
              <div class="rp-row">
                <span>Federal Progressive Income Tax</span>
                <span class="rp-row-val rp-neg" id="p-c-row-fed">-$0</span>
              </div>
              <div class="rp-row total-row">
                <span>Net Spendable Cash (Post-Taxes & Expenses)</span>
                <span class="rp-row-val emerald" id="p-c-row-total-cash">$0</span>
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
    const bindNumSlider = (numId, sliderId, stateKey) => {
      const num = document.getElementById(numId);
      const slider = document.getElementById(sliderId);
      if (!num || !slider) return;

      num.addEventListener("input", () => {
        this.state[stateKey] = Number(num.value);
        slider.value = num.value;
        this.recalculate();
      });

      slider.addEventListener("input", () => {
        this.state[stateKey] = Number(slider.value);
        num.value = slider.value;
        this.recalculate();
      });
    };

    bindNumSlider("p-w2-salary-num", "p-w2-salary-slider", "salary");
    bindNumSlider("p-c-rate-num", "p-c-rate-slider", "hourlyRate");

    const bindInput = (id, key) => {
      document.getElementById(id)?.addEventListener("input", (e) => {
        this.state[key] = e.target.type === "number" ? Number(e.target.value) : e.target.value;
        this.recalculate();
      });
    };

    bindInput("p-w2-filing", "filingStatus");
    bindInput("p-w2-state", "stateTaxRatePercent");
    bindInput("p-w2-health", "healthSubsidyAnnual");
    bindInput("p-w2-401k", "match401kPercent");
    bindInput("p-c-hours", "hoursPerWeek");
    bindInput("p-c-weeks", "weeksPerYear");
    bindInput("p-c-expenses", "annualExpenses");
    bindInput("p-c-health", "selfFundedHealthAnnual");

    // Presets
    document.getElementById("p-preset-junior")?.addEventListener("click", () => {
      this.setPreset(90000, 60, 48, 4000);
    });
    document.getElementById("p-preset-senior")?.addEventListener("click", () => {
      this.setPreset(140000, 95, 48, 6000);
    });
    document.getElementById("p-preset-lead")?.addEventListener("click", () => {
      this.setPreset(200000, 145, 48, 10000);
    });

    // Copy Summary
    document.getElementById("p-btn-copy-summary")?.addEventListener("click", () => {
      this.copySummary();
    });
  }

  setPreset(salary, rate, weeks, expenses) {
    this.state.salary = salary;
    this.state.hourlyRate = rate;
    this.state.weeksPerYear = weeks;
    this.state.annualExpenses = expenses;

    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = v;
    };

    setVal("p-w2-salary-num", salary);
    setVal("p-w2-salary-slider", salary);
    setVal("p-c-rate-num", rate);
    setVal("p-c-rate-slider", rate);
    setVal("p-c-weeks", weeks);
    setVal("p-c-expenses", expenses);

    this.recalculate();
  }

  recalculate() {
    const result = ParityEngine.calculateParity(
      {
        salary: this.state.salary,
        filingStatus: this.state.filingStatus,
        stateTaxRatePercent: this.state.stateTaxRatePercent,
        healthSubsidyAnnual: this.state.healthSubsidyAnnual,
        match401kPercent: this.state.match401kPercent,
        ptoDays: this.state.ptoDays
      },
      {
        hourlyRate: this.state.hourlyRate,
        hoursPerWeek: this.state.hoursPerWeek,
        weeksPerYear: this.state.weeksPerYear,
        annualExpenses: this.state.annualExpenses,
        filingStatus: this.state.filingStatus,
        stateTaxRatePercent: this.state.stateTaxRatePercent,
        eligibleQBI: this.state.eligibleQBI,
        selfFundedHealthAnnual: this.state.selfFundedHealthAnnual
      }
    );

    const { w2, contractor, verdict } = result;

    // Display labels
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setText("p-w2-salary-display", `$${Number(this.state.salary).toLocaleString()}`);
    setText("p-c-rate-display", `$${Number(this.state.hourlyRate).toLocaleString()}/hr`);

    // Hero Banner
    const banner = document.getElementById("p-hero-banner");
    const pill = document.getElementById("p-hero-pill");
    if (banner && pill) {
      banner.className = `rp-hero-verdict ${verdict.winner === "1099" ? "win-1099" : verdict.winner === "w2" ? "win-w2" : ""}`;
      pill.className = `rp-hero-pill ${verdict.winner === "1099" ? "pill-emerald" : verdict.winner === "w2" ? "pill-sky" : ""}`;
      pill.textContent = verdict.winnerTitle;
    }

    setText("p-hero-headline", verdict.headline);
    setText("p-hero-sub", verdict.winner === "1099"
      ? `After accounting for 15.3% Self-Employment Tax, the 20% QBI deduction, and self-funding your own health benefits, you keep +$${Math.abs(verdict.diffAnnual).toLocaleString()} more spendable money annually.`
      : `Corporate benefits and employer FICA matching make the W-2 offer more lucrative. To make the 1099 offer break even, bill at least $${verdict.breakevenHourlyRateCash.toFixed(2)}/hr.`
    );

    setText("p-stat-cash-breakeven", `$${verdict.breakevenHourlyRateCash.toFixed(2)}/hr`);
    setText("p-stat-comp-breakeven", `$${verdict.breakevenHourlyRateTotalComp.toFixed(2)}/hr`);
    setText("p-stat-rule-thumb", `$${verdict.equivalentRuleOfThumbHourly.toFixed(2)}/hr`);

    // W-2 Column
    setText("p-w2-net-monthly", `$${w2.cashFlow.monthlyTakeHomeCash.toLocaleString()} / mo`);
    setText("p-w2-net-annual", `$${w2.cashFlow.annualTakeHomeCash.toLocaleString()} / year in checking account`);
    setText("p-w2-row-fica", `-$${w2.taxes.totalFica.toLocaleString()}`);
    setText("p-w2-row-fed", `-$${w2.taxes.federalTax.toLocaleString()}`);
    setText("p-w2-row-state", `-$${w2.taxes.stateTax.toLocaleString()}`);
    setText("p-w2-row-benefits", `+$${w2.benefits.totalBenefitsValue.toLocaleString()}`);
    setText("p-w2-row-total-comp", `$${w2.cashFlow.totalCompensation.toLocaleString()}`);

    // 1099 Column
    setText("p-c-net-monthly", `$${contractor.cashFlow.monthlyNetSpendableCash.toLocaleString()} / mo`);
    setText("p-c-net-annual", `$${contractor.cashFlow.annualNetSpendableCash.toLocaleString()} / year in checking account`);
    setText("p-c-total-hrs", contractor.totalBillableHours.toLocaleString());
    setText("p-c-row-gross", `$${contractor.grossRevenue.toLocaleString()}`);
    setText("p-c-row-seca", `-$${contractor.taxes.totalSETax.toLocaleString()}`);
    setText("p-c-row-qbi", `-$${contractor.deductions.qbiDeduction.toLocaleString()} (Tax Shield)`);
    setText("p-c-row-fed", `-$${contractor.taxes.federalTax.toLocaleString()}`);
    setText("p-c-row-total-cash", `$${contractor.cashFlow.annualNetSpendableCash.toLocaleString()}`);

    this.lastResult = result;
  }

  copySummary() {
    if (!this.lastResult) return;
    const { w2, contractor, verdict } = this.lastResult;
    const text = `📊 RemoteParity Comparison:
• W-2 Salary: $${w2.grossSalary.toLocaleString()} -> Net Cash: $${w2.cashFlow.annualTakeHomeCash.toLocaleString()}/yr ($${w2.cashFlow.monthlyTakeHomeCash.toLocaleString()}/mo)
• 1099 Contractor: $${contractor.hourlyRate}/hr (${contractor.totalBillableHours} hrs) -> Net Cash: $${contractor.cashFlow.annualNetSpendableCash.toLocaleString()}/yr ($${contractor.cashFlow.monthlyNetSpendableCash.toLocaleString()}/mo)
• Verdict: ${verdict.winnerTitle} (Diff: $${verdict.diffMonthly.toLocaleString()}/mo)
• Breakeven 1099 Hourly Rate: $${verdict.breakevenHourlyRateCash.toFixed(2)}/hr
Calculated via RemoteParity (https://remoteparity.com) • @KNVK`;

    navigator.clipboard?.writeText(text).then(() => {
      const btn = document.getElementById("p-btn-copy-summary");
      if (btn) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span>Copied to Clipboard!</span>`;
        setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
      }
    });
  }
}
