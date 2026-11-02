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
    const track = nav?.querySelector<HTMLElement>(".nav-roulette-track");
    const cables = nav?.querySelectorAll<HTMLElement>(".nav-cable");
    const grip = toggle?.querySelector<HTMLElement>(".nav-toggle-grip");
    const arrow = toggle?.querySelector<HTMLElement>(".nav-toggle-arrow");
    const collapsed = shell.classList.contains("is-nav-collapsed");
    if (track) animate(track, {
      opacity: collapsed ? [1, 0] : [0, 1],
      translateY: collapsed ? [0, 7] : [7, 0],
      duration: 360,
      ease: collapsed ? "inCubic" : "outCubic"
    });
    if (cables?.length) animate(cables, {
      opacity: collapsed ? [0.88, 0] : [0, 0.88],
      duration: 300,
      ease: "inOutSine"
    });
    if (grip) animate(grip, {
      rotate: collapsed ? [0, -180] : [180, 0],
      scaleX: [1, 1.35, 1],
      duration: 460,
      ease: "outBack"
    });
    if (arrow) animate(arrow, {
      rotate: collapsed ? [0, 180] : [180, 0],
      duration: 360,
      ease: "outCubic"
    });
    if (toggle) animate(toggle, {
      scale: [0.97, 1.035, 1],
      duration: 420,
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
      const seal = letter.querySelector<HTMLElement>(".kitty-wax-seal");
      const sealLayers = seal?.querySelectorAll<HTMLElement>("img");
      animate(letter, { opacity: [0, 1], translateY: [18, 0], duration: 760, delay: 110, ease: "outCubic" });
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
