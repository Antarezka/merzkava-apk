type IdleDragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  moved: boolean;
  button: HTMLButtonElement;
  positionKey: string;
};

const LEGACY_POSITION_KEY = "merzkava.eternal-path.floating-tv-position.v1";
const DEFAULT_POSITION_KEY = "merzkava.eternal-path.augusto-pxl-position.v1";
const DRAG_SELECTOR = ".expedition-page .expedition-idle-trigger, .expedition-page .expedition-pxl-trigger";
const DRAG_THRESHOLD = 5;
const EDGE_GAP = 8;
const savedPositions = new Map<string, { x: number; y: number }>();
let drag: IdleDragState | null = null;
let installed = false;
let suppressNextClick = false;

function getPositionKey(button: HTMLButtonElement): string {
  return button.dataset.dragPositionKey || (button.classList.contains("expedition-idle-trigger") ? LEGACY_POSITION_KEY : DEFAULT_POSITION_KEY);
}

function readPosition(key: string): { x: number; y: number } | null {
  try {
    const raw = window.localStorage.getItem(key);
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

function getSavedPosition(key: string): { x: number; y: number } | null {
  if (!savedPositions.has(key)) savedPositions.set(key, readPosition(key) ?? null as never);
  return savedPositions.get(key) ?? null;
}

function persistPosition(key: string): void {
  const point = savedPositions.get(key);
  if (!point) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(point));
  } catch {
    // Private browsing or storage limits must never disable dragging.
  }
}

function clampPosition(x: number, y: number, button: HTMLElement): { x: number; y: number } {
  const width = button.offsetWidth || 54;
  const height = button.offsetHeight || 54;
  const maxX = Math.max(EDGE_GAP, window.innerWidth - width - EDGE_GAP);
  const maxY = Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP);
  return { x: Math.max(EDGE_GAP, Math.min(x, maxX)), y: Math.max(EDGE_GAP, Math.min(y, maxY)) };
}

function applyPosition(button: HTMLButtonElement): void {
  const point = getSavedPosition(getPositionKey(button));
  if (!point) return;
  const clamped = clampPosition(point.x, point.y, button);
  savedPositions.set(getPositionKey(button), clamped);
  button.style.left = clamped.x + "px";
  button.style.top = clamped.y + "px";
  button.style.right = "auto";
  button.style.bottom = "auto";
}

function finishDrag(event: PointerEvent): void {
  const active = drag;
  if (!active || event.pointerId !== active.pointerId) return;
  if (active.moved) {
    suppressNextClick = true;
    persistPosition(active.positionKey);
    // A cancelled synthetic click must not suppress the next deliberate tap.
    window.setTimeout(() => { suppressNextClick = false; }, 450);
  }
  active.button.classList.remove("is-dragging");
  try {
    if (active.button.hasPointerCapture(event.pointerId)) active.button.releasePointerCapture(event.pointerId);
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
      const button = target?.closest<HTMLButtonElement>(DRAG_SELECTOR);
      if (!button || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      const rect = button.getBoundingClientRect();
      const positionKey = getPositionKey(button);
      drag = { pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,originX:rect.left,originY:rect.top,moved:false,button,positionKey };
      if (!savedPositions.has(positionKey)) {
        const stored = readPosition(positionKey);
        if (stored) savedPositions.set(positionKey, stored);
      }
      try { button.setPointerCapture(event.pointerId); } catch {
        // Document-level listeners remain as a fallback if capture is unavailable.
      }
    }, { capture:true,passive:true });

    document.addEventListener("pointermove", event => {
      const active = drag;
      if (!active || event.pointerId !== active.pointerId) return;
      const dx=event.clientX-active.startX,dy=event.clientY-active.startY;
      if(!active.moved&&Math.hypot(dx,dy)<DRAG_THRESHOLD)return;
      active.moved=true;
      event.preventDefault();
      active.button.classList.add("is-dragging");
      const point=clampPosition(active.originX+dx,active.originY+dy,active.button);
      savedPositions.set(active.positionKey,point);
      active.button.style.left=point.x+"px";
      active.button.style.top=point.y+"px";
      active.button.style.right="auto";
      active.button.style.bottom="auto";
    }, {capture:true,passive:false});

    document.addEventListener("pointerup",finishDrag,true);
    document.addEventListener("pointercancel",finishDrag,true);
    document.addEventListener("lostpointercapture",event=>{
      if(drag&&event.target===drag.button)finishDrag(event as PointerEvent);
    },true);
    document.addEventListener("click",event=>{
      if(!suppressNextClick)return;
      const target=event.target as Element|null;
      if(target?.closest(DRAG_SELECTOR)){event.preventDefault();event.stopImmediatePropagation();}
      suppressNextClick=false;
    },true);
    window.addEventListener("resize",()=>{
      document.querySelectorAll<HTMLButtonElement>(DRAG_SELECTOR).forEach(button=>{
        const key=getPositionKey(button),point=getSavedPosition(key);
        if(!point)return;
        savedPositions.set(key,clampPosition(point.x,point.y,button));
        applyPosition(button);
        persistPosition(key);
      });
    },{passive:true});
  }
  document.querySelectorAll<HTMLButtonElement>(DRAG_SELECTOR).forEach(applyPosition);
}
