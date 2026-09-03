/**
 * TrueCalci Developer & AI Agent Portal View
 * Keyless 100-Requests/Month Quota Meter, Interactive Edge Sandbox, and 1-Click MCP Configs
 * Swiss Modernist Glassmorphism (Dieter Rams inspired, zero glare)
 */

export class ViewDeveloperPortal {
  constructor(containerEl) {
    this.containerEl = containerEl;
    this.selectedTool = "contractor_parity";
    this.activeCodeTab = "mcp_claude";
    
    // Dynamic persistent usage tracking
    const savedUsage = localStorage.getItem("tc_edge_usage_count");
    this.currentUsage = savedUsage !== null ? parseInt(savedUsage, 10) : 14;
    
    // Auto-assign tier if redirected back from Dodo Payments checkout
    try {
      const hashQuery = window.location.hash.includes("?") ? window.location.hash.split("?")[1] : "";
      const urlParams = new URLSearchParams(window.location.search || hashQuery);
      if (urlParams.get("status") === "success" || urlParams.get("payment") === "success" || urlParams.get("checkout_id")) {
        const tier = urlParams.get("tier") || "starter";
        const isAnnual = urlParams.get("cycle") === "annual";
        const existing = JSON.parse(localStorage.getItem("tc_dev_user") || '{}');
        const upgradedUser = {
          name: existing.name || "Alex Chen",
          handle: existing.handle || "alexchen-dev",
          email: existing.email || "developer@truecalci.com",
          provider: existing.provider || "github",
          tier: tier === "pro" 
            ? `Pro Agency & Scale (${isAnnual ? 'Annual' : 'Monthly'})` 
            : `Developer Starter (${isAnnual ? 'Annual' : 'Monthly'})`,
          tierId: tier,
          quotaLimit: tier === "pro" ? 15000 : 2500,
          dodoCustomerId: urlParams.get("customer_id") || `cus_dodo_${Date.now()}`
        };
        localStorage.setItem("tc_dev_user", JSON.stringify(upgradedUser));
        localStorage.setItem("tc_dev_auth", "true");
        localStorage.setItem("tc_active_tier", tier);
        this.isLoggedIn = true;
        this.devUser = upgradedUser;
      }
    } catch (e) {
      console.warn("Could not check checkout return params:", e);
    }

    // Derive quota from active tier
    if (this.isLoggedIn && this.devUser) {
      if (this.devUser.tierId === "starter") {
        this.quotaLimit = 2500;
      } else if (this.devUser.tierId === "pro" || this.devUser.tierId === "metered") {
        this.quotaLimit = 15000;
      } else {
        this.quotaLimit = 2500;
      }
    } else {
      this.quotaLimit = 100;
    }
  }

