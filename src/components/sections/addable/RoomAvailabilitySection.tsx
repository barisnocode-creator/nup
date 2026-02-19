import { useState } from 'react';
import { CalendarDays, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { SectionComponentProps } from '../types';

export function RoomAvailabilitySection({ section }: SectionComponentProps) {
  const { title = 'Oda Müsaitliği', buttonText = 'Müsaitlik Kontrol Et' } = section.props;
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground font-[family-name:var(--font-heading)] mb-10">{title}</h2>
        <div className="bg-card border border-border rounded-[var(--radius)] p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start', !checkIn && 'text-muted-foreground')}>
                  <CalendarDays className="mr-2 h-4 w-4" />{checkIn ? format(checkIn, 'dd MMM yyyy', { locale: tr }) : 'Giriş Tarihi'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus className="p-3 pointer-events-auto" disabled={(d) => d < new Date()} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start', !checkOut && 'text-muted-foreground')}>
                  <CalendarDays className="mr-2 h-4 w-4" />{checkOut ? format(checkOut, 'dd MMM yyyy', { locale: tr }) : 'Çıkış Tarihi'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus className="p-3 pointer-events-auto" disabled={(d) => d < new Date()} />
              </PopoverContent>
            </Popover>
            <Select>
              <SelectTrigger><SelectValue placeholder="Oda Tipi" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standart Oda</SelectItem>
                <SelectItem value="deluxe">Deluxe Oda</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="family">Aile Odası</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Search className="w-4 h-4 mr-2" />{buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
