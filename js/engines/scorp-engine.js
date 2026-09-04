/**
 * RemoteParity - S-Corp vs. LLC Tax Optimization & Reasonable Salary Engine
 * Evaluates IRS Rev. Rul. 74-44 FICA Tax Shield vs. Administrative & CPA Overhead
 */

export class SCorpEngine {
  static TAX_CONFIG_2024 = {
    socialSecurityWageCap: 168600,
    socialSecurityRate: 0.124,
    medicareRate: 0.029,
    additionalMedicareThreshold: 200000,
    additionalMedicareRate: 0.009,
    typicalPayrollAnnualFee: 600, // Gusto / OnPay
    typicalCpa1120SFee: 1500,     // S-Corp corporate tax filing
    typicalStateFranchiseFee: 200 // Average state fee
  };

  /**
   * Suggests standard industry reasonable salary percentage based on net profit.
   * Benchmarked against IRS audit precedent and RCReports data.
   */
  static getSuggestedSalaryRatio(netProfit) {
    if (netProfit <= 80000) return 0.65; // 65% salary at lower profit
    if (netProfit <= 150000) return 0.55; // 55% salary at mid-tier
    if (netProfit <= 250000) return 0.50; // 50% salary at upper-tier
    return 0.45; // 45% salary above $250k
  }

  static calculate(options = {}) {
    const netProfit = Math.max(0, Number(options.netProfit !== undefined ? options.netProfit : 150000));
    const cfg = this.TAX_CONFIG_2024;

    // 1. LLC / Sole Proprietor Baseline
    const llcSecaBase = netProfit * 0.9235;
    const llcSS = Math.min(llcSecaBase, cfg.socialSecurityWageCap) * cfg.socialSecurityRate;
    const llcMed = llcSecaBase * cfg.medicareRate;
    const llcAddlMed = Math.max(0, llcSecaBase - cfg.additionalMedicareThreshold) * cfg.additionalMedicareRate;
    const totalLlcSecaTax = Math.round(llcSS + llcMed + llcAddlMed);

    // 2. S-Corporation Allocation
    const suggestedRatio = this.getSuggestedSalaryRatio(netProfit);
    const salaryPercent = Math.min(100, Math.max(20, Number(options.salaryPercent !== undefined ? options.salaryPercent : suggestedRatio * 100))) / 100;
    
    let w2Salary = Math.round(netProfit * salaryPercent);
    if (options.manualSalary !== undefined && Number(options.manualSalary) > 0) {
      w2Salary = Math.min(netProfit, Math.max(10000, Number(options.manualSalary)));
    }
    const k1Distribution = Math.max(0, netProfit - w2Salary);

    // S-Corp FICA (Payroll Taxes paid on Salary ONLY)
    const scorpSS = Math.min(w2Salary, cfg.socialSecurityWageCap) * cfg.socialSecurityRate;
    const scorpMed = w2Salary * cfg.medicareRate;
    const scorpAddlMed = Math.max(0, w2Salary - cfg.additionalMedicareThreshold) * cfg.additionalMedicareRate;
    const totalScorpFica = Math.round(scorpSS + scorpMed + scorpAddlMed);

    // 3. Gross FICA Tax Savings (Distributions are 100% exempt from 15.3% SECA)
    const grossFicaSavings = Math.max(0, totalLlcSecaTax - totalScorpFica);

    // 4. Annual S-Corp Compliance Overhead Costs
    const payrollFee = Number(options.payrollAnnualFee !== undefined ? options.payrollAnnualFee : cfg.typicalPayrollAnnualFee);
    const cpaFilingFee = Number(options.cpaAnnualFee !== undefined ? options.cpaAnnualFee : cfg.typicalCpa1120SFee);
    const stateFee = Number(options.stateAnnualFee !== undefined ? options.stateAnnualFee : cfg.typicalStateFranchiseFee);
    const totalOverhead = payrollFee + cpaFilingFee + stateFee;

    // 5. Net Annual Cash Savings
    const netAnnualSavings = grossFicaSavings - totalOverhead;
    const netMonthlySavings = Math.round(netAnnualSavings / 12);
    const isProfitable = netAnnualSavings > 0;

    // 6. Breakeven Profit Threshold Solver (Mathematical & Recommended)
    let breakevenProfit = 0;
    let recommendedProfit = 80000;
    for (let p = 30000; p <= 150000; p += 1000) {
      const simBase = p * 0.9235;
      const simLlc = (Math.min(simBase, cfg.socialSecurityWageCap) * cfg.socialSecurityRate) + (simBase * cfg.medicareRate);
      const simSal = p * 0.55;
      const simScorp = (Math.min(simSal, cfg.socialSecurityWageCap) * cfg.socialSecurityRate) + (simSal * cfg.medicareRate);
      if ((simLlc - simScorp) >= totalOverhead) {
        breakevenProfit = p;
        break;
      }
    }

    let verdict = "";
    let badge = "";
    if (netProfit < breakevenProfit) {
      badge = "Stay as Disregarded LLC";
      verdict = `At $${netProfit.toLocaleString()} profit, an S-Corp election is NOT recommended. S-Corp overhead ($${totalOverhead.toLocaleString()}/yr) outweighs the tax savings by $${Math.abs(netAnnualSavings).toLocaleString()}/yr. Remain a standard Sole Prop / LLC until your profit reaches ~$${breakevenProfit.toLocaleString()}.`;
    } else if (netProfit < recommendedProfit) {
      badge = "Marginal S-Corp Candidate";
      verdict = `At $${netProfit.toLocaleString()} profit, S-Corp yields a modest net saving of +$${netAnnualSavings.toLocaleString()}/yr. While mathematically profitable above $${breakevenProfit.toLocaleString()}, CPAs generally advise waiting until ~$${recommendedProfit.toLocaleString()} profit so the savings justify the administrative effort.`;
    } else if (netAnnualSavings > 4000) {
      badge = "Strong S-Corp Candidate";
      verdict = `Electing S-Corp status saves you +$${netAnnualSavings.toLocaleString()}/yr (+$${netMonthlySavings.toLocaleString()}/mo) in net cash after paying all CPA and payroll fees! Highly recommended.`;
    } else {
      badge = "Moderate S-Corp Candidate";
      verdict = `Electing S-Corp status yields a solid net saving of +$${netAnnualSavings.toLocaleString()}/yr.`;
    }

    return {
      netProfit,
      llc: {
        totalSecaTax: totalLlcSecaTax,
        effectiveSecaRatePercent: Math.round((totalLlcSecaTax / (netProfit || 1)) * 1000) / 10
      },
      scorp: {
        reasonableSalary: w2Salary,
        salaryRatioPercent: Math.round((w2Salary / (netProfit || 1)) * 100),
        k1Distribution,
        distributionRatioPercent: Math.round((k1Distribution / (netProfit || 1)) * 100),
        totalFicaTax: totalScorpFica,
        effectiveFicaRatePercent: Math.round((totalScorpFica / (netProfit || 1)) * 1000) / 10
      },
      overhead: {
        payrollFee,
        cpaFilingFee,
        stateFee,
        totalOverhead
      },
      savings: {
        grossFicaSavings,
        totalOverhead,
        netAnnualSavings,
        netMonthlySavings,
        isProfitable,
        breakevenProfitThreshold: breakevenProfit,
        recommendedProfitThreshold: recommendedProfit,
        badge,
        verdict
      }
    };
  }
}
