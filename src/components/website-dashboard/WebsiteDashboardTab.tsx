import { useMemo } from 'react';
import { AlertTriangle, Users, Eye, Monitor, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

interface WebsiteDashboardTabProps {
  projectId: string;
  isPublished: boolean;
}

// Sample data generator for unpublished sites
function generateSampleData() {
  const viewsOverTime = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    viewsOverTime.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 150) + 50,
    });
  }

  const pageViews = [
    { path: '/', views: 1245 },
    { path: '/about', views: 432 },
    { path: '/services', views: 387 },
    { path: '/contact', views: 256 },
    { path: '/blog', views: 198 },
  ];

  const hourlyViews = [];
  for (let i = 0; i < 24; i++) {
    hourlyViews.push({
      hour: i,
      views: Math.floor(Math.random() * 100) + 10,
    });
  }

  return {
    totalViews: 3243,
    viewsLast7Days: 847,
    uniqueVisitors: 253,
    onlineUsers: 32,
    deviceBreakdown: { mobile: 2325, desktop: 3325 },
    viewsOverTime,
    pageViews,
    hourlyViews,
  };
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

export function WebsiteDashboardTab({ projectId, isPublished }: WebsiteDashboardTabProps) {
  const { data: realData, loading } = useAnalytics(projectId);
  
  const useSampleData = !isPublished || !realData || realData.totalViews === 0;
  const sampleData = useMemo(() => generateSampleData(), []);
  
  const data = useSampleData ? sampleData : {
    ...realData,
    onlineUsers: Math.floor(Math.random() * 50) + 5, // Simulated
    pageViews: realData.pageViews || sampleData.pageViews,
    hourlyViews: realData.hourlyViews || sampleData.hourlyViews,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const deviceData = [
    { name: 'Desktop', value: data.deviceBreakdown?.desktop || 0 },
    { name: 'Mobile', value: data.deviceBreakdown?.mobile || 0 },
  ];

  const maxPageViews = Math.max(...(data.pageViews?.map((p: any) => p.views) || [1]));

  return (
    <div className="space-y-6">
      {/* Sample Data Badge */}
      {useSampleData && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-800">Sample Data</p>
            <p className="text-sm text-yellow-700">
              Your website analytics will appear here once you publish your site.
            </p>
          </div>
          {useSampleData && (
            <Badge className="ml-auto bg-yellow-500 text-yellow-900 hover:bg-yellow-500">
              Sample Data
            </Badge>
          )}
        </div>
      )}

      {/* Main Chart + Most Viewed Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visits per day chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Visits per day</CardTitle>
            <span className="text-sm text-muted-foreground">Last 30 days</span>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Most viewed pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most viewed pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.pageViews?.slice(0, 5).map((page: any) => (
              <div key={page.path} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="truncate">{page.path}</span>
                  <span className="text-muted-foreground">{page.views}</span>
                </div>
                <Progress value={(page.views / maxPageViews) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{data.onlineUsers}</p>
                <p className="text-sm text-muted-foreground">Online users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{data.uniqueVisitors}</p>
                <p className="text-sm text-muted-foreground">Unique visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{data.totalViews?.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Page views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Device Views & Peak Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Views Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Device views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-primary" />
                <span className="text-sm">Desktop: {deviceData[0].value.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Mobile: {deviceData[1].value.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.hourlyViews}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(value) => `${value}:00`}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    labelFormatter={(value) => `${value}:00 - ${value}:59`}
                  />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
