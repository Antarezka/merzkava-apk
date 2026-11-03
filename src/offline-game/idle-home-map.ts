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
 return '<button type="button" class="idle-map-marker '+(index===0?"is-selected":"")+'" data-idle-place="'+p.id+'" data-idle-group="'+group+'" data-idle-note="'+p.note+'" style="'+positions[index%positions.length]+'" aria-label="'+p.name+' · Coming Soon"><span>'+p.icon+'</span><small>'+p.name+'</small></button>';
}
function destinationHole(p:Place,group:string,index:number,total:number,regionId="golden-dragon-empire"):string {
 const angle=(360/total)*index;
 return '<button type="button" class="arcanist-dial-aperture '+(index===0&&group==="regional"?"is-selected":"") + '" data-idle-place="'+p.id+'" data-idle-group="'+group+'" data-region-id="'+regionId+'" data-idle-note="'+p.note+'" style="--hole-angle:'+angle+'deg" aria-label="'+p.name+'"><span>'+p.icon+'</span><small>'+p.name+'</small></button>';
}
let previousClockStamp:string|null=null;
export function renderIdleHomeMap(clock:{day:number;hour:number;minute:number;cycle:string}|null=null):string {
 const clockStamp=clock?`${clock.day}:${clock.hour}:${clock.minute}`:"preview";
 const timeMoved=previousClockStamp!==null&&previousClockStamp!==clockStamp;
 previousClockStamp=clockStamp;
 const dayLabel=clock?String(clock.day).padStart(2,"0"):"— —";
 const hour12=clock?String((clock.hour%12)||12).padStart(2,"0"):"— —";
 const minuteLabel=clock?String(clock.minute).padStart(2,"0"):"— —";
 const cycleLabel=clock?.cycle??"WORLD TIME";
 const first=Object.entries(regions)[0];
 const regionViews=Object.entries(regions).map(([id,r],i)=>'<section class="idle-map-region '+(i===0?'is-active':'')+'" data-idle-map-region="'+id+'" data-terrain="'+r.terrain+'" '+(i===0?'':'hidden')+'><div class="idle-map-landmass"><div class="idle-map-ridge ridge-a"></div><div class="idle-map-ridge ridge-b"></div><div class="idle-map-river"></div><div class="idle-map-road road-a"></div><div class="idle-map-road road-b"></div><div class="idle-map-home"><span>⌂</span><small>YOU ARE HERE</small></div>'+r.places.map((p,n)=>marker(p,n,"regional")).join("")+'</div></section>').join("");
 const initialPlaces=first[1].places;
 const initialHoles=initialPlaces.map((p,n)=>destinationHole(p,"regional",n,initialPlaces.length+globalPlaces.length,first[0])).join("")+globalPlaces.map((p,n)=>destinationHole(p,"global",initialPlaces.length+n,initialPlaces.length+globalPlaces.length,first[0])).join("");
 return '<div class="expedition-idle-modal" data-idle-rpg-modal hidden><button type="button" class="expedition-idle-backdrop" data-idle-rpg-close aria-label="Close World Navigation"></button><section class="idle-home-dialog" role="dialog" aria-modal="true" aria-labelledby="idle-home-title"><header class="idle-home-header"><div><span class="idle-home-kicker">MERZKAVA · WORLD ATLAS</span><h3 id="idle-home-title">World Navigation</h3><small class="idle-region-subtitle" data-idle-region-subtitle>'+first[1].subtitle+'</small></div><button type="button" class="idle-home-close" data-idle-rpg-close aria-label="Close map">×</button></header><nav class="idle-region-switch" aria-label="Select region">'+Object.entries(regions).map(([id,r],i)=>'<button type="button" data-idle-region="'+id+'" class="'+(i===0?'is-active':'')+'"><span>0'+(i+1)+'</span>'+r.name+'</button>').join("")+'</nav><div class="idle-navigation-layout"><div class="idle-map-stage"><aside class="idle-calendar-hud '+(timeMoved?'is-time-moving':'')+'" aria-label="World calendar and clock" data-clock-stamp="'+clockStamp+'"><svg class="idle-clockwork" viewBox="0 0 300 92" aria-hidden="true"><path class="idle-clock-cable idle-cable-a" d="M2 69H17L21 63L25 75L29 63L33 75L37 14H174L179 8L184 20L189 8L194 20L199 33H224L229 27L234 39L239 27L244 39L250 8H296"/><path class="idle-clock-cable idle-cable-b" d="M8 75H22L27 69L31 81L35 69L40 81L44 20H170L175 14L180 26L185 14L190 26M199 39H222L227 33L232 45L237 33L242 45L246 14H290"/><path class="idle-clock-cable idle-cable-drop" d="M174 14V25L181 32L188 25L195 39V59"/><path class="idle-clock-cable idle-cable-link" d="M224 33L230 27L236 39L242 33L254 47"/><g transform="translate(190 17)"><g class="idle-clock-gear idle-gear-small"><circle r="9"/><circle class="idle-gear-hole" r="3"/><path d="M0-13V-9M0 9V13M-13 0H-9M9 0H13M-9-9L-6-6M6 6L9 9M9-9L6-6M-6 6L-9 9"/></g></g><g transform="translate(257 48)"><g class="idle-clock-gear idle-gear-large"><circle r="17"/><circle class="idle-gear-hole" r="5"/><path d="M0-22V-17M0 17V22M-22 0H-17M17 0H22M-16-16L-12-12M12 12L16 16M16-16L12-12M-12 12L-16 16M-8-20L-6-15M8 20L6 15M20-8L15-6M-20 8L-15 6"/></g></g><g transform="translate(286 12)"><g class="idle-clock-gear idle-gear-pin"><circle r="6"/><circle class="idle-gear-hole" r="2"/><path d="M0-9V-6M0 6V9M-9 0H-6M6 0H9"/></g></g><circle class="idle-clock-jewel" cx="24" cy="69" r="2.5"/><circle class="idle-clock-jewel" cx="244" cy="8" r="2.5"/></svg><div class="idle-calendar-data"><div class="idle-calendar-day"><span class="idle-calendar-day-label">DAY</span><strong>'+dayLabel+'</strong><span class="idle-calendar-weekday">'+(clock?'LOCAL DATE':'WORLD DATE')+'</span></div><div class="idle-calendar-time"><strong>'+hour12+':'+minuteLabel+'</strong><span class="idle-calendar-cycle"><i aria-hidden="true">'+(cycleLabel==='Dawn'?'☼':cycleLabel==='Morning'?'◉':cycleLabel==='Day'?'☀':cycleLabel==='Dusk'?'◒':cycleLabel==='Night'?'☾':'◇')+'</i><b>'+cycleLabel+'</b></span></div></div><div class="idle-calendar-icons" aria-hidden="true"><span>◇</span><span>□</span><span>○</span></div></aside>'+regionViews+'<div class="idle-map-caption"><span data-idle-region-name>'+first[1].name+'</span><small>REGIONAL MAP · SELECT A DESTINATION</small></div><div class="idle-map-compass">N<br>✦</div><div class="idle-map-scale">MERZKAVA WORLD ATLAS <span>✦</span> FIELD MAP</div></div></div><button type="button" class="arcanist-pull-tab" data-arcanist-pull aria-expanded="false" aria-controls="arcanist-destination-drawer"><span class="arcanist-pull-glyph">⌁</span><span>WORLD ROUTES</span><span class="arcanist-pull-chevron">⌃</span></button><div class="arcanist-device-drawer" id="arcanist-destination-drawer" data-arcanist-device hidden><div class="arcanist-device-heading"><span>ARCANISTRY · ROUTE ENGINE</span><button type="button" data-arcanist-close aria-label="Retract route engine">×</button></div><div class="arcanist-device-body"><div class="arcanist-dial-assembly"><div class="arcanist-dial-ring" data-arcanist-rotor role="slider" aria-label="Rotate to confirm travel" aria-valuemin="0" aria-valuemax="135" aria-valuenow="0" tabindex="0"><span class="arcanist-dial-tooth tooth-a"></span><span class="arcanist-dial-tooth tooth-b"></span><span class="arcanist-dial-tooth tooth-c"></span><span class="arcanist-dial-tooth tooth-d"></span><span class="arcanist-dial-core">✦</span>'+initialHoles+'<span class="arcanist-dial-grip" data-arcanist-grip>◈</span></div><small>TURN TO TRAVEL</small></div><div class="arcanist-destination-side"><div class="arcanist-preview-frame"><img data-arcanist-preview-image src="/game/scenery/golden-dragon-empire/establishing-views/gde-01-imperial-city-panorama.png" alt="Destination preview"/></div><div class="arcanist-preview-copy"><span class="idle-panel-kicker">SELECTED DESTINATION</span><strong data-idle-place-name>Imperial Capital</strong><p data-idle-place-note>Administrative and imperial centre.</p><span class="idle-coming-tag" data-arcanist-route-status>PREVIEW ONLY</span></div></div></div></div><footer class="idle-home-footer"><span>FREE LOCATION SELECTION</span><span>IDLE SIMULATION · COMING SOON</span></footer></section></div>';
}
