import type { WorldMapVisualMode } from "./world-map-hierarchy";
import { cacheBundledAugustoPxlAsset, readCachedAugustoPxlAsset } from "./augusto-pxl-vault";

type PxlAnimation = { frames:number[]; fps?:number };
type PxlAsset = {
  status?:"ready"|"pending";
  type?:"image"|"sprite-sheet";
  src?:string;
  frameWidth?:number;
  frameHeight?:number;
  columns?:number;
  animations?:Record<string,PxlAnimation>;
  directions?:Record<string,Record<string,PxlAnimation>>;
};
type PxlManifest = { schemaVersion:number; assets:Record<string,PxlAsset> };

const MANIFEST_URL="/assets/augusto-pxl/manifest.json";
const observers=new WeakMap<HTMLElement,MutationObserver>();
const runningAnimations=new WeakMap<HTMLElement,Animation>();
const objectUrls=new WeakMap<HTMLElement,string>();
const cachedBlobPromises=new Map<string,Promise<Blob|null>>();
let manifestPromise:Promise<PxlManifest|null>|null=null;

function isBundledAssetPath(value:string):boolean {
  return value.startsWith("/assets/augusto-pxl/")&&!value.startsWith("//")&&!value.includes("..");
}
async function loadManifest():Promise<PxlManifest|null> {
  if(!manifestPromise){
    manifestPromise=(async()=>{
      try{
        // This URL is served from the APK bundle; no remote host is contacted.
        const response=await fetch(MANIFEST_URL,{cache:"force-cache"});
        if(!response.ok)return null;
        const value=await response.json() as Partial<PxlManifest>;
        if(value.schemaVersion!==1||!value.assets||typeof value.assets!=="object")return null;
        return value as PxlManifest;
      }catch{return null;}
    })();
  }
  return manifestPromise;
}
async function resolveBundledSource(element:HTMLElement,id:string,src:string):Promise<string> {
  if(!isBundledAssetPath(src))return src;
  const ownUrl=objectUrls.get(element);
  if(ownUrl&&element.dataset.pxlSource===src)return ownUrl;
  const cacheId=id+"@"+src;
  let cachedPromise=cachedBlobPromises.get(cacheId);
  if(!cachedPromise){
    cachedPromise=readCachedAugustoPxlAsset(cacheId).catch(()=>null);
    cachedBlobPromises.set(cacheId,cachedPromise);
  }
  const cached=await cachedPromise;
  if(cached){
    const url=URL.createObjectURL(cached);
    objectUrls.set(element,url);
    element.dataset.pxlSource=src;
    return url;
  }
  // Copy the packaged file to the Android Keystore-backed encrypted cache in
  // the background. The current view uses the APK-bundled file immediately.
  void cacheBundledAugustoPxlAsset(cacheId,src).catch(()=>{});
  element.dataset.pxlSource=src;
  return src;
}
function setImageSource(element:HTMLElement,asset:PxlAsset,src:string):void {
  const image=element instanceof HTMLImageElement?element:element.querySelector<HTMLImageElement>("img");
  const oldUrl=objectUrls.get(element);
  if(oldUrl&&oldUrl!==src){URL.revokeObjectURL(oldUrl);objectUrls.delete(element);}
  if(src.startsWith("blob:"))objectUrls.set(element,src);
  if(image){
    if(image.getAttribute("src")!==src)image.setAttribute("src",src);
    element.dataset.pxlResolved="image";
    return;
  }
  element.style.backgroundImage='url("'+src+'")';
  element.style.backgroundRepeat="no-repeat";
  element.style.backgroundPosition="center";
  element.style.backgroundSize="contain";
  element.dataset.pxlResolved="image";
}
function selectAnimation(asset:PxlAsset,element:HTMLElement):PxlAnimation|null {
  const direction=element.dataset.pxlDirection||"south";
  const motion=element.dataset.pxlMotion||"idle";
  return asset.directions?.[direction]?.[motion]??asset.animations?.[motion]??null;
}
function applySpriteSheet(element:HTMLElement,asset:PxlAsset,src:string):void {
  if(!asset.frameWidth||!asset.frameHeight||!asset.columns)return;
  runningAnimations.get(element)?.cancel();
  const oldUrl=objectUrls.get(element);
  if(oldUrl&&oldUrl!==src){URL.revokeObjectURL(oldUrl);objectUrls.delete(element);}
  if(src.startsWith("blob:"))objectUrls.set(element,src);
  element.style.backgroundImage='url("'+src+'")';
  element.style.backgroundRepeat="no-repeat";
  element.style.width=asset.frameWidth+"px";
  element.style.height=asset.frameHeight+"px";
  const animation=selectAnimation(asset,element);
  if(!animation||!Array.isArray(animation.frames)||animation.frames.length===0){
    element.style.backgroundPosition="0 0";
    element.dataset.pxlResolved="sprite";
    return;
  }
  const positions=animation.frames.map(index=>{
    const x=(index%asset.columns!)*asset.frameWidth!;
    const y=Math.floor(index/asset.columns!)*asset.frameHeight!;
    return {backgroundPosition:"-"+x+"px -"+y+"px"};
  });
  const fps=Math.max(1,Math.min(60,animation.fps??8));
  const motion=element.animate([...positions,...positions.slice(0,1)],{
    duration:Math.max(80,animation.frames.length*1000/fps),
    iterations:Infinity,
    easing:"steps(1,end)",
  });
  runningAnimations.set(element,motion);
  element.dataset.pxlResolved="sprite";
}
async function applyAsset(element:HTMLElement,manifest:PxlManifest):Promise<void> {
  const id=element.dataset.pxlAssetId;
  if(!id)return;
  const asset=manifest.assets[id];
  if(!asset||asset.status!=="ready"||!asset.src||!isBundledAssetPath(asset.src))return;
  const src=await resolveBundledSource(element,id,asset.src);
  const overlay=element.closest<HTMLElement>("[data-world-map-hierarchy]");
  if(!element.isConnected||!overlay||overlay.hidden){
    if(src.startsWith("blob:"))URL.revokeObjectURL(src);
    objectUrls.delete(element);
    return;
  }
  if(asset.type==="sprite-sheet")applySpriteSheet(element,asset,src);
  else setImageSource(element,asset,src);
}
export function mountAugustoPxlAssets(overlay:HTMLElement):void {
  if(overlay.dataset.visualMode!=="augusto-pxl")return;
  const mount=async()=>{
    const manifest=await loadManifest();
    if(!manifest||!overlay.isConnected||overlay.hidden)return;
    overlay.querySelectorAll<HTMLElement>("[data-pxl-asset-id]").forEach(node=>{void applyAsset(node,manifest);});
    if(observers.has(overlay))return;
    const observer=new MutationObserver(records=>{
      if(overlay.hidden)return;
      const touched=new Set<HTMLElement>();
      for(const record of records){
        const node=record.target instanceof HTMLElement?record.target:null;
        if(node?.matches("[data-pxl-asset-id]"))touched.add(node);
        record.addedNodes.forEach(added=>{
          if(!(added instanceof HTMLElement))return;
          if(added.matches("[data-pxl-asset-id]"))touched.add(added);
          added.querySelectorAll<HTMLElement>("[data-pxl-asset-id]").forEach(item=>touched.add(item));
        });
      }
      touched.forEach(node=>{void applyAsset(node,manifest);});
    });
    observer.observe(overlay,{subtree:true,childList:true,attributes:true,attributeFilter:["data-pxl-asset-id","data-pxl-motion","data-pxl-direction"]});
    observers.set(overlay,observer);
  };
  void mount();
}
export function disposeAugustoPxlAssets(overlay:HTMLElement):void {
  observers.get(overlay)?.disconnect();
  observers.delete(overlay);
  overlay.querySelectorAll<HTMLElement>("[data-pxl-asset-id]").forEach(node=>{
    runningAnimations.get(node)?.cancel();
    runningAnimations.delete(node);
    const url=objectUrls.get(node);
    if(url){URL.revokeObjectURL(url);objectUrls.delete(node);}
  });
}
export function isAugustoPxlVisualMode(overlay:HTMLElement|null):boolean {
  return overlay?.dataset.visualMode==="augusto-pxl";
}
