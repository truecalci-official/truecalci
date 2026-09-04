/**
 * Adversarial & Stress Test Runner for TrueCalci Computational Engine & MCP Server
 * Strict Critic Protocol: Tests boundary conditions, extreme financial numbers,
 * zero-division protection, malformed JSON, and rapid JSON-RPC pipelining.
 */

import { spawn } from 'child_process';
import { GlobalFinanceEngine } from './js/engines/global-finance.js';
import { IndianFinanceEngine } from './js/engines/indian-finance.js';
import { EngineeringPhysicsEngine } from './js/engines/engineering-physics.js';
import { StatisticsOptionsEngine } from './js/engines/statistics-options.js';

console.log("================================================================================");
console.log("RUNNING STRICT ADVERSARIAL STRESS TESTS FOR TRUECALCI (CRITIC PROTOCOL)");
console.log("================================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`✅ PASS: ${testName} ${details ? '(' + details + ')' : ''}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
    failed++;
  }
}

// -----------------------------------------------------------------------------
// 1. Extreme Financial Boundary Tests
// -----------------------------------------------------------------------------
console.log("[1] Testing Financial Edge Cases & Boundaries...");

// 1.1 Zero Down Payment (100% Loan to Value - LTV)
const zeroDownMg = GlobalFinanceEngine.calculateMortgagePITI({
  homePrice: 500000,
  downPaymentPercent: 0,
  interestRate: 6.5,
  tenureYears: 30
});
assert(zeroDownMg.principal === 500000, "100% LTV principal equals home price");
assert(zeroDownMg.isPmiRequired === true, "PMI strictly required for 0% down");
assert(zeroDownMg.monthlyPI > 3100 && zeroDownMg.monthlyPI < 3200, "Monthly PI computed correctly on full price", `$${zeroDownMg.monthlyPI}`);

// 1.2 Jumbo Loan: $50 Million Commercial/Residential Mortgage
const jumboMg = GlobalFinanceEngine.calculateMortgagePITI({
  homePrice: 50000000,
  downPaymentPercent: 25,
  interestRate: 7.25,
  tenureYears: 30
});
assert(jumboMg.principal === 37500000, "$50M purchase yields $37.5M principal");
assert(!isNaN(jumboMg.monthlyTotalPITI) && isFinite(jumboMg.monthlyTotalPITI), "Jumbo PITI calculation remains stable and finite", `$${jumboMg.monthlyTotalPITI}/mo`);

// 1.3 High Net Worth Indian Tax: ₹5 Crore (₹50 Million) CTC
const hniTax = IndianFinanceEngine.calculateIncomeTax({
  grossIncome: 50000000,
  isSalaried: true
});
assert(hniTax.newRegime.taxableIncome === 49925000, "₹5 Cr CTC has ₹75k standard deduction applied");
assert(hniTax.newRegime.surchargeAmount > 0, "High Net Worth Surcharge is computed above threshold", `Surcharge: ₹${hniTax.newRegime.surchargeAmount}`);

// 1.4 Zero Tax Rebate Boundary: ₹12,75,000 Salaried
const rebateBoundary = IndianFinanceEngine.calculateIncomeTax({
  grossIncome: 1275000,
  isSalaried: true
});
assert(rebateBoundary.newRegime.taxableIncome === 1200000, "₹12.75L CTC minus ₹75k deduction is exactly ₹12.0L taxable");
assert(rebateBoundary.newRegime.totalTax === 0, "Exact ₹12.0L taxable income yields ZERO tax under Budget 2025-26 87A rebate");

// -----------------------------------------------------------------------------
// 2. Physics & Engineering Extreme Inputs
// -----------------------------------------------------------------------------
console.log("\n[2] Testing Physics & Engineering Boundaries...");

// 2.1 Projectile at 90 degrees (Straight Up)
const verticalProj = EngineeringPhysicsEngine.calculateProjectileMotion({
  initialVelocityMs: 100,
  launchAngleDegrees: 90
});
assert(verticalProj.horizontalRangeMeters === 0, "90-degree projectile has ZERO horizontal range", `Range: ${verticalProj.horizontalRangeMeters}m`);
assert(verticalProj.maxHeightMeters > 500, "100 m/s vertical launch reaches ~509m", `Height: ${verticalProj.maxHeightMeters}m`);

// 2.2 Projectile at 0 degrees (Horizontal Ground Shot)
const flatProj = EngineeringPhysicsEngine.calculateProjectileMotion({
  initialVelocityMs: 100,
  launchAngleDegrees: 0
});
assert(flatProj.horizontalRangeMeters === 0, "0-degree flat ground launch has 0 flight time and 0 range");

// 2.3 Massive Structural Beam: 100kN on 12m steel bridge girder
const heavyBeam = EngineeringPhysicsEngine.calculateBeamBending({
  loadNewtons: 100000,
  lengthMeters: 12,
  elasticModulusGpa: 210,
  momentOfInertiaCm4: 45000,
  distanceFromNeutralAxisMm: 250
});
assert(heavyBeam.maxBendingMomentNm === 300000, "Max moment is (P·L)/4 = 300,000 Nm");
assert(!isNaN(heavyBeam.maxDeflectionMm) && isFinite(heavyBeam.maxDeflectionMm), "Heavy beam deflection is finite and valid", `${heavyBeam.maxDeflectionMm} mm`);

// -----------------------------------------------------------------------------
// 3. Quantitative Finance & Options Stress Tests
// -----------------------------------------------------------------------------
console.log("\n[3] Testing Black-Scholes Extreme Volatility & Expiry...");

