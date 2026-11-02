import { animate, stagger } from "animejs";

/** Shared shell transitions. The fixed navigation rail stays anchored; Anime.js motion is applied to its inner item wrappers so entrance and roulette interactions never move the rail itself. */
export function animateAppScreen(shell: HTMLElement | null): void {
  if (!shell || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const header = shell.querySelector<HTMLElement>(".app-header");
  const content = shell.querySelector<HTMLElement>(".main-content");
  const nav = shell.querySelector<HTMLElement>(".bottom-nav");
  if (header) animate(header, { opacity: [0, 1], translateY: [-8, 0], duration: 390, ease: "outCubic" });
  if (content) {
    const panels = content.querySelectorAll<HTMLElement>(":scope > *");
    panels.forEach((panel,index)=>animate(panel,{
      opacity:[0,1],
      ...(panel.classList.contains("expedition-page")?{}:{translateY:[13,0]}),
      duration:470,delay:58*index,ease:"outCubic",
    }));
  }
  if (nav) {
    animate(nav, { opacity: [0, 1], duration: 520, delay: 90, ease: "outCubic" });
    const items = nav.querySelectorAll<HTMLElement>(".nav-item-motion");
    if (items.length) {
      animate(items, { opacity: [0, 1], translateY: [9, 0], duration: 380, delay: stagger(38, { start: 150 }), ease: "outBack" });
      items.forEach(item => {
        const enter=()=>animate(item,{scale:[1,1.055],duration:160,ease:"outQuad"});
        const leave=()=>animate(item,{scale:[1.055,1],duration:190,ease:"outQuad"});
        item.addEventListener("pointerenter",enter);
        item.addEventListener("pointerleave",leave);
      });
      const active=nav.querySelector<HTMLElement>(".nav-item.active");
      const activeIcon=active?.querySelector<HTMLElement>(".nav-icon");
      if(activeIcon) animate(activeIcon,{scale:[.82,1.12,1],rotate:["-8deg","0deg"],duration:540,ease:"outBack"});
    }
  }
  const controls=shell.querySelectorAll<HTMLElement>("button:not(.nav-item)");
  controls.forEach(button=>{
    const enter=()=>animate(button,{scale:[1,1.018],duration:150,ease:"outQuad"});
    const leave=()=>animate(button,{scale:[1.018,1],duration:190,ease:"outQuad"});
    button.addEventListener("pointerenter",enter);
    button.addEventListener("pointerleave",leave);
  });
}
