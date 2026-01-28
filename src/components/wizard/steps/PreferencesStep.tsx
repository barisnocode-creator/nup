import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { LANGUAGES } from '@/types/wizard';
import { Briefcase, Heart, Crown, Sun, Moon, Palette } from 'lucide-react';

interface PreferencesData {
  language: string;
  tone: 'professional' | 'friendly' | 'premium';
  colorPreference: 'light' | 'dark' | 'neutral';
}

interface PreferencesStepProps {
  value: PreferencesData;
  onChange: (data: PreferencesData) => void;
  onValidityChange: (isValid: boolean) => void;
}

const toneOptions = [
  {
    value: 'professional' as const,
    label: 'Professional',
    description: 'Formal and authoritative',
    icon: Briefcase,
  },
  {
    value: 'friendly' as const,
    label: 'Friendly',
    description: 'Warm and approachable',
    icon: Heart,
  },
  {
    value: 'premium' as const,
    label: 'Premium',
    description: 'Luxurious and exclusive',
    icon: Crown,
  },
];

const colorOptions = [
  {
    value: 'light' as const,
    label: 'Light',
    icon: Sun,
    colors: ['bg-white', 'bg-slate-100', 'bg-primary/10'],
  },
  {
    value: 'dark' as const,
    label: 'Dark',
    icon: Moon,
    colors: ['bg-slate-900', 'bg-slate-800', 'bg-primary'],
  },
  {
    value: 'neutral' as const,
    label: 'Neutral',
    icon: Palette,
    colors: ['bg-stone-100', 'bg-stone-200', 'bg-stone-300'],
  },
];

export function PreferencesStep({ value, onChange, onValidityChange }: PreferencesStepProps) {
  const [localData, setLocalData] = useState<PreferencesData>(value);

  useEffect(() => {
    onChange(localData);
    const isValid = !!(localData.language && localData.tone && localData.colorPreference);
    onValidityChange(isValid);
  }, [localData, onChange, onValidityChange]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Website Preferences</h2>
        <p className="text-muted-foreground">
          Customize the look and feel of your website
        </p>
      </div>

      <div className="space-y-6">
        {/* Language Selection */}
        <div className="space-y-2">
          <Label>Preferred Language</Label>
          <Select
            value={localData.language}
            onValueChange={(val) => setLocalData({ ...localData, language: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tone of Voice */}
        <div className="space-y-3">
          <Label>Tone of Voice</Label>
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
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Preference */}
        <div className="space-y-3">
          <Label>Color Preference</Label>
          <div className="grid grid-cols-3 gap-3">
            {colorOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = localData.colorPreference === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLocalData({ ...localData, colorPreference: option.value })}
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
