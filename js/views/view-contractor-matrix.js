/**
 * TrueCalci Remote Contractor Take-Home Matrix View
 * High-Performance Dual-Column 1099 vs. W-2 Parity Simulator
 * Meets Google PageSpeed 100/100, WCAG 2.1 AA Accessibility, Zero-CLS & AEO Standards.
 */

import { ContractorMatrixEngine } from "../engines/contractor-matrix.js";

export class ViewContractorMatrix {
  constructor(containerEl, openKnowledgeCallback) {
    this.containerEl = containerEl;
    this.openKnowledgeCallback = openKnowledgeCallback;

    // Default Offer State: $130k W-2 vs. $85/hr 1099
    this.state = {
      // W-2 Parameters
      w2Salary: 130000,
      w2FilingStatus: "single",
      w2StateTaxRate: 5.0,
      w2HealthSubsidy: 7200,
      w2Match401k: 4.0,
      w2PtoDays: 25,
      w2Employee401k: 0,

      // 1099 Parameters
      cHourlyRate: 85,
      cHoursPerWeek: 40,
      cWeeksPerYear: 48,
      cAnnualExpenses: 6000,
      cFilingStatus: "single",
      cStateTaxRate: 5.0,
      cEligibleQBI: true,
      cIsSSTB: true,
      cHealthCost: 7200,
      cSolo401k: 0,

      // FX Drag Parameters
      fxTargetCurrency: "EUR",
      fxSelectedRail: "wise",
      showFxSection: false
    };

    this.debounceTimer = null;
  }

  setRegion(region) {
    if (region === "india") {
      this.state.fxTargetCurrency = "INR";
      this.state.showFxSection = true;
    } else if (region === "europe") {
      this.state.fxTargetCurrency = "EUR";
    } else {
      this.state.fxTargetCurrency = "EUR";
    }
    this.render();
  }

  format(val, decimals = 0) {
    return ContractorMatrixEngine.formatCurrency(val, "$", decimals);
  }

