/**
 * TrueCalci FinOps & Cloud Architecture Deterministic Compute Engines
 * 
 * 1. ai_token_arbitrage: Multi-model AI token pricing matrix, prompt caching discount, batch savings
 * 2. startup_runway_dilution: Post-Money SAFE, Series A option pool shuffle, burn rate, zero-cash date
 * 3. b2b_withholding_risk: Form W-8BEN/W-8BEN-E 30% statutory vs treaty rates, gross-up, 183-day PE trigger
 * 4. feie_nomad_tracker: IRS Form 2555 physical presence 330-day test, statutory cap ($130k), CA/NY sticky domicile
 * 5. cloud_egress_finops: Multi-cloud egress tiers, Zero-Egress R2 & CDN proxy cost reduction
 */

export class FinOpsEngine {
  // ---------------------------------------------------------------------------
  // 1. AI Token Arbitrage Engine
  // ---------------------------------------------------------------------------
  static calculateAiTokenArbitrage(params = {}) {
    const promptTokens = Math.max(0, Number(params.promptTokens ?? 5000));
    const completionTokens = Math.max(0, Number(params.completionTokens ?? 1000));
    const rawCacheHit = Number(params.cacheHitRatio ?? 0.80);
    const cacheHitRatio = Math.min(1, Math.max(0, rawCacheHit > 1 ? rawCacheHit / 100 : rawCacheHit));
    const isBatch = params.isBatch === true || params.isBatch === "true";

    const models = {
      "claude-3-5-sonnet": { name: "Claude 3.5 Sonnet", provider: "Anthropic", prompt: 3.00, completion: 15.00, cacheRead: 0.30, batchDiscount: 0.50 },
      "gpt-4o": { name: "GPT-4o", provider: "OpenAI", prompt: 2.50, completion: 10.00, cacheRead: 1.25, batchDiscount: 0.50 },
      "deepseek-v3": { name: "DeepSeek V3", provider: "DeepSeek", prompt: 0.14, completion: 0.28, cacheRead: 0.014, batchDiscount: 0.50 },
      "deepseek-r1": { name: "DeepSeek R1 (Reasoning)", provider: "DeepSeek", prompt: 0.55, completion: 2.19, cacheRead: 0.14, batchDiscount: 0.50 },
      "gemini-1-5-pro": { name: "Gemini 1.5 Pro", provider: "Google", prompt: 1.25, completion: 5.00, cacheRead: 0.3125, batchDiscount: 0.50 },
      "gemini-1-5-flash": { name: "Gemini 1.5 Flash", provider: "Google", prompt: 0.075, completion: 0.30, cacheRead: 0.01875, batchDiscount: 0.50 }
    };

    const matrix = {};
    let minCost = Infinity;
    let minModel = "";
    let maxCost = 0;
    let maxModel = "";

    for (const [key, p] of Object.entries(models)) {
      const cachedTokens = promptTokens * cacheHitRatio;
      const uncachedTokens = promptTokens * (1 - cacheHitRatio);

      let costPerCall = (
        (cachedTokens * p.cacheRead) +
        (uncachedTokens * p.prompt) +
        (completionTokens * p.completion)
      ) / 1_000_000;

      const uncachedPerCall = (
        (promptTokens * p.prompt) +
        (completionTokens * p.completion)
      ) / 1_000_000;

      if (isBatch) costPerCall *= (1 - p.batchDiscount);

      const cacheSavingsPct = uncachedPerCall > 0 ? ((uncachedPerCall - costPerCall) / uncachedPerCall) * 100 : 0;
      const costPer1k = costPerCall * 1000;
      const costPer1M = costPerCall * 1_000_000;

      matrix[key] = {
        model: p.name,
        provider: p.provider,
        costPerCallUsd: Number(costPerCall.toFixed(6)),
        costPer1kCallsUsd: Number(costPer1k.toFixed(4)),
        costPerMillionCallsUsd: Math.round(costPer1M * 100) / 100,
        uncachedCostPerCallUsd: Number(uncachedPerCall.toFixed(6)),
        cacheSavingsPercent: Math.round(cacheSavingsPct * 10) / 10
      };

      if (costPerCall < minCost) { minCost = costPerCall; minModel = p.name; }
      if (costPerCall > maxCost) { maxCost = costPerCall; maxModel = p.name; }
    }

    const disparityMultiplier = minCost > 0 ? Number((maxCost / minCost).toFixed(1)) : 1;
    const monthlyBenchmarkCalls = 100_000;
    const potentialMonthlySavings = Math.round((maxCost - minCost) * monthlyBenchmarkCalls);

    return {
      engine: "ai_token_arbitrage",
      inputs: { promptTokens, completionTokens, cacheHitRatio, isBatch },
      matrix,
      arbitrage: {
        cheapestModel: minModel,
        mostExpensiveModel: maxModel,
        disparityMultiplier: `${disparityMultiplier}x`,
        monthlySavingsAt100kCallsUsd: potentialMonthlySavings,
        verdict: `Optimizing model tier and prompt caching reduces token spend by up to ${disparityMultiplier}x.`
      }
    };
  }

