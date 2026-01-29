import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';

export type HeroVariant = 'split' | 'overlay' | 'centered' | 'gradient';

export interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage?: string;
  heroImagePosition?: { x: number; y: number };
  isDark: boolean;
  isNeutral: boolean;
  isEditable: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  // Legacy props
  selectedImage?: ImageData | null;
  onImageSelect?: (data: ImageData) => void;
}
