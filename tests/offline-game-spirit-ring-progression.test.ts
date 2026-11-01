import { describe, expect, it } from "vitest";
import {
  calculateBaseQi,
  calculateForcedAbsorptionDamage,
  calculateRingPowerScale,
  evaluateAbsorptionEligibility,
  getForcedAbsorptionMultiplier,
  getForcedAbsorptionRisk,
  getQiState
} from "../src/offline-game/mechanics/spirit-ring-progression";

describe("canon Spirit Ring progression formulas", () => {
  it("calculates geometric compatibility, total ring age, and PowerScale", () => {
    expect(calculateRingPowerScale([100, 200], [80, 20])).toMatchObject({
      compatibilityTotal: 40, ageTotalYears: 300, powerScale: 210
    });
    expect(calculateRingPowerScale([100, 200], [0, 20])).toMatchObject({
      compatibilityTotal: 0, powerScale: 150
    });
  });

  it("uses the official Qi formula for one through nine rings", () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9].map(calculateBaseQi)).toEqual([
      100, 509, 2593, 13207, 67256, 342504, 1744213, 8882449, 45234100
    ]);
    expect(calculateBaseQi(0)).toBeNull();
    expect(getQiState(0, false)).toBe(0);
    expect(getQiState(0, true)).toBe("NOT_FORMED");
    expect(getQiState(1, true)).toBe(100);
  });

  it("calculates Ring 3 forced-absorption damage from maximum HP and deviation", () => {
    expect(calculateForcedAbsorptionDamage({
      maximumHp: 1000, currentHp: 1000, ringNumber: 3,
      deviationPercent: 50, gapPoints: 0,
      minimumIntervalMet: true, explicitlyForced: true
    })).toMatchObject({
      baseHpLoss: 188, appliedMultiplier: 1,
      modifiedHpLoss: 188, actualHpLoss: 188, hpAfter: 812,
      risk: "VERY_HIGH"
    });
  });

  it("uses the largest applicable forced-attempt multiplier without stacking", () => {
    expect(getForcedAbsorptionMultiplier(2, true, false)).toBe(1);
    expect(getForcedAbsorptionMultiplier(5, true, false)).toBe(1.25);
    expect(getForcedAbsorptionMultiplier(8, true, false)).toBe(1.5);
    expect(getForcedAbsorptionMultiplier(1, false, true)).toBe(1.5);
    expect(getForcedAbsorptionMultiplier(10, true, true)).toBe(2);
    expect(getForcedAbsorptionMultiplier(10, true, false)).toBeNull();
  });

  it("caps actual HP loss at current HP and classifies risk from actual loss", () => {
    expect(calculateForcedAbsorptionDamage({
      maximumHp: 1000, currentHp: 20, ringNumber: 9,
      deviationPercent: 100, gapPoints: 10,
      minimumIntervalMet: true, explicitlyForced: true
    })).toMatchObject({
      baseHpLoss: 600, appliedMultiplier: 2,
      modifiedHpLoss: 1200, actualHpLoss: 20, hpAfter: 0,
      risk: "MEDIUM_HIGH"
    });
    expect(getForcedAbsorptionRisk(4)).toBe("VERY_LOW");
    expect(getForcedAbsorptionRisk(5)).toBe("LOW");
    expect(getForcedAbsorptionRisk(19)).toBe("MEDIUM_LOW");
    expect(getForcedAbsorptionRisk(20)).toBe("MEDIUM_HIGH");
    expect(getForcedAbsorptionRisk(30)).toBe("HIGH");
    expect(getForcedAbsorptionRisk(40)).toBe("VERY_HIGH");
  });

  it("allows the first ring without a breakthrough item or cooldown", () => {
    expect(evaluateAbsorptionEligibility({
      ringNumber: 1, martialSoulAwakened: true,
      ringAvailableAndLegallyObtained: true, requiredItemAvailable: false,
      bodyConditionSuitable: true, otherRequirementsMet: true,
      gapPoints: 99, dayLeft: 999, minimumIntervalMet: false
    })).toMatchObject({ eligible: true });
  });

  it("requires item, gap under ten, zero Day left, and interval for later rings", () => {
    const valid = {
      ringNumber: 2, martialSoulAwakened: true,
      ringAvailableAndLegallyObtained: true, requiredItemAvailable: true,
      bodyConditionSuitable: true, otherRequirementsMet: true,
      gapPoints: 9, dayLeft: 0, minimumIntervalMet: true
    };
    expect(evaluateAbsorptionEligibility(valid).eligible).toBe(true);
    expect(evaluateAbsorptionEligibility({ ...valid, gapPoints: 10 }).eligible).toBe(false);
    expect(evaluateAbsorptionEligibility({ ...valid, dayLeft: 1 }).eligible).toBe(false);
    expect(evaluateAbsorptionEligibility({ ...valid, requiredItemAvailable: false }).eligible).toBe(false);
  });

  it("rejects ring ten and unawakened first-ring attempts", () => {
    expect(evaluateAbsorptionEligibility({
      ringNumber: 10, martialSoulAwakened: true,
      ringAvailableAndLegallyObtained: true, requiredItemAvailable: true,
      bodyConditionSuitable: true, otherRequirementsMet: true,
      gapPoints: 0, dayLeft: 0, minimumIntervalMet: true
    }).eligible).toBe(false);
    expect(evaluateAbsorptionEligibility({
      ringNumber: 1, martialSoulAwakened: false,
      ringAvailableAndLegallyObtained: true, requiredItemAvailable: false,
      bodyConditionSuitable: true, otherRequirementsMet: true,
      gapPoints: 0, dayLeft: 0, minimumIntervalMet: true
    }).eligible).toBe(false);
  });
});
