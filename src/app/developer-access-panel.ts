import type { AppLanguage } from "../i18n";

type AccessMode = "player" | "developer";
type RememberedCredentials = { identifier: string; password: string } | null;

const labels:Record<AppLanguage,{
  open:string;title:string;id:string;password:string;remember:string;submit:string;close:string;control:string;lock:string;
  playerMode:string;developerMode:string;playerName:string;playerContinue:string;playerHint:string;playerLogout:string;
  showPassword:string;hidePassword:string;accountHeading:string;developerSession:string;playerSession:string;accountDescription:string;
}> = {
  id:{
    open:"Akses pengembang",title:"Akses Akun",id:"ID pengembang",password:"Kata sandi",remember:"Ingat akun dan kata sandi di perangkat ini",submit:"Masuk",close:"Tutup",control:"Floating Control",lock:"Kunci",playerMode:"Pemain",developerMode:"Developer",playerName:"Nama karakter",playerContinue:"Lanjutkan",playerHint:"Gunakan nama yang sama persis seperti di registry resmi players.md.",playerLogout:"Keluar",
    showPassword:"Tampilkan kata sandi",hidePassword:"Sembunyikan kata sandi",accountHeading:"AKUN & AKSES",developerSession:"SESI DEVELOPER",playerSession:"SESI PEMAIN",accountDescription:"Kelola sesi dan akses Floating Control dari sini."
  },
  en:{
    open:"Developer access",title:"Account Access",id:"Developer ID",password:"Password",remember:"Remember account and password on this device",submit:"Sign in",close:"Close",control:"Floating Control",lock:"Lock",playerMode:"Player",developerMode:"Developer",playerName:"Registered character name",playerContinue:"Continue",playerHint:"Enter the exact name shown in the official players.md registry.",playerLogout:"Sign out",
    showPassword:"Show password",hidePassword:"Hide password",accountHeading:"ACCOUNT & ACCESS",developerSession:"DEVELOPER SESSION",playerSession:"PLAYER SESSION",accountDescription:"Manage your session and Floating Control access here."
  },
  pt:{
    open:"Acesso do desenvolvedor",title:"Acesso à conta",id:"ID do desenvolvedor",password:"Senha",remember:"Lembrar conta e senha neste dispositivo",submit:"Entrar",close:"Fechar",control:"Floating Control",lock:"Bloquear",playerMode:"Jogador",developerMode:"Developer",playerName:"Nome do personagem registrado",playerContinue:"Continuar",playerHint:"Digite o nome exatamente como aparece no registro oficial players.md.",playerLogout:"Sair",
    showPassword:"Mostrar senha",hidePassword:"Ocultar senha",accountHeading:"CONTA E ACESSO",developerSession:"SESSÃO DE DESENVOLVEDOR",playerSession:"SESSÃO DO JOGADOR",accountDescription:"Gerencie sua sessão e o Floating Control aqui."
  },
  fr:{
    open:"Accès développeur",title:"Accès au compte",id:"Identifiant développeur",password:"Mot de passe",remember:"Mémoriser le compte et le mot de passe sur cet appareil",submit:"Connexion",close:"Fermer",control:"Floating Control",lock:"Verrouiller",playerMode:"Joueur",developerMode:"Developer",playerName:"Nom du personnage enregistré",playerContinue:"Continuer",playerHint:"Saisissez le nom exactement comme dans le registre officiel players.md.",playerLogout:"Déconnexion",
    showPassword:"Afficher le mot de passe",hidePassword:"Masquer le mot de passe",accountHeading:"COMPTE ET ACCÈS",developerSession:"SESSION DÉVELOPPEUR",playerSession:"SESSION JOUEUR",accountDescription:"Gérez votre session et l'accès Floating Control ici."
  },
  ru:{
    open:"Доступ разработчика",title:"Доступ к аккаунту",id:"ID разработчика",password:"Пароль",remember:"Запомнить аккаунт и пароль на этом устройстве",submit:"Войти",close:"Закрыть",control:"Floating Control",lock:"Заблокировать",playerMode:"Игрок",developerMode:"Developer",playerName:"Имя зарегистрированного персонажа",playerContinue:"Продолжить",playerHint:"Введите имя в точном соответствии с официальным реестром players.md.",playerLogout:"Выйти",
    showPassword:"Показать пароль",hidePassword:"Скрыть пароль",accountHeading:"АККАУНТ И ДОСТУП",developerSession:"СЕССИЯ РАЗРАБОТЧИКА",playerSession:"СЕССИЯ ИГРОКА",accountDescription:"Управляйте сессией и доступом Floating Control здесь."
  },
  ja:{
    open:"開発者アクセス",title:"アカウントアクセス",id:"開発者ID",password:"パスワード",remember:"この端末にアカウントとパスワードを保存",submit:"ログイン",close:"閉じる",control:"Floating Control",lock:"ロック",playerMode:"プレイヤー",developerMode:"Developer",playerName:"登録キャラクター名",playerContinue:"続行",playerHint:"公式 players.md レジストリと完全に一致する名前を入力してください。",playerLogout:"ログアウト",
    showPassword:"パスワードを表示",hidePassword:"パスワードを非表示",accountHeading:"アカウントとアクセス",developerSession:"開発者セッション",playerSession:"プレイヤーセッション",accountDescription:"ここでセッションと Floating Control へのアクセスを管理します。"
  },
  "zh-CN":{
    open:"开发者入口",title:"账户入口",id:"开发者 ID",password:"密码",remember:"在此设备上记住账户和密码",submit:"登录",close:"关闭",control:"Floating Control",lock:"锁定",playerMode:"玩家",developerMode:"Developer",playerName:"已登记角色名称",playerContinue:"继续",playerHint:"请输入与官方 players.md 注册表完全一致的名称。",playerLogout:"退出",
    showPassword:"显示密码",hidePassword:"隐藏密码",accountHeading:"账户与访问",developerSession:"开发者会话",playerSession:"玩家会话",accountDescription:"在此管理会话和 Floating Control 访问权限。"
  },
  ko:{
    open:"개발자 접근",title:"계정 접근",id:"개발자 ID",password:"비밀번호",remember:"이 기기에 계정과 비밀번호 기억",submit:"로그인",close:"닫기",control:"Floating Control",lock:"잠금",playerMode:"플레이어",developerMode:"Developer",playerName:"등록된 캐릭터 이름",playerContinue:"계속",playerHint:"공식 players.md 레지스트리에 있는 이름과 정확히 일치하게 입력하세요.",playerLogout:"로그아웃",
    showPassword:"비밀번호 표시",hidePassword:"비밀번호 숨기기",accountHeading:"계정 및 접근",developerSession:"개발자 세션",playerSession:"플레이어 세션",accountDescription:"여기에서 세션과 Floating Control 접근을 관리하세요."
  }
};

