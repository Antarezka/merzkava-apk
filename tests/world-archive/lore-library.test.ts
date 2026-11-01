import { afterEach, describe, expect, it } from "vitest";
import {
  LORE_ENTRIES,
  closeLoreEntry,
  getPublicLoreEntries,
  getLoreBacklinks,
  getLoreSourceDisposition,
  LORE_PLACEHOLDERS,
  resolveLorePlaceholder,
  openLorePlaceholder,
  closeLorePlaceholder,
  openLoreSource,
  closeLoreSource,
  openLoreEntry,
  renderLoreLibrary,
  renderLoreResults,
  resolveLoreEntry,
  setLoreSearch
} from "../../src/world-archive/lore-library";

afterEach(() => {
  closeLoreEntry();
  closeLorePlaceholder();
  setLoreSearch("");
});

describe("World Archive visibility and entity routing", () => {
  it("makes every published dossier title searchable and every cross-reference target resolvable", () => {
    const entries = getPublicLoreEntries();
    const publicIds = new Set(entries.map(entry => entry.id));
    for (const entry of entries) {
      expect(resolveLoreEntry(entry.title)?.id).toBe(entry.id);
      for (const targetId of entry.crossReferenceIds) expect(publicIds.has(targetId)).toBe(true);
      setLoreSearch(entry.title);
      expect(renderLoreResults()).toContain('data-lore-open="' + entry.id + '"');
    }
  });

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

  it("publishes all seven reviewed Golden Dragon regions as distinct clickable entities", () => {
    const regionIds = [
      "region-longyuan", "region-canglan", "region-jinyue", "region-tianfeng",
      "region-yanling", "region-baiyue", "region-xingluo"
    ];
    const publicIds = new Set(getPublicLoreEntries().map(entry => entry.id));
    for (const id of regionIds) {
      expect(publicIds.has(id)).toBe(true);
      expect(getLoreSourceDisposition(id)).toBe("PUBLIC_CANDIDATE");
    }
    expect(resolveLoreEntry("Longyuan")?.id).toBe("region-longyuan");
    expect(resolveLoreEntry("Canglan")?.id).toBe("region-canglan");
    expect(resolveLoreEntry("Jinyue")?.id).toBe("region-jinyue");
    expect(resolveLoreEntry("Tianfeng")?.id).toBe("region-tianfeng");
    expect(resolveLoreEntry("Yanling")?.id).toBe("region-yanling");
    expect(resolveLoreEntry("Baiyue")?.id).toBe("region-baiyue");
    expect(resolveLoreEntry("Xingluo")?.id).toBe("region-xingluo");

    expect(resolveLoreEntry("Huanglongcheng")).toBeUndefined();
    expect(resolveLoreEntry("Cangqiong Harbor")).toBeUndefined();

    expect(openLoreEntry("golden-dragon")).toBe(true);
    const html = renderLoreLibrary();
    for (const id of regionIds) expect(html).toContain('data-lore-open="' + id + '"');

    expect(openLoreSource("region-baiyue")).toBe(true);
    const sourceHtml = renderLoreLibrary();
    expect(sourceHtml).toContain("PUBLIC_CANDIDATE");
    expect(sourceHtml).not.toMatch(/Baihu Xuefeng|Sepatu Salju|Serigala Abu|Crimson Keel Brotherhood/);
  });

  it("keeps intentionally under-specified entities linked with explicit status", () => {
    const city = resolveLorePlaceholder("Huanglongcheng");
    const harbor = resolveLorePlaceholder("Cangqiong Harbor");
    expect(city?.id).toBe("placeholder-huanglongcheng");
    expect(harbor?.id).toBe("placeholder-cangqiong-harbor");
    expect(city?.status).toBe("ON_PLAN");
    expect(harbor?.status).toBe("ON_PLAN");
    expect(LORE_PLACEHOLDERS.every(item => ["ON_PLAN", "NON_CANON"].includes(item.status))).toBe(true);
    expect(resolveLoreEntry("Huanglongcheng")).toBeUndefined();
    expect(resolveLoreEntry("Cangqiong Harbor")).toBeUndefined();

    expect(openLoreEntry("golden-dragon")).toBe(true);
    let html = renderLoreLibrary();
    expect(html).toContain('data-lore-placeholder-open="placeholder-huanglongcheng"');
    expect(html).toContain("ON PLAN");

    expect(openLorePlaceholder("placeholder-huanglongcheng")).toBe(true);
    html = renderLoreLibrary();
    expect(html).toContain("ENTITY DEVELOPMENT REGISTER");
    expect(html).toContain("intentionally under-specified");
    expect(html).toContain("not missing data");
    expect(html).toContain('data-lore-open="golden-dragon"');

    expect(openLoreEntry("seas")).toBe(true);
    html = renderLoreLibrary();
    expect(html).toContain('data-lore-placeholder-open="placeholder-cangqiong-harbor"');
    setLoreSearch("Huanglongcheng");
    expect(renderLoreResults()).toContain('data-lore-placeholder-open="placeholder-huanglongcheng"');
    expect(openLorePlaceholder("not-a-placeholder")).toBe(false);
  });

  it("publishes the reviewed public governance, services, education, society and route dossiers", () => {
    const expected = [
      ["imperial-governance", "PUBLIC_CANDIDATE"],
      ["imperial-public-services", "PUBLIC_CANDIDATE"],
      ["open-learning-paths", "PUBLIC_CANDIDATE"],
      ["social-stratification", "PUBLIC_CANDIDATE"],
      ["three-power-routes", "PUBLIC_CANDIDATE"],
      ["geography-travel", "PARTIAL_PUBLIC"],
      ["tianhai-academies", "PUBLIC_CANDIDATE"],
      ["world-wealth", "PUBLIC_CANDIDATE"]
    ] as const;
    const publicIds = new Set(getPublicLoreEntries().map(entry => entry.id));
    for (const [id, disposition] of expected) {
      expect(publicIds.has(id)).toBe(true);
      expect(getLoreSourceDisposition(id)).toBe(disposition);
      expect(openLoreSource(id)).toBe(true);
      expect(renderLoreLibrary()).toContain(disposition);
      closeLoreSource();
    }
    expect(resolveLoreEntry("Tianlan Supreme Academy")?.id).toBe("tianhai-academies");
    expect(resolveLoreEntry("Imperial Governance")?.id).toBe("imperial-governance");
    expect(resolveLoreEntry("Open Learning Paths")?.id).toBe("open-learning-paths");
  });

  it("publishes claim-reviewed NPC extracts without private whereabouts or hidden affiliations", () => {
    const ids = [
      "beiming-jingheng", "beiming-xuanyu", "binghe-chuanliu", "lan-feng",
      "cangxue-beiran", "cangxue-tielan", "shuang-yue", "hanyue-mingzhao",
      "tie-song", "lingfeng-yujin", "minghu-yanshu", "mo-xueyan",
      "bai-yushen", "tieshi-beiyue", "xuanbing-lingsu", "xuanbing-yue",
      "xuansong-qinghe", "xuanye-zhenbei", "yaochi-suwen", "yinshan-qiaofeng",
      "luo-zhenkai", "shen-yunting", "duan-haicheng", "lin-qiaoyu"
    ];
    const publicEntries = getPublicLoreEntries();
    const publicIds = new Set(publicEntries.map(entry => entry.id));
    for (const id of ids) {
      expect(publicIds.has(id)).toBe(true);
      expect(getLoreSourceDisposition(id)).toBe("PUBLIC_CANDIDATE");
    }
    const publicText = JSON.stringify(publicEntries.filter(entry => ids.includes(entry.id)));
    for (const restricted of [
      "current whereabouts", "exact residence", "secret connection",
      "high-level criminal organization", "private incident", "cover identity"
    ]) expect(publicText.toLowerCase()).not.toContain(restricted.toLowerCase());
    expect(publicText).not.toContain("Beiming Nerva");
    expect(publicText).not.toContain("Ying Wuxin");
  });

  it("links named imperial officeholders and public institutional extracts without leaking internal agendas", () => {
    const ids = [
      "official-xuanyuan-wenyuan", "official-shen-mingde", "official-yunlan-qingzhi",
      "official-baihu-zhengyang", "official-gu-jingheng", "official-cangyue-yucheng",
      "official-heiyu-zhaolin", "official-xuanyuan-haoran", "official-cangyue-yunhe",
      "official-tieyan-mingxuan", "official-yunlan-qinglan", "official-yanling-zhenyu",
      "official-baihu-xuefeng", "official-zhenhai-haixiu", "imperial-audit-committee",
      "prison-bound-items"
    ];
    const publicEntries = getPublicLoreEntries();
    const byId = new Map(publicEntries.map(entry => [entry.id, entry]));
    for (const id of ids) {
      expect(byId.has(id)).toBe(true);
      expect(getLoreSourceDisposition(id)).toBe("PUBLIC_CANDIDATE");
    }
    const officialText = ids.map(id => byId.get(id)?.summary + " " + byId.get(id)?.paragraphs.join(" ")).join(" ");
    expect(officialText).not.toContain("present aim");
    expect(officialText).not.toContain("political disposition");
    expect(officialText).not.toContain("Luca's family case");
    expect(resolveLoreEntry("Xuanyuan Haoran")?.id).toBe("official-xuanyuan-haoran");
    expect(resolveLoreEntry("Imperial Special Financial Audit Committee")?.id).toBe("imperial-audit-committee");
  });

  it("keeps discovery-sensitive mountain groups behind a non-revealing ON_PLAN link", () => {
    const placeholder = resolveLorePlaceholder("High Cloud-Sea Mountains");
    expect(placeholder?.id).toBe("placeholder-remote-mountain-traditions");
    expect(placeholder?.status).toBe("ON_PLAN");
    expect(placeholder?.sourcePath).toBe("world/ANCIENT_SHAMANISM_AND_BUDDHIST_CLANS.md");
    expect(openLorePlaceholder("placeholder-remote-mountain-traditions")).toBe(true);
    const html = renderLoreLibrary();
    expect(html).toContain("no concealed group identity or roster is disclosed");
    expect(html).not.toContain("Ancient Shamanism");
    expect(html).not.toContain("Buddhist Mountain Clan");
  });

  it("connects public regional and official names through clickable dossier mentions", () => {
    expect(openLoreEntry("golden-dragon")).toBe(true);
    let html = renderLoreLibrary();
    for (const id of [
      "official-xuanyuan-wenyuan", "official-shen-mingde", "official-yunlan-qingzhi",
      "official-baihu-zhengyang", "official-gu-jingheng", "official-cangyue-yucheng",
      "official-heiyu-zhaolin", "official-xuanyuan-haoran", "official-cangyue-yunhe",
      "official-tieyan-mingxuan", "official-yunlan-qinglan", "official-yanling-zhenyu",
      "official-baihu-xuefeng", "official-zhenhai-haixiu"
    ]) expect(html).toContain('data-lore-open="' + id + '"');

    expect(openLoreEntry("beiming")).toBe(true);
    html = renderLoreLibrary();
    for (const id of [
      "beiming-jingheng", "beiming-xuanyu", "binghe-chuanliu", "lan-feng",
      "cangxue-beiran", "cangxue-tielan", "shuang-yue", "hanyue-mingzhao",
      "tie-song", "lingfeng-yujin", "minghu-yanshu", "mo-xueyan",
      "bai-yushen", "tieshi-beiyue", "xuanbing-lingsu", "xuanbing-yue",
      "xuansong-qinghe", "xuanye-zhenbei", "yaochi-suwen", "yinshan-qiaofeng"
    ]) expect(html).toContain('data-lore-open="' + id + '"');

    expect(openLoreEntry("geography-travel")).toBe(true);
    html = renderLoreLibrary();
    expect(html).toContain('data-lore-placeholder-open="placeholder-remote-mountain-traditions"');
    expect(html).toContain("ON PLAN");

    expect(openLoreEntry("tianhai")).toBe(true);
    html = renderLoreLibrary();
    expect(html).toContain('data-lore-open="duan-haicheng"');
    expect(html).toContain('data-lore-open="lin-qiaoyu"');
    expect(getLoreBacklinks("official-xuanyuan-haoran").some(entry => entry.id === "golden-dragon")).toBe(true);
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

  it("opens a local reviewed source extract with exact provenance and safe scope", () => {
    expect(getLoreSourceDisposition("world-atlas")).toBe("PARTIAL_PUBLIC");
    expect(getLoreSourceDisposition("tianhai")).toBe("PUBLISHED");
    expect(getLoreSourceDisposition("not-a-public-dossier")).toBeUndefined();

    expect(openLoreSource("tianhai")).toBe(true);
    let html = renderLoreLibrary();
    expect(html).toContain("OFFLINE SOURCE READER");
    expect(html).toContain("REVIEWED EXTRACT");
    expect(html).toContain("world/REGION_TIANHAI_YUNZHOU.md");
    expect(html).toContain("2f76a864150528afb0e3d26cb16f9396ce610ff6");
    expect(html).toContain("PUBLICLY REVIEWED CONTENT");
    expect(html).toContain("not a verbatim copy of the canonical Markdown file");
    closeLoreSource();

    expect(openLoreEntry("world-atlas")).toBe(true);
    expect(openLoreSource("world-atlas")).toBe(true);
    html = renderLoreLibrary();
    expect(html).toContain("PARTIAL_PUBLIC");
    expect(html).toContain("mixed publication scope");
    expect(html).toContain("raw Markdown is intentionally not copied");
    closeLoreSource();
    expect(renderLoreLibrary()).toContain("LOCAL DOSSIER");

    expect(openLoreSource("beiming-xenhwa")).toBe(true);
    html = renderLoreLibrary();
    expect(html).not.toMatch(/\b17\b|white nine-tailed fox|half-beast|current whereabouts/i);
    expect(html).toContain("Beiming Xenhwa");
    closeLoreSource();
    expect(renderLoreLibrary()).toContain("LOCAL DOSSIER");
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
        const existingOwner = names.get(normalized);
        expect(existingOwner === undefined || existingOwner === entry.id).toBe(true);
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
