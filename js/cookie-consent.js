/**
 * TrueCalci Cookie & Consent Mode v2 Manager
 * Fully compliant with Google Consent Mode v2, GDPR, and ePrivacy Directive.
 */
(function() {
  function getConsent() {
    try {
      return localStorage.getItem('tc_consent_analytics');
    } catch (e) {
      return null;
    }
  }

  function setConsent(status) {
    try {
      localStorage.setItem('tc_consent_analytics', status);
    } catch (e) {}

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': status,
        'analytics_storage': status,
        'ad_user_data': status,
        'ad_personalization': status
      });
    }
  }

  function renderBanner() {
    if (document.getElementById('tc-cookie-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'tc-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie and Privacy Preferences');
    banner.innerHTML = `
      <div class="tc-cookie-content">
        <div class="tc-cookie-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #6366f1;">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
            <path d="M2 12h20"></path>
          </svg>
          <span class="tc-cookie-title">Privacy & Cookie Preferences</span>
        </div>
        <p class="tc-cookie-text">
          TrueCalci uses privacy-preserving cookies and edge telemetry to measure computational usage and ensure system reliability. You can accept all or customize below. See our <a href="/privacy.html" class="tc-cookie-link">Privacy Policy</a>.
        </p>
        <div class="tc-cookie-actions">
          <button type="button" id="tc-cookie-accept" class="tc-btn-accept">Accept All</button>
          <button type="button" id="tc-cookie-decline" class="tc-btn-decline">Essential Only</button>
        </div>
      </div>
    `;

    // Inject styles
    if (!document.getElementById('tc-cookie-styles')) {
      const style = document.createElement('style');
      style.id = 'tc-cookie-styles';
      style.textContent = `
        #tc-cookie-banner {
          position: fixed;
          bottom: 20px;
          right: 20px;
          max-width: 420px;
          width: calc(100% - 40px);
          background: rgba(18, 24, 38, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(99, 102, 241, 0.3);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 18px;
          z-index: 99999;
          contain: layout style paint;
          will-change: transform, opacity;
          transform: translateZ(0);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #f1f5f9;
          animation: tcSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-theme="light"] #tc-cookie-banner {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(99, 102, 241, 0.25);
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.15);
          color: #0f172a;
        }
        @keyframes tcSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tc-cookie-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .tc-cookie-title {
          font-size: 0.92rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        .tc-cookie-text {
          font-size: 0.81rem;
          line-height: 1.45;
          color: #94a3b8;
          margin: 0 0 14px 0;
        }
        [data-theme="light"] .tc-cookie-text {
          color: #475569;
        }
        .tc-cookie-link {
          color: #818cf8;
          text-decoration: underline;
        }
        [data-theme="light"] .tc-cookie-link {
          color: #4f46e5;
        }
        .tc-cookie-actions {
          display: flex;
          gap: 10px;
        }
        .tc-btn-accept, .tc-btn-decline {
          flex: 1;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }
        .tc-btn-accept {
          background: #6366f1;
          border: 1px solid #4f46e5;
          color: #ffffff;
        }
        .tc-btn-accept:hover {
          background: #4f46e5;
        }
        .tc-btn-decline {
          background: transparent;
          border: 1px solid rgba(148, 163, 184, 0.3);
          color: #94a3b8;
        }
        [data-theme="light"] .tc-btn-decline {
          color: #475569;
          border-color: rgba(71, 85, 105, 0.3);
        }
        .tc-btn-decline:hover {
          background: rgba(148, 163, 184, 0.1);
          color: #f1f5f9;
        }
        [data-theme="light"] .tc-btn-decline:hover {
          color: #0f172a;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(banner);

    document.getElementById('tc-cookie-accept').addEventListener('click', function() {
      setConsent('granted');
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(10px)';
      banner.style.transition = 'all 0.2s ease';
      setTimeout(() => banner.remove(), 250);
    });

    document.getElementById('tc-cookie-decline').addEventListener('click', function() {
      setConsent('denied');
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(10px)';
      banner.style.transition = 'all 0.2s ease';
      setTimeout(() => banner.remove(), 250);
    });
  }

  // Bind manage-consent triggers across page
  function setupTriggers() {
    document.querySelectorAll('[data-action="open-cookie-preferences"], #manage-cookie-consent').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        renderBanner();
      });
    });
  }

  // Initialize
  function init() {
    setupTriggers();
    const existingConsent = getConsent();
    if (!existingConsent) {
      setTimeout(renderBanner, 800);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
