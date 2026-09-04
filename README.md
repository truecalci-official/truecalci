# TrueCalci — Deterministic Compute Engine for AI Agents & Enterprise Teams

[![MCP Compatible](https://img.shields.io/badge/MCP-Streamable%20HTTP%20%26%20stdio-blue.svg)](https://modelcontextprotocol.io)
[![Zero Data Retention](https://img.shields.io/badge/Data%20Retention-0%20Bytes%20Stored-emerald.svg)](https://truecalci.com/privacy.html)
[![Arithmetic](https://img.shields.io/badge/Arithmetic-64--bit%20IEEE--754-indigo.svg)](https://truecalci.com/engineering-formulas.html)
[![Latency](https://img.shields.io/badge/Edge%20Latency-P50%20%3C%2020ms-teal.svg)](https://truecalci.com)
[![Engines](https://img.shields.io/badge/Engines-19%20Statutory%20%26%20Financial-orange.svg)](#registered-mcp-tool-catalog)
[![License](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

> **Give your agent arithmetic it can be held to.**  
> LLMs hallucinate statutory tax brackets, compound schedules, and cross-border currency drag. TrueCalci mounts **nineteen deterministic mathematical engines** as typed tools over the open **Model Context Protocol (MCP)** at `https://truecalci.com/api/v1/mcp`. Same input, same output, sub-millisecond edge compute, zero disk retention.

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
*Restart Claude Desktop to immediately unlock all 19 calculation tools in the conversation toolbar.*

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

## 2. Registered MCP Tool Catalog (19 Verified Engines)

All engines return structured JSON containing inputs, calculated line items, marginal tax rates, and legal derivation citations.

| Tool Name | Domain & Regulatory Core | Key Input Parameters | Key Outputs |
| :--- | :--- | :--- | :--- |
| `contractor_parity` | US Tax (IRC Brackets, 15.3% SECA, 50% deduction, 20% §199A QBI) | `revenue`, `w2Salary`, `expenses`, `state` | True net annual cash, cash delta vs W-2, breakeven hourly rate floor |
| `scorp_optimize` | IRS Rev. Rul. 74-44, FICA wage base ceiling ($176,100), 2026 limits | `netProfit`, `salaryPercent`, `cpaFee`, `payrollFee` | Reasonable salary, K-1 distribution, gross & net FICA tax savings, breakeven threshold |
| `solo401k_max` | IRS Notice 2023-75 ($23,500 deferral, $70,000 total plan max) | `netEarnings`, `entityType`, `isAge50Plus`, `marginalRate` | Solo 401(k) vs SEP-IRA max deduction, cash tax saved, extra shelter amount |
| `fx_raildrag` | Mid-market benchmark FX vs Wise, Deel, Payoneer, Stripe, PayPal | `invoiceUsd`, `targetCurrency` (EUR, GBP, INR, CAD, etc.) | Landed local currency, total dollar fee drag, per-invoice and annual cash savings vs worst rail |
| `billable_floor` | 47 working weeks, non-billable drag, health & overhead buffer | `targetNetCash`, `annualExpenses`, `vacationWeeks`, `nonBillablePct` | True minimum hourly billing floor ($/hr), annual billable hours reality, shortfall alerts |
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
│   ├── engines/                 # 19 standalone mathematical calculation engines
│   └── app.js                   # Unified application controller
├── tests/                       # Automated verification test suite
│   ├── test_suite.mjs           # Complete 174-assertion determinism test
│   └── test_adversarial_mcp.mjs # MCP protocol stress and fuzzing suite
├── CHANGELOG.md                 # Public release version history
├── SYSTEM_LOG.md                # Permanent engineering commit & deployment ledger
├── README.md                    # Primary documentation & MCP manifest
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

* **Free Sandbox**: 500 requests/month, 20 req/min concurrency ceiling, all 19 engines, no card required.
* **Developer Starter**: 30,000 prepaid requests pool, 300 req/min concurrency, email support.
* **Pro Agency & Scale**: 180,000 prepaid requests pool, 1,000 req/min concurrency, prioritized routing.
* **Enterprise PAYG**: Uncapped request volume, private edge instances, shared Slack/Teams channel.

---

## 6. Verification & Automated Testing

Run the mathematical verification suite covering all 19 engines:
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
