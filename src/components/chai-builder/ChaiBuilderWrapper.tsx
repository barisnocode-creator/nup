import { useEffect, useState, useCallback, useMemo, useRef } from 'react'; 
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
import { EditorProvider, DEFAULT_FEATURE_FLAGS } from './EditorContext';
import { TemplateGalleryOverlay } from './TemplateGalleryOverlay';
import { TemplatePreviewBanner } from '@/components/website-preview/TemplatePreviewBanner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { getTemplateConfig } from '@/templates';
import { convertGeneratedContentToChaiBlocks, getThemeForTemplate } from './utils/convertToChaiBlocks';

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
  templateId?: string;
  onPublish: () => void;
}

export function ChaiBuilderWrapper({
  projectId,
  projectName,
  projectProfession = '',
  initialBlocks,
  initialTheme,
  templateId,
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
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [galleryContent, setGalleryContent] = useState<any>(null);
  const currentTemplateId = templateId || 'pilates1';

  // Template preview state
  const [previewBlocks, setPreviewBlocks] = useState<ChaiBlock[] | null>(null);
  const [previewTheme, setPreviewTheme] = useState<Partial<ChaiThemeValues> | null>(null);
  const [previewTemplateName, setPreviewTemplateName] = useState<string | null>(null);
  const [previewTemplateIdState, setPreviewTemplateIdState] = useState<string | null>(null);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

  // Backup original blocks/theme
  const originalBlocksRef = useRef<ChaiBlock[]>(initialBlocks);
  const originalThemeRef = useRef<Partial<ChaiThemeValues> | undefined>(initialTheme);

  // Keep refs in sync when initialBlocks/initialTheme change (e.g. after DB reload)
  useEffect(() => {
    if (!previewBlocks) {
      originalBlocksRef.current = initialBlocks;
      originalThemeRef.current = initialTheme;
    }
  }, [initialBlocks, initialTheme, previewBlocks]);
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
    // Prevent auto-save during preview mode
    if (previewBlocks) return true;
    return await saveToSupabase({ blocks: data.blocks, theme: data.theme });
  }, [saveToSupabase, previewBlocks]);

  // Template preview handler
  const handlePreviewTemplate = useCallback(async (selectedTemplateId: string) => {
    const config = getTemplateConfig(selectedTemplateId);
    if (!config) {
      toast.error('Template bulunamadı');
      return;
    }

    try {
      // Fetch generated_content from DB
      const { data, error } = await supabase
        .from('projects')
        .select('generated_content')
        .eq('id', projectId)
        .single();

      const content = error ? null : (data?.generated_content as any);
      
      // Generate new blocks from content (or fallback empty blocks)
      const newBlocks = content
        ? convertGeneratedContentToChaiBlocks(content, selectedTemplateId)
        : [
            { _id: `preview_hero_${Date.now()}`, _type: 'HeroCentered', title: 'Hoş Geldiniz', subtitle: '', description: '', primaryButtonText: 'İletişime Geç', primaryButtonLink: '#contact', secondaryButtonText: '', secondaryButtonLink: '', backgroundImage: '' } as ChaiBlock,
            { _id: `preview_cta_${Date.now()}`, _type: 'CTABanner', title: 'Hemen Başlayalım', description: 'Sizinle çalışmak için sabırsızlanıyoruz.', buttonText: 'İletişime Geç', buttonLink: '#contact', secondaryButtonText: '', secondaryButtonLink: '', backgroundImage: '' } as ChaiBlock,
          ];

      const newTheme = getThemeForTemplate(selectedTemplateId);

      setPreviewBlocks(newBlocks);
      setPreviewTheme(newTheme);
      setPreviewTemplateName(config.name);
      setPreviewTemplateIdState(selectedTemplateId);
      setShowTemplateGallery(false);
    } catch (err) {
      console.error('Preview error:', err);
      toast.error('Önizleme yüklenemedi');
    }
  }, [projectId]);

  // Apply template handler
  const handleApplyTemplate = useCallback(async () => {
    if (!previewBlocks || !previewTheme || !previewTemplateIdState) return;

    setIsApplyingTemplate(true);
    try {
      const saved = await saveToSupabase({ blocks: previewBlocks, theme: previewTheme });
      if (!saved) {
        toast.error('Template kaydedilemedi. Lütfen tekrar deneyin.');
        return;
      }

      // Update template_id in DB
      const { error } = await supabase
        .from('projects')
        .update({ template_id: previewTemplateIdState, updated_at: new Date().toISOString() })
        .eq('id', projectId);

      if (error) {
        console.error('Template ID update error:', error);
      }

      // Update refs to new blocks/theme
      originalBlocksRef.current = previewBlocks;
      originalThemeRef.current = previewTheme;

      // Clear preview state
      setPreviewBlocks(null);
      setPreviewTheme(null);
      setPreviewTemplateName(null);
      setPreviewTemplateIdState(null);
      
      toast.success('Template uygulandı!');
    } catch (err) {
      console.error('Apply error:', err);
      toast.error('Template uygulanırken bir hata oluştu.');
    } finally {
      setIsApplyingTemplate(false);
    }
  }, [previewBlocks, previewTheme, previewTemplateIdState, saveToSupabase, projectId]);

  // Cancel preview handler
  const handleCancelPreview = useCallback(() => {
    setPreviewBlocks(null);
    setPreviewTheme(null);
    setPreviewTemplateName(null);
    setPreviewTemplateIdState(null);
  }, []);

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
    projectId,
    projectName,
    projectProfession,
    featureFlags: DEFAULT_FEATURE_FLAGS,
    onDashboard: () => navigate('/dashboard'),
    onPublish,
    onPreview: () => {
      const subdomain = projectId;
      window.open(`/site/${subdomain}`, '_blank');
    },
    onImageSearch: () => setImagePickerOpen(true),
    onRegenerateText: () => {
      toast.info('Metin yeniden oluşturuluyor...', { duration: 2000 });
    },
    onRegenerateWebsite: () => {
      toast.info('Site yeniden oluşturuluyor...', { duration: 2000 });
    },
    onChangeTemplate: async () => {
      // Fetch generated_content for live preview
      try {
        const { data } = await supabase.from('projects').select('generated_content').eq('id', projectId).single();
        setGalleryContent(data?.generated_content || null);
      } catch { /* use default demo content */ }
      setShowTemplateGallery(true);
    },
  }), [projectName, projectProfession, navigate, onPublish, projectId]);

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
    <TooltipProvider>
      <EditorProvider value={editorContextValue}>
        <div className="h-screen w-screen overflow-hidden relative">
          {/* Template Preview Banner */}
          {previewTemplateName && (
            <div className="absolute top-0 left-0 right-0 z-[90]">
              <TemplatePreviewBanner
                templateName={previewTemplateName}
                onApply={handleApplyTemplate}
                onCancel={handleCancelPreview}
                isApplying={isApplyingTemplate}
              />
            </div>
          )}

          <ChaiBuilderEditor
            pageId={projectId}
            blocks={previewBlocks || initialBlocks}
            theme={(previewTheme || initialTheme || defaultTheme) as ChaiThemeValues}
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

          <TemplateGalleryOverlay
            isOpen={showTemplateGallery}
            onClose={() => setShowTemplateGallery(false)}
            currentTemplateId={previewTemplateIdState || currentTemplateId}
            onPreview={handlePreviewTemplate}
            generatedContent={galleryContent}
          />
        </div>
      </EditorProvider>
    </TooltipProvider>
  );
}
