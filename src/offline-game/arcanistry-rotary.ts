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
export function rotaryActivationProgress(angle:number,target=ARCANISTRY_ACTIVATION_ANGLE):number {
  return Math.max(0,Math.min(1,1-rotaryAngularDistance(angle,target)/180));
}

export function isRotaryAligned(angle:number,target=ARCANISTRY_ACTIVATION_ANGLE,tolerance=ARCANISTRY_ACTIVATION_TOLERANCE):boolean {
  return rotaryAngularDistance(angle,target)<=tolerance;
}
