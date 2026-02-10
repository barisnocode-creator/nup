
# Dropdown Seceneklerini Turkce ve Duzgun Formatta Gosterme

## Sorun
Sidebar'daki dropdown seceneklerinde "normal", "medium", "semibold", "bold", "extrabold" gibi Ingilizce, kucuk harfli teknik degerler gorunuyor. Kullanici icin anlamsiz ve kotu gorunumlu.

## Cozum

### Degistirilecek Dosya: `src/components/chai-builder/blocks/shared/styleUtils.ts`

Her `builderProp` tanimina `enumNames` dizisi eklenecek. Bu, JSON Schema standardinda desteklenen bir ozellik olup dropdown'da gorunen etiketi degistirir, arka planda deger ayni kalir.

Ornekler:

- **Baslik Kalinligi**: `["normal", "medium", "semibold", "bold", "extrabold"]` yerine `["Normal", "Orta", "Yari Kalin", "Kalin", "Ekstra Kalin"]`
- **Baslik Boyutu**: `["lg", "xl", "2xl", "3xl"]` yerine `["Buyuk", "Cok Buyuk", "Dev", "En Buyuk"]`
- **Baslik Rengi**: `["default", "primary", "secondary", "white", "muted"]` yerine `["Varsayilan", "Ana Renk", "Ikincil", "Beyaz", "Soluk"]`
- **Metin Hizalama**: `["left", "center", "right"]` yerine `["Sola", "Ortala", "Saga"]`
- **Aciklama Boyutu**: `["sm", "base", "lg", "xl"]` yerine `["Kucuk", "Normal", "Buyuk", "Cok Buyuk"]`
- **Aciklama Rengi**: `["default", "primary", "dark", "muted", "white"]` yerine `["Varsayilan", "Ana Renk", "Koyu", "Soluk", "Beyaz"]`
- **Alt Baslik Stili**: `["normal", "uppercase"]` yerine `["Normal", "Buyuk Harf"]`
- **Arka Plan Rengi**: `["transparent", "background", "muted", "card", "primary", "secondary"]` yerine `["Seffaf", "Varsayilan", "Soluk", "Kart", "Ana Renk", "Ikincil"]`
- **Bolum Boslugu**: `["sm", "md", "lg", "xl"]` yerine `["Dar", "Normal", "Genis", "Cok Genis"]`

### CSS Ek Dokunusu: `src/styles/chaibuilder.tailwind.css`

Select option'larin `text-transform: capitalize` ile ilk harflerinin buyuk gosterilmesi (yedek olarak, enumNames calismasa bile temiz gorunsun).
