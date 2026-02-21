import { ReactNode, useLayoutEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';

interface DashboardLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  activeProjectId?: string;
}

export function DashboardLayout({ children, rightPanel, activeProjectId }: DashboardLayoutProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Safety reset: force SaaS orange theme on every route change
  useLayoutEffect(() => {
    const root = document.documentElement;
    const forceNUppelTheme = () => {
      const defaults: Record<string, string> = {
        '--background': '0 0% 100%',
        '--foreground': '222 47% 11%',
        '--card': '0 0% 100%',
        '--card-foreground': '222 47% 11%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '222 47% 11%',
        '--primary': '222 47% 31%',
        '--primary-foreground': '0 0% 100%',
        '--secondary': '220 14% 96%',
        '--secondary-foreground': '222 47% 20%',
        '--muted': '220 14% 96%',
        '--muted-foreground': '220 9% 46%',
        '--accent': '210 100% 56%',
        '--accent-foreground': '0 0% 100%',
        '--destructive': '0 84% 60%',
        '--destructive-foreground': '0 0% 100%',
        '--border': '220 13% 91%',
        '--input': '220 13% 91%',
        '--ring': '222 47% 31%',
        '--radius': '0.5rem',
        '--sidebar-background': '0 0% 98%',
        '--sidebar-foreground': '220 9% 46%',
        '--sidebar-primary': '222 47% 31%',
        '--sidebar-primary-foreground': '0 0% 100%',
        '--sidebar-accent': '220 14% 96%',
        '--sidebar-accent-foreground': '222 47% 20%',
        '--sidebar-border': '220 13% 91%',
        '--sidebar-ring': '222 47% 31%',
      };
      Object.entries(defaults).forEach(([k, v]) => root.style.setProperty(k, v));
      root.style.setProperty('--font-heading', "'Inter', system-ui, sans-serif");
      root.style.setProperty('--font-body', "'Inter', system-ui, sans-serif");
      ['--color-secondary-custom', '--color-accent-custom'].forEach((p) => root.style.removeProperty(p));
      root.classList.remove('reduce-motion');
      document.querySelectorAll('style[data-chai]').forEach(el => el.remove());
    };
    forceNUppelTheme();
    // Delayed cleanup for async SDK style injections
    const timer = setTimeout(forceNUppelTheme, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

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
          <header className="h-12 sm:h-14 border-b bg-background/95 backdrop-blur-sm flex items-center justify-between px-3 sm:px-4 shrink-0 shadow-sm">
            <SidebarTrigger className="lg:hidden">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1" />
            <NotificationBell />
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </header>

          {/* Content + Right Panel */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
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
