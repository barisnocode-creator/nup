import { 
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";

export type HeroCenteredProps = {
  styles: ChaiStyles;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundImage: string;
  titleSize: string;
  textAlign: string;
};

const titleSizeMap: Record<string, string> = {
  lg: 'text-3xl md:text-4xl lg:text-5xl',
  xl: 'text-4xl md:text-5xl lg:text-6xl',
  '2xl': 'text-4xl md:text-5xl lg:text-7xl',
  '3xl': 'text-5xl md:text-6xl lg:text-8xl',
};

const HeroCenteredBlock = (props: ChaiBlockComponentProps<HeroCenteredProps>) => {
  const { 
    blockProps, 
    title, 
    subtitle, 
    description, 
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
    backgroundImage,
    titleSize = '2xl',
    textAlign = 'center',
    inBuilder 
  } = props;

  return (
    <section 
      {...blockProps} 
      className="relative min-h-[700px] flex items-center justify-center bg-background overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      )}

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className={`relative container mx-auto px-6 py-20 text-${textAlign}`}>
        {subtitle && (
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            {subtitle}
          </span>
        )}
        
        <h1 className={`${titleSizeMap[titleSize] || titleSizeMap['2xl']} font-bold leading-tight text-foreground max-w-4xl mx-auto mb-6`}>
          {title}
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {primaryButtonText && (
            <a 
              href={inBuilder ? "#" : primaryButtonLink}
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg"
            >
              {primaryButtonText}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
          
          {secondaryButtonText && (
            <a 
              href={inBuilder ? "#" : secondaryButtonLink}
              className="inline-flex items-center px-8 py-4 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors text-lg"
            >
              {secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(HeroCenteredBlock, {
  type: "HeroCentered",
  label: "Hero - Ortalanmış",
  category: "hero",
  group: "sections",
  schema: {
    properties: {
      styles: StylesProp("min-h-[700px]"),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "İşinizi Büyütmek İçin Buradayız",
      }),
      subtitle: builderProp({
        type: "string",
        title: "Alt Başlık", 
        default: "Dijital Çözümler",
      }),
      description: builderProp({
        type: "string",
        title: "Açıklama",
        default: "Modern teknoloji ve yaratıcı tasarım ile işletmenizi bir adım öne taşıyoruz.",
        ui: { "ui:widget": "textarea" },
      }),
      primaryButtonText: builderProp({
        type: "string",
        title: "Ana Buton Metni",
        default: "Ücretsiz Başlayın",
      }),
      primaryButtonLink: builderProp({
        type: "string",
        title: "Ana Buton Linki",
        default: "#contact",
      }),
      secondaryButtonText: builderProp({
        type: "string",
        title: "İkinci Buton Metni",
        default: "Daha Fazla Bilgi",
      }),
      secondaryButtonLink: builderProp({
        type: "string",
        title: "İkinci Buton Linki",
        default: "#about",
      }),
      backgroundImage: builderProp({
        type: "string",
        title: "Arka Plan Görseli",
        default: "",
        ui: { "ui:widget": "image" },
      }),
      titleSize: builderProp({
        type: "string",
        title: "Başlık Boyutu",
        default: "2xl",
        enum: ["lg", "xl", "2xl", "3xl"],
      }),
      textAlign: builderProp({
        type: "string",
        title: "Metin Hizalama",
        default: "center",
        enum: ["left", "center", "right"],
      }),
    },
  },
});

export { HeroCenteredBlock };
