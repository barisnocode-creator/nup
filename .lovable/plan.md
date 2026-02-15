

# Manuel Randevu Modalindaki Bulaniklik ve Seffaflik Duzeltmesi

## Sorun

"Manuel Randevu Olustur" modali acildiginda:
1. Arka plandaki `backdrop-blur-sm` efekti icerigi bulanik ve okunaksiz yapiyor
2. Dialog ve dropdown bilesenlerinde `bg-background` / `bg-popover` CSS degiskenleri bazi durumlarda seffaf kalabiliyor, bu da modal iceriginin arkasindaki icerikle karisiyor

## Cozum

### 1. Dialog Bileseninde Duzeltme (`src/components/ui/dialog.tsx`)

- **Overlay**: `backdrop-blur-sm` kaldirilacak, sadece koyu yari-seffaf arka plan (`bg-black/60`) kalacak -- bulaniklik olmayacak
- **Content**: `bg-background` yerine `bg-white` eklenerek icerik her zaman opak beyaz arka plana sahip olacak

### 2. Select Dropdown Duzeltme (`src/components/ui/select.tsx`)

- `SelectContent` bilesenine `bg-white` sinifi eklenerek dropdown menulerin her zaman opak beyaz arka plana sahip olmasi saglanacak

### 3. CreateAppointmentModal Duzeltme (`src/components/dashboard/appointments/CreateAppointmentModal.tsx`)

- `DialogContent` bilesenine acikca `bg-white` sinifi eklenerek modal iceriginin opak beyaz olmasi garanti altina alinacak

## Teknik Detay

Toplam 3 dosyada kucuk degisiklikler:
- `src/components/ui/dialog.tsx` -- overlay'den blur kaldir, content'e `bg-white` ekle
- `src/components/ui/select.tsx` -- SelectContent'e `bg-white` ekle
- `src/components/dashboard/appointments/CreateAppointmentModal.tsx` -- DialogContent'e `bg-white` ekle

