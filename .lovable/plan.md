

# Mobil Editor Duzeltmesi - Yayinla Butonu ve Responsive Iyilestirme

## Sorunlar

1. **Mobil editor'de Yayinla (Publish) ve Onizle (Preview) butonlari yok** - `MobileEditorLayout` bileseninde sadece Katmanlar, Ekle, Ozellikler, Stiller butonlari var; Publish/Preview eksik
2. **Mobil editor toolbar'inda masaustu editor'deki ozellikler eksik** - Ozellistir, Sayfalar gibi butonlar yok
3. **Ekran boyutu gostergesi Lovable tarzinda olmali** - Sadece ikon (telefon/tablet/PC), altinda yazi olmamali

## Cozum Plani

### 1. MobileEditorLayout.tsx - Ust Toolbar'a Yayinla/Onizle Eklenmesi

Mevcut ust toolbar'da sadece geri butonu, undo/redo ve gorsel arama var. Buraya su eklemeler yapilacak:

- Sag tarafa **Onizle** (Eye ikonu) ve **Yayinla** (Globe ikonu, primary renk) butonlari eklenecek
- `useEditorContext()` hook'u kullanilarak `onPublish` ve `onPreview` fonksiyonlari alinacak
- Butonlar kompakt olacak: sadece ikon, yazi yok (mobil icin ideal)
- Yayinla butonu `bg-primary text-primary-foreground` ile one cikacak

### 2. MobileEditorLayout.tsx - Alt Navigation Bar Iyilestirmesi

Mevcut 4 buton (Katmanlar, Ekle, Ozellikler, Stiller) korunacak. Etiket metinleri (`label`) altinda gosterilmeye devam edecek ama daha kompakt olacak:
- `min-w` ve `min-h` degerleri kuculecek (`min-w-[52px] min-h-[44px]`)
- Ikon boyutu `w-4.5 h-4.5` olarak kucultulecek
- Padding azaltilacak

### 3. ChaiScreenSizes Etiketi Kaldirilmasi

Masaustu layout'undaki (`DesktopEditorLayout`) `ChaiScreenSizes` bileseninde zaten sadece ikon gosteriliyor (`canvas={false}`). Ancak mobil layout'ta da ayni sekilde sadece ikon olarak gorunecek. Alt kisimdaki versiyon yazisi kaldirilacak.

### 4. MobileEditorLayout - Genel Iyilestirmeler

- Ust toolbar yuksekligi sabit `h-12` olarak ayarlanacak
- Alt bar icin `pb-[env(safe-area-inset-bottom)]` eklenerek iPhone alt boslugu desteklenecek
- Canvas alani `touch-action: manipulation` ile dokunmatik kaymalari onlenecek
- Sheet panellerinin genisligi `w-[80vw]` olarak azaltilacak (daha az ekran kaplama)

### 5. DesktopEditorLayout - Ekran Boyutu Gostergesi (Lovable Tarzi)

ChaiScreenSizes zaten sadece ikon gosteriyor. Ek olarak:
- Toolbar ortasindaki proje adi kisminda sadece proje adi gorunecek, altinda versiyon bilgisi olmayacak
- `ChaiScreenSizes` bileseninin `buttonClass` daha kompakt hale getirilecek

## Teknik Degisiklikler

### Dosyalar

| Dosya | Degisiklik |
|-------|-----------|
| `src/components/chai-builder/MobileEditorLayout.tsx` | Publish/Preview butonlari ekleme, toolbar duzenleme, alt bar kompaktlastirma |
| `src/components/chai-builder/DesktopEditorLayout.tsx` | Screen size gostergesi iyilestirme |

### MobileEditorLayout Detay

```text
UST TOOLBAR (h-12):
[<- Geri] [Undo/Redo] .............. [Gorsel] [Ekran Boyutu] [Onizle] [Yayinla]

CANVAS ALANI:
(tam ekran, touch-action: manipulation)

ALT BAR:
[Katmanlar] [Ekle] [Ozellikler] [Stiller]
```

- `useEditorContext` import edilecek ve `onPublish`, `onPreview` kullanilacak
- Yayinla butonu: `bg-primary text-primary-foreground rounded-lg px-3 py-1.5`
- Onizle butonu: `text-muted-foreground hover:bg-accent/80 rounded-lg p-2`
- Alt bar item'lari daha kompakt: padding `px-3 py-1.5`, ikon `w-5 h-5`, label `text-[10px]`

