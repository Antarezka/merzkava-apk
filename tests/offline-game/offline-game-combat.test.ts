import { describe, expect, it } from "vitest";
import {
  calculateCombatDamage,
  calculateCombatRatio,
  calculateCombatRating,
  calculateHitChance,
  canResolveDefaultComboFollowup,
  getComboFollowupBaseDamagePercent,
  resolveD100Hit
} from "../../src/offline-game/mechanics/combat";

describe("offline-game canon combat formulas", () => {
  it("calculates Combat Rating from PowerScale and one readiness factor", () => {
    const first = calculateCombatRating({ powerScale: 100, readinessFactor: 1.1 });
    const second = calculateCombatRating({ powerScale: 100, readinessFactor: 1.2, relevantArtifactFactor: 1.1 });
    expect(first.valid).toBe(true);
    expect(second.valid).toBe(true);
    if (first.valid) expect(first.combatRating).toBeCloseTo(110);
    if (second.valid) expect(second.combatRating).toBeCloseTo(132);
  });

  it("rejects invalid or missing numerical combat inputs", () => {
    expect(calculateCombatRating({ powerScale: 0, readinessFactor: 1 })).toEqual({
      valid: false, error: "INVALID_POWERSCALE"
    });
    expect(calculateCombatRatio(100, 0)).toBeNull();
    expect(calculateHitChance(0)).toBeNull();
  });

  it("calculates hit chance and clamps it to the official 10–90 percent range", () => {
    expect(calculateHitChance(1)).toBe(50);
    expect(calculateHitChance(2)).toBe(75);
    expect(calculateHitChance(0.2)).toBe(30);
    expect(calculateHitChance(100)).toBe(90);
    // With a positive combat ratio, the formula's raw minimum approaches 25%;
    // the written 10% clamp is therefore a defensive lower bound, not reachable.
    expect(calculateHitChance(0.01)).toBeCloseTo(25.25);
  });

  it("resolves a d100 roll at or below the hit chance as a hit", () => {
    expect(resolveD100Hit(1, 50)).toMatchObject({ valid: true, result: { hitChancePercent: 50, hit: true } });
    expect(resolveD100Hit(1, 51)).toMatchObject({ valid: true, result: { hitChancePercent: 50, hit: false } });
    expect(resolveD100Hit(1, 0)).toEqual({ valid: false, error: "INVALID_D100_ROLL" });
  });

  it("uses the square-root power adjustment and official defense reductions", () => {
    expect(calculateCombatDamage({
      targetMaximumHp: 1000, targetCurrentHp: 1000,
      baseDamagePercent: 5, combatRatio: 4, defenseReductionPercent: 0
    })).toMatchObject({
      valid: true,
      result: { powerAdjustment: 1.5, rawDamage: 75, roundedDamage: 75, actualHpLoss: 75 }
    });
    expect(calculateCombatDamage({
      targetMaximumHp: 1000, targetCurrentHp: 1000,
      baseDamagePercent: 8, combatRatio: 1, defenseReductionPercent: 25
    })).toMatchObject({
      valid: true, result: { rawDamage: 60, roundedDamage: 60, actualHpLoss: 60 }
    });
  });

  it("rounds damage upward and never subtracts more than current HP", () => {
    const result = calculateCombatDamage({
      targetMaximumHp: 101, targetCurrentHp: 2,
      baseDamagePercent: 5, combatRatio: 1, defenseReductionPercent: 0
    });
    expect(result).toMatchObject({
      valid: true, result: { roundedDamage: 6, actualHpLoss: 2, targetHpAfter: 0 }
    });
    if (result.valid) expect(result.result.rawDamage).toBeCloseTo(5.05);
  });

  it("requires explicit confirmation for the high-output 18 percent class", () => {
    expect(calculateCombatDamage({
      targetMaximumHp: 100, targetCurrentHp: 100,
      baseDamagePercent: 18, combatRatio: 1, defenseReductionPercent: 0
    })).toEqual({ valid: false, error: "HIGH_OUTPUT_NOT_CONFIRMED" });
  });

  it("accepts only the half-base percentages for a declared combo follow-up", () => {
    expect(calculateCombatDamage({
      targetMaximumHp: 1000, targetCurrentHp: 1000,
      baseDamagePercent: 4, combatRatio: 1, defenseReductionPercent: 0,
      isComboFollowup: true
    })).toMatchObject({ valid: true, result: { rawDamage: 40, roundedDamage: 40 } });
    expect(calculateCombatDamage({
      targetMaximumHp: 1000, targetCurrentHp: 1000,
      baseDamagePercent: 4, combatRatio: 1, defenseReductionPercent: 0
    })).toEqual({ valid: false, error: "INVALID_BASE_DAMAGE" });
    expect(calculateCombatDamage({
      targetMaximumHp: 1000, targetCurrentHp: 1000,
      baseDamagePercent: 9, combatRatio: 1, defenseReductionPercent: 0,
      isComboFollowup: true
    })).toEqual({ valid: false, error: "HIGH_OUTPUT_NOT_CONFIRMED" });
  });

  it("uses half the original base damage for a default combo follow-up", () => {
    expect(getComboFollowupBaseDamagePercent(5)).toBe(2.5);
    expect(getComboFollowupBaseDamagePercent(18)).toBe(9);
    expect(getComboFollowupBaseDamagePercent(7)).toBeNull();
  });

  it("requires a successful opening hit and a supported opening to continue a combo", () => {
    expect(canResolveDefaultComboFollowup(true, true, true)).toBe(true);
    expect(canResolveDefaultComboFollowup(false, true, true)).toBe(false);
    expect(canResolveDefaultComboFollowup(true, false, true)).toBe(false);
    expect(canResolveDefaultComboFollowup(true, true, false)).toBe(false);
  });
});
