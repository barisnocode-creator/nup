
## Pixabay Entegrasyonu — Tüm Templatelerde Sektöre Göre Akıllı Görsel Sistemi

### Mevcut Durum Analizi

Şu an **yalnızca `HeroDental.tsx`** bileşeninde Pixabay picker entegrasyonu var. Diğer 12+ bileşende görseller hâlâ hardcoded Unsplash URL'leri. Ayrıca görsel arama sorgusu (`defaultQuery="dental clinic"`) her zaman sabit — sektör bilgisi kullanılmıyor.

**Tespit edilen boşluklar:**
- `HeroCafe`, `HeroRestaurant`, `HeroHotel`, `HeroPortfolio` → Pixabay picker yok
- `CafeStory`, `AboutSection` → Görsel prop var ama değiştirilemez
- `ChefShowcase` → Görsel var ama picker yok
- `RoomShowcase` → Odalar dizisinde her odanın görseli var, değiştirilemez
- `ProjectShowcase` → Projeler dizisinde her projenin görseli var
- `SectionEditPanel` içinde görsel alanları (key=`image`) metin input'u olarak görünüyor, Pixabay picker yok
- `definitions.ts`'deki tüm görseller Unsplash'dan — sektör/template değiştiğinde görseller de sektöre uygun Pixabay'dan gelmeli

---

### Mimari Plan

#### Katman 1 — Merkezi Sektör-Görsel Arama Sorgusu Sistemi

**Yeni dosya:** `src/components/sections/sectorImageQueries.ts`

Her sektör için hangi bileşende hangi Pixabay arama teriminin kullanılacağını tanımlayan merkezi bir harita:

```ts
// Bileşen tipi + sektör = arama sorgusu
export const sectorImageQueries: Record<string, Record<string, string>> = {
  hero: {
    lawyer: 'law office professional',
    doctor: 'medical clinic doctor',
    dentist: 'dental clinic teeth',
    restaurant: 'restaurant fine dining',
    cafe: 'specialty coffee cafe',
    hotel: 'luxury hotel lobby',
    gym: 'fitness gym workout',
    beauty_salon: 'beauty salon spa',
    veterinary: 'veterinary clinic pet',
    pharmacy: 'pharmacy medical',
    default: 'professional business office',
  },
  about: {
    lawyer: 'law library books legal',
    doctor: 'medical team hospital',
    restaurant: 'restaurant kitchen chef',
    cafe: 'barista coffee making',
    hotel: 'hotel service luxury',
    default: 'professional team office',
  },
  chef: {
    restaurant: 'professional chef cooking',
    cafe: 'barista coffee art',
    default: 'professional cooking kitchen',
  },
  rooms: {
    hotel: 'luxury hotel room suite',
    default: 'interior modern room',
  },
};

export function getSectorImageQuery(component: string, sector: string): string {
  const map = sectorImageQueries[component] || {};
  const key = sector?.toLowerCase().replace(/[\s-]/g, '_') || 'default';
  return map[key] || map.default || 'professional business';
}
```

---

#### Katman 2 — Pixabay Picker'ı Her Hero Bileşenine Ekle

**Dosyalar:**
- `src/components/sections/HeroCafe.tsx` → `useState` + `PixabayImagePicker` ekle, görsel tıklanabilir yap
- `src/components/sections/HeroRestaurant.tsx` → Picker ekle
- `src/components/sections/HeroHotel.tsx` → Picker ekle
- `src/components/sections/HeroPortfolio.tsx` → avatar için picker ekle

Her bileşende şu pattern uygulanacak:
```tsx
const [pickerOpen, setPickerOpen] = useState(false);
const handleImageSelect = (url: string) => { onUpdate?.({ image: url }); };

// JSX içinde:
{isEditing && (
  <>
    <div onClick={() => setPickerOpen(true)} className="cursor-pointer group relative">
      <img src={image} ... />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
        <span className="text-white text-sm">Görseli Değiştir</span>
      </div>
    </div>
    <PixabayImagePicker
      isOpen={pickerOpen}
      onClose={() => setPickerOpen(false)}
      onSelect={handleImageSelect}
      defaultQuery={getSectorImageQuery('hero', sector)}  // sektörden gelen query
    />
  </>
)}
```

**Sorun:** Hero bileşenleri şu an `sector` prop'unu almıyor. `SiteSection` içinde `props.sector` olarak veya `SectionComponentProps`'a `sector` prop'u eklenmeli.

**Çözüm:** `onUpdate` prop'u zaten var. `section.props` içine `_sector` gibi internal bir alan eklemek yerine, bileşenler için `SectionComponentProps`'a optional `sector?: string` ekleyelim — ve `EditorCanvas`'dan (sector bilgisi oraya gelmiş) her bileşene geçirelim.

---

#### Katman 3 — SectionEditPanel İçinde Görsel Alanları için Pixabay Butonu

**Dosya:** `src/components/editor/SectionEditPanel.tsx`

Şu an görsel alanları (`key === 'image'`) sadece metin input'u gösteriyor. Bunun yanına **"Görsel Seç"** butonu eklenecek:

