

# Mobil Editor: Sag ve Sol Slide-in Sidebar Sistemi

## Mevcut Durum

Suanki `MobileEditorLayout.tsx`, alt kisimda bir Drawer (cekmece) kullanarak panelleri gosteriyor. Kullanici "Katmanlar", "Ekle", "Ozellikler", "Stiller" butonlarina bastiginda alttan yukariya bir panel aciliyor. Ancak bu yaklasim:
- Masaustu editor deneyiminden cok farkli
- Canvas alani kapatiyor
- Sidebar benzeri bir is akisi sunmuyor

## Yeni Tasarim: Sol ve Sag Sheet (Slide-in Panel) Sistemi

Drawer yerine **Sheet** (yan panel) kullanilacak. Radix Dialog tabanli Sheet bilesenimiz zaten projede mevcut ve `left` / `right` yonlerini destekliyor.

### Panel Yerlesimi

```text
+--------------------------------------------------+
|  <- Geri  |  Undo/Redo  |  Ekran Boyutu          |  <- Ust toolbar
+--------------------------------------------------+
|                                                    |
|                                                    |
|  SOL PANEL        CANVAS           SAG PANEL       |
|  (Katmanlar)    (Tam ekran)      (Ozellikler)      |
|  (Blok Ekle)                     (Stiller)         |
|  Soldan kayar                    Sagdan kayar       |
|                                                    |
|                                                    |
+--------------------------------------------------+
|  [Katmanlar] [Ekle]    [Ozellikler] [Stiller]     |  <- Alt toolbar
+--------------------------------------------------+
```

### Nasil Calisacak

1. **Alt toolbar'daki butonlar**: 4 buton kalacak
   - **Katmanlar** -> Soldan kayarak acilir (blok agaci)
   - **Ekle** -> Soldan kayarak acilir (blok ekleme paneli)
   - **Ozellikler** -> Sagdan kayarak acilir (blok prop editor)
   - **Stiller** -> Sagdan kayarak acilir (blok stil editor)

2. **Panel ozellikleri**:
   - Ekran genisliginin %75'ini kaplar (Sheet varsayilani, mobilde ideal)
   - Yari saydam overlay ile canvas hala gorunur
   - Kapatma butonu (X) panel icerisinde
   - Panel disina tiklandiginda otomatik kapanir
   - Animasyonlu acilma/kapanma (slide-in/slide-out)

3. **Tum ekran boyutlarinda calismasi**:
   - 320px (kucuk telefon): Panel %75 = 240px, yeterli alan
   - 375px (iPhone): Panel %75 = 281px, rahat kullanim
   - 414px (buyuk telefon): Panel %75 = 310px, genis alan
   - 768px (tablet): Panel %75 = 576px, cok rahat
   - 1024px (kucuk laptop): Panel max-w-sm = 384px, ideal
   - 1280px+: Masaustu modu devreye girer, Sheet kullanilmaz

## Teknik Detaylar

### Degistirilecek Dosya: `src/components/chai-builder/MobileEditorLayout.tsx`

Yapilacak degisiklikler:

1. **Import degisikligi**: `Drawer`/`DrawerContent` yerine `Sheet`/`SheetContent` kullanilacak
2. **Panel tipi guncelleme**: Her panele bir `side` ozelligi eklenecek:
   - `outline` -> `side: "left"`
   - `add` -> `side: "left"`
   - `props` -> `side: "right"`
   - `styles` -> `side: "right"`
3. **Sheet kullanimi**: Her panel icin ayri bir Sheet renderlanacak. Aktif panel hangisiyse o acilacak
4. **Overlay ayari**: `noOverlay={false}` ile yari saydam arka plan saglanacak, boylece kullanici panelin disinda canvas'i gorebilir
5. **Panel genisligi**: Mobilde `w-[85vw] max-w-sm` kullanilarak kucuk ekranlarda %85, buyuk ekranlarda max 384px
6. **Icerik scroll**: Panel icerigi scroll edilebilir olacak (`overflow-y-auto`)
7. **SheetTitle eklenmesi**: Accessibility icin her panele baslik eklenecek

### Panel Acilma/Kapanma Mantigi

- Mevcut `activePanel` state'i korunacak
- Bir panel acikken ayni butona basilirsa kapanir
- Farkli bir butona basilirsa onceki kapanir, yenisi acilir
- Panel disina tiklanirsa kapanir
- X butonuna basilirsa kapanir

### Diger Dosyalar

`ChaiBuilderWrapper.tsx` ve `chaibuilder.tailwind.css` dosyalarinda degisiklik gerekmiyor. Mevcut Sheet bilesenimiz (`src/components/ui/sheet.tsx`) tum gereklilikleri karsilamaktadir.
