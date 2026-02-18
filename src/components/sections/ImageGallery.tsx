import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

export function ImageGallery({ section }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const images = [props.image1, props.image2, props.image3, props.image4, props.image5, props.image6].filter(Boolean);
  const columns = props.columns || "3";
  const gridCols: Record<string, string> = { "2": "md:grid-cols-2", "3": "md:grid-cols-3", "4": "md:grid-cols-4" };

  return (
    <section className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        {(props.title || props.subtitle) && (
          <div className={`text-${s.textAlign} mb-12`}>
            {props.subtitle && <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 ${s.subtitleTransform}`}>{props.subtitle}</span>}
            {props.title && <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor}`}>{props.title}</h2>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
          {images.map((image: string, index: number) => (
            <div key={index} className="relative group overflow-hidden rounded-xl aspect-square">
              <img src={image || "/placeholder.svg"} alt={`Galeri ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
