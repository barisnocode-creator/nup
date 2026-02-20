import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Plus } from 'lucide-react';
import { heroCenteredTitleSizeMap, resolveStyles } from './styleUtils';
import { PixabayImagePicker } from './PixabayImagePicker';
import { getSectorImageQuery } from './sectorImageQueries';
import type { SectionComponentProps } from './types';

export function HeroCentered({ section, isEditing, onUpdate }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const sector = props._sector || 'default';
  const [pickerOpen, setPickerOpen] = useState(false);

  const image = props.image || '';

  return (
    <section className="relative overflow-hidden bg-background min-h-[680px] flex items-center">
      {/* Gradient blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Sol: Metin */}
          <div className="flex flex-col items-start">
            {props.subtitle && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.0 }}
                className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 font-body-dynamic"
              >
                {props.subtitle}
              </motion.span>
            )}

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`${s.titleSize(heroCenteredTitleSizeMap)} ${s.titleWeight} ${s.titleColor} leading-tight mb-6 font-heading-dynamic`}
            >
              {props.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`${s.descSize} ${s.descColor} mb-10 max-w-lg font-body-dynamic`}
            >
              {props.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-4"
            >
              {props.primaryButtonText && (
                <a
                  href={isEditing ? '#' : props.primaryButtonLink}
                  className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body-dynamic"
                >
                  {props.primaryButtonText}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
              {props.secondaryButtonText && (
                <a
                  href={isEditing ? '#' : props.secondaryButtonLink}
                  className="inline-flex items-center px-8 py-4 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-all duration-300 text-lg font-body-dynamic"
                >
                  {props.secondaryButtonText}
                </a>
              )}
            </motion.div>
          </div>

          {/* Sağ: Görsel */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative group"
          >
            <div
              className={`relative rounded-3xl overflow-hidden aspect-[4/3] bg-muted ${isEditing ? 'cursor-pointer' : ''}`}
              onClick={() => isEditing && setPickerOpen(true)}
            >
              {image ? (
                <img
                  src={image}
                  alt={props.title || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
                  {isEditing ? (
                    <>
                      <Plus className="w-10 h-10 mb-3 opacity-40" />
                      <span className="text-sm font-medium opacity-60 font-body-dynamic">Görsel Ekle</span>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10" />
                  )}
                </div>
              )}

              {/* Hover overlay for editing */}
              {isEditing && (
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-2 text-background">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm font-medium font-body-dynamic">Görseli Değiştir</span>
                  </div>
                </div>
              )}
            </div>

            {/* Floating badge */}
            {(props.floatingBadge || props.stat1Value) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-4 -left-4 bg-background border border-border rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-lg">✓</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground font-body-dynamic">
                    {props.floatingBadge || props.stat1Value}
                  </p>
                  <p className="text-xs text-muted-foreground font-body-dynamic">
                    {props.floatingBadgeSubtext || props.stat1Label || ''}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Decorative ring */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-primary/20 rounded-full pointer-events-none" />
            <div className="absolute -top-2 -right-2 w-12 h-12 border-2 border-primary/10 rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {isEditing && (
        <PixabayImagePicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => { onUpdate?.({ image: url }); setPickerOpen(false); }}
          defaultQuery={getSectorImageQuery('hero', sector)}
        />
      )}
    </section>
  );
}
