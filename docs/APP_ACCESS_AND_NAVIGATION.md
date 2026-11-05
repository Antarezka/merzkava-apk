# Developer Access, World Atlas Accounts and Android Back

**Last source audit:** 2026-11-06  
**Baseline build:** Android Build #1234 · `2676daffff0610013793cc5b17312fe8b320abf9`  
**Working branch:** `fix/account-settings-atlas-remember-2026-11-06`

This document is the security and navigation contract. It records which gates exist, what their data means, and where the boundary remains client-side rather than server-side.

## 1. Source files

| Concern | File |
|---|---|
| Developer verifier and local session | src/security/developer-access.ts |
| Developer login/Remember Me panel | src/app/developer-access-panel.ts |
| Local World Atlas password and remembered-player storage | src/offline-game/world-atlas-account.ts |
| Localized World Atlas login gate markup and access-buffer motion | src/offline-game/world-atlas-login.ts, src/offline-game/world-atlas-login-motion.ts |
| World Atlas modal placement and gate CSS | src/offline-game/idle-home-map.ts, src/offline-game/idle-home-map.css |
| App-level Developer Mode, screen routes, external Atlas login and Back handler | src/main.ts |
| Independent map editor gate | src/offline-game/world-map-hierarchy.ts |
| Android native plugin wrapper and Java implementation | src/native/floating-window.ts, native/android/FloatingWindowPlugin.java |
| Generated MainActivity patch | scripts/patch-android.mjs |
| Localized Home exit confirmation | src/app/exit-confirm-panel.ts, src/style.css |

## 2. App entry gate, player access and Developer Mode

The app's first screen remains **Floating Control**. Before any role is authenticated, the account-access overlay is rendered above the original Floating Control menu; it does not replace or restructure that menu.

The initial **Developer** login is deliberately local and remains available without an internet connection. It verifies the embedded PBKDF2 credential using the on-device verifier and SecureStorage; its existing submit-busy/loading indicator is retained. The live internet requirement and four-second animated access buffer apply only to the separate external **World Atlas** login. Never add the Atlas connectivity check to `developer-login-form`.

The gate has two separate modes:

- **Player:** accepts only a character name, with no password field and no Remember Me option. The submitted name must match a character name exactly (case-sensitive, no trimming-based correction, aliases, fuzzy matching or Unicode normalization) in `players.md` loaded from the currently verified Universe `ACTIVE_SHA`. The app fails closed if the official registry cannot be verified. A local World Atlas password or unrelated local character is not a substitute for official registry membership. Successful player access stays on the same Floating Control screen as Developer and can use the same permission-setup steps. Developer-only tools remain hidden. The player explicitly selects Open game / continue playing to enter the normal Home screen.
- **Developer:** requires the embedded local Developer ID and password verifier. The raw credentials are not persisted. Remember Me is available only in this mode and stores the account identifier and entered password inside native Android SecureStorage, alongside the authorization marker. Lock revokes the active authorization marker but intentionally retains remembered credentials so the initial login panel can prefill both fields; leaving Remember Me unchecked on a subsequent successful login deletes the saved credential record. Browser preview does not persist the credential pair. Successful developer access also stays on Floating Control and enables the developer-only screens and tools in their normal locations. The Developer Floating Control and Lock actions are presented together in Settings → Account & Access; the top header keeps the Kitty Bubble Mode action and the Settings icon only.

On either role's sign-out, clear both in-memory role flags, revoke Developer Mode, return to the initial Floating Control screen, and show the account gate again. Signing in as a player after a developer session must not inherit developer access; signing in as a developer after a player session must restore all developer features. The two roles must never be inferred from one another.

When Developer Mode is false:

- Both roles land on the same Floating Control permission screen after login. Ordinary players can complete the overlay, notifications and battery steps, and use the normal Floating Control entry actions; developer-only UI elsewhere remains hidden.
- The Convo/gameplay navigation entry is removed from normal navigation.
- Supabase auth, canon/player-registry controls and other sensitive Settings panels are not rendered for ordinary players.
- Sensitive click/submit handlers reject direct calls rather than trusting hidden buttons.
- Map editor controls/canvas/test-yard entry are not rendered, and direct editor actions are rejected by the separate `worldMapDeveloperMode` gate.
- Debug/diagnostic controls remain developer-only.

The header Bubble Mode action retains its original layered Kitty artwork and its existing action. The adjacent Settings icon keeps its established header position; Developer Floating Control / Lock and Player Sign out are moved to the Account & Access section inside Settings. The initial Floating Control readiness sequence and native Android permission/service flow remain independent of account role. The initial Developer login password field has a CSS-styled eye control to show or hide the typed password.

