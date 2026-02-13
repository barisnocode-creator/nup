import React from 'react';
import { format, isToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import { StickyNote, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Appointment, BlockedSlot, DaySchedule, AgendaNote, FormField } from './types';
import { AppointmentCard } from './AppointmentCard';

interface DailyViewProps {
  currentDate: Date;
  appointments: Appointment[];
  blockedSlots: BlockedSlot[];
  daySchedules: Record<string, DaySchedule>;
  agendaNotes: AgendaNote[];
  formFields: FormField[];
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateInternalNote: (id: string, note: string) => void;
  onSlotClick: (date: Date, time: string) => void;
  onCreateNote: (date: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export function DailyView({
  currentDate, appointments, blockedSlots, daySchedules, agendaNotes, formFields,
  onUpdateStatus, onUpdateInternalNote, onSlotClick, onCreateNote, onDeleteNote,
}: DailyViewProps) {
  const [newNote, setNewNote] = React.useState('');
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const dayKey = String(currentDate.getDay());
  const ds = daySchedules[dayKey];

  const dayAppts = appointments.filter(a => a.appointment_date === dateStr);
  const dayNotes = agendaNotes.filter(n => n.note_date === dateStr);

  const isFullDayBlocked = blockedSlots.some(b => b.blocked_date === dateStr && (b.block_type === 'full_day' || b.block_type === 'vacation'));

  // Build time slots
  let minHour = 8, maxHour = 20;
  if (ds?.enabled && ds.start && ds.end) {
    minHour = parseInt(ds.start.split(':')[0]);
    maxHour = parseInt(ds.end.split(':')[0]);
  }
  const hours = Array.from({ length: maxHour - minHour }, (_, i) => minHour + i);

  const isSlotBlocked = (hour: number) => {
    if (!ds?.enabled || isFullDayBlocked) return true;
    const startH = parseInt(ds.start.split(':')[0]);
    const endH = parseInt(ds.end.split(':')[0]);
    if (hour < startH || hour >= endH) return true;
    for (const br of ds.breaks) {
      const brS = parseInt(br.start.split(':')[0]);
      const brE = parseInt(br.end.split(':')[0]);
      if (hour >= brS && hour < brE) return true;
    }
    return blockedSlots.some(b => {
      if (b.blocked_date !== dateStr || b.block_type !== 'time_range') return false;
      if (!b.block_start_time || !b.block_end_time) return false;
      const bS = parseInt(b.block_start_time.split(':')[0]);
      const bE = parseInt(b.block_end_time.split(':')[0]);
      return hour >= bS && hour < bE;
    });
  };

  const getApptForHour = (hour: number) =>
    dayAppts.filter(a => parseInt(a.start_time.split(':')[0]) === hour);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onCreateNote(dateStr, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold capitalize">{format(currentDate, 'd MMMM yyyy, EEEE', { locale: tr })}</h3>
        {isToday(currentDate) && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Bugün</span>}
        {isFullDayBlocked && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Kapalı</span>}
      </div>

      {/* Time slots */}
      <div className="border border-border rounded-lg overflow-hidden">
        {hours.map(hour => {
          const blocked = isSlotBlocked(hour);
          const appts = getApptForHour(hour);
          return (
            <div key={hour} className="flex border-b border-border last:border-b-0">
              <div className="w-16 flex-shrink-0 p-2 text-xs text-muted-foreground text-center bg-muted/50 border-r border-border">
                {String(hour).padStart(2, '0')}:00
              </div>
              <div
                onClick={() => !blocked && appts.length === 0 && onSlotClick(currentDate, `${String(hour).padStart(2, '0')}:00`)}
                className={`flex-1 min-h-[56px] p-1.5 ${
                  blocked ? 'bg-muted/30 cursor-not-allowed' : 'hover:bg-primary/5 cursor-pointer'
                }`}
                style={blocked ? { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, hsl(var(--muted)) 4px, hsl(var(--muted)) 5px)' } : undefined}
              >
                {appts.length > 0 ? (
                  <div className="space-y-1">
                    {appts.map(a => (
                      <AppointmentCard key={a.id} appointment={a} formFields={formFields} onUpdateStatus={onUpdateStatus} onUpdateInternalNote={onUpdateInternalNote} />
                    ))}
                  </div>
                ) : !blocked ? (
                  <div className="h-full flex items-center justify-center text-xs text-muted-foreground opacity-0 hover:opacity-100 transition-opacity">
                    <Plus className="w-3 h-3 mr-1" /> Randevu ekle
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Agenda notes for this day */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium flex items-center gap-1.5">
          <StickyNote className="w-4 h-4 text-amber-500" /> Günün Notları
        </h4>
        {dayNotes.map(note => (
          <div key={note.id} className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-200/50 text-sm">
            <span className="flex-1">{note.content}</span>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => onDeleteNote(note.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Not ekle..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
          />
          <Button size="sm" className="h-8" onClick={handleAddNote} disabled={!newNote.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
