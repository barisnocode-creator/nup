import { useEffect, useRef, useState } from 'react';
import { EditableText } from '@/components/website-preview/EditableText';

interface TourGalleryProps {
  title?: string;
  subtitle?: string;
  galleryImages?: string[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function TourGallery({
  title = 'Tour our Space',
  subtitle = 'Experience our studio in immersive 3D.',
  galleryImages,
  isEditable = false,
  onFieldEdit,
}: TourGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const defaultImages = [
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
    'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
  ];

  const images = galleryImages?.length ? galleryImages : defaultImages;

  const captions = [
    'Wunda Chair Studio',
    'Reformer Training Area',
    'Equipment Storage',
    'Reception Area',
    'Studio Interior',
    'Lockers',
  ];

  return (
    <section ref={sectionRef} id="tour" className="py-24 bg-[#2d2420] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <h2
          className={`font-serif text-3xl md:text-5xl text-[#f5ebe0] mb-3 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {title}
        </h2>
        <p className={`text-[#f5ebe0]/60 text-lg transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          {subtitle}
        </p>
      </div>

      {/* Horizontal Scrolling Gallery */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 px-6 md:px-12 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-[300px] md:w-[400px] snap-start group transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
              <img
                src={img}
                alt={captions[index] || `Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h4 className="text-[#f5ebe0] font-serif text-lg mt-4">
              {captions[index] || `Space ${index + 1}`}
            </h4>
          </div>
        ))}
      </div>
    </section>
  );
}
