import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';

import { useAppointmentsData } from './useAppointmentsData';
import { CalendarToolbar } from './CalendarToolbar';
import { MonthlyView } from './MonthlyView';
import { WeeklyView } from './WeeklyView';
import { DailyView } from './DailyView';
import { AgendaView } from './AgendaView';
import { CreateAppointmentModal } from './CreateAppointmentModal';
import { SettingsTab } from './SettingsTab';
import { ScheduleTab } from './ScheduleTab';
import { BlockedDatesTab } from './BlockedDatesTab';
import { FormFieldsTab } from './FormFieldsTab';
import type { CalendarView, StatusFilter, DaySchedule, FormField } from './types';
import { DAY_KEYS } from './types';

interface AppointmentsPanelProps {
  projectId: string;
}

export function AppointmentsPanel({ projectId }: AppointmentsPanelProps) {
  const data = useAppointmentsData(projectId);
  const [activeTab, setActiveTab] = useState('calendar');
  const [calendarView, setCalendarView] = useState<CalendarView>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createModalDate, setCreateModalDate] = useState<Date | undefined>();
  const [createModalTime, setCreateModalTime] = useState<string | undefined>();
  const [scheduleChanged, setScheduleChanged] = useState(false);

  const formFields = useMemo(() => {
    if (!data.settings?.form_fields) return [];
    return [...(data.settings.form_fields as FormField[])].sort((a, b) => a.order - b.order);
  }, [data.settings?.form_fields]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    let appts = data.appointments;
    if (statusFilter !== 'all') {
      appts = appts.filter(a => a.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      appts = appts.filter(a =>
        a.client_name.toLowerCase().includes(q) ||
        a.client_email.toLowerCase().includes(q) ||
        (a.client_phone && a.client_phone.includes(q))
      );
    }
    return appts;
  }, [data.appointments, statusFilter, searchQuery]);

  const pendingCount = data.appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = data.appointments.filter(a => a.status === 'confirmed').length;

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setCalendarView('daily');
  };

  const handleSlotClick = (date: Date, time: string) => {
    setCreateModalDate(date);
    setCreateModalTime(time);
    setCreateModalOpen(true);
  };

  const handleCreateClick = () => {
    setCreateModalDate(currentDate);
    setCreateModalTime(undefined);
    setCreateModalOpen(true);
  };

  const handleScheduleClick = () => {
    setActiveTab('schedule');
  };

  // Schedule management
  const updateDaySchedule = (dayKey: string, field: string, value: any) => {
    data.setDaySchedules((prev: Record<string, DaySchedule>) => ({ ...prev, [dayKey]: { ...prev[dayKey], [field]: value } }));
    setScheduleChanged(true);
  };

  const addBreak = (dayKey: string) => {
    data.setDaySchedules((prev: Record<string, DaySchedule>) => ({
      ...prev, [dayKey]: { ...prev[dayKey], breaks: [...prev[dayKey].breaks, { start: '12:00', end: '13:00' }] },
    }));
    setScheduleChanged(true);
  };

  const removeBreak = (dayKey: string, idx: number) => {
    data.setDaySchedules((prev: Record<string, DaySchedule>) => ({
      ...prev, [dayKey]: { ...prev[dayKey], breaks: prev[dayKey].breaks.filter((_: any, i: number) => i !== idx) },
    }));
    setScheduleChanged(true);
  };

  const updateBreak = (dayKey: string, idx: number, field: 'start' | 'end', value: string) => {
    data.setDaySchedules((prev: Record<string, DaySchedule>) => ({
      ...prev, [dayKey]: { ...prev[dayKey], breaks: prev[dayKey].breaks.map((b: any, i: number) => i === idx ? { ...b, [field]: value } : b) },
    }));
    setScheduleChanged(true);
  };

  const saveDaySchedules = async () => {
    const workingDays = DAY_KEYS.filter(k => data.daySchedules[k]?.enabled).map(Number);
    await data.updateSettings({ day_schedules: data.daySchedules as any, working_days: workingDays });
    setScheduleChanged(false);
  };

  const saveFormFields = async (fields: FormField[], consentText: string, consentRequired: boolean) => {
    await data.updateSettings({
      form_fields: fields as any,
      consent_text: consentText || null,
      consent_required: consentRequired,
    } as any);
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bekleyen</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Onaylanan</p>
                <p className="text-2xl font-bold">{confirmedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam</p>
                <p className="text-2xl font-bold">{data.appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="calendar">Takvim</TabsTrigger>
          <TabsTrigger value="form-fields">Form Alanları</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          <TabsTrigger value="schedule">Haftalık Program</TabsTrigger>
          <TabsTrigger value="blocked">Kapalı Günler</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4 mt-4">
          <CalendarToolbar
            view={calendarView}
            onViewChange={setCalendarView}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onCreateClick={handleCreateClick}
            onScheduleClick={handleScheduleClick}
          />

          {calendarView === 'monthly' && (
            <MonthlyView
              currentDate={currentDate}
              appointments={filteredAppointments}
              blockedSlots={data.blockedSlots}
              agendaNotes={data.agendaNotes}
              onDayClick={handleDayClick}
            />
          )}

          {calendarView === 'weekly' && (
            <WeeklyView
              currentDate={currentDate}
              appointments={filteredAppointments}
              blockedSlots={data.blockedSlots}
              daySchedules={data.daySchedules}
              formFields={formFields}
              onUpdateStatus={data.updateStatus}
              onUpdateInternalNote={data.updateInternalNote}
              onSlotClick={handleSlotClick}
            />
          )}

          {calendarView === 'daily' && (
            <DailyView
              currentDate={currentDate}
              appointments={filteredAppointments}
              blockedSlots={data.blockedSlots}
              daySchedules={data.daySchedules}
              agendaNotes={data.agendaNotes}
              formFields={formFields}
              onUpdateStatus={data.updateStatus}
              onUpdateInternalNote={data.updateInternalNote}
              onSlotClick={handleSlotClick}
              onCreateNote={data.createNote}
              onDeleteNote={data.deleteNote}
            />
          )}

          {calendarView === 'agenda' && (
            <AgendaView
              appointments={filteredAppointments}
              formFields={formFields}
              onUpdateStatus={data.updateStatus}
              onUpdateInternalNote={data.updateInternalNote}
            />
          )}
        </TabsContent>

        <TabsContent value="form-fields" className="mt-4">
          <FormFieldsTab
            formFields={formFields}
            consentText={data.settings?.consent_text || ''}
            consentRequired={data.settings?.consent_required ?? true}
            onSave={saveFormFields}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          {data.settings && <SettingsTab settings={data.settings} onUpdate={data.updateSettings} />}
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <ScheduleTab
            daySchedules={data.daySchedules}
            scheduleChanged={scheduleChanged}
            onUpdateSchedule={updateDaySchedule}
            onAddBreak={addBreak}
            onRemoveBreak={removeBreak}
            onUpdateBreak={updateBreak}
            onSave={saveDaySchedules}
          />
        </TabsContent>

        <TabsContent value="blocked" className="mt-4">
          <BlockedDatesTab
            blockedSlots={data.blockedSlots}
            onBlockDate={data.blockDate}
            onUnblockDate={data.unblockDate}
          />
        </TabsContent>
      </Tabs>

      <CreateAppointmentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={data.createAppointment}
        initialDate={createModalDate}
        initialTime={createModalTime}
        slotDuration={data.settings?.slot_duration_minutes || 30}
      />
    </div>
  );
}
