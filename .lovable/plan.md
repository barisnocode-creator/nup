
## Template Onizleme ve Icerik Eslestirme Duzeltmesi + Kaydet Butonu

### Sorunlar

1. **Onizleme eksik icerik**: `ChangeTemplateModal` icindeki canli onizleme, template'in kendi tema renklerini UYGULAMIYOR. Sadece section'lari render ediyor ama CSS degiskenlerini (--primary, --background vb.) degistirmiyor. Bu yuzden dental klinik sablonu onizlenirken mevcut cafe renkleri gorunuyor.

2. **Sektor-uyumsuz icerikler**: Otel sablonunu "Sablonu Kullan" ile uygulayinca "Deluxe Oda", "Suit Oda" gibi otel icerikleri kaliyor. `mapServicesSection` sadece generatedContent veya sectorProfile'den veri eslestiriyor ama template'e ozel section type'lari (RoomShowcase, HotelAmenities, ChefShowcase vb.) icin mapper BULUNMUYOR — bu section'lar hic eslestirme yapilmadan dogrudan template default icerikleriyle gosteriyor.

3. **Kaydet butonu yok**: Toolbar'da elle kaydetme butonu bulunmuyor (otomatik debounce save var ama gorunur buton yok).

### Cozum Plani

---

#### Degisiklik 1 — Canli Onizlemede Tema Renklerini Uygula

**Dosya:** `src/components/website-preview/ChangeTemplateModal.tsx`

Onizleme moduna (previewTemplateId aktifken) template'in tema renklerini CSS degiskeni olarak uygulayan bir `useEffect` eklenir:

```text
1. previewTemplateId degistiginde, templateToPreset[previewTemplateId] alinir
2. Bu preset'in renkleri gecici olarak document.documentElement'e CSS degiskeni olarak yazilir
3. Onizleme kapandiginda (previewTemplateId = null) eski degerler geri yuklenir
```

Bu sayede dental klinik onizlenirken sky-blue tonlari, restoran onizlenirken altin/koyu tonlar gorunur.

Ayni mantik, Google Fonts yukleme icin de gerekli — preset'teki fontFamily heading ve body font'lari dinamik olarak yuklenir.

---

#### Degisiklik 2 — Daha Kapsamli Icerik Eslestirme (Testimonials, Appointment, FAQ)

**Dosya:** `src/templates/catalog/mappers/index.ts`

Su ek section type'lari icin mapper kaydedilecek:

| Section Type | Mapper Mantigi |
|---|---|
| `TestimonialsCarousel` | Sektore uygun yorumcu isimleri ve roller (orn. doktor icin "Hasta" yerine kullanicinin sektorune gore) |
| `AppointmentBooking` | Sektor profilindeki `sectionLabels.appointment` label'i kullanilir (orn. "Randevu Al" vs "Rezervasyon") |
| `StatisticsCounter` | Sektor profilinden uygun istatistik etiketleri |
| `RoomShowcase` | Doktor sektorunde bu section ATLANIR (kaldirilir) |
| `HotelAmenities` | Doktor sektorunde ATLANIR |
| `RestaurantMenu` | Saglik/hukuk sektorlerinde ATLANIR |
| `ChefShowcase` | Yeme-icme disindaki sektorlerde ATLANIR |
| `SkillsGrid` | Teknoloji disindaki sektorlerde ATLANIR |
| `ProjectShowcase` | Teknoloji disindaki sektorlerde ATLANIR |
| `DentalServices` | Saglik disindaki sektorlerde `ServicesGrid`'e donusur |
| `DentalTips` | Saglik disindaki sektorlerde ATLANIR |
| `DentalBooking` | Saglik disindaki sektorlerde standart AppointmentBooking'e donusur |

**Yeni dosya:** `src/templates/catalog/mappers/mapTestimonialsSection.ts`
**Yeni dosya:** `src/templates/catalog/mappers/mapAppointmentSection.ts`

**Dosya:** `src/templates/catalog/mappers/index.ts`

`mapSections` fonksiyonuna section **filtreleme** mantigi eklenir:

