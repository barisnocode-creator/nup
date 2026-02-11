

# Yayınlanan Sitelere Analitik Takip Ekleme

## Sorun
Yayınlanan siteler Netlify'de statik HTML olarak barındırılıyor, ancak bu HTML'de ziyaretçi takip kodu yok. Bu nedenle Analytics ve Website Dashboard sayfaları boş kalıyor. Netlify'nin kendi analytics servisi ucretli bir eklenti oldugu icin kullanılamıyor.

## Cozum
`deploy-to-netlify` Edge Function'inda uretilen HTML'e hafif bir JavaScript izleme snippet'i eklenecek. Bu snippet, her sayfa goruntulemesinde mevcut `track-analytics` Edge Function'ina istek gonderecek.

## Yapilacak Degisiklikler

### 1. `supabase/functions/deploy-to-netlify/index.ts`

`blocksToHtml` fonksiyonunda `</body>` etiketinden once bir analitik izleme scripti eklenecek:

- Script, sayfa yuklendiginde `track-analytics` edge function'ina POST istegi gonderecek
- Gonderilecek veriler: `project_id`, `event_type: 'page_view'`, `page_path`, `user_agent`, `device_type`, `visitor_id`
- `visitor_id` localStorage'da saklanacak (tekrar eden ziyaretcileri ayirt etmek icin)
- Cihaz tipi (mobile/desktop) `navigator.userAgent`'tan belirlenecek
- Script minify edilmis olacak, sayfa performansini etkilemeyecek
- `projectId` degiskeni script icine sabit olarak gomulecek

### 2. Mevcut Analytics Altyapisi (degisiklik yok)

Su bilesenlerin degistirilmesine gerek yok, zaten calisiyor:
- `src/hooks/useAnalytics.ts` - Veritabani sorgulari
- `src/pages/Analytics.tsx` - Analytics sayfasi
- `src/components/website-dashboard/WebsiteDashboardTab.tsx` - Dashboard sekmeleri
- `supabase/functions/track-analytics/index.ts` - Veri toplama endpoint'i

## Teknik Detaylar

Tracking script'i su sekilde olacak (deploy HTML'ine gomulecek):

```text
<script>
(function(){
  var pid = "PROJECT_ID_HERE";
  var url = "SUPABASE_URL/functions/v1/track-analytics";
  var ua = navigator.userAgent.toLowerCase();
  var dt = /android|iphone|ipad|mobile/.test(ua) ? "mobile" : "desktop";
  var vid = localStorage.getItem("ol_vid");
  if(!vid){ vid="v_"+Date.now()+"_"+Math.random().toString(36).substr(2,9); localStorage.setItem("ol_vid",vid); }
  fetch(url, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({project_id:pid, event_type:"page_view", page_path:location.pathname, user_agent:navigator.userAgent, device_type:dt, visitor_id:vid})
  }).catch(function(){});
})();
</script>
```

- `PROJECT_ID_HERE` deploy sirasinda gercek proje ID'si ile degistirilecek
- `SUPABASE_URL` ortam degiskeninden alinacak
- Script asenkron calisacak, sayfa yuklemesini engellemeyecek
- Hata durumunda sessizce basarisiz olacak (kullanici deneyimini etkilemeyecek)

## Sonuc
Bu degisiklikten sonra, yayinlanan her site otomatik olarak ziyaretci verisi toplayacak. Kullanicilar Analytics sayfasinda ve Website Dashboard'da gercek verileri (sayfa goruntumeleri, tekil ziyaretciler, cihaz dagilimi, trafik trendi) gorebilecek.
