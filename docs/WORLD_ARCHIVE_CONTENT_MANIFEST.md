# World Archive — Content Manifest & Audit Gate

> Status: inventory baseline; not a publication approval. Generated from the current repository trees and the APK's local lore catalogue.

> **LATEST HANDOFF (2026-11-01):** Current measured Archive coverage is **87 curated dossiers / 71 unique approved player-facing Universe source paths**, plus **3 explicit `ON_PLAN` placeholders**. All 71/71 approved player-facing paths resolve to a curated dossier or an intentional non-revealing placeholder (**100% path coverage**, not claim/UI/device completeness). The full 140-file Markdown inventory has a reported 72/140 (51.4%) source-path footprint when the legacy Beiming redirect is included; remaining paths are deliberately classified outside player-facing lore. The offline reader opens reviewed public-safe extracts and does not bundle raw canonical Markdown. Web App Validation #653 passed 15 test files / 133 tests, TypeScript, gateway type-check, and Vite build. Latest documented Android Build #340 produced and verified an APK artifact, but its Android 14 emulator step was cancelled; installation/smoke success is not claimed. Use the roadmap and coverage matrix as current work instructions; older audit notes remain historical.

## Source snapshots

- Universe repository: `Antarezka/merzkava-universe`
- Universe branch: `main`
- Universe commit: `2f76a864150528afb0e3d26cb16f9396ce610ff6`
- APK repository: `Antarezka/merzkava-apk`
- APK branch: `feature/archive-experience`
- APK lore catalogue path: `src/lore/lore-library.ts`
- APK lore catalogue blob SHA: `7067dfcc1d874a5bc4fbcd45da46ba886a3ab3ce`
- Current curated local dossiers: **87**
- Explicit entity placeholders: **3 (`ON_PLAN`)**
- Offline source reader: **reviewed public-safe extracts bundled in the app code; raw source Markdown is not bundled**
- Coverage includes reviewed regional, institutional, social, route, economic, and NPC public extracts; 24 claim-reviewed NPC public profiles are represented without exposing private or GM-only facts.
- Unique approved player-facing source paths: **71**
- Missing local source paths in Universe tree: **0**
- Universe Markdown inventory: **140 files**

## Non-negotiable publication rules

1. The Archive is an offline reading/reference layer, not gameplay authority. Gameplay mechanics, calculations, eligibility, combat, time/action rules, cultivation, Spirit Soul, Spirit Ring and appraisal remain governed by the current Universe repository modules.
2. No content is published merely because it exists in a Markdown file. Read the source, its linked registry/index, and its access restrictions before writing a player-facing summary.
3. Never expose GM-only identity, secret affiliations, hidden agendas, undiscovered whereabouts, concealed criminal ties, restricted event outcomes, or unrevealed facts.
4. Player profiles, session state, wallet, inventory, private notes and other personal gameplay data are excluded from the public Archive.
5. Every article must retain canonical source path, source commit, last-reviewed date, visibility class, and cross-reference IDs.
6. Unknown or conflicting facts stay marked unknown/conflicted. No gap-filling, invented settlements, invented NPCs, guessed distances, or unsupported chronology.
7. Entity links must resolve to an in-app document ID. A source path displayed as plain text is not a working document link.
8. Search/highlighting must use a central entity index, not only the aliases of the currently visible 32 dossiers. Ambiguous names must not link to the wrong entity.

## Visibility classes

| Class | Meaning | Player Archive policy |
|---|---|---|
| `PUBLISHED` | Explicitly public/world-known canon | May publish after source review and neutral rewrite |
| `GM_ONLY` | Secrets, hidden identity/agenda, restricted whereabouts, unrevealed facts | Never show in player Archive; keep out of public search index |
| `MECHANICS_REFERENCE` | Gameplay rules and numerical/mechanical authority | Do not duplicate as lore; link to authority only in GM/developer context if needed |
| `PRIVATE_PLAYER_DATA` | Player profile, save, session, personal ledger or notes | Never include in public Archive |
| `REVIEW_REQUIRED` | Access scope or factual status not yet fully established | Block publication until manually reviewed |
| `LEGACY_OR_COMPATIBILITY` | Deprecated, superseded, or compatibility pointer | Do not publish as independent canon; resolve to current source |

## Initial APK catalogue audit — historical 26-dossier baseline (superseded)

| Local ID | Local title | Source path | Initial disposition |
|---|---|---|---|
| `world-atlas` | Merzkava Universe | `world/WORLD.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `golden-dragon` | Golden Dragon Empire | `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `tianhai` | Tianhai Yunzhou | `world/REGION_TIANHAI_YUNZHOU.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `beiming` | Beiming Gu | `world/REGION_BEIMING_GU.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `lawless` | Lawless Territories | `world/LAWLESS_TERRITORIES.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `seas` | Seas & Passageways | `world/MAP_AND_REGIONS.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `history` | A History with Missing Pages | `world/HISTORY.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `peoples` | Peoples of Merzkava | `world/INTELLIGENT_PEOPLES.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `factions` | Organizations & Factions | `world/FACTIONS.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `ruined-archiver` | Ruined Archiver | `world/RUINED_ARCHIVER.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `medicine-hall` | Medicine Hall Society | `world/FACTIONS.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `artifacts` | Artifacts & Relics | `world/ARTIFACTS_AND_RELICS.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `spirit-beasts` | The Beasts Beyond the Cities | `bestiary/SPIRIT_BEAST_RULES.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `arcanistry` | Arcanistry & the Art of Making | `world/HISTORY.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `jun-haotian` | Jun Haotian | `regions/golden-dragon-empire/npcs/JUN_HAOTIAN.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `shen-yuehua` | Shen Yuehua | `regions/golden-dragon-empire/npcs/SHEN_YUEHUA.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `jun-ruiyuan` | Jun Ruiyuan | `regions/golden-dragon-empire/npcs/JUN_RUIYUAN.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `jun-yuejin` | Jun Yuejin | `regions/golden-dragon-empire/npcs/JUN_YUEJIN.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `ji-haoyuan` | Ji Haoyuan | `regions/tianhai-yunzhou/npcs/JI_HAOYUAN.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `bai-xuanyin` | Bai Xuanyin | `regions/tianhai-yunzhou/npcs/BAI_XUANYIN.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `ji-zhaoning` | Ji Zhaoning | `regions/tianhai-yunzhou/npcs/JI_ZHAONING.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `ji-ningzhao` | Ji Ningzhao | `regions/tianhai-yunzhou/npcs/JI_NINGZHAO.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `beiming-han` | Beiming Han | `regions/beiming-gu/npcs/BEIMING_HAN.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `beiming-xenhwa` | Beiming Xenhwa | `regions/beiming-gu/npcs/BEIMING_XENHWA.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `floating-island-artifact` | Floating Island Support System | `world/ARTIFICIAL_ARTIFACTS.md` | REVIEW_REQUIRED — content/access review and local document route required |
| `world-knowledge-tower` | World Knowledge Tower | `world/RUINED_ARCHIVER.md` | REVIEW_REQUIRED — content/access review and local document route required |

### Coverage integrity

- All currently referenced source paths exist in the current Universe tree: **yes**.
- Source paths referenced by that historical 26-dossier baseline:
  - `bestiary/SPIRIT_BEAST_RULES.md`
  - `regions/beiming-gu/npcs/BEIMING_HAN.md`
  - `regions/beiming-gu/npcs/BEIMING_XENHWA.md`
  - `regions/golden-dragon-empire/npcs/JUN_HAOTIAN.md`
  - `regions/golden-dragon-empire/npcs/JUN_RUIYUAN.md`
  - `regions/golden-dragon-empire/npcs/JUN_YUEJIN.md`
  - `regions/golden-dragon-empire/npcs/SHEN_YUEHUA.md`
  - `regions/tianhai-yunzhou/npcs/BAI_XUANYIN.md`
  - `regions/tianhai-yunzhou/npcs/JI_HAOYUAN.md`
  - `regions/tianhai-yunzhou/npcs/JI_NINGZHAO.md`
  - `regions/tianhai-yunzhou/npcs/JI_ZHAONING.md`
  - `world/ARTIFACTS_AND_RELICS.md`
  - `world/ARTIFICIAL_ARTIFACTS.md`
  - `world/FACTIONS.md`
  - `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md`
  - `world/HISTORY.md`
  - `world/INTELLIGENT_PEOPLES.md`
  - `world/LAWLESS_TERRITORIES.md`
  - `world/MAP_AND_REGIONS.md`
  - `world/REGION_BEIMING_GU.md`
  - `world/REGION_TIANHAI_YUNZHOU.md`
  - `world/RUINED_ARCHIVER.md`
  - `world/WORLD.md`

## Full repository Markdown inventory

Inventory is exhaustive for `.md` files visible in the recursive Git tree at the source commit above. Listing a file does **not** mean its contents have been fully reviewed or approved for publication.

