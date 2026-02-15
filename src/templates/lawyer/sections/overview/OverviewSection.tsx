import { motion } from 'framer-motion';

interface OverviewSectionProps {
  description: string;
  features: string[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

const stats = [
  { value: '30+', label: 'Yıl Deneyim' },
  { value: '500+', label: 'Başarılı Dava' },
  { value: '%100', label: 'Müşteri Memnuniyeti' },
];

export function OverviewSection({ description, features }: OverviewSectionProps) {
  return (
    <section id="about" className="py-24 px-6" style={{ background: 'var(--lw-white)' }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* Text Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-sm tracking-[0.2em] uppercase mb-4 font-semibold"
            style={{ color: 'var(--lw-gray-500)' }}
          >
            Hakkımızda
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
            style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}
          >
            Adalet İçin Mücadele
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: 'var(--lw-gray-600)' }}
          >
            {description}
          </p>
          <ul className="space-y-3">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--lw-gray-700)' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--lw-black)' }} />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Stats Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 gap-6"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-8 text-center"
              style={{
                background: 'var(--lw-gray-100)',
                border: '1px solid var(--lw-gray-200)',
              }}
            >
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}
              >
                {s.value}
              </div>
              <div className="text-sm tracking-wider uppercase" style={{ color: 'var(--lw-gray-500)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
