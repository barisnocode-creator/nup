import { useState, useEffect, useCallback } from 'react';
import {
  ChaiBuilderCanvas,
  ChaiBlockPropsEditor,
  ChaiBlockStyleEditor,
  ChaiOutline,
  ChaiAddBlocksPanel,
  ChaiScreenSizes,
  ChaiUndoRedo,
} from '@chaibuilder/sdk';
import { Layers, Plus, Settings2, Paintbrush, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

type LeftPanel = 'outline' | 'add' | null;
type RightTab = 'props' | 'styles';

export function DesktopEditorLayout() {
  const [leftPanel, setLeftPanel] = useState<LeftPanel>(null);
  const [rightTab, setRightTab] = useState<RightTab>('props');
  const [showRight, setShowRight] = useState(false);

  // Auto-open floating card on block selection, close on empty click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Ignore clicks on left sidebar buttons or floating card itself
      if (target.closest('.editor-left-sidebar') || target.closest('.floating-edit-card')) return;

      const isCanvasArea = target.closest('.chai-canvas-area');
      if (!isCanvasArea) return;

      const blockEl = target.closest('[data-block-id]');
      if (blockEl) {
        setShowRight(true);
      } else {
        setShowRight(false);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background relative">
      {/* Left sidebar buttons */}
      <div className="editor-left-sidebar w-12 shrink-0 flex flex-col items-center gap-1 py-3 border-r border-border/30 bg-background/80 backdrop-blur-xl z-20">
        <button
          onClick={() => setLeftPanel(leftPanel === 'outline' ? null : 'outline')}
          className={`p-2.5 rounded-xl transition-all active:scale-95 ${
            leftPanel === 'outline' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/80'
          }`}
          title="Katmanlar"
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          onClick={() => setLeftPanel(leftPanel === 'add' ? null : 'add')}
          className={`p-2.5 rounded-xl transition-all active:scale-95 ${
            leftPanel === 'add' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/80'
          }`}
          title="Blok Ekle"
        >
          <Plus className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        <div className="flex flex-col gap-1">
          <ChaiUndoRedo />
        </div>
      </div>

      {/* Left panel content */}
      <AnimatePresence>
        {leftPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="shrink-0 border-r border-border/30 bg-background/95 backdrop-blur-xl overflow-hidden z-10"
          >
            <div className="w-[260px] h-full flex flex-col">
              <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {leftPanel === 'outline' ? 'Katmanlar' : 'Blok Ekle'}
                </span>
                <button
                  onClick={() => setLeftPanel(null)}
                  className="p-1 rounded-lg hover:bg-accent/80 text-muted-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 chai-panel-scroll" data-panel={leftPanel === 'outline' ? 'outline' : 'add'}>
                  {leftPanel === 'outline' && <ChaiOutline />}
                  {leftPanel === 'add' && <ChaiAddBlocksPanel showHeading={false} fromSidebar={true} />}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas - full width center */}
      <div className="flex-1 relative overflow-hidden chai-canvas-area">
        {/* Screen sizes toolbar */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <ChaiScreenSizes
            openDelay={0}
            canvas={false}
            tooltip={true}
            buttonClass="p-2 rounded-xl bg-background/70 backdrop-blur-xl border border-border/40 shadow-sm hover:bg-accent/80 transition-all text-muted-foreground"
            activeButtonClass="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20"
          />
          <button
            onClick={() => setShowRight(!showRight)}
            className={`p-2 rounded-xl backdrop-blur-xl border shadow-sm transition-all ${
              showRight
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-background/70 text-muted-foreground border-border/40 hover:bg-accent/80'
            }`}
            title="Düzenleme Paneli"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        <ChaiBuilderCanvas />

        {/* Floating edit card - INSIDE canvas area, absolute positioned */}
        <AnimatePresence>
          {showRight && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute right-3 top-14 z-40 w-[260px]"
            >
              <div className="floating-edit-card flex flex-col max-h-[380px]">
                {/* Tab switcher */}
                <div className="relative z-10 flex items-center gap-1 p-1.5 border-b border-border/20">
                  <button
                    onClick={() => setRightTab('props')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      rightTab === 'props'
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Settings2 className="w-3 h-3" />
                    Özellikler
                  </button>
                  <button
                    onClick={() => setRightTab('styles')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      rightTab === 'styles'
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Paintbrush className="w-3 h-3" />
                    Stiller
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => setShowRight(false)}
                    className="p-1 rounded-md hover:bg-accent/50 text-muted-foreground transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Panel content */}
                <ScrollArea className="flex-1 relative z-10 max-h-[320px]">
                  <div className="p-3 chai-panel-scroll" data-panel={rightTab}>
                    {rightTab === 'props' && <ChaiBlockPropsEditor />}
                    {rightTab === 'styles' && <ChaiBlockStyleEditor />}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
