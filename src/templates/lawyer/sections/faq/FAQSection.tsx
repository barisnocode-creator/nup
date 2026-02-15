import { useState } from 'react';
import { motion } from 'framer-motion';

const defaultFaqs = [
  { question: 'İlk görüşme ücretsiz mi?', answer: 'Evet, ilk danışma görüşmemiz ücretsizdir. Bu görüşmede davanızı değerlendirir ve size en uygun hukuki stratejiyi belirleriz.' },
  { question: 'Dava süreci ne kadar sürer?', answer: 'Dava süresi, davanın niteliğine ve karmaşıklığına göre değişiklik gösterir. Detaylı bilgi için bize ulaşabilirsiniz.' },
  { question: 'Hangi şehirlerde hizmet veriyorsunuz?', answer: 'Merkez ofisimiz İstanbul\'da olup, Türkiye genelinde tüm şehirlerde hukuki danışmanlık hizmeti sunmaktayız.' },
  { question: 'Online danışmanlık hizmeti var mı?', answer: 'Evet, video konferans aracılığıyla online danışmanlık hizmeti sunmaktayız.' },
  { question: 'Ücretlendirme nasıl yapılıyor?', answer: 'Ücretlendirmemiz dava türüne göre sabit ücret veya saatlik ücret olarak belirlenebilir. Detaylar ilk görüşmede paylaşılır.' },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6" style={{ background: 'var(--lw-white)' }}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: 'var(--lw-gray-500)' }}>
            SSS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}>
            Sıkça Sorulan Sorular
          </h2>
        </motion.div>

        <div className="space-y-0">
          {defaultFaqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="lawyer-faq-item"
              style={{ borderBottom: '1px solid var(--lw-gray-200)' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="font-medium text-sm" style={{ color: 'var(--lw-black)' }}>
                  {faq.question}
                </span>
                <span
                  className="text-xl transition-transform duration-300 ml-4 flex-shrink-0"
                  style={{
                    color: 'var(--lw-gray-500)',
                    transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pb-5"
                >
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--lw-gray-600)' }}>
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
