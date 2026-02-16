import {
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { EditableChaiImage } from "../shared/EditableChaiImage";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ArrowUpRight } from "lucide-react";

export type NaturalArticleGridProps = {
  styles: ChaiStyles;
  sectionTitle: string;
  article1Title: string; article1Image: string; article1Category: string; article1Date: string;
  article2Title: string; article2Image: string; article2Category: string; article2Date: string;
  article3Title: string; article3Image: string; article3Category: string; article3Date: string;
  article4Title: string; article4Image: string; article4Category: string; article4Date: string;
  article5Title: string; article5Image: string; article5Category: string; article5Date: string;
  article6Title: string; article6Image: string; article6Category: string; article6Date: string;
};

const getCategoryClass = (cat: string) => {
  const n = cat.toLowerCase();
  if (n.includes("financ")) return "natural-tag-financing";
  if (n.includes("lifestyle")) return "natural-tag-lifestyle";
  if (n.includes("community")) return "natural-tag-community";
  if (n.includes("wellness")) return "natural-tag-wellness";
  if (n.includes("travel")) return "natural-tag-travel";
  if (n.includes("creativ")) return "natural-tag-creativity";
  if (n.includes("growth")) return "natural-tag-growth";
  return "natural-tag-lifestyle";
};

interface CardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  size: "large" | "small";
  inBuilder?: boolean;
}

const ArticleCard = ({ id, title, category, date, image, size, inBuilder }: CardProps) => (
  <div className="group relative block rounded-[2.5rem] overflow-hidden natural-card-hover cursor-pointer">
    <div className={`relative overflow-hidden bg-muted rounded-[2.5rem] ${size === "large" ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
      <EditableChaiImage
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        inBuilder={inBuilder}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="absolute inset-0 p-8 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className={`px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-opacity-80 ${getCategoryClass(category)}`}>
            {category}
          </span>
          <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white border border-white/30">
            {date}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <span className="text-white/50 text-xs font-medium tracking-wider block mb-3">{id}</span>
            <h3
              className={`text-white leading-tight tracking-tight ${size === "large" ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl md:text-2xl lg:text-3xl"}`}
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700 }}
            >
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 natural-floating-button">
        <ArrowUpRight className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const NaturalArticleGridBlock = (props: ChaiBlockComponentProps<NaturalArticleGridProps>) => {
  const { blockProps, inBuilder, sectionTitle, ...rest } = props;

  const articles = [
    { id: "001", title: rest.article1Title, image: rest.article1Image, category: rest.article1Category, date: rest.article1Date },
    { id: "002", title: rest.article2Title, image: rest.article2Image, category: rest.article2Category, date: rest.article2Date },
    { id: "003", title: rest.article3Title, image: rest.article3Image, category: rest.article3Category, date: rest.article3Date },
    { id: "W001", title: rest.article4Title, image: rest.article4Image, category: rest.article4Category, date: rest.article4Date },
    { id: "T001", title: rest.article5Title, image: rest.article5Image, category: rest.article5Category, date: rest.article5Date },
    { id: "G001", title: rest.article6Title, image: rest.article6Image, category: rest.article6Category, date: rest.article6Date },
  ];

  return (
    <TooltipProvider>
      <section {...blockProps} className="natural-block py-12">
        <div className="flex items-center justify-between mb-12">
          <h2
            className="text-3xl md:text-4xl tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700 }}
          >
            {sectionTitle}
          </h2>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors px-4 py-2 rounded-full hover:bg-muted/60">
            View all →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 3).map((a) => (
            <ArticleCard key={a.id} {...a} size="large" inBuilder={inBuilder} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {articles.slice(3, 6).map((a) => (
            <ArticleCard key={a.id} {...a} size="small" inBuilder={inBuilder} />
          ))}
        </div>
      </section>
    </TooltipProvider>
  );
};

registerChaiBlock(NaturalArticleGridBlock, {
  type: "NaturalArticleGrid",
  label: "Natural Makale Grid",
  category: "gallery",
  group: "sections",
  inlineEditProps: ["sectionTitle"],
  schema: {
    properties: {
      styles: StylesProp(""),
      sectionTitle: builderProp({ type: "string", title: "Bölüm Başlığı", default: "Featured Articles" }),
      article1Title: builderProp({ type: "string", title: "Makale 1 Başlık", default: "Whispers of Wisdom" }),
      article1Image: builderProp({ type: "string", title: "Makale 1 Görsel", default: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80", ui: { "ui:widget": "image" } }),
      article1Category: builderProp({ type: "string", title: "Makale 1 Kategori", default: "Financing" }),
      article1Date: builderProp({ type: "string", title: "Makale 1 Tarih", default: "Oct 16, 2024" }),
      article2Title: builderProp({ type: "string", title: "Makale 2 Başlık", default: "Ink-Stained Insights" }),
      article2Image: builderProp({ type: "string", title: "Makale 2 Görsel", default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80", ui: { "ui:widget": "image" } }),
      article2Category: builderProp({ type: "string", title: "Makale 2 Kategori", default: "Lifestyle" }),
      article2Date: builderProp({ type: "string", title: "Makale 2 Tarih", default: "Oct 14, 2024" }),
      article3Title: builderProp({ type: "string", title: "Makale 3 Başlık", default: "Musings in Grayscale" }),
      article3Image: builderProp({ type: "string", title: "Makale 3 Görsel", default: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", ui: { "ui:widget": "image" } }),
      article3Category: builderProp({ type: "string", title: "Makale 3 Kategori", default: "Community" }),
      article3Date: builderProp({ type: "string", title: "Makale 3 Tarih", default: "Oct 12, 2024" }),
      article4Title: builderProp({ type: "string", title: "Makale 4 Başlık", default: "Finding Balance in a Digital World" }),
      article4Image: builderProp({ type: "string", title: "Makale 4 Görsel", default: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80", ui: { "ui:widget": "image" } }),
      article4Category: builderProp({ type: "string", title: "Makale 4 Kategori", default: "Wellness" }),
      article4Date: builderProp({ type: "string", title: "Makale 4 Tarih", default: "Oct 10, 2024" }),
      article5Title: builderProp({ type: "string", title: "Makale 5 Başlık", default: "The Art of Slow Travel" }),
      article5Image: builderProp({ type: "string", title: "Makale 5 Görsel", default: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80", ui: { "ui:widget": "image" } }),
      article5Category: builderProp({ type: "string", title: "Makale 5 Kategori", default: "Travel" }),
      article5Date: builderProp({ type: "string", title: "Makale 5 Tarih", default: "Oct 8, 2024" }),
      article6Title: builderProp({ type: "string", title: "Makale 6 Başlık", default: "Minimalist Living" }),
      article6Image: builderProp({ type: "string", title: "Makale 6 Görsel", default: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80", ui: { "ui:widget": "image" } }),
      article6Category: builderProp({ type: "string", title: "Makale 6 Kategori", default: "Creativity" }),
      article6Date: builderProp({ type: "string", title: "Makale 6 Tarih", default: "Oct 6, 2024" }),
    },
  },
});

export { NaturalArticleGridBlock };
