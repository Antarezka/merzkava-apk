import "./idle-home-map.css";

type Place = { id:string; name:string; icon:string; note:string };
const regions:Record<string,{name:string;subtitle:string;terrain:string;places:Place[]}> = {
  "golden-dragon-empire":{name:"Golden Dragon Empire",subtitle:"EASTERN TERRITORIES",terrain:"imperial",places:[
    {id:"capital",name:"Imperial Capital",icon:"♜",note:"Administrative and imperial centre."},
    {id:"nearby-city",name:"Nearby City",icon:"⌂",note:"A nearby urban settlement."},
    {id:"port",name:"Port",icon:"⚓",note:"Coastal transport and trade access."},
    {id:"market",name:"Market",icon:"▤",note:"Local trade and supplies."},
    {id:"pavilion",name:"Pavilion",icon:"⌑",note:"A public gathering and service location."},
    {id:"sparring",name:"Sparring Arena",icon:"⚔",note:"Training and combat practice."},
    {id:"academy",name:"Academy",icon:"⌘",note:"Education and specialist learning."}
  ]},
  "beiming-gu":{name:"Beiming Gu",subtitle:"NORTHERN TERRITORIES",terrain:"northern",places:[
    {id:"heartland",name:"Beiming Heartland",icon:"⌂",note:"Central settlement area."},
    {id:"dojo",name:"Dojo Network",icon:"⚔",note:"Training facilities across the region."},
    {id:"market",name:"Local Market",icon:"▤",note:"Regional trade placeholder."},
    {id:"pavilion",name:"Pavilion",icon:"⌑",note:"Public gathering and service location."},
    {id:"mountain",name:"Mountain Routes",icon:"♢",note:"Routes through the northern highlands."},
    {id:"wilds",name:"Wilds",icon:"♧",note:"Exploration areas beyond settlements."},
    {id:"basin",name:"Basin",icon:"◉",note:"Regional landmark and travel destination."}
  ]},
  "tianhai-yunzhou":{name:"Tianhai Yunzhou",subtitle:"SOUTHWESTERN FLOATING TERRITORIES",terrain:"floating",places:[
    {id:"yunxiao",name:"Yunxiao Terrace",icon:"⌂",note:"Central settlement area."},
    {id:"cangqiong",name:"Cangqiong Harbor",icon:"⚓",note:"Harbor and transport connection."},
    {id:"haiyue",name:"Haiyue Market",icon:"▤",note:"Market and trading district."},
    {id:"westwake",name:"Westwake Anchorage",icon:"⚓",note:"Anchorage and maritime access."},
    {id:"pearlstep",name:"Pearlstep Landing",icon:"⌁",note:"Landing and transit location."},
    {id:"linggong",name:"Linggong District",icon:"⌘",note:"Arcanistry and industrial facilities."},
    {id:"academy",name:"Academies & Institute",icon:"⌑",note:"Education and Arcanistry services."},
    {id:"dojo",name:"Five Dojos",icon:"⚔",note:"Training facilities."}
  ]}
};
const globalPlaces:Place[]=[
  {id:"guild",name:"Spirit Hunters Guild",icon:"✧",note:"Contract and guild services."},
  {id:"auction",name:"Auction House",icon:"♜",note:"High-value auction destination in the Lawless Territories."},
  {id:"underground-arena",name:"Underground Arena",icon:"⚔",note:"Underground combat destination in the Lawless Territories."},
  {id:"lawless",name:"Lawless Territories",icon:"⌖",note:"A separate world destination, not part of the three regional home maps."}
];
function marker(p:Place,index:number,group:string):string {
 const positions=["left:12%;top:28%","left:43%;top:18%","left:72%;top:31%","left:20%;top:55%","left:55%;top:48%","left:78%;top:66%","left:37%;top:76%","left:63%;top:83%"];
 return '<button type="button" class="idle-map-marker" data-idle-place="'+p.id+'" data-idle-group="'+group+'" style="'+positions[index%positions.length]+'" aria-label="'+p.name+' · Coming Soon"><span>'+p.icon+'</span><small>'+p.name+'</small></button>';
}
export function renderIdleHomeMap():string {
 const regionViews=Object.entries(regions).map(([id,r],i)=>'<section class="idle-map-region '+(i===0?'is-active':'')+'" data-idle-map-region="'+id+'" data-terrain="'+r.terrain+'" '+(i===0?'':'hidden')+'><div class="idle-map-landmass"><div class="idle-map-ridge ridge-a"></div><div class="idle-map-ridge ridge-b"></div><div class="idle-map-river"></div><div class="idle-map-road road-a"></div><div class="idle-map-road road-b"></div><div class="idle-map-home"><span>⌂</span><small>HOME</small></div>'+r.places.map((p,n)=>marker(p,n,"regional")).join("")+'</div></section>').join("");
 return '<div class="expedition-idle-modal" data-idle-rpg-modal hidden><button type="button" class="expedition-idle-backdrop" data-idle-rpg-close aria-label="Close Idle RPG map"></button><section class="idle-home-dialog" role="dialog" aria-modal="true" aria-labelledby="idle-home-title"><header class="idle-home-header"><div><span class="idle-home-kicker">MERZKAVA · OFFLINE WORLD</span><h3 id="idle-home-title">World Navigation</h3><small class="idle-region-subtitle" data-idle-region-subtitle>'+regions["golden-dragon-empire"].subtitle+'</small></div><button type="button" class="idle-home-close" data-idle-rpg-close aria-label="Close map">×</button></header><nav class="idle-region-switch" aria-label="Select region">'+Object.entries(regions).map(([id,r],i)=>'<button type="button" data-idle-region="'+id+'" class="'+(i===0?'is-active':'')+'">'+r.name+'</button>').join("")+'</nav><div class="idle-map-stage">'+regionViews+'<div class="idle-map-caption"><span data-idle-region-name>Golden Dragon Empire</span><small>ISOMETRIC HOME MAP · PREVIEW</small></div><div class="idle-map-compass">N<br>✦</div></div><section class="idle-destination-drawer"><div class="idle-destination-heading"><strong>WORLD DESTINATIONS</strong><small>SEPARATE LOCATIONS</small></div><div class="idle-global-places">'+globalPlaces.map((p,n)=>marker(p,n,"global")).join("")+'</div></section><aside class="idle-coming-panel" data-idle-place-panel aria-live="polite"><div><span class="idle-panel-kicker">DESTINATION SELECTED</span><strong data-idle-place-name>Choose a map marker</strong><p data-idle-place-note>Tap a location directly on the map to preview its destination.</p></div><span class="idle-coming-tag">COMING SOON</span></aside><footer class="idle-home-footer"><span>FREE LOCATION SELECTION</span><span>IDLE SIMULATION · COMING SOON</span></footer></section></div>';
}
