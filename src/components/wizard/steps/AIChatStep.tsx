import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Loader2, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
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

// Hardcoded first message for instant display - updated for 10 questions
const INITIAL_MESSAGE = `Merhaba! 👋 Ben web sitesi danışmanınızım. Size 10 kısa soru sorarak işletmeniz için harika bir web sitesi oluşturacağım.

**Soru 1/10:** İşletmenizin adı nedir?`;

const TOTAL_QUESTIONS = 10;

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

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isLoading, streamingContent]);

  // Focus input after AI responds
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

      // Process complete lines
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
          // Incomplete JSON, put back and wait
          buffer = line + '\n' + buffer;
          break;
        }
      }
    }

    // Final flush
    onDone(fullContent);
  }, []);

  const processCompletedResponse = useCallback((content: string) => {
    const isCompleteResponse = content.includes('CHAT_COMPLETE');
    let cleanResponse = content;
    let extractedData = null;

    if (isCompleteResponse) {
      const jsonMatch = content.match(/CHAT_COMPLETE\s*(\{[\s\S]*\})/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          // Map sector to valid profession
          extractedData = {
            ...parsed,
            sector: mapSectorToProfession(parsed.sector),
          };
        } catch (e) {
          console.error('Failed to parse extracted data:', e);
        }
      }
      cleanResponse = content.split('CHAT_COMPLETE')[0].trim();
      cleanResponse += '\n\n✨ Harika! Tüm bilgileri topladım. Şimdi web sitenizi oluşturmaya hazırız!';
    }

    return { isCompleteResponse, cleanResponse, extractedData };
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || isComplete) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);
    setStreamingContent('');

    // Add user message immediately
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

      // Check if streaming response
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
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
            
            if (isCompleteResponse) {
              setQuestionNumber(TOTAL_QUESTIONS);
              setIsComplete(true);
              onValidityChange(true);
              if (extractedData) {
                onComplete(extractedData);
              }
            } else {
              setQuestionNumber(prev => Math.min(prev + 1, TOTAL_QUESTIONS));
            }
            
            setIsLoading(false);
          }
        );
      } else {
        // Handle non-streaming response (fallback)
        const data = await response.json();
        
        // Process extracted data with sector mapping
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

  // Display content: either streaming or final messages
  const displayMessages = streamingContent 
    ? [...messages, { role: 'assistant' as const, content: streamingContent }]
    : messages;

  return (
    <div className="flex flex-col h-[400px]">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">AI Asistan</h2>
          <span className="text-sm text-muted-foreground">
            Soru {Math.min(questionNumber, TOTAL_QUESTIONS)}/{TOTAL_QUESTIONS}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 py-4" ref={scrollRef}>
        <div className="space-y-4 pr-4">
          {displayMessages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
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
                  'rounded-lg px-4 py-2 max-w-[80%]',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && !streamingContent && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-lg px-4 py-2 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
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
      <div className="pt-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isComplete ? 'Sohbet tamamlandı' : 'Cevabınızı yazın...'}
            disabled={isLoading || isComplete}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading || isComplete}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {isComplete && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            ✨ Bilgiler toplandı! Devam etmek için "Devam Et" butonuna tıklayın.
          </p>
        )}
      </div>
    </div>
  );
}
