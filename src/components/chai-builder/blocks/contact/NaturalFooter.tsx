import {
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";

export type NaturalFooterProps = {
  styles: ChaiStyles;
  siteName: string;
};

const NaturalFooterBlock = (props: ChaiBlockComponentProps<NaturalFooterProps>) => {
  const { blockProps, siteName, inBuilder } = props;

  return (
    <footer {...blockProps} className="natural-block border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href={inBuilder ? "#" : "#"} className="hover:text-accent transition-colors">Wellness</a></li>
              <li><a href={inBuilder ? "#" : "#"} className="hover:text-accent transition-colors">Travel</a></li>
              <li><a href={inBuilder ? "#" : "#"} className="hover:text-accent transition-colors">Creativity</a></li>
              <li><a href={inBuilder ? "#" : "#"} className="hover:text-accent transition-colors">Growth</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href={inBuilder ? "#" : "#about"} className="hover:text-accent transition-colors">Our Story</a></li>
              <li><a href={inBuilder ? "#" : "#"} className="hover:text-accent transition-colors">Authors</a></li>
              <li><a href={inBuilder ? "#" : "#contact"} className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href={inBuilder ? "#" : "#"} className="hover:text-accent transition-colors">Style Guide</a></li>
              <li><a href={inBuilder ? "#" : "#contact"} className="hover:text-accent transition-colors">Newsletter</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href={inBuilder ? "#" : "#"} className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href={inBuilder ? "#" : "#"} className="hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

registerChaiBlock(NaturalFooterBlock, {
  type: "NaturalFooter",
  label: "Natural Footer",
  category: "contact",
  group: "sections",
  inlineEditProps: ["siteName"],
  schema: {
    properties: {
      styles: StylesProp(""),
      siteName: builderProp({
        type: "string",
        title: "Site Adı",
        default: "Perspective",
      }),
    },
  },
});

export { NaturalFooterBlock };
