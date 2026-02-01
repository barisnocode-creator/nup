
# Settings ve Help Sayfaları Uygulama Planı

## Genel Bakış

Dashboard'daki Settings ve Help linkleri şu anda `/dashboard`'a yönlendiriyor ve hiçbir işlev sunmuyor. Bu plan, kullanıcı hesap yönetimi için tam işlevsel Settings sayfası ve Help/Destek sistemi oluşturmayı hedefliyor.

---

## Mevcut Durum Analizi

| Bileşen | Konum | Durum |
|---------|-------|-------|
| Settings Link | `DashboardSidebar.tsx` satır 42 | `/dashboard`'a yönleniyor |
| Help Link | `DashboardSidebar.tsx` satır 43 | `/dashboard`'a yönleniyor |
| AuthContext | `contexts/AuthContext.tsx` | Şifre değiştirme yok |
| Veritabanı | - | `profiles` tablosu yok |

---

## Uygulama Planı

### Bölüm 1: Settings Sayfası

#### 1.1 Yeni Dosyalar

**`src/pages/Settings.tsx`** - Ana settings sayfası

Özellikleri:
- DashboardLayout kullanarak tutarlı görünüm
- Tab yapısı: Profile, Security, Preferences, Danger Zone
- Responsive tasarım

**`src/components/settings/ProfileSection.tsx`**
- Kullanıcı adı/görünen isim düzenleme
- Avatar yükleme (opsiyonel - storage kullanır)
- Email gösterimi (salt okunur)
- Kayıt tarihi gösterimi

**`src/components/settings/SecuritySection.tsx`**
- Şifre değiştirme formu (mevcut şifre + yeni şifre + onay)
- Supabase `auth.updateUser({ password })` kullanımı
- Şifre sıfırlama email gönderme
- Aktif oturumları gösterme (gelecekte)

**`src/components/settings/PreferencesSection.tsx`**
- Dil tercihi (Türkçe/İngilizce) - localStorage
- Email bildirim tercihleri
- Tema tercihi (karanlık/aydınlık) - next-themes entegrasyonu mevcut

**`src/components/settings/DangerZoneSection.tsx`**
- Hesap silme (tüm projeleri siler)
- Onay dialog'u ile güvenlik

#### 1.2 AuthContext Güncellemesi

`src/contexts/AuthContext.tsx` dosyasına eklenmesi gereken fonksiyonlar:

```text
updatePassword(newPassword: string) -> Promise<{ error: Error | null }>
resetPassword(email: string) -> Promise<{ error: Error | null }>
deleteAccount() -> Promise<{ error: Error | null }>
```

#### 1.3 Veritabanı Değişikliği (Opsiyonel)

Eğer profil bilgileri (görünen ad, avatar) saklanacaksa:

```text
profiles tablosu:
- id: uuid (primary key, auth.users.id referansı)
- display_name: text
- avatar_url: text
- preferences: jsonb (dil, tema, bildirimler)
- created_at: timestamp
- updated_at: timestamp
```

RLS Politikaları:
- Kullanıcı kendi profilini görüntüleyebilir
- Kullanıcı kendi profilini güncelleyebilir

---

### Bölüm 2: Help Sayfası

#### 2.1 Yeni Dosyalar

**`src/pages/Help.tsx`** - Ana yardım sayfası

İçerik bölümleri:
- SSS (Sıkça Sorulan Sorular) - Accordion komponenti
- Hızlı Başlangıç Rehberi
- Video Eğitimler (linkler)
- İletişim/Destek Formu

**`src/components/help/FAQSection.tsx`**
- Kategorize edilmiş sorular
- Accordion UI (shadcn/ui mevcut)
- Arama fonksiyonu

**`src/components/help/ContactSupport.tsx`**
- Destek formu
- Konu seçimi (dropdown)
- Mesaj alanı
- Email edge function ile gönderim (opsiyonel)

#### 2.2 SSS İçerikleri (Örnek)

```text
Genel:
- Open Lucius nedir?
- Nasıl başlarım?
- Ücretsiz mi?

Website Oluşturma:
- Template nasıl değiştirilir?
- Görseller nereden geliyor?
- AI içerik nasıl düzenlenir?

Yayınlama:
- Subdomain nasıl alınır?
- Custom domain nasıl bağlanır?
- SEO ayarları nerede?
```

---

### Bölüm 3: Routing ve Navigation Güncellemeleri

