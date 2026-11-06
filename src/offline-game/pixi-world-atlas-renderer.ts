import * as PIXI from "pixi.js";
import { EventSystem, AccessibilitySystem } from "pixi.js";

/*
 * IMPORTANT ANDROID INPUT BOUNDARY:
 * PixiJS v8's EventSystem installs pointer listeners on document in capture
 * phase. This renderer must never own input, hit testing, or accessibility.
 * Remove both extensions before creating any Renderer/Application instance.
 * All tap/drag/pinch, NPC and editor input remains in the existing DOM layer.
 */
PIXI.extensions.remove(EventSystem, AccessibilitySystem);

import { projectIsoActorPosition, type ProjectedPoint } from "./pixi-world-atlas-projection";
export { projectIsoActorPosition };

type PixiActor={
  id:string;
  element:HTMLElement;
  visual:PIXI.Container;
  body:PIXI.Graphics;
  proximity:PIXI.Graphics;
  rings:[PIXI.Graphics,PIXI.Graphics];
  current:ProjectedPoint;
  from:ProjectedPoint;
  target:ProjectedPoint;
  motionStarted:number;
  motionUntil:number;
  tone:string;
  interactionReady:boolean;
  pulseStarted:number;
  depth:number;
};

type TextureAsset={texture:PIXI.Texture;release:()=>void};

const MOVE_DURATION=225;
const SCAN_DURATION=1800;
const SCAN_INTERVAL=2450;

function numberValue(value:string|undefined,fallback:number):number {
  const parsed=Number(value);
  return Number.isFinite(parsed)?parsed:fallback;
}
function readCssNumber(style:CSSStyleDeclaration,name:string,fallback:number):number {
  const parsed=Number.parseFloat(style.getPropertyValue(name));
  return Number.isFinite(parsed)?parsed:fallback;
}
function boardGrid(board:HTMLElement):{cols:number;rows:number;tileW:number;tileH:number;offsetX:number;offsetY:number} {
  const style=getComputedStyle(board);
  return {
    cols:numberValue(board.dataset.cols,24),
    rows:numberValue(board.dataset.rows,20),
    tileW:numberValue(board.dataset.tileW,readCssNumber(style,"--tile-w",64)),
    tileH:numberValue(board.dataset.tileH,readCssNumber(style,"--tile-h",32)),
    offsetX:numberValue(board.dataset.offsetX,0),
    offsetY:numberValue(board.dataset.offsetY,0)
  };
}

/** DOM adapter; CSS and the map JSON remain the source of screen projection. */
export function projectPixiActorPosition(
  board:HTMLElement,
  actor:{x:number;y:number},
  grid=boardGrid(board)
):ProjectedPoint {
  const image=board.querySelector<HTMLImageElement>("[data-wmh-map-art]");
  const style=getComputedStyle(board);
  if(board.dataset.academyArtworkBoard==="true"&&image?.naturalWidth&&image.naturalHeight){
    return projectIsoActorPosition(actor,grid,{
      halfW:grid.tileW/2,
      halfH:grid.tileH/2,
      centerX:grid.rows*(grid.tileW/2)+grid.offsetX,
      offsetY:grid.offsetY,
      imageScaleX:(image.clientWidth||image.naturalWidth)/image.naturalWidth,
      imageScaleY:(image.clientHeight||image.naturalHeight)/image.naturalHeight
    });
  }
  const halfW=readCssNumber(style,"--iso-half-w",grid.tileW/2);
  const halfH=readCssNumber(style,"--iso-half-h",grid.tileH/2);
  const isoCenterX=readCssNumber(style,"--iso-center-x",grid.rows*halfW+grid.offsetX);
  const offsetY=readCssNumber(style,"--iso-offset-y",grid.offsetY);
  return projectIsoActorPosition(actor,grid,{halfW,halfH,centerX:isoCenterX,offsetY});
}

