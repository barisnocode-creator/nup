
# Gorsel Sorununu Koklunden Cozme Plani

## Mevcut Durum (Test Sonuclari)

### Calisan Ozellikler
- **Stil kontrolleri**: Baslik Boyutu ve Metin Hizalama sag panelde gorunuyor ve secim yapilabiliyor
- **Tailwind yapilandirmasi**: CSS degiskenleri dogru sekilde Tailwind siniflarına baglandi
- **Blok semalari**: Tum bloklarda titleSize ve textAlign prop'lari tanimli

### Calismayanlar
- **Gorseller**: Hicbir gorsel bloklarda gorunmuyor. Tum gorseller veritabaninda 1.5MB+ base64 string olarak sakli. `resolveImage()` fonksiyonu 100KB ustu base64 verileri (dogru olarak) filtreliyor, dolayisiyla hicbir gorsel bloklara aktarilamiyor.

## Kok Neden

`generate-images` edge function'i, AI goruntulerini base64 olarak uretip dogrudan `generated_content.images` JSON sutununa yaziyor. Bu gorseller 1.5-1.8MB boyutlarinda. `convertToChaiBlocks` ise performans ve veritabani guveniligi icin 100KB uzerini filtreliyor.

Pixabay gorselleri (URL formatinda, kucuk boyutlu) ise `generate-website` tarafindan uretilmis olabilir ama `generate-images` calistiktan sonra sadece AI goruntulerinin (heroHome, heroAbout, heroServices) kaldigi, galleryImages/aboutImage/ctaImage gibi Pixabay URL'lerinin hic olmadigi goruldu.

## Cozum: Gorselleri Storage'a Yukle, URL Olarak Sakla

### Adim 1: generate-images Edge Function'da Storage Yukleme
**Dosya:** `supabase/functions/generate-images/index.ts`

Mevcut akis: `AI -> base64 -> dogrudan JSON'a kaydet`
Yeni akis: `AI -> base64 -> Storage bucket'a yukle -> Public URL'yi JSON'a kaydet`

Degisiklikler:
- Base64 veriyi decode edip Supabase Storage'a (ornegin `website-images` bucket) yukle
- Her gorsel icin benzersiz bir path olustur: `{projectId}/{imageKey}.png`
- Bucket'in public URL'sini `generated_content.images` icine kaydet
- Bu sayede `resolveImage()` URL gordugunce filtrelemeden gecirmis olacak

```text
Mevcut:  AI --> base64 (1.5MB) --> generated_content.images.heroHome
Yeni:    AI --> base64 --> Storage upload --> URL --> generated_content.images.heroHome
```

### Adim 2: Storage Bucket Olusturma
Veritabani migration ile `website-images` adinda public bir storage bucket olustur. RLS politikasi: Kullanicilar sadece kendi projelerine ait gorselleri okuyabilir/yazabilir.

### Adim 3: resolveImage Threshold Guncelleme
**Dosya:** `src/components/chai-builder/utils/convertToChaiBlocks.ts`

- URL formatlı gorseller (http/https ile baslayan) icin boyut siniri kaldır
- Base64 filtrelemeyi koru ama threshold'u biraz yukselt (backward compatibility icin)
- Yeni URL'ler sorunsuz gecsin

### Adim 4: Mevcut Projelerin Gorsellerini Migrate Etme
**Dosya:** `src/pages/Project.tsx`

Editori yuklerken:
1. `generated_content.images` icindeki base64 gorselleri tespit et
2. Bunlari Storage'a yukle
3. URL'leri geri yaz
4. Bloklara patch'le

Bu "tek seferlik migration" islemi, mevcut projelerin gorsellerini de kurtaracak.

## Degistirilecek Dosyalar

1. `supabase/functions/generate-images/index.ts` - Base64'u Storage'a yukle, URL dondur
2. `src/components/chai-builder/utils/convertToChaiBlocks.ts` - URL gorselleri filtrelemeden gec
3. `src/pages/Project.tsx` - Mevcut base64 gorselleri Storage'a migrate et ve bloklara yaz
4. Veritabani migration - `website-images` storage bucket olustur

## Beklenen Sonuc

- Tum gorseller Storage'da guvenli sekilde saklanir
- Bloklar icinde sadece kucuk URL string'leri bulunur (DB performansi artar)
- Editorun canvas'inda gorseller gorunur hale gelir
- Yeni olusturulan projelerde gorseller otomatik olarak URL formatinda saklanir
