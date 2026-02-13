import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Turkish profession/business keyword to English Pixabay search term mapping
const professionKeywordMapping: Record<string, string> = {
  // Psychology / Therapy
  "psikoloji": "psychology therapy counseling session calm",
  "psikolog": "psychology therapist counseling office",
  "psikolojik": "psychology mental health therapy",
  "terapi": "therapy counseling session professional",
  "danışmanlık": "counseling consultation professional office",
  // Law
  "hukuk": "law office lawyer legal justice books",
  "avukat": "lawyer law office legal professional",
  "avukatlık": "attorney law firm office professional",
  "hukuki": "legal services law books courtroom",
  // Food / Restaurant
  "kebap": "turkish kebab grilled meat restaurant dining",
  "kebab": "turkish kebab grilled meat restaurant",
  "restoran": "restaurant dining interior modern",
  "restaurant": "restaurant dining food interior",
  "cafe": "coffee cafe barista latte cozy",
  "kafe": "coffee cafe modern cozy interior",
  "kahve": "coffee cafe latte art barista",
  "pastane": "bakery pastry cake dessert shop",
  "fırın": "bakery bread artisan oven fresh",
  "yemek": "food dining restaurant cuisine",
  // Beauty / Health
  "güzellik": "beauty salon spa treatment skincare",
  "kuaför": "hairdresser salon hair styling modern",
  "berber": "barber shop haircut modern grooming",
  "spa": "spa wellness relaxation massage treatment",
  "cilt": "skincare dermatology beauty clinic",
  // Medical
  "diş": "dental clinic modern teeth whitening",
  "dişhekimi": "dentist dental chair modern clinic",
  "eczane": "pharmacy drugstore medicine modern",
  "doktor": "medical doctor clinic modern healthcare",
  "klinik": "medical clinic modern healthcare facility",
  "hastane": "hospital healthcare modern facility",
  "veteriner": "veterinary clinic animal care pet",
  "optik": "optician eyewear glasses modern store",
  "göz": "eye clinic ophthalmology vision care",
  "fizik tedavi": "physiotherapy rehabilitation exercise clinic",
  "fizyoterapi": "physiotherapy physical therapy clinic",
  // Construction / Architecture
  "inşaat": "construction building modern architecture",
  "mimarlık": "architecture design blueprint modern building",
  "mimar": "architect architecture modern design",
  "dekorasyon": "interior design decoration modern home",
  "tadilat": "renovation construction home improvement",
  // Finance / Accounting
  "muhasebe": "accounting finance office professional",
  "muhasebeci": "accountant finance calculator office",
  "mali müşavir": "financial advisor accounting professional",
  "sigorta": "insurance professional office consultation",
  // Education
  "eğitim": "education learning classroom modern",
  "okul": "school education modern classroom",
  "kurs": "training course education classroom",
  "dershane": "tutoring education study classroom",
  "kreş": "kindergarten nursery children colorful",
  // Technology
  "yazılım": "software development coding modern office",
  "teknoloji": "technology innovation digital modern",
  "bilişim": "information technology computing modern",
  "web": "web design development digital modern",
  // Creative
  "fotoğraf": "photography studio camera creative",
  "fotoğrafçı": "photographer studio portrait creative",
  "tasarım": "design creative studio modern workspace",
  "grafik": "graphic design creative studio workspace",
  "video": "video production studio filmmaking",
  "müzik": "music studio instrument recording",
  // Automotive
  "oto": "auto repair garage mechanic professional",
  "araba": "car automotive dealership showroom",
  "servis": "auto service repair garage workshop",
  "oto yıkama": "car wash auto detailing clean",
  // Retail
  "mağaza": "retail store modern interior shopping",
  "market": "supermarket grocery store modern",
  "butik": "boutique fashion clothing store",
  "kırtasiye": "stationery office supplies store",
  "mobilya": "furniture store modern showroom interior",
  "emlak": "real estate property modern building",
  // Other Services
  "nakliyat": "moving transportation logistics truck",
  "temizlik": "cleaning service professional commercial",
  "matbaa": "printing press commercial production",
  "çiçekçi": "florist flower shop colorful arrangement",
  "organizasyon": "event planning organization celebration",
  "düğün": "wedding planning ceremony celebration",
  "spor": "fitness gym sports training modern",
  "pilates": "pilates yoga fitness studio exercise",
  "yoga": "yoga meditation fitness studio calm",
};

