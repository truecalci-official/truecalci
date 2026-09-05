/**
 * TrueCalci — Universal Engine Input Validation Middleware (CALC-2)
 * Ensures every incoming calculation request satisfies schema requirements,
 * non-empty bodies, mandatory parameters, and non-negative boundary conditions.
 */

export class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.details = details;
  }
}

export function validateEngineInput(toolName, params) {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    throw new ValidationError("Request body must be a valid JSON object.", {
      tool: toolName,
      received: typeof params
    });
  }

  // Reject completely empty payload
  const keys = Object.keys(params).filter(k => k !== "tool" && k !== "name");
  if (keys.length === 0) {
    throw new ValidationError(`Request body cannot be empty for tool '${toolName}'. Missing mandatory parameters.`, {
      tool: toolName,
      required: getRequiredFields(toolName)
    });
  }

  // Normalize toolName
  const t = String(toolName || "").toLowerCase().replace(/[.-]/g, "_");

  switch (t) {
    case "mortgage_piti":
    case "mortgage": {
      const homePrice = Number(params.homePrice ?? params.price);
      if (isNaN(homePrice) || homePrice <= 0) {
        throw new ValidationError("Parameter 'homePrice' is required and must be a positive number > 0.", { tool: t });
      }
      if (params.interestRate !== undefined && (isNaN(Number(params.interestRate)) || Number(params.interestRate) < 0)) {
        throw new ValidationError("Parameter 'interestRate' cannot be negative.", { tool: t });
      }
      if (params.downPaymentPercent !== undefined) {
        const dp = Number(params.downPaymentPercent);
        if (isNaN(dp) || dp < 0 || dp > 100) {
          throw new ValidationError("Parameter 'downPaymentPercent' must be between 0 and 100.", { tool: t });
        }
      }
      break;
    }

    case "vat_sales_tax":
    case "vat": {
      const amount = Number(params.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new ValidationError("Parameter 'amount' is required and must be a positive number > 0.", { tool: t });
      }
      break;
    }

    case "tip_splitter":
    case "tip": {
      const bill = Number(params.billAmount ?? params.amount);
      if (isNaN(bill) || bill <= 0) {
        throw new ValidationError("Parameter 'billAmount' is required and must be a positive number > 0.", { tool: t });
      }
      break;
    }

    case "compound_wealth":
    case "compound": {
      const principal = Number(params.principal ?? params.initialDeposit ?? 0);
      const monthly = Number(params.monthlyDeposit ?? params.monthlyContribution ?? 0);
      if (principal <= 0 && monthly <= 0) {
        throw new ValidationError("At least one of 'principal' or 'monthlyDeposit' must be a positive number > 0.", { tool: t });
      }
      if (principal < 0 || monthly < 0) {
        throw new ValidationError("Parameters 'principal' and 'monthlyDeposit' cannot be negative.", { tool: t });
      }
      break;
    }

    case "gst_calculator":
    case "gst_split":
    case "gst": {
      const amount = Number(params.amount ?? params.baseAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new ValidationError("Parameter 'amount' is required and must be a positive number > 0.", { tool: t });
      }
      break;
    }

    case "tax_in":
    case "indian_income_tax":
    case "tax": {
      const ctc = Number(params.ctc ?? params.grossIncome ?? params.income);
      if (isNaN(ctc) || ctc < 0) {
        throw new ValidationError("Parameter 'ctc' (gross income) is required and cannot be negative.", { tool: t });
      }
      break;
    }

    case "sip_investment":
    case "sip": {
      const monthly = Number(params.monthlyInvestment ?? params.monthly);
      if (isNaN(monthly) || monthly <= 0) {
        throw new ValidationError("Parameter 'monthlyInvestment' is required and must be a positive number > 0.", { tool: t });
      }
      break;
    }

    case "home_loan_emi":
    case "emi": {
      const principal = Number(params.principal ?? params.amount);
      if (isNaN(principal) || principal <= 0) {
        throw new ValidationError("Parameter 'principal' is required and must be a positive number > 0.", { tool: t });
      }
      const rate = Number(params.annualInterestRate ?? params.interestRatePercent ?? params.interestRate ?? params.rate ?? 8.5);
      if (isNaN(rate) || rate < 0) {
        throw new ValidationError("Parameter 'interestRate' cannot be negative.", { tool: t });
      }
      break;
    }

    case "ppf_calculator":
    case "ppf": {
      const amount = Number(params.annualInvestment ?? params.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new ValidationError("Parameter 'annualInvestment' is required and must be a positive number > 0.", { tool: t });
      }
      break;
    }

    case "ssy_calculator":
    case "ssy": {
      const amount = Number(params.annualDeposit ?? params.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new ValidationError("Parameter 'annualDeposit' is required and must be a positive number > 0.", { tool: t });
      }
      break;
    }

    case "fd_calculator":
    case "fd": {
      const principal = Number(params.principal ?? params.amount);
      if (isNaN(principal) || principal <= 0) {
        throw new ValidationError("Parameter 'principal' is required and must be a positive number > 0.", { tool: t });
      }
      break;
    }

    case "gold_jewellery":
    case "gold": {
      const grams = Number(params.grams ?? params.weight);
      if (isNaN(grams) || grams <= 0) {
        throw new ValidationError("Parameter 'grams' is required and must be a positive number > 0.", { tool: t });
      }
      break;
    }

    case "casio_991_solve":
    case "calci991_solve":
    case "casio": {
      if (params.expression) {
        if (typeof params.expression !== "string" || params.expression.trim().length === 0) {
          throw new ValidationError("Parameter 'expression' must be a non-empty string.", { tool: t });
        }
        break;
      }
      if (params.type === "simultaneous2" || params.type === "simultaneous" || params.a2 !== undefined) {
        const a1 = Number(params.a ?? params.a1);
        const b1 = Number(params.b ?? params.b1);
        const c1 = Number(params.c ?? params.c1);
        const a2 = Number(params.a2);
        const b2 = Number(params.b2);
        const c2 = Number(params.c2);
        if ([a1, b1, c1, a2, b2, c2].some(v => isNaN(v))) {
          throw new ValidationError("Simultaneous 2x2 system requires valid numbers: a, b, c, a2, b2, c2 (for a1*x + b1*y = c1 and a2*x + b2*y = c2).", { tool: t });
        }
        break;
      }
      const a = Number(params.a);
      const b = Number(params.b);
      const c = Number(params.c);
      if (isNaN(a) || isNaN(b) || isNaN(c)) {
        throw new ValidationError("Quadratic solver requires numbers: a, b, c (or provide 'expression' string, or 2x2 simultaneous coefficients a2, b2, c2).", { tool: t });
      }
      if (a === 0) {
        throw new ValidationError("Quadratic coefficient 'a' cannot be zero.", { tool: t });
      }
      break;
    }

    case "beam_bending": {
      const load = Number(params.loadNewtons);
      const len = Number(params.lengthMeters);
      const i = Number(params.momentOfInertiaCm4);
      const y = Number(params.distanceFromNeutralAxisMm);
      if (isNaN(load) || load <= 0) throw new ValidationError("Parameter 'loadNewtons' must be > 0.", { tool: t });
      if (isNaN(len) || len <= 0) throw new ValidationError("Parameter 'lengthMeters' must be > 0.", { tool: t });
      if (isNaN(i) || i <= 0) throw new ValidationError("Parameter 'momentOfInertiaCm4' must be > 0.", { tool: t });
      if (isNaN(y) || y <= 0) throw new ValidationError("Parameter 'distanceFromNeutralAxisMm' must be > 0.", { tool: t });
      break;
    }

    case "projectile_motion": {
      const v0 = Number(params.initialVelocityMs);
      const angle = Number(params.launchAngleDegrees);
      if (isNaN(v0) || v0 < 0) throw new ValidationError("Parameter 'initialVelocityMs' must be >= 0.", { tool: t });
      if (isNaN(angle) || angle < 0 || angle > 90) throw new ValidationError("Parameter 'launchAngleDegrees' must be between 0 and 90.", { tool: t });
      break;
    }

    case "black_scholes":
    case "black_scholes_options": {
      const s = Number(params.stockPrice ?? params.spotPrice);
      const k = Number(params.strikePrice);
      const tY = Number(params.timeToExpiryYears ?? params.timeToExpiry);
      if (isNaN(s) || s <= 0) throw new ValidationError("Parameter 'stockPrice' must be > 0.", { tool: t });
      if (isNaN(k) || k <= 0) throw new ValidationError("Parameter 'strikePrice' must be > 0.", { tool: t });
      if (isNaN(tY) || tY <= 0) throw new ValidationError("Parameter 'timeToExpiryYears' must be > 0.", { tool: t });
      break;
    }

    case "linear_regression": {
      if (!Array.isArray(params.xValues) || !Array.isArray(params.yValues)) {
        throw new ValidationError("Parameters 'xValues' and 'yValues' must both be arrays of numbers.", { tool: t });
      }
      if (params.xValues.length < 2 || params.xValues.length !== params.yValues.length) {
        throw new ValidationError("Arrays 'xValues' and 'yValues' must have matching lengths of at least 2 points.", { tool: t });
      }
      if (params.xValues.some(v => isNaN(Number(v))) || params.yValues.some(v => isNaN(Number(v)))) {
        throw new ValidationError("All elements in 'xValues' and 'yValues' must be valid numbers.", { tool: t });
      }
      break;
    }

    case "pipe_flow": {
      const q = Number(params.flowRateM3s ?? params.flowRate);
      const d = Number(params.pipeDiameterM ?? params.diameter);
      const l = Number(params.pipeLengthM ?? params.length);
      if (isNaN(q) || q <= 0) throw new ValidationError("Parameter 'flowRateM3s' must be > 0.", { tool: t });
      if (isNaN(d) || d <= 0) throw new ValidationError("Parameter 'pipeDiameterM' must be > 0.", { tool: t });
      if (isNaN(l) || l <= 0) throw new ValidationError("Parameter 'pipeLengthM' must be > 0.", { tool: t });
      break;
    }

    case "rlc_circuit": {
      const ind = Number(params.inductanceHenries ?? params.inductance);
      const cap = Number(params.capacitanceFarads ?? params.capacitance);
      if (isNaN(ind) || ind <= 0) throw new ValidationError("Parameter 'inductanceHenries' must be > 0.", { tool: t });
      if (isNaN(cap) || cap <= 0) throw new ValidationError("Parameter 'capacitanceFarads' must be > 0.", { tool: t });
      break;
    }

    case "rocket_deltav": {
      const m0 = Number(params.dryMassKg ?? params.dryMass);
      const mf = Number(params.fuelMassKg ?? params.fuelMass ?? 0);
      const isp = Number(params.specificImpulseSec ?? params.isp);
      if (isNaN(m0) || m0 <= 0) throw new ValidationError("Parameter 'dryMassKg' must be > 0.", { tool: t });
      if (isNaN(mf) || mf < 0) throw new ValidationError("Parameter 'fuelMassKg' cannot be negative.", { tool: t });
      if (isNaN(isp) || isp <= 0) throw new ValidationError("Parameter 'specificImpulseSec' must be > 0.", { tool: t });
      break;
    }

    case "contractor_parity":
    case "contractor_takehome_matrix": {
      const salary = Number(params.w2Salary ?? params.salary);
      if (isNaN(salary) || salary <= 0) {
        throw new ValidationError("Parameter 'w2Salary' (or 'salary') is required and must be > 0.", { tool: t });
      }
      break;
    }

    case "scorp_optimizer":
    case "scorp": {
      const profit = Number(params.netProfit);
      if (isNaN(profit) || profit <= 0) {
        throw new ValidationError("Parameter 'netProfit' is required and must be > 0.", { tool: t });
      }
      break;
    }

    case "solo_401k_shield":
    case "retirement": {
      const earnings = Number(params.netEarnings);
      if (isNaN(earnings) || earnings <= 0) {
        throw new ValidationError("Parameter 'netEarnings' is required and must be > 0.", { tool: t });
      }
      break;
    }

    case "fx_invoicing":
    case "fx": {
      const inv = Number(params.invoiceUsd ?? params.amount);
      if (isNaN(inv) || inv <= 0) {
        throw new ValidationError("Parameter 'invoiceUsd' is required and must be > 0.", { tool: t });
      }
      break;
    }

    case "billable_floor":
    case "billable": {
      const cash = Number(params.targetNetCash);
      if (isNaN(cash) || cash <= 0) {
        throw new ValidationError("Parameter 'targetNetCash' is required and must be > 0.", { tool: t });
      }
      break;
    }

    case "ai_token_arbitrage": {
      const prompt = params.promptTokens !== undefined ? Number(params.promptTokens) : undefined;
      const completion = params.completionTokens !== undefined ? Number(params.completionTokens) : undefined;
      if (prompt === undefined && completion === undefined) {
        throw new ValidationError("At least one of 'promptTokens' or 'completionTokens' must be provided.", { tool: t });
      }
      if ((prompt !== undefined && (isNaN(prompt) || prompt < 0)) ||
          (completion !== undefined && (isNaN(completion) || completion < 0))) {
        throw new ValidationError("Token counts cannot be negative.", { tool: t });
      }
      break;
    }

    case "startup_runway_dilution": {
      const burn = Number(params.monthlyGrossBurn);
      if (isNaN(burn) || burn <= 0) {
        throw new ValidationError("Parameter 'monthlyGrossBurn' is required and must be > 0.", { tool: t });
      }
      const cash = Number(params.cashOnHand ?? 0);
      if (isNaN(cash) || cash < 0) {
        throw new ValidationError("Parameter 'cashOnHand' cannot be negative.", { tool: t });
      }
      break;
    }

    case "b2b_withholding_risk": {
      const inv = Number(params.invoiceNetRequired ?? params.invoiceAmountUsd ?? params.amount);
      if (isNaN(inv) || inv <= 0) {
        throw new ValidationError("Parameter 'invoiceNetRequired' is required and must be > 0.", { tool: t });
      }
      break;
    }

    case "feie_nomad_tracker": {
      const inc = Number(params.foreignEarnedIncome);
      if (isNaN(inc) || inc <= 0) {
        throw new ValidationError("Parameter 'foreignEarnedIncome' is required and must be > 0.", { tool: t });
      }
      break;
    }

    case "cloud_egress_finops": {
      const egress = Number(params.monthlyEgressGb ?? params.egressGb ?? (params.monthlyEgressTb ? Number(params.monthlyEgressTb) * 1024 : undefined));
      if (isNaN(egress) || egress <= 0) {
        throw new ValidationError("Parameter 'monthlyEgressGb' is required and must be > 0.", { tool: t });
      }
      break;
    }

    default:
      // Allow unrecognized or generic extensions if non-empty
      break;
  }

  return true;
}

