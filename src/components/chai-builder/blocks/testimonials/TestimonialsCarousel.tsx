import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";
import { EditableChaiImage } from "../shared/EditableChaiImage";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export type TestimonialsCarouselProps = {
  styles: ChaiStyles;
  sectionTitle: string;
  sectionSubtitle: string;
  testimonials: Testimonial[];
} & CommonStyleProps;

const defaultTestimonials: Testimonial[] = [
  { name: "Ahmet Yılmaz", role: "CEO, Tech Corp", content: "Harika bir deneyim yaşadık. Profesyonel ekip ve mükemmel sonuçlar. Kesinlikle tavsiye ediyorum.", avatar: "" },
  { name: "Zeynep Kaya", role: "Pazarlama Müdürü", content: "Web sitemiz sayesinde satışlarımız %150 arttı. Çok memnunuz.", avatar: "" },
  { name: "Mehmet Demir", role: "Kurucu, StartupXYZ", content: "Hızlı teslimat ve kaliteli iş. Tekrar çalışmayı dört gözle bekliyoruz.", avatar: "" },
];

const TestimonialsCarouselBlock = (props: ChaiBlockComponentProps<TestimonialsCarouselProps>) => {
  const { 
    blockProps, 
    sectionTitle,
    sectionSubtitle,
    testimonials = defaultTestimonials,
    inBuilder,
    ...styleProps
  } = props;

  const s = resolveStyles(styleProps);

  return (
    <section {...blockProps} className={`${s.sectionPadding} bg-foreground text-background`}>
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          {sectionSubtitle && (
            <span className="inline-block px-4 py-2 bg-background/10 text-background/70 rounded-full text-sm font-medium mb-4 tracking-widest uppercase">
              {sectionSubtitle}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background font-serif">
            {sectionTitle}
          </h2>
        </div>

        {/* Testimonials */}
        <div className="space-y-0 divide-y divide-background/10">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="py-12 first:pt-0 last:pb-0">
              <div className="max-w-4xl mx-auto">
                {/* Large quote */}
                <p className="text-2xl md:text-3xl lg:text-4xl font-light text-background/90 leading-relaxed mb-8 font-serif italic">
                  "{testimonial.content}"
                </p>
                {/* Author */}
                <div className="flex items-center gap-4">
                  {testimonial.avatar ? (
                    <EditableChaiImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                      containerClassName="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                      inBuilder={inBuilder}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center text-background font-bold flex-shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-background">{testimonial.name}</div>
                    <div className="text-sm text-background/50">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(TestimonialsCarouselBlock, {
  type: "TestimonialsCarousel",
  label: "Müşteri Yorumları",
  category: "testimonials",
  group: "sections",
  inlineEditProps: ['sectionTitle', 'sectionSubtitle'],
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-muted/30"),
      sectionTitle: builderProp({
        type: "string",
        title: "Bölüm Başlığı",
        default: "Müşterilerimiz Ne Diyor?",
      }),
      sectionSubtitle: builderProp({
        type: "string",
        title: "Bölüm Alt Başlığı",
        default: "Referanslar",
      }),
      testimonials: builderProp({
        type: "array",
        title: "Müşteri Yorumları",
        default: defaultTestimonials as any,
      }),
      ...commonStyleSchemaProps({ bgColor: "muted", textAlign: "center" }),
    },
  },
});

export { TestimonialsCarouselBlock };
