import { animate } from "animejs";

/**
 * Shared shell transitions. The fixed navigation rail stays anchored; Anime.js
 * motion is applied to inner wrappers so the dock never drifts during entrance,
 * roulette, or the mechanical hide/show lever interaction.
 */
export function animateAppScreen(shell: HTMLElement | null, options: { menuToggle?: boolean } = {}): void {
  if (!shell) return;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const nav = shell.querySelector<HTMLElement>(".bottom-nav");
  const toggle = shell.querySelector<HTMLElement>(".nav-toggle-handle");
  if (options.menuToggle) {
    const collapsed = shell.classList.contains("is-nav-collapsed");
    if (nav) {
      const distance = nav.offsetHeight + 12;
      const target = collapsed ? distance : 0;
      nav.style.pointerEvents = "auto";
      nav.querySelectorAll<HTMLElement>(".nav-item").forEach(item => { item.style.pointerEvents = collapsed ? "none" : "auto"; });
      if (reducedMotion) nav.style.transform = "translateX(-50%) translateY(" + target + "px)";
      else animate(nav, { translateY: [collapsed ? 0 : distance, target], duration: 150, ease: "outQuad", onComplete: () => { nav.style.transform = "translateX(-50%) translateY(" + target + "px)"; } });
    }
    if (toggle) {
      const target = collapsed ? 25 : 0;
      if (reducedMotion) toggle.style.transform = target ? "translateY(" + target + "px)" : "";
      else animate(toggle, { translateY: [collapsed ? 0 : 25, target], duration: 140, ease: "outQuad", onComplete: () => { toggle.style.transform = target ? "translateY(" + target + "px)" : ""; } });
    }
    return;
  }
  if (reducedMotion) { shell.style.opacity = "1"; shell.style.willChange = ""; return; }
  shell.style.willChange = "opacity";
  animate(shell, { opacity: [0, 1], duration: 130, ease: "outQuad", onComplete: () => { shell.style.opacity = "1"; shell.style.willChange = ""; } });
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


function currentOpacity(element: HTMLElement): number {
  const raw = window.getComputedStyle?.(element).opacity ?? "";
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 1;
}

/** Fade an outgoing screen snapshot while its replacement enters underneath. */
export function animateAppScreenExit(shell: HTMLElement | null, onComplete: () => void): void {
  if (!shell) { onComplete(); return; }
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  shell.style.pointerEvents = "none";
  if (reducedMotion) {
    shell.style.willChange = "";
    onComplete();
    return;
  }
  const fromOpacity = currentOpacity(shell);
  shell.style.willChange = "opacity";
  let completed = false;
  const finish = () => {
    if (completed) return;
    completed = true;
    shell.style.willChange = "";
    onComplete();
  };
  animate(shell, {
    opacity: [fromOpacity, 0],
    duration: 430,
    ease: "inOutSine",
    onComplete: finish
  });
}

/** Close the noticeboard without a CSS-keyframe/Anime.js opacity handoff. */
export function animateNoticeboardExit(backdrop: HTMLElement | null, onComplete: () => void): void {
  if (!backdrop) { onComplete(); return; }
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  backdrop.style.pointerEvents = "none";
  if (reducedMotion) { onComplete(); return; }
  const backdropOpacity = currentOpacity(backdrop);
  const panel = backdrop.querySelector<HTMLElement>(".noticeboard-panel");
  const panelOpacity = panel ? currentOpacity(panel) : 1;
  backdrop.getAnimations?.().forEach(animation => animation.cancel());
  backdrop.style.opacity = String(backdropOpacity);
  if (panel) {
    panel.style.opacity = String(panelOpacity);
    animate(panel, {
      opacity: [panelOpacity, 0],
      translateY: [0, 5],
      duration: 340,
      ease: "inOutSine"
    });
  }
  animate(backdrop, {
    opacity: [backdropOpacity, 0],
    duration: 380,
    ease: "inOutSine",
    onComplete
  });
}
