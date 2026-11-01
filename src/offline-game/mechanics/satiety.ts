/**
 * Offline-game Satiety/metabolism interval rules.
 *
 * Source: Antarezka/merzkava-universe/core/HUNGER_AND_METABOLISM.md
 * Upstream commit: 2f76a864150528afb0e3d26cb16f9396ce610ff6
 * Upstream blob: 66bdc7d4fe4d5270cf3c40193909aca582ac1dde
 *
 * This module resolves one awake-time segment. Call once per segment when
 * activity, fatigue, missed-meal factor, or biological modifier changes.
 * Protected night sleep must be excluded from awakeHours by the caller.
 * Calendar windows, meal-opportunity tracking, and sleep transitions are
 * intentionally outside this pure calculator.
 */

export const SATIETY_BASE_HOURS_PER_100 = {
  Mortal: 24,
  "Spirit Initiate": 48,
  "Spirit Adept": 96,
  "Spirit Elder": 192,
  "Spirit Monarch": 384,
  "Spirit King": 768,
  "Spirit Ancestor": 1536,
  "Spirit Emperor": 3072,
  "Spirit Sovereign": 6144,
  "Spirit Primordial": 8760
} as const;

export type SatietyRealm = keyof typeof SATIETY_BASE_HOURS_PER_100;
export type SatietyActivity = "AWAKE_REST" | "LIGHT" | "MODERATE" | "HEAVY" | "SURVIVAL";
export type SatietyBodyCondition = "NORMAL_OR_MILD" | "FATIGUED" | "HEAVILY_FATIGUED" | "EXTREMELY_FATIGUED";
export type SatietyPortion = "SMALL" | "STANDARD" | "LARGE";

export interface SatietyIntervalInput {
  satiety: number;
  realm: SatietyRealm;
  awakeHours: number;
  activity: SatietyActivity;
  missedMealWindows?: number;
  bodyCondition?: SatietyBodyCondition;
  biologicalMultiplier?: number;
}

export interface SatietyIntervalResult {
  satietyBefore: number;
  satietyAfter: number;
  baseDrain: number;
  activityMultiplier: number;
  missedMealMultiplier: number;
  bodyConditionMultiplier: number;
  biologicalMultiplier: number;
  rawCombinedMultiplier: number;
  appliedCombinedMultiplier: number;
  requestedDrain: number;
  actualDrain: number;
  displayedBefore: number;
  displayedAfter: number;
  displayedDrain: number;
  warnings: string[];
}

export type SatietyCalculation =
  | { valid: true; result: SatietyIntervalResult }
  | { valid: false; error: "INVALID_SATIETY" | "INVALID_AWAKE_HOURS" | "INVALID_MISSED_MEAL_COUNT" | "INVALID_BIOLOGICAL_MULTIPLIER" };

const ACTIVITY_MULTIPLIER: Record<SatietyActivity, number> = {
  AWAKE_REST: 0.5,
  LIGHT: 1.25,
  MODERATE: 1.75,
  HEAVY: 2.5,
  SURVIVAL: 4
};

const BODY_CONDITION_MULTIPLIER: Record<SatietyBodyCondition, number> = {
  NORMAL_OR_MILD: 1,
  FATIGUED: 1.25,
  HEAVILY_FATIGUED: 1.75,
  EXTREMELY_FATIGUED: 2.5
};

export function getMissedMealMultiplier(consecutiveMissedWindows: number): number | null {
  if (!Number.isInteger(consecutiveMissedWindows) || consecutiveMissedWindows < 0) return null;
  if (consecutiveMissedWindows === 0) return 1;
  if (consecutiveMissedWindows === 1) return 1.75;
  if (consecutiveMissedWindows === 2) return 2.75;
  return 4;
}

