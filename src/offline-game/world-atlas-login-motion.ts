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
    const timer=window.setTimeout(finish,milliseconds);
    signal?.addEventListener("abort",cancel,{once:true});
  });
}

function withEllipsis(value:string):string {
  return value.replace(/[. …]+$/,"")+"...";
}

async function transitionDiagnostic(
  element:HTMLElement,
  nextText:string,
  signal:AbortSignal|undefined,
  reduced:boolean
):Promise<void> {
  if(reduced){
    element.textContent=nextText;
    return;
  }
  element.style.opacity="0.12";
  element.style.transform="translateY(-3px)";
  await wait(78,signal);
  element.textContent=nextText;
  element.style.opacity="1";
  element.style.transform="translateY(0)";
}

/**
 * Shared Anime.js access presentation.
 * The status console cycles quickly; the indeterminate track and orbit remain smooth
 * until both the minimum presentation time and the real verification task are complete.
 * This routine never performs or substitutes for authentication/network work.
 */
export async function playWorldAtlasAccessSequence(
  gate:HTMLElement,
  duration=4000,
  holdUntil?:Promise<unknown>,
  signal?:AbortSignal
):Promise<void> {
  const buffer=gate.querySelector<HTMLElement>("[data-world-atlas-buffer]");
  const status=gate.querySelector<HTMLElement>("[data-atlas-buffer-status]");
  const log=gate.querySelector<HTMLElement>("[data-atlas-buffer-log]");
  const progress=gate.querySelector<HTMLElement>("[data-atlas-buffer-progress]");
  if(!buffer||!status||!log)return;

  const stages=(gate.dataset.bufferStages||buffer.dataset.bufferStages||"Resolving account identity...|Checking account state...|Verifying credentials...|Preparing access...").split("|");
  const logs=(gate.dataset.bufferLogs||buffer.dataset.bufferLogs||"ACCOUNT ROUTE...|CREDENTIAL STORE...|VERIFICATION...|SESSION HANDOFF...").split("|");
  const started=performance.now();
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??false;
  if(signal?.aborted)throw abortError();
  buffer.hidden=false;
  buffer.setAttribute("aria-hidden","false");
  gate.dataset.atlasBuffering="true";

  const scope=createScope({root:gate}).add(self=>{
    if(!self)return;
    const orbit=buffer.querySelector<HTMLElement>(".atlas-buffer-orbit");
    const scan=buffer.querySelector<HTMLElement>(".atlas-buffer-scan");
    const glow=buffer.querySelector<HTMLElement>(".atlas-buffer-core");
    // Keep the progress motion alive even when reduced-motion is requested; only
    // the decorative rotations are softened.
    if(orbit)animate(orbit,{rotate:"1turn",duration:reduced?9000:4200,ease:"linear",loop:true});
    if(scan&&!reduced)animate(scan,{translateX:["-120%","260%"],duration:1350,ease:"inOutSine",loop:true});
    if(glow)animate(glow,{scale:reduced?[.98,1.02]:[.94,1.06],opacity:reduced?[.78,1]:[.58,1],duration:reduced?2400:1150,ease:"inOutSine",loop:true,alternate:true});
    if(progress)animate(progress,{scaleX:[.08,.96],duration:reduced?2400:1250,ease:"inOutSine",loop:true,alternate:true});
  });

  try{
    const interval=reduced?620:310;
    let index=0;
    while(performance.now()-started<duration){
      if(signal?.aborted)throw abortError();
      const stageStarted=performance.now();
      const statusText=withEllipsis(stages[index%stages.length]||"Preparing access");
      const logText=withEllipsis(logs[index%logs.length]||"VERIFYING");
      await Promise.all([
        transitionDiagnostic(status,statusText,signal,reduced),
        transitionDiagnostic(log,logText,signal,reduced)
      ]);
      index++;
      const remaining=interval-(performance.now()-stageStarted);
      if(remaining>0)await wait(remaining,signal);
    }
    if(signal?.aborted)throw abortError();
    // Do not dismiss the presentation while the actual task is still running.
    if(holdUntil)await holdUntil;
    if(signal?.aborted)throw abortError();
  }finally{
    scope.revert();
    delete gate.dataset.atlasBuffering;
    buffer.hidden=true;
    buffer.setAttribute("aria-hidden","true");
    if(progress)progress.style.transform="scaleX(0)";
    status.style.opacity="";
    status.style.transform="";
    log.style.opacity="";
    log.style.transform="";
  }
}
