import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SiteSection } from '@/components/sections/types';
import type { StyleProps } from '@/components/sections/styleUtils';

interface SectionEditPanelProps {
  section: SiteSection;
  onUpdateProps: (props: Record<string, any>) => void;
  onUpdateStyle: (style: Record<string, any>) => void;
  onClose: () => void;
}

const sectionTypeLabels: Record<string, string> = {
  'hero-centered': 'Hero (Ortala)',
  'hero-split': 'Hero (İki Parça)',
  'hero-overlay': 'Hero (Overlay)',
  'HeroCafe': 'Hero Cafe',
  'services-grid': 'Hizmetler',
  'about-section': 'Hakkımızda',
  'statistics-counter': 'İstatistikler',
  'testimonials-carousel': 'Müşteri Yorumları',
  'TestimonialsCarousel': 'Müşteri Yorumları',
  'contact-form': 'İletişim Formu',
  'ContactForm': 'İletişim Formu',
  'cta-banner': 'Aksiyon Çağrısı',
  'CTABanner': 'Aksiyon Çağrısı',
  'faq-accordion': 'SSS',
  'image-gallery': 'Galeri',
  'pricing-table': 'Fiyatlandırma',
  'appointment-booking': 'Randevu',
  'AppointmentBooking': 'Randevu',
  'MenuShowcase': 'Menü',
  'CafeStory': 'Hikaye',
  'CafeFeatures': 'Özellikler',
  'CafeGallery': 'Galeri',
};

export function SectionEditPanel({ section, onUpdateProps, onUpdateStyle, onClose }: SectionEditPanelProps) {
  const label = sectionTypeLabels[section.type] || section.type;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed top-14 right-0 bottom-0 w-[360px] bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-700 shadow-lg z-40 flex flex-col overflow-hidden"
      role="region"
      aria-label="Bölüm düzenleme paneli"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      tabIndex={-1}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-700 shrink-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid grid-cols-2 mx-4 mt-3 shrink-0 bg-gray-100 dark:bg-zinc-800">
          <TabsTrigger value="content" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">İçerik</TabsTrigger>
          <TabsTrigger value="style" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">Stil</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 overflow-y-auto p-4 space-y-4">
          <ContentFields section={section} onUpdateProps={onUpdateProps} />
        </TabsContent>

        <TabsContent value="style" className="flex-1 overflow-y-auto p-4 space-y-4">
          <StyleFields section={section} onUpdateStyle={onUpdateStyle} />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-zinc-700 shrink-0">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Tamam
        </button>
      </div>
    </motion.div>
  );
}

// Dynamic content fields based on section props
function ContentFields({ section, onUpdateProps }: { section: SiteSection; onUpdateProps: (props: Record<string, any>) => void }) {
  const props = section.props || {};

  const labelMap: Record<string, string> = {
    title: 'Başlık', subtitle: 'Alt Başlık', description: 'Açıklama',
    sectionTitle: 'Bölüm Başlığı', sectionSubtitle: 'Bölüm Alt Başlığı', sectionDescription: 'Bölüm Açıklaması',
    primaryButtonText: 'Ana Buton', primaryButtonLink: 'Ana Buton Linki',
    secondaryButtonText: 'İkinci Buton', secondaryButtonLink: 'İkinci Buton Linki',
    buttonText: 'Buton Metni', buttonLink: 'Buton Linki',
    backgroundImage: 'Arka Plan Görseli', image: 'Görsel', imagePosition: 'Görsel Konumu',
    features: 'Özellikler', address: 'Adres', phone: 'Telefon', email: 'E-posta',
    submitButtonText: 'Gönder Butonu', successMessage: 'Başarı Mesajı', siteName: 'Site Adı',
    badge: 'Rozet', floatingBadge: 'Yüzen Rozet', floatingBadgeSubtext: 'Rozet Alt Metin',
  };

  const textareaFields = ['description', 'sectionDescription', 'features', 'content'];
  const skipFields = ['services', 'testimonials', 'items', 'stats', 'images', 'plans', 'infoItems'];

  const entries = Object.entries(props).filter(([key, val]) => {
    if (skipFields.includes(key)) return false;
    if (typeof val === 'object' && val !== null) return false;
    return true;
  });

  return (
    <>
      {entries.map(([key, value]) => {
        const label = labelMap[key] || key;
        const isTextarea = textareaFields.some(f => key.toLowerCase().includes(f));

        if (key === 'imagePosition') {
          return (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
              <Select value={String(value)} onValueChange={(v) => onUpdateProps({ [key]: v })}>
                <SelectTrigger className="text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 z-[50]">
                  <SelectItem value="left">Sol</SelectItem>
                  <SelectItem value="right">Sağ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          );
        }

        return (
          <div key={key} className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
            {isTextarea ? (
              <Textarea
                value={String(value || '')}
                onChange={(e) => onUpdateProps({ [key]: e.target.value })}
                className="text-sm min-h-[80px] resize-y bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
              />
            ) : (
              <Input
                value={String(value || '')}
                onChange={(e) => onUpdateProps({ [key]: e.target.value })}
                className="text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
              />
            )}
          </div>
        );
      })}

      {entries.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Bu bölüm için düzenlenebilir alan bulunmuyor.
        </p>
      )}
    </>
  );
}

