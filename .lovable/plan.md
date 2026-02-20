
## Editör İçerik Paneli İyileştirmesi — Detaylı Plan

### Mevcut Durumun Analizi

Kod incelemesinde 4 somut sorun tespit edildi:

---

### Sorun 1: Galeri Bölümü İçin Özel Editör Yok

`ImageGallery` bölümü, `image1..image6` ve `galleryImages[]` prop'larını kullanıyor. Ancak `ContentFields` fonksiyonu bu prop'ları aşağıdaki nedenlerle göstermiyor:

```typescript
// ContentFields → skipFields kontrolü:
const skipFields = ['images', 'theme', 'style', '_sector'];
// 'images' skip ediliyor AMA 'galleryImages' de aynı şekilde atlanıyor
// çünkü Array.isArray(val) === true → return false
if (Array.isArray(val)) return false;
```

`image1, image2...` gibi flat string'ler `isImage` kontrolüne takılmıyor çünkü yalnızca `key === 'image' || key === 'backgroundImage'` kontrol ediliyor.

**Sonuç:** Galeri bölümüne tıklandığında editör paneli tamamen boş görünüyor.

---

### Sorun 2: Boş String Prop'lar İçin Placeholder Eksik

`ContentFields` boş string değerleri gösteriyor (bu düzeltilmişti) ancak input'larda placeholder text yok. Kullanıcı bir `title` alanına baktığında ne yazacağını bilemiyor.

Mevcut kod:
```typescript
<Input value={String(value || '')} onChange={...}
  className="h-8 text-sm ..." />
// placeholder yok!
```

---

### Sorun 3: `GalleryImagePicker` Özel Editörü Yok

`CafeGallery` bölümü `images[]` array'i kullanıyor. Bu prop şu an `ArrayEditor` tarafından işlenmiyor çünkü `arrayKeys` listesinde `'images'` yok, `skipFields`'da ise var. Yani her iki sistem de bunu ele almıyor.

---

### Sorun 4: `TeamGridSection` ve Diğer Addable Bölümler

`TeamGridSection`, `members[]` array'i kullanıyor. Bu `arrayKeys` içinde yok ve şu an editörde hiç görünmüyor. Benzer şekilde `AddableWorkingHours`, `AddableCallUs` gibi bölümler için de içerik editörü yok.

---

### Uygulama Planı — 2 Dosya Değişikliği

---

#### Değişiklik 1: `SectionEditPanel.tsx` — 5 İyileştirme

**1a. Galeri için `GalleryFields` özel editörü:**

```typescript
function GalleryFields({ section, onUpdateProps, onOpenImagePicker }) {
  const props = section.props || {};
  // image1..image6 flat prop'ları için thumbnail kartları
  const imageKeys = [1,2,3,4,5,6].map(n => `image${n}`);
  
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-700">Galeri Görselleri</h4>
      <div className="grid grid-cols-2 gap-2">
        {imageKeys.map(key => (
          <button key={key} onClick={() => onOpenImagePicker(key)}
            className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed ...">
            {props[key]
              ? <img src={props[key]} className="w-full h-full object-cover" />
              : <ImageIcon + "Ekle" placeholder />
            }
          </button>
        ))}
      </div>
    </div>
  );
}
```

**1b. `ContentFields`'a galeri ve ekip bölümleri routing'i:**

```typescript
// Galeri bölümleri
if (['ImageGallery', 'CafeGallery', 'image-gallery'].includes(section.type)) {
  return <GalleryFields section={section} onUpdateProps={onUpdateProps} onOpenImagePicker={onOpenImagePicker} />;
}

// Ekip bölümü
if (section.type === 'AddableTeamGrid') {
  return <TeamGridFields section={section} onUpdateProps={onUpdateProps} onOpenImagePicker={onOpenImagePicker} />;
}
```

**1c. `TeamGridFields` özel editörü — üye ekleme/düzenleme/silme:**

TeamGridSection, `members[]` array'i kullanıyor. `arrayFieldSchemas`'a `members` eklenip mevcut `ArrayEditor`'dan faydalanılacak:

