/**
 * RemoteParity - 1099 vs W-2 Parity & Breakeven Solver Engine
 * Comprehensive 2024/2025 US Tax Year Compliance (FICA, SECA, § 199A QBI, § 164(f))
 */

export class ParityEngine {
  static TAX_CONFIG_2024 = {
    socialSecurityWageCap: 168600,
    socialSecurityTaxRate: 0.062,
    socialSecuritySelfEmployedRate: 0.124,
    medicareTaxRate: 0.0145,
    medicareSelfEmployedRate: 0.029,
    additionalMedicareThresholdSingle: 200000,
    additionalMedicareThresholdMFJ: 250000,
    additionalMedicareTaxRate: 0.009,
    standardDeductionSingle: 14600,
    standardDeductionMFJ: 29200,
    qbiDeductionRate: 0.20,
    qbiPhaseOutSingle: { start: 191950, end: 241950 },
    qbiPhaseOutMFJ: { start: 383900, end: 483900 },
    federalBracketsSingle: [
      { max: 11600, rate: 0.10 },
      { max: 47150, rate: 0.12 },
      { max: 100525, rate: 0.22 },
      { max: 191950, rate: 0.24 },
      { max: 243725, rate: 0.32 },
      { max: 609350, rate: 0.35 },
      { max: Infinity, rate: 0.37 }
    ],
    federalBracketsMFJ: [
      { max: 23200, rate: 0.10 },
      { max: 94300, rate: 0.12 },
      { max: 201050, rate: 0.22 },
      { max: 383900, rate: 0.24 },
      { max: 487450, rate: 0.32 },
      { max: 731200, rate: 0.35 },
      { max: Infinity, rate: 0.37 }
    ]
  };

  static calculateProgressiveTax(taxableIncome, brackets) {
    if (taxableIncome <= 0) return 0;
    let tax = 0;
    let previousMax = 0;
    for (const bracket of brackets) {
      if (taxableIncome > previousMax) {
        const taxableChunk = Math.min(taxableIncome - previousMax, bracket.max - previousMax);
        tax += taxableChunk * bracket.rate;
        previousMax = bracket.max;
      } else {
        break;
      }
    }
    return Math.round(tax * 100) / 100;
  }

  static calculateW2(options = {}) {
    const salary = Math.max(0, Number(options.salary !== undefined ? options.salary : 130000));
    const filingStatus = options.filingStatus === "mfj" ? "mfj" : "single";
    const stateTaxRate = Number(options.stateTaxRatePercent !== undefined ? options.stateTaxRatePercent : 5.0) / 100;
    const healthSubsidyAnnual = Math.max(0, Number(options.healthSubsidyAnnual !== undefined ? options.healthSubsidyAnnual : 7200));
    const match401kPercent = Math.max(0, Number(options.match401kPercent !== undefined ? options.match401kPercent : 4.0)) / 100;
    const ptoDays = Math.max(0, Number(options.ptoDays !== undefined ? options.ptoDays : 25));

    const cfg = this.TAX_CONFIG_2024;
    const stdDeduction = filingStatus === "mfj" ? cfg.standardDeductionMFJ : cfg.standardDeductionSingle;
    const addlMedThreshold = filingStatus === "mfj" ? cfg.additionalMedicareThresholdMFJ : cfg.additionalMedicareThresholdSingle;

    const ssTax = Math.min(salary, cfg.socialSecurityWageCap) * cfg.socialSecurityTaxRate;
    const medTax = salary * cfg.medicareTaxRate;
    const addlMedTax = Math.max(0, salary - addlMedThreshold) * cfg.additionalMedicareTaxRate;
    const employeeFica = ssTax + medTax + addlMedTax;

    const employerSs = Math.min(salary, cfg.socialSecurityWageCap) * cfg.socialSecurityTaxRate;
    const employerMed = salary * cfg.medicareTaxRate;
    const employerFicaMatch = employerSs + employerMed;

    const taxableIncome = Math.max(0, salary - stdDeduction);
    const brackets = filingStatus === "mfj" ? cfg.federalBracketsMFJ : cfg.federalBracketsSingle;
    const federalTax = this.calculateProgressiveTax(taxableIncome, brackets);
    const stateTax = Math.round(taxableIncome * stateTaxRate * 100) / 100;

    const totalTaxes = employeeFica + federalTax + stateTax;
    const annualTakeHomeCash = salary - totalTaxes;
    const monthlyTakeHomeCash = annualTakeHomeCash / 12;

    const match401kAnnual = salary * match401kPercent;
    const ptoHourlyRate = salary / 2080;
    const ptoMonetaryValue = ptoHourlyRate * (ptoDays * 8);
    const totalBenefitsValue = healthSubsidyAnnual + match401kAnnual + ptoMonetaryValue;
    const totalCompValue = annualTakeHomeCash + healthSubsidyAnnual + match401kAnnual;

    return {
      grossSalary: salary,
      filingStatus,
      standardDeduction: stdDeduction,
      federalTaxableIncome: taxableIncome,
      taxes: {
        socialSecurity: Math.round(ssTax),
        medicare: Math.round(medTax),
        additionalMedicare: Math.round(addlMedTax),
        totalFica: Math.round(employeeFica),
        federalTax: Math.round(federalTax),
        stateTax: Math.round(stateTax),
        totalTaxes: Math.round(totalTaxes),
        effectiveTaxRatePercent: Math.round((totalTaxes / (salary || 1)) * 1000) / 10
      },
      benefits: {
        healthSubsidyAnnual: Math.round(healthSubsidyAnnual),
        match401kAnnual: Math.round(match401kAnnual),
        ptoDays,
        ptoMonetaryValue: Math.round(ptoMonetaryValue),
        employerFicaMatch: Math.round(employerFicaMatch),
        totalBenefitsValue: Math.round(totalBenefitsValue)
      },
      cashFlow: {
        annualTakeHomeCash: Math.round(annualTakeHomeCash),
        monthlyTakeHomeCash: Math.round(monthlyTakeHomeCash),
        biweeklyTakeHomeCash: Math.round(annualTakeHomeCash / 26),
        totalCompensation: Math.round(totalCompValue)
      }
    };
  }

