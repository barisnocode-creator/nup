import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  questionNumber: number;
  stream?: boolean;
}

const getSystemPrompt = () => {
  return `Sen bir profesyonel web sitesi danışmanısın. Kullanıcının işletmesi için web sitesi oluşturmak üzere sohbet ediyorsun.

GÖREV:
- Toplam 10 kısa soru sor (birer birer, sırayla)
- Her seferde SADECE BİR soru sor (tek cümle!)
- Doğal, samimi ve profesyonel bir dil kullan
- Kullanıcının cevabını aldıktan sonra kısa bir onay ver ("Harika!", "Anladım!" vb.) ve hemen sonraki soruya geç
- Türkçe konuş

SORULAR (bu sırayla, HER BİRİ TEK CÜMLE):

1. İşletmenizin adı nedir?

2. Hangi sektörde faaliyet gösteriyorsunuz? (hizmet, perakende, yiyecek/içecek, yaratıcı/tasarım, teknoloji, diğer)

3. Hangi şehir ve ülkede bulunuyorsunuz?

4. Ana hizmetleriniz veya ürünleriniz neler? (3-4 tane yeterli)

5. Hedef kitleniz kimler? (tek cümleyle)

6. İletişim bilgileriniz neler? (telefon, e-posta, çalışma saatleri)

7. İşletmenizi tek cümleyle nasıl tanımlarsınız?

8. Web sitenizin amacı ne? (bilgilendirme, satış, randevu alma vb.)

9. Hangi renk tonlarını tercih edersiniz? (sıcak renkler mi soğuk renkler mi? Açık tema mı koyu tema mı?)

10. Web siteniz hangi dillerde olsun? (Türkçe, İngilizce veya ikisi birden)

ÖNEMLİ KURALLAR:
- Her cevaptan sonra KISACA onay ver ve HEMEN sonraki soruya geç
- Soru numarasını belirt: "Soru 2/10:" gibi
- Uzun açıklamalar yapma, kısa ve öz ol
- 10. soru cevaplandıktan sonra "CHAT_COMPLETE" yaz ve ardından toplanan tüm bilgileri JSON formatında özetle

SEKTÖR DEĞERLERİ (JSON'da bu İngilizce değerleri kullan):
- hizmet/danışmanlık → "service"
- perakende/mağaza → "retail"
- yiyecek/restoran/kafe → "food"
- yaratıcı/tasarım → "creative"
- teknoloji/yazılım → "technology"
- diğer → "other"

RENK DEĞERLERİ:
- sıcak renkler → "warm"
- soğuk renkler → "cool"
- nötr/karışık → "neutral"
- açık tema → "light"
- koyu tema → "dark"

JSON FORMATI (10. sorudan sonra):
CHAT_COMPLETE
{
  "businessName": "...",
  "sector": "service|retail|food|creative|technology|other",
  "city": "...",
  "country": "...",
  "services": ["...", "...", "..."],
  "targetAudience": "...",
  "phone": "...",
  "email": "...",
  "workingHours": "...",
  "story": "...",
  "siteGoals": "...",
  "colorTone": "warm|cool|neutral",
  "colorMode": "light|dark|neutral",
  "languages": ["Turkish"] veya ["English"] veya ["Turkish", "English"]
}`;
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { messages, questionNumber, stream = true }: RequestBody = await req.json();

    console.log(`[wizard-chat] Question: ${questionNumber}, Messages: ${messages.length}, Stream: ${stream}`);

    // Build the conversation with system prompt
    const systemPrompt = getSystemPrompt();
    const conversationMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    // Call Lovable AI Gateway with streaming
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: conversationMessages,
        temperature: 0.5,
        max_tokens: 300,
        stream: stream,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[wizard-chat] AI Gateway error: ${response.status}`, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit aşıldı, lütfen biraz bekleyip tekrar deneyin.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Kredi limiti aşıldı.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // If streaming, pass through the SSE stream
    if (stream) {
      console.log('[wizard-chat] Returning streaming response');
      return new Response(response.body, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming fallback
    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || '';

    console.log(`[wizard-chat] AI Response length: ${assistantMessage.length}`);

    // Check if chat is complete (contains CHAT_COMPLETE marker)
    const isComplete = assistantMessage.includes('CHAT_COMPLETE');
    let extractedData = null;

    if (isComplete) {
      // Extract JSON from the response
      const jsonMatch = assistantMessage.match(/CHAT_COMPLETE\s*(\{[\s\S]*\})/);
      if (jsonMatch) {
        try {
          extractedData = JSON.parse(jsonMatch[1]);
          console.log('[wizard-chat] Extracted data:', extractedData);
        } catch (e) {
          console.error('[wizard-chat] Failed to parse extracted data:', e);
        }
      }
    }

    // Clean the response (remove CHAT_COMPLETE and JSON if present)
    let cleanResponse = assistantMessage;
    if (isComplete) {
      cleanResponse = assistantMessage.split('CHAT_COMPLETE')[0].trim();
      cleanResponse += '\n\n✨ Harika! Tüm bilgileri topladım. Şimdi web sitenizi oluşturmaya hazırız!';
    }

    const nextQuestionNumber = isComplete ? 10 : Math.min(questionNumber + 1, 10);

    return new Response(
      JSON.stringify({
        response: cleanResponse,
        questionNumber: nextQuestionNumber,
        isComplete,
        extractedData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[wizard-chat] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
