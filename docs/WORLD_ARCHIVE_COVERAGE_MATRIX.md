# World Archive — Coverage Matrix (Phase 1)

> AI/developer handoff baseline. This matrix covers every Markdown path in the pinned Universe tree. A disposition is a handling decision, **not** publication permission.

- Audited: 2026-11-01
- Universe source: `Antarezka/merzkava-universe` / `main` / `2f76a864150528afb0e3d26cb16f9396ce610ff6`
- APK: `Antarezka/merzkava-apk` / `feature/archive-experience`; pre-documentation baseline `67c5186ffac266fde41ddf82fd2fd3042d412486`
- Current app catalogue: **87 dossiers / 71 unique player-facing source paths**.

## Phase 1 inventory

| Disposition | Files |
|---|---:|
| `GM_ONLY` | 4 |
| `INTERNAL_TEMPLATE` | 9 |
| `LEGACY_OR_COMPATIBILITY` | 16 |
| `MECHANICS_REFERENCE` | 16 |
| `PARTIAL_PUBLIC` | 9 |
| `PRIVATE_PLAYER_DATA` | 7 |
| `PUBLIC_CANDIDATE` | 41 |
| `PUBLISHED` | 21 |
| `REPOSITORY_CONTROL` | 17 |
| `REVIEW_REQUIRED` | 0 |
| **Total** | **140** |

## Coverage score — verified source-path metrics (2026-11-01)

These percentages measure **source-path coverage**, not claim-by-claim completeness. A dossier may curate only selected public claims from a source file, so a mapped path is not proof that every paragraph or fact has been reviewed or published.

| Measure | Calculation | Progress | Meaning |
|---|---:|---:|---|
| Whole-repository source footprint | 72 mapped paths / 140 Markdown paths | **51.4%** | How much of the entire Universe Markdown inventory currently has at least one Archive dossier mapping. |
| Potential player-facing source scope | 71 mapped / 71 eligible-or-review-needed paths | **100%** | The 71 comprise 21 `PUBLISHED`, 9 `PARTIAL_PUBLIC`, and 41 `PUBLIC_CANDIDATE` source files; no source remains in `REVIEW_REQUIRED`. |
| Already dispositioned public-scope paths | 71 mapped / 71 `PUBLISHED` + `PARTIAL_PUBLIC` + `PUBLIC_CANDIDATE` paths | **100%** | Coverage among sources already classified into a public-facing disposition; it does not mean every claim is approved. |
| Canonical mechanics source preservation | 16 / 16 `MECHANICS_REFERENCE` modules copied verbatim, plus the supplemental governance allocation formula | **100% preserved** | Exact development snapshot exists separately in `docs/OFFLINE_GAME_CANON_FORMULA_SNAPSHOT.md`. One supplemental formula-bearing governance source is also preserved. |
| Initial deterministic mechanic implementation | 7 foundational modules: HP, Satiety, Injury, Time/Day-left, Combat, Spirit Ring compatibility, and Spirit Ring progression | **7 modules implemented; CI verified** | HP state consistency, Satiety interval/intake, Injury recovery, Time/Day-left, Combat, and Spirit Ring formulas are implemented. Overall engine percentage is not baselined; remaining formula domains and dependencies still require an inventory. |

**Current Archive inventory:** 87 curated dossiers / 71 unique player-facing source paths, plus 3 explicit ON_PLAN placeholders and 1 mapped legacy redirect. The 16 mechanics-reference files are intentionally not published as ordinary Archive lore. Claim-level content completeness remains **not yet measured**; do not turn the path ratios above into a claim that the Archive is 51.4% or 100% complete in every dimension.

