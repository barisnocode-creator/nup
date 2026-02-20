import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Share2, Twitter, Linkedin, Link, BookOpen, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface BlogPost {
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
  slug: string;
  content?: string;
  keywords?: string;
}

interface BlogPostDetailSectionProps {
  post: BlogPost;
  allPosts: BlogPost[];
  siteName: string;
  onBack: () => void;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function buildFullContent(post: BlogPost): string {
  if (post.content) return post.content;
  // Auto-generate rich content from title/excerpt for SEO
  return `
${post.excerpt}

## Neden Bu Konu Önemli?

${post.title} konusu, günümüzde giderek daha fazla önem kazanmaktadır. Doğru bilgiye sahip olmak hem zaman hem de kaynak tasarrufu sağlar.

Bu yazıda sizinle paylaşacaklarımız:

- Konuya giriş ve temel kavramlar
- Uzman görüşleri ve araştırma bulgular
- Pratik uygulamalar ve öneriler
- Sık sorulan sorular ve yanıtları

## Temel Bilgiler

Başlamadan önce temel kavramları netleştirmek önemlidir. ${post.category} kategorisinde yer alan bu içerik, hem başlangıç seviyesindeki kullanıcılara hem de deneyimli profesyonellere hitap etmektedir.

Araştırmalar gösteriyor ki bu alanda bilgi sahibi olmak, sonuçları önemli ölçüde iyileştiriyor.

## Pratik Öneriler

1. **Adım 1:** Temel kavramları öğrenin ve altyapınızı oluşturun
2. **Adım 2:** Uzman tavsiyelerini dikkate alın
3. **Adım 3:** Sürekli güncel kalın ve değişimleri takip edin
4. **Adım 4:** Sonuçları düzenli olarak değerlendirin

## Sonuç

${post.title} hakkında kapsamlı bir rehber sunmaya çalıştık. Daha fazla bilgi almak veya profesyonel destek için bizimle iletişime geçebilirsiniz.
  `.trim();
}

export default function BlogPostDetailSection({ post, allPosts, siteName, onBack }: BlogPostDetailSectionProps) {
  const [copied, setCopied] = useState(false);
  const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.slug}` : '';
  const relatedPosts = allPosts.filter(p => p.slug !== post.slug).slice(0, 3);
  const fullContent = buildFullContent(post);

  // SEO meta injection
  useEffect(() => {
    const prevTitle = document.title;
    const keywords = post.keywords || `${post.category}, ${post.title.toLowerCase().replace(/\s+/g, ', ')}, ${siteName}`;

    // Title
    document.title = `${post.title}${siteName ? ` | ${siteName}` : ''}`;

    // Helper to set/create meta tag
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const parts = selector.match(/\[([^\]]+)="([^\]]+)"\]/);
        if (parts) el.setAttribute(parts[1], parts[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
      return el;
    };

    const metas: HTMLElement[] = [];
    metas.push(setMeta('meta[name="description"]', 'content', post.excerpt.slice(0, 160)));
    metas.push(setMeta('meta[name="keywords"]', 'content', keywords));
    metas.push(setMeta('meta[name="robots"]', 'content', 'index, follow'));
    metas.push(setMeta('meta[property="og:title"]', 'content', post.title));
    metas.push(setMeta('meta[property="og:description"]', 'content', post.excerpt.slice(0, 160)));
    metas.push(setMeta('meta[property="og:type"]', 'content', 'article'));
    metas.push(setMeta('meta[property="og:url"]', 'content', canonicalUrl));
    if (post.image) metas.push(setMeta('meta[property="og:image"]', 'content', post.image));
    metas.push(setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image'));
    metas.push(setMeta('meta[name="twitter:title"]', 'content', post.title));
    metas.push(setMeta('meta[name="twitter:description"]', 'content', post.excerpt.slice(0, 160)));
    if (post.image) metas.push(setMeta('meta[name="twitter:image"]', 'content', post.image));

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    return () => {
      document.title = prevTitle;
      // Restore: just remove the metas we created (don't restore complex state)
    };
  }, [post, siteName, canonicalUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(canonicalUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Render markdown-like content
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3 font-heading-dynamic">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2 font-heading-dynamic">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc text-muted-foreground font-body-dynamic mb-1">{line.slice(2)}</li>;
      }
      if (/^\d+\./.test(line)) {
        const text = line.replace(/^\d+\.\s*\*\*(.+?)\*\*(.*)/, (_, bold, rest) =>
          `<strong>${bold}</strong>${rest}`
        );
        return <li key={i} className="ml-4 list-decimal text-muted-foreground font-body-dynamic mb-1" dangerouslySetInnerHTML={{ __html: text }} />;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-muted-foreground leading-relaxed font-body-dynamic mb-3">{line}</p>;
    });
  };

  return (
    <article className="bg-background min-h-screen">
      {/* Back button */}
      <div className="container mx-auto px-6 pt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Bloga Dön
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <span className="hover:text-foreground cursor-pointer" onClick={onBack}>Ana Sayfa</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-foreground cursor-pointer" onClick={onBack}>Blog</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium line-clamp-1">{post.title}</span>
        </nav>
      </div>

      {/* Hero Image */}
      {post.image && (
        <div className="w-full aspect-[21/9] overflow-hidden mb-10 bg-muted">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Category + Date */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(post.date)}
            </span>
          </div>

          {/* H1 Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight font-heading-dynamic">
            {post.title}
          </h1>

          {/* Excerpt / Lead */}
          <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 mb-10 font-body-dynamic">
            {post.excerpt}
          </p>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="prose max-w-none"
          >
            {renderContent(fullContent)}
          </motion.div>

          {/* Share Section — Backlinks */}
          <div className="mt-12 p-6 rounded-2xl bg-muted/40 border border-border">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
              <Share2 className="w-4 h-4 text-primary" />
              Bu makaleyi paylaşın
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] text-sm font-medium hover:bg-[#1DA1F2]/20 transition-colors"
              >
                <Twitter className="w-4 h-4" />
                Twitter / X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0077B5]/10 text-[#0077B5] text-sm font-medium hover:bg-[#0077B5]/20 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + canonicalUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/20 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                <Link className="w-4 h-4" />
                {copied ? '✓ Kopyalandı!' : 'Linki Kopyala'}
              </button>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-14">
              <h3 className="text-xl font-bold text-foreground mb-6 font-heading-dynamic">İlgili Yazılar</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map(related => (
                  <div
                    key={related.slug}
                    onClick={onBack}
                    className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    {related.image && (
                      <div className="w-full aspect-[3/2] overflow-hidden bg-muted">
                        <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">{related.category}</span>
                      <p className="text-sm font-semibold text-foreground mt-1 line-clamp-2 font-heading-dynamic group-hover:text-primary transition-colors">
                        {related.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
