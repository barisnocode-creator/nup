import React from 'react';
import { format, isToday, isTomorrow, isThisWeek, addWeeks, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
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
    if (date < today && !isToday(date)) { pastAppts.push(appt); }
    else if (isToday(date)) { todayAppts.push(appt); }
    else if (isTomorrow(date)) { tomorrowAppts.push(appt); }
    else if (isThisWeek(date, { weekStartsOn: 1 })) { thisWeekAppts.push(appt); }
    else if (isWithinInterval(date, { start: nextWeekStart, end: nextWeekEnd })) { nextWeekAppts.push(appt); }
    else { laterAppts.push(appt); }
  });

  if (todayAppts.length) grouped.push({ label: 'Bugün', appointments: todayAppts });
  if (tomorrowAppts.length) grouped.push({ label: 'Yarın', appointments: tomorrowAppts });
  if (thisWeekAppts.length) grouped.push({ label: 'Bu Hafta', appointments: thisWeekAppts });
  if (nextWeekAppts.length) grouped.push({ label: 'Gelecek Hafta', appointments: nextWeekAppts });
  if (laterAppts.length) grouped.push({ label: 'Daha Sonra', appointments: laterAppts });
  if (pastAppts.length) grouped.push({ label: 'Geçmiş', appointments: pastAppts });

  if (grouped.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Randevu bulunamadı</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(group => (
        <div key={group.label}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{group.label}</h3>
          <div className="space-y-2">
            {group.appointments.map(appt => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                formFields={formFields}
                onUpdateStatus={onUpdateStatus}
                onUpdateInternalNote={onUpdateInternalNote}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
