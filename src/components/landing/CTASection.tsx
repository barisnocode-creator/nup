import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (user) navigate('/dashboard');
    else setShowAuth(true);
  };

  return (
    <>
      <section className="py-24 bg-primary relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Bugün profesyonel web sitenizi oluşturun
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
              Binlerce işletme gibi siz de AI ile web sitenizi oluşturun. Kredi kartı gerektirmez.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="h-13 px-8 text-base font-semibold"
              onClick={handleCTA}
            >
              Ücretsiz Başla
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
