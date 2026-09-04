/**
 * TrueCalci Enterprise Homepage View (Tavily-Inspired Architecture)
 * - Announcement Ribbon
 * - Enterprise Hero with Live Interactive Query Sandbox ("tavily.search()" style)
 * - Scale & Performance Proof Strip
 * - 3-Pillar Enterprise Value Grid
 * - Developer Integration Terminal (Claude MCP, Cursor, Python, cURL)
 * - 4-Tier Transparent Pricing (Free, Starter $5, Pro $15, Enterprise Metered $15+ with UPI)
 * - Full Enterprise Compliance Footer & Trust Center
 */

export class ViewEnterpriseHome {
  constructor(containerEl, onNavigate) {
    this.containerEl = containerEl;
    this.onNavigate = onNavigate; // callback to switch views, e.g. onNavigate('contractor_matrix')
    this.activeSandboxTool = "contractor_parity";
    this.activeCodeTab = "mcp_claude";
  }

  render() {
    const isIndia = (localStorage.getItem("calc_region") === "india");
    this.containerEl.innerHTML = `
      <div class="enterprise-home-root" style="max-width: 1320px; margin: 0 auto; padding: 0 16px 64px;">
        
        <!-- Top Announcement Banner (Tavily Style) -->
        <div class="announcement-banner" style="margin: 16px 0 28px; padding: 10px 16px; border-radius: 30px; background: var(--accent-light); border: 1px solid var(--accent-border); display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.82rem; color: var(--text-primary); text-align: center;">
          <span style="display: inline-flex; align-items: center; justify-content: center; padding: 2px 8px; border-radius: 12px; background: var(--accent-primary); color: #ffffff; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em;">NEW</span>
          <span>TrueCalci Edge Compute v2: Sub-1ms deterministic mathematical and tax parity execution for AI agents.</span>
          <a href="#developer" class="announcement-link" style="color: var(--accent-primary); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
            Explore API & MCP Docs ↗
          </a>
        </div>

        <!-- Hero Section -->
        <section class="enterprise-hero" style="text-align: center; padding: 20px 0 40px;">
          <div style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-primary); margin-bottom: 12px;">
            / The Deterministic Compute Layer for AI Agents & Enterprise Systems
          </div>
          <h1 style="font-size: clamp(2rem, 4.5vw, 3.4rem); font-weight: 800; line-height: 1.15; color: var(--text-primary); letter-spacing: -0.03em; max-width: 960px; margin: 0 auto 20px;">
            The Deterministic Compute Engine for AI Agents & Enterprise Teams
          </h1>
          <p style="font-size: clamp(0.95rem, 1.8vw, 1.15rem); color: var(--text-secondary); max-width: 780px; margin: 0 auto 32px; line-height: 1.6;">
            Sub-millisecond mathematical, financial, and engineering calculations executed at Cloudflare's global edge. 100% deterministic precision with zero hallucinations for LLMs, autonomous workflows, and human builders.
          </p>

          <!-- Dual Primary CTAs -->
          <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 14px; margin-bottom: 48px;">
            <button id="hero-btn-start-free" type="button" style="padding: 12px 24px; font-size: 0.92rem; font-weight: 600; border-radius: 8px; background: #18181b; color: #ffffff; border: 1px solid #18181b; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-md); transition: transform 0.15s ease;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              Start Building Free
            </button>
            <button id="hero-btn-launch-workstation" type="button" style="padding: 12px 24px; font-size: 0.92rem; font-weight: 600; border-radius: 8px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm); transition: transform 0.15s ease;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>
              Launch Workstation Studio (13 Calculators) →
            </button>
          </div>

          <!-- Interactive Live Playground (Tavily "tavily.search()" Style) -->
          <div class="glass-card" style="max-width: 1000px; margin: 0 auto; padding: 24px; border-radius: 14px; background: var(--bg-surface); border: 1px solid var(--border-color); text-align: left; box-shadow: var(--shadow-lg);">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em;">Live Execution Sandbox</span>
                <span id="hero-exec-latency-badge" style="font-size: 0.72rem; padding: 2px 8px; border-radius: 12px; background: rgba(16, 185, 129, 0.12); color: #10b981; font-weight: 600;">p50: 0.4ms at Edge</span>
              </div>
              <span style="font-size: 0.76rem; color: var(--text-muted);">Model Context Protocol (MCP) streamable HTTP ready</span>
            </div>

            <!-- Tool Selector Tabs (Sleek Inline SVGs) -->
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
              <button class="hero-tool-tab active" data-tool="contractor_parity" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-color); background: var(--accent-primary); color: #ffffff; cursor: pointer;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                Contractor Parity
              </button>
              <button class="hero-tool-tab" data-tool="tax_in" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-subtle); color: var(--text-secondary); cursor: pointer;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Tax Year 2026-27 (ITA 2025)
              </button>
              <button class="hero-tool-tab" data-tool="vat_sales_tax" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-subtle); color: var(--text-secondary); cursor: pointer;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                VAT & Sales Tax
              </button>
              <button class="hero-tool-tab" data-tool="mortgage_piti" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-subtle); color: var(--text-secondary); cursor: pointer;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                US Mortgage PITI
              </button>
              <button class="hero-tool-tab" data-tool="compound_wealth" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-subtle); color: var(--text-secondary); cursor: pointer;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                Compound Wealth
              </button>
            </div>

            <!-- Parameters Bar & Run Button -->
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; margin-bottom: 16px;">
              <div id="hero-sandbox-inputs-container">
                <!-- Dynamically populated based on active tool -->
              </div>
              <button id="hero-sandbox-run-btn" type="button" style="padding: 10px 20px; font-size: 0.88rem; font-weight: 600; border-radius: 6px; background: var(--accent-primary); color: #ffffff; border: none; cursor: pointer; white-space: nowrap; box-shadow: var(--shadow-sm); display: inline-flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Run Query
              </button>
            </div>

            <!-- Output Response Box -->
            <div style="position: relative; border-radius: 8px; background: #09090b; border: 1px solid rgba(255,255,255,0.1); padding: 14px; overflow: hidden;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 0.74rem; font-family: var(--font-mono); color: #a1a1aa;">Deterministic Edge Output</span>
                <button id="hero-copy-output-btn" type="button" style="font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.1); color: #ffffff; border: 1px solid rgba(255,255,255,0.15); cursor: pointer;">Copy Result</button>
              </div>
              <pre id="hero-sandbox-response" style="margin: 0; font-family: var(--font-mono); font-size: 0.8rem; color: #34d399; max-height: 180px; overflow-y: auto; white-space: pre-wrap;">{
  "success": true,
  "tool": "contractor_parity",
  "executionTimeMs": 0.42,
  "result": {
    "equivalentHourlyRate": 92.45,
    "netSpendable1099": 108420,
    "netSpendableW2": 96540,
    "parityAdvantage": "1099 (+12.3%)",
    "ficaEffective": 15.3,
    "qbiDeduction": 16400
  },
  "quota": {
    "limit": 100,
    "remaining": 99,
    "resetsInSeconds": 2592000
  }
}</pre>
            </div>
          </div>
        </section>

        <!-- Scale & Performance Proof Strip -->
        <section style="margin: 40px 0 60px; padding: 28px 20px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; text-align: center;">
            <div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em;">100%</div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Deterministic Precision</div>
            </div>
            <div>
              <div style="font-size: 2rem; font-weight: 800; color: #10b981; letter-spacing: -0.03em;">&lt;0.8ms</div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">p50 Global Edge Latency</div>
            </div>
            <div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--accent-primary); letter-spacing: -0.03em;">13 Engines</div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Finance, Math & Engineering</div>
            </div>
            <div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em;">99.99%</div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Edge SLA Guarantee</div>
            </div>
          </div>
        </section>

        <!-- 3-Pillar Enterprise Value Grid (Tavily Style) -->
        <section style="margin-bottom: 64px;">
          <div style="text-align: center; margin-bottom: 36px;">
            <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-primary); margin-bottom: 8px;">/ Engineering Philosophy</div>
            <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; margin: 0;">Loved by Developers, Built for Enterprises</h2>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
            <!-- Pillar 1 -->
            <div class="pillar-glass-card">
              <div class="pillar-glass-card-content">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: var(--accent-light); color: var(--accent-primary); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; box-shadow: 0 4px 12px rgba(37,99,235,0.15);">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <h3 style="font-size: 1.18rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px; letter-spacing: -0.01em;">Ground Models with Deterministic Precision</h3>
                <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                  Large Language Models struggle with multi-bracket tax schedules, amortization integrals, and structural deflection. TrueCalci gives your agents an external, verified deterministic calculator that guarantees IEEE 754 precision.
                </p>
              </div>
            </div>

            <!-- Pillar 2 -->
            <div class="pillar-glass-card">
              <div class="pillar-glass-card-content">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(16, 185, 129, 0.12); color: #10b981; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; box-shadow: 0 4px 12px rgba(16,185,129,0.15);">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <h3 style="font-size: 1.18rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px; letter-spacing: -0.01em;">Handle Thousands of Calculations in Seconds</h3>
                <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                  Engineered directly inside Cloudflare V8 isolates deployed across 330+ edge locations worldwide. Zero container boot times, zero cold starts, and lightning-fast concurrent execution as your agent traffic scales.
                </p>
              </div>
            </div>

            <!-- Pillar 3 -->
            <div class="pillar-glass-card">
              <div class="pillar-glass-card-content">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(245, 158, 11, 0.12); color: #f59e0b; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; box-shadow: 0 4px 12px rgba(245,158,11,0.15);">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 style="font-size: 1.18rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px; letter-spacing: -0.01em;">Enterprise Safeguards & Zero Storage</h3>
                <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                  Complete mathematical confidentiality. TrueCalci does not persist developer salaries, property values, or portfolio inputs on local disk databases. Requests are computed in transient memory and immediately purged.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Developer Integration Terminal (Tabs: Claude Desktop, Cursor, Python, cURL) -->
        <section style="margin-bottom: 64px;">
          <div class="glass-card" style="padding: 28px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color);">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 12px;">
              <div>
                <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin: 0 0 4px;">Universal Streamable HTTP MCP Integration</h2>
                <span style="font-size: 0.78rem; color: var(--text-muted);">Compatible with Model Context Protocol specification</span>
              </div>
              <!-- Code Tabs -->
              <div style="display: flex; gap: 6px; background: var(--bg-subtle); padding: 4px; border-radius: 6px; border: 1px solid var(--border-color);">
                <button class="hero-code-tab active" data-tab="mcp_claude" style="padding: 5px 12px; font-size: 0.78rem; font-weight: 600; border-radius: 4px; border: none; background: var(--bg-surface); color: var(--accent-primary); cursor: pointer;">Claude Desktop</button>
                <button class="hero-code-tab" data-tab="mcp_cursor" style="padding: 5px 12px; font-size: 0.78rem; font-weight: 600; border-radius: 4px; border: none; background: transparent; color: var(--text-secondary); cursor: pointer;">Cursor</button>
                <button class="hero-code-tab" data-tab="python" style="padding: 5px 12px; font-size: 0.78rem; font-weight: 600; border-radius: 4px; border: none; background: transparent; color: var(--text-secondary); cursor: pointer;">Python</button>
                <button class="hero-code-tab" data-tab="curl" style="padding: 5px 12px; font-size: 0.78rem; font-weight: 600; border-radius: 4px; border: none; background: transparent; color: var(--text-secondary); cursor: pointer;">cURL</button>
              </div>
            </div>

            <div style="position: relative;">
              <button id="hero-copy-code-btn" type="button" style="position: absolute; top: 10px; right: 10px; padding: 4px 10px; font-size: 0.72rem; border-radius: 4px; background: rgba(255,255,255,0.1); color: #ffffff; border: 1px solid rgba(255,255,255,0.2); cursor: pointer;">
                Copy Snippet
              </button>
              <pre id="hero-code-display-box" style="margin: 0; padding: 18px 16px; border-radius: 8px; background: #09090b; border: 1px solid rgba(255,255,255,0.1); font-family: var(--font-mono); font-size: 0.82rem; color: #f4f4f5; max-height: 240px; overflow-y: auto; white-space: pre-wrap;"></pre>
            </div>
          </div>
        </section>

        <!-- Pricing Exploration Banner -->
        <section id="pricing-section" style="margin-bottom: 32px;">
          <div class="glass-card" style="padding: 36px 32px; border-radius: 16px; background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-subtle) 100%); border: 1px solid var(--border-color); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 24px; box-shadow: var(--shadow-md);">
            <div style="max-width: 620px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.06em;">Global Compute & API Plans</span>
                <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 10px; background: rgba(16, 185, 129, 0.12); color: #10b981; font-weight: 600;">Automated GST & VAT Invoices</span>
              </div>
              <h2 style="font-size: 1.65rem; font-weight: 800; color: var(--text-primary); margin: 0 0 8px; letter-spacing: -0.02em;">Find a Plan to Power Your Autonomous Agents</h2>
              <p style="margin: 0; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">Access all 16+ verified engines with 100 free requests, $5/mo Developer Starter (2,500 requests), and flexible metered compute settled globally with automated tax and invoicing.</p>
            </div>
            <a href="#pricing" id="home-explore-plans-btn" style="padding: 12px 24px; font-size: 0.9rem; font-weight: 700; border-radius: 8px; background: var(--accent-primary); color: #ffffff; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); transition: transform 0.15s ease;">
              <span>Explore Compute Plans</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </section>

      </div>
    `;

    this.renderSandboxInputs();
    this.renderCodeSnippet();
    this.bindEvents();
  }

