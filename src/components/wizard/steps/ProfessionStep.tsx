import { Briefcase, ShoppingBag, UtensilsCrossed, Palette, Monitor, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Profession } from '@/types/wizard';

interface ProfessionStepProps {
  value?: Profession;
  onChange: (profession: Profession) => void;
  error?: string;
}

const sectors = [
  {
    id: 'service' as const,
    label: 'Hizmet Sektörü',
    description: 'Danışmanlık, eğitim, tamir vb.',
    icon: Briefcase,
  },
  {
    id: 'retail' as const,
    label: 'Perakende & Satış',
    description: 'Mağaza, e-ticaret, showroom',
    icon: ShoppingBag,
  },
  {
    id: 'food' as const,
    label: 'Yiyecek & İçecek',
    description: 'Restoran, kafe, catering',
    icon: UtensilsCrossed,
  },
  {
    id: 'creative' as const,
    label: 'Kreatif & Medya',
    description: 'Tasarım, fotoğraf, video',
    icon: Palette,
  },
  {
    id: 'technology' as const,
    label: 'Teknoloji',
    description: 'Yazılım, IT, dijital hizmetler',
    icon: Monitor,
  },
  {
    id: 'other' as const,
    label: 'Diğer',
    description: 'Diğer tüm sektörler',
    icon: Building2,
  },
];

export function ProfessionStep({ value, onChange, error }: ProfessionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Hangi sektörde faaliyet gösteriyorsunuz?</h2>
        <p className="text-muted-foreground">
          Web sitenizi kişiselleştirmek için sektörünüzü seçin
        </p>
      </div>

      <div className="grid gap-3">
        {sectors.map((sector) => {
          const Icon = sector.icon;
          const isSelected = value === sector.id;

          return (
            <button
              key={sector.id}
              type="button"
              onClick={() => onChange(sector.id)}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                'hover:border-primary/50 hover:bg-accent/50',
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border bg-background'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                  isSelected ? 'gradient-hero' : 'bg-muted'
                )}
              >
                <Icon
                  className={cn(
                    'w-6 h-6 transition-colors',
                    isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                  )}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{sector.label}</h3>
                <p className="text-sm text-muted-foreground">{sector.description}</p>
              </div>
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                  isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                )}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
