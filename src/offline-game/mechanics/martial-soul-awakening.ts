/**
 * Offline-game Martial Soul awakening protocol.
 *
 * Canon: core/MARTIAL_SOUL_AWAKENING.md
 * Universe pin: 2f76a864150528afb0e3d26cb16f9396ce610ff6
 * Upstream blob: fe56339b8c8fb2d70597c8a03891b7cf947a9cf8
 *
 * Random values are explicit inputs. This module never pretends to roll RNG.
 */

export const MARTIAL_SOUL_RARITY = [
  { min: 1, max: 30, rarity: "Common", chancePercent: 30 },
  { min: 31, max: 57, rarity: "Uncommon", chancePercent: 27 },
  { min: 58, max: 77, rarity: "Rare", chancePercent: 20 },
  { min: 78, max: 89, rarity: "Epic", chancePercent: 12 },
  { min: 90, max: 97, rarity: "Legendary", chancePercent: 8 },
  { min: 98, max: 100, rarity: "Myth", chancePercent: 3 }
] as const;

export type MartialSoulRarity =
  (typeof MARTIAL_SOUL_RARITY)[number]["rarity"];

export function resolveMartialSoulRarityDraw(
  roll: number
): { valid: true; roll: number; rarity: MartialSoulRarity; chancePercent: number } |
   { valid: false; error: "ROLL_MUST_BE_INTEGER_1_TO_100" } {
  if (!Number.isInteger(roll) || roll < 1 || roll > 100) {
    return { valid: false, error: "ROLL_MUST_BE_INTEGER_1_TO_100" };
  }
  const entry = MARTIAL_SOUL_RARITY.find(x => roll >= x.min && roll <= x.max)!;
  return { valid: true, roll, rarity: entry.rarity, chancePercent: entry.chancePercent };
}

export type MutationDecision = "STOP" | "CONTINUE";

export function resolveMartialSoulMutation(
  decision: MutationDecision,
  roll?: number
):
  | { valid: true; decision: "STOP"; mutationRolled: false; mutated: false; chancePercent: 0 }
  | { valid: true; decision: "CONTINUE"; mutationRolled: true; roll: number; mutated: boolean; chancePercent: 10 }
  | { valid: false; error: "INVALID_DECISION" | "MUTATION_ROLL_REQUIRED" | "ROLL_MUST_BE_INTEGER_1_TO_100" } {
  if (decision !== "STOP" && decision !== "CONTINUE") {
    return { valid: false, error: "INVALID_DECISION" };
  }
  if (decision === "STOP") {
    return { valid: true, decision, mutationRolled: false, mutated: false, chancePercent: 0 };
  }
  if (roll === undefined) return { valid: false, error: "MUTATION_ROLL_REQUIRED" };
  if (!Number.isInteger(roll) || roll < 1 || roll > 100) {
    return { valid: false, error: "ROLL_MUST_BE_INTEGER_1_TO_100" };
  }
  return {
    valid: true, decision, mutationRolled: true, roll,
    mutated: roll <= 10, chancePercent: 10
  };
}

export type AssessmentDimension =
  | "corePotential"
  | "primaryFunction"
  | "potency"
  | "scope"
  | "versatility"
  | "controlStability"
  | "growthCapacity"
  | "exceptionalTraits"
  | "evidenceProvenance";

export interface MartialSoulAssessmentScore {
  dimension: AssessmentDimension;
  score: number | null;
  evidenceBacked: boolean;
}

export type InherentClassification =
  | "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Myth";

export type InherentAssessment =
  | {
      valid: true;
      status: "PROVISIONAL";
      score: number;
      mean: number;
      applicableDimensions: number;
      classification: InherentClassification;
      label: "Prediksi GM";
    }
  | {
      valid: true;
      status: "APPRAISAL_REQUIRED";
      score: null;
      mean: null;
      applicableDimensions: number;
      classification: null;
      label: "Klasifikasi belum ditetapkan — appraisal diperlukan";
    }
  | {
      valid: false;
      error: "INVALID_DIMENSION" | "INVALID_SCORE" | "DUPLICATE_DIMENSION" | "UNKNOWN_DIMENSION_SCORE";
    };

const ASSESSMENT_DIMENSIONS: AssessmentDimension[] = [
  "corePotential", "primaryFunction", "potency", "scope", "versatility",
  "controlStability", "growthCapacity", "exceptionalTraits", "evidenceProvenance"
];

export function assessMartialSoulInherentQuality(
  scores: MartialSoulAssessmentScore[]
): InherentAssessment {
  const seen = new Set<AssessmentDimension>();
  const applicable: number[] = [];

  for (const item of scores) {
    if (!ASSESSMENT_DIMENSIONS.includes(item.dimension)) {
      return { valid: false, error: "INVALID_DIMENSION" };
    }
    if (seen.has(item.dimension)) return { valid: false, error: "DUPLICATE_DIMENSION" };
    seen.add(item.dimension);

    if (item.score === null) {
      if (item.evidenceBacked) return { valid: false, error: "UNKNOWN_DIMENSION_SCORE" };
      continue;
    }
    if (!Number.isInteger(item.score) || item.score < 0 || item.score > 15) {
      return { valid: false, error: "INVALID_SCORE" };
    }
    if (item.evidenceBacked) applicable.push(item.score);
  }

  if (applicable.length < 3) {
    return {
      valid: true, status: "APPRAISAL_REQUIRED", score: null, mean: null,
      applicableDimensions: applicable.length,
      classification: null,
      label: "Klasifikasi belum ditetapkan — appraisal diperlukan"
    };
  }

  const mean = applicable.reduce((sum, score) => sum + score, 0) / applicable.length;
  const score = Math.min(134, Math.floor(mean * 9 + 0.5));
  const classification: InherentClassification =
    score <= 22 ? "Common" :
    score <= 44 ? "Uncommon" :
    score <= 66 ? "Rare" :
    score <= 88 ? "Epic" :
    score <= 110 ? "Legendary" : "Myth";

  return {
    valid: true, status: "PROVISIONAL", score, mean,
    applicableDimensions: applicable.length,
    classification, label: "Prediksi GM"
  };
}

export function isAwakeningAgeEligible(ageYears: number): boolean {
  return Number.isFinite(ageYears) && ageYears >= 4;
}

export function getAwakeningRarityTable() {
  return MARTIAL_SOUL_RARITY.map(entry => ({ ...entry }));
}
