import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { GlobalFinanceEngine } from './js/engines/global-finance.js';
import { IndianFinanceEngine } from './js/engines/indian-finance.js';
import { CasioCalciEngine } from './js/engines/casio-engine.js';
import { BasicCalculatorEngine } from './js/engines/basic-engine.js';
import { ProgrammerEngine, UnitConverterEngine } from './js/engines/programmer-engine.js';
import { EngineeringPhysicsEngine } from './js/engines/engineering-physics.js';
import { StatisticsOptionsEngine } from './js/engines/statistics-options.js';
import { ContractorMatrixEngine } from './js/engines/contractor-matrix.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 4000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webp': 'image/webp'
};

// Tool Definitions according to Model Context Protocol (MCP) and OpenAI Tool Spec
const TOOL_DEFINITIONS = [
  {
    name: "contractor_takehome_matrix",
    description: "Calculate tax, benefits parity, and net spendable cash between W-2 salaried employment and 1099 independent contractor billing, solving the exact breakeven billing rate ($/hr).",
    parameters: {
      type: "object",
      properties: {
        w2Salary: { type: "number", default: 130000, description: "W-2 gross annual salary in USD ($/yr)" },
        contractorHourlyRate: { type: "number", default: 85, description: "1099 contractor hourly billing rate in USD ($/hr)" },
        filingStatus: { type: "string", enum: ["single", "mfj"], default: "single", description: "Tax filing status" },
        stateTaxRatePercent: { type: "number", default: 5.0, description: "State income tax rate %" },
        healthSubsidyAnnual: { type: "number", default: 7200, description: "Annual W-2 employer health insurance subsidy ($/yr)" },
        match401kPercent: { type: "number", default: 4.0, description: "W-2 employer 401(k) match %" },
        ptoDays: { type: "number", default: 25, description: "W-2 paid time off days" },
        hoursPerWeek: { type: "number", default: 40, description: "1099 billable hours per week" },
        weeksPerYear: { type: "number", default: 48, description: "1099 billable weeks per year" },
        annualExpenses: { type: "number", default: 6000, description: "1099 deductible business expenses ($/yr)" },
        eligibleQBI: { type: "boolean", default: true, description: "Eligible for Section 199A 20% QBI deduction" },
        targetCurrency: { type: "string", default: "EUR", description: "Target currency for international cross-border FX drag" },
        selectedRail: { type: "string", enum: ["wise", "deel", "payoneer", "stripe", "paypal", "wire"], default: "wise" }
      },
      required: ["w2Salary", "contractorHourlyRate"]
    }
  },
  {
    name: "mortgage_piti",
    description: "Calculate US monthly mortgage payment (PITI: Principal, Interest, Property Tax, Insurance & PMI) and 30-year amortization schedule.",
    parameters: {
      type: "object",
      properties: {
        homePrice: { type: "number", description: "Purchase price of the home in currency units (e.g. 450000)" },
        downPaymentPercent: { type: "number", default: 20, description: "Down payment percentage (e.g. 20 for 20%)" },
        interestRate: { type: "number", description: "Annual interest rate in % (e.g. 6.8)" },
        tenureYears: { type: "integer", default: 30, description: "Loan duration in years (e.g. 15, 20, 30)" },
        propertyTaxRatePercent: { type: "number", default: 1.2, description: "Annual property tax rate %" },
        annualHomeInsurance: { type: "number", default: 1400, description: "Annual hazard insurance premium" },
        annualPmiPercent: { type: "number", default: 0.75, description: "Annual PMI % if down payment < 20%" }
      },
      required: ["homePrice", "interestRate"]
    }
  },
  {
    name: "vat_sales_tax",
    description: "Calculate European VAT and global Sales Tax in Add Mode (Net -> Gross) or Remove Mode (Gross -> Net) with statutory rate presets.",
    parameters: {
      type: "object",
      properties: {
        amount: { type: "number", description: "Monetary amount" },
        taxRatePercent: { type: "number", default: 20, description: "Tax rate in % (e.g. 20 for UK/France, 19 for Germany)" },
        mode: { type: "string", enum: ["add", "remove"], default: "add", description: "'add' to add VAT to net price, 'remove' to extract VAT from gross" }
      },
      required: ["amount", "taxRatePercent"]
    }
  },
  {
    name: "tip_splitter",
    description: "Calculate restaurant bill tipping, tax inclusion, and per-guest itemized bill split.",
    parameters: {
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
    name: "compound_wealth",
    description: "Simulate exponential compounding wealth for 401(k), Roth IRA, UK ISA, or European ETF savings plans (Sparplan).",
    parameters: {
      type: "object",
      properties: {
        initialDeposit: { type: "number", default: 10000, description: "Initial principal" },
        monthlyContribution: { type: "number", default: 500, description: "Monthly recurring contribution" },
        annualRatePercent: { type: "number", default: 8, description: "Expected annual return in %" },
        timeHorizonYears: { type: "integer", default: 15, description: "Duration in years" },
        compoundFrequency: { type: "integer", default: 12, description: "Compounding frequency per year (12 = monthly)" }
      },
      required: ["annualRatePercent", "timeHorizonYears"]
    }
  },
  {
    name: "indian_income_tax",
    description: "Compute Indian Income Tax under Budget 2025-26 New Tax Regime (with Section 87A rebate & ₹75,000 standard deduction) vs Old Tax Regime.",
    parameters: {
      type: "object",
      properties: {
        ctc: { type: "number", description: "Annual Cost-to-Company / Gross Salary in INR (₹)" },
        isSalaried: { type: "boolean", default: true, description: "Whether taxpayer is salaried (eligible for ₹75k standard deduction)" }
      },
      required: ["ctc"]
    }
  },
  {
    name: "sip_investment",
    description: "Compute Systematic Investment Plan (SIP) mutual fund maturity with optional annual step-up percentage.",
    parameters: {
      type: "object",
      properties: {
        monthlyInvestment: { type: "number", description: "Monthly SIP amount" },
        annualReturnRate: { type: "number", default: 12, description: "Expected annual return rate in %" },
        timePeriodYears: { type: "integer", default: 10, description: "Investment duration in years" },
        stepUpPercent: { type: "number", default: 0, description: "Annual step-up percentage (e.g. 10 for 10% annual increase)" }
      },
      required: ["monthlyInvestment"]
    }
  },
  {
    name: "home_loan_emi",
    description: "Compute reducing balance monthly loan EMI and total interest with prepayment impact.",
    parameters: {
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
    name: "calci991_solve",
    description: "Solve quadratic polynomial equation (ax^2 + bx + c = 0) or 2-unknown simultaneous linear equations.",
    parameters: {
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
      required: ["type", "a", "b", "c"]
    }
  },
  {
    name: "beam_bending",
    description: "Calculate structural engineering beam deflection, max bending moment, and peak stress (Euler-Bernoulli simply supported beam).",
    parameters: {
      type: "object",
      properties: {
        loadNewtons: { type: "number", description: "Point load P in Newtons (N)" },
        lengthMeters: { type: "number", description: "Beam span L in meters (m)" },
        elasticModulusGpa: { type: "number", default: 200, description: "Young's Modulus E in GPa (e.g. 200 for structural steel)" },
        momentOfInertiaCm4: { type: "number", description: "Area moment of inertia I in cm^4" },
        distanceFromNeutralAxisMm: { type: "number", description: "Distance y to extreme fiber in mm" }
      },
      required: ["loadNewtons", "lengthMeters", "momentOfInertiaCm4", "distanceFromNeutralAxisMm"]
    }
  },
  {
    name: "projectile_motion",
    description: "Calculate 2D physics projectile kinematics: max height, horizontal range, flight time, and velocity components.",
    parameters: {
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
    name: "black_scholes_options",
    description: "Compute quantitative finance European Option prices (Call and Put) and Greeks (Delta, Gamma, Vega, Theta) via Black-Scholes model.",
    parameters: {
      type: "object",
      properties: {
        stockPrice: { type: "number", description: "Underlying stock/asset spot price S" },
        strikePrice: { type: "number", description: "Strike price K" },
        timeToExpiryYears: { type: "number", description: "Time to expiration T in years (e.g. 0.5 for 6 months)" },
        riskFreeRatePercent: { type: "number", default: 4.5, description: "Risk-free interest rate r in %" },
        volatilityPercent: { type: "number", default: 25, description: "Annualized implied volatility sigma in %" }
      },
      required: ["stockPrice", "strikePrice", "timeToExpiryYears"]
    }
  },
  {
    name: "linear_regression",
    description: "Calculate Ordinary Least Squares (OLS) best-fit line (y = mx + c), Pearson correlation coefficient r, and R^2 determination.",
    parameters: {
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
  }
];

function executeCalculation(toolName, params) {
  switch (toolName) {
    case 'contractor_takehome_matrix':
    case 'contractor_parity':
      return ContractorMatrixEngine.calculateParity(
        {
          salary: Number(params.w2Salary || params.salary || 130000),
          filingStatus: params.filingStatus || 'single',
          stateTaxRatePercent: Number(params.stateTaxRatePercent !== undefined ? params.stateTaxRatePercent : 5.0),
          healthSubsidyAnnual: Number(params.healthSubsidyAnnual !== undefined ? params.healthSubsidyAnnual : 7200),
          match401kPercent: Number(params.match401kPercent !== undefined ? params.match401kPercent : 4.0),
          ptoDays: Number(params.ptoDays !== undefined ? params.ptoDays : 25)
        },
        {
          hourlyRate: Number(params.contractorHourlyRate || params.hourlyRate || 85),
          hoursPerWeek: Number(params.hoursPerWeek || 40),
          weeksPerYear: Number(params.weeksPerYear || 48),
          annualExpenses: Number(params.annualExpenses !== undefined ? params.annualExpenses : 6000),
          filingStatus: params.filingStatus || 'single',
          stateTaxRatePercent: Number(params.stateTaxRatePercent !== undefined ? params.stateTaxRatePercent : 5.0),
          eligibleQBI: params.eligibleQBI !== false,
          selfFundedHealthAnnual: Number(params.selfFundedHealthAnnual !== undefined ? params.selfFundedHealthAnnual : 7200)
        },
        {
          targetCurrency: params.targetCurrency || 'EUR',
          selectedRail: params.selectedRail || 'wise'
        }
      );

    case 'mortgage_piti':
    case 'mortgage':
      return GlobalFinanceEngine.calculateMortgagePITI({
        homePrice: Number(params.homePrice),
        downPaymentPercent: Number(params.downPaymentPercent || 20),
        interestRate: Number(params.interestRate),
        tenureYears: Number(params.tenureYears || 30),
        propertyTaxRatePercent: Number(params.propertyTaxRatePercent || 1.2),
        annualHomeInsurance: Number(params.annualHomeInsurance || 1400),
        annualPmiPercent: Number(params.annualPmiPercent || 0.75)
      });

    case 'vat_sales_tax':
    case 'vat':
      return GlobalFinanceEngine.calculateVAT({
        amount: Number(params.amount),
        vatRatePercent: Number(params.vatRatePercent || params.taxRatePercent || params.rate || 20),
        mode: params.mode || 'add'
      });

    case 'tip_splitter':
    case 'tip':
      return GlobalFinanceEngine.calculateTip({
        billAmount: Number(params.billAmount),
        tipPercent: Number(params.tipPercent || 18),
        numberOfGuests: Number(params.numberOfGuests || params.numPeople || 2)
      });

    case 'compound_wealth':
    case 'compound':
      return GlobalFinanceEngine.calculateCompoundWealth({
        principal: Number(params.principal || params.initialDeposit || 0),
        monthlyDeposit: Number(params.monthlyDeposit || params.monthlyContribution || 0),
        annualRatePercent: Number(params.annualRatePercent || params.rate || 8),
        tenureYears: Number(params.tenureYears || params.timeHorizonYears || 10),
        compoundingFrequency: Number(params.compoundingFrequency || params.compoundFrequency || 12)
      });

    case 'indian_income_tax':
    case 'tax':
      return IndianFinanceEngine.calculateIncomeTax({
        grossIncome: Number(params.ctc || params.income || params.grossIncome),
        isSalaried: params.isSalaried !== false
      });

    case 'sip_investment':
    case 'sip':
      return IndianFinanceEngine.calculateSIP({
        monthlyInvestment: Number(params.monthlyInvestment || params.monthly),
        annualReturnRate: Number(params.annualReturnRate || params.rate || 12),
        tenureYears: Number(params.tenureYears || params.timePeriodYears || params.years || 10),
        annualStepUpPercent: Number(params.stepUpPercent || params.annualStepUpPercent || 0)
      });

    case 'home_loan_emi':
    case 'emi':
      return IndianFinanceEngine.calculateHomeLoan({
        principal: Number(params.principal),
        annualInterestRate: Number(params.annualInterestRate || params.interestRatePercent || params.rate || 8.5),
        tenureYears: Number(params.tenureYears || params.years || 20)
      });

    case 'calci991_solve': {
      const casio = new CasioCalciEngine();
      if (params.type === 'simultaneous2') {
        return casio.solveSimultaneous2(
          Number(params.a), Number(params.b), Number(params.c),
          Number(params.a2), Number(params.b2), Number(params.c2)
        );
      }
      return casio.solveQuadratic(Number(params.a), Number(params.b), Number(params.c));
    }

    case 'beam_bending':
      return EngineeringPhysicsEngine.calculateBeamBending({
        loadNewtons: Number(params.loadNewtons),
        lengthMeters: Number(params.lengthMeters),
        elasticModulusGpa: Number(params.elasticModulusGpa || 200),
        momentOfInertiaCm4: Number(params.momentOfInertiaCm4),
        distanceFromNeutralAxisMm: Number(params.distanceFromNeutralAxisMm)
      });

    case 'projectile_motion':
      return EngineeringPhysicsEngine.calculateProjectileMotion({
        initialVelocityMs: Number(params.initialVelocityMs),
        launchAngleDegrees: Number(params.launchAngleDegrees),
        gravityMs2: Number(params.gravityMs2 || 9.80665)
      });

    case 'black_scholes_options':
      return StatisticsOptionsEngine.calculateBlackScholes({
        stockPrice: Number(params.stockPrice),
        strikePrice: Number(params.strikePrice),
        timeToExpiryYears: Number(params.timeToExpiryYears),
        riskFreeRatePercent: Number(params.riskFreeRatePercent || 4.5),
        volatilityPercent: Number(params.volatilityPercent || 25)
      });

    case 'linear_regression':
      return StatisticsOptionsEngine.calculateLinearRegression(params.points);

    default:
      throw new Error(`Unsupported tool: "${toolName}". Call /api/v1/tools for full directory.`);
  }
}

const server = http.createServer((req, res) => {
  let parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Common CORS headers for AI Agent and Web clients
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ---------------------------------------------------------------------------
  // 1. TrueCalci REST API & Model Context Protocol (MCP) Endpoints
  // ---------------------------------------------------------------------------
  if (pathname === '/api/v1/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'TrueCalci Open AI Agent API',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      modelsSupported: ['Claude 3.7 Sonnet', 'Claude 3.5 Sonnet', 'GPT-4o', 'Gemini 2.0 Flash', 'DeepSeek-R1']
    }, null, 2));
    return;
  }

  if (pathname === '/api/v1/tools' || pathname === '/mcp/tools' || pathname === '/.well-known/mcp.json') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      name: 'truecalci_mcp_suite',
      description: 'High-precision mathematical and financial computational tool suite for AI Agents and LLMs.',
      protocolVersion: '2024-11-05',
      tools: TOOL_DEFINITIONS
    }, null, 2));
    return;
  }

  if (pathname === '/api/v1/calculate') {
    const handleCalculation = (toolName, params) => {
      try {
        const result = executeCalculation(toolName, params);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          tool: toolName,
          result: result,
          disclaimer: 'Calculated deterministically via TrueCalci Computational Engine v2.0.0.',
          meta: {
            timestamp: new Date().toISOString(),
            accuracy: 'IEEE 754 High-Precision'
          }
        }, null, 2));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: err.message,
          availableTools: TOOL_DEFINITIONS.map(t => t.name)
        }, null, 2));
      }
    };

    if (req.method === 'GET') {
      const tool = parsedUrl.searchParams.get('tool');
      const params = Object.fromEntries(parsedUrl.searchParams.entries());
      handleCalculation(tool, params);
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const json = JSON.parse(body || '{}');
          handleCalculation(json.tool, json.params || json);
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Malformed JSON request body.' }));
        }
      });
      return;
    }
  }

  // Dedicated Route: /api/contractor-parity and /api/v1/contractor-parity
  if (pathname === '/api/contractor-parity' || pathname === '/api/v1/contractor-parity') {
    const handleContractorParity = (params) => {
      try {
        const result = executeCalculation('contractor_takehome_matrix', params);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          service: 'TrueCalci Remote Contractor Parity Engine',
          result,
          disclaimer: 'Calculated deterministically via TrueCalci Computational Engine under 2024/2025 US tax law.'
        }, null, 2));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    };

    if (req.method === 'GET') {
      handleContractorParity(Object.fromEntries(parsedUrl.searchParams.entries()));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          handleContractorParity(JSON.parse(body || '{}'));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Malformed JSON request body.' }));
        }
      });
      return;
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Static File Server
  // ---------------------------------------------------------------------------
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const filePath = path.join(__dirname, pathname);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[TrueCalci Suite & Open AI Agent API] Running on http://localhost:${PORT}/ (Bound to 0.0.0.0:${PORT})`);
});
