import type { AppLanguage } from "../i18n";

const labels:Record<AppLanguage,{open:string;title:string;id:string;password:string;remember:string;submit:string;close:string;control:string;lock:string}> = {
  id:{open:"Akses pengembang",title:"Developer Access",id:"ID pengembang",password:"Kata sandi",remember:"Ingat saya di perangkat ini",submit:"Masuk",close:"Tutup",control:"Floating Control",lock:"Kunci"},
  en:{open:"Developer access",title:"Developer Access",id:"Developer ID",password:"Password",remember:"Remember me on this device",submit:"Sign in",close:"Close",control:"Floating Control",lock:"Lock"},
  pt:{open:"Acesso do desenvolvedor",title:"Acesso do desenvolvedor",id:"ID do desenvolvedor",password:"Senha",remember:"Lembrar neste dispositivo",submit:"Entrar",close:"Fechar",control:"Floating Control",lock:"Bloquear"},
  fr:{open:"Accès développeur",title:"Accès développeur",id:"Identifiant développeur",password:"Mot de passe",remember:"Se souvenir sur cet appareil",submit:"Connexion",close:"Fermer",control:"Floating Control",lock:"Verrouiller"},
  ru:{open:"Доступ разработчика",title:"Доступ разработчика",id:"ID разработчика",password:"Пароль",remember:"Запомнить на этом устройстве",submit:"Войти",close:"Закрыть",control:"Floating Control",lock:"Заблокировать"},
  ja:{open:"開発者アクセス",title:"開発者アクセス",id:"開発者ID",password:"パスワード",remember:"この端末でログイン状態を保持",submit:"ログイン",close:"閉じる",control:"Floating Control",lock:"ロック"},
  "zh-CN":{open:"开发者入口",title:"开发者入口",id:"开发者 ID",password:"密码",remember:"在此设备上记住我",submit:"登录",close:"关闭",control:"Floating Control",lock:"锁定"},
  ko:{open:"개발자 접근",title:"개발자 접근",id:"개발자 ID",password:"비밀번호",remember:"이 기기에서 기억하기",submit:"로그인",close:"닫기",control:"Floating Control",lock:"잠금"}
};
function escape(value:string):string {
  return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]||char));
}
export function developerHeaderControls(language:AppLanguage,authenticated:boolean):string {
  const t=labels[language]||labels.en;
  return authenticated
    ? '<button type="button" class="developer-tools-open" data-dev-open-control>'+t.control+'</button><button type="button" class="developer-tools-lock" data-dev-logout>'+t.lock+'</button>'
    : '<button type="button" class="developer-access-key" data-dev-login-open aria-label="'+t.open+'" title="'+t.open+'">⌑</button>';
}
export function developerLoginPanel(language:AppLanguage,message:string,busy:boolean,required:boolean=false):string {
  const t=labels[language]||labels.en;
  const closeButton=required?"":'<button type="button" class="developer-login-close" data-dev-login-close aria-label="'+t.close+'">×</button>';
  return '<div class="developer-login-backdrop" data-dev-login-panel '+(required?"":"hidden")+'><section class="developer-login-card" role="dialog" aria-modal="true" aria-labelledby="developer-login-title">'+
    closeButton+'<small>MERZKAVA · RESTRICTED ACCESS</small><h2 id="developer-login-title">'+t.title+'</h2>'+
    '<form id="developer-login-form"><label for="developer-login-id">'+t.id+'</label><input id="developer-login-id" name="identifier" type="text" maxlength="80" autocomplete="username" required/>'+
    '<label for="developer-login-password">'+t.password+'</label><input id="developer-login-password" name="password" type="password" maxlength="128" autocomplete="current-password" required/>'+
    '<label class="developer-remember"><input type="checkbox" name="remember" value="yes"/><span>'+t.remember+'</span></label>'+
    '<p class="developer-login-message" data-dev-login-message role="status">'+escape(message)+'</p><button type="submit" class="developer-login-submit" '+(busy?"disabled":"")+'>'+(busy?"…":t.submit)+'</button></form></section></div>';
}
