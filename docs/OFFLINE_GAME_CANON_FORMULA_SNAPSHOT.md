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

