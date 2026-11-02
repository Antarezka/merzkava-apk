import { animate, stagger } from "animejs";

/**
 * Shared shell transitions. The fixed navigation rail stays anchored; Anime.js
 * motion is applied to inner wrappers so the dock never drifts during entrance,
 * roulette, or the mechanical hide/show lever interaction.
 */
export function animateAppScreen(shell: HTMLElement | null, options: { menuToggle?: boolean } = {}): void {
  if (!shell) return;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const header = shell.querySelector<HTMLElement>(".app-header");
  const content = shell.querySelector<HTMLElement>(".main-content");
  const nav = shell.querySelector<HTMLElement>(".bottom-nav");
  const toggle = shell.querySelector<HTMLElement>(".nav-toggle-handle");

  if (reducedMotion) {
    [header, content, nav, toggle].forEach(element => {
      if (element) { element.style.opacity = "1"; element.style.transform = ""; }
    });
    return;
  }

  if (options.menuToggle) {
    const collapsed = shell.classList.contains("is-nav-collapsed");
    if (nav) {
      // Fold the dock almost completely, leaving a slim visible edge as a visual cue.
      const peek = 16;
      const hideDistance = Math.max(0, nav.offsetHeight - peek);
      const from = collapsed ? 0 : hideDistance;
      const to = collapsed ? hideDistance : 0;
      nav.style.pointerEvents = "none";
      nav.style.opacity = "1";
      nav.style.transform = `translateX(-50%) translateY(${from}px)`;
      const direction = Math.sign(to - from);
      const distance = Math.abs(to - from);
      animate(nav, {
        translateY: [
          { to: from + direction * distance * 0.12, duration: 180, ease: "outSine" },
          { to: to - direction * Math.min(5, distance * 0.035), duration: 560, ease: "inOutSine" },
          { to, duration: 220, ease: "outCubic" }
        ],
        opacity: [1, 1],
        duration: 960,
        ease: "inOutSine",
        onComplete: () => {
          nav.style.pointerEvents = collapsed ? "none" : "auto";
          nav.style.transform = `translateX(-50%) translateY(${to}px)`;
        }
      });
    }
    // Only the circular lever remains in the compact header while the dock is folded.
    const grip = toggle?.querySelector<HTMLElement>(".nav-lever-grip");
    const arrow = toggle?.querySelector<HTMLElement>(".nav-toggle-arrow");
    if (grip) animate(grip, {
      rotate: collapsed ? [0, -180] : [180, 0],
      scaleX: [1, 1.25, 1],
      duration: 460,
      ease: "outBack"
    });
    if (arrow) animate(arrow, {
      rotate: collapsed ? [0, 180] : [180, 0],
      duration: 360,
      ease: "outCubic"
    });
    if (toggle) animate(toggle, {
      scale: [0.96, 1.04, 1],
      duration: 430,
      ease: "outBack"
    });
    return;
  }

  if (header) animate(header, { opacity: [0, 1], translateY: [-8, 0], duration: 390, ease: "outCubic" });
  if (content) {
    const panels = Array.from(content.querySelectorAll<HTMLElement>(":scope > *"))
      .filter(panel => !panel.matches(".dusty-letter, .language-preference, .developer-credit"));
    panels.forEach((panel, index) => animate(panel, {
      opacity: [0, 1],
      ...(panel.classList.contains("expedition-page") ? {} : { translateY: [13, 0] }),
      duration: 470,
      delay: 58 * index,
      ease: "outCubic"
    }));

    const letter = content.querySelector<HTMLElement>(".dusty-letter");
    if (letter) {
      const paragraphs = letter.querySelectorAll<HTMLElement>("p, .dusty-letter-author, .dusty-letter-title, .dusty-letter-farewell, .dusty-letter-foot");
      const dust = letter.querySelector<HTMLElement>(".dusty-letter-dust");
      const ink = letter.querySelector<HTMLElement>(".dusty-letter-ink");
      const seal = letter.querySelector<HTMLElement>(".kitty-wax-seal");
      const sealLayers = seal?.querySelectorAll<HTMLElement>("img");
      animate(letter, { opacity: [0, 1], translateY: [18, 0], duration: 760, delay: 110, ease: "outCubic" });
      if (dust) animate(dust, { opacity: [0.18, 0.48, 0.28], translateX: [-4, 5, 0], duration: 2400, delay: 520, ease: "inOutSine" });
      if (ink) animate(ink, { opacity: [0.14, 0.28, 0.18], translateX: [2, -3, 0], duration: 3100, delay: 640, ease: "inOutSine" });
      if (paragraphs.length) animate(paragraphs, {
        opacity: [0, 1],
        translateY: [8, 0],
        delay: stagger(72, { start: 260 }),
        duration: 520,
        ease: "outCubic"
      });
      if (seal) animate(seal, {
        opacity: [0, 1],
        scale: [0.72, 1.08, 1],
        rotate: [-16, 4, 0],
        duration: 820,
        delay: 340,
        ease: "outBack"
      });
      if (sealLayers?.length) animate(sealLayers, {
        opacity: [0, 1],
        scale: [0.86, 1],
        delay: stagger(65, { start: 480 }),
        duration: 460,
        ease: "outCubic"
      });
    }

    const languagePanel = content.querySelector<HTMLElement>(".language-preference");
    const credit = content.querySelector<HTMLElement>(".developer-credit");
    if (languagePanel) animate(languagePanel, {
      opacity: [0, 1], translateY: [12, 0], duration: 520, delay: 90, ease: "outCubic"
    });
    if (credit) {
      const creditLines = credit.querySelectorAll<HTMLElement>("span, strong, em");
      animate(credit, { opacity: [0, 1], translateY: [10, 0], duration: 500, delay: 180, ease: "outCubic" });
      if (creditLines.length) animate(creditLines, {
        opacity: [0, 1], translateY: [5, 0],
        delay: stagger(75, { start: 260 }), duration: 430, ease: "outCubic"
      });
    }
  }

  if (nav) {
    animate(nav, { opacity: [0, 1], duration: 520, delay: 90, ease: "outCubic" });
    const items = nav.querySelectorAll<HTMLElement>(".nav-item-motion");
    if (items.length) {
      animate(items, { opacity: [0, 1], duration: 380, delay: stagger(38, { start: 150 }), ease: "outCubic" });
      items.forEach(item => {
        const enter = () => animate(item, { scale: [1, 1.055], duration: 160, ease: "outQuad" });
        const leave = () => animate(item, { scale: [1.055, 1], duration: 190, ease: "outQuad" });
        item.addEventListener("pointerenter", enter);
        item.addEventListener("pointerleave", leave);
      });
      const active = nav.querySelector<HTMLElement>(".nav-item.active");
      const activeIcon = active?.querySelector<HTMLElement>(".nav-icon");
      if (activeIcon) animate(activeIcon, { scale: [0.9, 1.1, 1], duration: 480, ease: "outBack" });
    }
  }

  const controls = shell.querySelectorAll<HTMLElement>("button:not(.nav-item):not(.nav-toggle-handle)");
  controls.forEach(button => {
    const enter = () => animate(button, { scale: [1, 1.018], duration: 150, ease: "outQuad" });
    const leave = () => animate(button, { scale: [1.018, 1], duration: 190, ease: "outQuad" });
    button.addEventListener("pointerenter", enter);
    button.addEventListener("pointerleave", leave);
  });

  if (toggle) {
    const grip = toggle.querySelector<HTMLElement>(".nav-toggle-grip");
    const arrow = toggle.querySelector<HTMLElement>(".nav-toggle-arrow");
    if (grip) animate(grip, { scaleX: [0.7, 1.2, 1], duration: 440, ease: "outBack" });
    if (arrow) animate(arrow, { rotate: [0, 0], duration: 1 });
  }
}


