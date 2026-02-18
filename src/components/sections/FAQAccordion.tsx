import { useState } from 'react';
import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

const defaultItems = [
  { question: "Hizmetleriniz neleri kapsıyor?", answer: "Web sitesi tasarımı, geliştirme, SEO optimizasyonu sunuyoruz." },
  { question: "Bir proje ne kadar sürede tamamlanır?", answer: "Genellikle 2-6 hafta arasında teslim ediyoruz." },
  { question: "Ödeme seçenekleri nelerdir?", answer: "Kredi kartı, banka havalesi ve taksitli ödeme seçenekleri sunuyoruz." },
  { question: "Proje sonrası destek sağlıyor musunuz?", answer: "Evet, 1 yıl ücretsiz teknik destek dahildir." },
];

export function FAQAccordion({ section }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const items = props.items?.length ? props.items : defaultItems;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        <div className={`text-${s.textAlign} max-w-3xl mx-auto mb-16`}>
          {props.sectionSubtitle && <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 ${s.subtitleTransform}`}>{props.sectionSubtitle}</span>}
          <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor}`}>{props.sectionTitle}</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item: any, index: number) => (
            <div key={index} className="rounded-xl border border-border overflow-hidden">
              <button className="w-full px-6 py-5 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors text-left" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
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
}
