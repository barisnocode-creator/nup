import { motion } from 'framer-motion';

export function CTADark() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--lw-black)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--lw-white)', fontFamily: 'var(--font-heading)' }}
          >
            Hukuki Desteğe mi İhtiyacınız Var?
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'var(--lw-gray-400)' }}>
            Deneyimli avukat kadromuz ile haklarınızı en iyi şekilde koruyoruz. İlk görüşme ücretsizdir.
          </p>
          <a
            href="#contact"
            className="inline-block px-10 py-4 text-sm font-semibold tracking-wider uppercase transition-opacity hover:opacity-90"
            style={{ background: 'var(--lw-white)', color: 'var(--lw-black)' }}
          >
            Ücretsiz Danışma
          </a>
        </motion.div>
      </div>
    </section>
  );
}