// Try to find relevant English search terms from Turkish business name and services
function buildDynamicSearchTerms(
  businessName: string,
  services: string[],
  sector: string
): Record<string, string> | null {
  const allText = [businessName, ...services].join(" ").toLowerCase();
  
  // Find matching profession keywords
  const matchedTerms: string[] = [];
  for (const [keyword, englishTerm] of Object.entries(professionKeywordMapping)) {
    if (allText.includes(keyword.toLowerCase())) {
      matchedTerms.push(englishTerm);
    }
  }
  
  if (matchedTerms.length === 0) return null;
  
  // Use the first (most specific) match as primary term
  const primaryTerm = matchedTerms[0];
  const secondaryTerm = matchedTerms.length > 1 ? matchedTerms[1] : primaryTerm;
  
  return {
    heroSplit: primaryTerm,
    heroHome: primaryTerm,
    aboutImage: secondaryTerm + " team professional",
    ctaImage: primaryTerm + " success",
    heroAbout: secondaryTerm + " team",
    heroServices: primaryTerm,
    heroBlog: primaryTerm.split(" ").slice(0, 3).join(" ") + " insights",
    heroContact: primaryTerm.split(" ").slice(0, 2).join(" ") + " customer service",
  };
}

// Sector-based search terms for different image placements
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
  // Legacy profession mappings for backwards compatibility
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

// Blog post category to search terms mapping
const blogCategorySearchTerms: Record<string, string> = {
  health: "health wellness lifestyle",
  dental: "dental care teeth smile",
  medicine: "medicine pharmacy health",
  nutrition: "nutrition healthy food",
  wellness: "wellness fitness health",
  prevention: "preventive healthcare medical",
  skincare: "skincare dermatology health",
  pediatric: "pediatric children healthcare",
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
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodedQuery}&image_type=photo&orientation=horizontal&min_width=${minWidth}&per_page=10&safesearch=true`;

    console.log(`Fetching Pixabay image for: ${query}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Pixabay API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      // Pick a random image from results for variety
      const randomIndex = Math.floor(Math.random() * Math.min(10, data.hits.length));
      const imageUrl = data.hits[randomIndex].largeImageURL;
      console.log(`Found image: ${imageUrl.substring(0, 50)}...`);
      return imageUrl;
    }

    console.log(`No images found for query: ${query}`);
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

