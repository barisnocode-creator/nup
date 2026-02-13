import { useState, useCallback, useRef, useEffect } from 'react';
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
  Home, Paintbrush, Plus, X, PanelRightClose, Globe,
  Layers, Monitor, Tablet, Smartphone, Settings2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomizePanel } from './CustomizePanel';
import { RegeneratePopover } from './RegeneratePopover';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useEditorContext } from './EditorContext';

type LeftPanel = 'outline' | 'add' | null;
type RightTab = 'props' | 'styles';

type ToolKey = 'customize' | 'outline' | 'add';
const tools: { key: ToolKey; icon: React.ElementType; label: string }[] = [
  { key: 'customize', icon: Paintbrush, label: 'Özelleştir' },
  { key: 'outline', icon: Layers, label: 'Sayfalar' },
  { key: 'add', icon: Plus, label: 'Ekle' },
];

export function DesktopEditorLayout() {
  const { onDashboard, onPublish, projectId, featureFlags } = useEditorContext();
  const [leftPanel, setLeftPanel] = useState<LeftPanel>(null);
  const [rightTab, setRightTab] = useState<RightTab>('props');
  const [showRight, setShowRight] = useState(featureFlags.contextualPanel);
  const [showCustomize, setShowCustomize] = useState(false);
  const [screenMode, setScreenMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTool, setActiveTool] = useState<ToolKey | null>(null);
  const customizeRef = useRef<HTMLDivElement>(null);
  const hiddenScreenRef = useRef<HTMLDivElement>(null);

  const handleToggleRight = useCallback(() => setShowRight((prev) => !prev), []);

  const handleToolClick = useCallback((key: ToolKey) => {
    if (key === 'customize') {
      setShowCustomize((prev) => !prev);
      setLeftPanel(null);
      setActiveTool((prev) => (prev === 'customize' ? null : 'customize'));
    } else {
      setShowCustomize(false);
      setLeftPanel((prev) => (prev === key ? null : key));
      setActiveTool((prev) => (prev === key ? null : key));
    }
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

  // Close customize on outside click
  useEffect(() => {
    if (!showCustomize) return;
    const handler = (e: MouseEvent) => {
      if (customizeRef.current && !customizeRef.current.contains(e.target as Node)) {
        setShowCustomize(false);
        if (activeTool === 'customize') setActiveTool(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCustomize, activeTool]);

  // Close customize on Escape
  useEffect(() => {
    if (!showCustomize) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCustomize(false);
        if (activeTool === 'customize') setActiveTool(null);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showCustomize, activeTool]);

  // Sync activeTool when panels close
  useEffect(() => {
    if (!leftPanel && activeTool !== 'customize') setActiveTool(null);
  }, [leftPanel, activeTool]);

  return (
    <TooltipProvider>
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* ===== TOP TOOLBAR ===== */}
      <div className="h-14 shrink-0 flex items-center border-b border-border/30 bg-background/95 backdrop-blur-xl z-50 px-3 shadow-sm">
        {/* Left: Home + Segmented Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDashboard}
            className="p-2 rounded-xl text-muted-foreground hover:bg-accent/80 hover:text-foreground transition-all duration-200 active:scale-95"
            title="Dashboard'a dön"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-border/40" />

          {/* Segmented pill control */}
          <div className="relative flex items-center gap-0.5 p-1 rounded-xl bg-muted/50" ref={customizeRef}>
            {tools.map(({ key, icon: Icon, label }) => {
              const isActive = activeTool === key;
              return (
                <button
                  key={key}
                  onClick={() => handleToolClick(key)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.97] z-10',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktopToolPill"
                      className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/50"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}

            {/* Floating Customize Popover */}
            <AnimatePresence>
              {showCustomize && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-2 w-[280px] max-h-[calc(100vh-80px)] bg-white border border-border/50 rounded-xl shadow-2xl z-[60] overflow-hidden"
                >
                  <CustomizePanel onClose={() => { setShowCustomize(false); setActiveTool(null); }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center spacer */}
        <div className="flex-1" />

        {/* Right: Screen + Panel toggle + Publish */}
        <div className="flex items-center gap-1">
          {/* Hidden SDK screen sizes */}
          <div ref={hiddenScreenRef} className="chai-screen-hidden">
            <ChaiScreenSizes openDelay={0} canvas={false} tooltip={false} />
          </div>

          <button
            onClick={cycleScreen}
            className="p-2 rounded-xl text-muted-foreground hover:bg-accent/80 hover:text-foreground transition-all duration-200 active:scale-95"
            title={screenMode === 'desktop' ? 'Tablet görünüm' : screenMode === 'tablet' ? 'Mobil görünüm' : 'Masaüstü görünüm'}
          >
            {screenMode === 'desktop' && <Monitor className="w-4 h-4" />}
            {screenMode === 'tablet' && <Tablet className="w-4 h-4" />}
            {screenMode === 'mobile' && <Smartphone className="w-4 h-4" />}
          </button>

          {featureFlags.contextualPanel && (
            <button
              onClick={handleToggleRight}
              className={cn(
                'p-2 rounded-xl transition-all duration-200 active:scale-95',
                showRight ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/80'
              )}
              title="Düzenleme Paneli"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          )}

          <div className="h-5 w-px bg-border/40 mx-1" />

          <button
            onClick={onPublish}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-md shadow-primary/20"
          >
            <Globe className="w-3.5 h-3.5" />
            Yayınla
          </button>
        </div>
      </div>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left panel content */}
        <AnimatePresence>
          {leftPanel && (
            <motion.div
              data-editor-panel="left"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="shrink-0 border-r border-border/30 bg-background/95 backdrop-blur-xl overflow-hidden z-30 shadow-xl"
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

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden chai-canvas-area">
          <ChaiBuilderCanvas />
        </div>

        {/* Floating right edit panel */}
        <AnimatePresence>
          {showRight && (
            <motion.div
              data-editor-panel="right"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              role="region"
              aria-label="Bölüm düzenleme paneli"
              className="absolute right-3 top-3 bottom-3 w-[360px] bg-white rounded-xl shadow-2xl border border-border/40 z-40 flex flex-col overflow-hidden right-edit-panel"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                <span className="text-sm font-semibold text-foreground">Bölüm Düzenle</span>
                <div className="flex items-center gap-1">
                  {projectId && <RegeneratePopover projectId={projectId} />}
                  <button
                    onClick={handleToggleRight}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-all duration-200"
                  >
                    Tamam
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 px-3 py-2 border-b border-border/20">
                <button
                  onClick={() => setRightTab('props')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                    rightTab === 'props' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/50'
                  )}
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  İçerik
                </button>
                <button
                  onClick={() => setRightTab('styles')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                    rightTab === 'styles' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/50'
                  )}
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  Stil
                </button>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1">
                <div className="p-3 chai-panel-scroll" data-panel={rightTab}>
                  {rightTab === 'props' && <ChaiBlockPropsEditor />}
                  {rightTab === 'styles' && <ChaiBlockStyleEditor />}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </TooltipProvider>
  );
}
