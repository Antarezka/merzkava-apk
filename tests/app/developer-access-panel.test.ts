import { describe, expect, it } from "vitest";
import { APP_LANGUAGES } from "../../src/i18n";
import { accountSettingsPanel, developerLoginPanel } from "../../src/app/developer-access-panel";

describe("Account controls in Settings",()=>{
  it("keeps developer Floating Control and Lock controls in the account panel for every language",()=>{
    for(const language of APP_LANGUAGES){
      const html=accountSettingsPanel(language.code,true,false);
      expect(html).toContain("data-dev-open-control");
      expect(html).toContain("data-dev-logout");
      expect(html).toContain("account-access-icon icon-floating");
      expect(html).toContain("account-access-icon icon-lock");
      expect(html).toContain("data-atlas-developer-reset-submit");
      expect(html).toContain("developer-atlas-reset-player");
      expect(html).toContain("data-atlas-developer-reset-proof");
      expect(html).toContain("developer-atlas-reset-confirm");
      expect(html).toContain("data-atlas-developer-reset-proof");
      expect(html).toContain("developer-atlas-reset-confirm");
    }
  });

  it("shows only player sign-out for a player session and nothing for a guest",()=>{
    for(const language of APP_LANGUAGES){
      const player=accountSettingsPanel(language.code,false,true);
      expect(player).toContain("data-player-logout");
      expect(player).not.toContain("data-atlas-developer-reset-submit");
      expect(player).not.toContain("data-dev-logout");
      expect(accountSettingsPanel(language.code,false,false)).toBe("");
    }
  });
});

describe("Initial Developer login panel",()=>{
  it("renders the accessible password eye toggle",()=>{
    const html=developerLoginPanel("id","",false,true);
    expect(html).toContain('data-password-visibility-toggle="developer-login-password"');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain("<svg");
  });

  it("prefills opted-in credentials and checks Remember Me after Lock",()=>{
    const html=developerLoginPanel("en","",false,true,"",false,"developer","",{
      identifier:"developer@example",
      password:"test-password-value"
    });
    expect(html).toContain('value="developer@example"');
    expect(html).toContain('value="test-password-value"');
    expect(html).toContain('name="remember" value="yes" checked');
  });

  it("escapes remembered values before placing them in form fields",()=>{
    const html=developerLoginPanel("en","",false,true,"",false,"developer","",{
      identifier:'dev"&id',
      password:"pass<word>"
    });
    expect(html).toContain('value="dev&quot;&amp;id"');
    expect(html).toContain('value="pass&lt;word&gt;"');
  });
});
