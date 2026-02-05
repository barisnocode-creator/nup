import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Loader2, BarChart3, ImageIcon } from 'lucide-react';
import { WebsitePreview } from '@/components/website-preview/WebsitePreview';
import { EditorToolbar } from '@/components/website-preview/EditorToolbar';
import { AuthWallOverlay } from '@/components/website-preview/AuthWallOverlay';
import { AuthModal } from '@/components/auth/AuthModal';
import { PublishModal } from '@/components/website-preview/PublishModal';
import { UpgradeModal } from '@/components/website-preview/UpgradeModal';
import { EditorSidebar, type EditorSelection, type ImageData, type HeroVariant } from '@/components/website-preview/EditorSidebar';
import { CustomizeSidebar } from '@/components/website-preview/CustomizeSidebar';
import { ChangeTemplateModal } from '@/components/website-preview/ChangeTemplateModal';
import { TemplatePreviewBanner } from '@/components/website-preview/TemplatePreviewBanner';
import { PageSettingsSidebar } from '@/components/website-preview/PageSettingsSidebar';
import { AddContentSidebar } from '@/components/website-preview/AddContentSidebar';
import { HomeEditorSidebar } from '@/components/website-preview/HomeEditorSidebar';
import { GeneratedContent, SectionStyle } from '@/types/generated-website';
import { useToast } from '@/hooks/use-toast';
import { usePageView } from '@/hooks/usePageView';
import { useThemeColors } from '@/hooks/useThemeColors';
import { getTemplateConfig } from '@/templates';
import { convertGeneratedContentToChaiBlocks, getThemeForTemplate } from '@/components/chai-builder/utils/convertToChaiBlocks';

// Lazy load editors for performance
const GrapesEditor = lazy(() => import('@/components/grapes-editor/GrapesEditor').then(m => ({ default: m.GrapesEditor })));
const ChaiBuilderWrapper = lazy(() => import('@/components/chai-builder/ChaiBuilderWrapper').then(m => ({ default: m.ChaiBuilderWrapper })));

// Feature flags for editors
const USE_GRAPES_EDITOR = false;
const USE_CHAI_BUILDER = true; // Enable ChaiBuilder SDK

