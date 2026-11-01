import { advanceFallbackCalendar, type SessionTimestamp } from "./mechanics/time";
import { createDispositionState, type DispositionState } from "./disposition";

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

export interface EternalChoice { label: string; response: string; effects: { energy: number; insight: number; bonds: number }; minutes: number; }
export interface EternalDialogue {
  id: string; contentId:string; contentType:"dialogue"; reviewStatus:"APPROVED"; packageVersion:"0.1.0"; summary:string;
  title: string; sceneId: string; chapter: string; speaker: string;
  text: string; provenance: "IN_GAME_ORIGINAL"; originalityNote: string;
  sourceRefs: {archiveDossierId:string;universeRepository:string;universeCommit:string;sourcePath:string}[];
  choices: [EternalChoice, EternalChoice];
}
const chapters = [
  { name:"A quiet beginning", speaker:"A passerby", prompts:["A vendor pauses while arranging the morning display.","A familiar sound drifts between the nearby rooftops.","Someone nearby seems to be waiting for the right moment to speak.","A small commotion draws a few curious glances.","The ordinary rhythm of the day briefly changes."], subjects:["A dropped parcel rests beside the walkway.","A hand-written notice has come loose from its board.","A tired traveller studies the route ahead.","A young apprentice struggles with a simple task.","Two neighbours disagree over a minor inconvenience."] },
  { name:"People of the district", speaker:"A local resident", prompts:["The conversation begins cautiously, then grows warmer.","A resident notices that you have stopped to listen.","The person beside you leaves room for an honest answer.","A passing remark opens a more thoughtful conversation.","A stranger offers a greeting without asking for anything."], subjects:["They ask what brought you to this part of the region.","They mention how different people spend an ordinary day.","They wonder whether you prefer to observe or take part.","They share a small concern about the day ahead.","They ask what kind of skill you hope to develop."] },
  { name:"A useful errand", speaker:"A shopkeeper", prompts:["A practical request is made without ceremony.","The shopkeeper checks a short list and looks up.","A simple task could save someone a little time.","The district is busy, but one small matter remains unattended.","A request is offered with no promise of reward."], subjects:["A bundle needs to be carried a short distance.","A customer is unsure which public route to take.","A few goods need to be sorted before the next rush.","A message must reach a nearby public counter.","A visitor needs help understanding a posted notice."] },
  { name:"Learning by watching", speaker:"An instructor", prompts:["An instructor demonstrates a basic principle to a small group.","A careful explanation is repeated for anyone who missed it.","The lesson is practical rather than impressive.","A learner makes a mistake and is invited to try again.","The instructor asks the group to notice one small detail."], subjects:["The exercise is about patience and controlled movement.","The example shows why preparation matters.","The lesson rewards careful observation over speed.","The instructor explains how practice becomes habit.","A question about safe training is raised."] },
  { name:"A moment of uncertainty", speaker:"A concerned local", prompts:["The mood changes when an uncertain report is mentioned.","A few people exchange looks before anyone answers.","The situation is unclear, and nobody claims otherwise.","A cautious request for help reaches the edge of the crowd.","The first account sounds incomplete, so details matter."], subjects:["A traveller has not returned at the expected time.","A route marker appears to have been moved.","Someone heard a noise but cannot identify its source.","A supply list does not match the delivered bundles.","A neighbour is worried about a missing personal belonging."] },
  { name:"Evening reflection", speaker:"A travelling companion", prompts:["The day slows, leaving room to consider what happened.","The last light settles over the surrounding rooftops.","A companion asks what you learned from the day.","The conversation becomes quieter as people head home.","There is time to choose what deserves attention tomorrow."], subjects:["A small kindness may matter more than it first seemed.","A difficult moment revealed where patience is needed.","An unfinished task can wait until there is enough light.","A new acquaintance may become a useful contact.","Rest is also part of a life lived with intention."] },
];
const sceneOpeners: Record<string,string> = {
  "gde-city":"The imperial-city panorama stretches beyond the immediate street, its roofs and distant walls softened by the atmosphere.",
  "gde-street":"The traditional street carries the sound of footsteps, vendors, and ordinary conversations.",
  "gde-market":"The marketplace is filled with movement, measured bargaining, and the scent of freshly prepared food.",
  "gde-village":"The rural landscape feels less hurried; small tasks shape the rhythm of the settlement.",
  "ty-city":"The floating-island city opens into layered terraces above the surrounding sea and cloud.",
  "ty-skyport":"The skyport approach is busy with arrivals, departures, and careful movement around the landing area.",
  "bg-north":"The northern landscape feels broad and cold, with distant ridges shaping the horizon.",
  "bg-settlement":"The snowbound settlement moves at a deliberate pace, with warmth and shelter on everyone's mind.",
  "gde-gate":"The imperial gate rises above the approach, framing the movement of people entering and leaving the city.",
  "gde-academy":"The academy courtyard offers an orderly space for instruction and practice.",
  "gde-mountain":"Mountain ridges and open wilderness shape a broad, quiet horizon.",
  "ty-street":"Elevated streets connect the layered city above the sea.",
  "ty-market":"The market district sits among the floating city's terraces and public routes.",
  "ty-academy":"The academy environment reflects Tianhai's culture of study and disciplined practice.",
  "ty-island-edge":"The island edge opens toward the surrounding sea and drifting cloud layers.",
  "ty-terrace":"Residential terraces overlook the layered architecture of the floating city.",
  "bg-tiger-habitat":"The northern wilderness provides a remote habitat framed by cold terrain.",
  "bg-mining":"The mining landscape shows the region's work around rare-metal resources.",
  "bg-pass":"A mountain pass cuts through the northern ridges.",
  "bg-hall":"The grand hall presents a formal architectural environment in Beiming Gu.",
  "bg-lake":"Frozen water and the surrounding banks define this northern landscape.",
  "lt-wilderness":"A broad wilderness scene for the lawless territories; exact place identity remains unassigned.",
  "lt-port":"A southern coastal and port-isles environment; exact place identity remains unassigned.",
  "az-boundary":"The approach to Azerion is obscured by its illusion-fog boundary.",
  "az-lake":"A vast lake forms part of Azerion's distinctive hidden environment.",
  "ra-outpost":"A field outpost represents the Ruined Archiver's independent expedition presence.",
};
const variations = [
  { suffix:"Listen first", first:"You take a moment to understand the situation before responding.", second:"You step forward and offer a practical hand." },
  { suffix:"Ask a question", first:"You ask for one more detail rather than assuming what happened.", second:"You share what you have noticed and invite the other person to compare details." },
  { suffix:"Offer help", first:"You offer help within your ability and keep the task modest.", second:"You suggest a safer or more orderly way to handle the matter." },
  { suffix:"Practice patience", first:"You remain patient and let the other person finish explaining.", second:"You volunteer to demonstrate the task slowly and clearly." },
  { suffix:"Make a careful choice", first:"You choose the least risky next step and observe the result.", second:"You bring the nearby people into the decision instead of acting alone." },
];
// Narrative content is intentionally authored for the original eight scene compositions only.
const ETERNAL_DIALOGUE_SCENE_IDS = new Set(["gde-city","gde-street","gde-market","gde-village","ty-city","ty-skyport","bg-north","bg-settlement"]);
const ETERNAL_DIALOGUE_SCENES = ETERNAL_SCENES.filter(scene=>ETERNAL_DIALOGUE_SCENE_IDS.has(scene.id));
export const ETERNAL_DIALOGUES: EternalDialogue[] = chapters.flatMap((chapter, chapterIndex) =>
  ETERNAL_DIALOGUE_SCENES.flatMap((scene, sceneIndex) =>
    variations.map((variation, variantIndex) => {
      const prompt = chapter.prompts[(sceneIndex + variantIndex) % chapter.prompts.length];
      const subject = chapter.subjects[(sceneIndex * 2 + variantIndex) % chapter.subjects.length];
      const id = `ep-${String(sceneIndex + 1).padStart(2,"0")}-${String(chapterIndex + 1).padStart(2,"0")}-${String(variantIndex + 1).padStart(2,"0")}`;
      return {
        id, contentId:id, contentType:"dialogue" as const, reviewStatus:"APPROVED" as const, packageVersion:"0.1.0" as const, summary:`${chapter.name} scene dialogue for ${scene.detail}`, sourceRefs:[{archiveDossierId:scene.archiveDossierId,universeRepository:"Antarezka/merzkava-universe",universeCommit:scene.universeCommit,sourcePath:scene.sourcePath}], title: `${chapter.name} · ${variation.suffix}`, sceneId:scene.id, chapter:chapter.name,
        speaker:chapter.speaker,
        text:`${sceneOpeners[scene.id]} ${prompt} ${subject}`,
        provenance:"IN_GAME_ORIGINAL" as const,
        originalityNote:"Created for Eternal Path gameplay; this dialogue is not official Merzkava Universe canon.",
        choices:[
          { label:"Observe and listen", response:variation.first, effects:{energy:-1,insight:2,bonds:0}, minutes:15 },
          { label:"Take part", response:variation.second, effects:{energy:-2,insight:0,bonds:2}, minutes:25 },
        ] as [EternalChoice,EternalChoice],
      };
    })
  )
).flat();