```tsx
// Görsel URL input'unun yanına:
{isImage && (
  <div className="flex gap-2">
    <Input value={...} ... className="flex-1" />
    <button
      onClick={() => setImagePickerField(key)}
      className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium"
    >
      <ImageIcon className="w-4 h-4" />
    </button>
  </div>
)}

// Panel içinde tek bir PixabayImagePicker state:
const [imagePickerField, setImagePickerField] = useState<string | null>(null);
<PixabayImagePicker
  isOpen={imagePickerField !== null}
  onClose={() => setImagePickerField(null)}
  onSelect={(url) => {
    if (imagePickerField) onUpdateProps({ [imagePickerField]: url });
    setImagePickerField(null);
  }}
  defaultQuery={getDefaultQueryForSection(section.type)}
/>
```

---

#### Katman 4 — `CafeStory` ve `AboutSection` için Görsel Picker

**Dosyalar:**
- `src/components/sections/CafeStory.tsx`
- `src/components/sections/AboutSection.tsx`

Bu bileşenler tek bir `image` prop'una sahip. Aynı pattern (hover overlay + picker) uygulanacak.

---

#### Katman 5 — `definitions.ts`'deki Görsel URL'lerini Sektör-Bağımsız Hale Getir

Şu an tüm şablonlarda hardcoded Unsplash görselleri var. Bunlar:
1. Template ilk oluşturulduğunda `mapImages` fonksiyonu ile Pixabay'dan çekilecek
2. Ya da `definitions.ts`'deki URL'ler Pixabay'dan sektöre göre sorgulanan URL'lerle değiştirilecek

**En pratik çözüm:** `mapHeroSection.ts` ve diğer mapper'lara `imageQuery` override ekle — ve `applyTemplate` (useEditorState) çağrısı sırasında, bir `fetchSectorImages` utility fonksiyonu çağrılarak sektöre uygun Pixabay görselleri async olarak fetch edilecek, ardından ilgili section props'larına yazılacak.

**Yeni utility:** `src/utils/fetchSectorImages.ts`

```ts
export async function fetchSectorImages(sector: string): Promise<Record<string, string>> {
  const queries: Record<string, string> = {
    hero: getSectorImageQuery('hero', sector),
    about: getSectorImageQuery('about', sector),
  };
  
  const results: Record<string, string> = {};
  for (const [key, query] of Object.entries(queries)) {
    const { data } = await supabase.functions.invoke('search-pixabay', {
      body: { query, perPage: 1 }
    });
    if (data?.images?.[0]) {
      results[key] = data.images[0].largeImageURL;
    }
  }
  return results;
}
```

---

#### Katman 6 — `sector` Prop Akışını EditorCanvas → Bileşenler'e Taşı

`EditorCanvas` şu an `sector` prop'unu alıyor ama bileşenlere geçirmiyor. `SectionRenderer`'a ve oradan her bileşene `sector` geçirilmesi gerekiyor.

**Zincir:**
```
SiteEditor → EditorCanvas (sector) → SectionRenderer (sector) → Her bileşen (section.props._sector veya props)
```

En temiz çözüm: Her `SiteSection`'ın `props._sector` alanına `applyTemplate` çağrısı sırasında sektör bilgisini eklemek. Böylece bileşenler `section.props._sector` ile kendi Pixabay sorgusunu belirleyebilir.

---

### Değişecek Dosyalar

| # | Dosya | Değişiklik |
|---|---|---|
| 1 | `src/components/sections/sectorImageQueries.ts` | **YENİ** — Sektör-bileşen görsel sorgu haritası |
| 2 | `src/utils/fetchSectorImages.ts` | **YENİ** — Sektöre göre Pixabay'dan görsel çeken utility |
| 3 | `src/components/sections/HeroCafe.tsx` | Picker ekle, hover overlay, `onUpdate` kullan |
| 4 | `src/components/sections/HeroRestaurant.tsx` | Picker ekle |
| 5 | `src/components/sections/HeroHotel.tsx` | Picker ekle |
| 6 | `src/components/sections/HeroPortfolio.tsx` | Picker ekle (avatar) |
| 7 | `src/components/sections/CafeStory.tsx` | Picker ekle |
| 8 | `src/components/sections/AboutSection.tsx` | Picker ekle |
| 9 | `src/components/sections/ChefShowcase.tsx` | Picker ekle |
| 10 | `src/components/editor/SectionEditPanel.tsx` | Görsel alanlarına Pixabay picker butonu ekle |
| 11 | `src/components/editor/useEditorState.ts` | `applyTemplate` içinde sektöre göre `_sector` prop'u her section'a yaz |
| 12 | `src/components/sections/SectionRenderer.tsx` | `sector` prop'u geçir |
| 13 | `src/components/editor/EditorCanvas.tsx` | `sector` prop'unu `SectionRenderer`'a ilet |

---

### Sonuç: Kullanıcı Deneyimi

**Şablon değiştirildiğinde:**
- Her hero bileşeni, `_sector` prop'undan sektöre uygun varsayılan Pixabay sorgusu kullanır
- Kullanıcı ilk açışta sektörüne uygun görseller görür (avukat → hukuk ofisi, doktor → klinik)

**Editörde görsel alanı:**
- Her görsel üzerine hover yapınca **"Görseli Değiştir"** overlay çıkar
- Tıklayınca Pixabay modal açılır, sektör bazlı arama sorgusu otomatik doldurulur
- `SectionEditPanel`'deki görsel URL input'larının yanında da Pixabay butonu bulunur

**Tutarlılık:**
- `PixabayImagePicker` tek bir merkezi bileşen olmaya devam eder
- Tüm seçimler `onUpdate` → `updateSectionProps` zinciriyle kaydedilir
- Sektör bilgisi `section.props._sector` üzerinden tüm bileşenlere ulaşır

