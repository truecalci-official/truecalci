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
  },

  // 13. Remote Contractor 1099 vs W-2 Parity Matrix
  contractor_matrix: {
    title: "1099 vs. W-2 Remote Contractor Real Take-Home Matrix",
    category: "Global Freelance, Tech & Remote Work",
    disclaimer: "Disclaimer: This tool calculates tax and economic parity under 2024/2025 US Internal Revenue Code provisions (FICA, SECA, § 199A QBI, § 164(f) deduction). It is intended for illustrative financial decision-making and does not constitute formal tax advisory. Consult a licensed CPA or tax attorney for entity-specific filings.",
    overview: "Compares true take-home cash between a W-2 salaried employee and a 1099 independent contractor / LLC pass-through entity. Solves the exact breakeven billing rate ($/hr) required to match corporate employee benefits (health insurance, 401k match, paid time off) after accounting for the 15.3% Self-Employment Tax (SECA) and the 20% Section 199A Qualified Business Income (QBI) deduction.",
    formulas: [
      { name: "1099 Self-Employment Tax (SECA)", formula: "SE Tax = Net Profit × 0.9235 × [12.4% (SS up to $168,600) + 2.9% (Medicare) + 0.9% (Addl. Med > $200k)]" },
      { name: "50% Above-the-Line SE Tax Deduction", formula: "Deduct exactly 50% of SE Tax from Net Profit to determine Adjusted Gross Income (AGI)" },
      { name: "Section 199A QBI Deduction", formula: "QBI = 20% × min(Net Profit - 50% SE Tax - SE Health Insurance, Taxable Income before QBI)" },
      { name: "W-2 Benefits Parity Multiplier", formula: "Equivalent 1099 Hourly Rate = (W-2 Annual Salary / 2080) × 1.28 to 1.35" },
      { name: "Cross-Border Net Local Payout", formula: "Net Local = (USD Amount - Platform Fee) × Mid-Market FX Rate × (1 - FX Markup)" }
    ],
    presets: [
      { label: "Junior Software Engineer", rate: "$90,000 W-2 vs. $60/hr 1099" },
      { label: "Senior Full-Stack SWE", rate: "$140,000 W-2 vs. $95/hr 1099" },
      { label: "Principal / Tech Lead", rate: "$200,000 W-2 vs. $145/hr 1099" },
      { label: "Wise Business Cross-Border", rate: "0.55% transparent FX drag vs. 7.9% PayPal drag" }
    ],
    workedExample: "Evaluating $130,000 W-2 vs. $85/hr 1099 (48 wks × 40 hrs = 1,920 hrs = $163,200 gross). W-2 employee pays $9,945 FICA + $18,340 federal tax + $5,770 state tax → Net Cash = $92,220/yr ($7,685/mo) + $12,400 benefits. 1099 contractor writes off $6,000 expenses, pays $21,080 SECA, deducts 50% SECA + $7,200 health, claims $26,500 QBI 20% deduction, and pays $19,850 income taxes → Net Cash = $103,320/yr ($8,610/mo). The 1099 offer yields +$1,140/month (+12.4%) more spendable cash! Exact breakeven rate is $78.42/hr."
  },

  // 14. S-Corp Reasonable Salary & Tax Shield Optimizer
  scorp: {
    title: "S-Corp vs. LLC Tax Optimization & Reasonable Salary",
    category: "Global Freelance, Tech & Remote Work",
    disclaimer: "Disclaimer: S-Corporation tax savings depend on establishing an IRS-defensible 'Reasonable Salary' under Revenue Ruling 74-44. Failure to pay reasonable compensation can trigger recharacterization audits. Consult a CPA to establish entity-level filings.",
    overview: "Calculates the exact FICA tax shield achieved by electing S-Corporation status (IRS Form 2553 / 1120-S) vs. remaining a Disregarded LLC. Distributions are 100% exempt from the 15.3% Self-Employment Tax (SECA). Subtracts typical annual corporate overhead ($600 payroll + $1,500 CPA 1120-S filing + state franchise taxes) to determine true net cash in-pocket savings and the exact mathematical breakeven profit threshold.",
    formulas: [
      { name: "LLC SECA Baseline", formula: "SECA = Net Profit × 0.9235 × [12.4% (SS to $168,600) + 2.9% (Medicare) + 0.9% (Addl. Med > $200k)]" },
      { name: "S-Corp FICA (Salary Only)", formula: "FICA = W-2 Salary × [12.4% (SS to $168,600) + 2.9% (Medicare) + 0.9% (Addl. Med > $200k)]" },
      { name: "K-1 Shareholder Distribution", formula: "Distribution = Net Business Profit - W-2 Reasonable Salary (0% SECA Tax)" },
      { name: "Net In-Pocket Savings", formula: "Net Savings = (LLC SECA - S-Corp FICA) - Annual Payroll Fee - CPA 1120-S Fee - State Fees" }
    ],
    workedExample: "At $150,000 net profit with a 55% reasonable salary ($82,500 salary, $67,500 K-1 distribution): LLC pays $21,194 SECA. S-Corp pays $12,623 FICA on salary. Gross tax shield = $8,571. Subtracting $600 payroll + $1,500 CPA + $200 state fees ($2,300 overhead) yields +$6,271/year (+$523/month) in cold hard cash! Mathematical breakeven occurs at ~$41,000 profit; CPA-recommended entry is ~$80,000."
  },

  // 15. Solo 401(k) vs SEP-IRA Retirement Shield
  retirement: {
    title: "Solo 401(k) vs. SEP-IRA Tax Shield Maximizer",
    category: "Global Freelance, Tech & Remote Work",
    disclaimer: "Disclaimer: Contribution limits governed by IRS Notice 2023-75. Solo 401(k) plans require adoption by December 31st of the tax year and IRS Form 5500-EZ once plan assets exceed $250,000.",
    overview: "Calculates maximum legal tax-deductible retirement contributions for solo business owners, LLCs, and S-Corps. Compares the two-part structure of Solo 401(k) (Employee Deferral + 20-25% Employer Profit Share) against employer-only SEP-IRAs, computing immediate federal and state tax savings.",
    formulas: [
      { name: "Solo 401(k) Employee Deferral", formula: "Min(Plan Compensation, $23,000 [$30,500 if Age 50+])" },
      { name: "Employer Profit Sharing", formula: "Corporate W-2: 25% of Salary | Unincorporated LLC: 20% of Adjusted Net Profit" },
      { name: "Total 2024 Plan Maximum Cap", formula: "$69,000 ($76,500 if Age 50+) or 100% of Compensation" },
      { name: "Immediate Cash Tax Shield", formula: "Cash Saved = Total Deductible Contribution × Marginal Tax Rate %" }
    ],
    workedExample: "At $120,000 net earnings (single, 29% marginal tax rate): SEP-IRA allows 20% employer contribution = $22,304 (saves $6,468 in tax). Solo 401(k) allows $23,000 employee deferral + $22,304 employer share = $45,304 total deduction (saves $13,138 in tax). Solo 401(k) shields an extra $23,000, putting +$6,670 directly back into your checking account!"
  },

  // 16. Cross-Border FX Invoicing Rail Optimizer
  fx: {
    title: "Global Invoicing & Cross-Border FX Rail Optimizer",
    category: "Global Freelance, Tech & Remote Work",
    disclaimer: "Disclaimer: Exchange rate benchmarks reflect live institutional mid-market rates. Retail spreads and provider platform transaction fees are based on published fee schedules for business/commercial accounts.",
    overview: "Evaluates the exact take-home amount landed in your local currency account when invoicing international US/global clients in USD. Deconstructs hidden currency conversion markups, fixed wire fees, and payment platform commissions across Wise Business, Deel, Payoneer, Stripe, and PayPal.",
    formulas: [
      { name: "Net USD After Platform Commission", formula: "USD_Net = (Invoice_USD - Fixed_Fee) × (1 - Percent_Fee)" },
      { name: "Effective Exchange Rate", formula: "Effective_Rate = Mid_Market_Rate × (1 - FX_Markup_Spread)" },
      { name: "Landed Local Currency Payout", formula: "Landed_Local = USD_Net × Effective_Rate" },
      { name: "Total Dollar Fee Drag", formula: "Fee_Drag_USD = Invoice_USD - (Landed_Local / Mid_Market_Rate)" }
    ],
    workedExample: "On a $10,000 USD contractor invoice converted to EUR (mid-market 0.92 = €9,200 theoretical): Wise (0.55% transparent fee, 0% markup) lands €9,149 ($51 total drag). PayPal (4.49% transaction + 3.5% FX spread) lands €8,479 ($784 total drag). Using Wise saves +$729 on a single invoice (+$8,748/year on monthly billing)!"
  },

  // 17. Billable Hourly Rate Floor & Burn Rate Solver
  billable: {
    title: "Billable Hourly Rate Floor & Burn Rate Solver",
    category: "Global Freelance, Tech & Remote Work",
    disclaimer: "Disclaimer: Illustrates required gross billing rates needed to achieve desired net spendable cash after statutory taxes, business expenses, and working-time reductions. Does not guarantee market pricing viability.",
    overview: "Solves the true minimum billing rate ($/hr) needed to achieve your target net take-home salary. Incorporates the harsh economic realities of freelancing: 47 working weeks (vacation, holidays, sickness), 25–35% non-billable overhead buffer (sales, invoicing, admin), self-funded healthcare ($7,200/yr), software/hardware expenses, and 15.3% SECA taxes.",
    formulas: [
      { name: "Realistic Annual Working Weeks", formula: "Weeks = 52 - Vacation_Weeks - Holiday_Sick_Weeks (typically 46–47 wks)" },
      { name: "Billable Hours Per Week", formula: "Billable_Hours = Nominal_Hours × (1 - Non_Billable_Admin_Percent)" },
      { name: "Total Annual Billable Capacity", formula: "Annual_Billable = Working_Weeks × Billable_Hours (typically 1,300–1,400 hrs vs naive 2,080 hrs)" },
      { name: "True Rate Floor", formula: "Binary search solving Hourly_Rate where Net_Spendable_Cash(Rate) ≥ Target_Net_Salary" }
    ],
    workedExample: "To take home $120,000 in spendable cash with 4 weeks vacation, 28% administrative buffer, $8,000 expenses, and $7,200 health insurance: Naive calculation ($120k / 2,080 hrs = $57.69/hr) results in a disastrous -$73,284 cash deficit! The true required billing floor is $139.72/hr across 1,339 realistic billable hours."
  }
};



