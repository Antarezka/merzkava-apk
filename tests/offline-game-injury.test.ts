import { describe, expect, it } from "vitest";
import { calculateInjuryRecovery } from "../src/offline-game/mechanics/injury";

describe("canon injury recovery", () => {
  it("uses natural Class I and II rates proportionally", () => {
    expect(calculateInjuryRecovery({ injuryClass: "I", progress: 0, elapsedHours: 12, method: "NATURAL_REST", fullRest: true })).toMatchObject({ valid: true, result: { progressGain: 5 } });
    expect(calculateInjuryRecovery({ injuryClass: "II", progress: 10, elapsedHours: 48, method: "NATURAL_REST", fullRest: true })).toMatchObject({ valid: true, result: { progressGain: 4 } });
  });
  it("requires structural treatment for Class III", () => {
    expect(calculateInjuryRecovery({ injuryClass: "III", progress: 0, elapsedHours: 24, method: "APPROPRIATE_TREATMENT", fullRest: true, appropriateTreatmentApplied: true })).toMatchObject({ valid: true, result: { progressGain: 0, eligible: false } });
    expect(calculateInjuryRecovery({ injuryClass: "III", progress: 0, elapsedHours: 24, method: "APPROPRIATE_TREATMENT", fullRest: true, appropriateTreatmentApplied: true, structuralTreatmentCompleted: true })).toMatchObject({ valid: true, result: { progressGain: 5, eligible: true } });
  });
  it("requires stabilization and continuing care for Class IV", () => {
    expect(calculateInjuryRecovery({ injuryClass: "IV", progress: 0, elapsedHours: 24, method: "APPROPRIATE_TREATMENT", fullRest: true, appropriateTreatmentApplied: true, stabilized: true })).toMatchObject({ valid: true, result: { progressGain: 0, eligible: false } });
    expect(calculateInjuryRecovery({ injuryClass: "IV", progress: 0, elapsedHours: 24, method: "APPROPRIATE_TREATMENT", fullRest: true, appropriateTreatmentApplied: true, stabilized: true, ongoingTreatment: true })).toMatchObject({ valid: true, result: { progressGain: 2, eligible: true } });
  });
  it("does not heal naturally without full rest or when unclassified", () => {
    expect(calculateInjuryRecovery({ injuryClass: "I", progress: 0, elapsedHours: 24, method: "NATURAL_REST", fullRest: false })).toMatchObject({ valid: true, result: { progressGain: 0 } });
    expect(calculateInjuryRecovery({ injuryClass: "UNCLASSIFIED", progress: 0, elapsedHours: 24, method: "NATURAL_REST", fullRest: true })).toMatchObject({ valid: true, result: { progressGain: 0 } });
  });
  it("caps progress at 100 and rejects invalid values", () => {
    expect(calculateInjuryRecovery({ injuryClass: "I", progress: 95, elapsedHours: 24, method: "APPROPRIATE_TREATMENT", fullRest: false, appropriateTreatmentApplied: true })).toMatchObject({ valid: true, result: { progressAfter: 100, healed: true } });
    expect(calculateInjuryRecovery({ injuryClass: "I", progress: 101, elapsedHours: 24, method: "NATURAL_REST", fullRest: true })).toEqual({ valid: false, error: "INVALID_INJURY_PROGRESS" });
  });
});
