import { motion } from 'framer-motion';
import type { SectionComponentProps } from './types';

export function CafeStory({ section, isEditing }: SectionComponentProps) {
  const { props } = section;

  return (
    <section className="py-24 lg:py-32 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="rounded-3xl overflow-hidden">
              <img src={props.image || "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80"} alt={props.title || "Our Story"} className="w-full h-[500px] object-cover" />
            </div>
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-primary/10 rounded-3xl" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6">
            {props.subtitle && (
              <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase font-body-dynamic">{props.subtitle}</span>
            )}
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight font-heading-dynamic">
              {props.title || "Our Story"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-body-dynamic">
              {props.description || "Founded in the heart of Haight Ashbury, we've been serving the community with passion and dedication since day one."}
            </p>
            {props.features && (
              <div className="grid grid-cols-2 gap-4 pt-4">
                {(typeof props.features === 'string' ? props.features.split('\n') : props.features).map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground font-medium text-sm font-body-dynamic">{feature}</span>
                  </div>
                ))}
              </div>
            )}
            {props.buttonText && (
              <a
                href={isEditing ? '#' : props.buttonLink}
                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 mt-4 font-body-dynamic"
              >
                {props.buttonText}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
