# World Atlas Password and Account Reset

## Credential model

World Atlas stores a salted PBKDF2 verifier locally on each device. It does not store a player's entered password in plaintext and cannot reveal or recover an old password. Every local verifier carries a shared reset revision held by the Merzkava Cloudflare Worker in KV.

A normal password change requires the current password and updates the verifier on that device. Password policy: 8–128 characters, at least one uppercase letter, one lowercase letter, one digit and one symbol.

## Supported app version requirement

The reset flow is delivered in the latest Merzkava APK build. Players must install that updated build before using the master reset or before a Developer reset can be enforced on their device. Previous APK builds do not query the shared reset revision, so they cannot enforce a newly recorded reset. Do not claim the player is locked out until the player opens the latest build and it reads the new revision. After updating, the new build prompts the player to create a new local password. This is an app-update requirement, not an action that can inject UI into an older APK.

## Master reset

The owner-provided master credential is configured only as the Cloudflare Worker secret ATLAS_MASTER_RESET_PASSWORD. Never put its value or a derived verifier in the client app, APK, source repository, build logs or public documentation.

When the player selects an account and submits the master credential, the Worker validates it and rotates that account's shared reset revision. The current device can then create a replacement local password. Other devices discover the changed revision after their players install and open the latest app build; older APKs do not check reset revisions. Each updated device must create a new local password. The same master credential can be used for any registered/local player account, including accounts created after the feature is deployed.

## Developer-assisted reset

The Developer account panel accepts a player name only; it has no new-password field. The Worker requires:
- a valid Supabase access token;
- the authenticated email to appear in ATLAS_DEVELOPER_EMAILS;
- the Cloudflare KV reset registry and reset rate limiter.

Before submitting a reset, the Developer must verify ownership through a known official channel. A successful request records the reset revision. The player must install the latest APK build; the new app then invalidates the old local verifier and asks the player to create a new password on their own device. The server records a limited audit entry with the reset type, authorized actor, hashed player identifier, revision and timestamp; it never includes the player's password.

Local Developer Mode is not server authority. The Supabase session and Worker email allowlist are the actual authorization boundary.

## Password recovery notice

Old passwords cannot be recovered because only salted hashes are retained. Players who forget a password must contact the Developer through an official Discord or email channel when available. The Developer should verify ownership using evidence other than the password, then use the account-specific reset. Never ask the player to send their current email, Google, Apple or other personal-account password.

## Required Cloudflare setup

1. Create a Cloudflare KV namespace for the World Atlas reset registry.
2. Replace REPLACE_WITH_CLOUDFLARE_KV_NAMESPACE_ID in gateway/wrangler.toml with that namespace ID.
3. Set ATLAS_MASTER_RESET_PASSWORD as a Worker secret using the Wrangler secret prompt.
4. Set ATLAS_DEVELOPER_EMAILS to the exact authorized Supabase email address(es).
5. Keep the ATLAS_RESET_KV and ATLAS_RESET_LIMITER bindings enabled.
6. Deploy the gateway manually after all configuration is present.

Until this setup is complete, the account reset endpoints return an unavailable/denied response. Do not tell players that cross-device resets are active before the deployed Worker has been configured and tested. Do not claim a reset has taken effect on an older APK: the player must update to the latest app build first.

## Screen transitions

The shared app shell fades the outgoing screen before render() replaces its DOM, then animates the new shell in with a restrained opacity/vertical/scale entrance. Individual panels keep their own scoped transitions. Respect prefers-reduced-motion; no game state or navigation state is advanced by an animation callback.
