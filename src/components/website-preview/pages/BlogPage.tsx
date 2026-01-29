import { Calendar, Tag, ArrowRight, Lock } from 'lucide-react';
import { BlogPost } from '@/types/generated-website';

interface BlogPageProps {
  hero: {
    title: string;
    subtitle: string;
  };
  posts: BlogPost[];
  isDark: boolean;
  isNeutral: boolean;
  isEditable?: boolean;
  onLockedFeature?: (feature: string) => void;
  onViewPost?: (postId: string) => void;
  heroImage?: string;
}

export function BlogPage({ 
  hero, 
  posts, 
  isDark, 
  isNeutral, 
  isEditable = false, 
  onLockedFeature,
  onViewPost,
  heroImage
}: BlogPageProps) {
  const heroGradient = isDark 
    ? 'from-slate-800 to-slate-900' 
    : isNeutral 
      ? 'from-stone-100 to-stone-200'
      : 'from-primary/5 to-primary/10';

  const cardBg = isDark ? 'bg-slate-800' : isNeutral ? 'bg-white' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-gray-100';

  const handleLockedClick = () => {
    if (onLockedFeature) {
      onLockedFeature('Edit blog posts');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section 
        className={`py-16 md:py-24 bg-gradient-to-br ${heroGradient} relative overflow-hidden`}
        style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {heroImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-slate-900/80' : 'bg-white/80'}`} />
        )}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {hero.title}
          </h1>
          <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isEditable && (
            <div className="flex justify-center mb-8">
              <button
                onClick={handleLockedClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <Lock className="w-4 h-4" />
                Add New Blog Post (Premium)
              </button>
            </div>
          )}

          {posts.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              <p className="text-lg">No blog posts yet.</p>
              <p className="text-sm mt-2">Blog posts will appear here once generated.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post.id}
                  className={`rounded-xl ${cardBg} border ${cardBorder} shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer`}
                  onClick={() => onViewPost?.(post.id)}
                >
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                      }`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {post.excerpt}
                    </p>

                    {/* Meta & Read More */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
