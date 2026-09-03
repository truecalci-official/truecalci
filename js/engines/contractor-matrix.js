/**
 * TrueCalci Remote Contractor Take-Home Matrix Engine
 * High-Precision 1099 vs. W-2 vs. B2B Pass-Through Tax, FX Drag & Benefits Parity Simulator.
 * 
 * Complies with:
 * - 2024/2025 US Federal Income Tax Brackets (Single & Married Filing Jointly)
 * - FICA & SECA Statutory Caps ($168,600 Social Security Wage Base)
 * - 50% Self-Employment Tax Above-the-Line AGI Deduction (IRC § 164(f))
 * - Section 199A Qualified Business Income (QBI) 20% Pass-Through Deduction (IRC § 199A)
 * - Self-Employed Health Insurance Deduction (IRC § 162(l))
 * - Cross-Border FX Drag & Payout Rail Conversion (Wise, Deel, Stripe, Payoneer, PayPal, SWIFT)
 * - Exact Analytical & Numerical Binary Breakeven Hourly Rate Solver
 */

export class ContractorMatrixEngine {
  // 2024/2025 US Federal Tax Brackets
  static TAX_BRACKETS = {
    single: [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 },
      { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 }
    ],
    mfj: [
      { min: 0, max: 23200, rate: 0.10 },
      { min: 23200, max: 94300, rate: 0.12 },
      { min: 94300, max: 201050, rate: 0.22 },
      { min: 201050, max: 383900, rate: 0.24 },
      { min: 383900, max: 487450, rate: 0.32 },
      { min: 487450, max: 731200, rate: 0.35 },
      { min: 731200, max: Infinity, rate: 0.37 }
    ]
  };

  // Standard Deductions (2024/2025)
  static STANDARD_DEDUCTIONS = {
    single: 14600,
    mfj: 29200
  };

  // FICA / SECA Constants
  static SS_WAGE_BASE_CAP = 168600;
  static SS_RATE_EMPLOYEE = 0.062;
  static SS_RATE_SECA = 0.124;
  static MEDICARE_RATE_EMPLOYEE = 0.0145;
  static MEDICARE_RATE_SECA = 0.029;
  static ADDL_MEDICARE_RATE = 0.009;
  static ADDL_MEDICARE_THRESHOLD = {
    single: 200000,
    mfj: 250000
  };
  static SE_TAXABLE_PORTION = 0.9235;

  // QBI Phase-out Thresholds (SSTB)
  static QBI_THRESHOLD = {
    single: { start: 191950, end: 241950 },
    mfj: { start: 383900, end: 483900 }
  };

  // FX Rails Fee & Markup Model
  static FX_RAILS = {
    wise: { name: "Wise Business", feeFlat: 0, feePercent: 0.0055, description: "Mid-market FX rate + 0.55% transparent fee" },
    deel: { name: "Deel / Remote", feeFlat: 0, feePercent: 0.0200, description: "Embedded contractor FX spread ~2.00%" },
    payoneer: { name: "Payoneer", feeFlat: 0, feePercent: 0.0300, description: "Currency conversion fee ~3.00%" },
    stripe: { name: "Stripe Invoicing", feeFlat: 0.30, feePercent: 0.0490, description: "2.9% processing + 1% cross-border + 1% FX" },
    paypal: { name: "PayPal", feeFlat: 0, feePercent: 0.0790, description: "4.4% international commercial + 3.5% currency spread" },
    wire: { name: "Bank SWIFT Wire", feeFlat: 35, feePercent: 0.0300, description: "$35 international incoming wire + ~3% bank FX markup" }
  };

  // Mid-Market Benchmark FX Rates (relative to 1 USD)
  static FX_RATES = {
    EUR: { rate: 0.92, symbol: "€", name: "Eurozone (EUR)" },
    GBP: { rate: 0.78, symbol: "£", name: "United Kingdom (GBP)" },
    INR: { rate: 83.92, symbol: "₹", name: "India (INR)" },
    CAD: { rate: 1.36, symbol: "CA$", name: "Canada (CAD)" },
    AUD: { rate: 1.52, symbol: "A$", name: "Australia (AUD)" },
    BRL: { rate: 5.65, symbol: "R$", name: "Brazil (BRL)" },
    PHP: { rate: 58.50, symbol: "₱", name: "Philippines (PHP)" },
    MXN: { rate: 19.80, symbol: "Mex$", name: "Mexico (MXN)" }
  };

  /**
   * Helper: Calculate Progressive Federal Income Tax
   */
  static computeFederalTax(taxableIncome, filingStatus = "single") {
    if (taxableIncome <= 0) return 0;
    const brackets = this.TAX_BRACKETS[filingStatus] || this.TAX_BRACKETS.single;
    let tax = 0;

    for (const b of brackets) {
      if (taxableIncome > b.min) {
        const taxableInBracket = Math.min(taxableIncome, b.max) - b.min;
        tax += taxableInBracket * b.rate;
      } else {
        break;
      }
    }
    return Math.round(tax * 100) / 100;
  }

  /**
   * 1. Calculate W-2 Employee Compensation & Net Take-Home Pay
   * @param {Object} params
   * @param {number} params.salary - Annual gross salary ($/yr)
   * @param {string} [params.filingStatus="single"] - "single" | "mfj"
   * @param {number} [params.stateTaxRatePercent=5.0] - State income tax rate %
   * @param {number} [params.healthSubsidyAnnual=7200] - Annual value of employer-subsidized health/dental ($/yr)
   * @param {number} [params.match401kPercent=4.0] - 401(k) employer match percentage %
   * @param {number} [params.ptoDays=25] - Paid time off days (vacation + statutory holidays)
   * @param {number} [params.employee401kContribution=0] - Voluntary employee 401(k) contribution ($/yr)
   */
  static calculateW2({
    salary = 130000,
    filingStatus = "single",
    stateTaxRatePercent = 5.0,
    healthSubsidyAnnual = 7200,
    match401kPercent = 4.0,
    ptoDays = 25,
    employee401kContribution = 0
  }) {
    salary = Math.max(0, Number(salary) || 0);
    const status = filingStatus === "mfj" ? "mfj" : "single";
    const stdDeduction = this.STANDARD_DEDUCTIONS[status];

    // FICA Taxes
    const ssTax = Math.min(salary, this.SS_WAGE_BASE_CAP) * this.SS_RATE_EMPLOYEE;
    const medTax = salary * this.MEDICARE_RATE_EMPLOYEE;
    const addlMedThreshold = this.ADDL_MEDICARE_THRESHOLD[status];
    const addlMedTax = Math.max(0, salary - addlMedThreshold) * this.ADDL_MEDICARE_RATE;
    const totalFica = ssTax + medTax + addlMedTax;
    const employerFicaMatch = (Math.min(salary, this.SS_WAGE_BASE_CAP) * this.SS_RATE_EMPLOYEE) + medTax;

    // Federal Taxable Income
    const preTaxDeductions = Math.min(salary, Math.max(0, Number(employee401kContribution) || 0));
    const federalTaxable = Math.max(0, salary - preTaxDeductions - stdDeduction);
    const federalTax = this.computeFederalTax(federalTaxable, status);

    // State Tax
    const stateTaxRate = Math.max(0, Number(stateTaxRatePercent) || 0) / 100;
    const stateTax = Math.max(0, salary - preTaxDeductions - stdDeduction) * stateTaxRate;

    // Corporate Benefits Value
    const employer401kMatch = salary * (Math.max(0, Number(match401kPercent) || 0) / 100);
    // PTO Monetary Value: (Salary / 2080 annual working hours) * (PTO days * 8 hours)
    const hourlyBaseRate = salary > 0 ? salary / 2080 : 0;
    const ptoHours = Math.max(0, Number(ptoDays) || 0) * 8;
    const ptoMonetaryValue = hourlyBaseRate * ptoHours;
    const totalBenefitsValue = Number(healthSubsidyAnnual) + employer401kMatch + ptoMonetaryValue;

    // Cash Take-Home Pay (Money arriving in paycheck bank account)
    const annualTakeHomeCash = Math.max(0, salary - totalFica - federalTax - stateTax - preTaxDeductions);
    const monthlyTakeHomeCash = annualTakeHomeCash / 12;

    // Total Economic Compensation
    const totalCompValue = annualTakeHomeCash + Number(healthSubsidyAnnual) + employer401kMatch;

    // Real Worked Hourly Value: annual take-home divided by actual hours worked (2080 - PTO hours)
    const actualHoursWorked = Math.max(1, 2080 - ptoHours);
    const effectiveWorkedHourlyTakeHome = annualTakeHomeCash / actualHoursWorked;

    return {
      grossSalary: salary,
      filingStatus: status,
      standardDeduction: stdDeduction,
      federalTaxableIncome: federalTaxable,
      taxes: {
        socialSecurity: Math.round(ssTax),
        medicare: Math.round(medTax),
        additionalMedicare: Math.round(addlMedTax),
        totalFica: Math.round(totalFica),
        employerFicaMatch: Math.round(employerFicaMatch),
        federalTax: Math.round(federalTax),
        stateTax: Math.round(stateTax),
        totalTax: Math.round(totalFica + federalTax + stateTax),
        effectiveTaxRate: salary > 0 ? Math.round(((totalFica + federalTax + stateTax) / salary) * 1000) / 10 : 0
      },
      benefits: {
        healthSubsidyAnnual: Number(healthSubsidyAnnual),
        employer401kMatch: Math.round(employer401kMatch),
        ptoDays: Number(ptoDays),
        ptoHours,
        ptoMonetaryValue: Math.round(ptoMonetaryValue),
        totalBenefitsValue: Math.round(totalBenefitsValue)
      },
      cashFlow: {
        annualTakeHomeCash: Math.round(annualTakeHomeCash),
        monthlyTakeHomeCash: Math.round(monthlyTakeHomeCash),
        biweeklyTakeHomeCash: Math.round(annualTakeHomeCash / 26),
        effectiveWorkedHourlyTakeHome: Math.round(effectiveWorkedHourlyTakeHome * 100) / 100,
        totalCompValue: Math.round(totalCompValue)
      }
    };
  }

  /**
   * 2. Calculate 1099 Independent Contractor / B2B Pass-Through Cash Flow & Taxes
   * @param {Object} params
   * @param {number} [params.hourlyRate=85] - Billing rate ($/hr)
   * @param {number} [params.hoursPerWeek=40] - Billable hours per week
   * @param {number} [params.weeksPerYear=48] - Billable weeks per year (accounts for unpaid time off)
   * @param {number} [params.annualExpenses=6000] - Deductible business expenses (hardware, software, home office)
   * @param {string} [params.filingStatus="single"] - "single" | "mfj"
   * @param {number} [params.stateTaxRatePercent=5.0] - State income tax rate %
   * @param {boolean} [params.eligibleQBI=true] - Section 199A 20% QBI deduction eligible
   * @param {boolean} [params.isSSTB=true] - Specified Service Trade or Business (tech consulting subject to phase-out)
   * @param {number} [params.selfFundedHealthAnnual=7200] - Self-funded health insurance premium ($/yr)
   * @param {number} [params.solo401kAnnual=0] - Voluntary Solo 401(k) / SEP IRA contribution ($/yr)
   */
  static calculate1099({
    hourlyRate = 85,
    hoursPerWeek = 40,
    weeksPerYear = 48,
    annualExpenses = 6000,
    filingStatus = "single",
    stateTaxRatePercent = 5.0,
    eligibleQBI = true,
    isSSTB = true,
    selfFundedHealthAnnual = 7200,
    solo401kAnnual = 0
  }) {
    const rate = Math.max(0, Number(hourlyRate) || 0);
    const hrsWk = Math.max(0, Number(hoursPerWeek) || 0);
    const wksYr = Math.max(0, Number(weeksPerYear) || 0);
    const totalBillableHours = hrsWk * wksYr;
    const grossRevenue = rate * totalBillableHours;

    const expenses = Math.min(grossRevenue, Math.max(0, Number(annualExpenses) || 0));
    const netBusinessProfit = Math.max(0, grossRevenue - expenses);
    const status = filingStatus === "mfj" ? "mfj" : "single";
    const stdDeduction = this.STANDARD_DEDUCTIONS[status];

    // Self-Employment Tax (SECA)
    // Applied to 92.35% of net profit
    const seTaxableBase = netBusinessProfit * this.SE_TAXABLE_PORTION;
    const seSocialSecurity = Math.min(seTaxableBase, this.SS_WAGE_BASE_CAP) * this.SS_RATE_SECA;
    const seMedicare = seTaxableBase * this.MEDICARE_RATE_SECA;
    const addlMedThreshold = this.ADDL_MEDICARE_THRESHOLD[status];
    const seAddlMedicare = Math.max(0, seTaxableBase - addlMedThreshold) * this.ADDL_MEDICARE_RATE;
    const totalSETax = seSocialSecurity + seMedicare + seAddlMedicare;

    // Above-the-line Deductions
    const halfSEDeduction = totalSETax * 0.50; // IRC § 164(f)
    const seHealthDeduction = Math.min(Math.max(0, netBusinessProfit - halfSEDeduction), Number(selfFundedHealthAnnual) || 0); // IRC § 162(l)
    const retirementDeduction = Math.min(Math.max(0, netBusinessProfit - halfSEDeduction - seHealthDeduction), Number(solo401kAnnual) || 0);

    const agi = Math.max(0, netBusinessProfit - halfSEDeduction - seHealthDeduction - retirementDeduction);

    // Section 199A QBI Deduction (20%)
    let qbiDeduction = 0;
    let qbiPhaseoutMessage = "Full 20% QBI applied";

    if (eligibleQBI && netBusinessProfit > 0) {
      const qbiBase = Math.max(0, netBusinessProfit - halfSEDeduction - seHealthDeduction - retirementDeduction);
      const taxableBeforeQBI = Math.max(0, agi - stdDeduction);
      const potentialQBI = 0.20 * Math.min(qbiBase, taxableBeforeQBI);

      const threshold = this.QBI_THRESHOLD[status];
      if (taxableBeforeQBI <= threshold.start) {
        qbiDeduction = potentialQBI;
      } else if (taxableBeforeQBI > threshold.start && taxableBeforeQBI < threshold.end) {
        if (isSSTB) {
          const phaseoutRatio = (threshold.end - taxableBeforeQBI) / (threshold.end - threshold.start);
          qbiDeduction = potentialQBI * Math.max(0, phaseoutRatio);
          qbiPhaseoutMessage = `SSTB phaseout active: ${Math.round(phaseoutRatio * 100)}% deduction allowed`;
        } else {
          qbiDeduction = potentialQBI; // Simplified for non-SSTB without W2 payroll
        }
      } else {
        if (isSSTB) {
          qbiDeduction = 0;
          qbiPhaseoutMessage = "Income exceeds SSTB limit ($191k/$384k) — QBI phased out";
        } else {
          qbiDeduction = potentialQBI * 0.5; // Cap estimation
        }
      }
    }

    // Federal Taxable Income
    const federalTaxable = Math.max(0, agi - stdDeduction - qbiDeduction);
    const federalTax = this.computeFederalTax(federalTaxable, status);

    // State Tax
    const stateTaxRate = Math.max(0, Number(stateTaxRatePercent) || 0) / 100;
    const stateTaxable = Math.max(0, agi - stdDeduction);
    const stateTax = stateTaxable * stateTaxRate;

    // Out-of-pocket Costs & Cash In Pocket
    const outOfPocketHealth = Number(selfFundedHealthAnnual) || 0;
    const outOfPocketRetirement = Number(solo401kAnnual) || 0;
    const totalOutflows = expenses + totalSETax + federalTax + stateTax + outOfPocketHealth + outOfPocketRetirement;

    const annualNetSpendableCash = Math.max(0, grossRevenue - totalOutflows);
    const monthlyNetSpendableCash = annualNetSpendableCash / 12;
    const effectiveNetHourlyCash = totalBillableHours > 0 ? annualNetSpendableCash / totalBillableHours : 0;

    return {
      grossRevenue: Math.round(grossRevenue),
      hourlyRate: rate,
      totalBillableHours,
      businessExpenses: Math.round(expenses),
      netScheduleCProfit: Math.round(netBusinessProfit),
      filingStatus: status,
      deductions: {
        halfSETax: Math.round(halfSEDeduction),
        seHealthInsurance: Math.round(seHealthDeduction),
        retirement: Math.round(retirementDeduction),
        standardDeduction: stdDeduction,
        qbiDeduction: Math.round(qbiDeduction),
        qbiStatus: qbiPhaseoutMessage
      },
      taxes: {
        seSocialSecurity: Math.round(seSocialSecurity),
        seMedicare: Math.round(seMedicare),
        seAdditionalMedicare: Math.round(seAddlMedicare),
        totalSETax: Math.round(totalSETax),
        federalTax: Math.round(federalTax),
        stateTax: Math.round(stateTax),
        totalTax: Math.round(totalSETax + federalTax + stateTax),
        effectiveTaxRate: grossRevenue > 0 ? Math.round(((totalSETax + federalTax + stateTax) / grossRevenue) * 1000) / 10 : 0
      },
      outflows: {
        selfFundedHealthAnnual: outOfPocketHealth,
        solo401kAnnual: outOfPocketRetirement,
        totalOutOfPocketBenefits: outOfPocketHealth + outOfPocketRetirement
      },
      cashFlow: {
        annualNetSpendableCash: Math.round(annualNetSpendableCash),
        monthlyNetSpendableCash: Math.round(monthlyNetSpendableCash),
        biweeklyNetSpendableCash: Math.round(annualNetSpendableCash / 26),
        effectiveNetHourlyCash: Math.round(effectiveNetHourlyCash * 100) / 100
      }
    };
  }

  /**
   * 3. Cross-Border FX Drag & Payout Rail Calculator
   * @param {Object} params
   * @param {number} params.grossUsd - Annual gross USD invoiced or paid
   * @param {string} [params.targetCurrency="EUR"] - Target currency code
   * @param {string} [params.selectedRail="wise"] - "wise" | "deel" | "payoneer" | "stripe" | "paypal" | "wire"
   */
  static calculateFXDrag({
    grossUsd = 100000,
    targetCurrency = "EUR",
    selectedRail = "wise"
  }) {
    const usd = Math.max(0, Number(grossUsd) || 0);
    const curr = this.FX_RATES[targetCurrency] || this.FX_RATES.EUR;
    const midMarketRate = curr.rate;

    const railsComparison = Object.entries(this.FX_RAILS).map(([key, rail]) => {
      // 12 monthly transfers
      const annualFlatFees = rail.feeFlat * 12;
      const feeAmountUsd = (usd * rail.feePercent) + annualFlatFees;
      const netUsdReceived = Math.max(0, usd - feeAmountUsd);
      const netLocalReceived = netUsdReceived * midMarketRate;
      const theoreticalMaxLocal = usd * midMarketRate;
      const totalLossLocal = theoreticalMaxLocal - netLocalReceived;
      const totalDragPercent = usd > 0 ? (feeAmountUsd / usd) * 100 : 0;

      return {
        key,
        name: rail.name,
        description: rail.description,
        feePercent: rail.feePercent * 100,
        feeFlat: rail.feeFlat,
        feeAmountUsd: Math.round(feeAmountUsd),
        netUsdReceived: Math.round(netUsdReceived),
        netLocalReceived: Math.round(netLocalReceived),
        totalLossLocal: Math.round(totalLossLocal),
        totalDragPercent: Math.round(totalDragPercent * 100) / 100,
        isSelected: key === selectedRail
      };
    });

    const activeRail = railsComparison.find(r => r.key === selectedRail) || railsComparison[0];
    const wiseRail = railsComparison.find(r => r.key === "wise") || railsComparison[0];
    const savingsVsWorst = Math.max(0, Math.max(...railsComparison.map(r => r.feeAmountUsd)) - activeRail.feeAmountUsd);

    return {
      grossUsd: usd,
      targetCurrency,
      currencySymbol: curr.symbol,
      currencyName: curr.name,
      midMarketRate,
      activeRail,
      savingsVsWorstUsd: Math.round(savingsVsWorst),
      rails: railsComparison
    };
  }

  /**
   * 4. Exact Breakeven 1099 Hourly Rate Solver
   * Solves the exact 1099 hourly rate ($/hr) that matches the target W-2 annual net cash.
   */
  static solveBreakevenRate(w2TargetNetCash, contractorBaseParams) {
    let low = 10;
    let high = 600;
    let bestRate = 85;

    // Binary search to find breakeven within $1 tolerance
    for (let iter = 0; iter < 40; iter++) {
      const mid = (low + high) / 2;
      const res = this.calculate1099({
        ...contractorBaseParams,
        hourlyRate: mid
      });

      const netCash = res.cashFlow.annualNetSpendableCash;
      if (Math.abs(netCash - w2TargetNetCash) < 1.0) {
        bestRate = mid;
        break;
      }
      if (netCash < w2TargetNetCash) {
        low = mid;
      } else {
        high = mid;
      }
      bestRate = mid;
    }

    return Math.round(bestRate * 100) / 100;
  }

  /**
   * 5. Full Parity Evaluation & Comparison
   */
  static calculateParity(w2Params = {}, contractorParams = {}, fxParams = {}) {
    const w2 = this.calculateW2(w2Params);
    const contractor = this.calculate1099(contractorParams);
    const fx = this.calculateFXDrag({
      grossUsd: contractor.grossRevenue,
      ...fxParams
    });

    const w2Net = w2.cashFlow.annualTakeHomeCash;
    const cNet = contractor.cashFlow.annualNetSpendableCash;
    const diffAnnual = cNet - w2Net;
    const diffMonthly = diffAnnual / 12;

    const winner = diffAnnual > 0 ? "1099" : (diffAnnual < 0 ? "w2" : "tie");
    const percentDiff = w2Net > 0 ? Math.round((Math.abs(diffAnnual) / w2Net) * 1000) / 10 : 0;

    // Breakeven Solvers
    const breakevenHourlyRateCash = this.solveBreakevenRate(w2Net, contractorParams);
    const breakevenHourlyRateTotalComp = this.solveBreakevenRate(w2.cashFlow.totalCompValue, contractorParams);

    // Rule of thumb parity multiplier check
    const equivalentRuleOfThumbHourly = Math.round((w2.grossSalary / 2080 * 1.32) * 100) / 100;

    return {
      w2,
      contractor,
      fx,
      verdict: {
        winner,
        winnerTitle: winner === "1099" ? "1099 Contractor Offer Wins" : (winner === "w2" ? "W-2 Salaried Offer Wins" : "Equal Net Take-Home"),
        diffAnnual: Math.round(Math.abs(diffAnnual)),
        diffMonthly: Math.round(Math.abs(diffMonthly)),
        percentDiff,
        is1099Winner: winner === "1099",
        breakevenHourlyRateCash,
        breakevenHourlyRateTotalComp,
        equivalentRuleOfThumbHourly,
        headline: winner === "1099"
          ? `🎉 The 1099 offer yields +$${Math.round(Math.abs(diffMonthly)).toLocaleString()}/mo (+${percentDiff}%) more spendable cash!`
          : (winner === "w2"
            ? `🛡️ The W-2 offer leaves +$${Math.round(Math.abs(diffMonthly)).toLocaleString()}/mo (+${percentDiff}%) more spendable cash after benefits & taxes.`
            : `⚖️ Both offers yield exactly equivalent spendable take-home cash.`)
      }
    };
  }

  static formatCurrency(val, currency = "$", decimals = 0) {
    const num = Number(val) || 0;
    return `${currency}${num.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  }
}
