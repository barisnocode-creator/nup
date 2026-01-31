import { Instagram, Facebook, Smartphone, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AspectRatioOption = 'instagram-square' | 'facebook-landscape' | 'story' | 'twitter' | 'pinterest';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatioOption;
  onSelectRatio: (ratio: AspectRatioOption) => void;
}

const aspectRatios = [
  { 
    id: 'instagram-square' as AspectRatioOption, 
    label: '1:1', 
    name: 'Instagram', 
    width: 1080, 
    height: 1080,
    icon: Instagram,
    preview: 'aspect-square'
  },
  { 
    id: 'facebook-landscape' as AspectRatioOption, 
    label: '1.91:1', 
    name: 'Facebook', 
    width: 1200, 
    height: 628,
    icon: Facebook,
    preview: 'aspect-[1.91/1]'
  },
  { 
    id: 'story' as AspectRatioOption, 
    label: '9:16', 
    name: 'Story', 
    width: 1080, 
    height: 1920,
    icon: Smartphone,
    preview: 'aspect-[9/16]'
  },
  { 
    id: 'twitter' as AspectRatioOption, 
    label: '16:9', 
    name: 'Twitter/X', 
    width: 1200, 
    height: 675,
    icon: Twitter,
    preview: 'aspect-video'
  },
  { 
    id: 'pinterest' as AspectRatioOption, 
    label: '2:3', 
    name: 'Pinterest', 
    width: 1000, 
    height: 1500,
    icon: null,
    preview: 'aspect-[2/3]'
  },
];

export function AspectRatioSelector({ selectedRatio, onSelectRatio }: AspectRatioSelectorProps) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Boyut Seçin</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {aspectRatios.map((ratio) => {
          const Icon = ratio.icon;
          const isSelected = selectedRatio === ratio.id;

          return (
            <button
              key={ratio.id}
              onClick={() => onSelectRatio(ratio.id)}
              className={cn(
                "flex-shrink-0 flex flex-col items-center p-4 rounded-xl border-2 transition-all min-w-[100px]",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/50 bg-card"
              )}
            >
              {/* Aspect ratio preview shape */}
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <div 
                  className={cn(
                    "bg-muted border border-border rounded-sm",
                    ratio.id === 'instagram-square' && "w-10 h-10",
                    ratio.id === 'facebook-landscape' && "w-12 h-6",
                    ratio.id === 'story' && "w-6 h-10",
                    ratio.id === 'twitter' && "w-12 h-7",
                    ratio.id === 'pinterest' && "w-7 h-10",
                    isSelected && "bg-primary/20 border-primary/50"
                  )}
                />
              </div>
              
              {/* Platform name */}
              <span className={cn(
                "text-sm font-medium",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {ratio.name}
              </span>
              
              {/* Ratio label */}
              <span className="text-xs text-muted-foreground mt-0.5">
                {ratio.label}
              </span>
              
              {/* Dimensions */}
              <span className="text-xs text-muted-foreground/70 mt-1">
                {ratio.width}×{ratio.height}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { aspectRatios };
