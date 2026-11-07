# Godot Migration — Legacy App Parity Audit

**Audit date:** 2026-11-07  
**Legacy source baseline:** main at 818bf65b12f4b20bc50f2db75cde065133cce088  
**Last APK checkpoint identified:** Android Build #1360, source 2be3fee29e56b6bb062bf93acf46ab0e19387928  
**Migration branch:** migration/godot-offline-engine-2026-11-07  
**Godot baseline at audit:** 9d13203768d178f9f71fcd046bc6ee18b2b00f10

## 1. Why this audit exists

The Godot test APK that preceded this audit was only a migration splash/test screen. It rendered a wordmark and status text, had no usable navigation, and did not preserve the previous app's access, account, Floating Control, menu, audio, or Kitty behavior. It must not be treated as the app shell.

This audit records the behavior of the last pre-Godot source before porting it. The source baseline is the latest main revision observed before the Godot migration. Build #1360 is the last identified APK checkpoint, but it predates two later source commits on main. Therefore, this audit is based on source inspection; it does not claim that every behavior in 818bf65 was installed or physically verified on the TECNO device.

Source-of-truth order for the port:
1. The audited pre-Godot app source at 818bf65 for existing UI and behavior.
2. The Product Roadmap for product decisions and feature boundaries.
3. APP_ACCESS_AND_NAVIGATION for account/security/navigation contracts, reconciled against the newer source where they differ.
4. The official Merzkava Universe repository for world canon and gameplay rules.
5. Godot implementation and tests for the new runtime. A visible control is not complete until its real action works.

## 2. App launch, entry gate and screen order

The legacy app does not open directly into a generic title card. Its first app screen is Floating Control, with the account-access panel displayed above that screen until a valid app role is established.

After access succeeds, the user remains on Floating Control. They explicitly choose Open game / continue playing to enter the main app. The existing Kitty splash is shown when entering the game, entering Bubble Mode, or opening the floating mini-window. Do not move the splash to an unconditional cold-launch screen or skip the access gate.

Required flow:
1. Initialize local database and recover eligible device-local state.
2. Restore Developer access state and the separate Supabase session independently.
3. Verify the local access bootstrap has completed before accepting Player or Developer form submission.
4. Show the Player / Developer access panel over Floating Control when no app role is active.
5. After a successful role check, return to Floating Control and expose only the controls allowed for that role.
6. Enter Home through the explicit Open game / continue action and play the existing Kitty entrance sequence.
7. Android Back first closes the topmost modal, then returns through app screens, then presents the Home exit confirmation. Only affirmative exit closes the app.

## 3. The three separate account systems

These are different identities and must never be merged into a single generic login or account table.

### 3.1 App access: Player role

- The gate asks for a Player character name only. It does not ask for a password and has no Remember Me option.
- The name is trimmed at the input boundary, then matched case-sensitively and exactly against players.md from the currently verified Universe ACTIVE_SHA. No aliases, fuzzy match, case folding or guessed identity.
- A fresh official source/registry check is required. A missing internet connection, missing active SHA, unavailable registry, or snapshot mismatch fails closed.
- A local World Atlas password, local profile with a different identity, Supabase session, or Developer Remember Me record cannot substitute for official Player roster membership.
- On success, the app clears any Developer role and cloud Supabase session, loads that Player's selected profile, chat and world-time state, and returns to Floating Control.
- The ordinary Player role must not expose Developer-only navigation, settings, map editing, diagnostics, or server/canon administration.
- Player sign-out is allowed offline and returns to the same gate/Floating Control state.

### 3.2 App access: Developer role

