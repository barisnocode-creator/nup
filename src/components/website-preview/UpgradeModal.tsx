import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, Palette, Layout, ListChecks, Globe } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const premiumFeatures = [
  { icon: Palette, label: 'Change colors & themes' },
  { icon: Layout, label: 'Customize layout & sections' },
  { icon: ListChecks, label: 'Edit all content' },
  { icon: Globe, label: 'Publish your website' },
];

export function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Upgrade to unlock
          </DialogTitle>
          <DialogDescription className="text-base">
            {feature 
              ? `"${feature}" is a premium feature.`
              : 'Publish your website and unlock full editing capabilities.'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Premium Features List */}
        <div className="py-4 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Premium includes:
          </p>
          <ul className="space-y-2">
            {premiumFeatures.map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <Button 
          size="lg" 
          className="w-full h-12 text-base gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          onClick={onClose}
        >
          <Sparkles className="w-5 h-5" />
          Upgrade
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Starting at $9/month • Cancel anytime
        </p>
      </DialogContent>
    </Dialog>
  );
}
