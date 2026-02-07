import { 
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";

export type StatisticsCounterProps = {
  styles: ChaiStyles;
  title: string;
  subtitle: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
};

const StatisticsCounterBlock = (props: ChaiBlockComponentProps<StatisticsCounterProps>) => {
  const { 
    blockProps, 
    title,
    subtitle,
    stat1Value,
    stat1Label,
    stat2Value,
    stat2Label,
    stat3Value,
    stat3Label,
    stat4Value,
    stat4Label,
  } = props;

  const stats = [
    { value: stat1Value, label: stat1Label },
    { value: stat2Value, label: stat2Label },
    { value: stat3Value, label: stat3Label },
    { value: stat4Value, label: stat4Label },
  ].filter(s => s.value && s.label);

  return (
    <section 
      {...blockProps} 
      className="py-20 bg-primary text-primary-foreground"
    >
      <div className="container mx-auto px-6">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <span className="inline-block px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-medium mb-4">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className={`grid grid-cols-2 md:grid-cols-${stats.length} gap-8 text-center`}>
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(StatisticsCounterBlock, {
  type: "StatisticsCounter",
  label: "İstatistikler",
  category: "statistics",
  group: "sections",
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-primary"),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "",
      }),
      subtitle: builderProp({
        type: "string",
        title: "Alt Başlık",
        default: "",
      }),
      stat1Value: builderProp({
        type: "string",
        title: "İstatistik 1 - Değer",
        default: "500+",
      }),
      stat1Label: builderProp({
        type: "string",
        title: "İstatistik 1 - Etiket",
        default: "Mutlu Müşteri",
      }),
      stat2Value: builderProp({
        type: "string",
        title: "İstatistik 2 - Değer",
        default: "10+",
      }),
      stat2Label: builderProp({
        type: "string",
        title: "İstatistik 2 - Etiket",
        default: "Yıllık Deneyim",
      }),
      stat3Value: builderProp({
        type: "string",
        title: "İstatistik 3 - Değer",
        default: "1000+",
      }),
      stat3Label: builderProp({
        type: "string",
        title: "İstatistik 3 - Etiket",
        default: "Tamamlanan Proje",
      }),
      stat4Value: builderProp({
        type: "string",
        title: "İstatistik 4 - Değer",
        default: "24/7",
      }),
      stat4Label: builderProp({
        type: "string",
        title: "İstatistik 4 - Etiket",
        default: "Destek",
      }),
    },
  },
});

export { StatisticsCounterBlock };
