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
  const log=buffer?.querySelector<HTMLElement>("[data-atlas-buffer-log]");
  const progress=buffer?.querySelector<HTMLElement>("[data-atlas-buffer-progress]");
  if(!buffer||!status||!log||!progress)return;

  const stages=(buffer.dataset.bufferStages||gate.dataset.bufferStages||"Resolving account identity...|Checking account state...|Verifying credentials...|Preparing access...").split("|");
  const logs=(buffer.dataset.bufferLogs||gate.dataset.bufferLogs||"ACCOUNT ROUTE...|CREDENTIAL STORE...|VERIFICATION...|SESSION HANDOFF...").split("|");
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??false;
  if(signal?.aborted)throw abortError();

  const operationResult=holdUntil
    ?holdUntil.then(
      value=>({ok:true as const,value}),
      error=>({ok:false as const,error})
    )
    :Promise.resolve({ok:true as const,value:undefined});

  buffer.hidden=false;
  buffer.setAttribute("aria-hidden","false");
  gate.dataset.atlasBuffering="true";
  progress.style.transform="scaleX(0)";

  const activeAnimations:Array<ReturnType<typeof animate>>=[];
  const runAnimation=(target:HTMLElement,parameters:Parameters<typeof animate>[1])=>{
    const animation=animate(target,parameters);
    activeAnimations.push(animation);
    return animation;
  };

  const scope=createScope({root:gate}).add(self=>{
    if(!self)return;
    const orbit=buffer.querySelector<HTMLElement>(".atlas-buffer-orbit");
    const scan=buffer.querySelector<HTMLElement>(".atlas-buffer-scan");
    const glow=buffer.querySelector<HTMLElement>(".atlas-buffer-core");
    if(orbit)animate(orbit,{rotate:"1turn",duration:reduced?9000:4200,ease:"linear",loop:true});
    if(scan&&!reduced)animate(scan,{translateX:["-120%","260%"],duration:1350,ease:"inOutSine",loop:true});
    if(glow)animate(glow,{scale:reduced?[.98,1.02]:[.94,1.06],opacity:reduced?[.78,1]:[.58,1],duration:reduced?2400:1150,ease:"inOutSine",loop:true,alternate:true});
  });

  const transitionDiagnostic=async(element:HTMLElement,nextText:string)=>{
    if(signal?.aborted)throw abortError();
    if(reduced){
      element.textContent=nextText;
      return;
    }
    runAnimation(element,{opacity:[1,0],translateY:[0,-3],duration:24,ease:"inQuad"});
    await wait(24,signal);
    element.textContent=nextText;
    runAnimation(element,{opacity:[0,1],translateY:[3,0],duration:40,ease:"outQuad"});
    await wait(40,signal);
  };
  const showFrame=async(stage:string,logLine:string,dots:number)=>{
    await Promise.all([
      transitionDiagnostic(status,formatAccessDiagnosticFrame(stage,dots)),
      transitionDiagnostic(log,formatAccessDiagnosticFrame(logLine,dots))
    ]);
  };
  const moveProgress=async(from:number,to:number,milliseconds:number)=>{
    if(signal?.aborted)throw abortError();
    if(reduced){
      progress.style.transform="scaleX("+(to/100)+")";
      await wait(milliseconds,signal);
      return;
    }
    runAnimation(progress,{scaleX:[from/100,to/100],duration:milliseconds,ease:"outSine"});
    await wait(milliseconds,signal);
  };

  try{
    const plan=createWorldAtlasProgressPlan(Math.max(stages.length,logs.length),duration);
    let previousProgress=0;
    for(let index=0;index<plan.length;index++){
      if(signal?.aborted)throw abortError();
      const step=plan[index];
      const stage=stages[index%stages.length]||"Preparing access";
      const logLine=logs[index%logs.length]||"VERIFYING";

      // The first frame accompanies movement. The next two replace it while
      // the bar is stopped at this checkpoint, giving the requested stutter.
      await showFrame(stage,logLine,1);
      await moveProgress(previousProgress,step.target,step.advanceMs);
      await showFrame(stage,logLine,2);
      await showFrame(stage,logLine,3);
      await wait(step.stallMs,signal);
      previousProgress=step.target;
    }

    // A slow source/credential operation holds the bar near completion while
    // the same current frame continues its subtle dot animation.
    let outcome:Awaited<typeof operationResult>|null=null;
    let dotFrame=1;
    while(!outcome){
      outcome=await Promise.race([
        operationResult,
        wait(180,signal).then(()=>null)
      ]);
      if(!outcome){
        const stage=stages[stages.length-1]||"Finalizing access";
        const logLine=logs[logs.length-1]||"FINAL HANDSHAKE";
        await showFrame(stage,logLine,dotFrame);
        dotFrame=dotFrame===3?1:dotFrame+1;
      }
    }
    if(signal?.aborted)throw abortError();
    if(!outcome.ok)throw outcome.error;

    await moveProgress(previousProgress,100,reduced?0:220);
    await showFrame(stages[stages.length-1]||"Access complete",logs[logs.length-1]||"SESSION READY",3);
  }finally{
    for(const animation of activeAnimations)animation.pause();
    scope.revert();
    delete gate.dataset.atlasBuffering;
    buffer.hidden=true;
    buffer.setAttribute("aria-hidden","true");
    progress.style.transform="scaleX(0)";
    status.style.opacity="";
    status.style.transform="";
    log.style.opacity="";
    log.style.transform="";
  }
}
