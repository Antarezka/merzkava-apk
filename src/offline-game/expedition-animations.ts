import { animate, createScope, stagger } from "animejs";

function reducedMotion(): boolean {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

/** Anime.js owns Eternal Path presentation motion; game state never depends on animation callbacks. */
export function mountExpeditionAnimations(root: HTMLElement): () => void {
  const listeners: Array<() => void> = [];
  const scope = createScope({ root, mediaQueries: { reduceMotion: "(prefers-reduced-motion: reduce)" } }).add(self => {
    if (!self || self.matches.reduceMotion) return;

    const entranceTargets = root.querySelectorAll<HTMLElement>(
      ".expedition-heading, .expedition-environment, .expedition-character-panel, .expedition-disposition-line, .expedition-dialogue, .expedition-footer",
    );
    if (entranceTargets.length) animate(entranceTargets, {
      opacity: [0, 1], translateY: [13, 0], duration: 560, delay: stagger(72), ease: "outCubic",
    });

    const sceneImage = root.querySelector<HTMLElement>(".expedition-scene-image");
    if (sceneImage) animate(sceneImage, {
      scale: [1.025, 1.075], translateX: ["-.45%", ".45%"], duration: 32000,
      ease: "inOutSine", loop: true, alternate: true,
    });
    const light = root.querySelector<HTMLElement>(".expedition-light-layer");
    if (light) animate(light, { opacity: [.72, 1], duration: 8200, ease: "inOutSine", loop: true, alternate: true });
    const weather = root.querySelector<HTMLElement>(".expedition-weather-layer");
    if (weather) {
      const kind = root.querySelector<HTMLElement>(".expedition-environment")?.dataset.weather;
      const visible = kind === "Rain" || kind === "Snow" ? .32 : kind === "Fog" || kind === "Cloudy" ? .18 : .06;
      animate(weather, { opacity: [visible * .65, visible], duration: 6400, ease: "inOutSine", loop: true, alternate: true });
    }
    const fog = root.querySelector<HTMLElement>(".expedition-fog-motion");
    if (fog) animate(fog, {
      translateX: ["-3.5%", "3.5%"], translateY: ["-1.2%", "1.5%"], scale: [1.02, 1.09],
      opacity: [.58, .92], duration: 30000, ease: "inOutSine", loop: true, alternate: true,
    });
    const cloud = root.querySelector<HTMLElement>(".expedition-cloud-motion");
    if (cloud) animate(cloud, {
      translateX: ["-3%", "3%"], opacity: [.16, .4], duration: 42000,
      ease: "inOutSine", loop: true, alternate: true,
    });

    const profileFields = root.querySelectorAll<HTMLElement>(".expedition-profile-meta span");
    if (profileFields.length) animate(profileFields, {
      opacity: [0, 1], translateY: [5, 0], duration: 340, delay: stagger(38), ease: "outQuad",
    });
    const disposition = root.querySelector<HTMLElement>(".expedition-disposition");
    if (disposition) animate(disposition, {
      opacity: [.65, 1], scale: [.97, 1], duration: 900, ease: "outCubic",
    });
    const narrative = root.querySelectorAll<HTMLElement>(".expedition-narrative-layer");
    if (narrative.length) animate(narrative, {
      opacity: [0, 1], translateY: [9, 0], duration: 520, delay: stagger(115), ease: "outCubic",
    });

    root.querySelectorAll<HTMLElement>("button").forEach(button => {
      const enter = () => animate(button, { scale: [1, 1.018], duration: 170, ease: "outQuad" });
      const leave = () => animate(button, { scale: [1.018, 1], duration: 210, ease: "outQuad" });
      button.addEventListener("pointerenter", enter);
      button.addEventListener("pointerleave", leave);
      listeners.push(() => { button.removeEventListener("pointerenter", enter); button.removeEventListener("pointerleave", leave); });
    });
  });
  return () => { listeners.forEach(dispose => dispose()); scope.revert(); };
}

/** Animated modal transitions remain presentation-only and never delay state validation. */
export function animateExpeditionChoiceModal(modal: HTMLElement, open: boolean, onComplete?: () => void): void {
  const sheet = modal.querySelector<HTMLElement>(".expedition-choice-sheet");
  const backdrop = modal.querySelector<HTMLElement>(".expedition-choice-backdrop");
  if (reducedMotion()) {
    if (!open) { modal.hidden = true; delete modal.dataset.closing; }
    onComplete?.();
    return;
  }
  if (open) {
    delete modal.dataset.closing;
    modal.hidden = false;
    if (backdrop) animate(backdrop, { opacity: [0, 1], duration: 240, ease: "outQuad" });
    if (sheet) animate(sheet, { opacity: [0, 1], translateY: [34, 0], duration: 430, ease: "outCubic" });
    return;
  }
  if (modal.dataset.closing === "true") return;
  modal.dataset.closing = "true";
  if (backdrop) animate(backdrop, { opacity: [1, 0], duration: 190, ease: "inQuad" });
  if (sheet) animate(sheet, {
    opacity: [1, 0], translateY: [0, 24], duration: 220, ease: "inCubic",
    onComplete: () => { modal.hidden = true; delete modal.dataset.closing; onComplete?.(); },
  });
  else { modal.hidden = true; delete modal.dataset.closing; onComplete?.(); }
}

export function animateExpeditionPanel(panel:HTMLElement):void {
  if(reducedMotion()) return;
  animate(panel,{opacity:[0,1],translateY:[9,0],duration:300,ease:"outCubic"});
}
