import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface FormData {
  businessInfo?: {
    businessName: string;
    city: string;
    country: string;
    phone: string;
    email: string;
  };
  professionalDetails?: {
    specialty?: string;
    yearsExperience?: string;
    services?: string[];
    pharmacyType?: string;
  };
  websitePreferences?: {
    language: string;
    tone: string;
    colorPreference: string;
  };
}

function getProfessionSpecificInstructions(profession: string, details: FormData['professionalDetails']): string {
  if (profession === 'doctor') {
    return `
PROFESSION-SPECIFIC REQUIREMENTS FOR DOCTOR:
- Specialty: ${details?.specialty || 'General Practice'}
- Experience: ${details?.yearsExperience || '5+'} years
- Include detailed medical credentials and qualifications
- Add patient care philosophy section
- Describe consultation process step by step (Initial Assessment → Diagnosis → Treatment Plan → Follow-up)
- Include health statistics relevant to the specialty
- Use medical terminology appropriately but explain in patient-friendly language
- Add testimonial placeholders mentioning specific treatments
- Include "What to Expect" section for first-time patients
- Generate statistics: Years of Experience, Patients Treated, Specializations, Success Rate`;
  }
  
  if (profession === 'dentist') {
    return `
PROFESSION-SPECIFIC REQUIREMENTS FOR DENTIST:
- Services: ${details?.services?.join(', ') || 'General Dentistry'}
- Describe dental procedures in patient-friendly, non-scary language
- Include smile transformation concepts and cosmetic dentistry benefits
- Add pediatric dentistry section if applicable
- Emphasize pain-free and comfortable treatment approaches
- Include before/after concept descriptions for treatments
- Add "First Visit Guide" for new patients
- Generate statistics: Years of Experience, Smiles Transformed, Dental Procedures, Patient Satisfaction
- Include sections about modern dental technology and equipment
- Mention emergency dental services availability`;
  }
  
  // Pharmacist
  return `
PROFESSION-SPECIFIC REQUIREMENTS FOR PHARMACIST:
- Pharmacy Type: ${details?.pharmacyType || 'Community Pharmacy'}
- List detailed pharmacy service categories (Prescription Services, OTC Medications, Health Consultations)
- Include health consultation and medication counseling services
- Add medication management and drug interaction information
- Describe prescription services process clearly
- Include sections about health screenings and vaccinations if applicable
- Generate statistics: Years Serving Community, Medications Dispensed, Health Consultations, Customer Satisfaction
- Add wellness product categories (Vitamins, Supplements, Personal Care)
- Include information about medication delivery services
- Mention pharmacist availability for health questions`;
}

