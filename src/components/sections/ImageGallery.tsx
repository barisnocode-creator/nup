import { useEffect, useRef, useState } from 'react';
import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

export function ImageGallery({ section }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Support both flat image1..image6 and galleryImages array
  const images = props.galleryImages?.length
    ? props.galleryImages
    : [props.image1, props.image2, props.image3, props.image4, props.image5, props.image6].filter(Boolean);

  const captions = props.captions || [];
  const isInfiniteScroll = props.infiniteScroll || images.length > 4;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Infinite scroll gallery (TourGallery style)
  if (isInfiniteScroll && images.length > 0) {
    const infiniteImages = [...images, ...images];
    const infiniteCaptions = [...captions, ...captions];

    return (
      <section ref={sectionRef} className="py-24 bg-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
          <h2
            className={`font-serif text-3xl md:text-5xl text-background mb-3 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {props.title || 'Galeri'}
          </h2>
          {props.subtitle && (
            <p className={`text-background/60 text-lg transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              {props.subtitle}
            </p>
          )}
        </div>

        <div className="relative overflow-hidden">
          <div
            className={`flex gap-6 px-6 md:px-12 transition-opacity duration-1000 ${isVisible ? 'opacity-100 section-scroll-gallery' : 'opacity-0'}`}
            style={{ width: 'max-content' }}
          >
            {infiniteImages.map((img: string, index: number) => (
              <div key={index} className="flex-shrink-0 w-[300px] md:w-[400px] group">
                <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                  <img
                    src={img}
                    alt={infiniteCaptions[index] || `Galeri ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {infiniteCaptions[index] && (
                  <h4 className="text-background font-serif text-lg mt-4">
                    {infiniteCaptions[index]}
                  </h4>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Standard grid gallery
  const columns = props.columns || "3";
  const gridCols: Record<string, string> = { "2": "md:grid-cols-2", "3": "md:grid-cols-3", "4": "md:grid-cols-4" };

  return (
    <section ref={sectionRef} className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        {(props.title || props.subtitle) && (
          <div className={`text-${s.textAlign} mb-12`}>
            {props.subtitle && <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 ${s.subtitleTransform}`}>{props.subtitle}</span>}
            {props.title && <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor}`}>{props.title}</h2>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
          {images.map((image: string, index: number) => (
            <div
              key={index}
              className={`relative group overflow-hidden rounded-xl aspect-square transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={captions[index] || `Galeri ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
