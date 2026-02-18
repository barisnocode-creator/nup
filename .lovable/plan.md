

## ChaiBuilder SDK'yi Kaldirma ve Ozel Editor Kurma Plani

Bu plan, mevcut ChaiBuilder SDK bagimliligini tamamen kaldirip, Durable.co tarzi bir ozel editor sistemi olusturmayi kapsar.

### Mevcut Durum

Sistem su anda ChaiBuilder SDK uzerinden calisir:
- `@chaibuilder/sdk` paketi editoru, canvas'i, blok sistemini ve render motorunu saglar
- `chai_blocks` JSON dizisi veritabaninda saklanir
- `RenderChaiBlocks` ile yayinlanan siteler render edilir
- `deploy-to-netlify` Edge Function'i bloklari statik HTML'e donusturur

### Yeni Mimari

```text
+------------------+     +------------------+     +------------------+
|   Editor Page    |     |  Section Data    |     |  Renderer        |
|  (Project.tsx)   | --> |  (sections JSON) | --> |  (SectionRenderer)|
|                  |     |  DB: sections    |     |  Ayni bilesenler |
|  Tikla & Duzenle |     |  DB: site_theme  |     |  editor + public |
+------------------+     +------------------+     +------------------+
```

### Veri Modeli (Yeni)

Mevcut `chai_blocks` ve `chai_theme` yerine:

```text
projects tablosu:
  site_sections: jsonb   -- bolum dizisi
  site_theme: jsonb      -- tema ayarlari

site_sections ornegi:
[
  {
    "id": "hero_1",
    "type": "hero-centered",
    "locked": true,
    "props": {
      "title": "Hosgeldiniz",
      "subtitle": "Dijital Cozumler",
      "description": "...",
      "backgroundImage": "",
      "primaryButtonText": "Iletisime Gec",
      "primaryButtonLink": "#contact"
    }
  },
  {
    "id": "services_1",
    "type": "services-grid",
    "props": {
      "sectionTitle": "Hizmetlerimiz",
      "services": [...]
    }
  }
]

site_theme ornegi:
{
  "colors": {
    "primary": "#f97316",
    "background": "#ffffff",
    "foreground": "#1a1a1a",
    ...
  },
  "fonts": { "heading": "Inter", "body": "Inter" },
  "borderRadius": "0.5rem"
}
```

### Dosya Degisiklikleri

#### Faz 1: Veri Katmani

| Dosya | Islem |
|-------|-------|
| DB migration | `site_sections` (jsonb) ve `site_theme` (jsonb) kolonlarini `projects` tablosuna ekle |
| `public_projects` view | Yeni kolonlari dahil et |

#### Faz 2: Bolum Bilesenleri (Yeniden Kullanilanlar)

Mevcut ChaiBuilder blok bilesenlerinin icerikleri (HTML/CSS) korunacak, ancak SDK bagimliliklari (`registerChaiBlock`, `builderProp`, `ChaiBlockComponentProps`) kaldirilacak. Her bilesenin duz React bilesenine donusturulmesi gerekir.

| Dosya | Islem |
|-------|-------|
| `src/components/sections/HeroCentered.tsx` | Yeni: saf React bilesen, props'dan render |
| `src/components/sections/HeroSplit.tsx` | Yeni: saf React bilesen |
| `src/components/sections/HeroOverlay.tsx` | Yeni: saf React bilesen |
| `src/components/sections/ServicesGrid.tsx` | Yeni: saf React bilesen |
| `src/components/sections/AboutSection.tsx` | Yeni: saf React bilesen |
| `src/components/sections/StatisticsCounter.tsx` | Yeni: saf React bilesen |
| `src/components/sections/TestimonialsCarousel.tsx` | Yeni: saf React bilesen |
| `src/components/sections/ContactForm.tsx` | Yeni: saf React bilesen |
| `src/components/sections/CTABanner.tsx` | Yeni: saf React bilesen |
| `src/components/sections/FAQAccordion.tsx` | Yeni: saf React bilesen |
| `src/components/sections/ImageGallery.tsx` | Yeni: saf React bilesen |
| `src/components/sections/PricingTable.tsx` | Yeni: saf React bilesen |
| `src/components/sections/AppointmentBooking.tsx` | Yeni: saf React bilesen |
| `src/components/sections/NaturalHeader.tsx` | Yeni: saf React bilesen |
| `src/components/sections/NaturalHero.tsx` | Yeni: saf React bilesen |
| `src/components/sections/NaturalIntro.tsx` | Yeni: saf React bilesen |
| `src/components/sections/NaturalArticleGrid.tsx` | Yeni: saf React bilesen |
| `src/components/sections/NaturalNewsletter.tsx` | Yeni: saf React bilesen |
| `src/components/sections/NaturalFooter.tsx` | Yeni: saf React bilesen |
| `src/components/sections/SectionRenderer.tsx` | Yeni: type->bilesen esleme, tek render noktasi |
| `src/components/sections/registry.ts` | Yeni: bolum tipi kayit defteri |
| `src/components/sections/EditableImage.tsx` | Mevcut `EditableChaiImage` mantigi, SDK bagimliligi olmadan |

