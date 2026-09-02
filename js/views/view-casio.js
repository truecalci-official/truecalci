/**
 * Photorealistic Casio fx-991MS Physical Calci View Controller
 * Dual legends, S-V.P.A.M. 2-line LCD, D-Pad replay, and EQN/calculus buttons.
 */

import { CasioCalciEngine } from "../engines/casio-engine.js";

export class ViewCasio {
  constructor(containerEl, playSound) {
    this.container = containerEl;
    this.playSound = playSound;
    this.engine = new CasioCalciEngine();
  }

  render() {
    this.container.innerHTML = `
      <div class="casio-chassis-container">
        <div class="calci-suite-wrapper">
          <!-- Physical Calci 991 Chassis -->
          <div class="casio-chassis">
            <!-- Top Bar: Neutral Scientific Calci Brand & Solar Panel -->
            <div class="casio-top-bar">
              <div class="casio-brand">
                <span class="casio-logo">PRECISION</span>
                <span class="casio-model">CALCI-991</span>
                <span class="casio-svpam">V.P.A.M. ALGEBRAIC</span>
              </div>
              <div class="casio-solar-panel" title="Dual Powered (Solar + Battery)">
                <div class="casio-solar-cell"></div>
                <div class="casio-solar-cell"></div>
                <div class="casio-solar-cell"></div>
                <div class="casio-solar-cell"></div>
              </div>
            </div>

            <!-- Authentic 2-Line S-V.P.A.M. LCD Display -->
            <div class="casio-screen-bezel">
              <div class="casio-lcd">
                <!-- Flag Indicators: S, A, M, STO, RCL, STAT, D, R, G, FIX, SCI -->
                <div class="casio-status-bar">
                  <span class="casio-flag" id="flag-s">S</span>
                  <span class="casio-flag" id="flag-a">A</span>
                  <span class="casio-flag" id="flag-m">M</span>
                  <span class="casio-flag" id="flag-sto">STO</span>
                  <span class="casio-flag" id="flag-rcl">RCL</span>
                  <span class="casio-flag" id="flag-stat">STAT</span>
                  <span class="casio-flag active" id="flag-d">D</span>
                  <span class="casio-flag" id="flag-r">R</span>
                  <span class="casio-flag" id="flag-g">G</span>
                  <span class="casio-flag" id="flag-fix">FIX</span>
                  <span class="casio-flag" id="flag-sci">SCI</span>
                </div>

                <!-- Top Dot-Matrix Expression Line -->
                <div class="casio-expr-line" id="casio-expr">
                  <span id="casio-expr-text"></span><span class="casio-cursor"></span>
                </div>

                <!-- Bottom 10+2 Digit Result Line -->
                <div class="casio-result-line" id="casio-result">0</div>
              </div>
            </div>

            <!-- Keypad Matrix -->
            <div class="casio-keypad">
              <!-- Row 1: SHIFT, ALPHA, REPLAY D-PAD, MODE, ON -->
              <div class="casio-top-controls">
                <button class="casio-key key-shift" id="btn-shift">SHIFT</button>
                <button class="casio-key key-alpha" id="btn-alpha">ALPHA</button>

                <!-- 4-Way Replay D-Pad -->
                <div class="casio-dpad">
                  <button class="dpad-btn dpad-up" id="dpad-up" title="History Up">▲</button>
                  <button class="dpad-btn dpad-down" id="dpad-down" title="History Down">▼</button>
                  <button class="dpad-btn dpad-left" id="dpad-left" title="Cursor Left">◀</button>
                  <button class="dpad-btn dpad-right" id="dpad-right" title="Cursor Right">▶</button>
                  <div class="casio-dpad-center">REPLAY</div>
                </div>

                <button class="casio-key" id="btn-mode">MODE</button>
                <button class="casio-key" id="btn-on">ON</button>
              </div>

              <!-- Row 2: SOLVE, d/dx, x!, pol, nCr, x³ -->
              <div class="casio-key-row">
                ${this.renderKey("CALC", "SOLVE", "=", "calc")}
                ${this.renderKey("∫dx", "d/dx", ":", "integral")}
                ${this.renderKey("x⁻¹", "x!", "", "inv")}
                ${this.renderKey("x³", "³√", "", "cube")}
                ${this.renderKey("a b/c", "d/c", "", "frac")}
                ${this.renderKey("√", "x√", "", "sqrt")}
              </div>

              <!-- Row 3: x², ^, log, ln, (-), ° ' '' -->
              <div class="casio-key-row">
                ${this.renderKey("x²", "", "", "sq")}
                ${this.renderKey("^", "x√y", "", "power")}
                ${this.renderKey("log", "10^x", "", "log")}
                ${this.renderKey("ln", "e^x", "e", "ln")}
                ${this.renderKey("(-)", "", "A", "neg")}
                ${this.renderKey("°'\"", "←", "B", "dms")}
              </div>

              <!-- Row 4: hyp, sin, cos, tan, RCL, ENG -->
              <div class="casio-key-row">
                ${this.renderKey("hyp", "", "C", "hyp")}
                ${this.renderKey("sin", "sin⁻¹", "D", "sin")}
                ${this.renderKey("cos", "cos⁻¹", "E", "cos")}
                ${this.renderKey("tan", "tan⁻¹", "F", "tan")}
                ${this.renderKey("RCL", "STO", "", "rcl")}
                ${this.renderKey("ENG", "←", "", "eng")}
              </div>

              <!-- Row 5: (, ), ,, M+, 7, 8, 9, DEL, AC -->
              <div class="casio-key-row-5">
                ${this.renderKey("(", "", "", "lparen")}
                ${this.renderKey(")", "", "X", "rparen")}
                ${this.renderKey(",", ";", "Y", "comma")}
                ${this.renderKey("M+", "M-", "M", "mplus")}
                <div style="visibility:hidden"></div>
              </div>

              <!-- Numeric Block Row 1: 7, 8, 9, DEL, AC -->
              <div class="casio-key-row-5">
                <button class="casio-key key-num" data-action="digit" data-val="7">7</button>
                <button class="casio-key key-num" data-action="digit" data-val="8">8</button>
                <button class="casio-key key-num" data-action="digit" data-val="9">9</button>
                <button class="casio-key key-del" id="btn-del">DEL</button>
                <button class="casio-key key-ac" id="btn-ac">AC</button>
              </div>

              <!-- Numeric Block Row 2: 4, 5, 6, ×, ÷ -->
              <div class="casio-key-row-5">
                <button class="casio-key key-num" data-action="digit" data-val="4">4</button>
                <button class="casio-key key-num" data-action="digit" data-val="5">5</button>
                <button class="casio-key key-num" data-action="digit" data-val="6">6</button>
                <button class="casio-key" data-action="op" data-val="×">×</button>
                <button class="casio-key" data-action="op" data-val="÷">÷</button>
              </div>

              <!-- Numeric Block Row 3: 1, 2, 3, +, - -->
              <div class="casio-key-row-5">
                <button class="casio-key key-num" data-action="digit" data-val="1">1</button>
                <button class="casio-key key-num" data-action="digit" data-val="2">2</button>
                <button class="casio-key key-num" data-action="digit" data-val="3">3</button>
                <button class="casio-key" data-action="op" data-val="+">+</button>
                <button class="casio-key" data-action="op" data-val="-">-</button>
              </div>

              <!-- Numeric Block Row 4: 0, ., EXP, Ans, = -->
              <div class="casio-key-row-5">
                <button class="casio-key key-num" data-action="digit" data-val="0">0</button>
                <button class="casio-key key-num" data-action="decimal">.</button>
                <button class="casio-key" data-action="exp">EXP</button>
                <button class="casio-key" data-action="ans">Ans</button>
                <button class="casio-key key-equal" id="btn-equal">=</button>
              </div>
            </div>
          </div>

          <!-- Smart AI Math Assistant & Prompt Companion Panel -->
          <div class="calci-ai-companion">
            <div class="ai-companion-header">
              <div>
                <h3 class="ai-companion-title">⚡ Smart AI Math & Natural Language Solver</h3>
                <span class="ai-companion-sub">Ask in plain English or math expressions to solve instantly</span>
              </div>
              <a href="engineering-formulas.html" target="_blank" class="view-all-formulas-link">
                📖 Full Formula Sheet →
              </a>
            </div>

            <div class="ai-input-bar-wrap">
              <input type="text" id="calci-ai-input" class="calci-ai-input" placeholder="e.g. 'integrate x^2 from 0 to 3' or 'solve 2x + 8 = 24' or 'roots of x^2 - 5x + 6'">
              <button id="calci-ai-submit" class="calci-ai-btn">Solve ↵</button>
            </div>

            <!-- Quick Example Chips -->
            <div class="ai-chip-group">
              <button class="ai-prompt-chip" data-q="integrate x^2 from 0 to 3">∫ x² [0,3]</button>
              <button class="ai-prompt-chip" data-q="derivative of x^3 at 2">d/dx(x³) @ 2</button>
              <button class="ai-prompt-chip" data-q="solve 3x + 15 = 45">Solve 3x+15=45</button>
              <button class="ai-prompt-chip" data-q="quadratic x^2 - 5x + 6 = 0">Roots x²-5x+6</button>
              <button class="ai-prompt-chip" data-q="sin(30) + cos(60)">sin(30)+cos(60)</button>
              <button class="ai-prompt-chip" data-q="1000 * (1 + 0.08)^5">Compound 8% 5yr</button>
            </div>

            <!-- Step-by-Step AI Solution Card -->
            <div class="ai-solution-card" id="ai-solution-card" style="display:none;">
              <div class="ai-card-step-header">
                <span class="ai-card-tag" id="ai-solution-type">Numerical Calculus</span>
                <span class="ai-card-status">✓ Computed & Sent to LCD</span>
              </div>
              <div class="ai-card-result" id="ai-solution-result">0</div>
              <div class="ai-card-explanation" id="ai-solution-explanation"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.bindAIEvents();
    this.updateDisplay();
    this.checkPreloadedExpression();
  }

  renderKey(mainLabel, shiftLabel, alphaLabel, keyId) {
    return `
      <div class="casio-btn-wrapper">
        <div class="casio-legends">
          <span class="legend-shift">${shiftLabel}</span>
          <span class="legend-alpha">${alphaLabel}</span>
        </div>
        <button class="casio-key" id="ckey-${keyId}" data-main="${mainLabel}" data-shift="${shiftLabel}" data-alpha="${alphaLabel}">
          ${mainLabel}
        </button>
      </div>
    `;
  }

  bindEvents() {
    // SHIFT & ALPHA
    this.container.querySelector("#btn-shift").addEventListener("click", () => {
      this.playSound?.();
      this.engine.toggleShift();
      this.updateDisplay();
    });

    this.container.querySelector("#btn-alpha").addEventListener("click", () => {
      this.playSound?.();
      this.engine.toggleAlpha();
      this.updateDisplay();
    });

    // Replay D-Pad
    this.container.querySelector("#dpad-left").addEventListener("click", () => {
      this.playSound?.();
      this.engine.moveCursor("left");
      this.updateDisplay();
    });
    this.container.querySelector("#dpad-right").addEventListener("click", () => {
      this.playSound?.();
      this.engine.moveCursor("right");
      this.updateDisplay();
    });
    this.container.querySelector("#dpad-up").addEventListener("click", () => {
      this.playSound?.();
      this.engine.navigateHistory("up");
      this.updateDisplay();
    });
    this.container.querySelector("#dpad-down").addEventListener("click", () => {
      this.playSound?.();
      this.engine.navigateHistory("down");
      this.updateDisplay();
    });

    // DEL & AC & ON
    this.container.querySelector("#btn-del").addEventListener("click", () => {
      this.playSound?.();
      this.engine.delete();
      this.updateDisplay();
    });
    this.container.querySelector("#btn-ac").addEventListener("click", () => {
      this.playSound?.();
      this.engine.allClear();
      this.updateDisplay();
    });
    this.container.querySelector("#btn-on").addEventListener("click", () => {
      this.playSound?.();
      this.engine.allClear();
      this.updateDisplay();
    });

    // MODE Button: Cycle through COMP -> EQN -> STAT
    this.container.querySelector("#btn-mode").addEventListener("click", () => {
      this.playSound?.();
      if (this.engine.mode === "COMP") this.engine.setMode("EQN");
      else if (this.engine.mode === "EQN") this.engine.setMode("STAT");
      else this.engine.setMode("COMP");
      this.updateDisplay();
    });

    // Digits
    this.container.querySelectorAll("[data-action='digit']").forEach(btn => {
      btn.addEventListener("click", () => {
        this.playSound?.();
        this.engine.insert(btn.dataset.val);
        this.updateDisplay();
      });
    });

    // Decimal
    this.container.querySelector("[data-action='decimal']").addEventListener("click", () => {
      this.playSound?.();
      this.engine.insert(".");
      this.updateDisplay();
    });

    // Operators
    this.container.querySelectorAll("[data-action='op']").forEach(btn => {
      btn.addEventListener("click", () => {
        this.playSound?.();
        this.engine.insert(` ${btn.dataset.val} `);
        this.updateDisplay();
      });
    });

    // Ans & EXP
    this.container.querySelector("[data-action='ans']").addEventListener("click", () => {
      this.playSound?.();
      this.engine.insert("Ans");
      this.updateDisplay();
    });
    this.container.querySelector("[data-action='exp']").addEventListener("click", () => {
      this.playSound?.();
      this.engine.insert("×10^");
      this.updateDisplay();
    });

    // EQUALS =
    this.container.querySelector("#btn-equal").addEventListener("click", () => {
      this.playSound?.();
      this.engine.evaluate();
      this.updateDisplay();
    });

    // Functions
    const bindFn = (id, norm, shift, alpha) => {
      const el = this.container.querySelector(`#ckey-${id}`);
      if (!el) return;
      el.addEventListener("click", () => {
        this.playSound?.();
        if (this.engine.isShift && shift) {
          this.engine.insert(shift);
        } else if (this.engine.isAlpha && alpha) {
          this.engine.insert(alpha);
        } else {
          this.engine.insert(norm);
        }
        this.updateDisplay();
      });
    };

