import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Profession } from '@/types/wizard';
import {
  MEDICAL_SPECIALTIES,
  YEARS_EXPERIENCE,
  DENTAL_SERVICES,
  PHARMACY_TYPES,
} from '@/types/wizard';

interface ProfessionalDetailsData {
  specialty?: string;
  yearsExperience?: string;
  services?: string[];
  pharmacyType?: string;
}

interface ProfessionalDetailsStepProps {
  profession: Profession;
  value: ProfessionalDetailsData;
  onChange: (data: ProfessionalDetailsData) => void;
  onValidityChange: (isValid: boolean) => void;
}

export function ProfessionalDetailsStep({
  profession,
  value,
  onChange,
  onValidityChange,
}: ProfessionalDetailsStepProps) {
  const [localData, setLocalData] = useState<ProfessionalDetailsData>(value);

  useEffect(() => {
    onChange(localData);
    
    // Validate based on profession
    let isValid = false;
    if (profession === 'doctor') {
      isValid = !!(localData.specialty && localData.yearsExperience);
    } else if (profession === 'dentist') {
      isValid = !!(localData.services && localData.services.length > 0);
    } else if (profession === 'pharmacist') {
      isValid = !!localData.pharmacyType;
    }
    onValidityChange(isValid);
  }, [localData, profession, onChange, onValidityChange]);

  const handleServiceToggle = (service: string) => {
    const currentServices = localData.services || [];
    const newServices = currentServices.includes(service)
      ? currentServices.filter((s) => s !== service)
      : [...currentServices, service];
    setLocalData({ ...localData, services: newServices });
  };

  if (profession === 'doctor') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Medical Details</h2>
          <p className="text-muted-foreground">
            Tell us about your medical practice
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Medical Specialty</Label>
            <Select
              value={localData.specialty || ''}
              onValueChange={(val) => setLocalData({ ...localData, specialty: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your specialty" />
              </SelectTrigger>
              <SelectContent>
                {MEDICAL_SPECIALTIES.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Years of Experience</Label>
            <Select
              value={localData.yearsExperience || ''}
              onValueChange={(val) => setLocalData({ ...localData, yearsExperience: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                {YEARS_EXPERIENCE.map((years) => (
                  <SelectItem key={years} value={years}>
                    {years}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  if (profession === 'dentist') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Dental Services</h2>
          <p className="text-muted-foreground">
            Select the services you offer
          </p>
        </div>

        <div className="space-y-3">
          {DENTAL_SERVICES.map((service) => {
            const isChecked = localData.services?.includes(service) || false;
            return (
              <div
                key={service}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer',
                  isChecked ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent/50'
                )}
                onClick={() => handleServiceToggle(service)}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => handleServiceToggle(service)}
                />
                <span className="font-medium">{service}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (profession === 'pharmacist') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Pharmacy Type</h2>
          <p className="text-muted-foreground">
            What type of pharmacy do you operate?
          </p>
        </div>

        <div className="space-y-3">
          {PHARMACY_TYPES.map((type) => {
            const isSelected = localData.pharmacyType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setLocalData({ ...localData, pharmacyType: type.value })}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors text-left',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                  )}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <span className="font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
