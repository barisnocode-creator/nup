import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { SectionComponentProps } from './types';

const defaultProjects = [
  {
    title: 'E-Ticaret Platformu',
    description: 'React ve Node.js ile ölçeklenebilir e-ticaret çözümü. 50K+ aktif kullanıcı.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    link: '#',
  },
  {
    title: 'SaaS Dashboard',
    description: 'Gerçek zamanlı analytics dashboard. WebSocket tabanlı canlı veri akışı.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    tags: ['TypeScript', 'Next.js', 'D3.js'],
    link: '#',
  },
  {
    title: 'Mobil Sağlık Uygulaması',
    description: 'AI destekli sağlık takip uygulaması. 100K+ indirme.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    tags: ['React Native', 'Python', 'TensorFlow'],
    link: '#',
  },
];

export function ProjectShowcase({ section, isEditing }: SectionComponentProps) {
  const p = section.props;
  const subtitle = p.subtitle || 'Projeler';
  const title = p.title || 'Son Çalışmalarım';
  const projects = (p.projects as typeof defaultProjects) || defaultProjects;

  return (
    <section className="py-20 md:py-28 bg-card">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group bg-background rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <a
                  href={isEditing ? '#' : project.link}
                  className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-foreground font-heading-dynamic">{project.title}</h3>
                <p className="text-sm text-muted-foreground font-body-dynamic">{project.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full font-body-dynamic">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
