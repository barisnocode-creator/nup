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

// ---------- Netlify helpers ----------

function getNetlifyToken(): string | null {
  return Deno.env.get('NETLIFY_API_TOKEN') ?? null;
}

async function netlifyGet(path: string, token: string) {
  const res = await fetch(`https://api.netlify.com/api/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { ok: res.ok, status: res.status, data: await res.json() };
}

async function netlifyPost(path: string, token: string, body: Record<string, unknown>) {
  const res = await fetch(`https://api.netlify.com/api/v1${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

/** Register domain on Netlify via domain_aliases if not already present. */
async function registerNetlifyDomain(siteId: string, domain: string, token: string) {
  console.log(`[Netlify] Checking existing domain aliases for site ${siteId}`);

  // Check if domain already exists
  const list = await netlifyGet(`/sites/${siteId}/domain_aliases`, token);
  if (list.ok && Array.isArray(list.data)) {
    const existing = list.data.find((d: any) => d.hostname === domain);
    if (existing) {
      console.log(`[Netlify] Domain ${domain} already registered (id: ${existing.id})`);
      return { success: true, alreadyExists: true, domainId: existing.id };
    }
  }

  // Also set custom_domain on site (required for apex domains)
  console.log(`[Netlify] Setting custom_domain on site ${siteId}`);
  const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ custom_domain: domain }),
  });
  if (!siteRes.ok) {
    const errText = await siteRes.text();
    console.error(`[Netlify] Failed to set custom_domain:`, errText);
  }

  // Add via domain_aliases
  console.log(`[Netlify] Adding domain alias: ${domain}`);
  const add = await netlifyPost(`/sites/${siteId}/domain_aliases`, token, { hostname: domain });
  if (!add.ok) {
    // 422 usually means already exists
    if (add.status === 422) {
      console.log(`[Netlify] Domain alias already exists (422)`);
      return { success: true, alreadyExists: true, domainId: null };
    }
    console.error(`[Netlify] Failed to add domain alias:`, add.data);
    return { success: false, error: typeof add.data === 'string' ? add.data : JSON.stringify(add.data) };
  }

  console.log(`[Netlify] Domain alias added successfully`);
  return { success: true, alreadyExists: false, domainId: add.data?.id ?? null };
}

/** Poll SSL certificate status with exponential backoff (5s, 15s, 60s). */
async function pollSslStatus(siteId: string, token: string): Promise<{ issued: boolean; state: string }> {
  const delays = [5000, 15000, 60000];
  for (const delay of delays) {
    console.log(`[SSL] Waiting ${delay / 1000}s before checking...`);
    await new Promise(r => setTimeout(r, delay));

    const ssl = await netlifyGet(`/sites/${siteId}/ssl`, token);
    if (ssl.ok && ssl.data) {
      const state = ssl.data.state ?? 'unknown';
      console.log(`[SSL] State: ${state}`);
      if (state === 'issued' || state === 'renewed') {
        return { issued: true, state };
      }
    }
  }
  return { issued: false, state: 'pending' };
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

    // ---- Netlify integration ----
    const { data: project } = await adminClient
      .from('projects')
      .select('netlify_site_id, is_published')
      .eq('id', domainRecord.project_id)
      .single();

    const NETLIFY_TOKEN = getNetlifyToken();
    let netlifyResult: any = { registered: false };
    let sslResult: any = { issued: false, state: 'skipped' };

    if (!project?.netlify_site_id) {
      console.log('[Netlify] No netlify_site_id — skipping domain registration');
      return new Response(
        JSON.stringify({
          success: true,
          status: 'verified',
          netlify_domain_registered: false,
          ssl_state: 'no_site',
          https_status: false,
          message: 'Domain doğrulandı! Sitenizi yayınladığınızda custom domain otomatik olarak bağlanacak.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!NETLIFY_TOKEN) {
      console.error('[Netlify] NETLIFY_API_TOKEN not configured');
      return new Response(
        JSON.stringify({
          success: true,
          status: 'verified',
          netlify_domain_registered: false,
          ssl_state: 'no_token',
          https_status: false,
          message: 'Domain doğrulandı ancak Netlify API token yapılandırılmamış.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Register domain on Netlify
    netlifyResult = await registerNetlifyDomain(project.netlify_site_id, domainRecord.domain, NETLIFY_TOKEN);

    if (!netlifyResult.success) {
      return new Response(
        JSON.stringify({
          success: true,
          status: 'verified',
          netlify_domain_registered: false,
          ssl_state: 'netlify_error',
          https_status: false,
          netlify_error: netlifyResult.error,
          message: 'Domain doğrulandı ancak Netlify\'a bağlanırken hata oluştu. Tekrar deneyin.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update DB with netlify custom domain
    await adminClient
      .from('projects')
      .update({ netlify_custom_domain: domainRecord.domain })
      .eq('id', domainRecord.project_id);

    // Step 2: Poll SSL status
    sslResult = await pollSslStatus(project.netlify_site_id, NETLIFY_TOKEN);

    if (sslResult.issued) {
      // Full success — mark domain as active
      await adminClient
        .from('custom_domains')
        .update({ status: 'active' })
        .eq('id', domainId);

      return new Response(
        JSON.stringify({
          success: true,
          status: 'active',
          netlify_domain_registered: true,
          netlify_domain_id: netlifyResult.domainId,
          ssl_state: sslResult.state,
          https_status: true,
          message: 'Domain doğrulandı, Netlify\'a bağlandı ve SSL sertifikası aktif! 🎉',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SSL not ready yet — keep as verified
    return new Response(
      JSON.stringify({
        success: true,
        status: 'verified',
        netlify_domain_registered: true,
        netlify_domain_id: netlifyResult.domainId,
        ssl_state: sslResult.state,
        https_status: false,
        message: 'Domain doğrulandı ve Netlify\'a bağlandı. SSL sertifikası işleniyor, birkaç dakika içinde aktif olacak.',
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
