import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DnsRecord {
  type: string;
  host: string;
  value: string;
  ttl?: number;
}

interface DryRunResult {
  provider: string;
  existing_records: DnsRecord[];
  conflicts: { record: DnsRecord; reason: string }[];
  planned_changes: DnsRecord[];
  warnings: string[];
}

interface ApplyResult {
  domain: string;
  txt_status: string;
  a_status: string;
  change_log: { action: string; record: DnsRecord; status: string; error?: string }[];
  dns_snapshot_id: string;
  domainId: string;
}

// ─── Namecheap API ──────────────────────────────────────────────────
async function namecheapGetHosts(domain: string, apiKey: string, apiUser: string): Promise<DnsRecord[]> {
  const parts = domain.split('.');
  const sld = parts.slice(0, -1).join('.');
  const tld = parts[parts.length - 1];

  const url = `https://api.namecheap.com/xml.response?ApiUser=${encodeURIComponent(apiUser)}&ApiKey=${encodeURIComponent(apiKey)}&UserName=${encodeURIComponent(apiUser)}&Command=namecheap.domains.dns.getHosts&ClientIp=0.0.0.0&SLD=${encodeURIComponent(sld)}&TLD=${encodeURIComponent(tld)}`;

  const res = await fetch(url);
  const text = await res.text();

  if (text.includes('<Errors>') && text.includes('<Error')) {
    const errMatch = text.match(/<Error[^>]*>([^<]+)<\/Error>/);
    throw new Error(`Namecheap API error: ${errMatch?.[1] || 'Unknown error'}`);
  }

  const records: DnsRecord[] = [];
  const hostRegex = /<host\s+([^>]+)\/>/gi;
  let match;
  while ((match = hostRegex.exec(text)) !== null) {
    const attrs = match[1];
    const getAttr = (name: string) => {
      const m = attrs.match(new RegExp(`${name}="([^"]*)"`, 'i'));
      return m ? m[1] : '';
    };
    records.push({
      type: getAttr('Type'),
      host: getAttr('Name'),
      value: getAttr('Address'),
      ttl: parseInt(getAttr('TTL')) || 1800,
    });
  }
  return records;
}

async function namecheapSetHosts(domain: string, apiKey: string, apiUser: string, records: DnsRecord[]): Promise<void> {
  const parts = domain.split('.');
  const sld = parts.slice(0, -1).join('.');
  const tld = parts[parts.length - 1];

  let url = `https://api.namecheap.com/xml.response?ApiUser=${encodeURIComponent(apiUser)}&ApiKey=${encodeURIComponent(apiKey)}&UserName=${encodeURIComponent(apiUser)}&Command=namecheap.domains.dns.setHosts&ClientIp=0.0.0.0&SLD=${encodeURIComponent(sld)}&TLD=${encodeURIComponent(tld)}`;

  records.forEach((r, i) => {
    const n = i + 1;
    url += `&HostName${n}=${encodeURIComponent(r.host)}&RecordType${n}=${encodeURIComponent(r.type)}&Address${n}=${encodeURIComponent(r.value)}&TTL${n}=${r.ttl || 1800}`;
  });

  const res = await fetch(url);
  const text = await res.text();

  if (text.includes('<Errors>') && text.includes('<Error')) {
    const errMatch = text.match(/<Error[^>]*>([^<]+)<\/Error>/);
    throw new Error(`Namecheap setHosts error: ${errMatch?.[1] || 'Unknown error'}`);
  }
}

// ─── GoDaddy API ────────────────────────────────────────────────────
async function godaddyGetRecords(domain: string, apiKey: string, apiSecret: string): Promise<DnsRecord[]> {
  const res = await fetch(`https://api.godaddy.com/v1/domains/${encodeURIComponent(domain)}/records`, {
    headers: { Authorization: `sso-key ${apiKey}:${apiSecret}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GoDaddy API error (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.map((r: any) => ({ type: r.type, host: r.name, value: r.data, ttl: r.ttl }));
}

async function godaddyPatchRecords(domain: string, apiKey: string, apiSecret: string, records: DnsRecord[]): Promise<{ record: DnsRecord; status: string; error?: string }[]> {
  const log: { record: DnsRecord; status: string; error?: string }[] = [];
  for (const r of records) {
    try {
      const res = await fetch(
        `https://api.godaddy.com/v1/domains/${encodeURIComponent(domain)}/records/${r.type}/${encodeURIComponent(r.host)}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `sso-key ${apiKey}:${apiSecret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{ data: r.value, ttl: r.ttl || 3600 }]),
        }
      );
      if (!res.ok) {
        const body = await res.text();
        log.push({ record: r, status: 'failed', error: body });
      } else {
        log.push({ record: r, status: 'applied' });
      }
    } catch (err: any) {
      log.push({ record: r, status: 'failed', error: err.message });
    }
  }
  return log;
}

