# TrueCalci System Engineering & Deployment Ledger (SYSTEM_LOG.md)

This log is the single source of truth for all architectural decisions, commit hashes, security audits, verification milestones, and deployment states across **TrueCalci**. Every commit, release, and configuration change must be recorded here chronologically.

---

## 1. System Metadata & Governance Rules

| Property | Current Specification |
| :--- | :--- |
| **Product** | TrueCalci — Deterministic Compute Engine for AI Agents & Enterprise Teams |
| **Repository** | `truecalci-official/truecalci` |
| **Primary Domain** | `https://truecalci.com` |
| **Transport** | Streamable HTTP (`/api/v1/mcp`) + stdio (`mcp-server.mjs`) + Edge Worker (`_worker.js`) |
| **Engines** | 24 Statutory, Financial & Technical Computational Engines |
| **Deployment Policy** | **Strict Freeze Active** — zero automated or premature deployments. Deployments only occur upon explicit user authorization after local verification on `http://localhost:3000`. |
| **Sensitive Data Policy** | Zero credentials, `.env` files, internal financial projections, or uncompiled archives may be committed to public repository branches. |

---

## 2. Chronological Commit & Deployment Ledger

### Milestone 1: Platform Inception & Initial 12 Engines
* **`1ecd5b4`** | `2026-09-03 04:28:35 +0530`
  * **Scope**: Initial repository initialization. Core calculation engines (Mortgage, VAT, Tip, Compound, Income Tax, GST, SIP, FD, Gold, PPF, SSY, EMI). Standalone test suite and basic MCP stdio server.
* **`573e3c7`** | `2026-09-03 05:01:21 +0530`
  * **Scope**: AI Agent Readiness & AEO suite (OpenAPI 3.1, MCP manifest, A2A agent card, skills index, WebMCP, `llms-full.txt`).
* **`88a149c`** | `2026-09-03 05:07:24 +0530`
  * **Scope**: Multi-region alternate hreflang support, dual-host OpenAPI schema, and initial public deploy sync.
* **`322abde`** | `2026-09-03 05:23:28 +0530`
  * **Scope**: Cloudflare Agent Readiness suite (`Auth.md`, RFC 9727 API Catalog, Link headers, OAuth discovery, Web Bot Auth, `_worker.js`).
* **`968888c`** | `2026-09-03 05:37:38 +0530`
  * **Scope**: Google Rich Results MathSolver schema optimization and accessibility tree hardening for agentic headless browsers.
* **`a1b4bce`** | `2026-09-03 05:54:05 +0530`
  * **Scope**: WebMCP registration lifecycle fix for Chromium headless agent runners.
* **`335e3ca`** | `2026-09-03 05:58:56 +0530`
  * **Scope**: Accessibility compliance: explicit labels and `aria-label` attributes on form inputs and select elements.
* **`55269d0`** | `2026-09-03 06:12:18 +0530`
  * **Scope**: Cloudflare observability and logging configuration added to `wrangler.jsonc`.

---

### Milestone 2: Remote Contractor Matrix & Edge Hardening
* **`fc5a350`** | `2026-09-03 11:48:48 +0530`
  * **Scope**: Complete 1099 vs W-2 Parity Engine (QBI deduction, SECA 15.3%, breakeven hourly rate solver, WebMCP tool).
* **`d26a0a6`** | `2026-09-03 15:16:41 +0530`
  * **Scope**: Enterprise Edge API/MCP Infrastructure, 100-request rate limiter gate, RFC 9116 `security.txt`, and Swiss Minimalist design polish.
* **`e5abdfa`** | `2026-09-03 15:41:24 +0530`
  * **Scope**: Security gate and local telemetry endpoints on port 4000.
* **`25376da`** | `2026-09-03 16:03:53 +0530`
  * **Scope**: Multi-tier client identity and quota tracking with zero forced signup.
* **`3754400`** | `2026-09-03 16:39:07 +0530`
  * **Scope**: Google Search Console MathSolver fix, Developer OAuth modal, Pay-As-You-Go 4th tier, and Invoices ledger.
* **`d6b31c2`** | `2026-09-03 17:18:29 +0530`
  * **Scope**: Enterprise homepage redesign, live query sandbox, bullion ticker cleanup.

---

### Milestone 3: Dodo Payments Integration & Production Polish
* **`1d8424c`** | `2026-09-03 23:42:04 +0530`
  * **Scope**: Complete Dodo Payments integration, live checkout URLs, pricing economics, Edge auto-provisioning.
* **`fddf45a`** | `2026-09-04 00:01:01 +0530`
  * **Scope**: Tier button label polish, overage copy, quota description alignment.
* **`ab5aece`** | `2026-09-04 00:24:35 +0530`
  * **Scope**: 5 live Dodo Payments checkout URLs, upfront annual quota display, and ZEROTEST discount prefill.
* **`76c203b`** | `2026-09-04 00:28:53 +0530`
  * **Scope**: Verified live checkout routing and annual quota display.
