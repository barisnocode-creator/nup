import { useRef } from 'react';

interface HeroFullscreenProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage?: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function HeroFullscreen({
  title,
  subtitle,
  description,
  heroImage,
  isEditable = false,
  onFieldEdit,
}: HeroFullscreenProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const defaultBg = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=80';
  const bgImage = heroImage || defaultBg;

  const scrollToNext = () => {
    const nextSection = sectionRef.current?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-end overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/30 to-primary/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 pt-40">
        <div className="grid md:grid-cols-2 gap-12 items-end">
          <div className="animate-fade-in">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight mb-6">
              {title}
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-md">
              {description}
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-white text-xl font-semibold mb-2">{subtitle}</h3>
              <p className="text-white/60 text-sm mb-6">İlk seansınızdan başlayarak</p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <input
                  type="tel"
                  placeholder="Telefon Numarası"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all duration-300">
                  Bizi Arayın
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToNext}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white flex flex-col items-center gap-2 transition-colors"
      >
        <span className="text-sm tracking-widest uppercase">Keşfet</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </button>
    </section>
  );
}
