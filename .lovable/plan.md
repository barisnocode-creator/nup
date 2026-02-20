
## Yeni "MedCare Pro" Doktor Şablonu — GitHub'ın En Popüler Sağlık Şablonlarından İlham Alan, Tam Animasyonlu, Pixabay Entegrasyonlu Tasarım

### Mevcut Durumun Analizi

Sistemdeki 5 şablon şu an şu sorunları taşıyor:
- **Specialty Cafe** → Doktor/avukat sektörlerinde hâlâ kahve temalı bileşenler görünüyor
- **HeroCentered / HeroSplit / HeroOverlay** → Pixabay picker entegrasyonu **yok** (backgroundImage alanı var ama "Görseli Değiştir" butonu eklenmemiş)
- **Tüm şablonlarda** `backgroundImage` prop olan ama picker olmayan bileşenler var
- **Varsayılan şablon** (specialty-cafe) doktor sektörü için yetersiz — kahve teması bileşenlerinin tamamı avukat/doktor gibi sektörler için anlamsız

### GitHub'ın En Popüler Sağlık Şablonlarından İlham

GitHub'da en çok yıldız alan doktor/sağlık şablonları analiz edildiğinde ortak bileşenler:
1. **Fullscreen hero** — Gradyanlı veya görsel arka planıyla büyük başlık, istatistik rozetleri
2. **Hizmet kartları** — İkon + başlık + açıklama, hover animasyonu
3. **Doktor profil grid'i** — Ekip tanıtımı kartları
4. **Güven göstergeleri** — Rakamlarla: hasta sayısı, yıl deneyimi, başarı oranı
5. **Randevu formu** — Adımlı veya tek formlu
6. **Testimonials** — Hasta yorumları
7. **SSS** — Hizmet soruları
8. **CTA** — Ücretsiz ilk muayene vurgusu

### Plan: 3 Paralel İş Kolu

---

### İş Kolu A — Yeni `HeroMedical` Bileşeni (Yeni Dosya)

**Dosya:** `src/components/sections/HeroMedical.tsx`

GitHub'ın en çok beğenilen sağlık hero'larından esinlenen, React + framer-motion animasyonlu yeni bir hero bileşeni:

**Tasarım:**
- Sol: Başlık (stagger animasyonuyla harf harf gelen), açıklama, CTA butonu, altında 3 istatistik rozeti (12K+ Hasta, 95% Memnuniyet, 20+ Yıl)
- Sağ: Sektöre göre Pixabay'dan çekilen büyük görsel, üzerinde floating badge (Ücretsiz İlk Muayene)
- Arka plan: Temiz beyaz + soft gradient blobs (primary/10 renk)
- Animasyon: Her element sırayla fade+slide-up (stagger 0.15s aralıklarla)
- Pixabay picker: Görsel üzerine hover → "Görseli Değiştir" butonu

**Renkler:** CSS variables kullanır → tema ile tam uyumlu

