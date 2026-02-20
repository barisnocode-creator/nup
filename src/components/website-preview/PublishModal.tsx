import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Check, X, Loader2, Copy, ExternalLink, Settings, ChevronDown, RefreshCw } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { DomainSettingsModal } from './DomainSettingsModal';
import { DomainSuggestionCard, generateDomainSuggestions } from './DomainSuggestionCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

function CustomDomainCollapsible({ onOpenDomainModal }: { onOpenDomainModal: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Settings className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <p className="font-medium text-sm text-gray-800">Özel Domain Bağla</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <div className="pt-2 pl-9">
            <p className="text-xs text-gray-500">
              Kendi alan adınızı bağlayarak profesyonel görünüm elde edin
            </p>
            <Button 
              variant="link" 
              className="h-auto p-0 mt-1.5 text-orange-600"
              onClick={onOpenDomainModal}
            >
              <Globe className="w-3 h-3 mr-1" />
              Domain Ayarları
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

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
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
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
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | undefined>();
  const [domainSuggestions, setDomainSuggestions] = useState<{ domain: string; price: string }[]>([]);
  const [vercelUrl, setVercelUrl] = useState('');

  const fetchProjectData = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('projects')
        .select('profession, form_data, vercel_url, vercel_custom_domain')
        .eq('id', projectId)
        .single();

      if (data) {
        const formData = data.form_data as any;
        const businessName = formData?.businessName || formData?.extractedData?.businessName || projectName;
        const profession = data.profession || '';
        setDomainSuggestions(generateDomainSuggestions(businessName, profession));

        if (data.vercel_url) setVercelUrl(data.vercel_url);
        return data;
      }
    } catch (err) {
      console.error('Error fetching project data:', err);
    }
    return null;
  }, [projectId, projectName]);

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
        fetchProjectData().then((data) => {
          if (data) {
            const url = data.vercel_custom_domain 
              ? `https://${data.vercel_custom_domain}`
              : data.vercel_url || `${window.location.origin}/site/${currentSubdomain}`;
            setPublishedUrl(url);
            if (data.vercel_url) setVercelUrl(data.vercel_url);
          }
        });
      } else {
        fetchProjectData();
      }
    }
  }, [isOpen, projectName, currentSubdomain, isPublished, fetchProjectData]);


  const checkAvailability = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        
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

      let deployedVercelUrl = '';
      try {
        const { data: deployData, error: deployError } = await supabase.functions.invoke('deploy-to-vercel', {
          body: { projectId },
        });

        if (!deployError && deployData?.vercelUrl) {
          deployedVercelUrl = deployData.vercelUrl;
          setVercelUrl(deployedVercelUrl);
        } else {
          console.warn('Vercel deploy warning:', deployError || deployData?.error);
        }
      } catch (deployErr) {
        console.warn('Vercel deploy failed, site still published on platform:', deployErr);
      }

      const url = deployedVercelUrl || `${window.location.origin}/site/${subdomain}`;
      setPublishedUrl(url);
      setShowSuccess(true);
      
      toast({
        title: 'Website published!',
        description: deployedVercelUrl 
          ? 'Your website is now live on Vercel!' 
          : 'Your website is now live and accessible to everyone.',
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

  const handleUpdate = async () => {
    setIsPublishing(true);
    try {
      const { data: deployData, error: deployError } = await supabase.functions.invoke('deploy-to-vercel', {
        body: { projectId },
      });

      if (!deployError && deployData?.vercelUrl) {
        toast({
          title: '✅ Site güncellendi!',
          description: 'Değişiklikler canlıya alındı.',
        });
        onClose();
      } else {
        throw new Error(deployError?.message || 'Deploy başarısız.');
      }
    } catch (err: any) {
      toast({ title: 'Hata', description: err.message || 'Güncelleme başarısız.', variant: 'destructive' });
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
        return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
      case 'available':
        return <Check className="w-4 h-4 text-emerald-500" />;
      case 'taken':
      case 'invalid':
        return <X className="w-4 h-4 text-red-500" />;
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

  // Update view for already-published sites
  if (isPublished && currentSubdomain && !showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white text-gray-900 [&>button]:text-gray-500">
          <DialogHeader className="text-center space-y-3 sm:space-y-4">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Değişiklikleri Yayınla
            </DialogTitle>
            <DialogDescription className="text-base text-gray-500">
              Siteniz zaten canlı. Yaptığınız değişiklikleri güncelleyin.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Current live URL */}
            {publishedUrl && (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-xs text-gray-500 mb-1">✅ Şu an canlı adresiniz:</p>
                <p className="font-medium text-emerald-700 break-all text-sm">{publishedUrl}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs"
                    onClick={() => navigator.clipboard.writeText(publishedUrl).then(() => toast({ title: 'Link kopyalandı!' }))}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Linki Kopyala
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs"
                    onClick={() => window.open(publishedUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Siteyi Aç
                  </Button>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 text-center">
              Editörde yaptığınız değişiklikleri canlı siteye aktarmak için aşağıdaki butona tıklayın.
            </p>

            {/* Update Button */}
            <Button
              size="lg"
              className="w-full h-12 text-base gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleUpdate}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Değişiklikleri Yayınla
                </>
              )}
            </Button>

            {/* Domain Settings */}
            <CustomDomainCollapsible onOpenDomainModal={() => setDomainModalOpen(true)} />

            <Button variant="outline" onClick={handleClose} className="w-full border-gray-300 text-gray-700">
              Kapat
            </Button>
          </div>
        </DialogContent>

        <DomainSettingsModal
          isOpen={domainModalOpen}
          onClose={() => { setDomainModalOpen(false); setSelectedDomain(undefined); }}
          projectId={projectId}
          initialDomain={selectedDomain}
        />
      </Dialog>
    );
  }

  // Success view after publishing
  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-md bg-white text-gray-900 [&>button]:text-gray-500">
          <DialogHeader className="text-center space-y-3 sm:space-y-4">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <Check className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Your website is live! 🎉
            </DialogTitle>
            <DialogDescription className="text-base text-gray-500">
              Share your new website with the world
            </DialogDescription>
          </DialogHeader>

          {/* URL Display */}
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
              <p className="text-sm text-gray-500 mb-2">Your website address:</p>
              <p className="font-medium text-orange-600 break-all">{publishedUrl}</p>
            </div>

            {vercelUrl && vercelUrl !== publishedUrl && (
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                <p className="text-sm text-gray-500 mb-2">Vercel URL:</p>
                <p className="font-medium text-orange-600 break-all">{vercelUrl}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50" 
                onClick={handleCopyUrl}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button 
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => window.open(publishedUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Website
              </Button>
            </div>
          </div>

          {/* Domain Suggestions */}
          {domainSuggestions.length > 0 && (
            <DomainSuggestionCard
              suggestions={domainSuggestions}
              onConnectDomain={() => setDomainModalOpen(true)}
              onSelectDomain={(domain) => {
                setSelectedDomain(domain);
                setDomainModalOpen(true);
              }}
            />
          )}

          {/* Custom Domain Link - Collapsible */}
          <CustomDomainCollapsible onOpenDomainModal={() => setDomainModalOpen(true)} />

          <Button variant="outline" onClick={handleClose} className="mt-2 border-gray-300 text-gray-700">
            Kapat
          </Button>
        </DialogContent>

        {/* Domain Settings Modal */}
        <DomainSettingsModal
          isOpen={domainModalOpen}
          onClose={() => {
            setDomainModalOpen(false);
            setSelectedDomain(undefined);
          }}
          projectId={projectId}
          initialDomain={selectedDomain}
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md bg-white text-gray-900 [&>button]:text-gray-500">
        <DialogHeader className="text-center space-y-3 sm:space-y-4">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
            <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
            Publish Your Website
          </DialogTitle>
          <DialogDescription className="text-base text-gray-500">
            Choose a unique address for your website
          </DialogDescription>
        </DialogHeader>

        {/* Subdomain Input */}
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subdomain" className="text-gray-700">Website Address</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  id="subdomain"
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  placeholder="your-clinic-name"
                  className="pr-10 bg-white border-gray-300 text-gray-900"
                  maxLength={50}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {getStatusIcon()}
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                .openlucius.app
              </span>
            </div>
            
            {/* Status message */}
            {status !== 'idle' && (
              <p className={`text-sm ${status === 'available' ? 'text-emerald-600' : status === 'checking' ? 'text-gray-400' : 'text-red-500'}`}>
                {getStatusText()}
              </p>
            )}

            {/* Suggestion */}
            {suggestion && status === 'taken' && (
              <button
                className="text-sm text-orange-600 hover:underline"
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
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
              <p className="text-xs text-gray-500 mb-1">Your website will be live at:</p>
              <p className="text-sm font-medium text-orange-600">
                Vercel üzerinden yayınlanacak
              </p>
            </div>
          )}
        </div>

        {/* Publish Button */}
        <Button 
          size="lg" 
          className="w-full h-12 text-base gap-2 bg-orange-500 hover:bg-orange-600 text-white"
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

        <p className="text-xs text-center text-gray-400">
          Your website will be publicly accessible after publishing
        </p>
      </DialogContent>
    </Dialog>
  );
}
