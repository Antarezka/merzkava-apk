type IdleDragState = {
  pointerId:number; startX:number; startY:number; originX:number; originY:number;
  moved:boolean; button:HTMLButtonElement;
};
let savedPosition:{x:number;y:number}|null=null;
let drag:IdleDragState|null=null;
let installed=false;
let suppressNextClick=false;

function clampPosition(x:number,y:number,button:HTMLElement):{x:number;y:number}{
  const margin=6,width=button.offsetWidth||46,height=button.offsetHeight||46;
  return {
    x:Math.max(margin,Math.min(x,window.innerWidth-width-margin)),
    y:Math.max(margin,Math.min(y,window.innerHeight-height-margin))
  };
}
function applyPosition(button:HTMLButtonElement):void{
  if(!savedPosition)return;
  const p=clampPosition(savedPosition.x,savedPosition.y,button);
  savedPosition=p;
  button.style.position="fixed";
  button.style.left=p.x+"px";
  button.style.top=p.y+"px";
  button.style.right="auto";
  button.style.bottom="auto";
}
export function initializeIdleTriggerDrag():void{
  if(!installed){
    installed=true;
    document.addEventListener("pointerdown",event=>{
      const target=event.target as Element|null;
      const button=target?.closest<HTMLButtonElement>(".expedition-idle-trigger");
      if(!button||!event.isPrimary||(event.pointerType==="mouse"&&event.button!==0))return;
      const rect=button.getBoundingClientRect();
      drag={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,originX:rect.left,originY:rect.top,moved:false,button};
    },{capture:true,passive:true});
    document.addEventListener("pointermove",event=>{
      const active=drag;
      if(!active||event.pointerId!==active.pointerId)return;
      const dx=event.clientX-active.startX,dy=event.clientY-active.startY;
      if(!active.moved&&Math.hypot(dx,dy)<5)return;
      active.moved=true;
      event.preventDefault();
      active.button.classList.add("is-dragging");
      const p=clampPosition(active.originX+dx,active.originY+dy,active.button);
      savedPosition=p;
      active.button.style.position="fixed";
      active.button.style.left=p.x+"px";
      active.button.style.top=p.y+"px";
      active.button.style.right="auto";
      active.button.style.bottom="auto";
    },{capture:true,passive:false});
    const finish=(event:PointerEvent)=>{
      const active=drag;
      if(!active||event.pointerId!==active.pointerId)return;
      if(active.moved)suppressNextClick=true;
      active.button.classList.remove("is-dragging");
      drag=null;
    };
    document.addEventListener("pointerup",finish,true);
    document.addEventListener("pointercancel",finish,true);
    document.addEventListener("click",event=>{
      if(!suppressNextClick)return;
      const target=event.target as Element|null;
      if(target?.closest(".expedition-idle-trigger")){
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      suppressNextClick=false;
    },true);
    window.addEventListener("resize",()=>{
      const button=document.querySelector<HTMLButtonElement>(".expedition-page .expedition-idle-trigger");
      if(button)applyPosition(button);
    },{passive:true});
  }
  const button=document.querySelector<HTMLButtonElement>(".expedition-page .expedition-idle-trigger");
  if(button)applyPosition(button);
}
