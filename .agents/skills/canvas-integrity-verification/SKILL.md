---
name: canvas-integrity-verification
description: Protocol for preventing blank canvas renders, uncaught script crashes, dirty localStorage regressions, and ensuring 100% interactive integrity across all computational engines.
---

# Canvas Integrity Verification Protocol

A mandatory verification protocol to guarantee that zero computational engines render empty white canvases, throw silent runtime crashes, or fail under diverse user browser states.

## The Principle of Non-Empty Verification

Never mark an interactive feature or workstation engine as "verified" solely based on:
1. Absence of syntax errors in Node.
2. A single browser snapshot taken before the deep-link route has initialized.
3. A clean browser environment with default `localStorage`.

Real users run web applications with legacy, dirty, or foreign `localStorage` values (`calc_region: 'global'`, `'india'`, etc.) accumulated from previous sessions. If any client-side lookup fails to sanitize these inputs, top-level scripts can throw uncaught `TypeErrors` that halt execution before DOM elements or hash routers mount, rendering a completely empty canvas.

---

## 4-Step Verification Discipline

### Step 1: Storage State Permutation Matrix
Before testing visual output, test the initialization script against the storage permutation matrix:
- `localStorage.getItem('calc_region') = 'global'`
- `localStorage.getItem('calc_region') = 'india'`
- `localStorage.getItem('calc_region') = 'USD'`
- `localStorage.getItem('calc_region') = 'INR'`
- `localStorage.getItem('calc_region') = null` (First-time visitor)
- `localStorage.getItem('calc_region') = 'garbage_value'` (Corrupted storage)

**Rule**: Every dictionary lookup (`CUR[cur]`, `THEMES[theme]`, etc.) must have a fallback default (e.g. `CUR[cur] || CUR.USD`) and a dedicated sanitizer (`normalizeCurrency`). It must NEVER be possible for an unexpected key to evaluate to `undefined` and throw an unhandled property access error.

### Step 2: Full-Spectrum 24-Engine Non-Empty DOM Assertion
For every engine in the workstation rail (all 24):
1. **Active Container Visible**: The target stage element (`#stage-b2b`, `#stage-generic`, etc.) must NOT have the `hidden` attribute or `display: none`.
2. **Inputs Populated**: The stage must contain at least 1 `<input>` or `<select>` element with a non-empty `value`.
3. **Primary Result Rendered**: The primary calculation container (`.result__value` or `#out-...` or `#gen-result-val`) must NOT be empty, must not equal `—`, and must contain formatted numbers or currency symbols.
4. **Metric Cards Populated**: The stage must contain non-empty metric summary cards.

### Step 3: Deep-Link Hash Routing Direct Load
Do not only test clicking sidebar buttons. You must test direct navigation to URL hashes:
- `http://localhost:3000/workstation.html#b2b-22`
- `http://localhost:3000/workstation.html#feie-23`
- `http://localhost:3000/workstation.html#itx-05`
- `http://localhost:3000/workstation.html#sci-15`

Verify that:
1. The sidebar accordion automatically expands to reveal the active tool.
2. The active tool has `aria-current="true"`.
3. The page does not jump or scroll out of view.
4. The canvas immediately renders the correct tool's controls on the initial paint.

### Step 4: Zero Uncaught Exceptions Gate
Inspect `console.error` and `window.onerror`.
Any uncaught `TypeError`, `ReferenceError`, or `DOMException` is an instant **FAIL**.
Even if the UI appears visually loaded, any uncaught error breaks event listeners and will cause subsequent user interactions to silently freeze.

---

## Automated Test Harness
Always execute the automated verification test before declaring completion:
```bash
node tests/verify_workstation_engines.mjs
```
This runs 96 deterministic checks validating currency sanitization across all storage permutations, rail tool existence, stage container presence, and generic engine configuration completeness.
