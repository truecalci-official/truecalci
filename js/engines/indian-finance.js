/**
 * Indian Personal Finance & Household Mathematical Engines
 * Precise calculations conforming to Indian financial standards (₹ Lakhs/Crores, Section 87A, Reducing Balance EMI).
 */

export class IndianFinanceEngine {
  /**
   * Format number in Indian numbering format (e.g., ₹12,75,000)
   */
  static formatINR(val, includeSymbol = true) {
    if (isNaN(val) || val === null) return includeSymbol ? "₹0" : "0";
    const rounded = Math.round(val);
    const str = Math.abs(rounded).toString();
    let result = "";
    
    if (str.length > 3) {
      const lastThree = str.substring(str.length - 3);
      const otherNumbers = str.substring(0, str.length - 3);
      result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
    } else {
      result = str;
    }

    if (rounded < 0) result = "-" + result;
    return includeSymbol ? `₹${result}` : result;
  }

  /**
   * Format to Indian descriptive units (e.g. ₹1.25 L, ₹2.50 Cr)
   */
  static formatCompactINR(val) {
    if (isNaN(val)) return "₹0";
    const abs = Math.abs(val);
    const sign = val < 0 ? "-" : "";
    if (abs >= 10000000) {
      return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
    } else if (abs >= 100000) {
      return `${sign}₹${(abs / 100000).toFixed(2)} L`;
    } else if (abs >= 1000) {
      return `${sign}₹${(abs / 1000).toFixed(1)} K`;
    }
    return `${sign}₹${Math.round(abs)}`;
  }

  // =========================================================================
  // 1. Income Tax Calculator (Union Budget 2025-26 & 2026-27 Slabs)
  // =========================================================================
  static calculateIncomeTax({ grossIncome, isSalaried = true, deductions80C = 0, deductions80D = 0, hraExemption = 0, otherDeductions = 0 }) {
    // New Tax Regime (Budget 2025-26)
    const stdDeductionNew = isSalaried ? 75000 : 0;
    const taxableNew = Math.max(0, grossIncome - stdDeductionNew);
    
    let taxNew = 0;
    const newSlabs = [
      { min: 0, max: 400000, rate: 0.00 },
      { min: 400000, max: 800000, rate: 0.05 },
      { min: 800000, max: 1200000, rate: 0.10 },
      { min: 1200000, max: 1600000, rate: 0.15 },
      { min: 1600000, max: 2000000, rate: 0.20 },
      { min: 2000000, max: 2400000, rate: 0.25 },
      { min: 2400000, max: Infinity, rate: 0.30 }
    ];

    for (const slab of newSlabs) {
      if (taxableNew > slab.min) {
        const taxableChunk = Math.min(taxableNew, slab.max) - slab.min;
        taxNew += taxableChunk * slab.rate;
      }
    }

    // Section 87A Rebate for New Regime: Income up to ₹12 Lakhs gets rebate up to ₹60,000
    let rebate87ANew = 0;
    if (taxableNew <= 1200000) {
      rebate87ANew = Math.min(taxNew, 60000);
      taxNew = Math.max(0, taxNew - rebate87ANew);
    }

    // Statutory Surcharge under New Tax Regime:
    // ₹50L - ₹1Cr: 10%, ₹1Cr - ₹2Cr: 15%, >₹2Cr: 25%
    let surchargeNew = 0;
    if (taxableNew > 20000000) {
      surchargeNew = taxNew * 0.25;
    } else if (taxableNew > 10000000) {
      surchargeNew = taxNew * 0.15;
    } else if (taxableNew > 5000000) {
      surchargeNew = taxNew * 0.10;
    }
    const cessNew = (taxNew + surchargeNew) * 0.04;
    const totalTaxNew = Math.round(taxNew + surchargeNew + cessNew);

    // Old Tax Regime
    const stdDeductionOld = isSalaried ? 50000 : 0;
    const capped80C = Math.min(deductions80C, 150000);
    const totalOldDeductions = stdDeductionOld + capped80C + deductions80D + hraExemption + otherDeductions;
    const taxableOld = Math.max(0, grossIncome - totalOldDeductions);

    let taxOld = 0;
    const oldSlabs = [
      { min: 0, max: 250000, rate: 0.00 },
      { min: 250000, max: 500000, rate: 0.05 },
      { min: 500000, max: 1000000, rate: 0.20 },
      { min: 1000000, max: Infinity, rate: 0.30 }
    ];

    for (const slab of oldSlabs) {
      if (taxableOld > slab.min) {
        const taxableChunk = Math.min(taxableOld, slab.max) - slab.min;
        taxOld += taxableChunk * slab.rate;
      }
    }

    // Section 87A Rebate for Old Regime: Income up to ₹5 Lakhs gets rebate up to ₹12,500
    let rebate87AOld = 0;
    if (taxableOld <= 500000) {
      rebate87AOld = Math.min(taxOld, 12500);
      taxOld = Math.max(0, taxOld - rebate87AOld);
    }

    // Statutory Surcharge under Old Tax Regime:
    let surchargeOld = 0;
    if (taxableOld > 50000000) {
      surchargeOld = taxOld * 0.37;
    } else if (taxableOld > 20000000) {
      surchargeOld = taxOld * 0.25;
    } else if (taxableOld > 10000000) {
      surchargeOld = taxOld * 0.15;
    } else if (taxableOld > 5000000) {
      surchargeOld = taxOld * 0.10;
    }
    const cessOld = (taxOld + surchargeOld) * 0.04;
    const totalTaxOld = Math.round(taxOld + surchargeOld + cessOld);

    const taxSavings = totalTaxOld - totalTaxNew;
    const recommendedRegime = totalTaxNew <= totalTaxOld ? "New Tax Regime" : "Old Tax Regime";

    return {
      grossIncome,
      newRegime: {
        standardDeduction: stdDeductionNew,
        taxableIncome: taxableNew,
        grossTax: taxNew + rebate87ANew,
        rebate87A: rebate87ANew,
        surchargeAmount: Math.round(surchargeNew),
        cess: Math.round(cessNew),
        totalTax: totalTaxNew
      },
      oldRegime: {
        totalDeductions: totalOldDeductions,
        taxableIncome: taxableOld,
        grossTax: taxOld + rebate87AOld,
        rebate87A: rebate87AOld,
        surchargeAmount: Math.round(surchargeOld),
        cess: Math.round(cessOld),
        totalTax: totalTaxOld
      },
      taxSavings: Math.abs(taxSavings),
      recommendedRegime
    };
  }