  // ---------------------------------------------------------------------------
  // 2. Startup Runway & Dilution Solver
  // ---------------------------------------------------------------------------
  static calculateStartupRunwayDilution(params = {}) {
    const cashOnHand = Math.max(0, Number(params.cashOnHand ?? 750000));
    const monthlyGrossBurn = Math.max(0, Number(params.monthlyGrossBurn ?? 65000));
    const monthlyRevenue = Math.max(0, Number(params.monthlyRevenue ?? 15000));

    const safeInvestment = Math.max(0, Number(params.safeInvestment ?? 1000000));
    const postMoneyCap = Math.max(1, Number(params.postMoneyCap ?? 10000000));

    const seriesAInvestment = Math.max(0, Number(params.seriesAInvestment ?? 3000000));
    const seriesAPreMoney = Math.max(1, Number(params.seriesAPreMoney ?? 15000000));
    const rawPool = Number(params.optionPoolExpansionPercent ?? 10);
    const optionPoolPct = Math.min(100, Math.max(0, rawPool > 1 ? rawPool / 100 : rawPool));

    const netBurn = Math.max(0, monthlyGrossBurn - monthlyRevenue);
    const runwayMonths = netBurn > 0 ? Number((cashOnHand / netBurn).toFixed(1)) : 999;
    const daysRemaining = Math.round(runwayMonths * 30.4375);
    const zeroCashDate = netBurn > 0
      ? new Date(Date.now() + daysRemaining * 86400000).toISOString().split('T')[0]
      : "Cashflow Positive";

    // Post-Money SAFE Ownership
    const safeOwnership = Math.min(1, safeInvestment / postMoneyCap);

    // Series A Dilution
    const seriesAPost = seriesAPreMoney + seriesAInvestment;
    const seriesAOwnership = Math.min(1, seriesAInvestment / seriesAPost);

    // Retained Founder Equity through waterfall including unallocated option pool shuffle
    const founderRetainedFraction = (1 - safeOwnership) * (1 - seriesAOwnership) * (1 - optionPoolPct);
    const optionPoolDilutionLossPct = Number(((1 - (1 - optionPoolPct)) * (1 - safeOwnership) * (1 - seriesAOwnership) * 100).toFixed(2));

    return {
      engine: "startup_runway_dilution",
      runway: {
        cashOnHandUsd: cashOnHand,
        monthlyGrossBurnUsd: monthlyGrossBurn,
        monthlyRevenueUsd: monthlyRevenue,
        monthlyNetBurnUsd: netBurn,
        runwayMonths,
        zeroCashDate
      },
      capTableDilution: {
        safeOwnershipPercent: Number((safeOwnership * 100).toFixed(2)),
        seriesAOwnershipPercent: Number((seriesAOwnership * 100).toFixed(2)),
        unallocatedOptionPoolPercent: Number((optionPoolPct * 100).toFixed(2)),
        founderRetainedPercent: Number((founderRetainedFraction * 100).toFixed(2)),
        optionPoolShuffleImpactPercent: optionPoolDilutionLossPct
      }
    };
  }

