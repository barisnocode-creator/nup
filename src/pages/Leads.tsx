import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MessageSquare, Mail, Phone, Calendar, Eye, Trash2, Filter, Inbox } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Lead {
  id: string;
  project_id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function Leads() {
  const { id } = useParams<{ id: string }>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from('contact_leads')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
    if (!id) return;
    const channel = supabase
      .channel('leads-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_leads', filter: `project_id=eq.${id}` }, () => {
        fetchLeads();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const markAsRead = async (lead: Lead) => {
    if (lead.is_read) return;
    await supabase.from('contact_leads').update({ is_read: true }).eq('id', lead.id);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, is_read: true } : l));
  };

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    markAsRead(lead);
  };

  const handleDelete = async (leadId: string) => {
    const { error } = await supabase.from('contact_leads').delete().eq('id', leadId);
    if (!error) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
      toast.success('Mesaj silindi');
    }
  };

  const filtered = filter === 'unread' ? leads.filter(l => !l.is_read) : leads;
  const unreadCount = leads.filter(l => !l.is_read).length;

  return (
    <DashboardLayout activeProjectId={id}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mesajlar</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} okunmamış mesaj</p>
            )}
          </div>
        </div>

        {!id ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Henüz bir web siteniz yok</p>
            <p className="text-sm mt-1">Mesajları görmek için önce bir web sitesi oluşturun.</p>
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-muted-foreground">Yükleniyor...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Inbox className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Henüz mesaj yok</p>
            <p className="text-sm mt-1">Web sitenizdeki iletişim formundan gelen mesajlar burada görünecek.</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Tümü ({leads.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                <Filter className="w-4 h-4 mr-1" />
                Okunmamış ({unreadCount})
              </Button>
            </div>

            <div className="space-y-3">
              {filtered.map(lead => (
                <Card
                  key={lead.id}
                  className={`cursor-pointer transition hover:shadow-md ${!lead.is_read ? 'border-primary/30 bg-primary/5' : ''}`}
                  onClick={() => handleView(lead)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {!lead.is_read && (
                            <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                          )}
                          <span className="font-semibold truncate">{lead.name}</span>
                          {lead.subject && (
                            <Badge variant="secondary" className="text-xs shrink-0">{lead.subject}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{lead.message}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {lead.email}
                          </span>
                          {lead.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(lead.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => { e.stopPropagation(); handleView(lead); }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="bg-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedLead?.name}</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">E-posta</span>
                  <p className="font-medium">{selectedLead.email}</p>
                </div>
                {selectedLead.phone && (
                  <div>
                    <span className="text-muted-foreground">Telefon</span>
                    <p className="font-medium">{selectedLead.phone}</p>
                  </div>
                )}
                {selectedLead.subject && (
                  <div>
                    <span className="text-muted-foreground">Konu</span>
                    <p className="font-medium">{selectedLead.subject}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Tarih</span>
                  <p className="font-medium">
                    {format(new Date(selectedLead.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}
                  </p>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Mesaj</span>
                <p className="mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                  {selectedLead.message}
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selectedLead.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Sil
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
