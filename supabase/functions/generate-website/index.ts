import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Extracted business data from AI chat - rich context for content generation
interface ExtractedBusinessData {
  businessName?: string;
  sector?: string;
  city?: string;
  country?: string;
  services?: string[];
  targetAudience?: string;
  uniqueValue?: string;
  story?: string;
  siteGoals?: string;
  workingHours?: string;
  yearsExperience?: string;
  phone?: string;
  email?: string;
  address?: string;
  vision?: string;
  achievements?: string;
  mainCTA?: string;
  additionalInfo?: string;
}

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
  // Rich extracted data from AI chatbot conversation
  extractedData?: ExtractedBusinessData;
}

// Template selection logic - automatically picks the best template
function selectTemplate(_profession: string, _tone?: string): string {
  // All sectors use temp1 for now
  return 'temp1';
}

// Sector-specific content instructions
function getSectorSpecificInstructions(sector: string, profession: string, details: FormData['professionalDetails']): string {
  // Legacy healthcare professions
  if (profession === 'doctor') {
    return `
PROFESSION-SPECIFIC REQUIREMENTS FOR DOCTOR:
- Specialty: ${details?.specialty || 'General Practice'}
- Experience: ${details?.yearsExperience || '5+'} years
- Include detailed medical credentials and qualifications
- Add patient care philosophy section
- Describe consultation process step by step
- Include health statistics relevant to the specialty
- Use medical terminology appropriately but explain in patient-friendly language
- Generate statistics: Years of Experience, Patients Treated, Specializations, Success Rate`;
  }
  
  if (profession === 'dentist') {
    return `
PROFESSION-SPECIFIC REQUIREMENTS FOR DENTIST:
- Services: ${details?.services?.join(', ') || 'General Dentistry'}
- Describe dental procedures in patient-friendly, non-scary language
- Include smile transformation concepts and cosmetic dentistry benefits
- Emphasize pain-free and comfortable treatment approaches
- Generate statistics: Years of Experience, Smiles Transformed, Dental Procedures, Patient Satisfaction`;
  }
  
  if (profession === 'pharmacist') {
    return `
PROFESSION-SPECIFIC REQUIREMENTS FOR PHARMACIST:
- Pharmacy Type: ${details?.pharmacyType || 'Community Pharmacy'}
- List detailed pharmacy service categories
- Include health consultation and medication counseling services
- Generate statistics: Years Serving Community, Medications Dispensed, Health Consultations, Customer Satisfaction`;
  }

  // New sector-based instructions
  const sectorInstructions: Record<string, string> = {
    service: `
SECTOR REQUIREMENTS - SERVICE/PROFESSIONAL:
- Focus on expertise, credentials, and professional experience
- Highlight client success stories and case studies
- Describe your process/methodology clearly
- Use professional, trust-building language
- Generate statistics: Years of Experience, Clients Served, Projects Completed, Client Satisfaction Rate`,
    
    retail: `
SECTOR REQUIREMENTS - RETAIL/E-COMMERCE:
- Showcase product categories and offerings
- Highlight quality, sourcing, and unique selling points
- Describe shopping experience and customer service
- Use engaging, customer-friendly language
- Generate statistics: Years in Business, Products Available, Happy Customers, Orders Fulfilled`,
    
    food: `
SECTOR REQUIREMENTS - FOOD/RESTAURANT:
- Describe cuisine style, specialties, and signature dishes
- Highlight atmosphere, ambiance, and dining experience
- Include menu categories and dietary options
- Use appetizing, sensory-rich language
- Generate statistics: Years Serving, Dishes Served, Menu Items, Customer Reviews`,
    
    creative: `
SECTOR REQUIREMENTS - CREATIVE/DESIGN:
- Showcase portfolio and creative process
- Highlight unique style and artistic vision
- Describe collaboration approach with clients
- Use creative, inspiring language
- Generate statistics: Years of Experience, Projects Completed, Awards Won, Clients Served`,
    
    technology: `
SECTOR REQUIREMENTS - TECHNOLOGY/SOFTWARE:
- Highlight technical expertise and innovation
- Describe solutions and their benefits
- Include technology stack and capabilities
- Use modern, technical but accessible language
- Generate statistics: Years in Tech, Projects Delivered, Technologies Used, Client Success Rate`,
    
    other: `
SECTOR REQUIREMENTS - GENERAL BUSINESS:
- Focus on unique value proposition
- Highlight experience and expertise
- Describe your approach and what sets you apart
- Use professional, approachable language
- Generate statistics: Years in Business, Clients Served, Projects Completed, Satisfaction Rate`
  };

  return sectorInstructions[sector] || sectorInstructions.other;
}