**World Atlas is a different authentication system.** Its external login gate still requires the existing local password creation/verification flow (including confirmation when setting a first password). The new passwordless player-name gate must not bypass or modify World Atlas authentication.

On Developer Lock/sign-out, revoke in-memory access immediately, clear only the active authorization marker (preserve an explicitly remembered credential record), call `setWorldMapDeveloperMode(false)`, return to the Developer login panel and rerender. If SecureStorage cannot delete the active marker, write the explicit `locked` value; session restoration accepts only `authorized`. If both SecureStorage operations fail, surface the lock failure and do not claim durable revocation. Never make Developer access depend only on CSS, a hidden attribute or an obscured URL.

### Credential handling and security limit

The Developer verifier material in `src/security/developer-access.ts` is salted PBKDF2-SHA-256 and derives the submitted identifier/password using 600,000 iterations. Without Remember Me, credentials are used only for verification and the active session remains in memory. When the owner explicitly selects Remember Me on native Android, the identifier and password are saved in Capacitor SecureStorage so the initial login form can be prefilled after Lock; a separate active-session marker controls whether Developer access is restored at launch. Lock clears that active marker while preserving the opt-in credential record. Browser preview does not persist the raw credentials. The World Atlas account remains separate and never stores its raw password.

Important security truth: a static client-side verifier is extractable from an APK. A sufficiently motivated attacker can attempt offline guesses against it. Base64, binary encoding or hashing does not make a credential hidden from reverse engineering. This Developer Mode is a local UI/feature gate, not server-grade authorization. Any operation that protects important remote data or privileged server actions must also be authorized server-side. Do not claim this local verifier is unbreakable.

## 3. World Atlas player account identity

World Atlas now offers a merged, de-duplicated player list from three labelled sources:

1. **Universe registry:** `players.md` is loaded from the currently verified `ACTIVE_SHA`; these names and linked profiles remain official Universe identities.
2. **Local app profiles:** locally stored characters from the app database are available as local Atlas identities.
3. **Local Eternal Path journeys:** characters already present in local journey saves are also available.

Universe registry entries take precedence when the same name appears in more than one source. Local-only entries are explicitly labelled `Local Profile` or `Local Journey`; creating an Atlas password for one does not register it in `players.md`, grant official canon status, or create an official Universe profile. A stale/unverified canon snapshot must not be silently replaced with guessed registry data.

players.md is a character identity/registry list. It is not a password database and does not contain account passwords. Atlas password creation does not create a new official Universe character. Adding a new official character remains an owner/repository workflow.

### Local password storage

src/offline-game/world-atlas-account.ts provides:

- hasAtlasPassword(playerName)
- setAtlasPassword(playerName, password)
- verifyAtlasPassword(playerName, password)
- rememberAtlasPlayer(playerName, remember)
- restoreAtlasPlayer()
- getActiveAtlasPlayer()
- clearAtlasPlayer()

The local password rules:

- 8–128 characters.
- The first-password form displays a localized reminder to create a unique World Atlas password; do not reuse an email, Google/Apple, or other personal-service password.
- Random 16-byte salt per player account.
- PBKDF2-SHA-256 with 310,000 iterations.
- Persisted record contains version, iteration count, salt and verifier hash; no plaintext password.
- Native Android uses Capacitor SecureStorage. Browser preview falls back to localStorage, which is less protected and must not be treated as a production security boundary.
- Remember Me remembers the player name/session selection. It does not persist the raw password.

## 4. World Atlas entry policy

### External TV entry — login required every time

The Eternal Path TV trigger is data-idle-rpg-open. On every external open:

1. Open the World Atlas modal and initialize the map.
2. Show the centered World Atlas gate before exposing interaction.
3. Dim/blur the rest of the Atlas and set sibling UI inert/aria-hidden so it cannot be clicked or reached while the gate is active.
4. Load the verified registry and local save intersection.
5. Preselect a remembered player name if it remains eligible, but still show the login panel. Remember Me is not automatic login.
6. If the selected player has no local password, switch the panel to first-password/sign-up mode and require password confirmation. This creates only a local Atlas password for the selected Universe or local identity.
7. If a password exists, verify it against the locally stored salted verifier.
8. Before accepting the login, require `navigator.onLine` and perform a fresh, uncached request to `players.md` at the currently verified Universe `ACTIVE_SHA` via `verifyCanonSourceConnection()`. A missing connection, missing active snapshot, HTTP failure, empty source or timeout fails closed with the localized internet/source-unavailable message. The check uses a seven-second timeout. No first-time password or Remember Me player selection is written, and the Atlas remains locked, when this check fails.
9. Run the four-second CSS/Anime.js access sequence alongside the real source request and local credential verification. The buffer remains visible until the live source request settles, so a slow or failed connection does not leave an inert login form exposed. Its stages describe the actual player/source/credential/session steps; this is not a remote account-security or server-authentication system.
10. Only after a reachable official source and valid local password are confirmed, create a first-time local password when needed, store only the remembered player name when selected, and unlock the Atlas for the current session. The raw Atlas password is never stored.
11. X/back, Escape or Android Back closes the external Atlas modal. When a login is in progress, closing it aborts the uncached source request and animation, invalidates the attempt, and restores the form state. A cancelled or stale async attempt must never unlock the Atlas after the modal has closed or been reopened.

