

# Pembe Ekran Hatası Düzeltme

## Sorun

Editörde bir bloğa tıklandığında uygulama çöküyor ve pembe "Oops! Something went wrong" ekranı gösteriyor.

Hata mesajı: `Tooltip must be used within TooltipProvider`

## Kök Neden

Vite konfigürasyonunda `resolve.dedupe` listesi sadece `react`, `react-dom`, `react/jsx-runtime` içeriyor. Ancak ChaiBuilder SDK, kendi paketinde `@radix-ui/react-tooltip` kullanıyor. Vite her iki kopyayı da ayrı modüller olarak yüklüyor. Sonuç olarak:

- Projenin `TooltipProvider`'ı bir React context oluşturuyor
- SDK'nın `Tooltip`'i farklı bir context arıyor
- Context bulunamıyor ve uygulama çöküyor

## Çözüm

### 1. vite.config.ts - Radix paketlerini dedupe listesine ekle

`resolve.dedupe` dizisine `@radix-ui/react-tooltip` ve diğer kritik Radix paketlerini ekleyerek tüm bileşenlerin aynı context'i paylaşmasını sağla.

Eklenecek paketler:
- `@radix-ui/react-tooltip`
- `@radix-ui/react-context`
- `@radix-ui/react-dialog`
- `@radix-ui/react-popover`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-select`

### 2. ChaiBuilderWrapper.tsx - onError handler ekle

SDK'nın `onError` prop'unu kullanarak beklenmeyen hataları yakalayıp kullanıcıya anlaşılır mesaj göster. Bu, pembe ekran yerine nazik bir hata mesajı gösterecek.

## Dosya Değişiklikleri

| Dosya | İşlem | Açıklama |
|-------|-------|----------|
| `vite.config.ts` | Güncelle | Radix paketlerini dedupe listesine ekle |
| `src/components/chai-builder/ChaiBuilderWrapper.tsx` | Güncelle | onError handler ekle |

## Teknik Detaylar

### vite.config.ts değişikliği

```text
Mevcut:  dedupe: ["react", "react-dom", "react/jsx-runtime"]
Yeni:    dedupe: ["react", "react-dom", "react/jsx-runtime", 
                  "@radix-ui/react-tooltip", "@radix-ui/react-context",
                  "@radix-ui/react-dialog", "@radix-ui/react-popover",
                  "@radix-ui/react-dropdown-menu", "@radix-ui/react-select"]
```

### ChaiBuilderWrapper.tsx değişikliği

ChaiBuilderEditor bileşenine `onError` prop'u eklenerek hata yakalanacak ve sonner toast ile kullanıcıya gösterilecek (pembe ekran yerine).

