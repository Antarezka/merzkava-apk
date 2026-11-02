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


Object.assign(labels, {
  "FULL CHARACTER PROFILE · players.md · 18 FIELDS":{id:"PROFIL KARAKTER LENGKAP · players.md · 18 BIDANG",pt:"PERFIL COMPLETO DO PERSONAGEM · players.md · 18 CAMPOS",fr:"PROFIL COMPLET DU PERSONNAGE · players.md · 18 CHAMPS",ru:"ПОЛНЫЙ ПРОФИЛЬ ПЕРСОНАЖА · players.md · 18 ПОЛЕЙ",ja:"キャラクター完全プロフィール · players.md · 18項目","zh-CN":"完整角色档案 · players.md · 18 个字段",ko:"전체 캐릭터 프로필 · players.md · 18개 항목"},
  "REGISTERED · players.md":{id:"TERDAFTAR · players.md",pt:"REGISTRADO · players.md",fr:"ENREGISTRÉ · players.md",ru:"ЗАРЕГИСТРИРОВАНО · players.md",ja:"登録済み · players.md","zh-CN":"已登记 · players.md",ko:"등록됨 · players.md"},
  "No ledger entries yet":{id:"Belum ada entri ledger",pt:"Ainda não há lançamentos no livro-razão",fr:"Aucune entrée dans le registre pour le moment",ru:"Записей в журнале пока нет",ja:"台帳の記録はまだありません","zh-CN":"暂无账本记录",ko:"아직 원장 항목이 없습니다"},
  "Only verified changes to character state will appear here. GM narration alone never changes your records.":{id:"Hanya perubahan status karakter yang terverifikasi akan muncul di sini. Narasi GM saja tidak pernah mengubah catatanmu.",pt:"Somente alterações verificadas no estado do personagem aparecerão aqui. A narração do GM, por si só, nunca altera seus registros.",fr:"Seules les modifications vérifiées de l’état du personnage apparaîtront ici. La narration du MJ seule ne modifie jamais vos données.",ru:"Здесь отображаются только подтверждённые изменения состояния персонажа. Одно лишь повествование мастера не меняет записи.",ja:"ここには確認済みのキャラクター状態の変更のみが表示されます。GMの語りだけで記録が変わることはありません。","zh-CN":"这里只会显示经过验证的角色状态变更。GM 叙述本身不会更改你的记录。",ko:"검증된 캐릭터 상태 변경만 여기에 표시됩니다. GM의 서술만으로 기록이 바뀌지는 않습니다."},
  "POSSESSIONS & FINANCES":{id:"KEPEMILIKAN & KEUANGAN",pt:"BENS E FINANÇAS",fr:"POSSESSIONS ET FINANCES",ru:"ИМУЩЕСТВО И ФИНАНСЫ",ja:"所持品と財務","zh-CN":"物品与财务",ko:"소지품 및 재정"},
  "Items, equipment, structures, and wallet.":{id:"Barang, perlengkapan, bangunan, dan dompet.",pt:"Itens, equipamentos, estruturas e carteira.",fr:"Objets, équipement, structures et portefeuille.",ru:"Предметы, снаряжение, сооружения и кошелёк.",ja:"アイテム、装備、建造物、所持金。","zh-CN":"物品、装备、建筑资产和钱包。",ko:"아이템, 장비, 건축물 및 지갑."},
  "WALLET · GM REPORTED":{id:"DOMPET · LAPORAN GM",pt:"CARTEIRA · RELATO DO GM",fr:"PORTEFEUILLE · RAPPORT DU MJ",ru:"КОШЕЛЁК · ДАННЫЕ МАСТЕРА",ja:"所持金 · GM報告","zh-CN":"钱包 · GM 报告",ko:"지갑 · GM 보고"},
  "BUILDING ASSETS":{id:"ASET BANGUNAN",pt:"ATIVOS IMOBILIÁRIOS",fr:"ACTIFS IMMOBILIERS",ru:"АКТИВЫ НЕДВИЖИМОСТИ",ja:"建物資産","zh-CN":"建筑资产",ko:"건축 자산"},
  "LEDGER LOG":{id:"LOG LEDGER",pt:"REGISTRO CONTÁBIL",fr:"JOURNAL DE REGISTRE",ru:"ЖУРНАЛ УЧЁТА",ja:"台帳ログ","zh-CN":"账本日志",ko:"원장 기록"},
  "ERA":{id:"ERA",pt:"ERA",fr:"ÈRE",ru:"ЭРА",ja:"時代","zh-CN":"纪元",ko:"시대"},
  "YEAR":{id:"TAHUN",pt:"ANO",fr:"ANNÉE",ru:"ГОД",ja:"年","zh-CN":"年份",ko:"연도"},
  "WORLD CLOCK":{id:"JAM DUNIA",pt:"RELÓGIO MUNDIAL",fr:"HORLOGE DU MONDE",ru:"МИРОВЫЕ ЧАСЫ",ja:"世界時計","zh-CN":"世界时钟",ko:"세계 시계"},
  "ACTIVE CHARACTER":{id:"KARAKTER AKTIF",pt:"PERSONAGEM ATIVO",fr:"PERSONNAGE ACTIF",ru:"АКТИВНЫЙ ПЕРСОНАЖ",ja:"選択中のキャラクター","zh-CN":"当前角色",ko:"활성 캐릭터"},
  "No character selected":{id:"Belum ada karakter dipilih",pt:"Nenhum personagem selecionado",fr:"Aucun personnage sélectionné",ru:"Персонаж не выбран",ja:"キャラクターが選択されていません","zh-CN":"未选择角色",ko:"선택된 캐릭터 없음"},
  "Save ✧":{id:"Simpan ✧",pt:"Salvar ✧",fr:"Enregistrer ✧",ru:"Сохранить ✧",ja:"保存 ✧","zh-CN":"保存 ✧",ko:"저장 ✧"},
  "Mulai Convo":{id:"Mulai Percakapan",pt:"Iniciar conversa",fr:"Commencer la conversation",ru:"Начать диалог",ja:"会話を開始","zh-CN":"开始对话",ko:"대화 시작"},
  "Aksiku":{id:"Aksiku",pt:"Minha ação",fr:"Mon action",ru:"Моё действие",ja:"自分の行動","zh-CN":"我的行动",ko:"내 행동"},
  "FORMAT TEKS":{id:"FORMAT TEKS",pt:"FORMATO DO TEXTO",fr:"FORMAT DU TEXTE",ru:"ФОРМАТ ТЕКСТА",ja:"テキスト形式","zh-CN":"文本格式",ko:"텍스트 형식"},
  "Spirit Realm":{id:"Ranah Roh",pt:"Reino Espiritual",fr:"Royaume des Esprits",ru:"Духовное царство",ja:"霊界","zh-CN":"灵境",ko:"영계"},
  "MARTIAL SOUL":{id:"JIWA BELA DIRI",pt:"ALMA MARCIAL",fr:"ÂME MARTIALE",ru:"БОЕВОЙ ДУХ",ja:"武魂","zh-CN":"武魂",ko:"무혼"},
  "SPIRIT RING ABSORPTION":{id:"PENYERAPAN CINCIN ROH",pt:"ABSORÇÃO DO ANEL ESPIRITUAL",fr:"ABSORPTION DE L’ANNEAU SPIRITUEL",ru:"ПОГЛОЩЕНИЕ ДУХОВНОГО КОЛЬЦА",ja:"精霊環吸収","zh-CN":"精灵环吸收",ko:"영환 흡수"},
  "SYNC PROGRESS":{id:"PROGRES SINKRONISASI",pt:"PROGRESSO DE SINCRONIA",fr:"PROGRESSION DE SYNCHRONISATION",ru:"ПРОГРЕСС СИНХРОНИЗАЦИИ",ja:"同期進行度","zh-CN":"同步进度",ko:"동기화 진행도"},
  "ENERGY":{id:"ENERGI",pt:"ENERGIA",fr:"ÉNERGIE",ru:"ЭНЕРГИЯ",ja:"エネルギー","zh-CN":"能量",ko:"에너지"},
  "INSIGHT":{id:"WAWASAN",pt:"PERCEPÇÃO",fr:"PERSPICACITÉ",ru:"ПРОНИЦАТЕЛЬНОСТЬ",ja:"洞察","zh-CN":"洞察",ko:"통찰"},
  "ARCANIST GRADE":{id:"TINGKAT ARKANIS",pt:"GRAU DE ARCANISTA",fr:"GRADE D’ARCANISTE",ru:"РАНГ АРКАНИСТА",ja:"アルカニスト階級","zh-CN":"奥术师等级",ko:"아르카니스트 등급"},
  "ARCANIST FOCUS":{id:"FOKUS ARKANIS",pt:"FOCO DE ARCANISTA",fr:"FOCUS D’ARCANISTE",ru:"ФОКУС АРКАНИСТА",ja:"アルカニスト集中力","zh-CN":"奥术师专注",ko:"아르카니스트 집중"},
  "SATIETY":{id:"KETERPUASAN",pt:"SACIEDADE",fr:"SATIÉTÉ",ru:"СЫТОСТЬ",ja:"満腹度","zh-CN":"饱腹度",ko:"포만도"},
  "NON-CANON · LOCAL SAVE":{id:"NON-KANON · SIMPANAN LOKAL",pt:"NÃO CANÔNICO · SALVAMENTO LOCAL",fr:"NON CANONIQUE · SAUVEGARDE LOCALE",ru:"НЕ КАНОН · ЛОКАЛЬНОЕ СОХРАНЕНИЕ",ja:"非正史 · ローカルセーブ","zh-CN":"非正典 · 本地存档",ko:"비정사 · 로컬 저장"},
  "A QUIET MOMENT":{id:"MOMEN TENANG",pt:"UM MOMENTO TRANQUILO",fr:"UN MOMENT DE CALME",ru:"ТИХОЕ МГНОВЕНИЕ",ja:"静かなひととき","zh-CN":"宁静时刻",ko:"고요한 순간"},
  "THE NARRATIVE":{id:"NARASI",pt:"A NARRATIVA",fr:"LE RÉCIT",ru:"ПОВЕСТВОВАНИЕ",ja:"物語","zh-CN":"叙事",ko:"서사"},
  "AWAITING YOUR JOURNEY":{id:"MENUNGGU PERJALANANMU",pt:"AGUARDANDO SUA JORNADA",fr:"EN ATTENTE DE VOTRE VOYAGE",ru:"В ОЖИДАНИИ ВАШЕГО ПУТЕШЕСТВИЯ",ja:"あなたの旅を待っています","zh-CN":"等待你的旅程",ko:"여정을 기다리는 중"},
  "Create a separate Eternal Path character to begin a journey.":{id:"Buat karakter Eternal Path terpisah untuk memulai perjalanan.",pt:"Crie um personagem separado de Eternal Path para iniciar uma jornada.",fr:"Créez un personnage distinct pour Eternal Path afin de commencer un voyage.",ru:"Создайте отдельного персонажа Eternal Path, чтобы начать путешествие.",ja:"旅を始めるには、Eternal Path専用のキャラクターを作成してください。","zh-CN":"创建一个独立的 Eternal Path 角色以开始旅程。",ko:"여정을 시작하려면 별도의 Eternal Path 캐릭터를 만드세요."},
  "YOUR RESPONSE":{id:"RESPONSMU",pt:"SUA RESPOSTA",fr:"VOTRE RÉPONSE",ru:"ВАШ ОТВЕТ",ja:"あなたの返答","zh-CN":"你的回应",ko:"나의 응답"},
  "Consider the situation":{id:"Pertimbangkan situasinya",pt:"Considere a situação",fr:"Considérez la situation",ru:"Обдумайте ситуацию",ja:"状況を考えてください","zh-CN":"考虑当前情况",ko:"상황을 고려하세요"},
  "IN-GAME ORIGINAL · STARTER SITUATION · NOT UNIVERSE CANON":{id:"ORISINAL DALAM GAME · SITUASI PEMULA · BUKAN KANON UNIVERSE",pt:"ORIGINAL DO JOGO · SITUAÇÃO INICIAL · NÃO É CÂNONE DO UNIVERSO",fr:"ORIGINAL DU JEU · SITUATION DE DÉPART · NON CANONIQUE",ru:"ОРИГИНАЛЬНЫЙ ИГРОВОЙ КОНТЕНТ · СТАРТОВАЯ СИТУАЦИЯ · НЕ КАНОН ВСЕЛЕННОЙ",ja:"ゲーム内オリジナル · 初期状況 · ユニバース正史ではない","zh-CN":"游戏原创 · 初始情境 · 非宇宙正典",ko:"게임 오리지널 · 시작 상황 · 유니버스 정사 아님"},
  "CHARACTER BEHAVIOR":{id:"PERILAKU KARAKTER",pt:"COMPORTAMENTO DO PERSONAGEM",fr:"COMPORTEMENT DU PERSONNAGE",ru:"ПОВЕДЕНИЕ ПЕРСОНАЖА",ja:"キャラクターの行動","zh-CN":"角色行为",ko:"캐릭터 행동"},
  "DIALOGUE":{id:"DIALOG",pt:"DIÁLOGO",fr:"DIALOGUE",ru:"ДИАЛОГ",ja:"会話","zh-CN":"对话",ko:"대화"},
  "PERSPECTIVE":{id:"SUDUT PANDANG",pt:"PERSPECTIVA",fr:"PERSPECTIVE",ru:"ТОЧКА ЗРЕНИЯ",ja:"視点","zh-CN":"视角",ko:"관점"},
  "Consider your response":{id:"Tentukan responsmu",pt:"Considere sua resposta",fr:"Réfléchissez à votre réponse",ru:"Выберите свой ответ",ja:"返答を考えてください","zh-CN":"考虑你的回应",ko:"응답을 생각하세요"},
  "STARTER SITUATIONS COMPLETE":{id:"SITUASI PEMULA SELESAI",pt:"SITUAÇÕES INICIAIS CONCLUÍDAS",fr:"SITUATIONS DE DÉPART TERMINÉES",ru:"СТАРТОВЫЕ СИТУАЦИИ ЗАВЕРШЕНЫ",ja:"初期シチュエーション完了","zh-CN":"初始情境已完成",ko:"시작 상황 완료"}
});


