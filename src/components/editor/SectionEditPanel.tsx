import { useState } from 'react';
import { X, Plus, Trash2, ChevronDown, ChevronRight, ImageIcon, Youtube, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PixabayImagePicker } from '@/components/sections/PixabayImagePicker';
import { getQueryForSection } from '@/components/sections/sectorImageQueries';
import type { SiteSection } from '@/components/sections/types';
import type { StyleProps } from '@/components/sections/styleUtils';

interface SectionEditPanelProps {
  section: SiteSection;
  onUpdateProps: (props: Record<string, any>) => void;
  onUpdateStyle: (style: Record<string, any>) => void;
  onClose: () => void;
}

const sectionTypeLabels: Record<string, string> = {
  'hero-centered': 'Hero (Ortala)', 'hero-split': 'Hero (İki Parça)', 'hero-overlay': 'Hero (Overlay)',
  'HeroCafe': 'Hero Cafe', 'HeroRestaurant': 'Hero Restoran', 'HeroDental': 'Hero Klinik',
  'HeroHotel': 'Hero Otel', 'HeroPortfolio': 'Hero Portfolyo',
  'services-grid': 'Hizmetler', 'ServicesGrid': 'Hizmetler', 'about-section': 'Hakkımızda',
  'AboutSection': 'Hakkımızda', 'statistics-counter': 'İstatistikler',
  'testimonials-carousel': 'Müşteri Yorumları', 'TestimonialsCarousel': 'Müşteri Yorumları',
  'contact-form': 'İletişim Formu', 'ContactForm': 'İletişim Formu',
  'cta-banner': 'Aksiyon Çağrısı', 'CTABanner': 'Aksiyon Çağrısı',
  'faq-accordion': 'SSS', 'image-gallery': 'Galeri', 'ImageGallery': 'Galeri',
  'pricing-table': 'Fiyatlandırma', 'appointment-booking': 'Randevu',
  'AppointmentBooking': 'Randevu', 'MenuShowcase': 'Menü', 'RestaurantMenu': 'Restoran Menüsü',
  'CafeStory': 'Hikaye', 'CafeFeatures': 'Özellikler', 'CafeGallery': 'Galeri',
  'ChefShowcase': 'Şef Tanıtımı', 'RoomShowcase': 'Oda Seçenekleri',
  'HotelAmenities': 'Otel Hizmetleri', 'ProjectShowcase': 'Projeler',
  'DentalServices': 'Diş Hizmetleri', 'DentalBooking': 'Randevu', 'DentalTips': 'İpuçları',
  'SkillsGrid': 'Beceriler', 'StatisticsCounter': 'İstatistikler',
};

export function SectionEditPanel({ section, onUpdateProps, onUpdateStyle, onClose }: SectionEditPanelProps) {
  const label = sectionTypeLabels[section.type] || section.type;
  const [imagePickerField, setImagePickerField] = useState<string | null>(null);

  const sector = section.props?._sector || 'default';
  const defaultQuery = getQueryForSection(section.type, sector);

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="fixed top-16 right-3 w-[310px] max-h-[calc(100vh-80px)] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg z-[60] overflow-hidden flex flex-col"
      role="region" aria-label="Bölüm düzenleme paneli"
      onKeyDown={(e) => e.key === 'Escape' && onClose()} tabIndex={-1}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-700 shrink-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid grid-cols-2 mx-4 mt-3 shrink-0 bg-gray-100 dark:bg-zinc-800">
          <TabsTrigger value="content" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">İçerik</TabsTrigger>
          <TabsTrigger value="style" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">Stil</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 overflow-y-auto p-4 space-y-4">
          <ContentFields section={section} onUpdateProps={onUpdateProps} onOpenImagePicker={setImagePickerField} />
        </TabsContent>

        <TabsContent value="style" className="flex-1 overflow-y-auto p-4 space-y-4">
          <StyleFields section={section} onUpdateStyle={onUpdateStyle} />
        </TabsContent>
      </Tabs>

      <div className="px-4 py-3 border-t border-gray-200 dark:border-zinc-700 shrink-0">
        <button onClick={onClose} className="w-full py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">Tamam</button>
      </div>

      {/* Global Pixabay image picker for panel */}
      <PixabayImagePicker
        isOpen={imagePickerField !== null}
        onClose={() => setImagePickerField(null)}
        onSelect={(url) => {
          if (imagePickerField) onUpdateProps({ [imagePickerField]: url });
          setImagePickerField(null);
        }}
        defaultQuery={defaultQuery}
      />
    </motion.div>
  );
}