```typescript
members: { fields: [
  { key: 'name', label: 'Ad Soyad' },
  { key: 'role', label: 'Ünvan' },
  { key: 'bio', label: 'Kısa Bio', type: 'textarea' },
  { key: 'image', label: 'Fotoğraf' },
]},
```

Ve `arrayKeys` listesine `'members'` eklenir, böylece mevcut `ArrayEditor` bileşeni otomatik devreye girer.

**1d. Input placeholder'ları:**

`labelMap` kullanılarak her alan için anlamlı placeholder üretilecek:

```typescript
const placeholderMap: Record<string, string> = {
  title: 'Örn: Hizmetlerimiz',
  subtitle: 'Örn: Size en iyi hizmeti sunuyoruz',
  description: 'Bölüm açıklamasını buraya yazın...',
  sectionTitle: 'Örn: Hakkımızda',
  phone: 'Örn: +90 555 123 4567',
  email: 'Örn: info@siteniz.com',
  address: 'Örn: Bağcılar Mah. İstanbul',
  buttonText: 'Örn: Daha Fazla Bilgi',
  primaryButtonText: 'Örn: Hemen Başlayın',
  siteName: 'Sitenizin adı',
  tagline: 'Örn: Kalite ve güven bir arada',
};
```

**1e. Boş içerik durumu mesajını geliştir:**

Şu an: `"Bu bölüm için düzenlenebilir alan bulunmuyor."`
Yeni: Bölüm tipine göre anlamlı mesaj + öneri:

```tsx
{entries.length === 0 && arrayEntries.length === 0 && !hasInfoItems && (
  <div className="text-center py-6 space-y-2">
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
      <Settings className="w-4 h-4 text-gray-400" />
    </div>
    <p className="text-sm font-medium text-gray-600">Düzenlenecek alan bulunamadı</p>
    <p className="text-xs text-gray-400">Bu bölümün içeriği otomatik oluşturulmuştur. Stil sekmesinden görünümü ayarlayabilirsiniz.</p>
  </div>
)}
```

---

#### Değişiklik 2: `arrayFieldSchemas` Genişletmesi

`members` schema'sının `arrayKeys` listesine eklenmesi:

```typescript
// Mevcut:
const arrayKeys = ['services', 'testimonials', 'items', 'features', 'stats', 'plans', 'tips', 'projects', 'rooms'];

// Yeni:
const arrayKeys = ['services', 'testimonials', 'items', 'features', 'stats', 'plans', 'tips', 'projects', 'rooms', 'members'];

// Schema:
members: { fields: [
  { key: 'name', label: 'Ad Soyad' },
  { key: 'role', label: 'Ünvan / Rol' },
  { key: 'bio', label: 'Kısa Biyografi', type: 'textarea' },
  { key: 'image', label: 'Fotoğraf' },
]},
```

---

### Değişiklik Özeti

| # | Dosya | Ne Değişiyor |
|---|---|---|
| 1 | `src/components/editor/SectionEditPanel.tsx` | `GalleryFields` bileşeni eklenir, `ContentFields`'a galeri ve ekip routing'i eklenir, placeholder'lar eklenir, boş durum mesajı iyileştirilir |
| 2 | `src/components/editor/SectionEditPanel.tsx` | `arrayFieldSchemas`'a `members` eklenir, `arrayKeys` listesine `'members'` eklenir |

**Sadece 1 dosya** değişecek.

---

### Beklenen Sonuç

| Bölüm | Önce | Sonra |
|---|---|---|
| ImageGallery | "Düzenlenecek alan yok" | 6 thumbnail kart, Pixabay'dan görsel seçme |
| CafeGallery | "Düzenlenecek alan yok" | Galeri görselleri grid editörü |
| AddableTeamGrid | "Düzenlenecek alan yok" | Üye ekleme/düzenleme/silme, fotoğraf picker |
| AddableBlog | ✓ (önceden düzeltildi) | ✓ Devam ediyor |
| Tüm text alanları | Boş input (ne yazacak belli değil) | Anlamlı placeholder gösteriyor |
| Boş durum | Düz metin mesajı | İkon + açıklama + stil sekmesine yönlendirme |
