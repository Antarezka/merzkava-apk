import { worldAtlasAccessBufferMarkup } from "../offline-game/world-atlas-login";
import type { AppLanguage } from "../i18n";

type AccessMode = "player" | "developer";
type RememberedCredentials = { identifier: string; password: string } | null;

const labels:Record<AppLanguage,{
  open:string;title:string;id:string;password:string;remember:string;submit:string;close:string;control:string;lock:string;
  playerMode:string;developerMode:string;playerName:string;playerContinue:string;playerHint:string;playerOffline:string;playerLogout:string;
  showPassword:string;hidePassword:string;accountHeading:string;developerSession:string;playerSession:string;accountDescription:string;
  resetPlayer:string;resetPlayerHint:string;resetPlayerPlaceholder:string;resetPlayerAction:string;resetPlayerProof:string;resetPlayerConfirm:string;resetRequestCopy:string;
}> = {
  id:{
    open:"Akses pengembang",title:"Akses Akun",id:"ID pengembang",password:"Kata sandi",remember:"Ingat akun dan kata sandi di perangkat ini",submit:"Masuk",close:"Tutup",control:"Floating Control",lock:"Kunci",playerMode:"Pemain",developerMode:"Developer",playerName:"Nama karakter",playerContinue:"Lanjutkan",playerHint:"Gunakan nama yang sama persis seperti di registry resmi players.md.",playerOffline:"Login Player membutuhkan koneksi internet aktif untuk memeriksa registry resmi Universe.",playerLogout:"Keluar",
    showPassword:"Tampilkan kata sandi",hidePassword:"Sembunyikan kata sandi",accountHeading:"AKUN & AKSES",developerSession:"SESI DEVELOPER",playerSession:"SESI PEMAIN",accountDescription:"Kelola sesi dan akses Floating Control dari sini.",resetPlayer:"Terbitkan Master Reset World Atlas",resetPlayerHint:"Pilih akun yang akan direset. Setelah kepemilikan diverifikasi, buat permintaan untuk AI agar kode konfirmasi khusus akun ditanam pada update aplikasi berikutnya.",resetPlayerPlaceholder:"Pilih akun pemain",resetPlayerAction:"Buat kode permintaan reset",resetPlayerProof:"Kode permintaan ini belum dapat dipakai pemain. Salin ke AI untuk membuat kode konfirmasi unik dan memasukkan hash-nya ke update berikutnya. Berikan kode pemain hanya setelah build pembaruan tersedia. Developer tidak melihat atau menentukan password baru.",resetPlayerConfirm:"Saya sudah memverifikasi kepemilikan akun melalui kanal resmi.",resetRequestCopy:"Salin permintaan untuk AI"
  },
  en:{
    open:"Developer access",title:"Account Access",id:"Developer ID",password:"Password",remember:"Remember account and password on this device",submit:"Sign in",close:"Close",control:"Floating Control",lock:"Lock",playerMode:"Player",developerMode:"Developer",playerName:"Registered character name",playerContinue:"Continue",playerHint:"Enter the exact name shown in the official players.md registry.",playerOffline:"Player sign-in requires an active internet connection to verify the official Universe registry.",playerLogout:"Sign out",
    showPassword:"Show password",hidePassword:"Hide password",accountHeading:"ACCOUNT & ACCESS",developerSession:"DEVELOPER SESSION",playerSession:"PLAYER SESSION",accountDescription:"Manage your session and Floating Control access here.",resetPlayer:"Issue a World Atlas Master Reset",resetPlayerHint:"Select the account to reset. After ownership is verified, create an AI request so an account-specific confirmation code can be embedded in the next app update.",resetPlayerPlaceholder:"Select a player account",resetPlayerAction:"Generate reset request code",resetPlayerProof:"This request code cannot be used by the player. Copy it to the AI to create a unique confirmation code and add its hash to the next update. Give the player code only after the updated build is available. The Developer never sees or chooses the new password.",resetPlayerConfirm:"I have verified account ownership through an official channel.",resetRequestCopy:"Copy request for AI"
  },
  pt:{
    open:"Acesso do desenvolvedor",title:"Acesso à conta",id:"ID do desenvolvedor",password:"Senha",remember:"Lembrar conta e senha neste dispositivo",submit:"Entrar",close:"Fechar",control:"Floating Control",lock:"Bloquear",playerMode:"Jogador",developerMode:"Developer",playerName:"Nome do personagem registrado",playerContinue:"Continuar",playerHint:"Digite o nome exatamente como aparece no registro oficial players.md.",playerOffline:"O acesso do jogador exige uma conexão ativa à internet para verificar o registro oficial Universe.",playerLogout:"Sair",
    showPassword:"Mostrar senha",hidePassword:"Ocultar senha",accountHeading:"CONTA E ACESSO",developerSession:"SESSÃO DE DESENVOLVEDOR",playerSession:"SESSÃO DO JOGADOR",accountDescription:"Gerencie sua sessão e o Floating Control aqui.",resetPlayer:"Emitir Master Reset do World Atlas",resetPlayerHint:"Selecione a conta. Após verificar a propriedade, gere uma solicitação para a IA criar um código de confirmação exclusivo na próxima atualização.",resetPlayerPlaceholder:"Selecione uma conta de jogador",resetPlayerAction:"Gerar código de solicitação",resetPlayerProof:"Este código de solicitação não pode ser usado pelo jogador. Copie-o para a IA criar o código de confirmação e incluir seu hash na próxima atualização. Entregue o código ao jogador somente depois que a nova versão estiver disponível. O Developer não vê nem define a nova senha.",resetPlayerConfirm:"Confirmei a propriedade da conta por um canal oficial.",resetRequestCopy:"Copiar solicitação para IA"
  },
  fr:{
    open:"Accès développeur",title:"Accès au compte",id:"Identifiant développeur",password:"Mot de passe",remember:"Mémoriser le compte et le mot de passe sur cet appareil",submit:"Connexion",close:"Fermer",control:"Floating Control",lock:"Verrouiller",playerMode:"Joueur",developerMode:"Developer",playerName:"Nom du personnage enregistré",playerContinue:"Continuer",playerHint:"Saisissez le nom exactement comme dans le registre officiel players.md.",playerOffline:"La connexion Joueur nécessite Internet pour vérifier le registre officiel Universe.",playerLogout:"Déconnexion",
    showPassword:"Afficher le mot de passe",hidePassword:"Masquer le mot de passe",accountHeading:"COMPTE ET ACCÈS",developerSession:"SESSION DÉVELOPPEUR",playerSession:"SESSION JOUEUR",accountDescription:"Gérez votre session et l'accès Floating Control ici.",resetPlayer:"Émettre un Master Reset World Atlas",resetPlayerHint:"Sélectionnez le compte. Après vérification de sa propriété, créez une demande pour que l’IA prépare un code de confirmation dans la prochaine mise à jour.",resetPlayerPlaceholder:"Sélectionner un compte joueur",resetPlayerAction:"Générer une demande de réinitialisation",resetPlayerProof:"Cette demande ne peut pas être utilisée par le joueur. Copiez-la dans l’IA pour créer un code unique et intégrer son empreinte à la prochaine mise à jour. Ne donnez le code au joueur qu’après disponibilité de la nouvelle version. Le Developer ne voit ni ne choisit le nouveau mot de passe.",resetPlayerConfirm:"J’ai vérifié la propriété du compte via un canal officiel.",resetRequestCopy:"Copier la demande pour l’IA"
  },
  ru:{
    open:"Доступ разработчика",title:"Доступ к аккаунту",id:"ID разработчика",password:"Пароль",remember:"Запомнить аккаунт и пароль на этом устройстве",submit:"Войти",close:"Закрыть",control:"Floating Control",lock:"Заблокировать",playerMode:"Игрок",developerMode:"Developer",playerName:"Имя зарегистрированного персонажа",playerContinue:"Продолжить",playerHint:"Введите имя в точном соответствии с официальным реестром players.md.",playerOffline:"Для входа игрока требуется интернет для проверки официального реестра Universe.",playerLogout:"Выйти",
    showPassword:"Показать пароль",hidePassword:"Скрыть пароль",accountHeading:"АККАУНТ И ДОСТУП",developerSession:"СЕССИЯ РАЗРАБОТЧИКА",playerSession:"СЕССИЯ ИГРОКА",accountDescription:"Управляйте сессией и доступом Floating Control здесь.",resetPlayer:"Выдать Master Reset для World Atlas",resetPlayerHint:"Выберите аккаунт. После проверки владения создайте запрос для ИИ, чтобы уникальный код подтверждения был добавлен в следующее обновление.",resetPlayerPlaceholder:"Выберите аккаунт игрока",resetPlayerAction:"Создать код запроса",resetPlayerProof:"Этот код запроса нельзя использовать игроку. Передайте его ИИ, чтобы создать уникальный код подтверждения и добавить его хеш в следующее обновление. Передавайте код игроку только после выхода новой сборки. Developer не видит и не задаёт новый пароль.",resetPlayerConfirm:"Я подтвердил право владения аккаунтом через официальный канал.",resetRequestCopy:"Скопировать запрос для ИИ"
  },
  ja:{
    open:"開発者アクセス",title:"アカウントアクセス",id:"開発者ID",password:"パスワード",remember:"この端末にアカウントとパスワードを保存",submit:"ログイン",close:"閉じる",control:"Floating Control",lock:"ロック",playerMode:"プレイヤー",developerMode:"Developer",playerName:"登録キャラクター名",playerContinue:"続行",playerHint:"公式 players.md レジストリと完全に一致する名前を入力してください。",playerOffline:"プレイヤーとしてログインするには、公式 Universe レジストリの確認にインターネット接続が必要です。",playerLogout:"ログアウト",
    showPassword:"パスワードを表示",hidePassword:"パスワードを非表示",accountHeading:"アカウントとアクセス",developerSession:"開発者セッション",playerSession:"プレイヤーセッション",accountDescription:"ここでセッションと Floating Control へのアクセスを管理します。",resetPlayer:"World Atlas Master Reset を発行",resetPlayerHint:"リセットするアカウントを選択します。所有権を確認した後、次回アプリ更新に専用確認コードを組み込むための AI リクエストを作成します。",resetPlayerPlaceholder:"プレイヤーアカウントを選択",resetPlayerAction:"リセット要求コードを生成",resetPlayerProof:"この要求コードはプレイヤーには使えません。AI にコピーして固有の確認コードを作成し、そのハッシュを次回更新に追加します。新しいビルドの公開後にのみ、プレイヤーへ確認コードを渡してください。Developer は新しいパスワードを見たり設定したりしません。",resetPlayerConfirm:"公式チャネルを通じてアカウント所有権を確認しました。",resetRequestCopy:"AI 用リクエストをコピー"
  },
  "zh-CN":{
    open:"开发者入口",title:"账户入口",id:"开发者 ID",password:"密码",remember:"在此设备上记住账户和密码",submit:"登录",close:"关闭",control:"Floating Control",lock:"锁定",playerMode:"玩家",developerMode:"Developer",playerName:"已登记角色名称",playerContinue:"继续",playerHint:"请输入与官方 players.md 注册表完全一致的名称。",playerOffline:"玩家登录需要有效的互联网连接，以验证官方 Universe 注册表。",playerLogout:"退出",
    showPassword:"显示密码",hidePassword:"隐藏密码",accountHeading:"账户与访问",developerSession:"开发者会话",playerSession:"玩家会话",accountDescription:"在此管理会话和 Floating Control 访问权限。",resetPlayer:"签发 World Atlas Master Reset",resetPlayerHint:"选择要重置的账号。验证所有权后，生成 AI 请求，将该账号专属的确认码加入下一次应用更新。",resetPlayerPlaceholder:"选择玩家账号",resetPlayerAction:"生成重置请求码",resetPlayerProof:"玩家不能使用此请求码。将其复制给 AI 以生成唯一确认码，并把确认码哈希加入下一次更新。新版本可用后再把玩家码交给玩家。Developer 不会看到或设置新密码。",resetPlayerConfirm:"我已通过官方渠道验证账号归属。",resetRequestCopy:"复制 AI 请求"
  },
  ko:{
    open:"개발자 접근",title:"계정 접근",id:"개발자 ID",password:"비밀번호",remember:"이 기기에 계정과 비밀번호 기억",submit:"로그인",close:"닫기",control:"Floating Control",lock:"잠금",playerMode:"플레이어",developerMode:"Developer",playerName:"등록된 캐릭터 이름",playerContinue:"계속",playerHint:"공식 players.md 레지스트리에 있는 이름과 정확히 일치하게 입력하세요.",playerOffline:"플레이어 로그인을 위해 공식 Universe 레지스트리를 확인할 인터넷 연결이 필요합니다.",playerLogout:"로그아웃",
    showPassword:"비밀번호 표시",hidePassword:"비밀번호 숨기기",accountHeading:"계정 및 접근",developerSession:"개발자 세션",playerSession:"플레이어 세션",accountDescription:"여기에서 세션과 Floating Control 접근을 관리하세요.",resetPlayer:"World Atlas Master Reset 발급",resetPlayerHint:"재설정할 계정을 선택하세요. 소유권 확인 후 다음 앱 업데이트에 계정 전용 확인 코드를 포함하도록 AI 요청을 만드세요.",resetPlayerPlaceholder:"플레이어 계정 선택",resetPlayerAction:"재설정 요청 코드 생성",resetPlayerProof:"이 요청 코드는 플레이어가 사용할 수 없습니다. AI에 복사해 고유 확인 코드를 만들고 그 해시를 다음 업데이트에 추가하세요. 업데이트된 빌드가 제공된 뒤에만 플레이어 코드 전달하세요. Developer는 새 비밀번호를 보거나 지정하지 않습니다.",resetPlayerConfirm:"공식 채널을 통해 계정 소유권을 확인했습니다.",resetRequestCopy:"AI 요청 복사"
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

export function accountSettingsPanel(language:AppLanguage,developerAuthenticated:boolean,playerAuthenticated:boolean,playerNames:string[]=[]):string {
  const t=labels[language]||labels.en;
  if(!developerAuthenticated&&!playerAuthenticated)return "";
  const developer=developerAuthenticated;
  const actions=developer
    ? '<button type="button" class="account-access-action" data-dev-open-control><span class="account-access-icon icon-floating" aria-hidden="true"><i></i></span><span>'+t.control+'</span><b>↗</b></button><button type="button" class="account-access-action is-lock" data-dev-logout><span class="account-access-icon icon-lock" aria-hidden="true"><i></i></span><span>'+t.lock+'</span><b>×</b></button>'
    : '<button type="button" class="account-access-action is-lock" data-player-logout><span class="account-access-icon icon-lock" aria-hidden="true"><i></i></span><span>'+t.playerLogout+'</span><b>×</b></button>';
  const playerOptions=playerNames.map(name=>'<option value="'+escape(name)+'">'+escape(name)+'</option>').join("");
  const resetTool=developer
    ? '<section class="developer-atlas-reset" data-developer-atlas-reset><div class="section-heading"><span>'+t.resetPlayer+'</span></div><p class="muted">'+t.resetPlayerHint+'</p><label for="developer-atlas-reset-player">'+t.resetPlayerPlaceholder+'</label><select id="developer-atlas-reset-player" data-atlas-reset-player-select><option value="">—</option>'+playerOptions+'</select><p class="muted developer-atlas-reset-proof">'+t.resetPlayerProof+'</p><label class="developer-atlas-reset-confirm"><input type="checkbox" data-atlas-developer-reset-proof/><span>'+t.resetPlayerConfirm+'</span></label><p class="canon-status" data-developer-atlas-reset-message role="status"></p><button type="button" class="action-button" data-atlas-developer-reset-submit>'+t.resetPlayerAction+'</button><textarea id="developer-atlas-reset-request" class="developer-atlas-reset-request" rows="8" readonly hidden aria-label="Reset request code"></textarea><button type="button" class="action-button" data-atlas-reset-copy-request hidden>'+t.resetRequestCopy+'</button>'+worldAtlasAccessBufferMarkup(language,"developer")+'</section>'
    : "";
  return '<section class="section-block account-access-settings"><div class="section-heading"><span>'+t.accountHeading+'</span><small>'+(developer?t.developerSession:t.playerSession)+'</small></div><p class="muted">'+t.accountDescription+'</p><div class="account-access-actions">'+actions+'</div>'+resetTool+'</section>';
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
    '<form id="player-login-form" data-offline-label="'+escape(t.playerOffline)+'"'+playerHidden+'>'+
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
    worldAtlasAccessBufferMarkup(language,mode==="developer"?"developer":"player")+
  '</section></div>';
}
