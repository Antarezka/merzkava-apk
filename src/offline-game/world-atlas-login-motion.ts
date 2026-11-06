import { animate, createScope } from "animejs";

function abortError(): Error {
  const error = new Error("Account access sequence was cancelled.");
  error.name = "AbortError";
  return error;
}

function wait(milliseconds:number,signal?:AbortSignal):Promise<void> {
  if(signal?.aborted)return Promise.reject(abortError());
  return new Promise((resolve,reject)=>{
    const finish=()=>{
      signal?.removeEventListener("abort",cancel);
      resolve();
    };
    const cancel=()=>{
      window.clearTimeout(timer);
      signal?.removeEventListener("abort",cancel);
      reject(abortError());
    };
    const timer=window.setTimeout(finish,Math.max(0,milliseconds));
    signal?.addEventListener("abort",cancel,{once:true});
  });
}

export type WorldAtlasProgressStep = {
  target:number;
  advanceMs:number;
  stallMs:number;
  frameMs:number;
};

/** Builds a monotonic, single-pass progress path with deliberately uneven pauses. */
export function createWorldAtlasProgressPlan(
  stageCount:number,
  duration:number,
  random:()=>number=Math.random
):WorldAtlasProgressStep[] {
  const count=Math.max(4,Math.min(10,Math.floor(stageCount)||4));
  const frameMs=64;
  const fixedFrameTime=count*frameMs*3;
  const totalDuration=Math.max(Math.max(0,duration),fixedFrameTime+count*90);
  const availableTime=totalDuration-fixedFrameTime;
  const safeRandom=()=>{
    const value=random();
    return Math.max(0,Math.min(0.999999,Number.isFinite(value)?value:0.5));
  };
  const weights=Array.from({length:count},()=>({
    advance:120+safeRandom()*160,
    stall:110+safeRandom()*270
  }));
  const rawTotal=weights.reduce((sum,item)=>sum+item.advance+item.stall,0)||1;
  const scale=availableTime/rawTotal;
  let previous=0;
  return weights.map((item,index)=>{
    const ideal=92*(index+1)/count;
    const jitter=index===count-1?0:(safeRandom()-.5)*7;
    const target=index===count-1?92:Math.max(previous+1.5,Math.min(92-(count-index-1)*1.5,ideal+jitter));
    previous=target;
    return {
      target,
      advanceMs:item.advance*scale,
      stallMs:item.stall*scale,
      frameMs
    };
  });
}

/** Replaces the current diagnostic line with a one-, two-, or three-dot frame. */
export function formatAccessDiagnosticFrame(value:string,dots:number):string {
  const count=Math.max(1,Math.min(3,Math.floor(dots)||1));
  return value.trim().replace(/[. …]+$/,"")+".".repeat(count);
}

/**
 * Confirmation-only Anime.js access presentation.
 * Progress advances once through uneven checkpoints, pauses at each checkpoint,
 * and never reaches 100% until the real operation has completed successfully.
 * Diagnostic text replaces the previous frame rather than accumulating a log.
 */
export async function playWorldAtlasAccessSequence(
  gate:HTMLElement,
  duration=4000,
  holdUntil?:Promise<unknown>,
  signal?:AbortSignal
):Promise<void> {
  const buffer=gate.querySelector<HTMLElement>("[data-world-atlas-buffer]");
  const status=buffer?.querySelector<HTMLElement>("[data-atlas-buffer-status]");
  const progress=buffer?.querySelector<HTMLElement>("[data-atlas-buffer-progress]");
  if(!buffer||!status||!progress)return;
  const stages=(buffer.dataset.bufferStages||gate.dataset.bufferStages||"Verifying account identity...|Checking credentials...|Preparing access...").split("|");
  const logs=(buffer.dataset.bufferLogs||gate.dataset.bufferLogs||"ACCOUNT ROUTE...|CREDENTIAL CHECK...|SESSION HANDOFF...").split("|");
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??false;
  if(signal?.aborted)throw abortError();
  const operationResult=holdUntil?holdUntil.then(value=>({ok:true as const,value}),error=>({ok:false as const,error})):Promise.resolve({ok:true as const,value:undefined});
  buffer.hidden=false;
  buffer.setAttribute("aria-hidden","false");
  gate.dataset.atlasBuffering="true";
  progress.style.transformOrigin="left center";
  progress.style.willChange="transform";
  progress.style.transform="scaleX(0)";
  const activeAnimations:Array<ReturnType<typeof animate>>=[];
  const scope=createScope({root:gate}).add(self=>{
    if(!self)return;
    const orbit=buffer.querySelector<HTMLElement>(".atlas-buffer-orbit");
    const scan=buffer.querySelector<HTMLElement>(".atlas-buffer-scan");
    const core=buffer.querySelector<HTMLElement>(".atlas-buffer-core");
    if(orbit&&!reduced)animate(orbit,{rotate:"1turn",duration:7200,ease:"linear",loop:true});
    if(scan&&!reduced)animate(scan,{translateX:["-55%","55%"],duration:4600,ease:"inOutSine",alternate:true,loop:true});
    if(core&&!reduced)animate(core,{scale:[.99,1.02],duration:3600,ease:"inOutSine",alternate:true,loop:true});
  });
  const firstStage=stages[0]||"Verifying account access...";
  const firstLog=logs[0]||"ACCOUNT CHECK";
  status.textContent=firstStage;
  status.dataset.technicalStep=firstLog;
  status.setAttribute("aria-label",firstStage+" · "+firstLog);
  try{
    const durationMs=Math.max(0,duration);
    if(reduced)progress.style.transform="scaleX(.92)";
    else if(durationMs>0)activeAnimations.push(animate(progress,{scaleX:[0,.92],duration:durationMs,ease:"linear"}));
    const [outcome]=await Promise.all([operationResult,wait(durationMs,signal)]);
    if(signal?.aborted)throw abortError();
    if(!outcome.ok)throw outcome.error;
    if(reduced)progress.style.transform="scaleX(1)";
    else{activeAnimations.push(animate(progress,{scaleX:[.92,1],duration:200,ease:"outCubic"}));await wait(200,signal);}
    status.textContent=stages[stages.length-1]||"Access confirmed.";
    status.dataset.technicalStep=logs[logs.length-1]||"SESSION READY";
    status.setAttribute("aria-label",status.textContent+" · "+status.dataset.technicalStep);
  }finally{
    for(const animation of activeAnimations)animation.pause();
    scope.revert();
    delete gate.dataset.atlasBuffering;
    buffer.hidden=true;
    buffer.setAttribute("aria-hidden","true");
    progress.style.transform="scaleX(0)";
    progress.style.willChange="";
    progress.style.transformOrigin="";
    status.style.opacity="";
    status.style.transform="";
    delete status.dataset.technicalStep;
    status.removeAttribute("aria-label");
  }
}
