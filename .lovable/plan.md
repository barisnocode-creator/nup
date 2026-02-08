
# Tum Gorselleri Pixabay'den Cekme - AI Gorsel Uretimini Kaldirma

## Mevcut Durum
- `generate-website` edge function zaten sektore uygun Pixabay gorsellerini cekiyor (hero, galeri, blog icin)
- Ancak `Project.tsx` icerisinde website olusturulduktan sonra `generate-images` edge function da cagriliyor
- `generate-images` AI (Gemini) ile gorsel uretiyor ve Pixabay gorsellerinin ustune yaziyor
- Bu gereksiz kredi kullaniyor ve sonuclar her zaman iyi olmuyor

## Cozum
AI gorsel uretimini tamamen devre disi birakip, tum gorselleri Pixabay'den cekmek. `generate-website` zaten bunu yapiyor, sadece sonrasindaki AI gorsel uretim adimini kaldirmak yeterli.

Ayrica Pixabay arama terimlerini daha akilli hale getirmek: her bolum icin kullanicinin girdigi is turuyle (ornegin "Turk mutfagi restorani") eslesen spesifik arama terimleri kullanmak.

## Yapilacak Degisiklikler

### 1. Project.tsx - AI gorsel uretim cagrisini kaldirma
**Dosya:** `src/pages/Project.tsx`

- `generateImages()` fonksiyonu ve `generate-images` edge function cagrisi kaldirılacak
- `generateWebsite()` icerisindeki `generateImages(projectId)` satiri silinecek
- `generatingImages` state ve ilgili UI elemanlari temizlenecek
- `generate-website` zaten Pixabay gorsellerini getiriyor, ekstra cagri gerekmiyor

### 2. generate-website Edge Function - Pixabay Arama Terimlerini Zenginlestirme
**Dosya:** `supabase/functions/generate-website/index.ts`

Mevcut sektorel arama terimleri yeterli ama iyilestirilebilir:
- Kullanicinin girdigi `businessName` ve `services` bilgilerini Pixabay arama terimlerine ekleme
- Ornegin "Turk mutfagi restorani" icin sadece "restaurant interior" degil, "turkish restaurant kebab dining" gibi spesifik aramalar
- AI'dan (text generation sirasinda) her bolum icin en uygun Pixabay arama terimlerini de uretmesini isteme
- Uretilen terimleri Pixabay'de arama ve en uygun gorselleri secme

### 3. generate-website Prompt'una Gorsel Arama Terimleri Ekleme
**Dosya:** `supabase/functions/generate-website/index.ts`

AI'nin urettigi JSON'a yeni bir alan ekleme:
```
"imageSearchTerms": {
  "hero": "turkish restaurant kebab interior dining warm ambiance",
  "about": "chef kitchen turkish cooking team",
  "services": "food dishes menu presentation gourmet",
  "gallery": ["restaurant interior", "kebab plate", "chef cooking", "dining table", "dessert baklava", "outdoor terrace"],
  "cta": "happy customers dining restaurant",
  "blog_default": "food cooking culinary turkish"
}
```

Bu sayede AI, is turune ozel en uygun gorsel arama terimlerini belirleyecek ve Pixabay'de tam olarak o terimleri arayacak.

### 4. generate-website'te Dinamik Gorsel Arama
**Dosya:** `supabase/functions/generate-website/index.ts`

Mevcut sabit `sectorSearchTerms` yerine, AI'nin urettigi `imageSearchTerms` oncelikli olacak:
1. Once AI'nin urettigi ozel arama terimlerini kullan
2. AI uretmediyse, mevcut sektorel varsayilan terimlere dusun (fallback)
3. Pixabay'de sonuc bulunamazsa, daha genel terimlerle tekrar dene

### 5. convertToChaiBlocks.ts - CTA ve Ek Gorsel Alanlari
**Dosya:** `src/components/chai-builder/utils/convertToChaiBlocks.ts`

- CTA blogu icin `ctaImage` alanini kullanma
- Hizmet kartlari icin individual gorsel desteği (gelecek iyilestirme)

## Degistirilecek Dosyalar

1. `src/pages/Project.tsx` - `generateImages` cagrisini kaldirma (10-15 satir degisiklik)
2. `supabase/functions/generate-website/index.ts` - AI prompt'una `imageSearchTerms` ekleme + dinamik arama mantigi

## Sonuc
- AI gorsel uretimi tamamen kalkar, kredi harcanmaz
- Her bolum icin is turune ozel akilli Pixabay aramalari yapilir
- AI, her bolum icin en uygun arama terimlerini belirler (ornegin "restoran" icin "Turkish kebab dining" gibi)
- Mevcut Pixabay API anahtari zaten yapilandirilmis durumda, ek bir ayar gerekmez
