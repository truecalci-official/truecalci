# TrueCalci System Rule: Canvas Integrity & Automated Statutory Monitoring

This rule governs all interactive calculation stages, statutory parameters, and automated maintenance workflows within TrueCalci.

---

## 1. Zero Blank Canvas & Dirty LocalStorage Invariant
- **Storage Sanitization**: Never perform direct dictionary lookups (`CUR[cur]`, `THEMES[theme]`) against values retrieved from `localStorage`, query parameters, or URL hashes without a guaranteed fallback default (e.g. `CUR[cur] || CUR.USD`).
- **Normalizer Functions**: Always route raw storage values through explicit sanitizers (e.g. `normalizeCurrency(val)`) that map legacy, case-sensitive, or unrecognized values safely.
- **Defensive Lifecycle Execution**: Top-level hooks (`applyCurrency()`, `updateDrawerContent()`, `handleHash()`, `renderGenericEngine()`, `recalcCurrent()`) must be wrapped in defensive try/catch blocks so an error in one component never halts primary stage rendering.
- **Non-Empty Canvas Gate**: Verification must assert that the stage container is visible (`hidden === false`), contains interactive inputs with populated defaults, and displays formatted numerical outputs with zero console errors.

---

## 2. Official Statutory Reference & Compliance Invariant
- **Authoritative Direct Links**: Every computational tool must provide verifiable, clickable links directly to official government / regulatory / standards bodies (CBDT, IRS, OECD, CFPB, SEBI, CBIC, RBI, BIS, ISO, IEEE).
- **Stage Visibility**: Primary authority links must be prominently rendered on the stage itself (`#ws-statutory-section` / `.statute-chip`), as well as inside the mathematical derivation drawer, enabling instant verification by enterprises and auditors.
- **Zero Hallucinated Standards**: Every statutory rate, slab, exemption, or threshold (e.g., Section 115BAC slabs, IRC §1402 SECA multipliers, FEIE 330-day rule) must cite its exact legal or regulatory publication.

---

## 3. Automated Cron Worker & Link Freshness Monitoring
- **Periodic Health Verification**: The system must maintain an automated health worker (`scripts/cron_statutory_monitor.mjs`) that:
  1. Audits all official government and standards URLs for reachability and HTTP status codes.
  2. Detects broken links (404/500) and regulatory portal URL migrations (301/302 redirects).
  3. Validates statutory constants against annual legislative changes (e.g. Finance Bills, IRS Notices).
  4. Emits structured compliance analytics to `data/statutory_health.json`.
- **Pre-Commit / Pre-Deploy Command**:
  ```bash
  node tests/verify_workstation_engines.mjs && node scripts/cron_statutory_monitor.mjs
  ```