// ---- Array item field config ----
// FAZ 2: Genişletilmiş schema — stats, plans, features, members eklendi
const arrayFieldSchemas: Record<string, { fields: { key: string; label: string; type?: 'textarea' }[] }> = {
  services: { fields: [
    { key: 'title', label: 'Başlık' },
    { key: 'description', label: 'Açıklama', type: 'textarea' },
    { key: 'icon', label: 'İkon' },
    { key: 'image', label: 'Görsel' },
    { key: 'price', label: 'Fiyat' },
  ]},
  testimonials: { fields: [
    { key: 'name', label: 'İsim' },
    { key: 'role', label: 'Rol / Ünvan' },
    { key: 'content', label: 'Yorum', type: 'textarea' },
    { key: 'avatar', label: 'Avatar URL' },
  ]},
  items: { fields: [
    { key: 'name', label: 'Ad' },
    { key: 'question', label: 'Soru' },
    { key: 'answer', label: 'Cevap', type: 'textarea' },
    { key: 'price', label: 'Fiyat' },
    { key: 'description', label: 'Açıklama', type: 'textarea' },
    { key: 'category', label: 'Kategori' },
    { key: 'image', label: 'Görsel URL' },
  ]},
  features: { fields: [
    { key: 'icon', label: 'İkon (emoji veya Lucide ismi)' },
    { key: 'title', label: 'Başlık' },
    { key: 'description', label: 'Açıklama', type: 'textarea' },
  ]},
  stats: { fields: [
    { key: 'value', label: 'Değer (örn: 500+)' },
    { key: 'label', label: 'Etiket' },
    { key: 'suffix', label: 'Son Ek' },
  ]},
  plans: { fields: [
    { key: 'name', label: 'Plan Adı' },
    { key: 'price', label: 'Fiyat' },
    { key: 'description', label: 'Açıklama', type: 'textarea' },
    { key: 'period', label: 'Dönem (ay/yıl)' },
  ]},
  tips: { fields: [
    { key: 'icon', label: 'İkon' },
    { key: 'title', label: 'Başlık' },
    { key: 'content', label: 'İçerik', type: 'textarea' },
  ]},
  projects: { fields: [
    { key: 'title', label: 'Başlık' },
    { key: 'description', label: 'Açıklama', type: 'textarea' },
    { key: 'image', label: 'Görsel URL' },
    { key: 'tag', label: 'Etiket' },
  ]},
  rooms: { fields: [
    { key: 'name', label: 'Oda Adı' },
    { key: 'description', label: 'Açıklama', type: 'textarea' },
    { key: 'price', label: 'Fiyat' },
    { key: 'image', label: 'Görsel URL' },
  ]},
  members: { fields: [
    { key: 'name', label: 'Ad Soyad' },
    { key: 'role', label: 'Ünvan / Rol' },
    { key: 'bio', label: 'Kısa Biyografi', type: 'textarea' },
    { key: 'image', label: 'Fotoğraf' },
  ]},
};

// FAZ 2: Genişletilmiş Türkçe etiket haritası
const labelMap: Record<string, string> = {
  title: 'Başlık',
  subtitle: 'Alt Başlık',
  description: 'Açıklama',
  sectionTitle: 'Bölüm Başlığı',
  sectionSubtitle: 'Bölüm Alt Başlığı',
  sectionDescription: 'Bölüm Açıklaması',
  primaryButtonText: 'Ana Buton Metni',
  primaryButtonLink: 'Ana Buton Linki',
  secondaryButtonText: 'İkinci Buton Metni',
  secondaryButtonLink: 'İkinci Buton Linki',
  buttonText: 'Buton Metni',
  buttonLink: 'Buton Linki',
  backgroundImage: 'Arka Plan Görseli',
  image: 'Görsel URL',
  imagePosition: 'Görsel Konumu',
  address: 'Adres',
  phone: 'Telefon',
  email: 'E-posta',
  hours: 'Çalışma Saatleri',
  submitButtonText: 'Gönder Butonu',
  successMessage: 'Başarı Mesajı',
  siteName: 'Site Adı',
  badge: 'Rozet Metni',
  floatingBadge: 'Yüzen Rozet',
  floatingBadgeSubtext: 'Rozet Alt Yazısı',
  name: 'Ad / İsim',
  role: 'Ünvan / Rol',
  content: 'İçerik',
  bio: 'Biyografi',
  tagline: 'Slogan',
  features: 'Özellikler (metin)',
  infoItems: 'Bilgi Etiketleri (virgülle ayır)',
  videoUrl: 'YouTube Linki',
};

