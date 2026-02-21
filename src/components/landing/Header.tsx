import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [showAuth, setShowAuth] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            N<span className="text-primary">Uppel</span>
          </span>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Özellikler</button>
            <button onClick={() => scrollTo('showcase')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Örnekler</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Nasıl Çalışır</button>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} size="sm">Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowAuth(true)} className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                  Giriş Yap
                </Button>
                <Button size="sm" onClick={() => setShowAuth(true)}>
                  Ücretsiz Başla
                </Button>
              </>
            )}
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
            <button onClick={() => scrollTo('features')} className="block w-full text-left text-sm text-muted-foreground hover:text-foreground">Özellikler</button>
            <button onClick={() => scrollTo('showcase')} className="block w-full text-left text-sm text-muted-foreground hover:text-foreground">Örnekler</button>
            <button onClick={() => scrollTo('how-it-works')} className="block w-full text-left text-sm text-muted-foreground hover:text-foreground">Nasıl Çalışır</button>
          </div>
        )}
      </header>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
