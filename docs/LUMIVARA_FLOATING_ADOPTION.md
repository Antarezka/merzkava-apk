# Lumivara Floating System — Merzkava Adaptation

## Source inspection

The uploaded Lumivara Online 1.9 APK was decoded with APKTool in GitHub Actions. Its Android manifest declares:
- `SYSTEM_ALERT_WINDOW` for overlays;
- `FOREGROUND_SERVICE` and `FOREGROUND_SERVICE_SPECIAL_USE`;
- a non-exported, persistent `FloatingGameService`;
- a dedicated `GameFullscreenActivity`.

The decompiled `FloatingGameService` creates a separate WebView using `MutableContextWrapper`. It moves that WebView between its overlay container and `GameFullscreenActivity`; `MiniGameLayout` manages the miniature viewport. The bubble and mini-window are both presentations managed by the same foreground service.

## Why Merzkava cannot copy that WebView arrangement verbatim

Merzkava is a Capacitor application. Its active WebView owns the Capacitor Bridge and native plugins, including local SQLite. A second ordinary Android WebView loaded with the same HTML would not automatically have that Bridge or the native plugin registrations. Replacing the live game surface with an unbridged WebView could break SQLite, secure storage, and other native calls.

Therefore this adaptation deliberately preserves Merzkava's existing Bridge WebView and adopts the lifecycle safeguards that fit its architecture. It does not copy Lumivara's proprietary application code or replace Merzkava's game UI.

## Changes in this branch

- The floating state is explicitly represented as FULL_SCREEN, MINI_WINDOW, STRIP, or BUBBLE.
- Overlay WindowManager is obtained from the application context rather than retaining an Activity-scoped manager.
- Opening the mini-window from Kitty refreshes the WebView reference from the currently resumed Capacitor BridgeActivity. This avoids relying only on a stale static Activity/WebView reference after Android recreates the host.
- Mini-window attachment is idempotent and guarded against overlapping transition callbacks.
- The app is sent to the background only after the mini-window is confirmed attached to WindowManager. If attachment fails, the app is restored instead of being backgrounded without a visible window.
- Readiness now requires both a running foreground service record and the service's foreground-active flag; overlay permission alone is not reported as service readiness.
- Existing Kitty actions remain: tap bubble to open mini-window, Kitty control to minimize back to bubble, and square control to restore full screen.

## Validation boundary

GitHub Actions must compile the generated Capacitor Android project and install the APK on the Android 14 emulator before this branch is considered build-verified. Emulator installation does not fully validate OEM-specific overlay behavior on Tecno/HiOS; a device test is still required for bubble persistence, drag, mini-window tap, keyboard, and all three transitions.
