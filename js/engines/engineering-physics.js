/**
 * TrueCalci Engineering & Applied Physics Engine
 * High-precision deterministic computational algorithms for engineers and scientists.
 * 
 * 1. Structural Beam Deflection & Bending Stress (Euler-Bernoulli simply supported beam)
 * 2. Kinematics & 2D Projectile Motion (Trajectory, Range, Max Height, Flight Time)
 * 3. Thermodynamics (Fourier's Conduction Law & Ideal Gas State Law PV = nRT)
 */

export class EngineeringPhysicsEngine {
  /**
   * 1. Simply Supported Beam with Point Load at Center
   * @param {Object} params
   * @param {number} params.loadNewtons - Point load P in Newtons (N)
   * @param {number} params.lengthMeters - Beam span L in meters (m)
   * @param {number} params.elasticModulusGpa - Young's Modulus E in GPa (e.g. 200 for structural steel, 69 for aluminum)
   * @param {number} params.momentOfInertiaCm4 - Area moment of inertia I in cm^4
   * @param {number} params.distanceFromNeutralAxisMm - Distance y to extreme fiber in mm
   */
  static calculateBeamBending({
    loadNewtons,
    lengthMeters,
    elasticModulusGpa = 200,
    momentOfInertiaCm4,
    distanceFromNeutralAxisMm
  }) {
    const P = Number(loadNewtons);
    const L = Number(lengthMeters);
    const E = Number(elasticModulusGpa) * 1e9; // Convert GPa to Pa (N/m^2)
    const I = Number(momentOfInertiaCm4) * 1e-8; // Convert cm^4 to m^4
    const y = Number(distanceFromNeutralAxisMm) * 1e-3; // Convert mm to m

    if (P <= 0 || L <= 0 || E <= 0 || I <= 0) {
      throw new Error("Load, length, elasticity, and moment of inertia must be positive numbers.");
    }

    // Maximum center deflection: delta_max = (P * L^3) / (48 * E * I)
    const maxDeflectionMeters = (P * Math.pow(L, 3)) / (48 * E * I);
    const maxDeflectionMm = maxDeflectionMeters * 1000;

    // Maximum bending moment at center: M_max = (P * L) / 4
    const maxBendingMomentNm = (P * L) / 4;

    // Maximum bending stress: sigma_max = (M * y) / I
    const maxBendingStressPa = (maxBendingMomentNm * y) / I;
    const maxBendingStressMpa = maxBendingStressPa / 1e6;

    return {
      loadNewtons: P,
      lengthMeters: L,
      maxDeflectionMm: Number(maxDeflectionMm.toFixed(4)),
      maxBendingMomentNm: Number(maxBendingMomentNm.toFixed(2)),
      maxBendingStressMpa: Number(maxBendingStressMpa.toFixed(2)),
      formula: "δ_max = (P·L³)/(48·E·I), σ_max = (M·y)/I"
    };
  }

  /**
   * 2. 2D Projectile Motion (Ignoring Air Resistance)
   * @param {Object} params
   * @param {number} params.initialVelocityMs - Launch speed v0 in m/s
   * @param {number} params.launchAngleDegrees - Launch angle theta in degrees (0 to 90)
   * @param {number} [params.gravityMs2=9.80665] - Gravitational acceleration (default Earth g = 9.80665 m/s^2)
   */
  static calculateProjectileMotion({
    initialVelocityMs,
    launchAngleDegrees,
    gravityMs2 = 9.80665
  }) {
    const v0 = Number(initialVelocityMs);
    const angleDeg = Number(launchAngleDegrees);
    const g = Number(gravityMs2);

    if (v0 < 0 || angleDeg < 0 || angleDeg > 90 || g <= 0) {
      throw new Error("Velocity must be non-negative, angle must be 0-90°, and gravity must be positive.");
    }

    const rad = (angleDeg * Math.PI) / 180;
    const vx = v0 * Math.cos(rad);
    const vy = v0 * Math.sin(rad);

    // Total time of flight: T = (2 * v0 * sin(theta)) / g
    const flightTimeSeconds = (2 * vy) / g;

    // Maximum height: H = (v0^2 * sin^2(theta)) / (2 * g)
    const maxHeightMeters = Math.pow(vy, 2) / (2 * g);

    // Horizontal range: R = (v0^2 * sin(2 * theta)) / g
    const horizontalRangeMeters = (Math.pow(v0, 2) * Math.sin(2 * rad)) / g;

    return {
      initialVelocityMs: v0,
      launchAngleDegrees: angleDeg,
      vxInitialMs: Number(vx.toFixed(2)),
      vyInitialMs: Number(vy.toFixed(2)),
      flightTimeSeconds: Number(flightTimeSeconds.toFixed(3)),
      maxHeightMeters: Number(maxHeightMeters.toFixed(3)),
      horizontalRangeMeters: Number(horizontalRangeMeters.toFixed(3)),
      formula: "R = (v₀²·sin(2θ))/g, H = (v₀²·sin²(θ))/(2g), T = (2v₀·sin(θ))/g"
    };
  }

