import { describe, expect, it } from "vitest";
import {
  applySatietyIntake,
  calculateSatietyInterval,
  displaySatiety,
  getMissedMealMultiplier,
  getPortionSatietyGain
} from "../../src/offline-game/mechanics/satiety";

describe("offline-game canon Satiety interval engine", () => {
  it("uses the official awake-time base rates for Mortal through Spirit Primordial", () => {
    expect(calculateSatietyInterval({
      satiety: 100, realm: "Mortal", awakeHours: 24, activity: "LIGHT"
    })).toMatchObject({ valid: true, result: { baseDrain: 100, actualDrain: 100, satietyAfter: 0 } });
    expect(calculateSatietyInterval({
      satiety: 100, realm: "Spirit Initiate", awakeHours: 48, activity: "AWAKE_REST"
    })).toMatchObject({ valid: true, result: { baseDrain: 100, actualDrain: 50 } });
    expect(calculateSatietyInterval({
      satiety: 100, realm: "Spirit Primordial", awakeHours: 8760, activity: "AWAKE_REST"
    })).toMatchObject({ valid: true, result: { baseDrain: 100, actualDrain: 50 } });
  });

  it("matches the official Mortal six-hour Light example without rounding internal state", () => {
    const result = calculateSatietyInterval({
      satiety: 100, realm: "Mortal", awakeHours: 6, activity: "LIGHT"
    });
    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.result.actualDrain).toBe(31.25);
    expect(result.result.satietyAfter).toBe(68.75);
    expect(result.result.displayedDrain).toBe(31.3);
    expect(result.result.displayedAfter).toBe(68.8);
  });

  it("uses one exclusive activity multiplier and caps the combined factor at eight", () => {
    const result = calculateSatietyInterval({
      satiety: 100,
      realm: "Mortal",
      awakeHours: 1,
      activity: "SURVIVAL",
      missedMealWindows: 3,
      bodyCondition: "EXTREMELY_FATIGUED"
    });
    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.result.rawCombinedMultiplier).toBe(40);
    expect(result.result.appliedCombinedMultiplier).toBe(8);
    expect(result.result.actualDrain).toBeCloseTo(100 / 24 * 8);
  });

  it("applies missed-meal multipliers as one non-stacking category", () => {
    expect(getMissedMealMultiplier(0)).toBe(1);
    expect(getMissedMealMultiplier(1)).toBe(1.75);
    expect(getMissedMealMultiplier(2)).toBe(2.75);
    expect(getMissedMealMultiplier(3)).toBe(4);
    expect(getMissedMealMultiplier(30)).toBe(4);
    expect(getMissedMealMultiplier(-1)).toBeNull();
    expect(getMissedMealMultiplier(1.5)).toBeNull();
  });

  it("does not drain Satiety during protected sleep when no awake hours are supplied", () => {
    const result = calculateSatietyInterval({
      satiety: 62.4, realm: "Mortal", awakeHours: 0, activity: "SURVIVAL",
      missedMealWindows: 3, bodyCondition: "EXTREMELY_FATIGUED"
    });
    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.result.actualDrain).toBe(0);
    expect(result.result.satietyAfter).toBe(62.4);
  });

  it("preserves tiny internal changes while displaying only one decimal place", () => {
    const result = calculateSatietyInterval({
      satiety: 100, realm: "Spirit Primordial", awakeHours: 1, activity: "LIGHT"
    });
    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.result.actualDrain).toBeGreaterThan(0);
    expect(result.result.displayedDrain).toBe(0);
    expect(result.result.satietyAfter).toBeLessThan(100);
    expect(displaySatiety(68.75)).toBe(68.8);
  });

  it("surfaces the source's Spirit Primordial example/formula inconsistency", () => {
    const result = calculateSatietyInterval({
      satiety: 100, realm: "Spirit Primordial", awakeHours: 24, activity: "LIGHT"
    });
    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.result.actualDrain).toBeCloseTo((24 / 8760) * 100 * 1.25);
    expect(result.result.warnings[0]).toContain("SOURCE_EXAMPLE_CONFLICT");
  });

  it("uses explicit portion values and applies only the amount actually consumed", () => {
    expect(getPortionSatietyGain("SMALL")).toBe(10);
    expect(getPortionSatietyGain("STANDARD")).toBe(34);
    expect(getPortionSatietyGain("LARGE")).toBe(50);
    expect(applySatietyIntake(50, 34)).toEqual({
      valid: true, before: 50, after: 84, actualGain: 34
    });
    expect(applySatietyIntake(90, 50)).toEqual({
      valid: true, before: 90, after: 100, actualGain: 10
    });
  });

  it("rejects invalid values rather than silently normalizing them", () => {
    expect(calculateSatietyInterval({
      satiety: 101, realm: "Mortal", awakeHours: 1, activity: "LIGHT"
    })).toEqual({ valid: false, error: "INVALID_SATIETY" });
    expect(calculateSatietyInterval({
      satiety: 50, realm: "Mortal", awakeHours: -1, activity: "LIGHT"
    })).toEqual({ valid: false, error: "INVALID_AWAKE_HOURS" });
    expect(calculateSatietyInterval({
      satiety: 50, realm: "Mortal", awakeHours: 1, activity: "LIGHT",
      missedMealWindows: 1.5
    })).toEqual({ valid: false, error: "INVALID_MISSED_MEAL_COUNT" });
    expect(calculateSatietyInterval({
      satiety: 50, realm: "Mortal", awakeHours: 1, activity: "LIGHT",
      biologicalMultiplier: -1
    })).toEqual({ valid: false, error: "INVALID_BIOLOGICAL_MULTIPLIER" });
    expect(applySatietyIntake(50, -1)).toEqual({
      valid: false, error: "INVALID_SATIETY_GAIN"
    });
  });
});
