/**
 * Deterministic Arcanistry formulas and progression checks.
 * Canon: core/ARCANISTRY_AND_FORMULATION.md
 * Universe pin: 2f76a864150528afb0e3d26cb16f9396ce610ff6
 * Upstream blob: ef674a1fba92facd5e521f0fc7f08c7e730c7d2f
 *
 * Production success chance is returned as a baseline only. Canon has not
 * approved a random-resolution procedure or numeric situational modifiers.
 */

export const FOCUS_STAGES = ["Pemula", "Initiate", "Beginner", "Ordinary", "Ahli", "Expert"] as const;
export type FocusStage = typeof FOCUS_STAGES[number];

export const FOCUS_TRAINING = {
  Pemula: { hours: 12, daysAtThreeHours: 4, mortalSatiety: 87.5 },
  Initiate: { hours: 24, daysAtThreeHours: 8, mortalSatiety: 175.0 },
  Beginner: { hours: 40, daysAtThreeHours: 14, mortalSatiety: 291.7 },
  Ordinary: { hours: 60, daysAtThreeHours: 20, mortalSatiety: 437.5 },
  Ahli: { hours: 90, daysAtThreeHours: 30, mortalSatiety: 656.3 },
  Expert: { hours: 120, daysAtThreeHours: 40, mortalSatiety: 875.0 }
} as const;

export const ARTIFACT_PRODUCTION = {
  1: { hours: 1, mortalSatiety: 7.3 },
  2: { hours: 2, mortalSatiety: 14.6 },
  3: { hours: 3, mortalSatiety: 21.9 },
  4: { hours: 4, mortalSatiety: 29.2 },
  5: { hours: 6, mortalSatiety: 43.8 },
  6: { hours: 8, mortalSatiety: 58.3 },
  7: { hours: 12, mortalSatiety: 87.5 },
  8: { hours: 18, mortalSatiety: 131.3 },
  9: { hours: 24, mortalSatiety: 175.0 },
  10: { hours: 36, mortalSatiety: 262.5 }
} as const;

export type ArtificialArtifactTier = keyof typeof ARTIFACT_PRODUCTION;

export function getFocusTrainingPlan(stage: FocusStage) {
  return FOCUS_TRAINING[stage] ?? null;
}

export function getArtifactProductionPlan(tier: number) {
  if (!Number.isInteger(tier) || tier < 1 || tier > 10) return null;
  return ARTIFACT_PRODUCTION[tier as ArtificialArtifactTier];
}

export function validateFocusStageAward(input: {
  currentStage: FocusStage | null;
  targetStage: FocusStage;
  foundationalInstructionCompleted: boolean;
  teacherAssessmentPassed: boolean;
}): { eligible: boolean; reason: string } {
  if (!input.foundationalInstructionCompleted) {
    return { eligible: false, reason: "FOUNDATIONAL_INSTRUCTION_REQUIRED" };
  }
  if (!input.teacherAssessmentPassed) {
    return { eligible: false, reason: "TEACHER_ASSESSMENT_REQUIRED" };
  }
  const currentIndex = input.currentStage === null ? -1 : FOCUS_STAGES.indexOf(input.currentStage);
  const targetIndex = FOCUS_STAGES.indexOf(input.targetStage);
  if (targetIndex < 0) return { eligible: false, reason: "INVALID_FOCUS_STAGE" };
  if (targetIndex !== currentIndex + 1) {
    return { eligible: false, reason: "FOCUS_STAGE_ORDER_REQUIRED" };
  }
  return { eligible: true, reason: "ASSESSMENT_AND_STAGE_ORDER_PASSED" };
}

