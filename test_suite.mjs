/**
 * Comprehensive Automated Verification Test Suite for OmniCalc Suite
 */

import { IndianFinanceEngine } from "./js/engines/indian-finance.js";
import { CasioCalciEngine } from "./js/engines/casio-engine.js";
import { BasicCalculatorEngine } from "./js/engines/basic-engine.js";
import { ProgrammerEngine, UnitConverterEngine } from "./js/engines/programmer-engine.js";
import { EngineeringPhysicsEngine } from "./js/engines/engineering-physics.js";
import { StatisticsOptionsEngine } from "./js/engines/statistics-options.js";
import { CALCULATOR_DEFINITIONS } from "./js/data/definitions.js";

console.log("================================================================================");
console.log("RUNNING AUTOMATED VERIFICATION FOR OMNICALC INDIA SUITE");
console.log("================================================================================");

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    testsFailed++;
  }
}

// -----------------------------------------------------------------------------
// 1. Indian Personal Finance & Household Engine Tests
// -----------------------------------------------------------------------------
console.log("\n[1] Testing IndianFinanceEngine...");

// 1.1 Income Tax Budget 2025-26: ₹12.5 Lakh Salaried should be ZERO tax
const tax12_5L = IndianFinanceEngine.calculateIncomeTax({ grossIncome: 1250000, isSalaried: true });
assert(tax12_5L.newRegime.standardDeduction === 75000, "New Regime standard deduction is ₹75,000");
assert(tax12_5L.newRegime.taxableIncome === 1175000, "Taxable income is ₹11,75,000");
assert(tax12_5L.newRegime.totalTax === 0, "Net tax payable under New Regime for ₹12.5L is ₹0 after 87A rebate");
assert(tax12_5L.recommendedRegime === "New Tax Regime", "New Tax Regime is correctly recommended");

// 1.2 Income Tax Budget 2025-26: ₹15 Lakh Salaried
const tax15L = IndianFinanceEngine.calculateIncomeTax({ grossIncome: 1500000, isSalaried: true });
assert(tax15L.newRegime.taxableIncome === 1425000, "₹15L CTC has taxable income ₹14,25,000");
assert(tax15L.newRegime.totalTax > 0, "Tax is properly calculated above ₹12L threshold");

// 1.3 SIP Calculation: ₹10,000/mo at 12% for 15 yrs
const sipRes = IndianFinanceEngine.calculateSIP({ monthlyInvestment: 10000, annualReturnRate: 12, tenureYears: 15 });
assert(sipRes.totalInvested === 1800000, "SIP Total Invested is exactly ₹18,00,000");
assert(sipRes.maturityValue >= 5040000 && sipRes.maturityValue <= 5050000, `SIP Maturity is ~₹50.45 Lakhs (got ${sipRes.maturityValue})`);
assert(sipRes.yearlyBreakdown.length === 15, "SIP generates 15 years breakdown array");

// 1.4 Home Loan EMI: ₹50,00,000 at 8.5% for 20 yrs
const emiRes = IndianFinanceEngine.calculateHomeLoan({ principal: 5000000, annualInterestRate: 8.5, tenureYears: 20 });
assert(emiRes.monthlyEMI >= 43350 && emiRes.monthlyEMI <= 43450, `Monthly EMI is ~₹43,391 (got ${emiRes.monthlyEMI})`);
assert(emiRes.totalInterest >= 5400000 && emiRes.totalInterest <= 5420000, `Total Interest is ~₹54.13 Lakhs (got ${emiRes.totalInterest})`);
assert(emiRes.yearlySchedule.length === 20, "Amortization schedule generates 20 yearly rows");

// 1.5 Indian Gold & Jewellery Billing: 10g 22K at ₹7500/g + 10% making + ₹45 hallmark + 3% GST
const goldRes = IndianFinanceEngine.calculateGoldJewellery({
  weightGrams: 10,
  base24KRatePerGram: 7500,
  purityKarat: 22,
  makingChargesType: "percent",
  makingChargesValue: 10,
  includeHallmark: true
});
assert(goldRes.rawGoldValue === 68750, "10g 22K gold value is ₹68,750");
assert(goldRes.makingCharges === 6875, "10% making charges is ₹6,875");
assert(goldRes.hallmarkFee === 45, "BIS Hallmark fee is ₹45");
assert(goldRes.gstAmount >= 2269 && goldRes.gstAmount <= 2271, `3% GST is ₹2,270 (got ${goldRes.gstAmount})`);
assert(goldRes.finalBillingAmount >= 77935 && goldRes.finalBillingAmount <= 77945, `Final Gold bill is ~₹77,940 (got ${goldRes.finalBillingAmount})`);

