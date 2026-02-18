import { motion } from 'framer-motion';
import type { SectionComponentProps } from './types';

/**
 * Cafe-style split hero — matches pencil.dev "Specialty Cafe" design:
 * warm coral/terracotta background, large serif headline, image on right
 */
export function HeroCafe({ section, isEditing }: SectionComponentProps) {
  const { props } = section;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#C65D3E]">
      {/* Subtle grain overlay for warmth */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
      
      <div className="relative container mx-auto px-6 lg:px-12 py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[85vh]">
          {/* Left: Text Content */}
          <div className="space-y-8 lg:pr-8">
            {props.badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  {props.badge}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {props.title || "Where Every Cup Tells a Story"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {props.description || "A specialty cafe in the heart of Haight Ashbury, San Francisco. Hand-crafted beverages and artisanal pastries."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              {props.primaryButtonText && (
                <a
                  href={isEditing ? '#' : props.primaryButtonLink}
                  className="inline-flex items-center px-8 py-4 bg-white text-[#C65D3E] rounded-full font-semibold hover:bg-white/90 transition-all duration-300 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {props.primaryButtonText}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              )}
              {props.secondaryButtonText && (
                <a
                  href={isEditing ? '#' : props.secondaryButtonLink}
                  className="inline-flex items-center px-8 py-4 border-2 border-white/40 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {props.secondaryButtonText}
                </a>
              )}
            </motion.div>

            {/* Quick info strip */}
            {props.infoItems && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-wrap gap-6 pt-6 border-t border-white/20"
              >
                {(props.infoItems as string[]).map((item: string, i: number) => (
                  <span key={i} className="text-white/70 text-sm font-medium tracking-wide uppercase">{item}</span>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={props.image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"}
                alt={props.title || "Cafe"}
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              {/* Warm gradient overlay on image bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#C65D3E]/30 via-transparent to-transparent" />
            </div>

            {/* Floating badge on image */}
            {props.floatingBadge && (
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-6 py-4 shadow-xl">
                <p className="text-[#C65D3E] font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>{props.floatingBadge}</p>
                <p className="text-gray-500 text-sm">{props.floatingBadgeSubtext || ''}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
