/**
 * Generated one-time World Atlas Master Reset grants.
 *
 * The Developer's request code is not a player reset code. After the request is
 * reviewed, the AI creates a unique confirmation code and appends its SHA-256
 * hash here. Never commit the raw player confirmation code.
 *
 * A grant is available only in APKs built from this file revision or a later
 * revision. The selected player's account key and grant ID are both checked.
 */
export type AtlasResetGrant = {
  requestId: string;
  playerKey: string;
  codeHash: string;
};

export const ATLAS_RESET_GRANTS: readonly AtlasResetGrant[] = [
  // AI-generated, account-bound grants are added here when a Developer reset is approved.
];
