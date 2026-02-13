

# SaaS Arayüz Renk Tutarsizligi Duzeltmesi

## Sorun

`useThemeColors` hook'u (satir 189, `Project.tsx`) kullanicinin web sitesi tema renklerini dogrudan `document.documentElement` uzerindeki CSS degiskenlerine yaziyor (`--primary`, `--accent`, `--ring`, `--sidebar-primary` vb.). Editorden cikinca bu degiskenler eski haliyle kaliyor ve SaaS arayuzu (dashboard, kartlar, sidebar) turuncu yerine gri/siyah tonlarina donuyor.

## Cozum

`useThemeColors` hook'undaki cleanup fonksiyonunu aktif hale getirip, component unmount oldugunda tum CSS degiskenlerini varsayilan turuncu temaya sifirlamak.

## Teknik Detaylar

### Degisecek Dosya: `src/hooks/useThemeColors.ts`

Cleanup fonksiyonu su anda bos birakılmis (satir 140-143). Bu fonksiyon, editorden cikildiginda asagidaki CSS degiskenlerini varsayilan degerlerine (turuncu tema) sifirlamali:

```text
--primary       -> "24 95% 53%"   (turuncu)
--ring          -> "24 95% 53%"
--accent        -> "24 95% 53%"
--sidebar-primary -> "24 95% 53%"
--sidebar-ring  -> "24 95% 53%"
--font-heading  -> kaldir (varsayilana don)
--font-body     -> kaldir (varsayilana don)
--radius        -> kaldir (varsayilana don)
--color-secondary-custom -> kaldir
--color-accent-custom    -> kaldir
```

`root.style.removeProperty()` kullanilarak degiskenler kaldirilir ve index.css'teki varsayilan `:root` degerleri tekrar devreye girer.

### Ek Guvenlik: Dashboard Sayfalarinda Reset

`src/pages/Dashboard.tsx` ve diger ana sayfalarda, sayfa yuklendiginde tum ozel CSS degiskenlerini temizleyen bir `useEffect` eklenecek. Bu, cleanup calismazsa bile SaaS renklerinin her zaman dogru kalmasini garanti eder.

### Etki

- Kullanicinin web sitesi editorde acikken: site renkleri uygulanir (beklenen davranis)
- Editorden cikildiginda: SaaS renkleri (turuncu tema) otomatik geri gelir
- Dashboard, Settings, Studio vb. sayfalarda: her zaman turuncu tema gorunur
