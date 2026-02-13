import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChaiBuilderEditor, ChaiThemeValues } from '@chaibuilder/sdk';
import type { ChaiBlock } from '@chaibuilder/sdk/types';
import { loadWebBlocks } from '@chaibuilder/sdk/web-blocks';
import '@chaibuilder/sdk/styles';
import '@/styles/chaibuilder.tailwind.css';
import { useChaiBuilderSave } from './hooks/useChaiBuilder';
import { supabase } from '@/integrations/supabase/client';
import { MobileEditorLayout } from './MobileEditorLayout';
import { DesktopEditorLayout } from './DesktopEditorLayout';
import { PixabayImagePicker } from './PixabayImagePicker';
import { InlineImageSwitcher } from './InlineImageSwitcher';
import { EditorProvider } from './EditorContext';
import { toast } from 'sonner';

// Register custom blocks
import './blocks';

// Load web blocks on module load
loadWebBlocks();

// Import theme presets from centralized file
import { themePresets, defaultTheme } from './themes';

const MIN_EDITOR_WIDTH = 768;

interface ChaiBuilderWrapperProps {
  projectId: string;
  projectName: string;
  projectProfession?: string;
  initialBlocks: ChaiBlock[];
  initialTheme?: Partial<ChaiThemeValues>;
  onPublish: () => void;
}

export function ChaiBuilderWrapper({
  projectId,
  projectName,
  projectProfession = '',
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
  const [inlineSwitcherOpen, setInlineSwitcherOpen] = useState(false);

  const handleImageSelect = useCallback((url: string) => {
    // Use the global callback from EditableChaiImage if available
    if (window.__chaiImageCallback?.setter) {
      window.__chaiImageCallback.setter(url);
      window.__chaiImageCallback = undefined;
      toast.success('Görsel uygulandı!');
      return;
    }

    // Fallback: try DOM injection for legacy cases
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
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
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

  useEffect(() => {
    const checkWidth = () => setIsMobileView(window.innerWidth < MIN_EDITOR_WIDTH);
    window.addEventListener('resize', checkWidth);
    checkWidth();
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Listen for inline image switcher events from EditableChaiImage blocks
  useEffect(() => {
    const handler = () => setInlineSwitcherOpen(true);
    window.addEventListener('chai-open-inline-image-switcher', handler);
    return () => window.removeEventListener('chai-open-inline-image-switcher', handler);
  }, []);

  // Listen for legacy image picker open events
  useEffect(() => {
    const handler = () => setImagePickerOpen(true);
    window.addEventListener('chai-open-image-picker', handler);
    return () => window.removeEventListener('chai-open-image-picker', handler);
  }, []);

  const handleSave = useCallback(async (data: { blocks: ChaiBlock[]; theme?: any; autoSave?: boolean }): Promise<boolean> => {
    return await saveToSupabase({ blocks: data.blocks, theme: data.theme });
  }, [saveToSupabase]);

  const handleAskAi = useCallback(async (type: 'styles' | 'content', prompt: string, blocks: ChaiBlock[], lang: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('chai-ai-assistant', {
        body: { type, prompt, blocks, lang },
      });
      if (error) return { error: error.message };
      return data;
    } catch (err) {
      return { error: 'AI asistanı kullanılamıyor' };
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const editorContextValue = useMemo(() => ({
    projectName,
    onDashboard: () => navigate('/dashboard'),
    onPublish,
    onPreview: () => {
      // Open preview in new tab
      const subdomain = projectId; // Will resolve via public route
      window.open(`/site/${subdomain}`, '_blank');
    },
    onImageSearch: () => setImagePickerOpen(true),
  }), [projectName, navigate, onPublish, projectId]);

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
    <EditorProvider value={editorContextValue}>
      <div className="h-screen w-screen overflow-hidden relative">
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

        {!isMobileView && (
          <>
            <PixabayImagePicker
              open={imagePickerOpen}
              onOpenChange={setImagePickerOpen}
              onSelect={handleImageSelect}
            />
            <InlineImageSwitcher
              isOpen={inlineSwitcherOpen}
              onClose={() => setInlineSwitcherOpen(false)}
              onSelect={handleImageSelect}
              profession={projectProfession}
            />
          </>
        )}
      </div>
    </EditorProvider>
  );
}
