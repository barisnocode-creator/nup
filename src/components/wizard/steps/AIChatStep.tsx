import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExtractedBusinessData } from '@/types/wizard';
import { mapSectorToProfession } from '@/types/wizard';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatStepProps {
  onComplete: (data: ExtractedBusinessData) => void;
  onValidityChange: (isValid: boolean) => void;
}

const TOTAL_QUESTIONS = 3 as const;

const INITIAL_MESSAGE = `Merhaba! 👋 Ben web sitesi danışmanınızım. Size 3 kısa soru sorarak hızlıca harika bir web sitesi oluşturacağım.

İşletmenizin adı nedir ve ne iş yapıyorsunuz? 🏢`;

export function AIChatStep({ onComplete, onValidityChange }: AIChatStepProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: INITIAL_MESSAGE }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isLoading, streamingContent]);

  useEffect(() => {
    if (!isLoading && inputRef.current && !isComplete) {
      inputRef.current.focus();
    }
  }, [isLoading, isComplete]);

  const parseSSEStream = useCallback(async (
    response: Response,
    onDelta: (text: string) => void,
    onDone: (fullText: string) => void
  ) => {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') {
          onDone(fullContent);
          return;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            fullContent += content;
            onDelta(content);
          }
        } catch {
          buffer = line + '\n' + buffer;
          break;
        }
      }
    }

    onDone(fullContent);
  }, []);

  const processCompletedResponse = useCallback((content: string): { 
    isCompleteResponse: boolean; 
    cleanResponse: string; 
    extractedData: ExtractedBusinessData | null;
  } => {
    const isCompleteResponse = content.includes('CHAT_COMPLETE');
    let cleanResponse = content;
    let extractedData: ExtractedBusinessData | null = null;
    let parseError = false;

    if (isCompleteResponse) {
      let jsonMatch = content.match(/CHAT_COMPLETE\s*```json\s*(\{[\s\S]*?\})\s*```/);
      if (!jsonMatch) {
        jsonMatch = content.match(/CHAT_COMPLETE\s*(\{[\s\S]*\})/);
      }
      
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          extractedData = {
            businessName: parsed.businessName || 'Yeni İşletme',
            sector: mapSectorToProfession(parsed.sector) || 'other',
            city: parsed.city || '',
            country: parsed.country || 'Turkey',
            services: parsed.services || [],
            targetAudience: parsed.targetAudience || '',
            phone: parsed.phone || '',
            email: parsed.email || '',
            workingHours: parsed.workingHours || '',
            story: parsed.story || '',
            siteGoals: parsed.siteGoals || '',
            colorTone: parsed.colorTone || 'neutral',
            colorMode: parsed.colorMode || 'light',
            languages: parsed.languages || ['Turkish'],
            uniqueValue: parsed.uniqueValue || '',
            yearsExperience: parsed.yearsExperience || '',
            address: parsed.address || '',
            vision: parsed.vision || '',
            achievements: parsed.achievements || '',
            mainCTA: parsed.mainCTA || '',
            additionalInfo: parsed.additionalInfo || '',
          };
        } catch (e) {
          console.error('Failed to parse extracted data:', e);
          parseError = true;
        }
      } else {
        parseError = true;
      }
      
      cleanResponse = content.split('CHAT_COMPLETE')[0].trim();
      
      if (parseError || !extractedData) {
        extractedData = {
          businessName: 'Yeni İşletme',
          sector: 'other',
          city: '',
          country: 'Turkey',
          services: [],
          targetAudience: '',
          phone: '',
          email: '',
          workingHours: '',
          story: '',
          siteGoals: '',
          colorTone: 'neutral',
          colorMode: 'light',
          languages: ['Turkish'],
          uniqueValue: '',
          yearsExperience: '',
          address: '',
          vision: '',
          achievements: '',
          mainCTA: '',
          additionalInfo: '',
        };
        cleanResponse += '\n\n⚠️ Bazı bilgiler eksik kaldı. Devam edebilirsiniz, eksik bilgileri daha sonra düzenleyebilirsiniz.';
      } else {
        cleanResponse += '\n\n✨ Harika! Tüm bilgileri topladım. Şimdi web sitenizi oluşturmaya hazırız!';
      }
    }

    return { isCompleteResponse, cleanResponse, extractedData };
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || isComplete) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);
    setStreamingContent('');

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wizard-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: updatedMessages,
            questionNumber,
            stream: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('text/event-stream')) {
        let accumulatedContent = '';
        
        await parseSSEStream(
          response,
          (delta) => {
            accumulatedContent += delta;
            setStreamingContent(accumulatedContent);
          },
          (fullText) => {
            const { isCompleteResponse, cleanResponse, extractedData } = processCompletedResponse(fullText);
            
            setStreamingContent('');
            setMessages([
              ...updatedMessages,
              { role: 'assistant', content: cleanResponse },
            ]);
            
            if (isCompleteResponse && extractedData) {
              setQuestionNumber(TOTAL_QUESTIONS);
              setIsComplete(true);
              onValidityChange(true);
              onComplete(extractedData);
            } else if (!isCompleteResponse) {
              setQuestionNumber(prev => Math.min(prev + 1, TOTAL_QUESTIONS));
            }
            
            setIsLoading(false);
          }
        );
      } else {
        const data = await response.json();
        
        let processedData = data.extractedData;
        if (processedData?.sector) {
          processedData = {
            ...processedData,
            sector: mapSectorToProfession(processedData.sector),
          };
        }
        
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: data.response },
        ]);
        setQuestionNumber(data.questionNumber);

        if (data.isComplete && processedData) {
          setIsComplete(true);
          onValidityChange(true);
          onComplete(processedData);
        }
        
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Mesaj gönderilemedi');
      setMessages(messages);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const progressPercentage = Math.min((questionNumber / TOTAL_QUESTIONS) * 100, 100);

  const displayMessages = streamingContent 
    ? [...messages, { role: 'assistant' as const, content: streamingContent }]
    : messages;

  return (
    <div className="flex flex-col h-[400px]">
      {/* Header */}
      <div className="space-y-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">AI Asistan</h2>
          <span className="text-sm text-muted-foreground font-medium">
            Soru {Math.min(questionNumber, TOTAL_QUESTIONS)}/{TOTAL_QUESTIONS}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${progressPercentage}%`,
              background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))`,
            }}
          />
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 py-4" ref={scrollRef}>
        <div className="space-y-4 pr-4">
          <AnimatePresence mode="popLayout">
            {displayMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gradient-to-br from-primary/20 to-primary/10 text-primary'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    'rounded-2xl px-4 py-2.5 max-w-[80%] shadow-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-md'
                      : 'bg-muted/80 border border-border/30 rounded-tl-md'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && !streamingContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-md px-4 py-3 bg-muted/80 border border-border/30 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Error */}
      {error && (
        <div className="py-2">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isComplete ? 'Sohbet tamamlandı' : 'Cevabınızı yazın...'}
            disabled={isLoading || isComplete}
            className="flex-1 h-11 rounded-xl border-border/50 shadow-sm focus-visible:ring-primary/30 focus-visible:border-primary/50"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading || isComplete}
            size="icon"
            className="h-11 w-11 rounded-xl shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {isComplete && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground mt-2 text-center"
          >
            ✨ Bilgiler toplandı! "Web Sitesi Oluştur" butonuna tıklayın.
          </motion.p>
        )}
      </div>
    </div>
  );
}
