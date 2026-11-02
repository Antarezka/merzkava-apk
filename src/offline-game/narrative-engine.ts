import type { DispositionAxis, DispositionState } from "./disposition";

export type NarrativeRegion = "golden-dragon-empire" | "tianhai-yunzhou" | "beiming-gu";
export type NarrativeCycle = "Dawn" | "Morning" | "Day" | "Dusk" | "Night";
export type NarrativeWeather = "Clear" | "Cloudy" | "Fog" | "Rain" | "Snow";

export interface NarrativeChoice {
  id: string;
  label: string;
  outcome: {
    revealedText: string;
    energy: number;
    insight: number;
    minutes: number;
    disposition?: Partial<Record<DispositionAxis, number>>;
  };
}
export interface NarrativeSituation {
  id: string;
  patchId: string;
  patchVersion: string;
  category: "ordinary-life" | "social" | "travel" | "discovery";
  provenance: "IN_GAME_ORIGINAL";
  sourceNote: string;
  eligibility: {
    regions: NarrativeRegion[];
    cycles?: NarrativeCycle[];
    weather?: NarrativeWeather[];
    minAge?: number;
    maxAge?: number;
  };
  title: string;
  setting: string;
  sceneAction: string[];
  actors: Array<{ label: string; knowledge: string; observableBehavior: string }>;
  dialogue: { speaker: string; text: string };
  closingQuestion: string;
  choices: NarrativeChoice[];
}
export interface NarrativeContext {
  saveId: string;
  seed: string;
  characterName: string;
  age: number;
  region: NarrativeRegion;
  locationId: string;
  day: number;
  hour: number;
  minute: number;
  weather: NarrativeWeather;
  disposition: DispositionState;
  completedNodeIds: string[];
  sequence: number;
}
export interface NarrativeResolution {
  nodeId: string;
  choiceId: string;
  outcomeText: string;
  energyDelta: number;
  insightDelta: number;
  minutes: number;
  dispositionEvidence?: Partial<Record<DispositionAxis, number>>;
  transactionId: string;
}
const base = (id:string, region:NarrativeRegion, title:string, setting:string, action:string[], actorLabel:string, knowledge:string, behavior:string, speakerText:string, question:string, choices:NarrativeChoice[]):NarrativeSituation => ({
  id, patchId:"eternal-path-bootstrap", patchVersion:"0.1.0-bootstrap", category:"ordinary-life", provenance:"IN_GAME_ORIGINAL",
  sourceNote:"Original starter situation for the Eternal Path playable vertical slice; not Universe canon and not Patch 1 content.",
  eligibility:{regions:[region]}, title, setting, sceneAction:action,
  actors:[{label:actorLabel,knowledge,observableBehavior:behavior}],
  dialogue:{speaker:actorLabel,text:speakerText}, closingQuestion:question, choices
});
const helpChoice: NarrativeChoice = {id:"help",label:"Offer practical help before asking questions",outcome:{revealedText:"The scattered things are gathered before the crowd can trample them. The stranger gives a brief, relieved nod; the moment leaves a small impression, not a promise.",energy:-2,insight:1,minutes:10,disposition:{empathy:2,motive:1}}};
const askChoice: NarrativeChoice = {id:"ask",label:"Ask what happened and whether help is needed",outcome:{revealedText:"The stranger explains the mishap and accepts help with the heaviest pieces. The exchange is measured, but you learn what caused the delay.",energy:-1,insight:2,minutes:8,disposition:{method:1,empathy:1}}};
const passChoice: NarrativeChoice = {id:"pass",label:"Give them room and continue on your way",outcome:{revealedText:"The stranger gathers the nearest pieces alone. The road clears again; nothing follows you except the ordinary sounds of the place.",energy:0,insight:0,minutes:2}};
export const BOOTSTRAP_SITUATIONS: NarrativeSituation[] = [
  base("epb-gde-roadside-bundle","golden-dragon-empire","A bundle on the roadside",
    "A narrow stretch of the street has become briefly awkward to pass. A handcart stands at an angle near the edge, and several wrapped bundles have slipped onto the paving stones.",
    ["The morning traffic does not stop, but people begin to step around the obstruction.","A passer-by crouches to retrieve one bundle, then pauses to keep the cart from rolling farther.","Dust clings to the cloth wrapping; none of the markings are clear enough to identify an owner or destination.","The passer-by checks the approaching foot traffic before reaching for the next parcel.","There is no sign of an official dispute or emergency, only a small problem growing more inconvenient by the moment.","A clear path would help everyone nearby, though no one has asked you to intervene."],
    "A passer-by","They know the cart is unstable and that the bundles are in the way; they have not explained who owns them.","They brace one hand against the cart and glance between the bundles and the passing feet.","Could you spare a moment? The cart shifted, and these things are everywhere.",
    "The passer-by is trying to keep the cart from moving while the street continues around them. Would your character prioritize immediate help, first understand the situation, or avoid becoming involved?",
    [helpChoice,askChoice,passChoice]),
  base("epb-ty-windblown-ledgers","tianhai-yunzhou","Pages against the wind",
    "Along an open elevated walkway, a gust catches several loose pages and sends them skimming toward the outer railing. A traveler has stopped beside a closed case, watching the papers scatter.",
    ["The wind rises and falls between the buildings, carrying distant voices across the walkway.","Two pages slide beneath a bench while another catches against the base of the railing.","The traveler keeps one hand on the case and reaches after a page that has already moved beyond arm's length.","People continue along the walkway, adjusting their steps to avoid the loose papers.","The writing is turned away and cannot be read from where you stand.","The pages may matter to the traveler, but their purpose is not yet known."],
    "A traveler","They know the pages belong with the case; they have not told you what the writing contains.","They pins one page beneath the case lid and looks toward the next sheet.","Please—could you catch the page near the railing? The wind keeps taking them.",
    "The traveler is securing the pages one at a time while the gusts keep shifting them. Would your character retrieve the nearest page, ask what must be protected first, or leave the traveler to manage?",
    [helpChoice,askChoice,passChoice]),
  base("epb-bg-frosted-satchel","beiming-gu","A satchel in the frost",
    "Near a sheltered stretch of the northern road, a satchel lies half-buried in fresh frost. A traveler stands a few paces away, checking the road behind them.",
    ["The cold has quieted the roadside, leaving each footstep distinct against the frozen ground.","A strap has caught beneath a thin crust of ice, holding the satchel in place.","The traveler notices you but does not approach, keeping their attention divided between the bag and the road.","No seal, emblem, or readable name is visible on the satchel.","The weather makes a prolonged stop uncomfortable, though the situation does not yet appear urgent.","Whether the bag was dropped or deliberately set aside remains unclear."],
    "A traveler","They know the satchel is theirs to recover; they have not explained why it was left behind.","They rub their hands together, then point toward the strap caught beneath the ice.","I cannot free the strap without setting everything else down. Would you help me lift it?",
    "The traveler asks for help freeing a satchel but gives no explanation for the delay. Would your character help first, ask why they stopped here, or keep to the road?",
    [helpChoice,askChoice,passChoice])
];

