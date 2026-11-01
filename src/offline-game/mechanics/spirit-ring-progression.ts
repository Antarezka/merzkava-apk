/**
 * Spirit Ring ownership stats, forced-absorption damage, and eligibility gates.
 * Canon: core/SPIRIT_RING_RULES.md at 2f76a864150528afb0e3d26cb16f9396ce610ff6
 * Upstream blob: 72666ef29bd5df41364f4727596747606fe581cf
 */

export interface RingPowerScaleResult {
  compatibilityTotal: number;
  ageTotalYears: number;
  powerScale: number;
}

export function calculateRingPowerScale(
  ringAgesYears: number[],
  ringCompatibilityCaps: number[]
): RingPowerScaleResult | null {
  if (ringAgesYears.length < 1 || ringAgesYears.length > 9 ||
      ringAgesYears.length !== ringCompatibilityCaps.length) return null;
  if (ringAgesYears.some(x => !Number.isFinite(x) || x < 0)) return null;
  if (ringCompatibilityCaps.some(x => !Number.isFinite(x) || x < 0 || x > 100)) return null;

  const ageTotalYears = ringAgesYears.reduce((sum, value) => sum + value, 0);
  const compatibilityTotal = ringCompatibilityCaps.some(x => x === 0)
    ? 0
    : Math.pow(ringCompatibilityCaps.reduce((product, value) => product * value, 1), 1 / ringCompatibilityCaps.length);
  return {
    compatibilityTotal,
    ageTotalYears,
    powerScale: ageTotalYears * (0.5 + 0.5 * compatibilityTotal / 100)
  };
}

export function calculateBaseQi(ringCount: number): number | null {
  if (!Number.isInteger(ringCount) || ringCount < 1 || ringCount > 9) return null;
  return Math.round(100 * Math.pow(452341, (ringCount - 1) / 8));
}

export function getQiState(
  ringCount: number,
  martialSoulAwakened: boolean
): number | "NOT_FORMED" | null {
  if (!Number.isInteger(ringCount) || ringCount < 0 || ringCount > 9) return null;
  if (ringCount === 0) return martialSoulAwakened ? "NOT_FORMED" : 0;
  return calculateBaseQi(ringCount);
}

export type ForcedAbsorptionRisk =
  | "NONE" | "VERY_LOW" | "LOW" | "MEDIUM_LOW"
  | "MEDIUM_HIGH" | "HIGH" | "VERY_HIGH";

export interface ForcedAbsorptionDamageResult {
  baseHpLoss: number;
  appliedMultiplier: number;
  modifiedHpLoss: number;
  actualHpLoss: number;
  hpAfter: number;
  risk: ForcedAbsorptionRisk;
}

export function getForcedAbsorptionMultiplier(
  gapPoints: number,
  minimumIntervalMet: boolean,
  explicitlyForced: boolean
): number | null {
  if (!Number.isFinite(gapPoints) || gapPoints < 0) return null;
  if (gapPoints >= 10) return explicitlyForced ? 2 : null;
  if (!minimumIntervalMet) return 1.5;
  if (gapPoints <= 2) return 1;
  if (gapPoints <= 5) return 1.25;
  return 1.5;
}

export function getForcedAbsorptionRisk(actualHpLoss: number): ForcedAbsorptionRisk {
  if (!Number.isInteger(actualHpLoss) || actualHpLoss <= 0) return "NONE";
  if (actualHpLoss <= 4) return "VERY_LOW";
  if (actualHpLoss <= 9) return "LOW";
  if (actualHpLoss <= 19) return "MEDIUM_LOW";
  if (actualHpLoss <= 29) return "MEDIUM_HIGH";
  if (actualHpLoss <= 39) return "HIGH";
  return "VERY_HIGH";
}

export function calculateForcedAbsorptionDamage(input: {
  maximumHp: number;
  currentHp: number;
  ringNumber: number;
  deviationPercent: number;
  gapPoints: number;
  minimumIntervalMet: boolean;
  explicitlyForced: boolean;
}): ForcedAbsorptionDamageResult | null {
  if (!Number.isInteger(input.maximumHp) || input.maximumHp <= 0 ||
      !Number.isInteger(input.currentHp) || input.currentHp < 0 ||
      input.currentHp > input.maximumHp) return null;
  if (!Number.isInteger(input.ringNumber) || input.ringNumber < 1 || input.ringNumber > 9) return null;
  if (!Number.isFinite(input.deviationPercent) || input.deviationPercent < 1 || input.deviationPercent > 100) return null;

  const multiplier = getForcedAbsorptionMultiplier(
    input.gapPoints, input.minimumIntervalMet, input.explicitlyForced
  );
  if (multiplier === null) return null;

  const ringFactor = 1 + ((input.ringNumber - 1) / 8);
  const baseHpLoss = Math.floor(
    input.maximumHp * 0.30 * (input.deviationPercent / 100) * ringFactor + 0.5
  );
  const modifiedHpLoss = Math.floor(baseHpLoss * multiplier + 0.5);
  const actualHpLoss = Math.min(input.currentHp, modifiedHpLoss);

  return {
    baseHpLoss, appliedMultiplier: multiplier, modifiedHpLoss, actualHpLoss,
    hpAfter: input.currentHp - actualHpLoss,
    risk: getForcedAbsorptionRisk(actualHpLoss)
  };
}

export interface AbsorptionGateInput {
  ringNumber: number;
  martialSoulAwakened: boolean;
  ringAvailableAndLegallyObtained: boolean;
  requiredItemAvailable: boolean;
  bodyConditionSuitable: boolean;
  otherRequirementsMet: boolean;
  gapPoints: number;
  dayLeft: number;
  minimumIntervalMet: boolean;
}

export function evaluateAbsorptionEligibility(
  input: AbsorptionGateInput
): { eligible: boolean; reason: string } {
  if (!Number.isInteger(input.ringNumber) || input.ringNumber < 1 || input.ringNumber > 9) {
    return { eligible: false, reason: "NO_SUCH_RING_SLOT_OR_RING_TEN_FORBIDDEN." };
  }
  if (!input.martialSoulAwakened) return { eligible: false, reason: "MARTIAL_SOUL_AWAKENING_REQUIRED." };
  if (!input.ringAvailableAndLegallyObtained) return { eligible: false, reason: "RING_NOT_AVAILABLE_OR_NOT_LAWFULLY_OBTAINED." };
  if (!input.requiredItemAvailable) return { eligible: false, reason: "REQUIRED_ITEM_MISSING." };
  if (!input.bodyConditionSuitable) return { eligible: false, reason: "BODY_CONDITION_NOT_SUITABLE." };
  if (!input.otherRequirementsMet) return { eligible: false, reason: "OTHER_OFFICIAL_REQUIREMENTS_NOT_MET." };

  if (input.ringNumber === 1) {
    return { eligible: true, reason: "FIRST_RING_REQUIRES_AWAKENING_AND_VALID_RING; NO_COOLDOWN_OR_BREAKTHROUGH_GATE." };
  }
  if (!Number.isFinite(input.gapPoints) || input.gapPoints < 0 || input.gapPoints >= 10) {
    return { eligible: false, reason: "SYNC_GAP_MUST_BE_LESS_THAN_TEN_POINTS." };
  }
  if (!Number.isInteger(input.dayLeft) || input.dayLeft !== 0 || !input.minimumIntervalMet) {
    return { eligible: false, reason: "MINIMUM_INTERVAL_AND_DAY_LEFT_ZERO_REQUIRED." };
  }
  return { eligible: true, reason: "ALL_DECLARED_ABSORPTION_GATES_PASSED." };
}
