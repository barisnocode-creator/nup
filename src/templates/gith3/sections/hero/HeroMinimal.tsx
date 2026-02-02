import { ArrowDown } from 'lucide-react';

interface HeroMinimalProps {
  title: string;
  subtitle: string;
  description: string;
}

export function HeroMinimal({ title, subtitle, description }: HeroMinimalProps) {
  return (
    <section className="min-h-screen flex flex-col justify-center relative" id="hero">
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-4xl">
          {/* Subtitle */}
          <span className="text-zinc-500 text-xs uppercase tracking-[0.3em] mb-8 block">
            {subtitle}
          </span>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] mb-8">
            {title.split(' ').map((word, index) => (
              <span key={index} className="block">
                {word}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p className="text-zinc-500 text-lg md:text-xl max-w-xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-zinc-600">
        <span className="text-xs uppercase tracking-widest">Keşfet</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
