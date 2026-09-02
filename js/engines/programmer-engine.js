/**
 * Programmer / Bitwise Engine & Comprehensive Unit Converter (including Indian Land Measurement)
 */

export class ProgrammerEngine {
  constructor() {
    this.value = BigInt(0);
    this.wordSize = 64; // 64 (QWORD), 32 (DWORD), 16 (WORD), 8 (BYTE)
  }

  setWordSize(bits) {
    this.wordSize = bits;
    this.maskValue();
  }

  maskValue() {
    const mask = (BigInt(1) << BigInt(this.wordSize)) - BigInt(1);
    this.value = this.value & mask;
  }

  setValueFromHex(hexStr) {
    try {
      this.value = BigInt("0x" + (hexStr || "0"));
      this.maskValue();
    } catch (e) {
      this.value = BigInt(0);
    }
  }

  setValueFromDec(decStr) {
    try {
      this.value = BigInt(decStr || "0");
      this.maskValue();
    } catch (e) {
      this.value = BigInt(0);
    }
  }

  setValueFromOct(octStr) {
    try {
      this.value = BigInt("0o" + (octStr || "0"));
      this.maskValue();
    } catch (e) {
      this.value = BigInt(0);
    }
  }

  setValueFromBin(binStr) {
    try {
      this.value = BigInt("0b" + (binStr || "0"));
      this.maskValue();
    } catch (e) {
      this.value = BigInt(0);
    }
  }

  toggleBit(bitIndex) {
    if (bitIndex < 0 || bitIndex >= this.wordSize) return;
    this.value = this.value ^ (BigInt(1) << BigInt(bitIndex));
    this.maskValue();
  }

  getHex() {
    return this.value.toString(16).toUpperCase();
  }

  getDec() {
    return this.value.toString(10);
  }

  getOct() {
    return this.value.toString(8);
  }

  getBin() {
    return this.value.toString(2).padStart(this.wordSize, "0");
  }

  // Bitwise logical operations
  bitwiseAnd(other) {
    this.value = this.value & BigInt(other);
    this.maskValue();
  }

  bitwiseOr(other) {
    this.value = this.value | BigInt(other);
    this.maskValue();
  }

  bitwiseXor(other) {
    this.value = this.value ^ BigInt(other);
    this.maskValue();
  }

  bitwiseNot() {
    const mask = (BigInt(1) << BigInt(this.wordSize)) - BigInt(1);
    this.value = (~this.value) & mask;
  }

  shiftLeft(count = 1) {
    this.value = this.value << BigInt(count);
    this.maskValue();
  }

  shiftRight(count = 1) {
    this.value = this.value >> BigInt(count);
    this.maskValue();
  }
}

export class UnitConverterEngine {
  static CATEGORIES = {
    land: {
      name: "Indian Land Measurement",
      units: {
        sqft: { name: "Square Feet (Sq Ft)", factor: 1 },
        gaj: { name: "Gaj (Square Yard)", factor: 9 },
        guntha: { name: "Guntha (Gunta)", factor: 1089 },
        acre: { name: "Acre", factor: 43560 },
        bigha: { name: "Bigha (Standard Pucca)", factor: 27225 },
        bigha_kaccha: { name: "Bigha (Kaccha)", factor: 9075 },
        cent: { name: "Cent (South India)", factor: 435.6 },
        katha: { name: "Katha", factor: 720 },
        hectare: { name: "Hectare", factor: 107639 },
        sqm: { name: "Square Metre (Sq M)", factor: 10.7639 }
      }
    },
    length: {
      name: "Length",
      units: {
        m: { name: "Metres (m)", factor: 1 },
        km: { name: "Kilometres (km)", factor: 1000 },
        cm: { name: "Centimetres (cm)", factor: 0.01 },
        mm: { name: "Millimetres (mm)", factor: 0.001 },
        mi: { name: "Miles (mi)", factor: 1609.34 },
        yd: { name: "Yards (yd)", factor: 0.9144 },
        ft: { name: "Feet (ft)", factor: 0.3048 },
        in: { name: "Inches (in)", factor: 0.0254 }
      }
    },
    mass: {
      name: "Weight & Mass",
      units: {
        kg: { name: "Kilograms (kg)", factor: 1 },
        g: { name: "Grams (g)", factor: 0.001 },
        mg: { name: "Milligrams (mg)", factor: 0.000001 },
        ton: { name: "Metric Tonnes", factor: 1000 },
        lb: { name: "Pounds (lb)", factor: 0.453592 },
        oz: { name: "Ounces (oz)", factor: 0.0283495 },
        tola: { name: "Tola (India gold standard = 11.66g)", factor: 0.0116638 }
      }
    },
    temperature: {
      name: "Temperature",
      units: {
        c: { name: "Celsius (°C)" },
        f: { name: "Fahrenheit (°F)" },
        k: { name: "Kelvin (K)" }
      },
      convert: (val, from, to) => {
        let celsius = val;
        if (from === "f") celsius = (val - 32) * (5 / 9);
        else if (from === "k") celsius = val - 273.15;

        if (to === "c") return celsius;
        if (to === "f") return celsius * (9 / 5) + 32;
        if (to === "k") return celsius + 273.15;
        return val;
      }
    },
    data: {
      name: "Digital Storage",
      units: {
        b: { name: "Bytes (B)", factor: 1 },
        kb: { name: "Kilobytes (KB)", factor: 1024 },
        mb: { name: "Megabytes (MB)", factor: 1024 * 1024 },
        gb: { name: "Gigabytes (GB)", factor: 1024 * 1024 * 1024 },
        tb: { name: "Terabytes (TB)", factor: 1024 * 1024 * 1024 * 1024 }
      }
    }
  };

  static convert(categoryKey, value, fromUnit, toUnit) {
    const cat = this.CATEGORIES[categoryKey];
    if (!cat) return 0;
    if (cat.convert) {
      return cat.convert(value, fromUnit, toUnit);
    }
    const fromFactor = cat.units[fromUnit]?.factor || 1;
    const toFactor = cat.units[toUnit]?.factor || 1;
    const baseValue = value * fromFactor;
    return baseValue / toFactor;
  }
}
