import { useState, useCallback, useRef } from 'react';
import {
  ChaiBuilderCanvas,
  ChaiBlockPropsEditor,
  ChaiBlockStyleEditor,
  ChaiAddBlocksPanel,
  ChaiScreenSizes,
} from '@chaibuilder/sdk';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Layers, Plus, Settings2, Paintbrush,
  ArrowLeft, ImageIcon, Globe,
  Monitor, Tablet, Smartphone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PixabayImagePicker } from './PixabayImagePicker';
import { CustomizePanel } from './CustomizePanel';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useEditorContext } from './EditorContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type PanelType = 'add' | 'props' | 'styles' | 'customize' | null;

type PanelConfig = {
  key: Exclude<PanelType, null>;
  icon: React.ElementType;
  label: string;
  description: string;
  side: 'left' | 'right';
};

const panels: PanelConfig[] = [
  { key: 'add', icon: Plus, label: 'Ekle', description: 'Yeni blok ekleyin', side: 'left' },
  { key: 'customize', icon: Paintbrush, label: 'Özelleştir', description: 'Siteyi özelleştirin', side: 'left' },
  { key: 'props', icon: Settings2, label: 'Özellikler', description: 'Blok içeriğini düzenleyin', side: 'right' },
  { key: 'styles', icon: Paintbrush, label: 'Stiller', description: 'Görünümü özelleştirin', side: 'right' },
];

function injectImageUrlToPropsPanel(url: string): boolean {
  const propsPanel = document.querySelector('[data-panel="props"]') || document;
  const allInputs = propsPanel.querySelectorAll('input[type="text"]');
  let targetInput: HTMLInputElement | null = null;

  for (const input of allInputs) {
    const inputEl = input as HTMLInputElement;
    const parent = inputEl.closest('.form-group, .field, [class*="field"]');
    if (parent) {
      const label = parent.querySelector('label');
      if (label) {
        const labelText = label.textContent?.toLowerCase() || '';
        if (labelText.includes('görsel') || labelText.includes('image') || labelText.includes('arka plan') || labelText.includes('background')) {
          targetInput = inputEl;
          break;
        }
      }
    }
  }

  if (targetInput) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(targetInput, url);
      targetInput.dispatchEvent(new Event('input', { bubbles: true }));
      targetInput.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
  }
  return false;
}

export function MobileEditorLayout() {
  const navigate = useNavigate();
  const { onPublish } = useEditorContext();
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [screenMode, setScreenMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const hiddenScreenRef = useRef<HTMLDivElement>(null);

  const handlePanelToggle = (panel: PanelType) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const blockEl = target.closest('[data-block-id]');
    if (blockEl) {
      setTimeout(() => setActivePanel('props'), 150);
    }
  }, []);

  const handleImageSelect = useCallback((url: string) => {
    setTimeout(() => {
      const injected = injectImageUrlToPropsPanel(url);
      if (!injected) {
        navigator.clipboard.writeText(url).then(() => {
          toast.success('Görsel URL\'si kopyalandı! Görsel alanına yapıştırın.', { duration: 4000 });
        }).catch(() => {
          toast.info('Görsel seçildi. Özellikler panelinden görsel alanını güncelleyin.', { duration: 4000 });
        });
      } else {
        toast.success('Görsel uygulandı!');
      }
    }, 100);
  }, []);

  const cycleScreen = useCallback(() => {
    const order: Array<'desktop' | 'tablet' | 'mobile'> = ['desktop', 'tablet', 'mobile'];
    const btnIndex = { desktop: 4, tablet: 2, mobile: 0 };
    setScreenMode((prev) => {
      const next = order[(order.indexOf(prev) + 1) % 3];
      setTimeout(() => {
        const btns = hiddenScreenRef.current?.querySelectorAll('button');
        if (btns && btns[btnIndex[next]]) btns[btnIndex[next]].click();
      }, 0);
      return next;
    });
  }, []);

  return (
    <TooltipProvider>
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Top toolbar - clean & minimal */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-border/30 bg-background/95 backdrop-blur-xl z-10 shrink-0 shadow-sm">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl hover:bg-accent/80 transition-all duration-200 text-foreground active:scale-95"
          title="Dashboard'a dön"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {/* Hidden SDK screen sizes */}
          <div ref={hiddenScreenRef} className="chai-screen-hidden">
            <ChaiScreenSizes openDelay={0} canvas={false} tooltip={false} />
          </div>

          <button
            onClick={cycleScreen}
            className="p-2 rounded-xl text-muted-foreground hover:bg-accent/80 transition-all duration-200 active:scale-95"
            title="Ekran boyutu"
          >
            {screenMode === 'desktop' && <Monitor className="w-4 h-4" />}
            {screenMode === 'tablet' && <Tablet className="w-4 h-4" />}
            {screenMode === 'mobile' && <Smartphone className="w-4 h-4" />}
          </button>

          <button
            onClick={onPublish}
            className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-md shadow-primary/20"
            title="Yayınla"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-hidden relative" style={{ touchAction: 'manipulation' }} onClick={handleCanvasClick}>
        <ChaiBuilderCanvas />
      </div>

      {/* Side panels via Sheet */}
      {panels.map(({ key, label, description, side }) => (
        <Sheet
          key={key}
          open={activePanel === key}
          onOpenChange={(open) => { if (!open) setActivePanel(null); }}
        >
          <SheetContent
            side={side}
            className="w-[80vw] max-w-sm p-0 flex flex-col border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="relative px-5 py-4 border-b border-border/30 shrink-0">
              <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-primary" />
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="text-base font-semibold tracking-tight">{label}</SheetTitle>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
                </div>
                {key === 'props' && (
                  <button
                    onClick={() => setImagePickerOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all active:scale-95"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Görsel Ara
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 chai-panel-scroll" data-panel={key}>
              {key === 'add' && <ChaiAddBlocksPanel showHeading={false} fromSidebar={true} />}
              {key === 'customize' && <CustomizePanel onClose={() => setActivePanel(null)} />}
              {key === 'props' && <ChaiBlockPropsEditor />}
              {key === 'styles' && <ChaiBlockStyleEditor />}
            </div>
          </SheetContent>
        </Sheet>
      ))}

      {/* Pixabay Image Picker */}
      <PixabayImagePicker
        open={imagePickerOpen}
        onOpenChange={setImagePickerOpen}
        onSelect={handleImageSelect}
      />

      {/* Floating bottom navigation bar */}
      <div className="px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 shrink-0">
        <div className="flex items-center justify-around px-1 py-1 rounded-2xl bg-background/80 backdrop-blur-xl border border-border/40 shadow-lg shadow-black/5">
          {panels.map(({ key, icon: Icon, label }) => {
            const isActive = activePanel === key;
            return (
              <button
                key={key}
                onClick={() => handlePanelToggle(key)}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[52px] min-h-[44px] active:scale-95"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-[10px] font-medium leading-tight relative z-10 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-0.5 w-5 h-[2px] rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
