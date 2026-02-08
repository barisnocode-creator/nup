import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { testSignIn } = useAuth();
  const { toast } = useToast();

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await testSignIn();
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Giriş başarısız',
          description: error.message,
        });
        return;
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[360px] p-0 overflow-hidden">
        <div className="gradient-hero p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary-foreground">
              Test Girişi
            </DialogTitle>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Test hesabıyla otomatik giriş yapın
            </p>
          </DialogHeader>
        </div>
        <div className="p-6">
          <Button
            className="w-full h-12 text-base"
            onClick={handleTestLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