```text
Sektore uyumsuz section type'lari (RoomShowcase -> doktor icin) eslestirme
sirasinda diziden cikarilir veya uyumlu bir alternatifle degistirilir.
```

Bunun icin yeni bir `sectorIncompatible` karaliste olusturulur:

```text
const incompatibleSections: Record<string, string[]> = {
  'RoomShowcase': ['hotel', 'resort', 'accommodation'],
  'HotelAmenities': ['hotel', 'resort', 'accommodation'],
  'RestaurantMenu': ['restaurant', 'food', 'bistro', 'cafe'],
  'ChefShowcase': ['restaurant', 'food', 'cafe'],
  'DentalTips': ['dentist', 'dental', 'health', 'doctor'],
  'DentalBooking': ['dentist', 'dental', 'health', 'doctor'],
  'DentalServices': ['dentist', 'dental', 'health', 'doctor'],
  'SkillsGrid': ['developer', 'engineer', 'freelancer', 'technology'],
  'ProjectShowcase': ['developer', 'engineer', 'freelancer', 'technology'],
  'MenuShowcase': ['restaurant', 'food', 'cafe', 'bistro'],
  'CafeGallery': ['cafe', 'coffee', 'food', 'restaurant'],
};
```

Eger kullanicinin sektoru bu listede YOKSA, o section atlanir. Boylece doktor bir otel sablonu sectiginde RoomShowcase ve HotelAmenities otomatik olarak kaldirilir. Bazilari yerine uyumlu alternatifler konur:

- `DentalServices` -> saglik disi sektorlerde `ServicesGrid` olarak degistirilir (ayni props, farkli bilesen)
- `DentalBooking` -> saglik disi sektorlerde `AppointmentBooking` olarak degistirilir
- `MenuShowcase` -> yeme-icme disi sektorlerde `ServicesGrid` olarak degistirilir

---

#### Degisiklik 3 — applyTemplate'e Sektor Filtreleme Ekleme

**Dosya:** `src/components/editor/useEditorState.ts`

`applyTemplate` fonksiyonu guncellenir: `mapContentToTemplate` cagrildiktan sonra, sektor ile uyumsuz section'lar filtrelenir. Bu filtreleme mantigi mapper index.ts icerisindeki fonksiyon uzerinden yapilir (yeni bir export: `filterIncompatibleSections`).

---

#### Degisiklik 4 — Kaydet Butonu

**Dosya:** `src/components/editor/EditorToolbar.tsx`

Toolbar'a "Yayinla" butonunun soluna bir "Kaydet" butonu eklenir:

- `hasUnsavedChanges` true ise gorunur ve aktif
- `isSaving` true ise yukleniyor animasyonu
- Tiklaninca `forceSave()` cagirilir
- Kaydetme tamamlaninca buton kaybolur veya tiklanamaz hale gelir

**Dosya:** `src/components/editor/SiteEditor.tsx`

EditorToolbar'a `onSave={forceSave}` prop'u aktarilir.

---

### Tam Dosya Listesi

| Dosya | Islem |
|-------|-------|
| `src/components/website-preview/ChangeTemplateModal.tsx` | **Guncelleme** — onizleme temasi uygulama |
| `src/templates/catalog/mappers/index.ts` | **Guncelleme** — sektor uyumsuz section filtreleme + yeni mapper kayitlari |
| `src/templates/catalog/mappers/mapTestimonialsSection.ts` | **Yeni** — testimonials icerigi eslestirme |
| `src/templates/catalog/mappers/mapAppointmentSection.ts` | **Yeni** — randevu/rezervasyon label eslestirme |
| `src/components/editor/useEditorState.ts` | **Guncelleme** — applyTemplate icinde filtreleme |
| `src/components/editor/EditorToolbar.tsx` | **Guncelleme** — Kaydet butonu ekleme |
| `src/components/editor/SiteEditor.tsx` | **Guncelleme** — forceSave prop aktarimi |

### Korunanlar

- Template tanimlari (definitions.ts) degismez
- SectionRenderer degismez
- Mevcut mapper dosyalari (mapHeroSection, mapServicesSection vb.) degismez
- Routing, auth, publish akisi degismez
