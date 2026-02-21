import { motion } from 'framer-motion';

const stats = [
  { value: '1,000+', label: 'Oluşturulan Site' },
  { value: '50+', label: 'Desteklenen Sektör' },
  { value: '30sn', label: 'Ortalama Süre' },
  { value: '%99.9', label: 'Uptime Garantisi' },
];

export function TrustSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-extrabold mb-1">{stat.value}</div>
              <div className="text-sm text-primary-foreground/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
