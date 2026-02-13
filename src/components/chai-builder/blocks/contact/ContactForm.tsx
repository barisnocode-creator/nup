import React from 'react';
import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";

export type ContactFormProps = {
  styles: ChaiStyles;
  sectionTitle: string;
  sectionSubtitle: string;
  sectionDescription: string;
  email: string;
  phone: string;
  address: string;
  submitButtonText: string;
} & CommonStyleProps;

const ContactFormBlock = (props: ChaiBlockComponentProps<ContactFormProps>) => {
  const { 
    blockProps, 
    sectionTitle,
    sectionSubtitle,
    sectionDescription,
    email,
    phone,
    address,
    submitButtonText,
    inBuilder,
    ...styleProps
  } = props;

  const s = resolveStyles(styleProps);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inBuilder) return;
  };

  return (
    <section {...blockProps} className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <div className="space-y-8">
            {sectionSubtitle && (
              <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium ${s.subtitleTransform}`}>
                {sectionSubtitle}
              </span>
            )}
            <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} text-${s.textAlign} font-serif`}>
              {sectionTitle}
            </h2>
            {sectionDescription && (
              <p className={`${s.descSize} ${s.descColor} max-w-md`}>
                {sectionDescription}
              </p>
            )}

            <div className="space-y-6 pt-4">
              {email && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground tracking-wider uppercase">E-posta</div>
                    <div className="font-medium text-foreground">{email}</div>
                  </div>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground tracking-wider uppercase">Telefon</div>
                    <div className="font-medium text-foreground">{phone}</div>
                  </div>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground tracking-wider uppercase">Adres</div>
                    <div className="font-medium text-foreground">{address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Glassmorphism Form */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-2xl opacity-50" />
            <div className="relative p-8 rounded-2xl backdrop-blur-sm bg-card/80 border border-border/50 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Adınız</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Adınızı girin" disabled={inBuilder} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">E-posta</label>
                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="E-posta adresiniz" disabled={inBuilder} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Konu</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Konu başlığı" disabled={inBuilder} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Mesajınız</label>
                  <textarea rows={5} className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all" placeholder="Mesajınızı yazın..." disabled={inBuilder} />
                </div>
                <button type="submit" className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl" disabled={inBuilder}>
                  {submitButtonText}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(ContactFormBlock, {
  type: "ContactForm",
  label: "İletişim Formu",
  category: "contact",
  group: "sections",
  inlineEditProps: ['sectionTitle', 'sectionSubtitle', 'sectionDescription'],
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-background"),
      sectionTitle: builderProp({
        type: "string",
        title: "Bölüm Başlığı",
        default: "Bizimle İletişime Geçin",
      }),
      sectionSubtitle: builderProp({
        type: "string",
        title: "Bölüm Alt Başlığı",
        default: "İletişim",
      }),
      sectionDescription: builderProp({
        type: "string",
        title: "Açıklama",
        default: "Sorularınız mı var? Bize ulaşın, en kısa sürede yanıt verelim.",
        ui: { "ui:widget": "textarea" },
      }),
      email: builderProp({
        type: "string",
        title: "E-posta",
        default: "info@example.com",
      }),
      phone: builderProp({
        type: "string",
        title: "Telefon",
        default: "+90 555 123 4567",
      }),
      address: builderProp({
        type: "string",
        title: "Adres",
        default: "İstanbul, Türkiye",
      }),
      submitButtonText: builderProp({
        type: "string",
        title: "Gönder Butonu Metni",
        default: "Mesaj Gönder",
      }),
      ...commonStyleSchemaProps({ bgColor: "background", textAlign: "left" }),
    },
  },
});

export { ContactFormBlock };
