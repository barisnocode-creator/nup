import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, Check, X, Settings, Ban, Plus, Trash2, Coffee, GripVertical, FileText, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  system: boolean;
  order: number;
  placeholder?: string;
  options?: string[];
}

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
  form_data: Record<string, string> | null;
  consent_given: boolean;
}

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
  breaks: { start: string; end: string }[];
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
  day_schedules: Record<string, DaySchedule> | null;
  form_fields: FormField[] | null;
  consent_text: string | null;
  consent_required: boolean;
}

interface BlockedSlot {
  id: string;
  blocked_date: string;
  reason: string | null;
  block_type: string;
  block_start_time: string | null;
  block_end_time: string | null;
}

interface AppointmentsPanelProps {
  projectId: string;
}

const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const DAY_KEYS = ['0', '1', '2', '3', '4', '5', '6'];

const TIMEZONES = [
  'Europe/Istanbul', 'Europe/London', 'Europe/Berlin', 'Europe/Paris',
  'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Asia/Tokyo',
];

const DURATION_OPTIONS = [
  { value: '15', label: '15 dk' }, { value: '30', label: '30 dk' },
  { value: '45', label: '45 dk' }, { value: '60', label: '60 dk' },
  { value: '90', label: '90 dk' }, { value: '120', label: '120 dk' },
];

const BUFFER_OPTIONS = [
  { value: '0', label: 'Yok' }, { value: '5', label: '5 dk' },
  { value: '10', label: '10 dk' }, { value: '15', label: '15 dk' },
];

const FIELD_TYPES = [
  { value: 'text', label: 'Metin' }, { value: 'email', label: 'E-posta' },
  { value: 'tel', label: 'Telefon' }, { value: 'textarea', label: 'Uzun Metin' },
  { value: 'select', label: 'Seçim Listesi' },
];

function getDefaultDaySchedules(): Record<string, DaySchedule> {
  const schedules: Record<string, DaySchedule> = {};
  for (let i = 0; i <= 6; i++) {
    schedules[String(i)] = {
      enabled: i >= 1 && i <= 5, start: '09:00', end: '18:00',
      breaks: i >= 1 && i <= 5 ? [{ start: '12:00', end: '13:00' }] : [],
    };
  }
  return schedules;
}

