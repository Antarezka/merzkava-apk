import { describe, expect, it } from "vitest";
import {
  ARCANISTRY_LEVER_PULL_DISTANCE,
  ARCANISTRY_MIN_LOADING_MS,
  ARCANISTRY_TICKET_TEAR_DISTANCE,
  createArcanistryCode,
  isArcanistryCodeCorrect,
  isArcanistryLeverEngaged,
  isArcanistryTicketTorn
} from "../../src/offline-game/arcanistry-ticket-machine";

describe("Arcanistry ticket interaction", () => {
  it("requires a complete physical lever pull before issuing a ticket", () => {
    expect(ARCANISTRY_LEVER_PULL_DISTANCE).toBe(43);
    expect(isArcanistryLeverEngaged(42.9)).toBe(false);
    expect(isArcanistryLeverEngaged(43)).toBe(true);
  });

  it("requires a deliberate downward pull before the ticket tears", () => {
    expect(ARCANISTRY_TICKET_TEAR_DISTANCE).toBe(62);
    expect(isArcanistryTicketTorn(0)).toBe(false);
    expect(isArcanistryTicketTorn(61.9)).toBe(false);
    expect(isArcanistryTicketTorn(62)).toBe(true);
    expect(isArcanistryTicketTorn(Number.NaN)).toBe(false);
  });

  it("creates four-digit codes including leading zeroes", () => {
    expect(createArcanistryCode(() => 0)).toBe("0000");
    expect(createArcanistryCode(() => 0.0724)).toBe("0724");
    expect(createArcanistryCode(() => 0.999999)).toBe("9999");
  });

  it("accepts only an exact four-digit code match", () => {
    expect(isArcanistryCodeCorrect("0724", "0724")).toBe(true);
    expect(isArcanistryCodeCorrect("0724", "724")).toBe(false);
    expect(isArcanistryCodeCorrect("0724", "0725")).toBe(false);
    expect(isArcanistryCodeCorrect("0724", "07a4")).toBe(false);
  });

  it("keeps the transit loading sequence at least three seconds", () => {
    expect(ARCANISTRY_MIN_LOADING_MS).toBe(3000);
  });
});
