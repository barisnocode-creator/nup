

# Domain Kartlarını Daraltılabilir (Collapsible) Yapma

## Yapılacaklar

### 1. "Sizin İçin Domain Önerileri" kartı (`DomainSuggestionCard.tsx`)
- Kart varsayılan olarak kapalı (collapsed) olacak
- Sadece baslik satirini gosterecek: Globe ikonu + "Sizin Icin Domain Onerileri" + chevron ikonu
- Tiklayinca Radix Collapsible ile asagi dogru kayarak acilacak
- Kart boyutu kucultulecek (daha kompakt padding)

### 2. "Ozel Domain Bagla" karti (`PublishModal.tsx` icerisinde inline)
- Ayni sekilde collapsible yapilacak
- Varsayilan kapali, tiklaninca acilacak
- Icerik: aciklama metni + "Domain Ayarlari" butonu asagi kayarak gorunecek

## Teknik Detaylar

- `@radix-ui/react-collapsible` zaten projede yuklu, `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` bilesenlerini kullanacagiz
- `CollapsibleContent` icin Tailwind `data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up` animasyonlari kullanilacak (tailwindcss-animate paketi zaten projede var)
- `ChevronDown` ikonu eklenerek acik/kapali durumu gorsel olarak belirtilecek, acikken 180 derece donecek
- Her iki kart icin `useState` ile `open` durumu yonetilecek, varsayilan `false`
- Padding degerleri `p-4`'ten `p-3`'e dusurulerek kartlar daha kompakt yapilacak