// ---- Placeholder map ----
const placeholderMap: Record<string, string> = {
  title: 'Örn: Hizmetlerimiz',
  subtitle: 'Örn: Size en iyi hizmeti sunuyoruz',
  description: 'Bölüm açıklamasını buraya yazın...',
  sectionTitle: 'Örn: Hakkımızda',
  sectionSubtitle: 'Örn: Bizi daha yakından tanıyın',
  sectionDescription: 'Bölüm açıklamasını buraya yazın...',
  phone: 'Örn: +90 555 123 4567',
  email: 'Örn: info@siteniz.com',
  address: 'Örn: Bağcılar Mah. İstanbul',
  buttonText: 'Örn: Daha Fazla Bilgi',
  primaryButtonText: 'Örn: Hemen Başlayın',
  secondaryButtonText: 'Örn: Daha Fazla',
  siteName: 'Sitenizin adı',
  tagline: 'Örn: Kalite ve güven bir arada',
  badge: 'Örn: Yeni',
  hours: 'Örn: Pzt–Cum 09:00–18:00',
  name: 'Örn: Ahmet Yılmaz',
  role: 'Örn: Genel Müdür',
  bio: 'Kısa biyografi yazısı...',
  content: 'Buraya yazınızı girin...',
  videoUrl: 'https://youtube.com/watch?v=...',
  submitButtonText: 'Örn: Gönder',
  successMessage: 'Örn: Mesajınız iletildi!',
  primaryButtonLink: '/hizmetler',
  secondaryButtonLink: '/iletisim',
  buttonLink: '/hakkimizda',
};

