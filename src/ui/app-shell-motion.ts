import { animate } from "animejs";

/**
 * Lightweight screen entrance motion for the Hybrid Tactical Academy shell.
 * This only animates presentation nodes; navigation and screen behavior remain
 * owned by the existing application event handlers.
 */
export function animateAppScreen(shell: HTMLElement | null): void {
  if (!shell || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const header = shell.querySelector<HTMLElement>(".app-header");
  const panels = Array.from(shell.querySelectorAll<HTMLElement>(".main-content > *"));

  if (header) {
    animate(header, {
      opacity: [0, 1],
      translateY: [-7, 0],
      duration: 360,
      ease: "outCubic"
    });
  }

  panels.forEach((panel, index) => {
    animate(panel, {
      opacity: [0, 1],
      translateY: [13, 0],
      duration: 430,
      delay: 45 + index * 58,
      ease: "outCubic"
    });
  });

}
