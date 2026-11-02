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
const responseBranches = (assistLabel:string,assistText:string,clarifyLabel:string,clarifyText:string,leaveLabel:string,leaveText:string):NarrativeChoice[] => [
  {id:"help",label:assistLabel,outcome:{revealedText:assistText,energy:-2,insight:1,minutes:10,disposition:{empathy:2,motive:1}}},
  {id:"ask",label:clarifyLabel,outcome:{revealedText:clarifyText,energy:-1,insight:2,minutes:8,disposition:{method:1,empathy:1}}},
  {id:"pass",label:leaveLabel,outcome:{revealedText:leaveText,energy:0,insight:0,minutes:2}}
];
export const BOOTSTRAP_SITUATIONS: NarrativeSituation[] = [
  base("epb-gde-roadside-bundle","golden-dragon-empire","A bundle on the roadside",
    "A narrow stretch of the street has become briefly awkward to pass. A handcart stands at an angle near the edge, and several wrapped bundles have slipped onto the paving stones.",
    ["The morning traffic does not stop, but people begin to step around the obstruction.","A passer-by crouches to retrieve one bundle, then pauses to keep the cart from rolling farther.","Dust clings to the cloth wrapping; none of the markings are clear enough to identify an owner or destination.","The passer-by checks the approaching foot traffic before reaching for the next parcel.","There is no sign of an official dispute or emergency, only a small problem growing more inconvenient by the moment.","A clear path would help everyone nearby, though no one has asked you to intervene."],
    "A passer-by","They know the cart is unstable and that the bundles are in the way; they have not explained who owns them.","They brace one hand against the cart and glance between the bundles and the passing feet.","Could you spare a moment? The cart shifted, and these things are everywhere.",
    "The passer-by is trying to keep the cart from moving while the street continues around them. Would your character prioritize immediate help, first understand the situation, or avoid becoming involved?",
    responseBranches("Brace the cart and gather the nearest bundles","You steady the cart and collect the loose bundles before they reach the passing feet. The passer-by can secure the load and clear the narrow stretch.","Ask who owns the bundles before moving them","The passer-by explains that the load belongs to a nearby delivery. Together you identify which parcels can be moved without disturbing the order.","Leave the cart to the passer-by and continue","The passer-by shifts the cart against the wall and gathers the nearest bundles alone. The street slowly returns to its usual pace.")),
  base("epb-ty-windblown-ledgers","tianhai-yunzhou","Pages against the wind",
    "Along an open elevated walkway, a gust catches several loose pages and sends them skimming toward the outer railing. A traveler has stopped beside a closed case, watching the papers scatter.",
    ["The wind rises and falls between the buildings, carrying distant voices across the walkway.","Two pages slide beneath a bench while another catches against the base of the railing.","The traveler keeps one hand on the case and reaches after a page that has already moved beyond arm's length.","People continue along the walkway, adjusting their steps to avoid the loose papers.","The writing is turned away and cannot be read from where you stand.","The pages may matter to the traveler, but their purpose is not yet known."],
    "A traveler","They know the pages belong with the case; they have not told you what the writing contains.","They pin one page beneath the case lid and looks toward the next sheet.","Please—could you catch the page near the railing? The wind keeps taking them.",
    "The traveler is securing the pages one at a time while the gusts keep shifting them. Would your character retrieve the nearest page, ask what must be protected first, or leave the traveler to manage?",
    responseBranches("Catch the page near the railing","You catch the drifting sheet before it slips farther along the walkway. The traveler secures the remaining pages beneath the case lid.","Ask which pages matter most","The traveler points out the loose sheets that must stay together and explains how they were separated by the gust.","Let the traveler collect the pages alone","The traveler pins the case shut and retrieves the pages one by one as the wind eases.")),
  base("epb-bg-frosted-satchel","beiming-gu","A satchel in the frost",
    "Near a sheltered stretch of the northern road, a satchel lies half-buried in fresh frost. A traveler stands a few paces away, checking the road behind them.",
    ["The cold has quieted the roadside, leaving each footstep distinct against the frozen ground.","A strap has caught beneath a thin crust of ice, holding the satchel in place.","The traveler notices you but does not approach, keeping their attention divided between the bag and the road.","No seal, emblem, or readable name is visible on the satchel.","The weather makes a prolonged stop uncomfortable, though the situation does not yet appear urgent.","Whether the bag was dropped or deliberately set aside remains unclear."],
    "A traveler","They know the satchel is theirs to recover; they have not explained why it was left behind.","They rub their hands together, then point toward the strap caught beneath the ice.","I cannot free the strap without setting everything else down. Would you help me lift it?",
    "The traveler asks for help freeing a satchel but gives no explanation for the delay. Would your character help first, ask why they stopped here, or keep to the road?",
    responseBranches("Free the strap from the ice","You loosen the frozen strap while the traveler steadies the satchel. The bag comes free without tearing its caught seam.","Ask why the satchel was left here","The traveler explains that the strap caught while they checked the road behind them. The delay is ordinary, though the reason for watching the road remains theirs.","Keep to the road","The traveler works the strap loose with both hands. You continue before the cold settles further into your fingers."))
];


