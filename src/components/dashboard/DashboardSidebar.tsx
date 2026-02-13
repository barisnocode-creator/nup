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

interface DashboardSidebarProps {
  activeProjectId?: string;
}

export function DashboardSidebar({ activeProjectId }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

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
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
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
