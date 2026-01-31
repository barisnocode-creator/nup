interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
}

interface BoldTestimonialsSectionProps {
  testimonials: Testimonial[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function BoldTestimonialsSection({
  testimonials,
  isEditable = false,
  onFieldEdit,
}: BoldTestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-white/5 text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 border border-gray-800">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            What Clients Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="p-8 bg-gray-950 border border-gray-800 relative group hover:border-gray-700 transition-colors"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-4 text-6xl font-serif text-gray-800 group-hover:text-gray-700 transition-colors">
                "
              </div>

              {/* Quote */}
              <p className="text-gray-300 leading-relaxed mb-8 relative z-10">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="pt-6 border-t border-gray-800">
                <div className="font-bold text-white uppercase tracking-wide">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {testimonial.role}
                  {testimonial.company && ` • ${testimonial.company}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
