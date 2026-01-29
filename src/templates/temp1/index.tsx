import { useState } from 'react';
import { TemplateProps } from '../types';
import { WebsitePage, BlogPost } from '@/types/generated-website';
import { TemplateHeader } from './components/TemplateHeader';
import { TemplateFooter } from './components/TemplateFooter';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { UpgradeModal } from '@/components/website-preview/UpgradeModal';

export function HealthcareModernTemplate({
  content,
  colorPreference,
  isEditable = false,
  onFieldEdit,
  onLockedFeature,
}: TemplateProps) {
  const [currentPage, setCurrentPage] = useState<WebsitePage>('home');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string>('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const isDark = colorPreference === 'dark';
  const isNeutral = colorPreference === 'neutral';

  const themeClasses = isDark
    ? 'bg-slate-900 text-white'
    : isNeutral
      ? 'bg-stone-50 text-stone-900'
      : 'bg-white text-gray-900';

  const handleLockedFeature = (feature: string) => {
    if (onLockedFeature) {
      onLockedFeature(feature);
    } else {
      setLockedFeature(feature);
      setUpgradeModalOpen(true);
    }
  };

  const handleFieldEdit = (fieldPath: string, newValue: string) => {
    if (onFieldEdit) {
      onFieldEdit(fieldPath, newValue);
    }
  };

  const handleNavigate = (page: WebsitePage) => {
    setCurrentPage(page);
    setSelectedPostId(null);
  };

  const handleViewPost = (postId: string) => {
    setSelectedPostId(postId);
    setCurrentPage('blog-post');
  };

  const handleBackToBlog = () => {
    setSelectedPostId(null);
    setCurrentPage('blog');
  };

  const hasBlog = content.pages.blog && content.pages.blog.posts.length > 0;
  const selectedPost = selectedPostId
    ? content.pages.blog?.posts.find(p => p.id === selectedPostId)
    : null;

  const getRelatedPosts = (currentPostId: string): BlogPost[] => {
    return content.pages.blog?.posts.filter(p => p.id !== currentPostId) || [];
  };

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* Editing Toolbar */}
      {isEditable && (
        <div className={`sticky top-14 z-20 py-2 px-4 border-b ${
          isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-gray-50/95 border-gray-200'
        } backdrop-blur-sm`}>
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                ✏️ Click on highlighted text to edit
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLockedFeature('Change colors')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isDark 
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                🎨 Colors
              </button>
              <button
                onClick={() => handleLockedFeature('Change layout')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isDark 
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                📐 Layout
              </button>
            </div>
          </div>
        </div>
      )}

      <TemplateHeader
        siteName={content.metadata.siteName}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDark={isDark}
        isEditable={isEditable}
        onFieldEdit={handleFieldEdit}
        hasBlog={hasBlog}
      />

      <main>
        {currentPage === 'home' && (
          <HomePage
            content={content.pages.home}
            isDark={isDark}
            isNeutral={isNeutral}
            isEditable={isEditable}
            onFieldEdit={handleFieldEdit}
            heroImage={content.images?.heroHome}
          />
        )}
        {currentPage === 'about' && (
          <AboutPage
            content={content.pages.about}
            isDark={isDark}
            isNeutral={isNeutral}
            isEditable={isEditable}
            onLockedFeature={handleLockedFeature}
            heroImage={content.images?.heroAbout}
          />
        )}
        {currentPage === 'services' && (
          <ServicesPage
            content={content.pages.services}
            isDark={isDark}
            isNeutral={isNeutral}
            isEditable={isEditable}
            onLockedFeature={handleLockedFeature}
            heroImage={content.images?.heroServices}
          />
        )}
        {currentPage === 'contact' && (
          <ContactPage
            content={content.pages.contact}
            isDark={isDark}
            isNeutral={isNeutral}
            isEditable={isEditable}
            onFieldEdit={handleFieldEdit}
          />
        )}
        {currentPage === 'blog' && content.pages.blog && (
          <BlogPage
            hero={content.pages.blog.hero}
            posts={content.pages.blog.posts}
            isDark={isDark}
            isNeutral={isNeutral}
            isEditable={isEditable}
            onLockedFeature={handleLockedFeature}
            onViewPost={handleViewPost}
            heroImage={content.images?.heroBlog}
          />
        )}
        {currentPage === 'blog-post' && selectedPost && (
          <BlogPostPage
            post={selectedPost}
            isDark={isDark}
            isNeutral={isNeutral}
            isEditable={isEditable}
            onLockedFeature={handleLockedFeature}
            onBack={handleBackToBlog}
            relatedPosts={getRelatedPosts(selectedPost.id)}
            onViewPost={handleViewPost}
          />
        )}
      </main>

      <TemplateFooter
        siteName={content.metadata.siteName}
        tagline={content.metadata.tagline}
        isDark={isDark}
      />

      {/* Upgrade Modal (internal fallback) */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        feature={lockedFeature}
      />
    </div>
  );
}
