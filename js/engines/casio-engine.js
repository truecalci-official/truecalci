/**
 * Casio fx-991MS / fx-82MS Hardware Simulator Engine
 * Recreates the exact S-V.P.A.M. state machine, 2-line display, modifier flags,
 * EQN polynomial/linear solver, numerical integration (Simpson's), differentiation, and Newton-Raphson SOLVE.
 */

export class CasioCalciEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.expression = "";
    this.result = "0";
    this.cursorPos = 0;
    this.mode = "COMP"; // COMP, CMPLX, STAT, BASE, EQN, MAT, VCT
    this.angleUnit = "DEG"; // DEG, RAD, GRA
    this.isShift = false;
    this.isAlpha = false;
    this.isHyp = false;
    this.memoryM = 0;
    this.lastAns = 0;
    this.history = [];
    this.historyIndex = -1;
    this.registers = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, X: 0, Y: 0, M: 0 };
    
    // EQN Mode sub-state
    this.eqnState = {
      type: null, // "2-unknown", "3-unknown", "quadratic", "cubic"
      coeffs: {},
      step: 0,
      solutions: []
    };

    // STAT Mode sub-state
    this.statData = [];
  }

  // Toggle Shift modifier
  toggleShift() {
    this.isShift = !this.isShift;
    if (this.isShift) this.isAlpha = false;
  }

  // Toggle Alpha modifier
  toggleAlpha() {
    this.isAlpha = !this.isAlpha;
    if (this.isAlpha) this.isShift = false;
  }

  // Toggle Angle Mode (Deg / Rad / Gra)
  setAngleUnit(unit) {
    if (["DEG", "RAD", "GRA"].includes(unit)) {
      this.angleUnit = unit;
    }
  }

  // Set calculator mode
  setMode(mode) {
    this.mode = mode;
    this.isShift = false;
    this.isAlpha = false;
    if (mode === "EQN") {
      this.initEQN("quadratic");
    }
  }

  // Insert token at current cursor position
  insert(token) {
    const left = this.expression.slice(0, this.cursorPos);
    const right = this.expression.slice(this.cursorPos);
    this.expression = left + token + right;
    this.cursorPos += token.length;
    this.isShift = false;
    this.isAlpha = false;
    this.isHyp = false;
  }

  // Delete character before cursor (DEL)
  delete() {
    if (this.cursorPos > 0) {
      const left = this.expression.slice(0, this.cursorPos - 1);
      const right = this.expression.slice(this.cursorPos);
      this.expression = left + right;
      this.cursorPos--;
    }
  }

  // All Clear (AC)
  allClear() {
    this.expression = "";
    this.cursorPos = 0;
    this.result = "0";
    this.isShift = false;
    this.isAlpha = false;
  }

  // Move cursor Left/Right
  moveCursor(dir) {
    if (dir === "left") {
      this.cursorPos = Math.max(0, this.cursorPos - 1);
    } else if (dir === "right") {
      this.cursorPos = Math.min(this.expression.length, this.cursorPos + 1);
    }
  }

  // History recall Up/Down
  navigateHistory(dir) {
    if (this.history.length === 0) return;
    if (dir === "up") {
      if (this.historyIndex === -1) this.historyIndex = this.history.length - 1;
      else if (this.historyIndex > 0) this.historyIndex--;
    } else if (dir === "down") {
      if (this.historyIndex < this.history.length - 1) this.historyIndex++;
      else {
        this.historyIndex = -1;
        this.expression = "";
        this.cursorPos = 0;
        return;
      }
    }
    if (this.historyIndex >= 0 && this.historyIndex < this.history.length) {
      this.expression = this.history[this.historyIndex].expr;
      this.result = this.history[this.historyIndex].res;
      this.cursorPos = this.expression.length;
    }
  }

  // Memory M+ action
  memoryAdd() {
    try {
      const val = this.expression.trim() ? this.evaluateExpression(this.expression) : parseFloat(this.result);
      if (!isNaN(val)) {
        this.registers.M += val;
        this.memoryM = this.registers.M;
        this.result = String(val);
      }
    } catch (e) {
      this.result = "Math ERROR";
    }
  }

  // Memory M- action
  memorySub() {
    try {
      const val = this.expression.trim() ? this.evaluateExpression(this.expression) : parseFloat(this.result);
      if (!isNaN(val)) {
        this.registers.M -= val;
        this.memoryM = this.registers.M;
        this.result = String(val);
      }
    } catch (e) {
      this.result = "Math ERROR";
    }
  }

  // Evaluate current expression
  evaluate() {
    if (!this.expression.trim()) return;

    try {
      let rawExpr = this.expression;

      // Handle EQN solver mode
      if (this.mode === "EQN") {
        this.stepEQN();
        return;
      }

      // Check for Simpson's Definite Integration: ∫(expr, a, b)
      const intMatch = rawExpr.match(/^∫\((.+),([+-]?\d*\.?\d+),([+-]?\d*\.?\d+)\)$/);
      if (intMatch) {
        const fnStr = intMatch[1];
        const a = parseFloat(intMatch[2]);
        const b = parseFloat(intMatch[3]);
        const res = this.numericalIntegrate(fnStr, a, b);
        this.finalizeResult(rawExpr, res);
        return;
      }

      // Check for Numerical Differentiation: d/dx(expr, a)
      const diffMatch = rawExpr.match(/^d\/dx\((.+),([+-]?\d*\.?\d+)\)$/);
      if (diffMatch) {
        const fnStr = diffMatch[1];
        const a = parseFloat(diffMatch[2]);
        const res = this.numericalDerivative(fnStr, a);
        this.finalizeResult(rawExpr, res);
        return;
      }

      // Standard evaluation
      const val = this.evaluateExpression(rawExpr);
      this.finalizeResult(rawExpr, val);
    } catch (err) {
      this.result = "Math ERROR";
    }
  }

  finalizeResult(expr, val) {
    if (isNaN(val) || !isFinite(val)) {
      this.result = "Math ERROR";
    } else {
      // Format 10-digit Casio mantissa
      let formatted = parseFloat(val.toPrecision(10)).toString();
      if (Math.abs(val) > 1e10 || (Math.abs(val) < 1e-3 && val !== 0)) {
        formatted = val.toExponential(6).replace("e", "×10^");
      }
      this.result = formatted;
      this.lastAns = val;
      this.history.push({ expr, res: formatted });
      this.historyIndex = -1;
    }
  }

  // Parse & Evaluate mathematical string
  evaluateExpression(expr, varX = null) {
    let s = expr;

    // Substitute Ans
    s = s.replace(/\bAns\b/g, `(${this.lastAns})`);

    // Substitute variable X or x if provided (for calculus / SOLVE)
    if (varX !== null) {
      s = s.replace(/\b[xX]\b/g, `(${varX})`);
    }

    // Replace constants
    s = s.replace(/π/g, `${Math.PI}`);
    s = s.replace(/\be\b/g, `${Math.E}`);

    // Replace display operators with JS equivalents
    s = s.replace(/×/g, "*").replace(/÷/g, "/");

    // Fractions: a⌟b or a⌟b⌟c
    s = s.replace(/(\d+)\s*⌟\s*(\d+)\s*⌟\s*(\d+)/g, "($1 + $2/$3)");
    s = s.replace(/(\d+)\s*⌟\s*(\d+)/g, "($1/$2)");

    // Powers & Roots: x², x³, x^y, √, ³√
    s = s.replace(/²\b/g, "^2");
    s = s.replace(/³\b/g, "^3");
    s = s.replace(/√\(([^)]+)\)/g, "sqrt($1)");
    s = s.replace(/√(\d+\.?\d*)/g, "sqrt($1)");
    s = s.replace(/³√\(([^)]+)\)/g, "cbrt($1)");

    // Permutation & Combination: nPr and nCr
    s = s.replace(/(\d+)\s*P\s*(\d+)/g, "perm($1,$2)");
    s = s.replace(/(\d+)\s*C\s*(\d+)/g, "comb($1,$2)");

    // Factorial: n!
    s = s.replace(/(\d+)!/g, "fact($1)");

    // Implicit multiplication: e.g. 2(3), 2π, 2sin(30)
    s = s.replace(/(\d)(\()/g, "$1*$2");
    s = s.replace(/(\))(\d)/g, "$1*$2");
    s = s.replace(/(\))(\()/g, "$1*$2");
    s = s.replace(/(\d)(sin|cos|tan|log|ln|sqrt)/g, "$1*$2");

    // Convert angle functions based on Deg/Rad/Gra
    const toRad = (val) => {
      if (this.angleUnit === "DEG") return (val * Math.PI) / 180;
      if (this.angleUnit === "GRA") return (val * Math.PI) / 200;
      return val;
    };
    const fromRad = (val) => {
      if (this.angleUnit === "DEG") return (val * 180) / Math.PI;
      if (this.angleUnit === "GRA") return (val * 200) / Math.PI;
      return val;
    };

    // Math function dictionary
    const env = {
      sin: (x) => Math.sin(toRad(x)),
      cos: (x) => Math.cos(toRad(x)),
      tan: (x) => {
        const r = toRad(x);
        if (Math.abs(Math.cos(r)) < 1e-12) throw new Error("Singularity");
        return Math.tan(r);
      },
      asin: (x) => fromRad(Math.asin(x)),
      acos: (x) => fromRad(Math.acos(x)),
      atan: (x) => fromRad(Math.atan(x)),
      log: (x) => Math.log10(x),
      ln: (x) => Math.log(x),
      sqrt: (x) => Math.sqrt(x),
      cbrt: (x) => Math.cbrt(x),
      abs: (x) => Math.abs(x),
      fact: (n) => {
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        return f;
      },
      perm: (n, r) => {
        if (r > n) return 0;
        let p = 1;
        for (let i = 0; i < r; i++) p *= (n - i);
        return p;
      },
      comb: (n, r) => {
        if (r > n) return 0;
        let c = 1;
        for (let i = 1; i <= r; i++) {
          c = (c * (n - i + 1)) / i;
        }
        return c;
      }
    };

    // Replace exponentiation ^ with Math.pow
    s = this.parsePowers(s);

    // Evaluate safely with defined Math environment
    const funcArgs = Object.keys(env).join(",");
    const funcVals = Object.values(env);
    const fn = new Function(funcArgs, `"use strict"; return (${s});`);
    return fn(...funcVals);
  }

  // Handle right-associative power operator ^
  parsePowers(expr) {
    let tokens = expr.replace(/\*\*/g, "^");
    while (tokens.includes("^")) {
      tokens = tokens.replace(/([a-zA-Z0-9_\.]+|\([^\(\)]+\))\^([a-zA-Z0-9_\.]+|\([^\(\)]+\))/, "Math.pow($1,$2)");
    }
    return tokens;
  }

  // =========================================================================
  // Numerical Integration: Simpson's 1/3 Composite Rule (Casio Algorithm)
  // =========================================================================
  numericalIntegrate(fnStr, a, b, n = 100) {
    if (n % 2 !== 0) n++; // Simpson's rule requires even intervals
    const h = (b - a) / n;
    let sum = this.evaluateExpression(fnStr, a) + this.evaluateExpression(fnStr, b);

    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      const y = this.evaluateExpression(fnStr, x);
      sum += (i % 2 === 0 ? 2 : 4) * y;
    }
    return (h / 3) * sum;
  }

  // =========================================================================
  // Numerical Differentiation: Central Difference Method
  // =========================================================================
  numericalDerivative(fnStr, x, delta = 1e-6) {
    const y1 = this.evaluateExpression(fnStr, x + delta);
    const y2 = this.evaluateExpression(fnStr, x - delta);
    return (y1 - y2) / (2 * delta);
  }

  // =========================================================================
  // Newton-Raphson Solver (Casio SOLVE button)
  // =========================================================================
  solveEquation(fnStr, initialGuess = 0, tol = 1e-8, maxIter = 50) {
    let x = initialGuess;
    for (let iter = 0; iter < maxIter; iter++) {
      const y = this.evaluateExpression(fnStr, x);
      if (Math.abs(y) < tol) return x;
      const dy = this.numericalDerivative(fnStr, x);
      if (Math.abs(dy) < 1e-12) break; // Avoid zero slope
      const nextX = x - y / dy;
      if (Math.abs(nextX - x) < tol) return nextX;
      x = nextX;
    }
    return x;
  }

  // =========================================================================
  // EQN Mode Solvers (Simultaneous 2/3 Unknowns, Quadratic, Cubic)
  // =========================================================================
  initEQN(type = "quadratic") {
    this.eqnState = {
      type,
      coeffs: {},
      step: 0,
      solutions: []
    };
  }

  // Quadratic equation solver: ax² + bx + c = 0
  solveQuadratic(a, b, c) {
    if (a === 0 || isNaN(a) || isNaN(b) || isNaN(c)) {
      throw new Error("Invalid quadratic coefficients. 'a' cannot be zero and coefficients must be numbers.");
    }
    const d = b * b - 4 * a * c;
    if (d >= 0) {
      const x1 = (-b + Math.sqrt(d)) / (2 * a);
      const x2 = (-b - Math.sqrt(d)) / (2 * a);
      const res = [x1.toFixed(4), x2.toFixed(4)];
      res.roots = [x1, x2];
      res.discriminant = d;
      return res;
    } else {
      const real = (-b / (2 * a)).toFixed(4);
      const imag = (Math.sqrt(-d) / (2 * a)).toFixed(4);
      const res = [`${real} + ${imag}i`, `${real} - ${imag}i`];
      res.complex = true;
      res.discriminant = d;
      return res;
    }
  }

  // Simultaneous 2-unknown equations:
  // a1*x + b1*y = c1
  // a2*x + b2*y = c2
  solveSimultaneous2(a1, b1, c1, a2, b2, c2) {
    if ([a1, b1, c1, a2, b2, c2].some(v => isNaN(v) || v === undefined || v === null)) {
      throw new Error("Invalid simultaneous equation parameters. All coefficients (a1, b1, c1, a2, b2, c2) must be valid numbers.");
    }
    const det = a1 * b2 - a2 * b1;
    if (Math.abs(det) < 1e-12) {
      throw new Error("No unique solution: system determinant is zero (parallel or coincident lines).");
    }
    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;
    const xStr = x.toFixed(4);
    const yStr = y.toFixed(4);
    const res = [xStr, yStr];
    res.x = Number(x.toFixed(6));
    res.y = Number(y.toFixed(6));
    res.det = det;
    res.formatted = [`x = ${Number.isInteger(x) ? x : xStr}`, `y = ${Number.isInteger(y) ? y : yStr}`];
    return res;
  }

  // Natural language equation solver
  parseAndSolve(exprStr) {
    if (!exprStr || typeof exprStr !== "string") {
      throw new Error("Missing or invalid equation expression string.");
    }
    const clean = exprStr.trim();

    // Check for 2-equation simultaneous system: separated by ';' or ','
    if (clean.includes(";") || (clean.includes(",") && (clean.match(/=/g) || []).length === 2)) {
      const parts = clean.split(/[;,]/).map(s => s.trim()).filter(Boolean);
      if (parts.length === 2 && parts[0].includes("=") && parts[1].includes("=")) {
        const eq1 = this.parseLinearCoeffs2D(parts[0]);
        const eq2 = this.parseLinearCoeffs2D(parts[1]);
        const res = this.solveSimultaneous2(eq1.a, eq1.b, eq1.c, eq2.a, eq2.b, eq2.c);
        res.type = "simultaneous_2d";
        return res;
      }
    }

    // Check for quadratic equation
    const noSpaces = clean.replace(/\s+/g, "");
    if (noSpaces.includes("x^2") || noSpaces.includes("x2") || noSpaces.includes("x²")) {
      const quadCoeffs = this.parseQuadraticCoeffs(noSpaces);
      if (quadCoeffs) {
        const res = this.solveQuadratic(quadCoeffs.a, quadCoeffs.b, quadCoeffs.c);
        res.type = "quadratic";
        return res;
      }
    }

    // Check for single variable linear equation: e.g. "2x + 8 = 24" or "ax + b = c"
    if (clean.includes("=")) {
      const linResult = this.parseLinear1D(clean);
      if (linResult !== null) {
        const rootStr = linResult.toFixed(4);
        const res = [rootStr];
        res.x = linResult;
        res.type = "linear_1d";
        res.solution = [rootStr];
        res.formatted = [`x = ${Number.isInteger(linResult) ? linResult : rootStr}`];
        return res;
      }
    }

    throw new Error(`Unable to parse natural language equation: "${clean}". Expected forms: "ax^2 + bx + c = 0", "ax + b = c", or "a1*x + b1*y = c1; a2*x + b2*y = c2".`);
  }

  parseLinearCoeffs2D(eqStr) {
    // Normalizes "2x+3y=13" or "x-y=1" or "-x+2y=-5" -> { a, b, c }
    const parts = eqStr.split("=");
    if (parts.length !== 2) throw new Error(`Invalid equation: ${eqStr}`);
    const lhs = parts[0].replace(/\s+/g, "");
    const rhsVal = Number(parts[1].trim());
    if (isNaN(rhsVal)) throw new Error(`Invalid RHS in equation: ${eqStr}`);

    let a = 0;
    let b = 0;

    // Match all terms on LHS: e.g. +2x, -3y, +x, -y
    const termRegex = /([+-]?\d*(?:\.\d+)?)([xy])/gi;
    let match;
    let matchedAny = false;
    while ((match = termRegex.exec(lhs)) !== null) {
      matchedAny = true;
      let coefStr = match[1];
      const variable = match[2].toLowerCase();
      let coef = 1;
      if (coefStr === "" || coefStr === "+") coef = 1;
      else if (coefStr === "-") coef = -1;
      else coef = Number(coefStr);

      if (variable === "x") a += coef;
      else if (variable === "y") b += coef;
    }

    if (!matchedAny) throw new Error(`Could not identify x or y terms in: ${eqStr}`);
    return { a, b, c: rhsVal };
  }

  parseLinear1D(eqStr) {
    const parts = eqStr.split("=");
    if (parts.length !== 2) return null;
    const lhs = parts[0].replace(/\s+/g, "");
    const rhsVal = Number(parts[1].trim());
    if (isNaN(rhsVal)) return null;

    // Pattern for ax + b = c or ax - b = c or ax = c
    const match = lhs.match(/^([+-]?\d*(?:\.\d+)?)x(?:([+-]\d*(?:\.\d+)?))?$/i);
    if (!match) return null;

    let a = 1;
    if (match[1] === "" || match[1] === "+") a = 1;
    else if (match[1] === "-") a = -1;
    else a = Number(match[1]);

    const b = match[2] ? Number(match[2]) : 0;
    if (a === 0 || isNaN(a) || isNaN(b)) return null;

    return (rhsVal - b) / a;
  }

  parseQuadraticCoeffs(str) {
    const eq = str.replace(/=0$/, "");
    // Standard quadratic match: ax^2 + bx + c
    const m = eq.match(/^([+-]?\d*(?:\.\d+)?)x\^?2(?:([+-]\d*(?:\.\d+)?)x)?(?:([+-]\d*(?:\.\d+)?))?$/i);
    if (!m) return null;

    let a = 1;
    if (m[1] === "" || m[1] === "+") a = 1;
    else if (m[1] === "-") a = -1;
    else a = Number(m[1]);

    let b = 0;
    if (m[2]) {
      if (m[2] === "+") b = 1;
      else if (m[2] === "-") b = -1;
      else b = Number(m[2]);
    }

    let c = m[3] ? Number(m[3]) : 0;
    return { a, b, c };
  }

  // Status flags for 2-line LCD display
  getStatusFlags() {
    return {
      S: this.isShift,
      A: this.isAlpha,
      M: this.memoryM !== 0,
      D: this.angleUnit === "DEG",
      R: this.angleUnit === "RAD",
      G: this.angleUnit === "GRA",
      STAT: this.mode === "STAT",
      EQN: this.mode === "EQN"
    };
  }

  // Static wrapper for definite integration (Simpson's 1/3 Rule)
  static integrate(fnStr, a, b, n = 100) {
    const engine = new CasioCalciEngine();
    return engine.numericalIntegrate(fnStr, a, b, n);
  }

  // Static wrapper for derivative (Central Difference)
  static derivative(fnStr, x, h = 1e-6) {
    const engine = new CasioCalciEngine();
    return engine.numericalDerivative(fnStr, x, h);
  }

  // Static wrapper for root solver (Newton-Raphson)
  static solve(eqExpr, initialGuess = 1.0) {
    const engine = new CasioCalciEngine();
    return engine.solveEquation(eqExpr, initialGuess);
  }
}
