import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  Loader2,
  Hash } from
'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditorContext } from './EditorContext';

type SubPanel = 'colors' | 'fonts' | 'buttons' | 'corners' | 'animations' | 'browser-icon' | 'widgets' | 'keywords' | 'background' | null;

const colorPresets = [
{ id: 'ocean', name: 'Ocean', primary: '#0ea5e9', secondary: '#06b6d4', accent: '#14b8a6' },
{ id: 'forest', name: 'Forest', primary: '#22c55e', secondary: '#10b981', accent: '#059669' },
{ id: 'sunset', name: 'Sunset', primary: '#f97316', secondary: '#fb923c', accent: '#fbbf24' },
{ id: 'royal', name: 'Royal', primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd' },
{ id: 'midnight', name: 'Midnight', primary: '#3b82f6', secondary: '#6366f1', accent: '#8b5cf6' }];


const fontOptions = [
{ value: 'Inter', label: 'Inter' },
{ value: 'Poppins', label: 'Poppins' },
{ value: 'Playfair Display', label: 'Playfair Display' },
{ value: 'Roboto', label: 'Roboto' },
{ value: 'Open Sans', label: 'Open Sans' },
{ value: 'Merriweather', label: 'Merriweather' },
{ value: 'Lato', label: 'Lato' },
{ value: 'Montserrat', label: 'Montserrat' },
{ value: 'Space Grotesk', label: 'Space Grotesk' },
{ value: 'Sora', label: 'Sora' },
{ value: 'Lora', label: 'Lora' }];


interface MenuItemDef {
  id: SubPanel | 'template' | 'regenerate-text' | 'regenerate-website';
  icon: React.ElementType;
  label: string;
  isAction?: boolean;
  separator?: boolean;
}

const menuItems: MenuItemDef[] = [
{ id: 'template', icon: LayoutGrid, label: 'Template Değiştir', isAction: true },
{ id: 'colors', icon: Palette, label: 'Renkler', separator: true },
{ id: 'fonts', icon: Type, label: 'Yazı Tipleri' },
{ id: 'background', icon: Image, label: 'Arka Plan Görseli', isAction: true },
{ id: 'buttons', icon: ToggleLeft, label: 'Butonlar', separator: true },
{ id: 'corners', icon: Square, label: 'Köşeler' },
{ id: 'animations', icon: Zap, label: 'Animasyonlar' },
{ id: 'browser-icon', icon: Image, label: 'Tarayıcı İkonu', separator: true },
{ id: 'widgets', icon: Sparkles, label: 'Widget Yönetimi' },
{ id: 'regenerate-text', icon: FileText, label: 'Metni Yeniden Oluştur', isAction: true, separator: true },
{ id: 'regenerate-website', icon: RefreshCw, label: 'Siteyi Yeniden Oluştur', isAction: true },
{ id: 'keywords', icon: Hash, label: 'Anahtar Kelimeler' }];


interface CustomizePanelProps {
  onClose: () => void;
}

export function CustomizePanel({ onClose }: CustomizePanelProps) {
  const { onChangeTemplate, onRegenerateText, onRegenerateWebsite } = useEditorContext();
  const [subPanel, setSubPanel] = useState<SubPanel>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Local state for customization values
  const [colors, setColors] = useState({ primary: '#3b82f6', secondary: '#6366f1', accent: '#f59e0b' });
  const [fonts, setFonts] = useState({ heading: 'Inter', body: 'Inter' });
  const [corners, setCorners] = useState<'sharp' | 'rounded' | 'pill'>('rounded');
  const [animations, setAnimations] = useState(true);

  const handleMenuClick = useCallback((item: MenuItemDef) => {
    if (item.id === 'template') {
      onChangeTemplate?.();
      return;
    }
    if (item.id === 'regenerate-text') {
      setIsRegenerating(true);
      onRegenerateText?.();
      setTimeout(() => setIsRegenerating(false), 2000);
      return;
    }
    if (item.id === 'regenerate-website') {
      setIsRegenerating(true);
      onRegenerateWebsite?.();
      setTimeout(() => setIsRegenerating(false), 2000);
      return;
    }
    if (item.id === 'background') {
      // Will be handled in Part 2
      return;
    }
    setSubPanel(item.id as SubPanel);
  }, [onChangeTemplate, onRegenerateText, onRegenerateWebsite]);

  const handlePresetSelect = (preset: typeof colorPresets[0]) => {
    setColors({ primary: preset.primary, secondary: preset.secondary, accent: preset.accent });
  };

  // Sub-panel header
  const SubPanelHeader = ({ title }: {title: string;}) =>
  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 shrink-0">
      <button
      onClick={() => setSubPanel(null)}
      className="p-1 hover:bg-accent/50 rounded-lg transition-colors"
      aria-label="Geri">

        <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
      <span className="text-xs font-medium flex-1">{title}</span>
      <button
      onClick={onClose}
      className="p-1 hover:bg-accent/50 rounded-lg transition-colors"
      aria-label="Kapat">

        <X className="w-3 h-3 text-muted-foreground" />
      </button>
    </div>;


  const renderSubPanel = () => {
    switch (subPanel) {
      case 'colors':
        return (
          <div className="flex flex-col h-full">
            <SubPanelHeader title="Renkler" />
            <ScrollArea className="flex-1">
              <div className="p-5 space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Hazır Paletler</Label>
                  <div className="grid grid-cols-5 gap-3">
                    {colorPresets.map((preset) =>
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className="group flex flex-col items-center gap-1.5"
                      title={preset.name}>

                        <div
                        className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-foreground/20 transition-all shadow-sm group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)` }} />

                        <span className="text-[10px] text-muted-foreground">{preset.name}</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Özel Renkler</Label>
                  {(['primary', 'secondary', 'accent'] as const).map((key) =>
                  <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key === 'primary' ? 'Ana Renk' : key === 'secondary' ? 'İkincil' : 'Vurgu'}</span>
                      <div className="flex items-center gap-2">
                        <Input
                        type="text"
                        value={colors[key]}
                        onChange={(e) => setColors((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="w-24 h-8 text-xs font-mono" />

                        <input
                        type="color"
                        value={colors[key]}
                        onChange={(e) => setColors((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="w-8 h-8 rounded border cursor-pointer" />

                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>);


      case 'fonts':
        return (
          <div className="flex flex-col h-full">
            <SubPanelHeader title="Yazı Tipleri" />
            <ScrollArea className="flex-1">
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Başlık Fontu</Label>
                  <Select value={fonts.heading} onValueChange={(v) => setFonts((prev) => ({ ...prev, heading: v }))}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((f) =>
                      <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                          {f.label}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Gövde Fontu</Label>
                  <Select value={fonts.body} onValueChange={(v) => setFonts((prev) => ({ ...prev, body: v }))}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((f) =>
                      <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                          {f.label}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-6 p-4 border border-border/30 rounded-lg bg-muted/30">
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: fonts.heading }}>
                    Başlık Önizleme
                  </h3>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: fonts.body }}>
                    Gövde metniniz bu şekilde görünecek. Hızlı kahverengi tilki tembel köpeğin üstünden atlar.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>);


      case 'corners':
        return (
          <div className="flex flex-col h-full">
            <SubPanelHeader title="Köşeler" />
            <ScrollArea className="flex-1">
              <div className="p-5 space-y-4">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Köşe Yuvarlaklığı</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                  { id: 'sharp' as const, label: 'Keskin', cls: 'rounded-none' },
                  { id: 'rounded' as const, label: 'Yumuşak', cls: 'rounded-lg' },
                  { id: 'pill' as const, label: 'Hap', cls: 'rounded-full' }].
                  map((c) =>
                  <button
                    key={c.id}
                    onClick={() => setCorners(c.id)}
                    className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-all ${
                    corners === c.id ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/40'}`
                    }>

                      <div className={`w-12 h-8 bg-primary ${c.cls}`} />
                      <span className="text-xs">{c.label}</span>
                    </button>
                  )}
                </div>
                <div className="mt-6 space-y-3">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Önizleme</Label>
                  <div className="flex gap-3">
                    <button className={`px-4 py-2 bg-primary text-primary-foreground text-sm ${
                    corners === 'sharp' ? 'rounded-none' : corners === 'pill' ? 'rounded-full' : 'rounded-lg'}`
                    }>
                      Buton
                    </button>
                    <div className={`w-16 h-10 border bg-muted ${
                    corners === 'sharp' ? 'rounded-none' : corners === 'pill' ? 'rounded-full' : 'rounded-lg'}`
                    } />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>);


      case 'animations':
        return (
          <div className="flex flex-col h-full">
            <SubPanelHeader title="Animasyonlar" />
            <ScrollArea className="flex-1">
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between p-4 border border-border/30 rounded-lg">
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Animasyonları Etkinleştir</span>
                    <p className="text-xs text-muted-foreground">Sayfa geçişleri ve hover efektleri</p>
                  </div>
                  <Switch checked={animations} onCheckedChange={setAnimations} />
                </div>
                <div className="mt-4 p-4 border border-border/30 rounded-lg bg-muted/30">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">Önizleme</Label>
                  <div className={`w-12 h-12 bg-primary rounded-lg ${animations ? 'animate-bounce' : ''}`} />
                  <p className="text-xs text-muted-foreground mt-3">
                    {animations ? 'Animasyonlar aktif' : 'Animasyonlar devre dışı'}
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>);


      default:
        return (
          <div className="flex flex-col h-full">
            <SubPanelHeader title={subPanel?.replace('-', ' ') || ''} />
            <div className="flex-1 flex items-center justify-center p-5">
              <p className="text-sm text-muted-foreground">Yakında gelecek</p>
            </div>
          </div>);

    }
  };

  // Main menu
  const renderMainMenu = () =>
  <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 shrink-0 bg-primary-foreground">
        <span className="text-xs font-semibold">Özelleştir</span>
        <button
        onClick={onClose}
        className="p-1 hover:bg-accent/50 rounded-lg transition-colors"
        aria-label="Kapat">

          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      {/* Items */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isRegen = item.id === 'regenerate-text' || item.id === 'regenerate-website';
          return (
            <div key={item.id}>
                {item.separator && idx > 0 &&
              <div className="mx-4 my-0.5 border-t border-border/20" />
              }
                <button
                onClick={() => handleMenuClick(item)}
                className="w-full flex items-center gap-2.5 px-4 h-9 text-left transition-colors group hover:bg-accent/50"
                disabled={isRegen && isRegenerating}>

                  {isRegen && isRegenerating ?
                <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" /> :

                <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                }
                  <span className="text-xs font-medium flex-1">{item.label}</span>
                  {!item.isAction &&
                <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                }
                </button>
              </div>);

        })}
        </div>
      </ScrollArea>
    </div>;


  return (
    <div className="w-full h-full flex flex-col bg-background">
      <AnimatePresence mode="wait">
        {subPanel ?
        <motion.div
          key={subPanel}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex-1 flex flex-col min-h-0">

            {renderSubPanel()}
          </motion.div> :

        <motion.div
          key="main"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex-1 flex flex-col min-h-0">

            {renderMainMenu()}
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}