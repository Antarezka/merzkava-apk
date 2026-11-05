# Developer Access, World Atlas Accounts and Back Navigation

**Last audited:** 2026-11-05  
**Code baseline audited:** fae1ec3f1ef13eca0d20bf1453935b2b47a2c031

This document distinguishes active gates from unfinished login/navigation work. The app is client-side Android/WebView software; hiding a control is not a server-side security boundary.

## 1. Developer access source files

- src/security/developer-access.ts — developer ID/password verifier, session state and Remember Me persistence.
- src/app/developer-access-panel.ts — localized developer login panel and header controls.
- src/main.ts — developer state, app-shell visibility, submit/click guards and session restore.
- src/offline-game/world-map-hierarchy.ts — second gate around map editor markup, binders and direct editor actions.
- src/native/floating-window.ts — Android FloatingWindow plugin wrapper.
- src/app/floating-control.ts — sensitive floating-control surface.

The developer login panel has a Remember Me checkbox. On native Android, the remembered session uses Capacitor SecureStorage (Android Keystore-backed storage). The app stores a session authorization marker, not the entered password. A non-remembered session remains in memory.

The verifier in developer-access.ts is a client-side PBKDF2 verifier. It is not equivalent to remote authentication: an extracted APK contains verifier material and an attacker can attempt offline guesses. Encoding a password as binary, base64 or a hash does not make a static client verifier unbreakable. Do not add a plaintext credential to source, documentation, build notes or UI. For stronger release security, move developer authentication to a server challenge/credential service and keep privileged operations protected server-side. Until then, describe the client gate accurately as a local UI/feature gate, not a robust security boundary.

## 2. What is gated today

The main shell starts with developerAuthenticated=false unless a remembered native developer session is restored. It hides developer Floating Control header/actions and the Convo navigation entry from ordinary users, and limits sensitive Convo/Supabase/canon controls to authenticated developer views.

Click/submit handlers reject sensitive actions when Developer Mode is false. World-map editor code also has an independent worldMapDeveloperMode flag, initially false. Map editor markup, editor binders, Academy canvas editor markup and developer test-map entry points are guarded. setWorldMapDeveloperMode(false) removes mounted editor dock/canvas controls and clears editor pause classes. Keep both gates; never replace them with CSS-only hiding.

The ordinary user must still be able to browse player-facing screens and start/use the intended Eternal Path experience. Do not blanket-lock all navigation merely because an item is a button; gate the specifically sensitive surfaces.

## 3. World Atlas player identity and local password module

Official registry source is the verified Universe player registry loaded through src/convo/canon/canon-loader.ts:
- refreshLatestPlayerRegistry(activeSha) requires the exact verified active 40-character commit SHA;
- it parses players.md and fetches listed players/<name>.md profiles from the same commit;
- main.ts maps those registry records into registeredCharacters, retaining registry path and commit metadata.

Eternal Path local save records are separate. listEternalSaves() in src/offline-game/expedition-game.ts returns local journey summaries, including characterName. A World Atlas account must be resolved against both:
1. a valid registered character from players.md at the current verified canon snapshot; and
2. a matching local Eternal Path journey/save on the device.

players.md is an identity/character registry, not a password database. Do not pretend it contains passwords or provides email/password authentication.

src/offline-game/world-atlas-account.ts already provides local password primitives:
- hasAtlasPassword(playerName)
- setAtlasPassword(playerName, password)
- verifyAtlasPassword(playerName, password)
- rememberAtlasPlayer(playerName, remember)
- restoreAtlasPlayer()
- getActiveAtlasPlayer()
- clearAtlasPlayer()

The module uses a per-account key derived from player name, a random salt, PBKDF2-SHA-256 with 310,000 iterations, and a stored salt/hash record. Native builds use SecureStorage; browser preview uses localStorage fallback. It does not store the typed password in plaintext.

Important: this module exists, but as of the audited baseline it is NOT wired into the World Atlas UI in main.ts. The module must be integrated in a later pass.

## 4. Required World Atlas login flow

