# World Archive — Coverage Matrix (Phase 1)

> AI/developer handoff baseline. This matrix covers every Markdown path in the pinned Universe tree. A disposition is a handling decision, **not** publication permission.

- Audited: 2026-11-01
- Universe source: `Antarezka/merzkava-universe` / `main` / `2f76a864150528afb0e3d26cb16f9396ce610ff6`
- APK: `Antarezka/merzkava-apk` / `feature/archive-experience`; pre-documentation baseline `67c5186ffac266fde41ddf82fd2fd3042d412486`
- Current app catalogue: **39 dossiers / 35 unique source paths**.

## Phase 1 inventory

| Disposition | Files |
|---|---:|
| `GM_ONLY` | 4 |
| `INTERNAL_TEMPLATE` | 9 |
| `LEGACY_OR_COMPATIBILITY` | 15 |
| `MECHANICS_REFERENCE` | 16 |
| `PARTIAL_PUBLIC` | 9 |
| `PRIVATE_PLAYER_DATA` | 7 |
| `PUBLIC_CANDIDATE` | 14 |
| `PUBLISHED` | 21 |
| `REPOSITORY_CONTROL` | 17 |
| `REVIEW_REQUIRED` | 28 |
| **Total** | **140** |

## Coverage score — verified source-path metrics (2026-11-01)

These percentages measure **source-path coverage**, not claim-by-claim completeness. A dossier may curate only selected public claims from a source file, so a mapped path is not proof that every paragraph or fact has been reviewed or published.

| Measure | Calculation | Progress | Meaning |
|---|---:|---:|---|
| Whole-repository source footprint | 35 mapped paths / 140 Markdown paths | **25.0%** | How much of the entire Universe Markdown inventory currently has at least one Archive dossier mapping. |
| Potential player-facing source scope | 35 mapped / 72 eligible-or-review-needed paths | **48.6%** | The 72 comprise 21 `PUBLISHED`, 9 `PARTIAL_PUBLIC`, 14 `PUBLIC_CANDIDATE`, and 28 `REVIEW_REQUIRED` source files. |
| Already dispositioned public-scope paths | 35 mapped / 44 `PUBLISHED` + `PARTIAL_PUBLIC` + `PUBLIC_CANDIDATE` paths | **79.5%** | Coverage among sources already classified into a public-facing disposition; it does not mean every claim is approved. |
| Canonical mechanics source preservation | 16 / 16 `MECHANICS_REFERENCE` modules copied verbatim | **100% preserved** | Exact development snapshot exists separately in `docs/OFFLINE_GAME_CANON_FORMULA_SNAPSHOT.md`. One supplemental formula-bearing governance source is also preserved. |
| Initial deterministic mechanic implementation | 5 foundational modules: HP, Satiety, Injury, Time/Day-left, and Combat | **5 modules implemented; CI verified** | HP state consistency, Satiety interval/intake, Injury recovery, Time/Day-left, and Combat formulas are implemented. Overall engine percentage is not baselined; remaining formula domains and dependencies still require an inventory. |

**Current Archive inventory:** 39 curated dossiers / 35 unique source paths. The 16 mechanics-reference files are intentionally not published as ordinary Archive lore. Claim-level content completeness remains **not yet measured**; do not turn the path ratios above into a claim that the Archive is 25%, 48.6%, or 79.5% complete in every dimension.

**How to read the progress:** use **48.6%** as the current broad source-coverage indicator for the potentially player-facing Archive scope, **25.0%** as the whole-repository footprint, and report formula preservation and game-engine implementation separately. Never combine these into one misleading average.

## Mandatory entity-link contract

