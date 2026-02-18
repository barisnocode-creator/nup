import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { sectionCatalog } from '@/components/sections/registry';

interface AddSectionPanelProps {
  onAdd: (type: string, defaultProps: Record<string, any>) => void;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  hero: 'Hero',
  content: 'İçerik',
  contact: 'İletişim',
  cta: 'Aksiyon',
  natural: 'Natural',
};

// Default props for each section type
const defaultPropsMap: Record<string, Record<string, any>> = {
  'hero-centered': {
    title: 'Başlığınız',
    subtitle: 'Alt başlık',
    description: 'Açıklama metniniz buraya gelecek.',
    primaryButtonText: 'İletişime Geç',
    primaryButtonLink: '#contact',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    backgroundImage: '',
  },
  'hero-split': {
    title: 'Başlığınız',
    subtitle: 'Alt başlık',
    description: 'Açıklama metniniz buraya gelecek.',
    primaryButtonText: 'Başlayın',
    primaryButtonLink: '#contact',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    image: '',
  },
  'hero-overlay': {
    title: 'Başlığınız',
    subtitle: 'Alt başlık',
    description: 'Açıklama metniniz buraya gelecek.',
    primaryButtonText: 'Keşfedin',
    primaryButtonLink: '#services',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    backgroundImage: '',
  },
  'services-grid': {
    sectionTitle: 'Hizmetlerimiz',
    sectionSubtitle: 'Neler Yapıyoruz',
    sectionDescription: '',
    services: [
      { icon: '⭐', title: 'Hizmet 1', description: 'Açıklama', image: '' },
      { icon: '🎯', title: 'Hizmet 2', description: 'Açıklama', image: '' },
      { icon: '💡', title: 'Hizmet 3', description: 'Açıklama', image: '' },
    ],
  },
  'about-section': {
    title: 'Hakkımızda',
    subtitle: 'Biz Kimiz?',
    description: 'Şirketiniz hakkında bilgi.',
    features: 'Deneyim\nKalite\nGüven',
    image: '',
    imagePosition: 'right',
  },
  'statistics-counter': {
    stat1Value: '10+', stat1Label: 'Yıl Deneyim',
    stat2Value: '500+', stat2Label: 'Mutlu Müşteri',
    stat3Value: '100+', stat3Label: 'Proje',
    stat4Value: '%99', stat4Label: 'Memnuniyet',
  },
  'testimonials-carousel': {
    sectionTitle: 'Müşteri Yorumları',
    sectionSubtitle: 'Referanslar',
    testimonials: [
      { name: 'Müşteri', role: 'CEO', content: 'Harika bir deneyim.', avatar: '' },
    ],
  },
  'contact-form': {
    sectionTitle: 'İletişim',
    sectionSubtitle: 'Bize Ulaşın',
    sectionDescription: '',
    address: '',
    phone: '',
    email: '',
    submitButtonText: 'Mesaj Gönder',
  },
  'cta-banner': {
    title: 'Hemen Başlayalım',
    description: 'Sizinle çalışmak için sabırsızlanıyoruz.',
    buttonText: 'İletişime Geç',
    buttonLink: '#contact',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    backgroundImage: '',
  },
  'faq-accordion': {
    sectionTitle: 'Sıkça Sorulan Sorular',
    sectionSubtitle: 'SSS',
    items: [
      { question: 'Soru 1?', answer: 'Cevap 1.' },
      { question: 'Soru 2?', answer: 'Cevap 2.' },
    ],
  },
  'image-gallery': {
    sectionTitle: 'Galeri',
    sectionSubtitle: 'Çalışmalarımız',
    images: [],
  },
  'pricing-table': {
    sectionTitle: 'Fiyatlandırma',
    sectionSubtitle: 'Planlar',
    plans: [
      { name: 'Başlangıç', price: '₺99/ay', features: ['Özellik 1', 'Özellik 2'], highlighted: false },
      { name: 'Profesyonel', price: '₺199/ay', features: ['Özellik 1', 'Özellik 2', 'Özellik 3'], highlighted: true },
    ],
  },
  'appointment-booking': {
    sectionTitle: 'Randevu Alın',
    sectionSubtitle: 'Randevu',
    sectionDescription: 'Size uygun tarih ve saati seçin.',
    submitButtonText: 'Randevu Oluştur',
    successMessage: 'Randevunuz oluşturuldu!',
  },
};

export function AddSectionPanel({ onAdd, onClose }: AddSectionPanelProps) {
  // Group by category
  const grouped = sectionCatalog.reduce<Record<string, typeof sectionCatalog>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed top-14 left-0 bottom-0 w-[280px] bg-background border-r border-border shadow-2xl z-30 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Bölüm Ekle</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {categoryLabels[category] || category}
            </h4>
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.type}
                  onClick={() => onAdd(item.type, defaultPropsMap[item.type] || {})}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-foreground"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