**How to read the progress:** use **100%** as the source-path coverage of the approved player-facing scope, **51.4%** as the whole-repository path footprint, and report formula preservation and game-engine implementation separately. Never combine these into one misleading average.

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
| `regions/beiming-gu/npcs/BEIMING_JINGHENG.md` | `PUBLIC_CANDIDATE` | `beiming-jingheng` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/BEIMING_NERVA.md` | `GM_ONLY` | — |  |
| `regions/beiming-gu/npcs/BEIMING_XENHWA.md` | `PUBLISHED` | `beiming-xenhwa` |  |
| `regions/beiming-gu/npcs/BEIMING_XUANYU.md` | `PUBLIC_CANDIDATE` | `beiming-xuanyu` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/BINGHE_CHUANLIU.md` | `PUBLIC_CANDIDATE` | `binghe-chuanliu` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/BLUE_FLAME_DOJO_MASTER.md` | `PUBLIC_CANDIDATE` | `lan-feng` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/CANGXUE_BEIRAN.md` | `PUBLIC_CANDIDATE` | `cangxue-beiran` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/CANGXUE_TIELAN.md` | `PUBLIC_CANDIDATE` | `cangxue-tielan` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/FROSTPEAK_DOJO_MASTER.md` | `PUBLIC_CANDIDATE` | `shuang-yue` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/HANYUE_MINGZHAO.md` | `PUBLIC_CANDIDATE` | `hanyue-mingzhao` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/IRONROOT_DOJO_MASTER.md` | `PUBLIC_CANDIDATE` | `tie-song` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/LINGFENG_YUJIN.md` | `PUBLIC_CANDIDATE` | `lingfeng-yujin` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/MINGHU_YANSHU.md` | `PUBLIC_CANDIDATE` | `minghu-yanshu` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/REGISTRY.md` | `REPOSITORY_CONTROL` | — |  |
| `regions/beiming-gu/npcs/SILENT_SNOW_DOJO_MASTER.md` | `PUBLIC_CANDIDATE` | `mo-xueyan` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/SILVER_TIGER_DOJO_MASTER.md` | `PUBLIC_CANDIDATE` | `bai-yushen` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/TIESHI_BEIYUE.md` | `PUBLIC_CANDIDATE` | `tieshi-beiyue` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/XUANBING_LINGSU.md` | `PUBLIC_CANDIDATE` | `xuanbing-lingsu` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/XUANBING_YUE.md` | `PUBLIC_CANDIDATE` | `xuanbing-yue` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/XUANSONG_QINGHE.md` | `PUBLIC_CANDIDATE` | `xuansong-qinghe` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/XUANYE_ZHENBEI.md` | `PUBLIC_CANDIDATE` | `xuanye-zhenbei` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/YAOCHI_SUWEN.md` | `PUBLIC_CANDIDATE` | `yaochi-suwen` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/beiming-gu/npcs/YINSHAN_QIAOFENG.md` | `PUBLIC_CANDIDATE` | `yinshan-qiaofeng` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/golden-dragon-empire/INDEX.md` | `REPOSITORY_CONTROL` | — |  |
| `regions/golden-dragon-empire/npcs/JUN_HAOTIAN.md` | `PUBLISHED` | `jun-haotian` |  |
| `regions/golden-dragon-empire/npcs/JUN_RUIYUAN.md` | `PUBLISHED` | `jun-ruiyuan` |  |
| `regions/golden-dragon-empire/npcs/JUN_YUEJIN.md` | `PUBLISHED` | `jun-yuejin` |  |
| `regions/golden-dragon-empire/npcs/LUO_ZHENKAI.md` | `PUBLIC_CANDIDATE` | `luo-zhenkai` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/golden-dragon-empire/npcs/REGISTRY.md` | `REPOSITORY_CONTROL` | — |  |
| `regions/golden-dragon-empire/npcs/SHEN_YUEHUA.md` | `PUBLISHED` | `shen-yuehua` |  |
| `regions/golden-dragon-empire/npcs/SHEN_YUNTING.md` | `PUBLIC_CANDIDATE` | `shen-yunting` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/tianhai-yunzhou/INDEX.md` | `REPOSITORY_CONTROL` | — |  |
| `regions/tianhai-yunzhou/npcs/BAI_XUANYIN.md` | `PUBLISHED` | `bai-xuanyin` |  |
| `regions/tianhai-yunzhou/npcs/DUAN_HAICHENG.md` | `PUBLIC_CANDIDATE` | `duan-haicheng` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
| `regions/tianhai-yunzhou/npcs/JI_HAOYUAN.md` | `PUBLISHED` | `ji-haoyuan` |  |
| `regions/tianhai-yunzhou/npcs/JI_NINGZHAO.md` | `PUBLISHED` | `ji-ningzhao` |  |
| `regions/tianhai-yunzhou/npcs/JI_ZHAONING.md` | `PUBLISHED` | `ji-zhaoning` |  |
| `regions/tianhai-yunzhou/npcs/LIN_QIAOYU.md` | `PUBLIC_CANDIDATE` | `lin-qiaoyu` | Claim-reviewed public profile only; private whereabouts, relationships, secret ties, and unconfirmed abilities omitted. |
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
| `world/ANCIENT_SHAMANISM_AND_BUDDHIST_CLANS.md` | `PARTIAL_PUBLIC` | `placeholder-remote-mountain-traditions` | Non-revealing ON_PLAN placeholder only; concealed group identities, roster, affiliation, and discovery details are deliberately withheld. |
| `world/ARTIFACTS_AND_RELICS.md` | `PARTIAL_PUBLIC` | `artifacts` |  |
| `world/ARTIFICIAL_ARTIFACTS.md` | `PARTIAL_PUBLIC` | `floating-island-artifact` |  |
| `world/CANON_DECISIONS_AND_PRECEDENCE.md` | `REPOSITORY_CONTROL` | — |  |
| `world/CANON_LOAD_ROUTER.md` | `REPOSITORY_CONTROL` | — |  |
| `world/DYNAMIC_EVENTS.md` | `GM_ONLY` | — |  |
| `world/FACTIONS.md` | `PARTIAL_PUBLIC` | `factions; medicine-hall; ordo-suci-tianming` |  |
| `world/GEOGRAPHY_AND_TRAVEL.md` | `PARTIAL_PUBLIC` | `geography-travel` | Curated physical geography and transport overview; GM procedures and restricted encounter detail excluded. |
| `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md` | `PUBLISHED` | `golden-dragon` |  |
| `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md` | `PUBLIC_CANDIDATE` | `imperial-governance` | Curated public civil/military hierarchy only; internal formula, audit procedure and GM controls remain in development snapshot. |
| `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md` | `PUBLIC_CANDIDATE` | `official-xuanyuan-wenyuan`; `official-shen-mingde`; `official-yunlan-qingzhi`; `official-baihu-zhengyang`; `official-gu-jingheng`; `official-cangyue-yucheng`; `official-heiyu-zhaolin`; `official-xuanyuan-haoran`; `official-cangyue-yunhe`; `official-tieyan-mingxuan`; `official-yunlan-qinglan`; `official-yanling-zhenyu`; `official-baihu-xuefeng`; `official-zhenhai-haixiu` | Only named central officeholders and seven regional governors with current office assignments; political agendas, dispositions, stats and legacy office records excluded. |
| `world/GOLDEN_DRAGON_EMPIRE_POPULATION_SERVICES.md` | `PUBLIC_CANDIDATE` | `imperial-public-services` | Curated named institutions and service-gradient overview; full branch register and access details are not exposed. |
| `world/HISTORY.md` | `PUBLISHED` | `history; arcanistry` |  |
| `world/IMPERIAL_SPECIAL_FINANCIAL_AUDIT_COMMITTEE.md` | `PUBLIC_CANDIDATE` | `imperial-audit-committee` | Public institutional mandate only; no unnamed personnel identities, confidential cases, internal procedures, or unconfirmed involvement disclosed. |
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
| `world/OPEN_LEARNING_PATHS_AND_WANDERING_INSTRUCTORS.md` | `PUBLIC_CANDIDATE` | `open-learning-paths` | Public learning categories and no-faction access only; GM encounter-generation procedure excluded. |
| `world/PRISON_AND_BOUND_ITEMS.md` | `PUBLIC_CANDIDATE` | `prison-bound-items` | High-level restraint categories and limits only; no invented numeric effects or GM custody procedures. |
| `world/REGIONAL_REPOSITORY_ARCHITECTURE.md` | `REPOSITORY_CONTROL` | — |  |
| `world/REGION_ASHEN_BORDERLANDS.md` | `PUBLISHED` | `ashen-borderlands` |  |
| `world/REGION_AZUREFLAME_BASIN.md` | `LEGACY_OR_COMPATIBILITY` | — |  |
| `world/REGION_BAIYUE.md` | `PUBLIC_CANDIDATE` | `region-baiyue` | Curated regional facts only; raw file includes unreviewed local NPC/encounter material. |
| `world/REGION_BEIMING_GU.md` | `PUBLISHED` | `beiming` |  |
| `world/REGION_BEIMING_HEARTLAND.md` | `LEGACY_OR_COMPATIBILITY` | `beiming` | Compatibility redirect to the consolidated Beiming Gu dossier; not an independent regional source or dossier. |
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
| `world/SOCIAL_STRATIFICATION.md` | `PUBLIC_CANDIDATE` | `social-stratification` | Public broad social layers only; no invented local poverty, slum, income or population percentages. |
| `world/SPIRIT_HUNTERS_GUILD.md` | `PUBLISHED` | `spirit-hunters-guild` |  |
| `world/THREE_POWER_PERSPECTIVE_MAPS.md` | `PUBLIC_CANDIDATE` | `three-power-routes` | Curated route framework; schematic only, no invented coordinates, local edges, duration or safety guarantees. |
| `world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md` | `PUBLIC_CANDIDATE` | `tianhai-academies` | Curated four academies, four cardinal areas and Institute role; progression and formula remain in core mechanics. |
| `world/WANLUO_SACRED_EXPANSE.md` | `PUBLISHED` | `wanluo; world-knowledge-tower` |  |
| `world/WEALTH_DISTRIBUTION.md` | `PUBLIC_CANDIDATE` | `world-wealth` | Curated aggregate accounting model with liquidity and character-knowledge caveats; GM-only rules excluded. |
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