export function validateArcanistGradeOneAward(input: {
  initiateAssessmentPassed: boolean;
  officialApprenticeExamPassed: boolean;
  affiliationMarkedApprenticeEngraverPresented: boolean;
}): { eligible: boolean; reason: string } {
  if (!input.initiateAssessmentPassed) return { eligible: false, reason: "INITIATE_ASSESSMENT_REQUIRED" };
  if (!input.affiliationMarkedApprenticeEngraverPresented) return { eligible: false, reason: "AFFILIATION_MARKED_APPRENTICE_ENGRAVER_REQUIRED" };
  if (!input.officialApprenticeExamPassed) return { eligible: false, reason: "APPRENTICE_EXAM_NOT_PASSED" };
  return { eligible: true, reason: "ARCanIST_GRADE_1_REQUIREMENTS_PASSED" };
}

export function getBaselineProductionChance(grade: number, tier: number): number | null {
  if (!Number.isInteger(grade) || grade < 1 || grade > 10 ||
      !Number.isInteger(tier) || tier < 1 || tier > 10) return null;
  const difference = tier - grade;
  if (difference <= -1) return 100;
  if (difference === 0) return 80;
  if (difference === 1) return 30;
  if (difference === 2) return 10;
  return 0;
}

export function getArtificialArtifactExperiencePoints(completedRecordedArtifacts: number): number | null {
  if (!Number.isInteger(completedRecordedArtifacts) || completedRecordedArtifacts < 0) return null;
  if (completedRecordedArtifacts === 0) return 0;
  if (completedRecordedArtifacts <= 2) return 2;
  if (completedRecordedArtifacts <= 5) return 4;
  if (completedRecordedArtifacts <= 10) return 7;
  if (completedRecordedArtifacts <= 20) return 10;
  if (completedRecordedArtifacts <= 40) return 13;
  if (completedRecordedArtifacts <= 75) return 16;
  return 20;
}

export type ArtifactCondition = "Buruk" | "Rendah" | "Standar" | "Baik" | "Origin";

const TIER_EFFICIENCY = [1, 1, 0.9, 0.9, 0.8, 0.8, 0.65, 0.65, 0.5, 0.35] as const;

export interface ArtifactConditionInput {
  tier: number;
  environmentalPenalty: number;
  preparationPoints: number;
  productionSkillPoints: number;
  experiencePoints: number;
  consistencyPoints: number;
}

export interface ArtifactConditionResult {
  rawScore: number;
  displayedScore: number;
  tierEfficiency: number;
  condition: ArtifactCondition;
}

export function calculateArtificialArtifactCondition(
  input: ArtifactConditionInput
): ArtifactConditionResult | null {
  if (!Number.isInteger(input.tier) || input.tier < 1 || input.tier > 10) return null;
  if (!Number.isFinite(input.environmentalPenalty) || input.environmentalPenalty < 0 || input.environmentalPenalty > 15) return null;
  if (!Number.isFinite(input.preparationPoints) || input.preparationPoints < 0 || input.preparationPoints > 20) return null;
  if (!Number.isFinite(input.productionSkillPoints) || input.productionSkillPoints < 0 || input.productionSkillPoints > 25) return null;
  if (!Number.isFinite(input.experiencePoints) || input.experiencePoints < 0 || input.experiencePoints > 20) return null;
  if (!Number.isFinite(input.consistencyPoints) || input.consistencyPoints < 0 || input.consistencyPoints > 20) return null;

  const tierEfficiency = TIER_EFFICIENCY[input.tier - 1];
  const makerPoints = input.preparationPoints + input.productionSkillPoints +
    input.experiencePoints + input.consistencyPoints;
  const rawScore = clamp(100 - 20 - (1.2 * input.tier) -
    input.environmentalPenalty + (makerPoints * tierEfficiency), 0, 100);
  const displayedScore = Math.round((rawScore + Number.EPSILON) * 100) / 100;
  const condition: ArtifactCondition =
    rawScore < 40 ? "Buruk" :
    rawScore < 65 ? "Rendah" :
    rawScore < 80 ? "Standar" :
    rawScore < 97 ? "Baik" : "Origin";
  return { rawScore, displayedScore, tierEfficiency, condition };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