async function fetchBlogImage(
  category: string,
  apiKey: string
): Promise<string | null> {
  const categoryTerms = blogCategorySearchTerms[category.toLowerCase()] || blogCategorySearchTerms.default;
  
  let imageUrl = await fetchPixabayImage(categoryTerms, apiKey, 1200);
  
  if (!imageUrl) {
    imageUrl = await fetchPixabayImage("professional business modern", apiKey, 1200);
  }
  
  return imageUrl;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return new Response(JSON.stringify({ error: "Missing projectId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const PIXABAY_API_KEY = Deno.env.get("PIXABAY_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!PIXABAY_API_KEY) {
      console.error("PIXABAY_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Pixabay API not configured" }),
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

    // Use sector/profession from project
    const sector = project.profession || "other";
    const generatedContent = project.generated_content || {};
    const formData = project.form_data || {};
    
    // Priority 1: AI-generated imageSearchTerms from generated_content
    const aiSearchTerms = generatedContent.imageSearchTerms;
    
    // Priority 2: Dynamic terms from business name + services (Turkish keyword mapping)
    const businessName = formData.extractedData?.businessName || formData.businessInfo?.businessName || project.name || "";
    const services = formData.extractedData?.services || formData.professionalDetails?.services || [];
    const dynamicTerms = buildDynamicSearchTerms(businessName, services, sector);
    
    // Build final search terms with priority: AI terms > dynamic mapping > static sector
    const staticTerms = sectorSearchTerms[sector] || sectorSearchTerms.other;
    const searchTerms: Record<string, string> = { ...staticTerms };
    
    // Apply dynamic profession-based terms (override static)
    if (dynamicTerms) {
      console.log(`Dynamic profession mapping found for: ${businessName}`);
      Object.assign(searchTerms, dynamicTerms);
    }
    
    // Apply AI-generated terms (highest priority override)
    if (aiSearchTerms) {
      console.log(`Using AI-generated imageSearchTerms`);
      if (aiSearchTerms.hero) {
        searchTerms.heroHome = aiSearchTerms.hero;
        searchTerms.heroSplit = aiSearchTerms.hero;
      }
      if (aiSearchTerms.about) {
        searchTerms.aboutImage = aiSearchTerms.about;
        searchTerms.heroAbout = aiSearchTerms.about;
      }
      if (aiSearchTerms.services) {
        searchTerms.heroServices = aiSearchTerms.services;
      }
      if (aiSearchTerms.cta) {
        searchTerms.ctaImage = aiSearchTerms.cta;
      }
    }
    
    // Gallery terms: AI > static
    const staticGalleryTerms = gallerySearchTerms[sector] || gallerySearchTerms.other;
    const galleryTerms = (aiSearchTerms?.gallery && aiSearchTerms.gallery.length >= 3)
      ? aiSearchTerms.gallery.slice(0, 6)
      : staticGalleryTerms;

    console.log(`Fetching Pixabay images for sector: ${sector}, business: ${businessName}`);

    // Fetch ALL images in parallel for speed
    const images: Record<string, string | string[]> = {};
    
    // Hero and main images
    const heroImagePromises = Object.entries(searchTerms).map(async ([key, query]) => {
      const imageUrl = await fetchPixabayImage(query, PIXABAY_API_KEY, 1920);
      return { key, imageUrl };
    });

    // Gallery images (parallel)
    const galleryPromise = fetchMultipleImagesParallel(galleryTerms, PIXABAY_API_KEY, 1200);

    // Wait for all in parallel
    const [heroResults, galleryImages] = await Promise.all([
      Promise.all(heroImagePromises),
      galleryPromise,
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

    console.log(`Fetched ${heroResults.filter(r => r.imageUrl).length} hero images and ${galleryImages.length} gallery images`);

    // Fetch blog post images in parallel
    const blogPosts = generatedContent.pages?.blog?.posts || [];
    const blogImagePromises = blogPosts.map(async (post: { category?: string }) => {
      return fetchBlogImage(post.category || "default", PIXABAY_API_KEY);
    });

    const blogImageResults = await Promise.all(blogImagePromises);
    const updatedBlogPosts = blogPosts.map((post: object, index: number) => ({
      ...post,
      featuredImage: blogImageResults[index] || undefined,
    }));

    console.log(`Fetched images for ${updatedBlogPosts.length} blog posts`);

    // Update the generated_content with images
    const updatedContent = {
      ...generatedContent,
      images,
      pages: {
        ...generatedContent.pages,
        blog: generatedContent.pages?.blog
          ? {
              ...generatedContent.pages.blog,
              posts: updatedBlogPosts,
            }
          : undefined,
      },
    };

    // Save updated content
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        generated_content: updatedContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to save images" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Pixabay images fetched and saved successfully");
    return new Response(
      JSON.stringify({
        success: true,
        images,
        blogPostsUpdated: updatedBlogPosts.length,
        galleryImagesCount: galleryImages.length,
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
