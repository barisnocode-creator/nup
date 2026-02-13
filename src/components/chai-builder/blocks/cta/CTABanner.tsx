import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";

export type CTABannerProps = {
  styles: ChaiStyles;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
} & CommonStyleProps;

const CTABannerBlock = (props: ChaiBlockComponentProps<CTABannerProps>) => {
  const { 
    blockProps, 
    title,
    description,
    buttonText,
    buttonLink,
    secondaryButtonText,
    secondaryButtonLink,
    inBuilder,
    ...styleProps
  } = props;

  const s = resolveStyles(styleProps);

  return (
    <section {...blockProps} className={`${s.sectionPadding} bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden`}>
      {/* Decorative blur circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

      <div className="relative container mx-auto px-6">
        <div className={`max-w-4xl mx-auto text-${s.textAlign}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-serif">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {description}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {buttonText && (
              <a 
                href={inBuilder ? "#" : buttonLink}
                className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors text-lg shadow-xl"
              >
                {buttonText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
            
            {secondaryButtonText && (
              <a 
                href={inBuilder ? "#" : secondaryButtonLink}
                className="inline-flex items-center px-8 py-4 backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors text-lg"
              >
                {secondaryButtonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(CTABannerBlock, {
  type: "CTABanner",
  label: "CTA Banner",
  category: "cta",
  group: "sections",
  inlineEditProps: ['title', 'description', 'buttonText', 'secondaryButtonText'],
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-primary"),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "Projenizi Başlatmaya Hazır mısınız?",
      }),
      description: builderProp({
        type: "string",
        title: "Açıklama",
        default: "Hemen bizimle iletişime geçin ve hayallerinizi gerçeğe dönüştürelim.",
        ui: { "ui:widget": "textarea" },
      }),
      buttonText: builderProp({
        type: "string",
        title: "Ana Buton Metni",
        default: "Hemen Başlayın",
      }),
      buttonLink: builderProp({
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
      ...commonStyleSchemaProps({ bgColor: "primary", titleColor: "white", descColor: "white", textAlign: "center" }),
    },
  },
});

export { CTABannerBlock };
