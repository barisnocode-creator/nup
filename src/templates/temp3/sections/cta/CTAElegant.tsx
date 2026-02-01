import { ArrowRight } from 'lucide-react';

interface CTAElegantProps {
  headline: string;
  ctaText: string;
}

export function CTAElegant({ headline, ctaText }: CTAElegantProps) {
  return (
    <section id="contact" className="py-32 bg-[#37322F] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-normal text-white mb-8 leading-tight">
            {headline}
          </h2>

          <p className="text-white/60 mb-10 max-w-lg mx-auto">
            Let's start a conversation about how we can help you achieve your goals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-10 py-4 bg-white text-[#37322F] rounded-full font-medium hover:bg-[#F7F5F3] transition-all duration-300 flex items-center gap-2 group">
              {ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-4 bg-transparent text-white rounded-full font-medium border border-white/20 hover:bg-white/10 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
