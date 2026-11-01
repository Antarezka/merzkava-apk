import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const css = readFileSync(resolve(root, "src/style.css"), "utf8");

describe("World Archive offline typography", () => {
  it("bundles every Cinzel and Cormorant Garamond weight locally", () => {
    const fonts = [
      "cinzel-latin-400-normal.woff2",
      "cinzel-latin-500-normal.woff2",
      "cinzel-latin-600-normal.woff2",
      "cinzel-latin-700-normal.woff2",
      "cormorant-garamond-latin-400-normal.woff2",
      "cormorant-garamond-latin-500-normal.woff2",
      "cormorant-garamond-latin-600-normal.woff2",
      "cormorant-garamond-latin-700-normal.woff2"
    ];
    for (const font of fonts) {
      expect(existsSync(resolve(root, "src/assets/fonts", font))).toBe(true);
      expect(css).toContain(`./assets/fonts/${font}`);
    }
    expect(css.match(/@font-face/g)?.length).toBeGreaterThanOrEqual(8);
  });

  it("does not request typography from a remote font service", () => {
    expect(css).not.toMatch(/@import\\s+url\\(['"]https:\\/\\/fonts\\.googleapis\\.com/i);
  });

  it("keeps Archive reading text at the mobile readability scale", () => {
    expect(css).toContain(".lore-card-summary{color:#d0c5b8;font-size:13px;line-height:1.7}");
    expect(css).toContain(".lore-paragraph{color:#d7ccbe;font-size:14px;line-height:1.85");
    expect(css).toContain(".lore-footnote{color:#c2b6a6;font-size:10px");
    expect(css).toContain(".lore-category{color:#d8c9b4;font-size:11px");
  });
});
