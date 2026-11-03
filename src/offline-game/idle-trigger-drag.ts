type IdleDragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  moved: boolean;
  button: HTMLButtonElement;
};

const POSITION_KEY = "merzkava.eternal-path.floating-tv-position.v1";
const DRAG_THRESHOLD = 5;
const EDGE_GAP = 8;
let savedPosition: { x: number; y: number } | null = null;
let drag: IdleDragState | null = null;
let installed = false;
let suppressNextClick = false;

function readPosition(): { x: number; y: number } | null {
  try {
    const raw = window.localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as { x?: unknown; y?: unknown };
    return typeof value.x === "number" && Number.isFinite(value.x)
      && typeof value.y === "number" && Number.isFinite(value.y)
      ? { x: value.x, y: value.y }
      : null;
  } catch {
    return null;
  }
}

function persistPosition(): void {
  if (!savedPosition) return;
  try {
    window.localStorage.setItem(POSITION_KEY, JSON.stringify(savedPosition));
  } catch {
    // Private browsing or storage limits must never disable dragging.
  }
}

function clampPosition(x: number, y: number, button: HTMLElement): { x: number; y: number } {
  const width = button.offsetWidth || 52;
  const height = button.offsetHeight || 52;
  const maxX = Math.max(EDGE_GAP, window.innerWidth - width - EDGE_GAP);
  const maxY = Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP);
  return {
    x: Math.max(EDGE_GAP, Math.min(x, maxX)),
    y: Math.max(EDGE_GAP, Math.min(y, maxY)),
  };
}

function applyPosition(button: HTMLButtonElement): void {
  if (!savedPosition) return;
  const point = clampPosition(savedPosition.x, savedPosition.y, button);
  savedPosition = point;
  button.style.left = point.x + "px";
  button.style.top = point.y + "px";
  button.style.right = "auto";
  button.style.bottom = "auto";
}

function finishDrag(event: PointerEvent): void {
  const active = drag;
  if (!active || event.pointerId !== active.pointerId) return;

  if (active.moved) {
    suppressNextClick = true;
    persistPosition();
    // A cancelled synthetic click must not suppress the next deliberate tap.
    window.setTimeout(() => { suppressNextClick = false; }, 450);
  }
  active.button.classList.remove("is-dragging");
  try {
    if (active.button.hasPointerCapture(event.pointerId)) {
      active.button.releasePointerCapture(event.pointerId);
    }
  } catch {
    // The browser may already have released capture after pointercancel.
  }
  drag = null;
}

export function initializeIdleTriggerDrag(): void {
  if (!installed) {
    installed = true;

    document.addEventListener("pointerdown", event => {
      const target = event.target as Element | null;
      const button = target?.closest<HTMLButtonElement>(".expedition-page .expedition-idle-trigger");
      if (!button || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;

      const rect = button.getBoundingClientRect();
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: rect.left,
        originY: rect.top,
        moved: false,
        button,
      };

      try {
        button.setPointerCapture(event.pointerId);
      } catch {
        // Document-level listeners remain as a fallback if capture is unavailable.
      }
    }, { capture: true, passive: true });

    document.addEventListener("pointermove", event => {
      const active = drag;
      if (!active || event.pointerId !== active.pointerId) return;

      const dx = event.clientX - active.startX;
      const dy = event.clientY - active.startY;
      if (!active.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

      active.moved = true;
      event.preventDefault();
      active.button.classList.add("is-dragging");

      const point = clampPosition(active.originX + dx, active.originY + dy, active.button);
      savedPosition = point;
      active.button.style.left = point.x + "px";
      active.button.style.top = point.y + "px";
      active.button.style.right = "auto";
      active.button.style.bottom = "auto";
    }, { capture: true, passive: false });

    document.addEventListener("pointerup", finishDrag, true);
    document.addEventListener("pointercancel", finishDrag, true);

    document.addEventListener("lostpointercapture", event => {
      if (drag && event.target === drag.button) finishDrag(event as PointerEvent);
    }, true);

    document.addEventListener("click", event => {
      if (!suppressNextClick) return;
      const target = event.target as Element | null;
      if (target?.closest(".expedition-page .expedition-idle-trigger")) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      suppressNextClick = false;
    }, true);

    window.addEventListener("resize", () => {
      const button = document.querySelector<HTMLButtonElement>(".expedition-page .expedition-idle-trigger");
      if (button && savedPosition) {
        savedPosition = clampPosition(savedPosition.x, savedPosition.y, button);
        applyPosition(button);
        persistPosition();
      }
    }, { passive: true });
  }

  const button = document.querySelector<HTMLButtonElement>(".expedition-page .expedition-idle-trigger");
  if (!button) return;
  if (!savedPosition) savedPosition = readPosition();
  applyPosition(button);
}
