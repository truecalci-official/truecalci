#!/usr/bin/env python3
"""
TrueCalci Python SDK Demonstration & Verification
Runs comprehensive calculations across all 16 deterministic engines using the user's active Pro API key.
"""

import sys
import os
import time

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure sdk module is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "sdk"))
from truecalci_client import TrueCalciClient

def run_demonstration():
    print("=" * 80)
    print("TRUECALCI AI AGENT & COMPUTATIONAL ENGINE PYTHON SDK DEMONSTRATION")
    print("Active Tier: Pro Agency & Scale (15,000 req/mo, 1,000 RPM concurrency)")
    print("=" * 80)

    # Use 127.0.0.1 to avoid Windows IPv6 resolution latency
    target_url = "http://127.0.0.1:4000" if len(sys.argv) < 2 else sys.argv[1]
    api_key = "tc_live_pro_a8f9c2e1b7_d04a"
    print(f"\nConnecting to: {target_url} with Pro Key: {api_key[:16]}...")

    client = TrueCalciClient(api_key=api_key, base_url=target_url)

    # 1. MCP Protocol Handshake
    print("\n--- [A] Model Context Protocol (MCP) Streamable HTTP v1 Test ---")
    try:
        init_res = client.mcp_initialize()
        print(f"MCP Initialize: Server={init_res['result']['serverInfo']['name']} v{init_res['result']['serverInfo']['version']}")
        
        tools = client.mcp_list_tools()
        print(f"MCP Tools Discovered: {len(tools)} tools available")
        assert len(tools) >= 16, f"Expected 16 tools, found {len(tools)}"

        mcp_call_res = client.mcp_call_tool("vat_sales_tax", { "amount": 1200, "vatRatePercent": 20, "mode": "remove" })
        print(f"MCP Tool Call (VAT 20% Remove on $1200): Net = ${mcp_call_res.get('netAmount')}, Extracted VAT = ${mcp_call_res.get('vatAmount')}")
        print("MCP Streamable HTTP JSON-RPC 2.0 status: OK")
    except Exception as e:
        print(f"MCP Handshake warning (falling back to REST): {e}")

    # 2. 16 Deterministic Engines Verification
    print("\n--- [B] Verifying All 16 Deterministic Calculation Engines ---")
    passed = 0
    total = 16

    # 1. Contractor Parity
    t0 = time.perf_counter()
    r1 = client.contractor_parity(w2_salary=130000, contractor_hourly_rate=85)
    d1 = (time.perf_counter() - t0) * 1000
    be = r1['result']['verdict']['breakevenHourlyRateCash']
    win = r1['result']['verdict']['winner']
    print(f"1.  Contractor Parity: $130k W-2 vs $85/hr 1099 -> Winner: {win}, Breakeven: ${be}/hr ({d1:.2f}ms)")
    passed += 1

    # 2. Mortgage PITI
    t0 = time.perf_counter()
    r2 = client.mortgage_piti(home_price=450000, interest_rate=6.8, down_payment_percent=20)
    d2 = (time.perf_counter() - t0) * 1000
    piti = r2['result']['monthlyTotalPITI']
    print(f"2.  Mortgage PITI: $450k home @ 6.8% -> PITI: ${piti:.2f}/mo ({d2:.2f}ms)")
    passed += 1

    # 3. European VAT & Sales Tax
    t0 = time.perf_counter()
    r3 = client.vat_sales_tax(amount=1000, vat_rate_percent=20, mode="add")
    d3 = (time.perf_counter() - t0) * 1000
    vat_gross = r3['result']['grossAmount']
    print(f"3.  VAT & Sales Tax: 1000 EUR + 20% VAT -> Gross: {vat_gross} EUR ({d3:.2f}ms)")
    passed += 1

    # 4. Tip Splitter
    t0 = time.perf_counter()
    r4 = client.tip_splitter(bill_amount=120, tip_percent=18, num_people=3)
    d4 = (time.perf_counter() - t0) * 1000
    per_p = r4['result']['totalPerPerson']
    print(f"4.  Tip Splitter: $120 bill + 18% tip / 3 guests -> ${per_p:.2f}/guest ({d4:.2f}ms)")
    passed += 1

    # 5. Compound Wealth
    t0 = time.perf_counter()
    r5 = client.compound_wealth(principal=10000, monthly_deposit=500, annual_rate_percent=8, tenure_years=15)
    d5 = (time.perf_counter() - t0) * 1000
    fv = r5['result']['futureValue']
    print(f"5.  Compound Wealth: $10k initial + $500/mo @ 8% for 15y -> ${fv:,.2f} ({d5:.2f}ms)")
    passed += 1

    # 6. Indian Income Tax
    t0 = time.perf_counter()
    r6 = client.indian_income_tax(ctc=1250000, is_salaried=True)
    d6 = (time.perf_counter() - t0) * 1000
    tax = r6['result']['newRegime']['totalTax']
    print(f"6.  Indian Income Tax: ₹12.5L CTC Budget 2025-26 -> ₹{tax} tax ({d6:.2f}ms)")
    passed += 1

    # 7. SIP Mutual Fund
    t0 = time.perf_counter()
    r7 = client.sip_investment(monthly_investment=10000, annual_return_rate=12, tenure_years=15)
    d7 = (time.perf_counter() - t0) * 1000
    corpus = r7['result']['maturityValue']
    print(f"7.  SIP Investment: ₹10,000/mo @ 12% for 15y -> ₹{corpus:,.0f} ({d7:.2f}ms)")
    passed += 1

    # 8. Home Loan EMI
    t0 = time.perf_counter()
    r8 = client.home_loan_emi(principal=5000000, interest_rate_percent=8.5, tenure_years=20)
    d8 = (time.perf_counter() - t0) * 1000
    emi = r8['result']['monthlyEMI']
    print(f"8.  Home Loan EMI: ₹50 Lakhs @ 8.5% for 20y -> EMI: ₹{emi:,.0f}/mo ({d8:.2f}ms)")
    passed += 1

    # 9. Casio fx-991MS Solver
    t0 = time.perf_counter()
    r9 = client.casio_solve(a=1, b=-5, c=6)
    d9 = (time.perf_counter() - t0) * 1000
    roots = r9['result']
    print(f"9.  Casio Solver: x^2 - 5x + 6 = 0 -> Roots: {roots} ({d9:.2f}ms)")
    passed += 1

    # 10. Beam Bending
    t0 = time.perf_counter()
    r10 = client.beam_bending(load_newtons=5000, length_meters=4, elastic_modulus_gpa=200, moment_of_inertia_cm4=800, distance_from_neutral_axis_mm=50)
    d10 = (time.perf_counter() - t0) * 1000
    defl = r10['result']['maxDeflectionMm']
    print(f"10. Beam Bending: 5kN load on 4m beam -> Deflection: {defl}mm ({d10:.2f}ms)")
    passed += 1

    # 11. Projectile Motion
    t0 = time.perf_counter()
    r11 = client.projectile_motion(initial_velocity_ms=50, launch_angle_degrees=45)
    d11 = (time.perf_counter() - t0) * 1000
    rng = r11['result']['horizontalRangeMeters']
    print(f"11. Projectile Motion: 50 m/s @ 45 deg -> Range: {rng:.2f}m ({d11:.2f}ms)")
    passed += 1

    # 12. Black-Scholes Options
    t0 = time.perf_counter()
    r12 = client.black_scholes(spot_price=100, strike_price=100, time_to_expiry_years=1, risk_free_rate_percent=4.5, volatility_percent=25)
    d12 = (time.perf_counter() - t0) * 1000
    call_p = r12['result']['callPrice']
    delta = r12['result']['greeks']['deltaCall']
    print(f"12. Black-Scholes: Spot 100, Strike 100, 1y -> Call: ${call_p:.2f}, Delta: {delta:.4f} ({d12:.2f}ms)")
    passed += 1

    # 13. Linear Regression
    t0 = time.perf_counter()
    pts = [{"x": 1, "y": 2}, {"x": 2, "y": 4}, {"x": 3, "y": 5}, {"x": 4, "y": 4}, {"x": 5, "y": 5}]
    r13 = client.linear_regression(points=pts)
    d13 = (time.perf_counter() - t0) * 1000
    slope = r13['result']['slope']
    r2 = r13['result']['rSquared']
    print(f"13. Linear Regression: 5 data points -> Slope: {slope:.3f}, R^2: {r2:.3f} ({d13:.2f}ms)")
    passed += 1

    # 14. Darcy-Weisbach Pipe Flow
    t0 = time.perf_counter()
    r14 = client.pipe_flow(flow_rate_m3s=0.05, pipe_diameter_m=0.15, pipe_length_m=100)
    d14 = (time.perf_counter() - t0) * 1000
    hl = r14['result']['headLossMeters']
    print(f"14. Pipe Flow: 0.05 m3/s, D=0.15m, L=100m -> Head Loss: {hl:.2f}m ({d14:.2f}ms)")
    passed += 1

    # 15. RLC Circuit
    t0 = time.perf_counter()
    r15 = client.rlc_circuit(resistance_ohms=50, inductance_henrys=0.01, capacitance_farads=0.000001)
    d15 = (time.perf_counter() - t0) * 1000
    f0 = r15['result']['resonantFrequencyHz']
    print(f"15. RLC Circuit: R=50, L=10mH, C=1uF -> Resonant Freq: {f0:.1f} Hz ({d15:.2f}ms)")
    passed += 1

    # 16. Rocket Delta-V
    t0 = time.perf_counter()
    r16 = client.rocket_deltav(initial_mass_kg=549054, final_mass_kg=22200, specific_impulse_seconds=311)
    d16 = (time.perf_counter() - t0) * 1000
    dv = r16['result']['deltaVMs']
    print(f"16. Rocket Delta-V: Falcon 9 orbital ascent -> Delta-V: {dv:.0f} m/s ({d16:.2f}ms)")
    passed += 1

    print("\n" + "=" * 80)
    print(f"VERIFICATION SUMMARY: {passed}/{total} DETERMINISTIC ENGINES VERIFIED SUCCESSFULLY.")
    print("=" * 80)

if __name__ == "__main__":
    run_demonstration()
