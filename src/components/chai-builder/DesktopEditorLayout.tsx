import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ChaiBuilderCanvas,
  ChaiBlockPropsEditor,
  ChaiBlockStyleEditor,
  ChaiOutline,
  ChaiAddBlocksPanel,
  ChaiScreenSizes,
  ChaiUndoRedo } from
'@chaibuilder/sdk';
import {
  Home, Paintbrush, FileText, Plus, HelpCircle,
  Settings2, X, PanelRightClose, Eye, Globe,
  Layers, ImageIcon, Monitor, Tablet, Smartphone } from
'lucide-react';
import { cn } from '@/lib/utils';
import { CustomizePanel } from './CustomizePanel';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useEditorContext } from './EditorContext';

type LeftPanel = 'outline' | 'add' | null;
type RightTab = 'props' | 'styles';

export function DesktopEditorLayout() {
  const { projectName, onDashboard, onPublish, onPreview, onImageSearch } = useEditorContext();
  const [leftPanel, setLeftPanel] = useState<LeftPanel>(null);
  const [rightTab, setRightTab] = useState<RightTab>('props');
  const [showRight, setShowRight] = useState(true);
  const [showCustomize, setShowCustomize] = useState(false);
  const [screenMode, setScreenMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const customizeRef = useRef<HTMLDivElement>(null);
  const hiddenScreenRef = useRef<HTMLDivElement>(null);

  const handleToggleRight = useCallback(() => setShowRight((prev) => !prev), []);

  const cycleScreen = useCallback(() => {
    const order: Array<'desktop' | 'tablet' | 'mobile'> = ['desktop', 'tablet', 'mobile'];
    const btnIndex = { desktop: 4, tablet: 2, mobile: 0 }; // nth-child index (0-based) in ChaiScreenSizes
    setScreenMode((prev) => {
      const next = order[(order.indexOf(prev) + 1) % 3];
      // Click the corresponding hidden SDK button
      setTimeout(() => {
        const btns = hiddenScreenRef.current?.querySelectorAll('button');
        if (btns && btns[btnIndex[next]]) {
          btns[btnIndex[next]].click();
        }
      }, 0);
      return next;
    });
  }, []);

  // Close customize popover on outside click
  useEffect(() => {
    if (!showCustomize) return;
    const handler = (e: MouseEvent) => {
      if (customizeRef.current && !customizeRef.current.contains(e.target as Node)) {
        setShowCustomize(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCustomize]);

  // Close customize on Escape
  useEffect(() => {
    if (!showCustomize) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowCustomize(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showCustomize]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* ===== TOP TOOLBAR ===== */}
      <div className="h-14 shrink-0 flex items-center border-b border-border/40 bg-background/95 backdrop-blur-xl z-50 px-2 gap-1">
        {/* Left group */}
        <button
          onClick={onDashboard}
          className="p-2.5 rounded-xl text-muted-foreground hover:bg-accent/80 hover:text-foreground transition-all active:scale-95"
          title="Dashboard'a dön">

          <Home className="w-4 h-4" />
        </button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Özelleştir - floating popover trigger */}
        <div className="relative" ref={customizeRef}>
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showCustomize ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/80'}`
            }>

            <Paintbrush className="w-3.5 h-3.5" />
            Özelleştir
          </button>

          {/* Floating Customize Popover */}
          <AnimatePresence>
            {showCustomize &&
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute top-full left-0 mt-2 w-[280px] max-h-[calc(100vh-80px)] bg-background border border-border/50 rounded-xl shadow-2xl backdrop-blur-xl z-[60] overflow-hidden">

                <CustomizePanel onClose={() => setShowCustomize(false)} />
              </motion.div>
            }
          </AnimatePresence>
        </div>

        <button
          onClick={() => setLeftPanel(leftPanel === 'outline' ? null : 'outline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          leftPanel === 'outline' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/80'}`
          }>

          <Layers className="w-3.5 h-3.5" />
          Sayfalar
        </button>

        <button
          onClick={() => setLeftPanel(leftPanel === 'add' ? null : 'add')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          leftPanel === 'add' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/80'}`
          }>

          <Plus className="w-3.5 h-3.5" />
          Ekle
        </button>

        







        {/* Center: project name */}
        <div className="flex-1 flex items-center justify-center">
          


        </div>

        {/* Right group */}
        <div className="flex items-center gap-1">
          

          {/* Hidden SDK screen sizes for programmatic control */}
          <div ref={hiddenScreenRef} className="chai-screen-hidden">
            <ChaiScreenSizes openDelay={0} canvas={false} tooltip={false} />
          </div>

          {/* Lovable-style cycling screen button */}
          <button
            onClick={cycleScreen}
            className="p-2 rounded-lg text-muted-foreground hover:bg-accent/80 transition-all active:scale-95"
            title={screenMode === 'desktop' ? 'Show tablet preview' : screenMode === 'tablet' ? 'Show mobile preview' : 'Show desktop preview'}>

            {screenMode === 'desktop' && <Monitor className="w-4 h-4" />}
            {screenMode === 'tablet' && <Tablet className="w-4 h-4" />}
            {screenMode === 'mobile' && <Smartphone className="w-4 h-4" />}
          </button>

          <button
            onClick={handleToggleRight}
            className={`p-2 rounded-lg transition-all ${
            showRight ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/80'}`
            }
            title="Düzenleme Paneli">

            <PanelRightClose className="w-4 h-4" />
          </button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <button
            onClick={onPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent/80 transition-all">

            <Eye className="w-3.5 h-3.5" />
            Önizle
          </button>

          <button
            onClick={onPublish}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95">

            <Globe className="w-3.5 h-3.5" />
            Yayınla
          </button>
        </div>
      </div>

      {/* ===== MAIN AREA (below toolbar) ===== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left panel content */}
        <AnimatePresence>
          {leftPanel &&
          <motion.div
            data-editor-panel="left"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="shrink-0 border-r border-border/30 bg-background/95 backdrop-blur-xl overflow-hidden z-30 shadow-xl">

              <div className="w-[260px] h-full flex flex-col">
                <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {leftPanel === 'outline' ? 'Katmanlar' : 'Blok Ekle'}
                  </span>
                  <button
                  onClick={() => setLeftPanel(null)}
                  className="p-1 rounded-lg hover:bg-accent/80 text-muted-foreground">

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
          }
        </AnimatePresence>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden chai-canvas-area">
          <ChaiBuilderCanvas />
        </div>

        {/* Right edit panel */}
        <AnimatePresence>
          {showRight &&
          <motion.div
            data-editor-panel="right"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="shrink-0 border-l border-border/30 bg-background overflow-hidden z-30 right-edit-panel">

              <div className="w-[320px] h-full flex flex-col">
                <div className="flex items-center gap-1 px-3 py-2.5 border-b border-border/30">
                  <button
                  onClick={() => setRightTab('props')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  rightTab === 'props' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/50'}`
                  }>

                    <Settings2 className="w-3.5 h-3.5" />
                    Özellikler
                  </button>
                  <button
                  onClick={() => setRightTab('styles')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  rightTab === 'styles' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/50'}`
                  }>

                    <Paintbrush className="w-3.5 h-3.5" />
                    Stiller
                  </button>
                  <div className="flex-1" />
                  <button
                  onClick={handleToggleRight}
                  className="p-1.5 rounded-lg hover:bg-accent/50 text-muted-foreground transition-all"
                  title="Paneli Kapat">

                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-3 chai-panel-scroll" data-panel={rightTab}>
                    {rightTab === 'props' && <ChaiBlockPropsEditor />}
                    {rightTab === 'styles' && <ChaiBlockStyleEditor />}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);

}