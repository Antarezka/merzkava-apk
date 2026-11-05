import { Capacitor } from "@capacitor/core";
import { SecureStorage } from "@aparajita/capacitor-secure-storage";

const ITERATIONS = 600_000;
const REMEMBER_KEY = "merzkava.developer-session.v1";
const ID_SALT = "zki1bXl9Kc9FkzTBCvsoSQ==";
const ID_VERIFIER = "rWliJ21UojOkc2FX4QQXudntYW7NuuKB9kizB4Ih0sA=";
const PASSWORD_SALT = "0Wnvcfd3cGISdPZSyJfQZQ==";
const PASSWORD_VERIFIER = "rYGmwsLKK3El0UXvA3vyj+pe7d7uj0xJchixuRgr/IU=";
let authenticated = false;

function decodeBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
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
    { name: "PBKDF2", salt: decodeBase64(salt), iterations: ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return new Uint8Array(bits);
}

export function isDeveloperAuthenticated(): boolean {
  return authenticated;
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
    try { if (Capacitor.isNativePlatform()) await SecureStorage.removeItem(REMEMBER_KEY); } catch { /* fail closed */ }
    return false;
  }
  authenticated = true;
  if (Capacitor.isNativePlatform()) {
    if (rememberMe) await SecureStorage.setItem(REMEMBER_KEY, "authorized");
    else await SecureStorage.removeItem(REMEMBER_KEY);
  }
  return true;
}

export async function signOutDeveloper(): Promise<void> {
  authenticated = false;
  try {
    if (Capacitor.isNativePlatform()) await SecureStorage.removeItem(REMEMBER_KEY);
  } catch {
    // In-memory developer access is still revoked.
  }
}
