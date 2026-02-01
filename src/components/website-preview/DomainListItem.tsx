import { useState, useEffect } from 'react';
import { Clock, Loader2, Check, X, Trash2, RefreshCw, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { DNSInstructions } from './DNSInstructions';
import { supabase } from '@/integrations/supabase/client';

// Safe domain type without verification_token
export interface CustomDomain {
  id: string;
  domain: string;
  status: string;
  is_primary: boolean;
  created_at: string;
  verified_at: string | null;
}

interface DomainListItemProps {
  domain: CustomDomain;
  onVerify: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  isVerifying?: boolean;
}

interface DNSRecord {
  type: string;
  label: string;
  host: string;
  value: string;
}

const statusConfig = {
  pending: {
    label: 'Bekliyor',
    icon: Clock,
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  verifying: {
    label: 'Doğrulanıyor',
    icon: Loader2,
    className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  verified: {
    label: 'Doğrulandı',
    icon: Check,
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  failed: {
    label: 'Başarısız',
    icon: X,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function DomainListItem({ domain, onVerify, onRemove, isVerifying = false }: DomainListItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[] | null>(null);
  const [loadingDns, setLoadingDns] = useState(false);
  
  const status = statusConfig[domain.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;
  const showVerifyButton = domain.status === 'pending' || domain.status === 'failed';

  // Fetch DNS instructions via secure RPC function
  useEffect(() => {
    const fetchDnsInstructions = async () => {
      if (showVerifyButton && !dnsRecords) {
        setLoadingDns(true);
        try {
          const { data, error } = await supabase
            .rpc('get_domain_dns_instructions', { domain_id: domain.id });
          
          if (!error && data && typeof data === 'object' && 'records' in data) {
            const records = (data as unknown as { records: DNSRecord[] }).records;
            setDnsRecords(records);
          }
        } catch (err) {
          console.error('Error fetching DNS instructions:', err);
        } finally {
          setLoadingDns(false);
        }
      }
    };
    
    fetchDnsInstructions();
  }, [domain.id, showVerifyButton, dnsRecords]);

  const handleVerify = async () => {
    await onVerify(domain.id);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(domain.id);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-card space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{domain.domain}</span>
            {domain.is_primary && (
              <Badge variant="secondary" className="flex-shrink-0 gap-1">
                <Crown className="w-3 h-3" />
                Birincil
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge variant="outline" className={status.className}>
              <StatusIcon className={`w-3 h-3 mr-1 ${isVerifying && domain.status !== 'verified' ? 'animate-spin' : ''}`} />
              {isVerifying && domain.status !== 'verified' ? 'Kontrol ediliyor...' : status.label}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {showVerifyButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Doğrula
                </>
              )}
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Domain'i Kaldır</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>{domain.domain}</strong> adresini kaldırmak istediğinize emin misiniz? 
                  Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemove}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Kaldır
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* DNS Instructions (for pending/failed) - loaded securely */}
      {showVerifyButton && (
        loadingDns ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : dnsRecords ? (
          <DNSInstructions
            domain={domain.domain}
            records={dnsRecords}
            defaultOpen={domain.status === 'pending'}
          />
        ) : null
      )}
    </div>
  );
}
