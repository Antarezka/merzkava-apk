import { animate, createScope } from "animejs";

function abortError(): Error {
  const error = new Error("World Atlas login was cancelled.");
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

/** Four-second presentation sequence. Real source/password checks run separately. */
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

  const stages=(gate.dataset.bufferStages||"Resolving player record...|Checking world data snapshot...|Verifying local credential...|Preparing Atlas access...").split("|");
  const logs=(gate.dataset.bufferLogs||"IDENTITY ROUTE ...|SOURCE SNAPSHOT ...|LOCAL VERIFIER ...|SESSION HANDOFF ...").split("|");
  const started=performance.now();
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??false;
  if(signal?.aborted)throw abortError();
  buffer.hidden=false;
  buffer.setAttribute("aria-hidden","false");
  gate.dataset.atlasBuffering="true";

  const scope=createScope({root:gate}).add(self=>{
    if(!self||reduced)return;
    const orbit=buffer.querySelector<HTMLElement>(".atlas-buffer-orbit");
    const scan=buffer.querySelector<HTMLElement>(".atlas-buffer-scan");
    const glow=buffer.querySelector<HTMLElement>(".atlas-buffer-core");
    if(orbit)animate(orbit,{rotate:"1turn",duration:2600,ease:"linear",loop:true});
    if(scan)animate(scan,{translateX:["-120%","260%"],duration:1450,ease:"inOutSine",loop:true});
    if(glow)animate(glow,{scale:[.94,1.06],opacity:[.58,1],duration:1150,ease:"inOutSine",loop:true,alternate:true});
    if(progress)animate(progress,{scaleX:[0,1],duration,ease:"linear"});
  });

  try{
    const stageDuration=duration/stages.length;
    for(let index=0;index<stages.length;index++){
      status.textContent=stages[index]||"Preparing access...";
      log.textContent=logs[index]||"VERIFYING ...";
      await wait(stageDuration,signal);
    }
    const elapsed=performance.now()-started;
    if(elapsed<duration)await wait(duration-elapsed,signal);
    if(signal?.aborted)throw abortError();
    // Keep the visual buffer present until the live source check has actually settled.
    if(holdUntil)await holdUntil;
    if(signal?.aborted)throw abortError();
  }finally{
    scope.revert();
    delete gate.dataset.atlasBuffering;
    buffer.hidden=true;
    buffer.setAttribute("aria-hidden","true");
    if(progress)progress.style.transform="scaleX(0)";
  }
}
