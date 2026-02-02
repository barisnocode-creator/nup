import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Statistic } from '@/types/generated-website';

interface HeroCorporateProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage?: string;
  statistics?: Statistic[];
}

export function HeroCorporate({
  title,
  subtitle,
  description,
  heroImage,
  statistics,
}: HeroCorporateProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 lg:py-32 overflow-hidden" id="hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              {subtitle}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {title}
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-lg">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8">
                Hemen Başlayın
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                Daha Fazla Bilgi
              </Button>
            </div>

            {/* Statistics */}
            {statistics && statistics.length > 0 && (
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
                {statistics.slice(0, 3).map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          {heroImage && (
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="Hero"
                  className="w-full h-auto"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-2xl -z-10" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400 rounded-2xl -z-10" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