export function AppointmentsPanel({ projectId }: AppointmentsPanelProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState<AppointmentSettings | null>(null);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [daySchedules, setDaySchedules] = useState<Record<string, DaySchedule>>(getDefaultDaySchedules());
  const [scheduleChanged, setScheduleChanged] = useState(false);
  const [expandedAppt, setExpandedAppt] = useState<string | null>(null);

  // Form fields state
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formFieldsChanged, setFormFieldsChanged] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [consentText, setConsentText] = useState('');
  const [consentRequired, setConsentRequired] = useState(true);

  // Block form state
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');
  const [newBlockType, setNewBlockType] = useState<string>('full_day');
  const [newBlockStartTime, setNewBlockStartTime] = useState('');
  const [newBlockEndTime, setNewBlockEndTime] = useState('');

  const getHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    return { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' };
  };

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-appointments?project_id=${projectId}`;

  const fetchData = useCallback(async () => {
    const headers = await getHeaders();
    if (!headers) return;

    const [apptRes, settingsRes, blockedRes] = await Promise.all([
      fetch(baseUrl, { headers }),
      fetch(`${baseUrl}&type=settings`, { headers }),
      fetch(`${baseUrl}&type=blocked`, { headers }),
    ]);

    const [apptData, settingsData, blockedData] = await Promise.all([
      apptRes.json(), settingsRes.json(), blockedRes.json(),
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
    if (s?.form_fields) {
      setFormFields([...(s.form_fields as FormField[])].sort((a, b) => a.order - b.order));
    }
    setConsentText(s?.consent_text || '');
    setConsentRequired(s?.consent_required ?? true);
    setBlockedSlots(blockedData.blocked_slots || []);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (appointmentId: string, status: string) => {
    const headers = await getHeaders();
    if (!headers) return;
    const res = await fetch(baseUrl, {
      method: 'PATCH', headers, body: JSON.stringify({ appointment_id: appointmentId, status }),
    });
    if (res.ok) {
      toast({ title: status === 'confirmed' ? 'Randevu onaylandı' : 'Randevu iptal edildi' });
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

  const saveDaySchedules = async () => {
    const workingDays = DAY_KEYS.filter(k => daySchedules[k]?.enabled).map(Number);
    await updateSettings({ day_schedules: daySchedules as any, working_days: workingDays });
    setScheduleChanged(false);
  };

  const updateDaySchedule = (dayKey: string, field: string, value: any) => {
    setDaySchedules(prev => ({ ...prev, [dayKey]: { ...prev[dayKey], [field]: value } }));
    setScheduleChanged(true);
  };

  const addBreak = (dayKey: string) => {
    setDaySchedules(prev => ({
      ...prev, [dayKey]: { ...prev[dayKey], breaks: [...prev[dayKey].breaks, { start: '12:00', end: '13:00' }] },
    }));
    setScheduleChanged(true);
  };

  const removeBreak = (dayKey: string, idx: number) => {
    setDaySchedules(prev => ({
      ...prev, [dayKey]: { ...prev[dayKey], breaks: prev[dayKey].breaks.filter((_, i) => i !== idx) },
    }));
    setScheduleChanged(true);
  };

  const updateBreak = (dayKey: string, idx: number, field: 'start' | 'end', value: string) => {
    setDaySchedules(prev => ({
      ...prev, [dayKey]: { ...prev[dayKey], breaks: prev[dayKey].breaks.map((b, i) => i === idx ? { ...b, [field]: value } : b) },
    }));
    setScheduleChanged(true);
  };

  // Form fields management
  const addFormField = () => {
    if (!newFieldLabel.trim()) return;
    const id = newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 30) + '_' + Date.now().toString(36);
    const newField: FormField = {
      id, type: newFieldType, label: newFieldLabel.trim(),
      required: newFieldRequired, system: false,
      order: formFields.length,
      placeholder: newFieldPlaceholder || undefined,
      options: newFieldType === 'select' ? newFieldOptions.split(',').map(o => o.trim()).filter(Boolean) : undefined,
    };
    setFormFields(prev => [...prev, newField]);
    setNewFieldLabel(''); setNewFieldType('text'); setNewFieldRequired(false);
    setNewFieldPlaceholder(''); setNewFieldOptions('');
    setFormFieldsChanged(true);
  };

  const removeFormField = (id: string) => {
    setFormFields(prev => prev.filter(f => f.id !== id));
    setFormFieldsChanged(true);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(formFields);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setFormFields(items.map((f, i) => ({ ...f, order: i })));
    setFormFieldsChanged(true);
  };

  const saveFormFields = async () => {
    await updateSettings({
      form_fields: formFields as any,
      consent_text: consentText || null,
      consent_required: consentRequired,
    } as any);
    setFormFieldsChanged(false);
  };

  const blockDate = async () => {
    if (!newBlockDate) return;
    const headers = await getHeaders();
    if (!headers) return;
    const body: Record<string, any> = { blocked_date: newBlockDate, reason: newBlockReason || null, block_type: newBlockType };
    if (newBlockType === 'time_range') { body.block_start_time = newBlockStartTime; body.block_end_time = newBlockEndTime; }
    const res = await fetch(baseUrl, { method: 'POST', headers, body: JSON.stringify(body) });
    if (res.ok) {
      setNewBlockDate(''); setNewBlockReason(''); setNewBlockType('full_day');
      setNewBlockStartTime(''); setNewBlockEndTime('');
      toast({ title: 'Tarih kapatıldı' }); fetchData();
    }
  };

  const unblockDate = async (blockId: string) => {
    const headers = await getHeaders();
    if (!headers) return;
    await fetch(`${baseUrl}&block_id=${blockId}`, { method: 'DELETE', headers });
    toast({ title: 'Blok kaldırıldı' }); fetchData();
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

  const blockTypeBadge = (type: string) => {
    switch (type) {
      case 'vacation': return <Badge variant="secondary">Tatil</Badge>;
      case 'time_range': return <Badge variant="outline">Saat Aralığı</Badge>;
      default: return <Badge variant="destructive">Tam Gün</Badge>;
    }
  };

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
        <TabsList className="flex-wrap">
          <TabsTrigger value="appointments">Randevular</TabsTrigger>
          <TabsTrigger value="form-fields">Form Alanları</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          <TabsTrigger value="schedule">Haftalık Program</TabsTrigger>
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
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{appt.client_name}</span>
                        <Badge variant={appt.status === 'confirmed' ? 'default' : appt.status === 'cancelled' ? 'destructive' : 'secondary'}>
                          {appt.status === 'pending' ? 'Bekliyor' : appt.status === 'confirmed' ? 'Onaylı' : 'İptal'}
                        </Badge>
                        {appt.consent_given && <Badge variant="outline" className="text-xs">Onay ✓</Badge>}
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
                      {/* Show form_data */}
                      {appt.form_data && Object.keys(appt.form_data).length > 0 && (
                        <div>
                          <button
                            onClick={() => setExpandedAppt(expandedAppt === appt.id ? null : appt.id)}
                            className="text-xs text-primary flex items-center gap-1 mt-1"
                          >
                            <FileText className="w-3 h-3" />
                            Form verileri
                            {expandedAppt === appt.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                          {expandedAppt === appt.id && (
                            <div className="mt-2 p-3 rounded-lg bg-muted text-sm space-y-1">
                              {Object.entries(appt.form_data).map(([key, val]) => {
                                const fieldDef = formFields.find(f => f.id === key);
                                return (
                                  <div key={key} className="flex gap-2">
                                    <span className="font-medium text-muted-foreground">{fieldDef?.label || key}:</span>
                                    <span>{val}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {appt.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
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

        {/* Form Fields Management */}
        <TabsContent value="form-fields" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Form Alanları
                </CardTitle>
                {formFieldsChanged && (
                  <Button onClick={saveFormFields} size="sm">
                    <Check className="w-4 h-4 mr-1" /> Kaydet
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="form-fields">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                      {formFields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card"
                            >
                              <div {...provided.dragHandleProps} className="cursor-grab">
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{field.label}</span>
                                  <Badge variant="outline" className="text-xs">{FIELD_TYPES.find(t => t.value === field.type)?.label || field.type}</Badge>
                                  {field.required && <Badge variant="secondary" className="text-xs">Zorunlu</Badge>}
                                  {field.system && (
                                    <Badge variant="default" className="text-xs">
                                      <Lock className="w-3 h-3 mr-1" /> Sistem
                                    </Badge>
                                  )}
                                </div>
                                {field.placeholder && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{field.placeholder}</p>
                                )}
                              </div>
                              {!field.system && (
                                <Button
                                  variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                                  onClick={() => removeFormField(field.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Add new field */}
              <div className="border-t border-border pt-4 space-y-3">
                <h4 className="text-sm font-medium">Yeni Alan Ekle</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Etiket</Label>
                    <Input
                      placeholder="Örn: Şirket Adı"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Tip</Label>
                    <Select value={newFieldType} onValueChange={setNewFieldType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Placeholder (opsiyonel)</Label>
                  <Input
                    placeholder="Yer tutucu metin"
                    value={newFieldPlaceholder}
                    onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                  />
                </div>
                {newFieldType === 'select' && (
                  <div className="space-y-1">
                    <Label className="text-xs">Seçenekler (virgülle ayırın)</Label>
                    <Input
                      placeholder="Seçenek 1, Seçenek 2, Seçenek 3"
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                    />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="new-field-required"
                      checked={newFieldRequired}
                      onCheckedChange={(v) => setNewFieldRequired(!!v)}
                    />
                    <Label htmlFor="new-field-required" className="text-sm">Zorunlu</Label>
                  </div>
                  <Button onClick={addFormField} disabled={!newFieldLabel.trim()} size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Ekle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consent Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gizlilik Onayı</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Gizlilik onayı zorunlu</Label>
                <Switch
                  checked={consentRequired}
                  onCheckedChange={(v) => { setConsentRequired(v); setFormFieldsChanged(true); }}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Onay Metni</Label>
                <Textarea
                  placeholder="Kişisel verilerimin işlenmesini kabul ediyorum."
                  value={consentText}
                  onChange={(e) => { setConsentText(e.target.value); setFormFieldsChanged(true); }}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="settings" className="mt-4">
          {settings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Genel Ayarlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Randevu Sistemi Aktif</Label>
                  <Switch checked={settings.is_enabled} onCheckedChange={(checked) => updateSettings({ is_enabled: checked })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Randevu Süresi</Label>
                    <Select value={String(settings.slot_duration_minutes)} onValueChange={(v) => updateSettings({ slot_duration_minutes: parseInt(v) })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tampon Süre</Label>
                    <Select value={String(settings.buffer_minutes)} onValueChange={(v) => updateSettings({ buffer_minutes: parseInt(v) })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {BUFFER_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Saat Dilimi</Label>
                    <Select value={settings.timezone} onValueChange={(v) => updateSettings({ timezone: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Maksimum İleri Gün</Label>
                    <Input type="number" value={settings.max_advance_days} onChange={(e) => updateSettings({ max_advance_days: parseInt(e.target.value) || 30 })} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Day-based Schedule */}
        <TabsContent value="schedule" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Haftalık Program
                </CardTitle>
                {scheduleChanged && (
                  <Button onClick={saveDaySchedules} size="sm">
                    <Check className="w-4 h-4 mr-1" /> Kaydet
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {DAY_KEYS.map((dayKey) => {
                const ds = daySchedules[dayKey];
                if (!ds) return null;
                const dayIdx = parseInt(dayKey);
                return (
                  <div key={dayKey} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch checked={ds.enabled} onCheckedChange={(v) => updateDaySchedule(dayKey, 'enabled', v)} />
                        <span className={`font-medium ${!ds.enabled ? 'text-muted-foreground' : ''}`}>{DAY_NAMES[dayIdx]}</span>
                      </div>
                      {ds.enabled && (
                        <Button variant="ghost" size="sm" onClick={() => addBreak(dayKey)} className="text-muted-foreground">
                          <Coffee className="w-4 h-4 mr-1" /> Mola Ekle
                        </Button>
                      )}
                    </div>
                    {ds.enabled && (
                      <>
                        <div className="flex items-center gap-2 pl-12">
                          <Input type="time" value={ds.start} className="w-32" onChange={(e) => updateDaySchedule(dayKey, 'start', e.target.value)} />
                          <span className="text-muted-foreground">—</span>
                          <Input type="time" value={ds.end} className="w-32" onChange={(e) => updateDaySchedule(dayKey, 'end', e.target.value)} />
                        </div>
                        {ds.breaks.length > 0 && (
                          <div className="pl-12 space-y-2">
                            {ds.breaks.map((br, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Coffee className="w-4 h-4 text-muted-foreground" />
                                <Input type="time" value={br.start} className="w-32" onChange={(e) => updateBreak(dayKey, idx, 'start', e.target.value)} />
                                <span className="text-muted-foreground">—</span>
                                <Input type="time" value={br.end} className="w-32" onChange={(e) => updateBreak(dayKey, idx, 'end', e.target.value)} />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeBreak(dayKey, idx)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blocked Dates */}
        <TabsContent value="blocked" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="w-5 h-5" /> Tarih Kapat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Tarih</Label>
                  <Input type="date" value={newBlockDate} onChange={(e) => setNewBlockDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Kapatma Tipi</Label>
                  <Select value={newBlockType} onValueChange={setNewBlockType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_day">Tam Gün</SelectItem>
                      <SelectItem value="time_range">Saat Aralığı</SelectItem>
                      <SelectItem value="vacation">Tatil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {newBlockType === 'time_range' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Başlangıç Saati</Label>
                    <Input type="time" value={newBlockStartTime} onChange={(e) => setNewBlockStartTime(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bitiş Saati</Label>
                    <Input type="time" value={newBlockEndTime} onChange={(e) => setNewBlockEndTime(e.target.value)} />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Sebep (opsiyonel)</Label>
                <Input placeholder="Örn: Yıllık izin" value={newBlockReason} onChange={(e) => setNewBlockReason(e.target.value)} />
              </div>
              <Button onClick={blockDate} disabled={!newBlockDate} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-1" /> Tarihi Kapat
              </Button>
            </CardContent>
          </Card>
          {blockedSlots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kapalı Tarihler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blockedSlots.map(slot => (
                    <div key={slot.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        {blockTypeBadge(slot.block_type)}
                        <span className="font-medium">{new Date(slot.blocked_date).toLocaleDateString('tr-TR')}</span>
                        {slot.block_type === 'time_range' && slot.block_start_time && slot.block_end_time && (
                          <span className="text-sm text-muted-foreground">{slot.block_start_time} - {slot.block_end_time}</span>
                        )}
                        {slot.reason && <span className="text-sm text-muted-foreground">({slot.reason})</span>}
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
