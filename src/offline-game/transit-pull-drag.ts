import { animate } from "animejs";

type ActiveDrag = {
  button: HTMLButtonElement;
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  moved: boolean;
  horizontal: boolean;
};

const DRAG_THRESHOLD = 6;
const CLICK_SUPPRESSION_MS = 500;
let installed = false;
let activeDrag: ActiveDrag | null = null;
let suppressClickUntil = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Drag the Arcanistry Transit handle left to bring it into view; drag it right
 * to return it to its resting edge. A normal tap is left to main.ts, where the
 * existing drawer open/close action remains authoritative.
 */
export function initializeArcanistryTransitDrag(root: HTMLElement): void {
  if (installed) return;
  installed = true;

  root.addEventListener("pointerdown", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>("button.arcanist-pull-tab[data-arcanist-pull]");
    if (!button || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;

    activeDrag = {
      button,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: Number.parseFloat(button.dataset.transitOffset ?? "0") || 0,
      moved: false,
      horizontal: false,
    };
    try { button.setPointerCapture(event.pointerId); } catch { /* bubbling root listeners remain as fallback */ }
  }, true);

  root.addEventListener("pointermove", event => {
    const drag = activeDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.horizontal && !drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    if (!drag.horizontal && Math.abs(dy) > Math.abs(dx)) {
      activeDrag = null;
      return;
    }

    drag.horizontal = true;
    drag.moved = true;
    event.preventDefault();

    const maxTravel = Math.min(220, Math.max(96, root.clientWidth * 0.62));
    const offset = clamp(drag.originX + dx, -maxTravel, 0);
    drag.button.style.transform = "translateX(" + offset + "px)";
    drag.button.dataset.transitOffset = String(offset);
  }, { capture: true, passive: false });

  const finish = (event: PointerEvent, cancelled = false): void => {
    const drag = activeDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    activeDrag = null;

    try {
      if (drag.button.hasPointerCapture(event.pointerId)) drag.button.releasePointerCapture(event.pointerId);
    } catch { /* pointer capture may already have been released */ }

    if (!drag.moved || !drag.horizontal) return;

    event.preventDefault();
    suppressClickUntil = Date.now() + CLICK_SUPPRESSION_MS;
    drag.button.classList.remove("is-transit-dragging");

    const maxTravel = Math.min(220, Math.max(96, root.clientWidth * 0.62));
    const current = Number.parseFloat(drag.button.dataset.transitOffset ?? "0") || 0;
    const target = cancelled ? drag.originX : event.clientX < drag.startX ? -maxTravel : 0;
    animate(drag.button, {
      translateX: [current, target],
      duration: 220,
      ease: "outCubic",
      onComplete: () => {
        drag.button.dataset.transitOffset = String(target);
        drag.button.style.transform = "translateX(" + target + "px)";
      },
    });
  };

  root.addEventListener("pointerup", event => finish(event), true);
  root.addEventListener("pointercancel", event => finish(event, true), true);
  root.addEventListener("lostpointercapture", event => finish(event as PointerEvent, true), true);

  root.addEventListener("click", event => {
    if (Date.now() > suppressClickUntil) return;
    const target = event.target;
    if (!(target instanceof Element) || !target.closest("button.arcanist-pull-tab[data-arcanist-pull]")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
}
