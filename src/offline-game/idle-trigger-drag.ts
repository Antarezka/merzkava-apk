let savedPosition: { x:number; y:number } | null = null;
let drag: { pointerId:number; startX:number; startY:number; originX:number; originY:number; moved:boolean; button:HTMLButtonElement; page:HTMLElement } | null = null;
let installed = false;
let suppressNextClick = false;

function clampPosition(x:number,y:number,button:HTMLElement,page:HTMLElement):{x:number;y:number} {
  const rect=page.getBoundingClientRect();
  const width=button.offsetWidth||46, height=button.offsetHeight||46;
  const left=Math.max(0,rect.left), top=Math.max(0,rect.top);
  const right=Math.min(window.innerWidth,rect.right), bottom=Math.min(window.innerHeight,rect.bottom);
  return {
    x:Math.max(left,Math.min(x,Math.max(left,right-width))),
    y:Math.max(top,Math.min(y,Math.max(top,bottom-height)))
  };
}

function applyPosition(button:HTMLButtonElement,page:HTMLElement):void {
  if(!savedPosition) return;
  const p=clampPosition(savedPosition.x,savedPosition.y,button,page);
  savedPosition=p;
  button.style.left=p.x+"px";
  button.style.top=p.y+"px";
  button.style.right="auto";
  button.style.bottom="auto";
}

export function initializeIdleTriggerDrag():void {
  if(!installed) {
    installed=true;
    document.addEventListener("pointerdown",event=>{
      const target=event.target as Element|null;
      const button=target?.closest<HTMLButtonElement>(".expedition-idle-trigger");
      const page=button?.closest<HTMLElement>(".expedition-page");
      if(!button||!page||event.button!==0) return;
      const rect=button.getBoundingClientRect();
      drag={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,originX:rect.left,originY:rect.top,moved:false,button,page};
    },{capture:true});
    document.addEventListener("pointermove",event=>{
      if(!drag||event.pointerId!==drag.pointerId) return;
      const dx=event.clientX-drag.startX,dy=event.clientY-drag.startY;
      if(!drag.moved&&Math.hypot(dx,dy)<6) return;
      drag.moved=true;
      event.preventDefault();
      const p=clampPosition(drag.originX+dx,drag.originY+dy,drag.button,drag.page);
      savedPosition=p;
      drag.button.style.left=p.x+"px";
      drag.button.style.top=p.y+"px";
      drag.button.style.right="auto";
      drag.button.style.bottom="auto";
    },{capture:true,passive:false});
    const finish=(event:PointerEvent)=>{
      if(!drag||event.pointerId!==drag.pointerId) return;
      if(drag.moved) suppressNextClick=true;
      drag=null;
    };
    document.addEventListener("pointerup",finish,true);
    document.addEventListener("pointercancel",finish,true);
    document.addEventListener("click",event=>{
      if(!suppressNextClick) return;
      const target=event.target as Element|null;
      if(target?.closest(".expedition-idle-trigger")) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      suppressNextClick=false;
    },true);
  }
  const button=document.querySelector<HTMLButtonElement>(".expedition-page .expedition-idle-trigger");
  const page=button?.closest<HTMLElement>(".expedition-page");
  if(button&&page) applyPosition(button,page);
}
