
## Sitede Üst Navigasyon (Header) Ekleme ve İçerik İyileştirmesi

### Sorun Teşhisi

Ekran görüntüsünde 2 ayrı sorun tespit edildi:

**Sorun 1 — Üst navigasyon görünmüyor**
`site_sections` veritabanı kaydında şu 10 bölüm var:
`HeroMedical → ServicesGrid → StatisticsCounter → AboutSection → TestimonialsCarousel → FAQAccordion → AppointmentBooking → CTABanner → ContactForm → AddableSiteFooter`

Bu dizide **bir header/navbar bileşeni yok**. HeroMedical bölümünün içinde navigasyon menüsü bulunmuyor — sadece hero içeriği var. Dolayısıyla sitenin üst kısmında "Ana Sayfa / Hizmetler / İletişim" gibi navigasyon linkleri hiç render edilmiyor.

**Sorun 2 — Editör mobilde sıkışık görünüyor**
EditorToolbar `h-14` yüksekliğinde ve mobilde tüm genişliği kaplıyor; orta bölümdeki Düzenle/Önizleme + cihaz toggle butonları mobil ekranda sığmıyor.

---

### Çözüm Planı — 3 Dosya Değişikliği

---

#### Değişiklik 1: `SiteHeader` bileşeni ekle (YENİ DOSYA)
`src/components/sections/addable/SiteHeader.tsx`

Sitenin üst kısmında gösterilecek şeffaf/blur navigasyon barı:

- Scroll'da arka plan blur/opak olur (sticky davranış)
- Logo: Badge prop'undan veya siteName'den alınır
- Navigasyon linkleri: Mevcut `site_sections`'a bakarak otomatik üretilir (ServicesGrid varsa "Hizmetler", ContactForm varsa "İletişim" vb.)
- Mobilde hamburger menü
- Randevu Al butonu (primary renk ile)
- `SectionComponentProps` interface'ini implement eder, section registry'e eklenir

```tsx
// Navigasyon linkleri otomatik oluşturma mantığı:
// sections prop'undan section type'lara bakılır, label'lar üretilir
const navItems = [
  { label: 'Ana Sayfa', anchor: 'hero' },
  // ServicesGrid varsa:
  { label: 'Hizmetler', anchor: 'services' },
  // AboutSection varsa:
  { label: 'Hakkımızda', anchor: 'about' },
  // FAQAccordion varsa:
  { label: 'SSS', anchor: 'faq' },
  // ContactForm varsa:
  { label: 'İletişim', anchor: 'contact' },
];
```

---

#### Değişiklik 2: `registry.ts` — SiteHeader'ı kaydet

```typescript
import { SiteHeader } from './addable/SiteHeader';
// ...
'AddableSiteHeader': SiteHeader,
```

---

#### Değişiklik 3: `EditorCanvas.tsx` — Otomatik SiteHeader inject et

`EditorCanvas`'ta, bölümler render edilmeden önce, eğer `sections` içinde `AddableSiteHeader` yoksa, canvas'ın en üstüne otomatik olarak `SiteHeader`'ı ekle:

```tsx
// sections[0].type.includes('Hero') ise ve AddableSiteHeader yoksa:
<SiteHeader section={{ id: '__header__', type: 'AddableSiteHeader', props: {} }} sections={sections} />
{sections.map(...)}
```

Bu sayede mevcut projelerde (ve yeni projelerde) her zaman üst navigasyon görünür olacak.

---

#### Değişiklik 4 (Bonus): `EditorToolbar.tsx` — Mobil responsive iyileştirme

Mevcut toolbar'da orta kısımdaki butonlar mobilde sığmıyor. `flex-1 flex items-center justify-center` yapısı mobilde taşıyor.

- `sm:` breakpoint ile device toggle'ı sadece tablet/desktop'ta göster
- Projeismi `max-w-[100px]` mobilde kısalt
- Düzenle/Önizleme toggle'ı mobilde sadece ikon göster

---

### Değişiklik Özeti

| # | Dosya | Ne Değişiyor |
|---|---|---|
| 1 | `src/components/sections/addable/SiteHeader.tsx` | YENİ — sticky blur navbar, auto nav links, hamburger mobil menü |
| 2 | `src/components/sections/registry.ts` | `AddableSiteHeader` kaydı eklenir |
| 3 | `src/components/editor/EditorCanvas.tsx` | Canvas'a otomatik SiteHeader inject edilir (eğer yoksa) |
| 4 | `src/components/editor/EditorToolbar.tsx` | Mobil responsive iyileştirme |

---

### Beklenen Sonuç

| Durum | Önce | Sonra |
|---|---|---|
| Mobil önizleme | Üstte hiç navigasyon yok | Sticky blur header, hamburger menü |
| Masaüstü önizleme | Üstte hiç navigasyon yok | Şeffaf sticky header, linkleri sectionlara göre otomatik oluşur |
| Editör mobilde | Toolbar butonları sığmıyor, taşıyor | Mobil uyumlu, kompakt toolbar |
| Mevcut projeler | Header yok | Otomatik inject edilir, kaydetmek gerekmez |
