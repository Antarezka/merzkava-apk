import { getEternalSave } from "./expedition-game";
import { applySatietyIntake, calculateSatietyInterval, getPortionSatietyGain, type SatietyPortion } from "./mechanics/satiety";

export interface PlayerHudPreviewState {
  hp: number; maxHp: number; satiety: number; items: Record<string, number>;
}
const TEST_ITEMS: ReadonlyArray<{id:string;label:string;portion:SatietyPortion;description:string}> = [
  {id:"ration-small",label:"Field ration · Small",portion:"SMALL",description:"Test portion · +10 Satiety maximum"},
  {id:"ration-standard",label:"Field ration · Standard",portion:"STANDARD",description:"Test portion · +34 Satiety maximum"},
  {id:"ration-large",label:"Field ration · Large",portion:"LARGE",description:"Test portion · +50 Satiety maximum"}
];
const STORAGE_PREFIX="merzkava.player-hud-preview.v1:";
const DEFAULT_ITEMS:Record<string,number>={"ration-small":999,"ration-standard":999,"ration-large":999};

export function createDefaultPlayerHudPreviewState():PlayerHudPreviewState {
  return {hp:100,maxHp:100,satiety:80,items:{...DEFAULT_ITEMS}};
}
function storageKey():string {
  const saveId=getEternalSave()?.saveId??"unbound-world-atlas-preview";
  return STORAGE_PREFIX+encodeURIComponent(saveId);
}
function normalizeState(value:unknown):PlayerHudPreviewState {
  const fallback=createDefaultPlayerHudPreviewState();
  if(!value||typeof value!=="object")return fallback;
  const source=value as Partial<PlayerHudPreviewState>;
  const hp=Number(source.hp),maxHp=Number(source.maxHp),satiety=Number(source.satiety);
  const rawItems=source.items&&typeof source.items==="object"?source.items:{};
  const items:Record<string,number>={...DEFAULT_ITEMS};
  for(const item of TEST_ITEMS){
    const raw=(rawItems as Record<string,unknown>)[item.id],count=Number(raw);
    if(raw!==undefined&&Number.isInteger(count)&&count>=0&&count<=999)items[item.id]=count;
  }
  const safeMax=Number.isFinite(maxHp)&&maxHp>0?Math.min(999999,maxHp):100;
  return {
    hp:Number.isFinite(hp)?Math.max(0,Math.min(safeMax,hp)):100,
    maxHp:safeMax,
    satiety:Number.isFinite(satiety)?Math.max(0,Math.min(100,satiety)):80,
    items
  };
}
export function readPlayerHudPreviewState():PlayerHudPreviewState {
  try{
    if(typeof globalThis.localStorage==="undefined")return createDefaultPlayerHudPreviewState();
    const raw=globalThis.localStorage.getItem(storageKey());
    return raw?normalizeState(JSON.parse(raw)):createDefaultPlayerHudPreviewState();
  }catch{return createDefaultPlayerHudPreviewState();}
}
function writePlayerHudPreviewState(state:PlayerHudPreviewState):void {
  try{
    if(typeof globalThis.localStorage!=="undefined")globalThis.localStorage.setItem(storageKey(),JSON.stringify(normalizeState(state)));
  }catch{/* in-memory preview remains usable */}
}
export function simulatePlayerHudPreviewAwakeHour(state:PlayerHudPreviewState):{state:PlayerHudPreviewState;drain:number;valid:boolean} {
  const result=calculateSatietyInterval({
    satiety:state.satiety,realm:"Mortal",awakeHours:1,activity:"LIGHT",
    missedMealWindows:0,bodyCondition:"NORMAL_OR_MILD",biologicalMultiplier:1
  });
  if(!result.valid)return {state:{...state,items:{...state.items}},drain:0,valid:false};
  return {state:{...state,satiety:result.result.satietyAfter,items:{...state.items}},drain:result.result.actualDrain,valid:true};
}
export function consumePlayerHudPreviewItem(state:PlayerHudPreviewState,itemId:string):{state:PlayerHudPreviewState;gain:number;valid:boolean} {
  const item=TEST_ITEMS.find(candidate=>candidate.id===itemId);
  if(!item||state.items[itemId]<=0)return {state:{...state,items:{...state.items}},gain:0,valid:false};
  const intake=applySatietyIntake(state.satiety,getPortionSatietyGain(item.portion));
  if(!intake.valid)return {state:{...state,items:{...state.items}},gain:0,valid:false};
  return {
    state:{...state,satiety:intake.after,items:{...state.items,[itemId]:state.items[itemId]-1}},
    gain:intake.actualGain,valid:true
  };
}
function esc(value:string):string {
  return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]||char));
}
function meterMarkup(label:string,value:number,max:number,kind:"hp"|"satiety"):string {
  const percentage=Math.max(0,Math.min(100,value/Math.max(1,max)*100));
  return '<div class="wmh-player-meter wmh-player-meter-'+kind+'"><div class="wmh-player-meter-copy"><b>'+label+'</b><strong data-hud-'+kind+'-value>'+value.toFixed(1).replace(/\.0$/,"")+'<small> / '+max+'</small></strong></div><div class="wmh-player-meter-track" role="progressbar" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="'+max+'" aria-valuenow="'+value+'"><span data-hud-'+kind+'-bar style="width:'+percentage+'%"></span></div></div>';
}
export function renderPlayerHudMarkup():string {
  const state=readPlayerHudPreviewState();
  const name=getEternalSave()?.character.name?.trim()||"PLAYER";
  const items=TEST_ITEMS.map(item=>'<button type="button" class="wmh-inventory-item" data-hud-action="consume" data-item-id="'+item.id+'" aria-label="Consume '+item.label+'"><span class="wmh-inventory-glyph" aria-hidden="true">✧</span><span class="wmh-inventory-copy"><b>'+item.label+'</b><small>'+item.description+'</small></span><strong data-hud-item-count="'+item.id+'">×'+state.items[item.id]+'</strong></button>').join("");
  const skills=["Technique","Guard","Movement","Spirit Art"],realms=["SPIRIT INITIATE","SPIRIT ADEPT","SPIRIT ELDER","SPIRIT MONARCH"];
  const skillMarkup=skills.map((skill,index)=>'<button type="button" class="wmh-skill-slot" data-hud-action="skill" data-skill-slot="'+(index+1)+'" data-realm-tier="'+(index+1)+'" aria-label="Skill slot '+(index+1)+', Spirit Realm '+(index+1)+', placeholder"><span class="wmh-skill-ring" data-hud-ring aria-hidden="true"><i data-hud-ring-inner></i><b></b></span><small class="wmh-skill-realm">SR '+(index+1)+' · '+realms[index]+'</small><strong>'+skill+'</strong><em>PLACEHOLDER</em></button>').join("");
  return '<section class="wmh-player-hud" data-wmh-player-hud aria-label="Player field status">'+
    '<article class="wmh-player-card" data-wmh-hud-layout="player-card" aria-label="Player identity and status"><header class="wmh-player-hud-header"><span class="wmh-player-crest" aria-hidden="true">✦</span><div class="wmh-player-id"><small>WORLD ATLAS · PLAYER</small><strong data-hud-character-name>'+esc(name)+'</strong><em>PREVIEW PROFILE · NOT CANON STATE</em></div><div class="wmh-player-realm"><small>SPIRIT REALM</small><b>MORTAL</b></div></header>'+
    '<div class="wmh-player-vitals">'+meterMarkup("HP",state.hp,state.maxHp,"hp")+meterMarkup("SATIETY",state.satiety,100,"satiety")+'</div>'+
    '<div class="wmh-player-affiliation"><span><small>AFFILIATION</small><b>NOT LINKED</b></span><em>Clan · Sect · Trade Guild · Assassin Guild · Empire Unit</em></div>'+
    '<div class="wmh-player-hud-actions"><button type="button" data-hud-action="open-panel" data-hud-panel-open="quests">✦ QUEST BOARD <small>MAIN / SIDE</small></button><button type="button" data-hud-action="open-panel" data-hud-panel-open="social">◎ SOCIAL LINKS <small>RELATIONSHIPS</small></button><button type="button" data-hud-action="advance-hour">SIMULATE 1H <small>AWAKE · LIGHT</small></button></div>'+
    '<small class="wmh-player-hud-feedback" data-hud-feedback aria-live="polite">Preview data. Satiety formula is active; inventory and profile bindings are placeholders.</small>'+
    '<section class="wmh-hud-drawer" data-hud-panel="quests" hidden role="dialog" aria-label="Quest board placeholder"><header><b>QUEST BOARD</b><button type="button" data-hud-action="close-panels" aria-label="Close quest board">×</button></header><article class="wmh-quest-preview"><small>MAIN QUEST · NOT CONNECTED</small><strong>Awaiting a verified world objective</strong><p>The quest resolver and recorded objectives are not wired into this field HUD yet.</p></article><article class="wmh-quest-preview"><small>SIDE QUEST · NOT CONNECTED</small><strong>No recorded side objective</strong><p>Quest rewards and time costs remain inactive placeholders.</p></article></section>'+
    '<section class="wmh-hud-drawer wmh-social-drawer" data-hud-panel="social" hidden role="dialog" aria-label="Social links placeholder"><header><b>SOCIAL LINKS</b><button type="button" data-hud-action="close-panels" aria-label="Close social links">×</button></header><p class="wmh-social-intro">PERSONA-INSPIRED RELATIONSHIP BOARD · PREVIEW ONLY</p>'+
    '<div class="wmh-social-card"><span>01</span><div><b>NEARBY NPC</b><small>RELATIONSHIP UNINITIALIZED</small></div><meter min="0" max="100" value="0"></meter></div><div class="wmh-social-card"><span>02</span><div><b>KNOWN CONTACT</b><small>NO RECORDED SOCIAL LINK</small></div><meter min="0" max="100" value="0"></meter></div><div class="wmh-social-card"><span>03</span><div><b>FACTION CONTACT</b><small>NO AFFILIATION BINDING</small></div><meter min="0" max="100" value="0"></meter></div><small class="wmh-social-foot">No disposition, bond or NPC agenda is changed by this preview.</small></section></article>'+
    '<section class="wmh-player-dock" data-wmh-hud-layout="skill-dock" aria-label="Combat and inventory quick slots"><div class="wmh-skill-dock"><header><b>TACTICAL SKILLS</b><small>TURN-BASED · TIME ORDER NOT CONNECTED</small></header><div class="wmh-skill-slots">'+skillMarkup+'</div></div><div class="wmh-inventory-dock"><header><b>INVENTORY · TEST ITEMS</b><small>NON-CANON FIXTURE · ×999</small></header><div class="wmh-inventory-slots">'+items+'</div></div></section></section>';
}
export function refreshPlayerHud(root:HTMLElement,feedback?:string):void {
  const hud=root.matches("[data-wmh-player-hud]")?root:root.querySelector<HTMLElement>("[data-wmh-player-hud]");
  if(!hud)return;
  const state=readPlayerHudPreviewState(),name=getEternalSave()?.character.name?.trim()||"PLAYER";
  const nameNode=hud.querySelector<HTMLElement>("[data-hud-character-name]");
  if(nameNode)nameNode.textContent=name;
  const update=(kind:"hp"|"satiety",value:number,max:number)=>{
    const label=hud.querySelector<HTMLElement>("[data-hud-"+kind+"-value]");
    const bar=hud.querySelector<HTMLElement>("[data-hud-"+kind+"-bar]");
    if(label)label.innerHTML=value.toFixed(1).replace(/\.0$/,"")+'<small> / '+max+'</small>';
    if(bar){bar.style.width=Math.max(0,Math.min(100,value/Math.max(1,max)*100))+"%";bar.parentElement?.setAttribute("aria-valuenow",String(value));}
  };
  update("hp",state.hp,state.maxHp);update("satiety",state.satiety,100);
  for(const item of TEST_ITEMS){
    const count=hud.querySelector<HTMLElement>('[data-hud-item-count="'+item.id+'"]');
    const button=hud.querySelector<HTMLButtonElement>('[data-item-id="'+item.id+'"]');
    if(count)count.textContent="×"+state.items[item.id];
    if(button)button.disabled=state.items[item.id]<=0;
  }
  if(feedback){const note=hud.querySelector<HTMLElement>("[data-hud-feedback]");if(note)note.textContent=feedback;}
}
export function handlePlayerHudClick(target:Element,dialog:HTMLElement):boolean {
  const action=target.closest<HTMLElement>("[data-hud-action]");
  const hud=dialog.querySelector<HTMLElement>("[data-wmh-player-hud]");
  if(!action||!hud||!hud.contains(action))return false;
  const kind=action.dataset.hudAction;
  if(kind==="open-panel"){
    const name=action.dataset.hudPanelOpen;
    hud.querySelectorAll<HTMLElement>("[data-hud-panel]").forEach(panel=>{panel.hidden=panel.dataset.hudPanel!==name;});
    return true;
  }
  if(kind==="close-panels"){hud.querySelectorAll<HTMLElement>("[data-hud-panel]").forEach(panel=>{panel.hidden=true;});return true;}
  if(kind==="skill"){refreshPlayerHud(dialog,"SKILL SLOT "+(action.dataset.skillSlot||"?")+" · Placeholder only. Combat resolution is not connected.");return true;}
  if(kind==="advance-hour"){
    const result=simulatePlayerHudPreviewAwakeHour(readPlayerHudPreviewState());
    if(!result.valid){refreshPlayerHud(dialog,"Satiety preview could not be calculated.");return true;}
    writePlayerHudPreviewState(result.state);
    refreshPlayerHud(dialog,"1 awake hour · LIGHT ×1.25 · Satiety −"+result.drain.toFixed(1)+" (official formula preview; world clock unchanged).");
    return true;
  }
  if(kind==="consume"){
    const result=consumePlayerHudPreviewItem(readPlayerHudPreviewState(),action.dataset.itemId||"");
    if(!result.valid){refreshPlayerHud(dialog,"No test portion remains in that slot.");return true;}
    writePlayerHudPreviewState(result.state);
    refreshPlayerHud(dialog,"Test portion consumed · Satiety +"+result.gain.toFixed(1)+" · non-canon test inventory.");
    return true;
  }
  return false;
}
const motionScopes=new WeakMap<HTMLElement,{reveconst motionScopes=new WeakMap<HTMLElement,()=>void>();
export function mountPlayerHudMotion(root:HTMLElement):void {
  const hud=root.matches("[data-wmh-player-hud]")?root:root.querySelector<HTMLElement>("[data-wmh-player-hud]");
  if(!hud||motionScopes.has(hud)||typeof document==="undefined")return;
  const sync=()=>hud.classList.toggle("wmh-hud-motion-paused",document.hidden);
  sync();
  document.addEventListener("visibilitychange",sync,{passive:true});
  motionScopes.set(hud,()=>{
    document.removeEventListener("visibilitychange",sync);
    hud.classList.remove("wmh-hud-motion-paused");
  });
}
export function disposePlayerHudMotion(root:HTMLElement):void {
  const hud=root.matches("[data-wmh-player-hud]")?root:root.querySelector<HTMLElement>("[data-wmh-player-hud]");
  if(!hud)return;
  motionScopes.get(hud)?.();
  motionScopes.delete(hud);
}
le:number};
type PlayerHudLayoutGesture={
  element:HTMLElement;
  mode:"drag"|"resize"|"pinch";
  startX:number;
  startY:number;
  baseX:number;
  baseY:number;
  baseScale:number;
  startDistance:number;
  startCenterX:number;
  startCenterY:number;
};

