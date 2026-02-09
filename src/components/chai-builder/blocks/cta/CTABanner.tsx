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
    <section {...blockProps} className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        <div className={`max-w-4xl mx-auto text-${s.textAlign}`}>
          <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} mb-6`}>
            {title}
          </h2>
          <p className={`${s.descSize} ${s.descColor} mb-10 max-w-2xl mx-auto`}>
            {description}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {buttonText && (
              <a 
                href={inBuilder ? "#" : buttonLink}
                className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors text-lg"
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
                className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-primary-foreground rounded-lg font-medium hover:bg-white/10 transition-colors text-lg"
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
