import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { APP_LANGUAGES } from "../../src/i18n";
import { worldAtlasAccessBufferMarkup, worldAtlasLoginPanelMarkup } from "../../src/offline-game/world-atlas-login";
import { createWorldAtlasProgressPlan, formatAccessDiagnosticFrame } from "../../src/offline-game/world-atlas-login-motion";

describe("World Atlas player login gate",()=>{
  it("renders a modal sign-in and first-password flow in every supported language",()=>{
    for(const language of APP_LANGUAGES){
      const html=worldAtlasLoginPanelMarkup(language.code);
      expect(html).toContain('data-world-atlas-gate hidden');
      expect(html).toContain('id="world-atlas-login-form"');
      expect(html).toContain('id="world-atlas-login-form" novalidate');
      expect(html).toContain('class="world-atlas-login-scroll mk-panel-scroll" data-atlas-login-scroll');
      const scrollBodyIndex=html.indexOf('data-atlas-login-scroll');
      const loadingOverlayIndex=html.indexOf('data-world-atlas-buffer');
      const fixedFootIndex=html.indexOf('class="world-atlas-login-foot"');
      expect(scrollBodyIndex).toBeGreaterThan(-1);
      expect(scrollBodyIndex).toBeLessThan(loadingOverlayIndex);
      expect(loadingOverlayIndex).toBeLessThan(fixedFootIndex);
      expect(html).toContain('data-password-required-label=');
      expect(html).toContain('data-world-atlas-player');
      expect(html).toContain('data-atlas-signup-panel');
      expect(html).toContain('data-atlas-submit-mode="signup"');
      expect(html).toContain('data-atlas-open-signup');
      expect(html).toContain('data-atlas-password-visibility');
      expect(html).toContain('id="world-atlas-signup-confirm"');
      expect(html).toContain('name="remember"');
      expect(html).toContain('data-login-label=');
      expect(html).toContain('data-signup-label=');
      expect(html).toContain('data-world-atlas-gate-back');
      expect(html).toContain('minlength="8"');
      expect(html).toContain('data-offline-label=');
      const offlineLabelStart=html.indexOf('data-offline-label="')+'data-offline-label="'.length;
      const offlineLabelEnd=html.indexOf('"',offlineLabelStart);
      const offlineLabel=html.slice(offlineLabelStart,offlineLabelEnd);
      const expectedOffline:Record<string,string>={
        id:"Internet tidak terhubung",en:"No internet connection",pt:"Sem conexão com a internet",
        fr:"Aucune connexion Internet",ru:"Нет подключения к интернету",ja:"インターネットに接続",
        "zh-CN":"未连接互联网",ko:"인터넷에 연결"
      };
      expect(offlineLabel).toContain(expectedOffline[language.code]);
      expect(html).toContain('data-world-atlas-buffer');
      expect(html).toContain('data-buffer-context="world-atlas-list"');
      expect(html).not.toContain("PBKDF2-SHA256 DERIVATION...");
      expect(html).toContain('data-buffer-stages=');
      expect(html).toContain('AUTHENTICATION SEQUENCE');
      expect(html).toContain('data-atlas-buffer-status');
      expect(html).toContain('class="atlas-buffer-message"');
      expect(html).toContain('data-atlas-buffer-progress');
      expect(html).toContain('data-password-safety-note');
      expect(html).not.toContain("Kata sandi disimpan secara lokal dalam bentuk hash bersalt.");
      expect(html).toContain('data-password-recovery-note');
      expect(html).toContain('data-password-reset-required-label=');
      expect(html).toContain('data-password-policy-label=');
      const policyStart=html.indexOf('data-password-policy-label="')+'data-password-policy-label="'.length;
      const policyEnd=html.indexOf('"',policyStart);
      expect(html.slice(policyStart,policyEnd)).toBe({"id":"Minimal 8 karakter: huruf besar, huruf kecil, angka, dan simbol.","en":"At least 8 characters: uppercase, lowercase, a number, and a symbol.","pt":"Mínimo de 8 caracteres: maiúscula, minúscula, número e símbolo.","fr":"8 caractères minimum : majuscule, minuscule, chiffre et symbole.","ru":"Не менее 8 символов: заглавная и строчная буквы, цифра и символ.","ja":"8文字以上。大文字、小文字、数字、記号を含めてください。","zh-CN":"至少 8 个字符：包含大写字母、小写字母、数字和符号。","ko":"8자 이상: 대문자, 소문자, 숫자 및 기호를 포함하세요."}[language.code]);
      expect(html).toContain('data-reset-continue-change-label=');
      expect(html).toContain('data-reset-continue-master-label=');
      expect(html).toContain('data-reset-authorized-label=');
      expect(html).toContain('data-reset-set-password-label=');
      expect(html).toContain('data-atlas-reset-new-row');
      expect(html).toContain('data-atlas-reset-confirm-row');
      const warningStart=html.indexOf('data-password-safety-note>')+'data-password-safety-note>'.length;
      const warningEnd=html.indexOf('</small>',warningStart);
      const warningText=html.slice(warningStart,warningEnd);
      expect(warningEnd).toBeGreaterThan(warningStart);
      const expectedWarning:Record<string,string>={
        id:"Gunakan kata sandi khusus",en:"Use a password made specifically",pt:"Use uma senha exclusiva",
        fr:"Utilisez un mot de passe réservé",ru:"Используйте отдельный пароль",ja:"World Atlas専用",
        "zh-CN":"请为 World Atlas 单独设置密码",ko:"World Atlas 전용 비밀번호"
      };
      expect(warningText).toContain(expectedWarning[language.code]);
    }
  });
});

