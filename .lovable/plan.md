

# Mimari İyileştirme Planı — Durum

## ✅ Tamamlanan: Adım 1 — Dönüşüm Katmanı Kaldırıldı

- `convertToChaiBlocks.ts` silindi
- `templateToBlocks.ts` silindi  
- Tema fonksiyonları `themeUtils.ts`'ye taşındı
- Görsel yama fonksiyonları `imagePatching.ts`'ye taşındı
- `Project.tsx` ve `ChaiBuilderWrapper.tsx` güncellendi

## Sırada: Adım 2 — Şablon-Özel Blok Yapısı

Kullanıcının vereceği template analiz edilecek ve:
1. Her section için özel React bileşeni yazılacak
2. `registerChaiBlock()` ile editöre kaydedilecek
3. `deploy-to-netlify` için eşleşen HTML renderer eklenecek

## Korunan Yapılar
- ChaiBuilder SDK (editor, inline editing, drag-drop)
- `chai_blocks` ve `chai_theme` DB sütunları
- Tema preset sistemi
- Mevcut 13 jenerik blok tipi (fallback olarak)
- `catalog/definitions.ts` (şablon metadata'sı)
