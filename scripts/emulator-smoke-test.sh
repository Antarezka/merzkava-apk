#!/usr/bin/env bash
set -euo pipefail

APK="android/app/build/outputs/apk/debug/app-debug.apk"
DIAG_DIR="emulator-diagnostics"
mkdir -p "$DIAG_DIR"
FAILED=1

collect_diagnostics() {
  echo "Collecting emulator diagnostics..."
  adb devices -l > "$DIAG_DIR/adb-devices.txt" 2>&1 || true
  adb shell getprop > "$DIAG_DIR/getprop.txt" 2>&1 || true
  adb shell pm list packages > "$DIAG_DIR/package-list.txt" 2>&1 || true
  adb shell dumpsys package > "$DIAG_DIR/package-manager.txt" 2>&1 || true
  adb shell df -h > "$DIAG_DIR/storage.txt" 2>&1 || true
  adb logcat -b all -d -t 6000 > "$DIAG_DIR/logcat.txt" 2>&1 || true
  adb shell dumpsys activity activities > "$DIAG_DIR/activities.txt" 2>&1 || true
}

echo "Waiting for Android device..."
adb wait-for-device || { collect_diagnostics; exit 1; }
test -s "$APK" || { echo "APK missing: $APK"; collect_diagnostics; exit 1; }

echo "Waiting for Package Manager to become responsive..."
PM_READY=0
for attempt in $(seq 1 36); do
  BOOT="$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)"
  if [[ "$BOOT" == "1" ]] && adb shell pm list packages >/dev/null 2>&1; then
    PM_READY=1
    echo "Package Manager is responsive (attempt $attempt)."
    break
  fi
  sleep 5
done

if [[ "$PM_READY" -ne 1 ]]; then
  echo "Package Manager did not become responsive."
  collect_diagnostics
  exit 1
fi

for attempt in 1 2 3; do
  echo "APK install attempt $attempt/3..."
  if adb install -r "$APK" > "$DIAG_DIR/install-attempt-$attempt.txt" 2>&1; then
    cat "$DIAG_DIR/install-attempt-$attempt.txt"
    FAILED=0
    break
  fi
  cat "$DIAG_DIR/install-attempt-$attempt.txt"
  echo "Install attempt $attempt failed; checking Package Manager before retry."
  adb shell pm list packages >/dev/null 2>&1 || true
  adb reconnect device >/dev/null 2>&1 || true
  sleep 8
done

if [[ "$FAILED" -ne 0 ]]; then
  echo "Streaming install retries failed; trying non-streaming install once."
  if adb install --no-streaming -r "$APK" > "$DIAG_DIR/install-non-streaming.txt" 2>&1; then
    cat "$DIAG_DIR/install-non-streaming.txt"
    FAILED=0
  else
    cat "$DIAG_DIR/install-non-streaming.txt"
  fi
fi

if [[ "$FAILED" -ne 0 ]]; then
  echo "APK installation failed after retries."
  collect_diagnostics
  exit 1
fi

echo "Verifying installed package..."
adb shell pm path com.antarezka.merzkava | tee "$DIAG_DIR/installed-package-path.txt"
adb shell dumpsys package com.antarezka.merzkava | grep -E "versionName|versionCode|primaryCpuAbi|secondaryCpuAbi" > "$DIAG_DIR/installed-package-info.txt" || true

echo "Resolving Merzkava launcher activity..."
adb shell cmd package resolve-activity --brief \
  -a android.intent.action.MAIN \
  -c android.intent.category.LAUNCHER \
  com.antarezka.merzkava > "$DIAG_DIR/launcher-activity.txt" 2>&1 || true
cat "$DIAG_DIR/launcher-activity.txt"

echo "Clearing old logcat entries and launching Merzkava directly..."
adb logcat -c || true
if ! timeout 30s adb shell am start \
  -a android.intent.action.MAIN \
  -c android.intent.category.LAUNCHER \
  -p com.antarezka.merzkava > "$DIAG_DIR/launch.txt" 2>&1; then
  cat "$DIAG_DIR/launch.txt"
  echo "Android ActivityManager could not launch Merzkava."
  collect_diagnostics
  exit 1
fi
cat "$DIAG_DIR/launch.txt"

echo "Waiting for Merzkava process (up to 60 seconds)..."
APP_PID=""
for attempt in $(seq 1 12); do
  APP_PID="$(timeout 10s adb shell pidof com.antarezka.merzkava 2>/dev/null | tr -d '\r' || true)"
  if [[ -n "$APP_PID" ]]; then
    echo "Merzkava is running with PID $APP_PID (attempt $attempt)."
    break
  fi
  sleep 5
done

adb logcat -d -t 6000 > "$DIAG_DIR/launch-logcat.txt" 2>&1 || true
adb shell dumpsys activity activities > "$DIAG_DIR/activities.txt" 2>&1 || true

if [[ -z "$APP_PID" ]]; then
  echo "Merzkava process did not appear within 60 seconds."
  collect_diagnostics
  exit 1
fi

if grep -E -A 8 "FATAL EXCEPTION|Fatal signal" "$DIAG_DIR/launch-logcat.txt" | grep -q "com.antarezka.merzkava"; then
  echo "Merzkava-specific fatal crash detected in emulator logcat."
  collect_diagnostics
  exit 1
fi

echo "Emulator install-and-launch smoke test passed."
