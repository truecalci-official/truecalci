#!/usr/bin/env node
/**
 * TrueCalci Official Model Context Protocol (MCP) Server
 * Standard JSON-RPC stdio transport for Claude Desktop, Cursor, Windsurf, and AI Agents.
 * 
 * To connect in Claude Desktop:
 * Add to claude_desktop_config.json under "mcpServers":
 * "truecalci": {
 *   "command": "node",
 *   "args": ["C:\\Calculator\\mcp-server.mjs"]
 * }
 */

import readline from 'readline';
import { GlobalFinanceEngine } from './js/engines/global-finance.js';
import { IndianFinanceEngine } from './js/engines/indian-finance.js';
import { CasioCalciEngine } from './js/engines/casio-engine.js';
import { EngineeringPhysicsEngine } from './js/engines/engineering-physics.js';
import { StatisticsOptionsEngine } from './js/engines/statistics-options.js';
import { ContractorMatrixEngine } from './js/engines/contractor-matrix.js';
import { SCorpEngine } from './js/engines/scorp-engine.js';
import { RetirementEngine } from './js/engines/retirement-engine.js';
import { BillableRateEngine } from './js/engines/billable-engine.js';
import { FXInvoicingEngine } from './js/engines/fx-engine.js';
import { FinOpsEngine } from './js/engines/finops-engines.js';
import { validateEngineInput, ValidationError } from './js/validation/engine-validator.js';

