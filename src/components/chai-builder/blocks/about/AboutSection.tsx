import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";
import { EditableChaiImage } from "../shared/EditableChaiImage";

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
    <section 
      {...blockProps} 
      className={`${s.sectionPadding} ${s.bgColor}`}
    >
      <div className="container mx-auto px-6">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`space-y-6 ${imagePosition === 'left' ? 'lg:order-2' : ''}`}>
            {subtitle && (
              <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium ${s.subtitleTransform}`}>
                {subtitle}
              </span>
            )}
            <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} text-${s.textAlign} font-serif`}>
              {title}
            </h2>
            <p className={`${s.descSize} ${s.descColor} leading-relaxed`}>
              {description}
            </p>
            
            {featureList.length > 0 && (
              <ul className="space-y-4 pt-2">
                {featureList.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`relative ${imagePosition === 'left' ? 'lg:order-1' : ''}`}>
            {/* Decorative gradient blob */}
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/15 to-accent/15 rounded-[2rem] blur-3xl opacity-50" />
            <EditableChaiImage 
              src={image || "/placeholder.svg"} 
              alt={title}
              className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
              inBuilder={props.inBuilder}
            />
          </div>
        </div>
      </div>
    </section>
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