interface Project {
  id: string;
  name: string;
  profession: string;
  status: string;
  subdomain?: string | null;
  is_published?: boolean;
  template_id?: string;
  form_data: {
    websitePreferences?: {
      colorPreference?: string;
    };
  } | null;
  generated_content: GeneratedContent | null;
  chai_blocks?: any[];
  chai_theme?: any;
}

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, signInWithGoogle, signInWithApple } = useAuth();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [lockedFeature, setLockedFeature] = useState('');
  const [currentSection, setCurrentSection] = useState('hero');
  
  // Section management state
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'hero', 'statistics', 'about', 'services', 'process', 'gallery', 'testimonials', 'faq', 'contact', 'cta'
  ]);

  // Unified Editor Sidebar State
  const [editorSelection, setEditorSelection] = useState<EditorSelection | null>(null);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [isRegeneratingField, setIsRegeneratingField] = useState<string | null>(null);

  // New Sidebar States
  const [customizeSidebarOpen, setCustomizeSidebarOpen] = useState(false);
  const [changeTemplateModalOpen, setChangeTemplateModalOpen] = useState(false);
  const [pageSettingsSidebarOpen, setPageSettingsSidebarOpen] = useState(false);
  const [addContentSidebarOpen, setAddContentSidebarOpen] = useState(false);
  const [homeEditorSidebarOpen, setHomeEditorSidebarOpen] = useState(false);
  const [selectedPageForSettings, setSelectedPageForSettings] = useState<string>('home');

  // Template Preview State
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [originalTemplateId, setOriginalTemplateId] = useState<string | null>(null);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

  // Track page view for analytics
  usePageView(id, '/preview');

  // Apply theme colors from site settings in real-time (must be at top level, not conditional)
  useThemeColors(project?.generated_content?.siteSettings);

  // Fetch project data
  useEffect(() => {
    async function fetchProject() {
      if (!id) return;

      const { data, error } = await supabase
        .from('projects')
        .select('id, name, profession, status, subdomain, is_published, template_id, form_data, generated_content, chai_blocks, chai_theme')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        navigate('/dashboard');
        return;
      }

      // Cast the data properly
      const projectData = data as unknown as Project;
      setProject(projectData);
      setLoading(false);

      // Load section order from saved content if available
      if (projectData.generated_content?.sectionOrder) {
        setSectionOrder(projectData.generated_content.sectionOrder);
      }

      // If project is draft and no generated content, trigger generation
      if (projectData.status === 'draft' && !projectData.generated_content) {
        generateWebsite(id);
      }
      
      // If project has generated_content but empty chai_blocks, convert it
      if (projectData.generated_content && 
          (!projectData.chai_blocks || projectData.chai_blocks.length === 0)) {
        convertAndSaveChaiBlocks(projectData);
      }
    }

    fetchProject();
  }, [id, navigate]);

  // Convert generated_content to chai_blocks and save
  const convertAndSaveChaiBlocks = async (projectData: Project) => {
    if (!projectData.generated_content || !projectData.id) return;
    
    try {
      const blocks = convertGeneratedContentToChaiBlocks(
        projectData.generated_content,
        projectData.template_id
      );
      const theme = getThemeForTemplate(projectData.template_id);
      
      // Save to database
      const { error } = await supabase
        .from('projects')
        .update({
          chai_blocks: blocks as any,
          chai_theme: theme as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectData.id);
      
      if (error) {
        console.error('Error saving chai_blocks:', error);
        return;
      }
      
      // Update local state
      setProject(prev => prev ? {
        ...prev,
        chai_blocks: blocks,
        chai_theme: theme,
      } : null);
      
      toast({
        title: 'İçerik dönüştürüldü',
        description: 'Mevcut siteniz editöre aktarıldı.',
      });
    } catch (err) {
      console.error('Conversion error:', err);
    }
  };

  const generateWebsite = async (projectId: string) => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-website', {
        body: { projectId },
      });

      if (error) {
        console.error('Generation error:', error);
        toast({
          title: 'Generation failed',
          description: 'Failed to generate website content. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      if (data?.content) {
        setProject(prev => prev ? {
          ...prev,
          generated_content: data.content,
          status: 'generated',
        } : null);
        
        toast({
          title: 'Website generated!',
          description: 'Your professional website has been created.',
        });

        // Auto-generate images in background
        generateImages(projectId);
      }
    } catch (err) {
      console.error('Generation error:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  // Generate AI images for the website
  const generateImages = async (projectId: string) => {
    setGeneratingImages(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-images', {
        body: { projectId },
      });

      if (error) {
        console.error('Image generation error:', error);
        toast({
          title: 'Image generation failed',
          description: 'Could not generate images. You can try again later.',
          variant: 'destructive',
        });
        return;
      }

      if (data?.images) {
        setProject(prev => prev ? {
          ...prev,
          generated_content: {
            ...prev.generated_content!,
            images: data.images,
          },
        } : null);
        
        toast({
          title: 'Images generated!',
          description: 'AI-generated images have been added to your website.',
        });
      }
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setGeneratingImages(false);
    }
  };

  // Deep update helper for nested object paths like "pages.home.hero.title"
  const updateNestedValue = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const result = JSON.parse(JSON.stringify(obj || {})); // Deep clone, handle null
    
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      // Handle array notation like galleryImages[0]
      const key = keys[i];
      const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
      if (arrayMatch) {
        const arrKey = arrayMatch[1];
        const arrIndex = parseInt(arrayMatch[2]);
        // Initialize array if it doesn't exist
        if (!current[arrKey]) {
          current[arrKey] = [];
        }
        // Initialize array element if it doesn't exist
        if (!current[arrKey][arrIndex]) {
          current[arrKey][arrIndex] = {};
        }
        current = current[arrKey][arrIndex];
      } else {
        // Initialize object if it doesn't exist
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    }
    
    const lastKey = keys[keys.length - 1];
    const lastArrayMatch = lastKey.match(/^(\w+)\[(\d+)\]$/);
    if (lastArrayMatch) {
      const arrKey = lastArrayMatch[1];
      const arrIndex = parseInt(lastArrayMatch[2]);
      if (!current[arrKey]) {
        current[arrKey] = [];
      }
      current[arrKey][arrIndex] = value;
    } else {
      current[lastKey] = value;
    }
    
    return result;
  };

  // Handle field edits
  const handleFieldEdit = useCallback((fieldPath: string, newValue: string) => {
    if (!project?.generated_content) return;

    const updatedContent = updateNestedValue(project.generated_content, fieldPath, newValue);
    
    setProject(prev => prev ? {
      ...prev,
      generated_content: updatedContent,
    } : null);
    
    setHasUnsavedChanges(true);
    
    // Auto-save after a short delay
    debouncedSave(updatedContent);
  }, [project]);

  // Debounced save function
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (content: GeneratedContent) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => saveChanges(content), 1500);
      };
    })(),
    [id]
  );

  // Save changes to Supabase
  const saveChanges = async (content: GeneratedContent) => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          generated_content: content as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Save error:', error);
        toast({
          title: 'Failed to save',
          description: 'Your changes could not be saved. Please try again.',
          variant: 'destructive',
        });
      } else {
        setHasUnsavedChanges(false);
        toast({
          title: 'Saved',
          description: 'Your changes have been saved.',
        });
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Unified Editor handlers
  const handleEditorSelect = useCallback((selection: EditorSelection) => {
    setEditorSelection(selection);
  }, []);

  const handleEditorClose = useCallback(() => {
    setEditorSelection(null);
  }, []);

  const handleImageRegenerate = useCallback(async () => {
    if (!editorSelection?.imageData || !id) return;
    
    setIsRegeneratingImage(true);
    setImageOptions([]);
    
    try {
      // Determine image type from path
      let imageType = 'hero';
      const imagePath = editorSelection.imageData.imagePath;
      if (imagePath.includes('about')) imageType = 'about';
      else if (imagePath.includes('gallery')) imageType = 'gallery';
      else if (imagePath.includes('cta')) imageType = 'cta';
      else if (imagePath.includes('service')) imageType = 'service';
      
      const { data, error } = await supabase.functions.invoke('fetch-image-options', {
        body: { projectId: id, imageType, count: 3 },
      });

      if (error) throw error;
      
      if (data?.options && data.options.length > 0) {
        setImageOptions(data.options);
        toast({
          title: 'Alternatives found',
          description: 'Choose from the options below.',
        });
      } else {
        toast({
          title: 'No alternatives found',
          description: 'Try a different search.',
        });
      }
    } catch (err) {
      console.error('Image fetch error:', err);
      toast({
        title: 'Error',
        description: 'Could not fetch image alternatives.',
        variant: 'destructive',
      });
    } finally {
      setIsRegeneratingImage(false);
    }
  }, [editorSelection, id, toast]);

  // Image options state for EditorSidebar
  const [imageOptions, setImageOptions] = useState<Array<{ url: string; thumbnail: string; alt: string }>>([]);
  const [isLoadingImageOptions, setIsLoadingImageOptions] = useState(false);

  const handleImageChange = useCallback(async (imagePath: string) => {
    if (!id) return;
    
    setIsLoadingImageOptions(true);
    setImageOptions([]);
    
    try {
      // Determine image type from path
      let imageType = 'hero';
      if (imagePath.includes('about')) imageType = 'about';
      else if (imagePath.includes('gallery')) imageType = 'gallery';
      else if (imagePath.includes('cta')) imageType = 'cta';
      else if (imagePath.includes('service')) imageType = 'service';
      
      const { data, error } = await supabase.functions.invoke('fetch-image-options', {
        body: { projectId: id, imageType, count: 3 },
      });

      if (error) throw error;
      
      if (data?.options && data.options.length > 0) {
        setImageOptions(data.options);
      } else {
        toast({
          title: 'No alternatives found',
          description: 'Try regenerating instead.',
        });
      }
    } catch (err) {
      console.error('Error fetching image options:', err);
      toast({
        title: 'Error',
        description: 'Could not load image alternatives.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingImageOptions(false);
    }
  }, [id, toast]);

  const handleSelectImageOption = useCallback((url: string) => {
    if (!editorSelection?.imageData?.imagePath || !project?.generated_content) return;
    
    const updatedContent = updateNestedValue(project.generated_content, editorSelection.imageData.imagePath, url);
    
    setProject(prev => prev ? {
      ...prev,
      generated_content: updatedContent,
    } : null);
    
    // Update selection to show new image
    setEditorSelection(prev => prev ? {
      ...prev,
      imageData: prev.imageData ? { ...prev.imageData, currentUrl: url } : undefined,
    } : null);
    
    setImageOptions([]);
    setHasUnsavedChanges(true);
    debouncedSave(updatedContent);
    
    toast({
      title: 'Image updated',
      description: 'Your new image has been applied.',
    });
  }, [editorSelection, project, debouncedSave, toast]);

  const handleUpdateAltText = useCallback((text: string) => {
    if (!editorSelection?.imageData) return;
    setEditorSelection(prev => prev ? { 
      ...prev, 
      imageData: prev.imageData ? { ...prev.imageData, altText: text } : undefined 
    } : null);
  }, []);

  const handleUpdateImagePosition = useCallback((x: number, y: number) => {
    if (!editorSelection?.imageData?.imagePath || !project?.generated_content) return;
    
    // Update EditorSidebar state
    setEditorSelection(prev => prev ? { 
      ...prev, 
      imageData: prev.imageData ? { ...prev.imageData, positionX: x, positionY: y } : undefined 
    } : null);
    
    // Also save position to generated_content for real-time preview updates
    const imagePath = editorSelection.imageData.imagePath;
    const positionPath = imagePath.replace('images.', 'imagePositions.');
    
    const updatedContent = updateNestedValue(
      project.generated_content,
      positionPath,
      { x, y }
    );
    
    setProject(prev => prev ? { ...prev, generated_content: updatedContent } : null);
    setHasUnsavedChanges(true);
  }, [editorSelection, project]);

  const handleRegenerateField = useCallback(async (fieldPath: string) => {
    if (!id || !project?.generated_content) return;
    
    setIsRegeneratingField(fieldPath);
    try {
      toast({
        title: 'Regenerating content...',
        description: 'AI is creating new content for you.',
      });

      const { data, error } = await supabase.functions.invoke('regenerate-content', {
        body: { projectId: id, fieldPath },
      });

      if (error) throw error;
      
      if (data?.success && data?.newValue) {
        handleFieldEdit(fieldPath, data.newValue);
        toast({
          title: 'Content regenerated',
          description: 'Your new content has been applied.',
        });
      } else {
        throw new Error(data?.error || 'Failed to regenerate content');
      }
    } catch (err) {
      console.error('Content regeneration error:', err);
      toast({
        title: 'Regeneration failed',
        description: err instanceof Error ? err.message : 'Could not regenerate content.',
        variant: 'destructive',
      });
    } finally {
      setIsRegeneratingField(null);
    }
  }, [id, project, toast, handleFieldEdit]);

  // Handle hero variant change
  const handleHeroVariantChange = useCallback((variant: HeroVariant) => {
    if (!project?.generated_content) return;

    const updatedContent = {
      ...project.generated_content,
      sectionVariants: {
        ...project.generated_content.sectionVariants,
        hero: variant,
      },
    };
    
    setProject(prev => prev ? {
      ...prev,
      generated_content: updatedContent,
    } : null);
    
    setHasUnsavedChanges(true);
    debouncedSave(updatedContent);
    
    toast({
      title: 'Layout updated',
      description: `Hero layout changed to ${variant}.`,
    });
  }, [project, debouncedSave, toast]);

  // Handle site settings change
  const handleSiteSettingsChange = useCallback((siteSettings: GeneratedContent['siteSettings']) => {
    if (!project?.generated_content) return;

    const updatedContent = {
      ...project.generated_content,
      siteSettings,
    };
    
    setProject(prev => prev ? {
      ...prev,
      generated_content: updatedContent,
    } : null);
    
    setHasUnsavedChanges(true);
    debouncedSave(updatedContent);
  }, [project, debouncedSave]);

  // Handle page settings change
  const handlePageSettingsChange = useCallback((pageName: string, settings: NonNullable<GeneratedContent['pageSettings']>[string]) => {
    if (!project?.generated_content) return;

    const updatedContent = {
      ...project.generated_content,
      pageSettings: {
        ...project.generated_content.pageSettings,
        [pageName]: settings,
      },
    };
    
    setProject(prev => prev ? {
      ...prev,
      generated_content: updatedContent,
    } : null);
    
    setHasUnsavedChanges(true);
    debouncedSave(updatedContent);
  }, [project, debouncedSave]);

  // Handle page settings sidebar open
  const handleOpenPageSettings = useCallback((pageName: string) => {
    setSelectedPageForSettings(pageName);
    setPageSettingsSidebarOpen(true);
  }, []);

  // Handle page editor sidebar open (shows all sections)
  const handleOpenPageEditor = useCallback((pageName: string) => {
    setSelectedPageForSettings(pageName);
    setHomeEditorSidebarOpen(true);
  }, []);

  // Handle add page
  const handleAddPage = useCallback((pageType: string) => {
    toast({
      title: 'Page added',
      description: `${pageType} page has been added to your website.`,
    });
  }, [toast]);

  // Handle add blog post
  const handleAddBlogPost = useCallback(() => {
    toast({
      title: 'Blog post',
      description: 'Blog post editor will open soon.',
    });
  }, [toast]);

  // Handle regenerate all text
  const handleRegenerateAllText = useCallback(async () => {
    toast({
      title: 'Regenerating text...',
      description: 'AI is regenerating all website content.',
    });
    // TODO: Implement via edge function
  }, [toast]);

  // Handle regenerate website
  const handleRegenerateWebsite = useCallback(async () => {
    if (!id) return;
    toast({
      title: 'Regenerating website...',
      description: 'This may take a moment.',
    });
    await generateWebsite(id);
  }, [id, toast]);

  // Handle template change (direct save - used when "Use this template" is clicked)
  const handleTemplateChange = useCallback(async (templateId: string) => {
    if (!id) return;
    
    setIsApplyingTemplate(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ template_id: templateId })
        .eq('id', id);

      if (error) throw error;

      setProject(prev => prev ? { ...prev, template_id: templateId } : null);
      setChangeTemplateModalOpen(false);
      setPreviewTemplateId(null);
      setOriginalTemplateId(null);
      
      toast({
        title: 'Template changed',
        description: 'Your website is now using the new template.',
      });
    } catch (err) {
      console.error('Template change error:', err);
      toast({
        title: 'Error',
        description: 'Could not change template. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsApplyingTemplate(false);
    }
  }, [id, toast]);

  // Handle template preview (temporary change without saving)
  const handleTemplatePreview = useCallback((templateId: string) => {
    // Save the original template ID if not already saved
    if (!originalTemplateId) {
      setOriginalTemplateId(project?.template_id || 'temp1');
    }
    setPreviewTemplateId(templateId);
    setChangeTemplateModalOpen(false);
    toast({
      title: 'Preview mode',
      description: 'Previewing template. Use the banner to apply or cancel.',
    });
  }, [originalTemplateId, project?.template_id, toast]);

  // Handle apply template from preview banner
  const handleApplyPreviewTemplate = useCallback(async () => {
    if (!previewTemplateId) return;
    await handleTemplateChange(previewTemplateId);
  }, [previewTemplateId, handleTemplateChange]);

  // Handle cancel preview
  const handleCancelPreview = useCallback(() => {
    setPreviewTemplateId(null);
    setOriginalTemplateId(null);
    toast({
      title: 'Preview cancelled',
      description: 'Returned to your original template.',
    });
  }, [toast]);

  // Get the active template ID (preview or actual)
  const activeTemplateId = previewTemplateId || project?.template_id || 'temp1';
  const isPreviewMode = previewTemplateId !== null;
  const previewTemplateName = previewTemplateId ? getTemplateConfig(previewTemplateId)?.name || 'Unknown' : '';

  // Handle edit hero background from Customize sidebar
  const handleEditHeroBackground = useCallback(() => {
    const heroImage = project?.generated_content?.images?.heroHome || '';
    handleEditorSelect({
      type: 'image',
      title: 'Hero Background',
      sectionId: 'hero',
      imageData: {
        type: 'hero',
        imagePath: 'images.heroHome',
        currentUrl: heroImage,
        altText: 'Hero Background',
        positionX: 50,
        positionY: 50,
      },
      fields: [],
    });
    setCustomizeSidebarOpen(false);
  }, [project, handleEditorSelect]);

  // Handle regenerate page title
  const handleRegeneratePageTitle = useCallback(() => {
    toast({
      title: 'Regenerating title...',
      description: 'AI is creating a new title.',
    });
    // TODO: Implement via edge function
  }, [toast]);

  // Section management handlers
  const handleMoveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    setSectionOrder(prev => {
      const index = prev.indexOf(sectionId);
      if (index === -1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const newOrder = [...prev];
      [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
      
      // Save to database
      if (project?.generated_content) {
        const updatedContent = {
          ...project.generated_content,
          sectionOrder: newOrder,
        };
        debouncedSave(updatedContent);
      }
      
      return newOrder;
    });
    toast({
      title: 'Section moved',
      description: `${sectionId} section moved ${direction}.`,
    });
  }, [toast, project, debouncedSave]);

  // Drag and drop reorder handler
  const handleReorderSections = useCallback((sourceIndex: number, destIndex: number) => {
    setSectionOrder(prev => {
      const newOrder = [...prev];
      const [removed] = newOrder.splice(sourceIndex, 1);
      newOrder.splice(destIndex, 0, removed);
      
      // Save to database
      if (project?.generated_content) {
        const updatedContent = {
          ...project.generated_content,
          sectionOrder: newOrder,
        };
        setProject(prevProject => prevProject ? {
          ...prevProject,
          generated_content: updatedContent,
        } : null);
        debouncedSave(updatedContent);
      }
      
      return newOrder;
    });
    toast({
      title: 'Sections reordered',
      description: 'Section order has been updated.',
    });
  }, [project, debouncedSave, toast]);

  const handleDeleteSection = useCallback((sectionId: string) => {
    const protectedSections = ['hero'];
    if (protectedSections.includes(sectionId)) {
      toast({
        title: 'Cannot delete',
        description: 'Hero section cannot be deleted.',
        variant: 'destructive',
      });
      return;
    }
    setSectionOrder(prev => {
      const newOrder = prev.filter(s => s !== sectionId);
      
      // Save to database
      if (project?.generated_content) {
        const updatedContent = {
          ...project.generated_content,
          sectionOrder: newOrder,
        };
        debouncedSave(updatedContent);
      }
      
      return newOrder;
    });
    toast({
      title: 'Section deleted',
      description: `${sectionId} section has been removed.`,
    });
  }, [toast, project, debouncedSave]);

  // Handle section style change for real-time styling
  const handleSectionStyleChange = useCallback((sectionId: string, style: SectionStyle) => {
    if (!project?.generated_content) return;

    const updatedContent = {
      ...project.generated_content,
      sectionStyles: {
        ...project.generated_content.sectionStyles,
        [sectionId]: {
          ...project.generated_content.sectionStyles?.[sectionId],
          ...style,
        },
      },
    };
    
    setProject(prev => prev ? {
      ...prev,
      generated_content: updatedContent,
    } : null);
    
    setHasUnsavedChanges(true);
    debouncedSave(updatedContent);
  }, [project, debouncedSave]);

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAppleSignIn = async () => {
    const { error } = await signInWithApple();
    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  // Generation in progress
  if (generating || (project.status === 'draft' && !project.generated_content)) {
    return (
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="bg-background border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 gradient-hero rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Open Lucius</span>
            </div>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Animated Icon */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 gradient-hero rounded-3xl animate-pulse opacity-30" />
              <div className="relative w-32 h-32 gradient-hero rounded-3xl flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-primary-foreground" />
              </div>
            </div>

            {/* Project Name */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {project.profession}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold">{project.name}</h1>
            </div>

            {/* Status Message */}
            <div className="space-y-4 py-8">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xl font-semibold text-primary">
                  {generating ? 'Generating your website with AI...' : 'Your website is being prepared'}
                </span>
              </div>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're creating your professional website using AI. This usually takes 30-60 seconds.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Website preview with optional auth wall
  const colorPreference = project.form_data?.websitePreferences?.colorPreference || 'light';
  const isAuthenticated = !!user;
  const isDark = colorPreference === 'dark';

  // TEST MODE: Upgrade prompts disabled for testing
  const handleLockedFeature = (feature: string) => {
    // Temporarily disabled for testing - all features are free
    console.log('Feature unlocked for testing:', feature);
    toast({
      title: 'Feature Available',
      description: `${feature} is now available for testing.`,
    });
  };

  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);
    // Scroll to section
    const element = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ChaiBuilder SDK Editor - new modern editor
  if (USE_CHAI_BUILDER && isAuthenticated && project) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Editör yükleniyor...</p>
          </div>
        </div>
      }>
        <ChaiBuilderWrapper
          projectId={id || ''}
          projectName={project.name}
          initialBlocks={project.chai_blocks || []}
          initialTheme={project.chai_theme}
          onPublish={() => setPublishModalOpen(true)}
        />

        {/* Publish Modal */}
        <PublishModal
          isOpen={publishModalOpen}
          onClose={() => setPublishModalOpen(false)}
          projectId={id || ''}
          projectName={project.name}
          currentSubdomain={project.subdomain}
          isPublished={project.is_published}
          onPublished={(subdomain) => {
            setProject(prev => prev ? {
              ...prev,
              subdomain,
              is_published: true,
            } : null);
          }}
        />
      </Suspense>
    );
  }

  // GrapeJS Editor (legacy, currently disabled)
  if (USE_GRAPES_EDITOR && isAuthenticated && project.generated_content) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Editör yükleniyor...</p>
          </div>
        </div>
      }>
        <GrapesEditor
          projectId={id || ''}
          projectName={project.name}
          initialContent={project.generated_content}
          templateId={activeTemplateId}
          onSave={() => {
            toast({
              title: 'Kaydedildi',
              description: 'Değişiklikleriniz başarıyla kaydedildi.',
            });
          }}
          onPublish={() => setPublishModalOpen(true)}
        />

        {/* Publish Modal */}
        <PublishModal
          isOpen={publishModalOpen}
          onClose={() => setPublishModalOpen(false)}
          projectId={id || ''}
          projectName={project.name}
          currentSubdomain={project.subdomain}
          isPublished={project.is_published}
          onPublished={(subdomain) => {
            setProject(prev => prev ? {
              ...prev,
              subdomain,
              is_published: true,
            } : null);
          }}
        />
      </Suspense>
    );
  }

  // Legacy editor
  return (
    <div className="relative min-h-screen">
      {/* Template Preview Banner */}
      {isPreviewMode && (
        <TemplatePreviewBanner
          templateName={previewTemplateName}
          onApply={handleApplyPreviewTemplate}
          onCancel={handleCancelPreview}
          isApplying={isApplyingTemplate}
        />
      )}

      {/* Durable.co Style Editor Toolbar for authenticated users */}
      {isAuthenticated && !isPreviewMode && (
        <EditorToolbar
          projectName={project.name}
          currentSection={currentSection}
          onNavigate={handleNavigate}
          onCustomize={() => setCustomizeSidebarOpen(true)}
          onAddSection={() => setAddContentSidebarOpen(true)}
          onPageSettings={handleOpenPageSettings}
          onPageEditor={handleOpenPageEditor}
          onPreview={() => window.open(`/site/${project.subdomain}`, '_blank')}
          onPublish={() => setPublishModalOpen(true)}
          onDashboard={() => navigate('/dashboard')}
          isPublished={project.is_published}
          existingPages={['home', 'about', 'services', 'contact', 'blog']}
        />
      )}

      {/* Website Preview */}
      <div className={`${isAuthenticated && !isPreviewMode ? 'pt-14' : ''} ${!isAuthenticated ? 'overflow-hidden h-screen pointer-events-none' : ''}`}>
        {project.generated_content && (
          <WebsitePreview 
            content={project.generated_content} 
            colorPreference={colorPreference}
            templateId={activeTemplateId}
            isEditable={isAuthenticated && !isPreviewMode}
            onFieldEdit={handleFieldEdit}
            editorSelection={editorSelection}
            onEditorSelect={handleEditorSelect}
            sectionOrder={sectionOrder}
            onMoveSection={handleMoveSection}
            onDeleteSection={handleDeleteSection}
            sectionStyles={project.generated_content?.sectionStyles}
          />
        )}
      </div>

      {/* Auth Wall for non-authenticated users */}
      {!isAuthenticated && project.generated_content && (
        <AuthWallOverlay
          onGoogleSignIn={handleGoogleSignIn}
          onAppleSignIn={handleAppleSignIn}
          onEmailSignIn={() => setAuthModalOpen(true)}
          isLoading={false}
        />
      )}

      {/* Unified Editor Sidebar */}
      <EditorSidebar
        isOpen={!!editorSelection}
        onClose={handleEditorClose}
        selection={editorSelection}
        onFieldUpdate={handleFieldEdit}
        onRegenerateField={handleRegenerateField}
        onImageRegenerate={handleImageRegenerate}
        onImageChange={handleImageChange}
        onUpdateAltText={handleUpdateAltText}
        onUpdatePosition={handleUpdateImagePosition}
        isRegenerating={isRegeneratingImage}
        isRegeneratingField={isRegeneratingField}
        isDark={isDark}
        currentHeroVariant={project.generated_content?.sectionVariants?.hero || 'overlay'}
        onHeroVariantChange={handleHeroVariantChange}
        imageOptions={imageOptions}
        isLoadingImageOptions={isLoadingImageOptions}
        onSelectImageOption={handleSelectImageOption}
        currentSectionStyle={editorSelection?.sectionId ? project.generated_content?.sectionStyles?.[editorSelection.sectionId] : undefined}
        onStyleChange={handleSectionStyleChange}
      />

      {/* Email Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      {/* Publish Modal */}
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        projectId={id || ''}
        projectName={project.name}
        currentSubdomain={project.subdomain}
        isPublished={project.is_published}
        onPublished={(subdomain) => {
          setProject(prev => prev ? {
            ...prev,
            subdomain,
            is_published: true,
          } : null);
        }}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        feature={lockedFeature}
      />

      {/* Customize Sidebar */}
      <CustomizeSidebar
        isOpen={customizeSidebarOpen}
        onClose={() => setCustomizeSidebarOpen(false)}
        currentColors={{
          primary: project.generated_content?.siteSettings?.colors?.primary || '#3b82f6',
          secondary: project.generated_content?.siteSettings?.colors?.secondary || '#6366f1',
          accent: project.generated_content?.siteSettings?.colors?.accent || '#f59e0b',
        }}
        currentFonts={{
          heading: project.generated_content?.siteSettings?.fonts?.heading || 'Inter',
          body: project.generated_content?.siteSettings?.fonts?.body || 'Inter',
        }}
        currentCorners={project.generated_content?.siteSettings?.corners || 'rounded'}
        currentAnimations={project.generated_content?.siteSettings?.animations !== false}
        onColorChange={(colorType, value) => {
          handleSiteSettingsChange({
            ...project.generated_content?.siteSettings,
            colors: {
              ...project.generated_content?.siteSettings?.colors,
              [colorType]: value,
            },
          });
        }}
        onFontChange={(fontType, value) => {
          handleSiteSettingsChange({
            ...project.generated_content?.siteSettings,
            fonts: {
              ...project.generated_content?.siteSettings?.fonts,
              [fontType]: value,
            },
          });
        }}
        onCornersChange={(corners) => {
          handleSiteSettingsChange({
            ...project.generated_content?.siteSettings,
            corners,
          });
        }}
        onAnimationsChange={(animations) => {
          handleSiteSettingsChange({
            ...project.generated_content?.siteSettings,
            animations,
          });
        }}
        onRegenerateText={handleRegenerateAllText}
        onRegenerateWebsite={handleRegenerateWebsite}
        onEditBackground={handleEditHeroBackground}
        onChangeTemplate={() => setChangeTemplateModalOpen(true)}
      />

      {/* Change Template Modal */}
      <ChangeTemplateModal
        isOpen={changeTemplateModalOpen}
        onClose={() => setChangeTemplateModalOpen(false)}
        currentTemplateId={project.template_id || 'temp1'}
        onSelectTemplate={handleTemplateChange}
        onPreview={handleTemplatePreview}
      />

      {/* Page Settings Sidebar */}
      <PageSettingsSidebar
        isOpen={pageSettingsSidebarOpen}
        onClose={() => setPageSettingsSidebarOpen(false)}
        pageName={selectedPageForSettings}
        pageSettings={project.generated_content?.pageSettings?.[selectedPageForSettings]}
        onSettingsChange={(settings) => handlePageSettingsChange(selectedPageForSettings, settings)}
        onRegenerateTitle={handleRegeneratePageTitle}
      />

      {/* Add Content Sidebar */}
      <AddContentSidebar
        isOpen={addContentSidebarOpen}
        onClose={() => setAddContentSidebarOpen(false)}
        onAddPage={handleAddPage}
        onAddBlogPost={handleAddBlogPost}
        existingPages={['home', 'about', 'services', 'contact', 'blog']}
      />

      {/* Home Editor Sidebar */}
      {project.generated_content && (
        <HomeEditorSidebar
          isOpen={homeEditorSidebarOpen}
          onClose={() => setHomeEditorSidebarOpen(false)}
          content={project.generated_content}
          onSectionSelect={handleNavigate}
          onPageSettings={() => {
            setHomeEditorSidebarOpen(false);
            setPageSettingsSidebarOpen(true);
          }}
          onGenerateGalleryImages={() => id && generateImages(id)}
          isGeneratingGallery={generatingImages}
          sectionOrder={sectionOrder}
          onReorderSections={handleReorderSections}
        />
      )}
    </div>
  );
}
