import { 
  registerChaiBlock,
  ChaiBlockComponentProps,
  ChaiStyles,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";

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
};

const defaultTestimonials: Testimonial[] = [
  {
    name: "Ahmet Yılmaz",
    role: "CEO, Tech Corp",
    content: "Harika bir deneyim yaşadık. Profesyonel ekip ve mükemmel sonuçlar. Kesinlikle tavsiye ediyorum.",
    avatar: "",
  },
  {
    name: "Zeynep Kaya",
    role: "Pazarlama Müdürü",
    content: "Web sitemiz sayesinde satışlarımız %150 arttı. Çok memnunuz.",
    avatar: "",
  },
  {
    name: "Mehmet Demir",
    role: "Kurucu, StartupXYZ",
    content: "Hızlı teslimat ve kaliteli iş. Tekrar çalışmayı dört gözle bekliyoruz.",
    avatar: "",
  },
];

const TestimonialsCarouselBlock = (props: ChaiBlockComponentProps<TestimonialsCarouselProps>) => {
  const { 
    blockProps, 
    sectionTitle,
    sectionSubtitle,
    testimonials = defaultTestimonials,
  } = props;

  return (
    <section {...blockProps} className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {sectionSubtitle && (
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {sectionSubtitle}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {sectionTitle}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              {/* Quote */}
              <div className="text-4xl text-primary/20 mb-4">"</div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {testimonial.content}
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
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
    },
  },
});

export { TestimonialsCarouselBlock };