    bindFn("sin", "sin(", "asin(", "D");
    bindFn("cos", "cos(", "acos(", "E");
    bindFn("tan", "tan(", "atan(", "F");
    bindFn("log", "log(", "10^(", "");
    bindFn("ln", "ln(", "e^(", "e");
    bindFn("sq", "²", "", "");
    bindFn("cube", "³", "³√(", "");
    bindFn("sqrt", "√(", "x√(", "");
    bindFn("power", "^", "x√y", "");
    bindFn("frac", "⌟", "", "");
    bindFn("lparen", "(", "", "");
    bindFn("rparen", ")", "", "X");
    bindFn("comma", ",", ";", "Y");
    bindFn("inv", "⁻¹", "!", "");
    bindFn("integral", "∫(", "d/dx(", ":");
    bindFn("calc", "CALC", "SOLVE", "=");
    bindFn("mplus", "", "", "");

    // M+ special handler
    this.container.querySelector("#ckey-mplus")?.addEventListener("click", () => {
      this.playSound?.();
      if (this.engine.isShift) this.engine.memorySub();
      else if (this.engine.isAlpha) this.engine.insert("M");
      else this.engine.memoryAdd();
      this.updateDisplay();
    });
  }

  updateDisplay() {
    const flags = this.engine.getStatusFlags();
    this.container.querySelector("#flag-s")?.classList.toggle("active", flags.S);
    this.container.querySelector("#flag-a")?.classList.toggle("active", flags.A);
    this.container.querySelector("#flag-m")?.classList.toggle("active", flags.M);
    this.container.querySelector("#flag-d")?.classList.toggle("active", flags.D);
    this.container.querySelector("#flag-r")?.classList.toggle("active", flags.R);
    this.container.querySelector("#flag-g")?.classList.toggle("active", flags.G);
    this.container.querySelector("#flag-stat")?.classList.toggle("active", flags.STAT);

    const exprEl = this.container.querySelector("#casio-expr-text");
    const resEl = this.container.querySelector("#casio-result");

    if (exprEl) {
      exprEl.textContent = this.engine.expression || (this.engine.mode === "EQN" ? "EQN: ax²+bx+c=0" : "");
    }
    if (resEl) {
      resEl.textContent = this.engine.result;
    }
  }

  bindAIEvents() {
    const input = this.container.querySelector("#calci-ai-input");
    const btn = this.container.querySelector("#calci-ai-submit");

    btn?.addEventListener("click", () => {
      this.solveAIPrompt(input?.value);
    });

    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.solveAIPrompt(input?.value);
      }
    });

    this.container.querySelectorAll(".ai-prompt-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const query = chip.dataset.q;
        if (input) input.value = query;
        this.solveAIPrompt(query);
      });
    });
  }

  checkPreloadedExpression() {
    try {
      const pre = sessionStorage.getItem("preloaded_expr");
      if (pre) {
        const input = this.container.querySelector("#calci-ai-input");
        if (input) input.value = pre;
        sessionStorage.removeItem("preloaded_expr");
        setTimeout(() => this.solveAIPrompt(pre), 150);
      }
    } catch (e) {}
  }

  solveAIPrompt(query) {
    if (!query || !query.trim()) return;
    const q = query.trim();
    this.playSound?.();

    const card = this.container.querySelector("#ai-solution-card");
    const tag = this.container.querySelector("#ai-solution-type");
    const resEl = this.container.querySelector("#ai-solution-result");
    const expEl = this.container.querySelector("#ai-solution-explanation");

    // 1. Definite Integration: "integrate x^2 from 0 to 3"
    const intMatch = q.match(/(?:integrate|integral\s+of)\s+([a-z0-9\^\+\-\*\/\s\(\)]+)\s+from\s+([\-0-9\.]+)\s+to\s+([\-0-9\.]+)/i);
    if (intMatch) {
      const expr = intMatch[1].trim();
      const a = parseFloat(intMatch[2]);
      const b = parseFloat(intMatch[3]);
      const fnStr = expr.replace(/\^/g, '**');
      const val = CasioCalciEngine.integrate(fnStr, a, b);

      this.engine.expression = `∫(${expr.toUpperCase()},${a},${b})`;
      this.engine.result = Number.isInteger(val) ? val.toString() : val.toFixed(4);
      this.updateDisplay();

      if (card) {
        card.style.display = "flex";
        tag.textContent = "Definite Integral (Simpson's 1/3 Rule)";
        resEl.textContent = this.engine.result;
        expEl.innerHTML = `Evaluated <strong>∫ [${a} to ${b}] (${expr}) dx</strong> using Simpson's 1/3 Composite Rule.<br>Area under curve = <strong>${this.engine.result}</strong>. Sent directly to 991 Calci LCD.`;
      }
      return;
    }

    // 2. Numerical Derivative: "derivative of x^3 at 2"
    const diffMatch = q.match(/(?:derivative|d\/dx)\s+(?:of\s+)?([a-z0-9\^\+\-\*\/\s\(\)]+)\s+at\s+([x\s=]*)([\-0-9\.]+)/i);
    if (diffMatch) {
      const expr = diffMatch[1].trim();
      const xVal = parseFloat(diffMatch[3]);
      const fnStr = expr.replace(/\^/g, '**');
      const val = CasioCalciEngine.derivative(fnStr, xVal);

      this.engine.expression = `d/dx(${expr.toUpperCase()})|x=${xVal}`;
      this.engine.result = Number.isInteger(val) ? val.toString() : val.toFixed(4);
      this.updateDisplay();

      if (card) {
        card.style.display = "flex";
        tag.textContent = "Numerical Derivative (Central Difference)";
        resEl.textContent = this.engine.result;
        expEl.innerHTML = `Evaluated instantaneous slope <strong>d/dx (${expr})</strong> at <strong>x = ${xVal}</strong>.<br>Slope rate = <strong>${this.engine.result}</strong>. Sent directly to 991 Calci LCD.`;
      }
      return;
    }

    // 3. Linear / Root Solve: "solve 3x + 15 = 45"
    const solveMatch = q.match(/solve\s+([a-z0-9\^\+\-\*\/\s\(\)]+)\s*=\s*([\-0-9\.]+)/i);
    if (solveMatch) {
      const lhs = solveMatch[1].trim();
      const rhs = parseFloat(solveMatch[2]);
      const eqExpr = `${lhs} - (${rhs})`;
      const val = CasioCalciEngine.solve(eqExpr);

      this.engine.expression = `SOLVE: ${lhs.toUpperCase()}=${rhs}`;
      this.engine.result = `X = ${val.toFixed(4)}`;
      this.updateDisplay();

      if (card) {
        card.style.display = "flex";
        tag.textContent = "Newton-Raphson Root Solver";
        resEl.textContent = `X = ${val.toFixed(4)}`;
        expEl.innerHTML = `Iteratively solved linear equation <strong>${lhs} = ${rhs}</strong>.<br>Exact Solution: <strong>X = ${val.toFixed(4)}</strong>. Sent to 991 Calci LCD.`;
      }
      return;
    }

    // 4. Quadratic Equations: "quadratic x^2 - 5x + 6 = 0"
    const quadMatch = q.match(/(?:quadratic|roots\s+of)\s+([0-9]*)\s*x\^?2\s*([\+\-]\s*[0-9]*)\s*x\s*([\+\-]\s*[0-9]+)/i);
    if (quadMatch) {
      const a = parseFloat(quadMatch[1] || "1");
      const bStr = quadMatch[2].replace(/\s+/g, '');
      const b = parseFloat(bStr === '+' ? '1' : bStr === '-' ? '-1' : bStr);
      const c = parseFloat(quadMatch[3].replace(/\s+/g, ''));
      const roots = CasioCalciEngine.solveQuadratic(a, b, c);

      this.engine.expression = `EQN: ${a}X²${b>=0?'+':''}${b}X${c>=0?'+':''}${c}=0`;
      this.engine.result = `X1=${roots[0]}, X2=${roots[1]}`;
      this.updateDisplay();

      if (card) {
        card.style.display = "flex";
        tag.textContent = "Polynomial Quadratic Roots (EQN)";
        resEl.textContent = `X₁ = ${roots[0]},  X₂ = ${roots[1]}`;
        const disc = b*b - 4*a*c;
        expEl.innerHTML = `Quadratic formula with Discriminant Δ = b² - 4ac = <strong>${disc}</strong>.<br>Roots: <strong>X₁ = ${roots[0]}</strong>, <strong>X₂ = ${roots[1]}</strong>. Sent to 991 Calci LCD.`;
      }
      return;
    }

    // 5. General Arithmetic / Engineering Expression
    try {
      this.engine.expression = query.trim();
      this.engine.evaluate();
      this.updateDisplay();

      if (card) {
        card.style.display = "flex";
        tag.textContent = "Engineering Scientific Evaluation";
        resEl.textContent = this.engine.result;
        expEl.innerHTML = `Evaluated mathematical expression: <code>${query}</code>.<br>Result = <strong>${this.engine.result}</strong>. Sent to 991 Calci LCD.`;
      }
    } catch (e) {
      if (card) {
        card.style.display = "flex";
        tag.textContent = "Input Notice";
        resEl.textContent = "Syntax Error";
        expEl.textContent = "Could not parse query. Try standard format: 'integrate x^2 from 0 to 3' or 'solve 2x + 8 = 24' or 'quadratic x^2 - 5x + 6 = 0'.";
      }
    }
  }
}
