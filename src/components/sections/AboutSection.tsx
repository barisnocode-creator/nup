import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { resolveStyles } from './styleUtils';
import { PixabayImagePicker } from './PixabayImagePicker';
import { getSectorImageQuery } from './sectorImageQueries';
import type { SectionComponentProps } from './types';

export function AboutSection({ section, isEditing, onUpdate }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const sector = props._sector || 'default';
  const featureList = props.features ? props.features.split('\n').filter((f: string) => f.trim()) : [];
  const image = props.image || '/placeholder.svg';

  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <section className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${props.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`space-y-6 ${props.imagePosition === 'left' ? 'lg:order-2' : ''}`}>
            {props.subtitle && (
              <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium ${s.subtitleTransform} font-body-dynamic`}>{props.subtitle}</span>
            )}
            <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} text-${s.textAlign} font-heading-dynamic`}>{props.title}</h2>
            <p className={`${s.descSize} ${s.descColor} leading-relaxed font-body-dynamic`}>{props.description}</p>
            {featureList.length > 0 && (
              <ul className="space-y-3">
                {featureList.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-foreground font-body-dynamic">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={`relative group ${props.imagePosition === 'left' ? 'lg:order-1' : ''}`}>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-30" />
            <div className="relative rounded-2xl shadow-xl overflow-hidden">
              <img src={image} alt={props.title} className="w-full object-cover aspect-[4/3]" />
              {isEditing && (
                <button
                  onClick={() => setPickerOpen(true)}
                  className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 text-gray-800 text-xs font-medium hover:bg-white hover:shadow-md transition-all backdrop-blur-sm border border-white/30 opacity-0 group-hover:opacity-100"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Görseli Değiştir
                </button>
              )}
            </div>
          </div>
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