  // =========================================================================
  // 2. SIP & Step-Up SIP Calculator
  // =========================================================================
  static calculateSIP({ monthlyInvestment, annualReturnRate, tenureYears, stepUpPercent = 0 }) {
    const months = tenureYears * 12;
    const monthlyRate = annualReturnRate / 12 / 100;
    
    let totalInvested = 0;
    let maturityValue = 0;
    const yearlyBreakdown = [];

    let currentSIP = monthlyInvestment;
    let accumulatedValue = 0;
    let accumulatedInvested = 0;

    for (let yr = 1; yr <= tenureYears; yr++) {
      let yearInvestment = 0;
      for (let m = 1; m <= 12; m++) {
        accumulatedInvested += currentSIP;
        yearInvestment += currentSIP;
        accumulatedValue = (accumulatedValue + currentSIP) * (1 + monthlyRate);
      }
      totalInvested = accumulatedInvested;
      maturityValue = accumulatedValue;
      
      yearlyBreakdown.push({
        year: yr,
        monthlySIP: Math.round(currentSIP),
        investedThisYear: Math.round(yearInvestment),
        totalInvested: Math.round(accumulatedInvested),
        totalWealth: Math.round(accumulatedValue),
        wealthGain: Math.round(accumulatedValue - accumulatedInvested)
      });

      if (stepUpPercent > 0) {
        currentSIP = currentSIP * (1 + stepUpPercent / 100);
      }
    }

    const estimatedReturns = Math.max(0, maturityValue - totalInvested);

    return {
      monthlyInvestment,
      annualReturnRate,
      tenureYears,
      stepUpPercent,
      totalInvested: Math.round(totalInvested),
      estimatedReturns: Math.round(estimatedReturns),
      maturityValue: Math.round(maturityValue),
      yearlyBreakdown
    };
  }

