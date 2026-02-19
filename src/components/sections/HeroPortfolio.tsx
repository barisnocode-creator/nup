import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import type { SectionComponentProps } from './types';

const socialIcons: Record<string, React.ElementType> = { Github, Linkedin, Twitter, Mail };

export function HeroPortfolio({ section, isEditing }: SectionComponentProps) {
  const p = section.props;
  const name = p.name || 'Ahmet Yılmaz';
  const title = p.title || 'Full Stack Developer';
  const bio = p.bio || 'React, Node.js ve cloud teknolojileri konusunda 8+ yıl deneyim. Ölçeklenebilir, kullanıcı odaklı ürünler geliştiriyorum.';
  const avatar = p.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80';
  const socials = (p.socials as Array<{ icon: string; url: string; label: string }>) || [
    { icon: 'Github', url: '#', label: 'GitHub' },
    { icon: 'Linkedin', url: '#', label: 'LinkedIn' },
    { icon: 'Twitter', url: '#', label: 'Twitter' },
    { icon: 'Mail', url: '#', label: 'Email' },
  ];
  const buttonText = p.buttonText || 'Projelerimi Gör';

  return (
    <section className="min-h-screen flex items-center bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Name & title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground font-heading-dynamic mb-3">{name}</h1>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium font-body-dynamic">
              {title}
            </span>
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto mt-6 leading-relaxed font-body-dynamic"
          >
            {bio}
          </motion.p>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center gap-3 mt-8"
          >
            {socials.map((s) => {
              const Icon = socialIcons[s.icon] || Mail;
              return (
                <a
                  key={s.label}
                  href={isEditing ? '#' : s.url}
                  className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                  title={s.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10"
          >
            <a
              href={isEditing ? '#' : (p.buttonLink || '#projects')}
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body-dynamic"
            >
              {buttonText}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
