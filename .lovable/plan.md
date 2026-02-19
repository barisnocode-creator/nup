

## Bolum Ekle — Tam Ekran Gorsel Galeri Tasarimi

Mevcut `AddSectionPanel` (dar kenar cubugu, sadece metin listesi) yerine, `ChangeTemplateModal` ile ayni tasarim dilinde tam ekran bir modal olusturulacak. Her section tipi yatay (landscape) bir ekran goruntusu karti olarak gosterilecek.

### Mevcut Durum

- `AddSectionPanel.tsx`: 280px genisliginde yan panel, sadece metin butonlari
- 30+ section tipi mevcut (`sectionCatalog` dizisinde)
- Kategoriler: hero, content, contact, cta, cafe, dental, restaurant, hotel, portfolio

### Yeni Tasarim

Template carousel ile ayni gorunumde ama **yatay kartlarla** calisacak tam ekran modal.

```text
┌──────────────────────────────────────────────────────────────────┐
│  Bolum Ekle                                        [Karistir] X │
│  Sayfaniza yeni bolumler ekleyin                                 │
├──────────────────────────────────────────────────────────────────┤
│  [Tumu] [Hero] [Icerik] [Iletisim] [Sektor Ozel]               │
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────    │
│  │  (gorsel)    │ │  (gorsel)    │ │  (gorsel)    │ │            │
│  │             │ │             │ │             │ │             │
│  │─ gradient ──│ │─ gradient ──│ │─ gradient ──│ │             │
│  │ Hizmetler   │ │ Hakkimizda  │ │ Iletisim    │ │             │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  [Iptal]                                    [Bolumu Ekle ->]     │
└──────────────────────────────────────────────────────────────────┘
```

### Degisiklikler

| Dosya | Islem |
|-------|-------|
| `src/components/editor/AddSectionPanel.tsx` | **Tam yeniden yazim** — tam ekran modal, yatay carousel, gorsel kartlar |
| `src/components/editor/SiteEditor.tsx` | **Guncelleme** — AddSectionPanel'i Dialog olarak acma |
| `src/assets/section-previews/` | **Yeni** — her section tipi icin yatay ekran goruntusu gorselleri |

### 1. Section Onizleme Gorselleri

Her section tipi icin yatay (landscape, 16:9 oran) ekran goruntusu uretilecek. Gorseller section'in gercek gorunumunu yansitacak:

**Hero Kategorisi (8 adet):**
- `hero-centered.jpg` — Ortalanmis baslik, CTA butonlari, arka plan gorseli
- `hero-split.jpg` — Sol metin, sag gorsel iki kolonlu yapi
- `hero-overlay.jpg` — Tam arka plan uzerine overlay metin
- `hero-cafe.jpg` — Cafe temali hero, sicak tonlar
- `hero-dental.jpg` — Dental klinik hero, mavi tonlar
- `hero-restaurant.jpg` — Restoran hero, koyu elegant
- `hero-hotel.jpg` — Otel hero, luks altin tonlar
- `hero-portfolio.jpg` — Portfolio hero, minimal koyu

**Icerik Kategorisi (8 adet):**
- `services-grid.jpg` — 3 kolonlu hizmet kartlari
- `about-section.jpg` — Gorsel + metin yan yana
- `statistics-counter.jpg` — 4 buyuk rakam istatistik
- `testimonials-carousel.jpg` — Musteri yorum karuseli
- `faq-accordion.jpg` — Acilir kapanir SSS listesi
- `image-gallery.jpg` — Grid gorsel galerisi
- `pricing-table.jpg` — Fiyat plan kartlari
- `cta-banner.jpg` — Tam genislik CTA bandi

**Iletisim Kategorisi (2 adet):**
- `contact-form.jpg` — Iletisim formu
- `appointment-booking.jpg` — Randevu formu

