import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { format, isToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import { StickyNote, Plus, Trash2, CalendarOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  onReschedule?: (appointmentId: string, newDate: string, newStartTime: string, newEndTime: string) => void;
  slotDuration?: number;
}

export function DailyView({
  currentDate, appointments, blockedSlots, daySchedules, agendaNotes, formFields,
  onUpdateStatus, onUpdateInternalNote, onSlotClick, onCreateNote, onDeleteNote,
  onReschedule, slotDuration = 30,
}: DailyViewProps) {
  const [newNote, setNewNote] = React.useState('');
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const dayKey = String(currentDate.getDay());
  const ds = daySchedules[dayKey];

  const dayAppts = appointments.filter(a => a.appointment_date === dateStr);
  const dayNotes = agendaNotes.filter(n => n.note_date === dateStr);
  const isFullDayBlocked = blockedSlots.some(b => b.blocked_date === dateStr && (b.block_type === 'full_day' || b.block_type === 'vacation'));

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
      if (hour >= parseInt(br.start.split(':')[0]) && hour < parseInt(br.end.split(':')[0])) return true;
    }
    return blockedSlots.some(b => {
      if (b.blocked_date !== dateStr || b.block_type !== 'time_range' || !b.block_start_time || !b.block_end_time) return false;
      return hour >= parseInt(b.block_start_time.split(':')[0]) && hour < parseInt(b.block_end_time.split(':')[0]);
    });
  };

  const getApptForHour = (hour: number) => dayAppts.filter(a => parseInt(a.start_time.split(':')[0]) === hour);

  const calculateEndTime = (startTime: string, duration: number) => {
    const [h, m] = startTime.split(':').map(Number);
    const totalMin = h * 60 + m + duration;
    return `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReschedule) return;
    const destHour = parseInt(result.destination.droppableId.split('-')[1]);
    if (isSlotBlocked(destHour)) return;
    const appointmentId = result.draggableId;
    const newStartTime = `${String(destHour).padStart(2, '0')}:00`;
    const newEndTime = calculateEndTime(newStartTime, slotDuration);
    onReschedule(appointmentId, dateStr, newStartTime, newEndTime);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onCreateNote(dateStr, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold capitalize">{format(currentDate, 'd MMMM yyyy, EEEE', { locale: tr })}</h3>
        {isToday(currentDate) && (
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">Bugün</span>
        )}
        {isFullDayBlocked && (
          <span className="text-xs bg-destructive/10 text-destructive px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CalendarOff className="w-3 h-3" /> Kapalı
          </span>
        )}
      </div>

      {/* Time slots with drag & drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          {hours.map(hour => {
            const blocked = isSlotBlocked(hour);
            const appts = getApptForHour(hour);
            const droppableId = `daily-${hour}`;
            return (
              <Droppable key={droppableId} droppableId={droppableId}>
                {(provided, snapshot) => (
                  <div className="flex border-b border-border/50 last:border-b-0">
                    <div className="w-16 flex-shrink-0 p-2 text-[11px] text-muted-foreground text-right pr-3 bg-muted/30 border-r border-border">
                      {String(hour).padStart(2, '0')}:00
                    </div>
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      onClick={() => !blocked && appts.length === 0 && onSlotClick(currentDate, `${String(hour).padStart(2, '0')}:00`)}
                      className={`flex-1 min-h-[60px] p-1.5 transition-colors duration-150 ${
                        blocked ? 'bg-muted/20 cursor-not-allowed' :
                        snapshot.isDraggingOver ? 'bg-primary/10 ring-1 ring-primary/30 ring-inset' :
                        'hover:bg-primary/5 cursor-pointer'
                      }`}
                      style={blocked ? { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, hsl(var(--muted) / 0.4) 5px, hsl(var(--muted) / 0.4) 6px)' } : undefined}
                    >
                      {appts.length > 0 ? (
                        <div className="space-y-1.5">
                          {appts.map((a, idx) => (
                            <Draggable key={a.id} draggableId={a.id} index={idx}>
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  style={{
                                    ...dragProvided.draggableProps.style,
                                    opacity: dragSnapshot.isDragging ? 0.8 : 1,
                                  }}
                                >
                                  <AppointmentCard
                                    appointment={a}
                                    formFields={formFields}
                                    onUpdateStatus={onUpdateStatus}
                                    onUpdateInternalNote={onUpdateInternalNote}
                                    draggable
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      ) : !blocked ? (
                        <div className="h-full flex items-center justify-center text-xs text-muted-foreground opacity-0 hover:opacity-100 transition-opacity">
                          <Plus className="w-3 h-3 mr-1" /> Randevu ekle
                        </div>
                      ) : null}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* Agenda notes */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium flex items-center gap-1.5">
          <StickyNote className="w-4 h-4 text-amber-500" /> Günün Notları
        </h4>
        <AnimatePresence>
          {dayNotes.map(note => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-200/50 text-sm">
                <span className="flex-1">{note.content}</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive rounded-lg" onClick={() => onDeleteNote(note.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex gap-2">
          <Input
            placeholder="Not ekle..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="h-9 text-sm rounded-xl"
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
          />
          <Button size="sm" className="h-9 rounded-xl" onClick={handleAddNote} disabled={!newNote.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
