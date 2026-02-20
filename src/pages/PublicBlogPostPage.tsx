import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BlogPostDetailSection from '@/components/sections/addable/BlogPostDetailSection';

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

export default function PublicBlogPostPage() {
  const { subdomain, slug } = useParams<{ subdomain: string; slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [siteName, setSiteName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!subdomain || !slug) return;
    supabase
      .from('public_projects')
      .select('site_sections, name')
      .eq('subdomain', subdomain)
      .single()
      .then(({ data }) => {
        if (!data) { setNotFound(true); setLoading(false); return; }
        setSiteName(data.name || '');
        const sections = (data.site_sections as any[]) || [];
        const blogSection = sections.find((s: any) => s.type === 'AddableBlog');
        if (!blogSection?.props) { setNotFound(true); setLoading(false); return; }
        const p = blogSection.props;
        const posts: BlogPost[] = [
          { title: p.post1Title || '', category: p.post1Category || 'Genel', excerpt: p.post1Excerpt || '', image: p.post1Image || '', date: p.post1Date || '', slug: p.post1Slug || 'post-1', content: p.post1Content || '', keywords: p.post1Keywords || '' },
          { title: p.post2Title || '', category: p.post2Category || 'İpuçları', excerpt: p.post2Excerpt || '', image: p.post2Image || '', date: p.post2Date || '', slug: p.post2Slug || 'post-2', content: p.post2Content || '', keywords: p.post2Keywords || '' },
          { title: p.post3Title || '', category: p.post3Category || 'Rehber', excerpt: p.post3Excerpt || '', image: p.post3Image || '', date: p.post3Date || '', slug: p.post3Slug || 'post-3', content: p.post3Content || '', keywords: p.post3Keywords || '' },
          { title: p.post4Title || '', category: p.post4Category || 'Başarı', excerpt: p.post4Excerpt || '', image: p.post4Image || '', date: p.post4Date || '', slug: p.post4Slug || 'post-4', content: p.post4Content || '', keywords: p.post4Keywords || '' },
        ];
        setAllPosts(posts);
        const found = posts.find(po => po.slug === slug);
        if (!found) { setNotFound(true); } else { setPost(found); }
        setLoading(false);
      });
  }, [subdomain, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Blog yazısı bulunamadı.</p>
        <button
          onClick={() => navigate(`/site/${subdomain}`)}
          className="text-primary hover:underline text-sm"
        >
          Ana sayfaya dön
        </button>
      </div>
    );
  }

  return (
    <BlogPostDetailSection
      post={post}
      allPosts={allPosts}
      siteName={siteName}
      onBack={() => navigate(`/site/${subdomain}`)}
    />
  );
}
