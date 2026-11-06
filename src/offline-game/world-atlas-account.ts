import { Capacitor } from "@capacitor/core";
import { SecureStorage } from "@aparajita/capacitor-secure-storage";
import { ATLAS_RESET_GRANTS } from "./atlas-reset-grants.generated";

const ITERATIONS = 310_000;
const KEY_PREFIX = "merzkava.world-atlas.account.";
const REMEMBER_KEY = "merzkava.world-atlas.remembered-player.v1";

type StoredCredential = {
  version?: number;
  iterations?: number;
  salt?: string;
  hash?: string;
  usedMasterResetGrantIds?: string[];
};

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}
function base64ToBytes(value: string): Uint8Array {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}
function toArrayBuffer(value: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(value.byteLength);
  copy.set(value);
  return copy.buffer;
}
function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left[index] ^ right[index];
  return difference === 0;
}
async function derive(password: string, salt: Uint8Array): Promise<Uint8Array> {
  if (!globalThis.crypto?.subtle) throw new Error("Secure password verification is unavailable.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: toArrayBuffer(salt), iterations: ITERATIONS, hash: "SHA-256" }, key, 256
  ));
}
async function readStored(key: string): Promise<string | null> {
  if (Capacitor.isNativePlatform()) return await SecureStorage.getItem(key);
  try { return localStorage.getItem(key); }
  catch { throw new Error("Could not read the saved account credential."); }
}
async function writeStored(key: string, value: string | null): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    if (value === null) await SecureStorage.removeItem(key);
    else await SecureStorage.setItem(key, value);
    return;
  }
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { throw new Error("Could not save the account credential."); }
}
async function digest(value: string): Promise<string> {
  const result = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value.trim().toLocaleLowerCase()));
  return bytesToBase64(new Uint8Array(result)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
async function sha256Hex(value: string): Promise<string> {
  const result = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return Array.from(result, byte => byte.toString(16).padStart(2, "0")).join("");
}
async function accountKey(playerName: string): Promise<string> {
  return KEY_PREFIX + await digest(playerName);
}
function validPlayerName(playerName: string): string {
  const name = playerName.trim();
  if (!name || name.length > 80 || /[\u0000-\u001f]/.test(name)) {
    throw new Error("Choose a valid registered player name.");
  }
  return name;
}
function randomHex(byteLength: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}
function normalizeResetCode(code: string): string {
  return code.trim().toUpperCase().replace(/^MZK1-/, "").replace(/[\s-]/g, "");
}
function readCredential(raw: string | null): StoredCredential | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as StoredCredential; }
  catch { return null; }
}
function usedGrantIds(stored: StoredCredential | null): string[] {
  return Array.isArray(stored?.usedMasterResetGrantIds)
    ? stored!.usedMasterResetGrantIds!.filter(value => typeof value === "string")
    : [];
}
async function resolveMasterResetGrant(playerName: string, code: string) {
  const name = validPlayerName(playerName);
  const normalized = normalizeResetCode(code);
  if (!/^[0-9A-F]{64}$/.test(normalized)) return null;
  const playerKey = await digest(name);
  const codeHash = await sha256Hex(normalized);
  return ATLAS_RESET_GRANTS.find(grant =>
    grant.playerKey === playerKey &&
    grant.codeHash === codeHash
  ) ?? null;
}

export function atlasPasswordPolicyError(password: string): string | null {
  if (password.length < 8) return "Use at least 8 characters.";
  if (password.length > 128) return "Use no more than 128 characters.";
  if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Include at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Include at least one number.";
  if (!/[^A-Za-z0-9\s]/.test(password)) return "Include at least one symbol.";
  return null;
}

/**
 * Creates a non-authorizing request for the Developer to paste into the AI handoff.
 * A request is not a reset code. The AI adds a matching one-time grant to the next APK source.
 */
