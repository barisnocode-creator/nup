import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { sectionCatalog } from '@/components/sections/registry';

// Preview images
import heroCentered from '@/assets/section-previews/hero-centered.jpg';
import heroSplit from '@/assets/section-previews/hero-split.jpg';
import heroOverlay from '@/assets/section-previews/hero-overlay.jpg';
import heroCafe from '@/assets/section-previews/hero-cafe.jpg';
import heroDental from '@/assets/section-previews/hero-dental.jpg';
import heroRestaurant from '@/assets/section-previews/hero-restaurant.jpg';
import heroHotel from '@/assets/section-previews/hero-hotel.jpg';
import heroPortfolio from '@/assets/section-previews/hero-portfolio.jpg';
import servicesGrid from '@/assets/section-previews/services-grid.jpg';
import aboutSection from '@/assets/section-previews/about-section.jpg';
import statisticsCounter from '@/assets/section-previews/statistics-counter.jpg';
import testimonialsCarousel from '@/assets/section-previews/testimonials-carousel.jpg';
import faqAccordion from '@/assets/section-previews/faq-accordion.jpg';
import imageGallery from '@/assets/section-previews/image-gallery.jpg';
import pricingTable from '@/assets/section-previews/pricing-table.jpg';
import ctaBanner from '@/assets/section-previews/cta-banner.jpg';
import contactForm from '@/assets/section-previews/contact-form.jpg';
import appointmentBooking from '@/assets/section-previews/appointment-booking.jpg';
import menuShowcase from '@/assets/section-previews/menu-showcase.jpg';
import cafeStory from '@/assets/section-previews/cafe-story.jpg';
import cafeFeatures from '@/assets/section-previews/cafe-features.jpg';
import cafeGallery from '@/assets/section-previews/cafe-gallery.jpg';
import dentalServices from '@/assets/section-previews/dental-services.jpg';
import dentalTips from '@/assets/section-previews/dental-tips.jpg';
import dentalBooking from '@/assets/section-previews/dental-booking.jpg';
import chefShowcase from '@/assets/section-previews/chef-showcase.jpg';
import restaurantMenu from '@/assets/section-previews/restaurant-menu.jpg';
import roomShowcase from '@/assets/section-previews/room-showcase.jpg';
import hotelAmenities from '@/assets/section-previews/hotel-amenities.jpg';
import projectShowcase from '@/assets/section-previews/project-showcase.jpg';
import skillsGrid from '@/assets/section-previews/skills-grid.jpg';

const previewImages: Record<string, string> = {
  'hero-centered': heroCentered,
  'hero-split': heroSplit,
  'hero-overlay': heroOverlay,
  'hero-cafe': heroCafe,
  'hero-dental': heroDental,
  'hero-restaurant': heroRestaurant,
  'hero-hotel': heroHotel,
  'hero-portfolio': heroPortfolio,
  'services-grid': servicesGrid,
  'dental-services': dentalServices,
  'about-section': aboutSection,
  'statistics-counter': statisticsCounter,
  'testimonials-carousel': testimonialsCarousel,
  'contact-form': contactForm,
  'cta-banner': ctaBanner,
  'faq-accordion': faqAccordion,
  'image-gallery': imageGallery,
  'pricing-table': pricingTable,
  'appointment-booking': appointmentBooking,
  'menu-showcase': menuShowcase,
  'cafe-story': cafeStory,
  'cafe-features': cafeFeatures,
  'cafe-gallery': cafeGallery,
  'dental-tips': dentalTips,
  'dental-booking': dentalBooking,
  'chef-showcase': chefShowcase,
  'restaurant-menu': restaurantMenu,
  'room-showcase': roomShowcase,
  'hotel-amenities': hotelAmenities,
  'project-showcase': projectShowcase,
  'skills-grid': skillsGrid,
};

interface AddSectionPanelProps {
  isOpen: boolean;
  onAdd: (type: string, defaultProps: Record<string, any>) => void;
  onClose: () => void;
  sector?: string;
}

const categoryFilters: { key: string; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'hero', label: 'Hero' },
  { key: 'content', label: 'İçerik' },
  { key: 'contact', label: 'İletişim' },
  { key: 'cta', label: 'Aksiyon' },
  { key: 'sector', label: 'Sektör Özel' },
];