function buildPrompt(profession: string, formData: FormData): string {
  const businessInfo = formData.businessInfo;
  const details = formData.professionalDetails;
  const prefs = formData.websitePreferences;

  const professionInstructions = getProfessionSpecificInstructions(profession, details);

  const blogTopics = profession === "doctor"
    ? "health tips, preventive care advice, common medical conditions explained, wellness guidance, seasonal health advice"
    : profession === "dentist"
      ? "oral hygiene tips, dental procedures explained, smile care advice, dental health for families, cosmetic dentistry trends"
      : "medication guides, health supplements information, wellness tips, pharmacy services explained, seasonal health products";

  return `You are a professional website content writer specializing in healthcare websites.

Generate comprehensive, detailed, and authentic website content for a ${profession}'s informational website.

BUSINESS INFORMATION:
- Business Name: ${businessInfo?.businessName || "Healthcare Practice"}
- Location: ${businessInfo?.city || "City"}, ${businessInfo?.country || "Country"}
- Contact Phone: ${businessInfo?.phone || ""}
- Contact Email: ${businessInfo?.email || ""}

${professionInstructions}

WEBSITE PREFERENCES:
- Language: ${prefs?.language || "English"} - ALL content MUST be in this language
- Tone: ${prefs?.tone || "professional"} - use this tone consistently throughout
- This is INFORMATIONAL only - NO prices, NO e-commerce, NO booking systems

CONTENT REQUIREMENTS:
1. ALL content must be in ${prefs?.language || "English"}
2. Use ${prefs?.tone || "professional"} tone throughout
3. NO pricing information anywhere
4. NO "book now" or appointment booking CTAs
5. Focus on building trust and providing valuable information
6. Make content specific, detailed, and authentic for ${profession}
7. Include compelling statistics section with 4 key metrics
8. Generate 3-5 detailed blog posts about ${blogTopics}
9. Each blog post should have 4-5 paragraphs of genuinely helpful content
10. Include FAQ section with 4-5 common questions and detailed answers
11. Make highlights section have 4-6 items with detailed descriptions
12. Services should have 5-8 detailed service descriptions
13. Add a process/workflow section describing how patients/customers interact

Return ONLY valid JSON in this exact format:
{
  "pages": {
    "home": {
      "hero": {
        "title": "string (compelling, benefit-focused headline)",
        "subtitle": "string (clear value proposition)",
        "description": "string (2-3 sentences about what makes this practice special)"
      },
      "welcome": {
        "title": "string (welcoming headline)",
        "content": "string (2-3 paragraph detailed welcome message)"
      },
      "highlights": [
        { "title": "string", "description": "string (2-3 detailed sentences)", "icon": "heart|shield|clock|star|users|award" }
      ],
      "statistics": [
        { "value": "string (e.g., '15+')", "label": "string (e.g., 'Years Experience')" }
      ],
      "process": [
        { "step": 1, "title": "string", "description": "string (what happens at this step)" }
      ]
    },
    "about": {
      "hero": {
        "title": "string",
        "subtitle": "string"
      },
      "story": {
        "title": "string",
        "content": "string (3-4 detailed paragraphs about history, mission, and vision)"
      },
      "values": [
        { "title": "string", "description": "string (2-3 sentences explaining the value)" }
      ],
      "team": {
        "title": "string",
        "description": "string (paragraph about the professional team)"
      },
      "timeline": [
        { "year": "string", "title": "string", "description": "string" }
      ]
    },
    "services": {
      "hero": {
        "title": "string",
        "subtitle": "string"
      },
      "intro": {
        "title": "string",
        "content": "string (detailed overview of services and approach)"
      },
      "servicesList": [
        { "title": "string", "description": "string (3-4 sentences describing the service)", "icon": "stethoscope|pill|smile|activity|microscope|syringe|heart|brain|eye" }
      ],
      "process": [
        { "step": 1, "title": "string", "description": "string" }
      ],
      "faq": [
        { "question": "string", "answer": "string (detailed, helpful answer)" }
      ]
    },
    "contact": {
      "hero": {
        "title": "string",
        "subtitle": "string"
      },
      "info": {
        "address": "string (full address using provided location)",
        "phone": "string",
        "email": "string",
        "hours": "string (detailed working hours)"
      },
      "form": {
        "title": "string",
        "subtitle": "string"
      },
      "workingHours": [
        { "day": "string", "hours": "string" }
      ]
    },
    "blog": {
      "hero": {
        "title": "string",
        "subtitle": "string"
      },
      "posts": [
        {
          "id": "post-1",
          "title": "string (engaging, SEO-friendly title)",
          "excerpt": "string (compelling 2-3 sentence summary)",
          "content": "string (4-5 detailed paragraphs with genuinely useful information)",
          "category": "string",
          "publishedAt": "2024-01-15"
        }
      ]
    }
  },
  "metadata": {
    "siteName": "string",
    "tagline": "string (memorable tagline)",
    "seoDescription": "string (meta description for SEO, 150-160 characters)"
  }
}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { projectId } = await req.json();

    if (!projectId) {
      console.error("Missing projectId");
      return new Response(JSON.stringify({ error: "Missing projectId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch project data
    console.log("Fetching project:", projectId);
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchError || !project) {
      console.error("Project fetch error:", fetchError);
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formData = project.form_data as FormData;
    const profession = project.profession;

    console.log("Generating enhanced content for:", profession);

    // Call Lovable AI Gateway
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "user",
              content: buildPrompt(profession, formData),
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to generate content" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No content generated" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the JSON from the AI response
    let generatedContent;
    try {
      // Extract JSON from the response (in case it has markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        generatedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse generated content" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update project with generated content and status
    console.log("Saving generated content");
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        generated_content: generatedContent,
        status: "generated",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to save generated content" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Content generated successfully");
    return new Response(
      JSON.stringify({
        success: true,
        content: generatedContent,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
