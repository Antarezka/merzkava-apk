import { animate, createTimeline } from "animejs";

/**
 * Animate Kitty's three visible PNG layers without changing their shared
 * 1024x1024 canvas alignment. The separate floor shadow is intentionally omitted.
 * Ears are painted into kitty-head.png, so movement stays at the head/ear root.
 */
export function animateOpeningSplash(splash: HTMLElement): () => void {
  const content = splash.querySelector<HTMLElement>(".splash-content");
  const mascot = splash.querySelector<HTMLElement>(".splash-mascot");
  const body = mascot?.querySelector<HTMLElement>(".kitty-body");
  const head = mascot?.querySelector<HTMLElement>(".kitty-head");
  const tail = mascot?.querySelector<HTMLElement>(".kitty-tail");
  const kicker = splash.querySelector<HTMLElement>(".splash-kicker");
  const title = splash.querySelector<HTMLElement>(".splash-wordmark");
  const lightRay = splash.querySelector<HTMLElement>(".splash-light-ray");
  const rule = splash.querySelector<HTMLElement>(".splash-rule");
  const tagline = splash.querySelector<HTMLElement>(".splash-tagline");

  if (!content || !mascot || !body || !head || !tail || !title || !lightRay) {
    return () => undefined;
  }

  const layers = [body, head, tail];
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
  for (let index = 0; index < 6; index += 1) {
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

  // One slow breath shared by torso, head and floor contact shadow.
  const bodyBreath = animate(body, {
    scaleY: [1, 1.009], translateY: [0, -1.1], duration: 2850,
    ease: "inOutSine", alternate: true, loop: true, delay: 1050
  });
  const headIdle = animate(head, {
    rotate: [-0.38, 0.42], translateY: [0, -0.8], duration: 3650,
    ease: "inOutSine", alternate: true, loop: true, delay: 1320
  });
  const tailSway = animate(tail, {
    rotate: [-2.8, 3.6], duration: 2850,
    ease: "inOutSine", alternate: true, loop: true, delay: 720
  });
  // A warm diagonal reflection travels from the wordmark down toward Kitty
  // and the same diagonal floor-shadow direction.
  const lightBreath = animate(lightRay, {
    opacity: [0.12, 0.42, 0.18],
    scale: [0.985, 1.035, 0.995],
    translateX: [5, -4, 2],
    duration: 4700, ease: "inOutSine", alternate: true, loop: true, delay: 650
  });
  const wordmarkGlow = animate(title, {
    opacity: [0.94, 1, 0.96],
    duration: 4700, ease: "inOutSine", alternate: true, loop: true, delay: 650
  });

  const sparkAnimations = particles.map((particle, index) => animate(particle, {
    opacity: [0, 0.42, 0],
    scale: [0.65, 1, 0.65],
    translateY: [5, -12],
    duration: 3000 + (index % 3) * 450,
    delay: index * 330,
    ease: "inOutSine",
    loop: true
  }));

  return () => {
    entrance.pause();
    bodyBreath.pause();
    headIdle.pause();
    tailSway.pause();
    lightBreath.pause();
    wordmarkGlow.pause();
    sparkAnimations.forEach(animation => animation.pause());
    particles.forEach(particle => particle.remove());
  };
}
