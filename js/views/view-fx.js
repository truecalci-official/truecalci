/**
 * RemoteParity - View 4: Global Invoicing & FX Net Receipt Calculator
 */

import { FXInvoicingEngine } from "../engines/fx-engine.js";

export class ViewFX {
  constructor(mountEl) {
    this.mountEl = mountEl;
    this.state = {
      invoiceUsd: 10000,
      targetCurrency: "EUR"
    };
  }

  render() {
    this.mountEl.innerHTML = `
      <div class="rp-view-container">
        <!-- View Header -->
        <div class="rp-view-header">
          <h2 class="rp-view-title">Global Invoicing & Cross-Border FX Calculator</h2>
          <p class="rp-view-sub">Deconstruct hidden currency exchange markups, intermediary correspondent SWIFT bank deductions, and platform fees across global contractor payout rails.</p>
        </div>

        <!-- Presets -->
        <div class="rp-presets">
          <span class="rp-preset-title">Invoice Amounts:</span>
          <button class="rp-preset-btn" id="fx-preset-5k" type="button">$5,000 USD</button>
          <button class="rp-preset-btn" id="fx-preset-10k" type="button">$10,000 USD</button>
          <button class="rp-preset-btn" id="fx-preset-25k" type="button">$25,000 USD</button>
        </div>

        <!-- Hero Savings Banner -->
        <div class="rp-hero-verdict win-1099" id="fx-hero-banner">
          <div class="rp-hero-pill pill-emerald" id="fx-hero-pill">Optimal Settlement Rail</div>
          <h3 class="rp-hero-headline" id="fx-hero-headline">Loading FX rails...</h3>
          <p class="rp-hero-sub" id="fx-hero-sub">Calculating mid-market exchange benchmarks and retail markup spreads...</p>

          <div class="rp-hero-metrics">
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Savings Per Invoice</span>
              <span class="rp-hero-stat-val emerald" id="fx-stat-single-savings">+$0</span>
              <span class="rp-hero-stat-hint">Wise vs. PayPal</span>
            </div>
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">Annual Fee Leak Avoided</span>
              <span class="rp-hero-stat-val sky" id="fx-stat-annual-savings">+$0 / yr</span>
              <span class="rp-hero-stat-hint">Based on 12 monthly invoices</span>
            </div>
            <div class="rp-hero-stat-item">
              <span class="rp-hero-stat-label">True Mid-Market Benchmark</span>
              <span class="rp-hero-stat-val" id="fx-stat-midmarket">0.00</span>
              <span class="rp-hero-stat-hint">Zero-markup exchange rate</span>
            </div>
            <div class="rp-hero-stat-item" style="justify-content: flex-end;">
              <button class="rp-btn-action" id="fx-btn-copy-summary" type="button" aria-label="Copy FX Summary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>Copy Summary</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Inputs Card -->
        <div class="rp-card">
          <div class="rp-card-header">
            <div class="rp-card-title-group">
              <span class="rp-card-icon">🌍</span>
              <div>
                <h3 class="rp-card-title">Invoice & Destination Currency</h3>
                <span class="rp-hint">Select the invoiced USD amount and your local receiving bank currency</span>
              </div>
            </div>
            <span class="rp-card-badge">Configuration</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div class="rp-form-group">
              <div class="rp-label-row">
                <label class="rp-label" for="fx-invoice-num">Client Invoice Amount (USD)</label>
                <span class="rp-hint" id="fx-invoice-display">$10,000 USD</span>
              </div>
              <div class="rp-input-wrapper">
                <span class="rp-input-prefix">$</span>
                <input class="rp-input" id="fx-invoice-num" type="number" step="500" min="500" max="250000" value="${this.state.invoiceUsd}" aria-label="Invoice Amount in USD" />
              </div>
              <input class="rp-slider" id="fx-invoice-slider" type="range" min="1000" max="50000" step="500" value="${this.state.invoiceUsd}" aria-label="Invoice Amount Slider" />
            </div>

            <div class="rp-form-group">
              <label class="rp-label" for="fx-currency-select">Destination Receiving Currency</label>
              <select class="rp-select" id="fx-currency-select" aria-label="Destination Receiving Currency">
                <option value="EUR" selected>EUR (€) - European Union</option>
                <option value="GBP">GBP (£) - United Kingdom</option>
                <option value="CAD">CAD (CA$) - Canada</option>
                <option value="AUD">AUD (AU$) - Australia</option>
                <option value="INR">INR (₹) - India</option>
                <option value="SGD">SGD (SG$) - Singapore</option>
                <option value="BRL">BRL (R$) - Brazil</option>
                <option value="MXN">MXN (Mex$) - Mexico</option>
                <option value="PHP">PHP (₱) - Philippines</option>
              </select>
              <span class="rp-hint">Calculates exact local cash deposited into your local checking account.</span>
            </div>
          </div>
        </div>

        <!-- Comparison Table Card -->
        <div class="rp-card">
          <div class="rp-card-header">
            <div class="rp-card-title-group">
              <span class="rp-card-icon">⚡</span>
              <div>
                <h3 class="rp-card-title">Real Landed Net Cash Across Payout Rails</h3>
                <span class="rp-hint">Sorted from highest spendable cash to lowest</span>
              </div>
            </div>
            <span class="rp-card-badge" style="background: var(--accent-emerald-bg); color: var(--accent-emerald); border-color: rgba(5, 150, 105, 0.25);">Ranked</span>
          </div>

          <div class="rp-table-wrap">
            <table class="rp-table" aria-label="Payout rail comparison table">
              <thead>
                <tr>
                  <th>Payout Rail</th>
                  <th>Fee & Spread Drag</th>
                  <th>Loss in USD</th>
                  <th>Actual Net Received</th>
                </tr>
              </thead>
              <tbody id="fx-table-body">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
    this.recalculate();
  }

  bindEvents() {
    const invNum = document.getElementById("fx-invoice-num");
    const invSlider = document.getElementById("fx-invoice-slider");
    if (invNum && invSlider) {
      invNum.addEventListener("input", () => {
        this.state.invoiceUsd = Number(invNum.value);
        invSlider.value = invNum.value;
        this.recalculate();
      });
      invSlider.addEventListener("input", () => {
        this.state.invoiceUsd = Number(invSlider.value);
        invNum.value = invSlider.value;
        this.recalculate();
      });
    }

    document.getElementById("fx-currency-select")?.addEventListener("change", (e) => {
      this.state.targetCurrency = e.target.value;
      this.recalculate();
    });

    // Presets
    document.getElementById("fx-preset-5k")?.addEventListener("click", () => {
      this.setPreset(5000);
    });
    document.getElementById("fx-preset-10k")?.addEventListener("click", () => {
      this.setPreset(10000);
    });
    document.getElementById("fx-preset-25k")?.addEventListener("click", () => {
      this.setPreset(25000);
    });

    // Copy Summary
    document.getElementById("fx-btn-copy-summary")?.addEventListener("click", () => {
      this.copySummary();
    });
  }

  setPreset(usd) {
    this.state.invoiceUsd = usd;
    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = v;
    };
    setVal("fx-invoice-num", usd);
    setVal("fx-invoice-slider", usd);
    this.recalculate();
  }

  recalculate() {
    const result = FXInvoicingEngine.calculate({
      invoiceUsd: this.state.invoiceUsd,
      targetCurrency: this.state.targetCurrency
    });

    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setText("fx-invoice-display", `$${this.state.invoiceUsd.toLocaleString()} USD`);
    setText("fx-hero-headline", result.headline);
    setText("fx-hero-sub", `On a $${this.state.invoiceUsd.toLocaleString()} USD invoice, you receive ${result.optimalRail.currencySymbol}${result.optimalRail.landedLocalAmount.toLocaleString()} via ${result.optimalRail.name}, compared to just ${result.worstRail.currencySymbol}${result.worstRail.landedLocalAmount.toLocaleString()} via ${result.worstRail.name}.`);

    setText("fx-stat-single-savings", `+$${result.singleInvoiceSavingsUsd.toLocaleString()}`);
    setText("fx-stat-annual-savings", `+$${result.annualSavingsUsd.toLocaleString()} / yr`);
    setText("fx-stat-midmarket", `1 USD = ${result.midMarketBenchmarkRate} ${result.targetCurrency.code}`);

    // Populate Table
    const tbody = document.getElementById("fx-table-body");
    if (tbody) {
      tbody.innerHTML = result.rails.map((rail, idx) => {
        const isOptimal = idx === 0;
        return `
          <tr class="${isOptimal ? "optimal-row" : ""}">
            <td>
              <div>
                <strong>${rail.name}</strong> ${isOptimal ? '<span style="color:var(--accent-emerald); font-size:0.75rem; margin-left:0.4rem;">★ BEST</span>' : ""}
                <div style="font-size:0.75rem; color:var(--text-muted);">${rail.description}</div>
              </div>
            </td>
            <td>
              <span style="font-family:var(--font-mono); font-weight:700; ${isOptimal ? "color:var(--accent-emerald);" : "color:var(--accent-rose);"}">
                ${rail.totalDragPercent}%
              </span>
            </td>
            <td style="font-family:var(--font-mono); color:var(--accent-rose);">
              -$${rail.totalLossUsd.toLocaleString()}
            </td>
            <td style="font-family:var(--font-mono); font-size:1.05rem; font-weight:800; ${isOptimal ? "color:var(--accent-emerald);" : "color:var(--text-heading);"}">
              ${rail.currencySymbol}${rail.landedLocalAmount.toLocaleString()}
            </td>
          </tr>
        `;
      }).join("");
    }

    this.lastResult = result;
  }

  copySummary() {
    if (!this.lastResult) return;
    const r = this.lastResult;
    const text = `🌍 RemoteParity FX Invoicing Breakdown:
• Invoiced USD Amount: $${r.invoiceUsd.toLocaleString()}
• Target Currency: ${r.targetCurrency.code} (Mid-market rate: 1 USD = ${r.midMarketBenchmarkRate})
• Best Rail (${r.optimalRail.name}): ${r.optimalRail.currencySymbol}${r.optimalRail.landedLocalAmount.toLocaleString()} landed (Fee Drag: ${r.optimalRail.totalDragPercent}%)
• Worst Rail (${r.worstRail.name}): ${r.worstRail.currencySymbol}${r.worstRail.landedLocalAmount.toLocaleString()} landed (Fee Drag: ${r.worstRail.totalDragPercent}%)
• Cash Saved Per Invoice: +$${r.singleInvoiceSavingsUsd.toLocaleString()} USD (+${r.optimalRail.currencySymbol}${(r.optimalRail.landedLocalAmount - r.worstRail.landedLocalAmount).toFixed(2)})
• Annualized Savings: +$${r.annualSavingsUsd.toLocaleString()} USD/year!
Calculated via RemoteParity (https://remoteparity.com) • @KNVK`;

    navigator.clipboard?.writeText(text).then(() => {
      const btn = document.getElementById("fx-btn-copy-summary");
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = `<span>Copied to Clipboard!</span>`;
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      }
    });
  }
}
