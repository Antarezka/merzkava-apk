import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  atlasPasswordPolicyError, clearAtlasPassword, clearAtlasPlayer, hasAtlasPassword,
  rememberAtlasPlayer, restoreAtlasPlayer, setAtlasPassword,
  verifyAtlasMasterResetPassword, verifyAtlasPassword
} from "../../src/offline-game/world-atlas-account";

const values=new Map<string,string>();
const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,String(value));},removeItem:(key:string)=>{values.delete(key);},clear:()=>values.clear()};
beforeEach(()=>{values.clear();vi.stubGlobal("localStorage",storage);});
afterEach(()=>{vi.unstubAllGlobals();});

describe("World Atlas account credentials",()=>{
  it("stores a salted verifier rather than the entered password",async()=>{
    const password="Synthetic-Test-Password-123!";
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
  it("keeps remembered identity separate from the password verifier",async()=>{
    await setAtlasPassword("Nafila","Another-Synthetic-Password-123!");
    await rememberAtlasPlayer("Nafila",true);
    expect(await restoreAtlasPlayer()).toBe("Nafila");
    await rememberAtlasPlayer("Nafila",false);
    expect(await restoreAtlasPlayer()).toBe("");
    expect(await hasAtlasPassword("Nafila")).toBe(true);
  });
  it("requires 8–128 characters plus uppercase, lowercase, digit, and symbol",async()=>{
    await expect(setAtlasPassword("Nafila","short")).rejects.toThrow(/8/);
    expect(atlasPasswordPolicyError("lowercase123!")).toMatch(/uppercase/i);
    expect(atlasPasswordPolicyError("UPPERCASE123!")).toMatch(/lowercase/i);
    expect(atlasPasswordPolicyError("NoDigitsHere!")).toMatch(/number/i);
    expect(atlasPasswordPolicyError("NoSymbols123")).toMatch(/symbol/i);\n    expect(atlasPasswordPolicyError("Abcdef1 ")).toMatch(/symbol/i);
    expect(atlasPasswordPolicyError("A".repeat(129)+"a1!")).toMatch(/128/);
    expect(atlasPasswordPolicyError("Valid-Pass-123!")).toBeNull();\n    expect(atlasPasswordPolicyError("Abcdef1!")).toBeNull();
  });
  it("rejects an incorrect Master Reset credential",async()=>{
    expect(await verifyAtlasMasterResetPassword("incorrect-master-value")).toBe(false);
    expect(await verifyAtlasMasterResetPassword("")).toBe(false);
  });
  it("removes only the selected player credential",async()=>{
    await setAtlasPassword("Nafila","Nafila-Password-123!");
    await setAtlasPassword("Ilya","Ilya-Password-123!");
    await clearAtlasPassword("Nafila");
    expect(await hasAtlasPassword("Nafila")).toBe(false);
    expect(await hasAtlasPassword("Ilya")).toBe(true);
    await setAtlasPassword("Nafila","Nafila-Replacement-456!");
    expect(await verifyAtlasPassword("Nafila","Nafila-Replacement-456!")).toBe(true);
  });
  it("clears only the remembered player session when signed out",async()=>{
    await setAtlasPassword("Nafila","Synthetic-Local-Password-123!");
    await rememberAtlasPlayer("Nafila",true);
    await clearAtlasPlayer();
    expect(await restoreAtlasPlayer()).toBe("");
    expect(await hasAtlasPassword("Nafila")).toBe(true);
  });
});
