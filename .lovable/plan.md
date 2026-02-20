
## Sorun: Yayınlanmış Sitede Güncelleme Akışı Yok

Mevcut durum:
- Kullanıcı düzenleme yapar → sağ üstteki "Yayınla" butonuna basar
- `PublishModal` açılır, `isPublished: true` olduğu için direkt "Your website is live!" başarı ekranı gösterilir
- Netlify'daki canlı site **güncellenmez** — yeni değişiklikler yayına gitmez
- Kullanıcı "değişiklikleri yayınla" işlemini yapamıyor

---

## Hedef

Yayınlanmış bir site için toolbar'da ve modal'da **"Güncelle"** akışı:

1. **Toolbar "Yayınla" butonu** → zaten yayınlandıysa **"Güncelle"** yazısı gösterir, farklı renk
2. **PublishModal — zaten yayınlanmış halde** → success ekranı yerine **"Değişiklikleri Yayınla"** butonu gösterilir
3. **Güncelle butonuna basılınca** → `deploy-to-netlify` yeniden çağrılır, canlı site güncellenir
4. **Başarı mesajı** → "Site güncellendi!" toast + modal kapanır

---

## Değiştirilecek Dosyalar (2 adet)

| # | Dosya | Değişiklik |
|---|---|---|
| 1 | `src/components/editor/EditorToolbar.tsx` | `isPublished` prop ekle, buton "Güncelle" / "Yayınla" arasında değişsin |
| 2 | `src/components/website-preview/PublishModal.tsx` | Zaten yayınlı site için "Değişiklik Yayınla" akışı — success ekranı değil update ekranı |

---

## 1. EditorToolbar Değişikliği

`isPublished` prop'u eklenir. Buton buna göre iki farklı görünüm alır:

```tsx
// Yeni prop
isPublished?: boolean;

// Buton: zaten yayınlanmışsa "Güncelle", değilse "Yayınla"
<button onClick={onPublish} className={cn(
  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 shadow-md',
  isPublished
    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
)}>
  {isPublished ? <RefreshCw className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
  {isPublished ? 'Güncelle' : 'Yayınla'}
</button>
```

`SiteEditor.tsx`'de `isPublished` prop'u toolbar'a geçirilir.

---

## 2. PublishModal — Yeni "Güncelle" Ekranı

Şu anki akış: `isPublished: true` → direkt `showSuccess` state'i `true` set ediliyor → başarı ekranı.

**Yeni akış:**

```
isPublished: true
  ↓
Modal açılır → "Güncelle" ekranı gösterilir (başarı ekranı değil)
  ↓
Kullanıcı "Değişiklikleri Yayınla" butonuna basar
  ↓
deploy-to-netlify yeniden çağrılır
  ↓
Toast: "Site güncellendi!" → Modal kapanır
```

**Yeni UI (isPublished: true için):**

```
┌─────────────────────────────────────┐
│         🔄 Değişiklikleri Yayınla   │
│                                     │
│  ✅ Site zaten canlı:               │
│  https://deneme-kafe.netlify.app    │  ← mevcut URL gösterilir
│  [🔗 Siteyi Aç] [📋 Linki Kopyala] │
│                                     │
│  Yaptığınız değişiklikleri canlıya  │
│  almak için güncelle butonuna basın │
│                                     │
│  [🔄 Değişiklikleri Yayınla]       │  ← ana eylem
│  [Kapat]                            │
└─────────────────────────────────────┘
```

Güncelleme başarılı olunca:
- Toast: "✅ Site güncellendi! Değişiklikler canlıya alındı."
- Modal kapanır (success ekranına gerek yok, kullanıcı zaten URL'yi biliyor)

---

## Teknik Detay: `handleUpdate` Fonksiyonu

`PublishModal.tsx` içine yeni `handleUpdate` fonksiyonu eklenir:

```typescript
const handleUpdate = async () => {
  setIsPublishing(true);
  try {
    // Sadece Netlify deploy'u yeniden çalıştır
    const { data: deployData, error: deployError } = await supabase.functions.invoke('deploy-to-netlify', {
      body: { projectId },
    });

    if (!deployError && deployData?.netlifyUrl) {
      toast({
        title: '✅ Site güncellendi!',
        description: 'Değişiklikler canlıya alındı.',
      });
      onClose(); // Modal kapanır
    }
  } catch (err) {
    toast({ title: 'Hata', description: 'Güncelleme başarısız.', variant: 'destructive' });
  } finally {
    setIsPublishing(false);
  }
};
```

---

## SiteEditor'da Prop Akışı

`SiteEditor.tsx` → `EditorToolbar` ve `PublishModal`'a `isPublished` prop'u zaten geçiriliyor, sadece `EditorToolbar`'a da eklenmesi gerekiyor:

```tsx
<EditorToolbar
  ...
  isPublished={isPublished}  // ← yeni
/>
```

---

## Özet Akış (Kullanıcı Deneyimi)

```
Kullanıcı düzenleme yapar
  → Toolbar sağ üstte "Güncelle" (yeşil) butonu görür
  → Basar → Modal açılır
  → Mevcut site URL'si görünür
  → "Değişiklikleri Yayınla" butonuna basar
  → Netlify deploy yeniden çalışır (5-10 sn)
  → Toast: "Site güncellendi!" → Modal kapanır
  → Canlı site güncel
```
