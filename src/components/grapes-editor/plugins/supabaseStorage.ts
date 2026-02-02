import type { Editor, StorageOptions as GjsStorageOptions } from 'grapesjs';
import { supabase } from '@/integrations/supabase/client';

interface PluginOptions {
  projectId: string;
}

export function supabaseStoragePlugin(editor: Editor, opts: PluginOptions) {
  const { projectId } = opts;

  if (!projectId) {
    console.warn('supabaseStoragePlugin: No projectId provided');
    return;
  }

  // Add custom storage adapter
  editor.Storage.add('supabase', {
    async load(options: GjsStorageOptions): Promise<Record<string, any>> {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('grapes_content')
          .eq('id', projectId)
          .single();

        if (error) {
          console.error('Error loading from Supabase:', error);
          return {};
        }

        // Handle the grapes_content type properly
        const grapesContent = data?.grapes_content;
        
        // Return empty object if null or not an object
        if (!grapesContent || typeof grapesContent !== 'object' || Array.isArray(grapesContent)) {
          return {};
        }

        return grapesContent as Record<string, any>;
      } catch (err) {
        console.error('Supabase load error:', err);
        return {};
      }
    },

    async store(data: Record<string, any>, options: GjsStorageOptions): Promise<void> {
      try {
        const { error } = await supabase
          .from('projects')
          .update({
            grapes_content: data as any,
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId);

        if (error) {
          console.error('Error saving to Supabase:', error);
          throw error;
        }

        console.log('GrapeJS content saved to Supabase');
      } catch (err) {
        console.error('Supabase store error:', err);
        throw err;
      }
    },
  });
}

// Helper function to convert GeneratedContent to GrapeJS format
export function convertToGrapesFormat(content: any, templateId: string): Record<string, any> {
  // Safety checks
  if (!content || typeof content !== 'object') return {};

  // If already in GrapeJS format (has components/styles keys), return as-is
  if (content.components || content.styles || content['gjs-components'] || content['gjs-html']) {
    return content;
  }

  // Convert from GeneratedContent format
  try {
    const html = generateHtmlFromContent(content, templateId);
    const css = generateCssFromContent(content);
    const assets = extractAssetsFromContent(content);

    return {
      'gjs-html': html,
      'gjs-css': css,
      'gjs-components': [],
      'gjs-styles': [],
      'gjs-assets': assets,
    };
  } catch (error) {
    console.error('Format conversion error:', error);
    return {};
  }
}

function generateHtmlFromContent(content: any, templateId: string): string {
  const { pages, metadata } = content;
  
  if (!pages?.home) return '<div class="container mx-auto p-8"><h1>Site Yükleniyor...</h1></div>';

  return `
    <div class="website-container">
      <!-- Hero Section -->
      <section class="hero-section min-h-[80vh] flex items-center">
        <div class="container mx-auto px-6">
          <div class="max-w-3xl">
            <span class="text-primary font-medium">${pages.home.hero?.subtitle || ''}</span>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">${pages.home.hero?.title || metadata?.siteName || 'Hoş Geldiniz'}</h1>
            <p class="text-lg text-muted-foreground mb-8">${pages.home.hero?.description || ''}</p>
            <button class="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium">Başla</button>
          </div>
        </div>
      </section>

      <!-- Welcome Section -->
      <section class="welcome-section py-20">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold mb-6">${pages.home.welcome?.title || 'Hoş Geldiniz'}</h2>
          <p class="text-muted-foreground">${pages.home.welcome?.content || ''}</p>
        </div>
      </section>

      <!-- Services Section -->
      <section class="services-section py-20 bg-muted/30">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-4">Hizmetlerimiz</h2>
            <p class="text-muted-foreground max-w-2xl mx-auto">Size en iyi hizmeti sunmak için buradayız.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${(pages.home.highlights || []).map((h: any) => `
              <div class="service-card bg-background p-8 rounded-xl shadow-sm">
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span class="text-2xl">${h.icon || '⚡'}</span>
                </div>
                <h3 class="text-xl font-semibold mb-3">${h.title}</h3>
                <p class="text-muted-foreground">${h.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="contact-section py-20">
        <div class="container mx-auto px-6">
          <div class="max-w-xl mx-auto text-center">
            <h2 class="text-3xl font-bold mb-4">İletişim</h2>
            <p class="text-muted-foreground mb-8">Bizimle iletişime geçin.</p>
            <div class="space-y-4">
              ${pages.contact?.info?.phone ? `<p>📞 ${pages.contact.info.phone}</p>` : ''}
              ${pages.contact?.info?.email ? `<p>✉️ ${pages.contact.info.email}</p>` : ''}
              ${pages.contact?.info?.address ? `<p>📍 ${pages.contact.info.address}</p>` : ''}
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-12 bg-muted/50 border-t">
        <div class="container mx-auto px-6 text-center">
          <p class="text-muted-foreground">© ${new Date().getFullYear()} ${metadata?.siteName || 'Site'}. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  `;
}

function generateCssFromContent(content: any): string {
  return `
    .website-container {
      min-height: 100vh;
    }
    
    .service-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }
  `;
}

function extractAssetsFromContent(content: any): Array<{ src: string; type: string }> {
  const assets: Array<{ src: string; type: string }> = [];
  
  if (content?.images) {
    Object.values(content.images).forEach((url) => {
      if (typeof url === 'string' && url) {
        assets.push({ src: url, type: 'image' });
      }
    });
  }
  
  return assets;
}
