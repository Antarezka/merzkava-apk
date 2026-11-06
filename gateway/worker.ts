export interface KVNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  AI_API_KEY: string;
  AI_BASE_URL?: string;
  AI_MODEL: string;
  ALLOWED_ORIGINS: string;
  AI_RATE_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
  ATLAS_RESET_KV?: KVNamespaceLike;
  ATLAS_RESET_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
  ATLAS_MASTER_RESET_PASSWORD?: string;
  ATLAS_DEVELOPER_EMAILS?: string;
}

interface GMRequest {
  prompt: string;
  snapshot: string;
  version: string;
}
interface AuthIdentity {
  id: string;
  email?: string;
}

const MAX_BODY_BYTES = 180000;
const MAX_PROMPT_CHARS = 160000;
const AUDIT_RETENTION_SECONDS = 60 * 60 * 24 * 180;

function response(body: unknown, status: number, origin: string | null, env: Env): Response {
  const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map(value => value.trim()).filter(Boolean);
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Vary": "Origin"
  });
  if (origin && allowed.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Max-Age", "86400");
  }
  return new Response(status === 204 ? null : JSON.stringify(body), { status, headers });
}

function isValidRequest(value: unknown): value is GMRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const body = value as Record<string, unknown>;
  return typeof body.prompt === "string" && body.prompt.trim().length > 0 &&
    body.prompt.length <= MAX_PROMPT_CHARS &&
    typeof body.snapshot === "string" && /^[a-f0-9]{7,40}$/i.test(body.snapshot) &&
    typeof body.version === "string" && body.version.length > 0 && body.version.length <= 80;
}

async function authenticate(request: Request, env: Env): Promise<AuthIdentity | null> {
  const authorization = request.headers.get("Authorization") ?? "";
  if (!/^Bearer\s+[^\s]+$/i.test(authorization)) return null;
  try {
    const result = await fetch(new URL("/auth/v1/user", env.SUPABASE_URL), {
      headers: {
        "Authorization": authorization,
        "apikey": env.SUPABASE_ANON_KEY
      }
    });
    if (!result.ok) return null;
    const user = await result.json() as { id?: unknown; email?: unknown };
    if (typeof user.id !== "string") return null;
    return { id: user.id, email: typeof user.email === "string" ? user.email.trim().toLowerCase() : undefined };
  } catch {
    return null;
  }
}

function validPlayerName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const playerName = value.trim();
  if (!playerName || playerName.length > 80 || /[\u0000-\u001f]/.test(playerName)) return null;
  return playerName;
}

async function playerResetKey(playerName: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(playerName.trim().toLocaleLowerCase())
  ));
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  return "atlas-reset:v1:" + hex;
}

function secretMatches(actual: string, expected: string): boolean {
  const left = new TextEncoder().encode(actual);
  const right = new TextEncoder().encode(expected);
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index++) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }
  return difference === 0;
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return null;
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

async function resetRateAllowed(request: Request, env: Env): Promise<boolean> {
  if (!env.ATLAS_RESET_LIMITER) return false;
  const address = request.headers.get("CF-Connecting-IP") ?? "unknown-client";
  try {
    const result = await env.ATLAS_RESET_LIMITER.limit({ key: address });
    return result.success;
  } catch {
    return false;
  }
}

async function readPlayerResetRevision(playerName: string, env: Env): Promise<string> {
  if (!env.ATLAS_RESET_KV) throw new Error("The World Atlas reset registry is not configured.");
  return await env.ATLAS_RESET_KV.get(await playerResetKey(playerName)) ?? "0";
}

async function invalidatePlayerPassword(
  playerName: string,
  env: Env,
  resetType: "master" | "developer",
  actor: string
): Promise<string> {
  if (!env.ATLAS_RESET_KV) throw new Error("The World Atlas reset registry is not configured.");
  const resetRevision = crypto.randomUUID();
  const key = await playerResetKey(playerName);
  await env.ATLAS_RESET_KV.put(key, resetRevision);
  const auditId = "atlas-reset-audit:v1:" + Date.now() + ":" + crypto.randomUUID();
  const playerHash = key.slice("atlas-reset:v1:".length);
  await env.ATLAS_RESET_KV.put(auditId, JSON.stringify({
    resetType,
    actor,
    playerHash,
    resetRevision,
    timestamp: new Date().toISOString()
  }), { expirationTtl: AUDIT_RETENTION_SECONDS });
  return resetRevision;
}

