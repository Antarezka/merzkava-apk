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

Object.assign(labels, {
  "TACTICAL ACADEMY · COMMAND HALL":{id:"AKADEMI TAKTIS · AULA KOMANDO",pt:"ACADEMIA TÁTICA · SALA DE COMANDO",fr:"ACADÉMIE TACTIQUE · SALLE DE COMMANDEMENT",ru:"ТАКТИЧЕСКАЯ АКАДЕМИЯ · КОМАНДНЫЙ ЗАЛ",ja:"戦術学院 · 指令ホール","zh-CN":"战术学院 · 指挥大厅",ko:"전술 아카데미 · 지휘 홀"},
  Command:{id:"Kendalikan",pt:"Comande",fr:"Dirigez",ru:"Управляй",ja:"導け","zh-CN":"掌控",ko:"지휘하라"},
  "the chronicle.":{id:"kroniknya.",pt:"a crônica.",fr:"la chronique.",ru:"летописью.",ja:"年代記を。","zh-CN":"编年史。",ko:"연대기를."},
  "Three powers. Countless lives. One world shaped by the choices made within it.":{id:"Tiga kekuatan. Tak terhitung kehidupan. Satu dunia yang dibentuk oleh pilihan di dalamnya.",pt:"Três poderes. Vidas incontáveis. Um mundo moldado pelas escolhas feitas nele.",fr:"Trois puissances. Des vies innombrables. Un monde façonné par les choix de ceux qui l'habitent.",ru:"Три державы. Бесчисленные жизни. Один мир, формируемый сделанным в нём выбором.",ja:"三つの勢力。数え切れない命。その選択によって形作られる一つの世界。","zh-CN":"三大势力，无数生命。一个由其中每个选择塑造的世界。",ko:"세 세력, 수많은 삶. 그 안에서 내린 선택으로 빚어지는 하나의 세계."},
  "Continue your chronicle":{id:"Lanjutkan kronikmu",pt:"Continue sua crônica",fr:"Poursuivre votre chronique",ru:"Продолжить летопись",ja:"年代記を続ける","zh-CN":"继续你的编年史",ko:"연대기 이어가기"},
  "Three great powers":{id:"Tiga kekuatan besar",pt:"Três grandes poderes",fr:"Trois grandes puissances",ru:"Три великие державы",ja:"三大勢力","zh-CN":"三大势力",ko:"세 대세력"},
  "Choose a dossier to explore its place in Merzkava.":{id:"Pilih berkas untuk menjelajahi kedudukannya di Merzkava.",pt:"Escolha um dossiê para explorar seu lugar em Merzkava.",fr:"Choisissez un dossier pour découvrir sa place dans Merzkava.",ru:"Выберите досье, чтобы изучить место державы в Мерзкаве.",ja:"資料を選び、メルズカヴァにおける位置づけを確認してください。","zh-CN":"选择一份档案，探索它在 Merzkava 中的地位。",ko:"문서를 선택해 Merzkava에서의 위치를 살펴보세요."},
  "YOUR IDENTITY":{id:"IDENTITASMU",pt:"SUA IDENTIDADE",fr:"VOTRE IDENTITÉ",ru:"ВАША ЛИЧНОСТЬ",ja:"あなたの身元","zh-CN":"你的身份",ko:"나의 신원"},
  "Create a local character, or refresh the official players.md registry below to select a registered character.":{id:"Buat karakter lokal atau perbarui registry resmi players.md di bawah untuk memilih karakter terdaftar.",pt:"Crie um personagem local ou atualize o registro oficial players.md abaixo para selecionar um personagem registrado.",fr:"Créez un personnage local ou actualisez le registre officiel players.md ci-dessous pour en sélectionner un.",ru:"Создайте локального персонажа или обновите официальный реестр players.md ниже, чтобы выбрать зарегистрированного персонажа.",ja:"ローカルキャラクターを作成するか、下の公式 players.md 登録簿を更新して登録済みキャラクターを選択してください。","zh-CN":"创建本地角色，或刷新下方官方 players.md 名册以选择已登记角色。",ko:"로컬 캐릭터를 만들거나 아래 공식 players.md 명부를 새로고침해 등록된 캐릭터를 선택하세요."},
  "NEW CHARACTER":{id:"KARAKTER BARU",pt:"NOVO PERSONAGEM",fr:"NOUVEAU PERSONNAGE",ru:"НОВЫЙ ПЕРСОНАЖ",ja:"新規キャラクター","zh-CN":"新角色",ko:"새 캐릭터"},
  "MORTAL / NOT AWAKENED":{id:"MORTAL / BELUM TERBANGKIT",pt:"MORTAL / NÃO DESPERTO",fr:"MORTEL / NON ÉVEILLÉ",ru:"СМЕРТНЫЙ / НЕ ПРОБУЖДЁН",ja:"凡人 / 未覚醒","zh-CN":"凡人 / 未觉醒",ko:"필멸자 / 미각성"},
  Background:{id:"Latar belakang",pt:"Histórico",fr:"Antécédents",ru:"Предыстория",ja:"背景","zh-CN":"背景",ko:"배경"},
  "(optional)":{id:"(opsional)",pt:"(opcional)",fr:"(facultatif)",ru:"(необязательно)",ja:"（任意）","zh-CN":"（可选）",ko:"(선택 사항)"},
  "Create character":{id:"Buat karakter",pt:"Criar personagem",fr:"Créer un personnage",ru:"Создать персонажа",ja:"キャラクター作成","zh-CN":"创建角色",ko:"캐릭터 생성"},
  "PLAYER REGISTRY · players.md":{id:"REGISTRY PEMAIN · players.md",pt:"REGISTRO DE JOGADORES · players.md",fr:"REGISTRE DES JOUEURS · players.md",ru:"РЕЕСТР ИГРОКОВ · players.md",ja:"プレイヤー登録簿 · players.md","zh-CN":"玩家名册 · players.md",ko:"플레이어 명부 · players.md"},
  "Refresh players":{id:"Perbarui pemain",pt:"Atualizar jogadores",fr:"Actualiser les joueurs",ru:"Обновить игроков",ja:"プレイヤー情報を更新","zh-CN":"刷新玩家列表",ko:"플레이어 새로고침"},
  "YOUR CHARACTERS":{id:"KARAKTERMU",pt:"SEUS PERSONAGENS",fr:"VOS PERSONNAGES",ru:"ВАШИ ПЕРСОНАЖИ",ja:"あなたのキャラクター","zh-CN":"你的角色",ko:"내 캐릭터"},
  "No character yet":{id:"Belum ada karakter",pt:"Nenhum personagem ainda",fr:"Aucun personnage pour le moment",ru:"Персонажей пока нет",ja:"キャラクターはまだいません","zh-CN":"尚无角色",ko:"아직 캐릭터가 없습니다"},
  "Create your first adventurer using the form above.":{id:"Buat petualang pertamamu melalui formulir di atas.",pt:"Crie seu primeiro aventureiro usando o formulário acima.",fr:"Créez votre premier aventurier à l’aide du formulaire ci-dessus.",ru:"Создайте своего первого искателя приключений с помощью формы выше.",ja:"上のフォームから最初の冒険者を作成してください。","zh-CN":"使用上方表单创建你的第一位冒险者。",ko:"위 양식을 사용해 첫 모험가를 만드세요."},
  "Delete character":{id:"Hapus karakter",pt:"Excluir personagem",fr:"Supprimer le personnage",ru:"Удалить персонажа",ja:"キャラクターを削除","zh-CN":"删除角色",ko:"캐릭터 삭제"},
  WALLET:{id:"DOMPET",pt:"CARTEIRA",fr:"PORTEFEUILLE",ru:"КОШЕЛЁК",ja:"所持金","zh-CN":"钱包",ko:"지갑"},
  "Balances will be calculated and validated by the game engine.":{id:"Saldo akan dihitung dan divalidasi oleh mesin permainan.",pt:"Os saldos serão calculados e validados pelo mecanismo do jogo.",fr:"Les soldes seront calculés et validés par le moteur du jeu.",ru:"Баланс будет рассчитан и проверен игровым движком.",ja:"残高はゲームエンジンによって計算・検証されます。","zh-CN":"余额将由游戏引擎计算并验证。",ko:"잔액은 게임 엔진에서 계산하고 검증합니다."},
  "Inventory is empty":{id:"Inventaris kosong",pt:"Inventário vazio",fr:"Inventaire vide",ru:"Инвентарь пуст",ja:"所持品は空です","zh-CN":"物品栏为空",ko:"소지품이 비어 있습니다"},
  "Items acquired during gameplay will be recorded here.":{id:"Barang yang diperoleh selama permainan akan dicatat di sini.",pt:"Os itens obtidos durante o jogo serão registrados aqui.",fr:"Les objets obtenus pendant le jeu seront consignés ici.",ru:"Предметы, полученные во время игры, будут записаны здесь.",ja:"ゲーム中に入手したアイテムはここに記録されます。","zh-CN":"游戏中获得的物品将记录在此处。",ko:"게임 중 획득한 아이템이 여기에 기록됩니다."},
  "YOUR RECORDED HISTORY":{id:"RIWAYAT TERCATAT",pt:"SEU HISTÓRICO REGISTRADO",fr:"VOTRE HISTORIQUE",ru:"ВАША ИСТОРИЯ",ja:"記録された履歴","zh-CN":"已记录的历史",ko:"기록된 이력"},
  "Quests, discoveries, and gameplay events.":{id:"Misi, penemuan, dan peristiwa permainan.",pt:"Missões, descobertas e eventos do jogo.",fr:"Quêtes, découvertes et événements de jeu.",ru:"Задания, открытия и игровые события.",ja:"クエスト、発見、ゲーム内イベント。","zh-CN":"任务、发现和游戏事件。",ko:"퀘스트, 발견 및 게임 이벤트."},
  "No entries yet":{id:"Belum ada catatan",pt:"Ainda não há registros",fr:"Aucune entrée pour le moment",ru:"Записей пока нет",ja:"記録はまだありません","zh-CN":"暂无记录",ko:"아직 기록이 없습니다"},
  "Verified events and important story moments will be recorded here.":{id:"Peristiwa terverifikasi dan momen cerita penting akan dicatat di sini.",pt:"Eventos verificados e momentos importantes da história serão registrados aqui.",fr:"Les événements vérifiés et les moments importants de l’histoire seront consignés ici.",ru:"Здесь будут записаны подтверждённые события и важные моменты истории.",ja:"確認済みの出来事や物語の重要な場面がここに記録されます。","zh-CN":"经过验证的事件和重要剧情时刻将在此记录。",ko:"검증된 사건과 중요한 이야기 순간이 여기에 기록됩니다."},
  "MERZKAVA · WORLD TIME":{id:"MERZKAVA · WAKTU DUNIA",pt:"MERZKAVA · TEMPO DO MUNDO",fr:"MERZKAVA · TEMPS DU MONDE",ru:"MERZKAVA · ВРЕМЯ МИРА",ja:"MERZKAVA · 世界時刻","zh-CN":"MERZKAVA · 世界时间",ko:"MERZKAVA · 세계 시간"},
  "THE CHRONICLE":{id:"KRONIK",pt:"A CRÔNICA",fr:"LA CHRONIQUE",ru:"ЛЕТОПИСЬ",ja:"年代記","zh-CN":"编年史",ko:"연대기"},
  "PLAYER SESSION":{id:"SESI PEMAIN",pt:"SESSÃO DO JOGADOR",fr:"SESSION DU JOUEUR",ru:"СЕССИЯ ИГРОКА",ja:"プレイヤーセッション","zh-CN":"玩家会话",ko:"플레이어 세션"},
  "WORLD SCENE PREVIEW":{id:"PRATINJAU ADEGAN DUNIA",pt:"PRÉVIA DA CENA MUNDIAL",fr:"APERÇU DE LA SCÈNE DU MONDE",ru:"ПРЕДПРОСМОТР МИРОВОЙ СЦЕНЫ",ja:"ワールドシーンプレビュー","zh-CN":"世界场景预览",ko:"월드 장면 미리보기"},
  "SCENE WINDOW · LIVE WORLD":{id:"JENDELA ADEGAN · DUNIA AKTIF",pt:"JANELA DE CENA · MUNDO VIVO",fr:"FENÊTRE DE SCÈNE · MONDE VIVANT",ru:"ОКНО СЦЕНЫ · ЖИВОЙ МИР",ja:"シーンウィンドウ · ライブワールド","zh-CN":"场景窗口 · 动态世界",ko:"장면 창 · 살아 있는 세계"},
  "Not recorded":{id:"Belum tercatat",pt:"Não registrado",fr:"Non enregistré",ru:"Не записано",ja:"未記録","zh-CN":"未记录",ko:"기록되지 않음"},
  "JOURNEY MANAGER":{id:"PENGELOLA PERJALANAN",pt:"GERENCIADOR DE JORNADAS",fr:"GESTIONNAIRE DE VOYAGES",ru:"УПРАВЛЕНИЕ ПУТЕШЕСТВИЯМИ",ja:"旅の管理","zh-CN":"旅程管理",ko:"여정 관리자"},
  "No saved journeys yet. Your first journey will appear here.":{id:"Belum ada perjalanan tersimpan. Perjalanan pertamamu akan muncul di sini.",pt:"Ainda não há jornadas salvas. Sua primeira jornada aparecerá aqui.",fr:"Aucun voyage enregistré. Votre premier voyage apparaîtra ici.",ru:"Сохранённых путешествий пока нет. Первое появится здесь.",ja:"保存された旅はまだありません。最初の旅がここに表示されます。","zh-CN":"尚无已保存的旅程。你的第一段旅程会显示在这里。",ko:"저장된 여정이 없습니다. 첫 여정이 여기에 표시됩니다."}
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
