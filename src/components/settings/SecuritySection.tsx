import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, Key, Eye, EyeOff } from 'lucide-react';

export function SecuritySection() {
  const { updatePassword, resetPassword, user } = useAuth();
  const { toast } = useToast();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: 'Hata',
        description: 'Lütfen tüm alanları doldurun.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Hata',
        description: 'Şifre en az 6 karakter olmalıdır.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Hata',
        description: 'Şifreler eşleşmiyor.',
        variant: 'destructive',
      });
      return;
    }

    setUpdating(true);
    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        throw error;
      }

      toast({
        title: 'Başarılı',
        description: 'Şifreniz güncellendi.',
      });

      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: 'Hata',
        description: error.message || 'Şifre güncellenemedi.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) {
      toast({
        title: 'Hata',
        description: 'E-posta adresi bulunamadı.',
        variant: 'destructive',
      });
      return;
    }

    setSendingReset(true);
    try {
      const { error } = await resetPassword(user.email);
      
      if (error) {
        throw error;
      }

      toast({
        title: 'E-posta Gönderildi',
        description: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
      });
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast({
        title: 'Hata',
        description: error.message || 'E-posta gönderilemedi.',
        variant: 'destructive',
      });
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Güvenlik
        </CardTitle>
        <CardDescription>
          Şifrenizi değiştirin ve hesap güvenliğinizi yönetin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Change Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Key className="h-4 w-4" />
            Şifre Değiştir
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">Yeni Şifre</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="En az 6 karakter"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Şifre Tekrar</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifreyi tekrar girin"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button onClick={handlePasswordUpdate} disabled={updating}>
            {updating ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </Button>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Password Reset Email */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Şifremi Unuttum</h3>
          <p className="text-sm text-muted-foreground">
            Şifrenizi hatırlayamıyorsanız, e-posta adresinize sıfırlama bağlantısı gönderebiliriz.
          </p>
          <Button variant="outline" onClick={handleSendResetEmail} disabled={sendingReset}>
            {sendingReset ? 'Gönderiliyor...' : 'Sıfırlama E-postası Gönder'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