const MCP_TOOLS = [
  {
    "name": "truecalci_contractor_parity",
    "description": "Calculate tax liabilities, statutory benefits, and net take-home cash between W-2 salaried employment and 1099 independent contractor billing, solving the exact breakeven billing rate ($/hr).\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Computes federal FICA (Social Security up to statutory wage base and Medicare), federal income tax brackets, state income tax, employer health subsidy, 401(k) match, PTO value, SECA tax with 50% above-the-line deduction, and Section 199A QBI deduction. Returns net spendable cash for both employment models, complete tax breakdowns, effective tax rates, and the exact breakeven hourly rate.\n\nUsage Guidelines: Use when an individual or hiring manager is deciding between a W-2 salaried offer and a 1099 contractor contract. Do not use for solo freelancer baseline rate setting without a W-2 benchmark; use billable_floor instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "w2Salary": {
          "type": "number",
          "default": 130000,
          "description": "W-2 gross annual salary in USD ($/yr). Must be a positive number."
        },
        "contractorHourlyRate": {
          "type": "number",
          "default": 85,
          "description": "1099 contractor hourly billing rate in USD ($/hr). Must be a positive number."
        },
        "filingStatus": {
          "type": "string",
          "enum": [
            "single",
            "mfj"
          ],
          "default": "single",
          "description": "IRS income tax filing status: 'single' for unmarried individual or 'mfj' for married filing jointly."
        },
        "stateTaxRatePercent": {
          "type": "number",
          "default": 5,
          "description": "Effective or statutory state income tax rate in percent (e.g. 5.0 for 5%). Set to 0 for states without income tax."
        },
        "healthSubsidyAnnual": {
          "type": "number",
          "default": 7200,
          "description": "Annual W-2 employer-paid health insurance subsidy in USD ($/yr)."
        },
        "match401kPercent": {
          "type": "number",
          "default": 4,
          "description": "W-2 employer 401(k) retirement match as a percentage of gross salary (e.g. 4.0 for 4%)."
        },
        "ptoDays": {
          "type": "number",
          "default": 25,
          "description": "Annual W-2 paid time off days (combined vacation and sick leave)."
        },
        "hoursPerWeek": {
          "type": "number",
          "default": 40,
          "description": "Expected billable client hours per week as a 1099 contractor. Must be greater than 0."
        },
        "weeksPerYear": {
          "type": "number",
          "default": 48,
          "description": "Active billable working weeks per year as a 1099 contractor (52 minus unpaid vacation and bench time)."
        },
        "annualExpenses": {
          "type": "number",
          "default": 6000,
          "description": "Annual tax-deductible business operating expenses in USD ($/yr) (software, hardware, insurance)."
        },
        "eligibleQBI": {
          "type": "boolean",
          "default": true,
          "description": "Whether the 1099 contractor business qualifies for the Section 199A 20% Qualified Business Income deduction."
        },
        "targetCurrency": {
          "type": "string",
          "default": "EUR",
          "description": "Target fiat currency code for international cross-border conversion drag (e.g. EUR, GBP, CAD)."
        },
        "selectedRail": {
          "type": "string",
          "enum": [
            "wise",
            "deel",
            "payoneer",
            "stripe",
            "paypal",
            "wire"
          ],
          "default": "wise",
          "description": "Payment rail provider for international contractor payout: 'wise', 'deel', 'payoneer', 'stripe', 'paypal', or 'wire'."
        }
      },
      "required": [
        "w2Salary",
        "contractorHourlyRate"
      ]
    }
  },
  {
    "name": "truecalci_scorp_optimizer",
    "description": "Evaluate S-Corporation tax election viability by calculating reasonable officer salary split, SECA/FICA payroll tax shield, administrative overhead costs, and net tax savings under IRS Rev. Rul. 74-44.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Splits net business profit into W-2 officer wages and Schedule K-1 shareholder distributions. Applies 15.3% FICA to salary only (exempting distributions), accounts for employer-half FICA deduction, deducts annual CPA corporate filing and payroll processing fees, and computes the mathematical breakeven net profit threshold.\n\nUsage Guidelines: Use when a US small business owner, single-member LLC, or high-earning freelancer is considering electing S-Corp status to reduce self-employment taxes. Do not use for retirement account contribution limits; use solo_401k_shield instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "netProfit": {
          "type": "number",
          "default": 150000,
          "description": "Annual net business profit before owner compensation in USD ($/yr). Must be a positive number."
        },
        "salaryPercent": {
          "type": "number",
          "default": 55,
          "description": "Officer W-2 reasonable compensation percentage of net profit (e.g. 50, 55, 60%). Must comply with IRS Rev. Rul. 74-44 industry benchmarks."
        },
        "payrollAnnualFee": {
          "type": "number",
          "default": 600,
          "description": "Annual software and compliance fee for running compliant W-2 payroll in USD ($/yr) (e.g. Gusto, Rippling)."
        },
        "cpaAnnualFee": {
          "type": "number",
          "default": 1500,
          "description": "Annual CPA accounting fee for corporate Form 1120-S preparation and filing in USD ($/yr)."
        },
        "stateAnnualFee": {
          "type": "number",
          "default": 200,
          "description": "Annual state franchise tax or corporate filing fee in USD ($/yr) (e.g. $800 in CA, $200 in DE)."
        }
      },
      "required": [
        "netProfit"
      ]
    }
  },
  {
    "name": "truecalci_solo_401k_shield",
    "description": "Maximize tax-deferred retirement sheltering by comparing Solo 401(k) vs. SEP-IRA contribution limits and calculating immediate cash tax savings under statutory IRS Notice 2023-75 caps ($69,000 / $76,500).\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Computes employee elective deferral (up to $23,000 or $30,500 if age 50+) plus employer profit-sharing (20% of adjusted net earnings for LLC/sole prop, 25% of W-2 salary for S-Corp) subject to annual statutory additions cap. Multiplies total deductible contribution by marginal tax rate to return net cash saved.\n\nUsage Guidelines: Use when an owner-only business, independent contractor, or partner wants to optimize pre-tax retirement deductions. Do not use for multi-year exponential compound investment growth modeling; use compound_wealth instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "netEarnings": {
          "type": "number",
          "default": 120000,
          "description": "Annual net business profit (Schedule C) or W-2 officer salary (S-Corp) in USD ($/yr). Must be a positive number."
        },
        "entityType": {
          "type": "string",
          "enum": [
            "llc",
            "scorp"
          ],
          "default": "llc",
          "description": "Legal entity tax structure: 'llc' (sole proprietorship / single-member LLC using 20% adjusted SE earnings) or 'scorp' (corporation using 25% W-2 wage)."
        },
        "isAge50Plus": {
          "type": "boolean",
          "default": false,
          "description": "Whether the account holder is age 50 or older, unlocking the statutory $7,500 catch-up contribution."
        },
        "marginalTaxRatePercent": {
          "type": "number",
          "default": 28,
          "description": "Combined federal and state marginal income tax bracket percentage (e.g. 28 for 28%)."
        }
      },
      "required": [
        "netEarnings"
      ]
    }
  },
  {
    "name": "truecalci_fx_invoicing",
    "description": "Quantify cross-border payment fee drag and calculate net landed local currency across 6 global payout rails (Wise, Deel, Stripe, Payoneer, PayPal, and SWIFT wire) against mid-market FX benchmark rates.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Models fixed per-transaction wire fees, percentage platform fees, and hidden foreign exchange percentage spreads for each provider. Returns ranked table with landed payout amounts, total drag percentage, hidden FX markup, and savings versus worst-case rail.\n\nUsage Guidelines: Use when an international freelancer, remote worker, or cross-border vendor needs to determine the cheapest payout rail or invoice amount in USD. Do not use for domestic US employee vs contractor parity; use contractor_parity instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "invoiceUsd": {
          "type": "number",
          "default": 10000,
          "description": "Gross billed invoice amount in USD ($). Must be a positive number greater than 0."
        },
        "targetCurrency": {
          "type": "string",
          "enum": [
            "EUR",
            "GBP",
            "CAD",
            "AUD",
            "INR",
            "SGD",
            "BRL",
            "MXN",
            "PHP"
          ],
          "default": "EUR",
          "description": "Payout destination currency code: 'EUR' (Euro), 'GBP' (British Pound), 'CAD' (Canadian Dollar), 'AUD' (Australian Dollar), 'INR' (Indian Rupee), 'SGD' (Singapore Dollar), 'BRL' (Brazilian Real), 'MXN' (Mexican Peso), or 'PHP' (Philippine Peso)."
        }
      },
      "required": [
        "invoiceUsd"
      ]
    }
  },
  {
    "name": "truecalci_billable_floor",
    "description": "Solve the exact minimum billable hourly rate required to achieve a target net spendable cash income, factoring in unpaid weeks, non-billable administrative drag, deductible overhead, health insurance, and SECA self-employment taxes.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Numerically solves the gross revenue needed so that Gross - Expenses - Health - SECA Tax - Income Tax equals Target Net Cash. Divides required gross revenue by actual billable hours (accounting for vacation weeks and non-billable admin/marketing percentage) to derive the hourly billable floor.\n\nUsage Guidelines: Use when a freelancer, consultant, or agency owner wants to set their baseline hourly rate to support their personal lifestyle budget. Do not use when directly benchmarking against a specific W-2 salary offer; use contractor_parity instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "targetNetCash": {
          "type": "number",
          "default": 120000,
          "description": "Desired annual net spendable cash take-home after all taxes and business expenses in USD ($/yr). Must be positive."
        },
        "annualExpenses": {
          "type": "number",
          "default": 8000,
          "description": "Annual tax-deductible business operating expenses in USD ($/yr) (software, office, hardware, insurance)."
        },
        "healthInsuranceAnnual": {
          "type": "number",
          "default": 7200,
          "description": "Annual out-of-pocket health insurance premium in USD ($/yr) paid directly by the freelancer."
        },
        "vacationWeeks": {
          "type": "number",
          "default": 4,
          "description": "Number of unpaid vacation, holiday, and sick weeks off planned per year (e.g. 4 for 4 weeks)."
        },
        "nonBillablePercent": {
          "type": "number",
          "default": 28,
          "description": "Percentage of total working hours lost to non-billable business activities like admin, sales, and invoicing (e.g. 28 for 28%)."
        },
        "filingStatus": {
          "type": "string",
          "enum": [
            "single",
            "mfj"
          ],
          "default": "single",
          "description": "IRS income tax filing status: 'single' for unmarried individual or 'mfj' for married filing jointly."
        }
      },
      "required": [
        "targetNetCash"
      ]
    }
  },
  {
    "name": "truecalci_mortgage_piti",
    "description": "Calculate monthly US mortgage payments broken down into PITI (Principal, Interest, Property Taxes, Homeowners Insurance, and Private Mortgage Insurance) along with full 30-year amortization schedule.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Computes standard monthly amortization using fixed-rate annuity formula, computes annual property taxes divided by 12, monthly hazard insurance, and conditional PMI (applied automatically if down payment is under 20% until 78% LTV threshold). Returns monthly total, principal/interest component, tax/escrow components, total lifetime interest, and payoff schedule.\n\nUsage Guidelines: Use for US residential home purchase financing and refinancing scenarios. Do not use for international reducing-balance loans without escrow/PMI; use home_loan_emi instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "homePrice": {
          "type": "number",
          "description": "Total purchase price or appraised property value in currency units (e.g. 450000). Must be positive."
        },
        "downPaymentPercent": {
          "type": "number",
          "default": 20,
          "description": "Down payment as a percentage of purchase price (e.g. 20 for 20%). Values below 20 automatically trigger PMI calculations."
        },
        "interestRate": {
          "type": "number",
          "description": "Annual mortgage interest rate percentage (e.g. 6.8 for 6.8%). Must be positive."
        },
        "tenureYears": {
          "type": "integer",
          "default": 30,
          "description": "Loan duration in years (typically 15, 20, or 30)."
        },
        "loanTermYears": {
          "type": "integer",
          "default": 30,
          "description": "Standard US alias for tenureYears (loan term in years)."
        },
        "propertyTaxRatePercent": {
          "type": "number",
          "default": 1.2,
          "description": "Annual local property tax rate as a percentage of home value (e.g. 1.2 for 1.2%)."
        },
        "annualHomeInsurance": {
          "type": "number",
          "default": 1400,
          "description": "Annual hazard/homeowners insurance premium in currency units (e.g. 1400)."
        },
        "annualPmiPercent": {
          "type": "number",
          "default": 0.75,
          "description": "Annual Private Mortgage Insurance premium percentage (e.g. 0.75 for 0.75% of original loan amount)."
        }
      },
      "required": [
        "homePrice",
        "interestRate"
      ]
    }
  },
  {
    "name": "truecalci_vat_sales_tax",
    "description": "Calculate European Value Added Tax (VAT) and global sales taxes in either Add Mode (Net price to Gross price) or Remove Mode (Gross price to Net price) with statutory rate verification.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. In 'add' mode: Tax = Amount * (Rate / 100), Total = Amount + Tax. In 'remove' mode: Net = Amount / (1 + Rate / 100), Tax = Amount - Net. Returns exact net, tax amount, and gross values rounded to 2 decimal places.\n\nUsage Guidelines: Use for e-commerce, international invoicing, retail pricing, and VAT compliance calculations. Do not use for restaurant tipping and bill splits; use tip_splitter instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "amount": {
          "type": "number",
          "description": "Base monetary amount to calculate tax on (net amount in 'add' mode, gross price in 'remove' mode). Must be positive."
        },
        "vatRatePercent": {
          "type": "number",
          "default": 20,
          "description": "Tax rate in percent (e.g. 20 for UK/France, 19 for Germany, 21 for Spain, 8.25 for US state/local)."
        },
        "mode": {
          "type": "string",
          "enum": [
            "add",
            "remove"
          ],
          "default": "add",
          "description": "Calculation mode: 'add' to append tax to net amount, or 'remove' to extract embedded tax from gross amount."
        }
      },
      "required": [
        "amount",
        "vatRatePercent"
      ]
    }
  },
  {
    "name": "truecalci_tip_splitter",
    "description": "Compute restaurant bill gratuity, total payable bill, and fair per-person itemized payment split across dining parties.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Multiplies pre-tip subtotal by tip percentage, computes total bill including tip, and divides by party size to provide per-guest charge with fair penny rounding.\n\nUsage Guidelines: Use for restaurant dining bills, food delivery tips, and group expense splitting. Do not use for commercial corporate tax or VAT; use vat_sales_tax instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "billAmount": {
          "type": "number",
          "description": "Pre-tip subtotal or total food and beverage bill in monetary units. Must be positive."
        },
        "tipPercent": {
          "type": "number",
          "default": 18,
          "description": "Gratuity percentage to add (e.g. 15, 18, 20, 25%)."
        },
        "numPeople": {
          "type": "integer",
          "default": 2,
          "description": "Total number of guests sharing the bill. Must be an integer greater than or equal to 1."
        }
      },
      "required": [
        "billAmount"
      ]
    }
  },
  {
    "name": "truecalci_compound_wealth",
    "description": "Simulate long-term compound interest growth for retirement portfolios, 401(k)s, Roth IRAs, UK ISAs, or European ETF savings plans (Sparplan) with recurring monthly deposits.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Applies discrete compound interest formula with periodic annuity deposits: Future Value = P*(1 + r/n)^(n*t) + PMT*(((1 + r/n)^(n*t) - 1)/(r/n)). Returns final accumulated balance, total principal contributed, total compound interest earned, and annual wealth progression milestone table.\n\nUsage Guidelines: Use for multi-year personal wealth projection and retirement nest-egg simulations. Do not use for Indian mutual fund monthly SIPs with annual step-up; use sip_investment instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "principal": {
          "type": "number",
          "default": 10000,
          "description": "Initial lump-sum deposit or starting balance in currency units. Must be non-negative."
        },
        "monthlyDeposit": {
          "type": "number",
          "default": 500,
          "description": "Recurring monthly contribution added to the account. Must be non-negative."
        },
        "annualRatePercent": {
          "type": "number",
          "default": 8,
          "description": "Expected annualized investment return rate percentage (e.g. 8 for 8%). Must be positive."
        },
        "tenureYears": {
          "type": "integer",
          "default": 15,
          "description": "Investment horizon in years (e.g. 10, 20, 30). Must be an integer >= 1."
        },
        "compoundFrequency": {
          "type": "integer",
          "default": 12,
          "description": "Number of compounding periods per year (1 for annual, 4 for quarterly, 12 for monthly)."
        }
      },
      "required": [
        "annualRatePercent",
        "tenureYears"
      ]
    }
  },
  {
    "name": "truecalci_gst_calculator",
    "description": "Calculate Indian Goods and Services Tax (CGST, SGST, IGST, Compensation Cess, RCM liability, and eligible ITC) under CGST Act 2017.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "amount": {
          "type": "number",
          "description": "Base or Gross transaction invoice amount in INR (₹)"
        },
        "gstRatePercent": {
          "type": "number",
          "default": 18,
          "description": "GST rate percentage (0, 5, 12, 18, 28, or custom)"
        },
        "type": {
          "type": "string",
          "enum": [
            "exclusive",
            "inclusive"
          ],
          "default": "exclusive",
          "description": "Invoicing mode: 'exclusive' (add GST) or 'inclusive' (extract from MRP)"
        },
        "jurisdiction": {
          "type": "string",
          "enum": [
            "intrastate",
            "interstate"
          ],
          "default": "intrastate",
          "description": "Transaction type: 'intrastate' (CGST+SGST) or 'interstate' (IGST)"
        },
        "cessPercent": {
          "type": "number",
          "default": 0,
          "description": "Optional Compensation Cess percentage"
        },
        "isRCM": {
          "type": "boolean",
          "default": false,
          "description": "Reverse Charge Mechanism applicable under Section 9(3)/9(4)"
        },
        "itcEligible": {
          "type": "boolean",
          "default": true,
          "description": "Input Tax Credit eligibility under Section 16/17(5)"
        }
      },
      "required": [
        "amount"
      ]
    }
  },
  {
    "name": "truecalci_indian_income_tax",
    "description": "Compute Indian personal income tax liability comparing the Union Budget 2025-26 New Tax Regime (with Section 87A rebate and ₹75,000 standard deduction) against the Old Tax Regime.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Applies statutory slab rates for FY 2025-26 (AY 2026-27): ₹0-4L Nil, ₹4-8L 5%, ₹8-12L 10%, ₹12-16L 15%, ₹16-20L 20%, ₹20-24L 25%, above ₹24L 30%. Applies full Section 87A rebate if taxable income is up to ₹12 Lakhs, adds 4% Health & Education Cess, and returns side-by-side comparison of old vs new regime with optimal recommendation.\n\nUsage Guidelines: Use when computing personal income tax or payroll deductions for Indian residents and salaried professionals. Do not use for US federal/state taxes; use contractor_parity or solo_401k_shield instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ctc": {
          "type": "number",
          "description": "Annual Cost-to-Company (CTC) / Gross taxable salary in Indian Rupees (INR ₹). Must be a positive number."
        },
        "isSalaried": {
          "type": "boolean",
          "default": true,
          "description": "Whether the taxpayer is a salaried employee (eligible for statutory ₹75,000 standard deduction under the New Regime)."
        }
      },
      "required": [
        "ctc"
      ]
    }
  },
  {
    "name": "truecalci_sip_investment",
    "description": "Calculate Systematic Investment Plan (SIP) mutual fund maturity wealth with optional annual percentage step-up (top-up) for compounding wealth growth.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Models monthly SIP compounding using formula FV = P * [((1 + i)^n - 1) / i] * (1 + i). When stepUpPercent > 0, dynamically increases monthly installment each 12-month cycle. Returns maturity amount, total invested capital, total estimated capital gains, and year-by-year accumulation.\n\nUsage Guidelines: Use for mutual fund SIP investments, recurring deposits, and goal-based financial planning. Do not use for US 401(k) / Roth IRA compounding with lump sum; use compound_wealth instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "monthlyInvestment": {
          "type": "number",
          "description": "Initial monthly investment installment amount in currency units (e.g. 5000). Must be positive."
        },
        "annualReturnRate": {
          "type": "number",
          "default": 12,
          "description": "Expected annualized return rate percentage (e.g. 12 for 12% equity CAGR)."
        },
        "tenureYears": {
          "type": "integer",
          "default": 10,
          "description": "Total investment duration in years (e.g. 5, 10, 20). Must be an integer >= 1."
        },
        "stepUpPercent": {
          "type": "number",
          "default": 0,
          "description": "Annual percentage increase in monthly contribution (e.g. 10 for 10% annual hike)."
        }
      },
      "required": [
        "monthlyInvestment"
      ]
    }
  },
  {
    "name": "truecalci_home_loan_emi",
    "description": "Calculate reducing-balance monthly Equated Monthly Installment (EMI), total interest payable, and amortization schedule for home, auto, or personal loans.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Computes standard monthly EMI formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1), where r = annualRate / 12 / 100. Returns monthly EMI, total payment (principal + interest), total interest percentage, and first-year amortization breakdown.\n\nUsage Guidelines: Use for general global reducing-balance loans and consumer debt. Do not use for US residential mortgages requiring property tax, hazard insurance, and PMI escrow; use mortgage_piti instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "principal": {
          "type": "number",
          "description": "Total borrowed principal loan amount in currency units. Must be a positive number."
        },
        "interestRatePercent": {
          "type": "number",
          "description": "Annual interest rate percentage (e.g. 8.5 for 8.5%). Must be positive."
        },
        "tenureYears": {
          "type": "integer",
          "default": 20,
          "description": "Total loan repayment duration in years (e.g. 15, 20, 30). Must be an integer >= 1."
        }
      },
      "required": [
        "principal",
        "interestRatePercent"
      ]
    }
  },
  {
    "name": "truecalci_casio_solve_quadratic",
    "description": "Solve algebraic polynomial equations: quadratic equations (a*x^2 + b*x + c = 0) and 2-variable simultaneous linear systems (a1*x + b1*y = c1, a2*x + b2*y = c2) with exact real and complex roots.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. For quadratics: evaluates discriminant D = b^2 - 4*a*c; computes real roots or complex conjugates (x1, x2 = (-b ± i*sqrt(|D|)) / (2*a)), and parabola vertex coordinates. For simultaneous systems: evaluates Cramer's determinant rule (D, Dx, Dy) to solve unique solutions or identify singular/parallel systems.\n\nUsage Guidelines: Use when solving quadratic polynomials or 2-unknown linear systems. Do not use for statistical data fitting; use linear_regression instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "quadratic",
            "simultaneous2"
          ],
          "default": "quadratic",
          "description": "Equation solver mode: 'quadratic' (solve single quadratic equation a*x^2 + b*x + c = 0) or 'simultaneous2' (solve system of 2 linear equations with 2 unknowns)."
        },
        "a": {
          "type": "number",
          "description": "First coefficient: quadratic coefficient a (for a*x^2, must be non-zero) or first linear equation x-coefficient a1."
        },
        "b": {
          "type": "number",
          "description": "Second coefficient: linear coefficient b (for b*x) or first linear equation y-coefficient b1."
        },
        "c": {
          "type": "number",
          "description": "Constant term: constant c (for + c = 0) or first linear equation constant c1 (a1*x + b1*y = c1)."
        },
        "a2": {
          "type": "number",
          "description": "Second linear equation x-coefficient a2 (required when type is 'simultaneous2', a2*x + b2*y = c2)."
        },
        "b2": {
          "type": "number",
          "description": "Second linear equation y-coefficient b2 (required when type is 'simultaneous2', a2*x + b2*y = c2)."
        },
        "c2": {
          "type": "number",
          "description": "Second linear equation constant term c2 (required when type is 'simultaneous2', a2*x + b2*y = c2)."
        }
      },
      "required": [
        "a",
        "b",
        "c"
      ]
    }
  },
  {
    "name": "truecalci_beam_bending",
    "description": "Calculate structural engineering beam mechanics: maximum elastic deflection, peak bending moment, and maximum flexural stress for a center point load on a simply supported Euler-Bernoulli beam.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Evaluates Euler-Bernoulli beam equations: Max Moment M_max = (P * L) / 4; Max Deflection delta_max = (P * L^3) / (48 * E * I); Peak Bending Stress sigma_max = (M_max * y) / I. Converts area moment of inertia from cm^4 to m^4 and extreme fiber distance from mm to m. Returns deflection in mm, moment in N*m, and stress in MPa.\n\nUsage Guidelines: Use for civil, structural, and mechanical engineering beam sizing and load checks. Do not use for fluid pipe friction or pressure drop; use pipe_flow instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "loadNewtons": {
          "type": "number",
          "description": "Concentrated point load P applied at the beam center in Newtons (N). Must be positive."
        },
        "lengthMeters": {
          "type": "number",
          "description": "Unsupported beam span length L between supports in meters (m). Must be positive."
        },
        "elasticModulusGpa": {
          "type": "number",
          "default": 200,
          "description": "Material Young's Modulus of Elasticity E in Gigapascals (GPa) (e.g. 200 for structural steel, 69 for aluminum)."
        },
        "momentOfInertiaCm4": {
          "type": "number",
          "description": "Cross-sectional second moment of area (area moment of inertia) I in cm^4 (e.g. 8640 for W8x31 I-beam). Must be positive."
        },
        "distanceFromNeutralAxisMm": {
          "type": "number",
          "description": "Perpendicular distance y from the neutral axis to the outermost extreme fiber in millimeters (mm). Must be positive."
        }
      },
      "required": [
        "loadNewtons",
        "lengthMeters",
        "momentOfInertiaCm4",
        "distanceFromNeutralAxisMm"
      ]
    }
  },
  {
    "name": "truecalci_projectile_motion",
    "description": "Calculate 2D classical mechanics projectile kinematics: maximum trajectory apex height, horizontal flight range, total time of flight, and terminal impact velocity.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Assumes vacuum projectile motion with constant gravitational acceleration: Flight Time t = (2 * v0 * sin(theta)) / g; Max Height H = (v0 * sin(theta))^2 / (2 * g); Range R = (v0^2 * sin(2*theta)) / g. Returns trajectory coordinates, apex coordinates, and velocity components (vx, vy).\n\nUsage Guidelines: Use for ballistic trajectories, physics problem solving, and aerospace launch kinematics without atmospheric drag. Do not use for orbital delta-v rocket staging; use rocket_deltav instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "initialVelocityMs": {
          "type": "number",
          "description": "Initial launch velocity magnitude v0 in meters per second (m/s). Must be positive."
        },
        "launchAngleDegrees": {
          "type": "number",
          "description": "Launch elevation angle theta relative to the horizontal plane in degrees (0 to 90 inclusive)."
        },
        "gravityMs2": {
          "type": "number",
          "default": 9.80665,
          "description": "Local gravitational acceleration constant g in m/s^2. Default is 9.80665 (standard Earth gravity)."
        }
      },
      "required": [
        "initialVelocityMs",
        "launchAngleDegrees"
      ]
    }
  },
  {
    "name": "truecalci_black_scholes",
    "description": "Compute quantitative finance European option pricing (Call and Put values) and analytical Greeks (Delta, Gamma, Vega, Theta, Rho) via the Black-Scholes-Merton model.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Computes d1 = (ln(S/K) + (r + sigma^2 / 2)*T) / (sigma * sqrt(T)) and d2 = d1 - sigma * sqrt(T). Evaluates standard normal cumulative distribution N(d) and probability density N'(d) using high-precision polynomial approximations. Returns exact call/put prices, put-call parity check, and all major first- and second-order Greeks.\n\nUsage Guidelines: Use for financial derivatives pricing, risk management, and options strategy hedging. Do not use for project capital budgeting or cash flow discounting; use npv_irr instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "spotPrice": {
          "type": "number",
          "default": 100,
          "description": "Current market spot price of the underlying asset S in currency units. Must be positive."
        },
        "strikePrice": {
          "type": "number",
          "default": 100,
          "description": "Agreed option strike exercise price K in currency units. Must be positive."
        },
        "timeToExpiryYears": {
          "type": "number",
          "default": 1,
          "description": "Time remaining until contract expiration T in years (e.g. 0.5 for 6 months, 1 for 1 year). Must be positive."
        },
        "riskFreeRate": {
          "type": "number",
          "default": 0.045,
          "description": "Annualized risk-free interest rate r expressed as decimal (0.045) or percentage (4.5)."
        },
        "volatility": {
          "type": "number",
          "default": 0.25,
          "description": "Annualized implied volatility sigma expressed as decimal (0.25) or percentage (25). Must be positive."
        }
      },
      "required": [
        "spotPrice",
        "strikePrice",
        "timeToExpiryYears"
      ]
    }
  },
  {
    "name": "truecalci_linear_regression",
    "description": "Compute Ordinary Least Squares (OLS) bivariate linear regression best-fit trend line (y = m*x + c), Pearson correlation coefficient (r), and coefficient of determination (R^2).\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Evaluates sample means, covariance, and variances to solve slope m = Cov(X,Y) / Var(X) and intercept c = mean(Y) - m*mean(X). Computes Pearson r, R^2, standard error of estimate, and generates predicted y-values for each input x.\n\nUsage Guidelines: Use for trend forecasting, scientific scatter data fitting, and correlation analysis. Do not use for solving analytical quadratic or linear systems; use casio_991_solve instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "points": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number",
                "description": "Independent variable X coordinate value."
              },
              "y": {
                "type": "number",
                "description": "Dependent variable Y coordinate value."
              }
            },
            "required": [
              "x",
              "y"
            ]
          },
          "description": "Array of {x, y} coordinate objects representing bivariate observations. Minimum 2 points required."
        }
      },
      "required": [
        "points"
      ]
    }
  },
  {
    "name": "truecalci_pipe_flow",
    "description": "Calculate fluid dynamics Darcy-Weisbach friction factor, Reynolds number (flow regime), head loss, and pressure drop in closed circular pipes.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Computes cross-sectional area, mean flow velocity v = Q / A, and Reynolds number Re = (rho * v * D) / mu. Identifies laminar (Re < 2000, f = 64/Re) vs turbulent (Re >= 4000, solved via Swamee-Jain explicit approximation of Colebrook-White equation). Returns head loss h_f in meters and pressure drop delta_P in Pascals and bar.\n\nUsage Guidelines: Use for hydraulic design, water supply piping, chemical processing lines, and HVAC pipe sizing. Do not use for structural beam stress; use beam_bending instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "flowRateM3s": {
          "type": "number",
          "default": 0.05,
          "description": "Volumetric fluid flow rate Q in cubic meters per second (m^3/s). Must be positive."
        },
        "pipeDiameterM": {
          "type": "number",
          "default": 0.15,
          "description": "Internal pipe diameter D in meters (m). Must be positive."
        },
        "pipeLengthM": {
          "type": "number",
          "default": 100,
          "description": "Total linear pipe run length L in meters (m). Must be positive."
        },
        "fluidDensityKgM3": {
          "type": "number",
          "default": 1000,
          "description": "Fluid mass density rho in kg/m^3 (e.g. 1000 for water at 20°C)."
        },
        "dynamicViscosityPaS": {
          "type": "number",
          "default": 0.001,
          "description": "Dynamic fluid viscosity mu in Pascal-seconds (Pa·s) (e.g. 0.001 for water)."
        },
        "pipeRoughnessM": {
          "type": "number",
          "default": 0.000045,
          "description": "Absolute internal pipe wall surface roughness epsilon in meters (e.g. 0.000045 for commercial steel)."
        }
      },
      "required": [
        "flowRateM3s",
        "pipeDiameterM",
        "pipeLengthM"
      ]
    }
  },
  {
    "name": "truecalci_rlc_circuit",
    "description": "Calculate AC electrical resonance properties for series RLC circuits: resonant frequency (f0), quality factor (Q), bandwidth (BW), and complex impedance magnitude at an operating frequency.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Evaluates angular resonant frequency omega0 = 1 / sqrt(L * C) and f0 = omega0 / (2 * pi); Q-factor = (1 / R) * sqrt(L / C); Bandwidth BW = f0 / Q. For a specified frequency f, calculates inductive reactance X_L = 2*pi*f*L, capacitive reactance X_C = 1 / (2*pi*f*C), total impedance Z = sqrt(R^2 + (X_L - X_C)^2), and phase angle phi.\n\nUsage Guidelines: Use for RF tuning, audio filter design, and electrical circuit frequency response analysis. Do not use for power grid transmission lines or mechanical vibrations.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "resistanceOhms": {
          "type": "number",
          "default": 50,
          "description": "Circuit series electrical resistance R in Ohms (Ω). Must be positive."
        },
        "inductanceHenrys": {
          "type": "number",
          "default": 0.01,
          "description": "Circuit inductance L in Henrys (H). Must be positive."
        },
        "capacitanceFarads": {
          "type": "number",
          "default": 0.000001,
          "description": "Circuit capacitance C in Farads (F). Must be positive."
        },
        "frequencyHz": {
          "type": "number",
          "description": "Optional operating AC frequency f in Hertz (Hz) to evaluate AC impedance magnitude and phase angle."
        }
      },
      "required": [
        "resistanceOhms",
        "inductanceHenrys",
        "capacitanceFarads"
      ]
    }
  },
  {
    "name": "truecalci_rocket_deltav",
    "description": "Calculate aerospace orbital mechanics delta-v budget, mass ratio, and propellant consumption using the Tsiolkovsky rocket equation.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Evaluates Tsiolkovsky equation: Delta-v = Isp * g0 * ln(m0 / mf). Calculates effective exhaust velocity c = Isp * g0, propellant mass consumed m_p = m0 - mf, and propellant mass fraction. Returns delta-v in m/s and km/s.\n\nUsage Guidelines: Use for rocket stage sizing, orbital insertion maneuver budgets (LEO, GEO, translunar), and mission delta-v planning. Do not use for ballistic atmospheric projectile flight; use projectile_motion instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "initialMassKg": {
          "type": "number",
          "default": 549054,
          "description": "Wet launch mass m0 including propellant, structure, and payload in kilograms (kg). Must be greater than finalMassKg."
        },
        "finalMassKg": {
          "type": "number",
          "default": 22200,
          "description": "Dry burnout mass mf after propellant exhaustion in kilograms (kg). Must be positive."
        },
        "specificImpulseSeconds": {
          "type": "number",
          "default": 311,
          "description": "Rocket engine effective specific impulse Isp in seconds (e.g. 311 for Merlin 1D sea level, 450 for RL10 vacuum). Must be positive."
        },
        "gravityMs2": {
          "type": "number",
          "default": 9.80665,
          "description": "Standard gravitational acceleration constant g0 in m/s^2. Default is 9.80665."
        }
      },
      "required": [
        "initialMassKg",
        "finalMassKg",
        "specificImpulseSeconds"
      ]
    }
  },
  {
    "name": "truecalci_ai_token_arbitrage",
    "description": "Calculate multi-provider LLM API inference costs, prompt caching economics (up to 90% discount), batch discounts, and cost disparity across Claude 3.5 Sonnet, GPT-4o, DeepSeek V3/R1, and Gemini 1.5 Pro/Flash.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Models official pricing cards per million input/output tokens. Incorporates prompt cache hit pricing reductions and asynchronous batch API discounts (50%). Returns comprehensive cost comparison matrix, cheapest model recommendation, cache savings, and cost multiples relative to the lowest-cost model.\n\nUsage Guidelines: Use when budgeting AI agent inference costs, evaluating LLM providers, or deciding whether to implement prompt caching. Do not use for general cloud bandwidth transfer costs; use cloud_egress_finops instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "promptTokens": {
          "type": "number",
          "default": 5000,
          "description": "Number of input prompt tokens per API call. Must be an integer >= 0."
        },
        "completionTokens": {
          "type": "number",
          "default": 1000,
          "description": "Number of generated output completion tokens per API call. Must be an integer >= 0."
        },
        "cacheHitRatio": {
          "type": "number",
          "default": 0.8,
          "description": "Proportion of input prompt tokens served from cache (0.0 to 1.0 or 0 to 100%). Default is 0.80 (80%)."
        },
        "isBatch": {
          "type": "boolean",
          "default": false,
          "description": "Whether the 50% asynchronous batch processing discount applies."
        }
      }
    }
  },
  {
    "name": "truecalci_startup_runway_dilution",
    "description": "Model early-stage startup cash runway calendar exhaustion date, Post-Money SAFE note conversion cap dilution, and Series A unallocated option pool shuffle waterfall.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Computes net burn = grossBurn - revenue; Runway months = cashOnHand / netBurn. Models post-money SAFE equity percentage = safeInvestment / postMoneyCap. Simulates Series A pre-money option pool expansion (diluting existing holders prior to lead investor entry) and calculates founder post-financing ownership percentage.\n\nUsage Guidelines: Use for venture capital fundraising planning, startup cash runway tracking, and cap table dilution modeling. Do not use for discounted cash flow or IRR project appraisal; use npv_irr instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "cashOnHand": {
          "type": "number",
          "default": 750000,
          "description": "Current cash reserves in bank in USD ($). Must be positive."
        },
        "monthlyGrossBurn": {
          "type": "number",
          "default": 65000,
          "description": "Total monthly cash operating expenses in USD ($/mo). Must be positive."
        },
        "monthlyRevenue": {
          "type": "number",
          "default": 15000,
          "description": "Monthly recurring revenue (MRR) or cash collections in USD ($/mo). Default is 15000."
        },
        "safeInvestment": {
          "type": "number",
          "default": 1000000,
          "description": "Total capital raised via Post-Money SAFE notes in USD ($)."
        },
        "postMoneyCap": {
          "type": "number",
          "default": 10000000,
          "description": "Agreed valuation cap on the Post-Money SAFEs in USD ($)."
        },
        "seriesAInvestment": {
          "type": "number",
          "default": 3000000,
          "description": "New equity capital invested by Series A lead investors in USD ($)."
        },
        "seriesAPreMoney": {
          "type": "number",
          "default": 15000000,
          "description": "Agreed Series A pre-money company valuation in USD ($)."
        },
        "optionPoolExpansionPercent": {
          "type": "number",
          "default": 10,
          "description": "Required post-closing unallocated employee stock option pool percentage (e.g. 10 for 10%)."
        }
      }
    }
  },
  {
    "name": "truecalci_b2b_withholding_risk",
    "description": "Calculate cross-border B2B consulting/software invoice tax gross-up, statutory vs DTAA bilateral tax treaty withholding rates (Form W-8BEN/W-8BEN-E), and Permanent Establishment (183-day) tax audit exposure.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Computes required gross invoice amount: Gross = Net / (1 - WHT_rate). Analyzes treaty tax relief savings (Statutory WHT vs Treaty WHT) and triggers high-risk Permanent Establishment alert if physical presence exceeds the 183-day international treaty threshold.\n\nUsage Guidelines: Use when exporting services cross-border or structuring international client contracts subject to foreign withholding tax. Do not use for digital nomad individual income tax exclusion; use feie_nomad_tracker instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "invoiceNetRequired": {
          "type": "number",
          "default": 50000,
          "description": "Net spendable cash amount required to be landed in exporter account in USD ($). Must be positive."
        },
        "statutoryRatePercent": {
          "type": "number",
          "default": 30,
          "description": "Foreign client country statutory withholding tax rate percentage (e.g. 30 for 30%). Default is 30.0."
        },
        "treatyRatePercent": {
          "type": "number",
          "default": 15,
          "description": "Reduced withholding tax rate percentage under applicable bilateral Double Tax Avoidance Agreement (DTAA) (e.g. 0, 10, 15%)."
        },
        "daysInCountry": {
          "type": "number",
          "default": 195,
          "description": "Cumulative physical days spent in client jurisdiction over a rolling 12-month period. Values over 183 trigger Permanent Establishment audit risk."
        }
      }
    }
  },
  {
    "name": "truecalci_feie_nomad_tracker",
    "description": "Track IRS Form 2555 Foreign Earned Income Exclusion (FEIE) Physical Presence Test eligibility (330 full foreign days in rolling 365 days), statutory exclusion cap ($130,000 for 2025), and US sticky domicile audit risks (CA, NY, VA, SC).\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Evaluates whether daysOutsideUSInRollingPeriod meets the mandatory 330-day threshold. Applies statutory maximum exclusion limit ($126,500 for 2024, $130,000 for 2025), computes tax liability on excess income, and flags aggressive state revenue agency sticky domicile rules.\n\nUsage Guidelines: Use for US citizen digital nomads and expats evaluating foreign earned income tax exemptions under IRS Section 911. Do not use for foreign corporate withholding tax; use b2b_withholding_risk instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "foreignEarnedIncome": {
          "type": "number",
          "default": 160000,
          "description": "Total annual compensation earned while working outside the US in USD ($). Must be positive."
        },
        "daysOutsideUSInRollingPeriod": {
          "type": "number",
          "default": 334,
          "description": "Number of full 24-hour qualifying foreign days spent outside the US within any rolling 365-day period. Must be >= 330 to qualify."
        },
        "taxYear": {
          "type": "number",
          "default": 2025,
          "description": "Applicable US federal tax filing year (2024, 2025, or 2026)."
        },
        "stateDomicile": {
          "type": "string",
          "default": "CA",
          "description": "Two-letter postal code of taxpayer's last or current US state domicile (e.g. CA, NY, TX, FL). High-audit states (CA, NY, VA, SC) trigger domicile warnings."
        },
        "effectiveTaxBracketPercent": {
          "type": "number",
          "default": 24,
          "description": "Estimated federal marginal tax rate percentage applied to income exceeding the statutory cap (e.g. 24 for 24%)."
        }
      }
    }
  },
  {
    "name": "truecalci_cloud_egress_finops",
    "description": "Analyze tiered AWS/GCP public cloud internet data transfer egress pricing versus Cloudflare Zero-Egress Bandwidth Alliance and edge caching proxies, quantifying monthly and annual infrastructure cost savings.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Calculates tiered AWS/GCP egress charges ($0.09/GB for first 10TB, $0.085/GB for next 40TB, $0.07/GB for next 100TB, $0.05/GB beyond). Models edge cache offload reduction and compares against Cloudflare zero-egress routing. Returns monthly and annual gross egress costs, post-cache costs, and total net savings.\n\nUsage Guidelines: Use for cloud architecture budgeting, FinOps reviews, and evaluating CDN caching or Cloudflare migration economics. Do not use for LLM token pricing; use ai_token_arbitrage instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "monthlyEgressGB": {
          "type": "number",
          "default": 50000,
          "description": "Monthly public internet outbound data transfer volume in Gigabytes (GB) (e.g. 50000 for 50 TB). Must be positive."
        },
        "cacheHitRatio": {
          "type": "number",
          "default": 0.85,
          "description": "Expected CDN edge caching hit ratio as a decimal (0.0 to 1.0) or percentage (0 to 100%). Default is 0.85 (85%)."
        }
      }
    }
  },
  {
    "name": "truecalci_ppf_calculator",
    "description": "Calculate Indian Public Provident Fund (PPF) statutory 7.1% compounding, annual deposits, and 15-year EEE tax-free maturity corpus.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Applies statutory monthly minimum-balance compounding at 7.1% per annum. Returns 15-year maturity value, total deposit, total interest earned, and annual accumulation schedule.\n\nUsage Guidelines: Use for Indian sovereign tax-saving PPF retirement accounts. Do not use for US retirement accounts; use solo_401k_shield instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "yearlyDeposit": {
          "type": "number",
          "default": 150000,
          "description": "Annual deposit in INR (max ₹1.5L)"
        },
        "tenureYears": {
          "type": "integer",
          "default": 15,
          "description": "Tenure in years (minimum 15)"
        }
      }
    }
  },
  {
    "name": "truecalci_ssy_calculator",
    "description": "Calculate Sukanya Samriddhi Yojana (SSY) sovereign 8.2% compounding, 15-year contribution window, and 21-year maturity corpus.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Applies 8.2% annual compound interest on annual deposits for 15 contribution years followed by 6 non-contribution compounding years. Returns 21-year tax-free maturity corpus.\n\nUsage Guidelines: Use for Indian SSY girl child sovereign savings accounts. Do not use for generic compound interest; use compound_wealth instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "yearlyDeposit": {
          "type": "number",
          "default": 150000,
          "description": "Annual deposit in INR (max ₹1.5L)"
        },
        "annualInterestRate": {
          "type": "number",
          "default": 8.2,
          "description": "Statutory annual interest rate %"
        }
      }
    }
  },
  {
    "name": "truecalci_fd_calculator",
    "description": "Calculate bank Fixed Deposit (FD) quarterly compounding maturity amount, APY, and interest accrued.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Applies quarterly compounding formula: A = P * (1 + r/4)^(4*t). Returns total maturity amount, principal deposited, total interest earned, and effective APY.\n\nUsage Guidelines: Use for bank fixed deposit maturity and term investment appraisal. Do not use for equity mutual fund investments; use sip_investment or compound_wealth instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "principal": {
          "type": "number",
          "default": 500000,
          "description": "Deposit principal amount"
        },
        "interestRate": {
          "type": "number",
          "default": 7.25,
          "description": "Annual interest rate %"
        },
        "tenureYears": {
          "type": "number",
          "default": 5,
          "description": "Tenure in years"
        },
        "payoutType": {
          "type": "string",
          "enum": [
            "cumulative",
            "payout"
          ],
          "default": "cumulative",
          "description": "Interest payout mode: 'cumulative' (compounded quarterly and paid at maturity) or 'payout' (regular periodic interest payout)."
        }
      },
      "required": [
        "principal",
        "interestRate"
      ]
    }
  },
  {
    "name": "truecalci_gold_jewellery",
    "description": "Calculate 22K/24K gold valuation, making charges, and statutory 3% GST invoice total under BIS Hallmarking standards.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Computes Net Gold Cost = grams * ratePerGram; Making Charges = Net Gold Cost * (makingChargesPercent / 100); GST = (Net Gold Cost + Making Charges) * (gstRatePercent / 100). Returns itemized invoice breakdown.\n\nUsage Guidelines: Use for physical gold jewellery purchasing and invoice verification. Do not use for financial derivative options on gold; use black_scholes instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "grams": {
          "type": "number",
          "default": 25,
          "description": "Net gold weight in grams"
        },
        "ratePerGram": {
          "type": "number",
          "default": 7200,
          "description": "Gold rate per gram in currency (e.g. ₹7,200/g)"
        },
        "makingChargesPercent": {
          "type": "number",
          "default": 12,
          "description": "Making charges %"
        },
        "gstRatePercent": {
          "type": "number",
          "default": 3,
          "description": "Statutory GST % (standard 3%)"
        }
      },
      "required": [
        "grams",
        "ratePerGram"
      ]
    }
  },
  {
    "name": "truecalci_npv_irr",
    "description": "Compute Net Present Value (NPV), Internal Rate of Return (IRR) via iterative Newton-Raphson polynomial convergence, and discounted payback period for capital budgeting and investment appraisal.\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Evaluates NPV = -C0 + sum(Ct / (1 + r)^t). Computes exact IRR by finding the discount rate where NPV equals zero using up to 100 Newton-Raphson iterations with tolerance 1e-7. Returns NPV, IRR percentage, profitability index (PI), and payback period in periods/years.\n\nUsage Guidelines: Use for evaluating capital investments, M&A valuations, corporate projects, and multi-year cash flow hurdle rates. Do not use for simple compound interest projections with fixed monthly deposits; use compound_wealth instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "initialInvestment": {
          "type": "number",
          "default": 100000,
          "description": "Upfront initial capital outlay at period 0 in currency units. Entered as a positive number (treated as cash outflow). Must be positive."
        },
        "cashflows": {
          "type": "array",
          "items": {
            "type": "number",
            "description": "Net cash inflow amount for this sequential period in currency units."
          },
          "default": [
            30000,
            40000,
            50000,
            20000
          ],
          "description": "Series of sequential periodic net cash inflows starting from period 1 onwards. Minimum 1 cash flow required."
        },
        "discountRatePercent": {
          "type": "number",
          "default": 10,
          "description": "Annual cost of capital or hurdle discount rate percentage (e.g. 10.0 for 10%)."
        }
      },
      "required": [
        "initialInvestment",
        "cashflows"
      ]
    }
  },
  {
    "name": "truecalci_cagr_inflation",
    "description": "Calculate Compound Annual Growth Rate (CAGR), real inflation-adjusted purchasing power growth (Fisher equation), and exact investment doubling time (Rule of 72 exact logarithmic solution).\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Computes Nominal CAGR = (finalValue / initialValue)^(1 / periodsYears) - 1. Computes Real CAGR using the exact Fisher relation: (1 + Nominal) / (1 + Inflation) - 1. Computes exact doubling horizon = ln(2) / ln(1 + Nominal). Returns nominal CAGR %, real CAGR %, total nominal gain, total real purchasing power gain, and doubling years.\n\nUsage Guidelines: Use for evaluating historical investment portfolio track records, business revenue growth metrics, and inflation drag analysis. Do not use for forward-looking recurring monthly investment projections; use compound_wealth or sip_investment instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "initialValue": {
          "type": "number",
          "default": 50000,
          "description": "Beginning portfolio, asset, or revenue valuation in currency units. Must be positive."
        },
        "finalValue": {
          "type": "number",
          "default": 100000,
          "description": "Ending portfolio, asset, or revenue valuation in currency units. Must be positive."
        },
        "periodsYears": {
          "type": "number",
          "default": 5,
          "description": "Total elapsed duration in years (can be fractional, e.g. 2.5 or 5). Must be greater than 0."
        },
        "inflationRatePercent": {
          "type": "number",
          "default": 2.5,
          "description": "Annualized inflation rate percentage over the period (e.g. 2.5 for 2.5%)."
        }
      },
      "required": [
        "initialValue",
        "finalValue",
        "periodsYears"
      ]
    }
  },
  {
    "name": "truecalci_breakeven_margin",
    "description": "Calculate cost-volume-profit break-even thresholds in units and revenue, contribution margin ratio, operational margin of safety, and degree of operating leverage (DOL).\n\nBehavior: Deterministic, idempotent calculation with zero external side effects. Computes Unit Contribution Margin = unitPrice - unitVariableCost; Contribution Margin Ratio = CM / unitPrice; Break-Even Units = fixedCosts / CM; Break-Even Revenue = Break-Even Units * unitPrice. If expected units sold is provided, computes Margin of Safety = (expectedUnits - breakEvenUnits) / expectedUnits and Degree of Operating Leverage. Returns detailed breakdown.\n\nUsage Guidelines: Use for pricing strategy, manufacturing and SaaS unit economics, and operational risk appraisal. Do not use for hourly freelance billing rate minimums; use billable_floor instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fixedCosts": {
          "type": "number",
          "default": 10000,
          "description": "Total periodic fixed operating overhead costs in currency units (rent, salaries, software). Must be positive."
        },
        "unitPrice": {
          "type": "number",
          "default": 50,
          "description": "Selling price per individual product or service unit in currency units. Must be greater than unitVariableCost."
        },
        "unitVariableCost": {
          "type": "number",
          "default": 20,
          "description": "Direct variable cost incurred per unit produced or delivered in currency units. Must be non-negative."
        },
        "expectedUnitsSold": {
          "type": "number",
          "default": 500,
          "description": "Projected sales volume in units to evaluate operational margin of safety and operating leverage."
        }
      },
      "required": [
        "fixedCosts",
        "unitPrice",
        "unitVariableCost"
      ]
    }
  }
];

