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
const positions=["left:15%;top:27%","left:43%;top:18%","left:76%;top:30%","left:22%;top:57%","left:54%;top:48%","left:78%;top:69%","left:39%;top:79%","left:65%;top:84%"];
function marker(p:Place,index:number,group:string):string {
 return '<button type="button" class="idle-map-marker" data-idle-place="'+p.id+'" data-idle-group="'+group+'" data-idle-note="'+p.note+'" style="'+positions[index%positions.length]+'" aria-label="'+p.name+' · Coming Soon"><span>'+p.icon+'</span><small>'+p.name+'</small></button>';
}
function destination(p:Place,group:string,index:number):string {
 return '<button type="button" class="idle-destination-option '+(index===0?'is-selected':'')+'" data-idle-place="'+p.id+'" data-idle-group="'+group+'" data-idle-note="'+p.note+'"><span class="idle-destination-index">'+String(index+1).padStart(2,"0")+'</span><span class="idle-destination-symbol">'+p.icon+'</span><span class="idle-destination-name">'+p.name+'</span><span class="idle-destination-status">COMING SOON</span><span class="idle-destination-arrow">›</span></button>';
}
export function renderIdleHomeMap():string {
 const first=Object.entries(regions)[0];
 const regionViews=Object.entries(regions).map(([id,r],i)=>'<section class="idle-map-region '+(i===0?'is-active':'')+'" data-idle-map-region="'+id+'" data-terrain="'+r.terrain+'" '+(i===0?'':'hidden')+'><div class="idle-map-landmass"><div class="idle-map-ridge ridge-a"></div><div class="idle-map-ridge ridge-b"></div><div class="idle-map-river"></div><div class="idle-map-road road-a"></div><div class="idle-map-road road-b"></div><div class="idle-map-home"><span>⌂</span><small>YOU ARE HERE</small></div>'+r.places.map((p,n)=>marker(p,n,"regional")).join("")+'</div></section>').join("");
 const regionalList=first[1].places.map((p,n)=>destination(p,"regional",n)).join("");
 return '<div class="expedition-idle-modal" data-idle-rpg-modal hidden><button type="button" class="expedition-idle-backdrop" data-idle-rpg-close aria-label="Close World Navigation"></button><section class="idle-home-dialog" role="dialog" aria-modal="true" aria-labelledby="idle-home-title"><header class="idle-home-header"><div><span class="idle-home-kicker">MERZKAVA · WORLD ATLAS</span><h3 id="idle-home-title">World Navigation</h3><small class="idle-region-subtitle" data-idle-region-subtitle>'+first[1].subtitle+'</small></div><button type="button" class="idle-home-close" data-idle-rpg-close aria-label="Close map">×</button></header><nav class="idle-region-switch" aria-label="Select region">'+Object.entries(regions).map(([id,r],i)=>'<button type="button" data-idle-region="'+id+'" class="'+(i===0?'is-active':'')+'"><span>0'+(i+1)+'</span>'+r.name+'</button>').join("")+'</nav><div class="idle-navigation-layout"><div class="idle-map-stage"><aside class="idle-calendar-hud" aria-label="World calendar placeholder"><svg class="idle-calendar-rail" viewBox="0 0 260 54" aria-hidden="true"><path d="M2 45H18L29 12H178L190 29H222L235 4H258"/><path d="M29 18H178M190 35H222M235 10H258" class="idle-calendar-rail-inner"/><path d="M18 45l5-5m7-28 5-5m155 22 5-5m45-20 5-5" class="idle-calendar-ticks"/><circle cx="18" cy="45" r="2.5"/><circle cx="235" cy="4" r="2.5"/></svg><div class="idle-calendar-data"><div class="idle-calendar-day"><span class="idle-calendar-day-label">DAY</span><strong>00</strong><span class="idle-calendar-weekday">THURSDAY</span></div><div class="idle-calendar-time"><strong>00:00</strong><span class="idle-calendar-cycle"><i aria-hidden="true">◇</i><b>— — —</b></span></div></div><div class="idle-calendar-icons" aria-hidden="true"><span>◇</span><span>□</span><span>○</span></div></aside>'+regionViews+'<div class="idle-map-caption"><span data-idle-region-name>'+first[1].name+'</span><small>REGIONAL MAP · SELECT A DESTINATION</small></div><div class="idle-map-compass">N<br>✦</div><div class="idle-map-scale">MERZKAVA WORLD ATLAS <span>✦</span> FIELD MAP</div></div><aside class="idle-destination-menu"><div class="idle-destination-menu-head"><span>DESTINATION INDEX</span><small data-idle-destination-count>07 LOCATIONS</small></div><div class="idle-destination-list" data-idle-destination-list>'+regionalList+'</div><div class="idle-global-menu"><div class="idle-destination-menu-head"><span>WORLDWIDE</span><small>ALL REGIONS</small></div>'+globalPlaces.map((p,n)=>destination(p,"global",n)).join("")+'</div></aside></div><aside class="idle-coming-panel" data-idle-place-panel aria-live="polite"><div><span class="idle-panel-kicker">SELECTED DESTINATION</span><strong data-idle-place-name>Imperial Capital</strong><p data-idle-place-note>Administrative and imperial centre.</p></div><span class="idle-coming-tag">COMING SOON</span></aside><footer class="idle-home-footer"><span>FREE LOCATION SELECTION</span><span>IDLE SIMULATION · COMING SOON</span></footer></section></div>';
}