export interface EternalSave {
  schemaVersion:3; saveId:string; saveName:string; createdAt:string; updatedAt:string;
  manifest:{universeRepository:string;universeCommit:string;contentPackVersion:string;deterministicSeed:string};
  character:{name:string;age:number;region:EternalRegion}; disposition:DispositionState;
  /** Stable world location; deliberately independent from the current dialogue node. */
  locationId:string;
  day:number; hour:number; minute:number; weather:EternalWeather;
  eventIndex:number; energy:number; insight:number; bonds:number; completed:number;
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
  if(![1,2,3].includes(Number(parsed.schemaVersion))||!parsed.character?.name||!Number.isInteger(parsed.eventIndex)||Number(parsed.eventIndex)<0) return null;
  const region=["golden-dragon-empire","tianhai-yunzhou","beiming-gu"].includes(parsed.character.region)?parsed.character.region:"golden-dragon-empire";
  const locationId=typeof parsed.locationId==="string"&&ETERNAL_SCENES.some(scene=>scene.id===parsed.locationId)?parsed.locationId:defaultSceneForRegion(region).id;
  const now=new Date().toISOString();
  const saveId=typeof parsed.saveId==="string"&&parsed.saveId.length<=80?parsed.saveId:makeSaveId();
  const candidate=parsed.manifest as Partial<EternalSave["manifest"]>|undefined;
  const manifest:EternalSave["manifest"]={
    universeRepository:candidate?.universeRepository==="Antarezka/merzkava-universe"?candidate.universeRepository:"Antarezka/merzkava-universe",
    universeCommit:typeof candidate?.universeCommit==="string"&&/^[a-f0-9]{40}$/i.test(candidate.universeCommit)?candidate.universeCommit:ETERNAL_SCENES[0].universeCommit,
    contentPackVersion:typeof candidate?.contentPackVersion==="string"&&candidate.contentPackVersion.length<=32?candidate.contentPackVersion:"0.1.0",
    deterministicSeed:typeof candidate?.deterministicSeed==="string"&&candidate.deterministicSeed.length<=128?candidate.deterministicSeed:saveId,
  };
  const age=Number.isInteger(parsed.character.age)&&parsed.character.age>=1&&parsed.character.age<=120?parsed.character.age:14;
  return {
    ...parsed,schemaVersion:3,saveId,manifest,
    saveName:typeof parsed.saveName==="string"&&parsed.saveName.trim()?parsed.saveName.trim().slice(0,48):parsed.character.name.trim().slice(0,48),
    createdAt:typeof parsed.createdAt==="string"?parsed.createdAt:now,updatedAt:typeof parsed.updatedAt==="string"?parsed.updatedAt:now,
    character:{name:parsed.character.name.trim().slice(0,32),age,region},
    disposition:createDispositionState(parsed.disposition),locationId,
    day:Number.isInteger(parsed.day)&&Number(parsed.day)>0?Number(parsed.day):1,
    hour:Number.isInteger(parsed.hour)&&Number(parsed.hour)>=0&&Number(parsed.hour)<24?Number(parsed.hour):8,
    minute:Number.isInteger(parsed.minute)&&Number(parsed.minute)>=0&&Number(parsed.minute)<60?Number(parsed.minute):0,
    weather:resolveDailyWeather(region,Number(parsed.day)||1),
    eventIndex:Number(parsed.eventIndex)||0,energy:Math.max(0,Math.min(100,Number(parsed.energy)||0)),insight:Math.max(0,Number(parsed.insight)||0),bonds:Math.max(0,Number(parsed.bonds)||0),completed:Math.max(0,Number(parsed.completed)||0),
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
  save={schemaVersion:3,saveId:id,saveName:input.name.trim(),createdAt:now,updatedAt:now,manifest:{universeRepository:"Antarezka/merzkava-universe",universeCommit:ETERNAL_SCENES[0].universeCommit,contentPackVersion:"0.1.0",deterministicSeed:id},character:{name:input.name.trim(),age:input.age,region:input.region},disposition:createDispositionState(),locationId:defaultSceneForRegion(input.region).id,day:1,hour:8,minute:0,weather:resolveDailyWeather(input.region,1),eventIndex:0,energy:100,insight:0,bonds:0,completed:0};
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
export function getRegionalDialogueCount(): number {
  const current=getEternalSave();
  if(!current) return ETERNAL_DIALOGUES.length;
  const region=currentWorldRegion(current);
  return ETERNAL_DIALOGUES.filter(node =>
    ETERNAL_SCENES.find(scene=>scene.id===node.sceneId)?.region===region
  ).length;
}
export function getCurrentDialogue(): EternalDialogue | null {
  const current=getEternalSave(); if(!current) return null;
  const region=currentWorldRegion(current);
  const regionalEvents=ETERNAL_DIALOGUES.filter(node =>
    ETERNAL_SCENES.find(scene=>scene.id===node.sceneId)?.region===region
  );
  return regionalEvents[current.eventIndex % regionalEvents.length] ?? null;
}
export function chooseEternalOption(index:number): void {
  const current=getEternalSave(); const event=getCurrentDialogue();
  if(!current || !event || (index!==0 && index!==1)) return;
  const choice=event.choices[index];
  current.energy=Math.max(0,Math.min(100,current.energy+choice.effects.energy));
  current.insight=Math.max(0,current.insight+choice.effects.insight);
  current.bonds=Math.max(0,current.bonds+choice.effects.bonds);
  current.completed+=1; current.eventIndex+=1;
  advanceEternalWorldTime(choice.minutes);
  const dayPart=(current.hour*60+current.minute);
  if(dayPart>=20*60 || dayPart<5*60) current.energy=Math.max(0,current.energy-1);
  persist();
}
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
  current.weather=resolveDailyWeather(destination.region,current.day);
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