function escape(value:string):string {
  return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]||char));
}

export function developerHeaderControls(language:AppLanguage,authenticated:boolean,playerAuthenticated:boolean=false):string {
  const t=labels[language]||labels.en;
  if(authenticated) return '<button type="button" class="developer-tools-open" data-dev-open-control>'+t.control+'</button><button type="button" class="developer-tools-lock" data-dev-logout>'+t.lock+'</button>';
  if(playerAuthenticated) return '<button type="button" class="developer-player-logout" data-player-logout>'+t.playerLogout+'</button>';
  return '<button type="button" class="developer-access-key" data-dev-login-open aria-label="'+t.open+'" title="'+t.open+'">⌑</button>';
}

export function accountSettingsPanel(language:AppLanguage,developerAuthenticated:boolean,playerAuthenticated:boolean):string {
  const t=labels[language]||labels.en;
  if(!developerAuthenticated&&!playerAuthenticated)return "";
  const developer=developerAuthenticated;
  const actions=developer
    ? '<button type="button" class="account-access-action" data-dev-open-control><span class="account-access-icon icon-floating" aria-hidden="true"><i></i></span><span>'+t.control+'</span><b>↗</b></button><button type="button" class="account-access-action is-lock" data-dev-logout><span class="account-access-icon icon-lock" aria-hidden="true"><i></i></span><span>'+t.lock+'</span><b>×</b></button>'
    : '<button type="button" class="account-access-action is-lock" data-player-logout><span class="account-access-icon icon-lock" aria-hidden="true"><i></i></span><span>'+t.playerLogout+'</span><b>×</b></button>';
  return '<section class="section-block account-access-settings"><div class="section-heading"><span>'+t.accountHeading+'</span><small>'+(developer?t.developerSession:t.playerSession)+'</small></div><p class="muted">'+t.accountDescription+'</p><div class="account-access-actions">'+actions+'</div></section>';
}

