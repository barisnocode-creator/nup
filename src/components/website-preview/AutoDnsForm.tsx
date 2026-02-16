import { useState } from 'react';
import { Loader2, Zap, AlertTriangle, CheckCircle2, XCircle, Eye, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Provider = 'namecheap' | 'godaddy' | 'cloudflare';

interface DnsRecord {
  type: string;
  host: string;
  value: string;
  ttl?: number;
}

interface DryRunResult {
  provider: string;
  existing_records: DnsRecord[];
  conflicts: { record: DnsRecord; reason: string }[];
  planned_changes: DnsRecord[];
  warnings: string[];
}

interface AutoDnsFormProps {
  projectId: string;
  onCancel: () => void;
  onSuccess: () => void;
  initialDomain?: string;
}

type Stage = 'form' | 'preview' | 'applying' | 'result';

export function AutoDnsForm({ projectId, onCancel, onSuccess, initialDomain = '' }: AutoDnsFormProps) {
  const { toast } = useToast();
  const [domain, setDomain] = useState(initialDomain);
  const [provider, setProvider] = useState<Provider | ''>('');
  const [apiKey, setApiKey] = useState('');
  const [apiUser, setApiUser] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [stage, setStage] = useState<Stage>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null);
  const [domainId, setDomainId] = useState<string | null>(null);
  const [applyResult, setApplyResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const getCredentials = () => {
    if (provider === 'namecheap') return { apiKey, apiUser };
    if (provider === 'godaddy') return { apiKey, apiSecret };
    if (provider === 'cloudflare') return { apiToken };
    return {};
  };

  const isFormValid = () => {
    if (!domain || !provider) return false;
    if (provider === 'namecheap') return !!apiKey && !!apiUser;
    if (provider === 'godaddy') return !!apiKey && !!apiSecret;
    if (provider === 'cloudflare') return !!apiToken;
    return false;
  };

  // Stage 1: Dry Run
  const handleDryRun = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First add domain to get verification token
      const { data: addData, error: addError } = await supabase.functions.invoke('add-custom-domain', {
        body: { projectId, domain },
      });
      if (addError) throw addError;
      if (!addData?.success) throw new Error(addData?.error || 'Domain eklenemedi');
      setDomainId(addData.domainId);

      // Then do dry run
      const { data, error: fnError } = await supabase.functions.invoke('auto-configure-dns', {
        body: {
          projectId,
          domain,
          provider,
          credentials: getCredentials(),
          dry_run: true,
          domainId: addData.domainId,
        },
      });
      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || 'Önizleme başarısız');
      setDryRunResult(data);
      setStage('preview');
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
      toast({ title: 'Hata', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 2: Apply
  const handleApply = async () => {
    if (!domainId) return;
    setStage('applying');
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('auto-configure-dns', {
        body: {
          projectId,
          domain,
          provider,
          credentials: getCredentials(),
          dry_run: false,
          domainId,
        },
      });
      if (fnError) throw fnError;
      setApplyResult(data);
      setStage('result');
      if (data?.success) {
        toast({ title: 'DNS Yapılandırıldı! 🎉', description: 'DNS kayıtları başarıyla uygulandı.' });
        onSuccess();
      } else {
        setError(data?.error || 'DNS kayıtları uygulanırken bir hata oluştu');
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
      setStage('result');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove domain on cancel if we already added it
  const handleCancel = async () => {
    if (domainId && stage !== 'result') {
      try {
        await supabase.functions.invoke('remove-domain', { body: { domainId } });
      } catch { /* best effort */ }
    }
    onCancel();
  };

  const providerInfo: Record<Provider, { label: string; hint: string }> = {
    namecheap: { label: 'Namecheap', hint: 'Namecheap hesabınızda API erişimini açmanız ve IP beyaz listesini ayarlamanız gerekir.' },
    godaddy: { label: 'GoDaddy', hint: 'Production API Key kullandığınızdan emin olun (Test key çalışmaz).' },
    cloudflare: { label: 'Cloudflare', hint: '"Edit zone DNS" izni olan bir API Token gerekir.' },
  };

  // ── FORM STAGE ──
  if (stage === 'form') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Domain Adresi</Label>
          <Input
            placeholder="ornek.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''))}
          />
        </div>

        <div className="space-y-2">
          <Label>DNS Sağlayıcısı</Label>
          <Select value={provider} onValueChange={(v) => setProvider(v as Provider)}>
            <SelectTrigger>
              <SelectValue placeholder="Sağlayıcı seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="namecheap">Namecheap</SelectItem>
              <SelectItem value="godaddy">GoDaddy</SelectItem>
              <SelectItem value="cloudflare">Cloudflare</SelectItem>
            </SelectContent>
          </Select>
          {provider && (
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-500" />
              {providerInfo[provider].hint}
            </p>
          )}
        </div>

        {/* Provider-specific credentials */}
        {provider === 'namecheap' && (
          <>
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input type="password" placeholder="Namecheap API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>API Username</Label>
              <Input placeholder="Namecheap kullanıcı adı" value={apiUser} onChange={(e) => setApiUser(e.target.value)} />
            </div>
          </>
        )}
        {provider === 'godaddy' && (
          <>
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input type="password" placeholder="GoDaddy API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>API Secret</Label>
              <Input type="password" placeholder="GoDaddy API Secret" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} />
            </div>
          </>
        )}
        {provider === 'cloudflare' && (
          <div className="space-y-2">
            <Label>API Token</Label>
            <Input type="password" placeholder="Cloudflare API Token" value={apiToken} onChange={(e) => setApiToken(e.target.value)} />
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <p className="text-xs text-muted-foreground">
          API bilgileriniz güvenli şekilde iletilir ve saklanmaz. Yalnızca DNS yapılandırması için tek seferlik kullanılır.
        </p>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
            İptal
          </Button>
          <Button onClick={handleDryRun} disabled={!isFormValid() || isLoading} className="flex-1">
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Kontrol ediliyor...</>
            ) : (
              <><Eye className="w-4 h-4 mr-2" />Önizle</>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // ── PREVIEW STAGE ──
  if (stage === 'preview' && dryRunResult) {
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-sm">DNS Değişiklik Önizlemesi</h4>

        {/* Warnings */}
        {dryRunResult.warnings.length > 0 && (
          <div className="space-y-1">
            {dryRunResult.warnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-600 flex items-start gap-1">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {w}
              </p>
            ))}
          </div>
        )}

        {/* Conflicts */}
        {dryRunResult.conflicts.length > 0 && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 space-y-1">
            <p className="text-sm font-medium text-amber-600">Çakışmalar</p>
            {dryRunResult.conflicts.map((c, i) => (
              <p key={i} className="text-xs text-muted-foreground">{c.reason}</p>
            ))}
          </div>
        )}

        {/* Planned changes */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Uygulanacak Kayıtlar</p>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-1.5 text-left font-medium">Tür</th>
                  <th className="px-3 py-1.5 text-left font-medium">Host</th>
                  <th className="px-3 py-1.5 text-left font-medium">Değer</th>
                </tr>
              </thead>
              <tbody>
                {dryRunResult.planned_changes.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-1.5"><Badge variant="secondary" className="text-xs">{r.type}</Badge></td>
                    <td className="px-3 py-1.5 font-mono">{r.host}</td>
                    <td className="px-3 py-1.5 font-mono truncate max-w-[180px]">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Existing records count */}
        <p className="text-xs text-muted-foreground">
          Mevcut {dryRunResult.existing_records.length} DNS kaydı korunacaktır.
        </p>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} className="flex-1">İptal</Button>
          <Button onClick={handleApply} className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Uygula
          </Button>
        </div>
      </div>
    );
  }

  // ── APPLYING STAGE ──
  if (stage === 'applying') {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">DNS kayıtları uygulanıyor...</p>
      </div>
    );
  }

  // ── RESULT STAGE ──
  return (
    <div className="space-y-4">
      {applyResult?.success ? (
        <div className="flex flex-col items-center py-4 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          <p className="font-medium">DNS Başarıyla Yapılandırıldı!</p>
          <p className="text-sm text-muted-foreground text-center">
            DNS kayıtları uygulandı. Yayılma 5 dakika ile 48 saat arasında sürebilir.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center py-4 space-y-3">
          <XCircle className="w-12 h-12 text-destructive" />
          <p className="font-medium">DNS Yapılandırma Başarısız</p>
          <p className="text-sm text-destructive text-center">{error || 'Bilinmeyen hata'}</p>
          {applyResult?.rollback === 'success' && (
            <p className="text-xs text-muted-foreground">Otomatik geri alma yapıldı, mevcut kayıtlarınız korunmuştur.</p>
          )}
        </div>
      )}

      {/* Change log */}
      {applyResult?.change_log?.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">İşlem Detayları</p>
          {applyResult.change_log.map((c: any, i: number) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {c.status === 'applied' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : (
                <XCircle className="w-3 h-3 text-destructive" />
              )}
              <span>{c.record.type} {c.record.host} → {c.record.value}</span>
            </div>
          ))}
        </div>
      )}

      <Button variant="outline" onClick={onCancel} className="w-full">Kapat</Button>
    </div>
  );
}
