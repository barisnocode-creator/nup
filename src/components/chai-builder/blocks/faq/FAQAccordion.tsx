import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export type FAQAccordionProps = {
  styles: ChaiStyles;
  sectionTitle: string;
  sectionSubtitle: string;
  items: FAQItem[];
} & CommonStyleProps;

const defaultItems: FAQItem[] = [
  { question: "Hizmetleriniz neleri kapsıyor?", answer: "Web sitesi tasarımı, geliştirme, SEO optimizasyonu, bakım ve teknik destek hizmetleri sunuyoruz." },
  { question: "Bir proje ne kadar sürede tamamlanır?", answer: "Projenin kapsamına bağlı olarak genellikle 2-6 hafta arasında teslim ediyoruz." },
  { question: "Ödeme seçenekleri nelerdir?", answer: "Kredi kartı, banka havalesi ve taksitli ödeme seçenekleri sunuyoruz." },
  { question: "Proje sonrası destek sağlıyor musunuz?", answer: "Evet, tüm projelerimize 1 yıl ücretsiz teknik destek dahildir." },
];

const FAQAccordionBlock = (props: ChaiBlockComponentProps<FAQAccordionProps>) => {
  const { 
    blockProps, 
    sectionTitle,
    sectionSubtitle,
    items = defaultItems,
    ...styleProps
  } = props;

  const s = resolveStyles(styleProps);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section {...blockProps} className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        <div className={`text-${s.textAlign} max-w-3xl mx-auto mb-16`}>
          {sectionSubtitle && (
            <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 ${s.subtitleTransform}`}>
              {sectionSubtitle}
            </span>
          )}
          <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor}`}>
            {sectionTitle}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, index) => (
            <div key={index} className="rounded-xl border border-border overflow-hidden">
              <button
                className="w-full px-6 py-5 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-foreground pr-4">{item.question}</span>
                <span className={`flex-shrink-0 text-2xl text-primary transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-5 text-muted-foreground">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(FAQAccordionBlock, {
  type: "FAQAccordion",
  label: "SSS - Akordeon",
  category: "faq",
  group: "sections",
  inlineEditProps: ['sectionTitle', 'sectionSubtitle'],
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-background"),
      sectionTitle: builderProp({
        type: "string",
        title: "Bölüm Başlığı",
        default: "Sıkça Sorulan Sorular",
      }),
      sectionSubtitle: builderProp({
        type: "string",
        title: "Bölüm Alt Başlığı",
        default: "SSS",
      }),
      items: builderProp({
        type: "array",
        title: "Sorular",
        default: defaultItems as any,
      }),
      ...commonStyleSchemaProps({ bgColor: "background", textAlign: "center" }),
    },
  },
});

export { FAQAccordionBlock };
