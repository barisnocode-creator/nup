import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { PixabayImagePicker } from './PixabayImagePicker';
import { getSectorImageQuery } from './sectorImageQueries';
import type { SectionComponentProps } from './types';

export function CafeStory({ section, isEditing, onUpdate }: SectionComponentProps) {
  const { props: p } = section;
  const sector = p._sector || 'cafe';
  const image = p.image || 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80';

  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <section className="py-24 lg:py-32 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative group">
            <div className="rounded-3xl overflow-hidden">
              <img src={image} alt={p.title || 'Our Story'} className="w-full h-[500px] object-cover" />
            </div>
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-primary/10 rounded-3xl" />

            {/* Edit button */}
            {isEditing && (
              <button
                onClick={() => setPickerOpen(true)}
                className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 text-white text-xs font-medium hover:bg-black/70 transition-all backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Görseli Değiştir
              </button>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6">
            {p.subtitle && (
              <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase font-body-dynamic">{p.subtitle}</span>
            )}
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight font-heading-dynamic">
              {p.title || 'Our Story'}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-body-dynamic">
              {p.description || 'Founded in the heart of the city, we\'ve been serving the community with passion and dedication since day one.'}
            </p>
            {p.features && (
              <div className="grid grid-cols-2 gap-4 pt-4">
                {(typeof p.features === 'string' ? p.features.split('\n') : p.features).map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground font-medium text-sm font-body-dynamic">{feature}</span>
                  </div>
                ))}
              </div>
            )}
            {p.buttonText && (
              <a
                href={isEditing ? '#' : p.buttonLink}
                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 mt-4 font-body-dynamic"
              >
                {p.buttonText}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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
          defaultQuery={getSectorImageQuery('about', sector)}
        />
      )}
    </section>
  );
}
