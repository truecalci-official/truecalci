/**
 * TrueCalci Global Finance & Consumer Calculation Engine
 * Engineered for international users: US, Europe, UK, and Global markets.
 * Algorithms:
 * 1. US & Global Mortgage (PITI: Principal, Interest, Property Tax, Insurance & PMI)
 * 2. European & International VAT / Sales Tax (Add & Remove Tax with EU/UK/US presets)
 * 3. Tip & Restaurant Bill Splitter (Per-guest share and customizable tipping)
 * 4. Global Compound Interest & Wealth Simulator (401k / ISA / ETF savings plans)
 */

export class GlobalFinanceEngine {
  /**
   * 1. US & International Mortgage Calculator with PITI & PMI
   * @param {Object} params
   * @param {number} params.homePrice - Total purchase price
   * @param {number} params.downPaymentPercent - Down payment percentage (e.g. 20)
   * @param {number} params.interestRate - Annual interest rate in % (e.g. 6.75)
   * @param {number} params.tenureYears - Loan duration (e.g. 30 or 15)
   * @param {number} [params.propertyTaxRatePercent=1.2] - Annual property tax rate in %
   * @param {number} [params.annualHomeInsurance=1500] - Annual home insurance in currency
   * @param {number} [params.annualPmiPercent=0.75] - Annual PMI % applied if down payment < 20%
   */
  static calculateMortgagePITI({
    homePrice,
    downPaymentPercent = 20,
    interestRate,
    tenureYears,
    loanTermYears,
    propertyTaxRatePercent = 1.2,
    annualHomeInsurance = 1500,
    annualPmiPercent = 0.75
  }) {
    const effectiveTenure = Number(tenureYears || loanTermYears || 30);
    const downPayment = homePrice * (downPaymentPercent / 100);
    const principal = Math.max(0, homePrice - downPayment);
    const totalMonths = effectiveTenure * 12;
    const monthlyRate = (interestRate / 100) / 12;

    // Monthly Principal & Interest (P&I)
    let monthlyPI = 0;
    if (monthlyRate > 0 && totalMonths > 0) {
      monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                  (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else if (totalMonths > 0) {
      monthlyPI = principal / totalMonths;
    }

    // Monthly Property Tax
    const annualPropertyTax = homePrice * (propertyTaxRatePercent / 100);
    const monthlyPropertyTax = annualPropertyTax / 12;

    // Monthly Homeowners Insurance
    const monthlyHomeInsurance = annualHomeInsurance / 12;

    // Monthly PMI (Private Mortgage Insurance) - required in the US if down payment is < 20%
    const isPmiRequired = downPaymentPercent < 20;
    const annualPmi = isPmiRequired ? principal * (annualPmiPercent / 100) : 0;
    const monthlyPmi = annualPmi / 12;

    // Total Monthly Payment (PITI)
    const monthlyTotalPITI = monthlyPI + monthlyPropertyTax + monthlyHomeInsurance + monthlyPmi;

    // Total Lifetime Aggregates
    const totalPIPaid = monthlyPI * totalMonths;
    const totalInterest = Math.max(0, totalPIPaid - principal);
    const totalTaxPaid = annualPropertyTax * tenureYears;
    const totalInsurancePaid = annualHomeInsurance * tenureYears;
    // PMI typically cancels once 20% equity is reached; for conservative estimation, estimate up to 20% equity or 5 years
    const estimatedPmiYears = isPmiRequired ? Math.min(tenureYears, 7) : 0;
    const totalPmiPaid = annualPmi * estimatedPmiYears;
    const totalCostOfLoan = downPayment + totalPIPaid + totalTaxPaid + totalInsurancePaid + totalPmiPaid;

    // Generate Year-by-Year Amortization Schedule
    const yearlySchedule = [];
    let currentBalance = principal;
    let cumInterest = 0;
    let cumPrincipal = 0;

    for (let year = 1; year <= tenureYears; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let m = 1; m <= 12; m++) {
        if (currentBalance <= 0) break;
        const interestMonth = currentBalance * monthlyRate;
        const principalMonth = Math.min(currentBalance, monthlyPI - interestMonth);
        yearlyInterest += interestMonth;
        yearlyPrincipal += principalMonth;
        currentBalance = Math.max(0, currentBalance - principalMonth);
      }

      cumInterest += yearlyInterest;
      cumPrincipal += yearlyPrincipal;

      yearlySchedule.push({
        year,
        yearlyPrincipal: Math.round(yearlyPrincipal),
        yearlyInterest: Math.round(yearlyInterest),
        endingBalance: Math.round(currentBalance),
        cumPrincipal: Math.round(cumPrincipal),
        cumInterest: Math.round(cumInterest)
      });
    }

    return {
      homePrice,
      tenureYears: effectiveTenure,
      loanTermYears: effectiveTenure,
      downPayment: Math.round(downPayment),
      principal: Math.round(principal),
      monthlyPI: Math.round(monthlyPI),
      monthlyPropertyTax: Math.round(monthlyPropertyTax),
      monthlyHomeInsurance: Math.round(monthlyHomeInsurance),
      monthlyPmi: Math.round(monthlyPmi),
      monthlyTotalPITI: Math.round(monthlyTotalPITI),
      isPmiRequired,
      totalInterest: Math.round(totalInterest),
      totalTaxPaid: Math.round(totalTaxPaid),
      totalInsurancePaid: Math.round(totalInsurancePaid),
      totalPmiPaid: Math.round(totalPmiPaid),
      totalCostOfLoan: Math.round(totalCostOfLoan),
      yearlySchedule
    };
  }

  /**
   * 2. European & International VAT / Sales Tax Calculator
   * Supports both Adding VAT (Net -> Gross) and Removing VAT (Gross -> Net)
   * @param {Object} params
   * @param {number} params.amount - Base currency amount
   * @param {number} params.vatRatePercent - VAT or Sales tax rate % (e.g. 20 for UK, 19 for Germany)
   * @param {'add'|'remove'} [params.mode='add'] - Add tax to net, or remove tax from gross
   */
  static calculateVAT({ amount, vatRatePercent, mode = 'add' }) {
    let netAmount = 0;
    let vatAmount = 0;
    let grossAmount = 0;

    if (mode === 'add') {
      netAmount = amount;
      vatAmount = amount * (vatRatePercent / 100);
      grossAmount = netAmount + vatAmount;
    } else {
      grossAmount = amount;
      netAmount = grossAmount / (1 + vatRatePercent / 100);
      vatAmount = grossAmount - netAmount;
    }

    return {
      mode,
      rate: vatRatePercent,
      netAmount: Number(netAmount.toFixed(2)),
      vatAmount: Number(vatAmount.toFixed(2)),
      grossAmount: Number(grossAmount.toFixed(2))
    };
  }

  /**
   * Standard International Tax Presets
   */
  static getVATPresets() {
    return [
      { country: "United Kingdom", flag: "🇬🇧", standard: 20, reduced: 5, label: "UK VAT (20% / 5%)" },
      { country: "Germany", flag: "🇩🇪", standard: 19, reduced: 7, label: "Germany MwSt (19% / 7%)" },
      { country: "France", flag: "🇫🇷", standard: 20, reduced: 10, label: "France TVA (20% / 10%)" },
      { country: "Spain", flag: "🇪🇸", standard: 21, reduced: 10, label: "Spain IVA (21% / 10%)" },
      { country: "Italy", flag: "🇮🇹", standard: 22, reduced: 10, label: "Italy IVA (22% / 10%)" },
      { country: "United States", flag: "🇺🇸", standard: 7.25, reduced: 0, label: "US Avg Sales Tax (7.25%)" },
      { country: "Canada", flag: "🇨🇦", standard: 13, reduced: 5, label: "Canada HST / GST (13% / 5%)" },
      { country: "Australia", flag: "🇦🇺", standard: 10, reduced: 0, label: "Australia GST (10%)" }
    ];
  }

  /**
   * 3. Tip & Restaurant Bill Splitter
   * @param {Object} params
   * @param {number} params.billAmount - Total pre-tip bill
   * @param {number} params.tipPercent - Tip percentage (e.g. 15, 18, 20, 25)
   * @param {number} [params.numberOfGuests=1] - Number of people splitting the bill
   */
  static calculateTip({ billAmount, tipPercent, numberOfGuests = 1 }) {
    const guests = Math.max(1, Math.floor(numberOfGuests));
    const tipAmount = billAmount * (tipPercent / 100);
    const totalWithTip = billAmount + tipAmount;

    const billPerPerson = billAmount / guests;
    const tipPerPerson = tipAmount / guests;
    const totalPerPerson = totalWithTip / guests;

    return {
      billAmount: Number(billAmount.toFixed(2)),
      tipPercent,
      numberOfGuests: guests,
      tipAmount: Number(tipAmount.toFixed(2)),
      totalWithTip: Number(totalWithTip.toFixed(2)),
      billPerPerson: Number(billPerPerson.toFixed(2)),
      tipPerPerson: Number(tipPerPerson.toFixed(2)),
      totalPerPerson: Number(totalPerPerson.toFixed(2))
    };
  }

  /**
   * 4. Global Compound Interest & Wealth Simulator (401k, ISA, ETF Savings Plans)
   * @param {Object} params
   * @param {number} params.principal - Initial lump sum deposit
   * @param {number} params.monthlyDeposit - Recurring monthly contribution
   * @param {number} params.annualRatePercent - Expected annual return %
   * @param {number} params.tenureYears - Investment horizon in years
   * @param {number} [params.compoundingFrequency=12] - Compounding times per year (12 = monthly, 1 = annually)
   */
  static calculateCompoundWealth({
    principal = 0,
    monthlyDeposit = 0,
    annualRatePercent = 8,
    tenureYears = 10,
    compoundingFrequency = 12
  }) {
    const r = annualRatePercent / 100;
    const n = compoundingFrequency;
    const totalMonths = tenureYears * 12;

    const yearlySchedule = [];
    let currentBalance = principal;
    let totalDeposited = principal;

    for (let year = 1; year <= tenureYears; year++) {
      let startingYearBalance = currentBalance;
      let yearlyContributions = monthlyDeposit * 12;

      for (let m = 1; m <= 12; m++) {
        currentBalance += monthlyDeposit;
        // Monthly compounding slice
        currentBalance *= (1 + r / n);
      }

      totalDeposited += yearlyContributions;
      const totalGain = currentBalance - totalDeposited;

      yearlySchedule.push({
        year,
        totalDeposited: Math.round(totalDeposited),
        interestEarned: Math.round(totalGain),
        endingBalance: Math.round(currentBalance)
      });
    }

    const futureValue = currentBalance;
    const totalInterest = futureValue - totalDeposited;

    return {
      principal: Math.round(principal),
      totalDeposited: Math.round(totalDeposited),
      futureValue: Math.round(futureValue),
      totalInterest: Math.round(totalInterest),
      yearlySchedule
    };
  }

  /**
   * 5. Net Present Value (NPV) & Internal Rate of Return (IRR) Solver
   * Deterministic Newton-Raphson polynomial convergence for capital budgeting & investment appraisal.
   * @param {Object} params
   * @param {number} params.initialInvestment - Outflow at t=0 (positive number)
   * @param {number[]} params.cashflows - Inflows for each subsequent period
   * @param {number} [params.discountRatePercent=10] - Annual hurdle / discount rate in %
   */
  static calculateNpvIrr({ initialInvestment, cashflows = [], discountRatePercent = 10 }) {
    const c0 = Math.abs(Number(initialInvestment || 0));
    const flows = Array.isArray(cashflows) ? cashflows.map(Number) : [];
    const r = (Number(discountRatePercent) || 0) / 100;
    const n = flows.length;

    // 1. Calculate NPV at hurdle discount rate
    let npv = -c0;
    let totalInflows = 0;
    let discountedInflows = 0;
    const schedule = [];
    let cumFlow = -c0;
    let cumDiscounted = -c0;
    let paybackYears = null;
    let discountedPaybackYears = null;

    for (let t = 1; t <= n; t++) {
      const flow = flows[t - 1];
      totalInflows += flow;
      const discountFactor = Math.pow(1 + r, t);
      const discountedFlow = flow / discountFactor;
      discountedInflows += discountedFlow;

      const prevCumFlow = cumFlow;
      cumFlow += flow;
      if (paybackYears === null && cumFlow >= 0) {
        // Linear interpolation for exact payback
        paybackYears = (t - 1) + (c0 - (prevCumFlow + c0)) / flow;
        paybackYears = Math.round(paybackYears * 100) / 100;
      }

      const prevCumDiscounted = cumDiscounted;
      cumDiscounted += discountedFlow;
      if (discountedPaybackYears === null && cumDiscounted >= 0) {
        discountedPaybackYears = (t - 1) + (-prevCumDiscounted) / discountedFlow;
        discountedPaybackYears = Math.round(discountedPaybackYears * 100) / 100;
      }

      schedule.push({
        period: t,
        cashflow: Math.round(flow * 100) / 100,
        discountFactor: Math.round(discountFactor * 10000) / 10000,
        discountedFlow: Math.round(discountedFlow * 100) / 100,
        cumulativeFlow: Math.round(cumFlow * 100) / 100,
        cumulativeDiscounted: Math.round(cumDiscounted * 100) / 100
      });
    }

    npv += discountedInflows;

    // 2. Solve IRR via Newton-Raphson
    // f(rate) = -c0 + sum(flows[t] / (1+rate)^t) = 0
    let irr = 0.1; // initial guess 10%
    const maxIter = 100;
    const tol = 1e-7;
    let converged = false;

    for (let iter = 0; iter < maxIter; iter++) {
      let fValue = -c0;
      let fPrime = 0;

      for (let t = 1; t <= n; t++) {
        const flow = flows[t - 1];
        const denom = Math.pow(1 + irr, t);
        fValue += flow / denom;
        fPrime -= (t * flow) / (denom * (1 + irr));
      }

      if (Math.abs(fPrime) < 1e-12) break;
      const nextIrr = irr - fValue / fPrime;
      if (Math.abs(nextIrr - irr) < tol) {
        irr = nextIrr;
        converged = true;
        break;
      }
      irr = nextIrr;
      if (irr < -0.999 || irr > 50) break; // divergence guard
    }

    const irrPercent = converged && !isNaN(irr) ? Math.round(irr * 10000) / 100 : null;
    const profitabilityIndex = c0 > 0 ? Math.round((discountedInflows / c0) * 1000) / 1000 : null;
    const netCashflow = Math.round((totalInflows - c0) * 100) / 100;

    return {
      initialInvestment: c0,
      totalInflows: Math.round(totalInflows * 100) / 100,
      netCashflow,
      discountRatePercent: Number(discountRatePercent),
      npv: Math.round(npv * 100) / 100,
      irrPercent,
      profitabilityIndex,
      paybackYears: paybackYears !== null ? paybackYears : (cumFlow >= 0 ? n : "N/A"),
      discountedPaybackYears: discountedPaybackYears !== null ? discountedPaybackYears : (cumDiscounted >= 0 ? n : "N/A"),
      isViable: npv > 0,
      schedule
    };
  }

  /**
   * 6. Compound Annual Growth Rate (CAGR) & Inflation-Adjusted Purchasing Power
   * Calculates nominal CAGR, real return (Fisher effect), and purchasing power retention.
   * @param {Object} params
   * @param {number} params.initialValue - Beginning asset valuation
   * @param {number} params.finalValue - Ending asset valuation
   * @param {number} params.periodsYears - Duration in years (can be fractional)
   * @param {number} [params.inflationRatePercent=2.5] - Average annualized inflation rate in %
   */
  static calculateCagrInflation({ initialValue, finalValue, periodsYears, inflationRatePercent = 2.5 }) {
    const v0 = Number(initialValue || 0);
    const vn = Number(finalValue || 0);
    const t = Number(periodsYears || 1);
    const infRate = (Number(inflationRatePercent) || 0) / 100;

    if (v0 <= 0 || t <= 0) {
      throw new Error("Initial value and periods in years must be positive numbers.");
    }

    // Nominal CAGR = (V_n / V_0)^(1 / t) - 1
    const nominalCagr = Math.pow(vn / v0, 1 / t) - 1;
    const nominalTotalReturnPercent = ((vn - v0) / v0) * 100;

    // Real CAGR via Fisher equation: (1 + r_nominal) / (1 + inflation) - 1
    const realCagr = ((1 + nominalCagr) / (1 + infRate)) - 1;

    // Purchasing Power adjusted final value
    const inflationDeflator = Math.pow(1 + infRate, t);
    const realPurchasingPowerValue = vn / inflationDeflator;
    const purchasingPowerLoss = vn - realPurchasingPowerValue;

    // Doubling Time (Rule of 72 & Exact ln(2)/ln(1+r))
    const exactDoublingYears = nominalCagr > 0 ? Math.round((Math.log(2) / Math.log(1 + nominalCagr)) * 100) / 100 : null;
    const ruleOf72Years = nominalCagr > 0 ? Math.round((72 / (nominalCagr * 100)) * 100) / 100 : null;

    // Year-by-year trajectory
    const trajectory = [];
    for (let yr = 0; yr <= Math.ceil(t); yr++) {
      const yearFraction = Math.min(yr, t);
      const projectedNominal = v0 * Math.pow(1 + nominalCagr, yearFraction);
      const projectedReal = projectedNominal / Math.pow(1 + infRate, yearFraction);
      trajectory.push({
        year: yr,
        nominalValue: Math.round(projectedNominal * 100) / 100,
        realValue: Math.round(projectedReal * 100) / 100
      });
    }

    return {
      initialValue: v0,
      finalValue: vn,
      periodsYears: t,
      nominalCagrPercent: Math.round(nominalCagr * 10000) / 100,
      nominalTotalReturnPercent: Math.round(nominalTotalReturnPercent * 100) / 100,
      inflationRatePercent: Number(inflationRatePercent),
      realCagrPercent: Math.round(realCagr * 10000) / 100,
      realPurchasingPowerValue: Math.round(realPurchasingPowerValue * 100) / 100,
      purchasingPowerLoss: Math.round(purchasingPowerLoss * 100) / 100,
      exactDoublingYears,
      ruleOf72Years,
      trajectory
    };
  }

  /**
   * 7. Break-Even Analysis & Margin of Safety Engine
   * Unit and revenue breakeven economics, contribution margins, and operating leverage.
   * @param {Object} params
   * @param {number} params.fixedCosts - Total fixed operating costs ($)
   * @param {number} params.unitPrice - Selling price per unit ($)
   * @param {number} params.unitVariableCost - Variable cost incurred per unit ($)
   * @param {number} [params.expectedUnitsSold=0] - Projected target unit sales volume
   */
  static calculateBreakEven({ fixedCosts, unitPrice, unitVariableCost, expectedUnitsSold = 0 }) {
    const fc = Math.max(0, Number(fixedCosts || 0));
    const p = Number(unitPrice || 0);
    const vc = Math.max(0, Number(unitVariableCost || 0));
    const expectedUnits = Math.max(0, Number(expectedUnitsSold || 0));

    if (p <= vc) {
      throw new Error("Unit selling price must be strictly greater than unit variable cost to achieve positive contribution margin.");
    }

    const unitContributionMargin = p - vc;
    const contributionMarginRatio = unitContributionMargin / p;
    const breakEvenUnits = Math.ceil(fc / unitContributionMargin);
    const breakEvenRevenue = Math.round((breakEvenUnits * p) * 100) / 100;

    let marginOfSafetyUnits = 0;
    let marginOfSafetyRevenue = 0;
    let marginOfSafetyPercent = 0;
    let expectedProfit = 0;
    let degreeOfOperatingLeverage = null;

    if (expectedUnits > 0) {
      const expectedRevenue = expectedUnits * p;
      expectedProfit = Math.round(((expectedUnits * unitContributionMargin) - fc) * 100) / 100;
      if (expectedUnits >= breakEvenUnits) {
        marginOfSafetyUnits = expectedUnits - breakEvenUnits;
        marginOfSafetyRevenue = Math.round((marginOfSafetyUnits * p) * 100) / 100;
        marginOfSafetyPercent = Math.round((marginOfSafetyUnits / expectedUnits) * 10000) / 100;
      }
      if (expectedProfit > 0) {
        const totalContribution = expectedUnits * unitContributionMargin;
        degreeOfOperatingLeverage = Math.round((totalContribution / expectedProfit) * 100) / 100;
      }
    }

    return {
      fixedCosts: fc,
      unitPrice: p,
      unitVariableCost: vc,
      unitContributionMargin: Math.round(unitContributionMargin * 100) / 100,
      contributionMarginRatioPercent: Math.round(contributionMarginRatio * 10000) / 100,
      breakEvenUnits,
      breakEvenRevenue,
      expectedUnitsSold: expectedUnits,
      expectedProfit,
      marginOfSafetyUnits,
      marginOfSafetyRevenue,
      marginOfSafetyPercent,
      degreeOfOperatingLeverage
    };
  }

  /**
   * 8. Universal Number & Currency Formatter
   * Handles International ($ 1,000,000.00), European (1.000.000,00 €), and Indian (₹ 10,00,000.00)
   */
  static formatNumber(value, { locale = 'en-US', currency = 'USD', decimals = 2 } = {}) {
    if (isNaN(value) || value === null || value === undefined) return "0";
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value);
    } catch {
      return Number(value).toLocaleString();
    }
  }
}

