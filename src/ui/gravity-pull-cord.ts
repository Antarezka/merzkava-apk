import { animate } from "animejs";

type CordOptions = {
  isCollapsed: () => boolean;
  toggle: () => void;
};

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
const randomBetween = (min: number, max: number): number => min + Math.random() * (max - min);

/**
 * Main-menu-only magical pull cord. No device sensors are used.
 * The cord body is decorative/non-interactive; only its terminal receives input.
 */
export function initializeGravityPullCord(root: HTMLElement, options: CordOptions): void {
  let active: { pointerId: number; startX: number; startY: number; handle: HTMLButtonElement } | null = null;
  let suppressClick = false;
  let pauseIdleSway: (() => void) | null = null;

  const getParts = () => ({
    cord: root.querySelector<HTMLElement>("[data-gravity-cord]"),
    line: root.querySelector<HTMLElement>("[data-cord-line]"),
    handle: root.querySelector<HTMLButtonElement>("[data-cord-handle]"),
    ornament: root.querySelector<HTMLElement>(".gravity-cord-jewel")
  });

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
      const { line, handle } = getParts();
      if (!line || !handle) return;
      const currentHeight = Math.max(118, line.getBoundingClientRect().height);
      const currentTop = Math.max(111, Number.parseFloat(handle.style.top) || 111);
      animate(line, { height: [currentHeight, 118], duration: 690, ease: "outElastic(1, .52)" });
      animate(handle, { top: [currentTop, 111], duration: 690, ease: "outElastic(1, .52)" });
    }, delay);
  };

  const scheduleIdleSway = (): void => {\n    const { cord } = getParts();\n    if (!cord || active) { window.setTimeout(scheduleIdleSway, 650); return; }\n    const gust = Math.random() < 0.16;\n    const amplitude = gust ? randomBetween(4.2, 7.2) : randomBetween(0.7, 2.4);\n    const target = (Math.random() < 0.5 ? -1 : 1) * amplitude;\n    const duration = gust ? randomBetween(700, 1050) : randomBetween(1250, 2100);\n    const animation = animate(cord, {\n      rotate: [{ to: target, duration, ease: "inOutSine" }, { to: 0, duration: duration * randomBetween(0.9, 1.35), ease: "outSine" }],\n      onComplete: () => { pauseIdleSway = null; window.setTimeout(scheduleIdleSway, randomBetween(500, gust ? 1500 : 2200)); }\n    });\n    pauseIdleSway = () => animation.pause();\n  };\n\n  const animateDock = (wasCollapsed: boolean, done: () => void): void => {
    const dock = root.querySelector<HTMLElement>(".app-shell .bottom-nav");
    const track = dock?.querySelector<HTMLElement>(".nav-roulette-track");
    const handle = root.querySelector<HTMLElement>("[data-cord-handle]");
    if (!dock || !handle) { done(); return; }

    const distance = dock.offsetHeight + 12;
    const from = wasCollapsed ? distance : 0;
    const to = wasCollapsed ? 0 : distance;
    const duration = 1640;

    // Dock is centered by left/right auto margins, not translateX(-50%).
    // Its tiny rattle lives on the inner track, so it cannot destroy centering.
    dock.style.transform = `translateY(${from}px)`;
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
    const { cord, line, handle } = getParts();
    if (!cord || !line || !handle) return;

    pauseIdleSway?.();\n    pauseIdleSway = null;\n    active = { pointerId: -1, startX: 0, startY: 0, handle };
    handle.classList.add("is-pulling");
    play("/audio/Mechanical%20Activation.mp3", 0.76);

    // A visible tug on the cord, followed by a spring-loaded snap back.
    const currentHeight = Math.max(118, line.getBoundingClientRect().height);
    const currentTop = Math.max(111, Number.parseFloat(handle.style.top) || 111);
    animate(line, { height: [currentHeight, currentHeight + 24], duration: 145, ease: "outCubic" });
    animate(handle, { top: [currentTop, currentTop + 24], duration: 145, ease: "outCubic" });
    returnCord(170);

    window.setTimeout(() => {
      play(wasCollapsed ? "/audio/spring%20return.mp3" : "/audio/toolbar%20fx%20turun.mp3", 0.82);
      animateDock(wasCollapsed, () => {
        handle.classList.remove("is-pulling");
        active = null;
        options.toggle();\n        window.setTimeout(scheduleIdleSway, 650);
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
    pauseIdleSway?.();\n    pauseIdleSway = null;\n    play("/audio/golden%20handle.mp3", 0.62);
    active = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, handle };
    handle.classList.add("is-grabbed");
    try { handle.setPointerCapture(event.pointerId); } catch { /* Pointer capture is optional. */ }
  });

  root.addEventListener("pointermove", event => {
    if (!active || active.pointerId !== event.pointerId) return;
    const { line, handle, cord } = getParts();
    if (!line || !handle) return;
    const extension = clamp(event.clientY - active.startY, 0, 112);
    const lateral = clamp((event.clientX - active.startX) * 0.12, -9, 9);
    line.style.height = `${118 + extension}px`;
    handle.style.top = `${111 + extension}px`;
    if (cord) cord.style.transform = `rotate(${lateral}deg)`;
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
      if (cord) animate(cord, { rotate: [0], duration: 520, ease: "outElastic(1, .55)", onComplete: () => window.setTimeout(scheduleIdleSway, 650) });
      return;
    }
    suppressClick = true;
    trigger();
  }, { passive: true });

  root.addEventListener("pointercancel", event => {
    if (!active || active.pointerId !== event.pointerId) return;
    active.handle.classList.remove("is-grabbed");
    active = null;
    returnCord();
    const { cord } = getParts();
    if (cord) animate(cord, { rotate: [0], duration: 520, ease: "outElastic(1, .55)", onComplete: () => window.setTimeout(scheduleIdleSway, 650) });
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
