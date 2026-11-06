# AI Handoff — Build 1348 Isometric Runtime Fix

**Repository:** `Antarezka/merzkava-apk`  
**Stable starting point:** Build `1348-1a1`, commit `1a128afe0c0dee753963144c2f4fc71a54b41805`  
**Working branch:** `fix/1348-token-only-motion-camera-center-subcell`  
**Purpose:** Continue from the owner-selected Build 1348 baseline. Do not restart from the later PixiJS experiments.

> Always fetch the live HEAD of the working branch first. This document records the intended implementation and known verification state; a later documentation-only commit or workflow run may move the branch head.

## 1. Mandatory read order for the next AI

1. `README.md` — product boundaries and system links.
2. `docs/PRODUCT_ROADMAP.md` — single master roadmap, including the 2026-11-06 isometric performance checkpoint.
3. This handoff — current implementation, file ownership, test state and continuation rules.
4. `docs/offline-game/ISOMETRIC_FIELD_SYSTEM.md` — shared isometric editor/runtime contract.
5. `docs/offline-game/ISOMETRIC_MAP_EDITOR.md` — persisted map JSON, eight-sector encoding, editor operations and Academy seed.
6. `docs/offline-game/ANIMATION_SYSTEM.md` — Anime.js ownership for non-movement scene transitions.
7. Read the source and tests listed below before editing them.

The user's active requirement is explicit: **redraw/movement updates may affect actor tokens only. The map image, SVG ground, tiles and foreground canvas must remain static while Player/NPC tokens move.**

## 2. Selected baseline and branch policy

- Build 1348 / `1348-1a1` is the starting baseline: `1a128afe0c0dee753963144c2f4fc71a54b41805`.
- The fix branch was created from that exact commit, not from `dumpster`, PixiJS experiment branches, or a later unstable map renderer.
- Keep the Build 1348 baseline recoverable. Do not delete its backup or rewrite unrelated experiment branches.
- The intended current source is the working branch above. Before a new change, fetch its live HEAD and compare it with the Build 1348 SHA.
- Do not treat the Android Actions run number as the source version. Record the workflow run number, app version label, exact source SHA, branch and artifact together.
- No PixiJS/Phaser/Konva renderer is used for this fix. The current world remains the existing DOM/CSS/SVG + Academy JPG composition.

## 3. What changed from Build 1348

### A. Per-fragment / sub-cell movement

**Player:** Build 1348 already had the eight-sector route graph and exact pointer-to-sub-cell target logic. Preserve that behavior:
- A diamond is represented by eight triangular nodes: `tl-a`, `tl-b`, `tr-a`, `tr-b`, `bl-a`, `bl-b`, `br-a`, `br-b`.
- `resolveIsoSubcellTarget()` resolves the tapped position inside the map cell.
- `isoSubcellPositionAtPoint()` stores the fractional visual position, while `isoQuadrantAtPoint()` selects the matching triangle.
- `findIsoQuadrantPath()` routes through open triangle nodes, including movement between sectors inside the same diamond. It honors walkable whitelist, blocked sectors, paired half-edges, and occupied actor cells.
- Do not round fractional positions to the parent cell center.

**NPC:** The previous wandering code selected only whole cardinal cells. It now checks the same eight-sector graph and selects a valid one-edge route (`path.length === 2`). An NPC can move between adjoining fragments inside its current diamond or cross to an adjoining diamond, while remaining out of occupied cells. It updates `data-x/data-y`, `data-quadrant`, `data-posX/data-posY` and the corresponding token position variables.

### B. Actor-only movement and static map plane

- Generic isometric maps and the render-test board now mount Player/NPC/transition tokens inside `[data-wmh-actor-layer]`. Tianhai Academy already had its own `.wmh-academy-actor-layer`; preserve its artwork-relative sizing and placement.
- `animateGridMove()` updates only the moved token's position and animates that token with the Web Animations API's individual `translate` property. It does not call map redraw, SVG scene refresh, foreground canvas drawing, or a map-sized animation.
- The previous per-step `emitTileTrailWave()` path was removed. Expanding scanner pseudo-element sweeps are disabled in the low-power gameplay CSS because they cover a large area and can force WebView compositing of broad parts of the map. Scanner contact bookkeeping/events remain separate and continue to work.
- `syncIsoDepthAndOcclusion()` updates actor z/opacity/Academy token coordinates and refreshes minimap/status only when actor-cell metadata changes. Static tile depth is synchronized only when invalidated by an editor/map-data change.
- **Never place `redraw()`, `drawIsometricForeground()`, `refreshIsometricSvgScene()`, or a full-board SVG replacement inside the actor movement path.**
- Editor map edits may redraw the editor overlay/foreground as part of saving a real edit. This is a different code path from ordinary Player/NPC movement.

