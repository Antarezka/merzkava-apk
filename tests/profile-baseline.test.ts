import { describe, expect, it } from "vitest";
import { selectTrustedProfileBaseline } from "../src/engine/profile-baseline";
import type { ProfileField } from "../src/engine/profile-parser";

const values: Record<ProfileField, string> = {
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

const validMarkdown = Object.entries(values).map(([field, value]) => `- **${field}**: ${value}`).join("\n");

describe("trusted profile baseline selection", () => {
  it("accepts a valid source profile for a new session", () => {
    const result = selectTrustedProfileBaseline({ mode: "new", profileMarkdown: validMarkdown });
    expect(result.valid).toBe(true);
  });

  it("never promotes a previous GM panel into a continuation baseline when state is unverified", () => {
    const result = selectTrustedProfileBaseline({
      mode: "continue",
      profileMarkdown: validMarkdown,
      stateVerified: false
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.join(" ")).toContain("tidak boleh dipromosikan");
  });

  it("requires explicit verification before trusting a continuation profile", () => {
    const result = selectTrustedProfileBaseline({
      mode: "continue",
      profileMarkdown: validMarkdown,
      stateVerified: true
    });
    expect(result.valid).toBe(true);
  });

  it("still validates the profile fields after the verification gate", () => {
    const result = selectTrustedProfileBaseline({
      mode: "continue",
      profileMarkdown: "- **Nama**: Yuha",
      stateVerified: true
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.join(" ")).toContain("Field profil wajib");
  });
});
