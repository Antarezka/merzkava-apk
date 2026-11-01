import { advanceFallbackCalendar, type SessionTimestamp } from "./mechanics/time";

export type EternalRegion = "golden-dragon-empire" | "tianhai-yunzhou" | "beiming-gu";
export type EternalCycle = "Dawn" | "Morning" | "Day" | "Dusk" | "Night";
export type EternalWeather = "Clear" | "Cloudy" | "Fog" | "Rain" | "Snow";

export interface EternalScene {
  id: string; region: EternalRegion; label: string; detail: string; image: string;
  provenance: "IN_GAME_ORIGINAL";
  note: string;
}
export const ETERNAL_SCENES: EternalScene[] = [
  { id:"gde-city", region:"golden-dragon-empire", label:"Imperial city panorama", detail:"Golden Dragon Empire · establishing view", image:"/game/scenery/golden-dragon-empire/establishing-views/gde-01-imperial-city-panorama.png", provenance:"IN_GAME_ORIGINAL", note:"Visual scene composition for Eternal Path; not a claim about an unnamed canon settlement." },
  { id:"gde-street", region:"golden-dragon-empire", label:"Traditional city street", detail:"Golden Dragon Empire · city street", image:"/game/scenery/golden-dragon-empire/gde-02-traditional-city-street.png", provenance:"IN_GAME_ORIGINAL", note:"Visual scene composition for Eternal Path." },
  { id:"gde-market", region:"golden-dragon-empire", label:"Marketplace street", detail:"Golden Dragon Empire · market atmosphere", image:"/game/scenery/golden-dragon-empire/gde-04-marketplace-street.png", provenance:"IN_GAME_ORIGINAL", note:"Visual scene composition for Eternal Path." },
  { id:"gde-village", region:"golden-dragon-empire", label:"Rural village landscape", detail:"Golden Dragon Empire · rural landscape", image:"/game/scenery/golden-dragon-empire/gde-06-rural-village-landscape.png", provenance:"IN_GAME_ORIGINAL", note:"Visual scene composition for Eternal Path." },
  { id:"ty-city", region:"tianhai-yunzhou", label:"Floating island city", detail:"Tianhai Yunzhou · establishing view", image:"/game/scenery/tianhai-yunzhou/ty-01-floating-island-city-panorama.png", provenance:"IN_GAME_ORIGINAL", note:"Visual scene composition for Eternal Path." },
  { id:"ty-skyport", region:"tianhai-yunzhou", label:"Skyport approach", detail:"Tianhai Yunzhou · airship approach", image:"/game/scenery/tianhai-yunzhou/ty-02-skyport-airship-approach.png", provenance:"IN_GAME_ORIGINAL", note:"Visual scene composition for Eternal Path." },
  { id:"bg-north", region:"beiming-gu", label:"Northern territory panorama", detail:"Beiming Gu · northern landscape", image:"/game/scenery/beiming-gu/bg-01-northern-territory-panorama.png", provenance:"IN_GAME_ORIGINAL", note:"Visual scene composition for Eternal Path." },
  { id:"bg-settlement", region:"beiming-gu", label:"Snowbound settlement", detail:"Beiming Gu · settlement atmosphere", image:"/game/scenery/beiming-gu/bg-02-snowbound-settlement.png", provenance:"IN_GAME_ORIGINAL", note:"Visual scene composition for Eternal Path." },
];