**Latest documented Android build (not a build of these documentation commits):** Android Build #340 compiled and verified APK package/version/alignment/signature and uploaded an artifact. The Android 14 emulator step was cancelled, so installation/smoke-test success is not claimed. Web App Validation #653 separately passed 15 test files / 133 tests, TypeScript, gateway type-check, and Vite build; it is not APK evidence.

## Phase 1 exit checklist

- [x] 140/140 source paths assigned a disposition.
- [x] Current catalogue coverage recorded: 87 curated dossiers / 71 unique player-facing source paths, plus 3 explicit `ON_PLAN` placeholders.
- [x] Stable-ID/public-only linking contract documented.
- [x] AI start order and build caveat recorded.
- [ ] Re-verify against current recursive Universe tree before expanding.
- [~] Public entity graph, backlinks, placeholder routing, and search/navigation regression tests are implemented; Web App Validation #653 passed 15 test files / 133 tests. Physical-device graph QA remains open.
- [x] Implement offline local source reader for reviewed public-safe extracts; raw canonical Markdown remains excluded.
- [x] Approved player-facing source-path coverage reached 71/71; claim-level review and source freshness remain separate gates.
- [ ] Build and perform device navigation QA.

**Status:** Phase 1 source inventory, 87/71 catalogue coverage, public-only graph, and reviewed-extract source reader are implemented. CI validation is recorded; physical-device navigation, offline/isolation, accessibility, and claim-level QA remain release gates.


