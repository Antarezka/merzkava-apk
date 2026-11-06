import type { IsoMapGridConfig, IsoMapPoint } from "./isometric-map-editor";

/**
 * Return the pre-move translation needed to animate an actor from its old
 * isometric position to its new one after layout coordinates have been updated.
 * The calculation uses the map projection directly, avoiding a post-write
 * getBoundingClientRect() read that can force synchronous layout.
 */
export function getIsoMovementOffset(
  from: IsoMapPoint,
  to: IsoMapPoint,
  grid: IsoMapGridConfig,
  cameraZoom = 1,
  renderScaleX = 1,
  renderScaleY = 1,
): IsoMapPoint {
  const zoom = Number.isFinite(cameraZoom) && cameraZoom > 0 ? cameraZoom : 1;
  const scaleX = Number.isFinite(renderScaleX) && renderScaleX > 0 ? renderScaleX : 1;
  const scaleY = Number.isFinite(renderScaleY) && renderScaleY > 0 ? renderScaleY : 1;
  const deltaX = from.x - to.x;
  const deltaY = from.y - to.y;
  return {
    x: (deltaX - deltaY) * (grid.tileW / 2) * scaleX / zoom,
    y: (deltaX + deltaY) * (grid.tileH / 2) * scaleY / zoom,
  };
}

/**
 * Run a browser-native Web Animation. WAAPI lets the browser schedule
 * transform/opacity effects independently of the application animation loop.
 * A missing/failed API returns null so callers can snap to the safe final state.
 */
export function startNativeMotion(
  element: Element,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
): Animation | null {
  if (typeof element.animate !== "function") return null;
  try {
    return element.animate(keyframes, options);
  } catch {
    return null;
  }
}
