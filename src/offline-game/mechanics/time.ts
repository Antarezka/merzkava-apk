/**
 * Offline-game calendar, action-duration, and Spirit Ring cooldown rules.
 *
 * Source: Antarezka/merzkava-universe/gameplay/TIME_AND_ACTION_RULES.md
 * Upstream commit: 2f76a864150528afb0e3d26cb16f9396ce610ff6
 * Upstream blob: f4ad8b2e1afc0bc9ef25f8f9d97eb541ab7ea29f
 *
 * Calendar arithmetic uses the official fallback calendar only. Session era,
 * initial date, weather, and starting weekday are session decisions supplied
 * by the caller; this module does not invent global chronology.
 */

export const FALLBACK_MONTHS_PER_YEAR = 12;
export const FALLBACK_DAYS_PER_MONTH = 30;
export const FALLBACK_DAYS_PER_WEEK = 7;
export const MAX_ORDINARY_ACTION_MINUTES = 180;
export const MAX_PURE_CULTIVATION_DAYS = 30;

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Season = "Semi" | "Panas" | "Gugur" | "Dingin";
export type TimeActionKind = "NORMAL" | "NIGHT_SLEEP" | "PURE_CULTIVATION";

export interface SessionTimestamp {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekdayIndex: WeekdayIndex;
}

export interface CalendarAdvance {
  timestamp: SessionTimestamp;
  season: Season;
  elapsedMinutes: number;
  dayRolloverCount: number;
}

export type CalendarResult =
  | { valid: true; result: CalendarAdvance }
  | { valid: false; error: "INVALID_TIMESTAMP" | "INVALID_ELAPSED_MINUTES" };

export interface ActionDurationInput {
  kind: TimeActionKind;
  durationMinutes: number;
  pureCultivationConditions?: {
    pureCultivationOnly: boolean;
    safeStationaryLocation: boolean;
    sufficientLogistics: boolean;
    checkpointsRecorded: boolean;
    interruptionsAccounted: boolean;
  };
}

export type ActionDurationResult =
  | { allowed: true; maxMinutes: number | null; reason: string }
  | { allowed: false; maxMinutes: number; reason: string };

export function getFallbackSeason(month: number): Season | null {
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (month <= 3) return "Semi";
  if (month <= 6) return "Panas";
  if (month <= 9) return "Gugur";
  return "Dingin";
}

function isValidTimestamp(value: SessionTimestamp): boolean {
  return Number.isInteger(value.year) &&
    Number.isInteger(value.month) && value.month >= 1 && value.month <= 12 &&
    Number.isInteger(value.day) && value.day >= 1 && value.day <= 30 &&
    Number.isInteger(value.hour) && value.hour >= 0 && value.hour <= 23 &&
    Number.isInteger(value.minute) && value.minute >= 0 && value.minute <= 59 &&
    Number.isInteger(value.weekdayIndex) && value.weekdayIndex >= 0 && value.weekdayIndex <= 6;
}

export function advanceFallbackCalendar(
  timestamp: SessionTimestamp,
  elapsedMinutes: number
): CalendarResult {
  if (!isValidTimestamp(timestamp)) return { valid: false, error: "INVALID_TIMESTAMP" };
  if (!Number.isSafeInteger(elapsedMinutes) || elapsedMinutes < 0) {
    return { valid: false, error: "INVALID_ELAPSED_MINUTES" };
  }

  const absoluteMinute =
    (((timestamp.year * 12 + (timestamp.month - 1)) * 30 + (timestamp.day - 1)) * 1440) +
    timestamp.hour * 60 + timestamp.minute + elapsedMinutes;
  const absoluteDay = Math.floor(absoluteMinute / 1440);
  const minuteOfDay = absoluteMinute % 1440;
  const dayOfYear = absoluteDay % 360;
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;
  const year = Math.floor(absoluteDay / 360);
  const dayRolloverCount = Math.floor((timestamp.hour * 60 + timestamp.minute + elapsedMinutes) / 1440);
  const weekdayIndex = ((timestamp.weekdayIndex + dayRolloverCount) % 7) as WeekdayIndex;

  return {
    valid: true,
    result: {
      timestamp: {
        year, month, day,
        hour: Math.floor(minuteOfDay / 60),
        minute: minuteOfDay % 60,
        weekdayIndex
      },
      season: getFallbackSeason(month)!,
      elapsedMinutes,
      dayRolloverCount
    }
  };
}

