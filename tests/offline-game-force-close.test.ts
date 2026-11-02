import { afterEach, describe, expect, it, vi } from "vitest";

function createPersistentStorage(){
  const values=new Map<string,string>();
  return {
    getItem:(key:string)=>values.get(key)??null,
    setItem:(key:string,value:string)=>{values.set(key,String(value));},
    removeItem:(key:string)=>{values.delete(key);},
    clear:()=>values.clear(),
  };
}

afterEach(()=>{
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("Eternal Path forced-close recovery",()=>{
  it("restores the active journey without replaying retired story choices after a process-style module restart",async()=>{
    const storage=createPersistentStorage();
    vi.stubGlobal("localStorage",storage);
    const firstBoot=await import("../src/offline-game/expedition-game");
    firstBoot.startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
    const before=firstBoot.getEternalSave();
    expect(before).not.toBeNull();
    const saveId=before!.saveId;

    firstBoot.chooseEternalOption(1);
    firstBoot.advanceEternalWorldTime(30);
    const afterChoice=firstBoot.getEternalSave()!;
    expect(afterChoice.eventIndex).toBe(0);
    expect(afterChoice.completed).toBe(0);
    expect(afterChoice.minute).toBe(30);

    // Simulate Android force-stop: the JavaScript module is discarded, while
    // native-backed localStorage remains intact. No graceful unload is called.
    vi.resetModules();
    const relaunched=await import("../src/offline-game/expedition-game");
    const restored=relaunched.getEternalSave();
    expect(restored).toMatchObject({
      saveId,
      character:{name:"Nafila",age:14,region:"golden-dragon-empire"},
      eventIndex:0,
      completed:0,
      hour:8,
      minute:30,
      disposition:{label:"True Neutral"},
    });
  });

  it("keeps separate journeys available after force-close and restores the selected slot",async()=>{
    const storage=createPersistentStorage();
    vi.stubGlobal("localStorage",storage);
    const firstBoot=await import("../src/offline-game/expedition-game");
    firstBoot.startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
    const firstId=firstBoot.getEternalSave()!.saveId;
    firstBoot.startEternalGame({name:"Yuha",age:15,region:"tianhai-yunzhou"});
    const secondId=firstBoot.getEternalSave()!.saveId;

    vi.resetModules();
    const relaunched=await import("../src/offline-game/expedition-game");
    expect(relaunched.listEternalSaves()).toHaveLength(2);
    expect(relaunched.getEternalSave()!.saveId).toBe(secondId);
    expect(relaunched.loadEternalSave(firstId)).toBe(true);
    expect(relaunched.getEternalSave()!.character.name).toBe("Nafila");
    expect(relaunched.listEternalSaves()).toHaveLength(2);
  });
});
