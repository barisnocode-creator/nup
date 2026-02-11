import { useState } from 'react';
import { Globe, ExternalLink, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

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
  const [open, setOpen] = useState(false);

  const handleDomainClick = (domain: string) => {
    if (onSelectDomain) {
      onSelectDomain(domain);
    } else {
      const searchUrl = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="p-3 rounded-lg border border-orange-200 bg-white">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-500" />
              <p className="font-medium text-sm text-gray-800">Sizin İçin Domain Önerileri</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <div className="space-y-2 pt-3">
            {suggestions.map((s) => (
              <button
                key={s.domain}
                onClick={() => handleDomainClick(s.domain)}
                className="w-full flex items-center justify-between p-2.5 rounded-md border border-orange-100 bg-orange-50 hover:bg-orange-100 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-800">{s.domain}</span>
                  <span className="text-xs text-gray-500 bg-orange-100 px-2 py-0.5 rounded-full">{s.price}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-orange-600 hover:text-orange-700"
              onClick={onConnectDomain}
            >
              <ArrowRight className="w-3.5 h-3.5 mr-1" />
              Kendi domaininizi bağlayın
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
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
