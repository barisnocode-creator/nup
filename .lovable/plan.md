
# Randevu Formunun Yayinlanan Sitede Calismasi - Netlify Renderer Guncelleme

## Sorun Tespiti

Backend (book-appointment edge function) sorunsuz calisiyor - test randevusu basariyla olusturuldu. Sorun **yayinlanan Netlify sitesindeki HTML renderer**'da:

1. **Eski tasarim**: `deploy-to-netlify/index.ts` icindeki `renderAppointmentBooking` fonksiyonu hala eski basit buton tasarimini kullaniyor (duz flex-wrap butonlar)
2. **Editordeki yeni tasarim**: React bileseni (AppointmentBooking.tsx) Cal.com ilhamli modern tasarima sahip - step indicator, yatay tarih seridi, scrollable saat listesi
3. **Uyumsuzluk**: Editorde gordugun ile yayinlanan site birbiriyle uyusmuyor

## Cozum

`renderAppointmentBooking` fonksiyonunu tamamen yeniden yazarak editordeki modern tasarima eslemek:

### Yeni HTML Yapisi

**Step Indicator**: Ust kisimda 3 adimli gosterge (Tarih - Saat - Bilgiler)
- SVG ikonlar ile Calendar, Clock, User
- Aktif adim: `var(--primary)` dolgu
- Cizgi baglantilari adimlar arasi

**Tarih Secimi (Date Strip)**:
- 7 gunluk yatay grid (grid-cols-7)
- Her gun: gun adi (kisa) + gun numarasi
- Secili gun: `var(--primary)` arka plan, beyaz yazi
- Sol/sag ok butonlari ile hafta degistirme
- Ay ve yil basligini ustunde gosterme

**Saat Secimi (Scrollable List)**:
- Dikey liste, her slot bir satir (start - end time)
- `max-height: 220px` ile scroll
- Secili slot: `var(--primary)` arka plan
- Sure bilgisi her satin saginda

**Form Alanlari**:
- Saat secildikten sonra gorunur (animasyonlu acilma JavaScript ile)
- Ad + E-posta yan yana (2 sutunlu grid)
- Telefon ve Mesaj alanlari alt alta
- Rounded-xl, havadar input'lar

**Consent + Submit**:
- Checkbox + gizlilik metni
- `var(--primary)` arka planli genis buton
- Disabled state: `opacity: 0.4`

### JavaScript Degisiklikleri

Mevcut JS mantigi korunacak (tarih sec -> saat getir -> form goster -> gonder) ama DOM manipulasyonlari yeni HTML yapisina uyarlanacak:

- `renderDates()`: 7'li grid render, hafta offset yonetimi
- `selectDate()`: Grid item'inin stilini degistir, slot'lari getir
- `renderSlots()`: Dikey liste render
- `selectSlot()`: Form alanlarini ac, step indicator guncelle
- `submit()`: Mevcut POST mantigi ayni

### Unavailable Date Kontrolu (Bonus)

Hafta goruntulediginde 7 paralel fetch ile musait olmayan gunleri belirle ve `opacity:0.4; pointer-events:none` ile devre disi birak.

## Dosya Degisiklikleri

| Dosya | Islem |
|-------|-------|
| `supabase/functions/deploy-to-netlify/index.ts` | `renderAppointmentBooking` fonksiyonunu Cal.com ilhamli yeni HTML/CSS/JS ile yeniden yaz |

## Beklenen Sonuc

- Yayinlanan sitedeki randevu formu editordekiyle birebir ayni gorunecek
- Tarih seridi, saat listesi, step indicator, form alanlari tam eslesecek
- Randevu olusturma calisan backend ile sorunsuz calisacak
