import {
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { TooltipProvider } from "@/components/ui/tooltip";

export type NaturalNewsletterProps = {
  styles: ChaiStyles;
  title: string;
  description: string;
  buttonText: string;
};

const NaturalNewsletterBlock = (props: ChaiBlockComponentProps<NaturalNewsletterProps>) => {
  const { blockProps, title, description, buttonText } = props;

  return (
    <TooltipProvider>
      <section
        {...blockProps}
        className="natural-block my-20 rounded-[2.5rem] bg-card p-12 md:p-16 text-center"
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <h2
            className="text-4xl md:text-5xl tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700 }}
          >
            {title}
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
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
    },
  },
});

export { NaturalNewsletterBlock };