// Style editing fields
function StyleFields({ section, onUpdateStyle }: { section: SiteSection; onUpdateStyle: (style: Record<string, any>) => void }) {
  const style = (section.style || {}) as StyleProps;

  const selectClasses = "text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700";
  const contentClasses = "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 z-[50]";

  return (
    <>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Başlık Boyutu</label>
        <Select value={style.titleSize || 'default'} onValueChange={(v) => onUpdateStyle({ titleSize: v })}>
          <SelectTrigger className={selectClasses}><SelectValue /></SelectTrigger>
          <SelectContent className={contentClasses}>
            <SelectItem value="small">Küçük</SelectItem>
            <SelectItem value="default">Varsayılan</SelectItem>
            <SelectItem value="large">Büyük</SelectItem>
            <SelectItem value="xl">Çok Büyük</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Başlık Kalınlığı</label>
        <Select value={style.titleWeight || 'bold'} onValueChange={(v) => onUpdateStyle({ titleWeight: v })}>
          <SelectTrigger className={selectClasses}><SelectValue /></SelectTrigger>
          <SelectContent className={contentClasses}>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="medium">Orta</SelectItem>
            <SelectItem value="semibold">Yarı Kalın</SelectItem>
            <SelectItem value="bold">Kalın</SelectItem>
            <SelectItem value="extrabold">Çok Kalın</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Arka Plan</label>
        <Select value={style.bgColor || 'background'} onValueChange={(v) => onUpdateStyle({ bgColor: v })}>
          <SelectTrigger className={selectClasses}><SelectValue /></SelectTrigger>
          <SelectContent className={contentClasses}>
            <SelectItem value="background">Varsayılan</SelectItem>
            <SelectItem value="muted">Açık</SelectItem>
            <SelectItem value="primary">Ana Renk</SelectItem>
            <SelectItem value="secondary">İkincil</SelectItem>
            <SelectItem value="card">Kart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Metin Hizası</label>
        <Select value={style.textAlign || 'center'} onValueChange={(v) => onUpdateStyle({ textAlign: v })}>
          <SelectTrigger className={selectClasses}><SelectValue /></SelectTrigger>
          <SelectContent className={contentClasses}>
            <SelectItem value="left">Sol</SelectItem>
            <SelectItem value="center">Orta</SelectItem>
            <SelectItem value="right">Sağ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">İç Boşluk</label>
        <Select value={style.sectionPadding || 'default'} onValueChange={(v) => onUpdateStyle({ sectionPadding: v })}>
          <SelectTrigger className={selectClasses}><SelectValue /></SelectTrigger>
          <SelectContent className={contentClasses}>
            <SelectItem value="compact">Az</SelectItem>
            <SelectItem value="default">Varsayılan</SelectItem>
            <SelectItem value="spacious">Geniş</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
