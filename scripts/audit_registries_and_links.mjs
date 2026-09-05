/**
 * TrueCalci Automated Registry & Cross-Link Integrity Auditor
 * 
 * Verifies that all public MCP registries (Smithery, Glama, LobeHub, Official MCP Index),
 * badges, engine count references (27), and documentation links are synchronized
 * across all site pages and manifests with zero drift.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const deployDir = path.resolve(rootDir, 'public_deploy');

console.log('================================================================================');
console.log('TRUECALCI REGISTRY & CROSS-LINK INTEGRITY AUDIT');
console.log('================================================================================\n');

let errors = [];
let passCount = 0;

function check(title, condition, failureMsg) {
  if (condition) {
    console.log(`  ✔ [PASS] ${title}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${title}: ${failureMsg}`);
    errors.push(`${title}: ${failureMsg}`);
  }
}

// 1. Registry Manifests Validation
console.log('1. Checking Public Registry Manifests...');

// 1.1 server.json (Official MCP Server spec)
const serverJsonPath = path.join(rootDir, 'server.json');
check('server.json exists', fs.existsSync(serverJsonPath), 'Missing server.json in root');
if (fs.existsSync(serverJsonPath)) {
  try {
    const serverJson = JSON.parse(fs.readFileSync(serverJsonPath, 'utf8'));
    check('server.json has schema', serverJson.$schema === 'https://modelcontextprotocol.io/schema/server.json', 'Invalid $schema');
    check('server.json has streamableHttp endpoint', serverJson.endpoints?.streamableHttp === 'https://truecalci.com/api/v1/mcp', 'Missing or invalid streamableHttp endpoint');
    check('server.json references 27 engines', serverJson.description.includes('27 sub-millisecond'), 'Description should specify 27 engines');
  } catch (e) {
    check('server.json is valid JSON', false, e.message);
  }
}

// 1.2 glama.json (Glama Registry spec)
const glamaJsonPath = path.join(rootDir, 'glama.json');
check('glama.json exists', fs.existsSync(glamaJsonPath), 'Missing glama.json in root');
if (fs.existsSync(glamaJsonPath)) {
  try {
    const glamaJson = JSON.parse(fs.readFileSync(glamaJsonPath, 'utf8'));
    check('glama.json has schema', glamaJson.$schema === 'https://glama.ai/mcp/schemas/server.json', 'Invalid $schema');
    check('glama.json has transport endpoint', glamaJson.transport?.endpoint === 'https://truecalci.com/api/v1/mcp', 'Invalid transport endpoint');
    check('glama.json references 27 engines', glamaJson.description.includes('27 zero-hallucination'), 'Description should specify 27 engines');
  } catch (e) {
    check('glama.json is valid JSON', false, e.message);
  }
}

// 1.3 .well-known/lobe-plugin.json (LobeHub Chat Plugins spec)
const lobeJsonPath = path.join(rootDir, '.well-known', 'lobe-plugin.json');
check('lobe-plugin.json exists', fs.existsSync(lobeJsonPath), 'Missing lobe-plugin.json in .well-known/');
if (fs.existsSync(lobeJsonPath)) {
  try {
    const lobeJson = JSON.parse(fs.readFileSync(lobeJsonPath, 'utf8'));
    check('lobe-plugin.json has identifier', lobeJson.identifier === 'truecalci-deterministic-compute', 'Invalid identifier');
    check('lobe-plugin.json has openapi url', lobeJson.openapi === 'https://truecalci.com/openapi.json', 'Invalid openapi url in lobe plugin');
  } catch (e) {
    check('lobe-plugin.json is valid JSON', false, e.message);
  }
}

// 2. HTML Landing Pages & Workstation Audit
console.log('\n2. Checking HTML Pages for Registry Cross-Links & Badges...');

// 2.1 index.html
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
check('index.html contains Smithery link', indexHtml.includes('https://smithery.ai/servers/truecalci-official/truecalci'), 'Smithery link missing');
check('index.html contains Smithery badge', indexHtml.includes('https://smithery.ai/badge/truecalci-official/truecalci'), 'Smithery badge missing');
check('index.html contains Glama link', indexHtml.includes('https://glama.ai/mcp/servers/truecalci-official/truecalci'), 'Glama link missing');
check('index.html contains Glama badge', indexHtml.includes('Glama-Indexed'), 'Glama badge missing');
check('index.html contains LobeHub link', indexHtml.includes('https://github.com/lobehub/lobe-chat-plugins'), 'LobeHub link missing');
check('index.html contains Official MCP link', indexHtml.includes('https://github.com/modelcontextprotocol/servers'), 'Official MCP Index link missing');

// 2.2 pricing.html
const pricingHtml = fs.readFileSync(path.join(rootDir, 'pricing.html'), 'utf8');
check('pricing.html contains Smithery link', pricingHtml.includes('https://smithery.ai/servers/truecalci-official/truecalci'), 'Smithery link missing in pricing.html');
check('pricing.html contains Glama link', pricingHtml.includes('https://glama.ai/mcp/servers/truecalci-official/truecalci'), 'Glama link missing in pricing.html');
check('pricing.html contains LobeHub link', pricingHtml.includes('https://github.com/lobehub/lobe-chat-plugins'), 'LobeHub link missing in pricing.html');
check('pricing.html contains Official MCP link', pricingHtml.includes('https://github.com/modelcontextprotocol/servers'), 'Official MCP link missing in pricing.html');
check('pricing.html has updated engine count (27)', pricingHtml.includes('All 27 deterministic engines'), 'Engine count is not updated to 27 in pricing tier');
check('pricing.html has no stale 24 engine text', !pricingHtml.includes('All 24 deterministic engines'), 'Stale 24 engine count found in pricing.html');

// 2.3 workstation.html
const workstationHtml = fs.readFileSync(path.join(rootDir, 'workstation.html'), 'utf8');
check('workstation.html contains MCP Registries menu item', workstationHtml.includes('MCP Registries & Plugins') || workstationHtml.includes('docs.html#mcp-protocol'), 'MCP Registries link missing from workstation navigation');

// 2.4 docs.html
const docsHtml = fs.readFileSync(path.join(rootDir, 'docs.html'), 'utf8');
check('docs.html contains Smithery link & verified pill', docsHtml.includes('https://smithery.ai/servers/truecalci-official/truecalci') && docsHtml.includes('Smithery.ai Verified'), 'Smithery badge/link missing in docs.html');
check('docs.html contains Glama link & indexed pill', docsHtml.includes('https://glama.ai/mcp/servers/truecalci-official/truecalci') && docsHtml.includes('Glama.ai Indexed'), 'Glama badge/link missing in docs.html');
check('docs.html contains LobeHub link & pill', docsHtml.includes('https://github.com/lobehub/lobe-chat-plugins') && docsHtml.includes('LobeHub Plugin Ready'), 'LobeHub badge/link missing in docs.html');
check('docs.html contains Official MCP link', docsHtml.includes('https://github.com/modelcontextprotocol/servers'), 'Official MCP link missing in docs.html');

// 3. Documentation & Agent Files Audit
console.log('\n3. Checking Markdown & Agent Reference Files...');

// 3.1 README.md
const readmeMd = fs.readFileSync(path.join(rootDir, 'README.md'), 'utf8');
check('README.md contains Smithery badge & link', readmeMd.includes('https://smithery.ai/badge/truecalci-official/truecalci'), 'Smithery badge missing in README.md');
check('README.md contains Glama badge & link', readmeMd.includes('https://glama.ai/mcp/servers/truecalci-official/truecalci'), 'Glama badge missing in README.md');
check('README.md contains LobeHub badge & link', readmeMd.includes('https://github.com/lobehub/lobe-chat-plugins'), 'LobeHub badge missing in README.md');
check('README.md contains Official MCP badge', readmeMd.includes('https://github.com/modelcontextprotocol/servers'), 'Official MCP badge missing in README.md');
check('README.md specifies 27 Deterministic engines', readmeMd.includes('Engines-27%20Deterministic') && readmeMd.includes('twenty-seven deterministic mathematical engines'), 'Engine count text is not 27 in README.md');
check('README.md has no stale 24 calculation tools', !readmeMd.includes('all 24 calculation tools'), 'Stale 24 calculation tools text found in README.md');

// 3.2 llms.txt
const llmsTxt = fs.readFileSync(path.join(rootDir, 'llms.txt'), 'utf8');
check('llms.txt includes NPV & IRR engine', llmsTxt.includes('Net Present Value (NPV) & Internal Rate of Return (IRR)'), 'NPV/IRR missing from llms.txt');
check('llms.txt includes CAGR & Inflation engine', llmsTxt.includes('Compound Annual Growth Rate (CAGR) & Inflation Drag'), 'CAGR missing from llms.txt');
check('llms.txt includes Break-Even engine', llmsTxt.includes('Break-Even Sales Volume & Contribution Margin'), 'Break-Even missing from llms.txt');
check('llms.txt includes Public Registries section', llmsTxt.includes('## Public Registries & Discovery'), 'Registries section missing in llms.txt');
check('llms.txt links Smithery', llmsTxt.includes('https://smithery.ai/servers/truecalci-official/truecalci'), 'Smithery link missing in llms.txt');
check('llms.txt links Glama', llmsTxt.includes('https://glama.ai/mcp/servers/truecalci-official/truecalci'), 'Glama link missing in llms.txt');

// 3.3 llms-full.txt
const llmsFullTxt = fs.readFileSync(path.join(rootDir, 'llms-full.txt'), 'utf8');
check('llms-full.txt specifies 27 computational engines', llmsFullTxt.includes('27 computational engines'), 'Engine count is not 27 in llms-full.txt');
check('llms-full.txt includes Engine 12 (NPV/IRR)', llmsFullTxt.includes('Engine 12: Capital Budgeting'), 'Engine 12 missing in llms-full.txt');
check('llms-full.txt includes Engine 13 (CAGR)', llmsFullTxt.includes('Engine 13: Growth Dynamics'), 'Engine 13 missing in llms-full.txt');
check('llms-full.txt includes Engine 14 (Break-Even)', llmsFullTxt.includes('Engine 14: Cost-Volume-Profit'), 'Engine 14 missing in llms-full.txt');
check('llms-full.txt includes Public Registries', llmsFullTxt.includes('## Public Registries & Discovery'), 'Registries section missing in llms-full.txt');

// 4. OpenAPI Specification Audit
console.log('\n4. Checking openapi.json...');
const openApiJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'openapi.json'), 'utf8'));
check('openapi.json includes externalDocs pointing to registries', openApiJson.externalDocs?.url.includes('docs.html#mcp-protocol'), 'externalDocs missing or invalid in openapi.json');
check('openapi.json includes npv-irr path', openApiJson.paths['/api/v1/npv-irr'] !== undefined, '/api/v1/npv-irr path missing in openapi.json');
check('openapi.json includes cagr-inflation path', openApiJson.paths['/api/v1/cagr-inflation'] !== undefined, '/api/v1/cagr-inflation path missing in openapi.json');
check('openapi.json includes breakeven-margin path', openApiJson.paths['/api/v1/breakeven-margin'] !== undefined, '/api/v1/breakeven-margin path missing in openapi.json');

// 5. Dual-Directory Parity Check
console.log('\n5. Checking Dual-Directory Parity with public_deploy/...');
const criticalFiles = [
  'index.html',
  'pricing.html',
  'workstation.html',
  'docs.html',
  'llms.txt',
  'llms-full.txt',
  'server.json',
  'glama.json',
  'openapi.json',
  'README.md'
];

criticalFiles.forEach(file => {
  const rootFilePath = path.join(rootDir, file);
  const deployFilePath = path.join(deployDir, file);
  if (!fs.existsSync(deployFilePath)) {
    // Note: README.md might not need to be in public_deploy, but other static files must be
    if (file !== 'README.md') {
      check(`public_deploy/${file} exists`, false, 'File missing in public_deploy/');
    }
  } else {
    const rootBuf = fs.readFileSync(rootFilePath);
    const deployBuf = fs.readFileSync(deployFilePath);
    check(`public_deploy/${file} byte parity`, rootBuf.equals(deployBuf), 'Content drift detected between root and public_deploy/');
  }
});

// Summary
console.log('\n================================================================================');
if (errors.length === 0) {
  console.log(`🎉 ALL AUDITS PASSED: ${passCount} checks successful with 0 errors!`);
  console.log('All registries, badges, and documentation cross-links are 100% verified.');
  console.log('================================================================================\n');
  process.exit(0);
} else {
  console.error(`❌ AUDIT FAILED: ${errors.length} error(s) detected:`);
  errors.forEach(e => console.error(`   - ${e}`));
  console.log('================================================================================\n');
  process.exit(1);
}
