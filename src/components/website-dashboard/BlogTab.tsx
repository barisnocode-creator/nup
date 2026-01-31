import { useState } from 'react';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BlogTabProps {
  projectId: string;
}

// Sample blog posts for demonstration
const samplePosts = [
  {
    id: '1',
    title: 'Welcome to Our Blog',
    excerpt: 'This is your first blog post. Start sharing your thoughts and updates with your audience.',
    status: 'draft',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Getting Started with Our Services',
    excerpt: 'Learn more about what we offer and how we can help you achieve your goals.',
    status: 'published',
    createdAt: '2024-01-10',
  },
];

export function BlogTab({ projectId }: BlogTabProps) {
  const [posts] = useState(samplePosts);

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
      {posts.length === 0 ? (
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
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium">{post.title}</h3>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created: {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                  </p>
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
