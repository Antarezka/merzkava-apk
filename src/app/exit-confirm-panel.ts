import type { AppLanguage } from "../i18n";

const labels:Record<AppLanguage,{title:string;body:string;stay:string;exit:string}> = {
  id:{title:"Keluar dari Merzkava?",body:"Perjalananmu tetap tersimpan di perangkat ini. Apa kamu yakin ingin keluar dari aplikasi?",stay:"Tetap di sini",exit:"Ya, keluar"},
  en:{title:"Exit Merzkava?",body:"Your journey remains saved on this device. Are you sure you want to leave the app?",stay:"Stay here",exit:"Yes, exit"},
  pt:{title:"Sair do Merzkava?",body:"Sua jornada continua salva neste dispositivo. Tem certeza de que deseja sair do aplicativo?",stay:"Ficar",exit:"Sim, sair"},
  fr:{title:"Quitter Merzkava ?",body:"Votre voyage reste enregistré sur cet appareil. Voulez-vous vraiment quitter l'application ?",stay:"Rester",exit:"Oui, quitter"},
  ru:{title:"Выйти из Merzkava?",body:"Ваше путешествие останется сохранённым на этом устройстве. Вы уверены, что хотите закрыть приложение?",stay:"Остаться",exit:"Да, выйти"},
  ja:{title:"Merzkava を終了しますか？",body:"旅の記録はこの端末に保存されています。本当にアプリを終了しますか？",stay:"ここに留まる",exit:"終了する"},
  "zh-CN":{title:"退出 Merzkava？",body:"你的旅程仍保存在此设备上。确定要退出应用吗？",stay:"继续使用",exit:"确认退出"},
  ko:{title:"Merzkava를 종료할까요?",body:"여정은 이 기기에 저장되어 있습니다. 앱을 종료하시겠습니까?",stay:"계속 머무르기",exit:"종료"}
};
export function exitConfirmationPanelMarkup(language:AppLanguage):string {
  const t=labels[language]||labels.en;
  const esc=(v:string)=>v.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]||c));
  return '<div class="app-exit-confirm" data-app-exit-panel hidden><section class="app-exit-confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="app-exit-title" aria-describedby="app-exit-body">'+
    '<small>MERZKAVA · WORLD ARCHIVE</small><h2 id="app-exit-title">'+esc(t.title)+'</h2><p id="app-exit-body">'+esc(t.body)+'</p>'+
    '<div class="app-exit-confirm-actions"><button type="button" data-app-exit-no>'+esc(t.stay)+'</button><button type="button" data-app-exit-yes>'+esc(t.exit)+'</button></div></section></div>';
}
