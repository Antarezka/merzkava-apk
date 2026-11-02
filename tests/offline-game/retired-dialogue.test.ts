import { beforeEach, describe, expect, it } from "vitest";
import {
  chooseEternalOption, getCurrentDialogue, getEternalSave, getRegionalDialogueCount,
  resetEternalGame, startEternalGame,
} from "../../src/offline-game/expedition-game";

describe("retired Eternal Path 0.1.0 dialogue sequence and compatibility boundary", () => {
  beforeEach(() => resetEternalGame());

  it("does not expose the retired generated sequence; the new bootstrap engine supplies separate situations", () => {
    startEternalGame({ name: "Nafila", age: 14, region: "golden-dragon-empire" });
    expect(getRegionalDialogueCount()).toBe(3);
    expect(getCurrentDialogue()).not.toBeNull();
    expect(getCurrentDialogue()?.patchId).toBe("eternal-path-bootstrap");
    expect(getCurrentDialogue()?.id).not.toContain("legacy");
  });

  it("rejects legacy choice indices without changing the saved journey", () => {
    startEternalGame({ name: "Nafila", age: 14, region: "golden-dragon-empire" });
    const before = getEternalSave();
    chooseEternalOption(0);
    chooseEternalOption(1);
    const after = getEternalSave();
    expect(after).toMatchObject({
      saveId: before?.saveId,
      eventIndex: 0,
      completed: 0,
      energy: before?.energy,
      insight: before?.insight,
      bonds: before?.bonds,
      day: before?.day,
      hour: before?.hour,
      minute: before?.minute,
    });
  });
});