// 1.6 PPF: ₹1,50,000/yr for 15 yrs at 7.1%
const ppfRes = IndianFinanceEngine.calculatePPF({ yearlyDeposit: 150000, annualInterestRate: 7.1, tenureYears: 15 });
assert(ppfRes.totalInvested === 2250000, "PPF Total Invested is ₹22,50,000");
assert(ppfRes.maturityAmount >= 4060000 && ppfRes.maturityAmount <= 4075000, `PPF Maturity is ~₹40.68 Lakhs (got ${ppfRes.maturityAmount})`);

// 1.7 Indian Land Units: 100 Gaj to Sq Ft = 900 Sq Ft
const landRes = IndianFinanceEngine.convertLandArea(100, "gaj", "sqft");
assert(landRes === 900, `100 Gaj = 900 Square Feet (got ${landRes})`);

// 1.8 GST: ₹10,000 @ 18% Add GST
const gstRes = IndianFinanceEngine.calculateGST({ amount: 10000, gstRatePercent: 18, type: "exclusive" });
assert(gstRes.gstAmount === 1800, "GST amount is ₹1,800");
assert(gstRes.cgst === 900 && gstRes.sgst === 900, "CGST and SGST are ₹900 each");
assert(gstRes.totalAmount === 11800, "Gross amount is ₹11,800");

// -----------------------------------------------------------------------------
// 2. Casio fx-991MS Physical Calci Engine Tests
// -----------------------------------------------------------------------------
console.log("\n[2] Testing CasioCalciEngine...");
const casio = new CasioCalciEngine();

// 2.1 Basic arithmetic on Casio
casio.allClear();
casio.insert("7");
casio.insert(" × ");
casio.insert("8");
casio.evaluate();
assert(casio.result === "56", `Casio 7 × 8 = 56 (got ${casio.result})`);

// 2.2 Trigonometry in DEG mode: sin(30) = 0.5
casio.allClear();
casio.setAngleUnit("DEG");
casio.insert("sin(");
casio.insert("30");
casio.insert(")");
casio.evaluate();
assert(Math.abs(parseFloat(casio.result) - 0.5) < 1e-6, `Casio sin(30) in DEG is 0.5 (got ${casio.result})`);

// 2.3 Permutation & Combination
casio.allClear();
casio.insert("5");
casio.insert("P");
casio.insert("2");
casio.evaluate();
assert(casio.result === "20", `Casio 5P2 = 20 (got ${casio.result})`);

// 2.4 Polynomial Quadratic Solver: x² - 5x + 6 = 0 -> roots 3 and 2
const quadRoots = casio.solveQuadratic(1, -5, 6);
assert(quadRoots[0] === "3.0000" && quadRoots[1] === "2.0000", `Quadratic roots for x²-5x+6 are [3, 2] (got ${quadRoots})`);

// 2.5 Simultaneous Linear Equations (2 unknowns): 2x + 3y = 13, x - y = -1 -> x=2, y=3
const simRoots = casio.solveSimultaneous2(2, 3, 13, 1, -1, -1);
assert(simRoots[0] === "2.0000" && simRoots[1] === "3.0000", `Simultaneous equations solution is [2, 3] (got ${simRoots})`);

// 2.6 Numerical Integration: ∫(x^2, 0, 3) = 9
const intRes = casio.numericalIntegrate("X^2", 0, 3, 100);
assert(Math.abs(intRes - 9.0) < 1e-4, `Numerical integration of x² from 0 to 3 is 9.0 (got ${intRes.toFixed(4)})`);

// 2.7 Numerical Differentiation: d/dx(x^2 at x=3) = 6
const diffRes = casio.numericalDerivative("X^2", 3);
assert(Math.abs(diffRes - 6.0) < 1e-4, `Numerical derivative of x² at 3 is 6.0 (got ${diffRes.toFixed(4)})`);

