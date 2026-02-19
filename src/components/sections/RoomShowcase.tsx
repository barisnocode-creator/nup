import { motion } from 'framer-motion';
import { Wifi, Wind, Coffee, Tv } from 'lucide-react';
import type { SectionComponentProps } from './types';

const iconMap: Record<string, React.ElementType> = { Wifi, Wind, Coffee, Tv };

const defaultRooms = [
  {
    name: 'Deluxe Oda',
    price: '₺2,500',
    unit: '/gece',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
    features: ['Wifi', 'Wind', 'Coffee', 'Tv'],
    description: '45m², şehir manzarası, king-size yatak',
  },
  {
    name: 'Suite',
    price: '₺4,200',
    unit: '/gece',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
    features: ['Wifi', 'Wind', 'Coffee', 'Tv'],
    description: '75m², deniz manzarası, jakuzi, oturma odası',
  },
  {
    name: 'Aile Odası',
    price: '₺3,800',
    unit: '/gece',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    features: ['Wifi', 'Wind', 'Coffee', 'Tv'],
    description: '60m², bağlantılı odalar, çocuk dostu',
  },
];

export function RoomShowcase({ section, isEditing }: SectionComponentProps) {
  const p = section.props;
  const subtitle = p.subtitle || 'Odalarımız';
  const title = p.title || 'Konfor ve Zarafet';
  const rooms = (p.rooms as typeof defaultRooms) || defaultRooms;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body-dynamic">{subtitle}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 font-heading-dynamic">{title}</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room, i) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold font-heading-dynamic">
                  {room.price}<span className="text-xs font-normal opacity-80">{room.unit}</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-foreground font-heading-dynamic">{room.name}</h3>
                <p className="text-sm text-muted-foreground font-body-dynamic">{room.description}</p>
                <div className="flex gap-3">
                  {room.features.map((f) => {
                    const Icon = iconMap[f] || Wifi;
                    return <Icon key={f} className="w-4 h-4 text-primary" />;
                  })}
                </div>
                <a
                  href={isEditing ? '#' : '#reservation'}
                  className="inline-flex w-full items-center justify-center px-6 py-3 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body-dynamic"
                >
                  Rezervasyon
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
