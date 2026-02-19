

## Sektor-Duyarli Icerik Eslestirme ve Eklenebilir Bolumler Paneli

Bu plan iki buyuk ozellik iceriyor: (1) herhangi bir template secildiginde icerik olarak kullanicinin kendi sektorune ait veriler gosterilmesi, (2) editorde toggle ile acilip kapanabilen bolumler paneli.

---

### OZELLIK 1: Sektor Profilleri ve Icerik Eslestirme

#### Adim 1 — Sektor Profilleri Dosyasi

**Yeni dosya:** `src/templates/catalog/sectorProfiles.ts`

10 sektor icin Turkce placeholder icerikler tanimlayan bir `SectorProfile` tipi ve profil sozlugu:

| Sektor | heroTitle ornegi | sectionLabels.services |
|--------|-----------------|----------------------|
| doctor | "Sagliginiz Icin Profesyonel Bakim" | "Hizmetlerimiz" |
| dentist | "Saglikli Gulusler Icin..." | "Tedavilerimiz" |
| pharmacy | "Saglik Danismaniniz" | "Hizmetlerimiz" |
| restaurant | "Lezzetin Sanati" | "Menumuz" |
| cafe | "Ozenle Hazirlanan Kahve" | "Menumuz" |
| hotel | "Luksun ve Konforun Adresi" | "Odalarimiz" |
| lawyer | "Hukuki Guvenciniz" | "Uzmanlik Alanlarimiz" |
| beauty_salon | "Guzelliginize Deger Katiyoruz" | "Hizmetlerimiz" |
| gym | "Saglikli Yasam Merkezi" | "Programlarimiz" |
| veterinary | "Dostlariniz Icin En Iyisi" | "Hizmetlerimiz" |

Her profil su alanlari icerir:
- `heroTitle`, `heroSubtitle`, `heroDescription`, `ctaText`
- `services[]` (3-4 adet, sektor icerikleriyle)
- `aboutTitle`, `aboutDescription`
- `sectionLabels` (services, team, gallery, appointment)

#### Adim 2 — Mapper Orchestrator Guncelleme

**Dosya:** `src/templates/catalog/mappers/index.ts`

Mevcut `mapSections` fonksiyonuna 3-katmanli oncelik zinciri eklenir:

```text
1. projectData.generatedContent (kullanicinin gercek verisi)
2. sectorProfiles[sector] (sektor varsayilanlari)
3. template defaultProps (mevcut sablon verisi — dokunulmaz)
```

Her mapper fonksiyonu (mapHeroSection, mapServicesSection vb.) guncellenecek:
- Once `generatedContent`'ten veri aranir (`safeGet`)
- Bulunamazsa `sectorProfiles[sector]`'den alinir
- O da yoksa template default'u korunur

#### Adim 3 — Mapper Dosyalari Guncelleme

6 mapper dosyasinin her birine sektor profili fallback mantigi eklenir:

- `mapHeroSection.ts` — `sectorProfile.heroTitle` fallback
- `mapServicesSection.ts` — `sectorProfile.services` fallback
- `mapContactSection.ts` — degisiklik yok (zaten genel)
- `mapAboutSection.ts` — `sectorProfile.aboutTitle/Description` fallback
- `mapCtaSection.ts` — `sectorProfile.ctaText` fallback
- `mapTeamSection.ts` — sektor etiketini kullanir

#### Adim 4 — Section Etiket Uyarlama

`sectionLabels` kullanilarak template'teki genel etiketler (orn. "Menumuz" → doktor icin "Hizmetlerimiz") otomatik degistirilir. Bu mantik mapper orchestrator icerisinde, `sectionTitle`/`subtitle` prop'lari uzerinde calisan bir post-process adimi olarak eklenir.

---

### OZELLIK 2: Eklenebilir Bolumler Paneli

#### Adim 5 — Addable Section Bilesenleri

7 yeni evrensel + 4 sektore ozel = 11 yeni section bileseni olusturulacak:

**Evrensel (tum sektorler):**

