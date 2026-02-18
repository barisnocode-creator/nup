import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';
import { cn } from '@/lib/utils';

export function NaturalFooter({ section }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });

  return (
    <footer className={cn("natural-block border-t border-border mt-16", s.bgColor, s.sectionPadding)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">Wellness</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Travel</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Creativity</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Growth</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-accent transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Authors</a></li>
              <li><a href="#contact" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">Style Guide</a></li>
              <li><a href="#contact" className="hover:text-accent transition-colors">Newsletter</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {props.siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
