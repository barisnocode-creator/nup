import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { heroCenteredTitleSizeMap, resolveStyles } from './styleUtils';
import { PixabayImagePicker } from './PixabayImagePicker';
import { getSectorImageQuery } from './sectorImageQueries';
import type { SectionComponentProps } from './types';

export function HeroCentered({ section, isEditing, onUpdate }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const sector = props._sector || 'default';
  const [pickerOpen, setPickerOpen] = useState(false);

  const image = props.image || props.backgroundImage || '';

  return (
    <section
      className="relative min-h-[700px] flex items-center justify-center overflow-hidden group"
    >
      {/* Background image or gradient */}
      {image ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${image})` }}
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-foreground/55" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </>
      )}

      {/* Edit background image button */}
      {isEditing && (
        <button
          onClick={() => setPickerOpen(true)}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-lg bg-background/90 text-foreground text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <ImageIcon className="w-4 h-4" />
          {image ? 'Arka Planı Değiştir' : 'Arka Plan Ekle'}
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.0 }}
        >
          {props.subtitle && (
            <span className={`inline-block px-4 py-2 ${image ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-primary/10 text-primary'} rounded-full text-sm font-medium mb-6 font-body-dynamic`}>
              {props.subtitle}
            </span>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${s.titleSize(heroCenteredTitleSizeMap)} ${s.titleWeight} leading-tight max-w-4xl mx-auto mb-6 font-heading-dynamic ${image ? 'text-white' : s.titleColor}`}
        >
          {props.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`${s.descSize} max-w-2xl mx-auto mb-10 font-body-dynamic ${image ? 'text-white/85' : s.descColor}`}
        >
          {props.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-4"
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
              className={`inline-flex items-center px-8 py-4 rounded-lg font-medium transition-all duration-300 text-lg font-body-dynamic ${image ? 'border border-white/40 text-white hover:bg-white/10 backdrop-blur-sm' : 'border border-border text-foreground hover:bg-muted'}`}
            >
              {props.secondaryButtonText}
            </a>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${image ? 'text-white/60' : 'text-muted-foreground/60'}`}>
        <span className="text-xs tracking-widest uppercase font-body-dynamic">Keşfet</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>

      {isEditing && (
        <PixabayImagePicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => { onUpdate?.({ image: url, backgroundImage: url }); setPickerOpen(false); }}
          defaultQuery={getSectorImageQuery('hero', sector)}
        />
      )}
    </section>
  );
}
