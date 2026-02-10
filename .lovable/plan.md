
# Floating Edit Kartini Kompakt Hale Getirme

## Sorun
Sag taraftaki duzenleme paneli hala ekranin tamamini kaplayan buyuk bir sidebar gibi gorunuyor. Kullanici, Uiverse.io ornegindeki gibi kucuk, kompakt bir yüzen kart istiyor - web sitesini rahatlıkla gorebilecegi sekilde.

## Cozum

### 1. DesktopEditorLayout.tsx - Kompakt Floating Kart

Mevcut floating panel `top-16 bottom-4` ile neredeyse tam ekran yuksekliginde. Bunu kompakt bir karta donusturecegiz:

- **Genislik**: 320px -> 280px (daha dar)
- **Yukseklik**: Tam ekran yerine `max-height: 420px` ile sinirli (icerige gore uzar ama siniri var)
- **Konum**: `top-16 bottom-4` yerine `top-16 right-4` sabit, `bottom` olmadan - sadece icerik kadar yer kaplar
- **h-full kaldirilacak**: Kart icerige gore boyutlanacak, tam yuksekligi doldurmayacak
- ScrollArea'ya `max-h-[340px]` siniri konacak

### 2. CSS Ince Ayar - chaibuilder.tailwind.css

- Floating kart `::before` gradient genisligi biraz daraltilacak (120px -> 100px) daha ince kenarlik icin
- `inset: 2px` -> `inset: 3px` daha belirgin gradient kenarlık

### Degistirilecek Dosyalar
1. `src/components/chai-builder/DesktopEditorLayout.tsx` - Floating panel boyutlarini kucult
2. `src/styles/chaibuilder.tailwind.css` - Gradient ince ayar
