import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { domainId } = await req.json();

    if (!domainId) {
      return new Response(
        JSON.stringify({ error: 'domainId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // First, get the domain to find the project_id (RLS ensures user owns it)
    const { data: domainRecord, error: fetchError } = await supabase
      .from('custom_domains')
      .select('id, domain, project_id')
      .eq('id', domainId)
      .single();

    if (fetchError || !domainRecord) {
      console.log('Domain not found or access denied:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Domain not found or you do not have access' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Removing domain: ${domainRecord.domain}`);

    // Delete the domain (RLS policy ensures user can only delete their own)
    const { error: deleteError } = await supabase
      .from('custom_domains')
      .delete()
      .eq('id', domainId);

    if (deleteError) {
      console.error('Failed to delete domain:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Failed to remove domain' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clear the custom_domain field from the project if this was the active domain
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    
    const { data: project } = await adminClient
      .from('projects')
      .select('custom_domain')
      .eq('id', domainRecord.project_id)
      .single();

    if (project?.custom_domain === domainRecord.domain) {
      await adminClient
        .from('projects')
        .update({ custom_domain: null })
        .eq('id', domainRecord.project_id);
      
      console.log('Cleared custom_domain from project');
    }

    console.log(`Domain ${domainRecord.domain} removed successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Domain removed successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in remove-domain:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
