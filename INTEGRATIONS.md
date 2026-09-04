# TrueCalci AI Client Integrations & Deterministic Engine Suite

> **Official Integration Package** for Claude Desktop, Cursor, AI Agents, Python SDK, and cURL.  
> **Production Edge Domain**: `https://truecalci.com`  
> **Model Context Protocol (MCP)**: Streamable HTTP JSON-RPC 2.0 (`/api/v1/mcp`) & Standard stdio (`mcp-server.mjs`)  
> **User Plan**: **Pro Agency & Scale** (15,000 requests/month, 1,000 RPM burst concurrency, next reset Oct 3, 2026)  
> **Active Live Key**: `tc_live_pro_a8f9c2e1b7_d04a`

---

## 1. Claude Desktop MCP Setup

### A. Streamable HTTP Edge Connection (Recommended)
Add the following configuration to your Claude Desktop configuration file:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Workspace copy**: `c:\Calculator\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "truecalci": {
      "url": "https://truecalci.com/api/v1/mcp",
      "headers": {
        "Authorization": "Bearer tc_live_pro_a8f9c2e1b7_d04a"
      }
    }
  }
}
```

### B. High-Speed Local Stdio Fallback (Zero Network Latency)
If you prefer direct local process execution:

```json
{
  "mcpServers": {
    "truecalci-local": {
      "command": "node",
      "args": [
        "C:\\Calculator\\mcp-server.mjs"
      ]
    }
  }
}
```

---

## 2. Cursor IDE Integration

Cursor supports Model Context Protocol (MCP) Streamable HTTP edge connections natively.

The configuration has been placed in your workspace at `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "truecalci": {
      "url": "https://truecalci.com/api/v1/mcp",
      "headers": {
        "Authorization": "Bearer tc_live_pro_a8f9c2e1b7_d04a"
      }
    }
  }
}
```

Once saved, open Cursor **Settings -> Features -> MCP** and verify that `truecalci` is connected with all 16 tools active.

---

## 3. Official Python SDK

The TrueCalci Python SDK (`sdk/truecalci_client.py`) provides zero-dependency, type-hinted methods for all 16 deterministic engines, as well as native MCP JSON-RPC protocol support.

### Quickstart

```python
from sdk.truecalci_client import TrueCalciClient

# Initialize client with your Pro API key
client = TrueCalciClient(api_key="tc_live_pro_a8f9c2e1b7_d04a", base_url="https://truecalci.com")

# 1. Calculate US Mortgage PITI & PMI
mortgage = client.mortgage_piti(home_price=450000, interest_rate=6.8, down_payment_percent=20)
print(f"Monthly PITI: ${mortgage['result']['monthlyTotalPITI']:.2f}")

# 2. Calculate European VAT (Extract 20% VAT from gross)
vat = client.vat_sales_tax(amount=1200, vat_rate_percent=20, mode="remove")
print(f"Net: {vat['result']['netAmount']} EUR, VAT: {vat['result']['vatAmount']} EUR")

# 3. 1099 vs W-2 Breakeven Parity Rate
parity = client.contractor_parity(w2_salary=130000, contractor_hourly_rate=85)
print(f"Breakeven Hourly Rate: ${parity['result']['verdict']['breakevenHourlyRateCash']}/hr")

# 4. Black-Scholes Option Pricing & Greeks
bs = client.black_scholes(spot_price=100, strike_price=100, time_to_expiry_years=1, risk_free_rate_percent=4.5, volatility_percent=25)
print(f"Call Price: ${bs['result']['callPrice']:.2f}, Delta: {bs['result']['greeks']['deltaCall']:.4f}")
```

### Running Automated Test Suite
Run the included verification suite across all 16 engines:

```bash
python examples/python_sdk_demo.py
```

---

## 4. cURL & Command-Line Recipes

### A. MCP Protocol Handshake
```bash
curl -s -X POST "https://truecalci.com/api/v1/mcp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tc_live_pro_a8f9c2e1b7_d04a" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{}}}'
```

### B. Discover All Tools (MCP tools/list)
```bash
curl -s -X POST "https://truecalci.com/api/v1/mcp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tc_live_pro_a8f9c2e1b7_d04a" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
```

### C. Direct REST Dispatch (Generic Endpoint)
```bash
curl -s -X POST "https://truecalci.com/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tc_live_pro_a8f9c2e1b7_d04a" \
  -d '{
    "tool": "mortgage_piti",
    "params": {
      "homePrice": 450000,
      "downPaymentPercent": 20,
      "interestRate": 6.8,
      "tenureYears": 30
    }
  }'
```

