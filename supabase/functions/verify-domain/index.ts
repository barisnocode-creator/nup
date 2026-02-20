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

// ---------- Vercel helpers ----------

function getVercelToken(): string | null {
  return Deno.env.get('VERCEL_API_TOKEN') ?? null;
}

function getVercelTeamId(): string | null {
  return Deno.env.get('VERCEL_TEAM_ID') ?? null;
}

/** Register domain on Vercel project. SSL is automatic on Vercel. */
async function registerVercelDomain(vercelProjectId: string, domain: string, token: string) {
  console.log(`[Vercel] Adding domain ${domain} to project ${vercelProjectId}`);

  const teamId = getVercelTeamId();
  const endpoint = teamId
    ? `https://api.vercel.com/v9/projects/${vercelProjectId}/domains?teamId=${teamId}`
    : `https://api.vercel.com/v9/projects/${vercelProjectId}/domains`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: domain }),
  });

  const data = await res.json();

  if (!res.ok) {
    // domain_already_exists means it's already registered — treat as success
    if (data.error?.code === 'domain_already_exists' || data.error?.code === 'domain_conflict') {
      console.log(`[Vercel] Domain ${domain} already registered`);
      return { success: true, alreadyExists: true };
    }
    console.error(`[Vercel] Failed to add domain:`, data);
    return { success: false, error: JSON.stringify(data) };
  }

  console.log(`[Vercel] Domain registered successfully`);
  return { success: true, alreadyExists: false };
}

// ---------- Main handler ----------

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

    const { domainId, allow_publish } = await req.json();

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
      .update({ status: 'verified', verified_at: new Date().toISOString() })
      .eq('id', domainId);

    await adminClient
      .from('projects')
      .update({ custom_domain: domainRecord.domain })
      .eq('id', domainRecord.project_id);

    // ---- Vercel integration ----
    const { data: project } = await adminClient
      .from('projects')
      .select('vercel_project_id, is_published')
      .eq('id', domainRecord.project_id)
      .single();

    const vercelToken = getVercelToken();

    if (project?.vercel_project_id && vercelToken) {
      const vercelResult = await registerVercelDomain(project.vercel_project_id, domainRecord.domain, vercelToken);
      if (vercelResult.success) {
        // Mark domain as active — Vercel handles SSL automatically
        await adminClient
          .from('custom_domains')
          .update({ status: 'active' })
          .eq('id', domainId);

        return new Response(
          JSON.stringify({
            success: true,
            status: 'active',
            vercel_domain_registered: true,
            ssl_state: 'automatic',
            https_status: true,
            message: 'Domain doğrulandı ve Vercel\'e bağlandı! SSL otomatik olarak aktif olacak. 🎉',
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.error('[Vercel] Domain registration failed:', vercelResult.error);
      }
    }

    // No Vercel project yet or domain registration failed — domain is verified, will be attached on next deploy
    return new Response(
      JSON.stringify({
        success: true,
        status: 'verified',
        vercel_domain_registered: false,
        ssl_state: 'pending',
        https_status: false,
        message: 'Domain doğrulandı! Sitenizi yayınladığınızda custom domain otomatik olarak bağlanacak.',
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
