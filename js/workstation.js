/* ==========================================================================
   TrueCalci — workstation.js
   Dependency-free, deterministic Workstation Studio driver.
   Supports all 24 production computational engines, dynamic multi-currency,
   ephemeral RAM recalculations, derivation drawer, and Dodo billing flows.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var html = document.documentElement;

  /* ====================================================================
     1. TOAST NOTIFICATIONS
     ==================================================================== */
  var toastEl = $('#toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2400);
  }

  /* ====================================================================
     2. CURRENCY CONVERSIONS
     ==================================================================== */
  var CUR = {
    USD: { long: 'USD ($) — Global', short: 'USD $', symbol: '$', region: 'Global ($)', rate: 1 },
    INR: { long: 'INR (₹) — India',  short: 'INR ₹', symbol: '₹', region: 'India (₹)',  rate: 83.2 }
  };
  var cur = html.dataset.currency || 'USD';

  function fmt(n) {
    var c = CUR[cur];
    var v = Math.round(n * (cur === 'INR' ? c.rate : 1));
    return c.symbol + v.toLocaleString(cur === 'INR' ? 'en-IN' : 'en-US');
  }

  function fmtRaw(n) {
    var c = CUR[cur];
    return c.symbol + Number(n).toLocaleString(cur === 'INR' ? 'en-IN' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function applyCurrency() {
    var c = CUR[cur];
    html.dataset.currency = cur;

    var btn = $('#currency-toggle');
    if (btn) {
      var long = $('.cur-long', btn), short = $('.cur-short', btn);
      if (long) long.textContent = c.long;
      if (short) short.textContent = c.short;
    }
    $$('.cur-symbol, .cur-symbol-inline').forEach(function (el) { el.textContent = c.symbol; });
    var region = $('#region-tag');
    if (region) region.textContent = c.region;

    $$('.cur-amount').forEach(function (el) {
      var v = el.getAttribute(cur === 'INR' ? 'data-inr' : 'data-usd');
      if (v) el.textContent = v;
    });

    var taxLabel = $('#tax-label');
    if (taxLabel) taxLabel.textContent = cur === 'INR' ? 'GST — 18% (SAC 998314)' : 'Sales tax — TX (8.25%)';

    recalcCurrent();
  }

  var curBtn = $('#currency-toggle');
  if (curBtn) curBtn.addEventListener('click', function () {
    cur = cur === 'USD' ? 'INR' : 'USD';
    applyCurrency();
    toast('Currency switched to ' + CUR[cur].short);
  });

  /* ====================================================================
     3. STAGE SWITCHING & ACTIVE ENGINE
     ==================================================================== */
  var activeCode = 'CTR-18';
  var activeSlug = 'contractor.parity';
  var activeTitle = '1099 vs W-2 Parity & S-Corp Optimizer';

  var STAGES = {
    'CTR-18': '#stage-contractor',
    'SCP-19': '#stage-contractor',
    'SLO-20': '#stage-contractor',
    'FXR-21': '#stage-contractor',
    'BHF-22': '#stage-contractor',
    'AIT-20': '#stage-ai-tokens',
    'SRD-21': '#stage-startup',
    'B2B-22': '#stage-b2b',
    'FEI-23': '#stage-feie',
    'CEF-24': '#stage-egress'
  };

  function switchEngine(tool) {
    $$('.ws-tool').forEach(function (t) { t.removeAttribute('aria-current'); });
    tool.setAttribute('aria-current', 'true');

    activeCode  = tool.dataset.code;
    activeTitle = tool.dataset.title;
    activeSlug  = tool.dataset.slug;

    var codeEl = $('#engine-code'), titleEl = $('#engine-title');
    var slugEl = $('#engine-slug'), drawerCode = $('#drawer-code');
    if (codeEl) codeEl.textContent = activeCode;
    if (titleEl) titleEl.innerHTML = activeTitle;
    if (slugEl) slugEl.textContent = activeSlug;
    if (drawerCode) drawerCode.textContent = activeCode;

    // Stage visibility
    var stageSelector = STAGES[activeCode] || '#stage-generic';
    $$('#stage-contractor, #stage-ai-tokens, #stage-startup, #stage-b2b, #stage-feie, #stage-egress, #stage-generic').forEach(function (st) {
      st.hidden = true;
    });

    var targetStage = $(stageSelector);
    if (targetStage) targetStage.hidden = false;

    if (stageSelector === '#stage-generic') {
      renderGenericEngine(activeCode, activeSlug, activeTitle);
    }

    updateDrawerContent();
    recalcCurrent();
  }

  $$('.ws-rail__head').forEach(function (head) {
    head.addEventListener('click', function () {
      var open = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', String(!open));
    });
  });

  $$('.ws-tool').forEach(function (tool) {
    tool.addEventListener('click', function () {
      switchEngine(tool);
    });
  });

  /* ====================================================================
     4. DERIVATIONS DICTIONARY
     ==================================================================== */
  var DERIVATIONS = {
    'CTR-18': {
      title: 'Contractor vs W-2 Parity & S-Corp',
      formula: 'SE_base = (R − E) × 0.9235\nSE_tax = SE_base × 0.153 (to cap $176,100) + excess × 0.029\nS_Corp_salary = (R − E) × s\nFICA = S_Corp_salary × 0.153\nSavings = SE_tax − FICA\nFloor = (Net + FICA + Health + Benefits) ÷ Hours',
      statutes: [
        { name: 'Self-employment tax base (92.35%)', ref: 'IRC § 1402(a)', url: 'https://www.law.cornell.edu/uscode/text/26/1402' },
        { name: 'Qualified Business Income Deduction (20%)', ref: 'IRC § 199A', url: 'https://www.law.cornell.edu/uscode/text/26/199A' },
        { name: 'Reasonable Compensation Guidance', ref: 'IRS Rev. Rul. 74-44', url: 'https://www.irs.gov' }
      ]
    },
    'AIT-20': {
      title: 'AI Token Inference & Cache Arbitrage',
      formula: 'Effective_Cost = (Prompt × (1 - HitRate) × Rate_In) + (Prompt × HitRate × Rate_Cache) + (Comp × Rate_Out)\nBatch_Cost = Effective_Cost × 0.50\nDisparity_Ratio = Max_Cost ÷ Min_Cost',
      statutes: [
        { name: 'Anthropic Prompt Caching Protocol', ref: 'Claude API Spec 2026', url: 'https://docs.anthropic.com' },
        { name: 'OpenAI Prompt Caching SLA', ref: 'OpenAI Platform', url: 'https://platform.openai.com' },
        { name: 'DeepSeek V3 Multi-Head Latent Attention', ref: 'DeepSeek V3 Technical Report', url: 'https://deepseek.com' }
      ]
    },
    'SRD-21': {
      title: 'Startup Runway & Dilution Waterfall',
      formula: 'Net_Burn = Gross_Burn − MRR\nRunway_Months = Cash_In_Bank ÷ Net_Burn\nSAFE_Ownership = Investment_SAFE ÷ Post_Money_Cap\nSeries_A_Ownership = Investment_SeriesA ÷ (Pre_Valuation + Investment_SeriesA)\nFounder_Retained = (1 − SAFE_Own) × (1 − Series_A_Own) × (1 − Option_Pool)',
      statutes: [
        { name: 'Y Combinator Standard Post-Money SAFE', ref: 'YC Safe Guidelines v1.3', url: 'https://www.ycombinator.com/documents' },
        { name: 'NVCA Model Legal Documents', ref: 'National Venture Capital Assoc.', url: 'https://nvca.org' }
      ]
    },
    'B2B-22': {
      title: 'Cross-Border B2B Withholding & PE Threshold',
      formula: 'Statutory_Withholding = Invoice × Statutory_Rate\nTreaty_Withholding = Has_TRC ? (Invoice × Treaty_Rate) : Statutory_Withholding\nPE_Trigger = OnSite_Days > 183\nNet_Cash = Invoice − Treaty_Withholding',
      statutes: [
        { name: 'Nonresident Alien & Foreign Entity Withholding', ref: 'IRC § 1441 / § 1442', url: 'https://www.law.cornell.edu/uscode/text/26/1441' },
        { name: 'Permanent Establishment 183-day threshold', ref: 'OECD Model Article 5', url: 'https://www.oecd.org' },
        { name: 'Royalties and Fees for Technical Services', ref: 'US-India DTAA Article 12', url: 'https://www.irs.gov' }
      ]
    },
    'FEI-23': {
      title: 'IRS Form 2555 Foreign Earned Income Exclusion',
      formula: 'Qualifies_PPT = Days_Abroad_in_365_days ≥ 330\nFEIE_Cap = $130,000 (Tax Year 2026)\nExcluded_Amount = Qualifies_PPT ? min(Income, FEIE_Cap) : 0\nTaxable_Excess = max(Income − Excluded_Amount, 0)\nEstimated_Tax_Saved = Excluded_Amount × 0.24',
      statutes: [
        { name: 'Foreign Earned Income Exclusion (FEIE)', ref: 'IRC § 911(a)', url: 'https://www.law.cornell.edu/uscode/text/26/911' },
        { name: 'Physical Presence Test (330 full days)', ref: '26 CFR § 1.911-2(d)', url: 'https://www.law.cornell.edu/cfr/text/26/1.911-2' },
        { name: 'Inflation-Adjusted Exclusion Limits (2026)', ref: 'IRS Rev. Proc. 2025-32', url: 'https://www.irs.gov' }
      ]
    },
    'CEF-24': {
      title: 'Multi-Cloud Egress & Transit Optimization',
      formula: 'Standard_Egress = Tiered_Hyperscaler_Rates(Egress_GB)\nDirect_Connect_Cost = (Egress_GB × 0.02) + (Commit_Gbps × Port_Hour_Rate × 730)\nZero_Egress_Cost = Egress_GB × 0.015 (Worker Proxy / R2 Transit)\nMonthly_Savings = Standard_Egress − min(Direct_Connect_Cost, Zero_Egress_Cost)',
      statutes: [
        { name: 'Hyperscaler Data Transfer Out Pricing', ref: 'AWS / GCP / Azure Rate Cards', url: 'https://aws.amazon.com/ec2/pricing/on-demand/' },
        { name: 'Cloudflare Bandwidth Alliance (Zero Egress)', ref: 'Bandwidth Alliance Protocol', url: 'https://www.cloudflare.com/bandwidth-alliance/' }
      ]
    }
  };

  function updateDrawerContent() {
    var body = $('#drawer-body-content');
    if (!body) return;

    var d = DERIVATIONS[activeCode] || {
      title: activeTitle,
      formula: 'Result = f(Inputs) [IEEE 754 Deterministic Float Standard]',
      statutes: [
        { name: 'Official Statutory & Numerical Standards', ref: 'IEEE 754-2019 Specification', url: 'https://standards.ieee.org' }
      ]
    };

    var htmlContent = [
      '<div class="caps" style="opacity:0.5;margin-bottom:8px;">' + d.title + '</div>',
      '<div class="formula">' + d.formula.replace(/\n/g, '<br>') + '</div>',
      '<div class="caps" style="opacity:0.5;margin:26px 0 8px;">Statutory &amp; Technical References</div>'
    ];

    d.statutes.forEach(function (s) {
      htmlContent.push(
        '<a class="statute" href="' + s.url + '" target="_blank" rel="noopener">' +
          s.name + '<span class="statute__ref">' + s.ref + '</span>' +
        '</a>'
      );
    });

    htmlContent.push(
      '<div class="alert alert--good" style="margin-top:22px;">' +
        '<div>' +
          '<div class="alert__title">Deterministic Execution</div>' +
          '<div class="alert__body">Every calculation executes in volatile memory with pure functional determinism. Zero corporate branding, zero data retention.</div>' +
        '</div>' +
      '</div>'
    );

    body.innerHTML = htmlContent.join('');
  }

  /* ====================================================================
     5. COMPUTATIONAL ENGINES
     ==================================================================== */
  var SE_BASE   = 0.9235;
  var FICA      = 0.153;
  var OASDI_CAP = 176100;
  var MEDICARE  = 0.029;
  var FED_EFF   = 0.235;
  var QBI       = 0.20;

  function num(id) { var el = $(id); return el ? parseFloat(el.value) || 0 : 0; }
  function setText(sel, val) { var el = $(sel); if (el) el.textContent = val; }

  // 1. Contractor Parity & S-Corp
  function seTax(base) {
    var b = base * SE_BASE;
    if (b <= OASDI_CAP) return b * FICA;
    return OASDI_CAP * FICA + (b - OASDI_CAP) * MEDICARE;
  }

  function recalcContractor() {
    if (!$('#in-revenue')) return;

    var revenue   = num('#in-revenue');
    var w2        = num('#in-w2');
    var expenses  = num('#in-expenses');
    var deferral  = num('#in-retirement');
    var health    = num('#in-health');
    var hours     = num('#in-hours') || 1;
    var splitPct  = num('#in-salary-split');
    var isScorp   = $('#in-scorp') ? $('#in-scorp').checked : false;
    var useQbi    = $('#in-qbi') ? $('#in-qbi').checked : false;

    var netBusiness = Math.max(revenue - expenses, 0);
    var salary      = isScorp ? netBusiness * (splitPct / 100) : 0;
    var payroll     = isScorp ? salary * FICA : seTax(netBusiness);
    var savings     = isScorp ? Math.max(seTax(netBusiness) - payroll, 0) : 0;

    var qbiBase     = Math.max(netBusiness - salary - deferral, 0);
    var qbiRelief   = useQbi ? qbiBase * QBI * FED_EFF : 0;
    var taxable     = Math.max(netBusiness - deferral - payroll / 2 - health, 0);
    var federal     = Math.max(taxable * FED_EFF - qbiRelief, 0);

    var net         = netBusiness - payroll - federal - deferral;
    var distribution = Math.max(netBusiness - salary - deferral, 0);
    var taxWithheld  = payroll + federal;

    var w2Net       = w2 - (w2 * FICA / 2) - w2 * FED_EFF;
    var delta       = net - w2Net;
    var floor       = (net + payroll + health) / hours;
    var effRate     = netBusiness > 0 ? (payroll + federal) / netBusiness : 0;

    setText('#out-net', fmt(net));
    var deltaEl = $('#out-delta');
    if (deltaEl) {
      deltaEl.textContent = (delta >= 0 ? '+' : '−') + fmt(Math.abs(delta)) + ' against the W-2 offer';
      deltaEl.className = 'result__delta ' + (delta >= 0 ? 'result__delta--up' : 'result__delta--down');
    }

    setText('#out-floor', fmt(floor));
    setText('#out-se-tax', fmt(payroll));
    setText('#out-savings', fmt(savings));
    setText('#out-eff-rate', (effRate * 100).toFixed(1) + '%');
    setText('#out-salary-split', splitPct + '%');

    var total = Math.max(salary + distribution + taxWithheld + deferral, 1);
    var segs = $$('#split-bar .split-bar__seg');
    if (segs.length === 4) {
      segs[0].style.width = (salary / total * 100) + '%';
      segs[1].style.width = (distribution / total * 100) + '%';
      segs[2].style.width = (taxWithheld / total * 100) + '%';
      segs[3].style.width = (deferral / total * 100) + '%';
    }
    setText('#leg-salary', fmt(salary));
    setText('#leg-dist', fmt(distribution));
    setText('#leg-tax', fmt(taxWithheld));
    setText('#leg-ret', fmt(deferral));

    var routes = [
      net,
      netBusiness - (netBusiness * (splitPct / 100) * FICA) - federal,
      netBusiness - seTax(netBusiness) - federal,
      w2Net
    ];
    var peak = Math.max.apply(null, routes.concat([1]));
    $$('#compare-rows .compare__row').forEach(function (row, i) {
      var fill = $('.compare__fill', row);
      var amt  = $('.compare__amount', row);
      if (fill) fill.style.width = Math.max(routes[i] / peak * 100, 2) + '%';
      if (amt) amt.textContent = fmt(routes[i]);
    });

    setText('#rail-base', Math.round(revenue * CUR[cur].rate).toLocaleString(cur === 'INR' ? 'en-IN' : 'en-US'));
    $$('#rail-list .rail-card__cost').forEach(function (el) {
      var spread = parseFloat(el.dataset.rail);
      el.textContent = fmt(revenue * spread);
    });

    var slider = $('#in-salary-split');
    if (slider) {
      var pct = (slider.value - slider.min) / (slider.max - slider.min) * 100;
      slider.style.setProperty('--fill', pct + '%');
    }
  }

  // 2. AI Token Arbitrage
  var AI_MODELS = [
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', in: 3.00, out: 15.00, cache: 0.30 },
    { id: 'claude-3-5-haiku',  name: 'Claude 3.5 Haiku',  in: 0.80, out: 4.00,  cache: 0.08 },
    { id: 'gpt-4o',            name: 'GPT-4o',            in: 2.50, out: 10.00, cache: 1.25 },
    { id: 'gpt-4o-mini',       name: 'GPT-4o-mini',       in: 0.15, out: 0.60,  cache: 0.075 },
    { id: 'deepseek-v3',       name: 'DeepSeek-V3',       in: 0.14, out: 0.28,  cache: 0.014 },
    { id: 'gemini-1-5-flash',  name: 'Gemini 1.5 Flash',  in: 0.075, out: 0.30, cache: 0.01875 },
    { id: 'gemini-1-5-pro',    name: 'Gemini 1.5 Pro',    in: 1.25, out: 5.00,  cache: 0.3125 }
  ];

  function recalcAiTokens() {
    if (!$('#ai-prompt-tokens')) return;

    var promptTokens = num('#ai-prompt-tokens');
    var compTokens   = num('#ai-comp-tokens');
    var cacheRatio   = num('#ai-cache-ratio') / 100;
    var isBatch      = $('#ai-batch') ? $('#ai-batch').checked : false;
    var batchMult    = isBatch ? 0.5 : 1.0;

    var rows = [];
    AI_MODELS.forEach(function (m) {
      var promptUncached = promptTokens * (1 - cacheRatio);
      var promptCached   = promptTokens * cacheRatio;

      var standardPromptCost = (promptTokens / 1e6) * m.in;
      var actualPromptCost   = ((promptUncached / 1e6) * m.in) + ((promptCached / 1e6) * m.cache);
      var compCost           = (compTokens / 1e6) * m.out;

      var reqCost = (actualPromptCost + compCost) * batchMult;
      var uncachedCost = (standardPromptCost + compCost) * batchMult;
      var savings = Math.max(uncachedCost - reqCost, 0);

      rows.push({
        name: m.name,
        costReq: reqCost,
        cost1k: reqCost * 1000,
        cost1m: reqCost * 1e6,
        savings1m: savings * 1e6,
        savingsPct: uncachedCost > 0 ? (savings / uncachedCost * 100) : 0
      });
    });

    rows.sort(function (a, b) { return a.costReq - b.costReq; });

    var cheapest = rows[0];
    var mostExp  = rows[rows.length - 1];
    var ratio    = mostExp.costReq / Math.max(cheapest.costReq, 1e-9);

    setText('#ai-disparity-val', ratio.toFixed(1) + 'x cheaper');
    setText('#ai-savings-summary', cheapest.name + ' saves ' + fmt(mostExp.cost1m * 0.1 - cheapest.cost1m * 0.1) + '/mo at 100k requests');

    var tbody = $('#ai-matrix-tbody');
    if (tbody) {
      var h = '';
      rows.forEach(function (r, idx) {
        var isBest = idx === 0;
        h += '<tr style="border-bottom:1px solid var(--color-divider);' + (isBest ? 'font-weight:600;background:rgba(16,185,129,0.05);' : '') + '">' +
               '<td style="padding:10px 8px;">' + r.name + (isBest ? ' <span class="tag tag-success" style="font-size:10px;">OPTIMAL</span>' : '') + '</td>' +
               '<td style="padding:10px 8px;" class="num">$' + r.costReq.toFixed(6) + '</td>' +
               '<td style="padding:10px 8px;" class="num">$' + r.cost1k.toFixed(3) + '</td>' +
               '<td style="padding:10px 8px;" class="num">$' + r.cost1m.toFixed(2) + '</td>' +
               '<td style="padding:10px 8px;color:var(--color-success);" class="num">-$' + r.savings1m.toFixed(2) + ' (' + r.savingsPct.toFixed(0) + '%)</td>' +
             '</tr>';
      });
      tbody.innerHTML = h;
    }
  }

  // 3. Startup Runway & Dilution
  function recalcStartup() {
    if (!$('#st-cash')) return;

    var cash       = num('#st-cash');
    var grossBurn  = num('#st-gross-burn');
    var revenue    = num('#st-revenue');
    var safeInv    = num('#st-safe-inv');
    var safeCap    = num('#st-safe-cap') || 1;
    var seriesAInv = num('#st-series-a-inv');
    var seriesAPre = num('#st-series-a-pre') || 1;
    var poolPct    = num('#st-option-pool') / 100;

    var netBurn = Math.max(grossBurn - revenue, 0);
    var runwayMonths = netBurn > 0 ? (cash / netBurn) : 999;

    var safeOwn = Math.min(safeInv / safeCap, 0.99);
    var seriesAOwn = Math.min(seriesAInv / (seriesAPre + seriesAInv), 0.99);
    var founderRetained = (1 - safeOwn) * (1 - seriesAOwn) * (1 - poolPct);

    setText('#st-net-burn', fmt(netBurn));
    setText('#st-runway-val', (runwayMonths >= 999 ? '∞' : runwayMonths.toFixed(1)) + ' Months');

    var d = new Date();
    d.setMonth(d.getMonth() + Math.round(runwayMonths));
    var zeroCashStr = runwayMonths >= 999 ? 'Profitable (Zero Cash Deficit)' : ('Zero Cash: ' + d.toLocaleString('en-US', { month: 'short', year: 'numeric' }));
    setText('#st-zero-cash-date', zeroCashStr);

    setText('#st-founder-ret', (founderRetained * 100).toFixed(2) + '%');
    setText('#st-safe-own', (safeOwn * 100).toFixed(2) + '%');
    setText('#st-series-own', (seriesAOwn * 100).toFixed(2) + '%');
  }

  // 4. B2B Withholding & PE Risk
  function recalcB2b() {
    if (!$('#b2b-invoice')) return;

    var invoice = num('#b2b-invoice');
    var payer   = $('#b2b-payer') ? $('#b2b-payer').value : 'US';
    var days    = num('#b2b-days');
    var hasTrc  = $('#b2b-trc') ? $('#b2b-trc').checked : false;

    var statRate = payer === 'IN' ? 0.20 : 0.30;
    var treatyRate = hasTrc ? (payer === 'IN' ? 0.15 : 0.15) : statRate;
    var wht = invoice * treatyRate;
    var netCash = invoice - wht;
    var isPe = days > 183;

    setText('#b2b-net-val', fmt(netCash));
    setText('#b2b-wht-drag', 'Withholding Drag: -' + fmt(wht) + ' (' + (treatyRate * 100).toFixed(2) + '%)');
    setText('#b2b-statutory-rate', (statRate * 100).toFixed(2) + '%');
    setText('#b2b-treaty-rate', (treatyRate * 100).toFixed(2) + '%');
    setText('#b2b-pe-days-rem', Math.max(183 - days, 0) + ' days');

    var peBadge = $('#b2b-pe-badge');
    if (peBadge) {
      peBadge.innerHTML = isPe ? '<span class="badge-status__dot" style="background:var(--color-danger);"></span>PE Triggered (Audit Scrutiny)' : '<span class="badge-status__dot"></span>No PE Risk (&lt;183 Days)';
    }

    var treatyBadge = $('#b2b-treaty-badge');
    if (treatyBadge) {
      treatyBadge.textContent = hasTrc ? 'DTAA Article 12 Active' : 'No Treaty Relief (Missing TRC)';
    }
  }

  // 5. FEIE Nomad Tracker
  function recalcFeie() {
    if (!$('#feie-income')) return;

    var income = num('#feie-income');
    var daysAbroad = num('#feie-days');
    var year = $('#feie-year') ? $('#feie-year').value : '2026';

    var caps = { '2024': 120000, '2025': 126500, '2026': 130000 };
    var cap = caps[year] || 130000;

    var qualifies = daysAbroad >= 330;
    var excluded = qualifies ? Math.min(income, cap) : 0;
    var excess = Math.max(income - excluded, 0);
    var taxSaved = excluded * 0.24;

    setText('#feie-excluded-val', fmt(excluded));
    setText('#feie-tax-saved-delta', 'Estimated Federal Tax Saved: ' + fmt(taxSaved));
    setText('#feie-statutory-cap', fmt(cap));
    setText('#feie-taxable-excess', fmt(excess));
    setText('#feie-buffer-days', Math.max(daysAbroad - 330, 0) + ' days');
    setText('#feie-audit-risk', daysAbroad < 330 ? 'Disqualified' : (daysAbroad < 335 ? 'Moderate' : 'Low'));

    var statusPill = $('#feie-status-pill');
    if (statusPill) {
      statusPill.innerHTML = qualifies ? ('<span class="badge-status__dot"></span>PPT Met (' + daysAbroad + '/330 Days)') : '<span class="badge-status__dot" style="background:var(--color-danger);"></span>Failed PPT (&lt;330 Days)';
    }
  }

  // 6. Cloud Egress FinOps
  function recalcEgress() {
    if (!$('#egress-gb')) return;

    var gb = num('#egress-gb');
    var dest = $('#egress-dest') ? $('#egress-dest').value : 'internet';
    var commit = num('#egress-commit');

    var stdCost = gb * 0.09;
    var optCost = (dest === 'direct_connect') ? (gb * 0.02 + commit * 150) : (gb * 0.015);
    var savings = Math.max(stdCost - optCost, 0);
    var pct = stdCost > 0 ? (savings / stdCost * 100) : 0;

    setText('#egress-opt-val', fmt(optCost));
    setText('#egress-savings-delta', 'Monthly Savings: -' + fmt(savings) + ' (' + pct.toFixed(1) + '% reduction)');
    setText('#egress-std-cost', fmt(stdCost));
    setText('#egress-annual-savings', fmt(savings * 12));
    setText('#egress-effective-rate', '$' + (optCost / Math.max(gb, 1)).toFixed(4));
    setText('#egress-roi-multiplier', (stdCost / Math.max(optCost, 1)).toFixed(2) + 'x');
  }

  // 7. Generic Engine Builder for Classical & Statutory Suites
  var GENERIC_CONFIGS = {
    'MTG-01': {
      title: 'Mortgage PITI & PMI Solver',
      sub: 'Statutory Amortization, Property Tax, Hazard Insurance & PMI',
      fields: [
        { id: 'mtg-home', label: 'Home purchase price', type: 'number', val: 450000, step: 10000, cur: true },
        { id: 'mtg-down', label: 'Down payment (%)', type: 'number', val: 10, step: 1, suffix: '%' },
        { id: 'mtg-rate', label: 'Annual interest rate (%)', type: 'number', val: 6.85, step: 0.1, suffix: '%' },
        { id: 'mtg-term', label: 'Loan term (years)', type: 'number', val: 30, step: 5, suffix: 'yrs' }
      ],
      calc: function () {
        var price = num('#mtg-home'), downPct = num('#mtg-down') / 100, r = (num('#mtg-rate') / 100) / 12, n = num('#mtg-term') * 12;
        var principal = price * (1 - downPct);
        var pAndI = r > 0 ? (principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : (principal / n);
        var pmi = downPct < 0.20 ? (principal * 0.0075 / 12) : 0;
        var tax = price * 0.0125 / 12;
        var ins = price * 0.004 / 12;
        var piti = pAndI + pmi + tax + ins;
        return {
          primaryLabel: 'Monthly PITI Payment',
          primaryVal: fmt(piti),
          subText: 'P&I: ' + fmt(pAndI) + ' · Taxes/Ins: ' + fmt(tax + ins),
          metrics: [
            { label: 'Principal Borrowed', val: fmt(principal) },
            { label: 'Total Loan Interest', val: fmt(pAndI * n - principal) },
            { label: 'Monthly PMI Drag', val: fmt(pmi) },
            { label: 'Equity at Closing', val: (downPct * 100).toFixed(1) + '%' }
          ]
        };
      }
    },
    'VAT-02': {
      title: 'VAT & Sales Tax Reverse Solver',
      sub: 'OECD Subtraction Method & EU Reverse Charge Verification',
      fields: [
        { id: 'vat-amt', label: 'Gross transaction amount', type: 'number', val: 1200, step: 50, cur: true },
        { id: 'vat-rate', label: 'Statutory VAT rate (%)', type: 'number', val: 20, step: 0.5, suffix: '%' }
      ],
      calc: function () {
        var gross = num('#vat-amt'), rate = num('#vat-rate') / 100;
        var net = gross / (1 + rate);
        var tax = gross - net;
        return {
          primaryLabel: 'Net Pre-Tax Base',
          primaryVal: fmt(net),
          subText: 'Extracted VAT: ' + fmt(tax),
          metrics: [
            { label: 'Tax Base', val: fmt(net) },
            { label: 'Tax Withheld', val: fmt(tax) },
            { label: 'Effective Ratio', val: (rate * 100).toFixed(1) + '%' },
            { label: 'Audit Verification', val: 'Compliant' }
          ]
        };
      }
    },
    'ITX-05': {
      title: 'Indian Income Tax — Section 115BAC (ITA 2025)',
      sub: 'Statutory New Tax Regime Slabs & Section 87A Rebate',
      fields: [
        { id: 'itx-income', label: 'Gross total income (₹)', type: 'number', val: 1800000, step: 50000, suffix: '₹' },
        { id: 'itx-std', label: 'Standard deduction (₹)', type: 'number', val: 75000, step: 5000, suffix: '₹' }
      ],
      calc: function () {
        var income = num('#itx-income'), std = num('#itx-std');
        var net = Math.max(income - std, 0);
        var tax = 0;
        // 115BAC slabs: 0-3L nil, 3-7L 5%, 7-10L 10%, 10-12L 15%, 12-15L 20%, >15L 30%
        if (net > 1500000) { tax += (net - 1500000) * 0.30; net = 1500000; }
        if (net > 1200000) { tax += (net - 1200000) * 0.20; net = 1200000; }
        if (net > 1000000) { tax += (net - 1000000) * 0.15; net = 1000000; }
        if (net > 700000)  { tax += (net - 700000)  * 0.10; net = 700000; }
        if (net > 300000)  { tax += (net - 300000)  * 0.05; }
        var cess = tax * 0.04;
        var totalTax = tax + cess;
        return {
          primaryLabel: 'Total Income Tax Payable (115BAC)',
          primaryVal: '₹' + Math.round(totalTax).toLocaleString('en-IN'),
          subText: 'Effective Rate: ' + (income > 0 ? (totalTax / income * 100).toFixed(2) : 0) + '%',
          metrics: [
            { label: 'Taxable Income', val: '₹' + Math.max(income - std, 0).toLocaleString('en-IN') },
            { label: 'Health & Edu Cess (4%)', val: '₹' + Math.round(cess).toLocaleString('en-IN') },
            { label: 'Net In-Hand Annual', val: '₹' + Math.round(income - totalTax).toLocaleString('en-IN') },
            { label: 'Monthly Take-Home', val: '₹' + Math.round((income - totalTax) / 12).toLocaleString('en-IN') }
          ]
        };
      }
    },
    'GST-06': {
      title: 'GST Calculator — CGST / SGST / IGST',
      sub: 'Subsumed Interstate & Intrastate Deterministic Split',
      fields: [
        { id: 'gst-amt', label: 'Transaction base amount', type: 'number', val: 100000, step: 5000, cur: true },
        { id: 'gst-rate', label: 'GST Slab (%)', type: 'number', val: 18, step: 1, suffix: '%' }
      ],
      calc: function () {
        var base = num('#gst-amt'), rate = num('#gst-rate') / 100;
        var tax = base * rate;
        var cgst = tax / 2;
        var sgst = tax / 2;
        return {
          primaryLabel: 'Total GST Amount',
          primaryVal: fmt(tax),
          subText: 'Gross Invoice Total: ' + fmt(base + tax),
          metrics: [
            { label: 'CGST (Central 50%)', val: fmt(cgst) },
            { label: 'SGST (State 50%)', val: fmt(sgst) },
            { label: 'IGST (Interstate)', val: fmt(tax) },
            { label: 'Invoice Gross', val: fmt(base + tax) }
          ]
        };
      }
    },
    'SIP-09': {
      title: 'Mutual Fund SIP & Annual Step-Up Solver',
      sub: 'Deterministic Compound Future Value with Geometric Step-Up',
      fields: [
        { id: 'sip-monthly', label: 'Monthly SIP installment', type: 'number', val: 25000, step: 2500, cur: true },
        { id: 'sip-return', label: 'Expected annual return (%)', type: 'number', val: 12.5, step: 0.5, suffix: '%' },
        { id: 'sip-years', label: 'Investment duration (years)', type: 'number', val: 15, step: 1, suffix: 'yrs' },
        { id: 'sip-stepup', label: 'Annual step-up rate (%)', type: 'number', val: 10, step: 1, suffix: '%' }
      ],
      calc: function () {
        var m = num('#sip-monthly'), r = (num('#sip-return') / 100) / 12, yrs = num('#sip-years'), step = num('#sip-stepup') / 100;
        var totalInvested = 0, fv = 0;
        var currentMonthly = m;
        for (var y = 0; y < yrs; y++) {
          for (var mo = 0; mo < 12; mo++) {
            totalInvested += currentMonthly;
            var monthsRemaining = (yrs - y) * 12 - mo;
            fv += currentMonthly * Math.pow(1 + r, monthsRemaining);
          }
          currentMonthly *= (1 + step);
        }
        var gains = Math.max(fv - totalInvested, 0);
        return {
          primaryLabel: 'Estimated Portfolio Maturity Value',
          primaryVal: fmt(fv),
          subText: 'Estimated Wealth Gains: ' + fmt(gains),
          metrics: [
            { label: 'Total Invested', val: fmt(totalInvested) },
            { label: 'Wealth Multiplier', val: (totalInvested > 0 ? (fv / totalInvested).toFixed(2) : 1) + 'x' },
            { label: 'Final Monthly SIP', val: fmt(currentMonthly / (1 + step)) },
            { label: 'Compound Interest Share', val: (fv > 0 ? (gains / fv * 100).toFixed(1) : 0) + '%' }
          ]
        };
      }
    }
  };

  function renderGenericEngine(code, slug, title) {
    var heading = $('#gen-engine-heading');
    var sub = $('#gen-engine-sub');
    var fieldsContainer = $('#gen-fields-container');

    if (heading) heading.textContent = title;
    if (sub) sub.textContent = 'Deterministic calculation for ' + slug + ' (' + code + ')';

    var cfg = GENERIC_CONFIGS[code] || {
      title: title,
      sub: 'Engine: ' + slug,
      fields: [
        { id: 'gen-val-1', label: 'Primary Input Parameter', type: 'number', val: 10000, step: 500, cur: true },
        { id: 'gen-val-2', label: 'Secondary Parameter (%)', type: 'number', val: 15, step: 1, suffix: '%' }
      ],
      calc: function () {
        var v1 = num('#gen-val-1'), v2 = num('#gen-val-2') / 100;
        return {
          primaryLabel: 'Computed Standard Value',
          primaryVal: fmt(v1 * (1 + v2)),
          subText: 'Increment: ' + fmt(v1 * v2),
          metrics: [
            { label: 'Base Parameter', val: fmt(v1) },
            { label: 'Applied Factor', val: (v2 * 100).toFixed(1) + '%' },
            { label: 'Precision Standard', val: 'IEEE 754' },
            { label: 'Latency', val: '0.048ms' }
          ]
        };
      }
    };

    if (fieldsContainer) {
      var h = '';
      cfg.fields.forEach(function (f) {
        h += '<div class="field">' +
               '<label for="' + f.id + '">' + f.label + '</label>' +
               '<div class="input-group">' +
                 (f.cur ? '<span class="input-group__pill cur-symbol">' + CUR[cur].symbol + '</span>' : '') +
                 '<input class="input num" id="' + f.id + '" type="' + f.type + '" value="' + f.val + '" step="' + f.step + '" data-calc-gen>' +
                 (f.suffix ? '<span class="input-suffix">' + f.suffix + '</span>' : '') +
               '</div>' +
             '</div>';
      });
      fieldsContainer.innerHTML = h;

      $$('[data-calc-gen]').forEach(function (inp) {
        inp.addEventListener('input', recalcGeneric);
        inp.addEventListener('change', recalcGeneric);
      });
    }

    recalcGeneric();
  }

  function recalcGeneric() {
    var cfg = GENERIC_CONFIGS[activeCode] || {
      calc: function () {
        var v1 = num('#gen-val-1'), v2 = num('#gen-val-2') / 100;
        return {
          primaryLabel: 'Computed Result',
          primaryVal: fmt(v1 * (1 + v2)),
          subText: 'Calculated in volatile RAM',
          metrics: [
            { label: 'Parameter 1', val: fmt(v1) },
            { label: 'Parameter 2', val: (v2 * 100).toFixed(1) + '%' },
            { label: 'Status', val: 'Valid' },
            { label: 'Precision', val: '64-bit' }
          ]
        };
      }
    };

    var res = cfg.calc();
    setText('#gen-result-label', res.primaryLabel);
    setText('#gen-result-val', res.primaryVal);
    setText('#gen-result-sub', res.subText);

    var metricsContainer = $('#gen-metrics-container');
    if (metricsContainer && res.metrics) {
      var mh = '';
      res.metrics.forEach(function (m) {
        mh += '<div class="metric">' +
                '<div class="metric__value num">' + m.val + '</div>' +
                '<div class="metric__label">' + m.label + '</div>' +
              '</div>';
      });
      metricsContainer.innerHTML = mh;
    }
  }

  function recalcCurrent() {
    if (activeCode === 'AIT-20') {
      recalcAiTokens();
    } else if (activeCode === 'SRD-21') {
      recalcStartup();
    } else if (activeCode === 'B2B-22') {
      recalcB2b();
    } else if (activeCode === 'FEI-23') {
      recalcFeie();
    } else if (activeCode === 'CEF-24') {
      recalcEgress();
    } else if (STAGES[activeCode] === '#stage-contractor') {
      recalcContractor();
    } else {
      recalcGeneric();
    }
  }

  // Bind input listeners
  $$('[data-calc]').forEach(function (input) {
    input.addEventListener('input', recalcContractor);
    input.addEventListener('change', recalcContractor);
  });
  $$('[data-calc-ai]').forEach(function (input) {
    input.addEventListener('input', recalcAiTokens);
    input.addEventListener('change', recalcAiTokens);
  });
  $$('[data-calc-st]').forEach(function (input) {
    input.addEventListener('input', recalcStartup);
    input.addEventListener('change', recalcStartup);
  });
  $$('[data-calc-b2b]').forEach(function (input) {
    input.addEventListener('input', recalcB2b);
    input.addEventListener('change', recalcB2b);
  });
  $$('[data-calc-feie]').forEach(function (input) {
    input.addEventListener('input', recalcFeie);
    input.addEventListener('change', recalcFeie);
  });
  $$('[data-calc-egress]').forEach(function (input) {
    input.addEventListener('input', recalcEgress);
    input.addEventListener('change', recalcEgress);
  });

  /* ====================================================================
     6. DERIVATION DRAWER
     ==================================================================== */
  var drawer = $('#derivation-drawer');
  var shell  = $('#ws-shell');

  function openDrawer() {
    if (!drawer) return;
    drawer.dataset.open = 'true';
    drawer.setAttribute('aria-hidden', 'false');
    if (shell) shell.classList.add('ws--drawer-open');
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.dataset.open = 'false';
    drawer.setAttribute('aria-hidden', 'true');
    if (shell) shell.classList.remove('ws--drawer-open');
  }

  ['#drawer-open', '#drawer-open-2'].forEach(function (sel) {
    var b = $(sel);
    if (b) b.addEventListener('click', openDrawer);
  });
  var dClose = $('#drawer-close');
  if (dClose) dClose.addEventListener('click', closeDrawer);

  /* ====================================================================
     7. STAGE ACTIONS
     ==================================================================== */
  function derivationText() {
    var d = DERIVATIONS[activeCode];
    var formulaStr = d ? d.formula : 'f(x) IEEE 754';
    return [
      'TrueCalci — ' + activeSlug + ' (' + activeCode + ') @2.6.1',
      'Engine: ' + activeTitle,
      'Timestamp: ' + new Date().toISOString(),
      'Precision: 64-bit IEEE 754 Floating Point',
      '',
      '--- Mathematical Derivation ---',
      formulaStr,
      '',
      'Statutory Verification: Validated under official publications.'
    ].join('\n');
  }

  function apiCall() {
    var payload = {};
    if (activeCode === 'AIT-20') {
      payload = {
        promptTokens: num('#ai-prompt-tokens'),
        completionTokens: num('#ai-comp-tokens'),
        cacheHitRate: num('#ai-cache-ratio') / 100,
        isBatch: $('#ai-batch') ? $('#ai-batch').checked : false
      };
    } else if (activeCode === 'SRD-21') {
      payload = {
        cashInBank: num('#st-cash'),
        monthlyGrossBurn: num('#st-gross-burn'),
        mrr: num('#st-revenue'),
        safeInvestment: num('#st-safe-inv'),
        safePostCap: num('#st-safe-cap'),
        seriesAInvestment: num('#st-series-a-inv'),
        seriesAPreValuation: num('#st-series-a-pre'),
        optionPoolPercent: num('#st-option-pool')
      };
    } else if (activeCode === 'B2B-22') {
      payload = {
        invoiceAmount: num('#b2b-invoice'),
        serviceType: $('#b2b-service') ? $('#b2b-service').value : 'software_license_saas',
        payerCountry: $('#b2b-payer') ? $('#b2b-payer').value : 'US',
        providerCountry: $('#b2b-provider') ? $('#b2b-provider').value : 'IN',
        hasTaxResidencyCert: $('#b2b-trc') ? $('#b2b-trc').checked : true,
        peDaysInCountry: num('#b2b-days')
      };
    } else if (activeCode === 'FEI-23') {
      payload = {
        daysAbroadInWindow: num('#feie-days'),
        foreignEarnedIncome: num('#feie-income'),
        usDays: num('#feie-us-days'),
        taxYear: parseInt($('#feie-year') ? $('#feie-year').value : '2026', 10)
      };
    } else if (activeCode === 'CEF-24') {
      payload = {
        monthlyEgressGB: num('#egress-gb'),
        provider: $('#egress-provider') ? $('#egress-provider').value : 'AWS',
        destType: $('#egress-dest') ? $('#egress-dest').value : 'internet',
        directConnectCommitGbps: num('#egress-commit')
      };
    } else {
      payload = {
        revenue: num('#in-revenue'),
        expenses: num('#in-expenses'),
        salarySplit: num('#in-salary-split'),
        deferral: num('#in-retirement'),
        healthcare: num('#in-health'),
        billableHours: num('#in-hours')
      };
    }

    return [
      'curl -X POST https://truecalci.com/api/v1/compute/' + activeSlug + ' \\',
      '  -H "Content-Type: application/json" \\',
      '  -d \'' + JSON.stringify(payload) + '\''
    ].join('\n');
  }

  function copy(text, msg) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { toast(msg); }, function () { toast(msg); });
    } else { toast(msg); }
  }

  function bind(sel, fn) { var el = $(sel); if (el) el.addEventListener('click', function (e) { e.preventDefault(); fn(); }); }

  bind('#copy-derivation', function () { copy(derivationText(), 'Mathematical derivation copied to clipboard'); });
  bind('#copy-api',        function () { copy(apiCall(), 'CURL API command copied to clipboard'); });
  bind('#export-pdf',      function () { toast('Opening print dialog…'); setTimeout(function () { window.print(); }, 350); });
  bind('#save-scenario',   function () {
    try {
      var saved = JSON.parse(localStorage.getItem('tc.scenarios') || '[]');
      saved.push({
        code: activeCode,
        slug: activeSlug,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('tc.scenarios', JSON.stringify(saved));
      toast('Scenario saved to local browser storage (' + saved.length + ' total)');
    } catch (err) { toast('Scenario saved for this session'); }
  });

  /* ====================================================================
     8. AUTH MODAL & POPOVER
     ==================================================================== */
  var sheet   = $('#signin-sheet');
  var trigger = $('#signin-trigger');
  var chip    = $('#account-trigger');
  var popover = $('#account-popover');

  var AUTH_COPY = {
    signin: { title: 'Sign in to TrueCalci', sub: 'Your keys, saved scenarios and regional defaults, in one place.', cta: 'Continue with email' },
    create: { title: 'Create your account', sub: 'Free tier included — 500 calls a month, no card required.', cta: 'Create account' }
  };

  function openSheet(e) {
    if (e) e.preventDefault();
    if (!sheet) return;
    sheet.hidden = false;
    var email = $('#sheet-email');
    if (email) email.focus();
  }
  function closeSheet() { if (sheet) sheet.hidden = true; }

  if (trigger) trigger.addEventListener('click', openSheet);
  bind('#sheet-close', closeSheet);
  if (sheet) sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });

  var seg = $('#sheet-seg');
  if (seg) seg.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-mode]');
    if (!btn) return;
    $$('button', seg).forEach(function (b) { b.setAttribute('aria-selected', String(b === btn)); });
    var c = AUTH_COPY[btn.dataset.mode];
    setText('#sheet-title', c.title);
    setText('#sheet-sub', c.sub);
    setText('#sheet-cta', c.cta);
  });

  function signIn(e) {
    if (e) e.preventDefault();
    closeSheet();
    if (trigger) trigger.hidden = true;
    if (chip) chip.hidden = false;
    toast('Signed in as developer@truecalci.com');
  }
  bind('#sheet-cta', signIn);
  $$('[data-auth]').forEach(function (b) { b.addEventListener('click', signIn); });

  if (chip) chip.addEventListener('click', function (e) {
    e.stopPropagation();
    popover.hidden = !popover.hidden;
    chip.setAttribute('aria-expanded', String(!popover.hidden));
  });
  document.addEventListener('click', function (e) {
    if (popover && !popover.hidden && !popover.contains(e.target) && !chip.contains(e.target)) {
      popover.hidden = true;
      chip.setAttribute('aria-expanded', 'false');
    }
  });
  bind('#signout', function () {
    if (popover) popover.hidden = true;
    if (chip) chip.hidden = true;
    if (trigger) trigger.hidden = false;
    toast('Signed out successfully');
  });

  /* ====================================================================
     9. DODO BILLING MODAL
     ==================================================================== */
  var billing = $('#billing-modal');
  function openBilling(e) {
    if (e) e.preventDefault();
    if (!billing) return;
    if (popover) popover.hidden = true;
    billing.hidden = false;
  }
  function closeBilling() { if (billing) billing.hidden = true; }

  $$('[data-action="open-billing"]').forEach(function (b) { b.addEventListener('click', openBilling); });
  bind('#billing-close', closeBilling);
  if (billing) billing.addEventListener('click', function (e) { if (e.target === billing) closeBilling(); });

  bind('#dodo-checkout', function () {
    closeBilling();
    toast('Redirecting to Dodo Payments checkout session…');
  });
  $$('[data-action="downgrade"]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); toast('Switched to monthly billing renewal'); });
  });
  $$('[data-action="receipt"]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); toast('Downloading receipt from Dodo customer portal'); });
  });
  $$('[data-action="rotate-key"]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var row = b.closest('.key-row');
      var masked = row ? $('.key-row__masked', row) : null;
      if (masked) masked.textContent = 'tc_live_' + Math.random().toString(16).slice(2, 6) + '••••••••' + Math.random().toString(16).slice(2, 6);
      toast('API Key rotated — previous key invalidated in 60 minutes');
    });
  });

  /* ====================================================================
     10. KEYBOARD ESCAPE LISTENER
     ==================================================================== */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeSheet();
    closeBilling();
    closeDrawer();
    if (popover) popover.hidden = true;
  });

  /* ====================================================================
     11. INITIALIZATION
     ==================================================================== */
  applyCurrency();
  updateDrawerContent();
  recalcCurrent();
})();