describe("Shared Anime.js access buffer profiles",()=>{
  it("shows rapid detailed World Atlas diagnostics with ellipsis",()=>{
    const html=worldAtlasAccessBufferMarkup("id","world-atlas");
    expect(html).toContain('data-buffer-context="world-atlas"');
    expect(html).toContain("UNIVERSE SOURCE LINK...");
    expect(html).toContain("ACTIVE_SHA VALIDATION...");
    expect(html).toContain("PBKDF2-SHA256 DERIVATION...");
    expect(html).toContain("WORLD ATLAS · ACCOUNT HANDSHAKE");
    expect(html).toContain('class="atlas-buffer-message"');
    expect(html).not.toContain('data-atlas-buffer-log');
  });

  it("uses registry-fetch diagnostics before any password verification starts",()=>{
    const html=worldAtlasAccessBufferMarkup("en","world-atlas-list");
    expect(html).toContain("UNIVERSE API CONNECT...");
    expect(html).toContain("PLAYER REGISTRY FETCH...");
    expect(html).toContain("PLAYER PROFILE FETCH...");
    expect(html).toContain("LOCAL CREDENTIAL RECORD...");
    expect(html).not.toContain("PBKDF2-SHA256 DERIVATION...");
  });

  it("shows actual network steps for Player mode",()=>{
    const html=worldAtlasAccessBufferMarkup("en","player");
    expect(html).toContain('data-buffer-context="player"');
    expect(html).toContain("NETWORK REACHABILITY...");
    expect(html).toContain("PLAYER REGISTRY FETCH...");
    expect(html).toContain("PLAYER PROFILE FETCH...");
    expect(html).toContain("PLAYER SOURCE HANDSHAKE");
  });

  it("never describes Developer sign-in as a server or network sync",()=>{
    const html=worldAtlasAccessBufferMarkup("en","developer");
    expect(html).toContain('data-buffer-context="developer"');
    expect(html).toContain("LOCAL CREDENTIAL STORE...");
    expect(html).toContain("PBKDF2-SHA256 DERIVATION...");
    expect(html).toContain("LOCAL DEVELOPER HANDSHAKE");
    expect(html).not.toContain("NETWORK REACHABILITY...");
    expect(html).not.toContain("UNIVERSE SOURCE LINK...");
  });


  it("describes Developer reset request generation without network claims",()=>{
    const html=worldAtlasAccessBufferMarkup("en","developer-reset");
    expect(html).toContain("PLAYER ACCOUNT BINDING...");
    expect(html).toContain("RANDOM REQUEST ID...");
    expect(html).toContain("CRYPTOGRAPHIC CHALLENGE...");
    expect(html).toContain("PLAYER KEY SHA-256...");
    expect(html).not.toContain("NETWORK REACHABILITY...");
  });

  it("describes clipboard writing as a device operation",()=>{
    const html=worldAtlasAccessBufferMarkup("en","clipboard");
    expect(html).toContain("CLIPBOARD CAPABILITY...");
    expect(html).toContain("SYSTEM CLIPBOARD WRITE...");
    expect(html).not.toContain("PBKDF2-SHA256 DERIVATION...");
  });

  it("describes Developer sign-out as local session revocation",()=>{
    const html=worldAtlasAccessBufferMarkup("en","developer-session");
    expect(html).toContain("DEVELOPER SESSION REVOKE...");
    expect(html).toContain("SECURE STORAGE CLEANUP...");
    expect(html).not.toContain("NETWORK REACHABILITY...");
  });


  it("ends every rapidly rotating diagnostic status with an ellipsis in every language",()=>{
    const contexts=["world-atlas-list","world-atlas","player","developer","player-session","developer-session","developer-reset","clipboard"] as const;
    for(const language of APP_LANGUAGES){
      for(const context of contexts){
        const html=worldAtlasAccessBufferMarkup(language.code,context);
        const stages=html.match(/data-buffer-stages="([^"]+)"/)?.[1]?.split("|")??[];
        const logs=html.match(/data-buffer-logs="([^"]+)"/)?.[1]?.split("|")??[];
        expect(stages.length,language.code+" "+context+" stages").toBeGreaterThan(0);
        expect(logs.length,language.code+" "+context+" logs").toBeGreaterThan(0);
        expect(stages.every(value=>value.endsWith("..."))).toBe(true);
        expect(logs.every(value=>value.endsWith("..."))).toBe(true);
      }
    }
  });

  it("uses a local cleanup sequence for Player sign-out",()=>{
    const html=worldAtlasAccessBufferMarkup("en","player-session");
    expect(html).toContain("PLAYER SESSION CLOSE...");
    expect(html).toContain("SESSION MARKER CLEAR...");
    expect(html).not.toContain("NETWORK REACHABILITY...");
  });
});