// ---- Galeri bölümü için özel içerik editörü ----
function GalleryFields({ section, onUpdateProps, onOpenImagePicker }: {
  section: SiteSection;
  onUpdateProps: (props: Record<string, any>) => void;
  onOpenImagePicker: (field: string) => void;
}) {
  const props = section.props || {};
  const imageKeys = [1, 2, 3, 4, 5, 6].map(n => `image${n}`);

  return (
    <div className="space-y-3">
      {/* Section title/subtitle fields */}
      {['title', 'subtitle'].map(k => props[k] !== undefined && (
        <div key={k} className="space-y-1.5">
          <label className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{labelMap[k] || k}</label>
          <Input
            value={String(props[k] || '')}
            onChange={e => onUpdateProps({ [k]: e.target.value })}
            placeholder={placeholderMap[k]}
            className="h-8 text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
          />
        </div>
      ))}

      <div className="border-t border-gray-100 dark:border-zinc-800 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Galeri Görselleri</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {imageKeys.map(key => (
            <button
              key={key}
              onClick={() => onOpenImagePicker(key)}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-orange-400 transition-all group focus:outline-none"
            >
              {props[key] ? (
                <>
                  <img src={props[key]} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/90 text-gray-900 text-[10px] font-medium shadow">
                      <ImageIcon className="w-3 h-3" /> Değiştir
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 h-full text-gray-400">
                  <ImageIcon className="w-4 h-4 opacity-50" />
                  <span className="text-[9px] font-medium">Ekle</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Blog bölümü için özel içerik editörü ----
function BlogFields({ section, onUpdateProps, onOpenImagePicker }: {
  section: SiteSection;
  onUpdateProps: (props: Record<string, any>) => void;
  onOpenImagePicker: (field: string) => void;
}) {
  const props = section.props || {};
  const [openPost, setOpenPost] = useState<number | null>(null);

  const posts = [1, 2, 3, 4].map(n => ({
    n,
    title: props[`post${n}Title`] || '',
    category: props[`post${n}Category`] || '',
    excerpt: props[`post${n}Excerpt`] || '',
    image: props[`post${n}Image`] || '',
    date: props[`post${n}Date`] || '',
    slug: props[`post${n}Slug`] || '',
  }));

  return (
    <div className="space-y-3">
      {/* Section header fields */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-gray-400">Bölüm Başlığı</label>
        <input
          value={props.sectionTitle || ''}
          onChange={e => onUpdateProps({ sectionTitle: e.target.value })}
          className="w-full h-8 px-3 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-gray-400">Bölüm Alt Başlığı</label>
        <input
          value={props.sectionSubtitle || ''}
          onChange={e => onUpdateProps({ sectionSubtitle: e.target.value })}
          className="w-full h-8 px-3 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
        />
      </div>

      <div className="border-t border-gray-100 dark:border-zinc-800 pt-2">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Blog Yazıları ({posts.length})</span>
        </div>
        {posts.map(post => (
          <div key={post.n} className="border border-gray-100 dark:border-zinc-800 rounded-lg overflow-hidden mb-2">
            <button
              onClick={() => setOpenPost(openPost === post.n ? null : post.n)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                {openPost === post.n ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                  {post.title || `Yazı ${post.n}`}
                </span>
              </div>
            </button>
            {openPost === post.n && (
              <div className="p-3 space-y-2 bg-white dark:bg-zinc-900">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Başlık</label>
                  <input value={post.title} onChange={e => onUpdateProps({ [`post${post.n}Title`]: e.target.value })}
                    className="w-full h-8 px-2 text-xs rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
                </div>
                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Kategori</label>
                  <input value={post.category} onChange={e => onUpdateProps({ [`post${post.n}Category`]: e.target.value })}
                    className="w-full h-8 px-2 text-xs rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
                </div>
                {/* Excerpt */}
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Özet</label>
                  <textarea value={post.excerpt} onChange={e => onUpdateProps({ [`post${post.n}Excerpt`]: e.target.value })}
                    rows={3}
                    className="w-full px-2 py-1.5 text-xs rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white resize-y" />
                </div>
                {/* Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Tarih</label>
                  <input type="date" value={post.date} onChange={e => onUpdateProps({ [`post${post.n}Date`]: e.target.value })}
                    className="w-full h-8 px-2 text-xs rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
                </div>
                {/* Slug */}
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">URL (slug)</label>
                  <input value={post.slug} onChange={e => onUpdateProps({ [`post${post.n}Slug`]: e.target.value })}
                    placeholder="yazi-url-si"
                    className="w-full h-8 px-2 text-xs rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
                </div>
                {/* Image */}
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Görsel</label>
                  <button
                    onClick={() => onOpenImagePicker(`post${post.n}Image`)}
                    className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-orange-400 transition-all group focus:outline-none"
                  >
                    {post.image ? (
                      <>
                        <img src={post.image} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 text-gray-900 text-[10px] font-medium shadow">
                            <ImageIcon className="w-3 h-3" /> Değiştir
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1.5 h-full py-4 text-gray-400">
                        <ImageIcon className="w-5 h-5 opacity-50" />
                        <span className="text-[10px] font-medium">Görsel Ekle</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentFields({ section, onUpdateProps, onOpenImagePicker }: {
  section: SiteSection;
  onUpdateProps: (props: Record<string, any>) => void;
  onOpenImagePicker: (field: string) => void;
}) {
  const rawProps = section.props || {};

  // AddableTeamGrid için members yoksa default inject et
  const props = (section.type === 'AddableTeamGrid' && !rawProps.members)
    ? {
        ...rawProps,
        title: rawProps.title || 'Uzman Ekibimiz',
        subtitle: rawProps.subtitle || 'Alanında uzman, deneyimli kadromuzla hizmetinizdeyiz.',
        members: [
          { name: 'Dr. Ayşe Kaya', role: 'Uzman', bio: 'Alanında 15 yıllık deneyimiyle en iyi hizmeti sunmaktadır.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face' },
          { name: 'Mehmet Yıldız', role: 'Kıdemli Uzman', bio: '10 yıllık tecrübesiyle ekibimizin değerli üyesi.', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face' },
          { name: 'Zeynep Demir', role: 'Uzman', bio: 'Uluslararası sertifikalı, müşteri memnuniyeti odaklı çalışmaktadır.', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face' },
        ],
      }
    : rawProps;

  // Blog bölümü için özel editör kullan
  if (section.type === 'AddableBlog') {
    return <BlogFields section={section} onUpdateProps={onUpdateProps} onOpenImagePicker={onOpenImagePicker} />;
  }

  // Galeri bölümleri için özel editör
  if (['ImageGallery', 'CafeGallery', 'image-gallery'].includes(section.type)) {
    return <GalleryFields section={section} onUpdateProps={onUpdateProps} onOpenImagePicker={onOpenImagePicker} />;
  }

  const textareaFields = ['description', 'sectiondescription', 'content', 'bio', 'features'];

  // FAZ 2a: Genişletilmiş array key listesi — members eklendi
  const arrayKeys = ['services', 'testimonials', 'items', 'features', 'stats', 'plans', 'tips', 'projects', 'rooms', 'members'];
  // Sadece gerçek nesne/görsel dizileri ve dahili alanları atla
  const skipFields = ['images', 'theme', 'style', '_sector'];

  // Regular (non-array) fields — boş string olan alanları da göster
  const entries = Object.entries(props).filter(([key, val]) => {
    if (skipFields.includes(key)) return false;
    if (key.startsWith('post') && (key.endsWith('Title') || key.endsWith('Excerpt') || key.endsWith('Image') || key.endsWith('Date') || key.endsWith('Slug') || key.endsWith('Category') || key.endsWith('Content') || key.endsWith('Keywords'))) return false;
    if (arrayKeys.includes(key) && Array.isArray(val)) return false;
    if (Array.isArray(val)) return false;
    if (typeof val === 'object' && val !== null) return false;
    return true;
  });

  // Array fields that exist in this section
  const arrayEntries = arrayKeys.filter(k => Array.isArray(props[k]) && props[k].length > 0);

  // infoItems: string[] (virgülle ayrılmış metin olarak göster)
  const hasInfoItems = Array.isArray(props.infoItems);

  return (
    <>
      {entries.map(([key, value]) => {
        const label = labelMap[key] || key;
        const isTextarea = textareaFields.some(f => key.toLowerCase().includes(f));
        const isImage = key === 'image' || key === 'backgroundImage';
        const isVideo = key === 'videoUrl';
        const isBool = typeof value === 'boolean';
        const placeholder = placeholderMap[key] || '';

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

        if (isBool) {
          return (
            <div key={key} className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
              <button
                onClick={() => onUpdateProps({ [key]: !value })}
                className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          );
        }

        return (
          <div key={key} className="space-y-1.5">
            <label className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{label}</label>
            {isTextarea ? (
              <Textarea value={String(value || '')} onChange={(e) => onUpdateProps({ [key]: e.target.value })}
                placeholder={placeholder || 'Buraya yazın...'}
                className="text-sm min-h-[80px] resize-y bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white" />
            ) : isImage ? (
              <button
                onClick={() => onOpenImagePicker(key)}
                className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-orange-400 transition-all group focus:outline-none"
              >
                {value ? (
                  <>
                    <img src={String(value)} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-gray-900 text-xs font-medium shadow">
                        <ImageIcon className="w-3.5 h-3.5" />
                        Görseli Değiştir
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 h-full py-6 text-gray-400">
                    <ImageIcon className="w-6 h-6 opacity-50" />
                    <span className="text-xs font-medium">Görsel Ekle</span>
                    <span className="text-[10px] opacity-60">Tıkla → Pixabay'dan seç</span>
                  </div>
                )}
              </button>
            ) : isVideo ? (
              <div className="space-y-1.5">
                <div className="flex gap-1.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shrink-0">
                    <Youtube className="w-4 h-4 text-red-500" />
                  </div>
                  <Input
                    value={String(value || '')}
                    onChange={(e) => onUpdateProps({ [key]: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="h-8 text-xs bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                {value && (
                  <p className="text-[10px] text-green-600 dark:text-green-400">✓ Video bağlı</p>
                )}
              </div>
            ) : (
              <Input
                value={String(value || '')}
                onChange={(e) => onUpdateProps({ [key]: e.target.value })}
                placeholder={placeholder}
                className="h-8 text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
              />
            )}
          </div>
        );
      })}

      {/* infoItems: string dizisi — virgülle ayrılmış metin */}
      {hasInfoItems && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Bilgi Etiketleri (virgülle ayırın)</label>
          <Input
            value={(props.infoItems as string[]).join(', ')}
            onChange={(e) => onUpdateProps({ infoItems: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
            className="text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
            placeholder="Örn: Organik, Taze, Est. 2020"
          />
        </div>
      )}

      {/* Array Editors */}
      {arrayEntries.map(arrKey => (
        <ArrayEditor key={arrKey} arrKey={arrKey} items={props[arrKey]} onUpdate={(newItems) => onUpdateProps({ [arrKey]: newItems })} />
      ))}

      {entries.length === 0 && arrayEntries.length === 0 && !hasInfoItems && (
        <div className="text-center py-6 space-y-2">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto">
            <ImageIcon className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Düzenlenecek alan bulunamadı</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Bu bölümün içeriği otomatik oluşturulmuştur.<br/>Stil sekmesinden görünümü ayarlayabilirsiniz.</p>
        </div>
      )}
    </>
  );

}

function ArrayEditor({ arrKey, items, onUpdate }: { arrKey: string; items: any[]; onUpdate: (items: any[]) => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [imagePickerTarget, setImagePickerTarget] = useState<{ index: number; field: string } | null>(null);
  const schema = arrayFieldSchemas[arrKey];
  const arrayLabel: Record<string, string> = {
    services: 'Hizmetler', testimonials: 'Müşteri Yorumları', items: 'Öğeler',
    features: 'Özellikler', stats: 'İstatistikler', plans: 'Planlar',
    tips: 'İpuçları', projects: 'Projeler', rooms: 'Odalar', members: 'Ekip Üyeleri',
  };

  const addItem = () => {
    const newItem: Record<string, string> = {};
    if (schema) schema.fields.forEach(f => { newItem[f.key] = ''; });
    else Object.keys(items[0] || {}).forEach(k => { if (typeof items[0][k] === 'string') newItem[k] = ''; });
    onUpdate([...items, newItem]);
    setOpenIndex(items.length);
  };

  const removeItem = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
    if (openIndex === index) setOpenIndex(null);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const getVisibleFields = (item: any) => {
    if (!schema) return [];
    // Schema varsa tüm alanları göster (yeni eklenen boş itemler için de)
    return schema.fields;
  };

  return (
    <>
      <div className="space-y-2 border border-gray-200 dark:border-zinc-700 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">{arrayLabel[arrKey] || arrKey} ({items.length})</h4>
          <button onClick={addItem} className="p-1 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Yeni ekle">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const itemTitle = item.title || item.name || item.question || item.value || `#${index + 1}`;
          const fields = getVisibleFields(item);

          return (
            <div key={index} className="border border-gray-100 dark:border-zinc-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-750 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {isOpen ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{itemTitle}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                  className="p-1 rounded text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </button>

              {isOpen && (
                <div className="p-3 space-y-2 bg-white dark:bg-zinc-900">
                  {fields.length > 0 ? fields.map(f => {
                    const isImgField = f.key === 'image' || f.key === 'avatar';
                    return (
                      <div key={f.key} className="space-y-1">
                        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{f.label}</label>
                        {f.type === 'textarea' ? (
                          <Textarea value={item[f.key] || ''} onChange={(e) => updateItem(index, f.key, e.target.value)}
                            className="text-xs min-h-[60px] resize-y bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" />
                        ) : isImgField ? (
                          <button
                            onClick={() => setImagePickerTarget({ index, field: f.key })}
                            className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-orange-400 transition-all group focus:outline-none"
                          >
                            {item[f.key] ? (
                              <>
                                <img src={item[f.key]} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 text-gray-900 text-[10px] font-medium shadow">
                                    <ImageIcon className="w-3 h-3" />
                                    Görseli Değiştir
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-1.5 h-full py-4 text-gray-400">
                                <ImageIcon className="w-5 h-5 opacity-50" />
                                <span className="text-[10px] font-medium">Görsel Ekle</span>
                                <span className="text-[9px] opacity-60">Tıkla → Pixabay'dan seç</span>
                              </div>
                            )}
                          </button>
                        ) : (
                          <Input value={item[f.key] || ''} onChange={(e) => updateItem(index, f.key, e.target.value)}
                            className="text-xs h-8 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" />
                        )}
                      </div>
                    );
                  }) : (
                    Object.entries(item).filter(([, v]) => typeof v === 'string').map(([k, v]) => (
                      <div key={k} className="space-y-1">
                        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{labelMap[k] || k}</label>
                        <Input value={String(v || '')} onChange={(e) => updateItem(index, k, e.target.value)}
                          className="text-xs h-8 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pixabay picker for array item images */}
      <PixabayImagePicker
        isOpen={imagePickerTarget !== null}
        onClose={() => setImagePickerTarget(null)}
        onSelect={(url) => {
          if (imagePickerTarget) updateItem(imagePickerTarget.index, imagePickerTarget.field, url);
          setImagePickerTarget(null);
        }}
        defaultQuery="professional photo"
      />
    </>
  );
}

// FAZ 1: StyleFields — dropdown değerleri styleUtils.ts anahtarlarıyla hizalandı
function StyleFields({ section, onUpdateStyle }: { section: SiteSection; onUpdateStyle: (style: Record<string, any>) => void }) {
  const style = (section.style || {}) as StyleProps;
  const selectClasses = "text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700";
  const contentClasses = "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 z-[50]";

  return (
    <>
      {/* FAZ 1: titleSize → styleUtils.ts anahtarları: lg | xl | 2xl | 3xl */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Başlık Boyutu</label>
        <Select value={style.titleSize || '2xl'} onValueChange={(v) => onUpdateStyle({ titleSize: v })}>
          <SelectTrigger className={selectClasses}><SelectValue /></SelectTrigger>
          <SelectContent className={contentClasses}>
            <SelectItem value="lg">Küçük</SelectItem>
            <SelectItem value="xl">Orta</SelectItem>
            <SelectItem value="2xl">Varsayılan</SelectItem>
            <SelectItem value="3xl">Büyük</SelectItem>
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
            <SelectItem value="transparent">Şeffaf</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Özel arka plan rengi */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Özel Arka Plan Rengi</label>
        <div className="flex items-center gap-2">
          <input type="color" value={style.customBgColor || '#ffffff'}
            onChange={(e) => onUpdateStyle({ customBgColor: e.target.value })}
            className="w-8 h-8 rounded border border-gray-200 dark:border-zinc-700 cursor-pointer p-0.5" />
          <Input value={style.customBgColor || ''} onChange={(e) => onUpdateStyle({ customBgColor: e.target.value })}
            placeholder="Boş = tema rengi" className="text-xs h-8 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" />
          {style.customBgColor && (
            <button onClick={() => onUpdateStyle({ customBgColor: '' })} className="text-xs text-red-400 hover:text-red-600 whitespace-nowrap">Sıfırla</button>
          )}
        </div>
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

      {/* FAZ 1: sectionPadding → styleUtils.ts anahtarları: sm | md | lg | xl */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">İç Boşluk</label>
        <Select value={style.sectionPadding || 'md'} onValueChange={(v) => onUpdateStyle({ sectionPadding: v })}>
          <SelectTrigger className={selectClasses}><SelectValue /></SelectTrigger>
          <SelectContent className={contentClasses}>
            <SelectItem value="sm">Az (py-12)</SelectItem>
            <SelectItem value="md">Varsayılan (py-20)</SelectItem>
            <SelectItem value="lg">Geniş (py-28)</SelectItem>
            <SelectItem value="xl">Çok Geniş (py-36)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Başlık rengi */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Başlık Rengi</label>
        <Select value={style.titleColor || 'default'} onValueChange={(v) => onUpdateStyle({ titleColor: v })}>
          <SelectTrigger className={selectClasses}><SelectValue /></SelectTrigger>
          <SelectContent className={contentClasses}>
            <SelectItem value="default">Varsayılan</SelectItem>
            <SelectItem value="primary">Ana Renk</SelectItem>
            <SelectItem value="white">Beyaz</SelectItem>
            <SelectItem value="muted">Soluk</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
