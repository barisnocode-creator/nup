import { X, Palette, Type, Square, Sparkles, Image, ChevronRight, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface SiteSettings {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  corners?: 'rounded' | 'sharp' | 'pill';
  animations?: boolean;
  favicon?: string;
}

interface CustomizeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings?: SiteSettings;
  onSettingsChange: (settings: SiteSettings) => void;
  onRegenerateText: () => void;
  onRegenerateWebsite: () => void;
  isRegenerating?: boolean;
}

const colorPresets = [
  { name: 'Ocean', primary: '201 96% 32%', secondary: '199 89% 48%', accent: '43 74% 66%' },
  { name: 'Forest', primary: '142 76% 36%', secondary: '142 69% 58%', accent: '48 96% 53%' },
  { name: 'Sunset', primary: '22 93% 53%', secondary: '14 100% 57%', accent: '45 93% 47%' },
  { name: 'Royal', primary: '262 83% 58%', secondary: '280 87% 65%', accent: '199 89% 48%' },
  { name: 'Midnight', primary: '224 71% 4%', secondary: '215 28% 17%', accent: '199 89% 48%' },
  { name: 'Rose', primary: '350 89% 60%', secondary: '330 81% 60%', accent: '280 87% 65%' },
];

const fontPresets = [
  { heading: 'Playfair Display', body: 'Inter' },
  { heading: 'Montserrat', body: 'Open Sans' },
  { heading: 'Poppins', body: 'Roboto' },
  { heading: 'Raleway', body: 'Lato' },
  { heading: 'Merriweather', body: 'Source Sans Pro' },
];

const cornerOptions = [
  { value: 'sharp' as const, label: 'Sharp', icon: '◻' },
  { value: 'rounded' as const, label: 'Rounded', icon: '▢' },
  { value: 'pill' as const, label: 'Pill', icon: '◯' },
];

export function CustomizeSidebar({
  isOpen,
  onClose,
  siteSettings,
  onSettingsChange,
  onRegenerateText,
  onRegenerateWebsite,
  isRegenerating = false,
}: CustomizeSidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>(['colors']);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleColorPreset = (preset: typeof colorPresets[0]) => {
    onSettingsChange({
      ...siteSettings,
      colors: {
        primary: preset.primary,
        secondary: preset.secondary,
        accent: preset.accent,
      },
    });
  };

  const handleFontPreset = (preset: typeof fontPresets[0]) => {
    onSettingsChange({
      ...siteSettings,
      fonts: {
        heading: preset.heading,
        body: preset.body,
      },
    });
  };

  const handleCornersChange = (corners: 'rounded' | 'sharp' | 'pill') => {
    onSettingsChange({
      ...siteSettings,
      corners,
    });
  };

  const handleAnimationsChange = (enabled: boolean) => {
    onSettingsChange({
      ...siteSettings,
      animations: enabled,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[320px] sm:w-[320px] p-0 overflow-y-auto">
        <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Customize</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="divide-y">
          {/* Colors Section */}
          <Collapsible open={openSections.includes('colors')} onOpenChange={() => toggleSection('colors')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">Colors</div>
                  <div className="text-xs text-muted-foreground">Primary, secondary, accent</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${openSections.includes('colors') ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="grid grid-cols-3 gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleColorPreset(preset)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg border hover:border-primary transition-colors"
                  >
                    <div className="flex gap-0.5">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: `hsl(${preset.primary})` }} 
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: `hsl(${preset.secondary})` }} 
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: `hsl(${preset.accent})` }} 
                      />
                    </div>
                    <span className="text-xs">{preset.name}</span>
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Fonts Section */}
          <Collapsible open={openSections.includes('fonts')} onOpenChange={() => toggleSection('fonts')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">Fonts</div>
                  <div className="text-xs text-muted-foreground">
                    {siteSettings?.fonts?.heading || 'Playfair Display'} / {siteSettings?.fonts?.body || 'Inter'}
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${openSections.includes('fonts') ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="space-y-2">
                {fontPresets.map((preset) => (
                  <button
                    key={preset.heading}
                    onClick={() => handleFontPreset(preset)}
                    className={`w-full text-left p-3 rounded-lg border hover:border-primary transition-colors ${
                      siteSettings?.fonts?.heading === preset.heading ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="font-medium" style={{ fontFamily: preset.heading }}>{preset.heading}</div>
                    <div className="text-sm text-muted-foreground" style={{ fontFamily: preset.body }}>{preset.body}</div>
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Buttons/Corners Section */}
          <Collapsible open={openSections.includes('corners')} onOpenChange={() => toggleSection('corners')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Square className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">Corners</div>
                  <div className="text-xs text-muted-foreground">Button and card styles</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${openSections.includes('corners') ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="flex gap-2">
                {cornerOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleCornersChange(option.value)}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                      siteSettings?.corners === option.value ? 'border-primary bg-primary/5' : 'hover:border-primary'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-xs">{option.label}</span>
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Animations Section */}
          <Collapsible open={openSections.includes('animations')} onOpenChange={() => toggleSection('animations')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">Animations</div>
                  <div className="text-xs text-muted-foreground">Page transitions & effects</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${openSections.includes('animations') ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="animations-toggle">Enable animations</Label>
                <Switch
                  id="animations-toggle"
                  checked={siteSettings?.animations ?? true}
                  onCheckedChange={handleAnimationsChange}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Browser Icon Section */}
          <Collapsible open={openSections.includes('favicon')} onOpenChange={() => toggleSection('favicon')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">Browser icon</div>
                  <div className="text-xs text-muted-foreground">Favicon for tabs</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${openSections.includes('favicon') ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                  {siteSettings?.favicon ? (
                    <img src={siteSettings.favicon} alt="Favicon" className="w-8 h-8" />
                  ) : (
                    <Image className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <Button variant="outline" size="sm">Upload</Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Regenerate Actions */}
        <div className="p-4 space-y-2 border-t mt-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={onRegenerateText}
            disabled={isRegenerating}
          >
            <Sparkles className="w-4 h-4" />
            Regenerate all text
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={onRegenerateWebsite}
            disabled={isRegenerating}
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate website
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
