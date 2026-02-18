import type { StyleProps } from './styleUtils';

export interface SiteSection {
  id: string;
  type: string;
  locked?: boolean;
  props: Record<string, any>;
  style?: StyleProps;
}

export interface SiteTheme {
  colors?: Record<string, any>;
  fonts?: { heading?: string; body?: string };
  borderRadius?: string;
}

export interface SectionComponentProps {
  section: SiteSection;
  isEditing?: boolean;
  onUpdate?: (props: Record<string, any>) => void;
  onImageChange?: (key: string, url: string) => void;
}
