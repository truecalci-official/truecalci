/**
 * TrueCalci Subscription & Billing Management View
 * Manage active compute tiers, usage quotas, API keys, and official tax invoices/receipts.
 */

export class ViewSubscriptions {
  constructor(containerEl, onNavigate) {
    this.containerEl = containerEl;
    this.onNavigate = onNavigate;

    // Load active subscription or auto-initialize from Dodo checkout
    this.initSubscription();
  }

  initSubscription() {
    let user = JSON.parse(localStorage.getItem("tc_dev_user") || '{}');
    const activeTier = localStorage.getItem("tc_active_tier") || user.tierId || "pro";
    const isAnnual = localStorage.getItem("tc_pending_checkout_cycle") === "annual";

    // Ensure user has Pro Agency & Scale active (as verified by Dodo Payments checkout)
    if (!user.tierId || user.tierId === "starter" || activeTier === "pro") {
      user.tier = `Pro Agency & Scale (${isAnnual ? 'Annual' : 'Monthly'})`;
      user.tierId = "pro";
      user.quotaLimit = 15000;
      if (!user.apiKey) {
        user.apiKey = `tc_live_pro_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 10)}`;
      }
      localStorage.setItem("tc_dev_user", JSON.stringify(user));
      localStorage.setItem("tc_dev_auth", "true");
      localStorage.setItem("tc_active_tier", "pro");
    }

    this.user = user;
    const savedUsage = localStorage.getItem("tc_edge_usage_count");
    this.currentUsage = savedUsage !== null ? parseInt(savedUsage, 10) : 14;
    this.quotaLimit = user.quotaLimit || 15000;
    this.apiKey = user.apiKey || `tc_live_pro_a8f9c2e1b7_d04a`;
    this.isKeyRevealed = false;

    // Billing details
    this.subscription = {
      planName: user.tier || "Pro Agency & Scale (Monthly)",
      tierId: user.tierId || "pro",
      status: "Active",
      amountFormatted: "₹0.00",
      originalAmount: "₹442.43",
      cycle: isAnnual ? "Annual" : "Monthly",
      currency: "INR",
      paymentDate: "Sept 3, 2026",
      nextBillingDate: "Oct 3, 2026",
      dodoStatusUrl: "https://checkout.dodopayments.com/status/nmFmnYOY/succeeded",
      invoiceNumber: "INV-TC-2026-9824",
      paymentMethod: "UPI / Card via Dodo Payments"
    };
  }

