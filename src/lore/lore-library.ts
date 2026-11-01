export type LoreCategory = "WORLD" | "POWERS" | "GEOGRAPHY" | "HISTORY" | "PEOPLES" | "FACTIONS" | "ARCHIVES" | "CULTURE";

export type LoreVisibility = "PUBLISHED" | "REVIEW_REQUIRED" | "GM_ONLY";

export interface LoreEntry {
  id: string;
  visibility: LoreVisibility;
  title: string;
  aliases: string[];
  category: LoreCategory;
  eyebrow: string;
  summary: string;
  paragraphs: string[];
  sourcePath: string;
  sourceLabel: string;
  sourceCommit: string;
  reviewedAt: string;
  crossReferenceIds: string[];
}

const LORE_ENTRY_DRAFTS: Omit<LoreEntry, "sourceCommit" | "reviewedAt" | "crossReferenceIds">[] = [
  {
    id: "world-atlas", title: "Merzkava Universe", aliases: ["Merzkava", "dunia Merzkava"],
    visibility: "PUBLISHED",
    category: "WORLD", eyebrow: "WORLD DOSSIER · 00", summary: "Sebuah dunia luas yang tumbuh dari tiga pusat kekuasaan, jalur laut, wilayah liar, dan peradaban dengan sejarah yang belum seluruhnya terungkap.",
    paragraphs: [
      "Merzkava Universe adalah dunia kultivasi dengan satu daratan luas, lautan yang saling terhubung, wilayah utara yang terisolasi, serta kawasan liar di luar yurisdiksi kekuatan besar. Tidak ada satu kekuasaan yang memerintah seluruh dunia.",
      "Peta politiknya berpusat pada Golden Dragon Empire di timur, Tianhai Yunzhou di barat daya, dan Beiming Gu di utara. Di antara dan di luar ketiganya terdapat jalur dagang, permukiman, hutan, pegunungan, lautan berbahaya, serta Lawless Territories.",
      "Dunia ini tidak hanya dibentuk oleh kultivasi. Pemerintahan, pendidikan, perdagangan, organisasi, tradisi, teknologi artefak, dan kehidupan masyarakat ikut menentukan bagaimana setiap wilayah berkembang.",
      "Catatan sejarah Merzkava sengaja menyisakan ruang kosong. Tanggal pendirian banyak kekuasaan, nama pendiri kuno, dan rincian sejumlah peristiwa belum ditetapkan. Ketidakpastian itu bukan izin untuk mengarang fakta."
    ],
    sourcePath: "world/WORLD.md", sourceLabel: "World Lore & Political Atlas"
  },
  {
    id: "golden-dragon", title: "Golden Dragon Empire", aliases: ["Golden Dragon", "Kekaisaran Naga Emas", "Huanglongcheng", "Longyuan"],
    visibility: "PUBLISHED",
    category: "POWERS", eyebrow: "EASTERN POWER · 01", summary: "Kekaisaran timur dengan pusat pemerintahan, jaringan administrasi luas, pertanian, pertambangan, pendidikan, dan pelabuhan.",
    paragraphs: [
      "Golden Dragon Empire menempati kawasan timur Merzkava. Kekuatannya bertumpu pada skala wilayah, administrasi sipil, mobilisasi, sumber daya, dan jaringan permukiman.",
      "Kekaisaran memiliki tujuh wilayah besar: Longyuan, Canglan, Jinyue, Tianfeng, Yanling, Baiyue, dan Xingluo. Struktur resminya mencakup dua belas prefektur, enam county circuit, serta tiga belas desa dalam register desa resmi.",
      "Huanglongcheng adalah pusat kekaisaran sekaligus ibu kota wilayah Longyuan. Kota ini menjadi simpul pemerintahan dan kehidupan elite. Sementara itu, Dongxing di Xingluo menjadi pelabuhan penting yang menghubungkan jalur pelayaran timur dengan wilayah lain.",
      "Karakter tiap wilayah berbeda: Longyuan berpusat pada istana dan politik; Canglan pada pertanian dan irigasi; Jinyue pada pertambangan serta logam spiritual; Tianfeng pada tradisi keilmuan; Yanling pada tungku dan pengerjaan; Baiyue pada pertahanan perbatasan; Xingluo pada perdagangan laut dan diplomasi."
    ],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md", sourceLabel: "Golden Dragon Administrative Atlas"
  },
  {
    id: "tianhai", title: "Tianhai Yunzhou", aliases: ["Yunzhou", "Pulau Terapung", "Cangqiong Harbor", "Tianji Core"],
    visibility: "PUBLISHED",
    category: "POWERS", eyebrow: "SOUTHWESTERN MARITIME POWER · 02", summary: "Kekuasaan maritim yang berpusat pada pulau raksasa terapung di atas Yunmeng Sea, terkenal dengan pelayaran, perdagangan, pendidikan, dan tradisi Arcanistry.",
    paragraphs: [
      "Tianhai Yunzhou berada di barat daya dunia, berpusat pada pulau raksasa yang terapung di atas Yunmeng Sea. Laut bukan sekadar batas geografis: ia adalah jalur kehidupan, perdagangan, perjalanan, dan hubungan antardaerah.",
      "Pulau utama dibagi ke dalam empat kawasan arah—Utara, Selatan, Barat, dan Timur—serta struktur administratif tujuh distrik. Tianji Core berada di bagian pusat sebagai kawasan yang berkaitan dengan sistem penopang pulau; Misty Shoals merupakan zona maritim terluar.",
      "Utara berorientasi pada keamanan dan pengawasan laut. Selatan menjadi pusat pemerintahan, pendidikan, kerajinan, dan pengembangan Arcanist. Barat berpusat pada aktivitas pelabuhan dan armada, sedangkan Timur dikenal melalui pasar, perdagangan, serta pertukaran informasi.",
      "Tianhai memiliki empat Cultivator Academies dan sebuah institusi riset Arcanist tingkat tinggi. Tradisi Arcanistry berawal di wilayah ini dan menjadi salah satu sumber pengaruh budaya serta teknologinya."
    ],
    sourcePath: "world/REGION_TIANHAI_YUNZHOU.md", sourceLabel: "Tianhai Yunzhou Regional Dossier"
  },
  {
    id: "beiming", title: "Beiming Gu", aliases: ["Beiming"],
    visibility: "PUBLISHED",
    category: "POWERS", eyebrow: "NORTHERN POWER · 03", summary: "Kekuasaan utara yang terlindungi pegunungan dan iklim ekstrem, dengan warisan spiritual serta lingkungan alam yang keras.",
    paragraphs: [
      "Beiming Gu terletak di utara Merzkava. Pegunungan, suhu ekstrem, dan keterisolasian geografis membentuk karakter wilayah serta cara masyarakatnya bertahan.",
      "Perairan utaranya dikenal sebagai Frostmirror Sea. Jalur pesisir dan pegunungan menghubungkan beberapa kawasan, tetapi kondisi alam membuat perjalanan tidak selalu mudah atau aman.",
      "Beiming memiliki hubungan sejarah yang kuat dengan Beiming Han dan warisan spiritual utara. Kisah Azerion juga terhubung dengan sejarah wilayah ini, termasuk perubahan luar biasa pada salah satu Heavenly Beast.",
      "Tidak semua detail batas wilayah, jarak, dan jalur perjalanan telah ditetapkan. Peta Merzkava adalah kerangka hubungan geografis, bukan peta berskala dengan koordinat pasti."
    ],
    sourcePath: "world/REGION_BEIMING_GU.md", sourceLabel: "Beiming Gu Regional Dossier"
  },
  {
    id: "lawless", title: "Lawless Territories", aliases: ["Lawless", "wilayah tanpa hukum"],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "EXTERNAL TERRITORY · 04", summary: "Kawasan di luar yurisdiksi langsung tiga kekuasaan besar, dihuni komunitas independen, kelompok buangan, organisasi kriminal, dan jaringan bawah tanah.",
    paragraphs: [
      "Lawless Territories berada di luar yurisdiksi langsung Golden Dragon Empire, Tianhai Yunzhou, dan Beiming Gu. Kawasan ini bukan satu negara atau pemerintahan tunggal; ia terdiri dari wilayah, permukiman, kelompok, dan kepentingan yang beragam.",
      "Di dalamnya terdapat desa independen, kultivator buronan, orang buangan, klan sesat, sekte demonic, serta organisasi kriminal. Jaringan ekonomi bawah tanah meliputi perantara kontrak, perdagangan, lelang, arena ilegal, penyelundupan, dan rumah hiburan.",
      "Kehidupan di kawasan ini dapat keras. Lahan pertanian yang buruk membuat pangan cenderung lebih langka dan mutunya tidak selalu baik. Keamanan, reputasi, dan hubungan lokal memiliki pengaruh besar.",
      "Lawless Territories tidak boleh disamakan dengan Black Tide Expanse atau Guixu Canghai. Ketiganya memiliki cakupan dan posisi geografis berbeda."
    ],
    sourcePath: "world/LAWLESS_TERRITORIES.md", sourceLabel: "Lawless Territories"
  },
  {
    id: "seas", title: "Seas & Passageways", aliases: ["Frostmirror Sea", "Eastern Azure Sea", "Yunmeng Sea", "Wufeng Sea", "Black Tide Sea", "Guixu Canghai", "Dongxing Port", "Lantern Passage"],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "MARITIME ATLAS · 05", summary: "Jaringan laut yang menghubungkan pesisir utara, timur, barat daya, wilayah Lawless, dan samudra paling selatan.",
    paragraphs: [
      "Frostmirror Sea berada di pesisir utara Beiming Gu. Eastern Azure Sea membentang di pesisir timur Golden Dragon Empire dan menjadi jalur pelayaran utama bagi pelabuhan-pelabuhannya.",
      "Yunmeng Sea mengelilingi kawasan pulau terapung Tianhai Yunzhou. Jalur lautnya menghubungkan Cangqiong Harbor dengan Dongxing Port dan koridor pelayaran timur.",
      "Wufeng Sea adalah cekungan laut tenang yang dicapai melalui Lantern Passage. Tidak ada angin, ombak, atau arus; kesunyian ekstremnya dapat mengganggu persepsi para pelintas. Kedalamannya menyimpan relik kuno dan dihuni banyak Spirit Beast.",
      "Black Tide Sea adalah perairan biasa di selatan Lawless Territories. Lebih jauh ke selatan, melampaui batas luarnya, terbentang Guixu Canghai—samudra kutub selatan yang sangat dingin dan termasuk kawasan paling berbahaya di dunia.",
      "Hubungan antarlokasi pada peta merupakan koridor relatif. Garis rute tidak otomatis menetapkan koordinat, jarak, durasi perjalanan, atau jaminan keamanan."
    ],
    sourcePath: "world/MAP_AND_REGIONS.md", sourceLabel: "Map & Regions"
  },
  {
    id: "history", title: "A History with Missing Pages", aliases: ["Ancient Golden Age", "Golden Age", "Opening of the Heaven Realm"],
    visibility: "PUBLISHED",
    category: "HISTORY", eyebrow: "HISTORICAL RECORD · 06", summary: "Sejarah dunia yang memiliki beberapa lapisan besar, tetapi belum membentuk kronologi lengkap.",
    paragraphs: [
      "Catatan sejarah Merzkava mengakui keberadaan peradaban kuno yang menghasilkan benda-benda yang kini digolongkan sebagai Ancient Artifacts. Identitas, struktur politik, teknologi, dan penyebab kemundurannya belum diketahui secara utuh.",
      "Heaven Realm pernah terbuka pada masa lampau. Peristiwa itu berkaitan dengan kemunculan material unik yang menjadi asal mata uang Ancient Zun. Waktu tepat, pelaku, penyebab, dan dampak luas pembukaan tersebut belum ditetapkan.",
      "Tradisi Arcanistry berasal dari Tianhai Yunzhou. Pengetahuan ini kemudian menyebar melalui pertukaran dengan wilayah lain, termasuk Golden Dragon Empire.",
      "World Knowledge Tower dikenal sebagai relik ilahi kuno dari Early Golden Age. Sejumlah fakta sejarah masih berupa kerangka; klaim, legenda, hipotesis, dan bukti terverifikasi harus dibedakan."
    ],
    sourcePath: "world/HISTORY.md", sourceLabel: "World History"
  },
  {
    id: "peoples", title: "Peoples of Merzkava", aliases: ["Intelligent Peoples", "half-beast", "bangsa setengah makhluk", "manusia"],
    visibility: "PUBLISHED",
    category: "PEOPLES", eyebrow: "CULTURAL INDEX · 07", summary: "Dunia Merzkava dihuni beragam bangsa berakal dengan ciri fisik, tradisi, persebaran, dan pengalaman sosial yang berbeda.",
    paragraphs: [
      "Merzkava bukan dunia yang dihuni satu jenis manusia saja. Berbagai bangsa berakal hidup di wilayah-wilayahnya, dengan ciri dan latar budaya yang tidak selalu sama.",
      "Persebaran suatu bangsa dapat dipengaruhi sejarah keluarga, migrasi, lingkungan, komunitas, dan hubungan antardaerah. Satu wilayah tidak otomatis dihuni satu ras atau satu kelompok budaya saja.",
      "Hubungan sosial antarkelompok juga tidak seragam. Penerimaan, prasangka, kebijakan lokal, dan kebiasaan masyarakat dapat berbeda dari satu kekuasaan atau permukiman ke tempat lain.",
      "Deskripsi ini merupakan pengantar budaya. Identitas individu dan perlakuan terhadapnya harus mengikuti profil serta konteks wilayah yang relevan."
    ],
    sourcePath: "world/INTELLIGENT_PEOPLES.md", sourceLabel: "Intelligent Peoples"
  },
  {
    id: "factions", title: "Organizations & Factions", aliases: [],
    visibility: "PUBLISHED",
    category: "FACTIONS", eyebrow: "POWER NETWORK · 08", summary: "Organisasi lintas wilayah, lembaga pelayanan, kelompok pengetahuan, serikat, dan kekuatan yang beroperasi di luar pemerintahan formal.",
    paragraphs: [
      "Kehidupan Merzkava dibentuk bukan hanya oleh negara. Klan, sekte, akademi, guild, perkumpulan profesi, dan organisasi lintas wilayah memiliki pengaruh dalam bidang masing-masing.",
      "Medicine Hall Society dikenal sebagai jaringan medis netral yang tersebar di berbagai wilayah. Spirit Hunters Guild menyediakan jaringan kontrak dan pekerjaan lintas bidang; aktivitasnya tidak terbatas pada perburuan Spirit Beast.",
      "Ordo Suci Tianming memiliki mandat yang berhubungan dengan keselamatan dunia dan deteksi anomali. World Knowledge Tower terhubung dengan penilaian ancaman tingkat dunia.",
      "Setiap organisasi memiliki ruang lingkup, kepentingan, dan batas kewenangan sendiri. Nama yang terdengar besar tidak otomatis berarti organisasi tersebut menguasai suatu wilayah."
    ],
    sourcePath: "world/FACTIONS.md", sourceLabel: "Factions & Organizations"
  },
  {
    id: "ruined-archiver", title: "Ruined Archiver", aliases: [],
    visibility: "PUBLISHED",
    category: "ARCHIVES", eyebrow: "FIELD INTELLIGENCE · 09", summary: "Cabang khusus Ordo Suci Tianming yang mengelola registrasi ekspedisi, pemetaan reruntuhan, verifikasi temuan, dan pelaporan anomali.",
    paragraphs: [
      "Ruined Archiver adalah cabang spesialis Ordo Suci Tianming, bukan guild independen. Fokusnya adalah informasi yang berasal dari Golden Age Ruined: pendaftaran ekspedisi, peta, laporan penjelajahan, kesaksian, artefak, prasasti, dan petunjuk anomali.",
      "Cabang Ruined Archiver hadir di setiap kota. Anggotanya mengenakan seragam cokelat muda yang seragam. Mereka menangani registrasi lokal, penerimaan laporan, pencatatan awal, kompensasi, dan koordinasi verifikasi lapangan.",
      "Organisasi ini tidak menganggap setiap reruntuhan pasti menyimpan ancaman. Bukti dikumpulkan dan diverifikasi; laporan yang belum pasti tetap dicatat sebagai klaim atau dugaan, bukan fakta.",
      "Tujuan akhirnya adalah membantu mendeteksi anomali berbahaya sedini mungkin dan meneruskan temuan yang kredibel kepada jalur penilaian Ordo serta pihak yang berwenang."
    ],
    sourcePath: "world/RUINED_ARCHIVER.md", sourceLabel: "Ruined Archiver"
  },
  {
    id: "medicine-hall", title: "Medicine Hall Society", aliases: ["Medicine Hall", "tabib", "jaringan medis"],
    visibility: "PUBLISHED",
    category: "FACTIONS", eyebrow: "NEUTRAL MEDICAL NETWORK · 10", summary: "Jaringan pelayanan medis netral yang beroperasi lintas wilayah.",
    paragraphs: [
      "Medicine Hall Society merupakan jaringan medis netral yang dikenal di berbagai bagian dunia. Keberadaannya menjadi salah satu penghubung penting bagi masyarakat yang membutuhkan pertolongan dan layanan pengobatan.",
      "Netralitas jaringan ini membedakannya dari organisasi yang berorientasi pada perebutan wilayah atau kekuatan politik. Rincian cabang, layanan, dan kewenangan setempat tetap mengikuti dokumen organisasi dan konteks wilayah.",
      "Keberadaan tabib atau fasilitas medis tidak otomatis menjamin semua penyakit, cedera, atau kondisi dapat disembuhkan. Informasi layanan harus dibedakan dari hasil yang belum diketahui."
    ],
    sourcePath: "world/FACTIONS.md", sourceLabel: "Factions & Organizations"
  },
  {
    id: "artifacts", title: "Artifacts & Relics", aliases: ["Ancient Artifacts", "Artificial Artifact", "Artificial Artifacts", "Relic", "artefak kuno", "artefak buatan"],
    visibility: "PUBLISHED",
    category: "ARCHIVES", eyebrow: "OBJECTS OF INTEREST · 11", summary: "Benda peninggalan peradaban lampau dan artefak buatan yang memiliki sejarah, fungsi, serta asal-usul berbeda.",
    paragraphs: [
      "Dalam catatan Merzkava, artefak kuno dan artefak buatan merupakan dua ranah yang perlu dibedakan. Benda kuno dapat berasal dari peradaban masa lampau, sedangkan artefak buatan terkait pengetahuan dan proses penciptaan yang berkembang pada masa yang lebih dikenal.",
      "Relik dapat dikaitkan dengan warisan ilahi atau peristiwa sejarah penting, tetapi klaim asal-usul harus didukung bukti. Tidak semua benda aneh berasal dari Ancient Golden Age dan tidak semua artefak memiliki fungsi yang telah dipahami.",
      "Appraisal, provenance, kondisi, dan konteks penemuan menjadi bagian penting dalam memahami sebuah benda. Label atau legenda yang melekat pada artefak belum tentu membuktikan seluruh kemampuannya."
    ],
    sourcePath: "world/ARTIFACTS_AND_RELICS.md", sourceLabel: "Artifacts & Relics"
  },
  {
    id: "arcanistry", title: "Arcanistry & the Art of Making", aliases: ["Arcanist", "Arcanistry"],
    visibility: "PUBLISHED",
    category: "CULTURE", eyebrow: "KNOWLEDGE & CRAFT · 13", summary: "Tradisi keilmuan dan teknologi artefak yang berakar di Tianhai Yunzhou dan berkembang melalui pertukaran pengetahuan.",
    paragraphs: [
      "Arcanistry adalah disiplin keilmuan independen yang berakar di Tianhai Yunzhou. Perkembangannya memberi wilayah tersebut pengaruh budaya dan teknologi yang khas.",
      "Sejarah dunia mencatat penyebaran pengetahuan Arcanistry melalui pertukaran dengan kekuasaan lain, termasuk Golden Dragon Empire. Perkembangan ini menjadi salah satu jalur hubungan antarkawasan.",
      "Arcanistry memiliki sejarah, institusi, dan budaya keilmuan sendiri. Penjelasan dalam arsip ini berfokus pada konteks dunia; proses, syarat, tingkatan, dan hasil mekaniknya tetap berada di dokumen aturan resmi."
    ],
    sourcePath: "world/HISTORY.md", sourceLabel: "World History"
  },
  {
    id: "jun-haotian", title: "Jun Haotian", aliases: ["君昊天", "Emperor Jun Haotian"],
    visibility: "PUBLISHED",
    category: "PEOPLES", eyebrow: "IMPERIAL HOUSEHOLD · CHARACTER FILE", summary: "Kaisar Golden Dragon Empire dan kepala keluarga kekaisaran Jun.",
    paragraphs: [
      "Jun Haotian tercatat sebagai Kaisar Golden Dragon Empire. Kedudukannya menempatkannya pada pusat pemerintahan kekaisaran di Longyuan.",
      "Register karakter resmi mencatatnya sebagai ayah Jun Ruiyuan dan Jun Yuejin, serta suami Shen Yuehua. Kediaman kekaisaran yang tepat belum ditetapkan dalam catatan publik.",
      "Detail kepribadian, agenda pribadi, dan keputusan yang belum tercatat tidak boleh disimpulkan hanya dari gelar kekaisarannya."
    ],
    sourcePath: "regions/golden-dragon-empire/npcs/JUN_HAOTIAN.md", sourceLabel: "Jun Haotian · Canonical NPC Profile"
  },
  {
    id: "shen-yuehua", title: "Shen Yuehua", aliases: ["沈月华", "Empress Shen Yuehua"],
    visibility: "PUBLISHED",
    category: "PEOPLES", eyebrow: "IMPERIAL HOUSEHOLD · CHARACTER FILE", summary: "Permaisuri Golden Dragon Empire dan anggota cabang utama keluarga Shen.",
    paragraphs: [
      "Shen Yuehua tercatat sebagai Permaisuri Golden Dragon Empire dan anggota cabang utama keluarga Shen.",
      "Ia merupakan istri Jun Haotian serta ibu Jun Ruiyuan dan Jun Yuejin. Longyuan adalah wilayah afiliasi keluarga kekaisaran; lokasi kediaman pribadinya tidak ditentukan secara rinci.",
      "Informasi yang belum tercatat mengenai watak, agenda, dan aktivitas pribadinya tetap dibiarkan terbuka."
    ],
    sourcePath: "regions/golden-dragon-empire/npcs/SHEN_YUEHUA.md", sourceLabel: "Shen Yuehua · Canonical NPC Profile"
  },
  {
    id: "jun-ruiyuan", title: "Jun Ruiyuan", aliases: ["君睿渊", "Crown Prince Jun Ruiyuan"],
    visibility: "PUBLISHED",
    category: "PEOPLES", eyebrow: "IMPERIAL HOUSEHOLD · CHARACTER FILE", summary: "Putra tertua keluarga kekaisaran Jun dan Putra Mahkota Golden Dragon Empire.",
    paragraphs: [
      "Jun Ruiyuan tercatat sebagai Putra Mahkota dan anak tertua Jun Haotian serta Shen Yuehua.",
      "Afiliasi wilayahnya adalah Longyuan. Catatan resmi tidak menetapkan kediaman persis maupun seluruh kegiatan hariannya.",
      "Gelar Putra Mahkota menjelaskan kedudukan publiknya, bukan bukti otomatis tentang sifat, kemampuan, atau keputusan yang belum tercatat."
    ],
    sourcePath: "regions/golden-dragon-empire/npcs/JUN_RUIYUAN.md", sourceLabel: "Jun Ruiyuan · Canonical NPC Profile"
  },
  {
    id: "jun-yuejin", title: "Jun Yuejin", aliases: ["君月瑾", "Princess Jun Yuejin"],
    visibility: "PUBLISHED",
    category: "PEOPLES", eyebrow: "IMPERIAL HOUSEHOLD · CHARACTER FILE", summary: "Putri kekaisaran Golden Dragon Empire, anak kedua Jun Haotian dan Shen Yuehua.",
    paragraphs: [
      "Jun Yuejin adalah putri kekaisaran dan anak kedua Jun Haotian serta Shen Yuehua.",
      "Kedudukannya dalam keluarga kekaisaran tercatat dalam profil kanonis. Rincian kehidupan pribadi dan aktivitas yang belum ditetapkan tetap dibiarkan terbuka.",
      "Longyuan merupakan wilayah rumah keluarganya. Lokasi kediaman kekaisaran secara tepat belum dicatat."
    ],
    sourcePath: "regions/golden-dragon-empire/npcs/JUN_YUEJIN.md", sourceLabel: "Jun Yuejin · Canonical NPC Profile"
  },
  {
    id: "ji-haoyuan", title: "Ji Haoyuan", aliases: ["姬浩远", "Maharaja Ji Haoyuan"],
    visibility: "PUBLISHED",
    category: "PEOPLES", eyebrow: "TIANHAI RULING FAMILY · CHARACTER FILE", summary: "Maharaja Tianhai Yunzhou dari keluarga penguasa Ji.",
    paragraphs: [
      "Ji Haoyuan tercatat sebagai Maharaja Tianhai Yunzhou dan anggota keluarga penguasa Ji.",
      "Yunxiao Terrace merupakan kawasan pemerintahan resmi Tianhai. Namun, lokasi keberadaan pribadinya saat ini tidak otomatis dapat disimpulkan dari kedudukan tersebut.",
      "Profil kanonis menjadi rujukan untuk fakta publik tentang dirinya. Detail yang belum ditetapkan tidak diisi dengan dugaan."
    ],
    sourcePath: "regions/tianhai-yunzhou/npcs/JI_HAOYUAN.md", sourceLabel: "Ji Haoyuan · Canonical NPC Profile"
  },
  {
    id: "bai-xuanyin", title: "Bai Xuanyin", aliases: ["白玄音"],
    visibility: "PUBLISHED",
    category: "PEOPLES", eyebrow: "TIANHAI HISTORY · CHARACTER FILE", summary: "Tokoh perempuan yang dihormati di Tianhai, dikenang sebagai pahlawan dan pencipta Artificial Artifact; telah wafat.",
    paragraphs: [
      "Bai Xuanyin dikenang sebagai tokoh perempuan penting dalam sejarah Tianhai Yunzhou.",
      "Ia dikenal sebagai pencipta Artificial Artifact dan wafat pada masa Great Tianhai War. Riwayatnya menjadi bagian dari ingatan sejarah serta perkembangan pengetahuan artefak di Tianhai.",
      "Rincian karya, blueprint, dan peristiwa sejarah yang berkaitan dengannya harus mengikuti profil serta dokumen artefak resmi."
    ],
    sourcePath: "regions/tianhai-yunzhou/npcs/BAI_XUANYIN.md", sourceLabel: "Bai Xuanyin · Canonical NPC Profile"
  },
  {
    id: "ji-zhaoning", title: "Ji Zhaoning", aliases: ["姬昭宁"],
    visibility: "PUBLISHED",
    category: "PEOPLES", eyebrow: "TIANHAI RULING FAMILY · CHARACTER FILE", summary: "Putri kembar yang lebih tua dalam keluarga penguasa Ji, dengan fokus pada pengembangan Arcanist.",
    paragraphs: [
      "Ji Zhaoning adalah putri kembar yang lebih tua dalam keluarga penguasa Tianhai Yunzhou.",
      "Fokus yang tercatat untuknya adalah pengembangan Arcanistry. Detail institusi, agenda pribadi, dan lokasi terkini tidak boleh diasumsikan bila belum tercatat.",
      "Hubungan keluarganya dan status publiknya mengikuti profil kanonis."
    ],
    sourcePath: "regions/tianhai-yunzhou/npcs/JI_ZHAONING.md", sourceLabel: "Ji Zhaoning · Canonical NPC Profile"
  },
  {
    id: "ji-ningzhao", title: "Ji Ningzhao", aliases: ["姬宁昭"],
    visibility: "PUBLISHED",
    category: "PEOPLES", eyebrow: "TIANHAI RULING FAMILY · CHARACTER FILE", summary: "Putri kembar yang lebih muda dalam keluarga penguasa Ji dan seorang kultivator yang telah Awakening.",
    paragraphs: [
      "Ji Ningzhao adalah putri kembar yang lebih muda dalam keluarga penguasa Tianhai Yunzhou dan dikenal memiliki kecerdasan luar biasa.",
      "Detail kehidupan pribadi, agenda, dan aktivitas yang belum ditetapkan tidak boleh disimpulkan dari status keluarganya."
    ],
    sourcePath: "regions/tianhai-yunzhou/npcs/JI_NINGZHAO.md", sourceLabel: "Ji Ningzhao · Canonical NPC Profile"
  },
  {
    id: "beiming-han", title: "Beiming Han", aliases: ["北冥寒", "Leluhur Utara"],
    visibility: "PUBLISHED",
    category: "PEOPLES", eyebrow: "BEIMING GU · CHARACTER FILE", summary: "Leluhur Utara dan figur tertinggi Beiming Gu yang dikenal dalam catatan publik.",
    paragraphs: [
      "Beiming Han dikenal dengan gelar Leluhur Utara dan tercatat sebagai figur tertinggi Beiming Gu. Ia merupakan bagian dari garis pendiri kekuasaan utara.",
      "Ia dikenal sebagai ayah angkat Beiming Xenhwa dan Beiming Jingheng.",
      "Keberadaan afiliasi Beiming Gu tidak memastikan lokasi fisiknya setiap saat. Informasi yang secara khusus dibatasi untuk GM tidak ditampilkan dalam arsip publik ini."
    ],
    sourcePath: "regions/beiming-gu/npcs/BEIMING_HAN.md", sourceLabel: "Beiming Han · Canonical NPC Profile"
  },
  {
    id: "beiming-xenhwa", title: "Beiming Xenhwa", aliases: ["北冥玄华"],
    visibility: "PUBLISHED",
    category: "PEOPLES", eyebrow: "BEIMING GU · CHARACTER FILE", summary: "Putri angkat Beiming Han, seorang half-beast dengan ciri rubah berekor sembilan putih.",
    paragraphs: [
      "Beiming Xenhwa tercatat sebagai putri angkat Beiming Han dan merupakan half-beast dengan ciri white nine-tailed fox.",
      "Afiliasinya adalah Beiming Gu, tetapi keberadaan fisiknya saat ini tidak boleh ditebak.",
      "Detail kemampuan, batas pribadi, dan hubungan lain harus mengikuti profil lengkapnya."
    ],
    sourcePath: "regions/beiming-gu/npcs/BEIMING_XENHWA.md", sourceLabel: "Beiming Xenhwa · Canonical NPC Profile"
  },
  {
    id: "floating-island-artifact", title: "Floating Island Support Artifact", aliases: ["Tianhai floating island"],
    visibility: "PUBLISHED",
    category: "ARCHIVES", eyebrow: "ARTIFICIAL ARTIFACT · OBJECT FILE", summary: "Artefak buatan yang menopang keberadaan pulau terapung Tianhai Yunzhou.",
    paragraphs: [
      "Tianhai Yunzhou ditopang oleh sebuah Artificial Artifact. Fungsi yang telah dikonfirmasi adalah mempertahankan keberadaan pulau raksasa terapung tersebut.",
      "Artefak ini merupakan aset strategis bagi kekuasaan maritim. Sumber lore mengaitkan sistem penopangnya dengan energi cair hasil pemurnian Tianhai dari material energi tertentu.",
      "Pembuat, susunan internal, kebutuhan perawatan, titik lemah, dan fungsi tambahan yang belum dicatat tetap tidak diketahui. Fungsi penopang pulau tidak boleh diperluas menjadi kemampuan tempur atau teleportasi tanpa bukti."
    ],
    sourcePath: "world/ARTIFICIAL_ARTIFACTS.md", sourceLabel: "Artificial Artifacts"
  },
  {
    id: "world-knowledge-tower", title: "World Knowledge Tower", aliases: ["Tower Relic", "Menara Pengetahuan Dunia"],
    visibility: "PUBLISHED",
    category: "ARCHIVES", eyebrow: "ANCIENT RELIC · OBJECT FILE", summary: "Relik ilahi kuno dari Early Golden Age yang terhubung dengan jaringan pengetahuan dan penilaian ancaman dunia.",
    paragraphs: [
      "World Knowledge Tower dikenal sebagai relik ilahi kuno dari Early Golden Age. Ia memiliki kedudukan penting dalam jaringan pengetahuan dan respons terhadap ancaman yang dapat membahayakan dunia.",
      "Menara ini tidak dimiliki oleh satu keluarga atau organisasi. Administrasi, perlindungan, pemeliharaan, dan studi yang diizinkan memiliki pembagian tanggung jawab tersendiri.",
      "Asal-usul lengkap, mekanisme, dan seluruh kemampuan relik tidak boleh diasumsikan hanya dari statusnya sebagai peninggalan ilahi."
    ],
    sourcePath: "world/WANLUO_SACRED_EXPANSE.md", sourceLabel: "Wanluo Sacred Expanse & World Knowledge Tower"
  },
  {
    id: "black-tide-expanse", title: "Black Tide Expanse", aliases: [],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "LAWLESS MARITIME REGION · 14", summary: "Kawasan pulau-pulau terpencil dan jalur laut di luar kendali langsung Tianhai Yunzhou.",
    paragraphs: [
      "Black Tide Expanse merupakan bagian dari Lawless Territories, terdiri dari pulau-pulau terpencil dan jalur laut yang berada di luar kendali langsung Tianhai Yunzhou. Wilayah ini bukan negara atau pemerintahan tunggal.",
      "Empat permukiman yang tercatat adalah Saltwind Village, Driftwood Haven, Mistbell Village, dan Redwake Village. Nama-nama tersebut tidak dengan sendirinya menetapkan penguasa, hubungan politik, atau kendali atas wilayah sekitarnya.",
      "Rincian medan, batas, wilayah tetangga, dan rute antarpulau belum ditetapkan secara lengkap. Garis hubungan pada peta tidak menjamin adanya jalur pelayaran yang disurvei atau aman."
    ],
    sourcePath: "world/REGION_BLACK_TIDE_EXPANSE.md", sourceLabel: "Black Tide Expanse Regional Reference"
  },
  {
    id: "ashen-borderlands", title: "Ashen Borderlands", aliases: [],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "LAWLESS WESTERN REGION · 15", summary: "Kawasan di luar perbatasan barat dan barat daya Golden Dragon Empire.",
    paragraphs: [
      "Ashen Borderlands berada di luar perbatasan barat dan barat daya Golden Dragon Empire, dalam kerangka luas Lawless Territories. Wilayah ini tidak memiliki satu pemerintahan terpadu yang telah ditetapkan.",
      "Permukiman yang tercatat adalah Greyrock Village, Blackreed Village, Broken Bell Village, dan Dust Lantern Village. Keberadaan permukiman tersebut tidak membuktikan adanya jalan langsung, layanan tertentu, atau penguasa bersama.",
      "Detail medan, batas wilayah, rute, jarak, dan durasi perjalanan masih terbuka. Informasi yang belum tercatat tidak boleh diisi dengan perkiraan yang disajikan sebagai fakta."
    ],
    sourcePath: "world/REGION_ASHEN_BORDERLANDS.md", sourceLabel: "Ashen Borderlands Regional Reference"
  },
  {
    id: "nine-frost-wastes", title: "Nine Frost Wastes", aliases: [],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "NORTHERN WILDERNESS · 16", summary: "Kawasan liar utara di luar pertahanan resmi Beiming Gu.",
    paragraphs: [
      "Nine Frost Wastes merupakan kawasan liar di utara, berada di luar pertahanan resmi Beiming Gu. Wilayah ini termasuk kerangka geografis Lawless Territories, bukan distrik administratif Beiming Gu.",
      "Empat permukiman yang tercatat adalah Snowmelt Village, Frost Hollow Village, Ironpine Village, dan White Cairn Village.",
      "Rincian penduduk, tata kelola, medan lokal, batas, dan jalur perjalanan belum ditetapkan secara lengkap. Hubungan geografis pada peta tidak otomatis membuktikan adanya jalan langsung di antara semua permukiman."
    ],
    sourcePath: "world/REGION_NINE_FROST_WASTES.md", sourceLabel: "Nine Frost Wastes Regional Reference"
  },
  {
    id: "southwake-lanternhook", title: "Southwake Port & Lanternhook Isles", aliases: ["Southwake Port", "Lanternhook Isles", "Red Lantern Cay", "Bitterglass Isle", "Dicewake Isle"],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "SOUTHERN LAWLESS COAST · 17", summary: "Pelabuhan pesisir selatan Lawless dan gugusan pulau di perairan biasa Black Tide Sea.",
    paragraphs: [
      "Southwake Port berada di pesisir selatan Lawless Territories dan menjadi pelabuhan yang tercatat untuk lalu lintas di Black Tide Sea. Pelabuhan ini bukan bagian dari Guixu Canghai; samudra berbahaya tersebut baru dimulai setelah batas selatan Black Tide Sea.",
      "Lanternhook Isles adalah gugusan pulau di perairan biasa Black Tide Sea. Tiga lokasi yang dikenal adalah Red Lantern Cay, Bitterglass Isle, dan Dicewake Isle, masing-masing memiliki reputasi sebagai tempat hiburan, layanan medis independen, dan kegiatan taruhan.",
      "Pelabuhan dan kepulauan ini tidak berada di bawah satu pemerintahan Lawless yang terpadu. Pengaturan lokal bergantung pada operator dan keadaan setempat; biaya, jadwal kapal, koordinat, serta jaminan keselamatan tidak ditetapkan."
    ],
    sourcePath: "world/LAWLESS_SOUTHERN_PORT_AND_ISLES.md", sourceLabel: "Lawless Southern Port & Isles"
  },
  {
    id: "wanluo", title: "Wanluo Sacred Expanse", aliases: ["Wanluo", "Sacred Domain of Wanluo"],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "SACRED REGION · 18", summary: "Wilayah suci di sekitar World Knowledge Tower, dengan lanskap pegunungan, hutan, dataran luas, dan jalur ziarah.",
    paragraphs: [
      "Wanluo Sacred Expanse adalah wilayah yang mengelilingi World Knowledge Tower. Nama wilayah ini tidak sama dengan nama relik menara atau kompleks keagamaan yang berada di dalamnya.",
      "Lanskapnya mencakup pegunungan dan hutan kuno, lembah, aliran air, danau kecil, dataran hijau, serta jalur pendekatan dan tempat persinggahan. Bentuk geografis tersebut merupakan gambaran kawasan, bukan batas wilayah yang telah diukur.",
      "Sanctum of Ten Thousand Vows merupakan kompleks keagamaan dan pusat Ordo Suci Tianming yang terpisah dari relik World Knowledge Tower. Koordinat, jarak, dan posisi tepat Wanluo terhadap tiga kekuasaan besar belum ditetapkan."
    ],
    sourcePath: "world/WANLUO_SACRED_EXPANSE.md", sourceLabel: "Wanluo Sacred Expanse"
  },
  {
    id: "ordo-suci-tianming", title: "Ordo Suci Tianming", aliases: [],
    visibility: "PUBLISHED",
    category: "FACTIONS", eyebrow: "WORLD RELIGIOUS ORGANIZATION · 19", summary: "Organisasi keagamaan terbesar berdasarkan jumlah pengikut, dengan mandat pelayanan spiritual dan deteksi dini ancaman dunia.",
    paragraphs: [
      "Ordo Suci Tianming merupakan organisasi keagamaan terbesar di dunia berdasarkan jumlah pengikut dalam latar saat ini. Mandatnya mencakup pelayanan spiritual, pengelolaan situs sucinya sendiri, serta penerimaan dan verifikasi laporan anomali yang berpotensi mengancam kelangsungan dunia.",
      "Pusat keagamaannya berada di Sanctum of Ten Thousand Vows, sebuah kompleks yang terpisah dari World Knowledge Tower. Ordo turut mengelola urusan menara bersama pihak lain, tetapi tidak memiliki menara sebagai miliknya.",
      "Ordo bukan organisasi yang serba tahu dan tidak memiliki kewenangan penegakan hukum universal. Laporan perlu diverifikasi, dan respons dapat dipengaruhi jarak, keterlambatan informasi, kepentingan politik, serta sumber daya yang tersedia."
    ],
    sourcePath: "world/FACTIONS.md", sourceLabel: "Factions & Organizations"
  },
  {
    id: "spirit-hunters-guild", title: "Spirit Hunters Guild", aliases: [],
    visibility: "PUBLISHED",
    category: "FACTIONS", eyebrow: "CONTRACT & JOB NETWORK · 20", summary: "Guild kontrak dan pekerjaan lintas bidang yang melayani kelompok maupun individu di berbagai wilayah.",
    paragraphs: [
      "Spirit Hunters Guild adalah organisasi kontrak dan pekerjaan, bukan guild yang hanya menangani perburuan Spirit Beast. Papan kontraknya dapat mencakup pengawalan, pengangkutan barang, pencarian benda, pengintaian, pengambilan kembali barang, perlindungan, pengumpulan informasi, serta pelacakan atau perburuan.",
      "Guild mendukung pendaftaran kontrak sementara dan kelompok dengan anggota dari latar berbeda. Kehadiran cabang atau meja layanan harus mengikuti catatan wilayah setempat.",
      "Guild bukan pemerintahan atau kepolisian universal. Jangkauan, staf, aturan, dan pengaruhnya dapat berbeda menurut wilayah; tidak ada jaminan bahwa setiap kontrak tersedia atau dapat ditegakkan di semua tempat."
    ],
    sourcePath: "world/SPIRIT_HUNTERS_GUILD.md", sourceLabel: "Spirit Hunters Guild"
  },

];

