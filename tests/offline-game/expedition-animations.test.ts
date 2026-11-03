import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const scope = { add: vi.fn(), revert: vi.fn() };
  return { animate: vi.fn(), createScope: vi.fn(() => scope), scope, stagger: vi.fn((value:number)=>value) };
});
vi.mock("animejs",()=>({animate:mocks.animate,createScope:mocks.createScope,stagger:mocks.stagger}));
import { animateExpeditionChoiceModal, mountExpeditionAnimations } from "../../src/offline-game/expedition-animations";

function makeSceneRoot(weather="Clear",cycle="Morning",state="test-"+Math.random()) {
  const scene:any={dataset:{weather,cycle,location:"test-location",animationState:state},setAttribute:vi.fn(),addEventListener:vi.fn(),removeEventListener:vi.fn()};
  const host:any={appendChild:vi.fn(),replaceChildren:vi.fn()};
  const selectors:Record<string,any>={
    ".expedition-environment":scene,
    ".expedition-weather-particles":host,
    ".expedition-scene-image":{},
    ".expedition-cloud-motion":{},
    ".expedition-light-layer":{},
    ".expedition-weather-layer":{},
    ".expedition-fog-motion":{},
    ".expedition-sun-glow":{},
    ".expedition-sun-glow-image":{},
    ".expedition-moon-glow":{},
    ".expedition-moon-glow-image":{},
    ".expedition-light-rays":{},
    ".expedition-light-rays-image":{},
    ".expedition-rain-streak-image":{},
    ".expedition-snow-texture":{},
    ".expedition-window-frost-image":{},
    ".expedition-petal-texture":{},
    ".expedition-leaf-texture":{},
    ".expedition-lightning-layer":{},
    ".expedition-lightning-flash-image":{src:"/game/scenery/shared/fx-08-lightning-flash-a.png"},
  };
  const lists:Record<string,any[]>={
    ".expedition-heading, .expedition-environment, .expedition-character-panel, .expedition-disposition-line, .expedition-dialogue, .expedition-footer":[],
    ".expedition-profile-meta span":[],
    ".expedition-narrative-layer":[],
    "button":[],
  };
  const root:any={querySelector:vi.fn((selector:string)=>selectors[selector]??null),querySelectorAll:vi.fn((selector:string)=>lists[selector]??[])};
  return {root,scene,host,selectors};
}

describe("Eternal Path event-driven Anime.js motion",()=>{
 beforeEach(()=>{
  vi.clearAllMocks();
  mocks.animate.mockReturnValue({pause:vi.fn()});
  mocks.scope.add.mockImplementation((setup:(self:{matches:{reduceMotion:boolean}})=>void)=>{setup({matches:{reduceMotion:false}});return mocks.scope;});
 });
 it("keeps scene motion idle until the Scene Window itself is activated",()=>{
  const {root,scene}=makeSceneRoot();
  const dispose=mountExpeditionAnimations(root);
  expect(mocks.animate.mock.calls.some(call=>call[0]===root.querySelector(".expedition-scene-image"))).toBe(false);
  const click=scene.addEventListener.mock.calls.find((call:any[])=>call[0]==="click")?.[1];
  expect(click).toBeTypeOf("function");
  click();
  const sceneCall=mocks.animate.mock.calls.find(call=>call[0]===root.querySelector(".expedition-scene-image"));
  expect(sceneCall).toBeTruthy();
  expect(sceneCall?.[1]).not.toHaveProperty("loop");
  dispose();
  expect(scene.removeEventListener).toHaveBeenCalledWith("click",click);
 });
 it("creates weather particles once and animates them only during a scene beat",()=>{
  const {root,scene,host}=makeSceneRoot("Rain");
  const nodes:any[]=[];
  host.appendChild.mockImplementation((node:any)=>nodes.push(node));
  const dispose=mountExpeditionAnimations(root);
  expect(nodes).toHaveLength(17);
  expect(nodes[0].className).toContain("expedition-particle-rain");
  expect(mocks.animate.mock.calls.some(call=>call[0]===nodes)).toBe(false);
  const click=scene.addEventListener.mock.calls.find((call:any[])=>call[0]==="click")?.[1];
  click();
  const particleCall=mocks.animate.mock.calls.find(call=>call[0]===nodes);
  expect(particleCall).toBeTruthy();
  expect(particleCall?.[1]).not.toHaveProperty("loop");
  dispose();
  expect(host.replaceChildren).toHaveBeenCalledOnce();
 });
 it("plays one scene beat when the authoritative world-time key changes on narrative rerender",()=>{
  const first=makeSceneRoot("Clear","Morning","journey:day1:08:00");
  const disposeFirst=mountExpeditionAnimations(first.root);
  disposeFirst();
  vi.clearAllMocks();
  mocks.animate.mockReturnValue({pause:vi.fn()});
  const next=makeSceneRoot("Rain","Dusk","journey:day1:18:15");
  const disposeNext=mountExpeditionAnimations(next.root);
  expect(mocks.animate.mock.calls.some(call=>call[0]===next.root.querySelector(".expedition-scene-image"))).toBe(true);
  expect(mocks.animate.mock.calls.every(call=>!Object.prototype.hasOwnProperty.call(call[1]??{},"loop"))).toBe(true);
  disposeNext();
 });
 it("does not animate scene motion when reduced motion is requested",()=>{
  mocks.scope.add.mockImplementation((setup:(self:{matches:{reduceMotion:boolean}})=>void)=>{setup({matches:{reduceMotion:true}});return mocks.scope;});
  const {root,scene}=makeSceneRoot();
  mountExpeditionAnimations(root);
  const click=scene.addEventListener.mock.calls.find((call:any[])=>call[0]==="click")?.[1];
  click();
  expect(mocks.animate).not.toHaveBeenCalled();
 });
 it("animates the choice sheet in and out without changing game state",()=>{
  const sheet={},backdrop={};
  const modal={hidden:true,dataset:{},querySelector:vi.fn((selector:string)=>selector.includes("sheet")?sheet:backdrop)} as unknown as HTMLElement;
  animateExpeditionChoiceModal(modal,true);
  expect(modal.hidden).toBe(false);
  expect(mocks.animate).toHaveBeenCalledWith(sheet,expect.objectContaining({translateY:[34,0]}));
  animateExpeditionChoiceModal(modal,false);
  const closeCall=mocks.animate.mock.calls.find(call=>call[0]===sheet&&call[1].translateY?.[0]===0);
  expect(closeCall).toBeTruthy();
  closeCall?.[1].onComplete();
  expect(modal.hidden).toBe(true);
 });
});
