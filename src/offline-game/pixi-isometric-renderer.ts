import type { Application, Graphics } from "pixi.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const states = new WeakMap<HTMLElement, PixiMountState>();
const activeBoards = new Set<HTMLElement>();

type PixiMountState = {
  board: HTMLElement;
  scene: SVGSVGElement;
  cancelled: boolean;
  app?: Application;
  initialized: boolean;
  canvas?: HTMLCanvasElement;
  sceneryOverlay?: SVGSVGElement;
};

function safeDestroy(app: Application): void {
  try {
    app.stop();
    app.destroy(
      { removeView: true, releaseGlobalResources: true },
      { children: true, texture: true, textureSource: true },
    );
  } catch {
    try { app.canvas.remove(); } catch { /* Renderer may not have completed initialization. */ }
  }
}

/** Parses an SVG polygon points attribute into PixiJS' flat [x,y,...] format. */
export function parsePixiPolygonPoints(value: string): number[] {
  const parts = value.trim().split(/[\s,]+/).filter(Boolean);
  if (parts.length < 6 || parts.length % 2 !== 0) return [];
  const points = parts.map(Number);
  return points.every(Number.isFinite) ? points : [];
}

function parseOpacity(value: string | null): number {
  if (value === null || value.trim() === "") return 1;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed)) : 1;
}

function parseHexColor(value: string | null): number | null {
  if (!value || value === "none" || value === "transparent") return null;
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return null;
  const raw = match[1];
  return Number.parseInt(raw.length === 3 ? raw.split("").map(char => char + char).join("") : raw, 16);
}

function buildGroundGraphics(polygons: SVGPolygonElement[], GraphicsClass: typeof Graphics): Graphics | null {
  const graphics = new Graphics();
  let drawn = 0;
  for (const polygon of polygons) {
    const points = parsePixiPolygonPoints(polygon.getAttribute("points") || "");
    if (!points.length) continue;

    const fillColor = parseHexColor(polygon.getAttribute("fill"));
    const fillAlpha = parseOpacity(polygon.getAttribute("fill-opacity"));
    const strokeColor = parseHexColor(polygon.getAttribute("stroke"));
    const strokeAlpha = parseOpacity(polygon.getAttribute("stroke-opacity"));
    const strokeWidth = Number(polygon.getAttribute("stroke-width") || 1);

    if (fillColor !== null && fillAlpha > 0) {
      graphics.poly(points, true).fill({ color: fillColor, alpha: fillAlpha });
    }
    if (strokeColor !== null && strokeAlpha > 0 && Number.isFinite(strokeWidth) && strokeWidth > 0) {
      graphics.poly(points, true).stroke({ color: strokeColor, alpha: strokeAlpha, width: strokeWidth });
    }
    drawn++;
  }
  return drawn ? graphics : null;
}

function dimensions(scene: SVGSVGElement): { width: number; height: number } | null {
  const viewBox = scene.viewBox?.baseVal;
  const width = viewBox?.width || Number(scene.getAttribute("width"));
  const height = viewBox?.height || Number(scene.getAttribute("height"));
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
  return { width, height };
}

function makeSceneryOverlay(scene: SVGSVGElement, width: number, height: number): SVGSVGElement | null {
  const scenery = scene.querySelector<SVGGElement>("g.wmh-vector-scenery");
  if (!scenery) return null;
  const viewBox = scene.getAttribute("viewBox") || ("0 0 " + width + " " + height);
  const overlay = document.createElementNS(SVG_NS, "svg");
  overlay.setAttribute("class", "wmh-pixi-scenery-overlay");
  overlay.setAttribute("viewBox", viewBox);
  overlay.setAttribute("width", String(width));
  overlay.setAttribute("height", String(height));
  overlay.setAttribute("preserveAspectRatio", "none");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.position = "absolute";
  overlay.style.left = "0";
  overlay.style.top = "0";
  overlay.style.width = width + "px";
  overlay.style.height = height + "px";
  overlay.style.zIndex = "2";
  overlay.style.pointerEvents = "none";
  overlay.append(scenery.cloneNode(true));
  return overlay;
}

function releaseState(state: PixiMountState): void {
  state.cancelled = true;
  if (state.app && state.initialized) safeDestroy(state.app);
  state.canvas?.remove();
  state.sceneryOverlay?.remove();
  state.board.classList.remove("wmh-pixi-ground-ready");
  if (states.get(state.board) === state) states.delete(state.board);
  activeBoards.delete(state.board);
}

