
# Renk Sifirlama - Route Degisiminde Tetikleme

## Sorun

`DashboardLayout` icindeki `useLayoutEffect` sadece component ilk mount oldugunda calisiyor (`[]` dependency). Kullanici sidebar'dan sayfa degistirdiginde `DashboardLayout` unmount olmadigi icin (ayni wrapper) reset tekrar calismiyor. ChaiBuilder SDK'nin asenkron olarak enjekte ettigi stiller de ilk reset'ten sonra gelebiliyor.

## Cozum

### 1. `src/components/dashboard/DashboardLayout.tsx`

- `useLocation()` hook'unu import edip, `location.pathname` degerini `useLayoutEffect` dependency array'ine eklemek
- Boylece her sayfa degisiminde CSS degiskenleri yeniden turuncu temaya zorlanacak
- SDK style tag'leri de her geciste temizlenecek

```text
Degisiklik ozeti:
- import { useNavigate, useLocation } from 'react-router-dom';
- const location = useLocation();
- useLayoutEffect dependency: [location.pathname]
```

### 2. Ek Guvenlik: Gecikmel Temizlik

- `useLayoutEffect` icine 100ms gecikmeyle ikinci bir temizlik eklemek (setTimeout)
- Bu, SDK'nin asenkron style injection'larini da yakalayacak

## Etki

- Editordan cikip herhangi bir SaaS sayfasina gidildiginde renkler turuncu kalir
- Sidebar'dan sayfalar arasi geciste de renkler korunur
- SDK'nin gecikmeli style injection'lari da temizlenir
