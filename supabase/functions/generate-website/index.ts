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

  return `You are a professional website content writer specializing in healthcare websites.

Generate website content for a ${profession}'s informational website with the following details:

Business Name: ${businessInfo?.businessName || "Healthcare Practice"}
Location: ${businessInfo?.city || "City"}, ${businessInfo?.country || "Country"}
Contact Phone: ${businessInfo?.phone || ""}
Contact Email: ${businessInfo?.email || ""}
${professionDetails}

Website Preferences:
- Language: ${prefs?.language || "English"}
- Tone: ${prefs?.tone || "professional"} (use this tone throughout)
- This is an INFORMATIONAL website only - NO prices, NO e-commerce, NO booking systems

Generate content for exactly 4 pages in JSON format. Each page should have compelling, professional content appropriate for a healthcare ${profession}.

IMPORTANT RULES:
1. All content must be in ${prefs?.language || "English"}
2. Use a ${prefs?.tone || "professional"} tone throughout
3. No pricing information
4. No "book now" or appointment booking CTAs
5. Focus on building trust and providing information
6. Include relevant sections for each page
7. Make content specific to the ${profession} profession

Return ONLY valid JSON in this exact format:
{
  "pages": {
    "home": {
      "hero": {
        "title": "string",
        "subtitle": "string",
        "description": "string"
      },
      "welcome": {
        "title": "string",
        "content": "string"
      },
      "highlights": [
        { "title": "string", "description": "string", "icon": "string" }
      ]
    },
    "about": {
      "hero": {
        "title": "string",
        "subtitle": "string"
      },
      "story": {
        "title": "string",
        "content": "string"
      },
      "values": [
        { "title": "string", "description": "string" }
      ],
      "team": {
        "title": "string",
        "description": "string"
      }
    },
    "services": {
      "hero": {
        "title": "string",
        "subtitle": "string"
      },
      "intro": {
        "title": "string",
        "content": "string"
      },
      "servicesList": [
        { "title": "string", "description": "string", "icon": "string" }
      ]
    },
    "contact": {
      "hero": {
        "title": "string",
        "subtitle": "string"
      },
      "info": {
        "address": "string",
        "phone": "string",
        "email": "string",
        "hours": "string"
      },
      "form": {
        "title": "string",
        "subtitle": "string"
      }
    }
  },
  "metadata": {
    "siteName": "string",
    "tagline": "string"
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

    console.log("Generating content for:", profession);

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
