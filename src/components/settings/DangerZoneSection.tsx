import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Trash2 } from 'lucide-react';

export function DangerZoneSection() {
  const { user, deleteAccount, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'SİL') {
      toast({
        title: 'Hata',
        description: 'Lütfen onay metnini doğru girin.',
        variant: 'destructive',
      });
      return;
    }

    setDeleting(true);
    try {
      const { error } = await deleteAccount();
      
      if (error) {
        throw error;
      }

      toast({
        title: 'Hesap Silindi',
        description: 'Hesabınız ve tüm verileriniz silindi.',
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Hata',
        description: error.message || 'Hesap silinemedi.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setConfirmText('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Tehlikeli Bölge
        </CardTitle>
        <CardDescription>
          Bu işlemler geri alınamaz. Dikkatli olun.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sign Out */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Oturumu Kapat</h3>
            <p className="text-xs text-muted-foreground">
              Tüm cihazlardan çıkış yapın.
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Çıkış Yap
          </Button>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Delete Account */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-destructive">Hesabı Sil</h3>
            <p className="text-xs text-muted-foreground">
              Hesabınızı ve tüm verilerinizi kalıcı olarak silin.
            </p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Hesabı Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Hesabı Silmek Üzeresiniz
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>
                    Bu işlem geri alınamaz. Hesabınız ve aşağıdaki tüm verileriniz 
                    kalıcı olarak silinecektir:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Tüm web siteleriniz</li>
                    <li>AI Studio'da oluşturduğunuz görseller</li>
                    <li>Analytics verileri</li>
                    <li>Özel domain ayarları</li>
                    <li>Profil bilgileriniz</li>
                  </ul>
                  <div className="pt-4">
                    <Label htmlFor="confirm-delete" className="text-foreground">
                      Onaylamak için <strong>SİL</strong> yazın:
                    </Label>
                    <Input
                      id="confirm-delete"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="SİL"
                      className="mt-2"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText('')}>
                  İptal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={confirmText !== 'SİL' || deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? 'Siliniyor...' : 'Hesabı Kalıcı Olarak Sil'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
