export type DispositionAxis = "order" | "morality" | "motive" | "method" | "loyalty" | "empathy" | "ambition";
export type DispositionScores = Record<DispositionAxis, number>;
export type DispositionLabel = "Lawful Good" | "Neutral Good" | "Chaotic Good" | "Lawful Neutral" | "True Neutral" | "Chaotic Neutral" | "Lawful Evil" | "Neutral Evil" | "Chaotic Evil";
export type LawfulnessBand = "Chaotic" | "Low" | "Normal" | "High" | "Dedicated";
export interface DispositionState { scores: DispositionScores; evidenceCount: number; lastUpdatedDay: number; label: DispositionLabel; lawfulnessBand: LawfulnessBand; }
export const INITIAL_DISPOSITION: DispositionState = { scores:{order:50,morality:50,motive:50,method:50,loyalty:50,empathy:50,ambition:50},evidenceCount:0,lastUpdatedDay:1,label:"True Neutral",lawfulnessBand:"Normal" };
const clamp=(value:number)=>Math.max(0,Math.min(100,value));
function side(score:number,low:string,high:string):string { return score<=35?low:score>=65?high:"neutral"; }
export function deriveDispositionLabel(scores:DispositionScores):DispositionLabel {
 const order=side(scores.order,"chaotic","lawful"), moral=side(scores.morality,"evil","good");
 if(order==="neutral"&&moral==="neutral") return "True Neutral";
 const orderLabel=order==="neutral"?"Neutral":order==="lawful"?"Lawful":"Chaotic";
 const moralLabel=moral==="neutral"?"Neutral":moral==="good"?"Good":"Evil";
 if(order==="neutral") return (moralLabel==="Neutral"?"True Neutral":`Neutral ${moralLabel}`) as DispositionLabel;
 if(moral==="neutral") return `${orderLabel} Neutral` as DispositionLabel;
 return `${orderLabel} ${moralLabel}` as DispositionLabel;
}
export function deriveLawfulnessBand(order:number):LawfulnessBand {
 const score=clamp(order);
 if(score<15) return "Chaotic";
 if(score<35) return "Low";
 if(score<65) return "Normal";
 if(score<85) return "High";
 return "Dedicated";
}
export function createDispositionState(input?:Partial<DispositionState>):DispositionState {
 const scores={...INITIAL_DISPOSITION.scores,...input?.scores};
 for(const axis of Object.keys(scores) as DispositionAxis[]) scores[axis]=clamp(Number.isFinite(scores[axis])?scores[axis]:50);
 return {scores,evidenceCount:Math.max(0,Math.floor(input?.evidenceCount??0)),lastUpdatedDay:Math.max(1,Math.floor(input?.lastUpdatedDay??1)),label:deriveDispositionLabel(scores),lawfulnessBand:deriveLawfulnessBand(scores.order)};
}
export function applyDispositionEvidence(state:DispositionState,evidence:Partial<Record<DispositionAxis,number>>,day:number,weight=1):DispositionState {
 const next={...state,scores:{...state.scores}};
 for(const axis of Object.keys(evidence) as DispositionAxis[]) {
  const delta=evidence[axis];
  if(typeof delta==="number"&&Number.isFinite(delta)) next.scores[axis]=clamp(next.scores[axis]+delta*Math.max(0,Math.min(1,weight)));
 }
 next.evidenceCount=state.evidenceCount+1;
 next.lastUpdatedDay=Math.max(state.lastUpdatedDay,Math.floor(day));
 const candidate=deriveDispositionLabel(next.scores);
 // Hysteresis: retain the public label until a full evidence window and a clear boundary crossing.
 if(next.evidenceCount>=3) {
  const previous=state.label;
  const changed=candidate!==previous;
  const orderMargin=Math.abs(next.scores.order-50), moralMargin=Math.abs(next.scores.morality-50);
  if(!changed || (orderMargin>=18&&moralMargin>=18)) next.label=candidate;
 }
 next.lawfulnessBand=deriveLawfulnessBand(next.scores.order);
 return next;
}