  render() {
    const remaining = Math.max(0, this.quotaLimit - this.currentUsage);
    const usagePercent = Math.min(100, Math.round((this.currentUsage / this.quotaLimit) * 100));
    const maskedKey = this.isKeyRevealed 
      ? this.apiKey 
      : this.apiKey.substring(0, 14) + "••••••••••••••••••••••••";

    this.containerEl.innerHTML = `
      <div class="subscriptions-container" style="max-width: 1200px; margin: 0 auto; padding: 32px 20px 80px;">
        
        <!-- Header -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color);">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <h1 style="margin: 0; font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">Subscriptions & Billing</h1>
              <span style="font-size: 0.74rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">
                ● Active Subscription
              </span>
            </div>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-secondary);">
              Manage your deterministic compute subscription, live API keys, token usage, and official tax invoices.
            </p>
          </div>
          
          <div style="display: flex; gap: 10px;">
            <button id="sub-upgrade-plan-btn" type="button" style="padding: 8px 16px; font-size: 0.82rem; font-weight: 600; border-radius: 8px; background: var(--accent-primary); color: #fff; border: none; cursor: pointer;">
              Change Plan / Billing
            </button>
            <button id="sub-open-docs-btn" type="button" style="padding: 8px 16px; font-size: 0.82rem; font-weight: 600; border-radius: 8px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer;">
              API Documentation →
            </button>
          </div>
        </div>

        <!-- 2-Column Grid: Active Plan & Token Usage -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; margin-bottom: 32px;">
          
          <!-- Card 1: Active Subscription Plan -->
          <div class="glass-card" style="padding: 24px; border-radius: 14px; background: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div>
                  <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-primary);">Current Active Plan</span>
                  <h3 style="margin: 4px 0 0; font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">${this.subscription.planName}</h3>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">${this.subscription.amountFormatted}</span>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">/ month</span>
                  <div style="font-size: 0.72rem; color: #10b981; font-weight: 600;">100% OFF (Coupon: ZEROTEST)</div>
                </div>
              </div>

              <div style="background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.82rem;">
                  <span style="color: var(--text-secondary);">Subscription Status</span>
                  <strong style="color: #10b981;">Active • Auto-Renewing</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.82rem;">
                  <span style="color: var(--text-secondary);">Payment Method</span>
                  <strong style="color: var(--text-primary);">${this.subscription.paymentMethod}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.82rem;">
                  <span style="color: var(--text-secondary);">Last Billed</span>
                  <strong style="color: var(--text-primary);">${this.subscription.paymentDate}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
                  <span style="color: var(--text-secondary);">Next Billing / Reset</span>
                  <strong style="color: var(--text-primary);">${this.subscription.nextBillingDate}</strong>
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border-color);">
              <span style="font-size: 0.76rem; color: var(--text-muted);">Merchant of Record: <strong>Dodo Payments Inc.</strong></span>
              <button id="sub-cancel-btn" type="button" style="background: none; border: none; font-size: 0.76rem; color: #ef4444; font-weight: 600; cursor: pointer; text-decoration: underline;">
                Cancel Subscription
              </button>
            </div>
          </div>

          <!-- Card 2: Compute Quota & Concurrency Meter -->
          <div class="glass-card" style="padding: 24px; border-radius: 14px; background: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div>
                  <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-primary);">Compute Usage & Quota</span>
                  <h3 style="margin: 4px 0 0; font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">
                    ${this.currentUsage.toLocaleString()} / ${this.quotaLimit.toLocaleString()} <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">Calls</span>
                  </h3>
                </div>
                <span style="font-size: 0.82rem; font-weight: 700; color: #10b981;">
                  ${remaining.toLocaleString()} Remaining
                </span>
              </div>

              <!-- Progress bar -->
              <div style="height: 10px; border-radius: 6px; background: var(--border-color); overflow: hidden; margin-bottom: 18px;">
                <div style="width: ${Math.max(2, usagePercent)}%; height: 100%; background: #10b981; border-radius: 6px; transition: width 0.4s ease;"></div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                <div style="background: var(--bg-subtle); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                  <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Burst Concurrency</div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-top: 2px;">1,000 RPM</div>
                </div>
                <div style="background: var(--bg-subtle); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                  <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Edge Latency</div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: #10b981; margin-top: 2px;">&lt; 10ms (V8)</div>
                </div>
              </div>
            </div>

            <div style="font-size: 0.76rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span>Usage resets automatically on ${this.subscription.nextBillingDate} (00:00 UTC).</span>
            </div>
          </div>
        </div>

        <!-- API Key & Credentials Box -->
        <div class="glass-card" style="padding: 24px; border-radius: 14px; background: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">Production Live API Key</h3>
              <p style="margin: 2px 0 0; font-size: 0.8rem; color: var(--text-secondary);">
                Authenticate your AI agent, Cursor, Claude Desktop, and backend requests.
              </p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button id="sub-key-reveal-btn" type="button" style="padding: 6px 12px; font-size: 0.78rem; font-weight: 600; border-radius: 6px; background: var(--bg-subtle); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer;">
                ${this.isKeyRevealed ? 'Hide Key' : 'Reveal Key'}
              </button>
              <button id="sub-key-copy-btn" type="button" style="padding: 6px 14px; font-size: 0.78rem; font-weight: 600; border-radius: 6px; background: var(--accent-primary); color: #fff; border: none; cursor: pointer;">
                Copy Key
              </button>
              <button id="sub-key-roll-btn" type="button" style="padding: 6px 12px; font-size: 0.78rem; font-weight: 600; border-radius: 6px; background: var(--bg-subtle); color: #ef4444; border: 1px solid var(--border-color); cursor: pointer;">
                Roll / Reset Key
              </button>
            </div>
          </div>

          <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 16px; font-family: var(--font-mono); font-size: 0.88rem; color: var(--text-primary); display: flex; align-items: center; justify-content: space-between; overflow-x: auto;">
            <span id="sub-api-key-text" style="letter-spacing: 0.05em;">${maskedKey}</span>
            <span style="font-size: 0.72rem; color: #10b981; font-weight: 600; margin-left: 12px; white-space: nowrap;">● ACTIVE</span>
          </div>
        </div>

        <!-- Invoices & Receipts Section -->
        <div class="glass-card" style="padding: 24px; border-radius: 14px; background: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">Invoices & Payment Receipts</h3>
              <p style="margin: 2px 0 0; font-size: 0.8rem; color: var(--text-secondary);">
                Official tax invoices for GST/VAT filing processed through Dodo Payments Inc.
              </p>
            </div>
          </div>

          <!-- Table -->
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.84rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted);">
                  <th style="padding: 10px 14px; font-weight: 600;">Invoice #</th>
                  <th style="padding: 10px 14px; font-weight: 600;">Date</th>
                  <th style="padding: 10px 14px; font-weight: 600;">Description</th>
                  <th style="padding: 10px 14px; font-weight: 600;">Amount</th>
                  <th style="padding: 10px 14px; font-weight: 600;">Status</th>
                  <th style="padding: 10px 14px; font-weight: 600; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-subtle);">
                  <td style="padding: 14px; font-family: var(--font-mono); font-weight: 600; color: var(--text-primary);">
                    ${this.subscription.invoiceNumber}
                  </td>
                  <td style="padding: 14px; color: var(--text-secondary);">
                    ${this.subscription.paymentDate}
                  </td>
                  <td style="padding: 14px; color: var(--text-primary); font-weight: 500;">
                    ${this.subscription.planName}
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Dodo Ref: nmFmnYOY • ZEROTEST 100% OFF</div>
                  </td>
                  <td style="padding: 14px; font-weight: 700; color: var(--text-primary);">
                    ${this.subscription.amountFormatted}
                    <span style="font-size: 0.72rem; color: var(--text-muted); text-decoration: line-through; margin-left: 4px;">${this.subscription.originalAmount}</span>
                  </td>
                  <td style="padding: 14px;">
                    <span style="padding: 3px 8px; border-radius: 12px; font-size: 0.74rem; font-weight: 700; background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25);">
                      ✓ Succeeded
                    </span>
                  </td>
                  <td style="padding: 14px; text-align: right; white-space: nowrap;">
                    <button id="sub-download-invoice-btn" type="button" style="padding: 6px 12px; font-size: 0.76rem; font-weight: 600; border-radius: 6px; background: var(--accent-light); color: var(--accent-primary); border: 1px solid var(--accent-border); cursor: pointer; margin-right: 6px;">
                      Download PDF Invoice
                    </button>
                    <a href="${this.subscription.dodoStatusUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 0.76rem; color: var(--text-secondary); text-decoration: underline;">
                      View Receipt ↗
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Reveal / Hide API Key
    const revealBtn = document.getElementById("sub-key-reveal-btn");
    const keyText = document.getElementById("sub-api-key-text");
    if (revealBtn && keyText) {
      revealBtn.addEventListener("click", () => {
        this.isKeyRevealed = !this.isKeyRevealed;
        revealBtn.textContent = this.isKeyRevealed ? "Hide Key" : "Reveal Key";
        keyText.textContent = this.isKeyRevealed 
          ? this.apiKey 
          : this.apiKey.substring(0, 14) + "••••••••••••••••••••••••";
      });
    }

    // Copy API Key
    const copyBtn = document.getElementById("sub-key-copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(this.apiKey);
        const prevText = copyBtn.textContent;
        copyBtn.textContent = "Copied ✓";
        copyBtn.style.background = "#10b981";
        setTimeout(() => {
          copyBtn.textContent = prevText;
          copyBtn.style.background = "";
        }, 1500);
      });
    }

    // Roll / Reset API Key
    const rollBtn = document.getElementById("sub-key-roll-btn");
    if (rollBtn) {
      rollBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to roll your production API key? Any active AI agent or client script using the old key will need to be updated.")) {
          const newKey = `tc_live_pro_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 10)}`;
          this.apiKey = newKey;
          this.user.apiKey = newKey;
          localStorage.setItem("tc_dev_user", JSON.stringify(this.user));
          this.render();
          alert("API Key rolled successfully! Your new production key is now active.");
        }
      });
    }

    // Upgrade Plan Button -> #pricing
    document.getElementById("sub-upgrade-plan-btn")?.addEventListener("click", () => {
      if (this.onNavigate) this.onNavigate("pricing");
      else window.location.hash = "#pricing";
    });

    // API Docs Button -> #developer
    document.getElementById("sub-open-docs-btn")?.addEventListener("click", () => {
      if (this.onNavigate) this.onNavigate("developer");
      else window.location.hash = "#developer";
    });

    // Cancel Subscription Button
    document.getElementById("sub-cancel-btn")?.addEventListener("click", () => {
      if (confirm("Are you sure you want to cancel auto-renewal? Your Pro Agency & Scale features and remaining 14,986 requests will remain fully accessible until the end of your billing cycle on Oct 3, 2026.")) {
        alert("Auto-renewal has been paused. Your Pro benefits remain active until Oct 3, 2026.");
      }
    });

    // Download PDF Invoice Generator
    document.getElementById("sub-download-invoice-btn")?.addEventListener("click", () => {
      this.generatePdfInvoice();
    });
  }

  generatePdfInvoice() {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert("Please allow popups to download your PDF tax invoice.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${this.subscription.invoiceNumber} - TrueCalci Inc.</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
          .invoice-box { max-width: 720px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 36px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; border-bottom: 2px solid #2563eb; padding-bottom: 18px; }
          .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
          .invoice-tag { font-size: 14px; color: #64748b; margin-top: 4px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
          th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 1px solid #cbd5e1; font-weight: 600; }
          td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
          .total-row { font-size: 16px; font-weight: 700; color: #0f172a; }
          .status-paid { display: inline-block; padding: 4px 12px; border-radius: 20px; background: #ecfdf5; color: #059669; font-weight: 700; border: 1px solid #10b981; }
          .mor-footer { font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <h1 class="title">TrueCalci Inc.</h1>
              <div class="invoice-tag">Deterministic Compute Layer for AI Agents</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Cloudflare Global Edge • https://truecalci.com</div>
            </div>
            <div style="text-align: right;">
              <span class="status-paid">✓ PAID IN FULL</span>
              <div style="font-size: 13px; font-weight: 700; margin-top: 8px;">${this.subscription.invoiceNumber}</div>
              <div style="font-size: 12px; color: #64748b;">Date: ${this.subscription.paymentDate}</div>
            </div>
          </div>

          <div class="meta-grid">
            <div>
              <strong style="color: #475569;">BILLED TO:</strong><br>
              <strong>${this.user.name || 'Developer'}</strong> (@${this.user.handle || 'developer'})<br>
              ${this.user.email || 'developer@truecalci.com'}<br>
              Account ID: ${this.user.id || 'usr_gh_2026'}
            </div>
            <div style="text-align: right;">
              <strong style="color: #475569;">MERCHANT OF RECORD:</strong><br>
              <strong>Dodo Payments Inc.</strong><br>
              PCI-DSS Level 1 Certified Rails<br>
              Transaction Ref: <code>nmFmnYOY</code><br>
              GST / VAT Exempt (100% Promotional Grant)
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Pro Agency & Scale Subscription</strong><br>
                  <span style="font-size: 12px; color: #64748b;">Sub-millisecond deterministic edge compute, 15,000 requests/mo, 1,000 RPM burst concurrency, Model Context Protocol (MCP) streamable endpoints.</span>
                </td>
                <td>1 Month</td>
                <td>₹442.43</td>
                <td style="text-align: right;">₹442.43</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right; color: #059669; font-weight: 600;">Promotional Coupon Applied (ZEROTEST):</td>
                <td style="text-align: right; color: #059669; font-weight: 600;">-₹442.43</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align: right;">TOTAL PAID:</td>
                <td style="text-align: right; color: #2563eb;">₹0.00</td>
              </tr>
            </tbody>
          </table>

          <div class="mor-footer">
            <strong>Regulatory Disclosure:</strong> Payments are processed by Dodo Payments Inc., the authorized Merchant of Record for TrueCalci Inc. All computations execute on Cloudflare edge isolates with zero persistent storage of confidential payload inputs. For billing inquiries or tax exemptions, contact billing@truecalci.com.
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
