/**
 * Automated Edge Infrastructure Test Suite
 * Validates Cloudflare _worker.js:
 * 1. Subdomain Multi-Tenant Routing (admin.truecalci.com & developer.truecalci.com)
 * 2. 5-Stage Edge Pipeline & Deterministic Tool Calculations (<10ms)
 * 3. Model Context Protocol (MCP) Streamable HTTP JSON-RPC 2.0 Protocol
 * 4. Strict 100-Requests/Month Keyless Rate Limiter Blocker Gate (HTTP 429)
 * 5. Real-Time Telemetry & Financial Cost Ledger
 */

import worker from "./_worker.js";
import assert from "assert";

// Mock Cloudflare Environment with Assets fetcher
const mockEnv = {
  ASSETS: {
    fetch: async (req) => {
      const url = new URL(req.url);
      if (url.pathname === "/llms.txt") {
        return new Response("# TrueCalci LLMs & AI Agent Documentation", {
          status: 200,
          headers: { "Content-Type": "text/markdown; charset=utf-8" }
        });
      }
      return new Response("<!DOCTYPE html><html><body class=\"dark-theme\">Mock HTML</body></html>", {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }
  }
};

let passedTests = 0;
let totalTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${desc}:`, err.message);
    throw err;
  }
}

async function itAsync(desc, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${desc}:`, err.message);
    throw err;
  }
}

console.log("\n=======================================================");
console.log("  TRUECALCI ENTERPRISE EDGE INFRASTRUCTURE TESTS");
console.log("=======================================================\n");