#### 3.1 App.tsx Güncellemesi

```text
Yeni route'lar:
- /settings -> ProtectedRoute içinde Settings sayfası
- /help -> ProtectedRoute içinde Help sayfası
```

#### 3.2 DashboardSidebar.tsx Güncellemesi

```text
navItems dizisi güncellemesi:
- Settings: url -> '/settings'
- Help: url -> '/help'
```

---

## Dosya Değişiklikleri Özeti

| Dosya | İşlem |
|-------|-------|
| `src/pages/Settings.tsx` | Yeni oluştur |
| `src/pages/Help.tsx` | Yeni oluştur |
| `src/components/settings/ProfileSection.tsx` | Yeni oluştur |
| `src/components/settings/SecuritySection.tsx` | Yeni oluştur |
| `src/components/settings/PreferencesSection.tsx` | Yeni oluştur |
| `src/components/settings/DangerZoneSection.tsx` | Yeni oluştur |
| `src/components/help/FAQSection.tsx` | Yeni oluştur |
| `src/components/help/ContactSupport.tsx` | Yeni oluştur |
| `src/App.tsx` | Güncelle (2 yeni route) |
| `src/contexts/AuthContext.tsx` | Güncelle (3 yeni fonksiyon) |
| `src/components/dashboard/DashboardSidebar.tsx` | Güncelle (URL'ler) |

---

## Veritabanı Değişikliği (Opsiyonel)

Eğer profil bilgileri saklanacaksa migration gerekli:

```text
1. profiles tablosu oluştur
2. RLS politikaları ekle
3. Trigger: auth.users insert sonrası otomatik profil oluştur
```

---

## UI Tasarım

### Settings Sayfası Yapısı

```text
┌──────────────────────────────────────────────────────────┐
│  [Sidebar]  │           Settings                         │
│             │  ┌───────────────────────────────────────┐ │
│  Home       │  │ [Profile] [Security] [Preferences]   │ │
│  Website    │  └───────────────────────────────────────┘ │
│  Studio     │                                            │
│  Analytics  │  ┌────────────────────────────────────────┐│
│  Settings ◄ │  │  Profile Section                       ││
│  Help       │  │  ┌────────────────────────────────┐   ││
│             │  │  │ Avatar    Display Name         │   ││
│             │  │  │ [  👤  ]  [________________]    │   ││
│             │  │  │                                │   ││
│             │  │  │ Email (read-only)              │   ││
│             │  │  │ user@example.com               │   ││
│             │  │  └────────────────────────────────┘   ││
│             │  │                           [Save]       ││
│             │  └────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

### Help Sayfası Yapısı

```text
┌──────────────────────────────────────────────────────────┐
│  [Sidebar]  │           Help & Support                   │
│             │                                            │
│             │  [Search FAQ...                    🔍]     │
│             │                                            │
│             │  Frequently Asked Questions               │
│             │  ┌────────────────────────────────────────┐│
│             │  │ ▸ Nasıl website oluştururum?          ││
│             │  │ ▸ Template nasıl değiştirilir?        ││
│             │  │ ▸ Custom domain nasıl bağlanır?       ││
│             │  │ ▸ AI görseller nereden geliyor?       ││
│             │  └────────────────────────────────────────┘│
│             │                                            │
│             │  Need More Help?                          │
│             │  ┌────────────────────────────────────────┐│
│             │  │ 📧 support@openlucius.com             ││
│             │  │ 💬 Destek Formu                       ││
│             │  └────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

---

## Teknik Notlar

1. **Şifre Değiştirme**: Supabase `auth.updateUser({ password })` kullanır, kullanıcı zaten oturum açmış olmalı
2. **Hesap Silme**: İlişkili tüm verileri (projects, studio_images, analytics_events, custom_domains) silmeli - CASCADE veya manuel
3. **Avatar Storage**: Mevcut `user-images` bucket'ı kullanılabilir
4. **Tema Tercihi**: `next-themes` paketi zaten kurulu, entegrasyon kolay
5. **Dil Tercihi**: localStorage + React Context ile basit uygulama

---

## Beklenen Sonuçlar

1. Settings sayfası tam işlevsel olacak
2. Kullanıcılar şifrelerini değiştirebilecek
3. Hesap silme güvenli şekilde çalışacak
4. Help sayfası SSS ve destek formu içerecek
5. Sidebar navigasyonu düzgün çalışacak
