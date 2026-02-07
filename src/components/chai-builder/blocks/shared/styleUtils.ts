import { builderProp } from "@chaibuilder/sdk/runtime";

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

// ── Title Weight ──
export const titleWeightMap: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

// ── Color Maps ──
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

// ── Description Size ──
export const descSizeMap: Record<string, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

// ── Background Color ──
export const bgColorMap: Record<string, string> = {
  transparent: 'bg-transparent',
  background: 'bg-background',
  muted: 'bg-muted/30',
  card: 'bg-card',
  primary: 'bg-primary',
  secondary: 'bg-secondary/30',
};

// ── Section Padding ──
export const paddingMap: Record<string, string> = {
  sm: 'py-12',
  md: 'py-20',
  lg: 'py-28',
  xl: 'py-36',
};

// ── Subtitle Transform ──
export const subtitleTransformMap: Record<string, string> = {
  normal: 'normal-case',
  uppercase: 'uppercase tracking-wider',
};

// ── Common Style Props Type ──
export interface CommonStyleProps {
  titleSize: string;
  titleWeight: string;
  titleColor: string;
  textAlign: string;
  descSize: string;
  descColor: string;
  subtitleTransform: string;
  bgColor: string;
  sectionPadding: string;
}

// ── Common Builder Props for Schema ──
export function commonStyleSchemaProps(defaults?: Partial<{
  titleWeight: string;
  titleColor: string;
  descSize: string;
  descColor: string;
  subtitleTransform: string;
  bgColor: string;
  sectionPadding: string;
  textAlign: string;
  titleSize: string;
}>) {
  return {
    titleSize: builderProp({
      type: "string",
      title: "Başlık Boyutu",
      default: defaults?.titleSize ?? "2xl",
      enum: ["lg", "xl", "2xl", "3xl"],
    }),
    titleWeight: builderProp({
      type: "string",
      title: "Başlık Kalınlığı",
      default: defaults?.titleWeight ?? "bold",
      enum: ["normal", "medium", "semibold", "bold", "extrabold"],
    }),
    titleColor: builderProp({
      type: "string",
      title: "Başlık Rengi",
      default: defaults?.titleColor ?? "default",
      enum: ["default", "primary", "secondary", "white", "muted"],
    }),
    textAlign: builderProp({
      type: "string",
      title: "Metin Hizalama",
      default: defaults?.textAlign ?? "center",
      enum: ["left", "center", "right"],
    }),
    descSize: builderProp({
      type: "string",
      title: "Açıklama Boyutu",
      default: defaults?.descSize ?? "lg",
      enum: ["sm", "base", "lg", "xl"],
    }),
    descColor: builderProp({
      type: "string",
      title: "Açıklama Rengi",
      default: defaults?.descColor ?? "default",
      enum: ["default", "primary", "dark", "muted", "white"],
    }),
    subtitleTransform: builderProp({
      type: "string",
      title: "Alt Başlık Stili",
      default: defaults?.subtitleTransform ?? "normal",
      enum: ["normal", "uppercase"],
    }),
    bgColor: builderProp({
      type: "string",
      title: "Arka Plan Rengi",
      default: defaults?.bgColor ?? "background",
      enum: ["transparent", "background", "muted", "card", "primary", "secondary"],
    }),
    sectionPadding: builderProp({
      type: "string",
      title: "Bölüm Boşluğu",
      default: defaults?.sectionPadding ?? "md",
      enum: ["sm", "md", "lg", "xl"],
    }),
  };
}

// ── Helper to get resolved classes ──
export function resolveStyles(props: Partial<CommonStyleProps>) {
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