const ARCHIVE_SOURCE_COMMIT = "2f76a864150528afb0e3d26cb16f9396ce610ff6";
const ARCHIVE_REVIEWED_AT = "2026-11-01";

export const LORE_ENTRIES: LoreEntry[] = LORE_ENTRY_DRAFTS.map(entry => ({
  ...entry,
  sourceCommit: ARCHIVE_SOURCE_COMMIT,
  reviewedAt: ARCHIVE_REVIEWED_AT,
  crossReferenceIds: []
}));

function hasLoreReference(text: string, label: string): boolean {
  const lowerText = text.toLocaleLowerCase();
  const lowerLabel = label.toLocaleLowerCase();
  const wordLike = /[\p{L}\p{N}_]/u;
  let cursor = 0;
  while (cursor < lowerText.length) {
    const index = lowerText.indexOf(lowerLabel, cursor);
    if (index < 0) return false;
    const before = index > 0 ? text[index - 1] : "";
    const after = text[index + label.length] ?? "";
    if (!((before && wordLike.test(before) && wordLike.test(label[0])) ||
          (after && wordLike.test(after) && wordLike.test(label[label.length - 1])))) return true;
    cursor = index + 1;
  }
  return false;
}

for (const entry of LORE_ENTRIES) {
  const articleText = entry.summary + " " + entry.paragraphs.join(" ");
  entry.crossReferenceIds = LORE_ENTRIES
    .filter(candidate => candidate.visibility === "PUBLISHED" && candidate.id !== entry.id)
    .filter(candidate => [candidate.title, ...candidate.aliases].some(label => hasLoreReference(articleText, label)))
    .map(candidate => candidate.id);
}

