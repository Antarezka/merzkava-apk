import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAtlasPlayer, hasAtlasPassword, rememberAtlasPlayer, restoreAtlasPlayer,
  setAtlasPassword, verifyAtlasPassword
} from "../../src/offline-game/world-atlas-account";

const values=new Map<string,string>();
const storage={
  getItem:(key:string)=>values.get(key)??null,
  setItem:(key:string,value:string)=>{values.set(key,String(value));},
  removeItem:(key:string)=>{values.delete(key);},
  clear:()=>values.clear(),
};

beforeEach(()=>{values.clear();vi.stubGlobal("localStorage",storage);});
afterEach(()=>{vi.unstubAllGlobals();});

describe("World Atlas local player accounts",()=>{
  it("stores only a salted password verifier, never the entered password",async()=>{
    const password="synthetic-test-password-123";
    await setAtlasPassword("Nafila",password);
    expect(await hasAtlasPassword("Nafila")).toBe(true);
    const stored=[...values.entries()].filter(([key])=>key.startsWith("merzkava.world-atlas.account."));
    expect(stored).toHaveLength(1);
    expect(stored[0][1]).not.toContain(password);
    expect(stored[0][1]).toContain('"salt"');
    expect(stored[0][1]).toContain('"hash"');
    expect(await verifyAtlasPassword("Nafila",password)).toBe(true);
    expect(await verifyAtlasPassword("Nafila","incorrect-password")).toBe(false);
  });

  it("keeps the remembered player name separate from the password verifier",async()=>{
    await setAtlasPassword("Nafila","another-synthetic-password");
    await rememberAtlasPlayer("Nafila",true);
    expect(await restoreAtlasPlayer()).toBe("Nafila");
    await rememberAtlasPlayer("Nafila",false);
    expect(await restoreAtlasPlayer()).toBe("");
    expect(await hasAtlasPassword("Nafila")).toBe(true);
  });

  it("requires the password to be at least eight characters",async()=>{
    await expect(setAtlasPassword("Nafila","short")).rejects.toThrow(/8/);
  });

  it("clears only the remembered player session when signed out",async()=>{
    await setAtlasPassword("Nafila","synthetic-local-password");
    await rememberAtlasPlayer("Nafila",true);
    await clearAtlasPlayer();
    expect(await restoreAtlasPlayer()).toBe("");
    expect(await hasAtlasPassword("Nafila")).toBe(true);
  });
});
