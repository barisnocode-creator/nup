

# Pembe Ekran Duzeltmesi - Hero Bloklari

## Sorun

Hero section'daki gorsele mouse ile dokunuldiginda (hover) ChaiBuilder SDK'nin dahili blok arac cubugu (toolbar) Radix Tooltip kullaniyor. Ancak hero bloklari `TooltipProvider` ile sarilmadigi icin "Tooltip must be used within TooltipProvider" hatasi olusup pembe ekran cikiyor.

Bu, daha once AppointmentBooking blogunda cozulen sorunun aynisi.

## Cozum

Uc hero blok bileseninin tum return degerlerini `TooltipProvider` ile sarmak:

| Dosya | Islem |
|-------|-------|
| `src/components/chai-builder/blocks/hero/HeroSplit.tsx` | `TooltipProvider` import et, return'u sar |
| `src/components/chai-builder/blocks/hero/HeroOverlay.tsx` | `TooltipProvider` import et, return'u sar |
| `src/components/chai-builder/blocks/hero/HeroCentered.tsx` | `TooltipProvider` import et, return'u sar |

### Teknik Detaylar

Her uc dosyada ayni kalip:

```text
1. Import ekleme:
   import { TooltipProvider } from '@/components/ui/tooltip';

2. Return degerini sarma:
   return (
     <TooltipProvider>
       <section ...> ... </section>
     </TooltipProvider>
   );
```

- **HeroSplit**: Tek return var (satir 35-79), `<TooltipProvider>` ile sar
- **HeroOverlay**: Tek return var (satir 37-88), `<TooltipProvider>` ile sar
- **HeroCentered**: Return'de `EditableChaiBackground` var (satir 90-101), `<TooltipProvider>` ile sar

## Beklenen Sonuc

- Hero gorseline mouse ile dokunuldugunda pembe ekran cikmayi durduracak
- Degistir/Yenile overlay'i normal gorunecek
- Diger tum bloklar etkilenmeyecek

