import { useState } from 'react';
import { Send, Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ImageType } from '@/pages/Studio';

interface PromptInputProps {
  selectedType: ImageType;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const promptSuggestions: Record<ImageType, string[]> = {
  logo: [
    'Modern ve minimal logo, temiz çizgiler',
    'Profesyonel ve kurumsal logo tasarımı',
    'Yaratıcı ve renkli logo, dinamik görünüm',
    'Vintage tarzı, klasik logo tasarımı',
  ],
  favicon: [
    'Minimalist tek harfli ikon',
    'Geometrik şekil, basit tasarım',
    'Sembolik ikon, tek renk',
    'Modern app ikonu tarzı',
  ],
  social: [
    'Dikkat çekici kampanya görseli',
    'Profesyonel ürün tanıtım postu',
    'Motivasyonel alıntı görseli',
    'Etkinlik duyuru görseli',
  ],
  poster: [
    'İndirim kampanyası afişi',
    'Etkinlik tanıtım posteri',
    'Yeni ürün lansman afişi',
    'Sezonluk kampanya posteri',
  ],
  creative: [
    'Soyut sanat eseri, canlı renkler',
    'Doğa manzarası, huzurlu atmosfer',
    'Fütüristik şehir manzarası',
    'Minimalist geometrik tasarım',
  ],
};

const placeholders: Record<ImageType, string> = {
  logo: 'Örn: Teknoloji şirketi için modern mavi tonlarında minimalist logo...',
  favicon: 'Örn: Mavi tonlarında "A" harfi ikonu, basit ve tanınabilir...',
  social: 'Örn: Instagram için %50 indirim kampanya görseli, dikkat çekici...',
  poster: 'Örn: Yaz festivali afişi, canlı renkler ve müzik teması...',
  creative: 'Örn: Gün batımında okyanus manzarası, romantik atmosfer...',
};

export function PromptInput({ selectedType, onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleAutoGenerate = () => {
    const suggestions = promptSuggestions[selectedType];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setPrompt(randomSuggestion);
    onGenerate(randomSuggestion);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholders[selectedType]}
          className="min-h-[120px] pr-24 resize-none text-base"
          disabled={isGenerating}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                disabled={isGenerating}
              >
                <Wand2 className="w-4 h-4 mr-1" />
                Auto
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {promptSuggestions[selectedType].map((suggestion, index) => (
                <DropdownMenuItem 
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-sm"
                >
                  {suggestion}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem 
                onClick={handleAutoGenerate}
                className="text-primary font-medium"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Rastgele Oluştur
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            type="submit" 
            size="sm" 
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Character count */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{prompt.length} karakter</span>
        <span>Maksimum 500 karakter önerilir</span>
      </div>
    </div>
  );
}
