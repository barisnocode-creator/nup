import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";
import React, { useState, useEffect, useRef } from "react";

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
  const formLoadedAt = useRef<string>("");

  const dates = React.useMemo(() => {
    const result: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d.toISOString().split("T")[0]);
    }
    return result;
  }, []);

  // Record form load time when slot is selected
  useEffect(() => {
    if (selectedSlot) {
      formLoadedAt.current = new Date().toISOString();
    }
  }, [selectedSlot]);

  if (inBuilder) {
    return (
      <section {...blockProps} className={`${s.sectionPadding} ${s.bgColor}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            {sectionSubtitle && (
              <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium ${s.subtitleTransform} mb-4`}>
                {sectionSubtitle}
              </span>
            )}
            <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} text-center`}>
              {sectionTitle}
            </h2>
            {sectionDescription && (
              <p className={`${s.descSize} ${s.descColor} max-w-2xl mx-auto mt-4`}>
                {sectionDescription}
              </p>
            )}
          </div>
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-card border border-border">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">📅 Tarih Seçin</label>
                <div className="flex gap-2 flex-wrap">
                  {["2025-03-15", "2025-03-16", "2025-03-17"].map(d => (
                    <button key={d} className="px-3 py-2 rounded-lg border border-border text-sm text-foreground bg-background hover:bg-primary/10">
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">🕐 Saat Seçin</label>
                <div className="flex gap-2 flex-wrap">
                  {["09:00", "09:30", "10:00"].map(t => (
                    <button key={t} className="px-3 py-2 rounded-lg border border-border text-sm text-foreground bg-background hover:bg-primary/10">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Adınız *</label>
                  <input disabled className="w-full px-4 py-3 rounded-lg border border-input bg-background" placeholder="Adınızı girin" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">E-posta *</label>
                  <input disabled className="w-full px-4 py-3 rounded-lg border border-input bg-background" placeholder="E-posta adresiniz" />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" disabled className="mt-1" />
                <span className="text-sm text-muted-foreground">Kişisel verilerimin işlenmesini kabul ediyorum.</span>
              </div>
              <button disabled className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-medium">
                {submitButtonText}
              </button>
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
    const inputClass = "w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary";
    
    switch (field.type) {
      case "textarea":
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label} {field.required && "*"}
            </label>
            <textarea
              name={field.id}
              required={field.required}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder={field.placeholder || ""}
            />
          </div>
        );
      case "select":
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label} {field.required && "*"}
            </label>
            <select name={field.id} required={field.required} className={inputClass}>
              <option value="">Seçin...</option>
              {(field.options || []).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );
      default:
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label} {field.required && "*"}
            </label>
            <input
              name={field.id}
              type={field.type || "text"}
              required={field.required}
              className={inputClass}
              placeholder={field.placeholder || ""}
            />
          </div>
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    if (!selectedDate || !selectedSlot) {
      setError("Lütfen tarih ve saat seçin");
      return;
    }

    if (consentRequired && !consentChecked) {
      setError("Gizlilik onayını kabul etmelisiniz");
      return;
    }

    setLoading(true);
    try {
      const projectId = (window as any).__PROJECT_ID__;
      if (!projectId) { setError("Randevu sistemi yapılandırılmamış"); setLoading(false); return; }

      const supabaseUrl = (window as any).__SUPABASE_URL__;

      // Build form_data from custom fields
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
      if (!res.ok) {
        setError(data.error || "Bir hata oluştu");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Bağlantı hatası, lütfen tekrar deneyin");
    }
    setLoading(false);
  };

  // Separate system fields and custom fields
  const sortedFields = formFields
    ? [...formFields].sort((a, b) => a.order - b.order)
    : null;

  const systemFields = sortedFields?.filter(f => f.system) || [];
  const customFields = sortedFields?.filter(f => !f.system) || [];

  return (
    <section {...blockProps} className={`${s.sectionPadding} ${s.bgColor}`} id="appointment">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          {sectionSubtitle && (
            <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium ${s.subtitleTransform} mb-4`}>
              {sectionSubtitle}
            </span>
          )}
          <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} text-center`}>
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className={`${s.descSize} ${s.descColor} max-w-2xl mx-auto mt-4`}>
              {sectionDescription}
            </p>
          )}
        </div>

        <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-card border border-border">
          {submitted ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{successMessage}</h3>
              <p className="text-muted-foreground">En kısa sürede sizinle iletişime geçeceğiz.</p>
              <button 
                onClick={() => { setSubmitted(false); setSelectedDate(""); setSelectedSlot(""); setConsentChecked(false); }}
                className="mt-6 px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition"
              >
                Yeni Randevu
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-6">
              {/* Honeypot - hidden from users */}
              <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                <input type="text" name="_hp_field" tabIndex={-1} autoComplete="off" />
              </div>

              {/* Date selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">📅 Tarih Seçin</label>
                <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                  {dates.map(d => {
                    const dateObj = new Date(d + "T00:00:00");
                    const label = dateObj.toLocaleDateString("tr-TR", { day: "numeric", month: "short", weekday: "short" });
                    return (
                      <button
                        key={d} type="button" onClick={() => fetchSlots(d)}
                        className={`px-3 py-2 rounded-lg border text-sm transition ${
                          selectedDate === d 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "border-border text-foreground bg-background hover:bg-primary/10"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">🕐 Saat Seçin ({slotDuration} dakika)</label>
                  {availableSlots.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Bu tarihte müsait saat bulunmuyor.</p>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      {availableSlots.map(t => (
                        <button key={t} type="button" onClick={() => setSelectedSlot(t)}
                          className={`px-4 py-2 rounded-lg border text-sm transition ${
                            selectedSlot === t
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-foreground bg-background hover:bg-primary/10"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic form fields */}
              {selectedSlot && (
                <>
                  {sortedFields ? (
                    <>
                      {/* System fields in grid */}
                      {systemFields.length > 0 && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {systemFields.map(renderFormField)}
                        </div>
                      )}
                      {/* Custom fields */}
                      {customFields.map(renderFormField)}
                    </>
                  ) : (
                    /* Fallback: static fields */
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Adınız *</label>
                          <input name="client_name" required className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Adınızı girin" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">E-posta *</label>
                          <input name="client_email" type="email" required className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="E-posta adresiniz" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Telefon</label>
                        <input name="client_phone" type="tel" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Telefon numaranız" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Not</label>
                        <textarea name="client_note" rows={3} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Eklemek istediğiniz not..." />
                      </div>
                    </>
                  )}

                  {/* Consent checkbox */}
                  {consentRequired && consentText && (
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-input"
                      />
                      <label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                        {consentText}
                      </label>
                    </div>
                  )}
                </>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={!selectedDate || !selectedSlot || loading || (consentRequired && !consentChecked)}
                className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Gönderiliyor..." : submitButtonText}
              </button>
            </form>
          )}
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
