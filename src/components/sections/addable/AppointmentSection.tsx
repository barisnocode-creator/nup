import { useState } from 'react';
import { Calendar, Clock, User, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { SectionComponentProps } from '../types';

const timeSlots = Array.from({ length: 20 }, (_, i) => {
  const h = Math.floor(i / 2) + 9;
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
});

export function AppointmentSection({ section }: SectionComponentProps) {
  const { title = 'Randevu Al', subtitle = 'Size en uygun zamanı seçin', buttonText = 'Randevu Oluştur' } = section.props;
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">{title}</h2>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>
        <div className="bg-card border border-border rounded-[var(--radius)] p-8 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Adınız Soyadınız" className="pl-10" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Telefon Numarası" className="pl-10" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd MMMM yyyy', { locale: tr }) : 'Tarih Seçin'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarUI mode="single" selected={date} onSelect={setDate} initialFocus className="p-3 pointer-events-auto" disabled={(d) => d < new Date()} />
              </PopoverContent>
            </Popover>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger><Clock className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Saat Seçin" /></SelectTrigger>
              <SelectContent>{timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Textarea placeholder="Notunuz (isteğe bağlı)" className="pl-10 min-h-[80px]" />
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{buttonText}</Button>
        </div>
      </div>
    </section>
  );
}