/** Applies per-map HUD placement and exposes touch drag/pinch editing in Developer field tools. */
export function bindPlayerHudLayoutEditor(dialog:HTMLElement):void {
  const hud=dialog.querySelector<HTMLElement>("[data-wmh-isometric-hud]");
  if(!hud||hud.dataset.hudLayoutBound==="true")return;
  hud.dataset.hudLayoutBound="true";
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  const mapId=board?.dataset.mapId||"default";
  const storageKey="merzkava.rpg-hud-layout.v1:"+encodeURIComponent(mapId);
  const elements=Array.from(hud.querySelectorAll<HTMLElement>("[data-wmh-hud-layout]"));
  const editor=dialog.querySelector<HTMLElement>("[data-wmh-hud-layout-editor]");
  const select=editor?.querySelector<HTMLSelectElement>("[data-wmh-hud-layout-select]");
  const status=editor?.querySelector<HTMLElement>("[data-wmh-hud-layout-status]");
  const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
  const pointers=new Map<number,{x:number;y:number}>();
  const layouts:Record<string,PlayerHudLayoutPoint>={};
  const readSaved=():Record<string,PlayerHudLayoutPoint>=>{
    try {
      const value=JSON.parse(localStorage.getItem(storageKey)||"{}") as Record<string,PlayerHudLayoutPoint>;
      return value&&typeof value==="object"?value:{};
    } catch { return {}; }
  };
  const saved=readSaved();
  const rootRect=()=>hud.getBoundingClientRect();
  const currentPoint=(element:HTMLElement):PlayerHudLayoutPoint=>{
    const cached=layouts[element.dataset.wmhHudLayout||""];
    if(cached)return {...cached};
    const root=rootRect(),rect=element.getBoundingClientRect();
    return {
      x:root.width>0?clamp((rect.left-root.left)/root.width*100,0,100):0,
      y:root.height>0?clamp((rect.top-root.top)/root.height*100,0,100):0,
      scale:1
    };
  };
  const apply=(element:HTMLElement,point:PlayerHudLayoutPoint)=>{
    const id=element.dataset.wmhHudLayout||"";
    const safe={x:clamp(point.x,0,100),y:clamp(point.y,0,100),scale:clamp(point.scale,.55,1.8)};
    layouts[id]=safe;
    element.style.setProperty("--hud-layout-left",safe.x+"%");
    element.style.setProperty("--hud-layout-top",safe.y+"%");
    element.style.setProperty("--hud-layout-right","auto");
    element.style.setProperty("--hud-layout-bottom","auto");
    element.style.setProperty("--hud-layout-transform","scale("+safe.scale+")");
  };
  for(const element of elements){
    const id=element.dataset.wmhHudLayout||"";
    const value=saved[id];
    if(value&&Number.isFinite(value.x)&&Number.isFinite(value.y)&&Number.isFinite(value.scale))apply(element,value);
  }
  if(!editor||!select)return;
  const resizeHandle=(element:HTMLElement)=>{
    let handle=element.querySelector<HTMLElement>(":scope > [data-wmh-hud-resize]");
    if(!handle){
      handle=document.createElement("span");
      handle.className="wmh-hud-layout-resize";
      handle.dataset.wmhHudResize="";
      handle.setAttribute("aria-hidden","true");
      element.append(handle);
    }
  };
  elements.forEach(resizeHandle);
  const selected=()=>{
    const id=select.value;
    elements.forEach(element=>{
      const active=element.dataset.wmhHudLayout===id;
      element.classList.toggle("is-hud-layout-selected",active);
      element.classList.toggle("is-hud-layout-editable",true);
    });
  };
  select.addEventListener("change",selected);
  selected();
  let gesture:PlayerHudLayoutGesture|null=null;
  const distance=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y);
  const center=(values:{x:number;y:number}[])=>({x:(values[0].x+values[1].x)/2,y:(values[0].y+values[1].y)/2});
  const commit=(element:HTMLElement)=>{
    const root=rootRect(),point=currentPoint(element);
    if(root.width>0&&root.height>0)layouts[element.dataset.wmhHudLayout||""]={...point};
  };
  const persist=()=>{
    for(const element of elements)commit(element);
    try {
      localStorage.setItem(storageKey,JSON.stringify(layouts));
      if(status)status.textContent="HUD positions saved for this map on this device.";
    } catch {
      if(status)status.textContent="Could not save HUD positions. Local storage is unavailable.";
    }
  };
  const updateFromPixels=(element:HTMLElement,left:number,top:number,scale:number)=>{
    const root=rootRect();
    if(root.width<=0||root.height<=0)return;
    const maxLeft=Math.max(0,root.width-element.offsetWidth*scale);
    const maxTop=Math.max(0,root.height-element.offsetHeight*scale);
    apply(element,{
      x:clamp(left,0,maxLeft)/root.width*100,
      y:clamp(top,0,maxTop)/root.height*100,
      scale
    });
  };
  elements.forEach(element=>{
    element.addEventListener("pointerdown",event=>{
      const id=element.dataset.wmhHudLayout||"";
      if(select.value!==id)return;
      event.preventDefault();
      event.stopPropagation();
      const point=event.target instanceof Element?event.target:null;
      const resizing=!!point?.closest("[data-wmh-hud-resize]");
      const rect=element.getBoundingClientRect(),root=rootRect(),layout=currentPoint(element);
      const pointer={x:event.clientX,y:event.clientY};
      pointers.set(event.pointerId,pointer);
      if(!gesture){
        gesture={
          element,mode:resizing?"resize":"drag",
          startX:event.clientX,startY:event.clientY,
          baseX:rect.left-root.left,baseY:rect.top-root.top,
          baseScale:layout.scale,startDistance:0,startCenterX:0,startCenterY:0
        };
      }else if(gesture.element===element&&pointers.size>=2){
        const pair=Array.from(pointers.values()).slice(0,2),mid=center(pair);
        gesture.mode="pinch";
        gesture.baseX=rect.left-root.left;gesture.baseY=rect.top-root.top;
        gesture.baseScale=layout.scale;
        gesture.startDistance=Math.max(1,distance(pair[0],pair[1]));
        gesture.startCenterX=mid.x;gesture.startCenterY=mid.y;
      }
      try{element.setPointerCapture(event.pointerId);}catch{}
      if(status)status.textContent="Drag to move · use the corner grip or two fingers to resize.";
    });
    element.addEventListener("pointermove",event=>{
      if(!gesture||gesture.element!==element||!pointers.has(event.pointerId))return;
      event.preventDefault();event.stopPropagation();
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(pointers.size>=2&&gesture.mode==="pinch"){
        const pair=Array.from(pointers.values()).slice(0,2),mid=center(pair);
        const ratio=distance(pair[0],pair[1])/gesture.startDistance;
        updateFromPixels(element,
          gesture.baseX+mid.x-gesture.startCenterX,
          gesture.baseY+mid.y-gesture.startCenterY,
          clamp(gesture.baseScale*ratio,.55,1.8)
        );
      }else if(gesture.mode==="resize"){
        const delta=((event.clientX-gesture.startX)+(event.clientY-gesture.startY))/Math.max(120,element.offsetWidth+element.offsetHeight);
        updateFromPixels(element,gesture.baseX,gesture.baseY,clamp(gesture.baseScale*(1+delta),.55,1.8));
      }else{
        updateFromPixels(element,
          gesture.baseX+event.clientX-gesture.startX,
          gesture.baseY+event.clientY-gesture.startY,
          gesture.baseScale
        );
      }
      if(status)status.textContent="HUD layout preview · save to keep this map arrangement.";
    });
    const finish=(event:PointerEvent)=>{
      if(!gesture||gesture.element!==element)return;
      event.preventDefault();event.stopPropagation();
      pointers.delete(event.pointerId);
      if(pointers.size===1){
        const remaining=Array.from(pointers.entries())[0];
        const rect=element.getBoundingClientRect(),root=rootRect(),point=currentPoint(element);
        gesture={
          element,mode:"drag",startX:remaining[1].x,startY:remaining[1].y,
          baseX:rect.left-root.left,baseY:rect.top-root.top,
          baseScale:point.scale,startDistance:0,startCenterX:0,startCenterY:0
        };
        return;
      }
      gesture=null;
      persist();
    };
    element.addEventListener("pointerup",finish);
    element.addEventListener("pointercancel",finish);
    element.addEventListener("lostpointercapture",finish as EventListener);
  });
  editor.querySelector<HTMLElement>("[data-wmh-hud-layout-save]")?.addEventListener("click",persist);
  editor.querySelector<HTMLElement>("[data-wmh-hud-layout-reset]")?.addEventListener("click",()=>{
    const id=select.value,element=elements.find(item=>item.dataset.wmhHudLayout===id);
    if(!element)return;
    delete layouts[id];
    element.style.removeProperty("--hud-layout-left");element.style.removeProperty("--hud-layout-top");
    element.style.removeProperty("--hud-layout-right");element.style.removeProperty("--hud-layout-bottom");
    element.style.removeProperty("--hud-layout-transform");
    try{localStorage.setItem(storageKey,JSON.stringify(layouts));}
    catch{}
    if(status)status.textContent="Selected HUD element returned to its default position.";
  });
}
