
# Randevularim Dashboard Paneli - Gelismis Takvim ve Yonetim Sistemi

## Mevcut Durum

Simdi `AppointmentsPanel.tsx` (801 satir) basit bir liste gorunumunde randevulari gosteriyor. 5 sekmeli bir yapi var: Randevular (duz liste), Form Alanlari, Ayarlar, Haftalik Program, Kapali Gunler. Takvim gorunumu, arama/filtreleme, manuel randevu olusturma ve dahili not ozellikleri yok.

Sidebar'da "Randevular" (`CalendarCheck` ikonu) zaten `/project/:id/appointments` rotasina bagli ve `DashboardSidebar.tsx`'de mevcut.

## Yeni Ozellikler

### 1. Takvim Gorunumleri (Aylik / Haftalik / Gunluk / Liste)

Mevcut "Randevular" sekmesi yerine 4 alt gorunum butonu eklenecek:

**Aylik Gorunum:**
- 7x5 veya 7x6 grid (haftanin gunleri x haftalar)
- Her hucrede o gune ait randevu sayisi ve renk kodlu durum gostergesi
- Kapali gunler ve tatiller gri/cizgili arka plan ile isaretlenir
- Gune tiklaninca gunluk gorunume gecer

**Haftalik Gorunum:**
- 7 sutunlu zaman cizelgesi (saat satirlari sol tarafta, gunler ust tarafta)
- Randevular saat dilimlerine gore yerlestirilmis kutucuklar olarak gosterilir
- Mola saatleri ve kapali slotlar gorunur sekilde isaretlenir
- Renk kodlari: bekleyen=sari, onayli=yesil, iptal=kirmizi, bloklu=gri

**Gunluk Gorunum:**
- Tek gunun tam zaman cizelgesi (orn: 08:00-20:00 arasi her slot)
- Dolu slotlar musteri bilgileriyle gosterilir
- Bos slotlar tiklanabilir (manuel randevu olusturma icin)

**Ajanda/Liste Gorunumu:**
- Mevcut liste gorunumunun gelistirilmis hali
- Tarihe gore gruplandirma (Bugun, Yarin, Bu Hafta, Gelecek Hafta vb.)
- Kart tasarimi korunur

### 2. Arama ve Filtreleme

Tum gorunumlerin ustune bir toolbar eklenir:
- **Arama**: Musteri adi, e-posta veya telefona gore arama (client-side filter)
- **Durum filtresi**: Tumu / Bekleyen / Onayli / Iptal (multi-select badge butonlari)
- **Tarih araligi**: Baslangic-Bitis tarih secici

### 3. Manuel Randevu Olusturma

Gunluk gorunumde bos slota tiklandiginda veya "+" butonuyla acilan bir dialog:
- Tarih ve saat secimi (musait slotlardan)
- Musteri bilgileri (ad, e-posta, telefon, not)
- Durum secimi (direkt "confirmed" olarak olusturulabilir)
- `manage-appointments` edge function'a yeni bir `POST` action eklenir (`action: "create_appointment"`)

### 4. Dahili Notlar (Internal Notes)

Veritabanindaki `appointments` tablosuna `internal_note` (text, nullable) sutunu eklenir.
- Sadece hizmet saglayici gorebilir (musteri goremez)
- Randevu kartinda kucuk bir not ikonu ile gosterilir
- Tiklaninca inline edit yapilabilir
- `manage-appointments` PATCH handler'a `internal_note` guncelleme destegi eklenir

### 5. Kisisel Ajanda Notlari

Veritabanina yeni `agenda_notes` tablosu:
```text
agenda_notes:
  id (uuid, PK)
  project_id (uuid, NOT NULL)
  user_id (uuid, NOT NULL)
  note_date (date, NOT NULL)
  content (text, NOT NULL)
  created_at (timestamptz)
  updated_at (timestamptz)
```

- Takvim gorunumlerinde gune ait notlar kucuk bir ikon ile gosterilir
- Gunluk gorunumde notlar randevularin altinda listelenir
- Not ekleme/duzenleme/silme islemi `manage-appointments` edge function uzerinden yapilir

### 6. Calisma Saatleri Hizli Erisim

Haftalik Program sekmesi mevcut, ancak takvim gorunumlerinden de hizli erisim butonu eklenir:
- Takvim toolbar'inda "Calisma Saatleri" ikonu
- Tiklaninca mevcut Haftalik Program sekmesini acar

## Veritabani Degisiklikleri

### Migration

```text
1. appointments tablosuna internal_note (text, nullable) sutunu ekle
2. agenda_notes tablosu olustur (id, project_id, user_id, note_date, content, created_at, updated_at)
3. agenda_notes icin RLS politikalari:
   - SELECT/INSERT/UPDATE/DELETE: auth.uid() = user_id
4. agenda_notes icin user_owns_project kontrolu
```

