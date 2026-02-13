import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AppointmentsPanel } from '@/components/dashboard/appointments/AppointmentsPanel';
import { CalendarCheck } from 'lucide-react';

export default function Appointments() {
  const { id } = useParams<{ id: string }>();

  return (
    <DashboardLayout activeProjectId={id}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Randevular</h1>
        </div>
        {id ? (
          <AppointmentsPanel projectId={id} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <CalendarCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Henüz bir web siteniz yok</p>
            <p className="text-sm mt-1">Randevuları yönetmek için önce bir web sitesi oluşturun.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