// 2.8 Static Methods & Newton-Raphson solver
const staticInt = CasioCalciEngine.integrate("x**2", 0, 3);
assert(Math.abs(staticInt - 9.0) < 1e-4, `Static integrate of x^2 from 0 to 3 is 9.0 (got ${staticInt})`);

const staticDeriv = CasioCalciEngine.derivative("x**3", 2);
assert(Math.abs(staticDeriv - 12.0) < 1e-4, `Static derivative of x^3 at 2 is 12.0 (got ${staticDeriv})`);

const staticSolve = CasioCalciEngine.solve("2*x + 8 - 24");
assert(Math.abs(staticSolve - 8.0) < 1e-4, `Static solver for 2x + 8 = 24 yields 8.0 (got ${staticSolve})`);

// -----------------------------------------------------------------------------
// 3. Desktop Basic Calculator Engine Tests
// -----------------------------------------------------------------------------
console.log("\n[3] Testing BasicCalculatorEngine...");
const basic = new BasicCalculatorEngine();

basic.appendDigit("9");
basic.setOperation("×");
basic.appendDigit("9");
basic.compute();
assert(basic.display === "81", `Basic Calculator 9 × 9 = 81 (got ${basic.display})`);

basic.squareRoot();
assert(basic.display === "9", `Basic Calculator √81 = 9 (got ${basic.display})`);

// Percentage: 500 + 10% = 550
basic.clear();
basic.appendDigit("5");
basic.appendDigit("0");
basic.appendDigit("0");
basic.setOperation("+");
basic.appendDigit("1");
basic.appendDigit("0");
basic.percentage();
basic.compute();
assert(basic.display === "550", `Basic Calculator 500 + 10% = 550 (got ${basic.display})`);

// -----------------------------------------------------------------------------
// 4. Programmer 64-Bit Engine Tests
// -----------------------------------------------------------------------------
console.log("\n[4] Testing ProgrammerEngine...");
const prog = new ProgrammerEngine();

prog.setValueFromDec("255");
assert(prog.getHex() === "FF", `255 Decimal is FF Hex (got ${prog.getHex()})`);
assert(prog.getOct() === "377", `255 Decimal is 377 Octal (got ${prog.getOct()})`);

prog.toggleBit(0); // flip bit 0: 255 -> 254
assert(prog.getDec() === "254", `Flipping bit 0 of 255 yields 254 (got ${prog.getDec()})`);

// -----------------------------------------------------------------------------
// 5. Verifying Legal & Formula Pages Content
// -----------------------------------------------------------------------------
console.log("\n[5] Testing HTML Pages Integrity...");
import fs from "fs";

const termsHtml = fs.readFileSync("c:/Calculator/terms.html", "utf-8");
assert(termsHtml.includes("SEBI Regulatory Compliance"), "terms.html includes SEBI compliance");
assert(termsHtml.includes("Income Tax Act & Union Budget Provisions"), "terms.html includes Income Tax compliance");
assert(termsHtml.includes("Intellectual Property & Brand Non-Affiliation"), "terms.html includes Brand non-affiliation");

const formulasHtml = fs.readFileSync("c:/Calculator/engineering-formulas.html", "utf-8");
assert(formulasHtml.includes("Simpson's 1/3 Rule"), "engineering-formulas.html includes Simpson's 1/3 rule");
assert(formulasHtml.includes("Newton-Raphson Iterative Root Solver"), "engineering-formulas.html includes Newton-Raphson");
assert(formulasHtml.includes("Floor Area Ratio (FAR / FSI)"), "engineering-formulas.html includes FAR architectural formula");
assert(formulasHtml.includes("Euler-Bernoulli"), "engineering-formulas.html includes Beam Bending formula");

const indexHtml = fs.readFileSync("c:/Calculator/index.html", "utf-8");
assert(indexHtml.includes("global-search-input"), "index.html includes center header global-search-input");
assert(!indexHtml.includes("sidebar-search-box"), "index.html does not contain sidebar-search-box");
assert(indexHtml.includes("engineering-formulas.html"), "index.html links to engineering-formulas.html");
assert(indexHtml.includes("terms.html"), "index.html links to terms.html");
assert(indexHtml.includes("privacy.html"), "index.html links to privacy.html");

// -----------------------------------------------------------------------------
// 6. Google Analytics 4, Search Console & Privacy Policy Verification
// -----------------------------------------------------------------------------
console.log("\n[6] Testing Google Analytics, Search Console & Privacy Foundation...");
import { SITE_CONFIG } from "./js/config.js";
import { analytics } from "./js/analytics.js";

