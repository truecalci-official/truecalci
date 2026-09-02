/**
 * 64-Bit Programmer Calculator & Bitboard View Controller
 */

import { ProgrammerEngine } from "../engines/programmer-engine.js";

export class ViewProgrammer {
  constructor(containerEl, playSound) {
    this.container = containerEl;
    this.playSound = playSound;
    this.engine = new ProgrammerEngine();
  }

  render() {
    this.container.innerHTML = `
      <div class="programmer-container">
        <!-- Live Numerical Base Display -->
        <div class="prog-display-panel">
          <div class="prog-base-row">
            <span class="prog-base-label">HEX</span>
            <span class="prog-base-val" id="prog-val-hex">0</span>
          </div>
          <div class="prog-base-row">
            <span class="prog-base-label">DEC</span>
            <span class="prog-base-val" id="prog-val-dec">0</span>
          </div>
          <div class="prog-base-row">
            <span class="prog-base-label">OCT</span>
            <span class="prog-base-val" id="prog-val-oct">0</span>
          </div>
          <div class="prog-base-row">
            <span class="prog-base-label">BIN</span>
            <span class="prog-base-val" id="prog-val-bin" style="font-size:0.75rem;">0000 0000 0000 0000</span>
          </div>
        </div>

        <!-- Word Size Selector & Quick Bitwise Ops -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <div class="fin-preset-chips">
            <button class="fin-chip active" data-bits="64">64-bit (QWORD)</button>
            <button class="fin-chip" data-bits="32">32-bit (DWORD)</button>
            <button class="fin-chip" data-bits="16">16-bit (WORD)</button>
            <button class="fin-chip" data-bits="8">8-bit (BYTE)</button>
          </div>
          <div style="display:flex; gap:0.4rem;">
            <button class="fin-chip" id="prog-btn-not">NOT (~)</button>
            <button class="fin-chip" id="prog-btn-shl">SHL (<< 1)</button>
            <button class="fin-chip" id="prog-btn-shr">SHR (>> 1)</button>
            <button class="fin-chip" id="prog-btn-clear" style="color:#dc2626;">CLR</button>
          </div>
        </div>

        <!-- 64-Bit Interactive Clickable Bitboard -->
        <div class="bitboard-wrapper">
          <div class="bitboard-title">
            <span>64-Bit Interactive Bitboard</span>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">Click any cell to toggle bit</span>
          </div>
          <div class="bitboard-grid" id="prog-bitboard-grid"></div>
        </div>
      </div>
    `;

    this.renderBitboard();
    this.bindEvents();
    this.updateDisplay();
  }

  renderBitboard() {
    const grid = this.container.querySelector("#prog-bitboard-grid");
    if (!grid) return;

    let cellsHtml = "";
    // Display bits 63 down to 0
    for (let i = 63; i >= 0; i--) {
      cellsHtml += `
        <div class="bit-cell" data-bit="${i}" id="bit-cell-${i}">
          <span class="bit-val">0</span>
          <span class="bit-index">${i}</span>
        </div>
      `;
    }
    grid.innerHTML = cellsHtml;

    // Attach click event to toggle bit
    grid.querySelectorAll(".bit-cell").forEach(cell => {
      cell.addEventListener("click", () => {
        this.playSound?.();
        const bitIndex = parseInt(cell.dataset.bit);
        this.engine.toggleBit(bitIndex);
        this.updateDisplay();
      });
    });
  }

  bindEvents() {
    // Word sizes
    this.container.querySelectorAll(".fin-chip[data-bits]").forEach(chip => {
      chip.addEventListener("click", () => {
        this.container.querySelectorAll(".fin-chip[data-bits]").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.engine.setWordSize(parseInt(chip.dataset.bits));
        this.updateDisplay();
      });
    });

    // Bitwise Ops
    this.container.querySelector("#prog-btn-not").addEventListener("click", () => {
      this.playSound?.();
      this.engine.bitwiseNot();
      this.updateDisplay();
    });
    this.container.querySelector("#prog-btn-shl").addEventListener("click", () => {
      this.playSound?.();
      this.engine.shiftLeft(1);
      this.updateDisplay();
    });
    this.container.querySelector("#prog-btn-shr").addEventListener("click", () => {
      this.playSound?.();
      this.engine.shiftRight(1);
      this.updateDisplay();
    });
    this.container.querySelector("#prog-btn-clear").addEventListener("click", () => {
      this.playSound?.();
      this.engine.setValueFromDec("0");
      this.updateDisplay();
    });
  }

  updateDisplay() {
    this.container.querySelector("#prog-val-hex").textContent = "0x" + this.engine.getHex();
    this.container.querySelector("#prog-val-dec").textContent = this.engine.getDec();
    this.container.querySelector("#prog-val-oct").textContent = "0o" + this.engine.getOct();
    
    // Format Binary into 4-bit nibbles
    const binStr = this.engine.getBin();
    const formattedBin = binStr.match(/.{1,4}/g)?.join(" ") || binStr;
    this.container.querySelector("#prog-val-bin").textContent = formattedBin;

    // Update Bitboard cells
    for (let i = 0; i < 64; i++) {
      const cell = this.container.querySelector(`#bit-cell-${i}`);
      if (cell) {
        const isBitOne = (this.engine.value & (BigInt(1) << BigInt(i))) !== BigInt(0);
        cell.classList.toggle("bit-1", isBitOne);
        cell.querySelector(".bit-val").textContent = isBitOne ? "1" : "0";
      }
    }
  }
}
