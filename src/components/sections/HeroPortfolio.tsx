import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { PixabayImagePicker } from './PixabayImagePicker';
import { getSectorImageQuery } from './sectorImageQueries';
import type { SectionComponentProps } from './types';

export function HeroPortfolio({ section, isEditing, onUpdate }: SectionComponentProps) {
  const p = section.props;
  const sector = p._sector || 'developer';
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

  const [pickerOpen, setPickerOpen] = useState(false);

  const socialLinks: Record<string, string> = {
    Github: 'https://github.com',
    Linkedin: 'https://linkedin.com',
    Twitter: 'https://twitter.com',
    Mail: 'mailto:',
  };

  const SocialIcon = ({ name: iconName }: { name: string }) => {
    const icons: Record<string, JSX.Element> = {
      Github: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>,
      Linkedin: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
      Twitter: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
      Mail: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    };
    return icons[iconName] || icons.Mail;
  };

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
            <div className="relative w-32 h-32 mx-auto group">
              <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              </div>
              {isEditing && (
                <button
                  onClick={() => setPickerOpen(true)}
                  className="absolute -top-1 -right-1 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 text-gray-800 hover:bg-white shadow-md border border-white/30 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
              )}
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
            {socials.map((s) => (
              <a
                key={s.label}
                href={isEditing ? '#' : s.url}
                className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                title={s.label}
              >
                <SocialIcon name={s.icon} />
              </a>
            ))}
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

      {isEditing && (
        <PixabayImagePicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => { onUpdate?.({ avatar: url }); }}
          defaultQuery={getSectorImageQuery('hero', sector)}
        />
      )}
    </section>
  );
}
