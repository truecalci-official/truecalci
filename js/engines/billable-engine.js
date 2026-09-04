/**
 * RemoteParity - Billable Hourly Rate Floor & Burn-Rate Engine
 * Solves the True Minimum Hourly Rate Required to Net a Target Cash Income
 * Accounts for 47 Working Weeks, 25-35% Non-Billable Administrative Buffer, Taxes & Expenses
 */

import { ParityEngine } from "./parity-engine.js";

export class BillableRateEngine {
  static calculate(options = {}) {
    const targetNetCash = Math.max(10000, Number(options.targetNetCash !== undefined ? options.targetNetCash : 120000));
    const annualExpenses = Math.max(0, Number(options.annualExpenses !== undefined ? options.annualExpenses : 8000));
    const healthInsuranceAnnual = Math.max(0, Number(options.healthInsuranceAnnual !== undefined ? options.healthInsuranceAnnual : 7200));
    const vacationWeeks = Math.max(0, Math.min(15, Number(options.vacationWeeks !== undefined ? options.vacationWeeks : 4)));
    const sickHolidayWeeks = Math.max(0, Math.min(8, Number(options.sickHolidayWeeks !== undefined ? options.sickHolidayWeeks : 1.5)));
    const nominalHoursPerWeek = Math.max(10, Math.min(60, Number(options.nominalHoursPerWeek !== undefined ? options.nominalHoursPerWeek : 40)));
    const nonBillablePercent = Math.max(5, Math.min(60, Number(options.nonBillablePercent !== undefined ? options.nonBillablePercent : 28))) / 100;
    const filingStatus = options.filingStatus === "mfj" ? "mfj" : "single";
    const stateTaxRatePercent = Number(options.stateTaxRatePercent !== undefined ? options.stateTaxRatePercent : 5.0);

    // Working time calculation
    const workingWeeks = Math.max(1, 52 - vacationWeeks - sickHolidayWeeks);
    const billableHoursPerWeek = Math.round(nominalHoursPerWeek * (1 - nonBillablePercent) * 10) / 10;
    const nonBillableHoursPerWeek = Math.round((nominalHoursPerWeek - billableHoursPerWeek) * 10) / 10;
    const annualBillableHours = Math.round(workingWeeks * billableHoursPerWeek);

    // Naive Calculation (Target / 2,080 hours)
    const naiveRate = Math.round((targetNetCash / 2080) * 100) / 100;

    // Binary Search to solve exact gross hourly rate needed
    let low = 5;
    const grossNeededApprox = (targetNetCash + annualExpenses + healthInsuranceAnnual) * 1.6;
    let high = Math.max(1200, Math.ceil((grossNeededApprox * 2) / Math.max(100, annualBillableHours)));
    let solvedRate = high;

    for (let i = 0; i < 50; i++) {
      const mid = (low + high) / 2;
      const sim1099 = ParityEngine.calculate1099({
        hourlyRate: mid,
        hoursPerWeek: billableHoursPerWeek,
        weeksPerYear: workingWeeks,
        annualExpenses,
        filingStatus,
        stateTaxRatePercent,
        eligibleQBI: true,
        selfFundedHealthAnnual: healthInsuranceAnnual
      });

      if (sim1099.cashFlow.annualNetSpendableCash >= targetNetCash) {
        solvedRate = mid;
        high = mid;
      } else {
        low = mid;
      }
    }

    const optimalHourlyRate = Math.round(solvedRate * 100) / 100;

    // Run exact simulation at the solved rate
    const finalSim = ParityEngine.calculate1099({
      hourlyRate: optimalHourlyRate,
      hoursPerWeek: billableHoursPerWeek,
      weeksPerYear: workingWeeks,
      annualExpenses,
      filingStatus,
      stateTaxRatePercent,
      eligibleQBI: true,
      selfFundedHealthAnnual: healthInsuranceAnnual
    });

    const naiveSim = ParityEngine.calculate1099({
      hourlyRate: naiveRate,
      hoursPerWeek: billableHoursPerWeek,
      weeksPerYear: workingWeeks,
      annualExpenses,
      filingStatus,
      stateTaxRatePercent,
      eligibleQBI: true,
      selfFundedHealthAnnual: healthInsuranceAnnual
    });

    const naiveShortfall = Math.max(0, targetNetCash - naiveSim.cashFlow.annualNetSpendableCash);

    return {
      targetNetCash,
      optimalHourlyRate,
      naiveRate,
      naiveShortfall: Math.round(naiveShortfall),
      timeAllocation: {
        workingWeeks: Math.round(workingWeeks * 10) / 10,
        weeksOff: Math.round((vacationWeeks + sickHolidayWeeks) * 10) / 10,
        nominalHoursPerWeek,
        billableHoursPerWeek,
        nonBillableHoursPerWeek,
        nonBillablePercent: Math.round(nonBillablePercent * 100),
        annualBillableHours
      },
      economics: {
        requiredGrossBilling: finalSim.grossRevenue,
        annualExpenses,
        healthInsuranceAnnual,
        totalTaxes: finalSim.taxes.totalTaxes,
        actualNetSpendableCash: finalSim.cashFlow.annualNetSpendableCash
      },
      headline: `To take home $${targetNetCash.toLocaleString()} in net cash, your minimum billing floor is $${optimalHourlyRate.toFixed(2)}/hr (based on ${annualBillableHours} realistic billable hours).`
    };
  }
}