const MCP_RESOURCES = [
  {
    "uri": "truecalci://docs/system-architecture",
    "name": "TrueCalci Mathematical Architecture & Engine Index",
    "description": "System architecture, statutory standards, bit-exact IEEE-754 precision standards, and full directory of all 28 deterministic engines.",
    "mimeType": "text/markdown"
  },
  {
    "uri": "truecalci://statutory/irs-2025-limits",
    "name": "IRS Notice 2023-75 & 2025 Statutory Tax & Retirement Limits",
    "description": "Standard deductions, FICA wage base caps, Solo 401(k) / SEP-IRA additions limits ($69k / $76.5k), and Section 199A QBI statutory thresholds.",
    "mimeType": "application/json"
  },
  {
    "uri": "truecalci://statutory/india-budget-2025",
    "name": "India Union Budget 2025-26 New vs Old Tax Regime Slabs",
    "description": "Statutory slab rates for FY 2025-26 (AY 2026-27), Section 87A full rebate up to ₹12 Lakhs, ₹75,000 standard deduction, and surcharge bands.",
    "mimeType": "application/json"
  },
  {
    "uri": "truecalci://benchmarks/cross-border-fx-rails",
    "name": "Cross-Border Payout Rails Fee Schedule & Benchmark Spreads",
    "description": "Fee drag matrix, wire costs, and percentage FX markups across Wise, Deel, Stripe, Payoneer, PayPal, and SWIFT wires across 9 global currencies.",
    "mimeType": "application/json"
  },
  {
    "uri": "truecalci://formulas/engineering-physics",
    "name": "Engineering & Physics Deterministic Formulations Reference",
    "description": "Governing mathematical equations for Euler-Bernoulli beam deflection, Darcy-Weisbach pipe friction, Tsiolkovsky rocket delta-v, and RLC resonance.",
    "mimeType": "text/markdown"
  }
];

