import { Statistic } from '@/types/generated-website';
import { cn } from '@/lib/utils';

interface StatisticsSectionProps {
  statistics: Statistic[];
  isDark: boolean;
  isNeutral: boolean;
}

export function StatisticsSection({
  statistics,
  isDark,
  isNeutral,
}: StatisticsSectionProps) {
  if (!statistics || statistics.length === 0) return null;

  return (
    <section className={cn(
      'py-12 border-y',
      isDark 
        ? 'bg-slate-800 border-slate-700' 
        : isNeutral 
          ? 'bg-stone-200 border-stone-300' 
          : 'bg-primary/5 border-primary/10'
    )}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={cn(
                'text-4xl md:text-5xl font-bold mb-2',
                isDark ? 'text-primary' : 'text-primary'
              )}>
                {stat.value}
              </div>
              <div className={cn(
                'text-sm md:text-base font-medium uppercase tracking-wider',
                isDark ? 'text-slate-400' : isNeutral ? 'text-stone-600' : 'text-gray-600'
              )}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
