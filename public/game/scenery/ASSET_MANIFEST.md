# Offline Game Scenery Asset Manifest

Status: initial directory and naming plan  
Repository branch: `feature/archive-experience`

## Image specification
- Master landscape: 1920×768 px, 2.5:1.
- Runtime background: WebP recommended.
- Transparent overlays/source elements: PNG.
- Keep master scenes free of baked-in weather, time-of-day lighting, text, UI, and characters.
- Time/weather variants should normally be produced with Anime.js layers, particles, and lighting overlays.

## Golden Dragon Empire
| ID | Asset | Target path | Status |
|---|---|---|---|
| GDE-01 | Imperial city panorama / establishing view | `golden-dragon-empire/establishing-views/gde-01-imperial-city-panorama.webp` | Artwork made; awaiting file upload |
| GDE-02 | Traditional city street | `golden-dragon-empire/streets/gde-02-city-street.webp` | Not started |
| GDE-03 | Imperial city gate | `golden-dragon-empire/architecture/gde-03-city-gate.webp` | Not started |
| GDE-04 | Marketplace street | `golden-dragon-empire/streets/gde-04-marketplace.webp` | Not started |
| GDE-05 | Cultivation academy courtyard | `golden-dragon-empire/architecture/gde-05-academy-courtyard.webp` | Not started |
| GDE-06 | Rural village landscape | `golden-dragon-empire/settlements/gde-06-village.webp` | Not started |
| GDE-07 | Mountain and wilderness panorama | `golden-dragon-empire/nature/gde-07-mountain-wilderness.webp` | Not started |

## Tianhai Yunzhou
| ID | Asset | Target path | Status |
|---|---|---|---|
| TY-01 | Floating island / city establishing panorama | `tianhai-yunzhou/establishing-views/ty-01-floating-island-panorama.webp` | Not started |
| TY-02 | Skyport and airship approach | `tianhai-yunzhou/transport/ty-02-skyport.webp` | Not started |
| TY-03 | Elevated city street | `tianhai-yunzhou/streets/ty-03-elevated-street.webp` | Not started |
| TY-04 | Market district environment | `tianhai-yunzhou/streets/ty-04-market.webp` | Not started |
| TY-05 | Academy environment | `tianhai-yunzhou/architecture/ty-05-academy.webp` | Not started |
| TY-06 | Island edge / sea-and-cloud panorama | `tianhai-yunzhou/nature/ty-06-island-edge.webp` | Not started |
| TY-07 | Residential terrace | `tianhai-yunzhou/settlements/ty-07-residential-terrace.webp` | Not started |

## Beiming Gu
| ID | Asset | Target path | Status |
|---|---|---|---|
| BG-01 | Northern territory establishing panorama | `beiming-gu/establishing-views/bg-01-northern-panorama.webp` | Not started |
| BG-02 | Snowbound settlement | `beiming-gu/settlements/bg-02-snowbound-settlement.webp` | Not started |
| BG-03 | Blue-Flame Silver Tiger wilderness habitat | `beiming-gu/nature/bg-03-blue-flame-wilderness.webp` | Not started |
| BG-04 | Rare-metal mining landscape | `beiming-gu/industry/bg-04-mining-landscape.webp` | Not started |
| BG-05 | Mountain pass | `beiming-gu/nature/bg-05-mountain-pass.webp` | Not started |
| BG-06 | Beiming Gu architecture / hall | `beiming-gu/architecture/bg-06-hall.webp` | Not started |
| BG-07 | Frozen lake or river environment | `beiming-gu/nature/bg-07-frozen-waterway.webp` | Not started |

## Lawless territories and special locations
These are broad asset categories only. Exact place names and scene details must be verified against the World Archive before creating location-specific artwork.
| ID | Asset | Target path | Status |
|---|---|---|---|
| LT-01 | Lawless territory wilderness panorama | `lawless-territories/establishing-views/lt-01-wilderness-panorama.webp` | Not started |
| LT-02 | Southern port and isles environment | `lawless-territories/coastal/lt-02-southern-port-isles.webp` | Not started |
| AZ-01 | Azerion outer approach / illusion-fog boundary | `special-locations/azerion/az-01-illusion-fog-approach.webp` | Not started |
| AZ-02 | Azerion great lake | `special-locations/azerion/az-02-great-lake.webp` | Not started |
| RA-01 | Ruined Archiver outpost / field station | `special-locations/ruined-archiver/ra-01-field-station.webp` | Not started |

## Shared reusable effects
These are overlays or procedural effects, not separate painted scenery for every time/weather combination.
| ID | Asset | Target path | Status |
|---|---|---|---|
| FX-01 | Soft cloud layer, transparent | `shared/atmosphere/fx-01-cloud-layer.png` | Not started |
| FX-02 | Fog layer, transparent | `shared/atmosphere/fx-02-fog-layer.png` | Not started |
| FX-03 | Sun disc / glow, transparent | `shared/lighting/fx-03-sun-glow.png` | Not started |
| FX-04 | Moon disc / glow, transparent | `shared/lighting/fx-04-moon-glow.png` | Not started |
| FX-05 | Light rays, transparent | `shared/lighting/fx-05-light-rays.png` | Not started |
| FX-06 | Rain streak texture, transparent | `shared/weather/fx-06-rain-streaks.png` | Not started |
| FX-07 | Snow / petal / leaf particles | Procedural Anime.js preferred | Not started |
| FX-08 | Lightning flash | Procedural Anime.js preferred | Not started |

## Important
The checklist is an art-production plan, not a claim that all listed scenes or place names are canon. Only the broad realm identities are used here; exact settlement names must be taken from verified World Archive entries. The image marked “Artwork made” is not stored in this repository yet.