function buildPrompt(profession: string, formData: FormData, sector?: string, extractedData?: ExtractedBusinessData): string {
  const businessInfo = formData.businessInfo;
  const details = formData.professionalDetails;
  const prefs = formData.websitePreferences;

  // Determine effective sector - legacy professions map to service sector
  const effectiveSector = sector || (
    ['doctor', 'dentist', 'pharmacist'].includes(profession) ? 'service' : 'other'
  );

  const sectorInstructions = getSectorSpecificInstructions(effectiveSector, profession, details);

  // Dynamic blog topics based on sector - use extracted services if available
  const blogTopicsMap: Record<string, string> = {
    service: "industry insights, professional tips, client success stories, best practices, expert advice",
    retail: "product guides, shopping tips, new arrivals, style guides, seasonal recommendations",
    food: "recipes, food tips, ingredient guides, culinary trends, restaurant updates",
    creative: "design trends, creative process insights, portfolio highlights, inspiration, industry news",
    technology: "tech trends, development tips, product updates, innovation insights, tutorials",
    other: "business insights, industry tips, company updates, expert advice, helpful guides"
  };

  // Legacy healthcare blog topics
  const legacyBlogTopics: Record<string, string> = {
    doctor: "health tips, preventive care advice, common medical conditions explained, wellness guidance",
    dentist: "oral hygiene tips, dental procedures explained, smile care advice, dental health for families",
    pharmacist: "medication guides, health supplements information, wellness tips, pharmacy services explained"
  };

  // Use extracted services for blog topics if available
  const extractedServices = extractedData?.services?.join(', ');
  const blogTopics = extractedServices 
    ? `${extractedServices}, industry insights, helpful tips related to ${effectiveSector}`
    : (legacyBlogTopics[profession] || blogTopicsMap[effectiveSector] || blogTopicsMap.other);

  // Build detailed business context section from extracted data
  const businessContextSection = extractedData ? `
DETAILED BUSINESS CONTEXT (use this information to make content highly specific and authentic):
- Services/Products Offered: ${extractedData.services?.join(', ') || 'Not specified'}
- Target Audience: ${extractedData.targetAudience || 'General audience'}
- Business Story: ${extractedData.story || 'A dedicated business serving customers.'}
- Vision: ${extractedData.vision || 'To provide excellent service'}
- Unique Value Proposition: ${extractedData.uniqueValue || 'Quality and reliability'}
- Website Goals: ${extractedData.siteGoals || 'Inform and connect with customers'}
- Main Call-to-Action: ${extractedData.mainCTA || 'Contact us'}
- Working Hours: ${extractedData.workingHours || 'Standard business hours'}
- Years of Experience: ${extractedData.yearsExperience || 'Established business'}
- Achievements/Highlights: ${extractedData.achievements || 'Trusted by many customers'}
- Additional Info: ${extractedData.additionalInfo || ''}

CRITICAL INSTRUCTION: Use the above SPECIFIC business context to generate AUTHENTIC content that reflects THIS EXACT business. 
DO NOT use generic sector content. Every piece of text should be tailored to this specific business's story, services, and target audience.
` : '';

  // Determine language with proper Turkish default
  const selectedLanguage = (extractedData as any)?.languages?.[0] || prefs?.language || "Turkish";
  const isTurkish = selectedLanguage.toLowerCase().includes("turk") || selectedLanguage.toLowerCase().includes("türk");
  const languageInstruction = isTurkish 
    ? "Türkçe - Tüm içerik MUTLAKA Türkçe olmalı. Hiçbir İngilizce kelime veya ifade KULLANMA. Başlıklar, açıklamalar, blog yazıları, hepsi %100 Türkçe olmalı."
    : `${selectedLanguage} - ALL content MUST be in ${selectedLanguage}. Do NOT use any other language.`;
  const languageForContent = isTurkish ? "Türkçe (Turkish)" : selectedLanguage;

  return `You are a professional website content writer.

Generate comprehensive, detailed, and authentic website content for a business website.

BUSINESS INFORMATION:
- Business Name: ${extractedData?.businessName || businessInfo?.businessName || "Business Name"}
- Business Type/Sector: ${effectiveSector}
- Location: ${extractedData?.city || businessInfo?.city || "City"}, ${extractedData?.country || businessInfo?.country || "Country"}
- Contact Phone: ${extractedData?.phone || businessInfo?.phone || ""}
- Contact Email: ${extractedData?.email || businessInfo?.email || ""}
- Address: ${extractedData?.address || ""}
${businessContextSection}
${sectorInstructions}

WEBSITE PREFERENCES:
- Language: ${languageInstruction}
- Tone: ${prefs?.tone || "professional"} - use this tone consistently throughout
- This is INFORMATIONAL only - NO prices, NO e-commerce, NO booking systems

CONTENT REQUIREMENTS:
1. ALL content must be in ${languageForContent} - THIS IS CRITICAL
2. Use ${prefs?.tone || "professional"} tone throughout
3. NO pricing information anywhere
4. Focus on building trust and providing valuable information
5. Make content HIGHLY SPECIFIC to this exact business - use the business story, services, and target audience provided
6. Include compelling statistics section with 4 key metrics based on the business context
7. Generate 3-5 detailed blog posts about ${blogTopics}
8. Each blog post should have 4-5 paragraphs of genuinely helpful content
9. Include FAQ section with 4-5 common questions and detailed answers
10. Make highlights section have 4-6 items with detailed descriptions
11. Services should have 5-8 detailed service descriptions
12. Add a process/workflow section describing how clients/customers interact

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
        { "title": "string", "description": "string (2-3 detailed sentences)", "imageSearchTerm": "string (2-3 specific English keywords for Pixabay image search relevant to this highlight, e.g. 'quality coffee beans roasting')" }
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
        { "title": "string", "description": "string (3-4 sentences describing the service)", "imageSearchTerm": "string (2-3 specific English keywords for Pixabay image search relevant to this service, e.g. 'espresso machine coffee')" }
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
  "imageSearchTerms": {
    "hero": "string (3-5 specific English keywords for Pixabay search for the hero/banner image, e.g. 'turkish restaurant interior dining ambiance')",
    "about": "string (3-5 English keywords for the about/team section image)",
    "services": "string (3-5 English keywords for services section image)",
    "gallery": ["string (each item is 2-4 English keywords for a gallery photo, provide 6 items)", "..."],
    "cta": "string (3-5 English keywords for call-to-action background image)",
    "blog": "string (3-5 English keywords for default blog post featured image)"
  },
  "metadata": {
    "siteName": "string",
    "tagline": "string (memorable tagline)",
    "seoDescription": "string (meta description for SEO, 150-160 characters)"
  }
}

IMPORTANT for imageSearchTerms:
- All search terms MUST be in English (Pixabay works best with English)
- Make them VERY SPECIFIC to this exact business type and industry
- For a Turkish restaurant: use "turkish kebab restaurant dining warm" NOT just "restaurant"
- For a dental clinic: use "modern dental clinic chair equipment" NOT just "dentist"
- For gallery: provide 6 different specific terms showing variety (e.g. interior, food, chef, ambiance, exterior, details)
- Think about what real photos would look like for THIS specific business`;
}

