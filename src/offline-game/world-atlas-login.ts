import type { AppLanguage } from "../i18n";

const copy:Record<AppLanguage,{eyebrow:string;title:string;intro:string;player:string;password:string;confirm:string;remember:string;signIn:string;signUp:string;back:string;empty:string;foot:string}> = {
  id:{eyebrow:"WORLD ARCHIVE · AKSES PEMAIN",title:"Masuk ke World Atlas",intro:"Gunakan karakter terdaftar dari World Archive dan perjalanan lokal Eternal Path.",player:"Karakter terdaftar",password:"Kata sandi lokal",confirm:"Ulangi kata sandi",remember:"Ingat saya di perangkat ini",signIn:"Masuk",signUp:"Daftar baru",back:"Kembali ke Eternal Path",empty:"Belum ada karakter players.md yang cocok dengan save Eternal Path lokal di perangkat ini.",foot:"Kata sandi disimpan secara lokal dalam bentuk hash bersalt."},
  en:{eyebrow:"WORLD ARCHIVE · PLAYER ACCESS",title:"Enter World Atlas",intro:"Use a registered World Archive character with a local Eternal Path journey.",player:"Registered character",password:"Local password",confirm:"Confirm password",remember:"Remember me on this device",signIn:"Sign in",signUp:"Sign up",back:"Back to Eternal Path",empty:"No players.md character matches a local Eternal Path save on this device.",foot:"The password is stored locally as a salted hash."},
  pt:{eyebrow:"WORLD ARCHIVE · ACESSO DO JOGADOR",title:"Entrar no World Atlas",intro:"Use um personagem registrado no World Archive com uma jornada local do Eternal Path.",player:"Personagem registrado",password:"Senha local",confirm:"Confirmar senha",remember:"Lembrar neste dispositivo",signIn:"Entrar",signUp:"Criar conta",back:"Voltar ao Eternal Path",empty:"Nenhum personagem de players.md corresponde a um save local do Eternal Path.",foot:"A senha é armazenada localmente como hash com salt."},
  fr:{eyebrow:"WORLD ARCHIVE · ACCÈS JOUEUR",title:"Entrer dans World Atlas",intro:"Utilisez un personnage inscrit dans World Archive avec une sauvegarde locale d'Eternal Path.",player:"Personnage inscrit",password:"Mot de passe local",confirm:"Confirmer le mot de passe",remember:"Se souvenir sur cet appareil",signIn:"Connexion",signUp:"Créer un compte",back:"Retour à Eternal Path",empty:"Aucun personnage de players.md ne correspond à une sauvegarde locale d'Eternal Path.",foot:"Le mot de passe est stocké localement sous forme de hachage salé."},
  ru:{eyebrow:"WORLD ARCHIVE · ДОСТУП ИГРОКА",title:"Вход в World Atlas",intro:"Используйте персонажа из World Archive с локальным сохранением Eternal Path.",player:"Зарегистрированный персонаж",password:"Локальный пароль",confirm:"Повторите пароль",remember:"Запомнить на этом устройстве",signIn:"Войти",signUp:"Создать аккаунт",back:"Назад в Eternal Path",empty:"Персонаж из players.md не найден среди локальных сохранений Eternal Path.",foot:"Пароль хранится локально в виде хеша с солью."},
  ja:{eyebrow:"WORLD ARCHIVE · プレイヤーアクセス",title:"World Atlas に入る",intro:"World Archive に登録されたキャラクターと、端末内の Eternal Path セーブを使用します。",player:"登録キャラクター",password:"ローカルパスワード",confirm:"パスワードを再入力",remember:"この端末で記憶する",signIn:"ログイン",signUp:"新規登録",back:"Eternal Path に戻る",empty:"players.md のキャラクターに一致する Eternal Path のローカルセーブがありません。",foot:"パスワードはソルト付きハッシュとして端末内に保存されます。"},
  "zh-CN":{eyebrow:"WORLD ARCHIVE · 玩家访问",title:"进入 World Atlas",intro:"使用 World Archive 中已登记的角色，以及本机 Eternal Path 存档。",player:"已登记角色",password:"本地密码",confirm:"确认密码",remember:"在此设备上记住我",signIn:"登录",signUp:"注册新账号",back:"返回 Eternal Path",empty:"此设备上的 Eternal Path 本地存档中没有与 players.md 匹配的角色。",foot:"密码以带盐哈希形式保存在本地。"},
  ko:{eyebrow:"WORLD ARCHIVE · 플레이어 접속",title:"World Atlas 입장",intro:"World Archive에 등록된 캐릭터와 기기의 Eternal Path 로컬 저장 데이터를 사용하세요.",player:"등록된 캐릭터",password:"로컬 비밀번호",confirm:"비밀번호 확인",remember:"이 기기에서 기억하기",signIn:"로그인",signUp:"새 계정 등록",back:"Eternal Path로 돌아가기",empty:"이 기기의 Eternal Path 저장 데이터에서 players.md와 일치하는 캐릭터를 찾을 수 없습니다.",foot:"비밀번호는 솔트 해시로 로컬에 저장됩니다."}
};
function esc(value:string):string {
  return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]||char));
}
export function worldAtlasLoginPanelMarkup(language:AppLanguage):string {
  const t=copy[language]||copy.en;
  return '<div class="world-atlas-login-layer" data-world-atlas-gate hidden data-empty-label="'+esc(t.empty)+'" data-select-label="'+esc(t.player)+'" data-loading-label="'+esc(t.intro)+'" data-login-prompt="Enter the local password for this character." data-signup-prompt="This registered character has no local password yet. Create one to continue." data-success-label="Access granted.">'+
    '<section class="world-atlas-login-card" role="dialog" aria-modal="true" aria-labelledby="world-atlas-login-title">'+
    '<button type="button" class="world-atlas-login-close" data-world-atlas-gate-back aria-label="'+esc(t.back)+'">×</button>'+
    '<small class="world-atlas-login-eyebrow">'+esc(t.eyebrow)+'</small><h2 id="world-atlas-login-title">'+esc(t.title)+'</h2><p class="world-atlas-login-intro">'+esc(t.intro)+'</p>'+
    '<form id="world-atlas-login-form">'+
    '<label for="world-atlas-player">'+esc(t.player)+'</label><select id="world-atlas-player" name="player" data-world-atlas-player required><option value="">—</option></select>'+
    '<label for="world-atlas-password">'+esc(t.password)+'</label><input id="world-atlas-password" name="password" type="password" minlength="8" maxlength="128" autocomplete="current-password" required/>'+
    '<label class="world-atlas-confirm-row" data-world-atlas-confirm-row for="world-atlas-password-confirm" hidden>'+esc(t.confirm)+'<input id="world-atlas-password-confirm" name="confirm" type="password" minlength="8" maxlength="128" autocomplete="new-password"/></label>'+
    '<label class="world-atlas-remember"><input type="checkbox" name="remember" value="yes"/><span>'+esc(t.remember)+'</span></label>'+
    '<p class="world-atlas-login-message" data-world-atlas-message role="status">'+esc(t.empty)+'</p>'+
    '<button type="submit" class="world-atlas-login-submit" data-world-atlas-submit data-login-label="'+esc(t.signIn)+'" data-signup-label="'+esc(t.signUp)+'" disabled>'+esc(t.signIn)+'</button></form>'+
    '<small class="world-atlas-login-foot">'+esc(t.foot)+'</small>'+
    '</section></div>';
}