  /**
   * 3. Thermodynamics: Ideal Gas State (PV = nRT) & Fourier Conduction
   * @param {Object} params
   * @param {number} [params.pressureKpa] - Pressure in kPa
   * @param {number} [params.volumeM3] - Volume in m^3
   * @param {number} [params.moles] - Amount of gas n in moles
   * @param {number} [params.temperatureKelvin] - Temperature in Kelvin (K)
   */
  static calculateIdealGas({ pressureKpa, volumeM3, moles, temperatureKelvin }) {
    const R = 8.314462618; // Universal gas constant in J/(mol·K) or (kPa·L)/(mol·K) -> (Pa·m^3)/(mol·K)

    // Solve for the single missing variable
    if (pressureKpa === undefined && volumeM3 && moles && temperatureKelvin) {
      const P_Pa = (moles * R * temperatureKelvin) / volumeM3;
      return { solvedVariable: "pressureKpa", value: Number((P_Pa / 1000).toFixed(3)) };
    }
    if (volumeM3 === undefined && pressureKpa && moles && temperatureKelvin) {
      const V = (moles * R * temperatureKelvin) / (pressureKpa * 1000);
      return { solvedVariable: "volumeM3", value: Number(V.toFixed(5)) };
    }
    if (temperatureKelvin === undefined && pressureKpa && volumeM3 && moles) {
      const T = (pressureKpa * 1000 * volumeM3) / (moles * R);
      return { solvedVariable: "temperatureKelvin", value: Number(T.toFixed(2)) };
    }
    if (moles === undefined && pressureKpa && volumeM3 && temperatureKelvin) {
      const n = (pressureKpa * 1000 * volumeM3) / (R * temperatureKelvin);
      return { solvedVariable: "moles", value: Number(n.toFixed(4)) };
    }

    throw new Error("Provide exactly 3 of the 4 variables (pressureKpa, volumeM3, moles, temperatureKelvin).");
  }

