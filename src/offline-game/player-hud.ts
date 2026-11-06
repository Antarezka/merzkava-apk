import { animate, createScope } from "animejs";
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
  return '<section class="wmh-player-hud" data-wmh-player-hud aria-label="Player field status"><header class="wmh-player-hud-header"><span class="wmh-player-crest" aria-hidden="true">✦</span><div class="wmh-player-id"><small>WORLD ATLAS · PLAYER</small><strong data-hud-character-name>'+esc(name)+'</strong><em>PREVIEW PROFILE · NOT CANON STATE</em></div><div class="wmh-player-realm"><small>SPIRIT REALM</small><b>MORTAL</b></div></header>'+
    '<div class="wmh-player-vitals">'+meterMarkup("HP",state.hp,state.maxHp,"hp")+meterMarkup("SATIETY",state.satiety,100,"satiety")+'</div>'+
    '<div class="wmh-player-affiliation"><span><small>AFFILIATION</small><b>NOT LINKED</b></span><em>Clan · Sect · Trade Guild · Assassin Guild · Empire Unit</em></div>'+
    '<div class="wmh-player-hud-actions"><button type="button" data-hud-action="open-panel" data-hud-panel-open="quests">✦ QUEST BOARD <small>MAIN / SIDE</small></button><button type="button" data-hud-action="open-panel" data-hud-panel-open="social">◎ SOCIAL LINKS <small>RELATIONSHIPS</small></button><button type="button" data-hud-action="advance-hour">SIMULATE 1H <small>AWAKE · LIGHT</small></button></div>'+
    '<small class="wmh-player-hud-feedback" data-hud-feedback aria-live="polite">Preview data. Satiety formula is active; inventory and profile bindings are placeholders.</small>'+
    '<section class="wmh-hud-drawer" data-hud-panel="quests" hidden role="dialog" aria-label="Quest board placeholder"><header><b>QUEST BOARD</b><button type="button" data-hud-action="close-panels" aria-label="Close quest board">×</button></header><article class="wmh-quest-preview"><small>MAIN QUEST · NOT CONNECTED</small><strong>Awaiting a verified world objective</strong><p>The quest resolver and recorded objectives are not wired into this field HUD yet.</p></article><article class="wmh-quest-preview"><small>SIDE QUEST · NOT CONNECTED</small><strong>No recorded side objective</strong><p>Quest rewards and time costs remain inactive placeholders.</p></article></section>'+
    '<section class="wmh-hud-drawer wmh-social-drawer" data-hud-panel="social" hidden role="dialog" aria-label="Social links placeholder"><header><b>SOCIAL LINKS</b><button type="button" data-hud-action="close-panels" aria-label="Close social links">×</button></header><p class="wmh-social-intro">PERSONA-INSPIRED RELATIONSHIP BOARD · PREVIEW ONLY</p>'+
    '<div class="wmh-social-card"><span>01</span><div><b>NEARBY NPC</b><small>RELATIONSHIP UNINITIALIZED</small></div><meter min="0" max="100" value="0"></meter></div><div class="wmh-social-card"><span>02</span><div><b>KNOWN CONTACT</b><small>NO RECORDED SOCIAL LINK</small></div><meter min="0" max="100" value="0"></meter></div><div class="wmh-social-card"><span>03</span><div><b>FACTION CONTACT</b><small>NO AFFILIATION BINDING</small></div><meter min="0" max="100" value="0"></meter></div><small class="wmh-social-foot">No disposition, bond or NPC agenda is changed by this preview.</small></section>'+
    '<section class="wmh-player-dock" aria-label="Combat and inventory quick slots"><div class="wmh-skill-dock"><header><b>TACTICAL SKILLS</b><small>TURN-BASED · TIME ORDER NOT CONNECTED</small></header><div class="wmh-skill-slots">'+skillMarkup+'</div></div><div class="wmh-inventory-dock"><header><b>INVENTORY · TEST ITEMS</b><small>NON-CANON FIXTURE · ×999</small></header><div class="wmh-inventory-slots">'+items+'</div></div></section></section>';
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
const motionScopes=new WeakMap<HTMLElement,{revert:()=>void}>();
export function mountPlayerHudMotion(root:HTMLElement):void {
  const hud=root.matches("[data-wmh-player-hud]")?root:root.querySelector<HTMLElement>("[data-wmh-player-hud]");
  if(!hud||motionScopes.has(hud)||(typeof window!=="undefined"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches))return;
  const scope=createScope({root:hud,mediaQueries:{reduceMotion:"(prefers-reduced-motion: reduce)"}}).add(self=>{
    if(!self||self.matches.reduceMotion)return;
    hud.querySelectorAll<HTMLElement>("[data-hud-ring]").forEach((ring,index)=>{
      const inner=ring.querySelector<HTMLElement>("[data-hud-ring-inner]");
      animate(ring,{rotate:360,duration:34000+index*4200,ease:"linear",loop:true});
      if(inner)animate(inner,{rotate:-360,duration:26000+index*3600,ease:"linear",loop:true});
    });
  });
  motionScopes.set(hud,scope);
}
export function disposePlayerHudMotion(root:HTMLElement):void {
  const hud=root.matches("[data-wmh-player-hud]")?root:root.querySelector<HTMLElement>("[data-wmh-player-hud]");
  if(!hud)return;
  motionScopes.get(hud)?.revert();motionScopes.delete(hud);
}
