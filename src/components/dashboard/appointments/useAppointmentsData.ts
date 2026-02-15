import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Appointment, AppointmentSettings, BlockedSlot, AgendaNote, DaySchedule } from './types';
import { getDefaultDaySchedules, DAY_KEYS } from './types';

export function useAppointmentsData(projectId: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState<AppointmentSettings | null>(null);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [agendaNotes, setAgendaNotes] = useState<AgendaNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [daySchedules, setDaySchedules] = useState<Record<string, DaySchedule>>(getDefaultDaySchedules());

  const fetchData = useCallback(async (dateFrom?: string, dateTo?: string) => {
    try {
      // Fetch appointments
      let apptQuery = supabase
        .from('appointments')
        .select('*')
        .eq('project_id', projectId)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });
      if (dateFrom) apptQuery = apptQuery.gte('appointment_date', dateFrom);
      if (dateTo) apptQuery = apptQuery.lte('appointment_date', dateTo);

      // Fetch settings
      const settingsQuery = supabase
        .from('appointment_settings')
        .select('*')
        .eq('project_id', projectId)
        .single();

      // Fetch blocked slots
      const blockedQuery = supabase
        .from('blocked_slots')
        .select('*')
        .eq('project_id', projectId)
        .order('blocked_date', { ascending: true });

      // Fetch agenda notes
      let notesQuery = supabase
        .from('agenda_notes')
        .select('*')
        .eq('project_id', projectId)
        .order('note_date', { ascending: true });
      if (dateFrom) notesQuery = notesQuery.gte('note_date', dateFrom);
      if (dateTo) notesQuery = notesQuery.lte('note_date', dateTo);

      const [apptRes, settingsRes, blockedRes, notesRes] = await Promise.all([
        apptQuery, settingsQuery, blockedQuery, notesQuery,
      ]);

      setAppointments((apptRes.data as Appointment[]) || []);
      const s = settingsRes.data;
      setSettings(s as unknown as AppointmentSettings | null);
      if (s?.day_schedules) {
        setDaySchedules(s.day_schedules as unknown as Record<string, DaySchedule>);
      } else if (s) {
        const ds = getDefaultDaySchedules();
        const wd = (s.working_days as unknown as number[]) || [];
        for (let i = 0; i <= 6; i++) {
          ds[String(i)].enabled = wd.includes(i);
          ds[String(i)].start = s.working_hours_start;
          ds[String(i)].end = s.working_hours_end;
          ds[String(i)].breaks = s.lunch_break_start && s.lunch_break_end
            ? [{ start: s.lunch_break_start, end: s.lunch_break_end }] : [];
        }
        setDaySchedules(ds);
      }
      setBlockedSlots((blockedRes.data as BlockedSlot[]) || []);
      setAgendaNotes((notesRes.data as AgendaNote[]) || []);
    } catch (err) {
      console.error('fetchData error:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (appointmentId: string, status: string) => {
    if (!['confirmed', 'cancelled', 'pending'].includes(status)) {
      toast({ title: 'Geçersiz durum', variant: 'destructive' });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .eq('project_id', projectId)
        .select()
        .single();

      if (error) {
        console.error('updateStatus error:', error);
        toast({ title: 'Durum güncellenemedi', description: error.message, variant: 'destructive' });
        return;
      }

      toast({ title: status === 'confirmed' ? 'Randevu onaylandı ✓' : status === 'cancelled' ? 'Randevu iptal edildi' : 'Durum güncellendi' });

      // Trigger notification via edge function (fire and forget)
      if (status === 'confirmed' || status === 'cancelled') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && data) {
          fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              project_id: projectId,
              appointment_id: data.id,
              event_type: status,
              appointment_data: {
                client_name: data.client_name,
                client_email: data.client_email,
                client_phone: data.client_phone,
                date: data.appointment_date,
                start_time: data.start_time,
                end_time: data.end_time,
                status: data.status,
              },
            }),
          }).catch(e => console.warn('Notification trigger failed:', e));
        }
      }

      await fetchData();
    } catch (err) {
      console.error('updateStatus network error:', err);
      toast({ title: 'Bağlantı hatası', description: 'Sunucuya ulaşılamadı.', variant: 'destructive' });
    }
  };

  const updateInternalNote = async (appointmentId: string, internal_note: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ internal_note })
      .eq('id', appointmentId)
      .eq('project_id', projectId);

    if (error) {
      toast({ title: 'Not güncellenemedi', variant: 'destructive' });
      return;
    }
    toast({ title: 'Not güncellendi' });
    fetchData();
  };

  const updateSettings = async (updates: Partial<AppointmentSettings>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('appointment_settings')
      .update(updates as any)
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      toast({ title: 'Ayarlar güncellenemedi', variant: 'destructive' });
      return;
    }
    setSettings(data as unknown as AppointmentSettings);
    toast({ title: 'Ayarlar güncellendi' });
  };

  const blockDate = async (body: Record<string, any>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const insertData: Record<string, unknown> = {
      project_id: projectId,
      user_id: user.id,
      blocked_date: body.blocked_date,
      reason: body.reason || null,
      block_type: body.block_type || 'full_day',
    };

    if ((body.block_type || 'full_day') === 'time_range') {
      insertData.block_start_time = body.block_start_time;
      insertData.block_end_time = body.block_end_time;
    }

    const { error } = await supabase.from('blocked_slots').insert(insertData as any);
    if (error) {
      toast({ title: 'Tarih kapatılamadı', variant: 'destructive' });
      return;
    }
    toast({ title: 'Tarih kapatıldı' });
    fetchData();
  };

  const unblockDate = async (blockId: string) => {
    await supabase.from('blocked_slots').delete().eq('id', blockId).eq('project_id', projectId);
    toast({ title: 'Blok kaldırıldı' });
    fetchData();
  };

  const createAppointment = async (body: Record<string, any>) => {
    const { appointment_date, start_time, end_time, client_name, client_email, client_phone, client_note, status: apptStatus, internal_note } = body;
    if (!appointment_date || !start_time || !end_time || !client_name || !client_email) {
      toast({ title: 'Eksik bilgi', description: 'Gerekli alanları doldurun.', variant: 'destructive' });
      return false;
    }

    const { error } = await supabase.from('appointments').insert({
      project_id: projectId,
      appointment_date,
      start_time,
      end_time,
      client_name,
      client_email,
      client_phone: client_phone || null,
      client_note: client_note || null,
      internal_note: internal_note || null,
      status: apptStatus || 'confirmed',
      consent_given: true,
    });

    if (error) {
      toast({ title: 'Randevu oluşturulamadı', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Randevu oluşturuldu' });
    fetchData();
    return true;
  };

  const createNote = async (note_date: string, content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('agenda_notes').insert({
      project_id: projectId, user_id: user.id, note_date, content,
    });
    if (error) {
      toast({ title: 'Not eklenemedi', variant: 'destructive' });
      return;
    }
    toast({ title: 'Not eklendi' });
    fetchData();
  };

  const updateNote = async (note_id: string, content: string) => {
    const { error } = await supabase.from('agenda_notes').update({ content }).eq('id', note_id).eq('project_id', projectId);
    if (error) {
      toast({ title: 'Not güncellenemedi', variant: 'destructive' });
      return;
    }
    toast({ title: 'Not güncellendi' });
    fetchData();
  };

  const deleteNote = async (note_id: string) => {
    await supabase.from('agenda_notes').delete().eq('id', note_id).eq('project_id', projectId);
    toast({ title: 'Not silindi' });
    fetchData();
  };

  // Keep getHeaders and baseUrl for backward compatibility (reschedule etc.)
  const getHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    return { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' };
  };
  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-appointments?project_id=${projectId}`;

  return {
    appointments, settings, blockedSlots, agendaNotes, loading,
    daySchedules, setDaySchedules,
    fetchData, updateStatus, updateInternalNote, updateSettings,
    blockDate, unblockDate, createAppointment,
    createNote, updateNote, deleteNote,
    getHeaders, baseUrl,
  };
}
