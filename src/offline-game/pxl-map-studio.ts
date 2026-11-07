import "./pxl-map-studio.css";
import {
  ACADEMY_ISOMETRIC_GRID,
  ACADEMY_MAP_BASE_DIMENSIONS,
  isoMapStorageKey,
  normalizeIsoMapEditorData,
  normalizeIsoCanvasExpansion,
  toggleIsoQuadrantLayer,
  type IsoMapEditorData,
  type IsoMapPoint,
  type IsoQuadrant,
  type IsoQuadrantLayer,
} from "./isometric-map-editor";
import { TIANHAI_ACADEMY_MAP_REFERENCE } from "./tianhai-academy-map-reference";
import { TIANHAI_ACADEMY_PXL_LABELS, type TianhaiAcademyMapLabel } from "./tianhai-academy-map-labels";

export const TIANHAI_PXL_SANDBOX_MAP_ID = "pxl-studio:tianhai-academy:exterior";
const MAP_WIDTH=ACADEMY_MAP_BASE_DIMENSIONS.width;
const MAP_HEIGHT=ACADEMY_MAP_BASE_DIMENSIONS.height;
const LABELS_KEY="merzkava.augusto-pxl.map-labels.v1:"+encodeURIComponent(TIANHAI_PXL_SANDBOX_MAP_ID);
const DATA_KEY="merzkava.augusto-pxl.map-data.v1:"+isoMapStorageKey(TIANHAI_PXL_SANDBOX_MAP_ID);
const CANVAS_KEY="merzkava.augusto-pxl.merzkava.academy-canvas-expansion.v2";
const SECTORS:IsoQuadrant[]=["tl-a","tl-b","tr-a","tr-b","bl-a","bl-b","br-a","br-b"];
type StudioTab="labels"|"cells"|"validate"|"export";
type Marker="O"|"X"|"opacity";
type StudioLabel=TianhaiAcademyMapLabel;
type StudioData=IsoMapEditorData;

function copyLabels(value:StudioLabel[]):StudioLabel[] {
  return value.map(label=>({...label,points:label.points.map(point=>[point[0],point[1]] as [number,number])}));
}
function loadData():StudioData {
  try{
    const saved=JSON.parse(localStorage.getItem(DATA_KEY)||"null");
    return normalizeIsoMapEditorData(saved||TIANHAI_ACADEMY_MAP_REFERENCE,TIANHAI_PXL_SANDBOX_MAP_ID,ACADEMY_ISOMETRIC_GRID);
  }catch{
    return normalizeIsoMapEditorData(TIANHAI_ACADEMY_MAP_REFERENCE,TIANHAI_PXL_SANDBOX_MAP_ID,ACADEMY_ISOMETRIC_GRID);
  }
}
function loadLabels():StudioLabel[] {
  try{
    const value=JSON.parse(localStorage.getItem(LABELS_KEY)||"null");
    if(Array.isArray(value))return value.filter(item=>item&&typeof item.id==="string"&&Array.isArray(item.points)&&item.points.length>=3) as StudioLabel[];
  }catch{/* Use the bundled map structure if local storage is unavailable. */}
  return copyLabels(TIANHAI_ACADEMY_PXL_LABELS);
}
function loadCanvasExpansion():ReturnType<typeof normalizeIsoCanvasExpansion> {
  try{return normalizeIsoCanvasExpansion(JSON.parse(localStorage.getItem(CANVAS_KEY)||"{}"));}
  catch{return normalizeIsoCanvasExpansion(null);}
}
function centerOf(x:number,y:number,grid:StudioData["grid"]):IsoMapPoint {
  return {
    x:(x-y)*grid.tileW/2+grid.rows*grid.tileW/2+grid.offsetX,
    y:(x+y)*grid.tileH/2+grid.offsetY+grid.tileH/2,
  };
}
function sectorTriangles(x:number,y:number,grid:StudioData["grid"]):Record<IsoQuadrant,IsoMapPoint[]> {
  const center=centerOf(x,y,grid),halfW=grid.tileW/2,halfH=grid.tileH/2;
  const top={x:center.x,y:center.y-halfH},right={x:center.x+halfW,y:center.y};
  const bottom={x:center.x,y:center.y+halfH},left={x:center.x-halfW,y:center.y};
  const middle=(a:IsoMapPoint,b:IsoMapPoint)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
  const nw=middle(top,left),ne=middle(top,right),sw=middle(left,bottom),se=middle(right,bottom);
  return {
    "tl-a":[top,center,nw],"tl-b":[center,left,nw],
    "tr-a":[top,ne,center],"tr-b":[ne,right,center],
    "bl-a":[left,center,sw],"bl-b":[sw,bottom,center],
    "br-a":[center,right,se],"br-b":[se,bottom,center],
  };
}
function polygonPoints(points:Array<[number,number]>):string {
  return points.map(([x,y])=>x.toFixed(1)+","+y.toFixed(1)).join(" ");
}
function labelColor(category:string):string {
  const colors:Record<string,string>={
    "student-zone":"#e9c56b","dojo":"#df8a68","spirit-training":"#c58de6",
    "arcanist-learning":"#79c4d2","instructor-quarters":"#86bf92",
    "path":"#7ed59a","courtyard":"#d3c69a","training-yard":"#db9569",
    "gate":"#f1d88c","pond":"#65b8d5","building":"#e0a96d",
    "dojo-building":"#e08b70","spirit-training-ring":"#cb9ae9",
    "arcanist-yard":"#83c8d5","garden":"#93c47b",
    "tree-canopy":"#a8cf79","boundary":"#d98b73","bridge":"#d4ba87",
  };
  return colors[category]||"#d7c8a0";
}
function markerLayer(marker:Marker):IsoQuadrantLayer {
  return marker==="O"?"foregroundQuadrants":marker==="X"?"blockedQuadrants":"opacityQuadrants";
}

