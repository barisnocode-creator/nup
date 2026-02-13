import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Clock, User, CheckCircle2 } from "lucide-react";

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

export type AppointmentBookingProps = {
  styles: ChaiStyles;
  sectionTitle: string;
  sectionSubtitle: string;
  sectionDescription: string;
  submitButtonText: string;
  successMessage: string;
} & CommonStyleProps;

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { icon: Calendar, label: "Tarih" },
    { icon: Clock, label: "Saat" },
    { icon: User, label: "Bilgiler" },
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = currentStep >= i + 1;
        const isCurrent = currentStep === i + 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className={`h-px w-8 transition-colors duration-300 ${isActive ? "bg-primary" : "bg-border"}`} />
            )}
            <div className="flex items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isCurrent ? "bg-primary text-primary-foreground shadow-lg scale-110" :
                isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}>{step.label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Date strip component
const DateStrip = ({ dates, selectedDate, onSelect, weekOffset, onWeekChange }: {
  dates: string[];
  selectedDate: string;
  onSelect: (d: string) => void;
  weekOffset: number;
  onWeekChange: (dir: number) => void;
}) => {
  const visibleDates = dates.slice(weekOffset * 7, weekOffset * 7 + 7);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => onWeekChange(-1)} disabled={weekOffset === 0}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-border hover:bg-muted transition disabled:opacity-30">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          {visibleDates.length > 0 && new Date(visibleDates[0] + "T00:00:00").toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
        </span>
        <button type="button" onClick={() => onWeekChange(1)} disabled={weekOffset >= Math.floor(dates.length / 7) - 1}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-border hover:bg-muted transition disabled:opacity-30">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {visibleDates.map(d => {
          const dateObj = new Date(d + "T00:00:00");
          const dayName = dateObj.toLocaleDateString("tr-TR", { weekday: "short" });
          const dayNum = dateObj.getDate();
          const isSelected = selectedDate === d;
          return (
            <button key={d} type="button" onClick={() => onSelect(d)}
              className={`flex flex-col items-center py-3 px-1 rounded-xl transition-all duration-200 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "hover:bg-muted border border-transparent hover:border-border"
              }`}>
              <span className={`text-[10px] uppercase tracking-wider mb-1 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {dayName}
              </span>
              <span className={`text-lg font-semibold ${isSelected ? "" : "text-foreground"}`}>{dayNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AppointmentBookingBlock = (props: ChaiBlockComponentProps<AppointmentBookingProps>) => {
  const { 
    blockProps, 
    sectionTitle,
    sectionSubtitle,
    sectionDescription,
    submitButtonText,
    successMessage,
    inBuilder,
    ...styleProps
  } = props;

  const s = resolveStyles(styleProps);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formFields, setFormFields] = useState<FormField[] | null>(null);
  const [consentRequired, setConsentRequired] = useState(true);
  const [consentText, setConsentText] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const formLoadedAt = useRef<string>("");

  const currentStep = !selectedDate ? 1 : !selectedSlot ? 2 : 3;

  const dates = React.useMemo(() => {
    const result: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d.toISOString().split("T")[0]);
    }
    return result;
  }, []);

  useEffect(() => {
    if (selectedSlot) formLoadedAt.current = new Date().toISOString();
  }, [selectedSlot]);

  if (inBuilder) {
    return (
      <section {...blockProps} className={`${s.sectionPadding} ${s.bgColor}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            {sectionSubtitle && (
              <span className={`inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium ${s.subtitleTransform} mb-3`}>
                {sectionSubtitle}
              </span>
            )}
            <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} text-center`}>{sectionTitle}</h2>
            {sectionDescription && <p className={`${s.descSize} ${s.descColor} max-w-2xl mx-auto mt-3`}>{sectionDescription}</p>}
          </div>
          <div className="max-w-xl mx-auto rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
            <div className="p-6">
              <StepIndicator currentStep={2} />
              <div className="grid grid-cols-7 gap-1.5 mb-6">
                {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d, i) => (
                  <div key={d} className={`flex flex-col items-center py-3 rounded-xl ${i === 2 ? "bg-primary text-primary-foreground shadow-lg" : "border border-transparent"}`}>
                    <span className={`text-[10px] uppercase mb-1 ${i === 2 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{d}</span>
                    <span className={`text-lg font-semibold ${i === 2 ? "" : "text-foreground"}`}>{15 + i}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {["09:00", "09:30", "10:00", "10:30", "11:00", "14:00"].map((t, i) => (
                  <button key={t} disabled className={`py-2.5 rounded-full text-sm font-medium transition ${
                    i === 1 ? "bg-primary text-primary-foreground shadow-md" : "border border-border text-foreground hover:border-primary/50"
                  }`}>{t}</button>
                ))}
              </div>
              <div className="space-y-3">
                <input disabled className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm" placeholder="Adınızı girin" />
                <input disabled className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm" placeholder="E-posta adresiniz" />
              </div>
            </div>
            <div className="px-6 pb-6">
              <button disabled className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm">{submitButtonText}</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const fetchSlots = async (d: string) => {
    setSelectedDate(d);
    setSelectedSlot("");
    setAvailableSlots([]);
    setFormFields(null);
    const projectId = (window as any).__PROJECT_ID__;
    const supabaseUrl = (window as any).__SUPABASE_URL__;
    if (!projectId || !supabaseUrl) return;
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/book-appointment?project_id=${projectId}&date=${d}`);
      const data = await res.json();
      setAvailableSlots(data.slots || []);
      setSlotDuration(data.duration || 30);
      if (data.form_fields) setFormFields(data.form_fields);
      setConsentRequired(data.consent_required ?? true);
      setConsentText(data.consent_text || null);
    } catch { setAvailableSlots([]); }
  };

  const renderFormField = (field: FormField) => {
    const inputClass = "w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
    
    switch (field.type) {
      case "textarea":
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-1.5">{field.label} {field.required && "*"}</label>
            <textarea name={field.id} required={field.required} rows={3} className={`${inputClass} resize-none`} placeholder={field.placeholder || ""} />
          </div>
        );
      case "select":
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-1.5">{field.label} {field.required && "*"}</label>
            <select name={field.id} required={field.required} className={inputClass}>
              <option value="">Seçin...</option>
              {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        );
      default:
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-1.5">{field.label} {field.required && "*"}</label>
            <input name={field.id} type={field.type || "text"} required={field.required} className={inputClass} placeholder={field.placeholder || ""} />
          </div>
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    if (!selectedDate || !selectedSlot) { setError("Lütfen tarih ve saat seçin"); return; }
    if (consentRequired && !consentChecked) { setError("Gizlilik onayını kabul etmelisiniz"); return; }

    setLoading(true);
    try {
      const projectId = (window as any).__PROJECT_ID__;
      if (!projectId) { setError("Randevu sistemi yapılandırılmamış"); setLoading(false); return; }
      const supabaseUrl = (window as any).__SUPABASE_URL__;

      const customData: Record<string, string> = {};
      const systemIds = new Set(["client_name", "client_email", "client_phone", "client_note"]);
      if (formFields) {
        for (const field of formFields) {
          if (!systemIds.has(field.id)) {
            const val = formData.get(field.id);
            if (val) customData[field.id] = String(val);
          }
        }
      }

      const res = await fetch(`${supabaseUrl}/functions/v1/book-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          date: selectedDate,
          start_time: selectedSlot,
          client_name: formData.get("client_name"),
          client_email: formData.get("client_email"),
          client_phone: formData.get("client_phone"),
          client_note: formData.get("client_note"),
          form_data: Object.keys(customData).length > 0 ? customData : undefined,
          consent_given: consentChecked,
          honeypot: formData.get("_hp_field") || "",
          form_loaded_at: formLoadedAt.current,
        }),
      });

      const data = await res.json();
      if (!res.ok) setError(data.error || "Bir hata oluştu");
      else setSubmitted(true);
    } catch {
      setError("Bağlantı hatası, lütfen tekrar deneyin");
    }
    setLoading(false);
  };

  const sortedFields = formFields ? [...formFields].sort((a, b) => a.order - b.order) : null;
  const systemFields = sortedFields?.filter(f => f.system) || [];
  const customFields = sortedFields?.filter(f => !f.system) || [];

  return (
    <section {...blockProps} className={`${s.sectionPadding} ${s.bgColor}`} id="appointment">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          {sectionSubtitle && (
            <span className={`inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium ${s.subtitleTransform} mb-3`}>
              {sectionSubtitle}
            </span>
          )}
          <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} text-center`}>{sectionTitle}</h2>
          {sectionDescription && <p className={`${s.descSize} ${s.descColor} max-w-2xl mx-auto mt-3`}>{sectionDescription}</p>}
        </div>

        <div className="max-w-xl mx-auto rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 px-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{successMessage}</h3>
                <p className="text-muted-foreground text-sm mb-6">En kısa sürede sizinle iletişime geçeceğiz.</p>
                <button onClick={() => { setSubmitted(false); setSelectedDate(""); setSelectedSlot(""); setConsentChecked(false); }}
                  className="px-6 py-2.5 border border-border rounded-xl text-foreground text-sm hover:bg-muted transition">
                  Yeni Randevu
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <form onSubmit={handleSubmit}>
                  <div className="p-6">
                    <StepIndicator currentStep={currentStep} />
                    
                    {/* Honeypot */}
                    <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                      <input type="text" name="_hp_field" tabIndex={-1} autoComplete="off" />
                    </div>

                    {/* Date selection */}
                    <DateStrip dates={dates} selectedDate={selectedDate} onSelect={fetchSlots}
                      weekOffset={weekOffset} onWeekChange={(dir) => setWeekOffset(Math.max(0, weekOffset + dir))} />

                    {/* Time selection */}
                    <AnimatePresence>
                      {selectedDate && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="pt-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Clock className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">Saat Seçin <span className="text-muted-foreground font-normal">({slotDuration} dk)</span></span>
                            </div>
                            {availableSlots.length === 0 ? (
                              <p className="text-muted-foreground text-sm py-4 text-center">Bu tarihte müsait saat bulunmuyor.</p>
                            ) : (
                              <div className="grid grid-cols-3 gap-2">
                                {availableSlots.map(t => (
                                  <button key={t} type="button" onClick={() => setSelectedSlot(t)}
                                    className={`py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                      selectedSlot === t
                                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                                        : "border border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                                    }`}>
                                    {t}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Form fields */}
                    <AnimatePresence>
                      {selectedSlot && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="pt-6 space-y-3">
                            {sortedFields ? (
                              <>
                                {systemFields.length > 0 && <div className="grid sm:grid-cols-2 gap-3">{systemFields.map(renderFormField)}</div>}
                                {customFields.map(renderFormField)}
                              </>
                            ) : (
                              <>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Adınız *</label>
                                    <input name="client_name" required className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" placeholder="Adınızı girin" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">E-posta *</label>
                                    <input name="client_email" type="email" required className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" placeholder="E-posta adresiniz" />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-foreground mb-1.5">Telefon</label>
                                  <input name="client_phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" placeholder="Telefon numaranız" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-foreground mb-1.5">Not</label>
                                  <textarea name="client_note" rows={3} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" placeholder="Eklemek istediğiniz not..." />
                                </div>
                              </>
                            )}

                            {consentRequired && consentText && (
                              <div className="flex items-start gap-3 pt-1">
                                <input type="checkbox" id="consent" checked={consentChecked}
                                  onChange={(e) => setConsentChecked(e.target.checked)}
                                  className="mt-0.5 h-4 w-4 rounded border-input accent-primary" />
                                <label htmlFor="consent" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">{consentText}</label>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {error && (
                      <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
                    )}
                  </div>

                  <div className="px-6 pb-6">
                    <button type="submit"
                      disabled={!selectedDate || !selectedSlot || loading || (consentRequired && !consentChecked)}
                      className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      {loading ? "Gönderiliyor..." : submitButtonText}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(AppointmentBookingBlock, {
  type: "AppointmentBooking",
  label: "Randevu Formu",
  category: "appointment",
  group: "sections",
  inlineEditProps: ['sectionTitle', 'sectionSubtitle', 'sectionDescription'],
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-background"),
      sectionTitle: builderProp({
        type: "string",
        title: "Bölüm Başlığı",
        default: "Randevu Alın",
      }),
      sectionSubtitle: builderProp({
        type: "string",
        title: "Bölüm Alt Başlığı",
        default: "Randevu",
      }),
      sectionDescription: builderProp({
        type: "string",
        title: "Açıklama",
        default: "Size en uygun tarih ve saati seçerek kolayca randevu alabilirsiniz.",
        ui: { "ui:widget": "textarea" },
      }),
      submitButtonText: builderProp({
        type: "string",
        title: "Gönder Butonu Metni",
        default: "Randevu Oluştur",
      }),
      successMessage: builderProp({
        type: "string",
        title: "Başarı Mesajı",
        default: "Randevunuz başarıyla oluşturuldu!",
      }),
      ...commonStyleSchemaProps({ bgColor: "muted", textAlign: "center" }),
    },
  },
});

export { AppointmentBookingBlock };