function loadSvgTexture(svg:SVGSVGElement):Promise<TextureAsset> {
  return new Promise((resolve,reject)=>{
    const clone=svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns","http://www.w3.org/2000/svg");
    const xml=new XMLSerializer().serializeToString(clone);
    const url=URL.createObjectURL(new Blob([xml],{type:"image/svg+xml;charset=utf-8"}));
    const image=new Image();
    image.decoding="async";
    const releaseUrl=()=>URL.revokeObjectURL(url);
    image.onload=()=>{
      try{
        const texture=PIXI.Texture.from(image);
        releaseUrl();
        resolve({texture,release:()=>{try{texture.destroy(true);}catch{/* Already released. */}image.src="";}});
      }catch(error){releaseUrl();reject(error);}
    };
    image.onerror=()=>{releaseUrl();reject(new Error("Could not rasterize the current World Atlas SVG map."));};
    image.src=url;
  });
}

async function ensureImageReady(image:HTMLImageElement):Promise<boolean> {
  if(image.complete)return image.naturalWidth>0&&image.naturalHeight>0;
  if(typeof image.decode==="function"){
    try{await image.decode();}catch{/* Fall through to the native load/error events. */}
    if(image.naturalWidth>0&&image.naturalHeight>0)return true;
    if(image.complete)return false;
  }
  return new Promise(resolve=>{
    let settled=false;
    const finish=(ready:boolean)=>{
      if(settled)return;
      settled=true;
      image.removeEventListener("load",onLoad);
      image.removeEventListener("error",onError);
      resolve(ready);
    };
    const onLoad=()=>finish(image.naturalWidth>0&&image.naturalHeight>0);
    const onError=()=>finish(false);
    image.addEventListener("load",onLoad,{once:true});
    image.addEventListener("error",onError,{once:true});
    if(image.complete)finish(image.naturalWidth>0&&image.naturalHeight>0);
  });
}

function loadImageTexture(image:HTMLImageElement):TextureAsset {
  const texture=PIXI.Texture.from(image);
  return {texture,release:()=>{try{texture.destroy(false);}catch{/* Texture may already be released. */}}};
}

function loadCanvasTexture(canvas:HTMLCanvasElement):TextureAsset {
  const texture=PIXI.Texture.from(canvas);
  return {texture,release:()=>{try{texture.destroy(false);}catch{/* Texture may already be released. */}}};
}

function toneColor(tone:string):number {
  if(tone==="friendly")return 0x55baff;
  if(tone==="hostile")return 0xed5353;
  if(tone==="spirit-expert")return 0x101215;
  return 0xf5f6f7;
}
function actorBorder(tone:string):number {
  return tone==="friendly"?0xa8e4ff:tone==="hostile"?0xffc4b8:tone==="spirit-expert"?0x858b93:0xf3e2c0;
}

function makeActorVisual(actor:HTMLElement):{visual:PIXI.Container;body:PIXI.Graphics;proximity:PIXI.Graphics;rings:[PIXI.Graphics,PIXI.Graphics]} {
  const visual=new PIXI.Container();
  visual.eventMode="none";
  const body=new PIXI.Graphics();
  const proximity=new PIXI.Graphics();
  proximity.visible=false;
  const firstRing=new PIXI.Graphics();
  const secondRing=new PIXI.Graphics();
  drawScannerRings([firstRing,secondRing],actor.dataset.scanTone||"unknown");
  firstRing.visible=false;
  secondRing.visible=false;
  firstRing.alpha=0;
  secondRing.alpha=0;
  body.eventMode="none";
  proximity.eventMode="none";
  firstRing.eventMode="none";
  secondRing.eventMode="none";
  visual.addChild(proximity,firstRing,secondRing,body);
  drawActorBody(body,actor.dataset.scanTone||"unknown",actor.matches("[data-wmh-player-token]"));
  return {visual,body,proximity,rings:[firstRing,secondRing]};
}