## Implementation checkpoint — clickable public entity graph (2026-11-01)

The existing catalogue derives each dossier's outbound `crossReferenceIds` from exact public titles and aliases mentioned in its summary/body. `loreLinks` turns those mentions into local `data-lore-open` buttons; targets are selected from `PUBLISHED` entries only. This pass adds `getLoreBacklinks(id)` and renders inbound **MENTIONED IN** dossier links. Regression tests cover outgoing clickable mentions, public-only targets, inbound links and invalid IDs.

- Runtime implementation: `src/lore/lore-library.ts`, commit `3dd0b21f32bdd383737da48d52248b96c623535a`.
- Regression tests: `tests/lore-library.test.ts`, commit `4ce04c872d39611b6fa782b8e2199f4157aa3b0f`.
- Web App Validation #653 passed 15 test files / 133 tests, TypeScript, gateway type-check, and Vite build. On-device graph/navigation/source-reader QA remains open.
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


## Offline-game implementation checkpoint — Spirit Ring formulas (2026-11-01)

- Canon source: `core/SPIRIT_RING_RULES.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6` (blob `72666ef29bd5df41364f4727596747606fe581cf`).
- Runtime modules: `src/offline-game/mechanics/spirit-ring-compatibility.ts` and `spirit-ring-progression.ts`; 15 focused tests.
- Implements age pressure/EAG, Sync cap, eligible-only success/defect formulas, AWR, geometric compatibility, AgeTotal/PowerScale, Qi, ring eligibility, deviation HP loss, multipliers, and risk classification.
- Web App Validation #600 passed on commit `9799378bddcd7bafb775ec37ed49b550ec014bf5`: 12 test files / 91 tests, TypeScript, gateway type-check, Vite build.
- Foundation now **9 deterministic modules CI-verified** (HP, Satiety, Injury, Time/Day-left, Combat, Spirit Ring compatibility, Spirit Ring progression). This is not a whole-game completion percentage.
- Android Build #327 package/signature verification passed; Android 14 emulator installation/smoke test is still running.


## Awakening engine milestone — 2026-11-01

- `core/MARTIAL_SOUL_AWAKENING.md` is pinned to Universe SHA `2f76a864150528afb0e3d26cb16f9396ce610ff6` (blob `fe56339b8c8fb2d70597c8a03891b7cf947a9cf8`).
- Runtime: `src/offline-game/mechanics/martial-soul-awakening.ts`; tests: 22.
- Rarity draw, explicit mutation decision/10% one-roll resolver, minimum age, and separate evidence-based inherent assessment are implemented.
- Validation #610 passed: 13 files / 114 tests, TypeScript, gateway type-check, Vite build.
- Eight deterministic modules are CI-verified; this is not full-game completion. RNG engine, orchestration, persistence, and remaining formulas remain open.


## Economy engine milestone — 2026-11-01

- Canon source: `core/10_ECONOMY_SYSTEM.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6` (blob `0cc74b40d07ad8b2fe9fd2e4c37cdad1c0269456`).
- Runtime: `economy-wallet.ts` and `economy-pricing.ts`; regression tests: 9.
- Five-currency normalization and unified pricing are implemented, including tier/condition/supply/demand and signed route/local adjustments.
- One effective scarcity factor prevents double-counting the same seasonal/disaster shortage; extreme/custom scarcity and exceptional demand require evidence.
- Web App Validation #634 passed: 14 test files / 126 tests, TypeScript, gateway type-check, Vite build.
- Nine deterministic modules are CI-verified; no whole-game completion percentage is claimed.
