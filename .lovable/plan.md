
# Durable.co Tarzi Yuzen Icerik Duzenleme Paneli

## Mevcut Durum

Sag taraftaki duzenleme paneli (Ozellikler/Stiller) sabit 320px genislikte, canvas'i daraltarak aciliyor. Kullanici bunu istemiyorOzellestr paneli gibi yuzen (floating), canvas'i daraltmayan, Durable.co tarzinda bir panel istiyor.

## Hedef

Ekran goruntusundeki gibi:
- Blok secildiginde sag tarafta yuzen bir panel acilir
- Panel basliginda blok adi + "Done" butonu bulunur
- Content / Style sekmeleri
- Canvas daralmaz, panel ustune biner
- Ozellestr paneline benzer gorunum ve animasyon

## Teknik Detaylar

### 1. DesktopEditorLayout.tsx - Sag Paneli Yuzene Cevirme

Mevcut docked right panel (`width: 320, border-l`) kaldirilacak. Yerine canvas alaninin sag ust kosesine konumlandirilmis, `absolute/fixed` pozisyonlu, 360px genisliginde yuzen bir panel gelecek.

Degisiklikler:
- Sag panelin `AnimatePresence` blogu tamamen yeniden yazilacak
- Panel artik flex layout'ta yer kaplamak yerine `absolute right-0 top-0` ile canvas ustune binecek
- Acilis animasyonu: sagdan kayarak gelme (x: 20 -> 0, opacity)
- Ust kisimda blok adi (ileride SDK'dan alinabilir, su an "Bolum Duzenle") + "Done" butonu
- Content / Style sekmeleri mevcut gibi kalacak ama gorsel olarak Durable tarzina uyarlanacak
- Panel yuksekligi canvas alaniyla ayni (toolbar haric tam yukseklik)
- `z-40` ile canvas ustunde ama modal altinda

### 2. Panel Gorsel Tasarim

- Genislik: 360px
- Arka plan: `bg-white` (opak, Ozellestr paneli gibi)
- Golge: `shadow-2xl` 
- Kenar: `border-l border-border/50`
- Ust kisim: Blok adi + Done butonu (tek satir)
- Sekmeler: Content / Style (ikon + yazi)
- Koseler: Sol tarafta `rounded-l-xl` (istege bagli)

### 3. Toolbar'daki Panel Toggle Butonu

Mevcut `PanelRightClose` butonu kalacak ama artik yuzen paneli acip kapatacak. Davranis ayni.

### 4. MobileEditorLayout.tsx

Mobil tarafta zaten Sheet (alt/yan acilan) kullaniliyor, orada degisiklik yok.

### 5. Dosya Degisiklikleri

Sadece 1 dosya degisecek:
- `src/components/chai-builder/DesktopEditorLayout.tsx`: Sag panelin render blogu floating overlay'e donusturulecek. Panel header'i Durable tarzina uyarlanacak (blok adi + Done). Sekmeler yeniden stillendirilecek.

### 6. Onemli Notlar

- `ChaiBlockPropsEditor` ve `ChaiBlockStyleEditor` SDK bilesenlerdir, icerikleri degismez. Sadece sarilma sekli ve sunum tarzi degisir.
- Panel iceriginin canvas ile etkilesimini engellemez (pointer-events panelde, canvas'ta ayri)
- Escape veya Done ile kapanir
- Disari tiklamada kapanmaz (kullanici calisirken kazara kapanmasin)
