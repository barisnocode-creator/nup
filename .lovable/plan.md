
# Eski Turuncu Tema Kalintilerini Temizleme

## Sorun

`index.css` dosyasinda yeni NUppel teması (lacivert/mavi) dogru tanimlanmis, ANCAK 3 dosyada eski turuncu tema hala "varsayilan deger" olarak kodlanmis. Bu dosyalar, rota degisikliklerinde veya editor'den cikarken eski turuncu renkleri ve Playfair Display fontunu zorlayarak yeni temayi eziyor.

### Sorunlu Dosyalar ve Satirlar:

1. **`src/components/dashboard/DashboardLayout.tsx`** (satir 24-57)
   - `forceOrange()` fonksiyonu: `--primary: '24 95% 53%'` (turuncu), `--accent: '24 95% 53%'` (turuncu), `--ring`, `--sidebar-primary`, `--sidebar-ring` hepsi turuncu
   - `--font-heading: 'Playfair Display'` zorluyor
   - Her rota degisikliginde bu eski degerler uygulanarak yeni tema eziliyor

2. **`src/components/editor/SiteEditor.tsx`** (satir 76-108)
   - Editor unmount olurken cleanup fonksiyonu ayni eski turuncu degerleri atiyor
   - Editor'den dashboard'a donuste turuncu tema geri geliyor

3. **`tailwind.config.ts`** (satir 18-19)
   - `serif` ve `display` font fallback'leri `'Playfair Display'` kullanıyor, `Inter` olmali

## Cozum

Bu 3 dosyadaki hardcoded eski tema degerlerini, `index.css`'teki yeni NUppel temasıyla eslestirmek:

### Degisiklik 1: `DashboardLayout.tsx`
- Fonksiyon adini `forceOrange` yerine `forceNUppelTheme` olarak degistir
- Turuncu renkleri lacivert/mavi ile degistir:
  - `--primary`: `'24 95% 53%'` -> `'222 47% 31%'`
  - `--accent`: `'24 95% 53%'` -> `'210 100% 56%'`
  - `--ring`: `'24 95% 53%'` -> `'222 47% 31%'`
  - `--sidebar-primary`: `'24 95% 53%'` -> `'222 47% 31%'`
  - `--sidebar-ring`: `'24 95% 53%'` -> `'222 47% 31%'`
  - `--foreground`: `'0 0% 10%'` -> `'222 47% 11%'`
  - `--card-foreground`: `'0 0% 10%'` -> `'222 47% 11%'`
  - `--popover-foreground`: `'0 0% 10%'` -> `'222 47% 11%'`
  - `--secondary-foreground`: `'0 0% 29%'` -> `'222 47% 20%'`
  - `--sidebar-foreground`: `'240 5.3% 26.1%'` -> `'220 9% 46%'`
  - `--sidebar-accent`: `'240 4.8% 95.9%'` -> `'220 14% 96%'`
  - `--sidebar-accent-foreground`: `'240 5.9% 10%'` -> `'222 47% 20%'`
- Font: `'Playfair Display'` -> `'Inter'`

### Degisiklik 2: `SiteEditor.tsx`
- Cleanup fonksiyonundaki ayni eski turuncu degerleri yeni NUppel degerleriyle degistir (DashboardLayout ile ayni degerler)
- Font: `'Playfair Display'` -> `'Inter'`

### Degisiklik 3: `tailwind.config.ts`
- `serif` font fallback: `'Playfair Display'` -> `'Inter'`
- `display` font fallback: `'Playfair Display'` -> `'Inter'`

## Etkilenen Dosyalar

| Dosya | Degisiklik |
|-------|-----------|
| `src/components/dashboard/DashboardLayout.tsx` | Turuncu HSL degerleri -> Lacivert/Mavi, font guncelleme |
| `src/components/editor/SiteEditor.tsx` | Cleanup fonksiyonundaki turuncu degerler -> Lacivert/Mavi, font guncelleme |
| `tailwind.config.ts` | Font fallback guncelleme |

## Sonuc

Bu degisikliklerden sonra:
- Dashboard'a girildiginde lacivert NUppel teması korunacak (turuncu geri gelmeyecek)
- Editor'den ciktiginda lacivert tema korunacak
- Font her yerde Inter olacak, Playfair Display geri gelmeyecek
- `index.css`'teki tema degerleri artik ezilmeyecek
