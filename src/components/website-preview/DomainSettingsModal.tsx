import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DomainListItem, CustomDomain } from './DomainListItem';
import { AddDomainForm } from './AddDomainForm';

interface DomainSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  initialDomain?: string;
}

export function DomainSettingsModal({ isOpen, onClose, projectId, initialDomain }: DomainSettingsModalProps) {
  const { toast } = useToast();
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [verifyingDomainId, setVerifyingDomainId] = useState<string | null>(null);

  // Fetch domains using safe view (excludes verification_token)
  const fetchDomains = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    try {
      // Use the safe view that doesn't expose verification_token
      const { data, error } = await supabase
        .from('custom_domains_safe')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDomains(data || []);
    } catch (err: any) {
      console.error('Error fetching domains:', err);
      toast({
        title: 'Hata',
        description: 'Domainler yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    if (isOpen) {
      fetchDomains();
      if (initialDomain) {
        setShowAddForm(true);
      } else {
        setShowAddForm(false);
      }
    }
  }, [isOpen, fetchDomains, initialDomain]);

  // Add domain
  const handleAddDomain = async (domain: string) => {
    setIsAdding(true);
    try {
      const { data, error } = await supabase.functions.invoke('add-custom-domain', {
        body: { projectId, domain },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Domain eklenemedi');

      toast({
        title: 'Domain Eklendi',
        description: 'DNS kayıtlarınızı yapılandırdıktan sonra doğrulama yapın.',
      });

      await fetchDomains();
      setShowAddForm(false);
    } catch (err: any) {
      console.error('Error adding domain:', err);
      throw new Error(err.message || 'Domain eklenirken bir hata oluştu');
    } finally {
      setIsAdding(false);
    }
  };

  // Verify domain
  const handleVerifyDomain = async (domainId: string) => {
    setVerifyingDomainId(domainId);
    try {
      const { data, error } = await supabase.functions.invoke('verify-domain', {
        body: { domainId },
      });

      if (error) throw error;

      if (data.status === 'active') {
        toast({
          title: 'Domain Aktif! 🎉',
          description: data.message || 'Domain doğrulandı ve SSL aktif!',
        });
      } else if (data.status === 'verified') {
        toast({
          title: 'Domain Doğrulandı! ✅',
          description: data.message || 'SSL sertifikası işleniyor, birkaç dakika içinde aktif olacak.',
        });
      } else {
        toast({
          title: 'Doğrulama Başarısız',
          description: data.message || 'DNS kayıtlarınızı kontrol edin ve tekrar deneyin.',
          variant: 'destructive',
        });
      }

      await fetchDomains();
    } catch (err: any) {
      console.error('Error verifying domain:', err);
      toast({
        title: 'Hata',
        description: 'Domain doğrulanırken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setVerifyingDomainId(null);
    }
  };

  // Remove domain
  const handleRemoveDomain = async (domainId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('remove-domain', {
        body: { domainId },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Domain silinemedi');

      toast({
        title: 'Domain Kaldırıldı',
        description: 'Domain başarıyla kaldırıldı.',
      });

      await fetchDomains();
    } catch (err: any) {
      console.error('Error removing domain:', err);
      toast({
        title: 'Hata',
        description: 'Domain kaldırılırken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Globe className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Özel Domain Bağlantısı
          </DialogTitle>
          <DialogDescription className="text-base">
            Kendi alan adınızı bağlayarak profesyonel bir görünüm elde edin.{' '}
            <a 
              href="https://github.com/user/repo/blob/main/docs/custom-domain-guide.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Yardım rehberini inceleyin →
            </a>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Domain List */}
              {domains.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Bağlı Domainler ({domains.length})
                  </h3>
                  {domains.map((domain) => (
                    <DomainListItem
                      key={domain.id}
                      domain={domain}
                      onVerify={handleVerifyDomain}
                      onRemove={handleRemoveDomain}
                      isVerifying={verifyingDomainId === domain.id}
                    />
                  ))}
                </div>
              )}

              {/* Add Form or Button */}
              {showAddForm ? (
                <AddDomainForm
                  onAdd={handleAddDomain}
                  onCancel={() => setShowAddForm(false)}
                  isLoading={isAdding}
                  initialValue={initialDomain}
                  projectId={projectId}
                  onAutoSuccess={() => { setShowAddForm(false); fetchDomains(); }}
                />
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Domain Ekle
                </Button>
              )}

              {/* Empty State */}
              {domains.length === 0 && !showAddForm && (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="text-sm">Henüz bağlı bir domain yok.</p>
                  <p className="text-xs mt-1">
                    "Yeni Domain Ekle" butonuna tıklayarak başlayın.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
