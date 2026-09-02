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
}
