/**
 * RemoteParity - Global Invoicing & Cross-Border FX Net Receipt Engine
 * Real-Time Fee Deconstruction Across Global Payment Rails (Wise, Deel, Stripe, Payoneer, PayPal, SWIFT)
 */

export class FXInvoicingEngine {
  static CURRENCY_BENCHMARKS = {
    EUR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
    GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
    CAD: { code: "CAD", symbol: "CA$", name: "Canadian Dollar", rate: 1.36 },
    AUD: { code: "AUD", symbol: "AU$", name: "Australian Dollar", rate: 1.52 },
    INR: { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.50 },
    SGD: { code: "SGD", symbol: "SG$", name: "Singapore Dollar", rate: 1.35 },
    BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real", rate: 5.45 },
    MXN: { code: "MXN", symbol: "Mex$", name: "Mexican Peso", rate: 18.20 },
    PHP: { code: "PHP", symbol: "₱", name: "Philippine Peso", rate: 58.60 }
  };

  static RAILS_CONFIG = [
    {
      key: "wise",
      name: "Wise Business",
      fixedFeeUsd: 0.00,
      percentageFee: 0.0055, // 0.55%
      fxMarkupPercent: 0.00,  // True mid-market rate
      description: "Direct local payout at guaranteed mid-market exchange rate with transparent transfer fee."
    },
    {
      key: "deel",
      name: "Deel Contractor Wallet",
      fixedFeeUsd: 0.00,
      percentageFee: 0.015,  // 1.50%
      fxMarkupPercent: 0.005, // 0.50% FX spread
      description: "Contractor management platform wallet withdrawal into local currency account."
    },
    {
      key: "payoneer",
      name: "Payoneer Global Transfer",
      fixedFeeUsd: 1.50,
      percentageFee: 0.020,  // 2.00%
      fxMarkupPercent: 0.010, // 1.00% FX spread
      description: "Payoneer multi-currency virtual account withdrawal to local bank."
    },
    {
      key: "stripe",
      name: "Stripe International Invoicing",
      fixedFeeUsd: 0.30,
      percentageFee: 0.039,  // 2.9% + 1.0% international
      fxMarkupPercent: 0.015, // 1.50% conversion fee
      description: "Client pays via credit card invoice; funds settled internationally in recipient's local bank."
    },
    {
      key: "swift",
      name: "International SWIFT Wire",
      fixedFeeUsd: 45.00,    // $25 sender + $20 intermediary correspondent bank
      percentageFee: 0.00,
      fxMarkupPercent: 0.025, // 2.50% destination bank retail FX markup
      description: "Direct commercial wire transfer routing through intermediary correspondent banking networks."
    },
    {
      key: "paypal",
      name: "PayPal Commercial Payout",
      fixedFeeUsd: 0.30,
      percentageFee: 0.0449, // 4.49% international commercial
      fxMarkupPercent: 0.035, // 3.50% retail FX conversion markup
      description: "Standard PayPal international cross-border merchant receipt."
    }
  ];

  static calculate(options = {}) {
    const invoiceUsd = Math.max(10, Number(options.invoiceUsd !== undefined ? options.invoiceUsd : 10000));
    const targetCurrency = options.targetCurrency && this.CURRENCY_BENCHMARKS[options.targetCurrency]
      ? options.targetCurrency
      : "EUR";
    const curInfo = this.CURRENCY_BENCHMARKS[targetCurrency];
    const midMarketRate = curInfo.rate;

    const theoreticalMaxLocal = invoiceUsd * midMarketRate;

    const results = this.RAILS_CONFIG.map(rail => {
      const netUsdAfterPlatform = Math.max(0, (invoiceUsd - rail.fixedFeeUsd) * (1 - rail.percentageFee));
      const effectiveFxRate = midMarketRate * (1 - rail.fxMarkupPercent);
      const landedLocalAmount = Math.round(netUsdAfterPlatform * effectiveFxRate * 100) / 100;
      const equivalentUsdReceived = Math.round((landedLocalAmount / midMarketRate) * 100) / 100;
      const totalLossUsd = Math.round((invoiceUsd - equivalentUsdReceived) * 100) / 100;
      const totalDragPercent = Math.round((totalLossUsd / invoiceUsd) * 1000) / 10;

      return {
        key: rail.key,
        name: rail.name,
        description: rail.description,
        landedLocalAmount,
        currencySymbol: curInfo.symbol,
        currencyCode: curInfo.code,
        equivalentUsdReceived,
        totalLossUsd,
        totalDragPercent
      };
    });

    // Sort by best landed amount (highest first)
    results.sort((a, b) => b.landedLocalAmount - a.landedLocalAmount);

    const optimalRail = results[0];
    const worstRail = results[results.length - 1];
    const singleInvoiceSavingsUsd = Math.round(worstRail.totalLossUsd - optimalRail.totalLossUsd);
    const annualSavingsUsd = singleInvoiceSavingsUsd * 12;

    return {
      invoiceUsd,
      targetCurrency: curInfo,
      midMarketBenchmarkRate: midMarketRate,
      theoreticalMaxLocal: Math.round(theoreticalMaxLocal * 100) / 100,
      optimalRail,
      worstRail,
      singleInvoiceSavingsUsd,
      annualSavingsUsd,
      rails: results,
      headline: `Using ${optimalRail.name} saves +$${singleInvoiceSavingsUsd.toLocaleString()} per invoice (+$${annualSavingsUsd.toLocaleString()}/year) compared to ${worstRail.name}!`
    };
  }
}