- Developer access is device-local; it does not call the network.
- The legacy verifier uses PBKDF2-SHA-256 with 600,000 iterations and constant-time verifier comparison for the normalized Developer ID and exact password.
- The authorization marker and opt-in Remember Me credential record are separate SecureStorage entries on Android. The raw remembered ID/password pair is saved only when Remember Me is explicitly selected; browser preview does not persist that pair.
- Lock revokes the active authorization marker while preserving an explicitly remembered credential pair so the login form can be prefilled. A later login with Remember Me unchecked removes the saved pair.
- A failed credential check clears the active authorization marker. If marker removal fails, the port must preserve the locked-marker fallback and surface a real error rather than claim the session was securely revoked.
- Developer access enables Developer-only routes and tools. It must not be inferred from a Supabase session or an Atlas password.

### 3.3 Supabase cloud account: Convo / AI GM

- Supabase email/password sign-in is a separate cloud account, used for connected Convo / AI GM operations.
- Its access/refresh token session is stored in Android SecureStorage and refreshed near expiry. The app does not store the Supabase password.
- It is presented in Developer Settings under World & Account, not as the Player/Developer app-entry login.
- Missing cloud configuration or network must not block local Eternal Path, local profile data, or World Archive.

### 3.4 World Atlas local player password

World Atlas is a separate password gate opened from the in-world TV. It is not the app-entry Player gate and is not the Supabase account.

- The eligible identity list combines the verified Universe roster, local app profiles, and local Eternal Path journeys, de-duplicated with Universe entries taking precedence and local-only entries visibly labelled.
- The external TV route displays the centered gate and locks/dims the surrounding Atlas until access succeeds. The internal in-world map-hierarchy route keeps its existing login bypass.
- External login requires an active internet connection and a fresh source check against the verified Universe snapshot. A local password does not bypass source verification.
- The first Atlas password is created locally after explicit Sign Up, password confirmation, password policy checks, and source verification. It does not register a new Universe character.
- Password policy is 8–128 characters with uppercase, lowercase, a number, and a symbol. A forgotten password is never revealed or recovered.
- Atlas password records use PBKDF2-SHA-256 with 310,000 iterations and a random 16-byte salt. Android stores the record in SecureStorage. The current native Remember Me implementation stores the selected player identity and, only when explicitly checked, the password in SecureStorage; the restored password is re-verified before it is placed in the form. Unchecking Remember Me or signing out clears that remembered password. Preserve this observed source behavior; do not silently change it to a different account contract.
- Changing a password requires current-password verification. Master Reset requires the account-bound, one-time confirmation grant that is compiled into a matching app update. A Developer request is not itself a player reset code; it carries a random Request-ID, account binding, challenge and Player-Key digest. Only the confirmation-code hash belongs in the generated grant source. The Developer does not see or choose the player's new password.

## 4. Access buffer / diagnostic loading presentation

The existing access buffer is a presentation layer tied to an actual asynchronous operation. It is not an authentication mechanism and must not become an arbitrary loading screen.

Required visual behavior:
- Dark enamel / parchment instrument panel, thin brass progress rail, orbital ring, central glow and scanning beam.
- One current diagnostic line at a time; replace the text instead of stacking a log. The trailing punctuation advances through one, two and three dots as separate frames.
- Progress moves through deliberately uneven, monotonic checkpoints to approximately 92%, with short holds. It waits near completion while the real operation remains pending.
- It reaches 100% only after the real task succeeds. A failed or cancelled task closes the sequence without a false success state.
- Reduced-motion behavior remains supported, and cancellation invalidates stale attempts so an old request cannot unlock a gate after it was closed or reopened.
- Stage text is context-specific and localized across the app's eight languages. Keep the existing Player, Developer, session-exit, World Atlas, password change/reset, reset-request, registry-list and clipboard contexts distinct.

Only show the buffer after the user explicitly starts a real operation: Player roster verification, Developer credential verification, confirmed sign-out/lock, Atlas sign-in or sign-up, confirmed password verification/update, Developer reset-request generation, or confirmed clipboard handoff. Do not show it just because a screen or modal opens, a local list loads, a name is selected, or a form is revealed. A progress animation must never claim that a security/network step occurred when that step did not happen.

## 5. Floating Control and native Android behavior

