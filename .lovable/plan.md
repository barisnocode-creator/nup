

## Netlify Publish Check & Approve - Stage 2

### Mevcut Durum

Simdi `verify-domain` Edge Function'i DNS dogrulamasindan sonra basit bir `setNetlifyCustomDomain` cagrisi yapiyor. Ancak SSL sertifikasi durumu kontrol edilmiyor, Netlify domain API'si (POST /sites/{id}/domains) kullanilmiyor, ve otomatik publish tetikleme yok.

### Yapilacaklar

Mevcut `verify-domain` Edge Function'ini genisletip Netlify entegrasyonunu tam otomatik hale getirmek:

1. DNS dogrulamasi basarili oldugunda Netlify'a domain kaydet (POST /sites/{id}/domains)
2. SSL sertifikasi durumunu exponential backoff ile kontrol et
3. Basari durumunda DB'yi guncelle ve opsiyonel olarak publish tetikle
4. Basarisizlikta tanimlama bilgisi don

### Teknik Detaylar

**Dosya: `supabase/functions/verify-domain/index.ts` - GUNCELLE**

Mevcut `setNetlifyCustomDomain` fonksiyonunu genisletip su adimlari ekle:

1. **Netlify Domain Kaydi**: Mevcut `PUT /sites/{id}` yerine once `GET /sites/{id}/domain_aliases` ile mevcut domainleri kontrol et. Yoksa `POST /sites/{id}/domain_aliases` ile ekle.

2. **SSL Sertifikasi Polling**: Domain eklendikten sonra `GET /sites/{id}/ssl` endpoint'ini exponential backoff ile sorgula (5s, 15s, 60s - toplam 3 deneme). Beklenen durum: `state: "issued"` veya HTTPS aktif.

3. **DNS Uyumluluk Kontrolu**: Netlify'in bekledigiyle gercek DNS kayitlarini karsilastir. A kaydi veya CNAME yonlendirmesinin dogru oldugundan emin ol.

4. **Yanit Zenginlestirme**: Basari durumunda `https_status`, `ssl_state`, `netlify_domain_id` bilgilerini don. Basarisizlikta detayli tanimlama (DNS lookup sonuclari, Netlify API hata mesajlari) don.

5. **Opsiyonel Otomatik Publish**: Eger proje henuz publish edilmemisse veya `allow_publish` parametresi varsa, `deploy-to-netlify` Edge Function'inin yaptigi islemi tetikle (ya da kullaniciya "simdi yayinla" butonu goster).

Yeni `verify-domain` akisi:

```text
1. Kullanici "Dogrula" butonuna tiklar
2. DNS TXT dogrulamasi yapilir (mevcut mantik)
3. Basariliysa:
   a. DB'de status = "verified" olarak guncelle
   b. Netlify site'inda domain kaydet (POST domain_aliases)
   c. SSL sertifikasi durumunu kontrol et (polling)
   d. SSL basariliysa: status = "active", https_enabled = true
   e. SSL henuz hazir degilse: status = "verified" (SSL arkaplanda devam eder)
4. Basarisizsa: mevcut hata yaniti
```

**Dosya: `src/components/website-preview/DomainListItem.tsx` - GUNCELLE**

- "verified" durumundaki domainler icin SSL durumu gosterimi ekle
- "active" durumu icin yesil rozet ve HTTPS ikonu
- Dogrulama sonrasi Netlify baglanti durumunu goster

**Dosya: `src/components/website-preview/DomainSettingsModal.tsx` - KUCUK GUNCELLE**

- `handleVerifyDomain` fonksiyonunda yeni yanit alanlarini isle (ssl_state, https_status)
- Dogrulama sonrasi basari mesajini SSL durumuna gore ayarla

### DB Degisiklikleri

Ek migration gerekmez. Mevcut `custom_domains` tablosundaki `status` alani yeterli - "active" durumunu SSL tamamlandiginda kullanacagiz. Mevcut durumlar: pending, verifying, verified, failed. Yeni durum: "active" (SSL dahil tam aktif).

### Dosya Degisiklikleri Ozeti

| Dosya | Islem | Aciklama |
|-------|-------|----------|
| `supabase/functions/verify-domain/index.ts` | GUNCELLE | Netlify domain kaydi + SSL polling + zengin yanit |
| `src/components/website-preview/DomainListItem.tsx` | GUNCELLE | SSL durumu gosterimi, "active" rozeti |
| `src/components/website-preview/DomainSettingsModal.tsx` | GUNCELLE | Yeni yanit alanlarini isle |

### Guvenlik

- NETLIFY_API_TOKEN zaten secrets'ta mevcut
- Kullanici kimlik dogrulamasi mevcut verify-domain akisinda korunuyor
- Proje sahipligi kontrolu mevcut RLS politikalariyla saglanir

### Edge Case'ler

- Netlify site'i henuz olusturulmamissa (netlify_site_id null): domain kaydini atla, kullaniciya "once yayinlayin" mesaji goster
- SSL sertifikasi timeout icinde tamamlanmazsa: domain'i "verified" olarak birak, kullaniciya "SSL isleniyor, birkaç dakika icinde aktif olacak" mesaji goster
- Domain zaten Netlify'da kayitliysa: atlayip SSL kontrolune gec
- Netlify API hatasi: domain DB'de "verified" kalir, kullaniciya Netlify baglanti hatasini bildir