  // ---------------------------------------------------------------------------
  // 3. Global B2B Withholding Tax & Permanent Establishment Risk Solver
  // ---------------------------------------------------------------------------
  static calculateB2bWithholdingRisk(params = {}) {
    const invoiceNetRequired = Math.max(0, Number(params.invoiceNetRequired ?? 50000));
    const rawStat = Number(params.statutoryRatePercent ?? 30.0);
    const statutoryRate = Math.min(0.99, Math.max(0, rawStat > 1 ? rawStat / 100 : rawStat));

    const rawTreaty = Number(params.treatyRatePercent ?? 15.0);
    const treatyRate = Math.min(0.99, Math.max(0, rawTreaty > 1 ? rawTreaty / 100 : rawTreaty));

    const daysInCountry = Math.max(0, Number(params.daysInCountry ?? 195));
    const peThresholdDays = 183;

    // Gross-up calculation: Gross = Net / (1 - WHT)
    const grossStatutory = invoiceNetRequired / (1 - statutoryRate);
    const grossTreaty = invoiceNetRequired / (1 - treatyRate);
    const statutoryTaxWithheld = grossStatutory - invoiceNetRequired;
    const treatyTaxWithheld = grossTreaty - invoiceNetRequired;
    const taxSavingsFromTreaty = statutoryTaxWithheld - treatyTaxWithheld;

    const peTriggered = daysInCountry > peThresholdDays;
    const peRiskStatus = peTriggered ? "CRITICAL_PE_RISK" : "COMPLIANT_NO_PE_TRIGGER";
    const daysRemainingBeforePe = Math.max(0, peThresholdDays - daysInCountry);

    return {
      engine: "b2b_withholding_risk",
      netPaymentTargetUsd: invoiceNetRequired,
      grossInvoicing: {
        grossWithoutTreatyUsd: Math.round(grossStatutory),
        grossWithTreatyUsd: Math.round(grossTreaty),
        statutoryTaxWithheldUsd: Math.round(statutoryTaxWithheld),
        treatyTaxWithheldUsd: Math.round(treatyTaxWithheld),
        instantTreatySavingsUsd: Math.round(taxSavingsFromTreaty)
      },
      permanentEstablishment: {
        daysInCountry,
        peThresholdDays,
        daysRemainingBeforePe,
        status: peRiskStatus,
        warning: peTriggered
          ? `WARNING: Presence of ${daysInCountry} days exceeds 183-day international treaty threshold. Significant corporate income tax and payroll audit risk.`
          : `Safe: ${daysRemainingBeforePe} days remaining before 183-day PE trigger.`
      }
    };
  }

