import { motion } from 'framer-motion';
import { Linkedin, Instagram, Mail } from 'lucide-react';
import type { SectionComponentProps } from '../types';

const defaultMembers = [
  {
    name: 'Dr. Ayşe Kaya',
    role: 'Uzman',
    bio: 'Alanında 15 yıllık deneyimiyle en iyi hizmeti sunmaktadır.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Mehmet Yıldız',
    role: 'Kıdemli Uzman',
    bio: '10 yıllık tecrübesiyle ekibimizin değerli üyesi.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Zeynep Demir',
    role: 'Uzman',
    bio: 'Uluslararası sertifikalı, müşteri memnuniyeti odaklı çalışmaktadır.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
  },
];

export function TeamGridSection({ section }: SectionComponentProps) {
  const {
    title = 'Uzman Ekibimiz',
    subtitle = 'Alanında uzman, deneyimli kadromuzla hizmetinizdeyiz.',
    members = defaultMembers,
  } = section.props;

  const parsedMembers = Array.isArray(members) && members.length > 0 ? members : defaultMembers;

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">{title}</h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">{subtitle}</p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parsedMembers.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group bg-card border border-border rounded-[var(--radius)] overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=400`}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <a href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-full bg-primary-foreground/20 border border-primary-foreground/40 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/40 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-full bg-primary-foreground/20 border border-primary-foreground/40 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/40 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-full bg-primary-foreground/20 border border-primary-foreground/40 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/40 transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-bold text-foreground text-base font-[family-name:var(--font-heading)]">{member.name}</h3>
                <p className="text-primary text-sm font-medium mt-0.5">{member.role}</p>
                {member.bio && (
                  <p className="mt-2 text-muted-foreground text-xs leading-relaxed line-clamp-2">{member.bio}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
