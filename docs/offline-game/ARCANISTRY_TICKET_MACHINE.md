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

1. Select a destination card. Only verified, currently mapped routes can request an access code.
2. The four-digit mechanical register sits directly above the ticket issue slot. Press the torn-ticket icon to generate a random code from 0000 to 9999; each odometer-style digit rolls and stops in sequence.
3. The left Cancel control clears the current code and destination selection so another destination can be chosen.
4. Enter the code using one 0–9 rotary dial. Each numbered finger button turns the dial and lets its spring return before recording one digit. Four entries are required.
5. An incorrect code clears only the four entered digits. The generated code remains visible and can be retried without generating another code.
6. A correct code stabilizes the warm amber master lamp and unlocks the folding control assembly. The rotary dial folds away on its hinge and the lever face unfolds from the same housing.
7. Only after verification, pull the lever downward through its full travel. A tap or incomplete pull must not activate the machine.
8. The lever engages the existing transmission: visible gears rotate at different rates, cables and pulleys travel, and the spring assembly compresses and releases.
9. The machine body shakes with several weighted mechanical beats as the lever engages and the ticket printer runs. The master bulb flickers irregularly between warm bright and dim states during the shaking.
10. A paper ticket slowly emerges halfway from the issue slot and remains attached to the machine. The lever returns to its upper resting position.
11. The player must drag the ticket downward past its tear threshold. Releasing early returns the ticket to its hanging position and does not travel.
12. Tearing the ticket triggers a final mechanical jolt and opens the transit loading overlay.
13. Keep the loading overlay visible for at least 3 seconds, then perform the verified location transition.

## Control states

- Destination selected: Generate Code enabled for supported routes; lever and dial locked.
- Code generated: four digits remain fixed for the session; dial accepts four entries.
- Wrong code: input progress resets to 0/4; the same code remains active for retry.
- Correct code: dial folds away, lever appears and unlocks, and the master lamp glows steadily.
- Printing: controls are locked; the master lamp flickers irregularly with the existing machine shake.
- Ticket ready: lever is already returned to its upper position; ticket must be pulled downward to tear.
- Cancel: returns to destination selection and clears the current code.

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