/** Audio-timed mechanical lever: opening slack, secondary ratchet, hard catch, spring return. */
export function animateNavLeverPull(button: HTMLElement, onComplete: () => void): void {
  const arm = button.querySelector<HTMLElement>(".nav-lever-arm");
  const pivot = button.querySelector<HTMLElement>(".nav-lever-pivot");
  const rotorGrips = Array.from(button.closest(".app-shell")?.querySelectorAll<HTMLElement>(".nav-rotor-grip") ?? []);

  if (!arm) { onComplete(); return; }

  const haptic = (duration: number): void => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(duration);
    } catch { /* Haptics are optional and must never block the toolbar. */ }
  };

  // 0.10–0.25s: match the opening cluster of short mechanical impacts.
  haptic(38);
  animate(arm, {
    rotate: [
      { to: -15, duration: 105, ease: "outQuad" },
      { to: -30, duration: 85, ease: "inOutQuad" },
    ],
    translateY: [
      { to: 3, duration: 105, ease: "outQuad" },
      { to: 6, duration: 85, ease: "inOutQuad" },
    ],
  });

  // 0.64–0.82s: the quieter gear/pawl chatter becomes a small, deliberate movement.
  if (rotorGrips.length) {
    animate(rotorGrips, {
      rotate: [
        { to: 7, duration: 48, ease: "outQuad" },
        { to: -4, duration: 48, ease: "inOutSine" },
        { to: 6, duration: 48, ease: "inOutSine" },
        { to: -2, duration: 48, ease: "outCubic" },
      ],
      delay: 640,
    });
  }
  window.setTimeout(() => haptic(30), 650);

  // 1.40–1.55s: align the pivot's firm mechanical catch with the loud final impact.
  if (pivot) animate(pivot, {
    scale: [1, 1.13, 0.96, 1],
    duration: 150,
    delay: 1400,
    ease: "outBack",
  });
  window.setTimeout(() => haptic(85), 1420);

  // 1.56–2.00s: release the lever after the catch; finish with a short settling motion.
  animate(arm, {
    rotate: [
      { to: -24, duration: 55, delay: 1560, ease: "inQuad" },
      { to: 2, duration: 300, ease: "outElastic(1, .68)" },
      { to: 0, duration: 85, ease: "outCubic" },
    ],
    translateY: [
      { to: 5, duration: 55, delay: 1560, ease: "inQuad" },
      { to: -1, duration: 300, ease: "outBack" },
      { to: 0, duration: 85, ease: "outCubic" },
    ],
    onComplete: () => {
      haptic(38);
      onComplete();
    },
  });
}