const CATEGORY_LABELS: Record<LoreCategory | "ALL", string> = {
  ALL: "All files", WORLD: "World", POWERS: "Powers", GEOGRAPHY: "Geography",
  HISTORY: "History", PEOPLES: "Peoples", FACTIONS: "Factions",
  ARCHIVES: "Archives", CULTURE: "Culture"
};

export function getPublicLoreEntries(): LoreEntry[] {
  return LORE_ENTRIES.filter(entry => entry.visibility === "PUBLISHED");
}

export function resolveLoreEntry(label: string, currentId?: string): LoreEntry | undefined {
  const query = label.trim().toLocaleLowerCase();
  if (!query) return undefined;
  const entries = getPublicLoreEntries().filter(entry => entry.id !== currentId);
  return entries.find(entry => entry.title.toLocaleLowerCase() === query)
    ?? entries.find(entry => entry.aliases.some(alias => alias.toLocaleLowerCase() === query));
}

let activeLoreCategory: LoreCategory | "ALL" = "ALL";
let activeLoreQuery = "";
let activeLoreId: string | null = null;

function escapeLore(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char] ?? char);
}

function loreLinks(text: string, currentId: string): string {
  const currentEntry = getPublicLoreEntries().find(entry => entry.id === currentId);
  const crossReferences = new Set(currentEntry?.crossReferenceIds ?? []);
  const references = getPublicLoreEntries().filter(entry => crossReferences.has(entry.id))
    .flatMap(entry => [
      { label: entry.title, id: entry.id, priority: 2 },
      ...entry.aliases.map(label => ({ label, id: entry.id, priority: 1 }))
    ])
    .sort((a, b) => b.label.length - a.label.length || b.priority - a.priority || a.id.localeCompare(b.id));
  let result = "";
  let cursor = 0;
  while (cursor < text.length) {
    let match: { index: number; label: string; id: string; priority: number } | null = null;
    for (const reference of references) {
      const index = text.toLocaleLowerCase().indexOf(reference.label.toLocaleLowerCase(), cursor);
      if (index < 0) continue;
      const before = index > 0 ? text[index - 1] : "";
      const after = text[index + reference.label.length] ?? "";
      const wordLike = /[\p{L}\p{N}_]/u;
      if ((before && wordLike.test(before) && wordLike.test(reference.label[0])) ||
          (after && wordLike.test(after) && wordLike.test(reference.label[reference.label.length - 1]))) continue;
      if (!match || index < match.index || (index === match.index && (reference.priority > match.priority || (reference.priority === match.priority && reference.label.length > match.label.length)))) {
        match = { index, label: reference.label, id: reference.id, priority: reference.priority };
      }
    }
    if (!match) { result += escapeLore(text.slice(cursor)); break; }
    result += escapeLore(text.slice(cursor, match.index));
    result += '<button class="lore-inline-link" type="button" data-lore-open="' + match.id + '">' + escapeLore(match.label) + '</button>';
    cursor = match.index + match.label.length;
  }
  return result;
}

