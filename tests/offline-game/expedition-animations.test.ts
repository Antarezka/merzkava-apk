import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const scope = {
    add: vi.fn(),
    revert: vi.fn(),
  };
  return {
    animate: vi.fn(),
    createScope: vi.fn(() => scope),
    scope,
    stagger: vi.fn((value: number) => value),
  };
});

vi.mock("animejs", () => ({
  animate: mocks.animate,
  createScope: mocks.createScope,
  stagger: mocks.stagger,
}));

import { mountExpeditionAnimations } from "../../src/offline-game/expedition-animations";

describe("Eternal Path Anime.js motion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.scope.add.mockImplementation((setup: (self: { matches: { reduceMotion: boolean } }) => void) => {
      setup({ matches: { reduceMotion: false } });
      return mocks.scope;
    });
  });

  it("scopes entrance and looping fog motion to the supplied Expedition root", () => {
    const entranceTargets = [{}, {}, {}];
    const fog = {};
    const root = {
      querySelectorAll: vi.fn(() => entranceTargets),
      querySelector: vi.fn(() => fog),
    } as unknown as HTMLElement;

    const dispose = mountExpeditionAnimations(root);

    expect(mocks.createScope).toHaveBeenCalledWith(expect.objectContaining({ root }));
    expect(mocks.animate).toHaveBeenCalledTimes(3);
    expect(mocks.animate).toHaveBeenNthCalledWith(1, entranceTargets, expect.objectContaining({
      opacity: [0, 1],
      translateY: [12, 0],
    }));
    expect(mocks.animate).toHaveBeenNthCalledWith(2, fog, expect.objectContaining({
      loop: true,
      alternate: true,
      ease: "inOutSine",
    }));

    dispose();
    expect(mocks.scope.revert).toHaveBeenCalledOnce();
  });

  it("does not animate when reduced motion is requested", () => {
    mocks.scope.add.mockImplementation((setup: (self: { matches: { reduceMotion: boolean } }) => void) => {
      setup({ matches: { reduceMotion: true } });
      return mocks.scope;
    });

    const root = {
      querySelectorAll: vi.fn(() => [{}]),
      querySelector: vi.fn(() => ({})),
    } as unknown as HTMLElement;

    mountExpeditionAnimations(root);
    expect(mocks.animate).not.toHaveBeenCalled();
  });
});
