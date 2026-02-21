import { useState, useEffect } from 'react';
import { Globe, Plus, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface DomainTabProps {
  projectId: string;
  subdomain: string | null;
  customDomain: string | null;
}

interface CustomDomain {
  id: string;
  domain: string;
  status: string;
  is_primary: boolean;
  verification_token: string;
  verified_at: string | null;
}

export function DomainTab({ projectId, subdomain, customDomain }: DomainTabProps) {
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState('');
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, [projectId]);

  const fetchDomains = async () => {
    const { data, error } = await supabase
      .from('custom_domains')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDomains(data);
    }
    setLoading(false);
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;

    setAdding(true);
    try {
      const { data, error } = await supabase.functions.invoke('add-custom-domain', {
        body: { projectId, domain: newDomain.trim() },
      });

      if (error) throw error;

      await fetchDomains();
      setNewDomain('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding domain:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      await supabase.functions.invoke('verify-domain', {
        body: { domainId },
      });
      await fetchDomains();
    } catch (error) {
      console.error('Error verifying domain:', error);
    }
  };

  const handleRemoveDomain = async (domainId: string) => {
    try {
      await supabase.functions.invoke('remove-domain', {
        body: { domainId },
      });
      await fetchDomains();
    } catch (error) {
      console.error('Error removing domain:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      default:
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Subdomain Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Default Subdomain
          </CardTitle>
          <CardDescription>
            Your website is accessible at this address by default
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium">
                {subdomain ? `${subdomain}.openlucius.com` : 'No subdomain set'}
              </span>
            </div>
            {subdomain && (
              <Button variant="ghost" size="sm" asChild>
                <a 
                  href={`https://${subdomain}.openlucius.com`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Custom Domains Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Custom Domains</CardTitle>
            <CardDescription>
              Connect your own domain to your website
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
            <Plus className="w-4 h-4 mr-2" />
            Add Domain
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Domain Form */}
          {showAddForm && (
            <div className="p-4 border rounded-lg space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  placeholder="www.yourdomain.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddDomain} disabled={adding || !newDomain.trim()}>
                  {adding ? 'Adding...' : 'Add Domain'}
                </Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Domain List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : domains.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No custom domains configured</p>
              <p className="text-sm">Add a custom domain to use your own URL</p>
            </div>
          ) : (
            <div className="space-y-3">
              {domains.map((domain) => (
                <div 
                  key={domain.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(domain.status)}
                    <div>
                      <p className="font-medium">{domain.domain}</p>
                      {domain.is_primary && (
                        <span className="text-xs text-muted-foreground">Primary</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(domain.status)}
                    {domain.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVerifyDomain(domain.id)}
                      >
                        Verify
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleRemoveDomain(domain.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* DNS Instructions */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <h4 className="font-medium mb-2">📋 DNS Configuration</h4>
          <p className="text-sm text-muted-foreground mb-3">
            To connect your custom domain, add these DNS records:
          </p>
          <div className="space-y-3 text-sm font-mono bg-background p-3 rounded">
            <div>
              <p className="text-xs text-muted-foreground mb-1">A Kaydı (Root Domain)</p>
              <p><strong>Type:</strong> A | <strong>Name:</strong> @ | <strong>Value:</strong> 75.2.60.5</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">A Kaydı (WWW)</p>
              <p><strong>Type:</strong> A | <strong>Name:</strong> www | <strong>Value:</strong> 75.2.60.5</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">TXT Kaydı (Doğrulama)</p>
              <p><strong>Type:</strong> TXT | <strong>Name:</strong> _lovable | <strong>Value:</strong> Doğrulama ekranında gösterilir</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            🔒 SSL sertifikası otomatik olarak sağlanır (Let's Encrypt).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