const sectorCategories = ['cafe', 'dental', 'restaurant', 'hotel', 'portfolio'];

// Default props for each section type
const defaultPropsMap: Record<string, Record<string, any>> = {
  'hero-centered': {
    title: 'Başlığınız', subtitle: 'Alt başlık', description: 'Açıklama metniniz buraya gelecek.',
    primaryButtonText: 'İletişime Geç', primaryButtonLink: '#contact', secondaryButtonText: '', secondaryButtonLink: '', backgroundImage: '',
  },
  'hero-split': {
    title: 'Başlığınız', subtitle: 'Alt başlık', description: 'Açıklama metniniz buraya gelecek.',
    primaryButtonText: 'Başlayın', primaryButtonLink: '#contact', secondaryButtonText: '', secondaryButtonLink: '', image: '',
  },
  'hero-overlay': {
    title: 'Başlığınız', subtitle: 'Alt başlık', description: 'Açıklama metniniz buraya gelecek.',
    primaryButtonText: 'Keşfedin', primaryButtonLink: '#services', secondaryButtonText: '', secondaryButtonLink: '', backgroundImage: '',
  },
  'HeroCafe': {
    badge: 'Specialty Coffee', title: 'Where Every Cup Tells a Story',
    description: 'A specialty cafe in the heart of the city.',
    primaryButtonText: 'Menümüzü Keşfedin', primaryButtonLink: '#menu',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  },
  'services-grid': {
    sectionTitle: 'Hizmetlerimiz', sectionSubtitle: 'Neler Yapıyoruz', sectionDescription: '',
    services: [
      { icon: '⭐', title: 'Hizmet 1', description: 'Açıklama', image: '' },
      { icon: '🎯', title: 'Hizmet 2', description: 'Açıklama', image: '' },
      { icon: '💡', title: 'Hizmet 3', description: 'Açıklama', image: '' },
    ],
  },
  'about-section': {
    title: 'Hakkımızda', subtitle: 'Biz Kimiz?', description: 'Şirketiniz hakkında bilgi.',
    features: 'Deneyim\nKalite\nGüven', image: '', imagePosition: 'right',
  },
  'statistics-counter': {
    stat1Value: '10+', stat1Label: 'Yıl Deneyim', stat2Value: '500+', stat2Label: 'Mutlu Müşteri',
    stat3Value: '100+', stat3Label: 'Proje', stat4Value: '%99', stat4Label: 'Memnuniyet',
  },
  'testimonials-carousel': {
    sectionTitle: 'Müşteri Yorumları', sectionSubtitle: 'Referanslar',
    testimonials: [{ name: 'Müşteri', role: 'CEO', content: 'Harika bir deneyim.', avatar: '' }],
  },
  'contact-form': {
    sectionTitle: 'İletişim', sectionSubtitle: 'Bize Ulaşın', sectionDescription: '',
    address: '', phone: '', email: '', submitButtonText: 'Mesaj Gönder',
  },
  'cta-banner': {
    title: 'Hemen Başlayalım', description: 'Sizinle çalışmak için sabırsızlanıyoruz.',
    buttonText: 'İletişime Geç', buttonLink: '#contact', secondaryButtonText: '', secondaryButtonLink: '', backgroundImage: '',
  },
  'faq-accordion': {
    sectionTitle: 'Sıkça Sorulan Sorular', sectionSubtitle: 'SSS',
    items: [{ question: 'Soru 1?', answer: 'Cevap 1.' }, { question: 'Soru 2?', answer: 'Cevap 2.' }],
  },
  'image-gallery': { sectionTitle: 'Galeri', sectionSubtitle: 'Çalışmalarımız', images: [] },
  'pricing-table': {
    sectionTitle: 'Fiyatlandırma', sectionSubtitle: 'Planlar',
    plans: [
      { name: 'Başlangıç', price: '₺99/ay', features: ['Özellik 1', 'Özellik 2'], highlighted: false },
      { name: 'Profesyonel', price: '₺199/ay', features: ['Özellik 1', 'Özellik 2', 'Özellik 3'], highlighted: true },
    ],
  },
  'appointment-booking': {
    sectionTitle: 'Randevu Alın', sectionSubtitle: 'Randevu', sectionDescription: 'Size uygun tarih ve saati seçin.',
    submitButtonText: 'Randevu Oluştur', successMessage: 'Randevunuz oluşturuldu!',
  },
  'MenuShowcase': {
    subtitle: 'Menümüz', title: 'Özel Seçkiler', description: 'En sevilen içecek ve lezzetlerimiz',
    items: [
      { name: 'Espresso', description: 'Zengin ve yoğun', price: '₺45', image: '', category: 'Kahve' },
      { name: 'Cappuccino', description: 'Buharlanmış süt ve espresso', price: '₺55', image: '', category: 'Kahve' },
    ],
  },
  'CafeStory': {
    subtitle: 'Hikayemiz', title: 'Tutkuyla Başladı',
    description: 'Kahve tutkumuz bir hayalle başladı.', features: 'El Yapımı\nYerel\nSürdürülebilir',
    image: '', buttonText: 'Daha Fazla', buttonLink: '#about',
  },
  'CafeFeatures': {
    subtitle: 'Neden Biz', title: 'Özenle Hazırlanır',
    features: [
      { icon: '☕', title: 'Single Origin', description: 'Özenle seçilmiş çekirdekler' },
      { icon: '🌿', title: 'Organik', description: '%100 organik malzemeler' },
    ],
  },
  'CafeGallery': {
    subtitle: 'Galeri', title: 'Mekanımız', images: [],
  },
};

