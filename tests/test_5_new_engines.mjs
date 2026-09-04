import assert from 'assert';
import { FinOpsEngine } from '../js/engines/finops-engines.js';

console.log('=== STARTING TEST SUITE: 5 NEW FINOPS COMPUTATIONAL ENGINES ===\n');

// 1. AI Token Arbitrage Engine Test
console.log('1. Testing AI Token Arbitrage Engine...');
const tokenResult = FinOpsEngine.calculateAiTokenArbitrage({
  promptTokens: 5000,
  completionTokens: 1000,
  cacheHitRatio: 0.80,
  isBatch: false
});

assert(tokenResult.matrix['claude-3-5-sonnet'], 'Claude 3.5 Sonnet must be present');
assert(tokenResult.matrix['gpt-4o'], 'GPT-4o must be present');
assert(tokenResult.matrix['deepseek-v3'], 'DeepSeek V3 must be present');
assert(tokenResult.matrix['deepseek-r1'], 'DeepSeek R1 must be present');
assert(tokenResult.matrix['gemini-1-5-flash'], 'Gemini 1.5 Flash must be present');

// Exact cost check: Claude 3.5 Sonnet (4000 cached @ 0.30/M + 1000 uncached @ 3.00/M + 1000 completion @ 15.00/M) / 1M = (1.20 + 3.00 + 15.00) / 1000000 = $0.0192
assert.strictEqual(tokenResult.matrix['claude-3-5-sonnet'].costPerCallUsd, 0.0192);
assert.strictEqual(tokenResult.matrix['claude-3-5-sonnet'].costPer1kCallsUsd, 19.2);

// Batch discount test (50% off)
const batchResult = FinOpsEngine.calculateAiTokenArbitrage({
  promptTokens: 5000,
  completionTokens: 1000,
  cacheHitRatio: 0.80,
  isBatch: true
});
assert.strictEqual(batchResult.matrix['claude-3-5-sonnet'].costPerCallUsd, 0.0096);
console.log('   ✅ AI Token Arbitrage passed determinism & batch discount tests.');

// 2. Startup Runway & Dilution Engine Test
console.log('2. Testing Startup Runway & Dilution Engine...');
const runwayResult = FinOpsEngine.calculateStartupRunwayDilution({
  cashOnHand: 750000,
  monthlyGrossBurn: 65000,
  monthlyRevenue: 15000,
  safeInvestment: 1000000,
  postMoneyCap: 10000000,
  seriesAInvestment: 3000000,
  seriesAPreMoney: 15000000,
  optionPoolExpansionPercent: 10.0
});

assert.strictEqual(runwayResult.runway.monthlyNetBurnUsd, 50000);
assert.strictEqual(runwayResult.runway.runwayMonths, 15.0);
assert.strictEqual(runwayResult.capTableDilution.safeOwnershipPercent, 10.0);
assert.strictEqual(runwayResult.capTableDilution.seriesAOwnershipPercent, 16.67);
assert.strictEqual(runwayResult.capTableDilution.founderRetainedPercent, 67.5);
console.log('   ✅ Startup Runway & Option Pool Shuffle passed mathematical checks.');

// 3. Global B2B Withholding & PE Risk Engine Test
console.log('3. Testing B2B Withholding & PE Risk Engine...');
const whtResult = FinOpsEngine.calculateB2bWithholdingRisk({
  invoiceNetRequired: 50000,
  statutoryRatePercent: 30.0,
  treatyRatePercent: 15.0,
  daysInCountry: 195
});

assert.strictEqual(whtResult.grossInvoicing.grossWithoutTreatyUsd, 71429);
assert.strictEqual(whtResult.grossInvoicing.grossWithTreatyUsd, 58824);
assert.strictEqual(whtResult.grossInvoicing.instantTreatySavingsUsd, 12605);
assert.strictEqual(whtResult.permanentEstablishment.status, 'CRITICAL_PE_RISK');

const whtCompliant = FinOpsEngine.calculateB2bWithholdingRisk({
  invoiceNetRequired: 50000,
  daysInCountry: 120
});
assert.strictEqual(whtCompliant.permanentEstablishment.status, 'COMPLIANT_NO_PE_TRIGGER');
console.log('   ✅ B2B Withholding Gross-up & 183-day PE trigger passed.');

// 4. IRS Form 2555 FEIE Nomad Tracker Test
console.log('4. Testing FEIE Nomad Tracker Engine...');
const feieResult = FinOpsEngine.calculateFeieNomadTracker({
  foreignEarnedIncome: 160000,
  daysOutsideUSInRollingPeriod: 334,
  taxYear: 2025,
  stateDomicile: 'CA',
  effectiveTaxBracketPercent: 24.0
});

assert.strictEqual(feieResult.physicalPresenceTest.qualifies, true);
assert.strictEqual(feieResult.federalExclusion.excludedAmountUsd, 130000);
assert.strictEqual(feieResult.federalExclusion.taxableRemainderUsd, 30000);
assert.strictEqual(feieResult.federalExclusion.estimatedFederalTaxSavingsUsd, 31200);
assert.strictEqual(feieResult.stateAuditRisk.isStickyDomicile, true);
assert.strictEqual(feieResult.stateAuditRisk.riskLevel, 'HIGH_STICKY_DOMICILE_AUDIT_RISK');
console.log('   ✅ FEIE Physical Presence & Sticky Domicile audit risk passed.');

// 5. Cloud Egress FinOps Engine Test
console.log('5. Testing Cloud Egress FinOps Engine...');
const egressResult = FinOpsEngine.calculateCloudEgressFinOps({
  monthlyEgressGB: 50000,
  cacheHitRatio: 0.85
});

assert.strictEqual(egressResult.economics.directCloudProviderCostUsd, 4300);
assert.strictEqual(egressResult.economics.cloudflareEdgeProxyCostUsd, 680);
assert.strictEqual(egressResult.economics.monthlySavingsUsd, 3620);
assert.strictEqual(egressResult.economics.savingsPercentage, '84%');
console.log('   ✅ Cloud Egress & Interconnect cost optimization passed (84% savings verified).');

console.log('\n🎉 ALL 5 NEW FINOPS ENGINES PASSED 100% OF TESTS!');