export async function createAtlasMasterResetRequest(playerName: string): Promise<string> {
  const name = validPlayerName(playerName);
  const playerKey = await digest(name);
  const requestId = randomHex(16);
  const challenge = randomHex(32);
  return [
    "MERZKAVA_ATLAS_MASTER_RESET_REQUEST_V1",
    "Request-ID: " + requestId,
    "Player-Name: " + name,
    "Player-Key: " + playerKey,
    "Challenge: " + challenge,
    "Action: Generate one unique player confirmation code and add only its SHA-256 hash to src/offline-game/atlas-reset-grants.generated.ts for the next app build.",
    "Scope: This request is for the selected World Atlas player only."
  ].join("\n");
}

/** Checks the code against the account-bound grants compiled into this app build. */
export async function verifyAtlasMasterResetCode(playerName: string, code: string): Promise<boolean> {
  if (!code.trim()) return false;
  const grant = await resolveMasterResetGrant(playerName, code);
  if (!grant) return false;
  const stored = readCredential(await readStored(await accountKey(validPlayerName(playerName))));
  return !usedGrantIds(stored).includes(grant.requestId);
}

/**
 * Replaces the selected account password and records the grant as consumed in the same
 * credential record. A grant is single-use per installation/account record.
 */
export async function completeAtlasMasterReset(
  playerName: string,
  code: string,
  newPassword: string
): Promise<void> {
  const name = validPlayerName(playerName);
  const policyError = atlasPasswordPolicyError(newPassword);
  if (policyError) throw new Error(policyError);

  const grant = await resolveMasterResetGrant(name, code);
  if (!grant) throw new Error("The reset code is invalid, belongs to another account, or is not included in this app update.");

  const key = await accountKey(name);
  const previous = readCredential(await readStored(key));
  const used = usedGrantIds(previous);
  if (used.includes(grant.requestId)) throw new Error("This reset code has already been used for this account on this device.");

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(newPassword, salt);
  await writeStored(key, JSON.stringify({
    version: 1,
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    hash: bytesToBase64(hash),
    usedMasterResetGrantIds: [...used, grant.requestId]
  }));
}

export async function hasAtlasPassword(playerName: string): Promise<boolean> {
  const raw = await readStored(await accountKey(validPlayerName(playerName)));
  if (!raw) return false;
  try {
    const stored = JSON.parse(raw) as StoredCredential;
    return stored.version === 1 && stored.iterations === ITERATIONS && Boolean(stored.salt && stored.hash);
  } catch { return false; }
}
export async function setAtlasPassword(playerName: string, password: string): Promise<void> {
  const name = validPlayerName(playerName);
  const policyError = atlasPasswordPolicyError(password);
  if (policyError) throw new Error(policyError);
  const key = await accountKey(name);
  const previous = readCredential(await readStored(key));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt);
  await writeStored(key, JSON.stringify({
    version: 1,
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    hash: bytesToBase64(hash),
    usedMasterResetGrantIds: usedGrantIds(previous)
  }));
}
export async function verifyAtlasPassword(playerName: string, password: string): Promise<boolean> {
  const raw = await readStored(await accountKey(validPlayerName(playerName)));
  if (!raw) return false;
  try {
    const stored = JSON.parse(raw) as StoredCredential;
    if (stored.version !== 1 || stored.iterations !== ITERATIONS || !stored.salt || !stored.hash) return false;
    const actual = await derive(password, base64ToBytes(stored.salt));
    return constantTimeEqual(actual, base64ToBytes(stored.hash));
  } catch { return false; }
}
export async function rememberAtlasPlayer(playerName: string, remember: boolean): Promise<void> {
  const name = validPlayerName(playerName);
  if (!remember) { await writeStored(REMEMBER_KEY, null); activePlayer = name; return; }
  await writeStored(REMEMBER_KEY, name);
  activePlayer = name;
}
export async function restoreAtlasPlayer(): Promise<string> {
  try { activePlayer = (await readStored(REMEMBER_KEY)) ?? ""; } catch { activePlayer = ""; }
  return activePlayer;
}
export async function getActiveAtlasPlayer(): Promise<string> {
  return activePlayer || await restoreAtlasPlayer();
}
export async function clearAtlasPlayer(): Promise<void> {
  activePlayer = "";
  await writeStored(REMEMBER_KEY, null);
}
