import { parseCharacterProfile, validateCharacterProfile, type ParsedCharacterProfile } from "./profile-parser";

export interface TrustedProfileBaselineInput {
  mode: "new" | "continue";
  profileMarkdown: string;
  stateVerified?: boolean;
}

export type TrustedProfileBaseline =
  | { valid: true; profile: ParsedCharacterProfile }
  | { valid: false; errors: string[] };

/**
 * Select only a source-backed profile as the state baseline.
 * A prior GM response panel is never a trusted baseline: it remains a proposal
 * until an explicit verification flow stores an approved profile checkpoint.
 */
export function selectTrustedProfileBaseline(input: TrustedProfileBaselineInput): TrustedProfileBaseline {
  if (input.mode === "continue" && input.stateVerified !== true) {
    return {
      valid: false,
      errors: ["State sesi lanjutan belum diverifikasi; panel GM sebelumnya tidak boleh dipromosikan menjadi baseline."]
    };
  }

  const parsed = parseCharacterProfile(input.profileMarkdown);
  if (!parsed.valid) return parsed;

  const errors = validateCharacterProfile(parsed.profile);
  if (errors.length) return { valid: false, errors };
  return { valid: true, profile: parsed.profile };
}