const MCP_RESOURCE_TEMPLATES = [
  {
    "uriTemplate": "truecalci://formulas/{calculator_id}",
    "name": "Calculator Formula & Engineering Model Specification",
    "description": "Retrieve exact mathematical equations, boundary conditions, and IEEE-754 precision parameters for any of the 28 engines.",
    "mimeType": "application/json"
  },
  {
    "uriTemplate": "truecalci://statutory/tax-slabs/{jurisdiction}",
    "name": "Statutory Tax Slabs & Deductions by Jurisdiction",
    "description": "Retrieve statutory tax brackets, deduction rules, and compliance requirements for 'us' or 'india'.",
    "mimeType": "application/json"
  }
];

const MCP_PROMPTS = [
  {
    "name": "audit_contractor_vs_w2_offer",
    "description": "Complete financial and statutory evaluation comparing a W-2 salaried offer vs a 1099 contractor billing rate, identifying true breakeven ($/hr), benefits drag, and optimal business entity structure.",
    "arguments": [
      {
        "name": "w2_salary",
        "description": "W-2 gross annual salary offered in USD ($/yr)",
        "required": true
      },
      {
        "name": "contractor_hourly_rate",
        "description": "Proposed 1099 contractor hourly billing rate in USD ($/hr)",
        "required": true
      },
      {
        "name": "filing_status",
        "description": "IRS tax filing status: 'single' or 'mfj' (default 'single')",
        "required": false
      },
      {
        "name": "state_code",
        "description": "Two-letter US state postal code (e.g. CA, NY, TX, WA) for state income tax context",
        "required": false
      }
    ]
  },
  {
    "name": "plan_scorp_and_solo_401k_tax_shield",
    "description": "Strategic tax restructuring workflow for high-earning freelancers and single-member LLCs: models reasonable salary under IRS Rev. Rul. 74-44, FICA tax shield, overhead netting, and maximum Solo 401(k) pre-tax retirement deductions.",
    "arguments": [
      {
        "name": "net_profit",
        "description": "Projected annual business net profit before owner compensation ($/yr)",
        "required": true
      },
      {
        "name": "is_age_50_plus",
        "description": "Whether account owner is age 50 or older for $7,500 catch-up contribution ('true' or 'false')",
        "required": false
      }
    ]
  },
  {
    "name": "solve_freelance_billable_floor",
    "description": "Calculate the non-negotiable minimum billable hourly rate required to achieve a target spendable cash income, factoring in unpaid vacation weeks, non-billable administrative drag, health insurance, and self-employment taxes.",
    "arguments": [
      {
        "name": "target_net_cash",
        "description": "Target take-home cash spendable income needed in USD ($/yr)",
        "required": true
      },
      {
        "name": "annual_expenses",
        "description": "Annual deductible business operating overhead in USD ($/yr)",
        "required": false
      },
      {
        "name": "vacation_weeks",
        "description": "Planned weeks off per year for vacation, holidays, and sick leave (default 4)",
        "required": false
      }
    ]
  },
  {
    "name": "evaluate_commercial_mortgage_refinance",
    "description": "Comprehensive mortgage PITI and amortization analysis: models down payment equity, monthly principal and interest, property taxes, hazard insurance, and PMI termination thresholds.",
    "arguments": [
      {
        "name": "home_price",
        "description": "Purchase price or appraised home valuation ($)",
        "required": true
      },
      {
        "name": "down_payment_percent",
        "description": "Down payment percentage (e.g. 10 or 20 for 10% / 20%)",
        "required": false
      },
      {
        "name": "interest_rate",
        "description": "Annual fixed mortgage interest rate percentage (e.g. 6.8 for 6.8%)",
        "required": true
      }
    ]
  },
  {
    "name": "appraise_capital_investment_npv_irr",
    "description": "Corporate capital budgeting appraisal: calculates Net Present Value (NPV), exact Internal Rate of Return (IRR) via Newton-Raphson polynomial convergence, profitability index, and discounted payback periods.",
    "arguments": [
      {
        "name": "initial_investment",
        "description": "Upfront capital investment outlay at period 0 ($)",
        "required": true
      },
      {
        "name": "cashflows",
        "description": "Comma-separated list of expected sequential net cash inflows (e.g. 30000,40000,50000,20000)",
        "required": true
      },
      {
        "name": "discount_rate_percent",
        "description": "Annual cost of capital or hurdle discount rate percentage (default 10)",
        "required": false
      }
    ]
  }
];

