import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Check, X, Loader2, Copy, ExternalLink, Lock, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  currentSubdomain?: string | null;
  isPublished?: boolean;
  onPublished?: (subdomain: string) => void;
}

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

// Generate a URL-friendly slug from business name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
    .substring(0, 50);
}

export function PublishModal({ 
  isOpen, 
  onClose, 
  projectId, 
  projectName,
  currentSubdomain,
  isPublished,
  onPublished
}: PublishModalProps) {
  const { toast } = useToast();
  const [subdomain, setSubdomain] = useState('');
  const [status, setStatus] = useState<AvailabilityStatus>('idle');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');

  // Initialize subdomain from current or generate from name
  useEffect(() => {
    if (isOpen) {
      if (currentSubdomain) {
        setSubdomain(currentSubdomain);
        setStatus('available');
      } else {
        const generatedSlug = generateSlug(projectName);
        setSubdomain(generatedSlug);
        if (generatedSlug.length >= 3) {
          checkAvailability(generatedSlug);
        }
      }
      
      if (isPublished && currentSubdomain) {
        setShowSuccess(true);
        setPublishedUrl(`${window.location.origin}/site/${currentSubdomain}`);
      }
    }
  }, [isOpen, projectName, currentSubdomain, isPublished]);

  // Debounced availability check
  const checkAvailability = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        
        // Validate format first
        if (value.length < 3) {
          setStatus('invalid');
          setSuggestion('Subdomain must be at least 3 characters');
          return;
        }
        
        if (value.length > 50) {
          setStatus('invalid');
          setSuggestion('Subdomain must be less than 50 characters');
          return;
        }
        
        if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value) && value.length > 2) {
          setStatus('invalid');
          setSuggestion('Only lowercase letters, numbers, and dashes allowed');
          return;
        }
        
        if (/^-|-$/.test(value)) {
          setStatus('invalid');
          setSuggestion('Cannot start or end with a dash');
          return;
        }

        setStatus('checking');
        setSuggestion(null);

        timeoutId = setTimeout(async () => {
          try {
            const { data, error } = await supabase.functions.invoke('check-subdomain', {
              body: { subdomain: value, projectId },
            });

            if (error) throw error;

            if (data.available) {
              setStatus('available');
              setSuggestion(null);
            } else {
              setStatus('taken');
              setSuggestion(data.suggestion || null);
            }
          } catch (err) {
            console.error('Error checking subdomain:', err);
            setStatus('idle');
          }
        }, 500);
      };
    })(),
    [projectId]
  );

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(value);
    
    if (value.length >= 3) {
      checkAvailability(value);
    } else {
      setStatus('idle');
      setSuggestion(null);
    }
  };

  const handlePublish = async () => {
    if (status !== 'available' || !subdomain) return;

    setIsPublishing(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          subdomain,
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (error) throw error;

      const url = `${window.location.origin}/site/${subdomain}`;
      setPublishedUrl(url);
      setShowSuccess(true);
      
      toast({
        title: 'Website published!',
        description: 'Your website is now live and accessible to everyone.',
      });

      onPublished?.(subdomain);
    } catch (err: any) {
      console.error('Publish error:', err);
      toast({
        title: 'Publish failed',
        description: err.message || 'Failed to publish website. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publishedUrl);
    toast({
      title: 'Link copied!',
      description: 'Website URL copied to clipboard.',
    });
  };

  const handleClose = () => {
    setShowSuccess(false);
    setStatus('idle');
    setSuggestion(null);
    onClose();
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
      case 'available':
        return <Check className="w-4 h-4 text-emerald-500" />;
      case 'taken':
      case 'invalid':
        return <X className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking availability...';
      case 'available':
        return 'Available!';
      case 'taken':
        return 'Already taken';
      case 'invalid':
        return suggestion || 'Invalid format';
      default:
        return '';
    }
  };

  // Success view after publishing
  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Your website is live! 🎉
            </DialogTitle>
            <DialogDescription className="text-base">
              Share your new website with the world
            </DialogDescription>
          </DialogHeader>

          {/* URL Display */}
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground mb-2">Your website address:</p>
              <p className="font-medium text-primary break-all">{publishedUrl}</p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleCopyUrl}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button 
                className="flex-1"
                onClick={() => window.open(publishedUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Website
              </Button>
            </div>
          </div>

          {/* Premium Upsell */}
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Want a custom domain?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect your own domain like www.yoursite.com
                </p>
                <Button variant="link" className="h-auto p-0 mt-2 text-amber-600">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={handleClose} className="mt-2">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center">
            <Globe className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Publish Your Website
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose a unique address for your website
          </DialogDescription>
        </DialogHeader>

        {/* Subdomain Input */}
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subdomain">Website Address</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  id="subdomain"
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  placeholder="your-clinic-name"
                  className="pr-10"
                  maxLength={50}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {getStatusIcon()}
                </div>
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                .openlucius.app
              </span>
            </div>
            
            {/* Status message */}
            {status !== 'idle' && (
              <p className={`text-sm ${status === 'available' ? 'text-emerald-600' : status === 'checking' ? 'text-muted-foreground' : 'text-destructive'}`}>
                {getStatusText()}
              </p>
            )}

            {/* Suggestion */}
            {suggestion && status === 'taken' && (
              <button
                className="text-sm text-primary hover:underline"
                onClick={() => {
                  setSubdomain(suggestion);
                  checkAvailability(suggestion);
                }}
              >
                Try: {suggestion}
              </button>
            )}
          </div>

          {/* Preview URL */}
          {subdomain.length >= 3 && status === 'available' && (
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground mb-1">Your website will be live at:</p>
              <p className="text-sm font-medium text-primary">
                {window.location.origin}/site/{subdomain}
              </p>
            </div>
          )}
        </div>

        {/* Publish Button */}
        <Button 
          size="lg" 
          className="w-full h-12 text-base gap-2"
          onClick={handlePublish}
          disabled={status !== 'available' || isPublishing}
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Globe className="w-5 h-5" />
              Publish Now
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Your website will be publicly accessible after publishing
        </p>
      </DialogContent>
    </Dialog>
  );
}