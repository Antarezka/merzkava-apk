import { animate, createTimeline } from "animejs";

/** Anime.js motion for Kitty's independently layered splash artwork. */
export function animateOpeningSplash(splash: HTMLElement): () => void {
  const content = splash.querySelector<HTMLElement>(".splash-content");
  const mascot = splash.querySelector<HTMLElement>(".splash-mascot");
  const body = splash.querySelector<HTMLElement>(".kitty-body");
  const head = splash.querySelector<HTMLElement>(".kitty-head");
  const tail = splash.querySelector<HTMLElement>(".kitty-tail");
  const shadow = splash.querySelector<HTMLElement>(".kitty-shadow");
  const kicker = splash.querySelector<HTMLElement>(".splash-kicker");
  const title = splash.querySelector<HTMLElement>(".splash-wordmark");
  const rule = splash.querySelector<HTMLElement>(".splash-rule");
  const tagline = splash.querySelector<HTMLElement>(".splash-tagline");
  if (!content || !mascot || !body || !head || !tail || !shadow || !title) return () => undefined;

  const layers = [shadow, tail, body, head];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    content.style.opacity = "1";
    content.style.transform = "none";
    layers.forEach(layer => { layer.style.opacity = "1"; layer.style.transform = "none"; });
    return () => undefined;
  }

  const particles: HTMLSpanElement[] = [];
  for (let index = 0; index < 9; index += 1) {
    const particle = document.createElement("span");
    particle.className = "splash-spark";
    particle.setAttribute("aria-hidden", "true");
    particle.style.setProperty("--spark-x", `${(index * 37 + 13) % 90 + 5}%`);
    particle.style.setProperty("--spark-y", `${(index * 53 + 9) % 82 + 9}%`);
    splash.append(particle);
    particles.push(particle);
  }

  const entrance = createTimeline({ defaults: { ease: "outCubic" } });
  entrance
    .add(content, { opacity: [0, 1], translateY: [16, 0], duration: 900 }, 180)
    .add(mascot, { scale: [0.88, 1], rotate: [-2, 0], duration: 1100, ease: "outBack" }, 220);
  if (kicker) entrance.add(kicker, { opacity: [0, 1], translateY: [7, 0], duration: 600 }, 680);
  entrance.add(title, { opacity: [0, 1], translateY: [10, 0], duration: 760 }, 780);
  if (rule) entrance.add(rule, { scaleX: [0, 1], opacity: [0, 1], duration: 650 }, 1040);
  if (tagline) entrance.add(tagline, { opacity: [0, 1], duration: 700 }, 1200);

  // Each artwork layer has its own Anime.js instance and pivot.
  const bodyBreath = animate(body, {
    scaleY: [1, 1.012], translateY: [0, -1.5], duration: 2300,
    ease: "inOutSine", alternate: true, loop: true, delay: 1250
  });
  const headIdle = animate(head, {
    rotate: [-0.7, 0.7], translateY: [0, -2], duration: 3100,
    ease: "inOutSine", alternate: true, loop: true, delay: 1500
  });
  const tailSway = animate(tail, {
    rotate: [-4.5, 5.5], duration: 1750,
    ease: "inOutSine", alternate: true, loop: true, delay: 900
  });
  const shadowBreath = animate(shadow, {
    scaleX: [1, 1.075], scaleY: [1, 0.94], opacity: [0.72, 1],
    duration: 2300, ease: "inOutSine", alternate: true, loop: true, delay: 1250
  });
  const mascotIdle = animate(mascot, {
    translateY: [-2, 2], duration: 3600,
    ease: "inOutSine", alternate: true, loop: true, delay: 1600
  });

  const sparkAnimations = particles.map((particle, index) => animate(particle, {
    opacity: [0, 0.75, 0],
    scale: [0.55, 1.15, 0.55],
    translateY: [12, -22],
    duration: 2200 + (index % 4) * 420,
    delay: index * 190,
    ease: "inOutSine",
    loop: true
  }));

  return () => {
    entrance.pause();
    bodyBreath.pause();
    headIdle.pause();
    tailSway.pause();
    shadowBreath.pause();
    mascotIdle.pause();
    sparkAnimations.forEach(animation => animation.pause());
    particles.forEach(particle => particle.remove());
  };
}
