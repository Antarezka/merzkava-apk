#!/usr/bin/env bash
set -euo pipefail
APK="android/app/build/outputs/apk/debug/app-debug.apk"
DIAG_DIR="emulator-diagnostics"
mkdir -p "$DIAG_DIR"
collect_diagnostics() {
  adb devices -l > "$DIAG_DIR/adb-devices.txt" 2>&1 || true
  adb shell getprop > "$DIAG_DIR/getprop.txt" 2>&1 || true
  adb shell pm list packages > "$DIAG_DIR/package-list.txt" 2>&1 || true
  adb shell dumpsys package com.antarezka.merzkava > "$DIAG_DIR/package-manager.txt" 2>&1 || true
  adb shell df -h > "$DIAG_DIR/storage.txt" 2>&1 || true
  adb logcat -b all -d -t 10000 > "$DIAG_DIR/logcat.txt" 2>&1 || true
  adb logcat -d -t 10000 -s chromium WebViewFactory ActivityManager AndroidRuntime Capacitor Console > "$DIAG_DIR/app-webview-logcat.txt" 2>&1 || true
  adb shell dumpsys activity activities > "$DIAG_DIR/activities.txt" 2>&1 || true
  adb shell dumpsys window windows > "$DIAG_DIR/windows.txt" 2>&1 || true
  adb exec-out screencap -p > "$DIAG_DIR/failure-screen.png" 2>/dev/null || true
}
echo "Waiting for Android device..."
adb wait-for-device || { collect_diagnostics; exit 1; }
test -s "$APK" || { echo "APK missing: $APK"; collect_diagnostics; exit 1; }
echo "Waiting for Package Manager..."
PM_READY=0
for attempt in $(seq 1 36); do
  BOOT="$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)"
  if [[ "$BOOT" == "1" ]] && adb shell pm list packages >/dev/null 2>&1; then PM_READY=1; echo "Package Manager ready (attempt $attempt)."; break; fi
  sleep 5
done
if [[ "$PM_READY" -ne 1 ]]; then echo "Package Manager did not become responsive."; collect_diagnostics; exit 1; fi
echo "Installing Merzkava APK..."
INSTALLED=0
for attempt in 1 2 3; do
  if adb install -r "$APK" > "$DIAG_DIR/install-attempt-$attempt.txt" 2>&1; then cat "$DIAG_DIR/install-attempt-$attempt.txt"; INSTALLED=1; break; fi
  cat "$DIAG_DIR/install-attempt-$attempt.txt"
  adb shell pm list packages >/dev/null 2>&1 || true
  adb reconnect device >/dev/null 2>&1 || true
  sleep 8
done
if [[ "$INSTALLED" -ne 1 ]]; then
  echo "Trying non-streaming install..."
  if adb install --no-streaming -r "$APK" > "$DIAG_DIR/install-non-streaming.txt" 2>&1; then cat "$DIAG_DIR/install-non-streaming.txt"; INSTALLED=1; else cat "$DIAG_DIR/install-non-streaming.txt"; fi
fi
if [[ "$INSTALLED" -ne 1 ]]; then echo "APK installation failed."; collect_diagnostics; exit 1; fi
echo "Verifying installed package..."
adb shell pm path com.antarezka.merzkava | tee "$DIAG_DIR/installed-package-path.txt"
adb shell dumpsys package com.antarezka.merzkava | grep -E "versionName|versionCode|primaryCpuAbi|secondaryCpuAbi" > "$DIAG_DIR/installed-package-info.txt"
echo "Resolving launcher activity..."
adb shell cmd package resolve-activity --brief -a android.intent.action.MAIN -c android.intent.category.LAUNCHER com.antarezka.merzkava > "$DIAG_DIR/launcher-activity.txt" 2>&1 || true
cat "$DIAG_DIR/launcher-activity.txt"
LAUNCHER_COMPONENT="$(grep -E '^[[:alnum:]_.]+/[[:alnum:]_.$]+' "$DIAG_DIR/launcher-activity.txt" | tail -n 1 | tr -d '\r')"
if [[ -z "$LAUNCHER_COMPONENT" ]]; then echo "No launcher component resolved."; collect_diagnostics; exit 1; fi
echo "Launching $LAUNCHER_COMPONENT..."
adb logcat -c || true
echo "Launching $LAUNCHER_COMPONENT (slow emulator launches are allowed to continue)..."
START_EXIT=0
timeout 60s adb shell am start -W -n "$LAUNCHER_COMPONENT" > "$DIAG_DIR/launch.txt" 2>&1 || START_EXIT=$?
cat "$DIAG_DIR/launch.txt"
if grep -qE '^Status: *ok$' "$DIAG_DIR/launch.txt"; then
  echo "ActivityManager confirmed launch."
