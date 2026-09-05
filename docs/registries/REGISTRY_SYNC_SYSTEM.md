# TrueCalci Registry Synchronization & Continuous Deployment System

TrueCalci operates as a multi-registry Model Context Protocol (MCP) server and statutory compute engine. To ensure zero-drift across frequent Cloudflare Worker deployments, TrueCalci maintains an automated, cross-registry synchronization and preflight validation pipeline.

---

## 1. Canonical Registry Architecture

| Registry | Listing / Discovery URL | Manifest / Card | Integration Transport | Badge / Asset |
| :--- | :--- | :--- | :--- | :--- |
| **Smithery.ai** | `https://smithery.ai/servers/truecalci-official/truecalci` | Auto-crawls `server.json` & `_worker.js` | Streamable HTTP (`/api/v1/mcp`) | `https://smithery.ai/badge/truecalci-official/truecalci` |
| **Glama.ai** | `https://glama.ai/mcp/servers/truecalci-official/truecalci` | `https://truecalci.com/glama.json` | Streamable HTTP (`/api/v1/mcp`) | `https://img.shields.io/badge/Glama-Indexed-8A2BE2.svg` |
| **LobeHub Plugins** | `https://github.com/lobehub/lobe-chat-plugins` | `https://truecalci.com/.well-known/lobe-plugin.json` | MCP / OpenAPI REST | `https://img.shields.io/badge/LobeHub-Plugin%20Ready-000000.svg` |
| **Official MCP Index** | `https://github.com/modelcontextprotocol/servers` | `https://truecalci.com/server.json` | Streamable HTTP & stdio | `https://img.shields.io/badge/MCP%20Registry-Indexed-f59e0b.svg` |

---

## 2. Cross-Linking & Documentation Topology

Every deployment guarantees byte-exact consistency across the following touchpoints:

### A. Consumer-Facing Web Interfaces
1. **`index.html` (Landing Page)**:
   - Footer "Resources & Registries" column links all 4 registries.
   - Legal/Compliance bottom strip embeds verified badges for Smithery, Glama, and LobeHub.
2. **`pricing.html` (Pricing Plans)**:
   - Free sandbox tier explicitly notes all 27 deterministic calculation engines.
   - Footer "Resources & Registries" column and bottom strip mirror the canonical registry links.
3. **`workstation.html` (Workstation Studio)**:
   - Header navigation "Resources" dropdown drawer features direct links to Official Docs, Engineering Formulas, Statutory Slabs, and MCP Registries (`/docs.html#mcp-protocol`).
4. **`docs.html` (Developer Documentation)**:
   - Section 3 highlights verified pills for Smithery, Glama, LobeHub, and Official MCP.
   - Interactive Live MCP/REST calculation playground tests all registered tools against edge endpoints.
   - Global footer embeds badges and index links.

### B. Machine & AI Agent Reference Specs
1. **`README.md`**: Top badge row features all 4 registry badges, plus 27 deterministic engines badge.
2. **`llms.txt`**: LLM-optimized summary includes canonical URLs for all 27 engines and dedicated "Public Registries & Discovery" section.
3. **`llms-full.txt`**: Unabridged mathematical specifications covering all formulas, LaTeX derivations, and public discovery endpoints.
4. **`openapi.json`**: OpenAPI 3.1 schema includes `externalDocs` pointing to registry documentation and all 27 engine routes.

---

## 3. Automated Preflight & Parity System

To eliminate human error during frequent production deployments, the repository provides automated audit and synchronization scripts:

```bash
# 1. Audit all 4 registries, badges, engine counts, and cross-links:
npm run audit:links

# 2. Synchronize root files with public_deploy/ and verify byte parity:
npm run sync

# 3. Comprehensive preflight check (Sync + Registry Audit + 201+ Engine Tests):
npm run preflight

# 4. Safe production deployment to Cloudflare Edge:
npm run deploy
```

### Script Internals:
- **`scripts/audit_registries_and_links.mjs`**:
  - Scans `server.json`, `glama.json`, and `.well-known/lobe-plugin.json` for schema conformance.
  - Verifies presence of Smithery, Glama, LobeHub, and Official MCP links across `index.html`, `pricing.html`, `workstation.html`, `docs.html`, `README.md`, `llms.txt`, and `llms-full.txt`.
  - Asserts that engine counts uniformly reflect 27 across all documentation.
  - Checks byte-level parity between root and `public_deploy/`.
  - Exits with non-zero code if any drift or broken link is found.
- **`scripts/sync_public_deploy.mjs`**:
  - Copies all updated production files into `public_deploy/`.
  - Performs byte-by-byte buffer comparison.
  - Automatically executes `audit_registries_and_links.mjs` upon completion.

---

## 4. Submitting & Refreshing Registry Listings

When new calculation engines or major versions are deployed:

1. **Smithery (`smithery.ai`)**:
   - Smithery re-scans the repository on git pushes to `main`.
   - Webhook trigger or manual refresh can be initiated at `https://smithery.ai/servers/truecalci-official/truecalci`.
2. **Glama (`glama.ai`)**:
   - Glama re-fetches `https://truecalci.com/glama.json` and ping-checks `https://truecalci.com/api/v1/mcp`.
   - Follow instructions in `docs/registries/GLAMA_SUBMISSION_GUIDE.md`.
3. **LobeHub (`lobehub/lobe-chat-plugins`)**:
   - Manifest is served at `https://truecalci.com/.well-known/lobe-plugin.json`.
   - Pull requests to the LobeHub plugins index use `docs/registries/lobehub-plugin-pr.json`.
4. **Official MCP Servers Registry**:
   - Reference `server.json` at root repository and standard stdio / Streamable HTTP definitions.
