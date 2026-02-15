import { motion } from 'framer-motion';

interface TeamMember {
  name: string;
  title: string;
  image: string;
  credentials: string;
}

const defaultTeam: TeamMember[] = [
  {
    name: 'Av. Ahmet Yılmaz',
    title: 'Kurucu Ortak',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    credentials: 'İstanbul Üniversitesi Hukuk Fakültesi',
  },
  {
    name: 'Av. Zeynep Kaya',
    title: 'Kıdemli Ortak',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    credentials: 'Ankara Üniversitesi Hukuk Fakültesi',
  },
];

interface TeamSectionProps {
  teamMembers?: TeamMember[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function TeamSection({ teamMembers }: TeamSectionProps) {
  const team = teamMembers || defaultTeam;

  return (
    <section id="team" className="py-24 px-6" style={{ background: 'var(--lw-white)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: 'var(--lw-gray-500)' }}>
            Ekibimiz
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}>
            Avukat Kadromuz
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center"
            >
              <div
                className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden"
                style={{ border: '3px solid var(--lw-gray-200)' }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--lw-black)', fontFamily: 'var(--font-heading)' }}>
                {member.name}
              </h3>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--lw-gray-500)' }}>
                {member.title}
              </p>
              <p className="text-xs" style={{ color: 'var(--lw-gray-400)' }}>
                {member.credentials}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
