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

function buildPrompt(profession: string, formData: FormData): string {
  const businessInfo = formData.businessInfo;
  const details = formData.professionalDetails;
  const prefs = formData.websitePreferences;

  const professionDetails =
    profession === "doctor"
      ? `Medical Specialty: ${details?.specialty || "General Practice"}
Years of Experience: ${details?.yearsExperience || "5+"}`
      : profession === "dentist"
        ? `Dental Services: ${details?.services?.join(", ") || "General Dentistry"}`
        : `Pharmacy Type: ${details?.pharmacyType || "Local/Community"}`;

  const blogTopics = profession === "doctor"
    ? "health tips, preventive care advice, common medical conditions explained, wellness guidance"
    : profession === "dentist"
      ? "oral hygiene tips, dental procedures explained, smile care advice, dental health for families"
      : "medication guides, health supplements information, wellness tips, pharmacy services explained";

  return `You are a professional website content writer specializing in healthcare websites.

Generate comprehensive website content for a ${profession}'s informational website with the following details:

Business Name: ${businessInfo?.businessName || "Healthcare Practice"}
Location: ${businessInfo?.city || "City"}, ${businessInfo?.country || "Country"}
Contact Phone: ${businessInfo?.phone || ""}
Contact Email: ${businessInfo?.email || ""}
${professionDetails}

Website Preferences:
- Language: ${prefs?.language || "English"}
- Tone: ${prefs?.tone || "professional"} (use this tone throughout)
- This is an INFORMATIONAL website only - NO prices, NO e-commerce, NO booking systems

Generate content for 5 pages (Home, About, Services, Contact, and Blog) in JSON format. Each page should have compelling, professional content appropriate for a healthcare ${profession}.

IMPORTANT RULES:
1. All content must be in ${prefs?.language || "English"}
2. Use a ${prefs?.tone || "professional"} tone throughout
3. No pricing information
4. No "book now" or appointment booking CTAs
5. Focus on building trust and providing information
6. Include relevant sections for each page
7. Make content specific to the ${profession} profession
8. Generate 3 blog posts about ${blogTopics}
9. Each blog post should have 3-4 paragraphs of detailed, helpful content
10. Include an FAQ section in services with 3-4 common questions

Return ONLY valid JSON in this exact format:
{
  "pages": {
    "home": {
      "hero": {
        "title": "string (compelling headline)",
        "subtitle": "string (value proposition)",
        "description": "string (2-3 sentences about the practice)"
      },
      "welcome": {
        "title": "string",
        "content": "string (detailed paragraph about welcoming patients)"
      },
      "highlights": [
        { "title": "string", "description": "string (2-3 sentences)", "icon": "heart|shield|clock|star|users|award" }
      ]
    },
    "about": {
      "hero": {
        "title": "string",
        "subtitle": "string"
      },
      "story": {
        "title": "string",
        "content": "string (2-3 paragraphs about the practice history and mission)"
      },
      "values": [
        { "title": "string", "description": "string (1-2 sentences)" }
      ],
      "team": {
        "title": "string",
        "description": "string (paragraph about the team)"
      }
    },
    "services": {
      "hero": {
        "title": "string",
        "subtitle": "string"
      },
      "intro": {
        "title": "string",
        "content": "string (overview of services)"
      },
      "servicesList": [
        { "title": "string", "description": "string (2-3 sentences)", "icon": "stethoscope|pill|smile|activity|microscope|syringe|heart|brain|eye" }
      ],
      "faq": [
        { "question": "string", "answer": "string (helpful answer)" }
      ]
    },
    "contact": {
      "hero": {
        "title": "string",
        "subtitle": "string"
      },
      "info": {
        "address": "string (use provided city/country)",
        "phone": "string (use provided phone)",
        "email": "string (use provided email)",
        "hours": "string (typical business hours)"
      },
      "form": {
        "title": "string",
        "subtitle": "string"
      }
    },
    "blog": {
      "hero": {
        "title": "string (e.g., 'Health Insights & Tips')",
        "subtitle": "string (e.g., 'Stay informed with our latest articles')"
      },
      "posts": [
        {
          "id": "post-1",
          "title": "string (engaging article title)",
          "excerpt": "string (2-3 sentence summary)",
          "content": "string (3-4 detailed paragraphs with useful health information)",
          "category": "string (e.g., 'Health Tips', 'Wellness', 'Prevention')",
          "publishedAt": "2024-01-15"
        }
      ]
    }
  },
  "metadata": {
    "siteName": "string (business name)",
    "tagline": "string (short tagline)",
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