function drawActorBody(graphics:PIXI.Graphics,tone:string,isPlayer:boolean):void {
  graphics.clear();
  const border=actorBorder(tone);
  const fill=isPlayer?0x9c7c49:tone==="friendly"?0x315f74:tone==="hostile"?0x7d3637:tone==="spirit-expert"?0x24282a:0x303933;
  graphics.circle(0,0,14).fill({color:fill});
  graphics.circle(0,0,14).stroke({color:border,width:2.2});
  graphics.circle(0,-3,5).fill({color:0xd9c39d});
  graphics.circle(-1,-4,5).stroke({color:0x28241f,width:1.2});
  graphics.roundRect(-7,3,14,9,4).fill({color:isPlayer?0xe8c98f:tone==="friendly"?0x8db5c6:0x68675d});
  graphics.circle(5,-5,1.2).fill({color:0x181917});
  graphics.circle(-2,-5,1.2).fill({color:0x181917});
}

function drawScannerRings(rings:[PIXI.Graphics,PIXI.Graphics],tone:string):void {
  const color=toneColor(tone);
  rings[0].clear();
  rings[0].circle(0,0,42).stroke({color,width:1.45,alpha:.8});
  rings[1].clear();
  rings[1].circle(0,0,52).stroke({color,width:1,alpha:.72});
}

function actorId(element:HTMLElement):string {
  return element.dataset.wmhNpc||"player";
}
function actorGridPosition(element:HTMLElement):{x:number;y:number} {
  return {
    x:numberValue(element.dataset.posX,numberValue(element.dataset.x,0)),
    y:numberValue(element.dataset.posY,numberValue(element.dataset.y,0))
  };
}
function isPaused(board:HTMLElement):boolean {
  const dialog=board.closest<HTMLElement>("[data-wmh-dialog]");
  const chat=dialog?.querySelector<HTMLElement>("[data-wmh-chat]");
  const gate=board.closest<HTMLElement>("[data-idle-rpg-modal]")?.querySelector<HTMLElement>("[data-world-atlas-gate]");
  return document.hidden||board.dataset.editorPaused==="true"||board.classList.contains("wmh-overlay-editing")||chat?.hidden===false||gate?.hidden===false;
}

function renderActorProximity(actor:PixiActor):void {
  actor.proximity.clear();
  if(!actor.interactionReady||actor.element.matches("[data-wmh-player-token]")){
    actor.proximity.visible=false;
    return;
  }
  const color=toneColor(actor.tone);
  actor.proximity.circle(0,0,22).fill({color,alpha:.09});
  actor.proximity.circle(0,0,18).stroke({color,width:1.2,alpha:.65});
  actor.proximity.visible=true;
}

function positionCanvas(canvas:HTMLCanvasElement,board:HTMLElement):void {
  canvas.className="wmh-pixi-world-canvas";
  canvas.setAttribute("aria-hidden","true");
  canvas.tabIndex=-1;
  canvas.style.position="absolute";
  canvas.style.inset="0";
  canvas.style.width="100%";
  canvas.style.height="100%";
  canvas.style.pointerEvents="none";
  canvas.style.background="transparent";
  canvas.style.zIndex="300";
  board.append(canvas);
}

function releaseApplication(app:PIXI.Application|null):void {
  if(!app)return;
  try{app.ticker.stop();}catch{/* Renderer may be partially initialized. */}
  try{app.destroy({removeView:true},{children:true,texture:false,textureSource:false});}catch{/* WebView may have reclaimed its graphics context. */}
}

