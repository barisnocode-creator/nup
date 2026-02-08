import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChaiBuilderEditor, ChaiThemeValues } from '@chaibuilder/sdk';
import type { ChaiBlock } from '@chaibuilder/sdk/types';
import { loadWebBlocks } from '@chaibuilder/sdk/web-blocks';
import '@chaibuilder/sdk/styles';
import '@/styles/chaibuilder.tailwind.css';
import { useChaiBuilderSave } from './hooks/useChaiBuilder';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MIN_EDITOR_WIDTH : false
  );

  // Monitor screen width for editor minimum requirement
  useEffect(() => {
    const checkWidth = () => {
      setIsScreenTooSmall(window.innerWidth < MIN_EDITOR_WIDTH);
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

  // Mobile/tablet screen warning
  if (isScreenTooSmall) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Monitor className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Masaüstü Görünümü Gerekli
            </h2>
            <p className="text-muted-foreground">
              Web sitesi editörü en az <strong>1280px</strong> ekran genişliği gerektirmektedir. 
              Lütfen masaüstü bilgisayarınızdan veya daha geniş bir ekrandan açın.
            </p>
          </div>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="default"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard'a Dön
          </Button>
        </div>
      </div>
    );
  }

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
      {/* Back to Dashboard Button - overlayed on top of the editor */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-2 left-2 z-[9999] flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background/90 backdrop-blur-sm border border-border shadow-sm hover:bg-accent transition-colors text-sm text-foreground"
        title="Dashboard'a dön"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Geri</span>
      </button>

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
        flags={{
          darkMode: true,
          dragAndDrop: true,
          copyPaste: true,
          exportCode: false,
          importHtml: true,
          designTokens: true,
        }}
        gotoPage={({ pageId }) => {
          navigate(`/project/${pageId}`);
        }}
      />
    </div>
  );
}
