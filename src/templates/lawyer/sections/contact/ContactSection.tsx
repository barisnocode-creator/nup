import { motion } from 'framer-motion';

interface ContactSectionProps {
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function ContactSection({ contactInfo }: ContactSectionProps) {
  const phone = contactInfo?.phone || '+90 212 555 0000';
  const email = contactInfo?.email || 'info@chambers.com.tr';
  const address = contactInfo?.address || 'Levent, İstanbul';

  return (
    <section id="contact" className="py-24 px-6" style={{ background: 'var(--lw-gray-100)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: 'var(--lw-gray-500)' }}>
            İletişim
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}>
            Bize Ulaşın
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}>
                İletişim Bilgileri
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--lw-gray-500)' }}>Telefon</p>
                    <p className="font-medium" style={{ color: 'var(--lw-black)' }}>{phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-xl">📧</span>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--lw-gray-500)' }}>E-posta</p>
                    <p className="font-medium" style={{ color: 'var(--lw-black)' }}>{email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--lw-gray-500)' }}>Adres</p>
                    <p className="font-medium" style={{ color: 'var(--lw-black)' }}>{address}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
            onSubmit={(e) => { e.preventDefault(); alert('Mesajınız alınmıştır!'); }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Adınız"
                required
                className="px-4 py-3 text-sm outline-none"
                style={{ background: 'var(--lw-white)', border: '1px solid var(--lw-gray-200)', color: 'var(--lw-black)' }}
              />
              <input
                type="email"
                placeholder="E-posta"
                required
                className="px-4 py-3 text-sm outline-none"
                style={{ background: 'var(--lw-white)', border: '1px solid var(--lw-gray-200)', color: 'var(--lw-black)' }}
              />
            </div>
            <input
              type="text"
              placeholder="Konu"
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ background: 'var(--lw-white)', border: '1px solid var(--lw-gray-200)', color: 'var(--lw-black)' }}
            />
            <textarea
              placeholder="Mesajınız"
              rows={5}
              required
              className="w-full px-4 py-3 text-sm outline-none resize-none"
              style={{ background: 'var(--lw-white)', border: '1px solid var(--lw-gray-200)', color: 'var(--lw-black)' }}
            />
            <button
              type="submit"
              className="w-full py-4 text-sm font-semibold tracking-wider uppercase transition-opacity hover:opacity-90"
              style={{ background: 'var(--lw-black)', color: 'var(--lw-white)' }}
            >
              Mesaj Gönder
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
