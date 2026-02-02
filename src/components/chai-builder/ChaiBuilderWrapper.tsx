import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChaiBuilderEditor, ChaiBlock, ChaiThemeValues } from '@chaibuilder/sdk';
import { loadWebBlocks } from '@chaibuilder/sdk/web-blocks';
import '@chaibuilder/sdk/styles';
import '../styles/chaibuilder.tailwind.css';
import { useChaiBuilderSave } from './hooks/useChaiBuilder';
import { supabase } from '@/integrations/supabase/client';

// Register custom blocks
import './blocks';

// Load web blocks on module load
loadWebBlocks();

// Theme presets with proper typing
const themePresets: Record<string, Partial<ChaiThemeValues>>[] = [
  {
    "Modern Profesyonel": {
      fontFamily: {
        heading: "Inter",
        body: "Inter",
      },
      borderRadius: "8px",
      colors: {
        background: ["#ffffff", "#0d0d0d"],
        foreground: ["#1a1a1a", "#fafafa"],
        primary: ["#f97316", "#fb923c"],
        "primary-foreground": ["#ffffff", "#0d0d0d"],
        secondary: ["#f4f4f5", "#262626"],
        "secondary-foreground": ["#4a4a4a", "#cccccc"],
        muted: ["#f4f4f5", "#262626"],
        "muted-foreground": ["#737373", "#a3a3a3"],
        accent: ["#f97316", "#fb923c"],
        "accent-foreground": ["#ffffff", "#0d0d0d"],
        destructive: ["#ef4444", "#f87171"],
        "destructive-foreground": ["#ffffff", "#ffffff"],
        border: ["#e5e5e5", "#2e2e2e"],
        input: ["#e5e5e5", "#2e2e2e"],
        ring: ["#f97316", "#fb923c"],
        card: ["#ffffff", "#141414"],
        "card-foreground": ["#1a1a1a", "#fafafa"],
        popover: ["#ffffff", "#141414"],
        "popover-foreground": ["#1a1a1a", "#fafafa"],
      },
    }
  },
  {
    "Kurumsal Mavi": {
      fontFamily: {
        heading: "Poppins",
        body: "Open Sans",
      },
      borderRadius: "4px",
      colors: {
        background: ["#ffffff", "#0a0a0f"],
        foreground: ["#0f172a", "#f8fafc"],
        primary: ["#1e40af", "#3b82f6"],
        "primary-foreground": ["#ffffff", "#0f172a"],
        secondary: ["#f1f5f9", "#1e293b"],
        "secondary-foreground": ["#0f172a", "#f8fafc"],
        muted: ["#f1f5f9", "#1e293b"],
        "muted-foreground": ["#64748b", "#94a3b8"],
        accent: ["#1e40af", "#3b82f6"],
        "accent-foreground": ["#ffffff", "#0f172a"],
        destructive: ["#dc2626", "#f87171"],
        "destructive-foreground": ["#ffffff", "#ffffff"],
        border: ["#e2e8f0", "#334155"],
        input: ["#e2e8f0", "#334155"],
        ring: ["#1e40af", "#3b82f6"],
        card: ["#ffffff", "#0f172a"],
        "card-foreground": ["#0f172a", "#f8fafc"],
        popover: ["#ffffff", "#0f172a"],
        "popover-foreground": ["#0f172a", "#f8fafc"],
      },
    }
  },
  {
    "Minimal Koyu": {
      fontFamily: {
        heading: "Space Grotesk",
        body: "Inter",
      },
      borderRadius: "0px",
      colors: {
        background: ["#0a0a0a", "#0a0a0a"],
        foreground: ["#fafafa", "#fafafa"],
        primary: ["#ffffff", "#ffffff"],
        "primary-foreground": ["#0a0a0a", "#0a0a0a"],
        secondary: ["#171717", "#171717"],
        "secondary-foreground": ["#a3a3a3", "#a3a3a3"],
        muted: ["#171717", "#171717"],
        "muted-foreground": ["#737373", "#737373"],
        accent: ["#ffffff", "#ffffff"],
        "accent-foreground": ["#0a0a0a", "#0a0a0a"],
        destructive: ["#ef4444", "#f87171"],
        "destructive-foreground": ["#ffffff", "#ffffff"],
        border: ["#262626", "#262626"],
        input: ["#262626", "#262626"],
        ring: ["#ffffff", "#ffffff"],
        card: ["#0f0f0f", "#0f0f0f"],
        "card-foreground": ["#fafafa", "#fafafa"],
        popover: ["#0f0f0f", "#0f0f0f"],
        "popover-foreground": ["#fafafa", "#fafafa"],
      },
    }
  }
];

const defaultTheme: Partial<ChaiThemeValues> = {
  fontFamily: {
    heading: "Inter",
    body: "Inter",
  },
  borderRadius: "8px",
  colors: {
    background: ["#ffffff", "#0d0d0d"],
    foreground: ["#1a1a1a", "#fafafa"],
    primary: ["#f97316", "#fb923c"],
    "primary-foreground": ["#ffffff", "#0d0d0d"],
    secondary: ["#f4f4f5", "#262626"],
    "secondary-foreground": ["#4a4a4a", "#cccccc"],
    muted: ["#f4f4f5", "#262626"],
    "muted-foreground": ["#737373", "#a3a3a3"],
    accent: ["#f97316", "#fb923c"],
    "accent-foreground": ["#ffffff", "#0d0d0d"],
    destructive: ["#ef4444", "#f87171"],
    "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e5e5e5", "#2e2e2e"],
    input: ["#e5e5e5", "#2e2e2e"],
    ring: ["#f97316", "#fb923c"],
    card: ["#ffffff", "#141414"],
    "card-foreground": ["#1a1a1a", "#fafafa"],
    popover: ["#ffffff", "#141414"],
    "popover-foreground": ["#1a1a1a", "#fafafa"],
  },
};

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
        theme={initialTheme || defaultTheme}
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
