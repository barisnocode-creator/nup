import { useEffect, useRef, useState } from 'react';

interface TestimonialsProps {
  highlights?: Array<{ title: string; description: string }>;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function Testimonials({
  highlights = [],
  isEditable = false,
  onFieldEdit,
}: TestimonialsProps) {
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

  const defaultTestimonials = [
    { name: 'Ayşe K.', content: 'Atmosfer inanılmaz huzurlu. Her seans bir kaçış gibi hissettiriyor.', rating: 5 },
    { name: 'Mehmet S.', content: 'Gittiğim en iyi stüdyo. Eğitmenler olağanüstü.', rating: 5 },
    { name: 'Zeynep D.', content: 'Dönüştürücü bir deneyim. Duruşum ve esnekliğim inanılmaz gelişti.', rating: 5 },
  ];

  // Use highlights from generated content if available
  const testimonials = highlights.length > 0
    ? highlights.map((h, i) => ({ name: h.title, content: h.description, rating: 5 }))
    : defaultTestimonials;

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 bg-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className={`font-serif text-3xl md:text-5xl text-background text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Müşterilerimiz Ne Diyor
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-background/5 backdrop-blur-sm border border-background/10 rounded-2xl p-8 transition-all duration-700 hover:bg-background/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-background/80 text-base mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <p className="text-primary font-semibold text-sm">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
