# Forbidden Technologies & Regression Safeguards

> **Status: ACTIVE — mandatory project restriction**
>
> This document is the canonical register of technologies and implementation patterns that must not be reintroduced into Merzkava APK unless the owner explicitly approves a change after finding and verifying a workable solution.

## 1. PixiJS — FORBIDDEN

**Do not reintroduce PixiJS in any part of this application.** The restriction applies to the complete PixiJS implementation, not only the npm package name.

Prohibited components and remnants include:

- The `pixi.js` npm dependency, any PixiJS version, and PixiJS imports or wrappers.
- PixiJS Application, Renderer, Canvas, WebGL/WebGPU rendering path, and renderer initialization or teardown.
- PixiJS Containers, Sprites, Textures, Assets, Graphics, ticker, particle containers, and related scene/render lifecycle.
- PixiJS pointer, mouse, touch, federated-event, or hit-testing systems layered over the app's normal DOM controls.
- PixiJS-specific performance tiers, resolution multipliers, particle budgets, FPS caps, Settings controls, preference state, storage keys, or handlers.
- PixiJS-only canvas CSS, overlay styles, fallback branches, compatibility shims, and dead code left behind after removal.
- Reintroducing PixiJS indirectly through a helper package or a second renderer wrapper.

Do not treat a package rename, dynamic import, optional dependency, disabled-by-default setting, or fallback mode as an exception. It is still prohibited if it restores PixiJS functionality or its input/rendering path.

## 2. Why this restriction exists

The project recorded a critical Android interaction incident in [Incident Record — PixiJS and Android Touch/Input Failure](./INCIDENT_PIXIJS_ANDROID_INPUT_FAILURE.md).

The observed failure was that controls could play their click sound while their actual action or navigation did not complete. The owner then confirmed that the application immediately worked fully after PixiJS was removed and the previous Anime.js-based implementation was restored.

The incident record attributes the app-level failure to PixiJS based on that before/after device result. The exact internal PixiJS listener or low-level mechanism was not isolated; do not invent a more specific technical cause.

**The owner's direct device confirmation is the reason for this restriction.** Do not override it with assumptions that a newer version, different configuration, or theoretical compatibility will be safe.

## 3. Approved animation approach

For Eternal Path presentation and scene effects, retain the existing approach:

- **Anime.js** for animation and motion timelines.
- Ordinary **DOM elements** for weather, seasonal, and other visual particles.
- **CSS** for compositing, masks, gradients, static fallbacks, and visual layering.
- Scoped animation lifecycle rooted in the mounted Eternal Path page; revert/clean up when that screen is replaced or closed.
- Native DOM button/click behavior for application controls. Animation code must not become a second input/event system.

Do not replace this approved approach with another rendering or input framework without the owner's explicit approval. This is a safeguard against repeating the same class of regression, not a blanket ban on ordinary CSS or DOM presentation.

## 4. Protected interactions

Changes to animation, overlays, scene windows, or rendering must not damage unrelated controls. Preserve and verify:

1. Header and main-menu navigation — confirm the destination/action, not just the click sound.
2. Noticeboard — open, close, outside-tap dismissal, and internal scrolling.
3. Floating Control — visibility, drag behavior, and menu actions.
4. Kitty bubble interaction.
5. Pull-cord interaction.
6. Eternal Path scene effects — mount, animate, and clean up without blocking input.
7. Panel scrolling and touch gestures — movement inside a panel must not unexpectedly scroll the app shell or activate another control.

Never modify these features as an incidental side effect of an animation repair.

## 5. Mandatory change procedure

Before adding or changing a dependency, renderer, animation engine, canvas, overlay, or pointer/touch handler:

1. Read this register and the linked incident record.
2. Inspect the current branch, dependency manifest, source, and existing implementation before editing.
3. Prefer the approved Anime.js + DOM/CSS approach for Eternal Path presentation.
4. Keep changes narrow; do not refactor navigation, Noticeboard, Floating Control, Kitty bubble, or pull-cord code for an unrelated visual effect.
5. Add or update automated tests for animation mounting, animation cleanup, reduced-motion behavior, and any affected interaction contract.
6. Run the available typecheck, tests, and build. Report exactly which checks passed or failed.
7. For Android-sensitive changes, verify actual control actions on the target Android device. A sound, animation, passing unit test, or web build alone is not proof that touch interaction works.
8. Record the tested commit/build and the observed result. Never claim device verification that was not performed.

## 6. Reconsideration rule

PixiJS remains forbidden until **the owner personally finds a workable solution and explicitly approves reconsideration**.

Only then may a separate, isolated evaluation be proposed. It must include a reproducible Android test case, a clear input-isolation strategy, a rollback path, and successful tests of all protected interactions. Approval to investigate is not approval to merge or ship.

Until those conditions are met, do not install, import, prototype, or reintroduce PixiJS.

## 7. Enforcement and maintenance

- This file is the canonical technology-restriction register.
- `PROJECT_DIRECTIVES.md` requires developers to read it before dependency, renderer, animation, or input-layer changes.
- `docs/offline-game/ANIMATION_SYSTEM.md` must describe only the approved Anime.js + DOM/CSS implementation and must not contain an active PixiJS proposal.
- `KNOWN_ISSUES.md` and the incident record provide the historical context and regression warning.
- Any future change to this restriction must be explicitly approved by the owner and documented here with the date, evidence, and replacement decision.
