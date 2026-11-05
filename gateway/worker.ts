export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  AI_API_KEY: string;
  AI_BASE_URL?: string;
  AI_MODEL: string;
  ALLOWED_ORIGINS: string;
  AI_RATE_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
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

export default {export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map(value => value.trim()).filter(Boolean);
    if (origin && !allowed.includes(origin)) return response({ error: "Origin not allowed." }, 403, null, env);

    if (request.method === "OPTIONS") return response({ ok: true }, 204, origin, env);
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return response({ ok: true, service: "merzkava-gm-gateway" }, 200, origin, env);
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