| Dosya | Icerik |
|-------|--------|
| `src/components/sections/addable/AppointmentSection.tsx` | Ad, telefon, tarih secici (react-day-picker), saat secici (Select), not alani, gonder butonu |
| `src/components/sections/addable/FAQSection.tsx` | Accordion (shadcn Accordion) ile S&C listesi |
| `src/components/sections/addable/MessageFormSection.tsx` | Ad, e-posta, mesaj textarea, gonder butonu |
| `src/components/sections/addable/WorkingHoursMapSection.tsx` | Haftalik saat tablosu (sol) + Google Maps iframe placeholder (sag) |

**Sektore ozel:**

| Dosya | Sektorler | Icerik |
|-------|-----------|--------|
| `src/components/sections/addable/OnlineConsultationSection.tsx` | doctor, dentist, pharmacy | "Online Konsultasyon" aciklama + buton + ozellik listesi |
| `src/components/sections/addable/InsuranceSection.tsx` | doctor, dentist | "Anlasmalı Sigorta Sirketleri" logo/isim listesi |
| `src/components/sections/addable/MenuHighlightsSection.tsx` | restaurant, cafe | One cikan menu ogeler (gorsel, ad, fiyat, aciklama) |
| `src/components/sections/addable/RoomAvailabilitySection.tsx` | hotel | Check-in/out tarih secici + oda tipi select + kontrol butonu |
| `src/components/sections/addable/CaseEvaluationSection.tsx` | lawyer | "Ucretsiz Hukuki Degerlendirme" formu (ad, tel, dava tipi dropdown, aciklama) |
| `src/components/sections/addable/BeforeAfterSection.tsx` | beauty_salon, gym | Once/sonra gorsel cifti yan yana veya slider |
| `src/components/sections/addable/PetRegistrationSection.tsx` | veterinary | Hayvan sahibi adi, hayvan adi, tur dropdown, irk, yas, randevu nedeni |

**Tema uyumlu stil kurali:**
Tum addable section'lar CSS degiskenlerini kullanacak (zaten mevcut sistemde var):
- Butonlar: `bg-primary text-primary-foreground`
- Kartlar: `bg-card border-border`
- Yazi tipleri: `font-heading-dynamic` ve `font-body-dynamic` siniflari
- Border radius: `rounded-[var(--radius)]` veya Tailwind `rounded-xl`
- Arka plan: `bg-background` veya `bg-muted/30`

Bu yaklasimla ayri bir ThemeContext GEREKMIYOR — tum section bilesenlerinin tema uyumu mevcut CSS degisken sistemiyle zaten saglanir. SiteEditor `document.documentElement` uzerine tema degiskenlerini yazdiginda tum addable section'lar da otomatik olarak dogru renkleri alir.

#### Adim 6 — Section Registry Guncelleme

**Dosya:** `src/components/sections/registry.ts`

11 yeni bilesen registry'ye eklenir:
```text
'AddableAppointment': AppointmentSection
'AddableFAQ': FAQSection
'AddableMessageForm': MessageFormSection
...
```

#### Adim 7 — useEditorState Guncelleme

**Dosya:** `src/components/editor/useEditorState.ts`

Yeni state ve fonksiyonlar:

```text
addableSections: Record<string, boolean>  // hangi toggle'lar acik
toggleAddableSection(key: string): void   // toggle islemi
```

