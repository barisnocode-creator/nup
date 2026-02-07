import { 
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";

export type HeroOverlayProps = {
  styles: ChaiStyles;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  overlayOpacity: number;
};

const HeroOverlayBlock = (props: ChaiBlockComponentProps<HeroOverlayProps>) => {
  const { 
    blockProps, 
    title, 
    subtitle, 
    description, 
    buttonText,
    buttonLink,
    backgroundImage,
    overlayOpacity = 60,
    inBuilder 
  } = props;

  return (
    <section 
      {...blockProps} 
      className="relative min-h-[600px] flex items-center"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: backgroundImage 
            ? `url(${backgroundImage})` 
            : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
        }}
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Content */}
      <div className="relative container mx-auto px-6 py-20">
        <div className="max-w-2xl">
          {subtitle && (
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur text-white rounded-full text-sm font-medium mb-6">
              {subtitle}
            </span>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
            {title}
          </h1>
          
          <p className="text-xl text-white/80 mb-10 max-w-xl">
            {description}
          </p>

          {buttonText && (
            <a 
              href={inBuilder ? "#" : buttonLink}
              className="inline-flex items-center px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors text-lg"
            >
              {buttonText}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(HeroOverlayBlock, {
  type: "HeroOverlay",
  label: "Hero - Overlay",
  category: "hero",
  group: "sections",
  schema: {
    properties: {
      styles: StylesProp("min-h-[600px]"),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "Hayallerinizi Gerçeğe Dönüştürün",
      }),
      subtitle: builderProp({
        type: "string",
        title: "Alt Başlık",
        default: "Premium Hizmet",
      }),
      description: builderProp({
        type: "string",
        title: "Açıklama",
        default: "En iyi kalitede hizmet anlayışı ile müşterilerimize değer katıyoruz.",
        ui: { "ui:widget": "textarea" },
      }),
      buttonText: builderProp({
        type: "string",
        title: "Buton Metni",
        default: "İletişime Geçin",
      }),
      buttonLink: builderProp({
        type: "string",
        title: "Buton Linki",
        default: "#contact",
      }),
      backgroundImage: builderProp({
        type: "string",
        title: "Arka Plan Görseli",
        default: "",
        ui: { "ui:widget": "image" },
      }),
      overlayOpacity: builderProp({
        type: "number",
        title: "Overlay Opaklığı (%)",
        default: 60,
      }),
    },
  },
});

export { HeroOverlayBlock };
