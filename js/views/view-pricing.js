/**
 * TrueCalci Dedicated Interactive Pricing & SLA View
 * Zero-Noise, Highly-Converting Glassmorphic Design
 * Powered by Dodo Payments (Merchant of Record) with Global Cards & India UPI AutoPay
 */

export class ViewPricing {
  constructor(containerEl, onNavigate) {
    this.containerEl = containerEl;
    this.onNavigate = onNavigate || ((t) => window.location.hash = '#' + t);
    
    this.currency = localStorage.getItem("calc_region") === "india" ? "inr" : "usd";
    this.billingCycle = "monthly"; // "monthly" | "annual"
    this.sliderCalls = 25000;
    
    // Check current tier
    const user = JSON.parse(localStorage.getItem("tc_dev_user") || 'null');
    this.activeTier = user?.tierId || localStorage.getItem("tc_active_tier") || "free";
  }

  render() {
    const isIndia = this.currency === "inr";
    const symbol = isIndia ? "₹" : "$";
    const isAnnual = this.billingCycle === "annual";

    // Pricing rates (Aligned to SaaS best practices with clean 20% annual discount)
    // Monthly: Starter $5 (₹399), Pro $15 (₹1,199)
    // Annual (-20%): Starter $4/mo billed $48/yr (₹319/mo billed ₹3,828/yr), Pro $12/mo billed $144/yr (₹959/mo billed ₹11,508/yr)
    const starterPrice = isAnnual 
      ? (isIndia ? 319 : 4) 
      : (isIndia ? 399 : 5);
    const starterBilledText = isAnnual 
      ? (isIndia ? "billed ₹3,828/yr (-20%)" : "billed $48/yr (-20%)") 
      : "billed monthly";

    const proPrice = isAnnual 
      ? (isIndia ? 959 : 12) 
      : (isIndia ? 1199 : 15);
    const proBilledText = isAnnual 
      ? (isIndia ? "billed ₹11,508/yr (-20%)" : "billed $144/yr (-20%)") 
      : "billed monthly";

    const meteredBase = isAnnual 
      ? (isIndia ? 959 : 12) 
      : (isIndia ? 1199 : 15);
    
    // Upfront allowance vs monthly allowance copy
    const starterCallsText = isAnnual 
      ? "30,000 calls / year upfront" 
      : "2,500 calls / month";
    const proCallsText = isAnnual 
      ? "180,000 calls / year upfront" 
      : "15,000 calls / month";
    
    // Metered calculation ($1.00 / 1,000 extra calls; ₹80 / 1,000 in India)
    const extraCalls = Math.max(0, this.sliderCalls - 10000);
    const overageCost = isIndia 
      ? (extraCalls / 1000) * 80 
      : (extraCalls / 1000) * 1.00;
    const totalMeteredEstimate = meteredBase + overageCost;

    this.containerEl.innerHTML = `
      <div class="pricing-view-root" style="max-width: 1280px; margin: 0 auto; padding: 24px 16px 80px;">
        
        <!-- Header & Controls -->
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; background: var(--accent-light); border: 1px solid var(--accent-border); color: var(--accent-primary); font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Enterprise Compute • Instant Edge Activation
          </div>
          <h1 style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; margin: 0 0 12px;">
            Deterministic Compute Plans
          </h1>
          <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 640px; margin: 0 auto 28px; line-height: 1.6;">
            Sub-1ms mathematical execution, 16 verified computational engines, and native Model Context Protocol (MCP) streamable endpoints for autonomous AI agents.
          </p>

          <!-- Toggle Bar: Currency & Billing Cycle -->
          <div style="display: inline-flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 16px; padding: 8px 16px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
            
            <!-- Currency Switcher -->
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">Currency:</span>
              <div style="display: flex; background: var(--bg-subtle); border-radius: 6px; padding: 2px;">
                <button type="button" class="pricing-curr-btn ${!isIndia ? 'active' : ''}" data-currency="usd" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 600; border-radius: 4px; border: none; cursor: pointer; background: ${!isIndia ? 'var(--accent-primary)' : 'transparent'}; color: ${!isIndia ? '#ffffff' : 'var(--text-secondary)'};">USD ($)</button>
                <button type="button" class="pricing-curr-btn ${isIndia ? 'active' : ''}" data-currency="inr" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 600; border-radius: 4px; border: none; cursor: pointer; background: ${isIndia ? 'var(--accent-primary)' : 'transparent'}; color: ${isIndia ? '#ffffff' : 'var(--text-secondary)'};">INR (₹)</button>
              </div>
            </div>

            <div style="width: 1px; height: 20px; background: var(--border-color);"></div>

            <!-- Annual Billing Switcher -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">Billing:</span>
              <div style="display: flex; background: var(--bg-subtle); border-radius: 6px; padding: 2px;">
                <button type="button" class="pricing-cycle-btn ${!isAnnual ? 'active' : ''}" data-cycle="monthly" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 600; border-radius: 4px; border: none; cursor: pointer; background: ${!isAnnual ? 'var(--accent-primary)' : 'transparent'}; color: ${!isAnnual ? '#ffffff' : 'var(--text-secondary)'};">Monthly</button>
                <button type="button" class="pricing-cycle-btn ${isAnnual ? 'active' : ''}" data-cycle="annual" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 600; border-radius: 4px; border: none; cursor: pointer; background: ${isAnnual ? 'var(--accent-primary)' : 'transparent'}; color: ${isAnnual ? '#ffffff' : 'var(--text-secondary)'};">
                  Annual <span style="font-size: 0.68rem; padding: 1px 5px; border-radius: 4px; background: #10b981; color: #fff; margin-left: 2px;">Save up to 28%</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- 4 Tiers Pricing Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 20px; margin-bottom: 48px;">
          
          <!-- Tier 1: Anonymous Free -->
          <div class="glass-card glass-card-interactive" style="padding: 28px 24px; border-radius: 12px; background: var(--bg-surface); display: flex; flex-direction: column; justify-content: space-between; position: relative;">
            <div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Anonymous Agent</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 10px 0 2px;">
                ${symbol}0 <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-muted);">/ mo</span>
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 14px;">Free forever • No credit card</div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">
                Keyless deterministic compute for hobbyists, bots, and local testing.
              </p>
              <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 10px;">
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span><strong>100 calls / month</strong> per IP</span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>20 requests / minute burst limit</span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>All 16 verified math & physics engines</span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Streamable HTTP MCP protocol</span>
                </li>
              </ul>
            </div>
            <button class="btn-tier-action" data-tier="free" type="button" style="width: 100%; padding: 10px; font-size: 0.84rem; font-weight: 600; border-radius: 6px; background: var(--accent-light); color: var(--accent-primary); border: 1px solid var(--accent-border); cursor: pointer; transition: background 0.15s ease;">
              Test for Free →
            </button>
          </div>

          <!-- Tier 2: Developer Starter -->
          <div class="glass-card glass-card-interactive" style="padding: 28px 24px; border-radius: 12px; background: var(--bg-surface); border: 2px solid var(--accent-primary); display: flex; flex-direction: column; justify-content: space-between; position: relative;">
            <span style="position: absolute; top: -11px; right: 20px; font-size: 0.68rem; font-weight: 700; padding: 2px 10px; border-radius: 12px; background: var(--accent-primary); color: #ffffff; letter-spacing: 0.04em;">MOST POPULAR</span>
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.05em;">Developer Starter</span>
              </div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 10px 0 2px;">
                ${symbol}${starterPrice} <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-muted);">/ mo</span>
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 14px;">${starterBilledText}</div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">
                For indie hackers, Cursor power users, and autonomous micro-agents.
              </p>
              <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 10px;">
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span><strong>${starterCallsText}</strong></span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>300 req/min rate limit</span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Full REST & Streamable MCP Access</span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Sub-5ms prioritized edge execution</span>
                </li>
              </ul>
            </div>
            <button class="btn-tier-action" data-tier="starter" type="button" style="width: 100%; padding: 10px; font-size: 0.84rem; font-weight: 600; border-radius: 6px; background: var(--accent-primary); color: #ffffff; border: none; cursor: pointer; transition: opacity 0.2s;">
              ${this.activeTier === 'starter' ? '✓ Active Tier' : `Get Started (${symbol}${starterPrice}/mo)`}
            </button>
          </div>

          <!-- Tier 3: Pro Agency -->
          <div class="glass-card glass-card-interactive" style="padding: 28px 24px; border-radius: 12px; background: var(--bg-surface); display: flex; flex-direction: column; justify-content: space-between; position: relative;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Pro Agency & Scale</span>
              </div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 10px 0 2px;">
                ${symbol}${proPrice} <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-muted);">/ mo</span>
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 14px;">${proBilledText}</div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">
                For production agent pipelines, fintech backends, and multi-user agencies.
              </p>
              <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 10px;">
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span><strong>${proCallsText}</strong></span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>1,000 req/min burst speed</span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Priority Multi-Agent & Team Edge Routing</span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-primary);"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>99.99% Edge SLA Guarantee</span>
                </li>
              </ul>
            </div>
            <button class="btn-tier-action" data-tier="pro" type="button" style="width: 100%; padding: 10px; font-size: 0.84rem; font-weight: 600; border-radius: 6px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer; transition: opacity 0.2s;">
              ${this.activeTier === 'pro' ? '✓ Active Tier' : `Get Pro Agency (${symbol}${proPrice}/mo)`}
            </button>
          </div>

          <!-- Tier 4: Enterprise Pay-As-You-Go -->
          <div class="glass-card glass-card-interactive" style="padding: 28px 24px; border-radius: 12px; background: var(--bg-surface); display: flex; flex-direction: column; justify-content: space-between; position: relative;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.82rem; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 0.05em;">Enterprise Pay-As-You-Go</span>
              </div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 10px 0 2px;">
                ${symbol}${meteredBase}+ <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-muted);">base + usage</span>
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 14px;">Includes 10,000 requests base</div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">
                Elastic burst capacity for high-volume enterprise agents and autonomous fleets.
              </p>
              <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 10px;">
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10b981;"><polyline points="20 6 9 17 4 12"/></svg>
                  <span><strong>10,000 base calls included</strong></span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10b981;"><polyline points="20 6 9 17 4 12"/></svg>
                  <span><strong>${isIndia ? '₹80 per 1,000 extra calls' : '$1.00 per 1,000 extra calls'}</strong></span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10b981;"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Payment Rails: Cards, Apple Pay, UPI AutoPay</span>
                </li>
                <li style="display: flex; align-items: center; gap: 8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10b981;"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Automated Monthly GST / VAT PDF Invoices</span>
                </li>
              </ul>
            </div>
            <button class="btn-tier-action" data-tier="metered" type="button" style="width: 100%; padding: 10px; font-size: 0.84rem; font-weight: 600; border-radius: 6px; background: #10b981; color: #ffffff; border: none; cursor: pointer; transition: opacity 0.2s;">
              ${this.activeTier === 'metered' ? '✓ Active Tier' : 'Get Enterprise Pay-As-You-Go'}
            </button>
          </div>

        </div>

        <!-- Interactive Metered Cost Estimator Slider -->
        <div class="glass-card" style="padding: 28px 24px; border-radius: 12px; background: var(--bg-surface); margin-bottom: 48px;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 4px;">
                Interactive Pay-As-You-Go Cost Estimator
              </h3>
              <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;">
                Drag the slider to project monthly expenditure for autonomous agent workloads.
              </p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Estimated Monthly Total</div>
              <div id="pricing-est-total" style="font-size: 1.7rem; font-weight: 800; color: #10b981;">
                ${symbol}${totalMeteredEstimate.toFixed(2)}
              </div>
            </div>
          </div>

          <!-- Slider -->
          <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
              <span>Volume: <strong id="pricing-slider-val" style="color: var(--accent-primary);">${this.sliderCalls.toLocaleString()}</strong> requests / month</span>
              <span style="color: var(--text-muted);">Max: 500,000 / mo</span>
            </div>
            <input type="range" id="pricing-calls-slider" min="10000" max="500000" step="5000" value="${this.sliderCalls}" style="width: 100%; height: 6px; border-radius: 3px; accent-color: var(--accent-primary); cursor: pointer;">
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 16px; font-size: 0.8rem; color: var(--text-muted); padding-top: 12px; border-top: 1px solid var(--border-color);">
            <span>● Base (10k calls): <strong>${symbol}${meteredBase}</strong></span>
            <span>● Extra calls: <strong id="pricing-extra-calls">${extraCalls.toLocaleString()}</strong></span>
            <span>● Overage rate: <strong>${isIndia ? '₹80 / 1,000 calls' : '$1.00 / 1,000 calls'}</strong></span>
            <span>● Direct Bank-Grade 256-Bit SSL Encryption</span>
          </div>
        </div>

        <!-- Full Feature Comparison Table -->
        <div class="glass-card" style="padding: 28px 24px; border-radius: 12px; background: var(--bg-surface); margin-bottom: 48px;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 16px;">
            Feature & Limits Comparison
          </h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.74rem; text-transform: uppercase;">
                  <th style="padding: 10px 8px;">Capabilities</th>
                  <th style="padding: 10px 8px;">Anonymous</th>
                  <th style="padding: 10px 8px; color: var(--accent-primary);">Developer Starter</th>
                  <th style="padding: 10px 8px;">Pro Agency</th>
                  <th style="padding: 10px 8px; color: #10b981;">Enterprise Pay-As-You-Go</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--text-primary);">Included Requests</td>
                  <td style="padding: 12px 8px; color: var(--text-secondary);">100 / mo</td>
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--accent-primary);">${starterCallsText}</td>
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--text-primary);">${proCallsText}</td>
                  <td style="padding: 12px 8px; font-weight: 600; color: #10b981;">10,000 + Elastic</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--text-primary);">Rate Limit</td>
                  <td style="padding: 12px 8px; color: var(--text-secondary);">20 req/min</td>
                  <td style="padding: 12px 8px; color: var(--text-primary);">300 req/min</td>
                  <td style="padding: 12px 8px; color: var(--text-primary);">1,000 req/min</td>
                  <td style="padding: 12px 8px; font-weight: 600; color: #10b981;">Custom Burst Limit</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--text-primary);">Dedicated Production Key</td>
                  <td style="padding: 12px 8px; color: var(--text-muted);">-</td>
                  <td style="padding: 12px 8px; color: #10b981;">✓ 1 Personal Key</td>
                  <td style="padding: 12px 8px; color: #10b981;">✓ Multi-Seat Team Keys</td>
                  <td style="padding: 12px 8px; color: #10b981;">✓ Unlimited Keys</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--text-primary);">Overages Allowed</td>
                  <td style="padding: 12px 8px; color: var(--text-muted);">Blocked (429)</td>
                  <td style="padding: 12px 8px; color: var(--text-muted);">Blocked (429)</td>
                  <td style="padding: 12px 8px; color: var(--text-muted);">Blocked (429)</td>
                  <td style="padding: 12px 8px; font-weight: 600; color: #10b981;">${isIndia ? '₹80 / 1k' : '$1.00 / 1k'}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--text-primary);">Streamable HTTP MCP</td>
                  <td style="padding: 12px 8px; color: #10b981;">✓ Included</td>
                  <td style="padding: 12px 8px; color: #10b981;">✓ Included</td>
                  <td style="padding: 12px 8px; color: #10b981;">✓ Included</td>
                  <td style="padding: 12px 8px; color: #10b981;">✓ Included</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--text-primary);">Execution Latency</td>
                  <td style="padding: 12px 8px; color: var(--text-secondary);">&lt; 10ms</td>
                  <td style="padding: 12px 8px; color: var(--text-primary);">&lt; 5ms Prioritized</td>
                  <td style="padding: 12px 8px; color: var(--text-primary);">&lt; 2ms Dedicated</td>
                  <td style="padding: 12px 8px; font-weight: 600; color: #10b981;">Sub-1ms Ultra Low</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--text-primary);">Edge Uptime SLA</td>
                  <td style="padding: 12px 8px; color: var(--text-muted);">Best Effort</td>
                  <td style="padding: 12px 8px; color: var(--text-secondary);">99.9%</td>
                  <td style="padding: 12px 8px; color: var(--text-primary);">99.99%</td>
                  <td style="padding: 12px 8px; font-weight: 600; color: #10b981;">99.99% Guaranteed</td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--text-primary);">Tax Invoice (PDF)</td>
                  <td style="padding: 12px 8px; color: var(--text-muted);">-</td>
                  <td style="padding: 12px 8px; color: #10b981;">✓ Automated GST/VAT</td>
                  <td style="padding: 12px 8px; color: #10b981;">✓ Automated GST/VAT</td>
                  <td style="padding: 12px 8px; color: #10b981;">✓ Automated Monthly GST/VAT</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- FAQ Accordion -->
        <div class="glass-card" style="padding: 28px 24px; border-radius: 12px; background: var(--bg-surface);">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 20px;">
            Frequently Asked Questions
          </h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
              <h4 style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin: 0 0 6px;">How does the Streamable HTTP MCP endpoint work?</h4>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                TrueCalci provides an open JSON-RPC 2.0 endpoint at <code>https://truecalci.com/api/v1/mcp</code>. AI agents in Claude Desktop, Cursor, and custom Python agents connect over standard HTTPS POST without requiring a local Node process or stdio adapter.
              </p>
            </div>
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
              <h4 style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin: 0 0 6px;">What payment methods are supported for India vs Global?</h4>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                Payments are processed securely via our encrypted PCI-DSS compliant global billing network. We support all major Credit/Debit Cards, Apple Pay, Google Pay, and SEPA globally (USD $), as well as instant UPI AutoPay, Google Pay, PhonePe, and NetBanking in India (INR ₹). Invoices include automated local tax, GST, and VAT compliance.
              </p>
            </div>
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
              <h4 style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin: 0 0 6px;">What happens if my agent exceeds the 100 free requests?</h4>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                Anonymous requests return HTTP 429 with a <code>Retry-After</code> header and a link to upgrade. Upgrading to Developer Starter instantly unlocks 2,500 requests/mo (or 30,000 upfront annually) with a personal API key.
              </p>
            </div>
            <div>
              <h4 style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin: 0 0 6px;">Can I cancel or change plans anytime?</h4>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                Yes, subscriptions can be managed or cancelled with 1 click via your Customer Billing Portal accessible from your profile. When cancelling, you retain access until the end of your billing cycle.
              </p>
            </div>
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Currency Toggle
    this.containerEl.querySelectorAll(".pricing-curr-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.currency = btn.dataset.currency;
        localStorage.setItem("calc_region", this.currency === "inr" ? "india" : "global");
        const currencyLabel = document.getElementById("currency-label-text");
        if (currencyLabel) {
          currencyLabel.textContent = this.currency === "inr" ? "INR (₹)" : "USD ($)";
        }
        this.render();
      });
    });

    // Billing Cycle Toggle (Monthly vs Annual)
    this.containerEl.querySelectorAll(".pricing-cycle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.billingCycle = btn.dataset.cycle;
        this.render();
      });
    });

    // Slider Event
    const slider = this.containerEl.querySelector("#pricing-calls-slider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        this.sliderCalls = Number(e.target.value);
        const isIndia = this.currency === "inr";
        const symbol = isIndia ? "₹" : "$";
        const isAnnual = this.billingCycle === "annual";
        const meteredBase = isAnnual ? (isIndia ? 1199 : 15) : (isIndia ? 1499 : 19);
        const extraCalls = Math.max(0, this.sliderCalls - 10000);
        const overageCost = isIndia 
          ? (extraCalls / 1000) * 15 
          : (extraCalls / 1000) * 0.20;
        const total = meteredBase + overageCost;

        const estEl = this.containerEl.querySelector("#pricing-est-total");
        const sliderValEl = this.containerEl.querySelector("#pricing-slider-val");
        const extraCallsEl = this.containerEl.querySelector("#pricing-extra-calls");

        if (estEl) estEl.textContent = `${symbol}${total.toFixed(2)}`;
        if (sliderValEl) sliderValEl.textContent = this.sliderCalls.toLocaleString();
        if (extraCallsEl) extraCallsEl.textContent = extraCalls.toLocaleString();
      });
    }

    // Tier Action Buttons
    this.containerEl.querySelectorAll(".btn-tier-action").forEach(btn => {
      btn.addEventListener("click", () => {
        const tier = btn.dataset.tier;
        if (tier === "free") {
          // Navigate to the interactive sandbox in docs
          this.onNavigate("developer");
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          return;
        }
        this.openCheckoutModal(tier);
      });
    });
  }

  openCheckoutModal(tier) {
    // Look for or create modal directly on document.body for true viewport centering
    let modal = document.getElementById("pricing-checkout-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "pricing-checkout-modal";
      document.body.appendChild(modal);
    } else if (modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }

    const isIndia = this.currency === "inr";
    const isAnnual = this.billingCycle === "annual";
    const symbol = isIndia ? "₹" : "$";
    
    const tierNames = {
      starter: isAnnual ? "Developer Starter (Annual)" : "Developer Starter",
      pro: isAnnual ? "Pro Agency & Scale (Annual)" : "Pro Agency & Scale",
      metered: "Enterprise Pay-As-You-Go"
    };

    const starterPrice = isAnnual ? (isIndia ? 319 : 4) : (isIndia ? 399 : 5);
    const proPrice = isAnnual ? (isIndia ? 959 : 12) : (isIndia ? 1199 : 15);

    const tierPrices = {
      starter: `${symbol}${starterPrice} / mo ${isAnnual ? '(billed $48/yr)' : '(billed monthly)'}`,
      pro: `${symbol}${proPrice} / mo ${isAnnual ? '(billed $144/yr)' : '(billed monthly)'}`,
      metered: `${symbol}${starterPrice * 3} base + ${isIndia ? '₹80' : '$1.00'}/1k extra calls`
    };

    const tierLimits = {
      starter: isAnnual ? 30000 : 2500,
      pro: isAnnual ? 180000 : 15000,
      metered: 10000
    };

    modal.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow-y: auto;
    `;

    modal.innerHTML = `
      <div class="glass-card" style="width: 100%; max-width: 480px; padding: 28px; border-radius: 14px; background: var(--bg-surface); position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.35); border: 1px solid var(--accent-border);">
        
        <button id="modal-close-btn" type="button" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: var(--accent-light); color: var(--accent-primary); display: flex; align-items: center; justify-content: center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div>
            <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">${tierNames[tier]}</h3>
            <span style="font-size: 0.8rem; color: var(--accent-primary); font-weight: 600;">${tierPrices[tier]}</span>
          </div>
        </div>

        <div id="modal-step-form">
          <div style="margin: 16px 0; padding: 14px; border-radius: 8px; background: var(--bg-subtle); border: 1px solid var(--border-color); font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary);">
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              <span>Instant Activation & Secure Checkout</span>
              <span style="font-size: 0.68rem; padding: 1px 6px; border-radius: 4px; background: rgba(16,185,129,0.12); color: #10b981;">Active Rail</span>
            </div>
            <div>${isIndia ? '🇮🇳 Instant UPI AutoPay, NetBanking & Cards' : '🌐 Cards, Apple Pay, Google Pay & SEPA'}</div>
            <div style="margin-top: 4px; color: var(--text-muted); font-size: 0.75rem;">Includes automated GST/VAT invoices & 99.99% Edge SLA.</div>
          </div>

          <form id="checkout-confirm-form" style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px;">Developer Email</label>
              <input type="email" id="checkout-email" required placeholder="developer@agency.io" value="developer@agency.io" style="width: 100%; padding: 10px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
            </div>

            <button type="submit" id="checkout-submit-btn" style="width: 100%; padding: 12px; font-size: 0.88rem; font-weight: 600; border-radius: 6px; background: var(--accent-primary); color: #ffffff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
              <span>Proceed to Secure Checkout</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </form>
        </div>

        <div id="modal-step-success" style="display: none; text-align: center; padding-top: 12px;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(16, 185, 129, 0.12); color: #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h4 style="margin: 0 0 6px 0; font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">Order Confirmed & Provisioned!</h4>
          <p style="margin: 0 0 16px 0; font-size: 0.82rem; color: var(--text-secondary);">Your personal API key has been provisioned at the Cloudflare Edge with <strong>${tierLimits[tier].toLocaleString()} requests/month</strong>.</p>
          
          <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px; font-family: var(--font-mono); font-size: 0.84rem; color: var(--accent-primary); display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <span id="gen-api-key-text">tc_live_${tier}_${Math.random().toString(36).substring(2, 12)}</span>
            <button id="btn-copy-gen-key" type="button" style="padding: 4px 8px; font-size: 0.72rem; border-radius: 4px; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;">Copy</button>
          </div>

          <div style="display: flex; gap: 8px;">
            <button id="btn-modal-done" type="button" style="flex: 1; padding: 10px; font-size: 0.84rem; font-weight: 600; border-radius: 6px; background: var(--accent-primary); color: #ffffff; border: none; cursor: pointer;">
              Explore Docs & MCP
            </button>
            <button id="btn-modal-close-now" type="button" style="padding: 10px 16px; font-size: 0.84rem; font-weight: 600; border-radius: 6px; background: var(--bg-subtle); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer;">
              Done
            </button>
          </div>
        </div>

      </div>
    `;

    // Modal Close handlers
    const closeModal = () => {
      modal.style.display = "none";
    };

    modal.querySelector("#modal-close-btn")?.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    const escListener = (e) => {
      if (e.key === "Escape") {
        closeModal();
        window.removeEventListener("keydown", escListener);
      }
    };
    window.addEventListener("keydown", escListener);

    const DODO_CHECKOUT_URLS = {
      starter: {
        monthly: "https://checkout.dodopayments.com/buy/pdt_0NmojrG4wrn4QpRjgThSI?quantity=1",
        annual: "https://checkout.dodopayments.com/buy/pdt_0NmokDJuKcS2eRRvAMjdN?quantity=1"
      },
      pro: {
        monthly: "https://checkout.dodopayments.com/buy/pdt_0NmolAsrtUfe4ehtl27xx?quantity=1",
        annual: "https://checkout.dodopayments.com/buy/pdt_0NmolNeymfU97844gcwUg?quantity=1"
      },
      metered: {
        monthly: "https://checkout.dodopayments.com/buy/pdt_0Nmom4UX68m5EhCRXPy6n?quantity=1",
        annual: "https://checkout.dodopayments.com/buy/pdt_0Nmom4UX68m5EhCRXPy6n?quantity=1"
      }
    };

    const loggedUser = JSON.parse(localStorage.getItem("tc_dev_user") || '{}');
    const defaultEmail = loggedUser.email || "developer@truecalci.com";

    // Form Submit
    modal.querySelector("#checkout-confirm-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = modal.querySelector("#checkout-submit-btn");
      if (submitBtn) {
        submitBtn.innerHTML = `<span>Redirecting to Secure Checkout...</span>`;
        submitBtn.style.opacity = "0.7";
      }

      const emailInput = modal.querySelector("#checkout-email")?.value || defaultEmail;
      const checkoutBaseUrl = DODO_CHECKOUT_URLS[tier]?.[isAnnual ? 'annual' : 'monthly'] || DODO_CHECKOUT_URLS[tier]?.monthly;
      
      // Store checkout metadata for instant fulfillment on return
      localStorage.setItem("tc_pending_checkout_tier", tier);
      localStorage.setItem("tc_pending_checkout_cycle", isAnnual ? 'annual' : 'monthly');
      
      const returnUrl = encodeURIComponent(`${window.location.origin}/#developer?status=success&tier=${tier}&cycle=${isAnnual ? 'annual' : 'monthly'}`);
      const targetCheckoutUrl = `${checkoutBaseUrl}&email=${encodeURIComponent(emailInput)}&discount_code=ZEROTEST&redirect_url=${returnUrl}`;

      setTimeout(() => {
        window.location.href = targetCheckoutUrl;
      }, 400);
    });
  }
}
