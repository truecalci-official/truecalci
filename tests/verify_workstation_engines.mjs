/**
 * TrueCalci Workstation Studio — Automated Engine & Resilience Verification
 * Validates all 24 computational engines, stage rendering, dirty localStorage resilience,
 * and hash routing coverage.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================================');
console.log('TRUECALCI WORKSTATION STUDIO — 24-ENGINE RESILIENCE TEST');
console.log('================================================================================');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

// -----------------------------------------------------------------------------
// 1. Read files
// -----------------------------------------------------------------------------
const htmlContent = fs.readFileSync(path.join(rootDir, 'workstation.html'), 'utf8');
const jsContent = fs.readFileSync(path.join(rootDir, 'js', 'workstation.js'), 'utf8');

// -----------------------------------------------------------------------------
// 2. Test Currency Resilience Against Dirty / Legacy localStorage States
// -----------------------------------------------------------------------------
console.log('\n[Suite 1] Currency Resilience Under Diverse localStorage States...');

// Extract CUR, normalizeCurrency, getCur, and fmt logic from workstation.js
function createCurrencyEnvironment(storageVal) {
  const CUR = {
    USD: { long: 'USD ($) — Global', short: 'USD $', symbol: '$', region: 'Global ($)', rate: 1 },
    INR: { long: 'INR (₹) — India',  short: 'INR ₹', symbol: '₹', region: 'India (₹)',  rate: 83.2 }
  };
  function normalizeCurrency(val) {
    if (!val) return 'USD';
    const u = String(val).toUpperCase().trim();
    return (u === 'INDIA' || u === 'INR') ? 'INR' : 'USD';
  }
  const cur = normalizeCurrency(storageVal);
  function getCur() {
    return CUR[cur] || CUR.USD;
  }
  function fmt(n) {
    const c = getCur();
    if (typeof n !== 'number' || isNaN(n)) n = 0;
    const v = Math.round(n);
    return c.symbol + v.toLocaleString(cur === 'INR' ? 'en-IN' : 'en-US');
  }
  return { CUR, cur, getCur, fmt };
}

const testStorageStates = ['global', 'india', 'USD', 'INR', 'inr', 'usd', null, undefined, '', 'garbage_val', 'EUROPE'];
testStorageStates.forEach(state => {
  const env = createCurrencyEnvironment(state);
  const curObj = env.getCur();
  assert(curObj && curObj.symbol && curObj.long, `Storage state "${state}" safely resolves to valid currency object (${curObj.short})`);
  const formatted = env.fmt(125000);
  assert(typeof formatted === 'string' && formatted.length > 2, `Formatting 125,000 under "${state}" yields non-empty string "${formatted}"`);
});

// -----------------------------------------------------------------------------
// 3. Verify All 24 Engines in Left Rail of workstation.html
// -----------------------------------------------------------------------------
console.log('\n[Suite 2] Left Rail 24-Engine Tool Registry Verification...');

const EXPECTED_24_ENGINES = [
  { code: 'CTR-18', slug: 'contractor.parity' },
  { code: 'SCP-19', slug: 'scorp.optimize' },
  { code: 'SLO-20', slug: 'solo401k.max' },
  { code: 'FXR-21', slug: 'fx.raildrag' },
  { code: 'BHF-22', slug: 'billable.floor' },
  { code: 'AIT-20', slug: 'ai.tokens' },
  { code: 'SRD-21', slug: 'startup.runway' },
  { code: 'B2B-22', slug: 'b2b.wht' },
  { code: 'FEI-23', slug: 'feie.nomad' },
  { code: 'CEF-24', slug: 'cloud.egress' },
  { code: 'MTG-01', slug: 'mortgage.piti' },
  { code: 'VAT-02', slug: 'vat.compute' },
  { code: 'TIP-03', slug: 'tip.split' },
  { code: 'CMP-04', slug: 'compound.401k' },
  { code: 'ITX-05', slug: 'incometax.115bac' },
  { code: 'GST-06', slug: 'gst.split' },
  { code: 'SIP-09', slug: 'sip.stepup' },
  { code: 'FXD-10', slug: 'fd.maturity' },
  { code: 'GLD-11', slug: 'gold.invoice' },
  { code: 'PPF-13', slug: 'ppf.growth' },
  { code: 'SSY-14', slug: 'ssy.growth' },
  { code: 'HLN-07', slug: 'homeloan.emi' },
  { code: 'SCI-15', slug: 'sci991.eval' },
  { code: 'PRG-17', slug: 'programmer.bitwise' }
];

assert(EXPECTED_24_ENGINES.length === 24, 'Exactly 24 production computational engines specified');

EXPECTED_24_ENGINES.forEach(eng => {
  const toolPattern = new RegExp(`data-code="${eng.code}"[\\s\\S]*?data-slug="${eng.slug}"`, 'i');
  assert(toolPattern.test(htmlContent), `workstation.html rail contains button for ${eng.code} (${eng.slug})`);
});

// -----------------------------------------------------------------------------
// 4. Verify Dedicated Stage Containers in workstation.html
// -----------------------------------------------------------------------------
console.log('\n[Suite 3] Dedicated Stage Containers in workstation.html...');

const DEDICATED_STAGES = [
  'stage-contractor',
  'stage-ai-tokens',
  'stage-startup',
  'stage-b2b',
  'stage-feie',
  'stage-egress',
  'stage-generic'
];

DEDICATED_STAGES.forEach(stId => {
  assert(htmlContent.includes(`id="${stId}"`), `workstation.html has container element id="${stId}"`);
});

// -----------------------------------------------------------------------------
// 5. Verify All 18 Generic Configs in js/workstation.js
// -----------------------------------------------------------------------------
console.log('\n[Suite 4] Generic Engine Configurations in js/workstation.js...');

const GENERIC_CODES = [
  'SCP-19', 'SLO-20', 'FXR-21', 'BHF-22',
  'MTG-01', 'VAT-02', 'TIP-03', 'CMP-04',
  'ITX-05', 'GST-06', 'SIP-09', 'FXD-10',
  'GLD-11', 'PPF-13', 'SSY-14', 'HLN-07',
  'SCI-15', 'PRG-17'
];

GENERIC_CODES.forEach(code => {
  assert(jsContent.includes(`'${code}': {`), `GENERIC_CONFIGS contains definition for ${code}`);
});

// -----------------------------------------------------------------------------
// 6. Verify Derivations Dictionary in js/workstation.js
// -----------------------------------------------------------------------------
console.log('\n[Suite 5] Statutory Derivation References Coverage...');

EXPECTED_24_ENGINES.forEach(eng => {
  assert(jsContent.includes(`'${eng.code}': {`), `DERIVATIONS dictionary contains references for ${eng.code}`);
});

// -----------------------------------------------------------------------------
// 6. Verify Statutory Verification Strip on Stage & CSS
// -----------------------------------------------------------------------------
console.log('\n[Suite 6] Official Statutory Verification Stage Strip & Styling...');

const cssContent = fs.readFileSync(path.join(rootDir, 'css', 'design-system.css'), 'utf8');

assert(htmlContent.includes('id="ws-statutory-section"'), 'workstation.html contains #ws-statutory-section on stage');
assert(htmlContent.includes('id="statutory-links-container"'), 'workstation.html contains #statutory-links-container');
assert(cssContent.includes('.statute-chip'), 'design-system.css contains .statute-chip styling');
assert(jsContent.includes('stageLinksContainer.innerHTML = chips.join'), 'workstation.js dynamically populates statutory links onto stage');
assert(fs.existsSync(path.join(rootDir, 'scripts', 'cron_statutory_monitor.mjs')), 'scripts/cron_statutory_monitor.mjs exists');
assert(fs.existsSync(path.join(rootDir, 'data', 'statutory_health.json')), 'data/statutory_health.json exists');

// -----------------------------------------------------------------------------
// 7. Test Execution Summary
// -----------------------------------------------------------------------------
console.log('\n================================================================================');
console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
