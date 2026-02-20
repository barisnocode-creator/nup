

# Editör Üst Kısım Yerleşim Düzeltmesi

## Sorunlar

1. **Auto-inject edilen SiteHeader boş props ile oluşturuluyor** — `props: {}` geçiliyor, bu yüzden site adı "Site" olarak görünüyor, telefon ve CTA bilgileri eksik kalıyor.

2. **SiteHeader ile Hero bölümü çakışıyor** — Header `sticky top-14` kullanıyor (editör toolbar'ın altında kalması için) ama hero bölümleri (`HeroRestaurant`, `HeroCentered`, `HeroOverlay`) `min-h-screen` veya `min-h-[600px]` ile tam ekran kaplıyor. Header hero'nun üstüne biniyor ve içerik arkasında kalıyor.

3. **Full-screen hero'larda yükseklik hesabı yanlış** — `min-h-screen` editörde toolbar (56px) + header (56px) = 112px fazladan yer kaplıyor, sayfa aşağı taşıyor.

---

## Yapılacak Değişiklikler

### 1. EditorCanvas.tsx — Header'a doğru props geçir

Auto-inject edilen SiteHeader'a proje bilgilerini geçirmek gerekiyor. Bunun için `EditorCanvas`'a `projectName` prop'u eklenecek ve header'a `siteName` olarak aktarılacak.

- `EditorCanvasProps` interface'ine `projectName?: string` eklenir
- Auto-inject header'da `props: { siteName: projectName }` kullanılır
- `SiteEditor.tsx`'den `projectName` EditorCanvas'a geçirilir

### 2. EditorCanvas.tsx — Hero bölümlerine padding-top ekle

Header sticky olduğu için hero bölümlerinin üst kısmına header yüksekliği kadar (56px) boşluk bırakılması gerekiyor. Ancak bunu hero bileşenlerinin kendisine eklemek yerine, canvas wrapper'da ilk section'a `pt-0` verip header'ın hero üzerine binmesine izin verilecek (overlay hero'lar için bu istenilen davranış).

Asıl sorun: Tam ekran hero'lar (`min-h-screen`) editör ortamında viewport'u aşıyor. Bunun çözümü hero bileşenlerinde `min-h-screen` yerine `min-h-[calc(100vh-112px)]` kullanmak (toolbar 56px + header 56px).

### 3. Hero bileşenlerinde yükseklik düzeltmesi

Etkilenen dosyalar:
- `HeroRestaurant.tsx`: `min-h-screen` yerine `min-h-[calc(100vh-7rem)]`
- `HeroCentered.tsx`: `min-h-[700px]` yerine `min-h-[calc(100vh-7rem)]`
- `HeroOverlay.tsx`: `min-h-[600px]` — bu zaten kısa, sorun yok
- `HeroPortfolio.tsx`: `min-h-screen` yerine `min-h-[calc(100vh-7rem)]`
- `HeroMedical.tsx`: Bu zaten `py-20 md:py-28` padding ile çalışıyor, min-h-screen yok — sorun yok
- `HeroCafe.tsx`: Kontrol edilecek
- `HeroHotel.tsx`: Kontrol edilecek
- `HeroDental.tsx`: Kontrol edilecek
- `HeroSplit.tsx`: Kontrol edilecek

### 4. SiteEditor.tsx — projectName'i canvas'a aktar

`EditorCanvas` çağrısına `projectName` prop'u eklenir.

---

## Teknik Detaylar

| Dosya | Degisiklik |
|---|---|
| `src/components/editor/EditorCanvas.tsx` | `projectName` prop ekle, auto-inject header'a `siteName` geçir |
| `src/components/editor/SiteEditor.tsx` | `projectName`'i EditorCanvas'a aktar |
| `src/components/sections/HeroRestaurant.tsx` | `min-h-screen` -> `min-h-[calc(100vh-7rem)]` |
| `src/components/sections/HeroCentered.tsx` | `min-h-[700px]` -> `min-h-[calc(100vh-7rem)]` |
| `src/components/sections/HeroPortfolio.tsx` | `min-h-screen` -> `min-h-[calc(100vh-7rem)]` |
| `src/components/sections/HeroCafe.tsx` | Gerekirse ayni duzeltme |
| `src/components/sections/HeroHotel.tsx` | Gerekirse ayni duzeltme |
| `src/components/sections/HeroDental.tsx` | Gerekirse ayni duzeltme |
| `src/components/sections/HeroSplit.tsx` | Gerekirse ayni duzeltme |

---

## Beklenen Sonuc

- Editorde site header'da gercek proje adi gorunur ("Site" yerine "Kafe Ali" gibi)
- Hero bolumu ekranin tamami kadar yukseklik kaplar ama toolbar ve header ile cakismaz
- Ust kisimda bozuk yerlesim sorunu ortadan kalkar

