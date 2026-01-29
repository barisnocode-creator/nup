import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  isDark: boolean;
  isNeutral: boolean;
}

export function FAQSection({
  faqs,
  isDark,
  isNeutral,
}: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={cn(
      'py-20',
      isDark ? 'bg-slate-800' : isNeutral ? 'bg-stone-100' : 'bg-gray-50'
    )} id="faq">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className={cn(
            'inline-block px-4 py-1 rounded-full text-sm font-medium mb-4',
            isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
          )}>
            FAQ
          </span>
          <h2 className={cn(
            'text-3xl md:text-4xl font-bold',
            isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
          )}>
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className={cn(
                  'rounded-xl border px-6 overflow-hidden',
                  isDark 
                    ? 'bg-slate-900 border-slate-700' 
                    : isNeutral 
                      ? 'bg-white border-stone-200' 
                      : 'bg-white border-gray-200'
                )}
              >
                <AccordionTrigger className={cn(
                  'text-left font-semibold py-5 hover:no-underline',
                  isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
                )}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className={cn(
                  'pb-5 text-base',
                  isDark ? 'text-slate-400' : isNeutral ? 'text-stone-600' : 'text-gray-600'
                )}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
