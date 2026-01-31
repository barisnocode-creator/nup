import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

interface DNSInstructionsProps {
  domain: string;
  verificationToken: string;
  defaultOpen?: boolean;
}

interface DNSRecordRowProps {
  label: string;
  type: string;
  host: string;
  value: string;
}

function DNSRecordRow({ label, type, host, value }: DNSRecordRowProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast({
      title: 'Kopyalandı!',
      description: `${label} değeri panoya kopyalandı.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-3 rounded-lg bg-muted/50 border space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">
          {type}
        </span>
      </div>
      <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
        <span className="text-muted-foreground">Host:</span>
        <span className="font-mono">{host}</span>
        <span className="text-muted-foreground">Value:</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs break-all flex-1">{value}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DNSInstructions({ domain, verificationToken, defaultOpen = false }: DNSInstructionsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Extract root domain (remove www. if present)
  const rootDomain = domain.replace(/^www\./, '');

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-3 py-2 h-auto"
        >
          <span className="text-sm font-medium">DNS Kayıt Talimatları</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-2">
        <p className="text-sm text-muted-foreground px-1">
          Domain sağlayıcınızın DNS ayarlarına gidin ve aşağıdaki kayıtları ekleyin:
        </p>

        <DNSRecordRow
          label="A Kaydı (Root Domain)"
          type="A"
          host="@"
          value="185.158.133.1"
        />

        <DNSRecordRow
          label="A Kaydı (WWW)"
          type="A"
          host="www"
          value="185.158.133.1"
        />

        <DNSRecordRow
          label="TXT Kaydı (Doğrulama)"
          type="TXT"
          host="_lovable"
          value={`lovable_verify=${verificationToken}`}
        />

        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            <strong>Not:</strong> DNS değişikliklerinin yayılması 24-48 saat sürebilir. 
            Kayıtları ekledikten sonra "Doğrula" butonuna tıklayın.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
