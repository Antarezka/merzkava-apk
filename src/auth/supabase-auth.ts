import { Capacitor } from "@capacitor/core";
import { SecureStorage } from "@aparajita/capacitor-secure-storage";

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  user: { id: string; email?: string };
}

const SESSION_KEY = "merzkava.auth.session.v1";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, "") ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
let session: AuthSession | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

async function persistSession(value: AuthSession | null): Promise<void> {
  session = value;
  // SecureStorage's web implementation uses localStorage. Never persist auth
  // credentials in the browser preview; native Android uses Android Keystore.
  if (!Capacitor.isNativePlatform()) return;
  if (value) await SecureStorage.setItem(SESSION_KEY, JSON.stringify(value));
  else await SecureStorage.removeItem(SESSION_KEY);
}

function parseSession(value: unknown): AuthSession | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (typeof item.access_token !== "string" || typeof item.refresh_token !== "string" ||
      typeof item.expires_at !== "number" || !item.user || typeof item.user !== "object") return null;
  const user = item.user as Record<string, unknown>;
  if (typeof user.id !== "string") return null;
  return {
    access_token: item.access_token,
    refresh_token: item.refresh_token,
    expires_at: item.expires_at,
    token_type: typeof item.token_type === "string" ? item.token_type : "bearer",
    user: { id: user.id, email: typeof user.email === "string" ? user.email : undefined }
  };
}

async function authRequest(path: string, body?: Record<string, string>): Promise<AuthSession> {
  if (!isSupabaseConfigured()) throw new Error("Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.");
  const result = await fetch(supabaseUrl + "/auth/v1/" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": supabaseAnonKey },
    body: JSON.stringify(body ?? {})
  });
  const payload = await result.json() as Record<string, unknown>;
  if (!result.ok) {
    const message = typeof payload.msg === "string" ? payload.msg :
      typeof payload.message === "string" ? payload.message :
      typeof payload.error_description === "string" ? payload.error_description :
      "Supabase authentication failed.";
    throw new Error(message);
  }
  const expiresIn = typeof payload.expires_in === "number" ? payload.expires_in : 3600;
  const normalized = parseSession({
    ...payload,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn
  });
  if (!normalized) throw new Error("Supabase returned an incomplete session.");
  return normalized;
}

export async function restoreAuthSession(): Promise<AuthSession | null> {
  if (!isSupabaseConfigured()) return null;
  if (Capacitor.isNativePlatform()) {
    const stored = await SecureStorage.getItem(SESSION_KEY);
    if (stored) {
      try { session = parseSession(JSON.parse(stored)); }
      catch { session = null; }
    }
  }
  if (!session) return null;
  if (session.expires_at <= Math.floor(Date.now() / 1000) + 90) {
    try { return await refreshAuthSession(); }
    catch { await persistSession(null); return null; }
  }
  return session;
}

export async function signInWithPassword(email: string, password: string): Promise<AuthSession> {
  const next = await authRequest("token?grant_type=password", { email: email.trim(), password });
  await persistSession(next);
  return next;
}

export async function refreshAuthSession(): Promise<AuthSession> {
  if (!session?.refresh_token) throw new Error("Sesi login tidak tersedia. Silakan login kembali.");
  const next = await authRequest("token?grant_type=refresh_token", { refresh_token: session.refresh_token });
  await persistSession(next);
  return next;
}

export async function getValidAccessToken(): Promise<string> {
  if (!session) await restoreAuthSession();
  if (!session) throw new Error("Login Supabase diperlukan untuk menggunakan AI Game Master.");
  if (session.expires_at <= Math.floor(Date.now() / 1000) + 90) await refreshAuthSession();
  if (!session) throw new Error("Sesi login berakhir. Silakan login kembali.");
  return session.access_token;
}

export async function signOut(): Promise<void> {
  const accessToken = session?.access_token;
  if (accessToken && isSupabaseConfigured()) {
    try {
      await fetch(supabaseUrl + "/auth/v1/logout", {
        method: "POST",
        headers: { "Authorization": "Bearer " + accessToken, "apikey": supabaseAnonKey }
      });
    } catch { /* Local credentials are still cleared if remote logout is unavailable. */ }
  }
  await persistSession(null);
}

export function getAuthSession(): AuthSession | null { return session; }
