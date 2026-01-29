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
  profession: string; // Now represents sector
  messages: ChatMessage[];
  questionNumber: number;
}

const SECTOR_LABELS: Record<string, string> = {
  service: 'Hizmet Sektörü',
  retail: 'Perakende & Satış',
  food: 'Yiyecek & İçecek',
  creative: 'Kreatif & Medya',
  technology: 'Teknoloji',
  other: 'Genel',
};

const getSystemPrompt = (sector: string) => {
  const sectorLabel = SECTOR_LABELS[sector] || sector;
  
  return `Sen bir profesyonel web sitesi danışmanısın. ${sectorLabel} alanında faaliyet gösteren bir işletme için web sitesi oluşturmak üzere kullanıcıyla sohbet ediyorsun.

GÖREV:
- Toplam 5 detaylı soru sor (birer birer, sırayla)
- Her seferde SADECE BİR soru sor (birden fazla alt soru içerebilir)
- Sorular kurulacak web sitesine yönelik olsun
- Doğal, samimi ve profesyonel bir dil kullan
- Kullanıcının cevabını aldıktan sonra kısa bir onay ver ve sonraki soruya geç
- Türkçe konuş

SORU KONULARI (bu sırayla sor):

SORU 1/5: İşletme Kimliği
- İşletmenizin adı nedir?
- Tam olarak hangi sektörde/alanda faaliyet gösteriyorsunuz?
- Hangi şehir/ülkede bulunuyorsunuz?
- Kaç yıldır bu alanda faaliyet gösteriyorsunuz?

SORU 2/5: Sunulan Değer
- Ana ürün veya hizmetleriniz nelerdir? (en az 3 tane)
- Hedef kitleniz kimler? (yaş, gelir düzeyi, ilgi alanları)
- Sizi rakiplerinizden ayıran en önemli 2-3 özellik nedir?

SORU 3/5: İletişim & Erişim
- Telefon numaranız?
- E-posta adresiniz?
- Çalışma günleri ve saatleriniz?
- Fiziksel adresiniz var mı? (varsa detay)

SORU 4/5: Marka Hikayesi
- İşletmeniz nasıl kuruldu? (kısa hikaye)
- Vizyonunuz ve değerleriniz neler?
- Elde ettiğiniz önemli başarılar veya sertifikalar var mı?

SORU 5/5: Site Hedefleri
- Web sitenizden ne bekliyorsunuz? (bilgilendirme, satış, randevu vb.)
- Ziyaretçilerin sitede yapmasını istediğiniz en önemli aksiyon nedir?
- Öne çıkarmak istediğiniz ek bilgiler var mı?

ÖNEMLİ KURALLAR:
- İlk mesajda kendini kısaca tanıt ve 1. soruyu sor
- Her cevaptan sonra kısaca onay ver ("Harika!", "Anladım!", vb.) ve hemen sonraki soruya geç
- Soru numarasını belirt: "Soru 2/5:" gibi
- 5. soru cevaplandıktan sonra "CHAT_COMPLETE" yaz ve ardından toplanan tüm bilgileri JSON formatında özetle

JSON FORMATI (5. sorudan sonra):
CHAT_COMPLETE
{
  "businessName": "...",
  "sector": "...",
  "city": "...",
  "country": "...",
  "yearsExperience": "...",
  "services": ["...", "...", "..."],
  "targetAudience": "...",
  "uniqueValue": "...",
  "phone": "...",
  "email": "...",
  "workingHours": "...",
  "address": "...",
  "story": "...",
  "vision": "...",
  "achievements": "...",
  "siteGoals": "...",
  "mainCTA": "...",
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

    const { profession: sector, messages, questionNumber }: RequestBody = await req.json();

    if (!sector) {
      throw new Error('Sector is required');
    }

    console.log(`[wizard-chat] Sector: ${sector}, Question: ${questionNumber}, Messages: ${messages.length}`);

    // Build the conversation with system prompt
    const systemPrompt = getSystemPrompt(sector);
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

    // Determine next question number (now 5 total instead of 10)
    const nextQuestionNumber = isComplete ? 5 : Math.min(questionNumber + 1, 5);

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