// 6.1 Configuration checks
assert(Boolean(SITE_CONFIG.gaMeasurementId), "SITE_CONFIG defines gaMeasurementId");
assert(Boolean(SITE_CONFIG.gscVerificationToken), "SITE_CONFIG defines gscVerificationToken");
assert(Boolean(SITE_CONFIG.productionDomain), "SITE_CONFIG defines productionDomain");

// 6.2 Analytics Service API checks
assert(typeof analytics.init === "function", "analytics.init method exists");
assert(typeof analytics.trackCalculatorView === "function", "analytics.trackCalculatorView method exists");
assert(typeof analytics.trackCalculation === "function", "analytics.trackCalculation method exists");
assert(typeof analytics.trackSearch === "function", "analytics.trackSearch method exists");
assert(typeof analytics.trackThemeChange === "function", "analytics.trackThemeChange method exists");

// Test event dispatch in mock mode
analytics.init();
analytics.trackCalculatorView("tax", "Income Tax Calculator");
analytics.trackCalculation("sip", { sip_amount: 10000 });
analytics.trackSearch("gst", 1);
assert(analytics.initialized === true, "Analytics service successfully initialized in mock mode");

// 6.3 Google Search Console Verification Meta Tag across pages
assert(indexHtml.includes('name="google-site-verification"'), "index.html includes GSC verification meta tag");
assert(termsHtml.includes('name="google-site-verification"'), "terms.html includes GSC verification meta tag");
assert(formulasHtml.includes('name="google-site-verification"'), "engineering-formulas.html includes GSC verification meta tag");

// 6.4 Privacy Policy Page Integrity
const privacyHtml = fs.readFileSync("c:/Calculator/privacy.html", "utf-8");
assert(privacyHtml.includes('name="google-site-verification"'), "privacy.html includes GSC verification meta tag");
assert(privacyHtml.includes("Google Analytics 4"), "privacy.html includes GA4 disclosures");
assert(privacyHtml.includes("Your Financial Data Never Leaves Your Device"), "privacy.html includes zero-storage financial privacy guarantee");
assert(privacyHtml.includes("Google AdSense"), "privacy.html includes advertising cookie disclosure");
assert(privacyHtml.includes("calc_theme"), "privacy.html includes localStorage disclosure");

// 6.5 Sitemap and Robots verification
const sitemapXml = fs.readFileSync("c:/Calculator/sitemap.xml", "utf-8");
assert(sitemapXml.includes("privacy.html"), "sitemap.xml includes privacy.html");
assert(sitemapXml.includes("engineering-formulas.html"), "sitemap.xml includes engineering-formulas.html");
assert(sitemapXml.includes("terms.html"), "sitemap.xml includes terms.html");

const robotsTxt = fs.readFileSync("c:/Calculator/robots.txt", "utf-8");
assert(robotsTxt.includes("Allow: /privacy.html"), "robots.txt explicitly allows privacy.html");
assert(robotsTxt.includes("Allow: /sitemap.xml"), "robots.txt allows sitemap.xml");

// -----------------------------------------------------------------------------
// 7. TrueCalci Global & Multi-Regional Engine Verification
// -----------------------------------------------------------------------------
console.log("\n[7] Testing TrueCalci Global Finance Engine (US, Europe & Worldwide)...");
import { GlobalFinanceEngine } from "./js/engines/global-finance.js";

// 7.1 US Mortgage PITI Calculation
const mgRes = GlobalFinanceEngine.calculateMortgagePITI({
  homePrice: 450000,
  downPaymentPercent: 20,
  interestRate: 6.75,
  tenureYears: 30,
  propertyTaxRatePercent: 1.2,
  annualHomeInsurance: 1400
});
assert(mgRes.principal === 360000, "Mortgage principal is $360,000");
assert(mgRes.isPmiRequired === false, "20% down payment requires no PMI");
assert(mgRes.monthlyPI >= 2330 && mgRes.monthlyPI <= 2340, `Monthly P&I is ~$2,335 (got ${mgRes.monthlyPI})`);
assert(mgRes.monthlyTotalPITI >= 2895 && mgRes.monthlyTotalPITI <= 2915, `Monthly PITI is ~$2,902 (got ${mgRes.monthlyTotalPITI})`);
assert(mgRes.yearlySchedule.length === 30, "Mortgage generates 30-year amortization schedule");

