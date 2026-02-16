
## Header Navigasyon Linklerini Turkce Hukuk Burosuna Uyarlama

### Yapilacak Degisiklik

`src/components/chai-builder/blocks/hero/NaturalHeader.tsx` dosyasindaki sabit (hardcoded) navigasyon linkleri su sekilde degistirilecek:

| Mevcut (Ingilizce) | Yeni (Turkce) | Hedef |
|---------------------|---------------|-------|
| Home | Ana Sayfa | #hero |
| Articles | Hizmetler | #articles |
| Wellness | Hakkimizda | #about |
| Travel | Iletisim | #contact |
| About | (kaldirilacak) | — |

5 linkten 4'e dusurulecek cunku hukuk burosu icin 4 sayfa yeterli.

### Degisiklik Detayi

Tek dosya guncellenmesi gerekiyor: `src/components/chai-builder/blocks/hero/NaturalHeader.tsx`

Iki yerde degisiklik:
1. **Desktop nav** (satir 43-49): 5 link yerine 4 Turkce link
2. **Mobil menu** (satir 72-77): Ayni 4 Turkce link

```text
Desktop nav:
  Ana Sayfa  -> #hero
  Hizmetler  -> #articles
  Hakkimizda -> #about
  Iletisim   -> #contact

Mobil menu:
  (ayni 4 link)
```

Diger dosyalara dokunulmayacak.