### D. Automated PowerShell Runner
```powershell
powershell -ExecutionPolicy Bypass -File examples\curl_examples.ps1
```

---

## 5. Complete Catalog: The 16 Deterministic Computational Engines

| # | Engine Name | REST Route | MCP Tool Name | Key Functionality | Typical Latency |
|---|-------------|------------|---------------|-------------------|-----------------|
| 1 | **Contractor Parity** | `/api/v1/contractor-parity` | `contractor_parity` | W-2 vs 1099 parity, QBI 199A, SECA tax, FX drag & breakeven hourly rate | ~5 ms |
| 2 | **Mortgage PITI & PMI** | `/api/v1/mortgage_piti` | `mortgage_piti` | US loan amortization, P&I, property tax, hazard insurance, auto-PMI | ~3 ms |
| 3 | **European VAT & Sales Tax** | `/api/v1/vat_sales_tax` | `vat_sales_tax` | Add (net to gross) or Remove (gross to net) VAT for UK, EU, US, CA | ~2 ms |
| 4 | **Restaurant Tip Splitter** | `/api/v1/tip_splitter` | `tip_splitter` | Custom tipping (15/18/20/25%), guest bill splitting, itemized share | ~2 ms |
| 5 | **Compound Wealth Simulator** | `/api/v1/compound_wealth` | `compound_wealth` | 401(k), Roth IRA, UK ISA, ETF Sparplan exponential wealth schedules | ~3 ms |
| 6 | **Indian Income Tax** | `/api/v1/indian_income_tax` | `indian_income_tax` | Union Budget 2025-26 New vs Old Regime with ₹75k deduction & 87A rebate | ~3 ms |
| 7 | **SIP Mutual Fund Planner** | `/api/v1/sip_investment` | `sip_investment` | Systematic investment compounding with annual percentage step-up | ~3 ms |
| 8 | **Home Loan EMI** | `/api/v1/home_loan_emi` | `home_loan_emi` | Reducing balance monthly EMI amortization and total interest schedule | ~3 ms |
| 9 | **Casio fx-991MS Solver** | `/api/v1/casio_991_solve` | `casio_991_solve` | Quadratic polynomials (ax²+bx+c=0) and 2-variable linear systems | ~2 ms |
| 10 | **Beam Bending Stress** | `/api/v1/beam_bending` | `beam_bending` | Euler-Bernoulli deflection, maximum bending moment, extreme fiber stress | ~2 ms |
| 11 | **2D Projectile Kinematics** | `/api/v1/projectile_motion` | `projectile_motion` | Trajectory range, peak height, flight time, velocity vector components | ~2 ms |
| 12 | **Black-Scholes Options** | `/api/v1/black_scholes` | `black_scholes` | European Call & Put pricing, Greeks (Delta, Gamma, Vega, Theta, Rho) | ~3 ms |
| 13 | **Linear Regression (OLS)** | `/api/v1/linear_regression` | `linear_regression` | Ordinary Least Squares best-fit line (y=mx+c), correlation r, R² score | ~2 ms |
| 14 | **Darcy-Weisbach Pipe Flow** | `/api/v1/pipe_flow` | `pipe_flow` | Reynolds number, friction factor, head loss, Colebrook-White flow regime | ~2 ms |
| 15 | **Resonant RLC Circuit** | `/api/v1/rlc_circuit` | `rlc_circuit` | Resonant frequency f₀, Q-factor, bandwidth, AC impedance magnitude | ~2 ms |
| 16 | **Rocket Delta-V Budget** | `/api/v1/rocket_deltav` | `rocket_deltav` | Tsiolkovsky rocket equation delta-v, mass ratio, propellant fraction | ~2 ms |

---

## 6. Edge Security & Tier Enforcement

TrueCalci operates on a multi-stage deterministic edge pipeline:
- **Pro Tier Burst Limit**: 1,000 requests per minute (`X-RateLimit-Limit: 1000`).
- **Pro Monthly Quota**: 15,000 requests per month with automatic rollover reset on October 3, 2026.
- **Zero Financial Data Storage**: All calculations execute purely in-memory on edge isolates. No sensitive personal or transaction data is ever logged to disk.
- **Response Format**: All endpoints return standard IEEE 754 floating-point numbers formatted to statutory or scientific precision.
