import { animate, createTimeline } from "animejs";

/** Anime.js-powered splash motion. The supplied mascot artwork remains untouched. */
export function animateOpeningSplash(splash: HTMLElement): () => void {
  const content = splash.querySelector<HTMLElement>(".splash-content");
  const logo = splash.querySelector<HTMLElement>(".splash-logo");
  const kicker = splash.querySelector<HTMLElement>(".splash-kicker");
  const title = splash.querySelector<HTMLElement>(".splash-content h1");
  const rule = splash.querySelector<HTMLElement>(".splash-rule");
  const tagline = splash.querySelector<HTMLElement>(".splash-tagline");
  if (!content || !logo || !title) return () => undefined;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    content.style.opacity = "1";
    content.style.transform = "none";
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
    .add(logo, { scale: [0.88, 1], rotate: [-2, 0], duration: 1100, ease: "outBack" }, 220);
  if (kicker) entrance.add(kicker, { opacity: [0, 1], translateY: [7, 0], duration: 600 }, 680);
  entrance.add(title, { opacity: [0, 1], translateY: [10, 0], duration: 760 }, 780);
  if (rule) entrance.add(rule, { scaleX: [0, 1], opacity: [0, 1], duration: 650 }, 1040);
  if (tagline) entrance.add(tagline, { opacity: [0, 1], duration: 700 }, 1200);

  const idle = animate(logo, {
    translateY: [-3, 3],
    rotate: [-0.55, 0.55],
    duration: 2600,
    delay: 1500,
    ease: "inOutSine",
    alternate: true,
    loop: true
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
    idle.pause();
    sparkAnimations.forEach(animation => animation.pause());
    particles.forEach(particle => particle.remove());
  };
}