### Edge Function Guncellemeleri (manage-appointments)

```text
PATCH handler'a:
  - internal_note guncelleme destegi

POST handler'a:
  - action: "create_appointment" -> tarih, saat, musteri bilgileri, durum ile yeni randevu olusturma
  - action: "create_note" -> ajanda notu ekleme
  - action: "update_note" -> ajanda notu guncelleme
  - action: "delete_note" -> ajanda notu silme
  - Mevcut blocked_date mantigi "block_date" action'i altina alinir (geriye uyumlu)

GET handler'a:
  - type=notes -> belirli tarih araligindaki ajanda notlarini getir
  - type=appointments'a date_from, date_to parametreleri eklenir (takvim gorunumleri icin tarih araligina gore sorgulama)
```

## UI Bilesenlerinin Yapilandirilmasi

Mevcut `AppointmentsPanel.tsx` (801 satir) cok buyuk oldugu icin alt bilesenler olarak ayrilacak:

```text
src/components/dashboard/appointments/
  AppointmentsPanel.tsx        -> Ana konteyner (tab yonetimi, veri cekme)
  CalendarToolbar.tsx           -> Gorunum secici, arama, filtreler
  MonthlyView.tsx               -> Aylik takvim grid'i
  WeeklyView.tsx                -> Haftalik zaman cizelgesi
  DailyView.tsx                 -> Gunluk detay gorunumu
  AgendaView.tsx                -> Liste/ajanda gorunumu
  AppointmentCard.tsx           -> Tekil randevu karti (tum gorunumlerde kullanilir)
  AppointmentDetailModal.tsx    -> Randevu detay dialog'u (not ekleme, durum degistirme)
  CreateAppointmentModal.tsx    -> Manuel randevu olusturma dialog'u
  AgendaNoteEditor.tsx          -> Ajanda notu ekleme/duzenleme
  SettingsTab.tsx               -> Mevcut Ayarlar sekmesi (tasindi)
  ScheduleTab.tsx               -> Mevcut Haftalik Program sekmesi (tasindi)
  BlockedDatesTab.tsx           -> Mevcut Kapali Gunler sekmesi (tasindi)
  FormFieldsTab.tsx             -> Mevcut Form Alanlari sekmesi (tasindi)
```

## Sidebar Entegrasyon Modeli

Mevcut sidebar'da "Randevular" zaten var. Degisiklik gerektirmez. Rota `/project/:id/appointments` korunur.

## Randevu Durum Yasam Dongusu

```text
pending -> confirmed (onay)
pending -> cancelled (red)
confirmed -> cancelled (iptal)
cancelled -> pending (yeniden aktif etme - yeni ozellik)
Manuel olusturma: direkt "confirmed" veya "pending"
```

## Slot Bloklama Mekanigi

Mevcut sistem korunur:
- Takvim gorunumlerinde bloklu gunler/saatler gorunur isaretlenir
- Aylik gorunumde bloklu gunler gri arka plan
- Haftalik/Gunluk gorunumde bloklu saat dilimleri cizgili desen
- Tatil gunleri ozel ikon ile gosterilir

## Uygulama Sirasi

1. **Migration**: `internal_note` sutunu + `agenda_notes` tablosu + RLS
2. **Edge Function**: `manage-appointments` guncellemesi (tarih araligi sorgu, not CRUD, manuel randevu, internal_note)
3. **Alt bilesenler**: Mevcut kodu parcalayip yeni bilesenler olustur
4. **Takvim gorunumleri**: Monthly -> Weekly -> Daily -> Agenda sirasinda
5. **Arama/filtreleme toolbar'i**: Client-side filtreleme
6. **Manuel randevu olusturma modal**: Dialog + edge function entegrasyonu
7. **Ajanda not sistemi**: Tablo + CRUD + takvim entegrasyonu
8. **Internal notes**: Randevu kartina dahili not alani

## Teknik Notlar

- Takvim gorunumleri tamamen client-side hesaplanir (tarih araligi icin fetch edilen veriler uzerinden)
- Haftalik/Gunluk gorunumde saat dilimi `settings.timezone` baz alinir
- Performans icin aylik gorunum sadece o ayin randevularini ceker (`date_from`, `date_to` parametreleri)
- Arama client-side yapilir (mevcut veri seti uzerinde `filter`)
- `@hello-pangea/dnd` Form Alanlari sekmesinde kalir, takvim gorunumlerinde kullanilmaz
- Tum bilesenler mevcut UI kutuphanesini kullanir (shadcn/ui)
- Haftalik gorunum icin ozel CSS grid kullanilir (7 sutun x 24 satir saat dilimi)