  // ---------------------------------------------------------------------------
  // 4. IRS Form 2555 FEIE Digital Nomad Tracker
  // ---------------------------------------------------------------------------
  static calculateFeieNomadTracker(params = {}) {
    const foreignEarnedIncome = Math.max(0, Number(params.foreignEarnedIncome ?? 160000));
    const daysOutsideUS = Math.max(0, Number(params.daysOutsideUSInRollingPeriod ?? 334));
    const taxYear = Number(params.taxYear || 2025);
    const stateDomicile = String(params.stateDomicile || "CA").toUpperCase();
    const rawMarginal = Number(params.effectiveTaxBracketPercent ?? 24.0);
    const marginalRate = Math.min(1, Math.max(0, rawMarginal > 1 ? rawMarginal / 100 : rawMarginal));

    const statutoryCaps = {
      2024: 126500,
      2025: 130000,
      2026: 133000
    };
    const cap = statutoryCaps[taxYear] || 130000;

    const qualifiesPhysicalPresence = daysOutsideUS >= 330;
    const maxExclusionClaimable = qualifiesPhysicalPresence ? Math.min(foreignEarnedIncome, cap) : 0;
    const taxableFederalIncomeRemainder = foreignEarnedIncome - maxExclusionClaimable;
    const federalTaxSavingsEst = Math.round(maxExclusionClaimable * marginalRate);

    const stickyStates = ["CA", "NY", "VA", "SC"];
    const isStickyDomicile = stickyStates.includes(stateDomicile);

    return {
      engine: "feie_nomad_tracker",
      physicalPresenceTest: {
        daysOutsideUS,
        statutoryRequirementDays: 330,
        qualifies: qualifiesPhysicalPresence,
        deficitDays: Math.max(0, 330 - daysOutsideUS)
      },
      federalExclusion: {
        taxYear,
        statutoryCapUsd: cap,
        foreignEarnedIncomeUsd: foreignEarnedIncome,
        excludedAmountUsd: maxExclusionClaimable,
        taxableRemainderUsd: taxableFederalIncomeRemainder,
        estimatedFederalTaxSavingsUsd: federalTaxSavingsEst
      },
      stateAuditRisk: {
        stateDomicile,
        isStickyDomicile,
        riskLevel: isStickyDomicile ? "HIGH_STICKY_DOMICILE_AUDIT_RISK" : "NORMAL",
        advisory: isStickyDomicile
          ? `State of ${stateDomicile} does not honor federal FEIE exclusion. Full global earnings are taxed unless legal domicile is formally terminated.`
          : `State of ${stateDomicile} adheres to standard residency rules.`
      }
    };
  }

  // ---------------------------------------------------------------------------
  // 5. Cloud Egress & Interconnect Cost Engine
  // ---------------------------------------------------------------------------
  static calculateCloudEgressFinOps(params = {}) {
    const monthlyEgressGB = Math.max(0, Number(params.monthlyEgressGB ?? 50000));
    const rawCache = Number(params.cacheHitRatio ?? 0.85);
    const cacheHitRatio = Math.min(1, Math.max(0, rawCache > 1 ? rawCache / 100 : rawCache));

    // AWS Direct Internet Egress Pricing (US East / West)
    // First 10 TB (10,000 GB): $0.09 / GB
    // Next 40 TB (40,000 GB): $0.085 / GB
    // Next 100 TB (100,000 GB): $0.07 / GB
    const t1 = Math.min(monthlyEgressGB, 10000) * 0.09;
    const t2 = Math.min(Math.max(0, monthlyEgressGB - 10000), 40000) * 0.085;
    const t3 = Math.max(0, monthlyEgressGB - 50000) * 0.07;
    const directCloudCost = t1 + t2 + t3;

    // Cloudflare Edge Proxy with Bandwidth Alliance & R2
    const uncachedGB = monthlyEgressGB * (1 - cacheHitRatio);
    const uc1 = Math.min(uncachedGB, 10000) * 0.09;
    const uc2 = Math.min(Math.max(0, uncachedGB - 10000), 40000) * 0.085;
    const uc3 = Math.max(0, uncachedGB - 50000) * 0.07;
    const workerFee = 5.00; // Cloudflare Workers Paid Plan ($5/mo)
    const costWithEdgeProxy = uc1 + uc2 + uc3 + workerFee;

    const monthlySavings = directCloudCost - costWithEdgeProxy;
    const savingsPercent = directCloudCost > 0 ? (monthlySavings / directCloudCost) * 100 : 0;

    return {
      engine: "cloud_egress_finops",
      bandwidth: {
        monthlyEgressGB,
        monthlyEgressTB: Number((monthlyEgressGB / 1000).toFixed(2)),
        edgeCacheHitRatioPercent: Number((cacheHitRatio * 100).toFixed(1))
      },
      economics: {
        directCloudProviderCostUsd: Math.round(directCloudCost),
        cloudflareEdgeProxyCostUsd: Math.round(costWithEdgeProxy),
        monthlySavingsUsd: Math.round(monthlySavings),
        annualProjectedSavingsUsd: Math.round(monthlySavings * 12),
        savingsPercentage: `${Math.round(savingsPercent)}%`
      }
    };
  }
}
