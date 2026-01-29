import { ArrowLeft, Calendar, Tag, Lock } from 'lucide-react';
import { BlogPost } from '@/types/generated-website';

interface BlogPostPageProps {
  post: BlogPost;
  isDark: boolean;
  isNeutral: boolean;
  isEditable?: boolean;
  onLockedFeature?: (feature: string) => void;
  onBack: () => void;
  relatedPosts?: BlogPost[];
  onViewPost?: (postId: string) => void;
}

export function BlogPostPage({ 
  post, 
  isDark, 
  isNeutral,
  isEditable = false,
  onLockedFeature,
  onBack,
  relatedPosts = [],
  onViewPost
}: BlogPostPageProps) {
  const cardBg = isDark ? 'bg-slate-800' : isNeutral ? 'bg-white' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-gray-100';

  const handleLockedClick = () => {
    if (onLockedFeature) {
      onLockedFeature('Edit blog post content');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Simple markdown-like rendering for content
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(line => line.startsWith('- '));
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4">
            {items.map((item, i) => (
              <li key={i} className={isDark ? 'text-slate-300' : 'text-gray-600'}>
                {item.replace('- ', '')}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className={`mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div>
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="w-full h-64 md:h-96 overflow-hidden relative">
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-slate-900/90 to-transparent' : 'bg-gradient-to-t from-white/90 to-transparent'}`} />
        </div>
      )}

      {/* Article Content */}
      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <button
              onClick={onBack}
              className={`flex items-center gap-2 mb-8 text-sm font-medium transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>

            {/* Category & Date */}
            <div className="flex items-center gap-4 mb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
              }`}>
                <Tag className="w-3.5 h-3.5" />
                {post.category}
              </span>
              <div className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </div>
            </div>

            {/* Title */}
            <div className="flex items-start justify-between gap-4 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">
                {post.title}
              </h1>
              {isEditable && (
                <button
                  onClick={handleLockedClick}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-colors ${
                    isDark 
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  Edit
                </button>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {renderContent(post.content)}
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className={`py-12 ${isDark ? 'bg-slate-800/50' : isNeutral ? 'bg-stone-100' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.slice(0, 2).map((relatedPost) => (
                  <article 
                    key={relatedPost.id}
                    className={`rounded-xl ${cardBg} border ${cardBorder} p-4 cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => onViewPost?.(relatedPost.id)}
                  >
                    <span className={`text-xs font-medium ${isDark ? 'text-primary/80' : 'text-primary'}`}>
                      {relatedPost.category}
                    </span>
                    <h3 className="font-semibold mt-1 mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className={`text-sm line-clamp-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {relatedPost.excerpt}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
