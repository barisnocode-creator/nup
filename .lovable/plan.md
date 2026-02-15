
# Mobilde Edit Butonu Gecikmesi Düzeltmesi

## Sorun
Edit butonuna tıklandığında sayfa geçişi sırasında `Suspense fallback={null}` kullanıldığı için ekranda hiçbir yükleme göstergesi çıkmıyor. Mobilde JS chunk'ı indirilirken kullanıcı "buton çalışmıyor" sanıyor.

## Çözüm

### 1. Suspense Fallback'e Yükleme Göstergesi Ekle
**Dosya:** `src/App.tsx`

- `fallback={null}` yerine tam ekran merkezlenmiş bir spinner/loading göstergesi koyulacak
- Basit bir CSS spinner veya Lucide `Loader2` ikonu kullanılacak
- Bu sayede Edit'e tıklanınca anında görsel geri bildirim verilecek

### 2. Silme Butonu Mobil Görünürlük (Bonus)
**Dosya:** `src/components/dashboard/WebsitePreviewCard.tsx`

- `opacity-0 group-hover:opacity-100` sınıfına `sm:opacity-0 sm:group-hover:opacity-100` eklenerek mobilde buton her zaman görünür olacak (masaüstünde hover davranışı korunacak)

## Teknik Detaylar

```text
Mevcut:  <Suspense fallback={null}>
Yeni:    <Suspense fallback={<FullScreenLoader />}>
```

`FullScreenLoader` basit bir bileşen olacak:
- Ekran ortasında dönen bir ikon (Loader2)  
- Arka plan: bg-background
- Animasyon: animate-spin

Silme butonu sınıf değişikliği:
```text
Mevcut:  opacity-0 group-hover:opacity-100
Yeni:    opacity-100 sm:opacity-0 sm:group-hover:opacity-100
```

Bu değişiklikler mevcut tasarımı ve UX'i bozmadan sadece mobil deneyimi iyileştirecek.
