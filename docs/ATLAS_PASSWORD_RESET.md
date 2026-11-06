# World Atlas Password Recovery and Developer-Issued Master Reset

## Password policy

Every new or replacement World Atlas password must be 8–128 characters and contain all four:
- At least one uppercase letter.
- At least one lowercase letter.
- At least one number.
- At least one punctuation/symbol character. Whitespace does not count as a symbol.

The old password is never disclosed. A forgotten password cannot be recovered or revealed.

## Account access loading and connectivity

The Developer and Player sign-in panels use the same Merzkava access-buffer presentation: a rapidly changing diagnostic console with an animated, indeterminate progress track. The console cycles through multiple short status lines ending in `...`; its progress animation continues smoothly until the real operation settles. It is a presentation layer, not a fake percentage or a substitute for verification.

- **Player sign-in requires an active internet connection.** It fetches the current official Universe player registry and the selected profile, then checks exact identity and source-commit consistency. World Atlas sign-in, password verification, and password replacement also require a fresh connection check against the active pinned Universe snapshot.
- **Developer sign-in remains offline-capable.** It verifies the Developer ID and password locally with PBKDF2-SHA-256 and uses the device's secure credential storage where available. It does not call the Universe source, Supabase, or another server merely to authenticate Developer access. The same animation is shown, but its status lines describe local credential and session work rather than server synchronization.
- **Developer Master Reset request creation and copying use the local Developer sequence.** No network connection is required to prepare the AI request block.
- Sign-out remains available offline. Its animation describes local session revocation and cleanup rather than a network sync.

The animation runs alongside the real operation and remains visible until verification finishes. If a required Player connection or source check fails, access is denied with an error; the animation never grants access by itself.

## Change a known password

A player who knows the current password can open **Change password**, enter the current password and verify it. The replacement form then opens immediately. The player enters and confirms the new password.

This ordinary change does not need a Developer, reset code, or app update.

## Master Reset — Developer must initiate it

There is no shared or permanent Master Reset password. A player cannot create or authorize a Master Reset by themselves.

### Developer procedure

1. Open **Settings → Account & Access** while signed in as **Developer**.
2. Select the exact player account that requested recovery.
3. Verify ownership first through the official Discord or email channel, when available. Ask for evidence that ties the requester to the account; never ask for their email, Google, Apple, or other personal-account password.
4. Confirm the ownership-verification checkbox and choose **Generate reset request code**.
5. Copy the generated `MERZKAVA_ATLAS_MASTER_RESET_REQUEST_V1` block. This is a request for the AI handoff, **not** the code the player will enter. Generating it does not change or remove the player's current password.
6. Paste the complete request block into the Merzkava development AI conversation and ask it to prepare the next app update with a matching one-time confirmation grant.
7. The AI must read `src/offline-game/atlas-reset-grants.generated.ts`, validate the request fields, generate a fresh cryptographically random 32-byte confirmation value, and add exactly one account-bound grant:
   - `requestId`: the request's exact `Request-ID`.
   - `playerKey`: the request's exact `Player-Key`.
   - `codeHash`: SHA-256 of the 64 uppercase hexadecimal characters, excluding the `MZK1-` prefix and all separators.
8. Give the Developer the raw player confirmation code in the AI response. **Never put the raw confirmation code in Git, source files, logs, or build notes.** Only its SHA-256 hash belongs in the generated grant registry.
9. Wait for the next APK build that contains that grant to finish the package/signature/emulator gates. Install that updated APK on the player's device, then deliver the raw confirmation code to the verified player.

The player code format is `MZK1-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX` (64 hexadecimal characters grouped in eight blocks). Preserve the exact value when handing it to the player.

### Player procedure

1. Install the app update that contains the matching grant.
2. Sign in as the selected player and open the external World Atlas gate.
3. Select the same character account and choose **Master Reset · Developer code**.
4. Enter the unique confirmation code supplied by the Developer.
5. The app runs the familiar World Atlas access sequence while checking the code. Only a valid code for that exact account and included in this app build opens the replacement-password form.
6. Enter and confirm a new password that meets the full password policy. The code is consumed for that account on that installation when the replacement password is saved.

An invalid code, a code for another account, a code absent from the installed build, or a code already used for that account must not open or complete the reset.

## App-update boundary

A grant is compiled into the APK from the source revision that contains it. APKs built before that revision do not contain the grant and cannot accept its player code. No fixed build number is hard-coded: the next successful build that includes the generated grant is the qualifying update. A subsequent build retains the grant unless it is deliberately removed.

The request is bound to one normalized player identity. The grant is not a universal master password and cannot reset a different account.

## Device and reuse boundary

The used-grant marker is stored alongside that account's credential record. It prevents reuse on the same installation, including after an ordinary password change. Because each device keeps its own credential record, the app cannot coordinate one-time use across different devices without a shared authority. Do not describe the code as globally single-use across every device.

## AI handoff contract

When a Developer pastes a valid request block into the development conversation:

- Do not reset a password immediately and do not clear the existing credential.
- Validate the request header, request ID, player name/key, and random challenge.
- Generate a new 256-bit confirmation value for every request. Never reuse a code.
- Add its SHA-256 hash and the exact request ID/player key to `atlas-reset-grants.generated.ts`.
- Return the raw code to the Developer separately so it can be delivered after the updated APK is ready.
- Keep existing grants unless the Developer explicitly asks to revoke one.
- Run account, login, type-check, web build, and Android validation tests.
- Do not mark the reset complete merely because the grant was committed; the matching APK must be built and passed through its release checks.

## Forgotten-password notice

A forgotten password cannot be recovered or disclosed. Contact the Developer through the official Discord or email channel, if available, and be prepared to prove ownership. Only the Developer can initiate a Master Reset. The Developer will not receive or choose the replacement password; the player creates it themselves.