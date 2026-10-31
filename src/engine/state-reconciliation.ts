import type { GMProposal } from "./gm-engine";
import type { ParsedCharacterProfile, ProfileField } from "./profile-parser";

export interface ProposedStateChange {
  field: string;
  before: string;
  after: string;
  reason: string;
  canon_basis: string[];
}

export interface ReconciledChange {
  field: string;
  before: string;
  after: string;
  status: "candidate" | "rejected" | "needs-review";
  reason: string;
}

export interface StateReconciliation {
  status: "no-changes" | "review-required" | "rejected";
  changes: ReconciledChange[];
  errors: string[];
}

const deterministicFields = new Set<ProfileField>([
  "Nama", "Usia", "Spirit Realm", "Sync progress", "Spirit Ring Absorption",
  "Martial Soul", "Arcanist Grade", "Arcanist Focus", "HP", "Satiety", "Qi",
  "Kondisi Tubuh", "Equipment", "Inventory", "Assets Bangunan", "Wallet (wealth)",
  "Teknik / Kemampuan", "Tujuan Saat Ini"
]);

function normalizeFieldValue(value: string): string {
  const normalized = value.trim().replace(/``/g, "").replace(/\*/g, "").trim();
  const noteStart = normalized.lastIndexOf(" (");
  return noteStart > 0 ? normalized.slice(0, noteStart).trim() : normalized;
}

function validateAfterValue(field: string, value: string): string | null {
  if (!value.trim()) return "Nilai sesudah tidak boleh kosong.";
  if (field === "HP") {
    const m = value.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (!m || Number(m[2]) <= 0 || Number(m[1]) > Number(m[2])) return "Format/rentang HP tidak valid.";
  }
  if (field === "Satiety") {
    const m = value.match(/^(\d+)\s*\/\s*100$/);
    if (!m || Number(m[1]) > 100) return "Satiety harus berada pada rentang 0–100.";
  }
  if (field === "Wallet (wealth)" && !/^\d+\s*xc\s*\|\s*\d+\s*xs\s*\|\s*\d+\s*xg\s*\|\s*\d+\s*zj\s*\|\s*\d+\s*az$/i.test(value)) {
    return "Format Wallet tidak sesuai urutan denominasi resmi.";
  }
  return null;
}

/**
 * Reconcile a proposal against the exact parsed profile baseline.
 * Candidate means structurally consistent only; canon mechanics and player approval are still required.
 */