Floating Control remains the initial permission/setup surface for both ordinary Player and Developer roles. Role checks hide Developer-only tools elsewhere; they do not remove the normal Floating Mode actions from a Player.

The ordered readiness checks are:
1. Display over other apps permission.
2. Notifications permission.
3. Battery optimization exemption / background activity permission.
4. Foreground service running state.

Preserve the actions and their actual outcomes:
- Start bubble mode: refresh readiness, require all three permissions, play the entry splash, return the app state to Home, create the Kitty bubble and move the task to the background.
- Open game / continue: stop Floating Mode and return through the Kitty entrance to Home.
- Open floating mini-window: require overlay permission, preserve the current game selection/session, and open the Godot-backed window presentation.
- Stop service: remove the bubble/mini-window overlay and stop the foreground service.
- Donate: keep the explicit unconfigured/notice state until a real official destination is provided; do not invent a payment URL.

The old Java plugin moves the app's WebView into a system WindowManager overlay for mini-window mode. That WebView reparenting is not reusable. The Godot port must display the same Godot-owned screen/state in the floating mode; it must never fall back to shipping the old WebView as a second UI runtime. Drag, resize, minimize, restore, close, Android lifecycle, permission re-check and service cleanup must be tested on-device.

### Kitty cross-app bubble

The existing bubble is a 64dp, draggable Android WindowManager overlay. A tap launches/restores the floating application window; dragging moves the bubble. It is not an in-app floating icon and cannot be clipped by the Godot Control tree.

Preserve its distinctive rendering:
- Four registered Kitty layers, drawn in order: shadow, tail, body, head.
- A 64dp touch target, with the current starting offset near the top-left safe area.
- A dim circular guide and a 112-degree segmented light trail made from 14 rounded segments.
- The light completes one rotation in about 2.6 seconds, with a restrained pulse and a short double beacon flash near the end of the cycle.
- Validated online state uses warm gold; offline state uses red. The Android service observes connectivity changes and updates the lamp without changing the Player's identity or game state.

Platform boundary: all in-app screens, splash, controls, menus, and transitions are Godot-native. A true cross-app bubble must be drawn by a small Android foreground-service / WindowManager integration because it exists outside the Godot app window and must remain visible while that window is in the background. That tiny OS overlay is platform plumbing, not a second game or WebView renderer. Its animation must stay minimal and power-bounded.

## 6. Kitty splash, identity artwork, launcher icon and audio

### Layered mascot

The legacy Kitty composition uses aligned transparent PNG layers on the same 1024×1024 canvas: shadow, tail, body and head. Their alignment must be preserved in Godot; do not crop layers independently or let them drift.

The splash uses a dark green-black archive atmosphere with a centred warm light, editorial wordmark, restrained particles and Kitty at a believable scale. Preserve the motion character:
- Soft body breathing and matching contact-shadow breathing.
- Small head idle drift and an occasional brief head shake.
- Independent tail sway.
- Warm diagonal reflection / light-ray movement and a restrained wordmark glow.
- Staggered entrance and a short curtain close; a user tap may skip the remaining entry and cancel the opening audio.

Use Godot AnimatedSprite2D / SpriteFrames, AnimationPlayer and Tween for in-app animation. Keep sparks and shaders restrained for the TECNO Spark Go 1 KL4; pause hidden/off-screen animation.

### Launcher icon

The old launcher artwork composites the registered tail, body and head layers. The ground shadow is deliberately excluded. Preserve transparent margins, centered scale and safe area for legacy-density and adaptive foreground icons. The Godot project icon and exported Android launcher/adaptive resources must be generated from that same source composition, with a visual check on Android launchers. Do not substitute a text-only Merzkava icon or emoji.

### Audio

Preserve the sound preference and the existing sound roles:
- App entry: soft Japanese-style chime, then the short Merzkava voice line.
- Ordinary tap: warm, quiet mechanical click.
- Pull-cord / dock: golden handle contact, mechanical activation, spring return or toolbar descent, plus restrained ratchet ticks.
- Navigation rotor movement: small clockwork tick.
- Warnings: the existing brief double beep; scrolling/paper motion and material-specific footsteps remain separate effects.

