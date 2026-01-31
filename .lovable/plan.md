
# Change Template Özelliği - Kapsamlı Uygulama Planı

## Özellik Açıklaması

Customize sidebar'a "Change Template" seçeneği eklenerek, kullanıcıların farklı web sitesi şablonları arasından seçim yapmasını sağlayan yeni bir özellik. Durable.co'nun tasarım yaklaşımına benzer şekilde, tam ekran bir galeri modal'ı ile hazır template görselleri sunulacak.

## Mevcut Durum

- **CustomizeSidebar**: Şu an Colors, Fonts, Corners, Animations gibi seçenekler var ama "Change Template" yok
- **Template Sistemi**: `src/templates/index.ts`'de tek template (temp1 - Healthcare Modern) kayıtlı
- **Mevcut Görseller**: `src/assets/` klasöründe 8 adet showcase görseli mevcut (restaurant, dental, law-office, vs.)
- **Template Değiştirme**: `Project.tsx` zaten `template_id` prop'unu `WebsitePreview`'e geçiriyor

---

## Uygulama Adımları

### 1. Template Önizleme Görselleri Ekleme

**Dosya**: `src/assets/` klasörüne yeni template preview görselleri

Mevcut showcase görsellerini template preview olarak kullanabiliriz. Ancak daha iyi bir deneyim için bunları template olarak yeniden isimlendireceğiz:

```text
Yeni template görselleri (mevcut showcase görsellerinden):
- template-dental-clinic.jpg (showcase-dental.jpg'den)
- template-restaurant.jpg (showcase-restaurant.jpg'den)
- template-law-office.jpg (showcase-law-office.jpg'den)
- template-digital-agency.jpg (showcase-digital-agency.jpg'den)
- template-boutique.jpg (showcase-boutique.jpg'den)
- template-pharmacy.jpg (showcase-pharmacy.jpg'den)
```

### 2. Template Galeri Modal Bileşeni

**Yeni Dosya**: `src/components/website-preview/ChangeTemplateModal.tsx`

```typescript
interface TemplateOption {
  id: string;
  name: string;
  category: string;
  preview: string;
  isCurrentTemplate?: boolean;
}

interface ChangeTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onPreview: (templateId: string) => void;
}
```

**Özellikler**:
- Tam ekran modal (Dialog bileşeni)
- Başlık: "Change template" + alt yazı açıklaması
- Sağ üstte "Regenerate" butonu (template sırasını karıştırır, AI çağırmaz)
- Grid düzeni: 4 sütun (desktop), 2 sütun (tablet), 1 sütun (mobil)
- Her template kartı:
  - Preview görseli (sabit boyut, aspect-ratio korunur)
  - "Your template" rozeti (mevcut template için)
  - Hover'da vurgu efekti
- Seçilen template'de "Details" ve "Preview" butonları

### 3. CustomizeSidebar Güncellemesi

**Dosya**: `src/components/website-preview/CustomizeSidebar.tsx`

Yeni menu item ekleme:
```typescript
const menuItems = [
  { id: 'template' as const, icon: LayoutGrid, label: 'Change Template', isAction: true },
  // ... mevcut menu items
];
```

Yeni prop'lar:
```typescript
interface CustomizeSidebarProps {
  // ... mevcut props
  currentTemplateId?: string;
  onChangeTemplate?: () => void;
}
```

### 4. Project.tsx Güncellemesi

**Dosya**: `src/pages/Project.tsx`

Yeni state'ler ve handler'lar:
```typescript
const [changeTemplateModalOpen, setChangeTemplateModalOpen] = useState(false);

const handleTemplateChange = useCallback(async (templateId: string) => {
  // Template ID'yi veritabanına kaydet
  await supabase
    .from('projects')
    .update({ template_id: templateId })
    .eq('id', id);
  
  // Local state'i güncelle
  setProject(prev => prev ? { ...prev, template_id: templateId } : null);
  
  // Modal'ı kapat
  setChangeTemplateModalOpen(false);
  
  toast({
    title: 'Template changed',
    description: 'Your website is now using the new template.',
  });
}, [id, toast]);

const handleTemplatePreview = useCallback((templateId: string) => {
  // Geçici olarak template'i değiştirerek önizleme göster
  setProject(prev => prev ? { ...prev, template_id: templateId } : null);
}, []);
```

### 5. Template Veri Yapısı Güncelleme

**Dosya**: `src/templates/index.ts`

