# Genel Amaçlı AI Web Sitesi Oluşturucu

Bu proje, **herhangi bir sektör/meslek için AI destekli web sitesi oluşturucu** olarak güncellenmiştir.

---

## ✅ Tamamlanan Değişiklikler

### 1. Landing Sayfası Metinleri (Türkçe/Genel) ✅

Tüm sağlık sektörüne özel metinler genel işletme metinlerine dönüştürüldü:

| Dosya | Durum |
|-------|-------|
| `src/components/landing/Hero.tsx` | ✅ Güncellendi |
| `src/components/landing/Features.tsx` | ✅ Güncellendi |
| `src/components/landing/HowItWorks.tsx` | ✅ Güncellendi |
| `src/components/landing/TrustSection.tsx` | ✅ Güncellendi |
| `src/components/landing/CTASection.tsx` | ✅ Güncellendi |

### 2. Website Showcase Bölümü ✅

Yeni sektör örnekleri eklendi:
- Restoran & Kafe
- Hukuk Bürosu
- Dijital Ajans
- Butik Mağaza

### 3. Kullanıcı Fotoğraf Yükleme Özelliği ✅

- `user-images` storage bucket oluşturuldu
- `ImageUploadButton.tsx` bileşeni eklendi
- EditorSidebar'a "Yükle" butonu entegre edildi
- RLS politikaları yapılandırıldı

### 4. AI İçerik Oluşturma Güncellemesi ✅

`generate-website` edge function sektör-bazlı içerik üretecek şekilde güncellendi:
- service: Danışmanlık, hukuk, finans
- retail: Mağaza, butik
- food: Restoran, kafe
- creative: Tasarım, fotoğraf
- technology: Yazılım, teknoloji
- other: Genel işletme

### 5. Wizard Chat ✅

Zaten genel amaçlı sektör algılama ile çalışıyor.

---

## Teknik Detaylar

### Storage Yapısı
```text
user-images/
  └── {user_id}/
      └── {project_id}/
          └── {timestamp}_{filename}
```

### Desteklenen Görsel Formatları
- JPG/JPEG
- PNG
- WebP
- Maksimum boyut: 5MB

---

## Önceki Özellikler (Korundu)

- Custom domain bağlama ve doğrulama
- AI chatbot wizard
- Pixabay görsel entegrasyonu
- Çoklu template desteği
- Analytics takibi
