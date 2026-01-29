import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();
  const navigate = useNavigate();

  const openLogin = () => {
    setAuthTab('login');
    setShowAuth(true);
  };

  const openSignup = () => {
    setAuthTab('signup');
    setShowAuth(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif font-semibold text-foreground">Open Lucius</span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={openLogin} className="text-muted-foreground hover:text-foreground">
                  Giriş Yap
                </Button>
                <Button onClick={openSignup} className="bg-primary hover:bg-primary/90">
                  Ücretsiz Başla
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultTab={authTab}
      />
    </>
  );
}
