import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Sunrise, Sun, Sunset, CalendarX2 } from 'lucide-react';
import type { SectionComponentProps } from './types';

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

/* ── Step Indicator ─────────────────────────────────── */
const steps = [
  { icon: Calendar, label: 'Tarih Seçin' },
  { icon: Clock, label: 'Saat Seçin' },
  { icon: User, label: 'Bilgileriniz' },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className={`w-6 sm:w-10 h-0.5 rounded-full transition-colors duration-500 ${done ? 'bg-primary' : 'bg-border'}`} />
            )}
            <motion.div
              animate={active ? { scale: 1.08 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                active
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : done
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{s.label}</span>
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Date Strip ─────────────────────────────────────── */
function DateStrip({ dates, selectedDate, onSelect, weekOffset, onWeekChange, unavailableDates }: {
  dates: string[];
  selectedDate: string;
  onSelect: (d: string) => void;
  weekOffset: number;
  onWeekChange: (dir: number) => void;
  unavailableDates: Set<string>;
}) {
  const visible = dates.slice(weekOffset * 7, weekOffset * 7 + 7);
  const monthLabel = visible.length > 0
    ? new Date(visible[0] + 'T00:00:00').toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
    : '';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={() => onWeekChange(-1)} disabled={weekOffset === 0}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-border hover:bg-muted transition-colors disabled:opacity-30">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-foreground capitalize">{monthLabel}</span>
        <button type="button" onClick={() => onWeekChange(1)} disabled={weekOffset >= Math.floor(dates.length / 7) - 1}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-border hover:bg-muted transition-colors disabled:opacity-30">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {visible.map((d) => {
          const dateObj = new Date(d + 'T00:00:00');
          const dayName = dateObj.toLocaleDateString('tr-TR', { weekday: 'short' });
          const dayNum = dateObj.getDate();
          const isSelected = selectedDate === d;
          const isUnavailable = unavailableDates.has(d);
          return (
            <motion.button
              key={d} type="button"
              onClick={() => !isUnavailable && onSelect(d)}
              disabled={isUnavailable}
              whileTap={!isUnavailable ? { scale: 0.95 } : undefined}
              className={`flex flex-col items-center py-3 px-1 rounded-xl transition-all duration-200 ${
                isUnavailable
                  ? 'opacity-35 cursor-not-allowed'
                  : isSelected
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'hover:bg-muted border border-transparent hover:border-border'
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider mb-1 ${isSelected && !isUnavailable ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{dayName}</span>
              <span className={`text-lg font-bold ${isUnavailable ? 'line-through text-muted-foreground' : isSelected ? '' : 'text-foreground'}`}>{dayNum}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Skeleton Loader ────────────────────────────────── */
function SlotsSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1].map(g => (
        <div key={g}>
          <div className="h-4 w-20 bg-muted animate-pulse rounded mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-[72px] rounded-full bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Time Slot Groups (Sabah / Öğle / Akşam) ────────── */
interface SlotGroup {
  label: string;
  icon: React.ElementType;
  slots: string[];
}

function groupSlots(slots: string[]): SlotGroup[] {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  for (const slot of slots) {
    const hour = parseInt(slot.split(':')[0], 10);
    if (hour < 12) morning.push(slot);
    else if (hour < 17) afternoon.push(slot);
    else evening.push(slot);
  }

  const groups: SlotGroup[] = [];
  if (morning.length > 0) groups.push({ label: 'Sabah', icon: Sunrise, slots: morning });
  if (afternoon.length > 0) groups.push({ label: 'Öğle', icon: Sun, slots: afternoon });
  if (evening.length > 0) groups.push({ label: 'Akşam', icon: Sunset, slots: evening });
  return groups;
}

function TimeSlotPicker({ slots, selectedSlot, onSelect, slotDuration, selectedDate }: {
  slots: string[];
  selectedSlot: string;
  onSelect: (t: string) => void;
  slotDuration: number;
  selectedDate: string;
}) {
  const groups = useMemo(() => groupSlots(slots), [slots]);

  const getEndTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const endMin = h * 60 + m + slotDuration;
    return `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
  };

  if (slots.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-muted/80 flex items-center justify-center mb-4">
          <CalendarX2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-foreground font-medium mb-1">Müsait saat bulunmuyor</p>
        <p className="text-muted-foreground text-sm">Başka bir gün seçmeyi deneyin</p>
      </motion.div>
    );
  }

  const dateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', weekday: 'long'
  });

  return (
    <LayoutGroup>
      <div className="space-y-5">
        {groups.map((group, gi) => {
          const GroupIcon = group.icon;
          return (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.08 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <GroupIcon className="w-4 h-4 text-primary/70" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group.label}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.slots.map(t => {
                  const isSelected = selectedSlot === t;
                  return (
                    <motion.button
                      key={t}
                      type="button"
                      onClick={() => onSelect(t)}
                      layout
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.35)]'
                          : 'border border-border bg-background text-foreground hover:border-primary/50 hover:shadow-sm'
                      }`}
                    >
                      {t}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Selected slot summary */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {dateLabel}
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {selectedSlot} – {getEndTime(selectedSlot)} <span className="font-normal text-muted-foreground">({slotDuration} dk)</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

/* ── Main Component ─────────────────────────────────── */
export function DentalBooking({ section, isEditing }: SectionComponentProps) {
  const p = section.props;
  const title = p.title || p.sectionTitle || 'Online Randevu';
  const subtitle = p.subtitle || p.sectionSubtitle || 'Hemen Başlayın';
  const description = p.description || p.sectionDescription || 'Birkaç adımda kolayca randevunuzu oluşturun.';
  const successMessage = p.successMessage || 'Randevunuz Alındı!';
  const submitText = p.submitButtonText || p.buttonText || 'Randevu Oluştur';

  // State
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotDuration, setSlotDuration] = useState(30);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [formFields, setFormFields] = useState<FormField[] | null>(null);
  const [consentRequired, setConsentRequired] = useState(true);
  const [consentText, setConsentText] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
  const [checkedWeeks, setCheckedWeeks] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const formLoadedAt = useRef('');

  const dates = useMemo(() => {
    const result: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d.toISOString().split('T')[0]);
    }
    return result;
  }, []);

  // Pre-check week availability (works in editor too now)
  useEffect(() => {
    if (checkedWeeks.has(weekOffset)) return;
    const projectId = (window as any).__PROJECT_ID__;
    const supabaseUrl = (window as any).__SUPABASE_URL__;
    if (!projectId || !supabaseUrl) return;
    const visible = dates.slice(weekOffset * 7, weekOffset * 7 + 7);
    if (!visible.length) return;
    setCheckedWeeks(prev => new Set(prev).add(weekOffset));
    Promise.allSettled(
      visible.map(d =>
        fetch(`${supabaseUrl}/functions/v1/book-appointment?project_id=${projectId}&date=${d}`)
          .then(r => r.json())
          .then(data => ({ date: d, slots: data.slots || [] }))
      )
    ).then(results => {
      const newU = new Set(unavailableDates);
      results.forEach(r => {
        if (r.status === 'fulfilled' && r.value.slots.length === 0) newU.add(r.value.date);
      });
      setUnavailableDates(newU);
    });
  }, [weekOffset, dates, checkedWeeks]);

  useEffect(() => {
    if (step === 2) formLoadedAt.current = new Date().toISOString();
  }, [step]);

  const fetchSlots = async (d: string) => {
    setSelectedDate(d);
    setSelectedSlot('');
    setSlotsLoading(true);
    setAvailableSlots([]);
    setFormFields(null);
    setStep(1);
    const projectId = (window as any).__PROJECT_ID__;
    const supabaseUrl = (window as any).__SUPABASE_URL__;
    if (!projectId || !supabaseUrl) { setSlotsLoading(false); return; }
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/book-appointment?project_id=${projectId}&date=${d}`);
      const data = await res.json();
      setAvailableSlots(data.slots || []);
      setSlotDuration(data.duration || 30);
      if (data.form_fields) setFormFields(data.form_fields);
      setConsentRequired(data.consent_required ?? true);
      setConsentText(data.consent_text || null);
    } catch {
      setAvailableSlots([]);
    }
    setSlotsLoading(false);
  };

  const selectSlot = (t: string) => {
    setSelectedSlot(t);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    if (!selectedDate || !selectedSlot) { setError('Lütfen tarih ve saat seçin'); return; }
    if (consentRequired && !consentChecked) { setError('Gizlilik onayını kabul etmelisiniz'); return; }

    // In editor mode, show demo success instead of real submission
    if (isEditing) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    try {
      const projectId = (window as any).__PROJECT_ID__;
      const supabaseUrl = (window as any).__SUPABASE_URL__;
      if (!projectId || !supabaseUrl) { setError('Sistem yapılandırılmamış'); setSubmitting(false); return; }
      const customData: Record<string, string> = {};
      const systemIds = new Set(['client_name', 'client_email', 'client_phone', 'client_note']);
      if (formFields) {
        for (const field of formFields) {
          if (!systemIds.has(field.id)) {
            const val = formData.get(field.id);
            if (val) customData[field.id] = String(val);
          }
        }
      }
      const res = await fetch(`${supabaseUrl}/functions/v1/book-appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          date: selectedDate,
          start_time: selectedSlot,
          client_name: formData.get('client_name'),
          client_email: formData.get('client_email'),
          client_phone: formData.get('client_phone'),
          client_note: formData.get('client_note'),
          form_data: Object.keys(customData).length > 0 ? customData : undefined,
          consent_given: consentChecked,
          honeypot: formData.get('_hp_field') || '',
          form_loaded_at: formLoadedAt.current,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Bir hata oluştu');
      else setSubmitted(true);
    } catch {
      setError('Bağlantı hatası');
    }
    setSubmitting(false);
  };

  const resetAll = () => {
    setSubmitted(false);
    setSelectedDate('');
    setSelectedSlot('');
    setConsentChecked(false);
    setStep(0);
    setError('');
  };

  const renderFormField = (field: FormField) => {
    const cls = 'w-full px-4 py-3 rounded-xl border border-input bg-background/60 backdrop-blur-sm text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground';
    if (field.type === 'textarea') return (
      <motion.div key={field.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: field.order * 0.05 }}>
        <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}{field.required && <span className="text-destructive ml-0.5">*</span>}</label>
        <textarea name={field.id} required={field.required} rows={3} className={`${cls} resize-none`} placeholder={field.placeholder || ''} />
      </motion.div>
    );
    if (field.type === 'select') return (
      <motion.div key={field.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: field.order * 0.05 }}>
        <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}{field.required && <span className="text-destructive ml-0.5">*</span>}</label>
        <select name={field.id} required={field.required} className={cls}>
          <option value="">Seçin...</option>
          {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </motion.div>
    );
    return (
      <motion.div key={field.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: field.order * 0.05 }}>
        <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}{field.required && <span className="text-destructive ml-0.5">*</span>}</label>
        <input name={field.id} type={field.type || 'text'} required={field.required} className={cls} placeholder={field.placeholder || ''} />
      </motion.div>
    );
  };

  const sortedFields = formFields ? [...formFields].sort((a, b) => a.order - b.order) : null;
  const systemFields = sortedFields?.filter(f => f.system) || [];
  const customFields = sortedFields?.filter(f => !f.system) || [];

  /* ── Live Component (works in both editor and public) ── */
  return (
    <section className="py-20 md:py-28 bg-background" id="appointment">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-3"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">{subtitle}</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{description}</p>
        </motion.div>

        <div className="max-w-lg mx-auto">
          <div className="bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl overflow-hidden">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16 px-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">{successMessage}</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {isEditing ? 'Bu bir demo önizlemesidir — gerçek randevu oluşturulmadı.' : 'En kısa sürede sizinle iletişime geçeceğiz.'}
                  </p>
                  <button onClick={resetAll} className="px-6 py-2.5 border border-border rounded-xl text-foreground text-sm hover:bg-muted transition-colors">
                    Yeni Randevu
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <form onSubmit={handleSubmit}>
                    <div className="p-6">
                      <StepIndicator current={step} />

                      {/* Honeypot */}
                      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                        <input type="text" name="_hp_field" tabIndex={-1} autoComplete="off" />
                      </div>

                      <AnimatePresence mode="wait">
                        {/* ── Step 0: Date ──────────────── */}
                        {step === 0 && (
                          <motion.div key="step-date" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                            <DateStrip
                              dates={dates}
                              selectedDate={selectedDate}
                              onSelect={fetchSlots}
                              weekOffset={weekOffset}
                              onWeekChange={(dir: number) => setWeekOffset(Math.max(0, weekOffset + dir))}
                              unavailableDates={unavailableDates}
                            />
                          </motion.div>
                        )}

                        {/* ── Step 1: Time (Premium) ─────── */}
                        {step === 1 && (
                          <motion.div key="step-time" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-foreground">Müsait Saatler</span>
                              </div>
                              <button type="button" onClick={() => { setStep(0); setSelectedDate(''); setSelectedSlot(''); }}
                                className="text-xs text-primary hover:underline">Tarihi Değiştir</button>
                            </div>

                            {/* Selected date badge */}
                            <div className="mb-5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-xs font-medium text-primary">
                              <Calendar className="w-3 h-3" />
                              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
                            </div>

                            {slotsLoading ? <SlotsSkeleton /> : (
                              <TimeSlotPicker
                                slots={availableSlots}
                                selectedSlot={selectedSlot}
                                onSelect={selectSlot}
                                slotDuration={slotDuration}
                                selectedDate={selectedDate}
                              />
                            )}
                          </motion.div>
                        )}

                        {/* ── Step 2: Info ──────────────── */}
                        {step === 2 && (
                          <motion.div key="step-info" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                            {/* Summary badges */}
                            <div className="flex flex-wrap gap-2 mb-5">
                              <button type="button" onClick={() => setStep(0)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                                <Calendar className="w-3 h-3" />
                                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                              </button>
                              <button type="button" onClick={() => setStep(1)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                                <Clock className="w-3 h-3" />
                                {selectedSlot}
                              </button>
                            </div>

                            <div className="space-y-3">
                              {sortedFields ? (
                                <>
                                  {systemFields.length > 0 && (
                                    <div className="grid sm:grid-cols-2 gap-3">
                                      {systemFields.map(renderFormField)}
                                    </div>
                                  )}
                                  {customFields.map(renderFormField)}
                                </>
                              ) : (
                                <>
                                  <div className="grid sm:grid-cols-2 gap-3">
                                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                                      <label className="block text-sm font-medium text-foreground mb-1.5">Adınız<span className="text-destructive ml-0.5">*</span></label>
                                      <input name="client_name" required className="w-full px-4 py-3 rounded-xl border border-input bg-background/60 backdrop-blur-sm text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground" placeholder="Adınız" />
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                                      <label className="block text-sm font-medium text-foreground mb-1.5">E-posta<span className="text-destructive ml-0.5">*</span></label>
                                      <input name="client_email" type="email" required className="w-full px-4 py-3 rounded-xl border border-input bg-background/60 backdrop-blur-sm text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground" placeholder="E-posta" />
                                    </motion.div>
                                  </div>
                                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Telefon</label>
                                    <input name="client_phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-input bg-background/60 backdrop-blur-sm text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground" placeholder="Telefon" />
                                  </motion.div>
                                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Not</label>
                                    <textarea name="client_note" rows={2} className="w-full px-4 py-3 rounded-xl border border-input bg-background/60 backdrop-blur-sm text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none placeholder:text-muted-foreground" placeholder="Eklemek istediğiniz not" />
                                  </motion.div>
                                </>
                              )}

                              {/* Consent */}
                              {consentRequired && (
                                <motion.label initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                  className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 cursor-pointer group">
                                  <input type="checkbox" checked={consentChecked} onChange={e => setConsentChecked(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded border-border accent-primary" />
                                  <span className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                                    {consentText || 'Kişisel verilerimin işlenmesini kabul ediyorum.'}
                                  </span>
                                </motion.label>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Error */}
                      {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm text-center mt-4">
                          {error}
                        </motion.p>
                      )}

                      {/* Submit button (only on step 2) */}
                      {step === 2 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-6 flex gap-3">
                          <button type="button" onClick={() => setStep(1)}
                            className="px-4 py-3 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors">
                            <ChevronLeft className="w-4 h-4 inline -mt-0.5 mr-1" />Geri
                          </button>
                          <button type="submit" disabled={submitting}
                            className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {submitting ? 'Gönderiliyor...' : submitText}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