### root (6)
- `INDEX.md` — REVIEW_REQUIRED (world source; visibility review required)
- `NIGHTLY_VERSION.md` — REVIEW_REQUIRED (world source; visibility review required)
- `README.md` — REVIEW_REQUIRED (world source; visibility review required)
- `SAFE_VERSION.md` — REVIEW_REQUIRED (world source; visibility review required)
- `STABLE_VERSION.md` — REVIEW_REQUIRED (world source; visibility review required)
- `players.md` — PRIVATE_PLAYER_DATA
### bestiary (1)
- `bestiary/SPIRIT_BEAST_RULES.md` — MECHANICS_REFERENCE
### core (12)
- `core/10_ECONOMY_SYSTEM.md` — MECHANICS_REFERENCE
- `core/ARCANISTRY_AND_FORMULATION.md` — MECHANICS_REFERENCE
- `core/CULTIVATION_SYSTEM.md` — MECHANICS_REFERENCE
- `core/CULTIVATOR_ACADEMIES.md` — MECHANICS_REFERENCE
- `core/HP_SYSTEM.md` — MECHANICS_REFERENCE
- `core/HUNGER_AND_METABOLISM.md` — MECHANICS_REFERENCE
- `core/INJURY_SYSTEM.md` — MECHANICS_REFERENCE
- `core/MARTIAL_SOUL.md` — MECHANICS_REFERENCE
- `core/MARTIAL_SOUL_AWAKENING.md` — MECHANICS_REFERENCE
- `core/SPIRIT_REALM_TRADITIONS.md` — MECHANICS_REFERENCE
- `core/SPIRIT_RING_RULES.md` — MECHANICS_REFERENCE
- `core/TIER_ASSESSMENT_AND_APPRAISAL.md` — MECHANICS_REFERENCE
### gameplay (3)
- `gameplay/COMBAT_SYSTEM.md` — MECHANICS_REFERENCE
- `gameplay/TIME_AND_ACTION_RULES.md` — MECHANICS_REFERENCE
- `gameplay/TRAVEL_ENCOUNTER_AMBUSH_RESCUE.md` — MECHANICS_REFERENCE
### players (6)
- `players/Elliot.md` — PRIVATE_PLAYER_DATA
- `players/Ilya.md` — PRIVATE_PLAYER_DATA
- `players/Luca.md` — PRIVATE_PLAYER_DATA
- `players/Nafila.md` — PRIVATE_PLAYER_DATA
- `players/Xin Hwa.md` — PRIVATE_PLAYER_DATA
- `players/Yuha.md` — PRIVATE_PLAYER_DATA
### regions (42)
- `regions/beiming-gu/INDEX.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/BEIMING_HAN.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/BEIMING_JINGHENG.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/BEIMING_NERVA.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/BEIMING_XENHWA.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/BEIMING_XUANYU.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/BINGHE_CHUANLIU.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/BLUE_FLAME_DOJO_MASTER.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/CANGXUE_BEIRAN.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/CANGXUE_TIELAN.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/FROSTPEAK_DOJO_MASTER.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/HANYUE_MINGZHAO.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/IRONROOT_DOJO_MASTER.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/LINGFENG_YUJIN.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/MINGHU_YANSHU.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/REGISTRY.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/SILENT_SNOW_DOJO_MASTER.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/SILVER_TIGER_DOJO_MASTER.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/TIESHI_BEIYUE.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/XUANBING_LINGSU.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/XUANBING_YUE.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/XUANSONG_QINGHE.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/XUANYE_ZHENBEI.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/YAOCHI_SUWEN.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/beiming-gu/npcs/YINSHAN_QIAOFENG.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/golden-dragon-empire/INDEX.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/golden-dragon-empire/npcs/JUN_HAOTIAN.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/golden-dragon-empire/npcs/JUN_RUIYUAN.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/golden-dragon-empire/npcs/JUN_YUEJIN.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/golden-dragon-empire/npcs/LUO_ZHENKAI.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/golden-dragon-empire/npcs/REGISTRY.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/golden-dragon-empire/npcs/SHEN_YUEHUA.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/golden-dragon-empire/npcs/SHEN_YUNTING.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/tianhai-yunzhou/INDEX.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/tianhai-yunzhou/npcs/BAI_XUANYIN.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/tianhai-yunzhou/npcs/DUAN_HAICHENG.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/tianhai-yunzhou/npcs/JI_HAOYUAN.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/tianhai-yunzhou/npcs/JI_NINGZHAO.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/tianhai-yunzhou/npcs/JI_ZHAONING.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/tianhai-yunzhou/npcs/LIN_QIAOYU.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/tianhai-yunzhou/npcs/POWER_STRUCTURE.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
- `regions/tianhai-yunzhou/npcs/REGISTRY.md` — REVIEW_REQUIRED (regional source; NPC secrecy review required)
### templates (9)
- `templates/ANTI_CHEAT_HARD_GATE.md` — REVIEW_REQUIRED (GM/template reference)
- `templates/AUTHORITY_ORDER.md` — REVIEW_REQUIRED (GM/template reference)
- `templates/CHARACTER_PROFILE_TEMPLATE.md` — REVIEW_REQUIRED (GM/template reference)
- `templates/GAMEPLAY_RESPONSE_TEMPLATE.md` — REVIEW_REQUIRED (GM/template reference)
- `templates/NARRATIVE_DYNAMICS.md` — REVIEW_REQUIRED (GM/template reference)
- `templates/NPC_PROFILE_TEMPLATE.md` — REVIEW_REQUIRED (GM/template reference)
- `templates/PLAYER_CONVERSATION_TEMPLATE.md` — REVIEW_REQUIRED (GM/template reference)
- `templates/REGIONAL_MODULE_TEMPLATE.md` — REVIEW_REQUIRED (GM/template reference)
- `templates/WORLD_EVENT_UPDATE_TEMPLATE.md` — REVIEW_REQUIRED (GM/template reference)
### world (61)
- `world/ANCIENT_SHAMANISM_AND_BUDDHIST_CLANS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/ARTIFACTS_AND_RELICS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/ARTIFICIAL_ARTIFACTS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/CANON_DECISIONS_AND_PRECEDENCE.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/CANON_LOAD_ROUTER.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/DYNAMIC_EVENTS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/FACTIONS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/GEOGRAPHY_AND_TRAVEL.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/GOLDEN_DRAGON_EMPIRE_POPULATION_SERVICES.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/HISTORY.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/IMPERIAL_SPECIAL_FINANCIAL_AUDIT_COMMITTEE.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/INTELLIGENT_PEOPLES.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/LAWLESS_SOUTHERN_PORT_AND_ISLES.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/LAWLESS_TERRITORIES.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/LOCATION_AND_ROUTE_NETWORK.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/MAP_AND_REGIONS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/NPC_BAI_XUANYIN.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/NPC_JI_HAOYUAN.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/NPC_JI_NINGZHAO.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/NPC_JI_ZHAONING.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/NPC_JUN_HAOTIAN.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/NPC_JUN_RUIYUAN.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/NPC_JUN_YUEJIN.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/NPC_MANAGEMENT.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/NPC_SHEN_YUEHUA.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/NPC_TIANHAI_POWER_STRUCTURE.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/NPC_YING_WUXIN.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/OPEN_LEARNING_PATHS_AND_WANDERING_INSTRUCTORS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/PRISON_AND_BOUND_ITEMS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGIONAL_REPOSITORY_ARCHITECTURE.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_ASHEN_BORDERLANDS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_AZUREFLAME_BASIN.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_BAIYUE.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_BEIMING_GU.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_BEIMING_HEARTLAND.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_BLACK_TIDE_EXPANSE.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_CANGLAN.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_FROSTVEIL_RANGE.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_HOLLOWMOON_VALLEY.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_IRONROOT_REACH.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_JINYUE.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_LONGYUAN.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_NINE_FROST_WASTES.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_SILVERPINE_WILDS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_STONEGATE_MARCH.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_TIANFENG.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_TIANHAI_YUNZHOU.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_XINGLUO.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/REGION_YANLING.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/RUINED_ARCHIVER.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/SOCIAL_STRATIFICATION.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/SPIRIT_HUNTERS_GUILD.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/THREE_POWER_PERSPECTIVE_MAPS.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/WANLUO_SACRED_EXPANSE.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/WEALTH_DISTRIBUTION.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/WORLD.md` — REVIEW_REQUIRED (world source; visibility review required)
- `world/WORLD_NAVIGATION_TREE.md` — REVIEW_REQUIRED (world source; visibility review required)

## Known high-risk review points

- Regional NPC registries are not equivalent to public character biographies. Beiming Gu's regional index states 23 canonical profiles: six established major/youth-circle profiles plus 12 clan heads and five dojo masters. Each profile requires an individual public/GM split review.
- Golden Dragon Empire and Tianhai Yunzhou registries include restricted or GM-sensitive references. In particular, hidden identities and recurring visitors/disguises must not enter player search/highlighting before discovery.
- `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md` is a roster source, not a ready-made set of public character dossiers. Deduplicate, distinguish office/role from named NPC identity, and review exposure before creating cards.
- `world/ARTIFICIAL_ARTIFACTS.md`, `world/ARTIFACTS_AND_RELICS.md`, and `world/PRISON_AND_BOUND_ITEMS.md` require item-by-item visibility and knowledge-level checks.
- `bestiary/SPIRIT_BEAST_RULES.md`, `core/*`, and `gameplay/*` are not sources for player-facing mechanics summaries. Descriptive beast lore may be authored only from a separately reviewed descriptive source, without importing numerical rules.
- Compatibility pointers and consolidated regional sources must be resolved before article generation; do not publish both as competing canon.

## Required in-app implementation gates

- [ ] Source reader: every cited source/document opens inside the APK from its local article.
- [ ] Entity index: canonical IDs, aliases, entity type, visibility class, and related document IDs.
- [ ] Cross-reference resolver: every clickable entity points to a valid local document ID; unresolved/ambiguous names remain plain text.
- [ ] Visibility filter: `GM_ONLY` and `PRIVATE_PLAYER_DATA` excluded from player search, suggestions, backlinks and rendered content—not merely hidden visually.
- [ ] Provenance: each local article stores source path, source commit SHA, and review status.
- [ ] Offline integrity: no runtime network dependency for reading; all linked documents included in the APK asset bundle.
- [ ] Link integrity test: verify every internal document ID and every cross-reference target.
- [ ] Content integrity test: verify source existence, duplicate IDs, duplicate aliases, orphaned docs, and conflicting canon.

## Completion definition

The World Archive is not complete until every source in scope has a reviewed disposition, every approved public entity/article has a local document, every restricted source has a documented exclusion/split, and all internal links pass validation. The current 32-dossier / 28-source catalogue is a starter set, not complete coverage. See `docs/WORLD_ARCHIVE_COVERAGE_MATRIX.md` for the full 140-path disposition and AI handoff.

## Audit limitation

This manifest records a verified tree inventory and the current local catalogue/source-path coverage. It does not claim that all 140 source Markdown documents have been line-by-line content-reviewed or that every candidate fact is public. Those reviews must be recorded before publication.

## Content-review findings — first strict pass

**Review basis:** targeted full-file reads of the following world modules, plus the opening identity/access sections of the first ten Beiming Gu NPC profiles. This is a first pass, not a declaration that all source content is approved.

### World modules reviewed in this pass

| Source | Initial disposition | Reason / handling |
|---|---|---|
| `world/ANCIENT_SHAMANISM_AND_BUDDHIST_CLANS.md` | `REVIEW_REQUIRED` + restricted split | Explicit hidden-group identity/secrecy; public-facing material must not expose concealed group identity or restricted hierarchy. |
| `world/ARTIFACTS_AND_RELICS.md` | `PUBLISHED` candidate + item-level review | Lore/provenance catalog; production and appraisal mechanics must remain out of local authority. Unknown inventory entries remain unknown. |
| `world/ARTIFICIAL_ARTIFACTS.md` | `PUBLISHED` candidate + item-level review | Known artifact catalog can be rewritten as descriptive dossiers; production requirements and condition scoring are mechanics references only. |
| `world/CANON_DECISIONS_AND_PRECEDENCE.md` | `MECHANICS_REFERENCE` / GM continuity only | Binding decisions and hidden continuity safeguards are not a player-facing lore article. Extract only facts independently established as public elsewhere. |
| `world/CANON_LOAD_ROUTER.md` | `MECHANICS_REFERENCE` | GM loading/navigation instructions, not an in-world article. |
| `world/DYNAMIC_EVENTS.md` | `GM_ONLY` / `REVIEW_REQUIRED` per event | Persistent event registry and operating workflow; event visibility depends on event status and player discovery. |
| `world/FACTIONS.md` | `REVIEW_REQUIRED` with faction-by-faction split | Contains public institutions alongside restricted groups and doctrine classifications. Do not publish the file wholesale. |
| `world/GEOGRAPHY_AND_TRAVEL.md` | `PUBLISHED` candidate + route caution | Geographic descriptions may be published; exact route access, hidden sites, travel rules and unconfirmed edges need separate review. |
| `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md` | `PUBLISHED` candidate | Canonical public administrative framework; estimates must retain their estimated/planning-model labels. |
| `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md` | `PUBLISHED` candidate + officeholder split | General public governance may be summarized; restricted officials, duties and undisclosed appointments require filtering. |
| `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md` | `REVIEW_REQUIRED` / roster not bulk-publishable | Large named political roster; deduplicate and classify individual officeholders, dispositions and access before creating profiles. |
| `world/GOLDEN_DRAGON_EMPIRE_POPULATION_SERVICES.md` | `PUBLISHED` candidate + access split | Public service networks and visitor access can be summarized; institutional restrictions and mechanics must be excluded. |
| `world/HISTORY.md` | `PUBLISHED` candidate + claim-level certainty | Publish only confirmed history; preserve unknown dates, hypotheses and unresolved evidence as unknown. |
| `world/IMPERIAL_SPECIAL_FINANCIAL_AUDIT_COMMITTEE.md` | `REVIEW_REQUIRED` | Institution is established, but its personnel and unresolved family case require controlled, claim-level visibility review. |
| `world/INTELLIGENT_PEOPLES.md` | `PUBLISHED` candidate | Public cultural overview; do not infer abilities, lifespans, weaknesses, or individual identity from appearance. |
| `world/LAWLESS_SOUTHERN_PORT_AND_ISLES.md` | `PUBLISHED` candidate + venue sensitivity | Geographic and public leisure functions may be described neutrally; avoid presenting illegal services as public amenities or inventing access/safety. |
| `world/LAWLESS_TERRITORIES.md` | `REVIEW_REQUIRED` with restricted split | Includes underground organizations, concealed authority and restricted continuity. Public-facing overview only after section-level filtering. |
| `world/LOCATION_AND_ROUTE_NETWORK.md` | `MECHANICS_REFERENCE` / GM navigation | Route graph and hidden Inner Azerion location are not a general player-facing map. Publish only discovered, approved route facts from descriptive regional sources. |
| `world/MAP_AND_REGIONS.md` | `PUBLISHED` candidate + compatibility split | Useful public map overview, but must defer to consolidated regional sources and preserve unconfirmed geography. |
| `world/NPC_BAI_XUANYIN.md`, `NPC_JI_HAOYUAN.md`, `NPC_JI_NINGZHAO.md`, `NPC_JI_ZHAONING.md`, `NPC_JUN_HAOTIAN.md`, `NPC_JUN_RUIYUAN.md`, `NPC_JUN_YUEJIN.md`, `NPC_SHEN_YUEHUA.md`, `NPC_TIANHAI_POWER_STRUCTURE.md` | `LEGACY_OR_COMPATIBILITY` | These are moved-path pointers. The canonical regional profiles are the only sources to review or publish. |
| `world/NPC_MANAGEMENT.md` | `MECHANICS_REFERENCE` / GM-only guidance | NPC continuity, knowledge and disclosure operating rules; not a public dossier. |
| `world/NPC_YING_WUXIN.md` | `GM_ONLY` | Profile explicitly contains a concealed identity and restricted criminal leadership. Do not include the file or its secret aliases in player search/highlighting. |
| `world/OPEN_LEARNING_PATHS_AND_WANDERING_INSTRUCTORS.md` | `MECHANICS_REFERENCE` + public institutional excerpts | Contains progression/teaching access rules and GM encounter procedure; do not duplicate as player-facing mechanics. |
| `world/PRISON_AND_BOUND_ITEMS.md` | `REVIEW_REQUIRED` | Includes coercive restraints, abuse, custody and restricted uses. Any item entry needs separate public knowledge and sensitivity review. |
| `world/REGIONAL_REPOSITORY_ARCHITECTURE.md` | `MECHANICS_REFERENCE` | Repository organization guidance, not in-world lore. |
| `world/REGION_ASHEN_BORDERLANDS.md` | `REVIEW_REQUIRED` | Explicitly partially developed; preserve confirmed facts and do not fill missing settlements, institutions or routes. |
| `world/REGION_AZUREFLAME_BASIN.md`, `world/REGION_BEIMING_HEARTLAND.md` | `LEGACY_OR_COMPATIBILITY` | Compatibility pointers; canonical source is consolidated `world/REGION_BEIMING_GU.md`. |
| `world/REGION_BAIYUE.md`, `world/REGION_CANGLAN.md` | `PUBLISHED` candidate + local completeness review | Regional modules contain established public locations/services alongside unconfirmed fields. Keep estimates and unknowns labelled. |
| `world/REGION_BEIMING_GU.md` | `PUBLISHED` candidate + restricted split | Consolidated regional source for all seven districts; contains GM constraints and NPC references that must not be copied wholesale. |
| `world/REGION_BLACK_TIDE_EXPANSE.md` | `REVIEW_REQUIRED` with `GM_ONLY` split | Partially developed region with explicit concealed authority and restricted identity section. |
| `world/REGION_CANGLAN.md` | `PUBLISHED` candidate + local completeness review | Established regional descriptions; do not convert estimated area/density into surveyed fact. |

### NPC profile access review — first Beiming Gu batch

The first ten profiles under `regions/beiming-gu/npcs/` were opened. The initial identity blocks establish public-facing names/roles for some individuals, but full profiles may contain private motives, undisclosed abilities, relationships or GM-only knowledge. Therefore **none of these profiles is approved for wholesale publication**.

- `BEIMING_HAN.md`: public title/name can be considered; exact age and residence intentionally unknown. Review remaining profile for disclosure limits.
- `BEIMING_JINGHENG.md`: public identity/age/family may be selectively usable; concealed criminal connection is GM-sensitive.
- `BEIMING_NERVA.md`: high-risk. Identity is GM-sensitive in the regional registry; recurring visits/disguise and true identity must not appear in public archive/search until discovered in-world.
- `BEIMING_XENHWA.md`: identity and public description may be usable; review remaining profile for restricted details.
- `BEIMING_XUANYU.md`, `BINGHE_CHUANLIU.md`, `BLUE_FLAME_DOJO_MASTER.md`, `CANGXUE_TIELAN.md`, `FROSTPEAK_DOJO_MASTER.md`: named clan/dojo officeholders may be listed as public institutional facts only after complete profile review; do not expose private profile fields by default.
- `CANGXUE_BEIRAN.md`: youth-circle NPC; public identity may be usable, but personal profile fields require a selective public summary.

### Concrete implementation consequence

The existing local catalogue is not safe to expose as a complete player-facing index without a visibility-aware entity registry. In particular, aliases such as concealed faction names or GM-sensitive NPC identities must be omitted from player search, suggestions, automatic highlighting and backlinks—not merely hidden in the article body.

### Review progress

- Repository tree inventory: complete for the recorded source commit.
- World module content review: partial; first 30 world Markdown files examined at source level, with detailed dispositions recorded above for the files reviewed.
- Regional module review: not yet complete.
- All regional NPC profiles: not yet complete; first ten Beiming Gu profiles have initial identity/access review only.
- Full 140-file line-by-line approval: **not complete**.
- Player-facing publication approval: **not granted by this audit pass**.


## Regional NPC audit — second pass

**Audit source snapshot:** `Antarezka/merzkava-universe` commit `2f76a864150528afb0e3d26cb16f9396ce610ff6`. This pass reviewed the complete Beiming Gu NPC registry and all remaining Beiming Gu canonical profiles, the Golden Dragon Empire registry and its six canonical profile files, and the Tianhai Yunzhou registry, power-structure roster, regional index, and six canonical profile files. This is a content/access review, not publication approval.

### Beiming Gu — registry and 23-profile roster

- The registry confirms 23 entries: four major/adoptive-family figures, two youth-circle figures, twelve clan heads, and five dojo masters. It explicitly warns that circle ties do not prove a prior physical meeting, and that visits/disguises must not be confused with residence or official membership.
- **Beiming Nerva — `GM_ONLY` identity.** The registry itself contains her true family identity, Spirit Realm/Arcanist Grade, Martial Soul, recurring Tianhai visits, and student disguise at Beichen Cultivator Academy. The Tianhai registry independently repeats those details. Do not ingest either registry row into player-facing search, autocomplete, backlinks, related-entity suggestions, or public profile metadata. A public-facing entity may only be created after an in-world discovery record authorizes the revealed identity; do not expose her cover pattern in advance.
- **Beiming Jingheng — split visibility.** Public identity and adoptive-family role may be considered separately, but the registry explicitly marks a concealed criminal connection GM-sensitive. Never import that connection, associated aliases, or relationship clues into public search metadata.
- **Beiming Han — review required.** Public title/name may be usable; exact age and whereabouts are intentionally unknown. Do not infer current presence or a district residence.
- **Beiming Xenhwa — review required.** Public identity and broad description may be usable; avoid importing private profile fields without a complete claim-level pass.
- **Youth-circle profiles — selective publication only.** Xuanbing Yue and Cangxue Beiran include baseline relationships. Those are relationship facts, not proof that the characters have met in person. Xuanbing Yue's age (16) and human identity are explicit, but her appearance, cultivation, Martial Soul, Arcanist Grade, and dojo affiliation are unestablished.
- **Clan-head and dojo-master profiles — selective public institutional facts only.** The reviewed roster profiles establish names, roles, broad public personalities, Martial Souls and specialties. Exact residences, district locations, current presence, named techniques, Spirit Rings, and private relationships are generally unestablished. Do not create those details. Spirit Realm, Stage, Arcanist Grade, and other progression/capability numbers are mechanics-linked data and must not be duplicated as an Archive authority.
- The remaining Beiming profiles reviewed in this pass: Hanyue Mingzhao, Tie Song, Lingfeng Yujin, Minghu Yanshu, Mo Xueyan, Bai Yushen, Tieshi Beiyue, Xuanbing Lingsu, Xuansong Qinghe, Xuanye Zhenbei, Yaochi Suwen, and Yinshan Qiaofeng. No profile is approved for wholesale publication.

### Golden Dragon Empire — registry and six profile files

- The registry identifies the imperial family, youth-circle figures, and an additional public-facing business identity with a concealed criminal identity.
- **Ying Wuxin — split visibility, concealed identity `GM_ONLY`.** The public role as an elite clothing-pavilion owner may be considered only as a separate public claim if supported by a player-facing source. The concealed criminal identity, leadership, aliases, and links to `world/NPC_YING_WUXIN.md` must not enter player search, automatic highlighting, backlinks, suggestions, or public graph metadata.
- Jun Haotian, Shen Yuehua, Jun Ruiyuan, and Jun Yuejin have explicit public imperial titles and family relationships. Their unspecified appearance/personality/motives must remain unknown. The source profiles contain Martial Soul and cultivation/capability fields; do not copy numerical progression or combat data into the Archive as a parallel rules source.
- Shen Yunting and Luo Zhenkai are owner-approved youth-circle additions. Their profiles establish broad public personalities and baseline circle relationships, but a circle relationship does not prove a prior meeting, current physical presence, exact academy, shop, guild, or institutional appointment.
- The official roster in `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md` remains a separate high-volume source requiring deduplication and individual claim review; this NPC registry is not a complete census.

### Tianhai Yunzhou — registry, profiles, and power structure

- The regional index confirms canonical navigation through the regional module, NPC registry, and officeholder roster. The six reviewed canonical profile files are Ji Haoyuan, Bai Xuanyin, Ji Zhaoning, Ji Ningzhao, Lin Qiaoyu, and Duan Haicheng.
- **Beiming Nerva — `GM_ONLY` identity and cover behavior.** The Tianhai registry directly exposes her true identity and student-disguise pattern. Exclude the entire Nerva entry from player-facing datasets until discovery; do not even use her true name as an automatic highlight or backlink.
- Ji Haoyuan's profile contains a detailed GM-sensitive account of his World Knowledge Tower service and absence during the Great Tianhai War. The public Archive may describe only separately established historical facts about the war and his public role; do not expose private timing, reactions, or sensitive service details without an explicit public source.
- Bai Xuanyin's broad historical legacy and public remembrance may be considered for a historical article. Artifact design framework details, mass-produced concealment device operation, and wartime deployment details require separate claim-level review; do not turn them into technical instructions or mechanics.
- Ji Zhaoning and Ji Ningzhao have public family roles and limited established biographical facts. Their current whereabouts, private response to their mother's death, personal goals, and unrecorded capabilities remain unknown.
- Lin Qiaoyu and Duan Haicheng are youth-circle profiles. Their interests and baseline rivalry are recorded, but their institution, current location, formal grade/certification, and any actual prior meeting remain unestablished.
- `POWER_STRUCTURE.md` is an owner-approved institutional roster, not a set of complete biographies and not a census. It contains named public officeholders, authority boundaries, capability/progression fields, anonymous placeholders for rare Grade 8+ roles, and explicit rules against inferring secret alliances or personal motives. It may support a carefully filtered public institution directory, but must not be imported wholesale. Omit anonymous placeholders as named entities; do not invent identities for them. Do not duplicate Arcanist Grade, Spirit Realm, Stage, or combat/progression mechanics into Archive articles.
- The roster explicitly says the Tianji Core liaison is not its maker, owner, or sole operator; the exact access rules and operators remain governed by separate artifact/security canon. Do not imply access or control from the office title.
- Tianhai officeholder names and public remit may be indexed only after checking their corresponding institution/region source and confirming there is no restricted claim attached. A roster listing alone does not establish current physical presence.

### Cross-regional implementation gates added by this pass

1. Entity visibility must be claim-level, not only document-level. A single profile or registry can contain both public and GM-only claims.
2. Search/highlighting/backlinks/suggestions must be generated from the approved public entity index only. Filtering article text at render time is insufficient.
3. Separate a public name/role claim from hidden aliases, true identity, cover identity, criminal connection, secret affiliation, private whereabouts, and GM continuity.
4. NPC baseline relationships must carry a clear “relationship established; prior meeting not implied” distinction where the source says so.
5. Current presence, residence, office, visit location, and cover location are distinct fields. Never collapse them into one map pin or location label.
6. Do not treat a registry as a census or a power-structure table as a complete biography.
7. Numerical progression and capability mechanics remain linked to the Universe canon; do not replicate them as local Archive rules or authoritative derived stats.

### Updated review progress

- Repository tree inventory: complete for source commit `2f76a864150528afb0e3d26cb16f9396ce610ff6`.
- First-pass world module review: partial; detailed dispositions for the first 30 world Markdown sources are recorded above.
- Beiming Gu NPC registry and all 23 listed profile paths: registry reviewed; first ten profiles received initial access review in the prior pass; remaining profile files reviewed in this pass. No wholesale publication approval.
- Golden Dragon Empire NPC registry and six canonical profile files: reviewed; concealed identity split recorded. The large civil officials roster remains a separate unreviewed source.
- Tianhai Yunzhou NPC registry, six canonical profile files, regional index, and power-structure roster: reviewed. The power-structure source is a roster-level review, not a complete individual biography audit of every listed officeholder.
- Remaining regional modules and other regional NPC registries/profiles: not yet fully reviewed.
- Full 140-file line-by-line approval: **not complete**.
- Player-facing publication approval: **not granted by this audit pass**.


## Regional module audit — third pass

**Source snapshot:** Universe `2f76a864150528afb0e3d26cb16f9396ce610ff6`. This pass examined the regional modules for Longyuan, Jinyue, Frostveil Range, Hollowmoon Valley, Ironroot Reach, Tianfeng, Xingluo, Yanling, Baiyue, and Canglan. This is a section-level/source-level review of the fetched content, not a line-by-line approval of every regional file.

### Compatibility pointers

- `world/REGION_FROSTVEIL_RANGE.md`, `world/REGION_HOLLOWMOON_VALLEY.md`, and `world/REGION_IRONROOT_REACH.md` are explicit compatibility pointers to `world/REGION_BEIMING_GU.md`. They do not establish independent regional canon. Archive should redirect to the consolidated source and avoid duplicate article/entity records.

### Golden Dragon Empire regional modules

- `world/REGION_LONGYUAN.md`, `world/REGION_JINYUE.md`, `world/REGION_TIANFENG.md`, `world/REGION_XINGLUO.md`, `world/REGION_YANLING.md`, `world/REGION_BAIYUE.md`, and `world/REGION_CANGLAN.md` are regional references with established settlement/territory material. Their own canon policy repeatedly labels area/density as provisional population-based estimates, not surveyed boundaries or uniform density. Preserve that qualification wherever any estimate is shown.
- The administrative atlas is authoritative for prefecture seats, official village counts, and named village registers. Former prefectural seats are settlements/service hubs, not additional prefectures. Do not convert hamlets into official villages or infer unlisted towns, permanent services, leaders, exact coordinates, surveyed borders, neighboring regions, route distances, or travel durations.
- Named regional routes are graph edges, not permission to infer direct travel. Xingluo's Frontier–Maritime Relay is explicitly staged courier and authorized land/sea transfers, not a direct road. Jinyue and Longyuan also explicitly prohibit invented distances and durations.
- Regional population-facing service references defer to `world/GOLDEN_DRAGON_EMPIRE_POPULATION_SERVICES.md`; do not infer a bank, academy, library, Medicine Hall, or Ordo facility in every settlement.
- Regional factions and NPC entries defer to central official rosters. Political tendencies are not proof of secret faction membership. A registry row does not establish current physical presence.
- Longyuan's regional NPC table repeats Ying Wuxin's public clothing-pavilion identity while explicitly stating the concealed identity is GM-only. Treat the public owner role as a separate claim; exclude the concealed identity, criminal role, aliases, and secret connections from all player-facing entity metadata.
- Jinyue's regional NPC table names civil officeholders and includes their public dispositions, but points to the central officials roster for authority and full profiles. Its current-situation section includes an underground mining consortium, secret tunnels, bribery, witness intimidation, and evidence destruction. These are scenario/GM threat details; do not surface as general public regional facts or searchable faction profiles unless separately established as public knowledge.
- Longyuan's current-situation section describes an active smuggling operation and bribed officials. Treat operational leads and active threat details as GM/event content, not as a public guidebook entry. The regional text also describes the Imperial Special Financial Audit Committee and explicitly leaves deputy/lower-personnel integrity unknown; do not imply corruption is confirmed.
- Longyuan and Jinyue contain named NPC details with Spirit Realm/Stage and other progression information. Keep such values out of the Archive's local authority; if capability is needed, link to the official rules/source rather than reproducing derived mechanics.

### Remaining regional files — preliminary disposition only

- `world/REGION_TIANFENG.md`: public scholarly-region overview candidate; preserve the explicit statement that no Cultivator Academy is established in Tianfeng and avoid inventing institutions or local services.
- `world/REGION_XINGLUO.md`: public maritime-region overview candidate; staged inter-power relay and port-specific shipping constraints must remain exact. Do not turn a connected route map into a claim of direct travel.
- `world/REGION_YANLING.md`: public industrial/forging-region overview candidate; settlement/service gaps, volcanic/furnace hazards, and unknown local routes must remain qualified.
- `world/REGION_BAIYUE.md`: public frontier overview candidate; fortification/military context and the northern corridor are established only at the described level. Exact local alignment, crossings, and duration remain unknown.
- `world/REGION_CANGLAN.md`: public riverlands overview candidate; Twin River Route and seasonal transport limitations must not be generalized to every local road or river.

### Updated review progress

- Beiming Gu NPC registry and 23 listed profile paths: reviewed at registry/profile level; no wholesale approval.
- Golden Dragon Empire NPC registry and six canonical profile files: reviewed; central civil officials roster remains unreviewed in full.
- Tianhai Yunzhou registry, six canonical profile files, index, and power-structure roster: reviewed; no wholesale approval.
- Regional modules: first ten named regional modules have now received source-level/section-level review. Several remain candidates only; no region is approved for wholesale publication.
- Remaining regional modules, world systems, events, factions, official rosters, and the full 140-file line-by-line review remain incomplete.
- Player-facing publication approval: **not granted**.


## Lawless / northern regional audit — fourth pass

**Source snapshot:** Universe `2f76a864150528afb0e3d26cb16f9396ce610ff6`. Reviewed `REGION_ASHEN_BORDERLANDS.md`, `REGION_BEIMING_GU.md`, `REGION_BLACK_TIDE_EXPANSE.md`, `REGION_NINE_FROST_WASTES.md`, and `REGION_SILVERPINE_WILDS.md` at source level.

- `REGION_SILVERPINE_WILDS.md` is a compatibility pointer to the consolidated Beiming Gu source. Do not create a duplicate region article.
- `REGION_ASHEN_BORDERLANDS.md` and `REGION_NINE_FROST_WASTES.md` are explicitly partially developed. They establish only a limited set of named settlements and associated organizations. Association does not establish unified government, settlement control, routes, services, population, customs, or current faction presence. Preserve all unconfirmed fields; no gap-filling.
- `REGION_BEIMING_GU.md` is the consolidated source for seven districts. It confirms broad regional geography, a northern maritime connection, two dedicated air corridors, a standard fare of 25 xc each way, and terminal service hours 05:00–21:00; exact coordinates, duration, detailed schedule, intermediate stops, and local road segments remain unknown. These travel/fare values are operational mechanics and should not be reproduced as local Archive authority.
- The Beiming regional foundation explicitly names Beiming Nerva and gives her family relationship to Beiming Han. Because the linked registry/profile marks her identity and recurring student disguise GM-sensitive, this regional paragraph must not be treated as permission to expose her identity. Public article generation must use claim-level restrictions from the NPC registry/profile, not the regional paragraph in isolation.
- `REGION_BLACK_TIDE_EXPANSE.md` contains an extensive explicit **Crimson Sovereign Court hidden-authority** section and a second-life section for Ying Wuxin. These sections disclose the concealed leader, hidden chain of authority, true identity, criminal relationship to Crimson Keel Brotherhood, personal family details, daughter’s friendship with Jun Yuejin, and coercive Soul Illusion. This is **strict `GM_ONLY`**. Do not publish the content, the true name as a hidden leader, family identifiers, aliases, ability details, or graph links in player-facing Archive, search, autocomplete, backlinks, or suggestions. The only potentially public fact is Ying Wuxin's separately established civilian clothing-pavilion role, and only if sourced from a public-facing source with no secret linkage.
- Black Tide's four named settlements and four associated organizations are not proof of current control or open government. Do not infer who controls a site, road, port, or venue. The addendum directs detailed underground-economy and service lore to `world/LAWLESS_TERRITORIES.md`; that module must be reviewed before any Lawless Territory public article is written.
- Across these modules, current control, exact routes, adjacency, travel duration, hidden NPC lore, and unlisted local institutions are explicitly not to be inferred.

### Updated review progress

- First ten named regional modules received source-level/section-level review.
- Five additional Lawless/northern regional modules received source-level review in this pass.
- Explicit compatibility pointers identified: Frostveil Range, Hollowmoon Valley, Ironroot Reach, and Silverpine Wilds all resolve to the consolidated Beiming Gu module.
- High-risk hidden-identity content found in Black Tide and repeated Nerva identity exposure in Beiming regional text. Both require strict claim-level filtering.
- Other regional modules, Lawless Territories central addendum, world systems, events, factions, and full 140-file line-by-line approval remain incomplete.
- Player-facing publication approval: **not granted**.


## World organizations and concealed-location audit — fifth pass

**Source snapshot:** Universe `2f76a864150528afb0e3d26cb16f9396ce610ff6`. Reviewed `LAWLESS_TERRITORIES.md`, `RUINED_ARCHIVER.md`, `SPIRIT_HUNTERS_GUILD.md`, `THREE_POWER_PERSPECTIVE_MAPS.md`, and `WANLUO_SACRED_EXPANSE.md`. Some very long modules were reviewed through section-level ranges; this is not a full line-by-line certification.

### Lawless Territories — mixed public context and restricted content

- The Lawless Territories are explicitly not one state, government, sect, or unified faction. Regional association does not prove control of a village, road, auction, or arena.
- Broad social context (poor agricultural soil, varied livelihoods, uneven safety, independent trade) may be summarized cautiously. Do not imply that all residents are criminals or that every encounter is hostile.
- Silent Maw Hall's intermediary role, Black Scripture Sect appraisal services, Hollow Fang Alliance's illegal arenas, elite auctions, people-smuggling, and the Wayfarer Hearth Network are described as underworld services. These are sensitive subjects; a public article must be neutral, non-operational, and avoid inventing routes, prices, named clients, targets, or schedules.
- Auction material includes illicit trade in half-beast people/lineages and portable Spirit Ring stasis artifacts. Do not present people as collectible inventory or turn restricted/illegal catalogues into shopping-like Archive content. Preserve the coercion/trafficking context if such history is discussed.
- **Crimson Sovereign Court and Ying Wuxin — strict `GM_ONLY`.** The module repeats hidden leadership, secret links to Crimson Keel Brotherhood, capability details, and coercive Soul Illusion. Outward affection caused by coercion is explicitly not consent. Do not expose the identity, ability, victims, aliases, family links, or secret organizational hierarchy to players before discovery.
- **Inner Azerion — restricted location/knowledge.** The city is concealed by dense illusion fog; safe routes are known only to experienced forest veterans and local hunter tribes. Its exact location, government, population, leadership, districts, and routes remain unknown. Do not place it on public maps, reveal access directions, or imply ordinary travelers can find it.
- The Dead Zone is the deepest inner/core zone of Azerion Forest, not a synonym for the whole forest. The lake, ruins, Mega Colossal Labyrinth, and northern sea exit are dangerous and incompletely mapped. No complete internal labyrinth map exists; all map content must be limited to surveyed and recorded segments.
- The Heavenly Beast's history and its connection to Beiming Han's scar are restricted knowledge known only to a very small number of people, including Beiming Xenhwa. Do not include this in public exposition or entity metadata.
- The hidden slave market in Inner Azerion is established, but its scale, rules, inventory, ownership, and relationship to city authorities remain undefined. Do not invent them or imply universal local support.

### Ruined Archiver — public institutional candidate with confidential records

- Ruined Archiver is an Ordo Suci Tianming branch, not an independent guild or universal police force. A public overview of its registration, mapping, verification, compensation, and anomaly-warning mission is a possible Archive article.
- Expedition records, maps, informants, buyers, possible anomalies, confidential sites, and sensitive findings are explicitly access-controlled. Do not publish every known Ruined or confidential map/report; a public article must describe the organization without exposing its operational records.
- Staff witnessing registration/departure does not mean they enter the ruin, guarantee safety, or verify every subsequent claim. Map claims require evidence; surveyed, inferred, and unknown areas must stay distinct.
- More than one thousand Golden Age Ruined are established globally, but locations, conditions, contents, and exploration status vary. Do not fabricate a directory or full map.
- Compensation has an advance and a verification/final-payment process, but there is no universal price table or fixed bounty. Do not add one.
- Formal hierarchy, internal ranks, universal license thresholds, party-size requirements, fixed risk labels, standard pay rates, verification times, branch staffing, universal sealing authority, and complete Tower alliance roster remain unspecified.
- The GM continuity section includes strict information-routing rules and anti-meta protections; it is not player-facing lore.

### Wanluo Sacred Expanse and Ordo Suci Tianming

- A public overview may distinguish the Wanluo region, World Knowledge Tower relic, and Sanctum of Ten Thousand Vows headquarters. They are three separate entities and must not be merged.
- Public roads, pilgrim facilities, and ordinary districts are generally accessible under local rules; specialized institutions, inner Tower areas, deeper chambers, observation zones, and confidential archives have separate access controls. Regional entry does not grant Tower access.
- The Tower is an ancient divine relic, not owned by the Shen family, Ordo, or alliance. The Shen family is one of several parties entrusted with administrative rights/responsibilities.
- Ordo Suci Tianming is the world's largest religious organization by follower count in the current setting and has a world-survival/anomaly early-warning mandate. It is not omniscient, not politically absolute, and not a universal law-enforcement body.
- The World Knowledge Tower administration council, Wanluo regional administration, Ordo, and the alliance of elite envoys have distinct jurisdictions. Do not collapse their authority into one ruling body.
- The formal alliance name, complete envoy roster, internal ranks, founding chronology, legal charter, voting system, precise geopolitical placement of Wanluo, and detailed administrative boundaries remain unestablished.
- Public-facing facilities may be described at the level in the source. Sensitive archive content, anomaly reports, restricted access procedures, and undisclosed operational networks remain non-public.

### Three-Power Perspective Maps

- The perspective maps are explicitly relative schematics, not scale maps. They do not define coordinates, distances, exact borders, or travel times.
- Mapped corridors can be travel frameworks rather than fully surveyed roads; exact pathing, crossings, access, safety, schedules, and durations may remain conditional or unspecified.
- The Azerion Forest river trap and prison island, the Lawless approach, and the Mega Colossal Labyrinth exit are distinct geographic relationships. Do not collapse them into one route or show the hidden city as an ordinary waypoint.
- Public map rendering must exclude concealed Inner Azerion, GM-only authority, undiscovered routes, and any restricted location details. Show only geography and routes approved for player knowledge.

### Spirit Hunters Guild

- The Guild's public identity is a broad contract-and-jobs organization, not a hunting-only service. A high-level neutral institutional overview may be publishable after review.
- Branch availability, reach, fees, staff, membership, authority, contracts, risk, and rewards vary by local canon and events. Do not invent a branch in every settlement, fixed jobs, universal fees, guaranteed payments, or safety.
- Contract tiers, party registration, hunting/absorption, combat, injury, HP, and bounty mechanics belong to official gameplay modules. Do not duplicate them in the Archive.
- The Guild is not a world government, universal police force, or guarantee of safety. Allegations require evidence; temporary party membership does not imply trust or permanent affiliation.

### Updated review progress

- Five additional organization/map modules received source-level review.
- High-risk content identified: Crimson Sovereign Court, Ying Wuxin, Inner Azerion, the Dead Zone/labyrinth, Heavenly Beast–Beiming Han scar history, confidential Ruined records, and restricted Tower/Ordo archives.
- Potential public article candidates: high-level Lawless social overview (carefully filtered), Ruined Archiver institutional overview, Wanluo/Ordo public institutional overview, and Spirit Hunters Guild overview. None is yet approved for publication.
- Gameplay mechanics, secret maps, confidential records, hidden identities, and operational underworld details remain excluded.
- Full 140-file line-by-line approval and player-facing publication approval: **not complete / not granted**.


## World foundations, institutions, and cross-reference audit — sixth pass

**Source snapshot:** Universe `2f76a864150528afb0e3d26cb16f9396ce610ff6`. Reviewed the listed world foundation, society, economy, artifact, event, regional, institutional, and route sources at section/source level. Long documents were not all read line-by-line; this pass records publication risks and source conflicts rather than granting blanket approval.

### Additional regional findings

- `world/REGION_STONEGATE_MARCH.md` is a compatibility pointer to `world/REGION_BEIMING_GU.md`, not an independent region. Do not create a duplicate article.
- `world/REGION_TIANHAI_YUNZHOU.md` is a substantial consolidated regional source. It includes public districts, services, routes, and infrastructure alongside restricted strategic details and a GM-only Nerva note. Public extraction must be claim-level and cross-checked with NPC registry/profile access rules.
- `world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md` supports public institutional articles for the four academies and Tianhai Arcanist Institute, but contains a direct GM-only Beiming Nerva cover note at Beichen Cultivator Academy. Exclude that note and all cover-identity links from player search, highlighting, and graph metadata.
- `world/LAWLESS_SOUTHERN_PORT_AND_ISLES.md` establishes Southwake Port and Lanternhook Isles, including Red Lantern Cay, Bitterglass Isle, and Dicewake Isle. Public overview may describe their location and broad character, but the medical/poison trade, gambling, illicit commerce, and high-risk expeditions require neutral, non-operational framing. No fees, exact coordinates, schedules, guaranteed safe passage, or permanent NPCs are established.
- `world/REGION_STONEGATE_MARCH.md`, like the previously identified Frostveil Range, Hollowmoon Valley, Ironroot Reach, and Silverpine Wilds, is a compatibility redirect. All five redirect to the consolidated Beiming Gu source.

### Social stratification and wealth distribution

- `world/SOCIAL_STRATIFICATION.md` is a public-worldbuilding candidate. It explicitly distinguishes social standing, personal wealth, living conditions, and power/access; slum residence and homelessness must not be treated as moral categories or fixed occupations.
- Its currency examples and class expectations defer to `core/10_ECONOMY_SYSTEM.md`. Do not copy exchange rates or price formulas into Archive as a second mechanics authority.
- `world/WEALTH_DISTRIBUTION.md` records two views of the same global wealth total: territorial allocation and holder-group allocation. Never add the tables together. Market channels are not additional ownership shares. The model's total is not liquid cash and is not automatically known to ordinary characters.
- Wealth totals and allocations are worldbuilding estimates/accounting baselines, not personal balances or exact treasuries. Do not expose them as ordinary in-world public knowledge without a source establishing that a character or institution knows them.
- The tables' values and exact arithmetic should receive a separate numeric validation before any Archive infographic is generated. This audit did not certify the calculations.

### World foundations and map navigation

- `world/WORLD.md` is the primary lore overview but contains legacy/older sections and cross-references to other modules. It must not be copied wholesale. Current detailed sources and canon precedence must be checked for each claim.
- `world/WORLD_NAVIGATION_TREE.md`, `world/THREE_POWER_PERSPECTIVE_MAPS.md`, `world/GEOGRAPHY_AND_TRAVEL.md`, and `world/LOCATION_AND_ROUTE_NETWORK.md` are navigation/route references, not a player-facing guarantee that every route is surveyed, safe, or publicly known.
- Perspective maps are relative schematics, not scale maps. Route graph edges, local route segments, transport, schedules, access, and travel time are distinct. Unknown segments must remain unknown.
- The navigation tree includes a hidden Inner Azerion branch and the labyrinth/Dead Zone. Those nodes may be used for GM navigation only; do not expose them in player map tiles, public route search, or suggested destinations.
- `world/REGIONAL_REPOSITORY_ARCHITECTURE.md` remains repository architecture, not in-world lore. `world/CANON_LOAD_ROUTER.md`, `world/CANON_DECISIONS_AND_PRECEDENCE.md`, and `world/NPC_MANAGEMENT.md` are GM/authority references, not public articles.

### Golden Dragon Empire governance — authority labels resolved

**Verified against the current `main` branch at Universe commit `2f76a864150528afb0e3d26cb16f9396ce610ff6` (30 October 2026).**

- `CANONICAL_LATEST` `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md` — the single source of truth for administrative counts, official names, and parent relationships. Its current structure is **7 regions, 12 prefectures, 6 county circuits, and 13 officially registered rural villages**. It explicitly supersedes the former 33-prefecture, 268-county, 361-city, 1,838-town, and 22-village register.
- `CURRENT_FRAMEWORK` `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md` — last updated 28 October 2026, later than the atlas and officials roster. It explicitly delegates territorial counts/names to the atlas and repeats the simplified structure and supersession rule. Use it for civil-government hierarchy, institutional mandates, and separation of civil/military authority; use the atlas for the actual administrative register.
- `LEGACY_REFERENCE` `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md` — last updated 25 October 2026, before the 28 October governance revision. Its named NPC information remains a retained roster/reference, but it is **not authoritative for administrative structure, counts, jurisdiction names, or parent relationships**. Its old 33-prefecture/268-county statement is stale and superseded. Do not propagate that statement into Archive content.
- The officials roster's own opening scope distinguishes seven central heads, seven regional governors, twelve active prefectural offices, and twenty-one retained regional/circuit officers. Keep the retained names as historical/legacy NPC records where supported, but treat former offices as former, subordinate, advisory, local, or pending reconciliation unless a current reassignment is explicitly recorded. Do not imply every legacy official currently holds an active jurisdiction.
- **Publication rule:** an official's name, personality, background, Martial Soul, and cultivation details may be considered individually from the roster after NPC visibility review. Derive any current office/jurisdiction only from the current atlas + governance framework and an explicitly reconciled appointment. Do not generate a bulk 336-profile directory from the old roster.
- This is no longer an unresolved canon conflict: it is a **resolved source-precedence issue with stale text retained in a legacy roster**. The source file itself has not been edited; the Archive manifest records the authoritative interpretation.
- The separate Imperial Special Financial Audit Committee dossier may support a high-level public institution entry. Its head is established as honest; deputy/lower personnel are unknown. Luca's family case remains unresolved and must not be turned into a confirmed conspiracy or accusation against the committee.

### Institutions and restricted groups

- `world/GOLDEN_DRAGON_EMPIRE_POPULATION_SERVICES.md` is a branch/service register with named public-facing service locations. It explicitly states that presence does not guarantee staffing, hours, inventory, specialist capability, free treatment, or equal service. A listed branch/contact point is not proof of a permanent full-service branch in every settlement. Review each institution and location separately before publication.
- `world/ANCIENT_SHAMANISM_AND_BUDDHIST_CLANS.md` confirms two separate secluded groups. Their mountain locations and access routes are unknown; Ancient Shamanism has fewer than nine members and a strict recruitment/identity boundary. The Buddhist clan's name, exact population, leader identity, and detailed hierarchy remain unknown. Do not merge either group with Ordo Suci Tianming or expose them as routine map destinations.
- `world/INTELLIGENT_PEOPLES.md` is a public foundational candidate, but explicitly an open list. Appearance does not establish abilities, lifespan, weaknesses, culture, morality, or cultivation compatibility. Its regional tolerance ranking is a broad social tendency, not universal law.
- `world/FACTIONS.md` is a cross-faction index containing both public and sensitive references. Do not import it wholesale into public search. Every organization and relationship requires its own public/restricted claim review; reputation labels do not establish secret membership or Spirit Realm doctrine.
- `world/PRISON_AND_BOUND_ITEMS.md` includes coercive restraints, detention contexts, and item-specific risks. It is not approved for general public catalogue ingestion. Any public description must avoid actionable escape/suppression instructions and must not invent effects, tiers, or universal penalties.
- `world/DYNAMIC_EVENTS.md` distinguishes recurring canonical observances from one-off incidents, proposals, and resolved history. The Festival Tiga Kekuasaan is recurring every six in-world months, but first occurrence, next host, rotation order, exact date, venue, and duration remain unestablished. The current one-off active and resolved event registries are empty. Event proposals are not canon until approved and committed. Character knowledge is governed by explicit knowledge distribution; event occurrence does not automatically update character state.

### Artifact and Arcanistry boundaries

- `world/ARTIFACTS_AND_RELICS.md` is a provenance/catalogue source. It distinguishes Relic, Ancient Artifact, and Artificial Artifact by origin. It confirms the floating-island Tier 9 Artificial Artifact's support function, but its maker, materials, energy source, mechanism, maintenance, and weaknesses remain unknown/restricted.
- Zun Jade and Ancient Zun are currency, not default crafting materials, cultivation tools, or artifacts. The Archive must not classify them as collectible relics.
- The artifact catalogue is intentionally sparse. It explicitly says no other individual Relic or Ancient Artifact is fully specified in the current established canon; do not invent a gallery of named relics.
- `world/ARTIFICIAL_ARTIFACTS.md` may support descriptive item entries only after item-level review. Production, formulation, tier assessment, and appraisal authority remain in core mechanics modules.
- `world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md` is an institutional source; Arcanist progression, production, certification, and grade mechanics remain governed by core modules.

### Updated progress and publication gate

- Reviewed at source/section level in this pass: Stonegate March, Tianhai Yunzhou, Tianhai academies/institute, Southern Port and Isles, Social Stratification, Wealth Distribution, World overview, Navigation Tree, Dynamic Events, Ancient Shamanism/Buddhist Clans, Imperial Special Financial Audit Committee, Intelligent Peoples, Prison and Bound Items, Factions, Golden Dragon Governance, Population Services, Officials roster, Artifacts and Relics, Artificial Artifacts, Geography and Travel, and Location and Route Network.
- Several large sources were sampled by ranges or opening/tail sections; do not represent this as a complete line-by-line review of each file.
- Golden Dragon administrative precedence is resolved: the atlas is `CANONICAL_LATEST`, governance is `CURRENT_FRAMEWORK`, and the officials roster is `LEGACY_REFERENCE` for NPC details only; stale administrative claims are superseded.
- The remaining 140-file line-by-line review, exact arithmetic validation, complete officeholder deduplication, and final public-claim approval are not complete.
- Player-facing Archive publication approval: **not granted**.


## Numeric cross-check — wealth model

**Source:** Universe `world/WEALTH_DISTRIBUTION.md` at `2f76a864150528afb0e3d26cb16f9396ce610ff6`.

A separate arithmetic check was run on both ownership tables:

- Territorial allocation: shares total **100%** and the four listed Xuan Gold allocations sum exactly to **400,463,763,789,849 xg**.
- Holder-group allocation: shares total **100%** and the ten listed Xuan Gold allocations sum exactly to **400,463,763,789,849 xg**.
- The two tables are alternative views of the same total and must not be added together.
- This validates arithmetic consistency only. It does not verify the fictional economic assumptions, liquidity, real-world plausibility, or whether characters know these figures.

**Disposition:** arithmetic check passed; public disclosure/infographic approval remains pending claim-level knowledge review.


## Seventh pass — repository-wide source disposition and full roster diagnostics

**Current upstream snapshot:** `Antarezka/merzkava-universe` `main` at `2f76a864150528afb0e3d26cb16f9396ce610ff6`, commit date 2026-10-30 09:57 UTC. The recursive tree contains **140 Markdown files**. Every file has now been assigned a content/authority disposition in this audit inventory; this is not a claim that every long file has been proofread line-by-line.

### Complete inventory disposition (140 Markdown files)

| Source group | Count | Archive disposition |
|---|---:|---|
| Root documentation (excluding player registry) | 5 | README/version/recovery/entrypoint are repository controls, not lore articles. INDEX is a gameplay router and not an Archive authority. |
| `core/` | 12 | `MECHANICS_REFERENCE`; do not reproduce rules, numerical formulas, progression, costs, chances, or state logic as Archive content. |
| `gameplay/` | 3 | `MECHANICS_REFERENCE`; procedures only, never public lore articles. |
| `bestiary/` | 1 | `MECHANICS_REFERENCE`; descriptive creature knowledge may be extracted only from independently established public lore, without age/tier/ring/combat/absorption mechanics. |
| `templates/` | 9 | GM/player invocation, output, character, NPC, regional and event templates; not lore articles. Never expose prompt/anti-cheat/internal GM instructions as player Archive content. |
| `players.md` + `players/*.md` | 7 | `PRIVATE_PLAYER_DATA`; exclude player registry, identities as player records, snapshots, balances, session notes, and private state from Archive search and article ingestion. |
| Regional `INDEX.md` files | 3 | Navigation/routing metadata; may inform internal source resolution but are not standalone lore biographies. |
| Regional NPC registry/profile files | 39 | Individual claim-level visibility review required; public dossier facts may be considered only after GM-only identity, private whereabouts, secrets, and unrevealed relationships are filtered. No wholesale profile ingestion. |
| `world/` modules | 61 | Mixed public lore, mechanics references, GM-only records, legacy pointers, and review-required material; apply the file-specific dispositions recorded in the earlier passes. No whole-folder import. |
| **Total** | **140** | **All 140 have an assigned disposition; publication approval is separate and has not been granted.** |

### Root, bootstrap, and version controls

- `INDEX.md` and `templates/AUTHORITY_ORDER.md` are gameplay bootstrap/authority routers. They are not world-encyclopedia articles and their operational GM instructions must not enter player-facing search.
- `templates/GAMEPLAY_RESPONSE_TEMPLATE.md`, `templates/CHARACTER_PROFILE_TEMPLATE.md`, `templates/NARRATIVE_DYNAMICS.md`, and `templates/ANTI_CHEAT_HARD_GATE.md` define internal gameplay output, profile semantics, narrative procedure, and enforcement. Keep all out of public lore.
- `templates/NPC_PROFILE_TEMPLATE.md`, `templates/REGIONAL_MODULE_TEMPLATE.md`, and `templates/WORLD_EVENT_UPDATE_TEMPLATE.md` are blank/administrative scaffolds, not evidence that their placeholder content is canon.
- `players.md` and all six player profile snapshots are private player data. They are not NPC records and must not appear in Archive autocomplete, entity graph, backlinks, or article suggestions.
- `NIGHTLY_VERSION.md` currently states `v4.0.15`; `STABLE_VERSION.md` states `v4.0.1`; `SAFE_VERSION.md` identifies a protected rollback snapshot. Version/recovery records are software governance, not in-world chronology.
- **Upstream pin discrepancy:** the current `main` commit is `2f76a864150528afb0e3d26cb16f9396ce610ff6`, while the README's visible pinned RP source remains `58693e1`. The Archive audit uses the verified full `main` commit above as its source snapshot. Do not silently treat the README pin as equivalent to current `main`, and do not change the Universe repository as part of this APK manifest update.

### Full Golden Dragon officials roster diagnostics

The complete 486-line, 112,016-character `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md` was checked structurally, including all Markdown table rows and the final relationship/administrative section.

- The file contains **353 data rows**, with **336 distinct named people** and no duplicate names detected in the parsed name column. This does not mean 336 people currently hold active offices.
- The roster explicitly distinguishes 7 central heads, 7 regional governors, 12 active prefectural offices, and 21 retained regional/circuit officers. The remainder are retained former prefect/county/local NPC records; do not infer active appointments from legacy table headings.
- Thirteen retained-officer rows contain a literal `undefined` in an extra trailing table cell. Treat this as a source-data formatting defect, not as an in-world field or canon value. It must not be rendered or indexed as an attribute.
- The final §5 administrative-names bullet still says the atlas governs **33 prefectures and 268 county jurisdictions**, directly contradicting the current atlas and governance file. This is stale text in the legacy roster; the source-precedence decision remains: atlas `CANONICAL_LATEST`, governance `CURRENT_FRAMEWORK`, officials `LEGACY_REFERENCE` for NPC data.
- A second office-mapping issue needs owner/source reconciliation: the officials roster names a **Kepala Badan Pengawasan Kekaisaran** among its seven central officials, while the current governance portfolio lists the **Komite Auditor Keuangan Khusus Kekaisaran** as its oversight institution. The committee dossier leaves its head unnamed and does not identify it as the same body as the Badan Pengawasan. Do not merge these institutions, infer that the named roster official heads the committee, or create a public officeholder link until the source owner resolves the relationship.
- The governance file lists the Grand Martial Soul Awakening Hall as a central institution but the officials roster does not give it a named head. Do not invent one.
- The roster's stated current administrative model and 21 consolidated officers are retained as its NPC data where consistent with governance; stale count claims and unresolved institution mapping are not authoritative. The source file has not been edited.

### Mechanics and narrative source separation

- All twelve `core/` modules were checked for their declared authority boundaries. They remain the sole authority for economy, Arcanistry, cultivation, academies, HP, hunger/metabolism, injury, Martial Soul, awakening, Spirit Realm traditions, Spirit Rings, and appraisal. Archive entries may explain public concepts in plain language only when they do not duplicate formulas, progression gates, prices, probabilities, or mechanics.
- All three `gameplay/` modules remain procedure references for combat, time/action, and travel/encounter/rescue. Do not turn their probabilities, action durations, or resolution steps into in-world public facts.
- `bestiary/SPIRIT_BEAST_RULES.md` is not an Archive mechanics source. If public creature dossiers are later approved, use only descriptive species facts that are independently known in-world; exclude Spirit Realm output estimates, beast-age grades, ring eligibility, absorption, combat behavior formulas, and appraisal scoring.
- The 9 template files have been classified as internal scaffolds/procedures. None is an Archive article source.

### Audit completion status

- **Inventory coverage:** 140/140 Markdown paths have a disposition.
- **Source-level/section-level review:** completed across all 140 paths, using full reads for shorter documents and targeted ranges/structural checks for long sources.
- **Deep verification still outstanding:** exhaustive line-by-line semantic review of every long source, final row-by-row officeholder appointment reconciliation, and owner decision on the Badan Pengawasan ↔ Komite Auditor relationship.
- **Publication approval:** not granted. The current 32-dossier APK catalogue remains a curated starter corpus, not complete coverage or blanket approval of its source files. Do not add or expose source text solely because its path exists in the catalogue.
- **Implementation gate:** no public entity index, automatic highlights, autocomplete, backlinks, or source reader should be treated as canon-safe until visibility filtering and local-document resolution are implemented and tested end-to-end.


### Golden Dragon active-prefect cross-check — completed

A direct name-and-seat comparison was run between the current atlas prefecture register and the officials roster:

- Atlas: 12 prefecture name/seat pairs.
- Officials roster: all **12 of 12** active prefecture name/seat pairs match the atlas exactly; no missing or extra active prefecture appointment was found in those rows.
- The 33 prefecture/local-administrator-labelled rows in the roster consist of the 12 current prefectural officeholders plus 21 retained local administrators whose former prefectural jurisdictions/seats remain settlements or service hubs. The latter are not additional active prefects.
- This validates the 12 active appointments against the current register. It does not establish current physical whereabouts, public familiarity, or authority beyond the stated office.

**Roster correction boundary:** the current 12 active prefecture entries may be linked to their canonical public regional offices after individual NPC visibility review. The 21 retained local administrators may be shown only with their reconciled current role wording; never revive their former prefecture as an active administrative unit.


## Eighth pass — complete regional NPC visibility review and Archive publication controls

**Source snapshot:** `Antarezka/merzkava-universe` `main` at `2f76a864150528afb0e3d26cb16f9396ce610ff6` (2026-10-30). The source repository was not modified by this APK-side audit.

### Regional NPC files — all reviewed

All **39** Markdown files under `regions/*/npcs/` were reviewed: **35 individual profiles, 3 regional registries, and 1 Tianhai power-structure roster**.

- No regional NPC registry or profile was imported wholesale.
- Beiming Nerva's concealed identity, family connection, and student-cover information remain excluded from the player corpus and entity graph.
- Beiming Jingheng's concealed criminal connection remains excluded; any public identity or adoptive-family facts are separately scoped.
- Beiming Xenhwa's public dossier is limited to the public identity and broad appearance facts. Her undisclosed age and profile-only flame capability are not player-facing facts and have been removed from the Archive entry.
- Beiming Han's hidden Azerion history and non-public capability fields are excluded.
- Tianhai and Golden Dragon entries use public titles and family relationships only; progression state, private agenda, unrevealed whereabouts, and capability fields are not imported.
- Bai Xuanyin's public historical remembrance may be used; Arcanist grade, artifact-production procedures, and restricted wartime device details are excluded.
- The three regional registries and Tianhai power structure remain source-navigation aids, not public NPC biographies. Anonymous placeholders, secret liaisons, unconfirmed officeholders, and inferred relationships are not imported.

### Public Archive corpus — publication gate implemented

The local Archive now contains **39 curated dossiers**, each explicitly marked `PUBLISHED`. The entries use **35 distinct source paths**; all referenced paths were checked against the current Universe tree and exist in the source snapshot.

- Every dossier stores its source path, source label, full source commit, review date, and generated cross-reference IDs.
- The local entity graph includes only `PUBLISHED` dossiers. Search, inline highlights, related records, and open-entry actions all use the same public-only corpus.
- Exact canonical titles take precedence over aliases. Duplicate title/alias collisions are rejected by automated tests; ambiguous or incorrect aliases have been removed.
- The Black Tide Expanse is a separate dossier from Black Tide Sea and from the wider Lawless Territories.
- Public summaries were added for Black Tide Expanse, Ashen Borderlands, Nine Frost Wastes, Southwake Port and Lanternhook Isles, Wanluo Sacred Expanse, Ordo Suci Tianming, and Spirit Hunters Guild. These retain only established public geography or institutional scope; hidden leadership, restricted identities, operational criminal details, prices, routes, and unconfirmed control are omitted.
- The generic Spirit Beast dossier was removed because its only source was a gameplay-mechanics bestiary. No public Bestiary article is published until a separate descriptive, non-mechanical source is reviewed.
- The public Xenhwa entry no longer exposes her undisclosed age or profile-only flame capability.
- Empty categories are hidden. A category appears only when at least one public dossier uses it.

### Automated checks added

- `tests/lore-library.test.ts`: public visibility, hidden-identity exclusion, canonical title/alias routing, Black Tide geography disambiguation, source provenance, cross-reference integrity, duplicate-name prevention, Xenhwa disclosure boundary, and populated-category rendering.
- `tests/profile-baseline.test.ts`: new-session source profile acceptance, verified continuation gate, rejection of unverified continuation baselines, and required-field validation.
- Current validation on commit `adbc47e3e39fbe57bb2508d606afc60d46b264e5`: **27/27 tests pass** across four test files. TypeScript, gateway type-check, and Vite production build pass in the same validation run.

### Gameplay-state safety boundary

A separate continuity defect was fixed: a previous GM response panel can no longer be used as the baseline for a later turn unless a persisted profile checkpoint is explicitly marked verified. The original registered profile is labelled as historical when the current session state is unverified.

This is a safety correction, **not** a completed state-approval workflow. The APK still has no player-facing approval action that commits proposed changes into a verified profile checkpoint; GM proposals remain uncommitted and the app must not imply that wallet, inventory, HP, or other state changes have been applied. The local Ledger Log remains a separate local-storage record rather than a confirmed SQLite transaction ledger.

### Android build status at this audit point

- Build `269`, source `2b89a00de2e75cccd3b335ff7b5ae4a38ce52f3d`, version `v.1.01.269-2b8`: APK build, signing, alignment, signature verification, artifact upload, Android 14 emulator installation, and real MainActivity first-draw smoke test all passed.
- A newer build, run number `272`, is building the Archive provenance and privacy corrections from source commit `a77570eb56680bc4eb7063f4eaf5a0e37c87667b`. Its emulator result is not yet recorded in this manifest.
- CI dependency installation has reported **7 npm advisories (5 moderate, 2 critical)**. Package-level advisory details have not yet been captured; do not treat this as resolved or assume all findings affect production dependencies.

### Remaining canon quarantine (not an Archive publication blocker)

- The legacy officials roster still contains stale administrative text and thirteen rows with literal `undefined`; the authoritative atlas/governance precedence and all twelve active prefecture appointments have been reconciled. The roster source itself remains unedited.
- The roster's `Badan Pengawasan Kekaisaran` and the separately documented `Komite Auditor Keuangan Khusus Kekaisaran` have no established equivalence. Keep them distinct and do not assign the roster official as committee head.
- Exact boundaries, coordinates, and travel durations for partially developed Lawless regions remain unknown. Their dossiers preserve that uncertainty.
- Long mixed-source documents contain GM-only sections; public dossiers are curated excerpts, not permission to expose the underlying full source files.
- No local Archive article grants gameplay authority. Mechanics continue to resolve only through the official Universe repository's INDEX and authoritative core/gameplay modules.

**Audit disposition:** the regional NPC inventory, source-path coverage, public entity index, and automated visibility/link gates are complete for the current 39-dossier corpus. Canon facts that remain unknown or contradictory are explicitly quarantined rather than guessed. This does not certify the separate gameplay state-approval workflow or npm dependency advisory set as complete.


### Dependency advisory triage — production scope checked

The validation workflow now prints the exact npm advisory set and separately audits production dependencies.

- Full development/build dependency tree: **7 advisories** — 5 moderate and 2 critical.
- Critical findings: direct dev dependency `vitest` and transitive `tinypool`; both are in the test toolchain, not in the APK runtime dependency set.
- Moderate findings: `@capacitor/cli` (direct dev dependency) and transitive `@vitest/mocker`, `glob`, `minimatch`, and `rimraf`.
- **Production-only audit: 0 vulnerabilities** across runtime dependencies.
- npm's suggested automatic fix for `@capacitor/cli` is a major-version downgrade to 4.8.2, which is not an acceptable blind change alongside Capacitor 7. The Vitest toolchain will be moved to a patched compatible release and revalidated; the CLI advisory remains a documented development-tool risk until a compatible Capacitor release or safe dependency override is available.


### Dependency advisory recheck — resolved in the latest install graph

The initial seven-advisory report was followed by an upgrade of the direct Vitest dev dependency to `^5.0.5`, the patched version recommended by npm's advisory report.

- Verified on commit `2eea63e69f2117eb769d030fdbcd09df10e10943`: `npm install` succeeded, Vitest 5.0.5 ran all **27/27 tests**, and TypeScript/gateway/Vite production build passed.
- Full `npm audit` now reports **0 total vulnerabilities**.
- `npm audit --omit=dev` also reports **0 production vulnerabilities**.
- The earlier five moderate and two critical findings are therefore no longer present in the dependency graph resolved by the latest CI install. This supersedes the previous advisory note above.


### Xenhwa public-profile boundary tightened

A final claim-level check of `BEIMING_XENHWA.md` confirmed that her public profile establishes appearance, passive natural fragrance, and unusually sensitive senses. Age, species/lineage, and the white-flame capability are recorded elsewhere in the full NPC profile, not in its public-profile section. The Archive dossier has therefore been narrowed to the public-profile facts and adoptive relationship only; age, half-beast/white-fox identity, flame capability, and GM-sensitive family history are excluded. A regression test now checks all four disclosure boundaries.


### Final build supersession — Xenhwa lineage boundary and patched test toolchain

The subsequent claim-level review tightened Beiming Xenhwa's public entry further: age, half-beast/white-fox lineage, flame capability, and restricted family history are all excluded. The public dossier retains only her public-profile traits and adoptive relationship. The regression test now checks age, lineage, and flame disclosure.

- Direct dev dependency `vitest` is now `^5.0.5`.
- Validation on commit `97f04c199bb385abeeefb068aad08125f3f63a6c`: **27/27 tests pass**, TypeScript/gateway type-check and Vite production build pass.
- Full npm audit: **0 vulnerabilities**. Production-only audit: **0 vulnerabilities**.
- Android build `275`, source `6c64df88df589bcf832f4f1709eb2822569a0ec5`, expected version `v.1.01.275-6c6`: build/signature/emulator result pending. This is the current candidate APK build; it supersedes the earlier in-progress/cancelled intermediate runs.


### Final APK 275 — build and emulator smoke test passed

<badge>Run: 41259241219</badge>

- **Result:** workflow completed successfully.
- **Source commit:** `6c64df88df589bcf832f4f1709eb2822569a0ec5`.
- **Version:** `v.1.01.275-6c6`; Android `versionCode=275`; package `com.antarezka.merzkava`.
- **APK file size:** 25,753,633 bytes.
- **APK SHA-256:** `c17795990a4f2839827ff2de733964f8d250bd93701e8c58800065382ee844d5`.
- ZIP alignment and v2 APK signature verification passed; signing certificate uses RSA 4096-bit key. The verifier also emitted a non-blocking warning that `META-INF/com/android/build/gradle/app-metadata.properties` is not protected by the APK signature; this is recorded rather than silently ignored.
- Transparent Kitty launcher icon generation passed. The launcher-icon generator uses the Kitty body artwork without the separate shadow layer; splash assets and animation checks also passed.
- Android 14 emulator test passed: APK installed, `MainActivity` drew its real app window (attempt 6), app process remained available, and early/mid Kitty splash frames were captured at 1080×1920.
- The initial ActivityManager launch wait timed out, but the smoke script continued to inspect the actual activity and first-draw state; the real window appeared and the install-and-launch test passed.
- APK artifact: [`merzkava-debug-apk`](https://github.com/Antarezka/merzkava-apk/actions/runs/41259241219/artifacts/13065080211) (15,012,515-byte artifact archive).
- Emulator diagnostics: [`merzkava-emulator-diagnostics`](https://github.com/Antarezka/merzkava-apk/actions/runs/41259241219/artifacts/13064489199) (216,953 bytes).

**Final disposition:** the 32-dossier offline Archive corpus, visibility filter, source provenance, and cross-reference graph are included in this APK candidate. The latest build is green through compilation, signing, package verification, installation, MainActivity first draw, and splash capture.


## Phase 1 matrix and handoff supersession — 2026-11-01

The current APK catalogue is **87 curated dossiers across 71 approved player-facing Universe source paths, plus 3 `ON_PLAN` placeholders**, on `feature/archive-experience`. The complete 140-path source disposition, stable-ID linking contract, exclusions and handoff order are maintained in [`docs/WORLD_ARCHIVE_COVERAGE_MATRIX.md`](WORLD_ARCHIVE_COVERAGE_MATRIX.md).

This supersedes the older 26/39-dossier and 35-source-path handoffs below. The approved player-facing source-path target is now mapped at 71/71 (100%); 3 intentionally under-specified entities remain explicit `ON_PLAN` placeholders rather than fabricated articles. The app has a public-only dossier graph, generated cross-reference IDs, inbound backlinks, and an offline reader for reviewed extracts. Remaining Archive gates are full link/search/backlink/source-reader QA, source freshness, Archive/gameplay isolation proof, accessibility, offline/reconnect behavior, and on-device verification. Earlier audit notes remain historical evidence for their original stage.

The documentation handoff does not modify the official Universe repository and is not itself an APK build. Latest documented Android Build #340 compiled, verified package/version/alignment/signature, and uploaded an artifact; its Android 14 emulator step was cancelled, so installation/smoke success is not claimed. Web App Validation #653 is a separate passing web/CI validation, not APK evidence.


## Entity development placeholders — 2026-11-01

The Archive now distinguishes entity-development status from source-review disposition. Names that are intentionally left open for GM-led narrative development remain clickable through an explicit placeholder registry rather than degrading to unlinked plain text.

- `Huanglongcheng`, `Cangqiong Harbor`, and `Remote Mountain Traditions` (alias `High Cloud-Sea Mountains`) are registered as `ON_PLAN`. Their established high-level references remain visible, while additional city, harbor, or hidden-group details are deliberately not asserted by the APK.
- `ON_PLAN` means intentionally under-specified, not missing data and not permission for the app to invent facts. The GM may develop context-specific narrative details in conversation; those additions do not automatically become official canon.
- `NON_CANON` is a supported distinct status for explicitly non-official material. No additional named non-canon entities are being invented in this update.
- Placeholder entries have their own local IDs and detail screens, appear in search, and can be opened from mentions in dossiers. They do not become published lore dossiers, source extracts, or gameplay authority.
- Source-review classifications such as `PUBLIC_CANDIDATE` and `PARTIAL_PUBLIC` remain separate and unchanged.
- Regression coverage includes placeholder lookup, inline linking, search, detail navigation, related canon links, and status separation. The later full-suite Web App Validation #653 passed 15 test files / 133 tests; this confirms CI execution, not on-device graph/navigation QA.

This update changes only the APK repository. It does not modify the official Universe repository or convert GM improvisation into canon.


### Implementation checkpoint — linked entity status registry

- **Implementation commit:** `511ae764f49550a31e8cf42266e9d96eee9ce0f2` on `feature/archive-experience`.
- `src/lore/lore-library.ts` now contains the explicit placeholder registry and the `ON_PLAN` / `NON_CANON` status model. `src/main.ts` handles placeholder navigation, and `src/style.css` gives the statuses distinct labels and readable light-theme styling.
- The current curated examples are Huanglongcheng and Cangqiong Harbor, both `ON_PLAN`. `NON-CANON` is supported by the model and renderer, but no unverified example has been fabricated.
- `tests/lore-library.test.ts` includes regression coverage for both linked examples, detail navigation, search, and separation from ordinary canon dossier resolution.
- **Verification:** the later Web App Validation #653 passed the full recorded suite (15 test files / 133 tests), TypeScript, gateway type-check, and Vite build. Physical-device graph/navigation checks remain pending.
- **APK:** no new build was started. Build #300 remains the previous baseline only; do not present it as containing this change.

## World Archive coverage and offline formula preservation — 2026-11-01

### Measured source-path progress

- Universe source snapshot: `main` at `2f76a864150528afb0e3d26cb16f9396ce610ff6`, containing 140 Markdown paths.
- Current Archive: **87 curated dossiers / 71 unique approved player-facing source paths**, plus 3 `ON_PLAN` placeholders.
- Approved player-facing source coverage: **71/71 = 100%** mapped to a dossier or explicit non-revealing placeholder.
- Whole-repository source-path footprint: **72/140 = 51.4%** when the linked legacy Beiming redirect is included. This broader footprint is not the player-facing coverage denominator.
- These are source-path disposition metrics only, not claim-level completeness, link correctness, UI quality, or game readiness.
- These are source-path indicators only. A mapped dossier may contain a curated subset of a source, so claim-level completeness remains unmeasured. Do not describe these figures as a percentage of every fact, paragraph, settlement, NPC, or world mechanic.

### Formula source preservation for the future offline game

- **Preserved:** all 16 source files classified `MECHANICS_REFERENCE` in the 140-path matrix, copied verbatim from the same pinned Universe commit into `docs/OFFLINE_GAME_CANON_FORMULA_SNAPSHOT.md`.
- **Supplemental source preserved:** `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md`, which contains the regional public-awakening budget allocation formula and is classified `PUBLIC_CANDIDATE`. Its content remains subject to claim-level player-visibility review.
- **Formula-source preservation:** 17/17 audited formula/rule source documents = **100% preserved**. The snapshot records the upstream blob SHA beside each source section so later changes can be compared exactly.
- **Offline engine implementation:** **10 deterministic mechanic modules are implemented and CI-verified** (HP, Satiety, Injury, Time/Day-left, Combat, Spirit Ring compatibility, Spirit Ring progression, Martial Soul Awakening, Economy, and Arcanistry). This is a verified module count, not a whole-engine percentage or a playable game; event/RNG orchestration, persistence, content traceability, remaining formula domains, and complete gameplay integration remain open.
- **Packaging boundary:** this is a developer/source-reference snapshot, not a player-facing Archive bundle. Never expose GM-only/private/internal content or use the entire snapshot as runtime lore. Translate each approved mechanic into deterministic engine code, preserve source provenance, and add tests before the offline game can use it.
- **Canon boundary:** Universe remains the authority. Do not modify or rewrite the Universe source as part of this APK-side preservation work.

### Formula domains preserved

Spirit Beast age/interval rules; economy and item pricing/scarcity; Arcanist progression, production chance and artifact condition; cultivation and progression gates; academy education constraints; HP; Satiety/metabolism; injury recovery; Martial Soul awakening, rarity, assessment and mutation; Soul-Nyuma/Soul-Zoun doctrinal boundaries; Spirit Ring age pressure, compatibility, Sync, absorption, defects, AWR, Qi and PowerScale; universal tier appraisal; combat rating/hit/damage/defense; time advancement and `Day left`; travel encounter, ambush and rescue probabilities; and the supplemental imperial regional funding allocation formula.


### Offline-game code milestone — HP state foundation (2026-11-01)

The first deterministic mechanic module has been added to the APK repository without changing the official Universe source:

- Source: `core/HP_SYSTEM.md` at `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `efef616efa7ad9c44c81470da6dc52bddc813204`.
- Code: `src/offline-game/mechanics/hp.ts`.
- Tests: `tests/offline-game-hp.test.ts`.
- Implemented behavior: exact maximum HP table, Mortal/0, session bootstrap semantics, unresolved-versus-dead distinction, HP validation, and no-auto-heal maximum reconciliation.
- Validation: [Web App Validation #565](https://github.com/Antarezka/merzkava-apk/actions/runs/41305346595) passed, including the test and TypeScript/Vite build steps.
- Explicitly not included: combat damage, healing rates, injury progression, save persistence, event logic, or UI integration. These require their own source/dependency audits and tests.
- No Android APK build was produced by this validation run.


### Offline-game code milestone — Satiety/metabolism (2026-11-01)

- Source: `core/HUNGER_AND_METABOLISM.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `66bdc7d4fe4d5270cf3c40193909aca582ac1dde`.
- Code: `src/offline-game/mechanics/satiety.ts`.
- Tests: `tests/offline-game-satiety.test.ts` (9 tests).
- Validation: [Web App Validation #572](https://github.com/Antarezka/merzkava-apk/actions/runs/41305824767) passed with 7 test files / 52 tests, TypeScript, gateway type-check, and Vite build.
- Implemented: official base-time rates; activity, missed-meal, body-condition and verified biological multipliers; combined ×8 cap; full internal precision with one-decimal display; verified intake and portion values.
- Not implemented here: time-window transition logic, meal-opportunity adjudication, sleep-state transitions, persistent Satiety state, injury/HP consequences, or UI.
- Source discrepancy: the Spirit Primordial 24-hour Light example (≈0.014) conflicts with the stated 365-day base/formula (≈0.342466). Code follows the explicit table/formula and surfaces a warning. Upstream canon remains unchanged.
- Current foundation: **5 modules implemented and CI-verified (HP + Satiety + Injury + Time/Day-left + Combat)**. The full offline engine remains incomplete; no whole-engine percentage is assigned.
- CI dependency audit: four moderate advisories in development tooling (`@capacitor/cli`, `glob`, `minimatch`, `rimraf`); production-only audit reports zero vulnerabilities. The current workflow does not fail on this advisory report. No unsafe major-version downgrade was applied.


### Offline-game code milestone — Injury recovery (2026-11-01)

- Source: `core/INJURY_SYSTEM.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `a90d3d1c58afd3da171d66bc632b23e2a30cbbfd`.
- Code: `src/offline-game/mechanics/injury.ts`.
- Tests: `tests/offline-game-injury.test.ts` (5 tests).
- Validation: [Web App Validation #577](https://github.com/Antarezka/merzkava-apk/actions/runs/41306410019) passed: 8 test files / 57 tests, TypeScript, gateway type-check, and Vite build.
- Implemented: Class I–IV baseline recovery rates, proportional elapsed-time calculation, full-rest and correct-treatment requirements, structural treatment gate for Class III, stabilization and continuing-care gate for Class IV, 100% cap.
- Deliberately not implemented: injury diagnosis, class inference from HP damage, activity penalty numbers, treatment quality bonus, complication odds, specific medicine effects, or residual effects. No numeric rule is invented where the canon leaves discretion to GM/evidence.
- Current foundation: **3 modules implemented and CI-verified (HP + Satiety + Injury)**. This is not a complete game engine, and no overall percentage is assigned.
- Android Build #320 is currently building earlier source commit `6310974`; it does not include the Injury test file or later documentation updates. A new Android build is required for the latest source once changes are complete.


### Offline-game code milestone — Time and cooldown (2026-11-01)

- Source: `gameplay/TIME_AND_ACTION_RULES.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `f4ad8b2e1afc0bc9ef25f8f9d97eb541ab7ea29f`.
- Code: `src/offline-game/mechanics/time.ts`.
- Tests: `tests/offline-game-time.test.ts` (9 tests).
- Validation: [Web App Validation #584](https://github.com/Antarezka/merzkava-apk/actions/runs/41306800435) passed: 9 test files / 66 tests, TypeScript, gateway type-check, and Vite build.
- Implemented: fallback calendar and seasons, date/time rollover, action-duration limits, protected night sleep, pure-cultivation eligibility and 30-day cap, verified Satiety accounting, cooldown accumulation excluding cultivation, and Day-left ceiling.
- Explicit boundary: session era, initial date/weather/weekday anchor, travel durations, and actual action success are inputs/decisions from the session/game world; this utility does not invent them.
- Current foundation: **9 modules implemented and CI-verified (HP + Satiety + Injury + Time/Day-left + Combat + Spirit Ring compatibility + Spirit Ring progression + Martial Soul Awakening)**. The full game engine remains incomplete; no overall percentage is assigned.
- Android Build #322 is still a separate build/emulator run. It targets the Time module commit before the test-fixture-only follow-up; no final APK status is implied here.


### Offline-game code milestone — Combat formulas (2026-11-01)

- Source: `gameplay/COMBAT_SYSTEM.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `bc7d85a0e3521c30716b1859f5fdf070417d684c`.
- Code: `src/offline-game/mechanics/combat.ts`.
- Tests: `tests/offline-game-combat.test.ts` (10 tests).
- Validation: [Web App Validation #592](https://github.com/Antarezka/merzkava-apk/actions/runs/41307268016) passed: 10 test files / 76 tests, TypeScript, gateway type-check, and Vite build.
- Implemented: Combat Rating, combat ratio, hit chance/d100, square-root power adjustment, official damage classes and defense reductions, upward rounding, current HP cap, combo follow-up gating and half-base damage.
- High-output 18% damage and 9% follow-up require explicit confirmation. The module accepts only the published readiness factors and does not infer tactical advantages, equipment, move access, defense, or injuries.
- Source observation: for positive combat ratios the hit-chance formula's raw minimum approaches 25%, so the stated 10% lower clamp is unreachable with valid inputs. Code preserves the source formula/clamp; no upstream canon edit was made.
- Current foundation: **5 modules implemented and CI-verified (HP + Satiety + Injury + Time/Day-left + Combat)**. The full game engine remains incomplete; no overall percentage is assigned.
- Android Build #324 is a separate build on the Combat implementation commit and remains subject to package/emulator checks.


### Offline-game code milestone — Spirit Ring formulas (2026-11-01)

- Source: `core/SPIRIT_RING_RULES.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6`; blob `72666ef29bd5df41364f4727596747606fe581cf`.
- Runtime: `spirit-ring-compatibility.ts` and `spirit-ring-progression.ts`; regression coverage: 15 tests.
- Implements age pressure/EAG, Sync cap, gated success/defect chance, AWR, geometric compatibility, PowerScale, Qi, absorption gates, forced deviation damage, and risk classification.
- Web App Validation #600 passed: 12 test files / 91 tests, TypeScript, gateway type-check, and Vite production build.
- Seven deterministic modules are CI-verified; full offline game remains incomplete and has no overall completion percentage.
- Android Build #327: APK package/version/alignment/signature verification passed; Android 14 emulator smoke test remains pending.


## Expanded Archive coverage and offline formula preservation — 2026-11-01

**Current curated catalogue:** 47 dossiers / 43 unique Universe source paths.

Eight new reviewed public-safe dossier extracts were added:

| Dossier ID | Universe source | Source handling |
|---|---|---|
| `imperial-governance` | `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md` | Public civil/military hierarchy; no GM procedure or strategic allocation formula in the player extract |
| `imperial-public-services` | `world/GOLDEN_DRAGON_EMPIRE_POPULATION_SERVICES.md` | Named institutions and service-gradient overview; no assumption of universal branch availability |
| `open-learning-paths` | `world/OPEN_LEARNING_PATHS_AND_WANDERING_INSTRUCTORS.md` | Public learning categories; GM encounter-generation procedure excluded |
| `social-stratification` | `world/SOCIAL_STRATIFICATION.md` | Broad social layers; no invented local percentages or incomes |
| `three-power-routes` | `world/THREE_POWER_PERSPECTIVE_MAPS.md` | Relative route framework; no invented coordinates, distances, or travel times |
| `geography-travel` | `world/GEOGRAPHY_AND_TRAVEL.md` | Curated geography/transport overview; source remains mixed-scope |
| `tianhai-academies` | `world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md` | Four academies and Institute role; all progression mechanics remain in core |
| `world-wealth` | `world/WEALTH_DISTRIBUTION.md` | Aggregate accounting estimates with liquidity and character-knowledge caveats |

The source-disposition model remains distinct from dossier publication: six of the new dossiers use `PUBLIC_CANDIDATE` sources, while geography/travel uses `PARTIAL_PUBLIC`. The wealth model's player extract is curated; the full source remains a review candidate. The hidden mountain groups in `world/ANCIENT_SHAMANISM_AND_BUDDHIST_CLANS.md` are deliberately not exposed as a dossier because their identities and discovery boundaries are GM-sensitive.

### Updated path metrics

- Whole Universe Markdown footprint: 43/140 = **30.7%**.
- Potential player-facing / review-needed scope: 43/72 = **59.7%**.
- Already dispositioned public-scope sources: 43/44 = **97.7%**.
- These figures measure source-path mapping only, not claim-level completeness or overall game readiness.

### Formula source preservation for the future offline game

`docs/OFFLINE_GAME_CANON_FORMULA_SNAPSHOT.md` now preserves all 16/16 `MECHANICS_REFERENCE` modules verbatim from Universe commit `2f76a864150528afb0e3d26cb16f9396ce610ff6`, plus the complete `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md` source containing the supplemental Strategic Awakening regional-allocation formula. Four additional source modules—global wealth distribution, social stratification, Golden Dragon population services, and open learning paths—are preserved verbatim as supporting offline-simulation data/procedures, not mislabelled as formula modules. The snapshot retains upstream blob SHAs and source boundaries. It is a development-only reference: do not expose the full snapshot through the player Archive or treat it as a replacement for the canonical Universe repository.

The new dossier tests are committed but have not yet been executed in this environment. No new APK build is claimed by this content update.


### Offline-game code milestone — Martial Soul Awakening (2026-11-01)

- Source: `core/MARTIAL_SOUL_AWAKENING.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6`; blob `fe56339b8c8fb2d70597c8a03891b7cf947a9cf8`.
- Runtime: `src/offline-game/mechanics/martial-soul-awakening.ts`; 22 regression tests.
- Implements rarity 1–100, player STOP/CONTINUE mutation decision, one 10% mutation roll, age eligibility, and separate evidence-based inherent-quality score.
- Web App Validation #610 passed: 13 test files / 114 tests, TypeScript, gateway type-check, Vite production build.
- The resolver consumes supplied rolls; an auditable offline RNG, state orchestration, and persistence remain separate tasks.
- Eight deterministic modules are CI-verified; no full-game completion percentage is assigned.


## Claim-reviewed NPC public extracts — 2026-11-01

Twenty-four NPC profiles previously classified `REVIEW_REQUIRED` now have separate public-safe dossiers based only on their explicitly labelled public-profile material and verified role/affiliation facts. The curated extracts deliberately omit private whereabouts, exact residences, secret affiliations, undisclosed relationships, private incidents, and unconfirmed capabilities.

| Region / group | New dossier IDs |
|---|---|
| Beiming Gu | `beiming-jingheng`, `beiming-xuanyu`, `binghe-chuanliu`, `lan-feng`, `cangxue-beiran`, `cangxue-tielan`, `shuang-yue`, `hanyue-mingzhao`, `tie-song`, `lingfeng-yujin`, `minghu-yanshu`, `mo-xueyan`, `bai-yushen`, `tieshi-beiyue`, `xuanbing-lingsu`, `xuanbing-yue`, `xuansong-qinghe`, `xuanye-zhenbei`, `yaochi-suwen`, `yinshan-qiaofeng` |
| Golden Dragon Empire | `luo-zhenkai`, `shen-yunting` |
| Tianhai Yunzhou | `duan-haicheng`, `lin-qiaoyu` |

All 24 source files are now marked `PUBLIC_CANDIDATE` for the curated extract only. Their raw canonical Markdown is still not bundled. Beiming Nerva and Ying Wuxin remain excluded as GM-only identities; no private player profile has been published.

### Updated path metrics

- Whole Universe Markdown footprint: 72/140 = **51.4%**.
- Potential player-facing / review-needed scope: 71/71 = **100%**.
- Already dispositioned public-scope sources: 71/71 = **100%**.
- Remaining source review: three review-required world modules and one intentionally withheld hidden-group module. The latter is excluded to preserve discovery and GM narrative control, not because it was forgotten.
- These are path metrics. They do not prove every canon claim, relationship edge, alias, or UI route has been verified.


## Player-facing source coverage target reached — 2026-11-01

**Archive catalogue:** 87 curated dossiers / 71 unique player-facing source paths, plus 3 explicit `ON_PLAN` placeholders.

The remaining three previously review-required source files now have claim-reviewed public extracts:

- `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md`: 14 named central officeholders and regional governors are individually clickable. Only verified office assignments are shown; political dispositions, private agendas, personal stats, and legacy office records are excluded.
- `world/IMPERIAL_SPECIAL_FINANCIAL_AUDIT_COMMITTEE.md`: public institutional mandate only. Unnamed personnel, confidential cases, internal procedures, and unconfirmed involvement in Luca's family case are excluded.
- `world/PRISON_AND_BOUND_ITEMS.md`: high-level restraint categories and functional boundaries only. No universal numeric effects or GM custody procedures are invented.

Two intentionally incomplete/redirecting sources are also handled explicitly:

- `world/ANCIENT_SHAMANISM_AND_BUDDHIST_CLANS.md` maps to the non-revealing `placeholder-remote-mountain-traditions` with status `ON_PLAN`. The app does not disclose group identities, membership, affiliations, capabilities, or discovery details.
- `world/REGION_BEIMING_HEARTLAND.md` is reclassified as `LEGACY_OR_COMPATIBILITY` and points to the consolidated `beiming` dossier; it is not treated as an independent region.

### Final source-path metrics for this pinned Universe snapshot

- Approved player-facing source scope: 71/71 mapped to curated dossiers or explicit placeholders = **100%**.
- Whole Universe Markdown inventory: 72/140 paths mapped to player-facing dossiers/placeholders or the legacy Beiming redirect = **51.4%**.
- Remaining 69/140 paths are intentionally handled outside the player-facing Archive: repository control, mechanics reference, private player data, GM-only content, internal templates, and legacy compatibility.
- Canonical mechanics preservation: 16/16 mechanics-reference modules copied verbatim, plus the full supplemental Golden Dragon governance source containing the strategic-awakening regional-allocation formula.
- These metrics certify path disposition/mapping only. They do not certify every link, alias, relationship, claim, search result, UI state, build, or physical-device behavior.

**Important distinction:** 100% means complete coverage of the approved player-facing source scope, not publication of all 140 files and not 100% completion of the future offline game engine.


### Offline-game code milestone — Economy (2026-11-01)

- Source: `core/10_ECONOMY_SYSTEM.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6`; blob `0cc74b40d07ad8b2fe9fd2e4c37cdad1c0269456`.
- Runtime: `economy-wallet.ts` and `economy-pricing.ts`; tests: 9.
- Implements exact official currency ratios and normalization, unified price formula, condition/tier/demand/effective-scarcity factors, distribution/local adjustments, and disaster-band validation.
- Web App Validation #634 passed: 14 test files / 126 tests, TypeScript, gateway type-check, Vite production build.
- Nine deterministic modules are CI-verified; whole offline game remains incomplete.


### Offline-game code milestone — Arcanistry (2026-11-01)

- Canon source: `core/ARCANISTRY_AND_FORMULATION.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6` (blob `ef674a1fba92facd5e521f0fc7f08c7e730c7d2f`).
- Runtime: `src/offline-game/mechanics/arcanistry.ts`; regression tests: 5.
- Implements the Grade 1–10 × Tier 1–10 baseline production-chance matrix, guided-training schedule, production-time and Mortal-Satiety tables, focus-stage/Grade 1 gates, production-experience points, and Artificial Artifact condition score/thresholds. It does not invent random-resolution procedures or numeric situational modifiers.
- Web App Validation #653 passed: 15 test files / 133 tests, TypeScript, gateway type-check, and Vite production build.
- Ten deterministic modules are CI-verified. Android Build #340 produced a verified APK artifact, but emulator installation/smoke success is not claimed because the Android 14 emulator step was cancelled.
