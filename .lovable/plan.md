
# Ozelestir Paneli Duzeltmeleri

## Sorunlar

1. "Sablon Degistir" yaziyor, kullanici "Template Degistir" istiyor
2. Panel seffaf/yari saydam gorunuyor -- arka plandaki icerik gorunuyor

## Dosya Degisiklikleri

### 1. MODIFY: `src/components/chai-builder/CustomizePanel.tsx`

- Satir 60: `'Sablon Degistir'` --> `'Template Degistir'` olarak degistirilecek

### 2. MODIFY: `src/components/chai-builder/DesktopEditorLayout.tsx`

- Satir 94: Popover container'inin sinifindaki `bg-popover` yerine `bg-background` kullanilacak
- Ayrica `backdrop-blur` eklenecek ve seffafligi onlemek icin tam opak (opacity yok) yapilacak

Mevcut:
```
bg-popover border border-border/50 rounded-xl shadow-2xl
```

Yeni:
```
bg-background border border-border/50 rounded-xl shadow-2xl backdrop-blur-xl
```

| Dosya | Degisiklik |
|-------|-----------|
| `CustomizePanel.tsx` | "Sablon Degistir" --> "Template Degistir" |
| `DesktopEditorLayout.tsx` | Popover arka plan rengini opak `bg-background` yapma |
