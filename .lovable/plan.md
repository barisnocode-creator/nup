
# Analytics Sayfasina Gercek Zamanli Veri Guncelleme Ekleme

## Yapilacak Degisiklikler

### 1. Realtime icin `analytics_events` tablosunu etkinlestir
- SQL migration ile `analytics_events` tablosunu Supabase Realtime yayin listesine ekle:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_events;
  ```

### 2. `src/hooks/useAnalytics.ts` - Realtime abonelik ekle
- Mevcut tek seferlik `fetchAnalytics` fonksiyonunu ayri bir fonksiyon olarak cikar (useEffect disinda cagrilabilir hale getir)
- `supabase.channel('analytics-realtime')` ile `analytics_events` tablosuna abone ol
- `INSERT` event'i geldiginde ve `project_id` eslesen kayitlar icin `fetchAnalytics`'i tekrar cagir
- Component unmount oldugunda kanali temizle (`removeChannel`)
- Hook'a `refetch` fonksiyonu da ekle (manuel yenileme icin)

### 3. `src/pages/Analytics.tsx` - Canli gosterge ekle
- Header'a kucuk yesil nokta animasyonu + "Canli" badge'i ekle (verilerin gercek zamanli guncellendigi gorsel olarak belli olsun)
- `refetch` fonksiyonunu hook'tan al, manuel yenileme butonu ekle

## Teknik Detaylar

- Realtime abonelik sadece `INSERT` event'lerini dinleyecek (analytics verileri sadece eklenir, guncellenmez/silinmez)
- `filter` parametresi ile sadece ilgili `project_id`'ye ait event'ler dinlenecek
- Her yeni event geldiginde tum veriyi yeniden hesaplamak yerine, mevcut state'e incremental ekleme yapilacak (performans icin)
- Incremental guncelleme: yeni event'in tarih, cihaz, sayfa bilgileri mevcut aggregation'lara eklenecek
- Channel cleanup `useEffect` return fonksiyonunda yapilacak
