import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import grapesjs, { Editor } from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsPluginForms from 'grapesjs-plugin-forms';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Undo2, 
  Redo2, 
  Eye, 
  Save, 
  Globe, 
  Monitor, 
  Tablet, 
  Smartphone,
  Layers,
  Grid3X3,
  Palette,
  Settings,
  ChevronLeft
} from 'lucide-react';
import { supabaseStoragePlugin, convertToGrapesFormat } from './plugins/supabaseStorage';
import { turkishLocalePlugin } from './plugins/turkishLocale';
import { templateBlocksPlugin } from './plugins/templateBlocks';
import { useToast } from '@/hooks/use-toast';
import './styles/grapes-custom.css';

interface GrapesEditorProps {
  projectId: string;
  projectName: string;
  initialContent: any;
  templateId: string;
  onSave?: () => void;
  onPublish: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type PanelType = 'blocks' | 'layers' | 'styles' | 'traits';

export function GrapesEditor({
  projectId,
  projectName,
  initialContent,
  templateId,
  onSave,
  onPublish,
}: GrapesEditorProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<DeviceType>('desktop');
  const [activePanel, setActivePanel] = useState<PanelType>('blocks');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize GrapeJS editor
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      height: '100%',
      width: 'auto',
      fromElement: false,
      storageManager: {
        type: 'supabase',
        autosave: true,
        autoload: false,
        stepsBeforeSave: 3,
      },
      deviceManager: {
        devices: [
          { id: 'desktop', name: 'Masaüstü', width: '' },
          { id: 'tablet', name: 'Tablet', width: '768px', widthMedia: '992px' },
          { id: 'mobile', name: 'Mobil', width: '375px', widthMedia: '480px' },
        ],
      },
      layerManager: {
        appendTo: '#layers-container',
      },
      blockManager: {
        appendTo: '#blocks-container',
      },
      styleManager: {
        appendTo: '#styles-container',
        sectors: [
          {
            name: 'Genel',
            open: true,
            buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
          },
          {
            name: 'Boyut',
            open: false,
            buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
          },
          {
            name: 'Yazı Tipi',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
          },
          {
            name: 'Dekorasyon',
            open: false,
            buildProps: ['background-color', 'border', 'border-radius', 'box-shadow', 'background'],
          },
          {
            name: 'Ekstra',
            open: false,
            buildProps: ['opacity', 'transition', 'transform'],
          },
        ],
      },
      traitManager: {
        appendTo: '#traits-container',
      },
      selectorManager: {
        appendTo: '#selectors-container',
      },
      panels: {
        defaults: [],
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
          'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
        ],
      },
      plugins: [
        gjsBlocksBasic,
        gjsPresetWebpage,
        gjsPluginForms,
      ],
      pluginsOpts: {
        [gjsBlocksBasic as any]: {
          blocks: ['column1', 'column2', 'column3', 'text', 'link', 'image', 'video', 'map'],
          flexGrid: true,
          category: 'Temel',
        },
        [gjsPresetWebpage as any]: {
          blocksBasicOpts: { flexGrid: true },
          modalImportTitle: 'HTML İçe Aktar',
          modalImportButton: 'İçe Aktar',
          modalImportLabel: '',
        },
        [gjsPluginForms as any]: {
          category: 'Formlar',
        },
      },
    });

    // Apply custom plugins
    supabaseStoragePlugin(editor, { projectId });
    turkishLocalePlugin(editor);
    templateBlocksPlugin(editor);

    // Load initial content
    const grapesData = convertToGrapesFormat(initialContent, templateId);
    if (grapesData && Object.keys(grapesData).length > 0) {
      editor.loadProjectData(grapesData);
    }

    // Track changes
    editor.on('change:changesCount', () => {
      setHasUnsavedChanges(true);
    });

    // Save event
    editor.on('storage:store', () => {
      setHasUnsavedChanges(false);
      toast({
        title: 'Kaydedildi',
        description: 'Değişiklikleriniz kaydedildi.',
      });
    });

    // Error handling
    editor.on('storage:error', (error: any) => {
      console.error('Storage error:', error);
      toast({
        title: 'Kaydetme hatası',
        description: 'Değişiklikler kaydedilemedi.',
        variant: 'destructive',
      });
    });

    editorRef.current = editor;
    setIsReady(true);

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, [projectId, templateId, initialContent, toast]);

  // Handle device change
  const handleDeviceChange = useCallback((device: DeviceType) => {
    editorRef.current?.setDevice(device);
    setCurrentDevice(device);
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!editorRef.current) return;
    
    setIsSaving(true);
    try {
      await editorRef.current.store();
      onSave?.();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Kaydetme hatası',
        description: 'Değişiklikler kaydedilemedi.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [onSave, toast]);

  // Handle preview
  const handlePreview = useCallback(() => {
    editorRef.current?.runCommand('preview');
  }, []);

  // Handle undo/redo
  const handleUndo = useCallback(() => {
    editorRef.current?.runCommand('core:undo');
  }, []);

  const handleRedo = useCallback(() => {
    editorRef.current?.runCommand('core:redo');
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Toolbar */}
      <div className="h-14 border-b bg-background flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <Home className="w-4 h-4" />
          </Button>
          
          <div className="h-6 w-px bg-border mx-2" />
          
          <span className="font-medium text-sm truncate max-w-[200px]">
            {projectName}
          </span>
          
          {hasUnsavedChanges && (
            <span className="text-xs text-muted-foreground">(kaydedilmedi)</span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Device Selector */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={currentDevice === 'desktop' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleDeviceChange('desktop')}
              className="h-7 w-7 p-0"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={currentDevice === 'tablet' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleDeviceChange('tablet')}
              className="h-7 w-7 p-0"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={currentDevice === 'mobile' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleDeviceChange('mobile')}
              className="h-7 w-7 p-0"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="h-6 w-px bg-border mx-2" />
          
          {/* Undo/Redo */}
          <Button variant="ghost" size="sm" onClick={handleUndo} className="h-8 w-8 p-0">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRedo} className="h-8 w-8 p-0">
            <Redo2 className="w-4 h-4" />
          </Button>
          
          <div className="h-6 w-px bg-border mx-2" />
          
          {/* Actions */}
          <Button variant="outline" size="sm" onClick={handlePreview} className="gap-2">
            <Eye className="w-4 h-4" />
            Önizle
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
          <Button size="sm" onClick={onPublish} className="gap-2">
            <Globe className="w-4 h-4" />
            Yayınla
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Blocks/Layers */}
        <div className="w-64 border-r bg-muted/30 flex flex-col flex-shrink-0">
          {/* Panel Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActivePanel('blocks')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activePanel === 'blocks' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid3X3 className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => setActivePanel('layers')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activePanel === 'layers' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="w-4 h-4 mx-auto" />
            </button>
          </div>
          
          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            <div id="blocks-container" className={activePanel === 'blocks' ? '' : 'hidden'} />
            <div id="layers-container" className={activePanel === 'layers' ? '' : 'hidden'} />
          </div>
        </div>
        
        {/* Canvas */}
        <div className="flex-1 bg-muted/50 overflow-hidden">
          <div ref={containerRef} className="h-full w-full" />
        </div>
        
        {/* Right Panel - Styles/Traits */}
        <div className="w-72 border-l bg-background flex flex-col flex-shrink-0">
          {/* Panel Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActivePanel('styles')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activePanel === 'styles' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Palette className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => setActivePanel('traits')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activePanel === 'traits' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Settings className="w-4 h-4 mx-auto" />
            </button>
          </div>
          
          {/* Selector Container */}
          <div id="selectors-container" className="border-b p-2" />
          
          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            <div id="styles-container" className={activePanel === 'styles' ? '' : 'hidden'} />
            <div id="traits-container" className={activePanel === 'traits' ? '' : 'hidden'} />
          </div>
        </div>
      </div>
    </div>
  );
}
