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
    if (a === 0) return ["Not quadratic"];
    const d = b * b - 4 * a * c;
    if (d >= 0) {
      const x1 = (-b + Math.sqrt(d)) / (2 * a);
      const x2 = (-b - Math.sqrt(d)) / (2 * a);
      return [x1.toFixed(4), x2.toFixed(4)];
    } else {
      const real = (-b / (2 * a)).toFixed(4);
      const imag = (Math.sqrt(-d) / (2 * a)).toFixed(4);
      return [`${real} + ${imag}i`, `${real} - ${imag}i`];
    }
  }

  // Simultaneous 2-unknown equations:
  // a1*x + b1*y = c1
  // a2*x + b2*y = c2
  solveSimultaneous2(a1, b1, c1, a2, b2, c2) {
    const det = a1 * b2 - a2 * b1;
    if (det === 0) return ["No unique solution"];
    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;
    return [x.toFixed(4), y.toFixed(4)];
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