```
Layout:
┌─────────────────────────────────────────────────────┐
│  [Badge: Uzman Klinik]                              │
│  Sağlığınız İçin                                    │  [Doktor Görseli]
│  Profesyonel Bakım                                  │  
│  Lorem ipsum lorem...                               │  [Pixabay değiştir]
│                                                     │
│  [Randevu Al →]  [Hizmetlerimiz]                    │  
│                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐                       │
│  │ 12K+ │  │ 95%  │  │ 20+  │                       │
│  │Hasta │  │Mem.  │  │ Yıl  │                       │
│  └──────┘  └──────┘  └──────┘                       │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `badge`, `title`, `description`, `primaryButtonText`, `secondaryButtonText`
- `image` (Pixabay), `stat1Value/Label`, `stat2Value/Label`, `stat3Value/Label`
- `_sector` (otomatik Pixabay query için)

---

### İş Kolu B — Yeni `MedCare Pro` Şablon Tanımı

**Dosya:** `src/templates/catalog/definitions.ts`

Yeni şablon eklenir, mevcut 5 şablona ek olarak 6. şablon:

```ts
export const medcarePro: TemplateDefinition = {
  id: 'medcare-pro',
  name: 'MedCare Pro',
  industry: 'health',
  category: 'Sağlık',
  description: 'GitHub\'ın en popüler sağlık şablonlarından ilham alan, animasyonlu doktor ve klinik tasarımı.',
  themePresetKey: 'medcare-pro',
  supportedIndustries: ['doctor', 'dentist', 'clinic', 'hospital', 'medical', 'veterinary', 'health', 'physiotherapy', 'optometry', 'pharmacy', 'lawyer', 'beauty_salon', 'gym'],
  sections: [
    { type: 'HeroMedical', required: true, defaultProps: { ... } },
    { type: 'ServicesGrid', defaultProps: { ... } },
    { type: 'StatisticsCounter', defaultProps: { ... } },
    { type: 'AboutSection', defaultProps: { ... } },
    { type: 'TestimonialsCarousel', defaultProps: { ... } },
    { type: 'FAQAccordion', defaultProps: { ... } },
    { type: 'AppointmentBooking', defaultProps: { ... } },
    { type: 'CTABanner', defaultProps: { ... } },
    { type: 'ContactForm', defaultProps: { ... } },
  ],
};
```

**Theme Preset** (`themes/presets.ts`):
```ts
// MedCare Pro — clean white bg, medical green/teal accent
export const medcareProPreset: ThemePresetValues = {
  fontFamily: { heading: "Plus Jakarta Sans", body: "Inter" },
  borderRadius: "12px",
  colors: {
    background: ["#f8fffe", "#0a1a15"],
    foreground: ["#0d2618", "#e8f5f0"],
    primary: ["#059669", "#34d399"],
    "primary-foreground": ["#ffffff", "#0a1a15"],
    secondary: ["#ecfdf5", "#1a2e24"],
    // ...
  },
};
```

---

### İş Kolu C — Pixabay Picker'ı Eksik Bileşenlere Ekle

Şu an Pixabay picker **olmayan** ama görsel kullanan bileşenler:

| Bileşen | Görsel Prop | Eksik |
|---|---|---|
| `HeroCentered` | `backgroundImage` | picker yok |
| `HeroSplit` | `image` | picker yok |
| `HeroOverlay` | `backgroundImage` | picker yok |
| `StatisticsCounter` | yok | — |

**`HeroCentered.tsx`** → `backgroundImage` üzerine hover overlay + `PixabayImagePicker` ekle
**`HeroSplit.tsx`** → `image` üzerine hover overlay + picker ekle
**`HeroOverlay.tsx`** → `backgroundImage` için picker ekle (şu an yalnızca gradient fallback var)

Her 3 bileşen için uygulanan **standart pattern:**
```tsx
const [pickerOpen, setPickerOpen] = useState(false);
// Görsel alanı üzerine:
{isEditing && (
  <button
    onClick={() => setPickerOpen(true)}
    className="absolute top-3 right-3 ... opacity-0 group-hover:opacity-100"
  >
    <ImageIcon /> Görseli Değiştir
  </button>
)}
<PixabayImagePicker
  isOpen={pickerOpen}
  onClose={() => setPickerOpen(false)}
  onSelect={(url) => onUpdate?.({ backgroundImage: url })}  // veya image
  defaultQuery={getSectorImageQuery('hero', sector)}
/>
```

---

### İş Kolu D — Varsayılan Şablonu Güncelle

**Dosya:** `src/templates/index.ts`

Şu an `DEFAULT_TEMPLATE_ID = 'specialty-cafe'`. Bu her sektörde kahve temalı bir site başlatıyor.

Yeni mantık: Wizard'dan gelen sektör bilgisine göre akıllı varsayılan seçim:

```ts
export const DEFAULT_TEMPLATE_ID = 'medcare-pro';  // Genel varsayılan