export function renderPxlMapStudioMarkup():string {
  return '<div class="pxl-studio" data-pxl-studio>'+
    '<aside class="pxl-studio-rail" data-pxl-studio-rail aria-label="PXL Cell Editor controls">'+
      '<button type="button" class="pxl-studio-grip" data-pxl-studio-grip aria-label="Pull editor control board open or closed" title="Pull to open / push to hide"><i></i><i></i><i></i></button>'+
      '<div class="pxl-studio-rail-actions">'+
        '<button type="button" data-pxl-studio-tab="labels" aria-label="Spatial labels"><b>⌁</b><small>LABEL</small></button>'+
        '<button type="button" data-pxl-studio-tab="cells" aria-label="Isometric cell markers"><b>▦</b><small>CELLS</small></button>'+
        '<button type="button" data-pxl-studio-tab="validate" aria-label="Map validation"><b>✓</b><small>CHECK</small></button>'+
        '<button type="button" data-pxl-studio-tab="export" aria-label="Copy AI map data"><b>⧉</b><small>AI DATA</small></button>'+
      '</div>'+
    '</aside>'+
    '<section class="pxl-studio-window" data-pxl-studio-window hidden role="dialog" aria-label="PXL Cell Editor">'+
      '<header class="pxl-studio-window-head" data-pxl-studio-drag><div><b>PXL CELL EDITOR</b><small>TIANHAI YUNZHOU · ACADEMY SANDBOX</small></div><div><button type="button" data-pxl-studio-minimize aria-label="Minimize editor">—</button></div></header>'+
      '<div class="pxl-studio-window-body">'+
        '<section data-pxl-studio-panel="labels">'+
          '<div class="pxl-studio-section-title"><b>FREEFORM SPATIAL LABELS</b><small>Trace real footprints with lasso</small></div>'+
          '<label>LABEL NAME<input type="text" maxlength="100" data-pxl-label-name placeholder="e.g. Western Garden Pond"/></label>'+
          '<label>OBJECT / AREA TYPE<select data-pxl-label-category>'+
            '<option value="path">Path / walkway</option><option value="pond">Pond / water</option><option value="garden">Garden / landscape</option>'+
            '<option value="building">Building</option><option value="dojo">Dojo / training area</option><option value="spirit-training">Advanced Spirit Realm training</option>'+
            '<option value="arcanist-learning">Arcanist learning / workshop</option><option value="instructor-quarters">Teacher / instructor quarters</option>'+
            '<option value="student-zone">Student zone</option><option value="courtyard">Courtyard</option><option value="bridge">Bridge</option>'+
            '<option value="gate">Gate / entrance</option><option value="boundary">Wall / boundary</option><option value="tree-canopy">Tree canopy / foreground object</option>'+
            '</select></label>'+
          '<label>NOTES / VISUAL REFERENCE<textarea rows="2" data-pxl-label-description placeholder="Describe shape, materials, size, depth and reference..."></textarea></label>'+
          '<div class="pxl-studio-button-row"><button type="button" data-pxl-studio-lasso>DRAW LASSO</button><button type="button" data-pxl-studio-lasso-cancel>FINISH / CANCEL</button></div>'+
          '<div class="pxl-studio-button-row"><button type="button" data-pxl-studio-label-delete>DELETE SELECTED</button><button type="button" data-pxl-studio-label-clear>CLEAR SELECTION</button></div>'+
          '<div class="pxl-studio-selected" data-pxl-studio-selected>NO LABEL SELECTED</div>'+
          '<div class="pxl-studio-label-list" data-pxl-studio-label-list></div>'+
          '<small class="pxl-studio-help">Drag around an irregular building, pond, garden or path. Select a contour to move its vertices. Labels remain editor metadata and never enter final artwork.</small>'+
        '</section>'+
        '<section data-pxl-studio-panel="cells" hidden>'+
          '<div class="pxl-studio-section-title"><b>FULL QUADRANT CELL MAPPING</b><small>Same three flags and meanings as the original editor</small></div>'+
          '<div class="pxl-studio-marker-row"><button type="button" data-pxl-studio-marker="O" aria-pressed="true"><b>O</b><small>Foreground</small></button><button type="button" data-pxl-studio-marker="X" aria-pressed="false"><b>X</b><small>Blocked</small></button><button type="button" data-pxl-studio-marker="opacity" aria-pressed="false"><b>◌</b><small>Opacity</small></button></div>'+
          '<p class="pxl-studio-help">Select one marker, then tap individual triangular sectors. O draws the same Map Base above actors; X blocks movement; opacity dims actors behind that sector. Every diamond has eight sectors.</p>'+
          '<div class="pxl-studio-stats" data-pxl-studio-cell-stats>480 base cells · 105 extension cells · 4,680 sectors</div>'+
          '<div class="pxl-studio-button-row"><button type="button" data-pxl-studio-canvas>OPEN CANVAS EDITOR</button><button type="button" data-pxl-studio-redraw>REDRAW GRID</button></div>'+
        '</section>'+
        '<section data-pxl-studio-panel="validate" hidden>'+
          '<div class="pxl-studio-section-title"><b>MAP STRUCTURE VALIDATION</b><small>Validate before artwork generation</small></div>'+
          '<button type="button" data-pxl-studio-validate>RUN FULL MAP CHECK</button>'+
          '<div class="pxl-studio-validation" data-pxl-studio-validation>Not checked yet.</div>'+
          '<div class="pxl-studio-stats" data-pxl-studio-coverage>Coverage will appear here.</div>'+
        '</section>'+
        '<section data-pxl-studio-panel="export" hidden>'+
          '<div class="pxl-studio-section-title"><b>AI / AUGUSTO PXL HANDOFF</b><small>One complete mapping package</small></div>'+
          '<p class="pxl-studio-help">Copies the full Map Base dimensions, canvas expansion, lasso contours, every cell coordinate, all eight sector states, walkability and the map-generation brief.</p>'+
          '<textarea rows="8" data-pxl-studio-export readonly spellcheck="false" placeholder="Use COPY DATA FOR AI to prepare the complete PXL map package..."></textarea>'+
          '<button type="button" data-pxl-studio-copy>COPY DATA FOR AI</button>'+
        '</section>'+
        '<div class="pxl-studio-actions"><button type="button" data-pxl-studio-save>SAVE DRAFT</button><button type="button" data-pxl-studio-confirm>CONFIRM MAPPING</button><button type="button" data-pxl-studio-copy> COPY DATA </button></div>'+
        '<output class="pxl-studio-status" data-pxl-studio-status>Pull the right-hand handle to open the controls.</output>'+
      '</div>'+
    '</section>'+
    '<svg class="pxl-studio-svg" data-pxl-studio-svg viewBox="0 0 '+MAP_WIDTH+' '+MAP_HEIGHT+'" preserveAspectRatio="none" aria-label="Editor-only labels and isometric quadrant mapping">'+
      '<g data-pxl-cell-grid></g><g data-pxl-label-layer></g><g data-pxl-lasso-preview></g><g data-pxl-label-handles></g>'+
    '</svg>'+
  '</div>';
}

