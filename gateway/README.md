# Merzkava AI Gateway

A server-side, OpenAI-compatible gateway for the AI Game Master. The provider API key stays in the gateway environment and is never bundled into the Android app.

## Required services

- Cloudflare Workers (gateway runtime)
- Supabase Auth (user identity; JWT is verified by calling Supabase Auth)
- An OpenAI-compatible chat completions provider

## Configure Cloudflare Worker

The Worker is configured by `gateway/wrangler.toml`; its entry point is `gateway/worker.ts`. Set these non-secret variables in that config or in the Cloudflare dashboard:

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
npm run gateway:deploy
```


For local Worker testing, run `npm run gateway:dev`. This starts the Worker locally; configure local `.dev.vars` with the required secrets and keep that file out of version control.

## Qwen Studio / Qwen Chat provider setup

The user-facing chat website at `https://chat.qwen.ai/` is the Qwen Chat interface. A normal Qwen Chat login/session is **not** an official API credential for this gateway. Do not extract browser cookies, bearer tokens, or private web-session endpoints from the chat website and do not use unofficial reverse-engineered proxies.

For an app integration, use the official Qwen API Platform linked from Qwen's own site: `https://qwen.ai/apiplatform`. Create or obtain an API key there and follow that platform's currently displayed OpenAI-compatible Chat Completions instructions. The API Platform lists its supported model IDs; use the exact model ID shown in the account/console rather than assuming the chat website's model name is an API model ID.

Configure the Worker only after the API Platform confirms the account's API access and provides its exact base URL:

- `AI_BASE_URL`: exact OpenAI-compatible API base URL supplied by the official Qwen API Platform (must include `/v1` if the platform specifies it)
- `AI_MODEL`: exact supported model ID shown by that platform
- `AI_API_KEY`: API key created in that platform, stored only as a Cloudflare Worker secret

`chat.qwen.ai` sign-in and API Platform billing/quota may be separate. A free chat account does not imply free API usage or API access. Check the platform's pricing/quota before enabling production requests.

After setting the verified base URL and model ID, run `npx wrangler@4 secret put AI_API_KEY` and enter the API key directly in the terminal prompt. Never send the key in chat or commit it to Git.

**Do not substitute QwenCloud or Alibaba Cloud Model Studio credentials/endpoints** unless the user explicitly chooses those separate developer platforms.

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
- Restrict Worker origins to the actual app origins. The included rate-limit binding allows 10 requests per authenticated user per 60 seconds; adjust it in `wrangler.toml` if needed.
- Provider output remains untrusted. The app must run `validateGMResponse` against the active snapshot and version.
- This gateway does not write to the game database and does not apply proposed changes.
- Do not deploy until Supabase Auth, provider settings, allowed origins, and rate limiting are configured.

## Current integration boundary

The app now includes Supabase email/password sign-in, native secure session restoration, logout, and an authenticated gateway provider. Gameplay automatically sends a prepared prompt when all three public client variables are configured and a user is signed in. Otherwise, the manual prompt/response workflow remains available.

The app does not yet include an account sign-up screen. Create or invite the intended account in the Supabase Authentication dashboard. The Worker is still not deployed by this repository; deploy it only after setting the project-specific values and secret.

## Configure the Android app client

Copy `.env.example` to `.env.local` for a local build and set:

- `VITE_SUPABASE_URL`: the same Supabase project URL used by the Worker
- `VITE_SUPABASE_ANON_KEY`: the Supabase anon/public client key (never the service-role key)
- `VITE_GM_GATEWAY_URL`: the deployed Worker base URL, without a trailing slash

The app uses Supabase email/password sign-in. Create or invite the account in the Supabase Authentication dashboard before signing in. Enable the Email provider and configure its confirmation policy there.

For a local app build, install dependencies and add the native Android platform once:

```sh
npm install
npx cap add android
npx cap sync android
```

After changing native plugins, run `npx cap sync android` again. Build the web bundle with `npm run build`; build/install the Android APK from the generated `android/` project using Gradle or Android Studio.

The secure-storage plugin is pinned to the Capacitor 7-compatible 7.1.x line. Android sessions are encrypted with Android Keystore when running in the native app. Browser preview intentionally keeps the session in memory only.
