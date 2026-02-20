
## "Sizi Arayalım" Bölümü + Yeni Addable Section'lar

### Ne Yapılacak

Kullanıcı iki şey istiyor:
1. **"Sizi Arayalım" (Click-to-Call CTA) section'ı** — tüm templatelere uygun, GitHub'da beğenilen modern tasarım diliyle
2. **Özelleştir paneline yeni toggle'lar** — "Sizi Arayalım" dahil birkaç yeni addable section seçeneği eklenecek

---

### Yeni "Sizi Arayalım" Section Tasarımı

GitHub'da en çok beğenilen "call us" CTA pattern'i şu elemanlara sahiptir:

```text
┌──────────────────────────────────────────────────────────────────┐
│ [Telefon ikonu]                                                  │
│  Uzman Ekibimizle Konuşun                                        │
│  Sorularınızı yanıtlamak için buradayız.                         │
│                                                                  │
│  [📞 Bizi Arayın: +90 (212) 000 00 00 ]   [WhatsApp ile Yazın]  │
│                                                                  │
│  ⏰ Pazartesi–Cuma  09:00–18:00                                  │
│     Cumartesi       10:00–15:00                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Tasarım Özellikleri:**
- Temaya uyum: `bg-primary` arka plan (koyu) + `text-primary-foreground` yazı VEYA beyaz kart üzerine — bu CSS variable'lar tüm templatelerde otomatik güncellenir
- İki versiyon içinde: tam renkli (primary bg) + kart versiyonu — `style` prop ile değiştirilebilir
- Büyük tıklanabilir telefon butonu — `href="tel:+90..."` ile gerçek arama
- WhatsApp butonu — `href="https://wa.me/..."` ile
- Çalışma saatleri özeti — compact 2 satır (WorkingHoursMapSection'dan farklı, bu sadece bilgi banner'ı)
- Animasyonlu telefon ikonu (zil efekti) — `framer-motion` ile hafif sallanma
- Güven işaretleri: "7/24 Acil Hat", "Ücretsiz İlk Görüşme" gibi badge'ler

---

### Yeni Eklenen Tüm Section'lar

Mevcut 11 addable section'a ek olarak 4 yeni section:

| Key | Label | Sektör | Bileşen |
|---|---|---|---|
| `callUs` | Sizi Arayalım / İletişim CTA | Tümü (universal) | `CallUsSection.tsx` |
| `socialProof` | Müşteri Memnuniyeti Rozeti | Tümü (universal) | `SocialProofSection.tsx` |
| `teamGrid` | Ekibimiz | Tümü (universal) | `TeamGridSection.tsx` |
| `promotionBanner` | Kampanya & Duyuru | Tümü (universal) | `PromotionBannerSection.tsx` |

---

### Değişecek Dosyalar

| Dosya | İşlem |
|---|---|
| `src/components/sections/addable/CallUsSection.tsx` | **Yeni** — Ana "Sizi Arayalım" bileşeni |
| `src/components/sections/addable/SocialProofSection.tsx` | **Yeni** — Google/Tripadvisor tarzı rating/badge bölümü |
| `src/components/sections/addable/TeamGridSection.tsx` | **Yeni** — Ekip üyesi kartları |
| `src/components/sections/addable/PromotionBannerSection.tsx` | **Yeni** — Kampanya/duyuru banner'ı |
| `src/components/sections/registry.ts` | **Güncelleme** — 4 yeni tip registry'e eklenir |
| `src/components/editor/useEditorState.ts` | **Güncelleme** — `addableSectionConfig`'e 4 yeni anahtar |
| `src/components/editor/CustomizePanel.tsx` | **Güncelleme** — `universalToggles` listesine 4 yeni toggle |

---

### Teknik Detaylar

#### 1. CallUsSection.tsx

```text
Props:
- title: string        → "Uzman Ekibimizle Konuşun"
- subtitle: string     → "Sorularınızı yanıtlamak için buradayız"
- phone: string        → "+90 (212) 000 00 00"
- whatsapp: string     → "905320000000"
- workingHoursText: string → "Pzt–Cuma 09:00–18:00"
- ctaText: string      → "Bizi Arayın"
- variant: 'filled' | 'outline'
```

Tasarım: `bg-primary` arka plan üzerinde `text-primary-foreground` renk sistemi. Telefon ikonu `framer-motion` ile 0.5s aralıklarla hafif zil hareketi (rotate -10°/+10°). Tam genişlik, container max-w-4xl, flex row (büyük ekranda) / flex col (mobil).

#### 2. SocialProofSection.tsx

Google Reviews, Tripadvisor, Trustpilot stilinden ilham alan "sosyal kanıt" bölümü. Toplam puan, yıldız sayısı ve platform logosu (emoji ile). GitHub'da landing page UI kütüphanelerinde (page-ui, launch-ui) en popüler section tiplerinden.

```text
Props:
- rating: number       → 4.9
- reviewCount: number  → 350
- platforms: array     → [{ name: 'Google', stars: 4.9, count: 120 }]
- title: string        → "Müşterilerimiz Bizi Seviyor"
```

#### 3. TeamGridSection.tsx

3'lü grid, kart + fotoğraf + isim + unvan + sosyal medya linkleri. Tüm sektörlere uyumlu (doktor/ekip, avukat/ortaklar, restoran/şefler).

```text
Props:
- title: string
- members: [{ name, role, image, bio }]
```

#### 4. PromotionBannerSection.tsx

Renkli, dikkat çekici duyuru bandı. Kalan süre sayacı (opsiyonel), emoji desteği, CTA butonu.

```text
Props:
- emoji: string        → "🎉"
- title: string        → "Yeni Yıl Kampanyası"
- description: string
- buttonText: string
- buttonLink: string
- expiresAt: string    → (opsiyonel, tarih gösterimi)
```

---

### CustomizePanel Yeni Görünüm

"Sayfanıza Eklenebilir Bölümler" kısmı şöyle görünecek:

```text
SAYFANIZA EKLENEBİLİR BÖLÜMLER

[Universal]
□ Randevu / Rezervasyon Formu
□ Sık Sorulan Sorular (FAQ)
□ Mesaj Bırak / İletişim Formu  
□ Çalışma Saatleri & Harita
□ Sizi Arayalım ← YENİ
□ Sosyal Kanıt / Memnuniyet ← YENİ
□ Ekibimiz ← YENİ
□ Kampanya & Duyuru ← YENİ

[Sektörünüze Özel]
□ Online Konsültasyon  (doktor/diş)
□ Anlaşmalı Sigortalar (doktor/diş)
□ Menü Öne Çıkanlar   (restoran/cafe)
... vb
```

Sektör özel bölümler bir separator ile ayrılacak (zaten mevcut).

---

### Uygulama Sırası

1. `CallUsSection.tsx` oluştur (en önemli, kullanıcı bunu özellikle istedi)
2. `SocialProofSection.tsx` oluştur
3. `TeamGridSection.tsx` oluştur
4. `PromotionBannerSection.tsx` oluştur
5. `registry.ts` güncelle — 4 yeni tip ekle
6. `useEditorState.ts` güncelle — `addableSectionConfig`'e ekle
7. `CustomizePanel.tsx` güncelle — `universalToggles`'a ekle

### Korunanlar

- Mevcut 11 addable section değişmez
- `addableSectionConfig` yapısı aynı kalır, sadece genişler
- `toggleAddableSection` mantığı değişmez
- Tüm yeni section'lar `section.props` üzerinden CSS variable kullanır (`var(--primary)`, `var(--background)` vb.) — her template ile otomatik uyum