  static calculate1099(options = {}) {
    const hourlyRate = Math.max(0, Number(options.hourlyRate !== undefined ? options.hourlyRate : 85));
    const hoursPerWeek = Math.max(1, Number(options.hoursPerWeek || 40));
    const weeksPerYear = Math.max(1, Number(options.weeksPerYear || 48));
    const annualExpenses = Math.max(0, Number(options.annualExpenses !== undefined ? options.annualExpenses : 6000));
    const filingStatus = options.filingStatus === "mfj" ? "mfj" : "single";
    const stateTaxRate = Number(options.stateTaxRatePercent !== undefined ? options.stateTaxRatePercent : 5.0) / 100;
    const eligibleQBI = options.eligibleQBI !== false;
    const selfFundedHealth = Math.max(0, Number(options.selfFundedHealthAnnual !== undefined ? options.selfFundedHealthAnnual : 7200));

    const totalHours = hoursPerWeek * weeksPerYear;
    const grossRevenue = hourlyRate * totalHours;
    const netScheduleCProfit = Math.max(0, grossRevenue - annualExpenses);

    const cfg = this.TAX_CONFIG_2024;
    const stdDeduction = filingStatus === "mfj" ? cfg.standardDeductionMFJ : cfg.standardDeductionSingle;
    const addlMedThreshold = filingStatus === "mfj" ? cfg.additionalMedicareThresholdMFJ : cfg.additionalMedicareThresholdSingle;

    const secaBase = netScheduleCProfit * 0.9235;
    const ssSETax = Math.min(secaBase, cfg.socialSecurityWageCap) * cfg.socialSecuritySelfEmployedRate;
    const medSETax = secaBase * cfg.medicareSelfEmployedRate;
    const addlMedSETax = Math.max(0, secaBase - addlMedThreshold) * cfg.additionalMedicareTaxRate;
    const totalSETax = ssSETax + medSETax + addlMedSETax;

    const halfSEDeduction = totalSETax * 0.5;
    const agi = Math.max(0, netScheduleCProfit - halfSEDeduction - selfFundedHealth);

    let qbiDeduction = 0;
    if (eligibleQBI && netScheduleCProfit > 0) {
      const qbiBase = Math.max(0, netScheduleCProfit - halfSEDeduction - selfFundedHealth);
      const taxableBeforeQBI = Math.max(0, agi - stdDeduction);
      const tentativeQBI = Math.min(qbiBase, taxableBeforeQBI) * cfg.qbiDeductionRate;

      const phase = filingStatus === "mfj" ? cfg.qbiPhaseOutMFJ : cfg.qbiPhaseOutSingle;
      if (taxableBeforeQBI <= phase.start) {
        qbiDeduction = tentativeQBI;
      } else if (taxableBeforeQBI >= phase.end) {
        qbiDeduction = 0;
      } else {
        const phaseOutPercent = (taxableBeforeQBI - phase.start) / (phase.end - phase.start);
        qbiDeduction = tentativeQBI * (1 - phaseOutPercent);
      }
    }

    const taxableIncome = Math.max(0, agi - stdDeduction - qbiDeduction);
    const brackets = filingStatus === "mfj" ? cfg.federalBracketsMFJ : cfg.federalBracketsSingle;
    const federalTax = this.calculateProgressiveTax(taxableIncome, brackets);
    const stateTax = Math.round(taxableIncome * stateTaxRate * 100) / 100;

    const totalTaxes = totalSETax + federalTax + stateTax;
    const annualNetSpendableCash = netScheduleCProfit - totalSETax - federalTax - stateTax - selfFundedHealth;
    const monthlyNetSpendableCash = annualNetSpendableCash / 12;

    return {
      hourlyRate,
      hoursPerWeek,
      weeksPerYear,
      totalBillableHours: totalHours,
      grossRevenue: Math.round(grossRevenue),
      annualExpenses: Math.round(annualExpenses),
      netScheduleCProfit: Math.round(netScheduleCProfit),
      filingStatus,
      taxes: {
        socialSecuritySE: Math.round(ssSETax),
        medicareSE: Math.round(medSETax),
        additionalMedicareSE: Math.round(addlMedSETax),
        totalSETax: Math.round(totalSETax),
        federalTax: Math.round(federalTax),
        stateTax: Math.round(stateTax),
        totalTaxes: Math.round(totalTaxes),
        effectiveTaxRatePercent: Math.round((totalTaxes / (grossRevenue || 1)) * 1000) / 10
      },
      deductions: {
        halfSETax: Math.round(halfSEDeduction),
        selfFundedHealth: Math.round(selfFundedHealth),
        standardDeduction: Math.round(stdDeduction),
        qbiDeduction: Math.round(qbiDeduction),
        totalDeductions: Math.round(halfSEDeduction + selfFundedHealth + stdDeduction + qbiDeduction)
      },
      cashFlow: {
        annualNetSpendableCash: Math.round(annualNetSpendableCash),
        monthlyNetSpendableCash: Math.round(monthlyNetSpendableCash),
        biweeklyNetSpendableCash: Math.round(annualNetSpendableCash / 26)
      }
    };
  }

