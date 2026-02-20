import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { PixabayImagePicker } from './PixabayImagePicker';
import { getSectorImageQuery } from './sectorImageQueries';
import type { SectionComponentProps } from './types';

export function HeroHotel({ section, isEditing, onUpdate }: SectionComponentProps) {
  const p = section.props;
  const sector = p._sector || 'hotel';
  const title = p.title || 'Lüksün ve Konforun Buluştuğu Yer';
  const description = p.description || 'Eşsiz manzara ve birinci sınıf hizmetlerle unutulmaz bir konaklama deneyimi.';
  const badge = p.badge || '★★★★★';
  const image = p.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80';
  const buttonText = p.buttonText || 'Oda Ara';
  // Show date picker only for hotel/accommodation sectors; for others show a plain CTA button
  const isHotelMode = !p.buttonText || p.buttonText === 'Oda Ara' || p.buttonText === '';

  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax background */}
      {/* Edit image button */}
      {isEditing && (
        <button
          onClick={() => setPickerOpen(true)}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/90 text-gray-800 text-xs font-medium hover:bg-white hover:shadow-md transition-all backdrop-blur-sm border border-white/30"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Görseli Değiştir
        </button>
      )}

      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover scale-105" style={{ transform: 'scale(1.05)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block text-primary text-sm tracking-[0.3em] uppercase font-medium mb-6 font-body-dynamic"
          >
            {badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight font-heading-dynamic mb-6"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-white/70 max-w-lg leading-relaxed font-body-dynamic mb-10"
          >
            {description}
          </motion.p>

          {/* Search bar (hotel mode) or CTA button (other sectors) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {isHotelMode ? (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-wider mb-2 font-body-dynamic">Giriş</label>
                    <input type="date" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary font-body-dynamic" />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-wider mb-2 font-body-dynamic">Çıkış</label>
                    <input type="date" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary font-body-dynamic" />
                  </div>
                  <a
                    href={isEditing ? '#' : (p.buttonLink || '#rooms')}
                    className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all duration-300 font-body-dynamic"
                  >
                    {buttonText}
                  </a>
                </div>
              </div>
            ) : (
              <a
                href={isEditing ? '#' : (p.buttonLink || '#contact')}
                className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-300 font-body-dynamic"
              >
                {buttonText}
              </a>
            )}
          </motion.div>
        </div>
      </div>

      {isEditing && (
        <PixabayImagePicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => { onUpdate?.({ image: url }); }}
          defaultQuery={getSectorImageQuery('hero', sector)}
        />
      )}
    </section>
  );
}