function mountPixiBoard(board:HTMLElement,modal:HTMLElement,onFailure:()=>void):()=>void {
  let disposed=false;
  let app:PIXI.Application|null=null;
  let canvas:HTMLCanvasElement|null=null;
  let worldLayer:PIXI.Container|null=null;
  let actorLayer:PIXI.Container|null=null;
  let foregroundLayer:PIXI.Container|null=null;
  let actors=new Map<string,PixiActor>();
  let textures:TextureAsset[]=[];
  let frameId=0;
  let pulseTimer=0;
  let resizeObserver:ResizeObserver|null=null;
  let actorObserver:MutationObserver|null=null;

  const cleanup=()=>{
    disposed=true;
    if(frameId)cancelAnimationFrame(frameId);
    if(pulseTimer)window.clearInterval(pulseTimer);
    resizeObserver?.disconnect();
    actorObserver?.disconnect();
      board.classList.remove("wmh-pixi-render-active","wmh-pixi-render-paused");
    delete modal.dataset.pixiRendererStatus;
    actors.clear();
    textures.forEach(asset=>asset.release());
    textures=[];
    releaseApplication(app);
    app=null;
    canvas=null;
    worldLayer=null;
    actorLayer=null;
    foregroundLayer=null;
  };

  const boardWidth=()=>Math.max(1,board.offsetWidth||numberValue(board.dataset.boardWidth,704));
  const boardHeight=()=>Math.max(1,board.offsetHeight||numberValue(board.dataset.boardHeight,368));

  const addSprite=(texture:PIXI.Texture,width:number,height:number,x=0,y=0)=>{
    if(!worldLayer)return;
    const sprite=new PIXI.Sprite(texture);
    sprite.x=x;sprite.y=y;sprite.width=width;sprite.height=height;
    sprite.eventMode="none";
    worldLayer.addChild(sprite);
  };

  const buildStaticWorld=async()=>{
    if(!app||!worldLayer)return;
    const image=board.querySelector<HTMLImageElement>("[data-wmh-map-art]");
    const scene=board.querySelector<SVGSVGElement>("[data-wmh-scene-svg]");
    const overlay=board.querySelector<SVGSVGElement>("[data-wmh-overlay-svg]");
    const foreground=board.querySelector<HTMLCanvasElement>("[data-wmh-foreground-canvas]");
    const width=boardWidth(),height=boardHeight();
    // Large authored map artwork stays in its native DOM image layer. Uploading
    // the full Academy JPG again as a GPU texture is unnecessary and fragile on
    // low-end Android WebViews; Pixi remains responsible for the visual overlays
    // and actor/effect layers above it.
    const keepMapArtworkInDom=board.classList.contains("has-map-base");

    if(image&&!keepMapArtworkInDom){
      const imageReady=await ensureImageReady(image);
      if(disposed||!app||!worldLayer)return;
      if(!imageReady)throw new Error("World Atlas map artwork was not ready for the Pixi renderer.");
      const asset=loadImageTexture(image);textures.push(asset);
      addSprite(asset.texture,image.clientWidth||image.naturalWidth,image.clientHeight||image.naturalHeight,image.offsetLeft,image.offsetTop);
    }
    if(scene&&!keepMapArtworkInDom){
      const asset=await loadSvgTexture(scene);
      if(disposed||!app||!worldLayer){asset.release();return;}
      textures.push(asset);
      addSprite(asset.texture,width,height);
    }
    if(foreground&&foreground.width>0&&foreground.height>0&&foregroundLayer&&!keepMapArtworkInDom){
      const asset=loadCanvasTexture(foreground);textures.push(asset);
      const sprite=new PIXI.Sprite(asset.texture);
      sprite.x=numberValue(foreground.style.left,0);
      sprite.y=numberValue(foreground.style.top,0);
      sprite.width=numberValue(foreground.style.width,foreground.width);
      sprite.height=numberValue(foreground.style.height,foreground.height);
      sprite.eventMode="none";
      foregroundLayer.addChild(sprite);
    }
    if(overlay&&foregroundLayer&&!keepMapArtworkInDom){
      const asset=await loadSvgTexture(overlay);
      if(disposed||!app||!foregroundLayer){asset.release();return;}
      textures.push(asset);
      const sprite=new PIXI.Sprite(asset.texture);
      sprite.width=width;sprite.height=height;sprite.eventMode="none";
      foregroundLayer.addChild(sprite);
    }
  };

  let staticRefreshSequence=0;
  const refreshStaticWorld=async():Promise<void>=>{
    if(disposed||!app||!worldLayer||!foregroundLayer||isPaused(board))return;
    const refreshId=++staticRefreshSequence;
    worldLayer.removeChildren().forEach(child=>child.destroy({children:true}));
    foregroundLayer.removeChildren().forEach(child=>child.destroy({children:true}));
    textures.forEach(asset=>asset.release());
    textures=[];
    await buildStaticWorld();
    if(disposed||refreshId!==staticRefreshSequence||!app||isPaused(board))return;
    syncActors(false);
    app.renderer.render({container:app.stage});
  };

  const syncActors=(animateChanges:boolean)=>{
    if(!actorLayer||!app)return;
    const elements=Array.from(board.querySelectorAll<HTMLElement>("[data-wmh-player-token],[data-wmh-npc]"));
    const present=new Set<string>();
    const grid=boardGrid(board);
    for(const element of elements){
      const id=actorId(element);present.add(id);
      const raw=actorGridPosition(element);
      const projected=projectPixiActorPosition(board,raw,grid);
      let actor=actors.get(id);
      const tone=element.dataset.scanTone||"unknown";
      const ready=element.dataset.interactionReady==="true";
      if(!actor){
        const graphics=makeActorVisual(element);
        actor={
          id,element,visual:graphics.visual,body:graphics.body,proximity:graphics.proximity,rings:graphics.rings,
          current:projected,from:projected,target:projected,motionStarted:0,motionUntil:0,
          tone,interactionReady:ready,pulseStarted:-Infinity,depth:20+raw.x+raw.y
        };
        actorLayer.addChild(actor.visual);
        actors.set(id,actor);
      }else{
        const moved=Math.abs(actor.target.x-projected.x)>.1||Math.abs(actor.target.y-projected.y)>.1;
        if(moved&&animateChanges){
          actor.from={...actor.current};
          actor.target=projected;
          actor.motionStarted=performance.now();
          actor.motionUntil=actor.motionStarted+MOVE_DURATION;
        }else if(moved){
          actor.current=projected;actor.from=projected;actor.target=projected;
          actor.visual.position.set(projected.x,projected.y);
        }
        if(actor.tone!==tone){
          actor.tone=tone;
          drawActorBody(actor.body,tone,element.matches("[data-wmh-player-token]"));
          drawScannerRings(actor.rings,tone);
          renderActorProximity(actor);
        }
        if(actor.interactionReady!==ready){
          actor.interactionReady=ready;
          renderActorProximity(actor);
        }
        actor.depth=20+raw.x+raw.y;
      }
      actor.visual.zIndex=actor.depth;
      if(!actor.motionUntil)actor.visual.position.set(actor.current.x,actor.current.y);
    }
    for(const [id,actor] of actors){
      if(present.has(id))continue;
      actorLayer.removeChild(actor.visual);
      actor.visual.destroy({children:true});
      actors.delete(id);
    }
  };

  const anyMotion=()=>Array.from(actors.values()).some(actor=>actor.motionUntil>performance.now());
  const hasActivePulse=()=>{
    const now=performance.now();
    return Array.from(actors.values()).some(actor=>actor.pulseStarted!==-Infinity&&now<actor.pulseStarted+SCAN_DURATION+885);
  };

  const renderFrame=(time:number)=>{
    frameId=0;
    if(disposed||!app||!canvas)return;
    if(isPaused(board)){
      setPaused(true);
      return;
    }
    setPaused(false);
    let moving=false;
    for(const actor of actors.values()){
      if(actor.motionUntil>time){
        const linear=Math.max(0,Math.min(1,(time-actor.motionStarted)/MOVE_DURATION));
        const eased=1-Math.pow(1-linear,3);
        actor.current={
          x:actor.from.x+(actor.target.x-actor.from.x)*eased,
          y:actor.from.y+(actor.target.y-actor.from.y)*eased
        };
        actor.visual.position.set(actor.current.x,actor.current.y);
        moving=true;
      }else if(actor.motionUntil){
        actor.current={...actor.target};
        actor.visual.position.set(actor.current.x,actor.current.y);
        actor.motionUntil=0;
      }
      for(let index=0;index<actor.rings.length;index++){
        const ring=actor.rings[index];
        const delay=index*820;
        const elapsed=time-(actor.pulseStarted+delay);
        if(elapsed<0||elapsed>SCAN_DURATION){
          ring.visible=false;ring.alpha=0;continue;
        }
        const progress=Math.max(0,Math.min(1,elapsed/SCAN_DURATION));
        ring.scale.set(.08+.92*progress);
        ring.alpha=.44*(1-progress);
        ring.visible=true;
      }
    }
    app.renderer.render({container:app.stage});
    if(moving||hasActivePulse())requestFrame();
  };

  const requestFrame=()=>{
    if(disposed||frameId||document.hidden||!app)return;
    if(isPaused(board)){setPaused(true);return;}
    setPaused(false);
    frameId=requestAnimationFrame(renderFrame);
  };

  const setPaused=(paused:boolean)=>{
    if(!canvas)return;
    const wasPaused=canvas.hidden;
    canvas.hidden=paused;
    board.classList.toggle("wmh-pixi-render-paused",paused);
    if(paused){
      if(frameId){cancelAnimationFrame(frameId);frameId=0;}
      if(pulseTimer){window.clearInterval(pulseTimer);pulseTimer=0;}
    }else{
      if(!pulseTimer)pulseTimer=window.setInterval(triggerScanPulse,SCAN_INTERVAL);
      if(wasPaused&&app)app.renderer.render({container:app.stage});
    }
  };

  const triggerScanPulse=()=>{
    if(disposed||!app||isPaused(board))return;
    const now=performance.now();
    let index=0;
    for(const actor of actors.values()){
      actor.pulseStarted=now+index*65;
      index++;
    }
    requestFrame();
  };

  void (async()=>{
    try{
      app=new PIXI.Application();
      await app.init({
        width:boardWidth(),height:boardHeight(),backgroundAlpha:0,backgroundColor:0x000000,
        antialias:false,autoDensity:true,
        // Keep the low-end Android GPU buffer at CSS-pixel size; textures retain source detail.
        resolution:1,
        powerPreference:"low-power",preference:["webgl","canvas"],
        autoStart:false,sharedTicker:false
      });
      if(disposed||!board.isConnected){releaseApplication(app);app=null;return;}
      canvas=app.canvas;
      positionCanvas(canvas,board);
      app.stage.eventMode="none";
      app.stage.sortableChildren=true;
      worldLayer=new PIXI.Container();worldLayer.eventMode="none";
      actorLayer=new PIXI.Container();actorLayer.eventMode="none";actorLayer.sortableChildren=true;
      foregroundLayer=new PIXI.Container();foregroundLayer.eventMode="none";
      app.stage.addChild(worldLayer,actorLayer,foregroundLayer);
      await buildStaticWorld();
      if(disposed||!board.isConnected)return;
      board.classList.add("wmh-pixi-render-active");
      board.classList.remove("wmh-pixi-render-paused");
      modal.dataset.pixiRendererStatus="active";
      syncActors(false);
      app.renderer.render({container:app.stage});
      triggerScanPulse();
      pulseTimer=window.setInterval(triggerScanPulse,SCAN_INTERVAL);
      let editorWasActive=board.classList.contains("wmh-overlay-editing");
      actorObserver=new MutationObserver(records=>{
        const actorChanged=records.some(record=>
          record.target instanceof HTMLElement&&
          record.target.matches("[data-wmh-player-token],[data-wmh-npc]")&&
          record.attributeName!=="class"
        );
        if(actorChanged)syncActors(true);
        const modeChanged=records.some(record=>
          record.target instanceof HTMLElement&&
          record.target.matches("[data-wmh-chat],[data-world-atlas-gate]")&&
          record.attributeName==="hidden"
        );
        const editorNow=board.classList.contains("wmh-overlay-editing");
        const editorChanged=editorNow!==editorWasActive;
        editorWasActive=editorNow;
        if(editorChanged&&editorNow){
          setPaused(true);
        }else if(editorChanged&&!editorNow){
          setPaused(true);
          void refreshStaticWorld().then(()=>{
            if(disposed)return;
            setPaused(isPaused(board));
            requestFrame();
          }).catch(()=>{
            if(disposed)return;
            cleanup();
            onFailure();
          });
        }else if(modeChanged){
          setPaused(isPaused(board));
        }
        if(actorChanged||modeChanged)requestFrame();
      });
      actorObserver.observe(board,{subtree:true,attributes:true,attributeFilter:["data-x","data-y","data-pos-x","data-pos-y","data-scan-tone","data-interaction-ready","class"]});
      actorObserver.observe(modal,{subtree:true,attributes:true,attributeFilter:["hidden"]});
      setPaused(isPaused(board));
      resizeObserver=new ResizeObserver(()=>{
        if(!app||disposed)return;
        const width=boardWidth(),height=boardHeight();
        app.renderer.resize(width,height);
        if(!isPaused(board))app.renderer.render({container:app.stage});
      });
      resizeObserver.observe(board);
      document.addEventListener("visibilitychange",onVisibility);
    }catch{
      cleanup();
      onFailure();
    }
  })();

  function onVisibility(){
    setPaused(document.hidden||isPaused(board));
    if(!document.hidden&&!isPaused(board)){
      if(anyMotion()||hasActivePulse())requestFrame();
      else if(app)app.renderer.render({container:app.stage});
    }
  }

  return ()=>{
    document.removeEventListener("visibilitychange",onVisibility);
    cleanup();
  };
}

