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
| **Engines** | 19 Statutory, Financial & Technical Computational Engines |
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

### Milestone 6: Claude Enterprise Redesign & MCP Registry Preparation (Current)
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

---

## 3. Verification & Compliance Checklist

| Item | Requirement | Status |
| :--- | :--- | :---: |
| **Mathematical Determinism** | Exact floating-point parity across all 19 engines (174 assertions) | ✅ Verified |
| **FOUC Prevention** | Synchronous theme/view execution at 0ms in `<head>` | ✅ Verified |
| **Deployment Freeze** | Zero automated pushes to Cloudflare | ✅ Active |
| **Sensitive Data Quarantine** | `.env`, `.env.txt`, private keys, and strategy notes isolated from public repo | ✅ Completed |
| **Public `README.md`** | High-authority documentation for GitHub & MCP registries | ✅ Completed |
| **Workstation Integration** | Merging Claude's workstation layout with the 19 live engines | ⏳ In Planning |

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
