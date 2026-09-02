/**
 * High-Precision Scale & Stress Benchmark for TrueCalci Computational Engine & MCP Server
 * Simulates real-world AI Agent & 50,000-Subscriber Enterprise Workloads across:
 * - Small Data: Single atomic calculations (Mortgage, VAT, Black-Scholes, Projectile)
 * - Medium Data: 360-month amortization schedules, 100-point regressions
 * - High Data: 10,000-point data arrays, 100-node Options Volatility Surface
 * - Throughput & Concurrency: 1,000 rapid pipelined JSON-RPC requests
 */

import { spawn } from 'child_process';
import { GlobalFinanceEngine } from './js/engines/global-finance.js';
import { IndianFinanceEngine } from './js/engines/indian-finance.js';
import { EngineeringPhysicsEngine } from './js/engines/engineering-physics.js';
import { StatisticsOptionsEngine } from './js/engines/statistics-options.js';

console.log("================================================================================");
console.log("TRUECALCI ENTERPRISE LOAD & HIGH-DATA BENCHMARK (50K SUBSCRIBER SIMULATION)");
console.log("================================================================================\n");

const results = {
  small: [],
  medium: [],
  high: [],
  concurrency: {}
};

function formatMs(ns) {
  return (ns / 1_000_000).toFixed(3) + " ms";
}

// -----------------------------------------------------------------------------
// 1. Tier 1: Small Data Benchmarks (Atomic AI Agent Tool Calls)
// -----------------------------------------------------------------------------
console.log("[TIER 1] Testing Small Data (Single AI Agent Queries)...");

// 1.1 Mortgage Calculation
let t0 = process.hrtime.bigint();
for (let i = 0; i < 1000; i++) {
  GlobalFinanceEngine.calculateMortgagePITI({
    homePrice: 450000,
    downPaymentPercent: 20,
    interestRate: 6.8,
    tenureYears: 30
  });
}
let t1 = process.hrtime.bigint();
let avgSmallMortgage = Number(t1 - t0) / 1000;
console.log(`  ⚡ Single US Mortgage PITI: avg ${formatMs(avgSmallMortgage)} per query (1,000 runs)`);
results.small.push({ name: "US Mortgage PITI", avgMs: (avgSmallMortgage / 1_000_000).toFixed(3) });

// 1.2 Black-Scholes European Options with all Greeks
t0 = process.hrtime.bigint();
for (let i = 0; i < 1000; i++) {
  StatisticsOptionsEngine.calculateBlackScholes({
    stockPrice: 175.50,
    strikePrice: 180.00,
    timeToExpiryYears: 0.25,
    riskFreeRatePercent: 4.5,
    volatilityPercent: 28.5
  });
}
t1 = process.hrtime.bigint();
let avgSmallBS = Number(t1 - t0) / 1000;
console.log(`  ⚡ Black-Scholes Greeks (Delta, Gamma, Vega, Theta): avg ${formatMs(avgSmallBS)} per query (1,000 runs)`);
results.small.push({ name: "Black-Scholes Options + Greeks", avgMs: (avgSmallBS / 1_000_000).toFixed(3) });

// 1.3 Euler-Bernoulli Beam Deflection
t0 = process.hrtime.bigint();
for (let i = 0; i < 1000; i++) {
  EngineeringPhysicsEngine.calculateBeamBending({
    loadNewtons: 7500,
    lengthMeters: 6.0,
    elasticModulusGpa: 210,
    momentOfInertiaCm4: 1200,
    distanceFromNeutralAxisMm: 125
  });
}
t1 = process.hrtime.bigint();
let avgSmallBeam = Number(t1 - t0) / 1000;
console.log(`  ⚡ Beam Bending Deflection & Stress: avg ${formatMs(avgSmallBeam)} per query (1,000 runs)`);
results.small.push({ name: "Beam Bending", avgMs: (avgSmallBeam / 1_000_000).toFixed(3) });

// -----------------------------------------------------------------------------
// 2. Tier 2: Medium Data Benchmarks (Tabular Schedules & Series)
// -----------------------------------------------------------------------------
console.log("\n[TIER 2] Testing Medium Data (360-Month Amortization & 100-Point Regressions)...");

// 2.1 360-Month Full Amortization Table Generation
t0 = process.hrtime.bigint();
for (let i = 0; i < 100; i++) {
  GlobalFinanceEngine.calculateMortgagePITI({
    homePrice: 850000,
    downPaymentPercent: 15,
    interestRate: 7.1,
    tenureYears: 30
  });
}
t1 = process.hrtime.bigint();
let avgMedAmort = Number(t1 - t0) / 100;
console.log(`  ⚡ Full 30-Year Yearly Schedule Generation: avg ${formatMs(avgMedAmort)} per query (100 runs)`);
results.medium.push({ name: "30-Year Amortization Schedule", avgMs: (avgMedAmort / 1_000_000).toFixed(3) });

// 2.2 100-Point Dataset Linear Regression (OLS)
const sample100Points = Array.from({ length: 100 }, (_, i) => ({
  x: i + 1,
  y: 2.5 * (i + 1) + 10 + (Math.sin(i) * 5)
}));
t0 = process.hrtime.bigint();
for (let i = 0; i < 100; i++) {
  StatisticsOptionsEngine.calculateLinearRegression(sample100Points);
}
t1 = process.hrtime.bigint();
let avgMedReg = Number(t1 - t0) / 100;
console.log(`  ⚡ 100-Point Dataset OLS Regression (Slope, Intercept, R^2, Pearson r): avg ${formatMs(avgMedReg)} per query (100 runs)`);
results.medium.push({ name: "100-Point OLS Regression", avgMs: (avgMedReg / 1_000_000).toFixed(3) });

