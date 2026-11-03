import { describe, expect, it } from "vitest";
import { canCommitRotaryActivation, isRotaryAligned, parseRotaryApertureAngle, rotaryActivationProgress, rotaryAngularDistance, rotaryDragAngle, rotaryPointerDelta } from "../../src/offline-game/arcanistry-rotary";

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

  it("derives the aperture angle independently from the finger grab offset",()=>{
    expect(rotaryDragAngle(42,0,20)).toBe(62);
    expect(rotaryDragAngle(42,20,40)).toBe(62);
    expect(rotaryDragAngle(42,170,-170)).toBe(62);
    expect(rotaryDragAngle(42,-170,170)).toBe(22);
  });

  it("reads the authored aperture angle from its CSS custom property",()=>{
    expect(parseRotaryApertureAngle("42deg")).toBe(42);
    expect(parseRotaryApertureAngle("-90deg")).toBe(-90);
    expect(parseRotaryApertureAngle("")).toBeNull();
    expect(parseRotaryApertureAngle("not-an-angle")).toBeNull();
  });

  it("uses the fixed activation mark and includes the exact tolerance boundary",()=>{
    expect(isRotaryAligned(-90)).toBe(true);
    expect(isRotaryAligned(-77)).toBe(true);
    expect(isRotaryAligned(-103)).toBe(true);
    expect(isRotaryAligned(-76.99)).toBe(false);
    expect(isRotaryAligned(-103.01)).toBe(false);
  });

  it("does not commit merely by reaching threshold; a valid release is required",()=>{
    expect(canCommitRotaryActivation(-90,{released:false,hasDestination:true,thresholdReachedDuringDrag:true})).toBe(false);
    expect(canCommitRotaryActivation(-90,{released:true,cancelled:true,hasDestination:true,thresholdReachedDuringDrag:true})).toBe(false);
    expect(canCommitRotaryActivation(-90,{released:true,hasDestination:false,thresholdReachedDuringDrag:true})).toBe(false);
    expect(canCommitRotaryActivation(-90,{released:true,hasDestination:true,thresholdReachedDuringDrag:false})).toBe(false);
    expect(canCommitRotaryActivation(-90,{released:true,hasDestination:true,thresholdReachedDuringDrag:true})).toBe(true);
    expect(canCommitRotaryActivation(-76,{released:true,hasDestination:true,thresholdReachedDuringDrag:true})).toBe(false);
  });
});
