import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AppointmentsPanel } from '@/components/dashboard/AppointmentsPanel';
import { CalendarCheck } from 'lucide-react';

export default function Appointments() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/dashboard');
    return null;
  }

  return (
    <DashboardLayout activeProjectId={id}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Randevular</h1>
        </div>
        <AppointmentsPanel projectId={id} />
      </div>
    </DashboardLayout>
  );
}