### C. Separate entry camera and editor CENTER MAP focal point

These are two distinct camera behaviors and must never be conflated:

**Area entry camera (Tianhai Academy):**
- On first image-ready initialization after entering Academy, focus the camera on the Player token's current map position. The default spawn is parent cell `(12,31)`; if a Player position is already present, use its current `data-posX/data-posY` visual coordinates, falling back to `data-x/data-y`.
- Convert that token position through `isoCellCenter(visualX, visualY, mapData.grid)`, then apply Academy canvas margins and actual artwork scaling. This entry focus is independent of `cameraCenter` and must not read or overwrite the saved editor focal point.
- The initial Academy image load calls `centerOnPlayer()`. Returning to Academy/newly mounting the area should follow the Player again.

**Editor CENTER MAP:**
- The selected focal point is stored as Map Base pixel coordinates in `cameraCenter`, and exported through the existing AI reference JSON.
- The editor's **CENTER MAP** button, reset/fit action, and `merzkava:center-isometric-map` event use `centerMap()`, which reads the saved `cameraCenter`; automatic midpoint is the fallback when none is saved.
- The old `persist()` method restored the old viewport scroll position on the next animation frame. When confirming a new center, that callback could overwrite the newly requested position.
- `persist(restoreCamera, redrawVisuals)` now supports a center-only save. Confirming a center uses `persist(false, false)`: save data without restoring the prior scroll anchor and without repainting the map/foreground.
- Both camera behaviors use the same viewport geometry, Academy expanded-canvas margins and image scaling, but they have separate focus sources: Player coordinates for entry; `cameraCenter` for editor CENTER MAP.
- Do not replace the camera controller or change map-image geometry to solve a center-selection issue.

## 4. File ownership and exact touch points

| File | Current responsibility |
|---|---|
| `src/offline-game/world-map-hierarchy.ts` | Board markup, actor layer, actor movement, NPC wandering, camera binding, editor persistence and center event |
| `src/offline-game/world-map-hierarchy.css` | Static map/actor layer separation, token positioning, low-power actor/scanner styling |
| `src/offline-game/isometric-interaction.ts` | Eight-sector graph, half-edge connectivity, sub-cell position and route algorithms |
| `src/offline-game/isometric-map-editor.ts` | Grid/map JSON schema, normalization, saved `cameraCenter`, quadrant keys and editor helpers |
| `src/offline-game/isometric-svg-board.ts` | Static SVG ground scene renderer; it is not part of an actor step |
| `src/offline-game/tianhai-academy-map-reference.ts` | Academy's owner-provided one-time map reference |
| `tests/offline-game/isometric-interaction.test.ts` | Eight-sector walkability, edge and route behavior |
| `tests/offline-game/isometric-map-editor.test.ts` | Map JSON, focal-point and editor coordinate behavior |
| `tests/offline-game/isometric-npc-chat.test.ts` | Runtime source contracts for actor-only motion, NPC routes, camera focus and dialogue utterance separation |
| `.github/workflows/validate.yml` | Gameplay tests, TypeScript and Vite production build |
| `.github/workflows/build-android.yml` | APK packaging, verification, artifact upload and Android 14 emulator smoke-test |

## 4A. Player dialogue must be a natural utterance, not an action label

