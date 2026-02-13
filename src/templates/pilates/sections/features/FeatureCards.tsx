import { useEffect, useRef, useState } from 'react';

interface FeatureCardsProps {
  title: string;
  services: Array<{ title: string; description: string; icon?: string }>;
  images?: string[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function FeatureCards({
  title,
  services,
  images,
  isEditable = false,
  onFieldEdit,
}: FeatureCardsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const defaultImages = [
    'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
  ];

  const displayServices = services.slice(0, 3);

  return (
    <section ref={sectionRef} id="features" className="py-24 bg-[#f5ebe0]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2
          className={`font-serif text-3xl md:text-5xl text-center text-[#2d2420] mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {displayServices.map((service, index) => (
            <div
              key={index}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/5]">
                <img
                  src={images?.[index] || defaultImages[index]}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-[#2d2420] mb-2">{service.title}</h3>
              <p className="text-[#6b5e54] text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