// Sector-based search terms for Pixabay images
const sectorSearchTerms: Record<string, Record<string, string>> = {
  service: {
    heroSplit: "professional business consulting office",
    aboutImage: "business team meeting collaboration",
    ctaImage: "success handshake professional",
    heroHome: "professional office business meeting",
    heroAbout: "business team collaboration",
    heroServices: "consulting professional services",
    heroBlog: "business insights professional",
    heroContact: "business customer service",
  },
  retail: {
    heroSplit: "modern retail store interior shopping",
    aboutImage: "retail team customer service friendly",
    ctaImage: "happy customer shopping bags",
    heroHome: "modern store interior shopping",
    heroAbout: "retail team customer service",
    heroServices: "retail products display",
    heroBlog: "shopping retail trends",
    heroContact: "retail customer support",
  },
  food: {
    heroSplit: "restaurant interior modern dining ambiance",
    aboutImage: "chef cooking kitchen professional",
    ctaImage: "delicious food presentation restaurant",
    heroHome: "restaurant interior modern dining",
    heroAbout: "chef cooking kitchen",
    heroServices: "food presentation gourmet",
    heroBlog: "food culinary cooking",
    heroContact: "restaurant dining experience",
  },
  creative: {
    heroSplit: "creative design studio workspace modern",
    aboutImage: "designer artist team working creative",
    ctaImage: "creative project success celebration",
    heroHome: "creative design studio workspace",
    heroAbout: "designer artist team working",
    heroServices: "creative portfolio design",
    heroBlog: "design trends creative",
    heroContact: "creative agency collaboration",
  },
  technology: {
    heroSplit: "modern tech office startup workspace",
    aboutImage: "software developer team coding",
    ctaImage: "technology innovation success",
    heroHome: "modern tech office startup",
    heroAbout: "software developer team",
    heroServices: "technology software development",
    heroBlog: "technology innovation digital",
    heroContact: "tech support customer",
  },
  other: {
    heroSplit: "professional modern business office",
    aboutImage: "team collaboration workspace meeting",
    ctaImage: "business success professional",
    heroHome: "professional business modern",
    heroAbout: "team collaboration workspace",
    heroServices: "professional services business",
    heroBlog: "business insights professional",
    heroContact: "business customer support",
  },
  // Legacy profession mappings
  doctor: {
    heroSplit: "medical clinic reception modern healthcare",
    aboutImage: "medical team doctor nurse professional",
    ctaImage: "healthcare medical professional clinic",
    heroHome: "medical clinic reception modern healthcare",
    heroAbout: "doctor team professional hospital",
    heroServices: "medical equipment modern clinic",
    heroBlog: "healthcare medical research",
    heroContact: "medical consultation doctor patient",
  },
  dentist: {
    heroSplit: "dental clinic modern reception",
    aboutImage: "dental team professional dentist",
    ctaImage: "dental smile healthy teeth",
    heroHome: "dental clinic modern reception",
    heroAbout: "dentist team professional clinic",
    heroServices: "dental equipment modern technology",
    heroBlog: "dental care oral hygiene",
    heroContact: "dental consultation patient",
  },
  pharmacist: {
    heroSplit: "pharmacy modern drugstore interior",
    aboutImage: "pharmacy team professional",
    ctaImage: "pharmacy medicine healthcare",
    heroHome: "pharmacy modern drugstore interior",
    heroAbout: "pharmacist professional team",
    heroServices: "pharmacy medications medicine",
    heroBlog: "medicine health supplements",
    heroContact: "pharmacy consultation customer",
  },
};

