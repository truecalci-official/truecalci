/**
 * RemoteParity - View 3: Solo 401(k) vs. SEP-IRA Tax Shield Simulator
 */

import { RetirementEngine } from "../engines/retirement-engine.js";

export class ViewRetirement {
  constructor(mountEl) {
    this.mountEl = mountEl;
    this.state = {
      netEarnings: 120000,
      entityType: "llc",
      isAge50Plus: false,
      marginalTaxRatePercent: 29
    };
  }

  render() {
    this.mountEl.innerHTML = `
      <div class="rp-view-container">
        <!-- View Header -->
        <div class="rp-view-header">
          <h2 class="rp-view-title">Solo 401(k) vs. SEP-IRA Tax Shield Simulator</h2>
          <p class="rp-view-sub">Compare maximum legal tax-deferred retirement deductions under 2024/2025 IRS limits (IRS Notice 2023-75). Maximize pre-tax contributions to shield tens of thousands from income tax.</p>
        </div>

        <!-- Presets -->
        <div class="rp-presets">
          <span class="rp-preset-title">Earning Tiers:</span>
          <button class="rp-preset-btn" id="ret-preset-80k" type="button">$80,000 Earnings</button>
          <button class="rp-preset-btn" id="ret-preset-120k" type="button">$120,000 Earnings</button>
          <button class="rp-preset-btn" id="ret-preset-200k" type="button">$200,000 Earnings</button>
        </div>

        <!-- Hero Banner -->
        <div class="rp-hero-verdict win-1099" id="ret-hero-banner">
          <div class="rp-hero-pill pill-emerald" id="ret-hero-pill">Solo 401(k) Advantage</div>
          <h3 class="rp-hero-headline" id="ret-hero-headline">Loading simulation...</h3>
          <p class="rp-hero-sub" id="ret-hero-sub">Calculating employee elective deferral and employer profit-sharing limits...</p>

          <div class="rp-hero-metrics">
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Solo 401(k) Max Deduction</span>
              <span class="rp-hero-stat-val emerald" id="ret-stat-solo-max">$0</span>
              <span class="rp-hero-stat-hint">Employee + Employer combined</span>
            </div>
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">SEP-IRA Max Deduction</span>
              <span class="rp-hero-stat-val" id="ret-stat-sep-max">$0</span>
              <span class="rp-hero-stat-hint">Employer profit-sharing only</span>
            </div>
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Extra Tax Cash Saved</span>
              <span class="rp-hero-stat-val sky" id="ret-stat-cash-saved">+$0</span>
              <span class="rp-hero-stat-hint">Immediate tax deduction benefit</span>
            </div>
            <div class="rp-hero-stat-item" style="justify-content: flex-end;">
              <button class="rp-btn-action" id="ret-btn-copy-summary" type="button" aria-label="Copy Retirement Summary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>Copy Summary</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 2-Column Inputs & Features -->
        <div class="rp-grid-2">
          
          <!-- Column 1: Financial Inputs -->
          <div class="rp-card">
            <div class="rp-card-header">
              <div class="rp-card-title-group">
                <span class="rp-card-icon">🛡️</span>
                <div>
                  <h3 class="rp-card-title">Retirement Profile Inputs</h3>
                  <span class="rp-hint">Adjust net compensation and tax bracket</span>
                </div>
              </div>
              <span class="rp-card-badge">Inputs</span>
            </div>

            <!-- Net Earnings -->
            <div class="rp-form-group">
              <div class="rp-label-row">
                <label class="rp-label" for="ret-earnings-num">Net Self-Employed Earnings / W-2 Salary</label>
                <span class="rp-hint" id="ret-earnings-display">$120,000</span>
              </div>
              <div class="rp-input-wrapper">
                <span class="rp-input-prefix">$</span>
                <input class="rp-input" id="ret-earnings-num" type="number" step="5000" min="20000" max="800000" value="${this.state.netEarnings}" aria-label="Net Self-Employed Earnings Amount" />
              </div>
              <input class="rp-slider" id="ret-earnings-slider" type="range" min="30000" max="400000" step="5000" value="${this.state.netEarnings}" aria-label="Net Earnings Slider" />
            </div>

            <!-- Entity Type & Age -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="rp-form-group">
                <label class="rp-label" for="ret-entity">Business Entity</label>
                <select class="rp-select" id="ret-entity" aria-label="Business Entity Type">
                  <option value="llc" selected>Sole Prop / LLC</option>
                  <option value="scorp">S-Corporation W-2</option>
                </select>
              </div>
              <div class="rp-form-group">
                <label class="rp-label" for="ret-age">Age Bracket</label>
                <select class="rp-select" id="ret-age" aria-label="Age Bracket">
                  <option value="under50" selected>Under Age 50 ($23k Deferral)</option>
                  <option value="50plus">Age 50+ ($30.5k Catch-Up)</option>
                </select>
              </div>
            </div>

            <!-- Marginal Tax Rate -->
            <div class="rp-form-group">
              <div class="rp-label-row">
                <label class="rp-label" for="ret-tax-rate">Combined Marginal Tax Rate (Fed + State)</label>
                <span class="rp-hint" id="ret-tax-rate-display">29% (24% Fed + 5% State)</span>
              </div>
              <input class="rp-slider" id="ret-tax-rate-slider" type="range" min="15" max="50" step="1" value="${this.state.marginalTaxRatePercent}" aria-label="Marginal Tax Rate Slider" />
            </div>

            <div class="rp-rows">
              <div class="rp-row">
                <span>Calculated Plan Compensation Base</span>
                <span class="rp-row-val" id="ret-row-plan-comp">$0</span>
              </div>
              <div class="rp-row">
                <span>2024 Total Statutory Contribution Cap</span>
                <span class="rp-row-val" id="ret-row-cap">$69,000</span>
              </div>
            </div>

          </div>

          <!-- Column 2: Side-by-Side Plan Showdown -->
          <div class="rp-card">
            <div class="rp-card-header">
              <div class="rp-card-title-group">
                <span class="rp-card-icon">⚖️</span>
                <div>
                  <h3 class="rp-card-title">Side-by-Side Plan Showdown</h3>
                  <span class="rp-hint">Solo 401(k) vs. Traditional SEP-IRA</span>
                </div>
              </div>
              <span class="rp-card-badge" style="background: var(--accent-emerald-bg); color: var(--accent-emerald); border-color: rgba(5, 150, 105, 0.25);">Comparison</span>
            </div>

            <div class="rp-table-wrap">
              <table class="rp-table" aria-label="Solo 401k vs SEP-IRA comparison table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Solo 401(k)</th>
                    <th>SEP-IRA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="optimal-row">
                    <td><strong>Max Tax Deduction</strong></td>
                    <td id="ret-td-solo-max" style="color: var(--accent-emerald); font-weight:800;">$0</td>
                    <td id="ret-td-sep-max" style="color: var(--text-body);">$0</td>
                  </tr>
                  <tr>
                    <td><strong>Immediate Tax Relief</strong></td>
                    <td id="ret-td-solo-relief" style="color: var(--accent-emerald); font-weight:700;">$0</td>
                    <td id="ret-td-sep-relief">$0</td>
                  </tr>
                  <tr>
                    <td>Employee Elective Deferral</td>
                    <td style="color: var(--accent-emerald);">✅ Up to $23,000</td>
                    <td style="color: var(--accent-rose);">❌ Not Allowed (0%)</td>
                  </tr>
                  <tr>
                    <td>Age 50+ Catch-Up ($7.5k)</td>
                    <td style="color: var(--accent-emerald);">✅ Allowed</td>
                    <td style="color: var(--accent-rose);">❌ No Catch-Up</td>
                  </tr>
                  <tr>
                    <td>Roth Contribution Option</td>
                    <td style="color: var(--accent-emerald);">✅ Yes (Tax-Free Growth)</td>
                    <td style="color: var(--accent-rose);">❌ Traditional Only</td>
                  </tr>
                  <tr>
                    <td>Participant Loan Feature</td>
                    <td style="color: var(--accent-emerald);" id="ret-td-loan">✅ Up to $50,000</td>
                    <td style="color: var(--accent-rose);">❌ Prohibited</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </div>
    `;

    this.bindEvents();
    this.recalculate();
  }

