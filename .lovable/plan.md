
# Genel Amaçlı AI Web Sitesi Oluşturucu Dönüşümü

Bu plan, projeyi "sağlık sektörüne özel" olmaktan çıkarıp **herhangi bir sektör/meslek için AI destekli web sitesi oluşturucu** haline getirecek ve kullanıcı fotoğraf yükleme özelliği ekleyecektir.

---

## Mevcut Durum Analizi

Proje zaten kısmen genel amaçlı hale getirilmiş:
- `wizard.ts` sektör tipleri: `service | retail | food | creative | technology | other`
- `wizard-chat` edge function sektör algılama mantığı mevcut
- `generate-website` edge function sektör bazlı Pixabay arama terimleri tanımlı

Ancak **Landing sayfası ve UI metinleri hala sağlık sektörüne özel**.

---

## Yapılacak Değişiklikler

### 1. Landing Sayfası Metinleri (Türkçe/Genel)

**Dosya: `src/components/landing/Hero.tsx`**
| Mevcut | Yeni |
|--------|------|
| "Sağlık web sitenizi AI ile oluşturun" | "Web sitenizi AI ile oluşturun" |
| "Doktorlar, diş hekimleri ve eczacılar için..." | "Her sektör için profesyonel web siteleri" |
| "Ne tür bir klinik/muayenehane?" | "Ne tür bir işletme/proje?" |
| "1000+ Sağlık Profesyoneli Güveniyor" | "1000+ İşletme Güveniyor" |

**Dosya: `src/components/landing/Features.tsx`**
| Mevcut | Yeni |
|--------|------|
| "Sağlık Sektörü İçin #1 AI Web Sitesi Oluşturucu" | "#1 AI Web Sitesi Oluşturucu" |

**Dosya: `src/components/landing/HowItWorks.tsx`**
| Mevcut | Yeni |
|--------|------|
| "Mesleğinizi Seçin" | "İşletmenizi Tanıtın" |
| "Doktor, diş hekimi, eczacı veya diğer sağlık profesyoneli olarak başlayın" | "AI ile kısa bir sohbet yapın, işletmenizi tanıyalım" |

**Dosya: `src/components/landing/TrustSection.tsx`**
| Mevcut | Yeni |
|--------|------|
| "Sağlık Sektörü İçin AI Partneri" | "İşletmeniz İçin AI Partner" |

**Dosya: `src/components/landing/CTASection.tsx`**
| Mevcut | Yeni |
|--------|------|
| "Binlerce sağlık profesyoneli gibi..." | "Binlerce işletme gibi siz de..." |
| "Ne tür bir klinik/muayenehane?" | "Ne tür bir işletme/proje?" |

---

### 2. Website Showcase Bölümü (Yeni Çeşitlilik)

**Dosya: `src/components/landing/WebsiteShowcase.tsx`**

Mevcut sağlık örneklerini **farklı sektörlerden** örneklerle değiştir:

```text
Mevcut örnekler (sağlık odaklı):
- Diş Kliniği
- Aile Hekimliği
- Eczane
- Göz Kliniği

Yeni örnekler (genel):
- Restoran / Kafe
- Hukuk Bürosu
- Dijital Ajans
- E-ticaret Butik
```

**Yeni asset dosyaları gerekecek** (veya Pixabay'den dinamik çekim):
- `showcase-restaurant.jpg`
- `showcase-law-office.jpg`
- `showcase-digital-agency.jpg`
- `showcase-boutique.jpg`

---

### 3. Kullanıcı Fotoğraf Yükleme Özelliği

Kullanıcıların kendi fotoğraflarını yükleyebilmesi için storage bucket ve UI eklenmeli.

**3.1 Storage Bucket Oluşturma (SQL Migration)**
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-images', 'user-images', true);

-- RLS Politikaları
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read their own images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public images are readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-images');
```

**3.2 Yeni Bileşen: ImageUploadButton**

**Dosya: `src/components/website-preview/ImageUploadButton.tsx`**

Editör sidebar'a "Upload" butonu ekle:
- File input ile görsel seçimi
- Supabase Storage'a yükleme
- Yüklenen URL'i callback ile döndürme
- Loading state ve hata gösterimi

**3.3 EditorSidebar Güncelleme**

**Dosya: `src/components/website-preview/EditorSidebar.tsx`**

Görsel düzenleme bölümüne 3. buton ekle:
```text
Mevcut: [Find Similar] [Change]
Yeni:   [Find Similar] [Change] [Upload]
```

---

### 4. AI İçerik Oluşturma Prompt Güncellemesi

**Dosya: `supabase/functions/generate-website/index.ts`**

`buildPrompt` fonksiyonunu güncelleyerek sektöre özgü talimatlar:

```text
Mevcut: Sadece healthcare professions için detaylı talimatlar

Yeni: Sektör bazlı dinamik talimatlar
- service: Danışmanlık, hukuk, finans vb. için profesyonel ton
- retail: Mağaza, butik için ürün odaklı içerik
- food: Restoran, kafe için menü ve atmosfer vurgusu
- creative: Tasarım, fotoğraf için portfolio odaklı
- technology: Yazılım, teknoloji için teknik ve yenilikçi ton
- other: Genel işletme içeriği
```

---

### 5. Wizard Chat Prompt İyileştirmesi

**Dosya: `supabase/functions/wizard-chat/index.ts`**

System prompt'u daha genel yapacak şekilde güncelle:
- Sağlık terminolojisini kaldır
- Genel işletme sorularına odaklan
- Sektör algılamayı daha akıllı yap

---

## Dosya Değişiklikleri Özeti

| Dosya | İşlem |
|-------|-------|
| `src/components/landing/Hero.tsx` | Metin güncelleme |
| `src/components/landing/Features.tsx` | Metin güncelleme |
| `src/components/landing/HowItWorks.tsx` | Metin güncelleme |
| `src/components/landing/TrustSection.tsx` | Metin güncelleme |
| `src/components/landing/CTASection.tsx` | Metin güncelleme |
| `src/components/landing/WebsiteShowcase.tsx` | Yeni örnekler |
| `src/components/website-preview/ImageUploadButton.tsx` | Yeni dosya |
| `src/components/website-preview/EditorSidebar.tsx` | Upload butonu ekleme |
| `supabase/functions/generate-website/index.ts` | Prompt güncelleme |
| `supabase/functions/wizard-chat/index.ts` | Prompt güncelleme |
| SQL Migration | Storage bucket oluşturma |

---

## Uygulama Sırası

1. Landing sayfası metin güncellemeleri (hızlı, görünür etki)
2. Storage bucket oluşturma (backend hazırlığı)
3. ImageUploadButton bileşeni oluşturma
4. EditorSidebar entegrasyonu
5. AI prompt güncellemeleri
6. Showcase görselleri güncelleme (opsiyonel, Pixabay kullanılabilir)

---

## Teknik Detaylar

### Storage Yapısı
```text
user-images/
  └── {user_id}/
      └── {project_id}/
          └── {timestamp}_{filename}
```

### Upload Akışı
```text
[Upload Button Click]
    ↓
[File Input Dialog]
    ↓
[File Seçimi]
    ↓
[Supabase Storage Upload]
    ↓
[Public URL Alma]
    ↓
[Image Path Güncelleme]
    ↓
[Preview Yenileme]
```

### Desteklenecek Formatlar
- JPG/JPEG
- PNG
- WebP
- Maksimum boyut: 5MB