  // =========================================================================
  // 3. Home Loan / EMI Calculator & Amortization Schedule
  // =========================================================================
  static calculateHomeLoan({ principal, annualInterestRate, tenureYears, prepaymentMonthly = 0, lumpSumPrepayment = 0, lumpSumMonth = 12 }) {
    const totalMonths = tenureYears * 12;
    const r = annualInterestRate / 12 / 100;
    
    // Standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const factor = Math.pow(1 + r, totalMonths);
    const standardEMI = Math.round((principal * r * factor) / (factor - 1));

    // Calculate Amortization with optional prepayments
    let balance = principal;
    let totalInterestPaid = 0;
    let totalPaid = 0;
    const monthlySchedule = [];
    const yearlySchedule = [];

    let currentYearPrincipal = 0;
    let currentYearInterest = 0;
    let actualMonths = 0;

    for (let m = 1; m <= totalMonths && balance > 0; m++) {
      actualMonths = m;
      const interestForMonth = balance * r;
      let principalForMonth = standardEMI - interestForMonth;
      
      let extraPaid = prepaymentMonthly;
      if (m === lumpSumMonth) {
        extraPaid += lumpSumPrepayment;
      }

      if (principalForMonth + extraPaid >= balance) {
        principalForMonth = balance;
        extraPaid = 0;
        balance = 0;
      } else {
        balance = balance - principalForMonth - extraPaid;
      }

      totalInterestPaid += interestForMonth;
      totalPaid += (principalForMonth + interestForMonth + extraPaid);
      currentYearPrincipal += (principalForMonth + extraPaid);
      currentYearInterest += interestForMonth;

      if (m <= 36 || m % 12 === 0 || balance === 0) {
        monthlySchedule.push({
          month: m,
          principalPaid: Math.round(principalForMonth + extraPaid),
          interestPaid: Math.round(interestForMonth),
          totalPayment: Math.round(principalForMonth + interestForMonth + extraPaid),
          remainingBalance: Math.round(balance)
        });
      }

      if (m % 12 === 0 || balance === 0) {
        yearlySchedule.push({
          year: Math.ceil(m / 12),
          principalPaid: Math.round(currentYearPrincipal),
          interestPaid: Math.round(currentYearInterest),
          totalPayment: Math.round(currentYearPrincipal + currentYearInterest),
          remainingBalance: Math.round(balance)
        });
        currentYearPrincipal = 0;
        currentYearInterest = 0;
      }
    }

    // Baseline comparison without prepayment
    const baselineTotalInterest = (standardEMI * totalMonths) - principal;
    const interestSaved = Math.max(0, baselineTotalInterest - totalInterestPaid);
    const monthsSaved = Math.max(0, totalMonths - actualMonths);

    return {
      principal,
      annualInterestRate,
      tenureYears,
      monthlyEMI: standardEMI,
      totalInterest: Math.round(totalInterestPaid),
      totalAmount: Math.round(totalPaid),
      interestSaved: Math.round(interestSaved),
      tenureReducedYears: (monthsSaved / 12).toFixed(1),
      actualMonths,
      monthlySchedule,
      yearlySchedule
    };
  }

  // =========================================================================
  // 4. Indian Gold & Jewellery Billing Calculator
  // =========================================================================
  static calculateGoldJewellery({ weightGrams, base24KRatePerGram, purityKarat = 22, makingChargesType = "percent", makingChargesValue = 10, includeHallmark = true }) {
    // Purity ratio
    const purityMultiplier = purityKarat / 24;
    const goldRatePerGram = base24KRatePerGram * purityMultiplier;
    const rawGoldValue = weightGrams * goldRatePerGram;

    // Making charges
    let makingCharges = 0;
    if (makingChargesType === "percent") {
      makingCharges = rawGoldValue * (makingChargesValue / 100);
    } else {
      // Fixed per gram
      makingCharges = weightGrams * makingChargesValue;
    }

    const hallmarkFee = includeHallmark ? 45 : 0; // ₹45 statutory BIS hallmark charge
    const subtotal = rawGoldValue + makingCharges + hallmarkFee;
    const gstRate = 0.03; // 3% GST on jewellery in India
    const gstAmount = subtotal * gstRate;
    const finalBillingAmount = subtotal + gstAmount;

    return {
      weightGrams,
      purityKarat,
      purityPercent: (purityMultiplier * 100).toFixed(1),
      goldRatePerGram: Math.round(goldRatePerGram),
      rawGoldValue: Math.round(rawGoldValue),
      makingCharges: Math.round(makingCharges),
      hallmarkFee,
      subtotal: Math.round(subtotal),
      gstAmount: Math.round(gstAmount),
      finalBillingAmount: Math.round(finalBillingAmount),
      effectivePricePerGram: Math.round(finalBillingAmount / weightGrams)
    };
  }

  // =========================================================================
  // 5. PPF (Public Provident Fund - 7.1% statutory)
  // =========================================================================
  static calculatePPF({ yearlyDeposit, annualInterestRate = 7.1, tenureYears = 15 }) {
    const cappedDeposit = Math.min(yearlyDeposit, 150000);
    let balance = 0;
    let totalInvested = 0;
    const schedule = [];

    for (let yr = 1; yr <= tenureYears; yr++) {
      totalInvested += cappedDeposit;
      // Compounded annually at year end (assuming deposit before 5th April)
      const interestForYear = (balance + cappedDeposit) * (annualInterestRate / 100);
      balance = balance + cappedDeposit + interestForYear;

      schedule.push({
        year: yr,
        deposit: cappedDeposit,
        totalInvested: Math.round(totalInvested),
        interestEarned: Math.round(interestForYear),
        closingBalance: Math.round(balance)
      });
    }

    return {
      yearlyDeposit: cappedDeposit,
      tenureYears,
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(balance - totalInvested),
      maturityAmount: Math.round(balance),
      schedule
    };
  }

