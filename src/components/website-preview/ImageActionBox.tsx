import type { LucideIcon } from 'lucide-react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export type ImageActionGroup = 'primary' | 'secondary' | 'overflow';

export interface ImageAction {
  id: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  hidden?: boolean;
  variant?: 'default' | 'danger';
  group?: ImageActionGroup;
}

const ICON_BTN =
  'p-1.5 rounded hover:bg-black/10 active:scale-95 transition-all text-foreground/70 hover:text-foreground';

interface ImageActionBoxProps {
  actions: ImageAction[];
  isVisible: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function ImageActionBox({
  actions,
  isVisible,
  position = 'top-right',
}: ImageActionBoxProps) {
  const visibleActions = actions.filter((a) => !a.hidden);
  if (visibleActions.length === 0) return null;

  const primary = visibleActions.filter((a) => !a.group || a.group === 'primary');
  const secondary = visibleActions.filter((a) => a.group === 'secondary');
  const overflow = visibleActions.filter((a) => a.group === 'overflow');

  const hasOverflow = overflow.length > 0;

  const positionClass = {
    'top-right': 'top-3 right-3',
    'top-left': 'top-3 left-3',
    'bottom-right': 'bottom-3 right-3',
    'bottom-left': 'bottom-3 left-3',
  }[position];

  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    e.preventDefault();
    action();
  };

  return (
    <div
      className={cn(
        'absolute z-30 transition-all duration-200 pointer-events-auto',
        positionClass,
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-1 pointer-events-none',
      )}
    >
      <div className="flex items-center bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-black/10 overflow-hidden">
        <TooltipProvider delayDuration={300}>
          {/* Primary actions as text buttons (Durable style) */}
          {primary.map((action, i) => (
            <button
              key={action.id}
              className={cn(
                'px-3 py-2 text-[13px] font-medium text-foreground/80 hover:bg-black/5 hover:text-foreground active:scale-[0.98] transition-all whitespace-nowrap',
                i > 0 && 'border-l border-black/10',
                action.disabled && 'opacity-40 pointer-events-none',
              )}
              onClick={(e) => handleClick(e, action.onClick)}
              disabled={action.disabled}
            >
              {action.label}
            </button>
          ))}

          {/* Separator between primary and secondary/overflow */}
          {primary.length > 0 && (secondary.length > 0 || hasOverflow) && (
            <div className="w-px h-5 bg-black/10" />
          )}

          {/* Secondary actions as icon buttons */}
          {secondary.map((action) => {
            const Icon = action.icon;
            return (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      ICON_BTN,
                      action.disabled && 'opacity-40 pointer-events-none',
                    )}
                    onClick={(e) => handleClick(e, action.onClick)}
                    disabled={action.disabled}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{action.label}</TooltipContent>
              </Tooltip>
            );
          })}

          {/* Overflow dropdown */}
          {hasOverflow && (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={ICON_BTN}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Diğer</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="z-50">
                {overflow.map((action, i) => {
                  const Icon = action.icon;
                  const isDanger = action.variant === 'danger';
                  return (
                    <span key={action.id}>
                      {isDanger && i > 0 && <DropdownMenuSeparator />}
                      <DropdownMenuItem
                        className={cn(
                          isDanger &&
                            'text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 active:scale-[0.98] transition-transform',
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick();
                        }}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {action.label}
                      </DropdownMenuItem>
                    </span>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TooltipProvider>
      </div>
    </div>
  );
}
