/**
 * RemoteParity - View 5: Billable Hourly Rate Floor & Burn-Rate Solver View
 */

import { BillableRateEngine } from "../engines/billable-engine.js";

export class ViewBillable {
  constructor(mountEl) {
    this.mountEl = mountEl;
    this.state = {
      targetNetCash: 120000,
      annualExpenses: 8000,
      healthInsuranceAnnual: 7200,
      vacationWeeks: 4,
      sickHolidayWeeks: 1.5,
      nominalHoursPerWeek: 40,
      nonBillablePercent: 28,
      filingStatus: "single",
      stateTaxRatePercent: 5.0
    };
  }

  render() {
    this.mountEl.innerHTML = `
      <div class="rp-view-container">
        <!-- View Header -->
        <div class="rp-view-header">
          <h2 class="rp-view-title">Billable Hourly Rate Floor & Burn-Rate Solver</h2>
          <p class="rp-view-sub">Solve for the exact minimum billing rate needed to achieve your desired net take-home salary. Eliminates the dangerous naive formula by modeling non-billable client acquisition time, taxes, and expenses.</p>
        </div>

        <!-- Presets -->
        <div class="rp-presets">
          <span class="rp-preset-title">Target Net Cash:</span>
          <button class="rp-preset-btn" id="b-preset-80k" type="button">$80,000 Net Cash</button>
          <button class="rp-preset-btn" id="b-preset-120k" type="button">$120,000 Net Cash</button>
          <button class="rp-preset-btn" id="b-preset-180k" type="button">$180,000 Net Cash</button>
        </div>

        <!-- Hero Rate Floor Banner -->
        <div class="rp-hero-verdict win-1099" id="b-hero-banner">
          <div class="rp-hero-pill pill-emerald" id="b-hero-pill">True Rate Floor</div>
          <h3 class="rp-hero-headline" id="b-hero-headline">Loading solver...</h3>
          <p class="rp-hero-sub" id="b-hero-sub">Calculating realistic billable utilization, self-employment taxes, and business overhead...</p>

          <div class="rp-hero-metrics">
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Minimum Hourly Rate Floor</span>
              <span class="rp-hero-stat-val emerald" id="b-stat-optimal-rate">$0.00 / hr</span>
              <span class="rp-hero-stat-hint">Guarantees your target cash</span>
            </div>
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Naive 2,080hr Rate (DANGER)</span>
              <span class="rp-hero-stat-val" id="b-stat-naive-rate" style="color: var(--accent-rose);">$0.00 / hr</span>
              <span class="rp-hero-stat-hint">Causes massive income shortfall</span>
            </div>
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Annual Shortfall of Naive Rate</span>
              <span class="rp-hero-stat-val" id="b-stat-shortfall" style="color: var(--accent-rose);">-$0 / yr</span>
              <span class="rp-hero-stat-hint">Unfunded deficit</span>
            </div>
            <div class="rp-hero-stat-item" style="justify-content: flex-end;">
              <button class="rp-btn-action" id="b-btn-copy-summary" type="button" aria-label="Copy Rate Floor Summary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>Copy Summary</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 2-Column Inputs & Economics -->
        <div class="rp-grid-2">
          
          <!-- Column 1: Financial Targets & Expenses -->
          <div class="rp-card">
            <div class="rp-card-header">
              <div class="rp-card-title-group">
                <span class="rp-card-icon">🎯</span>
                <div>
                  <h3 class="rp-card-title">Income & Overhead Targets</h3>
                  <span class="rp-hint">Define your personal take-home goals</span>
                </div>
              </div>
              <span class="rp-card-badge">Financials</span>
            </div>

            <!-- Target Net Spendable Cash -->
            <div class="rp-form-group">
              <div class="rp-label-row">
                <label class="rp-label" for="b-net-num">Target Annual Net Spendable Cash</label>
                <span class="rp-hint" id="b-net-display">$120,000</span>
              </div>
              <div class="rp-input-wrapper">
                <span class="rp-input-prefix">$</span>
                <input class="rp-input" id="b-net-num" type="number" step="5000" min="30000" max="500000" value="${this.state.targetNetCash}" aria-label="Target Annual Net Cash" />
              </div>
              <input class="rp-slider" id="b-net-slider" type="range" min="40000" max="300000" step="5000" value="${this.state.targetNetCash}" aria-label="Target Net Cash Slider" />
            </div>

            <!-- Expenses & Health -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="rp-form-group">
                <label class="rp-label" for="b-expenses">Business Expenses ($/yr)</label>
                <input class="rp-input no-prefix" id="b-expenses" type="number" step="500" min="0" max="50000" value="${this.state.annualExpenses}" aria-label="Annual Business Expenses" />
              </div>
              <div class="rp-form-group">
                <label class="rp-label" for="b-health">Health Insurance ($/yr)</label>
                <input class="rp-input no-prefix" id="b-health" type="number" step="500" min="0" max="30000" value="${this.state.healthInsuranceAnnual}" aria-label="Annual Health Insurance Premium" />
              </div>
            </div>

            <!-- Tax Profile -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="rp-form-group">
                <label class="rp-label" for="b-filing">Tax Filing Status</label>
                <select class="rp-select" id="b-filing" aria-label="Tax Filing Status">
                  <option value="single" selected>Single Filer</option>
                  <option value="mfj">Married Jointly</option>
                </select>
              </div>
              <div class="rp-form-group">
                <label class="rp-label" for="b-state-tax">State Tax Rate (%)</label>
                <select class="rp-select" id="b-state-tax" aria-label="State Tax Profile">
                  <option value="0">0% (TX, WA, FL)</option>
                  <option value="5.0" selected>5.0% (Average US)</option>
                  <option value="9.3">9.3% (California)</option>
                </select>
              </div>
            </div>

          </div>

          <!-- Column 2: Working Time & Utilization Reality -->
          <div class="rp-card">
            <div class="rp-card-header">
              <div class="rp-card-title-group">
                <span class="rp-card-icon">⏱️</span>
                <div>
                  <h3 class="rp-card-title">Time Allocation & Reality Check</h3>
                  <span class="rp-hint">Real working weeks vs. non-billable overhead</span>
                </div>
              </div>
              <span class="rp-card-badge" style="background: var(--accent-apple-blue-bg); color: var(--accent-apple-blue); border-color: rgba(0, 113, 227, 0.25);">Schedule</span>
            </div>

            <!-- Weeks Off -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="rp-form-group">
                <label class="rp-label" for="b-vacation">Vacation Weeks / Yr</label>
                <input class="rp-input no-prefix" id="b-vacation" type="number" step="0.5" min="0" max="12" value="${this.state.vacationWeeks}" aria-label="Annual Vacation Weeks" />
              </div>
              <div class="rp-form-group">
                <label class="rp-label" for="b-sick">Holidays & Sick Weeks</label>
                <input class="rp-input no-prefix" id="b-sick" type="number" step="0.5" min="0" max="8" value="${this.state.sickHolidayWeeks}" aria-label="Annual Holidays and Sick Weeks" />
              </div>
            </div>

            <!-- Non-Billable Overhead Buffer Slider -->
            <div class="rp-form-group">
              <div class="rp-label-row">
                <label class="rp-label" for="b-nonbillable-slider">Non-Billable Admin & Sales Buffer</label>
                <span class="rp-hint" id="b-nonbillable-display">28% (11.2 hrs/wk)</span>
              </div>
              <input class="rp-slider" id="b-nonbillable-slider" type="range" min="10" max="50" step="1" value="${this.state.nonBillablePercent}" aria-label="Non-Billable Administrative Buffer Slider" />
              <span class="rp-hint">Time spent writing proposals, invoicing, bookkeeping, client acquisition, and admin.</span>
            </div>

            <!-- Itemized Reality Rows -->
            <div class="rp-rows">
              <div class="rp-row">
                <span>Working Weeks in Year (52 - Time Off)</span>
                <span class="rp-row-val" id="b-row-working-weeks">46.5 weeks</span>
              </div>
              <div class="rp-row">
                <span>Actual Billable Hours / Week</span>
                <span class="rp-row-val" id="b-row-billable-weekly">28.8 hrs / wk</span>
              </div>
              <div class="rp-row">
                <span>Total Annual Billable Hours</span>
                <span class="rp-row-val sky" id="b-row-total-billable-annual">1,339 hours</span>
              </div>
              <div class="rp-row">
                <span>Required Gross Invoicing Revenue</span>
                <span class="rp-row-val rp-pos" id="b-row-gross-needed">$0 / yr</span>
              </div>
              <div class="rp-row total-row">
                <span>Net Cash In Checking Account</span>
                <span class="rp-row-val emerald" id="b-row-net-realized">$0 / yr</span>
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
    const netNum = document.getElementById("b-net-num");
    const netSlider = document.getElementById("b-net-slider");
    if (netNum && netSlider) {
      netNum.addEventListener("input", () => {
        this.state.targetNetCash = Number(netNum.value);
        netSlider.value = netNum.value;
        this.recalculate();
      });
      netSlider.addEventListener("input", () => {
        this.state.targetNetCash = Number(netSlider.value);
        netNum.value = netSlider.value;
        this.recalculate();
      });
    }

    const nonBillSlider = document.getElementById("b-nonbillable-slider");
    if (nonBillSlider) {
      nonBillSlider.addEventListener("input", () => {
        this.state.nonBillablePercent = Number(nonBillSlider.value);
        this.recalculate();
      });
    }

    const bindInput = (id, key) => {
      document.getElementById(id)?.addEventListener("input", (e) => {
        this.state[key] = e.target.type === "number" ? Number(e.target.value) : e.target.value;
        this.recalculate();
      });
    };

    bindInput("b-expenses", "annualExpenses");
    bindInput("b-health", "healthInsuranceAnnual");
    bindInput("b-vacation", "vacationWeeks");
    bindInput("b-sick", "sickHolidayWeeks");
    bindInput("b-filing", "filingStatus");
    bindInput("b-state-tax", "stateTaxRatePercent");

    // Presets
    document.getElementById("b-preset-80k")?.addEventListener("click", () => {
      this.setPreset(80000);
    });
    document.getElementById("b-preset-120k")?.addEventListener("click", () => {
      this.setPreset(120000);
    });
    document.getElementById("b-preset-180k")?.addEventListener("click", () => {
      this.setPreset(180000);
    });

    // Copy Summary
    document.getElementById("b-btn-copy-summary")?.addEventListener("click", () => {
      this.copySummary();
    });
  }

  setPreset(target) {
    this.state.targetNetCash = target;
    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = v;
    };
    setVal("b-net-num", target);
    setVal("b-net-slider", target);
    this.recalculate();
  }

  recalculate() {
    const result = BillableRateEngine.calculate({
      targetNetCash: this.state.targetNetCash,
      annualExpenses: this.state.annualExpenses,
      healthInsuranceAnnual: this.state.healthInsuranceAnnual,
      vacationWeeks: this.state.vacationWeeks,
      sickHolidayWeeks: this.state.sickHolidayWeeks,
      nominalHoursPerWeek: this.state.nominalHoursPerWeek,
      nonBillablePercent: this.state.nonBillablePercent,
      filingStatus: this.state.filingStatus,
      stateTaxRatePercent: this.state.stateTaxRatePercent
    });

    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setText("b-net-display", `$${this.state.targetNetCash.toLocaleString()}`);
    setText("b-nonbillable-display", `${this.state.nonBillablePercent}% (${result.timeAllocation.nonBillableHoursPerWeek} hrs/wk)`);

    setText("b-hero-headline", result.headline);
    setText("b-hero-sub", `Billing only the naive rate of $${result.naiveRate.toFixed(2)}/hr produces an unfunded shortfall of -$${result.naiveShortfall.toLocaleString()}/year because it ignores ${result.timeAllocation.weeksOff} weeks off, ${this.state.nonBillablePercent}% admin time, and the 15.3% SECA tax.`);

    setText("b-stat-optimal-rate", `$${result.optimalHourlyRate.toFixed(2)} / hr`);
    setText("b-stat-naive-rate", `$${result.naiveRate.toFixed(2)} / hr`);
    setText("b-stat-shortfall", `-$${result.naiveShortfall.toLocaleString()} / yr`);

    setText("b-row-working-weeks", `${result.timeAllocation.workingWeeks} weeks`);
    setText("b-row-billable-weekly", `${result.timeAllocation.billableHoursPerWeek} hrs / wk`);
    setText("b-row-total-billable-annual", `${result.timeAllocation.annualBillableHours.toLocaleString()} hours`);
    setText("b-row-gross-needed", `$${result.economics.requiredGrossBilling.toLocaleString()} / yr`);
    setText("b-row-net-realized", `$${result.economics.actualNetSpendableCash.toLocaleString()} / yr`);

    this.lastResult = result;
  }

  copySummary() {
    if (!this.lastResult) return;
    const r = this.lastResult;
    const text = `⏱️ RemoteParity Billable Hourly Rate Floor:
• Target Net Spendable Cash: $${r.targetNetCash.toLocaleString()}
• Working Weeks: ${r.timeAllocation.workingWeeks} weeks (${r.timeAllocation.weeksOff} weeks vacation & holidays)
• Billable Hours / Week: ${r.timeAllocation.billableHoursPerWeek} hrs (after ${r.timeAllocation.nonBillablePercent}% admin overhead)
• Total Annual Billable Hours: ${r.timeAllocation.annualBillableHours} hours
• Gross Invoicing Required: $${r.economics.requiredGrossBilling.toLocaleString()}/year
• TRUE MINIMUM HOURLY RATE FLOOR: $${r.optimalHourlyRate.toFixed(2)}/hr!
• (Warning: The naive 2,080hr rate of $${r.naiveRate.toFixed(2)}/hr produces an annual deficit of -$${r.naiveShortfall.toLocaleString()})
Calculated via RemoteParity (https://remoteparity.com) • @KNVK`;

    navigator.clipboard?.writeText(text).then(() => {
      const btn = document.getElementById("b-btn-copy-summary");
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = `<span>Copied to Clipboard!</span>`;
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      }
    });
  }
}
