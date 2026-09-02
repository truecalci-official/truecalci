/**
 * TrueCalci Statistics, Data Science & Financial Options Engine
 * High-precision algorithms for analytical workflows and fintech AI agents.
 * 
 * 1. Descriptive Statistics & Dispersion Metrics
 * 2. Linear Regression (Ordinary Least Squares: Slope, Intercept, R², Correlation)
 * 3. Black-Scholes European Options Pricing Model with Greeks (Delta, Gamma, Vega, Theta)
 */

export class StatisticsOptionsEngine {
  /**
   * 1. Descriptive Statistics for a Numerical Dataset
   * @param {number[]} numbers - Array of real numbers
   */
  static calculateDescriptiveStats(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
      throw new Error("Input must be a non-empty array of numbers.");
    }

    const n = numbers.length;
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, v) => acc + v, 0);
    const mean = sum / n;

    // Median
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Variance and Standard Deviation
    const sqDiffs = numbers.map(v => Math.pow(v - mean, 2));
    const varianceSample = n > 1 ? sqDiffs.reduce((acc, v) => acc + v, 0) / (n - 1) : 0;
    const stdDevSample = Math.sqrt(varianceSample);

    return {
      count: n,
      sum: Number(sum.toFixed(4)),
      mean: Number(mean.toFixed(4)),
      median: Number(median.toFixed(4)),
      varianceSample: Number(varianceSample.toFixed(4)),
      stdDevSample: Number(stdDevSample.toFixed(4)),
      min: sorted[0],
      max: sorted[n - 1],
      range: sorted[n - 1] - sorted[0]
    };
  }

  /**
   * 2. Ordinary Least Squares (OLS) Linear Regression: y = m*x + c
   * @param {Array<{x: number, y: number}>} points - Coordinate pairs
   */
  static calculateLinearRegression(points) {
    if (!Array.isArray(points) || points.length < 2) {
      throw new Error("Linear regression requires at least 2 data points.");
    }

    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    for (const p of points) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
      sumY2 += p.y * p.y;
    }

    const denominator = (n * sumX2) - (sumX * sumX);
    if (denominator === 0) {
      throw new Error("Cannot calculate regression for perfectly vertical data points.");
    }

    const slope = ((n * sumXY) - (sumX * sumY)) / denominator;
    const intercept = (sumY - (slope * sumX)) / n;

    // Pearson Correlation r and R^2
    const numeratorR = (n * sumXY) - (sumX * sumY);
    const denominatorR = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
    const r = denominatorR !== 0 ? numeratorR / denominatorR : 0;
    const rSquared = Math.pow(r, 2);

    return {
      slope: Number(slope.toFixed(6)),
      intercept: Number(intercept.toFixed(6)),
      correlation_r: Number(r.toFixed(4)),
      rSquared: Number(rSquared.toFixed(4)),
      formula: `y = ${slope.toFixed(4)}·x + ${intercept.toFixed(4)} (R² = ${rSquared.toFixed(4)})`
    };
  }

  /**
   * Standard Normal Cumulative Distribution Function Phi(x)
   */
  static normalCDF(x) {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    const z = Math.abs(x) / Math.SQRT2;
    const t = 1.0 / (1.0 + p * z);
    const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    return 0.5 * (1.0 + sign * erf);
  }

  /**
   * Standard Normal Probability Density Function phi(x)
   */
  static normalPDF(x) {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
  }

  /**
   * 3. Black-Scholes European Option Pricing with Greeks
   * @param {Object} params
   * @param {number} params.stockPrice - Current underlying asset spot price S
   * @param {number} params.strikePrice - Option strike price K
   * @param {number} params.timeToExpiryYears - Time to expiration T in years (e.g. 0.5 for 6 months)
   * @param {number} params.riskFreeRatePercent - Annual risk-free interest rate r in % (e.g. 4.5)
   * @param {number} params.volatilityPercent - Annual implied volatility sigma in % (e.g. 25)
   */
  static calculateBlackScholes({
    stockPrice,
    strikePrice,
    timeToExpiryYears,
    riskFreeRatePercent,
    volatilityPercent
  }) {
    const S = Number(stockPrice);
    const K = Number(strikePrice);
    const T = Number(timeToExpiryYears);
    const r = Number(riskFreeRatePercent) / 100;
    const sigma = Number(volatilityPercent) / 100;

    if (S <= 0 || K <= 0 || T <= 0 || sigma <= 0) {
      throw new Error("Stock price, strike, time to expiry, and volatility must be positive numbers.");
    }

    const d1 = (Math.log(S / K) + (r + (Math.pow(sigma, 2) / 2)) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const Nd1 = this.normalCDF(d1);
    const Nd2 = this.normalCDF(d2);
    const N_neg_d1 = this.normalCDF(-d1);
    const N_neg_d2 = this.normalCDF(-d2);
    const pdf_d1 = this.normalPDF(d1);

    // European Call Price = S·N(d1) - K·e^(-r·T)·N(d2)
    const callPrice = (S * Nd1) - (K * Math.exp(-r * T) * Nd2);

    // European Put Price = K·e^(-r·T)·N(-d2) - S·N(-d1)
    const putPrice = (K * Math.exp(-r * T) * N_neg_d2) - (S * N_neg_d1);

    // Greeks
    const deltaCall = Nd1;
    const deltaPut = Nd1 - 1;
    const gamma = pdf_d1 / (S * sigma * Math.sqrt(T));
    const vega = (S * pdf_d1 * Math.sqrt(T)) / 100; // 1% vol change
    const thetaCall = (-(S * pdf_d1 * sigma) / (2 * Math.sqrt(T)) - (r * K * Math.exp(-r * T) * Nd2)) / 365;
    const thetaPut = (-(S * pdf_d1 * sigma) / (2 * Math.sqrt(T)) + (r * K * Math.exp(-r * T) * N_neg_d2)) / 365;

    return {
      callPrice: Number(callPrice.toFixed(4)),
      putPrice: Number(putPrice.toFixed(4)),
      greeks: {
        deltaCall: Number(deltaCall.toFixed(4)),
        deltaPut: Number(deltaPut.toFixed(4)),
        gamma: Number(gamma.toFixed(6)),
        vega: Number(vega.toFixed(4)),
        thetaCall: Number(thetaCall.toFixed(4)),
        thetaPut: Number(thetaPut.toFixed(4))
      },
      inputs: { stockPrice: S, strikePrice: K, timeToExpiryYears: T, riskFreeRate: r, volatility: sigma }
    };
  }
}
