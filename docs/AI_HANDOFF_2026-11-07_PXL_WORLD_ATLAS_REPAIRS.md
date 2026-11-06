# PXL World Atlas repair handoff — 2026-11-07

## Build lineage
- Comparison baseline: Android Build #1388, source ca214968 (2026-11-06). APK was compiled, signed and uploaded; emulator smoke test failed, so this is not a device-test pass.
- Upstream branch advanced to 8069b944 (parent 91fd6934), including Academy roof/courtyard artwork. PXL Pipeline #55 passed; Android Build #1409 was running when the repair branch was created.
- Repair branch: fix/augusto-pxl-world-atlas-runtime-2026-11-07, based on 8069b944. GitHub Actions assigns the next build number automatically; generated BUILD_NOTES.md is authoritative.

## New
- PXL-authored world overview and 35 separate regional panels; legacy world-image crops are no longer their source.
- Separate PXL local-scene art for Golden Dragon Empire, Tianhai Yunzhou and Beiming Gu, plus a new schematic Academy minimap.
- Optional target-region metadata for map transition labels and a reusable confirmation prompt when the player enters a marked tile.
- Locked isometric scale baseline in AUGUSTO_PXL_ISOMETRIC_SCALE_STANDARD.md.

## Changed / fixed
- Sprite loader remembers the last applied asset/state signature, so repeated MutationObserver reads do not reset the same sprite sheet animation.
- Pink HUD status card and skill dock remain transparent as in HUD revision two. Spirit Ring visual rail stays on the left; bag, currency, items and skills retain independent artwork.
- Character source frames are constrained to a single 32 × 48 px canvas and bottom-centre anchoring.
- Regional image entrance motion uses a compositor transform/opacity transition instead of a full-image brightness filter.
- Pink Atlas access/login veil no longer applies full-screen backdrop blur behind the running Arcanistry machine.
- Local map selection binds to a distinct scene for the three primary regions instead of reusing the same generic local artwork.
- Academy gate labels now use a shared YES/NO confirmation flow. YES opens the named target region; NO returns the player to the previous safe walkable tile. Event/dialog labels trigger on tile entry.

## Preserved
- Green/legacy Atlas is not edited.
- World marker coordinates, app map geometry, walkability, collision, Academy canvas/grid, actor movement and local save state remain authoritative.
- PXL remains build-time only; no PixiJS or remote runtime dependency is added.

## Review still required
- PXL export/manifest validation and APK build/signature/smoke test on this branch.
- Owner review of the 35 new region silhouettes against the legacy map; UI marker coordinates are preserved, but new coastlines/terrain are illustrative rather than a canonical geography edit.
- Manual phone install/touch review for sprite alignment, transparent HUD, Academy gate confirmation and NO retreat behavior.
