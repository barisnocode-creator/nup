import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { businessInfoSchema, COUNTRIES } from '@/types/wizard';
import { useEffect } from 'react';

type BusinessInfoData = z.infer<typeof businessInfoSchema>;

interface BusinessInfoStepProps {
  value: BusinessInfoData;
  onChange: (data: BusinessInfoData) => void;
  onValidityChange: (isValid: boolean) => void;
}

export function BusinessInfoStep({ value, onChange, onValidityChange }: BusinessInfoStepProps) {
  const {
    register,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm<BusinessInfoData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: value,
    mode: 'onChange',
  });

  const formData = watch();

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Business Information</h2>
        <p className="text-muted-foreground">
          Tell us about your clinic or practice
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business / Clinic / Pharmacy Name</Label>
          <Input
            id="businessName"
            placeholder="e.g., City Dental Clinic"
            {...register('businessName')}
          />
          {errors.businessName && (
            <p className="text-sm text-destructive">{errors.businessName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="e.g., New York"
              {...register('city')}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={formData.country}
              onValueChange={(val) => {
                setValue('country', val);
                trigger('country');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g., +1 555-0123"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g., contact@clinic.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
