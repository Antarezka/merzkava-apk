import { describe, expect, it } from "vitest";
import { renderIsometricMapTestArea } from "../../src/offline-game/world-map-hierarchy";
import chatStyles from "../../src/offline-game/world-map-hierarchy.css?raw";

describe("isometric NPC conversations", () => {
  it("keeps the NPC conversation panel, message thread, and reply choices mounted", () => {
    const html = renderIsometricMapTestArea();
    expect(html).toContain('class="wmh-chat-panel" data-wmh-chat hidden role="dialog"');
    expect(html).toContain('data-wmh-thread');
    expect(html).toContain('data-wmh-replies');
    expect(html).toContain('data-wmh-npc="test-guide"');
    expect(html).toContain('data-wmh-npc="test-scholar"');
    expect(html).toContain('data-wmh-npc="test-mechanic"');
  });

  it("centers the conversation as a full-screen modal instead of docking it below the map", () => {
    const rules = [...chatStyles.matchAll(/\.wmh-isometric-play-screen \.wmh-chat-panel\\?\{([^}]*)\}/g)];
    const finalRule = rules.at(-1)?.[1] ?? "";
    expect(finalRule).toContain("position:fixed");
    expect(finalRule).toContain("inset:0");
    expect(finalRule).toContain("display:grid");
    expect(finalRule).toContain("place-items:center");
    expect(finalRule).not.toContain("bottom:62px");
  });

  it("keeps the hidden state intact until a player taps an NPC", () => {
    const html = renderIsometricMapTestArea();
    expect(html).toContain('data-wmh-chat hidden');
    expect(chatStyles).toContain(".wmh-isometric-play-screen .wmh-chat-panel[hidden]{display:none!important}");
  });
});
