import { afterEach, describe, expect, it } from "vitest";
import {
  LORE_ENTRIES,
  closeLoreEntry,
  getPublicLoreEntries,
  getLoreBacklinks,
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


  it("makes every approved public entity mention clickable and exposes backlinks", () => {
    const publicIds = new Set(getPublicLoreEntries().map(entry => entry.id));
    for (const entry of getPublicLoreEntries()) {
      expect(entry.crossReferenceIds.every(id => publicIds.has(id))).toBe(true);
      expect(new Set(entry.crossReferenceIds).size).toBe(entry.crossReferenceIds.length);
      expect(openLoreEntry(entry.id)).toBe(true);
      const html = renderLoreLibrary();
      for (const targetId of entry.crossReferenceIds) {
        expect(html).toContain('data-lore-open="' + targetId + '"');
      }
      closeLoreEntry();
    }

    const tianhaiBacklinks = getLoreBacklinks("tianhai");
    expect(tianhaiBacklinks.some(entry => entry.id === "world-atlas")).toBe(true);
    expect(tianhaiBacklinks.every(entry => publicIds.has(entry.id))).toBe(true);
    expect(getLoreBacklinks("not-a-public-dossier")).toEqual([]);

    expect(openLoreEntry("tianhai")).toBe(true);
    expect(renderLoreLibrary()).toContain('class="lore-related lore-backlinks"');
    expect(renderLoreLibrary()).toContain('data-lore-open="world-atlas"');
  });

  it("retains source provenance and valid cross-reference IDs on every dossier", () => {
    const publicIds = new Set(getPublicLoreEntries().map(entry => entry.id));
    for (const entry of LORE_ENTRIES) {
      expect(entry.sourceCommit).toMatch(/^[0-9a-f]{40}$/);
      expect(entry.sourceCommit).toBe("2f76a864150528afb0e3d26cb16f9396ce610ff6");
      expect(entry.reviewedAt).toBe("2026-11-01");
      expect(new Set(entry.crossReferenceIds).size).toBe(entry.crossReferenceIds.length);
      expect(entry.crossReferenceIds).not.toContain(entry.id);
      for (const target of entry.crossReferenceIds) expect(publicIds.has(target)).toBe(true);
    }
  });

  it("keeps Beiming Xenhwa's undisclosed age and flame trait out of the public dossier", () => {
    const entry = getPublicLoreEntries().find(item => item.id === "beiming-xenhwa");
    expect(entry).toBeDefined();
    const publicText = JSON.stringify(entry);
    expect(publicText).not.toMatch(/\b17\b|api putih|white flame|half-beast|nine-tailed fox|rubah berekor sembilan/i);
  });

  it("has no ambiguous title or alias collisions in the public entity index", () => {
    const names = new Map<string, string>();
    for (const entry of getPublicLoreEntries()) {
      for (const name of [entry.title, ...entry.aliases]) {
        const normalized = name.trim().toLocaleLowerCase();
        expect(names.has(normalized)).toBe(false);
        names.set(normalized, entry.id);
      }
    }
  });

  it("only shows categories that contain public dossiers", () => {
    const html = renderLoreLibrary();
    expect(html).not.toContain('data-lore-category="BEASTS"');
    expect(html).toContain('data-lore-category="CULTURE"');
  });

  it("does not open a dossier that was removed from the public corpus", () => {
    expect(openLoreEntry("spirit-beasts")).toBe(false);
  });
});