The external World Atlas entry is the Eternal Path television/floating icon:
- TV button: data-idle-rpg-open
- containing modal: data-idle-rpg-modal
- existing close controls: data-idle-rpg-close
- inner world map component: data-world-map-hierarchy / data-wmh-dialog

When the external TV icon opens the Atlas:
1. Always show the centered account/login panel before exposing the Atlas interaction surface.
2. Blur/dim the rest of the Atlas behind the panel and make the outside region inert/non-clickable. Use an actual modal/backdrop and focus management; visual blur alone is not an interaction lock.
3. Offer only registered characters that also have a matching local Eternal Path save.
4. If the selected character has no local Atlas password, show a localized create-password/sign-up flow.
5. If a password already exists, require verification before unlocking the Atlas.
6. Provide a Remember Me checkbox; use rememberAtlasPlayer / restoreAtlasPlayer for local player selection. Showing the panel on every external TV entry is still required even when the player was remembered.
7. Provide X/back-to-Eternal-Path. Closing must remove the Atlas gate and return to the existing Eternal Path view without deleting the local journey.
8. On success, unlock the Atlas for the current app session and record the selected active player.
9. On failure or cancel, keep the map inert and do not expose a partially logged-in state.

The languages currently declared by src/i18n.ts are id (Bahasa Indonesia), en (English), pt (Português), fr (Français), ru (Русский), ja (日本語), zh-CN (简体中文) and ko (한국어).

“Sign up” here means creating a local password for an already registered character with a local save. It must not create or claim a new official Universe player record. Adding a player to players.md remains an owner/repository workflow.

### Internal game-world Atlas entry

The internal World Atlas map action is handled inside handleWorldMapHierarchyClick (the data-wmh-action="open" route). That route is different from the external TV button. Preserve the owner's requested distinction:
- external TV from Eternal Path → require the World Atlas login panel every time;
- internal map/Atlas navigation originating inside the live game world → do not show the external account login panel.

Do not add a universal gate inside renderWorldMapHierarchy() that would lock internal map transitions as well.

## 5. Android Back / gesture navigation — not implemented

As of the audited baseline, main.ts has a popstate listener for existing overlays: idle-rpg-modal, Eternal Path save manager and Eternal Path choice modal.

It closes those overlays and restores some focus. It does not maintain a complete application screen history and does not show the requested localized exit confirmation on the main menu. There is no demonstrated Capacitor native BackButton/App.exitApp integration in the current package. Do not claim hardware Back, Android gesture Back or exit confirmation is finished.

Required behavior:
1. Back from an in-app screen returns to the previously visited app screen, not directly to launcher/OS.
2. Continue unwinding navigation history until Home/main menu.
3. Back while Home is visible opens a localized exit-confirmation panel.
4. Every new Back press on Home must be able to reopen the confirmation after the previous panel is dismissed.
5. Only explicit Yes may request app exit. No, X, outside dismissal or repeated Back must not exit.
6. Preserve existing modal stack behavior. An open modal should close before navigating to another app screen.
7. Integrate Android hardware Back/gesture using the supported Capacitor/native lifecycle route after reviewing the existing Android native integration. Do not assume browser popstate alone reliably handles every Android Back pathway.

Exit title/body/buttons must be localized across all eight app languages.

## 6. Sensitive action inventory and tests

Audit at least:
- Developer login/logout and Remember Me;
- Floating Control page, floating bubble, native overlay permissions and service start/stop;
- Convo screen and gameplay submission;
- Supabase login/logout;
- canon refresh, module loader and canon router;
- map editor, Academy canvas editor, test yard, map data import/export/confirm;
- future local Atlas account settings/password actions.

For each surface verify both:
- unauthenticated markup does not expose the sensitive control; and
- direct/delegated click, submit or programmatic route is denied while authentication is false.

Add tests for default locked state, failed/successful developer login, logout revocation, native Remember Me, Atlas registry+local-save intersection, no-password sign-up, password verification, remembered player, cancel, external TV login versus internal map-open bypass, focus trap/inert backdrop/X, screen-history unwinding, repeated Home exit confirmation and native Android Back.

Do not store raw credentials in screenshots, tests, build artifacts, generated build notes or documentation. Do not log user-entered passwords.