describe("Confirmation access loading frames",()=>{
  it("replaces one diagnostic frame with one, two, then three dots",()=>{
    expect(formatAccessDiagnosticFrame("Blahblah...",1)).toBe("Blahblah.");
    expect(formatAccessDiagnosticFrame("Blahblah...",2)).toBe("Blahblah..");
    expect(formatAccessDiagnosticFrame("Blahblah...",3)).toBe("Blahblah...");
  });

  it("builds one monotonic progress pass with a final 92 percent wait point",()=>{
    const plan=createWorldAtlasProgressPlan(8,4200,()=>0.5);
    expect(plan).toHaveLength(8);
    expect(plan[plan.length-1].target).toBe(92);
    expect(plan.every(step=>step.target>0&&step.target<=92)).toBe(true);
    expect(plan.every(step=>step.advanceMs>0&&step.stallMs>0&&step.frameMs===64)).toBe(true);
    for(let index=1;index<plan.length;index++){
      expect(plan[index].target).toBeGreaterThan(plan[index-1].target);
    }
    const total=plan.reduce((sum,step)=>sum+step.advanceMs+step.stallMs+step.frameMs*3,0);
    expect(total).toBeCloseTo(4200,5);
  });

  it("uses varying checkpoints and pauses when the random source changes",()=>{
    const quick=createWorldAtlasProgressPlan(7,3600,()=>0.15);
    const slow=createWorldAtlasProgressPlan(7,3600,()=>0.85);
    expect(quick.map(step=>step.target)).not.toEqual(slow.map(step=>step.target));
    expect(quick.map(step=>step.stallMs)).not.toEqual(slow.map(step=>step.stallMs));
    expect(quick.every((step,index)=>index===0||step.target>quick[index-1].target)).toBe(true);
    expect(slow.every((step,index)=>index===0||step.target>slow[index-1].target)).toBe(true);
  });
});


describe("Stable loading and Arcanistry machine indicators",()=>{
  it("keeps the fake Atlas access scene from cycling its status or blinking its lamps",()=>{
    const motion=readFileSync(new URL("../../src/offline-game/world-atlas-login-motion.ts",import.meta.url),"utf8");
    const css=readFileSync(new URL("../../src/offline-game/idle-home-map.css",import.meta.url),"utf8");
    expect(motion).toContain("dotFrame");
    expect(motion).toContain("createWorldAtlasProgressPlan(Math.max");
    expect(css).toContain("opacity:1;animation:none;will-change:auto;");
    expect(css).toContain("background:#d7c184;box-shadow:0 0 8px #d7c184;opacity:.9;animation:none;");
  });

  it("uses steady Transit Machine indicator lights instead of random flicker",()=>{
    const css=readFileSync(new URL("../../src/offline-game/idle-home-map.css",import.meta.url),"utf8");
    const machine=readFileSync(new URL("../../src/offline-game/arcanistry-ticket-machine.ts",import.meta.url),"utf8");
    expect(css).toContain(".arcanist-card-warning-lamp.is-lit{background:#ff9b32;box-shadow:0 0 5px 2px #ff8a27,0 0 12px #ff9d3caa;opacity:1;will-change:auto;animation:none}");
    expect(css).toContain("animation:arcanist-master-breathe 2.2s ease-in-out infinite");
    expect(machine).not.toContain("--lamp-flicker-duration");
  });

  it("loads pink Atlas player names from the verified Universe registry when online",()=>{
    const main=readFileSync(new URL("../../src/main.ts",import.meta.url),"utf8");
    expect(main).not.toContain("atlasOfflinePxlPlayers");
    expect(main).toContain("refreshLatestPlayerRegistry(canon.commitSha)");
    expect(main).toContain("const options=atlasEligiblePlayers();");
  });
});
