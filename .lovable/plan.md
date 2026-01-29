
# Image Editor Sidebar Düzeltme Planı

## Tespit Edilen Sorunlar

Kodu inceledikten sonra aşağıdaki sorunları tespit ettim:

### 1. Sidebar Görünmeme Sorunu
`ImageEditorSidebar` bileşeni `imageData` null olduğunda hiçbir şey render etmiyor (`if (!imageData) return null`). Bu doğru bir davranış, ancak sidebar'ın `isOpen` prop'u ile birlikte çalışması gerekiyor - şu anda sadece `imageData` varlığına bakıyor.

### 2. isOpen Kontrolü Eksik
Sidebar component'inde `isOpen` prop'u CSS transition için kullanılıyor, ancak `imageData` null olduğunda tüm component null döndürülüyor. Bu, açılış/kapanış animasyonlarını engelliyor.

### 3. Template'den Props Geçişi Sorunlu
`temp1/index.tsx` dosyasında `selectedImage` ve `onImageSelect` props'ları `FullLandingPage`'e geçiriliyor, ancak template'in kendisinde bu props'lar tanımlanmamış olabilir.

## Çözüm Planı

### Adım 1: ImageEditorSidebar'ı Düzelt
- `isOpen` kontrolünü `imageData` kontrolünden ayır
- Sidebar'ın her zaman DOM'da olmasını sağla (sadece gizle/göster)

### Adım 2: TemplateProps'ı Kontrol Et
- `types.ts` dosyasında `selectedImage` ve `onImageSelect` props'larının doğru tanımlandığından emin ol

### Adım 3: temp1/index.tsx'i Güncelle
- Props'ların doğru şekilde FullLandingPage'e geçirildiğinden emin ol

### Adım 4: Debug için Console Log Ekle
- Geçici olarak console.log ekleyerek props akışını doğrula

## Teknik Değişiklikler

| Dosya | Değişiklik |
|-------|------------|
| `ImageEditorSidebar.tsx` | `imageData` null kontrolünü kaldır, `isOpen` ile birlikte çalışacak şekilde güncelle |
| `types.ts` | Props tanımlarını doğrula |
| `temp1/index.tsx` | Props geçişini doğrula ve düzelt |

## Kod Değişiklikleri

### ImageEditorSidebar.tsx
```typescript
// ESKİ:
if (!imageData) return null;

// YENİ:
// Component her zaman render olacak, ama içerik imageData yoksa gösterilmeyecek
```

Sidebar'ın DOM'da kalması lazım ki CSS transition'lar çalışsın. `imageData` null olduğunda içeriği gizleyeceğiz ama container'ı tutacağız.

## Beklenen Sonuç

- Görsellere tıklandığında sağ taraftan sidebar açılacak
- Sidebar içinde görsel önizleme, Regenerate/Change butonları, Alt text ve position slider'ları görünecek
- Done butonuyla sidebar kapanacak
