import { Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface AddableToggle {
  key: string;
  label: string;
  sectorOnly?: string[];
}

const universalToggles: AddableToggle[] = [
  { key: 'appointment', label: 'Randevu / Rezervasyon Formu' },
  { key: 'faq', label: 'Sık Sorulan Sorular (FAQ)' },
  { key: 'messageForm', label: 'Mesaj Bırak / İletişim Formu' },
  { key: 'workingHours', label: 'Çalışma Saatleri & Harita' },
];

const sectorToggles: AddableToggle[] = [
  { key: 'onlineConsultation', label: 'Online Konsültasyon', sectorOnly: ['doctor', 'dentist', 'pharmacy'] },
  { key: 'insurance', label: 'Anlaşmalı Sigorta Şirketleri', sectorOnly: ['doctor', 'dentist'] },
  { key: 'menuHighlights', label: 'Menü Öne Çıkanlar', sectorOnly: ['restaurant', 'cafe'] },
  { key: 'roomAvailability', label: 'Oda Müsaitliği', sectorOnly: ['hotel'] },
  { key: 'caseEvaluation', label: 'Ücretsiz Hukuki Değerlendirme', sectorOnly: ['lawyer'] },
  { key: 'beforeAfter', label: 'Önce & Sonra Galerisi', sectorOnly: ['beauty_salon', 'gym'] },
  { key: 'petRegistration', label: 'Hasta Kaydı (Evcil Hayvan)', sectorOnly: ['veterinary'] },
];

interface AddableSectionsPanelProps {
  sector?: string;
  addableSections: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export function AddableSectionsPanel({ sector, addableSections, onToggle }: AddableSectionsPanelProps) {
  const normalizedSector = sector?.toLowerCase().replace(/[\s-]/g, '_') || '';

  const visibleSectorToggles = sectorToggles.filter(
    t => t.sectorOnly?.includes(normalizedSector)
  );

  return (
    <div className="mx-4 my-8 border-2 border-dashed border-blue-300/50 rounded-2xl bg-blue-50/30 dark:bg-blue-950/10 p-6">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-foreground">Sayfanıza Eklenebilir Bölümler</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Bu bölümleri tek tıkla ekleyip kaldırabilirsiniz.</p>

      <div className="space-y-3">
        {universalToggles.map(t => (
          <ToggleRow key={t.key} label={t.label} checked={!!addableSections[t.key]} onToggle={() => onToggle(t.key)} />
        ))}

        {visibleSectorToggles.length > 0 && (
          <>
            <div className="flex items-center gap-3 pt-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sektörünüze Özel</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            {visibleSectorToggles.map(t => (
              <ToggleRow key={t.key} label={t.label} checked={!!addableSections[t.key]} onToggle={() => onToggle(t.key)} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <div
      className="flex items-center justify-between py-3 px-4 rounded-xl bg-card border border-border/50 hover:border-border transition-colors cursor-pointer"
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={() => onToggle()} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
