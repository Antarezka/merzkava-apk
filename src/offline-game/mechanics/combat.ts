/**
 * Offline-game deterministic combat formula helpers.
 *
 * Source: Antarezka/merzkava-universe/gameplay/COMBAT_SYSTEM.md
 * Upstream commit: 2f76a864150528afb0e3d26cb16f9396ce610ff6
 * Upstream blob: bc7d85a0e3521c30716b1859f5fdf070417d684c
 *
 * PowerScale itself is sourced from core/SPIRIT_RING_RULES.md and supplied
 * by the caller. This module does not invent abilities, tactical advantages,
 * artifacts, defense, injury diagnoses, or missing character statistics.
 */

export type ReadinessFactor = 0.8 | 0.9 | 1.0 | 1.1 | 1.2;
export type BaseDamagePercent = 5 | 8 | 12 | 18;
export type DefenseReductionPercent = 0 | 10 | 25 | 40 | 50;

export interface CombatRatingInput {
  powerScale: number;
  readinessFactor: ReadinessFactor;
  relevantArtifactFactor?: number;
}

export type CombatRatingResult =
  | { valid: true; combatRating: number }
  | { valid: false; error: "INVALID_POWERSCALE" | "INVALID_READINESS_FACTOR" | "INVALID_ARTIFACT_FACTOR" };

export interface HitResolution {
  ratio: number;
  hitChancePercent: number;
  roll: number;
  hit: boolean;
}

export type HitResult =
  | { valid: true; result: HitResolution }
  | { valid: false; error: "INVALID_COMBAT_RATING" | "INVALID_D100_ROLL" };

export interface DamageInput {
  targetMaximumHp: number;
  targetCurrentHp: number;
  baseDamagePercent: number;
  combatRatio: number;
  defenseReductionPercent: DefenseReductionPercent;
  highOutputTechniqueConfirmed?: boolean;
  isComboFollowup?: boolean;
}

export interface DamageResolution {
  baseDamagePercent: number;
  powerAdjustment: number;
  defenseReductionPercent: number;
  rawDamage: number;
  roundedDamage: number;
  actualHpLoss: number;
  targetHpAfter: number;
}

export type DamageResult =
  | { valid: true; result: DamageResolution }
  | { valid: false; error: "INVALID_TARGET_HP" | "INVALID_COMBAT_RATIO" | "INVALID_BASE_DAMAGE" | "HIGH_OUTPUT_NOT_CONFIRMED" | "INVALID_DEFENSE" };

export function calculateCombatRating(input: CombatRatingInput): CombatRatingResult {
  if (!Number.isFinite(input.powerScale) || input.powerScale <= 0) {
    return { valid: false, error: "INVALID_POWERSCALE" };
  }
  if (![0.8, 0.9, 1.0, 1.1, 1.2].includes(input.readinessFactor)) {
    return { valid: false, error: "INVALID_READINESS_FACTOR" };
  }
  const artifactFactor = input.relevantArtifactFactor ?? 1;
  if (!Number.isFinite(artifactFactor) || artifactFactor <= 0) {
    return { valid: false, error: "INVALID_ARTIFACT_FACTOR" };
  }
  return {
    valid: true,
    combatRating: input.powerScale * input.readinessFactor * artifactFactor
  };
}

export function calculateCombatRatio(
  attackerCombatRating: number,
  defenderCombatRating: number
): number | null {
  if (!Number.isFinite(attackerCombatRating) || attackerCombatRating <= 0) return null;
  if (!Number.isFinite(defenderCombatRating) || defenderCombatRating <= 0) return null;
  return attackerCombatRating / defenderCombatRating;
}

export function calculateHitChance(combatRatio: number): number | null {
  if (!Number.isFinite(combatRatio) || combatRatio <= 0) return null;
  return Math.min(90, Math.max(10, 50 + 25 * (combatRatio - 1)));
}

export function resolveD100Hit(combatRatio: number, roll: number): HitResult {
  if (!Number.isInteger(roll) || roll < 1 || roll > 100) {
    return { valid: false, error: "INVALID_D100_ROLL" };
  }
  const hitChancePercent = calculateHitChance(combatRatio);
  if (hitChancePercent === null) return { valid: false, error: "INVALID_COMBAT_RATING" };
  return {
    valid: true,
    result: {
      ratio: combatRatio,
      hitChancePercent,
      roll,
      hit: roll <= hitChancePercent
    }
  };
}

export function calculateCombatDamage(input: DamageInput): DamageResult {
  if (!Number.isInteger(input.targetMaximumHp) || input.targetMaximumHp <= 0 ||
      !Number.isInteger(input.targetCurrentHp) || input.targetCurrentHp < 0 ||
      input.targetCurrentHp > input.targetMaximumHp) {
    return { valid: false, error: "INVALID_TARGET_HP" };
  }
  if (!Number.isFinite(input.combatRatio) || input.combatRatio <= 0) {
    return { valid: false, error: "INVALID_COMBAT_RATIO" };
  }
  const allowedBaseDamage = input.isComboFollowup ? [2.5, 4, 6, 9] : [5, 8, 12, 18];
  if (!allowedBaseDamage.includes(input.baseDamagePercent)) {
    return { valid: false, error: "INVALID_BASE_DAMAGE" };
  }
  if ((input.baseDamagePercent === 18 || (input.isComboFollowup && input.baseDamagePercent === 9)) && !input.highOutputTechniqueConfirmed) {
    return { valid: false, error: "HIGH_OUTPUT_NOT_CONFIRMED" };
  }
  if (![0, 10, 25, 40, 50].includes(input.defenseReductionPercent)) {
    return { valid: false, error: "INVALID_DEFENSE" };
  }

  const powerAdjustment = Math.min(1.5, Math.max(0.5, Math.sqrt(input.combatRatio)));
  const rawDamage = input.targetMaximumHp *
    (input.baseDamagePercent / 100) *
    powerAdjustment *
    (1 - input.defenseReductionPercent / 100);
  const roundedDamage = Math.max(1, Math.ceil(rawDamage));
  const actualHpLoss = Math.min(input.targetCurrentHp, roundedDamage);

  return {
    valid: true,
    result: {
      baseDamagePercent: input.baseDamagePercent,
      powerAdjustment,
      defenseReductionPercent: input.defenseReductionPercent,
      rawDamage,
      roundedDamage,
      actualHpLoss,
      targetHpAfter: input.targetCurrentHp - actualHpLoss
    }
  };
}

/** Default combo follow-up uses half the original strike's base percentage. */
export function getComboFollowupBaseDamagePercent(
  originalBaseDamagePercent: number
): number | null {
  if (![5, 8, 12, 18].includes(originalBaseDamagePercent)) return null;
  return originalBaseDamagePercent / 2;
}

export function canResolveDefaultComboFollowup(
  firstStrikeHit: boolean,
  comboDeclaredOrDocumented: boolean,
  plausibleTechniqueAndOpening: boolean
): boolean {
  return firstStrikeHit && comboDeclaredOrDocumented && plausibleTechniqueAndOpening;
}