// Gallery search terms by sector (6 images each)
const gallerySearchTerms: Record<string, string[]> = {
  service: [
    "business consulting meeting",
    "professional office workspace",
    "team collaboration success",
    "client presentation meeting",
    "modern office interior",
    "business handshake deal",
  ],
  retail: [
    "store interior modern display",
    "shopping customer experience",
    "retail products showcase",
    "store checkout friendly",
    "product display creative",
    "shopping bags happy customer",
  ],
  food: [
    "restaurant interior ambiance",
    "chef preparing food kitchen",
    "food presentation plate",
    "cafe coffee atmosphere",
    "dining experience restaurant",
    "fresh ingredients cooking",
  ],
  creative: [
    "design studio workspace",
    "creative team brainstorming",
    "art gallery exhibition",
    "photography studio setup",
    "creative project mockup",
    "design tools workspace",
  ],
  technology: [
    "tech startup office modern",
    "coding programming developer",
    "server room technology",
    "tech team collaboration",
    "digital innovation workspace",
    "modern computer setup",
  ],
  other: [
    "professional office modern",
    "business meeting room",
    "team success celebration",
    "workspace productivity",
    "corporate building exterior",
    "professional handshake",
  ],
  // Legacy
  doctor: [
    "modern medical clinic interior",
    "hospital waiting room modern",
    "medical examination room",
    "doctor patient consultation",
    "medical technology equipment",
    "healthcare facility modern",
  ],
  dentist: [
    "dental clinic interior modern",
    "dental chair equipment",
    "dental office waiting room",
    "dental treatment room",
    "dental technology equipment",
    "dental clinic reception",
  ],
  pharmacist: [
    "pharmacy interior modern",
    "pharmacy shelves medicine",
    "pharmacy consultation area",
    "pharmacy counter service",
    "pharmacy products display",
    "pharmacy healthcare products",
  ],
};

