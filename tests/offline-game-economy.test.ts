import { describe, expect, it } from "vitest";
import { normalizeCopper, walletToCopper } from "../src/offline-game/mechanics/economy-wallet";
import { calculateItemPrice, disasterMultiplierAllowed } from "../src/offline-game/mechanics/economy-pricing";

describe("canon five-currency wallet arithmetic", () => {
  it("normalizes every official denomination without changing value", () => {
    expect(normalizeCopper(100)).toEqual({ az: 0, zj: 0, xg: 0, xs: 1, xc: 0 });
    expect(normalizeCopper(10_000)).toEqual({ az: 0, zj: 0, xg: 1, xs: 0, xc: 0 });
    expect(normalizeCopper(10_000_000)).toEqual({ az: 0, zj: 1, xg: 0, xs: 0, xc: 0 });
    expect(normalizeCopper(100_000_000)).toEqual({ az: 1, zj: 0, xg: 0, xs: 0, xc: 0 });
  });

  it("converts a mixed wallet to copper and returns normalized denominations", () => {
    expect(walletToCopper({ az: 1, zj: 2, xg: 3, xs: 4, xc: 5 })).toMatchObject({
      valid: true, totalCopper: 120_030_405,
      wallet: { az: 1, zj: 2, xg: 3, xs: 4, xc: 5 }
    });
  });

  it("rejects negative, fractional, and unsafe wallet amounts", () => {
    expect(walletToCopper({ az: -1, zj: 0, xg: 0, xs: 0, xc: 0 }).valid).toBe(false);
    expect(walletToCopper({ az: 0, zj: 0, xg: 0, xs: 0, xc: 0.5 }).valid).toBe(false);
    expect(normalizeCopper(-1)).toBeNull();
  });
});

describe("canon unified item pricing formula", () => {
  const ordinary = {
    tier: 1, baseCopper: 5, condition: "ordinary" as const,
    supply: "normal" as const, effectiveScarcity: 1,
    demand: "ordinary" as const, distributionCopper: 0, localMarketCopper: 0
  };

  it("reproduces the northern Snow Herb baseline and destination adjustments", () => {
    expect(calculateItemPrice({ ...ordinary, distributionCopper: 4 })).toMatchObject({
      valid: true, result: { rawCopper: 9, finalCopper: 9 }
    });
    expect(calculateItemPrice({ ...ordinary, distributionCopper: -1 })).toMatchObject({
      valid: true, result: { rawCopper: 4, finalCopper: 4 }
    });
  });

  it("applies the official tier, condition, scarcity, and demand multipliers", () => {
    expect(calculateItemPrice({
      ...ordinary, tier: 9, condition: "damaged",
      supply: "severe", effectiveScarcity: 2.4, demand: "veryHigh"
    })).toMatchObject({
      valid: true,
      result: {
        tierMultiplier: 8.5, conditionMultiplier: 0.7,
        scarcityMultiplier: 2.4, demandMultiplier: 1.5
      }
    });
  });

  it("uses one effective scarcity factor instead of stacking disaster and seasonal multipliers", () => {
    const result = calculateItemPrice({ ...ordinary, supply: "severe", effectiveScarcity: 2.4 });
    expect(result).toMatchObject({ valid: true, result: { scarcityMultiplier: 2.4, rawCopper: 12 } });
  });

  it("requires evidence for extreme/custom scarcity and exceptional demand", () => {
    expect(calculateItemPrice({ ...ordinary, supply: "extreme", effectiveScarcity: 4 })).toEqual({
      valid: false, error: "SCARCITY_EVIDENCE_REQUIRED"
    });
    expect(calculateItemPrice({ ...ordinary, demand: "exceptional" })).toEqual({
      valid: false, error: "DEMAND_EVIDENCE_REQUIRED"
    });
    expect(calculateItemPrice({
      ...ordinary, demand: "exceptional", demandEvidence: "documented festival demand"
    })).toMatchObject({ valid: true, result: { demandMultiplier: 2 } });
  });

  it("validates disaster impact multipliers against the official bounded bands", () => {
    expect(disasterMultiplierAllowed("minor", 1.1)).toBe(true);
    expect(disasterMultiplierAllowed("moderate", 1.6)).toBe(true);
    expect(disasterMultiplierAllowed("major", 1.7)).toBe(true);
    expect(disasterMultiplierAllowed("catastrophic", 3)).toBe(true);
    expect(disasterMultiplierAllowed("catastrophic", 3.01)).toBe(false);
  });

  it("rounds only once at the final copper price and rejects a negative result", () => {
    expect(calculateItemPrice({ ...ordinary, baseCopper: 1.5 })).toMatchObject({
      valid: true, result: { rawCopper: 1.5, finalCopper: 2 }
    });
    expect(calculateItemPrice({ ...ordinary, distributionCopper: -10 })).toEqual({
      valid: false, error: "NEGATIVE_PRICE"
    });
  });
});
