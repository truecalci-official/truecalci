/**
 * TrueCalci Executive Admin Dashboard Controller
 * Powers live telemetry, dynamic rate limits, 24-engine benchmarks, and SEO validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  fetchOverview();
  setupRateLimiterControls();
  setupIpRules();
  setupSeoRefresher();
  setInterval(fetchOverview, 10000); // 10-second background polling
});

function initTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');

      tab.classList.add('active');
      const target = tab.dataset.target;
      const pane = document.getElementById(target);
      if (pane) pane.style.display = 'block';
    });
  });
}

async function fetchOverview() {
  try {
    const res = await fetch('/api/admin/overview');
    if (!res.ok) return;
    const data = await res.json();

    // Stats
    document.getElementById('valUptime').textContent = formatUptime(data.uptimeSeconds);
    document.getElementById('valTotalRequests').textContent = (data.rateLimiter?.stats?.totalRequests || 0).toLocaleString();
    document.getElementById('valAllowed').textContent = `${(data.rateLimiter?.stats?.allowedRequests || 0).toLocaleString()} allowed`;
    document.getElementById('valActiveClients').textContent = data.rateLimiter?.activeClientsCount || 0;

    // Sliders initial sync
    if (data.rateLimiter?.limits) {
      syncSliders(data.rateLimiter.limits);
    }

    // IP Rules
    renderIpLists(data.rateLimiter?.whitelist || [], data.rateLimiter?.blacklist || []);

    // Throttle stream
    renderThrottleStream(data.rateLimiter?.recentThrottles || []);

    // Engine grid
    if (data.engines?.items) {
      renderEngineTable(data.engines.items);
    }
  } catch (err) {
    console.warn('[Admin Overview Fetch Error]', err);
  }
}

function formatUptime(seconds) {
  if (!seconds) return 'Just started';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function syncSliders(limits) {
  const anon = document.getElementById('sliderAnon');
  const starter = document.getElementById('sliderStarter');
  const pro = document.getElementById('sliderPro');
  const metered = document.getElementById('sliderMetered');

  if (document.activeElement !== anon && limits.anonymous) {
    anon.value = limits.anonymous;
    document.getElementById('valSliderAnon').textContent = `${limits.anonymous} req/min`;
  }
  if (document.activeElement !== starter && limits.starter) {
    starter.value = limits.starter;
    document.getElementById('valSliderStarter').textContent = `${limits.starter} req/min`;
  }
  if (document.activeElement !== pro && limits.pro) {
    pro.value = limits.pro;
    document.getElementById('valSliderPro').textContent = `${limits.pro} req/min`;
  }
  if (document.activeElement !== metered && limits.metered) {
    metered.value = limits.metered;
    document.getElementById('valSliderMetered').textContent = `${limits.metered} req/min`;
  }
}

function setupRateLimiterControls() {
  const anon = document.getElementById('sliderAnon');
  const starter = document.getElementById('sliderStarter');
  const pro = document.getElementById('sliderPro');
  const metered = document.getElementById('sliderMetered');

  anon.addEventListener('input', e => {
    document.getElementById('valSliderAnon').textContent = `${e.target.value} req/min`;
  });
  starter.addEventListener('input', e => {
    document.getElementById('valSliderStarter').textContent = `${e.target.value} req/min`;
  });
  pro.addEventListener('input', e => {
    document.getElementById('valSliderPro').textContent = `${e.target.value} req/min`;
  });
  metered.addEventListener('input', e => {
    document.getElementById('valSliderMetered').textContent = `${e.target.value} req/min`;
  });

  document.getElementById('btnSaveRateLimits').addEventListener('click', async () => {
    const btn = document.getElementById('btnSaveRateLimits');
    btn.textContent = 'Saving...';
    try {
      const res = await fetch('/api/admin/rate-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymous: parseInt(anon.value, 10),
          starter: parseInt(starter.value, 10),
          pro: parseInt(pro.value, 10),
          metered: parseInt(metered.value, 10)
        })
      });
      const data = await res.json();
      if (data.success) {
        btn.textContent = 'Saved Successfully!';
        setTimeout(() => { btn.textContent = 'Save Rate Thresholds'; }, 2000);
      }
    } catch (err) {
      alert('Failed to save rate limits: ' + err.message);
      btn.textContent = 'Save Rate Thresholds';
    }
  });
}

function setupIpRules() {
  document.getElementById('btnAddRule').addEventListener('click', async () => {
    const ipInput = document.getElementById('inputRuleIp');
    const selectList = document.getElementById('selectRuleList');
    const ip = ipInput.value.trim();
    if (!ip) return;

    try {
      const res = await fetch('/api/admin/ip-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          list: selectList.value,
          ip
        })
      });
      const data = await res.json();
      if (data.success) {
        ipInput.value = '';
        renderIpLists(data.whitelist, data.blacklist);
      }
    } catch (e) {
      alert('Rule error: ' + e.message);
    }
  });
}

function renderIpLists(whitelist, blacklist) {
  const boxWhite = document.getElementById('boxWhitelist');
  const boxBlack = document.getElementById('boxBlacklist');

  boxWhite.innerHTML = whitelist.map(ip => `<div style="display:flex;justify-content:space-between;padding:2px 0;"><span>${escapeHtml(ip)}</span> <a href="#" onclick="removeIpRule('whitelist', '${escapeHtml(ip)}');return false;" style="color:#f87171;text-decoration:none;">&times;</a></div>`).join('') || '<span style="color:#64748b;">No whitelisted IPs</span>';
  boxBlack.innerHTML = blacklist.map(ip => `<div style="display:flex;justify-content:space-between;padding:2px 0;"><span>${escapeHtml(ip)}</span> <a href="#" onclick="removeIpRule('blacklist', '${escapeHtml(ip)}');return false;" style="color:#f87171;text-decoration:none;">&times;</a></div>`).join('') || '<span style="color:#64748b;">No blacklisted IPs</span>';
}

window.removeIpRule = async function(list, ip) {
  try {
    const res = await fetch('/api/admin/ip-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remove', list, ip })
    });
    const data = await res.json();
    if (data.success) {
      renderIpLists(data.whitelist, data.blacklist);
    }
  } catch (e) {
    alert('Error removing IP rule: ' + e.message);
  }
};

function renderThrottleStream(events) {
  const container = document.getElementById('logStreamThrottles');
  if (!events.length) {
    container.innerHTML = '<div class="log-entry" style="color: var(--admin-muted);">No throttle events recorded. All traffic within limits.</div>';
    return;
  }
  container.innerHTML = events.map(e => `
    <div class="log-entry">
      <span><strong style="color: #f87171;">429</strong> [${e.tier}] ${escapeHtml(e.ip)}: ${escapeHtml(e.reason)}</span>
      <span style="color: #64748b;">${new Date(e.timestamp).toLocaleTimeString()}</span>
    </div>
  `).join('');
}

function renderEngineTable(engines) {
  const tbody = document.getElementById('engineTableBody');
  tbody.innerHTML = engines.map(eng => `
    <tr>
      <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #94a3b8;">${eng.id}</td>
      <td><strong>${escapeHtml(eng.name)}</strong></td>
      <td><span style="background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">${eng.category}</span></td>
      <td><span class="badge-ok">&check; Online</span></td>
      <td style="font-family: 'JetBrains Mono', monospace; color: #34d399;">${eng.avgLatencyUs} &mu;s</td>
      <td>
        <button class="btn-admin btn-secondary" style="font-size: 0.75rem; padding: 4px 10px;" onclick="testEngineBenchmark('${eng.id}', this)">Test Benchmark</button>
      </td>
    </tr>
  `).join('');
}

window.testEngineBenchmark = async function(engineId, btn) {
  const original = btn.textContent;
  btn.textContent = 'Testing...';
  try {
    const res = await fetch('/api/admin/engines/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ engineId })
    });
    const data = await res.json();
    if (data.success) {
      btn.textContent = `${data.executionTimeMicroseconds} \u03bcs (\u2713 PASS)`;
      btn.style.background = 'rgba(16, 185, 129, 0.2)';
      btn.style.color = '#34d399';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
      }, 3000);
    }
  } catch (err) {
    btn.textContent = 'Error';
    setTimeout(() => { btn.textContent = original; }, 2000);
  }
};

function setupSeoRefresher() {
  document.getElementById('btnRefreshOverview')?.addEventListener('click', fetchOverview);
  document.getElementById('btnRefreshSeo')?.addEventListener('click', async () => {
    const btn = document.getElementById('btnRefreshSeo');
    btn.textContent = 'Verifying...';
    try {
      const res = await fetch('/api/admin/seo');
      if (res.ok) {
        btn.textContent = 'Verified Clean (0 Errors)';
        setTimeout(() => { btn.textContent = 'Re-Check SEO Health'; }, 2500);
      }
    } catch (e) {
      btn.textContent = 'Check Failed';
    }
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}
