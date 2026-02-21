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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    const { domainId } = await req.json();

    if (!domainId) {
      return new Response(
        JSON.stringify({ error: 'domainId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get domain record
    const { data: domainRecord, error: domainError } = await supabase
      .from('custom_domains')
      .select('id, domain, verification_token, status, project_id')
      .eq('id', domainId)
      .single();

    if (domainError || !domainRecord) {
      return new Response(
        JSON.stringify({ error: 'Domain not found or you do not have access' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying domain: ${domainRecord.domain}`);

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Update status to verifying
    await adminClient
      .from('custom_domains')
      .update({ status: 'verifying' })
      .eq('id', domainId);

    // DNS TXT verification
    const txtHostname = `_lovable.${domainRecord.domain}`;
    const expectedValue = `lovable_verify=${domainRecord.verification_token}`;
    const txtRecords = await queryDnsTxt(txtHostname);
    const isVerified = txtRecords.some(record => record.trim() === expectedValue);

    if (!isVerified) {
      console.log(`Domain ${domainRecord.domain} verification failed`);
      await adminClient
        .from('custom_domains')
        .update({ status: 'failed' })
        .eq('id', domainId);

      return new Response(
        JSON.stringify({
          success: false,
          status: 'failed',
          message: 'DNS doğrulama başarısız. Lütfen DNS kayıtlarınızı kontrol edin ve tekrar deneyin (propagasyon 48 saate kadar sürebilir).',
          expectedRecord: { host: txtHostname, value: expectedValue },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ---- DNS verified ----
    console.log(`Domain ${domainRecord.domain} verified successfully`);

    await adminClient
      .from('custom_domains')
      .update({ status: 'active', verified_at: new Date().toISOString() })
      .eq('id', domainId);

    await adminClient
      .from('projects')
      .update({ custom_domain: domainRecord.domain })
      .eq('id', domainRecord.project_id);

    return new Response(
      JSON.stringify({
        success: true,
        status: 'active',
        ssl_state: 'automatic',
        https_status: true,
        message: 'Domain doğrulandı ve SSL otomatik olarak aktif olacak! 🎉',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-domain:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
