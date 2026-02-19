import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SectionComponentProps } from '../types';

const defaultItems = [
  { question: 'Randevu nasıl alabilirim?', answer: 'Web sitemiz üzerinden veya telefon aracılığıyla kolayca randevu oluşturabilirsiniz.' },
  { question: 'Çalışma saatleriniz nedir?', answer: 'Hafta içi 09:00-18:00, Cumartesi 09:00-14:00 saatleri arasında hizmet vermekteyiz.' },
  { question: 'Otopark imkânınız var mı?', answer: 'Evet, müşterilerimiz için ücretsiz otopark hizmeti sunmaktayız.' },
  { question: 'Online hizmet veriyor musunuz?', answer: 'Evet, online danışmanlık ve uzaktan hizmet seçeneklerimiz mevcuttur.' },
  { question: 'Ödeme yöntemleriniz nelerdir?', answer: 'Nakit, kredi kartı ve havale/EFT ile ödeme yapabilirsiniz.' },
];

export function FAQSection({ section }: SectionComponentProps) {
  const { title = 'Sık Sorulan Sorular', items = defaultItems } = section.props;

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground font-[family-name:var(--font-heading)] mb-10">{title}</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {(items as Array<{ question: string; answer: string }>).map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-[var(--radius)] px-6">
              <AccordionTrigger className="text-foreground font-medium hover:no-underline">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
