import { describe, expect, it } from "vitest";
import { APP_LANGUAGES } from "../../src/i18n";
import { worldAtlasAccessBufferMarkup, worldAtlasLoginPanelMarkup } from "../../src/offline-game/world-atlas-login";

describe("World Atlas player login gate",()=>{
  it("renders a modal sign-in and first-password flow in every supported language",()=>{
    for(const language of APP_LANGUAGES){
      const html=worldAtlasLoginPanelMarkup(language.code);
      expect(html).toContain('data-world-atlas-gate hidden');
      expect(html).toContain('id="world-atlas-login-form"');
      expect(html).toContain('id="world-atlas-login-form" novalidate');
      expect(html).toContain('data-password-required-label=');
      expect(html).toContain('data-world-atlas-player');
      expect(html).toContain('data-world-atlas-confirm-row');
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
      expect(html).toContain('data-buffer-stages=');
      expect(html).toContain('AUTHENTICATION SEQUENCE');
      expect(html).toContain('data-atlas-buffer-status');
      expect(html).toContain('data-atlas-buffer-log');
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

  it("uses a local cleanup sequence for Player sign-out",()=>{
    const html=worldAtlasAccessBufferMarkup("en","player-session");
    expect(html).toContain("PLAYER SESSION CLOSE...");
    expect(html).toContain("SESSION MARKER CLEAR...");
    expect(html).not.toContain("NETWORK REACHABILITY...");
  });
});
