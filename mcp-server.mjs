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

const MCP_TOOLS = [
  {
    name: "truecalci_contractor_parity",
    description: "Calculate tax, benefits parity, and net spendable cash between W-2 salaried employment and 1099 independent contractor billing, solving the exact breakeven billing rate ($/hr).",
    inputSchema: {
      type: "object",
      properties: {
        w2Salary: { type: "number", default: 130000, description: "W-2 gross annual salary ($/yr)" },
        contractorHourlyRate: { type: "number", default: 85, description: "1099 contractor hourly billing rate ($/hr)" },
        filingStatus: { type: "string", enum: ["single", "mfj"], default: "single" },
        stateTaxRatePercent: { type: "number", default: 5.0 },
        healthSubsidyAnnual: { type: "number", default: 7200 },
        match401kPercent: { type: "number", default: 4.0 },
        ptoDays: { type: "number", default: 25 },
        hoursPerWeek: { type: "number", default: 40 },
        weeksPerYear: { type: "number", default: 48 },
        annualExpenses: { type: "number", default: 6000 },
        eligibleQBI: { type: "boolean", default: true },
        targetCurrency: { type: "string", default: "EUR" },
        selectedRail: { type: "string", enum: ["wise", "deel", "payoneer", "stripe", "paypal", "wire"], default: "wise" }
      },
      required: ["w2Salary", "contractorHourlyRate"]
    }
  },
  {
    name: "truecalci_scorp_optimizer",
    description: "Calculate S-Corporation reasonable salary split, FICA tax shield, and net in-pocket savings minus payroll and CPA fees under IRS Rev. Rul. 74-44.",
    inputSchema: {
      type: "object",
      properties: {
        netProfit: { type: "number", default: 150000, description: "Annual net business profit ($/yr)" },
        salaryPercent: { type: "number", default: 55, description: "Reasonable salary percentage (e.g. 50, 55, 60)" },
        payrollAnnualFee: { type: "number", default: 600 },
        cpaAnnualFee: { type: "number", default: 1500 },
        stateAnnualFee: { type: "number", default: 200 }
      },
      required: ["netProfit"]
    }
  },
  {
    name: "truecalci_solo_401k_shield",
    description: "Calculate Solo 401(k) vs. SEP-IRA maximum legal pre-tax retirement deductions and immediate marginal tax savings under IRS Notice 2023-75 caps ($69,000 / $76,500).",
    inputSchema: {
      type: "object",
      properties: {
        netEarnings: { type: "number", default: 120000, description: "Annual net business profit or W-2 salary ($/yr)" },
        entityType: { type: "string", enum: ["llc", "scorp"], default: "llc" },
        isAge50Plus: { type: "boolean", default: false },
        marginalTaxRatePercent: { type: "number", default: 28 }
      },
      required: ["netEarnings"]
    }
  },
  {
    name: "truecalci_fx_invoicing",
    description: "Calculate cross-border USD contractor invoicing fee drag and net landed local currency across Wise, Deel, Stripe, Payoneer, PayPal, and SWIFT wire.",
    inputSchema: {
      type: "object",
      properties: {
        invoiceUsd: { type: "number", default: 10000, description: "Invoice amount in USD ($)" },
        targetCurrency: { type: "string", enum: ["EUR", "GBP", "CAD", "AUD", "INR", "SGD", "BRL", "MXN", "PHP"], default: "EUR" }
      },
      required: ["invoiceUsd"]
    }
  },
  {
    name: "truecalci_billable_floor",
    description: "Solves the true minimum billable hourly rate needed to net a target spendable cash income, factoring in 47 working weeks and non-billable buffer drag.",
    inputSchema: {
      type: "object",
      properties: {
        targetNetCash: { type: "number", default: 120000, description: "Target spendable cash take-home ($/yr)" },
        annualExpenses: { type: "number", default: 8000 },
        healthInsuranceAnnual: { type: "number", default: 7200 },
        vacationWeeks: { type: "number", default: 4 },
        nonBillablePercent: { type: "number", default: 28 },
        filingStatus: { type: "string", enum: ["single", "mfj"], default: "single" }
      },
      required: ["targetNetCash"]
    }
  },
  {
    name: "truecalci_mortgage_piti",
    description: "Calculate US monthly mortgage payment (PITI: Principal, Interest, Property Tax, Insurance & PMI) and 30-year amortization schedule.",
    inputSchema: {
      type: "object",
      properties: {
        homePrice: { type: "number", description: "Purchase price of the home (e.g. 450000)" },
        downPaymentPercent: { type: "number", default: 20, description: "Down payment % (e.g. 20)" },
        interestRate: { type: "number", description: "Annual interest rate % (e.g. 6.8)" },
        tenureYears: { type: "integer", default: 30, description: "Loan term in years" }
      },
      required: ["homePrice", "interestRate"]
    }
  },
  {
    name: "truecalci_vat_sales_tax",
    description: "Calculate European VAT and global Sales Tax in Add Mode (Net -> Gross) or Remove Mode (Gross -> Net).",
    inputSchema: {
      type: "object",
      properties: {
        amount: { type: "number", description: "Amount in currency" },
        vatRatePercent: { type: "number", default: 20, description: "VAT/Tax rate % (e.g. 20 for UK, 19 for Germany)" },
        mode: { type: "string", enum: ["add", "remove"], default: "add" }
      },
      required: ["amount", "vatRatePercent"]
    }
  },
  {
    name: "truecalci_tip_splitter",
    description: "Calculate restaurant bill tipping, tax inclusion, and per-guest itemized bill split.",
    inputSchema: {
      type: "object",
      properties: {
        billAmount: { type: "number", description: "Subtotal or total bill before tip" },
        tipPercent: { type: "number", default: 18, description: "Tip percentage (e.g. 15, 18, 20, 25)" },
        numPeople: { type: "integer", default: 2, description: "Number of guests dining" }
      },
      required: ["billAmount"]
    }
  },
  {
    name: "truecalci_compound_wealth",
    description: "Simulate exponential compounding wealth for 401(k), Roth IRA, UK ISA, or European ETF savings plans.",
    inputSchema: {
      type: "object",
      properties: {
        principal: { type: "number", default: 10000, description: "Initial deposit" },
        monthlyDeposit: { type: "number", default: 500, description: "Monthly addition" },
        annualRatePercent: { type: "number", default: 8, description: "Expected annual return %" },
        tenureYears: { type: "integer", default: 15, description: "Investment duration in years" }
      },
      required: ["annualRatePercent", "tenureYears"]
    }
  },
  {
    name: "truecalci_indian_income_tax",
    description: "Compute Indian Income Tax under Budget 2025-26 New Tax Regime vs Old Tax Regime.",
    inputSchema: {
      type: "object",
      properties: {
        ctc: { type: "number", description: "Gross Salary / CTC in INR (₹)" },
        isSalaried: { type: "boolean", default: true }
      },
      required: ["ctc"]
    }
  },
  {
    name: "truecalci_sip_investment",
    description: "Compute Systematic Investment Plan (SIP) mutual fund maturity with optional annual step-up percentage.",
    inputSchema: {
      type: "object",
      properties: {
        monthlyInvestment: { type: "number", description: "Monthly SIP amount" },
        annualReturnRate: { type: "number", default: 12, description: "Expected annual return rate in %" },
        tenureYears: { type: "integer", default: 10, description: "Investment duration in years" },
        stepUpPercent: { type: "number", default: 0, description: "Annual step-up percentage" }
      },
      required: ["monthlyInvestment"]
    }
  },
  {
    name: "truecalci_home_loan_emi",
    description: "Compute reducing balance monthly loan EMI and total interest with amortization schedule.",
    inputSchema: {
      type: "object",
      properties: {
        principal: { type: "number", description: "Loan amount" },
        interestRatePercent: { type: "number", description: "Annual interest rate %" },
        tenureYears: { type: "integer", default: 20, description: "Loan term in years" }
      },
      required: ["principal", "interestRatePercent"]
    }
  },
  {
    name: "truecalci_casio_solve_quadratic",
    description: "Solve quadratic equation ax^2 + bx + c = 0 or simultaneous linear equations with high precision.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["quadratic", "simultaneous2"], default: "quadratic" },
        a: { type: "number" },
        b: { type: "number" },
        c: { type: "number" },
        a2: { type: "number" },
        b2: { type: "number" },
        c2: { type: "number" }
      },
      required: ["a", "b", "c"]
    }
  },
  {
    name: "truecalci_beam_bending",
    description: "Calculate structural engineering beam deflection, max bending moment, and peak stress (Euler-Bernoulli beam).",
    inputSchema: {
      type: "object",
      properties: {
        loadNewtons: { type: "number", description: "Point load P in Newtons (N)" },
        lengthMeters: { type: "number", description: "Beam span L in meters (m)" },
        elasticModulusGpa: { type: "number", default: 200, description: "Young's Modulus E in GPa" },
        momentOfInertiaCm4: { type: "number", description: "Area moment of inertia I in cm^4" },
        distanceFromNeutralAxisMm: { type: "number", description: "Distance y to extreme fiber in mm" }
      },
      required: ["loadNewtons", "lengthMeters", "momentOfInertiaCm4", "distanceFromNeutralAxisMm"]
    }
  },
  {
    name: "truecalci_projectile_motion",
    description: "Calculate 2D physics projectile kinematics: max height, horizontal range, flight time, and velocity components.",
    inputSchema: {
      type: "object",
      properties: {
        initialVelocityMs: { type: "number", description: "Initial launch velocity v0 in m/s" },
        launchAngleDegrees: { type: "number", description: "Launch angle in degrees (0 to 90)" },
        gravityMs2: { type: "number", default: 9.80665, description: "Gravitational acceleration in m/s^2" }
      },
      required: ["initialVelocityMs", "launchAngleDegrees"]
    }
  },
  {
    name: "truecalci_black_scholes",
    description: "Calculate European Option pricing (Call/Put) and Greeks (Delta, Gamma, Vega, Theta) via Black-Scholes formula.",
    inputSchema: {
      type: "object",
      properties: {
        stockPrice: { type: "number", description: "Spot price S" },
        strikePrice: { type: "number", description: "Strike price K" },
        timeToExpiryYears: { type: "number", description: "Expiration time T in years" },
        riskFreeRatePercent: { type: "number", default: 4.5, description: "Risk-free rate %" },
        volatilityPercent: { type: "number", default: 25, description: "Implied volatility %" }
      },
      required: ["stockPrice", "strikePrice", "timeToExpiryYears"]
    }
  },
  {
    name: "truecalci_linear_regression",
    description: "Calculate Ordinary Least Squares (OLS) best-fit line (y = mx + c), Pearson correlation coefficient r, and R^2 determination.",
    inputSchema: {
      type: "object",
      properties: {
        points: {
          type: "array",
          items: {
            type: "object",
            properties: {
              x: { type: "number" },
              y: { type: "number" }
            },
            required: ["x", "y"]
          },
          description: "Array of {x, y} coordinate pairs (min 2 points)"
        }
      },
      required: ["points"]
    }
  },
  {
    name: "truecalci_pipe_flow",
    description: "Darcy-Weisbach fluid mechanics pipe friction factor, Reynolds number, head loss, and pressure drop.",
    inputSchema: {
      type: "object",
      properties: {
        flowRateM3s: { type: "number", default: 0.05, description: "Volumetric flow rate Q in m^3/s" },
        pipeDiameterM: { type: "number", default: 0.15, description: "Internal pipe diameter D in meters" },
        pipeLengthM: { type: "number", default: 100, description: "Total pipe run length L in meters" },
        fluidDensityKgM3: { type: "number", default: 1000, description: "Fluid density (kg/m^3)" },
        dynamicViscosityPaS: { type: "number", default: 0.001, description: "Dynamic viscosity (Pa·s)" },
        pipeRoughnessM: { type: "number", default: 0.000045, description: "Absolute pipe surface roughness (m)" }
      },
      required: ["flowRateM3s", "pipeDiameterM", "pipeLengthM"]
    }
  },
  {
    name: "truecalci_rlc_circuit",
    description: "Resonant RLC circuit AC impedance magnitude, phase angle, resonant frequency f0, and quality factor Q.",
    inputSchema: {
      type: "object",
      properties: {
        resistanceOhms: { type: "number", default: 50, description: "Resistance R in Ohms (Ω)" },
        inductanceHenrys: { type: "number", default: 0.01, description: "Inductance L in Henrys (H)" },
        capacitanceFarads: { type: "number", default: 0.000001, description: "Capacitance C in Farads (F)" },
        frequencyHz: { type: "number", description: "Operating frequency in Hz" }
      },
      required: ["resistanceOhms", "inductanceHenrys", "capacitanceFarads"]
    }
  },
  {
    name: "truecalci_rocket_deltav",
    description: "Tsiolkovsky rocket equation delta-v budget, effective exhaust velocity, mass ratio, and propellant mass fraction.",
    inputSchema: {
      type: "object",
      properties: {
        initialMassKg: { type: "number", default: 549054, description: "Wet launch mass m0 in kg" },
        finalMassKg: { type: "number", default: 22200, description: "Dry burnout mass mf in kg" },
        specificImpulseSeconds: { type: "number", default: 311, description: "Engine specific impulse Isp in seconds" },
        gravityMs2: { type: "number", default: 9.80665, description: "Standard gravity g0 in m/s^2" }
      },
      required: ["initialMassKg", "finalMassKg", "specificImpulseSeconds"]
    }
  }
];

function handleToolCall(name, args) {
  const norm = name.replace(/^truecalci_/, '').toLowerCase();
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
        tenureYears: Number(args.tenureYears || 30)
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
    case 'indian_income_tax':
    case 'tax':
      return IndianFinanceEngine.calculateIncomeTax({
        grossIncome: Number(args.ctc || args.income || args.grossIncome),
        isSalaried: args.isSalaried !== false
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
        tenureYears: Number(args.tenureYears || 20)
      });
    case 'casio_solve_quadratic':
    case 'casio_991_solve':
    case 'calci991_solve':
    case 'casio': {
      const casio = new CasioCalciEngine();
      if (args.type === 'simultaneous2') {
        return casio.solveSimultaneous2(
          Number(args.a || 1), Number(args.b || 1), Number(args.c || 5),
          Number(args.a2 || 1), Number(args.b2 || -1), Number(args.c2 || 1)
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
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "truecalci-mcp-server",
          version: "2.0.0"
        }
      });
      return;
    }

    if (method === 'notifications/initialized') {
      // Client ack, no response needed
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
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        });
      } catch (toolErr) {
        sendResponse(id, null, {
          code: -32000,
          message: toolErr.message
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
