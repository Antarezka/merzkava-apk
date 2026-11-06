import { describe, expect, it } from "vitest";
import { DEFAULT_ISOMETRIC_GRID, type IsoMapGridConfig } from "../../src/offline-game/isometric-map-editor";
import { getIsoMovementOffset, startNativeMotion } from "../../src/offline-game/isometric-runtime-performance";

describe("isometric actor movement projection", () => {

  it("uses Element.animate without introducing a second animation package", () => {
    const animation = { cancel: () => undefined } as unknown as Animation;
    const element = {
      animate: (_frames:Keyframe[], _options:KeyframeAnimationOptions) => animation,
    } as unknown as Element;
    expect(startNativeMotion(element,[{opacity:0},{opacity:1}],{duration:100})).toBe(animation);
  });

  it("falls back safely when native animation is unavailable", () => {
    const element = {} as Element;
    expect(startNativeMotion(element,[{opacity:0},{opacity:1}],{duration:100})).toBeNull();
  });

  it("returns the inverse screen displacement for east and south steps", () => {
    expect(getIsoMovementOffset({x:3,y:2},{x:4,y:2},DEFAULT_ISOMETRIC_GRID)).toEqual({x:-32,y:-16});
    expect(getIsoMovementOffset({x:3,y:2},{x:3,y:3},DEFAULT_ISOMETRIC_GRID)).toEqual({x:32,y:-16});
  });

  it("preserves fractional sub-cell movement and camera scaling", () => {
    const result = getIsoMovementOffset(
      {x:3.1,y:2.5},
      {x:3.4,y:2.7},
      DEFAULT_ISOMETRIC_GRID,
      2,
      1.5,
      1.25,
    );
    expect(result.x).toBeCloseTo(-2.4, 8);
    expect(result.y).toBeCloseTo(-5, 8);
  });

  it("supports Academy tile dimensions and safely handles an invalid zoom", () => {
    const academy:IsoMapGridConfig={...DEFAULT_ISOMETRIC_GRID,tileW:128,tileH:69.5};
    expect(getIsoMovementOffset({x:12,y:31},{x:12,y:32},academy,0)).toEqual({x:64,y:-34.75});
  });
});
