import { describe, expect, it } from "vitest";
import {
  assessMartialSoulInherentQuality,
  isAwakeningAgeEligible,
  resolveMartialSoulMutation,
  resolveMartialSoulRarityDraw
} from "../../src/offline-game/mechanics/martial-soul-awakening";

describe("canon Martial Soul awakening protocol", () => {
  it.each([
    [1, "Common"], [30, "Common"], [31, "Uncommon"], [57, "Uncommon"],
    [58, "Rare"], [77, "Rare"], [78, "Epic"], [89, "Epic"],
    [90, "Legendary"], [97, "Legendary"], [98, "Myth"], [100, "Myth"]
  ])("maps rarity roll %i to %s", (roll, rarity) => {
    expect(resolveMartialSoulRarityDraw(roll)).toMatchObject({
      valid: true, roll, rarity
    });
  });

  it("rejects invalid rarity rolls", () => {
    expect(resolveMartialSoulRarityDraw(0)).toEqual({
      valid: false, error: "ROLL_MUST_BE_INTEGER_1_TO_100"
    });
    expect(resolveMartialSoulRarityDraw(101).valid).toBe(false);
    expect(resolveMartialSoulRarityDraw(1.5).valid).toBe(false);
  });

  it("keeps rarity chance separate from inherent assessment", () => {
    expect(resolveMartialSoulRarityDraw(100)).toMatchObject({
      rarity: "Myth", chancePercent: 3
    });
    expect(assessMartialSoulInherentQuality([
      { dimension: "corePotential", score: 2, evidenceBacked: true },
      { dimension: "primaryFunction", score: 3, evidenceBacked: true },
      { dimension: "potency", score: 4, evidenceBacked: true }
    ])).toMatchObject({ valid: true, status: "PROVISIONAL", classification: "Uncommon" });
  });

  it("does not roll mutation when the player chooses STOP", () => {
    expect(resolveMartialSoulMutation("STOP")).toEqual({
      valid: true, decision: "STOP", mutationRolled: false,
      mutated: false, chancePercent: 0
    });
  });

  it("requires exactly one explicit mutation roll after CONTINUE", () => {
    expect(resolveMartialSoulMutation("CONTINUE")).toEqual({
      valid: false, error: "MUTATION_ROLL_REQUIRED"
    });
    expect(resolveMartialSoulMutation("CONTINUE", 10)).toMatchObject({
      valid: true, mutationRolled: true, roll: 10, mutated: true, chancePercent: 10
    });
    expect(resolveMartialSoulMutation("CONTINUE", 11)).toMatchObject({
      valid: true, roll: 11, mutated: false, chancePercent: 10
    });
  });

  it("rejects invalid mutation rolls", () => {
    expect(resolveMartialSoulMutation("CONTINUE", 0).valid).toBe(false);
    expect(resolveMartialSoulMutation("CONTINUE", 101).valid).toBe(false);
    expect(resolveMartialSoulMutation("CONTINUE", 5.5).valid).toBe(false);
  });

  it("requires at least three evidence-backed dimensions for a provisional score", () => {
    expect(assessMartialSoulInherentQuality([
      { dimension: "corePotential", score: 15, evidenceBacked: true },
      { dimension: "primaryFunction", score: 15, evidenceBacked: true },
      { dimension: "potency", score: null, evidenceBacked: false }
    ])).toMatchObject({
      valid: true, status: "APPRAISAL_REQUIRED", score: null,
      applicableDimensions: 2
    });
  });

  it("calculates score from the mean, multiplies by nine, and rounds half up", () => {
    expect(assessMartialSoulInherentQuality([
      { dimension: "corePotential", score: 10, evidenceBacked: true },
      { dimension: "primaryFunction", score: 11, evidenceBacked: true },
      { dimension: "potency", score: 12, evidenceBacked: true }
    ])).toMatchObject({
      valid: true, status: "PROVISIONAL", score: 99,
      classification: "Legendary", applicableDimensions: 3
    });
  });

  it("excludes N/A and unknown dimensions instead of scoring them as zero", () => {
    expect(assessMartialSoulInherentQuality([
      { dimension: "corePotential", score: 12, evidenceBacked: true },
      { dimension: "primaryFunction", score: 12, evidenceBacked: true },
      { dimension: "potency", score: 12, evidenceBacked: true },
      { dimension: "scope", score: null, evidenceBacked: false }
    ])).toMatchObject({ score: 108, classification: "Legendary", applicableDimensions: 3 });
  });

  it("rejects duplicate dimensions, unsupported scores, and evidence marked unknown", () => {
    expect(assessMartialSoulInherentQuality([
      { dimension: "corePotential", score: 5, evidenceBacked: true },
      { dimension: "corePotential", score: 6, evidenceBacked: true }
    ])).toEqual({ valid: false, error: "DUPLICATE_DIMENSION" });
    expect(assessMartialSoulInherentQuality([
      { dimension: "corePotential", score: 16, evidenceBacked: true }
    ])).toEqual({ valid: false, error: "INVALID_SCORE" });
    expect(assessMartialSoulInherentQuality([
      { dimension: "corePotential", score: null, evidenceBacked: true }
    ])).toEqual({ valid: false, error: "UNKNOWN_DIMENSION_SCORE" });
  });

  it("requires age four or older for awakening", () => {
    expect(isAwakeningAgeEligible(3.99)).toBe(false);
    expect(isAwakeningAgeEligible(4)).toBe(true);
    expect(isAwakeningAgeEligible(14)).toBe(true);
    expect(isAwakeningAgeEligible(Number.NaN)).toBe(false);
  });
});
