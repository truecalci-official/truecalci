# TrueCalci — Deterministic Compute Engine for AI Agents & Enterprise Teams

[![MCP Compatible](https://img.shields.io/badge/MCP-Streamable%20HTTP%20%26%20stdio-blue.svg)](https://modelcontextprotocol.io)
[![Smithery Badge](https://smithery.ai/badge/truecalci-official/truecalci)](https://smithery.ai/servers/truecalci-official/truecalci)
[![Glama](https://img.shields.io/badge/Glama-Indexed-8A2BE2.svg)](https://glama.ai/mcp/servers/truecalci-official/truecalci)
[![LobeHub](https://img.shields.io/badge/LobeHub-Plugin%20Ready-000000.svg)](https://github.com/lobehub/lobe-chat-plugins)
[![Official Registry](https://img.shields.io/badge/MCP%20Registry-Indexed-f59e0b.svg)](https://github.com/modelcontextprotocol/servers)
[![Zero Data Retention](https://img.shields.io/badge/Data%20Retention-0%20Bytes%20Stored-emerald.svg)](https://truecalci.com/privacy.html)
[![Arithmetic](https://img.shields.io/badge/Arithmetic-64--bit%20IEEE--754-indigo.svg)](https://truecalci.com/engineering-formulas.html)
[![Latency](https://img.shields.io/badge/Edge%20Latency-P50%20%3C%2020ms-teal.svg)](https://truecalci.com)
[![Engines](https://img.shields.io/badge/Engines-27%20Deterministic-orange.svg)](#registered-mcp-tool-catalog)
[![License](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

> **Give your agent arithmetic it can be held to.**  
> LLMs hallucinate statutory tax brackets, compound schedules, and cross-border currency drag. TrueCalci mounts **twenty-seven deterministic mathematical engines** as typed tools over the open **Model Context Protocol (MCP)** at `https://truecalci.com/api/v1/mcp`. Same input, same output, sub-millisecond edge compute, zero disk retention.

---

## 1. Quickstart Integrations

### 1.1 Claude Desktop (macOS & Windows)
Add TrueCalci to your `claude_desktop_config.json`:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "truecalci": {
      "type": "streamable-http",
      "url": "https://truecalci.com/api/v1/mcp"
    }
  }
}
```
*Restart Claude Desktop to immediately unlock all 27 calculation tools in the conversation toolbar.*

### 1.2 Cursor IDE
1. Open Cursor Settings (`Ctrl + ,` / `Cmd + ,`) → **Features** → **MCP**.
2. Click **+ Add New MCP Server**.
3. Set **Name**: `truecalci`, **Type**: `command` or `http`, **URL**: `https://truecalci.com/api/v1/mcp` (or command: `node mcp-server.mjs`).

### 1.3 OpenAI Custom GPTs & Agent Actions
Import the production OpenAPI 3.1 specification directly into your Custom GPT action schema:
```
https://truecalci.com/openapi.json
```

### 1.4 Local stdio Mode
For CLI agents, local testing, or pipeline automation:
```bash
git clone https://github.com/truecalci-official/truecalci.git
cd truecalci
node mcp-server.mjs
```

---

## 2. Registered MCP Tool Catalog (24 Verified Engines)

All engines return structured JSON containing inputs, calculated line items, marginal tax rates, and legal derivation citations.

| Tool Name | Domain & Regulatory Core | Key Input Parameters | Key Outputs |
| :--- | :--- | :--- | :--- |
| `contractor_parity` | US Tax (IRC Brackets, 15.3% SECA, 50% deduction, 20% §199A QBI) | `revenue`, `w2Salary`, `expenses`, `state` | True net annual cash, cash delta vs W-2, breakeven hourly rate floor |
| `scorp_optimize` | IRS Rev. Rul. 74-44, FICA wage base ceiling ($176,100), 2026 limits | `netProfit`, `salaryPercent`, `cpaFee`, `payrollFee` | Reasonable salary, K-1 distribution, gross & net FICA tax savings, breakeven threshold |
| `solo401k_max` | IRS Notice 2023-75 ($23,500 deferral, $70,000 total plan max) | `netEarnings`, `entityType`, `isAge50Plus`, `marginalRate` | Solo 401(k) vs SEP-IRA max deduction, cash tax saved, extra shelter amount |
| `fx_raildrag` | Mid-market benchmark FX vs Wise, Deel, Payoneer, Stripe, PayPal | `invoiceUsd`, `targetCurrency` (EUR, GBP, INR, CAD, etc.) | Landed local currency, total dollar fee drag, per-invoice and annual cash savings vs worst rail |
| `billable_floor` | 47 working weeks, non-billable drag, health & overhead buffer | `targetNetCash`, `annualExpenses`, `vacationWeeks`, `nonBillablePct` | True minimum hourly billing floor ($/hr), annual billable hours reality, shortfall alerts |
| `ai_token_arbitrage` | Multi-model LLM API token inference costs, prompt caching (up to 90%), batch pricing | `promptTokens`, `completionTokens`, `cacheHitRatio`, `isBatch` | Multi-model cost matrix (Claude, GPT-4o, DeepSeek, Gemini), cache savings, batch savings |
| `startup_runway_dilution` | Net burn rate, calendar zero-cash date, post-money SAFE dilution, option pool shuffle | `cashOnHand`, `monthlyGrossBurn`, `monthlyRevenue`, `safeInvestment` | Monthly net burn, runway months, zero-cash date, dilution waterfall, founder ownership |
| `b2b_withholding_risk` | Cross-border B2B software invoice gross-up, statutory vs DTAA treaty WHT rates, PE risk | `invoiceNetRequired`, `statutoryRatePercent`, `treatyRatePercent`, `daysInCountry` | Required gross invoice amount, withholding tax deduction, 183-day PE audit risk indicator |
| `feie_nomad_tracker` | IRS Form 2555 FEIE physical presence test (330 foreign days), exclusion limit ($130k) | `foreignEarnedIncome`, `daysOutsideUSInRollingPeriod`, `taxYear`, `stateDomicile` | Qualification status, days needed/buffer, tax savings, sticky domicile audit warning |
| `cloud_egress_finops` | Public cloud data transfer egress fees vs Cloudflare Zero-Egress Bandwidth Alliance | `monthlyEgressGB`, `cacheHitRatio` | AWS/GCP/Azure egress cost, CDN cached volume, monthly & annual savings |
| `mortgage_piti` | US Conventional & FHA Mortgages (Principal, Interest, Property Tax, PMI) | `homePrice`, `downPaymentPercent`, `interestRate`, `tenureYears` | Monthly P&I, monthly PITI, PMI requirement, 30-year amortization schedule |
| `vat_compute` | EU VAT Directive (Reverse charge, standard, reduced, zero rates) | `amount`, `vatRatePercent`, `mode` (`add` \| `remove`) | Net amount, VAT extracted or added, gross invoice total |
| `tip_split` | Hospitality & dining arithmetic with customizable per-person split | `billAmount`, `tipPercent`, `numberOfGuests` | Exact tip amount, gross bill, even share per diner |
| `compound_wealth`| Compounding interest, monthly annuities & 401(k) accumulation | `principal`, `monthlyDeposit`, `annualRatePercent`, `tenureYears` | Future value, total principal contributed, total interest earned, growth schedule |
| `incometax_115bac`| Indian Income Tax Act 1961 (Budget 2025 Section 115BAC New vs Old) | `grossIncome`, `isSalaried`, `deductions80C`, `npsDeduction` | Taxable income, slab-by-slab tax, Section 87A rebate, standard deduction ₹75k, regime recommendation |
| `gst_split` | Indian Central & State Goods & Services Tax (CGST + SGST + IGST) | `amount`, `gstRatePercent`, `type` (`inclusive` \| `exclusive`) | CGST share, SGST share, IGST total, net taxable amount |
| `sip_stepup` | Systematic Investment Plan with annual percentage step-up | `monthlyInvestment`, `annualReturnRate`, `tenureYears`, `stepUpPct` | Total wealth accumulated, total capital deployed, power-of-compounding multiplier |
| `fd_maturity` | Quarterly compounded Fixed Deposits with senior citizen bonus | `principal`, `annualRatePercent`, `tenureMonths`, `isSeniorCitizen` | Maturity proceeds, aggregate interest income, quarterly compounding breakdown |
| `gold_invoice` | Indian BIS hallmarked jewellery invoice (24K / 22K / 18K purity) | `weightGrams`, `base24KRate`, `purityKarat`, `makingChargesPct` | Raw bullion value, making charges, BIS hallmark fee (₹45), 3% statutory GST, final bill |
| `ppf_growth` | Public Provident Fund (15-year statutory maturity, 7.1% sovereign rate) | `yearlyDeposit`, `annualInterestRate` (default 7.1%), `tenureYears` | 15-year tax-free EEE maturity proceeds, year-by-year sovereign interest accrual |
| `ssy_growth` | Sukanya Samriddhi Yojana (Girl child sovereign fund, 8.2% rate) | `yearlyDeposit`, `annualInterestRate` (default 8.2%), `tenureYears` | 21-year sovereign maturity corpus, tax-exempt accumulation under Section 80C |
| `homeloan_emi` | Reducing balance loan amortization with prepayment tenure reduction | `principal`, `annualInterestRate`, `tenureYears`, `monthlyPrepayment` | Monthly EMI, interest-to-principal ratio, tenure shaved via prepayments |
| `land_convert` | Indian land and agricultural measurement conversions | `value`, `fromUnit`, `toUnit` (`gaj`, `bigha`, `guntha`, `acre`, `sqft`) | Standardized square feet, acres, and regional conversion factors |
| `sci991_eval` | Scientific V.P.A.M. & 64-Bit Programmer bitwise arithmetic | `expression` or `decimalValue`, `operation` (`hex`, `bin`, `oct`, `bitwise`) | Analytical solution, quadratic roots, numerical calculus, 2's complement |
| `npv_irr` | Capital budgeting & investment appraisal via Newton-Raphson polynomial solver | `initialInvestment`, `cashflows` (array), `discountRatePercent` | Net Present Value ($), exact IRR %, Profitability Index (PI), payback periods |
| `cagr_inflation` | Real purchasing power retention & Fisher-deflated annualized returns | `initialValue`, `finalValue`, `periodsYears`, `inflationRatePercent` | Nominal CAGR %, real CAGR %, terminal purchasing power ($), exact doubling years |
| `breakeven_margin` | Managerial economics break-even thresholds and operational safety margin | `fixedCosts`, `unitPrice`, `unitVariableCost`, `expectedUnitsSold` | Break-even unit volume, break-even revenue, margin of safety %, degree of operating leverage |


---

## 3. Core Architectural Guarantees

```
┌─────────────────────────────────────────────────────────────┐
│                 Client (Claude / Cursor / Agent)             │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON-RPC 2.0
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Edge (BOM1 / IAD1 / LHR1)           │
│                                                             │
│   • 0 Bytes Stored Guarantee (Volatile Worker Memory Only)  │
│   • Sub-millisecond Execution (< 20ms P50 Latency)          │
│   • IEEE-754 64-Bit Deterministic Math Precision            │
│   • Stateless Request Pipeline (Zero Retention)             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Deterministic JSON Response                 │
└─────────────────────────────────────────────────────────────┘
```

1. **Zero Data Retention**: Inputs are parsed, computed in volatile Cloudflare Worker memory, and immediately discarded. No customer input, wage, or tax data is ever written to disk or persistent storage.
2. **Statutory Versioning**: All tax slabs, standard deductions, and OASDI wage caps are pinned to their statutory notification year (e.g. FY 2026-27 / ITA 2025).
3. **High-Throughput Edge Concurrency**: Deployed globally across 300+ Cloudflare edge data centers (`BOM1`, `IAD1`, `LHR1`, `FRA1`) ensuring global sub-20ms P50 execution.

---

## 4. Repository Structure

```
truecalci/
├── .agents/skills/              # Local Agent Skills (mcp-builder, writing-guidelines, apple-design)
├── .cursor/                     # Cursor IDE MCP configuration
├── .well-known/                 # RFC-compliant discovery (agent.json, mcp.json, security.txt)
├── assets/                      # High-resolution brand vector and raster marks
├── css/                         # Production CSS design tokens and layout
├── docs/                        # Public developer and statutory documentation
│   └── assets/images/           # Documentation screenshots and UI captures
├── js/                          # Core Vanilla application code
│   ├── engines/                 # 27 standalone mathematical calculation engines
│   └── app.js                   # Unified application controller
├── tests/                       # Automated verification test suite
│   ├── test_suite.mjs           # Complete 201-assertion determinism test
│   └── test_adversarial_mcp.mjs # MCP protocol stress and fuzzing suite
├── server.json                  # Official Model Context Protocol manifest
├── glama.json                   # Glama.ai MCP Registry manifest
├── README.md                    # Primary documentation & MCP quickstart
├── mcp-server.mjs               # Standalone stdio MCP server for desktop clients
├── _worker.js                   # Cloudflare Worker streamable HTTP endpoint
├── openapi.json                 # OpenAPI 3.1 schema
├── llms.txt / llms-full.txt     # AI crawler discovery documents
├── package.json                 # Clean npm package definition
└── index.html                   # Platform Landing Page (Modernist)
```

---

## 5. Commercial Tiers & Merchant of Record

Billing, taxation, invoicing, and PCI-compliant checkout are managed via **Dodo Payments** as the Merchant of Record. TrueCalci never sees or stores card numbers.

* **Free Sandbox**: 100 requests/month, 20 req/min concurrency ceiling, all 27 engines, no card required.
* **Developer Starter**: 2,500 requests/month, 300 req/min concurrency, email support.
* **Pro Agency & Scale**: 10,000 requests/month, 1,000 req/min concurrency, prioritized routing.
* **Enterprise PAYG**: Uncapped request volume, private edge instances, shared Slack/Teams channel.

---

## 6. Verification & Automated Testing

Run the mathematical verification suite covering all 25 engines:
```bash
npm test
# or: node tests/test_suite.mjs
```
Expected output:
```
================================================================================
VERIFICATION COMPLETE: 174 PASSED, 0 FAILED.
================================================================================
```

---

## 7. License

Released under the [MIT License](LICENSE).  
Copyright © 2026 TrueCalci Inc. Calculations are provided for computational verification and do not constitute legal, financial, or tax advice.
