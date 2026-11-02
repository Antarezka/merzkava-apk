export const APP_LANGUAGES = [
  { code: "id", native: "Bahasa Indonesia" }, { code: "en", native: "English" },
  { code: "pt", native: "Português" }, { code: "fr", native: "Français" },
  { code: "ru", native: "Русский" }, { code: "ja", native: "日本語" },
  { code: "zh-CN", native: "简体中文" }, { code: "ko", native: "한국어" }
] as const;
export type AppLanguage = typeof APP_LANGUAGES[number]["code"];
const STORAGE_KEY = "merzkava-language";
const DEFAULT_LANGUAGE: AppLanguage = "en";
const labels: Record<string, Partial<Record<AppLanguage, string>>> = {
  Home:{id:"Beranda",pt:"Início",fr:"Accueil",ru:"Главная",ja:"ホーム","zh-CN":"主页",ko:"홈"},
  "Eternal Path":{id:"Jalur Abadi",pt:"Caminho Eterno",fr:"Voie Éternelle",ru:"Вечный Путь",ja:"永遠の道","zh-CN":"永恒之路",ko:"영원의 길"},
  Archive:{id:"Arsip",pt:"Arquivo",fr:"Archives",ru:"Архив",ja:"アーカイブ","zh-CN":"档案",ko:"기록 보관소"},
  Profile:{id:"Profil",pt:"Perfil",fr:"Profil",ru:"Профиль",ja:"プロフィール","zh-CN":"角色档案",ko:"프로필"},
  Convo:{id:"Percakapan",pt:"Conversa",fr:"Conversation",ru:"Диалог",ja:"会話","zh-CN":"对话",ko:"대화"},
  Inventory:{id:"Inventaris",pt:"Inventário",fr:"Inventaire",ru:"Инвентарь",ja:"所持品","zh-CN":"物品",ko:"소지품"},
  Journal:{id:"Jurnal",pt:"Diário",fr:"Journal",ru:"Журнал",ja:"日誌","zh-CN":"日志",ko:"일지"},
  Settings:{id:"Pengaturan",pt:"Configurações",fr:"Paramètres",ru:"Настройки",ja:"設定","zh-CN":"设置",ko:"설정"},
  Language:{id:"Bahasa",pt:"Idioma",fr:"Langue",ru:"Язык",ja:"言語","zh-CN":"语言",ko:"언어"},
  "Choose language":{id:"Pilih bahasa",pt:"Escolher idioma",fr:"Choisir la langue",ru:"Выберите язык",ja:"言語を選択","zh-CN":"选择语言",ko:"언어 선택"},
  "Hide toolbar":{id:"Sembunyikan toolbar",pt:"Ocultar barra",fr:"Masquer la barre",ru:"Скрыть панель",ja:"ツールバーを隠す","zh-CN":"隐藏工具栏",ko:"도구 모음 숨기기"},
  "Show toolbar":{id:"Tampilkan toolbar",pt:"Mostrar barra",fr:"Afficher la barre",ru:"Показать панель",ja:"ツールバーを表示","zh-CN":"显示工具栏",ko:"도구 모음 표시"},
  Appearance:{id:"Tampilan",pt:"Aparência",fr:"Apparence",ru:"Внешний вид",ja:"外観","zh-CN":"外观",ko:"화면"},
  Sound:{id:"Suara",pt:"Som",fr:"Son",ru:"Звук",ja:"サウンド","zh-CN":"声音",ko:"사운드"},
  "Floating Control":{id:"Kontrol Mengambang",pt:"Controle Flutuante",fr:"Contrôle flottant",ru:"Плавающее управление",ja:"フローティング操作","zh-CN":"悬浮控制",ko:"플로팅 컨트롤"}
};
export function getLanguage():AppLanguage {
  try { const saved=localStorage.getItem(STORAGE_KEY); return APP_LANGUAGES.some(item=>item.code===saved)?saved as AppLanguage:DEFAULT_LANGUAGE; }
  catch { return DEFAULT_LANGUAGE; }
}
export function setLanguage(value:string):AppLanguage {
  const next=APP_LANGUAGES.some(item=>item.code===value)?value as AppLanguage:DEFAULT_LANGUAGE;
  try { localStorage.setItem(STORAGE_KEY,next); } catch { /* Keep this session's selection. */ }
  document.documentElement.lang=next; return next;
}
export function translateLabel(value:string,language:AppLanguage):string { return labels[value]?.[language]??value; }
export function languagePanelMarkup(language:AppLanguage):string {
  const options=APP_LANGUAGES.map(item=>'<option value="'+item.code+'" '+(item.code===language?'selected':'')+'>'+item.native+'</option>').join("");
  return '<section class="language-preference"><label for="merzkava-language-select">✧ '+translateLabel("Language",language)+'</label><select id="merzkava-language-select" data-language-select aria-label="'+translateLabel("Choose language",language)+'">'+options+'</select></section>';
}
export function translateRenderedContent(root:ParentNode,language:AppLanguage):void {
  document.documentElement.lang=language;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes:Text[]=[]; while(walker.nextNode()) nodes.push(walker.currentNode as Text);
  for(const node of nodes){const raw=node.nodeValue??"";const trimmed=raw.trim();if(!trimmed)continue;const translated=translateLabel(trimmed,language);if(translated!==trimmed)node.nodeValue=raw.replace(trimmed,translated);}
  root.querySelectorAll<HTMLElement>("[aria-label],[title]").forEach(element=>{for(const attribute of ["aria-label","title"]){const value=element.getAttribute(attribute);if(value)element.setAttribute(attribute,translateLabel(value,language));}});
}
