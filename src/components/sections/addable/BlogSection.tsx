import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react';
import type { SectionComponentProps } from '../types';
import BlogPostDetailSection from './BlogPostDetailSection';
import { supabase } from '@/integrations/supabase/client';

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

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getCategoryQuery(category: string, title: string): string {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('ipuç') || cat.includes('tips')) return 'tips advice professional guide';
  if (cat.includes('rehber') || cat.includes('guide')) return 'guide tutorial steps learning';
  if (cat.includes('başar') || cat.includes('success')) return 'success achievement business growth';
  if (cat.includes('sağlık') || cat.includes('health')) return 'healthcare medical wellness professional';
  if (cat.includes('hukuk') || cat.includes('law')) return 'law legal office professional';
  // Başlıktan keyword çıkar (ilk 3 anlamlı kelime)
  const keywords = title.split(' ').filter(w => w.length > 3).slice(0, 3).join(' ');
  if (keywords.length > 5) return `${keywords} professional`;
  return 'professional blog article modern office';
}

export function BlogSection({ section, isEditing, onUpdate }: SectionComponentProps) {
  const props = section.props || {};
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(null);
  const [autoImages, setAutoImages] = useState<Record<string, string>>({});
  const fetchedRef = useRef(false);

  const sectionTitle = props.sectionTitle || 'Blog & Haberler';
  const sectionSubtitle = props.sectionSubtitle || 'Güncel makalelerimizi ve sektör bilgilerini keşfedin';
  const siteName = props.siteName || '';

  const posts: BlogPost[] = [
    {
      title: props.post1Title || 'Sektördeki Son Gelişmeler ve Trendler',
      category: props.post1Category || 'Genel',
      excerpt: props.post1Excerpt || 'Sektörümüzdeki en güncel gelişmeleri, yenilikleri ve önemli trendleri sizin için derliyoruz. Bu yazıda bilmeniz gereken tüm detayları bulabilirsiniz.',
      image: props.post1Image || '',
      date: props.post1Date || '2026-01-15',
      slug: props.post1Slug || 'sektor-son-gelismeler',
      content: props.post1Content || '',
      keywords: props.post1Keywords || '',
    },
    {
      title: props.post2Title || 'Profesyonellerden Pratik İpuçları ve Öneriler',
      category: props.post2Category || 'İpuçları',
      excerpt: props.post2Excerpt || 'Alanında uzman profesyonellerden derlediğimiz pratik ipuçları ve önerilerle işinizi ve yaşamınızı kolaylaştırın.',
      image: props.post2Image || '',
      date: props.post2Date || '2026-01-22',
      slug: props.post2Slug || 'profesyonel-ipuclari',
      content: props.post2Content || '',
      keywords: props.post2Keywords || '',
    },
    {
      title: props.post3Title || 'Sık Yapılan Hatalar ve Nasıl Önlenir?',
      category: props.post3Category || 'Rehber',
      excerpt: props.post3Excerpt || 'En yaygın yapılan hatalar nelerdir? Bu rehberde sık karşılaşılan sorunları ve bunlardan nasıl korunabileceğinizi adım adım anlatıyoruz.',
      image: props.post3Image || '',
      date: props.post3Date || '2026-02-01',
      slug: props.post3Slug || 'sik-yapilan-hatalar',
      content: props.post3Content || '',
      keywords: props.post3Keywords || '',
    },
    {
      title: props.post4Title || 'Başarılı Sonuçlar İçin Bilmeniz Gerekenler',
      category: props.post4Category || 'Başarı',
      excerpt: props.post4Excerpt || 'Başarılı sonuçlara ulaşmak için hangi adımları izlemelisiniz? Uzman görüşleri ve gerçek vakalar ışığında kapsamlı bir inceleme.',
      image: props.post4Image || '',
      date: props.post4Date || '2026-02-10',
      slug: props.post4Slug || 'basarili-sonuclar',
      content: props.post4Content || '',
      keywords: props.post4Keywords || '',
    },
  ];

  // Pixabay otomatik görsel çekme — sadece bir kez, boş görseller için
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchMissing = async () => {
      for (const post of posts) {
        if (!post.image) {
          const query = getCategoryQuery(post.category, post.title);
          try {
            const { data } = await supabase.functions.invoke('search-pixabay', {
              body: { query, perPage: 5 },
            });
            if (data?.images?.[0]) {
              setAutoImages(prev => ({
                ...prev,
                [post.slug]: data.images[0].webformatURL,
              }));
            }
          } catch {
            // sessizce geç
          }
        }
      }
    };

    fetchMissing();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activePost = activeBlogSlug ? posts.find(p => p.slug === activeBlogSlug) : null;

  if (activePost) {
    return (
      <BlogPostDetailSection
        post={activePost}
        allPosts={posts}
        siteName={siteName}
        onBack={() => setActiveBlogSlug(null)}
      />
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Blog
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading-dynamic">
            {sectionTitle}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body-dynamic">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => {
              const displayImage = post.image || autoImages[post.slug] || '';
              return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => {
                  if (isEditing) {
                    setActiveBlogSlug(post.slug);
                  } else {
                    const pathParts = window.location.pathname.split('/');
                    const sub = pathParts[2];
                    window.open(`/site/${sub}/blog/${post.slug}`, '_blank');
                  }
                }}
              >
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Image 3:2 */}
                  <div className="w-full aspect-[3/2] relative overflow-hidden bg-muted">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-primary/40 animate-pulse" />
                      </div>
                    )}
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[11px] font-semibold text-foreground shadow-sm">
                        <Tag className="w-2.5 h-2.5 text-primary" />
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </div>

                    <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 leading-snug font-heading-dynamic group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-body-dynamic flex-1">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 pt-4 border-t border-border flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-200">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