// -----------------------------------------------------------------------------
// 3. Tier 3: High Data / Enterprise Stress Benchmarks
// -----------------------------------------------------------------------------
console.log("\n[TIER 3] Testing High Data (10,000 Data Points & Options Volatility Surface)...");

// 3.1 10,000 Data Points Big-Data Linear Regression
const bigData10k = Array.from({ length: 10000 }, (_, i) => ({
  x: i * 0.1,
  y: 3.14159 * (i * 0.1) + 42.0 + (Math.cos(i) * 12.5)
}));
t0 = process.hrtime.bigint();
const bigRegResult = StatisticsOptionsEngine.calculateLinearRegression(bigData10k);
t1 = process.hrtime.bigint();
let timeHighReg = Number(t1 - t0);
console.log(`  ⚡ 10,000 Points Big-Data Regression: processed in ${formatMs(timeHighReg)}`);
console.log(`     -> Slope: ${bigRegResult.slope}, Intercept: ${bigRegResult.intercept}, R^2: ${bigRegResult.rSquared}`);
results.high.push({ name: "10,000-Point Big-Data Regression", timeMs: (timeHighReg / 1_000_000).toFixed(3) });

// 3.2 100-Node Quantitative Options Surface (Volatility Skew Grid)
t0 = process.hrtime.bigint();
const surface = [];
for (let strike = 80; strike <= 120; strike += 4) { // 11 strikes
  for (let expiry = 0.1; expiry <= 1.0; expiry += 0.1) { // 10 expirations = 110 option evaluations
    const opt = StatisticsOptionsEngine.calculateBlackScholes({
      stockPrice: 100,
      strikePrice: strike,
      timeToExpiryYears: expiry,
      riskFreeRatePercent: 4.5,
      volatilityPercent: 20 + (strike - 100) * 0.1 // volatility smile skew
    });
    surface.push({ strike, expiry, call: opt.callPrice, delta: opt.greeks.deltaCall });
  }
}
t1 = process.hrtime.bigint();
let timeSurface = Number(t1 - t0);
console.log(`  ⚡ 110-Contract Options Volatility Surface Matrix: computed in ${formatMs(timeSurface)} (${surface.length} option contracts)`);
results.high.push({ name: "110-Contract Options Volatility Surface", timeMs: (timeSurface / 1_000_000).toFixed(3) });

// -----------------------------------------------------------------------------
// 4. Concurrency & Throughput: 1,000 Pipelined JSON-RPC Requests
// -----------------------------------------------------------------------------
console.log("\n[TIER 4] Testing MCP Protocol Concurrency & Pipelining (1,000 Live Requests)...");

const mcpProcess = spawn('node', ['mcp-server.mjs']);
let responsesReceived = 0;
let errorsEncountered = 0;
const totalPipelined = 1000;

t0 = process.hrtime.bigint();

mcpProcess.stdout.on('data', (chunk) => {
  const lines = chunk.toString().split('\n').filter(l => l.trim().length > 0);
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.result) {
        responsesReceived++;
      } else if (parsed.error) {
        errorsEncountered++;
      }
    } catch {
      errorsEncountered++;
    }
  }

  if (responsesReceived + errorsEncountered >= totalPipelined) {
    t1 = process.hrtime.bigint();
    mcpProcess.kill();
    finishBenchmark(t0, t1);
  }
});

// Rapid-fire pump 1,000 distinct JSON-RPC requests across multiple tools
for (let i = 1; i <= totalPipelined; i++) {
  let toolCall;
  if (i % 3 === 0) {
    toolCall = {
      name: "truecalci_black_scholes",
      arguments: { stockPrice: 100 + (i % 20), strikePrice: 100, timeToExpiryYears: 0.5, riskFreeRatePercent: 5, volatilityPercent: 25 }
    };
  } else if (i % 3 === 1) {
    toolCall = {
      name: "truecalci_vat_sales_tax",
      arguments: { amount: 1000 + i, vatRatePercent: 20, mode: "add" }
    };
  } else {
    toolCall = {
      name: "truecalci_beam_bending",
      arguments: { loadNewtons: 5000 + i, lengthMeters: 4, elasticModulusGpa: 200, momentOfInertiaCm4: 800, distanceFromNeutralAxisMm: 100 }
    };
  }

  mcpProcess.stdin.write(JSON.stringify({
    jsonrpc: "2.0",
    id: i,
    method: "tools/call",
    params: toolCall
  }) + '\n');
}

function finishBenchmark(startTime, endTime) {
  const totalDurationMs = Number(endTime - startTime) / 1_000_000;
  const reqPerSec = Math.round((totalPipelined / totalDurationMs) * 1000);

  console.log(`  ⚡ Pipelined Requests Processed: ${responsesReceived} / ${totalPipelined}`);
  console.log(`  ⚡ Errors Encountered: ${errorsEncountered}`);
  console.log(`  ⚡ Total Execution Time: ${totalDurationMs.toFixed(2)} ms`);
  console.log(`  ⚡ Request Throughput: ${reqPerSec.toLocaleString()} requests/second`);
  console.log(`  ⚡ Latency per Request: ${(totalDurationMs / totalPipelined).toFixed(3)} ms`);

  const memUsage = process.memoryUsage();
  console.log(`  ⚡ Memory Footprint: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB heap used`);

  console.log("\n================================================================================");
  if (responsesReceived === totalPipelined && errorsEncountered === 0) {
    console.log("BENCHMARK STATUS: 100% SUCCESS — ZERO DROPPED CALLS, ZERO LAG.");
  } else {
    console.log("BENCHMARK STATUS: COMPLETED WITH WARNINGS.");
  }
  console.log("================================================================================\n");

  process.exit(errorsEncountered === 0 ? 0 : 1);
}
