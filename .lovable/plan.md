
# Sifreli Girisi Kaldirma ve Magic Link Sistemine Gecis

## Sorun
Mevcut `quickSignIn` fonksiyonu arka planda sabit bir sifre (`Xk9$mQ2vLpR7nW4j!`) kullanarak hesap olusturuyor. Bu sifre, arka ucun guvenlik politikalari tarafindan "zayif" olarak reddediliyor ve kullanici giris yapamiyor.

## Cozum
Sifre tabanli sistemi tamamen kaldirip **Magic Link** (sihirli baglanti) sistemine gecis yapilacak. Kullanici sadece e-posta adresini girer, gelen e-postadaki baglantiya tiklar ve otomatik olarak giris yapar.

## Kullanici Deneyimi (Yeni Akis)

```text
1. Kullanici e-posta adresini girer
2. "Giris Yap" butonuna tiklar
3. Ekranda "E-postanizi kontrol edin" mesaji gosterilir
4. Kullanici e-postasindaki baglantiya tiklar
5. Otomatik olarak giris yapilir ve dashboard'a yonlendirilir
```

## Yapilacak Degisiklikler

### 1. AuthContext - quickSignIn Fonksiyonunu Degistirme
**Dosya:** `src/contexts/AuthContext.tsx`

- `quickSignIn` fonksiyonu kaldirilacak
- `signInWithOtp` fonksiyonu ana giris yontemi olarak kullanilacak
- Sabit sifre (`TEST_PASSWORD`) tamamen silinecek
- `signUp` ve `signIn` (sifreli) fonksiyonlari tip tanimindan kaldirilacak (artik kullanilmiyor)

### 2. AuthModal - Magic Link UX Akisi
**Dosya:** `src/components/auth/AuthModal.tsx`

- `quickSignIn` yerine `signInWithOtp` kullanilacak
- Basarili gonderim sonrasi "E-postanizi kontrol edin" mesaji gosterilecek
- E-posta girisi ve basari durumu arasinda gecis yapan bir state eklenecek
- Basari ekraninda: onay ikonu, "Sihirli baglanti gonderildi" basligi, "E-postanizda gelen baglantiya tiklayarak giris yapin" aciklamasi

### 3. AuthWallOverlay - Ayni Mantik
**Dosya:** `src/components/website-preview/AuthWallOverlay.tsx`

- `onEmailSignIn` callback'i ayni kalacak (zaten AuthModal'i aciyor)
- Degisiklik gerekmez

### 4. Landing Sayfasi Bilesenleri
**Dosyalar:** `src/components/landing/Hero.tsx` (varsa e-posta formu)

- Eger dogrudan quickSignIn kullanan baska bilesenler varsa, bunlar da signInWithOtp'ye gecilecek

## Teknik Detaylar

- `signInWithOtp` Supabase'in yerlesik magic link ozelligini kullanir
- E-posta redirect URL'i `window.location.origin/dashboard` olarak ayarlanir
- Hesap yoksa otomatik olusturulur (Supabase OTP davranisi)
- Sifre hic kullanilmaz, guvenlik politikasi sorunu tamamen ortadan kalkar
- Google ve Apple OAuth giris secenekleri aynen kalacak

## Degistirilecek Dosyalar

1. `src/contexts/AuthContext.tsx` - quickSignIn kaldirilacak, signInWithOtp ana yontem olacak
2. `src/components/auth/AuthModal.tsx` - Magic link UX akisi, basari durumu ekrani
