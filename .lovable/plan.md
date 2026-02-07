
# Chai Blokları Donusumu ve Editor Icerik Olusturma Duzeltmesi

## Sorun
Proje ("Hovicare") zengin bir icerige sahip (`generated_content` icinde hero, services, contact vb. var), ancak `chai_blocks` dizisi bos `[]`. Bu durum, ChaiBuilder editoru acildiginda tamamen bos bir sayfa gormesine neden oluyor.

### Sorunun Kok Nedeni
`Project.tsx` icerisindeki akis soyle calisiyor:
1. Proje veritabanindan yukleniyor
2. `chai_blocks` bos oldugu icin `convertAndSaveChaiBlocks()` tetikleniyor (satir 153-157)
3. ANCAK ayni anda ChaiBuilderWrapper da bos bloklar ile render ediliyor (satir 1053-1058)
4. Donusum tamamlandiktan sonra state guncellense bile, ChaiBuilderEditor bilesenini yalnizca ilk mount'ta `blocks` prop'unu kullaniyor - sonraki prop degisikliklerini yoksayiyor
5. Sonuc: Kullanici bos bir editor goruyor

## Cozum

### 1. Donusum tamamlanana kadar editoru gosterme
**Dosya:** `src/pages/Project.tsx`

- Yeni bir `isConvertingBlocks` state'i eklenecek
- `convertAndSaveChaiBlocks` fonksiyonu baslamadan once `isConvertingBlocks = true` yapilacak, tamamlaninca `false` yapilacak
- ChaiBuilderWrapper, yalnizca donusum tamamlandiginda VE bloklar dolu oldugunda render edilecek
- Donusum sirasinda kullaniciya "Icerik hazirlaniyor..." mesaji gosterilecek

### 2. Donusum basarisiz olursa yeniden tetikleme
- `convertAndSaveChaiBlocks` fonksiyonundaki catch blogu iyilestirilecek
- Hata durumunda kullaniciya toast mesaji gosterilecek ve "Tekrar Dene" secenegi sunulacak

### 3. Blok kontrolu guclendirilecek
- ChaiBuilder render kosulu: `project.chai_blocks && project.chai_blocks.length > 0 && !isConvertingBlocks`
- Eger bloklar bos ise ve donusum devam etmiyorsa, donusum otomatik tekrar tetiklenecek

## Teknik Detaylar

### State Degisikligi
```typescript
const [isConvertingBlocks, setIsConvertingBlocks] = useState(false);
```

### convertAndSaveChaiBlocks Guncellemesi
Fonksiyonun basina `setIsConvertingBlocks(true)`, finally bloguna `setIsConvertingBlocks(false)` eklenir.

### ChaiBuilder Render Kosulu (satir 1043)
Mevcut:
```typescript
if (USE_CHAI_BUILDER && isAuthenticated && project) {
```

Yeni:
```typescript
if (USE_CHAI_BUILDER && isAuthenticated && project && !isConvertingBlocks && project.chai_blocks && project.chai_blocks.length > 0) {
```

### Donusum Bekleme Ekrani
Eger `isConvertingBlocks` true ise veya bloklar bos ise, "Icerik hazirlaniyor..." yukleme ekrani gosterilecek. Bu ekranda:
- Yukleme animasyonu
- "Icerik editore aktariliyor..." metni
- Eger 10 saniyeden uzun surerse "Tekrar Dene" butonu

### fetchProject Icerisindeki Mantik Guncellemesi (satir 148-157)
Donusum fonksiyonu await ile cagrilacak, boylece state guncellemesi tamamlandiktan sonra editor acilacak:
```typescript
// If project has generated_content but empty chai_blocks, convert
if (projectData.generated_content && 
    (!projectData.chai_blocks || (Array.isArray(projectData.chai_blocks) && projectData.chai_blocks.length === 0))) {
  await convertAndSaveChaiBlocks(projectData);
}
```

### Degistirilecek Dosyalar
1. `src/pages/Project.tsx` - state ekleme, render kosulu guncelleme, donusum akisi duzeltme