async function parseResetRequest(request: Request, origin: string | null, env: Env): Promise<Record<string, unknown> | Response> {
  const contentLength = Number(request.headers.get("Content-Length") ?? "0");
  if (contentLength > 4096) return response({ error: "Request too large." }, 413, origin, env);
  const body = await readJson(request);
  if (!body) return response({ error: "Request body must be a valid JSON object." }, 400, origin, env);
  return body;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map(value => value.trim()).filter(Boolean);
    if (origin && !allowed.includes(origin)) return response({ error: "Origin not allowed." }, 403, null, env);

    if (request.method === "OPTIONS") return response({ ok: true }, 204, origin, env);
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return response({ ok: true, service: "merzkava-gm-gateway" }, 200, origin, env);
    }

    if (request.method === "GET" && url.pathname === "/v1/atlas/reset-status") {
      const playerName = validPlayerName(url.searchParams.get("player"));
      if (!playerName) return response({ error: "A valid player name is required." }, 400, origin, env);
      try {
        const resetRevision = await readPlayerResetRevision(playerName, env);
        return response({ resetRevision }, 200, origin, env);
      } catch (error) {
        return response({ error: error instanceof Error ? error.message : "Reset registry unavailable." }, 503, origin, env);
      }
    }

    if (request.method === "POST" && url.pathname === "/v1/atlas/master-reset") {
      if (!env.ATLAS_MASTER_RESET_PASSWORD) {
        return response({ error: "The master reset credential is not configured on the server." }, 503, origin, env);
      }
      if (!env.ATLAS_RESET_KV || !env.ATLAS_RESET_LIMITER) {
        return response({ error: "The secure reset registry or rate limiter is not configured." }, 503, origin, env);
      }
      if (!await resetRateAllowed(request, env)) {
        return response({ error: "Too many reset attempts or reset protection is unavailable. Try again later." }, 429, origin, env);
      }
      const parsed = await parseResetRequest(request, origin, env);
      if (parsed instanceof Response) return parsed;
      const playerName = validPlayerName(parsed.playerName);
      const masterPassword = typeof parsed.masterPassword === "string" ? parsed.masterPassword : "";
      if (!playerName || !masterPassword) return response({ error: "A valid player name and master reset password are required." }, 400, origin, env);
      if (!secretMatches(masterPassword, env.ATLAS_MASTER_RESET_PASSWORD)) {
        return response({ error: "The master reset password is incorrect." }, 403, origin, env);
      }
      try {
        const resetRevision = await invalidatePlayerPassword(playerName, env, "master", "master-reset");
        return response({ resetRevision }, 200, origin, env);
      } catch (error) {
        return response({ error: error instanceof Error ? error.message : "Could not invalidate the player password." }, 503, origin, env);
      }
    }

    if (request.method === "POST" && url.pathname === "/v1/atlas/developer-reset") {
      if (!env.ATLAS_RESET_KV || !env.ATLAS_RESET_LIMITER) {
        return response({ error: "The secure reset registry or rate limiter is not configured." }, 503, origin, env);
      }
      if (!await resetRateAllowed(request, env)) {
        return response({ error: "Too many reset attempts or reset protection is unavailable. Try again later." }, 429, origin, env);
      }
      const identity = await authenticate(request, env);
      if (!identity?.email) return response({ error: "An authenticated Developer account is required." }, 401, origin, env);
      const authorizedEmails = (env.ATLAS_DEVELOPER_EMAILS ?? "")
        .split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
      if (!authorizedEmails.length || !authorizedEmails.includes(identity.email)) {
        return response({ error: "This Supabase account is not authorized to reset player passwords." }, 403, origin, env);
      }
      const parsed = await parseResetRequest(request, origin, env);
      if (parsed instanceof Response) return parsed;
      const playerName = validPlayerName(parsed.playerName);
      if (!playerName) return response({ error: "A valid player name is required." }, 400, origin, env);
      try {
        const resetRevision = await invalidatePlayerPassword(playerName, env, "developer", identity.email);
        return response({ resetRevision }, 200, origin, env);
      } catch (error) {
        return response({ error: error instanceof Error ? error.message : "Could not invalidate the player password." }, 503, origin, env);
      }
    }

    if (request.method !== "POST" || url.pathname !== "/v1/gm") {
      return response({ error: "Not found." }, 404, origin, env);
    }

    const contentLength = Number(request.headers.get("Content-Length") ?? "0");
    if (contentLength > MAX_BODY_BYTES) return response({ error: "Request too large." }, 413, origin, env);
    const identity = await authenticate(request, env);
    if (!identity) return response({ error: "Authentication required." }, 401, origin, env);
    if (env.AI_RATE_LIMITER) {
      const limit = await env.AI_RATE_LIMITER.limit({ key: identity.id });
      if (!limit.success) return response({ error: "Rate limit reached. Try again in a minute." }, 429, origin, env);
    }

    let body: unknown;
    try {
      const rawBody = await request.text();
      if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
        return response({ error: "Request too large." }, 413, origin, env);
      }
      body = JSON.parse(rawBody);
    } catch {
      return response({ error: "Request body must be valid JSON." }, 400, origin, env);
    }
    if (!isValidRequest(body)) return response({ error: "Invalid prompt, snapshot, or version." }, 400, origin, env);

    const configuredBase = env.AI_BASE_URL?.trim();
    if (!configuredBase || configuredBase.includes("YOUR_") || configuredBase.includes("SET_")) {
      return response({ error: "AI_BASE_URL is not configured for the selected provider." }, 503, origin, env);
    }
    const base = configuredBase.replace(/\/+$/, "");
    let endpoint: URL;
    try {
      endpoint = new URL(base + "/chat/completions");
      if (endpoint.protocol !== "https:") throw new Error("HTTPS required");
    } catch {
      return response({ error: "AI_BASE_URL must be a valid HTTPS OpenAI-compatible API base." }, 500, origin, env);
    }

    try {
      const upstream = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + env.AI_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.AI_MODEL,
          temperature: 0.4,
          max_tokens: 1800,
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: body.prompt }]
        })
      });
      if (!upstream.ok) {
        return response({ error: "AI provider request failed.", provider_status: upstream.status }, 502, origin, env);
      }
      const data = await upstream.json() as { choices?: Array<{ message?: { content?: unknown } }> };
      const content = data.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) {
        return response({ error: "AI provider returned no text response." }, 502, origin, env);
      }
      return response({ snapshot: body.snapshot, version: body.version, response: content }, 200, origin, env);
    } catch {
      return response({ error: "Could not reach the AI provider." }, 502, origin, env);
    }
  }
};