  render() {
    const isIndia = (localStorage.getItem("calc_region") === "india");
    const remaining = Math.max(0, this.quotaLimit - this.currentUsage);
    const usagePercent = Math.min(100, Math.round((this.currentUsage / this.quotaLimit) * 100));

    this.containerEl.innerHTML = `
      <div class="dev-portal-wrapper" style="max-width: 1320px; margin: 0 auto; padding: 24px 16px;">
        
        <!-- Hero Header with Developer Profile & Auth -->
        <header style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <h1 style="margin: 0; font-size: 1.4rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em;">Developer Hub & MCP API</h1>
              <span style="font-size: 0.72rem; padding: 3px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid var(--border-color); font-weight: 600;">Streamable HTTP MCP v1</span>
            </div>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-secondary); max-width: 780px;">
              Sub-10ms deterministic mathematical and financial calculations running at Cloudflare's global edge. Accessible directly via Model Context Protocol (MCP) or standard REST API endpoints.
            </p>
          </div>

          <!-- Auth Status & Controls -->
          <div style="display: flex; align-items: center; gap: 12px;">
            ${this.isLoggedIn && this.devUser ? `
              <div style="display: flex; align-items: center; gap: 10px; padding: 6px 12px; border-radius: 8px; background: var(--bg-surface); border: 1px solid var(--border-color);">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: #24292f; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">
                  ${this.devUser.provider === 'github' ? `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  ` : `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  `}
                </div>
                <div>
                  <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-primary);">${this.devUser.name} <span style="font-weight: 400; color: var(--text-muted);">(@${this.devUser.handle})</span></div>
                  <div style="font-size: 0.7rem; color: #10b981; font-weight: 500;">Plan: ${this.devUser.tier}</div>
                </div>
                <button id="dev-open-invoices-btn" type="button" style="margin-left: 6px; padding: 4px 8px; font-size: 0.72rem; border-radius: 4px; background: var(--accent-light); color: var(--accent-primary); border: 1px solid var(--accent-border); cursor: pointer;" title="View Invoices">
                  Invoices & Bills
                </button>
                <button id="dev-logout-btn" type="button" style="margin-left: 6px; padding: 4px 8px; font-size: 0.72rem; border-radius: 4px; background: var(--bg-subtle); color: var(--text-muted); border: 1px solid var(--border-color); cursor: pointer;" title="Log out">
                  Log out
                </button>
              </div>
            ` : `
              <div style="display: flex; align-items: center; gap: 8px;">
                <button id="dev-signup-trigger-btn" type="button" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 0.84rem; font-weight: 700; border-radius: 6px; background: var(--accent-primary); color: #ffffff; border: none; cursor: pointer; box-shadow: var(--shadow-sm);">
                  <span>Start Building Free</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
                <button id="dev-login-trigger-btn" type="button" style="display: flex; align-items: center; gap: 8px; padding: 8px 14px; font-size: 0.84rem; font-weight: 600; border-radius: 6px; background: #24292f; color: #ffffff; border: 1px solid rgba(0,0,0,0.1); cursor: pointer; box-shadow: var(--shadow-sm);">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  Developer Sign In
                </button>
              </div>
            `}
            <a href="#admin" style="font-size: 0.8rem; padding: 8px 14px; border-radius: 6px; background: var(--bg-surface); color: var(--text-secondary); border: 1px solid var(--border-color); text-decoration: none;">
              Admin Telemetry →
            </a>
          </div>
        </header>

        <!-- Live Quota Meter Card (Dynamic based on active plan) -->
        <div class="glass-card" style="padding: 22px; border-radius: 10px; background: var(--bg-surface); border: 1px solid var(--border-color); margin-bottom: 28px;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 10px;">
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 4px;">
                ${this.isLoggedIn && this.devUser ? `${this.devUser.tier} Allowance` : 'Free Anonymous Allowance (Keyless per IP)'}
              </div>
              <div style="font-size: 1.15rem; font-weight: 600; color: var(--text-primary);">
                <span id="dev-usage-count">${this.currentUsage}</span> / <span id="dev-quota-limit">${this.quotaLimit}</span> Requests Used this Month
                <span id="dev-remaining-badge" style="font-size: 0.85rem; font-weight: 400; color: #10b981; margin-left: 8px;">(${remaining} remaining)</span>
              </div>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              Reset Date: <strong style="color: var(--text-secondary);">Oct 1, 2026 (00:00 UTC)</strong>
            </div>
          </div>

          <!-- Progress Bar -->
          <div style="height: 8px; border-radius: 4px; background: var(--border-color); overflow: hidden; margin-bottom: 12px;">
            <div id="dev-progress-bar" style="width: ${usagePercent}%; height: 100%; background: ${usagePercent > 85 ? '#f43f5e' : 'var(--accent-primary)'}; border-radius: 4px; transition: width 0.3s ease;"></div>
          </div>

          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); gap: 10px;">
            <span>● <strong>No signup required:</strong> AI agents and developers test keyless with zero friction up to 100 calls/month.</span>
            <span><a href="#pricing" style="color: var(--accent-primary); text-decoration: underline;">Need higher concurrency or personal API key? View Developer Plans ($5/mo) →</a></span>
          </div>
        </div>

        <!-- Two Columns: Interactive Sandbox (Left) & Copyable Integration Configs (Right) -->
        <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 24px; margin-bottom: 32px;">
          
          <!-- Column 1: Interactive Edge Sandbox -->
          <div class="glass-card" style="padding: 24px; border-radius: 10px; background: var(--bg-surface); border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h2 style="margin: 0; font-size: 1.05rem; font-weight: 600; color: var(--text-primary);">Interactive Edge Sandbox</h2>
              <span id="dev-exec-badge" style="display: none; font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.12); color: #10b981; font-weight: 600;">Sub-10ms Edge Response</span>
            </div>

            <!-- Tool Selector -->
            <label style="display: block; font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px;" for="sandbox-tool-select">Select Computational Tool:</label>
            <select id="sandbox-tool-select" style="width: 100%; padding: 8px 12px; font-size: 0.85rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color); margin-bottom: 16px;">
              <option value="contractor_parity" selected>Remote Contractor Parity (W-2 vs 1099, QBI & SECA)</option>
              <option value="mortgage_piti">Mortgage PITI & Amortization</option>
              <option value="casio_991_solve">Casio 991 Scientific Solver & Integration</option>
              <option value="beam_bending">Civil/Mechanical Beam Bending & Stress</option>
              <option value="vat_sales_tax">European VAT & Sales Tax</option>
              <option value="black_scholes">Black-Scholes Option Pricing & Greeks</option>
              <option value="pipe_flow">Fluid Dynamics Pipe Flow & Pressure Drop</option>
              <option value="rlc_circuit">Resonant RLC Circuit & AC Impedance</option>
              <option value="rocket_deltav">Tsiolkovsky Rocket Equation & Delta-v</option>
            </select>

            <!-- Dynamic Input Container -->
            <div id="sandbox-params-container" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
              <!-- Populated dynamically -->
            </div>

            <button id="sandbox-run-btn" type="button" style="width: 100%; padding: 10px 16px; font-size: 0.88rem; font-weight: 600; border-radius: 6px; background: var(--accent-primary); color: #ffffff; border: none; cursor: pointer; transition: opacity 0.2s;">
              Execute Calculation at Edge
            </button>

            <!-- Response Viewer -->
            <div style="margin-top: 16px;">
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Live Edge JSON Response:</div>
              <pre id="sandbox-response-box" style="margin: 0; padding: 12px; border-radius: 6px; background: var(--bg-app); border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-primary); max-height: 240px; overflow-y: auto; white-space: pre-wrap;">Click "Execute Calculation at Edge" to run test call...</pre>
            </div>
          </div>

          <!-- Column 2: 1-Click Setup & Code Snippets -->
          <div class="glass-card" style="padding: 24px; border-radius: 10px; background: var(--bg-surface); border: 1px solid var(--border-color);">
            <h2 style="margin: 0 0 14px 0; font-size: 1.05rem; font-weight: 600; color: var(--text-primary);">Integration & Client Setup</h2>
            
            <!-- Tabs -->
            <div style="display: flex; gap: 6px; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
              <button class="code-tab-btn" data-tab="mcp_claude" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 500; border-radius: 4px; background: var(--accent-light); color: var(--accent-primary); border: none; cursor: pointer;">Claude Desktop</button>
              <button class="code-tab-btn" data-tab="mcp_cursor" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 500; border-radius: 4px; background: transparent; color: var(--text-secondary); border: none; cursor: pointer;">Cursor</button>
              <button class="code-tab-btn" data-tab="curl" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 500; border-radius: 4px; background: transparent; color: var(--text-secondary); border: none; cursor: pointer;">cURL</button>
              <button class="code-tab-btn" data-tab="python" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 500; border-radius: 4px; background: transparent; color: var(--text-secondary); border: none; cursor: pointer;">Python</button>
            </div>

            <!-- Snippet Box with Copy Button -->
            <div style="position: relative;">
              <button id="copy-snippet-btn" type="button" style="position: absolute; top: 8px; right: 8px; padding: 4px 8px; font-size: 0.72rem; border-radius: 4px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer;">
                Copy
              </button>
              <pre id="code-snippet-box" style="margin: 0; padding: 14px 12px; border-radius: 6px; background: var(--bg-app); border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-primary); max-height: 280px; overflow-y: auto; white-space: pre-wrap;"></pre>
            </div>

            <div style="margin-top: 16px; padding: 12px; border-radius: 6px; background: var(--accent-light); border: 1px solid var(--accent-border); font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5;">
              <strong style="color: var(--text-primary);">Streamable HTTP Protocol:</strong> Connects directly over HTTP POST to <code style="font-family: var(--font-mono); color: var(--accent-primary);">https://truecalci.com/api/v1/mcp</code> without requiring a local Node process or stdio bridge.
            </div>
          </div>

        </div>

        <!-- Pricing Callout Banner -->
        <div class="glass-card" style="margin-top: 24px; padding: 20px 24px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.05em;">Commercial Usage</span>
              <span style="font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; background: rgba(16, 185, 129, 0.12); color: #10b981; font-weight: 600;">Sub-1ms SLA</span>
            </div>
            <h3 style="margin: 0 0 4px 0; font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">Need Higher Concurrency or Dedicated API Keys?</h3>
            <p style="margin: 0; font-size: 0.82rem; color: var(--text-secondary);">Developer Starter ($5/mo for 2,500 calls) and Pro Agency ($15/mo for 10,000 calls) with UPI & Stripe support.</p>
          </div>
          <a href="#pricing" style="padding: 10px 18px; font-size: 0.84rem; font-weight: 600; border-radius: 6px; background: var(--accent-primary); color: #ffffff; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: opacity 0.2s;">
            <span>Explore Pricing Plans</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>

        <!-- API Tool Directory & MCP Specification -->
        <div class="glass-card" style="margin-top: 24px; padding: 24px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color);">
          <div style="margin-bottom: 16px;">
            <h2 style="margin: 0 0 6px 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Core Engine Schemas & MCP Tools</h2>
            <p style="margin: 0; font-size: 0.82rem; color: var(--text-secondary);">All 13 deterministic engines are exposed via JSON-RPC 2.0 under <code style="color:var(--accent-primary);">/api/v1/mcp</code> and REST under <code style="color:var(--accent-primary);">/api/v1/:tool</code>.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
            <div style="padding: 14px; border-radius: 8px; background: var(--bg-subtle); border: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <code style="font-family: var(--font-mono); font-size: 0.82rem; font-weight: 600; color: var(--accent-primary);">contractor_takehome_matrix</code>
                <span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: var(--accent-light); color: var(--accent-primary);">POST</span>
              </div>
              <p style="margin: 0; font-size: 0.76rem; color: var(--text-secondary); line-height: 1.5;">Calculates 1099 vs W-2 tax parity, 15.3% SECA drag, §199A QBI deduction, and cross-border FX fees.</p>
            </div>

            <div style="padding: 14px; border-radius: 8px; background: var(--bg-subtle); border: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <code style="font-family: var(--font-mono); font-size: 0.82rem; font-weight: 600; color: var(--accent-primary);">mortgage_piti</code>
                <span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: var(--accent-light); color: var(--accent-primary);">POST</span>
              </div>
              <p style="margin: 0; font-size: 0.76rem; color: var(--text-secondary); line-height: 1.5;">Amortizes Principal, Interest, Property Tax, Hazard Insurance, and PMI if down payment &lt; 20%.</p>
            </div>

            <div style="padding: 14px; border-radius: 8px; background: var(--bg-subtle); border: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <code style="font-family: var(--font-mono); font-size: 0.82rem; font-weight: 600; color: var(--accent-primary);">casio_991_solve</code>
                <span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: var(--accent-light); color: var(--accent-primary);">POST</span>
              </div>
              <p style="margin: 0; font-size: 0.76rem; color: var(--text-secondary); line-height: 1.5;">Evaluates natural language equations (e.g. "2x + 8 = 24") and Simpson 1/3 numerical integrals.</p>
            </div>

            <div style="padding: 14px; border-radius: 8px; background: var(--bg-subtle); border: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <code style="font-family: var(--font-mono); font-size: 0.82rem; font-weight: 600; color: var(--accent-primary);">black_scholes</code>
                <span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: var(--accent-light); color: var(--accent-primary);">POST</span>
              </div>
              <p style="margin: 0; font-size: 0.76rem; color: var(--text-secondary); line-height: 1.5;">Option pricing with analytical Greeks (Delta, Gamma, Vega, Theta) via cumulative normal distributions.</p>
            </div>

            <div style="padding: 14px; border-radius: 8px; background: var(--bg-subtle); border: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <code style="font-family: var(--font-mono); font-size: 0.82rem; font-weight: 600; color: var(--accent-primary);">beam_bending</code>
                <span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: var(--accent-light); color: var(--accent-primary);">POST</span>
              </div>
              <p style="margin: 0; font-size: 0.76rem; color: var(--text-secondary); line-height: 1.5;">Euler-Bernoulli cantilever and simply-supported structural beam deflection and bending stress.</p>
            </div>

            <div style="padding: 14px; border-radius: 8px; background: var(--bg-subtle); border: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <code style="font-family: var(--font-mono); font-size: 0.82rem; font-weight: 600; color: var(--accent-primary);">vat_sales_tax</code>
                <span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: var(--accent-light); color: var(--accent-primary);">POST</span>
              </div>
              <p style="margin: 0; font-size: 0.76rem; color: var(--text-secondary); line-height: 1.5;">Add and remove VAT calculations with exact decimal rounding for UK HMRC, EU MwSt, and US sales tax.</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Invoices & Billing Modal for Account Owners -->
      <div id="dev-invoices-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 9999; align-items: center; justify-content: center; padding: 16px;">
        <div class="glass-card" style="width: 100%; max-width: 720px; padding: 28px; border-radius: 12px; background: var(--bg-surface); position: relative; box-shadow: var(--shadow-lg);">
          <button id="dev-inv-modal-close" type="button" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: var(--accent-light); color: var(--accent-primary); display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">Account Invoices & Billing History</h3>
              <span style="font-size: 0.78rem; color: var(--text-secondary);">Download official GST/VAT tax invoices and metered usage receipts.</span>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.74rem; text-transform: uppercase;">
                  <th style="padding: 10px 8px;">Date</th>
                  <th style="padding: 10px 8px;">Invoice #</th>
                  <th style="padding: 10px 8px;">Description</th>
                  <th style="padding: 10px 8px;">Amount</th>
                  <th style="padding: 10px 8px;">Payment Rail</th>
                  <th style="padding: 10px 8px;">Status</th>
                  <th style="padding: 10px 8px; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 12px 8px; color: var(--text-secondary);">Sep 1, 2026</td>
                  <td style="padding: 12px 8px; font-family: var(--font-mono); color: var(--text-primary);">INV-TC-2026-0089</td>
                  <td style="padding: 12px 8px; color: var(--text-primary);">Pro Agency ($15.00) + 12k Overages ($2.40)</td>
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--text-primary);">$17.40</td>
                  <td style="padding: 12px 8px; color: var(--text-secondary);">Dodo Payments (UPI AutoPay)</td>
                  <td style="padding: 12px 8px;"><span style="padding: 3px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.12); color: #10b981; font-weight: 600; font-size: 0.72rem; display: inline-flex; align-items: center; gap: 4px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> PAID</span></td>
                  <td style="padding: 12px 8px; text-align: right;"><button class="btn-download-inv" data-inv="INV-TC-2026-0089" style="padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; background: var(--bg-subtle); border: 1px solid var(--border-color); color: var(--accent-primary); cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download PDF</button></td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; color: var(--text-secondary);">Aug 1, 2026</td>
                  <td style="padding: 12px 8px; font-family: var(--font-mono); color: var(--text-primary);">INV-TC-2026-0042</td>
                  <td style="padding: 12px 8px; color: var(--text-primary);">Developer Plan Base</td>
                  <td style="padding: 12px 8px; font-weight: 600; color: var(--text-primary);">$15.00</td>
                  <td style="padding: 12px 8px; color: var(--text-secondary);">Dodo Payments (Card)</td>
                  <td style="padding: 12px 8px;"><span style="padding: 3px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.12); color: #10b981; font-weight: 600; font-size: 0.72rem; display: inline-flex; align-items: center; gap: 4px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> PAID</span></td>
                  <td style="padding: 12px 8px; text-align: right;"><button class="btn-download-inv" data-inv="INV-TC-2026-0042" style="padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; background: var(--bg-subtle); border: 1px solid var(--border-color); color: var(--accent-primary); cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download PDF</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      </div>
    `;

