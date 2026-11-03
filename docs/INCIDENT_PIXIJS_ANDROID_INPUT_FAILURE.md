# Incident Record — PixiJS and Android Touch/Input Failure

**Status:** Resolved according to the user's immediate on-device confirmation after the PixiJS removal and Anime.js restoration.  
**Severity:** Critical — app controls could appear clickable but fail to perform their actions.  
**Affected project:** Merzkava APK  
**Device context:** Android phone; the reported target device is Tecno Spark Go 1 KL4 (Android 14).  
**Resolution commit:** `ec3ce875a2af126066ee811a6d1a0d12b645b077`  
**Repair branch:** `repair/restore-touch-clicks-2026-11-03`

## 1. What happened

The app displayed a misleading interaction failure:

- Main-menu/header controls could play their click sound, but the requested action or screen navigation did not happen.
- The Kitty bubble control and the pull-cord interaction were reported as still responding in the affected build, while Settings and other controls did not behave correctly.
- The failure was not simply a missing click sound or a visually disabled button. The visible feedback could happen without the intended action completing.
- The user later confirmed that after PixiJS was removed and Anime.js was restored, the app immediately worked fully again.

A click sound is not proof that the control's action handler completed. Future checks must verify the actual result of each interaction.

## 2. Confirmed cause

**PixiJS was the cause of this incident.** This attribution is based on the before/after result reported by the user: the interaction failure occurred with the PixiJS-based implementation, and the app returned to full operation immediately after PixiJS was removed and the previous Anime.js-based approach was restored.

The likely technical failure class was interference between PixiJS's pointer/touch event handling and the app's ordinary DOM button interaction flow on Android. PixiJS has its own event system and canvas/input handling. If that event layer captures, redirects, or otherwise interferes with pointer/touch sequencing, a DOM control can receive incomplete or unexpected input behavior. That fits the observed symptom: feedback such as a click sound may occur while navigation or the intended action does not.

**Important precision:** The before/after test confirms PixiJS as the responsible component in this app incident. It does not identify one exact PixiJS internal function, event listener, or line of code as the sole low-level trigger. Do not invent a more specific mechanism without a reproducer or trace.

## 3. What was used before and after

### Before — problematic implementation

- **PixiJS** was used for the Eternal Path weather/particle rendering path.
- A PixiJS renderer/canvas and its event/render lifecycle were introduced into an app whose controls otherwise use normal HTML/DOM buttons.
- PixiJS-specific performance/scene-rendering settings were also exposed in Settings.

### After — restored implementation

- **Anime.js** is used for animation.
- Weather effects are rendered as ordinary DOM `<span>` particles and animated with Anime.js.
- The PixiJS canvas, renderer, sprite/ticker lifecycle, and PixiJS dependency were removed from the repaired implementation.
- PixiJS-specific Performance / Scene Resolution settings and their stored state/handlers were removed.
- Existing non-PixiJS animations remain on Anime.js.

Anime.js is used here as an animation engine, not as a replacement input/event system. The app's controls continue to use native DOM button and click behavior.

## 4. Repair scope

The repair commit changed these files:

- `src/offline-game/expedition-animations.ts` — replaced PixiJS weather rendering with DOM particles animated by Anime.js.
- `src/app/screens.ts` — removed the PixiJS-specific performance/scene-rendering settings panel.
- `src/main.ts` — removed the related performance preference state, storage, handlers, and Settings subtitle reference.
- `src/style.css` — removed PixiJS canvas and performance-setting styles.
- `package.json` — removed the `pixi.js` dependency.
- `tests/offline-game/expedition-animations.test.ts` — added coverage for Anime.js DOM weather-particle creation, animation, and cleanup.

## 5. User-visible confirmation and verification boundary

The user reported that the app **immediately worked fully** after the PixiJS removal / Anime.js restoration. This is the decisive device-use confirmation for resolving this incident.

The code-level repair also removed PixiJS from the files listed above and added a test for the replacement particle lifecycle. A successful web build alone is not a substitute for Android interaction testing.

Do not claim that every future build is guaranteed to be 100% bug-free. The incident's resolution means the reported touch/click failure was resolved by removing PixiJS and returning to Anime.js.

## 6. Regression checklist

For every future Android build that changes animation, canvas, overlays, or input handling, verify actual action results (not merely click sounds):

1. Open Settings from the header and confirm the Settings screen appears.
2. Test every header navigation/control and confirm its expected action.
3. Open and close Noticeboard; confirm its panel and outside-tap behavior remain intact.
4. Test the Kitty bubble and pull cord.
5. Test Floating Control and its menu actions.
6. Open Eternal Path and confirm weather particles animate and clean up correctly.
7. Confirm dragging/scrolling inside a panel does not accidentally move the page or trigger unrelated controls.

## 7. Permanent engineering rule

- Do not reintroduce PixiJS into this app's UI/input path.
- Keep animation on Anime.js and ordinary DOM elements unless a future change has a demonstrated need, a reproducible Android test, and explicit approval.
- Do not add a second pointer/touch event system over the app's DOM controls casually.
- Never modify Noticeboard, Floating Control, pull-cord behavior, or unrelated interaction flows as a side effect of an animation repair.
- If a similar symptom returns, first compare the exact build and dependency changes against the resolved commit. Do not assume that a click sound means the action succeeded.