  static solveBreakevenRate(w2Result, contractorParams = {}, matchTotalComp = false) {
    const targetNetCash = matchTotalComp
      ? w2Result.cashFlow.totalCompensation
      : w2Result.cashFlow.annualTakeHomeCash;

    let low = 10;
    let high = 500;
    let solvedRate = low;

    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const cSim = this.calculate1099({
        ...contractorParams,
        hourlyRate: mid
      });

      if (cSim.cashFlow.annualNetSpendableCash >= targetNetCash) {
        solvedRate = mid;
        high = mid;
      } else {
        low = mid;
      }
    }

    return Math.round(solvedRate * 100) / 100;
  }

  static calculateParity(w2Params = {}, contractorParams = {}) {
    const w2 = this.calculateW2(w2Params);
    const contractor = this.calculate1099(contractorParams);

    const breakevenCash = this.solveBreakevenRate(w2, contractorParams, false);
    const breakevenTotalComp = this.solveBreakevenRate(w2, contractorParams, true);

    const diffAnnual = contractor.cashFlow.annualNetSpendableCash - w2.cashFlow.annualTakeHomeCash;
    const diffMonthly = Math.round(diffAnnual / 12);
    const percentDiff = Math.round((diffAnnual / (w2.cashFlow.annualTakeHomeCash || 1)) * 100);

    const is1099Winner = diffAnnual > 0;
    const isTie = Math.abs(diffAnnual) <= 50;

    let winner = "tie";
    let winnerTitle = "Exact Financial Parity";
    let headline = "Both offers yield virtually identical take-home cash.";

    if (!isTie) {
      if (is1099Winner) {
        winner = "1099";
        winnerTitle = "1099 Contractor Offer Wins";
        headline = `The 1099 contractor offer yields +$${Math.abs(diffMonthly).toLocaleString()}/month (+${Math.abs(percentDiff)}%) more spendable cash!`;
      } else {
        winner = "w2";
        winnerTitle = "W-2 Salaried Offer Wins";
        headline = `The W-2 salaried offer yields +$${Math.abs(diffMonthly).toLocaleString()}/month (+${Math.abs(percentDiff)}%) more spendable cash.`;
      }
    }

    return {
      w2,
      contractor,
      verdict: {
        winner,
        winnerTitle,
        diffAnnual: Math.round(diffAnnual),
        diffMonthly,
        percentDiff,
        is1099Winner,
        breakevenHourlyRateCash: breakevenCash,
        breakevenHourlyRateTotalComp: breakevenTotalComp,
        equivalentRuleOfThumbHourly: Math.round((w2.grossSalary / 2080 * 1.35) * 100) / 100,
        headline
      }
    };
  }
}
