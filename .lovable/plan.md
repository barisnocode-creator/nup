

## Otomatik DNS Yapilandirma Sistemi (2 Asamali)

### Genel Bakis

Kullanicilar domain eklerken "Manuel" veya "Otomatik" kurulum secebilecek. Otomatik kurulumda Namecheap, GoDaddy veya Cloudflare API bilgilerini girerek DNS kayitlarini tek tikla yapilandirabilecekler. Sistem iki asamali calisacak: once dry-run (onizleme), sonra gercek uygulama.

### 2 Asamali Akis

```text
Asama 1 - Dry Run (Onizleme):
  1. Kullanici domain + saglayici + API bilgilerini girer
  2. Sistem saglayici API'sine baglanir
  3. Mevcut DNS kayitlarini ceker (yedek snapshot)
  4. Cakisma kontrolu yapar
  5. Yapilacak degisiklikleri kullaniciya gosterir
  6. Kullanici onaylar veya iptal eder

Asama 2 - Uygulama + Dogrulama:
  1. Kullanici onayladiktan sonra DNS kayitlari uygulanir
  2. Domain veritabanina eklenir
  3. Eksponansiyel geri cekilme ile DNS dogrulamasi yapilir
  4. Basarisiz olursa otomatik rollback
  5. Sonuc kullaniciya bildirilir
```

### Veritabani Degisiklikleri

`custom_domains` tablosuna yeni sutunlar eklenecek:

| Sutun | Tip | Aciklama |
|-------|-----|----------|
| dns_provider | text (nullable) | namecheap, godaddy, cloudflare |
| auto_configured | boolean (default false) | Otomatik mi yoksa manuel mi kuruldu |
| dns_snapshot | jsonb (nullable) | Islem oncesi DNS kayitlarinin yedegi |
| action_fingerprint | text (nullable) | Idempotency kontrolu icin |

### Yeni Edge Function: `auto-configure-dns`

Tek Edge Function, `dry_run` parametresiyle 2 asamayi yonetir.

**Giris parametreleri:**
- projectId, domain
- provider: "namecheap" | "godaddy" | "cloudflare"
- credentials: { apiKey, apiUser?, apiSecret? }
- dry_run: boolean (varsayilan true)
- domainId: (2. asamada, dry-run sonrasi)

**Saglayici API Entegrasyonlari:**

Namecheap:
- `namecheap.domains.dns.getHosts` ile mevcut kayitlari al
- Yedek snapshot olustur
- Yeni A, TXT (ve varsa CNAME/www) kayitlarini mevcut kayitlara ekle
- `namecheap.domains.dns.setHosts` ile tum kayitlari gonder
- Kisitlama: Kullanicinin Namecheap'te API erisimini acmasi ve IP beyaz listesi yapmasi gerekir

GoDaddy:
- `GET /v1/domains/{domain}/records` ile mevcut kayitlari al
- Yedek snapshot olustur
- `PATCH /v1/domains/{domain}/records` ile yeni kayitlari ekle (mevcut kayitlar korunur)

Cloudflare:
- `GET /zones?name={domain}` ile zone ID al
- `GET /zones/{zone_id}/dns_records` ile mevcut kayitlari al
- Yedek snapshot olustur
- `POST /zones/{zone_id}/dns_records` ile her kaydi ayri ayri ekle

**Eklenecek DNS Kayitlari:**
- A kaydi: `@` -> `75.2.60.5` (mevcut RPC fonksiyonundaki IP ile tutarli)
- TXT kaydi: `_lovable` -> `lovable_verify={token}`
- (Opsiyonel) A kaydi: `www` -> `75.2.60.5`

**Dry-Run Yaniti:**
```text
{
  provider: "godaddy",
  existing_records: [...],     // snapshot
  conflicts: [...],            // cakisan kayitlar
  planned_changes: [...],      // uygulanacak degisiklikler
  warnings: [...]              // uyarilar (ornekin IP beyaz listesi)
}
```

**Uygulama Yaniti:**
```text
{
  domain: "example.com",
  txt_status: "applied",
  a_status: "applied",
  change_log: [...],
  dns_snapshot_id: "...",
  domainId: "..."
}
```

**Hata ve Rollback:**
- Her API yaniti kaydedilir
- Kismi basarisizlikta snapshot'tan geri yukleme denenir
- Rollback basarisiz olursa kullaniciya manuel adimlar gosterilir

**Idempotency:**
- (domain + verification_token + provider) kombinasyonu bir fingerprint olusturur
- Ayni fingerprint ile daha once basarili islem yapildiysa sonuc cache'den doner

### UI Degisiklikleri

**AddDomainForm.tsx - Tamamen Yeniden Yapilandirilacak:**

2 sekmeli tasarim:
- **Manuel Kurulum** sekmesi: Mevcut form (degisiklik yok)
- **Otomatik Kurulum** sekmesi:
  1. Domain adresi girisi
  2. Saglayici secimi (Namecheap / GoDaddy / Cloudflare dropdown)
  3. Saglayiciya gore API bilgileri formu:
     - Namecheap: API Key + Username
     - GoDaddy: API Key + API Secret
     - Cloudflare: API Token (veya Email + Global API Key)
  4. "Onizle (Dry Run)" butonu
  5. Onizleme sonucu gosterimi:
     - Mevcut kayitlar listesi
     - Cakisma uyarilari
     - Yapilacak degisiklikler
  6. "Uygula" onay butonu
  7. Sonuc durumu (basarili/basarisiz/rollback)

**DomainSettingsModal.tsx - Kucuk Guncelleme:**
- Otomatik kurulum sonrasi durum mesajlarini gosterecek sekilde guncelleme
- `auto_configured` olan domainlerde "Otomatik kuruldu" etiketi

### Guvenlik

- API anahtarlari veritabaninda SAKLANMAYACAK
- Yalnizca Edge Function icinde tek seferlik kullanilacak
- HTTPS uzerinden iletilecek
- Edge Function icinde kullanici kimlik dogrulamasi zorunlu
- Tum API yanitlari loglanirken anahtarlar maskelenecek

### Dosya Degisiklikleri Ozeti

| Dosya | Islem |
|-------|-------|
| `supabase/functions/auto-configure-dns/index.ts` | YENI - Tum saglayici entegrasyonlari |
| `supabase/config.toml` | GUNCELLE - verify_jwt = false |
| DB migration | YENI - custom_domains tablosuna 4 yeni sutun |
| `src/components/website-preview/AddDomainForm.tsx` | GUNCELLE - 2 sekmeli tasarim |
| `src/components/website-preview/DomainSettingsModal.tsx` | GUNCELLE - Otomatik durum destegi |
| `src/components/website-preview/DomainListItem.tsx` | GUNCELLE - "Otomatik kuruldu" etiketi |

### Kisitlamalar ve Uyarilar

- **Namecheap**: Kullanicinin Namecheap panelinde API erisimini acmasi ve Edge Function IP'sini beyaz listeye almasi gerekir. Bu kisitlama UI'da acikca gosterilecek.
- **GoDaddy**: Production API Key gerekir (test key calismaz). UI'da bu bilgi verilecek.
- **Cloudflare**: "Edit zone DNS" izni olan bir API Token gerekir.
- **DNS Yayilimi**: Otomatik kurulum sonrasi dogrulama 5-120 saniye icinde yapilir; ancak tam yayilim 48 saate kadar surabilir.
- **Timeout**: Toplam islem limiti 10 dakika, tek API cagrisi limiti 30 saniye.

