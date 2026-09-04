/**
 * RemoteParity - Solo 401(k) vs. SEP-IRA Tax Shield Engine
 * Calculates Maximum Pre-Tax Deductions and Marginal Tax Relief Under IRS Notice 2023-75
 */

export class RetirementEngine {
  static LIMITS_2024 = {
    employeeDeferralLimit: 23000,
    catchUpAge50PlusLimit: 7500,
    totalPlanMaxLimit: 69000,
    totalPlanMaxAge50Plus: 76500,
    employerMaxPercentCorp: 0.25,        // 25% of W-2 salary
    employerMaxPercentUnincorporated: 0.20 // 20% of adjusted net profit
  };

  static calculate(options = {}) {
    const netEarnings = Math.max(0, Number(options.netEarnings !== undefined ? options.netEarnings : 120000));
    const isCorp = options.entityType === "scorp"; // S-Corp W-2 vs Sole Prop / LLC
    const isAge50Plus = options.isAge50Plus === true;
    const marginalTaxRate = Math.min(60, Math.max(0, Number(options.marginalTaxRatePercent !== undefined ? options.marginalTaxRatePercent : 28))) / 100;

    const limits = this.LIMITS_2024;
    const employeeCap = limits.employeeDeferralLimit + (isAge50Plus ? limits.catchUpAge50PlusLimit : 0);
    const overallCap = isAge50Plus ? limits.totalPlanMaxAge50Plus : limits.totalPlanMaxLimit;

    let planCompensation = netEarnings;
    if (!isCorp) {
      // Unincorporated: Plan compensation is Net Profit minus 1/2 of SECA tax
      const secaBase = netEarnings * 0.9235;
      const ssTax = Math.min(secaBase, 168600) * 0.124;
      const medTax = secaBase * 0.029;
      const halfSeca = (ssTax + medTax) * 0.5;
      planCompensation = Math.max(0, netEarnings - halfSeca);
    }

    // 1. SEP-IRA Calculations (Employer-only contribution)
    const sepEmployerRate = isCorp ? limits.employerMaxPercentCorp : limits.employerMaxPercentUnincorporated;
    const sepMaxDeduction = Math.min(limits.totalPlanMaxLimit, planCompensation * sepEmployerRate);
    const sepTaxSavings = Math.round(sepMaxDeduction * marginalTaxRate);

    // 2. Solo 401(k) Calculations (Employee Deferral + Employer Profit Share)
    const soloEmployeeContribution = Math.min(planCompensation, employeeCap);
    const soloEmployerMax = Math.min(limits.totalPlanMaxLimit, planCompensation * sepEmployerRate);
    const soloCombinedTentative = soloEmployeeContribution + soloEmployerMax;
    const soloMaxDeduction = Math.min(overallCap, Math.min(planCompensation, soloCombinedTentative));
    const soloTaxSavings = Math.round(soloMaxDeduction * marginalTaxRate);

    // 3. Delta Advantage
    const extraShelter = Math.max(0, soloMaxDeduction - sepMaxDeduction);
    const extraTaxCashSaved = Math.round(extraShelter * marginalTaxRate);

    return {
      netEarnings,
      planCompensation: Math.round(planCompensation),
      entityType: isCorp ? "S-Corporation" : "Sole Proprietor / LLC",
      isAge50Plus,
      marginalTaxRatePercent: Math.round(marginalTaxRate * 100),
      sepIra: {
        maxContribution: Math.round(sepMaxDeduction),
        immediateTaxSavings: sepTaxSavings,
        allowsCatchUp: false,
        allowsEmployeeDeferral: false,
        allowsRothOption: false,
        allowsLoans: false
      },
      solo401k: {
        employeeDeferral: Math.round(soloEmployeeContribution),
        employerProfitShare: Math.round(soloMaxDeduction - soloEmployeeContribution),
        maxContribution: Math.round(soloMaxDeduction),
        immediateTaxSavings: soloTaxSavings,
        allowsCatchUp: true,
        allowsEmployeeDeferral: true,
        allowsRothOption: true,
        allowsLoans: true, // Up to $50,000 loan
        loanLimit: Math.min(50000, Math.round(soloMaxDeduction * 0.5))
      },
      comparison: {
        extraShelter: Math.round(extraShelter),
        extraTaxCashSaved,
        winner: extraShelter > 0 ? "Solo 401(k)" : "Tie",
        headline: extraShelter > 0
          ? `Solo 401(k) shields an additional +$${Math.round(extraShelter).toLocaleString()} from taxes, putting +$${extraTaxCashSaved.toLocaleString()} directly back into your checking account!`
          : "Both plans provide equivalent shelter at this income tier."
      }
    };
  }
}
