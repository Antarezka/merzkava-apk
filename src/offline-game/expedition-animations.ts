import { animate, createScope, stagger } from "animejs";

function reducedMotion(): boolean {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

type SceneParticleKind = "rain" | "snow" | "petal" | "leaf";
let lastSceneState: string | null = null;

function mountSceneParticles(root: HTMLElement): { nodes: HTMLElement[]; cleanup: () => void } {
  const host = root.querySelector<HTMLElement>(".expedition-weather-particles");
  const scene = root.querySelector<HTMLElement>(".expedition-environment");
  if (!host || !scene) return { nodes: [], cleanup: () => {} };

  const weather = scene.dataset.weather;
  const cycle = scene.dataset.cycle;
  const kind: SceneParticleKind | "" = weather === "Rain" ? "rain" : weather === "Snow" ? "snow" : cycle === "Dawn" ? "petal" : cycle === "Dusk" ? "leaf" : "";
  if (!kind) return { nodes: [], cleanup: () => host.replaceChildren() };

  const count = kind === "rain" ? 17 : kind === "snow" ? 14 : 11;
  const nodes: HTMLElement[] = [];
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "expedition-particle expedition-particle-" + kind;
    particle.style.left = ((i * 37 + 11) % 97) + "%";
    particle.style.top = kind === "rain" ? (-20 - (i % 5) * 24) + "px" : (-12 - (i % 6) * 22) + "px";
    particle.style.setProperty("--particle-drift", ((i % 7) - 3) * 9 + "px");
    host.appendChild(particle);
    nodes.push(particle);
  }
  return { nodes, cleanup: () => host.replaceChildren() };
}

/** Plays one finite scene beat. No Eternal Path scene effect runs continuously. */
function playSceneBeat(root: HTMLElement, particles: HTMLElement[], onAnimation: (control: { pause?: () => void }) => void): void {
  if (reducedMotion()) return;
  const scene = root.querySelector<HTMLElement>(".expedition-environment");
  if (!scene) return;

  const run = (target: Element | Element[] | NodeListOf<Element> | null, params: Record<string, unknown>) => {
    if (target && (Array.isArray(target) ? target.length > 0 : true)) onAnimation(animate(target as never, params as never));
  };
  const cycle = scene.dataset.cycle ?? "Day";
  const weather = scene.dataset.weather ?? "Clear";
  run(root.querySelector(".expedition-scene-image"), { scale: [1.025, 1.055], translateX: ["-.35%", ".35%"], duration: 1150, ease: "inOutSine" });
  run(root.querySelector(".expedition-cloud-motion"), { translateX: ["-2%", "2%"], translateY: ["-.3%", ".5%"], opacity: [.22, .48], duration: 1450, ease: "inOutSine" });
  run(root.querySelector(".expedition-light-layer"), { opacity: [.72, 1], duration: 900, ease: "inOutSine" });
  run(root.querySelector(".expedition-weather-layer"), { opacity: [.06, weather === "Rain" || weather === "Snow" ? .32 : weather === "Fog" || weather === "Cloudy" ? .18 : .1], duration: 1100, ease: "inOutSine" });
  run(root.querySelector(".expedition-fog-motion"), { translateX: ["-2%", "2%"], translateY: ["-.5%", ".8%"], opacity: [.58, .88], duration: 1650, ease: "inOutSine" });

  const sun = cycle !== "Night";
  run(root.querySelector(sun ? ".expedition-sun-glow" : ".expedition-moon-glow"), { opacity: sun ? [.58, .9] : [.42, .78], scale: sun ? [.98, 1.035] : [.99, 1.025], duration: 1250, ease: "inOutSine" });
  run(root.querySelector(sun ? ".expedition-sun-glow-image" : ".expedition-moon-glow-image"), { translateX: ["-.25%", ".25%"], scale: [1, 1.025], opacity: [.65, .95], duration: 1450, ease: "inOutSine" });
  if (["Dawn", "Morning", "Day"].includes(cycle)) {
    run(root.querySelector(".expedition-light-rays"), { rotate: ["-2deg", "3deg"], opacity: [.16, .34], duration: 1500, ease: "inOutSine" });
    run(root.querySelector(".expedition-light-rays-image"), { translateX: ["1%", "-1%"], opacity: [.5, .82], duration: 1500, ease: "inOutSine" });
  }

  if (weather === "Rain") {
    run(root.querySelector(".expedition-rain-streak-image"), { translateY: ["-2%", "4%"], translateX: ["1%", "-1%"], opacity: [.45, .8], duration: 1050, ease: "linear" });
    if (particles.length) run(particles, { translateY: ["-24px", "360px"], translateX: (_: unknown, i: number) => ((((i ?? 0) % 5) - 2) * 13) + "px", opacity: [0, .72, 0], duration: 1050, delay: stagger(24), ease: "linear" });
    const flash = root.querySelector<HTMLElement>(".expedition-lightning-layer");
    const flashImage = root.querySelector<HTMLImageElement>(".expedition-lightning-flash-image");
    if (flash && flashImage) {
      const variants = ["/game/scenery/shared/fx-08-lightning-flash-a.png", "/game/scenery/shared/fx-08-lightning-flash-b.png", "/game/scenery/shared/fx-08-lightning-flash-c.png"];
      const variant = Math.floor(Date.now() / 1000) % variants.length;
      flashImage.src = variants[variant];
      run(flash, { keyframes: [{ opacity: 0, duration: 160 }, { opacity: .72, duration: 70 }, { opacity: .12, duration: 145 }, { opacity: .5, duration: 55 }, { opacity: 0, duration: 520 }], ease: "linear" });
    }
  } else if (weather === "Snow") {
    run(root.querySelector(".expedition-snow-texture"), { translateY: ["-1%", "3%"], translateX: ["-.5%", ".8%"], opacity: [.42, .76], duration: 1600, ease: "inOutSine" });
    run(root.querySelector(".expedition-window-frost-image"), { opacity: [.5, .76], scale: [1.01, 1.035], duration: 1350, ease: "inOutSine" });
    if (particles.length) run(particles, { translateY: ["-18px", "360px"], translateX: (_: unknown, i: number) => ((((i ?? 0) % 7) - 3) * 12) + "px", scale: [.7, 1.1], opacity: [0, .82, .12], duration: 1700, delay: stagger(70), ease: "inOutSine" });
  } else if (cycle === "Dawn" || cycle === "Dusk") {
    const leaf = cycle === "Dusk";
    run(root.querySelector(leaf ? ".expedition-leaf-texture" : ".expedition-petal-texture"), { translateY: ["-1%", "4%"], translateX: [leaf ? "1%" : "-1%", leaf ? "-1%" : "1%"], rotate: [leaf ? "1deg" : "-1deg", leaf ? "-2deg" : "2deg"], opacity: [.3, .68], duration: 1650, ease: "inOutSine" });
    if (particles.length) run(particles, { translateY: ["-12px", "360px"], translateX: (_: unknown, i: number) => ((((i ?? 0) % 7) - 3) * 23) + "px", rotate: [-35, 110], scale: [.65, 1], opacity: [0, .82, 0], duration: 1750, delay: stagger(85), ease: "inOutSine" });
  }
}

 /** Anime.js owns Eternal Path presentation motion; game state never depends on animation callbacks. */