  /**
   * 4. Fluid Dynamics: Darcy-Weisbach Pipe Flow & Pressure Drop
   * Calculates Reynolds number, friction factor (Swamee-Jain / Hagen-Poiseuille), head loss, and pressure drop.
   * @param {Object} params
   * @param {number} params.flowRateM3s - Volumetric flow rate Q in m^3/s
   * @param {number} params.pipeDiameterM - Internal pipe diameter D in meters
   * @param {number} params.pipeLengthM - Total pipe run length L in meters
   * @param {number} [params.fluidDensityKgM3=1000] - Fluid density rho (default: water 1000 kg/m^3)
   * @param {number} [params.dynamicViscosityPaS=0.001] - Dynamic viscosity mu in Pa·s (default: water 0.001 Pa·s)
   * @param {number} [params.pipeRoughnessM=0.000045] - Absolute surface roughness epsilon in meters (default: commercial steel 0.045 mm)
   */
  static calculatePipeFlow({
    flowRateM3s,
    pipeDiameterM,
    pipeLengthM,
    fluidDensityKgM3 = 1000,
    dynamicViscosityPaS = 0.001,
    pipeRoughnessM = 0.000045
  }) {
    const Q = Number(flowRateM3s);
    const D = Number(pipeDiameterM);
    const L = Number(pipeLengthM);
    const rho = Number(fluidDensityKgM3);
    const mu = Number(dynamicViscosityPaS);
    const eps = Number(pipeRoughnessM);
    const g = 9.80665;

    if (Q <= 0 || D <= 0 || L <= 0 || rho <= 0 || mu <= 0 || eps < 0) {
      throw new Error("Flow rate, diameter, length, density, and viscosity must be positive numbers.");
    }

    // Cross-sectional area: A = pi * D^2 / 4
    const area = (Math.PI * Math.pow(D, 2)) / 4;
    // Mean flow velocity: v = Q / A
    const velocity = Q / area;

    // Reynolds number: Re = (rho * v * D) / mu
    const reynoldsNumber = (rho * velocity * D) / mu;

    // Darcy friction factor f
    let frictionFactor;
    let flowRegime;
    if (reynoldsNumber < 2300) {
      flowRegime = "Laminar";
      frictionFactor = 64 / reynoldsNumber;
    } else if (reynoldsNumber <= 4000) {
      flowRegime = "Transitional";
      // Interpolated approximation in transitional zone
      const fLaminar = 64 / 2300;
      const fTurbulent = 0.25 / Math.pow(Math.log10((eps / (3.7 * D)) + (5.74 / Math.pow(4000, 0.9))), 2);
      const factor = (reynoldsNumber - 2300) / 1700;
      frictionFactor = fLaminar + factor * (fTurbulent - fLaminar);
    } else {
      flowRegime = "Turbulent";
      // Swamee-Jain explicit approximation of the Colebrook-White equation
      const relativeRoughness = eps / (3.7 * D);
      const term2 = 5.74 / Math.pow(reynoldsNumber, 0.9);
      frictionFactor = 0.25 / Math.pow(Math.log10(relativeRoughness + term2), 2);
    }

    // Darcy-Weisbach head loss: h_f = f * (L / D) * (v^2 / (2 * g))
    const headLossMeters = frictionFactor * (L / D) * (Math.pow(velocity, 2) / (2 * g));

    // Pressure drop: Delta_P = rho * g * h_f (in Pascals and kPa)
    const pressureDropPa = rho * g * headLossMeters;
    const pressureDropKpa = pressureDropPa / 1000;

    return {
      flowRateM3s: Q,
      pipeDiameterM: D,
      pipeLengthM: L,
      flowVelocityMs: Number(velocity.toFixed(3)),
      reynoldsNumber: Math.round(reynoldsNumber),
      flowRegime,
      frictionFactor: Number(frictionFactor.toFixed(5)),
      headLossMeters: Number(headLossMeters.toFixed(3)),
      pressureDropKpa: Number(pressureDropKpa.toFixed(3)),
      formula: "Re = (ρ·v·D)/μ, h_f = f·(L/D)·(v²/(2g)), ΔP = ρ·g·h_f"
    };
  }

