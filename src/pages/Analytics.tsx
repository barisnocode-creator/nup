import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowLeft, Loader2, Eye, Users, Smartphone, Monitor, TrendingUp, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function Analytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: analytics, loading, error, refetch } = useAnalytics(id);
  const [projectName, setProjectName] = useState<string>('');

  // Fetch project name
  useEffect(() => {
    async function fetchProject() {
      if (!id || !user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('name, user_id')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        navigate('/dashboard');
        return;
      }

      // Verify ownership
      if (data.user_id !== user.id) {
        navigate('/dashboard');
        return;
      }

      setProjectName(data.name);
    }

    fetchProject();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const chartConfig = {
    views: {
      label: 'Views',
      color: 'hsl(var(--primary))',
    },
  };

  // Format date for chart
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = analytics?.viewsOverTime.map(d => ({
    ...d,
    formattedDate: formatDate(d.date),
  })) || [];

  const totalDevices = (analytics?.deviceBreakdown.mobile || 0) + (analytics?.deviceBreakdown.desktop || 0);
  const mobilePercent = totalDevices > 0 ? Math.round((analytics?.deviceBreakdown.mobile || 0) / totalDevices * 100) : 0;
  const desktopPercent = totalDevices > 0 ? 100 - mobilePercent : 0;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 gradient-hero rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Open Lucius</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1.5 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Canlı
            </Badge>
            <Button variant="outline" size="icon" onClick={() => refetch()} title="Yenile">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate(`/project/${id}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">{projectName}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Views */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalViews || 0}</div>
                <p className="text-xs text-muted-foreground">All time page views</p>
              </CardContent>
            </Card>

            {/* Views Last 7 Days */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.viewsLast7Days || 0}</div>
                <p className="text-xs text-muted-foreground">Views this week</p>
              </CardContent>
            </Card>

            {/* Unique Visitors */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.uniqueVisitors || 0}</div>
                <p className="text-xs text-muted-foreground">Individual browsers</p>
              </CardContent>
            </Card>

            {/* Device Split */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Devices</CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium">{mobilePercent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{desktopPercent}%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Mobile vs Desktop</p>
              </CardContent>
            </Card>
          </div>

          {/* Views Over Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>Page views in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile
                </CardTitle>
                <CardDescription>Views from mobile devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics?.deviceBreakdown.mobile || 0}</div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${mobilePercent}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Desktop
                </CardTitle>
                <CardDescription>Views from desktop browsers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics?.deviceBreakdown.desktop || 0}</div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-muted-foreground rounded-full transition-all duration-500"
                    style={{ width: `${desktopPercent}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
