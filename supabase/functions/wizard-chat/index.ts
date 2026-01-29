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
  profession: string;
  messages: ChatMessage[];
  questionNumber: number;
}

const PROFESSION_LABELS: Record<string, string> = {
  doctor: 'Doktor',
  dentist: 'Diş Hekimi',
  pharmacist: 'Eczacı',
};

const getSystemPrompt = (profession: string) => {
  const professionLabel = PROFESSION_LABELS[profession] || profession;
  
  return `Sen bir profesyonel web sitesi danışmanısın. ${professionLabel} için web sitesi oluşturmak üzere kullanıcıyla sohbet ediyorsun.

GÖREV:
- Toplam 10 soru sor (birer birer, sırayla)
- Her seferde SADECE BİR soru sor
- Sorular ${professionLabel} mesleğine özel olsun
- Doğal, samimi ve profesyonel bir dil kullan
- Kullanıcının cevabını aldıktan sonra kısa bir onay ver ve sonraki soruya geç
- Türkçe konuş

SORU KONULARI (bu sırayla sor):
1. İşletme/Klinik/Eczane adı
2. Şehir ve ülke (konum)
3. Uzmanlık alanı veya ana hizmet
4. Mesleki deneyim süresi (yıl)
5. Sunulan hizmetler (en az 3 tane)
6. Hedef müşteri/hasta profili
7. Rekabet avantajı (sizi farklı kılan)
8. İletişim bilgileri (telefon ve e-posta)
9. Çalışma saatleri
10. Web sitesinde öne çıkarmak istediğiniz ek bilgiler

ÖNEMLİ KURALLAR:
- İlk mesajda kendini tanıt ve 1. soruyu sor
- Her cevaptan sonra kısaca onay ver ("Harika!", "Anladım!", vb.) ve hemen sonraki soruyu sor
- Soru numarasını belirt: "Soru 3/10:" gibi
- 10. soru cevaplandıktan sonra "CHAT_COMPLETE" yaz ve ardından toplanan tüm bilgileri JSON formatında özetle

JSON FORMATI (10. sorudan sonra):
CHAT_COMPLETE
{
  "businessName": "...",
  "city": "...",
  "country": "...",
  "specialty": "...",
  "yearsExperience": "...",
  "services": ["...", "...", "..."],
  "targetAudience": "...",
  "uniqueValue": "...",
  "phone": "...",
  "email": "...",
  "workingHours": "...",
  "additionalInfo": "..."
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

    const { profession, messages, questionNumber }: RequestBody = await req.json();

    if (!profession) {
      throw new Error('Profession is required');
    }

    console.log(`[wizard-chat] Profession: ${profession}, Question: ${questionNumber}, Messages: ${messages.length}`);

    // Build the conversation with system prompt
    const systemPrompt = getSystemPrompt(profession);
    const conversationMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 1000,
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
      // Add a completion message
      cleanResponse += '\n\n✨ Harika! Tüm bilgileri topladım. Şimdi web sitenizi oluşturmaya hazırız!';
    }

    // Determine next question number
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
