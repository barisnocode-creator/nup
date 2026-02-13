import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, Check, X, Settings, Ban } from 'lucide-react';

interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_note: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
}

interface AppointmentSettings {
  is_enabled: boolean;
  timezone: string;
  slot_duration_minutes: number;
  buffer_minutes: number;
  working_days: number[];
  working_hours_start: string;
  working_hours_end: string;
  lunch_break_start: string | null;
  lunch_break_end: string | null;
  max_advance_days: number;
}

interface BlockedSlot {
  id: string;
  blocked_date: string;
  reason: string | null;
}

interface AppointmentsPanelProps {
  projectId: string;
}

const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export function AppointmentsPanel({ projectId }: AppointmentsPanelProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState<AppointmentSettings | null>(null);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');

  const fetchData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const headers = {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };

    const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-appointments?project_id=${projectId}`;

    const [apptRes, settingsRes, blockedRes] = await Promise.all([
      fetch(baseUrl, { headers }),
      fetch(`${baseUrl}&type=settings`, { headers }),
      fetch(`${baseUrl}&type=blocked`, { headers }),
    ]);

    const [apptData, settingsData, blockedData] = await Promise.all([
      apptRes.json(),
      settingsRes.json(),
      blockedRes.json(),
    ]);

    setAppointments(apptData.appointments || []);
    setSettings(settingsData.settings || null);
    setBlockedSlots(blockedData.blocked_slots || []);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (appointmentId: string, status: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-appointments?project_id=${projectId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment_id: appointmentId, status }),
    });

    if (res.ok) {
      toast({ title: status === 'confirmed' ? 'Randevu onaylandı' : 'Randevu iptal edildi' });
      fetchData();
    }
  };

  const updateSettings = async (updates: Partial<AppointmentSettings>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-appointments?project_id=${projectId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      const data = await res.json();
      setSettings(data.settings);
      toast({ title: 'Ayarlar güncellendi' });
    }
  };

  const blockDate = async () => {
    if (!newBlockDate) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-appointments?project_id=${projectId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocked_date: newBlockDate, reason: newBlockReason || null }),
    });

    if (res.ok) {
      setNewBlockDate('');
      setNewBlockReason('');
      toast({ title: 'Tarih kapatıldı' });
      fetchData();
    }
  };

  const unblockDate = async (blockId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-appointments?project_id=${projectId}&block_id=${blockId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session.access_token}` },
    });

    toast({ title: 'Tarih açıldı' });
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

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
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments">Randevular</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          <TabsTrigger value="blocked">Kapalı Günler</TabsTrigger>
        </TabsList>

        {/* Appointments List */}
        <TabsContent value="appointments" className="space-y-4 mt-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Henüz randevu yok</p>
              </CardContent>
            </Card>
          ) : (
            appointments.map(appt => (
              <Card key={appt.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{appt.client_name}</span>
                        <Badge variant={appt.status === 'confirmed' ? 'default' : appt.status === 'cancelled' ? 'destructive' : 'secondary'}>
                          {appt.status === 'pending' ? 'Bekliyor' : appt.status === 'confirmed' ? 'Onaylı' : 'İptal'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        📅 {new Date(appt.appointment_date).toLocaleDateString('tr-TR')} · 🕐 {appt.start_time} - {appt.end_time}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        📧 {appt.client_email} {appt.client_phone && `· 📞 ${appt.client_phone}`}
                      </div>
                      {appt.client_note && (
                        <div className="text-sm text-muted-foreground">💬 {appt.client_note}</div>
                      )}
                    </div>
                    {appt.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateStatus(appt.id, 'confirmed')}>
                          <Check className="w-4 h-4 mr-1" /> Onayla
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(appt.id, 'cancelled')}>
                          <X className="w-4 h-4 mr-1" /> İptal
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="mt-4">
          {settings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Randevu Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Randevu Sistemi Aktif</Label>
                  <Switch
                    checked={settings.is_enabled}
                    onCheckedChange={(checked) => updateSettings({ is_enabled: checked })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Çalışma Başlangıcı</Label>
                    <Input
                      type="time"
                      value={settings.working_hours_start}
                      onChange={(e) => updateSettings({ working_hours_start: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Çalışma Bitişi</Label>
                    <Input
                      type="time"
                      value={settings.working_hours_end}
                      onChange={(e) => updateSettings({ working_hours_end: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Öğle Arası Başlangıcı</Label>
                    <Input
                      type="time"
                      value={settings.lunch_break_start || ''}
                      onChange={(e) => updateSettings({ lunch_break_start: e.target.value || null })}
                    />
                  </div>
                  <div>
                    <Label>Öğle Arası Bitişi</Label>
                    <Input
                      type="time"
                      value={settings.lunch_break_end || ''}
                      onChange={(e) => updateSettings({ lunch_break_end: e.target.value || null })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Randevu Süresi (dk)</Label>
                    <Input
                      type="number"
                      value={settings.slot_duration_minutes}
                      onChange={(e) => updateSettings({ slot_duration_minutes: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Tampon Süre (dk)</Label>
                    <Input
                      type="number"
                      value={settings.buffer_minutes}
                      onChange={(e) => updateSettings({ buffer_minutes: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Çalışma Günleri</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAY_NAMES.map((name, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const days = settings.working_days.includes(idx)
                            ? settings.working_days.filter(d => d !== idx)
                            : [...settings.working_days, idx];
                          updateSettings({ working_days: days });
                        }}
                        className={`px-3 py-2 rounded-lg text-sm border transition ${
                          settings.working_days.includes(idx)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-foreground border-border'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Maksimum İleri Gün Sayısı</Label>
                  <Input
                    type="number"
                    value={settings.max_advance_days}
                    onChange={(e) => updateSettings({ max_advance_days: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Blocked Dates */}
        <TabsContent value="blocked" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="w-5 h-5" /> Tarih Kapat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  type="date"
                  value={newBlockDate}
                  onChange={(e) => setNewBlockDate(e.target.value)}
                />
                <Input
                  placeholder="Sebep (opsiyonel)"
                  value={newBlockReason}
                  onChange={(e) => setNewBlockReason(e.target.value)}
                />
                <Button onClick={blockDate} disabled={!newBlockDate}>Kapat</Button>
              </div>
            </CardContent>
          </Card>

          {blockedSlots.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {blockedSlots.map(slot => (
                    <div key={slot.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <span className="font-medium">{new Date(slot.blocked_date).toLocaleDateString('tr-TR')}</span>
                        {slot.reason && <span className="text-sm text-muted-foreground ml-2">({slot.reason})</span>}
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => unblockDate(slot.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
