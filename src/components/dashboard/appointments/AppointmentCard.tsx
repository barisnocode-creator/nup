import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, X, StickyNote, ChevronDown, ChevronUp, FileText, RotateCcw, GripVertical } from 'lucide-react';
import type { Appointment, FormField } from './types';

interface AppointmentCardProps {
  appointment: Appointment;
  formFields: FormField[];
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateInternalNote: (id: string, note: string) => void;
  compact?: boolean;
  draggable?: boolean;
}

const statusConfig = {
  confirmed: { border: 'border-l-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-600', label: 'Onaylı', avatarGrad: 'from-emerald-400 to-emerald-600' },
  cancelled: { border: 'border-l-destructive', bg: 'bg-destructive/10', text: 'text-destructive', label: 'İptal', avatarGrad: 'from-red-400 to-red-600' },
  pending: { border: 'border-l-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'Bekliyor', avatarGrad: 'from-amber-400 to-orange-500' },
};

export function AppointmentCard({ appointment: appt, formFields, onUpdateStatus, onUpdateInternalNote, compact, draggable }: AppointmentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(appt.internal_note || '');

  const config = statusConfig[appt.status as keyof typeof statusConfig] || statusConfig.pending;
  const initials = appt.client_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const saveNote = () => {
    onUpdateInternalNote(appt.id, noteText);
    setEditingNote(false);
  };

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`px-2 py-1.5 rounded-md text-xs cursor-pointer border-l-[3px] ${config.border} ${
          appt.status === 'cancelled' ? 'opacity-60 line-through' : ''
        } bg-card hover:shadow-md transition-all duration-200 flex items-center gap-1.5`}
        title={`${appt.client_name} - ${appt.start_time}`}
      >
        {draggable && <GripVertical className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />}
        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${config.avatarGrad} flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0`}>
          {initials}
        </div>
        <span className="font-medium truncate">{appt.start_time}</span>
        <span className="truncate text-muted-foreground">{appt.client_name}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, boxShadow: '0 8px 25px -8px hsl(var(--primary) / 0.12)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`border border-border rounded-xl p-4 bg-card border-l-[4px] ${config.border} space-y-3`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {draggable && <GripVertical className="w-4 h-4 text-muted-foreground/40 mt-1 flex-shrink-0 cursor-grab" />}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.avatarGrad} flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{appt.client_name}</span>
              <Badge className={`${config.bg} ${config.text} border-transparent text-[10px] px-1.5 py-0`}>
                {config.label}
              </Badge>
              {appt.internal_note && <StickyNote className="w-3.5 h-3.5 text-amber-500" />}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
              <span>📅 {new Date(appt.appointment_date).toLocaleDateString('tr-TR')}</span>
              <span>🕐 {appt.start_time} - {appt.end_time}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              📧 {appt.client_email} {appt.client_phone && `· 📞 ${appt.client_phone}`}
            </div>
            {appt.client_note && <div className="text-xs text-muted-foreground italic">💬 {appt.client_note}</div>}
          </div>
        </div>
        <TooltipProvider delayDuration={200}>
          <div className="flex gap-1 flex-shrink-0">
            {appt.status === 'pending' && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-500/10 rounded-full" onClick={() => onUpdateStatus(appt.id, 'confirmed')}>
                      <Check className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top"><p>Onayla</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-full" onClick={() => onUpdateStatus(appt.id, 'cancelled')}>
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top"><p>İptal Et</p></TooltipContent>
                </Tooltip>
              </>
            )}
            {appt.status === 'cancelled' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:bg-primary/10 rounded-full" onClick={() => onUpdateStatus(appt.id, 'pending')}>
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Yeniden Aktif Et</p></TooltipContent>
              </Tooltip>
            )}
            {appt.status === 'confirmed' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-full" onClick={() => onUpdateStatus(appt.id, 'cancelled')}>
                    <X className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>İptal Et</p></TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      </div>

      {/* Expandable details */}
      <div className="flex gap-3">
        {appt.form_data && Object.keys(appt.form_data).length > 0 && (
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary flex items-center gap-1 hover:underline">
            <FileText className="w-3 h-3" /> Form
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
        <button onClick={() => setEditingNote(!editingNote)} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
          <StickyNote className="w-3 h-3" /> {appt.internal_note ? 'Notu düzenle' : 'Not ekle'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && appt.form_data && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-lg bg-muted/50 text-xs space-y-1.5 border border-border/50">
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
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingNote && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2">
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Dahili not (sadece siz görebilirsiniz)..."
                rows={2}
                className="text-xs"
              />
              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-xs rounded-lg" onClick={saveNote}>Kaydet</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingNote(false)}>İptal</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!editingNote && appt.internal_note && (
        <div className="text-xs p-2.5 rounded-lg bg-amber-500/5 border border-amber-200/50 text-amber-700">
          📝 {appt.internal_note}
        </div>
      )}
    </motion.div>
  );
}
