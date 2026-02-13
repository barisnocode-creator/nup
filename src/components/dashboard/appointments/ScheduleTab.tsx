import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Clock, Coffee, Check, Trash2 } from 'lucide-react';
import type { DaySchedule } from './types';
import { DAY_NAMES, DAY_KEYS } from './types';

interface ScheduleTabProps {
  daySchedules: Record<string, DaySchedule>;
  scheduleChanged: boolean;
  onUpdateSchedule: (dayKey: string, field: string, value: any) => void;
  onAddBreak: (dayKey: string) => void;
  onRemoveBreak: (dayKey: string, idx: number) => void;
  onUpdateBreak: (dayKey: string, idx: number, field: 'start' | 'end', value: string) => void;
  onSave: () => void;
}

export function ScheduleTab({
  daySchedules, scheduleChanged, onUpdateSchedule, onAddBreak, onRemoveBreak, onUpdateBreak, onSave,
}: ScheduleTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" /> Haftalık Program
          </CardTitle>
          {scheduleChanged && (
            <Button onClick={onSave} size="sm">
              <Check className="w-4 h-4 mr-1" /> Kaydet
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {DAY_KEYS.map((dayKey) => {
          const ds = daySchedules[dayKey];
          if (!ds) return null;
          const dayIdx = parseInt(dayKey);
          return (
            <div key={dayKey} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch checked={ds.enabled} onCheckedChange={(v) => onUpdateSchedule(dayKey, 'enabled', v)} />
                  <span className={`font-medium ${!ds.enabled ? 'text-muted-foreground' : ''}`}>{DAY_NAMES[dayIdx]}</span>
                </div>
                {ds.enabled && (
                  <Button variant="ghost" size="sm" onClick={() => onAddBreak(dayKey)} className="text-muted-foreground">
                    <Coffee className="w-4 h-4 mr-1" /> Mola Ekle
                  </Button>
                )}
              </div>
              {ds.enabled && (
                <>
                  <div className="flex items-center gap-2 pl-12">
                    <Input type="time" value={ds.start} className="w-32" onChange={(e) => onUpdateSchedule(dayKey, 'start', e.target.value)} />
                    <span className="text-muted-foreground">—</span>
                    <Input type="time" value={ds.end} className="w-32" onChange={(e) => onUpdateSchedule(dayKey, 'end', e.target.value)} />
                  </div>
                  {ds.breaks.length > 0 && (
                    <div className="pl-12 space-y-2">
                      {ds.breaks.map((br, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-muted-foreground" />
                          <Input type="time" value={br.start} className="w-32" onChange={(e) => onUpdateBreak(dayKey, idx, 'start', e.target.value)} />
                          <span className="text-muted-foreground">—</span>
                          <Input type="time" value={br.end} className="w-32" onChange={(e) => onUpdateBreak(dayKey, idx, 'end', e.target.value)} />
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onRemoveBreak(dayKey, idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
