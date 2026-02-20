## Tamamlanan İyileştirmeler (2026-02-20)

### 1. Blog Editör Paneli ✅
- `SectionEditPanel`'e `BlogFields` özel bileşeni eklendi
- `AddableBlog` tipindeki bölüme tıklanınca 4 yazının tamamı editörde listeleniyor
- Her yazı için: Başlık, Kategori, Özet, Tarih, URL (slug), Görsel düzenlenebilir
- Görsel için Pixabay picker entegre

### 2. ContentFields Boş Alan Sorunu ✅
- `_sector` dahili prop artık editörde gösterilmiyor
- `post*` alanları ContentFields'dan filtreleniyor (BlogFields işliyor)
- `skipFields` listesi genişletildi

### 3. sectorProfiles Genişletme ✅
- 8 yeni sektör eklendi: engineer, designer, consulting, real_estate, education, event, photography + alias'lar
- `sectorAliases` 40+ yeni eşlemeyle zenginleştirildi

### 4. MenuShowcase + StatisticsCounter Mapper ✅
- Her iki bölüm mapper registry'e eklendi
- `StatisticsCounter` istatistikleri sektöre göre değişiyor (doktor, avukat, otel, cafe...)
- `MenuShowcase` bölüm başlığı sektör etiketiyle doluyor

## Devam Eden Plan
- Blog sayfalarının template temasını (renk/font) alması
- Yeni site oluşturmada `generate-website` fonksiyonuna Pixabay görsel enjeksiyonu
- `deploy-to-netlify` → site güncellerinde de çalışması doğrulanmalı
