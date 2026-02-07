import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChaiBuilderEditor, ChaiThemeValues } from '@chaibuilder/sdk';
import type { ChaiBlock } from '@chaibuilder/sdk/types';
import { loadWebBlocks } from '@chaibuilder/sdk/web-blocks';
import '@chaibuilder/sdk/styles';
import '@/styles/chaibuilder.tailwind.css';
import { useChaiBuilderSave } from './hooks/useChaiBuilder';
import { supabase } from '@/integrations/supabase/client';

// Register custom blocks
import './blocks';

// Load web blocks on module load
loadWebBlocks();

// Import theme presets from centralized file
import { themePresets, defaultTheme } from './themes';

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
    <div className="h-screen w-screen overflow-hidden">
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
