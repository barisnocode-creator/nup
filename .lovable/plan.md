

# E-posta ile Şifresiz Giriş (Test Modu)

## Ozet
Giriş ve kayıt formlarından şifre alanını kaldırarak, test sürecinde kullanıcıların sadece e-posta adresi ile giriş yapabilmelerini saglayacagiz. Google ve Apple ile giriş zaten sifre gerektirmeden calisiyor, bu degisiklik sadece e-posta girisini etkiler.

## Yapilacak Degisiklikler

### 1. AuthContext - Sifresiz Giris Fonksiyonlari Ekleme
**Dosya:** `src/contexts/AuthContext.tsx`

- `signInWithOtp` fonksiyonu eklenecek (Supabase Magic Link / OTP kullanarak)
- Kullanici sadece e-posta adresini girer, sifre gerekmez
- Supabase `signInWithOtp` API'si ile e-posta adresine otomatik giris linki gonderilir
- Eger kullanici kayitli degilse, otomatik olarak hesap olusturulur
- `signUp` ve `signIn` fonksiyonlari kalacak (ileride tekrar aktif edilebilir)

### 2. AuthModal - Sifre Alani Kaldirilacak
**Dosya:** `src/components/auth/AuthModal.tsx`

- Login ve Signup sekmelerindeki sifre alanlari kaldirilacak
- Form validasyonu sadece e-posta adresi kontrol edecek (zod schema guncelleme)
- "Log In" ve "Create Account" butonlari yerine tek bir "E-posta ile Devam Et" butonu olacak
- Kullanici e-posta girdikten sonra magic link/OTP gonderilecek
- Basarili gonderimde bilgilendirme mesaji gosterilecek: "E-postanizi kontrol edin, giris linkiniz gonderildi"
- Login/Signup tablari kaldirilacak, tek bir form olacak

### 3. AuthWallOverlay - Degisiklik Yok
- Google ve Apple butonlari aynen kalacak
- "Login with email" butonu zaten AuthModal'i aciyor, o da sifresiz calisacak

---

## Teknik Detaylar

### Supabase OTP/Magic Link Implementasyonu
```typescript
// AuthContext'e eklenecek yeni fonksiyon
const signInWithOtp = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { error: error as Error | null };
};
```

### Guncellenecek Form Schema
```typescript
// Sadece email, sifre yok
const authSchema = z.object({
  email: z.string().email('Lutfen gecerli bir e-posta adresi girin'),
});
```

### AuthModal Yeni Akis
- Kullanici e-posta girer
- "E-posta ile Devam Et" butonuna tiklar
- Supabase magic link gonderir
- Kullanici "E-postanizi kontrol edin" mesajini gorur
- E-postadaki linke tiklayinca otomatik giris yapilir

### Degistirilecek Dosyalar
1. `src/contexts/AuthContext.tsx` - `signInWithOtp` ekleme, interface guncelleme
2. `src/components/auth/AuthModal.tsx` - Sifre alani kaldirma, OTP akisina gecis, tab'lari kaldirma

