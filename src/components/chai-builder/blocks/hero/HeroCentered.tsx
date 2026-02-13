import React from 'react';
import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { heroCenteredTitleSizeMap, resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";
import { EditableChaiBackground } from "../shared/EditableChaiImage";

export type HeroCenteredProps = {
  styles: ChaiStyles;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundImage: string;
} & CommonStyleProps;

const HeroCenteredBlock = (props: ChaiBlockComponentProps<HeroCenteredProps>) => {
  const { 
    blockProps, 
    title, 
    subtitle, 
    description, 
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
    backgroundImage,
    inBuilder,
    ...styleProps
  } = props;

  const s = resolveStyles(styleProps);

  const innerContent = (
    <>
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Decorative blur orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/15 rounded-full blur-[120px]" />

      <div className="relative container mx-auto px-6 h-full flex items-end pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-end w-full">
          {/* Left: Title + Description */}
          <div className="space-y-6">
            {subtitle && (
              <span className={`inline-block px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium ${s.subtitleTransform}`}>
                {subtitle}
              </span>
            )}
            
            <h1 className={`${s.titleSize(heroCenteredTitleSizeMap)} font-bold text-white leading-[0.95] tracking-tight font-serif`}>
              {title}
            </h1>
            
            <p className="text-lg text-white/80 max-w-lg leading-relaxed">
              {description}
            </p>
          </div>

          {/* Right: Glassmorphism form */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-white font-semibold text-lg mb-6">Hemen Başlayın</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Adınız" 
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                disabled={inBuilder}
              />
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                disabled={inBuilder}
              />
              <input 
                type="tel" 
                placeholder="Telefon numaranız" 
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                disabled={inBuilder}
              />
              <a
                href={inBuilder ? "#" : primaryButtonLink}
                className="block w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium text-center hover:bg-primary/90 transition-colors"
              >
                {primaryButtonText || "Gönder"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom center: Discover button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70">
        <span className="text-xs tracking-widest uppercase">Keşfet</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </>
  );

  return (
    <EditableChaiBackground
      backgroundImage={backgroundImage}
      className="relative min-h-screen flex flex-col overflow-hidden bg-foreground"
      inBuilder={inBuilder}
    >
      <section {...blockProps} className="contents">
        {innerContent}
      </section>
    </EditableChaiBackground>
  );
};

registerChaiBlock(HeroCenteredBlock, {
  type: "HeroCentered",
  label: "Hero - Ortalanmış",
  category: "hero",
  group: "sections",
  inlineEditProps: ['title', 'subtitle', 'description', 'primaryButtonText', 'secondaryButtonText'],
  schema: {
    properties: {
      styles: StylesProp("min-h-screen"),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "İşinizi Büyütmek İçin Buradayız",
      }),
      subtitle: builderProp({
        type: "string",
        title: "Alt Başlık", 
        default: "Dijital Çözümler",
      }),
      description: builderProp({
        type: "string",
        title: "Açıklama",
        default: "Modern teknoloji ve yaratıcı tasarım ile işletmenizi bir adım öne taşıyoruz.",
        ui: { "ui:widget": "textarea" },
      }),
      primaryButtonText: builderProp({
        type: "string",
        title: "Ana Buton Metni",
        default: "Ücretsiz Başlayın",
      }),
      primaryButtonLink: builderProp({
        type: "string",
        title: "Ana Buton Linki",
        default: "#contact",
      }),
      secondaryButtonText: builderProp({
        type: "string",
        title: "İkinci Buton Metni",
        default: "Daha Fazla Bilgi",
      }),
      secondaryButtonLink: builderProp({
        type: "string",
        title: "İkinci Buton Linki",
        default: "#about",
      }),
      backgroundImage: builderProp({
        type: "string",
        title: "Arka Plan Görseli",
        default: "",
        ui: { "ui:widget": "image" },
      }),
      ...commonStyleSchemaProps({ bgColor: "background", textAlign: "center" }),
    },
  },
});

export { HeroCenteredBlock };
