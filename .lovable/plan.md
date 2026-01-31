
# Edge Functions Oluşturma Planı

Bu plan, özel domain yönetimi için gerekli 3 Edge Function'ı oluşturacak.

---

## Oluşturulacak Edge Functions

### 1. add-custom-domain

**Görevi:** Yeni bir domain ekler ve verification token oluşturur.

**Akış:**
```text
Kullanıcı -> Domain gir (www.drklinik.com)
                    |
                    v
         ┌──────────────────────┐
         │  1. JWT doğrula      │
         │  2. Domain formatı   │
         │     kontrol et       │
         │  3. Proje sahipliği  │
         │     kontrol et       │
         │  4. custom_domains   │
         │     tablosuna ekle   │
         └──────────────────────┘
                    |
                    v
         DNS talimatları + token döndür
```

**Özellikler:**
- JWT ile kullanıcı kimlik doğrulama
- Domain format validasyonu (www/non-www, TLD kontrolü)
- Proje sahipliği kontrolü
- Aynı domain'in tekrar eklenmesini engelleme
- Verification token otomatik oluşturma (veritabanı tarafından)

---

### 2. verify-domain

**Görevi:** DNS TXT kaydını kontrol ederek domain'i doğrular.

**Akış:**
```text
Kullanıcı -> "Doğrula" butonuna tıkla
                    |
                    v
         ┌──────────────────────────────┐
         │  1. Domain ID al             │
         │  2. Mevcut token'ı getir     │
         │  3. DNS TXT sorgula          │
         │     (_lovable.domain.com)    │
         │  4. Token eşleşme kontrol    │
         │  5. Status güncelle          │
         └──────────────────────────────┘
                    |
           ┌───────┴───────┐
           v               v
       verified         failed
```

**DNS Sorgu Yöntemi:**
- Deno'nun native DNS API'sini kullanacağız: `Deno.resolveDns()`
- TXT kaydı formatı: `lovable_verify=TOKEN`
- Kayıt yeri: `_lovable.domain.com`

---

### 3. remove-domain

**Görevi:** Kullanıcının kendi domain'ini silmesine izin verir.

**Özellikler:**
- JWT ile kimlik doğrulama
- Proje sahipliği kontrolü (RLS zaten bunu sağlıyor)
- Soft delete yerine hard delete

---

## Teknik Detaylar

### CORS Yapılandırması
Tüm fonksiyonlar standart CORS headers kullanacak:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, ...',
};
```

### JWT Doğrulama
JWT doğrulama kod içinde yapılacak (`verify_jwt = false` config'de):
```javascript
const authHeader = req.headers.get('authorization');
const token = authHeader?.replace('Bearer ', '');
const { data: claimsData } = await supabase.auth.getClaims(token);
```

### Domain Validasyon Kuralları
- Minimum 4 karakter (a.co gibi)
- Maksimum 253 karakter
- Sadece küçük harf, rakam, tire ve nokta
- TLD zorunlu (.com, .net, .tr, vb.)
- Reserved domainler engelli (localhost, example.com, vb.)

---

## Config.toml Güncellemesi

```toml
project_id = "lpgyafvuihdymgsrmswh"

[functions.add-custom-domain]
verify_jwt = false

[functions.verify-domain]
verify_jwt = false

[functions.remove-domain]
verify_jwt = false

# ... mevcut fonksiyonlar
```

---

## Dosya Yapısı

```text
supabase/functions/
├── add-custom-domain/
│   └── index.ts
├── verify-domain/
│   └── index.ts
├── remove-domain/
│   └── index.ts
└── ... (mevcut fonksiyonlar)
```

---

## API Dökümanı

### POST /add-custom-domain
**Request:**
```json
{
  "projectId": "uuid",
  "domain": "www.drklinik.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "domainId": "uuid",
  "verificationToken": "abc123...",
  "dnsInstructions": {
    "aRecord": { "host": "@", "value": "185.158.133.1" },
    "wwwRecord": { "host": "www", "value": "185.158.133.1" },
    "txtRecord": { "host": "_lovable", "value": "lovable_verify=abc123..." }
  }
}
```

### POST /verify-domain
**Request:**
```json
{
  "domainId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "status": "verified" | "failed",
  "message": "Domain verified successfully"
}
```

### POST /remove-domain
**Request:**
```json
{
  "domainId": "uuid"
}
```

**Response:**
```json
{
  "success": true
}
```

---

## Güvenlik Kontrolleri

1. **Kimlik Doğrulama**: Her fonksiyon JWT token kontrolü yapar
2. **Yetkilendirme**: Kullanıcı sadece kendi projelerine domain ekleyebilir
3. **Rate Limiting**: IP başına dakikada max 10 istek
4. **Input Validation**: Tüm girdiler sanitize edilir

---

## Uygulama Adımları

1. `add-custom-domain/index.ts` oluştur
2. `verify-domain/index.ts` oluştur
3. `remove-domain/index.ts` oluştur
4. `supabase/config.toml` güncelle
5. Fonksiyonları test et

---

Bu planı onaylarsanız, 3 edge function'ı ve config güncellemesini tek seferde oluşturacağım.
