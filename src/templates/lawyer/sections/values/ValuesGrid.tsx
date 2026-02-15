import { motion } from 'framer-motion';

const values = [
  {
    icon: '⚖️',
    title: 'Dürüstlük',
    description: 'Her davada etik ve şeffaf yaklaşım ile müvekkillerimizin güvenini kazanıyoruz.',
  },
  {
    icon: '🏆',
    title: 'Mükemmellik',
    description: 'En yüksek standartlarda hukuki hizmet sunarak fark yaratıyoruz.',
  },
  {
    icon: '🤝',
    title: 'Müvekkil Odaklı',
    description: 'Her müvekkilimizin ihtiyaçlarını öncelik olarak görüyoruz.',
  },
  {
    icon: '💡',
    title: 'İnovasyon',
    description: 'Modern hukuk teknolojileri ile süreçlerimizi sürekli geliştiriyoruz.',
  },
];

export function ValuesGrid() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--lw-gray-100)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: 'var(--lw-gray-500)' }}>
            Değerlerimiz
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}>
            İlkelerimiz
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="lawyer-value-card p-8 text-center"
              style={{
                background: 'var(--lw-white)',
                border: '1px solid var(--lw-gray-200)',
              }}
            >
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}
              >
                {v.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--lw-gray-600)' }}>
                {v.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
