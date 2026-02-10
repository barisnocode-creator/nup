

# Durable Tarzi Sag Panel - Kayan Edit Karti

## Sorun

Mevcut floating kart MutationObserver ile blok secimini algilmaya calisiyor ama SDK, canvas'i iframe icinde render ettigi icin observer dogru calismiyor. Ayrica SDK'nin kendi sag sidebar'i hala gorunuyor.

## Cozum

SDK'nin `ChaiBlockPropsEditor` ve `ChaiBlockStyleEditor` bilesenlerini kullanarak, sag taraftan kayan sabit bir panel olusturacagiz. Goruntulen referans gorseldeki Durable paneline benzer bir tasarim:

- Ust kisimda "Image" / "Text" / "Section" gibi kontekst basligi
- Gorsel secildiginde: gorsel onizleme + Regenerate/Change butonlari + alt text + pozisyon slider'lari
- Metin secildiginde: SDK'nin metin duzenleme alanlari
- Panel sag taraftan slide-in animasyonla acilir, kapatildiginda slide-out

## Degisiklikler

### 1. DesktopEditorLayout.tsx

**Panel yaklasimi degisikligi:**
- Floating kart yerine, sag taraftan kayan sabit genislikte (320px) panel
- Panel her zaman gorunur olacak (showRight: true default), icerik SDK tarafindan otomatik doldurulur
- `ChaiBlockPropsEditor` ve `ChaiBlockStyleEditor` zaten kontekst bazli calisir - secilen blogun tipine gore dogru alanlari gosterir
- Panel basliginda "Ozellikler" / "Stiller" tab'lari
- Kapatma butonu ile gizlenebilir, Settings2 butonu ile tekrar acilir
- Framer Motion ile sag taraftan slide-in/out animasyon

**Layout yapisi:**
```text
+----+-----------------------------------+--------+
| L  |                                   | Panel  |
| e  |         Canvas                    | 320px  |
| f  |                                   |--------|
| t  |                                   | Props  |
|    |                                   | veya   |
| 12 |                                   | Styles |
| px |                                   |        |
+----+-----------------------------------+--------+
```

### 2. chaibuilder.tailwind.css

**SDK sidebar gizleme guclendirilmesi:**
- Mevcut CSS selectoru SDK'nin iç sidebar'ini tamamen gizleyecek sekilde guncellenir
- Floating gradient border kaldirilir, yerine temiz beyaz/koyu panel
- Panel icin uygun golge ve kenarlik stilleri

## Teknik Detaylar

**Dosya degisiklikleri:**
1. `src/components/chai-builder/DesktopEditorLayout.tsx` - Panel layout, MutationObserver kaldirilip sabit panel yapisi, slide animasyon
2. `src/styles/chaibuilder.tailwind.css` - SDK sidebar gizleme, panel stilleri

**Onemli noktalar:**
- `ChaiBlockPropsEditor` zaten kontekst bazli calisir, ek mantik gerekmez
- Gorsel bloklari icin SDK kendi gorsel alanlarini gosterir
- Metin bloklari icin SDK kendi metin alanlarini gosterir
- Panel icerisinde Pixabay butonu olacak (mevcut `PixabayImagePicker`'i acar)