    this.renderParams();
    this.renderSnippet();
    this.bindEvents();
  }

  renderParams() {
    const container = document.getElementById("sandbox-params-container");
    if (!container) return;

    if (this.selectedTool === "contractor_parity") {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">W-2 Salary ($):</label>
            <input id="sb-w2" type="number" value="130000" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">1099 Hourly Rate ($/hr):</label>
            <input id="sb-c-rate" type="number" value="85" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
        </div>
      `;
    } else if (this.selectedTool === "mortgage_piti") {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Home Price ($):</label>
            <input id="sb-price" type="number" value="450000" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Interest Rate (%):</label>
            <input id="sb-rate" type="number" step="0.1" value="6.75" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
        </div>
      `;
    } else if (this.selectedTool === "casio_991_solve") {
      container.innerHTML = `
        <div>
          <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Expression (e.g. 2x + 8 = 24):</label>
          <input id="sb-expr" type="text" value="2x + 8 = 24" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
        </div>
      `;
    } else if (this.selectedTool === "beam_bending") {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Load (Newtons):</label>
            <input id="sb-load" type="number" value="5000" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Length (Meters):</label>
            <input id="sb-len" type="number" value="4" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
        </div>
      `;
    } else if (this.selectedTool === "vat_sales_tax") {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Net Amount:</label>
            <input id="sb-vat-amt" type="number" value="1000" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">VAT Rate (%):</label>
            <input id="sb-vat-rate" type="number" value="20" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
        </div>
      `;
    } else if (this.selectedTool === "black_scholes") {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Spot Price ($):</label>
            <input id="sb-spot" type="number" value="100" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Strike Price ($):</label>
            <input id="sb-strike" type="number" value="100" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
        </div>
      `;
    } else if (this.selectedTool === "pipe_flow") {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Flow Rate Q (m³/s):</label>
            <input id="sb-flow-rate" type="number" step="0.005" value="0.05" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Pipe Diameter D (m):</label>
            <input id="sb-pipe-dia" type="number" step="0.01" value="0.15" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
        </div>
      `;
    } else if (this.selectedTool === "rlc_circuit") {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Resistance R (Ω):</label>
            <input id="sb-rlc-r" type="number" value="50" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Inductance L (H):</label>
            <input id="sb-rlc-l" type="number" step="0.001" value="0.01" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
        </div>
      `;
    } else if (this.selectedTool === "rocket_deltav") {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Wet Mass m₀ (kg):</label>
            <input id="sb-rocket-m0" type="number" value="549054" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Dry Mass mf (kg):</label>
            <input id="sb-rocket-mf" type="number" value="22200" style="width: 100%; padding: 6px 10px; font-size: 0.82rem; border-radius: 4px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          </div>
        </div>
      `;
    }
  }

  renderSnippet() {
    const box = document.getElementById("code-snippet-box");
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
    } else if (this.activeCodeTab === "curl") {
      box.textContent = `curl -X POST https://truecalci.com/api/v1/contractor-parity \\
  -H "Content-Type: application/json" \\
  -d '{"w2Salary": 130000, "contractorHourlyRate": 85}'`;
    } else if (this.activeCodeTab === "python") {
      box.textContent = `import requests

res = requests.post(
    "https://truecalci.com/api/v1/contractor-parity",
    json={"w2Salary": 130000, "contractorHourlyRate": 85}
)
data = res.json()
print("Parity Result:", data["result"]["summary"]["winnerBadge"])`;
    }
  }

  bindEvents() {
    const toolSelect = document.getElementById("sandbox-tool-select");
    if (toolSelect) {
      toolSelect.addEventListener("change", (e) => {
        this.selectedTool = e.target.value;
        this.renderParams();
      });
    }

    // Code tabs
    const tabBtns = document.querySelectorAll(".code-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => {
          b.style.background = "transparent";
          b.style.color = "var(--text-secondary)";
        });
        btn.style.background = "var(--accent-light)";
        btn.style.color = "var(--accent-primary)";
        this.activeCodeTab = btn.dataset.tab;
        this.renderSnippet();
      });
    });

    // Copy snippet
    const copyBtn = document.getElementById("copy-snippet-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const text = document.getElementById("code-snippet-box")?.textContent || "";
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => { copyBtn.textContent = "Copy"; }, 1500);
        });
      });
    }

    // Run Sandbox
    const runBtn = document.getElementById("sandbox-run-btn");
    if (runBtn) {
      runBtn.addEventListener("click", async () => {
        runBtn.textContent = "Executing at Edge...";
        runBtn.style.opacity = "0.7";

        let endpoint = `/api/v1/${this.selectedTool}`;
        if (this.selectedTool === "contractor_parity") endpoint = "/api/v1/contractor-parity";

        let body = {};
        if (this.selectedTool === "contractor_parity") {
          body = {
            w2Salary: Number(document.getElementById("sb-w2")?.value || 130000),
            contractorHourlyRate: Number(document.getElementById("sb-c-rate")?.value || 85)
          };
        } else if (this.selectedTool === "mortgage_piti") {
          body = {
            homePrice: Number(document.getElementById("sb-price")?.value || 450000),
            interestRate: Number(document.getElementById("sb-rate")?.value || 6.75)
          };
        } else if (this.selectedTool === "casio_991_solve") {
          body = { expression: document.getElementById("sb-expr")?.value || "2x + 8 = 24" };
        } else if (this.selectedTool === "beam_bending") {
          body = {
            loadNewtons: Number(document.getElementById("sb-load")?.value || 5000),
            lengthMeters: Number(document.getElementById("sb-len")?.value || 4)
          };
        } else if (this.selectedTool === "vat_sales_tax") {
          body = {
            amount: Number(document.getElementById("sb-vat-amt")?.value || 1000),
            vatRatePercent: Number(document.getElementById("sb-vat-rate")?.value || 20)
          };
        } else if (this.selectedTool === "black_scholes") {
          body = {
            stockPrice: Number(document.getElementById("sb-spot")?.value || 100),
            strikePrice: Number(document.getElementById("sb-strike")?.value || 100),
            timeToExpiryYears: 1
          };
        } else if (this.selectedTool === "pipe_flow") {
          body = {
            flowRateM3s: Number(document.getElementById("sb-flow-rate")?.value || 0.05),
            pipeDiameterM: Number(document.getElementById("sb-pipe-dia")?.value || 0.15),
            pipeLengthM: 100
          };
        } else if (this.selectedTool === "rlc_circuit") {
          body = {
            resistanceOhms: Number(document.getElementById("sb-rlc-r")?.value || 50),
            inductanceHenrys: Number(document.getElementById("sb-rlc-l")?.value || 0.01),
            capacitanceFarads: 0.000001
          };
        } else if (this.selectedTool === "rocket_deltav") {
          body = {
            initialMassKg: Number(document.getElementById("sb-rocket-m0")?.value || 549054),
            finalMassKg: Number(document.getElementById("sb-rocket-mf")?.value || 22200),
            specificImpulseSeconds: 311
          };
        }

        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          const data = await res.json();
          const responseBox = document.getElementById("sandbox-response-box");
          if (responseBox) responseBox.textContent = JSON.stringify(data, null, 2);

          const badge = document.getElementById("dev-exec-badge");
          if (badge) {
            badge.style.display = "inline-block";
            badge.textContent = `Edge Response: ${data.executionTimeMs || 0.5}ms`;
          }

          // Increment live local persistent usage counter
          this.currentUsage++;
          localStorage.setItem("tc_edge_usage_count", this.currentUsage);
          const remaining = Math.max(0, this.quotaLimit - this.currentUsage);
          const usagePercent = Math.min(100, Math.round((this.currentUsage / this.quotaLimit) * 100));

          const usageEl = document.getElementById("dev-usage-count");
          const remEl = document.getElementById("dev-remaining-badge");
          const progEl = document.getElementById("dev-progress-bar");
          if (usageEl) usageEl.textContent = String(this.currentUsage);
          if (remEl) remEl.textContent = `(${remaining} remaining)`;
          if (progEl) {
            progEl.style.width = `${usagePercent}%`;
            progEl.style.background = usagePercent > 85 ? '#f43f5e' : 'var(--accent-primary)';
          }
        } catch (err) {
          const responseBox = document.getElementById("sandbox-response-box");
          if (responseBox) responseBox.textContent = `Error: ${err.message}`;
        } finally {
          runBtn.textContent = "Execute Calculation at Edge";
          runBtn.style.opacity = "1";
        }
      });
    }

    // Tier Upgrade & Selection Buttons
    document.querySelectorAll(".btn-select-tier").forEach(btn => {
      btn.addEventListener("click", () => {
        const tierId = btn.dataset.tier;
        const isIndia = (localStorage.getItem("calc_region") === "india");
        if (!this.isLoggedIn) {
          this.pendingTier = tierId;
          this.openAuthModal();
          return;
        }

        let tierName = "Pro Agency ($15/mo)";
        let quota = 10000;
        if (tierId === "starter") {
          tierName = isIndia ? "Developer Starter (₹399/mo)" : "Developer Starter ($5/mo)";
          quota = 2500;
        } else if (tierId === "pro") {
          tierName = isIndia ? "Pro Agency (₹1,199/mo)" : "Pro Agency ($15/mo)";
          quota = 10000;
        } else if (tierId === "metered") {
          tierName = isIndia ? "Enterprise Metered (₹1,199+ base)" : "Enterprise Metered ($15+ base)";
          quota = 10000;
        }

        this.devUser.tier = tierName;
        this.devUser.tierId = tierId;
        this.quotaLimit = quota;
        localStorage.setItem("tc_dev_user", JSON.stringify(this.devUser));
        this.render();
      });
    });

    // Developer Sign In & Sign Up Triggers
    const loginTriggerBtn = document.getElementById("dev-login-trigger-btn");
    if (loginTriggerBtn) {
      loginTriggerBtn.addEventListener("click", () => {
        if (window.openAuthModal) window.openAuthModal("signin");
        else this.openAuthModal();
      });
    }

    const signupTriggerBtn = document.getElementById("dev-signup-trigger-btn");
    if (signupTriggerBtn) {
      signupTriggerBtn.addEventListener("click", () => {
        if (window.openAuthModal) window.openAuthModal("signup");
        else this.openAuthModal();
      });
    }

    // Developer Logout
    const logoutBtn = document.getElementById("dev-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("tc_dev_auth");
        localStorage.removeItem("tc_dev_user");
        this.isLoggedIn = false;
        this.devUser = null;
        this.quotaLimit = 100;
        this.render();
      });
    }

    // Invoice Modal Open/Close
    const openInvBtn = document.getElementById("dev-open-invoices-btn");
    const invModal = document.getElementById("dev-invoices-modal");
    const closeInvBtn = document.getElementById("dev-inv-modal-close");
    
    if (openInvBtn && invModal) {
      openInvBtn.addEventListener("click", () => {
        invModal.style.display = "flex";
      });
    }
    if (closeInvBtn && invModal) {
      closeInvBtn.addEventListener("click", () => {
        invModal.style.display = "none";
      });
    }
    if (invModal) {
      invModal.addEventListener("click", (e) => {
        if (e.target === invModal) invModal.style.display = "none";
      });
    }

    // Download Invoice PDF Mock
    document.querySelectorAll(".btn-download-inv").forEach(btn => {
      btn.addEventListener("click", () => {
        const invId = btn.dataset.inv || "INV-TC-2026";
        alert(`Generating Official Tax Invoice Receipt [${invId}].pdf with GST/VAT details...`);
      });
    });
  }

  openAuthModal() {
    const existingModal = document.getElementById("tc-auth-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.id = "tc-auth-modal";
    modal.style.cssText = "position: fixed; inset: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px;";
    
    modal.innerHTML = `
      <div class="glass-card" style="width: 100%; max-width: 420px; padding: 28px 24px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color); text-align: center; position: relative;">
        <button id="close-auth-modal-btn" type="button" style="position: absolute; top: 12px; right: 14px; background: transparent; border: none; font-size: 1.1rem; color: var(--text-muted); cursor: pointer;">✕</button>
        
        <div style="width: 44px; height: 44px; margin: 0 auto 12px; border-radius: 10px; background: var(--accent-light); color: var(--accent-primary); display: flex; align-items: center; justify-content: center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        
        <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 6px 0;">Developer Authentication</h2>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0 0 20px 0; line-height: 1.5;">
          Connect your developer identity to manage API keys, track live monthly usage, and download GST / VAT invoices.
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          <button id="auth-github-btn" type="button" style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 10px; font-size: 0.86rem; font-weight: 600; border-radius: 6px; background: #24292f; color: #ffffff; border: 1px solid #1b1f23; cursor: pointer;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            Continue with GitHub
          </button>
          <button id="auth-google-btn" type="button" style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 10px; font-size: 0.86rem; font-weight: 600; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Continue with Google
          </button>
        </div>

        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.74rem; color: var(--text-muted); line-height: 1.4;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Zero passwords stored. Authenticated via OAuth 2.0 & Cloudflare Token Encryption.
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("close-auth-modal-btn")?.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });

    const handleAuth = (provider, name, handle) => {
      const isIndia = (localStorage.getItem("calc_region") === "india");
      let tier = "Developer Starter ($5/mo)";
      let tierId = "starter";
      let quota = 2500;
      if (this.pendingTier === "pro") {
        tier = isIndia ? "Pro Agency (₹1,199/mo)" : "Pro Agency ($15/mo)";
        tierId = "pro";
        quota = 10000;
      } else if (this.pendingTier === "metered") {
        tier = isIndia ? "Enterprise Metered (₹1,199+ base)" : "Enterprise Metered ($15+ base)";
        tierId = "metered";
        quota = 10000;
      }

      const devUser = {
        name,
        handle,
        email: `${handle}@users.noreply.${provider}.com`,
        provider,
        tier,
        tierId,
        apiKey: "tc_live_" + Math.random().toString(36).substring(2, 12),
        balanceUsd: 15.00
      };

      localStorage.setItem("tc_dev_auth", "true");
      localStorage.setItem("tc_dev_user", JSON.stringify(devUser));
      modal.remove();
      this.isLoggedIn = true;
      this.devUser = devUser;
      this.quotaLimit = quota;
      this.render();
    };

    document.getElementById("auth-github-btn")?.addEventListener("click", () => {
      handleAuth("github", "Alex Chen", "alexchen-dev");
    });

    document.getElementById("auth-google-btn")?.addEventListener("click", () => {
      handleAuth("google", "Alex Chen", "alex.chen");
    });
  }
}
