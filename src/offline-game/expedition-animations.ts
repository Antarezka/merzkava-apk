import { animate, createScope, stagger } from "animejs";

function reducedMotion(): boolean {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

/** Procedural weather/season particles are rendered only inside the clipped Scene Window. */
function mountSceneParticles(root: HTMLElement): void {
  const host=root.querySelector<HTMLElement>(".expedition-weather-particles");
  const scene=root.querySelector<HTMLElement>(".expedition-environment");
  if(!host||!scene||reducedMotion()) return;
  const weather=scene.dataset.weather;
  const cycle=scene.dataset.cycle;
  const kind=weather==="Rain"?"rain":weather==="Snow"?"snow":cycle==="Dawn"?"petal":cycle==="Dusk"?"leaf":"";
  if(!kind) return;
  const count=kind==="rain"?22:kind==="snow"?18:12;
  const nodes:HTMLElement[]=[];
  for(let i=0;i<count;i++){
    const particle=document.createElement("span");
    particle.className="expedition-particle expedition-particle-"+kind;
    particle.style.left=((i*37+11)%97)+"%";
    particle.style.top=kind==="rain"?(-20-(i%5)*24)+"px":(-12-(i%6)*22)+"px";
    particle.style.setProperty("--particle-drift",((i%7)-3)*9+"px");
    host.appendChild(particle);nodes.push(particle);
  }
  if(kind==="rain"){
    animate(nodes,{translateY:["-24px","360px"],translateX:(_,i)=>(((i%5)-2)*13)+"px",opacity:[0,.72,0],duration:1050,ease:"linear",delay:stagger(34),loop:true});
  }else if(kind==="snow"){
    animate(nodes,{translateY:["-18px","360px"],translateX:(_,i)=>(((i%7)-3)*12)+"px",scale:[.7,1.15],opacity:[0,.82,.12],duration:7200,ease:"inOutSine",delay:stagger(180),loop:true});
  }else{
    animate(nodes,{translateY:["-12px","360px"],translateX:[0,(_,i)=>(((i%7)-3)*23)+"px"],rotate:[-35,110],scale:[.65,1],opacity:[0,.82,0],duration:kind==="petal"?9200:11800,ease:"inOutSine",delay:stagger(260),loop:true});
  }
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
    mountSceneParticles(root);
    const sun = root.querySelector<HTMLElement>(".expedition-sun-glow");
    if (sun) animate(sun,{opacity:[.58,.9],scale:[.98,1.045],duration:9200,ease:"inOutSine",loop:true,alternate:true});
    const moon = root.querySelector<HTMLElement>(".expedition-moon-glow");
    if (moon) animate(moon,{opacity:[.42,.78],scale:[.99,1.035],duration:11800,ease:"inOutSine",loop:true,alternate:true});
    const rays = root.querySelector<HTMLElement>(".expedition-light-rays");
    if (rays) animate(rays,{rotate:["-4deg","5deg"],opacity:[.16,.34],duration:26000,ease:"inOutSine",loop:true,alternate:true});
    const lightning = root.querySelector<HTMLElement>(".expedition-lightning-layer");
    if (lightning && root.querySelector<HTMLElement>(".expedition-environment")?.dataset.weather==="Rain") {
      animate(lightning,{keyframes:[{opacity:0,duration:14500},{opacity:.78,duration:75},{opacity:.16,duration:130},{opacity:.58,duration:55},{opacity:0,duration:1100}],loop:true,ease:"linear"});
    }
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
      translateX: ["-3%", "3%"], translateY:["-.5%","1%"], opacity: [.22, .52], duration: 42000,
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
