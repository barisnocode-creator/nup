import type { LucideIcon } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
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

const ACTION_BTN =
  'p-1.5 rounded-md hover:bg-gray-100 hover:shadow-sm active:scale-95 transition-all text-gray-700';

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
  const hasSeparator = (primary.length > 0 || secondary.length > 0) && hasOverflow;

  const positionClass = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2',
  }[position];

  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    e.preventDefault();
    action();
  };

  const renderButton = (action: ImageAction) => {
    const Icon = action.icon;
    return (
      <Tooltip key={action.id}>
        <TooltipTrigger asChild>
          <button
            className={cn(
              ACTION_BTN,
              action.disabled && 'opacity-40 pointer-events-none',
            )}
            onClick={(e) => handleClick(e, action.onClick)}
            disabled={action.disabled}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{action.label}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div
      className={cn(
        'absolute z-30 transition-all duration-200 pointer-events-auto',
        positionClass,
        isVisible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95 pointer-events-none',
      )}
    >
      <div className="flex items-center gap-0.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
        <TooltipProvider delayDuration={300}>
          {primary.map(renderButton)}
          {secondary.map(renderButton)}

          {hasSeparator && <div className="w-px h-4 bg-gray-300 mx-0.5" />}

          {hasOverflow && (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={ACTION_BTN}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
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
