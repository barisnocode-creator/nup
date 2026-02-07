import { 
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";

export type ContactFormProps = {
  styles: ChaiStyles;
  sectionTitle: string;
  sectionSubtitle: string;
  sectionDescription: string;
  email: string;
  phone: string;
  address: string;
  submitButtonText: string;
};

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
  } = props;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inBuilder) return;
    // Form submission logic would go here
  };

  return (
    <section {...blockProps} className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="space-y-8">
            {sectionSubtitle && (
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {sectionSubtitle}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {sectionTitle}
            </h2>
            {sectionDescription && (
              <p className="text-lg text-muted-foreground max-w-md">
                {sectionDescription}
              </p>
            )}

            {/* Contact Info */}
            <div className="space-y-6 pt-4">
              {email && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">E-posta</div>
                    <div className="font-medium text-foreground">{email}</div>
                  </div>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Telefon</div>
                    <div className="font-medium text-foreground">{phone}</div>
                  </div>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Adres</div>
                    <div className="font-medium text-foreground">{address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="p-8 rounded-2xl bg-card border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Adınız
                  </label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Adınızı girin"
                    disabled={inBuilder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    E-posta
                  </label>
                  <input 
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="E-posta adresiniz"
                    disabled={inBuilder}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Konu
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Konu başlığı"
                  disabled={inBuilder}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mesajınız
                </label>
                <textarea 
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Mesajınızı yazın..."
                  disabled={inBuilder}
                />
              </div>
              <button 
                type="submit"
                className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                disabled={inBuilder}
              >
                {submitButtonText}
              </button>
            </form>
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
    },
  },
});

export { ContactFormBlock };