  bindEvents() {
    const earnNum = document.getElementById("ret-earnings-num");
    const earnSlider = document.getElementById("ret-earnings-slider");
    if (earnNum && earnSlider) {
      earnNum.addEventListener("input", () => {
        this.state.netEarnings = Number(earnNum.value);
        earnSlider.value = earnNum.value;
        this.recalculate();
      });
      earnSlider.addEventListener("input", () => {
        this.state.netEarnings = Number(earnSlider.value);
        earnNum.value = earnSlider.value;
        this.recalculate();
      });
    }

    const taxSlider = document.getElementById("ret-tax-rate-slider");
    if (taxSlider) {
      taxSlider.addEventListener("input", () => {
        this.state.marginalTaxRatePercent = Number(taxSlider.value);
        this.recalculate();
      });
    }

    document.getElementById("ret-entity")?.addEventListener("change", (e) => {
      this.state.entityType = e.target.value;
      this.recalculate();
    });

    document.getElementById("ret-age")?.addEventListener("change", (e) => {
      this.state.isAge50Plus = e.target.value === "50plus";
      this.recalculate();
    });

    // Presets
    document.getElementById("ret-preset-80k")?.addEventListener("click", () => {
      this.setPreset(80000);
    });
    document.getElementById("ret-preset-120k")?.addEventListener("click", () => {
      this.setPreset(120000);
    });
    document.getElementById("ret-preset-200k")?.addEventListener("click", () => {
      this.setPreset(200000);
    });

    // Copy Summary
    document.getElementById("ret-btn-copy-summary")?.addEventListener("click", () => {
      this.copySummary();
    });
  }

