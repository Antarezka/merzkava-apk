import { describe, expect, it } from "vitest";
import {
  ARCANISTRY_LEVER_PULL_DISTANCE,
  ARCANISTRY_MIN_LOADING_MS,
  ARCANISTRY_TICKET_TEAR_DISTANCE,
  getArcanistryLeverAngle,
  isArcanistryLeverEngaged,
  isArcanistryTicketTorn
} from "../../src/offline-game/arcanistry-ticket-machine";

describe("Arcanistry ticket interaction", () => {
  it("requires a complete physical quadrant-lever pull before issuing a ticket", () => {
    expect(ARCANISTRY_LEVER_PULL_DISTANCE).toBe(43);
    expect(isArcanistryLeverEngaged(0)).toBe(false);
    expect(isArcanistryLeverEngaged(42.9)).toBe(false);
    expect(isArcanistryLeverEngaged(43)).toBe(true);
    expect(isArcanistryLeverEngaged(Number.POSITIVE_INFINITY)).toBe(false);
  });

  it("rotates the quadrant lever in the direction of the horizontal gesture", () => {
    expect(getArcanistryLeverAngle(0)).toBe(0);
    expect(getArcanistryLeverAngle(-56)).toBeCloseTo(-55);
    expect(getArcanistryLeverAngle(56)).toBeCloseTo(55);
    expect(getArcanistryLeverAngle(-28)).toBeLessThan(0);
    expect(getArcanistryLeverAngle(28)).toBeGreaterThan(0);
    expect(getArcanistryLeverAngle(Number.NaN)).toBe(0);
  });

  it("requires a deliberate downward pull before the ticket tears", () => {
    expect(ARCANISTRY_TICKET_TEAR_DISTANCE).toBe(62);
    expect(isArcanistryTicketTorn(0)).toBe(false);
    expect(isArcanistryTicketTorn(61.9)).toBe(false);
    expect(isArcanistryTicketTorn(62)).toBe(true);
    expect(isArcanistryTicketTorn(Number.NaN)).toBe(false);
  });

  it("keeps the transit loading sequence at least three seconds", () => {
    expect(ARCANISTRY_MIN_LOADING_MS).toBe(3000);
  });
});
