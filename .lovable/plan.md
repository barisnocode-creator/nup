
# "Screen too small" Uyarisi Gizleme

## Sorun
ChaiBuilder SDK, ekran genisligi 1280px'den kucuk oldugunda `z-[99999]` ile tam ekran bir "Screen too small" uyarisi gosteriyor. Lovable onizleme paneli bu genislikten dar oldugu icin editore erisim engelleniyor.

## Kok Neden
SDK'nin dahili kodu su elementi render ediyor:
```
<section class="fixed inset-0 z-[99999] ... xl:hidden">
  "Screen too small" - Minimum width: 1280px
</section>
```
Bu element `xl:hidden` sinifina sahip, yani yalnizca 1280px ustu ekranlarda gizleniyor. Lovable onizleme paneli bu genislikte olmadigindan uyari surekli gorunuyor.

## Cozum
`src/styles/chaibuilder.tailwind.css` dosyasina CSS kurali ekleyerek bu overlay'i tamamen gizlemek. SDK'nin kodu degistirilemeyecegi icin CSS override en temiz yontem.

## Teknik Detaylar

### Degistirilecek Dosya
**`src/styles/chaibuilder.tailwind.css`**

Su CSS kuralini ekleyecegiz:
```css
/* ChaiBuilder "Screen too small" uyarisini gizle - Lovable preview paneli icin */
section.fixed.inset-0[class*="z-[99999]"] {
  display: none !important;
}
```

Bu selector, tam olarak SDK'nin olusturdugu "Screen too small" overlay elementini hedefliyor:
- `section.fixed.inset-0` - tam ekran kaplayan fixed section
- `[class*="z-[99999]"]` - z-index 99999 olan element (yalnizca bu uyarida kullaniliyor)

Boylece editoru her ekran boyutunda kullanmak mumkun olacak.
