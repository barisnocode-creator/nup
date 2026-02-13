import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Check, TrendingUp, TrendingDown } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';

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
import { NotificationsTab } from './NotificationsTab';
import type { CalendarView, StatusFilter, DaySchedule, FormField } from './types';
import { DAY_KEYS } from './types';

interface AppointmentsPanelProps {
  projectId: string;
}

const overviewCards = [
  { key: 'pending', label: 'Bekleyen', icon: Clock, gradient: 'from-amber-500/20 to-orange-500/10', iconColor: 'text-amber-500', borderColor: 'border-amber-200/50' },
  { key: 'confirmed', label: 'Onaylanan', icon: Check, gradient: 'from-emerald-500/20 to-green-500/10', iconColor: 'text-emerald-500', borderColor: 'border-emerald-200/50' },
  { key: 'total', label: 'Toplam', icon: Calendar, gradient: 'from-primary/20 to-primary/5', iconColor: 'text-primary', borderColor: 'border-primary/20' },
];

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

  const filteredAppointments = useMemo(() => {
    let appts = data.appointments;
    if (statusFilter !== 'all') appts = appts.filter(a => a.status === statusFilter);
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
  const totalCount = data.appointments.length;

  // Trend: compare last 7 days vs previous 7 days
  const sevenDaysAgo = subDays(new Date(), 7);
  const fourteenDaysAgo = subDays(new Date(), 14);
  const recentCount = data.appointments.filter(a => isAfter(new Date(a.created_at), sevenDaysAgo)).length;
  const prevCount = data.appointments.filter(a => {
    const d = new Date(a.created_at);
    return isAfter(d, fourteenDaysAgo) && !isAfter(d, sevenDaysAgo);
  }).length;
  const trendUp = recentCount >= prevCount;

  const counts = { pending: pendingCount, confirmed: confirmedCount, total: totalCount };

  const handleDayClick = (date: Date) => { setCurrentDate(date); setCalendarView('daily'); };
  const handleSlotClick = (date: Date, time: string) => { setCreateModalDate(date); setCreateModalTime(time); setCreateModalOpen(true); };
  const handleCreateClick = () => { setCreateModalDate(currentDate); setCreateModalTime(undefined); setCreateModalOpen(true); };
  const handleScheduleClick = () => setActiveTab('schedule');

  const handleReschedule = async (appointmentId: string, newDate: string, newStartTime: string, newEndTime: string) => {
    const headers = await data.getHeaders();
    if (!headers) return;
    const res = await fetch(data.baseUrl, {
      method: 'PATCH', headers, body: JSON.stringify({ appointment_id: appointmentId, appointment_date: newDate, start_time: newStartTime, end_time: newEndTime }),
    });
    if (res.ok) {
      data.fetchData();
    }
  };

  // Schedule management
  const updateDaySchedule = (dayKey: string, field: string, value: any) => {
    data.setDaySchedules((prev: Record<string, DaySchedule>) => ({ ...prev, [dayKey]: { ...prev[dayKey], [field]: value } }));
    setScheduleChanged(true);
  };
  const addBreak = (dayKey: string) => {
    data.setDaySchedules((prev: Record<string, DaySchedule>) => ({ ...prev, [dayKey]: { ...prev[dayKey], breaks: [...prev[dayKey].breaks, { start: '12:00', end: '13:00' }] } }));
    setScheduleChanged(true);
  };
  const removeBreak = (dayKey: string, idx: number) => {
    data.setDaySchedules((prev: Record<string, DaySchedule>) => ({ ...prev, [dayKey]: { ...prev[dayKey], breaks: prev[dayKey].breaks.filter((_: any, i: number) => i !== idx) } }));
    setScheduleChanged(true);
  };
  const updateBreak = (dayKey: string, idx: number, field: 'start' | 'end', value: string) => {
    data.setDaySchedules((prev: Record<string, DaySchedule>) => ({ ...prev, [dayKey]: { ...prev[dayKey], breaks: prev[dayKey].breaks.map((b: any, i: number) => i === idx ? { ...b, [field]: value } : b) } }));
    setScheduleChanged(true);
  };
  const saveDaySchedules = async () => {
    const workingDays = DAY_KEYS.filter(k => data.daySchedules[k]?.enabled).map(Number);
    await data.updateSettings({ day_schedules: data.daySchedules as any, working_days: workingDays });
    setScheduleChanged(false);
  };
  const saveFormFields = async (fields: FormField[], consentText: string, consentRequired: boolean) => {
    await data.updateSettings({ form_fields: fields as any, consent_text: consentText || null, consent_required: consentRequired } as any);
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
      {/* Overview Cards with glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {overviewCards.map((card, i) => {
          const Icon = card.icon;
          const count = counts[card.key as keyof typeof counts];
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className={`border ${card.borderColor} bg-gradient-to-br ${card.gradient} backdrop-blur-sm overflow-hidden relative`}>
                <CardContent className="pt-6 pb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-background/80 flex items-center justify-center shadow-sm">
                        <Icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                        <p className="text-2xl font-bold tracking-tight">{count}</p>
                      </div>
                    </div>
                    {card.key === 'total' && (
                      <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-destructive'}`}>
                        {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{recentCount}</span>
                        <span className="text-muted-foreground">/ 7g</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="calendar">Takvim</TabsTrigger>
          <TabsTrigger value="form-fields">Form Alanları</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          <TabsTrigger value="schedule">Haftalık Program</TabsTrigger>
          <TabsTrigger value="blocked">Kapalı Günler</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4 mt-4">
          <CalendarToolbar
            view={calendarView} onViewChange={setCalendarView}
            currentDate={currentDate} onDateChange={setCurrentDate}
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
            statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
            onCreateClick={handleCreateClick} onScheduleClick={handleScheduleClick}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={calendarView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {calendarView === 'monthly' && (
                <MonthlyView currentDate={currentDate} appointments={filteredAppointments} blockedSlots={data.blockedSlots} agendaNotes={data.agendaNotes} onDayClick={handleDayClick} />
              )}
              {calendarView === 'weekly' && (
                <WeeklyView currentDate={currentDate} appointments={filteredAppointments} blockedSlots={data.blockedSlots} daySchedules={data.daySchedules} formFields={formFields} onUpdateStatus={data.updateStatus} onUpdateInternalNote={data.updateInternalNote} onSlotClick={handleSlotClick} onReschedule={handleReschedule} slotDuration={data.settings?.slot_duration_minutes || 30} />
              )}
              {calendarView === 'daily' && (
                <DailyView currentDate={currentDate} appointments={filteredAppointments} blockedSlots={data.blockedSlots} daySchedules={data.daySchedules} agendaNotes={data.agendaNotes} formFields={formFields} onUpdateStatus={data.updateStatus} onUpdateInternalNote={data.updateInternalNote} onSlotClick={handleSlotClick} onCreateNote={data.createNote} onDeleteNote={data.deleteNote} onReschedule={handleReschedule} slotDuration={data.settings?.slot_duration_minutes || 30} />
              )}
              {calendarView === 'agenda' && (
                <AgendaView appointments={filteredAppointments} formFields={formFields} onUpdateStatus={data.updateStatus} onUpdateInternalNote={data.updateInternalNote} />
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="form-fields" className="mt-4">
          <FormFieldsTab formFields={formFields} consentText={data.settings?.consent_text || ''} consentRequired={data.settings?.consent_required ?? true} onSave={saveFormFields} />
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          {data.settings && <SettingsTab settings={data.settings} onUpdate={data.updateSettings} />}
        </TabsContent>
        <TabsContent value="schedule" className="mt-4">
          <ScheduleTab daySchedules={data.daySchedules} scheduleChanged={scheduleChanged} onUpdateSchedule={updateDaySchedule} onAddBreak={addBreak} onRemoveBreak={removeBreak} onUpdateBreak={updateBreak} onSave={saveDaySchedules} />
        </TabsContent>
        <TabsContent value="blocked" className="mt-4">
          <BlockedDatesTab blockedSlots={data.blockedSlots} onBlockDate={data.blockDate} onUnblockDate={data.unblockDate} />
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <NotificationsTab projectId={projectId} settings={data.settings as any} onUpdateSettings={data.updateSettings} />
        </TabsContent>
      </Tabs>

      <CreateAppointmentModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} onSubmit={data.createAppointment} initialDate={createModalDate} initialTime={createModalTime} slotDuration={data.settings?.slot_duration_minutes || 30} />
    </div>
  );
}