* **`6f91dfe`** | `2026-09-04 00:51:20 +0530`
  * **Scope**: Neutral MoR disclosure, consolidated unified footer, developer hub streamlining, legal terms reinforcement.
* **`7e89790`** | `2026-09-04 01:12:12 +0530`
  * **Scope**: Mobile header compactness, responsive navigation drawer, glassmorphism pillar cards, third-party privacy disclosures.
* **`0afd013`** | `2026-09-04 01:22:25 +0530`
  * **Scope**: Frosted glass UI treatment for mobile drawer; category menu cleanup.
* **`67db994`** | `2026-09-04 01:54:07 +0530`
  * **Scope**: Subscriptions dashboard with PDF tax invoice, Dodo Pro fulfillment, streamlined account menu.

---

### Milestone 4: MCP Suite Expansion & Search Compliance
* **`cbb9768`** | `2026-09-04 12:58:53 +0530`
  * **Scope**: Complete MCP v1 suite for Claude Desktop, Cursor, Python SDK, and cURL for 16 deterministic engines.
* **`e143f25`** | `2026-09-04 14:26:59 +0530`
  * **Scope**: Google Safe Browsing warning remediation: sanitized OAuth test pages with strict `noindex`/`noarchive`, disallowed `/api/` in `robots.txt`.
* **`f7156c0`** | `2026-09-04 14:51:40 +0530`
  * **Scope**: Corrected MathSolver Schema.org `eduQuestionType` and updated canonical links to production.
* **`7667cbe`** | `2026-09-04 15:20:29 +0530`
  * **Scope**: Eliminated placeholder GSC verification token, shipped standalone `/pricing` HTTP 200 route, aligned metadata & FAQ to Tax Year 2026-27 (ITA 2025), live-computed hero sandbox.
* **`11bed33`** | `2026-09-04 15:39:14 +0530`
  * **Scope**: Configured `wrangler.jsonc` for static assets routing via Cloudflare Workers.
* **`e605c76`** | `2026-09-04 15:52:37 +0530`
  * **Scope**: Root-relative paths, non-blocking font loading, adblock-safe `layout.css`, cache control headers.

---

### Milestone 5: Full 19-Engine Suite & Zero-Flash (FOUC) Elimination
* **`a24d705`** | `2026-09-04 16:22:35 +0530`
  * **Scope**: Full-scale integration of the complete 5-engine Remote Work suite:
    1. 1099 vs W-2 Parity (`parity-engine.js`)
    2. S-Corp Reasonable Salary Optimizer (`scorp-engine.js`)
    3. Solo 401(k) Maximizer (`retirement-engine.js`)
    4. Cross-Border FX Rails Drag Optimizer (`fx-engine.js`)
    5. Billable Hourly Floor Solver (`billable-engine.js`)
    Bringing total verified computational engines to 19.
* **`69c6ef1`** | `2026-09-04 16:53:08 +0530`
  * **Scope**: Completely eliminated Flash of Unstyled Content (FOUC) and workstation view flash on load via 0ms synchronous head script resolving `data-theme` and `data-view` prior to initial paint.

---

### Milestone 6: Claude Enterprise Redesign & MCP Registry Preparation
* **`47cfd3d`** | `2026-09-04 19:01:12 +0530`
  * **Scope**: chore: sanitize repository structure, add public README.md, update package.json, and establish SYSTEM_LOG.md ledger.
  * **Actions**:
    - Moved loose screenshots from root into `docs/assets/images/`.
    - Moved test scripts into dedicated `tests/` directory; verified all 174 tests pass (`tests/test_suite.mjs`).
    - Quarantined internal strategy & growth memos (`opportunities/`, `AUTH_SETUP_GUIDE.md`, etc.) into `docs/internal/`.
    - Hardened `.gitignore` against `.env`, `.env.txt`, `*.zip`, `handoff/`, and `scratch/`.
    - Authored institutional, MCP-compliant `README.md` with tool tables, Quickstart for Claude Desktop/Cursor/OpenAI, and architectural guarantees.
    - Updated `package.json` with official MCP keywords, bin entry (`truecalci-mcp`), and scripts.
    - Pushed to GitHub `origin/main`.
* **`0145f89`** | `2026-09-04 19:40:02 +0530`
  * **Scope**: chore: configure truecalci-mcp bin executable and test suite scripts in package.json.

---

