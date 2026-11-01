import { animate, createTimeline } from "animejs";

/**
 * Animate Kitty's visible PNG layers without changing their shared 1024x1024
 * canvas alignment. The floor shadow belongs in the splash, not the app icon.
 * Ears are painted into kitty-head.png, so movement stays at the head/ear root.
 */
export function animateOpeningSplash(splash: HTMLElement): () => void {
  const content = splash.querySelector<HTMLElement>(".splash-content");
  const mascot = splash.querySelector<HTMLElement>(".splash-mascot");
  const shadow = mascot?.querySelector<HTMLElement>(".kitty-shadow");
  const body = mascot?.querySelector<HTMLElement>(".kitty-body");
  const head = mascot?.querySelector<HTMLElement>(".kitty-head");
  const tail = mascot?.querySelector<HTMLElement>(".kitty-tail");
  const kicker = splash.querySelector<HTMLElement>(".splash-kicker");
  const title = splash.querySelector<HTMLElement>(".splash-wordmark");
  const lightRay = splash.querySelector<HTMLElement>(".splash-light-ray");
  const rule = splash.querySelector<HTMLElement>(".splash-rule");
  const tagline = splash.querySelector<HTMLElement>(".splash-tagline");

  if (!content || !mascot || !shadow || !body || !head || !tail || !title || !lightRay) {
    return () => undefined;
  }

  const backdropEntrance=animate(splash,{opacity:[0,1],duration:680,ease:"outCubic"});
  const layers = [shadow, body, head, tail];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    content.style.opacity = "1";
    content.style.transform = "none";
    layers.forEach(layer => {
      layer.style.opacity = "1";
      layer.style.transform = "none";
    });
    lightRay.style.opacity = "0.22";
    return () => undefined;
  }

  const particles: HTMLSpanElement[] = [];
  for (let index = 0; index < 8; index += 1) {
    const particle = document.createElement("span");
    particle.className = "splash-spark";
    particle.setAttribute("aria-hidden", "true");
    particle.style.setProperty("--spark-x", `${(index * 29 + 31) % 72 + 14}%`);
    particle.style.setProperty("--spark-y", `${(index * 41 + 39) % 48 + 38}%`);
    splash.append(particle);
    particles.push(particle);
  }

  const entrance = createTimeline({ defaults: { ease: "outCubic" } });
  entrance
    .add(content, { opacity: [0, 1], duration: 850 }, 160)
    .add(mascot, { opacity: [0, 1], duration: 900 }, 240)
    .add(title, { opacity: [0, 1], translateY: [8, 0], duration: 820 }, 560)
    .add(lightRay, { opacity: [0, 0.34], duration: 1250, ease: "inOutSine" }, 900);
  if (kicker) entrance.add(kicker, { opacity: [0, 1], translateY: [6, 0], duration: 560 }, 620);
  if (rule) entrance.add(rule, { scaleX: [0, 1], opacity: [0, 1], duration: 620 }, 1040);
  if (tagline) entrance.add(tagline, { opacity: [0, 1], duration: 650 }, 1180);

  // A subtle contact shadow breathes with Kitty, grounding her on the splash stage.
  const bodyBreath = animate(body, {
    scaleY: [1, 1.014], translateY: [0, -1.8], rotate: [0, 0.22], duration: 2050,
    ease: "inOutSine", alternate: true, loop: true, delay: 520
  });
  const shadowBreath = animate(shadow, {
    scaleX: [1, 1.045], scaleY: [1, 0.965], opacity: [0.68, 0.92],
    duration: 2050, ease: "inOutSine", alternate: true, loop: true, delay: 520
  });

  // Kitty occasionally shakes her head like a cat flicking off water:
  // three quick, diminishing side-to-side snaps, then a long relaxed pause.
  // The timeline repeats as a whole, so the shake never becomes constant motion.
  const headShake = createTimeline({ defaults: { ease: "outCubic" }, loop: true });
  headShake
    .add(head, { rotate: [0, -8, 7, -5, 3, 0], duration: 560 }, 1800)
    .add(head, { rotate: 0, duration: 1 }, 6000);

  // Keep the gentle breathing drift independent from the occasional head shake.
  const headIdle = animate(head, {
    translateY: [0, -1.1], translateX: [0.25, -0.25], duration: 2550,
    ease: "inOutSine", alternate: true, loop: true, delay: 760
  });
  const tailSway = animate(tail, {
    rotate: [-5.2, 5.8], translateY: [0, -1.4], duration: 1850,
    ease: "inOutSine", alternate: true, loop: true, delay: 420
  });
  // A warm diagonal reflection travels from the wordmark down toward Kitty
  // and the same diagonal floor-shadow direction.
  const lightBreath = animate(lightRay, {
    opacity: [0.1, 0.48, 0.16],
    scale: [0.975, 1.045, 0.99],
    translateX: [7, -6, 2],
    duration: 3400, ease: "inOutSine", alternate: true, loop: true, delay: 380
  });
  const wordmarkGlow = animate(title, {
    opacity: [0.9, 1, 0.94],
    duration: 3400, ease: "inOutSine", alternate: true, loop: true, delay: 380
  });

  const sparkAnimations = particles.map((particle, index) => animate(particle, {
    opacity: [0, 0.5, 0],
    scale: [0.5, 1.15, 0.65],
    translateY: [7, -18],
    duration: 2450 + (index % 4) * 280,
    delay: index * 220,
    ease: "inOutSine",
    loop: true
  }));

  return () => {
    backdropEntrance.pause();
    entrance.pause();
    bodyBreath.pause();
    shadowBreath.pause();
    headShake.pause();
    headIdle.pause();
    tailSway.pause();
    lightBreath.pause();
    wordmarkGlow.pause();
    sparkAnimations.forEach(animation => animation.pause());
    particles.forEach(particle => particle.remove());
  };
}

/** Anime.js curtain replaces the former CSS keyframe close sequence. */
export function animateSplashCurtain(splash:HTMLElement,onComplete:()=>void):void {
  if(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){
    animate(splash,{opacity:[1,0],duration:140,ease:"outQuad",onComplete});
    return;
  }
  const content=splash.querySelector<HTMLElement>(".splash-content");
  if(content) animate(content,{opacity:[1,0],translateY:[0,-7],scale:[1,.985],filter:["blur(0px)","blur(3px)"],duration:460,ease:"inOutCubic"});
  animate(splash,{opacity:[1,0],duration:520,ease:"inOutCubic",onComplete});
}