**Sektor Ozel (12 adet):**
- `menu-showcase.jpg`, `cafe-story.jpg`, `cafe-features.jpg`, `cafe-gallery.jpg`
- `dental-services.jpg`, `dental-tips.jpg`, `dental-booking.jpg`
- `chef-showcase.jpg`, `restaurant-menu.jpg`
- `room-showcase.jpg`, `hotel-amenities.jpg`
- `project-showcase.jpg`, `skills-grid.jpg`

Toplam: ~30 gorsel. Bunlar `imagegen` ile uretilecek, her biri ilgili section'in gercekci bir web sitesi ekran goruntusu olacak.

### 2. AddSectionPanel — Tam Ekran Modal

**Modal Kabugu:**
- `w-screen h-screen max-w-none` (tam ekran, ChangeTemplateModal ile ayni)
- `bg-white` govde, `bg-gray-50` header/footer
- Radix Dialog kullanilir

**Header:**
- Baslik: "Bolum Ekle" (text-2xl font-bold text-gray-900)
- Alt yazi: "Sayfaniza yeni bir bolum ekleyin" (text-sm text-gray-500)

**Kategori Filtre Tablari:**
- Yatay tab/chip grubu: `Tumu | Hero | Icerik | Iletisim | Aksiyon | Sektor Ozel`
- Secili tab: `bg-orange-500 text-white rounded-full`
- Diger: `bg-gray-100 text-gray-600 hover:bg-gray-200`
- Sektor ozel tab: kullanicinin sektorune gore otomatik filtreleme

**Kart Tasarimi:**
- Boyut: `w-[320px] h-[220px]` (yatay/landscape oran)
- `rounded-xl overflow-hidden cursor-pointer`
- Gorsel: `object-cover w-full h-full`
- Alt kisimda sabit gradient overlay ile section adi (beyaz yazi)
- Hover: `ring-2 ring-orange-500` + hafif scale
- Secili: `ring-3 ring-orange-500 border-2 border-orange-500`

**Carousel Konteyneri:**
- `flex flex-row flex-wrap gap-5 overflow-y-auto` (yatay kartlar wrap olarak asagi akar)
- Alternatif: tek satir yatay kaydirma yerine, genis ekranda 3-4 kart yan yana grid

**Alt Aksiyon Cubugu:**
- "Iptal": `variant="outline"`, modal kapatir
- "Bolumu Ekle": `bg-orange-500 text-white`, secili section'i ekler
- `disabled` eger hicbir section secilmemisse

### 3. State Yonetimi

```text
selectedSectionType: string | null  — tiklaninca secilir
activeCategory: string — 'all' | 'hero' | 'content' | 'contact' | 'cta' | 'sector'
```

Kart tiklaninca `setSelectedSectionType(type)` cagrilir.
"Bolumu Ekle" tiklaninca `onAdd(selectedSectionType, defaultPropsMap[selectedSectionType])` cagirilir ve modal kapanir.

### 4. SiteEditor Entegrasyonu

`SiteEditor.tsx` icerisindeki `AddSectionPanel` kullanimi guncellenir:
- Artik yan panel degil, tam ekran Dialog olarak acilir
- `editor.addPanelOpen` state'i ayni kalir
- `onAdd` callback'i ayni kalir, sadece sarmalayici degisir

### 5. Sektor Filtreleme

`projectData?.sector` mevcutsa:
- "Sektor Ozel" tabinda sadece o sektore uyumlu section'lar gosterilir
- ChangeTemplateModal'daki `incompatibleSections` mantigi burada da kullanilir
- Uyumsuz section'lar tamamen gizlenir (siralama degil, gizleme)

### Uygulama Sirasi

1. Section preview gorsellerini uret (~30 adet yatay ekran goruntusu)
2. `AddSectionPanel.tsx` yeniden yaz — tam ekran modal, gorsel kartlar, kategori filtreleme
3. `SiteEditor.tsx` guncelle — Dialog sarmalayici

### Korunanlar

- `sectionCatalog` ve `sectionRegistry` degismez
- `defaultPropsMap` korunur (AddSectionPanel icinde kalir)
- `onAdd` callback imzasi degismez
- `useEditorState` degismez

