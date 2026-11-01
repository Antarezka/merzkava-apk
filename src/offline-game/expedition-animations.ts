import { animate, createScope, stagger } from "animejs";

/** Anime.js is scoped to Eternal Path's own scene and panel tree. */
export function mountExpeditionAnimations(root: HTMLElement): () => void {
  const scope = createScope({ root, mediaQueries: { reduceMotion: "(prefers-reduced-motion: reduce)" } }).add(self => {
    if (!self || self.matches.reduceMotion) return;
    const entranceTargets = root.querySelectorAll<HTMLElement>(
      ".expedition-heading, .expedition-scene-toolbar, .expedition-window-label, .expedition-character-panel, .expedition-dialogue, .expedition-test-panel, .expedition-feature, .expedition-footer",
    );
    if (entranceTargets.length) animate(entranceTargets, {
      opacity:[0,1], translateY:[12,0], duration:520, delay:stagger(55), ease:"outCubic",
    });
    const fogMotion=root.querySelector<HTMLElement>(".expedition-fog-motion");
    if(fogMotion) animate(fogMotion,{
      translateX:["-2.5%","2.5%"], translateY:["-.8%","1.2%"], scale:[1.02,1.08],
      opacity:[0.68,1], duration:28000, ease:"inOutSine", loop:true, alternate:true,
    });
    const cloud=root.querySelector<HTMLElement>(".expedition-cloud-motion");
    if(cloud) animate(cloud,{translateX:["-3%","3%"],opacity:[0.18,0.42],duration:42000,ease:"inOutSine",loop:true,alternate:true});
  });
  return () => scope.revert();
}
