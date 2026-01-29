import { useState } from 'react';
import { 
  ArrowLeft, 
  X, 
  Palette, 
  Type, 
  ToggleLeft, 
  Square, 
  Zap, 
  Image, 
  LayoutGrid, 
  Sparkles, 
  RefreshCw, 
  FileText,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface CustomizeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  currentFonts?: {
    heading: string;
    body: string;
  };
  currentCorners?: 'rounded' | 'sharp' | 'pill';
  currentAnimations?: boolean;
  onColorChange?: (colorType: string, value: string) => void;
  onFontChange?: (fontType: string, value: string) => void;
  onCornersChange?: (corners: 'rounded' | 'sharp' | 'pill') => void;
  onAnimationsChange?: (enabled: boolean) => void;
  onRegenerateText?: () => void;
  onRegenerateWebsite?: () => void;
  isRegenerating?: boolean;
}

type SubPanel = 'colors' | 'fonts' | 'buttons' | 'corners' | 'animations' | 'browser-icon' | 'widgets' | 'keywords' | null;

const colorPresets = [
  { id: 'ocean', name: 'Ocean', primary: '#0ea5e9', secondary: '#06b6d4', accent: '#14b8a6' },
  { id: 'forest', name: 'Forest', primary: '#22c55e', secondary: '#10b981', accent: '#059669' },
  { id: 'sunset', name: 'Sunset', primary: '#f97316', secondary: '#fb923c', accent: '#fbbf24' },
  { id: 'royal', name: 'Royal', primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd' },
  { id: 'midnight', name: 'Midnight', primary: '#3b82f6', secondary: '#6366f1', accent: '#8b5cf6' },
];

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
];