const gdeSocial=base("epb-gde-market-shelf","golden-dragon-empire","A place left in the queue",
  "At the edge of a busy market lane, a small queue has formed beside a stall. One place near the front is empty, though a folded cloth has been laid across the low counter.",
  ["The queue advances in short, uneven steps as customers finish their purchases.","A young customer returns carrying a parcel and looks uncertainly at the open place.","The stallkeeper continues weighing goods without calling anyone forward.","No one has explained whether the empty place is being held or simply left unused.","A few people glance toward the returning customer, then back to the counter.","The pause is brief, but stepping into it could change how the people nearby understand the situation."],
  "A waiting customer","They know someone had been standing there earlier; they do not know whether that person intends to return.","They keep one hand around a small parcel and leave the empty place untouched.","I was told to wait here. I do not know whether this place is still being held.",
  "The customer is unsure whether the empty place belongs to someone who stepped away. Would your character clarify the queue with the people present, let the customer decide, or avoid intervening?",
  responseBranches("Help clarify the place in the queue","You ask the waiting customers whether the place was being held. The returning customer gets a clear answer before stepping forward or aside.","Ask the customer who told them to wait","The customer describes the brief instruction they received, making it easier to understand why the empty place was uncertain.","Leave the queue to sort itself out","The returning customer waits until the stallkeeper finishes the current purchase, then asks again.")); gdeSocial.category="social";
const gdeDiscovery=base("epb-gde-repair-mark","golden-dragon-empire","A fresh mark on the post",
  "A wooden post beside the road bears a fresh chalk mark. It sits below older weathered marks, and a thin trail of pale dust leads toward the edge of the street.",
  ["The newest mark is brighter than the older lines around it.","A passer-by slows down, notices your attention, and then continues walking.","The mark has no clear seal or writing that identifies who made it.","The dust trail fades where many feet have crossed the road.","Nothing nearby suggests immediate danger, but the mark appears recent.","Its meaning cannot be established from appearance alone."],
  "A nearby resident","They noticed the mark earlier but do not know who made it or what it signifies.","They look from the post to the road, keeping a cautious distance.","That was not there yesterday. I have no idea who left it.",
  "The resident can confirm only that the mark is new, not what it means. Would your character inspect its surroundings, ask nearby people what they noticed, or leave it unexplored?",
  responseBranches("Inspect the post and the nearby ground","You look over the post and the fading dust trail without disturbing the mark. The resident can compare what you notice with what they saw earlier.","Ask nearby people whether they saw it appear","The resident agrees to ask the people along the street. No one claims to know who made the mark, but the time it appeared becomes clearer.","Leave the mark untouched","The resident returns to their errand. The chalk remains unexplained, and the road carries on around it.")); gdeDiscovery.category="discovery";
const tySocial=base("epb-ty-platform-directions","tianhai-yunzhou","A traveler at the junction",
  "At a broad junction between elevated walkways, a traveler studies a route board while foot traffic divides around them. Their folded map is open, but one corner keeps lifting in the wind.",
  ["People pass in both directions without slowing for long.","The traveler compares the map with the route board, then turns the paper to check its reverse.","The visible marks are too small to read from a distance.","A nearby sign indicates several routes, but the traveler has not said which destination they seek.","The junction remains orderly despite the brief hesitation.","A question may help, though the traveler might prefer to work it out alone."],
  "A traveler","They know their intended destination but have not shared it.","They hold the map against the board and trace one route with a finger.","I may have taken the wrong turn. Do you know this junction?",
  "The traveler asks about the junction but has not named a destination. Would your character ask where they are headed, point out the visible route markers, or continue without getting involved?",
  responseBranches("Point out the route board and steady the map","You hold the map against the gust long enough for the traveler to compare its markings with the board. The traveler identifies the junction they need.","Ask where the traveler is trying to go","The traveler names the destination, allowing the two of you to compare the route without guessing from the map alone.","Continue through the junction","The traveler folds the map against the wind and studies the route board again after the walkway clears.")); tySocial.category="social";