- Stable local dossier IDs are primary keys; display names are not.
- Every mention of an approved public entity in a dossier must be a clickable local link to the correct dossier, matching the current `data-lore-open` interaction.
- Canonical title takes precedence over aliases. Search, body links, related records and backlinks must use the same resolver.
- Ambiguous, GM-only, private, or unreviewed identities remain excluded from the entity graph. A deliberately under-specified but intentionally indexable name may instead receive a curated placeholder record and remain clickable; do not mistake this for permission to expose restricted identities.
- Relationships are claim-level facts. Shared surnames do not prove kinship; titles do not prove current office; links must not invent relationships.
- Entity development status is separate from source-review disposition. `ON_PLAN` means the entity is intentionally under-specified and reserved for GM narrative development; its known references may be shown, but the app must not invent details or promote improvisation to canon. `NON_CANON` means explicitly non-canonical material; it must be visibly labelled and must never be presented as official Universe fact. Both may be clickable only through an explicit, reviewed placeholder registry; unknown names do not become placeholders automatically.
- Each entity record should retain ID, canonical name, aliases, entity type, visibility, source path(s) and related public dossier IDs.
- Every source citation must open a bundled local, player-safe reviewed extract inside the APK. The reader must show exact source path, source commit, review date, and source classification. Do not bundle raw canonical Markdown merely because a file-level disposition is `PUBLISHED`: individual NPC/source files can contain location, whereabouts, or other claims that need claim-level review. Mixed-scope sources expose only the curated dossier extract; restricted claims never enter the player reader.

## Offline source reader — Phase 1 implementation

- Each public dossier can open a local reviewed extract without network access. The seven Golden Dragon regional dossiers are now added as distinct public entities.
- The reader is generated only from the dossier's approved public summary and paragraphs; it is **not** a verbatim rendering of the original Universe Markdown.
- Exact provenance is retained: source path, pinned Universe commit, review date, and source classification, including `PUBLIC_CANDIDATE` for the seven regional modules used only through claim-reviewed extracts.
- Seven dossier source paths are classified `PARTIAL_PUBLIC`: `world/WORLD.md`, `world/LAWLESS_TERRITORIES.md`, `world/MAP_AND_REGIONS.md`, `world/FACTIONS.md`, `world/RUINED_ARCHIVER.md`, `world/ARTIFACTS_AND_RELICS.md`, and `world/ARTIFICIAL_ARTIFACTS.md`. Their raw source files are not bundled.
- Even file-level `PUBLISHED` does not authorize copying every claim from a raw NPC profile. The player reader includes only claims selected into the reviewed dossier. This avoids exposing unreviewed whereabouts, locations, or other restricted details.
- Regression tests cover provenance, public-safe scope notices, and reader navigation. Tests are committed but not yet run; CI and physical-device verification remain open.

## Full source-to-app coverage matrix (140/140)

