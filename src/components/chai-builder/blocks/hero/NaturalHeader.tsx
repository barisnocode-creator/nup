import { useState } from "react";
import {
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { Menu, X } from "lucide-react";

export type NaturalHeaderProps = {
  styles: ChaiStyles;
  siteName: string;
  buttonText: string;
};

const NaturalHeaderBlock = (props: ChaiBlockComponentProps<NaturalHeaderProps>) => {
  const { blockProps, siteName, buttonText, inBuilder } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header {...blockProps} className="natural-block sticky top-0 z-50 py-2 sm:py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 rounded-full bg-background/80 backdrop-blur-md border border-border/50 px-4 sm:px-6 shadow-sm">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-base sm:text-lg">
                  {siteName.charAt(0)}
                </span>
              </div>
              <span
                className="text-base sm:text-xl font-bold truncate"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {siteName}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <a href={inBuilder ? "#" : "#hero"} className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">Home</a>
            <a href={inBuilder ? "#" : "#articles"} className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">Articles</a>
            <a href={inBuilder ? "#" : "#about"} className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">Wellness</a>
            <a href={inBuilder ? "#" : "#contact"} className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">Travel</a>
            <a href={inBuilder ? "#" : "#about"} className="text-sm font-medium hover:bg-muted/60 rounded-full px-4 py-2 transition-all">About</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <a
              href={inBuilder ? "#" : "#contact"}
              className="hidden md:flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-2 text-sm font-medium hover:scale-105 transition-all"
            >
              {buttonText}
            </a>

            <button
              className="md:hidden p-1.5 sm:p-2"
              onClick={() => !inBuilder && setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && !inBuilder && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in mt-2 rounded-2xl bg-background/80 backdrop-blur-md px-4">
            <nav className="flex flex-col gap-4">
              <a href="#hero" className="text-sm font-medium hover:text-accent transition-colors">Home</a>
              <a href="#articles" className="text-sm font-medium hover:text-accent transition-colors">Articles</a>
              <a href="#about" className="text-sm font-medium hover:text-accent transition-colors">Wellness</a>
              <a href="#contact" className="text-sm font-medium hover:text-accent transition-colors">Travel</a>
              <a href="#about" className="text-sm font-medium hover:text-accent transition-colors">About</a>
              <a
                href="#contact"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full text-center py-3 text-sm font-medium"
              >
                {buttonText}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

registerChaiBlock(NaturalHeaderBlock, {
  type: "NaturalHeader",
  label: "Natural Header",
  category: "hero",
  group: "sections",
  inlineEditProps: ["siteName", "buttonText"],
  schema: {
    properties: {
      styles: StylesProp(""),
      siteName: builderProp({
        type: "string",
        title: "Site Adı",
        default: "Perspective",
      }),
      buttonText: builderProp({
        type: "string",
        title: "Buton Metni",
        default: "Join Now",
      }),
    },
  },
});

export { NaturalHeaderBlock };