export function mountExpeditionAnimations(root: HTMLElement): () => void {
  const listeners: Array<() => void> = [];
  const activeSceneAnimations: Array<{ pause?: () => void }> = [];
  const scene = root.querySelector<HTMLElement>(".expedition-environment");
  const particleMount = mountSceneParticles(root);
  let disposed = false;
  let motionAllowed = !reducedMotion();
  const playScene = () => {
    if (disposed || !motionAllowed || !scene) return;
    activeSceneAnimations.splice(0).forEach(animation => animation.pause?.());
    playSceneBeat(root, particleMount.nodes, animation => activeSceneAnimations.push(animation));
  };
  if (scene) {
    scene.setAttribute("role", "button");
    scene.setAttribute("tabindex", "0");
    scene.setAttribute("aria-label", "Play one scene animation");
    const onClick = () => playScene();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); playScene(); }
    };
    scene.addEventListener("click", onClick);
    scene.addEventListener("keydown", onKeyDown);
    listeners.push(() => { scene.removeEventListener("click", onClick); scene.removeEventListener("keydown", onKeyDown); });
    const state = scene.dataset.animationState ?? [scene.dataset.location, scene.dataset.cycle, scene.dataset.weather].join(":");
    if (lastSceneState !== null && lastSceneState !== state) playScene();
    lastSceneState = state;
  }

  const scope = createScope({ root, mediaQueries: { reduceMotion: "(prefers-reduced-motion: reduce)" } }).add(self => {
    if (!self) return;
    motionAllowed = !self.matches.reduceMotion && !reducedMotion();
    if (self.matches.reduceMotion) return;
    const entranceTargets = root.querySelectorAll<HTMLElement>(".expedition-heading, .expedition-character-panel, .expedition-disposition-line, .expedition-dialogue, .expedition-footer");
    if (entranceTargets.length) animate(entranceTargets, { opacity: [0, 1], translateY: [13, 0], duration: 560, delay: stagger(72), ease: "outCubic" });
    const profileFields = root.querySelectorAll<HTMLElement>(".expedition-profile-meta span");
    if (profileFields.length) animate(profileFields, { opacity: [0, 1], translateY: [5, 0], duration: 340, delay: stagger(38), ease: "outQuad" });
    const disposition = root.querySelector<HTMLElement>(".expedition-disposition");
    if (disposition) animate(disposition, { opacity: [.65, 1], scale: [.97, 1], duration: 900, ease: "outCubic" });
    const narrative = root.querySelectorAll<HTMLElement>(".expedition-narrative-layer");
    if (narrative.length) animate(narrative, { opacity: [0, 1], translateY: [9, 0], duration: 520, delay: stagger(115), ease: "outCubic" });
    root.querySelectorAll<HTMLElement>("button").forEach(button => {
      const enter = () => animate(button, { scale: [1, 1.018], duration: 170, ease: "outQuad" });
      const leave = () => animate(button, { scale: [1.018, 1], duration: 210, ease: "outQuad" });
      button.addEventListener("pointerenter", enter);
      button.addEventListener("pointerleave", leave);
      listeners.push(() => { button.removeEventListener("pointerenter", enter); button.removeEventListener("pointerleave", leave); });
    });
  });
  return () => {
    disposed = true;
    listeners.forEach(dispose => dispose());
    activeSceneAnimations.splice(0).forEach(animation => animation.pause?.());
    particleMount.cleanup();
    scope.revert();
  };
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
  if (sheet) animate(sheet, { opacity: [1, 0], translateY: [0, 24], duration: 220, ease: "inCubic", onComplete: () => { modal.hidden = true; delete modal.dataset.closing; onComplete?.(); } });
  else { modal.hidden = true; delete modal.dataset.closing; onComplete?.(); }
}

export function animateExpeditionPanel(panel: HTMLElement): void {
  if (reducedMotion()) return;
  animate(panel, { opacity: [0, 1], translateY: [9, 0], duration: 300, ease: "outCubic" });
}
