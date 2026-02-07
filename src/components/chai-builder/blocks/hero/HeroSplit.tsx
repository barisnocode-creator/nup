import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { heroTitleSizeMap, resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";

export type HeroSplitProps = {
  styles: ChaiStyles;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
} & CommonStyleProps;

const HeroSplitBlock = (props: ChaiBlockComponentProps<HeroSplitProps>) => {
  const { 
    blockProps, 
    title, 
    subtitle, 
    description, 
    buttonText,
    buttonLink,
    image,
    inBuilder,
    ...styleProps
  } = props;

  const s = resolveStyles(styleProps);

  return (
    <section 
      {...blockProps} 
      className={`relative min-h-[600px] flex items-center ${s.bgColor} ${s.sectionPadding}`}
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {subtitle && (
              <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium ${s.subtitleTransform}`}>
                {subtitle}
              </span>
            )}
            <h1 className={`${s.titleSize(heroTitleSizeMap)} ${s.titleWeight} leading-tight ${s.titleColor} text-${s.textAlign}`}>
              {title}
            </h1>
            <p className={`${s.descSize} ${s.descColor} max-w-lg`}>
              {description}
            </p>
            {buttonText && (
              <a 
                href={inBuilder ? "#" : buttonLink}
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {buttonText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50" />
            <img 
              src={image || "/placeholder.svg"} 
              alt={title}
              className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(HeroSplitBlock, {
  type: "HeroSplit",
  label: "Hero - İki Kolon",
  category: "hero",
  group: "sections",
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-background"),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "Profesyonel Web Siteniz",
      }),
      subtitle: builderProp({
        type: "string",
        title: "Alt Başlık",
        default: "Hoş Geldiniz",
      }),
      description: builderProp({
        type: "string",
        title: "Açıklama",
        default: "İşletmenizi dijital dünyada en iyi şekilde temsil eden profesyonel web sitesi çözümleri sunuyoruz.",
        ui: { "ui:widget": "textarea" },
      }),
      buttonText: builderProp({
        type: "string",
        title: "Buton Metni",
        default: "Hemen Başlayın",
      }),
      buttonLink: builderProp({
        type: "string",
        title: "Buton Linki",
        default: "#contact",
      }),
      image: builderProp({
        type: "string",
        title: "Görsel",
        default: "",
        ui: { "ui:widget": "image" },
      }),
      ...commonStyleSchemaProps({ bgColor: "background", textAlign: "left" }),
    },
  },
});

export { HeroSplitBlock };
