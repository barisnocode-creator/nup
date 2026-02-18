import { useState } from 'react';
import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';
import { toast } from 'sonner';

export function ContactForm({ section, isEditing }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const [submitting, setSubmitting] = useState(false);

  const projectId = (window as any).__PROJECT_ID__;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing || !projectId) return;
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-contact-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, name: formData.get('name'), email: formData.get('email'), subject: formData.get('subject'), message: formData.get('message') }),
      });
      const data = await res.json();
      if (data.success) { toast.success('Mesajınız alındı!'); form.reset(); }
      else toast.error(data.error || 'Bir hata oluştu.');
    } catch { toast.error('Bir hata oluştu.'); }
    finally { setSubmitting(false); }
  };

  return (
    <section className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            {props.sectionSubtitle && <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium ${s.subtitleTransform}`}>{props.sectionSubtitle}</span>}
            <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} text-${s.textAlign}`}>{props.sectionTitle}</h2>
            {props.sectionDescription && <p className={`${s.descSize} ${s.descColor} max-w-md`}>{props.sectionDescription}</p>}
            <div className="space-y-6 pt-4">
              {props.email && <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><span className="text-xl">📧</span></div><div><div className="text-sm text-muted-foreground">E-posta</div><div className="font-medium text-foreground">{props.email}</div></div></div>}
              {props.phone && <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><span className="text-xl">📞</span></div><div><div className="text-sm text-muted-foreground">Telefon</div><div className="font-medium text-foreground">{props.phone}</div></div></div>}
              {props.address && <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><span className="text-xl">📍</span></div><div><div className="text-sm text-muted-foreground">Adres</div><div className="font-medium text-foreground">{props.address}</div></div></div>}
            </div>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-foreground mb-2">Adınız</label><input type="text" name="name" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Adınızı girin" disabled={isEditing} required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-2">E-posta</label><input type="email" name="email" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="E-posta adresiniz" disabled={isEditing} required /></div>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Konu</label><input type="text" name="subject" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Konu başlığı" disabled={isEditing} /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Mesajınız</label><textarea name="message" rows={5} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Mesajınızı yazın..." disabled={isEditing} required /></div>
              <button type="submit" className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors" disabled={isEditing || submitting}>
                {submitting ? 'Gönderiliyor...' : props.submitButtonText || 'Mesaj Gönder'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
