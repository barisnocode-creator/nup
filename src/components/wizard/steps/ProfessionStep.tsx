import { Stethoscope, Smile, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Profession } from '@/types/wizard';

interface ProfessionStepProps {
  value?: Profession;
  onChange: (profession: Profession) => void;
  error?: string;
}

const professions = [
  {
    id: 'doctor' as const,
    label: 'Doctor',
    description: 'Medical practitioner or physician',
    icon: Stethoscope,
  },
  {
    id: 'dentist' as const,
    label: 'Dentist',
    description: 'Dental care professional',
    icon: Smile,
  },
  {
    id: 'pharmacist' as const,
    label: 'Pharmacist',
    description: 'Pharmacy and medications expert',
    icon: Pill,
  },
];

export function ProfessionStep({ value, onChange, error }: ProfessionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">What's your profession?</h2>
        <p className="text-muted-foreground">
          Select your professional field to personalize your website
        </p>
      </div>

      <div className="grid gap-4">
        {professions.map((profession) => {
          const Icon = profession.icon;
          const isSelected = value === profession.id;

          return (
            <button
              key={profession.id}
              type="button"
              onClick={() => onChange(profession.id)}
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
                  'w-14 h-14 rounded-xl flex items-center justify-center transition-colors',
                  isSelected ? 'gradient-hero' : 'bg-muted'
                )}
              >
                <Icon
                  className={cn(
                    'w-7 h-7 transition-colors',
                    isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                  )}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{profession.label}</h3>
                <p className="text-sm text-muted-foreground">{profession.description}</p>
              </div>
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                  isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                )}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
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
