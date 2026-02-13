import React from 'react';
import { format, isToday, isTomorrow, isThisWeek, addWeeks, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Calendar, CalendarPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import type { Appointment, FormField } from './types';
import { AppointmentCard } from './AppointmentCard';

interface AgendaViewProps {
  appointments: Appointment[];
  formFields: FormField[];
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateInternalNote: (id: string, note: string) => void;
}

interface GroupedAppointments {
  label: string;
  appointments: Appointment[];
}

export function AgendaView({ appointments, formFields, onUpdateStatus, onUpdateInternalNote }: AgendaViewProps) {
  const today = new Date();
  const grouped: GroupedAppointments[] = [];
  const todayAppts: Appointment[] = [];
  const tomorrowAppts: Appointment[] = [];
  const thisWeekAppts: Appointment[] = [];
  const nextWeekAppts: Appointment[] = [];
  const laterAppts: Appointment[] = [];
  const pastAppts: Appointment[] = [];

  const nextWeekStart = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
  const nextWeekEnd = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });

  appointments.forEach(appt => {
    const date = new Date(appt.appointment_date);
    if (date < today && !isToday(date)) pastAppts.push(appt);
    else if (isToday(date)) todayAppts.push(appt);
    else if (isTomorrow(date)) tomorrowAppts.push(appt);
    else if (isThisWeek(date, { weekStartsOn: 1 })) thisWeekAppts.push(appt);
    else if (isWithinInterval(date, { start: nextWeekStart, end: nextWeekEnd })) nextWeekAppts.push(appt);
    else laterAppts.push(appt);
  });

  if (todayAppts.length) grouped.push({ label: 'Bugün', appointments: todayAppts });
  if (tomorrowAppts.length) grouped.push({ label: 'Yarın', appointments: tomorrowAppts });
  if (thisWeekAppts.length) grouped.push({ label: 'Bu Hafta', appointments: thisWeekAppts });
  if (nextWeekAppts.length) grouped.push({ label: 'Gelecek Hafta', appointments: nextWeekAppts });
  if (laterAppts.length) grouped.push({ label: 'Daha Sonra', appointments: laterAppts });
  if (pastAppts.length) grouped.push({ label: 'Geçmiş', appointments: pastAppts });

  if (grouped.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <CalendarPlus className="w-14 h-14 mx-auto text-muted-foreground/40 mb-4" />
          </motion.div>
          <p className="text-muted-foreground font-medium">Henüz randevu yok</p>
          <p className="text-xs text-muted-foreground/60 mt-1">İlk randevunuzu oluşturmak için "Randevu" butonuna tıklayın</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map((group, groupIdx) => (
        <div key={group.label}>
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            {group.label}
            <span className="text-muted-foreground/50">({group.appointments.length})</span>
          </h3>
          <div className="space-y-2">
            {group.appointments.map((appt, idx) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (groupIdx * 0.05) + (idx * 0.04), duration: 0.3 }}
              >
                <AppointmentCard
                  appointment={appt}
                  formFields={formFields}
                  onUpdateStatus={onUpdateStatus}
                  onUpdateInternalNote={onUpdateInternalNote}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
