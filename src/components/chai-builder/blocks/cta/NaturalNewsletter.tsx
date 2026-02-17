import {
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";

export type NaturalNewsletterProps = {
  styles: ChaiStyles;
  title: string;
  description: string;
  buttonText: string;
} & CommonStyleProps;

const NaturalNewsletterBlock = (props: ChaiBlockComponentProps<NaturalNewsletterProps>) => {
  const { blockProps, title, description, buttonText, ...styleProps } = props;
  const s = resolveStyles(styleProps);

  return (
    <TooltipProvider>
      <section
        {...blockProps}
        className={cn(blockProps.className, "natural-block my-20")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn("rounded-[2.5rem] p-12 md:p-16", s.bgColor === "bg-transparent" ? "bg-card" : s.bgColor, `text-${s.textAlign}`)}>
        <div className="max-w-2xl mx-auto space-y-8">
          <h2
            className={cn(s.titleSize(), s.titleWeight, s.titleColor, "tracking-tight")}
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {title}
          </h2>
          <p className={cn(s.descSize, s.descColor, "leading-relaxed")}>
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            <button className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:scale-105 transition-all">
              {buttonText}
            </button>
          </div>
        </div>
        </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

registerChaiBlock(NaturalNewsletterBlock, {
  type: "NaturalNewsletter",
  label: "Natural Newsletter",
  category: "cta",
  group: "sections",
  inlineEditProps: ["title", "description", "buttonText"],
  schema: {
    properties: {
      styles: StylesProp(""),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "Stay inspired.",
      }),
      description: builderProp({
        type: "string",
        title: "Açıklama",
        default: "Subscribe to receive our latest articles and insights directly in your inbox.",
        ui: { "ui:widget": "textarea" },
      }),
      buttonText: builderProp({
        type: "string",
        title: "Buton Metni",
        default: "Subscribe",
      }),
      ...commonStyleSchemaProps({ bgColor: "card", textAlign: "center", titleSize: "3xl" }),
    },
  },
});

export { NaturalNewsletterBlock };
