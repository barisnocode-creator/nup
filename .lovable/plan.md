

## ChangeTemplateModal — Tam Ekran ve Gorsel Iyilestirme

### Sorunlar

1. Modal tam ekrani kaplamamasi (90vw/85vh)
2. Renk paleti belirsiz — beyaz/gri/turuncu sistem renklerine uyum yok
3. Template preview gorselleri bos (`preview: ''`) — tum kartlar ayni cafe gorseli gosteriyor
4. Template isimleri sadece hover'da gorunuyor, surekli gorunur olmali

### Degisiklikler

| Dosya | Islem |
|-------|-------|
| `src/components/website-preview/ChangeTemplateModal.tsx` | Modal tam ekran, renk duzeni, kart tasarimi guncelleme |
| `src/templates/catalog/definitions.ts` | Her template icin uzun onizleme gorseli URL ekleme |

### 1. Modal Tam Ekran

Modal boyutlari `w-[90vw] max-w-[1200px] h-[85vh]` yerine `w-screen h-screen max-w-none` olacak. Arka plan beyaz (`bg-white`), header ve alt bar acik gri tonlarinda.

### 2. Renk Paleti

- Arka plan: `bg-white` (saf beyaz)
- Header/footer: `bg-gray-50` veya `bg-stone-50`
- Kart kenarlari: `border-gray-200` (varsayilan), `border-orange-500` (secili)
- "Mevcut sablon" badge: `bg-orange-500 text-white`
- "Sablonu Uygula" butonu: `bg-orange-500 hover:bg-orange-600 text-white`
- "Karistir" butonu: `border-orange-300 text-orange-600`
- Baslik: `text-gray-900`
- Alt yazi: `text-gray-500`

### 3. Template Onizleme Gorselleri

Her template tanimina (`definitions.ts`) uzun format (tall) web sitesi ekran goruntusu URL'si eklenecek. Unsplash'ten sektore uygun yuksek kaliteli gorseller secilecek:

- `specialty-cafe`: Cafe ic mekan/menu uzun gorsel
- `dental-clinic`: Klinik/saglik uzun gorsel
- `restaurant-elegant`: Restoran atmosferi uzun gorsel
- `hotel-luxury`: Otel lobi/oda uzun gorsel
- `engineer-portfolio`: Teknoloji/workspace uzun gorsel

Gorseller `w=400&h=800&fit=crop` formatinda, dikey (portrait) olacak.

### 4. Template Ismi Kartlarin Uzerinde (Surekli Gorunur)

Mevcut tasarimda isim sadece hover'da gorunuyor. Yeni tasarimda:

- Kartin alt kisiminda sabit bir gradient overlay (her zaman gorunur)
- Template adi beyaz yazi olarak her zaman gorunur
- Kategori etiketi (orn. "Yeme & Icme", "Saglik") kucuk bir badge olarak ismin ustunde
- Hover'da sadece "Onizle" butonu ek olarak belirir

Kart yapisi:
```text
┌──────────────────┐
│ [Mevcut sablon]  │  ← sadece aktif template'te
│                  │
│   (gorsel)       │
│                  │
│                  │
│ ─ gradient ───── │
│ Yeme & Icme      │  ← kategori (her zaman gorunur)
│ Specialty Cafe   │  ← isim (her zaman gorunur)
│ [Onizle]         │  ← sadece hover'da
└──────────────────┘
```

### 5. Kart Boyutlari (Degisiklik Yok)

Mevcut `w-[340px] h-[560px]` boyutlari korunur — tam ekran modal'da ~4 kart gorunur, son kart kesilir.

### Uygulama Sirasi

1. `definitions.ts` — 5 template'e `preview` URL'leri ekle
2. `ChangeTemplateModal.tsx` — tam ekran modal, beyaz/gri/turuncu renk semas, template isimlerini surekli goster

