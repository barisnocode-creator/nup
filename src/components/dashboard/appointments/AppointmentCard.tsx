import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, StickyNote, ChevronDown, ChevronUp, FileText, RotateCcw } from 'lucide-react';
import type { Appointment, FormField } from './types';

interface AppointmentCardProps {
  appointment: Appointment;
  formFields: FormField[];
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateInternalNote: (id: string, note: string) => void;
  compact?: boolean;
}

export function AppointmentCard({ appointment: appt, formFields, onUpdateStatus, onUpdateInternalNote, compact }: AppointmentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(appt.internal_note || '');

  const statusBadge = () => {
    switch (appt.status) {
      case 'confirmed': return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20">Onaylı</Badge>;
      case 'cancelled': return <Badge variant="destructive">İptal</Badge>;
      default: return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20">Bekliyor</Badge>;
    }
  };

  const saveNote = () => {
    onUpdateInternalNote(appt.id, noteText);
    setEditingNote(false);
  };

  if (compact) {
    return (
      <div className={`px-2 py-1 rounded text-xs truncate cursor-pointer ${
        appt.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-700' :
        appt.status === 'cancelled' ? 'bg-destructive/15 text-destructive line-through' :
        'bg-amber-500/15 text-amber-700'
      }`} title={`${appt.client_name} - ${appt.start_time}`}>
        <span className="font-medium">{appt.start_time}</span> {appt.client_name}
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-3 bg-card space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{appt.client_name}</span>
            {statusBadge()}
            {appt.internal_note && (
              <StickyNote className="w-3.5 h-3.5 text-amber-500" />
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            📅 {new Date(appt.appointment_date).toLocaleDateString('tr-TR')} · 🕐 {appt.start_time} - {appt.end_time}
          </div>
          <div className="text-xs text-muted-foreground">
            📧 {appt.client_email} {appt.client_phone && `· 📞 ${appt.client_phone}`}
          </div>
          {appt.client_note && <div className="text-xs text-muted-foreground">💬 {appt.client_note}</div>}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {appt.status === 'pending' && (
            <>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-emerald-600" onClick={() => onUpdateStatus(appt.id, 'confirmed')}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => onUpdateStatus(appt.id, 'cancelled')}>
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          {appt.status === 'cancelled' && (
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-primary" onClick={() => onUpdateStatus(appt.id, 'pending')} title="Yeniden Aktif Et">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          )}
          {appt.status === 'confirmed' && (
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => onUpdateStatus(appt.id, 'cancelled')} title="İptal Et">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Expandable details */}
      <div className="flex gap-2">
        {appt.form_data && Object.keys(appt.form_data).length > 0 && (
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary flex items-center gap-1">
            <FileText className="w-3 h-3" /> Form
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
        <button onClick={() => setEditingNote(!editingNote)} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground">
          <StickyNote className="w-3 h-3" /> {appt.internal_note ? 'Notu düzenle' : 'Not ekle'}
        </button>
      </div>

      {expanded && appt.form_data && (
        <div className="p-2 rounded bg-muted text-xs space-y-1">
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

      {editingNote && (
        <div className="space-y-2">
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Dahili not (sadece siz görebilirsiniz)..."
            rows={2}
            className="text-xs"
          />
          <div className="flex gap-2">
            <Button size="sm" className="h-6 text-xs" onClick={saveNote}>Kaydet</Button>
            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setEditingNote(false)}>İptal</Button>
          </div>
        </div>
      )}

      {!editingNote && appt.internal_note && (
        <div className="text-xs p-2 rounded bg-amber-500/5 border border-amber-200/50 text-amber-700">
          📝 {appt.internal_note}
        </div>
      )}
    </div>
  );
}
