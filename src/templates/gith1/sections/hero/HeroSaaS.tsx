import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

interface HeroSaaSProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage?: string;
  isDark: boolean;
  isEditable?: boolean;
  onFieldEdit?: (path: string, value: string) => void;
}

export function HeroSaaS({
  title,
  subtitle,
  description,
  heroImage,
  isDark,
  isEditable,
  onFieldEdit,
}: HeroSaaSProps) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32" id="hero">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {subtitle}
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8 gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
              Ücretsiz Başla
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 gap-2">
              <Play className="w-4 h-4" />
              Demo İzle
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-muted border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-sm">1000+ kullanıcı</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <span className="text-sm ml-1">4.9/5 puan</span>
            </div>
          </div>
        </div>
        
        {/* Hero Image */}
        {heroImage && (
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border">
              <img 
                src={heroImage} 
                alt="Product screenshot" 
                className="w-full h-auto"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSaaS;