| Universe path | Disposition | Existing dossier ID(s) | Notes |
|---|---|---|---|
| `/INDEX.md` | `REPOSITORY_CONTROL` | — |  |
| `/NIGHTLY_VERSION.md` | `REPOSITORY_CONTROL` | — |  |
| `/README.md` | `REPOSITORY_CONTROL` | — |  |
| `/SAFE_VERSION.md` | `REPOSITORY_CONTROL` | — |  |
| `/STABLE_VERSION.md` | `REPOSITORY_CONTROL` | — |  |
| `/players.md` | `PRIVATE_PLAYER_DATA` | — |  |
| `bestiary/SPIRIT_BEAST_RULES.md` | `MECHANICS_REFERENCE` | — |  |
| `core/10_ECONOMY_SYSTEM.md` | `MECHANICS_REFERENCE` | — |  |
| `core/ARCANISTRY_AND_FORMULATION.md` | `MECHANICS_REFERENCE` | — |  |
| `core/CULTIVATION_SYSTEM.md` | `MECHANICS_REFERENCE` | — |  |
| `core/CULTIVATOR_ACADEMIES.md` | `MECHANICS_REFERENCE` | — |  |
| `core/HP_SYSTEM.md` | `MECHANICS_REFERENCE` | — |  |
| `core/HUNGER_AND_METABOLISM.md` | `MECHANICS_REFERENCE` | — |  |
| `core/INJURY_SYSTEM.md` | `MECHANICS_REFERENCE` | — |  |
| `core/MARTIAL_SOUL.md` | `MECHANICS_REFERENCE` | — |  |
| `core/MARTIAL_SOUL_AWAKENING.md` | `MECHANICS_REFERENCE` | — |  |
| `core/SPIRIT_REALM_TRADITIONS.md` | `MECHANICS_REFERENCE` | — |  |
| `core/SPIRIT_RING_RULES.md` | `MECHANICS_REFERENCE` | — |  |
| `core/TIER_ASSESSMENT_AND_APPRAISAL.md` | `MECHANICS_REFERENCE` | — |  |
| `gameplay/COMBAT_SYSTEM.md` | `MECHANICS_REFERENCE` | — |  |
| `gameplay/TIME_AND_ACTION_RULES.md` | `MECHANICS_REFERENCE` | — |  |
| `gameplay/TRAVEL_ENCOUNTER_AMBUSH_RESCUE.md` | `MECHANICS_REFERENCE` | — |  |
| `players/Elliot.md` | `PRIVATE_PLAYER_DATA` | — |  |
| `players/Ilya.md` | `PRIVATE_PLAYER_DATA` | — |  |
| `players/Luca.md` | `PRIVATE_PLAYER_DATA` | — |  |
| `players/Nafila.md` | `PRIVATE_PLAYER_DATA` | — |  |
| `players/Xin Hwa.md` | `PRIVATE_PLAYER_DATA` | — |  |
| `players/Yuha.md` | `PRIVATE_PLAYER_DATA` | — |  |
| `regions/beiming-gu/INDEX.md` | `REPOSITORY_CONTROL` | — |  |
| `regions/beiming-gu/npcs/BEIMING_HAN.md` | `PUBLISHED` | `beiming-han` |  |
| `regions/beiming-gu/npcs/BEIMING_JINGHENG.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/BEIMING_NERVA.md` | `GM_ONLY` | — |  |
| `regions/beiming-gu/npcs/BEIMING_XENHWA.md` | `PUBLISHED` | `beiming-xenhwa` |  |
| `regions/beiming-gu/npcs/BEIMING_XUANYU.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/BINGHE_CHUANLIU.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/BLUE_FLAME_DOJO_MASTER.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/CANGXUE_BEIRAN.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/CANGXUE_TIELAN.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/FROSTPEAK_DOJO_MASTER.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/HANYUE_MINGZHAO.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/IRONROOT_DOJO_MASTER.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/LINGFENG_YUJIN.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/MINGHU_YANSHU.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/REGISTRY.md` | `REPOSITORY_CONTROL` | — |  |
| `regions/beiming-gu/npcs/SILENT_SNOW_DOJO_MASTER.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/SILVER_TIGER_DOJO_MASTER.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/TIESHI_BEIYUE.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/XUANBING_LINGSU.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/XUANBING_YUE.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/XUANSONG_QINGHE.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/XUANYE_ZHENBEI.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/YAOCHI_SUWEN.md` | `REVIEW_REQUIRED` | — |  |
| `regions/beiming-gu/npcs/YINSHAN_QIAOFENG.md` | `REVIEW_REQUIRED` | — |  |
| `regions/golden-dragon-empire/INDEX.md` | `REPOSITORY_CONTROL` | — |  |
| `regions/golden-dragon-empire/npcs/JUN_HAOTIAN.md` | `PUBLISHED` | `jun-haotian` |  |
| `regions/golden-dragon-empire/npcs/JUN_RUIYUAN.md` | `PUBLISHED` | `jun-ruiyuan` |  |
| `regions/golden-dragon-empire/npcs/JUN_YUEJIN.md` | `PUBLISHED` | `jun-yuejin` |  |
| `regions/golden-dragon-empire/npcs/LUO_ZHENKAI.md` | `REVIEW_REQUIRED` | — |  |
| `regions/golden-dragon-empire/npcs/REGISTRY.md` | `REPOSITORY_CONTROL` | — |  |
| `regions/golden-dragon-empire/npcs/SHEN_YUEHUA.md` | `PUBLISHED` | `shen-yuehua` |  |
| `regions/golden-dragon-empire/npcs/SHEN_YUNTING.md` | `REVIEW_REQUIRED` | — |  |
| `regions/tianhai-yunzhou/INDEX.md` | `REPOSITORY_CONTROL` | — |  |
| `regions/tianhai-yunzhou/npcs/BAI_XUANYIN.md` | `PUBLISHED` | `bai-xuanyin` |  |
| `regions/tianhai-yunzhou/npcs/DUAN_HAICHENG.md` | `REVIEW_REQUIRED` | — |  |
| `regions/tianhai-yunzhou/npcs/JI_HAOYUAN.md` | `PUBLISHED` | `ji-haoyuan` |  |
| `regions/tianhai-yunzhou/npcs/JI_NINGZHAO.md` | `PUBLISHED` | `ji-ningzhao` |  |
| `regions/tianhai-yunzhou/npcs/JI_ZHAONING.md` | `PUBLISHED` | `ji-zhaoning` |  |
| `regions/tianhai-yunzhou/npcs/LIN_QIAOYU.md` | `REVIEW_REQUIRED` | — |  |
| `regions/tianhai-yunzhou/npcs/POWER_STRUCTURE.md` | `REPOSITORY_CONTROL` | — |  |
| `regions/tianhai-yunzhou/npcs/REGISTRY.md` | `REPOSITORY_CONTROL` | — |  |
| `templates/ANTI_CHEAT_HARD_GATE.md` | `INTERNAL_TEMPLATE` | — |  |
| `templates/AUTHORITY_ORDER.md` | `INTERNAL_TEMPLATE` | — |  |
| `templates/CHARACTER_PROFILE_TEMPLATE.md` | `INTERNAL_TEMPLATE` | — |  |
| `templates/GAMEPLAY_RESPONSE_TEMPLATE.md` | `INTERNAL_TEMPLATE` | — |  |
| `templates/NARRATIVE_DYNAMICS.md` | `INTERNAL_TEMPLATE` | — |  |
| `templates/NPC_PROFILE_TEMPLATE.md` | `INTERNAL_TEMPLATE` | — |  |
| `templates/PLAYER_CONVERSATION_TEMPLATE.md` | `INTERNAL_TEMPLATE` | — |  |
| `templates/REGIONAL_MODULE_TEMPLATE.md` | `INTERNAL_TEMPLATE` | — |  |
| `templates/WORLD_EVENT_UPDATE_TEMPLATE.md` | `INTERNAL_TEMPLATE` | — |  |
| `world/ANCIENT_SHAMANISM_AND_BUDDHIST_CLANS.md` | `PARTIAL_PUBLIC` | — |  |
| `world/ARTIFACTS_AND_RELICS.md` | `PARTIAL_PUBLIC` | `artifacts` |  |
| `world/ARTIFICIAL_ARTIFACTS.md` | `PARTIAL_PUBLIC` | `floating-island-artifact` |  |
| `world/CANON_DECISIONS_AND_PRECEDENCE.md` | `REPOSITORY_CONTROL` | — |  |
| `world/CANON_LOAD_ROUTER.md` | `REPOSITORY_CONTROL` | — |  |
| `world/DYNAMIC_EVENTS.md` | `GM_ONLY` | — |  |
| `world/FACTIONS.md` | `PARTIAL_PUBLIC` | `factions; medicine-hall; ordo-suci-tianming` |  |
| `world/GEOGRAPHY_AND_TRAVEL.md` | `PARTIAL_PUBLIC` | — |  |
| `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md` | `PUBLISHED` | `golden-dragon` |  |
| `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md` | `PUBLIC_CANDIDATE` | — |  |
| `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md` | `REVIEW_REQUIRED` | — |  |
| `world/GOLDEN_DRAGON_EMPIRE_POPULATION_SERVICES.md` | `PUBLIC_CANDIDATE` | — |  |
| `world/HISTORY.md` | `PUBLISHED` | `history; arcanistry` |  |
| `world/IMPERIAL_SPECIAL_FINANCIAL_AUDIT_COMMITTEE.md` | `REVIEW_REQUIRED` | — |  |
| `world/INTELLIGENT_PEOPLES.md` | `PUBLISHED` | `peoples` |  |
| `world/LAWLESS_SOUTHERN_PORT_AND_ISLES.md` | `PUBLISHED` | `southwake-lanternhook` |  |
| `world/LAWLESS_TERRITORIES.md` | `PARTIAL_PUBLIC` | `lawless` |  |
| `world/LOCATION_AND_ROUTE_NETWORK.md` | `GM_ONLY` | — |  |
| `world/MAP_AND_REGIONS.md` | `PARTIAL_PUBLIC` | `seas` |  |
| `world/NPC_BAI_XUANYIN.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/NPC_JI_HAOYUAN.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/NPC_JI_NINGZHAO.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/NPC_JI_ZHAONING.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/NPC_JUN_HAOTIAN.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/NPC_JUN_RUIYUAN.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/NPC_JUN_YUEJIN.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/NPC_MANAGEMENT.md` | `REPOSITORY_CONTROL` | — |  |
| `world/NPC_SHEN_YUEHUA.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/NPC_TIANHAI_POWER_STRUCTURE.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/NPC_YING_WUXIN.md` | `GM_ONLY` | — |  |
| `world/OPEN_LEARNING_PATHS_AND_WANDERING_INSTRUCTORS.md` | `PUBLIC_CANDIDATE` | — |  |
| `world/PRISON_AND_BOUND_ITEMS.md` | `REVIEW_REQUIRED` | — |  |
| `world/REGIONAL_REPOSITORY_ARCHITECTURE.md` | `REPOSITORY_CONTROL` | — |  |
| `world/REGION_ASHEN_BORDERLANDS.md` | `PUBLISHED` | `ashen-borderlands` |  |
| `world/REGION_AZUREFLAME_BASIN.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/REGION_BAIYUE.md` | `PUBLIC_CANDIDATE` | `region-baiyue` | Curated regional facts only; raw file includes unreviewed local NPC/encounter material. |
| `world/REGION_BEIMING_GU.md` | `PUBLISHED` | `beiming` |  |
| `world/REGION_BEIMING_HEARTLAND.md` | `PUBLIC_CANDIDATE` | — |  |
| `world/REGION_BLACK_TIDE_EXPANSE.md` | `PUBLISHED` | `black-tide-expanse` |  |
| `world/REGION_CANGLAN.md` | `PUBLIC_CANDIDATE` | `region-canglan` | Curated regional facts only; raw file includes unreviewed local NPC/encounter material. |
| `world/REGION_FROSTVEIL_RANGE.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/REGION_HOLLOWMOON_VALLEY.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/REGION_IRONROOT_REACH.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/REGION_JINYUE.md` | `PUBLIC_CANDIDATE` | `region-jinyue` | Curated regional facts only; raw file includes unreviewed local NPC/encounter material. |
| `world/REGION_LONGYUAN.md` | `PUBLIC_CANDIDATE` | `region-longyuan` | Curated regional facts only; raw file includes unreviewed local NPC/encounter material. |
| `world/REGION_NINE_FROST_WASTES.md` | `PUBLISHED` | `nine-frost-wastes` |  |
| `world/REGION_SILVERPINE_WILDS.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/REGION_STONEGATE_MARCH.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/REGION_TIANFENG.md` | `PUBLIC_CANDIDATE` | `region-tianfeng` | Curated regional facts only; raw file includes unreviewed local NPC/encounter material. |
| `world/REGION_TIANHAI_YUNZHOU.md` | `PUBLISHED` | `tianhai` |  |
| `world/REGION_XINGLUO.md` | `PUBLIC_CANDIDATE` | `region-xingluo` | Curated regional facts only; raw file includes unreviewed local NPC/encounter material. |
| `world/REGION_YANLING.md` | `PUBLIC_CANDIDATE` | `region-yanling` | Curated regional facts only; raw file includes unreviewed local NPC/encounter material. |
| `world/RUINED_ARCHIVER.md` | `PARTIAL_PUBLIC` | `ruined-archiver` |  |
| `world/SOCIAL_STRATIFICATION.md` | `PUBLIC_CANDIDATE` | — |  |
| `world/SPIRIT_HUNTERS_GUILD.md` | `PUBLISHED` | `spirit-hunters-guild` |  |
| `world/THREE_POWER_PERSPECTIVE_MAPS.md` | `PUBLIC_CANDIDATE` | — |  |
| `world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md` | `PUBLIC_CANDIDATE` | — |  |
| `world/WANLUO_SACRED_EXPANSE.md` | `PUBLISHED` | `wanluo; world-knowledge-tower` |  |
| `world/WEALTH_DISTRIBUTION.md` | `REVIEW_REQUIRED` | — |  |
| `world/WORLD.md` | `PARTIAL_PUBLIC` | `world-atlas` |  |
| `world/WORLD_NAVIGATION_TREE.md` | `REPOSITORY_CONTROL` | — |  |