export function selectDefaultTemplate(sector: string): string {
  if (['doctor', 'dentist', 'clinic', 'lawyer', 'pharmacy', 'veterinary', 'gym', 'beauty_salon'].includes(sector)) {
    return 'medcare-pro';
  }
  if (['restaurant', 'bistro', 'fine_dining'].includes(sector)) {
    return 'restaurant-elegant';
  }
  if (['cafe', 'coffee', 'bakery'].includes(sector)) {
    return 'specialty-cafe';
  }
  if (['hotel', 'resort'].includes(sector)) {
    return 'hotel-luxury';
  }
  if (['developer', 'engineer', 'consultant', 'freelancer'].includes(sector)) {
    return 'engineer-portfolio';
  }
  return 'medcare-pro';  // Bilinmeyen sektörler için
}
```

Bu fonksiyon wizard ve proje oluşturma akışında kullanılacak.

---

### Değişecek / Oluşturulacak Dosyalar

| # | Dosya | İşlem | Açıklama |
|---|---|---|---|
| 1 | `src/components/sections/HeroMedical.tsx` | **YENİ** | Tam animasyonlu tıbbi hero bileşeni |
| 2 | `src/templates/catalog/definitions.ts` | Güncelle | `medcarePro` tanımı + `allDefinitions`'a ekle |
| 3 | `src/themes/presets.ts` | Güncelle | `medcareProPreset` + `templateToPreset`'e ekle |
| 4 | `src/components/sections/registry.ts` | Güncelle | `HeroMedical` kaydı |
| 5 | `src/templates/index.ts` | Güncelle | `selectDefaultTemplate` akıllı sektör routing |
| 6 | `src/components/sections/HeroCentered.tsx` | Güncelle | Pixabay picker ekle |
| 7 | `src/components/sections/HeroSplit.tsx` | Güncelle | Pixabay picker ekle |
| 8 | `src/components/sections/HeroOverlay.tsx` | Güncelle | Pixabay picker ekle |
| 9 | `src/templates/catalog/mappers/index.ts` | Güncelle | `HeroMedical`'i mevcut mapper zinciriyle eşleştir |

---

### HeroMedical Animasyon Detayı

Framer Motion ile uygulanan animasyon sıralaması:

```
t=0.0s: Badge → fade+slideUp
t=0.2s: Ana başlık → fade+slideUp
t=0.4s: Açıklama → fade+slideUp
t=0.6s: Butonlar → fade+slideUp
t=0.8s: İstatistik rozetleri → fade+scale (ardışık)
t=0.3s: Görsel → fade+scale (sağ kolonda, soldan bağımsız)
```

Intersection Observer ile sayfa kaydırıldığında tetiklenen animasyonlar da ayrıca istatistik rozetleri için kullanılacak.

---

### Sonuç: Kullanıcı Deneyimi

**Yeni bir site kurulduğunda (doktor sektörü):**
1. Wizard → sektör = "doktor"
2. `selectDefaultTemplate('doctor')` → `'medcare-pro'` döner
3. `applyTemplate('medcare-pro', projectData)` → `HeroMedical` bileşeni gelir
4. `mapHeroSection` → başlık, açıklama, badge sektöre göre doldurulur
5. `_sector: 'doctor'` prop'u → `HeroMedical` otomatik "medical clinic doctor hospital" query'siyle Pixabay açar
6. Kullanıcı görsele hover yapınca "Görseli Değiştir" → gerçek doktor görseli seçer

**Animasyon kalitesi:** Mevcut `HeroDental`'ın seviyesinde veya üstünde — `framer-motion` stagger animasyonları, floating badge, intersection-triggered istatistikler.

**Diğer sektörler (avukat, gym, güzellik salonu):** Aynı `medcare-pro` şablonunu kullanır, `mapHeroSection` + `mapServicesSection` + `mapCtaSection` üçlüsü içeriği sektöre göre otomatik adapte eder.
