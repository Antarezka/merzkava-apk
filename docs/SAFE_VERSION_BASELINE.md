# Merzkava APK — Safe Version Baseline

## Reference checkpoint

- Safe branch: `safe/cord-clasp-2026-11-02`
- Source commit: `90f7bb13ad594b76b073b78e5517610f6861c902`
- Date recorded: 2026-11-02
- User-confirmed device version: accepted as the working baseline.
- CI note: the Android debug APK build, package/version/alignment/signature checks, and artifact upload completed. The Android 14 emulator installation step failed in CI; this is recorded separately and does not overwrite the user's successful device confirmation.

This document describes the feature set and visual/interaction behavior that must be preserved when later work is based on this checkpoint. New work belongs on the development branch; do not modify the safe branch.

## Application shell and launch

- Kitty mascot opening splash assembled from layered shadow, tail, body, and head assets, with an animated opening/closing sequence and opening audio.
- Main application header with Merzkava branding, current-screen context, Kitty floating-mode shortcut, and Settings shortcut.
- Main navigation dock with eight destinations: Home, Eternal Path, Archive, Profile, Convo, Inventory, Journal, and Settings.
- Collapsible navigation dock controlled by the hanging pull-cord; dock movement keeps its center alignment and uses a small inner-track mechanical rattle.
- Theme, language, and sound preferences persist locally.
- English/Indonesian language support and rendered-label translation.

## Floating Control and overlay

- Floating Control is a separate first-run permission/setup screen; it does not show the main bottom navigation dock.
- Ordered setup checks for display-over-other-apps, notifications, and battery/background exemption.
- Foreground floating service status and quick actions to start bubble mode or return to the game.
- Native Android floating-window integration and readiness refresh when the app regains focus.

## Pull-cord and ornament — visual safe reference

- App-wide hanging cord appears on normal app screens, not on Floating Control.
- Original maroon cord body with red-to-copper gradient and short dotted copper highlight; both visible strokes follow one shared Bézier curve.
- Cord endpoint attaches to the upper clasp/head of the latest ornament, not the center of the jewel.
- Latest antique-gold ornamental medallion with dark-red central stone and decorative frame remains unchanged.
- Horizontal and vertical pointer movement bends the cord and moves the ornament together; release returns with elastic motion.
- Only a downward-dominant pull triggers the toolbar; sideways/upward movement does not.
- Idle sway, pull/grab glow, mechanical activation, golden-handle, spring-return, and toolbar-drop sound effects are retained.

## World and character features

- Home screen and daily noticeboard reading the latest update entries from the Merzkava Universe README.
- Character creation with validation and local character storage.
- Official player registry refresh and registered character profile display.
- Full character profile grouped into identity, inventory/finance, and techniques/goals, including the 18-field registry profile view.
- Conversation/gameplay screen with character selection, new/continued sessions, player action input, GM response, save checkpoints, and transcript restoration.
- Canon source refresh, status display, module loading, activity-to-module routing, and context assembly.
- GM response validation, structured proposal/state reconciliation, and explicit distinction between proposed and applied changes.
- Secure authentication/session restoration and configurable GM gateway integration.

## Screens and game systems

- Eternal Path offline expedition/game mode with choice-driven situations, saved games, import/export, reset/rename/delete, and scene animations.
- World Archive / lore library with category/search results and lore source/entry viewing.
- Inventory and finance view with inventory, building assets, wallet, and ledger history.
- Journal and Settings screens.
- Offline mechanics modules for time, HP, injury, satiety, combat, arcanistry, disposition, Martial Soul awakening, Spirit Ring compatibility/progression, and economy pricing/wallet.
- Character/gameplay records stored locally through the database layer; local preferences and chat continuity are also persisted.

## Visual assets and audio

- Layered Kitty mascot assets for splash and floating-mode header shortcut.
- Regional game scenery for Golden Dragon Empire, Tianhai Yunzhou, Beiming Gu, Lawless Territories, and special locations.
- Shared environmental effects include cloud, fog, sun/moon glow, volumetric light, rain, snow/window frost, petals, autumn leaves, and three lightning variations.
- Existing sound assets and mechanical UI sound effects remain part of the baseline.

## Change-control rules

1. Treat the safe branch and source commit above as the rollback reference.
2. Preserve existing features and interactions unless the user explicitly approves a change.
3. Build and verify a new APK after changes; do not infer phone behavior from a web build alone.
4. Do not replace or move the safe checkpoint when creating later Nightly/development work.
5. Any later Stable release requires its own explicit user confirmation and a verified release artifact.
