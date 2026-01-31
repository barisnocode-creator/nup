import { Plus, Pencil, Trash2, FileText, Calendar, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/generated-website';

interface BlogTabProps {
  projectId: string;
  generatedContent: any;
}

export function BlogTab({ projectId, generatedContent }: BlogTabProps) {
  // Get blog posts from generated_content.pages.blog.posts
  const blogPosts: BlogPost[] = generatedContent?.pages?.blog?.posts || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Blog Posts</h2>
          <p className="text-sm text-muted-foreground">
            Manage your blog content and publish new articles
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Blog Post
        </Button>
      </div>

      {/* Blog Posts List */}
      {blogPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start creating content to engage your audience
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create your first post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium">{post.title}</h3>
                    {post.category && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                  {post.publishedAt && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Regular blog posts help improve your SEO and keep visitors coming back. 
            Aim to publish at least one post per week.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
