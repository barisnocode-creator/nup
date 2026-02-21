import { AlertTriangle, Users, Eye, Monitor, Smartphone, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

export function WebsiteDashboardTab({ projectId, isPublished }: WebsiteDashboardTabProps) {
  const { data, loading } = useAnalytics(projectId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Empty state: no data or zero views
  if (!data || data.totalViews === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-muted/50 border border-border rounded-lg p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Henüz ziyaretçiniz yok</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {isPublished
                ? 'Siteniz yayında ancak henüz ziyaretçi almadınız. Sitenizi sosyal medyada paylaşarak ziyaretçi kazanabilirsiniz.'
                : 'Analitik verilerini görmek için önce sitenizi yayınlayın. Yayınlandıktan sonra ziyaretçi verileri burada görünecektir.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const deviceData = [
    { name: 'Desktop', value: data.deviceBreakdown?.desktop || 0 },
    { name: 'Mobile', value: data.deviceBreakdown?.mobile || 0 },
  ];

  const maxPageViews = Math.max(...(data.pageViews?.map((p) => p.views) || [1]));

  return (
    <div className="space-y-6">
      {/* Main Chart + Most Viewed Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visits per day chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Günlük Ziyaretler</CardTitle>
            <span className="text-sm text-muted-foreground">Son 30 gün</span>
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
            <CardTitle className="text-lg">Popüler Sayfalar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.pageViews?.slice(0, 5).map((page) => (
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
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{data.viewsLast7Days?.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Son 7 gün</p>
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
                <p className="text-3xl font-bold">{data.uniqueVisitors?.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Tekil ziyaretçi</p>
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
                <p className="text-sm text-muted-foreground">Toplam görüntüleme</p>
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
            <CardTitle className="text-lg">Cihaz Dağılımı</CardTitle>
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
                <span className="text-sm">Masaüstü: {deviceData[0].value.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Mobil: {deviceData[1].value.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Yoğun Saatler</CardTitle>
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
