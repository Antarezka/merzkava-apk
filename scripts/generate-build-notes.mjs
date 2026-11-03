import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const run = (args, fallback = "") => {
  try {
    return execFileSync("git", args, { encoding: "utf8" }).trim();
  } catch {
    return fallback;
  }
};

const head = process.env.GITHUB_SHA || run(["rev-parse", "HEAD"]);
const eventBefore = process.env.GITHUB_EVENT_BEFORE || "";
const validBefore = /^[0-9a-f]{40}$/i.test(eventBefore) && eventBefore !== "0".repeat(40);
let base = validBefore && run(["cat-file", "-e", `${eventBefore}^{commit}`], "__missing__") !== "__missing__"
  ? eventBefore
  : run(["rev-parse", `${head}^1`], head);

if (!base) base = head;
const short = (sha) => sha ? sha.slice(0, 12) : "unknown";
const runNumber = process.env.GITHUB_RUN_NUMBER || "local";
const attempt = process.env.GITHUB_RUN_ATTEMPT || "1";
const version = process.env.VITE_APP_VERSION || `v.1.01.${runNumber}-${String(head).slice(0, 3)}`;
const branch = process.env.GITHUB_REF_NAME || run(["branch", "--show-current"], "unknown");
const repository = process.env.GITHUB_REPOSITORY || "Antarezka/merzkava-apk";
const runUrl = process.env.GITHUB_RUN_ID
  ? `https://github.com/${repository}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : "Local build (no Actions run URL)";
const now = new Date();
const date = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta", dateStyle: "full", timeStyle: "long", hour12: false
}).format(now) + " WIB";
const isoWib = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
}).format(now).replace(" ", "T") + "+07:00";

const logRaw = run(["log", "--reverse", "--format=%H%x1f%s%x1f%b%x1e", `${base}..${head}`]);
const commits = logRaw.split("\x1e").map((entry) => entry.trim()).filter(Boolean).map((entry) => {
  const [sha, subject, ...body] = entry.split("\x1f");
  return { sha, subject, body: body.join("\n").trim() };
});
const diffRaw = run(["diff", "--name-status", "-M", base, head]);
const changes = diffRaw.split("\n").filter(Boolean).map((line) => {
  const [status, ...paths] = line.split("\t");
  return { status, paths };
});
const list = (status) => changes.filter((item) => item.status[0] === status);
const fmt = (items) => items.length
  ? items.map((item) => item.status.startsWith("R")
      ? `- \`${item.paths[0]}\` → \`${item.paths[1]}\` (rename, ${item.status})`
      : `- \`${item.paths.join(" → ")}\` (${item.status})`).join("\n")
  : "- Tidak ada perubahan pada kategori ini.";
const classify = (pattern) => commits.filter((c) => pattern.test(`${c.subject}\n${c.body}`));
const commitBlock = (items) => items.length
  ? items.map((c) => `- **${c.subject}** (\`${short(c.sha)}\`)${c.body ? `\n  ${c.body.split("\n").filter(Boolean).join("\n  ")}` : ""}`).join("\n")
  : "- Tidak ada commit terpisah yang terdeteksi.";
const addedCommits = classify(/\b(feat|feature|add|introduc|implement|create)\b/i);
const updatedCommits = classify(/\b(update|updat|improv|refin|polish|fix|repair|adjust|tweak|optimi[sz])\b/i);
const removedCommits = classify(/\b(remove|removed|delete|deleted|drop|deprecat)\b/i);
const replacedCommits = classify(/\b(replace|replaced|rename|renamed|migrat|swap)\b/i);
const renamedFiles = changes.filter((item) => item.status.startsWith("R"));
const deletedFiles = list("D");
const allCommitBlock = commitBlock(commits);

const content = `# MERZKAVA — BUILD RECORD

> Satu catatan untuk satu APK. Dokumen ini ikut dikemas bersama APK dan juga disertakan di dalam aset aplikasi sebagai \`/BUILD_NOTES.md\`.
> Ringkasan fitur di bawah bersumber dari pesan commit; daftar file adalah bukti perubahan teknis. Jangan menyimpulkan fitur berjalan hanya dari nama file.

## 1. Identitas build
- **Produk:** Merzkava APK
- **Nomor build:** \`#${runNumber}\` (attempt \`${attempt}\`)
- **Versi aplikasi:** \`${version}\`
- **Waktu dibuat:** ${date}
- **Timestamp WIB:** \`${isoWib}\`
- **Branch:** \`${branch}\`
- **Commit sumber:** \`${head}\`
- **Commit pembanding:** \`${base}\` (\`${short(base)}\`)
- **Rentang perubahan:** \`${short(base)}.. ${short(head)}\`
- **Workflow:** ${runUrl}

## 2. Fitur baru / penambahan
${commitBlock(addedCommits)}

## 3. Pembaruan / perbaikan
${commitBlock(updatedCommits)}

## 4. Penghapusan
${commitBlock(removedCommits)}
### File yang dihapus
${fmt(deletedFiles)}

## 5. Penggantian / rename / migrasi
${commitBlock(replacedCommits)}
### Rename file yang terdeteksi
${fmt(renamedFiles)}
- Penggantian perilaku/fitur harus dijelaskan eksplisit di pesan commit; Git tidak dapat menyimpulkan pengganti hanya dari perubahan isi file.

## 6. Perubahan teknis lengkap
### File baru
${fmt(list("A"))}

### File diubah
${fmt(list("M"))}

### File dihapus
${fmt(deletedFiles)}

### File diganti nama
${fmt(renamedFiles)}

## 7. Riwayat commit dalam rentang build
${allCommitBlock}

## 8. Status verifikasi
- **Build web / APK:** lihat hasil job pada tautan Workflow di atas.
- **Verifikasi package, versionCode, versionName, alignment, signature:** lihat langkah verifikasi pada workflow.
- **Uji instalasi emulator:** lihat hasil langkah Android 14 emulator pada workflow.
- **Status ini tidak diklaim sukses oleh dokumen pra-build.** Gunakan status akhir GitHub Actions untuk menentukan pass/fail.

## 9. Catatan pembanding versi
- Commit pembanding adalah sumber kode sebelum perubahan build ini (atau parent commit untuk workflow manual).
- Nomor versi APK sebelumnya tidak ditebak. Cocokkan dengan BUILD_RECORD dari APK sebelumnya bila tersedia.
- Untuk perubahan fitur, pesan commit wajib menyebutkan: apa yang ditambahkan/diubah/diperbaiki/dihapus, nama fitur lama, penggantinya, dan versi/commit asal bila relevan.
- Bila suatu fitur hanya berubah secara visual atau kode tetapi belum diuji, tulis sebagai **belum diverifikasi**, bukan fitur selesai.

---
**AI HANDOFF RULE:** Gunakan dokumen ini sebagai sumber ringkas perubahan build. Jangan menganggap fitur yang tidak tercantum sebagai baru; jangan menganggap penghapusan atau penggantian terjadi kecuali dijelaskan di bagian 4/5 atau dibuktikan oleh daftar file dan commit.
`;

const output = resolve("public/BUILD_NOTES.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, content, "utf8");
console.log(`Generated ${output} for build #${runNumber} (${short(head)}), compared with ${short(base)}.`);
