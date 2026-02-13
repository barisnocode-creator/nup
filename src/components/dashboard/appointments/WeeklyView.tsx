import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { startOfWeek, addDays, format, isToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Appointment, BlockedSlot, DaySchedule, FormField } from './types';
import { AppointmentCard } from './AppointmentCard';

interface WeeklyViewProps {
  currentDate: Date;
  appointments: Appointment[];
  blockedSlots: BlockedSlot[];
  daySchedules: Record<string, DaySchedule>;
  formFields: FormField[];
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateInternalNote: (id: string, note: string) => void;
  onSlotClick: (date: Date, time: string) => void;
  onReschedule?: (appointmentId: string, newDate: string, newStartTime: string, newEndTime: string) => void;
  slotDuration?: number;
}

export function WeeklyView({ currentDate, appointments, blockedSlots, daySchedules, formFields, onUpdateStatus, onUpdateInternalNote, onSlotClick, onReschedule, slotDuration = 30 }: WeeklyViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  let minHour = 8, maxHour = 20;
  Object.values(daySchedules).forEach(ds => {
    if (ds.enabled && ds.start) { const h = parseInt(ds.start.split(':')[0]); if (h < minHour) minHour = h; }
    if (ds.enabled && ds.end) { const h = parseInt(ds.end.split(':')[0]); if (h > maxHour) maxHour = h; }
  });
  const hours = Array.from({ length: maxHour - minHour }, (_, i) => minHour + i);

  const getApptsForDayHour = (day: Date, hour: number) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return appointments.filter(a => a.appointment_date === dateStr && parseInt(a.start_time.split(':')[0]) === hour);
  };

  const isSlotBlocked = (day: Date, hour: number) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayKey = String(day.getDay());
    const ds = daySchedules[dayKey];
    if (!ds?.enabled) return true;
    const startH = parseInt(ds.start.split(':')[0]);
    const endH = parseInt(ds.end.split(':')[0]);
    if (hour < startH || hour >= endH) return true;
    for (const br of ds.breaks) {
      const brStartH = parseInt(br.start.split(':')[0]);
      const brEndH = parseInt(br.end.split(':')[0]);
      if (hour >= brStartH && hour < brEndH) return true;
    }
    return blockedSlots.some(b => {
      if (b.blocked_date !== dateStr) return false;
      if (b.block_type === 'full_day' || b.block_type === 'vacation') return true;
      if (b.block_type === 'time_range' && b.block_start_time && b.block_end_time) {
        return hour >= parseInt(b.block_start_time.split(':')[0]) && hour < parseInt(b.block_end_time.split(':')[0]);
      }
      return false;
    });
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [h, m] = startTime.split(':').map(Number);
    const totalMin = h * 60 + m + duration;
    return `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReschedule) return;
    const [destDayIdx, destHour] = result.destination.droppableId.split('-').map(Number);
    const destDay = weekDays[destDayIdx];
    if (isSlotBlocked(destDay, destHour)) return;

    const appointmentId = result.draggableId;
    const newDate = format(destDay, 'yyyy-MM-dd');
    const newStartTime = `${String(destHour).padStart(2, '0')}:00`;
    const newEndTime = calculateEndTime(newStartTime, slotDuration);
    onReschedule(appointmentId, newDate, newStartTime, newEndTime);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="border border-border rounded-xl overflow-auto bg-card">
        <div className="min-w-[700px]">
          {/* Header */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] bg-muted/50 border-b border-border sticky top-0 z-10">
            <div className="p-2 text-xs text-muted-foreground text-center border-r border-border font-medium">Saat</div>
            {weekDays.map((day, i) => (
              <div key={i} className={`p-2.5 text-center border-r border-border last:border-r-0 ${isToday(day) ? 'bg-primary/5' : ''}`}>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{format(day, 'EEE', { locale: tr })}</div>
                <div className={`text-sm font-semibold mt-0.5 ${isToday(day) ? 'w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto' : ''}`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/50 last:border-b-0">
              <div className="p-1.5 text-[11px] text-muted-foreground text-right pr-3 border-r border-border flex items-start justify-end pt-2">
                {String(hour).padStart(2, '0')}:00
              </div>
              {weekDays.map((day, dayIdx) => {
                const blocked = isSlotBlocked(day, hour);
                const appts = getApptsForDayHour(day, hour);
                const droppableId = `${dayIdx}-${hour}`;
                return (
                  <Droppable key={droppableId} droppableId={droppableId}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        onClick={() => !blocked && appts.length === 0 && onSlotClick(day, `${String(hour).padStart(2, '0')}:00`)}
                        className={`min-h-[52px] p-0.5 border-r border-border/50 last:border-r-0 transition-colors duration-150 ${
                          blocked ? 'bg-muted/30 cursor-not-allowed' :
                          snapshot.isDraggingOver ? 'bg-primary/10 ring-1 ring-primary/30 ring-inset' :
                          'hover:bg-primary/5 cursor-pointer'
                        } ${isToday(day) ? 'bg-primary/[0.02]' : ''}`}
                        style={blocked ? { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, hsl(var(--muted) / 0.5) 5px, hsl(var(--muted) / 0.5) 6px)' } : undefined}
                      >
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
                                  transform: dragSnapshot.isDragging
                                    ? `${dragProvided.draggableProps.style?.transform || ''} rotate(2deg)`
                                    : dragProvided.draggableProps.style?.transform,
                                }}
                              >
                                <AppointmentCard
                                  appointment={a}
                                  formFields={formFields}
                                  onUpdateStatus={onUpdateStatus}
                                  onUpdateInternalNote={onUpdateInternalNote}
                                  compact
                                  draggable
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
