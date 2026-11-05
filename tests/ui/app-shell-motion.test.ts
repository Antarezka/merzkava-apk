import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  animate: vi.fn(),
  stagger: vi.fn((value:number)=>value)
}));
vi.mock("animejs",()=>({animate:mocks.animate,stagger:mocks.stagger}));

let animateAppScreenExit: typeof import("../../src/ui/app-shell-motion")["animateAppScreenExit"];
let animateNoticeboardExit: typeof import("../../src/ui/app-shell-motion")["animateNoticeboardExit"];

describe("screen and noticeboard transitions",()=>{
  beforeEach(async()=>{
    vi.resetModules();
    const motion=await import("../../src/ui/app-shell-motion");
    animateAppScreenExit=motion.animateAppScreenExit;
    animateNoticeboardExit=motion.animateNoticeboardExit;
    vi.clearAllMocks();
    Object.defineProperty(globalThis,"window",{configurable:true,value:{matchMedia:vi.fn(()=>({matches:false}))}});
    mocks.animate.mockReturnValue({pause:vi.fn()});
  });

  it("fades the outgoing screen and disables input until completion",()=>{
    const shell:any={style:{pointerEvents:"auto"}};
    const complete=vi.fn();
    animateAppScreenExit(shell,complete);
    expect(shell.style.pointerEvents).toBe("none");
    expect(mocks.animate).toHaveBeenCalledWith(shell,expect.objectContaining({
      opacity:[1,0],translateY:[0,-7],scale:[1,0.994],duration:300
    }));
    mocks.animate.mock.calls[0][1].onComplete();
    expect(complete).toHaveBeenCalledOnce();
  });

  it("fades the noticeboard panel and backdrop as one close action",()=>{
    const panel:any={};
    const backdrop:any={
      style:{pointerEvents:"auto"},
      getAnimations:vi.fn(()=>[]),
      querySelector:vi.fn(()=>panel)
    };
    const complete=vi.fn();
    animateNoticeboardExit(backdrop,complete);
    expect(backdrop.style.pointerEvents).toBe("none");
    expect(backdrop.getAnimations).toHaveBeenCalledOnce();
    expect(mocks.animate).toHaveBeenCalledTimes(2);
    expect(mocks.animate).toHaveBeenCalledWith(panel,expect.objectContaining({
      opacity:[1,0],translateY:[0,9]
    }));
    const backdropCall=mocks.animate.mock.calls.find(call=>call[0]===backdrop);
    expect(backdropCall).toBeTruthy();
    backdropCall?.[1].onComplete();
    expect(complete).toHaveBeenCalledOnce();
  });

  it("completes transitions immediately when reduced motion is enabled",()=>{
    (window as any).matchMedia=vi.fn(()=>({matches:true}));
    const shell:any={style:{pointerEvents:"auto"}};
    const complete=vi.fn();
    animateAppScreenExit(shell,complete);
    expect(complete).toHaveBeenCalledOnce();
    expect(mocks.animate).not.toHaveBeenCalled();
  });
});
