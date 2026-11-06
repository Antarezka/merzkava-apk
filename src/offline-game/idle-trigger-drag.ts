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
const PIXI_POSITION_KEY = "merzkava.eternal-path.floating-pixi-tv-position.v1";
const DRAG_THRESHOLD = 5;
const EDGE_GAP = 8;
const savedPositions = new Map<string, {x:number;y:number}|null>();
let drag: IdleDragState | null = null;
let installed = false;
let suppressedButton: HTMLButtonElement | null = null;

function positionKey(button:HTMLButtonElement):string {
  return button.dataset.dragPositionKey || (button.classList.contains("expedition-pixi-trigger")?PIXI_POSITION_KEY:LEGACY_POSITION_KEY);
}

function readPosition(key:string):{x:number;y:number}|null {
  try {
    const raw=window.localStorage.getItem(key);
    if(!raw)return null;
    const value=JSON.parse(raw) as {x?:unknown;y?:unknown};
    return typeof value.x==="number"&&Number.isFinite(value.x)
      &&typeof value.y==="number"&&Number.isFinite(value.y)
      ?{x:value.x,y:value.y}:null;
  }catch{return null;}
}

function getSavedPosition(key:string):{x:number;y:number}|null {
  if(!savedPositions.has(key))savedPositions.set(key,readPosition(key));
  return savedPositions.get(key)??null;
}

function persistPosition(key:string,point:{x:number;y:number}):void {
  savedPositions.set(key,point);
  try{window.localStorage.setItem(key,JSON.stringify(point));}
  catch{/* Storage failure must never disable dragging. */}
}

function clampPosition(x:number,y:number,button:HTMLElement):{x:number;y:number} {
  const width=button.offsetWidth||56,height=button.offsetHeight||56;
  const maxX=Math.max(EDGE_GAP,window.innerWidth-width-EDGE_GAP);
  const maxY=Math.max(EDGE_GAP,window.innerHeight-height-EDGE_GAP);
  return {x:Math.max(EDGE_GAP,Math.min(x,maxX)),y:Math.max(EDGE_GAP,Math.min(y,maxY))};
}

function applyPosition(button:HTMLButtonElement):void {
  const key=positionKey(button),saved=getSavedPosition(key);
  if(!saved)return;
  const point=clampPosition(saved.x,saved.y,button);
  savedPositions.set(key,point);
  button.style.left=point.x+"px";
  button.style.top=point.y+"px";
  button.style.right="auto";
  button.style.bottom="auto";
}

function finishDrag(event:PointerEvent):void {
  const active=drag;
  if(!active||event.pointerId!==active.pointerId)return;
  if(active.moved){
    suppressedButton=active.button;
    persistPosition(active.positionKey,{
      x:Number.parseFloat(active.button.style.left)||active.originX,
      y:Number.parseFloat(active.button.style.top)||active.originY
    });
    window.setTimeout(()=>{if(suppressedButton===active.button)suppressedButton=null;},450);
  }
  active.button.classList.remove("is-dragging");
  try{
    if(active.button.hasPointerCapture(event.pointerId))active.button.releasePointerCapture(event.pointerId);
  }catch{/* Pointer capture may already be released after pointercancel. */}
  drag=null;
}

const FLOATING_TRIGGER_SELECTOR=".expedition-page .expedition-idle-trigger,.expedition-page .expedition-pixi-trigger";

export function initializeIdleTriggerDrag():void {
  if(!installed){
    installed=true;
    document.addEventListener("pointerdown",event=>{
      const target=event.target as Element|null;
      const button=target?.closest<HTMLButtonElement>(FLOATING_TRIGGER_SELECTOR);
      if(!button||!event.isPrimary||(event.pointerType==="mouse"&&event.button!==0))return;
      const rect=button.getBoundingClientRect();
      drag={
        pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,
        originX:rect.left,originY:rect.top,moved:false,button,positionKey:positionKey(button)
      };
      try{button.setPointerCapture(event.pointerId);}catch{/* Document listeners are the fallback. */}
    },{capture:true,passive:true});

    document.addEventListener("pointermove",event=>{
      const active=drag;
      if(!active||event.pointerId!==active.pointerId)return;
      const dx=event.clientX-active.startX,dy=event.clientY-active.startY;
      if(!active.moved&&Math.hypot(dx,dy)<DRAG_THRESHOLD)return;
      active.moved=true;
      event.preventDefault();
      active.button.classList.add("is-dragging");
      const point=clampPosition(active.originX+dx,active.originY+dy,active.button);
      active.button.style.left=point.x+"px";
      active.button.style.top=point.y+"px";
      active.button.style.right="auto";
      active.button.style.bottom="auto";
      savedPositions.set(active.positionKey,point);
    },{capture:true,passive:false});

    document.addEventListener("pointerup",finishDrag,true);
    document.addEventListener("pointercancel",finishDrag,true);
    document.addEventListener("lostpointercapture",event=>{
      if(drag&&event.target===drag.button)finishDrag(event as PointerEvent);
    },true);
    document.addEventListener("click",event=>{
      if(!suppressedButton)return;
      const target=event.target as Element|null;
      if(target?.closest(FLOATING_TRIGGER_SELECTOR)===suppressedButton){
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      suppressedButton=null;
    },true);
    window.addEventListener("resize",()=>{
      document.querySelectorAll<HTMLButtonElement>(FLOATING_TRIGGER_SELECTOR).forEach(button=>{
        const saved=getSavedPosition(positionKey(button));
        if(!saved)return;
        const point=clampPosition(saved.x,saved.y,button);
        persistPosition(positionKey(button),point);
        applyPosition(button);
      });
    },{passive:true});
  }

  document.querySelectorAll<HTMLButtonElement>(FLOATING_TRIGGER_SELECTOR).forEach(applyPosition);
}
