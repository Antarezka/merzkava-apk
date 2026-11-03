# Known Issues and Baseline Warnings

- **Permanent technology restrictions:** Follow [Forbidden Technologies & Regression Safeguards](docs/FORBIDDEN_TECHNOLOGIES.md) before proposing or adding rendering, animation, or input dependencies.

## Android touch/click failure — resolved by removing PixiJS

- **Incident record:** [docs/INCIDENT_PIXIJS_ANDROID_INPUT_FAILURE.md](docs/INCIDENT_PIXIJS_ANDROID_INPUT_FAILURE.md).
- **Observed failure:** Main-menu/header controls could play click sounds without completing their actions or navigation. Kitty bubble and pull-cord interactions were reported to remain responsive while Settings and other controls failed.
- **Confirmed app-level cause:** PixiJS. The user confirmed that the app immediately worked fully after PixiJS was removed and the Anime.js-based animation path was restored.
- **Resolution commit:** `ec3ce875a2af126066ee811a6d1a0d12b645b077` removes PixiJS and its settings/dependency, and restores DOM weather particles animated by Anime.js.
- **Technical explanation:** The evidence points to interference from PixiJS's pointer/touch event handling with the app's native DOM button interactions on Android. The exact internal listener or function responsible was not isolated; do not claim a more specific mechanism without a reproducer or trace.
- **Regression rule:** Do not reintroduce PixiJS into the UI/input path. Verify that controls perform their actions, not merely that they play click sounds. Keep Noticeboard, Floating Control, Kitty bubble, and pull-cord behavior protected from unrelated changes.

## Historical bad snapshots

- **Known-bad snapshots:** `63ae8a3165a1306cb5d230f08ba4d810f823ea23` and the immediately preceding repair snapshot `24d5d1b510b8cf91ed07b033415ecc0ef2057c11`.
- Do not use these snapshots as working baselines for restoring Main Menu interaction behavior.
- **Historical safe code reference:** `f98d19ff03a3f613386743d7c38eb8045d81a4a0` was previously used as a `src/main.ts` restoration reference. It does not override the later PixiJS incident finding or the resolved implementation.

Update this note only when a new device-tested baseline or a new confirmed incident is available.
