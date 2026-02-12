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
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, BarChart, Bar } from 'recharts';
import { Globe } from 'lucide-react';

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
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 gradient-hero rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline text-xl font-bold">Open Lucius</span>
            </Link>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <span className="text-xs sm:text-sm text-muted-foreground">Analytics</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap justify-end">
            <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Canlı
            </Badge>
            <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => refetch()} title="Yenile">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate(`/project/${id}`)}>
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Back to Editor</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">{projectName}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {/* Total Views */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Görüntüleme</CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalViews || 0}</div>
                <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
              </CardContent>
            </Card>

            {/* Views Last 7 Days */}
            <Card className="bg-accent/30 border-accent/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Son 7 Gün</CardTitle>
                <div className="h-8 w-8 rounded-full bg-accent/50 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.viewsLast7Days || 0}</div>
                <p className="text-xs text-muted-foreground">Bu haftaki görüntüleme</p>
              </CardContent>
            </Card>

            {/* Unique Visitors */}
            <Card className="bg-secondary/50 border-secondary/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tekil Ziyaretçi</CardTitle>
                <div className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center">
                  <Users className="h-4 w-4 text-secondary-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.uniqueVisitors || 0}</div>
                <p className="text-xs text-muted-foreground">Farklı tarayıcılar</p>
              </CardContent>
            </Card>

            {/* Device Split */}
            <Card className="bg-muted/50 border-muted-foreground/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cihazlar</CardTitle>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                </div>
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
                <p className="text-xs text-muted-foreground mt-1">Mobil vs Masaüstü</p>
              </CardContent>
            </Card>
          </div>

          {/* Views Over Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Zaman İçinde Görüntüleme</CardTitle>
              <CardDescription>Son 30 günlük sayfa görüntülemeleri</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] sm:h-[300px] w-full">
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

          {/* Page Views & Hourly Distribution */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Popüler Sayfalar
                </CardTitle>
                <CardDescription>En çok ziyaret edilen sayfalar</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.pageViews && analytics.pageViews.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.pageViews.slice(0, 5).map((page, i) => (
                      <div key={page.path} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                          <span className="text-sm font-medium truncate max-w-[180px]">{page.path}</span>
                        </div>
                        <Badge variant="secondary">{page.views} görüntüleme</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Henüz veri yok</p>
                )}
              </CardContent>
            </Card>

            {/* Hourly Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Saatlik Dağılım</CardTitle>
                <CardDescription>Gün içinde ziyaret yoğunluğu</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <BarChart data={analytics?.hourlyViews || []}>
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(h) => `${h}:00`}
                      interval={3}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="views"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Device Breakdown */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Mobil
                </CardTitle>
                <CardDescription>Mobil cihazlardan görüntüleme</CardDescription>
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

            <Card className="bg-secondary/30 border-secondary/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Masaüstü
                </CardTitle>
                <CardDescription>Masaüstü tarayıcılardan görüntüleme</CardDescription>
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
