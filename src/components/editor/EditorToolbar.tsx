import { ArrowLeft, Eye, Pencil, Palette, Globe, Loader2, Undo2, Monitor, Tablet, Smartphone, Save, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  projectName: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  onOpenCustomize: () => void;
  customizePanelOpen: boolean;
  onPublish: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  canUndo: boolean;
  onUndo: () => void;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  onChangeDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  activeTemplateName?: string;
  onSave?: () => void;
  isPublished?: boolean;
}

export function EditorToolbar({
  projectName, isEditing, onToggleEdit, onOpenCustomize, customizePanelOpen,
  onPublish, isSaving, hasUnsavedChanges, canUndo, onUndo, previewDevice, onChangeDevice,
  activeTemplateName, onSave, isPublished = false,
}: EditorToolbarProps) {
  const navigate = useNavigate();

  const devices = [
    { id: 'desktop' as const, icon: Monitor, title: 'Masaüstü' },
    { id: 'tablet' as const, icon: Tablet, title: 'Tablet' },
    { id: 'mobile' as const, icon: Smartphone, title: 'Mobil' },
  ];

  return (
    <div className="h-14 shrink-0 flex items-center border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 z-50 px-3 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 active:scale-95" title="Dashboard'a dön">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[160px]">{projectName}</span>
        {activeTemplateName && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-[10px] font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            {activeTemplateName}
          </span>
        )}
        <div className="h-5 w-px bg-gray-200 dark:bg-zinc-700" />
        {canUndo && (
          <button onClick={onUndo} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 active:scale-95" title="Geri Al">
            <Undo2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Center: Edit/Preview toggle + Device toggler */}
      <div className="flex-1 flex items-center justify-center gap-3">
        <div className="flex items-center gap-0.5 p-1 rounded-xl bg-gray-100 dark:bg-zinc-800">
          <button
            onClick={() => !isEditing && onToggleEdit()}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
              isEditing ? 'text-gray-900 dark:text-white bg-white dark:bg-zinc-700 shadow-sm border border-gray-200 dark:border-zinc-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <Pencil className="w-3.5 h-3.5" /> Düzenle
          </button>
          <button
            onClick={() => isEditing && onToggleEdit()}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
              !isEditing ? 'text-gray-900 dark:text-white bg-white dark:bg-zinc-700 shadow-sm border border-gray-200 dark:border-zinc-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <Eye className="w-3.5 h-3.5" /> Önizleme
          </button>
        </div>

        {/* Device Toggler */}
        <div className="flex items-center gap-0.5 p-1 rounded-xl bg-gray-100 dark:bg-zinc-800">
          {devices.map(({ id, icon: Icon, title }) => (
            <button
              key={id}
              onClick={() => onChangeDevice(id)}
              className={cn('p-1.5 rounded-lg transition-all duration-200',
                previewDevice === id ? 'text-gray-900 dark:text-white bg-white dark:bg-zinc-700 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              )}
              title={title}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCustomize}
          className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.97]',
            customizePanelOpen ? 'text-gray-900 dark:text-white bg-white dark:bg-zinc-700 shadow-sm border border-gray-200 dark:border-zinc-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
          )}
        >
          <Palette className="w-3.5 h-3.5" /> Özelleştir
        </button>

        {hasUnsavedChanges && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.97]',
              isSaving
                ? 'text-gray-400 bg-gray-100 dark:bg-zinc-800 cursor-not-allowed'
                : 'text-green-700 bg-green-50 hover:bg-green-100 dark:text-green-400 dark:bg-green-900/20 dark:hover:bg-green-900/30'
            )}
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        )}

        <button
          onClick={onPublish}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 shadow-md',
            isPublished
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
          )}
        >
          {isPublished ? <RefreshCw className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
          {isPublished ? 'Güncelle' : 'Yayınla'}
        </button>
      </div>
    </div>
  );
}