  render() {
    if (!this.containerEl) return;

    this.containerEl.innerHTML = `
      <div class="contractor-matrix-layout" id="contractor-matrix-root">
        
        <!-- Preset Profiles Pill Bar -->
        <div class="cm-preset-bar" aria-label="Quick Scenario Presets">
          <span class="cm-preset-label">Quick Scenarios:</span>
          <div class="filter-pills-bar">
            <button type="button" class="pill-btn cm-preset-btn" data-preset="junior" aria-label="Junior Developer Preset: $90k W-2 versus $60 per hour 1099">
              Junior Dev ($90k vs $60/hr)
            </button>
            <button type="button" class="pill-btn cm-preset-btn active" data-preset="senior" aria-label="Senior Staff SWE Preset: $140k W-2 versus $95 per hour 1099">
              Senior SWE ($140k vs $95/hr)
            </button>
            <button type="button" class="pill-btn cm-preset-btn" data-preset="lead" aria-label="Principal or Tech Lead Preset: $200k W-2 versus $145 per hour 1099">
              Tech Lead ($200k vs $145/hr)
            </button>
            <button type="button" class="pill-btn cm-preset-btn" data-preset="crossborder" aria-label="Cross Border Remote Contractor Preset: Wise versus Deel">
              Cross-Border Remote (USD → Local)
            </button>
          </div>
        </div>

        <!-- Hero Parity Verdict Card -->
        <div class="cm-verdict-hero" id="cm-verdict-card" aria-live="polite">
          <div class="cm-verdict-badge-wrap">
            <span class="cm-verdict-pill" id="cm-verdict-pill">1099 Contractor Offer Wins</span>
            <span class="cm-verdict-tag" id="cm-verdict-tag">+12.4% More Cash</span>
          </div>
          <div class="cm-verdict-headline" id="cm-verdict-headline">
            The 1099 offer yields <strong>+$1,140/mo</strong> more spendable cash in your pocket!
          </div>
          <div class="cm-verdict-subtext" id="cm-verdict-subtext">
            Comparing after federal & state taxes, 15.3% SECA, 20% Section 199A QBI deduction, and self-funded health insurance.
          </div>

          <!-- Breakeven Solver Callout Banner -->
          <div class="cm-breakeven-banner">
            <div class="cm-breakeven-item">
              <span class="cm-breakeven-label">Exact Breakeven 1099 Rate (Cash Parity)</span>
              <span class="cm-breakeven-val" id="cm-breakeven-cash">$78.42 / hr</span>
              <span class="cm-breakeven-hint">Matches W-2 net spendable bank cash exactly</span>
            </div>
            <div class="cm-breakeven-divider"></div>
            <div class="cm-breakeven-item">
              <span class="cm-breakeven-label">Total Compensation Breakeven Rate</span>
              <span class="cm-breakeven-val" id="cm-breakeven-totalcomp">$89.15 / hr</span>
              <span class="cm-breakeven-hint">Matches cash + health subsidy + 401(k) match</span>
            </div>
            <div class="cm-breakeven-actions">
              <button type="button" class="cm-copy-btn" id="cm-copy-summary-btn" aria-label="Copy comparison summary to clipboard">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>Share Breakdown</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Dual Column Side-by-Side Comparison Grid -->
        <div class="cm-dual-grid">
          
          <!-- LEFT CARD: W-2 Salaried Role -->
          <div class="fin-card cm-card cm-card-w2">
            <div class="fin-card-header">
              <div class="cm-card-title-group">
                <span class="cm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span>
                <div>
                  <h3 class="fin-card-title">Option A: W-2 Salaried Offer</h3>
                  <span class="cm-card-sub">Corporate employment with benefits & employer FICA match</span>
                </div>
              </div>
              <span class="fin-badge fin-badge-blue">W-2 Form</span>
            </div>

            <!-- Inputs -->
            <div class="fin-form-group">
              <label class="fin-label" for="w2-salary-num">
                <span>Annual Base Salary</span>
                <span class="fin-input-badge">$ USD</span>
              </label>
              <input type="number" id="w2-salary-num" class="fin-input" value="130000" step="2500" min="20000" max="1000000" aria-label="W-2 Annual Base Salary Amount">
              <input type="range" id="w2-salary-slider" class="fin-slider" value="130000" min="40000" max="350000" step="2500" aria-label="W-2 Annual Base Salary Slider">
            </div>

            <div class="fin-grid-2">
              <div class="fin-form-group">
                <label class="fin-label" for="w2-filing-select">Filing Status</label>
                <select id="w2-filing-select" class="fin-select" aria-label="W-2 Tax Filing Status">
                  <option value="single" selected>Single Filer ($14.6k Std)</option>
                  <option value="mfj">Married Joint ($29.2k Std)</option>
                </select>
              </div>
              <div class="fin-form-group">
                <label class="fin-label" for="w2-state-select">State Tax Profile</label>
                <select id="w2-state-select" class="fin-select" aria-label="W-2 State Tax Profile">
                  <option value="0">0% (TX, FL, WA, NV, TN)</option>
                  <option value="3.0">3.0% (Low State Tax)</option>
                  <option value="5.0" selected>5.0% (US National Avg)</option>
                  <option value="6.85">6.85% (New York NY)</option>
                  <option value="9.3">9.30% (California CA)</option>
                </select>
              </div>
            </div>

            <div class="fin-grid-2">
              <div class="fin-form-group">
                <label class="fin-label" for="w2-health-num">
                  <span>Employer Health Subsidy</span>
                  <span class="fin-input-badge">$/yr</span>
                </label>
                <input type="number" id="w2-health-num" class="fin-input" value="7200" step="500" min="0" aria-label="W-2 Employer Health Insurance Subsidy Value">
              </div>
              <div class="fin-form-group">
                <label class="fin-label" for="w2-401k-num">
                  <span>401(k) Employer Match (%)</span>
                  <span id="w2-401k-display" class="fin-val-highlight">4%</span>
                </label>
                <input type="number" id="w2-401k-num" class="fin-input" value="4" step="0.5" min="0" max="15" aria-label="W-2 Employer 401(k) Match Percentage">
              </div>
            </div>

            <div class="fin-form-group">
              <label class="fin-label" for="w2-pto-num">
                <span>Paid Time Off (PTO Days)</span>
                <span id="w2-pto-display" class="fin-val-highlight">25 Days (200 hrs)</span>
              </label>
              <input type="range" id="w2-pto-num" class="fin-slider" value="25" min="0" max="45" step="1" aria-label="W-2 Paid Time Off Days Slider">
            </div>

            <!-- Output Metric Highlight -->
            <div class="cm-highlight-box cm-highlight-w2">
              <span class="cm-metric-subtitle">Net Take-Home Spendable Cash</span>
              <div class="cm-metric-huge" id="w2-net-monthly">$7,685 / mo</div>
              <span class="cm-metric-annual" id="w2-net-annual">$92,220 / year</span>
            </div>

            <!-- Breakdown Accordion/Grid -->
            <div class="cm-metrics-breakdown">
              <div class="cm-breakdown-row">
                <span>Employee FICA (6.2% SS + 1.45% Med)</span>
                <span class="cm-breakdown-val cm-neg" id="w2-fica-val">-$9,945</span>
              </div>
              <div class="cm-breakdown-row">
                <span>Federal Income Tax</span>
                <span class="cm-breakdown-val cm-neg" id="w2-fed-tax-val">-$18,340</span>
              </div>
              <div class="cm-breakdown-row">
                <span>State Income Tax</span>
                <span class="cm-breakdown-val cm-neg" id="w2-state-tax-val">-$5,770</span>
              </div>
              <div class="cm-breakdown-row cm-row-total">
                <span>Total Tax Drag (Effective <span id="w2-eff-tax-rate">26.2%</span>)</span>
                <span class="cm-breakdown-val cm-neg" id="w2-total-tax-val">-$34,055</span>
              </div>
              <div class="cm-breakdown-row cm-row-benefit">
                <span>Employer Benefits & Match Value</span>
                <span class="cm-breakdown-val cm-pos" id="w2-benefits-val">+$12,400</span>
              </div>
              <div class="cm-breakdown-row cm-row-highlight">
                <span>Real Worked Hourly Rate</span>
                <span class="cm-breakdown-val" id="w2-worked-rate-val">$49.05 / hr</span>
              </div>
            </div>

          </div>

          <!-- RIGHT CARD: 1099 / B2B Contractor Role -->
          <div class="fin-card cm-card cm-card-1099">
            <div class="fin-card-header">
              <div class="cm-card-title-group">
                <span class="cm-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
                <div>
                  <h3 class="fin-card-title">Option B: 1099 / Pass-Through LLC</h3>
                  <span class="cm-card-sub">Independent contractor, pass-through deductions & write-offs</span>
                </div>
              </div>
              <span class="fin-badge fin-badge-green">1099-NEC</span>
            </div>

            <!-- Inputs -->
            <div class="fin-form-group">
              <label class="fin-label" for="c-rate-num">
                <span>Billing Rate ($/hr)</span>
                <span class="fin-input-badge">USD / Hour</span>
              </label>
              <input type="number" id="c-rate-num" class="fin-input" value="85" step="5" min="10" max="600" aria-label="1099 Hourly Billing Rate">
              <input type="range" id="c-rate-slider" class="fin-slider" value="85" min="20" max="250" step="1" aria-label="1099 Hourly Billing Rate Slider">
            </div>

            <div class="fin-grid-2">
              <div class="fin-form-group">
                <label class="fin-label" for="c-hours-num">
                  <span>Billable Hours / Wk</span>
                  <span id="c-hours-display" class="fin-val-highlight">40 hrs</span>
                </label>
                <input type="number" id="c-hours-num" class="fin-input" value="40" step="1" min="10" max="70" aria-label="1099 Billable Hours Per Week">
              </div>
              <div class="fin-form-group">
                <label class="fin-label" for="c-weeks-num">
                  <span>Billable Weeks / Yr</span>
                  <span id="c-weeks-display" class="fin-val-highlight">48 weeks</span>
                </label>
                <input type="number" id="c-weeks-num" class="fin-input" value="48" step="1" min="20" max="52" aria-label="1099 Billable Weeks Per Year">
              </div>
            </div>

            <div class="fin-grid-2">
              <div class="fin-form-group">
                <label class="fin-label" for="c-expenses-num">
                  <span>Deductible Expenses</span>
                  <span class="fin-input-badge">$/yr</span>
                </label>
                <input type="number" id="c-expenses-num" class="fin-input" value="6000" step="500" min="0" aria-label="1099 Annual Deductible Business Expenses">
              </div>
              <div class="fin-form-group">
                <label class="fin-label" for="c-health-num">
                  <span>Self-Funded Health Ins.</span>
                  <span class="fin-input-badge">$/yr</span>
                </label>
                <input type="number" id="c-health-num" class="fin-input" value="7200" step="500" min="0" aria-label="1099 Self-Funded Health Insurance Premium">
              </div>
            </div>

            <!-- Tax Toggles: QBI 20% & SSTB -->
            <div class="cm-toggle-bar">
              <label class="cm-checkbox-label" for="c-qbi-toggle">
                <input type="checkbox" id="c-qbi-toggle" checked aria-label="Eligible for Section 199A QBI 20 percent Pass-Through Deduction">
                <span>Section 199A QBI 20% Tax Deduction</span>
              </label>
              <span class="sidebar-tag" style="background:var(--accent-light); color:var(--accent-primary);" title="Section 199A provides up to 20% federal tax deduction on net business profit.">IRC §199A</span>
            </div>

            <!-- Output Metric Highlight -->
            <div class="cm-highlight-box cm-highlight-1099">
              <span class="cm-metric-subtitle">Net Take-Home Spendable Cash</span>
              <div class="cm-metric-huge" id="c-net-monthly">$8,610 / mo</div>
              <span class="cm-metric-annual" id="c-net-annual">$103,320 / year</span>
            </div>

            <!-- Breakdown Accordion/Grid -->
            <div class="cm-metrics-breakdown">
              <div class="cm-breakdown-row">
                <span>Gross Revenue (<span id="c-gross-hours">1,920 hrs</span>)</span>
                <span class="cm-breakdown-val cm-pos" id="c-gross-rev-val">+$163,200</span>
              </div>
              <div class="cm-breakdown-row">
                <span>Deductible Business Expenses</span>
                <span class="cm-breakdown-val cm-neg" id="c-expenses-val">-$6,000</span>
              </div>
              <div class="cm-breakdown-row">
                <span>Self-Employment Tax (15.3% SECA)</span>
                <span class="cm-breakdown-val cm-neg" id="c-seca-tax-val">-$21,080</span>
              </div>
              <div class="cm-breakdown-row">
                <span>QBI Deduction (20% Savings)</span>
                <span class="cm-breakdown-val cm-pos" id="c-qbi-val">+$26,500 Base</span>
              </div>
              <div class="cm-breakdown-row">
                <span>Federal & State Income Tax</span>
                <span class="cm-breakdown-val cm-neg" id="c-income-tax-val">-$19,850</span>
              </div>
              <div class="cm-breakdown-row">
                <span>Self-Funded Health Insurance</span>
                <span class="cm-breakdown-val cm-neg" id="c-health-val">-$7,200</span>
              </div>
              <div class="cm-breakdown-row cm-row-highlight">
                <span>Effective Net Hourly Cash</span>
                <span class="cm-breakdown-val" id="c-net-hourly-val">$53.81 / hr</span>
              </div>
            </div>

          </div>

        </div>

        <!-- Visual Waterfall Cash-Flow Meters -->
        <div class="fin-card cm-waterfall-card">
          <div class="fin-card-header">
            <h3 class="fin-card-title">Visual Cash-Flow & Tax Waterfall Comparison</h3>
            <span class="fin-badge">Gross $\\to$ Taxes $\\to$ Benefits $\\to$ Net Spendable</span>
          </div>

          <div class="cm-waterfall-container">
            <!-- W-2 Bar -->
            <div class="cm-bar-group">
              <div class="cm-bar-title-row">
                <span class="cm-bar-label"><strong>Option A: W-2 Employee</strong> (<span id="wf-w2-gross">$130,000</span> Gross)</span>
                <span class="cm-bar-net" id="wf-w2-net-label">Net: $92,220 (70.9%)</span>
              </div>
              <div class="cm-stacked-bar" id="wf-w2-bar" role="progressbar" aria-label="W-2 Cash Flow Distribution">
                <div class="cm-bar-segment cm-seg-net" id="wf-w2-seg-net" style="width: 71%;" title="Net Spendable Cash"></div>
                <div class="cm-bar-segment cm-seg-tax" id="wf-w2-seg-tax" style="width: 26%;" title="Taxes (FICA + Fed + State)"></div>
                <div class="cm-bar-segment cm-seg-benefit" id="wf-w2-seg-ben" style="width: 3%;" title="Deductions"></div>
              </div>
            </div>

            <!-- 1099 Bar -->
            <div class="cm-bar-group">
              <div class="cm-bar-title-row">
                <span class="cm-bar-label"><strong>Option B: 1099 Contractor</strong> (<span id="wf-c-gross">$163,200</span> Gross)</span>
                <span class="cm-bar-net" id="wf-c-net-label">Net: $103,320 (63.3%)</span>
              </div>
              <div class="cm-stacked-bar" id="wf-c-bar" role="progressbar" aria-label="1099 Cash Flow Distribution">
                <div class="cm-bar-segment cm-seg-net" id="wf-c-seg-net" style="width: 63%;" title="Net Spendable Cash"></div>
                <div class="cm-bar-segment cm-seg-tax" id="wf-c-seg-tax" style="width: 25%;" title="Taxes (SECA + Fed + State)"></div>
                <div class="cm-bar-segment cm-seg-exp" id="wf-c-seg-exp" style="width: 8%;" title="Business Expenses + Self-Funded Health"></div>
              </div>
            </div>
          </div>

          <div class="cm-legend">
            <div class="cm-legend-item"><span class="cm-legend-dot cm-seg-net"></span><span>Net Spendable Cash Flow</span></div>
            <div class="cm-legend-item"><span class="cm-legend-dot cm-seg-tax"></span><span>Taxes (FICA, SECA, Fed, State)</span></div>
            <div class="cm-legend-item"><span class="cm-legend-dot cm-seg-exp"></span><span>Business Expenses & Health</span></div>
          </div>
        </div>

        <!-- Cross-Border FX Drag & Payout Rail Sub-Panel -->
        <div class="fin-card cm-fx-card">
          <div class="cm-fx-header-row">
            <div>
              <h3 class="fin-card-title">🌐 International Remote Contractor: Cross-Border FX Drag</h3>
              <span class="cm-card-sub">Are you an international contractor paid in USD? Platforms silently shave 2% to 7.9% off your earnings.</span>
            </div>
            <button type="button" class="pill-btn" id="cm-toggle-fx-btn" aria-label="Toggle International FX Drag Calculator">
              ${this.state.showFxSection ? 'Hide FX Drag' : 'Calculate FX Drag'}
            </button>
          </div>

          <div class="cm-fx-content" id="cm-fx-content" style="display: ${this.state.showFxSection ? 'block' : 'none'};">
            <div class="fin-grid-2" style="margin-bottom:1.25rem;">
              <div class="fin-form-group">
                <label class="fin-label" for="cm-fx-currency-select">Destination Currency</label>
                <select id="cm-fx-currency-select" class="fin-select" aria-label="Target Currency for USD Payout">
                  <option value="EUR" ${this.state.fxTargetCurrency === 'EUR' ? 'selected' : ''}>Euro (€ EUR)</option>
                  <option value="GBP" ${this.state.fxTargetCurrency === 'GBP' ? 'selected' : ''}>British Pound (£ GBP)</option>
                  <option value="INR" ${this.state.fxTargetCurrency === 'INR' ? 'selected' : ''}>Indian Rupee (₹ INR)</option>
                  <option value="CAD" ${this.state.fxTargetCurrency === 'CAD' ? 'selected' : ''}>Canadian Dollar (CA$ CAD)</option>
                  <option value="AUD" ${this.state.fxTargetCurrency === 'AUD' ? 'selected' : ''}>Australian Dollar (A$ AUD)</option>
                  <option value="BRL" ${this.state.fxTargetCurrency === 'BRL' ? 'selected' : ''}>Brazilian Real (R$ BRL)</option>
                  <option value="PHP" ${this.state.fxTargetCurrency === 'PHP' ? 'selected' : ''}>Philippine Peso (₱ PHP)</option>
                </select>
              </div>
              <div class="fin-form-group">
                <label class="fin-label" for="cm-fx-rail-select">Current Payment Rail</label>
                <select id="cm-fx-rail-select" class="fin-select" aria-label="Selected Payment Rail">
                  <option value="wise" ${this.state.fxSelectedRail === 'wise' ? 'selected' : ''}>Wise Business (0.55% Transparent)</option>
                  <option value="deel" ${this.state.fxSelectedRail === 'deel' ? 'selected' : ''}>Deel / Remote.com (2.00% FX Spread)</option>
                  <option value="payoneer" ${this.state.fxSelectedRail === 'payoneer' ? 'selected' : ''}>Payoneer (3.00% FX Spread)</option>
                  <option value="stripe" ${this.state.fxSelectedRail === 'stripe' ? 'selected' : ''}>Stripe Invoicing (~4.90% Drag)</option>
                  <option value="paypal" ${this.state.fxSelectedRail === 'paypal' ? 'selected' : ''}>PayPal (~7.90% International Drag)</option>
                  <option value="wire" ${this.state.fxSelectedRail === 'wire' ? 'selected' : ''}>Bank SWIFT Wire ($35 + 3.0%)</option>
                </select>
              </div>
            </div>

            <!-- FX Comparison Table -->
            <div class="cm-fx-table-wrap">
              <table class="cm-fx-table" aria-label="Payment Rails Fee Comparison Table">
                <thead>
                  <tr>
                    <th>Payout Rail</th>
                    <th>Effective Fee / Markup</th>
                    <th>Annual Fees Lost</th>
                    <th>Net Local Currency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="cm-fx-tbody">
                  <!-- Injected dynamically -->
                </tbody>
              </table>
            </div>

            <div class="cm-fx-callout" id="cm-fx-callout" style="display: flex; align-items: center; gap: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/></svg>
              <span><strong>Smart Rail Tip:</strong> Switching from PayPal to Wise Business on $163,200 annual revenue saves approximately <strong>$11,990/year</strong> in currency conversion drag!</span>
            </div>
          </div>
        </div>

        <!-- High-Yield Partner & Monetization Hub -->
        <div class="cm-monetization-grid">
          
          <!-- Card 1: Expat / Contractor CPA Lead -->
          <div class="cm-partner-card">
            <div class="cm-partner-badge">Verified Partner</div>
            <div class="cm-partner-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
            <h4 class="cm-partner-title">Expat & Contractor Tax CPA Consultation</h4>
            <p class="cm-partner-desc">Maximize your Section 199A QBI deduction, optimize Schedule C write-offs, and set up your Solo 401(k) with US licensed CPAs.</p>
            <a href="https://www.greenbacktaxservices.com/" target="_blank" rel="noopener noreferrer" class="cm-partner-cta" aria-label="Book CPA Consultation">
              <span>Book CPA Consultation</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </a>
          </div>

          <!-- Card 2: Wise Business Cross-Border Rail -->
          <div class="cm-partner-card">
            <div class="cm-partner-badge" style="background:#ecfdf5; color:#065f46;">Lowest FX Fee</div>
            <div class="cm-partner-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
            <h4 class="cm-partner-title">Wise Business: Zero-Markup USD Invoicing</h4>
            <p class="cm-partner-desc">Get local US bank routing details (ACH/wire) and convert payments into 40+ currencies at pure mid-market exchange rates.</p>
            <a href="https://wise.com/business/" target="_blank" rel="noopener noreferrer" class="cm-partner-cta" aria-label="Open Wise Business Account">
              <span>Open Free Wise Account</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </a>
          </div>

          <!-- Card 3: Nomad & Remote Health Insurance -->
          <div class="cm-partner-card">
            <div class="cm-partner-badge" style="background:#eff6ff; color:#1e40af;">Global Coverage</div>
            <div class="cm-partner-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg></div>
            <h4 class="cm-partner-title">SafetyWing Remote Health for Contractors</h4>
            <p class="cm-partner-desc">Comprehensive worldwide health insurance designed for remote contractors, freelancers, and nomads operating across borders.</p>
            <a href="https://safetywing.com/remote-health" target="_blank" rel="noopener noreferrer" class="cm-partner-cta" aria-label="View SafetyWing Coverage Plans">
              <span>Explore Health Coverage</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </a>
          </div>

        </div>

      </div>
    `;

    this.bindEvents();
    this.updateCalculations();
  }

