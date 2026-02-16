import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AutoDnsForm } from './AutoDnsForm';

interface AddDomainFormProps {
  onAdd: (domain: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialValue?: string;
  projectId?: string;
  onAutoSuccess?: () => void;
}

export function AddDomainForm({ onAdd, onCancel, isLoading = false, initialValue = '', projectId, onAutoSuccess }: AddDomainFormProps) {
  const [domain, setDomain] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validateDomain = (value: string): string | null => {
    if (value.length < 4) return 'Domain en az 4 karakter olmalıdır';
    if (value.length > 253) return 'Domain 253 karakterden uzun olamaz';
    if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(value)) return 'Geçersiz domain formatı';
    if (!value.includes('.')) return 'Domain bir TLD içermelidir (örn: .com, .net)';
    return null;
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, '');
    setDomain(value);
    setError(value.length >= 4 ? validateDomain(value) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateDomain(domain);
    if (validationError) { setError(validationError); return; }
    try {
      await onAdd(domain);
      setDomain('');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Domain eklenirken bir hata oluştu');
    }
  };

  return (
    <Tabs defaultValue={projectId ? 'auto' : 'manual'} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manual">Manuel Kurulum</TabsTrigger>
        <TabsTrigger value="auto">Otomatik Kurulum</TabsTrigger>
      </TabsList>

      <TabsContent value="manual">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain Adresi</Label>
            <Input
              id="domain"
              type="text"
              placeholder="ornek.com veya www.ornek.com"
              value={domain}
              onChange={handleDomainChange}
              disabled={isLoading}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">
              Kendi alan adınızı bağlayarak profesyonel bir görünüm elde edin
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
              İptal
            </Button>
            <Button type="submit" disabled={isLoading || !domain || !!error} className="flex-1">
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Ekleniyor...</>
              ) : (
                <><Plus className="w-4 h-4 mr-2" />Domain Ekle</>
              )}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="auto">
        {projectId ? (
          <AutoDnsForm
            projectId={projectId}
            onCancel={onCancel}
            onSuccess={onAutoSuccess || onCancel}
            initialDomain={initialValue}
          />
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Otomatik kurulum için proje bilgisi gereklidir.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
