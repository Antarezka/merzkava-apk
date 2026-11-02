import { animate } from "animejs";

type CordOptions = {
  isCollapsed: () => boolean;
  toggle: () => void;
};

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

/**
 * Main-menu-only gravity cord. The cord has a fixed length and no hitbox;
 * only its gold terminal accepts touch or drag input.
 */
export function initializeGravityPullCord(root: HTMLElement, options: CordOptions): void {
  let active: { pointerId: number; startX: number; startY: number; handle: HTMLButtonElement } | null = null;
  let suppressClick = false;
  let lastAngle = 0;
  let running = false;
  let hasMotionData = false;

  const setAngle = (angle: number): void => {
    lastAngle = clamp(angle, -32, 32);
    const cord = root.querySelector<HTMLElement>("[data-gravity-cord]");
    if (cord) cord.style.setProperty("--cord-angle", `${lastAngle}deg`);
  };

  const onMotion = (event: DeviceMotionEvent): void => {
    const gravity = event.accelerationIncludingGravity;
    if (!gravity || gravity.x === null || gravity.y === null) return;
    hasMotionData = true;
    const angle = Math.atan2(-gravity.x, Math.max(1.2, Math.abs(gravity.y))) * 180 / Math.PI;
    setAngle(angle * 0.9);
  };

  const onOrientation = (event: DeviceOrientationEvent): void => {
    if (hasMotionData || event.gamma === null) return;
    setAngle(event.gamma * 0.42);
  };

  const enableSensor = (): void => {
    if (running) return;
    running = true;
    window.addEventListener("devicemotion", onMotion, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
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

  const animateDock = (wasCollapsed: boolean, done: () => void): void => {
    const dock = root.querySelector<HTMLElement>(".app-shell .bottom-nav");
    const handle = root.querySelector<HTMLElement>("[data-cord-handle]");
    if (!dock || !handle) { done(); return; }

    const distance = dock.offsetHeight + 12;
    const from = wasCollapsed ? distance : 0;
    const to = wasCollapsed ? 0 : distance;
    const duration = 1640;

    dock.style.transform = `translateX(-50%) translateY(${from}px)`;
    animate(dock, {
      translateY: [
        { to: from + (to - from) * 0.018, duration: 90, ease: "outQuad" },
        { to: from - (to - from) * 0.012, duration: 110, ease: "inOutSine" },
        { to, duration: duration - 200, ease: "inOutCubic" }
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

    // A short, controlled dock rattle follows the activation clicks.
    animate(dock, {
      translateX: [
        { to: -2, duration: 45, delay: 300, ease: "outQuad" },
        { to: 2, duration: 55, ease: "inOutSine" },
        { to: -1, duration: 50, ease: "inOutSine" },
        { to: 0, duration: 70, ease: "outCubic" }
      ],
      delay: 300
    });

    const jewel = handle.querySelector<HTMLElement>(".gravity-cord-jewel");
    if (jewel) animate(jewel, {
      rotate: wasCollapsed ? [0, -9, 5, 0] : [0, 9, -5, 0],
      scale: [1, 0.94, 1.06, 1],
      duration: 520,
      delay: 180,
      ease: "outCubic"
    });
  };

  const trigger = (): void => {
    if (active) return;
    const wasCollapsed = options.isCollapsed();
    const cord = root.querySelector<HTMLElement>("[data-gravity-cord]");
    const handle = root.querySelector<HTMLButtonElement>("[data-cord-handle]");
    if (!cord || !handle) return;

    active = { pointerId: -1, startX: 0, startY: 0, handle };
    handle.classList.add("is-pulling");
    play("/audio/Mechanical%20Activation.mp3", 0.76);

    // Activation's opening clicks lead into the toolbar's travel sound.
    window.setTimeout(() => {
      play(wasCollapsed ? "/audio/spring%20return.mp3" : "/audio/toolbar%20fx%20turun.mp3", 0.82);
      animateDock(wasCollapsed, () => {
        handle.classList.remove("is-pulling");
        active = null;
        options.toggle();
      });
    }, 330);

    const jewel = handle.querySelector<HTMLElement>(".gravity-cord-jewel");
    if (jewel) animate(jewel, {
      rotate: [0, wasCollapsed ? -10 : 10, 0],
      duration: 360,
      ease: "outCubic"
    });
  };

  root.addEventListener("pointerdown", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const handle = target.closest<HTMLButtonElement>("[data-cord-handle]");
    if (!handle || active || (event.pointerType === "mouse" && event.button !== 0)) return;
    enableSensor();
    play("/audio/golden%20handle.mp3", 0.62);
    active = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, handle };
    handle.classList.add("is-grabbed");
    try { handle.setPointerCapture(event.pointerId); } catch { /* Pointer capture is optional. */ }
  });

  root.addEventListener("pointerup", event => {
    if (!active || active.pointerId !== event.pointerId) return;
    const handle = active.handle;
    const dy = event.clientY - active.startY;
    const dx = event.clientX - active.startX;
    active = null;
    handle.classList.remove("is-grabbed");
    if (dy < 16 || Math.abs(dy) < Math.abs(dx) * 0.72) return;
    suppressClick = true;
    // Pull downward each time; the dock mechanism reverses based on its current state.
    trigger();
  }, { passive: true });

  root.addEventListener("pointercancel", event => {
    if (!active || active.pointerId !== event.pointerId) return;
    active.handle.classList.remove("is-grabbed");
    active = null;
  }, { passive: true });

  root.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const handle = target.closest<HTMLButtonElement>("[data-cord-handle]");
    if (!handle) return;
    if (suppressClick) { suppressClick = false; return; }
    if (event.detail !== 0) return;
    enableSensor();
    trigger();
  });

  enableSensor();
}
