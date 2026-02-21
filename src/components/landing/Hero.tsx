import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (user) navigate('/dashboard');
    else setShowAuth(true);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-background">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                AI Destekli Web Sitesi Oluşturucu
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-foreground tracking-tight">
                Profesyonel web sitenizi{' '}
                <span className="text-primary">yapay zeka</span> ile oluşturun
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Kodlama bilgisi gerektirmez. Her sektöre özel, modern ve mobil uyumlu web siteleri 30 saniyede hazır.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button size="lg" className="h-12 px-8 text-base" onClick={handleCTA}>
                  Ücretsiz Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}>
                  Örnekleri Gör
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" />Kredi kartı gerektirmez</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" />1000+ İşletme güveniyor</span>
              </div>
            </motion.div>

            {/* Right - Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl blur-2xl" />
                <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-destructive/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                      <div className="w-3 h-3 rounded-full bg-green-400/60" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-6 bg-background rounded-md flex items-center px-3">
                        <span className="text-xs text-muted-foreground">www.isletmeniz.nuppel.app</span>
                      </div>
                    </div>
                  </div>
                  {/* Mock content */}
                  <div className="p-8 space-y-6">
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 bg-primary/20 rounded" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 bg-primary/10 rounded-lg" />
                      <div className="h-20 bg-accent/10 rounded-lg" />
                      <div className="h-20 bg-primary/10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted rounded" />
                      <div className="h-3 w-5/6 bg-muted rounded" />
                      <div className="h-3 w-4/6 bg-muted rounded" />
                    </div>
                    <div className="flex gap-3">
                      <div className="h-10 w-28 bg-primary rounded-md" />
                      <div className="h-10 w-28 bg-muted rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