function hash32(input:string):number {
  let hash=2166136261;
  for(let i=0;i<input.length;i++){hash^=input.charCodeAt(i);hash=Math.imul(hash,16777619);}
  return hash>>>0;
}
export function getNarrativeCycle(hour:number,minute:number):NarrativeCycle {
  const value=hour*60+minute;
  return value<300?"Night":value<420?"Dawn":value<660?"Morning":value<1020?"Day":value<1200?"Dusk":"Night";
}
export function isSituationEligible(node:NarrativeSituation, context:NarrativeContext):boolean {
  const rule=node.eligibility, cycle=getNarrativeCycle(context.hour,context.minute);
  return rule.regions.includes(context.region)
    && (!rule.cycles||rule.cycles.includes(cycle))
    && (!rule.weather||rule.weather.includes(context.weather))
    && (rule.minAge===undefined||context.age>=rule.minAge)
    && (rule.maxAge===undefined||context.age<=rule.maxAge)
    && !context.completedNodeIds.includes(node.id);
}
export function selectNarrativeSituation(context:NarrativeContext,nodes:NarrativeSituation[]=BOOTSTRAP_SITUATIONS):NarrativeSituation|null {
  const eligible=nodes.filter(node=>isSituationEligible(node,context)).sort((a,b)=>a.id.localeCompare(b.id));
  if(!eligible.length)return null;
  return eligible[hash32([context.seed,context.saveId,context.day,context.locationId,context.sequence].join("|"))%eligible.length];
}
export function resolveNarrativeChoice(node:NarrativeSituation,choiceId:string,context:NarrativeContext):NarrativeResolution|null {
  if(!isSituationEligible(node,context))return null;
  const choice=node.choices.find(item=>item.id===choiceId);
  if(!choice)return null;
  const transactionId="ep-"+hash32([context.saveId,node.id,choice.id,context.sequence].join("|")).toString(16).padStart(8,"0");
  return {nodeId:node.id,choiceId:choice.id,outcomeText:choice.outcome.revealedText,energyDelta:choice.outcome.energy,insightDelta:choice.outcome.insight,minutes:choice.outcome.minutes,dispositionEvidence:choice.outcome.disposition,transactionId};
}