  setPreset(earnings) {
    this.state.netEarnings = earnings;
    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = v;
    };
    setVal("ret-earnings-num", earnings);
    setVal("ret-earnings-slider", earnings);
    this.recalculate();
  }

  recalculate() {
    const result = RetirementEngine.calculate({
      netEarnings: this.state.netEarnings,
      entityType: this.state.entityType,
      isAge50Plus: this.state.isAge50Plus,
      marginalTaxRatePercent: this.state.marginalTaxRatePercent
    });

    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setText("ret-earnings-display", `$${this.state.netEarnings.toLocaleString()}`);
    setText("ret-tax-rate-display", `${this.state.marginalTaxRatePercent}% Marginal Tax Bracket`);

    setText("ret-hero-headline", result.comparison.headline);
    setText("ret-hero-sub", `Because a Solo 401(k) allows you to contribute as both the employee ($${result.solo401k.employeeDeferral.toLocaleString()}) and the employer ($${result.solo401k.employerProfitShare.toLocaleString()}), you can shield much more of your income compared to an employer-only SEP-IRA.`);

    setText("ret-stat-solo-max", `$${result.solo401k.maxContribution.toLocaleString()}`);
    setText("ret-stat-sep-max", `$${result.sepIra.maxContribution.toLocaleString()}`);
    setText("ret-stat-cash-saved", `+$${result.comparison.extraTaxCashSaved.toLocaleString()}`);

    setText("ret-row-plan-comp", `$${result.planCompensation.toLocaleString()}`);
    setText("ret-row-cap", `$${(this.state.isAge50Plus ? 76500 : 69000).toLocaleString()}`);

    setText("ret-td-solo-max", `$${result.solo401k.maxContribution.toLocaleString()}`);
    setText("ret-td-sep-max", `$${result.sepIra.maxContribution.toLocaleString()}`);
    setText("ret-td-solo-relief", `$${result.solo401k.immediateTaxSavings.toLocaleString()}`);
    setText("ret-td-sep-relief", `$${result.sepIra.immediateTaxSavings.toLocaleString()}`);
    setText("ret-td-loan", `✅ Up to $${result.solo401k.loanLimit.toLocaleString()}`);

    this.lastResult = result;
  }

  copySummary() {
    if (!this.lastResult) return;
    const r = this.lastResult;
    const text = `🛡️ RemoteParity Retirement Shield:
• Net Compensation: $${r.netEarnings.toLocaleString()} (${r.entityType})
• Solo 401(k) Maximum Deduction: $${r.solo401k.maxContribution.toLocaleString()} (Tax Relief: $${r.solo401k.immediateTaxSavings.toLocaleString()})
• SEP-IRA Maximum Deduction: $${r.sepIra.maxContribution.toLocaleString()} (Tax Relief: $${r.sepIra.immediateTaxSavings.toLocaleString()})
• Solo 401(k) Extra Tax Shelter: +$${r.comparison.extraShelter.toLocaleString()}
• EXTRA CASH SAVED IN YOUR CHECKING ACCOUNT: +$${r.comparison.extraTaxCashSaved.toLocaleString()}
Calculated via RemoteParity (https://remoteparity.com) • @KNVK`;

    navigator.clipboard?.writeText(text).then(() => {
      const btn = document.getElementById("ret-btn-copy-summary");
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = `<span>Copied to Clipboard!</span>`;
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      }
    });
  }
}
