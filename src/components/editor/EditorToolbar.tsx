import { ArrowLeft, Eye, Pencil, Palette, Globe, Loader2, Undo2 } from 'lucide-react';
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
}

export function EditorToolbar({
  projectName,
  isEditing,
  onToggleEdit,
  onOpenCustomize,
  customizePanelOpen,
  onPublish,
  isSaving,
  hasUnsavedChanges,
  canUndo,
  onUndo,
}: EditorToolbarProps) {
  const navigate = useNavigate();

  return (
    <div className="h-14 shrink-0 flex items-center border-b border-border/30 bg-background/95 backdrop-blur-xl z-50 px-3 shadow-sm">
      {/* Left: Back + Project name */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl text-muted-foreground hover:bg-accent/80 hover:text-foreground transition-all duration-200 active:scale-95"
          title="Dashboard'a dön"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-foreground truncate max-w-[160px]">{projectName}</span>
        <div className="h-5 w-px bg-border/40" />

        {/* Undo */}
        {canUndo && (
          <button
            onClick={onUndo}
            className="p-2 rounded-xl text-muted-foreground hover:bg-accent/80 hover:text-foreground transition-all duration-200 active:scale-95"
            title="Geri Al"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Center: Edit/Preview toggle */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-0.5 p-1 rounded-xl bg-muted/50">
          <button
            onClick={() => !isEditing && onToggleEdit()}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
              isEditing ? 'text-foreground bg-background shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground/80'
            )}
          >
            <Pencil className="w-3.5 h-3.5" />
            Düzenle
          </button>
          <button
            onClick={() => isEditing && onToggleEdit()}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
              !isEditing ? 'text-foreground bg-background shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground/80'
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Önizleme
          </button>
        </div>
      </div>

      {/* Right: Customize + Save status + Publish */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCustomize}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.97]',
            customizePanelOpen ? 'text-foreground bg-background shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground/80'
          )}
        >
          <Palette className="w-3.5 h-3.5" />
          Özelleştir
        </button>

        {/* Save indicator */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Kaydediliyor...</span>
            </>
          ) : hasUnsavedChanges ? (
            <span className="text-destructive">●</span>
          ) : null}
        </div>

        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-md shadow-primary/20"
        >
          <Globe className="w-3.5 h-3.5" />
          Yayınla
        </button>
      </div>
    </div>
  );
}
