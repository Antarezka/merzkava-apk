import { beforeEach, describe, expect, it } from "vitest";
import {
  deleteEternalSave, exportEternalSave, getEternalSave, importEternalSave, listEternalSaves,
  loadEternalSave, renameEternalSave, resetEternalGame, startEternalGame, unloadEternalGame,
} from "../../src/offline-game/expedition-game";

describe("Eternal Path isolated journey saves",()=>{
 beforeEach(()=>resetEternalGame());
 it("keeps multiple journeys isolated and loadable",()=>{
  startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
  const first=getEternalSave()!.saveId;
  startEternalGame({name:"Yuha",age:15,region:"beiming-gu"});
  const second=getEternalSave()!.saveId;
  expect(listEternalSaves()).toHaveLength(2);
  expect(loadEternalSave(first)).toBe(true);
  expect(getEternalSave()?.character.name).toBe("Nafila");
  expect(getEternalSave()?.saveId).toBe(first);
  expect(loadEternalSave(second)).toBe(true);
  expect(getEternalSave()?.character.name).toBe("Yuha");
 });
 it("leaving a journey preserves it for later loading",()=>{
  startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
  const id=getEternalSave()!.saveId;
  unloadEternalGame();
  expect(getEternalSave()).toBeNull();
  expect(listEternalSaves()).toHaveLength(1);
  expect(loadEternalSave(id)).toBe(true);
  expect(getEternalSave()?.character.name).toBe("Nafila");
 });
 it("renames and deletes only the selected save",()=>{
  startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
  const first=getEternalSave()!.saveId;
  startEternalGame({name:"Yuha",age:15,region:"beiming-gu"});
  const second=getEternalSave()!.saveId;
  expect(renameEternalSave(first,"Nafila's first journey")).toBe(true);
  expect(listEternalSaves().find(item=>item.id===first)?.name).toBe("Nafila's first journey");
  expect(deleteEternalSave(first)).toBe(true);
  expect(listEternalSaves().map(item=>item.id)).toEqual([second]);
  expect(getEternalSave()?.character.name).toBe("Yuha");
 });
 it("exports and imports a validated portable backup",()=>{
  startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
  const first=getEternalSave()!.saveId;
  const backup=exportEternalSave(first);
  expect(backup).toContain("MERZKAVA_ETERNAL_PATH_SAVE");
  const imported=importEternalSave(backup!);
  expect(imported).not.toBe(first);
  expect(listEternalSaves()).toHaveLength(2);
  expect(getEternalSave()?.character.name).toBe("Nafila");
  expect(getEternalSave()?.saveName).toContain("Imported");
 });
 it("rejects invalid backups without changing the active journey",()=>{
  startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
  expect(()=>importEternalSave('{"format":"wrong","formatVersion":1}')).toThrow();
  expect(getEternalSave()?.character.name).toBe("Nafila");
  expect(listEternalSaves()).toHaveLength(1);
 });
 it("migrates a legacy single-save record into the save library",()=>{
  const values=new Map<string,string>();
  Object.defineProperty(globalThis,"localStorage",{configurable:true,value:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key)}});
  globalThis.localStorage.setItem("merzkava-eternal-path-save-v1",JSON.stringify({
   schemaVersion:1,character:{name:"Old Journey",age:16,region:"tianhai-yunzhou"},eventIndex:4,day:2,hour:9,minute:15,energy:80,insight:3,bonds:2,completed:4,
  }));
  const slots=listEternalSaves();
  expect(slots).toHaveLength(1);
  expect(slots[0].characterName).toBe("Old Journey");
  expect(getEternalSave()?.schemaVersion).toBe(3);
  expect(getEternalSave()?.eventIndex).toBe(4);
  delete (globalThis as {localStorage?:Storage}).localStorage;
 });
});
