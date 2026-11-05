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
      expect(html).toContain('data-world-atlas-buffer');
      expect(html).toContain('data-buffer-stages=');
      expect(html).toContain('AUTHENTICATION SEQUENCE');
      expect(html).toContain('data-atlas-buffer-status');
      expect(html).toContain('data-atlas-buffer-log');
      expect(html).toContain('data-atlas-buffer-progress');
      expect(html).toContain('data-password-safety-note');
      const warningMatch=html.match(/<small class="world-atlas-password-safety" data-password-safety-note>(.*?)<\\/small>/);
      expect(warningMatch?.[1]).toBeTruthy();
      const expectedWarning:Record<string,string>={
        id:"Gunakan kata sandi khusus",en:"Use a password made specifically",pt:"Use uma senha exclusiva",
        fr:"Utilisez un mot de passe réservé",ru:"Используйте отдельный пароль",ja:"World Atlas専用",
        "zh-CN":"请为 World Atlas 单独设置密码",ko:"World Atlas 전용 비밀번호"
      };
      expect(warningMatch?.[1]).toContain(expectedWarning[language.code]);
    }
  });
});
