import { MessageCircle, Star } from 'lucide-react';

interface Highlight {
  title: string;
  description: string;
  icon: string;
}

interface TestimonialsElegantProps {
  highlights: Highlight[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function TestimonialsElegant({
  highlights,
  isEditable = false,
  onFieldEdit,
}: TestimonialsElegantProps) {
  // Transform highlights into testimonials
  const testimonials = highlights.slice(0, 3).map((h, i) => ({
    quote: h.description,
    author: `Client ${i + 1}`,
    role: h.title,
    rating: 5,
  }));

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 bg-[#F7F5F3]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[rgba(55,50,47,0.08)] shadow-sm mb-6">
            <MessageCircle className="w-3.5 h-3.5 text-[#37322F]" />
            <span className="text-xs font-medium text-[#49423D]">Testimonials</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-[#37322F] mb-6">
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 border border-[rgba(55,50,47,0.06)] hover:border-[rgba(55,50,47,0.12)] hover:shadow-xl hover:shadow-[#37322F]/5 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#37322F] text-[#37322F]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#49423D] leading-relaxed mb-8 text-sm">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-[rgba(55,50,47,0.08)]">
                <div className="w-10 h-10 rounded-full bg-[#37322F] flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-[#37322F]">
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-[#605A57]">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
