import { Check, Circle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  status: string;
  is_published?: boolean;
  generated_content?: unknown;
}

interface GettingStartedChecklistProps {
  project?: Project;
  onCreateWebsite: () => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action: () => void;
}

export function GettingStartedChecklist({ project, onCreateWebsite }: GettingStartedChecklistProps) {
  const navigate = useNavigate();

  const getChecklistItems = (): ChecklistItem[] => {
    const hasProject = !!project;
    const isGenerated = project?.status === 'generated';
    const isPublished = project?.is_published === true;

    return [
      {
        id: 'create',
        title: 'Create your website',
        description: 'Generate your professional website with AI',
        completed: hasProject,
        action: onCreateWebsite,
      },
      {
        id: 'customize',
        title: 'Customize content',
        description: 'Edit text, colors, and images',
        completed: hasProject && isGenerated,
        action: () => project && navigate(`/project/${project.id}`),
      },
      {
        id: 'publish',
        title: 'Publish your site',
        description: 'Make your website live for visitors',
        completed: isPublished,
        action: () => project && navigate(`/project/${project.id}`),
      },
      {
        id: 'analytics',
        title: 'Check analytics',
        description: 'See how your website is performing',
        completed: false,
        action: () => project && navigate(`/project/${project.id}/analytics`),
      },
    ];
  };

  const items = getChecklistItems();
  const completedCount = items.filter(item => item.completed).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Get Started
          <span className="text-sm font-normal text-muted-foreground">
            {completedCount}/{items.length}
          </span>
        </CardTitle>
        {/* Progress Bar with gradient */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${progress}%`,
              background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))`,
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            disabled={item.completed}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 group/item",
              item.completed 
                ? "opacity-60" 
                : "hover:bg-primary/5 cursor-pointer"
            )}
          >
            {/* Check Circle */}
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300",
              item.completed 
                ? "bg-primary border-primary scale-100" 
                : "border-muted-foreground/30"
            )}>
              {item.completed ? (
                <Check className="w-4 h-4 text-primary-foreground animate-scale-in" />
              ) : (
                <Circle className="w-3 h-3 text-muted-foreground/30" />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-medium text-sm",
                item.completed && "line-through text-muted-foreground"
              )}>
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.description}
              </p>
            </div>

            {/* Arrow with hover animation */}
            {!item.completed && (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 group-hover/item:translate-x-1" />
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
