import { describe, expect, it } from "vitest";
import { isTextEntryTarget } from "../../src/ui/soft-keyboard-stability";

function target(tagName:string,type=""):EventTarget {
  return {
    tagName:tagName.toUpperCase(),
    getAttribute(name:string){return name==="type"?type:null;},
    isContentEditable:false
  } as unknown as EventTarget;
}

describe("Android soft keyboard focus detection",()=>{
  it("treats password, text and textarea as text-entry targets",()=>{
    expect(isTextEntryTarget(target("input","password"))).toBe(true);
    expect(isTextEntryTarget(target("input","text"))).toBe(true);
    expect(isTextEntryTarget(target("textarea"))).toBe(true);
  });
  it("does not treat action buttons and non-text controls as keyboard text fields",()=>{
    for(const type of ["button","submit","reset","checkbox","radio","file","image","range","color"]){
      expect(isTextEntryTarget(target("input",type))).toBe(false);
    }
    expect(isTextEntryTarget(target("button"))).toBe(false);
    expect(isTextEntryTarget(target("select"))).toBe(false);
    expect(isTextEntryTarget(null)).toBe(false);
  });
});
