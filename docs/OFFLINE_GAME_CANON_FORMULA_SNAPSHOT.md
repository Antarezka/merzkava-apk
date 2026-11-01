# Offline Game — Canon Formula Source Snapshot

> **Purpose:** Preserve the complete official mechanical source texts for future implementation of the standalone offline Merzkava life/adventure game. This is a development reference snapshot, not an approved player-facing Archive package and not a runtime rules engine.
>
> **Upstream:** `Antarezka/merzkava-universe` / `main` / `2f76a864150528afb0e3d26cb16f9396ce610ff6`
>
> **Preservation rule:** Each source section below is copied verbatim from the pinned Universe commit. Keep equations, tables, exceptions, thresholds, ordering, dependencies, and explicit unresolved/unspecified values intact. Do not simplify, rebalance, silently repair, or infer missing values. The Universe repository remains canon authority; update this snapshot only by comparing a newly pinned upstream source.
>
> **Runtime safety:** Do not bundle this whole development snapshot as player-visible Archive text. Offline gameplay must use separately reviewed, deterministic engine implementations and approved public content. GM-only, private, or restricted source material must not be exposed merely because it is preserved here.
>
> **Offline game boundary:** The future game is a separate standalone mode, 100% Merzkava-derived, without AI/network dependency. BitLife and Solo Leveling remain design/presentation references only. This snapshot is not itself a playable implementation.


---

<!-- SOURCE bestiary/SPIRIT_BEAST_RULES.md | upstream blob 3dde580b364a2c05ae7d887e41ebf8d373946e18 -->

# Merzkava Universe — Spirit Beast Rules

Status: Modul mekanik resmi.
Cakupan: Ordinary Beast, Spirit Beast, Supreme Beast, Demonic Beast, Heavenly Beast, sifat tambahan, perilaku, persyaratan penyerapan Spirit Ring, dan item khusus.

**Tradition boundary:** Spirit Beast species, categories, behavior, age, and mechanics do not determine whether an observer or school follows Soul-Nyuma or Soul-Zoun. Both traditions study the same Spirit Realm domain; classification requires evidence of actual doctrine. See `core/SPIRIT_REALM_TRADITIONS.md`.

## 1. Kategori, Klasifikasi, dan Perilaku Beast

Gunakan klasifikasi berikut sebagai satu sistem terpadu. Kategori utama menjelaskan jenis dan watak dasar Beast; umur, kondisi khusus, serta hasil appraisal tetap dicatat secara terpisah.

### 1.1 Kategori utama

| Kategori | Kekuatan output umum | Kecerdasan dan perilaku dasar |
|---|---|---|
| **Ordinary Beast** | Tidak memiliki kisaran output Spirit Realm yang ditetapkan secara umum. | Hewan atau makhluk liar biasa; perilakunya mengikuti naluri dan karakteristik spesies. Jangan otomatis menganggapnya mampu menghasilkan Spirit Ring. |
| **Spirit Beast** | Bervariasi; jangan menetapkan kisaran universal hanya dari nama kategori. | Beast dengan kekuatan spiritual yang relevan dengan sistem Spirit Ring. Kecerdasan dan temperamennya bervariasi menurut spesies dan individu; tidak otomatis hostile atau jinak. Spirit Ring hanya muncul jika didukung aturan dan kejadian yang sah. |
| **Supreme Beast** | Sekitar output Spirit Realm 6–8. | Hostile, sangat kuat, dan sadis. Tidak memiliki kecerdasan seperti Demonic Beast atau Heavenly Beast; tindakan terutama digerakkan oleh naluri berburu, menyerang, dan bertahan hidup. Insting yang kompleks tidak berarti kecerdasan rasional setara makhluk cerdas. |
| **Demonic Beast** | Sekitar output Spirit Realm 9. | Hostile dan memiliki kecerdasan; tingkat kecerdasan, kepribadian, serta cara bertindak berbeda menurut Beast dan individu. Mereka dapat menggunakan pertimbangan dan taktik, bukan hanya naluri. |
| **Heavenly Beast** | Sekitar output Spirit Realm 9. | Memiliki kecerdasan; tingkatnya bergantung pada Beast dan individu. Watak umumnya tenang dan pasif, serta tidak mencari masalah dengan makhluk lain yang dianggap sangat kecil dibanding dirinya. Mereka biasanya membiarkan “semut-semut” berlalu selama tidak mengusik, mengancam, atau bertingkah melewati batas. Sikap pasif bukan kelemahan dan tidak mencegah mereka membalas gangguan. |

**Makna output:** kisaran Spirit Realm di atas menggambarkan skala kekuatan yang dapat dikeluarkan, bukan berarti Beast menjalani sistem kultivasi manusia, otomatis memiliki Spirit Realm/Stage tertentu, atau pasti menang melawan kultivator pada tingkat yang sama. Hasil nyata tetap mengikuti kemampuan yang terkonfirmasi, kondisi, medan, serta aturan combat.

### 1.2 Sifat tambahan bukan kategori utama

- **Rare/unik**, **mutated**, dan **corrupted** menjelaskan kelangkaan, perubahan, atau kondisi Beast; istilah ini tidak otomatis menggantikan kategori utamanya. Jika bukti mendukung, satu Beast dapat dicatat sebagai kategori utama beserta satu atau lebih sifat tambahan.
- **Beast Age Grade** adalah klasifikasi umur, bukan kategori Beast, ukuran kekuatan, Spirit Realm, atau tier appraisal.
- Tier appraisal, umur aktual, kecerdasan, ukuran tubuh, kemampuan khusus, dan kelayakan menghasilkan Spirit Ring tidak boleh ditebak hanya dari nama kategori.
- Hostile tidak berarti setiap individu selalu menyerang tanpa konteks; resolusikan perilaku dari watak dasar, situasi, wilayah, ancaman, dan bukti spesifik. Sebaliknya, sifat pasif Heavenly Beast bukan jaminan aman jika makhluk lain mengusiknya.
- Riwayat Azerion tetap berlaku: Beast yang dahulu merupakan Demonic Beast berubah menjadi Heavenly Beast setelah pikirannya dimurnikan oleh Beiming Han. Perubahan ini adalah kasus lore khusus yang telah ditetapkan, bukan bukti bahwa semua Demonic Beast dapat dimurnikan atau otomatis berubah kategori.

Setelah Spirit Beast dikalahkan, Spirit Ring dapat muncul mengambang di atas tubuhnya. Kekalahan Beast tidak membuat ring otomatis berhasil diserap. Penyerapan harus diselesaikan sesuai `core/SPIRIT_RING_RULES.md`.

## 1.3 Beast Age Grade — Rumus dan Tabel Kanonis

**Beast Age Grade** adalah kelas kalkulasi berdasarkan umur spesimen, bukan tingkatan kekuatan/kategori Beast, bukan Spirit Realm, dan bukan tier appraisal MAA. Setelah disebut lengkap, istilah singkatnya adalah **Age Grade**. Istilah seperti Spirit Beast, Demonic Beast, dan Heavenly Beast tetap merupakan kategori/lore tersendiri. Angka 1–9 pada tabel ini hanya menunjukkan kelompok umur untuk perhitungan yang membutuhkan klasifikasi usia.

Gunakan umur aktual yang diketahui. Rumus klasifikasinya:

`AgeGrade(A) = Age Grade terkecil yang rentang umurnya mencakup A`

dengan `A` = umur Beast dalam tahun. Cocokkan umur dengan tabel; jangan mengubah Age Grade berdasarkan nama, kategori, kemampuan, atau dugaan kekuatan Beast. Jika umur belum diketahui, tandai Age Grade belum ditetapkan—jangan menebaknya dari kategori Beast.

| Age Grade | Umur Beast |
|---:|---:|
| 1 | 10–150 tahun |
| 2 | 151–999 tahun |
| 3 | 1.000–4.999 tahun |
| 4 | 5.000–9.999 tahun |
| 5 | 10.000–49.999 tahun |
| 6 | 50.000–99.999 tahun |
| 7 | 100.000–199.999 tahun |
| 8 | 200.000–499.999 tahun |
| 9 | 500.000 tahun ke atas; rentang lazim dapat mencapai sekitar 4.000.000 tahun dan lebih |

**Age Grade 9 tidak memiliki batas maksimum tetap.** Beast berumur lebih dari 4 juta tahun tetap berada pada Age Grade 9; angka 4 juta bukan batas keras. Contoh kanonis: Heavenly Beast di Azerion Forest berumur **7.290.422 tahun**, sehingga masuk **Age Grade 9**. Beast ini adalah Beast yang mampu melukai Beiming Han ketika Beiming Han masih berstatus Demonic Beast. Pada usia tersebut, ia belum melewati ambang 15.000.000 tahun untuk klasifikasi Heaven Realm. Fakta itu tidak mengubah arti Age Grade 9 dan tidak menjadikan Age Grade sebagai kategori Beast.

### Ambang Heaven Realm

Makhluk yang berusia **lebih dari 15.000.000 tahun** dipandang sebagai makhluk **Heaven Realm**, ranah para dewa yang kekuatannya berada di atas Spirit Primordial. Ini merupakan klasifikasi kedudukan/ranah makhluk, bukan Age Grade baru: usianya tetap masuk **Age Grade 9**. Jangan menganggap semua makhluk Age Grade 9 berasal dari Heaven Realm; usia aktual harus melewati ambang tersebut.

Age Grade juga tidak sama dengan warna Spirit Ring. Tentukan warna ring dari tabel warna resmi di `core/SPIRIT_RING_RULES.md`; tentukan Age Grade Beast dari tabel ini. Spirit Ring dari makhluk berusia 500.000 hingga 15.000.000 tahun mengikuti rentang warna yang ditetapkan di modul tersebut. Warna Spirit Ring dari makhluk Heaven Realm di atas 15.000.000 tahun belum ditetapkan dan tidak boleh ditebak.

## 1.4 Estimating Hunt Danger Without Invented Odds

When preparing a Spirit Beast hunt, the GM should estimate danger from the evidence available rather than assign an invented universal encounter percentage or difficulty score.

- **Habitat and access:** use the known regional module and `world/GEOGRAPHY_AND_TRAVEL.md`. Deep or hard-to-reach wilderness tends to contain higher-tier Spirit Beasts, but this is not a guarantee. Do not assume every forest has the same population or threat.
- **Target evidence:** distinguish confirmed species/age/tier from a report, rumor, track, or unverified sighting. A clue may be incomplete or misleading; do not turn uncertain information into a confirmed stat.
- **Party readiness:** compare the actual abilities, PowerScale, Qi, equipment, readiness, injuries, terrain, and coordination of the hunters with the target's established capabilities. Apply `gameplay/COMBAT_SYSTEM.md` for combat outcomes. The existence of a team is not itself a numeric bonus.
- **Route context:** an academy Safe Route should be selected to reduce avoidable danger for the group's demonstrated readiness, but it may still contain hazards or unexpected encounters. A Guild party can have uneven experience or hidden motives. A solo hunter has no team support or guaranteed rescue, but the actual risk still depends on their capability and preparation.
- **No automatic success:** hunting, defeating the Beast, securing the ring, and absorbing it are separate stages. Do not grant a guaranteed encounter, victory, ring ownership, or absorption.
- **No made-up odds:** if the available facts do not support a numeric chance, resolve the situation qualitatively or use the existing combat formula when a combat comparison is possible. Do not invent a new encounter chance, success percentage, age cap, or danger multiplier.

## 2. Persyaratan Item untuk Breakthrough

Persyaratan item pada bagian ini berlaku sebagai syarat breakthrough untuk menyerap Spirit Ring berikutnya, bukan syarat tambahan untuk kelayakan Mortal menyerap Spirit Ring pertama. Mortal dapat mencoba menyerap ring pertama setelah Awakening Martial Soul; ring harus tersedia melalui proses yang sah.

- Persyaratan item breakthrough bergantung pada Beast target dan sebaiknya dicatat pada entri Beast yang relevan ketika telah ditetapkan.
- Jika item wajib spesifik untuk Beast target belum tercatat, GM **wajib menetapkan requirement sementara untuk breakthrough agar dapat menyerap Spirit Ring target tersebut** berdasarkan dua hal: (1) tier/usia Spirit Ring yang hendak diperoleh, dan (2) jenis serta karakteristik Spirit Beast target. Jangan membiarkan requirement breakthrough kosong, jangan menganggap tidak ada syarat, dan jangan meminta keputusan pemilik hanya karena entri Beast belum lengkap.
- Pilih bahan atau item yang masuk akal dan relevan dengan jenis Beast serta tingkat ringnya; gunakan bahan/lore yang sudah ada bila tersedia. Semakin tinggi tier/usia ring dan semakin langka atau berbahaya karakteristik Beast, requirement harus mencerminkan kesulitan dan kelangkaan yang sepadan. Jangan menetapkan item yang tidak berkaitan hanya untuk menghalangi pemain.
- Nyatakan item yang dibutuhkan secara konkret, lalu perlakukan sebagai syarat wajib breakthrough untuk menyerap ring target itu. Requirement yang dibuat untuk menutup data yang kosong berlaku sebagai keputusan GM pada proses tersebut, bukan otomatis menjadi fakta permanen untuk semua Beast sejenis. Catat pada hasil/profil sesi; jadikan data kanon permanen hanya jika pemilik kemudian menyetujuinya.
- Item wajib breakthrough harus benar-benar dimiliki atau diperoleh melalui proses sah sebelum breakthrough yang mensyaratkannya dapat dilakukan. Untuk ring pertama, Mortal hanya perlu telah Awakening dan ring harus tersedia melalui proses yang sah; jangan menerapkan syarat breakthrough atau jeda antar-ring.
- Item yang dikonsumsi atau rusak selama proses harus dicatat sebagai konsekuensi hanya jika aturan atau kejadian yang sah menetapkannya.
- Mengalahkan Beast, memiliki ring yang muncul, atau mencapai bottleneck tidak menggantikan persyaratan item.

## Rujukan Status Spirit Ring Absorption

Gunakan pemetaan tunggal di `templates/CHARACTER_PROFILE_TEMPLATE.md`. Interval minimum pada tabel di bawah adalah sumber resmi `T_min`; perhitungan `Day left` dan pengecualian waktu Kultivasi mengikuti `gameplay/TIME_AND_ACTION_RULES.md` §7. Jeda minimum bukan jaminan keberhasilan penyerapan.

## 3. Jeda Minimum Antar-Penyerapan Spirit Ring

Jeda dihitung dari waktu penyerapan Spirit Ring sebelumnya yang berhasil sampai waktu paling awal penyerapan ring berikutnya. Jeda minimum awal yang berlaku bertingkat:

| Penyerapan berikutnya | Jeda minimum |
|---|---:|
| Ring 1 → Ring 2 | 2 minggu |
| Ring 2 → Ring 3 | 1 bulan |
| Ring 3 → Ring 4 | 3 bulan |
| Ring 4 → Ring 5 | 6 bulan |
| Ring 5 → Ring 6 | 1 tahun |
| Ring 6 → Ring 7 | 2 tahun |
| Ring 7 → Ring 8 | 3 tahun |
| Ring 8 → Ring 9 | 4 tahun |

Jeda ini adalah waktu minimum, bukan jaminan bahwa penyerapan akan berhasil. Setelah penyerapan berhasil pada Ring 1–8, mulai cooldown berikutnya saat itu juga dengan `T_eligible = 0`. Setelah Ring 9, tidak ada cooldown lanjutan karena Spirit Realm 9 adalah batas maksimum. Gunakan hanya rumus di `gameplay/TIME_AND_ACTION_RULES.md` §7; waktu Kultivasi dikecualikan sepenuhnya. `Belum ditetapkan Day left` hanya untuk riwayat lama yang diketahui memiliki penyerapan berhasil tetapi catatan waktunya tidak cukup. Untuk ring kedua hingga kesembilan, `Day left = 0` wajib dipenuhi terpisah dari Sync, ketersediaan ring, item, toleransi tubuh, dan syarat resmi lain.

Jika penyerapan dipaksakan sebelum jeda minimum, GM wajib menetapkan deviasi minimal dan menentukan tingkatnya berdasarkan seberapa besar jeda yang dilanggar, kondisi tubuh, serta bukti yang tersedia. Deviasi dapat ringan hingga berat. Jangan mengarang angka peluang atau jumlah damage yang tidak memiliki rumus resmi.

## 4. Deviasi Saat Menerobos

Untuk percobaan menerobos, hitung jarak dari Sync progress saat ini ke cap kompatibilitas ring aktif:

`Gap = Cap kompatibilitas - Sync progress saat ini`

Syarat bottleneck hanya terpenuhi jika Gap kurang dari 10 poin persentase. Gap yang lebih besar atau sama dengan 10 poin persentase berarti syarat bottleneck belum terpenuhi dan percobaan menerobos tidak sah.

Semakin besar Gap di dalam rentang yang diizinkan, semakin tinggi tingkat deviasi. Jika Gap nol atau sangat kecil, jangan menyimpulkan deviasi pasti nol; periksa juga jeda minimum, item, toleransi tubuh, dan syarat resmi lainnya.

Setiap deviasi wajib dicatat sesuai `core/SPIRIT_RING_RULES.md` §5, yang merupakan satu-satunya sumber formula numerik untuk deviasi. Catat tingkat deviasi, pengurangan cap ring berikutnya, kehilangan HP aktual, kategori risiko, cedera, dan kondisi tubuh. Jangan menyalin atau menghitung ulang formula di modul bestiary. Pengurangan cap akibat deviasi dan durasi pemulihan tetap berbeda dari formula cap awal §6.1; jangan mencampur keduanya. Cedera yang timbul harus diklasifikasikan dan dipulihkan menurut `core/INJURY_SYSTEM.md`; kategori risiko HP bukan diagnosis cedera.

## 5. Catatan Setelah Proses

Catat tanggal/waktu penyerapan berhasil, nomor ring, jeda sejak penyerapan sebelumnya, item wajib yang digunakan jika ada, cap kompatibilitas ring, Sync progress, serta semua deviasi, damage HP, dan cedera yang terjadi. Gunakan profil karakter yang tersedia; jangan menambahkan field profil baru tanpa persetujuan pemilik.

## 6. Konsistensi Sumber

Gunakan istilah **Spirit Realm** secara konsisten untuk tingkat kultivasi; `Mortal` adalah status dasar sebelum sembilan Spirit Realm, bukan Spirit Realm 0.

- Gunakan `core/SPIRIT_RING_RULES.md` §6.1 untuk penalti kesenjangan tier, penalti tubuh/Martial Soul, bonus hasil combat/metode, dan formula penyerahan sukarela; jangan gunakan faktor A lama atau menghitung bonus yang sama dua kali.
- Gunakan `core/CULTIVATION_SYSTEM.md` untuk Spirit Realm, bottleneck, dan syarat menerobos.
- Gunakan `core/HP_SYSTEM.md` dan aturan pertarungan resmi untuk damage HP jika mekanik tersebut tersedia.
- Gunakan entri Beast yang sah untuk persyaratan item spesifik.
- Jika aturan penting belum tersedia, nyatakan keterbatasannya dan jangan mengarang fakta canon.


## Universal Tier Assessment and Appraisal

The beast's official tier, when already established in canon, must be used exactly as recorded. Do not infer a beast tier from its name alone or recalculate an official tier. If a specific beast/specimen has no established tier or its tier is uncertain, use `core/TIER_ASSESSMENT_AND_APPRAISAL.md`.

The GM may provide a provisional scored estimate only when at least three assessment dimensions have reliable evidence; label it `Prediksi GM` and record the score/evidence. Otherwise, mark `Tier belum ditetapkan — appraisal diperlukan`. A completed Merzkava Appraisal Authority (MAA) ruling takes priority for that exact examined specimen when canon was previously uncertain. A ruling for one specimen does not automatically classify every beast of the same species. This appraisal system does not replace Spirit Realm, Spirit Ring tier/age, absorption requirements, combat mechanics, or any official beast classification.



---

<!-- SOURCE core/10_ECONOMY_SYSTEM.md | upstream blob 0cc74b40d07ad8b2fe9fd2e4c37cdad1c0269456 -->

# Merzkava Universe — Economy System
Status: Official system module. This document defines currency, item-quality tiers, regional pricing, distribution, seasonal scarcity, and local market adjustments.

## 1. Official Currency

Currency abbreviations are standardized as follows:

- `xc` = Xuan Copper
- `xs` = Xuan Silver
- `xg` = Xuan Gold
- `zj` = Zun Jade
- `az` = Ancient Zun

### Fixed exchange rates

- 100 Xuan Copper (`xc`) = 1 Xuan Silver (`xs`)
- 100 Xuan Silver (`xs`) = 1 Xuan Gold (`xg`)
- 1,000 Xuan Gold (`xg`) = 1 Zun Jade (`zj`)
- 10 Zun Jade (`zj`) = 1 Ancient Zun (`az`)

These are the official nominal exchange rates. Do not change them during ordinary gameplay unless the repository owner explicitly revises this module.

### Zun Jade

Zun Jade is an octagonal coin made from Heavenly Meteorite. Its surface bears intricate formations that emit white light. The material is so old and hard that people of the current era cannot engrave or rework its surface.

Zun Jade is currency, not a cultivation tool or a crafting material. It cannot be used as a cultivation tool or as material for creating an Artificial Artifact.

### Ancient Zun

Ancient Zun is a hexagonal coin made from an ancient heavenly material that appeared only once, when the Heaven Realm opened in the distant past. No metal can match its material, including metals originating beyond the world. Its intricate surface formations emit a purer white light than Zun Jade.

The original material cannot be reproduced from a known later source, and people of the current era cannot engrave, alter, or process its surface. Ancient Zun is currency only: it cannot be used as a cultivation tool or as material for creating an Artificial Artifact. Its nominal exchange rate remains 1 Ancient Zun = 10 Zun Jade.

Do not invent additional abilities, cultivation effects, crafting uses, or ways to manufacture either currency.

## 1.1 Martial Soul Awakening Routes, Charges, Subsidy, and Debt — Golden Dragon Empire

The Golden Dragon Empire recognizes two distinct routes. **Do not mix their charges.** The every-two-year public outreach route is an Imperial-subsidized service; the independent route is paid by the individual. These rules apply only to the Golden Dragon Empire unless another territory adopts its own rules.

### Route A — Independent Paid Awakening

An individual may seek an available awakening facility independently rather than wait for the next public village visit. The individual pays the full standard amount:

| Charge | Standard amount | Rule |
|---|---:|---|
| Awakening service fee | **3 xg, 25 xs** | Charged once per individual |
| Service tax | **8% of the service fee** | Applied only to the service fee; equals 26 xs |
| Documentation and official record | **15 xs** | One set per individual awakening |
| Official awakening proof token | **10 xs** | Issued after the result is recorded |

At 100 xs = 1 xg, the independent route costs **3 xg, 76 xs total** (376 xs). No additional charge may be invented without an established rule.

### Route B — Biennial Imperial Public Awakening

The Golden Dragon Empire's public awakening visit generally occurs once every two years after New Year, with assigned officials or cultivators visiting villages according to local quotas and schedules.

- The Imperial subsidy covers the **awakening service fee, the 8% service tax, and documentation/official record**. The recipient pays **only the 10 xs proof-token fee**.
- This is the defined subsidy for the biennial public route; it is not a discretionary waiver that must be separately approved by each village. The public program must account for the subsidized service and documentation costs against its authorized Imperial budget.
- If a person cannot afford the 10 xs token fee, the token may still be issued through an **external lender's advance**. The lender pays or advances the token charge to the issuing service, and the person receives a written debt note for the exact amount advanced. The lender is **not the Golden Dragon Empire, the Hall, or an Imperial ministry**.
- The Golden Dragon Empire does not own, guarantee, set, or collect the private loan, and the subsidy does not cover private-loan interest. The debt note must identify the actual external lender, principal, rate, repayment schedule, due dates, and consequences disclosed by that lender. Never invent a loan or debt unless the character actually accepts/enters it in play.
- Choose from external financial organizations that plausibly operate in the local area. The available lender and its terms are randomized from the locally available organizations; do not always choose the cheapest lender. Ordinary reputable lenders commonly charge **3%–8% simple annual interest**; an unlucky draw may result in a high-cost lender charging **12%–24% simple annual interest**. These are canon gameplay bands for this token-fee debt, not a claim that every lender in the world uses them. The selected organization's stated rate applies to that loan; do not reroll after seeing the rate.
- Interest is simple annual interest on the outstanding principal, unless the signed debt note explicitly establishes a different lawful calculation. Do not compound interest or add fees, collateral, penalties, or collection powers that are not specified in the actual debt note. For a note lasting less than a year, calculate proportionally by elapsed time.
- The loan principal is limited to the unpaid portion of the **10 xs token fee**. Do not turn a small token advance into an invented large loan, or include the subsidized service fee, tax, or documentation in the debt.

### Token, Records, and Employment Consequences

- The official proof token is a durable physical token linked to the individual's awakening record. It helps verify completion when applying for basic employment and education. It does not guarantee a job, admission, scholarship, income, or preferential treatment based on rarity.
- Documentation records the identity as provided/verified, awakening date and place, issuing authority, unique token/record identifier, and confirmed awakening result. Do not invent extra mandatory identity documents or a universal public database.
- Defaulting on the external loan can damage the person's credit reputation with that lender and, where lenders or employers lawfully share or check such records, make it much harder to obtain decent-paying work, secure future credit, and maintain an adequate standard of living. This is a serious socioeconomic consequence, **not** an automatic legal ban across the Golden Dragon Empire on employment or proof that every employer rejects the person.
- Exact default procedures, lawful collection methods, credit-sharing practices, and any additional fees depend on the actual external lender and applicable local rules. Do not invent imprisonment, confiscation, universal blacklisting, or automatic wage seizure.
- Do not charge the initial documentation or token fee twice for the same awakening. Replacement-token charges and correction fees are not established here.
- These costs, subsidies, and debts do not change rarity odds, mutation odds, or awakening outcomes. Paying more or using a city facility does not improve the result.
- Record each actual service charge, subsidy expenditure, token payment, loan advance, debt-note agreement, interest accrual, and repayment in the relevant financial ledger. Do not deduct money from a character's Wallet unless a real transaction occurred and was recorded. A debt note is a liability, not cash income; show it separately from Wallet balance.

### Unidentified item display and pricing

If an item's identity, exact type, or relevant properties have not yet been established by canon or the GM, display it as ``Unknown`` **membutuhkan appraisal untuk lebih pastinya** in Inventory, Equipment, loot, transactions, and player-facing item descriptions. Use this exact label consistently; do not substitute `???`, `Belum ditetapkan`, or another generic placeholder for the unidentified item itself. Do not infer its price, quality tier, scarcity, effects, or danger from this label. Do not finalize an item-specific price or transaction-dependent description until the required identity/details are established; ordinary market items with known identities continue to use normal pricing without mandatory appraisal. Follow `core/TIER_ASSESSMENT_AND_APPRAISAL.md` for identification and appraisal. After appraisal, update only the facts actually established by the ruling.

## 2. Nine Item-Quality Tiers

Quality tier and scarcity are separate variables. A high-quality item is not automatically scarce, and a common-quality item can become scarce due to seasonal conditions or disrupted supply.

The following multipliers are the default quality-price multipliers. Tier 1 is the reference tier:

| Quality Tier | General category | Price multiplier |
|---|---|---:|
| Tier 1 | Common: basic snacks, roadside food, ordinary herbs | ×1.00 |
| Tier 2 | Standard: modestly better than common quality | ×1.30 |
| Tier 3 | Good: above-average quality | ×1.70 |
| Tier 4 | Excellent: clearly superior quality or workmanship | ×2.20 |
| Tier 5 | Premium: high-quality goods | ×2.90 |
| Tier 6 | Rare-grade quality: high quality with limited production | ×3.80 |
| Tier 7 | Superior: exceptional quality | ×5.00 |
| Tier 8 | Peak quality: extraordinary quality | ×6.60 |
| Tier 9 | Legendary quality: highest category in this classification | ×8.50 |

These are economic quality categories, not Spirit Realms, Spirit Beast tiers, Spirit Ring tiers, or automatic measures of combat power. Tier 9 does not automatically mean the item is scarce or unique. For ordinary goods, select the fitting category from their clear description and ordinary market role; a missing formal tier record does not trigger specialist appraisal. Use `core/TIER_ASSESSMENT_AND_APPRAISAL.md` when a special, disputed, unidentified, or consequential classification cannot be resolved from canon and ordinary market evidence. A valid MAA appraisal is authoritative for the exact examined item, while a GM estimate must remain explicitly labeled as provisional. Never infer scarcity or price from tier alone.

An item’s base price is specific to its type, size, condition, freshness, function, and region of origin. Items of the same quality tier can have different base prices.

## 3. Regional Base Price

Every priced item should have:
1. An item identity and a reasonable quality category. For ordinary goods, use the fitting routine category (commonly Tier 1 for basic snacks, roadside food, and ordinary herbs) when the description supports it; do not require specialist appraisal.
2. A local base price for Tier 1 (or an explicitly documented base price for its actual tier).
3. A region of origin or a clearly identified local market.
4. Relevant seasonal supply conditions, if known and material.
5. A distribution route or distribution adjustment when traded outside its local market.

Specialist tier appraisal is reserved for unusual, disputed, unidentified, or mechanically/economically consequential goods whose classification cannot be settled from canon and ordinary market evidence. A missing formal appraisal record does not make the quality of every everyday item unknown.

The base price is the ordinary local price in the region where the item is sourced, under normal seasonal conditions and ordinary market conditions. Do not treat one region's price as the universal price for the entire world.

Example: Snow Herb has a Tier 1 normal local base price of 5 xc in the northern region.

## 4. Seasonal Scarcity

Seasonal scarcity changes the available supply of an item according to its source, growing or harvesting conditions, storage life, and season. Different items can respond differently to the same season. Do not apply one global seasonal effect to every item.

Default scarcity multipliers:

| Supply condition | Multiplier | Tier 1 example when base price is 5 xc |
|---|---:|---:|
| Normal supply | ×1.00 | 5 xc |
| Mild scarcity | ×1.40 | 7 xc |
| Moderate scarcity | ×1.80 | 9 xc |
| Severe scarcity | ×2.40 | 12 xc |
| Extreme scarcity | No fixed multiplier | Determine from actual remaining stock, available supply routes, and recorded market transactions |

For the first four states, the multiplier applies to the item's quality-adjusted base price. Extreme scarcity has no universal fixed price; the GM must use grounded local circumstances and avoid arbitrary price jumps.

### Disaster-Driven Scarcity

A recorded disaster can intensify scarcity when it demonstrably damages production, stored goods, harvests, transport routes, market access, or other parts of the supply chain. Use the following disaster-impact multiplier as a guide to the resulting scarcity of each affected item in the affected market:

| Disaster impact on the item's supply | Disaster scarcity multiplier |
|---|---:|
| Minor disruption | ×1.10–1.25 |
| Moderate disruption | ×1.30–1.60 |
| Major disruption | ×1.70–2.20 |
| Catastrophic disruption | ×2.30–3.00 |

These are bounded ranges, not automatic prices or a multiplier applied to every good in the region. Choose a value within the relevant range using recorded damage, remaining stock, duration, access to alternative suppliers, and the condition of supply routes. Use the lower end when reserves or alternate routes cushion the shock; use the upper end when the item is directly affected and substitutes are scarce. The catastrophic range is the maximum default disaster-driven scarcity multiplier; exceeding ×3.00 requires explicit owner-approved canon.

**Integration rule:** the pricing formula uses one effective Scarcity Multiplier. Assess the ordinary seasonal scarcity and the disaster's actual supply impact together, then select the effective multiplier that represents the resulting shortage. Do not multiply a seasonal scarcity multiplier by a disaster multiplier when both describe the same shortage. If clearly independent supply pressures affect the item, explain the evidence and account for their combined effect only once in the effective scarcity assessment.

Apply the disaster effect only to goods whose supply is affected. A flooded grain route may raise grain prices without raising the price of unrelated locally produced tools. Markets outside the disaster area may experience a smaller increase or none, depending on their inventories, routes, and suppliers. Do not apply the same disruption again as a second local-market or demand adjustment.

Disaster scarcity persists only while the recorded supply disruption remains consequential. It must ease as stock, production, and routes recover; do not reset prices instantly when the immediate disaster ends, and do not continue the increase after recovery is established. Record the event and its scope in `world/DYNAMIC_EVENTS.md` when its consequences meet that module's persistence criteria. The event record establishes the cause and ongoing status; this economy module determines the price calculation.

## 5. Distribution and Destination-Market Adjustment

Distribution adjustment includes reasonable transport and trade costs, such as caravan or ship fees, handling, storage, spoilage, tolls, insurance, and route risk. It can be positive or negative relative to the reference route, but the chosen adjustment must be grounded in the route and current conditions.

A destination market may also adjust prices because of:
- Local inventory surplus or shortage.
- Demand changes.
- Competition between merchants.
- Blocked routes, war, storms, piracy, or other supply disruptions.
- Alternative local or regional suppliers.

Do not assume that a farther region must always have the highest price. A safe, efficient sea route or abundant destination stock can make an item cheaper there than in another region.

## 5.1 Approved Inter-Power Passenger Transit Fares

The following owner-approved fares are fixed baseline prices for the named transport services. They are per passenger for the complete round trip, not one-way and not per aircraft.

| Service | Round-trip fare per passenger | Power source / service |
|---|---:|---|
| Tianhai Yunzhou long-distance liquefied-energy passenger aircraft | 25 xc | Tianhai Yunzhou-refined liquefied energy; dedicated corridors between Longyuan Sky Transit Terminal, Beiming Heartland Sky Transit Terminal, and Cangqiong Sky Transit Terminal |
| Comparable ordinary Qi-powered flying ship | 86 xc | Qi propulsion; ordinary inter-power flying-ship service |

Rules:
- The Tianhai Yunzhou energy-aircraft service has greater passenger capacity per journey than an ordinary Qi-powered flying ship.
- These prices apply to the established comparable inter-power passenger journey and the full return trip. Do not interpret them as one-way fares.
- The 25 xc fare is supported by Tianhai Yunzhou's specialized energy-refining and distribution advantage; it does not imply that other powers can freely manufacture the same fuel or operate compatible aircraft.
- Exact flight durations, schedules, seating capacity, cargo rates, premium classes, taxes, and disruption surcharges remain unestablished. Do not invent them as fixed canon.
- Refer to `world/REGION_TIANHAI_YUNZHOU.md`, `world/GEOGRAPHY_AND_TRAVEL.md`, and `world/ARTIFICIAL_ARTIFACTS.md` for route and technology details.

## 6. One Unified Item Pricing Formula

Use **one formula only** for ordinary item pricing. Do not calculate separate competing prices from different sections, and do not apply the same market factor twice.

`Final Price = (Tier 1 Base Price × Tier Multiplier × Condition Multiplier × Scarcity Multiplier × Demand Multiplier) + Distribution Adjustment + Local Market Adjustment`

Calculate in this order:

1. **Tier 1 Base Price** — the item's ordinary local price in its source market under normal seasonal and market conditions. Set it according to the item's identity, type, size, function, freshness, and region; it is not a universal price shared by every item.
2. **Tier Multiplier** — use the official quality multiplier in §2: Tier 1 ×1.00, Tier 2 ×1.30, Tier 3 ×1.70, Tier 4 ×2.20, Tier 5 ×2.90, Tier 6 ×3.80, Tier 7 ×5.00, Tier 8 ×6.60, Tier 9 ×8.50. Quality tier does not itself establish scarcity, rarity by quantity, or combat power.
3. **Condition Multiplier** — assess the actual item condition, not its tier: damaged but usable ×0.70; worn or partly impaired ×0.85; ordinary usable condition ×1.00; unusually well-preserved and verified ×1.10. Apply the category supported by inspection, canon, or appraisal. If the item is spoiled or unusable, do not treat it as an ordinary saleable item; follow the item's specific rules. Do not add a separate antique/historical premium under condition unless an official appraisal or item-specific canon supports it.
4. **Scarcity Multiplier** — use the effective scarcity for the relevant supply market under §4, including seasonal conditions and any documented disaster-driven supply disruption. For a disaster, use the impact bands in §4's **Disaster-Driven Scarcity** table (×1.10–1.25 minor, ×1.30–1.60 moderate, ×1.70–2.20 major, ×2.30–3.00 catastrophic) when supported by the actual effect on the item's supply. This is one effective multiplier, not an automatic extra factor: do not multiply seasonal and disaster values when they represent the same shortage. Extreme scarcity without a defensible fixed multiplier must be priced from remaining stock, actual supply routes, and recorded market conditions. Reduce or omit the effect when destination stock or alternative suppliers support that decision.
5. **Demand Multiplier** — assess current demand for this specific item in the relevant market: weak demand ×0.80; ordinary demand ×1.00; high demand ×1.20; very high demand ×1.50. An exceptional, time-limited demand spike may reach ×2.00 only when a concrete event or recorded market evidence supports it. Record the reason. Do not reuse demand already counted in another factor, and do not apply an exceptional multiplier merely because an item is valuable.
6. **Distribution Adjustment** — add the supported net cost or saving for the actual trade route, including transport, handling, storage, spoilage during transport, tolls, insurance, and route risk. It may be positive or negative.
7. **Local Market Adjustment** — add a documented destination-specific amount for factors not already represented above, such as merchant competition, a local inventory surplus, or a market-specific restriction. Do not count seasonal scarcity, demand, or transport costs again here if they have already been included in their dedicated factors.

If an essential input is unknown, identify it and give a clearly labeled provisional estimate only when available local evidence supports one. Do not fabricate a precise price or present an illustrative example as a universal market price. For routine goods, a reasonable estimate must still be tied to the specific local market and ordinary market evidence; if the scene supplies no defensible price, do not invent a fixed canon price—describe the quote as provisional or let the merchant state a price as a new scene fact. Round only at the final step to a usable amount in the official currency, then normalize denominations using the official exchange rates.

### Worked Example: Snow Herb in Different Supply Conditions

Assume Snow Herb has a Tier 1 normal local base price of 5 xc in the northern source market, Tier 1 quality (×1.00), ordinary usable condition (×1.00), ordinary demand (×1.00), and no additional local-market adjustment. Distribution adjustments are +4 xc to the Golden Dragon Empire and −1 xc to Tianhai Yunzhou because that route is unusually efficient and supply is abundant.

| Supply condition | North | Golden Dragon Empire | Tianhai Yunzhou |
|---|---:|---:|---:|
| Normal (×1.00) | 5 xc | 9 xc | 4 xc |
| Mild scarcity (×1.40) | 7 xc | 11 xc | 6 xc |
| Severe scarcity (×2.40) | 12 xc | 16 xc | 11 xc |

These are illustrative results under the stated assumptions. In actual play, use verified condition, demand, local inventory, alternative suppliers, and route conditions. The table does not establish universal prices for Snow Herb in every market.

## 7. Mandatory GM Rules

1. Check the economy module whenever buying, selling, bargaining over prices, appraising goods, or updating a character's currency.
2. Use the correct item tier, regional base price, seasonal scarcity, distribution route, and local market conditions. Do not use a universal price for all regions.
3. Keep quality tier separate from scarcity, rarity by quantity, item power, and cultivation rank.
4. Do not change the official exchange rates without an explicit canon revision.
5. Do not invent past money, transactions, price history, stock, or merchant costs. Starting Wallet assignment is part of the unified new-character profile bootstrap defined in `templates/CHARACTER_PROFILE_TEMPLATE.md`, not a separate economy-only process. For a new character with no explicit starting balance, choose one concrete, conservative estimate based on the character's stated background, living conditions, family circumstances, known work or livelihood, responsibilities, assets, and plausible local access to money. Mark it as a GM estimate in the initial profile notes; do not invent prior earnings or transactions to justify it. If the background is sparse, use the most reasonable conservative estimate rather than a random draw. An explicitly provided or already recorded starting balance always takes precedence and must never be recalculated. Normalize the chosen amount using official exchange rates, record it once in the character snapshot, and keep it fixed. Once established, currency changes occur only through supported, recorded transactions.
6. When an exact price cannot be derived because an essential input is unknown, state the missing input or provide a clearly labeled estimate rather than pretending the value is fixed canon.
7. Keep the character profile's currency balances in the required compact format: `Wallet (wealth): ... xc | ... xs | ... xg | ... zj | ... az`. For a new character, assign and save the Wallet as part of the same unified profile bootstrap described in `templates/CHARACTER_PROFILE_TEMPLATE.md`; do not run a separate money draw or save path. A valid explicit or saved balance must be copied exactly.
8. The currency abbreviations defined in §1 are official. The character profile template must not duplicate their definitions.


### Tier Verification for Goods and Appraisal Services

Before pricing or recording an item, check relevant canon and market information. For ordinary goods whose identity and quality are clear, assign the fitting routine economic category from §2 (for example, basic roadside food may be Tier 1) and calculate the price with the single formula in §6; a formal canon entry or MAA appraisal is not required for every everyday item. If a meaningful special classification is uncertain, follow `core/TIER_ASSESSMENT_AND_APPRAISAL.md`: use an existing canon classification, then a completed MAA ruling for that exact examined item, or a clearly labeled provisional GM prediction only when evidence is sufficient. If the classification is consequential and evidence is insufficient, leave that special classification unresolved and seek appraisal when practical; do not block an ordinary transaction solely because no specialist tier has been recorded. Do not invent appraisal fees, taxes, or service charges: use an established local price or resolve the service's actual terms before changing Wallet. A tier assessment does not itself create a purchase, sale, ownership transfer, or price.

### Mandatory Transaction Log / Ledger

Every character income and expense MUST be recorded in a continuous transaction log (ledger). This is mandatory for all money entering or leaving a character's Wallet, including purchases, sales, rewards, wages, fees, gifts, taxes, loans, repayments, refunds, and other supported transfers. Do not change the Wallet balance for a transaction until its cause and ledger entry are established.

Each ledger entry must record:
- **Date/time:** the in-world timestamp of the transaction, consistent with the session calendar.
- **Transaction:** a concise description and the reason it occurred.
- **Source / recipient:** who paid, received, sold, bought, or charged the amount, when known.
- **Direction:** income or expense.
- **Amount:** the exact amount and denomination paid or received.
- **Conversion:** when currency is exchanged, the denominations, official exchange rate, and normalized result.
- **Balance before:** the character's confirmed Wallet balance immediately before the transaction.
- **Balance after:** the exact Wallet balance immediately after the transaction, in all five official denominations.
- **Evidence / cause:** the gameplay action, event, agreement, or other valid basis authorizing the transaction.

Use this entry format:

`[Date/time] | [Income/Expense] | [Source/Recipient] | [Reason] | [Amount] | [Conversion, if any] | Before: [xc | xs | xg | zj | az] | After: [xc | xs | xg | zj | az] | Cause: [gameplay event/action]`

Ledger requirements:
1. Record every income and expense as its own entry when it occurs. Do not merge separate transactions into one vague total.
2. Keep entries chronological and append-only. Never silently delete, rewrite, or invent historical transactions. If a genuine error is found, preserve the original entry and add a clearly identified correction entry that explains the error and its effect on the balance.
3. Verify that each entry's opening balance matches the previous confirmed closing balance, and calculate the closing balance using the official exchange rates. The Wallet displayed in the character profile must match the latest verified ledger balance.
4. The one-time bootstrap balance is an opening balance, not a fictional income transaction. Record it as the ledger's opening-balance entry with its source (character snapshot, valid Authority instruction, or one-time bootstrap draw); do not invent past earnings to explain it.
5. For a continuing session, resume from the latest available gameplay profile and ledger, then append only supported transactions that occurred afterward. Never reroll the opening balance or reconstruct missing transactions from guesses.
6. If a previous ledger is unavailable or a balance discrepancy cannot be resolved from recorded evidence, state the gap and use the latest verifiable balance as the reconciliation point. Do not fabricate entries or claim the ledger is complete beyond the evidence available.
7. The ledger is the transaction audit trail; it does not replace the Wallet field in the character profile and does not create a separate Wallet module. Maintain it in the ongoing session record/history so it can be continued and checked across turns. Do not claim that it has been permanently saved to GitHub unless the repository write was actually completed and verified.
8. Before finalizing any gameplay response involving money, verify that the transaction has a ledger entry, the balance calculation is correct, and the displayed Wallet matches the ledger. If the transaction cannot be supported or reconciled, do not invent a result.


### Mandatory Item Movement Log / Ledger

Every change to a character's item holdings MUST be recorded in a continuous item log/ledger, alongside the relevant gameplay history. This applies to all items and stackable materials, including equipment, consumables, currency-like objects treated as items, crafting materials, loot, quest items, relics, artifacts, and other inventory contents. Record changes to building Assets separately from carried Inventory when the item or property belongs there.

Record each event that changes ownership, quantity, condition, or location, including acquisition, purchase, reward, loot, gift, trade, sale, use, consumption, crafting, dismantling, transfer, storage, retrieval, loss, theft, breakage, destruction, or disposal. Do not change Inventory, Equipment, or Assets until the event has a valid cause and its log entry can be established.

Each item-ledger entry must record:
- **Date/time:** the in-world timestamp consistent with the session calendar.
- **Item:** exact item name and, where relevant, quality/tier, variant, unique identifier, durability/condition, or other distinguishing traits.
- **Action:** acquired, removed, used, consumed, crafted, transferred, damaged, destroyed, or other precise change.
- **Quantity:** exact amount added or removed, including unit or stack size where relevant.
- **Source / destination:** seller, buyer, giver, recipient, loot source, storage location, crafting result, or other known origin/destination.
- **Reason / cause:** the gameplay action, event, agreement, recipe, or other valid basis for the change.
- **Quantity before and after:** the character's confirmed quantity immediately before and after the event; for unique items, record the state/condition before and after instead of inventing stack counts.
- **Related transaction:** link or cross-reference the matching money-ledger entry whenever the item movement involves payment, sale, refund, fee, or another Wallet transaction. Record the matching entry ID/time or explicitly state that no money changed hands.
- **Resulting location/state:** Inventory, Equipment, Assets, storage, another holder, consumed, destroyed, or another established state.

Use this entry format:

`[Date/time] | [Item + distinguishing details] | [Action] | [Quantity: +/− amount] | [Source/Destination] | [Reason/Cause] | Before: [quantity/state] | After: [quantity/state] | Money ledger: [entry reference / no money changed hands]`

Item-ledger requirements:
1. Record each distinct item movement or state-changing event as its own chronological entry. Do not merge unrelated item changes into a vague summary.
2. Keep the ledger append-only. Never silently delete, rewrite, or invent past item movements. If an error is confirmed, preserve the original entry and append a clearly identified correction with its reason and effect.
3. Each item's opening quantity/state must match the previous confirmed closing quantity/state. The current Inventory, Equipment, and relevant Assets shown in the character profile must match the latest verified item ledger.
4. Starting items come from the applicable character snapshot, valid Authority instruction, or established session state. Record them as an opening inventory baseline, not as fabricated acquisitions during gameplay.
5. For a continuing session, resume from the latest available gameplay profile and item ledger, then append only supported changes that occurred afterward. Never reconstruct missing item history from guesses.
6. If an item ledger is unavailable or a discrepancy cannot be resolved from recorded evidence, state the gap and use the latest verifiable inventory/profile as the reconciliation point. Do not fabricate missing transactions or claim the ledger is complete beyond available evidence.
7. Money and item records must cross-reference one another when part of the same exchange. A purchase or sale is not consistent until both the money movement and the item movement are recorded and reconciled. For crafting, record the inputs consumed and outputs created, and verify the relevant crafting rules before changing quantities.
8. An item being used, consumed, equipped, damaged, or moved does not automatically mean it is destroyed or removed permanently; record only the change supported by the relevant mechanics and event.
9. The item ledger is an audit trail, not a replacement for the character profile's Inventory, Equipment, or Assets fields and not authorization to create a separate profile field or module. Maintain it in the ongoing session record/history so it can be continued and checked across turns.
10. Before finalizing any gameplay response that changes items, verify the item-ledger entries, quantities and resulting states, related money-ledger entries, and displayed profile. Do not claim the ledger has been permanently saved to GitHub unless the repository write was actually completed and verified.

### Unified Ledger, Natural Change Markers, and Immersive Narration

The money and item ledgers above are mandatory audit records. The same reporting standard applies to every actual Satiety change and every tracked change to Equipment, loot, or Assets. Keep the full chronological, append-only audit trail in ongoing session history; the visible block is a compact player-facing summary, not proof of a GitHub write.

**Required response order:** immersive in-world narration and relevant active dialogue → natural in-narrative report of each verified change with before → signed change → after → inline-code `Log tercatat!` exactly once after the report → one combined visible `LEDGER LOG` → reconciled character profile. A transaction must be described naturally in the narration itself, not hidden in the ledger alone. During passive player conversation, keep the scene alive with relevant sensory detail, active NPC dialogue/reactions, and local activity supported by canon, location, time, NPC knowledge, and established agendas. Do not force random events, invent facts, or take control of the player's character.

**Inline change-marker convention:** place the marker inside the natural narrative/change-report sentence:
- **🝰 MASUK · [item/uang + jumlah]** ⧟ ``*<Tier/Grade/Rarity/Quality/Unknown>*`` [keterangan jika relevan] for a verified increase to the player's holdings/balance.
- **🝰 KELUAR · [item/uang + jumlah]** ⧟ ``*<Tier/Grade/Rarity/Quality/Unknown>*`` [keterangan jika relevan] for a verified decrease, expense, consumed item, outgoing transfer, loss, or sale.
- For an exchange, show separate MASUK and KELUAR markers in the same narrative report, then use one combined ledger block. Use `🝰 PERUBAHAN` only for a verified condition/location change that is neither an inflow nor an outflow.
- Include only supported, relevant attributes. For an unidentified item, use the exact name ``Unknown`` **membutuhkan appraisal untuk lebih pastinya**; never invent its tier, grade, rarity, quality, price, or function. Ordinary goods with clear identities may use routine market categories; missing specialist appraisal alone does not make an everyday item's identity unknown.
- After the complete verified change sentence, write **`Log tercatat!`** exactly once. It confirms a session-ledger entry, not a GitHub write. Do not add another confirmation line.

**Example pattern only (replace all values with verified session state):** “Pedagang itu menerima 23 xc dan menyerahkan satu roti. Wallet: [saldo awal] → −23 xc → [saldo akhir]; Inventory: 0 → +1 roti → 1. **🝰 KELUAR · 23 xc** ⧟ ``*Xuan Copper*`` · **🝰 MASUK · 1× roti** ⧟ ``*Tier 1*`` / ``*kualitas rutin*``. **`Log tercatat!`**” For Satiety changes, include before → delta → after and the cause/duration or consumed item when relevant. If Satiety does not change, still state its current value and why; do not create a ledger solely for an unchanged value.

Use this mobile-friendly visible format; include only affected fields and preserve before → change → after:

```text
╭─ LEDGER LOG · #[ID]
│ Peristiwa/Aksi: [aksi/peristiwa penyebab perubahan]
│ [Waktu] · [Berhasil/Gagal/Dibatalkan]
│ 🝰 Item/Equipment/Loot/Aset: [MASUK/KELUAR · nama · ×jumlah · ⧟ ``*tier/grade/rarity/quality/Unknown*`` [keterangan jika relevan] · sumber/tujuan · awal → perubahan → akhir]
│ 🝰 Uang: [MASUK/KELUAR · sumber/penerima · jumlah · saldo awal → perubahan bersih → saldo akhir · kembalian jika ada]
│ Satiety: [awal → ±delta → akhir · penyebab/kategori/durasi jika relevan]
╰─
```

For multiple item movements, use one concise subentry per distinct movement under the same event ID. For a payment with a larger denomination, reconcile amount handed over, price, change returned, and net expense. A purchase followed by immediate consumption is one combined event and one visible log, not separate logs for payment, Inventory, and Satiety.

Audit rules:
1. Record each distinct money transaction and item movement as its own chronological, append-only audit entry, even when linked under one visible event. Cross-reference related money/item entries.
2. Show one combined visible ledger for all state changes from the same action/event. Wallet, Inventory, Equipment, Assets, and Satiety must match the verified closing state.
3. If a transaction fails or is cancelled, do not record money/item changes that did not occur. Record only the verified portion of partial payment, deposit, debt, barter, refund, or transfer.
4. If no tracked state changed, omit both `Log tercatat!` and the visible ledger. Satiety must still be mentioned after the latest activity, even if unchanged. If an action changes more than one tracked domain, use one combined visible ledger for that event while keeping distinct chronological audit subentries for each money transaction and item movement.
5. Keep full Satiety calculation details in session history: cause, duration, activity category, every applied multiplier, calculation, before, signed change, and after. The visible log may stay concise.
6. Before sending, reconcile the cause, money and item entries, quantities, currency conversion/change, relevant item quality/tier, Satiety, and resulting profile. For a purchase followed by immediate use/consumption, link the payment and item movement/consumption as subentries under one visible event; reconcile bought = consumed + retained/leftover + separately evidenced loss. Do not leave a fully consumed item in Inventory, count consumption twice, or calculate Satiety from food merely ordered. If prior ledger history is missing or truncated, disclose the gap and reconcile from the latest verifiable state without inventing history.
7. The ledger is not a profile field and does not replace the character profile. Do not claim permanent GitHub persistence unless a repository write was completed and verified.

## 8. Global Wealth Distribution

The world-level baseline total and its territorial and social-holder allocations are defined in `world/WEALTH_DISTRIBUTION.md`. Social classes, housing insecurity, poverty, and social mobility are defined in `world/SOCIAL_STRATIFICATION.md`. The territorial table and social-holder table are two views of the same 400.463.763.789.849 xg total; never add them together. Land, sea, air markets and auction circuits are transaction channels, not additional ownership shares. This module remains the authority for exchange rates, prices, scarcity, transactions, and character currency balances. The global wealth tables do not establish the exact balance of any named character or organization.



---

<!-- SOURCE core/ARCANISTRY_AND_FORMULATION.md | upstream blob ef674a1fba92facd5e521f0fc7f08c7e730c7d2f -->

# MERZKAVA UNIVERSE — ARCANISTRY & FORMULATION SYSTEM

**Binding terminology:**
- **Arcanist** means a person who practices the discipline. Use it for individuals, occupations, professional roles, credentials, and the official progression labels **Arcanist Grade** and **Arcanist Focus**.
- **Arcanistry** means the complete discipline and practice: foundational study, research, teaching, formulation, engineering, and application. Use it for the field, its institutions, education, knowledge traditions, and applied work.
- **Arcanism** means the underlying principles, theoretical models, and explanatory doctrines that describe how arcane patterns, formulations, and their interactions function. Use it only when the specific subject is that body of theory or doctrine.
- **Relationship:** Arcanism is the theoretical body of knowledge studied within Arcanistry; it is not a separate profession, institution, progression track, or fifth tradition. An Arcanist studies and applies Arcanistry, including Arcanism where relevant.

Use each term according to its referent. Do not use Arcanist as the name of the discipline, Arcanistry as a person's title, or Arcanism as a synonym for the entire field. Arcanist Grade and Arcanist Focus remain the only official progression labels; these terms do not create or alter any tradition classification.

**Relationship to Spirit Realm traditions:** Arcanistry is independent of both Spirit Realm — Soul-Nyuma and Spirit Realm — Soul-Zoun. Arcanists may research, document, formulate, or engineer applications relevant to either tradition, but Arcanistry is not a third Spirit Realm doctrine and does not merge with either one. Spirit Realm tradition doctrine is defined in `core/SPIRIT_REALM_TRADITIONS.md`; Arcanist progression remains separate.

**Status:** Mandatory Arcanist progression and certification protocol integrated. Artificial Artifact condition scoring is formally defined in §14. Production success chance remains separate from the quality score; random-resolution procedure, situational success modifiers, numerical training costs, and other unresolved production parameters remain undefined until formally approved.


## MANDATORY ARCANISTRY PATH — SINGLE CANONICAL ROUTE

**This path is binding for every player character and NPC.** `core/ARCANISTRY_AND_FORMULATION.md` is the single authority for Arcanist progression, production chances, Artificial Artifact condition, and related maker requirements. Supporting files may explain institutional administration, regional lore, or catalogued artifacts, but may not create alternate progression routes or override this module.

1. **Foundational instruction:** learn Arcanistry theory from a real, qualified teacher or recognized educational source that genuinely teaches it. Self-study alone, talent, wealth, cultivation, possession of artifacts, or narrative declaration cannot replace instruction.
2. **Mandatory focus training:** complete the assessed stages in order: Pemula → Initiate → Beginner → Ordinary → Ahli → Expert. A stage is awarded only after the actual teacher/institution assesses the student's demonstrated progress.
3. **Apprentice gate:** passing the required Initiate assessment grants eligibility only. Register for and pass the official Apprentice Examination using the required affiliation-marked Engraver's Apprentice; passing grants Arcanist Grade 1.
4. **Every Grade advancement:** register through the Tianhai Arcanist Institute or a formally recognized examination arrangement, satisfy all established eligibility requirements, pay only established fees, and pass the examination for the target Grade. Training, eligibility, recommendations, or production alone never grant a Grade.
5. **Grade 7–10 tool gate:** before registering, personally design and establish authorship of the Formation Engraver blueprint; a qualified forger physically realizes that exact design; the candidate must own and present the resulting tool for verification. No substitution or waiver.
6. **Grade 8–10 artifact gates:** verify the exact candidate-made, condition, Tier, type, series-code, and current-ownership requirements below. Grade 10 also requires genuine senior recognition and the final examination. Eligibility is not a pass.
7. **Production and condition:** resolve production chance under §5 and the authorized resolution procedure. Only a successfully completed Artificial Artifact receives the condition score calculated under §14. Ordinary artifacts, Relics, and Ancient Artifacts do not gain Artificial Artifact production history.
8. **Time, Satiety, provenance, and records:** apply the official time, Satiety, economy, ownership, anti-cheat, and event/state procedures. Keep evidence for education, stage assessments, examinations, Grade changes, tool-blueprint authorship, each Artificial Artifact, its series code and condition, recognition, and institutional contribution points.

**Unspecified values stay unspecified.** Do not invent training duration or Satiety costs, examination fees, Grade 2–6 rubrics, success-roll mechanics, situational modifiers, production failure costs, contribution-point amounts, or other numerical values that have not been approved. If a required rule is unresolved, state the limitation and do not simulate a fictional official roll or grant an unearned result.

## 1. ARCANIST: INDEPENDENT PROGRESSION

**Player-facing result formatting:** every resolved formulation chance, roll, production outcome, and formula-derived final value must be displayed as `****<hasil final>****`, whether successful or failed. Any displayed tier, grade, quality, status, or similar classification label must use the universal ``<istilah>`` label format inside double backticks.

- Arcanist progression has 10 Grades: Arcanist Grade 1 through Arcanist Grade 10.
- Arcanist progression is separate from Spirit Realm cultivation. It concerns knowledge, materials, formulations, patterns, and artifact-making processes.
- Arcanists use metals, stone, special materials, patterns, and complex formulations to produce Artificial Artifacts.
- Spirit Realm progression and Arcanist Grade progress independently. High cultivation does not automatically make someone a great Arcanist, and high Arcanist Grade does not automatically make someone a powerful cultivator.
- The first Arcanists originated in Tianhai Yunzhou. The world's strongest Arcanists emerge from this knowledge tradition; Tianhai Yunzhou's advantage includes exceptional knowledge, not only combat strength.
- Arcanist Grade determines the normal baseline capability and formulation ceiling. It does not guarantee success in every attempt.

## 2. THREE DISTINCT ARTIFACT ORIGINS

### Relic
An inheritance or object left by a deity. Further properties are unknown unless another official source defines them.

### Ancient Artifact
An artifact originating from the golden age of civilization.

### Artificial Artifact
An artifact manufactured by an Arcanist using materials, patterns, and formulations.

These categories are distinct by origin and must not be treated as interchangeable. An Artificial Artifact is not automatically a Relic or an Ancient Artifact, and vice versa.

**Established scale example:** a giant island is powered by an Artificial Artifact Tier 9. Its maker, detailed materials, energy source, maintenance, mechanism, and weaknesses are not defined here unless an official source adds them. Do not invent those details as permanent canon.

## 3. KNOWLEDGE EXCHANGE AND CULTURAL INFLUENCE

### 3.1 Tianhai Yunzhou
- Origin of the first Arcanists and a major center of Arcanistry knowledge.
- The Tianhai Yunzhou Maharaja can compete through exceptional knowledge, not solely personal combat strength.
- Arcanistry knowledge is one source of Tianhai Yunzhou's cultural influence.
- Knowledge and formulation development may become channels for cultural exchange, diplomacy, and rivalry.

### 3.2 Golden Dragon Empire
- The Golden Dragon Empire is comparatively open to knowledge exchange and interaction with outside powers.
- Exchanges between Tianhai Yunzhou and the Golden Dragon Empire are important routes for the spread of knowledge and cultural influence.
- Exchange may affect diplomacy and relations as well as technology.
- The spread of knowledge does not automatically give every party equal production capability. Arcanistry skill, materials, and formulation mastery remain limiting factors.

### 3.3 Beiming Gu and the Northern Region
- The North is relatively isolated.
- Its cold climate helps preserve ancient materials.
- Exploration may uncover extensive resources, especially materials useful for engraving Artificial Artifact formations.
- Northern materials are strategically important to artifact technology, not merely ordinary commodities.
- Material availability alone does not guarantee successful production; suitable knowledge, formulations, and processing skill are still required.

## 4. REQUIREMENTS FOR FORMULATION AND PRODUCTION

Producing an Artificial Artifact requires:
- A formulation understood and assembled by the Arcanist.
- Focus and concentration throughout the process.
- Mental ability to understand, construct, and maintain complex formulation patterns.
- Sufficient stamina/energy to continue working.
- Suitable materials and applicable patterns.
- An Arcanist Grade capable of handling the target artifact under the normal tier limits.

Arcanist Grade limits the artifact tier that can normally be produced. Meeting the tier requirement does not automatically guarantee success.

A successful formulation does not mean the process is free of cost, energy consumption, time, or consequences. Apply only costs and consequences defined by official mechanics. Do not improvise numerical stamina costs, durations, or thresholds.

## 5. BASE SUCCESS-CHANCE MATRIX — ARCANIST GRADES 1–10

The baseline chance is determined by the difference between Arcanist Grade and target Artificial Artifact tier. All values below are percentages, before any situational adjustment that is explicitly authorized by official rules.

| Arcanist Grade / Artifact Tier | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **Arcanist Grade 1** | 80% | 30% | 10% | 0% | 0% | 0% | 0% | 0% | 0% | 0% |
| **Arcanist Grade 2** | 100% | 80% | 30% | 10% | 0% | 0% | 0% | 0% | 0% | 0% |
| **Arcanist Grade 3** | 100% | 100% | 80% | 30% | 10% | 0% | 0% | 0% | 0% | 0% |
| **Arcanist Grade 4** | 100% | 100% | 100% | 80% | 30% | 10% | 0% | 0% | 0% | 0% |
| **Arcanist Grade 5** | 100% | 100% | 100% | 100% | 80% | 30% | 10% | 0% | 0% | 0% |
| **Arcanist Grade 6** | 100% | 100% | 100% | 100% | 100% | 80% | 30% | 10% | 0% | 0% |
| **Arcanist Grade 7** | 100% | 100% | 100% | 100% | 100% | 100% | 80% | 30% | 10% | 0% |
| **Arcanist Grade 8** | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 80% | 30% | 10% |
| **Arcanist Grade 9** | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 80% | 30% |
| **Arcanist Grade 10** | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 80% |

Equivalent tier-difference rule:

| Target relative to Arcanist Grade | Baseline chance |
|---|---:|
| Artifact tier 2 or more below Arcanist | 100% |
| Artifact tier 1 below Arcanist | 100% |
| Same tier | 80% |
| Artifact tier 1 above Arcanist | 30% |
| Artifact tier 2 above Arcanist | 10% |
| Artifact tier 3 or more above Arcanist | 0% |

Reference example — Arcanist G3: Artifact T1 = 100%; T2 = 100%; T3 = 80%; T4 = 30%; T5 = 10%; T6–T10 = 0%.

A 0% baseline means the target cannot be produced by normal formulation at that Arcanist Grade. A special talent does not bypass this ceiling unless an official exception mechanic explicitly permits it. Baseline 100% is not a guarantee against valid situational disruption; equally, the GM must not arbitrarily change the chance.

## 6. FACTORS THAT MAY AFFECT THE ATTEMPT

The GM must assess actual conditions, but must not invent numerical modifiers.

### Focus and concentration
- Stable concentration is the standard condition.
- Minor distraction may impair work or increase failure risk if a defined rule permits this.
- Severe interruption or broken concentration may cause failure when supported by the established resolution rules.
- Do not assume every attempt takes place under ideal conditions.

### Mental ability
Mental ability affects understanding, arranging, and sustaining complex formulation patterns. Limitations may increase error risk, particularly near the Arcanist's tier ceiling. Apply numeric effects only when officially defined.

### Stamina/energy
The process requires energy throughout the work.
- Sufficient energy allows normal work.
- Low energy may slow or disrupt work.
- If the Arcanist cannot continue, the process may fail under the applicable rules.

Numerical energy costs, work duration, and thresholds are not yet defined. The GM must not invent them.

### Materials
- Suitable materials of adequate quality: standard conditions.
- Low-quality or poorly matched materials may reduce success only under an established rule.
- If a required material is missing, the formulation cannot be completed unless an officially recognized substitute exists.

Rare materials do not automatically produce a stronger artifact. The outcome still depends on formulation and Arcanist capability.

### Special talent
Relevant talents may concern pattern comprehension, concentration, processing a particular material, or a particular Artificial Artifact category. A talent applies only when relevant to the task and its effect is explicitly recorded in the character profile, talent system, or official rule. Do not invent numerical bonuses, stamina efficiency, or exceptions. A talent does not automatically bypass Arcanist Grade limits.

## 7. FORMULATION RESOLUTION PROCEDURE

For each attempt, the GM must:

1. Identify the Arcanist's tier.
2. Identify the target Artificial Artifact tier and type.
3. Read the baseline chance from the official matrix.
4. Assess focus, mental ability, stamina, materials, and relevant talents.
5. Apply only modifiers authorized by official rules.
6. Resolve the attempt using an officially established method.
7. Record the actual result and any supported consequences.

Possible outcomes include success and failure. Material damage, energy consumption, and additional consequences may be applied only when supported by official mechanics.

**Unresolved mechanic:** a numeric conversion formula for situational factors and talents affecting the *success chance*, and a formal random-resolution method, have not yet been established. The Artificial Artifact condition score is a separate mechanic defined in §14 and must not be used as the production success chance. Until success-resolution rules are approved, the GM must not invent percentage modifiers or pretend a random roll occurred. If a gameplay attempt requires an unresolved method, state the limitation and ask the owner/player for the chosen official resolution rule, or resolve only what the existing rules actually support.

## 8. FUTURE FORMULATION DEVELOPMENT

Artificial Artifact technology may advance through:
- Higher Arcanist Grades and improved capability.
- Knowledge exchange between civilizations.
- Discovery of new materials and resources.
- Development and refinement of formulations.
- Mastery of more complex patterns.
- New production methods, only after they are established as official lore.

Knowledge exchange between Tianhai Yunzhou and the Golden Dragon Empire may open paths for scientific development. Ancient materials in the North may support research and formation engraving. Knowledge spreading does not automatically make all civilizations equally capable; Arcanistry skill, materials, and formulation mastery remain limiting factors.

Mechanics for refining formulations, breakthroughs, or technologies beyond normal limits must be documented before the GM treats them as canon.

## 9. GM ENFORCEMENT CHECKLIST

The GM must:
- Read INDEX and relevant official modules according to repository procedure.
- Use this module as the source for Arcanist and formulation rules.
- Determine baseline chance from the Tier 1–10 matrix.
- Check focus, mental ability, stamina, materials, and relevant talents.
- Use only established modifiers and resolution methods.
- Never grant unrecorded talent bonuses.
- Never allow above-limit formulation without an official exception.
- Never invent percentage changes, stamina costs, durations, or consequences.
- Record results and resource changes consistently.
- Never change a character profile or history without a valid in-game event.

## 10. CANON PRINCIPLE

Arcanist is an independent knowledge-and-formulation progression path. Arcanist Grade determines baseline chance and the normal formulation ceiling. Actual conditions, materials, and talents affect the attempt only through official mechanics.

Narration alone does not guarantee success. The GM may not invent bonuses or exceptions, and may not override a valid resolution simply to force a preferred outcome.


## 11. COMBAT INTEGRATION — ARTIFICIAL ARTIFACTS

Combat resolution is governed by `gameplay/COMBAT_SYSTEM.md`, not by the production-chance matrix in §5. The matrix determines the baseline chance to manufacture an Artificial Artifact; it is not an attack-hit chance, damage value, or combat multiplier.

During combat, the GM may use an Artificial Artifact only if ownership/access, tier, condition, and the relevant function are established. Apply documented artifact functions to the relevant combat step. The tier comparison modifier in the combat module applies only when two Artificial Artifacts contest a comparable function; it does not grant a universal bonus against every opponent. Do not invent unknown functions, energy sources, charges, range, durability, or weaknesses.


## 12. FORMATION ENGRAVER — ESSENTIAL ARCANIST TOOL

The Formation Engraver is a specialized precision tool used to carve intricate formation patterns into the base materials of an Artificial Artifact.

### 12.1 Form and Purpose
- Its general form resembles a surgical scalpel, but its working tip is exceptionally fine, with a very small diameter.
- The fine tip allows an Arcanist to engrave tiny, precise, and complex formation lines into artifact materials.
- Its purpose is precision engraving; it is not merely an ordinary knife or a general-purpose carving tool.
- The analogy is similar to semiconductor and computer-chip fabrication: as patterns become smaller and more densely arranged, the required precision and technical sophistication increase. This is an analogy for precision and complexity, not a claim that Artificial Artifacts use modern computer-chip technology.

### 12.2 Precision and Complexity
- Smaller, finer, and more intricate formation patterns generally demand more advanced engraving capability and control.
- A finer tool does not by itself grant the user the knowledge or skill to create a valid formation.
- The required tool, material, formulation, and Arcanist capability must be suitable for the intended work.
- No exact tip diameters, precision grades, manufacturing tolerances, or numerical bonuses are established yet. Keep such values as `???` until officially defined.

### 12.3 Manufacture and Access
- Manufacturing a Formation Engraver is exceptionally difficult.
- Its maker must be a capable blacksmith/forger with **Spirit Realm 5 or higher** and the relevant forging ability.
- Spirit Realm 5 is a minimum requirement for the maker, not a guarantee that every Spirit Realm 5 blacksmith can successfully produce a high-quality engraver.
- The tool is expensive because of the difficulty of manufacturing it and the precision required. Exact prices, quality grades, durability, and repair costs remain `???` unless established elsewhere.
- An ordinary blacksmith without the required Spirit Realm and forging ability cannot be assumed capable of producing one.

### 12.4 Entry into the Mandatory Arcanist Path

An academy, dojo, clan, specialist organization, or qualified mentor may provide access to the legitimate foundational instruction required by §13. Recommendation and admission are access mechanisms only; they do not replace the mandatory training stages, official examinations, eligibility requirements, or certification.

Every aspiring Arcanist must complete the same binding progression route in §13. Institutions may differ in teaching methods, resources, fees, availability, and mentoring, but no institution or NPC may waive the mandatory gates unless a future explicit canon amendment authorizes a specific exception.

### 12.5 GM Enforcement
- Do not assume an aspiring Arcanist already owns a Formation Engraver.
- Do not assume a common craftsman can manufacture one.
- Check the maker's Spirit Realm and relevant forging ability when the tool's manufacture is part of the story.
- The tool's availability, quality, and suitability must be established before it is used for precision work.
- Owning the tool does not replace Arcanistry knowledge, formulation understanding, materials, or the official success rules.
- Do not invent exact prices, dimensions, quality tiers, production times, or special effects before they are defined.


## 13. MANDATORY ARCANIST EDUCATION, CERTIFICATION, AND GRADE PROGRESSION

**Status: MANDATORY CANON RULE.** This section governs all players and NPCs and must be applied together with the official formulation mechanics, institute rules, time rules, Satiety rules, economy, and repository authority hierarchy.

### 13.1 Absolute progression gate

- Arcanistry knowledge and formulation mastery cannot be acquired through self-declaration, spontaneous intuition, unexplained talent, or independent practice without legitimate instruction.
- Every aspiring Arcanist must first learn foundational theory from an actual qualified teacher, dojo, clan, institution, specialist organization, or other recognized educational source. The source must genuinely teach the knowledge claimed.
- Arcanist Grade is independent of Spirit Realm. Cultivation level, Martial Soul rarity, wealth, reputation, and possession of artifacts do not grant Arcanist Grade.
- Every official Grade requires the relevant examination administered or recognized by the Tianhai Arcanist Institute. Passing the examination for the target Grade grants that official Grade; registration, training, artifact production, recommendations, and eligibility alone do not.
- These requirements apply equally to players and NPCs. Existing NPC credentials must be supported by canon or valid recorded history.

### 13.2 Mandatory mental-focus training stages

After learning foundational theory, the student must undergo mental endurance, concentration, and focus training designed and assessed by their actual teacher or institution. The mandatory order is:

1. Pemula
2. Initiate
3. Beginner
4. Ordinary
5. Ahli
6. Expert

“Initiate” is the approved stage label replacing the provisional “Novice” wording. The teacher/institution determines exercises appropriate to its legitimate tradition and assesses progression; no stage is granted automatically by time, payment, narrative claim, or mere attendance.

Passing the required Initiate standard grants eligibility to attempt the Apprentice Examination. It does not itself confer Arcanist Grade 1 or guarantee exam success.

### 13.3 Apprentice Examination and Grade 1

- The Tianhai Arcanist Institute or a formally recognized examination arrangement administers the Apprentice Examination.
- Candidates use an Engraver's Apprentice, an examination tool bearing a pattern, emblem, or identifying mark associated with the candidate's legitimate educational origin or sponsoring tradition.
- The mark identifies affiliation only. It grants no automatic bonus, superior quality, or exemption from requirements.
- Candidates attempt Artificial Artifact production, normally in the Tier 1–3 range as the actual examination permits. Assessment covers learned theory, formulation, engraving precision, focus, endurance, materials, tool suitability, time, and valid production mechanics.
- A candidate who passes the Apprentice Examination receives official Arcanist Grade 1. A candidate who fails receives no Grade 1 certification; any retake follows established institute rules.

### 13.4 Grade 1–10 official advancement and examination standards

For every advancement, the candidate must register with the appropriate institute or recognized branch, pay the applicable established registration fee, satisfy all eligibility requirements, take the examination for the target Grade, and pass it. Passing the Grade N examination grants official Arcanist Grade N.

**Grades 2–6 use the Grade 1 examination format, with the target Artificial Artifact Tier raised to match the target Grade.** The candidate must complete the required production examination; from Grade 2 onward, the condition of the produced Artificial Artifact is a mandatory assessed requirement, calculated using §14. The candidate must not receive a pass merely for successful production if the condition requirement is not met. Grade 1 does not require the §14 condition score as a separate advancement prerequisite, although production success and all other stated examination requirements still apply.

| Target examination | Required examination artifact | Maximum pass count / competition rule |
|---|---|---|
| Grade 1 | Artificial Artifact Tier 1; Apprentice Examination format | Apply the official Grade 1 assessment; no quota is established here |
| Grade 2 | Artificial Artifact Tier 2; condition assessment mandatory | No numerical quota established |
| Grade 3 | Artificial Artifact Tier 3; condition assessment mandatory | Up to 35 successful candidates per 40 participants |
| Grade 4 | Artificial Artifact Tier 4; condition assessment mandatory | Up to 30 successful candidates per 40 participants |
| Grade 5 | Artificial Artifact Tier 5; condition and output-quantity comparison mandatory | Up to 20 successful candidates per 40 participants |
| Grade 6 | Artificial Artifact Tier 6; condition and output-quantity comparison mandatory | Up to 15 successful candidates per 40 participants |
| Grade 7 | Artificial Artifact Tier 7; condition assessment mandatory; personal-designed engraver mandatory | Up to 10 successful candidates from the actual participant pool |
| Grade 8–10 | Apply the distinct prerequisites and examination rules in §§13.5–13.9 and any established Grade-specific rules | Do not extend the Grade 3–7 quotas to Grades 8–10 |

For Grades 3–6, the stated quotas are based on an examination cohort of 40 actual participants: up to 35 pass Grade 3, up to 30 pass Grade 4, up to 20 pass Grade 5, and up to 15 pass Grade 6. Registration without attendance does not count toward the 40. The institute should organize standard cohorts of 40; if fewer than 40 actually participate, do not scale the quota proportionally or invent absent candidates—the maximum remains the stated count and fewer may pass if fewer meet the standard. The quota is a cap, not a guarantee that it must be filled. For Grade 3 and Grade 4, ranking is used only if more candidates meet the standard than the stated pass cap.

**Competitive ranking begins at Grade 5.** A Grade 5 or Grade 6 candidate can satisfy the basic production, condition, and eligibility requirements and still fail if a competing candidate in the same session produces both (a) a better condition result and (b) a greater quantity of qualifying Artificial Artifacts. Apply the same comparison to Grade 7 alongside its cap of 10 successful participants. The candidate's own artifacts must meet the target-Tier requirement and any stated eligibility requirements; borrowed, purchased, gifted, inherited, or other non-candidate-made artifacts never count. Do not invent a fixed minimum batch quantity where the examination notice or another canonical rule has not established one. Record each candidate's output count and condition results, and document the ranking evidence. A candidate who meets the basic standard but loses this competition is recorded as failed and receives no Grade promotion.

The Grade 3–7 pass caps are independent of production success chance. They limit the number of candidates who can pass; they do not change the Arcanist Grade × target Tier chance matrix or the §14 condition formula. If a competition has no qualifying comparison evidence, do not fabricate an opponent's result or automatically fail the candidate.

Upon officially obtaining Grade 1, an Arcanist becomes eligible to obtain a personal engraver through a qualified teacher or by purchasing one from the institute, subject to availability and the applicable price. An ordinary purchased or borrowed engraver does not satisfy the personal-design prerequisite for Grade 7 and above.

### 13.5 Mandatory personal-designed engraver for Grade 7–10

Before registering for any examination targeting Grade 7, 8, 9, or 10, the candidate must personally design the engraver blueprint, establish authorship, have a qualified forger/toolmaker physically realize that exact design, own the resulting engraver, and make it available for verification. **The candidate's own blueprint is an absolute, non-waivable prerequisite.** Buying a completed engraver, borrowing a teacher's tool, or commissioning a tool based on someone else's blueprint does not qualify.

The maker must satisfy applicable canonical requirements for engraver manufacture, including Spirit Realm 5 or above and relevant forging ability where that established rule applies. The maker realizes the candidate's design; this does not transfer blueprint authorship.

### 13.6 Embedded series codes, authorship, and ownership

Every Artificial Artifact has an embedded series code associated with its internal construction and identity. Artifacts may look alike or work similarly while having different internal structures and series codes. Appearance or function alone does not prove identity, authorship, or production history.

A series code cannot be arbitrarily changed. It may change only through legitimate dismantling or reconstruction/reforming of the artifact. The GM must record the actual transformation and must not automatically treat a reconstructed object as the same unchanged artifact in its former condition.

Any artifact counted toward a production prerequisite must have been genuinely made by the candidate and must still be owned by them when eligibility is assessed. Bought, gifted, inherited, borrowed, or otherwise acquired artifacts do not count as candidate-made artifacts. An artifact may be held in a bank rather than carried, provided bank capacity and records support storage and ownership and the artifact can be presented for institute verification. Sold, transferred, surrendered, or no-longer-owned artifacts do not count.

For every qualifying artifact, verify the maker, production history, series code, Tier, condition, required type, and current ownership. Artifact Tier, condition, type, authorship, and ownership are distinct facts.

### 13.7 Mandatory artifact condition scale

The five official condition labels, from lowest to highest, are:

1. Buruk
2. Rendah
3. Standar
4. Baik
5. Origin

Do not upgrade or infer condition from Tier, rarity, appearance, value, or owner's Grade. Use the recorded or properly assessed condition.

### 13.8 Grade 7–10 eligibility gates

These are prerequisites to register for the relevant examination, not automatic promotions.

**Grade 7:** The candidate must own a personal engraver physically made by a qualified maker from a blueprint designed by the candidate themselves. The blueprint requirement is absolute. Other established registration and tool suitability requirements still apply.

**Grade 8:** The candidate must meet the personal-designed engraver requirement and have personally produced and still own all of the following:
- At least 10 Tier 6 Artificial Artifacts.
- At least 5 Tier 5 Artificial Artifacts.
- At least 1 Tier 8 Artificial Artifact with condition exactly Rendah.

**Grade 9:** The candidate must meet the personal-designed engraver requirement and have personally produced and still own at least 30 Tier 8 Artificial Artifacts, every one of which has condition Baik or Origin.

**Grade 10:** The candidate must meet the personal-designed engraver requirement and personally produce and still own at least 10 Tier 9 Artificial Artifacts with condition Origin. All 10 must be of the weaponry type. Utility artifacts, tools, accessories, and all other non-weaponry types do not count, regardless of their Tier, condition, rarity, or value. The candidate must also satisfy the recognition and final-examination requirements below.

### 13.9 Arcanist tokens and Grade 10 recognition

An Arcanist token is a professional identity credential, comparable in social function to a formal business card. It identifies its holder and can evidence an authorized professional relationship. It is not merely a collectible, an ordinary recommendation, or an item that can be purchased to replace trust.

For Grade 10 examination eligibility, the candidate must obtain either:
- Recognition from at least one officially recognized Arcanist Grade 10; or
- Recognition from three officially recognized Arcanist Grade 9 individuals.

Recognition is a serious professional commitment that may expose both parties to shared risks, responsibilities, opportunities, and benefits. The precise scope depends on the relationship or agreement actually established; holding a token does not make its issuer automatically responsible for every action of its holder.

Tokens may be ordered through any city branch using the established process. Administrative access does not mean recognition can be purchased without the issuer's authorization; the issuer's actual recognition and token validity must still be verified. The institute must verify the token, issuer identity, issuer Grade, and validity of the recognition.

The recognizing NPC determines a meaningful challenge grounded in their actual knowledge, personality, interests, authority, resources, and circumstances. A challenge may require producing something, completing a difficult or lengthy undertaking, making a legitimate contribution, paying an appropriate fee, providing resources, or fulfilling another justified condition. Challenges may take substantial in-world time. NPCs must not grant recognition automatically because a candidate asks, has a high Grade, or completes an unrelated task; neither may the GM invent arbitrary demands unsupported by the NPC or setting.

Merzkava has **no more than five Arcanist Grade 10 individuals worldwide**. Preserve this canon limit in NPC generation and institutional records. The exceptional production prerequisites, senior recognition, and final examination help maintain this scarcity.

After satisfying artifact and recognition prerequisites, the candidate must register for and pass the official Grade 10 examination. Eligibility is not a guarantee of success.

### 13.10 Institutional contribution points

When a student passes an official Arcanist examination, the institution or educational organization responsible for their legitimate training receives contribution points from the central institute according to the applicable contribution rules. These points belong to the institution, not automatically to the student's personal Wallet.

Eligible institutions may exchange points for approved scarce resources, including rare or unique materials and important spare parts/components needed for Artificial Artifact production. Contribution rewards, exchange rates, stock, prices, and transaction records must use established economic and institutional rules. If a value or inventory has not been defined, the GM must not invent a numerical value and present it as canon.

Contribution points do not directly increase a student's Grade, guarantee examination success, or waive any eligibility requirement.

### 13.11 Training duration, Satiety costs, and production time — mandatory schedule

The following schedule establishes standard minimum guided-training hours and baseline production work time. These values govern ordinary Arcanist training and controlled workshop conditions; they do not guarantee mastery or production success. The actual teacher/institution must assess the student at every stage, and real interruptions, material problems, tool limitations, or environmental conditions may extend the duration when supported by the scene.

**Mental-focus training stages**

| Stage | Minimum guided practice | Standard schedule at up to 3 hours/day | Baseline Satiety cost for a Mortal |
|---|---:|---:|---:|
| Pemula | 12 active hours | 4 training days | 87.5 |
| Initiate | 24 active hours | 8 training days | 175.0 |
| Beginner | 40 active hours | 14 training days (last day may be partial) | 291.7 |
| Ordinary | 60 active hours | 20 training days | 437.5 |
| Ahli | 90 active hours | 30 training days | 656.3 |
| Expert | 120 active hours | 40 training days | 875.0 |

The stage schedule assumes up to three hours of focused practice per training day. It is a minimum active-practice requirement, not a promise that the stage is passed when the hours are complete. Progression requires a real assessment by the qualified teacher/institution. A candidate may need additional practice if the demonstrated standard has not been met. These durations do not include foundational theory lessons, travel, examination waiting time, or recovery breaks unless the scene explicitly includes them.

**Artificial Artifact production baseline**

| Target Artificial Artifact Tier | Standard focused workshop time | Baseline Satiety cost for a Mortal |
|---:|---:|---:|
| Tier 1 | 1 hour | 7.3 |
| Tier 2 | 2 hours | 14.6 |
| Tier 3 | 3 hours | 21.9 |
| Tier 4 | 4 hours | 29.2 |
| Tier 5 | 6 hours | 43.8 |
| Tier 6 | 8 hours | 58.3 |
| Tier 7 | 12 hours | 87.5 |
| Tier 8 | 18 hours | 131.3 |
| Tier 9 | 24 hours | 175.0 |
| Tier 10 | 36 hours | 262.5 |

**How baseline Satiety is calculated:** production and focused Arcanist practice count as **Sedang (A ×1.75)** under the official Hunger and Metabolism module. For a Mortal with normal body condition, no missed meal windows, and no special modifier, the cost is active work hours × (100 ÷ 24) × 1.75 = approximately **7.2917 Satiety per active hour**, displayed to one decimal place. The costs in both tables are reference totals across the stated work hours, not a single-turn deduction and not a claim that Satiety can go below zero. Food consumed during a multi-day process restores Satiety under the official food rules. For other Spirit Realms, body conditions, missed meal windows, or valid special modifiers, recalculate each actual awake-time interval using the official Satiety formula rather than copying the Mortal reference total.

**Mandatory action and continuity rules**
- An ordinary action advances no more than 3 hours per turn. Split longer work into sequential valid actions, record progress, and account for actual interruptions and meals; do not narrate 8–36 hours as one ordinary turn.
- Protected night sleep does not reduce Satiety. Awake rest uses the official Resting multiplier; do not charge full focused-work Satiety for time actually spent resting.
- The tables state standard work time, not automatic success. A production attempt still uses the official Arcanist Grade × target Tier baseline chance and the authorized resolution procedure. A failed or interrupted attempt does not automatically refund time or Satiety already spent; apply only costs actually incurred and consequences established by the scene, and do not invent extra material-loss fees.
- For examinations, use the relevant target-Tier production time as the standard focused-work allowance unless the official examination notice defines a different allowance. The ordinary 3-hour-per-turn action limit still applies to the candidate's actual sequence of actions.
- These baseline durations and costs do not define registration fees, material prices, retake rules, contribution points, or numerical success modifiers. Use the economy and institute rules for established values; never invent a fee.

### 13.12 Mandatory GM enforcement and records

- No self-certification, spontaneous mastery, or unearned Arcanist Grade.
- No skipped education, training assessment, examination, blueprint requirement, artifact prerequisite, or token recognition.
- No purchased or borrowed artifact may count as candidate-made work.
- No borrowed blueprint can satisfy the Grade 7+ personal-design requirement.
- No arbitrary success-rate, stamina, time, tool, or talent bonus may be invented.
- No NPC may claim knowledge, grant recognition, or impose a challenge beyond their established capabilities and circumstances.
- Apply the same rules to players and NPCs. Existing exceptions must be explicitly supported by canonical authority.
- Record official Grade changes, exam results, blueprint authorship, engraver ownership, artifact production and series codes, condition, transfers, bank storage where tracked, token recognition, and contribution-point transactions through the repository's established state/event procedures.
- Use the last verified state and recorded events. Never invent history to make a candidate pass or fail.

This protocol is mandatory and must be read together with the Tianhai Arcanist Institute module, the official Satiety and time rules, the economy system, and the repository's authority and anti-cheat gates.


## 14. ARTIFICIAL ARTIFACT CONDITION FORMULA — MANDATORY

**Scope:** This formula determines the *condition* of a successfully completed **Artificial Artifact**. It does not determine whether production succeeds. First resolve production using the official Arcanist Grade × target Tier success-chance matrix and an authorized resolution method. Only a completed artifact receives a condition score. A failed or incomplete attempt does not receive a condition label; apply only consequences established by official rules.

### 14.1 Ordinary artifacts and Artificial Artifacts are distinct

- This formula applies only to artifacts manufactured as **Artificial Artifacts** through Arcanist formulation and production.
- Ordinary/non-artificial objects or artifacts do not gain Artificial Artifact production history, Artificial Artifact experience points, or an Artificial Artifact condition score merely because they are valuable or called an artifact in narration.
- Relics and Ancient Artifacts retain their separate origins defined in §2. Their condition must be established by the applicable official source or a properly recorded assessment; do not retroactively apply this manufacturing formula to them.
- A production attempt's success chance and its completed product's condition score are separate values. A 100% success chance does not guarantee Origin condition.

### 14.2 Formula

Calculate the final **Condition Score (CS)** as:

`CS = clamp(100 - 20 - (1.2 × T) - L + ((P + K + J + C) × M), 0, 100)`

Where:

- `T` = target Artificial Artifact Tier, from 1 to 10.
- `20` = fixed baseline complexity penalty for precision formulation and engraving.
- `1.2 × T` = target-Tier difficulty penalty; a higher Tier lowers the starting score.
- `L` = environmental penalty, from 0 to 15.
- `P` = preparation/readiness points, from 0 to 20.
- `K` = demonstrated production skill points, from 0 to 25.
- `J` = verified Artificial Artifact production-experience points, from 0 to 20.
- `C` = demonstrated consistency points, from 0 to 20.
- `M` = Tier efficiency multiplier applied to the sum of the four maker-point categories.
- `clamp(x, 0, 100)` means scores below 0 become 0 and scores above 100 become 100.

Use full precision during calculation. Round only the final CS to two decimal places for display. For condition classification, compare the unrounded CS to the official thresholds. Display formula-derived final values in the required format: `****<final value>****`.

### 14.3 Tier efficiency multiplier

| Target Artificial Artifact Tier | M |
|---:|---:|
| Tier 1–2 | 1.00 |
| Tier 3–4 | 0.90 |
| Tier 5–6 | 0.80 |
| Tier 7–8 | 0.65 |
| Tier 9 | 0.50 |
| Tier 10 | 0.35 |

The multiplier reduces how much readiness, skill, experience, and consistency can offset the difficulty of higher-Tier production. It does not alter the Arcanist Grade success-chance matrix or permit production above the normal Tier ceiling.

### 14.4 Maker-point assessment

**Preparation/readiness (P), maximum 20**

| Evidence-based preparation | Points |
|---|---:|
| Critical preparation missing; not production-ready | 0–4 |
| Partial preparation with significant gaps | 5–9 |
| Materials, design, tools, and workspace sufficiently prepared | 10–14 |
| All relevant preparation complete and verified | 15–18 |
| Optimal, verified preparation with all critical requirements met | 19–20 |

**Demonstrated production skill (K), maximum 25**

| Demonstrated skill for the relevant production | Points |
|---|---:|
| Does not understand required process | 0–4 |
| Understands basics but makes frequent process errors | 5–9 |
| Can carry out the process independently at a basic level | 10–14 |
| Controls the process and handles common problems | 15–19 |
| Exceptional, demonstrated mastery of the relevant process and difficulties | 20–25 |

Arcanist Grade alone does not automatically award maximum skill points. Assess skill against the actual target Tier, formulation, material, and artifact type, using recorded learning and demonstrated capability.

**Artificial Artifact production experience (J), maximum 20**

| Completed, recorded Artificial Artifacts made by the character | Points |
|---:|---:|
| 0 | 0 |
| 1–2 | 2 |
| 3–5 | 4 |
| 6–10 | 7 |
| 11–20 | 10 |
| 21–40 | 13 |
| 41–75 | 16 |
| 76 or more | 20 |

Only distinct Artificial Artifacts actually completed by the character and supported by production records count. An ordinary artifact, a purchased/gifted/inherited/borrowed artifact, an unfinished attempt, or duplicate counting of a single output does not add experience. The count measures overall Artificial Artifact production experience; it does not by itself prove skill at every Tier.

**Production consistency (C), maximum 20**

| Verified production record | Points |
|---|---:|
| No completed production history | 0 |
| Results frequently fail or vary substantially | 1–4 |
| Some stability, but substantial variation remains | 5–9 |
| Results are reasonably stable across several completed productions | 10–14 |
| Stable results across a substantial, relevant production record | 15–18 |
| Highly stable results across a long and relevant production record | 19–20 |

Consistency must be based on recorded outcomes and comparable production difficulty. A long record of Tier 1 products alone does not prove high consistency for Tier 9 or Tier 10 work. Do not award points based only on self-declaration, elapsed time, reputation, wealth, or Grade.

### 14.5 Environmental penalty (L)

| Actual production environment | L |
|---|---:|
| Ideal: quiet, hygienic, stable, and suitable | 0 |
| Good: only negligible disruption | 1–2 |
| Adequate: minor distraction or minor hygiene/stability issue | 3–5 |
| Poor: repeated disruption or notable hygiene/stability problem | 6–9 |
| Very poor: significant instability or contamination risk | 10–12 |
| Severely unsuitable and seriously disruptive | 13–15 |

Assess the actual environment during the relevant production, not merely the location's name or reputation. A clean, quiet, stable workspace reduces the penalty; noise, interruptions, poor hygiene, and instability increase it. Do not double-penalize the same event through multiple mechanics unless separate effects are explicitly established.

### 14.6 Final condition thresholds

| Final Condition Score | Official condition |
|---:|---|
| CS < 40 | Buruk |
| 40 ≤ CS < 65 | Rendah |
| 65 ≤ CS < 80 | Standar |
| 80 ≤ CS < 97 | Baik |
| 97 ≤ CS ≤ 100 | Origin |

**Origin requires a final CS of at least 97%.** A high Tier, rarity, market value, visual appearance, owner reputation, or Arcanist Grade cannot independently upgrade condition. Origin is a condition classification only; it does not automatically grant additional functions, power, durability, or effects not defined elsewhere.

### 14.7 Mandatory resolution and recordkeeping

For every successfully completed Artificial Artifact:

1. Verify the maker, target Tier, artifact type, formulation, materials, tools, and production record.
2. Determine and record `P`, `K`, `J`, `C`, `L`, and the Tier multiplier `M), citing in-world evidence or existing records for each assessment.
3. Calculate CS with the formula in §14.2; do not substitute intuition or a narrative adjective for the calculation.
4. Assign the condition solely from the thresholds in §14.6.
5. Record the result alongside the artifact's identity/series code, maker, Tier, type, date/event, condition, and current ownership under the repository's state/event procedure.
6. Keep the production success chance and the condition score as separate recorded values.

The GM must not invent production history to award experience or consistency points, and must not award Origin unless the calculated score reaches at least 97. If the evidence needed to assess a point category is unavailable, use only what is verifiable; do not assume the maximum. Apply this formula equally to players and NPCs.



---

<!-- SOURCE core/CULTIVATION_SYSTEM.md | upstream blob fa1bd7c2c8c5334e5299728c28af4b6dac469a5b -->

# Merzkava Universe — Cultivation System

Status: Modul mekanik resmi.
Cakupan: Spirit Realm, Stage, Sync progress, bottleneck, breakthrough, dan slot Spirit Ring.

Modul ini hanya menetapkan aturan yang telah disepakati. Angka pertumbuhan kekuatan, biaya Qi, durasi latihan, dan rumus kompatibilitas yang belum ditetapkan tidak boleh dibuat seolah-olah merupakan aturan resmi.

### Standar Istilah Kanonis

- **Spirit Realm** adalah satu-satunya istilah untuk tingkat kultivasi bernomor 1–9. Dalam konteks kultivasi, jangan menyingkatnya menjadi `Realm`, menyebutnya `Cultivation Realm`, atau membuat istilah alternatif.
- Gunakan bentuk `Spirit Realm 1` sampai `Spirit Realm 9` ketika menyebut tingkat bernomor, nama resmi seperti `Spirit Initiate` ketika menyebut nama tingkat, serta `Spirit Realm/Stage` untuk field profil.
- **Mortal** adalah status dasar sebelum memasuki sembilan Spirit Realm, bukan Spirit Realm 0 dan bukan nama Realm tambahan.
- Aturan penamaan ini tidak mengubah nama proper lain yang memakai kata *Realm* dalam arti berbeda, misalnya **Heaven Realm** dalam lore sejarah.


**Tradition boundary:** This module governs Spirit Realm progression mechanics, not the philosophy of its schools. Soul-Nyuma and Soul-Zoun are defined in `core/SPIRIT_REALM_TRADITIONS.md`; neither tradition changes the nine-level progression, Stage, Sync, bottleneck, breakthrough, or Spirit Ring slot rules below.

---

## 1. Sembilan Spirit Realm

Setiap Spirit Realm memiliki empat Stage: Early (Awal), Middle (Menengah), Late (Akhir), dan Peak (Puncak).

| Urutan | Spirit Realm | Jumlah slot Spirit Ring setelah slot Spirit Realm itu terbuka |
|---:|---|---:|
| 1 | Spirit Initiate | 1 |
| 2 | Spirit Adept | 2 |
| 3 | Spirit Elder | 3 |
| 4 | Spirit Monarch | 4 |
| 5 | Spirit King | 5 |
| 6 | Spirit Ancestor | 6 |
| 7 | Spirit Emperor | 7 |
| 8 | Spirit Sovereign | 8 |
| 9 | Spirit Primordial | 9 |

Setiap Spirit Realm memberikan satu slot Spirit Ring, sehingga batas normal sistem ini adalah sembilan slot pada Spirit Realm kesembilan. Pada Spirit Realm 9 (Spirit Primordial), penyerapan mencapai puncak: `Spirit Ring Absorption: max | ∞ Day left`; tidak ada ring kesepuluh dan cooldown lanjutan tidak dihitung. Urutan Spirit Realm 1–9 yang kanonis adalah Spirit Initiate, Spirit Adept, Spirit Elder, Spirit Monarch, Spirit King, Spirit Ancestor, Spirit Emperor, Spirit Sovereign, dan Spirit Primordial. Nama ini harus dipertahankan secara konsisten di seluruh repository. Jangan menambahkan Spirit Realm kesepuluh atau slot tambahan tanpa revisi canon oleh pemilik.

Nama dan jumlah slot menunjukkan struktur kultivasi, bukan jaminan bahwa dua orang dalam Spirit Realm yang sama memiliki kekuatan tempur identik.

## 2. Martial Soul dan Awakening

Martial Soul adalah bentuk kekuatan utama seseorang. Bentuknya dapat berupa, misalnya, senjata, tumbuhan, atau hewan; kategori dan kemampuan spesifik harus mengikuti modul Martial Soul ketika tersedia.

Awakening Martial Soul berlangsung pada usia empat tahun atau lebih. Awakening mengungkap Martial Soul, tetapi tidak otomatis memberikan Spirit Ring pertama.

**Mortal adalah status dasar sebelum memasuki sembilan Spirit Realm. Mortal yang telah mengalami Awakening Martial Soul boleh menyerap Spirit Ring pertama; tidak ada syarat Spirit Realm atau bottleneck tambahan untuk ring pertama selain Awakening dan persyaratan penyerapan yang memang berlaku.** Awakening saja tidak otomatis memberikan ring: ring tetap harus tersedia melalui proses yang sah dan proses penyerapannya harus benar-benar berhasil. Mortal yang belum Awakening tidak dapat menyerap Spirit Ring pertama.

## 3. Progres dan Empat Stage

Gunakan urutan Stage berikut di dalam setiap Spirit Realm:

1. Early (Awal)
2. Middle (Menengah)
3. Late (Akhir)
4. Peak (Puncak)

Istilah proses mekanik yang digunakan hanya:
- **Penyerapan Spirit Ring:** proses memperoleh dan menambahkan satu Spirit Ring ke jumlah ring yang dimiliki.
- **Kultivasi:** proses meningkatkan Sync progress menuju cap kompatibilitas maksimum ring yang sedang diproses.
- **Menerobos:** proses terpisah yang mensyaratkan seluruh ketentuan resmi.

Sync progress wajib ditulis sebagai `Sync progress: [progres saat ini]%/[cap kompatibilitas maksimum]%`. Cap berbeda menurut ring dan dihitung sesuai `core/SPIRIT_RING_RULES.md`; jangan menganggap cap selalu 100%. **Progres/cap mengukur kemajuan terhadap batas kompatibilitas karakter; penguasaan kekuatan ring 100% adalah konsep terpisah** dan berarti kekuatan ring dikuasai sepenuhnya setara dengan penggunaan Spirit Beast asalnya.

Meditasi biasa tidak otomatis menjadi Kultivasi dan tidak mengubah Sync progress. Hanya aktivitas yang secara jelas dijalankan sebagai **Kultivasi** menurut aturan ini yang dapat meningkatkan Sync progress; Kultivasi tetap bukan Penyerapan Spirit Ring atau breakthrough.

Mencapai cap berarti mencapai bottleneck, bukan breakthrough otomatis. Untuk percobaan menerobos, jarak antara Sync progress dan cap harus **kurang dari 10 poin persentase**. Jika jaraknya 10 poin atau lebih, syarat bottleneck belum terpenuhi.

Makin besar jarak Sync progress dari cap dalam rentang yang diizinkan, makin tinggi dampak deviasi yang harus dipertimbangkan. Hitung persentase deviasi (1–100%), kehilangan HP berdasarkan HP maksimum karakter dan faktor nomor ring, pengali pelanggaran, serta kategori risiko hanya menggunakan `core/SPIRIT_RING_RULES.md` §5. Pada persentase deviasi yang sama, ring dengan nomor lebih tinggi memiliki kehilangan HP dasar lebih besar. Untuk ring kedua dan seterusnya, `Day left` harus `0`; **durasi Kultivasi tidak mengurangi angka tersebut**. Jika Gap ≥10 atau `Day left` masih positif, breakthrough tidak memenuhi syarat; bila karakter tetap memaksakan proses dan GM menyelesaikan konsekuensinya, gunakan aturan khusus pemaksaan di modul Spirit Ring. Jangan mengarang angka pengurangan cap atau pemulihan.
## 4. Bottleneck dan Breakthrough

Menerobos hanya dapat dilakukan jika semua syarat berikut terpenuhi:

1. **Bottleneck:** Sync progress berada kurang dari 10 poin persentase di bawah cap kompatibilitas ring aktif.
2. **Spirit Ring tersedia:** ring berikutnya benar-benar tersedia untuk diserap melalui proses yang sah.
3. **Item wajib tersedia:** karakter memenuhi persyaratan item yang berlaku untuk Spirit Beast target agar dapat menyerap Spirit Ring tersebut, sesuai `bestiary/SPIRIT_BEAST_RULES.md`. Jika data spesifik belum ada, GM wajib menetapkan requirement konkret berdasarkan tier/usia ring dan jenis serta karakteristik Spirit Beast target; jangan membiarkannya kosong atau menganggap tidak ada syarat.
4. **Jeda minimum terpenuhi:** waktu sejak Penyerapan Spirit Ring sebelumnya yang berhasil telah mencapai jeda minimum sesuai `bestiary/SPIRIT_BEAST_RULES.md`.

Status dan format `Spirit Ring Absorption` mengikuti satu-satunya pemetaan di `templates/CHARACTER_PROFILE_TEMPLATE.md`. Interval serta perhitungan `Day left` mengikuti `gameplay/TIME_AND_ACTION_RULES.md` §7 dan tabel resmi di `bestiary/SPIRIT_BEAST_RULES.md`.

Interval minimum dan tabel `T_min` hanya ditetapkan di `bestiary/SPIRIT_BEAST_RULES.md` §3. Inisialisasi cooldown, akumulasi `T_eligible`, konversi kalender, dan rumus `Day left` hanya ditetapkan di `gameplay/TIME_AND_ACTION_RULES.md` §7. Setelah ring 1–8 berhasil diserap, mulai cooldown berikutnya langsung dengan `T_eligible = 0`; setelah ring 9, tidak ada cooldown lanjutan. Kultivasi tidak mengurangi `Day left`; ring kedua hingga kesembilan mensyaratkan `Day left = 0` secara terpisah dari syarat lain.

Jika percobaan dilakukan terlalu jauh dari cap atau sebelum jeda minimum, terapkan deviasi sesuai modul resmi: cap kompatibilitas ring berikutnya berkurang, HP menerima damage, dan kondisi tubuh mengalami cedera. Tingkat deviasi meningkat seiring jarak dari cap atau besarnya pelanggaran jeda. Jika rumus numerik belum tersedia, nyatakan dampak dan tingkat deviasi tanpa mengarang angka damage atau persentase pengurangan cap.

Penyerapan Spirit Ring, Kultivasi, dan menerobos adalah proses berbeda. Spirit Realm dan slot baru hanya diperbarui setelah seluruh syarat dan proses resmi benar-benar berhasil. Jika aturan tambahan seperti durasi, biaya, atau hasil parsial belum ditetapkan, jangan mengarangnya.
## Rujukan Status Spirit Ring Absorption

Jangan menduplikasi tabel status di modul ini. Gunakan `templates/CHARACTER_PROFILE_TEMPLATE.md` untuk pemetaan status dan `gameplay/TIME_AND_ACTION_RULES.md` §7 untuk rumus `Day left`. Jeda, bottleneck, item wajib, ring yang tersedia, dan toleransi tubuh tetap merupakan syarat terpisah.

## 5. Spirit Ring dan Slot

- Jumlah slot mengikuti urutan Spirit Realm: Spirit Initiate (tingkat 1) menyediakan satu slot, Spirit Adept (tingkat 2) dua slot, dan seterusnya hingga Spirit Primordial (tingkat 9) menyediakan sembilan slot.
- Slot yang tersedia tidak berarti slot tersebut sudah terisi.
- Setiap Spirit Ring harus memiliki asal-usul dan proses perolehan yang sah.
- Kemampuan yang diberikan oleh sebuah Spirit Ring harus memiliki dasar dari Beast yang bersangkutan dan aturan resmi yang tersedia.
- Jangan membuat kemampuan, evolusi, mutasi, atau efek ring tanpa dasar yang sah.

Rentang warna Spirit Ring yang telah ditetapkan:

| Warna | Usia Spirit Ring |
|---|---:|
| Putih | 10–99 tahun |
| Kuning | 100–999 tahun |
| Biru (`#0000FF`) | 1.000–9.999 tahun |
| Hitam | 10.000–49.999 tahun |
| Merah | 50.000–99.999 tahun |
| Oranye (`#FFA500`) | 100.000–499.999 tahun |

Warna untuk Spirit Ring berusia 500.000 tahun atau lebih belum ditetapkan. Jangan menciptakan warna atau kategori baru.

Tidak ada batas usia Spirit Ring yang mutlak hanya berdasarkan angka usia. Kesesuaian tetap mempertimbangkan toleransi tubuh, kompatibilitas, dan aturan penyerapan yang berlaku. Usia tinggi bukan jaminan bahwa karakter mampu menyerap ring tersebut dengan aman atau berhasil.


### 5.1 Jalur Normal Perolehan Spirit Ring

Setelah Martial Soul Awakening, seseorang dapat berusaha memperoleh Spirit Ring melalui tiga jalur umum yang diatur lebih lengkap dalam `core/SPIRIT_RING_RULES.md`:

- **Ekspedisi akademi (Safe Route):** pelajaran teori dan persiapan lapangan, lalu perburuan berkelompok di hutan atau alam liar yang dipilih sesuai kesiapan murid, informasi bahaya, dan tujuan latihan. Pengawasan akademi mengurangi risiko yang dapat dihindari, bukan menjamin keamanan, kemenangan, penyelamatan, atau penyerapan berhasil.
- **Party sementara Spirit Hunters Guild:** kelompok campuran dengan kemampuan, pengalaman, loyalitas, dan tujuan yang tidak selalu seragam. Gunakan enam tier kontrak dan kesiapan tim dalam `world/SPIRIT_HUNTERS_GUILD.md`; tuduhan saja tidak membuktikan pelanggaran, tetapi misconduct serius yang terbukti dapat berujung blacklist dan, untuk kasus berat, Deadpool Notice.
- **Berburu solo:** tidak ada pengamanan, dukungan tim, atau penyelamatan yang dijamin. Jalur ini umumnya memerlukan persiapan serius dan kemampuan yang jelas memadai untuk target—biasanya di atas kemampuan orang biasa—atau keunggulan konkret dari pengetahuan, perlengkapan, informasi, maupun keadaan. Keinginan mencoba bukan bukti bahwa karakter mampu menuntaskan perburuan.

Pilihan jalur tidak mengubah formula kompatibilitas, syarat penyerapan, peluang keberhasilan yang belum ditetapkan, atau mekanik combat. Pisahkan empat tahap: menemukan target, mengalahkan Spirit Beast, memperoleh hak atas ring, lalu menyerapnya. Gunakan `gameplay/COMBAT_SYSTEM.md` untuk pertarungan dan `core/SPIRIT_RING_RULES.md` untuk kompatibilitas serta deviasi; jangan membuat persentase keberhasilan atau skor kesulitan baru.

## 6. Penaklukan Beast, Penyerapan, dan Sinkronisasi

Penaklukan Spirit Beast dan proses penyerapan Spirit Ring adalah bagian yang berbeda:

- Perburuan Spirit Beast dapat berlangsung di hutan atau lokasi berbahaya. Jangan mewajibkan karakter membawa Beast ke lokasi meditasi aman sebelum menyelesaikan perburuan.
- Setelah Spirit Beast dikalahkan, Spirit Ring muncul mengambang di atas tubuh Beast.
- Aktivitas Kultivasi untuk meningkatkan Sync progress dilakukan di tempat aman dan stasioner. Meditasi biasa tanpa tujuan/proses Kultivasi yang jelas tidak mengubah Sync progress.
- Saat Sync progress mencapai **cap kompatibilitas ring yang sedang diproses**, karakter mencapai batas kompatibilitas normalnya. Cap ini bisa kurang dari 100% (misalnya 45%) dan tidak boleh dipaksa menjadi 100%. **Sinkronisasi kekuatan 100%** adalah konsep terpisah dari field Sync progress: artinya karakter menguasai kekuatan Spirit Ring sepenuhnya, setara dengan saat Spirit Beast asalnya menggunakannya. Itu adalah hasil penguasaan penuh, bukan syarat universal untuk mencapai bottleneck atau melakukan breakthrough.
- Sinkronisasi 100% nyaris mustahil melalui penyerapan paksa. Jika Spirit Beast secara sukarela menyerahkan ringnya, sinkronisasi 100% lebih mungkin dicapai, tetapi tidak dijamin.
- Usia Spirit Ring tidak memiliki batas mutlak hanya berdasarkan angka; toleransi tubuh dan kompatibilitas tetap menentukan. Untuk seluruh pemetaan warna resmi—termasuk rentang 500.000 hingga 15.000.000 tahun—gunakan tabel lengkap di `core/SPIRIT_RING_RULES.md`; setiap rentang usia memiliki warna unik.
- Gunakan formula kompatibilitas tunggal di `core/SPIRIT_RING_RULES.md` §6.1, termasuk penalti kesenjangan tier, kondisi tubuh/Martial Soul, bonus combat/metode, dan pengecualian penyerahan sukarela. Cap sekitar 80% sudah menandakan kompatibilitas jenius; 90% ke atas jauh lebih langka dan 100% merupakan pencapaian istimewa, bukan default. PowerScale dan Qi tetap mengikuti rumus di modul yang sama. Jangan mengganti rumus atau mengarang input yang belum diketahui.

## 7. Konsistensi dengan WORLD.md

- WORLD.md adalah acuan utama untuk lore dan fakta dunia yang sudah ditetapkan.
- Tiga penguasa utama yang tercatat di WORLD.md berada di Spirit Realm 9 — Spirit Primordial; Stage masing-masing harus mengikuti WORLD.md: Emperor berada di Middle, sedangkan Maharaja dan Leluhur Utara berada di Early.
- Konfigurasi Spirit Ring para penguasa di WORLD.md berstatus rancangan kanon awal. Pertahankan usia ring dan status warna yang tertulis; jangan mengubah `Undefined` menjadi warna baru.
- Warna Spirit Ring untuk usia 500.000 tahun ke atas mengikuti tabel lengkap di `core/SPIRIT_RING_RULES.md`; warna makhluk Heaven Realm berusia lebih dari 15.000.000 tahun belum ditetapkan.
- Jika tabel umum sistem dan konfigurasi karakter spesifik tampak berbeda, pertahankan fakta spesifik yang tercatat di WORLD.md dan tandai konflik untuk ditinjau; jangan diam-diam mengubah lore.

### Hard Gate untuk bypass kultivasi

Semua syarat Awakening, Spirit Realm, Stage, Sync, Spirit Ring, breakthrough, Qi, dan kemampuan tetap ditentukan oleh mekanik resmi di modul ini serta sumber silang yang dirujuk. Narasi player tidak dapat membuat status/kemampuan itu sah atau mengganti prasyarat. Jika player mengklaim telah melewati syarat atau menciptakan jalan alternatif sebagai hasil yang sudah terjadi, hentikan klaim tersebut dan terapkan `templates/ANTI_CHEAT_HARD_GATE.md`. Peringatan wajib harus mendahului teguran; rollback dan sanksi mengikuti catatan pelanggaran. Jangan menganggap pertanyaan atau usulan metode baru sebagai pelanggaran sebelum GM menolak/memvalidasinya. Kematian permanen pada pelanggaran anti-cheat kedua adalah pengecualian khusus dari penyelamatan darurat normal; jangan mengubah formula risiko percobaan paksa biasa.

## 8. Batas Informasi dan Konsistensi

1. Gunakan `world/WORLD.md` sebagai acuan lore dan modul ini untuk mekanik kultivasi yang sudah disepakati.
2. Gunakan modul ini bersama `core/MARTIAL_SOUL.md` dan `core/SPIRIT_RING_RULES.md`; gunakan `bestiary/SPIRIT_BEAST_RULES.md` ketika file tersebut tersedia.
3. Gunakan `gameplay/TIME_AND_ACTION_RULES.md` untuk durasi aksi dan Kultivasi; modul tersebut sudah tersedia.
4. Gunakan `core/HUNGER_AND_METABOLISM.md` selama time skip Kultivasi untuk menghitung Satiety pada waktu terjaga. Kecualikan tidur malam yang dilindungi; jangan mengurangi Satiety selama tidur itu.
5. Jangan mengklaim membaca modul yang belum tersedia.
6. Jangan menciptakan rumus, statistik, peluang, bonus, atau pengecualian baru sebagai canon.
7. Jika suatu aksi memerlukan aturan rinci yang belum ditetapkan, jelaskan keterbatasannya dan selesaikan hanya bagian yang didukung sumber.
8. Profil karakter harus mencerminkan Spirit Realm, Stage, dan progres. Jangan menambahkan field terpisah untuk Spirit Ring; jumlah slot mengikuti Spirit Realm, sementara informasi ring yang telah diperoleh—sumber, usia, warna, kemampuan, dan hasil proses yang diketahui—dicatat dalam bagian Teknik / Kemampuan atau deskripsi Martial Soul yang sudah ada. Jangan mengisi slot atau menaikkan Spirit Realm tanpa proses yang sah.



---

<!-- SOURCE core/CULTIVATOR_ACADEMIES.md | upstream blob f05040055f116aa7e88d49fbaabb3545132e1871 -->

# MERZKAVA UNIVERSE — CULTIVATOR ACADEMIES & FOUNDATIONAL EDUCATION

**Status:** Core concept established. The Golden Dragon Empire has exactly two named central boarding Cultivator Academies, both in Huanglongcheng. Specific admission rules, curriculum hours, fees, age limits, examinations, and graduation requirements remain undefined unless separately established. Binding continuity decisions: `world/CANON_DECISIONS_AND_PRECEDENCE.md`.

## 1. PURPOSE

Cultivator Academies provide foundational education for people pursuing cultivation. They teach basic theory, physical preparation, and practical knowledge relevant to Martial Souls, Spirit Rings, combat, the world's history, and the development of Artificial Artifacts.

An academy is a broad educational route; it is not automatically a sect, a dojo, an Arcanist institution, or a guarantee of advancement. Individual institutions may differ in resources, teaching quality, specialization, and access, but specific differences must be established by canon or events.

## 2. FOUNDATIONAL SUBJECTS

The following are recognized areas of foundational instruction. This list establishes subject areas, not a fixed timetable or a requirement that every academy teaches every topic in the same way.

### 2.1 Cultivation Fundamentals
- Basic understanding of cultivation, Spirit Realms, and the general process of developing one's strength.
- Introductory knowledge of Martial Souls and their relevance to a cultivator.
- Other foundational concepts required to understand a cultivator's development.

Advanced methods, breakthrough guarantees, or techniques restricted to a particular Spirit Realm are not implied by basic instruction.

### 2.2 Physical Training
- General physical conditioning, stamina, coordination, and bodily readiness.
- Foundational exercises appropriate to the student's demonstrated condition and level.
- Basic awareness of physical limits and the risks of training beyond them.

Academy attendance does not automatically grant extraordinary physical ability, injury immunity, or combat mastery.

### 2.3 Introductory Spirit Ring Theory
- The role of Spirit Rings in a cultivator's development.
- Basic concepts of Spirit Beasts, ring acquisition, compatibility, and absorption risk.
- The importance of preparation and understanding relevant conditions before attempting to absorb a Spirit Ring.
- The distinction between learning the theory and successfully carrying out the process.

This subject provides introductory education only. It does not guarantee a suitable Spirit Beast, a successful absorption, compatibility, or a breakthrough. Actual Spirit Ring requirements and outcomes remain governed by the official cultivation, Spirit Ring, and Spirit Beast rules.

### 2.4 Foundational Combat Knowledge
- Basic principles of offense, defense, positioning, and situational awareness.
- Introductory understanding of using one's abilities responsibly and effectively.
- Recognition that practical combat outcomes depend on actual abilities, conditions, and the official combat rules.

Completing basic lessons does not automatically grant a character a specific technique, combat bonus, or victory.

### 2.5 World History and Major Wars
- Historical events and major wars that shaped the world.
- The rise, decline, and interactions of powers and factions.
- The historical development of societies and the consequences of major conflicts.

The exact syllabus, disputed accounts, and the knowledge available to a particular academy or student must be grounded in official history and the institution's established circumstances. Do not invent historical facts to fill gaps.

### 2.6 Artificial Artifact History and Influence
- The emergence and spread of Artificial Artifact technology.
- The ways this technology influenced society, knowledge exchange, and warfare.
- The distinction between learning about Artificial Artifacts and having the specialist knowledge, materials, tools, or Arcanist Grade required to formulate and manufacture them.

Foundational history lessons do not automatically qualify a student as an Arcanist or provide practical formulation skill. Detailed Arcanist and production mechanics are governed by `core/ARCANISTRY_AND_FORMULATION.md`.

### 2.7 Other Relevant Knowledge
Depending on the established curriculum, foundational education may also include geography, Spirit Beast awareness, major factions, travel, and other knowledge relevant to life as a cultivator. Whether a particular academy offers a subject must be established rather than assumed.

### 2.8 Supervised Spirit Beast Field Practice

An academy that offers practical Spirit Ring preparation may teach theory first and then take students on supervised group expeditions into a selected forest or other wilderness area. This is the academy's **Safe Route** approach: instructors teach theory and field discipline, choose a route according to the students' demonstrated readiness and available hazard information, and supervise the group's attempt to locate or hunt an appropriate Spirit Beast.

Field preparation may include habitat and track recognition, threat assessment, party coordination, retreat signals, emergency planning, ring compatibility, and the difference between defeating a Beast and successfully absorbing its ring. Actual content depends on the academy and the lessons the student has received.

A Safe Route is a managed-risk training route, not a guarantee of safety. An unexpected Beast, inaccurate report, environmental hazard, separation, injury, or failed hunt remains possible. The academy's presence does not guarantee a rescue squad or medical outcome unless the specific expedition establishes those resources. No student receives an automatic combat bonus, guaranteed ring, improved compatibility, or successful absorption for attending.

Only two specific central boarding academies exist in established Golden Dragon Empire canon: **Imperial Foundation Academy** and **Imperial Cultivation Academy**, both in Huanglongcheng. This is a deliberate final decision, not an invitation to add regional academies. Tianfeng (Scholarly Heights) is associated with talented people and can be a source of gifted students for these two academies; it is not a third academy or a separate regional academy network. Gifted students from Tianfeng and elsewhere may travel to Huanglongcheng for study. The academies follow established foundational education on Martial Souls, Spirit Realms, Spirit Beasts, Spirit Rings, safe training, and foundational combat. Do not automatically classify this curriculum as Soul-Nyuma, and do not assign Soul-Zoun, experimental, or coercive methods to the academies without explicit canon. The distinction is governed by `core/SPIRIT_REALM_TRADITIONS.md`. Do not assume every institution in the wider world has this field program.

## 2.9 Soul-Nyuma and Soul-Zoun — Traditions as Educational Foundations

The two Spirit Realm traditions are foundational bodies of knowledge that may shape an institution's curriculum, teaching method, and institutional identity. An academy may teach one tradition, compare both, or provide shared foundational Spirit Realm instruction without declaring exclusive affiliation. Do not classify either of the two established central Golden Dragon Empire academies by assumption; their actual doctrine must be confirmed by canon.

An institution that teaches a tradition may include its philosophy and history; the treatment of Spirit Beast souls; Spirit Ring formation and absorption theory; natural or aberrant Spirit Ability expression; Qi efficiency, control, stability, and resource management; documented successes and failures; and criticism of the opposing tradition.

The same principle applies to dojos, clans, sects, independent teachers, and research groups. Their teaching emphasis may differ even when they share an affiliation. A Soul-Nyuma institution may regard Soul-Zoun with contempt or disgust; a Soul-Zoun institution may consider Soul-Nyuma outdated, narrow-minded, or lacking vision. Such attitudes must be established for the particular institution or NPC and must not be generalized to every member.

Education does not automatically grant practical mastery, a Spirit Ring, a Spirit Ability, a Sync increase, an absorption bonus, or an Arcanist qualification. Theory, instruction, practical competence, and official mechanical outcomes remain distinct. The binding doctrine is `core/SPIRIT_REALM_TRADITIONS.md`; absorption and Qi mechanics remain in their dedicated modules.

## 3. ACADEMIES AND SPECIALIST PATHWAYS

- A Cultivator Academy offers broad foundational education.
- A specialist institution, dojo, organization, or mentor may offer narrower or more advanced instruction.
- Arcanist education and access to specialized equipment, including a Formation Engraver, are not automatically included in ordinary academy education.
- An academy may provide a pathway toward further study, but attendance alone does not confer Arcanist Grade, Spirit Realm advancement, combat mastery, or access to restricted knowledge.

Outside the Golden Dragon Empire, institution counts and rules are established by regional canon rather than inferred from the Golden Dragon Empire's two-academy limit. Tianhai Yunzhou has four established Cultivator Academies, documented in `world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md`; their methods are more flexible than the Golden Dragon Empire's established central academy curriculum, but official cultivation, Spirit Ring, combat, and Arcanist mechanics still apply. Their exact admissions, costs, and detailed curricula remain unspecified.

## 4. LIMITS OF EDUCATION

The GM must distinguish between what a character has been taught and what the character can actually do.

- Attending lessons does not mean a character has mastered every subject.
- A character's knowledge depends on their actual education, experience, access to materials, and recorded history.
- Do not assume every academy teaches the same curriculum or has equal resources.
- Do not invent grades, certificates, examinations, tuition, academic years, or graduation rules.
- Do not treat introductory Spirit Ring theory as permission to bypass official absorption requirements.
- Do not treat knowledge of Artificial Artifacts as Arcanist expertise or manufacturing capability.
- If the specific academy, curriculum, or level of a character's education is unknown, keep that detail as `???` or establish it through play before relying on it.

## 5. GM ENFORCEMENT

When education matters in gameplay:

1. Establish which academy, mentor, or learning route the character actually attended, if any.
2. Determine which subjects and level of instruction are supported by the character's history.
3. Separate theoretical knowledge from practical skill and proven mastery.
4. Apply cultivation, Spirit Ring, combat, and Arcanist mechanics from their respective official modules.
5. Do not grant unrecorded abilities, bonuses, qualifications, or access solely because the character attended an academy.

## 6. CANON CONTINUITY

- The two-academy limit applies to the Golden Dragon Empire's central boarding academies, not to Tianhai Yunzhou or the entire world. Tianfeng remains a source of talent rather than a third Imperial academy. Consult `world/CANON_DECISIONS_AND_PRECEDENCE.md` before changing or extending the Imperial structure.

## 7. RELATED SOURCES

- `core/CULTIVATION_SYSTEM.md` — cultivation progression and Spirit Realms.
- `core/MARTIAL_SOUL.md` — Martial Soul rules.
- `core/SPIRIT_RING_RULES.md` — Spirit Ring mechanics and absorption.
- `bestiary/SPIRIT_BEAST_RULES.md` — Spirit Beast requirements and related rules.
- `gameplay/COMBAT_SYSTEM.md` — combat resolution.
- `core/ARCANISTRY_AND_FORMULATION.md` — Arcanist progression and Artificial Artifact formulation.
- `world/HISTORY.md` — established historical events.
- `world/ARTIFICIAL_ARTIFACTS.md` — Artificial Artifact lore and catalog.



---

<!-- SOURCE core/HP_SYSTEM.md | upstream blob efef616efa7ad9c44c81470da6dc52bddc813204 -->

# Merzkava Universe — HP System

Status: Mekanik resmi HP.
Cakupan: HP maksimum berdasarkan Spirit Realm dan Stage, format HP, serta pencatatan HP saat ini.

## 1. Prinsip Dasar

- Mortal memiliki HP maksimum **100**.
- Spirit Primordial/Stage 4 (Peak) memiliki HP maksimum **8.950**.
- HP ditulis sebagai **HP saat ini / HP maksimum**, misalnya `HP: 100/100`.
- HP maksimum ditentukan oleh Spirit Realm dan Stage pada tabel resmi di bawah.
- HP saat ini berubah hanya karena kejadian gameplay yang sah, misalnya menerima damage atau pemulihan yang memiliki dasar. Naik Spirit Realm atau Stage menaikkan batas maksimum sesuai tabel, tetapi **tidak otomatis memulihkan HP saat ini hingga penuh**.
- **Jika HP saat ini mencapai 0, karakter mati.** Kematian bersifat permanen kecuali mekanik resmi yang sudah ditetapkan secara eksplisit menyatakan sebaliknya. HP 0 bukan sekadar pingsan atau kondisi sekarat; jangan mengubahnya menjadi status lain tanpa dasar mekanik resmi.
- **Modul ini belum menetapkan laju numerik pemulihan HP umum.** Istirahat, tidur, makanan, obat, tabib, teknik, atau artefak tidak boleh diberi angka pemulihan HP tanpa aturan atau efek terdokumentasi. GM boleh mencatat pemulihan naratif yang jelas didukung sumber/kejadian, tetapi tidak boleh mengarang angka atau durasi sebagai aturan resmi.
- Progres pemulihan injury di `core/INJURY_SYSTEM.md` hanya memulihkan cedera yang dicatat; progres tersebut tidak mengisi HP. Sebaliknya, HP yang pulih tidak otomatis mengurangi progres injury.
- Tabib yang berhasil ditemukan atau melakukan tindakan tidak otomatis memulihkan HP. HP hanya berubah jika hasil perawatan, obat, teknik, atau kemampuan memiliki efek HP yang eksplisit dan terdokumentasi, syaratnya terpenuhi, serta efek itu benar-benar diterapkan. Stabilisasi dapat mencegah kondisi memburuk bila mekanik dan situasi mendukung, tetapi tidak otomatis memberi HP, menghapus injury, atau membatalkan kematian.
- Jangan menciptakan damage, pemulihan, bonus HP, atau pengecualian yang tidak didukung mekanik resmi.
- Formula ini menentukan HP maksimum, bukan damage, pertahanan, peluang menang, atau kekuatan tempur secara keseluruhan.

## 2. Tabel HP Maksimum

| Spirit Realm | Stage 1 (Early) | Stage 2 (Middle) | Stage 3 (Late) | Stage 4 (Peak) |
|---|---:|---:|---:|---:|
| Mortal | — | — | — | 100 |
| Spirit Initiate | 150 | 200 | 250 | 300 |
| Spirit Adept | 375 | 450 | 525 | 600 |
| Spirit Elder | 700 | 800 | 900 | 1.000 |
| Spirit Monarch | 1.150 | 1.300 | 1.450 | 1.600 |
| Spirit King | 1.825 | 2.050 | 2.275 | 2.500 |
| Spirit Ancestor | 2.800 | 3.100 | 3.400 | 3.700 |
| Spirit Emperor | 4.075 | 4.450 | 4.825 | 5.200 |
| Spirit Sovereign | 5.650 | 6.100 | 6.550 | 7.000 |
| Spirit Primordial | 7.488 | 7.975 | 8.463 | **8.950** |

Mortal bukan salah satu dari sembilan Spirit Realm. Gunakan `Mortal/0` pada profil untuk menandai status mortal tanpa Stage kultivasi.

## 3. Formula Interpolasi Stage

Untuk setiap Spirit Realm, gunakan HP Peak Spirit Realm itu sebagai batas maksimum (H_max) dan HP Peak Spirit Realm sebelumnya sebagai batas dasar (H_prev). Untuk Spirit Initiate, H_prev = 100 (Mortal). Untuk Spirit Realm berikutnya, H_prev adalah HP Peak Spirit Realm sebelumnya.

Hitung selisih:

`ΔH = H_max − H_prev`

Kemudian:

- Stage 1 / Early: `H_prev + round(ΔH × 0,25)`
- Stage 2 / Middle: `H_prev + round(ΔH × 0,50)`
- Stage 3 / Late: `H_prev + round(ΔH × 0,75)`
- Stage 4 / Peak: `H_max`

Gunakan pembulatan ke bilangan bulat terdekat. Jika hasil tepat berada di antara dua bilangan bulat, bulatkan ke atas. Tabel pada §2 adalah nilai rujukan final; gunakan angka tabel jika ada perbedaan akibat pembulatan.

Batas HP Peak per Spirit Realm:
- Mortal: 100
- Spirit Initiate: 300
- Spirit Adept: 600
- Spirit Elder: 1.000
- Spirit Monarch: 1.600
- Spirit King: 2.500
- Spirit Ancestor: 3.700
- Spirit Emperor: 5.200
- Spirit Sovereign: 7.000
- Spirit Primordial: 8.950

## 4. Format dan Validasi Profil

- Format wajib: `HP: saat_ini/maksimum`.
- Jika Spirit Realm/Stage diketahui, isi HP maksimum dari tabel.
- **Inisialisasi sesi baru:** jika snapshot karakter tidak mencatat HP saat ini, tetapkan HP awal sama dengan maksimum yang berlaku pada Spirit Realm/Stage tersebut. Contoh: Mortal tanpa HP awal tercatat menjadi `HP: 100/100`, bukan `HP: ???/100`.
- **Sesi berjalan:** pertahankan HP saat ini dari profil gameplay terakhir dan terapkan hanya perubahan yang sah. Jika profil sesi berjalan tidak memuat nilai HP saat ini dan tidak ada riwayat untuk memulihkannya, isi `0` sebagai nilai numerik yang belum tersedia; jangan gunakan `???`.
- Jika Spirit Realm/Stage belum diketahui, gunakan `HP: 0/0` sampai Spirit Realm/Stage dapat ditetapkan. Jangan gunakan `???` untuk nilai HP.
- Jangan memulihkan HP ke penuh pada sesi berjalan tanpa penyebab sah. Pengecualian hanya inisialisasi sesi baru ketika snapshot tidak mencatat HP saat ini: gunakan maksimum yang berlaku sebagai HP awal.
- Nilai HP saat ini tidak boleh melebihi maksimum. Jika riwayat atau input bertentangan, tandai konflik dan jangan diam-diam mengubah HP.
- Saat Spirit Realm/Stage berubah, perbarui angka maksimum sesuai tabel, tetapi pertahankan HP saat ini yang tercatat sampai ada perubahan yang sah.

## 5. Konsistensi

- Istilah tingkat kultivasi harus selalu ditulis **Spirit Realm**. `Mortal` adalah status sebelum sembilan Spirit Realm, bukan Spirit Realm 0; jangan menggunakan `Realm` sebagai singkatan tingkat kultivasi.

- Gunakan `core/CULTIVATION_SYSTEM.md` untuk memastikan Spirit Realm dan Stage yang sah.
- Gunakan modul pertarungan resmi jika tersedia untuk menentukan damage, pertahanan, dan hasil pertarungan. Tabel ini sendiri tidak menetapkan angka damage.
- Gunakan `core/INJURY_SYSTEM.md` untuk progres cedera; jangan memakai laju progres injury sebagai laju pemulihan HP.
- Jangan menafsirkan Mortal sebagai bukti bahwa Martial Soul belum awakening.
- Jangan mengubah angka HP maksimum di tabel tanpa revisi canon oleh pemilik repository.



---

<!-- SOURCE core/HUNGER_AND_METABOLISM.md | upstream blob 66bdc7d4fe4d5270cf3c40193909aca582ac1dde -->

# Merzkava Universe — Hunger and Metabolism

**Status:** Modul mekanik resmi.  
**Cakupan:** Satiety, jadwal makan, pengurangan karena waktu aktif, tidur malam, Spirit Realm, kondisi tubuh, dan pengubah biologis/supranatural.

Modul ini adalah satu-satunya sumber angka untuk Hunger dan Metabolism. Jangan membuat rumus hunger tandingan di modul lain.

## 1. Stat Satiety

### Konsumsi item yang belum teridentifikasi

Jika item yang dikonsumsi belum memiliki identitas/jenis pasti atau detail relevan yang ditetapkan oleh kanon/GM, sebut item itu dengan label persis ``Unknown`` **membutuhkan appraisal untuk lebih pastinya** dalam laporan konsumsi dan ledger. Jangan menebak efek nutrisi, tier, atau nilai Satiety dari label tersebut. Konsumsi hanya boleh diproses jika konteks mendukung bahwa benda itu memang layak dimakan; jika tidak, identitas dan efeknya tetap belum diketahui sampai diperiksa/appraised secara sah. Makanan sehari-hari yang sudah jelas tetap mengikuti aturan konsumsi rutin dan tidak perlu appraisal.


Format stat wajib:

`Satiety: nilai/100`

- Satiety adalah ukuran rasa kenyang dan cadangan makan jangka pendek untuk gameplay, bukan HP atau Qi.
- Nilainya berada pada rentang 0–100. Jangan melebihi 100 atau mengurangi di bawah 0.
- Makanan/minuman yang layak dikonsumsi menambah Satiety sesuai efek resminya; semua waktu terjaga diklasifikasikan sebagai istirahat atau aktivitas dan mengurangi Satiety sesuai kategori §4. Istirahat tidak pernah memulihkan Satiety; hanya memperlambat pengurangannya.
- Satiety 0 berarti karakter kehabisan rasa kenyang dan perlu makan. Itu **tidak otomatis** berarti pingsan, kehilangan HP, atau mati. Konsekuensi tambahan harus memiliki aturan atau sebab yang sah.
- Makanan/minuman yang aman dan layak dikonsumsi menambah Satiety sesuai efek resmi item atau kategori porsi §2. Racun, makanan rusak/terkontaminasi, benda yang tidak layak dimakan, dan konsumsi dengan efek khusus mengikuti aturan item/kejadian; jangan otomatis memberinya efek positif.
- Jangan mengubah Satiety tanpa waktu terjaga yang berlalu, konsumsi yang benar-benar terjadi, atau pengubah yang sah.
- Nilai Satiety 100 hanya boleh dipertahankan bila state sebelumnya dan perhitungan interval membenarkannya, atau ada konsumsi/pengubah resmi yang benar-benar menaikkannya. Penampilan prima, stamina tinggi, tidak mengeluh lapar, atau deskripsi kualitatif seperti 'jarang merasa lapar' tidak membatalkan pengurangan numerik. Efek biologis khusus hanya mengubah angka jika sumber resmi menetapkan faktor numerik yang sah.

## 2. Jadwal Makan Normal

Tiga jendela makan harian:

| Waktu lokal dunia | Jendela makan |
|---|---|
| 06.00–11.00 | Pagi |
| 12.00–18.00 | Siang |
| 19.00–01.00 | Malam |

- Karakter normal umumnya makan tiga kali sehari.
- Satu **porsi makan standar yang benar-benar dikonsumsi** memulihkan **34 Satiety**. Nilai ini bukan bonus otomatis karena karakter memesan makanan atau duduk untuk makan.
- Porsi kecil/camilan yang benar-benar dikonsumsi memulihkan 10 poin; porsi besar memulihkan 50 poin. Pilih kategori berdasarkan jumlah yang benar-benar dimakan, bukan ukuran pesanan atau porsi yang disajikan. Jika karakter hanya mencicipi atau memakan sebagian kecil, hitung hanya bagian yang benar-benar dikonsumsi sesuai kategori yang didukung; jangan menganggap seluruh hidangan habis.
- Satiety dari makanan ditambahkan ke nilai sekarang dan dibatasi maksimum 100. Makan tidak otomatis mengisi ke 100 jika porsinya tidak cukup.
- Jika item memiliki nilai pemulihan Satiety resmi yang spesifik, gunakan nilai itu; jika tidak, pilih kategori porsi hanya berdasarkan jenis dan jumlah yang jelas mendukungnya. **Tier item tidak menentukan nilai Satiety.** Saat melaporkan konsumsi, sebutkan nama item, jumlah, efek Satiety aktual, serta nilai sebelum → sesudah; cantumkan tier/kualitas hanya jika sudah diketahui atau relevan. Makanan sehari-hari yang jelas memakai kategori ekonomi rutin dan harga pasar lokal dari `core/10_ECONOMY_SYSTEM.md`; jangan mewajibkan appraisal hanya karena makanan itu tidak memiliki tier khusus. Gunakan `core/TIER_ASSESSMENT_AND_APPRAISAL.md` hanya bila identitas atau klasifikasi khusus memang penting: dahulukan ruling MAA untuk objek yang diperiksa, atau prediksi GM berskor dengan bukti cukup dan label provisional. Jika bukti tidak cukup, nyatakan klasifikasi belum ditetapkan; jangan menghambat transaksi atau konsumsi rutin karena tidak ada appraisal.
- Makan di luar jendela tetap memulihkan Satiety sesuai porsi. Setelah makanan yang layak benar-benar dikonsumsi, hitungan beruntun jam makan terlewat direset; riwayat jendela yang sebelumnya terlewat tidak dihapus dari catatan kejadian.
- Jam makan yang terlewat dihitung saat jendela berakhir tanpa karakter makan, **hanya jika karakter terjaga dan punya kesempatan wajar untuk makan**. Jendela yang berlalu saat tidur tidak dihitung sebagai jam makan terlewat.
- Jika karakter tidak punya akses makanan atau tidak bisa makan karena situasi, jangan menganggap ia sengaja melewatkan makan; catat keadaan itu dan terapkan pengali jam makan terlewat hanya sesuai ketentuan di §5.

## 3. Laju Dasar Menurut Tingkat

Laju dasar menunjukkan waktu terjaga yang diperlukan untuk mengurangi 100 Satiety dari penuh ke 0 sebelum pengali kategori aktivitas, kondisi tubuh, jendela makan terlewat, dan efek khusus yang sah diterapkan.

| Tingkat tubuh/kultivasi | Waktu aktif per 100 Satiety |
|---|---:|
| Mortal (belum memasuki sembilan Spirit Realm) | 24 jam |
| Spirit Initiate | 2 hari |
| Spirit Adept | 4 hari |
| Spirit Elder | 8 hari |
| Spirit Monarch | 16 hari |
| Spirit King | 32 hari |
| Spirit Ancestor | 64 hari |
| Spirit Emperor | 128 hari |
| Spirit Sovereign | 256 hari |
| Spirit Primordial | 365 hari |

Gunakan Spirit Realm yang benar-benar tercatat dan jangan menyingkat tingkat kultivasi menjadi `Realm`. Mortal adalah status dasar sebelum sembilan Spirit Realm. Jangan menaikkan tingkat metabolisme hanya karena karakter memiliki Martial Soul langka, ring berusia tinggi, kekayaan, status sosial, atau kekuatan yang belum ditetapkan. Pengaruh khusus harus memenuhi §7.

## 4. Rumus Pengurangan Satiety dan Intensitas Aktivitas

Gunakan satu rumus dasar untuk setiap interval waktu terjaga:

Pengurangan dasar = (Jam terjaga dalam interval / Waktu dasar per 100 Satiety dalam jam) × 100

Pengurangan akhir = min(Satiety saat ini, Pengurangan dasar × A × F × B × S)

- Jam terjaga dalam interval: durasi dunia yang benar-benar berlalu dalam satu segmen aktivitas, tidak termasuk tidur malam yang dilindungi §6.
- Waktu dasar: nilai pada tabel §3 yang dikonversi ke jam.
- A: pengali kategori aktivitas di bawah.
- F: pengali jendela makan terlewat di §5.
- B: pengali kondisi tubuh di §7.
- S: pengali biologis/supranatural hanya jika ada angka resmi yang sah. Jika tidak ada, gunakan ×1,00.
- Batas pengali gabungan: setelah mengalikan faktor yang sah, gunakan nilai akhir maksimum ×8,00 untuk satu interval. Batas ini mencegah kombinasi pengali membuat Satiety habis secara matematis dalam beberapa menit, tetapi aktivitas Survival tetap sangat menguras.
- Pengali aktivitas adalah kategori eksklusif untuk segmen waktu yang sama. Jangan mengalikan Ringan × Sedang × Berat × Survival sekaligus. Jika aktivitas berubah, pisahkan durasinya menjadi segmen berbeda.
- Pengali kondisi tubuh tetap faktor terpisah dari aktivitas hanya jika kelelahan benar-benar terjadi dan memiliki dasar. Jangan menghitung dampak yang sama dua kali sebagai kategori aktivitas dan pengubah khusus.
- Hitung seluruh interval dengan presisi internal penuh. **Bulatkan hanya nilai yang ditampilkan di laporan dan profil ke 0,1 Satiety**; jangan membulatkan state internal setelah setiap aktivitas. Jika perubahan internal kurang dari 0,05 sehingga tampilan satu desimal tidak berubah, tetap laporkan perubahan presisi internal, nilai tampilan yang tetap, dan catat peristiwa tersebut di ledger. Jangan kehilangan sisa pecahan akibat pembulatan tampilan.
- Pengurangan aktual tidak boleh melebihi Satiety yang tersedia. Nilai akhir tidak pernah kurang dari 0.
- Jika tidak ada waktu terjaga yang berlalu, tidak ada pengurangan karena waktu kecuali mekanik khusus resmi menyatakan sebaliknya.

### Kategori aktivitas — wajib untuk setiap interval terjaga

| Kategori | Pengali A | Contoh dan batas |
|---|---:|---|
| Istirahat terjaga | ×0,50 | Duduk/berbaring untuk memulihkan tenaga, berhenti sejenak, atau istirahat aman tanpa aktivitas fisik berarti. Memperlambat pengurangan; **tidak menambah Satiety**. |
| Ringan | ×1,25 | Berjalan santai, berbelanja, mengobrol sambil bergerak, tugas ringan, aktivitas sehari-hari tanpa tuntutan fisik berarti. |
| Sedang | ×1,75 | Berjalan jauh, perjalanan aktif, latihan rutin, kultivasi/meditasi terfokus yang berkelanjutan, pekerjaan fisik berkelanjutan, atau eksplorasi yang terus menguras tenaga. |
| Berat | ×2,50 | Berlari lama, membawa beban berat, latihan intensif, pertarungan singkat yang menguras tenaga, atau kerja fisik berat. |
| Survival | ×4,00 | Keadaan darurat nyata: bertahan/berjuang di medan perang, bencana, kabur dari ancaman yang terus berlangsung, atau combat berkepanjangan yang memicu tekanan fisik dan adrenalin. |

- Setiap interval waktu terjaga harus diklasifikasikan sebagai satu kategori aktivitas yang paling sesuai, termasuk Istirahat terjaga bila memang sedang beristirahat. Jangan membiarkan waktu aktif tanpa kategori.
- Survival bukan sinonim untuk aktivitas yang sekadar sulit atau lokasi berbahaya. Harus ada ancaman darurat yang nyata dan perjuangan aktif/berkelanjutan. Berdiri di medan perang tanpa mengerahkan tenaga atau berada di dekat bencana tidak otomatis membuat seluruh waktu menjadi Survival.
- Adrenalin adalah alasan naratif untuk mengklasifikasikan kejadian sebagai Survival bila syaratnya terpenuhi; jangan menambahkan pengali adrenalin kedua di atas ×4,00.
- Jika kategori berubah dalam satu aksi, hitung setiap segmen dengan durasi dan pengalinya sendiri, lalu jumlahkan pengurangannya. Jangan menghitung durasi yang sama dua kali.
- Jika aktivitas menimbulkan kelelahan yang didukung kejadian, pengali kondisi tubuh §7 boleh berlaku bersamaan. Kategori aktivitas dan kondisi tubuh mengukur hal berbeda, tetapi pengali gabungan tetap tunduk pada batas ×8,00.

**Contoh Mortal:** 6 jam aktivitas Ringan, kondisi normal, tanpa jendela makan terlewat: (6/24 × 100) × 1,25 = 31,25, dibulatkan menjadi **31,3 Satiety**.

**Contoh Mortal Survival:** 1 jam Survival, kelelahan ekstrem, dan 3+ jendela makan terlewat: pengali mentah 4,00 × 2,50 × 4,00 = 40,00, dibatasi menjadi ×8,00; pengurangan maksimum dari interval 1 jam ialah 33,3 Satiety sebelum dibatasi oleh Satiety yang tersedia.

**Contoh Spirit Primordial:** 24 jam aktivitas Ringan dalam kondisi normal tanpa jendela makan terlewat: pengurangan internal ≈ 0,014 Satiety; tampilan satu desimal dapat tetap sama pada interval ini, tetapi sisa presisi tetap disimpan dan diakumulasikan pada interval berikutnya.

## 5. Jam Makan Terlewat

Hitung jendela makan yang terlewat secara beruntun saat karakter terjaga dan memiliki kesempatan yang wajar untuk makan. Terapkan **satu pengali aktif** berikut untuk interval terjaga berikutnya; jangan menumpuk pengali per jendela dan jangan mengubah perhitungan interval yang sudah selesai secara retroaktif.

| Jendela makan terlewat berturut-turut | Pengali F |
|---|---:|
| 0 | ×1,00 |
| 1 | ×1,75 |
| 2 | ×2,75 |
| 3 atau lebih | ×4,00 |

- Sebuah jendela dihitung terlewat ketika jendela itu berakhir tanpa karakter makan, selama karakter terjaga dan punya kesempatan yang wajar untuk makan. Jendela yang berlalu saat tidur malam yang dilindungi tidak dihitung.
- Pengali baru mulai berlaku pada interval terjaga setelah jendela dinyatakan terlewat. Jangan menerapkannya kembali ke interval yang sudah dihitung.
- Setelah karakter benar-benar mengonsumsi makanan atau minuman bernutrisi yang secara wajar memenuhi kebutuhan makan, reset hitungan jendela makan terlewat menjadi 0 untuk interval berikutnya. Air biasa atau konsumsi nonnutritif tidak otomatis mereset hitungan kecuali aturan item resmi menyatakan sebaliknya. Konsumsi tetap memulihkan Satiety sesuai efek resmi item meskipun terjadi di luar jendela makan.
- Jika karakter terkurung, tidak sadar, terikat, atau situasi nyata lain menghalangi akses/kemampuan makan, jangan menyebutnya sengaja melewatkan makan. Hitung hanya kesempatan makan yang benar-benar ada; jangan menambahkan pengali saat karakter tidak punya pilihan wajar.
- Jangan menambahkan pengurangan tetap khusus hanya karena sebuah jendela terlewat. Dampaknya diterapkan melalui pengali F terhadap pengurangan selama waktu terjaga berikutnya.

## 6. Tidur Malam dan Penguncian Satiety

Tidur malam normal adalah kebutuhan biologis dan pengecualian resmi dari batas durasi aksi biasa.

- Ketika karakter mulai tidur malam, catat nilai Satiety terakhir sebagai nilai terkunci.
- Selama tidur malam normal, **Satiety tidak berkurang**. Jangan menerapkan pengurangan waktu aktif, pengali kondisi tubuh, atau jam makan terlewat selama periode tidur yang dilindungi.
- Ketika karakter bangun, lanjutkan perhitungan dari nilai Satiety yang terkunci dan mulai menghitung waktu aktif kembali dari waktu bangun.
- Tidur malam boleh melewati batas aksi biasa 3 jam dalam `gameplay/TIME_AND_ACTION_RULES.md`; jangan memaksa pemain membagi tidur normal menjadi aksi tiga jam.
- Tidur tidak otomatis memulihkan Satiety, HP, Qi, atau injury. Tidur hanya mengunci pengurangan Satiety selama periode tidur normal; pemulihan sistem lain mengikuti aturan masing-masing.
- Jika tidur terganggu dan karakter benar-benar terjaga untuk periode tertentu, hitung pengurangan hanya selama waktu terjaga tersebut. Jangan menghukum waktu tidur yang benar-benar terjadi.
- Tidur siang atau pingsan tidak otomatis dianggap tidur malam yang dilindungi. Perlakukan sesuai fakta kejadian; jangan gunakan tidur sebagai alasan untuk mengabaikan kebutuhan darurat atau konsekuensi yang telah ditetapkan.

## 7. Kondisi Tubuh dan Pengubah Khusus

Kondisi tubuh mengubah laju pengurangan Satiety dengan faktor B. Pilih satu kategori kelelahan yang paling sesuai dengan kondisi aktual; kategori yang saling tumpang tindih tidak boleh ditumpuk.

| Kondisi tubuh | Pengali B |
|---|---:|
| Normal / lelah ringan | ×1,00 |
| Kelelahan nyata | ×1,25 |
| Kelelahan berat | ×1,75 |
| Kelelahan ekstrem | ×2,50 |

- Kelelahan harus memiliki dasar kejadian, misalnya aktivitas berkepanjangan, perjalanan berat, latihan intensif, kurang istirahat, atau perjuangan survival.
- Pengali kondisi tubuh adalah kategori alternatif. Jika karakter mengalami kelelahan ekstrem, gunakan ×2,50 saja, bukan ×1,25 ×1,75 ×2,50.
- Cedera, penyakit, racun, demam, kehamilan, usia, cuaca, atau kondisi khusus lain tidak mendapat pengali default dari modul ini. Terapkan hanya jika ada aturan resmi lain atau efek spesifik yang telah ditetapkan.
- Jangan memberikan pengali kelelahan otomatis hanya karena giliran berlalu. Klasifikasi harus didukung aktivitas, kondisi, atau kejadian yang benar-benar terjadi.
- Aktivitas dan kondisi tubuh boleh menjadi faktor terpisah hanya jika keduanya menggambarkan efek independen. Batas gabungan pengali ×8,00 pada §4 tetap berlaku.

### Keunggulan atau kelemahan biologis/supranatural

Genetik, garis keturunan, kutukan, berkah langit, konstitusi khusus, Martial Soul, obat, teknik, relik, atau efek supernatural boleh mengubah metabolisme, tetapi tidak otomatis melakukannya.

1. Pastikan sifat atau efek tersebut tercatat atau diperoleh melalui kejadian yang sah.
2. Tentukan apakah efek secara eksplisit memengaruhi kebutuhan makan/metabolisme.
3. Jika efek memiliki besaran numerik resmi, gunakan sebagai faktor S.
4. Jika efek hanya kualitatif, jangan menciptakan angka. Catat dampak naratifnya tanpa mengubah laju Satiety numerik sampai nilai resmi ditetapkan.
5. Jangan menyimpulkan bahwa keturunan kuat otomatis tidak lapar, kutukan otomatis meningkatkan hunger, atau berkah otomatis menurunkan hunger tanpa sumber yang sah.

Semua pengubah independen boleh dikalikan sebelum batas gabungan ×8,00 diterapkan, tetapi jangan menghitung efek yang sama dua kali, menumpuk kategori kelelahan, atau mengarang angka.

## 8. Urutan Resolusi Wajib GM

Setiap kali waktu berlalu, aktivitas berubah, makanan/minuman dikonsumsi, atau kondisi tubuh berubah:

1. Ambil timestamp terakhir yang sah dan tentukan durasi dunia yang benar-benar berlalu.
2. Pisahkan durasi menjadi segmen jika jenis aktivitas, kondisi tubuh, status terjaga, pengali, konsumsi, atau batas akhir jendela makan berubah. Ketika jendela makan berakhir di tengah interval, hitung segmen sebelum dan sesudah batas secara terpisah agar pengali baru tidak diterapkan secara retroaktif.
3. Kecualikan tidur malam yang dilindungi §6. Selama tidur itu, Satiety terkunci pada nilai saat tidur dimulai.
4. Tentukan Spirit Realm/status tubuh dan waktu dasar dari §3.
5. Klasifikasikan setiap interval terjaga dengan tepat satu kategori aktivitas dari §4.
6. Perbarui hitungan jendela makan hanya ketika jendela berakhir dan syarat kesempatan makan terpenuhi. Pengali baru berlaku ke interval berikutnya.
7. Tentukan satu pengali kondisi tubuh dan faktor khusus yang benar-benar didukung sumber resmi.
8. Hitung pengurangan per segmen memakai §4, terapkan batas pengali gabungan ×8,00, jumlahkan segmen, dan batasi pengurangan pada Satiety yang tersedia.
9. Terapkan efek konsumsi hanya jika item benar-benar dimakan/diminum. Gunakan efek Satiety resmi item jika tersedia; jika tidak, gunakan kategori porsi §2 berdasarkan jenis dan jumlah yang jelas mendukungnya. Jangan menyimpulkan efek dari tier saja.
10. Batasi nilai akhir pada 0–100 dan simpan nilai terbaru pada profil serta riwayat sesi.
11. Untuk setiap aktivitas terbaru, sebutkan Satiety dalam respons: tampilkan perubahan dan nilai sebelum → sesudah bila berubah; jika tidak berubah, nyatakan nilai tetap dan alasan (misalnya tidur malam yang dilindungi atau tidak ada waktu terjaga yang berlalu). Sebelum memakai 100/100, audit state sebelumnya dan hitung semua interval terjaga yang sudah berlalu; jangan menyimpulkan Satiety penuh dari kondisi prima atau sifat 'jarang lapar'.
12. Untuk setiap aktivitas terbaru, gunakan laporan yang konsisten. Jika Satiety berubah karena aktivitas: “Satiety berkurang −X (sebelum/100 → sesudah/100) akibat [kategori aktivitas] selama [durasi].” Jika dikonsumsi: “Dengan mengonsumsi **[nama item]** *Tier [tier resmi atau ‘Tier belum ditetapkan’]* ×[jumlah], Satiety bertambah/berkurang [±X] (sebelum/100 → sesudah/100).” Pakai kata bertambah atau berkurang sesuai efek aktual, bukan asumsi. Setelah kalimat perubahan terverifikasi, tulis persis inline-code `Log tercatat!`, lalu satu `LEDGER LOG` untuk semua perubahan state dari tindakan itu. Jika nilai tampilan satu desimal tidak berubah karena perubahan internal sangat kecil, sebutkan delta presisi internal dan nilai tampilan yang tetap, lalu catat perubahan tersebut. Jangan tampilkan penanda atau ledger jika tidak ada perubahan state aktual.
13. **Rekonsiliasi ledger konsumsi:** jika makanan dibeli lalu dikonsumsi dalam aksi yang sama, catat transaksi uang dan pergerakan item/konsumsi sebagai subentri terkait dalam satu `LEDGER LOG` tampilan. Catat jumlah yang dibeli, jumlah yang benar-benar dikonsumsi, dan sisa yang benar-benar dibawa atau ditinggalkan bila relevan. Makanan yang habis dikonsumsi tidak boleh tetap tercantum di Inventory; sisa makanan hanya masuk Inventory jika benar-benar disimpan. Pemulihan Satiety dihitung sekali dari jumlah yang benar-benar dimakan, bukan dari jumlah yang dipesan dan bukan lagi dari jumlah yang tercatat sebagai konsumsi. Jika transaksi atau konsumsi tidak terjadi, jangan catat perubahan terkait.
14. Jangan mengubah HP, Qi, injury, atau kondisi lain hanya karena Satiety berubah, kecuali sumber resmi lain atau kejadian sah menetapkan hubungan itu. Format dan urutan laporan gabungan mengikuti `templates/AUTHORITY_ORDER.md`, `templates/GAMEPLAY_RESPONSE_TEMPLATE.md`, dan `core/10_ECONOMY_SYSTEM.md`.

Jika timestamp, Spirit Realm, periode tidur, kategori aktivitas, atau kondisi penting tidak diketahui, jangan menebak angka secara diam-diam. Gunakan data terverifikasi yang tersedia dan ungkapkan celahnya; minta klarifikasi hanya jika tanpa itu hasil tidak bisa diselesaikan dengan aman dan konsisten.

## 9. Format Profil

Tambahkan field berikut ke profil gameplay:

`Satiety: nilai/100`

Nilai harus berasal dari profil terakhir dan perubahan yang benar-benar terjadi. Jika state awal Satiety belum pernah ditetapkan, GM dapat menetapkan nilai awal yang masuk akal untuk karakter baru dan menandainya sebagai estimasi awal; jangan menganggap semua karakter yang sudah berjalan otomatis berada di 100.



---

<!-- SOURCE core/INJURY_SYSTEM.md | upstream blob a90d3d1c58afd3da171d66bc632b23e2a30cbbfd -->

# Merzkava Universe — Injury System

**Status:** Mekanik resmi injury v1.  
**Cakupan:** klasifikasi cedera, syarat pemulihan, progres pemulihan, dan hubungan injury dengan HP.

## 1. Prinsip Dasar

- **HP dan injury adalah dua hal berbeda.** HP mengukur kondisi keseluruhan; injury mencatat kerusakan tertentu pada tubuh.
- HP yang pulih tidak otomatis menyembuhkan injury. Injury yang sembuh juga tidak otomatis mengisi HP sampai penuh.
- Setiap injury yang berdampak pada gameplay harus dicatat dengan: nama/jenis, bagian tubuh jika diketahui, kelas injury, kondisi pemicu, metode pemulihan yang dibutuhkan, progres pemulihan, serta efek atau komplikasi yang benar-benar terjadi.
- Gunakan hanya cedera yang didukung kejadian. Jangan memberi cedera baru hanya untuk menghukum karakter, dan jangan menghapus cedera tanpa alasan pemulihan yang sah.
- Tingkat keparahan tidak ditentukan dari nama luka saja. Pertimbangkan mekanisme cedera, lokasi, damage yang diterima, kondisi karakter, dan hasil pemeriksaan atau penanganan yang tercatat. **Jumlah HP yang hilang saja tidak cukup untuk menentukan kelas injury**: HP adalah dampak umum, sedangkan injury adalah kerusakan tubuh tertentu.
- Satu kejadian dapat menimbulkan beberapa injury berbeda. Jangan menggabungkan, menggandakan, atau menganggap satu cedera sebagai cedera lain tanpa dasar.
- Persentase progres adalah **kemajuan pemulihan injury**, bukan HP. Progres 100% berarti injury itu pulih; efek sisa hanya boleh dipertahankan bila sudah tercatat dan memiliki dasar.

## 2. Empat Kelas Injury

| Kelas | Nama | Contoh umum | Pemulihan alami | Pengobatan |
|---|---|---|---|---|
| I | Ringan | Memar ringan, lecet, luka dangkal, ketegangan otot ringan | Bisa pulih dengan istirahat dan perawatan dasar | Membantu mempercepat pemulihan |
| II | Membutuhkan Perawatan | Luka dalam yang belum kritis, keseleo sedang, luka bakar sedang, robekan jaringan ringan | Bisa pulih lambat jika kondisi memungkinkan; risiko komplikasi tetap ada | Perawatan yang tepat mempercepat pemulihan secara signifikan |
| III | Struktural | Patah tulang, dislokasi, robekan tendon/ligamen berat, kerusakan struktur tubuh | Istirahat saja tidak cukup untuk pemulihan yang benar; fungsi dapat tetap terganggu atau cedera memburuk | Wajib ada penanganan yang sesuai, misalnya reposisi, bidai, imobilisasi, atau teknik penyembuhan yang terbukti |
| IV | Kritis | Pendarahan internal berat, kerusakan organ, luka yang mengancam nyawa, keracunan berat | Tidak dianggap pulih secara alami; dapat memburuk atau menyebabkan kematian | Perlu penanganan mendesak yang sesuai. Pemulihan baru berjalan setelah kondisi cukup stabil |

Contoh di atas adalah panduan klasifikasi, bukan diagnosis otomatis. Jika tingkat keparahan belum dapat diketahui, catat sebagai **injury belum terklasifikasi** sampai ada bukti yang cukup.

## 3. Progres Pemulihan

Setiap injury memiliki progres tersendiri dari **0% sampai 100%**. Gunakan tabel berikut sebagai laju dasar per 24 jam waktu dalam dunia game, bukan waktu nyata.

| Kelas injury | Pemulihan alami saat istirahat penuh | Dengan perawatan tepat |
|---|---:|---:|
| I — Ringan | +10 poin progres | +20 poin progres |
| II — Membutuhkan Perawatan | +2 poin progres | +10 poin progres |
| III — Struktural | Tidak ada progres pemulihan fungsional | +5 poin progres setelah penanganan yang diperlukan selesai |
| IV — Kritis | Tidak ada progres sebelum kondisi distabilkan | +2 poin progres setelah stabil dan selama penanganan berkelanjutan |

- Maksimum progres adalah 100%; jangan melampauinya.
- Terapkan laju berdasarkan waktu pemulihan yang benar-benar berlalu. Jika waktu berlalu kurang dari 24 jam, hitung secara proporsional.
- Angka pada tabel adalah laju dasar saat istirahat penuh dan tanpa komplikasi. Jika karakter beraktivitas, kembali bertarung, atau menggunakan bagian tubuh yang cedera, GM dapat mengurangi progres atau memperburuk injury **hanya jika aktivitas tersebut secara masuk akal mengganggu penyembuhan**. Jangan memberi penalti otomatis tanpa kaitan dengan cedera.
- Perawatan harus sesuai dengan jenis injury dan benar-benar tersedia serta digunakan. Salep tidak otomatis menyembuhkan patah tulang; tabib tidak otomatis berhasil; pil, teknik, artefak, dan kemampuan penyembuhan hanya berpengaruh sesuai fungsi yang telah ditetapkan.
- Untuk injury kelas III, progres dihitung setelah penanganan struktural yang diperlukan—misalnya tulang diposisikan dan diimobilisasi—benar-benar dilakukan. Tanpa penanganan itu, istirahat saja tidak menambah progres pemulihan fungsional.
- Untuk injury kelas IV, penanganan awal harus menstabilkan kondisi terlebih dahulu. Jika belum stabil, jangan menambahkan progres pemulihan dan selesaikan konsekuensi sesuai kondisi yang tercatat.
- Jika metode pengobatan, kualitas obat, kemampuan tabib, atau efektivitas teknik belum memiliki aturan khusus, gunakan laju dasar di atas dan jelaskan keterbatasannya; jangan mengarang bonus angka.

## 4. Syarat dan Efek Pengobatan

Pengobatan hanya dihitung bila semua syarat yang relevan terpenuhi:

1. **Kecocokan:** metode atau obat memang dapat menangani jenis injury tersebut.
2. **Akses:** karakter benar-benar memiliki, memperoleh, atau sedang ditangani dengan metode itu.
3. **Penerapan:** obat digunakan dengan benar, atau tabib/teknik melakukan penanganan yang diperlukan.
4. **Kebutuhan khusus:** cedera struktural sudah ditangani secara struktural; cedera kritis sudah distabilkan sebelum pemulihan rutin dimulai.

Jika seluruh syarat terpenuhi, gunakan laju kolom **Dengan perawatan tepat**. Jika hanya sebagian terpenuhi, jangan otomatis memberikan bonus penuh. Jika pengobatan salah atau berbahaya, efeknya ditentukan oleh fakta dan konsekuensi yang didukung situasi; jangan mengarang efek pasti.

**Batas kemampuan tabib:** keberadaan atau afiliasi tabib dengan Medicine Hall Society tidak otomatis menentukan tingkat keahlian, menjamin keberhasilan, atau memberi bonus angka. Nilai tindakan dari diagnosis/bukti yang tersedia, kecocokan prosedur, kompetensi yang sudah ditetapkan atau secara wajar dibuktikan dalam adegan, alat dan obat yang benar-benar tersedia, serta waktu dan kondisi pasien. Bila kompetensi atau efektivitas khusus belum ditetapkan, gunakan laju dasar **Dengan perawatan tepat** hanya setelah semua syarat §4 terpenuhi; jangan menambah bonus karena gelar, reputasi, atau afiliasi saja. Penanganan darurat/stabilisasi adalah tindakan awal, bukan berarti injury sudah sembuh.

## 5. Istirahat, Aktivitas, dan Komplikasi

- Istirahat penuh berarti karakter tidak melakukan aktivitas yang mengganggu pemulihan dan mendapat kesempatan memulihkan diri.
- Aktivitas ringan, perjalanan, latihan, pertarungan, atau penggunaan bagian tubuh yang cedera harus dinilai berdasarkan injury yang tercatat. Aktivitas tidak selalu memperburuk semua cedera.
- Komplikasi seperti infeksi, pendarahan berulang, tulang bergeser, atau cedera memburuk hanya boleh terjadi jika didukung oleh jenis injury, penanganan, kondisi, atau kejadian yang tercatat.
- Jika komplikasi terjadi, catat sebagai perubahan kondisi yang jelas. Jangan diam-diam mengatur ulang progres tanpa menjelaskan penyebabnya.
- Untuk injury yang mengancam nyawa, jangan memperlakukan tidur atau time skip sebagai pengganti penanganan darurat.

## 6. Hubungan dengan HP dan Sistem Lain

### Panduan konsekuensi injury dari Combat

Combat menentukan apakah kejadian benar-benar menimbulkan cedera; bagian ini membantu memilih konsekuensi tanpa membuat ambang damage kaku:

- **Benturan atau serangan ringan yang tertahan/teralihkan:** tidak wajib menghasilkan injury. Jika ada cedera yang tampak, gunakan Kelas I bila bukti mendukung.
- **Serangan bersih yang menembus pertahanan, luka sayat/tusuk yang jelas, atau benturan kuat:** pertimbangkan Kelas I atau II berdasarkan kedalaman, lokasi, dan mekanisme. Jangan otomatis memilih Kelas II hanya karena serangan mengenai target.
- **Patah tulang, dislokasi, tendon/ligamen rusak, atau kerusakan struktur yang jelas:** Kelas III. Jangan menyimpulkan cedera struktural dari angka damage saja.
- **Pendarahan internal berat, kerusakan organ, keracunan berat, atau kondisi yang mengancam nyawa:** Kelas IV hanya jika kejadian dan bukti mendukungnya; jangan membuat diagnosis internal hanya karena HP rendah.
- **Serangan beruntun/combo:** evaluasi tiap hit dan dampak gabungannya. Hit berikutnya dapat memperparah injury yang sudah ada atau menimbulkan injury berbeda jika mekanismenya mendukung; jangan menggandakan injury identik tanpa alasan.
- **Beda satu Spirit Realm:** terapkan aturan khusus di `gameplay/COMBAT_SYSTEM.md`. Itu menetapkan ekspektasi adanya injury setelah hit yang merusak, bukan izin untuk mengarang jenis cedera berat. Jika bukti hanya mendukung cedera ringan, catat Kelas I.
- **Deviasi penyerapan Spirit Ring:** catat cedera yang ditetapkan dari peristiwa deviasi. Jangan mengubah kategori risiko HP langsung menjadi diagnosis injury tertentu.

Jika bukti belum cukup untuk memilih kelas, catat `injury belum terklasifikasi` dan efek fungsional yang benar-benar terlihat. Klasifikasi dapat diperbarui ketika ada pemeriksaan atau bukti baru.

- Gunakan `core/HP_SYSTEM.md` untuk HP maksimum dan validasi HP.
- Gunakan `gameplay/COMBAT_SYSTEM.md` untuk damage dan penentuan konsekuensi serangan yang didukung situasi. Combat menentukan kejadian cedera; modul ini menentukan klasifikasi dan pemulihannya.
- Gunakan `core/SPIRIT_RING_RULES.md` untuk damage HP dan konsekuensi deviasi saat penyerapan Spirit Ring. Jika proses itu menghasilkan cedera, catat jenis cedera hanya berdasarkan hasil yang benar-benar ditetapkan; jangan mengarang diagnosis dari angka HP saja.
- Gunakan `gameplay/TIME_AND_ACTION_RULES.md` untuk waktu yang berlalu. Progres injury hanya bertambah selama waktu pemulihan yang benar-benar berlalu.
- Pemulihan HP dari modul lain tidak mengubah progres injury kecuali aturan khusus menyatakan demikian.
- Kemampuan penyembuhan, obat khusus, salep, tabib, atau artefak dapat mengganti atau meningkatkan laju dasar hanya jika efeknya terdokumentasi dan syaratnya terpenuhi.

## 7. Pencatatan dan Alur GM

Saat injury muncul atau berubah:

1. Catat cedera yang didukung oleh kejadian dan bagian tubuh jika diketahui.
2. Tentukan kelas injury berdasarkan bukti. Jika tidak cukup, tandai belum terklasifikasi.
3. Catat progres awal, biasanya 0% ketika injury baru terjadi.
4. Nyatakan apakah pemulihan alami memungkinkan atau pengobatan wajib.
5. Saat waktu berlalu, pilih laju yang sesuai dengan kondisi istirahat dan perawatan aktual.
6. Perbarui progres, kondisi, dan efek fungsional yang benar-benar berubah.
7. Pada 100%, tandai injury pulih dan hapus pembatasan yang berasal dari injury tersebut, kecuali efek sisa yang telah ditetapkan masih berlaku.

**Format pencatatan ringkas:**

`Injury: [jenis/lokasi] | Kelas: [I–IV/belum terklasifikasi] | Progres: [0–100]% | Syarat: [istirahat/perawatan khusus/stabilisasi] | Penanganan: [yang benar-benar dilakukan] | Efek: [yang masih berlaku]`

## 8. Batas Aturan

Kelas dan laju dalam modul ini adalah baseline umum. Modul ini belum menetapkan diagnosis medis terperinci, daftar obat khusus, tingkat kemampuan setiap tabib, atau efek numerik setiap teknik penyembuhan. Jangan mengarang angka atau menjadikan contoh umum sebagai kepastian. Aturan khusus yang kelak dibuat harus merujuk ke modul ini, bukan menduplikasi sistem progres injury di tempat lain.



---

<!-- SOURCE core/MARTIAL_SOUL.md | upstream blob 249e0304428c19cc0db535bb17cd0e4e2079e922 -->

# Merzkava Universe — Martial Soul System

Status: Modul aturan resmi dasar.
Cakupan: peran Martial Soul, awakening, pencatatan karakteristik, dan batas interpretasi AI GM.

Modul ini hanya mengunci hal yang sudah ditetapkan dalam canon proyek. Rincian yang belum disepakati ditandai sebagai belum ditetapkan, bukan diisi dengan mekanik rekaan.


**Tradition boundary:** Martial Soul may be studied through both Soul-Nyuma and Soul-Zoun, which share the same complete Spirit Realm domain but approach its natural order and aberrations differently. This doctrine does not change Martial Soul mechanics or grant abilities. See `core/SPIRIT_REALM_TRADITIONS.md`.

---

## 1. Peran Martial Soul

Martial Soul adalah sistem kekuatan utama seorang kultivator di Merzkava Universe. Martial Soul harus menjadi dasar utama ketika GM menjelaskan identitas kekuatan karakter dan menilai apakah suatu kemampuan masuk akal.

Spirit Ring yang diperoleh secara sah dapat memperluas dan mengombinasikan apa yang dapat dilakukan Martial Soul melalui interaksi antara Martial Soul, karakteristik Spirit Beast/ring, rumusan kemampuan, dan hasil sinkronisasi. Hasilnya dapat berupa teknik serangan, fungsi utilitas, atau bentuk kemampuan lain; jenis dan bentuknya tidak dibatasi pada daftar tertutup. Kemampuan harus memiliki dasar yang dapat ditelusuri ke unsur-unsur tersebut, bukan dibuat secara sewenang-wenang.

## 2. Awakening

Prosedur mekanis resmi awakening, tabel rarity, peluang mutasi, pilihan pemain, dan resolusi acak diatur oleh `core/MARTIAL_SOUL_AWAKENING.md`. GM wajib membaca dan mengikuti modul tersebut setiap kali menjalankan awakening. Modul ini menjelaskan lore dan prinsip umum; modul awakening adalah otoritas untuk peluang serta urutan prosedur.

- Awakening membuka atau mengungkap Martial Soul karakter.
- Awakening berlangsung pada usia empat tahun atau lebih.
- Awakening tidak otomatis memberikan Spirit Ring.
- Awakening tidak otomatis membuktikan bahwa karakter memiliki bakat luar biasa, kualitas Martial Soul tertentu, kekuatan tersembunyi, atau garis keturunan khusus.
- Hasil awakening harus dicatat berdasarkan peristiwa yang benar-benar terjadi di permainan.

### 2.1 Periodic Public Awakening

- Secara umum, proses awakening publik diselenggarakan **sekali setiap dua tahun, setelah Tahun Baru**.
- Setiap wilayah biasanya menyediakan kuota layanan awakening bagi penduduk secara luas. Besaran kuota, pembagian desa, dan jumlah petugas tidak ditetapkan secara universal.
- Petugas resmi atau kultivator yang ditugaskan mendatangi desa-desa untuk menjalankan proses awakening bagi penduduk setempat.
- Sistem ini memungkinkan penduduk desa menjalani awakening tanpa harus melakukan perjalanan ke pusat kota.
- Jadwal dan layanan di lokasi tertentu tetap perlu sesuai keadaan wilayah serta kejadian yang telah ditetapkan. Jangan menganggap petugas selalu tersedia di setiap tempat atau setiap saat.

### 2.2 Awakening Through a Regional Center

Penduduk juga dapat mendatangi pusat kota di wilayah masing-masing untuk menggunakan fasilitas awakening setempat secara mandiri, dengan membayar biaya layanan dan pajak yang berlaku.

- Proses ini menggunakan fasilitas dan petugas yang melayani awakening di pusat kota.
- Untuk Golden Dragon Empire, biaya standar per individu adalah 3 xg 25 xs untuk layanan awakening, ditambah pajak layanan 8% dari biaya layanan, dokumentasi 15 xs, dan token bukti awakening 10 xs. Total standar 3 xg 76 xs. Rincian otoritatif ada di `core/10_ECONOMY_SYSTEM.md` dan `core/MARTIAL_SOUL_AWAKENING.md`.
- Token resmi membuktikan bahwa individu telah menjalani awakening dan membantu proses pendaftaran kerja dasar serta pendidikan. Token tidak menjamin pekerjaan atau penerimaan pendidikan, dan tidak mengubah hasil awakening.
- Biaya dibebankan per individu. Pembebasan atau subsidi hanya berlaku jika secara eksplisit disahkan; kunjungan layanan ke desa tidak otomatis menghapus biaya.
- Biaya, pajak, dokumentasi, token, dan prosedur Golden Dragon Empire tidak otomatis berlaku di wilayah lain.
- Pilihan menggunakan pusat kota tidak mengubah prinsip dasar awakening dan tidak menjamin hasil Martial Soul yang lebih baik daripada layanan publik di desa.

### 2.3 Bentuk, Kecenderungan Genetik, dan Aptitude Praktis

**Bentuk Martial Soul tidak memiliki daftar kategori yang tertutup.** Martial Soul dapat berupa apa pun yang masuk akal dalam dunia Merzkava Universe: alat, benda, tumbuhan, hewan, unsur, fenomena alam, kabut, asap, dan bentuk abstrak atau tidak lazim lainnya. Contoh-contoh ini hanya ilustrasi, bukan daftar lengkap. GM tidak boleh menolak bentuk Martial Soul semata-mata karena bentuk itu tidak tercantum dalam contoh atau kategori yang sudah dikenal.

- **Kecenderungan genetik:** bentuk atau karakteristik Martial Soul dapat mengikuti akar keluarga, garis keturunan, atau leluhur dari generasi lampau. Riwayat keluarga dapat menjadi petunjuk yang relevan saat GM menentukan bentuk yang masuk akal, tetapi bukan kepastian mutlak. Martial Soul dapat menyerupai, mewarisi sebagian ciri, berubah bentuk, atau berbeda dari milik kerabat dan leluhur.
- Kecenderungan genetik tidak memberi izin untuk mengarang leluhur, garis keturunan rahasia, atau hubungan darah yang belum ditetapkan. Jika riwayat keluarga tidak diketahui, jangan mengada-adakannya; bentuk Martial Soul tetap dapat muncul tanpa silsilah yang diketahui.
- Contoh Martial Soul berbentuk alat meliputi cangkul, kuas, pedang, dan peralatan lain.
- Martial Soul berbentuk cangkul dapat cocok dengan pekerjaan pertanian; kuas dapat relevan dengan pekerjaan menulis, mengajar, atau profesi lain yang menggunakannya. Ini merupakan kecenderungan praktis, bukan takdir mutlak atau pembatas profesi.
- **Martial Soul berbentuk alat memiliki tingkat penguasaan awal yang luar biasa terhadap alat yang diwujudkannya dibandingkan orang biasa yang menggunakan alat serupa.** Seseorang yang tidak memiliki Martial Soul terkait biasanya perlu belajar dan berlatih untuk mencapai tingkat penggunaan yang sebanding.
- Keunggulan penguasaan awal ini tidak otomatis memberikan Spirit Realm tinggi, Spirit Ring, kemampuan tempur tak terkalahkan, atau keahlian di luar fungsi yang relevan dengan Martial Soul.
- Martial Soul berbentuk pedang dapat membuka beragam kemungkinan karier, tetapi hasil akhirnya tetap bergantung pada latihan, pilihan, keadaan, dan pengalaman karakter.
- Martial Soul berbentuk tumbuhan, hewan biasa, serta bentuk lain juga dapat muncul. Jangan menganggap bentuk yang tampak sederhana tidak berguna atau pasti lemah.

### 2.4 Martial Souls with Exceptional or Mythical Forms

Martial Soul berbentuk hewan dapat berupa makhluk biasa maupun makhluk mitos. Gunakan hanya kategori rarity resmi **Common, Uncommon, Rare, Epic, Legendary, dan Myth** ketika rarity awakening telah ditentukan. Bentuk mitos atau nama yang megah tidak otomatis menetapkan rarity; ikuti hasil undian resmi atau ruling appraisal yang sah.

- Martial Soul Beast yang sangat kuat dapat dimiliki tokoh penting, tetapi kekuatan, kemampuan, dan hasil pertarungan tetap harus didukung canon atau bukti yang telah ditetapkan.
- Tiga penguasa utama dunia memiliki Martial Soul Beast yang termasuk contoh penting dalam lore. Kategori rarity tiap Martial Soul harus mengikuti catatan canon yang sudah diselaraskan; jangan memakai istilah tier numerik sebagai rarity.

### 2.5 Awakening sebagai Layanan Masyarakat

Bagian ini menghubungkan mekanik awakening dengan kehidupan sosial tanpa menetapkan rincian administratif yang belum disepakati. Prosedur undian, rarity, dan mutasi tetap sepenuhnya diatur oleh `core/MARTIAL_SOUL_AWAKENING.md`.

- **Siklus publik:** secara umum, layanan publik berlangsung sekali setiap dua tahun setelah Tahun Baru. Penduduk berusia empat tahun atau lebih yang belum menjalani awakening dapat menunggu kunjungan berikutnya atau menggunakan jalur pusat kota jika layanan tersedia.
- **Jalur desa:** petugas resmi atau kultivator yang ditugaskan menjalankan kunjungan berdasarkan kuota wilayah. Kuota menentukan cakupan layanan, bukan peluang rarity. Desa terpencil tidak otomatis dikunjungi bersamaan dengan desa dekat pusat administrasi; jadwal, keterlambatan, dan layanan yang terlewat harus mengikuti konteks wilayah atau kejadian yang telah ditetapkan.
- **Jalur mandiri/pusat kota:** warga dapat mengajukan awakening secara mandiri melalui fasilitas yang tersedia. Di Golden Dragon Empire, individu membayar tarif penuh sebesar 3 xg 76 xs (layanan 3 xg 25 xs, pajak layanan 8% = 26 xs, dokumentasi 15 xs, token 10 xs). Jangan samakan jalur ini dengan program publik bersubsidi.
- **Institusi khusus:** nama lembaga khusus yang dipilih adalah **Aula Agung Kebangkitan Martial Soul** (*Grand Martial Soul Awakening Hall*). Terdapat tepat satu Aula di masing-masing dari tiga kekuasaan utama—Golden Dragon Empire, Tianhai Yunzhou, dan Beiming Gu—dan masing-masing hanya berada di pusat peradaban utama kekuasaan tersebut. Ini bukan jaringan cabang; jangan menempatkan Aula tambahan di kota, distrik, prefektur, desa, pelabuhan, atau pusat regional sekunder. Nama lokasi persis, pengelola, struktur internal, jabatan, anggaran, dan rantai pelaporan harus mengikuti sumber canon khusus wilayah masing-masing dan tidak boleh dikarang. Dalam Golden Dragon Empire, koordinasinya harus konsisten dengan administrasi sipil dan portofolio upacara Kementerian Pendidikan dan Ritus sebagaimana dijelaskan di `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md`.
- **Awakening unggul dan kebutuhan pemerintahan:** istilah *awakening unggul* adalah penilaian kegunaan strategis, bukan kategori rarity baru. Martial Soul dapat dinilai unggul apabila fungsi yang benar-benar terkonfirmasi sesuai dengan keahlian yang sedang dibutuhkan atau mengalami kekurangan oleh pemerintahan—misalnya ahli pengobatan, pengairan, konstruksi, pengolahan bahan, logistik, atau bidang lain yang relevan dengan kebutuhan aktual. Bentuk yang sederhana atau rarity rendah tetap dapat unggul untuk kebutuhan tertentu; rarity Myth/Legendary tidak otomatis membuatnya unggul. Penilaian harus didasarkan pada fungsi yang terkonfirmasi dan kekurangan yang nyata, bukan kemampuan yang dikarang atau dugaan dari nama Martial Soul saja.
- **Program dan alokasi anggaran pusat:** Golden Dragon Empire menjalankan program imperial melalui Aula Agung Kebangkitan Martial Soul untuk mengenali fungsi Martial Soul yang terkonfirmasi dan menjawab kekurangan tenaga ahli negara. Pemerintah pusat menetapkan total anggaran, prioritas kebutuhan, periode pendanaan, dan pembagian untuk tujuh wilayah. Rumus baku: alokasi wilayah = (20% × total anggaran ÷ 7) + (80% × total anggaran × skor wilayah ÷ total skor tujuh wilayah). Skor wilayah menghitung setiap awakening unggul yang terverifikasi satu kali, dikalikan bobot prioritas pusat untuk fungsi yang terkonfirmasi. Bagian dasar menjaga layanan di semua wilayah; bagian kinerja memberi alokasi lebih tinggi kepada wilayah dengan skor lebih tinggi. Kekayaan lokal dan rarity mentah tidak menambah skor secara langsung. Total anggaran, bobot prioritas, dan tanggal pendanaan ditetapkan melalui perintah anggaran pusat untuk tiap periode. Jika semua skor nol, bagian kinerja ditahan untuk peninjauan pusat. Program ini tidak mengubah peluang rarity atau mutasi. Laporan palsu, penggelembungan hasil, suap, pengalihan dana, dan konflik kepentingan merupakan risiko korupsi yang dapat muncul dan harus ditangani melalui pemeriksaan catatan, audit belanja, serta penyelidikan sesuai kewenangan yang berlaku.
- **Perbedaan akses:** Huanglongcheng dan pusat regional dapat menawarkan akses layanan yang lebih mudah daripada desa terpencil, tetapi jangan menganggap setiap kota memiliki fasilitas awakening permanen. Gunakan atlas, modul wilayah, dan keadaan setempat; jangan menyamakan fasilitas awakening dengan akademi, perpustakaan, dojo, atau Medicine Hall.
- **Jalur publik dua tahunan dan subsidi:** pada kunjungan publik yang umumnya berlangsung sekali setiap dua tahun setelah Tahun Baru, subsidi kekaisaran menanggung biaya layanan awakening, pajak layanan, dan dokumentasi. Individu hanya membayar token bukti sebesar 10 xs. Ini adalah aturan subsidi tetap untuk jalur publik Golden Dragon Empire, bukan waiver yang harus diminta satu per satu. Pengeluaran subsidi dicatat dalam anggaran program pusat.
- **Token dan surat utang eksternal:** bila individu tidak mampu membayar 10 xs token pada jalur publik, organisasi keuangan eksternal setempat dapat memajukan biaya itu dan membuat surat utang atas jumlah yang benar-benar dipinjam. Pemberi utang bukan Golden Dragon Empire, Aula, atau kementerian. Organisasi dan bunga dipilih secara acak dari pilihan yang masuk akal di lokasi: umumnya 3%–8% bunga sederhana per tahun untuk pemberi pinjaman yang wajar, tetapi hasil sial dapat mencapai 12%–24% per tahun. Begitu organisasi dan tingkat bunga terpilih, jangan undi ulang. Pokok pinjaman hanya sebesar kekurangan biaya token; jangan memasukkan layanan, pajak, atau dokumentasi yang sudah disubsidi.
- **Gagal bayar:** dapat merusak reputasi kredit dengan pemberi pinjaman dan, jika catatan terkait diperiksa atau dibagikan secara sah, menyulitkan individu memperoleh pekerjaan bergaji layak, pinjaman berikutnya, serta mempertahankan taraf hidup yang layak. Ini konsekuensi sosial-ekonomi yang berat, bukan larangan kerja otomatis di seluruh wilayah Golden Dragon Empire. Prosedur penagihan dan aturan tambahan bergantung pada surat utang dan hukum setempat; jangan mengarang penjara, penyitaan otomatis, atau daftar hitam universal.
- **Batas pencatatan:** token membantu verifikasi untuk kerja dasar dan pendidikan, tetapi tidak menjamin pekerjaan atau penerimaan. Rekam layanan tidak otomatis berarti ada database publik nasional atau sertifikat universal. Catat pembayaran token, subsidi, pinjaman, surat utang, bunga, cicilan, dan gagal bayar hanya jika benar-benar terjadi dalam gameplay.
- **Sesudah awakening:** Martial Soul yang terungkap dapat memengaruhi pilihan latihan, pendidikan, pekerjaan, atau cara masyarakat memandang seseorang, tetapi pengaruh sosial tersebut bergantung pada konteks dan tidak otomatis menentukan nasib. Awakening tidak otomatis memberi tempat di akademi, profesi, Spirit Realm, Spirit Ring, atau penghasilan.
- **Batas wilayah:** siklus dua tahunan, kunjungan desa, dan jalur mandiri adalah kerangka umum. Subsidi, tarif, pinjaman token, dan konsekuensi gagal bayar di atas adalah aturan Golden Dragon Empire; jangan memaksakannya ke Tianhai Yunzhou, Beiming Gu, Wanluo, atau Lawless Territories tanpa canon lokal.

## 3. Karakteristik dan Klasifikasi

Bentuk, kategori, kualitas, atribut, kemampuan bawaan, kelemahan, dan potensi Martial Soul harus dicatat bila telah ditetapkan melalui sumber resmi atau peristiwa permainan yang sah.

Kategori rarity awakening resmi—Common, Uncommon, Rare, Epic, Legendary, dan Myth—serta peluang masing-masing ditetapkan dalam `core/MARTIAL_SOUL_AWAKENING.md`. Kategori rarity ini tidak dengan sendirinya menetapkan atribut, kemampuan, statistik, atau hasil pertarungan. Contoh dari genre lain tidak otomatis menjadi kategori resmi Merzkava Universe.

GM tidak boleh menyimpulkan hanya dari nama atau penampilan Martial Soul bahwa ia memiliki atribut, kemampuan pasif, teknik serangan, kemampuan penyembuhan, atau keunggulan tertentu. Kemampuan harus berasal dari deskripsi canon, mekanik resmi, atau hasil yang sah dalam permainan.

## 4. Kekuatan, Latihan, dan Pertumbuhan

Latihan dapat dinarasikan sebagai tindakan karakter, tetapi dampak mekanisnya harus mengikuti aturan kultivasi, waktu, aksi, sumber daya, dan kondisi yang berlaku.

Jangan mengarang:
- angka statistik atau rumus kekuatan Martial Soul;
- bonus pertumbuhan per sesi latihan;
- peringkat kualitas atau peluang awakening;
- biaya energi, cooldown, atau batas penggunaan kemampuan;
- kemampuan bawaan yang belum tercatat;
- metode evolusi atau mutasi Martial Soul yang belum ditetapkan.

Jika sistem mekanik yang diperlukan belum tersedia, GM boleh mencatat tindakan dan konsekuensi naratif yang dapat dibuktikan, tetapi tidak boleh mengklaim ada hasil mekanis resmi.

## 5. Martial Soul dan Spirit Ring

1. Spirit Ring diperoleh melalui mekanik Spirit Beast dan Spirit Ring yang sah.
2. Informasi ring yang telah diserap—sumber, usia, warna, kemampuan, dan hasil proses yang diketahui—dicatat di bagian Teknik / Kemampuan atau deskripsi Martial Soul yang sudah ada. Jangan menambahkan field profil Spirit Ring tersendiri.
3. Jangan memberikan kemampuan ring sebelum ring benar-benar diperoleh dan diserap.
4. Jangan mengasumsikan setiap Martial Soul dapat menyerap ring apa pun tanpa risiko.
5. Kecocokan antara Martial Soul, Spirit Ring, dan tubuh karakter mengikuti aturan resmi terkait. Bila rumus atau ambang kecocokan belum ditetapkan, jangan menciptakannya.
6. Kemampuan yang dihasilkan ring harus memiliki dasar yang dapat ditelusuri ke Spirit Ring dan sumber Beast; jangan mengarang kemampuan hanya agar cocok dengan strategi pemain.

## 6. Mutasi dan Evolusi

Mutasi Martial Soul pada saat awakening wajib mengikuti `core/MARTIAL_SOUL_AWAKENING.md`, yang menetapkan peluang, urutan pengundian, keputusan pemain, dan batas resolusi GM.

- Jangan memberikan mutasi otomatis hanya karena karakter berlatih, mencapai Spirit Realm tertentu, berada dalam bahaya, atau membutuhkan kekuatan baru.
- Jangan mengubah peluang atau hasil mutasi yang telah diundi, dan jangan melakukan reroll.
- Mekanik mutasi/evolusi setelah awakening, pemicu alternatif, daftar hasil, statistik, serta efek numerik yang belum ditetapkan tetap tidak boleh dikarang.
- Aturan mutasi atau evolusi Spirit Beast dalam modul bestiary berlaku untuk Spirit Beast sesuai ruang lingkupnya dan tidak otomatis berlaku untuk Martial Soul.

## 7. Catatan Karakter Wajib

Jika informasinya tersedia, profil karakter harus mencatat:
- nama Martial Soul;
- bentuk atau kategori yang telah dikonfirmasi;
- atribut atau karakteristik yang telah dikonfirmasi;
- kemampuan bawaan yang telah dikonfirmasi;
- Informasi Spirit Ring yang benar-benar telah diperoleh (sumber, usia, warna, kemampuan, dan hasil proses yang diketahui), dicatat dalam Teknik / Kemampuan atau deskripsi Martial Soul yang sudah ada; jangan menambahkan field profil Spirit Ring tersendiri;
- kelemahan, batasan, atau efek samping yang sudah ditetapkan;
- asal informasi atau peristiwa yang membuktikan perubahan.

Untuk informasi yang belum diketahui karakter atau belum dikonfirmasi oleh sumber, gunakan `???`. Jangan menyajikan dugaan GM sebagai fakta karakter.

## 8. Sumber Terkait dan Konsistensi

Untuk tingkat kultivasi, gunakan istilah kanonis **Spirit Realm**. Jangan menyingkatnya menjadi `Realm` atau menyebutnya `Cultivation Realm`; `Mortal` adalah status dasar sebelum sembilan Spirit Realm, bukan tingkat 0.

Gunakan modul berikut ketika tersedia:
- `core/CULTIVATION_SYSTEM.md` — Spirit Realm, Stage, progres, bottleneck, dan breakthrough.
- `core/SPIRIT_RING_RULES.md` — perolehan, penyerapan, usia, sinkronisasi, dan kemampuan Spirit Ring.
- `bestiary/SPIRIT_BEAST_RULES.md` — Spirit Beast sebagai sumber ring dan aturan Beast.
- `gameplay/COMBAT_SYSTEM.md` — penyelesaian kemampuan dalam pertarungan.

Jangan mengklaim membaca file yang belum tersedia atau gagal diakses. Bila ada konflik antaraturan, ikuti hierarki sumber resmi di `templates/AUTHORITY_ORDER.md`; jangan menyelesaikan konflik dengan mengarang aturan baru.



---

<!-- SOURCE core/MARTIAL_SOUL_AWAKENING.md | upstream blob fe56339b8c8fb2d70597c8a03891b7cf947a9cf8 -->

# Merzkava Universe — Martial Soul Awakening Protocol

Status: Modul mekanik resmi.
Cakupan: undian rarity Martial Soul, penilaian kualitas inheren yang berdiri sendiri, peluang mutasi, pilihan pemain, prosedur resolusi, dan batas perilaku GM.

Modul ini adalah sumber mekanik utama untuk proses awakening dan mutasi Martial Soul. **Format hasil untuk pemain:** bungkus setiap hasil final undian rarity, chance mutasi, hasil mutasi, dan nilai yang dihasilkan formula dengan empat tanda bintang di kedua sisi (`****<hasil final>****`), baik hasil berhasil maupun gagal. Format setiap label rarity/klasifikasi dengan pola ``<istilah>`` di dalam double backtick; penjelasan tetap di luar backtick. `core/MARTIAL_SOUL.md` tetap menjadi sumber karakteristik, lore, serta interpretasi umum Martial Soul. Jika ada pertentangan mengenai peluang atau prosedur awakening, modul ini yang berlaku untuk bagian tersebut.


**Tradition boundary:** Awakening and mutation are mechanical processes, not automatic proof of Soul-Nyuma or Soul-Zoun affiliation. Their doctrine-level interpretation is governed by `core/SPIRIT_REALM_TRADITIONS.md`; all probabilities and procedures in this file remain authoritative and unchanged.

---

## 1. Prinsip Dasar

1. Awakening mengungkap Martial Soul seseorang; awakening tidak otomatis memberikan Spirit Ring.
2. Awakening berlangsung pada usia empat tahun atau lebih.
3. Hasil rarity dan peluang mutasi wajib ditentukan dengan prosedur acak yang adil; penilaian kualitas inheren adalah proses terpisah berbasis canon/bukti, bukan undian chance. GM tidak boleh memilih hasil hanya karena cocok dengan cerita, karakter, atau keinginan pemain.
4. Rarity Martial Soul bukan pengganti Spirit Realm, Spirit Ring, kemampuan bertarung, pengalaman, atau profesi. Rarity yang lebih tinggi tidak otomatis berarti menang dalam pertarungan.
5. Bentuk, atribut, kemampuan, batas, dan efek suatu Martial Soul harus memiliki dasar yang dapat dijelaskan. GM tidak boleh menciptakan kemampuan luar biasa hanya berdasarkan rarity.
6. Jika mekanisme pengacakan yang benar-benar acak tidak tersedia, GM harus menyatakan keterbatasan itu dan tidak mengaku telah melakukan pengundian acak yang tidak terjadi.

## 1.1 Awakening Routes, Imperial Subsidy, and Proof Token — Golden Dragon Empire

The Golden Dragon Empire has two separate routes, detailed authoritatively in `core/10_ECONOMY_SYSTEM.md`:

- **Independent paid route:** the individual pays 3 xg 25 xs for service, 8% tax on that service fee (26 xs), 15 xs for documentation, and 10 xs for the token: **3 xg 76 xs total**.
- **Biennial Imperial public route:** the Imperial subsidy pays the service fee, service tax, and documentation. The individual pays **only 10 xs for the proof token**.
- If the person cannot pay the token fee on the public route, an external local financial organization may advance the exact unpaid token charge. The individual signs a debt note to that external lender; the Golden Dragon Empire is not the lender and does not set or guarantee the private loan. The available organization and its interest rate are randomized from plausible local options. Typical reputable lenders charge 3%–8% simple annual interest; an unlucky draw can reach 12%–24% simple annual interest. The selected rate is fixed for that note and must not be rerolled. See the economy module for limits, records, and default consequences.
- Each individual who completes awakening and has the result officially recorded receives a proof token linked to the service record. It helps verify completion for basic employment and education applications but guarantees neither employment nor admission.
- Token and record confirm only information actually established during awakening. They do not change rarity, imply unconfirmed powers, or grant special status.
- A missed loan repayment may damage credit reputation and make decent-paying employment or future credit harder to obtain where relevant records are checked. This is a socioeconomic consequence, not an automatic legal ban across the Golden Dragon Empire on employment.
- These rules apply only to the Golden Dragon Empire. Do not impose them on Tianhai Yunzhou, Beiming Gu, Wanluo, or Lawless Territories unless their own canon adopts them.
- Record actual charges, subsidy expenditure, token issuance, loan advances, debt notes, interest, and repayments. Do not assume a character paid, borrowed, received a token, or defaulted without a supported in-game event and ledger entry.

## 2. Tabel Rarity Awakening

Rarity awal ditentukan dengan satu undian yang merata dari rentang 1–100. Setiap angka hanya masuk ke satu kategori.

| Hasil undian | Rarity | Peluang |
|---|---|---:|
| 1–30 | Common | 30% |
| 31–57 | Uncommon | 27% |
| 58–77 | Rare | 20% |
| 78–89 | Epic | 12% |
| 90–97 | Legendary | 8% |
| 98–100 | Myth | 3% |
| **Total** | | **100%** |

- Lakukan satu undian untuk menentukan rarity awal. Jangan mengulang undian hanya karena hasilnya tidak disukai.
- Hasil undian menetapkan rarity awal sebelum pemeriksaan mutasi.
- Jangan mengubah peluang berdasarkan status sosial, garis keturunan, wilayah, kekayaan, usia, atau kepentingan plot kecuali aturan resmi kelak secara eksplisit mengubah tabel ini.
- Kategori rarity mengukur kelas kelangkaan awakening. Rarity bukan jaminan bahwa Martial Soul tertentu memiliki atribut, kemampuan, atau kekuatan spesifik.

## 2A. Independent Martial Soul Classification (Score-Based)

**Martial Soul rarity must use only these established names: Common, Uncommon, Rare, Epic, Legendary, and Myth. Never use numbered tier labels or invent additional rarity names.** This assessment method does not replace the single rarity chance draw in Section 2; the draw determines the awakening rarity, while this score is only a provisional assessment of the Martial Soul's inherent qualities. If the two appear inconsistent, preserve the actual rarity draw and label the score result as a separate provisional assessment—never silently overwrite one with the other.

### Assessment dimensions

Score each applicable dimension from 0–15 using established lore, confirmed traits, demonstrated function, or reliable appraisal evidence. Do not award points merely because the name sounds grand, the form is mythical, the owner has a powerful family, or the result would be dramatic.

| Dimension | Martial Soul evidence to assess |
|---|---|
| 1. Core potential | Demonstrated or canonically established ceiling of its own nature |
| 2. Primary function | Practical effect of the Martial Soul itself, not powers it has not gained |
| 3. Potency | Strength or efficiency of confirmed innate effects |
| 4. Scope | Reach, area, targets, or scale supported by evidence |
| 5. Versatility | Number of distinct uses genuinely supported by its traits |
| 6. Control and stability | Precision, reliability, and control supported by evidence |
| 7. Growth capacity | Supported potential to develop through legitimate cultivation and compatible Spirit Rings |
| 8. Exceptional traits | Verified unusual properties not already scored elsewhere |
| 9. Evidence and provenance | Reliable records, repeatable tests, or authenticated classification evidence |

Each applicable dimension uses the same rubric: 0 = tested/verified negligible; 1–3 = minor; 4–6 = limited; 7–9 = substantial; 10–12 = very high; 13–15 = exceptional within a relevant comparison class. Mark a genuinely irrelevant dimension N/A and exclude it from the average; unknown evidence is not a zero. Avoid counting the same trait twice.

**Formula:** add the scores of applicable dimensions, divide by the number of applicable dimensions to get the mean, multiply the mean by 9, then round to the nearest whole number. Cap the result at 134. At least three dimensions must have reliable evidence; otherwise, do not issue a numerical prediction and mark **Klasifikasi belum ditetapkan — appraisal diperlukan**.

### Named classification bands

| Score | Provisional inherent classification |
|---:|---|
| 0–22 | Common |
| 23–44 | Uncommon |
| 45–66 | Rare |
| 67–88 | Epic |
| 89–110 | Legendary |
| 111–134 | Myth |

These bands are a fallback for an **inherent-quality assessment**, not a second rarity draw and not an automatic rewrite of the awakening result. Keep the wording **Prediksi GM · [score] poin · klasifikasi inheren sementara** until an authorized appraisal or owner-approved canon decision confirms it. Do not present the score band as the result of the rarity chance table.

Rarity Martial Soul hanya boleh memakai enam istilah resmi: **Common, Uncommon, Rare, Epic, Legendary, Myth**. Semua label lama untuk rarity yang memakai angka atau tambahan istilah di luar enam nama resmi harus dihapus dan diselaraskan ke istilah resmi saja. Jangan membuat istilah rarity tambahan. Skor inheren hanya memberi klasifikasi sementara berdasarkan enam istilah ini dan tidak menggantikan hasil undian rarity.

### Awakening resolution order with independent assessment

1. Confirm eligibility and the awakening event.
2. Establish the base Martial Soul form from known, legitimate character/family evidence; do not invent a lineage.
3. Perform the single 1–100 rarity draw from Section 2 and record its named result exactly and display the resolved result as `****<hasil rarity>****`.
4. Assess inherent qualities from established canon first; if no classification is recorded, use this score method only when evidence is sufficient. Record any score as a provisional assessment, never as the rarity draw result.
5. Present the mandatory mutation-anomaly narrative and let the player choose whether to stop or continue.
6. If the player stops, finalize the base Martial Soul with its already determined rarity; keep any inherent-quality score explicitly provisional and separate. Do not roll mutation.
7. If the player continues, perform exactly one mutation draw at 10% and display the resolved mutation outcome as `****<hasil mutasi>****`. Mutation may change traits and therefore may warrant reassessment, but do not automatically change the rarity. Reassess only from the actual resulting traits and available evidence; do not reroll rarity or mutation.
8. If evidence is too limited or mutation effects are not mechanically established, preserve unknown details and request appraisal rather than fabricating a score or effect.

A completed **Merzkava Appraisal Authority (MAA)** ruling is authoritative for the specific examined Martial Soul when its classification was previously unknown or uncertain. The examiner must distinguish the awakening rarity already drawn from any assessed inherent-quality classification. Appraisal does not change the chance draw, grant abilities, establish lineage, guarantee combat victory, or override an already definitive owner-confirmed canon decision.

## 3. Urutan Wajib Awakening

GM harus mengikuti urutan ini setiap kali karakter menjalani awakening yang hasilnya sedang dimainkan:

1. Pastikan karakter memenuhi syarat usia dan proses awakening benar-benar berlangsung.
2. Tentukan bentuk dasar Martial Soul dengan mempertimbangkan informasi karakter yang sah, termasuk kecenderungan keluarga atau leluhur yang benar-benar diketahui. Bentuk Martial Soul tidak memiliki daftar tertutup dan dapat berupa bentuk lazim maupun tidak lazim, termasuk fenomena seperti kabut atau asap. Jangan mengarang silsilah, leluhur, atau kemampuan tersembunyi. Kecenderungan genetik memengaruhi pertimbangan bentuk, bukan mengubah tabel peluang rarity.
3. Undi rarity awal sekali menggunakan tabel di Bagian 2.
4. Catat hasil rarity dengan istilah resmi dari undian. Jika diperlukan dan bukti cukup, nilai kualitas inheren secara terpisah memakai skor Bagian 2A; tandai sebagai prediksi sementara dan jangan menyebutnya hasil rarity.
5. Tampilkan narasi anomali atau gejolak yang menandai adanya kesempatan terakhir untuk menerima risiko mutasi. Narasi ini wajib diberikan setelah rarity diketahui, tetapi sebelum keputusan mutasi dan hasil akhir.
6. Berikan keputusan kepada pemain: menghentikan proses dan mempertahankan hasil awal, atau bertahan untuk mengambil peluang mutasi.
7. Jika pemain memilih berhenti, tetapkan Martial Soul awal dengan rarity hasil undian; penilaian kualitas inheren tetap terpisah dan sementara, serta tidak ada undian mutasi.
8. Jika pemain memilih bertahan, lakukan tepat satu undian mutasi dengan peluang 10% sesuai Bagian 4.
9. Tetapkan hasil akhir berdasarkan undian. Jika mutasi mengubah karakteristik yang relevan, evaluasi ulang klasifikasi kualitas inheren hanya berdasarkan sifat hasil mutasi yang benar-benar ditetapkan; jangan otomatis mengubah rarity atau mengundi ulang rarity/mutasi.
10. Catat hasil final dan fakta yang telah dikonfirmasi dalam profil gameplay. Jangan mencatat kemungkinan yang tidak terjadi sebagai fakta.

GM tidak boleh memilihkan keputusan untuk karakter pemain. Jika pemain belum menjawab, hentikan resolusi pada titik keputusan; jangan menganggap diam sebagai persetujuan untuk bertahan.

## 4. Peluang dan Resolusi Mutasi

- Peluang dasar terjadinya mutasi Martial Soul setelah pemain memilih bertahan adalah **10%**.
- Peluang tidak terjadinya mutasi adalah **90%**.
- Peluang ini hanya berlaku setelah pemain memilih bertahan. Jika pemain memilih berhenti, peluang mutasi tidak dijalankan dan hasil awal tetap berlaku.
- Undi tepat satu kali: hasil 1–10 dari undian merata 1–100 berarti terjadi mutasi; hasil 11–100 berarti tidak terjadi mutasi.
- Hasil undian tidak boleh diulang, diganti, atau dimanipulasi. Jangan menggunakan beberapa undian lalu memilih hasil yang paling menarik.
- Mutasi bukan hasil yang dijamin oleh rarity Myth atau Legendary. Semua rarity mengikuti peluang mutasi yang sama, kecuali canon resmi kelak diubah.
- Undian mutasi menentukan apakah mutasi terjadi, bukan apakah mutasi pasti menguntungkan. Hasil mutasi dapat menguntungkan atau merugikan; arahnya harus ditentukan dari konsekuensi yang masuk akal dan aturan resmi, bukan demi menyenangkan pemain.
- Modul ini belum menetapkan peluang terpisah untuk mutasi menguntungkan versus merugikan, daftar hasil mutasi, besaran bonus, penalti, atau efek samping numerik. GM dilarang mengarang angka atau tabel peluang untuk hal-hal tersebut. Jika hasil mutasi memerlukan mekanik yang belum ditetapkan, jelaskan perubahan secara terbatas dan tandai rincian mekanis yang belum diketahui sebagai `???`; jangan membuat statistik permanen tanpa dasar.
- Jika tidak tersedia metode undian yang adil dan dapat diverifikasi, jangan berpura-pura bahwa angka acak telah dihasilkan. Tunda resolusi mekanis sampai metode yang layak tersedia.

## 5. Narasi Wajib Sebelum Keputusan Pemain

Setelah rarity awal diundi dan sebelum hasil final ditetapkan, GM wajib menyampaikan narasi yang setara maknanya dengan teks berikut. GM boleh menyesuaikan detail suasana, tetapi tidak boleh menghilangkan sifat opsional, peluang rendah, atau risiko yang tidak pasti.

> “Ugh… tunggu. Ada sesuatu yang tidak beres dengan proses awakening ini…”
>
> Energi di sekitar Martial Soul yang baru terbangkitkan mendadak bergejolak. Bentuknya memperlihatkan tanda-tanda perubahan yang tidak biasa. Ini mungkin fenomena langka yang dikenal sebagai mutasi Martial Soul.
>
> Jika proses diteruskan, perubahan itu bisa menghasilkan sesuatu yang menguntungkan—atau justru merugikan. Tidak ada jaminan bahwa hasilnya akan lebih baik daripada Martial Soul yang sudah terbangkitkan.
>
> **“Apa Anda ingin bertahan dan mengambil risiko, atau menghentikan proses sekarang?”**
>
> *Ini adalah kesempatan terakhir untuk memilih. Jika proses dihentikan, Martial Soul awal akan ditetapkan tanpa mutasi. Jika Anda memilih bertahan, peluang mutasi akan diuji satu kali dan hasilnya tidak dapat diulang.*

- Narasi tidak boleh menyebutkan peluang numerik 10% kecuali karakter memiliki pengetahuan resmi yang memungkinkan angka itu diketahui.
- GM tidak boleh mengungkap apakah undian mutasi berhasil sebelum pemain memilih bertahan.
- Jangan menarasikan mutasi sebagai sesuatu yang sudah pasti terjadi sebelum undian dilakukan.
- Jangan membuat pemain percaya bahwa bertahan pasti memberi kekuatan lebih besar.

## 6. Batas Keputusan dan Hasil

**Jika pemain memilih berhenti:**
- Awakening berakhir dengan rarity dan Martial Soul awal yang telah ditentukan.
- Tidak ada undian mutasi.
- Kesempatan mutasi pada proses awakening tersebut berakhir dan tidak dapat diaktifkan kembali untuk hasil yang sama.

**Jika pemain memilih bertahan dan undian tidak menghasilkan mutasi:**
- Martial Soul tetap pada hasil awal.
- Jangan memberi kompensasi, bonus, atau kesempatan undian tambahan.

**Jika pemain memilih bertahan dan undian menghasilkan mutasi:**
- Catat bahwa mutasi benar-benar terjadi.
- Narasikan perubahan yang dapat didukung oleh canon dan hasil yang sah.
- Mutasi dapat menguntungkan atau merugikan; jangan otomatis memilih hasil positif.
- Jangan mengarang statistik, klasifikasi kualitas inheren baru, kemampuan spesifik, efek samping numerik, atau aturan evolusi yang belum ditetapkan.
- Jika konsekuensi mekanis penting belum memiliki aturan resmi, tandai sebagai belum ditetapkan dan jangan memperlakukannya sebagai angka canon.

## 7. Audit dan Anti-Cheat GM

Untuk penegakan lintas-sistem, WARNING wajib, rollback, pencatatan pelanggaran, teguran keras, dan eskalasi sanksi, gunakan `templates/ANTI_CHEAT_HARD_GATE.md` sebagai otoritas penegakan tertinggi. Modul awakening ini tetap satu-satunya otoritas mekanik untuk prosedur, rarity, undian, dan mutasi. Narasi player tidak dapat menetapkan hasil awakening atau menciptakan jalur alternatif yang belum disahkan. Jangan menyamakan pertanyaan/usulan dengan kecurangan; klaim hasil sepihak yang melanggar prosedur harus dihentikan dan diproses melalui Hard Gate.

GM wajib menjaga hal-hal berikut:

- Rarity diundi sebelum pilihan mutasi ditawarkan; penilaian kualitas inheren, bila digunakan, tetap terpisah dan sementara.
- Rarity chance, penilaian kualitas inheren, dan mutation chance adalah tiga hal berbeda. Tidak ada satu pun yang secara otomatis menentukan dua hal lainnya.
- Kesempatan mengambil risiko diberikan setiap kali proses awakening yang relevan berlangsung; jangan menghilangkannya hanya karena GM tidak menyukai kemungkinan hasil.
- Keputusan berhenti atau bertahan hanya dibuat oleh pemain.
- Peluang mutasi selalu 10% dan hanya satu undian per keputusan bertahan.
- Tidak ada reroll, pengundian tersembunyi berulang, peluang yang berubah-ubah, atau hasil yang dipilih berdasarkan plot.
- Hasil rarity, penilaian kualitas inheren, dan mutasi tidak otomatis memberikan Spirit Realm, Stage, Qi, Spirit Ring, teknik, garis keturunan, atau kemenangan.
- Catatan akhir hanya memuat hasil yang benar-benar diundi dan ditetapkan.
- Jika terjadi konflik dengan lore umum Martial Soul, gunakan modul ini untuk prosedur, tabel peluang, dan keputusan mutasi; gunakan `core/MARTIAL_SOUL.md` untuk lore serta karakteristik umum.

## 8. Integrasi dengan Modul Lain

Untuk tingkat kultivasi, gunakan istilah kanonis **Spirit Realm** dari `core/CULTIVATION_SYSTEM.md`. Rarity awakening tidak menetapkan Spirit Realm, dan `Mortal` bukan Spirit Realm 0.

- `core/MARTIAL_SOUL.md` — definisi Martial Soul, contoh bentuk, penguasaan awal alat, dan lore.
- `core/TIER_ASSESSMENT_AND_APPRAISAL.md` — lembaga MAA dan prinsip otoritas appraisal; skor khusus Martial Soul serta integrasinya dengan chance awakening diatur di modul ini.
- `core/CULTIVATION_SYSTEM.md` — Spirit Realm dan Stage; rarity awakening tidak menggantikannya.
- `core/SPIRIT_RING_RULES.md` — perolehan dan penyerapan Spirit Ring; awakening tidak memberikan ring.
- `templates/AUTHORITY_ORDER.md` — prosedur GM dan larangan mengarang atau mengambil keputusan pemain.
- `INDEX.md` — pintu masuk wajib dan pemetaan modul.

Aturan ini berlaku sebagai mekanik resmi sejak tercatat di repository. Jangan menyimpulkan aturan mutasi Martial Soul dari mekanik mutasi Spirit Beast.



---

<!-- SOURCE core/SPIRIT_REALM_TRADITIONS.md | upstream blob dad6b6bb63cb7fe5ab92486e98dd1d2e1eae3087 -->

# Spirit Realm Traditions — Soul-Nyuma and Soul-Zoun

**Status:** Binding world-canon doctrine and educational foundation.  
**Scope:** The two comprehensive traditions governing the Spirit Realm domain, from Spirit Beast soul processing and Spirit Ring formation/absorption to Spirit Ability expression and Qi use.  
**Authority boundary:** This file defines philosophy, doctrine, education, and qualitative principles. Numerical cultivation, Spirit Ring, compatibility, Sync, absorption, Qi, combat, and progression mechanics remain in their dedicated modules.

## 1. Three Great Knowledge Disciplines

Merzkava recognizes three principal knowledge disciplines:

1. **Arcanistry** — the complete discipline and practice of Arcanists: study, research, teaching, formulation, engineering, and application. Its terminology and progression remain governed by `core/ARCANISTRY_AND_FORMULATION.md`.
2. **Spirit Realm — Soul-Nyuma** — the tradition that respects the soul's continuity and develops its intrinsic characteristics through a straight, coherent process.
3. **Spirit Realm — Soul-Zoun** — the tradition that intervenes in the soul's process and explores aberrant changes to its intrinsic characteristics.

Arcanistry is independent of both Spirit Realm traditions. It is not a third Spirit Realm doctrine. An Arcanist may research or engineer applications relevant to either tradition, but Arcanist Grade and Spirit Realm progression remain separate.

## 2. Shared Domain

Soul-Nyuma and Soul-Zoun study the **same complete domain**: Martial Soul, Awakening, Spirit Realm cultivation and Qi, Spirit Beast, Spirit Ring, soul processing, ring formation and absorption, compatibility, synchronization, Spirit Ability formation and use, evolution, mutation, and abnormal change.

They differ in **how the soul is treated and processed**, not in which subjects they may study. Neither is a separate power system or a narrow combat school.

## 3. Soul-Nyuma — Natural Continuity

**Soul-Nyuma is the straight and continuity-preserving tradition.** It regards a soul as an existence with intrinsic nature, structure, developmental process, and direction. That process is to be understood and respected rather than forcibly shortened or manipulated for convenience.

Its central principles:

1. **Respect the soul:** A soul is not merely raw material to be subdued, weakened, or reshaped at will.
2. **Preserve continuity:** The stages through which the soul develops and transforms should remain connected rather than being deliberately cut short.
3. **Do not force the process:** Weakening or sealing a soul merely to make it easier to process contradicts the defining Nyuma approach.
4. **Develop intrinsic characteristics:** Strength is cultivated by understanding, refining, controlling, and deepening what the soul naturally possesses.
5. **Complete the process:** In the ordinary Spirit Ring path, the soul proceeds through the proper formation of a Spirit Ring, which is then absorbed by a qualified recipient under official rules.

Soul-Nyuma does not mean passive, weak, uncreative, or opposed to all change. Its practitioners may innovate, refine techniques, and develop formidable abilities. Its defining boundary is fidelity to the soul's intrinsic nature and continuity, not obedience to a government, academy, religion, or social majority.

## 4. Soul-Zoun — Aberrant Intervention

**Soul-Zoun is the aberration-oriented tradition.** It treats the soul's ordinary process as something that can be interrupted, shortened, weakened, sealed, suspended, redirected, or reconstructed in pursuit of a different result.

Its methods may include:

1. **Process compression:** Deliberately shortening or removing stages that would ordinarily occur.
2. **Soul weakening:** Reducing or altering the soul's condition before further processing.
3. **Soul sealing:** Sealing a soul or its manifestation to restrain its ordinary progression or subject it to intervention.
4. **Soul suspension:** Holding the soul in an unresolved or directionless state instead of allowing its process to proceed directly toward completion.
5. **Aberrant reconstruction:** Intervening in the soul's structure or characteristics so the resulting Spirit Ring or Spirit Ability expresses aberrant properties.

These are defining examples, not a checklist every Soul-Zoun practitioner must perform. Different teachers and institutions may specialize in different interventions.

**Aberration is descriptive, not a moral verdict.** Soul-Zoun is not inherently evil, forbidden, demonic, criminal, or synonymous with the ancient calamity. Its methods may produce useful, powerful, unstable, harmful, or failed outcomes. Morality, legality, and social acceptance depend on the actual method, consent, consequences, and local law.

## 5. Spirit Beast Soul → Spirit Ring → Absorption

The Spirit Ring process is the clearest practical point at which the traditions diverge.

### 5.1 Ordinary sequence

The ordinary process is a connected transition:

1. A Spirit Beast reaches a canonically valid death/Spirit Ring event.
2. Its soul or spiritual manifestation retains the Beast's intrinsic characteristics.
3. The soul proceeds through Spirit Ring formation.
4. The formed Spirit Ring becomes available for absorption.
5. A qualified cultivator attempts absorption under the official requirements and formula.
6. Following successful absorption, the ring integrates with the recipient's body and Martial Soul; synchronization and the resulting Spirit Ability follow the actual mechanics and outcome.

The exact appearance, availability, eligibility, timing, and absorption procedure remain defined by `core/SPIRIT_RING_RULES.md` and `bestiary/SPIRIT_BEAST_RULES.md`. This doctrine does not override the established rule that a defeated Spirit Beast's Spirit Ring appears, nor invents an alternative way to obtain or absorb a ring.

### 5.2 Soul-Nyuma processing

Soul-Nyuma respects the soul's continuity from its manifestation through Spirit Ring formation. It does not deliberately weaken or seal the soul to make processing easier, nor suspend it merely to force a different result. The ring is allowed to form through the ordinary process and is then absorbed by a qualified recipient.

The resulting ring and ability therefore tend to retain and express the Beast's intrinsic characteristics in a coherent way.

### 5.3 Soul-Zoun processing

Soul-Zoun may intervene in the soul's manifestation or transition before and during Spirit Ring formation. It may weaken, seal, suspend, compress, or reconstruct the soul so the resulting ring or ability expresses aberrant characteristics.

A sealed, weakened, or suspended soul is **not automatically a completed Spirit Ring**. Absorption still requires a formed ring and must pass official eligibility and resolution rules. Any proposed method that prevents a ring from appearing, creates a ring without the established process, or absorbs an unformed soul requires a separately approved mechanic; GM must not assume such a bypass exists.

### 5.4 No doctrinal guarantee

Neither tradition grants automatic absorption success, immunity from rejection, guaranteed compatibility, a higher Sync cap, or freedom from injury or permanent defects. The same official Spirit Ring mechanics govern both traditions. A method may affect fictional conditions or characteristics only when those facts are established; it does not create unrecorded numerical modifiers.

## 6. Resulting Spirit Ability Characteristics

The purpose of the traditions is also to create meaningful diversity in player powers. Similar Spirit Beast sources can lead to different expressions depending on Beast characteristics, processing method, recipient Martial Soul, synchronization, and legitimate development.

### 6.1 Soul-Nyuma — natural expression

Soul-Nyuma tends to preserve the Spirit Beast's default or intrinsic characteristics. Abilities generally remain within the natural range of the source and develop through better control, precision, force, efficiency, scale, duration, or application.

A water-type Spirit Beast might produce controlled currents, stable water spheres, pressure jets, or precise barriers. A fire-type Beast might produce stable flames, controlled heat, or precise combustion. These abilities can still be extremely powerful or destructive; stability does not mean weakness.

### 6.2 Soul-Zoun — aberrant expression

Soul-Zoun may cause the resulting ability to depart from the source's default characteristics. A water-type manifestation might become turbulent or raging, emit abnormal force or energy, or behave in a way ordinary water manipulation would not. A fire-type manifestation might surge unpredictably or develop an additional emission characteristic.

Aberration need not change the source into an unrelated element. It may change the behavior, expression, function, structure, or secondary characteristics of the original power. The change must remain traceable to the source soul and actual intervention; it cannot grant arbitrary unrelated abilities.

### 6.3 Same source, different expression

Two cultivators may absorb rings from the same or similar Spirit Beast yet develop distinct abilities: one retains a stable natural expression while the other manifests an aberrant variation. Beast species alone does not determine a cultivator's tradition or guarantee a particular ability. GM must consider established Beast traits, processing history, Martial Soul interaction, and recorded outcomes.

## 7. Aberration Limits and Consequences

Aberration is not unlimited permission to invent powers. The further a manifestation departs from the source's intrinsic characteristics, the more demanding its structure and control may become.

Possible consequences include:
- greater difficulty controlling or maintaining the manifestation;
- unstable output, irregular behavior, or inconsistent performance;
- increased Qi demand to form, sustain, stabilize, or control the aberrant expression;
- adverse interaction with the recipient's body, Martial Soul, or synchronization;
- failure to stabilize the intended change or failure of the method itself.

These are possible consequences, not automatic penalties for every Soul-Zoun technique. Their presence and severity must be grounded in the method, scene, established mechanics, and recorded state.

A manifestation must retain a defensible relationship to the original soul and Spirit Beast. A water Beast may develop raging water, abnormal pressure, or an additional emission property; it does not automatically gain unrelated space-time powers merely because Soul-Zoun was used.

No numerical aberration scale, universal maximum deviation, or fixed structural-collapse threshold is established here. Do not invent such levels or thresholds. Seek owner approval before treating a new limit as binding canon.

## 8. Qi Efficiency and Consumption

The traditions also tend to differ in the Qi required to use their resulting abilities.

### 8.1 Soul-Nyuma — closer to the default Qi range

Because the ability generally retains the source's intrinsic characteristics, its formation and control tend to remain closer to the ordinary Qi demand of that ability. Soul-Nyuma therefore tends toward greater Qi efficiency, consistency, and sustainability.

### 8.2 Soul-Zoun — additional demand from aberration

An aberrant manifestation may require additional Qi to create, maintain, stabilize, or control characteristics that depart from the source's default nature. Instability and complexity can increase that demand. Soul-Zoun therefore tends toward higher Qi consumption, particularly when deviation is substantial or difficult to control.

### 8.3 No universal percentage

The example of a basic Soul-Nyuma fireball consuming **12% Qi per use** and a Soul-Zoun aberrant fire mass consuming **19%** illustrates the intended contrast; it is **not** a universal price table or default for every technique.

Actual Qi cost depends on the specific ability and its recorded mechanics, including output, complexity, duration, range, control demands, and degree of aberration. A complex Nyuma ability may be expensive; a minor Zoun deviation may impose only a modest additional demand. Never assign 12%, 19%, or a blanket tradition multiplier unless the ability's official record establishes it.

Soul-Nyuma is not automatically stronger because it is efficient, and Soul-Zoun is not automatically stronger because it is aberrant. Nyuma often favors consistency and endurance; Zoun may offer unusual expressions at greater resource and control cost.

## 9. Education, Institutions, and Local Perspectives

Soul-Nyuma and Soul-Zoun are foundational bodies of knowledge that may be taught, preserved, debated, and developed by academies, dojos, clans, sects, independent teachers, and research groups. Their curricula may cover the shared Spirit Realm domain while emphasizing their chosen tradition.

An institution's affiliation must be supported by its actual doctrine, teaching materials, methods, leadership declarations, records, or established history. Do not infer affiliation from its name, region, reputation, political alignment, species, combat style, or presumed morality.

### 9.1 What an institution may teach

Depending on its actual curriculum and access, an institution may teach:
- its tradition's philosophy and history;
- the nature and treatment of souls and Spirit Beast characteristics;
- Spirit Ring formation and absorption theory, without changing official absorption rules;
- methods for developing natural or aberrant Spirit Ability expression;
- Qi efficiency, control, stability, and resource management;
- documented successes, failures, risks, and ethical disputes;
- comparative criticism of the opposing tradition.

Teaching theory does not automatically grant practical mastery, an ability, a Spirit Ring, a Sync increase, or permission to perform a restricted method. Progression and practical outcomes remain subject to the relevant rules and actual training.

### 9.2 Local interpretation and institutional prejudice

Institutions need not share one universal opinion about the opposing tradition. Their interpretation may be shaped by doctrine, history, teaching culture, competition, religion, politics, economics, research, or personal experience.

For example, a Soul-Nyuma clan such as the illustrative **White Cloud Clan** might regard Soul-Zoun with contempt, describe its methods as degrading, or feel disgust toward deliberate soul weakening and sealing. A Soul-Zoun institution such as the illustrative **Peerless Mountain Clan** might describe Soul-Nyuma as outdated, narrow-minded, overly attached to convention, or lacking vision.

These names are examples of possible attitudes, **not new canon institutions or established affiliations** unless separately confirmed in the world files.

Such views are local perspectives, not objective narration. GM may portray prejudice, rivalry, propaganda, debate, discrimination, or internal dissent when supported by the institution's characterization. Do not make every member think identically: students, teachers, elders, defectors, reformers, and independent practitioners may disagree with their institution.

### 9.3 No automatic social or legal alignment

A Soul-Nyuma institution is not automatically lawful, benevolent, tolerant, or correct. A Soul-Zoun institution is not automatically criminal, cruel, forbidden, or villainous. A local government may regulate a particular method, while another region may tolerate or encourage it. Record law and local position separately from doctrine.

Institutions may also teach foundational Spirit Realm instruction without formally adopting either tradition, or teach comparative material about both. Leave affiliation unspecified when evidence is insufficient.

## 10. Historical Record — Sync Cap 100%

**Binding historical fact:** In the recorded history of Merzkava, the only ahli Spirit Realm known to have achieved a Spirit Ring with full potential and a **100% Sync cap** belonged to the **Soul-Nyuma** tradition.

This may influence institutional pride, scholarly debate, rivalry, propaganda, and the ambitions of both traditions. Nyuma institutions may cite it as evidence for preserving soul continuity. Zoun institutions may question whether historical precedent defines the limits of future discovery.

This fact does **not** mean:
- every Soul-Nyuma practitioner can reach a 100% Sync cap;
- Soul-Nyuma automatically grants a 100% cap or Sync bonus;
- Soul-Zoun practitioners are mechanically barred from reaching 100%;
- a 100% cap guarantees successful absorption, full current Sync progress, perfect combat performance, or mastery of every ability;
- any existing Spirit Ring formula is changed.

The actual Sync cap for each absorption attempt remains calculated exclusively under `core/SPIRIT_RING_RULES.md`. This is a historical record, not a mechanical modifier or prediction about the future. No individual identity, date, location, or additional event is established by this statement unless another canon source records it.

## 10A. Aberration and the Ancient Calamity

The ancient world-spanning calamity involved anomalies that exceeded safe limits, opened gates to other worlds, and allowed Tier 7–9 Demonic Beasts to descend. It is a historical example of catastrophic aberrant phenomena, but it is **not the definition of Soul-Zoun** and is not established as having been caused by Soul-Zoun or its practitioners.

Not every aberration opens a gate, attracts a Demonic Beast, or escalates into an apocalypse. AWR checks, anomalies, gate openings, and world-scale incursions remain distinct events governed by their dedicated mechanics and historical canon. The calamity may shape research ethics, public fear, institutional safeguards, historical memory, and political policy toward aberrant phenomena; responses vary by institution and region.

## 10B. Retired Global Classification

The former four-part global classification—**Orthodox, Unbound, Forbidden, and Supremacy**—is retired and must not be used as the world's formal taxonomy of Spirit Realm traditions. Do not mechanically map the old labels onto Soul-Nyuma or Soul-Zoun.

Those words may survive only as contextual local, historical, legal, religious, or factional descriptions. For example, “forbidden” describes a restriction imposed by an authority, not an inherent property of Soul-Zoun; “orthodox” may describe a local institution's established custom, not a universal Spirit Realm tradition. Such usage must not recreate the retired global system.

## 11. Classification and GM Application

When a tradition matters to a scene, GM must:

1. Identify the actual soul-processing principle or method being taught or used.
2. Distinguish Soul-Nyuma, Soul-Zoun, shared/foundational Spirit Realm instruction, comparative study, and unspecified affiliation.
3. Explain the difference through soul treatment, resulting ability characteristics, and Qi trade-offs—not merely labels such as good/evil, orthodox/heretical, legal/illegal, or strong/weak.
4. Separate objective facts from an institution's interpretation, prejudice, rumor, or propaganda.
5. Respect the character's knowledge, training, access, and actual affiliation; do not grant mastery from attendance or association alone.
6. Resolve absorption, Sync, Qi, combat, injury, and progression through their dedicated mechanics. Record only outcomes that truly occur.

Do not force a tradition into every scene. These traditions shape Spirit Realm knowledge and institutional culture; they do not replace Merzkava's existing regions, factions, histories, laws, or everyday life.

## 12. Mechanical Authority and Canon Boundaries

Use the dedicated authority for each subject:

- `core/CULTIVATION_SYSTEM.md` — Spirit Realm levels, stages, Sync progress, bottlenecks, breakthrough, and slots.
- `core/MARTIAL_SOUL.md` — Martial Soul forms, traits, and lore.
- `core/MARTIAL_SOUL_AWAKENING.md` — awakening, rarity, assessment, and mutation procedures.
- `core/SPIRIT_RING_RULES.md` — Spirit Ring acquisition and absorption, compatibility, Sync cap, success, permanent defects, Qi, PowerScale, and AWR.
- `bestiary/SPIRIT_BEAST_RULES.md` — Spirit Beast age, tiers, and relevant Beast rules.
- `gameplay/COMBAT_SYSTEM.md` — combat resolution.
- `core/ARCANISTRY_AND_FORMULATION.md` — Arcanistry and all Arcanist progression and production mechanics.
- `core/CULTIVATOR_ACADEMIES.md` and `world/OPEN_LEARNING_PATHS_AND_WANDERING_INSTRUCTORS.md` — education and learning routes.
- `world/HISTORY.md` and `world/CANON_DECISIONS_AND_PRECEDENCE.md` — established historical events and binding world decisions.

A doctrine cannot override a formula, grant an ability, bypass a prerequisite, guarantee compatibility, reverse a failed process, or create an event by declaration. If a proposed method has no established mechanical resolution, treat it as unresolved until the owner approves a rule and the relevant authority is updated.



---

<!-- SOURCE core/SPIRIT_RING_RULES.md | upstream blob 72666ef29bd5df41364f4727596747606fe581cf -->

# Merzkava Universe — Spirit Ring Rules

Status: Modul mekanik resmi; §6.1 adalah otoritas tunggal untuk tekanan usia, cap Sync, peluang Penyerapan Spirit Ring, kecacatan permanen, dan AWR. PowerScale serta Qi tetap mengikuti rumusnya masing-masing.
Cakupan: usia dan warna Spirit Ring, kemunculan ring, penyerapan, sinkronisasi, power scale, Qi, serta hubungan dengan bottleneck dan breakthrough.

Aturan dalam modul ini harus dipertahankan secara konsisten. Jangan menghapus atau mengganti mekanik yang telah disepakati hanya karena rinciannya tidak tertulis di WORLD.md. Untuk tingkat kultivasi, gunakan istilah kanonis **Spirit Realm** sebagaimana ditetapkan dalam `core/CULTIVATION_SYSTEM.md`; jangan gunakan `Realm` atau `Cultivation Realm` sebagai istilah singkatan untuk tingkat kultivasi.


**Tradition boundary:** Soul-Nyuma and Soul-Zoun may process or interpret the Spirit Beast soul differently before and during Spirit Ring formation, and their resulting abilities may express natural or aberrant characteristics. Neither tradition has a separate absorption formula, exemption, Sync bonus, or bypass. A sealed, weakened, or suspended soul is not automatically a completed Spirit Ring; a formed ring must still pass every official eligibility and absorption rule in this file. Qi costs and all numerical outcomes remain governed by the existing mechanics. Doctrine is defined in `core/SPIRIT_REALM_TRADITIONS.md`.

---

## 1. Sumber Spirit Ring

Spirit Ring diperoleh melalui Spirit Beast dan proses perolehan yang sah.

- Setelah Spirit Beast dikalahkan, Spirit Ring muncul mengambang di atas tubuh Beast.
- Perburuan dan penaklukan Beast dapat berlangsung di hutan atau lokasi berbahaya.
- Jangan mewajibkan pemburu membawa Beast ke tempat meditasi aman sebelum perburuan selesai.
- Mengalahkan Beast memunculkan ring, tetapi tidak berarti karakter otomatis berhasil menyerapnya.
- Kemampuan hasil penyerapan harus memiliki dasar pada interaksi Martial Soul pemilik, karakteristik Spirit Beast/ring, rumusan kemampuan, dan hasil sinkronisasi yang benar-benar terjadi. Ring tidak harus sekadar menyalin kemampuan Beast secara mentah: interaksi itu dapat membentuk kombinasi baru yang sesuai dengan apa yang sudah dapat dilakukan Martial Soul. Jangan mengarang kemampuan tanpa dasar yang dapat ditelusuri.

## 1.1 Normal Routes for Obtaining a Spirit Ring

After a character has awakened their Martial Soul, a first or later Spirit Ring may be pursued through one of three broad routes. These are ways to find and hunt a suitable Spirit Beast; they do **not** replace the official compatibility, absorption, breakthrough, or time rules elsewhere in this module.

### Route A — Academy Supervised Field Expedition (Safe Route)

Students at an academy that offers practical field instruction can study Spirit Ring theory before being deployed in a group to a designated forest or other wilderness area. A **Safe Route** is a route selected and supervised by the academy for the students' demonstrated readiness, known hazards, and the intended training objective.

- Preparation may cover Spirit Beast signs and habitats, assessing known species and likely danger, team positioning, retreat signals, basic combat coordination, emergency response, ring compatibility, and the distinction between defeating a Beast and absorbing its ring.
- The instructor or expedition leader selects the area and objective according to the students' actual preparation and the information available. A Safe Route should reduce avoidable exposure; it is not a guarantee that the route is harmless, the target is present, or every encounter is within the group's ability.
- The academy may provide supervision, guidance, and a planned withdrawal route, but do not invent an always-present rescue team, automatic medical protection, or guaranteed evacuation unless the actual expedition establishes it.
- Academy students do not automatically receive a Spirit Beast, a particular ring age, a successful hunt, a compatibility bonus, or a guaranteed successful absorption. Attendance grants no unrecorded combat skill or immunity.
- Only the two central boarding academies currently named in Golden Dragon Empire canon are established as specific institutions: Imperial Foundation Academy and Imperial Cultivation Academy, both in Huanglongcheng. Other academies, local branches, and their field programs must be established through canon or events rather than assumed.

### Route B — Temporary Spirit Hunters Guild Party

A person can register for a temporary Spirit Beast hunting party through a local Spirit Hunters Guild office when one is available. The Guild also lists non-hunting contracts—such as escorting, important-cargo transport, and item searches—under its six-tier difficulty system in `world/SPIRIT_HUNTERS_GUILD.md`; those jobs do not themselves provide a Spirit Ring. Parties may be mixed and unpredictable: academy students, younger clan or sect members, independent hunters, half-beasts, people from Lawless Territories, or lower-ranking imperial circles may join. See `world/SPIRIT_HUNTERS_GUILD.md`.

- A temporary roster is flexible, not proof that everyone is trustworthy. Members may have different goals, skills, experience, loyalties, and definitions of a fair reward.
- Before departure, the party should clarify target, route, roles, signals, emergency plans, and how the ring and other spoils will be distributed. A written or witnessed agreement is useful but does not make betrayal impossible.
- Watch for suspicious conduct, including attempts to isolate a member, hide route information, manipulate target selection, change reward terms, or steer the party into an unexplained danger. These are warning signs, not proof of guilt by themselves.
- Credibly established serious misconduct can lead to Guild blacklisting. Severe cases may receive a Guild **Deadpool Notice**, a bounty contract specifying live capture or permission for lethal force. It is not automatically lawful or enforceable everywhere, and it must not be issued as a proven conviction on an unsupported accusation.
- A Guild party may be more capable through cooperation, but coordination can fail. The Guild does not guarantee the team's strength, the target's presence, the hunt's success, the ownership of the ring, or safe absorption.

### Route C — Solo Hunt

A character may hunt alone without an academy supervisor, group support, a Guild party, or a guaranteed rescue route.

- This is generally the least forgiving route because the character must handle tracking, scouting, combat, escape, injuries, supplies, and the aftermath alone. The actual danger still depends on the habitat, target, preparation, equipment, character abilities, and available information.
- Solo hunting generally demands serious preparation and a capability that is clearly adequate for the specific target—normally above an ordinary person's baseline—or a concrete advantage from relevant knowledge, equipment, reliable information, terrain, or other established circumstances. An average person may attempt it, but an attempt alone does not make the hunt feasible. A powerful cultivator is not automatically capable of defeating every target. Determine feasibility from the character's recorded capabilities and the target's established or reasonably inferred threat; do not grant a victory merely because the player chooses to hunt alone.
- Deep or difficult-to-reach wilderness tends to contain higher-tier Spirit Beasts, but this is a tendency, not a universal law. A familiar route can still be dangerous, and a remote route does not guarantee a valuable Beast.
- Do not invent a universal hunting-encounter percentage or difficulty score; resolve the hunt using `gameplay/COMBAT_SYSTEM.md` and official PowerScale/Qi, HP, and Injury rules. For an eligible Spirit Ring absorption attempt only, use the explicit success formula in §6.1; do not transfer that formula to hunt or combat odds. If critical target information is unknown, preserve the uncertainty.
- A character can decide to retreat. Whether escape is possible depends on distance, terrain, the Beast's abilities, injuries, pursuit, and other actual circumstances; retreat is not an automatic reset or guaranteed safety.

### Shared Rule — Hunt Difficulty Is Not Absorption Difficulty

1. **Finding and identifying a target:** use established habitat information, field signs, reports, and the character's actual knowledge. Treat uncertain age, tier, temperament, and numbers as uncertain.
2. **Hunting/defeating it:** use the official combat system, including PowerScale, readiness, hit chance, damage, defense, and injury. A higher-tier or older Beast may be beyond the party's ability; do not turn that into an arbitrary numeric penalty.
3. **Obtaining the ring:** after a Spirit Beast is defeated, its Spirit Ring may appear above the body. This does not automatically settle who owns it if the party has a valid prior agreement or a dispute arises.
4. **Absorbing the ring:** apply the complete unified formula in §6.1 for age pressure, Sync cap, success chance, permanent-defect risk, and AWR. Do not use the superseded tier-gap, combat-bonus, method-bonus, or voluntary-handover cap formulas, and do not invent an extra chance or double-count the same advantage.
5. **Consequences:** if absorption fails or causes deviation, apply the existing ring, HP, injury, and cultivation rules. Do not invent a new failure probability or erase consequences because the character used an academy or guild route.

## 2. Usia Spirit Ring dan Toleransi Tubuh

Tidak ada batas usia Spirit Ring yang mutlak hanya berdasarkan angka usia atau Spirit Realm. Rekomendasi usia ring harus mempertimbangkan toleransi tubuh, kompatibilitas, dan keadaan kultivator.

- Jangan menetapkan batas usia maksimum universal untuk setiap Spirit Realm.
- Jangan menganggap kultivator pasti mampu menyerap ring hanya karena berhasil mengalahkan Beast.
- Ring berusia lebih tinggi dapat membawa risiko bagi tubuh yang tidak mampu menoleransinya; keberhasilan tidak boleh dianggap otomatis.
- Usia ring adalah faktor dominan untuk power scale. Tier Beast yang menghasilkan ring terutama memengaruhi kompatibilitasnya, bukan menjadi pengganti nilai usia ring.

### 2.1 Beast Age Grade untuk kalkulasi

Untuk setiap Beast yang umurnya diketahui, tentukan **Beast Age Grade** (selanjutnya **Age Grade**) menggunakan rumus dan tabel kanonis di `bestiary/SPIRIT_BEAST_RULES.md` §1.2. Angka 1–9 di sana adalah kelas umur semata—bukan kategori Spirit Beast/Demonic Beast/Heavenly Beast, bukan Spirit Realm, dan bukan penilaian kekuatan. Jangan gunakan Age Grade sebagai pengganti usia aktual ketika menghitung AgeTotal atau PowerScale.

Age Grade dan warna Spirit Ring merupakan dua klasifikasi berbeda. Warna ring mengikuti tabel §3; Age Grade Beast mengikuti tabel bestiary. Age Grade 9 dimulai pada 500.000 tahun dan tidak memiliki batas maksimum tetap. Contohnya, Heavenly Beast Azerion Forest berumur 7.290.422 tahun tetap Age Grade 9.

## 3. Warna Ring

| Warna | Kode HEX acuan | Usia Spirit Ring |
|---|---|---:|
| Putih | `#FFFFFF` | 10–99 tahun |
| Kuning | `#FFFF00` | 100–999 tahun |
| Biru | `#0000FF` | 1.000–9.999 tahun |
| Hitam | `#000000` | 10.000–49.999 tahun |
| Merah | `#FF0000` | 50.000–99.999 tahun |
| Oranye | `#FFA500` | 100.000–499.999 tahun |
| Maroon | `#800000` | 500.000–999.999 tahun |
| Emas | `#FFD700` | 1.000.000–1.999.999 tahun |
| Ungu | `#800080` | 2.000.000–3.999.999 tahun |
| Pink | `#FFC0CB` | 4.000.000–6.999.999 tahun |
| Dark Vienna | `#1E203E` | 7.000.000–15.000.000 tahun |

Kode HEX adalah acuan tampilan warna, bukan atribut kekuatan terpisah. Setiap rentang usia yang ditetapkan menggunakan warna unik; warna tidak boleh dipakai ulang untuk rentang usia berbeda.

Makhluk yang berusia **lebih dari 15.000.000 tahun** dipandang sebagai makhluk **Heaven Realm**, ranah para dewa yang berada di atas kekuatan Spirit Primordial. Mereka tidak boleh diperlakukan sekadar sebagai Spirit Beast biasa yang lebih tua. Tabel ini tidak menetapkan warna Spirit Ring untuk makhluk Heaven Realm; jangan menebak atau menciptakan warna di atas rentang Dark Vienna.

Rentang warna di bawah 10 tahun belum ditetapkan.

## Status Kanonis Spirit Ring Absorption

Gunakan pemetaan status dan format field tunggal yang ditetapkan di `templates/CHARACTER_PROFILE_TEMPLATE.md` → **Status Kanonis Spirit Ring Absorption**. Jangan membuat pemetaan alternatif atau menyalin daftar status lain di modul ini.

Ketentuan mekanik yang tetap berlaku:
- `pending` hanya untuk proses Awakening yang benar-benar sedang berlangsung.
- Sebelum penyerapan pertama berhasil, jeda belum dimulai dan status harus memakai `??? Day left` sesuai tahap karakter.
- Untuk ring kedua hingga kesembilan, `Day left = 0` adalah gerbang wajib terpisah dari Sync/bottleneck, ketersediaan ring, item, toleransi tubuh, dan syarat resmi lainnya.
- `eligible` menandakan syarat karakter/proses terpenuhi, bukan bahwa ring fisik tersedia atau penyerapan pasti berhasil.
- Spirit Realm 9 selalu `max | ∞ Day left`; tidak ada ring kesepuluh.
- `Belum ditetapkan Day left` hanya untuk save lama yang diketahui pernah menyerap ring tetapi riwayat waktu tidak cukup untuk merekonstruksi cooldown.

## 4. Awakening, Slot, dan Bottleneck

- Awakening Martial Soul berlangsung pada usia empat tahun atau lebih.
- Mortal adalah status dasar sebelum sembilan Spirit Realm. Mortal yang telah mengalami Awakening Martial Soul boleh menyerap Spirit Ring pertama; tidak ada syarat Spirit Realm atau bottleneck tambahan untuk ring pertama selain Awakening dan persyaratan penyerapan yang memang berlaku.
- Sebelum ring pertama berhasil diserap, jeda antarpenyerapan belum dimulai. Mortal tanpa proses Awakening aktif memakai `not eligible yet | ??? Day left`; Awakening yang sedang berlangsung memakai `pending | ??? Day left`; setelah Awakening selesai, evaluasi kelayakan ring pertama dan tampilkan `??? Day left`. Spirit Realm 9 selalu `max | ∞ Day left`, karena sembilan slot adalah batas puncak dan tidak ada ring berikutnya. Setelah penyerapan berhasil pada Spirit Realm 1–8, langsung inisialisasi cooldown menuju ring berikutnya.
- Awakening tidak otomatis memberikan Spirit Ring pertama: ring harus tersedia melalui proses yang sah dan penyerapannya harus benar-benar berhasil. Mortal yang belum Awakening tidak dapat menyerap Spirit Ring pertama.
- Sistem memiliki sembilan Spirit Realm dan satu slot Spirit Ring untuk setiap Spirit Realm, sehingga Spirit Realm 1 membuka satu slot dan Spirit Realm 9 membuka sembilan slot. Spirit Realm 9 adalah batas puncak: `Spirit Ring Absorption: max | ∞ Day left`; tidak ada slot atau penyerapan ring kesepuluh.
- Urutan Spirit Realm: Spirit Initiate, Spirit Adept, Spirit Elder, Spirit Monarch, Spirit King, Spirit Ancestor, Spirit Emperor, Spirit Sovereign, Spirit Primordial.
- Sync progress selalu dibandingkan dengan cap kompatibilitas ring. Mencapai cap (misalnya `45%/45%`) berarti karakter mencapai batas kompatibilitas normal ring itu; **bukan** berarti cap harus 100%.
- Penguasaan kekuatan ring 100% adalah konsep terpisah: kekuatan ring dikuasai sepenuhnya, setara dengan saat Spirit Beast asalnya menggunakannya. Jangan samakan penguasaan 100% dengan Sync progress 100% atau dengan cap kompatibilitas. Jangan menganggap penguasaan penuh tercapai hanya karena progress menyentuh cap.
- Menerobos setelah ring pertama memerlukan seluruh syarat di `core/CULTIVATION_SYSTEM.md`: bottleneck dalam jarak kurang dari 10 poin persentase dari cap, ring berikutnya tersedia, item wajib untuk Beast target tersedia, dan jeda minimum antar-penyerapan telah terpenuhi. Aturan bottleneck dan jeda ring berikutnya tidak menjadi syarat tambahan untuk penyerapan ring pertama oleh Mortal yang telah Awakening.
- Penyerapan ring berikutnya menambah jumlah ring hanya jika benar-benar berhasil. Spirit Realm baru hanya dicatat setelah seluruh proses breakthrough berhasil.
- Qi mortal sebelum awakening bernilai 0; setelah awakening tetapi sebelum ring pertama diserap, Qi belum terbentuk.
## 5. Penyerapan Spirit Ring, Kultivasi, Sync progress, dan Bottleneck

Istilah proses mekanik yang digunakan hanya:
- **Penyerapan Spirit Ring:** proses memperoleh dan menambahkan satu Spirit Ring ke jumlah ring yang dimiliki.
- **Kultivasi:** proses meningkatkan Sync progress menuju cap kompatibilitas maksimum ring yang sedang diproses.
- **Menerobos:** proses terpisah yang hanya berhasil apabila seluruh syarat resmi terpenuhi.

Meditasi atau kegiatan lain bukan Penyerapan Spirit Ring maupun Kultivasi. Kegiatan tersebut tidak otomatis menambah ring, menaikkan Sync progress, atau memenuhi syarat breakthrough.

Untuk setiap ring baru, hitung kompatibilitas ring tersebut (`Cᵢ`) menggunakan rumus §6.1. Nilai `Cᵢ` menjadi cap kompatibilitas maksimum bagi Sync progress ring itu. Format wajib: `Sync progress: [progres saat ini]%/[Cᵢ]%`. Contoh `Sync progress: 0%/78%` hanya berlaku jika rumus resmi menghasilkan cap 78%.

Cap dapat berbeda pada setiap ring dan tidak otomatis 100%. Kultivasi dapat menaikkan Sync progress hingga cap, tetapi tidak melewatinya. **Durasi Kultivasi tidak mengurangi `Day left`**; hitung mundur jeda hanya maju selama waktu dunia yang dijalani secara normal di luar Kultivasi. Jeda waktu tetap harus dipenuhi secara terpisah dari Sync progress. Jarak dari cap dihitung sebagai cap dikurangi Sync progress saat ini. Contoh: `Sync progress: 45%/45%` berarti cap tercapai walau angka progresnya bukan 100%. Penguasaan kekuatan ring 100% tetap merupakan konsep terpisah dan berarti kekuatan ring dikuasai sepenuhnya setara dengan penggunaan Spirit Beast asalnya.

Syarat bottleneck untuk menerobos: jarak Sync progress ke cap harus kurang dari 10 poin persentase. Jika jaraknya 10 poin atau lebih, karakter belum memenuhi syarat bottleneck untuk menerobos.

Setiap breakthrough juga memerlukan ring berikutnya yang benar-benar tersedia, item wajib yang sesuai dengan Spirit Beast target, dan jeda minimum sejak penyerapan ring sebelumnya yang berhasil. Untuk ring kedua dan seterusnya, `Day left` harus tepat `0`; cap Sync yang tercapai tidak dapat menggantikan jeda ini, dan Kultivasi tidak mengurangi hitung mundurnya:
- Ring 1 → Ring 2: 2 minggu.
- Ring 2 → Ring 3: 1 bulan.
- Ring 3 → Ring 4: 3 bulan.
- Ring 4 → Ring 5: 6 bulan.
- Ring 5 → Ring 6: 1 tahun.
- Ring 6 → Ring 7: 2 tahun.
- Ring 7 → Ring 8: 3 tahun.
- Ring 8 → Ring 9: 4 tahun.

Jika persyaratan item khusus Beast belum ditetapkan, GM wajib menetapkan requirement sementara yang konkret berdasarkan tier/usia Spirit Ring dan jenis serta karakteristik Spirit Beast target sesuai `bestiary/SPIRIT_BEAST_RULES.md`. Requirement tersebut menjadi syarat breakthrough untuk menyerap Spirit Ring target; jangan membiarkannya kosong atau menganggapnya tidak diperlukan.

Deviasi: makin besar jarak Sync progress dari cap ketika breakthrough dipaksakan, makin tinggi dampaknya. Memaksakan Penyerapan Spirit Ring sebelum jeda minimum juga meningkatkan dampak deviasi. Gunakan formula dan tabel berikut sebagai satu-satunya sumber numerik deviasi.

### 5.1. Persentase deviasi dan tingkat ring

Persentase deviasi (**D**) menunjukkan seberapa besar deviasi yang terjadi, dari 1% sampai 100%. Kehilangan HP dasar dihitung sebagai persentase dari **HP maksimum karakter saat percobaan**, lalu dikalikan faktor tingkat ring. Dengan demikian, hasil menyesuaikan total cap HP karakter dan meningkat seiring nomor ring.

- **D = 1–100%** sesuai tingkat deviasi aktual.
- Pada deviasi 100%, Ring 1 kehilangan HP dasar sebesar 30% dari HP maksimum karakter.
- Faktor ring meningkat secara bertahap dari ×1,00 pada Ring 1 hingga ×2,00 pada Ring 9.
- Nomor ring yang dipakai adalah ring yang sedang diproses, **N = 1–9**.
- Gunakan HP maksimum sesuai Spirit Realm dan Stage karakter pada `core/HP_SYSTEM.md`; jangan memakai HP saat ini sebagai dasar persentase.
- Jangan menyamakan persentase deviasi dengan kategori risiko. Kategori risiko tetap ditentukan dari poin HP yang benar-benar hilang pada §5.3.

### 5.2. Rumus dan tabel kehilangan HP dasar

Gunakan:
- **H** = HP maksimum karakter saat percobaan, sesuai `core/HP_SYSTEM.md`.
- **N** = nomor Spirit Ring yang sedang diproses (1–9).
- **D** = persentase deviasi (1–100%).

Rumus tunggal:

`Faktor ring = 1 + ((N − 1) / 8)`

`Kehilangan HP dasar = round(H × 0,30 × (D / 100) × Faktor ring)`

- Ring 1 menggunakan faktor ×1,00; Ring 9 menggunakan faktor ×2,00.
- Pada deviasi 100%, Ring 1 mengurangi 30% HP maksimum; Ring 9 mengurangi 60% HP maksimum. Ring di antaranya meningkat bertahap.
- Pembulatan ke bilangan bulat terdekat; nilai tepat x,5 dibulatkan ke atas.
- Hasil rumus adalah poin HP. Setelah pengali pemaksaan diterapkan, kehilangan aktual tidak boleh melebihi HP saat ini.
- Jangan gunakan rentang acak 15–19 HP lama; rumus berbasis HP maksimum ini menggantikannya.

Tabel faktor ring pada deviasi 100%:

| Nomor Spirit Ring | Nama Spirit Realm terkait | Faktor ring | Kehilangan HP dasar sebagai persentase HP maksimum |
|---:|---|---:|---:|
| 1 | Spirit Initiate | ×1,00 | 30% |
| 2 | Spirit Adept | ×1,125 | 33,75% |
| 3 | Spirit Elder | ×1,25 | 37,5% |
| 4 | Spirit Monarch | ×1,375 | 41,25% |
| 5 | Spirit King | ×1,50 | 45% |
| 6 | Spirit Ancestor | ×1,625 | 48,75% |
| 7 | Spirit Emperor | ×1,75 | 52,5% |
| 8 | Spirit Sovereign | ×1,875 | 56,25% |
| 9 | Spirit Primordial | ×2,00 | 60% |

Untuk deviasi di bawah 100%, kalikan hasil persentase pada tabel dengan D/100. Contoh: karakter dengan HP maksimum 1.000 yang memproses Ring 3 pada deviasi 50% kehilangan `round(1.000 × 0,30 × 0,50 × 1,25) = 188 HP` dasar. Karakter dengan HP maksimum 8.950 yang memproses Ring 9 pada deviasi 100% kehilangan `round(8.950 × 0,30 × 1,00 × 2,00) = 5.370 HP` dasar. Jadi, hasil menyesuaikan HP maksimum karakter dan tingkat ring; nilai Ring 100% selalu meningkat saat nomor ring bertambah.

### 5.3. Kategori risiko berdasarkan poin HP yang hilang

Kategori risiko ditentukan dari jumlah HP yang benar-benar hilang setelah batas HP saat ini diterapkan, bukan langsung dari persentase deviasi; persentase hanya digunakan untuk menghitung kehilangan HP dasar.

| HP yang benar-benar hilang | Kategori risiko |
|---:|---|
| 1–4 poin | Sangat Rendah |
| 5–9 poin | Rendah |
| 10–19 poin | Menengah Rendah |
| 20–29 poin | Menengah Tinggi |
| 30–39 poin | Tinggi |
| 40 poin atau lebih | Sangat Tinggi |

Dengan tabel ini, kehilangan 15–19 poin selalu masuk **Menengah Rendah**, sebagaimana patokan pemilik. Jika HP saat ini lebih rendah daripada angka kehilangan yang dihitung, HP tidak boleh turun di bawah 0: kehilangan aktual dibatasi pada HP yang masih tersisa, lalu kategori risiko memakai kehilangan aktual tersebut.

### 5.4. Pengubah karena breakthrough dipaksakan

Rentang pada §5.2 adalah dampak dasar ketika tidak ada pelanggaran tambahan. Jika karakter memaksakan proses, gunakan pengali berikut pada kehilangan HP dasar sebelum menerapkan batas HP yang tersisa:

| Kondisi saat proses dipaksakan | Pengali dampak |
|---|---:|
| Gap 0–2 poin persentase dan jeda minimum terpenuhi | ×1,00 |
| Gap 3–5 poin persentase dan jeda minimum terpenuhi | ×1,25 |
| Gap 6–9 poin persentase dan jeda minimum terpenuhi | ×1,50 |
| Jeda minimum belum terpenuhi | ×1,50 |
| Gap ≥10 poin persentase tetapi proses tetap dipaksakan | ×2,00 |

`Gap = cap kompatibilitas − Sync progress saat ini`. Pengali gap dan pengali pelanggaran jeda **tidak ditumpuk**: gunakan pengali terbesar yang berlaku. Ini mencegah hukuman berlipat ganda dari satu kejadian yang sama. Jika Gap ≥10, proses tetap tidak sah menurut syarat bottleneck; pengali ×2,00 hanya dipakai bila narasi/kejadian secara eksplisit menyatakan karakter tetap memaksakan proses dan GM menyelesaikan konsekuensinya.

Setelah pengali diterapkan, bulatkan hasil ke bilangan bulat terdekat (x,5 ke atas), batasi kehilangan aktual agar tidak melebihi HP saat ini, lalu tentukan kategori risiko dari kehilangan aktual. Contoh: karakter dengan HP maksimum 1.000 yang memproses Ring 3 pada deviasi 50% memiliki kehilangan dasar 188 HP; jika pengali ×1,50 berlaku, hasilnya 282 HP sebelum batas HP saat ini. Kategori risiko ditentukan dari kehilangan aktual setelah batas HP saat ini diterapkan.

### 5.5. Alur wajib GM

**Otoritas angka:** §5.1–§5.4 hanya menangani deviasi dan dampak HP. Semua perhitungan tekanan usia, toleransi Spirit Realm, EAG, cap Sync, peluang keberhasilan, risiko kecacatan permanen, dan AWR harus dihitung hanya dari §6.1. Jika ada perbedaan redaksi di bagian lain, §6.1 menjadi sumber numerik untuk kelompok formula tersebut; jangan menyalin atau menghitung ulang rumusnya di §5.5.

**Hard gate kelayakan penyerapan:** sebelum menarasikan atau menyelesaikan setiap upaya Penyerapan Spirit Ring, tetapkan status `Spirit Ring Absorption` dari kondisi aktual menggunakan pemetaan kanonis di `templates/CHARACTER_PROFILE_TEMPLATE.md`. Spirit Realm 9 berstatus `max` dan tidak dapat mencoba penyerapan lanjutan. Untuk ring pertama, Mortal wajib telah mengalami Martial Soul Awakening; tidak ada syarat bottleneck atau jeda antar-ring untuk ring pertama, tetapi ring harus tersedia melalui proses yang sah. Untuk ring kedua hingga kesembilan, semua syarat resmi harus diverifikasi: Sync progress memenuhi bottleneck (Gap kurang dari 10 poin persentase), `Day left` tepat `0`, interval minimum telah dipenuhi melalui waktu normal di luar Kultivasi, ring target tersedia dan diperoleh secara sah, item wajib tersedia, kondisi tubuh memenuhi persyaratan yang berlaku, dan semua syarat resmi lain terpenuhi. **Kultivasi tidak pernah mengurangi `Day left`, sekalipun Sync progress mencapai cap selama time skip.** Ketersediaan ring fisik tidak sama dengan kelayakan karakter; profil dapat menunjukkan `eligible` meski belum ada ring target di lokasi, tetapi proses tidak dapat selesai tanpa ring yang benar-benar tersedia.

Jika status `not eligible yet`, penyerapan tidak boleh berhasil hanya karena pemain mendesak, mengulang permintaan, atau menyatakan karakter memaksakannya. Jika karakter tetap mencoba, resolusikan sebagai **percobaan penyerapan paksa yang tidak memenuhi syarat**: jangan menambah jumlah ring, Qi, slot terisi, atau Spirit Realm; gunakan formula deviasi/damage di §5.1–§5.5 bila kondisi pemicunya tercakup, serta `core/INJURY_SYSTEM.md` untuk mengklasifikasikan cedera berdasarkan bukti kejadian. Formula numerik yang ada terutama mengatur deviasi terkait Gap dan pelanggaran jeda. Jika hard gate gagal, peluang keberhasilan penyerapan adalah 0% dan tidak boleh ada penambahan ring, Qi, slot terisi, atau Spirit Realm. Gunakan §6.1 untuk risiko kecacatan hanya jika percobaan penyerapan yang nyata memang dimulai; untuk pelanggaran yang tidak menghasilkan proses penyerapan aktual, jangan mengarang damage atau hukuman permanen. Kondisi kritis, ancaman kematian, atau kerusakan struktural permanen boleh terjadi hanya bila didukung resolusi resmi dan kejadian—bukan sebagai hukuman otomatis karena pemain bersikeras.

1. Tentukan nomor ring yang sedang diserap dan persentase deviasi aktual (1–100%) dari §5.1.
2. Hitung kehilangan HP dasar memakai HP maksimum karakter, nomor ring, dan persentase deviasi sesuai §5.2.
3. Hitung Gap dan periksa jeda minimum. Jika ada pelanggaran, pilih satu pengali menurut §5.4; jangan menumpuk pengali.
4. Kalikan kehilangan dasar dengan pengali, lalu bulatkan sesuai aturan.
5. Terapkan damage HP: kehilangan aktual tidak boleh melebihi HP saat ini dan HP tidak boleh turun di bawah 0.
6. Tentukan kategori risiko dari kehilangan HP aktual menggunakan §5.3.
7. Catat nomor ring, persentase deviasi, kehilangan dasar, pengali dan alasannya, kehilangan HP akhir/aktual, kategori risiko, cap kompatibilitas ring berikutnya yang berkurang, serta cedera dan kondisi tubuh yang terjadi.
8. Pengurangan cap kompatibilitas ring berikutnya dan durasi pemulihan belum memiliki formula numerik. Catat bahwa keduanya belum ditentukan; jangan menyimpulkan angkanya dari tabel damage.

Jika penyerapan gagal, jangan menambahkan ring ke jumlah yang dimiliki. Terapkan konsekuensi kegagalan dan deviasi sesuai kejadian yang benar-benar terjadi.

Penyerapan paksa tidak memberi bonus kompatibilitas atau keberhasilan. Penyerahan sukarela yang benar-benar sah hanya memberi pengaruh `V` yang sudah tercantum di §6.1; pengaruh tersebut tidak menjamin keberhasilan, Sync 100%, atau menghapus tekanan usia dan AWR. Jangan menerapkan bonus sukarela tambahan di luar formula §6.1.
### 5.6. Pembentukan dan kombinasi kemampuan Spirit Ring

Kemampuan yang diperoleh dari Spirit Ring terbentuk melalui interaksi antara **Martial Soul yang sudah dimiliki**, karakteristik Spirit Beast/ring yang diserap, rumusan atau formulasi kemampuan, serta hasil sinkronisasi. Spirit Ring memperluas atau mengombinasikan kemampuan Martial Soul; hasilnya tidak harus menjadi salinan langsung kemampuan Beast.

- **Kombinasi mengikuti fondasi yang ada.** Pertimbangkan bentuk, sifat, dan hal-hal yang memang dapat dilakukan Martial Soul; karakteristik Beast/ring; rumusan kemampuan yang digunakan; serta tingkat keberhasilan dan sinkronisasi penyerapan.
- Contoh: Martial Soul berupa **Pedang Es** menyerap Spirit Ring dari Spirit Beast bertipe api. Setelah rumusan dan sinkronisasi yang sesuai, hasilnya mungkin berupa teknik pedang yang memadukan es dan api, serangan langsung, efek jarak jauh, gangguan mental, fungsi utilitas, atau kombinasi lain yang masuk akal. Ini contoh kemungkinan, bukan kemampuan yang otomatis diperoleh atau dijamin berhasil.
- Bentuk hasil dapat berupa serangan langsung, serangan mental, pertahanan, mobilitas, pengendalian, pendeteksian, dukungan, utilitas, atau fungsi lain. Daftar ini bersifat ilustratif dan **tidak membatasi kemungkinan kombinasi**.
- Perbedaan atau pertentangan unsur tidak otomatis melarang kombinasi, tetapi juga tidak menjamin hasil hibrida yang kuat. Pertimbangkan karakteristik nyata Martial Soul dan ring, rumusan, kompatibilitas, sinkronisasi, risiko deviasi, serta kejadian yang tercatat.
- Jangan menganggap setiap ring pasti memberikan satu kemampuan dengan bentuk standar yang sama. Jangan pula menganggap ring dengan Beast yang sama selalu menghasilkan kemampuan identik pada Martial Soul yang berbeda.
- Umur atau tier ring saja tidak cukup untuk menentukan kemampuan akhir. Jangan menyimpulkan bahwa ring yang lebih tua pasti menghasilkan kemampuan yang lebih cocok, lebih serbaguna, atau lebih kuat.
- Jenis kemampuan tidak dibatasi oleh daftar contoh, tetapi setiap hasil individual tetap harus konsisten dengan sumber ring, Martial Soul, rumusan, sinkronisasi, dan hasil penyerapan. “Kemungkinan tidak terbatas” berarti tidak ada katalog bentuk yang tertutup—bukan berarti karakter bisa mendapatkan efek apa pun tanpa sebab.
- Bila rumusan, tingkat sinkronisasi, atau detail hasil yang dibutuhkan belum ditetapkan, GM harus menanyakan atau menyelesaikan bagian yang diperlukan melalui mekanik resmi yang tersedia. Jangan mengarang persentase keberhasilan, biaya, statistik, cooldown, atau efek permanen baru.
- Setelah penyerapan berhasil, catat deskripsi kemampuan yang benar-benar terbentuk dalam bagian Teknik / Kemampuan atau deskripsi Martial Soul yang sudah ada. Jangan menambah field profil baru hanya untuk kombinasi ring.


## 6. Rumus Kompatibilitas, Power Scale, dan Qi

### 6.1. Formulasi Terpadu Penyerapan, Sync, Kecacatan, dan AWR

Bagian ini adalah **satu-satunya otoritas numerik** untuk tekanan usia Spirit Beast, cap Sync, peluang keberhasilan Penyerapan Spirit Ring, risiko kecacatan permanen, dan Anomalous World Rejection (AWR). Formula tier-gap, bonus combat/metode, dan formula penyerahan sukarela dari versi lama di bawah §6.1 **dicabut sepenuhnya** dan tidak boleh dipakai bersama formula baru. Jangan menghitung keuntungan yang sama dua kali.

Istilah tingkat kultivasi yang dipakai hanya **Spirit Realm**. Sembilan nama kanonisnya tetap: Spirit Initiate, Spirit Adept, Spirit Elder, Spirit Monarch, Spirit King, Spirit Ancestor, Spirit Emperor, Spirit Sovereign, dan Spirit Primordial.

#### A. Tekanan usia dan toleransi Spirit Realm

Gunakan usia aktual Spirit Beast dalam tahun, bukan Age Grade sebagai pengganti usia.

`B(Y) = 10 × log10(1 + Y/10)`

Y = usia aktual Spirit Beast dalam tahun. Toleransi:

| Spirit Realm | R | Toleransi T_R |
|---|---:|---:|
| Spirit Initiate | 1 | 30,99 |
| Spirit Adept | 2 | 32,99 |
| Spirit Elder | 3 | 34,99 |
| Spirit Monarch | 4 | 36,99 |
| Spirit King | 5 | 38,99 |
| Spirit Ancestor | 6 | 40,99 |
| Spirit Emperor | 7 | 50,99 |
| Spirit Sovereign | 8 | 52,99 |
| Spirit Primordial | 9 | 54,99 |

Rumus umum yang menghasilkan tabel:

- R = 1–6: `T_R = 46,99 − 2 × (9 − R)`
- R = 7: `T_R = 50,99` — jembatan khusus dengan bonus toleransi +8 dibandingkan kelanjutan nilai dasar.
- R = 8: `T_R = 52,99`
- R = 9: `T_R = 54,99`

Tekanan berlebih: `X = max(0, B(Y) − T_R)`.

| Tekanan X | EAG | Makna |
|---:|---:|---|
| X = 0 | 0 | Tidak ada tekanan usia di atas toleransi |
| 0 < X ≤ 6 | 1 | Penolakan ringan |
| 6 < X ≤ 12 | 2 | Penolakan berat |
| X > 12 | 3+ | Penolakan ekstrem |

Untuk perhitungan, gunakan `E_eff = X/6` secara kontinu pada semua nilai X. EAG tetap menjadi klasifikasi risiko diskret, sedangkan E_eff mempertahankan kenaikan tekanan yang halus tanpa loncatan peluang tepat di batas EAG 1/2/3+.

**Hard cap Sync:** jika EAG = 2, cap Sync `C_i` tidak boleh melebihi **20%**, walaupun rumus cap mentah menghasilkan angka lebih tinggi. Jika EAG 3+, cap tetap mengikuti rumus cap di bawah dan dapat turun sampai 0%. EAG 2 bukan jaminan gagal, tetapi keberhasilan tidak menghapus batas Sync 20%.

#### B. Agresivitas, kesiapan, dan koreksi kompatibilitas

Tetapkan input berikut dari bukti aktual sebelum menghitung:

- **G — Agresivitas Spirit Beast (0–5):** 0 = penyerahan sukarela yang sungguh-sungguh atau tidak ada perlawanan; 1 = tenang; 2 = menolak; 3 = melawan aktif; 4 = mengamuk/bermusuhan; 5 = perlawanan ekstrem yang berusaha menghancurkan penerima. Nilai ini adalah perilaku saat menjadi Spirit Ring, bukan sekadar kategori atau output kekuatan Beast.
- **P — Kesiapan penerima (0–100):** kondisi tubuh, Satiety, kecukupan Qi, kondisi Martial Soul, dan kualitas metode penyerapan. 0 = tidak siap sama sekali; 50 = kesiapan sedang; 100 = persiapan optimal. Nilai harus mengikuti state dan kejadian nyata, bukan bonus gratis.
- **F — Koreksi resonansi Martial Soul (−15 sampai +15):** hanya untuk kecocokan spesifik antara Martial Soul penerima dan karakteristik Spirit Ring. Nilai negatif menunjukkan konflik yang terbukti; nilai positif menunjukkan resonansi yang terbukti. Kondisi Martial Soul sudah termasuk dalam P, sehingga F tidak boleh menghitung ulang kondisi tubuh atau kesiapan.
- **V — Penyerahan sukarela sah (0 atau 1):** 1 hanya jika Spirit Beast secara sadar dan sungguh-sungguh menyerahkan Spirit Ring sebagai bagian dari jiwanya; menyerah karena kalah, terikat, tertipu, terpaksa, atau tidak mampu melawan berarti V = 0.

Penyerahan sukarela menurunkan agresivitas yang teramati bila memang tidak ada perlawanan, tetapi **tidak menghapus tekanan usia atau AWR**.

#### C. Cap kompatibilitas Sync untuk ring yang sedang diproses

Hitung cap mentah:

`C_raw = clamp(100 − 25E_eff − 3G − 0,5X + 0,10(P − 50) + F + 20V, 0, 100)`

Cap kompatibilitas ring:

`C_i = min(C_raw, 20)` bila EAG = 2; selain itu `C_i = C_raw`.

`clamp(x, min, max)` membatasi hasil pada nilai minimum dan maksimum. Bulatkan hasil akhir ke bilangan bulat terdekat; nilai tepat x,5 dibulatkan ke atas. `C_i` adalah cap Sync progress untuk ring itu, bukan peluang berhasil. Format profil wajib: `Sync progress: [progres saat ini]%/[C_i]%`.

Jika penyerapan gagal, ring tidak ditambahkan dan C_total/PowerScale state tidak diperbarui seolah-olah ring berhasil dimiliki. Catat C_i sebagai hasil perhitungan percobaan saja. Jika berhasil, C_i menjadi cap ring terbaru dan kompatibilitas keseluruhan diperbarui menurut §6.2.

#### D. Peluang keberhasilan Penyerapan Spirit Ring

Peluang ini hanya dipakai setelah semua hard gate kelayakan resmi lulus. Jika karakter berstatus `not eligible yet`, syarat Awakening/jeda/bottleneck/item wajib tidak terpenuhi, atau ring tidak tersedia secara sah, peluang keberhasilan adalah **0%**; jangan mengundi keberhasilan untuk melewati prasyarat. Percobaan paksa tetap ditangani menurut §5.5 dan aturan cedera yang relevan.

Untuk percobaan yang memenuhi syarat:

`P_success = clamp(95 − 15E_eff − 5G + 0,15(P − 50) + F + 10V, 5, 95)`

Hasil adalah persen. Batas 5–95% berlaku hanya pada percobaan yang layak; hard gate gagal selalu berarti 0%. Keberhasilan tidak berarti Sync penuh, tidak melewati cap C_i, dan tidak otomatis memberi penguasaan kekuatan ring 100%.

#### E. Risiko kecacatan Martial Soul permanen

Hitung peluang kecacatan **dengan syarat penyerapan yang layak telah gagal**:

`P_defect_fail = clamp(5 + 10E_eff + 5G + 0,5X − 0,3P, 1, 95)`

Lalu peluang kecacatan permanen keseluruhan dari percobaan layak:

`P_defect = ((100 − P_success)/100) × P_defect_fail`

`P_defect_fail` dan `P_defect` dinyatakan dalam persen. Gunakan `P_defect` sebagai peluang keseluruhan kecacatan permanen; gunakan `P_defect_fail` hanya jika perlu menjelaskan peluang kecacatan dengan syarat kegagalan sudah terjadi. Notasi ini dibedakan dari `D`, yang di §5 berarti persentase deviasi. Kegagalan tidak otomatis menyebabkan kecacatan permanen. Cedera sementara, kerusakan berat, dan kecacatan permanen adalah hasil berbeda yang harus diselesaikan sesuai formula, aturan injury, dan bukti kejadian. Jangan mengarang hukuman permanen di luar hasil mekanik ini.

#### F. Anomalous World Rejection (AWR)

AWR adalah risiko penolakan dunia terhadap keberadaan Spirit Beast yang terlalu ekstrem saat eksistensinya dijadikan Spirit Ring. Ini **bukan** penolakan tubuh penerima dan bukan sinonim kegagalan penyerapan. Periksa AWR hanya ketika Beast yang benar-benar berusia **lebih dari 7.000.000 tahun** memasuki proses konversi/penyerapan Spirit Ring; usia 7 juta tahun atau kurang memiliki AWR = 0%.

`Q = (Y − 7.000.000)/1.000.000`

Tentukan tingkat penolakan `S`: EAG 0 = 0; EAG 1 = 1; EAG 2 = 2; EAG 3+ = 3; gunakan S = 4 bila X > 18, sebagai penolakan ekstrem.

`P_AWR = min(75, Q × (15 + 3G + 3S))`

Hasil adalah persen. Formula meningkat secara berkelanjutan setelah ambang 7 juta tahun dan dikalibrasi agresif: usia, agresivitas, serta tekanan penolakan dapat menaikkan AWR dengan cepat ketika usia jauh melampaui ambang. Kesiapan P dan penyerahan sukarela V tidak menghapus AWR. Batas 75% adalah batas kalibrasi, bukan jaminan bahwa setiap kejadian akan terjadi atau bahwa dunia kebal di atasnya.

Jika pemeriksaan AWR terpicu, selesaikan sebagai pemeriksaan kejadian anomali yang terpisah dari hasil penyerapan. AWR terpicu **tidak otomatis membuka gerbang dunia**; pembukaan gerbang memerlukan eskalasi kejadian yang sesuai dengan canon anomali di `world/HISTORY.md` dan keputusan canon terkait. Jangan mengarang peluang pembukaan gerbang yang belum ditetapkan, dan jangan mengubah AWR menjadi konsekuensi otomatis hanya karena Beast berusia lebih dari 7 juta tahun.

#### G. Alur wajib untuk setiap percobaan

1. Verifikasi status `Spirit Ring Absorption`, Awakening, slot, ring yang tersedia, item wajib, bottleneck, jeda, kondisi tubuh, dan seluruh prasyarat yang berlaku.
2. Tentukan usia aktual Y, Spirit Realm R, G, P, F, dan V dari bukti yang tersedia. Jika input tidak diketahui, jangan menyatakannya sebagai fakta; lakukan appraisal/penilaian yang sah atau tandai hasil sebagai belum dapat dihitung.
3. Hitung B(Y), T_R, X, EAG, dan E_eff.
4. Hitung C_i sebagai cap Sync potensial untuk ring yang sedang diproses.
5. Jika semua hard gate lulus, hitung P_success dan lakukan resolusi peluang sesuai prosedur mekanik yang berlaku. Jika gagal, hitung D dan P_defect; tentukan cedera aktual dengan aturan resmi tanpa menganggap kecacatan permanen otomatis.
6. Jika Y > 7.000.000 tahun dan konversi/penyerapan benar-benar dimulai, periksa P_AWR secara terpisah. Catat hasil anomali dan eskalasinya jika terjadi; jangan menyamakan pemicu AWR dengan pembukaan gerbang.
7. Jika penyerapan berhasil, baru tambahkan ring, perbarui C_total, AgeTotal, PowerScale, Qi, waktu penyerapan, kemampuan, dan state terkait. Terapkan batas Sync C_i; jika EAG = 2, cap maksimal 20%.
8. Catat semua input, hasil perhitungan, hasil keberhasilan/kegagalan, risiko kecacatan, pemeriksaan AWR, dan state yang benar-benar berubah agar GM berikutnya dapat merekonstruksi hasil yang sama.

Jika suatu input numerik tidak dapat dibuktikan, jangan mengarang nilai yang presisi. Formula ini menggantikan penuh formula cap kompatibilitas lama di §6.1; formula C_total, AgeTotal, PowerScale, Qi, warna ring, jeda, bottleneck, dan deviasi pada bagian lain tetap berlaku kecuali secara eksplisit disesuaikan di sini.

### 6.2. Kompatibilitas keseluruhan semua ring

Setelah setiap ring berhasil diserap, hitung ulang kompatibilitas keseluruhan dari seluruh ring yang dimiliki. Gunakan rata-rata geometrik agar kompatibilitas rendah pada satu ring tetap berpengaruh dan tidak tertutup sepenuhnya oleh ring lain:

**C_total = (C₁ × C₂ × … × Cₙ)^(1/n)**

Jika salah satu Cᵢ bernilai 0, C_total juga 0. Jangan menghilangkan kompatibilitas ring lama saat ring baru diperoleh.

### 6.3. Power scale

Catat usia ring Aᵢ dalam tahun. Jumlahkan usia seluruh ring yang telah berhasil diserap:

**AgeTotal = A₁ + A₂ + … + Aₙ**

Hitung power scale ring dengan usia sebagai faktor dominan dan kompatibilitas keseluruhan sebagai faktor pengubah yang lebih kecil:

**PowerScale = AgeTotal × (0,50 + 0,50 × C_total / 100)**

Artinya, usia seluruh ring dan kompatibilitas keseluruhan sama-sama menjadi faktor utama PowerScale: usia membentuk dasar, sementara C_total mengubah hasil dalam rentang 50%–100% dari AgeTotal. Contoh: C_total 80 menghasilkan pengali 0,90; C_total 50 menghasilkan 0,75; C_total 0 tetap menghasilkan 0,50 agar kompatibilitas rendah tidak menghapus kontribusi usia ring sepenuhnya. Tier Beast memengaruhi PowerScale melalui cap kompatibilitas, bukan sebagai pengali usia tambahan. Jangan menyamakan dua karakter hanya karena jumlah ringnya sama: usia dan kompatibilitas ring mereka bisa berbeda. PowerScale adalah indeks perbandingan kekuatan dari sistem ring, bukan otomatis angka damage atau jaminan menang dalam pertarungan.

### 6.4. Qi berdasarkan jumlah ring

Qi adalah sumber daya yang muncul setelah ring pertama berhasil diserap. Sebelum awakening, mortal memiliki **Qi = 0** dan menggunakan stamina. Setelah awakening tetapi sebelum ring pertama diserap, catat **Qi: belum terbentuk (belum ada cincin)**, bukan nilai Qi positif. Setelah ring pertama berhasil diserap, Qi dasar dimulai dari 100.

Untuk Qi dasar berdasarkan jumlah ring n, gunakan pertumbuhan geometrik berikut:

**Qiₙ = round(100 × 452341^( (n − 1) / 8 ))**

Nilai acuan yang dibulatkan:

| Jumlah ring berhasil diserap | Qi dasar |
|---:|---:|
| 1 | 100 |
| 2 | 509 |
| 3 | 2.593 |
| 4 | 13.207 |
| 5 | 67.256 |
| 6 | 342.504 |
| 7 | 1.744.213 |
| 8 | 8.882.449 |
| 9 | 45.234.100 |

Dengan demikian, pemilik sembilan ring memiliki Qi dasar tepat **45.234.100**. Qi mengikuti jumlah ring yang benar-benar berhasil diserap; jangan menaikkan Qi hanya karena karakter membuka slot Spirit Realm atau mengalahkan Beast. Usia ring dan kompatibilitas dihitung dalam PowerScale terpisah, sehingga Qi dasar tidak disalahartikan sebagai ukuran tunggal kekuatan tempur.

### 6.5. Wajib dicatat setelah setiap penyerapan

Setiap kali ring berhasil diserap, GM harus menyatakan nomor ring terbaru dan jumlah total ring yang kini dimiliki, lalu mencatat usia, warna (jika diketahui), sumber/tier Beast, kemampuan yang diperoleh, cap kompatibilitas Cᵢ, C_total yang diperbarui, AgeTotal, PowerScale, Qi, dan waktu penyerapan. Catat pula item wajib yang digunakan dan seluruh deviasi, damage HP, serta cedera jika terjadi. Jika input formula belum diketahui, tandai input itu sebagai belum diketahui dan jangan berpura-pura hasilnya presisi.

## 7. Pencatatan Profil

Jangan menambahkan field profil terpisah bernama Spirit Rings atau Law.

Jumlah slot mengikuti Spirit Realm. Informasi ring yang telah diperoleh—sumber, usia, warna, kemampuan, dan hasil proses yang diketahui—dicatat dalam bagian Teknik / Kemampuan atau deskripsi Martial Soul yang sudah ada. Jangan memberikan kemampuan ring sebelum ring benar-benar berhasil diserap.

## 8. Konsistensi Sumber

- Gunakan modul ini untuk mekanik Spirit Ring.
- Gunakan `core/CULTIVATION_SYSTEM.md` untuk Spirit Realm, Stage, progres, bottleneck, dan breakthrough.
- Gunakan `core/MARTIAL_SOUL.md` untuk Martial Soul dan awakening.
- Gunakan `bestiary/SPIRIT_BEAST_RULES.md` ketika modul tersebut tersedia untuk rincian Spirit Beast.
- Jangan mengubah keputusan dalam modul ini hanya karena WORLD.md tidak memuat setiap detail mekanik.
- Jika aturan baru bertentangan dengan aturan ini, tandai konflik dan minta keputusan pemilik; jangan menghapus aturan yang sudah disepakati secara diam-diam.



---

<!-- SOURCE core/TIER_ASSESSMENT_AND_APPRAISAL.md | upstream blob 74f3ecdf2c6d01635b50bab1dfd0acd954abfead -->

# Merzkava Universe — Universal Tier Assessment & Appraisal

**Authority and scope:** This module governs *specialist fallback classification* for goods, artifacts, creatures, and the worldwide appraisal authority. It is not a mandatory step in routine pricing, purchases, sales, or consumption. Ordinary goods are handled first through the economic quality categories and pricing method in `core/10_ECONOMY_SYSTEM.md`; Martial Soul score calculation and its integration with awakening rarity/mutation chances are governed separately by `core/MARTIAL_SOUL_AWAKENING.md`. This module never replaces a known canon classification or the ordinary economic pricing formula.

## Display rule for unidentified items

When an item's identity, exact type, or relevant properties have not yet been established by canon or the GM, display the item as ``Unknown`` **membutuhkan appraisal untuk lebih pastinya** wherever the player-facing item name/details are shown. Use this exact wording consistently in Inventory, Equipment, loot, item descriptions, and appraisal-related gameplay narration. Do not use this label for ordinary items whose identity and relevant details are already established. The label does not imply rarity, value, danger, a hidden power, or guaranteed appraisal success. Keep the actual unknown facts unresolved until valid evidence or appraisal establishes them. After appraisal, replace the label only for the facts the ruling actually establishes; any remaining unknown properties stay undisclosed/unconfirmed.

**Explicit exclusion — Martial Soul:** This item-identification display rule does **not** apply to Martial Souls. Never label a Martial Soul ``*Unknown*`` under this rule, and do not use the generic item/beast appraisal score or item-appraisal wording to resolve its identity, score, rarity, or uncertainty. Follow `core/MARTIAL_SOUL_AWAKENING.md` and `core/MARTIAL_SOUL.md` for Martial Soul-specific handling. This exclusion does not change any Martial Soul awakening, scoring, rarity, or mutation mechanics.

## 1. Priority Order

1. **Existing official canon:** use the exact tier recorded by the relevant official module, catalog, approved discovery, or owner-confirmed canon decision. Do not recalculate it.
2. **Completed MAA ruling:** when this exact specimen/item has actually been examined, its valid ruling takes priority over estimates, seller claims, rumors, and ordinary records.
3. **Routine economic classification:** for ordinary goods whose description and market role are clear (for example, standard roadside food, basic snacks, common materials, or ordinary herbs), use the fitting category in `core/10_ECONOMY_SYSTEM.md` and its pricing formula. This is a practical market classification, not a specialist appraisal; do not run the nine-dimension score or demand an MAA record just to complete an everyday transaction.
4. **GM provisional assessment:** use the scoring method below only when a meaningful unresolved classification is needed for a special, unusual, disputed, or consequential item/specimen and there is enough concrete evidence. Mark the result ``*Prediksi GM*``, never official canon.
5. **Insufficient evidence:** if a special classification is genuinely necessary but evidence is inadequate, record ``*Tier belum ditetapkan*`` — bukti belum cukup and arrange appraisal when practical. Do not fabricate facts to force a score.

An appraisal ruling concerns only the specific examined specimen, batch, or item identity. It does not automatically establish the tier of every member of a species, every artifact of the same model, or every object with a similar name. The need for a specialist classification depends on the scene and the item's significance; routine pricing or consumption alone does not trigger it.

## 2. Universal Provisional Score

Use a total from **0–134 points**. Score each of the nine dimensions from **0–15**, using only observed, documented, or reliably tested evidence; then cap a total of 135 at 134. Do not award points merely because a detail is unknown, rumored, ancient-looking, expensive, or described as rare.

| Dimension | What to evaluate |
|---|---|
| 1. Effect / practical impact | Demonstrated usefulness, harm, protection, or influence |
| 2. Potency | Strength, efficiency, or intensity of the demonstrated effect |
| 3. Scope | Reach, area, number of targets, or scale of influence |
| 4. Complexity | Technical, biological, spiritual, or operational complexity supported by evidence |
| 5. Resilience | Durability, endurance, stability, or resistance to failure |
| 6. Autonomy | Independent operation, self-directed behavior, or sustained function |
| 7. Adaptability | Ability to respond to different conditions or situations |
| 8. Special properties | Verified unusual properties not already counted in another dimension |
| 9. Verified exceptional evidence | Direct test results, provenance, or corroborated records that establish a higher/lower classification beyond the dimensions above |

**Scoring discipline**
- Score only dimensions relevant to the subject. For a dimension that truly does not apply, write N/A and exclude it from the average; do not treat absence of evidence as proof of weakness.
- Each applicable dimension is scored 0–15: 0 = tested/verified negligible; 1–3 = minor; 4–6 = limited; 7–9 = substantial; 10–12 = very high; 13–15 = exceptional within the relevant comparison class.
- Calculate the **mean of applicable dimensions**, multiply by 9, and round to the nearest whole number; cap the result at 134. This normalizes subjects with different relevant dimensions onto one common 0–134 scale.
- If fewer than three dimensions have reliable evidence, do not issue a numerical prediction. If a special classification is needed, mark **Tier belum ditetapkan — bukti belum cukup; appraisal diperlukan**. Do not use this fallback for ordinary goods that can be priced through the routine economic categories.
- Do not double-count one feat across several dimensions. Record the evidence behind each score.
- For beasts, assess demonstrated capability, threat, defenses, range, behavior, and special abilities; the name/category alone does not determine a score. For items, assess actual function, effectiveness, construction, stability, operation, and verified properties.
- This score is a fallback classification aid, not a combat formula, economic price formula, Martial Soul tier, Spirit Realm, Spirit Ring tier, Arcanist Grade, age rating, or rarity/quantity rating.

## 3. Tier Bands

| Score | Provisional tier |
|---:|---|
| 0–14 | Tier 1 |
| 15–29 | Tier 2 |
| 30–44 | Tier 3 |
| 45–59 | Tier 4 |
| 60–74 | Tier 5 |
| 75–89 | Tier 6 |
| 90–104 | Tier 7 |
| 105–119 | Tier 8 |
| 120–134 | Tier 9 |

Example: a valid score of 68 gives ****``*Tier 5*`` (``*Prediksi GM*`` · 68 poin)****. This is not an official ruling until an authorized appraisal is completed or canon is updated.

## 4. World Appraisal Institution

The worldwide institution is the **Merzkava Appraisal Authority (MAA)**, commonly called the **Appraisal Office** or **Kantor Appraisal**. Its service is recognized throughout the world: every settled region can access appraisal through a branch, accredited local desk, scheduled examiner route, or referral to a mobile specialist. Major powers and established settlements have recognized service points; remote villages, dangerous frontiers, hidden territories, and unusual specimens are served through field examiners or specialist referrals. Worldwide availability does not guarantee an office building in every village or immediate service at every location.

The MAA may examine and classify when specialist identification or a formal ruling is warranted:
- goods with disputed, unusual, hidden, or mechanically consequential quality;
- Relics, Ancient Artifacts, Artificial Artifacts, unidentified objects, and unusual loot;
- beasts/specimens whose identity, threat, mutation, or classification materially matters to the scene; use the canonical Beast categories and behavioral baselines in `bestiary/SPIRIT_BEAST_RULES.md` (Ordinary Beast, Spirit Beast, Supreme Beast, Demonic Beast, and Heavenly Beast);
- rarity, mutation, or corruption are additional traits, not automatic replacements for a Beast's main category;
- Martial Souls, referred to the specialist procedure in `core/MARTIAL_SOUL_AWAKENING.md` rather than the generic goods/beast score.

This service list does not require routine appraisal of every meal, ordinary herb, common material, or everyday purchase. Such goods use the relevant market's normal economic category unless concrete evidence makes their quality or identity meaningfully uncertain.

### Appraisal procedure
1. Register the specimen/item and its provenance when known.
2. Check official catalogs and existing canon first.
3. Examine, test, compare, and record evidence without assuming an unknown property.
4. Issue a written or sealed appraisal record with identity, category, assigned tier, evidence basis, confidence/limitations, examiner/office, date, and record identifier.
5. For dangerous, divine, concealed, sentient, or high-risk objects/specimens, apply containment and specialist referral appropriate to the established scene; do not invent a guaranteed safe test.

### Authority of a completed ruling
A valid MAA ruling is the **highest-priority classification for the specific examined subject** when prior canon had no definitive tier or was explicitly uncertain. For Martial Souls, the examiner must use the dedicated Martial Soul method in `core/MARTIAL_SOUL_AWAKENING.md`; the MAA must not derive classification from the generic item/beast score or overwrite an actual rarity draw. Use only the six official rarity terms: Common, Uncommon, Rare, Epic, Legendary, or Myth. In gameplay, characters, markets, guilds, institutions, and GM logs must use the ruling for the specific examined subject. It cannot be casually contradicted by a seller, rumor, or fresh GM estimate.

The ruling does not grant ownership, prove lawful provenance, reveal every hidden function, guarantee safety, or override unrelated mechanics. If strong new evidence suggests fraud, specimen substitution, contamination, a damaged state, or examiner error, record the discrepancy and seek formal re-examination; do not silently discard the ruling. Existing owner-confirmed canon remains unchanged unless the owner explicitly revises it.

### Fees and access
The institution is a recognized worldwide service, but exact fees, service times, office addresses, political ownership, and the availability of specialist examiners are not globally fixed unless a local source establishes them. Do not invent a price or claim an office is immediately accessible. A character may seek an office, request a field examiner, or be referred to a specialist; resolve travel, cost, risk, and waiting time from the actual scene and relevant rules.

## 5. Logging Format

- Canon tier known: **Tier 6 (Kanon: [source])**.
- Routine ordinary good: **Kategori ekonomi Tier 1 (barang umum; dasar: [deskripsi/pasar])** — no specialist appraisal implied.
- Provisional GM result when a special classification is needed: **Tier 5 (Prediksi GM · 68 poin; bukti: [ringkasan])**.
- Insufficient evidence for a necessary special classification: **Tier belum ditetapkan — bukti belum cukup; appraisal dapat diperlukan**.
- Official appraisal completed: **Tier 5 (Appraisal resmi MAA · [ID catatan])**.

For an appraisal-related state change or discovery, record the event in the appropriate gameplay/loot/item ledger. The ledger records what was actually examined and ruled; it does not itself make a GM estimate official. Do not change the tier of previously recorded items or creatures unless the ruling applies to that exact subject or the owner confirms a canon update.



---

<!-- SOURCE gameplay/COMBAT_SYSTEM.md | upstream blob bc7d85a0e3521c30716b1859f5fdf070417d684c -->

# Merzkava Universe — Combat System

**Status:** Combat baseline v1.  
**Purpose:** Give the GM one repeatable method for resolving varied fights without inventing abilities or overloading every scene with calculations.

## 1. Core Rules

**Player-facing result formatting:** whenever a resolved combat outcome or formula-derived combat value is reported, wrap the final result in four asterisks on both sides, using `****<hasil final>****`. This includes hit/miss, initiative roll outcome, hit chance/roll outcome, damage, HP loss, injury severity/classification, and final combat status. Apply the universal classification-label format from `templates/GAMEPLAY_RESPONSE_TEMPLATE.md` to any displayed tier, grade, quality, or similar label.

- Use this module for combat resolution, `core/SPIRIT_RING_RULES.md` for PowerScale/Qi, `core/HP_SYSTEM.md` for maximum HP, `core/INJURY_SYSTEM.md` for injury classification and recovery, `gameplay/TIME_AND_ACTION_RULES.md` for elapsed time, and `core/HUNGER_AND_METABOLISM.md` for Satiety.
- PowerScale is a baseline comparison, not a guaranteed hit or victory.
- A turn is a combatant's opportunity to perform **one declared action**, not a limit of one physical hit. One action may contain multiple strikes or a combo when the move, declared intent, and circumstances support them.
- Use §5 for the default combo rule. Do not invent additional hits, damage bonuses, techniques, equipment, resource costs, or effects beyond that rule or a documented ability.
- Resolve actions in order and apply consequences. Do not decide the whole fight with one roll.
- Death is permanent unless an established official mechanic says otherwise.

## 2. Resolve Each Turn

Follow this short sequence:

1. **Initiative:** Respect an attack already underway, an ambush, or a clear established advantage. If neither side has initiative, both roll virtual d100; higher result acts first, ties reroll.
2. **Action and feasibility:** Identify the declared action, its target, range, required ability, current resources, and whether the character can perform it in the current situation.
3. **Compare combat readiness:** Use the PowerScale baseline and only relevant, evidenced advantages or disadvantages. Do not count the same advantage twice.
4. **Resolve the action:** Determine hit/miss, defense, damage, and any documented special effect.
5. **Update state:** Record HP/Qi or stamina changes, injuries, position, equipment, and elapsed time when they actually change. If awake time passes, resolve Satiety using `core/HUNGER_AND_METABOLISM.md`; if a protected night-sleep period occurs, keep Satiety locked for that period. Stop at a natural decision point.

Initiative determines who acts first; it does not guarantee a hit. A defender may block, evade, counter, or be interrupted only when the situation and established abilities support it.

## 3. Combat Rating and Hit Chance

When both characters have a valid PowerScale:

**Combat Rating = PowerScale × Readiness Factor × Relevant Artifact Factor**

- **Readiness Factor:** choose one overall factor based on current usable energy, applicable technique, equipment, and tactical position.
- Use **0.80** for a clear severe disadvantage, **0.90** for a disadvantage, **1.00** when neither side has a clear evidenced advantage, **1.10** for an advantage, and **1.20** for a decisive advantage.
- This is one combined assessment, not a separate bonus for each category. Do not add another multiplier or accuracy bonus for the same facts.
- **Relevant Artifact Factor:** use **1.00** unless an owned, available artifact has a documented effect relevant to this specific action. A higher tier alone is not a universal combat bonus.
- Missing information is not proof of an advantage or disadvantage. If a missing key value prevents a fair comparison, do not claim an exact numeric result; resolve only what the evidence supports.

Calculate the ratio:

`R = Attacker Combat Rating / Defender Combat Rating`

**Hit chance = clamp(10%, 90%, 50% + 25% × (R − 1))**

Roll d100. The attack hits if the roll is at or below the hit chance. If the combat rating cannot be calculated, do not invent a numeric hit chance; resolve the supported parts qualitatively.

## 4. Damage and Defense

Use the move's documented effect when it exists. If no specific damage value exists, use this baseline:

| Action type | Base damage |
|---|---:|
| Basic physical attack | 5% of target maximum HP |
| Trained combat technique | 8% |
| Spirit Ring ability or documented special technique | 12% |
| Documented high-output/decisive technique | 18% |

These are baseline classes, not permission to invent a move. Choose the lowest class that accurately fits the documented action. The 18% class requires a clearly established technique and sufficient ability/resources to use it.

**Power adjustment:** `Damage = Target Max HP × Base Damage % × clamp(0.50, 1.50, √R)`

Then apply only a defense that is actually present and relevant:

| Defense demonstrated against the attack | Reduction |
|---|---:|
| None or ineffective | 0% |
| Limited | 10% |
| Moderate | 25% |
| Strong | 40% |
| Exceptional, explicitly supported | 50% maximum |

Round final damage up to a whole HP; a successful damaging hit deals at least 1 HP. Record damage as `****HP lost: N (X% of target maximum HP)****`. Use target maximum HP as the damage base, but subtract the result from current HP. If current or maximum HP is unknown, do not fabricate it; consult `core/HP_SYSTEM.md`.

## 5. Multiple Hits and Combos

- One declared action can contain multiple hits. Never force every strike into a separate turn solely because the action contains more than one hit.
- **Default combo:** when the player declares a combo, or the established move clearly supports a chained attack, the first strike must hit to unlock **one bonus follow-up strike** in the same action. The character must have a plausible technique, opening, and physical ability to continue the chain; a combo label alone cannot bypass those requirements.
- Resolve the follow-up as a separate hit: make a separate hit roll using the same combat-rating method, then calculate its damage using **50% of the original strike's base-damage percentage** before the normal Power adjustment and applicable defense. Round damage normally; a successful damaging hit still deals at least 1 HP.
- The default rule grants at most **one bonus follow-up strike per declared action**. More hits or a different bonus are allowed only when a documented move or ability explicitly supports them. Do not stack an extra general damage bonus on top of the follow-up hit.
- If the opening strike misses, the default combo follow-up does not occur. A follow-up may be interrupted, blocked, or evaded only when the situation and established abilities support that response; resolve each strike and its consequences before continuing.
- For a documented multi-hit move, use its stated number of hits and effects instead of the default one-follow-up limit when the move explicitly provides a different rule. If its hit resolution is undefined, use the default rule where applicable and do not invent further precision.
- Control, piercing, area attacks, damage over time, healing, counters, and other special effects use their documented effects. Do not force them into a damage formula when their main effect is not HP damage.
- Do not apply a full single-target damage value to every target of an area attack unless its documented rules support that result.

## 6. Spirit Realm Difference and Injury

A fighter at a lower Spirit Realm can defeat an opponent at a higher Spirit Realm when the recorded situation and relevant advantages support it; Spirit Realm level alone does not determine the outcome.

When the combatants differ by **one Spirit Realm level**, a damaging hit from the higher Spirit Realm combatant is expected to cause at least a light injury to the lower Spirit Realm combatant. Record the injury supported by the event and classify it using `core/INJURY_SYSTEM.md`. This is an injury expectation, not a rule that every hit causes a severe or different injury. Injury severity depends on the attack mechanism, hit location, defense, actual circumstances, and documented effects—not HP loss alone. Avoiding injury requires clear evidence of an overall advantage that addresses all three:
1. Better equipment readiness.
2. More usable Qi/energy for the relevant action.
3. A meaningful Spirit Ring age/quality or relevant ability advantage.

Tactics and technique may contribute, but do not silently replace all three conditions. If the evidence is incomplete, apply at least a light injury and scale severity to the actual event. For all combat, use these cues rather than fixed HP thresholds: superficial bruising/abrasion or mild strain may support Class I; a deep wound, moderate sprain/burn, or tissue tear may support Class II; a clearly established fracture, dislocation, or major tendon/ligament damage supports Class III; a life-threatening wound, severe internal bleeding, organ damage, or severe poisoning supports Class IV only when the event supports that conclusion. If evidence is insufficient, mark the injury unclassified rather than inventing a diagnosis. For combos, assess each hit and their cumulative consequences; a later hit may worsen an existing injury or create another injury only when its mechanism supports that result. Do not infer injury class from damage numbers alone. Do not extrapolate the one Spirit Realm rule into an invented universal multiplier for larger Spirit Realm gaps.

## 7. PowerScale, Spirit Rings, and Arcanist

- PowerScale comes only from `core/SPIRIT_RING_RULES.md`; it already includes total Spirit Ring age and overall ring compatibility. Do not multiply those factors again.
- A Spirit Ring ability affects combat only through its established ability and actual use.
- The production chance matrix in `core/ARCANISTRY_AND_FORMULATION.md` governs artifact creation, **not** attack accuracy.
- Before applying an Artificial Artifact, confirm ownership/access, tier, documented function, limitations, and whether that function applies to the current action. Relics, Ancient Artifacts, and Artificial Artifacts remain distinct categories.
- If artifact effects or other required values are undefined, mark them unknown instead of making up a number.

## 8. State and Missing Rules

After each resolved action, update only changes caused by the action: current HP, usable Qi/stamina, injury, position, equipment, inventory, and time. Resolve Satiety for elapsed awake time using `core/HUNGER_AND_METABOLISM.md`; do not reduce it during protected night sleep. When an injury appears or changes, use `core/INJURY_SYSTEM.md` for its class, recovery requirements, and progress. Do not restore HP, refill resources, or remove consequences without an established cause.

If a rule or input is missing:
- Do not invent numerical precision or claim an undefined rule is official.
- Resolve the parts that are supported by the current sources.
- Keep undefined special damage or effects qualitative.
- Flag the missing rule so it can be added deliberately to this module later.

**GM quick check:** initiative → action feasibility → combat rating/hit → defense/damage/effects → state update.


---

<!-- SOURCE gameplay/TIME_AND_ACTION_RULES.md | upstream blob f4ad8b2e1afc0bc9ef25f8f9d97eb541ab7ea29f -->

# Merzkava Universe — Time and Action Rules

Status: Official gameplay procedure module.
Scope: Timestamp continuity, session calendar, action duration, protected night sleep, time skips, cultivation duration, and separation of meditation, cultivation, and Spirit Ring absorption.

## 1. Timestamp Format and Authority

The exact timestamp line format and its position in every gameplay response are defined only in `templates/GAMEPLAY_RESPONSE_TEMPLATE.md`. Do not create a second timestamp layout in this module. This module defines how to establish, advance, and validate the timestamp values.

- Fill every timestamp field with a concrete value once gameplay begins. Do not leave placeholders in a live gameplay timestamp.
- The displayed year and era are session-calendar details unless established as global canon. **If the player has not established a year, the GM must choose a concrete, plausible session year; do not wait for player confirmation.** This fills a session gap and does not establish global history.
- **New session without a prior timestamp:** establish one plausible starting timestamp, including year, era, season, date, weekday, weather, and local time. During this bootstrap, choose the session era randomly. The choice may be guided by the player's background, origin, or relevant world context when that makes the result more coherent, but it must remain a genuine GM selection rather than a deterministic era forced by the character's background.
- Era names may include, but are not limited to, **Era Naga Emas**, **Era Bulan Darah**, **Era Paus Surgawi**, and **Era Kebangkitan Raja**. These are illustrative options, not a closed canon list. The GM may select another era name that fits the world's established lore; do not invent detailed historical facts merely from the name.
- In the initial template, `Era ???` means the session era has not yet been selected. Replace it with the selected era before sending the first live gameplay response; never leave `Era ???` in an actual gameplay timestamp after bootstrap.
- Treat the chosen era as the fixed era for that session. Do not randomly reroll it on each turn or on recall. A session-era selection is a session starting context, not automatic authorization to rewrite global history or contradict established world chronology.
- **Continuing session:** use the last valid timestamp and era in the conversation as the sole starting point. Never reroll or restart the calendar or era merely because a new turn begins.
- If the player explicitly supplies a valid starting timestamp, use it unless it conflicts with already recorded events.
- If timestamps conflict, flag the conflict and do not silently overwrite established history.
- A session calendar created to fill a canon gap is a working session calendar, not automatically global world canon.

## 2. Working Calendar When No Canon Calendar Is Available

Use this consistent fallback only when no prior session calendar exists:

- 12 months per year; 30 days per month.
- Months 1–3: Semi.
- Months 4–6: Panas.
- Months 7–9: Gugur.
- Months 10–12: Dingin.
- Weekday cycle: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu, repeating continuously.

When a date passes day 30, advance to day 1 of the next month. After month 12, advance to the next year and month 1. Calculate weekday and season using the same session calendar. Do not replace an already established calendar mid-session. If an official calendar is later found to conflict, flag it instead of silently rewriting past timestamps.

## 3. Time Advancement and Weather

- Advance time only for actions or events that actually occur.
- Keep duration plausible for the action, travel, conversation, rest, transaction, or environmental event described.
- If no meaningful time passes, do not make an unexplained large time skip.
- When an action takes 20 minutes, advance the clock by 20 minutes and roll over the date only if necessary.
- Keep hour, date, weekday, month, season, and elapsed duration mathematically consistent.
- Set initial weather plausibly for the location and season. Keep it stable until an event or plausible passage of time justifies a change; do not reroll weather every turn.
- Location changes require a supported travel/action event. Do not invent distances or travel times where the map/world modules do not support them.

## 4. Action Duration Limits

- An ordinary player action may advance no more than **3 hours per turn**. **Exception: normal night sleep is a protected biological need and may advance beyond 3 hours in one turn.** Do not force normal sleep to be split into multiple actions.
- Do not combine unrelated independent activities into one long time skip to bypass the ordinary-action limit.
- If a declared action contains several independent activities, resolve the main action and stop at a natural point when further action requires another player decision.
- Apply relevant location, safety, resources, physical condition, weather, and interruptions when deciding whether the declared duration is possible.
- Do not treat a player's stated duration as proof that every intended activity succeeded.
- Normal night sleep is the explicit exception to the 3-hour limit. During protected night sleep, Satiety is locked at its value when sleep begins; do not reduce Satiety or count meal windows as missed while the character is asleep. Apply `core/HUNGER_AND_METABOLISM.md` when the character is awake.

## 5. Pure Cultivation Time Skip

Pure cultivation may advance up to **1 month** in a single turn only when every condition below is verified:

1. The declared activity is pure cultivation; it does not bundle travel, shopping, combat, training unrelated to cultivation, or other independent activities.
2. The character remains in a safe, stationary location for the full period.
3. Food, water, shelter, and other required logistics are sufficient and supported by the character's recorded resources or environment.
4. The GM records reasonable progress checkpoints across the period and accounts for interruptions, changes in condition, and relevant consequences.
5. The total duration does not exceed one month.
6. Account for hunger/metabolism using `core/HUNGER_AND_METABOLISM.md`: reduce Satiety only for active/awake time, with protected night-sleep periods excluded. The one-month cultivation allowance does not suspend other applicable systems.

If any condition is not met or cannot be verified, apply the ordinary-action limit or ask for clarification. Do not assume that a long period is safe merely because the character says they will cultivate.

## 6. Keep These Processes Separate

- **Meditation** is not automatically cultivation and does not automatically increase Sync progress.
- **Cultivation** increases Sync progress only according to the official cultivation rules and the character's current compatibility cap.
- **Spirit Ring absorption** is a separate process governed by the official Spirit Ring and Spirit Beast modules.
- Defeating a Spirit Beast and causing its ring to appear does not mean the ring has automatically been absorbed.
- Do not award progress, absorb a ring, or trigger a breakthrough solely because time passed.

`templates/CHARACTER_PROFILE_TEMPLATE.md` adalah satu-satunya sumber pemetaan status dan format field `Spirit Ring Absorption`. Sebelum setiap percobaan penyerapan, periksa state aktual terhadap `core/SPIRIT_RING_RULES.md`, `core/CULTIVATION_SYSTEM.md`, dan `bestiary/SPIRIT_BEAST_RULES.md`. Untuk ring pertama, Mortal wajib telah mengalami Martial Soul Awakening; tidak ada jeda antar-ring atau bottleneck breakthrough untuk ring pertama. Untuk ring berikutnya sebelum puncak, verifikasi semua syarat resmi termasuk Sync progress/bottleneck, jeda minimum, item wajib, toleransi tubuh, dan syarat lain yang berlaku. Di Spirit Realm 9, jangan hitung kelayakan atau cooldown untuk ring kesepuluh. Ketersediaan ring fisik adalah syarat terpisah: jangan menyatakan karakter tidak eligible hanya karena ring target tidak sedang tersedia, tetapi jangan pernah menarasikan penyerapan selesai tanpa ring yang tersedia melalui proses sah.

If the character is not eligible and the player still insists, do not bypass the gate or award success. Resolve only a forced attempt, using the existing deviation and HP formula in `core/SPIRIT_RING_RULES.md` and the Injury System for any injury supported by the event. Do not invent missing numerical formulas, damage, odds, or permanent disabilities. Severe or life-threatening consequences are possible when supported by the official formula and the actual event; no specific injury or death is automatic.

**Formulasi kanonis `Day left` (wajib):**

Setiap kali penyerapan Spirit Ring berhasil dan masih ada ring berikutnya yang dapat diserap (Ring 1–8), **inisialisasi `Day left` saat itu juga** berdasarkan interval minimum resmi menuju ring berikutnya. Tetapkan titik awal baru: `T_eligible = 0` tepat setelah keberhasilan tersebut. Pengecualian: setelah ring kesembilan tercapai di Spirit Realm 9, jangan inisialisasi cooldown lanjutan; status menjadi `max | ∞ Day left`. Jangan menunggu giliran berikutnya atau meminta riwayat tambahan untuk memulai hitung mundur.

Definisikan:
- `T_min` = interval minimum resmi untuk penyerapan berikutnya, sesuai jumlah ring yang telah berhasil diserap dan tabel interval di `bestiary/SPIRIT_BEAST_RULES.md`. Konversi interval ke durasi memakai kalender sesi yang berlaku; pada kalender fallback §2, 1 bulan = 30 hari.
- `T_eligible` = total durasi waktu dunia yang benar-benar dijalani secara normal di luar Kultivasi sejak penyerapan Spirit Ring terakhir yang berhasil; nilainya dimulai dari `0` tepat saat ring berhasil diserap.
- `T_remaining` = sisa interval yang harus dipenuhi.

Rumus:
```text
T_remaining = max(0, T_min - T_eligible)

Jika T_remaining = 0:
    Day left = 0
Jika T_remaining > 0:
    Day left = ceil(T_remaining / 24 jam)
```

`T_eligible` adalah akumulasi durasi yang memenuhi syarat, bukan selisih timestamp mentah. Waktu dari aksi normal, aktivitas harian, perjalanan, istirahat, atau tidur hanya dihitung selama waktu dunia benar-benar berlalu dan tidak tumpang tindih dengan durasi lain. **Semua durasi yang diklasifikasikan sebagai Kultivasi dikecualikan sepenuhnya dari `T_eligible`**, termasuk time skip Kultivasi hingga satu bulan. Timestamp dan kalender dunia tetap maju selama Kultivasi, tetapi `T_eligible` dan `Day left` tidak berubah akibat durasi tersebut.

Pembulatan dilakukan pada sisa interval: sisa 1 jam hingga 24 jam = `1 Day left`; sisa lebih dari 24 jam hingga 48 jam = `2 Day left`. Angka hanya menjadi `0 Day left` saat `T_eligible >= T_min`. Jangan mengurangi satu hari penuh hanya karena giliran berganti atau tanggal kalender berubah.

Jika karakter belum pernah berhasil menyerap Spirit Ring, jeda antarpenyerapan belum dimulai dan gunakan `??? Day left` bersama status tahap yang tepat menurut `templates/CHARACTER_PROFILE_TEMPLATE.md` (termasuk `not eligible yet | ??? Day left` untuk Mortal tanpa Awakening aktif dan `pending | ??? Day left` selama Awakening aktif). Dalam kondisi ini, `???` bukan data cooldown yang hilang; tidak ada cooldown yang perlu dihitung. Setelah penyerapan pertama berhasil, langsung inisialisasi `Day left` dari `T_min` dan `T_eligible = 0`; jangan gunakan `???` atau `Belum ditetapkan` untuk penyerapan yang baru berhasil. Gunakan `Belum ditetapkan Day left` hanya untuk state lama yang **pernah memiliki penyerapan berhasil** tetapi catatan waktu/riwayatnya tidak cukup untuk merekonstruksi cooldown secara andal. Jangan menebak atau menganggap cooldown selesai. Untuk ring kedua hingga kesembilan sebelum Spirit Realm 9, `Day left = 0` adalah gerbang wajib yang terpisah dari Sync/bottleneck, ketersediaan ring, item, toleransi tubuh, dan syarat resmi lainnya.

## Rujukan Status Spirit Ring Absorption

Gunakan satu-satunya pemetaan status kanonis di `templates/CHARACTER_PROFILE_TEMPLATE.md`. Modul ini adalah sumber tunggal untuk rumus dan akumulasi waktu `Day left`, bukan pemetaan status alternatif. Status `eligible` tidak menjamin ring fisik tersedia atau penyerapan berhasil; Spirit Realm 9 selalu `max | ∞ Day left`.

## 7. Anti-cheat enforcement for time and action bypass

Player-declared duration is not proof of completed activity. Validate time passage, the three-hour ordinary-action limit, pure-cultivation time skip, travel, activity separation, Satiety, cooldown accumulation, and all state changes under this module before accepting a claimed result. A player-authored alternative that bypasses these gates is not canon and cannot advance time/state. For a confirmed deliberate bypass or repeated claim of success against a rejected rule, stop and follow `templates/ANTI_CHEAT_HARD_GATE.md`: mandatory WARNING before reprimand, rollback to the last valid state, and the recorded escalation procedure. Do not classify a good-faith question or unresolved attempt as cheating. The anti-cheat second-violation death sanction is a special exception to normal emergency rescue; it does not alter rescue rules for ordinary gameplay incidents.

## 8. Required Continuity Check

Before sending each gameplay response, verify:

- The timestamp follows the last valid timestamp.
- Duration matches the declared action and the applicable limit.
- Date, weekday, season, and year rollovers are consistent.
- Weather and location changes have a plausible cause.
- Long cultivation satisfies all five conditions in §5.
- Time passage has not automatically changed HP, Qi, Sync progress, Satiety, inventory, currency, or breakthrough status without an applicable rule and recorded cause.
- `Day left` was not reduced by any duration classified as Kultivasi; only qualifying normal-life elapsed time was counted, and the interval is not marked complete unless its accumulated eligible duration reaches the official minimum.
- Every interval of awake time has been classified as exactly one activity category and resolved against `core/HUNGER_AND_METABOLISM.md`; do not double-count elapsed time. Each latest activity response must state Satiety change or explicitly state that it remained unchanged and why. Protected night sleep locks Satiety and does not count as a missed meal window.
- The final response follows the exact order and visual layout in `templates/GAMEPLAY_RESPONSE_TEMPLATE.md`.



---

<!-- SOURCE gameplay/TRAVEL_ENCOUNTER_AMBUSH_RESCUE.md | upstream blob b25b5d7e6fd4c56f5a4a671960ec07497383a5da -->

# Merzkava Universe — Travel Encounter, Ambush & Emergency Rescue

**Status:** Official gameplay procedure.
**Scope:** Travel-segment encounter checks, separate ambush checks, and emergency rescue attempts involving wandering Medicine Hall Society healers.
**Authority:** This module governs these procedures and probabilities only. It does not override canon routes, dynamic events, combat, HP, injury, time, economy, faction lore, or character-state rules.

## 0. Wandering Teacher Encounters

For unplanned encounters with potential teachers or independent practitioners, also apply `world/OPEN_LEARNING_PATHS_AND_WANDERING_INSTRUCTORS.md`. This check is distinct from ambush and emergency rescue checks: do not combine their rolls, reuse their outcomes, or trigger them merely because the player is injured. Consider a single wandering-teacher/general encounter check when a scene provides a genuine opportunity—travel, exploration, public activity, entering a settlement, seeking instruction, or an appropriate time skip. The learning-path module defines the virtual d100 procedure and location-fit constraints.

A wandering teacher may appear without belonging to any faction, but must have a plausible route, purpose, knowledge, and reason to be present. Do not place one inside sealed/private/secure locations or hidden and dangerous areas without grounded access. Do not make a teacher automatically willing, able, safe, affordable, or personally invested in the player. Finding one does not grant techniques, Spirit Realm progress, Arcanist Grades, artifacts, or examination passes; all official mechanics and character-state rules remain binding. Wandering practitioners are deliberately difficult to recruit: one request may simply be refused, while persistent pressure, threats, restraint, or coercion can provoke deception, escape, retaliation, lasting injury or disability, loss of property, legal consequences, or death when supported by the NPC's established capability and official mechanics. Follow the escalation and continuity rules in `world/OPEN_LEARNING_PATHS_AND_WANDERING_INSTRUCTORS.md`; do not punish a polite request automatically, and do not soften credible consequences merely to preserve a teaching route.

## 1. Mandatory Use

Whenever a player travels outside a settlement or through a route segment where an encounter could reasonably occur, consult this module. Before resolving travel, verify the confirmed route, terrain, transport, duration, intermediate stops, restrictions, and relevant events using `world/LOCATION_AND_ROUTE_NETWORK.md`, `world/MAP_AND_REGIONS.md`, `world/GEOGRAPHY_AND_TRAVEL.md`, relevant regional modules, `world/DYNAMIC_EVENTS.md`, and `gameplay/TIME_AND_ACTION_RULES.md`.

Do not invent routes, exact distances, travel times, local threats, named NPCs, medical stations, or confirmed presence from an unverified map gap. The probabilities below are GM mechanics, not evidence that a particular encounter, threat, healer, or route exists.

## 2. General Travel Encounter Check

Run one General Encounter check when the player genuinely enters a new, confirmed route segment. An encounter is not automatically hostile and does not automatically start combat.

| Confirmed segment character | Base chance |
|---|---:|
| Busy road outside a settlement | 5% |
| Regular intercity or trade route | 10% |
| Quiet village route | 15% |
| River crossing or forest route | 20% |
| Dense forest or remote mountain route | 25% |
| Wild zone with confirmed danger | 35% |

`P_E = clamp(0%, 60%, B_E + M_E)`

- `P_E`: final encounter probability.
- `B_E`: base chance from the table.
- `M_E`: evidence-supported modifiers in percentage points, such as recorded trade activity, a relevant active event, or a known local condition.
- Clamp the final chance to 0–60%. Do not add modifiers merely to make a scene more exciting.

Roll virtual d100 once; the check succeeds if the result is at or below `P_E`. Possible outcomes include a helpful, neutral, or friendly wandering NPC; a merchant, caravan, hunter, courier, or passing group; conversation, rumor, services, trade or help offers; signs of a Spirit Beast; environmental obstacles; or a suspicious/opportunistic person where the circumstances support it.

An encounter does not guarantee a reward, threat, or interaction the player must accept. NPCs act according to established traits, knowledge, affiliations, goals, relationships, resources, and circumstances. Do not make a neutral NPC hostile solely to force combat.

## 3. Separate Ambush Check

Ambush is checked separately from General Encounter. Run the check only when there is a plausible, evidence-supported basis for an ambush-capable threat, such as a recorded hostile group, credible local warning, relevant active threat, or a location/threat combination supported by canon. A dangerous-looking place alone does not prove that a specific attacker is present.

| Threat evidence before the check | Base chance |
|---|---:|
| No qualifying threat evidence | 0%; do not roll |
| Potential threat with limited evidence | 5% |
| Plausible ambush risk supported by context | 10% |
| Confirmed hostile threat nearby, outcome unresolved | 20% |
| Ambush already confirmed and underway | Do not reroll its existence |

`P_A = clamp(0%, 50%, B_A + M_A)`

`P_A` is the final ambush probability, `B_A` the base chance, and `M_A` evidence-supported modifiers in percentage points. Clamp to 0–50%. Terrain, weather, time, escort, or alertness can modify the chance only where they materially affect the threat's ability to attack or be detected. Do not double-count one condition. Roll virtual d100 once; success occurs at or below `P_A`.

Ambush means an active hostile or emergency threat, not merely an unfriendly conversation. Supported outcomes may include forced combat against hostile NPCs or a Spirit Beast, coercion under a credible threat demanding money or player-owned items, traps, natural disasters, sudden hazards, or another dangerous event supported by canon.

Probability alone does not determine attacker identity, number, strength, motives, loot, damage, or outcome. For combat use `gameplay/COMBAT_SYSTEM.md`; for injuries use `core/HP_SYSTEM.md` and `core/INJURY_SYSTEM.md`; resolve time using `gameplay/TIME_AND_ACTION_RULES.md` and `core/HUNGER_AND_METABOLISM.md` where relevant.

### Property and currency changes

Do not automatically subtract money or delete inventory because an extortion attempt occurs. Resolve the player's response and the NPC's actual actions. Record only currency or items truly surrendered, seized, lost, recovered, or otherwise changed, following `templates/AUTHORITY_ORDER.md` and `core/10_ECONOMY_SYSTEM.md`. Do not invent an automatic payment or guaranteed escape.

## 4. Segment Procedure and Continuity

1. Verify route, terrain, transport, duration, restrictions, and relevant active events.
2. Run one General Encounter check.
3. Separately run one Ambush check only if qualifying threat evidence exists.
4. If an ambush occurs, resolve it as the principal event. Do not automatically add a second unrelated encounter from the same check cycle.
5. If no ambush occurs, resolve a successful General Encounter, if any.
6. If neither check triggers, travel continues without a forced event.
7. If the player enters a genuine emergency, follow Section 5.

A segment is a confirmed route edge, not an arbitrary GM-created time slice. If travel across it takes multiple gameplay turns due to the action-duration limit, preserve its check status and results; do not reroll because a turn passed or narration continued. A new check cycle starts only when the player actually enters the next confirmed segment. A new material event may change the current situation but does not automatically reroll an old check.

Keep unresolved results in session continuity. If the result is unavailable in the current conversation, do not pretend to remember it or silently reroll; disclose the gap and reconcile from the latest verifiable state.

## 5. Emergency Rescue — Wandering Medicine Hall Society Healer

### 5.1 Activation and chance

Emergency Rescue becomes eligible when a resolved event leaves the player alive but in a genuine emergency requiring prompt assistance: for example, a life-threatening injury, incapacitation, dangerous exposure, severe poisoning, being trapped, or another urgent condition supported by the event. Do not trigger it for every minor wound or ordinary fatigue. Use official HP and injury rules; do not infer a diagnosis from an HP number alone. Under `core/HP_SYSTEM.md`, HP reaching 0 means death; this rescue procedure does not revive a dead character. The sole anti-cheat second-violation death rule is an absolute exception to all normal rescue.

This check is independent of General Encounter and Ambush. An emergency does not guarantee that a healer is nearby or that rescue succeeds.

| Current situation and location | Base chance to encounter a wandering healer |
|---|---:|
| Busy route or near a populated settlement | 20% |
| Ordinary interregional or intercity route | 10% |
| Remote forest or dangerous mountain wilderness | 5% |
| Concrete evidence of a nearby healer, medical mission, or Society activity | Add 10–20 percentage points |

`P_R = clamp(0%, 50%, B_R + M_R)`

`P_R` is the final probability of encountering a wandering healer, `B_R` is the single base chance selected from the location row, and `M_R` is the sum of distinct, evidence-supported modifiers in percentage points. The evidence row is a modifier, not an alternative base chance. Calculate `P_R = min(50%, max(0%, B_R + M_R))`. Do not infer a healer's presence just because the player needs one. The Medicine Hall Society is a neutral medical network, but universal staffing, free treatment, guaranteed supplies, and a healer at every location are not established. Consult `world/FACTIONS.md` and the relevant regional/service module when a specific branch or service point matters. If the character is already at a confirmed clinic or regional hall, use that service point's established location/staffing context rather than rolling to invent a wandering healer.

Perform one rescue check when the emergency first becomes established. Do not reroll every turn while the player remains injured or unconscious. A new check is allowed only when a materially new circumstance creates a legitimate new opportunity, such as reaching a populated route or a medical party newly entering the area. If a healer's presence is already confirmed, do not roll to decide whether they exist; resolve whether they can detect, reach, and assist the player. Never reroll whether an ongoing ambush exists.

### 5.2 Rescue and medical effort

On a successful check, the GM may introduce a wandering NPC affiliated with the Medicine Hall Society if consistent with the location and canon. Select or generate traits without contradicting established profiles, registries, or lore. Once introduced, the NPC's identity and personality persist.

At minimum, the healer attempts to move the player away from the ambush point or conceal them in a comparatively safer location, if their ability and circumstances permit. This is an attempt, not guaranteed extraction: attackers, terrain, the player's condition, the healer's capability, or other hazards may prevent or interrupt it.

After immediate safety is addressed, the healer provides care according to demonstrated/established competence, available medicine and tools, the patient's condition, time, surrounding danger, and personality. The rescue encounter roll is **not** a roll for treatment success. Resolve extraction, diagnosis, stabilization, procedures, and recovery as distinct steps supported by the scene and official rules. Finding a healer does not guarantee full recovery, freedom from injury, or survival. If the attempt fails, resolve the consequences fairly rather than granting automatic protection.

Personality is randomized by the GM when appropriate, while respecting known NPC canon. Suggested patterns:
- **Compassionate:** helps willingly and makes a sincere effort with available supplies.
- **Professional/pragmatic:** stabilizes the patient and provides appropriate care; may request a reasonable fee if consistent with the NPC.
- **Reluctant/indifferent:** offers limited aid, conserves scarce supplies, or avoids risky further treatment.
- **Materialistic:** may request payment or a guarantee before continuing treatment.
- **Exploitative:** may use the patient's vulnerability to demand money or items in exchange for further care.

These are behavior guides, not a closed list. Do not assume all Society members share one temperament. Personality affects willingness and effort, not automatic medical success: a compassionate healer can lack skill or supplies for a grave injury, while a reluctant healer may successfully perform a simple procedure.

A healer may stabilize the player, then demand payment for further treatment. If the player refuses, the healer may negotiate, limit further voluntary care, or leave if consistent with the established character. Do not retroactively erase aid already given. If the healer threatens or forcibly takes property, resolve that as an actual NPC action. Society affiliation does not prove the Society endorses extortion.

### 5.3 Medical and economic continuity

Apply treatment only to the extent supported by the healer's established ability, actual resources, and official HP/injury rules. For injury progress, use `core/INJURY_SYSTEM.md` and its class-specific rates per 24 in-world hours; use the treated rate only when the treatment and any structural/stabilization prerequisites are actually completed. For HP, use `core/HP_SYSTEM.md`: no numerical HP recovery may be invented, and injury progress never converts into HP. Stabilization is not a cure and does not itself restore HP unless an explicit official effect says so. Do not invent instant cures, rare medicine, or guaranteed outcomes. Record medicines used, injuries treated, residual symptoms, treatment time, and recovery requirements. Record fees, debts, item transfers, or property seizure only when they actually occur; currency and item state must match the continuous ledger and character profile. Preserve the healer's identity, affiliation, personality, knowledge, actions, promises, and relationship in later scenes.

If rescue or treatment creates a lasting world-level effect, follow the proposal workflow in `world/DYNAMIC_EVENTS.md`. Ordinary private treatment or a character-only injury change does not automatically qualify as a world event.

## 6. Fairness and Source Priority

- A probability is a chance, not a guarantee. Respect the roll; never reroll solely to obtain a preferred result.
- Do not force every encounter to be hostile, every ambush to be winnable, or every emergency to receive rescue.
- Do not create a healer solely to protect the player or suppress a plausible rescue solely to punish the player.
- Do not change currency, inventory, HP, injuries, time, or relationships without a resolved cause.
- A successful healer-encounter check only establishes a plausible encounter; it does not guarantee extraction, treatment success, HP recovery, injury recovery, or survival.
- Never use normal emergency rescue to override HP 0 death or the permanent death sanction defined in `templates/ANTI_CHEAT_HARD_GATE.md`.
- Preserve NPC agendas, knowledge boundaries, and established traits.
- This module does not override canon decisions, regional rules, combat, HP/injury, economy, time, or recorded dynamic events. When a conflict appears, follow the established source hierarchy and flag unresolved contradictions.

## 7. GM Quick Checklist

**Travel:** verify route and events → General Encounter check → separate Ambush check only when justified → resolve one coherent outcome → preserve segment state.

**Emergency:** verify genuine emergency → check rescue chance once → if successful, establish a plausible wandering Medicine Hall Society healer → attempt safety/extraction → resolve care, effort, payment, injuries, time, and continuity under official rules.



---

<!-- SUPPLEMENTAL FORMULA SOURCE world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md | upstream blob 87e0d4bdbf832f94768d75063b4d30437bdb444d | matrix disposition PUBLIC_CANDIDATE -->

# Merzkava Universe — Golden Dragon Empire Governance

**Scope:** Civil administration, imperial institutions, territorial hierarchy, public offices, oversight, and the separate military chain of command.  
**Status:** Established governance framework, with territorial counts and names maintained in `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md`. Officeholders are recorded separately when established.  
**Primary references:** `world/WORLD.md`, `world/MAP_AND_REGIONS.md`, `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md`, `world/FACTIONS.md`, and the seven regional modules.

---

## 1. Governing Principles

1. The Emperor is the highest sovereign authority of the Golden Dragon Empire.
2. The Golden Dragon Empire is too large to be governed personally by the Emperor alone; administration depends on central institutions, regional governors, local officials, and public offices.
3. **A noble title, clan affiliation, Spirit Realm, or personal strength does not automatically grant a government office or legal jurisdiction.** Authority must come from a recognized appointment, lawful delegation, or established local arrangement.
4. Civil administration and military command are distinct chains. A governor is not automatically the commander of every garrison in their territory, and a military commander does not automatically administer civilian affairs.
5. The seven established regions are geographic and regional identities. They are not, by themselves, a complete list of administrative units or proof of exact borders.
6. The standard territorial counts and jurisdiction names are recorded in `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md`. The named units are established; exact map coordinates, surveyed borders, legal codes, and current officeholders remain open unless recorded in the relevant module.

## 2. Civil Government — From the Center to the Local Level

```text
Emperor
└── Imperial Council / Grand Secretariat
    ├── Central Ministries and Imperial Agencies
    └── 7 Regional Governors
        └── 12 Prefectures
            └── 6 County Circuits (each coordinates two prefectures)
                └── Local offices and settlements (not counted as extra tiers)
                    └── 13 named rural villages in the official atlas
                        └── Household Register (population-record unit)
```

The administrative atlas establishes **7 regions, 12 prefectures, 6 county circuits, and 13 named rural villages** as the current simplified register. Each county circuit coordinates two prefectures; these are broad service jurisdictions, not small districts nested neatly inside a single prefecture. Small towns are not a separate official tier and cities have no fixed empire-wide count. The former counts of 33 prefectures, 268 counties, 361 cities, 1,838 towns, and 22 villages are superseded. Former prefectural seats remain settlements or service hubs; former county magistrates remain NPCs and may be reassigned to local or circuit roles. Household registers are population-record units, not a government tier.

### 2.1 Emperor

The Emperor is the supreme sovereign of the Golden Dragon Empire. The currently established ruler is **Jun Haotian (君昊天)**; see `../regions/golden-dragon-empire/npcs/JUN_HAOTIAN.md` and `world/WORLD.md`.

The Emperor's established sovereignty does not mean every local decision is personally made by him. Day-to-day governance is carried out through institutions and appointed officials.

### 2.2 Imperial Council and Grand Secretariat

The Imperial Council coordinates major policy, inter-ministerial matters, regional reports, and decisions requiring central review. The Grand Secretariat manages imperial documents, decrees, records, appointments, and the transmission of lawful orders.

These are functional offices in the governance framework; the council's exact membership, seat count, appointment procedure, and formal division of duties have not been individually named.

### 2.3 Central Ministries and Oversight

The following portfolio structure is the standard recommended model:

| Institution | Primary responsibility |
|---|---|
| Ministry of Personnel | Civil appointments, promotions, transfers, official evaluations, and staffing records |
| Ministry of Finance | Imperial revenue, public expenditure, tax administration, budgets, and fiscal reports |
| Ministry of Education and Rites | State academies, official examinations, ceremonies, and public educational standards |
| Grand Martial Soul Awakening Hall | Centralized imperial institution coordinating Martial Soul awakening, strategic workforce priorities, and the biennial subsidized public-awakening visits; it dispatches designated officials to villages rather than maintaining an assumed permanent branch in every locality |
| Ministry of Military Affairs | Central military administration, recruitment records, supplies, and coordination with the command structure; not automatic field command over every unit |
| Ministry of Justice | Imperial law, courts, legal procedure, appeals, and administration of penalties |
| Ministry of Public Works | Roads, bridges, canals, flood control, public buildings, and major infrastructure |
| Komite Auditor Keuangan Khusus Kekaisaran | Internal oversight of ministries and subordinate government bodies, including financial irregularities, administrative misconduct, abuse of office, and allegations involving altered records or evidence; detailed powers remain subject to established canon |

The list defines portfolios, not a claim that every ministry already has named ministers, fixed subdivisions, or a fully documented legal code. Those details must be added only when established.

#### 2.3.1 Imperial Strategic Awakening and Workforce Program

The Golden Dragon Empire runs a centrally funded program through the **Grand Martial Soul Awakening Hall**, coordinated with the Ministry of Finance and the Ministry of Education and Rites. Its purpose is to identify confirmed Martial Soul functions that answer documented imperial workforce shortages and connect suitable people with training, public service, or relevant occupations. Awakening remains a public service; the program does not change rarity odds or guarantee employment, academy admission, income, or a particular career.

**Central allocation rule**

- The central government sets the total program envelope, the funding period, the national shortage priorities, and the allocation to each region. Regional governments do not independently set their own share or replace the central formula with local economic conditions.
- The formula below is the default canon for this program. Let **B** be the total central budget for a funding period and **Sᵣ** be a region's verified Strategic Awakening Score.
- **Regional allocation = (20% × B ÷ 7) + (80% × B × Sᵣ ÷ ΣS)**, where ΣS is the sum of all seven regions' scores. If every region's score is zero, the performance pool is held for central review rather than divided using invented scores.
- The equal base portion keeps essential public awakening services operating in every region. The performance portion rewards verified outcomes that answer current imperial shortages. A region with a higher verified score receives a larger performance allocation; its local wealth, tax revenue, resident status, and raw rarity distribution do not directly increase the score.
- **Strategic Awakening Score:** count each distinct, verified awakening once, then multiply it by the centrally published priority weight for its confirmed function. The central priority schedule reflects documented shortages and may change between funding periods. A person cannot be counted twice for the same awakening, and rarity alone earns no points. Exact priority weights and the size of the total budget are set in the central funding order for each period, not improvised by a regional official or GM.
- A strategically useful awakening means that the Martial Soul's demonstrated or canonically established function fits a field in which the Golden Dragon Empire has a documented shortage—such as medicine, irrigation, construction, material processing, transport, logistics, or another field named in the current central priority schedule. A simple or low-rarity Martial Soul may qualify; Myth or Legendary rarity alone does not.
- The program funds outreach, safe awakening facilities, assessment of confirmed practical aptitude, training referrals, approved service placements, and the defined biennial public-awakening subsidy. Funding must not be used to raise rarity odds, force mutation decisions, or promise a guaranteed outcome.
- **Two routes, different payment rules:** an independent paid awakening costs 3 xg 76 xs in total (3 xg 25 xs service fee, 8% service tax on that fee = 26 xs, 15 xs documentation, and 10 xs proof token). For the regular public visit held generally once every two years after New Year, the Imperial subsidy covers the service fee, its tax, and documentation; the individual pays only the 10 xs proof-token fee. This is the program's established subsidy and does not require a separate waiver for each resident. The service, tax, and documentation costs are recorded against the authorized central program budget.
- **Token-fee debt for people unable to pay:** if a person cannot afford the 10 xs token fee on the public route, a local external financial organization may advance that exact amount and issue a written debt note to the individual. The lender is a private/external organization, not the Golden Dragon Empire, the Hall, or an Imperial ministry. The Golden Dragon Empire does not guarantee or collect the private loan, and Imperial subsidy does not cover interest. Randomly select from plausible organizations available locally; ordinary reputable lenders commonly use 3%–8% simple annual interest, while an unlucky draw may be a high-cost lender at 12%–24% simple annual interest. The selected lender and rate are fixed for the note and cannot be rerolled. Principal is limited to the unpaid part of the token fee; do not borrow the already-subsidized service, tax, or documentation costs. Use proportional simple interest for periods under one year; no compounding or extra fees unless explicitly written in the note.
- The debt note must identify the lender, exact principal advanced, interest rate and calculation, repayment schedule, and due dates. Record the advance, liability, interest, and each installment separately. A loan is not income and must not be added to Wallet as spendable earnings if the lender paid the token issuer directly.
- **Default consequences:** nonpayment can harm credit reputation with the lender and, where such records are lawfully checked or shared, make decent-paying work, future credit, and a stable standard of living much harder to secure. This is a serious socioeconomic consequence, not an automatic empire-wide employment ban. Collection procedures and any other consequences depend on the actual lender's note and applicable local rules; do not invent imprisonment, automatic seizure, or universal blacklisting.
- The proof token is linked to the recorded awakening and helps verify completion for basic employment and education applications. It does not guarantee employment, admission, scholarship, income, or treatment based on rarity. Program records support verification and auditing but do not establish a universal public registry or mandatory certificate.
- The Hall submits outcome reports and a budget request; regional offices provide supporting records; the Ministry of Finance calculates and releases allocations under the central rule. The Ministry of Education and Rites coordinates relevant public education and ceremony standards. The Imperial Oversight Agency may inspect suspected manipulation or diversion under the oversight framework.
- Program records must support verification of counted outcomes and expenditure. This is a program-specific audit trail, **not** a declaration that a universal national registry or mandatory citizen certificate exists.

**Integrity risks and corruption**

The system creates incentives that can be abused. Plausible misconduct includes inflating the number of strategic awakenings, misclassifying ordinary outcomes to fit a priority field, counting the same person twice, fabricating training or placement records, bribing assessors, diverting outreach funds, steering contracts to allies, demanding kickbacks, or suppressing a region's valid results to shift funds elsewhere. Such conduct is a possible event, not an assumption that every official is corrupt.

Controls include cross-checking outcome records, sampling local cases, comparing claimed results with actual service or training evidence, reviewing expenditure, and referring suspicious discrepancies for investigation. The Ministry of Finance may withhold or recover disputed program payments pending review; the Imperial Oversight Agency may investigate suspected abuse within its established remit. Officials, noble houses, clans, and local elites can attempt to influence these controls, so oversight is not a guarantee that corruption is eliminated. Specific penalties, investigator appointment rules, and appeal procedures remain governed by the wider legal framework and are not invented here.

This funding rule does not change awakening rarity odds, mutation odds, or the fairness of the awakening process. Officials must not manipulate results to increase a region's score.


### 2.4 Regional Governors

Each of the seven regions has a regional administrative role responsible for coordinating the region's prefectures, reporting to the center, implementing imperial policy, and addressing issues that cross local jurisdictions.

The regional identities are:

- **Longyuan — Imperial Heartland:** court, central administration, nobles, and political institutions.
- **Canglan — Riverlands:** agriculture, irrigation, river transport, and inland trade.
- **Jinyue — Mineral Lands:** mining, spiritual metals, and artifact materials.
- **Tianfeng — Scholarly Heights:** scholarly traditions, talent development, literacy, and knowledge exchange; it is a source of gifted students for the two central academies in Huanglongcheng, not a regional academy network.
- **Yanling — Volcanic Mountains:** smithing, furnaces, and spiritual forging.
- **Baiyue — Frontier Marches:** border defense, fortifications, and military routes.
- **Xingluo — Eastern Ports:** maritime trade, diplomacy, and sea routes.

These seven regional identities and their administrative seats/counts are established in `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md`. The current named governors are recorded in `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md`; surveyed legal boundaries remain unestablished.

### 2.5 Prefectures

Prefectures coordinate multiple counties or a major urban jurisdiction. Their administration may cover regional transport, public works, revenue collection, inter-county disputes, and implementation of regional orders.

The 12 active prefectures and their seat cities are named in `world/GOLDEN_DRAGON_EMPIRE_ADMINISTRATIVE_ATLAS.md`. Their precise surveyed borders are unestablished; current prefects and reassigned regional officers are listed in `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md`.

### 2.6 Counties

County circuits coordinate local civil administration, tax and population registers, courts of first instance where applicable, public works, and relations between settlements. They are broad service jurisdictions, not an additional layer of individual counties.

The atlas establishes six broad county circuits, each coordinating two prefectures; their hubs and responsibilities are listed in the atlas. Precise surveyed borders remain unestablished; current magistrates and reassigned circuit liaison officers are listed in `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md`.

### 2.7 Cities, Towns, Townships, Districts, and Villages

- **Cities:** major population, trade, administrative, craft, or military centers. Their status as settlements does not automatically make them separate administrative tiers.
- **Towns and market settlements:** smaller urban places within a prefecture or service circuit. They do not imply a separate county tier; local administration follows the current atlas and any explicitly established appointment.
- **Townships / District Offices:** local offices that coordinate multiple villages or neighborhoods, or administer a defined urban district.
- **Villages / Neighborhoods:** the closest ordinary civil administration to residents, responsible for local registers, public notices, basic communal matters, and forwarding petitions or reports.
- **Household Register:** the lowest population-registration unit, recording a household and its recognized members. It is a registry unit, **not a separate government tier** and not proof that every household has an official ruler.

Village heads, neighborhood heads, clerks, and other local officers may be appointed or recognized through a procedure that will be documented later. Their cultivation level does not by itself determine their office.

## 3. Military Chain of Command — Separate from Civil Administration

```text
Emperor / Supreme Imperial Authority
└── Imperial High Command
    └── Regional Military Command
        └── Prefecture / Garrison Command
            └── Fortress or City Commander
                └── Unit Officers
                    └── Soldiers
```

This is the standard command model for imperial forces. Exact ranks, unit sizes, named commanders, and legal rules governing emergency authority remain to be defined.

- The Ministry of Military Affairs handles central administration and coordination; the High Command directs military operations.
- Regional governors and military commanders must coordinate but do not automatically replace one another.
- Baiyue's established identity as the Frontier Marches makes border garrisons and fortifications especially relevant there, but does not establish a specific garrison count or grant the civil governor direct military command.
- Clan troops, private guards, dojo forces, and other non-imperial forces are not automatically imperial units. Their legal status and relationship to the Golden Dragon Empire must be established separately.

## 4. Justice, Oversight, and Accountability

- Civil officials are accountable through the applicable administrative chain and lawful oversight.
- Courts and legal offices operate under the Justice portfolio; exact court levels and appeal rules remain to be defined in a separate legal framework.
- The Imperial Oversight Agency may investigate suspected corruption or abuse, but its specific powers, appointment rules, and independence are not yet established.
- No officeholder is presumed honest, corrupt, loyal, disloyal, competent, or incompetent solely because of title or affiliation. Individual behavior must be established through canon or events.
- A noble, clan, dojo, or sect may possess social and political influence without automatically owning the territory or replacing its civil administration.

## 5. How Governance Information Is Stored

Follow a modular pattern inspired by the organization of a repository: one navigation index, one central reference per topic, and focused files for regions or individual institutions. This is a storage design reference, not a transfer of world lore.

| Information type | Canonical storage |
|---|---|
| Core governance principles, hierarchy, ministries, and civil/military distinction | This file: `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md` |
| Seven regional identities and broad geographic relationships | `world/WORLD.md` and `world/MAP_AND_REGIONS.md` |
| Local settlements, jurisdiction, regional offices, local factions, and local NPC registry | The relevant `world/REGION_*.md` file |
| Central ministers, regional governors, all prefects and county magistrates: names, Spirit Realm, Martial Soul, background, motivation, and political stance | `world/GOLDEN_DRAGON_EMPIRE_OFFICIALS.md` |
| Full biography and established traits of an important official or recurring NPC requiring more detail | A dedicated `world/NPC_[NAME].md` profile linked from the regional registry |
| Clan, dojo, sect, and organization identity or relationships | `world/FACTIONS.md`; use a dedicated module when the institution requires detailed hierarchy or facilities |
| Confirmed historical appointments, reforms, wars, or past political events | `world/HISTORY.md` |
| Active or concluded persistent events and their ongoing world effects | `world/DYNAMIC_EVENTS.md`, following the owner-review workflow |
| Navigation, module links, and fetch triggers | `INDEX.md` |
| Human-facing project directory | `README.md` |

### 5.1 Record One Fact at Its Authoritative Source

Do not copy a full ministry description into every regional file. The central governance module defines the structure of the Golden Dragon Empire; a regional file records only local implementation, confirmed officeholders, local jurisdictions, and relevant exceptions. Other files should link to the authoritative source instead of silently creating competing versions.

### 5.2 Required Fields for a Future Administrative Unit

When adding detail to an already registered prefecture, county, city, town, district, or village, record as much of the following as is confirmed:

- Official name and administrative type.
- Parent jurisdiction and governing authority.
- Confirmed seat, boundaries, and neighboring units, if known.
- Responsibilities and jurisdictional limits.
- Current officeholder and appointment source, if established.
- Confirmed settlements, public institutions, garrisons, and relevant factions.
- Revenue or economic role only when supported by the economy/world canon.
- Current status, known disputes, and links to relevant events/history.
- Canon source and status of each entry: **confirmed**, **provisional**, or **not established**.

Do not fill unknown fields with invented names, numbers, borders, or officeholders. Use `Belum ditetapkan` where appropriate.

### 5.3 Expansion Order

1. Treat the atlas as the single source for administrative names and totals.
2. Expand Longyuan's capital districts and local institutions in its regional module.
3. Expand the other six regional modules according to their established identities and recorded settlement totals.
4. Add individual NPC profiles when important officials are named.
5. When an administrative unit changes, update the atlas first, then synchronize the regional module and `world/MAP_AND_REGIONS.md`.

## 6. Canon Boundaries and Open Decisions

The following remain open unless established by a later owner-approved source:

- Exact surveyed boundaries and coordinates of prefectures, counties, and the imperial capital.
- Detailed capital districts and the current holders of central and regional offices.
- Ministers, council members, governors, prefects, county magistrates, and their current terms.
- Formal noble ranks, succession law, appointment procedures, taxation law, and civil-service examinations beyond the broad portfolio above.
- Detailed court hierarchy, appeal procedures, police/investigative authority, and emergency powers.
- Exact army ranks, unit sizes, garrison numbers, and relationships with clan or dojo forces.
- Any regional exception to the standard hierarchy.
- The Grand Martial Soul Awakening Hall's detailed internal hierarchy, staffing, and full reporting chain. Its centralized status and biennial public-awakening visits are settled; permanent regional or village branches are not established and must not be assumed. The central allocation principle and default formula are established; the central funding order still sets each period's total budget, priority weights, and funding dates. Specific penalties, investigator appointment rules, and appeal procedures remain open under the wider legal framework. Rules for fee waivers and subsidies require explicit authorization; the standard service charges and public token-only route are defined in `core/10_ECONOMY_SYSTEM.md` and `core/MARTIAL_SOUL_AWAKENING.md`.

The initial territorial names and totals are established by the administrative atlas, while exact geography and current officeholders remain separate facts. Do not use this module to overwrite established characters, clans, dojos, regional identities, or unrelated world lore. When a new fact conflicts with an existing official source, flag the conflict for owner review rather than silently rewriting either source.

