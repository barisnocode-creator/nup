import React, { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import { StickyNote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      {/* Header */}
      <div className="grid grid-cols-7 bg-muted/50">
        {DAY_NAMES_SHORT.map((_, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-muted-foreground py-2.5 border-r border-border last:border-r-0 uppercase tracking-wider">
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
          const hasAppts = dayAppts.length > 0;

          const dayContent = (
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => onDayClick(day)}
              className={`min-h-[85px] p-2 border-r border-b border-border/50 last:border-r-0 cursor-pointer transition-all duration-150 ${
                !inMonth ? 'bg-muted/20 opacity-50' : blocked ? 'bg-muted/40' : 'hover:bg-primary/5'
              } ${today ? 'ring-2 ring-primary ring-inset bg-primary/[0.03]' : ''}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                  today ? 'bg-primary text-primary-foreground font-bold' : !inMonth ? 'text-muted-foreground/50' : ''
                }`}>
                  {format(day, 'd')}
                </span>
                {hasNoteOnDay && <StickyNote className="w-3 h-3 text-amber-500" />}
              </div>
              {blocked && <div className="text-[9px] text-muted-foreground bg-destructive/10 px-1.5 rounded-md mb-0.5 text-center">Kapalı</div>}
              <div className="space-y-0.5">
                {pending > 0 && <div className="text-[9px] px-1.5 rounded-md bg-amber-500/15 text-amber-700 font-medium">{pending} bekleyen</div>}
                {confirmed > 0 && <div className="text-[9px] px-1.5 rounded-md bg-emerald-500/15 text-emerald-700 font-medium">{confirmed} onaylı</div>}
                {cancelled > 0 && <div className="text-[9px] px-1.5 rounded-md bg-destructive/15 text-destructive font-medium">{cancelled} iptal</div>}
              </div>
            </motion.div>
          );

          // Hover popup for days with appointments
          if (hasAppts && inMonth) {
            return (
              <Popover key={i}>
                <PopoverTrigger asChild>{dayContent}</PopoverTrigger>
                <PopoverContent className="w-64 p-3" side="right" align="start" sideOffset={4}>
                  <div className="text-xs font-semibold mb-2 capitalize">{format(day, 'd MMMM, EEEE', { locale: tr })}</div>
                  <div className="space-y-1.5 max-h-48 overflow-auto">
                    {dayAppts.map(a => (
                      <div key={a.id} className={`flex items-center gap-2 text-xs p-1.5 rounded-lg ${
                        a.status === 'confirmed' ? 'bg-emerald-500/10' :
                        a.status === 'cancelled' ? 'bg-destructive/10 line-through opacity-60' :
                        'bg-amber-500/10'
                      }`}>
                        <span className="font-medium">{a.start_time}</span>
                        <span className="truncate">{a.client_name}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            );
          }

          return <React.Fragment key={i}>{dayContent}</React.Fragment>;
        })}
      </div>
    </div>
  );
}
