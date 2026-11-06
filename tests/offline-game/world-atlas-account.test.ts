import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const nativeState=vi.hoisted(()=>({enabled:false}));
const secureValues=vi.hoisted(()=>new Map<string,string>());
vi.mock("@capacitor/core",()=>({Capacitor:{isNativePlatform:()=>nativeState.enabled}}));
vi.mock("@aparajita/capacitor-secure-storage",()=>({SecureStorage:{
  getItem:async(key:string)=>secureValues.get(key)??null,
  setItem:async(key:string,value:string)=>{secureValues.set(key,String(value));},
  removeItem:async(key:string)=>{secureValues.delete(key);}
}}));

vi.mock("../../src/offline-game/atlas-reset-grants.generated",()=>({
  ATLAS_RESET_GRANTS:[{
    requestId:"test-nafila-master-reset-001",
    playerKey:"B5JB_qmj1iMLlWhl7o5l5ffAiTHKU4-oKWmpby8B9n8",
    codeHash:"0ea37c243f60974b0d54c6b2d76cece3f4c742492cce48eaf81f357931d6d69e"
  }]
}));

import {
  atlasPasswordPolicyError, clearAtlasPlayer, completeAtlasMasterReset,
  createAtlasMasterResetRequest, hasAtlasPassword, rememberAtlasPlayer,
  restoreAtlasPlayer, setAtlasPassword, verifyAtlasMasterResetCode, verifyAtlasPassword
} from "../../src/offline-game/world-atlas-account";

const values=new Map<string,string>();
const storage={
  getItem:(key:string)=>values.get(key)??null,
  setItem:(key:string,value:string)=>{values.set(key,String(value));},
  removeItem:(key:string)=>{values.delete(key);},
  clear:()=>values.clear()
};
const resetCode="MZK1-01234567-89ABCDEF-01234567-89ABCDEF-01234567-89ABCDEF-01234567-89ABCDEF";