const tyDiscovery=base("epb-ty-loose-fastening","tianhai-yunzhou","A loose fastening",
  "A narrow strip of fabric flutters from a railing support. It is tied around the fastening rather than attached to the structure itself.",
  ["The strip snaps lightly in the wind each time the air moves through the walkway.","A maintenance worker is visible farther along the path, speaking with another person.","The fastening remains in place, and nothing appears to be falling.","The fabric carries no readable mark from this distance.","Several passers-by notice it but do not stop.","It may be a harmless loose item, though its position makes it worth a closer look."],
  "A passer-by","They saw the fabric moving but do not know who tied it there.","They glance toward the distant worker, then step aside to let others pass.","I thought something had come loose, but I cannot tell what it is.",
  "The passer-by has noticed the fluttering strip but cannot confirm whether the structure is unsafe. Would your character look more closely from a safe distance, alert the nearby worker, or leave it alone?",
  responseBranches("Alert the nearby worker to the loose fabric","You signal the worker from a safe distance and point out the strip near the fastening. The worker approaches to inspect it rather than leaving the walkway unattended.","Look more closely from a safe distance","You inspect the support without touching it. The fabric appears separate from the fastening, but its purpose remains unknown.","Leave it for the worker to notice","The worker eventually reaches the junction. The strip continues to flutter, but the walkway remains clear.")); tyDiscovery.category="discovery";
const bgSocial=base("epb-bg-water-carrier","beiming-gu","A pause beside the water jars",
  "Beside a sheltered wall, a water carrier has set two covered jars on the packed snow. One lid has shifted, and the carrier is brushing frost from its rim.",
  ["The carrier works slowly to keep the jar from tipping on the uneven ground.","A second jar remains covered and upright beside the wall.","The carrier's gloves are damp around the fingertips.","No one else is waiting nearby, and the path remains open.","The cold makes the task uncomfortable but not immediately dangerous.","A brief offer of help could shorten the stop, though the carrier has not asked."],
  "A water carrier","They know one lid has shifted; they have not explained where the jars are being taken.","They steady the jar with one arm and adjust the loosened cover with the other.","Could you hold this steady for a moment? The ground is uneven.",
  "The carrier asks for a steady hand while adjusting the lid. Would your character help with the jar, ask where it is being taken, or keep moving along the road?",
  responseBranches("Hold the jar while the carrier resets its lid","You steady the jar on the uneven ground while the carrier secures the cover. The water stays inside and the carrier can lift it safely.","Ask where the jars are being taken","The carrier explains the short errand and adjusts the lids before lifting either jar. The pause gives you a clearer sense of the route.","Continue along the sheltered path","The carrier wedges the jar against the wall and resets the lid alone before continuing.")); bgSocial.category="social";
const bgDiscovery=base("epb-bg-lantern-tracks","beiming-gu","Tracks near the lantern",
  "A line of fresh footprints crosses the frost near an unlit roadside lantern. The marks lead away from the path and disappear behind a low rise.",
  ["The snow around the lantern is otherwise undisturbed.","The footprints are recent enough that their edges remain sharply defined.","No voice or movement answers from beyond the rise.","The lantern itself appears intact, with no visible sign of damage.","The road remains passable, and the weather is calm for the moment.","The tracks show direction, but they do not reveal who made them or why."],
  "A passing traveler","They noticed the tracks but did not follow them and cannot identify their maker.","They point toward the low rise without stepping closer.","Those were not there when I passed earlier. I did not think it wise to follow them.",
  "The traveler has seen fresh tracks but knows nothing about their source. Would your character examine the ground from the path, ask whether anyone else saw them, or avoid following an unknown trail?",
  responseBranches("Examine the tracks from the road","You study the footprints from the packed path without following them. Their direction and spacing become clearer, but their maker remains unknown.","Ask the traveler when they first noticed the tracks","The traveler describes passing the lantern moments earlier. The tracks are recent, though nothing reveals who left them.","Keep to the marked road","The traveler turns away from the rise. The footprints remain in the frost as the road falls quiet again.")); bgDiscovery.category="discovery";
BOOTSTRAP_SITUATIONS.push(gdeSocial,gdeDiscovery,tySocial,tyDiscovery,bgSocial,bgDiscovery);

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
