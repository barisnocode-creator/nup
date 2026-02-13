import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDays, CalendarRange, CalendarClock, List, Search, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, isToday } from 'date-fns';
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

  const statusOptions: { value: StatusFilter; label: string; color: string; activeColor: string }[] = [
    { value: 'all', label: 'Tümü', color: '', activeColor: 'bg-primary text-primary-foreground' },
    { value: 'pending', label: 'Bekleyen', color: 'hover:bg-amber-500/10', activeColor: 'bg-amber-500/15 text-amber-600 ring-1 ring-amber-300' },
    { value: 'confirmed', label: 'Onaylı', color: 'hover:bg-emerald-500/10', activeColor: 'bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-300' },
    { value: 'cancelled', label: 'İptal', color: 'hover:bg-destructive/10', activeColor: 'bg-destructive/15 text-destructive ring-1 ring-destructive/30' },
  ];

  const viewButtons: { value: CalendarView; icon: React.ReactNode; label: string }[] = [
    { value: 'monthly', icon: <CalendarDays className="w-4 h-4" />, label: 'Ay' },
    { value: 'weekly', icon: <CalendarRange className="w-4 h-4" />, label: 'Hafta' },
    { value: 'daily', icon: <CalendarClock className="w-4 h-4" />, label: 'Gün' },
    { value: 'agenda', icon: <List className="w-4 h-4" />, label: 'Liste' },
  ];

  const isTodayVisible = isToday(currentDate);

  return (
    <div className="space-y-3">
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/50 rounded-xl p-0.5">
            <Button variant="ghost" size="icon" onClick={navigatePrev} className="h-8 w-8 rounded-lg hover:bg-background">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <motion.button
              onClick={goToday}
              whileTap={{ scale: 0.95 }}
              className={`h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
                isTodayVisible
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-background text-foreground animate-pulse'
              }`}
            >
              Bugün
            </motion.button>
            <Button variant="ghost" size="icon" onClick={navigateNext} className="h-8 w-8 rounded-lg hover:bg-background">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <h2 className="text-base font-semibold ml-1 capitalize">{getTitle()}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Segment control for views */}
          <div className="flex bg-muted/50 rounded-xl p-0.5 relative">
            {viewButtons.map(vb => (
              <button
                key={vb.value}
                onClick={() => onViewChange(vb.value)}
                className={`relative px-3 py-1.5 text-xs flex items-center gap-1.5 rounded-lg transition-all duration-200 z-10 ${
                  view === vb.value ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {view === vb.value && (
                  <motion.div
                    layoutId="activeView"
                    className="absolute inset-0 bg-background shadow-sm rounded-lg"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {vb.icon}
                  <span className="hidden sm:inline">{vb.label}</span>
                </span>
              </button>
            ))}
          </div>

          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={onScheduleClick} title="Çalışma Saatleri">
            <Clock className="w-4 h-4" />
          </Button>
          <Button size="sm" className="h-9 rounded-xl gap-1.5 shadow-sm" onClick={onCreateClick}>
            <Plus className="w-4 h-4" /> Randevu
          </Button>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Müşteri ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm rounded-xl bg-muted/30 border-transparent focus:border-border focus:bg-background transition-all"
          />
        </div>
        <div className="flex gap-1.5 bg-muted/30 rounded-xl p-0.5">
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => onStatusFilterChange(opt.value)}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                statusFilter === opt.value ? opt.activeColor : `text-muted-foreground ${opt.color} hover:text-foreground`
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
