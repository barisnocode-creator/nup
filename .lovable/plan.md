
## Amaç

"Sayfanıza Eklenebilir Bölümler" kutusunu web sitesi önizlemesinden kaldırıp yerine gerçek bir **Footer (Alt Bilgi) bölümü** koymak. Bu footer site haritası, navigasyon linkleri, iletişim bilgileri ve sosyal medya ikonları içerecek.

---

## Mevcut Durum

`EditorCanvas.tsx` dosyasının en altında şu kod var:

```tsx
{isEditing && onToggleAddableSection && (
  <AddableSectionsPanel
    sector={sector}
    addableSections={addableSections}
    onToggle={onToggleAddableSection}
  />
)}
```

Bu, önizlemede mavi kenarlıklı "Sayfanıza Eklenebilir Bölümler" kutusunu gösteriyor. Özelleştir panelinde zaten aynı toggle'lar var, bu yüzden buradaki gösterim gereksiz.

---

## Yapılacaklar (3 Dosya)

### 1. `src/components/sections/addable/SiteFooter.tsx` — YENİ DOSYA

Sitelerin altında gösterilecek modern footer bileşeni. Site section'ı olarak kayıt edilecek (`AddableSiteFooter` tipi), ancak editörde her zaman en altta görünecek.

Footer içeriği:
- **Marka Kolonu**: Site adı + tagline + kısa açıklama
- **Site Haritası Kolonu**: Ana Sayfa, Hakkımızda, Hizmetler, İletişim linkleri
- **Hizmetler Kolonu**: İlk 3-4 hizmet adı (props'tan veya sabit)
- **İletişim Kolonu**: Telefon, E-posta, Adres (props'tan)
- **Alt Çubuk**: Telif hakkı yılı + "Powered by Open Lucius" (küçük, soluk)

Tasarım:
```
┌─────────────────────────────────────────────────────┐
│  Site Adı          Site Haritası   Hizmetler   İletişim │
│  Tagline           Ana Sayfa       Hizmet 1    📞 Tel  │
│  Açıklama...       Hakkımızda      Hizmet 2    📧 Mail │
│                    Hizmetler       Hizmet 3    📍 Adres│
│                    İletişim                            │
├─────────────────────────────────────────────────────┤
│  © 2026 Site Adı. Tüm hakları saklıdır.              │
└─────────────────────────────────────────────────────┘
```

Props: `siteName`, `tagline`, `address`, `phone`, `email`, `service1`..`service4` (section props'tan okunur; yoksa placeholder gösterilir)

---

### 2. `src/components/sections/registry.ts` — GÜNCELLE

`AddableSiteFooter` tipini `SiteFooter` bileşeniyle kaydet:

```typescript
import { SiteFooter } from './addable/SiteFooter';
// ...
'AddableSiteFooter': SiteFooter,
```

---

### 3. `src/components/editor/EditorCanvas.tsx` — GÜNCELLE

**Kaldır**: `AddableSectionsPanel` bloğunu tamamen sil.

**Ekle**: Her zaman en altta bir `SiteFooter` bileşeni render et (sections içinde olsun ya da olmasın):

```tsx
// Eski (SİL):
{isEditing && onToggleAddableSection && (
  <AddableSectionsPanel ... />
)}

// Yeni (EKLE):
<SiteFooter
  section={{
    id: '__footer__',
    type: 'AddableSiteFooter',
    props: {
      siteName: footerProps.siteName,
      tagline: footerProps.tagline,
      phone: footerProps.phone,
      email: footerProps.email,
      address: footerProps.address,
    }
  }}
  isEditing={isEditing}
/>
```

Footer için `siteName`, `phone`, `email`, `address` verileri sections içindeki mevcut bölümlerden (hero, contact-form vs.) otomatik çekilecek. Bunun için EditorCanvas'a `footerData` prop'u eklenir veya sections array içinden ilk hero/contact section props'u parse edilir.

---

## Footer'da Dinamik Site Haritası

Footer, sayfada hangi section tipleri bulunduğuna göre linkleri otomatik oluşturur:

| Section tipi varsa | Footer'da link göster |
|---|---|
| `about-section`, `AboutSection` | "Hakkımızda" |
| `services-grid`, `ServicesGrid` | "Hizmetler" |
| `contact-form`, `ContactForm` | "İletişim" |
| `faq-accordion`, `AddableFAQ` | "Sık Sorulan Sorular" |
| `AddableBlog` | "Blog" |
| `appointment-booking`, `AddableAppointment` | "Randevu" |

Böylece footer, kullanıcının aktif ettiği bölümlere göre kendini günceller.

---

## Footer'da Veri Kaynağı

Site adı, telefon, e-posta, adres için sections içinden otomatik okuma:

```typescript
// EditorCanvas veya SiteFooter içinde
const heroSection = sections.find(s => s.type.includes('hero') || s.type.includes('Hero'));
const contactSection = sections.find(s => s.type.includes('contact') || s.type.includes('Contact'));

const footerData = {
  siteName: heroSection?.props?.siteName || heroSection?.props?.title || 'Site Adı',
  tagline: heroSection?.props?.subtitle || heroSection?.props?.tagline || '',
  phone: contactSection?.props?.phone || heroSection?.props?.phone || '',
  email: contactSection?.props?.email || '',
  address: contactSection?.props?.address || '',
};
```

---

## Değiştirilecek / Oluşturulacak Dosyalar

| # | Dosya | İşlem |
|---|---|---|
| 1 | `src/components/sections/addable/SiteFooter.tsx` | YENİ — Modern site footer bileşeni |
| 2 | `src/components/sections/registry.ts` | `AddableSiteFooter` kaydı |
| 3 | `src/components/editor/EditorCanvas.tsx` | Panel kaldır, Footer ekle |
