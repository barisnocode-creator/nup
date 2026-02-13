import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => Promise<boolean>;
  initialDate?: Date;
  initialTime?: string;
  slotDuration?: number;
}

export function CreateAppointmentModal({ open, onClose, onSubmit, initialDate, initialTime, slotDuration = 30 }: CreateAppointmentModalProps) {
  const [date, setDate] = useState(initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(initialTime || '09:00');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNote, setClientNote] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [status, setStatus] = useState('confirmed');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (initialDate) setDate(format(initialDate, 'yyyy-MM-dd'));
    if (initialTime) setStartTime(initialTime);
  }, [initialDate, initialTime]);

  const calculateEndTime = (start: string, duration: number) => {
    const [h, m] = start.split(':').map(Number);
    const totalMin = h * 60 + m + duration;
    return `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!clientName || !clientEmail || !date || !startTime) return;
    setSubmitting(true);
    const endTime = calculateEndTime(startTime, slotDuration);
    const ok = await onSubmit({
      appointment_date: date,
      start_time: startTime,
      end_time: endTime,
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone || null,
      client_note: clientNote || null,
      internal_note: internalNote || null,
      status,
    });
    setSubmitting(false);
    if (ok) {
      setClientName(''); setClientEmail(''); setClientPhone('');
      setClientNote(''); setInternalNote('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manuel Randevu Oluştur</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Tarih</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Saat</Label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Müşteri Adı *</Label>
            <Input placeholder="Ad Soyad" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">E-posta *</Label>
            <Input type="email" placeholder="ornek@mail.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Telefon</Label>
            <Input type="tel" placeholder="(isteğe bağlı)" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Müşteri Notu</Label>
            <Textarea placeholder="İsteğe bağlı" value={clientNote} onChange={(e) => setClientNote(e.target.value)} rows={2} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Dahili Not (sadece siz görebilirsiniz)</Label>
            <Textarea placeholder="İsteğe bağlı" value={internalNote} onChange={(e) => setInternalNote(e.target.value)} rows={2} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Durum</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Onaylı</SelectItem>
                <SelectItem value="pending">Beklemede</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>İptal</Button>
          <Button onClick={handleSubmit} disabled={!clientName || !clientEmail || submitting}>
            {submitting ? 'Oluşturuluyor...' : 'Oluştur'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
