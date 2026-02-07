import { 
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export type ServicesGridProps = {
  styles: ChaiStyles;
  sectionTitle: string;
  sectionSubtitle: string;
  sectionDescription: string;
  services: ServiceItem[];
  titleSize: string;
  textAlign: string;
};

const defaultServices: ServiceItem[] = [
  {
    icon: "🚀",
    title: "Hızlı Teslimat",
    description: "Projelerinizi belirlenen sürede tamamlıyor, zamanında teslim ediyoruz."
  },
  {
    icon: "💡",
    title: "Yaratıcı Çözümler",
    description: "Her proje için özel ve yaratıcı çözümler sunuyoruz."
  },
  {
    icon: "🛡️",
    title: "Güvenilir Hizmet",
    description: "Kaliteli ve güvenilir hizmet anlayışı ile çalışıyoruz."
  },
  {
    icon: "📱",
    title: "Mobil Uyumlu",
    description: "Tüm cihazlarda mükemmel görünen tasarımlar oluşturuyoruz."
  },
  {
    icon: "🔧",
    title: "Teknik Destek",
    description: "7/24 teknik destek ile her zaman yanınızdayız."
  },
  {
    icon: "📈",
    title: "SEO Optimizasyonu",
    description: "Arama motorlarında üst sıralarda yer almanızı sağlıyoruz."
  },
];

const titleSizeMap: Record<string, string> = {
  lg: 'text-2xl md:text-3xl lg:text-4xl',
  xl: 'text-3xl md:text-4xl lg:text-5xl',
  '2xl': 'text-3xl md:text-4xl lg:text-5xl',
  '3xl': 'text-4xl md:text-5xl lg:text-6xl',
};

const ServicesGridBlock = (props: ChaiBlockComponentProps<ServicesGridProps>) => {
  const { 
    blockProps, 
    sectionTitle,
    sectionSubtitle,
    sectionDescription,
    services = defaultServices,
    titleSize = '2xl',
    textAlign = 'center',
  } = props;

  return (
    <section {...blockProps} className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-${textAlign} max-w-3xl mx-auto mb-16`}>
          {sectionSubtitle && (
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {sectionSubtitle}
            </span>
          )}
          <h2 className={`${titleSizeMap[titleSize] || titleSizeMap['2xl']} font-bold text-foreground mb-6`}>
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="text-lg text-muted-foreground">
              {sectionDescription}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(ServicesGridBlock, {
  type: "ServicesGrid",
  label: "Hizmetler - Grid",
  category: "services",
  group: "sections",
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-background"),
      sectionTitle: builderProp({
        type: "string",
        title: "Bölüm Başlığı",
        default: "Hizmetlerimiz",
      }),
      sectionSubtitle: builderProp({
        type: "string",
        title: "Bölüm Alt Başlığı",
        default: "Neler Yapıyoruz",
      }),
      sectionDescription: builderProp({
        type: "string",
        title: "Bölüm Açıklaması",
        default: "Size en iyi hizmeti sunmak için buradayız.",
        ui: { "ui:widget": "textarea" },
      }),
      services: builderProp({
        type: "array",
        title: "Hizmetler",
        default: defaultServices as any,
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

export { ServicesGridBlock };
