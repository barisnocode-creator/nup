

# Ust Toolbar Yeniden Tasarimi - Modern & Sik

## Ozet
Editordeki ust toolbar'i hem masaustu hem mobil/tablet icin modern, sik ve daha duzgunlu bir tasarima kavusturacagiz. Ayni butonlar (Dashboard, Ozellesir, Sayfalar, Ekle, Ekran Boyutu, Panel Toggle, Yayinla) korunacak ama gorsel olarak iyilestirilecek.

## Masaustu Toolbar Tasarimi

Mevcut duz buton sirasini, gruplanmis ve gorsel olarak ayrilmis bir yapiya donusturuyoruz:

- **Sol grup**: Dashboard ikonu + ayirici + araclari iceren pill seklinde bir segmented kontrol (Ozellesir, Sayfalar, Ekle) -- muted arka plan uzerinde, aktif butona kayan animasyonlu pill efekti (framer-motion layoutId)
- **Orta**: Bos (esneklik icin)
- **Sag grup**: Ekran boyutu dongu butonu + Panel toggle + ayirici + Yayinla butonu (gradient efektli)

### Gorsel Iyilestirmeler
- Toolbar yuksekligi 56px, ince alt border + subtle shadow
- Sol arac grubu: `bg-muted/50` ile yuvarlatilmis kapsayici, aktif butonda `bg-background` pill animasyonu (framer-motion)
- Yayinla butonu: hafif gradient ve shadow ile daha belirgin
- Tum butonlarda `active:scale-95` ve `transition-all duration-200`
- Hover'da hafif ikon renk degisimi

## Mobil/Tablet Toolbar Tasarimi

- Ust toolbar: Geri butonu + sag tarafta ekran boyutu dongusu + Yayinla ikonu
- Alt navigasyon cubugu ayni kalacak (zaten modern)
- Mobil toolbar'dan gereksiz ogeleri (UndoRedo, Onizle, Gorsel Ara) kaldiracagiz -- masaustuyle tutarli

## Teknik Degisiklikler

| Dosya | Degisiklik |
|-------|-----------|
| `DesktopEditorLayout.tsx` | Toolbar'i gruplanmis segmented kontrol yapisiyla yeniden duzenle. Aktif buton icin framer-motion `layoutId` ile kayan pill animasyonu ekle. Yayinla butonuna gradient stil ekle. |
| `MobileEditorLayout.tsx` | Ust toolbar'i sadelestrip masaustuyle tutarli hale getir (UndoRedo kaldir, Onizle kaldir). Ekran boyutu icin tek dongu butonu kullan. |

## Tasarim Detaylari

```text
Masaustu Toolbar:
+-------+---+--------------------------------------+---+------------------+
| [Home]| | | [Ozellesir] [Sayfalar] [Ekle] |   | [Screen][Panel]|[Yayinla]|
|       | | | ^^^^ pill seklinde segmented ^^^^     |   |                 |         |
+-------+---+--------------------------------------+---+-----------------+---------+

Mobil Toolbar:
+--------+                              +---+--------+
| [<Back]|                              |[S]| [Globe]|
+--------+                              +---+--------+
```

