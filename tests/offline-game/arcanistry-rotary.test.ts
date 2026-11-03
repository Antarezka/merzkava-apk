import { describe, expect, it } from "vitest";
import { isRotaryAligned, rotaryActivationProgress, rotaryAngularDistance, rotaryPointerDelta } from "../../src/offline-game/arcanistry-rotary";

describe("Arcanistry rotary activation geometry",()=>{
  it("tracks clockwise and counter-clockwise pointer movement across the angle boundary",()=>{
    expect(rotaryPointerDelta(170,-170)).toBe(20);
    expect(rotaryPointerDelta(-170,170)).toBe(-20);
    expect(rotaryPointerDelta(30,50)).toBe(20);
  });

  it("measures the shortest distance to the fixed activation mark",()=>{
    expect(rotaryAngularDistance(350,10)).toBe(20);
    expect(rotaryAngularDistance(-90,270)).toBe(0);
  });

  it("closes surrounding apertures progressively toward the activation mark",()=>{
    expect(rotaryActivationProgress(-90,-90,0)).toBe(1);
    expect(rotaryActivationProgress(-45,-90,0)).toBeCloseTo(0.5);
    expect(rotaryActivationProgress(0,-90,0)).toBe(0);
    expect(rotaryActivationProgress(45,-90,0)).toBe(0);
  });

  it("activates only when released inside the dial alignment tolerance",()=>{
    expect(isRotaryAligned(-90)).toBe(true);
    expect(isRotaryAligned(-79)).toBe(true);
    expect(isRotaryAligned(-74)).toBe(false);
  });
});