export function validateActionDuration(input: ActionDurationInput): ActionDurationResult {
  if (!Number.isSafeInteger(input.durationMinutes) || input.durationMinutes < 0) {
    return { allowed: false, maxMinutes: 0, reason: "INVALID_ACTION_DURATION." };
  }
  if (input.kind === "NIGHT_SLEEP") {
    return { allowed: true, maxMinutes: null, reason: "PROTECTED_NIGHT_SLEEP_EXEMPT_FROM_ORDINARY_ACTION_LIMIT." };
  }
  if (input.kind === "NORMAL") {
    if (input.durationMinutes > MAX_ORDINARY_ACTION_MINUTES) {
      return { allowed: false, maxMinutes: MAX_ORDINARY_ACTION_MINUTES, reason: "ORDINARY_ACTION_LIMIT_EXCEEDED." };
    }
    return { allowed: true, maxMinutes: MAX_ORDINARY_ACTION_MINUTES, reason: "WITHIN_ORDINARY_ACTION_LIMIT." };
  }
  if (input.durationMinutes > MAX_PURE_CULTIVATION_DAYS * 1440) {
    return { allowed: false, maxMinutes: MAX_PURE_CULTIVATION_DAYS * 1440, reason: "PURE_CULTIVATION_MAXIMUM_EXCEEDED." };
  }

  const conditions = input.pureCultivationConditions;
  const verified = !!conditions &&
    conditions.pureCultivationOnly &&
    conditions.safeStationaryLocation &&
    conditions.sufficientLogistics &&
    conditions.checkpointsRecorded &&
    conditions.interruptionsAccounted;

  if (!verified) {
    return { allowed: false, maxMinutes: MAX_ORDINARY_ACTION_MINUTES, reason: "PURE_CULTIVATION_PREREQUISITES_NOT_ALL_VERIFIED." };
  }
  return { allowed: true, maxMinutes: MAX_PURE_CULTIVATION_DAYS * 1440, reason: "VERIFIED_PURE_CULTIVATION_EXCEPTION." };
}

export function advanceEligibleCooldownMinutes(
  previousEligibleMinutes: number,
  elapsedMinutes: number,
  actionKind: TimeActionKind
): number | null {
  if (!Number.isSafeInteger(previousEligibleMinutes) || previousEligibleMinutes < 0) return null;
  if (!Number.isSafeInteger(elapsedMinutes) || elapsedMinutes < 0) return null;
  return previousEligibleMinutes + (actionKind === "PURE_CULTIVATION" ? 0 : elapsedMinutes);
}

export function getSpiritRingDayLeft(
  minimumIntervalHours: number,
  eligibleElapsedMinutes: number,
  cooldownStarted: boolean,
  ninthRingAtSpiritRealmNine = false
): number | null | "INFINITE" {
  if (ninthRingAtSpiritRealmNine) return "INFINITE";
  if (!cooldownStarted) return null;
  if (!Number.isFinite(minimumIntervalHours) || minimumIntervalHours < 0) return null;
  if (!Number.isSafeInteger(eligibleElapsedMinutes) || eligibleElapsedMinutes < 0) return null;

  const minimumMinutes = minimumIntervalHours * 60;
  const remainingMinutes = Math.max(0, minimumMinutes - eligibleElapsedMinutes);
  return remainingMinutes === 0 ? 0 : Math.ceil(remainingMinutes / 1440);
}
