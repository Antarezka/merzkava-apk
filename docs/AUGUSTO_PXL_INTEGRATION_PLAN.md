# Augusto PXL — Full Visual Asset Pipeline Integration Plan

**Status:** Owner-approved next major visual-production priority. The first delivery is the separate pink floating CRT/console launcher in Eternal Path; full PXL integration follows as the next priority.
**Target application:** Merzkava APK
**PXL project:** [augusto-scarvalho/claude-pxl](https://github.com/augusto-scarvalho/claude-pxl)
**License:** The inspected PXL repository declares MIT. Preserve its LICENSE and copyright notices in any vendored or redistributed copy.
**Baseline:** Android Build #1374 source commit `5a1532acb526539315a3f92d2ab3b273bc9c9dc9` on `feat/player-hud-inventory-2026-11-06`. That workflow run failed; it is a source baseline, not a successful APK verification.

## 1. Product decision

Use Augusto PXL as the **full visual asset authoring and export pipeline** for Merzkava. “Full” means the visual content categories below are in scope; it does not mean replacing the app's game runtime or interaction architecture.

PXL is a development-time authoring/build tool. Its outputs are optimized assets and metadata consumed by Merzkava. The Android APK must not need to run the PXL CLI, browser viewer, or authoring environment.

**Do not reintroduce PixiJS.** A previous PixiJS implementation caused confirmed Android touch/input failures in this app and was removed. Keep the current DOM/CSS/SVG presentation and interaction path, with Anime.js for supported animation. PXL-generated art may be rendered by that existing path through an adapter.

## 2. Full visual-production scope

The PXL source library and build pipeline should cover:

- **World environments:** regional panoramas, settlements, interiors, academy grounds, forests, coastlines, floating islands, ruins and other location artwork.
- **Maps and tilesets:** isometric terrain, ground tiles, building pieces, environmental layers, map props and exportable Tiled maps where useful.
- **Characters and creatures:** Player, NPCs, Spirit Beasts, silhouettes, portraits, directional sprites and reusable animation sets.
- **Objects and props:** furniture, doors, signs, tools, artifacts, equipment, containers, plants, vehicles and interactive-object artwork.
- **Effects and atmosphere:** weather, fog, rain, snow, petals, ambient particles, Martial Soul manifestations, Spirit Ring visuals, Arcanistry effects, lighting and environmental motion.
- **UI artwork:** original icons, borders, ornaments, emblems, inventory/item artwork, panel decoration and visual state illustrations. Interactive controls, layout and accessibility remain HTML/CSS.
- **Cinematics and presentation:** scene illustrations, transitions, visual-novel cutscene frames and other authored narrative imagery.

All artwork must be original or properly licensed. Do not copy commercial game assets or protected character designs.

## 3. Proposed repository layout

Keep editable PXL sources separate from generated runtime exports:

```text
pxl/
  palettes/
  characters/
    player/
    npc/
    spirit-beasts/
  environments/
    academy/
    cities/
    forests/
    interiors/
  tilesets/
  objects/
  effects/
    weather/
    martial-soul/
    spirit-ring/
    arcanistry/
  ui/
  cinematics/
  scenes/

public/assets/pxl/
  characters/
  environments/
  maps/
  tilesets/
  objects/
  effects/
  ui/
  cinematics/

scripts/pxl-build/
```

The final paths and naming convention should be reconciled with the existing asset directories before the first export. Do not move or delete existing assets just to match this proposed layout.

## 4. Integration architecture

1. **Author in PXL:** Keep editable `.px.js` source and reusable palettes/components in the PXL source library.
2. **Build outside the APK runtime:** Run the PXL CLI in GitHub Actions or another supported development environment. The inspected project requires Node.js 22.18 or newer; CI is the preferred place to pin and run that toolchain.
3. **Validate exports:** Check generated PNGs, sprite sheets, animation metadata, map exports and asset dimensions. Fail the pipeline on missing references, invalid metadata or unexpected oversized outputs.
4. **Generate a manifest:** Give each export a stable asset ID, source path, output path, dimensions, frame count, animation tags, intended map/scene and provenance/license note.
5. **Adapt to the current runtime:** Add a small TypeScript asset adapter that reads the manifest and maps PXL outputs to existing DOM/CSS/SVG components. Use CSS positioning/steps or the existing animation utilities where appropriate. Tiled `.tmj` data needs an explicit adapter into the current Merzkava map schema; it must not silently replace walkability, sector or half-edge rules.
6. **Load by context:** Load only the current region/scene and required character/effect sheets. Release or avoid retaining unused large assets where the current app lifecycle allows it.

PXL's browser viewer is for authoring and review only. Do not embed it in the Android game as a runtime dependency.

## 5. Performance and Android constraints

- Prefer optimized PNG sprite sheets plus metadata for active character animation; do not use large animated GIFs as the main runtime animation format.
- Split sheets by character, environment and effect family. Avoid one giant texture or atlas.
- Lazy-load region and scene assets; preload only the next likely transition when measurable.
- Keep distant/background animation simpler than foreground animation.
- Pre-render or bake expensive visual effects when PXL supports exportable frames; do not assume this automatically makes the APK faster. Measure asset size, decode time, memory and frame pacing on the target TECNO Spark Go 1 KL4.
- Respect reduced-motion settings and pause nonessential decorative animation when the app is backgrounded.
- Keep touch handling on ordinary DOM controls. Generated art must not create a new pointer-event layer over menus, HUD controls or map interaction.

## 6. Non-regression boundaries

The PXL workstream must not change the game rules or replace these existing systems:

- Player/NPC movement, eight-sector walkability, blocked half-edges, occupancy and route logic.
- Static map artwork and SVG/canvas layers, including the existing Academy map, until a replacement passes a side-by-side migration test.
- World Atlas navigation, map editor, minimap, camera focal-point behavior and per-map saved editor data.
- Player HUD, inventory/satchel, currency, windows, menu navigation and existing floating TV gateway.
- NPC behavior, chat, save data, local persistence, Eternal Path simulation or World Archive content.
- Existing Anime.js/DOM animation and native Android input behavior.

Never add PixiJS as a shortcut for displaying PXL exports. PXL is the asset pipeline; the existing app remains the runtime.

## 7. Delivery phases

### PXL-0 — Toolchain and source-library foundation
- Pin the PXL repository revision and Node.js toolchain.
- Confirm the CLI commands and output contracts against the selected revision.
- Add PXL source folders, build scripts, validation and a small representative sample.
- Preserve MIT license/copyright notices.
- Produce a reproducible GitHub Actions artifact without changing the APK runtime.

### PXL-1 — Runtime asset manifest and adapter
- Define stable asset IDs, animation tags, frame metadata, dimensions and map references.
- Implement the TypeScript adapter for the existing DOM/CSS/SVG renderer.
- Add tests for missing assets, malformed metadata, unsupported animation tags and map-coordinate conversion.
- Keep the current Academy assets and renderer as the fallback.

### PXL-2 — Character and object library
- Produce Player/NPC/Spirit Beast directional sprite sets, idle/walk states, portraits and object/prop artwork.
- Verify sprite alignment, transparent padding, sheet dimensions and memory use.
- Integrate one test character/prop in a controlled scene before scaling production.

### PXL-3 — World Atlas and environment migration
- Build one small representative map/area and its environment layers.
- Test the Tiled-to-Merzkava map adapter without changing movement or editor semantics.
- Migrate additional locations gradually only after map visuals, camera, minimap, collision/walkability and editor round-trips pass.

### PXL-4 — Effects, atmosphere and Arcanistry
- Produce reusable weather, lighting, particle, Martial Soul, Spirit Ring and Arcanistry effect assets.
- Prefer baked/exported frames for costly effects where visual quality and asset budgets justify them.
- Test cleanup, pause/resume, reduced motion and low-memory behavior.

### PXL-5 — UI artwork and cinematics
- Add original UI ornaments, item icons, panel artwork and cutscene assets.
- Keep all buttons, inputs, HUD state, navigation, accessibility and layout in the current app UI layer.

### PXL-6 — Optimization and release gate
- Measure APK growth, per-area asset transfer/decode cost, memory, frame pacing and touch reliability on Android.
- Validate a clean build and run the existing menu, World Atlas, Eternal Path, HUD, inventory, minimap, editor and movement regression suite.
- Do not remove old assets until every replacement has passed visual and functional comparison.

## 8. Acceptance criteria

- PXL sources build reproducibly in CI with pinned versions and preserved license notices.
- Generated assets are referenced by a validated manifest and can be loaded by the existing runtime adapter.
- At least one character, one environment/area, one object and one effect are integrated as a representative end-to-end slice.
- No PixiJS runtime/dependency or alternate touch/input system is introduced.
- Existing map movement, editor, minimap, HUD, inventory, navigation, floating controls and saves pass regression tests.
- Target-device testing records real Android results; a successful web build alone is not Android verification.

## 9. First implementation checkpoint

The separate pink Augusto PXL CRT/console launcher is placed in Eternal Path beside the existing green TV gateway. Both controls use a 54 × 54 px outer footprint and have independent drag-position storage. The new launcher opens this plan summary; it does not pretend that PXL has already been installed or integrated.

The full pipeline described above is the next major visual-production priority after this launcher and plan record.


## 10. Pink PXL World Atlas — separate visual mode, same gameplay structure

The pink floating CRT console opens the **same World Atlas modal and map hierarchy**, but activates a second visual-mode instance:

- The green TV selects `data-visual-mode="legacy"` and continues to display the original DOM/SVG World Atlas.
- The pink TV selects `data-visual-mode="augusto-pxl"` and displays a separate, initially hidden map hierarchy inside the same modal.
- Only one map hierarchy is visible at a time. Both keep the same World Atlas levels, marker IDs, region navigation, Academy entry, isometric map structure, grid geometry, eight-sector movement, blocked half-edge rules, camera operations, minimap, NPC positions, NPC decisions, dialogue and map interaction handlers.
- PXL-mode editor/map-layout persistence is namespaced separately. Opening or editing the pink Atlas must not run the legacy map migration/reset or overwrite the green Atlas's Academy canvas-expansion and map-editor preferences.
- Player and NPC map hit targets remain ordinary HTML buttons. Their visible children become PXL-produced 2D character sprites. The current movement code changes the sprite's directional/motion state (idle/walk); PXL supplies the frame art, directional animation sheets and metadata.
- Tianhai Academy keeps the authoritative 2816 × 1536 artwork coordinate space, 24 × 20 map grid, 128 × 69.5 tile geometry, player/NPC grid positions and the current walkability/editor rules. PXL supplies the new 3D-look HD-2D/isometric environment artwork and separate 2D characters. The editable Academy artwork itself must not alter the coordinate/collision authority.
- Player HUD, satchel/bag, skill icons, item icons, currency marks and Spirit Ring artwork have PXL asset IDs in the pink mode. Their existing HTML buttons, inventory state, currency data, accessibility and click behavior remain the game implementation's responsibility.

### Offline access and package storage

- The pink Atlas login selector contains local profiles and locally saved Eternal Path journeys only. Sign-in/sign-up/password checks use the existing local Atlas credential store; it does not fetch `players.md`, `ACTIVE_SHA` or another remote endpoint. It does not grant access to a Universe identity that has never been stored locally.
- PXL assets are packaged under `public/assets/augusto-pxl/` and referenced by the local `manifest.json`. The runtime resolves only `/assets/augusto-pxl/...` paths. No CDN, external image URL, PXL browser viewer or remote renderer is used in gameplay.
- The APK-bundled package is the first offline source. On Android, the runtime also attempts to create a per-install encrypted cache: a random AES-256-GCM key is stored through the Android Keystore-backed SecureStorage plugin, and copied asset blobs are stored in local IndexedDB. Cache failure falls back to the APK copy and does not block entry.
- Static APK assets are local and offline, but are not confidential: anyone able to extract the APK can inspect bundled files. Encryption applies to the optional mutable local cache, not to the packaged static artwork.
- Web preview does not claim Keystore protection; the encrypted cache is Android-native only.

### PXL source-to-APK pipeline

- `pxl/` is the editable PXL workspace. `pxl/asset-map.json` maps a stable app asset ID to an already-generated PXL export and its animation metadata.
- GitHub Actions checks out the pinned PXL commit, validates and builds each `.px.js`, copies PXL outputs to `public/assets/augusto-pxl/exports/`, preserves the upstream MIT license, and updates asset status in the manifest from `pending` to `ready` only for explicitly mapped, existing output files.
- The Android build runs that asset step before Vite packaging. The APK therefore contains the asset manifest and exports needed by the PXL Atlas while offline.
- Sprite-sheet frame dimensions, columns, directions and idle/walk frame sequences are declared in `pxl/asset-map.json`. PXL authors the actual visual frames; the app's lightweight DOM/Web Animations player displays them. PXL is not a runtime engine.

### Current delivery boundary

The dual Atlas structure, visual-mode hooks, local-only pink login path, offline manifest/asset folders, encrypted Android cache code and pinned PXL CI pipeline are now in the branch. The manifest intentionally keeps production map/character/HUD/effect entries at `pending` until actual visual exports are authored and mapped. The checked-in Academy SVG is a labelled placeholder, not the final 3D-look Academy environment. The initial PXL smoke asset validates the toolchain; it is not a playable art pack.