// ─── Cloudflare API ─────────────────────────────────────────────────
async function cloudflareGetZoneId(domain: string, apiToken: string): Promise<string> {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${encodeURIComponent(domain)}`, {
    headers: { Authorization: `Bearer ${apiToken}` },
  });
  const data = await res.json();
  if (!data.success || !data.result?.length) {
    throw new Error(`Cloudflare: Zone not found for ${domain}. Make sure domain is added to your Cloudflare account.`);
  }
  return data.result[0].id;
}

async function cloudflareGetRecords(zoneId: string, apiToken: string): Promise<DnsRecord[]> {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?per_page=100`, {
    headers: { Authorization: `Bearer ${apiToken}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error('Cloudflare: Failed to fetch DNS records');
  return data.result.map((r: any) => ({ type: r.type, host: r.name, value: r.content, ttl: r.ttl }));
}

async function cloudflareCreateRecords(zoneId: string, apiToken: string, domain: string, records: DnsRecord[]): Promise<{ record: DnsRecord; status: string; error?: string }[]> {
  const log: { record: DnsRecord; status: string; error?: string }[] = [];
  for (const r of records) {
    try {
      // Cloudflare wants full name e.g. _lovable.example.com
      const name = r.host === '@' ? domain : (r.host.includes('.') ? r.host : `${r.host}.${domain}`);
      const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: r.type, name, content: r.value, ttl: r.ttl || 3600, proxied: false }),
      });
      const data = await res.json();
      if (!data.success) {
        log.push({ record: r, status: 'failed', error: JSON.stringify(data.errors) });
      } else {
        log.push({ record: r, status: 'applied' });
      }
    } catch (err: any) {
      log.push({ record: r, status: 'failed', error: err.message });
    }
  }
  return log;
}

// ─── Conflict detection ─────────────────────────────────────────────
function detectConflicts(existing: DnsRecord[], planned: DnsRecord[], domain: string): { record: DnsRecord; reason: string }[] {
  const conflicts: { record: DnsRecord; reason: string }[] = [];
  for (const p of planned) {
    for (const e of existing) {
      const eHost = e.host === domain ? '@' : e.host.replace(`.${domain}`, '');
      if (eHost === p.host && e.type === p.type && e.value !== p.value) {
        conflicts.push({ record: e, reason: `Existing ${e.type} record for "${eHost}" with different value: ${e.value}` });
      }
    }
  }
  return conflicts;
}

// ─── Main handler ───────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userId = claimsData.claims.sub as string;

    const body = await req.json();
    const { projectId, domain, provider, credentials, dry_run = true, domainId } = body;

    if (!projectId || !domain || !provider || !credentials) {
      return new Response(JSON.stringify({ error: 'Missing required fields: projectId, domain, provider, credentials' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id')
      .eq('id', projectId)
      .single();

    if (projectError || !project || project.user_id !== userId) {
      return new Response(JSON.stringify({ error: 'Project not found or access denied' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const normalizedDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    // Build planned records
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // If we have a domainId, get verification token from DB; otherwise we'll create the domain after dry-run
    let verificationToken = '';
    if (domainId) {
      const { data: domainRecord } = await adminClient
        .from('custom_domains')
        .select('verification_token, project_id')
        .eq('id', domainId)
        .single();
      if (!domainRecord || domainRecord.project_id !== projectId) {
        return new Response(JSON.stringify({ error: 'Domain not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      verificationToken = domainRecord.verification_token;
    }

    const plannedRecords: DnsRecord[] = [
      { type: 'A', host: '@', value: '75.2.60.5', ttl: 3600 },
      { type: 'A', host: 'www', value: '75.2.60.5', ttl: 3600 },
    ];
    if (verificationToken) {
      plannedRecords.push({ type: 'TXT', host: '_lovable', value: `lovable_verify=${verificationToken}`, ttl: 3600 });
    }

    // ─── Fetch existing records ───
    let existingRecords: DnsRecord[] = [];
    const warnings: string[] = [];
    let cloudflareZoneId = '';

    try {
      if (provider === 'namecheap') {
        existingRecords = await namecheapGetHosts(normalizedDomain, credentials.apiKey, credentials.apiUser);
        warnings.push('Namecheap API erişimi için hesabınızda API erişiminin açık olması ve IP beyaz listesinin ayarlanması gerekir.');
      } else if (provider === 'godaddy') {
        existingRecords = await godaddyGetRecords(normalizedDomain, credentials.apiKey, credentials.apiSecret);
        warnings.push('GoDaddy Production API Key kullandığınızdan emin olun (Test key çalışmaz).');
      } else if (provider === 'cloudflare') {
        cloudflareZoneId = await cloudflareGetZoneId(normalizedDomain, credentials.apiToken);
        existingRecords = await cloudflareGetRecords(cloudflareZoneId, credentials.apiToken);
      } else {
        return new Response(JSON.stringify({ error: 'Unsupported provider. Use: namecheap, godaddy, cloudflare' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    } catch (err: any) {
      console.error(`Provider API error (${provider}):`, err.message);
      return new Response(JSON.stringify({ error: `DNS sağlayıcı API hatası: ${err.message}` }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const conflicts = detectConflicts(existingRecords, plannedRecords, normalizedDomain);

    // ─── DRY RUN ───
    if (dry_run) {
      const result: DryRunResult = {
        provider,
        existing_records: existingRecords,
        conflicts,
        planned_changes: plannedRecords,
        warnings,
      };
      return new Response(JSON.stringify({ success: true, dry_run: true, ...result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── APPLY (Stage 2) ───
    // Idempotency check
    const fingerprint = `${normalizedDomain}:${verificationToken}:${provider}`;
    const { data: existingAction } = await adminClient
      .from('custom_domains')
      .select('id, action_fingerprint, auto_configured')
      .eq('action_fingerprint', fingerprint)
      .eq('auto_configured', true)
      .maybeSingle();

    if (existingAction) {
      return new Response(JSON.stringify({ success: true, cached: true, domainId: existingAction.id, message: 'Bu işlem daha önce başarıyla tamamlandı.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Save snapshot to domain record
    if (domainId) {
      await adminClient
        .from('custom_domains')
        .update({
          dns_snapshot: { records: existingRecords, timestamp: new Date().toISOString() },
          dns_provider: provider,
        })
        .eq('id', domainId);
    }

    // Apply records
    const changeLog: { action: string; record: DnsRecord; status: string; error?: string }[] = [];
    let txtStatus = 'pending';
    let aStatus = 'pending';

    try {
      if (provider === 'namecheap') {
        // Namecheap: merge existing + new, then setHosts
        const mergedRecords = [...existingRecords];
        for (const p of plannedRecords) {
          const existingIdx = mergedRecords.findIndex(
            (e) => e.host === p.host && e.type === p.type
          );
          if (existingIdx >= 0) {
            mergedRecords[existingIdx] = p;
            changeLog.push({ action: 'update', record: p, status: 'pending' });
          } else {
            mergedRecords.push(p);
            changeLog.push({ action: 'create', record: p, status: 'pending' });
          }
        }
        await namecheapSetHosts(normalizedDomain, credentials.apiKey, credentials.apiUser, mergedRecords);
        changeLog.forEach((c) => (c.status = 'applied'));
        txtStatus = 'applied';
        aStatus = 'applied';
      } else if (provider === 'godaddy') {
        const results = await godaddyPatchRecords(normalizedDomain, credentials.apiKey, credentials.apiSecret, plannedRecords);
        results.forEach((r) => changeLog.push({ action: 'create', ...r }));
        txtStatus = results.find((r) => r.record.type === 'TXT')?.status || 'skipped';
        aStatus = results.find((r) => r.record.type === 'A' && r.record.host === '@')?.status || 'skipped';
      } else if (provider === 'cloudflare') {
        const results = await cloudflareCreateRecords(cloudflareZoneId, credentials.apiToken, normalizedDomain, plannedRecords);
        results.forEach((r) => changeLog.push({ action: 'create', ...r }));
        txtStatus = results.find((r) => r.record.type === 'TXT')?.status || 'skipped';
        aStatus = results.find((r) => r.record.type === 'A' && r.record.host === '@')?.status || 'skipped';
      }
    } catch (err: any) {
      console.error('DNS apply error:', err.message);
      // Attempt rollback for Namecheap (restore snapshot)
      if (provider === 'namecheap' && existingRecords.length > 0) {
        try {
          await namecheapSetHosts(normalizedDomain, credentials.apiKey, credentials.apiUser, existingRecords);
          return new Response(JSON.stringify({
            success: false,
            error: `DNS kayıtları uygulanırken hata oluştu: ${err.message}. Otomatik geri alma (rollback) yapıldı.`,
            rollback: 'success',
            change_log: changeLog,
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        } catch {
          // Rollback also failed
        }
      }
      return new Response(JSON.stringify({
        success: false,
        error: `DNS kayıtları uygulanırken hata oluştu: ${err.message}`,
        rollback: 'not_attempted',
        change_log: changeLog,
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Check for partial failure
    const anyFailed = changeLog.some((c) => c.status === 'failed');
    if (anyFailed && provider === 'namecheap' && existingRecords.length > 0) {
      // Rollback
      try {
        await namecheapSetHosts(normalizedDomain, credentials.apiKey, credentials.apiUser, existingRecords);
      } catch { /* best effort */ }
    }

    // Mark domain as auto-configured
    if (domainId) {
      await adminClient
        .from('custom_domains')
        .update({
          auto_configured: true,
          action_fingerprint: fingerprint,
        })
        .eq('id', domainId);
    }

    const result: ApplyResult = {
      domain: normalizedDomain,
      txt_status: txtStatus,
      a_status: aStatus,
      change_log: changeLog,
      dns_snapshot_id: domainId || '',
      domainId: domainId || '',
    };

    return new Response(JSON.stringify({ success: !anyFailed, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in auto-configure-dns:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
