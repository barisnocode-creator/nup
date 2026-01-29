import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Reserved subdomains that cannot be used
const RESERVED_SUBDOMAINS = [
  'admin', 'api', 'www', 'mail', 'ftp', 'smtp', 'pop', 'imap',
  'dashboard', 'app', 'help', 'support', 'blog', 'docs', 'status',
  'cdn', 'static', 'assets', 'images', 'files', 'media', 'upload',
  'auth', 'login', 'signup', 'register', 'account', 'user', 'users',
  'test', 'dev', 'staging', 'production', 'demo', 'preview',
  'openlucius', 'lucius', 'health', 'doctor', 'dentist', 'pharmacy',
];

// Validate subdomain format
function isValidSubdomain(subdomain: string): { valid: boolean; reason?: string } {
  if (subdomain.length < 3) {
    return { valid: false, reason: 'Subdomain must be at least 3 characters' };
  }
  
  if (subdomain.length > 50) {
    return { valid: false, reason: 'Subdomain must be less than 50 characters' };
  }
  
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain) && subdomain.length > 2) {
    return { valid: false, reason: 'Only lowercase letters, numbers, and dashes allowed' };
  }
  
  if (/^-|-$/.test(subdomain)) {
    return { valid: false, reason: 'Cannot start or end with a dash' };
  }
  
  if (/--/.test(subdomain)) {
    return { valid: false, reason: 'Cannot have consecutive dashes' };
  }
  
  if (RESERVED_SUBDOMAINS.includes(subdomain)) {
    return { valid: false, reason: 'This subdomain is reserved' };
  }
  
  return { valid: true };
}

// Generate a suggestion by appending a number
function generateSuggestion(base: string): string {
  const random = Math.floor(Math.random() * 900) + 100; // 100-999
  return `${base}-${random}`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { subdomain, projectId } = await req.json();

    if (!subdomain || typeof subdomain !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Subdomain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedSubdomain = subdomain.toLowerCase().trim();

    // Validate format
    const validation = isValidSubdomain(normalizedSubdomain);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ 
          available: false, 
          reason: validation.reason,
          suggestion: generateSuggestion(normalizedSubdomain.slice(0, 30))
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check database for existing subdomain
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('projects')
      .select('id, subdomain')
      .eq('subdomain', normalizedSubdomain)
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // If subdomain exists and belongs to a different project
    if (data && data.id !== projectId) {
      return new Response(
        JSON.stringify({ 
          available: false,
          reason: 'This subdomain is already taken',
          suggestion: generateSuggestion(normalizedSubdomain.slice(0, 30))
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Subdomain is available (or belongs to the same project)
    return new Response(
      JSON.stringify({ available: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-subdomain:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});