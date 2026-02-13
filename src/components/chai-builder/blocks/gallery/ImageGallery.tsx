import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";
import { EditableChaiImage } from "../shared/EditableChaiImage";

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

  // Double images for infinite marquee
  const marqueeImages = images.length > 0 ? [...images, ...images] : [];

  return (
    <section {...blockProps} className={`${s.sectionPadding} bg-foreground text-background overflow-hidden`}>
      <div className="container mx-auto px-6 mb-12">
        {(title || subtitle) && (
          <div className={`text-${s.textAlign}`}>
            {subtitle && (
              <span className="inline-block px-4 py-2 bg-background/10 text-background/70 rounded-full text-sm font-medium mb-4 tracking-widest uppercase">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background font-serif">
                {title}
              </h2>
            )}
          </div>
        )}
      </div>

      {marqueeImages.length > 0 ? (
        <div className="relative group">
          <div 
            className="flex gap-6 hover:[animation-play-state:paused]"
            style={{
              animation: 'marquee 30s linear infinite',
              width: 'max-content',
            }}
          >
            {marqueeImages.map((image, index) => (
              <div key={index} className="flex-shrink-0 w-72 md:w-96 aspect-[4/3] rounded-xl overflow-hidden relative">
                <EditableChaiImage 
                  src={image || "/placeholder.svg"} 
                  alt={`Galeri ${(index % images.length) + 1}`}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                  inBuilder={props.inBuilder}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
          {/* Marquee CSS */}
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      ) : (
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-background/10 flex items-center justify-center">
                <span className="text-background/30 text-sm">Görsel {i}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
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