const RESOURCE_CONTENTS = {
  "truecalci://docs/system-architecture": {
    "mimeType": "text/markdown",
    "text": "# TrueCalci Deterministic Mathematical Architecture\n\n## System Overview\nTrueCalci is a zero-hallucination, bit-exact computational engine deployed globally on Cloudflare Workers edge runtime. It provides 28 specialized mathematical engines covering statutory taxation, corporate finance, capital budgeting, physics kinematics, and structural engineering.\n\n## Zero-Hallucination Guarantees\n1. **Deterministic Execution**: All numerical evaluations use direct algebraic closed-form algorithms or iterative polynomial solvers with strict convergence tolerance (1e-7).\n2. **Zero-Byte Retention**: No inputs, outputs, or client identities are ever written to disk or third-party databases. Every calculation executes entirely in volatile edge memory and evaporates upon response completion.\n3. **IEEE-754 Precision**: Operations strictly conform to double-precision floating-point arithmetic standards with explicit boundary and division-by-zero guards.\n\n## Directory of 28 Computational Engines\n- **Statutory Taxation & Labor Economics**: contractor_parity, scorp_optimizer, solo_401k_shield, billable_floor, b2b_withholding_risk, feie_nomad_tracker, indian_income_tax, vat_sales_tax.\n- **Corporate Finance & FinOps**: ai_token_arbitrage, startup_runway_dilution, cloud_egress_finops, npv_irr, cagr_inflation, breakeven_margin, fx_invoicing.\n- **Personal Wealth & Banking**: mortgage_piti, home_loan_emi, compound_wealth, sip_investment, tip_splitter.\n- **Engineering & Classical Physics**: beam_bending, projectile_motion, pipe_flow, rlc_circuit, rocket_deltav, casio_991_solve, linear_regression, black_scholes."
  },
  "truecalci://statutory/irs-2025-limits": {
    "mimeType": "application/json",
    "text": "{\n  \"tax_year\": 2025,\n  \"statutory_notice\": \"IRS Notice 2024-80 / Rev. Proc. 2024-40\",\n  \"standard_deduction\": {\n    \"single\": 15000,\n    \"married_filing_jointly\": 30000,\n    \"head_of_household\": 22500\n  },\n  \"fica_wage_base\": {\n    \"social_security_cap_2024\": 168600,\n    \"social_security_cap_2025\": 176100,\n    \"social_security_rate_employee\": 0.062,\n    \"social_security_rate_employer\": 0.062,\n    \"medicare_rate_employee\": 0.0145,\n    \"medicare_rate_employer\": 0.0145,\n    \"additional_medicare_threshold_single\": 200000,\n    \"additional_medicare_rate\": 0.009\n  },\n  \"retirement_contributions\": {\n    \"solo_401k_employee_elective_deferral\": 23500,\n    \"solo_401k_age_50_catchup\": 7500,\n    \"solo_401k_total_additions_cap\": 70000,\n    \"solo_401k_total_additions_with_catchup\": 77500,\n    \"sep_ira_maximum_contribution\": 70000,\n    \"sep_ira_percentage_net_adjusted_earnings\": 0.2,\n    \"sep_ira_percentage_w2_salary\": 0.25\n  },\n  \"section_199a_qbi\": {\n    \"maximum_deduction_percentage\": 0.2,\n    \"phasein_threshold_single\": 197300,\n    \"phasein_threshold_mfj\": 394600\n  },\n  \"foreign_earned_income_exclusion\": {\n    \"statutory_cap_2024\": 126500,\n    \"statutory_cap_2025\": 130000,\n    \"physical_presence_qualifying_days\": 330,\n    \"rolling_window_days\": 365\n  }\n}"
  },
  "truecalci://statutory/india-budget-2025": {
    "mimeType": "application/json",
    "text": "{\n  \"assessment_year\": \"AY 2026-27\",\n  \"financial_year\": \"FY 2025-26\",\n  \"statutory_basis\": \"Union Budget 2025-26 Finance Bill\",\n  \"new_tax_regime_slabs\": [\n    {\n      \"min\": 0,\n      \"max\": 400000,\n      \"rate_percent\": 0\n    },\n    {\n      \"min\": 400001,\n      \"max\": 800000,\n      \"rate_percent\": 5\n    },\n    {\n      \"min\": 800001,\n      \"max\": 1200000,\n      \"rate_percent\": 10\n    },\n    {\n      \"min\": 1200001,\n      \"max\": 1600000,\n      \"rate_percent\": 15\n    },\n    {\n      \"min\": 1600001,\n      \"max\": 2000000,\n      \"rate_percent\": 20\n    },\n    {\n      \"min\": 2000001,\n      \"max\": 2400000,\n      \"rate_percent\": 25\n    },\n    {\n      \"min\": 2400001,\n      \"max\": null,\n      \"rate_percent\": 30\n    }\n  ],\n  \"section_87a_rebate\": {\n    \"rebate_threshold\": 1200000,\n    \"effective_tax_up_to_threshold\": 0,\n    \"statutory_maximum_rebate_inr\": 60000\n  },\n  \"standard_deduction\": {\n    \"salaried_inr\": 75000,\n    \"pensioners_inr\": 75000\n  },\n  \"health_and_education_cess_percent\": 4\n}"
  },
  "truecalci://benchmarks/cross-border-fx-rails": {
    "mimeType": "application/json",
    "text": "{\n  \"benchmark_basis\": \"Mid-Market Exchange Rate Interbank Zero-Markup\",\n  \"supported_currencies\": [\n    \"EUR\",\n    \"GBP\",\n    \"CAD\",\n    \"AUD\",\n    \"INR\",\n    \"SGD\",\n    \"BRL\",\n    \"MXN\",\n    \"PHP\"\n  ],\n  \"rails\": {\n    \"wise\": {\n      \"wire_flat_fee_usd\": 0,\n      \"platform_fee_percent\": 0.45,\n      \"fx_spread_percent\": 0.1,\n      \"total_drag_percent\": 0.55\n    },\n    \"deel\": {\n      \"wire_flat_fee_usd\": 5,\n      \"platform_fee_percent\": 1,\n      \"fx_spread_percent\": 0.5,\n      \"total_drag_percent\": 1.5\n    },\n    \"stripe\": {\n      \"wire_flat_fee_usd\": 0,\n      \"platform_fee_percent\": 2.9,\n      \"fx_spread_percent\": 1,\n      \"total_drag_percent\": 3.9\n    },\n    \"payoneer\": {\n      \"wire_flat_fee_usd\": 15,\n      \"platform_fee_percent\": 1,\n      \"fx_spread_percent\": 2,\n      \"total_drag_percent\": 3\n    },\n    \"paypal\": {\n      \"wire_flat_fee_usd\": 0,\n      \"platform_fee_percent\": 4.4,\n      \"fx_spread_percent\": 3.5,\n      \"total_drag_percent\": 7.9\n    },\n    \"wire\": {\n      \"wire_flat_fee_usd\": 45,\n      \"platform_fee_percent\": 0,\n      \"fx_spread_percent\": 2.5,\n      \"total_drag_percent\": 2.95\n    }\n  }\n}"
  },
  "truecalci://formulas/engineering-physics": {
    "mimeType": "text/markdown",
    "text": "# Governing Engineering & Classical Physics Formulations\n\n### 1. Euler-Bernoulli Beam Mechanics\nFor a simply supported beam of span L with center point load P:\n- **Maximum Bending Moment**: M_max = (P * L) / 4 [N*m]\n- **Maximum Elastic Deflection**: delta_max = (P * L^3) / (48 * E * I) [meters]\n- **Peak Flexural Stress**: sigma_max = (M_max * y) / I [Pascals]\n\n### 2. Fluid Dynamics (Darcy-Weisbach & Swamee-Jain)\n- **Reynolds Number**: Re = (rho * v * D) / mu\n- **Laminar Flow (Re < 2000)**: f = 64 / Re\n- **Turbulent Flow (Re >= 4000, Swamee-Jain explicit)**:\n  1 / sqrt(f) = -2 * log10( (epsilon / (3.7 * D)) + (5.74 / (Re^0.9)) )\n- **Head Loss**: h_f = f * (L / D) * (v^2 / (2 * g)) [meters]\n- **Pressure Drop**: delta_P = rho * g * h_f [Pascals]\n\n### 3. Tsiolkovsky Rocket Mechanics\n- **Ideal Delta-v**: Delta-v = Isp * g0 * ln(m0 / mf) [m/s]\n- **Effective Exhaust Velocity**: c = Isp * g0 [m/s]\n- **Propellant Mass Fraction**: zeta = 1 - (mf / m0)\n\n### 4. Black-Scholes-Merton Option Valuation\n- d1 = [ ln(S / K) + (r + sigma^2 / 2) * T ] / [ sigma * sqrt(T) ]\n- d2 = d1 - sigma * sqrt(T)\n- **European Call Price**: C = S * N(d1) - K * e^(-r * T) * N(d2)\n- **European Put Price**: P = K * e^(-r * T) * N(-d2) - S * N(-d1)\n- **Greeks**: Delta_call = N(d1), Gamma = N'(d1) / (S * sigma * sqrt(T)), Vega = S * sqrt(T) * N'(d1)."
  }
};

