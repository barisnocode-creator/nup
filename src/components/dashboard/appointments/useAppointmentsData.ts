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

  const getHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    return { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' };
  };

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-appointments?project_id=${projectId}`;

  const fetchData = useCallback(async (dateFrom?: string, dateTo?: string) => {
    const headers = await getHeaders();
    if (!headers) return;

    const apptUrl = dateFrom && dateTo
      ? `${baseUrl}&date_from=${dateFrom}&date_to=${dateTo}`
      : baseUrl;

    const [apptRes, settingsRes, blockedRes, notesRes] = await Promise.all([
      fetch(apptUrl, { headers }),
      fetch(`${baseUrl}&type=settings`, { headers }),
      fetch(`${baseUrl}&type=blocked`, { headers }),
      fetch(`${baseUrl}&type=notes${dateFrom ? `&date_from=${dateFrom}` : ''}${dateTo ? `&date_to=${dateTo}` : ''}`, { headers }),
    ]);

    const [apptData, settingsData, blockedData, notesData] = await Promise.all([
      apptRes.json(), settingsRes.json(), blockedRes.json(), notesRes.json(),
    ]);

    setAppointments(apptData.appointments || []);
    const s = settingsData.settings;
    setSettings(s || null);
    if (s?.day_schedules) {
      setDaySchedules(s.day_schedules as Record<string, DaySchedule>);
    } else if (s) {
      const ds = getDefaultDaySchedules();
      const wd = (s.working_days as number[]) || [];
      for (let i = 0; i <= 6; i++) {
        ds[String(i)].enabled = wd.includes(i);
        ds[String(i)].start = s.working_hours_start;
        ds[String(i)].end = s.working_hours_end;
        ds[String(i)].breaks = s.lunch_break_start && s.lunch_break_end
          ? [{ start: s.lunch_break_start, end: s.lunch_break_end }] : [];
      }
      setDaySchedules(ds);
    }
    setBlockedSlots(blockedData.blocked_slots || []);
    setAgendaNotes(notesData.notes || []);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (appointmentId: string, status: string) => {
    const headers = await getHeaders();
    if (!headers) {
      toast({ title: 'Oturum süresi dolmuş', description: 'Lütfen sayfayı yenileyip tekrar giriş yapın.', variant: 'destructive' });
      return;
    }
    try {
      const res = await fetch(baseUrl, {
        method: 'PATCH', headers, body: JSON.stringify({ appointment_id: appointmentId, status }),
      });
      if (res.ok) {
        toast({ title: status === 'confirmed' ? 'Randevu onaylandı ✓' : status === 'cancelled' ? 'Randevu iptal edildi' : 'Durum güncellendi' });
        await fetchData();
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error('updateStatus error:', res.status, errData);
        toast({ title: 'Durum güncellenemedi', description: errData.error || `Hata kodu: ${res.status}`, variant: 'destructive' });
      }
    } catch (err) {
      console.error('updateStatus network error:', err);
      toast({ title: 'Bağlantı hatası', description: 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.', variant: 'destructive' });
    }
  };

  const updateInternalNote = async (appointmentId: string, internal_note: string) => {
    const headers = await getHeaders();
    if (!headers) return;
    const res = await fetch(baseUrl, {
      method: 'PATCH', headers, body: JSON.stringify({ appointment_id: appointmentId, internal_note }),
    });
    if (res.ok) {
      toast({ title: 'Not güncellendi' });
      fetchData();
    }
  };

  const updateSettings = async (updates: Partial<AppointmentSettings>) => {
    const headers = await getHeaders();
    if (!headers) return;
    const res = await fetch(baseUrl, { method: 'PUT', headers, body: JSON.stringify(updates) });
    if (res.ok) {
      const data = await res.json();
      setSettings(data.settings);
      toast({ title: 'Ayarlar güncellendi' });
    }
  };

  const blockDate = async (body: Record<string, any>) => {
    const headers = await getHeaders();
    if (!headers) return;
    const res = await fetch(baseUrl, { method: 'POST', headers, body: JSON.stringify(body) });
    if (res.ok) {
      toast({ title: 'Tarih kapatıldı' });
      fetchData();
    }
  };

  const unblockDate = async (blockId: string) => {
    const headers = await getHeaders();
    if (!headers) return;
    await fetch(`${baseUrl}&block_id=${blockId}`, { method: 'DELETE', headers });
    toast({ title: 'Blok kaldırıldı' });
    fetchData();
  };

  const createAppointment = async (body: Record<string, any>) => {
    const headers = await getHeaders();
    if (!headers) return false;
    const res = await fetch(baseUrl, {
      method: 'POST', headers, body: JSON.stringify({ action: 'create_appointment', ...body }),
    });
    if (res.ok) {
      toast({ title: 'Randevu oluşturuldu' });
      fetchData();
      return true;
    }
    return false;
  };

  const createNote = async (note_date: string, content: string) => {
    const headers = await getHeaders();
    if (!headers) return;
    const res = await fetch(baseUrl, {
      method: 'POST', headers, body: JSON.stringify({ action: 'create_note', note_date, content }),
    });
    if (res.ok) { toast({ title: 'Not eklendi' }); fetchData(); }
  };

  const updateNote = async (note_id: string, content: string) => {
    const headers = await getHeaders();
    if (!headers) return;
    const res = await fetch(baseUrl, {
      method: 'POST', headers, body: JSON.stringify({ action: 'update_note', note_id, content }),
    });
    if (res.ok) { toast({ title: 'Not güncellendi' }); fetchData(); }
  };

  const deleteNote = async (note_id: string) => {
    const headers = await getHeaders();
    if (!headers) return;
    const res = await fetch(baseUrl, {
      method: 'POST', headers, body: JSON.stringify({ action: 'delete_note', note_id }),
    });
    if (res.ok) { toast({ title: 'Not silindi' }); fetchData(); }
  };

  return {
    appointments, settings, blockedSlots, agendaNotes, loading,
    daySchedules, setDaySchedules,
    fetchData, updateStatus, updateInternalNote, updateSettings,
    blockDate, unblockDate, createAppointment,
    createNote, updateNote, deleteNote,
    getHeaders, baseUrl,
  };
}