export function calculateSatietyInterval(input: SatietyIntervalInput): SatietyCalculation {
  if (!Number.isFinite(input.satiety) || input.satiety < 0 || input.satiety > 100) {
    return { valid: false, error: "INVALID_SATIETY" };
  }
  if (!Number.isFinite(input.awakeHours) || input.awakeHours < 0) {
    return { valid: false, error: "INVALID_AWAKE_HOURS" };
  }

  const missedMealMultiplier = getMissedMealMultiplier(input.missedMealWindows ?? 0);
  if (missedMealMultiplier === null) {
    return { valid: false, error: "INVALID_MISSED_MEAL_COUNT" };
  }

  const biologicalMultiplier = input.biologicalMultiplier ?? 1;
  if (!Number.isFinite(biologicalMultiplier) || biologicalMultiplier < 0) {
    return { valid: false, error: "INVALID_BIOLOGICAL_MULTIPLIER" };
  }

  const activityMultiplier = ACTIVITY_MULTIPLIER[input.activity];
  const bodyConditionMultiplier = BODY_CONDITION_MULTIPLIER[input.bodyCondition ?? "NORMAL_OR_MILD"];
  if (activityMultiplier === undefined || bodyConditionMultiplier === undefined) {
    return { valid: false, error: "INVALID_BIOLOGICAL_MULTIPLIER" };
  }

  const baseHours = SATIETY_BASE_HOURS_PER_100[input.realm];
  const baseDrain = input.awakeHours / baseHours * 100;
  const rawCombinedMultiplier =
    activityMultiplier * missedMealMultiplier * bodyConditionMultiplier * biologicalMultiplier;
  const appliedCombinedMultiplier = Math.min(rawCombinedMultiplier, 8);
  const requestedDrain = baseDrain * appliedCombinedMultiplier;
  const actualDrain = Math.min(input.satiety, requestedDrain);
  const satietyAfter = Math.max(0, input.satiety - actualDrain);
  const warnings: string[] = [];

  // The official source's Spirit Primordial example (24 awake hours, Light)
  // states approximately 0.014 Satiety, but its own 365-day base and formula
  // yield approximately 0.342466. Keep the formula/table calculation and
  // surface the source inconsistency; do not silently rewrite either source.
  if (input.realm === "Spirit Primordial") {
    warnings.push("SOURCE_EXAMPLE_CONFLICT: Spirit Primordial's published 24-hour Light example does not match the stated 365-day base-time formula.");
  }

  return {
    satietyBefore: input.satiety,
    satietyAfter,
    baseDrain,
    activityMultiplier,
    missedMealMultiplier,
    bodyConditionMultiplier,
    biologicalMultiplier,
    rawCombinedMultiplier,
    appliedCombinedMultiplier,
    requestedDrain,
    actualDrain,
    displayedBefore: displaySatiety(input.satiety),
    displayedAfter: displaySatiety(satietyAfter),
    displayedDrain: displaySatiety(actualDrain),
    warnings
  };
}

export function getPortionSatietyGain(portion: SatietyPortion): number {
  switch (portion) {
    case "SMALL": return 10;
    case "STANDARD": return 34;
    case "LARGE": return 50;
  }
}

/**
 * Apply an already verified, explicit Satiety effect from a consumed item.
 * This function does not decide whether an item is edible or identify Unknown items.
 */
export function applySatietyIntake(
  currentSatiety: number,
  verifiedSatietyGain: number
): { valid: true; before: number; after: number; actualGain: number } |
   { valid: false; error: "INVALID_SATIETY" | "INVALID_SATIETY_GAIN" } {
  if (!Number.isFinite(currentSatiety) || currentSatiety < 0 || currentSatiety > 100) {
    return { valid: false, error: "INVALID_SATIETY" };
  }
  if (!Number.isFinite(verifiedSatietyGain) || verifiedSatietyGain < 0) {
    return { valid: false, error: "INVALID_SATIETY_GAIN" };
  }
  const after = Math.min(100, currentSatiety + verifiedSatietyGain);
  return { valid: true, before: currentSatiety, after, actualGain: after - currentSatiety };
}

export function displaySatiety(value: number): number {
  return Math.round(value * 10) / 10;
}
