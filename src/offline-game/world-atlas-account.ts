import { Capacitor } from "@capacitor/core";
import { SecureStorage } from "@aparajita/capacitor-secure-storage";

const ITERATIONS = 310_000;
const KEY_PREFIX = "merzkava.world-atlas.account.";
const REMEMBER_KEY = "merzkava.world-atlas.remembered-player.v1";
const MASTER_RESET_SALT = new TextEncoder().encode("Merzkava.WorldAtlas.MasterReset.v1");
const MASTER_RESET_HASH = "aHqvTavnyWOM/bTAJMNRxRbV3qfGdwQYgCfoTo/BgrI=";
let activePlayer = "";

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
async function digest(value: string): Promise<string> {
  const result = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value.trim().toLocaleLowerCase()));
  return bytesToBase64(new Uint8Array(result)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
async function derive(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: toArrayBuffer(salt), iterations: ITERATIONS, hash: "SHA-256" }, key, 256
  ));
}
async function readStored(key: string): Promise<string | null> {
  if (Capacitor.isNativePlatform()) return await SecureStorage.getItem(key);
  try { return localStorage.getItem(key); } catch { return null; }
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
  } catch { /* Password remains usable only for this runtime if storage is unavailable. */ }
}
async function accountKey(playerName: string): Promise<string> {
  return KEY_PREFIX + await digest(playerName);
}

export function atlasPasswordPolicyError(password: string): string | null {
  if (password.length < 8) return "Use at least 8 characters.";
  if (password.length > 128) return "Use no more than 128 characters.";
  if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Include at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Include at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Include at least one symbol.";
  return null;
}
export async function verifyAtlasMasterResetPassword(password: string): Promise<boolean> {
  if (!password) return false;
  const actual = await derive(password, MASTER_RESET_SALT);
  return constantTimeEqual(actual, base64ToBytes(MASTER_RESET_HASH));
}
export async function hasAtlasPassword(playerName: string): Promise<boolean> {
  return Boolean(await readStored(await accountKey(playerName)));
}
export async function setAtlasPassword(playerName: string, password: string): Promise<void> {
  const policyError = atlasPasswordPolicyError(password);
  if (policyError) throw new Error(policyError);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt);
  await writeStored(await accountKey(playerName), JSON.stringify({
    version: 1, iterations: ITERATIONS, salt: bytesToBase64(salt), hash: bytesToBase64(hash)
  }));
}
export async function verifyAtlasPassword(playerName: string, password: string): Promise<boolean> {
  const raw = await readStored(await accountKey(playerName));
  if (!raw) return false;
  try {
    const stored = JSON.parse(raw) as { version?: number; iterations?: number; salt?: string; hash?: string };
    if (stored.version !== 1 || stored.iterations !== ITERATIONS || !stored.salt || !stored.hash) return false;
    const actual = await derive(password, base64ToBytes(stored.salt));
    return constantTimeEqual(actual, base64ToBytes(stored.hash));
  } catch { return false; }
}
export async function rememberAtlasPlayer(playerName: string, remember: boolean): Promise<void> {
  if (!remember) { await writeStored(REMEMBER_KEY, null); activePlayer = playerName; return; }
  await writeStored(REMEMBER_KEY, playerName);
  activePlayer = playerName;
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
