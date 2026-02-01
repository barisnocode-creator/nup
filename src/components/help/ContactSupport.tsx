import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, MessageSquare, Send, ExternalLink } from 'lucide-react';

const topics = [
  { value: 'general', label: 'Genel Soru' },
  { value: 'technical', label: 'Teknik Sorun' },
  { value: 'billing', label: 'Ödeme/Fatura' },
  { value: 'feature', label: 'Özellik İsteği' },
  { value: 'bug', label: 'Hata Bildirimi' },
  { value: 'other', label: 'Diğer' },
];

export function ContactSupport() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic || !subject || !message) {
      toast({
        title: 'Eksik Bilgi',
        description: 'Lütfen tüm alanları doldurun.',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);
    
    // Simulate sending (in real app, this would call an edge function)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: 'Mesajınız Gönderildi',
        description: 'En kısa sürede size dönüş yapacağız.',
      });

      // Reset form
      setTopic('');
      setSubject('');
      setMessage('');
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Contact Options */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">E-posta</p>
              <a 
                href="mailto:support@openlucius.com" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                support@openlucius.com
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ExternalLink className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Dokümantasyon</p>
              <a 
                href="https://docs.openlucius.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                docs.openlucius.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Destek Formu
          </CardTitle>
          <CardDescription>
            Sorununuzu detaylı açıklayın, size yardımcı olalım.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email (auto-filled) */}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <Label htmlFor="topic">Konu</Label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Konu seçin" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Başlık</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Sorununuzu kısaca özetleyin"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Mesaj</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Sorununuzu detaylı açıklayın. Ekran görüntüleri ve hata mesajları varsa paylaşın."
                rows={5}
              />
            </div>

            {/* Submit */}
            <Button type="submit" disabled={sending} className="w-full sm:w-auto">
              <Send className="h-4 w-4 mr-2" />
              {sending ? 'Gönderiliyor...' : 'Mesaj Gönder'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
