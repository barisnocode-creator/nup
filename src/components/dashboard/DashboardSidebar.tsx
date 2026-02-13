import { Home, Globe, BarChart3, Settings, HelpCircle, Sparkles, Crown, Wand2, CalendarCheck } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardSidebarProps {
  activeProjectId?: string;
}

export function DashboardSidebar({ activeProjectId }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch pending appointment count
  useEffect(() => {
    if (!activeProjectId) return;
    const fetchPending = async () => {
      const { count } = await supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', activeProjectId)
        .eq('status', 'pending');
      setPendingCount(count || 0);
    };
    fetchPending();

    // Listen for realtime changes
    const channel = supabase
      .channel('sidebar-appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments', filter: `project_id=eq.${activeProjectId}` }, () => {
        fetchPending();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeProjectId]);

  const navItems = [
    { title: 'Home', url: '/dashboard', icon: Home },
    { 
      title: 'Website', 
      url: activeProjectId ? `/project/${activeProjectId}/website` : '/dashboard', 
      icon: Globe,
    },
    { 
      title: 'Randevular', 
      url: activeProjectId ? `/project/${activeProjectId}/appointments` : '/appointments', 
      icon: CalendarCheck,
    },
    { title: 'Studio', url: '/studio', icon: Wand2 },
    { 
      title: 'Analytics', 
      url: activeProjectId ? `/project/${activeProjectId}/analytics` : '/analytics', 
      icon: BarChart3,
    },
    { title: 'Settings', url: '/settings', icon: Settings },
    { title: 'Help', url: '/help', icon: HelpCircle },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r bg-background">
      {/* Header with Logo */}
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 gradient-hero rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold">Open Lucius</span>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                  >
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard'}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <div className="relative shrink-0">
                        <item.icon className="h-5 w-5" />
                        {item.title === 'Randevular' && pendingCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                            {pendingCount > 9 ? '!' : pendingCount}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <span className="flex items-center gap-2">
                          {item.title}
                          {item.title === 'Randevular' && pendingCount > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-destructive/10 text-destructive rounded-full">
                              {pendingCount} yeni
                            </span>
                          )}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Upgrade Card */}
      <SidebarFooter className="p-4">
        {!isCollapsed ? (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Unlock premium features and custom domains
              </p>
              <Button size="sm" className="w-full">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Button size="icon" variant="ghost" className="w-full">
            <Crown className="h-5 w-5 text-primary" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
