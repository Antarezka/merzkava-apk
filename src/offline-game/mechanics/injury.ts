/**
 * Offline-game Injury recovery progression.
 *
 * Source: Antarezka/merzkava-universe/core/INJURY_SYSTEM.md
 * Upstream commit: 2f76a864150528afb0e3d26cb16f9396ce610ff6
 * Upstream blob: a90d3d1c58afd3da171d66bc632b23e2a30cbbfd
 *
 * This calculator implements only the published baseline progression rates.
 * It does not diagnose injuries, infer class from HP loss, or invent activity
 * penalties, treatment bonuses, complications, or residual effects.
 */

export type InjuryClass = "I" | "II" | "III" | "IV" | "UNCLASSIFIED";
export type InjuryRecoveryMethod = "NATURAL_REST" | "APPROPRIATE_TREATMENT";

export interface InjuryRecoveryInput {
  injuryClass: InjuryClass;
  progress: number;
  elapsedHours: number;
  method: InjuryRecoveryMethod;
  fullRest: boolean;
  appropriateTreatmentApplied?: boolean;
  structuralTreatmentCompleted?: boolean;
  stabilized?: boolean;
  ongoingTreatment?: boolean;
}

export interface InjuryRecoveryResult {
  progressBefore: number;
  progressAfter: number;
  progressGain: number;
  baseRatePer24Hours: number;
  elapsedHours: number;
  healed: boolean;
  eligible: boolean;
  reason: string;
}

export type InjuryRecoveryCalculation =
  | { valid: true; result: InjuryRecoveryResult }
  | { valid: false; error: "INVALID_INJURY_PROGRESS" | "INVALID_ELAPSED_HOURS" | "INVALID_RECOVERY_METHOD" };

const NATURAL_RATE: Record<Exclude<InjuryClass, "UNCLASSIFIED">, number> = {
  I: 10,
  II: 2,
  III: 0,
  IV: 0
};

const TREATED_RATE: Record<Exclude<InjuryClass, "UNCLASSIFIED">, number> = {
  I: 20,
  II: 10,
  III: 5,
  IV: 2
};

export function calculateInjuryRecovery(
  input: InjuryRecoveryInput
): InjuryRecoveryCalculation {
  if (!Number.isFinite(input.progress) || input.progress < 0 || input.progress > 100) {
    return { valid: false, error: "INVALID_INJURY_PROGRESS" };
  }
  if (!Number.isFinite(input.elapsedHours) || input.elapsedHours < 0) {
    return { valid: false, error: "INVALID_ELAPSED_HOURS" };
  }
  if (input.method !== "NATURAL_REST" && input.method !== "APPROPRIATE_TREATMENT") {
    return { valid: false, error: "INVALID_RECOVERY_METHOD" };
  }

  const baseResult = (
    baseRatePer24Hours: number,
    eligible: boolean,
    reason: string
  ): InjuryRecoveryCalculation => {
    const progressGain = eligible
      ? Math.min(100 - input.progress, baseRatePer24Hours * input.elapsedHours / 24)
      : 0;
    const progressAfter = input.progress + progressGain;
    return {
      valid: true,
      result: {
        progressBefore: input.progress,
        progressAfter,
        progressGain,
        baseRatePer24Hours,
        elapsedHours: input.elapsedHours,
        healed: progressAfter >= 100,
        eligible,
        reason
      }
    };
  };

  if (input.injuryClass === "UNCLASSIFIED") {
    return baseResult(0, false, "INJURY_UNCLASSIFIED: classify only when supported by evidence.");
  }

  if (input.method === "NATURAL_REST") {
    if (!input.fullRest) {
      return baseResult(0, false, "FULL_REST_REQUIRED_FOR_NATURAL_RECOVERY.");
    }
    if (input.injuryClass === "III") {
      return baseResult(0, false, "STRUCTURAL_TREATMENT_REQUIRED_BEFORE_FUNCTIONAL_RECOVERY.");
    }
    if (input.injuryClass === "IV") {
      return baseResult(0, false, "CRITICAL_INJURY_REQUIRES_STABILIZATION_AND_CONTINUING_TREATMENT.");
    }
    return baseResult(
      NATURAL_RATE[input.injuryClass],
      true,
      "BASELINE_NATURAL_RECOVERY_DURING_FULL_REST."
    );
  }

  if (!input.appropriateTreatmentApplied) {
    return baseResult(0, false, "APPROPRIATE_TREATMENT_NOT_CONFIRMED.");
  }
  if (input.injuryClass === "III" && !input.structuralTreatmentCompleted) {
    return baseResult(0, false, "STRUCTURAL_TREATMENT_REQUIRED_BEFORE_FUNCTIONAL_RECOVERY.");
  }
  if (input.injuryClass === "IV" && (!input.stabilized || !input.ongoingTreatment)) {
    return baseResult(0, false, "CRITICAL_INJURY_REQUIRES_STABILIZATION_AND_CONTINUING_TREATMENT.");
  }

  return baseResult(
    TREATED_RATE[input.injuryClass],
    true,
    "BASELINE_RECOVERY_WITH_CONFIRMED_APPROPRIATE_TREATMENT."
  );
}
