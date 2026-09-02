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

const MCP_TOOLS = [
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
    name: "truecalci_casio_solve_quadratic",
    description: "Solve quadratic equation ax^2 + bx + c = 0 with high precision.",
    inputSchema: {
      type: "object",
      properties: {
        a: { type: "number" },
        b: { type: "number" },
        c: { type: "number" }
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
  }
];

function handleToolCall(name, args) {
  switch (name) {
    case 'truecalci_mortgage_piti':
      return GlobalFinanceEngine.calculateMortgagePITI({
        homePrice: Number(args.homePrice),
        downPaymentPercent: Number(args.downPaymentPercent || 20),
        interestRate: Number(args.interestRate),
        tenureYears: Number(args.tenureYears || 30)
      });
    case 'truecalci_vat_sales_tax':
      return GlobalFinanceEngine.calculateVAT({
        amount: Number(args.amount),
        vatRatePercent: Number(args.vatRatePercent || 20),
        mode: args.mode || 'add'
      });
    case 'truecalci_compound_wealth':
      return GlobalFinanceEngine.calculateCompoundWealth({
        principal: Number(args.principal || 0),
        monthlyDeposit: Number(args.monthlyDeposit || 0),
        annualRatePercent: Number(args.annualRatePercent || 8),
        tenureYears: Number(args.tenureYears || 10)
      });
    case 'truecalci_indian_income_tax':
      return IndianFinanceEngine.calculateIncomeTax({
        grossIncome: Number(args.ctc),
        isSalaried: args.isSalaried !== false
      });
    case 'truecalci_casio_solve_quadratic': {
      const casio = new CasioCalciEngine();
      return casio.solveQuadratic(Number(args.a), Number(args.b), Number(args.c));
    }
    case 'truecalci_beam_bending':
      return EngineeringPhysicsEngine.calculateBeamBending({
        loadNewtons: Number(args.loadNewtons),
        lengthMeters: Number(args.lengthMeters),
        elasticModulusGpa: Number(args.elasticModulusGpa || 200),
        momentOfInertiaCm4: Number(args.momentOfInertiaCm4),
        distanceFromNeutralAxisMm: Number(args.distanceFromNeutralAxisMm)
      });
    case 'truecalci_black_scholes':
      return StatisticsOptionsEngine.calculateBlackScholes({
        stockPrice: Number(args.stockPrice),
        strikePrice: Number(args.strikePrice),
        timeToExpiryYears: Number(args.timeToExpiryYears),
        riskFreeRatePercent: Number(args.riskFreeRatePercent || 4.5),
        volatilityPercent: Number(args.volatilityPercent || 25)
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
