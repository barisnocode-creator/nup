
# IP Bazli Test Hesabi Sistemi

## Mevcut Durum
Simdi tum kullanicilar ayni `test@openlucius.com` hesabina giris yapiyor. Bu da herkesin ayni projeleri, ayni verileri gormesine neden oluyor.

## Yeni Sistem
Her farkli IP adresi icin benzersiz bir test hesabi olusturulacak. Boylece her ziyaretci bos bir dashboard ile baslayacak.

### Nasil Calisacak

1. **IP Tespiti**: Kullanici "Test" butonuna bastiginda, ucretsiz bir public API (`https://api.ipify.org?format=json`) uzerinden IP adresi alinacak
2. **Benzersiz Email**: IP adresi basit bir hash'e donusturulup `test-{hash}@openlucius.com` formatinda benzersiz email olusturulacak
3. **Otomatik Hesap**: Bu email ile hesap yoksa olusturulacak, varsa giris yapilacak (mevcut mantik korunacak)

### Ornek
- IP `85.102.45.12` -> email: `test-85102045012@openlucius.com`
- IP `192.168.1.5` -> email: `test-192168001005@openlucius.com`

Her IP farkli bir hesap alacagi icin projeler, gorseller ve diger veriler tamamen izole olacak.

## Teknik Detaylar

### Degistirilecek Dosya: `src/contexts/AuthContext.tsx`

`testSignIn` fonksiyonu guncellenecek:

1. `fetch('https://api.ipify.org?format=json')` ile IP alinacak
2. IP'den deterministik bir string uretilecek (noktalari kaldirip padding ile normalize)
3. `test-{normalizedIp}@openlucius.com` seklinde email olusturulacak
4. Mevcut sign-in/sign-up mantigi bu yeni email ile calisacak
5. IP alinamazsa fallback olarak `crypto.randomUUID()` ile rastgele hesap olusturulacak (tek kullanimlik)

Baska hicbir dosyada degisiklik gerekmeyecek. AuthModal, Header, Hero ve diger bilesenlerde `testSignIn()` cagrisi aynen kalacak.