## Priority gaps for the next content pass

1. **Golden Dragon Empire regions:** Longyuan, Jinyue, Tianfeng, Xingluo, Yanling, Baiyue and Canglan. Validate against the current atlas; preserve unknown borders, populations, services, routes and durations.
2. **Public institutions/society:** governance, population services, Tianhai academies and Arcanist Institute, social stratification, and only the public high-level scope of the Imperial Special Financial Audit Committee.
3. **NPC graph:** current app has 10 individual NPC dossiers; Universe has 35 regional NPC profiles. Review remaining profiles individually; never bulk-import registries or the legacy officials roster.
4. **Maps/geography:** relative schematics only, not scale maps; split public geography from hidden routes and travel mechanics.
5. **Local source reader:** open cited local documents offline with provenance. Current source card only displays the source path as text.
6. **Graph QA:** test all known public names, aliases, link targets, backlinks, duplicate/ambiguous names, orphan documents and public-only filtering.

## Hard exclusions / cautions

- `core/*`, `gameplay/*`, and the bestiary rules file are not sources for duplicating formulas, progression, combat, appraisal, prices or travel mechanics.
- `players.md` and all six player profiles are private; exclude them from every public index.
- Keep concealed identities/relationships/whereabouts out of the graph (including Beiming Nerva, Beiming Jingheng's concealed connection, Ying Wuxin and hidden Azerion history).
- Golden Dragon officials is a legacy roster; do not infer active offices from it or merge the unresolved Badan Pengawasan ↔ Komite Auditor relationship.
- Compatibility modules for Frostveil, Hollowmoon, Ironroot, Silverpine, Stonegate and Azureflame must not become duplicate canonical regions.
- Unknown geography stays unknown; schematic lines are not surveyed roads.

## New AI — exact start order

1. Read `docs/PRODUCT_ROADMAP.md`, especially Workstream 1 and its Phase 1 checkpoint.
2. Read this matrix in full.
3. Read `docs/WORLD_ARCHIVE_CONTENT_MANIFEST.md` for detailed source findings.
4. Inspect the actual branch HEAD and working tree; the SHA above is only the pre-documentation baseline.
5. Verify the Universe source pin; refresh this matrix if `main` moved.
6. Inspect `src/lore/lore-library.ts`, its event handlers, types, tests and local asset bundling.
7. Continue the next unchecked roadmap task. Do not redo completed light-theme typography work. Do not modify the Universe repo unless explicitly asked.
8. Before claiming a build, verify exact versionName/versionCode, source SHA, workflow run, artifact, signature/alignment and emulator/device smoke result.

**Last known build reference (not a build of this Phase 1 documentation):** Android Build #300 used source SHA `956a0b1fa3b4f04ccca01f7fa7b1942b83bde770`, `versionCode=300`, `versionName=v.1.01.300-956`, package `com.antarezka.merzkava`. Artifact [merzkava-debug-apk](https://github.com/Antarezka/merzkava-apk/actions/runs/41298609571/artifacts/13080676292). APK compilation, package/version verification, alignment, signature verification and artifact upload passed; emulator install/smoke was interrupted by a system dialog taking focus. The user separately confirmed light-theme text readability on a physical device. This is the last known build baseline, not a build of the Phase 1 documentation commits.

## Phase 1 exit checklist

- [x] 140/140 source paths assigned a disposition.
- [x] Existing 39 dossiers and 35 source paths reconciled.
- [x] Stable-ID/public-only linking contract documented.
- [x] AI start order and build caveat recorded.
- [ ] Re-verify against current recursive Universe tree before expanding.
- [ ] Complete public entity links/backlinks and tests.
- [ ] Implement offline local source reader.
- [ ] Expand approved public coverage.
- [ ] Build and perform device navigation QA.

**Status:** Phase 1 source inventory + handoff baseline established. World Archive itself remains incomplete.


## Implementation checkpoint — clickable public entity graph (2026-11-01)

The existing catalogue derives each dossier's outbound `crossReferenceIds` from exact public titles and aliases mentioned in its summary/body. `loreLinks` turns those mentions into local `data-lore-open` buttons; targets are selected from `PUBLISHED` entries only. This pass adds `getLoreBacklinks(id)` and renders inbound **MENTIONED IN** dossier links. Regression tests cover outgoing clickable mentions, public-only targets, inbound links and invalid IDs.

- Runtime implementation: `src/lore/lore-library.ts`, commit `3dd0b21f32bdd383737da48d52248b96c623535a`.
- Regression tests: `tests/lore-library.test.ts`, commit `4ce04c872d39611b6fa782b8e2199f4157aa3b0f`.
- Tests are committed but have **not yet been executed** in CI or on-device; graph QA remains open.
- Source citation is still provenance text, not an in-app local source reader. The source reader remains a required task.


## Offline-game implementation checkpoint — HP foundation (2026-11-01)

- Canon source: `core/HP_SYSTEM.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6` (blob `efef616efa7ad9c44c81470da6dc52bddc813204`).
- Runtime module: `src/offline-game/mechanics/hp.ts`. It implements the official maximum-HP lookup table, Mortal/0, new-session and continuing-session bootstrap behavior, explicit death versus unresolved missing HP, and non-healing maximum updates.
- Regression tests: `tests/offline-game-hp.test.ts`.
- Validation: Web App Validation #565 passed on source commit `cfb2666d119843a6f7b479f4c430f91173a4bf50`; test and TypeScript/Vite build steps passed.
- No damage, recovery, injury, or combat formulas are implemented by this module. Those remain separate canon domains.
- This is **one implemented foundation module**, not a complete engine. Do not convert it into a whole-engine percentage before defining the full module inventory and dependencies. No APK build is implied by this validation result.


## Offline-game implementation checkpoint — Satiety/metabolism (2026-11-01)

- Canon source: `core/HUNGER_AND_METABOLISM.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6` (blob `66bdc7d4fe4d5270cf3c40193909aca582ac1dde`).
- Runtime module: `src/offline-game/mechanics/satiety.ts`. It implements awake-time drain, realm base rates, activity/missed-meal/body-condition multipliers, verified biological modifier, combined ×8 cap, internal precision, display rounding, and food intake.
- Regression tests: `tests/offline-game-satiety.test.ts` (9 tests).
- Validation: Web App Validation #572 passed on commit `deb8d403dfa93a5996668480b4e68d9de2e6c4b7`: 7 test files / 52 tests, TypeScript, gateway type-check, and Vite build all passed.
- **Canon discrepancy requiring upstream resolution:** the Spirit Primordial example for 24 hours of Light activity says ≈0.014 Satiety; the stated 365-day base and formula yield ≈0.342466. Code follows the explicit table/formula and surfaces a warning; no Universe source was changed.
- Calendar-window transitions, meal-opportunity tracking, protected-sleep transitions, and cross-system consequences are not yet implemented by this module.
- Current deterministic foundation: **5 modules implemented and CI-verified (HP + Satiety + Injury + Time/Day-left + Combat)**. This is not a whole-engine percentage or playable offline mode. No APK status is implied by Web App Validation.


## Offline-game implementation checkpoint — Injury recovery (2026-11-01)

- Canon source: `core/INJURY_SYSTEM.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6` (blob `a90d3d1c58afd3da171d66bc632b23e2a30cbbfd`).
- Runtime module: `src/offline-game/mechanics/injury.ts`; regression tests: `tests/offline-game-injury.test.ts` (5 tests).
- Implements Class I–IV baseline recovery rates proportionally per elapsed in-game hour; class III/IV prerequisites are enforced. No ungrounded diagnosis or numerical activity penalty is invented.
- Validation: Web App Validation #577 passed on commit `07bc36b05572b2f27abb41792ce4d243017ee1a2`: 8 test files / 57 tests, TypeScript, gateway type-check, and Vite build passed.
- Deterministic foundation is now **3 modules: HP, Satiety, Injury**. This is not a whole-engine percentage. Remaining domains and dependencies are not yet fully inventoried.
- Android Build #320 targets earlier commit `6310974` (HP + Satiety only); it is not evidence of an APK built from the latest Injury-inclusive source.


## Offline-game implementation checkpoint — Time and cooldown (2026-11-01)

- Canon source: `gameplay/TIME_AND_ACTION_RULES.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6` (blob `f4ad8b2e1afc0bc9ef25f8f9d97eb541ab7ea29f`).
- Runtime module: `src/offline-game/mechanics/time.ts`; regression tests: `tests/offline-game-time.test.ts` (9 tests).
- Implements 12×30 fallback calendar rollover, season lookup, 3-hour ordinary action cap, protected night-sleep exception, verified 30-day pure-cultivation gate including Satiety accounting, and cooldown accumulation excluding cultivation.
- Validation: Web App Validation #584 passed on commit `409d420feac225d7427e627769e77eb12a4ff1b6`: 9 test files / 66 tests, TypeScript, gateway type-check, and Vite build passed.
- Deterministic foundation is now **4 modules: HP, Satiety, Injury, Time/Day-left**. Not a whole-engine percentage; remaining formula domains/dependencies are not fully inventoried.
- Android Build #322 targets code commit `3e7d97a`; the test-fixture correction in `409d420` followed it. APK/emulator workflow status must be checked separately.


## Offline-game implementation checkpoint — Combat formulas (2026-11-01)

- Canon source: `gameplay/COMBAT_SYSTEM.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6` (blob `bc7d85a0e3521c30716b1859f5fdf070417d684c`).
- Runtime module: `src/offline-game/mechanics/combat.ts`; regression tests: `tests/offline-game-combat.test.ts` (10 tests).
- Implements Combat Rating, ratio, hit chance and d100, power adjustment, damage classes, defense, rounding, current HP cap, and default combo follow-up.
- Validation: Web App Validation #592 passed on commit `44640bad2006e02f739f81b4763b87dac3fe583d`: 10 test files / 76 tests, TypeScript, gateway type-check, and Vite build passed.
- Positive-ratio hit chance never reaches the written 10% lower clamp; formula approaches 25% as ratio approaches zero. Exact official clamp remains unchanged.
- Deterministic foundation is now **5 modules: HP, Satiety, Injury, Time/Day-left, Combat**. Not a whole-engine percentage; remaining domains and dependencies are not fully inventoried.
- Android Build #324 is separate and still running; its APK/emulator result must be checked independently.
