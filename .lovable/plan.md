
## Sektor Tespiti ve Icerik Filtreleme Duzeltmesi

### Tespit Edilen Sorunlar

1. **Sektor degeri bos**: `Project.tsx` satirinda `form_data?.businessType ?? form_data?.sector` yolu kullaniliyor ama gercek sektor `form_data.extractedData.sector = "service"` icinde. Bu "service" degeri de cok genel — doktor, restoran, otel hepsine "service" deniyor.

2. **Akilli sektor cikarimi yok**: Kullanicinin hizmetleri `["Estetik Cerrahi"]` ve isletme adi `"Baris Yakut Estetik Cerrahi"` — bunlardan "doctor" veya "health" sektoru cikarilabilir ama bu mantik mevcut degil.

3. **Onizlemede filtreleme eksik**: `ChangeTemplateModal.tsx` icerisinde onizleme section'lari olusturulurken `mapContentToTemplate` cagriliyor ama `filterIncompatibleSections` ayri olarak CAGRILMIYOR. `mapContentToTemplate` icindeki `mapSections` fonksiyonu zaten `filterIncompatibleSections` cagiriyor — ancak sektor bos gelince hicbir sey filtrelenmiyor.

4. **Mevcut site yanlis bolumlerle dolu**: Veritabaninda `HeroRestaurant`, `CafeFeatures`, `RestaurantMenu`, `ChefShowcase`, `CafeGallery` kayitli — estetik cerrahi icin uyumsuz.

### Cozum

#### Degisiklik 1 — Akilli Sektor Cikarimi

**Dosya:** `src/pages/Project.tsx`

`sector` degerini belirlerken coklu yol taramasi ve anahtar kelime eslemesi yapilacak:

```text
1. form_data.businessType (birinci tercih)
2. form_data.sector
3. form_data.extractedData.sector (mevcut "service" degeri burada)
4. Eger hepsi "service" veya bos ise → hizmet listesi + isletme adindan cikarim yap
```

Cikarim mantigi:
- Hizmet listesinde veya isletme adinda "estetik", "cerrahi", "doktor", "klinik", "saglik" gibi anahtar kelimeler aranir
- Eslesen kelimeye gore sektorProfiles'daki en uygun sektor secilir (orn. "estetik cerrahi" → "doctor")
- Yeni bir yardimci fonksiyon: `inferSectorFromFormData(formData): string`

Anahtar kelime eslesme tablosu:

| Anahtar Kelimeler | Sektor |
|---|---|
| estetik, cerrahi, doktor, klinik, muayene, hasta, tip, saglik, medical, clinic | doctor |
| dis, dental, ortodonti, implant | dentist |
| eczane, ilac, pharmacy | pharmacy |
| restoran, restaurant, yemek, mutfak, lezzet | restaurant |
| kafe, cafe, kahve, coffee | cafe |
| otel, hotel, konaklama, resort | hotel |
| avukat, hukuk, lawyer, buro | lawyer |
| guzellik, salon, kuafor, beauty, cilt, makyaj | beauty_salon |
| spor, gym, fitness, antrenman, pilates | gym |
| veteriner, hayvan, pet | veterinary |

#### Degisiklik 2 — Mevcut Siteyi Ilk Yuklemede Filtrele

**Dosya:** `src/pages/Project.tsx`

Proje ilk yuklendiginde, eger `site_sections` veritabanindan geliyorsa ve sektor tespit edildiyse, mevcut section'lar `filterIncompatibleSections` uzerinden gecirilir. Boylece `RestaurantMenu`, `ChefShowcase` gibi uyumsuz bolumler otomatik olarak kaldirilir veya uyumlu alternatiflerle degistirilir.

Bu filtreleme sadece bir kez (sayfa yuklemesinde) yapilir ve sonuc veritabanina yazilir — her seferinde tekrarlanmaz.

#### Degisiklik 3 — SectorProfile'a Estetik Cerrahi Eklenmesi

**Dosya:** `src/templates/catalog/sectorProfiles.ts`

Yeni sektor profili eklenir: `aesthetic_surgery` (veya mevcut `doctor` profili genisletilir). Estetik cerrahi icin ozel hizmet isimleri (Rinoplasti, Meme Estetigi, Liposuction vb.) ve uygun etiketler.

Alternatif olarak `doctor` profilini estetik cerrahiye de uyumlu hale getirmek icin `getSectorProfile` fonksiyonunda "estetik" → "doctor" eslestirmesi yapilabilir.

#### Degisiklik 4 — Onizleme Filtrelemesi

**Dosya:** `src/components/website-preview/ChangeTemplateModal.tsx`

`previewSections` hesaplanirken `mapContentToTemplate` ile birlikte `filterIncompatibleSections` acikca cagrilmasi gereksiz — cunku `mapContentToTemplate` → `mapSections` zaten bunu yapiyor. Sorun tamamen sektorun bos gelmesinden kaynakli. Degisiklik 1 bu sorunu cozer.

Ancak ek guvenlik olarak, `previewSections` icinde de `filterIncompatibleSections` acik cagrisi eklenecek.

### Degisecek Dosyalar

| Dosya | Islem |
|---|---|
| `src/pages/Project.tsx` | **Guncelleme** — akilli sektor cikarimi + ilk yukleme filtrelemesi |
| `src/templates/catalog/sectorProfiles.ts` | **Guncelleme** — `getSectorProfile`'a eslesme genisletmesi |
| `src/components/website-preview/ChangeTemplateModal.tsx` | **Guncelleme** — onizlemede filtreleme eklenmesi |

### Teknik Detaylar

`inferSectorFromFormData` fonksiyonu su veri kaynaklarini tarar:
- `formData.extractedData.services[]` — hizmet listesi
- `formData.extractedData.businessName` — isletme adi
- `formData.professionalDetails.services[]` — profesyonel hizmet listesi
- `formData.businessInfo.businessName` — isletme adi (alternatif yol)

Tum degerler kucuk harfe cevrilerek anahtar kelime tablosuna karsi kontrol edilir. Ilk eslesen sektor kullanilir.

### Korunanlar

- Template tanimlari (definitions.ts) degismez
- useEditorState degismez
- Mevcut mapper dosyalari degismez
- EditorToolbar ve kaydet butonu degismez