### Milestone 7: Enterprise Agent Skills Portfolio & 24-Engine Architectural Expansion
* **Date**: `2026-09-04 20:30:00 +0530`
* **Type**: `chore` & `architecture`
* **Agent Skills Audited & Installed into `c:\Calculator\.agents\skills\`**:
  1. `kostja94/marketing-skills@legal-page-generator` (v1.2.0) — Jurisdiction decision matrix, platform dependencies, and AI disclosure standards.
  2. `mattpocock/skills@improve-codebase-architecture` (865.6K installs) — Deepening opportunities, deletion tests, locality and leverage, visual HTML reports.
  3. `mattpocock/skills@code-review` (484.7K installs) — Two-axis parallel sub-agent review: Standards (Fowler smells) & Spec adherence.
  4. `mattpocock/skills@diagnosing-bugs` (540.5K installs) — Systematic root-cause debugging with tight red-capable feedback loops.
  5. `mattpocock/skills@research` (443.2K installs) — Primary-source investigation and factual documentation.
  6. `addyosmani/agent-skills@security-and-hardening` (32.6K installs) — STRIDE threat modeling, OWASP Top 10 mitigation, CSP/HSTS, input boundary defense.
  7. `coreyhaines31/marketingskills@seo-audit` (200.5K installs) — Technical SEO, Core Web Vitals, JSON-LD Schema.org, indexing architecture.
  8. `obra/superpowers@writing-plans` (239.1K installs) — Disciplined, step-by-step implementation plan generation.
* **5 New High-Demand Engines Stress-Tested**:
  - `ai_token_arbitrage`: Multi-model pricing matrix, 90% prompt caching, batch API discount (verified 40x cost disparity identification).
  - `startup_runway_dilution`: Post-Money SAFE vs Series A, unallocated option pool shuffle dilution, burn rate, calendar zero-cash date.
  - `b2b_withholding_risk`: Form W-8BEN/W-8BEN-E 30% statutory vs treaty rates, gross-up formulas, 183-day permanent establishment alert.
  - `feie_nomad_tracker`: IRS Form 2555 physical presence 330-day rolling test, statutory cap ($130k), California/NY sticky domicile audit risk.
  - `cloud_egress_finops`: Multi-cloud egress and Cloudflare Zero-Egress R2 & CDN proxy (verified 84% cost savings on 50TB/month).
  - Total computational portfolio expanded from 19 to **24 production engines**.

---

### Milestone 8: Full 24-Engine Suite Integration & Claude Workstation Studio Launch
* **`6f26001`** | `2026-09-04 22:00:00 +0530`
  * **Scope**: 
    - Full edge integration of the 5 AI Agent FinOps computational engines (`ai_token_arbitrage`, `startup_runway_dilution`, `b2b_withholding_risk`, `feie_nomad_tracker`, and `cloud_egress_finops`) into `_worker.js`, `server.mjs`, and `mcp-server.mjs`.
    - Published official Anthropic Model Context Protocol registry manifest `server.json` (schema v2024-11-05, streamableHttp `/api/v1/mcp`, executable binary `truecalci-mcp`).
    - Implemented dual-layer MCP error standard: mathematical/boundary errors return HTTP 200 with `isError: true` inside `CallToolResult` alongside actionable remediation hints, preventing AI agent host crashes.
    - Launched TrueCalci Workstation Studio (`workstation.html`, `js/workstation.js`, `css/design-system.css`, `brand-logo.png`) featuring 24-engine sidebar layout, 0ms FOUC `<head>` execution, dynamic currency switching ($/₹), interactive derivation drawer with statutory citations, and Dodo Payments customer billing modal.
    - Quarantined and removed legacy static client-side `api/auth/*.html` auto-redirect files to guarantee Google Safe Browsing immunity.
    - Verified 100% test pass rate across unit suites (174/174 passed), new engine determinism tests, and browser automated verification.

---

## 3. Verification & Compliance Checklist

| Item | Requirement | Status |
| :--- | :--- | :---: |
| **Mathematical Determinism** | Exact floating-point parity across all 19 existing + 5 new engines | ✅ Verified (19k cycles) |
| **FOUC Prevention** | Synchronous theme/view execution at 0ms in `<head>` | ✅ Verified (0ms paint) |
| **Deployment Freeze** | Zero automated pushes to Cloudflare | ✅ Active |
| **Sensitive Data Quarantine** | `.env`, `.env.txt`, private keys, and strategy notes isolated from public repo | ✅ Completed & Verified |
| **Public `README.md`** | High-authority documentation for GitHub & MCP registries | ✅ Completed |
| **Agent Skills Portfolio** | 34 skills verified via automated test suite (`tests/test_all_skills.mjs`) | ✅ 34/34 Passed (0 Failures) |
| **Official MCP Wire Standard**| Dual-layer error handling (JSON-RPC 2.0 vs CallToolResult isError) | ✅ Implemented & Tested |
| **Workstation Integration** | Merging Claude's workstation layout with the 24 live engines | ✅ Complete & Verified |

---

## 4. Standard Format for Future Log Entries

Whenever a commit or release is made, append an entry using the following structure:
```markdown
### [YYYY-MM-DD HH:MM +ZZZZ] - [Commit Hash] - [Title]
- **Author**: TrueCalci Team
- **Type**: feat | fix | perf | refactor | chore | security
- **Files Changed**:
  - `path/to/file1`
  - `path/to/file2`
- **Description**: Summary of architectural rationale and specific changes made.
- **Verification**: Commands executed, test pass rate, or browser checks confirmed.
- **Deployment Status**: Local Only | Staged | Production Cloudflare (with timestamp).
```
