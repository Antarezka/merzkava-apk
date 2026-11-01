import { describe, expect, it } from "vitest";
import { renderExpeditionInterface } from "../../src/offline-game/expedition-interface";
import type { Character } from "../../src/convo/characters/character-repository";

describe("Eternal Path Expedition Interface", () => {
  it("renders a dedicated environment viewport and clearly unresolved status placeholders", () => {
    const html = renderExpeditionInterface([]);
    expect(html).toContain('class="expedition-environment"');
    expect(html).toContain("ENVIRONMENT · PREVIEW");
    expect(html).toContain('id="expedition-character"');
    expect(html).toContain("GAMEPLAY SYSTEMS NOT YET ACTIVE");
    expect(html).toContain("<strong>—</strong>");
  });

  it("offers local character selection without claiming Convo saves are shared", () => {
    const character = { id: "local-1", name: "Nafila" } as Character;
    const html = renderExpeditionInterface([character]);
    expect(html).toContain('<option value="local-1">Nafila</option>');
    expect(html).toContain("Offline Game save data and progression are not connected yet.");
    expect(html).toContain("Convo sessions and saves remain separate.");
  });
});
