import {
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { EditableChaiImage } from "../shared/EditableChaiImage";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { heroTitleSizeMap, resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";

export type NaturalHeroProps = {
  styles: ChaiStyles;
  title: string;
  description: string;
  buttonText: string;
  image: string;
} & CommonStyleProps;

const NaturalHeroBlock = (props: ChaiBlockComponentProps<NaturalHeroProps>) => {
  const { blockProps, title, description, buttonText, image, inBuilder, ...styleProps } = props;
  const s = resolveStyles(styleProps);

  return (
    <TooltipProvider>
      <section
        {...blockProps}
        className={cn(blockProps.className, "natural-block relative rounded-[2.5rem] overflow-hidden my-12 max-w-7xl mx-auto", s.bgColor === "bg-transparent" ? "bg-muted" : s.bgColor)}
      >
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 p-6 md:p-12 lg:p-16">
          {/* Left - Image */}
          <div className="relative rounded-[2rem] overflow-hidden">
            <EditableChaiImage
              src={image || "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80"}
              alt={title}
              className="w-full h-full object-cover"
              containerClassName="aspect-[4/3] md:aspect-auto rounded-[2rem] overflow-hidden"
              inBuilder={inBuilder}
            />
          </div>

          {/* Right - Content */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <h1
                className={cn(s.titleSize(heroTitleSizeMap), s.titleWeight, s.titleColor, "leading-[1.1] tracking-tight")}
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {title}
              </h1>
              <p className={cn(s.descSize, s.descColor, "leading-relaxed max-w-xl")}>
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 pt-4">
              <a
                href={inBuilder ? "#" : "#contact"}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-4 md:px-10 md:py-6 text-base font-medium transition-all hover:scale-105 w-full sm:w-auto"
              >
                {buttonText}
              </a>

              <div className="flex items-center gap-4">
                <a href="#" className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center hover:scale-110" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center hover:scale-110" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center hover:scale-110" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

registerChaiBlock(NaturalHeroBlock, {
  type: "NaturalHero",
  label: "Natural Hero",
  category: "hero",
  group: "sections",
  inlineEditProps: ["title", "description", "buttonText"],
  schema: {
    properties: {
      styles: StylesProp(""),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "Journey Through Life's Spectrum",
      }),
      description: builderProp({
        type: "string",
        title: "Açıklama",
        default: "Welcome to Perspective's Blog: A Realm of Reflection, Inspiration, and Discovery.",
        ui: { "ui:widget": "textarea" },
      }),
      buttonText: builderProp({
        type: "string",
        title: "Buton Metni",
        default: "Join Now",
      }),
      image: builderProp({
        type: "string",
        title: "Görsel",
        default: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80",
        ui: { "ui:widget": "image" },
      }),
      ...commonStyleSchemaProps({ bgColor: "muted", textAlign: "left", titleSize: "3xl" }),
    },
  },
});

export { NaturalHeroBlock };
