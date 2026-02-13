import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail, Save, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationsTabProps {
  projectId: string;
  settings: {
    reminder_24h_enabled?: boolean;
    reminder_2h_enabled?: boolean;
    notification_email_enabled?: boolean;
  } | null;
  onUpdateSettings: (updates: Record<string, any>) => void;
}

interface Template {
  id: string;
  event_type: string;
  target: string;
  subject: string;
  body_template: string;
  is_enabled: boolean;
  channel: string;
}

interface LogEntry {
  id: string;
  event_type: string;
  channel: string;
  recipient_email: string | null;
  recipient_type: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

const EVENT_LABELS: Record<string, string> = {
  new_appointment: 'Yeni Randevu',
  confirmed: 'Onaylama',
  cancelled: 'İptal',
  reminder_24h: '24 Saat Hatırlatma',
  reminder_2h: '2 Saat Hatırlatma',
};

const TARGET_LABELS: Record<string, string> = {
  client: 'Müşteri',
  provider: 'Hizmet Sağlayıcı',
};

const CHANNEL_LABELS: Record<string, string> = {
  email: 'E-posta',
  in_app: 'Uygulama İçi',
  sms: 'SMS',
};

const STATUS_COLORS: Record<string, string> = {
  sent: 'bg-emerald-500/10 text-emerald-700',
  failed: 'bg-destructive/10 text-destructive',
  pending: 'bg-amber-500/10 text-amber-700',
  skipped: 'bg-muted text-muted-foreground',
};

const PREVIEW_VARS: Record<string, string> = {
  client_name: 'Ahmet Yılmaz',
  client_email: 'ahmet@example.com',
  client_phone: '0532 123 4567',
  date: '15 Şubat 2026',
  time: '10:00',
  end_time: '10:30',
  status: 'Onaylandı',
  project_name: 'Klinik Örnek',
  provider_name: 'Dr. Mehmet',
};

function fillPreview(template: string): string {
  let result = template;
  for (const [key, value] of Object.entries(PREVIEW_VARS)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

export function NotificationsTab({ projectId, settings, onUpdateSettings }: NotificationsTabProps) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [subTab, setSubTab] = useState('settings');

  useEffect(() => {
    fetchTemplates();
    fetchLogs();
  }, [projectId]);

  const fetchTemplates = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('event_type');
    if (data) setTemplates(data as unknown as Template[]);
  };

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('notification_logs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setLogs(data as unknown as LogEntry[]);
  };

  const startEdit = (t: Template) => {
    setEditingId(t.id);
    setEditSubject(t.subject);
    setEditBody(t.body_template);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await supabase
      .from('notification_templates')
      .update({ subject: editSubject, body_template: editBody } as any)
      .eq('id', editingId);
    toast({ title: 'Şablon güncellendi' });
    setEditingId(null);
    fetchTemplates();
  };

  const toggleTemplate = async (id: string, enabled: boolean) => {
    await supabase
      .from('notification_templates')
      .update({ is_enabled: enabled } as any)
      .eq('id', id);
    fetchTemplates();
  };

  return (
    <div className="space-y-4">
      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          <TabsTrigger value="templates">Şablonlar</TabsTrigger>
          <TabsTrigger value="logs">Gönderim Logları</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="w-4 h-4" /> Bildirim Tercihleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>E-posta Bildirimleri</Label>
                  <p className="text-xs text-muted-foreground">Müşterilere e-posta bildirimi gönder</p>
                </div>
                <Switch
                  checked={settings?.notification_email_enabled ?? true}
                  onCheckedChange={(v) => onUpdateSettings({ notification_email_enabled: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>24 Saat Hatırlatma</Label>
                  <p className="text-xs text-muted-foreground">Randevudan 24 saat önce hatırlat</p>
                </div>
                <Switch
                  checked={settings?.reminder_24h_enabled ?? true}
                  onCheckedChange={(v) => onUpdateSettings({ reminder_24h_enabled: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>2 Saat Hatırlatma</Label>
                  <p className="text-xs text-muted-foreground">Randevudan 2 saat önce hatırlat</p>
                </div>
                <Switch
                  checked={settings?.reminder_2h_enabled ?? true}
                  onCheckedChange={(v) => onUpdateSettings({ reminder_2h_enabled: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4 space-y-3">
          {templates.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Henüz şablon yok. Yeni bir proje oluşturduğunuzda varsayılan şablonlar otomatik eklenir.
              </CardContent>
            </Card>
          ) : (
            templates.map(t => (
              <Card key={t.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{EVENT_LABELS[t.event_type] || t.event_type}</Badge>
                      <Badge variant="secondary">{TARGET_LABELS[t.target] || t.target}</Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {t.channel === 'email' ? <Mail className="w-3 h-3 mr-1" /> : <Bell className="w-3 h-3 mr-1" />}
                        {CHANNEL_LABELS[t.channel]}
                      </Badge>
                    </div>
                    <Switch checked={t.is_enabled} onCheckedChange={(v) => toggleTemplate(t.id, v)} />
                  </div>

                  {editingId === t.id ? (
                    <div className="space-y-2">
                      <Input value={editSubject} onChange={e => setEditSubject(e.target.value)} placeholder="Konu" />
                      <Textarea value={editBody} onChange={e => setEditBody(e.target.value)} rows={3} placeholder="İçerik" />
                      <p className="text-[10px] text-muted-foreground">
                        Değişkenler: {'{{client_name}}, {{date}}, {{time}}, {{end_time}}, {{project_name}}, {{provider_name}}, {{status}}'}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}><Save className="w-3 h-3 mr-1" /> Kaydet</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>İptal</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium">{t.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.body_template}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(t)}>Düzenle</Button>
                        <Button size="sm" variant="ghost" onClick={() => setPreviewId(previewId === t.id ? null : t.id)}>
                          <Eye className="w-3 h-3 mr-1" /> Önizleme
                        </Button>
                      </div>
                      {previewId === t.id && (
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                          <p className="font-medium">{fillPreview(t.subject)}</p>
                          <p className="text-muted-foreground mt-1">{fillPreview(t.body_template)}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4" /> Gönderim Geçmişi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96">
                {logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Henüz gönderim yok</p>
                ) : (
                  <div className="space-y-2">
                    {logs.map(log => (
                      <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg border text-sm">
                        <div className="shrink-0">
                          {log.status === 'sent' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                          {log.status === 'failed' && <XCircle className="w-4 h-4 text-destructive" />}
                          {log.status === 'pending' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                          {log.status === 'skipped' && <AlertCircle className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{EVENT_LABELS[log.event_type] || log.event_type}</span>
                            <Badge variant="outline" className="text-[10px]">{CHANNEL_LABELS[log.channel]}</Badge>
                            <Badge className={`text-[10px] ${STATUS_COLORS[log.status] || ''}`}>
                              {log.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {TARGET_LABELS[log.recipient_type]}{log.recipient_email ? ` • ${log.recipient_email}` : ''}
                          </p>
                          {log.error_message && (
                            <p className="text-[10px] text-destructive mt-0.5">{log.error_message}</p>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {format(new Date(log.created_at), 'dd MMM HH:mm', { locale: tr })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