Template kayıtlarına preview görseli ekleme:
```typescript
import templateDental from '@/assets/showcase-dental.jpg';
import templateRestaurant from '@/assets/showcase-restaurant.jpg';
// ... diğer görseller

const templateRegistry: Record<string, {...}> = {
  temp1: {
    config: {
      id: 'temp1',
      name: 'Healthcare Modern',
      description: 'Clean, professional template for healthcare',
      category: 'Healthcare',
      preview: templateDental, // Önizleme görseli
      supportedProfessions: ['doctor', 'dentist'],
      supportedTones: ['professional', 'friendly'],
    },
    component: HealthcareModernTemplate,
  },
  temp2: {
    config: {
      id: 'temp2',
      name: 'Restaurant & Cafe',
      description: 'Elegant template for food business',
      category: 'Restaurant',
      preview: templateRestaurant,
      // ... diğer config
    },
    component: HealthcareModernTemplate, // Aynı bileşen, farklı görsel
  },
  // ... daha fazla template
};
```

### 6. Template Types Güncelleme

**Dosya**: `src/templates/types.ts`

```typescript
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;           // Yeni: kategori
  preview: string;            // Yeni: önizleme görseli yolu
  supportedProfessions: string[];
  supportedTones: string[];
}
```

---

## UI Tasarımı

### Change Template Modal Görünümü

```text
+------------------------------------------------------------------+
|  Change template                                     [Regenerate] |
|  Your original images and text will be used,                   X |
|  but they may be rearranged to fit the new layout.               |
+------------------------------------------------------------------+
|                                                                  |
|  +---------------+  +---------------+  +---------------+  +---+  |
|  | [Your        ]|  |               |  |               |  |   |  |
|  | template]     |  |               |  |               |  |   |  |
|  |               |  |               |  |               |  |   |  |
|  |   [Preview]   |  |  [İmage]      |  |  [Image]      |  |   |  |
|  |               |  |               |  |               |  |   |  |
|  +---------------+  +---------------+  +---------------+  +---+  |
|  Dental Clinic      Book Store         Tech Blog                 |
|                                                                  |
|  [<]                                                        [>]  |
|                                                                  |
+------------------------------------------------------------------+
```

### Template Kartı Yapısı

```text
+----------------------+
| [Your template]      |  <-- Rozet (sadece mevcut template'de)
|                      |
|    [PREVIEW IMAGE]   |
|    (Tall card)       |
|                      |
+----------------------+
| [Details] [Preview]  |  <-- Hover'da görünür
+----------------------+
```

---

## Dosya Değişiklikleri Özeti

| Dosya | Değişiklik |
|-------|------------|
| `src/components/website-preview/ChangeTemplateModal.tsx` | **YENİ** - Template galeri modal'ı |
| `src/components/website-preview/CustomizeSidebar.tsx` | "Change Template" menu item ekle |
| `src/pages/Project.tsx` | Modal state ve handler'lar ekle |
| `src/templates/types.ts` | `category` ve `preview` alanları ekle |
| `src/templates/index.ts` | Template'lere preview görselleri ekle |

---

## Önemli Notlar

1. **Regenerate Butonu**: AI çağırmayacak, sadece mevcut template'lerin gösterim sırasını karıştıracak

2. **Preview Fonksiyonu**: Kullanıcı "Preview" butonuna tıkladığında, geçici olarak template değişecek ve site o template ile render edilecek

3. **Template Değişikliği**: Aslında tüm template'ler aynı bileşeni (HealthcareModernTemplate) kullanıyor, sadece görsel önizlemeler farklı. Gerçek template çeşitliliği için Phase 2'de yeni template bileşenleri oluşturulabilir.

4. **Mevcut Görseller**: Şu an `src/assets/` klasöründe 8 adet showcase görseli var, bunları template önizlemeleri olarak kullanacağız

5. **Veritabanı**: `projects` tablosunda zaten `template_id` kolonu var, güncelleme hazır

---

## Teknik Detaylar

### Modal Carousel/Grid

- `embla-carousel-react` zaten projede yüklü, horizontal scroll için kullanılabilir
- Alternatif: Basit CSS Grid + ok butonları ile pagination

### Template Seçim Akışı

1. Kullanıcı Customize → Change Template tıklar
2. Modal açılır, template galerisini görür
3. Template kartına tıklar → "Details" ve "Preview" butonları görünür
4. "Preview" tıklar → Modal kapanır, site yeni template ile render edilir
5. "Details" → Template hakkında bilgi gösterir (opsiyonel)
6. Değişiklik otomatik kaydedilir
