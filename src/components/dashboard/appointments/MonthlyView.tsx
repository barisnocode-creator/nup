import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { StickyNote } from 'lucide-react';
import type { Appointment, BlockedSlot, AgendaNote } from './types';
import { DAY_NAMES_SHORT } from './types';

interface MonthlyViewProps {
  currentDate: Date;
  appointments: Appointment[];
  blockedSlots: BlockedSlot[];
  agendaNotes: AgendaNote[];
  onDayClick: (date: Date) => void;
}

export function MonthlyView({ currentDate, appointments, blockedSlots, agendaNotes, onDayClick }: MonthlyViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(a => a.appointment_date === dateStr);
  };

  const isBlocked = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return blockedSlots.some(b => b.blocked_date === dateStr && b.block_type !== 'time_range');
  };

  const hasNote = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return agendaNotes.some(n => n.note_date === dateStr);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 bg-muted">
        {DAY_NAMES_SHORT.map((name, i) => (
          <div key={i} className="text-center text-xs font-medium text-muted-foreground py-2 border-r border-border last:border-r-0">
            {/* Reorder: Mon first */}
            {DAY_NAMES_SHORT[(i + 1) % 7]}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const dayAppts = getAppointmentsForDay(day);
          const blocked = isBlocked(day);
          const hasNoteOnDay = hasNote(day);
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);
          const pending = dayAppts.filter(a => a.status === 'pending').length;
          const confirmed = dayAppts.filter(a => a.status === 'confirmed').length;
          const cancelled = dayAppts.filter(a => a.status === 'cancelled').length;

          return (
            <div
              key={i}
              onClick={() => onDayClick(day)}
              className={`min-h-[80px] p-1.5 border-r border-b border-border last:border-r-0 cursor-pointer transition-colors hover:bg-muted/50 ${
                !inMonth ? 'bg-muted/30' : blocked ? 'bg-muted/60' : ''
              } ${today ? 'ring-2 ring-primary ring-inset' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${!inMonth ? 'text-muted-foreground/50' : today ? 'text-primary font-bold' : ''}`}>
                  {format(day, 'd')}
                </span>
                {hasNoteOnDay && <StickyNote className="w-3 h-3 text-amber-500" />}
              </div>
              {blocked && <div className="text-[10px] text-muted-foreground bg-destructive/10 px-1 rounded mb-0.5">Kapalı</div>}
              <div className="space-y-0.5">
                {pending > 0 && <div className="text-[10px] px-1 rounded bg-amber-500/15 text-amber-700">{pending} bekleyen</div>}
                {confirmed > 0 && <div className="text-[10px] px-1 rounded bg-emerald-500/15 text-emerald-700">{confirmed} onaylı</div>}
                {cancelled > 0 && <div className="text-[10px] px-1 rounded bg-destructive/15 text-destructive">{cancelled} iptal</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
