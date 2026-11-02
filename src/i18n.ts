import { APP_NAME, APP_VERSION } from "./app/app-meta";

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

Object.assign(labels, {
  APPLICATION:{id:"APLIKASI",pt:"APLICAÇÃO",fr:"APPLICATION",ru:"ПРИЛОЖЕНИЕ",ja:"アプリ","zh-CN":"应用程序",ko:"애플리케이션"},
  "DISPLAY MODE":{id:"MODE TAMPILAN",pt:"MODO DE EXIBIÇÃO",fr:"MODE D’AFFICHAGE",ru:"РЕЖИМ ОТОБРАЖЕНИЯ",ja:"表示モード","zh-CN":"显示模式",ko:"화면 모드"},
  "Parchment Light":{id:"Terang Perkamen",pt:"Pergaminho Claro",fr:"Parchemin clair",ru:"Светлый пергамент",ja:"羊皮紙ライト","zh-CN":"羊皮纸浅色",ko:"양피지 라이트"},
  "Academy Obsidian":{id:"Obsidian Akademi",pt:"Obsidiana da Academia",fr:"Obsidienne de l’Académie",ru:"Обсидиан Академии",ja:"アカデミー・オブシディアン","zh-CN":"学院黑曜石",ko:"아카데미 옵시디언"},
  "APP AUDIO":{id:"AUDIO APLIKASI",pt:"ÁUDIO DO APP",fr:"AUDIO DE L’APPLICATION",ru:"ЗВУК ПРИЛОЖЕНИЯ",ja:"アプリ音声","zh-CN":"应用音频",ko:"앱 오디오"},
  "Sound effects & voice":{id:"Efek suara & suara",pt:"Efeitos sonoros e voz",fr:"Effets sonores et voix",ru:"Звуковые эффекты и голос",ja:"効果音・音声","zh-CN":"音效与语音",ko:"효과음 및 음성"},
  "Sound On":{id:"Suara Aktif",pt:"Som Ativado",fr:"Son activé",ru:"Звук включён",ja:"サウンドオン","zh-CN":"声音开启",ko:"사운드 켜짐"},
  "ANDROID OVERLAY":{id:"OVERLAY ANDROID",pt:"SOBREPOSIÇÃO ANDROID",fr:"SUPERPOSITION ANDROID",ru:"ПОВЕРХ ОКОН ANDROID",ja:"Androidオーバーレイ","zh-CN":"Android 悬浮层",ko:"안드로이드 오버레이"},
  "Start Floating Mode":{id:"Mulai Mode Mengambang",pt:"Iniciar Modo Flutuante",fr:"Démarrer le mode flottant",ru:"Запустить плавающий режим",ja:"フローティングモード開始","zh-CN":"启动悬浮模式",ko:"플로팅 모드 시작"},
  "Save location":{id:"Lokasi penyimpanan",pt:"Local de salvamento",fr:"Emplacement des sauvegardes",ru:"Место сохранения",ja:"保存場所","zh-CN":"存储位置",ko:"저장 위치"},
  "Local device database":{id:"Database perangkat lokal",pt:"Banco de dados local",fr:"Base de données locale",ru:"Локальная база данных",ja:"端末内データベース","zh-CN":"本地设备数据库",ko:"로컬 기기 데이터베이스"},
  "AI Game Master":{id:"Game Master AI",pt:"Mestre de Jogo IA",fr:"Maître de jeu IA",ru:"ИИ-мастер игры",ja:"AIゲームマスター","zh-CN":"AI 游戏主持",ko:"AI 게임 마스터"},
  "Canon source":{id:"Sumber Kanon",pt:"Fonte do cânone",fr:"Source canonique",ru:"Источник канона",ja:"正典ソース","zh-CN":"正典来源",ko:"정본 출처"},
  "READY":{id:"SIAP",pt:"PRONTO",fr:"PRÊT",ru:"ГОТОВО",ja:"準備完了","zh-CN":"就绪",ko:"준비 완료"},
  "NOT READY":{id:"BELUM SIAP",pt:"NÃO PRONTO",fr:"NON PRÊT",ru:"НЕ ГОТОВО",ja:"未準備","zh-CN":"未就绪",ko:"준비 안 됨"},
  "INITIAL SETUP":{id:"PENYIAPAN AWAL",pt:"CONFIGURAÇÃO INICIAL",fr:"CONFIGURATION INITIALE",ru:"ПЕРВОНАЧАЛЬНАЯ НАСТРОЙКА",ja:"初期設定","zh-CN":"初始设置",ko:"초기 설정"},
  "QUICK ACTIONS":{id:"AKSI CEPAT",pt:"AÇÕES RÁPIDAS",fr:"ACTIONS RAPIDES",ru:"БЫСТРЫЕ ДЕЙСТВИЯ",ja:"クイック操作","zh-CN":"快捷操作",ko:"빠른 작업"},
  "Display over the app":{id:"Tampilkan di atas aplikasi",pt:"Exibir sobre outros apps",fr:"Afficher par-dessus les applications",ru:"Поверх других приложений",ja:"他のアプリの上に表示","zh-CN":"显示在其他应用上层",ko:"다른 앱 위에 표시"},
  "Battery exemption":{id:"Pengecualian baterai",pt:"Exceção de bateria",fr:"Exemption de batterie",ru:"Исключение из оптимизации батареи",ja:"バッテリー最適化の除外","zh-CN":"电池优化豁免",ko:"배터리 최적화 제외"},
  "Foreground service":{id:"Layanan latar depan",pt:"Serviço em primeiro plano",fr:"Service au premier plan",ru:"Фоновая служба",ja:"フォアグラウンドサービス","zh-CN":"前台服务",ko:"포그라운드 서비스"},
  "Allowed display over the app":{id:"Izin tampil di atas aplikasi",pt:"Permitir exibição sobre apps",fr:"Autoriser l’affichage par-dessus",ru:"Разрешить отображение поверх окон",ja:"他のアプリ上への表示を許可","zh-CN":"允许显示在其他应用上层",ko:"다른 앱 위에 표시 허용"},
  "Allowed notifications":{id:"Izin notifikasi",pt:"Permitir notificações",fr:"Autoriser les notifications",ru:"Разрешить уведомления",ja:"通知を許可","zh-CN":"允许通知",ko:"알림 허용"},
  "Allow background activity / battery":{id:"Izinkan aktivitas latar belakang / baterai",pt:"Permitir atividade em segundo plano / bateria",fr:"Autoriser l’activité en arrière-plan / batterie",ru:"Разрешить фоновую работу / батарею",ja:"バックグラウンド動作・電池を許可","zh-CN":"允许后台活动 / 电池运行",ko:"백그라운드 활동 / 배터리 허용"},
  "Start bubble mode":{id:"Mulai mode bubble",pt:"Iniciar modo bolha",fr:"Activer la bulle",ru:"Запустить режим пузыря",ja:"バブルモード開始","zh-CN":"启动气泡模式",ko:"버블 모드 시작"},
  "Open game / continue playing":{id:"Buka game / lanjut bermain",pt:"Abrir jogo / continuar",fr:"Ouvrir le jeu / continuer",ru:"Открыть игру / продолжить",ja:"ゲームを開く・続ける","zh-CN":"打开游戏 / 继续",ko:"게임 열기 / 계속하기"},
  "Open floating mini window":{id:"Buka jendela mini mengambang",pt:"Abrir mini janela flutuante",fr:"Ouvrir la mini-fenêtre flottante",ru:"Открыть плавающее мини-окно",ja:"フローティングミニウィンドウを開く","zh-CN":"打开悬浮迷你窗口",ko:"플로팅 미니 창 열기"},
  "Stop service and close window":{id:"Hentikan layanan dan tutup jendela",pt:"Parar serviço e fechar janela",fr:"Arrêter le service et fermer la fenêtre",ru:"Остановить службу и закрыть окно",ja:"サービス停止・ウィンドウを閉じる","zh-CN":"停止服务并关闭窗口",ko:"서비스 중지 및 창 닫기"},
  "Donate stuff":{id:"Donasi",pt:"Doar",fr:"Faire un don",ru:"Поддержать",ja:"寄付","zh-CN":"捐赠",ko:"후원"},
  "NO ACTIVE JOURNEY":{id:"BELUM ADA PERJALANAN AKTIF",pt:"NENHUMA JORNADA ATIVA",fr:"AUCUN VOYAGE ACTIF",ru:"НЕТ АКТИВНОГО ПУТЕШЕСТВИЯ",ja:"進行中の旅はありません","zh-CN":"没有进行中的旅程",ko:"진행 중인 여정 없음"},
  "NEW JOURNEY":{id:"PERJALANAN BARU",pt:"NOVA JORNADA",fr:"NOUVEAU VOYAGE",ru:"НОВОЕ ПУТЕШЕСТВИЕ",ja:"新しい旅","zh-CN":"新旅程",ko:"새 여정"},
  "Character name":{id:"Nama karakter",pt:"Nome do personagem",fr:"Nom du personnage",ru:"Имя персонажа",ja:"キャラクター名","zh-CN":"角色名称",ko:"캐릭터 이름"},
  "Starting region":{id:"Wilayah awal",pt:"Região inicial",fr:"Région de départ",ru:"Стартовый регион",ja:"開始地域","zh-CN":"起始地区",ko:"시작 지역"},
  "Begin new journey":{id:"Mulai perjalanan baru",pt:"Começar nova jornada",fr:"Commencer un nouveau voyage",ru:"Начать новое путешествие",ja:"新しい旅を始める","zh-CN":"开始新旅程",ko:"새 여정 시작"},
  "IMPORT JOURNEY BACKUP":{id:"IMPOR CADANGAN PERJALANAN",pt:"IMPORTAR BACKUP DA JORNADA",fr:"IMPORTER UNE SAUVEGARDE",ru:"ИМПОРТ РЕЗЕРВНОЙ КОПИИ",ja:"旅のバックアップをインポート","zh-CN":"导入旅程备份",ko:"여정 백업 가져오기"},
  "YOUR ADVENTURER":{id:"PETUALANGMU",pt:"SEU AVENTUREIRO",fr:"VOTRE AVENTURIER",ru:"ВАШ ПУТЕШЕСТВЕННИК",ja:"あなたの冒険者","zh-CN":"你的冒险者",ko:"당신의 모험가"},
  "THE MOMENT":{id:"MOMEN INI",pt:"O MOMENTO",fr:"L’INSTANT",ru:"ТЕКУЩИЙ МОМЕНТ",ja:"この瞬間","zh-CN":"此刻",ko:"이 순간"},
  "SETTING / ATMOSPHERE":{id:"LATAR / SUASANA",pt:"CENÁRIO / ATMOSFERA",fr:"DÉCOR / ATMOSPHÈRE",ru:"ОБСТАНОВКА / АТМОСФЕРА",ja:"舞台・雰囲気","zh-CN":"场景 / 氛围",ko:"배경 / 분위기"},
  "SCENE ACTION":{id:"AKSI ADEGAN",pt:"AÇÃO DA CENA",fr:"ACTION DE LA SCÈNE",ru:"ДЕЙСТВИЕ СЦЕНЫ",ja:"シーンの動き","zh-CN":"场景行动",ko:"장면 행동"},
  AFTERMATH:{id:"AKIBAT",pt:"CONSEQUÊNCIAS",fr:"CONSÉQUENCES",ru:"ПОСЛЕДСТВИЯ",ja:"その後","zh-CN":"后续",ko:"여파"},
  "Journey name":{id:"Nama perjalanan",pt:"Nome da jornada",fr:"Nom du voyage",ru:"Название путешествия",ja:"旅の名前","zh-CN":"旅程名称",ko:"여정 이름"},
  "Save name":{id:"Simpan nama",pt:"Salvar nome",fr:"Enregistrer le nom",ru:"Сохранить имя",ja:"名前を保存","zh-CN":"保存名称",ko:"이름 저장"},
  "Leave journey":{id:"Tinggalkan perjalanan",pt:"Sair da jornada",fr:"Quitter le voyage",ru:"Покинуть путешествие",ja:"旅を終了","zh-CN":"离开旅程",ko:"여정 나가기"},
  "Show GM options":{id:"Tampilkan opsi GM",pt:"Mostrar opções do GM",fr:"Afficher les options du MJ",ru:"Показать варианты мастера",ja:"GMオプションを表示","zh-CN":"显示 GM 选项",ko:"GM 선택지 표시"},
  "Your story begins here":{id:"Kisahmu dimulai di sini",pt:"Sua história começa aqui",fr:"Votre histoire commence ici",ru:"Здесь начинается ваша история",ja:"ここから物語が始まる","zh-CN":"你的故事从这里开始",ko:"여기서 이야기가 시작됩니다"}
});
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
  return '<section class="language-preference"><label for="merzkava-language-select">✧ '+translateLabel("Language",language)+'</label><select id="merzkava-language-select" data-language-select aria-label="'+translateLabel("Choose language",language)+'">'+options+'</select></section><div class="developer-credit"><span>'+APP_NAME+' · APK '+APP_VERSION+'</span><strong>神Neru | Eru</strong><em>The Unfortunate Sleeping God</em></div>';
}
export function translateRenderedContent(root:ParentNode,language:AppLanguage):void {
  document.documentElement.lang=language;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes:Text[]=[]; while(walker.nextNode()) nodes.push(walker.currentNode as Text);
  for(const node of nodes){const raw=node.nodeValue??"";const trimmed=raw.trim();if(!trimmed)continue;const translated=translateLabel(trimmed,language);if(translated!==trimmed)node.nodeValue=raw.replace(trimmed,translated);}
  root.querySelectorAll<HTMLElement>("[aria-label],[title],[placeholder]").forEach(element=>{for(const attribute of ["aria-label","title","placeholder"]){const value=element.getAttribute(attribute);if(value)element.setAttribute(attribute,translateLabel(value,language));}});
}
