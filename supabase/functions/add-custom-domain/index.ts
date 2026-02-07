import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Reserved domains that cannot be used
const RESERVED_DOMAINS = [
  'localhost',
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'lovable.app',
  'lovable.dev',
  'supabase.co',
  'supabase.com',
];

// Validate domain format
function isValidDomain(domain: string): { valid: boolean; reason?: string } {
  // Remove protocol if present
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  
  if (cleanDomain.length < 4) {
    return { valid: false, reason: 'Domain must be at least 4 characters (e.g., a.co)' };
  }
  
  if (cleanDomain.length > 253) {
    return { valid: false, reason: 'Domain must be less than 253 characters' };
  }
  
  // Only lowercase letters, numbers, hyphens, and dots
  if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(cleanDomain)) {
    return { valid: false, reason: 'Domain can only contain lowercase letters, numbers, hyphens, and dots' };
  }
  
  // Must have at least one dot (TLD required)
  if (!cleanDomain.includes('.')) {
    return { valid: false, reason: 'Domain must include a TLD (e.g., .com, .net)' };
  }
  
  // Cannot have consecutive dots or hyphens
  if (/\.\./.test(cleanDomain) || /--/.test(cleanDomain)) {
    return { valid: false, reason: 'Domain cannot have consecutive dots or hyphens' };
  }
  
  // Cannot start or end with hyphen or dot
  if (/^[.-]|[.-]$/.test(cleanDomain)) {
    return { valid: false, reason: 'Domain cannot start or end with a hyphen or dot' };
  }
  
  // Check reserved domains
  const baseDomain = cleanDomain.replace(/^www\./, '');
  if (RESERVED_DOMAINS.some(reserved => baseDomain === reserved || baseDomain.endsWith('.' + reserved))) {
    return { valid: false, reason: 'This domain is reserved and cannot be used' };
  }
  
  return { valid: true };
}

// Normalize domain (remove www prefix for storage, keep for display)
function normalizeDomain(domain: string): string {
  return domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's token
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.log('JWT verification failed:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('User authenticated:', userId);

    // Parse request body
    const { projectId, domain } = await req.json();

    if (!projectId || !domain) {
      return new Response(
        JSON.stringify({ error: 'projectId and domain are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize and validate domain
    const normalizedDomain = normalizeDomain(domain);
    const validation = isValidDomain(normalizedDomain);
    
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.reason }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      console.log('Project not found:', projectError);
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (project.user_id !== userId) {
      console.log('User does not own project');
      return new Response(
        JSON.stringify({ error: 'You do not have permission to add domains to this project' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if domain already exists (for any project)
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    
    const { data: existingDomain } = await adminClient
      .from('custom_domains')
      .select('id, project_id, status')
      .eq('domain', normalizedDomain)
      .maybeSingle();

    if (existingDomain) {
      if (existingDomain.project_id === projectId) {
        return new Response(
          JSON.stringify({ error: 'This domain is already added to your project' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ error: 'This domain is already registered to another project' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Insert domain (verification_token is auto-generated by database)
    const { data: newDomain, error: insertError } = await supabase
      .from('custom_domains')
      .insert({
        project_id: projectId,
        domain: normalizedDomain,
        status: 'pending',
        is_primary: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to insert domain:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to add domain' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Domain added successfully:', newDomain.id);

    // Return success without exposing verification token
    // Client should use get_domain_dns_instructions RPC to retrieve DNS setup details securely
    return new Response(
      JSON.stringify({
        success: true,
        domainId: newDomain.id,
        domain: normalizedDomain,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in add-custom-domain:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

