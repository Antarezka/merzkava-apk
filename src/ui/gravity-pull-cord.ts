import { animate } from "animejs";

type CordOptions = {
  isCollapsed: () => boolean;
  toggle: () => void;
};

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
const randomBetween = (min: number, max: number): number => min + Math.random() * (max - min);

/**
 * App-wide magical pull cord. The SVG tether and terminal share one endpoint,
 * so the rope always meets the jewel while it follows the pointer.
 */
export function initializeGravityPullCord(root: HTMLElement, options: CordOptions): void {
  let active: { pointerId: number; startX: number; startY: number; handle: HTMLButtonElement } | null = null;
  let suppressClick = false;
  let pauseIdleSway: (() => void) | null = null;

  const getParts = () => ({
    cord: root.querySelector<HTMLElement>("[data-gravity-cord]"),
    line: root.querySelector<SVGPathElement>("[data-cord-line]"),
    highlight: root.querySelector<SVGPathElement>(".cord-thread-highlight"),
    handle: root.querySelector<HTMLButtonElement>("[data-cord-handle]")
  });

  // All geometry is derived from the same endpoint: the jewel's center.
  // Positive dx always means right on screen; negative dx always means left.
  const drawCord = (dx: number, vertical: number): void => {
    const { line, highlight, handle } = getParts();
    if (!line || !handle) return;
    const x = clamp(dx, -72, 72);
    const y = clamp(vertical, -70, 112);
    const endX = 27 + x;
    const endY = 142 + y;
    const c1x = 27 + x * 0.18;
    const c2x = 27 + x * 0.82;
    const curve = `M 27 5 C ${c1x} 48, ${c2x} ${endY - 42}, ${endX} ${endY}`;
    // Every visible rope layer shares exactly the same live Bézier curve.
    line.setAttribute("d", curve);
    highlight?.setAttribute("d", curve);
    handle.style.top = `${111 + y}px`;
    handle.style.left = `${x}px`;
  };

  const play = (file: string, volume = 0.78): void => {
    let enabled = true;
    try { enabled = localStorage.getItem("merzkava-sound-enabled") !== "false"; }
    catch { /* Use the session default. */ }
    if (!enabled) return;
    const audio = new Audio(file);
    audio.preload = "auto";
    audio.volume = volume;
    void audio.play().catch(error => console.warn("Gravity cord audio could not play:", error));
  };

  const returnCord = (delay = 0): void => {
    window.setTimeout(() => {
      const { handle } = getParts();
      if (!handle) return;
      const currentTop = clamp(Number.parseFloat(handle.style.top) || 111, 40, 223);
      const currentShift = Number.parseFloat(handle.style.left) || 0;
      const motion = { x: currentShift, y: currentTop - 111 };
      animate(motion, {
        x: 0,
        y: 0,
        duration: 690,
        ease: "outElastic(1, .52)",
        onUpdate: () => drawCord(motion.x, motion.y)
      });
    }, delay);
  };

  const scheduleIdleSway = (): void => {
    const { cord } = getParts();
    if (!cord || active) {
      window.setTimeout(scheduleIdleSway, 650);
      return;
    }
    const gust = Math.random() < 0.16;
    const amplitude = gust ? randomBetween(4.2, 7.2) : randomBetween(0.7, 2.4);
    const target = (Math.random() < 0.5 ? -1 : 1) * amplitude;
    const duration = gust ? randomBetween(700, 1050) : randomBetween(1250, 2100);
    const animation = animate(cord, {
      rotate: [
        { to: target, duration, ease: "inOutSine" },
        { to: 0, duration: duration * randomBetween(0.9, 1.35), ease: "outSine" }
      ],
      onComplete: () => {
        pauseIdleSway = null;
        window.setTimeout(scheduleIdleSway, randomBetween(500, gust ? 1500 : 2200));
      }
    });
    pauseIdleSway = () => animation.pause();
  };

  const animateDock = (wasCollapsed: boolean, done: () => void): void => {
    const dock = root.querySelector<HTMLElement>(".app-shell .bottom-nav");
    const track = dock?.querySelector<HTMLElement>(".nav-roulette-track");
    const handle = root.querySelector<HTMLElement>("[data-cord-handle]");
    if (!dock || !handle) { done(); return; }

    const distance = dock.offsetHeight + 12;
    const from = wasCollapsed ? distance : 0;
    const to = wasCollapsed ? 0 : distance;
    const duration = 1640;

    // Keep the dock centered; only its inner track performs the small rattle.
    dock.style.transform = `translateY(${from}px)`;
    dock.style.opacity = "1";
    dock.style.pointerEvents = "auto";
    animate(dock, {
      translateY: [
        { to: from + (to - from) * 0.025, duration: 110, ease: "outQuad" },
        { to: from - (to - from) * 0.012, duration: 150, ease: "inOutSine" },
        { to, duration: duration - 260, ease: "inOutCubic" }
      ],
      duration,
      onComplete: () => {
        dock.style.removeProperty("transform");
        dock.querySelectorAll<HTMLElement>(".nav-item").forEach(item => {
          item.style.pointerEvents = wasCollapsed ? "auto" : "none";
        });
        done();
      }
    });

    if (track) animate(track, {
      translateX: [
        { to: -2.5, duration: 55, delay: 300, ease: "outQuad" },
        { to: 2.5, duration: 65, ease: "inOutSine" },
        { to: -1, duration: 55, ease: "inOutSine" },
        { to: 0, duration: 75, ease: "outCubic" }
      ],
      delay: 300
    });

    const ornament = handle.querySelector<HTMLElement>(".gravity-cord-jewel");
    if (ornament) animate(ornament, {
      rotate: wasCollapsed ? [0, -13, 7, 0] : [0, 13, -7, 0],
      scale: [1, 0.9, 1.08, 1],
      duration: 610,
      delay: 140,
      ease: "outCubic"
    });
  };

  const trigger = (): void => {
    if (active) return;
    const wasCollapsed = options.isCollapsed();
    const { cord, handle } = getParts();
    if (!cord || !handle) return;

    pauseIdleSway?.();
    pauseIdleSway = null;
    active = { pointerId: -1, startX: 0, startY: 0, handle };
    handle.classList.add("is-pulling");
    play("/audio/Mechanical%20Activation.mp3", 0.76);

    const currentTop = Math.max(111, Number.parseFloat(handle.style.top) || 111);
    drawCord(0, currentTop - 111 + 24);
    returnCord(170);

    window.setTimeout(() => {
      play(wasCollapsed ? "/audio/spring%20return.mp3" : "/audio/toolbar%20fx%20turun.mp3", 0.82);
      animateDock(wasCollapsed, () => {
        handle.classList.remove("is-pulling");
        active = null;
        options.toggle();
        window.setTimeout(scheduleIdleSway, 650);
      });
    }, 330);

    const ornament = handle.querySelector<HTMLElement>(".gravity-cord-jewel");
    if (ornament) animate(ornament, {
      rotate: [0, wasCollapsed ? -17 : 17, 0],
      scale: [1, 0.88, 1.08, 1],
      duration: 520,
      ease: "outCubic"
    });
  };

  root.addEventListener("pointerdown", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const handle = target.closest<HTMLButtonElement>("[data-cord-handle]");
    if (!handle || active || (event.pointerType === "mouse" && event.button !== 0)) return;
    pauseIdleSway?.();
    pauseIdleSway = null;
    play("/audio/golden%20handle.mp3", 0.62);
    active = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, handle };
    handle.classList.add("is-grabbed");
    try { handle.setPointerCapture(event.pointerId); } catch { /* Pointer capture is optional. */ }
  });

  root.addEventListener("pointermove", event => {
    if (!active || active.pointerId !== event.pointerId) return;
    const vertical = clamp(event.clientY - active.startY, -70, 112);
    const horizontal = clamp(event.clientX - active.startX, -72, 72);
    drawCord(horizontal, vertical);
  }, { passive: true });

  root.addEventListener("pointerup", event => {
    if (!active || active.pointerId !== event.pointerId) return;
    const handle = active.handle;
    const dy = event.clientY - active.startY;
    const dx = event.clientX - active.startX;
    active = null;
    handle.classList.remove("is-grabbed");
    if (dy < 16 || Math.abs(dy) < Math.abs(dx) * 0.72) {
      returnCord();
      const { cord } = getParts();
      if (cord) animate(cord, {
        rotate: [0], duration: 520, ease: "outElastic(1, .55)",
        onComplete: () => window.setTimeout(scheduleIdleSway, 650)
      });
      return;
    }
    suppressClick = true;
    trigger();
  }, { passive: true });

  root.addEventListener("pointercancel", event => {
    if (!active || active.pointerId !== event.pointerId) return;
    const handle = active.handle;
    handle.classList.remove("is-grabbed");
    active = null;
    returnCord();
    const { cord } = getParts();
    if (cord) animate(cord, {
      rotate: [0], duration: 520, ease: "outElastic(1, .55)",
      onComplete: () => window.setTimeout(scheduleIdleSway, 650)
    });
  }, { passive: true });

  root.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const handle = target.closest<HTMLButtonElement>("[data-cord-handle]");
    if (!handle) return;
    if (suppressClick) { suppressClick = false; return; }
    if (event.detail !== 0) return;
    trigger();
  });

  window.setTimeout(scheduleIdleSway, 450);
}
