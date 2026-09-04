#!/usr/bin/env python3
"""
TrueCalci Official Python SDK & AI Agent Client
High-precision deterministic calculation client for all 16 TrueCalci engines.
Supports both direct REST calculation endpoints and Model Context Protocol (MCP) Streamable HTTP v1.

Usage:
    from truecalci_client import TrueCalciClient
    
    client = TrueCalciClient(api_key="tc_live_pro_a8f9c2e1b7_d04a")
    res = client.mortgage_piti(home_price=450000, interest_rate=6.8)
    print("Monthly PITI:", res["result"]["monthlyTotalPITI"])
"""

import json
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, List

class TrueCalciClient:
    """Official Python client for TrueCalci Computational Engine & MCP Streamable HTTP."""
    
    def __init__(self, api_key: str = "tc_live_pro_a8f9c2e1b7_d04a", base_url: str = "https://truecalci.com"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "User-Agent": "TrueCalci-Python-SDK/2.0.0"
        }

    def _post(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{self.base_url}{path}"
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=self.headers, method="POST")
        try:
            with urllib.request.urlopen(req) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8")
            try:
                err_json = json.loads(err_body)
                raise RuntimeError(f"TrueCalci API Error ({e.code}): {err_json.get('message') or err_json.get('error') or err_body}")
            except Exception:
                raise RuntimeError(f"TrueCalci HTTP {e.code}: {err_body}")
        except Exception as e:
            raise RuntimeError(f"Connection failed to {url}: {str(e)}")

    def _get(self, path: str) -> Dict[str, Any]:
        url = f"{self.base_url}{path}"
        req = urllib.request.Request(url, headers=self.headers, method="GET")
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))

    # -------------------------------------------------------------------------
    # Model Context Protocol (MCP) Streamable HTTP v1 Methods
    # -------------------------------------------------------------------------
    def mcp_initialize(self) -> Dict[str, Any]:
        """Initialize MCP session with protocol version and capabilities handshake."""
        return self._post("/api/v1/mcp", {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": { "name": "truecalci-python-client", "version": "2.0.0" }
            }
        })

    def mcp_list_tools(self) -> List[Dict[str, Any]]:
        """Discover available computational tools and schemas via MCP."""
        res = self._post("/api/v1/mcp", {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/list",
            "params": {}
        })
        return res.get("result", {}).get("tools", [])

    def mcp_call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Any:
        """Execute a computational tool via MCP JSON-RPC protocol."""
        res = self._post("/api/v1/mcp", {
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments
            }
        })
        content = res.get("result", {}).get("content", [])
        if content and content[0].get("type") == "text":
            return json.loads(content[0]["text"])
        return res.get("result")

    # -------------------------------------------------------------------------
    # Generic REST Engine Calculation Dispatcher
    # -------------------------------------------------------------------------
    def calculate(self, tool_name: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Generic calculation dispatch across all 16 engines."""
        return self._post("/api/v1/calculate", {
            "tool": tool_name,
            "params": params
        })

    # -------------------------------------------------------------------------
    # 16 Deterministic Engine Wrapper Methods
    # -------------------------------------------------------------------------
    # 1. 1099 vs W-2 Contractor Parity & Breakeven Rate
    def contractor_parity(self, w2_salary: float = 130000, contractor_hourly_rate: float = 85,
                          filing_status: str = "single", state_tax_rate_percent: float = 5.0,
                          health_subsidy_annual: float = 7200, match_401k_percent: float = 4.0,
                          pto_days: int = 25, hours_per_week: int = 40, weeks_per_year: int = 48,
                          annual_expenses: float = 6000, eligible_qbi: bool = True,
                          target_currency: str = "EUR", selected_rail: str = "wise") -> Dict[str, Any]:
        return self.calculate("contractor_parity", {
            "w2Salary": w2_salary,
            "contractorHourlyRate": contractor_hourly_rate,
            "filingStatus": filing_status,
            "stateTaxRatePercent": state_tax_rate_percent,
            "healthSubsidyAnnual": health_subsidy_annual,
            "match401kPercent": match_401k_percent,
            "ptoDays": pto_days,
            "hoursPerWeek": hours_per_week,
            "weeksPerYear": weeks_per_year,
            "annualExpenses": annual_expenses,
            "eligibleQBI": eligible_qbi,
            "targetCurrency": target_currency,
            "selectedRail": selected_rail
        })

    # 2. US Mortgage PITI & Amortization
    def mortgage_piti(self, home_price: float, interest_rate: float, down_payment_percent: float = 20,
                      tenure_years: int = 30, property_tax_rate_percent: float = 1.2,
                      annual_home_insurance: float = 1400, annual_pmi_percent: float = 0.75) -> Dict[str, Any]:
        return self.calculate("mortgage_piti", {
            "homePrice": home_price,
            "downPaymentPercent": down_payment_percent,
            "interestRate": interest_rate,
            "tenureYears": tenure_years,
            "propertyTaxRatePercent": property_tax_rate_percent,
            "annualHomeInsurance": annual_home_insurance,
            "annualPmiPercent": annual_pmi_percent
        })

    # 3. European VAT & Sales Tax
    def vat_sales_tax(self, amount: float, vat_rate_percent: float = 20, mode: str = "add") -> Dict[str, Any]:
        return self.calculate("vat_sales_tax", {
            "amount": amount,
            "vatRatePercent": vat_rate_percent,
            "mode": mode
        })

    # 4. Restaurant Tip & Bill Splitter
    def tip_splitter(self, bill_amount: float, tip_percent: float = 18, num_people: int = 2) -> Dict[str, Any]:
        return self.calculate("tip_splitter", {
            "billAmount": bill_amount,
            "tipPercent": tip_percent,
            "numPeople": num_people
        })

    # 5. Compound Wealth Simulator (401k/Roth/ISA/ETF)
    def compound_wealth(self, principal: float = 10000, monthly_deposit: float = 500,
                        annual_rate_percent: float = 8.0, tenure_years: int = 15,
                        compound_frequency: int = 12) -> Dict[str, Any]:
        return self.calculate("compound_wealth", {
            "principal": principal,
            "monthlyDeposit": monthly_deposit,
            "annualRatePercent": annual_rate_percent,
            "tenureYears": tenure_years,
            "compoundFrequency": compound_frequency
        })

    # 6. Indian Income Tax (Budget 2025-26 Provisions)
    def indian_income_tax(self, ctc: float, is_salaried: bool = True) -> Dict[str, Any]:
        return self.calculate("indian_income_tax", {
            "ctc": ctc,
            "isSalaried": is_salaried
        })

    # 7. SIP Mutual Fund Investment & Step-Up
    def sip_investment(self, monthly_investment: float, annual_return_rate: float = 12.0,
                       tenure_years: int = 10, step_up_percent: float = 0.0) -> Dict[str, Any]:
        return self.calculate("sip_investment", {
            "monthlyInvestment": monthly_investment,
            "annualReturnRate": annual_return_rate,
            "tenureYears": tenure_years,
            "stepUpPercent": step_up_percent
        })

    # 8. Home Loan Reducing Balance EMI
    def home_loan_emi(self, principal: float, interest_rate_percent: float = 8.5, tenure_years: int = 20) -> Dict[str, Any]:
        return self.calculate("home_loan_emi", {
            "principal": principal,
            "interestRatePercent": interest_rate_percent,
            "tenureYears": tenure_years
        })

    # 9. Casio fx-991MS Scientific & Polynomial Solver
    def casio_solve(self, a: float, b: float, c: float, type_name: str = "quadratic",
                    a2: Optional[float] = None, b2: Optional[float] = None, c2: Optional[float] = None) -> Dict[str, Any]:
        params = { "type": type_name, "a": a, "b": b, "c": c }
        if a2 is not None: params["a2"] = a2
        if b2 is not None: params["b2"] = b2
        if c2 is not None: params["c2"] = c2
        return self.calculate("casio_991_solve", params)

    # 10. Structural Beam Bending & Deflection (Euler-Bernoulli)
    def beam_bending(self, load_newtons: float, length_meters: float, elastic_modulus_gpa: float = 200,
                     moment_of_inertia_cm4: float = 800, distance_from_neutral_axis_mm: float = 50) -> Dict[str, Any]:
        return self.calculate("beam_bending", {
            "loadNewtons": load_newtons,
            "lengthMeters": length_meters,
            "elasticModulusGpa": elastic_modulus_gpa,
            "momentOfInertiaCm4": moment_of_inertia_cm4,
            "distanceFromNeutralAxisMm": distance_from_neutral_axis_mm
        })

    # 11. 2D Projectile Kinematics
    def projectile_motion(self, initial_velocity_ms: float, launch_angle_degrees: float, gravity_ms2: float = 9.80665) -> Dict[str, Any]:
        return self.calculate("projectile_motion", {
            "initialVelocityMs": initial_velocity_ms,
            "launchAngleDegrees": launch_angle_degrees,
            "gravityMs2": gravity_ms2
        })

    # 12. Quantitative Black-Scholes European Options & Greeks
    def black_scholes(self, spot_price: float, strike_price: float, time_to_expiry_years: float,
                      risk_free_rate_percent: float = 4.5, volatility_percent: float = 25.0) -> Dict[str, Any]:
        return self.calculate("black_scholes", {
            "stockPrice": spot_price,
            "strikePrice": strike_price,
            "timeToExpiryYears": time_to_expiry_years,
            "riskFreeRatePercent": risk_free_rate_percent,
            "volatilityPercent": volatility_percent
        })

    # 13. Linear Regression & Correlation (OLS)
    def linear_regression(self, points: List[Dict[str, float]]) -> Dict[str, Any]:
        return self.calculate("linear_regression", { "points": points })

    # 14. Darcy-Weisbach Fluid Mechanics Pipe Flow
    def pipe_flow(self, flow_rate_m3s: float, pipe_diameter_m: float, pipe_length_m: float,
                  fluid_density_kg_m3: float = 1000, dynamic_viscosity_pa_s: float = 0.001,
                  pipe_roughness_m: float = 0.000045) -> Dict[str, Any]:
        return self.calculate("pipe_flow", {
            "flowRateM3s": flow_rate_m3s,
            "pipeDiameterM": pipe_diameter_m,
            "pipeLengthM": pipe_length_m,
            "fluidDensityKgM3": fluid_density_kg_m3,
            "dynamicViscosityPaS": dynamic_viscosity_pa_s,
            "pipeRoughnessM": pipe_roughness_m
        })

    # 15. AC Resonant RLC Circuit
    def rlc_circuit(self, resistance_ohms: float, inductance_henrys: float, capacitance_farads: float,
                    frequency_hz: Optional[float] = None) -> Dict[str, Any]:
        params = {
            "resistanceOhms": resistance_ohms,
            "inductanceHenrys": inductance_henrys,
            "capacitanceFarads": capacitance_farads
        }
        if frequency_hz is not None:
            params["frequencyHz"] = frequency_hz
        return self.calculate("rlc_circuit", params)

    # 16. Aerospace Tsiolkovsky Rocket Delta-V
    def rocket_deltav(self, initial_mass_kg: float, final_mass_kg: float, specific_impulse_seconds: float,
                      gravity_ms2: float = 9.80665) -> Dict[str, Any]:
        return self.calculate("rocket_deltav", {
            "initialMassKg": initial_mass_kg,
            "finalMassKg": final_mass_kg,
            "specificImpulseSeconds": specific_impulse_seconds,
            "gravityMs2": gravity_ms2
        })
