/**
 * Indian Household & Personal Finance View Controller
 * Interactive sliders, live recalculation, Canvas charts, amortization tables, and CSV export.
 */

import { IndianFinanceEngine } from "../engines/indian-finance.js";

export class ViewIndianFinance {
  constructor(containerEl, onOpenInfo) {
    this.container = containerEl;
    this.onOpenInfo = onOpenInfo;
    this.currentSubtab = "sip"; // sip, tax, home_loan, gold, ppf, ssy, fd, gst, land
  }

  render() {
    this.container.innerHTML = `
      <div class="financial-view-container">
        <!-- Dynamic Content Mount Area -->
        <div id="fin-active-content"></div>
      </div>
    `;

    this.renderActiveSubtab();
  }

  renderActiveSubtab() {
    let mountEl = this.container.querySelector("#fin-active-content");
    if (!mountEl) {
      this.container.innerHTML = `
        <div class="financial-view-container">
          <div id="fin-active-content"></div>
        </div>
      `;
      mountEl = this.container.querySelector("#fin-active-content");
    }
    if (!mountEl) return;

    switch (this.currentSubtab) {
      case "sip":
        this.renderSIP(mountEl);
        break;
      case "tax":
        this.renderIncomeTax(mountEl);
        break;
      case "home_loan":
        this.renderHomeLoan(mountEl);
        break;
      case "gold":
        this.renderGold(mountEl);
        break;
      case "ppf":
        this.renderPPF(mountEl);
        break;
      case "ssy":
        this.renderSSY(mountEl);
        break;
      case "fd":
        this.renderFD(mountEl);
        break;
      case "gst":
        this.renderGST(mountEl);
        break;
      case "land":
        this.renderLand(mountEl);
        break;
    }
  }

  // =========================================================================
  // 1. SIP & Step-Up SIP View
  // =========================================================================
  renderSIP(mountEl) {
    mountEl.innerHTML = `
      <div class="financial-calc-grid">
        <div class="fin-inputs-panel">
          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Monthly Investment (P)</span>
              <div class="fin-input-box-wrapper">
                <span class="fin-currency-prefix">₹</span>
                <input type="number" id="sip-amount-num" class="fin-number-input" value="10000" min="500" max="1000000" step="500">
              </div>
            </div>
            <input type="range" id="sip-amount-slider" class="fin-slider" value="10000" min="500" max="200000" step="500">
          </div>

          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Expected Return Rate (p.a.)</span>
              <div class="fin-input-box-wrapper">
                <input type="number" id="sip-rate-num" class="fin-number-input" value="12.0" min="1" max="30" step="0.5">
                <span class="fin-currency-prefix">%</span>
              </div>
            </div>
            <input type="range" id="sip-rate-slider" class="fin-slider" value="12.0" min="1" max="30" step="0.5">
            <div class="fin-preset-chips">
              <button class="fin-chip" data-rate="7.5">Conservative (7.5%)</button>
              <button class="fin-chip" data-rate="10.0">Moderate (10%)</button>
              <button class="fin-chip active" data-rate="12.0">Nifty Benchmark (12%)</button>
              <button class="fin-chip" data-rate="14.0">Aggressive (14%)</button>
            </div>
          </div>

          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Time Period (Years)</span>
              <div class="fin-input-box-wrapper">
                <input type="number" id="sip-years-num" class="fin-number-input" value="15" min="1" max="40" step="1">
                <span class="fin-currency-prefix">Yr</span>
              </div>
            </div>
            <input type="range" id="sip-years-slider" class="fin-slider" value="15" min="1" max="40" step="1">
          </div>

          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Annual Step-Up (%) <small style="color:var(--text-muted);">(Optional)</small></span>
              <div class="fin-input-box-wrapper">
                <input type="number" id="sip-stepup-num" class="fin-number-input" value="0" min="0" max="30" step="1">
                <span class="fin-currency-prefix">%</span>
              </div>
            </div>
            <input type="range" id="sip-stepup-slider" class="fin-slider" value="0" min="0" max="30" step="1">
          </div>
        </div>

        <div class="fin-results-panel">
          <div class="fin-stat-card">
            <span class="fin-stat-label">Invested Amount</span>
            <span class="fin-stat-value" id="sip-res-invested">₹18,00,000</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">Estimated Wealth Gain</span>
            <span class="fin-stat-value highlight-green" id="sip-res-returns">₹32,45,760</span>
          </div>
          <div class="fin-stat-card" style="border-bottom:none;">
            <span class="fin-stat-label">Total Maturity Value</span>
            <span class="fin-stat-value highlight-blue" id="sip-res-total">₹50,45,760</span>
          </div>

          <!-- Pure Canvas Doughnut Chart -->
          <div class="fin-chart-container">
            <canvas id="sip-donut-canvas" class="fin-donut-canvas" width="180" height="180"></canvas>
            <div class="fin-chart-legend">
              <div class="fin-legend-item">
                <div class="fin-legend-color" style="background:#1e3a8a;"></div>
                <span>Invested</span>
              </div>
              <div class="fin-legend-item">
                <div class="fin-legend-color" style="background:#059669;"></div>
                <span>Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Year-wise schedule table -->
      <div class="schedule-header-actions">
        <h4 class="schedule-title">Year-on-Year Growth Projection</h4>
        <button class="export-btn" id="sip-export-csv">📥 Export CSV</button>
      </div>
      <div class="schedule-table-wrapper">
        <table class="schedule-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Monthly SIP</th>
              <th>Invested (Year)</th>
              <th>Total Invested</th>
              <th>Total Value</th>
              <th>Wealth Gain</th>
            </tr>
          </thead>
          <tbody id="sip-schedule-body"></tbody>
        </table>
      </div>
    `;

    this.bindSIPInputs(mountEl);
    this.recalculateSIP();
  }

