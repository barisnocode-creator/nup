import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';

export function Hero() {
  const [showAuth, setShowAuth] = useState(false);
  const [clinicType, setClinicType] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setShowAuth(true);
    }
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center pt-16 bg-background">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6 text-foreground animate-fade-in">
              Web sitenizi
              <span className="block text-primary">AI ile oluşturun</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Her sektör için profesyonel web siteleri.
              Kodlama gerektirmez. 30 saniyede başlayın.
            </p>

            {/* Input CTA */}
            <div className="max-w-xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-secondary rounded-lg border border-border">
                <Input
                  type="text"
                  placeholder="Ne tür bir işletme/proje?"
                  value={clinicType}
                  onChange={(e) => setClinicType(e.target.value)}
                  className="flex-1 h-12 border-0 bg-background text-base"
                />
                <Button 
                  size="lg" 
                  className="h-12 px-6 bg-primary hover:bg-primary/90"
                  onClick={handleCTA}
                >
                  Ücretsiz Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">4.8 Puan</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground">
                1000+ İşletme Güveniyor
              </span>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
    </>
  );
}
