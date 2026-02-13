import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, CalendarRange, CalendarClock, List, Search, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { CalendarView, StatusFilter } from './types';

interface CalendarToolbarProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
  onCreateClick: () => void;
  onScheduleClick: () => void;
}

export function CalendarToolbar({
  view, onViewChange, currentDate, onDateChange,
  searchQuery, onSearchChange, statusFilter, onStatusFilterChange,
  onCreateClick, onScheduleClick,
}: CalendarToolbarProps) {
  const navigatePrev = () => {
    if (view === 'monthly') onDateChange(subMonths(currentDate, 1));
    else if (view === 'weekly') onDateChange(subWeeks(currentDate, 1));
    else onDateChange(subDays(currentDate, 1));
  };

  const navigateNext = () => {
    if (view === 'monthly') onDateChange(addMonths(currentDate, 1));
    else if (view === 'weekly') onDateChange(addWeeks(currentDate, 1));
    else onDateChange(addDays(currentDate, 1));
  };

  const goToday = () => onDateChange(new Date());

  const getTitle = () => {
    if (view === 'monthly') return format(currentDate, 'MMMM yyyy', { locale: tr });
    if (view === 'weekly') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${format(weekStart, 'd MMM', { locale: tr })} - ${format(weekEnd, 'd MMM yyyy', { locale: tr })}`;
    }
    if (view === 'daily') return format(currentDate, 'd MMMM yyyy, EEEE', { locale: tr });
    return format(currentDate, 'MMMM yyyy', { locale: tr });
  };

  const statusOptions: { value: StatusFilter; label: string; color: string }[] = [
    { value: 'all', label: 'Tümü', color: '' },
    { value: 'pending', label: 'Bekleyen', color: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20' },
    { value: 'confirmed', label: 'Onaylı', color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' },
    { value: 'cancelled', label: 'İptal', color: 'bg-destructive/10 text-destructive hover:bg-destructive/20' },
  ];

  const viewButtons: { value: CalendarView; icon: React.ReactNode; label: string }[] = [
    { value: 'monthly', icon: <CalendarDays className="w-4 h-4" />, label: 'Ay' },
    { value: 'weekly', icon: <CalendarRange className="w-4 h-4" />, label: 'Hafta' },
    { value: 'daily', icon: <CalendarClock className="w-4 h-4" />, label: 'Gün' },
    { value: 'agenda', icon: <List className="w-4 h-4" />, label: 'Liste' },
  ];

  return (
    <div className="space-y-3">
      {/* Top row: Navigation + View buttons + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrev} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday} className="h-8 text-xs">
            Bugün
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext} className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <h2 className="text-base font-semibold ml-2 capitalize">{getTitle()}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-md overflow-hidden">
            {viewButtons.map(vb => (
              <button
                key={vb.value}
                onClick={() => onViewChange(vb.value)}
                className={`px-2.5 py-1.5 text-xs flex items-center gap-1 transition-colors ${
                  view === vb.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                {vb.icon}
                <span className="hidden sm:inline">{vb.label}</span>
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={onScheduleClick} title="Çalışma Saatleri">
            <Clock className="w-4 h-4" />
          </Button>
          <Button size="sm" className="h-8" onClick={onCreateClick}>
            <Plus className="w-4 h-4 mr-1" /> Randevu
          </Button>
        </div>
      </div>

      {/* Bottom row: Search + Status filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Müşteri ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <div className="flex gap-1.5">
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => onStatusFilterChange(opt.value)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                statusFilter === opt.value
                  ? opt.value === 'all' ? 'bg-primary text-primary-foreground' : opt.color + ' ring-1 ring-current'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
