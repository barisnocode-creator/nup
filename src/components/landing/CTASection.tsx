import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

export function CTASection() {
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
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Headline */}
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-6">
              Bugün profesyonel web sitenizi oluşturun
            </h2>
            <p className="text-lg text-background/70 mb-10">
              Binlerce sağlık profesyoneli gibi siz de AI ile web sitenizi oluşturun.
            </p>

            {/* Input CTA */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-background/10 rounded-lg border border-background/20">
                <Input
                  type="text"
                  placeholder="Ne tür bir klinik/muayenehane?"
                  value={clinicType}
                  onChange={(e) => setClinicType(e.target.value)}
                  className="flex-1 h-12 border-0 bg-background text-foreground text-base"
                />
                <Button 
                  size="lg" 
                  className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleCTA}
                >
                  Ücretsiz Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span className="ml-2 text-sm text-background/70">4.8 Puan</span>
              </div>
              <div className="h-4 w-px bg-background/30" />
              <span className="text-sm text-background/70">
                Kredi kartı gerektirmez
              </span>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultTab="signup"
      />
    </>
  );
}
