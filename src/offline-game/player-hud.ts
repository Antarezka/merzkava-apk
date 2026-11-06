import { getEternalSave } from "./expedition-game";
import { applySatietyIntake, calculateSatietyInterval, getPortionSatietyGain, type SatietyPortion } from "./mechanics/satiety";

export interface PlayerHudPreviewState {
  hp:number; maxHp:number; satiety:number;
  items:Record<string,number>;
  wallet:Record<"xc"|"xs"|"xg"|"zj"|"az",number>;
}
type HudItem={id:string;label:string;glyph:string;tier:number;kind:"consumable"|"material";description:string;portion?:SatietyPortion};
const TEST_ITEMS:ReadonlyArray<HudItem>=[
  {id:"ration-small",label:"Field Ration · Small",glyph:"🍖",tier:1,kind:"consumable",portion:"SMALL",description:"A compact travel ration prepared for short journeys. Commonly carried by students, couriers, and ordinary travelers."},
  {id:"ration-standard",label:"Field Ration · Standard",glyph:"🥩",tier:1,kind:"consumable",portion:"STANDARD",description:"A balanced preserved meal suited to a longer day on the road. Often prepared by inns and supply merchants."},
  {id:"ration-large",label:"Field Ration · Large",glyph:"🍱",tier:1,kind:"consumable",portion:"LARGE",description:"A generous travel meal intended for demanding journeys. Usually packed before expeditions or extended travel."},
  {id:"bread",label:"Bread",glyph:"🍞",tier:1,kind:"consumable",portion:"SMALL",description:"A simple baked staple that keeps well for ordinary travel. Commonly bought from bakeries and market stalls."},
  {id:"apple",label:"Apple",glyph:"🍎",tier:1,kind:"consumable",portion:"SMALL",description:"A fresh piece of fruit gathered from orchards or purchased from local produce sellers."},
  {id:"wood",label:"Wood",glyph:"🪵",tier:1,kind:"material",description:"Cut timber used as a basic construction and workshop material. Usually gathered through woodcutting or collected from suitable natural sources."},
  {id:"stone",label:"Stone",glyph:"🪨",tier:1,kind:"material",description:"Common stone used in simple building work and material preparation. Often collected from exposed deposits or quarry sites."},
  {id:"herb",label:"Herbs",glyph:"🌿",tier:2,kind:"material",description:"A bundle of useful field herbs valued by apothecaries and makers. They are commonly gathered in suitable wild habitats."},
  {id:"potion",label:"Restorative Draught",glyph:"🧪",tier:2,kind:"consumable",portion:"SMALL",description:"A small prepared restorative mixture carried for emergencies. Its precise effects depend on the verified formula and item record."}
];
const STORAGE_PREFIX="merzkava.player-hud-preview.v2:";
const DEFAULT_ITEMS:Record<string,number>={"ration-small":5,"ration-standard":3,"ration-large":2,bread:3,apple:4,wood:8,stone:12,herb:6,potion:2};
const DEFAULT_WALLET={xc:79,xs:9,xg:4,zj:0,az:0};