// 3.1 Extreme Implied Volatility: 200% Volatility (Meme Stock / Crypto)
const highVolOpt = StatisticsOptionsEngine.calculateBlackScholes({
  stockPrice: 50,
  strikePrice: 50,
  timeToExpiryYears: 0.25, // 3 months
  riskFreeRatePercent: 5,
  volatilityPercent: 200
});
assert(highVolOpt.callPrice > 15, "200% vol option commands high premium", `$${highVolOpt.callPrice}`);
assert(highVolOpt.greeks.deltaCall > 0.5 && highVolOpt.greeks.deltaCall < 0.9, "Delta is in valid [0, 1] bounds", `Delta: ${highVolOpt.greeks.deltaCall}`);

// 3.2 Deep In-The-Money Call (S = 500, K = 100)
const deepItm = StatisticsOptionsEngine.calculateBlackScholes({
  stockPrice: 500,
  strikePrice: 100,
  timeToExpiryYears: 1,
  riskFreeRatePercent: 5,
  volatilityPercent: 20
});
assert(deepItm.callPrice >= 400, "Deep ITM call price is at least intrinsic value ($400+)", `$${deepItm.callPrice}`);
assert(deepItm.greeks.deltaCall >= 0.99, "Deep ITM call delta approaches 1.0", `Delta: ${deepItm.greeks.deltaCall}`);

// -----------------------------------------------------------------------------
// 4. Live MCP JSON-RPC Stdio Protocol Stress Tests
// -----------------------------------------------------------------------------
console.log("\n[4] Testing MCP Server JSON-RPC Protocol (Malformed, Edge Calls & Rapid Fire)...");

const mcpProc = spawn('node', ['mcp-server.mjs']);
let mcpOutputBuffer = '';

mcpProc.stdout.on('data', (chunk) => {
  mcpOutputBuffer += chunk.toString();
});

function sendRpc(msgObj) {
  mcpProc.stdin.write(JSON.stringify(msgObj) + '\n');
}

// 4.1 Malformed JSON handling
mcpProc.stdin.write("{broken_malformed_json_without_closing\n");

// 4.2 Unknown Method handling
sendRpc({ jsonrpc: "2.0", id: 101, method: "non_existent_method", params: {} });

// 4.3 Unknown Tool name handling
sendRpc({ jsonrpc: "2.0", id: 102, method: "tools/call", params: { name: "invalid_mystery_tool", arguments: {} } });

// 4.4 Rapid Fire Valid Calls
sendRpc({ jsonrpc: "2.0", id: 103, method: "tools/call", params: { name: "truecalci_vat_sales_tax", arguments: { amount: 2500, vatRatePercent: 19, mode: "remove" } } });
sendRpc({ jsonrpc: "2.0", id: 104, method: "tools/call", params: { name: "truecalci_black_scholes", arguments: { stockPrice: 150, strikePrice: 150, timeToExpiryYears: 0.5, riskFreeRatePercent: 4.5, volatilityPercent: 30 } } });
sendRpc({ jsonrpc: "2.0", id: 105, method: "tools/call", params: { name: "truecalci_scorp_optimizer", arguments: { netProfit: 160000, salaryPercent: 50 } } });
sendRpc({ jsonrpc: "2.0", id: 106, method: "tools/call", params: { name: "truecalci_solo_401k_shield", arguments: { netEarnings: 100000 } } });
sendRpc({ jsonrpc: "2.0", id: 107, method: "tools/call", params: { name: "truecalci_fx_invoicing", arguments: { invoiceUsd: 15000, targetCurrency: "EUR" } } });
sendRpc({ jsonrpc: "2.0", id: 108, method: "tools/call", params: { name: "truecalci_billable_floor", arguments: { targetNetCash: 120000, vacationWeeks: 4 } } });

setTimeout(() => {
  mcpProc.kill();
  const lines = mcpOutputBuffer.split('\n').filter(l => l.trim().length > 0);
  
  // Verify error responses
  const parseErr = lines.find(l => l.includes('-32700'));
  assert(parseErr !== undefined, "MCP handles malformed raw string with JSON-RPC -32700 Parse Error");

  const methodErr = lines.find(l => l.includes('-32601'));
  assert(methodErr !== undefined, "MCP handles unknown method with JSON-RPC -32601 Method Not Found");

  const toolErr = lines.find(l => l.includes('Unknown tool: invalid_mystery_tool'));
  assert(toolErr !== undefined, "MCP handles invalid tool name with clear error response");

  const vatSuccess = lines.find(l => l.includes('"id":103') && l.includes('2100.84'));
  assert(vatSuccess !== undefined, "Rapid-fire call 103 (VAT 19% remove from 2500) computed net 2100.84");

  const bsSuccess = lines.find(l => l.includes('"id":104') && l.includes('callPrice'));
  assert(bsSuccess !== undefined, "Rapid-fire call 104 (Black-Scholes 150 strike) computed successfully");

  const scorpSuccess = lines.find(l => l.includes('"id":105') && l.includes('grossFicaSavings'));
  assert(scorpSuccess !== undefined, "Rapid-fire call 105 (SCorp optimizer) computed successfully");

  const retSuccess = lines.find(l => l.includes('"id":106') && l.includes('solo401k'));
  assert(retSuccess !== undefined, "Rapid-fire call 106 (Solo 401k shield) computed successfully");

  const fxSuccess = lines.find(l => l.includes('"id":107') && l.includes('optimalRail'));
  assert(fxSuccess !== undefined, "Rapid-fire call 107 (FX invoicing) computed successfully");

  const billableSuccess = lines.find(l => l.includes('"id":108') && l.includes('optimalHourlyRate'));
  assert(billableSuccess !== undefined, "Rapid-fire call 108 (Billable floor) computed successfully");

  console.log("\n================================================================================");
  console.log(`STRESS VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED.`);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}, 2000);
