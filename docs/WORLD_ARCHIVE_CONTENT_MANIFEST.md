# World Archive — Content Manifest & Audit Gate

> Status: inventory baseline; not a publication approval. Generated from the current repository trees and the APK's local lore catalogue.

## Source snapshots

- Universe repository: `Antarezka/merzkava-universe`
- Universe branch: `main`
- Universe commit: `2f76a864150528afb0e3d26cb16f9396ce610ff6`
- APK repository: `Antarezka/merzkava-apk`
- APK branch: `feature/archive-experience`
- APK lore catalogue path: `src/lore/lore-library.ts`
- APK lore catalogue blob SHA: `8c365dfafa7d320f1a191accb8d54d474a2ae400`
- Current local entries: **26**
- Unique local source files: **23**
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
8. Search/highlighting must use a central entity index, not only the aliases of the currently visible 26 entries. Ambiguous names must not link to the wrong entity.

## Visibility classes

| Class | Meaning | Player Archive policy |
|---|---|---|
| `PUBLISHED` | Explicitly public/world-known canon | May publish after source review and neutral rewrite |
| `GM_ONLY` | Secrets, hidden identity/agenda, restricted whereabouts, unrevealed facts | Never show in player Archive; keep out of public search index |
| `MECHANICS_REFERENCE` | Gameplay rules and numerical/mechanical authority | Do not duplicate as lore; link to authority only in GM/developer context if needed |
| `PRIVATE_PLAYER_DATA` | Player profile, save, session, personal ledger or notes | Never include in public Archive |
| `REVIEW_REQUIRED` | Access scope or factual status not yet fully established | Block publication until manually reviewed |
| `LEGACY_OR_COMPATIBILITY` | Deprecated, superseded, or compatibility pointer | Do not publish as independent canon; resolve to current source |

## Current APK catalogue audit

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
- Source paths currently referenced by the APK:
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

The World Archive is not complete until every source in scope has a reviewed disposition, every approved public entity/article has a local document, every restricted source has a documented exclusion/split, and all internal links pass validation. The current 26-entry catalogue is a starter set, not complete coverage.

## Audit limitation

This manifest records a verified tree inventory and the current local catalogue/source-path coverage. It does not claim that all 140 source Markdown documents have been line-by-line content-reviewed or that every candidate fact is public. Those reviews must be recorded before publication.