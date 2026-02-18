import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

function ArticleCard({ id, title, category, date, image, size }: { id: string; title: string; category: string; date: string; image: string; size: "large" | "small" }) {
  return (
    <div className="group relative block rounded-[2.5rem] overflow-hidden natural-card-hover cursor-pointer">
      <div className={`relative overflow-hidden bg-muted rounded-[2.5rem] ${size === "large" ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className={`px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-opacity-80 ${getCategoryClass(category)}`}>{category}</span>
            <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white border border-white/30">{date}</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
              <span className="text-white/50 text-xs font-medium tracking-wider block mb-3">{id}</span>
              <h3 className={`text-white leading-tight tracking-tight ${size === "large" ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl md:text-2xl lg:text-3xl"}`} style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700 }}>{title}</h3>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 right-6 natural-floating-button"><ArrowUpRight className="w-5 h-5" /></div>
      </div>
    </div>
  );
}

export function NaturalArticleGrid({ section }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });

  const articles = [
    { id: "001", title: props.article1Title, image: props.article1Image, category: props.article1Category, date: props.article1Date },
    { id: "002", title: props.article2Title, image: props.article2Image, category: props.article2Category, date: props.article2Date },
    { id: "003", title: props.article3Title, image: props.article3Image, category: props.article3Category, date: props.article3Date },
    { id: "W001", title: props.article4Title, image: props.article4Image, category: props.article4Category, date: props.article4Date },
    { id: "T001", title: props.article5Title, image: props.article5Image, category: props.article5Category, date: props.article5Date },
    { id: "G001", title: props.article6Title, image: props.article6Image, category: props.article6Category, date: props.article6Date },
  ];

  return (
    <section className={cn("natural-block", s.bgColor, s.sectionPadding)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className={cn(s.titleSize(), s.titleWeight, s.titleColor, "tracking-tight")} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{props.sectionTitle}</h2>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors px-4 py-2 rounded-full hover:bg-muted/60">View all →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 3).map(a => <ArticleCard key={a.id} {...a} size="large" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {articles.slice(3, 6).map(a => <ArticleCard key={a.id} {...a} size="small" />)}
        </div>
      </div>
    </section>
  );
}
