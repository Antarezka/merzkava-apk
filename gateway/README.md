# Merzkava AI Gateway

A server-side, OpenAI-compatible gateway for the AI Game Master. The provider API key stays in the gateway environment and is never bundled into the Android app.

## Required services

- Cloudflare Workers (gateway runtime)
- Supabase Auth (user identity; JWT is verified by calling Supabase Auth)
- Google Gemini API (OpenAI-compatible Chat Completions endpoint)

## Gemini provider configuration

The gateway is configured for Gemini 2.5 Flash:

- `AI_BASE_URL`: `https://generativelanguage.googleapis.com/v1beta/openai/`
- `AI_MODEL`: `gemini-2.5-flash`
- `AI_API_KEY`: the Gemini API key created in Google AI Studio; store it as a Cloudflare Worker secret

Gemini documents a Free Tier for Gemini 2.5 Flash, with a 1 million token context window. Free-tier request limits are enforced separately (including requests per minute, tokens per minute, and requests per day) and may vary by project and region. Check the current limits in Google AI Studio before testing. Free Tier data may be used to improve Google's products, so do not send private or sensitive information.

Official references:
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini OpenAI compatibility](https://ai.google.dev/gemini-api/docs/openai)
- [Gemini API pricing and Free Tier](https://ai.google.dev/gemini-api/docs/pricing)

## Configure Cloudflare Worker

The Worker is configured by `gateway/wrangler.toml`; its entry point is `gateway/worker.ts`. Set these non-secret variables in that config or in the Cloudflare dashboard:

- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anon/public key
- `AI_BASE_URL`: OpenAI-compatible API base URL
- `AI_MODEL`: provider model identifier
- `ALLOWED_ORIGINS`: comma-separated exact origins allowed by CORS, e.g. `capacitor://localhost,http://localhost`

Add `AI_API_KEY` as a Worker secret, not a plain variable:

```sh
npx wrangler@4 secret put AI_API_KEY
```

When prompted, paste the Gemini API key into the terminal/Cloudflare secret prompt. Never paste it into chat, put it in `.env`/Vite variables, or commit it to Git.

Deploy only after configuring all values:

```sh
npm run gateway:deploy
```

For local Worker testing, run `npm run gateway:dev`. Configure local `.dev.vars` with the required secrets and keep that file out of version control.

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

## World Atlas password reset service

World Atlas passwords remain device-local salted verifiers. The service never stores or reveals a player's password. Each verifier carries a shared reset revision from Cloudflare KV. A master or authorized Developer reset rotates that player's revision, so verifiers on other devices stop matching the server revision the next time those devices run a supported build and reconnect. The player then creates a new local password on their own device. This update requirement applies to forced Master Reset; normal password changes remain immediate and local after the current password is verified.

Before deploying this Worker, create a Cloudflare KV namespace and replace REPLACE_WITH_CLOUDFLARE_KV_NAMESPACE_ID in gateway/wrangler.toml. Set these values:

- ATLAS_MASTER_RESET_PASSWORD: set only as a Cloudflare Worker secret using the Wrangler secret prompt. Never put it in the app source, APK, build logs or Git.
- ATLAS_DEVELOPER_EMAILS: comma-separated exact Supabase email addresses authorized to run account-specific Developer resets.
- ATLAS_RESET_KV: the KV namespace binding configured in wrangler.toml.
- ATLAS_RESET_LIMITER: the Cloudflare rate-limit binding configured in wrangler.toml.

The Developer reset endpoint requires a valid Supabase bearer token and an email in the server allowlist. The local Developer screen alone is not sufficient authorization. Each successful reset writes an audit record with a hashed player identifier and actor identity; it never includes any password. Master reset requests are rate-limited by client IP.

Routes:
- GET /v1/atlas/reset-status?player=<name> — read the current reset revision.
- POST /v1/atlas/master-reset — validate the master credential server-side and rotate one selected player's reset revision.
- POST /v1/atlas/developer-reset — require an authorized Supabase Developer identity and rotate one selected player's reset revision without setting or revealing a password.

A successful server reset does not create a password. It invalidates the old local verifier on every device after that device checks the latest revision; the player creates the replacement password locally. A normal password change requires only the current local password and updates that device immediately without a master-reset operation.

The Worker deployment workflow is intentionally manual for this feature. Configure the KV namespace, secret, Developer email allowlist and rate-limit binding before deploying. Until all are configured, reset routes fail closed.

## Current integration boundary

The app includes Supabase email/password sign-in, native secure session restoration, logout, and an authenticated gateway provider. Gameplay automatically sends a prepared prompt when all three public client variables are configured and a user is signed in. Otherwise, the manual prompt/response workflow remains available.

The app does not yet include an account sign-up screen. Create or invite the intended account in the Supabase Authentication dashboard. The Worker is not deployed yet; deploy it only after setting the project-specific values and secret.

## Configure the Android app client

Copy `.env.example` to `.env.local` for a local build and set:

- `VITE_SUPABASE_URL`: the same Supabase project URL used by the Worker
- `VITE_SUPABASE_ANON_KEY`: the Supabase anon/public key (never the service-role key)
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