  bindSIPInputs(mountEl) {
    const amtNum = mountEl.querySelector("#sip-amount-num");
    const amtSlider = mountEl.querySelector("#sip-amount-slider");
    const rateNum = mountEl.querySelector("#sip-rate-num");
    const rateSlider = mountEl.querySelector("#sip-rate-slider");
    const yrsNum = mountEl.querySelector("#sip-years-num");
    const yrsSlider = mountEl.querySelector("#sip-years-slider");
    const stepNum = mountEl.querySelector("#sip-stepup-num");
    const stepSlider = mountEl.querySelector("#sip-stepup-slider");

    // Sync input <-> slider
    const syncPair = (n, s) => {
      n.addEventListener("input", () => { s.value = n.value; this.recalculateSIP(); });
      s.addEventListener("input", () => { n.value = s.value; this.recalculateSIP(); });
    };

    syncPair(amtNum, amtSlider);
    syncPair(rateNum, rateSlider);
    syncPair(yrsNum, yrsSlider);
    syncPair(stepNum, stepSlider);

    // Preset chips
    mountEl.querySelectorAll(".fin-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        mountEl.querySelectorAll(".fin-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        rateNum.value = chip.dataset.rate;
        rateSlider.value = chip.dataset.rate;
        this.recalculateSIP();
      });
    });

    // CSV Export
    mountEl.querySelector("#sip-export-csv").addEventListener("click", () => {
      this.exportSIPCSV();
    });
  }

  recalculateSIP() {
    const monthly = parseFloat(document.getElementById("sip-amount-num")?.value || 10000);
    const rate = parseFloat(document.getElementById("sip-rate-num")?.value || 12);
    const years = parseInt(document.getElementById("sip-years-num")?.value || 15);
    const stepUp = parseFloat(document.getElementById("sip-stepup-num")?.value || 0);

    const data = IndianFinanceEngine.calculateSIP({
      monthlyInvestment: monthly,
      annualReturnRate: rate,
      tenureYears: years,
      stepUpPercent: stepUp
    });

    this.lastSIPData = data;

    document.getElementById("sip-res-invested").textContent = IndianFinanceEngine.formatINR(data.totalInvested);
    document.getElementById("sip-res-returns").textContent = IndianFinanceEngine.formatINR(data.estimatedReturns);
    document.getElementById("sip-res-total").textContent = IndianFinanceEngine.formatINR(data.maturityValue);

    // Draw Donut
    this.drawDonutChart("sip-donut-canvas", data.totalInvested, data.estimatedReturns, "#1e3a8a", "#059669");

    // Fill table
    const tbody = document.getElementById("sip-schedule-body");
    if (tbody) {
      tbody.innerHTML = data.yearlyBreakdown.map(row => `
        <tr>
          <td>Year ${row.year}</td>
          <td>${IndianFinanceEngine.formatINR(row.monthlySIP)}</td>
          <td>${IndianFinanceEngine.formatINR(row.investedThisYear)}</td>
          <td>${IndianFinanceEngine.formatINR(row.totalInvested)}</td>
          <td><strong>${IndianFinanceEngine.formatINR(row.totalWealth)}</strong></td>
          <td style="color:var(--emerald-primary)">+${IndianFinanceEngine.formatINR(row.wealthGain)}</td>
        </tr>
      `).join("");
    }
  }

  exportSIPCSV() {
    if (!this.lastSIPData) return;
    let csv = "Year,Monthly SIP,Invested (Year),Total Invested,Total Value,Wealth Gain\n";
    this.lastSIPData.yearlyBreakdown.forEach(r => {
      csv += `${r.year},${r.monthlySIP},${r.investedThisYear},${r.totalInvested},${r.totalWealth},${r.wealthGain}\n`;
    });
    this.downloadCSV(csv, "sip_growth_schedule.csv");
  }

  // =========================================================================
  // 2. Income Tax Calculator (Budget 2025-26) View
  // =========================================================================
  renderIncomeTax(mountEl) {
    mountEl.innerHTML = `
      <div class="financial-calc-grid">
        <div class="fin-inputs-panel">
          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Gross Annual Income (Annual CTC / Gross)</span>
              <div class="fin-input-box-wrapper" style="width: 170px;">
                <span class="fin-currency-prefix">₹</span>
                <input type="number" id="tax-income-num" class="fin-number-input" value="1250000" min="100000" max="10000000" step="50000">
              </div>
            </div>
            <input type="range" id="tax-income-slider" class="fin-slider" value="1250000" min="200000" max="5000000" step="50000">
            <div class="fin-preset-chips">
              <button class="fin-chip" data-income="750000">₹7.5 Lakh</button>
              <button class="fin-chip" data-income="1000000">₹10 Lakh</button>
              <button class="fin-chip active" data-income="1250000">₹12.5 Lakh (Zero Net Tax)</button>
              <button class="fin-chip" data-income="1500000">₹15 Lakh</button>
              <button class="fin-chip" data-income="2500000">₹25 Lakh</button>
            </div>
          </div>

          <div class="fin-input-group">
            <label style="font-size:0.875rem; font-weight:600; display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="tax-salaried-check" checked style="width:16px; height:16px;">
              <span>Salaried Employee (Eligible for ₹75,000 Standard Deduction)</span>
            </label>
          </div>

          <div style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
            <h5 style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:0.75rem;">
              Deductions for Old Tax Regime Comparison
            </h5>
            <div class="fin-deductions-grid">
              <div class="fin-input-group">
                <span class="fin-input-label" style="font-size:0.75rem;">Section 80C (PPF, ELSS, EPF, LIC)</span>
                <div class="fin-input-box-wrapper" style="width:100%;">
                  <span class="fin-currency-prefix">₹</span>
                  <input type="number" id="tax-80c-num" class="fin-number-input" value="150000" max="150000" step="10000">
                </div>
              </div>
              <div class="fin-input-group">
                <span class="fin-input-label" style="font-size:0.75rem;">Section 80D (Health Insurance)</span>
                <div class="fin-input-box-wrapper" style="width:100%;">
                  <span class="fin-currency-prefix">₹</span>
                  <input type="number" id="tax-80d-num" class="fin-number-input" value="25000" max="100000" step="5000">
                </div>
              </div>
              <div class="fin-input-group">
                <span class="fin-input-label" style="font-size:0.75rem;">HRA Exemption</span>
                <div class="fin-input-box-wrapper" style="width:100%;">
                  <span class="fin-currency-prefix">₹</span>
                  <input type="number" id="tax-hra-num" class="fin-number-input" value="100000" step="10000">
                </div>
              </div>
              <div class="fin-input-group">
                <span class="fin-input-label" style="font-size:0.75rem;">Other Deductions (NPS 80CCD, etc.)</span>
                <div class="fin-input-box-wrapper" style="width:100%;">
                  <span class="fin-currency-prefix">₹</span>
                  <input type="number" id="tax-other-num" class="fin-number-input" value="50000" step="10000">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="fin-results-panel">
          <div class="tax-comparison-grid">
            <!-- New Regime Card -->
            <div class="regime-card" id="tax-card-new">
              <span class="regime-badge-winner" id="tax-badge-new" style="display:none;">Recommended</span>
              <h4 class="regime-title">New Tax Regime <small style="font-size:0.7rem; color:var(--text-muted);">(Default)</small></h4>
              <div class="regime-row">
                <span>Std. Deduction:</span>
                <strong id="tax-new-std">₹75,000</strong>
              </div>
              <div class="regime-row">
                <span>Taxable Income:</span>
                <strong id="tax-new-taxable">₹11,75,000</strong>
              </div>
              <div class="regime-row">
                <span>Gross Tax:</span>
                <span id="tax-new-gross">₹57,500</span>
              </div>
              <div class="regime-row" style="color:var(--emerald-primary);">
                <span>87A Rebate:</span>
                <strong id="tax-new-rebate">-₹57,500</strong>
              </div>
              <div class="regime-row">
                <span>Cess (4%):</span>
                <span id="tax-new-cess">₹0</span>
              </div>
              <hr style="border:none; border-top:1px solid var(--border-color);">
              <div class="regime-row">
                <span style="font-weight:700;">Total Tax Payable:</span>
                <div class="regime-final-tax" id="tax-new-final">₹0</div>
              </div>
            </div>

            <!-- Old Regime Card -->
            <div class="regime-card" id="tax-card-old">
              <span class="regime-badge-winner" id="tax-badge-old" style="display:none;">Recommended</span>
              <h4 class="regime-title">Old Tax Regime</h4>
              <div class="regime-row">
                <span>Total Deductions:</span>
                <strong id="tax-old-deductions">₹3,75,000</strong>
              </div>
              <div class="regime-row">
                <span>Taxable Income:</span>
                <strong id="tax-old-taxable">₹8,75,000</strong>
              </div>
              <div class="regime-row">
                <span>Gross Tax:</span>
                <span id="tax-old-gross">₹87,500</span>
              </div>
              <div class="regime-row">
                <span>87A Rebate:</span>
                <span id="tax-old-rebate">₹0</span>
              </div>
              <div class="regime-row">
                <span>Cess (4%):</span>
                <span id="tax-old-cess">₹3,500</span>
              </div>
              <hr style="border:none; border-top:1px solid var(--border-color);">
              <div class="regime-row">
                <span style="font-weight:700;">Total Tax Payable:</span>
                <div class="regime-final-tax" id="tax-old-final">₹91,000</div>
              </div>
            </div>
          </div>

          <div style="background:var(--bg-subtle); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); text-align:center;">
            <span style="font-size:0.85rem; font-weight:600;" id="tax-recommendation-text">
              🎉 You save <strong>₹91,000</strong> with the New Tax Regime!
            </span>
          </div>
        </div>
      </div>
    `;

    this.bindTaxInputs(mountEl);
    this.recalculateTax();
  }

  bindTaxInputs(mountEl) {
    const incNum = mountEl.querySelector("#tax-income-num");
    const incSlider = mountEl.querySelector("#tax-income-slider");
    const salariedCheck = mountEl.querySelector("#tax-salaried-check");
    const c80 = mountEl.querySelector("#tax-80c-num");
    const d80 = mountEl.querySelector("#tax-80d-num");
    const hra = mountEl.querySelector("#tax-hra-num");
    const other = mountEl.querySelector("#tax-other-num");

    incNum.addEventListener("input", () => { incSlider.value = incNum.value; this.recalculateTax(); });
    incSlider.addEventListener("input", () => { incNum.value = incSlider.value; this.recalculateTax(); });
    salariedCheck.addEventListener("change", () => this.recalculateTax());
    [c80, d80, hra, other].forEach(el => el.addEventListener("input", () => this.recalculateTax()));

    mountEl.querySelectorAll(".fin-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        mountEl.querySelectorAll(".fin-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        incNum.value = chip.dataset.income;
        incSlider.value = chip.dataset.income;
        this.recalculateTax();
      });
    });
  }

  recalculateTax() {
    const income = parseFloat(document.getElementById("tax-income-num")?.value || 1250000);
    const isSalaried = document.getElementById("tax-salaried-check")?.checked ?? true;
    const c80 = parseFloat(document.getElementById("tax-80c-num")?.value || 0);
    const d80 = parseFloat(document.getElementById("tax-80d-num")?.value || 0);
    const hra = parseFloat(document.getElementById("tax-hra-num")?.value || 0);
    const other = parseFloat(document.getElementById("tax-other-num")?.value || 0);

    const res = IndianFinanceEngine.calculateIncomeTax({
      grossIncome: income,
      isSalaried,
      deductions80C: c80,
      deductions80D: d80,
      hraExemption: hra,
      otherDeductions: other
    });

    // Update New Regime
    document.getElementById("tax-new-std").textContent = IndianFinanceEngine.formatINR(res.newRegime.standardDeduction);
    document.getElementById("tax-new-taxable").textContent = IndianFinanceEngine.formatINR(res.newRegime.taxableIncome);
    document.getElementById("tax-new-gross").textContent = IndianFinanceEngine.formatINR(res.newRegime.grossTax);
    document.getElementById("tax-new-rebate").textContent = `-${IndianFinanceEngine.formatINR(res.newRegime.rebate87A)}`;
    document.getElementById("tax-new-cess").textContent = IndianFinanceEngine.formatINR(res.newRegime.cess);
    document.getElementById("tax-new-final").textContent = IndianFinanceEngine.formatINR(res.newRegime.totalTax);

    // Update Old Regime
    document.getElementById("tax-old-deductions").textContent = IndianFinanceEngine.formatINR(res.oldRegime.totalDeductions);
    document.getElementById("tax-old-taxable").textContent = IndianFinanceEngine.formatINR(res.oldRegime.taxableIncome);
    document.getElementById("tax-old-gross").textContent = IndianFinanceEngine.formatINR(res.oldRegime.grossTax);
    document.getElementById("tax-old-rebate").textContent = `-${IndianFinanceEngine.formatINR(res.oldRegime.rebate87A)}`;
    document.getElementById("tax-old-cess").textContent = IndianFinanceEngine.formatINR(res.oldRegime.cess);
    document.getElementById("tax-old-final").textContent = IndianFinanceEngine.formatINR(res.oldRegime.totalTax);

    // Winner Highlight
    const cardNew = document.getElementById("tax-card-new");
    const cardOld = document.getElementById("tax-card-old");
    const badgeNew = document.getElementById("tax-badge-new");
    const badgeOld = document.getElementById("tax-badge-old");
    const recText = document.getElementById("tax-recommendation-text");

    if (res.newRegime.totalTax <= res.oldRegime.totalTax) {
      cardNew.classList.add("recommended");
      cardOld.classList.remove("recommended");
      badgeNew.style.display = "block";
      badgeOld.style.display = "none";
      recText.innerHTML = `🎉 You save <strong>${IndianFinanceEngine.formatINR(res.taxSavings)}</strong> with the <strong>New Tax Regime</strong>!`;
    } else {
      cardOld.classList.add("recommended");
      cardNew.classList.remove("recommended");
      badgeOld.style.display = "block";
      badgeNew.style.display = "none";
      recText.innerHTML = `🎉 You save <strong>${IndianFinanceEngine.formatINR(res.taxSavings)}</strong> with the <strong>Old Tax Regime</strong>!`;
    }
  }

  // =========================================================================
  // 3. Home Loan / EMI & Amortization View
  // =========================================================================
  renderHomeLoan(mountEl) {
    mountEl.innerHTML = `
      <div class="financial-calc-grid">
        <div class="fin-inputs-panel">
          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Loan Amount (P)</span>
              <div class="fin-input-box-wrapper" style="width:160px;">
                <span class="fin-currency-prefix">₹</span>
                <input type="number" id="emi-principal-num" class="fin-number-input" value="5000000" step="100000">
              </div>
            </div>
            <input type="range" id="emi-principal-slider" class="fin-slider" value="5000000" min="500000" max="20000000" step="100000">
            <div class="fin-preset-chips">
              <button class="fin-chip" data-p="3000000">₹30 Lakh</button>
              <button class="fin-chip active" data-p="5000000">₹50 Lakh</button>
              <button class="fin-chip" data-p="7500000">₹75 Lakh</button>
              <button class="fin-chip" data-p="10000000">₹1 Crore</button>
            </div>
          </div>

          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Interest Rate (p.a.)</span>
              <div class="fin-input-box-wrapper">
                <input type="number" id="emi-rate-num" class="fin-number-input" value="8.50" step="0.05">
                <span class="fin-currency-prefix">%</span>
              </div>
            </div>
            <input type="range" id="emi-rate-slider" class="fin-slider" value="8.50" min="6.5" max="15.0" step="0.05">
            <div class="fin-preset-chips">
              <button class="fin-chip active" data-r="8.50">SBI / HDFC (8.50%)</button>
              <button class="fin-chip" data-r="9.00">Bank Typical (9.00%)</button>
              <button class="fin-chip" data-r="9.50">NBFC (9.50%)</button>
            </div>
          </div>

          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Tenure (Years)</span>
              <div class="fin-input-box-wrapper">
                <input type="number" id="emi-tenure-num" class="fin-number-input" value="20" min="1" max="30">
                <span class="fin-currency-prefix">Yr</span>
              </div>
            </div>
            <input type="range" id="emi-tenure-slider" class="fin-slider" value="20" min="1" max="30">
          </div>

          <div class="fin-input-group" style="background:var(--bg-subtle); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
            <div class="fin-input-header">
              <span class="fin-input-label" style="font-size:0.8rem;">Monthly Prepayment / Extra EMI</span>
              <div class="fin-input-box-wrapper" style="width:130px;">
                <span class="fin-currency-prefix">₹</span>
                <input type="number" id="emi-prepay-num" class="fin-number-input" value="0" step="1000">
              </div>
            </div>
            <span style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">
              Paying extra reduces total interest and cuts loan tenure dramatically.
            </span>
          </div>
        </div>

        <div class="fin-results-panel">
          <div class="fin-stat-card">
            <span class="fin-stat-label">Monthly EMI</span>
            <span class="fin-stat-value highlight-blue" id="emi-res-monthly">₹43,391</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">Principal Amount</span>
            <span class="fin-stat-value" id="emi-res-principal">₹50,00,000</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">Total Interest Payable</span>
            <span class="fin-stat-value" id="emi-res-interest">₹54,13,879</span>
          </div>
          <div class="fin-stat-card" style="border-bottom:none;">
            <span class="fin-stat-label">Total Amount Payable</span>
            <span class="fin-stat-value" id="emi-res-total">₹1,04,13,879</span>
          </div>

          <div class="fin-chart-container">
            <canvas id="emi-donut-canvas" class="fin-donut-canvas" width="180" height="180"></canvas>
            <div class="fin-chart-legend">
              <div class="fin-legend-item">
                <div class="fin-legend-color" style="background:#1e3a8a;"></div>
                <span>Principal</span>
              </div>
              <div class="fin-legend-item">
                <div class="fin-legend-color" style="background:#d97706;"></div>
                <span>Interest</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Amortization Schedule Table -->
      <div class="schedule-header-actions">
        <h4 class="schedule-title">Amortization Schedule (Year-by-Year)</h4>
        <button class="export-btn" id="emi-export-csv">📥 Export CSV</button>
      </div>
      <div class="schedule-table-wrapper">
        <table class="schedule-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Principal Paid</th>
              <th>Interest Paid</th>
              <th>Total Payment</th>
              <th>Balance Remaining</th>
            </tr>
          </thead>
          <tbody id="emi-schedule-body"></tbody>
        </table>
      </div>
    `;

    this.bindHomeLoanInputs(mountEl);
    this.recalculateHomeLoan();
  }

  bindHomeLoanInputs(mountEl) {
    const pNum = mountEl.querySelector("#emi-principal-num");
    const pSlider = mountEl.querySelector("#emi-principal-slider");
    const rNum = mountEl.querySelector("#emi-rate-num");
    const rSlider = mountEl.querySelector("#emi-rate-slider");
    const tNum = mountEl.querySelector("#emi-tenure-num");
    const tSlider = mountEl.querySelector("#emi-tenure-slider");
    const prepay = mountEl.querySelector("#emi-prepay-num");

    const syncPair = (n, s) => {
      n.addEventListener("input", () => { s.value = n.value; this.recalculateHomeLoan(); });
      s.addEventListener("input", () => { n.value = s.value; this.recalculateHomeLoan(); });
    };

    syncPair(pNum, pSlider);
    syncPair(rNum, rSlider);
    syncPair(tNum, tSlider);
    prepay.addEventListener("input", () => this.recalculateHomeLoan());

    mountEl.querySelectorAll(".fin-chip[data-p]").forEach(chip => {
      chip.addEventListener("click", () => {
        pNum.value = chip.dataset.p;
        pSlider.value = chip.dataset.p;
        this.recalculateHomeLoan();
      });
    });

    mountEl.querySelectorAll(".fin-chip[data-r]").forEach(chip => {
      chip.addEventListener("click", () => {
        rNum.value = chip.dataset.r;
        rSlider.value = chip.dataset.r;
        this.recalculateHomeLoan();
      });
    });

    mountEl.querySelector("#emi-export-csv").addEventListener("click", () => {
      this.exportEMICSV();
    });
  }

  recalculateHomeLoan() {
    const principal = parseFloat(document.getElementById("emi-principal-num")?.value || 5000000);
    const rate = parseFloat(document.getElementById("emi-rate-num")?.value || 8.5);
    const tenure = parseInt(document.getElementById("emi-tenure-num")?.value || 20);
    const prepay = parseFloat(document.getElementById("emi-prepay-num")?.value || 0);

    const data = IndianFinanceEngine.calculateHomeLoan({
      principal,
      annualInterestRate: rate,
      tenureYears: tenure,
      prepaymentMonthly: prepay
    });

    this.lastEMIData = data;

    document.getElementById("emi-res-monthly").textContent = IndianFinanceEngine.formatINR(data.monthlyEMI);
    document.getElementById("emi-res-principal").textContent = IndianFinanceEngine.formatINR(data.principal);
    document.getElementById("emi-res-interest").textContent = IndianFinanceEngine.formatINR(data.totalInterest);
    document.getElementById("emi-res-total").textContent = IndianFinanceEngine.formatINR(data.totalAmount);

    this.drawDonutChart("emi-donut-canvas", data.principal, data.totalInterest, "#1e3a8a", "#d97706");

    const tbody = document.getElementById("emi-schedule-body");
    if (tbody) {
      tbody.innerHTML = data.yearlySchedule.map(row => `
        <tr>
          <td>Year ${row.year}</td>
          <td>${IndianFinanceEngine.formatINR(row.principalPaid)}</td>
          <td>${IndianFinanceEngine.formatINR(row.interestPaid)}</td>
          <td><strong>${IndianFinanceEngine.formatINR(row.totalPayment)}</strong></td>
          <td>${IndianFinanceEngine.formatINR(row.remainingBalance)}</td>
        </tr>
      `).join("");
    }
  }

  exportEMICSV() {
    if (!this.lastEMIData) return;
    let csv = "Year,Principal Paid,Interest Paid,Total Payment,Balance Remaining\n";
    this.lastEMIData.yearlySchedule.forEach(r => {
      csv += `${r.year},${r.principalPaid},${r.interestPaid},${r.totalPayment},${r.remainingBalance}\n`;
    });
    this.downloadCSV(csv, "home_loan_amortization_schedule.csv");
  }

  // =========================================================================
  // 4. Indian Gold & Jewellery View
  // =========================================================================
  renderGold(mountEl) {
    mountEl.innerHTML = `
      <div class="financial-calc-grid">
        <div class="fin-inputs-panel">
          <div class="fin-input-group">
            <span class="fin-input-label">Purity (Karat / Hallmark)</span>
            <div class="fin-preset-chips">
              <button class="fin-chip" data-k="24">24K (99.9% Bullion)</button>
              <button class="fin-chip active" data-k="22">22K (91.6% BIS 916)</button>
              <button class="fin-chip" data-k="18">18K (75.0% Jewellery)</button>
            </div>
          </div>

          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Weight of Jewellery (Grams)</span>
              <div class="fin-input-box-wrapper">
                <input type="number" id="gold-weight-num" class="fin-number-input" value="10.0" step="0.5">
                <span class="fin-currency-prefix">g</span>
              </div>
            </div>
            <input type="range" id="gold-weight-slider" class="fin-slider" value="10.0" min="1" max="100" step="0.5">
          </div>

          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Base 24K Gold Rate (₹ / Gram)</span>
              <div class="fin-input-box-wrapper" style="width:150px;">
                <span class="fin-currency-prefix">₹</span>
                <input type="number" id="gold-rate-num" class="fin-number-input" value="7500" step="50">
              </div>
            </div>
            <input type="range" id="gold-rate-slider" class="fin-slider" value="7500" min="5000" max="12000" step="50">
          </div>

          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Making Charges (%)</span>
              <div class="fin-input-box-wrapper">
                <input type="number" id="gold-making-num" class="fin-number-input" value="10" step="1">
                <span class="fin-currency-prefix">%</span>
              </div>
            </div>
            <input type="range" id="gold-making-slider" class="fin-slider" value="10" min="3" max="30" step="1">
          </div>

          <div class="fin-input-group">
            <label style="font-size:0.875rem; font-weight:600; display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="gold-hallmark-check" checked style="width:16px; height:16px;">
              <span>Include BIS Hallmarking Fee (₹45 statutory)</span>
            </label>
          </div>
        </div>

        <div class="fin-results-panel">
          <div class="fin-stat-card">
            <span class="fin-stat-label">Net Gold Value</span>
            <span class="fin-stat-value" id="gold-res-value">₹68,750</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">Making Charges</span>
            <span class="fin-stat-value" id="gold-res-making">₹6,875</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">BIS Hallmark Fee</span>
            <span class="fin-stat-value" id="gold-res-hallmark">₹45</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">GST on Jewellery (3%)</span>
            <span class="fin-stat-value highlight-green" id="gold-res-gst">₹2,270</span>
          </div>
          <div class="fin-stat-card" style="border-bottom:none;">
            <span class="fin-stat-label">Total Billing Amount</span>
            <span class="fin-stat-value highlight-blue" id="gold-res-total">₹77,940</span>
          </div>
        </div>
      </div>
    `;

    this.bindGoldInputs(mountEl);
    this.recalculateGold();
  }

  bindGoldInputs(mountEl) {
    let karat = 22;
    const wtNum = mountEl.querySelector("#gold-weight-num");
    const wtSlider = mountEl.querySelector("#gold-weight-slider");
    const rateNum = mountEl.querySelector("#gold-rate-num");
    const rateSlider = mountEl.querySelector("#gold-rate-slider");
    const makeNum = mountEl.querySelector("#gold-making-num");
    const makeSlider = mountEl.querySelector("#gold-making-slider");
    const hallCheck = mountEl.querySelector("#gold-hallmark-check");

    const syncPair = (n, s) => {
      n.addEventListener("input", () => { s.value = n.value; this.recalculateGold(karat); });
      s.addEventListener("input", () => { n.value = s.value; this.recalculateGold(karat); });
    };

    syncPair(wtNum, wtSlider);
    syncPair(rateNum, rateSlider);
    syncPair(makeNum, makeSlider);
    hallCheck.addEventListener("change", () => this.recalculateGold(karat));

    mountEl.querySelectorAll(".fin-chip[data-k]").forEach(chip => {
      chip.addEventListener("click", () => {
        mountEl.querySelectorAll(".fin-chip[data-k]").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        karat = parseInt(chip.dataset.k);
        this.recalculateGold(karat);
      });
    });
  }

  recalculateGold(karat = 22) {
    const wt = parseFloat(document.getElementById("gold-weight-num")?.value || 10);
    const rate = parseFloat(document.getElementById("gold-rate-num")?.value || 7500);
    const making = parseFloat(document.getElementById("gold-making-num")?.value || 10);
    const hallmark = document.getElementById("gold-hallmark-check")?.checked ?? true;

    const res = IndianFinanceEngine.calculateGoldJewellery({
      weightGrams: wt,
      base24KRatePerGram: rate,
      purityKarat: karat,
      makingChargesType: "percent",
      makingChargesValue: making,
      includeHallmark: hallmark
    });

    document.getElementById("gold-res-value").textContent = IndianFinanceEngine.formatINR(res.rawGoldValue);
    document.getElementById("gold-res-making").textContent = IndianFinanceEngine.formatINR(res.makingCharges);
    document.getElementById("gold-res-hallmark").textContent = IndianFinanceEngine.formatINR(res.hallmarkFee);
    document.getElementById("gold-res-gst").textContent = IndianFinanceEngine.formatINR(res.gstAmount);
    document.getElementById("gold-res-total").textContent = IndianFinanceEngine.formatINR(res.finalBillingAmount);
  }

  // =========================================================================
  // 5. PPF View
  // =========================================================================
  renderPPF(mountEl) {
    mountEl.innerHTML = `
      <div class="financial-calc-grid">
        <div class="fin-inputs-panel">
          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Yearly Investment (Max ₹1.5L / FY)</span>
              <div class="fin-input-box-wrapper" style="width:160px;">
                <span class="fin-currency-prefix">₹</span>
                <input type="number" id="ppf-deposit-num" class="fin-number-input" value="150000" max="150000" step="5000">
              </div>
            </div>
            <input type="range" id="ppf-deposit-slider" class="fin-slider" value="150000" min="500" max="150000" step="2500">
          </div>
          <div class="fin-input-group">
            <span class="fin-input-label">Statutory Rate of Interest</span>
            <strong style="font-family:var(--font-mono); font-size:1.1rem; color:var(--text-primary);">7.10% p.a. (Govt of India Notified)</strong>
          </div>
          <div class="fin-input-group">
            <span class="fin-input-label">Statutory Lock-in Period</span>
            <strong style="font-family:var(--font-mono); font-size:1.1rem; color:var(--text-primary);">15 Years (Extendable in 5-yr blocks)</strong>
          </div>
        </div>

        <div class="fin-results-panel">
          <div class="fin-stat-card">
            <span class="fin-stat-label">Total Amount Invested</span>
            <span class="fin-stat-value" id="ppf-res-invested">₹22,50,000</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">Total Interest Earned (Tax-Free EEE)</span>
            <span class="fin-stat-value highlight-green" id="ppf-res-interest">₹18,18,209</span>
          </div>
          <div class="fin-stat-card" style="border-bottom:none;">
            <span class="fin-stat-label">Maturity Corpus (15 Years)</span>
            <span class="fin-stat-value highlight-blue" id="ppf-res-total">₹40,68,209</span>
          </div>
        </div>
      </div>
    `;

    const depNum = mountEl.querySelector("#ppf-deposit-num");
    const depSlider = mountEl.querySelector("#ppf-deposit-slider");
    depNum.addEventListener("input", () => { depSlider.value = depNum.value; this.recalculatePPF(); });
    depSlider.addEventListener("input", () => { depNum.value = depSlider.value; this.recalculatePPF(); });
    this.recalculatePPF();
  }

  recalculatePPF() {
    const dep = parseFloat(document.getElementById("ppf-deposit-num")?.value || 150000);
    const res = IndianFinanceEngine.calculatePPF({ yearlyDeposit: dep, annualInterestRate: 7.1, tenureYears: 15 });
    document.getElementById("ppf-res-invested").textContent = IndianFinanceEngine.formatINR(res.totalInvested);
    document.getElementById("ppf-res-interest").textContent = IndianFinanceEngine.formatINR(res.totalInterest);
    document.getElementById("ppf-res-total").textContent = IndianFinanceEngine.formatINR(res.maturityAmount);
  }

  // =========================================================================
  // 6. SSY View
  // =========================================================================
  renderSSY(mountEl) {
    mountEl.innerHTML = `
      <div class="financial-calc-grid">
        <div class="fin-inputs-panel">
          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Yearly Deposit (Max ₹1.5L / FY)</span>
              <div class="fin-input-box-wrapper" style="width:160px;">
                <span class="fin-currency-prefix">₹</span>
                <input type="number" id="ssy-deposit-num" class="fin-number-input" value="150000" max="150000" step="5000">
              </div>
            </div>
            <input type="range" id="ssy-deposit-slider" class="fin-slider" value="150000" min="250" max="150000" step="2500">
          </div>
          <div class="fin-input-group">
            <span class="fin-input-label">Statutory Rate of Interest</span>
            <strong style="font-family:var(--font-mono); font-size:1.1rem; color:var(--text-primary);">8.20% p.a. (Govt of India Notified)</strong>
          </div>
          <div class="fin-input-group">
            <span class="fin-input-label">Tenure</span>
            <strong style="font-family:var(--font-mono); font-size:0.95rem; color:var(--text-primary);">15 Years Deposit | 21 Years Maturity</strong>
          </div>
        </div>

        <div class="fin-results-panel">
          <div class="fin-stat-card">
            <span class="fin-stat-label">Total Amount Deposited</span>
            <span class="fin-stat-value" id="ssy-res-invested">₹22,50,000</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">Total Interest (Tax-Free)</span>
            <span class="fin-stat-value highlight-green" id="ssy-res-interest">₹46,77,578</span>
          </div>
          <div class="fin-stat-card" style="border-bottom:none;">
            <span class="fin-stat-label">Maturity Corpus (21 Years)</span>
            <span class="fin-stat-value highlight-blue" id="ssy-res-total">₹69,27,578</span>
          </div>
        </div>
      </div>
    `;

    const depNum = mountEl.querySelector("#ssy-deposit-num");
    const depSlider = mountEl.querySelector("#ssy-deposit-slider");
    depNum.addEventListener("input", () => { depSlider.value = depNum.value; this.recalculateSSY(); });
    depSlider.addEventListener("input", () => { depNum.value = depSlider.value; this.recalculateSSY(); });
    this.recalculateSSY();
  }

  recalculateSSY() {
    const dep = parseFloat(document.getElementById("ssy-deposit-num")?.value || 150000);
    const res = IndianFinanceEngine.calculateSSY({ yearlyDeposit: dep, annualInterestRate: 8.2 });
    document.getElementById("ssy-res-invested").textContent = IndianFinanceEngine.formatINR(res.totalInvested);
    document.getElementById("ssy-res-interest").textContent = IndianFinanceEngine.formatINR(res.totalInterest);
    document.getElementById("ssy-res-total").textContent = IndianFinanceEngine.formatINR(res.maturityAmount);
  }

  // =========================================================================
  // 7. Fixed Deposit (FD) View
  // =========================================================================
  renderFD(mountEl) {
    mountEl.innerHTML = `
      <div class="financial-calc-grid">
        <div class="fin-inputs-panel">
          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Total Investment Amount (P)</span>
              <div class="fin-input-box-wrapper" style="width:160px;">
                <span class="fin-currency-prefix">₹</span>
                <input type="number" id="fd-amount-num" class="fin-number-input" value="100000" step="10000">
              </div>
            </div>
            <input type="range" id="fd-amount-slider" class="fin-slider" value="100000" min="10000" max="2000000" step="10000">
          </div>
          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Interest Rate (p.a.)</span>
              <div class="fin-input-box-wrapper">
                <input type="number" id="fd-rate-num" class="fin-number-input" value="7.00" step="0.1">
                <span class="fin-currency-prefix">%</span>
              </div>
            </div>
            <input type="range" id="fd-rate-slider" class="fin-slider" value="7.00" min="3.0" max="10.0" step="0.1">
          </div>
          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Tenure (Years)</span>
              <div class="fin-input-box-wrapper">
                <input type="number" id="fd-tenure-num" class="fin-number-input" value="5" min="1" max="10">
                <span class="fin-currency-prefix">Yr</span>
              </div>
            </div>
            <input type="range" id="fd-tenure-slider" class="fin-slider" value="5" min="1" max="10">
          </div>
        </div>

        <div class="fin-results-panel">
          <div class="fin-stat-card">
            <span class="fin-stat-label">Principal Deposit</span>
            <span class="fin-stat-value" id="fd-res-principal">₹1,00,000</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">Total Interest (Quarterly Compounded)</span>
            <span class="fin-stat-value highlight-green" id="fd-res-interest">₹41,478</span>
          </div>
          <div class="fin-stat-card" style="border-bottom:none;">
            <span class="fin-stat-label">Maturity Value</span>
            <span class="fin-stat-value highlight-blue" id="fd-res-total">₹1,41,478</span>
          </div>
        </div>
      </div>
    `;

    const aNum = mountEl.querySelector("#fd-amount-num");
    const aSlider = mountEl.querySelector("#fd-amount-slider");
    const rNum = mountEl.querySelector("#fd-rate-num");
    const rSlider = mountEl.querySelector("#fd-rate-slider");
    const tNum = mountEl.querySelector("#fd-tenure-num");
    const tSlider = mountEl.querySelector("#fd-tenure-slider");

    aNum.addEventListener("input", () => { aSlider.value = aNum.value; this.recalculateFD(); });
    aSlider.addEventListener("input", () => { aNum.value = aSlider.value; this.recalculateFD(); });
    rNum.addEventListener("input", () => { rSlider.value = rNum.value; this.recalculateFD(); });
    rSlider.addEventListener("input", () => { rNum.value = rSlider.value; this.recalculateFD(); });
    tNum.addEventListener("input", () => { tSlider.value = tNum.value; this.recalculateFD(); });
    tSlider.addEventListener("input", () => { tNum.value = tSlider.value; this.recalculateFD(); });

    this.recalculateFD();
  }

  recalculateFD() {
    const p = parseFloat(document.getElementById("fd-amount-num")?.value || 100000);
    const r = parseFloat(document.getElementById("fd-rate-num")?.value || 7.0);
    const t = parseFloat(document.getElementById("fd-tenure-num")?.value || 5);

    const res = IndianFinanceEngine.calculateFD({ principal: p, interestRate: r, tenureYears: t });
    document.getElementById("fd-res-principal").textContent = IndianFinanceEngine.formatINR(res.principal);
    document.getElementById("fd-res-interest").textContent = IndianFinanceEngine.formatINR(res.totalInterest);
    document.getElementById("fd-res-total").textContent = IndianFinanceEngine.formatINR(res.maturityAmount);
  }

  // =========================================================================
  // 8. GST Calculator View
  // =========================================================================
  renderGST(mountEl) {
    mountEl.innerHTML = `
      <div class="financial-calc-grid">
        <div class="fin-inputs-panel">
          <div class="fin-input-group">
            <span class="fin-input-label">GST Rate Slab</span>
            <div class="fin-preset-chips">
              <button class="fin-chip" data-g="5">5% (Essentials)</button>
              <button class="fin-chip" data-g="12">12% (Standard)</button>
              <button class="fin-chip active" data-g="18">18% (Services/General)</button>
              <button class="fin-chip" data-g="28">28% (Luxury)</button>
            </div>
          </div>
          <div class="fin-input-group">
            <div class="fin-input-header">
              <span class="fin-input-label">Amount</span>
              <div class="fin-input-box-wrapper" style="width:160px;">
                <span class="fin-currency-prefix">₹</span>
                <input type="number" id="gst-amount-num" class="fin-number-input" value="10000" step="500">
              </div>
            </div>
          </div>
          <div class="fin-input-group">
            <span class="fin-input-label">Calculation Mode</span>
            <div style="display:flex; gap:1rem; font-size:0.875rem; font-weight:600;">
              <label style="cursor:pointer;"><input type="radio" name="gst-mode" value="exclusive" checked> Add GST (Exclusive)</label>
              <label style="cursor:pointer;"><input type="radio" name="gst-mode" value="inclusive"> Remove GST (Inclusive)</label>
            </div>
          </div>
        </div>

        <div class="fin-results-panel">
          <div class="fin-stat-card">
            <span class="fin-stat-label">Net Base Amount</span>
            <span class="fin-stat-value" id="gst-res-base">₹10,000</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">CGST (Central Tax)</span>
            <span class="fin-stat-value" id="gst-res-cgst">₹900</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">SGST (State Tax)</span>
            <span class="fin-stat-value" id="gst-res-sgst">₹900</span>
          </div>
          <div class="fin-stat-card">
            <span class="fin-stat-label">Total GST</span>
            <span class="fin-stat-value highlight-green" id="gst-res-gst">₹1,800</span>
          </div>
          <div class="fin-stat-card" style="border-bottom:none;">
            <span class="fin-stat-label">Gross Final Amount</span>
            <span class="fin-stat-value highlight-blue" id="gst-res-total">₹11,800</span>
          </div>
        </div>
      </div>
    `;

    let gstRate = 18;
    const amtInput = mountEl.querySelector("#gst-amount-num");
    const modeRadios = mountEl.querySelectorAll("input[name='gst-mode']");

    amtInput.addEventListener("input", () => this.recalculateGST(gstRate));
    modeRadios.forEach(r => r.addEventListener("change", () => this.recalculateGST(gstRate)));

    mountEl.querySelectorAll(".fin-chip[data-g]").forEach(chip => {
      chip.addEventListener("click", () => {
        mountEl.querySelectorAll(".fin-chip[data-g]").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        gstRate = parseFloat(chip.dataset.g);
        this.recalculateGST(gstRate);
      });
    });

    this.recalculateGST(gstRate);
  }

  recalculateGST(gstRate = 18) {
    const amt = parseFloat(document.getElementById("gst-amount-num")?.value || 10000);
    const mode = document.querySelector("input[name='gst-mode']:checked")?.value || "exclusive";

    const res = IndianFinanceEngine.calculateGST({ amount: amt, gstRatePercent: gstRate, type: mode });
    document.getElementById("gst-res-base").textContent = IndianFinanceEngine.formatINR(res.baseAmount);
    document.getElementById("gst-res-cgst").textContent = IndianFinanceEngine.formatINR(res.cgst);
    document.getElementById("gst-res-sgst").textContent = IndianFinanceEngine.formatINR(res.sgst);
    document.getElementById("gst-res-gst").textContent = IndianFinanceEngine.formatINR(res.gstAmount);
    document.getElementById("gst-res-total").textContent = IndianFinanceEngine.formatINR(res.totalAmount);
  }

  // =========================================================================
  // 9. Indian Land Measurement Units View
  // =========================================================================
  renderLand(mountEl) {
    mountEl.innerHTML = `
      <div class="financial-calc-grid">
        <div class="fin-inputs-panel">
          <div class="fin-input-group">
            <span class="fin-input-label">Convert Land Area Value</span>
            <input type="number" id="land-val-input" class="fin-number-input" value="100" style="background:var(--bg-subtle); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.5rem; text-align:left; font-size:1.25rem;">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="fin-input-group">
              <span class="fin-input-label">From Unit</span>
              <select id="land-from-select" style="background:var(--bg-subtle); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.5rem; font-family:var(--font-sans); font-size:0.9rem; font-weight:600;">
                <option value="gaj" selected>Gaj (Square Yard)</option>
                <option value="guntha">Guntha (121 Gaj)</option>
                <option value="acre">Acre (4,840 Gaj)</option>
                <option value="bigha">Bigha (Standard 3,025 Gaj)</option>
                <option value="cent">Cent (48.4 Gaj)</option>
                <option value="sqft">Square Feet</option>
              </select>
            </div>
            <div class="fin-input-group">
              <span class="fin-input-label">To Unit</span>
              <select id="land-to-select" style="background:var(--bg-subtle); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.5rem; font-family:var(--font-sans); font-size:0.9rem; font-weight:600;">
                <option value="sqft" selected>Square Feet</option>
                <option value="gaj">Gaj (Square Yard)</option>
                <option value="guntha">Guntha</option>
                <option value="acre">Acre</option>
                <option value="bigha">Bigha</option>
                <option value="cent">Cent</option>
              </select>
            </div>
          </div>
        </div>

        <div class="fin-results-panel">
          <div class="fin-stat-card" style="border-bottom:none; flex-direction:column; align-items:flex-start; gap:0.5rem;">
            <span class="fin-stat-label">Converted Land Area Equivalent</span>
            <div class="fin-stat-value highlight-blue" id="land-res-val" style="font-size:1.75rem;">900 Sq Ft</div>
            <span style="font-size:0.75rem; color:var(--text-muted);" id="land-res-note">1 Gaj = 9 Square Feet</span>
          </div>
        </div>
      </div>
    `;

    const valInput = mountEl.querySelector("#land-val-input");
    const fromSel = mountEl.querySelector("#land-from-select");
    const toSel = mountEl.querySelector("#land-to-select");

    const recompute = () => {
      const v = parseFloat(valInput.value || 0);
      const res = IndianFinanceEngine.convertLandArea(v, fromSel.value, toSel.value);
      const toName = toSel.options?.[toSel.selectedIndex]?.text || toSel.value || "Sq Ft";
      const resValEl = document.getElementById("land-res-val");
      if (resValEl) resValEl.textContent = `${res.toLocaleString('en-IN', { maximumFractionDigits: 4 })} ${toName}`;
    };

    valInput.addEventListener("input", recompute);
    fromSel.addEventListener("change", recompute);
    toSel.addEventListener("change", recompute);
    recompute();
  }

  // Pure Canvas Donut Visualizer
  drawDonutChart(canvasId, val1, val2, color1, color2) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const total = val1 + val2;

    ctx.clearRect(0, 0, w, h);

    if (total <= 0) return;

    const angle1 = (val1 / total) * 2 * Math.PI;
    const cx = w / 2;
    const cy = h / 2;
    const outerR = (w / 2) - 8;
    const innerR = outerR * 0.65;

    // Segment 1
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, -Math.PI / 2, -Math.PI / 2 + angle1, false);
    ctx.arc(cx, cy, innerR, -Math.PI / 2 + angle1, -Math.PI / 2, true);
    ctx.closePath();
    ctx.fillStyle = color1;
    ctx.fill();

    // Segment 2
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, -Math.PI / 2 + angle1, 1.5 * Math.PI, false);
    ctx.arc(cx, cy, innerR, 1.5 * Math.PI, -Math.PI / 2 + angle1, true);
    ctx.closePath();
    ctx.fillStyle = color2;
    ctx.fill();
  }

  downloadCSV(content, filename) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