  /**
   * 5. Electrical Engineering: Resonant RLC Circuit & AC Impedance
   * @param {Object} params
   * @param {number} params.resistanceOhms - Resistance R in Ohms (Ω)
   * @param {number} params.inductanceHenrys - Inductance L in Henrys (H)
   * @param {number} params.capacitanceFarads - Capacitance C in Farads (F)
   * @param {number} [params.frequencyHz] - Operating AC frequency f in Hz (optional, defaults to resonance)
   */
  static calculateRlcCircuit({
    resistanceOhms,
    inductanceHenrys,
    capacitanceFarads,
    frequencyHz
  }) {
    const R = Number(resistanceOhms);
    const L = Number(inductanceHenrys);
    const C = Number(capacitanceFarads);

    if (R <= 0 || L <= 0 || C <= 0) {
      throw new Error("Resistance, inductance, and capacitance must be strictly positive.");
    }

    // Resonant angular frequency: omega_0 = 1 / sqrt(L * C)
    const omega0 = 1 / Math.sqrt(L * C);
    // Resonant frequency in Hz: f_0 = omega_0 / (2 * pi)
    const resonantFreqHz = omega0 / (2 * Math.PI);

    // Quality Factor Q = (1 / R) * sqrt(L / C)
    const qualityFactor = (1 / R) * Math.sqrt(L / C);
    // Bandwidth BW = f_0 / Q
    const bandwidthHz = resonantFreqHz / qualityFactor;

    // Operating frequency (default to resonance if not provided)
    const f = frequencyHz !== undefined && Number(frequencyHz) > 0 ? Number(frequencyHz) : resonantFreqHz;
    const omega = 2 * Math.PI * f;

    // Reactances
    const inductiveReactanceXl = omega * L;
    const capacitiveReactanceXc = 1 / (omega * C);
    const netReactanceX = inductiveReactanceXl - capacitiveReactanceXc;

    // Total Impedance magnitude |Z| = sqrt(R^2 + (X_L - X_C)^2)
    const impedanceMagnitudeOhms = Math.sqrt(Math.pow(R, 2) + Math.pow(netReactanceX, 2));

    // Phase angle phi = arctan((X_L - X_C) / R) in degrees
    const phaseAngleRad = Math.atan2(netReactanceX, R);
    const phaseAngleDeg = (phaseAngleRad * 180) / Math.PI;

    return {
      resonantFrequencyHz: Number(resonantFreqHz.toFixed(2)),
      qualityFactor: Number(qualityFactor.toFixed(3)),
      bandwidthHz: Number(bandwidthHz.toFixed(2)),
      operatingFrequencyHz: Number(f.toFixed(2)),
      inductiveReactanceXlOhms: Number(inductiveReactanceXl.toFixed(2)),
      capacitiveReactanceXcOhms: Number(capacitiveReactanceXc.toFixed(2)),
      impedanceMagnitudeOhms: Number(impedanceMagnitudeOhms.toFixed(2)),
      phaseAngleDeg: Number(phaseAngleDeg.toFixed(2)),
      formula: "f₀ = 1/(2π√LC), Q = (1/R)·√(L/C), |Z| = √(R² + (X_L - X_C)²)"
    };
  }

  /**
   * 6. Aerospace & Orbital Mechanics: Tsiolkovsky Rocket Equation & Delta-v
   * @param {Object} params
   * @param {number} params.initialMassKg - Wet launch mass m0 in kg
   * @param {number} params.finalMassKg - Dry burnout mass mf in kg
   * @param {number} params.specificImpulseSeconds - Engine Isp in seconds (e.g. 311s for Merlin 1D, 450s for RS-25 hydrolox)
   * @param {number} [params.gravityMs2=9.80665] - Standard gravity g0 (default 9.80665 m/s^2)
   */
  static calculateRocketDeltaV({
    initialMassKg,
    finalMassKg,
    specificImpulseSeconds,
    gravityMs2 = 9.80665
  }) {
    const m0 = Number(initialMassKg);
    const mf = Number(finalMassKg);
    const isp = Number(specificImpulseSeconds);
    const g0 = Number(gravityMs2);

    if (m0 <= 0 || mf <= 0 || isp <= 0 || g0 <= 0) {
      throw new Error("Initial mass, final mass, specific impulse, and gravity must be positive.");
    }
    if (m0 <= mf) {
      throw new Error("Initial mass (wet mass) must be strictly greater than final mass (dry mass).");
    }

    // Mass ratio: MR = m0 / mf
    const massRatio = m0 / mf;
    // Effective exhaust velocity: ve = Isp * g0
    const effectiveExhaustVelocityMs = isp * g0;
    // Total Delta-v: Delta_v = ve * ln(m0 / mf)
    const deltaVMs = effectiveExhaustVelocityMs * Math.log(massRatio);
    const deltaVKms = deltaVMs / 1000;

    // Propellant mass and mass fraction
    const propellantMassKg = m0 - mf;
    const propellantMassFraction = propellantMassKg / m0;

    return {
      initialMassKg: m0,
      finalMassKg: mf,
      propellantMassKg,
      propellantMassFraction: Number(propellantMassFraction.toFixed(4)),
      massRatio: Number(massRatio.toFixed(3)),
      effectiveExhaustVelocityMs: Number(effectiveExhaustVelocityMs.toFixed(1)),
      deltaVMs: Number(deltaVMs.toFixed(2)),
      deltaVKms: Number(deltaVKms.toFixed(3)),
      formula: "Δv = I_sp·g₀·ln(m₀/m_f), v_e = I_sp·g₀"
    };
  }
}

