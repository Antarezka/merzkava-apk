import { describe, expect, it } from "vitest";
import { applyDispositionEvidence, createDispositionState, deriveDispositionLabel, deriveLawfulnessBand } from "../src/offline-game/disposition";

describe("Eternal Path hidden disposition",()=>{
 it("starts from a neutral save-local baseline",()=>{
  const state=createDispositionState();
  expect(state.label).toBe("True Neutral");
  expect(state.lawfulnessBand).toBe("Normal");
  expect(state.scores.order).toBe(50);
 });
 it("derives public labels from order and morality only",()=>{
  expect(deriveDispositionLabel({...createDispositionState().scores,order:90,morality:90})).toBe("Lawful Good");
  expect(deriveDispositionLabel({...createDispositionState().scores,order:10,morality:10})).toBe("Chaotic Evil");
  expect(deriveDispositionLabel({...createDispositionState().scores,order:50,morality:90})).toBe("Neutral Good");
 });
 it("keeps the lawfulness band internal and bounded",()=>{
  expect(deriveLawfulnessBand(-10)).toBe("Chaotic");
  expect(deriveLawfulnessBand(50)).toBe("Normal");
  expect(deriveLawfulnessBand(100)).toBe("Dedicated");
 });
 it("does not reclassify on one isolated event",()=>{
  const next=applyDispositionEvidence(createDispositionState(),{morality:30},2);
  expect(next.label).toBe("True Neutral");
  expect(next.evidenceCount).toBe(1);
 });
 it("supports an independent moral shift after the evidence window",()=>{
  let state=createDispositionState();
  state=applyDispositionEvidence(state,{morality:30},2);
  state=applyDispositionEvidence(state,{morality:30},3);
  state=applyDispositionEvidence(state,{morality:30},4);
  expect(state.label).toBe("Neutral Good");
 });
 it("clamps every axis to 0..100",()=>{
  const next=applyDispositionEvidence(createDispositionState(),{order:1000,empathy:-1000},2);
  expect(next.scores.order).toBe(100);
  expect(next.scores.empathy).toBe(0);
 });
});
