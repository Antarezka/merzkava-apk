import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  animate:vi.fn(),
  createTimeline:vi.fn(),
  timelineAdd:vi.fn(),
  timelinePause:vi.fn()
}));
vi.mock("animejs",()=>({
  animate:mocks.animate,
  createTimeline:mocks.createTimeline
}));

let animateOpeningSplash:typeof import("../../src/ui/splash-animation")["animateOpeningSplash"];
let animateSplashCurtain:typeof import("../../src/ui/splash-animation")["animateSplashCurtain"];

describe("Kitty splash animation sequencing",()=>{
  beforeEach(async()=>{
    vi.resetModules();
    const motion=await import("../../src/ui/splash-animation");
    animateOpeningSplash=motion.animateOpeningSplash;
    animateSplashCurtain=motion.animateSplashCurtain;
    vi.clearAllMocks();
    Object.defineProperty(globalThis,"window",{configurable:true,value:{matchMedia:vi.fn(()=>({matches:false}))}});
    const timeline:any={add:mocks.timelineAdd,pause:mocks.timelinePause};
    mocks.timelineAdd.mockReturnValue(timeline);
    mocks.createTimeline.mockReturnValue(timeline);
    mocks.animate.mockReturnValue({pause:vi.fn()});
    Object.defineProperty(globalThis,"document",{configurable:true,value:{
      createElement:vi.fn(()=>({className:"",setAttribute:vi.fn(),style:{setProperty:vi.fn()},remove:vi.fn()}))
    }});
  });

  it("starts wordmark and light-ray breathing only after their entrance fades",()=>{
    const content:any={};
    const mascot:any={
      querySelector:(selector:string)=>({
        ".kitty-shadow":{},
        ".kitty-body":{},
        ".kitty-head":{},
        ".kitty-tail":{}
      } as Record<string,any>)[selector]??null
    };
    const elements:Record<string,any>={
      ".splash-content":content,
      ".splash-mascot":mascot,
      ".splash-kicker":{},
      ".splash-wordmark":{},
      ".splash-light-ray":{},
      ".splash-rule":{},
      ".splash-tagline":{}
    };
    const splash:any={
      querySelector:(selector:string)=>elements[selector]??null,
      append:vi.fn()
    };
    animateOpeningSplash(splash);
    const lightRayCall=mocks.animate.mock.calls.find(call=>call[0]===elements[".splash-light-ray"]);
    const wordmarkCall=mocks.animate.mock.calls.find(call=>call[0]===elements[".splash-wordmark"]);
    expect(lightRayCall?.[1].delay).toBeGreaterThanOrEqual(2150);
    expect(wordmarkCall?.[1].delay).toBeGreaterThanOrEqual(1380);
  });

  it("closes the splash without animating an expensive blur filter",()=>{
    const content:any={};
    const splash:any={querySelector:vi.fn((selector:string)=>selector===".splash-content"?content:null)};
    animateSplashCurtain(splash,vi.fn());
    const contentCall=mocks.animate.mock.calls.find(call=>call[0]===content);
    expect(contentCall).toBeTruthy();
    expect(contentCall?.[1]).not.toHaveProperty("filter");
  });
});
