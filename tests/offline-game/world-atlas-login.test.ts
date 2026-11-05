import { describe, expect, it } from "vitest";
import { APP_LANGUAGES } from "../../src/i18n";
import { worldAtlasLoginPanelMarkup } from "../../src/offline-game/world-atlas-login";

describe("World Atlas player login gate",()=>{
  it("renders a modal sign-in and first-password flow in every supported language",()=>{
    for(const language of APP_LANGUAGES){
      const html=worldAtlasLoginPanelMarkup(language.code);
      expect(html).toContain('data-world-atlas-gate hidden');
      expect(html).toContain('id="world-atlas-login-form"');
      expect(html).toContain('data-world-atlas-player');
      expect(html).toContain('data-world-atlas-confirm-row');
      expect(html).toContain('name="remember"');
      expect(html).toContain('data-login-label=');
      expect(html).toContain('data-signup-label=');
      expect(html).toContain('data-world-atlas-gate-back');
    }
  });
});