export function developerLoginPanel(
  language:AppLanguage,
  developerMessage:string,
  developerBusy:boolean,
  required:boolean=false,
  playerMessage:string="",
  playerBusy:boolean=false,
  mode:AccessMode="player",
  playerName:string="",
  rememberedCredentials:RememberedCredentials=null
):string {
  const t=labels[language]||labels.en;
  const closeButton=required?"":'<button type="button" class="developer-login-close" data-dev-login-close aria-label="'+t.close+'">×</button>';
  const playerHidden=mode==="player"?"":" hidden";
  const developerHidden=mode==="developer"?"":" hidden";
  const rememberedIdentifier=rememberedCredentials?.identifier??"";
  const rememberedPassword=rememberedCredentials?.password??"";
  const rememberChecked=rememberedCredentials?" checked":"";
  const eyeIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.2 12s3.5-6.3 9.8-6.3 9.8 6.3 9.8 6.3-3.5 6.3-9.8 6.3S2.2 12 2.2 12Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
  return '<div class="developer-login-backdrop" data-dev-login-panel '+(required?"":"hidden")+'><section class="developer-login-card" role="dialog" aria-modal="true" aria-labelledby="developer-login-title">'+
    closeButton+'<small>MERZKAVA · ACCOUNT ACCESS</small><h2 id="developer-login-title">'+t.title+'</h2>'+
    '<div class="access-mode-tabs" role="tablist" aria-label="Account type">'+
      '<button type="button" role="tab" data-access-mode="player" aria-selected="'+(mode==="player")+'" class="'+(mode==="player"?"is-active":"")+'" '+((playerBusy||developerBusy)?"disabled":"")+'>'+t.playerMode+'</button>'+
      '<button type="button" role="tab" data-access-mode="developer" aria-selected="'+(mode==="developer")+'" class="'+(mode==="developer"?"is-active":"")+'" '+((playerBusy||developerBusy)?"disabled":"")+'>'+t.developerMode+'</button>'+
    '</div>'+
    '<form id="player-login-form"'+playerHidden+'>'+
      '<label for="player-login-name">'+t.playerName+'</label>'+
      '<input id="player-login-name" name="playerName" type="text" maxlength="80" autocomplete="off" autocapitalize="off" spellcheck="false" value="'+escape(playerName)+'" required/>'+
      '<p class="access-login-hint">'+t.playerHint+'</p>'+
      '<p class="developer-login-message" data-player-login-message role="status">'+escape(playerMessage)+'</p>'+
      '<button type="submit" class="developer-login-submit" '+(playerBusy?"disabled":"")+'>'+(playerBusy?"…":t.playerContinue)+'</button>'+
    '</form>'+
    '<form id="developer-login-form"'+developerHidden+'>'+
      '<label for="developer-login-id">'+t.id+'</label><input id="developer-login-id" name="identifier" type="text" maxlength="80" autocomplete="username" value="'+escape(rememberedIdentifier)+'" required/>'+
      '<label for="developer-login-password">'+t.password+'</label><div class="developer-password-field"><input id="developer-login-password" name="password" type="password" maxlength="128" autocomplete="current-password" value="'+escape(rememberedPassword)+'" required/><button type="button" class="developer-password-toggle" data-password-visibility-toggle="developer-login-password" data-show-label="'+escape(t.showPassword)+'" data-hide-label="'+escape(t.hidePassword)+'" aria-label="'+escape(t.showPassword)+'" aria-pressed="false">'+eyeIcon+'</button></div>'+
      '<label class="developer-remember"><input type="checkbox" name="remember" value="yes"'+rememberChecked+'/><span>'+t.remember+'</span></label>'+
      '<p class="developer-login-message" data-dev-login-message role="status">'+escape(developerMessage)+'</p>'+
      '<button type="submit" class="developer-login-submit" '+(developerBusy?"disabled":"")+'>'+(developerBusy?"…":t.submit)+'</button>'+
    '</form>'+
  '</section></div>';
}