export function reconcileGMProposal(profile: ParsedCharacterProfile | null, proposal: GMProposal, responseProfile?: ParsedCharacterProfile | null, responseText?: string): StateReconciliation {
  if (!profile) {
    return {
      status: "review-required",
      changes: proposal.state_changes.map(change => ({ ...change, status: "needs-review", reason: "Profil baseline tidak tersedia; nilai before tidak dapat dicocokkan." })),
      errors: ["Tidak ada profil karakter terstruktur untuk membandingkan perubahan."]
    };
  }
  const changes: ReconciledChange[] = [];
  const errors: string[] = [];
  if (!responseProfile) errors.push("Panel profil pada player_response tidak berhasil diparse.");
  const seen = new Set<string>();
  for (const change of proposal.state_changes) {
    const field = change.field as ProfileField;
    if (!deterministicFields.has(field)) {
      errors.push("Field tidak didukung untuk rekonsiliasi otomatis: " + change.field + ".");
      changes.push({ field: change.field, before: change.before, after: change.after, status: "rejected", reason: "Field tidak dikenal atau tidak diizinkan." });
      continue;
    }
    if (seen.has(field)) {
      errors.push("Field diubah lebih dari sekali dalam satu proposal: " + field + ".");
      changes.push({ field, before: change.before, after: change.after, status: "rejected", reason: "Duplikasi perubahan field." });
      continue;
    }
    seen.add(field);
    if (normalizeFieldValue(change.before) === normalizeFieldValue(change.after)) {
      errors.push("state_changes untuk " + field + " tidak boleh mencatat perubahan tanpa perubahan nilai.");
      changes.push({ field, before: change.before, after: change.after, status: "rejected", reason: "Nilai sebelum dan sesudah identik." });
      continue;
    }
    const actual = profile.fields[field];
    if (normalizeFieldValue(change.before) !== normalizeFieldValue(actual)) {
      errors.push("Nilai before tidak cocok dengan profil untuk " + field + ".");
      changes.push({ field, before: change.before, after: change.after, status: "rejected", reason: "Baseline mismatch; perubahan ditolak." });
      continue;
    }
    if (responseProfile && normalizeFieldValue(responseProfile.fields[field]) !== normalizeFieldValue(change.after)) {
      errors.push("Nilai panel respons tidak cocok dengan state_changes.after untuk " + field + ".");
      changes.push({ field, before: change.before, after: change.after, status: "rejected", reason: "Panel profil dan delta terstruktur berbeda." });
      continue;
    }
    const invalid = validateAfterValue(field, normalizeFieldValue(change.after));
    if (invalid) {
      errors.push(field + ": " + invalid);
      changes.push({ field, before: change.before, after: change.after, status: "rejected", reason: invalid });
      continue;
    }
    if (!change.reason.trim() || !change.canon_basis.length) {
      changes.push({ field, before: change.before, after: change.after, status: "needs-review", reason: "Alasan dan rujukan canon harus diperiksa." });
      errors.push(field + " membutuhkan alasan dan rujukan canon yang dapat diverifikasi.");
      continue;
    }
    changes.push({ field, before: change.before, after: change.after, status: "candidate", reason: "Baseline cocok dan format dasar valid; belum diterapkan, belum disahkan mekanik, dan menunggu persetujuan pemain." });
  }
  if (responseText !== undefined) {
    const hasLedger = responseText.includes("╭─ LEDGER LOG · #");
    const logMarkerCount = (responseText.match(/Log tercatat!/g) ?? []).length;
    const firstProfilePanel = responseText.indexOf("◈━━┫ PROFIL KARAKTER ┣━━◈");
    const ledgerPosition = responseText.indexOf("╭─ LEDGER LOG · #");
    if (proposal.state_changes.length > 0) {
      if (!hasLedger || logMarkerCount !== 1 || ledgerPosition < 0 || ledgerPosition > firstProfilePanel) {
        errors.push("Perubahan state wajib memiliki tepat satu `Log tercatat!` dan satu LEDGER LOG sebelum panel profil.");
      }
    } else if (hasLedger || logMarkerCount > 0) {
      errors.push("LEDGER LOG dan `Log tercatat!` tidak boleh muncul ketika tidak ada state_changes.");
    }
  }
  if (responseText !== undefined) {
    const hasLedger = responseText.includes("╭─ LEDGER LOG · #");
    const markerCount = (responseText.match(/Log tercatat!/g) ?? []).length;
    const panelPosition = responseText.indexOf("◈━━┫ PROFIL KARAKTER ┣━━◈");
    const ledgerPosition = responseText.indexOf("╭─ LEDGER LOG · #");
    if (proposal.state_changes.length > 0 && (!hasLedger || markerCount !== 1 || ledgerPosition > panelPosition)) errors.push('A state change must have one ledger before the profile panel.');
    if (proposal.state_changes.length === 0 && (hasLedger || markerCount > 0)) errors.push('Ledger must be omitted when there are no state changes.');
  }
  if (responseProfile) {
    for (const field of deterministicFields) {
      if (profile.fields[field] !== responseProfile.fields[field] && !seen.has(field)) {
        errors.push("Panel mengubah " + field + " tanpa state_changes dan Ledger Log yang dapat direkonsiliasi.");
        changes.push({ field, before: profile.fields[field], after: responseProfile.fields[field], status: "rejected", reason: "Perubahan panel tanpa delta terstruktur." });
      }
    }
  }
  const status = changes.some(change => change.status === "rejected")
    ? "rejected"
    : changes.some(change => change.status === "needs-review") || errors.length
      ? "review-required"
      : "review-required";
  return { status: proposal.state_changes.length === 0 && errors.length === 0 ? "no-changes" : status, changes, errors };
}