function readResourceContent(uri) {
  if (RESOURCE_CONTENTS[uri]) {
    return {
      contents: [
        {
          uri,
          mimeType: RESOURCE_CONTENTS[uri].mimeType,
          text: RESOURCE_CONTENTS[uri].text
        }
      ]
    };
  }

  const formulaMatch = uri.match(/^truecalci:\/\/formulas\/([a-zA-Z0-9_-]+)$/);
  if (formulaMatch) {
    const calcId = formulaMatch[1];
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify({
            calculator_id: calcId,
            precision: "IEEE-754 double precision (64-bit float)",
            retention: "Zero-byte ephemeral RAM only"
          }, null, 2)
        }
      ]
    };
  }

  const taxMatch = uri.match(/^truecalci:\/\/statutory\/tax-slabs\/(us|india)$/i);
  if (taxMatch) {
    const jur = taxMatch[1].toLowerCase();
    const sourceUri = jur === "us" ? "truecalci://statutory/irs-2025-limits" : "truecalci://statutory/india-budget-2025";
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: RESOURCE_CONTENTS[sourceUri].text
        }
      ]
    };
  }

  throw new Error(`Resource '${uri}' not found.`);
}

function getPromptResponse(name, args = {}) {
  switch (name) {
    case 'audit_contractor_vs_w2_offer': {
      const salary = args.w2_salary || 130000;
      const rate = args.contractor_hourly_rate || 85;
      const filing = args.filing_status || 'single';
      const state = args.state_code || 'US';
      return {
        description: "Audit W-2 salary vs 1099 contractor offer with exact breakeven rate",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please conduct a comprehensive financial and tax audit comparing a W-2 salaried offer of $${salary}/yr against a 1099 contractor billing rate of $${rate}/hr (filing status: ${filing}, state: ${state}).\n\n1. First, invoke the deterministic 'contractor_parity' tool with these parameters to compute the exact net spendable cash difference, FICA vs SECA tax liabilities, Section 199A QBI deduction, and exact breakeven billing rate ($/hr).\n2. Second, evaluate whether forming an S-Corporation is mathematically viable by invoking 'scorp_optimizer' with the projected contractor net profit to check FICA tax savings net of payroll and CPA corporate filing overhead.\n3. Finally, summarize the executive findings in a clear comparative table with a definitive bottom-line verdict.`
            }
          }
        ]
      };
    }
    case 'plan_scorp_and_solo_401k_tax_shield': {
      const profit = args.net_profit || 150000;
      const age50 = args.is_age_50_plus === 'true' || args.is_age_50_plus === true;
      return {
        description: "Plan S-Corp election and Solo 401(k) retirement tax shelter",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Develop a comprehensive tax sheltering strategy for an independent business generating $${profit}/yr in net business profit (Owner age 50+: ${age50}).\n\n1. Invoke 'scorp_optimizer' with netProfit=${profit} to determine the IRS Rev. Rul. 74-44 compliant salary split, distribution amount, and annual FICA tax shield after subtracting payroll and CPA overhead.\n2. Invoke 'solo_401k_shield' with netEarnings=${profit} and isAge50Plus=${age50} to calculate maximum pre-tax retirement sheltering under IRS Notice 2024-80 ($69,000 / $76,500 caps).\n3. Synthesize the findings into an actionable tax roadmap showing total immediate cash savings.`
            }
          }
        ]
      };
    }
    case 'solve_freelance_billable_floor': {
      const target = args.target_net_cash || 120000;
      const expenses = args.annual_expenses || 8000;
      const vacation = args.vacation_weeks || 4;
      return {
        description: "Solve minimum billable hourly rate to support target lifestyle budget",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Calculate the true minimum billable hourly rate required to net $${target}/yr in spendable take-home cash, assuming $${expenses}/yr in deductible business expenses and ${vacation} weeks off per year.\n\n1. Invoke 'billable_floor' with targetNetCash=${target}, annualExpenses=${expenses}, and vacationWeeks=${vacation}.\n2. Explain the impact of non-billable administrative drag (marketing, proposals, accounting) on actual billable capacity.\n3. Present the minimum hourly rate floor alongside recommended billing tier multipliers (e.g. 1.25x for safety margin).`
            }
          }
        ]
      };
    }
    case 'evaluate_commercial_mortgage_refinance': {
      const price = args.home_price || 500000;
      const down = args.down_payment_percent || 20;
      const rate = args.interest_rate || 6.8;
      return {
        description: "Evaluate residential or commercial mortgage PITI payment and amortization",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Perform a complete mortgage underwriting and amortization appraisal for a property purchase of $${price} with ${down}% down payment at ${rate}% interest.\n\n1. Invoke 'mortgage_piti' with homePrice=${price}, downPaymentPercent=${down}, and interestRate=${rate}.\n2. Break down the monthly PITI payment (Principal & Interest vs Property Tax, Insurance, and conditional PMI).\n3. Summarize total lifetime interest paid and the equity milestone progression.`
            }
          }
        ]
      };
    }
    case 'appraise_capital_investment_npv_irr': {
      const investment = args.initial_investment || 100000;
      const flows = args.cashflows ? (Array.isArray(args.cashflows) ? args.cashflows : String(args.cashflows).split(',').map(Number)) : [30000, 40000, 50000, 20000];
      const discount = args.discount_rate_percent || 10;
      return {
        description: "Capital budgeting appraisal: NPV, IRR, and payback period",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Conduct a formal capital budgeting appraisal for an initial investment outlay of $${investment} generating future cash flows of [${flows.join(', ')}] at a ${discount}% hurdle discount rate.\n\n1. Invoke 'npv_irr' with initialInvestment=${investment}, cashflows=[${flows.join(', ')}], and discountRatePercent=${discount}.\n2. Interpret the Net Present Value (NPV), exact Internal Rate of Return (IRR), and profitability index.\n3. Provide a clear investment decision recommendation based on whether IRR exceeds the cost of capital.`
            }
          }
        ]
      };
    }
    default:
      throw new Error(`Prompt '${name}' not found.`);
  }
}

const KNOWN_TOOLS = new Set([
  'contractor_parity', 'contractor_takehome_matrix',
  'scorp_optimizer', 'scorp', 'truecalci_scorp_optimizer',
  'solo_401k_shield', 'retirement', 'truecalci_solo_401k_shield',
  'fx_invoicing', 'fx', 'truecalci_fx_invoicing',
  'billable_floor', 'billable', 'truecalci_billable_floor',
  'mortgage_piti', 'mortgage',
  'vat_sales_tax', 'vat', 'truecalci_vat_sales_tax',
  'tip_splitter', 'tip',
  'compound_wealth', 'compound',
  'gst_calculator', 'gst_split', 'gst', 'truecalci_gst_calculator',
  'indian_income_tax', 'tax_in', 'tax', 'truecalci_indian_income_tax',
  'sip_investment', 'sip',
  'home_loan_emi', 'emi',
  'ppf_calculator', 'ppf', 'truecalci_ppf_calculator',
  'ssy_calculator', 'ssy', 'truecalci_ssy_calculator',
  'fd_calculator', 'fd', 'truecalci_fd_calculator',
  'gold_jewellery', 'gold', 'gold_india', 'truecalci_gold_jewellery',
  'casio_solve_quadratic', 'casio_991_solve', 'calci991_solve', 'casio',
  'beam_bending',
  'projectile_motion',
  'black_scholes', 'black_scholes_options',
  'linear_regression',
  'pipe_flow',
  'rlc_circuit',
  'rocket_deltav',
  'ai_token_arbitrage', 'ai_tokens', 'token_arbitrage',
  'startup_runway_dilution', 'startup_runway', 'dilution_solver',
  'b2b_withholding_risk', 'b2b_wht', 'withholding_risk',
  'feie_nomad_tracker', 'feie', 'nomad_tracker',
  'cloud_egress_finops', 'cloud_egress', 'egress_finops',
  'npv_irr', 'npv', 'irr', 'truecalci_npv_irr',
  'cagr_inflation', 'cagr', 'inflation_adjusted', 'truecalci_cagr_inflation',
  'breakeven_margin', 'breakeven', 'margin_of_safety', 'truecalci_breakeven_margin'
]);

function handleToolCall(name, args) {
  const norm = name.replace(/^truecalci_/, '').toLowerCase();
  if (!KNOWN_TOOLS.has(norm) && !KNOWN_TOOLS.has(name.toLowerCase())) {
    throw new Error(`Unknown tool: ${name}`);
  }
  validateEngineInput(norm, args);
  switch (norm) {
    case 'contractor_parity':
    case 'contractor_takehome_matrix':
      return ContractorMatrixEngine.calculateParity(
        {
          salary: Number(args.w2Salary || args.salary || 130000),
          filingStatus: args.filingStatus || 'single',
          stateTaxRatePercent: Number(args.stateTaxRatePercent !== undefined ? args.stateTaxRatePercent : 5.0),
          healthSubsidyAnnual: Number(args.healthSubsidyAnnual !== undefined ? args.healthSubsidyAnnual : 7200),
          match401kPercent: Number(args.match401kPercent !== undefined ? args.match401kPercent : 4.0),
          ptoDays: Number(args.ptoDays !== undefined ? args.ptoDays : 25)
        },
        {
          hourlyRate: Number(args.contractorHourlyRate || args.hourlyRate || 85),
          hoursPerWeek: Number(args.hoursPerWeek || 40),
          weeksPerYear: Number(args.weeksPerYear || 48),
          annualExpenses: Number(args.annualExpenses !== undefined ? args.annualExpenses : 6000),
          filingStatus: args.filingStatus || 'single',
          stateTaxRatePercent: Number(args.stateTaxRatePercent !== undefined ? args.stateTaxRatePercent : 5.0),
          eligibleQBI: args.eligibleQBI !== false,
          selfFundedHealthAnnual: Number(args.selfFundedHealthAnnual !== undefined ? args.selfFundedHealthAnnual : 7200)
        },
        {
          targetCurrency: args.targetCurrency || 'EUR',
          selectedRail: args.selectedRail || 'wise'
        }
      );
    case 'scorp_optimizer':
    case 'scorp':
    case 'truecalci_scorp_optimizer':
      return SCorpEngine.calculate({
        netProfit: Number(args.netProfit ?? 150000),
        salaryPercent: Number(args.salaryPercent ?? 55),
        payrollAnnualFee: Number(args.payrollAnnualFee ?? 600),
        cpaAnnualFee: Number(args.cpaAnnualFee ?? 1500),
        stateAnnualFee: Number(args.stateAnnualFee ?? 200),
        manualSalary: args.manualSalary ? Number(args.manualSalary) : undefined
      });
    case 'solo_401k_shield':
    case 'retirement':
    case 'truecalci_solo_401k_shield':
      return RetirementEngine.calculate({
        netEarnings: Number(args.netEarnings ?? 120000),
        entityType: args.entityType || 'llc',
        isAge50Plus: args.isAge50Plus === true || args.isAge50Plus === 'true',
        marginalTaxRatePercent: Number(args.marginalTaxRatePercent ?? 28)
      });
    case 'fx_invoicing':
    case 'fx':
    case 'truecalci_fx_invoicing':
      return FXInvoicingEngine.calculate({
        invoiceUsd: Number(args.invoiceUsd ?? 10000),
        targetCurrency: args.targetCurrency || 'EUR'
      });
    case 'billable_floor':
    case 'billable':
    case 'truecalci_billable_floor':
      return BillableRateEngine.calculate({
        targetNetCash: Number(args.targetNetCash ?? 120000),
        annualExpenses: Number(args.annualExpenses ?? 8000),
        healthInsuranceAnnual: Number(args.healthInsuranceAnnual ?? 7200),
        vacationWeeks: Number(args.vacationWeeks ?? 4),
        sickHolidayWeeks: Number(args.sickHolidayWeeks ?? 1.5),
        nominalHoursPerWeek: Number(args.nominalHoursPerWeek ?? 40),
        nonBillablePercent: Number(args.nonBillablePercent ?? 28),
        filingStatus: args.filingStatus || 'single',
        stateTaxRatePercent: Number(args.stateTaxRatePercent ?? 5.0)
      });
    case 'mortgage_piti':
    case 'mortgage':
      return GlobalFinanceEngine.calculateMortgagePITI({
        homePrice: Number(args.homePrice),
        downPaymentPercent: Number(args.downPaymentPercent || 20),
        interestRate: Number(args.interestRate),
        tenureYears: Number(args.tenureYears || args.loanTermYears || args.termYears || args.years || 30)
      });
    case 'vat_sales_tax':
    case 'vat':
      return GlobalFinanceEngine.calculateVAT({
        amount: Number(args.amount),
        vatRatePercent: Number(args.vatRatePercent || args.taxRatePercent || 20),
        mode: args.mode || 'add'
      });
    case 'tip_splitter':
    case 'tip':
      return GlobalFinanceEngine.calculateTip({
        billAmount: Number(args.billAmount),
        tipPercent: Number(args.tipPercent || 18),
        numberOfGuests: Number(args.numberOfGuests || args.numPeople || 2)
      });
    case 'compound_wealth':
    case 'compound':
      return GlobalFinanceEngine.calculateCompoundWealth({
        principal: Number(args.principal || args.initialDeposit || 0),
        monthlyDeposit: Number(args.monthlyDeposit || args.monthlyContribution || 0),
        annualRatePercent: Number(args.annualRatePercent || args.rate || 8),
        tenureYears: Number(args.tenureYears || args.timeHorizonYears || 10),
        compoundingFrequency: Number(args.compoundingFrequency || 12)
      });
    case 'gst_calculator':
    case 'gst_split':
    case 'gst':
    case 'truecalci_gst_calculator':
      return IndianFinanceEngine.calculateGST({
        amount: Number(args.amount || args.baseAmount || 100000),
        gstRatePercent: Number(args.gstRatePercent !== undefined ? args.gstRatePercent : (args.rate || 18)),
        type: args.type || (args.inclusive ? 'inclusive' : 'exclusive'),
        jurisdiction: args.jurisdiction || (args.interstate ? 'interstate' : 'intrastate'),
        cessPercent: Number(args.cessPercent || args.cess || 0),
        isRCM: Boolean(args.isRCM),
        itcEligible: args.itcEligible !== false
      });
    case 'indian_income_tax':
    case 'tax_in':
    case 'tax':
    case 'truecalci_indian_income_tax':
      return IndianFinanceEngine.calculateIncomeTax({
        grossIncome: Number(args.ctc || args.income || args.grossIncome),
        isSalaried: args.isSalaried !== false,
        deductions80C: Number(args.deductions80C || 0),
        deductions80D: Number(args.deductions80D || 0),
        homeLoanInterest24b: Number(args.homeLoanInterest24b || 0),
        nps80CCD1B: Number(args.nps80CCD1B || 0),
        hraExemption: Number(args.hraExemption || 0),
        otherDeductions: Number(args.otherDeductions || 0)
      });
    case 'sip_investment':
    case 'sip':
      return IndianFinanceEngine.calculateSIP({
        monthlyInvestment: Number(args.monthlyInvestment || args.monthly),
        annualReturnRate: Number(args.annualReturnRate || args.rate || 12),
        tenureYears: Number(args.tenureYears || args.timePeriodYears || 10),
        annualStepUpPercent: Number(args.stepUpPercent || 0)
      });
    case 'home_loan_emi':
    case 'emi':
      return IndianFinanceEngine.calculateHomeLoan({
        principal: Number(args.principal),
        annualInterestRate: Number(args.annualInterestRate || args.interestRatePercent || 8.5),
        tenureYears: Number(args.tenureYears || args.loanTermYears || args.termYears || args.years || 20)
      });
    case 'ppf_calculator':
    case 'ppf':
    case 'truecalci_ppf_calculator':
      return IndianFinanceEngine.calculatePPF({
        yearlyDeposit: Number(args.yearlyDeposit || args.amount || 150000),
        tenureYears: Number(args.tenureYears || 15)
      });
    case 'ssy_calculator':
    case 'ssy':
    case 'truecalci_ssy_calculator':
      return IndianFinanceEngine.calculateSSY({
        yearlyDeposit: Number(args.yearlyDeposit || args.amount || 150000),
        annualInterestRate: Number(args.annualInterestRate || 8.2)
      });
    case 'fd_calculator':
    case 'fd':
    case 'truecalci_fd_calculator':
      return IndianFinanceEngine.calculateFD({
        principal: Number(args.principal || args.amount || 500000),
        interestRate: Number(args.interestRate || args.rate || 7.25),
        tenureYears: Number(args.tenureYears || args.years || 5),
        payoutType: args.payoutType || 'cumulative'
      });
    case 'gold_jewellery':
    case 'gold':
    case 'truecalci_gold_jewellery':
      return IndianFinanceEngine.calculateGold({
        grams: Number(args.grams || args.weight || 25),
        ratePerGram: Number(args.ratePerGram || args.rate || 7200),
        makingChargesPercent: Number(args.makingChargesPercent || args.makingCharges || 12),
        gstRatePercent: Number(args.gstRatePercent || 3)
      });
    case 'casio_solve_quadratic':
    case 'casio_991_solve':
    case 'calci991_solve':
    case 'casio': {
      const casio = new CasioCalciEngine();
      if (args.expression) {
        return casio.parseAndSolve(String(args.expression));
      }
      if (args.type === 'simultaneous2' || args.type === 'simultaneous' || args.a2 !== undefined) {
        return casio.solveSimultaneous2(
          Number(args.a ?? args.a1), Number(args.b ?? args.b1), Number(args.c ?? args.c1),
          Number(args.a2), Number(args.b2), Number(args.c2)
        );
      }
      return casio.solveQuadratic(Number(args.a), Number(args.b), Number(args.c));
    }
    case 'beam_bending':
      return EngineeringPhysicsEngine.calculateBeamBending({
        loadNewtons: Number(args.loadNewtons),
        lengthMeters: Number(args.lengthMeters),
        elasticModulusGpa: Number(args.elasticModulusGpa || 200),
        momentOfInertiaCm4: Number(args.momentOfInertiaCm4),
        distanceFromNeutralAxisMm: Number(args.distanceFromNeutralAxisMm)
      });
    case 'projectile_motion':
      return EngineeringPhysicsEngine.calculateProjectileMotion({
        initialVelocityMs: Number(args.initialVelocityMs),
        launchAngleDegrees: Number(args.launchAngleDegrees),
        gravityMs2: Number(args.gravityMs2 || 9.80665)
      });
    case 'black_scholes':
    case 'black_scholes_options':
      return StatisticsOptionsEngine.calculateBlackScholes({
        stockPrice: Number(args.stockPrice || args.spotPrice || 100),
        strikePrice: Number(args.strikePrice || 100),
        timeToExpiryYears: Number(args.timeToExpiryYears || 1),
        riskFreeRatePercent: Number(args.riskFreeRatePercent || (args.riskFreeRate ? args.riskFreeRate * 100 : 4.5)),
        volatilityPercent: Number(args.volatilityPercent || (args.volatility ? args.volatility * 100 : 25))
      });
    case 'linear_regression':
      return StatisticsOptionsEngine.calculateLinearRegression(args.points);
    case 'pipe_flow':
      return EngineeringPhysicsEngine.calculatePipeFlow({
        flowRateM3s: Number(args.flowRateM3s),
        pipeDiameterM: Number(args.pipeDiameterM),
        pipeLengthM: Number(args.pipeLengthM),
        fluidDensityKgM3: Number(args.fluidDensityKgM3 || 1000),
        dynamicViscosityPaS: Number(args.dynamicViscosityPaS || 0.001),
        pipeRoughnessM: Number(args.pipeRoughnessM || 0.000045)
      });
    case 'rlc_circuit':
      return EngineeringPhysicsEngine.calculateRlcCircuit({
        resistanceOhms: Number(args.resistanceOhms),
        inductanceHenrys: Number(args.inductanceHenrys),
        capacitanceFarads: Number(args.capacitanceFarads),
        frequencyHz: args.frequencyHz !== undefined ? Number(args.frequencyHz) : undefined
      });
    case 'rocket_deltav':
      return EngineeringPhysicsEngine.calculateRocketDeltaV({
        initialMassKg: Number(args.initialMassKg),
        finalMassKg: Number(args.finalMassKg),
        specificImpulseSeconds: Number(args.specificImpulseSeconds),
        gravityMs2: Number(args.gravityMs2 || 9.80665)
      });
    case 'ai_token_arbitrage':
    case 'ai_tokens':
    case 'token_arbitrage':
      return FinOpsEngine.calculateAiTokenArbitrage(args);
    case 'startup_runway_dilution':
    case 'startup_runway':
    case 'dilution_solver':
      return FinOpsEngine.calculateStartupRunwayDilution(args);
    case 'b2b_withholding_risk':
    case 'b2b_wht':
    case 'withholding_risk':
      return FinOpsEngine.calculateB2bWithholdingRisk(args);
    case 'feie_nomad_tracker':
    case 'feie':
    case 'nomad_tracker':
      return FinOpsEngine.calculateFeieNomadTracker(args);
    case 'cloud_egress_finops':
    case 'cloud_egress':
    case 'egress_finops':
      return FinOpsEngine.calculateCloudEgressFinOps(args);
    case 'npv_irr':
    case 'npv':
    case 'irr':
    case 'truecalci_npv_irr':
      return GlobalFinanceEngine.calculateNpvIrr({
        initialInvestment: Number(args.initialInvestment),
        cashflows: args.cashflows || (args.flows ? (Array.isArray(args.flows) ? args.flows : String(args.flows).split(',').map(Number)) : []),
        discountRatePercent: args.discountRatePercent !== undefined ? Number(args.discountRatePercent) : 10
      });
    case 'cagr_inflation':
    case 'cagr':
    case 'inflation_adjusted':
    case 'truecalci_cagr_inflation':
      return GlobalFinanceEngine.calculateCagrInflation({
        initialValue: Number(args.initialValue),
        finalValue: Number(args.finalValue),
        periodsYears: Number(args.periodsYears || args.years || args.tenureYears),
        inflationRatePercent: args.inflationRatePercent !== undefined ? Number(args.inflationRatePercent) : 2.5
      });
    case 'breakeven_margin':
    case 'breakeven':
    case 'margin_of_safety':
    case 'truecalci_breakeven_margin':
      return GlobalFinanceEngine.calculateBreakEven({
        fixedCosts: Number(args.fixedCosts),
        unitPrice: Number(args.unitPrice || args.price),
        unitVariableCost: Number(args.unitVariableCost || args.variableCost),
        expectedUnitsSold: Number(args.expectedUnitsSold || 0)
      });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function sendResponse(id, result, error = null) {
  const response = {
    jsonrpc: "2.0",
    id
  };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  process.stdout.write(JSON.stringify(response) + '\n');
}

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const msg = JSON.parse(line);
    if (typeof msg !== 'object' || msg === null) {
      sendResponse(null, null, { code: -32600, message: "Invalid Request: Message must be an object" });
      return;
    }
    const { id, method, params } = msg;

    if (method === 'initialize') {
      sendResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {}, resources: {}, prompts: {} },
        serverInfo: { name: "truecalci-mcp-server",
          version: "2.0.0"
        }
      });
      return;
    }

    if (method === 'notifications/initialized') {
      // Client ack, no response needed
      return;
    }

    if (method === 'resources/list') {
      sendResponse(id, { resources: MCP_RESOURCES });
      return;
    }

    if (method === 'resources/read') {
      try {
        const resContent = readResourceContent(params?.uri);
        sendResponse(id, resContent);
      } catch (e) {
        sendResponse(id, null, { code: -32002, message: e.message });
      }
      return;
    }

    if (method === 'resources/templates/list') {
      sendResponse(id, { resourceTemplates: MCP_RESOURCE_TEMPLATES });
      return;
    }

    if (method === 'prompts/list') {
      sendResponse(id, { prompts: MCP_PROMPTS });
      return;
    }

    if (method === 'prompts/get') {
      try {
        const promptData = getPromptResponse(params?.name, params?.arguments);
        sendResponse(id, promptData);
      } catch (e) {
        sendResponse(id, null, { code: -32602, message: e.message });
      }
      return;
    }

    if (method === 'tools/list') {
      sendResponse(id, {
        tools: MCP_TOOLS
      });
      return;
    }

    if (method === 'tools/call') {
      const { name, arguments: toolArgs } = params;
      try {
        const result = handleToolCall(name, toolArgs || {});
        sendResponse(id, {
          isError: false,
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        });
      } catch (toolErr) {
        sendResponse(id, {
          isError: true,
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: toolErr.message,
                hint: "Check calculation input bounds against tool definition schema.",
                tool: name
              }, null, 2)
            }
          ]
        });
      }
      return;
    }

    // Default method not found
    sendResponse(id, null, { code: -32601, message: `Method not found: ${method}` });
  } catch (err) {
    sendResponse(null, null, { code: -32700, message: "Parse error" });
  }
});