beforeEach(()=>{values.clear();secureValues.clear();nativeState.enabled=false;vi.stubGlobal("localStorage",storage);});
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

  it("restores Remember Me passwords only from native SecureStorage",async()=>{
    const password="Remembered-Nafila-Password-123!";
    nativeState.enabled=true;
    await setAtlasPassword("Nafila",password);
    await rememberAtlasCredentials("Nafila",password,true);
    expect(await restoreAtlasPlayer()).toBe("Nafila");
    expect(await restoreRememberedAtlasPassword("Nafila")).toBe(password);
    expect([...values.values()].some(value=>value===password)).toBe(false);
    expect([...secureValues.values()]).toContain(password);
  });

  it("clears the remembered device password when Remember Me is unchecked",async()=>{
    const password="Remembered-Nafila-Password-456!";
    nativeState.enabled=true;
    await setAtlasPassword("Nafila",password);
    await rememberAtlasCredentials("Nafila",password,true);
    await rememberAtlasCredentials("Nafila",password,false);
    expect(await restoreAtlasPlayer()).toBe("");
    expect(await restoreRememberedAtlasPassword("Nafila")).toBe("");
  });

  it("does not persist remembered passwords in browser localStorage",async()=>{
    const password="Browser-Nafila-Password-789!";
    await setAtlasPassword("Nafila",password);
    await rememberAtlasCredentials("Nafila",password,true);
    expect(await restoreRememberedAtlasPassword("Nafila")).toBe("");
    expect([...values.values()].some(value=>value===password)).toBe(false);
  });

  it("requires 8–128 characters plus uppercase, lowercase, digit, and punctuation symbol",async()=>{
    await expect(setAtlasPassword("Nafila","short")).rejects.toThrow(/8/);
    expect(atlasPasswordPolicyError("lowercase123!")).toMatch(/uppercase/i);
    expect(atlasPasswordPolicyError("UPPERCASE123!")).toMatch(/lowercase/i);
    expect(atlasPasswordPolicyError("NoDigitsHere!")).toMatch(/number/i);
    expect(atlasPasswordPolicyError("NoSymbols123")).toMatch(/symbol/i);
    expect(atlasPasswordPolicyError("Abcdef1 ")).toMatch(/symbol/i);
    expect(atlasPasswordPolicyError("A".repeat(129)+"a1!")).toMatch(/128/);
    expect(atlasPasswordPolicyError("Valid-Pass-123!")).toBeNull();
    expect(atlasPasswordPolicyError("Abcdef1!")).toBeNull();
  });

  it("creates a request code that is not itself a player reset credential",async()=>{
    const request=await createAtlasMasterResetRequest("Nafila");
    expect(request).toContain("MERZKAVA_ATLAS_MASTER_RESET_REQUEST_V1");
    expect(request).toContain("Player-Name: Nafila");
    expect(request).toContain("Player-Key: B5JB_qmj1iMLlWhl7o5l5ffAiTHKU4-oKWmpby8B9n8");
    expect(request).toContain("Request-ID:");
    expect(request).toContain("Challenge:");
    expect(await verifyAtlasMasterResetCode("Nafila",request)).toBe(false);
  });

  it("accepts only the account-bound code embedded in the app build",async()=>{
    expect(await verifyAtlasMasterResetCode("Nafila",resetCode)).toBe(true);
    expect(await verifyAtlasMasterResetCode("Ilya",resetCode)).toBe(false);
    expect(await verifyAtlasMasterResetCode("Nafila","wrong-code")).toBe(false);
    expect(await verifyAtlasMasterResetCode("Nafila","")).toBe(false);
  });

  it("replaces only the selected password and consumes the grant in the credential record",async()=>{
    await setAtlasPassword("Nafila","Nafila-Old-Password-123!");
    await setAtlasPassword("Ilya","Ilya-Password-123!");
    expect(await verifyAtlasMasterResetCode("Nafila",resetCode)).toBe(true);

    await completeAtlasMasterReset("Nafila",resetCode,"Nafila-New-Password-456!");

    expect(await verifyAtlasPassword("Nafila","Nafila-Old-Password-123!")).toBe(false);
    expect(await verifyAtlasPassword("Nafila","Nafila-New-Password-456!")).toBe(true);
    expect(await verifyAtlasPassword("Ilya","Ilya-Password-123!")).toBe(true);
    expect(await verifyAtlasMasterResetCode("Nafila",resetCode)).toBe(false);
    await expect(completeAtlasMasterReset("Nafila",resetCode,"Another-New-Password-789!")).rejects.toThrow(/already been used/i);
  });

  it("preserves consumed grant IDs after an ordinary password change",async()=>{
    await completeAtlasMasterReset("Nafila",resetCode,"Nafila-New-Password-456!");
    await setAtlasPassword("Nafila","Nafila-Ordinary-Change-789!");
    expect(await verifyAtlasPassword("Nafila","Nafila-Ordinary-Change-789!")).toBe(true);
    expect(await verifyAtlasMasterResetCode("Nafila",resetCode)).toBe(false);
  });

  it("does not consume a reset code when the replacement password fails policy",async()=>{
    await expect(completeAtlasMasterReset("Nafila",resetCode,"short")).rejects.toThrow(/8/);
    expect(await verifyAtlasMasterResetCode("Nafila",resetCode)).toBe(true);
  });

  it("rejects the same reset code when it is not present in the selected account grant list",async()=>{
    await expect(completeAtlasMasterReset("Ilya",resetCode,"Ilya-New-Password-456!")).rejects.toThrow(/another account|not included/i);
    expect(await hasAtlasPassword("Ilya")).toBe(false);
  });

  it("clears only the remembered player session when signed out",async()=>{
    await setAtlasPassword("Nafila","Synthetic-Password-123!");
    await rememberAtlasPlayer("Nafila",true);
    await clearAtlasPlayer();
    expect(await restoreAtlasPlayer()).toBe("");
    expect(await hasAtlasPassword("Nafila")).toBe(true);
  });
});
