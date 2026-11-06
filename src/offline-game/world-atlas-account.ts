import { Capacitor } from "@capacitor/core";
import { SecureStorage } from "@aparajita/capacitor-secure-storage";

const ITERATIONS = 310_000;
const KEY_PREFIX = "merzkava.world-atlas.account.";
const REMEMBER_KEY = "merzkava.world-atlas.remembered-player.v1";
const RESET_SERVICE_URL = import.meta.env.VITE_GM_GATEWAY_URL?.trim().replace(/\/+$/, "") ?? "";
let activePlayer = "";

type AtlasResetPayload = { resetRevision?: unknown; error?: unknown };

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
function validPlayerName(playerName: string): string {
  const name = playerName.trim();
  if (!name || name.length > 80 || /[\u0000-\u001f]/.test(name)) {
    throw new Error("Choose a valid registered player name.");
  }
  return name;
}
async function atlasResetRequest(
  path: string,
  body?: Record<string, string>,
  accessToken?: string
): Promise<string> {
  if (!RESET_SERVICE_URL) throw new Error("The secure World Atlas reset service is not configured on this build.");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = "Bearer " + accessToken;
  const response = await fetch(RESET_SERVICE_URL + path, {
    method: body ? "POST" : "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store"
  });
  let payload: AtlasResetPayload = {};
  try { payload = await response.json() as AtlasResetPayload; } catch { /* Report a stable service error below. */ }
  if (!response.ok) {
    const message = typeof payload.error === "string" ? payload.error : "The World Atlas reset service could not complete the request.";
    throw new Error(message);
  }
  if (typeof payload.resetRevision !== "string" || !payload.resetRevision) {
    throw new Error("The World Atlas reset service returned an invalid account revision.");
  }
  return payload.resetRevision;
}

/** The shared server revision invalidates old local password verifiers on every device. */
export async function getAtlasResetRevision(playerName: string): Promise<string> {
  const name = validPlayerName(playerName);
  // A build without the reset service can still change a known password locally.
  // Master Reset remains unavailable until the server endpoint is configured.
  if (!RESET_SERVICE_URL) return (await getAtlasPasswordRevision(name)) ?? "0";
  return atlasResetRequest("/v1/atlas/reset-status?player=" + encodeURIComponent(name));
}

/** The master credential is checked only by the HTTPS gateway and is never bundled in the APK. */
export async function requestAtlasMasterReset(playerName: string, masterPassword: string): Promise<string> {
  const name = validPlayerName(playerName);
  if (!masterPassword) throw new Error("Enter the master reset password.");
  return atlasResetRequest("/v1/atlas/master-reset", { playerName: name, masterPassword });
}

/** Developer resets are authorized by a server-side Supabase email allowlist, not local UI state. */
export async function requestAtlasDeveloperReset(playerName: string, accessToken: string): Promise<string> {
  const name = validPlayerName(playerName);
  if (!accessToken) throw new Error("Sign in to the authorized Developer account before resetting a player.");
  return atlasResetRequest("/v1/atlas/developer-reset", { playerName: name }, accessToken);
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

export async function getAtlasPasswordRevision(playerName: string): Promise<string | null> {
  const raw = await readStored(await accountKey(playerName));
  if (!raw) return null;
  try {
    const stored = JSON.parse(raw) as { resetRevision?: string };
    return typeof stored.resetRevision === "string" && stored.resetRevision ? stored.resetRevision : "0";
  } catch { return null; }
}

export async function hasAtlasPassword(playerName: string, currentRevision?: string): Promise<boolean> {
  const raw = await readStored(await accountKey(playerName));
  if (!raw) return false;
  try {
    const stored = JSON.parse(raw) as { version?: number; iterations?: number; salt?: string; hash?: string; resetRevision?: string };
    if (stored.version !== 1 || stored.iterations !== ITERATIONS || !stored.salt || !stored.hash) return false;
    const storedRevision = stored.resetRevision ?? "0";
    return currentRevision === undefined || storedRevision === currentRevision;
  } catch { return false; }
}

export async function setAtlasPassword(playerName: string, password: string, resetRevision = "0"): Promise<void> {
  const policyError = atlasPasswordPolicyError(password);
  if (policyError) throw new Error(policyError);
  if (!resetRevision || resetRevision.length > 128) throw new Error("A valid World Atlas reset revision is required.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt);
  await writeStored(await accountKey(playerName), JSON.stringify({
    version: 1,
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    hash: bytesToBase64(hash),
    resetRevision
  }));
}

export async function verifyAtlasPassword(playerName: string, password: string, currentRevision?: string): Promise<boolean> {
  const raw = await readStored(await accountKey(playerName));
  if (!raw) return false;
  try {
    const stored = JSON.parse(raw) as {
      version?: number; iterations?: number; salt?: string; hash?: string; resetRevision?: string
    };
    if (stored.version !== 1 || stored.iterations !== ITERATIONS || !stored.salt || !stored.hash) return false;
    if (currentRevision !== undefined && (stored.resetRevision ?? "0") !== currentRevision) return false;
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
