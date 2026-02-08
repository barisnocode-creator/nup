
# Mobil Sidebar Sorunu ve Yavas Editor Gecisi Cozumu

## Sorun 1: Mobil Gorunumde Sidebar'lar Acilmiyor

ChaiBuilder SDK editoru, **minimum 1280px ekran genisligi** gerektiriyor. Bu, SDK'nin ic yapisindan gelen bir sinirlamadır - 1280px'den kucuk ekranlarda "Screen too small" uyarisi gosteriyor ve sol/sag paneller (sidebar) render edilmiyor.

Mevcut CSS'de bu uyari gizleniyor ama editor hala calismıyor. Yani mobil/tablet cihazlarda editor sidebarlarinin acilmasi mumkun degil.

### Cozum: Mobil Uyari Ekrani

Mobilde editor acildiginda, kullaniciya net bir mesaj gostermek:
- "Bu editor masaustu icin optimize edilmistir"
- "Lutfen 1280px veya daha genis bir ekranda acin"
- Dashboard'a donus butonu sunmak

Bu, kullanicinin bos ekranda takili kalmasini onler ve durumu anlamasini saglar.

## Sorun 2: Editor Cok Yavas Aciliyor / "Tekrar Dene" Gerekiyor

Ana sorun `Project.tsx` dosyasindaki akis hatasindan kaynaklaniyor:

1. `generateWebsite()` fonksiyonu basarili bir sekilde icerik uretiyor ve `generated_content`'i state'e kaydediyor
2. Ancak `convertAndSaveChaiBlocks()` otomatik olarak CAGRILMIYOR
3. Render kodu `chai_blocks`'in bos oldugunu gordugununde "Icerik editore aktariliyor..." ekranini gosteriyor
4. Kullanici "Tekrar Dne" butonuna basarak `convertAndSaveChaiBlocks`'i manuel tetiklemek zorunda kaliyor

Sorunun teknik sebebi: `useEffect`'in bagimliliklari `[id, navigate]` oldugu icin, `generateWebsite` state guncelledikten sonra `useEffect` tekrar calismiyor.

### Cozum: Otomatik Donusturme

`generateWebsite()` fonksiyonu basarili olduğunda, hemen ardindan `convertAndSaveChaiBlocks()` fonksiyonunu cagiracak sekilde guncellenmeli. Bu sayede kullanici hicbir sey yapmadan, icerik uretimi biter bitmez bloklar hazirlanip editor otomatik acilacak.

## Yapilacak Degisiklikler

### 1. Project.tsx - generateWebsite Sonrasi Otomatik Donusturme
**Dosya:** `src/pages/Project.tsx`

`generateWebsite` fonksiyonunda, `data.content` basarili sekilde alinip state'e kaydedildikten sonra, `convertAndSaveChaiBlocks` otomatik olarak cagrilacak. Bu sayede:
- Icerik uretimi tamamlanir
- Bloklar otomatik donusturulur
- Editor hemen acilir
- "Tekrar Dne" butonuna gerek kalmaz

### 2. Project.tsx - Mobil Uyari Ekrani
**Dosya:** `src/pages/Project.tsx`

ChaiBuilder editor render edilmeden once, ekran genisligi 1280px'den kucukse kullaniciya bilgilendirme ekrani gosterilecek:
- Aciklayici mesaj: "Editor masaustu gorunumunde calisir"
- Dashboard'a donus butonu
- Ekran genisligi yeterli olursa otomatik olarak editor acilacak

### 3. ChaiBuilderWrapper - Mobil Kontrol
**Dosya:** `src/components/chai-builder/ChaiBuilderWrapper.tsx`

Wrapper icerisinde de ekran genisligi kontrolu eklenecek, SDK'nin kendi "Screen too small" mesaji yerine ozel Turkce bir bilgilendirme gosterilecek.

## Teknik Detaylar

- `generateWebsite` icinde donusturme: `data.content` basarili alindiginda, `project` state guncellendikten sonra dogrudan `convertAndSaveChaiBlocks` cagrilacak. `projectData` parametresi olarak guncel veri (`{ ...prev, generated_content: data.content }`) kullanilacak.
- Mobil kontrol: `window.innerWidth` ve `matchMedia` ile 1280px siniri kontrol edilecek, `resize` event listener ile dinamik takip saglanacak.
- Mevcut CSS'deki `section.fixed.inset-0[class*="z-[99999]"]` kuralı korunacak (yedek guvenlik).

## Degistirilecek Dosyalar

1. `src/pages/Project.tsx` - `generateWebsite` sonrasi otomatik donusturme + mobil uyari ekrani (ana duzeltme)
2. `src/components/chai-builder/ChaiBuilderWrapper.tsx` - Mobil ekran uyarisi (ek guvenlik katmani)
