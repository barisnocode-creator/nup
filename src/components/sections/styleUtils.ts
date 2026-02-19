// ── Title Size Maps ──
export const titleSizeMap: Record<string, string> = {
  lg: 'text-2xl md:text-3xl lg:text-4xl',
  xl: 'text-3xl md:text-4xl lg:text-5xl',
  '2xl': 'text-3xl md:text-4xl lg:text-5xl',
  '3xl': 'text-4xl md:text-5xl lg:text-6xl',
};

export const heroTitleSizeMap: Record<string, string> = {
  lg: 'text-3xl md:text-4xl lg:text-5xl',
  xl: 'text-4xl md:text-5xl lg:text-6xl',
  '2xl': 'text-4xl md:text-5xl lg:text-6xl',
  '3xl': 'text-5xl md:text-6xl lg:text-7xl',
};

export const heroCenteredTitleSizeMap: Record<string, string> = {
  lg: 'text-3xl md:text-4xl lg:text-5xl',
  xl: 'text-4xl md:text-5xl lg:text-6xl',
  '2xl': 'text-4xl md:text-5xl lg:text-7xl',
  '3xl': 'text-5xl md:text-6xl lg:text-8xl',
};

export const titleWeightMap: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

export const titleColorMap: Record<string, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  white: 'text-white',
  muted: 'text-muted-foreground',
};

export const descColorMap: Record<string, string> = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  dark: 'text-foreground',
  muted: 'text-muted-foreground/70',
  white: 'text-white/80',
};

export const descSizeMap: Record<string, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export const bgColorMap: Record<string, string> = {
  transparent: 'bg-transparent',
  background: 'bg-background',
  muted: 'bg-muted/30',
  card: 'bg-card',
  primary: 'bg-primary',
  secondary: 'bg-secondary/30',
};

export const paddingMap: Record<string, string> = {
  sm: 'py-12',
  md: 'py-20',
  lg: 'py-28',
  xl: 'py-36',
};

export const subtitleTransformMap: Record<string, string> = {
  normal: 'normal-case',
  uppercase: 'uppercase tracking-wider',
};

export interface StyleProps {
  titleSize?: string;
  titleWeight?: string;
  titleColor?: string;
  textAlign?: string;
  descSize?: string;
  descColor?: string;
  subtitleTransform?: string;
  bgColor?: string;
  sectionPadding?: string;
  customBgColor?: string;
  customTitleColor?: string;
}

export function resolveStyles(props: StyleProps) {
  return {
    titleSize: (map?: Record<string, string>) => (map ?? titleSizeMap)[props.titleSize || '2xl'] || titleSizeMap['2xl'],
    titleWeight: titleWeightMap[props.titleWeight || 'bold'] || 'font-bold',
    titleColor: titleColorMap[props.titleColor || 'default'] || 'text-foreground',
    descSize: descSizeMap[props.descSize || 'lg'] || 'text-lg',
    descColor: descColorMap[props.descColor || 'default'] || 'text-muted-foreground',
    subtitleTransform: subtitleTransformMap[props.subtitleTransform || 'normal'] || 'normal-case',
    bgColor: bgColorMap[props.bgColor || 'background'] || 'bg-background',
    sectionPadding: paddingMap[props.sectionPadding || 'md'] || 'py-20',
    textAlign: props.textAlign || 'center',
  };
}

// Default style values per section type
export const defaultStyleProps: Record<string, Partial<StyleProps>> = {
  'hero-centered': { bgColor: 'background', textAlign: 'center' },
  'hero-split': { bgColor: 'background', textAlign: 'left' },
  'hero-overlay': { titleColor: 'white', descColor: 'white', textAlign: 'left' },
  'services-grid': { bgColor: 'background', textAlign: 'center' },
  'about-section': { bgColor: 'background', textAlign: 'left' },
  'statistics-counter': { bgColor: 'primary', titleColor: 'white', descColor: 'white', textAlign: 'center' },
  'testimonials-carousel': { bgColor: 'muted', textAlign: 'center' },
  'contact-form': { bgColor: 'background', textAlign: 'left' },
  'cta-banner': { bgColor: 'primary', titleColor: 'white', descColor: 'white', textAlign: 'center' },
  'faq-accordion': { bgColor: 'background', textAlign: 'center' },
  'image-gallery': { bgColor: 'background', textAlign: 'center' },
  'pricing-table': { bgColor: 'secondary', textAlign: 'center' },
  'appointment-booking': { bgColor: 'muted', textAlign: 'center' },
  'natural-header': { bgColor: 'transparent', sectionPadding: 'sm' },
  'natural-hero': { bgColor: 'muted', textAlign: 'left', titleSize: '3xl' },
  'natural-intro': { bgColor: 'transparent', textAlign: 'center', sectionPadding: 'sm' },
  'natural-article-grid': { bgColor: 'transparent', textAlign: 'left', sectionPadding: 'sm' },
  'natural-newsletter': { bgColor: 'card', textAlign: 'center', titleSize: '3xl' },
  'natural-footer': { bgColor: 'transparent', sectionPadding: 'sm' },
};
