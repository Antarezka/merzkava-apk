import { animate, createScope, stagger } from "animejs";

/**
 * Mounts the Eternal Path-only motion layer.
 * The returned disposer must be called before the app replaces its screen DOM.
 * All selectors and animations are rooted at this screen; nothing is global.
 */
export function mountExpeditionAnimations(root: HTMLElement): () => void {
  const scope = createScope({
    root,
    mediaQueries: {
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
  }).add(self => {
    if (!self || self.matches.reduceMotion) return;

    const entranceTargets = root.querySelectorAll<HTMLElement>(
      ".expedition-heading, .expedition-character-panel, .expedition-status-grid, .expedition-feature, .expedition-footer",
    );

    if (entranceTargets.length) {
      animate(entranceTargets, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 520,
        delay: stagger(65),
        ease: "outCubic",
      });
    }

    const fog = root.querySelector<HTMLElement>(".expedition-fog-layer");
    if (fog) {
      animate(fog, {
        translateX: ["-1.5%", "1.5%"],
        scale: [1.02, 1.06],
        opacity: [0.58, 0.82],
        duration: 26000,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      });
    }
  });

  return () => scope.revert();
}
