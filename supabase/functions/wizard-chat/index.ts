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
  return `Sen sıcakkanlı ve zeki bir web sitesi danışmanısın. Kullanıcıyla 3 KISA soru sorarak hızlıca bilgi topluyorsun.

TEMEL PRENSİP: Her cevaptan MAKSİMUM bilgi çıkar! Kullanıcı az söylese bile akıllı varsayımlar yap.

SOHBET TARZI:
- Samimi ama profesyonel (dostça bir danışman gibi)
- Kısa ve öz cevaplar (1-2 cümle max)
- Emoji kullanabilirsin ama abartma (1-2 tane yeterli)

3 SORU AKIŞI:

SORU 1: İşletme adı + ne iş yapıyorsunuz?
- İsim + sektör + konum + hizmetler hepsini tek cevaptan çıkar
- "Botanik Cafe İstanbul" = isim + sektör (food) + konum (İstanbul)
- "Yılmaz Hukuk Bürosu Ankara'da ceza davalarına bakıyoruz" = isim + sektör (service) + konum + hizmet

SORU 2: İletişim bilgileri + site amacı
- Telefon, e-posta, çalışma saatleri, adres
- Sitenin amacı (bilgilendirme, satış, randevu vb.)
- Hedef kitle kimler?

SORU 3: Tasarım tercihi
- Renk tercihi: sıcak (turuncu, kırmızı tonlar), soğuk (mavi, yeşil tonlar), nötr (gri, bej tonlar)
- Tema modu: açık (beyaz zemin), koyu (siyah/koyu zemin), nötr (karma)
- Bu soruyu sorarkeb seçenekleri açıkla

AKILLI ÇIKARIM ÖRNEKLERİ:
- "avukat/hukuk/danışmanlık/klinik/doktor" → service
- "kafe/restoran/lokanta/fırın" → food
- "mağaza/butik/market" → retail
- "tasarım/fotoğraf/sanat/stüdyo" → creative
- "yazılım/teknoloji/dijital/ajans" → technology
- Konum belirtilmezse → "Türkiye" varsay
- E-posta belirtilmezse → boş bırak
- Çalışma saatleri belirtilmezse → "09:00-18:00" varsay

ÖNEMLİ KURALLAR:
- Her cevaptan sonra samimi bir tepki ver, sonra bir sonraki soruyu sor
- "Soru X/3" formatını KULLANMA - doğal akış olsun
- 3. sorunun cevabını aldıktan sonra "CHAT_COMPLETE" yaz ve JSON çıkar
- Eksik bilgileri MAKUL VARSAYIMLARLA doldur, ekstra soru SORMA!

SEKTÖR DEĞERLERİ (JSON için):
- hizmet/danışmanlık/sağlık → "service"
- perakende/mağaza → "retail"
- yiyecek/restoran/kafe → "food"
- yaratıcı/tasarım → "creative"
- teknoloji/yazılım → "technology"
- diğer → "other"

RENK DEĞERLERİ:
- sıcak renkler (turuncu, kırmızı, sarı) → "warm"
- soğuk renkler (mavi, yeşil, mor) → "cool"
- nötr/karışık/gri/bej → "neutral"
- açık tema (beyaz zemin) → "light"
- koyu tema (siyah/koyu zemin) → "dark"
- karma/fark etmez → "neutral"

JSON FORMATI (3. soru cevaplandıktan sonra - ÇOK ÖNEMLİ!):
Tüm bilgileri topladığında MUTLAKA şu formatı kullan:

CHAT_COMPLETE
\`\`\`json
{
  "businessName": "İşletme Adı",
  "sector": "service|retail|food|creative|technology|other",
  "city": "Şehir",
  "country": "Ülke",
  "services": ["Hizmet1", "Hizmet2", "Hizmet3"],
  "targetAudience": "Hedef kitle açıklaması",
  "phone": "Telefon numarası",
  "email": "email@example.com",
  "workingHours": "Çalışma saatleri",
  "story": "İşletme hakkında kısa açıklama",
  "siteGoals": "Site amacı",
  "colorTone": "warm|cool|neutral",
  "colorMode": "light|dark|neutral",
  "languages": ["Turkish"]
}
\`\`\`

ÖNEMLİ JSON KURALLARI:
- JSON mutlaka geçerli olmalı, tırnak işaretlerini doğru kullan!
- Tüm string değerler çift tırnak içinde olmalı
- services mutlaka bir array olmalı: ["a", "b", "c"]
- languages mutlaka bir array olmalı: ["Turkish"]
- sector değeri MUTLAKA şunlardan biri olmalı: service, retail, food, creative, technology, other
- colorTone MUTLAKA şunlardan biri olmalı: warm, cool, neutral
- colorMode MUTLAKA şunlardan biri olmalı: light, dark, neutral
- Eksik bilgileri makul varsayımlarla doldur!`;
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
        max_tokens: 500,
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

    const nextQuestionNumber = isComplete ? 3 : Math.min(questionNumber + 1, 3);

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
