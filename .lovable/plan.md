
# Galeri Gorsel Tasma Duzeltmesi

## Sorun

Son degisiklikte `overflow-hidden` kaldirildi ki aksiyon butonlari kirpilmasin. Ancak gorsellerde `group-hover:scale-110` (zoom efekti) var ve `overflow-hidden` olmadan gorsel tasma yapiyor.

## Cozum

`overflow-hidden`'i geri ekle ama zoom efektini kaldir. Diger bloklarda (AboutSection, ServicesGrid vb.) zoom efekti yok, galeri de ayni sekilde olmali.

### Degisecek Kod

`src/components/chai-builder/blocks/gallery/ImageGallery.tsx` - 2 satir:

**Satir 57** - `overflow-hidden` geri ekle:
```
// Oncesi
<div key={index} className="relative group rounded-xl aspect-square">
// Sonrasi
<div key={index} className="relative group overflow-hidden rounded-xl aspect-square">
```

**Satir 61** - Zoom efektini kaldir:
```
// Oncesi
className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
// Sonrasi
className="w-full h-full object-cover"
```

Bu sayede hem tasma onlenir hem de aksiyon butonlari `EditableChaiImage` icinden (overflow-hidden sinirlari dahilinde) duzgun gorunur.

Toplam 1 dosya, 2 satir degisiklik.
