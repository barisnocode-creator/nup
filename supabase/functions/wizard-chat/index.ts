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
  return `Sen sıcakkanlı ve zeki bir web sitesi danışmanısın. Kullanıcıyla doğal sohbet ederek işletmesi için bilgi topluyorsun.

TEMEL PRENSİP: Kullanıcının söylediklerinden maksimum bilgi çıkar!
- "Avukatlık ofisi" = sektör hizmet, sormana gerek yok
- "İstanbul'da kafe" = konum + sektör, ikisini de anladın
- "Yazılım şirketi kuruyoruz" = teknoloji sektörü
- "Dr. Ayşe Kaya Diş Kliniği" = sağlık/hizmet sektörü
- "Antalya'da butik otel" = konum Antalya, hizmet sektörü

SOHBET TARZI:
- Samimi ama profesyonel (dostça bir danışman gibi)
- Kısa ve öz cevaplar (2-3 cümle max)
- Kullanıcının cevabına uygun tepkiler ("Vay be!", "Harika bir alan!", "Güzel!")
- Gereksiz soru sorma - zaten anladığını tekrar sorma!
- Emoji kullanabilirsin ama abartma (1-2 tane yeterli)

TOPLANACAK BİLGİLER (esnek sıra, sadece EKSİK olanları sor):
1. İşletme adı
2. Sektör (genellikle isimden anlaşılır - anlaşılırsa SORMA!)
3. Konum (şehir/ülke)
4. Ana hizmetler/ürünler (3-4 tane)
5. Hedef kitle
6. İletişim (telefon, e-posta, çalışma saatleri)
7. Kısa tanıtım cümlesi / hikaye
8. Site amacı (bilgilendirme, satış, randevu vb.)
9. Renk/tema tercihi (sıcak/soğuk, açık/koyu)
10. Dil tercihi (Türkçe, İngilizce veya ikisi)

ÖRNEK DİYALOGLAR:

Kullanıcı: "Yılmaz Hukuk Bürosu"
Sen: "Yılmaz Hukuk Bürosu, profesyonel bir isim! 👔 Hangi şehirde müvekkillerinize hizmet veriyorsunuz?"
(Sektörü sormadın çünkü "hukuk bürosu" zaten belli etti)

Kullanıcı: "İstanbul'da bir kafe açtık"
Sen: "İstanbul'da kafe, harika! ☕ Kafenizin adı ne olsun web sitesinde?"
(Hem konum hem sektör anlaşıldı, sadece isim soruyorsun)

Kullanıcı: "Botanik Cafe"
Sen: "Botanik Cafe, çok şık! 🌿 Menünüzde neler var - kahve çeşitleri, tatlılar, yemekler?"

AKILLI ÇIKARIM ÖRNEKLERİ:
- "avukat/hukuk/danışmanlık" → service sektörü
- "kafe/restoran/lokanta" → food sektörü  
- "mağaza/butik/market" → retail sektörü
- "tasarım/fotoğraf/sanat" → creative sektörü
- "yazılım/teknoloji/dijital" → technology sektörü
- "klinik/doktor/hastane" → service sektörü (sağlık)

ÖNEMLİ KURALLAR:
- Her cevaptan sonra samimi bir tepki ver, sonra eksik bilgiyi sor
- "Soru X/10" formatını KULLANMA - doğal akış olsun
- Tüm 10 bilgi toplandığında "CHAT_COMPLETE" yaz ve JSON çıkar
- Bir cevaptan birden fazla bilgi çıkarabilirsen çıkar!

SEKTÖR DEĞERLERİ (JSON için İngilizce):
- hizmet/danışmanlık/sağlık → "service"
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

JSON FORMATI (tüm bilgiler toplandığında):
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
}

KURAL: Sadece bilmediğini sor, anladığını varsay ve onay ver!`;
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
        temperature: 0.7,
        max_tokens: 400,
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
