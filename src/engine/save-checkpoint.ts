export interface SaveTranscriptMessage {
  role: "player" | "gm";
  text: string;
}

export interface SaveCheckpointPromptInput {
  characterName: string;
  profileMarkdown: string;
  lastProfileStatus: string;
  transcript: SaveTranscriptMessage[];
}

/** Builds the dedicated GM instruction for a copyable Merzkava character checkpoint. */
export function buildSaveCheckpointPrompt(input: SaveCheckpointPromptInput): string {
  const transcript = input.transcript
    .map(message => (message.role === "player" ? "PLAYER: " : "GAME MASTER: ") + message.text)
    .join("\n\n");

  return [
    "TUGAS KHUSUS: BUAT CHARACTER SAVE CHECKPOINT MERZKAVA UNIVERSE.",
    "Karakter: " + input.characterName,
    "Ini bukan giliran gameplay. Jangan lanjutkan cerita, jangan membuat adegan baru, dan jangan mengubah state. Jawab hanya dengan dokumen checkpoint Markdown yang siap disalin pemain ke players/<Nama>.md.",
    "Gunakan seluruh transkrip gameplay kronologis di bawah, profil karakter sumber, panel profil GM terakhir, dan perubahan/ledger yang benar-benar tercatat. Ambil kondisi tepat pada titik sebelum tombol Save ditekan. Abaikan pesan checkpoint Save terdahulu sebagai sumber kejadian gameplay.",
    "Dilarang mengarang, menebak, menyimpulkan sebagai fakta, atau mengubah nilai yang tidak diketahui. Tulis 'Belum diketahui' bila tidak ada sumber. Bedakan fakta kanonis, fakta dari kejadian permainan, dan hal yang belum terverifikasi. Jangan menganggap usulan GM sebagai perubahan sah jika belum terjadi atau tercatat.",
    "Pertahankan istilah resmi Merzkava Universe: Spirit Realm, Sync progress, Spirit Ring Absorption, Martial Soul, Arcanist Grade, Arcanist Focus, HP, Satiety, Qi, Kondisi Tubuh, Equipment, Inventory, Assets Bangunan, Wallet (wealth), Teknik / Kemampuan, dan Tujuan Saat Ini. Wallet wajib memakai urutan xc | xs | xg | zj | az. Equipment terpisah dari Inventory; Assets Bangunan hanya aset yang dimiliki dan tercatat. Jangan membuat modul atau mekanik baru.",
    "KERANGKA SAVE WAJIB (pertahankan semua bagian; bila tidak ada data, tulis Belum diketahui):",
    "## 👤 " + input.characterName,
    "- Gender",
    "- Lokasi",
    "- Spirit Realm",
    "- Sync progress",
    "- Spirit Ring Absorption",
    "- Martial Soul",
    "- Arcanist Grade",
    "- Arcanist Focus",
    "- Hukum Kultivasi",
    "- Asal Hukum (Law Origin)",
    "- Sekte / Afiliasi",
    "- Kondisi: HP / Qi / Satiety / Kondisi Tubuh",
    "- Wallet (wealth)",
    "- Equipment",
    "- Inventory",
    "- Assets Bangunan",
    "- Teknik / Kemampuan",
    "- Latar Belakang & Kepribadian",
    "- Relasi dan NPC penting",
    "- Tujuan Saat Ini",
    "## Riwayat Kejadian & Perkembangan Terakhir",
    "## Ledger / Riwayat Transaksi",
    "Untuk field tambahan yang tidak ada dalam canon atau profil, pertahankan sebagai informasi naratif hanya jika benar-benar tercatat; jika tidak, tulis Belum diketahui. Jangan menciptakan angka Qi Cap atau Karma.",
    "STATUS PANEL PROFIL TERAKHIR: " + input.lastProfileStatus,
    "## PROFIL KARAKTER SUMBER",
    input.profileMarkdown || "Tidak ada file profil sumber tersimpan.",
    "## TRANSKRIP GAMEPLAY KRONOLOGIS",
    transcript || "Belum ada transkrip gameplay.",
    "KELUARAN: Markdown lengkap, rapi, tanpa JSON, tanpa code fence, tanpa kalimat pembuka atau penutup di luar dokumen. Jangan menyatakan file GitHub telah diperbarui; pemain yang akan menyalin dan menyimpannya sendiri."
  ].join("\n\n");
}
