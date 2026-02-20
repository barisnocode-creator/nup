
## Yapılacaklar

### 1. Hizmet Kartlarına Görsel Desteği (ServicesGrid + ArrayEditor)

**Sorun:** `SectionEditPanel`'deki `ArrayEditor` içindeki `image` alanı hâlâ küçük input + ikon buton şeklinde gösteriliyor. Kullanıcı, hizmet kartlarına Pixabay'dan görsel eklemek istiyor.

**Çözüm:**

`SectionEditPanel.tsx` → `ArrayEditor` içindeki image/avatar alanları (satır 397-408):
```
Mevcut: [Input URL kutusu] [🖼 buton]
Yeni:   [Büyük tıklanabilir thumbnail kart]  (tıklayınca Pixabay açılır)
```

Yani `isImgField` koşulunda URL input'unu kaldırıp, ana image alanlarında yaptığımız gibi `aspect-video` thumbnail kart sistemi kullanacağız.

**`ServicesGrid.tsx`:** Zaten `service.image` varsa görsel gösteriyor. Düzenleme modunda her kartın üzerine hover edince "Görseli Değiştir" overlay butonu ekleyeceğiz (başlıkla alakalı Pixabay arama için).

**`arrayFieldSchemas`:** `services` schema'sındaki `image` alanının etiketi `'Görsel URL'` → `'Görsel'` olarak güncellenir.

---

### 2. YouTube Video Bölümü (VideoSection)

2. ekranda tamamen boş bir section görünüyor — bu büyük ihtimalle bir addable section veya yeni eklenen boş alan. Kullanıcı buraya YouTube video embed desteği istiyor.

**Yeni dosya: `src/components/sections/addable/VideoSection.tsx`**

```tsx
// YouTube URL → embed URL dönüşümü
// youtube.com/watch?v=XYZ → youtube.com/embed/XYZ
// youtu.be/XYZ → youtube.com/embed/XYZ

function VideoSection({ section, isEditing, onUpdate }) {
  // title, subtitle, videoUrl, description prop'ları
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="max-w-3xl mx-auto">
          {videoUrl ? (
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe src={embedUrl} allowFullScreen ... />
            </div>
          ) : (
            isEditing && <YouTubeLinkInput />
          )}
        </div>
      </div>
    </section>
  );
}
```

Düzenleme modunda video yoksa:
- Merkezi "YouTube Videosu Ekle" alanı: büyük alan, YouTube linki input'u ve "Uygula" butonu

**`src/components/sections/registry.ts`** → `VideoSection` kayıt edilir.

**`SectionEditPanel`:** `videoUrl` alanı → özel bir "YouTube Link" input alanı olarak gösterilir (normal text input yeterli, ama label "YouTube Linki" olarak gösterilir).

---

### Değiştirilecek / Oluşturulacak Dosyalar

| # | Dosya | İşlem |
|---|---|---|
| 1 | `src/components/editor/SectionEditPanel.tsx` | ArrayEditor image alanları → thumbnail kart sistemi |
| 2 | `src/components/sections/ServicesGrid.tsx` | Düzenleme modunda kart görseli hover overlay |
| 3 | `src/components/sections/addable/VideoSection.tsx` | YENİ — YouTube video embed bölümü |
| 4 | `src/components/sections/registry.ts` | VideoSection kaydı |
| 5 | `src/components/editor/SectionEditPanel.tsx` | `videoUrl` için label ve `labelMap` güncellemesi |

---

### ArrayEditor Görsel Kart Tasarımı (Detay)

```
Hizmet 1 [▾]            [🗑]
──────────────────────────────
  BAŞLIK
  [Bireysel Psikolojik Danışmanlık]

  AÇIKLAMA
  [Yetişkinlerin yaşadığı...]

  GÖRSEL                           ← YENİ
  ╭──────────────────────────────╮
  │   [görsel thumbnail]         │  tıkla = Pixabay açılır
  │   hover → Görseli Değiştir   │
  ╰──────────────────────────────╯

  İKON
  [⭐]
```

---

### YouTube Video Embed Mantığı

```typescript
function getYouTubeEmbedUrl(url: string): string | null {
  // https://www.youtube.com/watch?v=dQw4w9WgXcQ → https://www.youtube.com/embed/dQw4w9WgXcQ
  // https://youtu.be/dQw4w9WgXcQ → https://www.youtube.com/embed/dQw4w9WgXcQ
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
```

Düzenleme modunda:
- Video varsa: iframe + hover overlay "Videoyu Değiştir" butonu
- Video yoksa: büyük placeholder alan + "YouTube linki yapıştır" input

---

### Sonuç

- Hizmet kartlarında editörden Pixabay'dan görsel seçilebilir (thumbnail kart UI)
- ServicesGrid bileşeni görseli üzerinde hover ile "Görseli Değiştir" butonu gösterir
- Yeni VideoSection bölümü eklenebilir, YouTube linki yapıştırarak embed yapılır
- Tüm değişiklikler mevcut kayıt ve stil sistemiyle uyumlu
