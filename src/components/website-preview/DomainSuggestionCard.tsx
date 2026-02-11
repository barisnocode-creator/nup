import { Globe, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DomainSuggestion {
  domain: string;
  price: string;
}

interface DomainSuggestionCardProps {
  suggestions: DomainSuggestion[];
  onConnectDomain: () => void;
  onSelectDomain?: (domain: string) => void;
}

export function DomainSuggestionCard({ suggestions, onConnectDomain, onSelectDomain }: DomainSuggestionCardProps) {
  const handleDomainClick = (domain: string) => {
    if (onSelectDomain) {
      onSelectDomain(domain);
    } else {
      const searchUrl = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-primary" />
        <p className="font-medium text-sm">Sizin İçin Domain Önerileri</p>
      </div>

      <div className="space-y-2">
        {suggestions.map((s) => (
          <button
            key={s.domain}
            onClick={() => handleDomainClick(s.domain)}
            className="w-full flex items-center justify-between p-3 rounded-md border bg-background hover:bg-accent/50 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{s.domain}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{s.price}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full text-primary"
        onClick={onConnectDomain}
      >
        <ArrowRight className="w-3.5 h-3.5 mr-1" />
        Kendi domaininizi bağlayın
      </Button>
    </div>
  );
}

// Domain suggestion generation logic
export function generateDomainSuggestions(
  businessName: string,
  profession: string
): { domain: string; price: string }[] {
  const slug = businessName
    .toLowerCase()
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .substring(0, 40);

  const slugWithDash = businessName
    .toLowerCase()
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 40);

  const words = businessName.trim().split(/\s+/);
  const lastName = words.length > 1
    ? words[words.length - 1].toLowerCase()
        .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
        .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
        .replace(/[^a-z0-9]/g, '')
    : slug;

  const prof = profession?.toLowerCase() || '';

  const prefixMap: Record<string, string> = {
    doctor: 'dr', doktor: 'dr',
    dentist: 'dt', 'dis hekimi': 'dt', dishekimi: 'dt',
    lawyer: 'av', avukat: 'av', hukuk: 'av',
    pharmacy: 'eczane', eczane: 'eczane', eczaci: 'eczane',
  };

  const suffixMap: Record<string, string> = {
    doctor: 'klinik', doktor: 'klinik',
    dentist: 'dis', 'dis hekimi': 'dis', dishekimi: 'dis',
    lawyer: 'hukuk', avukat: 'hukuk', hukuk: 'hukuk',
    pharmacy: 'eczane', eczane: 'eczane', eczaci: 'eczane',
    restaurant: 'cafe', restoran: 'cafe', food: 'cafe',
  };

  const prefix = Object.entries(prefixMap).find(([k]) => prof.includes(k))?.[1];
  const suffix = Object.entries(suffixMap).find(([k]) => prof.includes(k))?.[1];

  const suggestions: string[] = [];

  if (prefix) {
    suggestions.push(`${prefix}${slug}.com`);
    suggestions.push(`${slug}${suffix || ''}.com`);
    suggestions.push(`${prefix}${lastName}.com`);
  } else {
    suggestions.push(`${slug}.com`);
    suggestions.push(`${slugWithDash}.com`);
    suggestions.push(`${slug}.com.tr`);
  }

  // Deduplicate
  const unique = [...new Set(suggestions)].slice(0, 3);

  return unique.map((domain) => ({
    domain,
    price: domain.endsWith('.com.tr') ? '~₺120/yıl' : '~$10/yıl',
  }));
}
