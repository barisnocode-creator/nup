import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  activeProjectId?: string;
}

export function DashboardLayout({ children, rightPanel, activeProjectId }: DashboardLayoutProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-muted/30">
        {/* Left Sidebar */}
        <DashboardSidebar activeProjectId={activeProjectId} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <header className="h-14 border-b bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 shrink-0 shadow-sm">
            <SidebarTrigger className="lg:hidden">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </header>

          {/* Content + Right Panel */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              {children}
            </main>

            {/* Right Panel (Desktop Only) */}
            {rightPanel && (
              <aside className="hidden xl:block w-80 border-l bg-background p-6 overflow-y-auto shrink-0">
                {rightPanel}
              </aside>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
