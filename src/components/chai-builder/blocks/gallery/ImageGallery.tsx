import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";
import { EditableChaiImage } from "../shared/EditableChaiImage";
import { TooltipProvider } from "@/components/ui/tooltip";

export type ImageGalleryProps = {
  styles: ChaiStyles;
  title: string;
  subtitle: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  image6: string;
  columns: "2" | "3" | "4";
} & CommonStyleProps;

const ImageGalleryBlock = (props: ChaiBlockComponentProps<ImageGalleryProps>) => {
  const { 
    blockProps, 
    title,
    subtitle,
    image1, image2, image3, image4, image5, image6,
    columns = "3",
    ...styleProps
  } = props;

  const s = resolveStyles(styleProps);
  const images = [image1, image2, image3, image4, image5, image6].filter(Boolean);
  const gridCols = { "2": "md:grid-cols-2", "3": "md:grid-cols-3", "4": "md:grid-cols-4" };

  return (
    <TooltipProvider>
    <section {...blockProps} className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        {(title || subtitle) && (
          <div className={`text-${s.textAlign} mb-12`}>
            {subtitle && (
              <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 ${s.subtitleTransform}`}>
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor}`}>
                {title}
              </h2>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
          {images.map((image, index) => (
            <div key={index} className="relative group overflow-hidden rounded-xl aspect-square">
              <EditableChaiImage 
                src={image || "/placeholder.svg"} 
                alt={`Galeri ${index + 1}`}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
                inBuilder={props.inBuilder}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
    </TooltipProvider>
  );
};

registerChaiBlock(ImageGalleryBlock, {
  type: "ImageGallery",
  label: "Görsel Galeri",
  category: "gallery",
  group: "sections",
  inlineEditProps: ['title', 'subtitle'],
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-background"),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "Galeri",
      }),
      subtitle: builderProp({
        type: "string",
        title: "Alt Başlık",
        default: "Çalışmalarımız",
      }),
      columns: builderProp({
        type: "string",
        title: "Sütun Sayısı",
        default: "3",
        enum: ["2", "3", "4"],
      }),
      image1: builderProp({ type: "string", title: "Görsel 1", default: "", ui: { "ui:widget": "image" } }),
      image2: builderProp({ type: "string", title: "Görsel 2", default: "", ui: { "ui:widget": "image" } }),
      image3: builderProp({ type: "string", title: "Görsel 3", default: "", ui: { "ui:widget": "image" } }),
      image4: builderProp({ type: "string", title: "Görsel 4", default: "", ui: { "ui:widget": "image" } }),
      image5: builderProp({ type: "string", title: "Görsel 5", default: "", ui: { "ui:widget": "image" } }),
      image6: builderProp({ type: "string", title: "Görsel 6", default: "", ui: { "ui:widget": "image" } }),
      ...commonStyleSchemaProps({ bgColor: "background", textAlign: "center" }),
    },
  },
});

export { ImageGalleryBlock };
