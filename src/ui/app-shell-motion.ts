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
      // The lever stays fixed outside the dock; only the toolbar itself sinks.
      nav.style.pointerEvents = collapsed ? "none" : "auto";
      nav.style.opacity = collapsed ? "1" : "0";
      nav.style.transform = collapsed
        ? "translateX(-50%) translateY(0px)"
        : "translateX(-50%) translateY(92px)";
      animate(nav, {
        translateY: collapsed ? [0, 92] : [92, 0],
        opacity: collapsed ? [1, 0] : [0, 1],
        duration: 520,
        ease: collapsed ? "inCubic" : "outCubic",
        onComplete: () => {
          nav.style.pointerEvents = collapsed ? "none" : "auto";
        }
      });
    }
    // The header remains fully visible; only the navigation dock sinks.
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


/** A staged mechanical pull: gear train engages, the lever loads, then its spring returns. */
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

  // Phase 1 — the handle takes up mechanical slack.
  haptic(12);
  animate(arm, {
    rotate: [{ to: -17, duration: 105, ease: "outQuad" }, { to: -31, duration: 85, ease: "inOutQuad" }],
    translateY: [{ to: 3, duration: 105, ease: "outQuad" }, { to: 6, duration: 85, ease: "inOutQuad" }],
    onComplete: () => {
      // Phase 2 — a brief gear-train run-up, then the pawl catches.
      haptic(18);
      if (rotorGrips.length) {
        animate(rotorGrips, {
          rotate: [{ to: 13, duration: 105, ease: "outQuad" }, { to: -4, duration: 95, ease: "inOutSine" }, { to: 0, duration: 90, ease: "outCubic" }],
          delay: stagger(9),
        });
      }
      if (pivot) animate(pivot, { scale: [1, 1.13, 0.98, 1], duration: 285, ease: "outBack" });

      // Phase 3 — release the spring with a controlled, soft mechanical rebound.
      window.setTimeout(() => {
        haptic(25);
        animate(arm, {
          rotate: [{ to: -25, duration: 65, ease: "inQuad" }, { to: 0, duration: 345, ease: "outElastic(1, .68)" }],
          translateY: [{ to: 5, duration: 65, ease: "inQuad" }, { to: 0, duration: 345, ease: "outBack" }],
          onComplete,
        });
      }, 105);
    },
  });
}
