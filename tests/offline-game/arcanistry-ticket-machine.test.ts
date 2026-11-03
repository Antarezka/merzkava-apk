import { describe, expect, it } from "vitest";
import {
  ARCANISTRY_MIN_LOADING_MS,
  ARCANISTRY_TICKET_TEAR_DISTANCE,
  isArcanistryTicketTorn
} from "../../src/offline-game/arcanistry-ticket-machine";

describe("Arcanistry ticket interaction", () => {
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
