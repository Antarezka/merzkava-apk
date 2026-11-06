# Merzkava — Confirmed Access Loading Routine

> **Master plan:** [Product Roadmap](./PRODUCT_ROADMAP.md), Workstream 2B.
> **Runtime:** `src/offline-game/world-atlas-login-motion.ts`.
> **Visual owner:** `src/offline-game/idle-home-map.css`.
> **Markup:** `src/offline-game/world-atlas-login.ts`.
> **Motion library:** Anime.js 4.x. No canvas or PixiJS.

## Design language

The access routine is a compact Victorian clockwork instrument, not a generic spinner or web progress widget. Its visual vocabulary follows the shared Merzkava shell:

- Dark verdigris enamel and forest-green lacquer in Dark Theme.
- Aged brass rails, engraved concentric dial marks, warm champagne-gold illumination, and a small central Merzkava medallion.
- Parchment, sage, and muted brass equivalents in Light Theme.
- Restrained Cinzel editorial labels and a single compact monospaced diagnostic line.
- Subtle orbit, scanning reflection, lamp pulse, and a segmented brass progress track. Decoration never covers or imitates a control.

The visual should feel like a small instrument chamber coming to life: measured, tactile, arcane, and legible on a narrow Android screen. It must not borrow third-party logos, copied artwork, or recognizable branded UI.

## When it appears

The overlay begins only when the user confirms an operation that actually performs work:

- Player and Developer sign-in or sign-out.
- World Atlas Login or first-time Sign-up submission.
- Verification of the current password or account-bound Master Reset confirmation code.
- Saving a replacement World Atlas password.
- Developer confirmation to generate an account-specific reset request.
- Explicit confirmation to copy the reset request to the device clipboard.

It does **not** appear while:

- Opening World Atlas.
- Fetching/refreshing the live player registry.
- Selecting a character name.
- Reading whether that character already has a local password.
- Opening the Change Password or Master Reset form.
- Revealing the new-password form after successful verification.

Those non-confirmation steps use inline status text and normal panel transitions. They must not be dressed up as fake network or credential activity.

## Single-pass motion contract

1. Start at 0% only after the user confirms the operation.
2. Move through randomized, strictly increasing progress checkpoints. The bar advances in short, eased runs, then pauses for an uneven interval. It never resets or travels backward.
3. At each checkpoint, display one diagnostic message in one text slot. Animate the previous frame out, replace it, then present the same message as three successive frames: `Message.`, `Message..`, `Message...`.
4. Replace that message with the next stage; never stack a history of messages or display a second diagnostic console beside it.
5. Keep progress below full completion while the real task is still pending. If the task outlasts the staged progress, hold near completion and continue subtle final-stage text frames.
6. Complete the last segment to 100% only when the real task resolves successfully. On failure or cancellation, close the overlay and let the owning screen show the real error; never claim successful completion.

Diagnostic copy must match its context. World Atlas registry terms are fetch-only. PBKDF2 terms are reserved for real credential work. Developer reset-request and clipboard routines describe local operations, not network synchronization. The animation is presentation only; it does not replace or authorize any operation.

## Accessibility and runtime

- Respect `prefers-reduced-motion`: keep the message readable and the progress path understandable without the orbit, scan, glow pulse, or text travel.
- Scope/cancel Anime.js work when the access routine ends. No detached-node loops may remain.
- Keep the outer access surface inside the available viewport and preserve the existing modal close/cancel rules.
- Preserve Light and Dark Theme, safe-area padding, and small-screen legibility.
- The progress checkpoints are a visual pacing device, not a measured percentage of backend completion. Do not label them as a real network percentage.

## Verification

Automated checks cover the one-line markup, diagnostic frame punctuation, monotonically increasing checkpoints, randomized stalls, and build/type-check. Physical-device QA must still verify scroll/touch interaction, visual contrast, animation pacing, and frame stability on the target Android phone.
