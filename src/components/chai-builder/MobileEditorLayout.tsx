import { useState } from 'react';
import {
  ChaiBuilderCanvas,
  ChaiBlockPropsEditor,
  ChaiBlockStyleEditor,
  ChaiOutline,
  ChaiAddBlocksPanel,
  ChaiScreenSizes,
  ChaiUndoRedo,
} from '@chaibuilder/sdk';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Layers,
  Plus,
  Settings2,
  Paintbrush,
  Save,
  ArrowLeft,
  Undo2,
  Redo2,
  Monitor,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PanelType = 'outline' | 'add' | 'props' | 'styles' | null;

/**
 * Mobile-optimized layout for ChaiBuilder editor.
 * Uses Drawer (bottom sheet) pattern to show panels on mobile devices.
 */
export function MobileEditorLayout() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const handlePanelToggle = (panel: PanelType) => {
    setActivePanel(prev => (prev === panel ? null : panel));
  };

  const panels: { key: PanelType; icon: React.ElementType; label: string }[] = [
    { key: 'outline', icon: Layers, label: 'Katmanlar' },
    { key: 'add', icon: Plus, label: 'Ekle' },
    { key: 'props', icon: Settings2, label: 'Özellikler' },
    { key: 'styles', icon: Paintbrush, label: 'Stiller' },
  ];

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
      <div className="flex-1 overflow-hidden relative">
        <ChaiBuilderCanvas />
      </div>

      {/* Bottom panel drawer */}
      <Drawer
        open={activePanel !== null}
        onOpenChange={(open) => {
          if (!open) setActivePanel(null);
        }}
        modal={false}
      >
        <DrawerContent className="max-h-[60vh] rounded-t-xl">
          <div className="p-3 overflow-auto max-h-[55vh]">
            {/* Panel header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">
                {activePanel === 'outline' && 'Katmanlar'}
                {activePanel === 'add' && 'Blok Ekle'}
                {activePanel === 'props' && 'Blok Özellikleri'}
                {activePanel === 'styles' && 'Stil Düzenleme'}
              </h3>
            </div>

            {/* Panel content */}
            <div className="min-h-[200px]">
              {activePanel === 'outline' && <ChaiOutline />}
              {activePanel === 'add' && (
                <ChaiAddBlocksPanel
                  showHeading={false}
                  fromSidebar={true}
                />
              )}
              {activePanel === 'props' && <ChaiBlockPropsEditor />}
              {activePanel === 'styles' && <ChaiBlockStyleEditor />}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

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
