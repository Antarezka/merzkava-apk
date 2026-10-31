import { describe, expect, it } from "vitest";
import { buildSaveCheckpointPrompt } from "../src/engine/save-checkpoint";

describe("Merzkava Save checkpoint prompt", () => {
  it("uses the adapted Merzkava framework and preserves the gameplay transcript", () => {
    const prompt = buildSaveCheckpointPrompt({
      characterName: "Yuha",
      profileMarkdown: "## PROFIL\nNama: Yuha\nWallet: 79 xc | 9 xs | 4 xg | 0 zj | 0 az",
      lastProfileStatus: "Panel terakhir tersedia.",
      transcript: [
        { role: "player", text: "Memasuki hutan." },
        { role: "gm", text: "Kabut turun di antara pepohonan." }
      ]
    });

    for (const field of [
      "Gender", "Lokasi", "Spirit Realm", "Sync progress", "Spirit Ring Absorption",
      "Martial Soul", "Arcanist Grade", "Arcanist Focus", "Hukum Kultivasi",
      "Asal Hukum (Law Origin)", "Sekte / Afiliasi", "Kondisi: HP / Qi / Satiety / Kondisi Tubuh",
      "Wallet (wealth)", "Equipment", "Inventory", "Assets Bangunan",
      "Teknik / Kemampuan", "Latar Belakang & Kepribadian", "Relasi dan NPC penting",
      "Tujuan Saat Ini", "Riwayat Kejadian & Perkembangan Terakhir", "Ledger / Riwayat Transaksi"
    ]) expect(prompt).toContain(field);

    expect(prompt).toContain("79 xc");
    expect(prompt).toContain("PLAYER: Memasuki hutan.");
    expect(prompt).toContain("GAME MASTER: Kabut turun di antara pepohonan.");
    expect(prompt).toContain("jangan membuat adegan baru");
    expect(prompt).toContain("pemain yang akan menyalin dan menyimpannya sendiri");
  });
});
