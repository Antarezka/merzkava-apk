/** Pure geometry for the Arcanistry aperture-to-dial interaction. */
export const ARCANISTRY_ACTIVATION_ANGLE = -90;
export const ARCANISTRY_ACTIVATION_TOLERANCE = 13;

export function normalizeRotaryAngle(angle:number):number {
  return ((angle % 360) + 360) % 360;
}

export function rotaryAngularDistance(from:number,to:number):number {
  const difference=Math.abs(normalizeRotaryAngle(from)-normalizeRotaryAngle(to));
  return Math.min(difference,360-difference);
}

/** Signed shortest movement from the previous pointer angle to the next. */
export function rotaryPointerDelta(previous:number,next:number):number {
  let delta=next-previous;
  if(delta>180) delta-=360;
  if(delta< -180) delta+=360;
  return delta;
}

/** Other apertures close progressively as the selected aperture approaches the activation mark. */
export function rotaryActivationProgress(angle:number,target=ARCANISTRY_ACTIVATION_ANGLE,startAngle=target+180):number {
  const startingDistance=rotaryAngularDistance(startAngle,target);
  const currentDistance=rotaryAngularDistance(angle,target);
  if(startingDistance===0) return currentDistance===0?1:0;
  return Math.max(0,Math.min(1,(startingDistance-currentDistance)/startingDistance));
}

export function isRotaryAligned(angle:number,target=ARCANISTRY_ACTIVATION_ANGLE,tolerance=ARCANISTRY_ACTIVATION_TOLERANCE):boolean {
  return rotaryAngularDistance(angle,target)<=tolerance;
}

/** A route can commit only on a real release, never on alignment alone or cancellation. */
export function canCommitRotaryActivation(angle:number,options:{released:boolean;cancelled?:boolean;hasDestination:boolean}):boolean {
  return options.released&&!options.cancelled&&options.hasDestination&&isRotaryAligned(angle);
}
/** Resulting aperture angle after the pointer moves around the rotor center. */
export function rotaryDragAngle(startApertureAngle:number,pointerStartAngle:number,pointerCurrentAngle:number):number {
  return startApertureAngle+rotaryPointerDelta(pointerStartAngle,pointerCurrentAngle);
}

/** Parse the authored aperture angle without including the player's finger-grab offset. */
export function parseRotaryApertureAngle(value:string|null|undefined):number|null {
  if(!value) return null;
  const parsed=Number.parseFloat(value.replace(/deg\s*$/i,""));
  return Number.isFinite(parsed)?parsed:null;
}
