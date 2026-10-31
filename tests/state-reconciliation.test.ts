import { describe, expect, it } from "vitest";
import { reconcileGMProposal } from "../src/engine/state-reconciliation";
import type { GMProposal } from "../src/engine/gm-engine";
import type { ParsedCharacterProfile, ProfileField } from "../src/engine/profile-parser";

const profileFields: Record<ProfileField, string> = {
  "Nama": "Yuha",
  "Usia": "14",
  "Spirit Realm": "Mortal",
  "Sync progress": "0%/0%",
  "Spirit Ring Absorption": "``None`` | ? Day left",
  "Martial Soul": "Belum terbangun",
  "Arcanist Grade": "Grade 0",
  "Arcanist Focus": "0%",
  "HP": "100/100",
  "Satiety": "100/100",
  "Qi": "0",
  "Kondisi Tubuh": "Normal",
  "Equipment": "None",
  "Inventory": "None",
  "Assets Bangunan": "None",
  "Wallet (wealth)": "79 xc | 9 xs | 4 xg | 0 zj | 0 az",
  "Teknik / Kemampuan": "None",
  "Tujuan Saat Ini": "None"
};

function proposal(changes: GMProposal["state_changes"]): GMProposal {
  return {
    snapshot: "a".repeat(40),
    version: "v4.0.15",
    narration: "Test narration",
    outcome: "Test outcome",
    player_response: "Test player response",
    canon_basis: ["core/10_ECONOMY_SYSTEM.md"],
    proposed_changes: [],
    state_changes: changes,
    ledger_events: [],
    unresolved_questions: [],
    world_time: { era: null, year: null, season: null, date: null, weekday: null, weather: null, hour: null, cycle: null }
  };
}

const profile: ParsedCharacterProfile = { fields: { ...profileFields }, source: "markdown" };

describe("GM state reconciliation", () => {
  it("marks a matching delta as a candidate, never as an automatic commit", () => {
    const result = reconcileGMProposal(profile, proposal([{
      field: "HP", before: "100/100", after: "80/100",
      reason: "Damage from a verified encounter", canon_basis: ["core/COMBAT_SYSTEM.md"]
    }]));
    expect(result.status).toBe("review-required");
    expect(result.changes).toHaveLength(1);
    expect(result.changes[0].status).toBe("candidate");
  });

  it("rejects a delta whose before value does not match the active profile", () => {
    const result = reconcileGMProposal(profile, proposal([{
      field: "HP", before: "90/100", after: "80/100",
      reason: "Damage", canon_basis: ["core/COMBAT_SYSTEM.md"]
    }]));
    expect(result.status).toBe("rejected");
    expect(result.changes[0].status).toBe("rejected");
    expect(result.errors.join(" ")).toContain("before tidak cocok");
  });

  it("rejects a Wallet value that does not use the canonical denomination order", () => {
    const result = reconcileGMProposal(profile, proposal([{
      field: "Wallet (wealth)", before: profileFields["Wallet (wealth)"],
      after: "79 xc | 9 xg | 4 xs | 0 zj | 0 az",
      reason: "Transaction", canon_basis: ["core/10_ECONOMY_SYSTEM.md"]
    }]));
    expect(result.status).toBe("rejected");
    expect(result.errors.join(" ")).toContain("urutan denominasi resmi");
  });

  it("requires review when no trusted profile baseline exists", () => {
    const result = reconcileGMProposal(null, proposal([{
      field: "HP", before: "100/100", after: "80/100",
      reason: "Damage", canon_basis: ["core/COMBAT_SYSTEM.md"]
    }]));
    expect(result.status).toBe("review-required");
    expect(result.changes[0].status).toBe("needs-review");
  });

  it("rejects duplicate mutations to the same profile field", () => {
    const result = reconcileGMProposal(profile, proposal([
      { field: "HP", before: "100/100", after: "80/100", reason: "Damage", canon_basis: ["core/COMBAT_SYSTEM.md"] },
      { field: "HP", before: "100/100", after: "70/100", reason: "More damage", canon_basis: ["core/COMBAT_SYSTEM.md"] }
    ]));
    expect(result.status).toBe("rejected");
    expect(result.errors.join(" ")).toContain("lebih dari sekali");
  });

  it("reports no changes only when the proposal contains no state delta", () => {
    const result = reconcileGMProposal(profile, proposal([]), profile);
    expect(result.status).toBe("no-changes");
    expect(result.changes).toHaveLength(0);
  });
});
