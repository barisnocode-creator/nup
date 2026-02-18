import { useState } from 'react';
import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NaturalHeader({ section, isEditing }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={cn("natural-block sticky top-0 z-50 py-2 sm:py-4", s.bgColor === "bg-background" ? "" : s.bgColor)}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 rounded-full bg-background/80 backdrop-blur-md border border-border/50 px-4 sm:px-6 shadow-sm">
          <div className="flex items-center min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-base sm:text-lg">{props.siteName?.charAt(0)}</span>
              </div>
              <span className="text-base sm:text-xl font-bold truncate" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{props.siteName}</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <a href="#hero" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">Ana Sayfa</a>
            <a href="#articles" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">Hizmetler</a>
            <a href="#about" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">Hakkımızda</a>
            <a href="#contact" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">İletişim</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <a href="#contact" className="hidden md:flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-2 text-sm font-medium hover:scale-105 transition-all">{props.buttonText}</a>
            <button className="md:hidden p-1.5 sm:p-2" onClick={() => !isEditing && setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
        {isMenuOpen && !isEditing && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in mt-2 rounded-2xl bg-background/80 backdrop-blur-md px-4">
            <nav className="flex flex-col gap-4">
              <a href="#hero" className="text-sm font-medium">Ana Sayfa</a>
              <a href="#articles" className="text-sm font-medium">Hizmetler</a>
              <a href="#about" className="text-sm font-medium">Hakkımızda</a>
              <a href="#contact" className="text-sm font-medium">İletişim</a>
              <a href="#contact" className="bg-primary text-primary-foreground rounded-full w-full text-center py-3 text-sm font-medium">{props.buttonText}</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