const blogCategorySearchTerms: Record<string, string> = {
  health: "health wellness lifestyle",
  dental: "dental care teeth smile",
  medicine: "medicine pharmacy health",
  nutrition: "nutrition healthy food",
  wellness: "wellness fitness health",
  prevention: "preventive healthcare medical",
  business: "business professional insights",
  technology: "technology digital innovation",
  design: "design creative portfolio",
  food: "food culinary restaurant",
  retail: "retail shopping products",
  default: "professional business modern",
};

async function fetchPixabayImage(
  query: string,
  apiKey: string,
  minWidth: number = 1200
): Promise<string | null> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodedQuery}&image_type=photo&orientation=horizontal&min_width=${minWidth}&per_page=5&safesearch=true`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Pixabay API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(5, data.hits.length));
      return data.hits[randomIndex].largeImageURL;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching Pixabay image:`, error);
    return null;
  }
}

async function fetchMultipleImagesParallel(
  queries: string[],
  apiKey: string,
  minWidth: number = 1200
): Promise<string[]> {
  const promises = queries.map(query => fetchPixabayImage(query, apiKey, minWidth));
  const results = await Promise.all(promises);
  return results.filter((url): url is string => url !== null);
}

async function fetchAllImages(
  sector: string,
  blogPosts: Array<{ title: string; category?: string }>,
  apiKey: string,
  aiSearchTerms?: { hero?: string; about?: string; services?: string; gallery?: string[]; cta?: string; blog?: string }
): Promise<{ images: Record<string, string | string[]>; updatedPosts: Array<{ featuredImage?: string }> }> {
  const staticTerms = sectorSearchTerms[sector] || sectorSearchTerms.other;
  const staticGallery = gallerySearchTerms[sector] || gallerySearchTerms.other;
  const images: Record<string, string | string[]> = {};

  // Build dynamic search terms: AI-generated terms override static defaults
  const dynamicTerms: Record<string, string> = { ...staticTerms };
  if (aiSearchTerms?.hero) {
    dynamicTerms.heroHome = aiSearchTerms.hero;
    dynamicTerms.heroSplit = aiSearchTerms.hero;
  }
  if (aiSearchTerms?.about) {
    dynamicTerms.aboutImage = aiSearchTerms.about;
    dynamicTerms.heroAbout = aiSearchTerms.about;
  }
  if (aiSearchTerms?.services) {
    dynamicTerms.heroServices = aiSearchTerms.services;
  }
  if (aiSearchTerms?.cta) {
    dynamicTerms.ctaImage = aiSearchTerms.cta;
  }

  // Use AI gallery terms or fallback to static
  const galleryTerms = (aiSearchTerms?.gallery && aiSearchTerms.gallery.length >= 3)
    ? aiSearchTerms.gallery.slice(0, 6)
    : staticGallery;

  // Fetch hero/section images in parallel
  const heroPromises = Object.entries(dynamicTerms).map(async ([key, query]) => {
    let imageUrl = await fetchPixabayImage(query, apiKey, 1920);
    // Fallback: if AI term returns nothing, try the static term
    if (!imageUrl && staticTerms[key] && query !== staticTerms[key]) {
      console.log(`AI term failed for ${key}, falling back to static: ${staticTerms[key]}`);
      imageUrl = await fetchPixabayImage(staticTerms[key], apiKey, 1920);
    }
    return { key, imageUrl };
  });

  // Fetch gallery images in parallel
  const galleryPromise = fetchMultipleImagesParallel(galleryTerms, apiKey, 1200);

  // Blog: use AI blog term or category-based fallback
  const defaultBlogTerm = aiSearchTerms?.blog || '';
  const blogPromises = blogPosts.map(async (post) => {
    const categoryTerms = blogCategorySearchTerms[(post.category || "default").toLowerCase()] || defaultBlogTerm || blogCategorySearchTerms.default;
    const featuredImage = await fetchPixabayImage(categoryTerms, apiKey, 1200);
    return { ...post, featuredImage: featuredImage || undefined };
  });

  // Wait for ALL images in parallel
  const [heroResults, galleryImages, updatedPosts] = await Promise.all([
    Promise.all(heroPromises),
    galleryPromise,
    Promise.all(blogPromises),
  ]);

  // Process hero results
  heroResults.forEach(({ key, imageUrl }) => {
    if (imageUrl) {
      images[key] = imageUrl;
    }
  });

  // Add gallery images
  if (galleryImages.length > 0) {
    images.galleryImages = galleryImages;
  }

  console.log(`Fetched ${heroResults.filter(r => r.imageUrl).length} hero images, ${galleryImages.length} gallery images, ${updatedPosts.length} blog images`);
  console.log(`Used AI search terms: ${aiSearchTerms ? 'yes' : 'no (static fallback)'}`);

  return { images, updatedPosts };
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
    const PIXABAY_API_KEY = Deno.env.get("PIXABAY_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
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

    // ============ USER AUTHENTICATION & OWNERSHIP CHECK ============
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create auth client with user's token
    const authClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify JWT and get claims
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("JWT verification failed:", claimsError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    // Create service role client for database operations
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

    // ============ OWNERSHIP VERIFICATION ============
    if (project.user_id !== userId) {
      console.error("Ownership check failed: user", userId, "tried to access project owned by", project.user_id);
      return new Response(JSON.stringify({ error: "Forbidden: You don't own this project" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log("Ownership verified for project:", projectId);

    const formData = project.form_data as FormData;
    const profession = project.profession;
    
    // Extract sector from form_data - check multiple possible locations
    // Wizard saves to extractedData.sector, but also check direct sector field as fallback
    const extractedSector = 
      (formData as any)?.extractedData?.sector || 
      (formData as any)?.sector || 
      profession;

    console.log("Form data extractedData:", JSON.stringify((formData as any)?.extractedData));
    console.log("Detected sector:", extractedSector);
    console.log("Generating enhanced content for:", profession, "sector:", extractedSector);

    // Call Lovable AI Gateway for text content
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
              content: buildPrompt(profession, formData, extractedSector, (formData as any)?.extractedData),
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

    // Extract AI-generated image search terms (if present)
    const aiSearchTerms = generatedContent.imageSearchTerms || null;
    if (aiSearchTerms) {
      console.log("AI generated image search terms:", JSON.stringify(aiSearchTerms));
      // Remove imageSearchTerms from final content (not needed in DB)
      delete generatedContent.imageSearchTerms;
    }

    // Fetch per-service and per-highlight images from Pixabay
    if (PIXABAY_API_KEY) {
      const servicesList = generatedContent.pages?.services?.servicesList || [];
      const highlights = generatedContent.pages?.home?.highlights || [];

      const serviceImagePromises = servicesList.map(async (svc: any) => {
        if (svc.imageSearchTerm) {
          const img = await fetchPixabayImage(svc.imageSearchTerm, PIXABAY_API_KEY, 640);
          svc.image = img || '';
        }
        delete svc.imageSearchTerm;
        // Remove old icon field if present
        delete svc.icon;
      });

      const highlightImagePromises = highlights.map(async (h: any) => {
        if (h.imageSearchTerm) {
          const img = await fetchPixabayImage(h.imageSearchTerm, PIXABAY_API_KEY, 640);
          h.image = img || '';
        }
        delete h.imageSearchTerm;
        delete h.icon;
      });

      await Promise.all([...serviceImagePromises, ...highlightImagePromises]);
      console.log(`Fetched ${servicesList.length} service images and ${highlights.length} highlight images`);
    }

    // Fetch images from Pixabay (if API key is configured)
    if (PIXABAY_API_KEY) {
      console.log("Fetching images from Pixabay with", aiSearchTerms ? "AI-generated" : "static", "search terms...");
      const blogPosts = generatedContent.pages?.blog?.posts || [];
      // Use sector for image search if available, otherwise fallback to profession
      const imageSearchKey = extractedSector || profession;
      const { images, updatedPosts } = await fetchAllImages(
        imageSearchKey,
        blogPosts,
        PIXABAY_API_KEY,
        aiSearchTerms
      );

      // Add images to generated content
      generatedContent.images = images;
      if (generatedContent.pages?.blog) {
        generatedContent.pages.blog.posts = updatedPosts;
      }
      console.log(`Fetched ${Object.keys(images).length} hero images and ${updatedPosts.length} blog images`);
    } else {
      console.log("Pixabay API key not configured, skipping image fetching");
    }

    // Select template automatically based on profession and tone
    const templateId = selectTemplate(
      profession,
      formData.websitePreferences?.tone
    );
    console.log("Selected template:", templateId);

    // Update project with generated content, template_id, and status
    console.log("Saving generated content");
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        generated_content: generatedContent,
        template_id: templateId,
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

    console.log("Content generated successfully with Pixabay images");
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
