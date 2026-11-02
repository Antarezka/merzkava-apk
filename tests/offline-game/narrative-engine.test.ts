import { describe, expect, it } from "vitest";
import { createDispositionState } from "../../src/offline-game/disposition";
import { BOOTSTRAP_SITUATIONS, isSituationEligible, resolveNarrativeChoice, selectNarrativeSituation, type NarrativeContext } from "../../src/offline-game/narrative-engine";

function context(overrides:Partial<NarrativeContext>={}):NarrativeContext {
  return {saveId:"journey-test",seed:"seed-test",characterName:"Nafila",age:14,region:"golden-dragon-empire",locationId:"gde-city",day:1,hour:8,minute:0,weather:"Clear",disposition:createDispositionState(),completedNodeIds:[],sequence:0,...overrides};
}

describe("Eternal Path context-aware narrative engine",()=>{
  it("ships distinct starter situations across all three regions",()=>{
    expect(BOOTSTRAP_SITUATIONS).toHaveLength(9);
    expect(new Set(BOOTSTRAP_SITUATIONS.map(node=>node.id)).size).toBe(9);
    for(const region of ["golden-dragon-empire","tianhai-yunzhou","beiming-gu"] as const){
      expect(BOOTSTRAP_SITUATIONS.filter(node=>node.eligibility.regions.includes(region))).toHaveLength(3);
    }
    expect(BOOTSTRAP_SITUATIONS.every(node=>node.provenance==="IN_GAME_ORIGINAL")).toBe(true);
  });
  it("requires each node to include observable context, meaningful action, dialogue and a contextual question",()=>{
    for(const node of BOOTSTRAP_SITUATIONS){
      expect(node.sceneAction.length).toBeGreaterThanOrEqual(5);
      expect(node.actors.length).toBeGreaterThan(0);
      expect(node.actors.every(actor=>actor.knowledge.length>0&&actor.observableBehavior.length>0)).toBe(true);
      expect(node.dialogue.text.length).toBeGreaterThan(0);
      expect(node.closingQuestion.length).toBeGreaterThan(40);
      expect(node.choices.length).toBeGreaterThanOrEqual(2);
    }
  });
  it("selects deterministically from only context-eligible situations",()=>{
    const first=selectNarrativeSituation(context());
    const second=selectNarrativeSituation(context());
    expect(first?.id).toBe(second?.id);
    expect(first?.eligibility.regions).toContain("golden-dragon-empire");
    expect(selectNarrativeSituation(context({region:"beiming-gu"}))?.eligibility.regions).toContain("beiming-gu");
  });
  it("does not repeat a completed node in the same journey history",()=>{
    const current=context();
    const selected=selectNarrativeSituation(current);
    expect(selected).not.toBeNull();
    const next=selectNarrativeSituation({...current,completedNodeIds:[selected!.id]});
    expect(next?.id).not.toBe(selected!.id);
  });
  it("rejects unavailable choices and resolves a valid choice without exposing outcomes in the choice label",()=>{
    const current=context();
    const node=selectNarrativeSituation(current)!;
    expect(resolveNarrativeChoice(node,"missing",current)).toBeNull();
    const choice=node.choices[0];
    const result=resolveNarrativeChoice(node,choice.id,current);
    expect(result?.outcomeText).toBe(choice.outcome.revealedText);
    expect(result?.transactionId).toContain("ep-");
    expect(node.choices.every(item=>!item.label.includes(item.outcome.revealedText))).toBe(true);
  });
  it("blocks a node when the player is outside its eligible region or has completed it",()=>{
    const node=BOOTSTRAP_SITUATIONS.find(item=>item.id==="epb-gde-roadside-bundle")!;
    expect(isSituationEligible(node,context({region:"tianhai-yunzhou"}))).toBe(false);
    expect(isSituationEligible(node,context({completedNodeIds:[node.id]}))).toBe(false);
  });
});
