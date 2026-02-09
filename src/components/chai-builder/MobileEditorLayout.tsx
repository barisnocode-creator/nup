import { useState, useCallback } from 'react';
import {
  ChaiBuilderCanvas,
  ChaiBlockPropsEditor,
  ChaiBlockStyleEditor,
  ChaiOutline,
  ChaiAddBlocksPanel,
  ChaiScreenSizes,
  ChaiUndoRedo,
} from '@chaibuilder/sdk';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Layers,
  Plus,
  Settings2,
  Paintbrush,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PanelType = 'outline' | 'add' | 'props' | 'styles' | null;

type PanelConfig = {
  key: Exclude<PanelType, null>;
  icon: React.ElementType;
  label: string;
  side: 'left' | 'right';
};

const panels: PanelConfig[] = [
  { key: 'outline', icon: Layers, label: 'Katmanlar', side: 'left' },
  { key: 'add', icon: Plus, label: 'Ekle', side: 'left' },
  { key: 'props', icon: Settings2, label: 'Özellikler', side: 'right' },
  { key: 'styles', icon: Paintbrush, label: 'Stiller', side: 'right' },
];

/**
 * Mobile-optimized layout for ChaiBuilder editor.
 * Uses Sheet (slide-in sidebar) pattern — left panels slide from left, right panels from right.
 */
export function MobileEditorLayout() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const handlePanelToggle = (panel: PanelType) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  // Auto-open properties panel when a block is clicked on the canvas
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const blockEl = target.closest('[data-block-id]');
    if (blockEl) {
      // Small delay to let SDK handle block selection first
      setTimeout(() => setActivePanel('props'), 150);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-border bg-background/95 backdrop-blur-sm z-10 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-accent transition-colors text-sm text-foreground"
            title="Dashboard'a dön"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-5 w-px bg-border" />
          <ChaiUndoRedo />
        </div>

        <div className="flex items-center gap-1">
          <ChaiScreenSizes
            openDelay={0}
            canvas={false}
            tooltip={true}
            buttonClass="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground"
            activeButtonClass="p-1.5 rounded-md bg-accent text-foreground"
          />
        </div>
      </div>

      {/* Canvas area - full screen */}
      <div className="flex-1 overflow-hidden relative" onClick={handleCanvasClick}>
        <ChaiBuilderCanvas />
      </div>

      {/* Side panels via Sheet */}
      {panels.map(({ key, label, side }) => (
        <Sheet
          key={key}
          open={activePanel === key}
          onOpenChange={(open) => {
            if (!open) setActivePanel(null);
          }}
        >
          <SheetContent
            side={side}
            className="w-[85vw] max-w-sm p-0 flex flex-col"
          >
            <div className="px-4 py-3 border-b border-border shrink-0">
              <SheetTitle className="text-sm font-medium">
                {label}
              </SheetTitle>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {key === 'outline' && <ChaiOutline />}
              {key === 'add' && (
                <ChaiAddBlocksPanel showHeading={false} fromSidebar={true} />
              )}
              {key === 'props' && <ChaiBlockPropsEditor />}
              {key === 'styles' && <ChaiBlockStyleEditor />}
            </div>
          </SheetContent>
        </Sheet>
      ))}

      {/* Bottom navigation bar */}
      <div className="flex items-center justify-around px-2 py-2 border-t border-border bg-background/95 backdrop-blur-sm shrink-0 safe-area-bottom">
        {panels.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => handlePanelToggle(key)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-[56px] ${
              activePanel === key
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
