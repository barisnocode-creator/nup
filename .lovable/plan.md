

# Analytics Sistemini Dogru Verilere Kavusturma Plani

## Mevcut Durum (Kritik Sorunlar)

Veritabaninda 556 analytics kaydi var. Bunlarin dagilimi:
- `/preview`: 484 kayit (%87) — Site sahibinin editor onizlemesi (SAHTE TRAFIK)
- `/`: 60 kayit — Belirsiz
- `/public`: 12 kayit — Gercek ziyaretci verisi

Kullanici Analytics sayfasinda "556 goruntulenme" goruyor ama gercekte sadece 12 gercek ziyaret var.

---

## Kullanicinin Tercihleri

1. Sadece yayinlanan siteler icin say (preview takibi tamamen kaldirilsin)
2. Eski kirli veriler icin "Other" secildi — kullaniciya soracagiz
3. Hesaplamalar veritabaninda SQL ile yapilsin

---

## Yapilacak Degisiklikler

### Adim 1: Preview Takibini Kaldir

**Dosya:** `src/pages/Project.tsx`

`usePageView(id, '/preview')` satiri tamamen kaldirilacak. Boylece editor onizlemesi hicbir analytics kaydi olusturmaz.

---

### Adim 2: Edge Function — Yayinlanmamis Siteleri Reddet

**Dosya:** `supabase/functions/track-analytics/index.ts`

Mevcut kodda zaten `!project.is_published && !isOwner` kontrolu var ama `isOwner` ise true donerse yayinlanmamis projeler bile kayit olusturuyor. Degisiklik:

- `is_published === false` ise kaydi kesinlikle reddet (owner olsa bile)
- Owner kontrolunu kaldir — sadece `is_published === true` olan projeler icin tracking yapilsin

---

### Adim 3: Veritabani Fonksiyonu — Server-Side Aggregation

Yeni bir PostgreSQL fonksiyonu olusturulacak: `get_project_analytics(p_project_id uuid, p_days integer)`

Bu fonksiyon tek sorguda su verileri dondurecek:
- `total_views`: Toplam goruntulenme (preview haric)
- `views_last_7_days`: Son 7 gunluk goruntulenme
- `unique_visitors`: Tekil ziyaretci sayisi
- `mobile_count` / `desktop_count`: Cihaz dagilimi
- `views_over_time`: Gunluk goruntulenme dizisi (JSONB)
- `page_views`: Sayfa bazli goruntulenme (JSONB)
- `hourly_views`: Saatlik dagilim (JSONB)

Tum hesaplamalar `WHERE page_path != '/preview'` filtresi ile yapilacak.

RLS: Fonksiyon `SECURITY DEFINER` olacak ama icinde `auth.uid()` kontrolu yapacak — sadece projenin sahibi cagirabilecek.

---

### Adim 4: useAnalytics Hook — SQL Fonksiyonuna Gecis

**Dosya:** `src/hooks/useAnalytics.ts`

Mevcut yaklasim (tum raw event'leri cek + JavaScript'te hesapla) kaldirilacak. Yerine:

```
supabase.rpc('get_project_analytics', { p_project_id: projectId, p_days: 30 })
```

Tek RPC cagrisi ile tum aggregated veriler gelecek. Client-side hesaplama kalmayacak.

Realtime subscription korunacak — yeni INSERT geldiginde `refetch()` cagrilacak.

---

### Adim 5: Eski Kirli Verileri Temizle

Veritabanindaki `/preview` path'li 484 kayit icin bir temizlik migration'i calistirilacak:

```sql
DELETE FROM analytics_events WHERE page_path = '/preview';
```

Bu tek seferlik bir islem. Bundan sonra preview kaydi olusturmayacagimiz icin tekrar kirlenme olmayacak.

---

### Adim 6: WebsiteDashboardTab — Sample Data Kaldirma

**Dosya:** `src/components/website-dashboard/WebsiteDashboardTab.tsx`

- `generateSampleData()` fonksiyonu ve sahte veri uretimi tamamen kaldirilacak
- `totalViews === 0` durumunda "Henuz ziyaretci yok" mesaji gosterilecek (sahte rakamlar yerine)
- Yayinlanmamis sitelere ozel bilgilendirme banner'i korunacak ama sahte grafik yerine bos durum gosterilecek

---

### Adim 7: Analytics Sayfasi — Bos Durum Iyilestirmesi

**Dosya:** `src/pages/Analytics.tsx`

- Veri yoksa (0 goruntulenme) anlamli bir bos durum gosterilecek:
  - "Henuz ziyaretciniz yok"
  - "Sitenizi yayinlayin ve paylasarak ziyaretci kazanin"
  - Yayinlama durumuna gore CTA butonu
- Tarih formati `en-US` yerine `tr-TR` olarak duzeltilecek

---

## Degistirilecek Dosyalar

| Dosya | Degisiklik | Oncelik |
|---|---|---|
| `src/pages/Project.tsx` | `usePageView` cagrisini kaldir | Yuksek |
| `supabase/functions/track-analytics/index.ts` | Sadece `is_published=true` projeleri kabul et | Yuksek |
| Yeni DB fonksiyonu: `get_project_analytics` | Server-side aggregation | Yuksek |
| `src/hooks/useAnalytics.ts` | RPC cagrisina gecis, client-side hesaplamayi kaldir | Yuksek |
| Migration: DELETE preview kayitlari | Eski kirli veriyi temizle | Orta |
| `src/components/website-dashboard/WebsiteDashboardTab.tsx` | Sample data kaldir, bos durum ekle | Orta |
| `src/pages/Analytics.tsx` | Bos durum + tarih formati duzeltme | Dusuk |

---

## Teknik Detaylar

### PostgreSQL Fonksiyonu Yapisi

```text
get_project_analytics(p_project_id uuid, p_days integer DEFAULT 30)
RETURNS jsonb
SECURITY DEFINER

Dondurecegi yapi:
{
  "total_views": 142,
  "views_last_7_days": 38,
  "unique_visitors": 67,
  "mobile_count": 45,
  "desktop_count": 97,
  "views_over_time": [{"date": "2026-02-01", "views": 5}, ...],
  "page_views": [{"path": "/", "views": 80}, ...],
  "hourly_views": [{"hour": 0, "views": 2}, ...]
}

WHERE kosullari:
- project_id = p_project_id
- page_path != '/preview'  (guvenlik icin ek filtre)
- created_at >= now() - (p_days || ' days')::interval  (views_over_time icin)
```

### Veri Akisi (Sonrasi)

```text
Ziyaretci siteyi acar
  |
  v
PublicWebsite.tsx -> usePageView(projectId, '/public')
  |
  v
track-analytics Edge Function
  |-- is_published = false? -> Reddet (200, not_tracked)
  |-- is_published = true?  -> INSERT analytics_events
  |
  v
Realtime tetiklenir -> Dashboard guncellenir
  |
  v
useAnalytics -> supabase.rpc('get_project_analytics')
  |
  v
Analytics sayfasi: Gercek veriler gosterilir
```

---

## Beklenen Sonuc

- Analytics'te sadece gercek ziyaretci verileri gorunur (preview sifir)
- Server-side hesaplama ile 1000 satir limiti sorunu ortadan kalkar
- Sahte sample data tamamen kaldirilir
- Bos durumda anlamli mesajlar gosterilir
- Performans iyilesir (tek SQL sorgusu vs tum raw veri indirme)

