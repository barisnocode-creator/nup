import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LockedFeatureButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LockedFeatureButton({
  label,
  onClick,
  className,
  variant = 'outline',
  size = 'sm',
}: LockedFeatureButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('gap-2 opacity-75 hover:opacity-100', className)}
      onClick={onClick}
    >
      <Lock className="w-3.5 h-3.5" />
      {label}
    </Button>
  );
}
