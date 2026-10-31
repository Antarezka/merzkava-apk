import { describe, expect, it } from "vitest";
import { buildSaveCheckpointPrompt } from "../src/engine/save-checkpoint";

describe("Merzkava Save checkpoint prompt", () => {
  it("uses the canonical Merzkava profile order and preserves the gameplay transcript", () => {
    const prompt = buildSaveCheckpointPrompt({
      characterName: "Yuha",
      profileMarkdown: "## PROFIL\nNama: Yuha\nWallet: 79 xc | 9 xs | 4 xg | 0 zj | 0 az",
      lastProfileStatus: "Panel terakhir tersedia.",
      transcript: [
        { role: "player", text: "Memasuki hutan." },
        { role: "gm", text: "Kabut turun di antara pepohonan." }
      ]
    });

    const canonicalFields = [
      "Nama", "Usia", "Spirit Realm", "Sync progress", "Spirit Ring Absorption",
      "Martial Soul", "Arcanist Grade", "Arcanist Focus", "HP", "Satiety", "Qi",
      "Kondisi Tubuh", "Equipment", "Inventory", "Assets Bangunan", "Wallet (wealth)",
      "Teknik / Kemampuan", "Tujuan Saat Ini"
    ];
    let previousIndex = -1;
    for (const field of canonicalFields) {
      const index = prompt.indexOf("- " + field);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }

    for (const field of [
      "Gender", "Lokasi", "Sekte / Afiliasi", "Latar Belakang & Kepribadian",
      "Relasi dan NPC Penting", "Riwayat Kejadian & Perkembangan Terakhir",
      "Ledger / Riwayat Transaksi"
    ]) expect(prompt).toContain(field);

    expect(prompt).not.toContain("Hukum Kultivasi");
    expect(prompt).not.toContain("Law Origin");
    expect(prompt).not.toContain("Qi Cap");
    expect(prompt).not.toContain("Karma");
    expect(prompt).toContain("79 xc");
    expect(prompt).toContain("PLAYER: Memasuki hutan.");
    expect(prompt).toContain("GAME MASTER: Kabut turun di antara pepohonan.");
    expect(prompt).toContain("jangan membuat adegan baru");
    expect(prompt).toContain("pemain yang akan menyalin dan menyimpannya sendiri");
  });
});
