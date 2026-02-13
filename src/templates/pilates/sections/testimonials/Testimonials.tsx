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
    { name: 'Ayşe K.', content: 'The atmosphere is incredibly calming. Every session feels like a retreat.', rating: 5 },
    { name: 'Mehmet S.', content: 'Best pilates studio I\'ve ever been to. The trainers are exceptional.', rating: 5 },
    { name: 'Zeynep D.', content: 'Transformative experience. My posture and flexibility have improved dramatically.', rating: 5 },
  ];

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 bg-[#2d2420]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className={`font-serif text-3xl md:text-5xl text-[#f5ebe0] text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          What Our Clients Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {defaultTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-700 hover:bg-white/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#c4775a]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[#f5ebe0]/80 text-base mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <p className="text-[#c4775a] font-semibold text-sm">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
