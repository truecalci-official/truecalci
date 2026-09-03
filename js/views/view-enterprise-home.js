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
    this.containerEl.innerHTML = `
      <div class="enterprise-home-root" style="max-width: 1320px; margin: 0 auto; padding: 0 16px 64px;">
        
        <!-- Top Announcement Banner (Tavily Style) -->
        <div class="announcement-banner" style="margin: 16px 0 28px; padding: 10px 16px; border-radius: 30px; background: rgba(79, 70, 229, 0.07); border: 1px solid rgba(79, 70, 229, 0.18); display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.82rem; color: var(--text-primary); text-align: center;">
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
              <span>🐙</span> Start Building Free (GitHub / Google)
            </button>
            <button id="hero-btn-launch-workstation" type="button" style="padding: 12px 24px; font-size: 0.92rem; font-weight: 600; border-radius: 8px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm); transition: transform 0.15s ease;">
              <span>🧮</span> Launch Workstation Studio (13 Calculators) →
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

            <!-- Tool Selector Tabs -->
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
              <button class="hero-tool-tab active" data-tool="contractor_parity" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-color); background: var(--accent-primary); color: #ffffff; cursor: pointer;">💼 Contractor Parity</button>
              <button class="hero-tool-tab" data-tool="casio_991_solve" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-subtle); color: var(--text-secondary); cursor: pointer;">🧮 Casio 991 Solver</button>
              <button class="hero-tool-tab" data-tool="mortgage_piti" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-subtle); color: var(--text-secondary); cursor: pointer;">🏠 US Mortgage PITI</button>
              <button class="hero-tool-tab" data-tool="beam_bending" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-subtle); color: var(--text-secondary); cursor: pointer;">📐 Beam Deflection</button>
              <button class="hero-tool-tab" data-tool="black_scholes" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-subtle); color: var(--text-secondary); cursor: pointer;">📈 Black-Scholes Delta</button>
            </div>

            <!-- Parameters Bar & Run Button -->
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; margin-bottom: 16px;">
              <div id="hero-sandbox-inputs-container">
                <!-- Dynamically populated based on active tool -->
              </div>
              <button id="hero-sandbox-run-btn" type="button" style="padding: 10px 20px; font-size: 0.88rem; font-weight: 600; border-radius: 6px; background: var(--accent-primary); color: #ffffff; border: none; cursor: pointer; white-space: nowrap; box-shadow: var(--shadow-sm);">
                Run Query ⚡
              </button>
            </div>

            <!-- Output Response Box -->
            <div style="position: relative; border-radius: 8px; background: #09090b; border: 1px solid rgba(255,255,255,0.1); padding: 14px; overflow: hidden;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 0.74rem; font-family: var(--font-mono); color: #a1a1aa;">Deterministic Edge Output</span>
                <button id="hero-copy-output-btn" type="button" style="font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.1); color: #ffffff; border: 1px solid rgba(255,255,255,0.15); cursor: pointer;">Copy Result</button>
              </div>
              <pre id="hero-sandbox-response" style="margin: 0; font-family: var(--font-mono); font-size: 0.8rem; color: #34d399; max-height: 180px; overflow-y: auto; white-space: pre-wrap;">Click "Run Query ⚡" to execute sub-millisecond calculation at Cloudflare edge...</pre>
            </div>
          </div>
        </section>

        <!-- Scale & Performance Proof Strip -->
        <section style="margin: 40px 0 60px; padding: 28px 20px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; text-align: center;">
            <div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em;">100%</div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Deterministic (Zero Hallucinations)</div>
            </div>
            <div>
              <div style="font-size: 2rem; font-weight: 800; color: #10b981; letter-spacing: -0.03em;">&lt;0.8ms</div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">p50 Global Edge Latency</div>
            </div>
            <div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--accent-primary); letter-spacing: -0.03em;">13 Engines</div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Finance, Math, Physics & Options</div>
            </div>
            <div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em;">99.99%</div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Edge SLA Guarantee</div>
            </div>
          </div>
        </section>

        <!-- 3-Pillar Enterprise Value Grid (Tavily "Loved by developers, built for enterprises") -->
        <section style="margin-bottom: 64px;">
          <div style="text-align: center; margin-bottom: 36px;">
            <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-primary); margin-bottom: 8px;">/ Engineering Philosophy</div>
            <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; margin: 0;">Loved by Developers, Built for Enterprises</h2>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
            <!-- Pillar 1 -->
            <div class="glass-card" style="padding: 28px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color);">
              <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(79, 70, 229, 0.1); color: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 16px;">
                🎯
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px;">Ground Models with Deterministic Precision</h3>
              <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                Large Language Models struggle with multi-bracket tax schedules, amortization integrals, and structural deflection. TrueCalci gives your agents an external, verified deterministic calculator that guarantees IEEE 754 precision.
              </p>
            </div>

            <!-- Pillar 2 -->
            <div class="glass-card" style="padding: 28px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color);">
              <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(16, 185, 129, 0.1); color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 16px;">
                ⚡
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px;">Handle Thousands of Calculations in Seconds</h3>
              <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                Engineered directly inside Cloudflare V8 isolates deployed across 330+ edge locations worldwide. Zero container boot times, zero cold starts, and lightning-fast concurrent execution as your agent traffic scales.
              </p>
            </div>

            <!-- Pillar 3 -->
            <div class="glass-card" style="padding: 28px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color);">
              <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(245, 158, 11, 0.1); color: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 16px;">
                🔒
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px;">Enterprise Safeguards & Zero Storage</h3>
              <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                Complete mathematical confidentiality. TrueCalci does not persist developer salaries, property values, or portfolio inputs on local disk databases. Requests are computed in transient memory and immediately purged.
              </p>
            </div>
          </div>
        </section>

        <!-- Developer Integration Terminal (Tabs: Claude Desktop, Cursor, Python, cURL) -->
        <section style="margin-bottom: 64px;">
          <div class="glass-card" style="padding: 28px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color);">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 12px;">
              <div>
                <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin: 0 0 4px;">Universal Streamable HTTP MCP Integration</h2>
                <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;">Plug TrueCalci directly into Claude Desktop, Cursor, or your custom agent workflow in 30 seconds.</p>
              </div>
              <!-- Code Tabs -->
              <div style="display: flex; gap: 6px; background: var(--bg-subtle); padding: 3px; border-radius: 6px; border: 1px solid var(--border-color);">
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

        <!-- Transparent 4-Tier Pricing Section -->
        <section id="pricing-section" style="margin-bottom: 64px;">
          <div style="text-align: center; margin-bottom: 36px;">
            <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-primary); margin-bottom: 8px;">/ Pricing Plans</div>
            <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; margin: 0 0 10px;">Find a Plan to Power Your Agents</h2>
            <p style="font-size: 0.88rem; color: var(--text-secondary); max-width: 620px; margin: 0 auto;">One unified parent account with transparent credit billing via UPI and global cards.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
            
            <!-- Tier 1: Free -->
            <div class="glass-card" style="padding: 24px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Anonymous Researcher</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin: 8px 0;">$0 <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-muted);">/ month</span></div>
                <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px;">Keyless instant testing for autonomous agents and students.</p>
                <ul style="padding-left: 18px; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px;">
                  <li>100 requests / month</li>
                  <li>No credit card required</li>
                  <li>All 13 math & finance engines</li>
                  <li>Streamable HTTP MCP</li>
                </ul>
              </div>
              <span style="display: block; text-align: center; font-size: 0.82rem; font-weight: 600; color: #10b981; padding: 10px; border-radius: 6px; background: rgba(16, 185, 129, 0.1);">Active Default</span>
            </div>

            <!-- Tier 2: Starter -->
            <div class="glass-card" style="padding: 24px; border-radius: 12px; background: var(--bg-surface); border: 2px solid var(--accent-primary); position: relative; display: flex; flex-direction: column; justify-content: space-between;">
              <span style="position: absolute; top: -11px; right: 16px; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 10px; background: var(--accent-primary); color: #ffffff;">POPULAR</span>
              <div>
                <div style="font-size: 0.78rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase;">Developer Starter</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin: 8px 0;">$5 <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-muted);">/ month</span></div>
                <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px;">For micro-SaaS builders and personal agent automations.</p>
                <ul style="padding-left: 18px; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px;">
                  <li><strong>25,000 requests / month</strong></li>
                  <li>Dedicated personal API key</li>
                  <li>300 requests / minute rate limit</li>
                  <li>Sub-5ms prioritized execution</li>
                </ul>
              </div>
              <button class="pricing-cta-btn" data-plan="starter" type="button" style="width: 100%; padding: 10px; font-size: 0.84rem; font-weight: 600; border-radius: 6px; background: var(--accent-primary); color: #ffffff; border: none; cursor: pointer;">Get Starter Key ($5/mo)</button>
            </div>

            <!-- Tier 3: Pro -->
            <div class="glass-card" style="padding: 24px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Pro Agency</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin: 8px 0;">$15 <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-muted);">/ month</span></div>
                <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px;">For high-volume agents and financial modeling teams.</p>
                <ul style="padding-left: 18px; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px;">
                  <li><strong>100,000 requests / month</strong></li>
                  <li>1,000 requests / minute burst rate</li>
                  <li>Multi-user team API keys</li>
                  <li>99.99% Edge SLA Guarantee</li>
                </ul>
              </div>
              <button class="pricing-cta-btn" data-plan="pro" type="button" style="width: 100%; padding: 10px; font-size: 0.84rem; font-weight: 600; border-radius: 6px; background: var(--bg-subtle); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer;">Get Pro Key ($15/mo)</button>
            </div>

            <!-- Tier 4: Enterprise Pay-As-You-Go -->
            <div class="glass-card" style="padding: 24px; border-radius: 12px; background: var(--bg-surface); border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 0.78rem; font-weight: 700; color: #10b981; text-transform: uppercase;">Enterprise Metered</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin: 8px 0;">$15+ <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-muted);">base + usage</span></div>
                <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px;">Metered billing beyond 100k calls with UPI and cards.</p>
                <ul style="padding-left: 18px; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px;">
                  <li><strong>100,000 base calls included</strong></li>
                  <li><strong>$0.20 per 1,000 extra calls</strong> (₹15 / 1k)</li>
                  <li>Instant UPI AutoPay & QR Code</li>
                  <li>Automated Monthly GST / VAT PDF Invoices</li>
                </ul>
              </div>
              <button class="pricing-cta-btn" data-plan="metered" type="button" style="width: 100%; padding: 10px; font-size: 0.84rem; font-weight: 600; border-radius: 6px; background: #10b981; color: #ffffff; border: none; cursor: pointer;">Enable Metered Usage ⚡</button>
            </div>

          </div>
        </section>

        <!-- Enterprise Compliance & Legal Footer (Tavily Style) -->
        <footer style="padding-top: 48px; border-top: 1px solid var(--border-color);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 32px; margin-bottom: 40px;">
            <!-- Col 1: Product -->
            <div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 14px;">Product</div>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.84rem; line-height: 2;">
                <li><a href="#home" style="color: var(--text-secondary); text-decoration: none;">Overview</a></li>
                <li><a href="#contractor_matrix" style="color: var(--text-secondary); text-decoration: none;">Workstation Studio</a></li>
                <li><a href="#pricing-section" style="color: var(--text-secondary); text-decoration: none;">Pricing Plans</a></li>
                <li><a href="#developer" style="color: var(--text-secondary); text-decoration: none;">Streamable MCP Server</a></li>
                <li><a href="https://truecalci.com/openapi.json" target="_blank" style="color: var(--text-secondary); text-decoration: none;">OpenAPI Spec</a></li>
              </ul>
            </div>

            <!-- Col 2: Solutions -->
            <div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 14px;">Solutions</div>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.84rem; line-height: 2;">
                <li><a href="#contractor_matrix" style="color: var(--text-secondary); text-decoration: none;">Remote Contractor Parity</a></li>
                <li><a href="#mortgage" style="color: var(--text-secondary); text-decoration: none;">Mortgage PITI & PMI</a></li>
                <li><a href="#tax" style="color: var(--text-secondary); text-decoration: none;">Income Tax & Slabs</a></li>
                <li><a href="#developer" style="color: var(--text-secondary); text-decoration: none;">Autonomous AI Agents</a></li>
              </ul>
            </div>

            <!-- Col 3: Resources -->
            <div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 14px;">Resources</div>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.84rem; line-height: 2;">
                <li><a href="engineering-formulas.html" style="color: var(--text-secondary); text-decoration: none;">Engineering Formulas</a></li>
                <li><a href="llms.txt" target="_blank" style="color: var(--text-secondary); text-decoration: none;">LLMs.txt Discovery</a></li>
                <li><a href=".well-known/api-catalog" target="_blank" style="color: var(--text-secondary); text-decoration: none;">RFC 9727 API Catalog</a></li>
                <li><a href=".well-known/security.txt" target="_blank" style="color: var(--text-secondary); text-decoration: none;">Security.txt (RFC 9116)</a></li>
              </ul>
            </div>

            <!-- Col 4: Company & Trust -->
            <div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 14px;">Company & Trust</div>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.84rem; line-height: 2;">
                <li><a href="#admin" style="color: var(--text-secondary); text-decoration: none;">Admin Telemetry</a></li>
                <li><a href="terms.html" style="color: var(--text-secondary); text-decoration: none;">Terms of Service</a></li>
                <li><a href="privacy.html" style="color: var(--text-secondary); text-decoration: none;">Privacy Policy</a></li>
                <li><a href="terms.html#compliance" style="color: var(--text-secondary); text-decoration: none;">Trust Center & Slabs</a></li>
              </ul>
            </div>
          </div>

          <!-- Bottom Legal & Compliance Strip (Tavily Format) -->
          <div style="padding-top: 24px; border-top: 1px solid var(--border-color); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px; font-size: 0.78rem; color: var(--text-muted);">
            <div>© 2026 TrueCalci Inc. All rights reserved. Precision mathematical compute at Cloudflare Edge.</div>
            <div style="display: flex; flex-wrap: wrap; gap: 14px;">
              <a href="terms.html" style="color: var(--text-secondary); text-decoration: none;">Website Terms</a>
              <a href="terms.html" style="color: var(--text-secondary); text-decoration: none;">Platform Terms</a>
              <a href="privacy.html" style="color: var(--text-secondary); text-decoration: none;">Privacy Policy</a>
              <a href="privacy.html#cookies" style="color: var(--text-secondary); text-decoration: none;">Cookie Notice</a>
              <a href="terms.html#aup" style="color: var(--text-secondary); text-decoration: none;">Acceptable Use</a>
              <a href="terms.html#trust" style="color: var(--text-secondary); text-decoration: none;">Trust Center</a>
              <a href="terms.html#accessibility" style="color: var(--text-secondary); text-decoration: none;">Accessibility</a>
            </div>
          </div>
        </footer>

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
    } else if (this.activeSandboxTool === "casio_991_solve") {
      container.innerHTML = `
        <input id="hero-sb-expr" type="text" value="2x + 8 = 24" placeholder="Algebraic Equation (e.g. 2x + 8 = 24)" style="width: 100%; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
      `;
    } else if (this.activeSandboxTool === "mortgage_piti") {
      container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <input id="hero-sb-price" type="number" value="450000" placeholder="Home Price ($)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          <input id="hero-sb-rate" type="number" step="0.1" value="6.75" placeholder="Interest Rate (%)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
        </div>
      `;
    } else if (this.activeSandboxTool === "beam_bending") {
      container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <input id="hero-sb-load" type="number" value="5000" placeholder="Load (Newtons)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          <input id="hero-sb-len" type="number" value="4" placeholder="Length (Meters)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
        </div>
      `;
    } else if (this.activeSandboxTool === "black_scholes") {
      container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <input id="hero-sb-spot" type="number" value="100" placeholder="Spot Price ($)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
          <input id="hero-sb-strike" type="number" value="100" placeholder="Strike Price ($)" style="flex: 1; min-width: 140px; padding: 8px 12px; font-size: 0.84rem; border-radius: 6px; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-color);">
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
    headers={"Authorization": "Bearer tc_live_your_key"}
)
print(res.json())`;
    } else if (this.activeCodeTab === "curl") {
      box.textContent = `curl -X POST https://truecalci.com/api/v1/contractor-parity \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer tc_live_your_key" \\
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
        if (this.activeSandboxTool === "contractor_parity") endpoint = "/api/v1/contractor-parity";

        let body = {};
        if (this.activeSandboxTool === "contractor_parity") {
          body = {
            w2Salary: Number(document.getElementById("hero-sb-w2")?.value || 130000),
            contractorHourlyRate: Number(document.getElementById("hero-sb-crate")?.value || 85)
          };
        } else if (this.activeSandboxTool === "casio_991_solve") {
          body = { expression: document.getElementById("hero-sb-expr")?.value || "2x + 8 = 24" };
        } else if (this.activeSandboxTool === "mortgage_piti") {
          body = {
            homePrice: Number(document.getElementById("hero-sb-price")?.value || 450000),
            interestRate: Number(document.getElementById("hero-sb-rate")?.value || 6.75)
          };
        } else if (this.activeSandboxTool === "beam_bending") {
          body = {
            loadNewtons: Number(document.getElementById("hero-sb-load")?.value || 5000),
            lengthMeters: Number(document.getElementById("hero-sb-len")?.value || 4)
          };
        } else if (this.activeSandboxTool === "black_scholes") {
          body = {
            spotPrice: Number(document.getElementById("hero-sb-spot")?.value || 100),
            strikePrice: Number(document.getElementById("hero-sb-strike")?.value || 100),
            timeToExpiryYears: 1
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
          runBtn.textContent = "Run Query ⚡";
          runBtn.style.opacity = "1";
        }
      });
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
      if (this.onNavigate) this.onNavigate("contractor_matrix");
      else window.location.hash = "#contractor_matrix";
    });

    // Start Free Button
    document.getElementById("hero-btn-start-free")?.addEventListener("click", () => {
      if (this.onNavigate) this.onNavigate("developer");
      else window.location.hash = "#developer";
    });

    // Pricing CTA Buttons
    document.querySelectorAll(".pricing-cta-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (this.onNavigate) this.onNavigate("developer");
        else window.location.hash = "#developer";
      });
    });
  }
}
