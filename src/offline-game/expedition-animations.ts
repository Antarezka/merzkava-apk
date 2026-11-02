import { animate, createScope, stagger } from "animejs";

function reducedMotion(): boolean {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

type SceneParticleKind = "rain" | "snow" | "petal" | "leaf";
type ScenePerformanceProfile = { resolution: number; maxFps: number; rain: number; snow: number; petal: number; leaf: number };

function scenePerformanceProfile(): ScenePerformanceProfile {
  const tier = document.documentElement.dataset.performanceTier;
  if (tier === "very-low") return { resolution: .45, maxFps: 24, rain: 7, snow: 6, petal: 5, leaf: 5 };
  if (tier === "low") return { resolution: .65, maxFps: 30, rain: 11, snow: 9, petal: 8, leaf: 8 };
  if (tier === "high") return { resolution: 1, maxFps: 60, rain: 24, snow: 19, petal: 15, leaf: 15 };
  return { resolution: .82, maxFps: 45, rain: 17, snow: 14, petal: 11, leaf: 11 };
}

/** PixiJS renders only the moving atmosphere particles; all assets remain bundled locally. */
function mountSceneParticles(root: HTMLElement): () => void {
  const host = root.querySelector<HTMLElement>(".expedition-weather-particles");
  const scene = root.querySelector<HTMLElement>(".expedition-environment");
  if (!host || !scene || reducedMotion()) return () => {};
  const weather = scene.dataset.weather;
  const cycle = scene.dataset.cycle;
  const kind: SceneParticleKind | "" = weather === "Rain" ? "rain" : weather === "Snow" ? "snow" : cycle === "Dawn" ? "petal" : cycle === "Dusk" ? "leaf" : "";
  if (!kind) return () => {};

  const profile = scenePerformanceProfile();
  const count = profile[kind];
  let disposed = false;
  let initialized = false;
  let pixiApp: import("pixi.js").Application | null = null;
  let fallbackAnimation: { pause: () => void } | null = null;

  const mountFallback = () => {
    if (disposed) return;
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
    if (kind === "rain") {
      fallbackAnimation = animate(nodes, { translateY: ["-24px", "360px"], translateX: (_, i) => ((((i ?? 0) % 5) - 2) * 13) + "px", opacity: [0, .72, 0], duration: 1050, ease: "linear", delay: stagger(34), loop: true });
    } else if (kind === "snow") {
      fallbackAnimation = animate(nodes, { translateY: ["-18px", "360px"], translateX: (_, i) => ((((i ?? 0) % 7) - 3) * 12) + "px", scale: [.7, 1.15], opacity: [0, .82, .12], duration: 7200, ease: "inOutSine", delay: stagger(180), loop: true });
    } else {
      fallbackAnimation = animate(nodes, { translateY: ["-12px", "360px"], translateX: (_, i) => ((((i ?? 0) % 7) - 3) * 23) + "px", rotate: [-35, 110], scale: [.65, 1], opacity: [0, .82, 0], duration: cycle === "Dawn" ? 9200 : 11800, ease: "inOutSine", delay: stagger(260), loop: true });
    }
  };

  const destroyRenderer = () => {
    if (!pixiApp) return;
    const app = pixiApp;
    pixiApp = null;
    const wasInitialized = initialized;
    initialized = false;
    try {
      if (wasInitialized) app.ticker.stop();
      // Also attempt cleanup when Application.init() rejects partway through.
      app.destroy({ removeView: true }, { children: true, texture: true, textureSource: true });
    } catch { /* The WebView may already have reclaimed its graphics context. */ }
  };

  const onVisibilityChange = () => {
    if (!pixiApp || !initialized) return;
    if (document.hidden) pixiApp.ticker.stop();
    else pixiApp.ticker.start();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  void (async () => {
    try {
      const PIXI = await import("pixi.js");
      if (disposed) return;
      const app = new PIXI.Application();
      pixiApp = app;
      const deviceScale = Math.min(window.devicePixelRatio || 1, 2);
      await app.init({
        resizeTo: host,
        backgroundAlpha: 0,
        antialias: false,
        autoDensity: true,
        resolution: deviceScale * profile.resolution,
        powerPreference: "low-power",
        clearBeforeRender: true,
      });
      initialized = true;
      if (disposed) { destroyRenderer(); return; }

      const particleTexture = kind === "rain" ? PIXI.Texture.WHITE : (() => {
        const shape = new PIXI.Graphics();
        if (kind === "snow") shape.circle(5, 5, 4).fill({ color: 0xffffff });
        else shape.ellipse(7, 5, kind === "leaf" ? 7.5 : 7, kind === "leaf" ? 3 : 3.5).fill({ color: 0xffffff });
        const texture = app.renderer.generateTexture(shape);
        shape.destroy();
        return texture;
      })();

      type ParticleState = { sprite: import("pixi.js").Sprite; vx: number; vy: number; sway: number; phase: number; spin: number };
      const particles: ParticleState[] = [];
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      for (let i = 0; i < count; i++) {
        const sprite = new PIXI.Sprite(particleTexture);
        sprite.anchor.set(.5);
        if (kind === "rain") {
          sprite.width = 1.5;
          sprite.height = 13 + (i % 4) * 4;
          sprite.tint = 0xd7e4ed;
          sprite.alpha = .35 + (i % 4) * .12;
          sprite.rotation = -.24;
        } else if (kind === "snow") {
          const size = 2.2 + (i % 4) * .9;
          sprite.width = size;
          sprite.height = size;
          sprite.tint = 0xfff8e9;
          sprite.alpha = .45 + (i % 5) * .1;
        } else {
          sprite.width = 7 + (i % 4) * 2;
          sprite.height = 4 + (i % 3) * 1.5;
          sprite.tint = kind === "petal" ? 0xe7a4b1 : 0xc18b50;
          sprite.alpha = .48 + (i % 4) * .12;
        }
        sprite.x = Math.random() * width;
        sprite.y = Math.random() * height;
        app.stage.addChild(sprite);
        particles.push({
          sprite,
          vx: kind === "rain" ? 14 + (i % 5) * 5 : kind === "snow" ? ((i % 7) - 3) * 3 : ((i % 7) - 3) * 5,
          vy: kind === "rain" ? 250 + (i % 6) * 35 : kind === "snow" ? 17 + (i % 5) * 5 : 18 + (i % 6) * 5,
          sway: kind === "rain" ? 0 : kind === "snow" ? 7 : 13,
          phase: i * 1.73,
          spin: kind === "petal" || kind === "leaf" ? ((i % 5) - 2) * .22 : 0,
        });
      }

      let elapsed = 0;
      app.ticker.maxFPS = profile.maxFps;
      app.ticker.add(ticker => {
        const dt = Math.min(ticker.deltaMS / 1000, .06);
        elapsed += dt;
        const currentWidth = Math.max(1, host.clientWidth);
        const currentHeight = Math.max(1, host.clientHeight);
        for (const particle of particles) {
          const sprite = particle.sprite;
          sprite.x += (particle.vx + Math.sin(elapsed * (kind === "rain" ? 1 : .8) + particle.phase) * particle.sway) * dt;
          sprite.y += particle.vy * dt;
          if (particle.spin) sprite.rotation += particle.spin * dt;
          if (sprite.y > currentHeight + 18) {
            sprite.y = -12 - Math.random() * 28;
            sprite.x = Math.random() * currentWidth;
          }
          if (sprite.x < -20) sprite.x = currentWidth + 12;
          else if (sprite.x > currentWidth + 20) sprite.x = -12;
        }
      });
      app.canvas.className = "expedition-pixi-canvas";
      app.canvas.setAttribute("aria-hidden", "true");
      host.dataset.renderer = "pixi";
      host.replaceChildren(app.canvas);
      onVisibilityChange();
    } catch {
      destroyRenderer();
      host.dataset.renderer = "fallback";
      mountFallback();
    }
  })();

  return () => {
    disposed = true;
    document.removeEventListener("visibilitychange", onVisibilityChange);
    fallbackAnimation?.pause();
    destroyRenderer();
    host.replaceChildren();
    delete host.dataset.renderer;
  };
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
    listeners.push(mountSceneParticles(root));

    // Uploaded image plates: each layer has its own motion profile and remains inside Scene Window.
    const sunImage = root.querySelector<HTMLElement>(".expedition-sun-glow-image");
    if (sunImage && root.querySelector<HTMLElement>(".expedition-environment")?.dataset.cycle!=="Night") animate(sunImage,{translateX:["-.35%",".35%"],scale:[1,1.035],opacity:[.72,1],duration:15000,ease:"inOutSine",loop:true,alternate:true});
    const moonImage = root.querySelector<HTMLElement>(".expedition-moon-glow-image");
    if (moonImage && root.querySelector<HTMLElement>(".expedition-environment")?.dataset.cycle==="Night") animate(moonImage,{translateX:[".25%","-.25%"],scale:[1,1.025],opacity:[.58,.9],duration:19000,ease:"inOutSine",loop:true,alternate:true});
    const rayImage = root.querySelector<HTMLElement>(".expedition-light-rays-image");
    if (rayImage && ["Dawn","Morning","Day"].includes(root.querySelector<HTMLElement>(".expedition-environment")?.dataset.cycle??"")) animate(rayImage,{translateX:["1.2%","-1.2%"],translateY:["-.4%",".5%"],opacity:[.55,.88],duration:28000,ease:"inOutSine",loop:true,alternate:true});
    const rainTexture = root.querySelector<HTMLElement>(".expedition-rain-streak-image");
    if (rainTexture && root.querySelector<HTMLElement>(".expedition-environment")?.dataset.weather==="Rain") {
      animate(rainTexture,{translateY:["-3%","5%"],translateX:["1%","-1%"],opacity:[.5,.82],duration:2600,ease:"linear",loop:true,alternate:true});
    }
    const snowTexture = root.querySelector<HTMLElement>(".expedition-snow-texture");
    if (snowTexture && root.querySelector<HTMLElement>(".expedition-environment")?.dataset.weather==="Snow") {
      animate(snowTexture,{translateY:["-2%","4%"],translateX:["-.8%","1.1%"],opacity:[.46,.78],duration:11500,ease:"inOutSine",loop:true,alternate:true});
    }
    const petalTexture = root.querySelector<HTMLElement>(".expedition-petal-texture");
    if (petalTexture && root.querySelector<HTMLElement>(".expedition-environment")?.dataset.cycle==="Dawn") {
      animate(petalTexture,{translateY:["-2%","5%"],translateX:["-1.5%","2%"],rotate:["-1.5deg","2deg"],opacity:[.35,.68],duration:18000,ease:"inOutSine",loop:true,alternate:true});
    }
    const leafTexture = root.querySelector<HTMLElement>(".expedition-leaf-texture");
    if (leafTexture && root.querySelector<HTMLElement>(".expedition-environment")?.dataset.cycle==="Dusk") {
      animate(leafTexture,{translateY:["-2%","5%"],translateX:["2%","-2%"],rotate:["1.5deg","-2deg"],opacity:[.34,.7],duration:21000,ease:"inOutSine",loop:true,alternate:true});
    }
    const frost = root.querySelector<HTMLElement>(".expedition-window-frost-image");
    if (frost && root.querySelector<HTMLElement>(".expedition-environment")?.dataset.weather==="Snow") {
      animate(frost,{opacity:[.52,.76],scale:[1.015,1.045],duration:12500,ease:"inOutSine",loop:true,alternate:true});
    }
    const sun = root.querySelector<HTMLElement>(".expedition-sun-glow");
    if (sun && root.querySelector<HTMLElement>(".expedition-environment")?.dataset.cycle!=="Night") animate(sun,{opacity:[.58,.9],scale:[.98,1.045],duration:9200,ease:"inOutSine",loop:true,alternate:true});
    const moon = root.querySelector<HTMLElement>(".expedition-moon-glow");
    if (moon && root.querySelector<HTMLElement>(".expedition-environment")?.dataset.cycle==="Night") animate(moon,{opacity:[.42,.78],scale:[.99,1.035],duration:11800,ease:"inOutSine",loop:true,alternate:true});
    const rays = root.querySelector<HTMLElement>(".expedition-light-rays");
    if (rays && ["Dawn","Morning","Day"].includes(root.querySelector<HTMLElement>(".expedition-environment")?.dataset.cycle??"")) animate(rays,{rotate:["-4deg","5deg"],opacity:[.16,.34],duration:26000,ease:"inOutSine",loop:true,alternate:true});
    const lightning = root.querySelector<HTMLElement>(".expedition-lightning-layer");
    const lightningImage = root.querySelector<HTMLImageElement>(".expedition-lightning-flash-image");
    if (lightning && lightningImage && root.querySelector<HTMLElement>(".expedition-environment")?.dataset.weather==="Rain") {
      const variants = [
        "/game/scenery/shared/fx-08-lightning-flash-a.png",
        "/game/scenery/shared/fx-08-lightning-flash-b.png",
        "/game/scenery/shared/fx-08-lightning-flash-c.png",
      ];
      let variant = 0;
      animate(lightning,{keyframes:[{opacity:0,duration:13800},{opacity:.72,duration:70},{opacity:.12,duration:145},{opacity:.52,duration:55},{opacity:0,duration:1250}],loop:true,ease:"linear",onLoop:()=>{variant=(variant+1)%variants.length;lightningImage.src=variants[variant];}});
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
