import { motion } from 'framer-motion';

interface Testimonial {
  content: string;
  name: string;
  role: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    content: 'Chambers & Associates ekibi, şirketimizin en karmaşık hukuki süreçlerini profesyonel bir şekilde yönetti. Sonuç odaklı yaklaşımları ile tam güven duyduk.',
    name: 'Mehmet Demir',
    role: 'CEO, Demir Holding',
  },
  {
    content: 'Gayrimenkul davamızda gösterdikleri özveri ve uzmanlık sayesinde haklarımızı en iyi şekilde korudular. Kesinlikle tavsiye ediyorum.',
    name: 'Ayşe Koç',
    role: 'Girişimci',
  },
  {
    content: 'İş hukuku konusundaki derin bilgileri ve pratik çözümleri ile şirketimize büyük değer kattılar.',
    name: 'Ali Yıldırım',
    role: 'İK Direktörü',
  },
];

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const items = testimonials || defaultTestimonials;

  return (
    <section className="py-24 px-6" style={{ background: 'var(--lw-white)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: 'var(--lw-gray-500)' }}>
            Referanslar
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}>
            Müvekkillerimiz Ne Diyor?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8"
              style={{
                background: 'var(--lw-gray-100)',
                border: '1px solid var(--lw-gray-200)',
              }}
            >
              <div className="text-5xl mb-4" style={{ color: 'var(--lw-gray-300)', fontFamily: 'var(--font-heading)' }}>"</div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--lw-gray-600)' }}>
                {t.content}
              </p>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--lw-black)' }}>{t.name}</p>
                <p className="text-xs" style={{ color: 'var(--lw-gray-500)' }}>{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