Failed password, no matching local save, missing/invalid registry snapshot or a cancelled login must not expose a partially unlocked Atlas.

### Internal game-world Atlas entry — bypass login

The map hierarchy's in-world Atlas open action (data-wmh-action="open") is a distinct internal route. Preserve the owner requirement that a player already inside the game world may open the in-world Atlas without the external TV login gate. Do not add the login gate to every map hierarchy open action.

### Supported languages

src/i18n.ts currently defines: id (Bahasa Indonesia), en (English), pt (Português), fr (Français), ru (Русский), ja (日本語), zh-CN (简体中文), ko (한국어). Atlas panel labels and dynamic status prompts are supplied for all eight. Any new login/error/exit wording must use the current selected language.

## 5. Android Back, gesture Back and Home exit

The intended route is one stack, shared by hardware Back and Android predictive/gesture Back.

### Native bridge

- scripts/patch-android.mjs patches the generated Android MainActivity.
- It imports android.webkit.WebView and AndroidX OnBackPressedCallback.
- The callback dispatches merzkava:android-back into the WebView JavaScript context.
- src/main.ts handles that event by moving one step back through browser history.
- exitMerzkavaApplication() calls the native FloatingWindow plugin's exitApp(); the Java plugin finishes/removes the app task. This method is called only from the affirmative Home exit action.

### JavaScript screen history

- Screen navigation adds a history state with the destination screen ID.
- A base sentinel plus Home state is created on startup.
- Back first closes the topmost eligible modal/overlay (World Atlas, Developer login, Eternal Path manager/choice modal), then returns to the previous in-app screen.
- When the current screen is not Home and no overlay is open, Back returns to Home rather than closing the app.
- At Home, Back shows the localized exit confirmation. No/Stay closes the prompt and keeps the app open. The Home history state is rearmed so another Back shows the prompt again.
- Only Yes/Exit calls the native app-exit method.
- Escape also closes the Atlas and developer-login panels in the WebView.

A browser preview may refuse window.close(); native Android is the supported actual app-exit target.

### Remaining proof

The JS history behavior and native patch are implemented in source. Do not mark predictive Back/gesture behavior physically verified until the current Android build passes packaging/emulator and the owner tests hardware Back plus edge gesture on the target device. Verify that the same press closes a modal first, then returns screens, then shows Home confirmation, and only Yes exits.

## 6. Tests and regression guards

Current dedicated tests:

- tests/offline-game/world-atlas-account.test.ts: salted hash/no plaintext, password verification, remember preference separation, password length and sign-out behavior.
- tests/offline-game/world-atlas-login.test.ts: modal markup, first-password/sign-in mode, localized access-buffer stages, remember, and back action across eight languages.
- The World Atlas access-buffer motion is isolated to `src/offline-game/world-atlas-login-motion.ts`; it is finite, four seconds, respects reduced-motion preferences, and cancels cleanly with the external login attempt.
- The World Atlas live-source request accepts an AbortSignal; closing via X, Escape or Android Back cancels the pending request and blocks stale completion from unlocking the map.
- Developer Remember Me uses native SecureStorage for the opt-in ID/password prefill record; Lock clears the separate active authorization marker, falls back to a persistent `locked` marker if deletion fails, and returns to the Developer tab. The initial login eye control is presentation-only.
- `tests/security/developer-access.test.ts`: verifies secure lock preserves remembered credentials and fails closed when the active marker cannot be removed.
- tests/app/exit-confirm-panel.test.ts: localized Home exit confirmation, No/Yes controls.
- tests/offline-game/isometric-npc-chat.test.ts: map editor gate, chat markup, scan effects and field-window markup.
- The main CI pipeline also runs gameplay formula/map/editor tests and TypeScript/Vite build.

Keep security gates duplicated in main app routing and map editor handlers. Never store or document raw Developer credentials. Never treat players.md as password authority.
