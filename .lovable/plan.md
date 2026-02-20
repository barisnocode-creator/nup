
## Eklenebilir Bölümler — Accordion/Collapsible Tasarım

### Sorun
Şu an "Sayfanıza Eklenebilir Bölümler" başlığı altında 8+ toggle düz liste halinde sıralı duruyor. Panel gereksiz yere uzuyor, şık görünmüyor.

### Çözüm

"Eklenebilir Bölümler" bölümünü tıklanabilir bir **accordion header** haline getirip, içeriği varsayılan olarak kapalı bırakıyoruz. Tıklayınca toggle listesi animasyonlu açılıp kapanıyor. Template Değiştir butonu gibi aynı satırda yer alan compact bir UI tasarımı.

**Görünüm (kapalı hali):**
```text
┌─────────────────────────────────────────────┐
│  ☰ Eklenebilir Bölümler        [3 aktif] ▼  │
└─────────────────────────────────────────────┘
```

**Görünüm (açık hali):**
```text
┌─────────────────────────────────────────────┐
│  ☰ Eklenebilir Bölümler        [3 aktif] ▲  │
├─────────────────────────────────────────────┤
│  Randevu / Rezervasyon         [ Toggle ]   │
│  Sık Sorulan Sorular           [ Toggle ]   │
│  Mesaj Bırak                   [ Toggle ]   │
│  Çalışma Saatleri              [ Toggle ]   │
│  📞 Sizi Arayalım              [ Toggle ]   │
│  ⭐ Sosyal Kanıt               [ Toggle ]   │
│  👥 Ekibimiz                   [ Toggle ]   │
│  🎉 Kampanya & Duyuru          [ Toggle ]   │
│  ─────── Sektörünüze Özel ──────           │
│  Online Konsültasyon           [ Toggle ]   │
└─────────────────────────────────────────────┘
```

### Detaylar

- **Accordion header**: Tek bir buton satırı — ikon, "Eklenebilir Bölümler" etiketi, aktif sayısı badge'i (örn. `3 aktif`), ok ikonu (`ChevronDown`/`ChevronUp`)
- **Animasyon**: `framer-motion`'ın `AnimatePresence` + `motion.div` ile yukarıdan aşağı smooth açılma (`overflow: hidden`, `height: auto`)
- **Aktif sayısı**: Kaç bölüm açık olduğunu gösteren küçük badge — kullanıcı paneli kapattığında bile kaç şey aktif olduğunu görür
- **Sektöre özel bölümler**: Varsa içeride separator ile ayrı bir grup olarak gösterilir (mevcut mantık korunur)
- **Varsayılan durum**: Kapalı — panel açıldığında listeyi görmeden önce template/tema ayarlarına odaklanılır
- **useState**: `isOpen` state'i ile kontrol edilir — dışarıdan prop gerekmez

### Değişecek Dosya

| Dosya | İşlem |
|---|---|
| `src/components/editor/CustomizePanel.tsx` | **Güncelleme** — Addable Sections bölümü accordion'a dönüştürülür |

### Teknik Uygulama

`CustomizePanel.tsx` içinde:

1. `useState<boolean>(false)` → `isSectionsOpen`
2. `activeCount` hesapla: `Object.values(addableSections).filter(Boolean).length`
3. Header buton: `LayoutList` ikonu + "Eklenebilir Bölümler" + aktif sayısı badge + `ChevronDown` (rotate 180° açıkken)
4. `AnimatePresence` + `motion.div` ile toggle listesi animasyonlu aç/kapat:

```text
initial: { height: 0, opacity: 0 }
animate: { height: 'auto', opacity: 1 }
exit:    { height: 0, opacity: 0 }
transition: duration 0.2s ease
```

5. İçeride evrensel + sektör toggleları aynı şekilde listelenir

### Korunanlar

- Toggle mantığı, `onToggleAddableSection` callback'i değişmez
- Mevcut `AddableToggleRow` bileşeni aynı kalır
- Diğer panel bölümleri (Şablon, Hızlı Tema, Renkler, Fontlar, Köşeler) değişmez
- Sadece `CustomizePanel.tsx` değişir
