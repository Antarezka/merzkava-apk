import { describe, expect, it } from "vitest";
import {
  calculateAgePressure,
  calculateAbsorptionFormulas,
  calculateAnomalousWorldRejection
} from "../src/offline-game/mechanics/spirit-ring-compatibility";

describe("canon Spirit Ring compatibility and absorption formulas", () => {
  it("calculates age pressure and EAG from actual Beast age and recipient Spirit Realm", () => {
    expect(calculateAgePressure(10, "Spirit Initiate")).toMatchObject({
      eag: 0, excessPressure: 0, realmTolerance: 30.99
    });
    expect(calculateAgePressure(100_000, "Spirit Initiate")?.eag).toBe(2);
    expect(calculateAgePressure(-1, "Spirit Initiate")).toBeNull();
    expect(calculateAgePressure(100, "Unknown Realm")).toBeNull();
  });

  it("calculates Sync cap and success chance for a low-pressure eligible absorption", () => {
    const result = calculateAbsorptionFormulas({
      beastAgeYears: 10,
      spiritRealm: "Spirit Initiate",
      aggression: 0,
      recipientReadiness: 50,
      resonanceCorrection: 0,
      voluntarySurrender: 0,
      allEligibilityGatesPassed: true
    });
    expect(result).not.toBeNull();
    expect(result).toMatchObject({
      rawSyncCap: 100,
      syncCap: 100,
      successChancePercent: 95,
      defectChanceIfFailedPercent: 1,
      overallPermanentDefectChancePercent: 0.05,
      eligible: true
    });
  });

  it("enforces the hard Sync cap of 20 percent at EAG 2", () => {
    const result = calculateAbsorptionFormulas({
      beastAgeYears: 100_000,
      spiritRealm: "Spirit Initiate",
      aggression: 0,
      recipientReadiness: 100,
      resonanceCorrection: 15,
      voluntarySurrender: 1,
      allEligibilityGatesPassed: true
    });
    expect(result?.agePressure.eag).toBe(2);
    expect(result?.syncCap).toBe(20);
  });

  it("sets success to zero and withholds defect odds when any eligibility gate fails", () => {
    const result = calculateAbsorptionFormulas({
      beastAgeYears: 10,
      spiritRealm: "Spirit Initiate",
      aggression: 0,
      recipientReadiness: 50,
      resonanceCorrection: 0,
      voluntarySurrender: 0,
      allEligibilityGatesPassed: false
    });
    expect(result).toMatchObject({
      successChancePercent: 0,
      defectChanceIfFailedPercent: null,
      overallPermanentDefectChancePercent: null,
      eligible: false
    });
  });

  it("validates the published aggression, readiness, resonance, and surrender ranges", () => {
    expect(calculateAbsorptionFormulas({
      beastAgeYears: 10, spiritRealm: "Spirit Initiate", aggression: 6,
      recipientReadiness: 50, resonanceCorrection: 0, voluntarySurrender: 0,
      allEligibilityGatesPassed: true
    })).toBeNull();
    expect(calculateAbsorptionFormulas({
      beastAgeYears: 10, spiritRealm: "Spirit Initiate", aggression: 0,
      recipientReadiness: 50, resonanceCorrection: 16, voluntarySurrender: 0,
      allEligibilityGatesPassed: true
    })).toBeNull();
  });

  it("keeps AWR at zero through seven million years and checks only an active conversion", () => {
    expect(calculateAnomalousWorldRejection(7_000_000, 0, 0, 0, true)).toBe(0);
    expect(calculateAnomalousWorldRejection(8_000_000, 0, 0, 20, false)).toBe(0);
    expect(calculateAnomalousWorldRejection(8_000_000, 0, 0, 20, true)).toBe(27);
  });

  it("caps AWR at 75 percent", () => {
    expect(calculateAnomalousWorldRejection(100_000_000, 5, 3, 25, true)).toBe(75);
  });
});
