import { Star, Share2, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImageType } from '@/pages/Studio';

interface ImageTypeCardsProps {
  selectedType: ImageType;
  onSelectType: (type: ImageType) => void;
}

const imageTypes = [
  {
    type: 'logo' as ImageType,
    icon: Star,
    title: 'Logo',
    subtitle: 'Oluştur',
    description: 'Profesyonel işletme logosu',
  },
  {
    type: 'social' as ImageType,
    icon: Share2,
    title: 'Sosyal',
    subtitle: 'Paylaşım',
    description: 'Instagram, Facebook görselleri',
  },
  {
    type: 'poster' as ImageType,
    icon: FileText,
    title: 'Poster',
    subtitle: 'Oluştur',
    description: 'Etkinlik ve kampanya afişleri',
  },
  {
    type: 'creative' as ImageType,
    icon: Sparkles,
    title: 'Yaratıcı',
    subtitle: 'Ol',
    description: 'Serbest tasarım oluştur',
  },
];

export function ImageTypeCards({ selectedType, onSelectType }: ImageTypeCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {imageTypes.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedType === item.type;

        return (
          <button
            key={item.type}
            onClick={() => onSelectType(item.type)}
            className={cn(
              "relative p-6 rounded-xl border-2 transition-all text-left group hover:shadow-lg",
              isSelected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/50 bg-card"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
              isSelected 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted group-hover:bg-primary/10"
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.subtitle}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.description}
            </p>
            {isSelected && (
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
