import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CTASaaSProps {
  siteName: string;
  tagline: string;
  isDark: boolean;
}

export function CTASaaS({ siteName, tagline, isDark }: CTASaaSProps) {
  return (
    <section className="py-20" id="cta">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-12 md:p-16 text-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Hemen Başlayın
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {siteName} ile İşinizi Büyütmeye Hazır mısınız?
            </h2>

            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              {tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full px-8 gap-2"
              >
                Ücretsiz Deneyin
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full px-8"
              >
                Demo Talep Et
              </Button>
            </div>

            <p className="mt-6 text-sm text-white/60">
              Kredi kartı gerektirmez • 14 gün ücretsiz deneme
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASaaS;
