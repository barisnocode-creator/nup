import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Get user's display name from email
  const displayName = user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 gradient-hero rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Open Lucius</span>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome, {displayName}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to create your professional healthcare website?
          </p>
        </div>

        {/* Empty State */}
        <Card className="max-w-2xl mx-auto border-dashed border-2">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Create Your First Website</CardTitle>
            <CardDescription className="text-base">
              Get started by creating your professional website. Our AI will help you build a stunning site in minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-4">
            <Button size="lg" className="h-12 px-8">
              <Plus className="w-5 h-5 mr-2" />
              Create New Website
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Free to start
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
