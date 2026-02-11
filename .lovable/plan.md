

# Yayınla Modalı Renk ve Kontrast İyileştirmesi

## Sorun
Yayınla (Publish) başarı ekranındaki modal, arka plandaki site içeriğiyle karışıyor. Renkler yeterince belirgin değil ve okunması zor.

## Çözüm
Modal arka planını beyaz, aksanları turuncu tonlarında yaparak sitenin genel tasarım diline uygun, okunabilir bir görünüm sağlanacak.

## Yapılacak Değişiklikler

### `src/components/website-preview/PublishModal.tsx`

**Başarı (Success) Ekranı:**
- `DialogContent`'e `bg-white text-gray-900` sınıfları eklenerek arka plan beyaz, metin koyu yapılacak
- Başarı ikonu yeşilden turuncuya (`from-orange-400 to-amber-500`) değiştirilecek
- URL kutusu arka planı `bg-orange-50 border-orange-200` yapılacak, metin rengi koyu tutulacak
- "Copy Link" ve "Open Website" butonları turuncu tonlarında stillenecek
- "Özel Domain Bağla" kartı `bg-orange-50 border-orange-200` yapılacak
- Overlay (arka plan karartma) daha belirgin hale getirilecek

### `src/components/website-preview/DomainSuggestionCard.tsx`

- Kart arka planı `bg-white border-orange-200` yapılacak
- Domain önerileri `bg-orange-50 hover:bg-orange-100` tonlarında stillenecek
- İkon renkleri turuncu yapılacak
- Tüm metinler koyu renkte tutularak okunabilirlik artırılacak

## Teknik Detay
- Tailwind sınıfları doğrudan bileşenlere uygulanacak (CSS değişkenleri yerine sabit renkler kullanılacak ki modal her temada tutarlı görünsün)
- `DialogContent` overlay'ine `bg-black/60` eklenerek arka planın daha belirgin karartılması sağlanacak