export function setLoreSearch(value: string): void { activeLoreQuery = value; }
export function setLoreCategory(value: string): void {
  activeLoreCategory = value in CATEGORY_LABELS ? value as LoreCategory | "ALL" : "ALL";
  activeLoreId = null;
}
export function openLoreEntry(id: string): boolean {
  if (!getPublicLoreEntries().some(entry => entry.id === id)) return false;
  activeLoreId = id;
  return true;
}
export function closeLoreEntry(): void { activeLoreId = null; }

export function renderLoreResults(): string {
  const query = activeLoreQuery.trim().toLocaleLowerCase();
  const entries = getPublicLoreEntries().filter(entry =>
    (activeLoreCategory === "ALL" || entry.category === activeLoreCategory) &&
    (!query || [entry.title, entry.summary, entry.eyebrow, ...entry.aliases, ...entry.paragraphs].join(" ").toLocaleLowerCase().includes(query))
  );
  if (!entries.length) return '<div class="lore-empty"><span>⌕</span><h3>No matching records</h3><p>Coba kata kunci lain atau pilih kategori berbeda.</p></div>';
  return '<div class="lore-card-grid">' + entries.map((entry, index) =>
    '<button class="lore-entry-card" type="button" data-lore-open="' + entry.id + '">' +
      '<span class="lore-card-index">' + String(index + 1).padStart(2, "0") + ' / ' + entry.category + '</span>' +
      '<span class="lore-card-title">' + escapeLore(entry.title) + '</span>' +
      '<span class="lore-card-summary">' + escapeLore(entry.summary) + '</span>' +
      '<span class="lore-card-foot">' + escapeLore(entry.sourceLabel) + '<b>↗</b></span>' +
    '</button>'
  ).join("") + '</div>';
}