function getRequiredFields(toolName) {
  const map = {
    mortgage_piti: ["homePrice", "interestRate", "tenureYears"],
    vat_sales_tax: ["amount"],
    tip_splitter: ["billAmount"],
    compound_wealth: ["principal or monthlyDeposit"],
    gst_calculator: ["amount"],
    tax_in: ["ctc"],
    sip_investment: ["monthlyInvestment"],
    home_loan_emi: ["principal", "annualInterestRate"],
    ppf_calculator: ["annualInvestment"],
    ssy_calculator: ["annualDeposit"],
    fd_calculator: ["principal"],
    gold_jewellery: ["grams"],
    casio_991_solve: ["expression (or a, b, c)"],
    beam_bending: ["loadNewtons", "lengthMeters", "momentOfInertiaCm4", "distanceFromNeutralAxisMm"],
    projectile_motion: ["initialVelocityMs", "launchAngleDegrees"],
    black_scholes: ["stockPrice", "strikePrice", "timeToExpiryYears"],
    linear_regression: ["xValues", "yValues"],
    pipe_flow: ["flowRateM3s", "pipeDiameterM", "pipeLengthM"],
    rlc_circuit: ["inductanceHenries", "capacitanceFarads"],
    rocket_deltav: ["dryMassKg", "specificImpulseSec"],
    contractor_parity: ["w2Salary"],
    scorp_optimizer: ["netProfit"],
    solo_401k_shield: ["netEarnings"],
    fx_invoicing: ["invoiceUsd"],
    billable_floor: ["targetNetCash"],
    ai_token_arbitrage: ["promptTokens", "completionTokens"],
    startup_runway_dilution: ["monthlyGrossBurn"],
    b2b_withholding_risk: ["invoiceNetRequired"],
    feie_nomad_tracker: ["foreignEarnedIncome"],
    cloud_egress_finops: ["monthlyEgressGb"]
  };
  const t = String(toolName || "").toLowerCase().replace(/[.-]/g, "_");
  return map[t] || ["valid input parameters"];
}
