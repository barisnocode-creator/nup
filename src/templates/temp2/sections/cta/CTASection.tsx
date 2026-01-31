interface BoldCTASectionProps {
  headline: string;
  ctaText: string;
}

export function BoldCTASection({ headline, ctaText }: BoldCTASectionProps) {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-gray-950 max-w-4xl mx-auto mb-12">
          Ready to Start Your Next Project?
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-12 py-6 bg-gray-950 text-white font-bold text-lg uppercase tracking-wide hover:bg-gray-800 transition-all">
            {ctaText || 'Get Started'}
          </button>
          <button className="px-12 py-6 border-2 border-gray-950 text-gray-950 font-bold text-lg uppercase tracking-wide hover:bg-gray-950 hover:text-white transition-all">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