export interface EternalChoice { label: string; response: string; effects: { energy: number; insight: number; bonds: number }; minutes: number; }
export interface EternalDialogue {
  id: string; title: string; sceneId: string; chapter: string; speaker: string;
  text: string; provenance: "IN_GAME_ORIGINAL"; originalityNote: string;
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
};
const variations = [
  { suffix:"Listen first", first:"You take a moment to understand the situation before responding.", second:"You step forward and offer a practical hand." },
  { suffix:"Ask a question", first:"You ask for one more detail rather than assuming what happened.", second:"You share what you have noticed and invite the other person to compare details." },
  { suffix:"Offer help", first:"You offer help within your ability and keep the task modest.", second:"You suggest a safer or more orderly way to handle the matter." },
  { suffix:"Practice patience", first:"You remain patient and let the other person finish explaining.", second:"You volunteer to demonstrate the task slowly and clearly." },
  { suffix:"Make a careful choice", first:"You choose the least risky next step and observe the result.", second:"You bring the nearby people into the decision instead of acting alone." },
];
export const ETERNAL_DIALOGUES: EternalDialogue[] = chapters.flatMap((chapter, chapterIndex) =>
  ETERNAL_SCENES.flatMap((scene, sceneIndex) =>
    variations.map((variation, variantIndex) => {
      const prompt = chapter.prompts[(sceneIndex + variantIndex) % chapter.prompts.length];
      const subject = chapter.subjects[(sceneIndex * 2 + variantIndex) % chapter.subjects.length];
      const id = `ep-${String(sceneIndex + 1).padStart(2,"0")}-${String(chapterIndex + 1).padStart(2,"0")}-${String(variantIndex + 1).padStart(2,"0")}`;
      return {
        id, contentId:id, contentType:"dialogue", reviewStatus:"APPROVED", packageVersion:"0.1.0", summary:`${chapter.name} scene dialogue for ${scene.detail}`, title: `${chapter.name} · ${variation.suffix}`, sceneId:scene.id, chapter:chapter.name,
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
  schemaVersion:1; character:{name:string;age:number;region:EternalRegion};
  day:number; hour:number; minute:number; weather:EternalWeather;
  eventIndex:number; energy:number; insight:number; bonds:number; completed:number;
}
const SAVE_KEY = "merzkava-eternal-path-save-v1";
let save: EternalSave | null = null;
let preview: { enabled:boolean; sceneId:string; cycle:EternalCycle; weather:EternalWeather; fog:number } = {
  enabled:false, sceneId:"gde-city", cycle:"Morning", weather:"Clear", fog:0.22
};
function readSave(): EternalSave | null {
  try {
    const raw=localStorage.getItem(SAVE_KEY); if(!raw) return null;
    const parsed=JSON.parse(raw) as EternalSave;
    if(parsed.schemaVersion!==1 || !parsed.character?.name || !Number.isInteger(parsed.eventIndex)) return null;
    return parsed;
  } catch { return null; }
}
function persist(): void { try { if(save) localStorage.setItem(SAVE_KEY,JSON.stringify(save)); } catch { /* The current session remains playable in memory. */ } }
export function getEternalSave(): EternalSave | null { if(save===null) save=readSave(); return save; }
export function startEternalGame(input:{name:string;age:number;region:EternalRegion}): void {
  save={schemaVersion:1,character:{name:input.name.trim(),age:input.age,region:input.region},day:1,hour:8,minute:0,weather:"Clear",eventIndex:0,energy:100,insight:0,bonds:0,completed:0};
  persist();
}
export function resetEternalGame(): void { save=null; try{localStorage.removeItem(SAVE_KEY);}catch{/* no-op */} }
export function getCurrentDialogue(): EternalDialogue | null {
  const current=getEternalSave(); if(!current) return null;
  return ETERNAL_DIALOGUES[current.eventIndex % ETERNAL_DIALOGUES.length] ?? null;
}
export function chooseEternalOption(index:number): void {
  const current=getEternalSave(); const event=getCurrentDialogue();
  if(!current || !event || (index!==0 && index!==1)) return;
  const choice=event.choices[index];
  current.energy=Math.max(0,Math.min(100,current.energy+choice.effects.energy));
  current.insight=Math.max(0,current.insight+choice.effects.insight);
  current.bonds=Math.max(0,current.bonds+choice.effects.bonds);
  current.completed+=1; current.eventIndex+=1;
  const timestamp:SessionTimestamp={year:0,month:1,day:current.day,hour:current.hour,minute:current.minute,weekdayIndex:0};
  const advanced=advanceFallbackCalendar(timestamp,choice.minutes);
  if(advanced.valid){current.day=advanced.result.timestamp.day;current.hour=advanced.result.timestamp.hour;current.minute=advanced.result.timestamp.minute;}
  const dayPart=(current.hour*60+current.minute);
  if(current.completed%5===0) current.weather=([ "Clear","Cloudy","Fog","Rain","Clear","Snow" ] as EternalWeather[])[(Math.floor(current.completed/5)+current.day)%6];
  if(dayPart>=20*60 || dayPart<5*60) current.energy=Math.max(0,current.energy-1);
  persist();
}
export function getExpeditionScene(): EternalScene {
  const current=getEternalSave();
  if(preview.enabled) return ETERNAL_SCENES.find(scene=>scene.id===preview.sceneId) ?? ETERNAL_SCENES[0];
  return ETERNAL_SCENES.find(scene=>scene.region===(current?.character.region ?? "golden-dragon-empire")) ?? ETERNAL_SCENES[0];
}
export function getExpeditionAtmosphere(): {cycle:EternalCycle;weather:EternalWeather;fog:number;preview:boolean} {
  if(preview.enabled) return {cycle:preview.cycle,weather:preview.weather,fog:preview.fog,preview:true};
  const current=getEternalSave();
  const minute=(current?.hour ?? 8)*60+(current?.minute ?? 0);
  const cycle:EternalCycle=minute<5*60?"Night":minute<7*60?"Dawn":minute<11*60?"Morning":minute<17*60?"Day":minute<20*60?"Dusk":"Night";
  return {cycle,weather:current?.weather ?? "Clear",fog:current?.weather==="Fog"?0.34:0.22,preview:false};
}
export function setExpeditionPreview(values:Partial<{sceneId:string;cycle:EternalCycle;weather:EternalWeather;fog:number}>):void {
  preview={...preview,...values,enabled:true,fog:Math.max(0,Math.min(0.55,values.fog??preview.fog))};
}
export function toggleExpeditionPreview(enabled:boolean):void { preview.enabled=enabled; }
export function resetExpeditionPreview():void { preview={enabled:false,sceneId:"gde-city",cycle:"Morning",weather:"Clear",fog:0.22}; }
