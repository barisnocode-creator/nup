import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";
import { EditableChaiImage } from "../shared/EditableChaiImage";
import { TooltipProvider } from "@/components/ui/tooltip";

export type AboutSectionProps = {
  styles: ChaiStyles;
  title: string;
  subtitle: string;
  description: string;
  features: string;
  image: string;
  imagePosition: "left" | "right";
} & CommonStyleProps;

const AboutSectionBlock = (props: ChaiBlockComponentProps<AboutSectionProps>) => {
  const { 
    blockProps, 
    title, 
    subtitle,
    description, 
    features,
    image,
    imagePosition = "right",
    ...styleProps
  } = props;

  const s = resolveStyles(styleProps);
  const featureList = features ? features.split('\n').filter(f => f.trim()) : [];

  return (
    <TooltipProvider>
    <section 
      {...blockProps} 
      className={`${s.sectionPadding} ${s.bgColor}`}
    >
      <div className="container mx-auto px-6">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`space-y-6 ${imagePosition === 'left' ? 'lg:order-2' : ''}`}>
            {subtitle && (
              <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium ${s.subtitleTransform}`}>
                {subtitle}
              </span>
            )}
            <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} text-${s.textAlign}`}>
              {title}
            </h2>
            <p className={`${s.descSize} ${s.descColor} leading-relaxed`}>
              {description}
            </p>
            
            {featureList.length > 0 && (
              <ul className="space-y-3">
                {featureList.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`relative ${imagePosition === 'left' ? 'lg:order-1' : ''}`}>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-30" />
            <EditableChaiImage 
              src={image || "/placeholder.svg"} 
              alt={title}
              className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
              inBuilder={props.inBuilder}
            />
          </div>
        </div>
      </div>
    </section>
    </TooltipProvider>
  );
};

registerChaiBlock(AboutSectionBlock, {
  type: "AboutSection",
  label: "Hakkımızda",
  category: "about",
  group: "sections",
  inlineEditProps: ['title', 'subtitle', 'description'],
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-background"),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "Hakkımızda",
      }),
      subtitle: builderProp({
        type: "string",
        title: "Alt Başlık",
        default: "Biz Kimiz?",
      }),
      description: builderProp({
        type: "string",
        title: "Açıklama",
        default: "10 yılı aşkın deneyimimizle sektörde lider konumundayız. Müşteri memnuniyetini ön planda tutarak kaliteli hizmet sunmaya devam ediyoruz.",
        ui: { "ui:widget": "textarea" },
      }),
      features: builderProp({
        type: "string",
        title: "Özellikler (Her satıra bir özellik)",
        default: "10+ yıllık deneyim\nProfesyonel ekip\n7/24 destek\nMüşteri odaklı yaklaşım",
        ui: { "ui:widget": "textarea" },
      }),
      image: builderProp({
        type: "string",
        title: "Görsel",
        default: "",
        ui: { "ui:widget": "image" },
      }),
      imagePosition: builderProp({
        type: "string",
        title: "Görsel Konumu",
        default: "right",
        enum: ["left", "right"],
      }),
      ...commonStyleSchemaProps({ bgColor: "background", textAlign: "left" }),
    },
  },
});

export { AboutSectionBlock };
