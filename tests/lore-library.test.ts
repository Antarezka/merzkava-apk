import { afterEach, describe, expect, it } from "vitest";
import {
  LORE_ENTRIES,
  closeLoreEntry,
  getPublicLoreEntries,
  openLoreEntry,
  renderLoreLibrary,
  renderLoreResults,
  resolveLoreEntry,
  setLoreSearch
} from "../src/lore/lore-library";

afterEach(() => {
  closeLoreEntry();
  setLoreSearch("");
});

describe("World Archive visibility and entity routing", () => {
  it("requires an explicit visibility classification on every dossier", () => {
    expect(LORE_ENTRIES.length).toBeGreaterThan(0);
    expect(LORE_ENTRIES.every(entry =>
      ["PUBLISHED", "REVIEW_REQUIRED", "GM_ONLY"].includes(entry.visibility)
    )).toBe(true);
  });

  it("exposes only PUBLISHED dossiers to the player index", () => {
    expect(getPublicLoreEntries()).toEqual(LORE_ENTRIES.filter(entry => entry.visibility === "PUBLISHED"));
  });

  it("does not expose known GM-only identities or concealed organizations in public search data", () => {
    const publicText = JSON.stringify(getPublicLoreEntries());
    for (const restricted of ["Ying Wuxin", "Crimson Sovereign Court", "Beiming Nerva", "Crimson Keel Brotherhood"]) {
      expect(publicText).not.toContain(restricted);
    }
    setLoreSearch("Crimson Keel Brotherhood");
    expect(renderLoreResults()).toContain("No matching records");
  });

  it("resolves exact titles before colliding aliases", () => {
    expect(resolveLoreEntry("World Knowledge Tower")?.id).toBe("world-knowledge-tower");
    expect(resolveLoreEntry("Medicine Hall Society")?.id).toBe("medicine-hall");
    expect(resolveLoreEntry("Ruined Archiver")?.id).toBe("ruined-archiver");
    expect(resolveLoreEntry("Beiming Han")?.id).toBe("beiming-han");
    expect(resolveLoreEntry("Tianhai Yunzhou")?.id).toBe("tianhai");
    expect(resolveLoreEntry("Spirit Hunters Guild")?.id).toBe("spirit-hunters-guild");
  });

  it("keeps Black Tide Expanse distinct from Black Tide Sea", () => {
    expect(resolveLoreEntry("Black Tide Expanse")?.id).toBe("black-tide-expanse");
    expect(resolveLoreEntry("Black Tide Sea")?.id).toBe("seas");
  });

  it("does not route a name to an unrelated regional dossier", () => {
    expect(resolveLoreEntry("Crimson Keel Brotherhood")).toBeUndefined();
    expect(resolveLoreEntry("Tier 9 Artificial Artifact")).toBeUndefined();
    expect(resolveLoreEntry("Frostmirror Sea")?.id).toBe("seas");
  });

  it("generates clickable links to the correct local dossier", () => {
    expect(openLoreEntry("history")).toBe(true);
    expect(renderLoreLibrary()).toContain('data-lore-open="world-knowledge-tower"');
    closeLoreEntry();

    expect(openLoreEntry("beiming")).toBe(true);
    expect(renderLoreLibrary()).toContain('data-lore-open="beiming-han"');
    closeLoreEntry();

    expect(openLoreEntry("lawless")).toBe(true);
    expect(renderLoreLibrary()).toContain('data-lore-open="black-tide-expanse"');
  });

  it("does not open a dossier that was removed from the public corpus", () => {
    expect(openLoreEntry("spirit-beasts")).toBe(false);
  });
});