  // =========================================================================
  // 6. Sukanya Samriddhi Yojana (SSY - 8.2% statutory)
  // =========================================================================
  static calculateSSY({ yearlyDeposit, annualInterestRate = 8.2 }) {
    const depositYears = 15; // Mandatory deposits for 15 years
    const totalMaturityYears = 21; // Matures after 21 years
    let balance = 0;
    let totalInvested = 0;
    const schedule = [];

    for (let yr = 1; yr <= totalMaturityYears; yr++) {
      const deposit = yr <= depositYears ? Math.min(yearlyDeposit, 150000) : 0;
      totalInvested += deposit;
      const interestForYear = (balance + deposit) * (annualInterestRate / 100);
      balance = balance + deposit + interestForYear;

      schedule.push({
        year: yr,
        deposit,
        totalInvested: Math.round(totalInvested),
        interestEarned: Math.round(interestForYear),
        closingBalance: Math.round(balance)
      });
    }

    return {
      yearlyDeposit,
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(balance - totalInvested),
      maturityAmount: Math.round(balance),
      schedule
    };
  }

  // =========================================================================
  // 7. Fixed Deposit (FD) - Indian Bank Quarterly Compounding
  // =========================================================================
  static calculateFD({ principal, interestRate, tenureYears, payoutType = "cumulative" }) {
    if (payoutType === "cumulative") {
      // Compounded quarterly: A = P * (1 + r/4)^(4*t)
      const n = 4;
      const maturityAmount = principal * Math.pow(1 + (interestRate / 100) / n, n * tenureYears);
      return {
        principal,
        interestRate,
        tenureYears,
        maturityAmount: Math.round(maturityAmount),
        totalInterest: Math.round(maturityAmount - principal),
        payoutType
      };
    } else {
      // Monthly / Quarterly Payout (Simple Interest periodic)
      const annualInterest = principal * (interestRate / 100);
      const monthlyPayout = annualInterest / 12;
      const totalInterest = annualInterest * tenureYears;
      return {
        principal,
        interestRate,
        tenureYears,
        maturityAmount: principal,
        monthlyPayout: Math.round(monthlyPayout),
        totalInterest: Math.round(totalInterest),
        payoutType
      };
    }
  }

  // =========================================================================
  // 8. GST Calculator (India 5%, 12%, 18%, 28%)
  // =========================================================================
  static calculateGST({ amount, gstRatePercent, type = "exclusive" }) {
    let baseAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (type === "exclusive") {
      // Add GST
      baseAmount = amount;
      gstAmount = amount * (gstRatePercent / 100);
      totalAmount = baseAmount + gstAmount;
    } else {
      // Remove GST (Inclusive)
      totalAmount = amount;
      baseAmount = totalAmount / (1 + (gstRatePercent / 100));
      gstAmount = totalAmount - baseAmount;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    return {
      type,
      gstRatePercent,
      baseAmount: Math.round(baseAmount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100
    };
  }

  // =========================================================================
  // 9. Indian Land Area Unit Converter
  // =========================================================================
  static convertLandArea(value, fromUnit, toUnit) {
    // Standard square feet equivalents
    const sqftFactors = {
      sqft: 1,
      sqm: 10.7639,
      gaj: 9, // 1 Gaj (Square Yard) = 9 Sq Ft
      guntha: 1089, // 1 Guntha = 121 Sq Yards = 1,089 Sq Ft
      acre: 43560, // 1 Acre = 4,840 Sq Yards = 43,560 Sq Ft
      bigha_standard: 27225, // 3,025 Sq Yards = 27,225 Sq Ft
      bigha_kaccha: 9075, // Kaccha Bigha (North India) = 9,075 Sq Ft
      cent: 435.6, // South India Cent = 435.6 Sq Ft
      katha: 720, // 720 Sq Ft (UP/Bihar)
      hectare: 107639 // 1 Hectare = 2.471 Acres
    };

    if (!sqftFactors[fromUnit] || !sqftFactors[toUnit]) return 0;
    const valueInSqFt = value * sqftFactors[fromUnit];
    return valueInSqFt / sqftFactors[toUnit];
  }
}
