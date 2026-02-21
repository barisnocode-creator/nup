import { motion } from 'framer-motion';
import type { SectionComponentProps } from './types';

const defaultCategories: any[] = [];

export function SkillsGrid({ section }: SectionComponentProps) {
  const p = section.props;
  const subtitle = p.subtitle || '';
  const title = p.title || '';
  const categories = (p.categories as any[]) || defaultCategories;

  if (!categories.length) return null;

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

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.15 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h3 className="text-lg font-bold text-foreground mb-6 font-heading-dynamic">{cat.name}</h3>
              <div className="space-y-5">
                {cat.skills.map((skill, si) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground font-body-dynamic">{skill.name}</span>
                      <span className="text-xs text-muted-foreground font-body-dynamic">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: ci * 0.15 + si * 0.1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
