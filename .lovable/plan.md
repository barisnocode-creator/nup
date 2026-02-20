
## Sorun

Kullanıcının sitesi `HeroCentered` bileşenini kullanıyor. Bu bileşen tasarım olarak **sadece metin + gradient arka plan** içeriyor — hiç görsel yok. Bu yüzden hero section görsel açısından boş görünüyor.

## Kök Neden

`HeroCentered.tsx` mimarisi:
- Arka plan görseli: `backgroundImage` prop varsa CSS `background-image` olarak arka plana koyuluyor ama varsayılan prop **boş**
- Sağ kolonda görsel yok — layout tek kolon, ortalanmış text

## Çözüm

`HeroCentered`'ı tamamen yeniden tasarlayarak **2 sürüm** destekler hale getir:

### Yeni HeroCentered Tasarımı

**Sol taraf (mevcut):** Badge, başlık, açıklama, butonlar, scroll indicator

**Sağ taraf (YENİ):** Görsel + Pixabay picker hover overlay

Layout:
```
┌─────────────────────────────────────────────────┐
│  [Badge]                    [  Sektör Görseli  ]│
│  Başlık Metni               [                  ]│
│  Açıklama...                [ Görseli Değiştir ]│
│                             [                  ]│
│  [Birincil Buton]           [    Floating      ]│
│  [İkincil Buton]            [    Badge/Card    ]│
└─────────────────────────────────────────────────┘
```

Eğer `image` prop'u yoksa: Pixabay'dan sektöre göre otomatik query ile placeholder gösterir ve "Görsel Ekle" butonu sunar.

### Değişecek Dosyalar

**`src/components/sections/HeroCentered.tsx`** — Komple yeniden yaz:
- Grid layout: `lg:grid-cols-2` (sol: metin, sağ: görsel)
- `image` prop'u ekle (Pixabay URL veya Unsplash fallback)
- Görsel üzerine hover → "Görseli Değiştir" overlay
- `PixabayImagePicker` entegrasyonu, `getSectorImageQuery('hero', sector)` ile
- `onUpdate?.({ image: url })` ile görsel güncelleme
- Framer-motion animasyonlar: sol=fade+slideLeft, sağ=fade+slideRight
- Arka plan gradient blob'ları koru
- `isEditing` olmadığında normale görünür

**`src/templates/catalog/definitions.ts`** — `HeroCentered` kullanan tüm section `defaultProps`'larına `image` alanı ekle (sektöre göre Unsplash URL ile):
- `specialty-cafe` → kahve görseli zaten `HeroCafe` kullanıyor, dokunma
- `medcare-pro` zaten `HeroMedical` kullanıyor, dokunma
- Eğer herhangi şablon `HeroCentered` kullanıyorsa image prop'u ekle

**`src/templates/catalog/mappers/index.ts`** — `HeroCentered` için `image` alanını mapper'a ekle:
```ts
// mapHeroSection içinde:
if (sectionProps.image !== undefined || sectionType === 'HeroCentered') {
  overrides.image = getSectorDefaultImage(projectData.sector);
}
```

### HeroCentered Yeni Bileşen Yapısı

```tsx
// Yeni layout:
<section className="relative overflow-hidden bg-background min-h-[680px] flex items-center">
  {/* Gradient blobs */}
  <div className="container mx-auto px-6 py-20">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Sol: Metin */}
      <div>
        <Badge /><Title /><Desc /><Buttons />
      </div>
      {/* Sağ: Görsel */}
      <div className="relative group" onClick={() => isEditing && setPickerOpen(true)}>
        <img src={image || '/placeholder.svg'} className="rounded-3xl object-cover aspect-[4/3]" />
        {isEditing && <HoverOverlay />}
        <FloatingCard />  {/* Küçük floating stat card */}
      </div>
    </div>
  </div>
  <PixabayImagePicker ... />
</section>
```

### Animasyon Sıralaması (framer-motion)

```
t=0.0s: Badge → opacity 0→1, x: -20→0
t=0.2s: Başlık → opacity 0→1, x: -20→0
t=0.4s: Açıklama → opacity 0→1, x: -20→0
t=0.55s: Butonlar → opacity 0→1, y: 20→0
t=0.3s: Görsel → opacity 0→1, x: 40→0, scale: 0.95→1 (sağ kolonda)
t=0.8s: Floating card → opacity 0→1, y: 20→0
```

### Kullanıcı Deneyimi

- Mevcut tüm siteler `HeroCentered` kullanıyorsa artık sağ tarafta görsel görecek
- `image` prop'u boşsa `placeholder.svg` + "Görsel Ekle" butonu görünür
- Düzenleme modunda hover → Pixabay picker açılır
- Sektöre göre (`_sector`) otomatik arama terimi kullanılır (ör: psikoloji → "psychology therapy mental health")