export function AddSectionPanel({ isOpen, onAdd, onClose, sector }: AddSectionPanelProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [shuffleKey, setShuffleKey] = useState(0);

  const filteredItems = useMemo(() => {
    let items = [...sectionCatalog];

    if (shuffleKey > 0) {
      items = items.sort(() => Math.random() - 0.5);
    }

    if (activeCategory === 'all') return items;
    if (activeCategory === 'sector') {
      return items.filter(i => sectorCategories.includes(i.category));
    }
    return items.filter(i => i.category === activeCategory);
  }, [activeCategory, shuffleKey]);

  const handleAdd = () => {
    if (!selectedType) return;
    onAdd(selectedType, defaultPropsMap[selectedType] || {});
    setSelectedType(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-screen h-screen max-w-none m-0 rounded-none overflow-hidden flex flex-col bg-white p-0">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-6 pb-4 flex-shrink-0 bg-gray-50 border-b border-gray-200">
          <div>
            <DialogHeader className="space-y-0 p-0">
              <DialogTitle className="text-2xl font-bold text-gray-900">Bölüm Ekle</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1.5">
                Sayfanıza yeni bir bölüm ekleyin
              </DialogDescription>
            </DialogHeader>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShuffleKey(p => p + 1)} className="gap-2 flex-shrink-0 mt-1 border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
            <Sparkles className="w-4 h-4" />
            Karıştır
          </Button>
        </div>

        {/* Category filters */}
        <div className="px-8 pt-4 pb-2 flex gap-2 flex-shrink-0 flex-wrap">
          {categoryFilters.map(cat => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setSelectedType(null); }}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeCategory === cat.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="flex-1 min-h-0 overflow-y-auto px-8 py-4">
          <div className="flex flex-wrap gap-5">
            {filteredItems.map((item) => {
              const isSelected = selectedType === item.type;
              const preview = previewImages[item.type];

              return (
                <div
                  key={item.type}
                  className={cn(
                    'relative w-[320px] h-[220px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-lg',
                    isSelected && 'ring-3 ring-orange-500 border-2 border-orange-500',
                    !isSelected && 'border-2 border-gray-200 hover:border-gray-300',
                  )}
                  onClick={() => setSelectedType(item.type)}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white rounded-full px-3 py-1 text-xs font-semibold shadow-md">
                      Seçili
                    </div>
                  )}

                  {preview ? (
                    <img
                      src={preview}
                      alt={item.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">{item.label}</span>
                    </div>
                  )}

                  {/* Bottom gradient with name */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 pb-3 px-4">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white/90 text-[10px] font-medium uppercase tracking-wider rounded-full px-2.5 py-0.5 mb-1">
                      {item.category}
                    </span>
                    <p className="text-white font-semibold text-sm leading-tight">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="text-gray-600 border-gray-300 hover:bg-gray-100">
            İptal
          </Button>
          <Button onClick={handleAdd} disabled={!selectedType} className="bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-200 disabled:text-gray-400 border-0">
            Bölümü Ekle →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
