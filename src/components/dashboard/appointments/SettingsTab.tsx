import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import type { AppointmentSettings } from './types';
import { TIMEZONES, DURATION_OPTIONS, BUFFER_OPTIONS } from './types';

interface SettingsTabProps {
  settings: AppointmentSettings;
  onUpdate: (updates: Partial<AppointmentSettings>) => void;
}

export function SettingsTab({ settings, onUpdate }: SettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" /> Genel Ayarlar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label>Randevu Sistemi Aktif</Label>
          <Switch checked={settings.is_enabled} onCheckedChange={(checked) => onUpdate({ is_enabled: checked })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Randevu Süresi</Label>
            <Select value={String(settings.slot_duration_minutes)} onValueChange={(v) => onUpdate({ slot_duration_minutes: parseInt(v) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tampon Süre</Label>
            <Select value={String(settings.buffer_minutes)} onValueChange={(v) => onUpdate({ buffer_minutes: parseInt(v) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {BUFFER_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Saat Dilimi</Label>
            <Select value={settings.timezone} onValueChange={(v) => onUpdate({ timezone: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIMEZONES.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Maksimum İleri Gün</Label>
            <Input type="number" value={settings.max_advance_days} onChange={(e) => onUpdate({ max_advance_days: parseInt(e.target.value) || 30 })} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