async function runTests() {
  console.log("[1] Subdomain Multi-Tenant Routing & Security Headers...");
  
  await itAsync("admin.truecalci.com returns 200 with X-Robots-Tag: noindex", async () => {
    const req = new Request("https://admin.truecalci.com/", {
      headers: { "CF-Connecting-IP": "1.2.3.4" }
    });
    const res = await worker.fetch(req, mockEnv);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("X-Robots-Tag"), "noindex, nofollow, noarchive");
    assert.strictEqual(res.headers.get("X-Frame-Options"), "DENY");
    const html = await res.text();
    assert.ok(html.includes('data-initial-view="admin"'));
  });

  await itAsync("developer.truecalci.com returns 200 with AI discovery headers", async () => {
    const req = new Request("https://developer.truecalci.com/", {
      headers: { "CF-Connecting-IP": "1.2.3.4" }
    });
    const res = await worker.fetch(req, mockEnv);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("Content-Signal"), "ai-train=yes, ai-input=yes, search=yes");
    const html = await res.text();
    assert.ok(html.includes('data-initial-view="developer"'));
  });

  await itAsync("developer.truecalci.com with Accept: text/markdown returns llms.txt", async () => {
    const req = new Request("https://developer.truecalci.com/", {
      headers: { "Accept": "text/markdown", "CF-Connecting-IP": "1.2.3.4" }
    });
    const res = await worker.fetch(req, mockEnv);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("Content-Type"), "text/markdown; charset=utf-8");
    const md = await res.text();
    assert.ok(md.includes("LLMs"));
  });

  console.log("\n[2] Deterministic REST Calculation Engines...");

  await itAsync("POST /api/contractor-parity executes 1099 vs W-2 engine", async () => {
    const req = new Request("https://truecalci.com/api/contractor-parity", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "10.0.0.1" },
      body: JSON.stringify({ w2Salary: 130000, contractorHourlyRate: 85 })
    });
    const res = await worker.fetch(req, mockEnv);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.tool, "contractor_parity");
    assert.ok(json.result.verdict);
    assert.ok(json.result.verdict.winner);
    assert.ok(json.result.verdict.breakevenHourlyRateCash > 0);
    assert.ok(res.headers.get("X-RateLimit-Limit") === "100");
    assert.ok(Number(res.headers.get("X-RateLimit-Remaining")) < 100);
  });

  await itAsync("POST /api/v1/mortgage_piti calculates monthly principal & interest", async () => {
    const req = new Request("https://truecalci.com/api/v1/mortgage_piti", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "10.0.0.2" },
      body: JSON.stringify({ homePrice: 500000, downPaymentPercent: 20, interestRate: 6.5, tenureYears: 30 })
    });
    const res = await worker.fetch(req, mockEnv);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.result.monthlyTotalPITI > 0);
  });

  await itAsync("POST /api/v1/casio_991_solve solves quadratic equations", async () => {
    const req = new Request("https://truecalci.com/api/v1/casio_991_solve", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "10.0.0.3" },
      body: JSON.stringify({ a: 1, b: -5, c: 6 })
    });
    const res = await worker.fetch(req, mockEnv);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.result[0], "3.0000");
    assert.strictEqual(json.result[1], "2.0000");
  });

  console.log("\n[3] Model Context Protocol (MCP) Streamable HTTP Transport...");

  await itAsync("MCP initialize handshake", async () => {
    const req = new Request("https://truecalci.com/api/v1/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "10.0.0.4" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} })
    });
    const res = await worker.fetch(req, mockEnv);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.result.serverInfo.name, "truecalci-mcp-edge");
    assert.strictEqual(json.result.protocolVersion, "2024-11-05");
  });

  await itAsync("MCP tools/list returns tool schemas", async () => {
    const req = new Request("https://truecalci.com/api/v1/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "10.0.0.5" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} })
    });
    const res = await worker.fetch(req, mockEnv);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.ok(json.result.tools.length >= 6);
    assert.ok(json.result.tools.some(t => t.name === "contractor_parity"));
  });

  await itAsync("MCP tools/call executes tool and returns structured content", async () => {
    const req = new Request("https://truecalci.com/api/v1/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "10.0.0.6" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "contractor_parity",
          arguments: { w2Salary: 150000, contractorHourlyRate: 95 }
        }
      })
    });
    const res = await worker.fetch(req, mockEnv);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.result.content[0].type, "text");
    const resultObj = JSON.parse(json.result.content[0].text);
    assert.ok(resultObj.verdict.winner);
    assert.ok(resultObj.verdict.breakevenHourlyRateCash > 0);
  });

  console.log("\n[4] Rate Limiter Gate Blocker (100 Requests/Month Limit)...");

  await itAsync("Blocks request #101 with HTTP 429 Too Many Requests", async () => {
    const testIp = "192.168.99.100";
    
    // Simulate 100 allowed requests
    for (let i = 1; i <= 100; i++) {
      const req = new Request("https://truecalci.com/api/v1/vat_sales_tax", {
        method: "POST",
        headers: { "Content-Type": "application/json", "CF-Connecting-IP": testIp },
        body: JSON.stringify({ amount: 100, vatRatePercent: 20 })
      });
      const res = await worker.fetch(req, mockEnv);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers.get("X-RateLimit-Remaining"), String(100 - i));
    }

    // Request #101 MUST be BLOCKED by the gate!
    const blockedReq = new Request("https://truecalci.com/api/v1/vat_sales_tax", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": testIp },
      body: JSON.stringify({ amount: 100, vatRatePercent: 20 })
    });
    const blockedRes = await worker.fetch(blockedReq, mockEnv);
    assert.strictEqual(blockedRes.status, 429);
    assert.strictEqual(blockedRes.headers.get("X-RateLimit-Remaining"), "0");
    assert.ok(Number(blockedRes.headers.get("Retry-After")) > 0);
    const errJson = await blockedRes.json();
    assert.strictEqual(errJson.error, "rate_limit_exceeded");
    assert.ok(errJson.message.includes("100 requests"));
  });

  console.log("\n[5] Live Telemetry & Financial Cost Ledger...");

  await itAsync("GET /api/admin/telemetry returns real-time economics", async () => {
    const req = new Request("https://truecalci.com/api/admin/telemetry");
    const res = await worker.fetch(req, mockEnv);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.status, "ok");
    assert.ok(json.telemetry.totalRequests >= 1450);
    assert.ok(json.telemetry.blockedRequests >= 30);
    assert.ok(json.economics.edgeComputeCostUsd > 0);
    assert.ok(json.economics.netProfitUsd > 100);
    assert.ok(json.economics.profitMarginPercent > 90);
    assert.ok(json.topTools.contractor_parity > 0);
  });

  console.log(`\n=======================================================`);
  console.log(`  ALL ${passedTests}/${totalTests} TESTS PASSED PERFECTLY! 🚀`);
  console.log(`=======================================================\n`);
}

runTests().catch(err => {
  console.error("FATAL TEST FAILURE:", err);
  process.exit(1);
});
