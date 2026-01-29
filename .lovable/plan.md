

# Sidebar Sistemini Düzenleme ve Gallery Görsellerini İyileştirme

## Mevcut Durum Analizi

### Çalışan Özellikler
- CustomizeSidebar, PageSettingsSidebar, AddContentSidebar bileşenleri oluşturulmuş
- EditorToolbar'da butonlar mevcut
- fetch-images edge function Pixabay'den galleryImages çekiyor

### Düzeltilmesi Gerekenler

| Sorun | Açıklama |
|-------|----------|
| Pages menüsünden sayfa seçilince detaylı sidebar açılmıyor | Şu an sadece PageSettingsSidebar açılıyor, Durable.co'daki gibi tüm sayfa bölümlerini gösteren bir sidebar lazım |
| Gallery görselleri boş görünüyor | Images array'i gelse de UI'da placeholder gösteriliyor |
| Add sidebar'daki Page ekleme fonksiyonu eksik | Sadece toast gösteriyor, gerçek sayfa ekleme yok |

## Yapılacak Değişiklikler

### 1. Pages Menüsü İyileştirmesi
Pages dropdown'ından bir sayfa seçildiğinde o sayfanın tüm section'larını gösteren detaylı bir sidebar açılacak.

**Yeni HomeEditorSidebar Bileşeni:**
```
+----------------------------------+
| Home                          X  |
+----------------------------------+
| > Hero                       >   |
|   Edit title, subtitle, image    |
|                                  |
| > Statistics                 >   |
|   Edit numbers and labels        |
|                                  |
| > About                      >   |
|   Story and values               |
|                                  |
| > Services                   >   |
|   Service cards                  |
|                                  |
| > Gallery                    >   |
|   Facility images                |
|                                  |
| > FAQ                        >   |
|   Questions and answers          |
|                                  |
| > Contact                    >   |
|   Contact information            |
|                                  |
| > CTA                        >   |
|   Call to action                 |
+----------------------------------+
| [Settings icon] Page Settings    |
+----------------------------------+
```

### 2. Gallery Görsellerinin Düzeltilmesi
- fetch-images çağrıldığında galleryImages düzgün kaydediliyor mu kontrol et
- ImageGallerySection'da görsellerin render edilmesini iyileştir
- Görsel yoksa "Generate Images" butonu göster

### 3. Add Sidebar Fonksiyonelliği
- Page ekleme fonksiyonunu aktif et
- Blog post oluşturma sayfasına yönlendirme ekle

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `src/components/website-preview/HomeEditorSidebar.tsx` | YENİ - Sayfa section'larını gösteren sidebar |
| `src/components/website-preview/EditorToolbar.tsx` | Pages menüsü davranışını güncelle |
| `src/pages/Project.tsx` | Yeni sidebar state'i ve handler'ları ekle |
| `src/components/website-preview/ImageGallerySection.tsx` | Görsel yükleme butonu ve hata yönetimi ekle |
| `src/components/website-preview/AddContentSidebar.tsx` | Sayfa ekleme fonksiyonunu aktif et |

## Teknik Detaylar

### HomeEditorSidebar Yapısı
```typescript
interface HomeEditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  content: GeneratedContent;
  onSectionSelect: (sectionId: string) => void;
  onPageSettings: () => void;
}
```

Her section'a tıklandığında:
1. Sidebar kapanır
2. İlgili section'a scroll edilir
3. O section'daki ilk editable element seçilir ve EditorSidebar açılır

### Gallery Görselleri Akışı
```
1. fetch-images edge function çağrılır
2. Pixabay'den galleryImages array'i çekilir
3. generated_content.images.galleryImages'a kaydedilir
4. ImageGallerySection bu array'i render eder
```

### Generate Images Butonu
Gallery boşsa veya placeholder gösteriliyorsa:
```
+----------------------------------+
|         Our Facility             |
|   [📷 Generate Gallery Images]   |
|                                  |
|   [placeholder] [placeholder]    |
|   [placeholder] [placeholder]    |
+----------------------------------+
```

## Implementasyon Adımları

1. **HomeEditorSidebar bileşenini oluştur**
   - Section listesi (collapsible)
   - Her section için özet bilgi
   - Section'a tıkla → scroll + select

2. **EditorToolbar'ı güncelle**
   - Pages dropdown'ından sayfa seçilince HomeEditorSidebar açılsın
   - Mevcut PageSettingsSidebar da Settings butonu ile erişilebilir kalsın

3. **Project.tsx state yönetimi**
   - `homeEditorSidebarOpen` state
   - Section select handler

4. **Gallery görsel yönetimi**
   - Görsel yoksa "Generate Images" butonu
   - Buton tıklandığında fetch-images çağrılsın
   - Loading state göster

5. **Add sidebar fonksiyonelliği**
   - Sayfa ekleme: generated_content.pages'e yeni sayfa ekle
   - Blog post: Blog editör sayfasına yönlendir (veya modal aç)

## Beklenen Sonuç

1. Pages menüsünden Home seçildiğinde tüm section'ları gösteren sidebar açılır
2. Section'a tıklanınca o bölüme scroll edilir ve düzenleme başlar
3. Gallery boşsa "Generate Images" butonu görünür
4. Add sidebar'dan gerçek sayfa/blog post eklenebilir
5. Tüm butonlar ve fonksiyonlar düzgün çalışır

