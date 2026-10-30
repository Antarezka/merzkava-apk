# Merzkava AI Gateway

A server-side, OpenAI-compatible gateway for the AI Game Master. The provider API key stays in the gateway environment and is never bundled into the Android app.

## Required services

- Cloudflare Workers (gateway runtime)
- Supabase Auth (user identity; JWT is verified by calling Supabase Auth)
- An OpenAI-compatible chat completions provider

## Configure Cloudflare Worker

Create a Worker using `gateway/worker.ts` as its entry point. Set these non-secret variables:

- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anon/public key
- `AI_BASE_URL`: OpenAI-compatible API base URL ending in `/v1` (default: `https://api.openai.com/v1`)
- `AI_MODEL`: provider model identifier
- `ALLOWED_ORIGINS`: comma-separated exact origins allowed by CORS, e.g. `capacitor://localhost,http://localhost`

Add `AI_API_KEY` as a Worker secret, not a plain variable:

```sh
npx wrangler secret put AI_API_KEY
```

Deploy only after configuring the values:

```sh
npx wrangler deploy
```

## Request

`POST /v1/gm`

Headers:

- `Authorization: Bearer <Supabase access token>`
- `Content-Type: application/json`

Body:

```json
{
  "snapshot": "a1b2c3d",
  "version": "Nightly-v1.4.100",
  "prompt": "The complete prompt assembled by the app"
}
```

Successful response:

```json
{
  "snapshot": "a1b2c3d",
  "version": "Nightly-v1.4.100",
  "response": "{...GM JSON proposal...}"
}
```

## Security notes

- CORS is a browser policy, not authentication. Every gameplay request must carry a valid Supabase access token.
- The Worker validates that token with Supabase Auth before calling the model provider.
- Keep provider credentials in Worker secrets. Never put them in Vite environment variables, local storage, the repository, or the APK.
- Restrict Worker origins to the actual app origins. Add rate limiting at the Cloudflare edge before public deployment.
- Provider output remains untrusted. The app must run `validateGMResponse` against the active snapshot and version.
- This gateway does not write to the game database and does not apply proposed changes.
- Do not deploy until Supabase Auth, provider settings, allowed origins, and rate limiting are configured.

## Current integration boundary

The Worker endpoint is implemented as a deployable backend scaffold. The app does not yet have Supabase sign-in/session handling or a configured gateway URL, so it cannot call this endpoint automatically. Those are the next client-side integration tasks.

## Configure the Android app client

Copy `.env.example` to `.env.local` for a local build and set:

- `VITE_SUPABASE_URL`: the same Supabase project URL used by the Worker
- `VITE_SUPABASE_ANON_KEY`: the Supabase anon/public client key (never the service-role key)
- `VITE_GM_GATEWAY_URL`: the deployed Worker base URL, without a trailing slash

The app uses Supabase email/password sign-in. Create or invite the account in the Supabase Authentication dashboard before signing in. Enable the Email provider and configure its confirmation policy there.

Install dependencies and synchronize native plugins after the Android project exists:

```sh
npm install
npx cap sync android
```

The secure-storage plugin is pinned to the Capacitor 7-compatible 7.1.x line. Android sessions are encrypted with Android Keystore when running in the native app. Browser preview intentionally keeps the session in memory only.