export function bindPxlMapStudio(dialog:HTMLElement,onEditingChange?:(active:boolean)=>void):void {
  const studio=dialog.querySelector<HTMLElement>("[data-pxl-studio]");
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  const svg=studio?.querySelector<SVGSVGElement>("[data-pxl-studio-svg]");
  const rail=studio?.querySelector<HTMLElement>("[data-pxl-studio-rail]");
  const windowPanel=studio?.querySelector<HTMLElement>("[data-pxl-studio-window]");
  if(!studio||!board||!svg||!rail||!windowPanel||studio.dataset.bound==="true")return;
  studio.dataset.bound="true";
  board.dataset.editorPaused="false";

  let data=loadData();
  let labels=loadLabels();
  let activeTab:StudioTab="labels";
  let activeMarker:Marker="O";
  let selectedLabelId:string|null=null;
  let lassoActive=false;
  let drawing=false;
  let dragVertex:{labelId:string;index:number}|null=null;
  let currentPoints:IsoMapPoint[]=[];
  let editorPaused=false;

  const group=(selector:string)=>svg.querySelector<SVGGElement>(selector);
  const cellRoot=group("[data-pxl-cell-grid]")!;
  const labelRoot=group("[data-pxl-label-layer]")!;
  const previewRoot=group("[data-pxl-lasso-preview]")!;
  const handleRoot=group("[data-pxl-label-handles]")!;
  const status=()=>studio.querySelector<HTMLOutputElement>("[data-pxl-studio-status]");
  const say=(message:string)=>{const node=status();if(node)node.value=message;};
  const setEditorPaused=(active:boolean)=>{
    if(editorPaused===active)return;
    editorPaused=active;
    board.classList.toggle("pxl-studio-board-active",active);
    board.dataset.editorPaused=String(active);
    board.querySelectorAll<HTMLElement>("[data-wmh-player-token],[data-wmh-npc]").forEach(token=>{
      token.getAnimations().forEach(animation=>active?animation.pause():animation.play());
    });
    onEditingChange?.(active);
  };
  const selected=()=>labels.find(label=>label.id===selectedLabelId)||null;
  const readPoint=(event:PointerEvent|MouseEvent):IsoMapPoint|null=>{
    const rect=svg.getBoundingClientRect(),view=svg.viewBox.baseVal;
    if(rect.width<=0||rect.height<=0)return null;
    return {x:(event.clientX-rect.left)*view.width/rect.width,y:(event.clientY-rect.top)*view.height/rect.height};
  };
  const updateLabelFields=()=>{
    const label=selected();
    const name=studio.querySelector<HTMLInputElement>("[data-pxl-label-name]");
    const category=studio.querySelector<HTMLSelectElement>("[data-pxl-label-category]");
    const description=studio.querySelector<HTMLTextAreaElement>("[data-pxl-label-description]");
    const selectedBox=studio.querySelector<HTMLElement>("[data-pxl-studio-selected]");
    if(name)name.value=label?.name||"";
    if(category)category.value=label?.category||"path";
    if(description)description.value=label?.description||"";
    if(selectedBox)selectedBox.textContent=label?label.name+" · "+label.points.length+" vertices":"NO LABEL SELECTED";
  };
  const renderLabelList=()=>{
    const list=studio.querySelector<HTMLElement>("[data-pxl-studio-label-list]");
    if(!list)return;
    list.replaceChildren();
    for(const label of labels){
      const button=document.createElement("button");
      button.type="button";button.dataset.pxlLabelPick=label.id;
      button.className="pxl-studio-label-entry"+(label.id===selectedLabelId?" is-selected":"");
      const swatch=document.createElement("i");swatch.style.background=labelColor(label.category);
      const title=document.createElement("span");title.textContent=label.name;
      const meta=document.createElement("small");meta.textContent=label.category;
      button.append(swatch,title,meta);list.append(button);
    }
  };
  const renderLabels=()=>{
    labelRoot.replaceChildren();handleRoot.replaceChildren();
    for(const label of labels){
      const polygon=document.createElementNS("http://www.w3.org/2000/svg","polygon");
      polygon.dataset.pxlLabelShape=label.id;
      polygon.setAttribute("points",polygonPoints(label.points));
      polygon.setAttribute("fill",labelColor(label.category));
      polygon.setAttribute("fill-opacity",label.id===selectedLabelId?"0.22":"0.10");
      polygon.setAttribute("stroke",labelColor(label.category));
      polygon.setAttribute("stroke-width",label.id===selectedLabelId?"10":"6");
      polygon.setAttribute("vector-effect","non-scaling-stroke");
      polygon.setAttribute("class","pxl-map-label-shape"+(label.id===selectedLabelId?" is-selected":""));
      labelRoot.append(polygon);
      if(label.id===selectedLabelId){
        label.points.forEach((point,index)=>{
          const circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
          circle.dataset.pxlLabelVertex=String(index);
          circle.setAttribute("cx",String(point[0]));circle.setAttribute("cy",String(point[1]));
          circle.setAttribute("r","22");circle.setAttribute("fill","#fff0bd");
          circle.setAttribute("stroke","#20251d");circle.setAttribute("stroke-width","6");
          circle.setAttribute("vector-effect","non-scaling-stroke");
          circle.setAttribute("class","pxl-map-label-vertex");
          circle.style.pointerEvents="all";
          handleRoot.append(circle);
        });
      }
    }
    renderLabelList();
    updateLabelFields();
  };
  const isMarked=(layer:IsoQuadrantLayer,x:number,y:number,sector:IsoQuadrant)=>data[layer].includes(x+","+y+":"+sector);
  const renderCellGrid=()=>{
    cellRoot.replaceChildren();
    const cells=new Set<string>();
    for(let y=0;y<data.grid.rows;y++)for(let x=0;x<data.grid.cols;x++)cells.add(x+","+y);
    data.customGridCells.forEach(key=>cells.add(key));
    const fragment=document.createDocumentFragment();
    for(const coordinate of cells){
      const [x,y]=coordinate.split(",").map(Number);
      const triangles=sectorTriangles(x,y,data.grid);
      for(const sector of SECTORS){
        const polygon=document.createElementNS("http://www.w3.org/2000/svg","polygon");
        const key=x+","+y+":"+sector;
        polygon.dataset.pxlSector=sector;polygon.dataset.pxlCellX=String(x);polygon.dataset.pxlCellY=String(y);
        polygon.setAttribute("points",polygonPoints(triangles[sector].map(point=>[point.x,point.y])));
        polygon.setAttribute("class","pxl-cell-sector");
        const active=isMarked("foregroundQuadrants",x,y,sector)?"O":
          isMarked("blockedQuadrants",x,y,sector)?"X":
          isMarked("opacityQuadrants",x,y,sector)?"opacity":"";
        polygon.dataset.pxlFlag=active;
        if(active==="O"){polygon.setAttribute("fill","#f0c65e");polygon.setAttribute("fill-opacity",".43");}
        else if(active==="X"){polygon.setAttribute("fill","#e16a5e");polygon.setAttribute("fill-opacity",".48");}
        else if(active==="opacity"){polygon.setAttribute("fill","#73aee2");polygon.setAttribute("fill-opacity",".43");}
        else {polygon.setAttribute("fill","#e8dfc1");polygon.setAttribute("fill-opacity",".025");}
        polygon.setAttribute("stroke","#f5e8ca");polygon.setAttribute("stroke-opacity",".22");
        polygon.setAttribute("stroke-width","1");polygon.setAttribute("vector-effect","non-scaling-stroke");
        fragment.append(polygon);
      }
    }
    cellRoot.append(fragment);
  };
  const renderPreview=()=>{
    previewRoot.replaceChildren();
    if(currentPoints.length<2)return;
    const line=document.createElementNS("http://www.w3.org/2000/svg","polyline");
    line.setAttribute("points",polygonPoints(currentPoints.map(point=>[point.x,point.y])));
    line.setAttribute("fill","none");line.setAttribute("stroke","#fff0b5");line.setAttribute("stroke-width","10");
    line.setAttribute("stroke-dasharray","22 14");line.setAttribute("vector-effect","non-scaling-stroke");
    previewRoot.append(line);
  };
  const persist=()=>{
    data.confirmed=false;data.confirmedAt="";
    localStorage.setItem(DATA_KEY,JSON.stringify(data));
    localStorage.setItem(LABELS_KEY,JSON.stringify(labels));
  };
  const renderTab=()=>{
    studio.querySelectorAll<HTMLElement>("[data-pxl-studio-panel]").forEach(panel=>{panel.hidden=panel.dataset.pxlStudioPanel!==activeTab;});
    studio.querySelectorAll<HTMLButtonElement>("[data-pxl-studio-tab]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.pxlStudioTab===activeTab)));
    svg.classList.toggle("is-active",activeTab==="labels"||activeTab==="cells");
    svg.classList.toggle("is-cell-mode",activeTab==="cells");
    svg.classList.toggle("is-lasso-mode",activeTab==="labels"&&lassoActive);
    if(activeTab==="cells")renderCellGrid();
    else cellRoot.replaceChildren();
    renderLabels();
    if(activeTab==="labels")say("Lasso labels: "+labels.length+" · drag to draw an irregular footprint.");
  };
  const openWindow=(tab:StudioTab)=>{
    activeTab=tab;windowPanel.hidden=false;
    rail.classList.add("is-open");
    setEditorPaused(true);
    renderTab();
  };
  const validate=()=>{
    const cellSet=new Set<string>();
    for(let y=0;y<data.grid.rows;y++)for(let x=0;x<data.grid.cols;x++)cellSet.add(x+","+y);
    data.customGridCells.forEach(key=>cellSet.add(key));
    const badLabels=labels.filter(label=>!label.name.trim()||label.points.length<3);
    const startCells=["12,31","7,4","10,9","6,15","22,10"];
    const missingStarts=startCells.filter(key=>!data.walkableCells.includes(key));
    const connectivity=new Set(data.walkableCells);
    let connected=0;
    const seed=connectivity.values().next().value as string|undefined;
    if(seed){
      const queue=[seed];connectivity.delete(seed);
      for(let i=0;i<queue.length;i++){
        const [x,y]=queue[i].split(",").map(Number);
        for(const next of [x+1+","+y,x-1+","+y,x+","+ (y+1),x+","+(y-1)]){
          if(connectivity.has(next)){connectivity.delete(next);queue.push(next);}
        }
      }
      connected=queue.length;
    }
    const counts={
      baseCells:data.grid.cols*data.grid.rows,
      customCells:data.customGridCells.length,
      totalCells:cellSet.size,
      totalQuadrants:cellSet.size*8,
      walkableCells:data.walkableCells.length,
      foregroundSectors:data.foregroundQuadrants.length,
      blockedSectors:data.blockedQuadrants.length,
      opacitySectors:data.opacityQuadrants.length,
      labels:labels.length,
      connectedWalkableCells:connected,
      isolatedWalkableCells:Math.max(0,data.walkableCells.length-connected),
    };
    const issues:string[]=[];
    if(counts.baseCells!==480)issues.push("Base grid is not 24×20.");
    if(counts.totalCells!==585)issues.push("Expected 480 base cells plus 105 custom cells.");
    if(badLabels.length)issues.push(badLabels.length+" label(s) have no name or valid lasso contour.");
    if(missingStarts.length)issues.push("Player/NPC start cells are not walkable: "+missingStarts.join(", "));
    if(counts.walkableCells===0)issues.push("No walkable cells are marked.");
    if(counts.isolatedWalkableCells>0)issues.push(counts.isolatedWalkableCells+" walkable cells are disconnected from the entrance route.");
    if(!counts.foregroundSectors||!counts.blockedSectors||!counts.opacitySectors)issues.push("One or more O/X/opacity quadrant layers are empty.");
    const pass=issues.length===0;
    const report={pass,issues,coverage:counts};
    const node=studio.querySelector<HTMLElement>("[data-pxl-studio-validation]");
    const coverage=studio.querySelector<HTMLElement>("[data-pxl-studio-coverage]");
    if(node)node.textContent=pass?"PASS · full quadrant coverage and connected route":issues.join(" · ");
    if(coverage)coverage.textContent=counts.baseCells+" base + "+counts.customCells+" extension cells · "+counts.totalQuadrants+" quadrants · "+counts.labels+" spatial labels · "+counts.walkableCells+" walkable cells · "+counts.connectedWalkableCells+" connected";
    return report;
  };
  const exportPackage=()=>{
    const validation=validate();
    const canvasExpansion=loadCanvasExpansion();
    return {
      format:"merzkava-pxl-map-studio",
      version:1,
      mapId:TIANHAI_PXL_SANDBOX_MAP_ID,
      mapTitle:"Tianhai Academy · Tianhai Yunzhou",
      canonSources:["world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md","world/REGION_TIANHAI_YUNZHOU.md"],
      visualContract:"Regional/isometric exploration style inspired by Persona 4, Shin Megami Tensei and Raidou Kuzunoha; world map remains unchanged.",
      mapBase:{width:MAP_WIDTH,height:MAP_HEIGHT},
      canvasExpansion,
      grid:data.grid,
      cellMapping:data,
      spatialLabels:labels,
      validation,
      pxlBrief:"Build a large, geographically expansive Academy campus. Keep all architecture small in scale. Preserve organic paths, irregular ponds and gardens, clear outer/inner/core student zones, dojo grounds, advanced Spirit Realm training, academy-level Arcanist instruction and instructor quarters. Player and NPC are 4–8 screen pixels tall at the standard camera scale. No cell grid, lasso, labels or editor symbols may be baked into the output.",
    };
  };
  const refreshExport=()=>{
    const field=studio.querySelector<HTMLTextAreaElement>("[data-pxl-studio-export]");
    if(field)field.value=JSON.stringify(exportPackage(),null,2);
  };
  const chooseLabel=(id:string|null)=>{
    selectedLabelId=id;renderLabels();
  };

  rail.querySelectorAll<HTMLButtonElement>("[data-pxl-studio-tab]").forEach(button=>{
    button.addEventListener("click",()=>openWindow(button.dataset.pxlStudioTab as StudioTab));
  });
  const grip=rail.querySelector<HTMLButtonElement>("[data-pxl-studio-grip]");
  grip?.addEventListener("click",()=>rail.classList.toggle("is-open"));
  grip?.addEventListener("pointerdown",event=>{
    const startX=event.clientX;let moved=false;
    const move=(next:PointerEvent)=>{
      const delta=next.clientX-startX;
      if(Math.abs(delta)>10)moved=true;
      if(moved)rail.classList.toggle("is-open",delta<0);
    };
    const end=()=>{
      window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",end);
      if(moved)event.preventDefault();
    };
    window.addEventListener("pointermove",move,{passive:false});window.addEventListener("pointerup",end,{once:true});
  });
  windowPanel.querySelector<HTMLElement>("[data-pxl-studio-minimize]")?.addEventListener("click",()=>{
    windowPanel.hidden=true;svg.classList.remove("is-active");cellRoot.replaceChildren();
    setEditorPaused(false);
  });
  windowPanel.querySelectorAll<HTMLButtonElement>("[data-pxl-studio-tab]").forEach(button=>button.addEventListener("click",()=>openWindow(button.dataset.pxlStudioTab as StudioTab)));

  const drag=windowPanel.querySelector<HTMLElement>("[data-pxl-studio-drag]");
  drag?.addEventListener("pointerdown",event=>{
    if((event.target as Element).closest("button"))return;
    const rect=windowPanel.getBoundingClientRect(),startX=event.clientX,startY=event.clientY;
    const left=rect.left,top=rect.top;
    const move=(next:PointerEvent)=>{
      windowPanel.style.left=Math.max(4,Math.min(window.innerWidth-windowPanel.offsetWidth-4,left+next.clientX-startX))+"px";
      windowPanel.style.top=Math.max(4,Math.min(window.innerHeight-windowPanel.offsetHeight-4,top+next.clientY-startY))+"px";
      windowPanel.style.right="auto";
    };
    const end=()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",end);};
    window.addEventListener("pointermove",move,{passive:false});window.addEventListener("pointerup",end,{once:true});
  });

  windowPanel.querySelector<HTMLElement>("[data-pxl-studio-lasso]")?.addEventListener("click",()=>{
    activeTab="labels";lassoActive=true;renderTab();say("LASSO ACTIVE · drag around an object or area on the map.");
  });
  windowPanel.querySelector<HTMLElement>("[data-pxl-studio-lasso-cancel]")?.addEventListener("click",()=>{
    lassoActive=false;drawing=false;currentPoints=[];renderPreview();svg.classList.remove("is-lasso-mode");say("Lasso drawing finished.");
  });
  windowPanel.querySelector<HTMLElement>("[data-pxl-studio-label-delete]")?.addEventListener("click",()=>{
    if(!selectedLabelId)return;
    labels=labels.filter(label=>label.id!==selectedLabelId);selectedLabelId=null;renderLabels();say("Selected contour deleted. SAVE DRAFT to keep the change.");
  });
  windowPanel.querySelector<HTMLElement>("[data-pxl-studio-label-clear]")?.addEventListener("click",()=>chooseLabel(null));
  windowPanel.querySelector<HTMLButtonElement>("[data-pxl-studio-validate]")?.addEventListener("click",()=>{const report=validate();say(report.pass?"Map structure check passed.":"Map validation found "+report.issues.length+" issue(s).");});
  windowPanel.querySelector<HTMLButtonElement>("[data-pxl-studio-redraw]")?.addEventListener("click",()=>renderCellGrid());
  windowPanel.querySelector<HTMLButtonElement>("[data-pxl-studio-canvas]")?.addEventListener("click",()=>dialog.querySelector<HTMLButtonElement>("[data-wmh-academy-editor-toggle]")?.click());

  windowPanel.querySelectorAll<HTMLButtonElement>("[data-pxl-studio-marker]").forEach(button=>{
    button.addEventListener("click",()=>{
      activeMarker=button.dataset.pxlStudioMarker as Marker;
      windowPanel.querySelectorAll<HTMLButtonElement>("[data-pxl-studio-marker]").forEach(other=>other.setAttribute("aria-pressed",String(other===button)));
      if(activeTab!=="cells"){activeTab="cells";renderTab();}
      say("Marker "+activeMarker+" selected. Tap the eight-part cell sectors on the map.");
    });
  });

  const nameInput=windowPanel.querySelector<HTMLInputElement>("[data-pxl-label-name]");
  const categoryInput=windowPanel.querySelector<HTMLSelectElement>("[data-pxl-label-category]");
  const descriptionInput=windowPanel.querySelector<HTMLTextAreaElement>("[data-pxl-label-description]");
  nameInput?.addEventListener("change",()=>{
    const label=selected();if(label){label.name=nameInput.value.trim()||label.name;renderLabels();}
  });
  categoryInput?.addEventListener("change",()=>{
    const label=selected();if(label){label.category=categoryInput.value;renderLabels();}
  });
  descriptionInput?.addEventListener("change",()=>{
    const label=selected();if(label){label.description=descriptionInput.value;}
  });
  windowPanel.addEventListener("click",event=>{
    const target=event.target as Element;
    const entry=target.closest<HTMLElement>("[data-pxl-label-pick]");
    if(entry){chooseLabel(entry.dataset.pxlLabelPick||null);}
  });

  svg.addEventListener("pointerdown",event=>{
    const target=event.target as Element;
    if(activeTab==="cells"){
      if(target.closest("[data-pxl-sector]")){event.preventDefault();event.stopPropagation();}
      return;
    }
    if(activeTab!=="labels")return;
    const vertex=target.closest<SVGCircleElement>("[data-pxl-label-vertex]");
    if(vertex&&selectedLabelId){
      event.preventDefault();event.stopPropagation();
      dragVertex={labelId:selectedLabelId,index:Number(vertex.dataset.pxlLabelVertex)};
      try{svg.setPointerCapture(event.pointerId);}catch{/* Capture is optional on older WebViews. */}
      return;
    }
    if(lassoActive){
      const point=readPoint(event);if(!point)return;
      drawing=true;currentPoints=[point];event.preventDefault();event.stopPropagation();
      try{svg.setPointerCapture(event.pointerId);}catch{/* Capture is optional. */}
    }
  });
  svg.addEventListener("pointermove",event=>{
    if(dragVertex){
      const point=readPoint(event),label=labels.find(item=>item.id===dragVertex!.labelId);
      if(point&&label&&label.points[dragVertex.index]){label.points[dragVertex.index]=[point.x,point.y];renderLabels();}
      event.preventDefault();event.stopPropagation();return;
    }
    if(!drawing)return;
    const point=readPoint(event);if(!point)return;
    const last=currentPoints[currentPoints.length-1];
    if(!last||Math.hypot(point.x-last.x,point.y-last.y)>=12){currentPoints.push(point);renderPreview();}
    event.preventDefault();event.stopPropagation();
  });
  const finishDrawing=(event:PointerEvent)=>{
    if(dragVertex){dragVertex=null;persist();say("Lasso vertex moved and saved.");event.stopPropagation();return;}
    if(!drawing)return;
    drawing=false;
    if(currentPoints.length>=3){
      const mapName=nameInput?.value.trim()||"New Spatial Label "+(labels.length+1);
      const category=categoryInput?.value||"path";
      const description=descriptionInput?.value||"";
      const label:StudioLabel={
        id:"label-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7),
        name:mapName,category,points:currentPoints.map(point=>[point.x,point.y]),
        description,zOrder:6,
      };
      labels.push(label);selectedLabelId=label.id;lassoActive=false;
      say("Contour created. Adjust vertices, then SAVE DRAFT.");
    }else say("Lasso discarded: draw a closed contour with at least three points.");
    currentPoints=[];renderPreview();renderTab();event.stopPropagation();
  };
  svg.addEventListener("pointerup",finishDrawing);
  svg.addEventListener("pointercancel",finishDrawing);
  svg.addEventListener("click",event=>{
    const target=event.target as Element;
    const sector=target.closest<SVGPolygonElement>("[data-pxl-sector]");
    if(sector&&activeTab==="cells"){
      const x=Number(sector.dataset.pxlCellX),y=Number(sector.dataset.pxlCellY),id=sector.dataset.pxlSector as IsoQuadrant;
      const changed=toggleIsoQuadrantLayer(data,markerLayer(activeMarker),x,y,id);
      if(changed!==false){persist();renderCellGrid();say(activeMarker+" applied to "+x+","+y+":"+id);}
      event.preventDefault();event.stopPropagation();return;
    }
    const shape=target.closest<SVGPolygonElement>("[data-pxl-label-shape]");
    if(shape&&activeTab==="labels"&&!lassoActive){chooseLabel(shape.dataset.pxlLabelShape||null);event.preventDefault();event.stopPropagation();}
  });
  svg.addEventListener("contextmenu",event=>{
    const target=event.target as Element,vertex=target.closest<SVGCircleElement>("[data-pxl-label-vertex]");
    if(!vertex||!selectedLabelId)return;
    const label=selected();const index=Number(vertex.dataset.pxlLabelVertex);
    if(!label||label.points.length<=3)return;
    event.preventDefault();label.points.splice(index,1);renderLabels();persist();say("Vertex removed.");
  });

  windowPanel.querySelector<HTMLElement>("[data-pxl-studio-save]")?.addEventListener("click",()=>{
    persist();say("Draft saved locally. Spatial labels and cell markers are preserved.");
  });
  windowPanel.querySelector<HTMLElement>("[data-pxl-studio-confirm]")?.addEventListener("click",()=>{
    const report=validate();
    if(!report.pass){say("Cannot confirm yet: "+report.issues.join(" · "));return;}
    data.confirmed=true;data.confirmedAt=new Date().toISOString();
    localStorage.setItem(DATA_KEY,JSON.stringify(data));localStorage.setItem(LABELS_KEY,JSON.stringify(labels));
    say("Mapping confirmed and saved. COPY DATA FOR AI to hand the exact structure to Augusto PXL.");
  });
  windowPanel.querySelectorAll<HTMLElement>("[data-pxl-studio-copy]").forEach(button=>button.addEventListener("click",async()=>{
    refreshExport();
    const field=windowPanel.querySelector<HTMLTextAreaElement>("[data-pxl-studio-export]");
    if(field){
      try{await navigator.clipboard.writeText(field.value);say("Full map structure copied for the next Augusto PXL build.");}
      catch{field.focus();field.select();say("Clipboard unavailable. The complete AI map package is selected in the export box.");}
    }
  }));
  renderTab();
  renderCellGrid();
  svg.classList.remove("is-active");
  const count=validate().coverage;
  const stats=studio.querySelector<HTMLElement>("[data-pxl-studio-cell-stats]");
  if(stats)stats.textContent=count.totalCells+" mapped cells · "+count.totalQuadrants+" sectors · "+count.walkableCells+" walkable";
}