#### Faz 3: Ozel Editor (Durable.co Tarzi)

| Dosya | Islem |
|-------|-------|
| `src/components/editor/SiteEditor.tsx` | Ana editor bileseni: toolbar + canvas + sag panel |
| `src/components/editor/EditorCanvas.tsx` | Bolum listesini render eder, tiklamada secim yapar |
| `src/components/editor/EditorToolbar.tsx` | Ust cubuk: Dashboard, Onizleme, Yayinla, Ozelestir |
| `src/components/editor/SectionEditPanel.tsx` | Sag yandaki floating panel: icerik + stil duzenleme |
| `src/components/editor/SectionOverlay.tsx` | Hover/secim efektleri, aksiyon kutucuklari |
| `src/components/editor/AddSectionPanel.tsx` | Bolum ekleme paneli (sol) |
| `src/components/editor/CustomizePanel.tsx` | Tema renkleri, fontlar, koseleri duzenleme |
| `src/components/editor/InlineTextEditor.tsx` | Dogrudan metin duzenleme (contentEditable) |
| `src/components/editor/useEditorState.ts` | Editor durumu yonetimi (secili bolum, duzenleme modu) |
| `src/components/editor/useSiteSave.ts` | Otomatik kaydetme hook'u |

Editor Ozellikleri:
- Bolume tikla -> sag panelde icerik alanlari (baslik, aciklama, buton metni vb.)
- Bolume tikla -> stil sekmesinde baslik boyutu, renk, arka plan secenekleri
- Bolumler arasi surukleme (yukari/asagi butonlari) ile siralama
- Bolum silme (kilit olanlar haric)
- Yeni bolum ekleme (sol panel)
- Gorsel degistirme: mevcut Pixabay entegrasyonu korunacak
- Dogrudan metin duzenleme: basliga tiklayinca yerinde duzenleme
- Tema ozellestirme: renkler, fontlar (ust toolbar'dan)

#### Faz 4: Project.tsx Guncelleme

| Dosya | Islem |
|-------|-------|
| `src/pages/Project.tsx` | `USE_CHAI_BUILDER` kaldirilir, `SiteEditor` kullanilir |

#### Faz 5: Yayinlama Guncelleme

| Dosya | Islem |
|-------|-------|
| `src/pages/PublicWebsite.tsx` | `RenderChaiBlocks` yerine `SectionRenderer` kullanilir |
| `supabase/functions/deploy-to-netlify/index.ts` | `site_sections` + `site_theme` okur (mevcut HTML renderer'lar zaten var) |

#### Faz 6: Temizlik

| Dosya/Klasor | Islem |
|-------|-------|
| `src/components/chai-builder/` | Tum klasor silinir |
| `src/styles/chaibuilder.tailwind.css` | Silinir |
| `tailwind.chaibuilder.config.ts` | Silinir |
| `package.json` | `@chaibuilder/sdk` kaldirilir |
| `src/components/grapes-editor/` | Silinir (zaten devre disi) |
| `grapesjs` ve ilgili paketler | Kaldirilir |

#### Faz 7: Template ve Migration

| Dosya | Islem |
|-------|-------|
| `src/templates/catalog/definitions.ts` | `TemplateSectionDef` yeni formata uyarlanir |
| Migration hook | Mevcut `chai_blocks` verisini `site_sections`'a donusturen tek seferlik migration |

### Korunan Oge ve Yaklasimlar

- **Pixabay gorsel arama/degistirme**: `InlineImageSwitcher` ve `PixabayImagePicker` korunur, SDK bagimliligi kaldirilir
- **Tema CSS degiskenleri**: `--primary`, `--background` vb. aynen korunur
- **deploy-to-netlify HTML renderer'lari**: Mevcut blok->HTML donusturuculer aynen calisir, sadece veri kaynagi degisir
- **Randevu sistemi**: Bolum bilesen olarak korunur
- **Iletisim formu**: Bolum bilesen olarak korunur

### Onemli Notlar

- Bu degisiklik 40-50 dosyayi etkiler ve birden fazla adimda uygulanmalidir
- Mevcut projelerin `chai_blocks` verisi, yeni `site_sections` yapisina migration gerektirir
- Yayinlanmis sitelerin bozulmamasi icin `deploy-to-netlify` fonksiyonu geriye uyumlu olmalidir
- Her faz bagimsiz test edilebilir olmalidir

