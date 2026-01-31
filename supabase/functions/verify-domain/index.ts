import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Query DNS TXT records using Deno's native API
async function queryDnsTxt(hostname: string): Promise<string[]> {
  try {
    console.log(`Querying DNS TXT records for: ${hostname}`);
    const records = await Deno.resolveDns(hostname, 'TXT');
    // Flatten and join the records (TXT records can be arrays of strings)
    const flatRecords = records.map(record => 
      Array.isArray(record) ? record.join('') : record
    );
    console.log(`Found TXT records:`, flatRecords);
    return flatRecords;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`DNS query failed for ${hostname}:`, errorMessage);
    return [];
  }
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
    const { domainId } = await req.json();

    if (!domainId) {
      return new Response(
        JSON.stringify({ error: 'domainId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get domain record (RLS ensures user owns the project)
    const { data: domainRecord, error: domainError } = await supabase
      .from('custom_domains')
      .select('id, domain, verification_token, status, project_id')
      .eq('id', domainId)
      .single();

    if (domainError || !domainRecord) {
      console.log('Domain not found or access denied:', domainError);
      return new Response(
        JSON.stringify({ error: 'Domain not found or you do not have access' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying domain: ${domainRecord.domain}`);

    // Update status to verifying
    await supabase
      .from('custom_domains')
      .update({ status: 'verifying' })
      .eq('id', domainId);

    // Query DNS TXT record at _lovable.domain.com
    const txtHostname = `_lovable.${domainRecord.domain}`;
    const expectedValue = `lovable_verify=${domainRecord.verification_token}`;
    
    const txtRecords = await queryDnsTxt(txtHostname);
    const isVerified = txtRecords.some(record => record.trim() === expectedValue);

    // Use service role to update status (bypass RLS for status update)
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    if (isVerified) {
      console.log(`Domain ${domainRecord.domain} verified successfully`);
      
      // Update domain status to verified
      const { error: updateError } = await adminClient
        .from('custom_domains')
        .update({ 
          status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('id', domainId);

      if (updateError) {
        console.error('Failed to update domain status:', updateError);
      }

      // Also update the project's custom_domain field
      await adminClient
        .from('projects')
        .update({ custom_domain: domainRecord.domain })
        .eq('id', domainRecord.project_id);

      return new Response(
        JSON.stringify({
          success: true,
          status: 'verified',
          message: 'Domain verified successfully! Your custom domain is now active.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log(`Domain ${domainRecord.domain} verification failed`);
      
      // Update domain status to failed
      await adminClient
        .from('custom_domains')
        .update({ status: 'failed' })
        .eq('id', domainId);

      return new Response(
        JSON.stringify({
          success: false,
          status: 'failed',
          message: 'DNS verification failed. Please ensure you have added the TXT record correctly and wait for DNS propagation (can take up to 48 hours).',
          expectedRecord: {
            host: txtHostname,
            value: expectedValue
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in verify-domain:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
