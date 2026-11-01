import { animate, stagger } from "animejs";

/** Shared shell transitions. The app shell itself is never transformed so fixed modals stay viewport-relative. */
export function animateAppScreen(shell: HTMLElement | null): void {
  if (!shell || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const header = shell.querySelector<HTMLElement>(".app-header");
  const content = shell.querySelector<HTMLElement>(".main-content");
  const nav = shell.querySelector<HTMLElement>(".bottom-nav");
  if (header) animate(header, { opacity: [0, 1], translateY: [-8, 0], duration: 390, ease: "outCubic" });
  if (content) {
    const panels = content.querySelectorAll<HTMLElement>(":scope > *");
    if (panels.length) animate(panels, {
      opacity: [0, 1], translateY: [13, 0], duration: 470, delay: stagger(58), ease: "outCubic",
    });
  }
  if (nav) {
    animate(nav, { opacity: [0, 1], translateY: [18, 0], duration: 520, delay: 90, ease: "outCubic" });
    const items = nav.querySelectorAll<HTMLElement>(".nav-item");
    if (items.length) animate(items, { opacity: [0, 1], translateY: [7, 0], duration: 340, delay: stagger(32, { start: 150 }), ease: "outQuad" });
  }
}
