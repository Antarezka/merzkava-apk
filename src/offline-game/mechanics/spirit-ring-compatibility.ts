/**
 * Spirit Ring compatibility and absorption formulas.
 * Canon: core/SPIRIT_RING_RULES.md at 2f76a864150528afb0e3d26cb16f9396ce610ff6
 * Upstream blob: 72666ef29bd5df41364f4727596747606fe581cf
 */

export const SPIRIT_REALM_RANK = {
  "Spirit Initiate": 1, "Spirit Adept": 2, "Spirit Elder": 3,
  "Spirit Monarch": 4, "Spirit King": 5, "Spirit Ancestor": 6,
  "Spirit Emperor": 7, "Spirit Sovereign": 8, "Spirit Primordial": 9
} as const;

export type SpiritRealmName = keyof typeof SPIRIT_REALM_RANK;
export type EagLevel = 0 | 1 | 2 | 3;

const TOLERANCE: Record<SpiritRealmName, number> = {
  "Spirit Initiate": 30.99, "Spirit Adept": 32.99, "Spirit Elder": 34.99,
  "Spirit Monarch": 36.99, "Spirit King": 38.99, "Spirit Ancestor": 40.99,
  "Spirit Emperor": 50.99, "Spirit Sovereign": 52.99, "Spirit Primordial": 54.99
};

export interface AgePressure {
  beastPressure: number;
  realmTolerance: number;
  excessPressure: number;
  eag: EagLevel;
  effectiveEag: number;
}

export function calculateAgePressure(ageYears: number, realm: string): AgePressure | null {
  if (!Number.isFinite(ageYears) || ageYears < 0 ||
      !Object.prototype.hasOwnProperty.call(TOLERANCE, realm)) return null;
  const beastPressure = 10 * Math.log10(1 + ageYears / 10);
  const realmTolerance = TOLERANCE[realm as SpiritRealmName];
  const excessPressure = Math.max(0, beastPressure - realmTolerance);
  const eag: EagLevel = excessPressure === 0 ? 0 :
    excessPressure <= 6 ? 1 : excessPressure <= 12 ? 2 : 3;
  return { beastPressure, realmTolerance, excessPressure, eag, effectiveEag: excessPressure / 6 };
}

export interface AbsorptionFormulaInput {
  beastAgeYears: number;
  spiritRealm: SpiritRealmName;
  aggression: number;
  recipientReadiness: number;
  resonanceCorrection: number;
  voluntarySurrender: 0 | 1;
  allEligibilityGatesPassed: boolean;
}

export interface AbsorptionFormulaResult {
  agePressure: AgePressure;
  rawSyncCap: number;
  syncCap: number;
  successChancePercent: number;
  defectChanceIfFailedPercent: number | null;
  overallPermanentDefectChancePercent: number | null;
  eligible: boolean;
}

export function calculateAbsorptionFormulas(
  input: AbsorptionFormulaInput
): AbsorptionFormulaResult | null {
  const { aggression: g, recipientReadiness: p, resonanceCorrection: f, voluntarySurrender: v } = input;
  if (!Number.isFinite(g) || g < 0 || g > 5 ||
      !Number.isFinite(p) || p < 0 || p > 100 ||
      !Number.isFinite(f) || f < -15 || f > 15 ||
      (v !== 0 && v !== 1)) return null;

  const agePressure = calculateAgePressure(input.beastAgeYears, input.spiritRealm);
  if (!agePressure) return null;
  const { excessPressure: x, eag, effectiveEag } = agePressure;

  const rawSyncCap = clamp(100 - 25 * effectiveEag - 3 * g - 0.5 * x +
    0.10 * (p - 50) + f + 20 * v, 0, 100);
  const cappedSync = eag === 2 ? Math.min(rawSyncCap, 20) : rawSyncCap;
  const syncCap = Math.floor(cappedSync + 0.5);

  if (!input.allEligibilityGatesPassed) {
    return {
      agePressure, rawSyncCap, syncCap, successChancePercent: 0,
      defectChanceIfFailedPercent: null,
      overallPermanentDefectChancePercent: null, eligible: false
    };
  }

  const successChancePercent = clamp(
    95 - 15 * effectiveEag - 5 * g + 0.15 * (p - 50) + f + 10 * v, 5, 95
  );
  const defectChanceIfFailedPercent = clamp(
    5 + 10 * effectiveEag + 5 * g + 0.5 * x - 0.3 * p, 1, 95
  );
  const overallPermanentDefectChancePercent =
    ((100 - successChancePercent) / 100) * defectChanceIfFailedPercent;

  return {
    agePressure, rawSyncCap, syncCap, successChancePercent,
    defectChanceIfFailedPercent, overallPermanentDefectChancePercent, eligible: true
  };
}

export function calculateAnomalousWorldRejection(
  ageYears: number,
  aggression: number,
  eag: EagLevel,
  excessPressure: number,
  conversionProcessStarted: boolean
): number | null {
  if (!Number.isFinite(ageYears) || ageYears < 0 ||
      !Number.isFinite(aggression) || aggression < 0 || aggression > 5 ||
      !Number.isFinite(excessPressure) || excessPressure < 0) return null;
  if (!conversionProcessStarted || ageYears <= 7_000_000) return 0;
  const q = (ageYears - 7_000_000) / 1_000_000;
  const rejectionLevel = excessPressure > 18 ? 4 : eag;
  return Math.min(75, q * (15 + 3 * aggression + 3 * rejectionLevel));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