- Each scripted NPC record has three separate parallel arrays: `choices[]` (short button/action labels), `playerLines[]` (the natural sentence the Player actually says after selecting that button), and `replies[]` (the NPC's authored response).
- On button selection, the chat transcript must render `playerLines[index]`, never echo `choices[index]`. Example: the button may say **Ask about training**, but the chat transcript should say **“What kind of footwork are you practicing today?”**
- Phrase the Player as curious, polite and context-aware. Prefer a question or a natural response to what the NPC just said. Avoid imperative/command language, stage directions, and labels such as “Ask about X”, “Tell them Y”, or “End conversation”.
- Keep the reply paired to the same index and preserve all authored NPC knowledge/agenda boundaries. This is still scripted local conversation, not AI-generated free text.
- When adding an NPC or changing its options, keep `choices.length === playerLines.length === replies.length`. Escape both Player and NPC transcript strings before injecting them into chat markup.
- Tests should assert that the chat handler reads `playerLines[index]`, not `choices[index]`, and that every action has a matching Player utterance/reply.

## 5. Runtime invariants — do not regress

1. The Academy JPG `public/maps/academy/full-map/1_academy.jpg` is source artwork. Do not alter it, tint it, rebuild it or rasterize gameplay tokens into it.
2. The ground/image and foreground canvas stay mounted and visually unchanged during normal token movement.
3. Player and NPC are positioned as fractional coordinates inside their sector; do not force one actor to the center of the parent grid cell.
4. Walkability whitelist, `customGridCells`, blocked sectors and paired half-edge semantics remain authoritative. Do not make the whole parent diamond walkable because one of its fragments is open.
5. Occupied cells remain unavailable to other actors. Never allow Player/NPC overlap.
6. Movement animation is owned by the actor token. No PixiJS scene, whole-board transform, full-map filter animation, or per-frame map redraw.
7. Center confirmation persists the chosen point and immediately applies it to the live viewport. It must not restore the old scroll anchor after that action.
8. Preserve the Developer Mode gate, editor pause/minimize/restore behavior, pending Player destination behavior, chat pause behavior, and per-map local editor data.
9. Sensor-overlap events are observations only. They do not trigger chase, battle, HP/Qi loss, injuries, time costs, or quest effects without separately approved rules.
10. Anime.js remains available for UI transitions and non-movement effects. Do not bring it back into the per-step actor movement loop without explicit owner approval.

## 6. Verification and build status

- Web validation on source checkpoint `160458486cf7b69400651614252e66942b48ffa6`: **passed** (gameplay tests and TypeScript/Vite production build).
- The follow-up APK workflow was triggered from the branch after adding the branch to `.github/workflows/build-android.yml`. Check the live Actions page for the newest run:
  [Android builds for this branch](https://github.com/Antarezka/merzkava-apk/actions/workflows/build-android.yml?query=branch%3Afix%2F1348-token-only-motion-camera-center-subcell)
- APK upload is ordered **before** the Android 14 emulator step. An emulator failure must not be mistaken for an APK compile/package failure, and an uploaded artifact remains the installable package even if the emulator smoke-test fails.
- Do not claim Android emulator or TECNO physical-device QA passed unless the workflow/device result explicitly shows it. The owner expects the emulator step may fail; report it honestly and retain the artifact link.
- A physical test on TECNO Spark Go 1 KL4 is still the decisive check for map flicker, sub-cell movement feel, center placement, touch gestures and actual performance.

## 7. Suggested next actions

1. Open the newest Android Actions run and download the artifact named `merzkava-build-<run-number>` once the **Upload verified APK and build record** step succeeds.
2. Install/test only after the owner chooses to do so; do not hold the APK link hostage to emulator status.
3. Ask the owner to check these four behaviors on device: enter Academy gameplay; move Player across several half-sectors of one diamond; observe NPCs stepping through fragments; set/confirm a visibly off-center camera focal point and press CENTER MAP.
4. If a regression occurs, capture which map, selected editor mode, saved JSON `cameraCenter`, token `data-posX/data-posY/data-quadrant`, and workflow/commit SHA. Do not switch renderers before isolating the responsible layer.

## 8. Change log for this baseline update

- **Added/extended:** NPC wandering now uses the same eight-sector path graph as Player movement and selects fragment-level steps rather than whole-cell-only moves.
- **Changed:** Player/NPC visual motion now animates the actor token only; map JPG, ground SVG and foreground canvas are not redrawn by each movement step. Large decorative scanner sweeps and the per-step tile trail were removed from the low-power gameplay path.
- **Fixed:** confirming a focal point applies the saved editor CENTER MAP point without stale scroll restoration or map repaint; Academy entry camera remains a separate Player-token focus.
- **Reorganized:** generic-map and test-board actors are grouped under a dedicated actor layer; obsolete whole-cell movement helper/import were removed.
- **Added tests:** runtime contract assertions cover the fragment route graph, token-only animation, the center-apply event, and the distinction between Player entry focus and saved CENTER MAP focal point.
- **Dialogue:** split short choice-button labels from natural contextual Player utterances via per-NPC `playerLines[]`; chat now speaks the utterance rather than repeating an instruction-like label.
- **No new rendering dependency:** PixiJS was not added to this branch.

---

**Continuation rule:** If later commits change these files, update this handoff and `ISOMETRIC_FIELD_SYSTEM.md` in the same workstream. Prefer a short commit that says what changed for the player, not a vague `misc update`.
