/**
 * Commercial Desktop & Basic Arithmetic Calculator Engine
 * Handles standard operations, M+/M-/MR/MC registers, percentage semantics, and repeated equals.
 */

export class BasicCalculatorEngine {
  constructor() {
    this.clear();
  }

  clear() {
    this.display = "0";
    this.previousOperand = null;
    this.currentOperation = null;
    this.shouldResetDisplay = false;
    this.memory = 0;
    this.hasMemory = false;
    this.lastOperator = null;
    this.lastOperand = null;
    this.formulaHistory = "";
  }

  clearEntry() {
    this.display = "0";
  }

  backspace() {
    if (this.shouldResetDisplay) return;
    if (this.display.length === 1 || (this.display.length === 2 && this.display.startsWith("-"))) {
      this.display = "0";
    } else {
      this.display = this.display.slice(0, -1);
    }
  }

  appendDigit(digit) {
    if (this.display === "0" || this.shouldResetDisplay) {
      this.display = digit;
      this.shouldResetDisplay = false;
    } else {
      this.display += digit;
    }
  }

  appendDecimal() {
    if (this.shouldResetDisplay) {
      this.display = "0.";
      this.shouldResetDisplay = false;
      return;
    }
    if (!this.display.includes(".")) {
      this.display += ".";
    }
  }

  toggleSign() {
    if (this.display === "0") return;
    if (this.display.startsWith("-")) {
      this.display = this.display.substring(1);
    } else {
      this.display = "-" + this.display;
    }
  }

  percentage() {
    const current = parseFloat(this.display);
    if (isNaN(current)) return;

    if (this.previousOperand !== null && this.currentOperation !== null) {
      // Percentage in relation to previous operand: e.g. 500 + 10% = 500 + 50
      if (this.currentOperation === "+" || this.currentOperation === "-") {
        const pctVal = (this.previousOperand * current) / 100;
        this.display = this.formatNumber(pctVal);
      } else {
        const pctVal = current / 100;
        this.display = this.formatNumber(pctVal);
      }
    } else {
      this.display = this.formatNumber(current / 100);
    }
  }

  squareRoot() {
    const val = parseFloat(this.display);
    if (val < 0) {
      this.display = "Invalid Input";
      this.shouldResetDisplay = true;
      return;
    }
    this.display = this.formatNumber(Math.sqrt(val));
    this.shouldResetDisplay = true;
  }

  reciprocal() {
    const val = parseFloat(this.display);
    if (val === 0) {
      this.display = "Cannot divide by 0";
      this.shouldResetDisplay = true;
      return;
    }
    this.display = this.formatNumber(1 / val);
    this.shouldResetDisplay = true;
  }

  setOperation(op) {
    const current = parseFloat(this.display);
    if (isNaN(current)) return;

    if (this.previousOperand !== null && !this.shouldResetDisplay) {
      this.compute();
    } else {
      this.previousOperand = current;
    }

    this.currentOperation = op;
    this.shouldResetDisplay = true;
    this.formulaHistory = `${this.previousOperand} ${op}`;
  }

  compute() {
    let result = 0;
    const prev = this.previousOperand;
    const current = parseFloat(this.display);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.currentOperation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "×":
      case "*":
        result = prev * current;
        break;
      case "÷":
      case "/":
        if (current === 0) {
          this.display = "Cannot divide by 0";
          this.shouldResetDisplay = true;
          this.previousOperand = null;
          this.currentOperation = null;
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    this.lastOperator = this.currentOperation;
    this.lastOperand = current;
    this.formulaHistory = `${prev} ${this.currentOperation} ${current} =`;
    this.display = this.formatNumber(result);
    this.previousOperand = result;
    this.currentOperation = null;
    this.shouldResetDisplay = true;
  }

  // Memory Registers
  memoryAdd() {
    const val = parseFloat(this.display);
    if (!isNaN(val)) {
      this.memory += val;
      this.hasMemory = true;
      this.shouldResetDisplay = true;
    }
  }

  memorySub() {
    const val = parseFloat(this.display);
    if (!isNaN(val)) {
      this.memory -= val;
      this.hasMemory = true;
      this.shouldResetDisplay = true;
    }
  }

  memoryRecall() {
    this.display = this.formatNumber(this.memory);
    this.shouldResetDisplay = true;
  }

  memoryClear() {
    this.memory = 0;
    this.hasMemory = false;
  }

  formatNumber(val) {
    if (isNaN(val) || !isFinite(val)) return "Error";
    // Avoid floating point artifacts like 0.1 + 0.2 = 0.30000000000000004
    const rounded = parseFloat(val.toPrecision(12));
    return String(rounded);
  }
}
