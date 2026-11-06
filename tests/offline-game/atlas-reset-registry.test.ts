import { describe, expect, it } from "vitest";
import { parseAtlasResetRegistryNames } from "../../src/offline-game/atlas-reset-registry";

describe("World Atlas reset registry parser", () => {
  it("reads unique linked player profile rows only", () => {
    const content = [
      "| Character | Profile | Realm |",
      "| --- | --- | --- |",
      "| Nafila | [Profile](players/naf ila.md) | Mortal |",
      "| Ilya | [Ilya](players/ilya.md) | Mortal |",
      "| Nafila | [Duplicate](players/naf ila.md) | Mortal |",
      "| Invalid | [Path](../private.md) | Mortal |",
      "| Missing link | not linked | Mortal |"
    ].join("\n");
    expect(parseAtlasResetRegistryNames(content)).toEqual([
      { name: "Nafila", path: "players/naf ila.md" },
      { name: "Ilya", path: "players/ilya.md" }
    ]);
  });

  it("returns an empty list for empty or malformed registry content", () => {
    expect(parseAtlasResetRegistryNames("")).toEqual([]);
    expect(parseAtlasResetRegistryNames("| Bad | [No profile](notes/bad.md) | Mortal |")).toEqual([]);
  });
});
