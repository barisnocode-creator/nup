import { ProcessStep } from '@/types/generated-website';
import { cn } from '@/lib/utils';

interface ProcessSectionProps {
  steps: ProcessStep[];
  isDark: boolean;
  isNeutral: boolean;
}

export function ProcessSection({
  steps,
  isDark,
  isNeutral,
}: ProcessSectionProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className={cn(
      'py-20',
      isDark ? 'bg-slate-900' : isNeutral ? 'bg-stone-50' : 'bg-white'
    )} id="process">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className={cn(
            'inline-block px-4 py-1 rounded-full text-sm font-medium mb-4',
            isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
          )}>
            How It Works
          </span>
          <h2 className={cn(
            'text-3xl md:text-4xl font-bold',
            isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
          )}>
            Our Process
          </h2>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className={cn(
              'absolute left-8 top-0 bottom-0 w-0.5',
              isDark ? 'bg-slate-700' : 'bg-gray-200'
            )} />

            {/* Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="relative flex gap-8">
                  {/* Step Number */}
                  <div className={cn(
                    'relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold',
                    'bg-primary text-primary-foreground shadow-lg'
                  )}>
                    {step.step}
                  </div>

                  {/* Content */}
                  <div className={cn(
                    'flex-1 p-6 rounded-xl border',
                    isDark 
                      ? 'bg-slate-800 border-slate-700' 
                      : isNeutral 
                        ? 'bg-white border-stone-200' 
                        : 'bg-gray-50 border-gray-200'
                  )}>
                    <h3 className={cn(
                      'text-xl font-semibold mb-3',
                      isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
                    )}>
                      {step.title}
                    </h3>
                    <p className={cn(
                      'text-base',
                      isDark ? 'text-slate-400' : isNeutral ? 'text-stone-600' : 'text-gray-600'
                    )}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