Use Godot AudioStreamPlayer / AudioStreamPlayer2D and preloaded local streams. No network sound fetch, Web Audio, or browser audio runtime in the final APK. When Sound is disabled, all app UI and game effects must respect it. Do not overlap long splash voice clips with the same clip or leave stale playback after skipping the splash.

## 7. Main app shell, theme and navigation

- Preserve both Light and Dark themes and their saved selection. The visual vocabulary is verdigris enamel, aged brass, parchment, muted sage, ink and restrained arcane illumination—not a generic black-and-gold menu.
- Preserve the Cinzel and Cormorant Garamond editorial type roles, bundled local font assets and licenses. Do not require a remote font/CDN.
- Preserve the four primary dock destinations in this order: Home (suitcase), Eternal Path (open book), World Archive (document/record), Profile (cameo). Convo, Inventory, Journal and Settings remain reachable by manual horizontal scrolling. Four destinations remain visible at a time on narrow phones.
- Keep function-specific flat editorial emblems, independent rotary rings, subtle central-emblem tilt, side cable/pulley response, and the manual scroll position across route changes.
- The dock is a retractable Victorian clockwork compartment with a raised crown, curved shoulders, dark verdigris surface, aged brass trim and restrained engraving. It must not move when an individual rotor is dragged.
- Preserve the gravity pull cord as a separate visible rope + handle. Its rope and terminal share one endpoint. Dragging vertically by a short, deliberate amount toggles the dock; horizontal swipes do not. A rejected/short pull returns elastically. Keep the cord within its original safe area and hit target.
- Keep all eight existing app languages, both theme modes, the Sound toggle, wallpaper choices and Android Back behavior.
- Every clickable element must perform its real destination/action. A not-yet-ported destination may clearly report that migration is pending, but must not look like a working button that does nothing.

## 8. Data and state migration requirements

Do not reset or recreate user data to make the Godot shell look complete. Inventory and migrate:
- Player/Developer access markers and explicitly remembered Developer credentials.
- Supabase access/refresh session, keeping the Convo boundary separate.
- World Atlas player identity and account-specific credential records, including the SecureStorage Remember Me behavior and one-time reset-grant usage.
- Local profiles, character stats, inventory, wallet ledger, gameplay logs and gameplay-session snapshots.
- Eternal Path journeys, world time, transcripts, preferences, wallpapers, language, theme and sound.
- World Atlas / World Archive local content and revision/provenance metadata.
- Map editor data, map focal point, HUD layout, movement/collision state and any existing backups.

Implement versioned, explicit import migrations with pre-migration backups, atomic writes, schema validation and rollback on failure. Never silently overwrite a save with an empty profile. Keep Convo sessions, World Archive package metadata, and Eternal Path saves isolated.

## 9. Portrait-only and touch requirements

**Orientation is portrait-only. Landscape is not a supported mode and must never be enabled by auto-rotate, sensor orientation, an alternate export preset or a floating-window path.**

- Use a portrait design viewport (width less than height), locked Android orientation and portrait safe-area calculations.
- Test narrow widths, cutouts, system bars, soft keyboard, safe-area insets and dynamic font scaling.
- Use large, reliable touch targets; keep the 32px nominal side breathing margin of the navigation dock where the screen size permits, without placing essential touch targets inside Android edge-gesture zones.
- Test taps, short pull-cord tugs, rejected horizontal swipes, dock rotation, back gestures, scroll, drag and resize at the actual target phone resolution.
- Do not use a landscape-only layout or rely on rotating content to fit a screen.

## 10. Porting status and acceptance matrix

All rows below are **reference audited / Godot port pending** unless explicitly marked otherwise. The current Godot splash/test screen is not implementation evidence.