`toggleAddableSection` mantigi:
- ON → Ilgili section'i `sections` dizisine SON section'dan once (ama panel'den once) ekler
- OFF → O section'i `sections` dizisinden cikarir

Her addable section icin varsayilan props, sektor profili kullanilarak doldurulur.

#### Adim 8 — Eklenebilir Bolumler Paneli Bileseni

**Yeni dosya:** `src/components/editor/AddableSectionsPanel.tsx`

EditorCanvas icerisinde, tum section'larin altinda (en sonda) gosterilen bir panel:

```text
┌──────────────────────────────────────────────┐
│  Sayfaniza Eklenebilir Bolumler              │
│  Bu bolumleri tek tikla ekleyip              │
│  kaldirabilirsiniz.                          │
├──────────────────────────────────────────────┤
│  [Toggle] Randevu / Rezervasyon Formu        │
│  [Toggle] Sik Sorulan Sorular (FAQ)          │
│  [Toggle] Mesaj Birak / Iletisim Formu       │
│  [Toggle] Calisma Saatleri & Harita          │
│  ── Sektorunuze Ozel ──                      │
│  [Toggle] [sektore gore degisen listeler]    │
└──────────────────────────────────────────────┘
```

- Toggle bilesenlerinde shadcn Switch kullanilir
- Sektor bilgisi `projectData.sector`'den alinir
- Evrensel toggle'lar her zaman gosterilir
- Sektore ozel toggle'lar sadece eslesen sektorlerde gosterilir
- Panel sadece `isEditing` modunda gorunur
- Panel kaldirilamaz ve tasinamaz

#### Adim 9 — EditorCanvas Guncelleme

**Dosya:** `src/components/editor/EditorCanvas.tsx`

`sections.map(...)` blogunun altina (ama container div icerisinde) `AddableSectionsPanel` eklenir:

```text
{isEditing && (
  <AddableSectionsPanel
    sector={sector}
    addableSections={addableSections}
    onToggle={onToggleAddableSection}
  />
)}
```

EditorCanvas props'una `sector`, `addableSections`, `onToggleAddableSection` eklenir.

#### Adim 10 — SiteEditor Wiring

**Dosya:** `src/components/editor/SiteEditor.tsx`

EditorCanvas'a yeni props aktarilir:
- `sector={projectData?.sector}`
- `addableSections={editor.addableSections}`
- `onToggleAddableSection={editor.toggleAddableSection}`

---

### Dosya Degisiklikleri Tam Listesi

| Dosya | Islem |
|-------|-------|
| `src/templates/catalog/sectorProfiles.ts` | **Yeni** |
| `src/templates/catalog/mappers/index.ts` | **Guncelleme** — sektor profili fallback |
| `src/templates/catalog/mappers/mapHeroSection.ts` | **Guncelleme** — sektor fallback |
| `src/templates/catalog/mappers/mapServicesSection.ts` | **Guncelleme** — sektor fallback |
| `src/templates/catalog/mappers/mapAboutSection.ts` | **Guncelleme** — sektor fallback |
| `src/templates/catalog/mappers/mapCtaSection.ts` | **Guncelleme** — sektor fallback |
| `src/templates/catalog/mappers/mapTeamSection.ts` | **Guncelleme** — sektor fallback |
| `src/components/sections/addable/AppointmentSection.tsx` | **Yeni** |
| `src/components/sections/addable/FAQSection.tsx` | **Yeni** |
| `src/components/sections/addable/MessageFormSection.tsx` | **Yeni** |
| `src/components/sections/addable/WorkingHoursMapSection.tsx` | **Yeni** |
| `src/components/sections/addable/OnlineConsultationSection.tsx` | **Yeni** |
| `src/components/sections/addable/InsuranceSection.tsx` | **Yeni** |
| `src/components/sections/addable/MenuHighlightsSection.tsx` | **Yeni** |
| `src/components/sections/addable/RoomAvailabilitySection.tsx` | **Yeni** |
| `src/components/sections/addable/CaseEvaluationSection.tsx` | **Yeni** |
| `src/components/sections/addable/BeforeAfterSection.tsx` | **Yeni** |
| `src/components/sections/addable/PetRegistrationSection.tsx` | **Yeni** |
| `src/components/sections/registry.ts` | **Guncelleme** — 11 yeni bilesen |
| `src/components/editor/useEditorState.ts` | **Guncelleme** — addableSections state + toggle |
| `src/components/editor/AddableSectionsPanel.tsx` | **Yeni** — toggle panel UI |
| `src/components/editor/EditorCanvas.tsx` | **Guncelleme** — panel entegrasyonu |
| `src/components/editor/SiteEditor.tsx` | **Guncelleme** — prop aktarimi |

### Degismeyecekler

- Mevcut section bilesenleri (Hero, Services vb.)
- Template tanimlari (`definitions.ts`)
- Routing ve auth mantigi
- Template secim/uygulama akisi
- `applyTemplate` projectData olmadan cagrildiginda mevcut davranis