elif grep -qE '^Status: *timeout$' "$DIAG_DIR/launch.txt" || [[ "$START_EXIT" -ne 0 ]]; then
  echo "ActivityManager launch wait timed out (exit $START_EXIT); checking actual Activity and first-draw state instead of failing early."
else
  echo "ActivityManager did not confirm launch; checking whether the app nevertheless started."
fi
echo "Waiting up to 240 seconds for the real app window to draw..."
ACTIVITY_READY=0
for attempt in $(seq 1 48); do
  ACTIVITY_STATE="$(timeout 8s adb shell dumpsys activity activities 2>/dev/null || true)"
  WINDOW_STATE="$(timeout 8s adb shell dumpsys window windows 2>/dev/null || true)"
  APP_RESUMED=0
  FIRST_DRAW=0
  printf '%s' "$ACTIVITY_STATE" | grep -q 'ResumedActivity:.*com.antarezka.merzkava/.MainActivity' && APP_RESUMED=1 || true
  if printf '%s' "$ACTIVITY_STATE" | grep -A 45 'ActivityRecord.*com.antarezka.merzkava/.MainActivity' | grep -qE 'reportedDrawn=true|firstWindowDrawn=true'; then FIRST_DRAW=1; fi
  if [[ "$APP_RESUMED" -eq 1 && "$FIRST_DRAW" -eq 1 ]] && ! printf '%s' "$WINDOW_STATE" | grep -q 'Splash Screen com.antarezka.merzkava'; then
    ACTIVITY_READY=1
    echo "Merzkava MainActivity has drawn its real app window (attempt $attempt)."
    break
  fi
  if (( attempt % 6 == 0 )); then echo "Still waiting for first app draw ($((attempt * 5)) seconds elapsed; resumed=$APP_RESUMED drawn=$FIRST_DRAW)."; fi
  sleep 5
done
if [[ "$ACTIVITY_READY" -ne 1 ]]; then
  echo "Merzkava did not draw its real app window within 240 seconds."
  collect_diagnostics
  exit 1
fi
echo "Capturing Kitty splash frames immediately after first app draw..."
FOCUSED_WINDOW="$(timeout 8s adb shell dumpsys window windows 2>/dev/null | grep -E 'mCurrentFocus|mFocusedApp' | head -n 2 || true)"
if ! grep -q 'com.antarezka.merzkava' <<< "$FOCUSED_WINDOW"; then
  echo "Merzkava is not the foreground window; refusing to label a system dialog as a splash screenshot."
  echo "$FOCUSED_WINDOW"
  collect_diagnostics
  exit 1
fi
adb exec-out screencap -p > "$DIAG_DIR/kitty-splash-early.png"
sleep 0.45
FOCUSED_WINDOW="$(timeout 8s adb shell dumpsys window windows 2>/dev/null | grep -E 'mCurrentFocus|mFocusedApp' | head -n 2 || true)"
if ! grep -q 'com.antarezka.merzkava' <<< "$FOCUSED_WINDOW"; then
  echo "Merzkava lost foreground focus during splash capture."
  echo "$FOCUSED_WINDOW"
  collect_diagnostics
  exit 1
fi
adb exec-out screencap -p > "$DIAG_DIR/kitty-splash-mid.png"
test -s "$DIAG_DIR/kitty-splash-early.png"
test -s "$DIAG_DIR/kitty-splash-mid.png"
file "$DIAG_DIR/kitty-splash-early.png" "$DIAG_DIR/kitty-splash-mid.png"
echo "Waiting for app process..."
APP_PID=""
for attempt in $(seq 1 12); do
  APP_PID="$(timeout 10s adb shell pidof com.antarezka.merzkava 2>/dev/null | tr -d '\r' || true)"
  if [[ -n "$APP_PID" ]]; then echo "Merzkava process PID: $APP_PID"; break; fi
  sleep 5
done
if [[ -z "$APP_PID" ]]; then echo "Merzkava process did not appear."; collect_diagnostics; exit 1; fi
adb logcat -d -t 6000 > "$DIAG_DIR/launch-logcat.txt" 2>&1 || true
if grep -E -A 8 "FATAL EXCEPTION|Fatal signal" "$DIAG_DIR/launch-logcat.txt" | grep -q "com.antarezka.merzkava"; then echo "Merzkava-specific fatal crash detected."; collect_diagnostics; exit 1; fi
adb shell dumpsys activity activities > "$DIAG_DIR/activities.txt" 2>&1 || true
adb shell dumpsys window windows > "$DIAG_DIR/windows.txt" 2>&1 || true
echo "Emulator install-and-launch smoke test passed."
