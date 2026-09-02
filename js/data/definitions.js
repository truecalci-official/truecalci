/**
 * Comprehensive Knowledge Base & Definitions for Indian Household & Student Calculators
 * All rates and benchmarks are framed as illustrative educational examples in compliance with regulatory norms.
 */

export const CALCULATOR_DEFINITIONS = {
  // 1. Income Tax (Budget 2025-26 & 2026-27)
  income_tax: {
    title: "Income Tax Calculator (Budget 2025-26 Provisions)",
    category: "Indian Personal Finance & Household",
    disclaimer: "Disclaimer: This tool provides illustrative estimates based on Union Budget 2025-26 proposals. It does not constitute official tax advice. Please consult a Chartered Accountant (CA) or the official Income Tax e-filing portal (incometax.gov.in) before filing returns.",
    overview: "Under the restructured New Tax Regime (default), individual taxpayers with annual income up to ₹12.75 Lakhs pay ₹0 net tax after accounting for the ₹75,000 salaried Standard Deduction and the enhanced Section 87A rebate of up to ₹60,000.",
    slabs: [
      { slab: "Up to ₹4,00,000", newRate: "Nil", oldRate: "Nil (up to ₹2.5L)" },
      { slab: "₹4,00,001 to ₹8,00,000", newRate: "5%", oldRate: "5% (₹2.5L to ₹5L)" },
      { slab: "₹8,00,001 to ₹12,00,000", newRate: "10%", oldRate: "20% (₹5L to ₹10L)" },
      { slab: "₹12,00,001 to ₹16,00,000", newRate: "15%", oldRate: "30% (Above ₹10L)" },
      { slab: "₹16,00,001 to ₹20,00,000", newRate: "20%", oldRate: "30%" },
      { slab: "₹20,00,001 to ₹24,00,000", newRate: "25%", oldRate: "30%" },
      { slab: "Above ₹24,00,000", newRate: "30%", oldRate: "30%" }
    ],
    formulas: [
      { name: "Standard Deduction (Salaried)", formula: "₹75,000 (New Regime) | ₹50,000 (Old Regime)" },
      { name: "Section 87A Rebate", formula: "Up to ₹60,000 for Taxable Income ≤ ₹12,00,000 (New Regime)" },
      { name: "Health & Education Cess", formula: "4% on total calculated tax before TDS" }
    ],
    workedExample: "A salaried individual earning ₹12,50,000/yr: Standard deduction = ₹75,000; Taxable income = ₹11,75,000. Gross tax = (₹4L-8L @5% = ₹20,000) + (₹8L-11.75L @10% = ₹37,500) = ₹57,500. Section 87A rebate covers ₹57,500 → Final Tax = ₹0."
  },

  // 2. SIP & Step-Up SIP
  sip: {
    title: "SIP & Step-Up SIP (Systematic Investment Plan)",
    category: "Wealth & Mutual Funds",
    disclaimer: "Disclaimer: Mutual fund investments are subject to market risks. Return rates (e.g. 12% p.a.) are purely illustrative historical market benchmarks and do not guarantee future returns. Regulated by SEBI norms.",
    overview: "A Systematic Investment Plan allows investing fixed sums at monthly intervals in mutual fund schemes, harnessing rupee-cost averaging and long-term compounding.",
    formulas: [
      { name: "Standard SIP Future Value", formula: "M = P × [((1 + i)^n - 1) / i] × (1 + i)" },
      { name: "Where", formula: "P = Monthly SIP, i = Annual Rate / 12 / 100, n = Total Months" },
      { name: "Step-Up SIP", formula: "Increases P by a chosen percentage (e.g., 10%) each year matching salary increments." }
    ],
    presets: [
      { label: "Conservative / Debt", rate: "7.5%" },
      { label: "Moderate / Hybrid", rate: "10.0%" },
      { label: "Equity / Nifty 50 Benchmark", rate: "12.0%" },
      { label: "Aggressive Equity", rate: "14.0%" }
    ],
    workedExample: "₹10,000/month for 15 years at an illustrative 12% p.a.: Total Invested = ₹18,00,000. Estimated Returns = ₹32,45,760. Total Maturity Corpus = ₹50,45,760."
  },

  // 3. Home Loan EMI & Amortization
  home_loan: {
    title: "Home Loan EMI & Prepayment Calculator",
    category: "Banking & Credit",
    disclaimer: "Disclaimer: Interest rates (e.g., 8.5% p.a.) represent typical prevailing bank benchmark rates (SBI, HDFC, ICICI, etc.). Actual rates depend on your credit score (CIBIL), loan-to-value (LTV) ratio, and lender policies.",
    overview: "Computes Equated Monthly Installments (EMI) using the reducing balance method and illustrates the massive interest savings achieved through periodic prepayments.",
    formulas: [
      { name: "Reducing Balance EMI Formula", formula: "EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]" },
      { name: "Where", formula: "P = Principal Loan, r = Monthly Rate (Annual% / 12 / 100), n = Tenure in Months" }
    ],
    workedExample: "₹50,00,000 loan at 8.50% p.a. for 20 years (240 months): Monthly EMI = ₹43,391. Total Interest Paid = ₹54,13,879. Total Payment = ₹1,04,13,879."
  },

  // 4. Gold & Jewellery Calculator
  gold: {
    title: "Indian Gold & Jewellery Billing Calculator",
    category: "Household & Assets",
    disclaimer: "Disclaimer: Daily bullion gold rates fluctuate based on MCX and international market spot prices. Making charges vary between jewellers (Tanishq, Kalyan, Malabar, local jewellers). Always insist on a BIS Hallmark invoice.",
    overview: "Calculates the total billing price of gold jewellery including gold weight, karat purity (24K, 22K 916 Hallmark, 18K 750), making charges (percentage or fixed per gram), BIS hallmarking fee (₹45), and 3% GST.",
    formulas: [
      { name: "Gold Value", formula: "Weight (g) × (Base 24K Rate × Karat/24)" },
      { name: "Making Charges", formula: "Gold Value × (Making% / 100) or Fixed ₹/gram × Weight" },
      { name: "Subtotal", formula: "Gold Value + Making Charges + Hallmark Fee (₹45)" },
      { name: "GST (3%)", formula: "Subtotal × 3%" },
      { name: "Final Invoice", formula: "Subtotal + GST" }
    ],
    workedExample: "10 grams of 22K (916) jewellery at ₹7,500/g base gold rate with 10% making charges: Gold Value = 10 × (7500 × 22/24) = ₹68,750. Making charges (10%) = ₹6,875. Hallmark fee = ₹45. Subtotal = ₹75,670. GST (3%) = ₹2,270.10. Final Price = ₹77,940.10."
  },

  // 5. PPF (Public Provident Fund)
  ppf: {
    title: "Public Provident Fund (PPF) Calculator",
    category: "Government Small Savings Scheme",
    disclaimer: "Disclaimer: The interest rate is reviewed and notified quarterly by the Ministry of Finance, Government of India. Current rate is approximately 7.1% p.a. compounded annually.",
    overview: "A safe, government-backed 15-year statutory scheme with sovereign guarantee and EEE (Exempt-Exempt-Exempt) tax status under Section 80C.",
    rules: [
      "Minimum annual deposit: ₹500 | Maximum annual deposit: ₹1,50,000.",
      "Crucial Rule: Deposit between the 1st and 5th of the month to earn interest for that entire month, as interest is computed on the lowest balance between the 5th and end of month."
    ],
    workedExample: "Depositing ₹1,50,000 annually by April 5th for 15 years at 7.1%: Total Invested = ₹22,50,000. Total Interest Earned = ₹18,18,209. Total Tax-Free Maturity = ₹40,68,209."
  },

  // 6. Sukanya Samriddhi Yojana (SSY)
  ssy: {
    title: "Sukanya Samriddhi Yojana (SSY)",
    category: "Government Girl Child Welfare Scheme",
    disclaimer: "Disclaimer: SSY interest rate is fixed quarterly by the Ministry of Finance. Current indicative rate is 8.2% p.a. compounded annually.",
    overview: "A government initiative under the 'Beti Bachao, Beti Padhao' campaign. Accounts can be opened for girls aged 0 to 10 years. Deposits are made for 15 years, with full maturity at 21 years from account opening date."
  },

  // 7. Engineering Calci 991 (V.P.A.M. Precision)
  casio_calci: {
    title: "Engineering Calci 991 (V.P.A.M. Precision Standard)",
    category: "Engineering, Mathematics & Student Tools",
    overview: "Non-programmable scientific calculator simulator modeled after the ubiquitous standard 991-style engineering college examination calculator permitted in GATE, AICTE, university semester exams, and competitive engineering tests across India.",
    disclaimer: "Educational simulation designed for student coursework and exam preparation. Complies with non-programmable exam guidelines across Indian technical universities.",
    formulas: [
      { name: "Quadratic Formula", formula: "x = (-b ± √(b² - 4ac)) / (2a)" },
      { name: "Simpson's 1/3 Rule (Numerical Integration)", formula: "∫[a,b] f(x)dx ≈ (h/3) × [f(x₀) + 4∑f(x_odd) + 2∑f(x_even) + f(x_n)]" },
      { name: "Central Difference (Numerical Derivative)", formula: "f'(x) ≈ [f(x + h) - f(x - h)] / (2h)" },
      { name: "Newton-Raphson Solver", formula: "x_{n+1} = x_n - f(x_n) / f'(x_n)" },
      { name: "Permutation & Combination", formula: "nPr = n! / (n - r)!  |  nCr = n! / [r! (n - r)!]" },
      { name: "Hyperbolic Functions", formula: "sinh(x) = (e^x - e^-x)/2  |  cosh(x) = (e^x + e^-x)/2" }
    ],
    features: [
      "2-Line V.P.A.M. Display: Upper 12-char dot matrix expression line; lower 10+2 mantissa/exponent line.",
      "Dual Modifier Keys: Yellow SHIFT toggles upper functions; Red ALPHA toggles variable registers (A, B, C, D, E, F, X, Y, M).",
      "Replay D-Pad: Left/Right cursor navigation for inline editing; Up/Down calculation history recall.",
      "EQN Solver: Solves simultaneous linear equations (2 & 3 unknowns) and polynomial equations (Quadratic ax² + bx + c = 0 & Cubic ax³ + bx² + cx + d = 0).",
      "Numerical Calculus: Simpson's rule definite integration (∫dx) and central difference differentiation (d/dx).",
      "SOLVE: Newton-Raphson iterative numerical equation root solver."
    ],
    workedExample: "Solving x² - 5x + 6 = 0 via EQN mode yields roots x₁ = 3, x₂ = 2 with discriminant Δ = 1 > 0."
  },

  // 8. Indian Land Units
  land_units: {
    title: "Indian Land Measurement Units Converter",
    category: "Real Estate & Land Measurement",
    overview: "Converts traditional Indian land measurement units to metric and British Imperial units according to state revenue records.",
    disclaimer: "Disclaimer: Traditional units like Bigha and Katha vary across Indian states. Standards shown reflect widely accepted state registries.",
    formulas: [
      { name: "Gaj to Square Feet", formula: "1 Gaj = 1 Square Yard = 9 Square Feet" },
      { name: "Guntha to Square Feet", formula: "1 Guntha = 121 Gaj = 1,089 Square Feet" },
      { name: "Acre to Guntha", formula: "1 Acre = 40 Gunthas = 43,560 Square Feet" },
      { name: "Bigha (Standard) to Square Feet", formula: "1 Bigha = 3,025 Gaj = 27,225 Square Feet" }
    ],
    units: [
      { unit: "Gaj (Square Yard)", equivalent: "9 Square Feet = 0.8361 Square Metres" },
      { unit: "Guntha (Gunta)", equivalent: "121 Sq Yards (Gaj) = 1,089 Sq Feet (Maharashtra, Karnataka, Gujarat, Telangana)" },
      { unit: "Acre", equivalent: "40 Gunthas = 4,840 Gaj = 43,560 Sq Feet" },
      { unit: "Bigha (Standard)", equivalent: "3,025 Gaj = 27,225 Sq Feet (North India)" },
      { unit: "Cent", equivalent: "435.6 Sq Feet = 48.4 Gaj (Kerala, Tamil Nadu, Andhra Pradesh)" }
    ]
  },

  // 9. US & Global Mortgage (PITI & PMI)
  us_mortgage: {
    title: "US & International Mortgage Calculator (PITI)",
    category: "Global Real Estate & Lending",
    disclaimer: "Disclaimer: Property tax rates and homeowner insurance vary by state/county and insurer. PMI applies if down payment is under 20% of purchase price.",
    overview: "In the United States and North America, mortgages are evaluated on PITI: Principal, Interest, Property Taxes, Homeowners Hazard Insurance, and Private Mortgage Insurance (PMI).",
    formulas: [
      { name: "Monthly Principal & Interest (P&I)", formula: "M = P × [r(1 + r)^n] / [(1 + r)^n - 1]" },
      { name: "Property Tax", formula: "Annual Property Tax = Home Value × Tax Rate % (e.g. 1.2%)" },
      { name: "Private Mortgage Insurance (PMI)", formula: "Required if Down Payment < 20% (approx 0.5% - 1.5% of loan)" }
    ],
    workedExample: "A $450,000 home with 20% down ($90,000) at 6.75% for 30 years: Loan = $360,000. P&I = $2,335/mo. Property tax (1.2%) = $450/mo. Insurance = $117/mo. Total Monthly PITI = $2,902/mo."
  },

  // 10. European VAT & Sales Tax
  vat: {
    title: "European VAT & International Sales Tax Calculator",
    category: "Global Commercial & Tax",
    disclaimer: "Disclaimer: VAT rates are governed by national revenue agencies (e.g., HMRC in the UK, Bundeszentralamt für Steuern in Germany).",
    overview: "Calculates Value Added Tax (VAT) / Goods and Services Tax (GST) across Europe, the UK, and international jurisdictions, supporting both Add VAT (Net to Gross) and Remove/Extract VAT (Gross to Net).",
    formulas: [
      { name: "Add VAT (Net → Gross)", formula: "Gross = Net × (1 + VAT Rate / 100)  |  VAT = Net × (VAT Rate / 100)" },
      { name: "Remove VAT (Gross → Net)", formula: "Net = Gross / (1 + VAT Rate / 100)  |  VAT = Gross - Net" }
    ],
    presets: [
      { label: "United Kingdom (HMRC)", rate: "20% Standard, 5% Reduced" },
      { label: "Germany (MwSt)", rate: "19% Standard, 7% Reduced" },
      { label: "France (TVA)", rate: "20% Standard, 10% / 5.5% Reduced" },
      { label: "Spain (IVA)", rate: "21% Standard, 10% Reduced" },
      { label: "United States", rate: "7.25% Average State Sales Tax" }
    ],
    workedExample: "€1,000 Net with 20% VAT: VAT Amount = €200. Total Gross = €1,200. Conversely, extracting 20% VAT from €1,200 Gross yields Net = €1,000."
  },

  // 11. Restaurant Tip & Bill Splitter
  tip: {
    title: "Tip & Restaurant Bill Splitter",
    category: "Everyday Utility",
    disclaimer: "Disclaimer: Tipping etiquette varies by region (typically 15% - 20% in the United States and Canada).",
    overview: "Quickly calculates fair tip percentages and splits the total bill evenly across any number of guests.",
    formulas: [
      { name: "Tip Amount", formula: "Bill Subtotal × (Tip% / 100)" },
      { name: "Total Bill with Tip", formula: "Bill Subtotal + Tip Amount" },
      { name: "Per-Guest Share", formula: "Total Bill with Tip / Number of Guests" }
    ],
    workedExample: "$85.00 bill with 18% standard tip ($15.30) split between 2 diners: Total with Tip = $100.30 ($50.15 per person)."
  },

  // 12. Compound Wealth & 401(k) Simulator
  compound: {
    title: "Global Compound Interest & Wealth Simulator",
    category: "Global Savings & Retirement",
    disclaimer: "Disclaimer: Projections assume a constant annual rate of return for illustrative planning. Market returns fluctuate.",
    overview: "Simulates long-term exponential compounding for 401(k), Roth IRA, UK ISA, and ETF savings plans (Sparplan) with recurring monthly contributions.",
    formulas: [
      { name: "Compound Future Value", formula: "FV = P × (1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]" },
      { name: "Where", formula: "P = Initial Lump Sum, PMT = Monthly Deposit, r = Annual Rate, n = Compounding Frequency (12), t = Years" }
    ],
    workedExample: "$10,000 initial + $500/month for 15 years at 8% annual return: Total Principal Invested = $100,000. Compounded Future Value = ~$201,848 (Gain: ~$101,848)."
  }
};

