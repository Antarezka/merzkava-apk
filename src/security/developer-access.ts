import { Capacitor } from "@capacitor/core";
import { SecureStorage } from "@aparajita/capacitor-secure-storage";

const ITERATIONS = 600_000;
const REMEMBER_KEY = "merzkava.developer-session.v1";
const CREDENTIALS_KEY = "merzkava.developer-credentials.v1";
const ID_SALT = "zki1bXl9Kc9FkzTBCvsoSQ==";
const ID_VERIFIER = "rWliJ21UojOkc2FX4QQXudntYW7NuuKB9kizB4Ih0sA=";
const PASSWORD_SALT = "0Wnvcfd3cGISdPZSyJfQZQ==";
const PASSWORD_VERIFIER = "rYGmwsLKK3El0UXvA3vyj+pe7d7uj0xJchixuRgr/IU=";
let authenticated = false;

export interface RememberedDeveloperCredentials {
  identifier: string;
  password: string;
}

function decodeBase64(value: string): Uint8Array {
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
async function verifier(value: string, salt: string): Promise<Uint8Array> {
  if (!globalThis.crypto?.subtle) throw new Error("Secure credential verification is unavailable on this device.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(value), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: toArrayBuffer(decodeBase64(salt)), iterations: ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return new Uint8Array(bits);
}

export function isDeveloperAuthenticated(): boolean {
  return authenticated;
}

async function clearDeveloperSessionMarker(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await SecureStorage.removeItem(REMEMBER_KEY);
  } catch {
    // If deletion fails, overwrite the marker so a later launch cannot restore access.
    try {
      await SecureStorage.setItem(REMEMBER_KEY, "locked");
    } catch {
      throw new Error("Could not securely lock the Developer session on this device.");
    }
  }
}

/** Returns saved form credentials only on native Android, where SecureStorage protects the record. */
export async function restoreRememberedDeveloperCredentials(): Promise<RememberedDeveloperCredentials | null> {
  if (!Capacitor.isNativePlatform()) return null;
  try {
    const raw = await SecureStorage.getItem(CREDENTIALS_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as { version?: number; identifier?: string; password?: string };
    if (stored.version !== 1 || typeof stored.identifier !== "string" || !stored.identifier ||
        typeof stored.password !== "string" || !stored.password) return null;
    return { identifier: stored.identifier, password: stored.password };
  } catch {
    return null;
  }
}

export async function restoreDeveloperSession(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return authenticated;
  try {
    authenticated = (await SecureStorage.getItem(REMEMBER_KEY)) === "authorized";
  } catch {
    authenticated = false;
  }
  return authenticated;
}

export async function authenticateDeveloper(
  identifier: string,
  password: string,
  rememberMe: boolean
): Promise<boolean> {
  const cleanIdentifier = identifier.trim().toLowerCase();
  if (!cleanIdentifier || !password) return false;
  const [idCandidate, passwordCandidate] = await Promise.all([
    verifier(cleanIdentifier, ID_SALT),
    verifier(password, PASSWORD_SALT)
  ]);
  const valid =
    constantTimeEqual(idCandidate, decodeBase64(ID_VERIFIER)) &&
    constantTimeEqual(passwordCandidate, decodeBase64(PASSWORD_VERIFIER));
  if (!valid) {
    authenticated = false;
    await clearDeveloperSessionMarker();
    return false;
  }

  // A Lock action revokes the active session marker but deliberately keeps
  // this separately stored credential record for the next login panel.
  if (Capacitor.isNativePlatform()) {
    try {
      if (rememberMe) {
        await SecureStorage.setItem(CREDENTIALS_KEY, JSON.stringify({
          version: 1,
          identifier: cleanIdentifier,
          password
        }));
        await SecureStorage.setItem(REMEMBER_KEY, "authorized");
      } else {
        await SecureStorage.removeItem(CREDENTIALS_KEY);
        await SecureStorage.removeItem(REMEMBER_KEY);
      }
    } catch (error) {
      authenticated = false;
      try { await SecureStorage.removeItem(REMEMBER_KEY); } catch { /* remain locked */ }
      throw new Error("Could not save the Remember Me credential securely on this device.");
    }
  }
  authenticated = true;
  return true;
}

/** Lock the current Developer session without deleting an explicitly remembered credential. */
export async function signOutDeveloper(): Promise<void> {
  authenticated = false;
  await clearDeveloperSessionMarker();
}