// 7.2 US Mortgage with PMI (<20% down)
const mgPmiRes = GlobalFinanceEngine.calculateMortgagePITI({
  homePrice: 300000,
  downPaymentPercent: 10,
  interestRate: 6.5,
  tenureYears: 30
});
assert(mgPmiRes.isPmiRequired === true, "10% down payment requires PMI");
assert(mgPmiRes.monthlyPmi > 0, "Monthly PMI is correctly computed");

// 7.3 European VAT: Add Tax (Net -> Gross)
const vatAdd = GlobalFinanceEngine.calculateVAT({ amount: 1000, vatRatePercent: 20, mode: "add" });
assert(vatAdd.grossAmount === 1200, "Adding 20% VAT to 1000 yields Gross 1200");
assert(vatAdd.vatAmount === 200, "VAT amount is 200");

// 7.4 European VAT: Remove Tax (Gross -> Net)
const vatRem = GlobalFinanceEngine.calculateVAT({ amount: 1200, vatRatePercent: 20, mode: "remove" });
assert(vatRem.netAmount === 1000, "Removing 20% VAT from 1200 yields Net 1000");
assert(vatRem.vatAmount === 200, "Extracted VAT amount is 200");

// 7.5 Tip & Restaurant Bill Splitter
const tipRes = GlobalFinanceEngine.calculateTip({ billAmount: 85, tipPercent: 18, numberOfGuests: 2 });
assert(tipRes.tipAmount === 15.3, "18% tip on $85 is $15.30");
assert(tipRes.totalWithTip === 100.3, "Total bill with tip is $100.30");
assert(tipRes.totalPerPerson === 50.15, "Per person share is $50.15");

// 7.6 Compound Wealth & 401(k) Growth
const cpRes = GlobalFinanceEngine.calculateCompoundWealth({
  principal: 10000,
  monthlyDeposit: 500,
  annualRatePercent: 8,
  tenureYears: 15
});
assert(cpRes.totalDeposited === 100000, "Total principal deposited is $100,000");
assert(cpRes.futureValue >= 195000 && cpRes.futureValue <= 215000, `Future value is ~$201,848 (got ${cpRes.futureValue})`);
assert(cpRes.yearlySchedule.length === 15, "Compound simulator produces 15-year schedule");

// 7.7 Global UI, Region Switcher & TrueCalci Branding Verification
assert(indexHtml.includes("TrueCalci"), "index.html incorporates TrueCalci brand");
assert(indexHtml.includes("region-switcher"), "index.html includes global region switcher");
assert(indexHtml.includes('data-tool="mortgage"'), "index.html includes US Mortgage tool");
assert(indexHtml.includes('data-tool="vat"'), "index.html includes European VAT tool");
assert(indexHtml.includes('data-tool="tip"'), "index.html includes Tip Splitter tool");
assert(indexHtml.includes('data-tool="compound"'), "index.html includes Compound Wealth tool");
assert(sitemapXml.includes("#mortgage"), "sitemap.xml indexes #mortgage");
assert(sitemapXml.includes("#vat"), "sitemap.xml indexes #vat");

// -----------------------------------------------------------------------------
// 8. TrueCalci Open AI Agent API & Model Context Protocol (MCP) Verification
// -----------------------------------------------------------------------------
console.log("\n[8] Testing TrueCalci Open AI Agent API & MCP Server...");

