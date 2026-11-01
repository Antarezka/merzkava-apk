import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const scope = { add: vi.fn(), revert: vi.fn() };
  return { animate: vi.fn(), createScope: vi.fn(() => scope), scope, stagger: vi.fn((value:number)=>value) };
});
vi.mock("animejs",()=>({animate:mocks.animate,createScope:mocks.createScope,stagger:mocks.stagger}));
import { animateExpeditionChoiceModal, mountExpeditionAnimations } from "../../src/offline-game/expedition-animations";

describe("Eternal Path Anime.js motion",()=>{
 beforeEach(()=>{
  vi.clearAllMocks();
  mocks.scope.add.mockImplementation((setup:(self:{matches:{reduceMotion:boolean}})=>void)=>{setup({matches:{reduceMotion:false}});return mocks.scope;});
 });
 it("animates the scene, profile, narrative and fog within its own scope",()=>{
  const entrance=[{},{}],image={},light={},weather={},fog={},cloud={},fields=[{},{}],badge={},narrative=[{},{}];
  const selectors:Record<string,unknown>={".expedition-scene-image":image,".expedition-light-layer":light,".expedition-weather-layer":weather,".expedition-fog-motion":fog,".expedition-cloud-motion":cloud,".expedition-disposition":badge};
  const lists:Record<string,unknown[]>={".expedition-heading, .expedition-environment, .expedition-character-panel, .expedition-disposition-line, .expedition-dialogue, .expedition-footer":entrance,".expedition-profile-meta span":fields,".expedition-narrative-layer":narrative,"button":[]};
  const root={querySelectorAll:vi.fn((selector:string)=>lists[selector]??[]),querySelector:vi.fn((selector:string)=>selectors[selector]??null)} as unknown as HTMLElement;
  const dispose=mountExpeditionAnimations(root);
  expect(mocks.createScope).toHaveBeenCalledWith(expect.objectContaining({root}));
  expect(mocks.animate).toHaveBeenCalledWith(entrance,expect.objectContaining({opacity:[0,1],translateY:[13,0]}));
  expect(mocks.animate).toHaveBeenCalledWith(image,expect.objectContaining({loop:true,alternate:true}));
  expect(mocks.animate).toHaveBeenCalledWith(fog,expect.objectContaining({loop:true,alternate:true,ease:"inOutSine"}));
  expect(mocks.animate).toHaveBeenCalledWith(fields,expect.objectContaining({delay:expect.anything()}));
  expect(mocks.animate).toHaveBeenCalledWith(narrative,expect.objectContaining({translateY:[9,0]}));
  dispose();expect(mocks.scope.revert).toHaveBeenCalledOnce();
 });
 it("does not animate when reduced motion is requested",()=>{
  mocks.scope.add.mockImplementation((setup:(self:{matches:{reduceMotion:boolean}})=>void)=>{setup({matches:{reduceMotion:true}});return mocks.scope;});
  mountExpeditionAnimations({querySelectorAll:vi.fn(()=>[{}]),querySelector:vi.fn(()=>({}))} as unknown as HTMLElement);
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