/**
 * Mounts a static PixiJS ground renderer over a normal SVG isometric board.
 * It deliberately does not mount on the image-first Academy surface.
 */
export async function mountPixiIsometricGround(board: HTMLElement): Promise<boolean> {
  if (!board.isConnected || !board.querySelector("[data-wmh-scene-svg]")) return false;
  if (states.has(board)) return false;

  const scene = board.querySelector<SVGSVGElement>("[data-wmh-scene-svg]");
  const tileGroup = scene?.querySelector<SVGGElement>("g[data-wmh-tile-grid]");
  const polygons = tileGroup ? Array.from(tileGroup.querySelectorAll<SVGPolygonElement>("polygon[data-wmh-tile]")) : [];
  const size = scene ? dimensions(scene) : null;
  if (!scene || !tileGroup || !polygons.length || !size) return false;

  const state: PixiMountState = { board, scene, cancelled: false, initialized: false };
  states.set(board, state);
  activeBoards.add(board);

  try {
    // Keep Pixi out of app startup and the menu bundle's initial execution path.
    const pixi = await import("pixi.js");
    if (state.cancelled || states.get(board) !== state || !board.isConnected || !scene.isConnected) return false;

    const app = new pixi.Application();
    state.app = app;
    await app.init({
      width: size.width,
      height: size.height,
      backgroundAlpha: 0,
      antialias: false,
      autoDensity: false,
      resolution: 1,
      powerPreference: "low-power",
      preference: ["webgl", "canvas"],
      autoStart: false,
      sharedTicker: false,
      eventFeatures: { move: false, click: false, wheel: false, globalMove: false },
    });
    state.initialized = true;

    if (state.cancelled || states.get(board) !== state || !board.isConnected || !scene.isConnected) {
      safeDestroy(app);
      return false;
    }

    app.stop();
    app.stage.eventMode = "none";
    app.stage.interactiveChildren = false;

    const ground = buildGroundGraphics(polygons, pixi.Graphics);
    if (!ground) {
      safeDestroy(app);
      releaseState(state);
      return false;
    }
    ground.eventMode = "none";
    app.stage.addChild(ground);

    const canvas = app.canvas;
    canvas.className = "wmh-pixi-ground-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.tabIndex = -1;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.width = size.width + "px";
    canvas.style.height = size.height + "px";
    canvas.style.zIndex = "1";
    canvas.style.pointerEvents = "none";
    canvas.style.touchAction = "none";

    const sceneryOverlay = makeSceneryOverlay(scene, size.width, size.height);
    state.canvas = canvas;
    state.sceneryOverlay = sceneryOverlay || undefined;

    // Canvas hit testing is disabled. Existing transparent SVG polygons and
    // actor buttons remain the sole source of gameplay/menu pointer events.
    board.append(canvas);
    if (sceneryOverlay) board.append(sceneryOverlay);
    scene.style.position = "absolute";
    scene.style.left = "0";
    scene.style.top = "0";
    scene.style.width = size.width + "px";
    scene.style.height = size.height + "px";
    scene.style.zIndex = "0";
    board.classList.add("wmh-pixi-ground-ready");
    app.render();
    return true;
  } catch {
    // A renderer/context failure must leave the existing SVG map fully usable.
    releaseState(state);
    return false;
  }
}

/** Rebuilds a mounted Pixi ground after the existing map editor replaces its SVG. */
export async function refreshPixiIsometricGround(board: HTMLElement): Promise<boolean> {
  const wasMounted = states.has(board);
  if (!wasMounted) return false;
  disposePixiIsometricGround(board);
  return mountPixiIsometricGround(board);
}

export function disposePixiIsometricGround(root: ParentNode): void {
  const boards = new Set<HTMLElement>();
  if (root instanceof HTMLElement && root.matches("[data-wmh-board]")) boards.add(root);
  root.querySelectorAll<HTMLElement>("[data-wmh-board]").forEach(board => boards.add(board));
  for (const board of boards) {
    const state = states.get(board);
    if (state) releaseState(state);
  }
}

/** Called before app-level innerHTML replacement so no GPU surface survives navigation. */
export function disposeWorldMapHierarchy(root: ParentNode): void {
  disposePixiIsometricGround(root);
}
