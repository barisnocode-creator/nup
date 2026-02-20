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

  return (
    <section
      className={`relative min-h-[700px] flex items-center justify-center ${s.bgColor} overflow-hidden group`}
      style={props.backgroundImage ? { backgroundImage: `url(${props.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {props.backgroundImage && <div className="absolute inset-0 bg-foreground/50" />}
      {!props.backgroundImage && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
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
          Arka Plan Değiştir
        </button>
      )}

      <div className={`relative container mx-auto px-6 ${s.sectionPadding} text-${s.textAlign}`}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          {props.subtitle && (
            <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 backdrop-blur-sm ${s.subtitleTransform} font-body-dynamic`}>
              {props.subtitle}
            </span>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className={`${s.titleSize(heroCenteredTitleSizeMap)} ${s.titleWeight} ${props.backgroundImage ? 'text-background' : s.titleColor} leading-tight max-w-4xl mx-auto mb-6 font-heading-dynamic`}
        >
          {props.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          className={`${s.descSize} ${props.backgroundImage ? 'text-background/80' : s.descColor} max-w-2xl mx-auto mb-10 font-body-dynamic`}
        >
          {props.description}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-wrap items-center justify-center gap-4">
          {props.primaryButtonText && (
            <a href={isEditing ? '#' : props.primaryButtonLink} className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body-dynamic">
              {props.primaryButtonText}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          )}
          {props.secondaryButtonText && (
            <a href={isEditing ? '#' : props.secondaryButtonLink} className="inline-flex items-center px-8 py-4 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-all duration-300 text-lg font-body-dynamic">
              {props.secondaryButtonText}
            </a>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/60">
        <span className="text-xs tracking-widest uppercase font-body-dynamic">Keşfet</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>

      {isEditing && (
        <PixabayImagePicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => { onUpdate?.({ backgroundImage: url }); setPickerOpen(false); }}
          defaultQuery={getSectorImageQuery('hero', sector)}
        />
      )}
    </section>
  );
}
