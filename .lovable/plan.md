

# Daha Yuksek Kaliteli Sablonlar icin Mimari Iyilestirme Plani

## Mevcut Sorun

Suanki sistemde tum sablonlar 13 jenerik blok tipine (HeroCentered, ServicesGrid, AboutSection vb.) zorla donusturuluyor. Bu donusum sirasinda:
- Ozel animasyonlar kayboluyor
- Glassmorphism, ozel fontlar, gradient efektleri siliniyor  
- Tum sablonlar birbirine benzer gorunuyor
- Orijinal tasarimin "ruhu" yok oluyor

## Cozum Stratejisi

Blok sistemi **kalacak** (editor icin gerekli), ama donusum katmani kaldirilacak. Bunun yerine:

### Adim 1: Donusum Katmanini Kaldir
- `convertGeneratedContentToChaiBlocks()` fonksiyonunu kaldir
- `convertTemplateToBlocks()` fonksiyonunu kaldir  
- `src/templates/catalog/definitions.ts` icindeki jenerik section tanimlarini kaldir
- Her sablon, kendi ozel bloklarini dogrudan uretecek

### Adim 2: Sablon-Ozel Blok Yapisi
Her premium sablon icin ozel blok tipleri olusturulacak:

```text
Ornek: "Avukat Sablonu"
+----------------------------------+
| LawyerHero (ozel animasyonlu)    |
| LawyerServices (ozel grid)       |
| LawyerTestimonials (ozel slider) |
| LawyerContact (ozel form)        |
+----------------------------------+
```

Bu bloklar ChaiBuilder'a `registerChaiBlock()` ile kaydedilecek ve editor icinde inline duzenleme, siralama, silme tam calisacak.

### Adim 3: Yeni Sablon Ekleme Akisi
Kullanicinin verdigi template'i sisteme eklemek icin:

1. Template'in HTML/CSS/gorselleri analiz edilir
2. Her section icin ozel bir React bileşeni yazilir
3. Bu bilesenler `registerChaiBlock()` ile editore kaydedilir
4. `deploy-to-netlify` fonksiyonuna eslesen HTML renderer eklenir

## Teknik Detaylar

### Kaldirilacak Dosyalar/Fonksiyonlar
- `src/components/chai-builder/utils/convertToChaiBlocks.ts` - tum fonksiyonlar
- `src/components/chai-builder/utils/templateToBlocks.ts` - tum fonksiyonlar
- `src/templates/catalog/definitions.ts` - jenerik section tanimlari

### Guncellecek Dosyalar
- `src/pages/Project.tsx` - donusum cagrilarini kaldir, dogrudan blok yukleme
- `src/components/chai-builder/ChaiBuilderWrapper.tsx` - preview/template degistirme mantigi
- `src/components/chai-builder/blocks/` - sablon bazli blok klasorleri ekle

### Korunacak Yapilar
- ChaiBuilder SDK entegrasyonu (editor, inline editing, drag-drop)
- `chai_blocks` ve `chai_theme` veritabani sutunlari
- Tema preset sistemi
- Yayinlama (deploy-to-netlify) altyapisi

## Sonraki Adim

Plan onaylandiginda, once mevcut donusum katmanini temizleyecegim. Sonra bana vermek istedigin template'i paylasabilirsin - onu birebir ayni sekilde sisteme entegre edecegim.

