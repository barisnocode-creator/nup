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

// Set custom domain on Netlify site
async function setNetlifyCustomDomain(siteId: string, domain: string): Promise<boolean> {
  const NETLIFY_API_TOKEN = Deno.env.get('NETLIFY_API_TOKEN');
  if (!NETLIFY_API_TOKEN) {
    console.error('NETLIFY_API_TOKEN not configured');
    return false;
  }

  try {
    console.log(`Setting Netlify custom domain: ${domain} on site ${siteId}`);
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ custom_domain: domain }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Netlify custom domain error:', errText);
      return false;
    }

    console.log(`Netlify custom domain set successfully: ${domain}`);
    return true;
  } catch (err) {
    console.error('Netlify custom domain request failed:', err);
    return false;
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

    const userId = user.id;
    console.log('User authenticated:', userId);

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

    // Query DNS TXT record
    const txtHostname = `_lovable.${domainRecord.domain}`;
    const expectedValue = `lovable_verify=${domainRecord.verification_token}`;
    
    const txtRecords = await queryDnsTxt(txtHostname);
    const isVerified = txtRecords.some(record => record.trim() === expectedValue);

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    if (isVerified) {
      console.log(`Domain ${domainRecord.domain} verified successfully`);
      
      // Update domain status to verified
      await adminClient
        .from('custom_domains')
        .update({ 
          status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('id', domainId);

      // Update project's custom_domain field
      await adminClient
        .from('projects')
        .update({ custom_domain: domainRecord.domain })
        .eq('id', domainRecord.project_id);

      // If project has a Netlify site, set custom domain on Netlify
      const { data: project } = await adminClient
        .from('projects')
        .select('netlify_site_id')
        .eq('id', domainRecord.project_id)
        .single();

      let netlifyDomainSet = false;
      if (project?.netlify_site_id) {
        netlifyDomainSet = await setNetlifyCustomDomain(
          project.netlify_site_id, 
          domainRecord.domain
        );

        if (netlifyDomainSet) {
          await adminClient
            .from('projects')
            .update({ netlify_custom_domain: domainRecord.domain })
            .eq('id', domainRecord.project_id);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          status: 'verified',
          netlifyDomainSet,
          message: netlifyDomainSet 
            ? 'Domain doğrulandı ve Netlify\'a bağlandı! SSL sertifikası otomatik olarak sağlanacak.'
            : 'Domain doğrulandı! Sitenizi yayınladığınızda custom domain otomatik olarak bağlanacak.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
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
