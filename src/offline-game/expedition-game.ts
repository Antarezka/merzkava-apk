import { advanceFallbackCalendar, type SessionTimestamp } from "./mechanics/time";
import { applyDispositionEvidence, createDispositionState, type DispositionState } from "./disposition";
import { BOOTSTRAP_SITUATIONS, isSituationEligible, resolveNarrativeChoice, selectNarrativeSituation, type NarrativeContext, type NarrativeResolution, type NarrativeSituation } from "./narrative-engine";

export type EternalRegion = "golden-dragon-empire" | "tianhai-yunzhou" | "beiming-gu";
export type EternalSceneRegion = EternalRegion | "lawless-territories" | "special-locations";
export type EternalCycle = "Dawn" | "Morning" | "Day" | "Dusk" | "Night";
export type EternalWeather = "Clear" | "Cloudy" | "Fog" | "Rain" | "Snow";

export interface EternalScene {
  id: string; region: EternalSceneRegion; label: string; detail: string; image: string;
  archiveDossierId: string; sourcePath: string; universeCommit: string;
  provenance: "IN_GAME_ORIGINAL";
  note: string;
}
export const ETERNAL_SCENES: EternalScene[] = [
  { id:"gde-city", region:"golden-dragon-empire", label:"Imperial city panorama", detail:"Golden Dragon Empire · establishing view", image:"/game/scenery/golden-dragon-empire/establishing-views/gde-01-imperial-city-panorama.png", archiveDossierId:"golden-dragon", sourcePath:"world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"gde-street", region:"golden-dragon-empire", label:"Traditional city street", detail:"Golden Dragon Empire · city street", image:"/game/scenery/golden-dragon-empire/gde-02-traditional-city-street.png", archiveDossierId:"golden-dragon", sourcePath:"world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"gde-gate", region:"golden-dragon-empire", label:"Imperial city gate", detail:"Golden Dragon Empire · imperial architecture", image:"/game/scenery/golden-dragon-empire/gde-03-imperial-city-gate.png", archiveDossierId:"golden-dragon", sourcePath:"world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"gde-market", region:"golden-dragon-empire", label:"Marketplace street", detail:"Golden Dragon Empire · market atmosphere", image:"/game/scenery/golden-dragon-empire/gde-04-marketplace-street.png", archiveDossierId:"golden-dragon", sourcePath:"world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"gde-academy", region:"golden-dragon-empire", label:"Cultivation academy courtyard", detail:"Golden Dragon Empire · academy environment", image:"/game/scenery/golden-dragon-empire/gde-05-cultivation-academy-courtyard.png", archiveDossierId:"golden-dragon", sourcePath:"world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"gde-village", region:"golden-dragon-empire", label:"Rural village landscape", detail:"Golden Dragon Empire · rural landscape", image:"/game/scenery/golden-dragon-empire/gde-06-rural-village-landscape.png", archiveDossierId:"golden-dragon", sourcePath:"world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"gde-mountain", region:"golden-dragon-empire", label:"Mountain wilderness panorama", detail:"Golden Dragon Empire · mountain wilderness", image:"/game/scenery/golden-dragon-empire/gde-07-mountain-wilderness-panorama.png", archiveDossierId:"golden-dragon", sourcePath:"world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"ty-city", region:"tianhai-yunzhou", label:"Floating island city", detail:"Tianhai Yunzhou · establishing view", image:"/game/scenery/tianhai-yunzhou/ty-01-floating-island-city-panorama.png", archiveDossierId:"tianhai", sourcePath:"world/REGION_TIANHAI_YUNZHOU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"ty-skyport", region:"tianhai-yunzhou", label:"Skyport approach", detail:"Tianhai Yunzhou · airship approach", image:"/game/scenery/tianhai-yunzhou/ty-02-skyport-airship-approach.png", archiveDossierId:"tianhai", sourcePath:"world/REGION_TIANHAI_YUNZHOU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"ty-street", region:"tianhai-yunzhou", label:"Elevated city street", detail:"Tianhai Yunzhou · elevated street environment", image:"/game/scenery/tianhai-yunzhou/ty-03-elevated-city-street.png", archiveDossierId:"tianhai", sourcePath:"world/REGION_TIANHAI_YUNZHOU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"ty-market", region:"tianhai-yunzhou", label:"Market district", detail:"Tianhai Yunzhou · market environment", image:"/game/scenery/tianhai-yunzhou/ty-04-market-district-environment.png", archiveDossierId:"tianhai", sourcePath:"world/REGION_TIANHAI_YUNZHOU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"ty-academy", region:"tianhai-yunzhou", label:"Academy environment", detail:"Tianhai Yunzhou · academy environment", image:"/game/scenery/tianhai-yunzhou/ty-05-academy-environment.png", archiveDossierId:"tianhai", sourcePath:"world/REGION_TIANHAI_YUNZHOU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"ty-island-edge", region:"tianhai-yunzhou", label:"Island edge and cloud sea", detail:"Tianhai Yunzhou · island edge", image:"/game/scenery/tianhai-yunzhou/ty-06-island-edge-cloud-sea.png", archiveDossierId:"tianhai", sourcePath:"world/REGION_TIANHAI_YUNZHOU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"ty-terrace", region:"tianhai-yunzhou", label:"Residential terrace", detail:"Tianhai Yunzhou · residential environment", image:"/game/scenery/tianhai-yunzhou/ty-07-residential-terrace.png", archiveDossierId:"tianhai", sourcePath:"world/REGION_TIANHAI_YUNZHOU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"bg-north", region:"beiming-gu", label:"Northern territory panorama", detail:"Beiming Gu · northern landscape", image:"/game/scenery/beiming-gu/bg-01-northern-territory-panorama.png", archiveDossierId:"beiming", sourcePath:"world/REGION_BEIMING_GU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"bg-settlement", region:"beiming-gu", label:"Snowbound settlement", detail:"Beiming Gu · settlement atmosphere", image:"/game/scenery/beiming-gu/bg-02-snowbound-settlement.png", archiveDossierId:"beiming", sourcePath:"world/REGION_BEIMING_GU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"bg-tiger-habitat", region:"beiming-gu", label:"Blue-Flame Silver Tiger habitat", detail:"Beiming Gu · wilderness habitat visual", image:"/game/scenery/beiming-gu/bg-03-blue-flame-silver-tiger-habitat.png", archiveDossierId:"beiming", sourcePath:"world/REGION_BEIMING_GU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"bg-mining", region:"beiming-gu", label:"Rare-metal mining landscape", detail:"Beiming Gu · mining landscape", image:"/game/scenery/beiming-gu/bg-04-rare-metal-mining-landscape.png", archiveDossierId:"beiming", sourcePath:"world/REGION_BEIMING_GU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"bg-pass", region:"beiming-gu", label:"Northern mountain pass", detail:"Beiming Gu · mountain pass", image:"/game/scenery/beiming-gu/bg-05-northern-mountain-pass.png", archiveDossierId:"beiming", sourcePath:"world/REGION_BEIMING_GU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"bg-hall", region:"beiming-gu", label:"Beiming Gu grand hall", detail:"Beiming Gu · architectural environment", image:"/game/scenery/beiming-gu/bg-06-beiming-gu-grand-hall.png", archiveDossierId:"beiming", sourcePath:"world/REGION_BEIMING_GU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"bg-lake", region:"beiming-gu", label:"Frozen lake and river", detail:"Beiming Gu · frozen waterway", image:"/game/scenery/beiming-gu/bg-07-frozen-lake-river.png", archiveDossierId:"beiming", sourcePath:"world/REGION_BEIMING_GU.md", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Visual composition for Eternal Path; does not assert a more specific canon settlement than the source dossier supports." },
  { id:"lt-wilderness", region:"lawless-territories", label:"Lawless territory wilderness", detail:"Lawless Territories · broad wilderness visual", image:"/game/scenery/lawless-territories/lt-01-lawless-territory-wilderness.png", archiveDossierId:"on-plan", sourcePath:"UNVERIFIED: broad visual category; confirm Archive source before naming a location", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Broad visual category only; not a verified named canon location. Keep IN_GAME_ORIGINAL until Archive provenance is reviewed." },
  { id:"lt-port", region:"lawless-territories", label:"Southern port and isles", detail:"Lawless Territories · southern coastal visual", image:"/game/scenery/lawless-territories/lt-02-southern-port-isles.png", archiveDossierId:"on-plan", sourcePath:"UNVERIFIED: broad visual category; confirm Archive source before naming a location", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Broad visual category only; not a verified named canon location. Keep IN_GAME_ORIGINAL until Archive provenance is reviewed." },
  { id:"az-boundary", region:"special-locations", label:"Azerion illusion-fog boundary", detail:"Special location · Azerion outer approach", image:"/game/scenery/special-locations/az-01-azerion-illusion-fog-boundary.png", archiveDossierId:"on-plan", sourcePath:"UNVERIFIED: visual asset only; validate exact Archive dossier and source path", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Broad visual category only; not a verified named canon location. Keep IN_GAME_ORIGINAL until Archive provenance is reviewed." },
  { id:"az-lake", region:"special-locations", label:"Azerion great lake", detail:"Special location · Azerion lake environment", image:"/game/scenery/special-locations/az-02-azerion-great-lake.png", archiveDossierId:"on-plan", sourcePath:"UNVERIFIED: visual asset only; validate exact Archive dossier and source path", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Broad visual category only; not a verified named canon location. Keep IN_GAME_ORIGINAL until Archive provenance is reviewed." },
  { id:"ra-outpost", region:"special-locations", label:"Ruined Archiver outpost", detail:"Special location · field outpost environment", image:"/game/scenery/special-locations/ra-01-ruined-archiver-outpost.png", archiveDossierId:"on-plan", sourcePath:"UNVERIFIED: visual asset only; validate exact Archive dossier and source path", universeCommit:"2f76a864150528afb0e3d26cb16f9396ce610ff6", provenance:"IN_GAME_ORIGINAL", note:"Broad visual category only; not a verified named canon location. Keep IN_GAME_ORIGINAL until Archive provenance is reviewed." },
];

/**
 * The generated 240-entry 0.1.0 dialogue sequence has been retired.
 * Story content is intentionally unavailable until the reviewed Patch-1 event system ships.
 * These types remain only as a compatibility boundary; no legacy nodes are shipped.
 */
export interface EternalChoice { label: string; response: string; effects: { energy: number; insight: number; bonds: number }; minutes: number; }
export interface EternalDialogue {
  id: string; contentId:string; contentType:"dialogue"; reviewStatus:"APPROVED"; packageVersion:"0.1.0"; summary:string;
  title: string; sceneId: string; chapter: string; speaker: string;
  text: string; provenance: "IN_GAME_ORIGINAL"; originalityNote: string;
  sourceRefs: {archiveDossierId:string;universeRepository:string;universeCommit:string;sourcePath:string}[];
  choices: [EternalChoice, EternalChoice];
}
/** Legacy event counters remain in old saves for migration compatibility but are ignored by the retired story runtime. */
export interface EternalNarrativeRecord { nodeId:string; choiceId:string; day:number; transactionId:string; outcomeText:string; }
export interface EternalSave {
  schemaVersion:4; saveId:string; saveName:string; createdAt:string; updatedAt:string;
  manifest:{universeRepository:string;universeCommit:string;contentPackVersion:string;deterministicSeed:string};
  character:{name:string;age:number;region:EternalRegion}; disposition:DispositionState;
  /** Stable world location. */
  locationId:string;
  day:number; hour:number; minute:number; weather:EternalWeather;
  eventIndex:number; energy:number; insight:number; bonds:number; completed:number;
  narrativeHistory:EternalNarrativeRecord[]; activeNodeId:string|null; lastOutcome:string;
}
export interface EternalSaveSummary {
  id:string; name:string; characterName:string; region:EternalRegion; day:number; updatedAt:string; active:boolean;
}
interface EternalSaveSlot { id:string; name:string; createdAt:string; updatedAt:string; save:EternalSave; }
const SAVE_KEY = "merzkava-eternal-path-save-v1";
const SAVE_SLOTS_KEY = "merzkava-eternal-path-saves-v1";
const ACTIVE_SAVE_KEY = "merzkava-eternal-path-active-v1";
let save: EternalSave | null = null;
const memorySaveStorage=new Map<string,string>();
function storageGet(key:string):string|null {
  try { if(typeof globalThis.localStorage!=="undefined") return globalThis.localStorage.getItem(key); } catch {/* use in-memory fallback */}
  return memorySaveStorage.get(key)??null;
}
function storageSet(key:string,value:string):void {
  try { if(typeof globalThis.localStorage!=="undefined"){globalThis.localStorage.setItem(key,value);return;} } catch {/* use in-memory fallback */}
  memorySaveStorage.set(key,value);
}
function storageRemove(key:string):void {
  try { if(typeof globalThis.localStorage!=="undefined"){globalThis.localStorage.removeItem(key);memorySaveStorage.delete(key);return;} } catch {/* use in-memory fallback */}
  memorySaveStorage.delete(key);
}
function defaultSceneForRegion(region:EternalRegion):EternalScene {
  return ETERNAL_SCENES.find(scene=>scene.region===region) ?? ETERNAL_SCENES[0];
}
function resolveDailyWeather(region:EternalRegion,day:number):EternalWeather {
  const regionalWeather:Record<EternalRegion,EternalWeather[]> = {
    "golden-dragon-empire":["Clear","Cloudy","Clear","Rain","Cloudy","Clear","Fog"],
    "tianhai-yunzhou":["Cloudy","Clear","Fog","Rain","Clear","Cloudy"],
    "beiming-gu":["Snow","Cloudy","Snow","Clear","Fog","Snow"],
  };
  const pattern=regionalWeather[region];
  return pattern[Math.max(0,day-1)%pattern.length];
}
function makeSaveId():string {
  const random=globalThis.crypto?.randomUUID?.().replace(/-/g,"").slice(0,12);
  return "journey-"+(random||Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8));
}
function readSlots():EternalSaveSlot[] {
  try {
    const value=JSON.parse(storageGet(SAVE_SLOTS_KEY)??"[]");
    return Array.isArray(value)?value.filter((item):item is EternalSaveSlot=>Boolean(item&&typeof item.id==="string"&&item.save&&typeof item.save==="object")):[];
  } catch { return []; }
}
function writeSlots(slots:EternalSaveSlot[]):void {
  storageSet(SAVE_SLOTS_KEY,JSON.stringify(slots));
}
function normalizeSave(value:unknown):EternalSave|null {
  if(!value||typeof value!=="object") return null;
  const parsed=value as Partial<EternalSave>&{schemaVersion?:number;character?:EternalSave["character"]};
  if(![1,2,3,4].includes(Number(parsed.schemaVersion))||!parsed.character?.name||!Number.isInteger(parsed.eventIndex)||Number(parsed.eventIndex)<0) return null;
  const region=["golden-dragon-empire","tianhai-yunzhou","beiming-gu"].includes(parsed.character.region)?parsed.character.region:"golden-dragon-empire";
  const locationId=typeof parsed.locationId==="string"&&ETERNAL_SCENES.some(scene=>scene.id===parsed.locationId)?parsed.locationId:defaultSceneForRegion(region).id;
  const now=new Date().toISOString();
  const saveId=typeof parsed.saveId==="string"&&parsed.saveId.length<=80?parsed.saveId:makeSaveId();
  const candidate=parsed.manifest as Partial<EternalSave["manifest"]>|undefined;
  const manifest:EternalSave["manifest"]={
    universeRepository:candidate?.universeRepository==="Antarezka/merzkava-universe"?candidate.universeRepository:"Antarezka/merzkava-universe",
    universeCommit:typeof candidate?.universeCommit==="string"&&/^[a-f0-9]{40}$/i.test(candidate.universeCommit)?candidate.universeCommit:ETERNAL_SCENES[0].universeCommit,
    contentPackVersion:typeof candidate?.contentPackVersion==="string"&&candidate.contentPackVersion.length<=32?candidate.contentPackVersion:"eternal-path-bootstrap-0.1.0",
    deterministicSeed:typeof candidate?.deterministicSeed==="string"&&candidate.deterministicSeed.length<=128?candidate.deterministicSeed:saveId,
  };
  const age=Number.isInteger(parsed.character.age)&&parsed.character.age>=1&&parsed.character.age<=120?parsed.character.age:14;
  return {
    ...parsed,schemaVersion:4,saveId,manifest,
    saveName:typeof parsed.saveName==="string"&&parsed.saveName.trim()?parsed.saveName.trim().slice(0,48):parsed.character.name.trim().slice(0,48),
    createdAt:typeof parsed.createdAt==="string"?parsed.createdAt:now,updatedAt:typeof parsed.updatedAt==="string"?parsed.updatedAt:now,
    character:{name:parsed.character.name.trim().slice(0,32),age,region},
    disposition:createDispositionState(parsed.disposition),locationId,
    day:Number.isInteger(parsed.day)&&Number(parsed.day)>0?Number(parsed.day):1,
    hour:Number.isInteger(parsed.hour)&&Number(parsed.hour)>=0&&Number(parsed.hour)<24?Number(parsed.hour):8,
    minute:Number.isInteger(parsed.minute)&&Number(parsed.minute)>=0&&Number(parsed.minute)<60?Number(parsed.minute):0,
    weather:resolveDailyWeather(region,Number(parsed.day)||1),
    eventIndex:Number(parsed.eventIndex)||0,energy:Math.max(0,Math.min(100,Number(parsed.energy)||0)),insight:Math.max(0,Number(parsed.insight)||0),bonds:Math.max(0,Number(parsed.bonds)||0),completed:Math.max(0,Number(parsed.completed)||0),
    narrativeHistory:Array.isArray((parsed as any).narrativeHistory)?(parsed as any).narrativeHistory.filter((item:any)=>item&&typeof item.nodeId==="string"&&typeof item.choiceId==="string"&&typeof item.transactionId==="string").slice(-500):[],
    activeNodeId:typeof (parsed as any).activeNodeId==="string"&&(BOOTSTRAP_SITUATIONS.some(node=>node.id===(parsed as any).activeNodeId))?(parsed as any).activeNodeId:null,
    lastOutcome:typeof (parsed as any).lastOutcome==="string"?(parsed as any).lastOutcome.slice(0,1200):"",
  } as EternalSave;
}
function ensureLegacyMigration():EternalSaveSlot[] {
  const slots=readSlots();
  if(slots.length) return slots;
  try {
    const raw=storageGet(SAVE_KEY);
    if(!raw) return slots;
    const migrated=normalizeSave(JSON.parse(raw));
    if(!migrated) return slots;
    const slot:EternalSaveSlot={id:migrated.saveId,name:migrated.saveName,createdAt:migrated.createdAt,updatedAt:migrated.updatedAt,save:migrated};
    writeSlots([slot]);storageSet(ACTIVE_SAVE_KEY,slot.id);storageSet(SAVE_KEY,JSON.stringify(migrated));
    return [slot];
  } catch { return slots; }
}
function currentWorldRegion(current:EternalSave|null=getEternalSave()):EternalRegion {
  const location=ETERNAL_SCENES.find(scene=>scene.id===current?.locationId);
  const region=location?.region;
  return region==="golden-dragon-empire"||region==="tianhai-yunzhou"||region==="beiming-gu" ? region : current?.character.region ?? "golden-dragon-empire";
}
function persist():void {
  if(!save) return;
  const now=new Date().toISOString();save.updatedAt=now;
  const slots=ensureLegacyMigration();
  const index=slots.findIndex(slot=>slot.id===save!.saveId);
  const record:EternalSaveSlot={id:save.saveId,name:save.saveName,createdAt:save.createdAt,updatedAt:now,save};
  if(index>=0) slots[index]=record; else slots.push(record);
  writeSlots(slots);storageSet(ACTIVE_SAVE_KEY,save.saveId);storageSet(SAVE_KEY,JSON.stringify(save));
}
function readActiveSave():EternalSave|null {
  const slots=ensureLegacyMigration();let activeId="";
  try{activeId=storageGet(ACTIVE_SAVE_KEY)??"";}catch{return null;}
  const slot=slots.find(item=>item.id===activeId);return slot?normalizeSave(slot.save):null;
}
export function getEternalSave():EternalSave|null {
  if(save===null) save=readActiveSave();
  return save;
}
export function listEternalSaves():EternalSaveSummary[] {
  const slots=ensureLegacyMigration();const activeId=(()=>{try{return storageGet(ACTIVE_SAVE_KEY)??"";}catch{return "";}})();
  return slots.map(slot=>{const state=normalizeSave(slot.save);return state?{id:slot.id,name:slot.name,characterName:state.character.name,region:state.character.region,day:state.day,updatedAt:slot.updatedAt,active:slot.id===activeId}:null;}).filter((item):item is EternalSaveSummary=>item!==null).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
}
export function startEternalGame(input:{name:string;age:number;region:EternalRegion}):void {
  const now=new Date().toISOString();const id=makeSaveId();
  save={schemaVersion:4,saveId:id,saveName:input.name.trim(),createdAt:now,updatedAt:now,manifest:{universeRepository:"Antarezka/merzkava-universe",universeCommit:ETERNAL_SCENES[0].universeCommit,contentPackVersion:"eternal-path-bootstrap-0.1.0",deterministicSeed:id},character:{name:input.name.trim(),age:input.age,region:input.region},disposition:createDispositionState(),locationId:defaultSceneForRegion(input.region).id,day:1,hour:8,minute:0,weather:resolveDailyWeather(input.region,1),eventIndex:0,energy:100,insight:0,bonds:0,completed:0,narrativeHistory:[],activeNodeId:null,lastOutcome:""};
  persist();
}
export function loadEternalSave(id:string):boolean {
  const slot=ensureLegacyMigration().find(item=>item.id===id);const next=slot?normalizeSave(slot.save):null;
  if(!next) return false;
  save=next;persist();return true;
}
export function unloadEternalGame():void {
  save=null;try{storageRemove(ACTIVE_SAVE_KEY);storageRemove(SAVE_KEY);}catch{/* no-op */}
}
export function renameEternalSave(id:string,name:string):boolean {
  const nextName=name.trim();if(nextName.length<2||nextName.length>48) return false;
  const slots=ensureLegacyMigration();const slot=slots.find(item=>item.id===id);if(!slot) return false;
  slot.name=nextName;slot.save.saveName=nextName;slot.updatedAt=new Date().toISOString();
  if(save?.saveId===id){save.saveName=nextName;save.updatedAt=slot.updatedAt;storageSet(SAVE_KEY,JSON.stringify(save));}
  writeSlots(slots);return true;
}
export function deleteEternalSave(id:string):boolean {
  const slots=ensureLegacyMigration();const next=slots.filter(item=>item.id!==id);if(next.length===slots.length) return false;
  writeSlots(next);
  if(save?.saveId===id) save=null;
  try{if(storageGet(ACTIVE_SAVE_KEY)===id){storageRemove(ACTIVE_SAVE_KEY);storageRemove(SAVE_KEY);}}catch{/* no-op */}
  return true;
}
export function exportEternalSave(id:string):string|null {
  const slot=ensureLegacyMigration().find(item=>item.id===id);if(!slot) return null;
  return JSON.stringify({format:"MERZKAVA_ETERNAL_PATH_SAVE",formatVersion:1,exportedAt:new Date().toISOString(),save:slot.save},null,2);
}
export function importEternalSave(raw:string):string {
  const parsed=JSON.parse(raw) as {format?:string;formatVersion?:number;save?:unknown};
  if(parsed.format!=="MERZKAVA_ETERNAL_PATH_SAVE"||parsed.formatVersion!==1) throw new Error("Format backup Eternal Path tidak dikenali.");
  const imported=normalizeSave(parsed.save);if(!imported) throw new Error("Data perjalanan tidak lengkap atau rusak.");
  const now=new Date().toISOString();imported.saveId=makeSaveId();imported.saveName=imported.saveName+" (Imported)";imported.createdAt=now;imported.updatedAt=now;
  save=imported;persist();return imported.saveId;
}
export function resetEternalGame():void {
  save=null;try{storageRemove(SAVE_KEY);storageRemove(SAVE_SLOTS_KEY);storageRemove(ACTIVE_SAVE_KEY);}catch{/* no-op */}
}
function buildNarrativeContext(current:EternalSave):NarrativeContext {
  const region=currentWorldRegion(current);
  return {saveId:current.saveId,seed:current.manifest.deterministicSeed,characterName:current.character.name,age:current.character.age,region,
    locationId:current.locationId,day:current.day,hour:current.hour,minute:current.minute,weather:current.weather,
    disposition:current.disposition,completedNodeIds:current.narrativeHistory.map(item=>item.nodeId),sequence:current.eventIndex};
}
/** Returns the saved active situation, or deterministically selects and persists the next eligible one. */
export function getCurrentSituation():NarrativeSituation|null {
  const current=getEternalSave();if(!current)return null;
  if(current.activeNodeId){
    const active=BOOTSTRAP_SITUATIONS.find(node=>node.id===current.activeNodeId);
    if(active&&isSituationEligible(active,buildNarrativeContext(current)))return active;
    current.activeNodeId=null;
  }
  const selected=selectNarrativeSituation(buildNarrativeContext(current));
  if(!selected){persist();return null;}
  current.activeNodeId=selected.id;persist();return selected;
}
export function getRegionalDialogueCount():number {
  const current=getEternalSave();if(!current)return 0;
  return BOOTSTRAP_SITUATIONS.filter(node=>node.eligibility.regions.includes(currentWorldRegion(current))).length;
}
/** Compatibility alias for the former dialogue view; now returns the current typed situation node. */
export function getCurrentDialogue():NarrativeSituation|null { return getCurrentSituation(); }
/** Resolves one visible player choice exactly once and records its deterministic transaction in this journey. */
export function resolveEternalSituationChoice(choiceId:string):NarrativeResolution|null {
  const current=getEternalSave();if(!current)return null;
  const node=getCurrentSituation();if(!node)return null;
  const context=buildNarrativeContext(current);
  const resolution=resolveNarrativeChoice(node,choiceId,context);if(!resolution)return null;
  if(current.narrativeHistory.some(item=>item.transactionId===resolution.transactionId))return null;
  if(!Number.isSafeInteger(resolution.minutes)||resolution.minutes<=0)return null;
  const timestamp:SessionTimestamp={year:0,month:1,day:current.day,hour:current.hour,minute:current.minute,weekdayIndex:0};
  const advanced=advanceFallbackCalendar(timestamp,resolution.minutes);
  if(!advanced.valid)return null;
  const previousDay=current.day;
  current.energy=Math.max(0,Math.min(100,current.energy+resolution.energyDelta));
  current.insight=Math.max(0,current.insight+resolution.insightDelta);
  if(resolution.dispositionEvidence)current.disposition=applyDispositionEvidence(current.disposition,resolution.dispositionEvidence,current.day);
  current.narrativeHistory.push({nodeId:resolution.nodeId,choiceId:resolution.choiceId,day:current.day,transactionId:resolution.transactionId,outcomeText:resolution.outcomeText});
  current.narrativeHistory=current.narrativeHistory.slice(-500);
  current.day=advanced.result.timestamp.day;current.hour=advanced.result.timestamp.hour;current.minute=advanced.result.timestamp.minute;
  if(current.day!==previousDay)current.weather=resolveDailyWeather(currentWorldRegion(current),current.day);
  current.lastOutcome=resolution.outcomeText;current.activeNodeId=null;current.eventIndex+=1;current.completed+=1;
  // One save write commits the choice, consequences, event record and world-time advance together.
  persist();
  return resolution;
}
/** Legacy numeric choices are intentionally rejected; retired nodes cannot mutate a journey. */
export function chooseEternalOption(_index:number):void {}
/**
 * Advances the authoritative local world clock. Activities, travel, rest and other
 * world systems call this API; scene presentation never reads dialogue metadata.
 */
export function advanceEternalWorldTime(minutes:number):void {
  const current=getEternalSave();
  // The caller must validate each underlying action with the official duration rules first.
  if(!current || !Number.isSafeInteger(minutes) || minutes<=0) return;
  const timestamp:SessionTimestamp={year:0,month:1,day:current.day,hour:current.hour,minute:current.minute,weekdayIndex:0};
  const advanced=advanceFallbackCalendar(timestamp,Math.floor(minutes));
  if(!advanced.valid) return;
  const previousDay=current.day;
  current.day=advanced.result.timestamp.day;
  current.hour=advanced.result.timestamp.hour;
  current.minute=advanced.result.timestamp.minute;
  if(current.day!==previousDay) current.weather=resolveDailyWeather(currentWorldRegion(current),current.day);
  persist();
}

/** Called by the future travel/location system after a valid world movement. */
export function setEternalLocation(sceneId:string):void {
  const current=getEternalSave();
  const destination=ETERNAL_SCENES.find(scene=>scene.id===sceneId);
  if(!current || !destination) return;
  current.locationId=destination.id;
  const weatherRegion=destination.region==="golden-dragon-empire"||destination.region==="tianhai-yunzhou"||destination.region==="beiming-gu" ? destination.region : current.character.region;
  current.weather=resolveDailyWeather(weatherRegion,current.day);
  persist();
}

export function getExpeditionScene(): EternalScene {
  const current=getEternalSave();
  const savedLocation=current?.locationId;
  return ETERNAL_SCENES.find(scene=>scene.id===savedLocation) ??
    defaultSceneForRegion(current?.character.region ?? "golden-dragon-empire");
}
export function getExpeditionAtmosphere(): {cycle:EternalCycle;weather:EternalWeather;fog:number} {
  const current=getEternalSave();
  const minute=(current?.hour ?? 8)*60+(current?.minute ?? 0);
  const cycle:EternalCycle=minute<5*60?"Night":minute<7*60?"Dawn":minute<11*60?"Morning":minute<17*60?"Day":minute<20*60?"Dusk":"Night";
  const weather=current?.weather ?? resolveDailyWeather("golden-dragon-empire",1);
  const region=getExpeditionScene().region;
  const regionalFog=region==="beiming-gu"?0.25:region==="tianhai-yunzhou"?0.16:0.2;
  const fog=weather==="Fog"?Math.min(0.55,regionalFog+0.2):weather==="Snow"?0.12:weather==="Rain"?0.18:regionalFog;
  return {cycle,weather,fog};
}
