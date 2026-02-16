import {
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { TooltipProvider } from "@/components/ui/tooltip";

export type NaturalIntroProps = {
  styles: ChaiStyles;
  title: string;
  description: string;
};

const NaturalIntroBlock = (props: ChaiBlockComponentProps<NaturalIntroProps>) => {
  const { blockProps, title, description } = props;

  return (
    <TooltipProvider>
      <section
        {...blockProps}
        className="natural-block max-w-4xl mx-auto py-12 md:py-16 px-4"
      >
        <div className="text-center space-y-6">
          <h2
            className="text-3xl md:text-4xl leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700 }}
          >
            {title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        </div>
      </section>
    </TooltipProvider>
  );
};

registerChaiBlock(NaturalIntroBlock, {
  type: "NaturalIntro",
  label: "Natural Intro",
  category: "about",
  group: "sections",
  inlineEditProps: ["title", "description"],
  schema: {
    properties: {
      styles: StylesProp(""),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "Perspective is a space for exploring ideas, finding inspiration, and discovering new ways of seeing the world.",
        ui: { "ui:widget": "textarea" },
      }),
      description: builderProp({
        type: "string",
        title: "Açıklama",
        default: "We believe in the power of thoughtful storytelling. Our platform brings together diverse voices and perspectives to create meaningful conversations about life, wellness, creativity, and personal growth.",
        ui: { "ui:widget": "textarea" },
      }),
    },
  },
});

export { NaturalIntroBlock };
