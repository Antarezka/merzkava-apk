# Floating Mode and Ledger UI

## Android Floating Mode

Floating Mode uses the existing Capacitor WebView inside an Android TYPE_APPLICATION_OVERLAY window. It does not create a second gameplay WebView, so the active in-memory screen and chat remain the same while the window is floating.

### User flow

1. The app opens on **Floating Control**, before the game splash screen.
2. Complete the readiness steps in order: **Display over other apps**, **Notifications**, then **Background activity / battery**.
3. The **Google Play return link** is a separate manual integration step and must not be marked ready until the Play Console signing certificate and redirect URI are configured.
4. Choose **Start bubble mode** to start the foreground service and show the Kitty bubble, **Open game / continue playing** for the normal app, or **Open floating mini window** for the resizable gameplay window.
5. **Stop service and close window** removes the overlay and stops the foreground service.
4. Drag the title area in the native header to move the window.
5. Drag the bottom-right grip to resize it. Width and height are bounded so the window remains usable.
6. Use the header controls:
   - **—** collapses to Minimize Strip.
   - **Kitty** collapses to the draggable Kitty-head bubble.
   - **□** restores the full application.
7. Tap the strip or Kitty bubble to reopen the mini window.

The native foreground service displays an ongoing Android notification while Floating Mode is active. The overlay permission and foreground service do not make the process impossible to stop: Android, battery-management software, force-stop, or memory pressure can still terminate it. The app's saved chat and world-time records remain in device storage, but an interrupted in-flight request cannot be guaranteed to finish.

The generated Android project is patched by scripts/patch-android.mjs after cap sync android. Keep that step in the Android build workflow; the generated android/ project is not committed.

## Ledger notifications

src/ui/ledger-log.ts provides:
- per-character chronological local ledger history (up to 500 entries);
- a separate short-lived floating notification for each recorded change;
- positive, negative, and neutral transaction tones;
- tap-to-dismiss only, with no navigation action;
- optional canon-colored category labels.

Call recordLedgerChange(...) only after an authoritative game-state transaction has been validated and committed. A GM narration or a list of proposed changes is not proof that HP, Wallet, Inventory, Satiety, or body condition changed. Until the deterministic state transaction layer emits these events, the notification surface and history screen remain empty rather than displaying invented changes.

## Canon label colors

src/ui/canon-labels.ts is the shared palette for Spirit Realm, Arcanist Grade/Focus, economic quality, artifact condition, Martial Soul rarity, Spirit Beast category/traits/age grade, Spirit Ring colors, and Spirit Realm traditions. Unknown or unverified labels use neutral gray. Positive/negative transaction colors remain independent of canon label colors.

The current app has only a small number of populated character fields; Inventory and Equipment data are not yet connected to authoritative state. Apply canonLabelMarkup(...) to those labels when the corresponding records are implemented so the same label keeps the same color on every screen.
