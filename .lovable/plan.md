

# Metin ve Gorsel Icin Alan Bazli Duzenleme ve Yeniden Olusturma

## Mevcut Durum ve Kisitlamalar

Sag taraftaki yuzen panelde su anda ChaiBuilder SDK'nin `ChaiBlockPropsEditor` ve `ChaiBlockStyleEditor` bilesenlerini kullaniyoruz. Bu bilesenler SDK icerisinde render edildigi icin, iceriklerini (alan basina "Yeniden Olustur" butonu, surukleme, carousel listesi vb.) dogrudan degistiremiyoruz.

Bu nedenle plan iki asamali:
1. **Asama 1** (bu plan): SDK editorlerinin uzerine/yanina eklenebilecek yardimci araclar -- panel header'inda "Yeniden Olustur" butonu ve gorsel degistirme entegrasyonu
2. **Asama 2** (gelecek): SDK editorlerini tamamen ozellesmis alanlarla degistirme (blok tipine gore dinamik form)

---

## Asama 1 - Uygulanacak Degisiklikler

### 1. Sag Panel Header'ina "Yeniden Olustur" Butonu Eklenmesi

Mevcut "Bolum Duzenle" header'inin yanina bir "Yeniden Olustur" (Sparkles ikonu) butonu eklenecek. Bu buton tiklandiginda:
- Secili bolumun tum metin alanlarini (baslik, alt baslik, aciklama) yeniden olusturur
- `regenerate-content` edge function'ini kullanir
- Yukleme durumunda spinner gosterir
- Basarili oldugunda toast bildirimi gosterir

**Dosya:** `src/components/chai-builder/DesktopEditorLayout.tsx`

Header kismina ekleme:
```
<div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
  <span className="text-sm font-semibold">Bolum Duzenle</span>
  <div className="flex items-center gap-1">
    <button title="Icerik Yeniden Olustur">
      <Sparkles className="w-3.5 h-3.5" />
    </button>
    <button onClick={handleToggleRight}>Tamam</button>
  </div>
</div>
```

### 2. `regenerate-content` Edge Function'inin Coklu Varyant Destegi

Mevcut edge function tek bir metin donduruyor. Bunu 3 varyant (kisa, orta, uzun) dondurecek sekilde guncelleyecegiz.

**Dosya:** `supabase/functions/regenerate-content/index.ts`

Degisiklikler:
- `variants: number` parametresi eklenir (varsayilan 3)
- AI prompt'u 3 farkli uzunlukta alternatif uretecek sekilde guncellenir
- Yanit formati: `{ success: true, variants: [{ text: string, length: 'short' | 'medium' | 'long' }] }`

### 3. Yeniden Olusturma Popover Bileseni

Yeni bir bilesen olusturulacak: `RegeneratePopover`. Bu bilesen:
- Sag paneldeki "Yeniden Olustur" butonuna tiklandiginda acilir
- 3 metin varyantini kart seklinde gosterir
- Her varyant uzerine gelindiginde canvas'ta canli onizleme yapar
- Tiklandiginda secilen varyanti uygular
- "Tekrar Olustur" butonu ile yeni varyantlar uretir
- "Geri Al" destegi (onceki deger saklanir)
- Yukleme durumunda skeleton gosterir

**Yeni dosya:** `src/components/chai-builder/RegeneratePopover.tsx`

Gorsel yapi:
```
+---------------------------+
| Alternatif Icerikleri   X |
|---------------------------|
| [Skeleton / Yukleniyor]   |
|                           |
| Kisa:                     |
| "Yeni baslik metni..."  > |
|                           |
| Orta:                     |
| "Biraz daha uzun..."    > |
|                           |
| Uzun:                     |
| "En detayli versiyon..." >|
|                           |
| [Tekrar Olustur]          |
+---------------------------+
```

### 4. Gorsel Arama Entegrasyonu (Mevcut Altyapinin Kullanimi)

Sag paneldeki "Icerik" sekmesinde gorsel alanlari icin mevcut `InlineImageSwitcher` ve `PixabayImagePicker` entegrasyonlari zaten calisiyor. Bu asamada ek bir degisiklik gerekmez -- gorsel degistirme islemi canvas uzerindeki hover overlay'den yapilmaya devam eder.

---

## Teknik Detaylar

### Dosya Degisiklikleri Ozeti

| Dosya | Islem | Aciklama |
|-------|-------|----------|
| `src/components/chai-builder/DesktopEditorLayout.tsx` | Guncelle | Header'a Sparkles butonu + popover tetikleme |
| `src/components/chai-builder/RegeneratePopover.tsx` | Yeni | 3 varyantli yeniden olusturma popover'i |
| `supabase/functions/regenerate-content/index.ts` | Guncelle | Coklu varyant destegi |

### RegeneratePopover Bileseni

- Genislik: 300px
- Pozisyon: Butonun altinda, sag tarafa hizali
- Animasyon: fade-in + scale (150ms)
- Disari tikla ile kapanir
- Escape ile kapanir
- Her varyant karti: border, hover efekti, "Uygula" butonu
- Yukleme: 3 adet skeleton satiri
- API cagrisini `supabase.functions.invoke('regenerate-content', ...)` ile yapar

### Edge Function Guncellemesi

Prompt degisikligi:
```
Generate 3 alternative versions of this ${fieldInfo.type}:
1. SHORT version (max 5 words)
2. MEDIUM version (similar length to current)  
3. LONG version (slightly longer, more descriptive)

Return as JSON array: ["short text", "medium text", "long text"]
```

Yanit parse'lama: AI ciktisini JSON array olarak parse eder, basarisiz olursa tek metin olarak fallback yapar.

### Animasyon ve UX Detaylari

- Popover acilis: `opacity 0->1, scale 0.95->1, duration 150ms`
- Varyant secimi: secilen kart `border-primary` ile vurgulanir
- "Uygula" sonrasi: popover kapanir, toast "Icerik guncellendi" gosterilir
- "Geri Al" toast'ta saglanir (onceki deger kaydedilir)
- Yukleme: Skeleton animasyonu, 3 satir

