export type ProjectedPoint={x:number;y:number};
export type PixiGridProjection={
  halfW?:number;halfH?:number;centerX?:number;offsetY?:number;
  imageScaleX?:number;imageScaleY?:number;
};

/** Pure isometric projection, including fractional positions inside a cell. */
export function projectIsoActorPosition(
  actor:ProjectedPoint,
  grid:{cols:number;rows:number;tileW:number;tileH:number;offsetX:number;offsetY:number},
  projection:PixiGridProjection={}
):ProjectedPoint {
  const halfW=projection.halfW??grid.tileW/2;
  const halfH=projection.halfH??grid.tileH/2;
  const centerX=projection.centerX??grid.rows*halfW+grid.offsetX;
  const offsetY=projection.offsetY??grid.offsetY;
  const x=(actor.x-actor.y)*halfW+centerX;
  const y=(actor.x+actor.y)*halfH+offsetY+halfH;
  if(projection.imageScaleX!==undefined||projection.imageScaleY!==undefined){
    return {
      x:x*(projection.imageScaleX??1),
      y:y*(projection.imageScaleY??1)-22
    };
  }
  return {x,y:y-22};
}