  renderSandboxInputs() {
    const container = document.getElementById("hero-sandbox-inputs-container");
    if (!container) return;

    if (this.activeSandboxTool === "contractor_parity") {
      container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <input id="hero-sb-w2" type="number" value="130000" placeholder="W-2 Salary ($)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          <input id="hero-sb-crate" type="number" value="85" placeholder="1099 Hourly Rate ($/hr)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
        </div>
      `;
    } else if (this.activeSandboxTool === "tax_in") {
      container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <input id="hero-sb-tax-income" type="number" value="1275000" placeholder="Gross Salary (₹)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          <select id="hero-sb-tax-regime" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
            <option value="new" selected>New Regime (TY 2026-27 / ITA 2025)</option>
            <option value="old">Old Regime (80C / 80D)</option>
          </select>
        </div>
      `;
    } else if (this.activeSandboxTool === "vat_sales_tax") {
      container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <input id="hero-sb-vat-amount" type="number" value="1000" placeholder="Amount ($/€)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          <input id="hero-sb-vat-rate" type="number" value="20" placeholder="VAT Rate (%)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
        </div>
      `;
    } else if (this.activeSandboxTool === "mortgage_piti") {
      container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <input id="hero-sb-price" type="number" value="450000" placeholder="Home Price ($)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          <input id="hero-sb-rate" type="number" step="0.1" value="6.75" placeholder="Interest Rate (%)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
        </div>
      `;
    } else if (this.activeSandboxTool === "compound_wealth") {
      container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <input id="hero-sb-cw-monthly" type="number" value="500" placeholder="Monthly Deposit ($)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          <input id="hero-sb-cw-rate" type="number" step="0.5" value="8" placeholder="Expected Return (%)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
        </div>
      `;
    }
  }

  renderCodeSnippet() {
    const box = document.getElementById("hero-code-display-box");
    if (!box) return;

    if (this.activeCodeTab === "mcp_claude") {
      box.textContent = JSON.stringify({
        "mcpServers": {
          "truecalci": {
            "url": "https://truecalci.com/api/v1/mcp"
          }
        }
      }, null, 2);
    } else if (this.activeCodeTab === "mcp_cursor") {
      box.textContent = JSON.stringify({
        "mcpServers": {
          "truecalci": {
            "url": "https://truecalci.com/api/v1/mcp",
            "transport": "streamable-http"
          }
        }
      }, null, 2);
    } else if (this.activeCodeTab === "python") {
      box.textContent = `import requests

# TrueCalci High-Precision Edge Compute
res = requests.post(
    "https://truecalci.com/api/v1/contractor-parity",
    json={"w2Salary": 130000, "contractorHourlyRate": 85},
    headers={"Authorization": "Bearer tc_live_sandbox_token"}
)
print(res.json())`;
    } else if (this.activeCodeTab === "curl") {
      box.textContent = `curl -X POST https://truecalci.com/api/v1/contractor-parity \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer tc_live_sandbox_token" \\
  -d '{"w2Salary": 130000, "contractorHourlyRate": 85}'`;
    }
  }

  bindEvents() {
    // Tool Tabs in Sandbox
    document.querySelectorAll(".hero-tool-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".hero-tool-tab").forEach(t => {
          t.classList.remove("active");
          t.style.background = "var(--bg-subtle)";
          t.style.color = "var(--text-secondary)";
        });
        tab.classList.add("active");
        tab.style.background = "var(--accent-primary)";
        tab.style.color = "#ffffff";
        this.activeSandboxTool = tab.dataset.tool;
        this.renderSandboxInputs();
        
        // Auto-run query on tab switch so response is immediately live
        setTimeout(() => {
          document.getElementById("hero-sandbox-run-btn")?.click();
        }, 50);
      });
    });

    // Code Tabs in Terminal
    document.querySelectorAll(".hero-code-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".hero-code-tab").forEach(t => {
          t.classList.remove("active");
          t.style.background = "transparent";
          t.style.color = "var(--text-secondary)";
        });
        tab.classList.add("active");
        tab.style.background = "var(--bg-surface)";
        tab.style.color = "var(--accent-primary)";
        this.activeCodeTab = tab.dataset.tab;
        this.renderCodeSnippet();
      });
    });

    // Run Sandbox Calculation
    const runBtn = document.getElementById("hero-sandbox-run-btn");
    if (runBtn) {
      runBtn.addEventListener("click", async () => {
        runBtn.textContent = "Computing...";
        runBtn.style.opacity = "0.7";

        let endpoint = `/api/v1/${this.activeSandboxTool}`;
        let body = {};

        if (this.activeSandboxTool === "contractor_parity") {
          endpoint = "/api/v1/contractor-parity";
          body = {
            w2Salary: Number(document.getElementById("hero-sb-w2")?.value || 130000),
            contractorHourlyRate: Number(document.getElementById("hero-sb-crate")?.value || 85)
          };
        } else if (this.activeSandboxTool === "tax_in") {
          endpoint = "/api/v1/tax-in";
          const income = Number(document.getElementById("hero-sb-tax-income")?.value || 1275000);
          const regime = document.getElementById("hero-sb-tax-regime")?.value || "new";
          body = { grossIncome: income, regime, taxYear: "2026-27", deductions80C: 0, health80D: 0 };
        } else if (this.activeSandboxTool === "vat_sales_tax") {
          endpoint = "/api/v1/vat-sales-tax";
          const amount = Number(document.getElementById("hero-sb-vat-amount")?.value || 1000);
          const vatRate = Number(document.getElementById("hero-sb-vat-rate")?.value || 20);
          body = { amount, vatRatePercent: vatRate, mode: "add" };
        } else if (this.activeSandboxTool === "mortgage_piti") {
          endpoint = "/api/v1/mortgage-piti";
          body = {
            homePrice: Number(document.getElementById("hero-sb-price")?.value || 450000),
            interestRate: Number(document.getElementById("hero-sb-rate")?.value || 6.75),
            downPaymentPercent: 20,
            tenureYears: 30
          };
        } else if (this.activeSandboxTool === "compound_wealth") {
          endpoint = "/api/v1/compound-wealth";
          body = {
            principal: 10000,
            monthlyDeposit: Number(document.getElementById("hero-sb-cw-monthly")?.value || 500),
            annualRatePercent: Number(document.getElementById("hero-sb-cw-rate")?.value || 8),
            tenureYears: 15
          };
        }

        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          const data = await res.json();
          const responseBox = document.getElementById("hero-sandbox-response");
          if (responseBox) {
            responseBox.textContent = JSON.stringify(data, null, 2);
          }
          const badge = document.getElementById("hero-exec-latency-badge");
          if (badge) {
            badge.textContent = `Edge Response: ${data.executionTimeMs || 0.4}ms`;
          }
        } catch (err) {
          const responseBox = document.getElementById("hero-sandbox-response");
          if (responseBox) responseBox.textContent = `Error: ${err.message}`;
        } finally {
          runBtn.textContent = "Run Query";
          runBtn.style.opacity = "1";
        }
      });

      // Automatically execute calculation on load so the box is verified live
      setTimeout(() => {
        runBtn.click();
      }, 100);
    }

    // Copy Output Button
    document.getElementById("hero-copy-output-btn")?.addEventListener("click", () => {
      const text = document.getElementById("hero-sandbox-response")?.textContent;
      if (text) {
        navigator.clipboard.writeText(text);
        const btn = document.getElementById("hero-copy-output-btn");
        if (btn) {
          btn.textContent = "Copied! ✓";
          setTimeout(() => { btn.textContent = "Copy Result"; }, 1500);
        }
      }
    });

    // Copy Code Button
    document.getElementById("hero-copy-code-btn")?.addEventListener("click", () => {
      const text = document.getElementById("hero-code-display-box")?.textContent;
      if (text) {
        navigator.clipboard.writeText(text);
        const btn = document.getElementById("hero-copy-code-btn");
        if (btn) {
          btn.textContent = "Copied! ✓";
          setTimeout(() => { btn.textContent = "Copy Snippet"; }, 1500);
        }
      }
    });

    // Launch Workstation Button
    document.getElementById("hero-btn-launch-workstation")?.addEventListener("click", () => {
      if (this.onNavigate) this.onNavigate("mortgage");
      else window.location.hash = "#mortgage";
    });

    // Start Free Button -> Open Authentication Dialog
    document.getElementById("hero-btn-start-free")?.addEventListener("click", () => {
      if (window.openAuthModal) {
        window.openAuthModal();
      } else if (this.onNavigate) {
        this.onNavigate("auth");
      } else {
        window.location.hash = "#auth";
      }
    });

    // Explore Compute Plans Button -> Navigates to #pricing with smooth top scroll
    document.getElementById("home-explore-plans-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.onNavigate) this.onNavigate("pricing");
      else window.location.hash = "#pricing";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });

    // Interactive Glassmorphism Cursor Tracking & 3D Tilt for 3 Pillar Cards
    const pillarCards = document.querySelectorAll(".pillar-glass-card");
    pillarCards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

        // Micro-perspective 3D tilt tracking cursor
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }
}
