

# Galeri Gorsel Overlay Duzeltmesi

## Sorun

ImageGallery blokundaki gorsellerin uzerinde "Degistir / Yenile" overlay'i gorunmuyor. Sebep: Her gorselin uzerinde hover'da beliren karanlik bir katman (`bg-black/40 opacity-0 group-hover:opacity-100`) var ve bu katman mouse olaylarini engelliyor. Ayrica parent div'deki `overflow-hidden` aksiyon butonlarini kirpiyor.

## Cozum

`src/components/chai-builder/blocks/gallery/ImageGallery.tsx` dosyasinda iki degisiklik:

1. **Satir 65**: Karanlik overlay div'ine `pointer-events-none` ekle - boylece mouse olaylari altindaki `EditableChaiImage`'a ulasir
2. **Satir 57**: Parent div'deki `overflow-hidden`'i kaldir veya `overflow-visible` yap - aksiyon butonlarinin kirpilmasini onle

### Degisecek Kod

Satir 57 (oncesi):
```
<div key={index} className="relative group overflow-hidden rounded-xl aspect-square">
```
Satir 57 (sonrasi):
```
<div key={index} className="relative group rounded-xl aspect-square">
```

Satir 65 (oncesi):
```
<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
```
Satir 65 (sonrasi):
```
<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
```

Toplam 1 dosya, 2 satir degisiklik.

