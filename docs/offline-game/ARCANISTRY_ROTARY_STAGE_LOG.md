# Arcanistry Rotary — Stage Log

This file records explicit stage acceptance and implementation evidence. Work is strictly sequential: a later stage cannot begin until the previous stage's checklist and verification gate are complete.

## Stage 1 — Audit and specification

**Accepted by owner in chat:** 2026-11-03

- [x] Read the forbidden-technology policy and Android PixiJS incident record.
- [x] Read the existing Anime.js animation-system rules.
- [x] Audit rotary markup, CSS, pointer handler, geometry helpers, and tests.
- [x] Record current travel mappings and unsupported preview-only destinations.
- [x] Document success, failure, cancellation, mechanical progress, and loading order.
- [x] User explicitly approved proceeding after reviewing the Stage 1 documentation.
- [x] Stage 1 accepted. Stage 2 may begin.

Evidence: [Stage 1 specification](./ARCANISTRY_ROTARY.md), implementation branch `feature/arcanistry-rotary-stage1-spec-2026-11-03`, commit `c379a39bdaf7ba5c9f404a8acfa9ef9478f377f9`.

## Stage 2 — Input geometry and activation threshold

**Status:** In progress. Input geometry code and unit coverage have been updated; verification is pending. Do not begin Stage 3 until every item below passes.

- [ ] Use the selected aperture's authored `--hole-angle` as its actual starting angle; do not mistake the finger's grab offset for the aperture angle.
- [x] Calculate drag movement from the pointer's angular change around the rotor center.
- [x] Verify clockwise/counter-clockwise movement and angle wraparound.
- [x] Calculate alignment against the fixed activation mark using the selected aperture's resulting angle.
- [x] Reaching the threshold alone does not activate, lock, load, or change location.
- [x] Release-commit logic now requires an actual non-cancelled release, threshold alignment, and a supported destination.
- [x] Include pointerup coordinates in the final threshold decision, even if the final pointermove was not delivered.
- [x] Keep unsupported destinations from travelling even when aligned.
- [x] Add unit tests for grab-offset independence, drag geometry, exact threshold boundary, just-outside boundary, and release semantics.
- [x] Run the full test suite, typecheck, and production build; targeted rotary cases are included in the full Vitest run.
- [x] Review the diff; changes are limited to rotary geometry/input, tests, stage documentation, and the Android test-build trigger.
- [ ] Stage 2 formally accepted before Stage 3.

**Stage 2 verification record**

| Check | Result |
|---|---|
| Targeted rotary tests | Passed as part of full Vitest run — workflow #1440 |
| Full test suite | Passed — workflow #1440 |
| Typecheck | Passed — workflow #1440 |
| Production build | Passed — workflow #1440 |
| Android APK / emulator smoke test | In progress — Build #827, run `41617593668` |
| Runtime change | `ee415dba38380be40355d6d7d7d0a41aef93c5ff` |\n| Current branch HEAD | `497076ad59fba6ad0c7e63a1db39733acdcee34d` |\n| Validation evidence | [Workflow #1440](https://github.com/Antarezka/merzkava-apk/actions/runs/41617593336) — success |

## Stage 3 — Mechanical synchronization

Not started. Requires Stage 2 acceptance.

## Stage 4 — Successful activation sequence

Not started. Requires Stage 3 acceptance.

## Stage 5 — Failure and restoration sequence

Not started. Requires Stage 4 acceptance.

## Stage 6 — Full QA and release

Not started. Requires Stage 5 acceptance.

## Permanent constraints

- Anime.js 4.x is for animation only; native DOM pointer handling remains the sole interaction path.
- PixiJS, canvas renderers, WebGL/WebGPU, and alternate input/event frameworks remain prohibited.
- Gear, thread, shaft, lock, and aperture motion must ultimately derive from the same player-controlled progress value.
- No audio polish or new sound effects until the mechanical interaction and Arcanistry are complete.
- No scene loading before successful release, completed locking, and completed rotary return.
