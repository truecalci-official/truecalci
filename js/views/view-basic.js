/**
 * Commercial Desktop & Basic Arithmetic Calculator View Controller
 */

import { BasicCalculatorEngine } from "../engines/basic-engine.js";

export class ViewBasic {
  constructor(containerEl, playSound) {
    this.container = containerEl;
    this.playSound = playSound;
    this.engine = new BasicCalculatorEngine();
  }

  render() {
    this.container.innerHTML = `
      <div class="basic-calc-container">
        <div class="basic-calc-chassis">
          <!-- Display Box -->
          <div class="basic-display-box">
            <div style="display:flex; justify-content:space-between; width:100%;">
              <span class="basic-memory-flag" id="basic-m-flag" style="visibility:hidden;">M</span>
              <span class="basic-history-line" id="basic-history"></span>
            </div>
            <div class="basic-main-line" id="basic-display">0</div>
          </div>

          <!-- Keypad Grid (4 columns) -->
          <div class="basic-keypad-grid">
            <!-- Row 1: MC, MR, M-, M+ -->
            <button class="basic-btn" id="bkey-mc">MC</button>
            <button class="basic-btn" id="bkey-mr">MR</button>
            <button class="basic-btn" id="bkey-mminus">M-</button>
            <button class="basic-btn" id="bkey-mplus">M+</button>

            <!-- Row 2: %, CE, C, ⌫ -->
            <button class="basic-btn op-btn" id="bkey-pct">%</button>
            <button class="basic-btn clear-btn" id="bkey-ce">CE</button>
            <button class="basic-btn clear-btn" id="bkey-c">C</button>
            <button class="basic-btn" id="bkey-back">⌫</button>

            <!-- Row 3: 1/x, x², √x, ÷ -->
            <button class="basic-btn op-btn" id="bkey-recip">1/x</button>
            <button class="basic-btn op-btn" id="bkey-sq">x²</button>
            <button class="basic-btn op-btn" id="bkey-sqrt">√</button>
            <button class="basic-btn op-btn" data-op="÷">÷</button>

            <!-- Row 4: 7, 8, 9, × -->
            <button class="basic-btn" data-digit="7">7</button>
            <button class="basic-btn" data-digit="8">8</button>
            <button class="basic-btn" data-digit="9">9</button>
            <button class="basic-btn op-btn" data-op="×">×</button>

            <!-- Row 5: 4, 5, 6, - -->
            <button class="basic-btn" data-digit="4">4</button>
            <button class="basic-btn" data-digit="5">5</button>
            <button class="basic-btn" data-digit="6">6</button>
            <button class="basic-btn op-btn" data-op="-">-</button>

            <!-- Row 6: 1, 2, 3, + -->
            <button class="basic-btn" data-digit="1">1</button>
            <button class="basic-btn" data-digit="2">2</button>
            <button class="basic-btn" data-digit="3">3</button>
            <button class="basic-btn op-btn" data-op="+">+</button>

            <!-- Row 7: ±, 0, ., = -->
            <button class="basic-btn" id="bkey-sign">±</button>
            <button class="basic-btn" data-digit="0">0</button>
            <button class="basic-btn" id="bkey-dot">.</button>
            <button class="basic-btn equal-btn" id="bkey-eq">=</button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.updateDisplay();
  }

  bindEvents() {
    // Digits
    this.container.querySelectorAll("[data-digit]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.playSound?.();
        this.engine.appendDigit(btn.dataset.digit);
        this.updateDisplay();
      });
    });

    // Decimal
    this.container.querySelector("#bkey-dot").addEventListener("click", () => {
      this.playSound?.();
      this.engine.appendDecimal();
      this.updateDisplay();
    });

    // Sign Toggle
    this.container.querySelector("#bkey-sign").addEventListener("click", () => {
      this.playSound?.();
      this.engine.toggleSign();
      this.updateDisplay();
    });

    // Operators
    this.container.querySelectorAll("[data-op]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.playSound?.();
        this.engine.setOperation(btn.dataset.op);
        this.updateDisplay();
      });
    });

    // Equals
    this.container.querySelector("#bkey-eq").addEventListener("click", () => {
      this.playSound?.();
      this.engine.compute();
      this.updateDisplay();
    });

    // Clear buttons
    this.container.querySelector("#bkey-c").addEventListener("click", () => {
      this.playSound?.();
      this.engine.clear();
      this.updateDisplay();
    });
    this.container.querySelector("#bkey-ce").addEventListener("click", () => {
      this.playSound?.();
      this.engine.clearEntry();
      this.updateDisplay();
    });
    this.container.querySelector("#bkey-back").addEventListener("click", () => {
      this.playSound?.();
      this.engine.backspace();
      this.updateDisplay();
    });

    // Immediate ops
    this.container.querySelector("#bkey-pct").addEventListener("click", () => {
      this.playSound?.();
      this.engine.percentage();
      this.updateDisplay();
    });
    this.container.querySelector("#bkey-sqrt").addEventListener("click", () => {
      this.playSound?.();
      this.engine.squareRoot();
      this.updateDisplay();
    });
    this.container.querySelector("#bkey-recip").addEventListener("click", () => {
      this.playSound?.();
      this.engine.reciprocal();
      this.updateDisplay();
    });
    this.container.querySelector("#bkey-sq").addEventListener("click", () => {
      this.playSound?.();
      const val = parseFloat(this.engine.display);
      if (!isNaN(val)) {
        this.engine.display = this.engine.formatNumber(val * val);
        this.engine.shouldResetDisplay = true;
      }
      this.updateDisplay();
    });

    // Memory keys
    this.container.querySelector("#bkey-mplus").addEventListener("click", () => {
      this.playSound?.();
      this.engine.memoryAdd();
      this.updateDisplay();
    });
    this.container.querySelector("#bkey-mminus").addEventListener("click", () => {
      this.playSound?.();
      this.engine.memorySub();
      this.updateDisplay();
    });
    this.container.querySelector("#bkey-mr").addEventListener("click", () => {
      this.playSound?.();
      this.engine.memoryRecall();
      this.updateDisplay();
    });
    this.container.querySelector("#bkey-mc").addEventListener("click", () => {
      this.playSound?.();
      this.engine.memoryClear();
      this.updateDisplay();
    });
  }

  updateDisplay() {
    this.container.querySelector("#basic-display").textContent = this.engine.display;
    this.container.querySelector("#basic-history").textContent = this.engine.formulaHistory;
    this.container.querySelector("#basic-m-flag").style.visibility = this.engine.hasMemory ? "visible" : "hidden";
  }
}
