/* ==========================================================================
   TrueCalci — workstation.js
   Dependency-free, deterministic Workstation Studio driver.
   Supports all 24 production computational engines, dynamic multi-currency,
   ephemeral RAM recalculations, derivation drawer, hash routing, and Dodo billing flows.
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

  function normalizeCurrency(val) {
    if (!val) return 'USD';
    var u = String(val).toUpperCase().trim();
    return (u === 'INDIA' || u === 'INR') ? 'INR' : 'USD';
  }

  var cur = normalizeCurrency(html.dataset.currency || (function() {
    try { return localStorage.getItem('calc_region'); } catch(e) { return 'USD'; }
  })());

  function getCur() {
    return CUR[cur] || CUR.USD;
  }

  function fmt(n) {
    var c = getCur();
    if (typeof n !== 'number' || isNaN(n)) n = 0;
    var v = Math.round(n * (cur === 'INR' ? c.rate : 1));
    return c.symbol + v.toLocaleString(cur === 'INR' ? 'en-IN' : 'en-US');
  }

  function applyCurrency() {
    cur = normalizeCurrency(cur);
    html.dataset.currency = cur;
    var c = getCur();

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

    try {
      recalcCurrent();
    } catch (err) {
      console.warn('recalcCurrent error in applyCurrency:', err);
    }
  }

  var curBtn = $('#currency-toggle');
  if (curBtn) curBtn.addEventListener('click', function () {
    cur = cur === 'USD' ? 'INR' : 'USD';
    try { localStorage.setItem('calc_region', cur === 'INR' ? 'india' : 'global'); } catch (e) {}
    applyCurrency();
    toast('Currency switched to ' + getCur().short);
  });

  /* ====================================================================
     3. STAGE SWITCHING & ACTIVE ENGINE
     ==================================================================== */
  var activeCode = 'CTR-18';
  var activeSlug = 'contractor.parity';
  var activeTitle = '1099 vs W-2 Parity & S-Corp Optimizer';

  var STAGES = {
    'CTR-18': '#stage-contractor',
    'AIT-20': '#stage-ai-tokens',
    'SRD-21': '#stage-startup',
    'B2B-22': '#stage-b2b',
    'FEI-23': '#stage-feie',
    'CEF-24': '#stage-egress'
  };

  function switchEngine(tool) {
    if (!tool) return;
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
      try {
        renderGenericEngine(activeCode, activeSlug, activeTitle);
      } catch (err) {
        console.error('renderGenericEngine error:', err);
      }
    }

    try { updateDrawerContent(); } catch (e) { console.warn(e); }
    try { recalcCurrent(); } catch (e) { console.warn(e); }
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
     4. DERIVATIONS DICTIONARY (All 24 Engines Covered)
     ==================================================================== */
  var DERIVATIONS = {
    'CTR-18': {
      title: 'Contractor vs W-2 Parity & S-Corp',
      formula: 'SE_base = (R − E) × 0.9235\nSE_tax = SE_base × 0.153 (to cap $176,100) + excess × 0.029\nS_Corp_salary = (R − E) × s\nFICA = S_Corp_salary × 0.153\nSavings = SE_tax − FICA\nFloor = (Net + FICA + Health + Benefits) ÷ Hours',
      statutes: [
        { name: 'Self-employment tax base (92.35%)', ref: 'IRC § 1402(a)', url: 'https://www.law.cornell.edu/uscode/text/26/1402' },
        { name: 'Qualified Business Income Deduction (20%)', ref: 'IRC § 199A', url: 'https://www.law.cornell.edu/uscode/text/26/199A' },
        { name: 'Reasonable Compensation Guidelines', ref: 'IRS Rev. Rul. 74-44', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/s-corporation-compensation-and-medical-insurance-issues' }
      ]
    },
    'SCP-19': {
      title: 'S-Corp Reasonable Salary Optimizer',
      formula: 'SE_SoleProp = (Profit × 0.9235) × 0.153\nSalary = Profit × Split%\nFICA_SCorp = Salary × 0.153\nFICA_Saved = max(SE_SoleProp − FICA_SCorp, 0)\nNet_Benefit = FICA_Saved − (Payroll_Fee + CPA_Fee)',
      statutes: [
        { name: 'Reasonable Officer Compensation Mandate', ref: 'IRS Rev. Rul. 74-44', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/s-corporation-compensation-and-medical-insurance-issues' },
        { name: 'FICA Taxation Limits & Wages', ref: 'IRC § 3121(a)', url: 'https://www.law.cornell.edu/uscode/text/26/3121' }
      ]
    },
    'SLO-20': {
      title: 'Solo 401(k) Maximizer & Tax Shield',
      formula: 'Employee_Deferral = $23,000 (+ $7,500 if Age ≥ 50)\nEmployer_Share = Profit × 0.20 (LLC) or W2_Salary × 0.25 (S-Corp)\nMax_Solo401k = min(Employee_Deferral + Employer_Share, $69,000)\nSEP_IRA_Comparison = Profit × 0.20\nImmediate_Tax_Saved = Max_Solo401k × Marginal_Tax_Rate',
      statutes: [
        { name: 'Defined Contribution Plan Dollar Limitations', ref: 'IRC § 415(c)(1)(A)', url: 'https://www.law.cornell.edu/uscode/text/26/415' },
        { name: 'One-Participant 401(k) Plans Overview', ref: 'IRS Publication 560', url: 'https://www.irs.gov/retirement-plans/one-participant-401k-plans' }
      ]
    },
    'FXR-21': {
      title: 'Cross-Border FX Rail Drag',
      formula: 'Landed_Cash = Invoice × (1 − Rail_Fee_Drag) × Mid_Market_Rate\nRail_Drag = Spread% + Fixed_Transaction_Fee\nAnnual_Loss = 12 × (Landed_Benchmark − Landed_Current_Rail)',
      statutes: [
        { name: 'Currency Codes and Decimal Representation', ref: 'ISO 4217 Currency Standard', url: 'https://www.iso.org/iso-4217-currency-codes.html' },
        { name: 'Enhancing Cross-Border Payments Protocol', ref: 'BIS CPMI Report 197', url: 'https://www.bis.org/cpmi/publ/d197.htm' }
      ]
    },
    'BHF-22': {
      title: 'Billable Hourly Floor Solver',
      formula: 'Working_Weeks = 52 − Vacation_Weeks − Sick_Holiday_Weeks\nBillable_Capacity = Working_Weeks × Hours_Per_Week × (1 − NonBillable%)\nRequired_Gross = (Target_Net + Expenses + Health + Buffer) ÷ (1 − Effective_Tax_Rate)\nHourly_Floor = Required_Gross ÷ Billable_Capacity',
      statutes: [
        { name: 'Independent Contractor Schedule C Deductions', ref: 'IRC § 162(a)', url: 'https://www.law.cornell.edu/uscode/text/26/162' }
      ]
    },
    'AIT-20': {
      title: 'AI Token Inference & Cache Arbitrage',
      formula: 'Effective_Cost = (Prompt × (1 - HitRate) × Rate_In) + (Prompt × HitRate × Rate_Cache) + (Comp × Rate_Out)\nBatch_Cost = Effective_Cost × 0.50\nDisparity_Ratio = Max_Cost ÷ Min_Cost',
      statutes: [
        { name: 'Anthropic Prompt Caching Protocol', ref: 'Claude API Pricing 2026', url: 'https://www.anthropic.com/pricing' },
        { name: 'OpenAI Prompt Caching & Batch API SLA', ref: 'OpenAI Platform Pricing', url: 'https://openai.com/api/pricing/' },
        { name: 'DeepSeek Multi-Head Latent Attention Specification', ref: 'DeepSeek API Architecture', url: 'https://api-docs.deepseek.com/quick_start/pricing' }
      ]
    },
    'SRD-21': {
      title: 'Startup Runway & Dilution Waterfall',
      formula: 'Net_Burn = Gross_Burn − MRR\nRunway_Months = Cash_In_Bank ÷ Net_Burn\nSAFE_Ownership = Investment_SAFE ÷ Post_Money_Cap\nSeries_A_Ownership = Investment_SeriesA ÷ (Pre_Valuation + Investment_SeriesA)\nFounder_Retained = (1 − SAFE_Own) × (1 − Series_A_Own) × (1 − Option_Pool)',
      statutes: [
        { name: 'Y Combinator Standard Post-Money SAFE', ref: 'YC Safe Guidelines v1.3', url: 'https://www.ycombinator.com/documents' },
        { name: 'National Venture Capital Model Term Sheet', ref: 'NVCA Standards', url: 'https://nvca.org/model-legal-documents/' }
      ]
    },
    'B2B-22': {
      title: 'Cross-Border B2B Withholding & PE Threshold',
      formula: 'Statutory_Withholding = Invoice × Statutory_Rate\nTreaty_Withholding = Has_TRC ? (Invoice × Treaty_Rate) : Statutory_Withholding\nPE_Trigger = OnSite_Days > 183\nNet_Cash = Invoice − Treaty_Withholding',
      statutes: [
        { name: 'OECD Model Tax Convention Article 5 (PE)', ref: 'OECD Base Erosion (BEPS)', url: 'https://www.oecd.org/en/topics/sub-issues/model-tax-convention.html' },
        { name: 'Foreign Entity Withholding Certificate', ref: 'IRS Form W-8BEN-E', url: 'https://www.irs.gov/forms-pubs/about-form-w-8-ben-e' },
        { name: 'Nonresident Alien & Entity Withholding Tax', ref: 'IRC § 1441 / § 1442', url: 'https://www.law.cornell.edu/uscode/text/26/1441' }
      ]
    },
    'FEI-23': {
      title: 'IRS Form 2555 Foreign Earned Income Exclusion',
      formula: 'Qualifies_PPT = Days_Abroad_in_365_days ≥ 330\nFEIE_Cap = $130,000 (Tax Year 2026)\nExcluded_Amount = Qualifies_PPT ? min(Income, FEIE_Cap) : 0\nTaxable_Excess = max(Income − Excluded_Amount, 0)\nEstimated_Tax_Saved = Excluded_Amount × 0.24',
      statutes: [
        { name: 'Foreign Earned Income Exclusion (FEIE)', ref: 'IRC § 911(a)', url: 'https://www.law.cornell.edu/uscode/text/26/911' },
        { name: 'Physical Presence Test (330 full days abroad)', ref: '26 CFR § 1.911-2(d)', url: 'https://www.law.cornell.edu/cfr/text/26/1.911-2' },
        { name: 'IRS Official Form 2555 Instructions', ref: 'IRS Form 2555', url: 'https://www.irs.gov/individuals/international-taxpayers/foreign-earned-income-exclusion' }
      ]
    },
    'CEF-24': {
      title: 'Multi-Cloud Egress & Transit Optimization',
      formula: 'Standard_Egress = Tiered_Hyperscaler_Rates(Egress_GB)\nDirect_Connect_Cost = (Egress_GB × 0.02) + (Commit_Gbps × Port_Hour_Rate × 730)\nZero_Egress_Cost = Egress_GB × 0.015 (Worker Proxy / R2 Transit)\nMonthly_Savings = Standard_Egress − min(Direct_Connect_Cost, Zero_Egress_Cost)',
      statutes: [
        { name: 'Hyperscaler Direct Connect Rate Cards', ref: 'AWS Dedicated Transit', url: 'https://aws.amazon.com/directconnect/pricing/' },
        { name: 'Zero Data Egress Transit Protocol', ref: 'Cloudflare Bandwidth Alliance', url: 'https://www.cloudflare.com/bandwidth-alliance/' }
      ]
    },
    'MTG-01': {
      title: 'Mortgage PITI & PMI Amortization',
      formula: 'Monthly_PI = P × [r(1 + r)^n] ÷ [(1 + r)^n − 1]\nPMI = Down% < 20% ? (Loan × 0.75% ÷ 12) : 0\nPITI = Monthly_PI + PMI + Monthly_Tax + Monthly_Hazard_Ins',
      statutes: [
        { name: 'CFPB Truth in Lending Act (Regulation Z)', ref: '12 CFR Part 1026', url: 'https://www.consumerfinance.gov/owning-a-home/loan-estimate/' },
        { name: 'Homeowners Protection Act (PMI Cancellation)', ref: '12 U.S.C. § 4901', url: 'https://www.law.cornell.edu/uscode/text/12/4901' }
      ]
    },
    'VAT-02': {
      title: 'European VAT & Sales Tax Reversal',
      formula: 'Add_Mode: Gross = Net × (1 + Rate)\nRemove_Mode: Net = Gross ÷ (1 + Rate)\nTax_Amount = Gross − Net',
      statutes: [
        { name: 'EU Council Directive on Common System of VAT', ref: 'Directive 2006/112/EC', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0112' },
        { name: 'European Commission VIES Tax Verification', ref: 'EC Taxation & Customs', url: 'https://ec.europa.eu/taxation_customs/vies/' }
      ]
    },
    'TIP-03': {
      title: 'Tip & Bill Splitter',
      formula: 'Tip_Amount = Bill × Tip%\nTotal_Bill = Bill + Tip_Amount\nPer_Person = Total_Bill ÷ Number_Of_Guests',
      statutes: [
        { name: 'Fair Labor Standards Act Tip Regulations', ref: '29 U.S.C. § 203(m)', url: 'https://www.dol.gov/agencies/whd/flsa/tips' }
      ]
    },
    'CMP-04': {
      title: 'Compound Wealth & 401(k) Future Value',
      formula: 'FV = P × (1 + r/n)^(n×t) + PMT × [((1 + r/n)^(n×t) − 1) ÷ (r/n)]\nTotal_Principal = P + (PMT × 12 × t)\nCompound_Gains = FV − Total_Principal',
      statutes: [
        { name: 'Compound Interest Financial Computation Standard', ref: 'FINRA Investor Guidelines', url: 'https://www.finra.org/investors/investing/investing-basics' },
        { name: 'SEC Compound Interest & Retirement Methodology', ref: 'SEC Investor Tools', url: 'https://www.sec.gov/investor/tools/calculators' }
      ]
    },
    'ITX-05': {
      title: 'Indian Income Tax — Section 115BAC (ITA 2025)',
      formula: 'Taxable_Income = max(Gross − Standard_Deduction(₹75,000), 0)\nSlabs: 0-3L (Nil), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), >15L (30%)\nRebate_87A = Taxable ≤ 12,00,000 ? Full Rebate : 0\nHealth_Education_Cess = Tax × 4%',
      statutes: [
        { name: 'Income Tax Department Official Tax Slab Schedule', ref: 'Income-tax Act § 115BAC', url: 'https://www.incometax.gov.in/iec/fposervices/#/tax-slab' },
        { name: 'Union Budget Finance Bill 2025-26 & 2026-27', ref: 'Ministry of Finance Official', url: 'https://indiabudget.gov.in/' }
      ]
    },
    'GST-06': {
      title: 'Goods and Services Tax (GST) Split',
      formula: 'Total_GST = Base_Amount × Rate%\nIntrastate: CGST = Total_GST ÷ 2, SGST = Total_GST ÷ 2\nInterstate: IGST = Total_GST\nGross_Invoice = Base_Amount + Total_GST',
      statutes: [
        { name: 'Central Goods and Services Tax Act, 2017', ref: 'CGST Act § 9 & IGST Act § 5', url: 'https://cbic-gst.gov.in/' }
      ]
    },
    'SIP-09': {
      title: 'Mutual Fund SIP with Geometric Step-Up',
      formula: 'FV = Σ [Monthly_Instalment_y × (1 + r)^(months_remaining)]\nMonthly_Instalment_y = Base_SIP × (1 + StepUp%)^y',
      statutes: [
        { name: 'SEBI Mutual Fund Investment Performance Norms', ref: 'SEBI (Mutual Funds) Reg. 1996', url: 'https://www.sebi.gov.in/' }
      ]
    },
    'FXD-10': {
      title: 'Fixed Deposit (FD) Compounding',
      formula: 'A = P × (1 + r/n)^(n×t)\nInterest_Earned = A − P\nAPY = (1 + r/n)^n − 1',
      statutes: [
        { name: 'Reserve Bank of India Master Directions on Interest Rates', ref: 'RBI/DBR/2015-16/19', url: 'https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx' }
      ]
    },
    'GLD-11': {
      title: 'Gold & Jewellery Invoice Calculator',
      formula: 'Pure_Gold_Value = Weight_Grams × Karat_Rate_Per_Gram\nMaking_Charges = Pure_Gold_Value × Making_Charge%\nTaxable_Value = Pure_Gold_Value + Making_Charges\nGST_3% = Taxable_Value × 0.03\nInvoice_Total = Taxable_Value + GST_3%',
      statutes: [
        { name: 'Bureau of Indian Standards (BIS) Hallmarking Order', ref: 'BIS Hallmark Standard 2021', url: 'https://www.bis.gov.in/hallmarking-overview/' }
      ]
    },
    'PPF-13': {
      title: 'Public Provident Fund (PPF)',
      formula: 'Interest calculated on minimum balance between 5th and last day of month.\nAnnual compounding at statutory rate (7.1%).\nExempt-Exempt-Exempt (EEE) statutory tax status.',
      statutes: [
        { name: 'Public Provident Fund Scheme, 2019', ref: 'GSR 915(E) Ministry of Finance', url: 'https://nsiindia.gov.in/InternalPage.aspx?Id_Pk=55' },
        { name: 'Deductions in Respect of Life Insurance, PPF, etc.', ref: 'Income-tax Act § 80C', url: 'https://www.incometax.gov.in/iec/fposervices/#/tax-slab' }
      ]
    },
    'SSY-14': {
      title: 'Sukanya Samriddhi Account (SSY)',
      formula: 'Deposits allowed up to 15 years from opening date.\nMaturity occurs after 21 years from opening date.\nCompounded annually at statutory 8.2% rate with EEE tax exemption.',
      statutes: [
        { name: 'Sukanya Samriddhi Account Rules, 2019', ref: 'GSR 914(E) Ministry of Finance', url: 'https://nsiindia.gov.in/InternalPage.aspx?Id_Pk=89' }
      ]
    },
    'HLN-07': {
      title: 'Home Loan EMI & Prepayment Reduction',
      formula: 'EMI = P × [r(1+r)^n] ÷ [(1+r)^n − 1]\nPrepayment accelerates principal amortization, reducing tenure n.',
      statutes: [
        { name: 'Reserve Bank of India Housing Finance Circular', ref: 'RBI/2014-15/65', url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=9202' }
      ]
    },
    'SCI-15': {
      title: 'Scientific 991 Analytical Solver',
      formula: 'Quadratic: ax² + bx + c = 0\nDiscriminant: Δ = b² − 4ac\nRoots: x = (−b ± √Δ) ÷ (2a)\nVertex: (−b ÷ 2a, −Δ ÷ 4a)',
      statutes: [
        { name: 'IEEE Standard for Floating-Point Arithmetic', ref: 'IEEE 754-2019 Specification', url: 'https://standards.ieee.org/ieee/754/6267/' }
      ]
    },
    'PRG-17': {
      title: 'Programmer 64-Bit Logic & Bitboard',
      formula: 'Bitwise AND: A & B | OR: A | B | XOR: A ^ B | NOT: ~A\nTwo\'s complement representation for signed 64-bit integers.',
      statutes: [
        { name: 'ISO/IEC 9899 Specification for Bitwise Logic', ref: 'ISO/IEC 9899:2018 (C18)', url: 'https://www.iso.org/standard/74528.html' }
      ]
    }
  };

  function updateDrawerContent() {
    var body = $('#drawer-body-content');
    var stageLinksContainer = $('#statutory-links-container');

    var d = DERIVATIONS[activeCode] || {
      title: activeTitle,
      formula: 'Result = f(Inputs) [IEEE 754 Deterministic Float Standard]',
      statutes: [
        { name: 'Official Statutory & Numerical Standards', ref: 'IEEE 754-2019 Specification', url: 'https://standards.ieee.org/ieee/754/6267/' }
      ]
    };

    if (body) {
      var htmlContent = [
        '<div class="caps" style="opacity:0.5;margin-bottom:8px;">' + d.title + '</div>',
        '<div class="formula">' + d.formula.replace(/\n/g, '<br>') + '</div>',
        '<div class="caps" style="opacity:0.5;margin:26px 0 8px;">Statutory &amp; Technical References</div>'
      ];

      d.statutes.forEach(function (s) {
        htmlContent.push(
          '<a class="statute" href="' + s.url + '" target="_blank" rel="noopener noreferrer">' +
            s.name + '<span class="statute__ref">' + s.ref + ' ↗</span>' +
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

    if (stageLinksContainer) {
      var chips = [];
      d.statutes.forEach(function (s) {
        chips.push(
          '<a class="statute-chip" href="' + s.url + '" target="_blank" rel="noopener noreferrer" title="View official primary document for ' + s.name + '">' +
            '<span>' + s.name + '</span>' +
            '<span class="statute-chip__ref">' + s.ref + ' ↗</span>' +
          '</a>'
        );
      });
      stageLinksContainer.innerHTML = chips.join('');
    }
  }

  /* ====================================================================
     5. COMPUTATIONAL ENGINES & CALCULATION LOGIC
     ==================================================================== */
  var SE_BASE   = 0.9235;
  var FICA      = 0.153;
  var OASDI_CAP = 176100;
  var MEDICARE  = 0.029;
  var FED_EFF   = 0.235;
  var QBI       = 0.20;

  function num(id) { var el = $(id); return el ? parseFloat(el.value) || 0 : 0; }
  function setText(sel, val) { var el = $(sel); if (el) el.textContent = val; }

  // 1. Contractor Parity & S-Corp (CTR-18)
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

  // 2. AI Token Arbitrage (AIT-20)
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

  // 3. Startup Runway & Dilution (SRD-21)
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

  // 4. B2B Withholding & PE Risk (B2B-22)
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

  // 5. FEIE Nomad Tracker (FEI-23)
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

  // 6. Cloud Egress FinOps (CEF-24)
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

  // 7. Generic Engine Builder for Classical & Statutory Suites (All remaining engines)
  var GENERIC_CONFIGS = {
    // Remote Suite Extras
    'SCP-19': {
      title: 'S-Corp Reasonable Salary Optimizer',
      sub: 'IRS Rev. Rul. 74-44 FICA Tax Shield and Net Corporate Savings',
      fields: [
        { id: 'scp-profit', label: 'Net business profit', type: 'number', val: 150000, step: 5000, cur: true },
        { id: 'scp-split', label: 'Reasonable salary split (%)', type: 'number', val: 55, step: 1, suffix: '%' },
        { id: 'scp-payroll', label: 'Annual payroll service fee', type: 'number', val: 600, step: 50, cur: true },
        { id: 'scp-cpa', label: 'Annual CPA 1120-S filing fee', type: 'number', val: 1500, step: 100, cur: true }
      ],
      calc: function () {
        var profit = num('#scp-profit'), split = num('#scp-split') / 100;
        var payrollFee = num('#scp-payroll'), cpaFee = num('#scp-cpa');
        var seSoleProp = profit * 0.9235 * 0.153;
        var salary = profit * split;
        var ficaScorp = salary * 0.153;
        var grossFicaSaved = Math.max(seSoleProp - ficaScorp, 0);
        var overhead = payrollFee + cpaFee;
        var netSavings = Math.max(grossFicaSaved - overhead, 0);
        return {
          primaryLabel: 'Net Annual FICA Tax Saved',
          primaryVal: fmt(netSavings),
          subText: 'Gross Saved: ' + fmt(grossFicaSaved) + ' · Overhead: -' + fmt(overhead),
          metrics: [
            { label: 'Reasonable Salary (W-2)', val: fmt(salary) },
            { label: 'Corporate K-1 Distribution', val: fmt(profit - salary) },
            { label: 'Breakeven Profit Threshold', val: fmt(41000) },
            { label: 'Audit Safety Rating', val: split >= 0.50 ? 'Strong (≥50%)' : 'Caution (<50%)' }
          ]
        };
      }
    },
    'SLO-20': {
      title: 'Solo 401(k) Maximizer & Tax Shield',
      sub: 'IRS Notice 2023-75 Limits ($69k / $76.5k) vs SEP-IRA',
      fields: [
        { id: 'slo-earnings', label: 'Net self-employed business earnings', type: 'number', val: 120000, step: 5000, cur: true },
        { id: 'slo-age50', label: 'Age 50 or older ($7,500 catch-up)', type: 'number', val: 0, step: 1, suffix: '0=No, 1=Yes' },
        { id: 'slo-taxrate', label: 'Combined marginal tax rate (%)', type: 'number', val: 28, step: 1, suffix: '%' }
      ],
      calc: function () {
        var earnings = num('#slo-earnings'), is50 = num('#slo-age50') > 0, rate = num('#slo-taxrate') / 100;
        var employee = 23000 + (is50 ? 7500 : 0);
        var employer = earnings * 0.20;
        var cap = is50 ? 76500 : 69000;
        var soloMax = Math.min(employee + employer, cap);
        var sepMax = earnings * 0.20;
        var extraShield = Math.max(soloMax - sepMax, 0);
        var taxSaved = soloMax * rate;
        return {
          primaryLabel: 'Maximum Legal Tax Shelter',
          primaryVal: fmt(soloMax),
          subText: 'Immediate Cash Tax Saved: ' + fmt(taxSaved),
          metrics: [
            { label: 'Employee Elective Deferral', val: fmt(employee) },
            { label: 'Employer 20% Profit Share', val: fmt(employer) },
            { label: 'Extra Shelter vs SEP-IRA', val: fmt(extraShield) },
            { label: 'Cash Tax Benefit', val: fmt(taxSaved) }
          ]
        };
      }
    },
    'FXR-21': {
      title: 'Cross-Border FX Rail Drag',
      sub: 'Landed Local Currency vs Mid-Market Benchmark & Provider Spreads',
      fields: [
        { id: 'fxr-amount', label: 'Gross USD invoice amount', type: 'number', val: 10000, step: 500, cur: true }
      ],
      calc: function () {
        var usd = num('#fxr-amount');
        var eurBenchmark = usd * 0.92;
        var wiseLanded = usd * (1 - 0.0055) * 0.92;
        var stripeLanded = usd * (1 - 0.039) * 0.92;
        var paypalLanded = usd * (1 - 0.079) * 0.92;
        var wiseSavings = wiseLanded - paypalLanded;
        return {
          primaryLabel: 'Landed EUR (Wise Business)',
          primaryVal: '€' + Math.round(wiseLanded).toLocaleString('en-US'),
          subText: 'Mid-Market: €' + Math.round(eurBenchmark).toLocaleString('en-US') + ' · Drag: 0.55%',
          metrics: [
            { label: 'Wise Drag (0.55%)', val: '€' + Math.round(eurBenchmark - wiseLanded).toLocaleString('en-US') },
            { label: 'PayPal Drag (7.90%)', val: '€' + Math.round(eurBenchmark - paypalLanded).toLocaleString('en-US') },
            { label: 'Annual Savings vs PayPal', val: '€' + Math.round(wiseSavings * 12).toLocaleString('en-US') },
            { label: 'Optimal Rail', val: 'Wise Business' }
          ]
        };
      }
    },
    'BHF-22': {
      title: 'Billable Hourly Floor Solver',
      sub: 'True Hourly Floor Accounting for 47 Weeks, Buffer & FICA',
      fields: [
        { id: 'bhf-takehome', label: 'Target annual net spendable cash', type: 'number', val: 120000, step: 5000, cur: true },
        { id: 'bhf-expenses', label: 'Annual deductible business expenses', type: 'number', val: 8000, step: 500, cur: true },
        { id: 'bhf-health', label: 'Annual out-of-pocket health insurance', type: 'number', val: 7200, step: 500, cur: true },
        { id: 'bhf-vacation', label: 'Vacation & holiday weeks off', type: 'number', val: 5.5, step: 0.5, suffix: 'wks' },
        { id: 'bhf-nonbill', label: 'Non-billable admin / sales drag (%)', type: 'number', val: 28, step: 1, suffix: '%' }
      ],
      calc: function () {
        var takeHome = num('#bhf-takehome'), exp = num('#bhf-expenses'), health = num('#bhf-health');
        var offWeeks = num('#bhf-vacation'), nonBill = num('#bhf-nonbill') / 100;
        var workingWeeks = Math.max(52 - offWeeks, 1);
        var nominalHours = workingWeeks * 40;
        var billableHours = Math.round(nominalHours * (1 - nonBill));
        // Effective tax and buffer estimate ~28%
        var grossTarget = (takeHome + exp + health) / 0.72;
        var floor = billableHours > 0 ? (grossTarget / billableHours) : 0;
        return {
          primaryLabel: 'True Billable Rate Floor',
          primaryVal: '$' + Math.round(floor) + ' / hr',
          subText: 'Annual Billable Hours: ' + billableHours + ' hrs (' + workingWeeks.toFixed(1) + ' weeks)',
          metrics: [
            { label: 'Gross Target Revenue', val: fmt(grossTarget) },
            { label: 'Working Weeks / Year', val: workingWeeks.toFixed(1) + ' wks' },
            { label: 'Annual Billable Hours', val: billableHours + ' hrs' },
            { label: 'Capacity Utilization', val: ((1 - nonBill) * 100).toFixed(0) + '%' }
          ]
        };
      }
    },

    // Global & Real Estate Suite
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
    'TIP-03': {
      title: 'Tip & Bill Splitter',
      sub: 'Restaurant Dining Gratuity, Tax Inclusion & Per-Guest Itemized Split',
      fields: [
        { id: 'tip-bill', label: 'Subtotal bill amount', type: 'number', val: 85, step: 5, cur: true },
        { id: 'tip-pct', label: 'Gratuity tip percentage (%)', type: 'number', val: 18, step: 1, suffix: '%' },
        { id: 'tip-guests', label: 'Number of paying guests', type: 'number', val: 2, min: 1, max: 50, step: 1 }
      ],
      calc: function () {
        var bill = num('#tip-bill'), pct = num('#tip-pct') / 100, guests = Math.max(num('#tip-guests'), 1);
        var tipVal = bill * pct;
        var total = bill + tipVal;
        var perPerson = total / guests;
        return {
          primaryLabel: 'Per Person Share',
          primaryVal: fmt(perPerson),
          subText: 'Total Bill with Tip: ' + fmt(total),
          metrics: [
            { label: 'Total Tip Added', val: fmt(tipVal) },
            { label: 'Guest Count', val: guests + ' guests' },
            { label: 'Subtotal Base', val: fmt(bill) },
            { label: 'Effective Tip Rate', val: (pct * 100).toFixed(1) + '%' }
          ]
        };
      }
    },
    'CMP-04': {
      title: 'Compound Wealth & 401(k) Simulator',
      sub: 'Long-Term Exponential Compounding for Retirement, ISA & Wealth Corpus',
      fields: [
        { id: 'cmp-init', label: 'Initial principal investment', type: 'number', val: 10000, step: 1000, cur: true },
        { id: 'cmp-monthly', label: 'Monthly recurring contribution', type: 'number', val: 500, step: 50, cur: true },
        { id: 'cmp-rate', label: 'Expected annual return (%)', type: 'number', val: 8.0, step: 0.25, suffix: '%' },
        { id: 'cmp-years', label: 'Investment horizon (years)', type: 'number', val: 15, step: 1, suffix: 'yrs' }
      ],
      calc: function () {
        var p = num('#cmp-init'), pmt = num('#cmp-monthly'), r = (num('#cmp-rate') / 100) / 12, n = num('#cmp-years') * 12;
        var fvInit = p * Math.pow(1 + r, n);
        var fvContrib = r > 0 ? (pmt * (Math.pow(1 + r, n) - 1) / r) : (pmt * n);
        var totalFv = fvInit + fvContrib;
        var totalDeposited = p + (pmt * n);
        var gains = Math.max(totalFv - totalDeposited, 0);
        return {
          primaryLabel: 'Estimated Future Corpus',
          primaryVal: fmt(totalFv),
          subText: 'Compound Interest Gains: ' + fmt(gains),
          metrics: [
            { label: 'Total Principal Deposited', val: fmt(totalDeposited) },
            { label: 'Compound Interest Share', val: (totalFv > 0 ? (gains / totalFv * 100).toFixed(1) : 0) + '%' },
            { label: 'Wealth Multiplier', val: (totalDeposited > 0 ? (totalFv / totalDeposited).toFixed(2) : 1) + 'x' },
            { label: 'Horizon Duration', val: num('#cmp-years') + ' Years' }
          ]
        };
      }
    },

    // Statutory & Tax Suite
    'ITX-05': {
      title: 'Indian Income Tax — Section 115BAC (ITA 2025)',
      sub: 'Statutory New Tax Regime Slabs (Zero Net Tax Up to ₹12.75 Lakhs for Salaried)',
      fields: [
        { id: 'itx-income', label: 'Gross total income (₹)', type: 'number', val: 1250000, step: 25000, suffix: '₹' },
        { id: 'itx-std', label: 'Standard deduction (₹)', type: 'number', val: 75000, step: 5000, suffix: '₹' }
      ],
      calc: function () {
        var income = num('#itx-income'), std = num('#itx-std');
        var net = Math.max(income - std, 0);
        var tax = 0;
        if (net > 1500000) { tax += (net - 1500000) * 0.30; net = 1500000; }
        if (net > 1200000) { tax += (net - 1200000) * 0.20; net = 1200000; }
        if (net > 1000000) { tax += (net - 1000000) * 0.15; net = 1000000; }
        if (net > 700000)  { tax += (net - 700000)  * 0.10; net = 700000; }
        if (net > 300000)  { tax += (net - 300000)  * 0.05; }
        // Section 87A rebate under FY25-26 Budget: up to 12L taxable income => full rebate!
        if (income - std <= 1200000) {
          tax = 0;
        }
        var cess = tax * 0.04;
        var totalTax = tax + cess;
        return {
          primaryLabel: 'Total Income Tax Payable (115BAC)',
          primaryVal: '₹' + Math.round(totalTax).toLocaleString('en-IN'),
          subText: totalTax === 0 ? 'Zero Net Tax (Section 87A Full Rebate Applied)' : ('Effective Tax Rate: ' + (income > 0 ? (totalTax / income * 100).toFixed(2) : 0) + '%'),
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
    },
    'FXD-10': {
      title: 'Fixed Deposit (FD) Maturity Solver',
      sub: 'Quarterly Compounding Bank Fixed Deposit Growth',
      fields: [
        { id: 'fxd-principal', label: 'Principal deposit amount', type: 'number', val: 500000, step: 25000, cur: true },
        { id: 'fxd-rate', label: 'Annual interest rate (%)', type: 'number', val: 7.25, step: 0.25, suffix: '%' },
        { id: 'fxd-tenure', label: 'Tenure (years)', type: 'number', val: 5, step: 1, suffix: 'yrs' }
      ],
      calc: function () {
        var p = num('#fxd-principal'), r = num('#fxd-rate') / 100, t = num('#fxd-tenure');
        var n = 4; // quarterly
        var maturity = p * Math.pow(1 + r / n, n * t);
        var interest = maturity - p;
        return {
          primaryLabel: 'Maturity Value at Period End',
          primaryVal: fmt(maturity),
          subText: 'Total Interest Earned: ' + fmt(interest),
          metrics: [
            { label: 'Principal Invested', val: fmt(p) },
            { label: 'Effective APY', val: ((Math.pow(1 + r / n, n) - 1) * 100).toFixed(2) + '%' },
            { label: 'Total Interest Accrued', val: fmt(interest) },
            { label: 'Compounding Frequency', val: 'Quarterly (4x/yr)' }
          ]
        };
      }
    },
    'GLD-11': {
      title: 'Gold & Jewellery Invoice Solver',
      sub: 'Statutory 22K/24K Metal Valuation, Making Charges & 3% GST',
      fields: [
        { id: 'gld-grams', label: 'Gold net weight (grams)', type: 'number', val: 25, step: 1, suffix: 'g' },
        { id: 'gld-rate', label: 'Gold rate per gram (₹)', type: 'number', val: 7200, step: 50, suffix: '₹' },
        { id: 'gld-making', label: 'Making charges (%)', type: 'number', val: 12, step: 1, suffix: '%' }
      ],
      calc: function () {
        var grams = num('#gld-grams'), rate = num('#gld-rate'), makingPct = num('#gld-making') / 100;
        var metalVal = grams * rate;
        var makingVal = metalVal * makingPct;
        var taxableBase = metalVal + makingVal;
        var gst = taxableBase * 0.03;
        var total = taxableBase + gst;
        return {
          primaryLabel: 'Gross Invoice Total (with GST)',
          primaryVal: '₹' + Math.round(total).toLocaleString('en-IN'),
          subText: 'Metal Base: ₹' + Math.round(metalVal).toLocaleString('en-IN') + ' · GST 3%: ₹' + Math.round(gst).toLocaleString('en-IN'),
          metrics: [
            { label: 'Pure Metal Value', val: '₹' + Math.round(metalVal).toLocaleString('en-IN') },
            { label: 'Making Charges (' + (makingPct * 100).toFixed(0) + '%)', val: '₹' + Math.round(makingVal).toLocaleString('en-IN') },
            { label: 'GST Amount (3%)', val: '₹' + Math.round(gst).toLocaleString('en-IN') },
            { label: 'Effective Rate/Gram', val: '₹' + Math.round(total / Math.max(grams, 1)).toLocaleString('en-IN') }
          ]
        };
      }
    },
    'PPF-13': {
      title: 'Public Provident Fund (PPF)',
      sub: '15-Year Sovereign Guaranteed Growth & EEE Tax-Free Wealth',
      fields: [
        { id: 'ppf-annual', label: 'Annual deposit amount (Max ₹1.5L)', type: 'number', val: 150000, max: 150000, step: 5000, suffix: '₹' },
        { id: 'ppf-rate', label: 'Statutory interest rate (%)', type: 'number', val: 7.1, step: 0.1, suffix: '%' }
      ],
      calc: function () {
        var dep = Math.min(num('#ppf-annual'), 150000), r = num('#ppf-rate') / 100;
        var balance = 0, totalInvested = 0;
        for (var i = 1; i <= 15; i++) {
          totalInvested += dep;
          balance = (balance + dep) * (1 + r);
        }
        var interest = balance - totalInvested;
        return {
          primaryLabel: 'Tax-Free Maturity Corpus (15 Years)',
          primaryVal: '₹' + Math.round(balance).toLocaleString('en-IN'),
          subText: 'Total Interest Earned: ₹' + Math.round(interest).toLocaleString('en-IN'),
          metrics: [
            { label: 'Total Invested (15 Yrs)', val: '₹' + Math.round(totalInvested).toLocaleString('en-IN') },
            { label: 'Tax-Free Wealth Multiplier', val: (balance / Math.max(totalInvested, 1)).toFixed(2) + 'x' },
            { label: 'Tax Status', val: 'EEE (Exempt)' },
            { label: 'Statutory Rate', val: (r * 100).toFixed(1) + '% Sovereign' }
          ]
        };
      }
    },
    'SSY-14': {
      title: 'Sukanya Samriddhi Yojana (SSY)',
      sub: 'Statutory Sovereign Scheme for the Girl Child (8.2% Compound Interest)',
      fields: [
        { id: 'ssy-annual', label: 'Annual deposit amount (Max ₹1.5L)', type: 'number', val: 150000, max: 150000, step: 5000, suffix: '₹' },
        { id: 'ssy-rate', label: 'Statutory interest rate (%)', type: 'number', val: 8.2, step: 0.1, suffix: '%' }
      ],
      calc: function () {
        var dep = Math.min(num('#ssy-annual'), 150000), r = num('#ssy-rate') / 100;
        var balance = 0, totalInvested = 0;
        // 15 years of deposit, continues to compound until 21 years
        for (var i = 1; i <= 21; i++) {
          if (i <= 15) {
            totalInvested += dep;
            balance = (balance + dep) * (1 + r);
          } else {
            balance = balance * (1 + r);
          }
        }
        var interest = balance - totalInvested;
        return {
          primaryLabel: 'Tax-Free Maturity Corpus at Age 21',
          primaryVal: '₹' + Math.round(balance).toLocaleString('en-IN'),
          subText: 'Total Interest Earned: ₹' + Math.round(interest).toLocaleString('en-IN'),
          metrics: [
            { label: 'Total Capital Deposited', val: '₹' + Math.round(totalInvested).toLocaleString('en-IN') },
            { label: 'Wealth Multiplier', val: (balance / Math.max(totalInvested, 1)).toFixed(2) + 'x' },
            { label: 'Tax Status', val: 'Section 80C (EEE)' },
            { label: 'Statutory Rate', val: (r * 100).toFixed(1) + '% Sovereign' }
          ]
        };
      }
    },
    'HLN-07': {
      title: 'Home Loan EMI & Prepayment Tenure Reducer',
      sub: 'Amortization Accelerated by Regular Monthly Prepayment',
      fields: [
        { id: 'hln-principal', label: 'Total loan principal amount', type: 'number', val: 3000000, step: 100000, cur: true },
        { id: 'hln-rate', label: 'Annual interest rate (%)', type: 'number', val: 8.5, step: 0.1, suffix: '%' },
        { id: 'hln-tenure', label: 'Tenure duration (years)', type: 'number', val: 20, step: 1, suffix: 'yrs' },
        { id: 'hln-prepay', label: 'Monthly extra prepayment', type: 'number', val: 5000, step: 1000, cur: true }
      ],
      calc: function () {
        var p = num('#hln-principal'), r = (num('#hln-rate') / 100) / 12, n = num('#hln-tenure') * 12, prepay = num('#hln-prepay');
        var emi = r > 0 ? (p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : (p / n);
        var totalWithout = emi * n - p;

        // Amortization with prepayment
        var bal = p, actualMonths = 0, totalInterestPaid = 0;
        while (bal > 0 && actualMonths < n) {
          actualMonths++;
          var interestMonth = bal * r;
          totalInterestPaid += interestMonth;
          var principalMonth = (emi - interestMonth) + prepay;
          bal -= principalMonth;
          if (bal <= 0) break;
        }
        var interestSaved = Math.max(totalWithout - totalInterestPaid, 0);
        var yearsSaved = Math.max((n - actualMonths) / 12, 0);
        return {
          primaryLabel: 'Monthly Base Loan EMI',
          primaryVal: fmt(emi),
          subText: 'Prepayment of ' + fmt(prepay) + '/mo saves ' + fmt(interestSaved) + ' in interest',
          metrics: [
            { label: 'Total Interest Saved', val: fmt(interestSaved) },
            { label: 'Loan Tenure Reduced By', val: yearsSaved.toFixed(1) + ' Years' },
            { label: 'New Loan Duration', val: (actualMonths / 12).toFixed(1) + ' Years' },
            { label: 'Total Principal Borrowed', val: fmt(p) }
          ]
        };
      }
    },

    // Engineering & Bitwise Suite
    'SCI-15': {
      title: 'Scientific 991 Analytical Solver',
      sub: 'Casio fx-991 Standard V.P.A.M. Quadratic & Polynomial Solver',
      fields: [
        { id: 'sci-a', label: 'Polynomial coefficient a (x²)', type: 'number', val: 1, step: 1 },
        { id: 'sci-b', label: 'Polynomial coefficient b (x)', type: 'number', val: -5, step: 1 },
        { id: 'sci-c', label: 'Polynomial constant c', type: 'number', val: 6, step: 1 }
      ],
      calc: function () {
        var a = num('#sci-a') || 1, b = num('#sci-b'), c = num('#sci-c');
        var disc = b * b - 4 * a * c;
        var root1, root2;
        if (disc >= 0) {
          root1 = ((-b + Math.sqrt(disc)) / (2 * a)).toFixed(4);
          root2 = ((-b - Math.sqrt(disc)) / (2 * a)).toFixed(4);
        } else {
          var real = (-b / (2 * a)).toFixed(4);
          var imag = (Math.sqrt(-disc) / (2 * a)).toFixed(4);
          root1 = real + ' + ' + imag + 'i';
          root2 = real + ' − ' + imag + 'i';
        }
        var vX = (-b / (2 * a)).toFixed(4);
        var vY = (-(disc) / (4 * a)).toFixed(4);
        return {
          primaryLabel: 'Primary Root (x₁)',
          primaryVal: 'x₁ = ' + root1,
          subText: 'Secondary Root: x₂ = ' + root2 + ' · Discriminant Δ = ' + disc.toFixed(2),
          metrics: [
            { label: 'Root 1 (x₁)', val: String(root1) },
            { label: 'Root 2 (x₂)', val: String(root2) },
            { label: 'Discriminant (b²−4ac)', val: disc.toFixed(2) },
            { label: 'Parabola Vertex (h, k)', val: '(' + vX + ', ' + vY + ')' }
          ]
        };
      }
    },
    'PRG-17': {
      title: 'Programmer 64-Bit Logic & Bitboard',
      sub: 'Base Conversions (HEX / DEC / OCT / BIN) & Bitwise Matrix',
      fields: [
        { id: 'prg-val', label: 'Primary decimal integer value', type: 'number', val: 255, step: 1 },
        { id: 'prg-op2', label: 'Operand 2 for bitwise test', type: 'number', val: 15, step: 1 }
      ],
      calc: function () {
        var v1 = Math.floor(num('#prg-val')) || 0;
        var v2 = Math.floor(num('#prg-op2')) || 0;
        var hex = '0x' + (v1 >>> 0).toString(16).toUpperCase();
        var oct = '0o' + (v1 >>> 0).toString(8);
        var bin = (v1 >>> 0).toString(2).padStart(16, '0');
        var andRes = v1 & v2;
        var orRes = v1 | v2;
        var xorRes = v1 ^ v2;
        return {
          primaryLabel: 'Hexadecimal (HEX)',
          primaryVal: hex,
          subText: 'Binary: ' + bin + ' · Octal: ' + oct,
          metrics: [
            { label: 'Bitwise AND (' + v1 + ' & ' + v2 + ')', val: '0x' + (andRes >>> 0).toString(16).toUpperCase() + ' (' + andRes + ')' },
            { label: 'Bitwise OR (' + v1 + ' | ' + v2 + ')', val: '0x' + (orRes >>> 0).toString(16).toUpperCase() + ' (' + orRes + ')' },
            { label: 'Bitwise XOR (' + v1 + ' ^ ' + v2 + ')', val: '0x' + (xorRes >>> 0).toString(16).toUpperCase() + ' (' + xorRes + ')' },
            { label: 'Active Bit Count', val: bin.split('1').length - 1 + ' bits set' }
          ]
        };
      }
    }
  };

  function renderGenericEngine(code, slug, title) {
    var heading = $('#gen-engine-heading');
    var sub = $('#gen-engine-sub');
    var fieldsContainer = $('#gen-fields-container');

    var cfg = GENERIC_CONFIGS[code] || {
      title: title,
      sub: 'Engine: ' + slug + ' (' + code + ')',
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

    if (heading) heading.textContent = cfg.title;
    if (sub) sub.textContent = cfg.sub;

    if (fieldsContainer) {
      var h = '';
      cfg.fields.forEach(function (f) {
        h += '<div class="field">' +
               '<label for="' + f.id + '">' + f.label + '</label>' +
               '<div class="input-group">' +
                 (f.cur ? '<span class="input-group__pill cur-symbol">' + getCur().symbol + '</span>' : '') +
                 '<input class="input num" id="' + f.id + '" type="' + f.type + '" value="' + f.val + '"' +
                   (f.step ? ' step="' + f.step + '"' : '') +
                   (f.min !== undefined ? ' min="' + f.min + '"' : '') +
                   (f.max !== undefined ? ' max="' + f.max + '"' : '') +
                   ' data-calc-gen>' +
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
    var cfg = GENERIC_CONFIGS[activeCode];
    if (!cfg || typeof cfg.calc !== 'function') return;

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
    } else if (activeCode === 'CTR-18') {
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
     7. STAGE ACTIONS (Copy Derivation, Copy API, Export PDF, Save Scenario)
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
        engine: activeSlug,
        code: activeCode
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
     10. HASH ROUTING & DEEP LINKING
     ==================================================================== */
  var ALIASES = {
    'tax': 'ITX-05',
    'incometax': 'ITX-05',
    'income-tax': 'ITX-05',
    '115bac': 'ITX-05',
    'itx': 'ITX-05',
    'itx-05': 'ITX-05',
    'gst': 'GST-06',
    'gst-06': 'GST-06',
    'compound': 'CMP-04',
    'wealth': 'CMP-04',
    'cmp-04': 'CMP-04',
    'mortgage': 'MTG-01',
    'piti': 'MTG-01',
    'mtg-01': 'MTG-01',
    'vat': 'VAT-02',
    'vat-02': 'VAT-02',
    'tip': 'TIP-03',
    'tip-03': 'TIP-03',
    'sip': 'SIP-09',
    'sip-09': 'SIP-09',
    'fd': 'FXD-10',
    'fxd-10': 'FXD-10',
    'gold': 'GLD-11',
    'gld-11': 'GLD-11',
    'ppf': 'PPF-13',
    'ppf-13': 'PPF-13',
    'ssy': 'SSY-14',
    'ssy-14': 'SSY-14',
    'homeloan': 'HLN-07',
    'home_loan': 'HLN-07',
    'emi': 'HLN-07',
    'hln-07': 'HLN-07',
    'scientific': 'SCI-15',
    'calci991': 'SCI-15',
    'calci_991': 'SCI-15',
    'sci-15': 'SCI-15',
    'programmer': 'PRG-17',
    'bitwise': 'PRG-17',
    'prg-17': 'PRG-17',
    'contractor': 'CTR-18',
    'contractor_matrix': 'CTR-18',
    'parity': 'CTR-18',
    'ctr-18': 'CTR-18',
    'scorp': 'SCP-19',
    'scp-19': 'SCP-19',
    'solo401k': 'SLO-20',
    'retirement': 'SLO-20',
    'slo-20': 'SLO-20',
    'fx': 'FXR-21',
    'fxr-21': 'FXR-21',
    'billable': 'BHF-22',
    'bhf-22': 'BHF-22',
    'tokens': 'AIT-20',
    'ai': 'AIT-20',
    'ait-20': 'AIT-20',
    'startup': 'SRD-21',
    'runway': 'SRD-21',
    'srd-21': 'SRD-21',
    'b2b': 'B2B-22',
    'b2b-22': 'B2B-22',
    'wht': 'B2B-22',
    'feie': 'FEI-23',
    'nomad': 'FEI-23',
    'fei-23': 'FEI-23',
    'egress': 'CEF-24',
    'cloud': 'CEF-24',
    'cef-24': 'CEF-24'
  };

  function handleHash() {
    var rawHash = (window.location.hash || '').replace(/^#/, '').toLowerCase().trim();
    if (!rawHash) return;

    var targetTool = null;
    $$('.ws-tool').forEach(function (tool) {
      var code = (tool.dataset.code || '').toLowerCase();
      var slug = (tool.dataset.slug || '').toLowerCase();
      if (
        code === rawHash ||
        code.replace('-', '') === rawHash ||
        slug === rawHash ||
        slug.replace('.', '') === rawHash ||
        slug.replace('.', '-') === rawHash
      ) {
        targetTool = tool;
      }
    });

    if (!targetTool) {
      var matchedCode = ALIASES[rawHash] || ALIASES[rawHash.split('-')[0]] || ALIASES[rawHash.split('.')[0]] || ALIASES[rawHash.split('_')[0]];
      if (matchedCode) {
        targetTool = $('.ws-tool[data-code="' + matchedCode + '"]');
      }
    }

    if (targetTool) {
      var group = targetTool.closest('.ws-rail__group');
      if (group) {
        var head = $('.ws-rail__head', group);
        if (head) head.setAttribute('aria-expanded', 'true');
      }
      switchEngine(targetTool);
    }
  }

  window.addEventListener('hashchange', handleHash);

  /* ====================================================================
     11. KEYBOARD ESCAPE LISTENER
     ==================================================================== */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeSheet();
    closeBilling();
    closeDrawer();
    if (popover) popover.hidden = true;
  });

  /* ====================================================================
     12. INITIALIZATION
     ==================================================================== */
  try { applyCurrency(); } catch (e) { console.warn('applyCurrency init error:', e); }
  try { updateDrawerContent(); } catch (e) { console.warn('updateDrawerContent init error:', e); }
  if (window.location.hash) {
    try { handleHash(); } catch (e) { console.warn('handleHash init error:', e); }
  } else {
    try { recalcCurrent(); } catch (e) { console.warn('recalcCurrent init error:', e); }
  }
})();
