import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, BookOpen, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
  slug: string;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function PublicBlogPage() {
  const { subdomain } = useParams<{ subdomain: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [sectionTitle, setSectionTitle] = useState('Blog & Haberler');
  const [sectionSubtitle, setSectionSubtitle] = useState('Güncel makalelerimizi keşfedin');
  const [siteName, setSiteName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subdomain) return;
    supabase
      .from('public_projects')
      .select('site_sections, name')
      .eq('subdomain', subdomain)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setSiteName(data.name || '');
        const sections = (data.site_sections as any[]) || [];
        const blogSection = sections.find((s: any) => s.type === 'AddableBlog');
        if (blogSection?.props) {
          const p = blogSection.props;
          setSectionTitle(p.sectionTitle || 'Blog & Haberler');
          setSectionSubtitle(p.sectionSubtitle || 'Güncel makalelerimizi keşfedin');
          setPosts([
            { title: p.post1Title || 'Sektördeki Son Gelişmeler', category: p.post1Category || 'Genel', excerpt: p.post1Excerpt || '', image: p.post1Image || '', date: p.post1Date || '', slug: p.post1Slug || 'post-1' },
            { title: p.post2Title || 'Profesyonellerden İpuçları', category: p.post2Category || 'İpuçları', excerpt: p.post2Excerpt || '', image: p.post2Image || '', date: p.post2Date || '', slug: p.post2Slug || 'post-2' },
            { title: p.post3Title || 'Sık Yapılan Hatalar', category: p.post3Category || 'Rehber', excerpt: p.post3Excerpt || '', image: p.post3Image || '', date: p.post3Date || '', slug: p.post3Slug || 'post-3' },
            { title: p.post4Title || 'Başarılı Sonuçlar İçin', category: p.post4Category || 'Başarı', excerpt: p.post4Excerpt || '', image: p.post4Image || '', date: p.post4Date || '', slug: p.post4Slug || 'post-4' },
          ]);
        }
        setLoading(false);
      });
  }, [subdomain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Nav */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(`/site/${subdomain}`)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-semibold text-foreground">Blog</span>
        </div>
      </header>

      <main className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Blog
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{sectionTitle}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{sectionSubtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/site/${subdomain}/blog/${post.slug}`)}
              >
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="w-full aspect-[3/2] relative overflow-hidden bg-muted">
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[11px] font-semibold text-foreground shadow-sm">
                        <Tag className="w-2.5 h-2.5 text-primary" />
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </div>
                    <h2 className="text-base font-bold text-foreground mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-200">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
