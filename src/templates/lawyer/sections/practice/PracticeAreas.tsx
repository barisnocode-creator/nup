import { motion } from 'framer-motion';

const practiceAreas = [
  {
    icon: '🏢',
    title: 'Şirketler Hukuku',
    items: ['Şirket kuruluşu', 'Birleşme & devralma', 'Ticari sözleşmeler'],
  },
  {
    icon: '⚖️',
    title: 'Dava & Uyuşmazlık',
    items: ['Hukuk davaları', 'Tahkim', 'Arabuluculuk'],
  },
  {
    icon: '🏠',
    title: 'Gayrimenkul Hukuku',
    items: ['Alım-satım işlemleri', 'Kira sözleşmeleri', 'İmar hukuku'],
  },
  {
    icon: '👥',
    title: 'İş Hukuku',
    items: ['İş sözleşmeleri', 'İşçi-işveren uyuşmazlıkları', 'SGK davaları'],
  },
  {
    icon: '💡',
    title: 'Fikri Mülkiyet',
    items: ['Patent & marka tescili', 'Telif hakları', 'Lisans sözleşmeleri'],
  },
  {
    icon: '📋',
    title: 'Miras Hukuku',
    items: ['Vasiyetname hazırlama', 'Miras paylaşımı', 'Veraset ilamı'],
  },
];

export function PracticeAreas() {
  return (
    <section id="practice" className="py-24 px-6" style={{ background: 'var(--lw-gray-100)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: 'var(--lw-gray-500)' }}>
            Uzmanlık Alanları
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}>
            Uygulama Alanlarımız
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practiceAreas.map((area, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="lawyer-practice-card p-8"
              style={{
                background: 'var(--lw-white)',
                border: '1px solid var(--lw-gray-200)',
              }}
            >
              <div className="text-3xl mb-4">{area.icon}</div>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}>
                {area.title}
              </h3>
              <ul className="space-y-2">
                {area.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm" style={{ color: 'var(--lw-gray-600)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--lw-gray-400)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