Object.assign(labels, {
  "COMMAND HALL · THREE POWERS · ONE WORLD":{id:"AULA KOMANDO · TIGA KEKUATAN · SATU DUNIA",pt:"SALA DE COMANDO · TRÊS PODERES · UM MUNDO",fr:"SALLE DE COMMANDEMENT · TROIS PUISSANCES · UN MONDE",ru:"КОМАНДНЫЙ ЗАЛ · ТРИ ДЕРЖАВЫ · ОДИН МИР",ja:"指令ホール · 三大勢力 · 一つの世界","zh-CN":"指挥大厅 · 三大势力 · 一个世界",ko:"지휘 홀 · 세 세력 · 하나의 세계"},
  "POLITICAL ATLAS · 01—03":{id:"ATLAS POLITIK · 01—03",pt:"ATLAS POLÍTICO · 01—03",fr:"ATLAS POLITIQUE · 01—03",ru:"ПОЛИТИЧЕСКИЙ АТЛАС · 01—03",ja:"政治地図 · 01—03","zh-CN":"政治图谱 · 01—03",ko:"정치 지도 · 01—03"},
  RECORDS:{id:"CATATAN",pt:"REGISTROS",fr:"DOSSIERS",ru:"ЗАПИСИ",ja:"記録","zh-CN":"记录",ko:"기록"},
  "EASTERN POWER · 01":{id:"KEKUATAN TIMUR · 01",pt:"PODER ORIENTAL · 01",fr:"PUISSANCE ORIENTALE · 01",ru:"ВОСТОЧНАЯ ДЕРЖАВА · 01",ja:"東方勢力 · 01","zh-CN":"东方势力 · 01",ko:"동부 세력 · 01"},
  "Imperial administration · Eastern territories":{id:"Administrasi kekaisaran · Wilayah timur",pt:"Administração imperial · Territórios orientais",fr:"Administration impériale · Territoires de l’Est",ru:"Имперское управление · Восточные территории",ja:"帝国統治 · 東方領域","zh-CN":"帝国行政 · 东方领土",ko:"제국 행정 · 동부 영토"},
  "OPEN DOSSIER":{id:"BUKA BERKAS",pt:"ABRIR DOSSIÊ",fr:"OUVRIR LE DOSSIER",ru:"ОТКРЫТЬ ДОСЬЕ",ja:"資料を開く","zh-CN":"打开档案",ko:"문서 열기"},
  "SOUTHWESTERN POWER · 02":{id:"KEKUATAN BARAT DAYA · 02",pt:"PODER DO SUDOESTE · 02",fr:"PUISSANCE DU SUD-OUEST · 02",ru:"ЮГО-ЗАПАДНАЯ ДЕРЖАВА · 02",ja:"南西勢力 · 02","zh-CN":"西南势力 · 02",ko:"남서부 세력 · 02"},
  "Floating island · Maritime civilisation":{id:"Pulau melayang · Peradaban maritim",pt:"Ilha flutuante · Civilização marítima",fr:"Île flottante · Civilisation maritime",ru:"Парящий остров · Морская цивилизация",ja:"浮遊島 · 海洋文明","zh-CN":"浮空岛 · 海洋文明",ko:"부유섬 · 해양 문명"},
  "NORTHERN POWER · 03":{id:"KEKUATAN UTARA · 03",pt:"PODER DO NORTE · 03",fr:"PUISSANCE DU NORD · 03",ru:"СЕВЕРНАЯ ДЕРЖАВА · 03",ja:"北方勢力 · 03","zh-CN":"北方势力 · 03",ko:"북부 세력 · 03"},
  "Northern highlands · Ancient spiritual heritage":{id:"Dataran tinggi utara · Warisan spiritual kuno",pt:"Terras altas do norte · Herança espiritual antiga",fr:"Hautes terres du nord · Héritage spirituel ancien",ru:"Северные нагорья · Древнее духовное наследие",ja:"北方高地 · 古代の霊的遺産","zh-CN":"北方高地 · 古老的灵性遗产",ko:"북부 고원 · 고대 영적 유산"},
  "COMMAND DECK":{id:"DEK KOMANDO",pt:"PAINEL DE COMANDO",fr:"POSTE DE COMMANDEMENT",ru:"КОМАНДНАЯ ПАНЕЛЬ",ja:"コマンドデッキ","zh-CN":"指挥台",ko:"지휘 데크"},
  "QUICK ACCESS":{id:"AKSES CEPAT",pt:"ACESSO RÁPIDO",fr:"ACCÈS RAPIDE",ru:"БЫСТРЫЙ ДОСТУП",ja:"クイックアクセス","zh-CN":"快速访问",ko:"빠른 접근"},
  "Identity and cultivation":{id:"Identitas dan kultivasi",pt:"Identidade e cultivo",fr:"Identité et cultivation",ru:"Личность и культивация",ja:"身元と修練","zh-CN":"身份与修炼",ko:"신원 및 수련"},
  "Items and finances":{id:"Barang dan keuangan",pt:"Itens e finanças",fr:"Objets et finances",ru:"Предметы и финансы",ja:"所持品と財務","zh-CN":"物品与财务",ko:"아이템 및 재정"},
  "Places, history and records":{id:"Tempat, sejarah, dan catatan",pt:"Lugares, história e registros",fr:"Lieux, histoire et archives",ru:"Места, история и записи",ja:"場所・歴史・記録","zh-CN":"地点、历史与记录",ko:"장소, 역사 및 기록"},
  "Your recorded story":{id:"Kisah yang tercatat",pt:"Sua história registrada",fr:"Votre histoire enregistrée",ru:"Ваша записанная история",ja:"記録された物語","zh-CN":"已记录的故事",ko:"기록된 이야기"},
  "Pilih karakter, lalu mulai sesi baru. Riwayat percakapan tersimpan terpisah untuk setiap karakter.":{id:"Pilih karakter, lalu mulai sesi baru. Riwayat percakapan tersimpan terpisah untuk setiap karakter.",pt:"Escolha um personagem e inicie uma nova sessão. O histórico de conversa é salvo separadamente para cada personagem.",fr:"Choisissez un personnage et démarrez une nouvelle session. L’historique est enregistré séparément pour chaque personnage.",ru:"Выберите персонажа и начните новую сессию. История диалогов сохраняется отдельно для каждого персонажа.",ja:"キャラクターを選んで新しいセッションを開始してください。会話履歴はキャラクターごとに個別保存されます。","zh-CN":"选择角色并开始新会话。每个角色的对话记录都会单独保存。",ko:"캐릭터를 선택하고 새 세션을 시작하세요. 대화 기록은 캐릭터별로 별도 저장됩니다."},
  "Catatan karakter & status":{id:"Catatan karakter & status",pt:"Registro e status do personagem",fr:"Dossier et statut du personnage",ru:"Запись персонажа и статус",ja:"キャラクター記録と状態","zh-CN":"角色记录与状态",ko:"캐릭터 기록 및 상태"},
  "Pilih karakter untuk melihat catatan lokalnya.":{id:"Pilih karakter untuk melihat catatan lokalnya.",pt:"Escolha um personagem para ver seus registros locais.",fr:"Choisissez un personnage pour consulter ses notes locales.",ru:"Выберите персонажа, чтобы просмотреть его локальные записи.",ja:"キャラクターを選択するとローカル記録を確認できます。","zh-CN":"选择角色以查看其本地记录。",ko:"캐릭터를 선택하면 로컬 기록을 볼 수 있습니다."},
  "Pilih karakter untuk memulai":{id:"Pilih karakter untuk memulai",pt:"Escolha um personagem para começar",fr:"Choisissez un personnage pour commencer",ru:"Выберите персонажа, чтобы начать",ja:"開始するキャラクターを選択","zh-CN":"选择角色以开始",ko:"시작할 캐릭터 선택"},
  "No":{id:"Tidak",pt:"Não",fr:"Non",ru:"Нет",ja:"いいえ","zh-CN":"否",ko:"아니요"},
  "Yes":{id:"Ya",pt:"Sim",fr:"Oui",ru:"Да",ja:"はい","zh-CN":"是",ko:"예"},
  "Italic":{id:"Miring",pt:"Itálico",fr:"Italique",ru:"Курсив",ja:"斜体","zh-CN":"斜体",ko:"기울임"},
  "Bold":{id:"Tebal",pt:"Negrito",fr:"Gras",ru:"Полужирный",ja:"太字","zh-CN":"粗体",ko:"굵게"},
  "Code":{id:"Kode",pt:"Código",fr:"Code",ru:"Код",ja:"コード","zh-CN":"代码",ko:"코드"},
  "Appearance, sound, local storage, and AI configuration.":{id:"Tampilan, suara, penyimpanan lokal, dan konfigurasi AI.",pt:"Aparência, som, armazenamento local e configuração de IA.",fr:"Apparence, son, stockage local et configuration de l’IA.",ru:"Внешний вид, звук, локальное хранилище и настройки ИИ.",ja:"外観、サウンド、ローカルストレージ、AI設定。","zh-CN":"外观、声音、本地存储和 AI 配置。",ko:"화면, 사운드, 로컬 저장소 및 AI 설정."},
  "The Academy Obsidian theme is the default command-hall palette. Parchment mode switches to a warmer, light reading surface.":{id:"Tema Obsidian Akademi adalah palet bawaan aula komando. Mode Perkamen beralih ke permukaan baca terang yang lebih hangat.",pt:"O tema Obsidiana da Academia é a paleta padrão da sala de comando. O modo Pergaminho oferece uma superfície de leitura clara e mais acolhedora.",fr:"Le thème Obsidienne de l’Académie est la palette par défaut de la salle de commandement. Le mode Parchemin offre une surface de lecture plus chaude et claire.",ru:"Тема «Обсидиан Академии» — стандартная палитра командного зала. Режим пергамента переключает интерфейс на более тёплую светлую поверхность.",ja:"アカデミー・オブシディアンは指令ホールの標準配色です。羊皮紙モードでは、より暖かく明るい読書画面に切り替わります。","zh-CN":"学院黑曜石主题是指挥大厅的默认配色。羊皮纸模式会切换为更温暖、明亮的阅读界面。",ko:"아카데미 옵시디언 테마는 지휘 홀의 기본 팔레트입니다. 양피지 모드는 더 따뜻하고 밝은 읽기 화면으로 전환합니다."},
  "Notifications":{id:"Notifikasi",pt:"Notificações",fr:"Notifications",ru:"Уведомления",ja:"通知","zh-CN":"通知",ko:"알림"},
  "RUNNING":{id:"BERJALAN",pt:"EM EXECUÇÃO",fr:"EN COURS",ru:"РАБОТАЕТ",ja:"実行中","zh-CN":"运行中",ko:"실행 중"},
  "NOT RUNNING":{id:"TIDAK BERJALAN",pt:"INATIVO",fr:"À L’ARRÊT",ru:"НЕ РАБОТАЕТ",ja:"停止中","zh-CN":"未运行",ko:"실행 중 아님"},
  "Allow ↗":{id:"Izinkan ↗",pt:"Permitir ↗",fr:"Autoriser ↗",ru:"Разрешить ↗",ja:"許可 ↗","zh-CN":"允许 ↗",ko:"허용 ↗"},
  "01 — 03":{id:"01 — 03",pt:"01 — 03",fr:"01 — 03",ru:"01 — 03",ja:"01 — 03","zh-CN":"01 — 03",ko:"01 — 03"},
  "Create another journey":{id:"Buat perjalanan lain",pt:"Criar outra jornada",fr:"Créer un autre voyage",ru:"Создать другое путешествие",ja:"別の旅を作成","zh-CN":"创建另一段旅程",ko:"다른 여정 만들기"},
  "Delete all journeys":{id:"Hapus semua perjalanan",pt:"Excluir todas as jornadas",fr:"Supprimer tous les voyages",ru:"Удалить все путешествия",ja:"すべての旅を削除","zh-CN":"删除所有旅程",ko:"모든 여정 삭제"},
  "Load":{id:"Muat",pt:"Carregar",fr:"Charger",ru:"Загрузить",ja:"読み込む","zh-CN":"加载",ko:"불러오기"},
  "Rename":{id:"Ubah nama",pt:"Renomear",fr:"Renommer",ru:"Переименовать",ja:"名前を変更","zh-CN":"重命名",ko:"이름 변경"},
  "Export":{id:"Ekspor",pt:"Exportar",fr:"Exporter",ru:"Экспорт",ja:"エクスポート","zh-CN":"导出",ko:"내보내기"},
  "Delete":{id:"Hapus",pt:"Excluir",fr:"Supprimer",ru:"Удалить",ja:"削除","zh-CN":"删除",ko:"삭제"},
  "Age":{id:"Usia",pt:"Idade",fr:"Âge",ru:"Возраст",ja:"年齢","zh-CN":"年龄",ko:"나이"},
  "WORLD ARCHIVE · READ ONLY":{id:"ARSIP DUNIA · HANYA BACA",pt:"ARQUIVO MUNDIAL · SOMENTE LEITURA",fr:"ARCHIVES DU MONDE · LECTURE SEULE",ru:"АРХИВ МИРА · ТОЛЬКО ЧТЕНИЕ",ja:"ワールドアーカイブ · 読み取り専用","zh-CN":"世界档案 · 只读",ko:"월드 아카이브 · 읽기 전용"},
  "DISPOSITION":{id:"DISPOSISI",pt:"DISPOSIÇÃO",fr:"DISPOSITION",ru:"СКЛОННОСТИ",ja:"気質","zh-CN":"倾向",ko:"성향"},
  "STANDALONE":{id:"MANDIRI",pt:"INDEPENDENTE",fr:"AUTONOME",ru:"АВТОНОМНЫЙ",ja:"独立","zh-CN":"独立",ko:"독립형"},
  "ETERNAL PATH · LOCAL JOURNEY":{id:"ETERNAL PATH · PERJALANAN LOKAL",pt:"ETERNAL PATH · JORNADA LOCAL",fr:"ETERNAL PATH · VOYAGE LOCAL",ru:"ETERNAL PATH · ЛОКАЛЬНОЕ ПУТЕШЕСТВИЕ",ja:"ETERNAL PATH · ローカルの旅","zh-CN":"ETERNAL PATH · 本地旅程",ko:"ETERNAL PATH · 로컬 여정"}
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
