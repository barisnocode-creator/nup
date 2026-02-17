import {
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";

export type NaturalIntroProps = {
  styles: ChaiStyles;
  title: string;
  description: string;
} & CommonStyleProps;

const NaturalIntroBlock = (props: ChaiBlockComponentProps<NaturalIntroProps>) => {
  const { blockProps, title, description, ...styleProps } = props;
  const s = resolveStyles(styleProps);

  return (
    <TooltipProvider>
      <section
        {...blockProps}
        className={cn(blockProps.className, "natural-block max-w-4xl mx-auto px-4", s.bgColor, s.sectionPadding)}
      >
        <div className={cn("space-y-6", `text-${s.textAlign}`)}>
          <h2
            className={cn(s.titleSize(), s.titleWeight, s.titleColor, "leading-tight")}
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {title}
          </h2>
          <p className={cn(s.descSize, s.descColor, "leading-relaxed max-w-3xl mx-auto")}>
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
      ...commonStyleSchemaProps({ bgColor: "transparent", textAlign: "center", sectionPadding: "sm" }),
    },
  },
});

export { NaturalIntroBlock };
