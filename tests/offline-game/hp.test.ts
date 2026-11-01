import { describe, expect, it } from "vitest";
import {
  getMaximumHp,
  initializeHpState,
  updateHpMaximum,
  type HpState
} from "../../src/offline-game/mechanics/hp";

describe("offline-game canon HP module", () => {
  it("uses the exact official maximum HP table for every Spirit Realm and Stage", () => {
    expect(getMaximumHp("Mortal", 0)).toBe(100);
    expect(getMaximumHp("Spirit Initiate", 1)).toBe(150);
    expect(getMaximumHp("Spirit Initiate", 2)).toBe(200);
    expect(getMaximumHp("Spirit Initiate", 3)).toBe(250);
    expect(getMaximumHp("Spirit Initiate", 4)).toBe(300);
    expect(getMaximumHp("Spirit Adept", 4)).toBe(600);
    expect(getMaximumHp("Spirit Elder", 4)).toBe(1000);
    expect(getMaximumHp("Spirit Monarch", 4)).toBe(1600);
    expect(getMaximumHp("Spirit King", 4)).toBe(2500);
    expect(getMaximumHp("Spirit Ancestor", 4)).toBe(3700);
    expect(getMaximumHp("Spirit Emperor", 4)).toBe(5200);
    expect(getMaximumHp("Spirit Sovereign", 4)).toBe(7000);
    expect(getMaximumHp("Spirit Primordial", 1)).toBe(7488);
    expect(getMaximumHp("Spirit Primordial", 2)).toBe(7975);
    expect(getMaximumHp("Spirit Primordial", 3)).toBe(8463);
    expect(getMaximumHp("Spirit Primordial", 4)).toBe(8950);
  });

  it("rejects invalid realm and stage combinations instead of inventing a value", () => {
    expect(getMaximumHp("Mortal", 1)).toBeNull();
    expect(getMaximumHp("Spirit Initiate", 0)).toBeNull();
    expect(getMaximumHp("Spirit Initiate", 5)).toBeNull();
    expect(getMaximumHp("Unknown Realm", 4)).toBeNull();
  });

  it("initializes a new session at the applicable maximum when current HP is absent", () => {
    expect(initializeHpState("Mortal", 0, undefined, "NEW_SESSION")).toEqual({
      valid: true,
      state: { current: 100, maximum: 100, status: "ALIVE", currentValueKnown: true }
    });
  });

  it("preserves an unknown continuing-session HP as unresolved zero, not confirmed death", () => {
    expect(initializeHpState("Spirit Adept", 2, undefined, "CONTINUING_SESSION")).toEqual({
      valid: true,
      state: { current: 0, maximum: 450, status: "UNRESOLVED", currentValueKnown: false }
    });
  });

  it("marks an explicitly recorded zero HP as permanent death state", () => {
    expect(initializeHpState("Mortal", 0, 0, "CONTINUING_SESSION")).toEqual({
      valid: true,
      state: { current: 0, maximum: 100, status: "DEAD", currentValueKnown: true }
    });
  });

  it("does not refill current HP when maximum HP increases", () => {
    const previous: HpState = {
      current: 90, maximum: 100, status: "ALIVE", currentValueKnown: true
    };
    expect(updateHpMaximum(previous, "Spirit Initiate", 1)).toEqual({
      valid: true,
      state: { current: 90, maximum: 150, status: "ALIVE", currentValueKnown: true }
    });
  });

  it("reports a conflict instead of silently clamping current HP after a maximum decrease", () => {
    const previous: HpState = {
      current: 200, maximum: 300, status: "ALIVE", currentValueKnown: true
    };
    expect(updateHpMaximum(previous, "Mortal", 0)).toEqual({
      valid: false, error: "CURRENT_HP_EXCEEDS_MAXIMUM"
    });
  });

  it("rejects negative, fractional, and over-maximum HP values", () => {
    expect(initializeHpState("Mortal", 0, -1, "CONTINUING_SESSION")).toEqual({
      valid: false, error: "INVALID_CURRENT_HP"
    });
    expect(initializeHpState("Mortal", 0, 1.5, "CONTINUING_SESSION")).toEqual({
      valid: false, error: "INVALID_CURRENT_HP"
    });
    expect(initializeHpState("Mortal", 0, 101, "CONTINUING_SESSION")).toEqual({
      valid: false, error: "CURRENT_HP_EXCEEDS_MAXIMUM"
    });
  });
});
