
# Sidebar Label ve Font Stilini Modernlestirme

## Sorun
Editordeki sag paneldeki etiketler (BASLIK BOYUTU, BASLIK KALLINLIGI vb.) tamamen buyuk harf (uppercase), cok kucuk (11px) ve kalin (600 weight) gorunuyor. Bu, eski ve sert bir izlenim yaratıyor.

## Cozum
Label stillerini Figma/Framer/Notion tarzinda daha yumusak ve modern bir gorunume kavusturmak.

### Degistirilecek Dosya: `src/styles/chaibuilder.tailwind.css`

**Label stilleri (satir 85-95):**
- `text-transform: uppercase` kaldirilacak (normal case yapilacak)
- `font-size: 11px` yerine `12px` yapilacak
- `font-weight: 600` yerine `500` yapilacak (medium)
- `letter-spacing: 0.03em` kaldirilacak (normal)
- `color` biraz daha koyu yapilacak (daha okunabilir)
- `margin-bottom: 6px` ile biraz daha bosluk

Sonuc: "BASLIK BOYUTU" yerine "Baslik Boyutu" seklinde daha temiz, modern etiketler gorunecek.
