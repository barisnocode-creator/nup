import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { LANGUAGES } from '@/types/wizard';
import { Briefcase, Heart, Crown, Sun, Moon, Palette, Flame, Snowflake } from 'lucide-react';

interface PreferencesData {
  languages: string[];
  tone: 'professional' | 'friendly' | 'premium';
  colorTone?: 'warm' | 'cool' | 'neutral';
  colorMode?: 'light' | 'dark' | 'neutral';
}

interface PreferencesStepProps {
  value: PreferencesData;
  onChange: (data: PreferencesData) => void;
  onValidityChange: (isValid: boolean) => void;
}

const toneOptions = [
  {
    value: 'professional' as const,
    label: 'Profesyonel',
    description: 'Resmi ve güvenilir',
    icon: Briefcase,
  },
  {
    value: 'friendly' as const,
    label: 'Samimi',
    description: 'Sıcak ve yakın',
    icon: Heart,
  },
  {
    value: 'premium' as const,
    label: 'Premium',
    description: 'Lüks ve özel',
    icon: Crown,
  },
];

const colorToneOptions = [
  {
    value: 'warm' as const,
    label: 'Sıcak',
    description: 'Turuncu, kırmızı, sarı',
    icon: Flame,
    colors: ['bg-orange-400', 'bg-red-400', 'bg-yellow-400'],
  },
  {
    value: 'cool' as const,
    label: 'Soğuk',
    description: 'Mavi, yeşil, mor',
    icon: Snowflake,
    colors: ['bg-blue-400', 'bg-teal-400', 'bg-purple-400'],
  },
  {
    value: 'neutral' as const,
    label: 'Nötr',
    description: 'Gri, bej tonları',
    icon: Palette,
    colors: ['bg-gray-400', 'bg-stone-400', 'bg-slate-400'],
  },
];

const colorModeOptions = [
  {
    value: 'light' as const,
    label: 'Açık Tema',
    icon: Sun,
    colors: ['bg-white', 'bg-slate-100', 'bg-slate-200'],
  },
  {
    value: 'dark' as const,
    label: 'Koyu Tema',
    icon: Moon,
    colors: ['bg-slate-900', 'bg-slate-800', 'bg-slate-700'],
  },
  {
    value: 'neutral' as const,
    label: 'Nötr',
    icon: Palette,
    colors: ['bg-stone-100', 'bg-stone-300', 'bg-stone-500'],
  },
];

export function PreferencesStep({ value, onChange, onValidityChange }: PreferencesStepProps) {
  const [localData, setLocalData] = useState<PreferencesData>({
    languages: value.languages || ['Turkish'],
    tone: value.tone || 'professional',
    colorTone: value.colorTone || 'neutral',
    colorMode: value.colorMode || 'light',
  });

  useEffect(() => {
    onChange(localData);
    const isValid = localData.languages.length > 0 && !!localData.tone;
    onValidityChange(isValid);
  }, [localData, onChange, onValidityChange]);

  const toggleLanguage = (language: string) => {
    setLocalData(prev => {
      const languages = prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language];
      // Ensure at least one language is selected
      return { ...prev, languages: languages.length > 0 ? languages : prev.languages };
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Tasarım Tercihleri</h2>
        <p className="text-muted-foreground">
          Web sitenizin görünümünü özelleştirin
        </p>
      </div>

      <div className="space-y-6">
        {/* Language Selection - Checkboxes */}
        <div className="space-y-3">
          <Label>Web Sitesi Dilleri</Label>
          <div className="flex gap-4">
            {LANGUAGES.map((lang) => (
              <div key={lang.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${lang.value}`}
                  checked={localData.languages.includes(lang.value)}
                  onCheckedChange={() => toggleLanguage(lang.value)}
                />
                <label
                  htmlFor={`lang-${lang.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {lang.label}
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Birden fazla dil seçebilirsiniz
          </p>
        </div>

        {/* Tone of Voice */}
        <div className="space-y-3">
          <Label>İletişim Tonu</Label>
          <div className="grid grid-cols-3 gap-3">
            {toneOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = localData.tone === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLocalData({ ...localData, tone: option.value })}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-6 h-6',
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span className="font-medium text-sm">{option.label}</span>
                  <span className="text-xs text-muted-foreground text-center">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Tone */}
        <div className="space-y-3">
          <Label>Renk Tonu</Label>
          <div className="grid grid-cols-3 gap-3">
            {colorToneOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = localData.colorTone === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLocalData({ ...localData, colorTone: option.value })}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex gap-1">
                    {option.colors.map((color, i) => (
                      <div
                        key={i}
                        className={cn('w-4 h-4 rounded-full border border-border', color)}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Mode (Light/Dark) */}
        <div className="space-y-3">
          <Label>Tema Modu</Label>
          <div className="grid grid-cols-3 gap-3">
            {colorModeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = localData.colorMode === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLocalData({ ...localData, colorMode: option.value })}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex gap-1">
                    {option.colors.map((color, i) => (
                      <div
                        key={i}
                        className={cn('w-4 h-4 rounded-full border border-border', color)}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
