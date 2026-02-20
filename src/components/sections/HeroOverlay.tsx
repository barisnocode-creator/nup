import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { heroTitleSizeMap, resolveStyles } from './styleUtils';
import { PixabayImagePicker } from './PixabayImagePicker';
import { getSectorImageQuery } from './sectorImageQueries';
import type { SectionComponentProps } from './types';

export function HeroOverlay({ section, isEditing, onUpdate }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const overlayOpacity = props.overlayOpacity ?? 60;
  const sector = props._sector || 'default';
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <section
      className="relative min-h-[600px] flex items-center group"
      style={{
        backgroundImage: props.backgroundImage
          ? `url(${props.backgroundImage})`
          : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-foreground" style={{ opacity: overlayOpacity / 100 }} />

      {/* Edit background button */}
      {isEditing && (
        <button
          onClick={() => setPickerOpen(true)}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-lg bg-background/90 text-foreground text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <ImageIcon className="w-4 h-4" />
          Arka Plan Değiştir
        </button>
      )}

      <div className={`relative container mx-auto px-6 ${s.sectionPadding}`}>
        <div className="max-w-2xl">
          {props.subtitle && (
            <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className={`inline-block px-4 py-2 bg-background/10 backdrop-blur text-background rounded-full text-sm font-medium mb-6 tracking-wider uppercase ${s.subtitleTransform} font-body-dynamic`}>
              {props.subtitle}
            </motion.span>
          )}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className={`${s.titleSize(heroTitleSizeMap)} ${s.titleWeight} leading-tight text-background mb-6 text-${s.textAlign} font-heading-dynamic`}>
            {props.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className={`${s.descSize} text-background/80 mb-10 max-w-xl font-body-dynamic`}>
            {props.description}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-wrap gap-4">
            {props.buttonText && (
              <a href={isEditing ? '#' : props.buttonLink} className="inline-flex items-center px-8 py-4 bg-background text-foreground rounded-lg font-medium hover:bg-background/90 transition-all duration-300 text-lg font-body-dynamic">
                {props.buttonText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            )}
            {props.primaryButtonText && (
              <a href={isEditing ? '#' : props.primaryButtonLink} className="inline-flex items-center px-8 py-4 bg-background text-foreground rounded-lg font-medium hover:bg-background/90 transition-all duration-300 text-lg font-body-dynamic">
                {props.primaryButtonText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            )}
            {props.secondaryButtonText && (
              <a href={isEditing ? '#' : props.secondaryButtonLink} className="inline-flex items-center px-8 py-4 border-2 border-background text-background rounded-lg font-medium hover:bg-background/10 transition-all duration-300 text-lg font-body-dynamic">
                {props.secondaryButtonText}
              </a>
            )}
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs tracking-widest uppercase text-background/50 font-body-dynamic">Keşfedin</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
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