export function mountPixiWorldAtlas(modal:HTMLElement):()=>void {
  let disposed=false;
  let currentBoard:HTMLElement|null=null;
  let cleanupCurrent:(()=>void)|null=null;
  let mountVersion=0;
  let syncFrame=0;
  let observer:MutationObserver|null=null;

  const releaseCurrent=()=>{
    mountVersion++;
    cleanupCurrent?.();
    cleanupCurrent=null;
    currentBoard=null;
  };

  const attachBoard=(board:HTMLElement)=>{
    releaseCurrent();
    currentBoard=board;
    const version=mountVersion;
    cleanupCurrent=mountPixiBoard(board,modal,()=>{
      if(!disposed&&version===mountVersion)modal.dataset.pixiRendererStatus="dom-fallback";
    });
  };

  const synchronize=()=>{
    syncFrame=0;
    if(disposed||modal.hidden)return;
    const board=modal.querySelector<HTMLElement>("[data-wmh-board]");
    if(board!==currentBoard){
      if(currentBoard)releaseCurrent();
      if(board)attachBoard(board);
      return;
    }
    if(board&&board.classList.contains("wmh-overlay-editing"))return;
  };

  const schedule=()=>{
    if(disposed||syncFrame)return;
    syncFrame=requestAnimationFrame(synchronize);
  };

  observer=new MutationObserver(schedule);
  observer.observe(modal,{subtree:true,childList:true});
  synchronize();

  return ()=>{
    disposed=true;
    if(syncFrame)cancelAnimationFrame(syncFrame);
    observer?.disconnect();
    releaseCurrent();
    delete modal.dataset.pixiRendererStatus;
  };
}
