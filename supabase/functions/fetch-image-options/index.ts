import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface FetchImageRequest {
  projectId: string;
  imageType: 'hero' | 'about' | 'gallery' | 'cta' | 'service';
  count?: number;
}

interface PixabayImage {
  url: string;
  thumbnail: string;
  alt: string;
  width: number;
  height: number;
}

// Image type to search query mapping
function getSearchQuery(imageType: string, profession: string): string {
  // Comprehensive sector-based keywords
  const professionKeywords: Record<string, string> = {
    // New sector-based keywords
    food: 'restaurant cafe food dining culinary kitchen chef',
    retail: 'store shop retail shopping products display fashion',
    service: 'professional business consulting office corporate',
    creative: 'design studio creative art portfolio workspace',
    technology: 'tech startup software coding office modern',
    other: 'professional business modern office workspace',
    
    // Legacy healthcare professions
    pharmacist: 'pharmacy medicine healthcare drugstore',
    doctor: 'medical doctor clinic healthcare hospital',
    dentist: 'dental dentist teeth clinic orthodontics',
    
    // Additional professions
    lawyer: 'lawyer legal office professional law firm',
    accountant: 'accounting finance office business corporate',
    architect: 'architecture building design modern blueprint',
    therapist: 'therapy wellness mental health calm peaceful',
    veterinarian: 'veterinary pets animal clinic care',
    chiropractor: 'chiropractic spine health wellness clinic',
    optometrist: 'eye care optometry vision glasses clinic',
    restaurant: 'restaurant food dining culinary chef kitchen',
    salon: 'salon beauty hair styling fashion',
    gym: 'fitness gym workout health exercise',
    spa: 'spa wellness relaxation massage peaceful',
    bakery: 'bakery pastry bread cafe dessert',
    boutique: 'boutique fashion clothing store stylish',
  };

  const baseQuery = professionKeywords[profession.toLowerCase()] || `${profession} professional business modern`;

  const typeQueries: Record<string, string> = {
    hero: `${baseQuery} modern professional high quality`,
    about: `${baseQuery} team people working together`,
    gallery: `${baseQuery} interior facility workspace`,
    cta: `${baseQuery} success happy customer satisfaction`,
    service: `${baseQuery} service work professional`,
  };

  return typeQueries[imageType] || baseQuery;
}

async function fetchFromPixabay(query: string, count: number): Promise<PixabayImage[]> {
  const PIXABAY_API_KEY = Deno.env.get('PIXABAY_API_KEY');
  if (!PIXABAY_API_KEY) {
    throw new Error('PIXABAY_API_KEY is not configured');
  }

  const encodedQuery = encodeURIComponent(query);
  const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodedQuery}&image_type=photo&orientation=horizontal&per_page=${count * 2}&min_width=800&safesearch=true&order=popular`;

  console.log(`Fetching images from Pixabay: ${query}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Pixabay API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.hits || data.hits.length === 0) {
    console.log('No images found, trying fallback query');
    // Fallback to more generic search
    const fallbackUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=professional+business+modern&image_type=photo&orientation=horizontal&per_page=${count}&min_width=800&safesearch=true`;
    const fallbackResponse = await fetch(fallbackUrl);
    const fallbackData = await fallbackResponse.json();
    data.hits = fallbackData.hits || [];
  }

  // Shuffle and take requested count
  const shuffled = data.hits.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return selected.map((hit: any) => ({
    url: hit.largeImageURL || hit.webformatURL,
    thumbnail: hit.previewURL || hit.webformatURL,
    alt: hit.tags || 'Professional image',
    width: hit.imageWidth,
    height: hit.imageHeight,
  }));
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization and verify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { projectId, imageType, count = 3 } = await req.json() as FetchImageRequest;

    if (!projectId || !imageType) {
      throw new Error('Missing required fields: projectId and imageType');
    }

    console.log(`Fetching ${count} image options for type: ${imageType} in project: ${projectId}`);

    // Fetch project and verify ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id, profession')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      throw new Error('Project not found');
    }

    if (project.user_id !== user.id) {
      throw new Error('Unauthorized: You do not own this project');
    }

    // Get search query based on profession and image type
    const searchQuery = getSearchQuery(imageType, project.profession);
    
    // Fetch images from Pixabay
    const images = await fetchFromPixabay(searchQuery, count);

    console.log(`Found ${images.length} images for ${imageType}`);

    return new Response(
      JSON.stringify({
        success: true,
        imageType,
        options: images,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in fetch-image-options:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        options: [],
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
