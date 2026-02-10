import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChaiBuilderEditor, ChaiThemeValues } from '@chaibuilder/sdk';
import type { ChaiBlock } from '@chaibuilder/sdk/types';
import { loadWebBlocks } from '@chaibuilder/sdk/web-blocks';
import '@chaibuilder/sdk/styles';
import '@/styles/chaibuilder.tailwind.css';
import { useChaiBuilderSave } from './hooks/useChaiBuilder';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import { MobileEditorLayout } from './MobileEditorLayout';
import { DesktopEditorLayout } from './DesktopEditorLayout';
import { PixabayImagePicker } from './PixabayImagePicker';
import { toast } from 'sonner';

// Register custom blocks
import './blocks';

// Load web blocks on module load
loadWebBlocks();

// Import theme presets from centralized file
import { themePresets, defaultTheme } from './themes';

const MIN_EDITOR_WIDTH = 1280;

interface ChaiBuilderWrapperProps {
  projectId: string;
  projectName: string;
  initialBlocks: ChaiBlock[];
  initialTheme?: Partial<ChaiThemeValues>;
  onPublish: () => void;
}

export function ChaiBuilderWrapper({
  projectId,
  projectName,
  initialBlocks,
  initialTheme,
  onPublish,
}: ChaiBuilderWrapperProps) {
  const navigate = useNavigate();
  const { saveToSupabase } = useChaiBuilderSave(projectId);
  const [isReady, setIsReady] = useState(false);
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MIN_EDITOR_WIDTH : false
  );
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const handleImageSelect = useCallback((url: string) => {
    // Try to inject into RJSF image input in the desktop props panel
    const allInputs = document.querySelectorAll('input[type="text"]');
    let injected = false;

    for (const input of allInputs) {
      const inputEl = input as HTMLInputElement;
      const parent = inputEl.closest('.form-group, .field, [class*="field"]');
      if (parent) {
        const label = parent.querySelector('label');
        if (label) {
          const labelText = label.textContent?.toLowerCase() || '';
          if (labelText.includes('görsel') || labelText.includes('image') || labelText.includes('arka plan') || labelText.includes('background')) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              'value'
            )?.set;
            if (nativeInputValueSetter) {
              nativeInputValueSetter.call(inputEl, url);
              inputEl.dispatchEvent(new Event('input', { bubbles: true }));
              inputEl.dispatchEvent(new Event('change', { bubbles: true }));
              injected = true;
              break;
            }
          }
        }
      }
    }

    if (!injected) {
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Görsel URL\'si kopyalandı! Görsel alanına yapıştırın.', { duration: 4000 });
      }).catch(() => {
        toast.info('Görsel seçildi. Özellikler panelinden görsel alanını güncelleyin.', { duration: 4000 });
      });
    } else {
      toast.success('Görsel uygulandı!');
    }
  }, []);

  // Monitor screen width
  useEffect(() => {
    const checkWidth = () => {
      setIsMobileView(window.innerWidth < MIN_EDITOR_WIDTH);
    };
    window.addEventListener('resize', checkWidth);
    checkWidth();
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Handle save callback
  const handleSave = useCallback(async (data: { 
    blocks: ChaiBlock[]; 
    theme?: any;
    autoSave?: boolean;
  }): Promise<boolean> => {
    const result = await saveToSupabase({
      blocks: data.blocks,
      theme: data.theme,
    });
    return result;
  }, [saveToSupabase]);

  // AI callback for content/style generation
  const handleAskAi = useCallback(async (
    type: 'styles' | 'content',
    prompt: string,
    blocks: ChaiBlock[],
    lang: string
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('chai-ai-assistant', {
        body: { type, prompt, blocks, lang },
      });

      if (error) {
        console.error('AI Assistant error:', error);
        return { error: error.message };
      }

      return data;
    } catch (err) {
      console.error('AI callback error:', err);
      return { error: 'AI asistanı kullanılamıyor' };
    }
  }, []);

  useEffect(() => {
    // Small delay to ensure all blocks are registered
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Editör yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Back to Dashboard + Image Search - desktop glassmorphism toolbar */}
      {!isMobileView && (
        <div className="absolute top-3 left-3 z-[9999] flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-background/70 backdrop-blur-xl border border-border/40 shadow-lg shadow-black/5 hover:bg-accent/80 transition-all text-sm text-foreground active:scale-95"
            title="Dashboard'a dön"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Geri</span>
          </button>
          <button
            onClick={() => setImagePickerOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-background/70 backdrop-blur-xl border border-border/40 shadow-lg shadow-black/5 hover:bg-accent/80 transition-all text-sm text-foreground active:scale-95"
            title="Görsel Ara"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Görsel Ara</span>
          </button>
        </div>
      )}

      <ChaiBuilderEditor
        pageId={projectId}
        blocks={initialBlocks}
        theme={(initialTheme || defaultTheme) as ChaiThemeValues}
        themePresets={themePresets}
        onSave={handleSave}
        autoSave={true}
        autoSaveActionsCount={5}
        locale="tr"
        askAiCallBack={handleAskAi}
        htmlDir="ltr"
        layout={isMobileView ? MobileEditorLayout : DesktopEditorLayout}
        smallScreenComponent={() => null}
        flags={{
          darkMode: true,
          dragAndDrop: !isMobileView,
          copyPaste: true,
          exportCode: false,
          importHtml: !isMobileView,
          designTokens: !isMobileView,
        }}
        gotoPage={({ pageId }) => {
          navigate(`/project/${pageId}`);
        }}
      />

      {/* Pixabay Image Picker - Desktop */}
      {!isMobileView && (
        <PixabayImagePicker
          open={imagePickerOpen}
          onOpenChange={setImagePickerOpen}
          onSelect={handleImageSelect}
        />
      )}
    </div>
  );
}
