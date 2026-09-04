#!/usr/bin/env bash
# ==============================================================================
# TrueCalci Precision Computational API & MCP cURL Reference Suite
# Active Tier: Pro Agency & Scale (15,000 req/mo, 1,000 RPM concurrency)
# ==============================================================================

BASE_URL="https://truecalci.com"
API_KEY="tc_live_pro_a8f9c2e1b7_d04a"

echo "================================================================================"
echo "TRUECALCI AI AGENT & COMPUTATIONAL SUITE — CURL EXAMPLES"
echo "Target Host: $BASE_URL"
echo "================================================================================"

# ------------------------------------------------------------------------------
# 1. Health & Discovery
# ------------------------------------------------------------------------------
echo -e "\n[1] Edge Worker Health Check:"
curl -s -X GET "$BASE_URL/api/health" \
  -H "Authorization: Bearer $API_KEY"

echo -e "\n\n[2] Tools Catalog & OpenAPI Discovery:"
curl -s -X GET "$BASE_URL/api/v1/tools" \
  -H "Authorization: Bearer $API_KEY"

# ------------------------------------------------------------------------------
# 2. Model Context Protocol (MCP) Streamable HTTP JSON-RPC 2.0
# ------------------------------------------------------------------------------
echo -e "\n\n[3] MCP Handshake (initialize):"
curl -s -X POST "$BASE_URL/api/v1/mcp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{}}}'

echo -e "\n\n[4] MCP Tools List (tools/list):"
curl -s -X POST "$BASE_URL/api/v1/mcp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

echo -e "\n\n[5] MCP Tool Call (European VAT Extraction):"
curl -s -X POST "$BASE_URL/api/v1/mcp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"vat_sales_tax","arguments":{"amount":1200,"vatRatePercent":20,"mode":"remove"}}}'

# ------------------------------------------------------------------------------
# 3. 16 Deterministic Engine REST Invocations
# ------------------------------------------------------------------------------
echo -e "\n\n--- 16 DETERMINISTIC REST ENGINE CALLS ---"

# 1. Contractor Parity
echo -e "\n[Engine 1: 1099 vs W-2 Contractor Parity]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"contractor_parity","params":{"w2Salary":130000,"contractorHourlyRate":85,"filingStatus":"single"}}'

# 2. Mortgage PITI
echo -e "\n[Engine 2: US Mortgage PITI & PMI]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"mortgage_piti","params":{"homePrice":450000,"downPaymentPercent":20,"interestRate":6.8,"tenureYears":30}}'

# 3. VAT & Sales Tax
echo -e "\n[Engine 3: European VAT & Global Sales Tax]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"vat_sales_tax","params":{"amount":1000,"vatRatePercent":20,"mode":"add"}}'

# 4. Tip Splitter
echo -e "\n[Engine 4: Restaurant Tip & Itemized Splitter]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"tip_splitter","params":{"billAmount":120,"tipPercent":18,"numPeople":3}}'

# 5. Compound Wealth
echo -e "\n[Engine 5: Exponential Compound Wealth Simulator]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"compound_wealth","params":{"principal":10000,"monthlyDeposit":500,"annualRatePercent":8,"tenureYears":15}}'

# 6. Indian Income Tax
echo -e "\n[Engine 6: Indian Income Tax Budget 2025-26]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"indian_income_tax","params":{"ctc":1250000,"isSalaried":true}}'

# 7. SIP Mutual Fund Investment
echo -e "\n[Engine 7: SIP Mutual Fund Wealth Builder]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"sip_investment","params":{"monthlyInvestment":10000,"annualReturnRate":12,"tenureYears":15,"stepUpPercent":10}}'

# 8. Home Loan Reducing Balance EMI
echo -e "\n[Engine 8: Reducing Balance Home Loan EMI]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"home_loan_emi","params":{"principal":5000000,"interestRatePercent":8.5,"tenureYears":20}}'

# 9. Casio fx-991MS Solver
echo -e "\n[Engine 9: Casio fx-991MS Quadratic & Simultaneous Solver]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"casio_991_solve","params":{"type":"quadratic","a":1,"b":-5,"c":6}}'

# 10. Beam Bending & Deflection
echo -e "\n[Engine 10: Structural Beam Bending (Euler-Bernoulli)]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"beam_bending","params":{"loadNewtons":5000,"lengthMeters":4,"elasticModulusGpa":200,"momentOfInertiaCm4":800,"distanceFromNeutralAxisMm":50}}'

# 11. Projectile Kinematics
echo -e "\n[Engine 11: 2D Physics Projectile Motion]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"projectile_motion","params":{"initialVelocityMs":50,"launchAngleDegrees":45}}'

# 12. Quantitative Black-Scholes Options & Greeks
echo -e "\n[Engine 12: Black-Scholes Option Pricing & Greeks]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"black_scholes","params":{"spotPrice":100,"strikePrice":100,"timeToExpiryYears":1,"riskFreeRatePercent":4.5,"volatilityPercent":25}}'

# 13. Linear Regression (OLS)
echo -e "\n[Engine 13: Linear Regression & Correlation]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"linear_regression","params":{"points":[{"x":1,"y":2},{"x":2,"y":4},{"x":3,"y":5},{"x":4,"y":4},{"x":5,"y":5}]}}'

# 14. Darcy-Weisbach Pipe Flow
echo -e "\n[Engine 14: Fluid Mechanics Pipe Flow & Head Loss]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"pipe_flow","params":{"flowRateM3s":0.05,"pipeDiameterM":0.15,"pipeLengthM":100}}'

# 15. AC Resonant RLC Circuit
echo -e "\n[Engine 15: Electrical AC Resonant RLC Circuit]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"rlc_circuit","params":{"resistanceOhms":50,"inductanceHenrys":0.01,"capacitanceFarads":0.000001}}'

# 16. Tsiolkovsky Rocket Delta-V
echo -e "\n[Engine 16: Aerospace Tsiolkovsky Rocket Delta-V]"
curl -s -X POST "$BASE_URL/api/v1/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"tool":"rocket_deltav","params":{"initialMassKg":549054,"finalMassKg":22200,"specificImpulseSeconds":311}}'

echo -e "\n\n================================================================================"
echo "CURL TEST RUN COMPLETE."
echo "================================================================================"
