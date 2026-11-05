# Developer Access, World Atlas Accounts and Android Back

**Last source audit:** 2026-11-05  
**Audited source commit:** ed5ef007cead9ecf8e6e70662c29ec5cce9527b0  
**Branch:** feature/global-isometric-canvas-margins-2026-11-05

This document is the security and navigation contract. It records which gates exist, what their data means, and where the boundary remains client-side rather than server-side.

## 1. Source files

| Concern | File |
|---|---|
| Developer verifier and local session | src/security/developer-access.ts |
| Developer login/Remember Me panel | src/app/developer-access-panel.ts |
| Local World Atlas password and remembered-player storage | src/offline-game/world-atlas-account.ts |
| Localized World Atlas login gate markup | src/offline-game/world-atlas-login.ts |
| World Atlas modal placement and gate CSS | src/offline-game/idle-home-map.ts, src/offline-game/idle-home-map.css |
| App-level Developer Mode, screen routes, external Atlas login and Back handler | src/main.ts |
| Independent map editor gate | src/offline-game/world-map-hierarchy.ts |
| Android native plugin wrapper and Java implementation | src/native/floating-window.ts, native/android/FloatingWindowPlugin.java |
| Generated MainActivity patch | scripts/patch-android.mjs |
| Localized Home exit confirmation | src/app/exit-confirm-panel.ts, src/style.css |

## 2. App entry gate, player access and Developer Mode

The app's first screen remains **Floating Control**. Before any role is authenticated, the account-access overlay is rendered above the original Floating Control menu; it does not replace or restructure that menu.

The gate has two separate modes:

- **Player:** accepts only a character name, with no password field and no Remember Me option. The submitted name must match a character name exactly (case-sensitive, no trimming-based correction, aliases, fuzzy matching or Unicode normalization) in `players.md` loaded from the currently verified Universe `ACTIVE_SHA`. The app fails closed if the official registry cannot be verified. A local World Atlas password or unrelated local character is not a substitute for official registry membership. Successful player access enters the normal Home screen; the developer-only Floating Control screen is hidden.
- **Developer:** requires the embedded local Developer ID and password verifier. The raw credentials are not persisted. Remember Me is available only in this mode and stores the existing authorization marker in Android SecureStorage. Successful developer access keeps the app on Floating Control and enables the developer-only screens and tools in their normal locations.

On either role's sign-out, clear both in-memory role flags, revoke Developer Mode, return to the initial Floating Control screen, and show the account gate again. Signing in as a player after a developer session must not inherit developer access; signing in as a developer after a player session must restore all developer features. The two roles must never be inferred from one another.

When Developer Mode is false:

- The full Floating Control screen is shown only as the initial pre-authentication gate background; after a player signs in, it is hidden.
- The Convo/gameplay navigation entry is removed from normal navigation.
- Supabase auth, canon/player-registry controls and other sensitive Settings panels are not rendered for ordinary players.
- Sensitive click/submit handlers reject direct calls rather than trusting hidden buttons.
- Map editor controls/canvas/test-yard entry are not rendered, and direct editor actions are rejected by the separate `worldMapDeveloperMode` gate.
- Debug/diagnostic controls remain developer-only.

The header Bubble Mode action retains its original layered Kitty artwork and its existing action. The initial Floating Control readiness sequence and native Android permission/service flow remain independent of account role.

**World Atlas is a different authentication system.** Its external login gate still requires the existing local password creation/verification flow (including confirmation when setting a first password). The new passwordless player-name gate must not bypass or modify World Atlas authentication.

On developer sign-out, revoke the in-memory state, remove the remembered marker, call `setWorldMapDeveloperMode(false)`, return to Floating Control and rerender. Never make developer access depend only on CSS, a hidden attribute or an obscured URL.

### Credential handling and security limit

The user-supplied Developer ID/password are not stored as plaintext in source, UI, docs, build notes or storage. developer-access.ts holds salted PBKDF2-SHA-256 verifier material and derives the submitted identifier/password using 600,000 iterations. The raw typed password is used for verification only. Remember Me stores only a small authorization marker through native Capacitor SecureStorage; a non-remembered session is held in memory.

Important security truth: a static client-side verifier is extractable from an APK. A sufficiently motivated attacker can attempt offline guesses against it. Base64, binary encoding or hashing does not make a credential hidden from reverse engineering. This Developer Mode is a local UI/feature gate, not server-grade authorization. Any operation that protects important remote data or privileged server actions must also be authorized server-side. Do not claim this local verifier is unbreakable.

## 3. World Atlas player account identity

The external Atlas account identity is the intersection of two data sources:

1. **Verified Universe character registry:** src/convo/canon/canon-loader.ts loads players.md only from the verified active 40-character ACTIVE_SHA, parses the official character table and fetches listed players/<character>.md profiles from that same snapshot.
2. **Local Eternal Path save:** listEternalSaves() in src/offline-game/expedition-game.ts returns local journeys; the selected character name must match a local save's character name.

Only a character present in both sources is offered as an Atlas account. A stale/unverified canon snapshot must not be silently replaced with guessed registry data.

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
6. If the selected player has no local password, switch the panel to first-password/sign-up mode and require password confirmation.
7. If a password exists, require verification.
8. On success, store only the remembered player preference when selected, then unlock the Atlas for the current session.
9. X/back closes the Atlas gate and returns to Eternal Path without deleting the journey.

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
- tests/offline-game/world-atlas-login.test.ts: modal markup, signup/login, remember, back action across eight languages.
- tests/app/exit-confirm-panel.test.ts: localized Home exit confirmation, No/Yes controls.
- tests/offline-game/isometric-npc-chat.test.ts: map editor gate, chat markup, scan effects and field-window markup.
- The main CI pipeline also runs gameplay formula/map/editor tests and TypeScript/Vite build.

Keep security gates duplicated in main app routing and map editor handlers. Never store or document raw Developer credentials. Never treat players.md as password authority.