function renderLoreDetail(entry: LoreEntry): string {
  const relatedRecords = entry.crossReferenceIds
    .map(id => getPublicLoreEntries().find(item => item.id === id))
    .filter((item): item is LoreEntry => Boolean(item))
    .slice(0, 5);
  return '<article class="lore-detail">' +
    '<button class="lore-back" type="button" data-lore-back>← ARCHIVE INDEX</button>' +
    '<div class="lore-detail-top"><span>' + escapeLore(entry.eyebrow) + '</span><span>LOCAL DOSSIER</span></div>' +
    '<h2>' + escapeLore(entry.title) + '</h2>' +
    '<p class="lore-lede">' + loreLinks(entry.summary, entry.id) + '</p>' +
    entry.paragraphs.map((paragraph, index) => '<p class="lore-paragraph"><span class="lore-paragraph-mark">' + String(index + 1).padStart(2, "0") + '</span><span>' + loreLinks(paragraph, entry.id) + '</span></p>').join("") +
    '<div class="lore-source-card"><span class="lore-source-kicker">CANON REFERENCE</span><strong>' + escapeLore(entry.sourceLabel) + '</strong><code>' + escapeLore(entry.sourcePath) + '</code><small>Reviewed ' + escapeLore(entry.reviewedAt) + ' · Universe snapshot ' + escapeLore(entry.sourceCommit.slice(0, 7)) + '. Arsip lokal ini adalah ringkasan lore; aturan dan resolusi gameplay tetap merujuk repo canon.</small></div>' +
    '<div class="lore-related"><span class="lore-source-kicker">RELATED RECORDS</span>' +
    relatedRecords.map(item => '<button type="button" data-lore-open="' + item.id + '">' + escapeLore(item.title) + ' <b>↗</b></button>').join("") +
    '</div></article>';
}

