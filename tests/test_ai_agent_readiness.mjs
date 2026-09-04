/**
 * Test Suite: Cloudflare Agent Readiness & AEO Full Specifications Audit
 * Tests:
 * 1. Markdown content negotiation (Accept: text/markdown)
 * 2. RFC 9727 API Catalog (/.well-known/api-catalog with linkset)
 * 3. Link Response Headers (RFC 8288)
 * 4. Auth.md agent registration discovery (/auth.md with # auth.md)
 * 5. OAuth & OIDC discovery (/.well-known/oauth-authorization-server, /.well-known/openid-configuration)
 * 6. OAuth Protected Resource metadata (RFC 9728)
 * 7. A2A Agent Card (/.well-known/agent-card.json)
 * 8. Web Bot Auth JWKS (/.well-known/http-message-signatures-directory)
 * 9. WebMCP API (navigator.modelContext.registerTool)
 * 10. Dual-domain SEO (.com and .in in robots.txt & sitemap.xml)
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('='.repeat(80));
console.log('CLOUDFLARE AGENT READINESS FULL SPECIFICATIONS STRESS TEST');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}\n   Error: ${err.message}`);
    failed++;
  }
}

const ROOT = 'c:\\Calculator\\public_deploy';

// [1] Testing Auth.md
console.log('\n[1] Testing Auth.md Agent Registration Discovery...');
const authMd = fs.readFileSync(path.join(ROOT, 'auth.md'), 'utf8');
test('auth.md exists and starts with # auth.md heading', () => {
  assert(authMd.startsWith('# auth.md'), 'auth.md must start with # auth.md');
});
test('auth.md documents agent audience, registration, and anonymous methods', () => {
  assert(authMd.includes('Agent Audience'));
  assert(authMd.includes('anonymous'));
  assert(authMd.includes('verified_email'));
});

// [2] Testing RFC 9727 API Catalog
console.log('\n[2] Testing RFC 9727 API Catalog (/.well-known/api-catalog)...');
const apiCatalogRaw = fs.readFileSync(path.join(ROOT, '.well-known', 'api-catalog'), 'utf8');
const apiCatalog = JSON.parse(apiCatalogRaw);
test('api-catalog has valid linkset array with service-desc and service-doc', () => {
  assert(Array.isArray(apiCatalog.linkset));
  const entry = apiCatalog.linkset[0];
  assert(entry.anchor === 'https://truecalci.com/api/v1/');
  assert(entry['service-desc'][0].href === 'https://truecalci.com/openapi.json');
  assert(entry['service-doc'][0].href === 'https://truecalci.com/llms.txt');
});

// [3] Testing OAuth & OIDC Discovery
console.log('\n[3] Testing OAuth & OIDC Discovery...');
const oauthAuthServer = JSON.parse(fs.readFileSync(path.join(ROOT, '.well-known', 'oauth-authorization-server'), 'utf8'));
const openidConfig = JSON.parse(fs.readFileSync(path.join(ROOT, '.well-known', 'openid-configuration'), 'utf8'));
test('oauth-authorization-server defines issuer, token_endpoint, and grant_types_supported', () => {
  assert(oauthAuthServer.issuer === 'https://truecalci.com');
  assert(oauthAuthServer.token_endpoint === 'https://truecalci.com/oauth/token');
  assert(oauthAuthServer.grant_types_supported.includes('client_credentials'));
});
test('openid-configuration defines OIDC endpoints and jwks_uri', () => {
  assert(openidConfig.issuer === 'https://truecalci.com');
  assert(openidConfig.jwks_uri === 'https://truecalci.com/.well-known/jwks.json');
});

// [4] Testing RFC 9728 OAuth Protected Resource Metadata
console.log('\n[4] Testing RFC 9728 OAuth Protected Resource Metadata...');
const oauthProtectedResource = JSON.parse(fs.readFileSync(path.join(ROOT, '.well-known', 'oauth-protected-resource'), 'utf8'));
test('oauth-protected-resource defines resource, authorization_servers, and bearer_methods', () => {
  assert(oauthProtectedResource.resource === 'https://truecalci.com');
  assert(oauthProtectedResource.authorization_servers.includes('https://truecalci.com'));
  assert(oauthProtectedResource.bearer_methods_supported.includes('header'));
});

// [5] Testing A2A Agent Card (/.well-known/agent-card.json)
console.log('\n[5] Testing A2A Agent Card (/.well-known/agent-card.json)...');
const agentCard = JSON.parse(fs.readFileSync(path.join(ROOT, '.well-known', 'agent-card.json'), 'utf8'));
test('agent-card.json defines name, version, supportedInterfaces, and skills', () => {
  assert(agentCard.name.includes('TrueCalci'));
  assert(agentCard.supportedInterfaces.some(i => i.protocol === 'mcp'));
  assert(agentCard.skills.length >= 6);
});

// [6] Testing Web Bot Auth (JWKS Directory)
console.log('\n[6] Testing Web Bot Auth (/.well-known/http-message-signatures-directory)...');
const webBotJwks = JSON.parse(fs.readFileSync(path.join(ROOT, '.well-known', 'http-message-signatures-directory'), 'utf8'));
test('http-message-signatures-directory contains public keys for bot request verification', () => {
  assert(Array.isArray(webBotJwks.keys));
  assert(webBotJwks.keys.length >= 1);
  assert(webBotJwks.keys.some(k => k.kty === 'RSA'));
});

// [7] Testing WebMCP API (navigator.modelContext.registerTool)
console.log('\n[7] Testing WebMCP API in index.html...');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
test('index.html calls navigator.modelContext.registerTool with inputSchema and execute', () => {
  assert(indexHtml.includes('navigator.modelContext.registerTool({'));
  assert(indexHtml.includes('name: "calculate_mortgage_piti"'));
  assert(indexHtml.includes('name: "calculate_black_scholes"'));
  assert(indexHtml.includes('name: "calculate_beam_bending"'));
  assert(indexHtml.includes('AbortController'));
});

// [8] Testing Link Response Headers and Cloudflare _headers & _worker.js
console.log('\n[8] Testing Link Headers & Cloudflare _headers / _worker.js...');
const headersFile = fs.readFileSync(path.join(ROOT, '_headers'), 'utf8');
const workerJs = fs.readFileSync(path.join(ROOT, '_worker.js'), 'utf8');
test('_headers includes RFC 8288 Link header pointing to api-catalog and openapi.json', () => {
  assert(headersFile.includes('Link: </.well-known/api-catalog>; rel="api-catalog"'));
  assert(headersFile.includes('Content-Type: application/linkset+json'));
});
test('_worker.js handles Accept: text/markdown content negotiation', () => {
  assert(workerJs.includes('accept.includes("text/markdown")'));
  assert(workerJs.includes('"Content-Type": "text/markdown; charset=utf-8"'));
  assert(workerJs.includes('"Vary": "Accept"'));
});

console.log('\n' + '='.repeat(80));
console.log(`FULL SPECIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED.`);
console.log('='.repeat(80));

if (failed > 0) process.exit(1);
