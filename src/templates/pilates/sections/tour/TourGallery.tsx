import { useEffect, useRef, useState } from 'react';

interface TourGalleryProps {
  title?: string;
  subtitle?: string;
  galleryImages?: string[];
  serviceNames?: string[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function TourGallery({
  title = 'Stüdyomuzu Keşfedin',
  subtitle = 'Benzersiz alanımızı yakından tanıyın.',
  galleryImages,
  serviceNames,
  isEditable = false,
  onFieldEdit,
}: TourGalleryProps) {
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

  const defaultCaptions = [
    'Wunda Chair Stüdyosu',
    'Reformer Eğitim Alanı',
    'Ekipman Deposu',
    'Resepsiyon Alanı',
    'Stüdyo İç Mekan',
    'Soyunma Odaları',
  ];

  const captions = serviceNames?.length ? serviceNames : defaultCaptions;

  // Duplicate for infinite scroll effect
  const infiniteImages = [...images, ...images];
  const infiniteCaptions = [...captions, ...captions];

  return (
    <section ref={sectionRef} id="tour" className="py-24 bg-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <h2
          className={`font-serif text-3xl md:text-5xl text-background mb-3 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {title}
        </h2>
        <p className={`text-background/60 text-lg transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          {subtitle}
        </p>
      </div>

      {/* Infinite Horizontal Scrolling Gallery */}
      <div className="relative overflow-hidden">
        <div
          className={`flex gap-6 px-6 md:px-12 transition-opacity duration-1000 ${
            isVisible ? 'opacity-100 animate-[scrollGallery_30s_linear_infinite]' : 'opacity-0'
          }`}
          style={{ width: 'max-content' }}
        >
          {infiniteImages.map((img, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[300px] md:w-[400px] group"
            >
              <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                <img
                  src={img}
                  alt={infiniteCaptions[index] || `Galeri ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-background font-serif text-lg mt-4">
                {infiniteCaptions[index] || `Alan ${index + 1}`}
              </h4>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollGallery {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
