# Arcanistry Victorian Ticket Engine

## Purpose

Replace the former rotary-dial travel interaction with a Victorian clockwork ticket machine. The machine is a physical-feeling Arcanistry apparatus, not a phone, arcade cabinet, or modern vending interface.

## Visual system

- Dark metal, aged brass, engraved plates, enamel, visible rivets, precision clockwork, springs, pulleys, shafts, tension cables, and thread.
- Destination cards use the existing scenery artwork.
- Available routes keep a thin breathing blue perimeter light.
- Unavailable routes keep a thin breathing orange perimeter light.
- Selecting a destination adds a warm ivory-gold illumination to its artwork only; the blue/orange availability light continues breathing unchanged.
- The side lever is an elegant, heavy Victorian mechanism with a brass pivot, shaft, and ornate handle.

## Interaction sequence

1. Select a destination card.
2. Only a verified, currently mapped route enables the lever.
3. Pull the lever downward through its full travel. A tap or incomplete pull must not activate the machine.
4. The lever engages the transmission: visible gears rotate at different rates, cables and pulleys travel, and the spring assembly compresses and releases.
5. The machine body shakes with several weighted mechanical beats as the lever engages and the ticket printer runs.
6. A paper ticket slowly emerges halfway from the issue slot and remains attached to the machine.
7. The player must drag the ticket downward past its tear threshold. Releasing early returns the ticket to its hanging position and does not travel.
8. Tearing the ticket triggers a final mechanical jolt and opens the transit loading overlay.
9. Keep the loading overlay visible for at least 3 seconds, then perform the verified location transition.

## Route safety

Only existing verified scene mappings are travelable: gde-city and gde-academy. Every other listed destination remains visible as Coming Soon and cannot issue a ticket. Do not infer travel support from scenery assets alone.

## Motion and input

- Anime.js handles motion; ordinary DOM elements and CSS handle presentation.
- Native DOM pointer events handle lever and ticket dragging.
- No canvas renderer or parallel input framework.
- Respect reduced-motion preferences without bypassing the interaction thresholds or the minimum loading duration.
- Machine shake is presentation only and must never itself change travel state.

## Audio

Complex layered mechanical audio is intentionally deferred until the machine interaction and Arcanistry implementation are complete. Do not add new audio in this stage.