  bindEvents() {
    const root = this.containerEl;

    // Presets
    root.querySelectorAll(".cm-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        root.querySelectorAll(".cm-preset-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.applyPreset(btn.dataset.preset);
      });
    });

    // Synchronize W-2 Inputs
    const w2SalaryNum = root.querySelector("#w2-salary-num");
    const w2SalarySlider = root.querySelector("#w2-salary-slider");
    if (w2SalaryNum && w2SalarySlider) {
      w2SalaryNum.addEventListener("input", (e) => {
        w2SalarySlider.value = e.target.value;
        this.state.w2Salary = Number(e.target.value) || 0;
        this.scheduleUpdate();
      });
      w2SalarySlider.addEventListener("input", (e) => {
        w2SalaryNum.value = e.target.value;
        this.state.w2Salary = Number(e.target.value) || 0;
        this.scheduleUpdate();
      });
    }

    const w2Filing = root.querySelector("#w2-filing-select");
    if (w2Filing) {
      w2Filing.addEventListener("change", (e) => {
        this.state.w2FilingStatus = e.target.value;
        this.scheduleUpdate();
      });
    }

    const w2State = root.querySelector("#w2-state-select");
    if (w2State) {
      w2State.addEventListener("change", (e) => {
        this.state.w2StateTaxRate = Number(e.target.value) || 0;
        this.scheduleUpdate();
      });
    }

    const w2Health = root.querySelector("#w2-health-num");
    if (w2Health) {
      w2Health.addEventListener("input", (e) => {
        this.state.w2HealthSubsidy = Number(e.target.value) || 0;
        this.scheduleUpdate();
      });
    }

    const w2Match = root.querySelector("#w2-401k-num");
    if (w2Match) {
      w2Match.addEventListener("input", (e) => {
        const val = Number(e.target.value) || 0;
        this.state.w2Match401k = val;
        root.querySelector("#w2-401k-display").textContent = `${val}%`;
        this.scheduleUpdate();
      });
    }

    const w2Pto = root.querySelector("#w2-pto-num");
    if (w2Pto) {
      w2Pto.addEventListener("input", (e) => {
        const val = Number(e.target.value) || 0;
        this.state.w2PtoDays = val;
        root.querySelector("#w2-pto-display").textContent = `${val} Days (${val * 8} hrs)`;
        this.scheduleUpdate();
      });
    }

    // Synchronize 1099 Inputs
    const cRateNum = root.querySelector("#c-rate-num");
    const cRateSlider = root.querySelector("#c-rate-slider");
    if (cRateNum && cRateSlider) {
      cRateNum.addEventListener("input", (e) => {
        cRateSlider.value = e.target.value;
        this.state.cHourlyRate = Number(e.target.value) || 0;
        this.scheduleUpdate();
      });
      cRateSlider.addEventListener("input", (e) => {
        cRateNum.value = e.target.value;
        this.state.cHourlyRate = Number(e.target.value) || 0;
        this.scheduleUpdate();
      });
    }

    const cHours = root.querySelector("#c-hours-num");
    if (cHours) {
      cHours.addEventListener("input", (e) => {
        const val = Number(e.target.value) || 0;
        this.state.cHoursPerWeek = val;
        root.querySelector("#c-hours-display").textContent = `${val} hrs`;
        this.scheduleUpdate();
      });
    }

    const cWeeks = root.querySelector("#c-weeks-num");
    if (cWeeks) {
      cWeeks.addEventListener("input", (e) => {
        const val = Number(e.target.value) || 0;
        this.state.cWeeksPerYear = val;
        root.querySelector("#c-weeks-display").textContent = `${val} weeks`;
        this.scheduleUpdate();
      });
    }

    const cExpenses = root.querySelector("#c-expenses-num");
    if (cExpenses) {
      cExpenses.addEventListener("input", (e) => {
        this.state.cAnnualExpenses = Number(e.target.value) || 0;
        this.scheduleUpdate();
      });
    }

    const cHealth = root.querySelector("#c-health-num");
    if (cHealth) {
      cHealth.addEventListener("input", (e) => {
        this.state.cHealthCost = Number(e.target.value) || 0;
        this.scheduleUpdate();
      });
    }

    const cQbi = root.querySelector("#c-qbi-toggle");
    if (cQbi) {
      cQbi.addEventListener("change", (e) => {
        this.state.cEligibleQBI = e.target.checked;
        this.scheduleUpdate();
      });
    }

    // FX Controls
    const fxToggleBtn = root.querySelector("#cm-toggle-fx-btn");
    const fxContent = root.querySelector("#cm-fx-content");
    if (fxToggleBtn && fxContent) {
      fxToggleBtn.addEventListener("click", () => {
        this.state.showFxSection = !this.state.showFxSection;
        fxContent.style.display = this.state.showFxSection ? "block" : "none";
        fxToggleBtn.textContent = this.state.showFxSection ? "Hide FX Drag" : "Calculate FX Drag";
      });
    }

    const fxCurr = root.querySelector("#cm-fx-currency-select");
    if (fxCurr) {
      fxCurr.addEventListener("change", (e) => {
        this.state.fxTargetCurrency = e.target.value;
        this.scheduleUpdate();
      });
    }

    const fxRail = root.querySelector("#cm-fx-rail-select");
    if (fxRail) {
      fxRail.addEventListener("change", (e) => {
        this.state.fxSelectedRail = e.target.value;
        this.scheduleUpdate();
      });
    }

    // Share / Copy Breakdown
    const copyBtn = root.querySelector("#cm-copy-summary-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copySummaryToClipboard());
    }
  }

  applyPreset(preset) {
    if (preset === "junior") {
      this.state.w2Salary = 90000;
      this.state.cHourlyRate = 60;
      this.state.cAnnualExpenses = 4000;
      this.state.w2HealthSubsidy = 6000;
    } else if (preset === "senior") {
      this.state.w2Salary = 140000;
      this.state.cHourlyRate = 95;
      this.state.cAnnualExpenses = 6000;
      this.state.w2HealthSubsidy = 7200;
    } else if (preset === "lead") {
      this.state.w2Salary = 200000;
      this.state.cHourlyRate = 145;
      this.state.cAnnualExpenses = 9000;
      this.state.w2HealthSubsidy = 9000;
      this.state.w2Match401k = 5.0;
    } else if (preset === "crossborder") {
      this.state.w2Salary = 120000;
      this.state.cHourlyRate = 80;
      this.state.showFxSection = true;
      const fxContent = this.containerEl.querySelector("#cm-fx-content");
      const fxToggle = this.containerEl.querySelector("#cm-toggle-fx-btn");
      if (fxContent) fxContent.style.display = "block";
      if (fxToggle) fxToggle.textContent = "Hide FX Drag";
    }

    // Sync input values
    const root = this.containerEl;
    if (root.querySelector("#w2-salary-num")) root.querySelector("#w2-salary-num").value = this.state.w2Salary;
    if (root.querySelector("#w2-salary-slider")) root.querySelector("#w2-salary-slider").value = this.state.w2Salary;
    if (root.querySelector("#c-rate-num")) root.querySelector("#c-rate-num").value = this.state.cHourlyRate;
    if (root.querySelector("#c-rate-slider")) root.querySelector("#c-rate-slider").value = this.state.cHourlyRate;
    if (root.querySelector("#c-expenses-num")) root.querySelector("#c-expenses-num").value = this.state.cAnnualExpenses;
    if (root.querySelector("#w2-health-num")) root.querySelector("#w2-health-num").value = this.state.w2HealthSubsidy;

    this.updateCalculations();
  }

  scheduleUpdate() {
    if (this.debounceTimer) cancelAnimationFrame(this.debounceTimer);
    this.debounceTimer = requestAnimationFrame(() => this.updateCalculations());
  }

  updateCalculations() {
    const root = this.containerEl;
    if (!root) return;

    const w2Params = {
      salary: this.state.w2Salary,
      filingStatus: this.state.w2FilingStatus,
      stateTaxRatePercent: this.state.w2StateTaxRate,
      healthSubsidyAnnual: this.state.w2HealthSubsidy,
      match401kPercent: this.state.w2Match401k,
      ptoDays: this.state.w2PtoDays,
      employee401kContribution: this.state.w2Employee401k
    };

    const contractorParams = {
      hourlyRate: this.state.cHourlyRate,
      hoursPerWeek: this.state.cHoursPerWeek,
      weeksPerYear: this.state.cWeeksPerYear,
      annualExpenses: this.state.cAnnualExpenses,
      filingStatus: this.state.w2FilingStatus, // keep synchronized
      stateTaxRatePercent: this.state.w2StateTaxRate,
      eligibleQBI: this.state.cEligibleQBI,
      isSSTB: this.state.cIsSSTB,
      selfFundedHealthAnnual: this.state.cHealthCost,
      solo401kAnnual: this.state.cSolo401k
    };

    const fxParams = {
      targetCurrency: this.state.fxTargetCurrency,
      selectedRail: this.state.fxSelectedRail
    };

    const parity = ContractorMatrixEngine.calculateParity(w2Params, contractorParams, fxParams);
    const { w2, contractor, fx, verdict } = parity;

    // 1. Update Verdict Banner
    const verdictCard = root.querySelector("#cm-verdict-card");
    const verdictPill = root.querySelector("#cm-verdict-pill");
    const verdictTag = root.querySelector("#cm-verdict-tag");
    const verdictHeadline = root.querySelector("#cm-verdict-headline");
    const verdictSubtext = root.querySelector("#cm-verdict-subtext");

    if (verdict.winner === "1099") {
      verdictCard.className = "cm-verdict-hero cm-winner-1099";
      verdictPill.textContent = "1099 Contractor Offer Wins";
      verdictTag.textContent = `+${verdict.percentDiff}% More Spendable Cash`;
      verdictHeadline.innerHTML = `The 1099 offer yields <strong>+$${verdict.diffMonthly.toLocaleString()}/mo</strong> more spendable cash!`;
      verdictSubtext.textContent = `After all federal/state taxes, 15.3% SECA, 20% Section 199A QBI deduction, and self-funded health insurance.`;
    } else if (verdict.winner === "w2") {
      verdictCard.className = "cm-verdict-hero cm-winner-w2";
      verdictPill.textContent = "W-2 Salaried Offer Wins";
      verdictTag.textContent = `+${verdict.percentDiff}% More Value`;
      verdictHeadline.innerHTML = `The W-2 offer leaves <strong>+$${verdict.diffMonthly.toLocaleString()}/mo</strong> more spendable cash in bank!`;
      verdictSubtext.textContent = `W-2 employer FICA match, paid time off (${w2.benefits.ptoDays} days), and health insurance subsidies outweigh the 1099 rate.`;
    } else {
      verdictCard.className = "cm-verdict-hero cm-winner-tie";
      verdictPill.textContent = "Neutral Parity";
      verdictTag.textContent = `Equivalent Take-Home`;
      verdictHeadline.innerHTML = `Both offers yield identical spendable take-home cash.`;
      verdictSubtext.textContent = `Evaluate based on career autonomy, job security, and project flexibility.`;
    }

    // Breakeven Numbers
    root.querySelector("#cm-breakeven-cash").textContent = `$${verdict.breakevenHourlyRateCash.toFixed(2)} / hr`;
    root.querySelector("#cm-breakeven-totalcomp").textContent = `$${verdict.breakevenHourlyRateTotalComp.toFixed(2)} / hr`;

    // 2. Update W-2 Metrics
    root.querySelector("#w2-net-monthly").textContent = `${this.format(w2.cashFlow.monthlyTakeHomeCash)} / mo`;
    root.querySelector("#w2-net-annual").textContent = `${this.format(w2.cashFlow.annualTakeHomeCash)} / year`;
    root.querySelector("#w2-fica-val").textContent = `-${this.format(w2.taxes.totalFica)}`;
    root.querySelector("#w2-fed-tax-val").textContent = `-${this.format(w2.taxes.federalTax)}`;
    root.querySelector("#w2-state-tax-val").textContent = `-${this.format(w2.taxes.stateTax)}`;
    root.querySelector("#w2-eff-tax-rate").textContent = `${w2.taxes.effectiveTaxRate}%`;
    root.querySelector("#w2-total-tax-val").textContent = `-${this.format(w2.taxes.totalTax)}`;
    root.querySelector("#w2-benefits-val").textContent = `+${this.format(w2.benefits.totalBenefitsValue)}`;
    root.querySelector("#w2-worked-rate-val").textContent = `$${w2.cashFlow.effectiveWorkedHourlyTakeHome.toFixed(2)} / hr`;

    // 3. Update 1099 Metrics
    root.querySelector("#c-net-monthly").textContent = `${this.format(contractor.cashFlow.monthlyNetSpendableCash)} / mo`;
    root.querySelector("#c-net-annual").textContent = `${this.format(contractor.cashFlow.annualNetSpendableCash)} / year`;
    root.querySelector("#c-gross-hours").textContent = `${contractor.totalBillableHours.toLocaleString()} hrs`;
    root.querySelector("#c-gross-rev-val").textContent = `+${this.format(contractor.grossRevenue)}`;
    root.querySelector("#c-expenses-val").textContent = `-${this.format(contractor.businessExpenses)}`;
    root.querySelector("#c-seca-tax-val").textContent = `-${this.format(contractor.taxes.totalSETax)}`;
    root.querySelector("#c-qbi-val").textContent = `-${this.format(contractor.deductions.qbiDeduction)} (20% Cut)`;
    root.querySelector("#c-income-tax-val").textContent = `-${this.format(contractor.taxes.federalTax + contractor.taxes.stateTax)}`;
    root.querySelector("#c-health-val").textContent = `-${this.format(contractor.outflows.selfFundedHealthAnnual)}`;
    root.querySelector("#c-net-hourly-val").textContent = `$${contractor.cashFlow.effectiveNetHourlyCash.toFixed(2)} / hr`;

    // 4. Update Waterfall Bars
    root.querySelector("#wf-w2-gross").textContent = this.format(w2.grossSalary);
    root.querySelector("#wf-c-gross").textContent = this.format(contractor.grossRevenue);

    const w2NetPct = w2.grossSalary > 0 ? Math.round((w2.cashFlow.annualTakeHomeCash / w2.grossSalary) * 100) : 0;
    const w2TaxPct = w2.grossSalary > 0 ? Math.round((w2.taxes.totalTax / w2.grossSalary) * 100) : 0;
    root.querySelector("#wf-w2-net-label").textContent = `Net: ${this.format(w2.cashFlow.annualTakeHomeCash)} (${w2NetPct}%)`;
    root.querySelector("#wf-w2-seg-net").style.width = `${w2NetPct}%`;
    root.querySelector("#wf-w2-seg-tax").style.width = `${w2TaxPct}%`;

    const cNetPct = contractor.grossRevenue > 0 ? Math.round((contractor.cashFlow.annualNetSpendableCash / contractor.grossRevenue) * 100) : 0;
    const cTaxPct = contractor.grossRevenue > 0 ? Math.round((contractor.taxes.totalTax / contractor.grossRevenue) * 100) : 0;
    const cExpPct = Math.max(0, 100 - cNetPct - cTaxPct);
    root.querySelector("#wf-c-net-label").textContent = `Net: ${this.format(contractor.cashFlow.annualNetSpendableCash)} (${cNetPct}%)`;
    root.querySelector("#wf-c-seg-net").style.width = `${cNetPct}%`;
    root.querySelector("#wf-c-seg-tax").style.width = `${cTaxPct}%`;
    root.querySelector("#wf-c-seg-exp").style.width = `${cExpPct}%`;

    // 5. Update FX Drag Table
    const tbody = root.querySelector("#cm-fx-tbody");
    if (tbody && fx.rails) {
      tbody.innerHTML = fx.rails.map(r => `
        <tr class="${r.isSelected ? 'cm-row-active-rail' : ''}">
          <td>
            <strong>${r.name}</strong>
            <div style="font-size:0.7rem; color:var(--text-muted);">${r.description}</div>
          </td>
          <td>${r.totalDragPercent.toFixed(2)}%</td>
          <td style="color:${r.feeAmountUsd > 3000 ? 'var(--color-danger, #ef4444)' : 'inherit'};">
            $${r.feeAmountUsd.toLocaleString()} / yr
          </td>
          <td>
            <strong>${fx.currencySymbol}${r.netLocalReceived.toLocaleString()}</strong>
          </td>
          <td>
            ${r.isSelected ? '<span class="sidebar-tag" style="background:#dbeafe; color:#1e40af;">Active Rail</span>' : ''}
            ${r.key === 'wise' ? '<span class="sidebar-tag" style="background:#ecfdf5; color:#065f46;">Lowest Drag</span>' : ''}
          </td>
        </tr>
      `).join("");

      const callout = root.querySelector("#cm-fx-callout");
      if (callout) {
        callout.innerHTML = `<div style="display: flex; align-items: center; gap: 8px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/></svg><span><strong>Savings Callout:</strong> Choosing <strong>Wise Business</strong> over PayPal on $${contractor.grossRevenue.toLocaleString()} annual invoicing retains an additional <strong>$${fx.savingsVsWorstUsd.toLocaleString()} / year</strong> in your local bank account!</span></div>`;
      }
    }

    // 6. Record into History Tape
    if (typeof window.recordCalculationTape === "function") {
      const tapeSummary = `${verdict.winner === '1099' ? '1099 Wins (+$' + verdict.diffMonthly.toLocaleString() + '/mo)' : 'W-2 Wins (+$' + verdict.diffMonthly.toLocaleString() + '/mo)'}`;
      const tapeSub = `Breakeven: $${verdict.breakevenHourlyRateCash.toFixed(2)}/hr | W-2: $${this.format(w2.grossSalary)} vs 1099: $${this.state.cHourlyRate}/hr`;
      // Throttle tape logging
      if (this.lastTapeSummary !== tapeSummary) {
        this.lastTapeSummary = tapeSummary;
        window.recordCalculationTape("1099 vs W-2 Matrix", tapeSummary, tapeSub);
      }
    }
  }

  copySummaryToClipboard() {
    const root = this.containerEl;
    const verdictHeadline = root.querySelector("#cm-verdict-headline")?.textContent || "";
    const breakeven = root.querySelector("#cm-breakeven-cash")?.textContent || "";
    const w2Net = root.querySelector("#w2-net-annual")?.textContent || "";
    const cNet = root.querySelector("#c-net-annual")?.textContent || "";

    const text = `📊 TrueCalci 1099 vs W-2 Remote Contractor Parity Breakdown:
Offer Comparison:
• W-2 Salary: $${this.state.w2Salary.toLocaleString()} (Net Cash: ${w2Net})
• 1099 Rate: $${this.state.cHourlyRate}/hr (Net Cash: ${cNet})

Verdict: ${verdictHeadline}
Exact 1099 Breakeven Rate: ${breakeven}

Calculated via TrueCalci Precision Suite: https://truecalci.com/#contractor_matrix`;

    navigator.clipboard.writeText(text).then(() => {
      const btn = root.querySelector("#cm-copy-summary-btn");
      if (btn) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span>Copied to Clipboard!</span>`;
        setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
      }
    }).catch(() => {});
  }
}
