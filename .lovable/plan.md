
# Hizmet Kartlarinda Ikon Yerine Gorsel Kullanma

## Mevcut Sorun

Hizmet kartlarinda "heart", "activity", "smile" gibi ikon isimleri duz metin olarak gorunuyor. Bunun iki nedeni var:

1. AI prompt, tum sektorler icin tip/saglik ikonlari (stethoscope, pill, syringe vb.) oneriyor - kahve dukkanina bile
2. ChaiBuilder ServicesGrid blogu bu isimleri emoji olarak gostermeye calisiyor ama dogru eslestirme yapamiyor, sonuc: duz metin

## Cozum

Ikon alanini tamamen kaldirip, her hizmet icin **Pixabay'den otomatik gorsel** cekilecek. Boylece kahve dukkanina kahve gorseli, restoranta yemek gorseli gelecek.

### 1. AI Prompt Guncelleme (`supabase/functions/generate-website/index.ts`)

- `servicesList` ve `highlights` icin `icon` alani yerine `imageSearchTerm` alani eklenecek
- AI, her hizmet icin Ingilizce arama terimi uretecek (ornegin: "filter coffee brewing", "espresso machine", "cheesecake dessert")
- Highlights icin de ayni mantik: `"icon": "heart|shield|..."` yerine `"imageSearchTerm": "string (English search term for Pixabay)"`

### 2. Gorsel Alma Mantigi (`supabase/functions/generate-website/index.ts`)

- Icerik uretildikten sonra, her hizmetin `imageSearchTerm` degeri ile Pixabay API'den kucuk boyutlu gorsel URL'leri cekilecek
- Bu URL'ler `servicesList[i].image` alanina yazilacak
- Mevcut `fetch-images` veya `search-pixabay` Edge Function'lari kullanilabilir ya da ayni fonksiyon icinde dogrudan Pixabay API cagrisi yapilabilir

### 3. ChaiBuilder ServicesGrid Blogu Guncelleme (`src/components/chai-builder/blocks/services/ServicesGrid.tsx`)

- `ServiceItem` arayuzune `image?: string` alani eklenecek
- Ikon/emoji gosterimi yerine, gorsel varsa `<img>` etiketi gosterilecek
- Gorsel yoksa fallback olarak emoji veya varsayilan bir ikon gosterilecek
- Kart tasarimi: Ust kisimda yuvarlak veya kare gorsel, altinda baslik ve aciklama

### 4. Donusturucu Guncelleme (`src/components/chai-builder/utils/convertToChaiBlocks.ts`)

- `services` mapping'inde `icon` yerine `image` alani da aktarilacak
- `service.image || service.icon || '...'` seklinde fallback zinciri

## Teknik Detaylar

### Degistirilecek Dosyalar

**1. `supabase/functions/generate-website/index.ts`**
- Satir 259: highlights icon listesini `imageSearchTerm` ile degistir
- Satir 298: servicesList icon listesini `imageSearchTerm` ile degistir
- Icerik uretildikten sonra, her hizmet icin Pixabay API'den gorsel URL'si cek (PIXABAY_API_KEY mevcut secret'lardan kullanilacak)
- Gorselleri `servicesList[i].image` ve `highlights[i].image` alanlarina yaz

**2. `src/components/chai-builder/blocks/services/ServicesGrid.tsx`**
- `ServiceItem` arayuzune `image?: string` ekle
- Render kisminida emoji yerine: gorsel varsa `<img>` goster, yoksa emoji fallback
- Gorsel alani icin `aspect-square rounded-xl object-cover` stili
- Default services listesine ornek gorsel URL'leri ekle

**3. `src/components/chai-builder/utils/convertToChaiBlocks.ts`**
- Satir 139-143: services mapping'inde `image: service.image || ''` ekle

**4. `src/types/generated-website.ts`** (gerekirse)
- ServicesList tipine `image?: string` ve `imageSearchTerm?: string` ekle
