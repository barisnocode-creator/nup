

# Renk Sorusunu Kaldirma (3 Soru → 2 Soru)

## Ozet

AI sohbet asistanindaki 3. soru (tasarim tercihi / renk secimi) kaldirilacak. Kullanici zaten editorde template secerken ve ozellestirirken renkleri kendisi belirleyebildigi icin bu soru gereksiz. Soru sayisi 3'ten 2'ye dusurulecek.

## Degisiklikler

### 1. Edge Function: `supabase/functions/wizard-chat/index.ts`

Sistem promptunda:
- "3 KISA soru" ifadesi "2 KISA soru" olarak guncellenecek
- SORU 3 (Tasarim tercihi) tamamen kaldirilacak
- "2. sorunun cevabini aldiktan sonra CHAT_COMPLETE yaz" seklinde guncelleme
- JSON ciktisindaki `colorTone` ve `colorMode` alanlari varsayilan degerlerle ("neutral", "light") sabitlenecek

### 2. Frontend: `src/components/wizard/steps/AIChatStep.tsx`

- `TOTAL_QUESTIONS` sabiti 3'ten 2'ye dusurulecek
- Ilk mesajdaki "3 kisa soru" ifadesi "2 kisa soru" olarak guncellenecek
- Progress bar ve soru sayaci otomatik olarak 2 uzerinden hesaplanacak

### 3. Varsayilan Renk Degerleri

`colorTone` ve `colorMode` alanlari JSON ciktisinda hala mevcut olacak ancak AI'a sorulmayacak -- varsayilan degerler ("neutral" ve "light") kullanilacak. Bu sayede mevcut template esleme mantigi bozulmadan calisacak.

## Teknik Detay

Toplam degisiklik 2 dosyada:
- `supabase/functions/wizard-chat/index.ts` -- prompt guncelleme
- `src/components/wizard/steps/AIChatStep.tsx` -- TOTAL_QUESTIONS = 2, mesaj guncelleme

