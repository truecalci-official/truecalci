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
    this.currentUsage = 68; // Simulated or fetched from edge headers
    this.quotaLimit = 100;
  }

  render() {
    const remaining = Math.max(0, this.quotaLimit - this.currentUsage);
    const usagePercent = Math.min(100, Math.round((this.currentUsage / this.quotaLimit) * 100));

    this.containerEl.innerHTML = `
      <div class="dev-portal-wrapper" style="max-width: 1280px; margin: 0 auto; padding: 24px 16px;">
        
        <!-- Hero Header -->
        <header style="margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <h1 style="margin: 0; font-size: 1.4rem; font-weight: 600; color: var(--text-primary); letter-spacing: -0.02em;">Developer & AI Agent Hub</h1>
              <span style="font-size: 0.72rem; padding: 3px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid var(--border-color); font-weight: 600;">Streamable HTTP MCP v1</span>
            </div>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-secondary); max-width: 780px;">
              Sub-10ms deterministic mathematical and financial calculations running at Cloudflare's global edge. Accessible directly via Model Context Protocol (MCP) or standard REST API endpoints.
            </p>
          </div>

          <!-- Quick Link to Admin -->
          <div>
            <a href="#admin" style="font-size: 0.8rem; padding: 8px 14px; border-radius: 6px; background: var(--bg-surface); color: var(--text-secondary); border: 1px solid var(--border-color); text-decoration: none;">
              Switch to Admin Telemetry →
            </a>
          </div>
        </header>

        <!-- Live 100-Requests Quota Meter Card -->
        <div class="glass-card" style="padding: 22px; border-radius: 10px; background: var(--bg-surface); border: 1px solid var(--border-color); margin-bottom: 28px;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 10px;">
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 4px;">Free Anonymous Allowance (Keyless per IP)</div>
              <div style="font-size: 1.15rem; font-weight: 600; color: var(--text-primary);">
                <span id="dev-usage-count">${this.currentUsage}</span> / ${this.quotaLimit} Requests Used this Month
                <span style="font-size: 0.85rem; font-weight: 400; color: #10b981; margin-left: 8px;">(${remaining} remaining)</span>
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
            </select>

            <!-- Dynamic Input Container -->
            <div id="sandbox-params-container" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
              <!-- Populated dynamically -->
            </div>

            <button id="sandbox-run-btn" type="button" style="width: 100%; padding: 10px 16px; font-size: 0.88rem; font-weight: 600; border-radius: 6px; background: var(--accent-primary); color: #ffffff; border: none; cursor: pointer; transition: opacity 0.2s;">
              Execute Calculation at Edge ⚡
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
              <button class="code-tab-btn" data-tab="mcp_claude" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 500; border-radius: 4px; background: rgba(99, 102, 241, 0.12); color: var(--accent-primary); border: none; cursor: pointer;">Claude Desktop</button>
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

            <div style="margin-top: 16px; padding: 12px; border-radius: 6px; background: rgba(99, 102, 241, 0.05); border: 1px solid var(--border-color); font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5;">
              <strong style="color: var(--text-primary);">Streamable HTTP Protocol:</strong> Connects directly over HTTP POST to <code style="font-family: var(--font-mono); color: var(--accent-primary);">https://truecalci.com/api/v1/mcp</code> without requiring a local Node process or stdio bridge.
            </div>
          </div>

        </div>

        <!-- Developer Pricing Tiers Card -->
        <div style="margin-top: 16px;">
          <h2 style="font-size: 1.15rem; font-weight: 600; color: var(--text-primary); margin-bottom: 14px; text-align: center;">Developer & Agent Access Tiers</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            
            <!-- Tier 1: Free Anonymous -->
            <div class="glass-card" style="padding: 22px; border-radius: 10px; background: var(--bg-surface); border: 1px solid var(--border-color);">
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Anonymous Agent</div>
              <div style="font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin: 6px 0;">$0 <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-muted);">/ month</span></div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 14px;">Instant keyless testing for AI bots, developers, and researchers.</p>
              <ul style="padding-left: 18px; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px;">
                <li>100 requests / month per IP</li>
                <li>20 requests / minute burst limit</li>
                <li>Access to all 13 core math engines</li>
                <li>Standard Streamable HTTP MCP</li>
              </ul>
              <span style="display: block; text-align: center; font-size: 0.82rem; font-weight: 600; color: #10b981; padding: 8px; border-radius: 6px; background: rgba(16, 185, 129, 0.1);">Active Default (No Signup)</span>
            </div>

            <!-- Tier 2: Developer Starter -->
            <div class="glass-card" style="padding: 22px; border-radius: 10px; background: var(--bg-surface); border: 2px solid var(--accent-primary); position: relative;">
              <span style="position: absolute; top: -10px; right: 16px; font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 10px; background: var(--accent-primary); color: #ffffff;">MOST POPULAR</span>
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--accent-primary); text-transform: uppercase;">Developer Starter</div>
              <div style="font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin: 6px 0;">$5 <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-muted);">/ month</span></div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 14px;">For independent creators, autonomous agents, and micro-SaaS builders.</p>
              <ul style="padding-left: 18px; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px;">
                <li><strong>25,000 requests / month</strong></li>
                <li>300 requests / minute rate limit</li>
                <li>Dedicated personal API Key (<code style="font-family: var(--font-mono);">tc_live_...</code>)</li>
                <li>Sub-5ms prioritized edge execution</li>
              </ul>
              <button type="button" style="width: 100%; padding: 8px; font-size: 0.82rem; font-weight: 600; border-radius: 6px; background: var(--accent-primary); color: #ffffff; border: none; cursor: pointer;">Get Starter Key ($5/mo)</button>
            </div>

            <!-- Tier 3: Pro Agency -->
            <div class="glass-card" style="padding: 22px; border-radius: 10px; background: var(--bg-surface); border: 1px solid var(--border-color);">
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Pro Agency & Scale</div>
              <div style="font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin: 6px 0;">$15 <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-muted);">/ month</span></div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 14px;">For high-frequency agents, algorithmic trading desks, and agencies.</p>
              <ul style="padding-left: 18px; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px;">
                <li><strong>100,000 requests / month</strong></li>
                <li>1,000 requests / minute burst rate</li>
                <li>Multi-user team API keys</li>
                <li>99.99% Edge SLA Guarantee</li>
              </ul>
              <button type="button" style="width: 100%; padding: 8px; font-size: 0.82rem; font-weight: 600; border-radius: 6px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer;">Get Pro Key ($15/mo)</button>
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
        btn.style.background = "rgba(99, 102, 241, 0.12)";
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
            spotPrice: Number(document.getElementById("sb-spot")?.value || 100),
            strikePrice: Number(document.getElementById("sb-strike")?.value || 100),
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
          const responseBox = document.getElementById("sandbox-response-box");
          if (responseBox) responseBox.textContent = JSON.stringify(data, null, 2);

          const badge = document.getElementById("dev-exec-badge");
          if (badge) {
            badge.style.display = "inline-block";
            badge.textContent = `Edge Response: ${data.executionTimeMs || 0.5}ms`;
          }

          // Update remaining quota if returned
          if (data.quota && data.quota.remaining !== undefined) {
            const used = this.quotaLimit - data.quota.remaining;
            this.currentUsage = used;
            const usageEl = document.getElementById("dev-usage-count");
            const progEl = document.getElementById("dev-progress-bar");
            if (usageEl) usageEl.textContent = String(used);
            if (progEl) progEl.style.width = `${Math.min(100, Math.round((used / this.quotaLimit) * 100))}%`;
          }
        } catch (err) {
          const responseBox = document.getElementById("sandbox-response-box");
          if (responseBox) responseBox.textContent = `Error: ${err.message}`;
        } finally {
          runBtn.textContent = "Execute Calculation at Edge ⚡";
          runBtn.style.opacity = "1";
        }
      });
    }
  }
}
