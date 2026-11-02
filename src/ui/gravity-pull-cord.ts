import { animate } from "animejs";

type CordOptions = {
  isCollapsed: () => boolean;
  toggle: () => void;
};

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

/**
 * Main-menu-only gravity cord. The fixed-length cord is decorative and never
 * receives pointer input; only the gold terminal is an interactive target.
 */
export function initializeGravityPullCord(root: HTMLElement, options: CordOptions): void {
  let active: { pointerId: number; startX: number; startY: number; handle: HTMLButtonElement } | null = null;
  let suppressClick = false;
  let lastAngle = 0;
  let running = false;

  const setAngle = (angle: number): void => {
    lastAngle = clamp(angle, -32, 32);
    const cord = root.querySelector<HTMLElement>("[data-gravity-cord]");
    if (cord) cord.style.setProperty("--cord-angle", `${lastAngle}deg`);
  };

  const onMotion = (event: DeviceMotionEvent): void => {
    const gravity = event.accelerationIncludingGravity;
    if (!gravity || gravity.x === null || gravity.y === null) return;
    // Screen-plane gravity vector; atan2 keeps the cord responsive in either tilt direction.
    const angle = Math.atan2(-gravity.x, Math.max(1.2, Math.abs(gravity.y))) * 180 / Math.PI;
    setAngle(angle * 0.9);
  };
  const onOrientation = (event: DeviceOrientationEvent): void => {
    if (event.gamma === null) return;
    // Fallback for WebViews that expose orientation but not accelerationIncludingGravity.
    setAngle(event.gamma * 0.42);
  };

  const enableSensor = (): void => {
    if (running) return;
    running = true;
    window.addEventListener("devicemotion", onMotion, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
  };

  const play = (file: string, volume = 0.78): HTMLAudioElement | null => {
    const enabled = document.documentElement.dataset.soundEnabled !== "false";
    if (!enabled) return null;
    const audio = new Audio(file);
    audio.preload = "auto";
    audio.volume = volume;
    void audio.play().catch(error => console.warn("Gravity cord audio could not play:", error));
    return audio;
  };

  const animateDock = (collapsed: boolean, done: () => void): void => {
    const shell = root.querySelector<HTMLElement>(".app-shell");
    const dock = shell?.querySelector<HTMLElement>(".bottom-nav");
    const handle = root.querySelector<HTMLElement>("[data-cord-handle]");
    if (!shell || !dock || !handle) { done(); return; }

    const distance = dock.offsetHeight + 12;
    const from = collapsed ? 0 : distance;
    const to = collapsed ? distance : 0;
    const duration = 1640;

    // Small mechanical shudder follows the activation clicks, then the dock travels.
    animate(dock, {
      translateY: [
        { to: from + (to - from) * 0.018, duration: 90, ease: "outQuad" },
        { to: from - (to - from) * 0.012, duration: 110, ease: "inOutSine" },
        { to, duration: duration - 200, ease: "inOutCubic" }
      ],
      duration,
      onComplete: () => {
        dock.style.transform = `translateX(-50%) translateY(${to}px)`;
        dock.querySelectorAll<HTMLElement>(".nav-item").forEach(item => {
          item.style.pointerEvents = collapsed ? "none" : "auto";
        });
        done();
      }
    });

    animate(dock, {
      translateX: [
        { to: -2, duration: 45, delay: 300, ease: "outQuad" },
        { to: 2, duration: 55, ease: "inOutSine" },
        { to: -1, duration: 50, ease: "inOutSine" },
        { to: 0, duration: 70, ease: "outCubic" }
      ],
      delay: 300
    });

    animate(handle, {
      rotate: collapsed ? [0, -9, 5, 0] : [0, 9, -5, 0],
      scale: [1, 0.94, 1.06, 1],
      duration: 520,
      delay: 180,
      ease: "outCubic"
    });
  };

  const trigger = (direction: "down" | "up"): void => {
    if (active) return;
    const collapsed = options.isCollapsed();
    if ((direction === "down" && collapsed) || (direction === "up" && !collapsed)) return;

    const cord = root.querySelector<HTMLElement>("[data-gravity-cord]");
    const handle = root.querySelector<HTMLElement>("[data-cord-handle]");
    if (!cord || !handle) return;
    active = { pointerId: -1, startX: 0, startY: 0, handle: handle as HTMLButtonElement };
    handle.classList.add("is-pulling");
    play("/audio/Mechanical%20Activation.mp3", 0.76);
    // Toolbar travel starts after the activation's opening KLEK/gear cluster.
    window.setTimeout(() => {
      play(direction === "down" ? "/audio/toolbar%20fx%20turun.mp3" : "/audio/spring%20return.mp3", 0.82);
      animateDock(!collapsed, () => {
        handle.classList.remove("is-pulling");
        active = null;
        options.toggle();
      });
    }, 330);
    animate(cord, {
      rotate: direction === "down" ? [lastAngle, lastAngle + 8, lastAngle + 3] : [lastAngle, lastAngle - 8, lastAngle - 2],
      duration: 360,
      ease: "outCubic"
    });
  };

  root.addEventListener("pointerdown", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const handle = target.closest<HTMLButtonElement>("[data-cord-handle]");
    if (!handle || (event.pointerType === "mouse" && event.button !== 0)) return;
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
    if (Math.hypot(dx, dy) < 16) return;
    suppressClick = true;
    if (Math.abs(dy) >= Math.abs(dx) * 0.72) trigger(dy > 0 ? "down" : "up");
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
    trigger(options.isCollapsed() ? "up" : "down");
  });

  // DeviceMotion is preferred; DeviceOrientation is the fallback when motion data is absent.
  enableSensor();
}
