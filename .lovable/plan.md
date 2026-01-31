

# Favicon Tipi için Veritabanı Constraint Güncelleme

## Problem

`studio_images` tablosundaki `type` sütununda bir CHECK constraint bulunuyor:
```sql
CHECK ((type = ANY (ARRAY['logo'::text, 'social'::text, 'poster'::text, 'creative'::text])))
```

Yeni eklenen `favicon` tipi bu listede olmadığı için, favicon oluşturma işlemi "violates check constraint" hatasıyla başarısız oluyor.

---

## Çözüm

`studio_images_type_check` constraint'ini güncelleyerek `favicon` tipini ekleyeceğiz.

### SQL Migration

```sql
-- Mevcut constraint'i kaldır
ALTER TABLE public.studio_images 
DROP CONSTRAINT studio_images_type_check;

-- Yeni constraint'i favicon dahil olarak ekle
ALTER TABLE public.studio_images 
ADD CONSTRAINT studio_images_type_check 
CHECK (type = ANY (ARRAY['logo'::text, 'favicon'::text, 'social'::text, 'poster'::text, 'creative'::text]));
```

---

## Değişiklik

| Dosya/Kaynak | Değişiklik |
|--------------|------------|
| Veritabanı migration | `studio_images_type_check` constraint güncelleme |

---

## Test Adımları

Değişiklik sonrası:
1. Studio'da Favicon tipini seç
2. Bir prompt gir ve oluştur
3. Görsel başarıyla oluşturulmalı
4. "Web Sitesine Uygula" ile projeye uygula
5. Veritabanında `generated_content.siteSettings.favicon` alanını kontrol et

