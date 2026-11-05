import { describe, expect, it } from "vitest";
import { APP_LANGUAGES } from "../../src/i18n";
import { exitConfirmationPanelMarkup } from "../../src/app/exit-confirm-panel";

describe("Android Back Home confirmation",()=>{
  it("localizes the stay and exit actions for all application languages",()=>{
    for(const language of APP_LANGUAGES){
      const html=exitConfirmationPanelMarkup(language.code);
      expect(html).toContain('role="alertdialog"');
      expect(html).toContain('data-app-exit-no');
      expect(html).toContain('data-app-exit-yes');
      expect(html).toContain('hidden');
    }
  });
});