try {
  const healthRes = await fetch("http://localhost:4000/api/v1/health").then(r => r.json());
  assert(healthRes.status === "ok", "API Health check returns 'ok'");
  assert(healthRes.service.includes("TrueCalci Open AI Agent API"), "API service title is TrueCalci Open AI Agent API");

  const toolsRes = await fetch("http://localhost:4000/api/v1/tools").then(r => r.json());
  assert(toolsRes.tools.length >= 8, `API provides ${toolsRes.tools.length} computational tools (>= 8 expected)`);
  assert(toolsRes.tools.some(t => t.name === "mortgage_piti"), "API includes mortgage_piti tool");
  assert(toolsRes.tools.some(t => t.name === "vat_sales_tax"), "API includes vat_sales_tax tool");

  // REST API Calculation: US Mortgage
  const apiMortgage = await fetch("http://localhost:4000/api/v1/calculate?tool=mortgage&homePrice=450000&downPaymentPercent=20&interestRate=6.8").then(r => r.json());
  assert(apiMortgage.success === true, "API Mortgage calculation succeeds");
  assert(apiMortgage.result.monthlyTotalPITI >= 2900 && apiMortgage.result.monthlyTotalPITI <= 2930, `API Mortgage monthly PITI matches (~$2,914, got ${apiMortgage.result.monthlyTotalPITI})`);

  // REST API Calculation: European VAT
  const apiVat = await fetch("http://localhost:4000/api/v1/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool: "vat", params: { amount: 1000, vatRatePercent: 20, mode: "add" } })
  }).then(r => r.json());
  assert(apiVat.success === true, "API VAT calculation succeeds");
  assert(apiVat.result.grossAmount === 1200, "API VAT gross amount is $1200");

  // REST API Calculation: Casio 991 Quadratic Roots
  const apiQuad = await fetch("http://localhost:4000/api/v1/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool: "calci991_solve", params: { type: "quadratic", a: 1, b: -5, c: 6 } })
  }).then(r => r.json());
  assert(apiQuad.success === true, "API Casio 991 solve succeeds");
  assert(apiQuad.result[0] === "3.0000" && apiQuad.result[1] === "2.0000", "API quadratic roots are 3 and 2");

  // REST API Calculation: Engineering Beam Deflection
  const apiBeam = await fetch("http://localhost:4000/api/v1/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tool: "beam_bending",
      params: { loadNewtons: 5000, lengthMeters: 4, elasticModulusGpa: 200, momentOfInertiaCm4: 800, distanceFromNeutralAxisMm: 100 }
    })
  }).then(r => r.json());
  assert(apiBeam.success === true, "API Beam bending calculation succeeds");
  assert(apiBeam.result.maxDeflectionMm === 4.1667, `Beam deflection is 4.1667mm (got ${apiBeam.result.maxDeflectionMm})`);
  assert(apiBeam.result.maxBendingMomentNm === 5000, "Max bending moment is 5000 Nm");

  // REST API Calculation: 2D Projectile Motion
  const apiProj = await fetch("http://localhost:4000/api/v1/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tool: "projectile_motion",
      params: { initialVelocityMs: 50, launchAngleDegrees: 45 }
    })
  }).then(r => r.json());
  assert(apiProj.success === true, "API Projectile motion calculation succeeds");
  assert(apiProj.result.horizontalRangeMeters >= 254 && apiProj.result.horizontalRangeMeters <= 256, `Projectile range is ~255m (got ${apiProj.result.horizontalRangeMeters})`);

  // REST API Calculation: Black-Scholes Quantitative Options Pricing
  const apiBs = await fetch("http://localhost:4000/api/v1/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tool: "black_scholes_options",
      params: { stockPrice: 100, strikePrice: 100, timeToExpiryYears: 1, riskFreeRatePercent: 5, volatilityPercent: 20 }
    })
  }).then(r => r.json());
  assert(apiBs.success === true, "API Black-Scholes calculation succeeds");
  assert(apiBs.result.callPrice >= 10.4 && apiBs.result.callPrice <= 10.5, `Black-Scholes Call is ~$10.45 (got ${apiBs.result.callPrice})`);
  assert(apiBs.result.greeks.deltaCall >= 0.63 && apiBs.result.greeks.deltaCall <= 0.64, `Black-Scholes Delta is ~0.637 (got ${apiBs.result.greeks.deltaCall})`);

  // Direct Unit Tests for Statistics Engine
  const statsRes = StatisticsOptionsEngine.calculateDescriptiveStats([10, 20, 30, 40, 50]);
  assert(statsRes.mean === 30, "Mean of [10..50] is 30");
  assert(statsRes.median === 30, "Median of [10..50] is 30");
  assert(statsRes.stdDevSample >= 15.8 && statsRes.stdDevSample <= 15.82, "Sample std dev is ~15.81");
} catch (e) {
  assert(false, `API verification failed with error: ${e.message}`);
}

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log("\n================================================================================");
console.log(`VERIFICATION COMPLETE: ${testsPassed} PASSED, ${testsFailed} FAILED.`);
console.log("================================================================================");

if (testsFailed > 0) {
  process.exit(1);
}