export function CustomizeSidebar({
  isOpen,
  onClose,
  currentColors = { primary: '#3b82f6', secondary: '#6366f1', accent: '#f59e0b' },
  currentFonts = { heading: 'Inter', body: 'Inter' },
  currentCorners = 'rounded',
  currentAnimations = true,
  onColorChange,
  onFontChange,
  onCornersChange,
  onAnimationsChange,
  onRegenerateText,
  onRegenerateWebsite,
  isRegenerating = false,
}: CustomizeSidebarProps) {
  const [activePanel, setActivePanel] = useState<SubPanel>(null);

  const menuItems = [
    { id: 'colors' as const, icon: Palette, label: 'Colors' },
    { id: 'fonts' as const, icon: Type, label: 'Fonts' },
    { id: 'buttons' as const, icon: ToggleLeft, label: 'Buttons' },
    { id: 'corners' as const, icon: Square, label: 'Corners' },
    { id: 'animations' as const, icon: Zap, label: 'Animations' },
    { id: 'browser-icon' as const, icon: Image, label: 'Browser icon' },
    { id: 'widgets' as const, icon: LayoutGrid, label: 'Manage widgets' },
  ];

  const handleClose = () => {
    setActivePanel(null);
    onClose();
  };

  const handleBack = () => {
    setActivePanel(null);
  };

  const handlePresetSelect = (preset: typeof colorPresets[0]) => {
    onColorChange?.('primary', preset.primary);
    onColorChange?.('secondary', preset.secondary);
    onColorChange?.('accent', preset.accent);
  };

  // Render sub-panel content
  const renderSubPanel = () => {
    switch (activePanel) {
      case 'colors':
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-background">
              <button onClick={handleBack} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-sm font-medium flex-1">Colors</span>
              <button onClick={handleClose} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Presets */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Presets</Label>
                <div className="grid grid-cols-5 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className="group flex flex-col items-center gap-1.5"
                      title={preset.name}
                    >
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-foreground/20 transition-colors shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)` }}
                      />
                      <span className="text-[10px] text-muted-foreground">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Custom</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Primary</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={currentColors.primary}
                        onChange={(e) => onColorChange?.('primary', e.target.value)}
                        className="w-24 h-8 text-xs font-mono"
                      />
                      <input
                        type="color"
                        value={currentColors.primary}
                        onChange={(e) => onColorChange?.('primary', e.target.value)}
                        className="w-8 h-8 rounded border cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Secondary</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={currentColors.secondary}
                        onChange={(e) => onColorChange?.('secondary', e.target.value)}
                        className="w-24 h-8 text-xs font-mono"
                      />
                      <input
                        type="color"
                        value={currentColors.secondary}
                        onChange={(e) => onColorChange?.('secondary', e.target.value)}
                        className="w-8 h-8 rounded border cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Accent</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={currentColors.accent}
                        onChange={(e) => onColorChange?.('accent', e.target.value)}
                        className="w-24 h-8 text-xs font-mono"
                      />
                      <input
                        type="color"
                        value={currentColors.accent}
                        onChange={(e) => onColorChange?.('accent', e.target.value)}
                        className="w-8 h-8 rounded border cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'fonts':
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-background">
              <button onClick={handleBack} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-sm font-medium flex-1">Fonts</span>
              <button onClick={handleClose} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Heading</Label>
                <Select value={currentFonts.heading} onValueChange={(value) => onFontChange?.('heading', value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Body</Label>
                <Select value={currentFonts.body} onValueChange={(value) => onFontChange?.('body', value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: currentFonts.heading }}>
                  Heading Preview
                </h3>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: currentFonts.body }}>
                  This is how your body text will look. The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          </div>
        );

      case 'corners':
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-background">
              <button onClick={handleBack} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-sm font-medium flex-1">Corners</span>
              <button onClick={handleClose} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Border Radius</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'sharp' as const, label: 'Sharp', preview: 'rounded-none' },
                  { id: 'rounded' as const, label: 'Rounded', preview: 'rounded-lg' },
                  { id: 'pill' as const, label: 'Pill', preview: 'rounded-full' },
                ].map((corner) => (
                  <button
                    key={corner.id}
                    onClick={() => onCornersChange?.(corner.id)}
                    className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-colors ${
                      currentCorners === corner.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-12 h-8 bg-primary ${corner.preview}`} />
                    <span className="text-xs">{corner.label}</span>
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div className="mt-6 space-y-3">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Preview</Label>
                <div className="flex gap-3">
                  <button className={`px-4 py-2 bg-primary text-primary-foreground text-sm ${
                    currentCorners === 'sharp' ? 'rounded-none' : currentCorners === 'pill' ? 'rounded-full' : 'rounded-lg'
                  }`}>
                    Button
                  </button>
                  <div className={`w-16 h-10 border bg-muted ${
                    currentCorners === 'sharp' ? 'rounded-none' : currentCorners === 'pill' ? 'rounded-full' : 'rounded-lg'
                  }`} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'animations':
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-background">
              <button onClick={handleBack} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-sm font-medium flex-1">Animations</span>
              <button onClick={handleClose} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <span className="text-sm font-medium">Enable Animations</span>
                  <p className="text-xs text-muted-foreground">Toggle page transitions and hover effects</p>
                </div>
                <button
                  onClick={() => onAnimationsChange?.(!currentAnimations)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    currentAnimations ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    currentAnimations ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Animation Preview */}
              <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-3 block">Preview</Label>
                <div className={`w-12 h-12 bg-primary rounded-lg ${currentAnimations ? 'animate-float' : ''}`} />
                <p className="text-xs text-muted-foreground mt-3">
                  {currentAnimations ? 'Animations are enabled' : 'Animations are disabled'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'buttons':
      case 'browser-icon':
      case 'widgets':
      case 'keywords':
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-background">
              <button onClick={handleBack} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-sm font-medium flex-1 capitalize">{activePanel?.replace('-', ' ')}</span>
              <button onClick={handleClose} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Coming soon</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Main menu
  const renderMainMenu = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
        <span className="text-sm font-medium">Customize</span>
        <button onClick={handleClose} className="p-1.5 hover:bg-muted rounded-md transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </button>
          );
        })}

        {/* Divider */}
        <div className="my-2 mx-4 border-t" />

        {/* Action Items */}
        <button
          onClick={onRegenerateText}
          disabled={isRegenerating}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left disabled:opacity-50"
        >
          {isRegenerating ? (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="flex-1 text-sm">Regenerate text</span>
        </button>

        <button
          onClick={onRegenerateWebsite}
          disabled={isRegenerating}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left disabled:opacity-50"
        >
          {isRegenerating ? (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="flex-1 text-sm">Regenerate entire website</span>
        </button>

        {/* Divider */}
        <div className="my-2 mx-4 border-t" />

        {/* Keywords */}
        <button
          onClick={() => setActivePanel('keywords')}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
        >
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-sm">Keywords</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </button>
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent 
        side="left" 
        noOverlay 
        hideCloseButton
        className="w-[280px] p-0 shadow-xl border-r"
      >
        {activePanel ? renderSubPanel() : renderMainMenu()}
      </SheetContent>
    </Sheet>
  );
}
