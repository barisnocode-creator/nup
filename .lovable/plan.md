

# GrapesJS Editör Hatası Düzeltme ve İyileştirme Planı

## Tespit Edilen Sorunlar

### Sorun 1: GrapesJS Initialization Hatası
**Hata:** `Cannot read properties of undefined (reading 'getFrames')`

GrapesJS editörü başlatılırken Canvas modülü düzgün yüklenmiyor. Bu, `loadProjectData` boş obje ile çağrıldığında veya editor henüz hazır değilken veri yüklenmeye çalışıldığında oluşuyor.

### Sorun 2: Boş grapes_content
Veritabanında `grapes_content = {}` (boş obje) kaydedilmiş. `generated_content` dolu olmasına rağmen GrapesJS formatına dönüştürme başarısız olmuş.

### Sorun 3: Editor Ready Timing
`loadProjectData` editör tamamen hazır olmadan çağrılıyor.

---

## Çözüm Planı

### Değişiklik 1: GrapesEditor.tsx - Editor Initialization Düzeltmesi

Editor'ün hazır olmasını bekleyerek ve hata yakalamayı iyileştirerek güvenli başlatma:

```typescript
useEffect(() => {
  if (!containerRef.current || editorRef.current) return;

  try {
    const editor = grapesjs.init({
      container: containerRef.current,
      // ... mevcut config
    });

    // Editor'ün tamamen yüklenmesini bekle
    editor.on('load', () => {
      try {
        // Önce mevcut generated_content'ten HTML oluştur
        const grapesData = convertToGrapesFormat(initialContent, templateId);
        
        if (grapesData && Object.keys(grapesData).length > 0) {
          // gjs-html varsa doğrudan set et
          if (grapesData['gjs-html']) {
            editor.setComponents(grapesData['gjs-html']);
            editor.setStyle(grapesData['gjs-css'] || '');
          }
        } else {
          // Fallback: generated_content'ten temel içerik oluştur
          const fallbackHtml = generateFallbackHtml(initialContent);
          editor.setComponents(fallbackHtml);
        }
        
        setIsReady(true);
      } catch (loadError) {
        console.error('Content load error:', loadError);
        setIsReady(true); // Yine de editörü göster
      }
    });

    // Error handling
    editor.on('error', (error: any) => {
      console.error('GrapesJS error:', error);
    });

    editorRef.current = editor;
  } catch (initError) {
    console.error('GrapesJS init error:', initError);
    // Fallback to legacy editor
    setUseFallbackEditor(true);
  }

  return () => {
    editorRef.current?.destroy();
    editorRef.current = null;
  };
}, [projectId, templateId, initialContent]);
```

### Değişiklik 2: Fallback Mekanizması

GrapesJS başarısız olursa eski editöre otomatik geri dönüş:

```typescript
// GrapesEditor.tsx içinde
const [useFallbackEditor, setUseFallbackEditor] = useState(false);
const [initError, setInitError] = useState<Error | null>(null);

// Render içinde
if (useFallbackEditor || initError) {
  return (
    <div className="p-4 text-center">
      <p className="text-muted-foreground">Editör yüklenemedi. Klasik editör kullanılıyor.</p>
      <Button onClick={() => window.location.reload()}>Tekrar Dene</Button>
    </div>
  );
}
```

### Değişiklik 3: Project.tsx - USE_GRAPES_EDITOR Flag'i Geçici Olarak Kapat

GrapesJS düzeltilene kadar mevcut çalışan editörü kullan:

```typescript
// Geçici olarak false yap
const USE_GRAPES_EDITOR = false;
```

### Değişiklik 4: supabaseStorage.ts - Daha Güvenli Dönüşüm

`convertToGrapesFormat` fonksiyonunu iyileştir:

```typescript
export function convertToGrapesFormat(content: any, templateId: string): Record<string, any> {
  // Null/undefined kontrol
  if (!content || typeof content !== 'object') return {};

  // Zaten GrapeJS formatındaysa
  if (content['gjs-components'] || content['gjs-html']) {
    return content;
  }
  
  // generated_content formatından dönüştür
  try {
    const html = generateHtmlFromContent(content, templateId);
    const css = generateCssFromContent(content);
    const assets = extractAssetsFromContent(content);

    return {
      'gjs-html': html,
      'gjs-css': css,
      'gjs-assets': assets,
    };
  } catch (error) {
    console.error('Format conversion error:', error);
    return {};
  }
}
```

### Değişiklik 5: GrapesJS Load Sequence Düzeltmesi

`editor.on('load')` yerine `editor.onReady()` kullan:

```typescript
// Doğru sıralama
editor.onReady(() => {
  console.log('GrapesJS fully ready');
  
  // İçeriği güvenli şekilde yükle
  const canvas = editor.Canvas;
  if (canvas && canvas.getFrames) {
    // Canvas hazır, içeriği yükle
    loadInitialContent(editor, initialContent, templateId);
  }
  
  setIsReady(true);
});
```

---

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|-----------|
| `src/pages/Project.tsx` | `USE_GRAPES_EDITOR = false` yaparak eski editörü aktifleştir |
| `src/components/grapes-editor/GrapesEditor.tsx` | Initialization hatalarını düzelt, fallback ekle, load timing'i düzelt |
| `src/components/grapes-editor/plugins/supabaseStorage.ts` | convertToGrapesFormat güvenlik kontrolleri |

---

## Acil Düzeltme Adımları

**1. Öncelik: Kullanıcının siteyi görmesini sağla**
- `USE_GRAPES_EDITOR = false` yaparak mevcut çalışan editöre dön
- Kullanıcı sitesini görebilir ve düzenleyebilir

**2. Öncelik: GrapesJS hatalarını düzelt**
- Editor initialization'ı güvenli hale getir
- Load event timing'i düzelt
- Fallback mekanizması ekle

**3. Öncelik: Tam GrapesJS entegrasyonu**
- generated_content → GrapesJS format dönüşümünü test et
- Kaydetme/yükleme döngüsünü test et
- USE_GRAPES_EDITOR = true yap

---

## Beklenen Sonuçlar

1. **Acil:** Kullanıcı web sitesini mevcut editörde görebilir ve düzenleyebilir
2. **Kısa Vadeli:** GrapesJS hatası düzeltilir, güvenli başlatma sağlanır
3. **Orta Vadeli:** GrapesJS tam fonksiyonel çalışır, sürükle-bırak editör aktif olur

---

## Teknik Detaylar

### Neden `getFrames` Hatası Oluşuyor?

GrapesJS'te Canvas modülü, `postLoad` aşamasında `getFrames()` metodunu çağırıyor. Bu metod:
1. Editor'ün `FramesView` bileşeninin hazır olmasını bekliyor
2. `FramesView` ancak DOM'a mount edildikten sonra hazır oluyor
3. `loadProjectData` çok erken çağrılırsa, `FramesView` henüz yok

### Çözüm: `editor.on('load')` vs `editor.onReady()`

```typescript
// YANLIŞ - Editor henüz tam hazır değil
const editor = grapesjs.init({...});
editor.loadProjectData(data); // HATA!

// DOĞRU - Editor tamamen hazır
editor.on('load', () => {
  // DOM hazır, içerik yüklenebilir
  editor.setComponents(html);
});
```

