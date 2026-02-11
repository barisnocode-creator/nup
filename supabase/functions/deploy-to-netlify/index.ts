import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChaiBlock {
  _id: string;
  _type: string;
  [key: string]: unknown;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2br(str: string): string {
  if (!str) return "";
  return escapeHtml(str).replace(/\n/g, "<br>");
}

// ── Block Renderers ──

function renderHeroCentered(b: ChaiBlock): string {
  const bg = b.backgroundImage as string || "";
  return `<section class="relative min-h-[80vh] flex items-center justify-center text-center text-white" style="background:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('${escapeHtml(bg)}') center/cover no-repeat">
  <div class="max-w-3xl mx-auto px-6 py-20">
    <h1 class="text-4xl md:text-5xl font-bold mb-4">${escapeHtml(b.title as string)}</h1>
    ${b.subtitle ? `<p class="text-lg md:text-xl opacity-90 mb-4">${escapeHtml(b.subtitle as string)}</p>` : ""}
    ${b.description ? `<p class="text-base opacity-80 mb-8 max-w-2xl mx-auto">${escapeHtml(b.description as string)}</p>` : ""}
    <div class="flex flex-wrap gap-4 justify-center">
      ${b.primaryButtonText ? `<a href="${escapeHtml(b.primaryButtonLink as string || '#')}" class="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition">${escapeHtml(b.primaryButtonText as string)}</a>` : ""}
      ${b.secondaryButtonText ? `<a href="${escapeHtml(b.secondaryButtonLink as string || '#')}" class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">${escapeHtml(b.secondaryButtonText as string)}</a>` : ""}
    </div>
  </div>
</section>`;
}

function renderStatisticsCounter(b: ChaiBlock): string {
  const stats: string[] = [];
  for (let i = 1; i <= 4; i++) {
    const val = b[`stat${i}Value`] as string;
    const label = b[`stat${i}Label`] as string;
    if (val && label) {
      stats.push(`<div class="text-center"><div class="text-3xl md:text-4xl font-bold text-indigo-600">${escapeHtml(val)}</div><div class="text-sm text-gray-600 mt-1">${escapeHtml(label)}</div></div>`);
    }
  }
  return `<section class="py-16 bg-gray-50">
  <div class="max-w-5xl mx-auto px-6">
    ${b.title ? `<h2 class="text-2xl font-bold text-center mb-8">${escapeHtml(b.title as string)}</h2>` : ""}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">${stats.join("")}</div>
  </div>
</section>`;
}

function renderAboutSection(b: ChaiBlock): string {
  const img = b.image as string || "";
  const features = (b.features as string || "").split("\n").filter(Boolean);
  const featuresHtml = features.map(f => `<li class="flex items-center gap-2"><span class="text-indigo-600">✓</span> ${escapeHtml(f)}</li>`).join("");
  const isRight = (b.imagePosition as string) === "right";

  return `<section id="about" class="py-20 bg-white">
  <div class="max-w-6xl mx-auto px-6">
    ${b.subtitle ? `<p class="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">${escapeHtml(b.subtitle as string)}</p>` : ""}
    <div class="grid md:grid-cols-2 gap-12 items-center ${isRight ? "" : ""}">
      <div class="${isRight ? "order-1" : "order-2 md:order-1"}">
        <h2 class="text-3xl font-bold mb-6">${escapeHtml(b.title as string)}</h2>
        <div class="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">${nl2br(b.description as string)}</div>
        ${featuresHtml ? `<ul class="space-y-2">${featuresHtml}</ul>` : ""}
      </div>
      <div class="${isRight ? "order-2" : "order-1 md:order-2"}">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(b.title as string)}" class="rounded-xl shadow-lg w-full object-cover aspect-[4/3]" />
      </div>
    </div>
  </div>
</section>`;
}

function renderServicesGrid(b: ChaiBlock): string {
  const services = (b.services as Array<{ title: string; description: string; image?: string; icon?: string }>) || [];
  const cards = services.map(s => `
    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      ${s.image ? `<img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.title)}" class="w-full h-48 object-cover" />` : ""}
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-2">${escapeHtml(s.title)}</h3>
        <p class="text-gray-600 text-sm">${escapeHtml(s.description)}</p>
      </div>
    </div>`).join("");

  return `<section id="services" class="py-20 bg-gray-50">
  <div class="max-w-6xl mx-auto px-6">
    ${b.sectionSubtitle ? `<p class="text-sm font-semibold text-indigo-600 uppercase tracking-wider text-center mb-2">${escapeHtml(b.sectionSubtitle as string)}</p>` : ""}
    ${b.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-4">${escapeHtml(b.sectionTitle as string)}</h2>` : ""}
    ${b.sectionDescription ? `<p class="text-gray-600 text-center max-w-2xl mx-auto mb-12">${escapeHtml(b.sectionDescription as string)}</p>` : ""}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderTestimonialsCarousel(b: ChaiBlock): string {
  const items = (b.testimonials as Array<{ name: string; role: string; content: string }>) || [];
  const cards = items.map(t => `
    <div class="bg-white rounded-xl p-6 shadow-md">
      <p class="text-gray-600 italic mb-4">"${escapeHtml(t.content)}"</p>
      <div class="font-semibold">${escapeHtml(t.name)}</div>
      <div class="text-sm text-gray-500">${escapeHtml(t.role)}</div>
    </div>`).join("");

  return `<section class="py-20 bg-white">
  <div class="max-w-6xl mx-auto px-6">
    ${b.sectionSubtitle ? `<p class="text-sm font-semibold text-indigo-600 uppercase tracking-wider text-center mb-2">${escapeHtml(b.sectionSubtitle as string)}</p>` : ""}
    ${b.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12">${escapeHtml(b.sectionTitle as string)}</h2>` : ""}
    <div class="grid md:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

function renderImageGallery(b: ChaiBlock): string {
  const images: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const img = b[`image${i}`] as string;
    if (img) images.push(img);
  }
  const cols = b.columns as string || "3";
  const gridCols = cols === "2" ? "md:grid-cols-2" : cols === "4" ? "md:grid-cols-4" : "md:grid-cols-3";
  const imgHtml = images.map(src => `<img src="${escapeHtml(src)}" alt="Galeri" class="rounded-lg w-full aspect-square object-cover hover:scale-105 transition duration-300" />`).join("");

  return `<section class="py-20 bg-gray-50">
  <div class="max-w-6xl mx-auto px-6">
    ${b.subtitle ? `<p class="text-sm font-semibold text-indigo-600 uppercase tracking-wider text-center mb-2">${escapeHtml(b.subtitle as string)}</p>` : ""}
    ${b.title ? `<h2 class="text-3xl font-bold text-center mb-12">${escapeHtml(b.title as string)}</h2>` : ""}
    <div class="grid grid-cols-2 ${gridCols} gap-4">${imgHtml}</div>
  </div>
</section>`;
}

function renderFAQAccordion(b: ChaiBlock): string {
  const items = (b.items as Array<{ question: string; answer: string }>) || [];
  const faqHtml = items.map((item, i) => `
    <details class="group border-b border-gray-200 py-4" ${i === 0 ? "open" : ""}>
      <summary class="flex justify-between items-center cursor-pointer font-medium text-gray-900 hover:text-indigo-600">
        ${escapeHtml(item.question)}
        <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </summary>
      <p class="mt-3 text-gray-600 leading-relaxed">${escapeHtml(item.answer)}</p>
    </details>`).join("");

  return `<section class="py-20 bg-white">
  <div class="max-w-3xl mx-auto px-6">
    ${b.sectionSubtitle ? `<p class="text-sm font-semibold text-indigo-600 uppercase tracking-wider text-center mb-2">${escapeHtml(b.sectionSubtitle as string)}</p>` : ""}
    ${b.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12">${escapeHtml(b.sectionTitle as string)}</h2>` : ""}
    <div>${faqHtml}</div>
  </div>
</section>`;
}

function renderContactForm(b: ChaiBlock): string {
  return `<section id="contact" class="py-20 bg-gray-50">
  <div class="max-w-6xl mx-auto px-6">
    ${b.sectionSubtitle ? `<p class="text-sm font-semibold text-indigo-600 uppercase tracking-wider text-center mb-2">${escapeHtml(b.sectionSubtitle as string)}</p>` : ""}
    ${b.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-4">${escapeHtml(b.sectionTitle as string)}</h2>` : ""}
    ${b.sectionDescription ? `<p class="text-gray-600 text-center max-w-2xl mx-auto mb-12">${escapeHtml(b.sectionDescription as string)}</p>` : ""}
    <div class="grid md:grid-cols-2 gap-12">
      <div class="space-y-6">
        ${b.phone ? `<div class="flex items-center gap-3"><span class="text-2xl">📞</span><div><div class="text-sm text-gray-500">Telefon</div><div class="font-medium">${escapeHtml(b.phone as string)}</div></div></div>` : ""}
        ${b.email ? `<div class="flex items-center gap-3"><span class="text-2xl">📧</span><div><div class="text-sm text-gray-500">E-posta</div><div class="font-medium">${escapeHtml(b.email as string)}</div></div></div>` : ""}
        ${b.address ? `<div class="flex items-center gap-3"><span class="text-2xl">📍</span><div><div class="text-sm text-gray-500">Adres</div><div class="font-medium">${escapeHtml(b.address as string)}</div></div></div>` : ""}
      </div>
      <form class="space-y-4" onsubmit="event.preventDefault();alert('Mesajınız alındı!')">
        <input type="text" placeholder="Adınız" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" required />
        <input type="email" placeholder="E-posta" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" required />
        <textarea placeholder="Mesajınız" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" required></textarea>
        <button type="submit" class="w-full px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">${escapeHtml((b.submitButtonText as string) || "Gönder")}</button>
      </form>
    </div>
  </div>
</section>`;
}

function renderCTABanner(b: ChaiBlock): string {
  const bg = b.backgroundImage as string || "";
  return `<section class="relative py-20 text-white text-center" style="background:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)),url('${escapeHtml(bg)}') center/cover no-repeat">
  <div class="max-w-3xl mx-auto px-6">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">${escapeHtml(b.title as string)}</h2>
    ${b.description ? `<p class="text-lg opacity-90 mb-8">${escapeHtml(b.description as string)}</p>` : ""}
    <div class="flex flex-wrap gap-4 justify-center">
      ${b.buttonText ? `<a href="${escapeHtml(b.buttonLink as string || '#')}" class="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition">${escapeHtml(b.buttonText as string)}</a>` : ""}
      ${b.secondaryButtonText ? `<a href="${escapeHtml(b.secondaryButtonLink as string || '#')}" class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">${escapeHtml(b.secondaryButtonText as string)}</a>` : ""}
    </div>
  </div>
</section>`;
}

function renderPricingTable(b: ChaiBlock): string {
  const plans = (b.plans as Array<{ name: string; price: string; period?: string; features?: string; buttonText?: string; highlighted?: boolean }>) || [];
  const cards = plans.map(p => {
    const features = (p.features || "").split("\n").filter(Boolean);
    const featList = features.map(f => `<li class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span>${escapeHtml(f)}</li>`).join("");
    return `<div class="bg-white rounded-xl p-8 shadow-md ${p.highlighted ? 'ring-2 ring-indigo-600' : ''}">
      <h3 class="text-xl font-bold mb-2">${escapeHtml(p.name)}</h3>
      <div class="text-3xl font-bold text-indigo-600 mb-1">${escapeHtml(p.price)}</div>
      ${p.period ? `<div class="text-sm text-gray-500 mb-6">${escapeHtml(p.period)}</div>` : '<div class="mb-6"></div>'}
      <ul class="space-y-1 mb-8 text-sm">${featList}</ul>
      <a href="#contact" class="block text-center px-6 py-3 ${p.highlighted ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg font-semibold hover:opacity-90 transition">${escapeHtml(p.buttonText || 'Seç')}</a>
    </div>`;
  }).join("");

  return `<section class="py-20 bg-gray-50">
  <div class="max-w-6xl mx-auto px-6">
    ${b.sectionTitle ? `<h2 class="text-3xl font-bold text-center mb-12">${escapeHtml(b.sectionTitle as string)}</h2>` : ""}
    <div class="grid md:grid-cols-3 gap-8">${cards}</div>
  </div>
</section>`;
}

// ── Main renderer ──

function renderBlock(block: ChaiBlock): string {
  switch (block._type) {
    case "HeroCentered":
    case "HeroOverlay":
    case "HeroSplit":
      return renderHeroCentered(block);
    case "StatisticsCounter":
      return renderStatisticsCounter(block);
    case "AboutSection":
      return renderAboutSection(block);
    case "ServicesGrid":
      return renderServicesGrid(block);
    case "TestimonialsCarousel":
      return renderTestimonialsCarousel(block);
    case "ImageGallery":
      return renderImageGallery(block);
    case "FAQAccordion":
      return renderFAQAccordion(block);
    case "ContactForm":
      return renderContactForm(block);
    case "CTABanner":
      return renderCTABanner(block);
    case "PricingTable":
      return renderPricingTable(block);
    default:
      // Fallback: try to render any text content
      const text = (block.title as string) || (block.content as string) || "";
      if (text) return `<section class="py-12"><div class="max-w-4xl mx-auto px-6"><p>${escapeHtml(text)}</p></div></section>`;
      return "";
  }
}

function blocksToHtml(blocks: ChaiBlock[], theme: Record<string, unknown>, projectName: string): string {
  const primaryColor = (theme?.primaryColor as string) || "#4f46e5";
  const fontFamily = (theme?.fontFamily as string) || "'Inter', sans-serif";
  const bodyBg = (theme?.bodyBg as string) || "#ffffff";
  const bodyText = (theme?.bodyText as string) || "#1f2937";

  let sectionsHtml = blocks.map(b => renderBlock(b)).filter(Boolean).join("\n");

  if (!sectionsHtml.trim()) {
    sectionsHtml = `<section class="min-h-screen flex items-center justify-center"><div class="text-center"><h1 class="text-4xl font-bold">${escapeHtml(projectName)}</h1><p class="mt-4 text-gray-600">Website coming soon</p></div></section>`;
  }

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(projectName)}</title>
  <meta name="description" content="${escapeHtml(projectName)} - Professional Website">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root { --primary: ${primaryColor}; }
    body { font-family: ${fontFamily}; background-color: ${bodyBg}; color: ${bodyText}; margin: 0; padding: 0; }
    img { max-width: 100%; height: auto; }
    html { scroll-behavior: smooth; }
  </style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;
}

// ── Deploy payload ──

async function createDeployPayload(htmlContent: string): Promise<{ sha1: string; content: Uint8Array }> {
  const encoder = new TextEncoder();
  const content = encoder.encode(htmlContent);
  const hashBuffer = await crypto.subtle.digest("SHA-1", content);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const sha1 = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return { sha1, content };
}

// ── Main handler ──

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NETLIFY_API_TOKEN = Deno.env.get("NETLIFY_API_TOKEN");
    if (!NETLIFY_API_TOKEN) {
      return new Response(
        JSON.stringify({ error: "Netlify API token is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const supabaseUser = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader || "" } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { projectId } = await req.json();
    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "projectId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: "Project not found or access denied" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const chaiBlocks = (project.chai_blocks as ChaiBlock[]) || [];
    const chaiTheme = (project.chai_theme as Record<string, unknown>) || {};

    const html = blocksToHtml(chaiBlocks, chaiTheme, project.name);
    const { sha1, content } = await createDeployPayload(html);

    let netlifySiteId = project.netlify_site_id;

    // Create site if needed
    if (!netlifySiteId) {
      const createRes = await fetch("https://api.netlify.com/api/v1/sites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `openlucius-${project.subdomain || projectId.slice(0, 8)}`,
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error("Netlify create site error:", errText);
        return new Response(
          JSON.stringify({ error: "Failed to create Netlify site", details: errText }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const siteData = await createRes.json();
      netlifySiteId = siteData.id;

      await supabaseAdmin
        .from("projects")
        .update({ netlify_site_id: netlifySiteId, netlify_url: siteData.ssl_url || siteData.url })
        .eq("id", projectId);
    }

    // Deploy
    const deployRes = await fetch(
      `https://api.netlify.com/api/v1/sites/${netlifySiteId}/deploys`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: { "/index.html": sha1 } }),
      }
    );

    if (!deployRes.ok) {
      const errText = await deployRes.text();
      console.error("Netlify deploy error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to deploy to Netlify", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const deployData = await deployRes.json();
    const deployId = deployData.id;

    // Upload file
    const uploadRes = await fetch(
      `https://api.netlify.com/api/v1/deploys/${deployId}/files/index.html`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
        body: content,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Netlify file upload error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to upload file to Netlify", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get final URL
    const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${netlifySiteId}`, {
      headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` },
    });
    const siteInfo = await siteRes.json();
    const netlifyUrl = siteInfo.ssl_url || siteInfo.url;

    // Check for verified custom domain
    const { data: verifiedDomain } = await supabaseAdmin
      .from("custom_domains")
      .select("domain")
      .eq("project_id", projectId)
      .eq("status", "verified")
      .limit(1)
      .single();

    let netlifyCustomDomain = project.netlify_custom_domain;

    if (verifiedDomain?.domain && !netlifyCustomDomain) {
      try {
        const domainRes = await fetch(
          `https://api.netlify.com/api/v1/sites/${netlifySiteId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ custom_domain: verifiedDomain.domain }),
          }
        );
        if (domainRes.ok) {
          netlifyCustomDomain = verifiedDomain.domain;
        }
      } catch (e) {
        console.error("Custom domain error:", e);
      }
    }

    // Update project
    await supabaseAdmin
      .from("projects")
      .update({
        netlify_url: netlifyUrl,
        netlify_custom_domain: netlifyCustomDomain,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return new Response(
      JSON.stringify({
        success: true,
        netlifyUrl,
        netlifyCustomDomain,
        siteId: netlifySiteId,
        deployId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Deploy error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
