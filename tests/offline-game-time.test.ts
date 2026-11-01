import { describe, expect, it } from "vitest";
import {
  advanceEligibleCooldownMinutes,
  advanceFallbackCalendar,
  getFallbackSeason,
  getSpiritRingDayLeft,
  validateActionDuration
} from "../src/offline-game/mechanics/time";

describe("offline-game canon time and cooldown rules", () => {
  it("uses the official four three-month seasons", () => {
    expect([1, 3, 4, 6, 7, 9, 10, 12].map(getFallbackSeason)).toEqual([
      "Semi", "Semi", "Panas", "Panas", "Gugur", "Gugur", "Dingin", "Dingin"
    ]);
  });

  it("advances minutes across day, month, and year boundaries", () => {
    expect(advanceFallbackCalendar({
      year: 1024, month: 12, day: 30, hour: 23, minute: 30, weekdayIndex: 6
    }, 60)).toMatchObject({
      valid: true,
      result: {
        timestamp: { year: 1025, month: 1, day: 1, hour: 0, minute: 30, weekdayIndex: 0 },
        season: "Semi",
        dayRolloverCount: 1
      }
    });
  });

  it("rejects invalid dates and negative elapsed time", () => {
    expect(advanceFallbackCalendar({
      year: 1024, month: 13, day: 1, hour: 0, minute: 0, weekdayIndex: 0
    }, 10)).toEqual({ valid: false, error: "INVALID_TIMESTAMP" });
    expect(advanceFallbackCalendar({
      year: 1024, month: 1, day: 1, hour: 0, minute: 0, weekdayIndex: 0
    }, -1)).toEqual({ valid: false, error: "INVALID_ELAPSED_MINUTES" });
  });

  it("enforces the three-hour ordinary action limit", () => {
    expect(validateActionDuration({ kind: "NORMAL", durationMinutes: 180 }).allowed).toBe(true);
    expect(validateActionDuration({ kind: "NORMAL", durationMinutes: 181 })).toMatchObject({
      allowed: false, maxMinutes: 180
    });
  });

  it("allows protected night sleep beyond the ordinary action limit", () => {
    expect(validateActionDuration({ kind: "NIGHT_SLEEP", durationMinutes: 480 })).toMatchObject({
      allowed: true, maxMinutes: null
    });
  });

  it("requires every pure-cultivation condition and caps it at thirty days", () => {
    const allConditions = {
      pureCultivationOnly: true,
      safeStationaryLocation: true,
      sufficientLogistics: true,
      checkpointsRecorded: true,
      interruptionsAccounted: true,
      satietyAccountingVerified: true
    };
    expect(validateActionDuration({
      kind: "PURE_CULTIVATION", durationMinutes: 30 * 1440,
      pureCultivationConditions: allConditions
    }).allowed).toBe(true);
    expect(validateActionDuration({
      kind: "PURE_CULTIVATION", durationMinutes: 30 * 1440 + 1,
      pureCultivationConditions: allConditions
    }).allowed).toBe(false);
    expect(validateActionDuration({
      kind: "PURE_CULTIVATION", durationMinutes: 1440,
      pureCultivationConditions: { ...allConditions, sufficientLogistics: false }
    })).toMatchObject({ allowed: false, maxMinutes: 180 });
  });

  it("excludes cultivation time from cooldown while counting normal time and sleep", () => {
    expect(advanceEligibleCooldownMinutes(100, 1440, "PURE_CULTIVATION")).toBe(100);
    expect(advanceEligibleCooldownMinutes(100, 480, "NIGHT_SLEEP")).toBe(580);
    expect(advanceEligibleCooldownMinutes(100, 60, "NORMAL")).toBe(160);
  });

  it("rounds remaining Spirit Ring interval upward to full days", () => {
    expect(getSpiritRingDayLeft(24, 0, true)).toBe(1);
    expect(getSpiritRingDayLeft(25, 0, true)).toBe(2);
    expect(getSpiritRingDayLeft(48, 24 * 60, true)).toBe(1);
    expect(getSpiritRingDayLeft(48, 48 * 60, true)).toBe(0);
  });

  it("distinguishes not-started cooldown from ninth-ring infinity", () => {
    expect(getSpiritRingDayLeft(24, 0, false)).toBeNull();
    expect(getSpiritRingDayLeft(0, 0, true, true)).toBe("INFINITE");
  });
});