export function createDefaultPlayerHudPreviewState():PlayerHudPreviewState {
  return {hp:100,maxHp:100,satiety:80,items:{...DEFAULT_ITEMS},wallet:{...DEFAULT_WALLET}};
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
  const rawWallet=source.wallet&&typeof source.wallet==="object"?source.wallet:{};
  const wallet={...DEFAULT_WALLET};
  for(const key of Object.keys(wallet) as Array<keyof typeof wallet>){
    const count=Number((rawWallet as Record<string,unknown>)[key]);
    if(Number.isInteger(count)&&count>=0&&count<=999999999)wallet[key]=count;
  }
  const safeMax=Number.isFinite(maxHp)&&maxHp>0?Math.min(999999,maxHp):100;
  return {
    hp:Number.isFinite(hp)?Math.max(0,Math.min(safeMax,hp)):100,
    maxHp:safeMax,
    satiety:Number.isFinite(satiety)?Math.max(0,Math.min(100,satiety)):80,
    items,wallet
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
  if(!item||item.kind!=="consumable"||!item.portion||state.items[itemId]<=0)
    return {state:{...state,items:{...state.items},wallet:{...state.wallet}},gain:0,valid:false};
  const intake=applySatietyIntake(state.satiety,getPortionSatietyGain(item.portion));
  if(!intake.valid)return {state:{...state,items:{...state.items},wallet:{...state.wallet}},gain:0,valid:false};
  return {
    state:{...state,satiety:intake.after,items:{...state.items,[itemId]:state.items[itemId]-1},wallet:{...state.wallet}},
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
  const ringMarkup=[1,2,3,4].map(index=>'<div class="wmh-spirit-ring" data-realm-tier="'+index+'" aria-label="Spirit Ring preview slot '+index+'"><span class="wmh-spirit-ring-orbit"><i></i></span><b>SR'+index+'</b></div>').join("");
  const skills=["Technique","Guard","Movement","Spirit Art"],realms=["SPIRIT INITIATE","SPIRIT ADEPT","SPIRIT ELDER","SPIRIT MONARCH"];
  const skillMarkup=skills.map((skill,index)=>'<button type="button" class="wmh-skill-slot" data-hud-action="skill" data-skill-slot="'+(index+1)+'" data-realm-tier="'+(index+1)+'" aria-label="Skill slot '+(index+1)+' placeholder"><span class="wmh-skill-ring" aria-hidden="true"><i></i><b></b></span><small class="wmh-skill-realm">SR '+(index+1)+' · '+realms[index]+'</small><strong>'+skill+'</strong></button>').join("");
  const itemsMarkup=Array.from({length:25},(_,index)=>{
    const item=TEST_ITEMS[index];
    if(!item)return '<div class="wmh-inventory-slot is-empty" data-slot="'+String(index+1).padStart(2,"0")+'" aria-label="Empty inventory slot '+(index+1)+'"><span>'+String(index+1).padStart(2,"0")+'</span></div>';
    return '<button type="button" class="wmh-inventory-slot wmh-inventory-item" data-hud-action="inventory-item" data-hud-item-id="'+item.id+'" data-item-kind="'+item.kind+'" aria-label="'+esc(item.label)+' · quantity '+state.items[item.id]+'"><span class="wmh-item-tier-frame" data-tier="'+item.tier+'"><span class="wmh-item-icon" aria-hidden="true">'+item.glyph+'</span></span><strong class="wmh-item-quantity" data-hud-item-count="'+item.id+'">×'+state.items[item.id]+'</strong></button>';
  }).join("");
  const currency=[["xc","Xuan Copper","●"],["xs","Xuan Silver","◉"],["xg","Xuan Gold","✦"],["zj","Zun Jade","◆"],["az","Ancient Zun","◇"]] as const;
  const currencyMarkup=currency.map(([key,label,glyph])=>'<div class="wmh-currency-row"><span class="wmh-currency-name"><i aria-hidden="true">'+glyph+'</i>'+label+'</span><b class="wmh-currency-amount" data-hud-currency="'+key+'">'+state.wallet[key]+' '+key+'</b></div>').join("");
  return '<section class="wmh-player-hud" data-wmh-player-hud aria-label="Player field status">'+
    '<article class="wmh-player-card" data-wmh-hud-layout="player-card" aria-label="Player status">'+
      '<div class="wmh-player-topline"><div class="wmh-player-id"><strong data-hud-character-name>'+esc(name)+'</strong></div><div class="wmh-player-satiety-label">SATIETY</div><div class="wmh-player-realm"><b>MORTAL</b></div></div>'+
      '<div class="wmh-player-bottomline"><div class="wmh-player-hp">'+meterMarkup("HP",state.hp,state.maxHp,"hp")+'</div><div class="wmh-player-satiety">'+meterMarkup("",state.satiety,100,"satiety")+'</div><div class="wmh-player-affiliation"><small>AFFILIATION</small><b>NOT LINKED</b></div></div>'+
    '</article>'+
    '<aside class="wmh-spirit-ring-list" aria-label="Absorbed Spirit Rings, maximum nine">'+ringMarkup+'</aside>'+
    '<section class="wmh-player-dock" data-wmh-hud-layout="skill-dock" aria-label="Tactical skills and bag"><div class="wmh-skill-dock"><header><b>TACTICAL SKILLS</b><small>PLACEHOLDER</small></header><div class="wmh-skill-slots">'+skillMarkup+'</div></div>'+
      '<button type="button" class="wmh-bag-button" data-hud-action="toggle-inventory" aria-label="Open Traveler Satchel" title="Traveler Satchel"><span aria-hidden="true"></span></button>'+
    '</section>'+
    '<section class="wmh-inventory-window" data-hud-panel="inventory" data-wmh-scroll-resize hidden role="dialog" aria-label="Traveler Satchel inventory">'+
      '<header class="wmh-inventory-header"><div><b>TRAVELER\'S SATCHEL</b><small>PERSONAL INVENTORY · <span data-hud-capacity>9 / 25</span></small></div><button type="button" data-hud-action="close-inventory" aria-label="Close inventory">×</button></header>'+
      '<div class="wmh-inventory-grid">'+itemsMarkup+'</div>'+
      '<section class="wmh-currency-purse"><header class="wmh-currency-header"><b>◈ CURRENCY PURSE</b><small>SEPARATE STORAGE</small></header><div class="wmh-currency-list">'+currencyMarkup+'</div></section>'+
    '</section>'+
    '<section class="wmh-item-tooltip" data-hud-item-tooltip hidden role="tooltip"><header><b data-tooltip-name></b><span data-tooltip-tier></span></header><p data-tooltip-description></p></section>'+
    '<section class="wmh-item-action-dialog" data-hud-consume-dialog hidden data-wmh-scroll-resize role="dialog" aria-label="Use item confirmation"><div class="wmh-item-action-copy"><b data-consume-name></b><small data-consume-quantity></small></div><p>Ingin menggunakan item ini?</p><div class="wmh-item-action-buttons"><button type="button" data-hud-action="confirm-consume">YES</button><button type="button" class="cancel" data-hud-action="cancel-consume">NO</button></div></section>'+
  '</section>';
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
    const button=hud.querySelector<HTMLButtonElement>('[data-hud-item-id="'+item.id+'"]');
    if(count)count.textContent="×"+state.items[item.id];
    if(button){button.disabled=state.items[item.id]<=0;button.setAttribute("aria-label",item.label+" · quantity "+state.items[item.id]);}
  }
  for(const key of Object.keys(state.wallet) as Array<keyof typeof state.wallet>){
    const node=hud.querySelector<HTMLElement>('[data-hud-currency="'+key+'"]');
    if(node)node.textContent=state.wallet[key]+" "+key;
  }
  const capacity=hud.querySelector<HTMLElement>("[data-hud-capacity]");
  if(capacity)capacity.textContent=String(TEST_ITEMS.filter(item=>state.items[item.id]>0).length)+" / 25";
  if(feedback){const note=hud.querySelector<HTMLElement>("[data-hud-feedback]");if(note)note.textContent=feedback;}
}
export function handlePlayerHudClick(target:Element,dialog:HTMLElement):boolean {
  const action=target.closest<HTMLElement>("[data-hud-action]");
  const hud=dialog.querySelector<HTMLElement>("[data-wmh-player-hud]");
  if(!action||!hud||!hud.contains(action))return false;
  if(action.dataset.skipNextClick==="true"){delete action.dataset.skipNextClick;return true;}
  const kind=action.dataset.hudAction;
  const inventory=hud.querySelector<HTMLElement>('[data-hud-panel="inventory"]');
  const consumeDialog=hud.querySelector<HTMLElement>("[data-hud-consume-dialog]");
  if(kind==="toggle-inventory"){if(inventory)inventory.hidden=!inventory.hidden;return true;}
  if(kind==="close-inventory"){if(inventory)inventory.hidden=true;return true;}
  if(kind==="inventory-item"){
    const item=TEST_ITEMS.find(candidate=>candidate.id===action.dataset.hudItemId);
    if(!item)return true;
    if(item.kind!=="consumable"||!item.portion){refreshPlayerHud(dialog,"Material items are reserved for trade or Home construction, not consumption.");return true;}
    if(consumeDialog){
      consumeDialog.dataset.itemId=item.id;
      const name=consumeDialog.querySelector<HTMLElement>("[data-consume-name]");
      const quantity=consumeDialog.querySelector<HTMLElement>("[data-consume-quantity]");
      if(name)name.textContent=item.label;
      if(quantity)quantity.textContent="QUANTITY · "+readPlayerHudPreviewState().items[item.id];
      consumeDialog.hidden=false;
    }
    return true;
  }
  if(kind==="cancel-consume"){if(consumeDialog)consumeDialog.hidden=true;return true;}
  if(kind==="confirm-consume"){
    const itemId=consumeDialog?.dataset.itemId||"";
    const result=consumePlayerHudPreviewItem(readPlayerHudPreviewState(),itemId);
    if(consumeDialog)consumeDialog.hidden=true;
    if(!result.valid){refreshPlayerHud(dialog,"This item cannot be used or no quantity remains.");return true;}
    writePlayerHudPreviewState(result.state);
    refreshPlayerHud(dialog,"Item used · Satiety +"+result.gain.toFixed(1)+". Preview inventory only.");
    return true;
  }
  if(kind==="skill"){refreshPlayerHud(dialog,"SKILL SLOT "+(action.dataset.skillSlot||"?")+" · Placeholder only. Combat resolution is not connected.");return true;}
  return false;
}
const motionScopes=new WeakMap<HTMLElement,()=>void>();
export function mountPlayerHudMotion(root:HTMLElement):void {
  const hud=root.matches("[data-wmh-player-hud]")?root:root.querySelector<HTMLElement>("[data-wmh-player-hud]");
  if(!hud||motionScopes.has(hud)||typeof document==="undefined")return;
  const sync=()=>hud.classList.toggle("wmh-hud-motion-paused",document.hidden);
  sync();
  document.addEventListener("visibilitychange",sync,{passive:true});
  bindPlayerHudInteractions(hud);
  bindScrollableResizableWindows(root);
  motionScopes.set(hud,()=>{
    document.removeEventListener("visibilitychange",sync);
    hud.classList.remove("wmh-hud-motion-paused");
  });
}
export function disposePlayerHudMotion(root:HTMLElement):void {
  const hud=root.matches("[data-wmh-player-hud]")?root:root.querySelector<HTMLElement>("[data-wmh-player-hud]");
  if(!hud)return;
  motionScopes.get(hud)?.();
  hudInteractionScopes.get(hud)?.();
  motionScopes.delete(hud);
  hudInteractionScopes.delete(hud);
}
const hudInteractionScopes=new WeakMap<HTMLElement,()=>void>();
function bindPlayerHudInteractions(hud:HTMLElement):void {
  if(hudInteractionScopes.has(hud))return;
  const tooltip=hud.querySelector<HTMLElement>("[data-hud-item-tooltip]");
  if(!tooltip)return;
  let timer:number|undefined,active:HTMLButtonElement|null=null,held=false;
  const clear=()=>{if(timer!==undefined){window.clearTimeout(timer);timer=undefined;}};
  const hide=()=>{tooltip.hidden=true;};
  const show=(button:HTMLButtonElement,item:HudItem)=>{
    const name=tooltip.querySelector<HTMLElement>("[data-tooltip-name]");
    const tier=tooltip.querySelector<HTMLElement>("[data-tooltip-tier]");
    const description=tooltip.querySelector<HTMLElement>("[data-tooltip-description]");
    if(name)name.textContent=item.label;
    if(tier)tier.textContent="TIER "+item.tier;
    if(description)description.textContent=item.description;
    tooltip.hidden=false;
    const rect=button.getBoundingClientRect();
    const width=Math.min(230,window.innerWidth-16);
    tooltip.style.left=Math.max(8,Math.min(window.innerWidth-width-8,rect.left))+"px";
    tooltip.style.top=Math.max(8,rect.top-tooltip.offsetHeight-8)+"px";
  };
  const down=(event:PointerEvent)=>{
    const button=(event.target instanceof Element?event.target.closest<HTMLButtonElement>("[data-hud-item-id]"):null);
    if(!button||event.pointerType==="mouse"&&event.button!==0)return;
    const item=TEST_ITEMS.find(candidate=>candidate.id===button.dataset.hudItemId);
    if(!item)return;
    clear();active=button;held=false;
    timer=window.setTimeout(()=>{if(active!==button)return;held=true;show(button,item);},420);
  };
  const up=()=>{
    clear();
    if(held&&active){active.dataset.skipNextClick="true";hide();}
    active=null;held=false;
  };
  hud.addEventListener("pointerdown",down);
  hud.addEventListener("pointerup",up);
  hud.addEventListener("pointercancel",up);
  hud.addEventListener("pointerleave",up);
  hud.addEventListener("contextmenu",event=>{if((event.target as Element|null)?.closest("[data-hud-item-id]"))event.preventDefault();});
  hudInteractionScopes.set(hud,()=>{clear();hide();hud.removeEventListener("pointerdown",down);hud.removeEventListener("pointerup",up);hud.removeEventListener("pointercancel",up);hud.removeEventListener("pointerleave",up);});
}
const scrollResizeScopes=new WeakSet<HTMLElement>();
export function bindScrollableResizableWindows(root:HTMLElement):void {
  const selector='[data-wmh-scroll-resize],[role="dialog"]:not(.wmh-chat-panel):not(.wmh-transition-dialog):not(.wmh-transition-notice):not([data-wmh-dialog]),.wmh-hud-drawer,.wmh-minimap-window,.wmh-inventory-window,.wmh-chat-card,.wmh-transition-dialog-card,.wmh-transition-notice-card,.wmh-academy-canvas-editor,.noticeboard-panel,.preference-panel,.registry-profile,.wmh-floating-panel,.wmh-panel-window';
  const panels=[...(root.matches(selector)?[root]:[]),...Array.from(root.querySelectorAll<HTMLElement>(selector))];
  for(const panel of panels){
    if(scrollResizeScopes.has(panel))continue;
    scrollResizeScopes.add(panel);
    panel.classList.add("wmh-scroll-resize-window");
    panel.style.maxHeight="min(82dvh,720px)";
    panel.style.overflowY="auto";
    panel.style.overscrollBehavior="contain";
    panel.style.setProperty("-webkit-overflow-scrolling","touch");
    panel.style.resize="both";
    panel.style.minWidth="min(210px,82vw)";
    panel.style.minHeight="110px";
    let handle=panel.querySelector<HTMLElement>(":scope > [data-wmh-window-resize]");
    if(!handle){
      handle=document.createElement("span");
      handle.className="wmh-window-resize-handle";
      handle.dataset.wmhWindowResize="";
      handle.setAttribute("role","presentation");
      handle.setAttribute("aria-hidden","true");
      panel.append(handle);
    }
    let start:{x:number;y:number;width:number;height:number}|null=null;
    handle.addEventListener("pointerdown",event=>{
      event.preventDefault();event.stopPropagation();
      const rect=panel.getBoundingClientRect();
      start={x:event.clientX,y:event.clientY,width:rect.width,height:rect.height};
      handle!.setPointerCapture?.(event.pointerId);
    });
    handle.addEventListener("pointermove",event=>{
      if(!start)return;
      const maxWidth=Math.max(210,Math.min(window.innerWidth-16,panel.parentElement?.clientWidth||window.innerWidth-16));
      const maxHeight=Math.max(110,Math.min(window.innerHeight*.86,window.innerHeight-16));
      panel.style.width=Math.max(210,Math.min(maxWidth,start.width+event.clientX-start.x))+"px";
      panel.style.height=Math.max(110,Math.min(maxHeight,start.height+event.clientY-start.y))+"px";
    });
    const finish=()=>{start=null;};
    handle.addEventListener("pointerup",finish);
    handle.addEventListener("pointercancel",finish);
  }
}
type PlayerHudLayoutPoint={x:number;y:number;scale:number};
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
