export type LoreCategory = "WORLD" | "POWERS" | "GEOGRAPHY" | "HISTORY" | "PEOPLES" | "FACTIONS" | "ARCHIVES" | "CULTURE";

export type LoreVisibility = "PUBLISHED" | "REVIEW_REQUIRED" | "GM_ONLY";

export type LoreEntityStatus = "ON_PLAN" | "NON_CANON";

export interface LorePlaceholder {
  id: string;
  title: string;
  aliases: string[];
  status: LoreEntityStatus;
  category: LoreCategory;
  summary: string;
  detail: string;
  relatedIds: string[];
  sourcePath?: string;
}

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
    id: "golden-dragon", title: "Golden Dragon Empire", aliases: ["Golden Dragon", "Kekaisaran Naga Emas"],
    visibility: "PUBLISHED",
    category: "POWERS", eyebrow: "EASTERN POWER · 01", summary: "Kekaisaran timur dengan pusat pemerintahan, jaringan administrasi luas, pertanian, pertambangan, pendidikan, dan pelabuhan.",
    paragraphs: [
      "Golden Dragon Empire menempati kawasan timur Merzkava. Kekuatannya bertumpu pada skala wilayah, administrasi sipil, mobilisasi, sumber daya, dan jaringan permukiman.",
      "Kekaisaran memiliki tujuh wilayah besar: Longyuan, Canglan, Jinyue, Tianfeng, Yanling, Baiyue, dan Xingluo. Struktur resminya mencakup dua belas prefektur, enam county circuit, serta tiga belas desa dalam register desa resmi.",
      "Huanglongcheng adalah pusat kekaisaran sekaligus ibu kota wilayah Longyuan. Kota ini menjadi simpul pemerintahan dan kehidupan elite. Sementara itu, Dongxing di Xingluo menjadi pelabuhan penting yang menghubungkan jalur pelayaran timur dengan wilayah lain.",
      "Karakter tiap wilayah berbeda: Longyuan berpusat pada istana dan politik; Canglan pada pertanian dan irigasi; Jinyue pada pertambangan serta logam spiritual; Tianfeng pada tradisi keilmuan; Yanling pada tungku dan pengerjaan; Baiyue pada pertahanan perbatasan; Xingluo pada perdagangan laut dan diplomasi.",
      "Roster pejabat publik juga mencatat Xuanyuan Wenyuan, Shen Mingde, Yunlan Qingzhi, Baihu Zhengyang, Gu Jingheng, Cangyue Yucheng, dan Heiyu Zhaolin pada jabatan pusat; serta Xuanyuan Haoran, Cangyue Yunhe, Tieyan Mingxuan, Yunlan Qinglan, Yanling Zhenyu, Baihu Xuefeng, dan Zhenhai Haixiu sebagai gubernur tujuh wilayah."
    ],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md", sourceLabel: "Golden Dragon Administrative Atlas"
  },
  {
    id: "region-longyuan", title: "Longyuan — Imperial Heartland", aliases: ["Longyuan", "Imperial Heartland"],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "GOLDEN DRAGON REGION · 01", summary: "Jantung pemerintahan Golden Dragon Empire, pusat istana, administrasi kekaisaran, dan lembaga politik.",
    paragraphs: [
      "Longyuan adalah wilayah inti Golden Dragon Empire. Identitasnya berpusat pada istana kekaisaran, administrasi pusat, bangsawan, dan lembaga politik.",
      "Huanglongcheng menjadi ibu kota kekaisaran sekaligus kursi administrasi Longyuan. Imperial Dragon Road menghubungkan Huanglongcheng dan Yuxi; jarak serta durasi perjalanan belum ditetapkan.",
      "Estimasi perencanaan mencatat sekitar 44 juta penduduk, luas sekitar 1,26 juta km², dan kepadatan rata-rata sekitar 35 jiwa/km². Luas dan kepadatan merupakan asumsi perencanaan, bukan hasil survei batas atau sensus terukur.",
      "Longyuan memiliki dua prefektur: Huanglong Prefecture dan Jade Seal Prefecture. Keduanya berada dalam Imperial Heartland Circuit."
    ],
    sourcePath: "world/REGION_LONGYUAN.md", sourceLabel: "Longyuan Regional Reference"
  },
  {
    id: "region-canglan", title: "Canglan — Riverlands", aliases: ["Canglan", "Riverlands"],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "GOLDEN DRAGON REGION · 02", summary: "Wilayah sungai yang dikenal melalui pertanian, irigasi, transportasi sungai, dan perdagangan pedalaman.",
    paragraphs: [
      "Canglan merupakan wilayah produktif di Golden Dragon Empire dengan identitas pertanian, irigasi, transportasi sungai, dan perdagangan pedalaman.",
      "Qinghe menjadi kursi administrasi regional. Qinghe Prefecture dan Jiangbei Prefecture berada dalam Riverlands Circuit; Twin River Route menghubungkan Qinghe dan Jiangbei, sementara kondisi jalur sungai dan jalan lokal dapat berubah menurut musim.",
      "Estimasi perencanaan mencatat sekitar 64 juta penduduk, luas sekitar 1,42 juta km², dan kepadatan rata-rata sekitar 45 jiwa/km². Luas dan kepadatan merupakan asumsi perencanaan, bukan hasil survei batas atau sensus terukur."
    ],
    sourcePath: "world/REGION_CANGLAN.md", sourceLabel: "Canglan Regional Reference"
  },
  {
    id: "region-jinyue", title: "Jinyue — Mineral Lands", aliases: ["Jinyue", "Mineral Lands"],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "GOLDEN DRAGON REGION · 03", summary: "Wilayah sumber daya yang berpusat pada pertambangan, logam spiritual, dan bahan untuk artefak serta perlengkapan.",
    paragraphs: [
      "Jinyue adalah wilayah sumber daya Golden Dragon Empire. Identitasnya bertumpu pada pertambangan, logam spiritual, dan bahan untuk artefak serta perlengkapan.",
      "Yumai menjadi kursi administrasi regional. Jadevein Prefecture dan Ironcloud Prefecture berada dalam Mineral Lands Circuit. Ore Vein Road menghubungkan Yumai dan Tieyun; jalur cabang pertambangan belum ditetapkan secara rinci.",
      "Estimasi perencanaan mencatat sekitar 32 juta penduduk, luas sekitar 1,78 juta km², dan kepadatan rata-rata sekitar 18 jiwa/km². Luas dan kepadatan merupakan asumsi perencanaan, bukan hasil survei batas atau sensus terukur."
    ],
    sourcePath: "world/REGION_JINYUE.md", sourceLabel: "Jinyue Regional Reference"
  },
  {
    id: "region-tianfeng", title: "Tianfeng — Scholarly Heights", aliases: ["Tianfeng", "Scholarly Heights"],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "GOLDEN DRAGON REGION · 04", summary: "Wilayah tradisi keilmuan, pengembangan talenta, literasi, arsip, dan pertukaran pengetahuan.",
    paragraphs: [
      "Tianfeng dikenal melalui tradisi keilmuan, pengembangan talenta, literasi, arsip, dan pertukaran pengetahuan. Wilayah ini menjadi sumber siswa berbakat bagi dua Cultivator Academies pusat di Huanglongcheng.",
      "Tidak ada Cultivator Academy yang ditetapkan berada di Tianfeng. Pembelajaran lokal bertumpu pada tradisi keilmuan, tutor, dan kegiatan pendidikan informal yang tercatat dalam sumber regional.",
      "Tianshu menjadi kursi administrasi regional. Heavenly Script Prefecture dan Cloud Summit Prefecture berada dalam Scholarly Heights Circuit; Cloudstep Scholar Road menghubungkan Tianshu dan Yunding.",
      "Estimasi perencanaan mencatat sekitar 40 juta penduduk, luas sekitar 1,33 juta km², dan kepadatan rata-rata sekitar 30 jiwa/km². Luas dan kepadatan merupakan asumsi perencanaan, bukan hasil survei batas atau sensus terukur."
    ],
    sourcePath: "world/REGION_TIANFENG.md", sourceLabel: "Tianfeng Regional Reference"
  },
  {
    id: "region-yanling", title: "Yanling — Volcanic Mountains", aliases: ["Yanling", "Volcanic Mountains"],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "GOLDEN DRAGON REGION · 05", summary: "Wilayah industri yang dikenal melalui penempaan, tungku, pengerjaan logam, dan spiritual forging.",
    paragraphs: [
      "Yanling memiliki identitas industri yang berpusat pada penempaan, tungku, pengerjaan logam, dan spiritual forging. Kondisi kawasan industri serta jalur pasokan dapat dipengaruhi aktivitas tungku dan keadaan setempat.",
      "Honglu menjadi kursi administrasi regional. Red Furnace Prefecture dan Ashen Peak Prefecture berada dalam Furnace Mountains Circuit; Furnace Spine Road menghubungkan Honglu dan Huifeng.",
      "Estimasi perencanaan mencatat sekitar 36 juta penduduk, luas sekitar 1,80 juta km², dan kepadatan rata-rata sekitar 20 jiwa/km². Luas dan kepadatan merupakan asumsi perencanaan, bukan hasil survei batas atau sensus terukur."
    ],
    sourcePath: "world/REGION_YANLING.md", sourceLabel: "Yanling Regional Reference"
  },
  {
    id: "region-baiyue", title: "Baiyue — Frontier Marches", aliases: ["Baiyue", "Frontier Marches"],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "GOLDEN DRAGON REGION · 06", summary: "Wilayah perbatasan yang berorientasi pada benteng, jalur militer, logistik, dan pertahanan.",
    paragraphs: [
      "Baiyue merupakan wilayah perbatasan Golden Dragon Empire. Identitasnya berpusat pada benteng, jalur militer, logistik pertahanan, dan pengamanan lintasan.",
      "Beiguan menjadi kursi administrasi regional dan Northwatch Prefecture adalah satu-satunya prefektur di wilayah ini. Koneksi Frontier–Maritime Relay menuju Dongxing menggunakan tahapan kurir serta perpindahan darat/laut yang berizin; jalur tersebut bukan jalan langsung.",
      "Estimasi perencanaan mencatat sekitar 32 juta penduduk, luas sekitar 2,67 juta km², dan kepadatan rata-rata sekitar 12 jiwa/km². Luas dan kepadatan merupakan asumsi perencanaan, bukan hasil survei batas atau sensus terukur."
    ],
    sourcePath: "world/REGION_BAIYUE.md", sourceLabel: "Baiyue Regional Reference"
  },
  {
    id: "region-xingluo", title: "Xingluo — Eastern Ports", aliases: ["Xingluo", "Eastern Ports"],
    visibility: "PUBLISHED",
    category: "GEOGRAPHY", eyebrow: "GOLDEN DRAGON REGION · 07", summary: "Wilayah maritim timur dengan perdagangan laut, pelabuhan, dan hubungan diplomatik lintas kekuasaan.",
    paragraphs: [
      "Xingluo adalah wilayah maritim timur Golden Dragon Empire. Identitasnya bertumpu pada perdagangan laut, pelabuhan, diplomasi, dan jalur pelayaran.",
      "Dongxing menjadi kursi administrasi regional sekaligus pelabuhan utama untuk keberangkatan antarkekuasaan menuju Cangqiong Harbor di Tianhai Yunzhou. Jadwal, tarif, jarak, dan durasi perjalanan belum ditetapkan.",
      "Eastern Star Prefecture adalah satu-satunya prefektur di Xingluo; wilayah ini berada dalam Frontier–Maritime Circuit bersama Northwatch Prefecture di Baiyue.",
      "Estimasi perencanaan mencatat sekitar 72 juta penduduk, luas sekitar 1,60 juta km², dan kepadatan rata-rata sekitar 45 jiwa/km². Luas dan kepadatan merupakan asumsi perencanaan, bukan hasil survei batas atau sensus terukur."
    ],
    sourcePath: "world/REGION_XINGLUO.md", sourceLabel: "Xingluo Regional Reference"
  },
  {
    id: "tianhai", title: "Tianhai Yunzhou", aliases: ["Yunzhou", "Pulau Terapung"],
    visibility: "PUBLISHED",
    category: "POWERS", eyebrow: "SOUTHWESTERN MARITIME POWER · 02", summary: "Kekuasaan maritim yang berpusat pada pulau raksasa terapung di atas Yunmeng Sea, terkenal dengan pelayaran, perdagangan, pendidikan, dan tradisi Arcanistry.",
    paragraphs: [
      "Tianhai Yunzhou berada di barat daya dunia, berpusat pada pulau raksasa yang terapung di atas Yunmeng Sea. Laut bukan sekadar batas geografis: ia adalah jalur kehidupan, perdagangan, perjalanan, dan hubungan antardaerah.",
      "Pulau utama dibagi ke dalam empat kawasan arah—Utara, Selatan, Barat, dan Timur—serta struktur administratif tujuh distrik. Tianji Core berada di bagian pusat sebagai kawasan yang berkaitan dengan sistem penopang pulau; Misty Shoals merupakan zona maritim terluar.",
      "Utara berorientasi pada keamanan dan pengawasan laut. Selatan menjadi pusat pemerintahan, pendidikan, kerajinan, dan pengembangan Arcanist. Barat berpusat pada aktivitas pelabuhan dan armada, sedangkan Timur dikenal melalui pasar, perdagangan, serta pertukaran informasi.",
      "Tianhai memiliki empat Cultivator Academies dan sebuah institusi riset Arcanist tingkat tinggi. Tradisi Arcanistry berawal di wilayah ini dan menjadi salah satu sumber pengaruh budaya serta teknologinya.",
      "Dossier publik juga tersedia untuk Duan Haicheng, yang tumbuh di lingkungan perdagangan Artificial Artifact, dan Lin Qiaoyu, pelajar Arcanist yang menghargai hasil yang dapat direproduksi. Profil ini tidak menetapkan lokasi pribadi atau institusi tempat mereka belajar."
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
      "Tidak semua detail batas wilayah, jarak, dan jalur perjalanan telah ditetapkan. Peta Merzkava adalah kerangka hubungan geografis, bukan peta berskala dengan koordinat pasti.",
      "Profil publik Beiming Gu yang telah ditinjau mencakup Beiming Jingheng, Beiming Xuanyu, Binghe Chuanliu, Lan Feng, Cangxue Beiran, Cangxue Tielan, Shuang Yue, Hanyue Mingzhao, Tie Song, Lingfeng Yujin, Minghu Yanshu, Mo Xueyan, Bai Yushen, Tieshi Beiyue, Xuanbing Lingsu, Xuanbing Yue, Xuansong Qinghe, Xuanye Zhenbei, Yaochi Suwen, dan Yinshan Qiaofeng. Setiap profil hanya memuat klaim publik yang telah dipilih; detail privat dan hubungan tersembunyi tidak ditampilkan."
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
    category: "PEOPLES", eyebrow: "BEIMING GU · CHARACTER FILE", summary: "Putri angkat Beiming Han yang dikenal karena kecantikan luar biasa, aroma alami, dan indra yang sangat peka.",
    paragraphs: [
      "Beiming Xenhwa tercatat sebagai putri angkat Beiming Han. Profil publik menonjolkan kecantikan luar biasa, aroma alami pasif, dan indra yang sangat peka.",
      "Afiliasinya adalah Beiming Gu, tetapi keberadaan fisiknya saat ini tidak boleh ditebak. Detail usia, garis keturunan, dan kemampuan yang tidak termasuk profil publik tidak disajikan sebagai fakta umum.",
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


  {
    id: "imperial-governance", title: "Golden Dragon — Imperial Governance", aliases: ["Imperial Governance", "Golden Dragon Government", "Pemerintahan Kekaisaran Naga Emas"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "CIVIL & MILITARY ADMINISTRATION · 21",
    summary: "Kerangka pemerintahan sipil dan militer Golden Dragon Empire, dari kaisar hingga layanan lokal, dengan pemisahan kewenangan yang tegas.",
    paragraphs: [
      "Kaisar adalah pemegang kedaulatan tertinggi. Urusan sehari-hari dijalankan melalui Imperial Council, Grand Secretariat, kementerian pusat, tujuh gubernur wilayah, dua belas prefektur, dan enam county circuit. Setiap county circuit mengoordinasikan dua prefektur; ia bukan lapisan county tambahan.",
      "Register administrasi saat ini menetapkan tujuh wilayah, dua belas prefektur, enam county circuit, dan tiga belas desa resmi. Kota, town, township, district office, serta household register memiliki fungsi layanan atau pencatatan dan tidak otomatis menjadi jenjang pemerintahan baru.",
      "Pemerintahan sipil dan komando militer adalah dua rantai kewenangan berbeda. Gubernur tidak otomatis memimpin setiap garnisun, sedangkan komandan militer tidak otomatis mengelola urusan warga. Gelar bangsawan, afiliasi klan, Spirit Realm, atau kekuatan pribadi juga tidak otomatis memberikan jabatan maupun yurisdiksi.",
      "Nama unit administratif dan kursinya mengikuti Administrative Atlas. Batas survei, koordinat, kode hukum lengkap, susunan rinci dewan, dan pejabat yang belum tercatat tetap terbuka; jangan mengisi kekosongan itu dengan asumsi.",
      "Nama tujuh kepala portofolio pusat dan tujuh gubernur wilayah dapat dibuka melalui dossier pejabat masing-masing; roster tersebut hanya menetapkan jabatan publik dan tidak memublikasikan disposisi politik atau agenda pribadi."
    ],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md", sourceLabel: "Golden Dragon Empire Governance"
  },
  {
    id: "imperial-public-services", title: "Golden Dragon — Public Services & Institutions", aliases: ["Imperial Public Services", "Ninefold Concord Bank", "Myriad Ledger Exchange", "Golden Dragon institutions"],
    visibility: "PUBLISHED", category: "FACTIONS", eyebrow: "PUBLIC INSTITUTIONS · 22",
    summary: "Jaringan layanan penduduk dan institusi lintas wilayah Golden Dragon, dengan ketersediaan yang berbeda menurut pusat kota, koridor, dan daerah perbatasan.",
    paragraphs: [
      "Golden Dragon memiliki jaringan layanan yang mencakup Ninefold Concord Bank, Myriad Ledger Exchange, Medicine Hall Society, dua Cultivator Academies pusat, perpustakaan pengetahuan publik Ordo Suci Tianming, dan Grand Martial Soul Awakening Hall. Register ini menetapkan cabang dan titik layanan tertentu; ia bukan jaminan bahwa setiap kota memiliki semua layanan.",
      "Ketersediaan layanan mengikuti gradien wilayah. Huanglongcheng dan jantung Longyuan memiliki jam layanan, staf, stok, dan akses rujukan paling luas. Pusat regional utama memiliki layanan inti yang lebih terbatas; kota industri dan pelabuhan memiliki spesialisasi lokal; daerah terpencil Baiyue cenderung memiliki stok lebih kecil, lebih sedikit spesialis, dan pasokan lebih lambat.",
      "Dua Cultivator Academies pusat berada di Huanglongcheng. Tianfeng merupakan sumber pelajar berbakat dan tradisi keilmuan, bukan lokasi akademi kultivator regional. Ordo Suci Tianming menyediakan koleksi pengetahuan publik dengan batas akses; perpustakaan publik tidak berarti semua arsip organisasi terbuka.",
      "Nama cabang, lokasi, dan layanan yang dipilih mengikuti Population Services Register. Cabang yang tidak tercatat, jam buka, staf yang sedang bertugas, persediaan, antrean, dan hasil layanan tidak boleh diasumsikan tersedia secara otomatis."
    ],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_POPULATION_SERVICES.md", sourceLabel: "Population Services & Institutional Branch Register"
  },
  {
    id: "open-learning-paths", title: "Learning Beyond Factions", aliases: ["Open Learning Paths", "Wandering Instructors", "Independent Teachers", "Belajar tanpa Faksi"],
    visibility: "PUBLISHED", category: "CULTURE", eyebrow: "EDUCATION & MENTORSHIP · 23",
    summary: "Jalur belajar Spirit Realm, Arcanist, dan keterampilan pendukung yang tidak mewajibkan seseorang bergabung dengan klan, sekte, akademi, atau guild.",
    paragraphs: [
      "Seseorang dapat menempuh kehidupan kultivasi atau Arcanist tanpa bersumpah setia kepada organisasi. Faksi dapat menyediakan fasilitas, guru, catatan, perlengkapan, kontak, dan latihan terstruktur, tetapi bukan satu-satunya jalan yang sah.",
      "Pengajaran dibedakan menjadi Spirit Realm, Arcanist, dual-path, dan support/trade. Kategori Spirit Realm mencakup dasar Martial Soul setelah awakening yang sah, Qi, teori kultivasi, disiplin tempur, persiapan Spirit Ring, pengetahuan Spirit Beast, dan survival. Kategori Arcanist mencakup fokus mental, formulasi, material, formation theory, engraving, appraisal artefak, dan jalur Grade resmi. Kedua sistem tetap terpisah.",
      "Guru hanya dapat mengajarkan hal yang sesuai dengan kompetensi dan aksesnya. Mereka dapat menolak, meminta bayaran atau jasa, menguji murid, mengajar bidang terbatas, atau tidak memiliki sumber daya. Pertemuan dengan guru pengembara bukan jaminan memperoleh kemampuan, rank, sumber daya, atau kelulusan.",
      "Rincian peluang kemunculan NPC pengajar dan prosedur GM tidak ditampilkan di dossier publik. Kurikulum, syarat masuk, sertifikasi, dan progres tetap tunduk pada modul mekanik serta aturan resmi institusi."
    ],
    sourcePath: "world/OPEN_LEARNING_PATHS_AND_WANDERING_INSTRUCTORS.md", sourceLabel: "Open Learning Paths & Wandering Instructors"
  },
  {
    id: "social-stratification", title: "Society & Social Stratification", aliases: ["Social Classes", "Social Inequality", "Struktur Sosial Merzkava", "Kelas Sosial"],
    visibility: "PUBLISHED", category: "CULTURE", eyebrow: "SOCIETY & EVERYDAY LIFE · 24",
    summary: "Gambaran lapisan sosial, ketimpangan, kerentanan ekonomi, dan mobilitas masyarakat di berbagai wilayah Merzkava.",
    paragraphs: [
      "Merzkava memiliki ketimpangan sosial yang ekstrem. Kekuasaan politik, kekuatan kultivasi, latar keluarga, kepemilikan tanah, akses pendidikan, jaringan, dan kendali sumber daya dapat saling memperkuat. Kekayaan dan status sosial berkaitan, tetapi tidak identik.",
      "Lapisan masyarakat mencakup elite dan keluarga penguasa, kelompok mapan dan kelas menengah, pekerja berpenghasilan rendah, penghuni permukiman rentan, serta orang-orang terlantar atau kehilangan tempat tinggal. Ini adalah gambaran sosial, bukan satu kode kasta resmi yang berlaku seragam di seluruh dunia.",
      "Kota makmur tetap dapat memiliki pekerja miskin, hunian padat, kawasan kumuh, dan orang yang tidur di jalan. Kondisi setiap wilayah, kota, desa, pelabuhan, atau wilayah faksi dapat berbeda sesuai hukum dan keadaan setempat.",
      "Jangan menyimpulkan persentase kemiskinan, jumlah penghuni kawasan kumuh, pendapatan rumah tangga, atau tingkat tunawisma sebuah kota dari reputasi dan kemakmurannya. Angka lokal semacam itu belum ditetapkan kecuali ada sumber khusus."
    ],
    sourcePath: "world/SOCIAL_STRATIFICATION.md", sourceLabel: "Social Stratification"
  },
  {
    id: "three-power-routes", title: "Three Powers — Connected Route Maps", aliases: ["Three-Power Maps", "Route Maps", "Peta Tiga Kekuasaan", "Interregional Routes"],
    visibility: "PUBLISHED", category: "GEOGRAPHY", eyebrow: "WORLD ROUTE FRAMEWORK · 25",
    summary: "Kerangka peta perjalanan dari perspektif Golden Dragon Empire, Tianhai Yunzhou, dan Beiming Gu, termasuk koridor darat, laut, wilayah liar, dan tiga jalur udara.",
    paragraphs: [
      "Peta ini merupakan skema hubungan geografis, bukan peta berskala. Ia membantu memahami orientasi dan koridor antarkawasan, tetapi tidak menetapkan koordinat, jarak, durasi perjalanan, batas survei, atau keselamatan setiap rute.",
      "Golden Dragon berada di timur, Beiming Gu di utara, dan Tianhai Yunzhou mengapung di atas Yunmeng Sea di barat daya. Jalur laut menghubungkan kawasan pesisir yang tercatat; perjalanan darat melalui wilayah liar dapat memerlukan eksplorasi, dan tidak semua segmen merupakan jalan umum.",
      "Tiga koridor udara langsung yang telah ditetapkan menghubungkan terminal Longyuan, Cangqiong Harbor, dan Beiming Heartland. Tarif pulang-pergi adalah 25 xc per penumpang, dengan layanan terminal pada 05:00–21:00 waktu setempat. Durasi, frekuensi, kapasitas, dan jadwal keberangkatan spesifik belum ditentukan.",
      "Kapal terbang Qi biasa merupakan alternatif terpisah dengan tarif pulang-pergi sebanding 86 xc per penumpang dalam kondisi operasi dan akses normal. Jangan mengarang tarif sekali jalan, jadwal pasti, atau jaminan kursi. Rute yang belum memiliki sambungan lokal tetap harus diselesaikan melalui sumber wilayah atau eksplorasi."
    ],
    sourcePath: "world/THREE_POWER_PERSPECTIVE_MAPS.md", sourceLabel: "Three-Power Perspective Maps"
  },
  {
    id: "geography-travel", title: "Geography, Seas & Travel", aliases: ["Geography and Travel", "World Geography", "Lautan dan Perjalanan", "Physical Geography"],
    visibility: "PUBLISHED", category: "GEOGRAPHY", eyebrow: "PHYSICAL WORLD & TRANSPORT · 26",
    summary: "Orientasi geografis Merzkava, sistem laut, wilayah liar, habitat Spirit Beast, reruntuhan, dan prinsip transportasi.",
    paragraphs: [
      "Kerangka geografis Merzkava bersifat relatif, bukan peta koordinat. Posisi umum wilayah dan hubungan laut telah ditetapkan, tetapi jarak, batas presisi, nama beberapa sungai, jalur lokal, dan waktu tempuh tetap tidak diketahui jika belum dicatat oleh sumber wilayah.",
      "Sistem laut utama mencakup Frostmirror Sea di pesisir utara Beiming, Eastern Azure Sea di pesisir timur Golden Dragon, Yunmeng Sea di perairan Tianhai, Wufeng Sea yang tenang tanpa angin, ombak, atau arus, Black Tide Sea di sekitar Lawless Territories, serta Guixu Canghai di ujung selatan melewati batas luar Black Tide Sea.",
      "Azerion Forest membentang dari Lawless Territories ke wilayah Golden Dragon. Pintu masuk termudah yang dikenal berada di Lawless; kawasan dalam tersembunyi oleh kabut ilusi. Reruntuhan dan Mega Colossal Labyrinth di sekitar danau merupakan zona berbahaya, bukan simpul transportasi umum. Hubungan keluar menuju pantai utara Beiming adalah jalur reruntuhan yang belum dipetakan.",
      "Transportasi mencakup perjalanan darat, kapal, dan layanan artefak/udara yang ditetapkan. Keberadaan koridor tidak berarti rute aman, gratis, cepat, terbuka untuk semua orang, atau selalu tersedia. Risiko, akses, dan segmen lokal harus mengikuti catatan geografis serta keadaan perjalanan."
    ],
    sourcePath: "world/GEOGRAPHY_AND_TRAVEL.md", sourceLabel: "Geography and Travel"
  },
  {
    id: "tianhai-academies", title: "Tianhai — Four Academies & Arcanist Institute", aliases: ["Tianhai Academies", "Tianhai Arcanist Institute", "Beichen Cultivator Academy", "Tianlan Supreme Academy", "Cangfan Maritime Academy", "Haiyue Academy"],
    visibility: "PUBLISHED", category: "ARCHIVES", eyebrow: "TIANHAI EDUCATION · 27",
    summary: "Empat akademi kultivator di empat area Tianhai Yunzhou dan lembaga riset serta sertifikasi Arcanist tingkat tinggi.",
    paragraphs: [
      "Pulau terapung Tianhai dibagi menjadi empat area arah: Utara, Selatan, Barat, dan Timur. Pembagian ini berbeda dari tujuh distrik formal pulau. Utara berorientasi pada keamanan dan pengawasan maritim; Selatan pada pemerintahan, pendidikan, kerajinan, dan pengembangan Arcanist; Barat pada pelayaran; Timur pada perdagangan.",
      "Empat akademinya adalah Beichen Cultivator Academy di Utara, Tianlan Supreme Academy di Selatan, Cangfan Maritime Academy di Barat, dan Haiyue Academy di Timur. Tianlan Supreme Academy merupakan yang paling unggul dan prestisius di antara empat akademi Tianhai, dengan pengajaran luas, fleksibel, dan praktik intensif. Hal itu tidak menjamin penerimaan atau Grade Arcanist tinggi.",
      "Tianhai Arcanist Institute merupakan lembaga riset tingkat tinggi sekaligus otoritas ujian, sertifikasi, dan verifikasi kredensial Grade Arcanist. Perannya tidak menggantikan mekanik progresi dan produksi resmi; seluruh prasyarat, urutan tahap, dan formula tetap tunduk pada core Arcanistry.",
      "Dossier ini merangkum struktur pendidikan. Daftar klan, akses khusus, prosedur ujian, kontribusi, dan aturan internal yang belum ditetapkan tidak boleh disimpulkan dari lokasi akademi."
    ],
    sourcePath: "world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md", sourceLabel: "Tianhai Academies & Arcanist Institute"
  },
  {
    id: "world-wealth", title: "Wealth Distribution of Merzkava", aliases: ["Global Wealth Distribution", "World Wealth", "Distribusi Kekayaan Dunia"],
    visibility: "PUBLISHED", category: "WORLD", eyebrow: "GLOBAL ECONOMIC MODEL · 28",
    summary: "Model akuntansi estimasi kekayaan dunia dan distribusi antarkawasan serta kelompok pemegang aset; bukan saldo uang tunai yang bebas dibelanjakan.",
    paragraphs: [
      "Model global mencatat total kekayaan sebesar 400.463.763.789.849 Xuan Gold (xg). Angka ini merupakan estimasi pool kekayaan terakuntansi, bukan klaim bahwa seluruh nilainya berupa koin fisik atau aset likuid yang bisa langsung dibelanjakan.",
      "Alokasi wilayah dalam model adalah Golden Dragon Empire 45%, Tianhai Yunzhou 27%, Beiming Gu 18%, dan Lawless Territories 10%. Angka ini merupakan alokasi akuntansi, bukan saldo kas aktual setiap penguasa, bank, guild, faksi, atau pasar.",
      "Distribusi berdasarkan pemegang aset menunjukkan konsentrasi terbesar pada penguasa dan kas negara, klan serta sekte tingkat tinggi, serikat dagang besar, dan bank. Kekayaan agregat rakyat jelata jauh lebih kecil dalam model tersebut; lapisan sosial dan kondisi hidup dijelaskan terpisah dalam dossier Social Stratification.",
      "Jangan menghitung Zun Jade atau Ancient Zun sekali lagi di luar total tersebut; konversi nominal mengikuti sistem mata uang resmi. Angka agregat dunia tidak otomatis diketahui oleh karakter biasa dan tidak menentukan uang di Wallet milik individu."
    ],
    sourcePath: "world/WEALTH_DISTRIBUTION.md", sourceLabel: "Global Xuan Gold Distribution"
  },

  {
    id: "beiming-jingheng", title: "Beiming Jingheng", aliases: ["Beiming Jingheng"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu NPC · Public Profile",
    summary: "Anggota Beiming Gu yang ambisius dan tercatat memiliki perilaku koruptif. Informasi ini dibatasi pada profil publik; koneksi rahasia dan insiden pribadi tidak ditampilkan.",
    paragraphs: ["Beiming Jingheng dikenal sebagai pribadi ambisius dengan kecenderungan melakukan tindakan koruptif. Profil publik ini tidak membuka hubungan tersembunyi, rincian insiden pribadi, tempat tinggal, maupun keberadaannya saat ini."],
    sourcePath: "regions/beiming-gu/npcs/BEIMING_JINGHENG.md", sourceLabel: "BEIMING JINGHENG"
  },
  {
    id: "beiming-xuanyu", title: "Beiming Xuanyu", aliases: ["Beiming Xuanyu"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Beiming Clan yang tenang, teliti, dan menjaga kesinambungan keluarga serta keamanan wilayah.",
    paragraphs: ["Beiming Xuanyu memimpin Beiming Clan. Ia dikenal tenang dan teliti, dengan perhatian pada kesinambungan keluarga dan keamanan wilayah. Fokus khasnya berkaitan dengan es purba, qilin utara, dan lapisan embun beku yang mengunci material. Rincian kemampuan, ring, dan lokasi pribadinya tidak ditambahkan di sini."],
    sourcePath: "regions/beiming-gu/npcs/BEIMING_XUANYU.md", sourceLabel: "BEIMING XUANYU"
  },
  {
    id: "binghe-chuanliu", title: "Binghe Chuanliu", aliases: ["Binghe Chuanliu"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Binghe Clan yang ramah, luwes, dan cepat membaca perubahan keadaan.",
    paragraphs: ["Binghe Chuanliu memimpin Binghe Clan. Ia dikenal ramah, luwes, dan cepat membaca perubahan keadaan. Fokus khasnya adalah berang-berang sungai es dan arus utara. Detail kemampuan dan keberadaan terkini tidak diasumsikan."],
    sourcePath: "regions/beiming-gu/npcs/BINGHE_CHUANLIU.md", sourceLabel: "BINGHE CHUANLIU"
  },
  {
    id: "lan-feng", title: "Lan Feng", aliases: ["Lan Feng", "Blue-Flame Dojo Master"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Dojo · Public Profile",
    summary: "Master Blue-Flame Dojo yang bersemangat dan menuntut kendali teknik dalam latihan.",
    paragraphs: ["Lan Feng memimpin Blue-Flame Dojo. Ia bersemangat, menuntut kontrol teknik, dan tidak mentoleransi latihan ceroboh. Fokus khasnya adalah harimau salju berapi biru; api tersebut tidak berarti kekebalan mutlak terhadap dingin."],
    sourcePath: "regions/beiming-gu/npcs/BLUE_FLAME_DOJO_MASTER.md", sourceLabel: "BLUE FLAME DOJO MASTER"
  },
  {
    id: "cangxue-beiran", title: "Cangxue Beiran", aliases: ["Cangxue Beiran"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu NPC · Public Profile",
    summary: "Pemuda dari keluarga yang terkait pekerjaan berburu dan pasokan lokal; berhati-hati dan berorientasi pada survival.",
    paragraphs: ["Cangxue Beiran dikenal berhati-hati, blak-blakan, berorientasi pada survival, dan lambat mempercayai orang asing. Ia akrab dengan risiko praktis kehidupan dan pekerjaan di lingkungan utara yang keras. Profil ini tidak menetapkan kemampuan tempur, pangkat berburu, atau hubungan klan tertentu."],
    sourcePath: "regions/beiming-gu/npcs/CANGXUE_BEIRAN.md", sourceLabel: "CANGXUE BEIRAN"
  },
  {
    id: "cangxue-tielan", title: "Cangxue Tielan", aliases: ["Cangxue Tielan"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Cangxue Clan yang terus terang, tangguh, dan tidak menyukai pemborosan.",
    paragraphs: ["Cangxue Tielan memimpin Cangxue Clan. Ia terus terang, tahan banting, dan tidak menyukai pemborosan. Fokus khasnya adalah lembu bertanduk besi kutub dan daya tahan."],
    sourcePath: "regions/beiming-gu/npcs/CANGXUE_TIELAN.md", sourceLabel: "CANGXUE TIELAN"
  },
  {
    id: "shuang-yue", title: "Shuang Yue", aliases: ["Shuang Yue", "Frostpeak Dojo Master"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Dojo · Public Profile",
    summary: "Master Frostpeak Dojo yang sabar dan konsisten, mengutamakan dasar sebelum teknik sulit.",
    paragraphs: ["Shuang Yue memimpin Frostpeak Dojo. Ia sabar, konsisten, dan mengutamakan penguasaan dasar sebelum teknik sulit. Fokus khasnya adalah beruang berlapis es dan pertahanan tubuh."],
    sourcePath: "regions/beiming-gu/npcs/FROSTPEAK_DOJO_MASTER.md", sourceLabel: "FROSTPEAK DOJO MASTER"
  },
  {
    id: "hanyue-mingzhao", title: "Hanyue Mingzhao", aliases: ["Hanyue Mingzhao"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Hanyue Clan yang sopan, observan, dan berhati-hati terhadap janji politik.",
    paragraphs: ["Hanyue Mingzhao memimpin Hanyue Clan. Ia sopan, observan, dan berhati-hati terhadap janji politik. Fokus khasnya adalah rusa es bercahaya bulan dan kristal beku."],
    sourcePath: "regions/beiming-gu/npcs/HANYUE_MINGZHAO.md", sourceLabel: "HANYUE MINGZHAO"
  },
  {
    id: "tie-song", title: "Tie Song", aliases: ["Tie Song", "Ironroot Dojo Master"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Dojo · Public Profile",
    summary: "Master Ironroot Dojo yang kokoh, sederhana, dan tidak mudah terkesan oleh gelar.",
    paragraphs: ["Tie Song memimpin Ironroot Dojo. Ia kokoh, sederhana, dan tidak mudah terkesan oleh gelar. Fokus khasnya adalah lembu musk bertanduk kuat dan daya tahan."],
    sourcePath: "regions/beiming-gu/npcs/IRONROOT_DOJO_MASTER.md", sourceLabel: "IRONROOT DOJO MASTER"
  },
  {
    id: "lingfeng-yujin", title: "Lingfeng Yujin", aliases: ["Lingfeng Yujin"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Lingfeng Clan yang cepat mengambil keputusan lapangan dan tidak menyukai rapat panjang.",
    paragraphs: ["Lingfeng Yujin memimpin Lingfeng Clan. Ia cepat mengambil keputusan di lapangan dan mudah bosan pada rapat panjang. Fokus khasnya adalah falcon salju dan angin lintas puncak."],
    sourcePath: "regions/beiming-gu/npcs/LINGFENG_YUJIN.md", sourceLabel: "LINGFENG YUJIN"
  },
  {
    id: "minghu-yanshu", title: "Minghu Yanshu", aliases: ["Minghu Yanshu"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Minghu Clan yang sangat awas, hemat bicara, dan tidak menyukai perhatian.",
    paragraphs: ["Minghu Yanshu memimpin Minghu Clan. Ia sangat awas, hemat bicara, dan tidak menyukai perhatian. Fokus khasnya adalah lynx putih, kabut beku, dan pengintaian."],
    sourcePath: "regions/beiming-gu/npcs/MINGHU_YANSHU.md", sourceLabel: "MINGHU YANSHU"
  },
  {
    id: "mo-xueyan", title: "Mo Xueyan", aliases: ["Mo Xueyan", "Silent Snow Dojo Master"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Dojo · Public Profile",
    summary: "Master Silent Snow Dojo yang tenang, jarang memberi pujian, dan mengamati sebelum bergerak.",
    paragraphs: ["Mo Xueyan memimpin Silent Snow Dojo. Ia tenang, jarang memberi pujian, dan mengamati sebelum bergerak. Fokus khasnya adalah burung hantu salju dan gerak tanpa suara."],
    sourcePath: "regions/beiming-gu/npcs/SILENT_SNOW_DOJO_MASTER.md", sourceLabel: "SILENT SNOW DOJO MASTER"
  },
  {
    id: "bai-yushen", title: "Bai Yushen", aliases: ["Bai Yushen", "Silver Tiger Dojo Master"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Dojo · Public Profile",
    summary: "Master Silver Tiger Dojo yang langsung, kompetitif, dan menghargai keberanian yang terkendali.",
    paragraphs: ["Bai Yushen memimpin Silver Tiger Dojo. Ia langsung, kompetitif, dan menghargai keberanian yang disertai kendali. Fokus khasnya adalah harimau salju bertaring perak dan serangan jarak dekat."],
    sourcePath: "regions/beiming-gu/npcs/SILVER_TIGER_DOJO_MASTER.md", sourceLabel: "SILVER TIGER DOJO MASTER"
  },
  {
    id: "tieshi-beiyue", title: "Tieshi Beiyue", aliases: ["Tieshi Beiyue"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Tieshi Clan yang keras pada standar mutu dan adil terhadap pekerja.",
    paragraphs: ["Tieshi Beiyue memimpin Tieshi Clan. Ia keras kepala dalam menjaga standar mutu, tetapi adil terhadap pekerja. Fokus khasnya adalah badak punggung gletser dan mineral beku."],
    sourcePath: "regions/beiming-gu/npcs/TIESHI_BEIYUE.md", sourceLabel: "TIESHI BEIYUE"
  },
  {
    id: "xuanbing-lingsu", title: "Xuanbing Lingsu", aliases: ["Xuanbing Lingsu"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Xuanbing Clan yang disiplin, sabar, dan cenderung berbicara setelah menguji bukti.",
    paragraphs: ["Xuanbing Lingsu memimpin Xuanbing Clan. Ia disiplin, sabar, dan cenderung berbicara setelah menguji bukti. Fokus khasnya adalah ular es bertingkat dan pertahanan dingin."],
    sourcePath: "regions/beiming-gu/npcs/XUANBING_LINGSU.md", sourceLabel: "XUANBING LINGSU"
  },
  {
    id: "xuanbing-yue", title: "Xuanbing Yue", aliases: ["Xuanbing Yue"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu NPC · Public Profile",
    summary: "Anggota muda Xuanbing Clan yang mantap, observan, dan melindungi orang yang dianggap diperlakukan tidak adil.",
    paragraphs: ["Xuanbing Yue dikenal mantap, observan, terus terang, dan protektif terhadap orang yang dianggap dinilai tidak adil. Ia dibesarkan dalam tradisi klan. Pangkat, gelar formal, dan pendaftaran dojo tertentu belum ditetapkan."],
    sourcePath: "regions/beiming-gu/npcs/XUANBING_YUE.md", sourceLabel: "XUANBING YUE"
  },
  {
    id: "xuansong-qinghe", title: "Xuansong Qinghe", aliases: ["Xuansong Qinghe"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Xuansong Clan yang pendiam, tekun, dan menghargai keseimbangan alam.",
    paragraphs: ["Xuansong Qinghe memimpin Xuansong Clan. Ia pendiam, tekun, dan menghargai keseimbangan alam. Fokus khasnya adalah cerpelai pinus beku dan hutan utara."],
    sourcePath: "regions/beiming-gu/npcs/XUANSONG_QINGHE.md", sourceLabel: "XUANSONG QINGHE"
  },
  {
    id: "xuanye-zhenbei", title: "Xuanye Zhenbei", aliases: ["Xuanye Zhenbei"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Xuanye Clan yang tegas, strategis, dan menjaga jarak sampai kepercayaan terbentuk.",
    paragraphs: ["Xuanye Zhenbei memimpin Xuanye Clan. Ia tegas, strategis, dan menjaga jarak sampai kepercayaan terbentuk. Fokus khasnya adalah serigala utara berlapis embun beku hitam."],
    sourcePath: "regions/beiming-gu/npcs/XUANYE_ZHENBEI.md", sourceLabel: "XUANYE ZHENBEI"
  },
  {
    id: "yaochi-suwen", title: "Yaochi Suwen", aliases: ["Yaochi Suwen"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Yaochi Clan yang lembut dalam percakapan tetapi tegas mengenai keselamatan.",
    paragraphs: ["Yaochi Suwen memimpin Yaochi Clan. Ia lembut dalam percakapan tetapi tegas soal keselamatan. Fokus khasnya adalah bangau teratai salju dan herbal dingin."],
    sourcePath: "regions/beiming-gu/npcs/YAOCHI_SUWEN.md", sourceLabel: "YAOCHI SUWEN"
  },
  {
    id: "yinshan-qiaofeng", title: "Yinshan Qiaofeng", aliases: ["Yinshan Qiaofeng"],
    visibility: "PUBLISHED", category: "PEOPLES", eyebrow: "Beiming Gu Clan · Public Profile",
    summary: "Kepala Yinshan Clan yang waspada, praktis, dan sulit percaya pada peta yang belum diuji.",
    paragraphs: ["Yinshan Qiaofeng memimpin Yinshan Clan. Ia waspada, praktis, dan sulit percaya pada peta yang belum diuji. Fokus khasnya adalah elang punggung salju dan mobilitas pegunungan."],
    sourcePath: "regions/beiming-gu/npcs/YINSHAN_QIAOFENG.md", sourceLabel: "YINSHAN QIAOFENG"
  },
  {
    id: "luo-zhenkai", title: "Luo Zhenkai", aliases: ["Luo Zhenkai"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "Golden Dragon NPC · Public Profile",
    summary: "Ahli waris keluarga pedagang yang sosial, penuh perhitungan, dan cepat membaca pertukaran kepentingan.",
    paragraphs: ["Luo Zhenkai tumbuh di lingkungan perdagangan dan negosiasi. Ia sosial, penuh perhitungan, dan cepat membaca pertukaran bantuan. Ia dapat menjadi sumber kabar pasar di antara kenalan, tetapi keandalan informasi bergantung pada kepentingan dan topiknya. Profil ini tidak menetapkan kepemilikan guild atau tempat usaha tertentu."],
    sourcePath: "regions/golden-dragon-empire/npcs/LUO_ZHENKAI.md", sourceLabel: "LUO ZHENKAI"
  },
  {
    id: "shen-yunting", title: "Shen Yunting", aliases: ["Shen Yunting"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "Golden Dragon NPC · Public Profile",
    summary: "Anggota muda keluarga Shen yang disiplin, kompetitif, dan berhati-hati menjaga reputasi publik.",
    paragraphs: ["Shen Yunting berasal dari salah satu cabang keluarga Shen. Ia disiplin, kompetitif, dan menjaga reputasi publik. Ia tidak boleh diasumsikan sebagai anggota keluarga kekaisaran, memiliki pangkat cabang tertentu, atau telah diterima di akademi tertentu."],
    sourcePath: "regions/golden-dragon-empire/npcs/SHEN_YUNTING.md", sourceLabel: "SHEN YUNTING"
  },
  {
    id: "duan-haicheng", title: "Duan Haicheng", aliases: ["Duan Haicheng"],
    visibility: "PUBLISHED", category: "ARCHIVES", eyebrow: "Tianhai NPC · Public Profile",
    summary: "Putra keluarga perdagangan Artificial Artifact yang percaya diri, praktis, dan memperhatikan kebutuhan pembeli.",
    paragraphs: ["Duan Haicheng tumbuh di sekitar peredaran dan penjualan Artificial Artifact. Ia percaya diri, praktis, kompetitif, dan memperhatikan apa yang benar-benar dibutuhkan pembeli. Latar dagang tidak membuktikan keahlian teknis, kepemilikan bengkel, atau afiliasi guild tertentu."],
    sourcePath: "regions/tianhai-yunzhou/npcs/DUAN_HAICHENG.md", sourceLabel: "DUAN HAICHENG"
  },
  {
    id: "lin-qiaoyu", title: "Lin Qiaoyu", aliases: ["Lin Qiaoyu"],
    visibility: "PUBLISHED", category: "ARCHIVES", eyebrow: "Tianhai NPC · Public Profile",
    summary: "Pelajar Arcanist yang ingin tahu, metodis, dan gemar menguji jawaban yang diterima.",
    paragraphs: ["Lin Qiaoyu mengejar pengetahuan Arcanistry dan menghargai hasil yang dapat direproduksi. Ia ingin tahu, metodis, dan bersedia mempertanyakan jawaban yang diterima. Grade Arcanist maupun pendaftaran institusi formal belum ditetapkan."],
    sourcePath: "regions/tianhai-yunzhou/npcs/LIN_QIAOYU.md", sourceLabel: "LIN QIAOYU"
  },

  {
    id: "official-xuanyuan-wenyuan", title: "Xuanyuan Wenyuan", aliases: ["Xuanyuan Wenyuan"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · MINISTER OF PERSONNEL",
    summary: "Xuanyuan Wenyuan tercatat sebagai Minister of Personnel dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Xuanyuan Wenyuan memegang jabatan Minister of Personnel. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-shen-mingde", title: "Shen Mingde", aliases: ["Shen Mingde"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · MINISTER OF FINANCE",
    summary: "Shen Mingde tercatat sebagai Minister of Finance dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Shen Mingde memegang jabatan Minister of Finance. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-yunlan-qingzhi", title: "Yunlan Qingzhi", aliases: ["Yunlan Qingzhi"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · MINISTER OF EDUCATION AND RITES",
    summary: "Yunlan Qingzhi tercatat sebagai Minister of Education and Rites dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Yunlan Qingzhi memegang jabatan Minister of Education and Rites. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-baihu-zhengyang", title: "Baihu Zhengyang", aliases: ["Baihu Zhengyang"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · MINISTER OF MILITARY AFFAIRS",
    summary: "Baihu Zhengyang tercatat sebagai Minister of Military Affairs dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Baihu Zhengyang memegang jabatan Minister of Military Affairs. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-gu-jingheng", title: "Gu Jingheng", aliases: ["Gu Jingheng"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · MINISTER OF JUSTICE",
    summary: "Gu Jingheng tercatat sebagai Minister of Justice dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Gu Jingheng memegang jabatan Minister of Justice. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-cangyue-yucheng", title: "Cangyue Yucheng", aliases: ["Cangyue Yucheng"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · MINISTER OF PUBLIC WORKS",
    summary: "Cangyue Yucheng tercatat sebagai Minister of Public Works dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Cangyue Yucheng memegang jabatan Minister of Public Works. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-heiyu-zhaolin", title: "Heiyu Zhaolin", aliases: ["Heiyu Zhaolin"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · HEAD OF THE IMPERIAL OVERSIGHT AGENCY",
    summary: "Heiyu Zhaolin tercatat sebagai Head of the Imperial Oversight Agency dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Heiyu Zhaolin memegang jabatan Head of the Imperial Oversight Agency. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-xuanyuan-haoran", title: "Xuanyuan Haoran", aliases: ["Xuanyuan Haoran"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · GOVERNOR OF LONGYUAN",
    summary: "Xuanyuan Haoran tercatat sebagai Governor of Longyuan dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Xuanyuan Haoran memegang jabatan Governor of Longyuan. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-cangyue-yunhe", title: "Cangyue Yunhe", aliases: ["Cangyue Yunhe"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · GOVERNOR OF CANGLAN",
    summary: "Cangyue Yunhe tercatat sebagai Governor of Canglan dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Cangyue Yunhe memegang jabatan Governor of Canglan. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-tieyan-mingxuan", title: "Tieyan Mingxuan", aliases: ["Tieyan Mingxuan"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · GOVERNOR OF JINYUE",
    summary: "Tieyan Mingxuan tercatat sebagai Governor of Jinyue dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Tieyan Mingxuan memegang jabatan Governor of Jinyue. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-yunlan-qinglan", title: "Yunlan Qinglan", aliases: ["Yunlan Qinglan"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · GOVERNOR OF TIANFENG",
    summary: "Yunlan Qinglan tercatat sebagai Governor of Tianfeng dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Yunlan Qinglan memegang jabatan Governor of Tianfeng. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-yanling-zhenyu", title: "Yanling Zhenyu", aliases: ["Yanling Zhenyu"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · GOVERNOR OF YANLING",
    summary: "Yanling Zhenyu tercatat sebagai Governor of Yanling dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Yanling Zhenyu memegang jabatan Governor of Yanling. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-baihu-xuefeng", title: "Baihu Xuefeng", aliases: ["Baihu Xuefeng"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · GOVERNOR OF BAIYUE",
    summary: "Baihu Xuefeng tercatat sebagai Governor of Baiyue dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Baihu Xuefeng memegang jabatan Governor of Baiyue. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },
  {
    id: "official-zhenhai-haixiu", title: "Zhenhai Haixiu", aliases: ["Zhenhai Haixiu"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "GOLDEN DRAGON CIVIL OFFICIAL · GOVERNOR OF XINGLUO",
    summary: "Zhenhai Haixiu tercatat sebagai Governor of Xingluo dalam roster pejabat Golden Dragon Empire pada sumber kanon yang dipatok.",
    paragraphs: ["Zhenhai Haixiu memegang jabatan Governor of Xingluo. Dossier ini hanya menampilkan penetapan jabatan yang tercatat; tidak memuat agenda pribadi, disposisi politik, kemampuan tempur, Martial Soul, atau informasi privat. Pemisahan kewenangan dan struktur jabatan mengikuti modul Governance serta Administrative Atlas."],
    sourcePath: "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md", sourceLabel: "Named Civil Officials & Political Dispositions"
  },

  {
    id: "imperial-audit-committee", title: "Imperial Special Financial Audit Committee", aliases: ["Komite Auditor Keuangan Khusus Kekaisaran", "Imperial Audit Committee"],
    visibility: "PUBLISHED", category: "POWERS", eyebrow: "IMPERIAL OVERSIGHT INSTITUTION",
    summary: "Lembaga pengawasan internal Golden Dragon Empire yang memeriksa kementerian dan badan pemerintahan di bawahnya.",
    paragraphs: [
      "Komite Auditor Keuangan Khusus Kekaisaran menjalankan pengawasan internal lintas kementerian dan badan pemerintahan yang berada di bawahnya. Mandatnya lebih luas daripada pemeriksaan rekening atau belanja publik, tetapi tetap dibatasi oleh yurisdiksi dan prosedur yang sah.",
      "Komite tidak otomatis memiliki kewenangan menuntut pidana, menjatuhkan hukuman, mengesampingkan pengadilan, memerintah militer, atau melewati lembaga hukum lain. Temuan harus didasarkan pada dokumen, kesaksian, bukti pendukung, dan prosedur yang berlaku.",
      "Identitas kepala, wakil, personel, alamat kantor, cabang, jadwal layanan, dan penempatan terkini belum ditetapkan untuk publik. Tidak ada dasar untuk menghubungkan komite dengan perkara keluarga Luca sebagai aktor terkonfirmasi."
    ],
    sourcePath: "world/IMPERIAL_SPECIAL_FINANCIAL_AUDIT_COMMITTEE.md", sourceLabel: "Imperial Special Financial Audit Committee"
  },
  {
    id: "prison-bound-items", title: "Prison Systems & Bound Items", aliases: ["Prison Restraints", "Bound Items", "Sistem Penjara dan Alat Pengikat"],
    visibility: "PUBLISHED", category: "ARCHIVES", eyebrow: "CUSTODY SYSTEMS & RESTRAINTS",
    summary: "Jenis alat pengikat yang digunakan dalam konteks penahanan, dari borgol tradisional hingga artefak khusus yang membatasi fungsi tertentu.",
    paragraphs: [
      "Bound item adalah benda yang dipasang, dikenakan, atau diikatkan kepada tahanan untuk membatasi gerak, akses, kekuatan, atau perilaku. Asalnya dapat berupa alat tradisional, Artificial Artifact, Ancient Artifact, atau Relic; kategori tersebut tidak boleh disamakan.",
      "Jenis yang tercatat meliputi rantai penekan aktivasi Martial Soul, collar penyamaran restraint, rantai penekan fisik, token pengikat batas, restraint pemicu rasa takut, whisper-seal atau delirium restraint, segel penekan Qi/Spirit Realm, serta borgol, tali, dan belenggu tradisional.",
      "Fungsi satu alat tidak otomatis mencakup fungsi lain. Penekan Martial Soul tidak selalu menekan kekuatan fisik; segel batas tidak otomatis mencegah bicara, berpikir, atau semua cara melarikan diri. Beberapa alat dapat digabung hanya jika fungsinya kompatibel.",
      "Tidak ada penalti numerik universal atau efek terjamin untuk seluruh kategori. Efek spesifik harus berasal dari entri item kanon, appraisal terverifikasi, atau penemuan yang benar-benar terjadi dalam adegan. Dossier ini tidak memuat prosedur GM, status tahanan, atau detail penyalahgunaan."
    ],
    sourcePath: "world/PRISON_AND_BOUND_ITEMS.md", sourceLabel: "Prison Systems and Bound Items"
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

export function resolveLorePlaceholder(label: string): LorePlaceholder | undefined {
  const query = label.trim().toLocaleLowerCase();
  if (!query) return undefined;
  return LORE_PLACEHOLDERS.find(item => item.title.toLocaleLowerCase() === query)
    ?? LORE_PLACEHOLDERS.find(item => item.aliases.some(alias => alias.toLocaleLowerCase() === query));
}

export function resolveLoreEntry(label: string, currentId?: string): LoreEntry | undefined {
  const query = label.trim().toLocaleLowerCase();
  if (!query) return undefined;
  const entries = getPublicLoreEntries().filter(entry => entry.id !== currentId);
  return entries.find(entry => entry.title.toLocaleLowerCase() === query)
    ?? entries.find(entry => entry.aliases.some(alias => alias.toLocaleLowerCase() === query));
}

/** Public dossiers that mention this dossier by an approved title or alias. */
export function openLorePlaceholder(id: string): boolean {
  if (!LORE_PLACEHOLDERS.some(item => item.id === id)) return false;
  activeLoreSourceId = null;
  activeLorePlaceholderId = id;
  return true;
}

export function closeLorePlaceholder(): void { activeLorePlaceholderId = null; }

export function getLoreBacklinks(id: string): LoreEntry[] {
  if (!getPublicLoreEntries().some(entry => entry.id === id)) return [];
  return getPublicLoreEntries().filter(entry =>
    entry.id !== id && entry.crossReferenceIds.includes(id)
  );
}

let activeLoreCategory: LoreCategory | "ALL" = "ALL";
let activeLoreQuery = "";
let activeLoreId: string | null = null;
let activeLoreSourceId: string | null = null;
let activeLorePlaceholderId: string | null = null;

const PUBLIC_CANDIDATE_SOURCE_PATHS = new Set([
  "world/REGION_LONGYUAN.md",
  "world/REGION_CANGLAN.md",
  "world/REGION_JINYUE.md",
  "world/REGION_TIANFENG.md",
  "world/REGION_YANLING.md",
  "world/REGION_BAIYUE.md",
  "world/REGION_XINGLUO.md",
  "world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md",
  "world/GOLDEN_DRAGON_EMPIRE_POPULATION_SERVICES.md",
  "world/OPEN_LEARNING_PATHS_AND_WANDERING_INSTRUCTORS.md",
  "world/SOCIAL_STRATIFICATION.md",
  "world/THREE_POWER_PERSPECTIVE_MAPS.md",
  "world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md",
  "world/WEALTH_DISTRIBUTION.md",
  "regions/beiming-gu/npcs/BEIMING_JINGHENG.md",
  "regions/beiming-gu/npcs/BEIMING_XUANYU.md",
  "regions/beiming-gu/npcs/BINGHE_CHUANLIU.md",
  "regions/beiming-gu/npcs/BLUE_FLAME_DOJO_MASTER.md",
  "regions/beiming-gu/npcs/CANGXUE_BEIRAN.md",
  "regions/beiming-gu/npcs/CANGXUE_TIELAN.md",
  "regions/beiming-gu/npcs/FROSTPEAK_DOJO_MASTER.md",
  "regions/beiming-gu/npcs/HANYUE_MINGZHAO.md",
  "regions/beiming-gu/npcs/IRONROOT_DOJO_MASTER.md",
  "regions/beiming-gu/npcs/LINGFENG_YUJIN.md",
  "regions/beiming-gu/npcs/MINGHU_YANSHU.md",
  "regions/beiming-gu/npcs/SILENT_SNOW_DOJO_MASTER.md",
  "regions/beiming-gu/npcs/SILVER_TIGER_DOJO_MASTER.md",
  "regions/beiming-gu/npcs/TIESHI_BEIYUE.md",
  "regions/beiming-gu/npcs/XUANBING_LINGSU.md",
  "regions/beiming-gu/npcs/XUANBING_YUE.md",
  "regions/beiming-gu/npcs/XUANSONG_QINGHE.md",
  "regions/beiming-gu/npcs/XUANYE_ZHENBEI.md",
  "regions/beiming-gu/npcs/YAOCHI_SUWEN.md",
  "regions/beiming-gu/npcs/YINSHAN_QIAOFENG.md",
  "regions/golden-dragon-empire/npcs/LUO_ZHENKAI.md",
  "regions/golden-dragon-empire/npcs/SHEN_YUNTING.md",
  "regions/tianhai-yunzhou/npcs/DUAN_HAICHENG.md",
  "regions/tianhai-yunzhou/npcs/LIN_QIAOYU.md",
  "world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md",
  "world/IMPERIAL_SPECIAL_FINANCIAL_AUDIT_COMMITTEE.md",
  "world/PRISON_AND_BOUND_ITEMS.md"
]);

export const LORE_PLACEHOLDERS: LorePlaceholder[] = [
  {
    id: "placeholder-huanglongcheng", title: "Huanglongcheng", aliases: [], status: "ON_PLAN", category: "GEOGRAPHY",
    summary: "Ibu kota Golden Dragon Empire sekaligus pusat administrasi Longyuan; rincian kotanya sengaja tetap terbuka.",
    detail: "Nama dan kedudukan Huanglongcheng sudah disebut dalam referensi kanon. Namun, distrik, bangunan, tokoh lokal, kehidupan sehari-hari, dan banyak rincian kota belum dikunci. Status ON PLAN berarti ruang pengembangan ini disengaja, bukan data yang hilang atau kesalahan arsip. GM dalam percakapan Merzkava Universe dapat mengembangkan narasi sesuai konteks tanpa menganggap tambahan itu otomatis menjadi kanon permanen.",
    relatedIds: ["golden-dragon", "region-longyuan"]
  },
  {
    id: "placeholder-remote-mountain-traditions", title: "Remote Mountain Traditions", aliases: ["High Cloud-Sea Mountains"],
    status: "ON_PLAN", category: "CULTURE",
    summary: "A reserved index point for future GM-led discovery; no concealed group identity or roster is disclosed.",
    detail: "This entry preserves a clickable reference without publishing concealed group names, membership, affiliations, capabilities, or exact locations. The underlying source intentionally leaves discovery boundaries to the GM. New details may be developed in the Merzkava Universe conversation when the scene warrants them; improvisation does not automatically become permanent canon.",
    relatedIds: ["geography-travel", "world-atlas"],
    sourcePath: "world/ANCIENT_SHAMANISM_AND_BUDDHIST_CLANS.md"
  },
  {
    id: "placeholder-cangqiong-harbor", title: "Cangqiong Harbor", aliases: [], status: "ON_PLAN", category: "GEOGRAPHY",
    summary: "Pelabuhan di Tianhai Yunzhou yang disebut dalam hubungan pelayaran; detail spesifiknya sengaja belum ditetapkan.",
    detail: "Cangqiong Harbor sudah dikenal sebagai titik pelabuhan dalam referensi jalur laut Merzkava. Tata letak, fasilitas, pengelola, distrik, tokoh, dan rincian operasionalnya belum dikunci. Status ON PLAN menjaga ruang bagi GM untuk membangun adegan dan narasi sesuai kebutuhan percakapan; detail improvisasi tidak otomatis menjadi fakta kanon.",
    relatedIds: ["tianhai", "seas"]
  }
];

const PARTIAL_PUBLIC_SOURCE_PATHS = new Set([
  "world/WORLD.md",
  "world/LAWLESS_TERRITORIES.md",
  "world/MAP_AND_REGIONS.md",
  "world/FACTIONS.md",
  "world/RUINED_ARCHIVER.md",
  "world/ARTIFACTS_AND_RELICS.md",
  "world/ARTIFICIAL_ARTIFACTS.md",
  "world/GEOGRAPHY_AND_TRAVEL.md"
]);

function formatLoreEntityStatus(status: LoreEntityStatus): string {
  return status === "NON_CANON" ? "NON-CANON" : "ON PLAN";
}

function escapeLore(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char] ?? char);
}

function loreLinks(text: string, currentId: string): string {
  const currentEntry = getPublicLoreEntries().find(entry => entry.id === currentId);
  const crossReferences = new Set(currentEntry?.crossReferenceIds ?? []);
  const references = [
    ...getPublicLoreEntries().filter(entry => crossReferences.has(entry.id)).flatMap(entry => [
      { label: entry.title, id: entry.id, priority: 2, placeholder: false, status: undefined },
      ...entry.aliases.map(label => ({ label, id: entry.id, priority: 1, placeholder: false, status: undefined }))
    ]),
    ...LORE_PLACEHOLDERS.flatMap(item => [
      { label: item.title, id: item.id, priority: 2, placeholder: true, status: item.status },
      ...item.aliases.map(label => ({ label, id: item.id, priority: 1, placeholder: true, status: item.status }))
    ])
  ].sort((a, b) => b.label.length - a.label.length || b.priority - a.priority || a.id.localeCompare(b.id));
  let result = "";
  let cursor = 0;
  while (cursor < text.length) {
    let match: { index: number; label: string; id: string; priority: number; placeholder: boolean; status?: LoreEntityStatus } | null = null;
    for (const reference of references) {
      const index = text.toLocaleLowerCase().indexOf(reference.label.toLocaleLowerCase(), cursor);
      if (index < 0) continue;
      const before = index > 0 ? text[index - 1] : "";
      const after = text[index + reference.label.length] ?? "";
      const wordLike = /[\p{L}\p{N}_]/u;
      if ((before && wordLike.test(before) && wordLike.test(reference.label[0])) ||
          (after && wordLike.test(after) && wordLike.test(reference.label[reference.label.length - 1]))) continue;
      if (!match || index < match.index || (index === match.index && (reference.priority > match.priority || (reference.priority === match.priority && reference.label.length > match.label.length)))) {
        match = { index, label: reference.label, id: reference.id, priority: reference.priority, placeholder: reference.placeholder, status: reference.status };
      }
    }
    if (!match) { result += escapeLore(text.slice(cursor)); break; }
    result += escapeLore(text.slice(cursor, match.index));
    const attribute = match.placeholder ? "data-lore-placeholder-open" : "data-lore-open";
    result += '<button class="lore-inline-link' + (match.placeholder ? ' lore-inline-link-placeholder' : '') + '" type="button" ' + attribute + '="' + match.id + '">' + escapeLore(match.label) + (match.placeholder ? ' <span class="lore-inline-status lore-status-' + (match.status ?? "ON_PLAN").toLowerCase() + '">' + escapeLore(formatLoreEntityStatus(match.status ?? "ON_PLAN")) + '</span>' : '') + '</button>';
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
  activeLoreSourceId = null;
  activeLorePlaceholderId = null;
  activeLoreId = id;
  return true;
}
export function closeLoreEntry(): void { activeLoreId = null; activeLoreSourceId = null; activeLorePlaceholderId = null; }

export function getLoreSourceDisposition(id: string): "PUBLISHED" | "PARTIAL_PUBLIC" | "PUBLIC_CANDIDATE" | undefined {
  const entry = getPublicLoreEntries().find(item => item.id === id);
  if (!entry) return undefined;
  if (PARTIAL_PUBLIC_SOURCE_PATHS.has(entry.sourcePath)) return "PARTIAL_PUBLIC";
  if (PUBLIC_CANDIDATE_SOURCE_PATHS.has(entry.sourcePath)) return "PUBLIC_CANDIDATE";
  return "PUBLISHED";
}

export function openLoreSource(id: string): boolean {
  if (!getPublicLoreEntries().some(entry => entry.id === id)) return false;
  activeLoreId = id;
  activeLorePlaceholderId = null;
  activeLoreSourceId = id;
  return true;
}

export function closeLoreSource(): void { activeLoreSourceId = null; }

export function renderLoreResults(): string {
  const query = activeLoreQuery.trim().toLocaleLowerCase();
  const entries = getPublicLoreEntries().filter(entry =>
    (activeLoreCategory === "ALL" || entry.category === activeLoreCategory) &&
    (!query || [entry.title, entry.summary, entry.eyebrow, ...entry.aliases, ...entry.paragraphs].join(" ").toLocaleLowerCase().includes(query))
  );
  const placeholders = LORE_PLACEHOLDERS.filter(item =>
    (activeLoreCategory === "ALL" || item.category === activeLoreCategory) &&
    (!query || [item.title, item.summary, item.status, ...item.aliases].join(" ").toLocaleLowerCase().includes(query))
  );
  if (!entries.length && !placeholders.length) return '<div class="lore-empty"><span>⌕</span><h3>No matching records</h3><p>Coba kata kunci lain atau pilih kategori berbeda.</p></div>';
  return '<div class="lore-card-grid">' + entries.map((entry, index) =>
    '<button class="lore-entry-card" type="button" data-lore-open="' + entry.id + '">' +
      '<span class="lore-card-index">' + String(index + 1).padStart(2, "0") + ' / ' + entry.category + '</span>' +
      '<span class="lore-card-title">' + escapeLore(entry.title) + '</span>' +
      '<span class="lore-card-summary">' + escapeLore(entry.summary) + '</span>' +
      '<span class="lore-card-foot">' + escapeLore(entry.sourceLabel) + '<b>↗</b></span>' +
    '</button>'
  ).join("") + placeholders.map(item =>
    '<button class="lore-entry-card lore-placeholder-card" type="button" data-lore-placeholder-open="' + item.id + '">' +
      '<span class="lore-card-index">' + escapeLore(item.category) + ' / <b class="lore-status-tag lore-status-' + item.status.toLowerCase() + '">' + escapeLore(formatLoreEntityStatus(item.status)) + '</b></span>' +
      '<span class="lore-card-title">' + escapeLore(item.title) + '</span>' +
      '<span class="lore-card-summary">' + escapeLore(item.summary) + '</span>' +
      '<span class="lore-card-foot">DEVELOPMENT NOTE<b>↗</b></span>' +
    '</button>'
  ).join("") + '</div>';
}

function renderLorePlaceholder(item: LorePlaceholder): string {
  const related = item.relatedIds
    .map(id => getPublicLoreEntries().find(entry => entry.id === id))
    .filter((entry): entry is LoreEntry => Boolean(entry));
  const statusLabel = formatLoreEntityStatus(item.status);
  const statusNote = item.status === "ON_PLAN"
    ? "The entity is intentionally under-specified. Known references remain valid, while additional details are left open for narrative development by the GM. This is not missing data and does not authorize the app to invent canon."
    : "This material is explicitly non-canonical. It may be used as a narrative or illustrative reference, but it does not establish or modify official Merzkava Universe canon.";
  const backLabel = activeLoreId ? "← BACK TO DOSSIER" : "← BACK TO ARCHIVE";
  return '<article class="lore-detail lore-placeholder-detail">' +
    '<button class="lore-back" type="button" data-lore-placeholder-back>' + backLabel + '</button>' +
    '<div class="lore-detail-top"><span>ENTITY DEVELOPMENT REGISTER</span><span class="lore-status-tag lore-status-' + item.status.toLowerCase() + '">' + escapeLore(statusLabel) + '</span></div>' +
    '<h2>' + escapeLore(item.title) + '</h2>' +
    '<p class="lore-lede">' + escapeLore(item.summary) + '</p>' +
    '<aside class="lore-placeholder-note"><strong>' + escapeLore(statusLabel) + '</strong><p>' + escapeLore(statusNote) + '</p></aside>' +
    '<p class="lore-paragraph">' + escapeLore(item.detail) + '</p>' +
    (related.length ? '<div class="lore-related"><span class="lore-source-kicker">RELATED CANON RECORDS</span>' + related.map(entry => '<button type="button" data-lore-open="' + entry.id + '">' + escapeLore(entry.title) + ' <b>↗</b></button>').join("") + '</div>' : '') +
    '</article>';
}
function renderLoreSourceReader(entry: LoreEntry): string {
  const disposition = getLoreSourceDisposition(entry.id);
  const scopeNotice = disposition === "PARTIAL_PUBLIC"
    ? "This source has mixed publication scope. Only the reviewed public-safe extract below is bundled; the raw Markdown is intentionally not copied into the player Archive."
    : "This reader contains only claims selected for this public dossier. It is not a verbatim copy of the canonical Markdown file; claim-level review remains the boundary for publication.";
  return '<article class="lore-source-reader">' +
    '<button class="lore-back" type="button" data-lore-source-back>← BACK TO DOSSIER</button>' +
    '<div class="lore-detail-top"><span>OFFLINE SOURCE READER</span><span>REVIEWED EXTRACT</span></div>' +
    '<h2>' + escapeLore(entry.sourceLabel) + '</h2>' +
    '<p class="lore-source-reader-lede">A locally bundled, player-safe reading extract from the official Universe source.</p>' +
    '<section class="lore-source-metadata"><span class="lore-source-kicker">SOURCE PROVENANCE</span>' +
      '<strong>' + escapeLore(entry.title) + '</strong>' +
      '<code>' + escapeLore(entry.sourcePath) + '</code>' +
      '<small>Source classification: ' + escapeLore(disposition ?? "REVIEW_REQUIRED") + '</small>' +
      '<small>Universe commit: ' + escapeLore(entry.sourceCommit) + '</small>' +
      '<small>Reviewed: ' + escapeLore(entry.reviewedAt) + '</small>' +
    '</section>' +
    '<aside class="lore-source-scope-note">' + escapeLore(scopeNotice) + '</aside>' +
    '<h3 class="lore-source-section-title">PUBLICLY REVIEWED CONTENT</h3>' +
    '<p class="lore-lede">' + loreLinks(entry.summary, entry.id) + '</p>' +
    entry.paragraphs.map((paragraph, index) => '<p class="lore-paragraph"><span class="lore-paragraph-mark">' + String(index + 1).padStart(2, "0") + '</span><span>' + loreLinks(paragraph, entry.id) + '</span></p>').join("") +
    '<button class="lore-back lore-source-return" type="button" data-lore-source-back>← RETURN TO ' + escapeLore(entry.title.toLocaleUpperCase()) + '</button>' +
    '</article>';
}

function renderLoreDetail(entry: LoreEntry): string {
  const relatedRecords = entry.crossReferenceIds
    .map(id => getPublicLoreEntries().find(item => item.id === id))
    .filter((item): item is LoreEntry => Boolean(item))
    .slice(0, 5);
  const backlinks = getLoreBacklinks(entry.id);
  return '<article class="lore-detail">' +
    '<button class="lore-back" type="button" data-lore-back>← ARCHIVE INDEX</button>' +
    '<div class="lore-detail-top"><span>' + escapeLore(entry.eyebrow) + '</span><span>LOCAL DOSSIER</span></div>' +
    '<h2>' + escapeLore(entry.title) + '</h2>' +
    '<p class="lore-lede">' + loreLinks(entry.summary, entry.id) + '</p>' +
    entry.paragraphs.map((paragraph, index) => '<p class="lore-paragraph"><span class="lore-paragraph-mark">' + String(index + 1).padStart(2, "0") + '</span><span>' + loreLinks(paragraph, entry.id) + '</span></p>').join("") +
    '<div class="lore-source-card"><span class="lore-source-kicker">CANON REFERENCE</span><strong>' + escapeLore(entry.sourceLabel) + '</strong><code>' + escapeLore(entry.sourcePath) + '</code><small>Reviewed ' + escapeLore(entry.reviewedAt) + ' · Universe snapshot ' + escapeLore(entry.sourceCommit.slice(0, 7)) + '. Arsip lokal ini adalah ringkasan lore; aturan dan resolusi gameplay tetap merujuk repo canon.</small><button class="lore-source-open" type="button" data-lore-source-open="' + entry.id + '">OPEN REVIEWED SOURCE EXTRACT ↗</button></div>' +
    '<div class="lore-related"><span class="lore-source-kicker">RELATED RECORDS</span>' +
    relatedRecords.map(item => '<button type="button" data-lore-open="' + item.id + '">' + escapeLore(item.title) + ' <b>↗</b></button>').join("") +
    '</div>' +
    (backlinks.length ? '<div class="lore-related lore-backlinks"><span class="lore-source-kicker">MENTIONED IN</span>' +
      backlinks.map(item => '<button type="button" data-lore-open="' + item.id + '">' + escapeLore(item.title) + ' <b>↗</b></button>').join("") +
      '</div>' : '') +
    '</article>';
}

export function renderLoreLibrary(): string {
  const active = activeLoreId ? getPublicLoreEntries().find(entry => entry.id === activeLoreId) : null;
  const activePlaceholder = activeLorePlaceholderId ? LORE_PLACEHOLDERS.find(item => item.id === activeLorePlaceholderId) : null;
  const sourceEntry = activeLoreSourceId ? getPublicLoreEntries().find(entry => entry.id === activeLoreSourceId) : null;
  if (sourceEntry) return renderLoreSourceReader(sourceEntry);
  if (activePlaceholder) return renderLorePlaceholder(activePlaceholder);
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
