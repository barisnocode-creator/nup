import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NaturalHeaderProps {
  siteName: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  isDark?: boolean;
  onToggleDark?: () => void;
}

export function NaturalHeader({ siteName, isEditable, onFieldEdit, isDark = false, onToggleDark }: NaturalHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 py-2 sm:py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 pill-nav px-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-base sm:text-lg">
                  {siteName.charAt(0)}
                </span>
              </div>
              <span className="text-base sm:text-xl font-bold font-serif truncate">
                {siteName}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <a href="#hero" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">Home</a>
            <a href="#articles" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">Articles</a>
            <a href="#about" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">Wellness</a>
            <a href="#contact" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">Travel</a>
            <a href="#about" className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">About</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {onToggleDark && (
              <button
                onClick={onToggleDark}
                className="p-2 rounded-full hover:bg-muted/60 transition-all"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}

            <Button className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-2 hover:scale-105 transition-all">
              Join Now
            </Button>

            <button
              className="md:hidden p-1.5 sm:p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4 px-4">
              <a href="#hero" className="text-sm font-medium hover:text-accent transition-colors">Home</a>
              <a href="#articles" className="text-sm font-medium hover:text-accent transition-colors">Articles</a>
              <a href="#about" className="text-sm font-medium hover:text-accent transition-colors">Wellness</a>
              <a href="#contact" className="text-sm font-medium hover:text-accent transition-colors">Travel</a>
              <a href="#about" className="text-sm font-medium hover:text-accent transition-colors">About</a>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full">
                Join Now
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
