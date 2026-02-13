import React from 'react';
import { startOfWeek, addDays, format, isToday, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Appointment, BlockedSlot, DaySchedule } from './types';
import { AppointmentCard } from './AppointmentCard';
import type { FormField } from './types';

interface WeeklyViewProps {
  currentDate: Date;
  appointments: Appointment[];
  blockedSlots: BlockedSlot[];
  daySchedules: Record<string, DaySchedule>;
  formFields: FormField[];
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateInternalNote: (id: string, note: string) => void;
  onSlotClick: (date: Date, time: string) => void;
}

export function WeeklyView({ currentDate, appointments, blockedSlots, daySchedules, formFields, onUpdateStatus, onUpdateInternalNote, onSlotClick }: WeeklyViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Find working hours range
  let minHour = 8, maxHour = 20;
  Object.values(daySchedules).forEach(ds => {
    if (ds.enabled && ds.start) {
      const h = parseInt(ds.start.split(':')[0]);
      if (h < minHour) minHour = h;
    }
    if (ds.enabled && ds.end) {
      const h = parseInt(ds.end.split(':')[0]);
      if (h > maxHour) maxHour = h;
    }
  });
  const hours = Array.from({ length: maxHour - minHour }, (_, i) => minHour + i);

  const getApptsForDayHour = (day: Date, hour: number) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return appointments.filter(a => {
      if (a.appointment_date !== dateStr) return false;
      const startH = parseInt(a.start_time.split(':')[0]);
      return startH === hour;
    });
  };

  const isSlotBlocked = (day: Date, hour: number) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayKey = String(day.getDay());
    const ds = daySchedules[dayKey];
    if (!ds?.enabled) return true;

    // Check working hours
    const startH = parseInt(ds.start.split(':')[0]);
    const endH = parseInt(ds.end.split(':')[0]);
    if (hour < startH || hour >= endH) return true;

    // Check breaks
    for (const br of ds.breaks) {
      const brStartH = parseInt(br.start.split(':')[0]);
      const brEndH = parseInt(br.end.split(':')[0]);
      if (hour >= brStartH && hour < brEndH) return true;
    }

    // Check blocked slots
    return blockedSlots.some(b => {
      if (b.blocked_date !== dateStr) return false;
      if (b.block_type === 'full_day' || b.block_type === 'vacation') return true;
      if (b.block_type === 'time_range' && b.block_start_time && b.block_end_time) {
        const bStart = parseInt(b.block_start_time.split(':')[0]);
        const bEnd = parseInt(b.block_end_time.split(':')[0]);
        return hour >= bStart && hour < bEnd;
      }
      return false;
    });
  };

  return (
    <div className="border border-border rounded-lg overflow-auto">
      <div className="min-w-[700px]">
        {/* Header */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] bg-muted border-b border-border sticky top-0 z-10">
          <div className="p-2 text-xs text-muted-foreground text-center border-r border-border">Saat</div>
          {weekDays.map((day, i) => (
            <div key={i} className={`p-2 text-center border-r border-border last:border-r-0 ${isToday(day) ? 'bg-primary/5' : ''}`}>
              <div className="text-xs text-muted-foreground">{format(day, 'EEE', { locale: tr })}</div>
              <div className={`text-sm font-medium ${isToday(day) ? 'text-primary' : ''}`}>{format(day, 'd')}</div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border last:border-b-0">
            <div className="p-1.5 text-xs text-muted-foreground text-center border-r border-border flex items-start justify-center">
              {String(hour).padStart(2, '0')}:00
            </div>
            {weekDays.map((day, dayIdx) => {
              const blocked = isSlotBlocked(day, hour);
              const appts = getApptsForDayHour(day, hour);
              return (
                <div
                  key={dayIdx}
                  onClick={() => !blocked && appts.length === 0 && onSlotClick(day, `${String(hour).padStart(2, '0')}:00`)}
                  className={`min-h-[48px] p-0.5 border-r border-border last:border-r-0 ${
                    blocked ? 'bg-muted/40 cursor-not-allowed' : 'hover:bg-primary/5 cursor-pointer'
                  } ${isToday(day) ? 'bg-primary/[0.02]' : ''}`}
                  style={blocked ? { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, hsl(var(--muted)) 4px, hsl(var(--muted)) 5px)' } : undefined}
                >
                  {appts.map(a => (
                    <AppointmentCard key={a.id} appointment={a} formFields={formFields} onUpdateStatus={onUpdateStatus} onUpdateInternalNote={onUpdateInternalNote} compact />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
