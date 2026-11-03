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
- [ ] Verify clockwise/counter-clockwise movement and angle wraparound.
- [x] Calculate alignment against the fixed activation mark using the selected aperture's resulting angle.
- [ ] Reaching the threshold alone does not activate, lock, load, or change location.
- [x] Release-commit logic now requires an actual non-cancelled release, threshold alignment, and a supported destination.
- [x] Include pointerup coordinates in the final threshold decision, even if the final pointermove was not delivered.
- [ ] Keep unsupported destinations from travelling even when aligned.
- [x] Add unit tests for grab-offset independence, drag geometry, exact threshold boundary, just-outside boundary, and release semantics.
- [ ] Run targeted tests, full tests, typecheck, and production build.
- [ ] Review the diff to ensure only Stage 2 input/threshold scope changed.
- [ ] Stage 2 formally accepted before Stage 3.

**Stage 2 verification record**

| Check | Result |
|---|---|
| Targeted rotary tests | Pending CI execution |
| Full test suite | Pending |
| Typecheck | Pending |
| Production build | Pending |
| Android touch QA | Pending; required before release, not replaced by web tests |
| Commit | `ee415dba38380be40355d6d7d7d0a41aef93c5ff` (latest runtime change; verification pending) |

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
