# Merzkava APK — Audio, Reading Accessibility & Braille Plan

**Status:** Product requirements recorded; implementation is staged behind core UI and gameplay stability.  
**Master plan:** [PRODUCT_ROADMAP.md](./PRODUCT_ROADMAP.md)  
**Scope:** Shared app shell, connected Convo and Eternal Path.

## 1. Product visual language

The app's original visual language combines user-selected references:
- Arknights — information hierarchy and tactical panel discipline.
- Reverse: 1999 — editorial typography, atmosphere and restrained ornament.
- Girls' Frontline — modular system presentation and character-facing information.
- Harry Potter — magical archive, books, aged letters, seals and tactile paper details.

These are high-level references only. Do not copy proprietary layouts, assets, logos, text or character designs. Keep Merzkava's own identity, readable contrast and functional navigation.

## 2. Independent audio controls

| Category | Owns | Does not own |
|---|---|---|
| Tap Sound | Button taps, menu feedback, rotary/ratchet interaction | Music or weather ambience |
| BGM | Background music tracks and loops | UI click feedback |
| Ambient / Sound FX | Rain, wind, thunder and scene ambience | Menu taps or music |

Requirements:
- Each category has its own enable/mute control and volume level.
- Persist preferences independently across restarts.
- Do not double-trigger sounds during drag, repeat taps or rerenders.
- Respect Android audio focus and interruptions.
- Prepare BGM infrastructure, but do not activate playback until the user supplies music assets.

## 3. Independent reading preferences

Convo and Eternal Path must have separate typography preferences.

Available controls should include:
- Optional dyslexia-friendly font.
- Font family, size and weight.
- Line height and paragraph spacing.
- Letter spacing.
- Reading column/text width.
- Contrast and background presentation where supported.

These settings must work offline using bundled fonts and safe system fallbacks. User-selected fonts must not break special symbols, CJK text, dialogue choices, or system notifications.

## 4. Vision and color accessibility

- Offer high-contrast mode and profiles for common color-vision deficiencies, including red/green and blue/yellow variants.
- Never use color as the only indicator for state, rarity, danger, success, selection or availability.
- Pair color with labels, icons, shapes, patterns or text.
- Verify text contrast, dynamic text scaling, zoom/reflow, focus visibility and touch target size.
- Support TalkBack semantics, meaningful labels and logical focus order.
- Keep decorative animation and scene effects from obscuring text or intercepting assistive navigation.
- Respect Android reduced-motion preferences.

## 5. Braille — deferred milestone

Braille support is planned **after the core app, audio controls, reading preferences, accessibility baseline and Eternal Path milestones are complete**.

Before implementation, confirm which capability is intended:
1. Compatibility with refreshable Braille displays and Android BrailleBack / supported accessibility services.
2. In-app Braille text presentation.
3. Both.

Design must use semantic text and navigation structure, never image screenshots as the source. Verify the exact supported Android versions, services and hardware before declaring compatibility. Braille is planned, not currently implemented.

## 6. Acceptance gates

- Tap Sound, BGM and Ambient / Sound FX operate independently and persist.
- Convo and Eternal Path text preferences do not overwrite each other.
- Dyslexia-friendly font and reading controls remain optional and readable.
- Color accessibility does not rely on color alone.
- TalkBack can navigate core screens, dialogs, choices and controls.
- Narrow-screen, dynamic-text, high-contrast and reduced-motion checks pass.
- Braille support is only marked complete after the confirmed scope is implemented and tested with compatible technology.