| Area | Legacy source reviewed | Godot acceptance |
|---|---|---|
| First-screen Floating Control + overlaid Player/Developer gate | main.ts, developer-access-panel.ts, floating-control.ts | First launch follows the same control-first order; gate blocks unauthenticated app routes |
| Player role | main.ts, canon-loader.ts | Exact verified players.md identity; online fail-closed verification; no password field |
| Developer role | developer-access.ts | Offline PBKDF2 verifier; SecureStorage markers; Remember Me and Lock parity |
| Supabase | supabase-auth.ts | Separate Convo cloud session; secure token storage/refresh; no local-game dependency |
| World Atlas | world-atlas-account.ts, world-atlas-login.ts | Separate local player password, verified source gate, reset grant and internal route bypass |
| Access buffer | world-atlas-login-motion.ts | Contextual, cancellable, real-task-coupled sequence; never fake 100% success |
| Floating Control | floating-control.ts, FloatingWindowPlugin.java | Exact permission order, readiness, actions, error states and lifecycle |
| Kitty cross-app bubble | FloatingKeepAliveService.java | Draggable OS overlay, tap restore, four mascot layers, gold/red rotating ring |
| Splash and launcher | splash-animation.ts, icon generator, Kitty PNG layers | Layer alignment, idle motion, entry skip, voice/chime and Kitty-derived adaptive icon |
| Clockwork navigation | gravity-pull-cord.ts, app-shell-motion.ts, app CSS | Four-primary + four-secondary destinations, independent rotary rings, pull-cord and sounds |
| Theme, fonts, language | app source, styles, bundled font assets | Light/Dark, local fonts, all eight languages and preserved preferences |
| Local data | database.ts and local stores | Explicit versioned migration, backups, atomic save/reload and no data loss |
| Android Back / exit | app access/navigation doc and native bridge | Modal-first Back, screen stack, Home confirmation and affirmative-only exit |

## 11. Required test sequence before calling the port complete

1. Fresh install: portrait stays locked with system auto-rotate enabled; first visible screen is Floating Control with the role gate above it.
2. Developer path: sign in while offline; reject wrong credentials; Remember Me; Lock; restore remembered form values; sign in again.
3. Player path: disconnected and stale-registry cases fail closed; exact name succeeds only against the current verified snapshot; Developer permissions never leak into Player.
4. Supabase: missing configuration / offline states do not block the app; session restore/refresh affects only Convo.
5. World Atlas: no network, mismatched source SHA, wrong password, first-password signup, Remember Me, reset grant, cancel/back and internal Atlas route all preserve their separate rules.
6. Access buffer: every stage runs with the actual operation; progress stalls near completion; failure/cancel never reaches 100%; opening a screen alone shows no diagnostic overlay.
7. Floating Control: each permission can be requested and re-read; incomplete setup disables Start Bubble; service state is accurate; Stop cleans up; window restore/back and app lifecycle work.
8. Bubble: Kitty layers align; drag does not accidentally open; tap opens; gold/red connection state follows validated connectivity; ring rotation and flash remain smooth without keeping the full game active.
9. Menu: all eight destinations open or show an honest unavailable state; four primary destinations are visible; secondary destinations scroll; pull down toggles; short/side swipe does not; each rotor only turns itself.
10. Splash/audio: body, head, tail, wordmark and light ray animations remain aligned; tap-skip cancels sound; Sound Off silences all UI; no startup hangs on audio.
11. Data migration: backup old data, import, compare counts and keys, save/restart/reload, rollback if validation fails.
12. Physical TECNO Spark Go 1 KL4: portrait layout, touch targets, memory, frame pacing, service overlay, sound, battery and repeated route changes. CI success alone is not physical-device verification.

**Current audit conclusion:** the legacy behavior is now recorded as the migration contract. The Godot branch has only a small placeholder screen and has not yet implemented these parity requirements. Do not mark G1, login, Floating Control, Kitty, navigation, account migration or portrait device QA complete until each acceptance test is passed.