export function renderLoreLibrary(): string {
  const active = activeLoreId ? getPublicLoreEntries().find(entry => entry.id === activeLoreId) : null;
  if (active) return renderLoreDetail(active);
  const publicEntries = getPublicLoreEntries();
  const categories = (Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>)
    .filter(category => category === "ALL" || publicEntries.some(entry => entry.category === category))
    .map(category =>
      '<button type="button" class="lore-category ' + (activeLoreCategory === category ? "is-active" : "") + '" data-lore-category="' + category + '">' + CATEGORY_LABELS[category] + '</button>'
    ).join("");
  return '<section class="lore-hero">' +
    '<div class="lore-hero-copy"><span class="lore-overline">MERZKAVA UNIVERSE · INTELLIGENCE ARCHIVE</span><h2>WORLD<br><em>ARCHIVE.</em></h2><p>Catatan tentang dunia, wilayah, bangsa, organisasi, dan kisah yang membentuk Merzkava.</p><div class="lore-hero-stamp"><span>LOCAL LIBRARY</span><b>FIELD NOTES · 001</b></div></div>' +
    '<div class="lore-hero-seal" aria-hidden="true"><span>✧</span><small>THE<br>KNOWN<br>WORLD</small></div>' +
    '</section>' +
    '<section class="lore-library-head"><div><span class="lore-overline">THE INDEX</span><h3>Explore the records</h3><p>Semua entri tersimpan di aplikasi dan dapat dibuka tanpa koneksi.</p></div><span class="lore-record-count">' + String(getPublicLoreEntries().length).padStart(2, "0") + '<small>FILES</small></span></section>' +
    '<label class="lore-search"><span>⌕</span><input id="lore-search" type="search" placeholder="Cari tempat, tokoh, organisasi…" value="' + escapeLore(activeLoreQuery) + '" autocomplete="off"><kbd>SEARCH</kbd></label>' +
    '<div class="lore-categories" role="group" aria-label="Lore categories">' + categories + '</div>' +
    '<div id="lore-results" class="lore-results">' + renderLoreResults() + '</div>' +
    '<p class="lore-footnote">LOCAL KNOWLEDGE BASE · GAMEPLAY AUTHORITY REMAINS IN THE OFFICIAL UNIVERSE REPOSITORY</p>';
}
