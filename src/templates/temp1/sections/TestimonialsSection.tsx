import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestimonialsSectionProps {
  isDark: boolean;
  isNeutral: boolean;
}

// Placeholder testimonials - will be generated/customized later
const placeholderTestimonials = [
  {
    name: 'Sarah M.',
    role: 'Patient',
    content: 'Exceptional care and attention to detail. The staff made me feel comfortable from the moment I walked in. Highly recommend!',
    rating: 5,
    avatar: '👩',
  },
  {
    name: 'John D.',
    role: 'Patient',
    content: 'Professional service with a personal touch. They took the time to explain everything and answer all my questions thoroughly.',
    rating: 5,
    avatar: '👨',
  },
  {
    name: 'Emily R.',
    role: 'Patient',
    content: 'I\'ve been a patient for years and have always received outstanding care. The team is knowledgeable and genuinely caring.',
    rating: 5,
    avatar: '👩‍🦰',
  },
];

export function TestimonialsSection({
  isDark,
  isNeutral,
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      'py-20',
      isDark ? 'bg-slate-900' : isNeutral ? 'bg-stone-50' : 'bg-white'
    )} id="testimonials">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className={cn(
            'inline-block px-4 py-1 rounded-full text-sm font-medium mb-4',
            isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
          )}>
            Testimonials
          </span>
          <h2 className={cn(
            'text-3xl md:text-4xl font-bold',
            isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
          )}>
            What Our Patients Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {placeholderTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className={cn(
                'relative p-8 rounded-2xl border',
                isDark 
                  ? 'bg-slate-800 border-slate-700' 
                  : isNeutral 
                    ? 'bg-white border-stone-200' 
                    : 'bg-gray-50 border-gray-200'
              )}
            >
              {/* Quote Icon */}
              <Quote className={cn(
                'absolute top-6 right-6 w-8 h-8',
                isDark ? 'text-slate-700' : 'text-gray-200'
              )} />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className={cn(
                'text-base leading-relaxed mb-6',
                isDark ? 'text-slate-300' : isNeutral ? 'text-stone-700' : 'text-gray-700'
              )}>
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
                  isDark ? 'bg-slate-700' : 'bg-gray-200'
                )}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className={cn(
                    'font-semibold',
                    isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
                  )}>
                    {testimonial.name}
                  </div>
                  <div className={cn(
                    'text-sm',
                    isDark ? 'text-slate-400' : isNeutral ? 'text-stone-500' : 'text-gray-500'
                  )}>
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
